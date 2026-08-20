/**
 * Client entry — mirrors the original js/main.js IIFE call order.
 *
 * Split for performance: the always-needed, small modules are imported
 * statically (one eager bundle every page pays for), while the heavy and
 * page-specific ones are dynamic imports gated on markup presence, so a
 * visitor to /blog/ never parses GSAP, the audio engine, or the team modal.
 *
 *   • GSAP + ScrollTrigger (animations.ts) is the biggest chunk by far and is
 *     only used by the homepage's "Our Approach" fill — it loads when the
 *     section nears the viewport, not at startup.
 *   • The pluckable-string audio engine loads with the same section.
 *   • heroAurora / faq / carousel / cocreate / personModal / lightbox load
 *     only where their markup exists (marquee is a three-line no-op, so it
 *     stays in the eager bundle).
 *
 * Every module is null-guarded, so a gated module that runs where its markup
 * exists behaves exactly as the original did on that page.
 */
import { scrollReveal, countUps } from './reveal';
import { mobileMenu } from './mobileMenu';
import { navDropdowns, headerPill } from './nav';
import { duplicateMarquees } from './marquee';
import { hydrateYear, darjeelingLive } from './darjeeling';
import { contactModal } from './contactModal';
import { contactForms } from './formSubmit';
import { initSmoothScroll } from './smoothScroll';

/** Import `load` only when `sel` exists on this page. */
function when(sel: string, load: () => Promise<void>): void {
  if (document.querySelector(sel)) void load().catch(() => {});
}

/**
 * Import `load` when `sel` exists and is about to enter the viewport — used
 * for below-the-fold work (GSAP, audio) that the user hasn't reached yet.
 * Root-margin 120% means the chunk starts fetching a full viewport before the
 * section arrives, so it is ready long before the user sees it. Falls back to
 * loading immediately where IntersectionObserver is unavailable.
 */
function whenNear(sel: string, load: () => Promise<void>): void {
  const el = document.querySelector(sel);
  if (!el) return;
  // A failed chunk fetch must not surface as an unhandled rejection.
  const loadSafely = () => load().catch(() => {});
  if (!('IntersectionObserver' in window)) {
    loadSafely();
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        loadSafely();
      }
    },
    { rootMargin: '120% 0px' }
  );
  io.observe(el);
}

function init(): void {
  // Smooth scroll first so ScrollTrigger (in approachFill) syncs to Lenis.
  initSmoothScroll();

  // Same call order as the original init() for the always-needed modules.
  scrollReveal();
  countUps();
  mobileMenu();
  navDropdowns();
  headerPill();
  duplicateMarquees();
  hydrateYear();
  darjeelingLive();
  contactModal();
  contactForms();

  // ── Lazy: homepage "Our Approach" section ────────────────────────────────
  // GSAP fills the section titles; reduced-motion visitors get the final
  // state immediately without fetching GSAP (mirrors animations.ts's own
  // reduced-motion branch), everyone else loads it as the section approaches.
  // The section markup today uses .astep__title, so .approach__title is
  // absent and GSAP never loads — kept gated so it returns if the fill
  // markup ever comes back.
  const titles = document.querySelectorAll<HTMLElement>('.approach__title');
  if (titles.length) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      titles.forEach((t) => (t.style.backgroundPosition = '0% 0'));
    } else {
      whenNear('.approach__title', () => import('./animations').then((m) => m.approachFill()));
    }
  }
  // The pluckable strings live in the same section, gated on their own
  // markup so a page without the section never fetches the audio engine.
  whenNear('[data-approach] .astep', () => import('./approachStrings').then((m) => m.approachStrings()));

  // ── Lazy: page-specific modules, gated on their own markup ───────────────
  when('[data-hero-aurora]', () => import('./heroAurora').then((m) => m.heroAurora()));
  when('.faq__item', () => import('./faq').then((m) => m.accordion()));
  when('[data-commit]', () => import('./carousel').then((m) => m.commitmentCarousel()));
  when('.cocreate__line', () => import('./cocreate').then((m) => m.cocreateCycle()));
  when('.team-card[data-person]', () => import('./personModal').then((m) => m.personModal()));
  when('.case-figure--zoom', () => import('./lightbox').then((m) => m.caseLightbox()));
  when('[data-char-morph]', () => import('./charMorph').then((m) => m.charMorph()));
  when('[data-work-rail]', () => import('./workRail').then((m) => m.workRail()));
  when('[data-spotlight]', () => import('./spotlight').then((m) => m.spotlightCards()));
  when('[data-views]', () => import('./views').then((m) => m.projectViews()));
  when('[data-footer-strip]', () => import('./footerStrip').then((m) => m.footerStrip()));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
