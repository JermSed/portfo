'use client';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import PhotoGallery from './PhotoGallery';
const Lightbox = dynamic(() => import('./Lightbox'), { ssr: false });
const wrap = (v, span) => ((v % span) + span) % span;

export default function PhotoSpace({ items }) {
  const [view, setView] = useState('space');
  const [offset, setOffset] = useState({x:0,y:0});
  const [size, setSize] = useState({width:1100,height:650});
  const [open, setOpen] = useState(null);
  const surface = useRef(null), drag = useRef(null), refs = useRef(new Map()), frame = useRef(0);
  const position = useRef(offset);
  const moved = useRef(false);
  const columns = Math.max(4, Math.ceil(Math.sqrt(items.length * 1.5)));
  const rows = Math.max(3, Math.ceil(items.length / columns));
  const worldWidth = columns * 360, worldHeight = rows * 290;
  const move = (x,y) => { const next={x:wrap(x,worldWidth),y:wrap(y,worldHeight)}; position.current=next;setOffset(next); };
  useEffect(() => {
    const el=surface.current;if(!el)return;
    const observer=new ResizeObserver(([entry])=>setSize({width:entry.contentRect.width,height:entry.contentRect.height}));
    observer.observe(el);return ()=>{observer.disconnect();cancelAnimationFrame(frame.current);};
  }, [view]);
  function down(e) {
    if(e.button!==0)return;
    cancelAnimationFrame(frame.current);moved.current=false;
    drag.current={x:e.clientX,y:e.clientY,time:performance.now(),vx:0,vy:0,total:0};
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onMove(e) {
    const d=drag.current;if(!d)return;
    const dx=e.clientX-d.x,dy=e.clientY-d.y,now=performance.now(),dt=Math.max(8,now-d.time);
    d.total+=Math.abs(dx)+Math.abs(dy);if(d.total>6)moved.current=true;
    d.vx=dx/dt;d.vy=dy/dt;d.x=e.clientX;d.y=e.clientY;d.time=now;
    move(position.current.x+dx,position.current.y+dy);
  }
  function up(e) {
    const d=drag.current;if(!d)return;drag.current=null;
    if(!moved.current){const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-photo-index]');if(target&&surface.current?.contains(target))setOpen(Number(target.dataset.photoIndex));return;}
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||performance.now()-d.time>100)return;
    let vx=d.vx,vy=d.vy,last=performance.now();
    function coast(now){const dt=Math.min(32,now-last);last=now;const decay=Math.pow(.92,dt/16);vx*=decay;vy*=decay;move(position.current.x+vx*dt,position.current.y+vy*dt);if(Math.hypot(vx,vy)>.01)frame.current=requestAnimationFrame(coast);}
    frame.current=requestAnimationFrame(coast);
  }
  function key(e) {
    const deltas={ArrowLeft:[160,0],ArrowRight:[-160,0],ArrowUp:[0,160],ArrowDown:[0,-160]};
    if(deltas[e.key]){e.preventDefault();cancelAnimationFrame(frame.current);move(position.current.x+deltas[e.key][0],position.current.y+deltas[e.key][1]);}
    if(e.key==='Home'){e.preventDefault();cancelAnimationFrame(frame.current);move(0,0);}
  }
  function visibleImage(i) {
    const bounds=surface.current?.getBoundingClientRect();
    if(!bounds)return null;
    return [...refs.current.values()].find(n=>{
      if(Number(n.closest('[data-photo-index]')?.dataset.photoIndex)!==i)return false;
      const r=n.getBoundingClientRect();
      return r.left>=bounds.left&&r.right<=bounds.right&&r.top>=Math.max(0,bounds.top)&&r.bottom<=Math.min(window.innerHeight,bounds.bottom);
    })??null;
  }
  if(!items.length)return <p>No photographs yet.</p>;
  return <>
    <div className="photo-space-toolbar"><p>{view==='space'?'Drag to wander. Open anything that catches your eye.':'A few moments worth keeping.'}</p><div role="group" aria-label="Photo layout"><button aria-pressed={view==='space'} onClick={()=>setView('space')}>Explore</button><button aria-pressed={view==='grid'} onClick={()=>setView('grid')}>Gallery</button></div></div>
    {view==='grid'?<PhotoGallery items={items}/>:<div ref={surface} className="photo-space" tabIndex={0} aria-label="Photo canvas. Drag or use arrow keys to explore. Press Home to recenter. Use Gallery for a complete list." onPointerDown={down} onPointerMove={onMove} onPointerUp={up} onPointerCancel={()=>{drag.current=null;}} onKeyDown={key}>
      {Array.from({length:items.length},(_,tile)=>{
        const i=tile%items.length,photo=items[i];
        const col=tile%columns,row=Math.floor(tile/columns),width=i%4===1?220:290;
        const x=wrap(col*360+offset.x+worldWidth/2,worldWidth)-worldWidth/2+size.width/2-150;
        const y=wrap(row*290+(col%2)*95+offset.y+worldHeight/2,worldHeight)-worldHeight/2+size.height/2-110;
        return <button key={tile} data-photo-index={i} tabIndex={x>=0&&x+width<=size.width&&y>=0&&y+220<=size.height?0:-1} className="photo-space-item" aria-label={`Open ${photo.title}`} style={{width,transform:`translate(${x}px,${y}px)`}} onClick={e=>{if(e.detail===0)setOpen(i);}}>
          <Image ref={node=>{if(node)refs.current.set(tile,node);else refs.current.delete(tile);}} src={photo.url} alt={photo.title} width={600} height={400} sizes="300px" draggable={false} loading="lazy" />
          <span>{photo.title}</span>
        </button>;
      })}
      <button className="photo-space-reset" onPointerDown={e=>e.stopPropagation()} onClick={()=>{cancelAnimationFrame(frame.current);move(0,0);}}>Recenter ↗</button>
      <span className="photo-space-count">{items.length} photographs · No set order</span>
    </div>}
    {open!==null&&<Lightbox photos={items} index={open} onIndexChange={setOpen} onClose={()=>setOpen(null)} sourceRectFor={i=>visibleImage(i)?.getBoundingClientRect()??null} aspectFor={i=>{const n=visibleImage(i);return n?.naturalWidth/n?.naturalHeight||null;}}/>}
  </>;
}
