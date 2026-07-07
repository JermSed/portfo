'use client';

import React, { useEffect, useState } from 'react';

function Lightbox({ photo, onClose }) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setClosing(true);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
      role="dialog"
      aria-modal="true"
      aria-label={photo.title}
      onClick={() => setClosing(true)}
    >
      <div
        className={`${closing ? 'lightbox-fade-out' : 'lightbox-fade'} absolute inset-0 bg-neutral-900/30 backdrop-blur-xl`}
      />
      <figure
        className={`${closing ? 'lightbox-pop-out' : 'lightbox-pop'} relative max-w-4xl rounded-3xl border border-white/50 bg-white/55 p-3 shadow-2xl backdrop-blur-2xl md:p-4`}
        onClick={(e) => e.stopPropagation()}
        onAnimationEnd={() => {
          if (closing) onClose();
        }}
      >
        <img
          src={photo.url}
          alt={photo.title}
          className="mx-auto max-h-[75vh] w-auto max-w-full rounded-2xl"
        />
        <figcaption className="flex items-baseline justify-between gap-3 px-1 pt-3">
          <span className="text-[15px] text-neutral-900">{photo.title}</span>
          <span className="whitespace-nowrap font-sans text-xs text-neutral-500">
            {photo.location}
          </span>
        </figcaption>
      </figure>
    </div>
  );
}

function PhotoCard({ photo, onOpen }) {
  return (
    <figure>
      <button
        type="button"
        onClick={() => onOpen(photo)}
        aria-label={`View ${photo.title} larger`}
        className="block w-full cursor-zoom-in rounded-md transition hover:opacity-90"
      >
        <img
          src={photo.url}
          alt={photo.title}
          loading="lazy"
          decoding="async"
          className="h-auto w-full rounded-md border border-neutral-200"
        />
      </button>
      <figcaption className="mt-2 flex items-baseline justify-between gap-2">
        <span className="text-[15px] text-neutral-900">{photo.title}</span>
        <span className="whitespace-nowrap font-sans text-xs text-neutral-400">
          {photo.location}
        </span>
      </figcaption>
    </figure>
  );
}

export default function PhotoGallery({ items }) {
  const [openPhoto, setOpenPhoto] = useState(null);

  if (!items?.length) return null;

  const leftColumn = items.filter((_, idx) => idx % 2 === 0);
  const rightColumn = items.filter((_, idx) => idx % 2 === 1);

  return (
    <>
      <div className="grid grid-cols-2 gap-5 md:gap-6">
        <div className="space-y-8">
          {leftColumn.map((photo) => (
            <PhotoCard key={photo.title} photo={photo} onOpen={setOpenPhoto} />
          ))}
        </div>
        <div className="mt-16 space-y-8 md:mt-24">
          {rightColumn.map((photo) => (
            <PhotoCard key={photo.title} photo={photo} onOpen={setOpenPhoto} />
          ))}
        </div>
      </div>
      {openPhoto && <Lightbox photo={openPhoto} onClose={() => setOpenPhoto(null)} />}
    </>
  );
}
