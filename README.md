# Jeremy Sedillo — portfolio

A Next.js App Router portfolio for engineering work, writing, and photography. TypeScript, React, Tailwind CSS, Motion, and a local SVG photo atlas.

## Development

```sh
npm ci
npm run dev
```

## Checks and production

```sh
npm test        # ESLint and TypeScript checks; not a unit test suite
npm run build  # Production compilation and static route generation
npm start      # Serve the production build
```

## Content

- `src/data/resume.ts`: profile, projects, experience, photo captions and coordinates.
- `content/thoughts/*.md`: trusted, repository-authored Markdown with title, date, and cover frontmatter. Do not accept untrusted HTML here.
- `public/photos`: original photographs. Gallery thumbnails use Next Image optimization; the viewer retains originals.
- `public/Jeremy_Sedillo_Resume.pdf`: downloadable résumé.
- `npm run add-photo` and `npm run add-thought`: content helper scripts.

## Design

An editorial field journal: warm ivory, near-black, and muted cobalt, oversized sans/serif typography, a static contour illustration, numbered project cards, and photographic field notes. Supports system dark mode, reduced motion, high contrast, and reduced transparency. The interactive photo atlas is on `/photos` to keep map code away from the home page.

The atlas uses bundled Natural Earth geometry and needs no external map services. Regenerate it with `node scripts/build-map.mjs`. Deploy with a Next.js-compatible runtime for image optimization. See `AUDIT.md` for findings and remaining limitations.
