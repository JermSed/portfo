#!/usr/bin/env node
/**
 * Add a photo to the portfolio.
 *
 * Usage:
 *   npm run add-photo -- --src <dropbox-url-or-file-path> --title "Beach afternoon" \
 *     --location "Los Angeles, CA" --category coast [--coords "-118.39,33.84"] [--dry]
 *
 * - Downloads (Dropbox links are rewritten to direct-download) or copies the file
 * - Resizes to 1600px wide / ~80% quality via sips (macOS)
 * - Geocodes the location via OpenStreetMap if --coords is not given
 * - Prepends the entry to the photos array in src/data/resume.ts
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const resumePath = path.join(root, 'src/data/resume.ts');
const photosDir = path.join(root, 'public/photos');

const CATEGORIES = ['city', 'nature', 'coast', 'night'];

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      if (key === 'dry') args.dry = true;
      else args[key] = argv[++i];
    }
  }
  return args;
}

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

const args = parseArgs(process.argv.slice(2));
const { src, title, location, category } = args;

if (!src || !title || !location || !category) {
  fail(
    'Required: --src <url-or-path> --title "..." --location "City, ST" --category <' +
      CATEGORIES.join('|') +
      '>\nOptional: --coords "lng,lat" --dry',
  );
}
if (!CATEGORIES.includes(category)) {
  fail(`--category must be one of: ${CATEGORIES.join(', ')}`);
}

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');
const destFile = path.join(photosDir, `${slug}.jpg`);
if (fs.existsSync(destFile)) fail(`${destFile} already exists — pick a different title or remove it.`);

// 1. Fetch or copy the image
if (/^https?:\/\//.test(src)) {
  const url = src.includes('dropbox.com') ? src.replace(/([?&])dl=0/, '$1dl=1') : src;
  console.log(`↓ downloading ${url}`);
  const res = await fetch(url);
  if (!res.ok) fail(`download failed: HTTP ${res.status}`);
  fs.writeFileSync(destFile, Buffer.from(await res.arrayBuffer()));
} else {
  const from = path.resolve(src);
  if (!fs.existsSync(from)) fail(`no such file: ${from}`);
  fs.copyFileSync(from, destFile);
}

// 2. Resize for web
console.log('⧉ resizing to 1600px wide');
execFileSync('sips', ['--resampleWidth', '1600', '-s', 'formatOptions', '80', destFile, '--out', destFile], {
  stdio: 'ignore',
});
const kb = Math.round(fs.statSync(destFile).size / 1024);

// 3. Coordinates
let coords;
if (args.coords) {
  coords = args.coords.split(',').map(Number);
  if (coords.length !== 2 || coords.some(Number.isNaN)) fail('--coords must be "lng,lat"');
} else {
  console.log(`◎ geocoding "${location}"`);
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(location)}`,
    { headers: { 'User-Agent': 'portfolio-add-photo-script' } },
  );
  const [hit] = await res.json();
  if (!hit) fail(`could not geocode "${location}" — pass --coords "lng,lat" instead`);
  coords = [Number(Number(hit.lon).toFixed(4)), Number(Number(hit.lat).toFixed(4))];
  console.log(`  → [${coords}] (${hit.display_name})`);
}

// 4. Insert into resume.ts
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const entry = `  {
    title: '${esc(title)}',
    location: '${esc(location)}',
    url: '/photos/${slug}.jpg',
    coordinates: [${coords[0]}, ${coords[1]}],
    category: '${category}',
  },
`;

const marker = 'export const photos: Photo[] = [\n';
const source = fs.readFileSync(resumePath, 'utf8');
if (!source.includes(marker)) fail(`could not find photos array in ${resumePath}`);

if (args.dry) {
  fs.rmSync(destFile);
  console.log(`\n(dry run — nothing written) would prepend to photos:\n${entry}`);
} else {
  fs.writeFileSync(resumePath, source.replace(marker, marker + entry));
  console.log(`\n✓ ${slug}.jpg saved (${kb}KB) and added to src/data/resume.ts`);
}
