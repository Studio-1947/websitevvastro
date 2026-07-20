/**
 * Base smooth-scroll + ScrollTrigger integration.
 *
 * The ORIGINAL static site had no JS smooth-scroll (native CSS
 * `scroll-behavior: smooth` only). Per the migration decision, Lenis is added
 * but tuned to a *neutral* feel so it does not visibly deviate from the source
 * (flagged for re-check in the Phase 6 visual/behaviour diff).
 *
 * It also wires Lenis into GSAP ScrollTrigger so scrub animations (e.g. the
 * approach-title red fill) stay in sync when Lenis drives the scroll position.
 *
 * Respects `prefers-reduced-motion` (falls back to native scrolling) and is a
 * no-op on the server.
 */
import Lenis from 'lenis';

let lenis: Lenis | null = null;

export function initSmoothScroll(): Lenis | null {
  if (typeof window === 'undefined') return null;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return null; // keep native scroll for reduced-motion users
  if (lenis) return lenis;

  lenis = new Lenis({
    // Neutral tuning: close to native inertia so the scroll feel matches source.
    duration: 0.9,
    easing: (t: number) => 1 - Math.pow(1 - t, 3),
    smoothWheel: true,
    // Never smooth touch — matches native mobile behaviour of the original.
    syncTouch: false,
  });

  // Keep ScrollTrigger in sync if/when GSAP is present on the page.
  const w = window as unknown as { ScrollTrigger?: { update: () => void } };
  lenis.on('scroll', () => {
    w.ScrollTrigger?.update();
  });

  const raf = (time: number) => {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}
