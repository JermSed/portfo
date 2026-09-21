# Portfolio audit — September 20, 2026

## Direction and implemented changes

The previous page gave biography, experience, involvement, writing, and projects nearly equal visual weight inside a narrow column. Work was difficult to discover, and a continuously drawn ASCII margin competed with the content.

The new direction is an engineer’s field journal: warm ivory / near-black with muted cobalt accents, large paired sans and italic serif typography, a custom static contour figure, numbered project cards, and original photography. Project outcomes and SceneFlow now appear before the résumé. Photography and the map live together on a dedicated page. All existing project claims and experience dates were preserved.

## Findings addressed

| Area | Finding | Resolution |
| --- | --- | --- |
| Hierarchy | Strong projects buried below several sections | Selected work immediately after introduction; featured SceneFlow diagram |
| Identity | Generic résumé layout and disconnected decoration | Cohesive contour, journal, and photography language |
| Performance | Animated canvas and map on initial home route | Removed mounted ASCII canvas; moved map to Photos; static SVG hero |
| Images | Original photos downloaded for small gallery thumbnails | Next Image responsive optimization and reserved thumbnail space; originals in viewer |
| Accessibility | Map markers were non-semantic divs | Named native buttons; keyboard activation supported |
| Map behavior | Custom click handler duplicated MapLibre popup toggling | Removed duplicate handler |
| Scroll | Map could capture normal page scrolling | Cooperative gestures enabled |
| Resilience | Map failure left an unexplained blank region | Failure notice directs visitors to accessible gallery |
| Mobile viewer | Navigation arrows hidden, requiring gestures | Visible 44px previous/next controls on mobile |
| Focus | Paging recreated focus/scroll-lock lifecycle | Restore the original thumbnail focus only when viewer unmounts |
| Reduced motion | Initial viewer animation could run before preference effect | Preference checked directly before initial animation |
| Content safety | Thought slug joined directly into filesystem path | Strict slug allowlist before filesystem access |
| Tooling | Legacy lint/test scripts and missing ESLint 9 config | Flat configuration; working lint and TypeScript commands |
| Documentation | README described Create React App and eject | Replaced with actual Next.js development/content instructions |

## Verification

- Production build and all static routes generated successfully before dependency remediation.
- ESLint and TypeScript passed with zero warnings after code changes.
- Browser inspected desktop at 1440px and mobile at 390px; no horizontal document overflow at either width.
- Photo viewer opened, advanced from Boulder line to Summer lift, closed, and restored focus to the originating thumbnail.
- Photo map loaded and exposed named marker controls and provider attribution.
- Dark appearance inspected visually. Light appearance, reduced-motion, contrast, and transparency styles reviewed in code; exhaustive assistive-technology and cross-browser testing was not performed.

## Content and deployment follow-ups

- SceneFlow and FCCW CRM have no public destination in the existing data. Kept these as honest descriptive cards, without fabricated demos or links.
- Stronger case studies would benefit from user-provided product screenshots, design decisions, and outcome details. Existing numeric claims were preserved, not independently verified.
- Canonical URL, sitemap host, and absolute social-preview URLs require the real production domain; none was invented.
- Markdown remains trusted repository-authored content. Sanitize HTML if content is ever accepted from external users or a CMS.
- The photo atlas now uses bundled Natural Earth SVG geometry. It requires no map API, remote tiles, or WebGL.
- Existing unused ASCII/map-generation assets and older dependency tooling were preserved rather than deleting unrelated in-progress work.
- No deployment was performed. Preview runs locally.

## Dependency remediation

The initial production npm audit reported 7 vulnerable packages (2 critical, 4 high, 1 moderate). Updated Next.js to installed 15.5.25 and MapLibre to 6.10.0, applied compatible dependency fixes, and scoped a PostCSS override to Next.js (`^8.5.28`) to replace its old nested version without forcing a Next.js major migration. Regenerated the stale nested lockfile entry. The final npm install audit covered all 494 packages and reported **0 vulnerabilities**. Retain the override until the framework's own pinned PostCSS is patched, then re-evaluate it.

Final verification after dependency remediation: `npm test`, `npm run build`, and `git diff --check` all passed. Home first-load JavaScript is approximately 112 kB; the map and photo viewer remain deferred from the home route.

## Photo atlas follow-up

The MapLibre 6 upgrade removed the default export used by the old map. Correcting the import restored markers, but browser verification still showed a blank basemap. Replaced the map with local Equal Earth SVG geometry, location groups, bounded zoom/reset controls, photo previews, and the existing full-screen viewer. All photos remain reachable through location buttons, including overlapping world-scale pins. Map geometry was reduced from approximately 1.3 MB to 180 kB by using Natural Earth 110m data. The generator verifies coordinate projection against d3-geo.

Atlas verification: lint, TypeScript, and the production build passed. Browser checks confirmed local land geometry renders, location selection zooms to Dublin, per-location paging changes the photo, and the full-screen viewer closes with focus restored. Rounded marker percentages to four decimal places to prevent browser/server style serialization hydration warnings; checked a fresh page after the fix.
