# Portfolio product demos

The current exports are actual application recordings, replacing the earlier illustrated workflows.

## Sources

- FCCW: `/Users/jermsed/Documents/fccw`. Finance overview, sync response, donation and membership charts, product revenue. Local-only fixture records and sync response; no production CRM access. Organization: https://fccwla.org/mission-core-values/
- RaiseAChild: `/Users/jermsed/Documents/ctc/raise-a-child/rac-frontend`. Existing reporting UI; preferred-language filter applied to a chart. Local fictional report aggregates and authenticated preview shell. No constituent records. Organization: https://www.raiseachild.org/
- Climate Cents: `/Users/jermsed/Documents/ctc/climate-cents`. Actual Mapbox/project-list UI, search and project selection, with three fictional project locations. Environmental data fetches disabled in the isolated preview; no invented measurements. Partnership: https://www.blueskyla.org/our-mission
- Tally: `/Users/jermsed/Documents/lava/tally`. Existing sample products; opening the product editor and reviewing variants/material quantities. No changes saved.
- Delphi: original public LA Hacks demo linked from https://devpost.com/software/delphi-lxes1j — https://www.youtube.com/watch?v=RBP_OAc2pQA. Left panel: seconds 48–60 (voice interface); right: seconds 68–92 at 2x (browser agent). These are different moments edited side by side, not a synchronized recording. The original prototype frontend was also run locally; a live voice-agent execution was not verified.

The nonprofit applications were run as isolated copies under `/tmp/portfolio-app-previews`; data/auth adapters were changed only in those copies. No production records or credentials are included. FCCW's repository README misidentifies the organization; the portfolio uses the official nonprofit description instead.

## Rendering

`node work/product-demos/composition/render.mjs` renders the four desktop apps from compact source masters. If local capture frames exist, it assembles those first. Browser captures were taken at 1280×720 and 10fps, then interpolated to 30fps at 1920×1080. Interaction frames contain actual application state, without fabricated cursor overlays.

`node work/product-demos/composition/render-delphi.mjs` renders Delphi from the two trimmed masters. The original portrait recording is preserved locally but not committed. SVG labels remain editable.

- `source/`: captured/trimmed master videos
- `composition/`: deterministic edit scripts and vector graphics
- `captures/`: local individual browser frames (ignored)
- `previews/`: local QA sheets and screenshots (ignored)
- `../../public/demos/`: H.264, muted, fast-start website exports and posters

Application playback: cards play on hover/focus, project pages loop while visible. Reduced-motion preferences disable automatic playback. No visible play/pause icon.
