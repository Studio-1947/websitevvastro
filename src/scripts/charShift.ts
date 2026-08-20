/**
 * Character shift on hover.
 *
 * The text is split into per-letter spans; hovering runs a hop through them,
 * one letter every 20ms, each letter dipping fractionally before springing up
 * and landing back on the baseline. The wave runs once per hover rather than
 * holding while the pointer rests, so the word settles instead of hanging.
 *
 * Values match the reference interaction (Fiasco's LinkCharShift): 76% of the
 * letter's own height, 0.7s, 0.02s stagger, on a curve that undershoots before
 * it rises.
 */
const RISE = -76; // percent of the letter's own height
const DUR = 700; // ms
const STEP = 20; // ms between letters
const EASE = 'cubic-bezier(0.3, -0.43, 0, 1)';

/** Wrap every visible character in its own span, leaving spaces as spaces. */
function split(el: HTMLElement): HTMLElement[] {
  if (el.dataset.split === 'done') {
    return Array.from(el.querySelectorAll<HTMLElement>('.char'));
  }
  const text = el.textContent ?? '';
  el.textContent = '';
  const chars: HTMLElement[] = [];
  for (const ch of text) {
    if (ch === ' ') {
      el.appendChild(document.createTextNode(' '));
      continue;
    }
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = ch;
    el.appendChild(span);
    chars.push(span);
  }
  el.dataset.split = 'done';
  return chars;
}

export function charShift(): void {
  const targets = document.querySelectorAll<HTMLElement>('[data-char-shift]');
  if (!targets.length) return;
  // A hover effect on a device with no hover would either never fire or fire
  // on tap, and the whole thing is decoration.
  if (!window.matchMedia('(hover: hover)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  targets.forEach((el) => {
    const chars = split(el);
    if (!chars.length) return;
    let playing = false;

    const run = (): void => {
      if (playing) return;
      playing = true;
      chars.forEach((c, i) => {
        const anim = c.animate(
          [{ transform: 'translateY(0)' }, { transform: `translateY(${RISE}%)` }],
          { duration: DUR, delay: i * STEP, easing: EASE, fill: 'none' },
        );
        // The last letter to leave decides when the word is free again.
        if (i === chars.length - 1) {
          anim.addEventListener('finish', () => {
            playing = false;
          });
        }
      });
    };

    el.addEventListener('mouseenter', run);
    el.addEventListener('focus', run);
  });
}
