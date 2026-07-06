import React from 'react';

const heightCycle = ['h-64', 'h-80', 'h-56', 'h-72'];

function PhotoCard({ photo, idx }) {
  return (
    <figure>
      <img
        src={photo.url}
        alt={photo.title}
        loading="lazy"
        decoding="async"
        className={`${heightCycle[idx % heightCycle.length]} w-full rounded-md border border-neutral-200 object-cover`}
      />
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
  if (!items?.length) return null;

  const leftColumn = items.filter((_, idx) => idx % 2 === 0);
  const rightColumn = items.filter((_, idx) => idx % 2 === 1);

  return (
    <div className="grid grid-cols-2 gap-5 md:gap-6">
      <div className="space-y-8">
        {leftColumn.map((photo, idx) => (
          <PhotoCard key={photo.title} photo={photo} idx={idx * 2} />
        ))}
      </div>
      <div className="mt-16 space-y-8 md:mt-24">
        {rightColumn.map((photo, idx) => (
          <PhotoCard key={photo.title} photo={photo} idx={idx * 2 + 1} />
        ))}
      </div>
    </div>
  );
}
