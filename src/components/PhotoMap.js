'use client';

import React, { useEffect, useRef, useState } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';

import { photoCategories } from '../data/resume';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
const HOME_VIEW = { center: [-30, 30], zoom: 0.9 };

function thumbUrl(url) {
  return url.replace('w=1200', 'w=200');
}

function PinCap({ color, size = 13 }) {
  // matches the ball head of the map pins, shine included
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true">
      <circle cx="8" cy="8" r="7.25" fill={color} stroke="rgba(0,0,0,0.15)" strokeWidth="0.75" />
      <circle cx="5.3" cy="5.3" r="2.2" fill="rgba(255,255,255,0.6)" />
    </svg>
  );
}

function pinElement(color) {
  // sewing-pin style: thin steel needle with a colored ball head
  const el = document.createElement('div');
  el.className = 'photo-pin';
  el.innerHTML = `
    <svg viewBox="0 0 18 42" width="18" height="42" aria-hidden="true">
      <path d="M8 15.5 L10 15.5 L9 41 Z" fill="#8b909c"/>
      <path d="M8.3 15.5 L9 15.5 L9 37 Z" fill="#d5d8de"/>
      <circle cx="9" cy="8.5" r="7.5" fill="${color}" stroke="rgba(0,0,0,0.15)" stroke-width="0.75"/>
      <circle cx="6.2" cy="5.8" r="2.3" fill="rgba(255,255,255,0.6)"/>
    </svg>`;
  return el;
}

export default function PhotoMap({ items }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [isMoved, setIsMoved] = useState(false);

  const resetView = () => {
    mapRef.current?.flyTo({ ...HOME_VIEW, duration: 1400 });
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const maplibregl = (await import('maplibre-gl')).default;
      if (cancelled || !containerRef.current) return;

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: MAP_STYLE,
        ...HOME_VIEW,
        minZoom: 0.4,
        maxZoom: 14,
        attributionControl: { compact: true },
      });
      mapRef.current = map;
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');

      map.on('moveend', () => {
        const c = map.getCenter();
        setIsMoved(
          map.getZoom() > HOME_VIEW.zoom + 0.2 ||
            Math.abs(c.lng - HOME_VIEW.center[0]) > 20 ||
            Math.abs(c.lat - HOME_VIEW.center[1]) > 15
        );
      });

      items.forEach((photo) => {
        const category = photoCategories[photo.category] || { color: '#3b82f6' };
        const el = pinElement(category.color);
        const popup = new maplibregl.Popup({ offset: 34, closeButton: false }).setHTML(
          `<div class="photo-popup">
             <img src="${thumbUrl(photo.url)}" alt="${photo.title}" />
             <div class="photo-popup-title">${photo.title}</div>
             <div class="photo-popup-loc">${photo.location}</div>
           </div>`
        );
        const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat(photo.coordinates)
          .setPopup(popup)
          .addTo(map);
        // keep the click from also reaching the map canvas
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          marker.togglePopup();
        });
        markersRef.current.push(marker);
      });
    })();

    return () => {
      cancelled = true;
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  if (!items?.length) return null;

  const lastPhoto = items[0];

  return (
    <section className="space-y-3">
      <p className="eyebrow">Last photo</p>
      <p className="flex items-center gap-2 font-sans text-sm text-neutral-600">
        <PinCap color={(photoCategories[lastPhoto.category] || { color: '#3b82f6' }).color} />
        {lastPhoto.title} · {lastPhoto.location}
      </p>
      <div className="relative">
        <div
          ref={containerRef}
          className="h-[380px] w-full overflow-hidden rounded-lg border border-neutral-200"
        />
        {isMoved && (
          <button
            onClick={resetView}
            className="absolute right-3 top-3 rounded-md border border-neutral-200 bg-white px-3 py-1.5 font-sans text-xs text-neutral-700 shadow-sm transition hover:border-neutral-400"
          >
            Whole world
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-sans text-xs text-neutral-500">
        {Object.entries(photoCategories).map(([key, { label, color }]) => (
          <span key={key} className="flex items-center gap-1.5">
            <PinCap color={color} />
            {label}
          </span>
        ))}
      </div>
      <p className="font-sans text-xs text-neutral-400">Click a pin to see the shot.</p>
    </section>
  );
}
