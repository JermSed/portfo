'use client';

import React, { useState } from 'react';

export default function Logo({ src, alt, fallback }) {
  const [failed, setFailed] = useState(false);
  const isAmazon = src?.toLowerCase().includes('amazon');
  const padding = isAmazon ? 'p-2.5' : 'p-1';

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        decoding="async"
        className={`h-10 w-10 rounded-full border border-neutral-200 bg-white object-contain ${padding}`}
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 font-sans text-sm text-neutral-700">
      {fallback}
    </div>
  );
}
