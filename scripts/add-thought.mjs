#!/usr/bin/env node
/**
 * Scaffold a new thought (markdown page under content/thoughts/).
 *
 * Usage:
 *   npm run add-thought -- --title "On slow software" --cover "Why the best tools feel calm."
 *   npm run add-thought -- --title "..." --cover "..." --date "Aug 2026"
 *
 * Creates content/thoughts/<slug>.md and opens it in your editor — write the
 * body in markdown; it renders at /thoughts/<slug>.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const thoughtsDir = path.join(root, 'content/thoughts');

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) args[argv[i].slice(2)] = argv[++i];
  }
  return args;
}

const { title, cover, date } = parseArgs(process.argv.slice(2));

if (!title || !cover) {
  console.error('✗ Usage: npm run add-thought -- --title "..." --cover "one-line summary" [--date "Aug 2026"]');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');
const file = path.join(thoughtsDir, `${slug}.md`);
if (fs.existsSync(file)) {
  console.error(`✗ ${file} already exists`);
  process.exit(1);
}

const displayDate =
  date ??
  new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

fs.mkdirSync(thoughtsDir, { recursive: true });
fs.writeFileSync(
  file,
  `---
title: ${title}
date: ${displayDate}
cover: ${cover}
---

Write your thought here in markdown.
`,
);

console.log(`✓ created content/thoughts/${slug}.md — it renders at /thoughts/${slug}`);

// Open in the user's editor if one is easily available
const editor = process.env.VISUAL || process.env.EDITOR;
if (editor) {
  spawnSync(editor, [file], { stdio: 'inherit' });
} else {
  spawnSync('open', ['-t', file], { stdio: 'ignore' });
}
