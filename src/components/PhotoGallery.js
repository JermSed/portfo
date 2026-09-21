'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { useCallback, useRef, useState } from 'react';

// The viewer (and its spring engine) is only fetched once someone opens a
// photo, so the grid itself paints without paying for it.
const Lightbox = dynamic(() => import('./Lightbox'), { ssr: false });

function PhotoCard({ photo, index, onOpen, registerRef }) {
  return (
    <figure className="photo-card">
      <button
        type="button"
        onClick={() => onOpen(index)}
        aria-label={`View ${photo.title} larger`}
        className="photo-card-button"
      >
        <Image
          ref={(node) => registerRef(index, node)}
          src={photo.url}
          width={1200}
          height={800}
          sizes="(max-width: 600px) 45vw, (max-width: 1200px) 48vw, 550px"
          alt={photo.title}
          loading="lazy"
          decoding="async"
          className="photo-card-image"
        />
      </button>
      <figcaption className="photo-card-caption">
        <span className="photo-card-title">{photo.title}</span>
        <span className="photo-card-meta">{photo.location}</span>
      </figcaption>
    </figure>
  );
}

export default function PhotoGallery({ items }) {
  const [openIndex, setOpenIndex] = useState(null);
  const thumbRefs = useRef(new Map());

  const registerRef = useCallback((index, node) => {
    if (node) thumbRefs.current.set(index, node);
    else thumbRefs.current.delete(index);
  }, []);

  // Measured on demand rather than captured at open time: the page may have
  // scrolled, and paging through the set changes which thumbnail we belong to.
  const sourceRectFor = useCallback((index) => {
    const node = thumbRefs.current.get(index);
    if (!node) return null;
    const rect = node.getBoundingClientRect();
    // Off-screen thumbnails are not a place to fly back to.
    if (rect.bottom < 0 || rect.top > window.innerHeight) return null;
    return rect;
  }, []);

  // The thumbnail's intrinsic shape is the viewer's shape — same photo.
  const aspectFor = useCallback((index) => {
    const node = thumbRefs.current.get(index);
    if (!node?.naturalWidth || !node?.naturalHeight) return null;
    return node.naturalWidth / node.naturalHeight;
  }, []);

  if (!items?.length) return null;

  const columns = [
    items.map((photo, index) => ({ photo, index })).filter(({ index }) => index % 2 === 0),
    items.map((photo, index) => ({ photo, index })).filter(({ index }) => index % 2 === 1),
  ];

  return (
    <>
      <div className="photo-grid">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className={columnIndex === 1 ? 'photo-column photo-column-offset' : 'photo-column'}>
            {column.map(({ photo, index }) => (
              <PhotoCard
                key={photo.title}
                photo={photo}
                index={index}
                onOpen={setOpenIndex}
                registerRef={registerRef}
              />
            ))}
          </div>
        ))}
      </div>
      {openIndex !== null && (
        <Lightbox
          photos={items}
          index={openIndex}
          sourceRectFor={sourceRectFor}
          aspectFor={aspectFor}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
}
