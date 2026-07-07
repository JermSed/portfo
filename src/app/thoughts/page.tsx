import type { Metadata } from 'next';
import Link from 'next/link';

import SiteFooter from '../../components/SiteFooter';
import SiteNav from '../../components/SiteNav';
import { profile } from '../../data/resume';
import { getAllThoughts } from '../../lib/thoughts';

export const metadata: Metadata = {
  title: 'Thoughts · Jeremy Sedillo',
  description: 'Writing and raw thoughts',
};

export default function ThoughtsPage() {
  const thoughts = getAllThoughts();

  return (
    <main className="container-page">
      <SiteNav />

      <header className="mt-16 md:mt-24">
        <h1 className="text-4xl md:text-5xl leading-tight">Thoughts</h1>
        <p className="eyebrow mt-3">
          Writing · {thoughts.length} {thoughts.length === 1 ? 'thought' : 'thoughts'}
        </p>
      </header>

      <p className="mt-10 text-[19px] leading-8 text-neutral-700">
        Things I&apos;ve been thinking about, written down.
      </p>

      <div className="mt-14 space-y-10">
        {thoughts.map((thought) => (
          <article key={thought.slug}>
            <div className="font-sans text-[11px] uppercase tracking-[0.14em] text-neutral-400">
              {thought.date}
            </div>
            <Link
              href={`/thoughts/${thought.slug}`}
              className="mt-1.5 block text-2xl leading-snug text-neutral-900 no-underline decoration-neutral-300 underline-offset-4 hover:underline"
            >
              {thought.title}
            </Link>
            <p className="mt-2 text-[17px] leading-relaxed text-neutral-500">{thought.cover}</p>
          </article>
        ))}
      </div>

      <SiteFooter socials={profile.socials} email={profile.email} />
    </main>
  );
}
