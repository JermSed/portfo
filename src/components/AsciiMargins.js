'use client';

import React, { useEffect, useRef } from 'react';

// Sparse-to-dense glyph ramp — most cells stay empty so the effect reads
// as drifting wisps of text, not a wall of characters
const RAMP = [
  ' ', ' ', '.', ',', ':', ';', '·', '~', '-', '=', '!', '?', 'i', 'l',
  '(', ')', '[', ']', '{', '}', '*', '&', '%', '#', '@',
];

const CELL_W = 9;
const CELL_H = 16;
const FRAME_MS = 90; // ~11fps, deliberate terminal cadence

// Smooth 2D value noise in [0, 1]
function noise2(x, y) {
  const hash = (ix, iy) => {
    const s = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453;
    return s - Math.floor(s);
  };
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy);
  const b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1);
  const d = hash(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

/**
 * ASCII flow field in the page margins — monospace characters drift
 * upward like smoke, driven by layered noise. Decorative only; hidden
 * on small screens and static for reduced-motion users.
 */
export default function AsciiMargins() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf;
    let last = 0;
    let t = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const size = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `12px ui-monospace, Menlo, Monaco, monospace`;
      ctx.textBaseline = 'top';
    };

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // Margin bands either side of the centered 672px content column
      const margin = (w - 672) / 2 - 36;
      if (margin < 70) return;

      const rows = Math.ceil(h / CELL_H);
      const cols = Math.floor(margin / CELL_W);

      for (const side of ['left', 'right']) {
        const x0 = side === 'left' ? 20 : w - 20 - cols * CELL_W;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            // Sample a rising, slowly morphing field (y drifts with time)
            const nx = (side === 'left' ? c : c + 900) * 0.14;
            const ny = r * 0.11 - t * 0.5;
            let v = noise2(nx, ny) * 0.65 + noise2(nx * 2.3 + 40, ny * 2.1 - t * 0.2) * 0.35;

            // Denser toward the page edge, but with an outer falloff so the
            // outermost columns never form a solid flowing line
            const edgeFade = side === 'left' ? 1 - c / cols : (c + 1) / cols;
            const outerFade =
              side === 'left' ? Math.min(1, (c + 1) / 4) : Math.min(1, (cols - c) / 4);
            v *= (0.45 + 0.55 * edgeFade) * outerFade;

            const idx = Math.floor(Math.pow(v, 3) * RAMP.length);
            const ch = RAMP[Math.min(idx, RAMP.length - 1)];
            if (ch === ' ') continue;

            ctx.fillStyle = `rgba(115, 115, 115, ${0.12 + v * 0.4})`;
            ctx.fillText(ch, x0 + c * CELL_W, r * CELL_H);
          }
        }
      }
    };

    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (now - last < FRAME_MS) return;
      t += (now - last) / 1000;
      last = now;
      draw();
    };

    size();
    if (reduceMotion) {
      draw(); // single static frame
    } else {
      raf = requestAnimationFrame(loop);
    }

    const onResize = () => {
      size();
      draw();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="margin-ascii" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
