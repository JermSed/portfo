import Link from 'next/link';
import React from 'react';

export default function ThoughtsList({ items }) {
  if (!items?.length) return null;

  return (
    <section aria-labelledby="thoughts-heading" id="thoughts">
      <h2 id="thoughts-heading" className="eyebrow">
        Thoughts
      </h2>
      <div className="mt-6 space-y-7">
        {items.map((thought) => (
          <article key={thought.slug}>
            <div className="meta">{thought.date}</div>
            <h3>
              <Link href={`/thoughts/${thought.slug}`} className="thought-link mt-1.5 entry-name">
                {thought.title}
              </Link>
            </h3>
            <p className="mt-1 text-[color:var(--text-tertiary)]">{thought.cover}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
