# Portfolio product demos

FCCW, RaiseAChild, Climate Cents, and Tally use application recordings. Delphi is a user-requested recreation of its actual voice interface and an illustrative browser task.

## Sources

- FCCW: `/Users/jermsed/Documents/fccw`. Finance overview, sync response, donation and membership charts, product revenue. Local-only fixture records and sync response; no production CRM access. Organization: https://fccwla.org/mission-core-values/
- RaiseAChild: `/Users/jermsed/Documents/ctc/raise-a-child/rac-frontend`. Existing reporting UI; preferred-language filter applied to a chart. Local fictional report aggregates and authenticated preview shell. No constituent records. Organization: https://www.raiseachild.org/
- Climate Cents: `/Users/jermsed/Documents/ctc/climate-cents`. Actual Mapbox/project-list UI, search and project selection, with three fictional project locations. Environmental data fetches disabled in the isolated preview; no invented measurements. Partnership: https://www.blueskyla.org/our-mission
- Tally: `/Users/jermsed/Documents/lava/tally`. Existing sample products; opening the product editor and reviewing variants/material quantities. No changes saved.
- Delphi: recreated from `/Users/jermsed/Documents/delphi/delphi/frontend/app/page.tsx` and `components/audio-input.tsx`. Keeps the original title, radial 50-bar microphone visualizer, and listening/speaking statuses. The browser pane is an editorial composition using a screenshot of https://en.wikipedia.org/wiki/Screen_reader; captions are illustrative dialogue, not a recorded agent result. Wikipedia text by its contributors, CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/). The original hackathon footage remains in source archives, but is no longer used in the website video. Live browser execution was blocked by exhausted API credits; this recreation was explicitly requested by the user.

The nonprofit applications were run as isolated copies under `/tmp/portfolio-app-previews`; data/auth adapters were changed only in those copies. No production records or credentials are included. FCCW's repository README misidentifies the organization; the portfolio uses the official nonprofit description instead.

## Rendering

`node work/product-demos/composition/render.mjs` renders the four desktop apps from compact source masters. If local capture frames exist, it assembles those first. Browser captures were taken at 1280×720 and 10fps, then interpolated to 30fps at 1920×1080. Interaction frames contain actual application state, without fabricated cursor overlays.

`node work/product-demos/composition/render-delphi.mjs` renders Delphi’s 14-second recreated workflow from editable SVG frames and the captured Wikipedia page. No title slides, filmed presenters, or terminals. Burned-in captions communicate the illustrative voice exchange while muted.

- `source/`: captured/trimmed master videos
- `composition/`: deterministic edit scripts and vector graphics
- `captures/`: local individual browser frames (ignored)
- `previews/`: local QA sheets and screenshots (ignored)
- `../../public/demos/`: H.264, muted, fast-start website exports and posters

Application playback: cards play on hover/focus, project pages loop while visible. Reduced-motion preferences disable automatic playback. No visible play/pause icon.
