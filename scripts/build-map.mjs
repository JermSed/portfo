/**
 * Pre-projects the world map at build time.
 *
 * The site does not need a map engine to draw a fixed picture of the world, so
 * the projection runs here and the browser receives finished SVG paths. d3-geo,
 * topojson and the world atlas stay in devDependencies and never ship.
 *
 * Pin positions are *not* baked in: the projection's scale and translate are
 * emitted instead, and the client reprojects the handful of photo coordinates
 * with the same closed-form formula. That keeps resume.ts the single source of
 * truth for photos — adding one never means remembering to rerun this.
 *
 * Run with: npm run build-map
 */
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

import { geoEqualEarth, geoPath, geoGraticule10 } from 'd3-geo';
import { feature, mesh } from 'topojson-client';

const require = createRequire(import.meta.url);
const topo = require('world-atlas/countries-110m.json');

const WIDTH = 1000;
const sphere = { type: 'Sphere' };

// Equal Earth is an equal-area projection: no country is inflated the way
// Mercator inflates everything near the poles.
const projection = geoEqualEarth().fitWidth(WIDTH, sphere);
const bounds = geoPath(projection).bounds(sphere);
const HEIGHT = Math.ceil(bounds[1][1] - bounds[0][1]);
projection.fitExtent(
  [
    [0, 0],
    [WIDTH, HEIGHT],
  ],
  sphere
);

// One decimal is finer than a device pixel at the size this renders, and it
// roughly halves the path data.
const path = geoPath(projection).digits(1);

const out = {
  width: WIDTH,
  height: HEIGHT,
  scale: projection.scale(),
  translate: projection.translate(),
  sphere: path(sphere),
  graticule: path(geoGraticule10()),
  land: path(feature(topo, topo.objects.countries)),
  borders: path(mesh(topo, topo.objects.countries, (a, b) => a !== b)),
};

// The client reimplements the forward projection; prove the two agree before
// shipping, or the pins will drift off the coastlines.
const A1 = 1.340264;
const A2 = -0.081106;
const A3 = 0.000893;
const A4 = 0.003796;
const M = Math.sqrt(3) / 2;

function clientProject([lon, lat]) {
  const l = Math.asin(M * Math.sin((lat * Math.PI) / 180));
  const l2 = l * l;
  const l6 = l2 * l2 * l2;
  const px =
    (((lon * Math.PI) / 180) * Math.cos(l)) /
    (M * (A1 + 3 * A2 * l2 + l6 * (7 * A3 + 9 * A4 * l2)));
  const py = l * (A1 + A2 * l2 + l6 * (A3 + A4 * l2));
  return [out.scale * px + out.translate[0], out.translate[1] - out.scale * py];
}

let worst = 0;
for (const test of [
  [0, 0],
  [-122.4, 37.8],
  [-6.26, 53.35],
  [151.2, -33.9],
  [-156.3, 20.8],
  [139.7, 35.7],
  [18.4, -33.9],
  [-70, -33],
]) {
  const a = projection(test);
  const b = clientProject(test);
  worst = Math.max(worst, Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));
}
if (worst > 0.001) {
  console.error(`projection mismatch of ${worst}px — client formula is out of step`);
  process.exit(1);
}

writeFileSync(new URL('../src/data/worldMap.json', import.meta.url), JSON.stringify(out));

const kb = (s) => `${(Buffer.byteLength(s) / 1024).toFixed(1)}kB`;
console.log(`viewBox    0 0 ${WIDTH} ${HEIGHT}`);
console.log(`land       ${kb(out.land)}`);
console.log(`borders    ${kb(out.borders)}`);
console.log(`graticule  ${kb(out.graticule)}`);
console.log(`total      ${kb(JSON.stringify(out))}`);
console.log(`projection agrees to ${worst.toExponential(1)}px`);
