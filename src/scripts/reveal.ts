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

/**
 * Count-ups. Beyond the original whole-number counter these also read
 * `data-decimals` (1.5 lakh), `data-group` (1,50,000 in Indian digit grouping)
 * and `data-prefix` (the rupee sign), so a money figure can roll up the same
 * way a plain tally does.
 */
export function countUps(): void {
  const nums = document.querySelectorAll<HTMLElement>('[data-count]');
  if (!nums.length) return;
  const run = (el: HTMLElement): void => {
    const target = parseFloat(el.getAttribute('data-count') || '') || 0;
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const pad = el.getAttribute('data-pad') === 'true';
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10) || 0;
    const group = el.getAttribute('data-group');
    const fmt = (n: number): string => {
      let body: string;
      if (group) {
        body = n.toLocaleString(group === 'in' ? 'en-IN' : 'en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
      } else {
        body = decimals ? n.toFixed(decimals) : '' + Math.round(n);
      }
      if (pad && n < 10 && !decimals) body = '0' + body;
      return prefix + body + suffix;
    };
    if (reduceMotion()) {
      el.textContent = fmt(target);
      return;
    }
    let start: number | null = null;
    const dur = 2000;
    const step = (ts: number): void => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased);
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
