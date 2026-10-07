'use client';

import { useEffect, useRef, useState } from 'react';

export default function BuckitPreview({ hero = false }) {
  const video = useRef(null);
  const surface = useRef(null);
  const [playing, setPlaying] = useState(false);
  const pinned = useRef(false);

  function play(automatic = true) {
    if (!video.current || (automatic && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    video.current.play().catch(() => {});
  }

  function pause() {
    if (!pinned.current) video.current?.pause();
  }

  useEffect(() => {
    const element = surface.current;
    const link = element?.closest('a');
    const focus = () => play();
    const blur = () => pause();
    link?.addEventListener('focus', focus);
    link?.addEventListener('blur', blur);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) { pinned.current = false; video.current?.pause(); }
    });
    if (element) observer.observe(element);
    return () => { observer.disconnect(); link?.removeEventListener('focus', focus); link?.removeEventListener('blur', blur); };
  }, []);

  function toggle() {
    if (playing) { pinned.current = false; video.current?.pause(); }
    else { pinned.current = true; play(false); }
  }

  return <div ref={surface} className={`buckit-card-preview${hero ? ' buckit-demo-player' : ''}${playing ? ' is-playing' : ''}`} onMouseEnter={() => play()} onMouseLeave={pause}>
    <video ref={video} muted loop playsInline preload="metadata" poster="/buckit/buckit-preview.jpg" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} aria-label="Animated Buckit walkthrough: drag a resume from a Job Search Space into an application">
      <source src="/buckit/buckit-preview.webm" type="video/webm" />
      <source src="/buckit/buckit-preview.mp4" type="video/mp4" />
    </video>
    {hero ? <button type="button" className="buckit-play-toggle" onClick={toggle} aria-label={playing ? 'Pause product demo' : 'Play product demo'}>
      <span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>
    </button> : null}
  </div>;
}
