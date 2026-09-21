/**
 * Motion foundation.
 *
 * Apple describes springs with two designer-facing parameters instead of the
 * physics triplet: `damping` (overshoot; 1.0 = critically damped) and
 * `response` (how fast it reaches the target, in seconds — not a duration,
 * since a spring has no fixed one). Motion's `bounce` + `duration` spring API
 * maps onto those directly, with `bounce ≈ 1 - damping`.
 *
 * House style: critically damped everywhere by default. Bounce is reserved for
 * motion the user physically threw — overshoot on a menu that merely faded in
 * feels wrong; overshoot on a card you flicked feels right.
 */

/** Move / reposition. damping 1.0, response 0.4 */
export const SPRING_MOVE = { type: 'spring', bounce: 0, duration: 0.4 };

/** Drawer / sheet. damping 0.8, response 0.3 */
export const SPRING_SHEET = { type: 'spring', bounce: 0.2, duration: 0.3 };

/** Release after a flick — the gesture carried momentum, so it may overshoot. */
export const SPRING_MOMENTUM = { type: 'spring', bounce: 0.2, duration: 0.4 };

/** Dismiss: the surface is leaving, so it must not overshoot on the way out. */
export const SPRING_DISMISS = { type: 'spring', bounce: 0, duration: 0.3 };

/**
 * Apple's momentum projection, from the *Designing Fluid Interfaces* sample
 * code. Given a release velocity, where would the content coast to a stop?
 * Snap targets are chosen from the projected endpoint, not the release point —
 * that is what makes a flick feel like it throws the element.
 *
 * Note this is the exponential-decay form, not the textbook v²/(2·decel).
 *
 * @param {number} initialVelocity px/s at release
 * @param {number} decelerationRate 0.998 ≈ normal scroll feel, 0.99 = snappier
 * @returns {number} px travelled beyond the release point
 */
export function project(initialVelocity, decelerationRate = 0.998) {
  return ((initialVelocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/**
 * Progressive resistance past a boundary. A hard stop reads as "frozen"; the
 * further past the bound you drag, the less the element follows, which reads as
 * "responsive, but there's nothing more here."
 */
export function rubberband(overshoot, dimension, constant = 0.55) {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

/** True when the user has asked for reduced motion. Safe during SSR. */
export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Reduced motion means a gentler, non-vestibular equivalent — not the absence
 * of feedback. Springs and travel are replaced by a short opacity cross-fade,
 * which still communicates that something changed.
 */
export const CROSSFADE = { duration: 0.2, ease: 'easeOut' };

/**
 * A short position/timestamp history, so velocity at release comes from the
 * actual recent motion rather than a single frame's delta (which is noisy, and
 * reads as zero if the finger paused for one frame before lifting).
 */
export function createVelocityTracker(samples = 5) {
  const history = [];
  return {
    add(value) {
      history.push({ value, time: performance.now() });
      if (history.length > samples) history.shift();
    },
    /** @returns {number} px/s over the tracked window */
    velocity() {
      if (history.length < 2) return 0;
      const first = history[0];
      const last = history[history.length - 1];
      const dt = (last.time - first.time) / 1000;
      if (dt <= 0) return 0;
      return (last.value - first.value) / dt;
    },
    reset() {
      history.length = 0;
    },
  };
}
