import { marked } from 'marked';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import SiteFooter from '../../../components/SiteFooter';
import SiteNav from '../../../components/SiteNav';
import { profile } from '../../../data/resume';
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
    title: `${thought.title} · Jeremy Sedillo`,
    description: thought.cover,
  };
}

export default async function ThoughtPage({ params }: Props) {
  const { slug } = await params;
  const thought = getThought(slug);
  if (!thought) notFound();

  const html = await marked.parse(thought.body);

  return (
    <main className="container-page">
      <SiteNav />

      <header className="mt-16 md:mt-24">
        <p className="eyebrow">{thought.date}</p>
        <h1 className="mt-3 text-4xl leading-tight md:text-5xl">{thought.title}</h1>
      </header>

      <article
        className="thought-body mt-10"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <p className="mt-14">
        <Link href="/thoughts" className="body-link font-sans text-sm">
          ← All thoughts
        </Link>
      </p>

      <SiteFooter socials={profile.socials} email={profile.email} />
    </main>
  );
}
