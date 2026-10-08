# Portfolio workflow demos

Five deterministic, silent, 12-second UI recreations at 1920×1080, 30fps.
These are illustrative workflow animations, not recordings of live sessions.
All records, library content, environmental overlays, and amounts are fictional.
No production credentials or constituent data are used. Disclosure is included on each project page.

Run from the portfolio root:

    node work/product-demos/composition/render.mjs

Pass one or more slugs to render selectively. Editable SVG composition code lives in
`composition/render.mjs`; review frames in `previews/`; website exports in `public/demos/`.

Source references inspected (read-only):
- FCCW: Documents/fccw/src/app/(admin)/_components/Sidebar.tsx and admin/finances/page.tsx. Overview → Shopify orders.
- Climate Cents: Documents/ctc/climate-cents/src/components/{Sidebar,LayerSelector}.tsx and utils/constants.ts. Project filtering → selection → Heat layer. Map is schematic, not a geographic dataset.
- Delphi: Documents/delphi/delphi/README.md and frontend/components/audio-input.tsx. Mic/voice visualizer → browser task → spoken response shown as captions. Conversation cards are editorial captions.
- RaiseAChild: Documents/ctc/raise-a-child/rac-frontend/src/app/components/{constituentfilter,GraphRow,navbar}.tsx. Current Status filter → saved filter → chart. No personal data from the original application.
- Tally: Documents/lava/tally/app/products/page.tsx and tallyapp/client/src/components/sideBar/sideBar.tsx. Product → variant buffer → save.

Existing Buckit and SceneFlow exports remain in their own public directories.
