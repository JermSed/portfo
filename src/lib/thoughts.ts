import fs from 'node:fs';
import path from 'node:path';

const thoughtsDir = path.join(process.cwd(), 'content/thoughts');

export type ThoughtMeta = {
  slug: string;
  title: string;
  /** Display date, e.g. "Jul 2026" */
  date: string;
  /** Short summary shown in the homepage list */
  cover: string;
};

export type Thought = ThoughtMeta & {
  /** Raw markdown body (everything below the frontmatter) */
  body: string;
};

function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { data: {}, body: raw };
  const data: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    data[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { data, body: raw.slice(match[0].length) };
}

export function getThought(slug: string): Thought | null {
  const file = path.join(thoughtsDir, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const { data, body } = parseFrontmatter(fs.readFileSync(file, 'utf8'));
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? '',
    cover: data.cover ?? '',
    body,
  };
}

export function getAllThoughts(): ThoughtMeta[] {
  if (!fs.existsSync(thoughtsDir)) return [];
  return fs
    .readdirSync(thoughtsDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const { body: _body, ...meta } = getThought(f.replace(/\.md$/, ''))!;
      return meta;
    })
    .sort((a, b) => (new Date(b.date).getTime() || 0) - (new Date(a.date).getTime() || 0));
}
