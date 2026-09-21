'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import world from '../data/worldMap.json';

const Lightbox = dynamic(() => import('./Lightbox'), { ssr: false });
const noRect = () => null;
const tones = ['cobalt', 'plum', 'teal', 'ochre'];
const toneFor = (index) => `tone-${tones[index % tones.length]}`;

// Equal Earth, matching scripts/build-map.mjs. Geometry is bundled locally:
// no WebGL, API key, remote style, glyph, or tile requests are needed.
function project([lon, lat]) {
  const l = Math.asin(Math.sqrt(3) / 2 * Math.sin(lat * Math.PI / 180));
  const l2 = l * l;
  const l6 = l2 * l2 * l2;
  const x = (lon * Math.PI / 180 * Math.cos(l)) /
    (Math.sqrt(3) / 2 * (1.340264 - 3 * .081106 * l2 + l6 * (7 * .000893 + 9 * .003796 * l2)));
  const y = l * (1.340264 - .081106 * l2 + l6 * (.000893 + .003796 * l2));
  return [world.scale * x + world.translate[0], world.translate[1] - world.scale * y];
}

function groupPhotos(items) {
  const groups = [];
  items.forEach((photo, index) => {
    // Nearby shots share a pin, so photos taken a few metres apart stay reachable.
    let group = groups.find(g => Math.hypot(g.coordinates[0] - photo.coordinates[0], g.coordinates[1] - photo.coordinates[1]) < .9);
    if (!group) {
      group = { coordinates: photo.coordinates, indices: [], locations: [] };
      groups.push(group);
    }
    group.indices.push(index);
    if (!group.locations.includes(photo.location)) group.locations.push(photo.location);
  });
  return groups;
}

export default function PhotoMap({ items }) {
  const groups = useMemo(() => groupPhotos(items), [items]);
  const [selected, setSelected] = useState(0);
  const [shot, setShot] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [viewer, setViewer] = useState(null);
  if (!groups.length) return null;
  const group = groups[selected] || groups[0];
  const index = group.indices[shot] ?? group.indices[0];
  const photo = items[index];
  const [cx, cy] = project(group.coordinates);
  const w = world.width / zoom;
  const h = world.height / zoom;
  const x = zoom === 1 ? 0 : Math.max(0, Math.min(world.width - w, cx - w / 2));
  const y = zoom === 1 ? 0 : Math.max(0, Math.min(world.height - h, cy - h / 2));
  const choose = (i) => { setSelected(i); setShot(0); setZoom(z => Math.max(3, z)); };

  return <section aria-labelledby="atlas-heading" className="photo-atlas">
    <div className="atlas-heading"><h2 id="atlas-heading" className="eyebrow">Field notes / Photo atlas</h2><span className="meta">{items.length} photographs · {groups.length} places</span></div>
    <div className="atlas-layout">
      <div className="atlas-map" role="group" aria-label="Photo locations on a world map">
        <svg viewBox={`${x} ${y} ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
          <path d={world.sphere} className="atlas-ocean" />
          <path d={world.graticule} className="atlas-gridlines" />
          <path d={world.land} className="atlas-land" />
          <path d={world.borders} className="atlas-borders" />
        </svg>
        {groups.map((g, i) => {
          const [px, py] = project(g.coordinates);
          const left = (px - x) / w * 100;
          const top = (py - y) / h * 100;
          if (left < 0 || left > 100 || top < 0 || top > 100) return null;
          return <button type="button" key={g.locations[0]} className={`atlas-pin ${toneFor(i)}${selected === i ? ' atlas-pin-selected' : ''}`} style={{left:`${Number(left.toFixed(4))}%`,top:`${Number(top.toFixed(4))}%`}} onClick={() => choose(i)} aria-label={`${g.locations.join(' / ')}: ${g.indices.length} ${g.indices.length === 1 ? 'photo' : 'photos'}`} aria-pressed={selected === i}><span>{g.indices.length}</span></button>;
        })}
        <div className="atlas-zoom" aria-label="Map zoom"><button type="button" onClick={() => setZoom(z => Math.max(1,z - 1))} disabled={zoom === 1} aria-label="Zoom out">−</button><button type="button" onClick={() => setZoom(z => Math.min(5,z + 1))} disabled={zoom === 5} aria-label="Zoom in">+</button><button type="button" onClick={() => setZoom(1)}>World</button></div>
        <span className="atlas-map-label">{zoom === 1 ? 'A few places, a few perspectives' : 'Zoomed to selected location'}</span>
      </div>
      <div className={`atlas-preview ${toneFor(selected)}`}>
        <button type="button" className="atlas-image-button" onClick={() => setViewer(index)} aria-label={`Open ${photo.title} full screen`}><Image src={photo.url} alt={photo.title} width={720} height={480} sizes="(max-width: 700px) 100vw, 350px" /><span aria-hidden="true">↗</span></button>
        <div className="atlas-caption" aria-live="polite"><h3>{photo.title}</h3><p>{photo.location}</p></div>
        <div className="atlas-paging"><button type="button" onClick={() => setShot(s => s - 1)} disabled={shot === 0} aria-label="Previous photo at this location">←</button><span>{shot + 1} / {group.indices.length}</span><button type="button" onClick={() => setShot(s => s + 1)} disabled={shot === group.indices.length - 1} aria-label="Next photo at this location">→</button></div>
      </div>
    </div>
    <div className="atlas-places" aria-label="Choose a photo location">{groups.map((g,i) => <button type="button" key={g.locations[0]} className={toneFor(i)} aria-pressed={selected === i} onClick={() => choose(i)}>{g.locations[0]} <span>{g.indices.length}</span></button>)}</div>
    <p className="atlas-credit">Select a pin or a place to explore. Map data: <a href="https://www.naturalearthdata.com/">Natural Earth</a> · Equal Earth projection</p>
    {viewer !== null && <Lightbox photos={items} index={viewer} sourceRectFor={noRect} aspectFor={noRect} onIndexChange={setViewer} onClose={() => setViewer(null)} />}
  </section>;
}
