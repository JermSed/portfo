'use client';

import Image from 'next/image';
import React, { useState } from 'react';

export default function Logo({ src, alt, fallback }) {
  const [failed, setFailed] = useState(false);
  // The Amazon mark is a wordmark rather than a glyph, so it needs room to breathe.
  const padding = src?.toLowerCase().includes('amazon') ? '0.625rem' : '0.25rem';

  if (src && !failed) {
    return (
      <Image
        width={40}
        height={40}
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        decoding="async"
        className="entry-logo shrink-0"
        style={{ padding }}
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <div className="entry-logo entry-logo-fallback shrink-0" aria-hidden="true">
      {fallback}
    </div>
  );
}
