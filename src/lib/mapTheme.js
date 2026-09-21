/**
 * Map palette.
 *
 * The stock CARTO basemaps are cold and grey — serviceable, but they read as
 * "a map widget" rather than as part of this page. These palettes retune the
 * same tiles toward the warmer, softer register Apple Maps uses: cream land
 * instead of white, gentle blue water instead of slate, sage parks, and roads
 * that recede until you zoom in far enough to want them.
 *
 * One base style serves both themes and only the colours change, so switching
 * appearance is a repaint rather than a refetch — no blank flash, no reload.
 */

const LIGHT = {
  land: '#f7f4ed',
  green: '#dde8d4',
  greenDeep: '#d3e2c8',
  water: '#a9cfe4',
  waterDeep: '#9cc6de',
  residential: '#efece7',
  building: '#e8e3db',
  buildingTop: '#eeeae3',
  roadFill: '#ffffff',
  roadCase: '#e6e0d7',
  path: '#ded7cc',
  rail: '#e0dad1',
  boundary: '#ddd4c8',
  label: '#6f6759',
  labelHalo: '#f9f7f3',
  labelWater: '#5f93ad',
  labelWaterHalo: '#c3ddec',
  labelPark: '#6f8f6a',
};

const DARK = {
  land: '#1b1a18',
  green: '#292d26',
  greenDeep: '#30372b',
  water: '#16334c',
  waterDeep: '#122b41',
  residential: '#202023',
  building: '#26262a',
  buildingTop: '#2b2b30',
  roadFill: '#3a3a3f',
  roadCase: '#2a2a2e',
  path: '#33333a',
  rail: '#2e2e34',
  boundary: '#3a3a40',
  label: '#9a948a',
  labelHalo: '#141416',
  labelWater: '#6d9dba',
  labelWaterHalo: '#0f2333',
  labelPark: '#7a9576',
};

/** Land-cover layers that should read as vegetation rather than as ground. */
const GREEN_LAYERS = new Set(['landcover', 'park_national_park', 'park_nature_reserve', 'landuse']);

function colorFor(id, type, p) {
  if (id === 'background') return { 'background-color': p.land };
  if (id === 'housenumber') return null; // deliberately invisible in the base style

  if (type === 'fill') {
    if (GREEN_LAYERS.has(id)) return { 'fill-color': p.green };
    if (id === 'landuse_residential') return { 'fill-color': p.residential };
    if (id === 'water') return { 'fill-color': p.water };
    if (id === 'water_shadow') return { 'fill-color': p.waterDeep };
    if (id === 'building') return { 'fill-color': p.building };
    if (id === 'building-top') return { 'fill-color': p.buildingTop, 'fill-outline-color': p.building };
    return null;
  }

  if (type === 'line') {
    if (id === 'waterway') return { 'line-color': p.waterDeep };
    if (id.startsWith('boundary_')) return { 'line-color': p.boundary };
    if (id.includes('path')) return { 'line-color': p.path };
    if (id.startsWith('rail') || id.includes('_rail')) return { 'line-color': p.rail };
    if (id.startsWith('aeroway')) return { 'line-color': p.roadCase };
    // Casings sit under fills; colouring them separately is what keeps roads
    // legible without letting them dominate the page.
    if (id.includes('_case')) return { 'line-color': p.roadCase };
    if (id.includes('_fill')) return { 'line-color': p.roadFill };
    return null;
  }

  if (type === 'symbol') {
    if (id.startsWith('watername_')) {
      return { 'text-color': p.labelWater, 'text-halo-color': p.labelWaterHalo };
    }
    if (id.startsWith('poi_')) {
      return { 'text-color': p.labelPark, 'text-halo-color': p.labelHalo };
    }
    return { 'text-color': p.label, 'text-halo-color': p.labelHalo };
  }

  return null;
}

/**
 * Repaint every layer of the loaded style for the given appearance.
 * Safe to call repeatedly; it only ever sets paint properties.
 */
export function applyMapTheme(map, dark) {
  if (!map || !map.isStyleLoaded?.()) return false;
  const palette = dark ? DARK : LIGHT;
  const { layers } = map.getStyle();
  if (!layers) return false;

  for (const layer of layers) {
    const paint = colorFor(layer.id, layer.type, palette);
    if (!paint) continue;
    for (const [property, value] of Object.entries(paint)) {
      try {
        map.setPaintProperty(layer.id, property, value);
      } catch {
        // A layer without this property is not an error worth surfacing.
      }
    }
  }
  return true;
}

/** Pin colours, tuned to sit on the palettes above rather than on white. */
export const PIN_COLORS = {
  light: { city: '#405f9b', nature: '#5f9d68', coast: '#4aa8a4', night: '#dda049' },
  dark: { city: '#90a9d6', nature: '#7bbd83', coast: '#63c4c0', night: '#efb768' },
};
