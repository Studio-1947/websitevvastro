/**
 * Site-wide smooth scroll (Lenis) + ScrollTrigger integration.
 *
 * Lenis drives the page scroll with a soft expo ease so wheel and keyboard
 * scrolling glide instead of stepping. Touch stays native (the mobile feel
 * people expect). In-page anchor links (`#section`, or `/page#section` on the
 * same page) are routed through Lenis so they glide too, landing under the
 * fixed header. A hash in the URL on load is honoured the same way.
 *
 * Respects `prefers-reduced-motion` (native scrolling, no Lenis) and is a
 * no-op on the server. Nested scrollers opt out with `data-lenis-prevent`.
 */
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

let lenis: Lenis | null = null;

/** Space to leave above a scroll target so the fixed header does not cover it. */
const HEADER_OFFSET = 110;

export function initSmoothScroll(): Lenis | null {
  if (typeof window === 'undefined') return null;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return null; // keep native scroll for reduced-motion users
  if (lenis) return lenis;

  lenis = new Lenis({
    duration: 1.25,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    // Never smooth touch — matches native mobile behaviour.
    syncTouch: false,
    anchors: false, // handled below with a header offset
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

  anchorLinks();
  return lenis;
}

/** Route same-page hash links (and the initial hash) through Lenis. */
function anchorLinks(): void {
  if (!lenis) return;
  const go = (hash: string, immediate = false): boolean => {
    if (!hash || hash === '#') return false;
    let target: HTMLElement | null = null;
    try { target = document.querySelector<HTMLElement>(hash); } catch { return false; }
    if (!target) return false;
    // Respect the target's own scroll-margin-top when it is larger than the header offset.
    const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    lenis?.scrollTo(target, { offset: -Math.max(HEADER_OFFSET, margin), immediate });
    return true;
  };
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]');
    if (!a || a.target === '_blank' || a.hasAttribute('data-contact-open')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname) return;
    if (go(url.hash)) {
      e.preventDefault();
      history.pushState(null, '', url.hash);
    }
  });
  if (location.hash) {
    // After layout settles (fonts, images) so the target position is right.
    window.addEventListener('load', () => go(location.hash, true), { once: true });
  }
}

export function getLenis(): Lenis | null {
  return lenis;
}
