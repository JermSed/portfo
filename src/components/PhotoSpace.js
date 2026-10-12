'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRef, useState } from 'react';
import PhotoGallery from './PhotoGallery';

const Lightbox = dynamic(() => import('./Lightbox'), { ssr: false });

export default function PhotoSpace({ items }) {
  const [view, setView] = useState('space');
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(null);
  const track = useRef(null);
  const images = useRef(new Map());

  function goTo(index) {
    const el = track.current;
    if (!el) return;
    el.scrollTo({
      left: el.children[Math.max(0, Math.min(items.length - 1, index))].offsetLeft - el.firstElementChild.offsetLeft,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  }

  function onKeyDown(event) {
    const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (delta) { event.preventDefault(); goTo(selected + delta); }
    if (event.key === 'Home') { event.preventDefault(); goTo(0); }
    if (event.key === 'End') { event.preventDefault(); goTo(items.length - 1); }
  }

  if (!items.length) return <p>No photographs yet.</p>;

  return <>
    <div className="photo-space-toolbar">
      <p>{view === 'space' ? 'A few moments, laid out.' : 'The whole collection.'}</p>
      <div role="group" aria-label="Photo layout">
        <button aria-pressed={view === 'space'} onClick={() => { if (view !== 'space') { setSelected(0); setView('space'); } }}>Explore</button>
        <button aria-pressed={view === 'grid'} onClick={() => setView('grid')}>Gallery</button>
      </div>
    </div>
    {view === 'grid' ? <PhotoGallery items={items} /> :
      <section className="photo-sequence" aria-label="Explore photographs" onKeyDown={onKeyDown}>
        <div className="photo-sequence-track" ref={track} onScroll={event => {
          const el = event.currentTarget;
          const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
          const positions = Array.from(el.children, child => Math.abs(child.offsetLeft - el.firstElementChild.offsetLeft - el.scrollLeft));
          setSelected(atEnd ? items.length - 1 : positions.indexOf(Math.min(...positions)));
        }}>
          {items.map((item, i) => <button
            key={item.url}
            className="photo-sequence-frame"
            aria-label={`Open ${item.title}`}
            style={{ '--print-tilt': `${[-3, 2, -1, 3, -2][i % 5]}deg`, '--print-offset': `${[22, 78, 0, 58, 28][i % 5]}px` }}
            onClick={() => setOpen(i)}
          >
            <Image
              ref={node => { if (node) images.current.set(i, node); else images.current.delete(i); }}
              src={item.url} alt={item.title} width={1500} height={1000}
              sizes="(max-width: 600px) 76vw, 360px" priority={i === 0} draggable={false}
            />
            <span className="photo-print-caption"><strong>{item.title}</strong><span>{item.location}</span></span>
          </button>)}
        </div>
        <div className="photo-sequence-footer">
          <div className="photo-sequence-caption" aria-live="polite" aria-atomic="true">
            <h2>The light table</h2>
            <p>Scroll across. Pick up a photograph.</p>
          </div>
          <div className="photo-sequence-controls">
            <span>{String(selected + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
            <button aria-label="Previous photograph" disabled={selected === 0} onClick={() => goTo(selected - 1)}>←</button>
            <button aria-label="Next photograph" disabled={selected === items.length - 1} onClick={() => goTo(selected + 1)}>→</button>
          </div>
        </div>
      </section>}
    {open !== null && <Lightbox photos={items} index={open} onIndexChange={setOpen} onClose={() => setOpen(null)}
      sourceRectFor={i => { const rect = images.current.get(i)?.getBoundingClientRect(); return rect && rect.left >= 0 && rect.right <= window.innerWidth ? rect : null; }}
      aspectFor={i => { const image = images.current.get(i); return image?.naturalWidth / image?.naturalHeight || null; }} />}
  </>;
}
