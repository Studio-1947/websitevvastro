/**
 * GSAP-driven animations. Currently: the "Our Approach" headings' scroll-driven
 * red fill (backgroundPosition 100%→0% scrubbed across the scroll).
 *
 * MIGRATION note: the original loaded GSAP + ScrollTrigger from a CDN and
 * feature-detected `window.gsap`. Here they are bundled (same version, 3.12.5)
 * for parity + better Lighthouse. Behaviour/trigger points are unchanged.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;
function ensureRegistered(): void {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger);
  // Expose ScrollTrigger so smoothScroll.ts can call ScrollTrigger.update()
  // from Lenis's scroll event (matches CDN global behaviour).
  (window as unknown as { ScrollTrigger?: typeof ScrollTrigger }).ScrollTrigger =
    ScrollTrigger;
  registered = true;
}

export function approachFill(): void {
  const titles = document.querySelectorAll<HTMLElement>('.approach__title');
  if (!titles.length) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    titles.forEach((t) => (t.style.backgroundPosition = '0% 0'));
    return;
  }
  ensureRegistered();
  titles.forEach((t) => {
    gsap.fromTo(
      t,
      { backgroundPosition: '100% 0' },
      {
        backgroundPosition: '0% 0',
        ease: 'none',
        scrollTrigger: { trigger: t, start: 'top 85%', end: 'top 40%', scrub: true },
      }
    );
  });
}
