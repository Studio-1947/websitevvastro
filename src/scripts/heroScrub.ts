/**
 * Scroll-scrubbed case hero (opt-in per case: `hero.scrub` in the work JSON).
 *
 * The hero is a tall track whose stage pins to the viewport. As the reader
 * scrolls through the track the film's currentTime follows the scroll, so the
 * footage plays forwards and backwards with the wheel instead of on a timer.
 * The last stretch of the track holds the final frame while the scrim and the
 * case title settle in over it.
 *
 * Progressive: the markup is an ordinary still hero (poster + title) until
 * this runs and adds `is-live`. Reduced-motion visitors keep that still hero.
 */
import { getLenis } from './smoothScroll';

/** Share of the track the film plays over; the rest holds the last frame. */
const FILM_END = 0.82;
/** Easing of the playhead towards the scroll position (0..1 per frame). */
const FOLLOW = 0.18;

export function heroScrub(): void {
  const hero = document.querySelector<HTMLElement>('[data-hero-scrub]');
  const video = hero?.querySelector<HTMLVideoElement>('[data-scrub-video]');
  if (!hero || !video) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const bar = hero.querySelector<HTMLElement>('[data-scrub-bar]');
  const skip = hero.querySelector<HTMLButtonElement>('[data-scrub-skip]');

  hero.classList.add('is-live');

  // iOS only paints seeks on a video that has been played once. It is muted
  // and inline, so this is allowed without a gesture.
  video.pause();
  const unlock = video.play();
  if (unlock) unlock.then(() => video.pause()).catch(() => {});

  let target = 0;
  let shown = -1;
  let running = false;

  const progress = (): number => {
    const r = hero.getBoundingClientRect();
    const run = r.height - window.innerHeight;
    if (run <= 0) return 0;
    return Math.min(1, Math.max(0, -r.top / run));
  };

  const tick = (): void => {
    const p = progress();
    hero.style.setProperty('--scrub-p', p.toFixed(4));
    // Title and scrim come in over the held last frame.
    const reveal = Math.min(1, Math.max(0, (p - FILM_END) / (1 - FILM_END - 0.04)));
    hero.style.setProperty('--scrub-reveal', reveal.toFixed(3));
    hero.classList.toggle('is-started', p > 0.015);
    hero.classList.toggle('is-done', p > 0.97);
    if (bar) bar.style.transform = `scaleX(${p})`;

    const d = video.duration;
    if (d && Number.isFinite(d)) {
      target = Math.min(1, p / FILM_END) * (d - 0.05);
      const next = shown < 0 ? target : shown + (target - shown) * FOLLOW;
      // Skip sub-frame moves and let a pending seek land before the next one.
      if (Math.abs(next - shown) > 1 / 60 && !video.seeking) {
        shown = next;
        video.currentTime = shown;
      }
    }
    if (running) requestAnimationFrame(tick);
  };

  // Only animate while the track is on screen.
  const io = new IntersectionObserver(
    ([e]) => {
      const was = running;
      running = e.isIntersecting;
      if (running && !was) requestAnimationFrame(tick);
    },
    { rootMargin: '10% 0px' },
  );
  io.observe(hero);
  video.addEventListener('loadedmetadata', () => requestAnimationFrame(tick), { once: true });

  skip?.addEventListener('click', () => {
    const end = hero.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(end, { duration: 1.6 });
    else window.scrollTo({ top: end, behavior: 'smooth' });
  });
}
