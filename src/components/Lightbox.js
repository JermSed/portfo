'use client';

import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import {
  CROSSFADE,
  SPRING_DISMISS,
  SPRING_MOMENTUM,
  SPRING_MOVE,
  createVelocityTracker,
  prefersReducedMotion,
  project,
  rubberband,
} from '../lib/motion';

/** Movement before we commit to an axis, so a tap isn't read as a drag. */
const AXIS_HYSTERESIS = 10;
/** Below this, the gesture was a hold rather than a throw — fall back to position. */
const FLICK_VELOCITY = 320;

/**
 * Full-bleed photo viewer.
 *
 * The surface grows out of the thumbnail that opened it and returns to it on
 * close, so the spatial relationship never breaks. It can be dragged down to
 * dismiss or sideways to page through the set, tracking the pointer 1:1 the
 * whole way; on release the pointer's velocity is projected forward to pick the
 * outcome and then handed to the spring, so there is no seam between the drag
 * and the animation. Every motion is spring-driven and can be grabbed and
 * reversed mid-flight.
 */
export default function Lightbox({ photos, index, sourceRectFor, aspectFor, onIndexChange, onClose }) {
  const photo = photos[index];
  // Reserving the photo's shape up front means the surface has real dimensions
  // before the bytes arrive, so it can be measured — and grown from the
  // thumbnail — instead of snapping in at full size once the image decodes.
  const aspect = aspectFor?.(index) ?? null;

  const rootRef = useRef(null);
  const figureRef = useRef(null);
  const imgRef = useRef(null);
  const closeButtonRef = useRef(null);

  // X and Y are independent springs. A single spring over 2D distance desyncs
  // the moment the two axes carry different velocities.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const captionOpacity = useMotionValue(0);
  const surfaceOpacity = useMotionValue(1);

  // Dragging away in either direction thins the scrim continuously, so the page
  // beneath is already showing through before the gesture is finished.
  const scrimOpacity = useTransform(y, [-420, 0, 420], [0, 1, 0], { clamp: true });
  // A bigger surface should read as thicker material: the blur deepens as the
  // viewer settles and lifts as it leaves, so the glass arrives rather than fades.
  const scrimBlur = useTransform(scrimOpacity, (v) => `blur(${(v * 24).toFixed(2)}px)`);

  const [reduced, setReduced] = useState(false);
  const dismissing = useRef(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  /* ---- Enter: grow from the thumbnail that was clicked --------------- */

  /**
   * Measure the surface as if it carried no transform.
   *
   * getBoundingClientRect reports the *visually transformed* box, so measuring
   * while a spring is mid-flight — or while the surface sits scaled down at the
   * start of the open animation — would feed the animation its own output. The
   * transform is cleared for the duration of the read and put straight back;
   * this runs once per open or close, never per frame.
   */
  const measureLayout = useCallback(() => {
    const fig = figureRef.current;
    const img = imgRef.current;
    if (!fig || !img) return null;
    const previous = fig.style.transform;
    fig.style.transform = 'none';
    const figRect = fig.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    fig.style.transform = previous;
    return { fig, figRect, imgRect };
  }, []);

  const applyOrigin = useCallback(() => {
    const measured = measureLayout();
    if (!measured) return null;
    const { fig, figRect, imgRect } = measured;
    // Scale about the image's centre, not the card's, so the photo itself is
    // what lines up with the thumbnail.
    fig.style.transformOrigin = `${imgRect.left + imgRect.width / 2 - figRect.left}px ${
      imgRect.top + imgRect.height / 2 - figRect.top
    }px`;
    return imgRect;
  }, [measureLayout]);

  /** The inverse transform that parks the surface exactly over its thumbnail. */
  const flipFromSource = useCallback(() => {
    const imgRect = applyOrigin();
    const source = sourceRectFor(index);
    if (!imgRect || !source || !imgRect.width) return null;
    return {
      x: source.left + source.width / 2 - (imgRect.left + imgRect.width / 2),
      y: source.top + source.height / 2 - (imgRect.top + imgRect.height / 2),
      scale: source.width / imgRect.width,
    };
  }, [applyOrigin, index, sourceRectFor]);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      applyOrigin();
      captionOpacity.set(1);
      return;
    }

    const runFlip = () => {
      const from = flipFromSource();
      if (!from) return false;
      x.set(from.x);
      y.set(from.y);
      scale.set(from.scale);
      animate(x, 0, SPRING_MOVE);
      animate(y, 0, SPRING_MOVE);
      animate(scale, 1, SPRING_MOVE);
      animate(captionOpacity, 1, { duration: 0.3, delay: 0.1 });
      return true;
    };

    if (runFlip()) return;

    // No layout to measure yet — wait for the image rather than letting it
    // appear at full size, which would break the tie to the thumbnail.
    const img = imgRef.current;
    if (!img) {
      captionOpacity.set(1);
      return;
    }
    const onReady = () => {
      if (!runFlip()) captionOpacity.set(1);
    };
    img.addEventListener('load', onReady, { once: true });
    return () => img.removeEventListener('load', onReady);
    // Runs once per open; paging is handled by its own transition below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  /* ---- Exit: shrink back into the thumbnail -------------------------- */

  const close = useCallback(
    (velocity = 0) => {
      if (dismissing.current) return;
      dismissing.current = true;
      animate(captionOpacity, 0, { duration: 0.15 });

      if (reduced) {
        animate(surfaceOpacity, 0, CROSSFADE).then(onClose);
        return;
      }

      const back = flipFromSource();
      if (!back) {
        // The thumbnail is gone (or off-screen) — leave along the drag instead,
        // carrying the velocity the gesture ended with.
        const target = y.get() + project(velocity);
        animate(surfaceOpacity, 0, { duration: 0.2 });
        animate(y, target, { ...SPRING_DISMISS, velocity }).then(onClose);
        return;
      }
      // Enter and exit run the same path in reverse, so the viewer returns to
      // exactly where it came from.
      animate(x, back.x, SPRING_DISMISS);
      animate(scale, back.scale, SPRING_DISMISS);
      animate(y, back.y, { ...SPRING_DISMISS, velocity }).then(onClose);
    },
    [captionOpacity, flipFromSource, onClose, reduced, scale, surfaceOpacity, x, y]
  );

  /* ---- Paging: leave and enter along the gesture's own axis ----------- */

  const paging = useRef(false);

  const goTo = useCallback(
    (nextIndex, direction, velocity = 0) => {
      if (paging.current || nextIndex === index) return;
      if (nextIndex < 0 || nextIndex >= photos.length) return;
      paging.current = true;

      if (reduced) {
        animate(surfaceOpacity, 0, CROSSFADE).then(() => {
          onIndexChange(nextIndex);
          animate(surfaceOpacity, 1, CROSSFADE).then(() => {
            paging.current = false;
          });
        });
        return;
      }

      const width = imgRef.current?.getBoundingClientRect().width || window.innerWidth;
      const exitTo = -direction * (width * 0.9);

      animate(captionOpacity, 0, { duration: 0.12 });
      animate(surfaceOpacity, 0, { duration: 0.18 });
      animate(x, exitTo, { ...SPRING_MOMENTUM, velocity }).then(() => {
        onIndexChange(nextIndex);
        // The replacement enters from the side the outgoing photo left toward,
        // so the set reads as one continuous strip rather than a stack of cards.
        x.set(direction * (width * 0.9));
        y.set(0);
        scale.set(1);
        animate(surfaceOpacity, 1, { duration: 0.18 });
        animate(captionOpacity, 1, { duration: 0.25, delay: 0.05 });
        animate(x, 0, { ...SPRING_MOMENTUM, velocity }).then(() => {
          paging.current = false;
        });
      });
    },
    [captionOpacity, index, onIndexChange, photos.length, reduced, scale, surfaceOpacity, x, y]
  );

  /* ---- The gesture --------------------------------------------------- */

  const drag = useRef(null);
  const trackX = useRef(createVelocityTracker());
  const trackY = useRef(createVelocityTracker());

  const onPointerDown = (event) => {
    if (event.button !== 0 || dismissing.current || paging.current) return;
    // Grabbing mid-flight takes over from wherever the surface currently is —
    // the springs are never allowed to finish out of the user's control.
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      startX: event.clientX,
      startY: event.clientY,
      baseX: x.get(),
      baseY: y.get(),
      axis: null,
    };
    trackX.current.reset();
    trackY.current.reset();
  };

  const onPointerMove = (event) => {
    const d = drag.current;
    if (!d) return;
    const dx = event.clientX - d.startX;
    const dy = event.clientY - d.startY;

    // Both gestures are tracked from the first move; the loser is cancelled
    // once intent is unambiguous.
    if (!d.axis) {
      if (Math.abs(dx) < AXIS_HYSTERESIS && Math.abs(dy) < AXIS_HYSTERESIS) return;
      d.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    }

    if (d.axis === 'y') {
      const next = d.baseY + dy;
      y.set(next);
      trackY.current.add(next);
      // Shrinking as it travels telegraphs the outcome before the finger lifts.
      scale.set(Math.max(0.82, 1 - Math.abs(next) / (window.innerHeight * 2.2)));
    } else {
      const atStart = index === 0 && dx > 0;
      const atEnd = index === photos.length - 1 && dx < 0;
      // At the ends of the set there is nothing more to reach, so resistance
      // builds instead of the surface simply refusing to move.
      const next =
        atStart || atEnd
          ? d.baseX + rubberband(dx, window.innerWidth)
          : d.baseX + dx;
      x.set(next);
      trackX.current.add(next);
    }
  };

  const onPointerUp = (event) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (!d.axis) return; // a tap, not a drag

    if (d.axis === 'y') {
      const velocity = trackY.current.velocity();
      const current = y.get();
      // Where the photo would coast to if it were simply let go.
      const projected = current + project(velocity);
      // A decisive flick wins on its direction alone; a slow drag is judged on
      // where it actually ended up.
      const flicked = Math.abs(velocity) > FLICK_VELOCITY;
      const dismiss = flicked
        ? Math.sign(velocity) === Math.sign(projected || velocity)
        : Math.abs(projected) > window.innerHeight * 0.22;

      if (dismiss) {
        close(velocity);
      } else {
        animate(y, 0, { ...SPRING_MOVE, velocity });
        animate(scale, 1, SPRING_MOVE);
      }
      return;
    }

    const velocity = trackX.current.velocity();
    const projected = x.get() + project(velocity);
    const width = imgRef.current?.getBoundingClientRect().width || window.innerWidth;
    const flicked = Math.abs(velocity) > FLICK_VELOCITY;
    const advanced = flicked
      ? Math.sign(velocity) < 0
      : projected < -width * 0.28;
    const retreated = flicked
      ? Math.sign(velocity) > 0
      : projected > width * 0.28;

    if (advanced && index < photos.length - 1) {
      goTo(index + 1, 1, velocity);
    } else if (retreated && index > 0) {
      goTo(index - 1, -1, velocity);
    } else {
      animate(x, 0, { ...SPRING_MOVE, velocity });
    }
  };

  /* ---- Keyboard, focus, and scroll lock ------------------------------ */

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'ArrowRight' && index < photos.length - 1) {
        e.preventDefault();
        goTo(index + 1, 1);
      } else if (e.key === 'ArrowLeft' && index > 0) {
        e.preventDefault();
        goTo(index - 1, -1);
      } else if (e.key === 'Tab') {
        // Keep focus inside the viewer — there is nothing behind it to reach.
        const focusable = root?.querySelectorAll('button:not([disabled]), a[href]');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close, goTo, index, photos.length]);

  return (
    <div ref={rootRef} className="lightbox" role="dialog" aria-modal="true" aria-label={photo.title}>
      <motion.div
        className="lightbox-scrim"
        style={{ opacity: scrimOpacity, backdropFilter: scrimBlur, WebkitBackdropFilter: scrimBlur }}
        onClick={() => close()}
      />

      <div className="lightbox-stage">
        <motion.figure
          ref={figureRef}
          className="lightbox-surface"
          style={{ x, y, scale, opacity: surfaceOpacity }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {/* Full-resolution original is intentional in the zoom viewer. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={photo.url}
            alt={photo.title}
            draggable={false}
            className="lightbox-image"
            style={aspect ? { aspectRatio: String(aspect) } : undefined}
          />
          <motion.figcaption className="lightbox-caption" style={{ opacity: captionOpacity }}>
            <span className="lightbox-caption-title">{photo.title}</span>
            <span className="lightbox-caption-meta">{photo.location}</span>
          </motion.figcaption>
        </motion.figure>
      </div>

      <div className="lightbox-controls" style={{ pointerEvents: 'none' }}>
        <button
          ref={closeButtonRef}
          type="button"
          className="lightbox-button lightbox-close"
          onClick={() => close()}
          aria-label="Close photo"
        >
          <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <button
          type="button"
          className="lightbox-button lightbox-prev"
          onClick={() => goTo(index - 1, -1)}
          disabled={index === 0}
          aria-label="Previous photo"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              d="M15 5l-7 7 7 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          type="button"
          className="lightbox-button lightbox-next"
          onClick={() => goTo(index + 1, 1)}
          disabled={index === photos.length - 1}
          aria-label="Next photo"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              d="M9 5l7 7-7 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <p className="lightbox-counter" aria-live="polite">
          {index + 1} of {photos.length}
        </p>
      </div>
    </div>
  );
}
