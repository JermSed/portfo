'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { initialBlocks, constrain, overlaps, snapBlock, edges, outline, hasStuds } from '../lib/block-play.mjs';

import { createPhysics, connectionsFor } from '../lib/block-physics.mjs';

export default function HeroTerrain() {
  const artworkId = useId();
  const physics = useRef(null);
  const svg = useRef(null);
  const gesture = useRef(null);
  const [blocks, setBlocks] = useState(initialBlocks);
  const world = useRef(initialBlocks);
  const links = useRef([['blue', 'cream'], ['sage', 'rose']]);
  const [moon, setMoon] = useState(false);
  const [challenge, setChallenge] = useState(0);
  const serial = useRef(0);
  const prompts = ['Build a house or a rocket.', 'Make a very strange robot.', 'Build a bridge to nowhere.', 'How tall can you go?', 'Make something that makes no sense.'];
  const [paused, setPaused] = useState(false);
  const commit = next => { world.current = next; setBlocks(next); };
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    setPaused(media.matches);
    const change = () => setPaused(media.matches);
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    if (paused) return;
    if (!physics.current) physics.current = createPhysics();
    let frame, last = 0, accumulated = 0, visible = false;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; last = 0; });
    observer.observe(svg.current);
    const tick = time => {
      if (visible && !document.hidden) {
        accumulated += last ? Math.min((time-last)/1000, .05) : 0;
        while (accumulated >= 1/120) {
          world.current = physics.current.step(world.current, links.current, gesture.current?.id, 1/120, moon ? 180 : 1100);
          accumulated -= 1/120;
        }
        setBlocks(world.current);
      }
      last = visible && !document.hidden ? time : 0;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [paused, moon]);
  const [active, setActive] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const point = event => {
    const p = new DOMPoint(event.clientX, event.clientY);
    return p.matrixTransform(svg.current.getScreenCTM().inverse());
  };
  const start = (event, block) => {
    if (event.button !== 0 || gesture.current) return;
    block = world.current.find(b => b.id === block.id);
    links.current = links.current.filter(pair => !pair.includes(block.id));
    const p = point(event);
    gesture.current = { id: block.id, pointer: event.pointerId, dx: p.x - block.x, dy: p.y - block.y, original: block, current: block, time: performance.now(), vx: 0, vy: 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
    setActive(block.id);
    setMessage('');
  };
  const move = event => {
    const g = gesture.current;
    if (!g || g.pointer !== event.pointerId) return;
    const p = point(event);
    const next = constrain({ ...g.original, omega: 0, vx: 0, vy: 0, x: p.x - g.dx, y: p.y - g.dy });
    const now = performance.now(), elapsed = Math.max((now-g.time)/1000, .008);
    g.vx = Math.max(-700, Math.min(700, (next.x-g.current.x)/elapsed));
    g.vy = Math.max(-700, Math.min(700, (next.y-g.current.y)/elapsed));
    g.time = now;
    g.current = next;
    commit(world.current.map(b => b.id === next.id ? next : b));
    setPreview(snapBlock(next, world.current));
  };
  const finish = (event, cancel = false) => {
    const g = gesture.current;
    if (!g || g.pointer !== event.pointerId) return;
    const snapped = !cancel && snapBlock(g.current, world.current);
    const occupied = world.current.some(b => b.id !== g.id && overlaps(g.current, b));
    const next = cancel || (!snapped && occupied) ? g.original : snapped || g.current;
    const fresh = performance.now() - g.time < 100;
    next.vx = !cancel && !snapped && !occupied && fresh ? g.vx : 0;
    next.vy = !cancel && !snapped && !occupied && fresh ? g.vy : 0;
    const rx = g.dx - next.width / 2, ry = g.dy - 21;
    next.omega = !cancel && !snapped && !occupied && fresh ? Math.max(-8, Math.min(8, (rx*g.vy-ry*g.vx)*3/(next.width*next.width+42*42))) : 0;
    if (snapped) links.current.push(...connectionsFor(next, world.current));
    commit(world.current.map(b => b.id === g.id ? next : b));
    setMessage(cancel ? 'Move cancelled.' : snapped ? `${next.name} block snapped into place.` : occupied ? 'That space is occupied. Block returned.' : `${next.name} block moved.`);
    gesture.current = null;
    setPreview(null);
    setActive(null);
  };
  const keyboard = (event, block) => {
    const arrows = { ArrowLeft: [-24, 0], ArrowRight: [24, 0], ArrowUp: [0, -42], ArrowDown: [0, 42] };
    if (!arrows[event.key] && event.key !== 'Enter' && event.key !== ' ' && event.key.toLowerCase() !== 'r') return;
    event.preventDefault();
    if (gesture.current) return;
    block = world.current.find(b => b.id === block.id);
    const delta = arrows[event.key];
    const next = event.key.toLowerCase() === 'r' ? constrain({ ...block, angle:(block.angle||0)+Math.PI/2 }) : delta ? constrain({ ...block, x: block.x + delta[0], y: block.y + delta[1] }) : snapBlock(block, world.current);
    if (next && !world.current.some(b => b.id !== block.id && overlaps(next, b))) {
      links.current = links.current.filter(pair => !pair.includes(block.id));
      if (!delta) links.current.push(...connectionsFor(next, world.current));
      commit(world.current.map(b => b.id === block.id ? { ...next, vx: 0, vy: 0 } : b));
      setMessage(`${block.name} block ${delta ? 'moved' : 'connected'}.`);
    } else setMessage('No open connection here. Move the block closer to another.');
  };
  const addBlock = (width, shape) => {
    if (world.current.length >= 16) return;
    const template = initialBlocks[serial.current % initialBlocks.length];
    let next = null;
    for (let y = 42; y <= 168 && !next; y += 60) for (let x = 36; x + width < 576; x += 24) {
      const candidate = { ...template, id: `extra-${serial.current}`, x, y, width, shape, name: shape || template.name, vx: 0, vy: 0 };
      if (!world.current.some(b => overlaps(candidate, b))) { next = candidate; break; }
    }
    if (!next) { setMessage('Make a little room at the top first.'); return; }
    serial.current++;
    commit([...world.current, next]);
    setMessage('New block added.');
  };
  const mix = () => {
    gesture.current = null; links.current = []; setActive(null); setPreview(null);
    commit(world.current.map((b, i) => ({ ...b, vx: Math.sin(i * 2.4 + 1) * 430, vy: -420 - (i % 3) * 90, omega: Math.sin(i * 1.7 + .4) * 5 })));
    setMessage(paused ? 'Ready to mix. Press Resume to launch.' : 'A fresh start. See what lands.');
  };
  return <div className="hero-terrain block-playground">
    <div className="block-heading"><span>THE LITTLE PLAYGROUND</span><span>{moon ? 'MOON GRAVITY' : 'EARTH GRAVITY'}</span></div>
    <div className="block-toolbar">
      <button type="button" className="block-prompt" onClick={() => setChallenge(c => (c + 1) % prompts.length)} aria-label={`New building idea. Current idea: ${prompts[challenge]}`}>{prompts[challenge]} <span>↻</span></button>
      <button type="button" className="gravity-switch" aria-pressed={moon} onClick={() => setMoon(m => !m)}>{moon ? '☾ Moon' : '◉ Earth'}</button>
    </div>
    <svg ref={svg} className="block-board" viewBox="0 0 600 460" role="group" aria-label="Interactive building blocks" aria-describedby="block-instructions">
      <defs><pattern id={`${artworkId}-dots`} width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r=".85" fill="currentColor" /></pattern>

      </defs>
      <rect width="600" height="460" fill={`url(#${artworkId}-dots)`} className="block-grid" />
      <g className="playground-landscape" aria-hidden="true">
        {moon ? <><circle cx="488" cy="78" r="30" /><circle cx="479" cy="70" r="7" /><circle cx="499" cy="88" r="4" /><path d="M60 78h12m-6-6v12M412 138h8m-4-4v8" /></> : <><path d="M36 410V380h24v30m12 0v-58h24v58m12 0v-36h24v36M462 410v-50h24v50m12 0v-80h24v80m12 0v-30h24v30" /><circle cx="494" cy="77" r="22" /></>}
        <path d="M12 435h576" />
      </g>
      {preview && <polygon points={edges(preview).map(e=>`${e.a.x},${e.a.y}`).join(' ')} className="block-preview" />}

      {[...blocks.filter(b => b.id !== active), ...blocks.filter(b => b.id === active)].map(block => <g
        key={block.id} transform={`translate(${block.x} ${block.y}) rotate(${(block.angle || 0) * 180 / Math.PI} ${block.width / 2} 21)`} className={`building-block${active === block.id ? ' is-held' : ''}`}
        style={{ color: block.color }} role="button" tabIndex={0} aria-label={`${block.name} piece`}
        aria-describedby="block-instructions"
        onPointerDown={event => start(event, block)} onPointerMove={move} onPointerUp={event => finish(event)}
        onPointerCancel={event => finish(event, true)} onLostPointerCapture={event => finish(event, true)}
        onKeyDown={event => { if (event.key === 'Escape' && gesture.current) { const g = gesture.current; finish({ pointerId: g.pointer }, true); } else keyboard(event, block); }}
      >
        <rect className="block-focus" x="-5" y="-14" width={block.width + 10} height="62" rx="6" />

        <polygon points={outline(block).map(p => `${p.x},${p.y}`).join(' ')} fill="currentColor" stroke="currentColor" strokeLinejoin="round" strokeWidth=".5" />
        <path d={`M1 38h${block.width - 2}v3H1Z`} fill="black" opacity=".16" />
        {hasStuds(block) && <path d={`M3 2h${block.width - 6}`} stroke="white" strokeOpacity=".3" />}
        <g fill="none" stroke="black" strokeOpacity=".2" strokeWidth="1.5" aria-hidden="true">
          {block.shape === 'window' ? <><circle cx={block.width/2} cy="21" r="12" fill="#273344" fillOpacity=".75" /><path d={`M${block.width/2-7} 17h14m-7-7v22`} stroke="#e4ddcb" strokeOpacity=".6" /></> : block.shape === 'door' ? <><path d="M12 40V16a12 12 0 0 1 24 0v24" fill="#273344" fillOpacity=".6" /><circle cx="30" cy="27" r="1.5" fill="#e4ddcb" /></> : !hasStuds(block) ? <path d={`M8 36h${block.width-16}`} stroke="white" strokeOpacity=".25" /> : block.width === 48 ? <><circle cx="18" cy="18" r="3" /><circle cx="30" cy="18" r="3" /><path d="M20 27h8" /></> : block.width === 144 ? <path d="M18 26V14h16v12m14 0V14h16v12m14 0V14h16v12m14 0V14h16v12" /> : <path d="M35 29V19a13 13 0 0 1 26 0v10m-19 0V19a6 6 0 0 1 12 0v10" />}
        </g>
      </g>)}
      {active && (() => {
        const held=blocks.find(b=>b.id===active);
        const lit=preview ? [edges(held)[preview.snapEdge], edges(blocks.find(b=>b.id===preview.targetId))[preview.targetEdge]] : edges(held);
        return <g className={`connection-glow${preview ? ' is-ready' : ''}`} pointerEvents="none">{lit.map((e,i)=><path key={i} d={`M${e.a.x} ${e.a.y}L${e.b.x} ${e.b.y}`} />)}</g>;
      })()}

    </svg>
    <div className="block-toybox">
      <div className="block-add"><span>ADD A BLOCK</span>{[48, 96, 144].map(width => <button key={width} type="button" disabled={blocks.length >= 16} onClick={() => addBlock(width)} aria-label={`Add ${width === 48 ? 'small' : width === 96 ? 'medium' : 'long'} block`}><svg viewBox={`0 0 ${width} 50`} aria-hidden="true"><rect y="10" width={width} height="36" rx="3" /></svg><span>+</span></button>)}</div>
      <button type="button" className="block-mix" onClick={mix}>Mix it up ↗</button>
    </div>
    <div className="block-shapes" aria-label="Special building pieces">
      {[['roof',96,'Roof'],['nose',48,'Nose cone'],['wing',48,'Wing'],['window',48,'Window'],['door',48,'Door']].map(([shape,width,label]) => <button type="button" key={shape} disabled={blocks.length>=16} onClick={() => addBlock(width,shape)} aria-label={`Add ${label.toLowerCase()} piece`}><svg viewBox={`0 -10 ${width} 56`} aria-hidden="true"><polygon points={outline({width,shape}).map(p=>`${p.x},${p.y}`).join(' ')} fill="currentColor" />{shape==='window' && <circle cx="24" cy="21" r="11" fill="var(--bg)" />}{shape==='door' && <path d="M13 42V17a11 11 0 0 1 22 0v25" fill="var(--bg)" />}</svg><span>{label} +</span></button>)}
    </div>
    <div className="block-caption"><p id="block-instructions">Match the glowing edges to connect. Pull apart to rebuild.<span>Keyboard: pause physics, then arrows to move · R to rotate · Enter to connect.</span></p><button type="button" aria-pressed={paused} onClick={() => setPaused(p => !p)}>{paused ? 'Resume' : 'Pause'}</button><button type="button" onClick={() => { gesture.current = null; links.current = [['blue', 'cream'], ['sage', 'rose']]; commit(initialBlocks.map(b => ({ ...b }))); setActive(null); setPreview(null); setMessage('Blocks reset.'); }}>Reset ↺</button></div>
    <span className="sr-only" aria-live="polite">{message}</span>
  </div>;
}
