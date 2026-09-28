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

## Page characters

`src/components/StickWorld.tsx` mounts three procedural canvas characters on the Work page only in muted blue, lilac, and sage. The reusable `createStickWorld(canvas, config)` module lives in `src/lib/stick-world/`. It accepts a character count (1–3), behavior flags, gravity/walk/run speeds, and debug mode, and returns `setPaused`, `setDebug`, and `destroy`.

The first version includes walking, running, anticipated ballistic jumps, falling and landing, ledge grabs and climbing, sitting, naps, cursor reactions, occasional waves and races. Personalities affect exploration, speed, jump range, rest, and cursor play. Rescue choreography and pushing/pulling scenes are future extensions.

Geometry is capped at 100 useful DOM surfaces and refreshed through resize/mutation/scroll invalidation, with a 120 ms scan throttle. Characters use document coordinates and ride their current element when it moves; offscreen characters keep exploring the document while only visible figures are drawn. Hidden tabs stop animation. The canvas does not capture pointer events, touch devices skip cursor behaviors, and reduced-motion preferences disable the characters. Pause/Hide controls are available; Hide persists locally. Other routes exclude them. Each figure chooses its own actions and social timing, with personality-weighted exploration, greetings, races, and shared rests. Walking accelerates and brakes gradually; articulated poses blend between actions, and nearby walls support deliberate climbing. Exploration considers the whole page, with varied jump arcs, edge departures for long descents, and timed pursuit/tag across surfaces. Section-aware journeys alternate down and back up the page, remember recent landings, and use a smooth page-edge climbing route after roughly 16–24 seconds without leaving a section. Cursor and social interruptions cannot indefinitely delay a journey.

Add `data-stick-surface` to include an element or `data-stick-ignore` to exclude an entire subtree. Development builds expose a Debug button showing surfaces, states, velocity, destination lines, and planned trajectories. `npm run test:characters` checks landing, jumping, layout attachment, disappearing surfaces, and boundaries, plus three seeded four-minute simulations that require every character to visit at least four disconnected sections.

Character posing lives in `src/lib/stick-world/pose.ts`: two-bone inverse kinematics, document-space foot planting, alternating hand targets, and damped springs for attention, balance, arm follow-through, and impact compression. Movement intentions include a personality-dependent observation pause before commitment.

Browser-pet interaction: drag an individual figure to pick it up, then release to drop or throw it. Only the small character handles receive pointer input; the canvas remains transparent to page interactions. Focus a character and press Enter/Space to wave. The development debug toggle is available with `?debug-characters`. Behavior inspiration: https://github.com/Skittlq/alan-beckers-stickfigures-unofficial (especially its environment-conditioned behavior chains). No Java runtime, sprites, or source from that repository are bundled.
