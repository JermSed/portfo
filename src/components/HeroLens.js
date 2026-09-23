'use client';

import { useEffect, useId, useRef, useState } from 'react';

export default function HeroLens() {
  const ref = useRef(null);
  const id = useId();
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let intersecting = false;
    const update = () => setVisible(intersecting && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      update();
    });
    if (ref.current) observer.observe(ref.current);
    document.addEventListener('visibilitychange', update);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  return <div ref={ref} className="hero-terrain" data-running={visible && !paused}>
    <svg viewBox="0 0 500 500" fill="none" role="img" aria-label="Overlapping blue, teal, and plum lens rings slowly moving around a warm point of light">
      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop stopColor="#739bc5" stopOpacity=".18" />
          <stop offset=".65" stopColor="#937bac" stopOpacity=".06" />
          <stop offset="1" stopColor="#937bac" stopOpacity="0" />
        </radialGradient>
        {['blue', 'teal', 'plum'].map((tone, i) => <linearGradient key={tone} id={`${id}-${tone}`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={['#6c95da', '#64b6aa', '#b68cba'][i]} />
          <stop offset=".5" stopColor={['#a7bee7', '#afd8c6', '#dfb9cd'][i]} />
          <stop offset="1" stopColor={['#49649c', '#387d87', '#795b93'][i]} />
        </linearGradient>)}
      </defs>
      <circle cx="250" cy="250" r="220" fill={`url(#${id}-glow)`} />
      <circle cx="250" cy="250" r="205" className="lens-guide" />
      <path className="terrain-frame" d="M250 35v12m0 406v12M35 250h12m406 0h12" />
      {['blue', 'teal', 'plum'].map((tone, layer) => <g key={tone} className={`lens-layer lens-layer-${layer}`}>
        <ellipse cx="250" cy="250" rx="179" ry="124" fill={`url(#${id}-${tone})`} fillOpacity=".045" />
        {Array.from({ length: 14 }, (_, ring) => <ellipse key={ring} cx="250" cy="250" rx={133 + ring * 3.5} ry={61 + ring * 4.8} stroke={`url(#${id}-${tone})`} strokeWidth={ring % 4 === 0 ? 1.15 : .65} opacity={ring % 4 === 0 ? .8 : .4} />)}
      </g>)}
      <circle cx="250" cy="250" r="23" className="lens-core-ring" />
      <circle cx="250" cy="250" r="5" className="lens-core" />
    </svg>
    <button type="button" className="terrain-toggle" onClick={() => setPaused(p => !p)} aria-label={paused ? 'Play lens animation' : 'Pause lens animation'} aria-pressed={paused}>
      <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">{paused ? <path d="m5 3 7 5-7 5Z" fill="currentColor" /> : <path d="M5 3v10M11 3v10" stroke="currentColor" strokeWidth="2" />}</svg>
    </button>
  </div>;
}
