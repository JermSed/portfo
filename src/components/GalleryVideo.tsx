'use client';

import { useEffect, useRef } from 'react';

export default function GalleryVideo({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  function toggleSound() {
    const video = ref.current;
    if (!video) return;
    document.querySelectorAll<HTMLVideoElement>('.media-video').forEach(other => {
      if (other !== video) other.muted = true;
    });
    if (video.paused) {
      video.muted = false;
      void video.play().catch(() => { video.muted = true; });
    } else {
      video.muted = !video.muted;
    }
  }

  function togglePlayback() {
    const video = ref.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => {});
    else video.pause();
  }

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let manuallyPaused = false;
    let automaticPause = false;
    const sync = () => {
      if (!visible || document.hidden) video.muted = true;
      if (visible && !document.hidden && !reduced.matches && !manuallyPaused) {
        automaticPause = false;
        void video.play().catch(() => { /* Autoplay may wait for user interaction. */ });
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

  return <div className="gallery-video">
    <video ref={ref} className="media-video" muted loop playsInline preload="metadata" tabIndex={0}
      aria-label={`${title}. Muted looping video; click or press Enter to toggle sound, Space to play or pause.`}
      onClick={toggleSound}
      onKeyDown={event => {
        if (event.key === ' ') {
          event.preventDefault();
          togglePlayback();
        } else if (event.key === 'Enter') {
          event.preventDefault();
          toggleSound();
        }
      }}
    >
      <source src={src} type="video/mp4" />
      Your browser does not support this video. <a href={src}>Download video</a>
    </video>
  </div>;
}
