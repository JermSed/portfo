'use client';

import { useEffect, useRef } from 'react';

// A granular surface: each grain carries position and velocity. The swept
// pointer stirs a compact wake, friction removes momentum, and the dune bed
// draws grains back in. The flow circulates rather than excavating a hole.
export default function SandBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !ctx) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0, height = 0, frame = 0, last = 0, phase = 0;
    let grains = new Float32Array(0);
    const stride = 8;
    const pointer = { x: -1000, y: -1000, px: -1000, py: -1000, active: false };
    let seed = 47;
    const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) | 0; return (seed >>> 0) / 4294967296; };

    function resize() {
      width = innerWidth; height = innerHeight;
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      canvas!.width = Math.round(width * dpr); canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed = 47;
      const count = Math.min(72000, Math.round(width * height / 14));
      grains = new Float32Array(count * stride);
      for (let i = 0; i < grains.length; i += stride) {
        const x = random() * width, y = random() * height;
        // Concentrate brighter grains along sinuous wind-shaped ridges.
        const ridge = Math.sin(x / width * 5.4 + Math.sin(y / height * 5) * 1.8 + y / height * 3.5);
        grains[i] = grains[i + 2] = x;
        grains[i + 1] = grains[i + 3] = y;
        grains[i + 6] = Math.pow(Math.abs(ridge), 7) * .65 + random() * .35;
        grains[i + 7] = .55 + random() * .8;
      }
      pointer.active = false;
      if (motion.matches) draw(0);
    }

    function draw(dt: number) {
      ctx!.clearRect(0, 0, width, height);
      const step = Math.min(dt * 60, 2);
      phase += dt * .055;
      const dx = pointer.x - pointer.px, dy = pointer.y - pointer.py;
      const segment = dx * dx + dy * dy;
      const radius = 48;
      const travel = Math.sqrt(segment);
      const directionX = travel ? dx / travel : 0;
      const directionY = travel ? dy / travel : 0;
      // Integrate travel once, independent of frame duration. Clamp rapid jumps
      // so entering the viewport cannot throw grains across the page.
      const stirring = Math.min(travel, 24) * .16;
      const colors = ['#a3a3a3', '#909090', '#737373'];
      for (let band = 0; band < 3; band++) {
        ctx!.fillStyle = colors[band];
        ctx!.globalAlpha = [.07, .1, .14][band];
        ctx!.beginPath();
        for (let i = 0; i < grains.length; i += stride) {
          const tone = grains[i + 6];
          if ((tone < .25 ? 0 : tone < .65 ? 1 : 2) !== band) continue;
          let x = grains[i], y = grains[i + 1];
          const homeX = grains[i + 2], homeY = grains[i + 3];
          if (step) {
            let vx = grains[i + 4], vy = grains[i + 5];
            if (pointer.active && segment > .02) {
              const t = segment > 0 ? Math.max(0, Math.min(1, ((x - pointer.px) * dx + (y - pointer.py) * dy) / segment)) : 0;
              const rx = x - (pointer.px + dx * t), ry = y - (pointer.py + dy * t);
              const along = (rx * directionX + ry * directionY) / radius;
              const across = (-rx * directionY + ry * directionX) / radius;
              const distanceSq = along * along + across * across;
              if (distanceSq < 6.25) {
                // A divergence-free dipole: grains follow the stroke through
                // its center and circulate back along its sides. Unlike radial
                // repulsion, this has no source that empties the cursor path.
                const falloff = Math.exp(-distanceSq * 2);
                const forward = (1 - 4 * across * across) * falloff * stirring;
                const sideways = 4 * along * across * falloff * stirring;
                vx += forward * directionX - sideways * directionY;
                vy += forward * directionY + sideways * directionX;
              }
            }
            const driftX = Math.sin(phase + homeY * .003) * 6;
            const driftY = Math.cos(phase * .7 + homeX * .003) * 4;
            vx += (homeX + driftX - x) * .022 * step;
            vy += (homeY + driftY - y) * .022 * step;
            const friction = Math.exp(-.32 * step);
            vx *= friction; vy *= friction;
            x += vx * step; y += vy * step;
            grains[i] = x; grains[i + 1] = y;
            grains[i + 4] = vx; grains[i + 5] = vy;
          }
          ctx!.rect(x, y, grains[i + 7], grains[i + 7]);
        }
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
      pointer.px = pointer.x; pointer.py = pointer.y;
    }
    function tick(now: number) {
      if (!document.hidden) draw(last ? Math.min((now - last) / 1000, .033) : 0);
      last = now;
      if (!motion.matches) frame = requestAnimationFrame(tick);
    }
    function move(event: PointerEvent) {
      if (event.pointerType === 'touch' || motion.matches) return;
      if (!pointer.active) { pointer.px = event.clientX; pointer.py = event.clientY; }
      pointer.x = event.clientX; pointer.y = event.clientY; pointer.active = true;
    }
    const leave = () => { pointer.active = false; };
    const restart = () => { cancelAnimationFrame(frame); last = 0; if (motion.matches) draw(0); else frame = requestAnimationFrame(tick); };
    const observer = new MutationObserver(() => { if (motion.matches) draw(0); });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    resize(); restart();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    window.addEventListener('blur', leave);
    motion.addEventListener('change', restart);
    return () => {
      cancelAnimationFrame(frame); observer.disconnect();
      window.removeEventListener('resize', resize); window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave); window.removeEventListener('blur', leave);
      motion.removeEventListener('change', restart);
    };
  }, []);

  return <div className="sand-background" aria-hidden="true"><div className="sand-dunes" /><canvas ref={canvasRef} /></div>;
}
