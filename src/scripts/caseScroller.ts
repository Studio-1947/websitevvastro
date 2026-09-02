/**
 * A case study's scroller media (`layout: 'scroller'`): two horizontally
 * scrolling rows that drift on their own in opposite directions, the top one
 * travelling left to right and the one beneath it right to left, so the pair
 * reads as a moving wall of work rather than two static strips.
 *
 * Each row's figures are laid down twice in the markup, which lets the drift
 * wrap at the halfway mark and loop with no visible seam. Hovering, touching or
 * scrolling a row pauses it, so a reader who wants to look at one piece is
 * never fighting the animation; `prefers-reduced-motion` turns the drift off
 * altogether and leaves native scrolling in place.
 */

/** Drift speed, px per second. Slow enough to read a card in passing. */
const SPEED = 32;
/** How long a row stays still after the reader nudges it. */
const PAUSE_MS = 2200;

export function caseScroller(): void {
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll<HTMLElement>('[data-case-scroller]').forEach((rail) => {
    const tracks = [...rail.querySelectorAll<HTMLElement>('[data-scroller-track]')];
    if (tracks.length === 0) return;

    let held = 0;
    const hold = (): void => {
      held = performance.now() + PAUSE_MS;
    };

    // A row that is being read stops; the rest keep moving.
    const paused = new WeakSet<HTMLElement>();
    tracks.forEach((t) => {
      t.addEventListener('pointerenter', () => paused.add(t));
      t.addEventListener('pointerleave', () => paused.delete(t));
      t.addEventListener('touchstart', hold, { passive: true });
      t.addEventListener('wheel', hold, { passive: true });
    });

    // The wrap distance is the width of one copy of the set, measured from
    // the markup rather than from scrollWidth: scrollWidth carries the row's
    // gutter padding too, and wrapping by half of that would nudge the rail
    // sideways a little on every lap.
    const loop = (t: HTMLElement): number => {
      const kids = t.children;
      const seam = kids[kids.length / 2] as HTMLElement | undefined;
      return seam ? seam.offsetLeft - (kids[0] as HTMLElement).offsetLeft : 0;
    };
    // A row moving right to left starts on the second copy, so it always has
    // somewhere to come from on the very first frame.
    const start = (): void => {
      tracks.forEach((t) => {
        if (t.dataset.scrollerDir === '-1' && t.scrollLeft < 1) t.scrollLeft = loop(t);
      });
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });

    if (still) return;

    // The drift moves well under a pixel per frame, and reading scrollLeft
    // back can round that away to nothing, so each row's position is kept
    // here at full precision and only written to the element.
    const pos = new Map<HTMLElement, number>();
    let last = performance.now();
    let running = true;
    const step = (now: number): void => {
      const dt = Math.min(now - last, 64) / 1000;
      last = now;
      if (running && now > held) {
        tracks.forEach((t) => {
          if (paused.has(t)) return;
          const h = loop(t);
          if (h < 1) return;
          // A reader who scrolls or swipes wins: pick their position up and
          // carry on drifting from there.
          const own = pos.get(t);
          let x = own === undefined || Math.abs(t.scrollLeft - own) > 2 ? t.scrollLeft : own;
          x += (t.dataset.scrollerDir === '-1' ? -1 : 1) * SPEED * dt;
          // Wrap at the seam between the two copies, which is invisible
          // because the copies are identical.
          if (x >= h) x -= h;
          if (x <= 0) x += h;
          pos.set(t, x);
          t.scrollLeft = x;
        });
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);

    // Nothing moves while the rail is off screen, or the tab is in the
    // background: the drift is decoration, not work worth doing unseen.
    const io = new IntersectionObserver(
      ([e]) => {
        running = e.isIntersecting;
        last = performance.now();
      },
      { rootMargin: '120px' },
    );
    io.observe(rail);
    document.addEventListener('visibilitychange', () => {
      last = performance.now();
    });
  });
}
