/**
 * Scroll reveal (.reveal, [data-stagger]) + number count-ups ([data-count]).
 * Ported from js/main.js — behaviour preserved exactly:
 *  - content is visible by default (CSS); we only ever ADD `is-in`, never hide;
 *  - 130ms stagger step between children;
 *  - a 4s failsafe reveals everything even if IntersectionObserver misbehaves;
 *  - count-up runs 2000ms with cubic ease-out, starting at 50% visibility.
 */
const reduceMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function scrollReveal(): void {
  const targets = Array.prototype.slice.call(
    document.querySelectorAll('.reveal, [data-stagger]')
  ) as HTMLElement[];

  const revealEl = (el: HTMLElement): void => {
    if (el.classList.contains('is-in')) return;
    if (el.hasAttribute('data-stagger')) {
      let i = 0;
      Array.prototype.forEach.call(el.children, (k: HTMLElement) => {
        k.style.transitionDelay = i * 130 + 'ms';
        i++;
      });
    }
    el.classList.add('is-in');
  };

  if (reduceMotion() || !('IntersectionObserver' in window)) {
    targets.forEach(revealEl);
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          revealEl(e.target as HTMLElement);
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );
  targets.forEach((t) => io.observe(t));

  const revealInView = (): void => {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    targets.forEach((t) => {
      const r = t.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) {
        revealEl(t);
        io.unobserve(t);
      }
    });
  };
  revealInView();
  window.addEventListener('load', revealInView);

  // Ultimate failsafe: never leave content hidden.
  setTimeout(() => targets.forEach(revealEl), 4000);
}

export function countUps(): void {
  const nums = document.querySelectorAll<HTMLElement>('[data-count]');
  if (!nums.length) return;
  const fmt = (n: number, pad: boolean): string => (pad && n < 10 ? '0' + n : '' + n);
  const run = (el: HTMLElement): void => {
    const target = parseInt(el.getAttribute('data-count') || '', 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const pad = el.getAttribute('data-pad') === 'true';
    if (reduceMotion()) {
      el.textContent = fmt(target, pad) + suffix;
      return;
    }
    let start: number | null = null;
    const dur = 2000;
    const step = (ts: number): void => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(target * eased), pad) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (!('IntersectionObserver' in window)) {
    nums.forEach(run);
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          run(e.target as HTMLElement);
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  nums.forEach((n) => io.observe(n));
}
