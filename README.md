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

## Private content studio (local only)

Run `npm run studio` and open the private link printed in the terminal after the server is ready. The editor runs separately at `127.0.0.1:3001` (override with `STUDIO_PORT`) and uses a separate `.next-studio` build folder. Keep the terminal running while editing; Ctrl+C closes it. A fresh launch creates a new access token and invalidates older sessions.

- **Write a thought:** enter a title, introduction, date, and Markdown body. Save locally, then open the resulting page to review the rendered article.
- **Add a photo:** choose a JPEG, PNG, or WebP (20 MB maximum), caption it, and choose a saved place or enter a new location with approximate map coordinates. Images are orientation-corrected, resized to a maximum 2000 px edge, and stripped of metadata.
- Thoughts are saved in `content/thoughts/`; photo entries are appended to `content/photos.json` and images to `public/photos/`. Existing content is preserved. New filenames use unique suffixes.
- Saving changes only the repository and local preview. Review, commit, and deploy those files through the usual workflow to update the live site.

The studio is disabled outside development and without the launcher environment. Its page and write endpoints require a temporary HTTP-only, SameSite=Strict session, loopback Host validation, and same-origin POSTs. It has no public navigation link. This protects against website visitors and other devices, not someone who already controls your OS account. Never configure `STUDIO_ENABLED` or `STUDIO_TOKEN` on your hosting provider.
