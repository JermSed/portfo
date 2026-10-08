'use client';
import { useEffect, useRef } from 'react';

export default function ProductVideo({ hero = false, className, poster, src, label }) {
  const video = useRef(null);
  useEffect(() => {
    const media = video.current;
    const card = media.closest('a');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false, hovered = false, focused = false, paused = false;
    const update = () => {
      if (visible && !document.hidden && !reduced.matches && !paused && (hero || hovered || focused)) media.play().catch(() => {});
      else media.pause();
    };
    const enter = () => { hovered = true; update(); };
    const leave = () => { hovered = false; update(); };
    const focus = () => { focused = true; update(); };
    const blur = () => { focused = false; update(); };
    const toggle = () => { paused = !media.paused; if (paused) media.pause(); else media.play().catch(() => {}); };
    const key = e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); } };
    card?.addEventListener('mouseenter', enter); card?.addEventListener('mouseleave', leave);
    card?.addEventListener('focus', focus); card?.addEventListener('blur', blur);
    if (hero) { media.addEventListener('click', toggle); media.addEventListener('keydown', key); }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }, { threshold: .15 });
    observer.observe(media);
    document.addEventListener('visibilitychange', update); reduced.addEventListener('change', update);
    return () => {
      observer.disconnect(); media.pause();
      card?.removeEventListener('mouseenter', enter); card?.removeEventListener('mouseleave', leave);
      card?.removeEventListener('focus', focus); card?.removeEventListener('blur', blur);
      media.removeEventListener('click', toggle); media.removeEventListener('keydown', key);
      document.removeEventListener('visibilitychange', update); reduced.removeEventListener('change', update);
    };
  }, [hero]);
  return <div className={className}><video ref={video} src={src} poster={poster} muted loop playsInline preload={hero ? 'metadata' : 'none'} tabIndex={hero ? 0 : undefined} aria-label={`${label}${hero ? '. Click or press Space to pause or resume.' : ''}`} /></div>;
}
