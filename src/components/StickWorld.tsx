'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { createStickWorld } from '../lib/stick-world/world';

export default function StickWorld() {
  const pathname=usePathname();
  const hitTargets=useRef<(HTMLButtonElement|null)[]>([]);
  const canvas=useRef<HTMLCanvasElement>(null);
  const world=useRef<ReturnType<typeof createStickWorld>|null>(null);
  const [paused,setPaused]=useState(false);
  const [hidden,setHidden]=useState(false);
  const [debug,setDebug]=useState(false);
  const [showDebug,setShowDebug]=useState(false);
  const [reduced,setReduced]=useState(false);
  useEffect(()=>{
    setShowDebug(process.env.NODE_ENV==='development'&&new URLSearchParams(location.search).has('debug-characters'));
    const query=matchMedia('(prefers-reduced-motion: reduce)');
    const update=()=>setReduced(query.matches);update();query.addEventListener('change',update);
    try {setHidden(localStorage.getItem('portfolio-characters-hidden')==='true');}catch{}
    return()=>query.removeEventListener('change',update);
  },[]);
  useEffect(()=>{
    if(pathname!=='/'||hidden||reduced||!canvas.current)return;
    const instance=createStickWorld(canvas.current,{characters:3,onCharacters:characters=>{
      for(const c of characters){const button=hitTargets.current[c.id];if(!button)continue;button.style.transform=`translate(${c.x-17}px, ${c.y-53}px)`;button.style.visibility=c.y>55&&c.y<innerHeight+50?'visible':'hidden';}
    }});world.current=instance;
    return()=>{instance.destroy();world.current=null;};
  },[pathname,hidden,reduced]);
  useEffect(()=>{world.current?.setPaused(paused);},[paused,pathname,hidden,reduced]);
  useEffect(()=>{world.current?.setDebug(debug);},[debug,pathname,hidden,reduced]);
  if(pathname!=='/'||reduced)return null;
  return <div className="stick-world" data-stick-ignore>
    {!hidden&&<canvas ref={canvas} className="stick-canvas" aria-hidden="true" />}
    {!hidden&&[0,1,2].map(id=><button key={id} ref={el=>{hitTargets.current[id]=el;}} className="stick-pet-handle" aria-label={`${['Blue','Lilac','Sage'][id]} figure: drag to pick up, Enter to wave`} title="Drag me · Enter to wave"
      onPointerDown={event=>{if(event.button!==0)return;event.currentTarget.setPointerCapture(event.pointerId);world.current?.grab(id,event.clientX,event.clientY);}}
      onPointerMove={event=>{if(event.currentTarget.hasPointerCapture(event.pointerId))world.current?.drag(event.clientX,event.clientY);}}
      onPointerUp={event=>{world.current?.release();if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);}}
      onPointerCancel={()=>world.current?.release()} onLostPointerCapture={()=>world.current?.release()}
      onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();world.current?.greet(id);}}}/>)}
    <div className="stick-controls" aria-label="Page characters">
      {!hidden&&<><button type="button" aria-pressed={paused} onClick={()=>setPaused(v=>!v)}>{paused?'Play characters':'Pause characters'}</button>{showDebug&&<button type="button" aria-pressed={debug} onClick={()=>setDebug(v=>!v)}>Debug</button>}</>}
      <button type="button" onClick={()=>{const next=!hidden;setHidden(next);try{localStorage.setItem('portfolio-characters-hidden',String(next));}catch{}}}>{hidden?'Show characters':'Hide'}</button>
    </div>
  </div>;
}
