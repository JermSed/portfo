'use client';

import { useEffect, useRef, useState } from 'react';

export default function GalleryVideo({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const pinnedSound = useRef(false);
  const soundRequest = useRef(0);
  const [audible, setAudible] = useState(false);

  async function enableSound(pin: boolean) {
    const video = ref.current;
    if (!video) return;
    if (pin) pinnedSound.current = true;
    const request = ++soundRequest.current;
    // Only the video being interacted with should make sound.
    document.querySelectorAll<HTMLVideoElement>('.media-video').forEach(other => {
      if (other !== video) other.muted = true;
    });
    video.muted = false;
    try { await video.play(); }
    catch {
      if (request !== soundRequest.current) return;
      video.muted = true;
      pinnedSound.current = false;
      void video.play().catch(() => {});
    }
  }

  function mute() {
    ++soundRequest.current;
    pinnedSound.current = false;
    if (ref.current) ref.current.muted = true;
  }

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let manuallyPaused = false;
    let automaticPause = false;
    const sync = () => {
      if (!visible || document.hidden) mute();
      if (visible && !document.hidden && !reduced.matches && !manuallyPaused) {
        automaticPause = false;
        void video.play().catch(() => { /* Native controls remain available. */ });
      } else if (!video.paused) {
        automaticPause = true;
        video.pause();
      }
    };
    const pause = () => { if (!automaticPause && visible && !document.hidden) manuallyPaused = true; automaticPause = false; };
    const play = () => { manuallyPaused = false; };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .15 });
    observer.observe(video);
    video.addEventListener('pause', pause);
    video.addEventListener('play', play);
    document.addEventListener('visibilitychange', sync);
    reduced.addEventListener('change', sync);
    return () => {
      observer.disconnect(); video.removeEventListener('pause', pause); video.removeEventListener('play', play);
      document.removeEventListener('visibilitychange', sync); reduced.removeEventListener('change', sync);
      video.pause();
    };
  }, []);

  return <div className="gallery-video"
    onPointerEnter={event => { if (event.pointerType === 'mouse') void enableSound(false); }}
    onPointerLeave={() => { if (!pinnedSound.current) mute(); }}
  >
    <video ref={ref} className="media-video" muted loop controls playsInline preload="metadata" aria-label={title}
      onClick={() => { if (ref.current?.muted) void enableSound(true); else pinnedSound.current = true; }}
      onVolumeChange={() => {
        const video = ref.current;
        setAudible(Boolean(video && !video.muted && video.volume > 0));
        if (video?.muted) pinnedSound.current = false;
      }}
    >
      <source src={src} type="video/mp4" />
      Your browser does not support this video. <a href={src}>Download video</a>
    </video>
    <button type="button" className="gallery-video-sound" aria-label={`${audible ? 'Mute' : 'Enable sound for'} ${title}`} aria-pressed={audible}
      onClick={() => { if (audible) mute(); else void enableSound(true); }}
    >{audible ? 'Sound on' : 'Sound off'}</button>
  </div>;
}
