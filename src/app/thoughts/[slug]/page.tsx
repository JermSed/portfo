import { marked } from 'marked';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getAllThoughts, getThought } from '../../../lib/thoughts';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllThoughts().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const thought = getThought(slug);
  if (!thought) return {};
  return {
    title: thought.title,
    description: thought.cover,
  };
}

export default async function ThoughtPage({ params }: Props) {
  const { slug } = await params;
  const thought = getThought(slug);
  if (!thought) notFound();

  const html = await marked.parse(thought.body);

  return (
    <>
      <header className="page-header">
        <p className="eyebrow">{thought.date}</p>
        <h1 className="mt-3">{thought.title}</h1>
      </header>

      <article className="thought-body mt-10" dangerouslySetInnerHTML={{ __html: html }} />

      {/* The way back out is always visible from the bottom of the piece. */}
      <p className="mt-14">
        <Link href="/thoughts" className="body-link font-sans text-[length:var(--text-small)]">
          ← All thoughts
        </Link>
      </p>
    </>
  );
}
