import Link from 'next/link';
import React from 'react';

export default function ThoughtsList({ items }) {
  if (!items?.length) return null;

  return (
    <section className="space-y-6" id="thoughts">
      <p className="eyebrow">Thoughts</p>
      <div className="space-y-7">
        {items.map((thought) => (
          <div key={thought.slug}>
            <div className="font-sans text-[11px] uppercase tracking-[0.14em] text-neutral-400">
              {thought.date}
            </div>
            <Link
              href={`/thoughts/${thought.slug}`}
              className="mt-1.5 block text-[17px] leading-relaxed text-neutral-900 no-underline decoration-neutral-300 underline-offset-4 hover:underline"
            >
              {thought.title}
            </Link>
            <p className="mt-0.5 text-[15px] leading-relaxed text-neutral-500">{thought.cover}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
