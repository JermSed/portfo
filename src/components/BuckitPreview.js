'use client';

import { useRef } from 'react';

export default function BuckitPreview() {
  const video = useRef(null);

  function play() {
    if (!video.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    video.current.play().catch(() => {});
  }

  function stop() {
    if (!video.current) return;
    video.current.pause();
    video.current.currentTime = 0;
  }

  return <div className="buckit-card-preview" onMouseEnter={play} onMouseLeave={stop} onFocus={play} onBlur={stop}>
    <video ref={video} muted loop playsInline preload="none" poster="/buckit/buckit-preview.jpg" aria-label="Buckit preview showing a resume dragged from its floating panel into an application email">
      <source src="/buckit/buckit-preview.webm" type="video/webm" />
      <source src="/buckit/buckit-preview.mp4" type="video/mp4" />
    </video>
    <span className="buckit-preview-hint" aria-hidden="true">Hover to preview</span>
  </div>;
}
