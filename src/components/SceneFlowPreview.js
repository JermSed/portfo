'use client';

import { useEffect, useRef, useState } from 'react';

export default function SceneFlowPreview({ hero = false }) {
  const video = useRef(null);
  const surface = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const manuallyPaused = useRef(false);

  useEffect(() => {
    const media = video.current;
    const element = surface.current;
    const card = element.closest('a');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let hovered = false;
    let focused = false;
    const update = () => {
      if (visible && !document.hidden && !reduced.matches && !manuallyPaused.current && (hero || hovered || focused)) {
        media.play().catch(() => {});
      } else media.pause();
    };
    const enter = () => { hovered = true; update(); };
    const leave = () => { hovered = false; update(); };
    const focus = () => { focused = true; update(); };
    const blur = () => { focused = false; update(); };
    card?.addEventListener('mouseenter', enter);
    card?.addEventListener('mouseleave', leave);
    card?.addEventListener('focus', focus);
    card?.addEventListener('blur', blur);
    reduced.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }, { threshold: 0.15 });
    observer.observe(element);
    return () => {
      observer.disconnect();
      media.pause();
      card?.removeEventListener('mouseenter', enter);
      card?.removeEventListener('mouseleave', leave);
      card?.removeEventListener('focus', focus);
      card?.removeEventListener('blur', blur);
      reduced.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, [hero]);

  function toggle() {
    if (playing) { manuallyPaused.current = true; video.current.pause(); }
    else { manuallyPaused.current = false; video.current.play().catch(() => {}); }
  }

  return <div ref={surface} className={`sceneflow-preview${hero ? ' sceneflow-demo-player' : ''}`}>
    <video ref={video} muted loop playsInline preload={hero ? 'metadata' : 'none'} poster="/sceneflow/sceneflow-poster.jpg?v=2" src="/sceneflow/sceneflow-demo.mp4?v=2" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)} aria-label="SceneFlow demo: raw footage and storyboard, Make cut, then an editable DaVinci Resolve timeline" />
    {hero && !failed ? <button type="button" className="sceneflow-play-toggle" onClick={toggle} aria-label={playing ? 'Pause SceneFlow demo' : 'Play SceneFlow demo'}>{playing ? 'Ⅱ' : '▶'}</button> : null}
    {hero && failed ? <p className="sceneflow-video-error">Video unavailable. SceneFlow turns raw footage and a storyboard into an editable Resolve timeline.</p> : null}
  </div>;
}
