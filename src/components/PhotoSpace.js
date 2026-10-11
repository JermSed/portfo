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
      left: Math.max(0, Math.min(items.length - 1, index)) * el.clientWidth,
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
  const photo = items[selected];

  return <>
    <div className="photo-space-toolbar">
      <p>{view === 'space' ? 'Take a closer look.' : 'The whole collection.'}</p>
      <div role="group" aria-label="Photo layout">
        <button aria-pressed={view === 'space'} onClick={() => { if (view !== 'space') { setSelected(0); setView('space'); } }}>Explore</button>
        <button aria-pressed={view === 'grid'} onClick={() => setView('grid')}>Gallery</button>
      </div>
    </div>
    {view === 'grid' ? <PhotoGallery items={items} /> :
      <section className="photo-sequence" aria-label="Explore photographs" onKeyDown={onKeyDown}>
        <div className="photo-sequence-track" ref={track} onScroll={event => {
          const el = event.currentTarget;
          setSelected(Math.min(items.length - 1, Math.max(0, Math.round(el.scrollLeft / el.clientWidth))));
        }}>
          {items.map((item, i) => <button
            key={item.url}
            className="photo-sequence-frame"
            aria-label={`Open ${item.title}`}
            tabIndex={i === selected ? 0 : -1}
            onClick={() => setOpen(i)}
          >
            <Image
              ref={node => { if (node) images.current.set(i, node); else images.current.delete(i); }}
              src={item.url} alt={item.title} width={1500} height={1000}
              sizes="(max-width: 700px) 100vw, 1100px" priority={i === 0} draggable={false}
            />
          </button>)}
        </div>
        <div className="photo-sequence-footer">
          <div className="photo-sequence-caption" aria-live="polite" aria-atomic="true">
            <h2>{photo.title}</h2>
            {photo.location && <p>{photo.location}</p>}
          </div>
          <div className="photo-sequence-controls">
            <span>{String(selected + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
            <button aria-label="Previous photograph" disabled={selected === 0} onClick={() => goTo(selected - 1)}>←</button>
            <button aria-label="Next photograph" disabled={selected === items.length - 1} onClick={() => goTo(selected + 1)}>→</button>
          </div>
        </div>
      </section>}
    {open !== null && <Lightbox photos={items} index={open} onIndexChange={setOpen} onClose={() => setOpen(null)}
      sourceRectFor={i => i === selected ? images.current.get(i)?.getBoundingClientRect() ?? null : null}
      aspectFor={i => { const image = images.current.get(i); return image?.naturalWidth / image?.naturalHeight || null; }} />}
  </>;
}
