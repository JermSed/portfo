import type { Metadata } from 'next';
import Link from 'next/link';

import { getAllThoughts } from '../../lib/thoughts';

export const metadata: Metadata = {
  title: 'Thoughts',
  description: 'Notes by Jeremy Sedillo.',
};

export default function ThoughtsPage() {
  const thoughts = getAllThoughts();

  return (
    <>
      <header className="page-header">
        <h1>Thoughts</h1>
        <p className="eyebrow mt-3">
          Writing · {thoughts.length} {thoughts.length === 1 ? 'thought' : 'thoughts'}
        </p>
      </header>

      <div className="mt-14 space-y-10">
        {thoughts.map((thought) => (
          <article key={thought.slug}>
            <div className="meta">{thought.date}</div>
            <h2 className="mt-1.5">
              <Link href={`/thoughts/${thought.slug}`} className="thought-link">
                {thought.title}
              </Link>
            </h2>
            <p className="mt-2 text-[color:var(--text-tertiary)]">{thought.cover}</p>
          </article>
        ))}
      </div>
    </>
  );
}
