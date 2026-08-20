/**
 * Letters that become shapes on hover.
 *
 * Each letter of the wordmark is paired with a rough organic form: a closed
 * curve built from jittered polar points, so no two are alike and none of them
 * look drawn by a machine. Hovering swaps glyph for shape, one letter at a
 * time; leaving swaps them back in the same order.
 *
 * The forms are generated from a seeded random source, so a given letter gets
 * the same shape on every load rather than flickering between reloads.
 */
const STEP = 45; // ms between letters
const POINTS = 9; // corners of the underlying polygon before smoothing

/** Deterministic random, so shapes are stable across loads. */
function seeded(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A closed, smooth, lopsided outline on a 100x100 box. Points are placed round
 * a circle at uneven angles and uneven radii, then joined with a Catmull-Rom
 * spline converted to cubics: round enough to read as a pebble or a seed,
 * irregular enough to read as drawn by hand.
 */
function blobPath(seed: number): string {
  const rng = seeded(seed);
  const cx = 50;
  const cy = 50;
  const pts: [number, number][] = [];
  for (let i = 0; i < POINTS; i++) {
    const ang = (i / POINTS) * Math.PI * 2 + (rng() - 0.5) * 0.62;
    const rad = 26 + rng() * 22;
    pts.push([cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad * (0.82 + rng() * 0.3)]);
  }

  const at = (i: number) => pts[(i + pts.length) % pts.length];
  let d = `M${at(0)[0].toFixed(1)},${at(0)[1].toFixed(1)}`;
  for (let i = 0; i < pts.length; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    // Catmull-Rom to cubic, with the tension nudged per segment so the curve
    // bulges unevenly the way an inked line does.
    const t = 5.4 + rng() * 1.6;
    const c1x = p1[0] + (p2[0] - p0[0]) / t;
    const c1y = p1[1] + (p2[1] - p0[1]) / t;
    const c2x = p2[0] - (p3[0] - p1[0]) / t;
    const c2y = p2[1] - (p3[1] - p1[1]) / t;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d + 'Z';
}

/** Split into letters, each carrying its own shape. */
function build(el: HTMLElement): HTMLElement[] {
  if (el.dataset.morph === 'done') {
    return Array.from(el.querySelectorAll<HTMLElement>('.char'));
  }
  const text = el.textContent ?? '';
  el.textContent = '';
  const chars: HTMLElement[] = [];
  let n = 0;
  for (const ch of text) {
    if (ch === ' ') {
      el.appendChild(document.createTextNode(' '));
      continue;
    }
    const span = document.createElement('span');
    span.className = 'char';

    const glyph = document.createElement('span');
    glyph.className = 'char__glyph';
    glyph.textContent = ch;
    span.appendChild(glyph);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'char__shape');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', blobPath(ch.charCodeAt(0) * 97 + n * 31));
    path.setAttribute('fill', 'currentColor');
    svg.appendChild(path);
    span.appendChild(svg);
    // A hair of rotation each way, and a size that shifts letter to letter, so
    // the row of forms has rhythm instead of reading as ten of one stamp.
    span.style.setProperty('--tilt', `${(n % 2 ? 1 : -1) * (4 + (n % 3) * 5)}deg`);
    const size = seeded(ch.charCodeAt(0) + n * 7)();
    span.style.setProperty('--shape-scale', (0.82 + size * 0.34).toFixed(2));

    el.appendChild(span);
    chars.push(span);
    n++;
  }
  el.dataset.morph = 'done';
  return chars;
}

export function charMorph(): void {
  const targets = document.querySelectorAll<HTMLElement>('[data-char-morph]');
  if (!targets.length) return;
  if (!window.matchMedia('(hover: hover)').matches) return;

  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  targets.forEach((el) => {
    const chars = build(el);
    if (!chars.length) return;
    const timers: number[] = [];

    const set = (on: boolean): void => {
      timers.forEach(clearTimeout);
      timers.length = 0;
      chars.forEach((c, i) => {
        // Leaving runs the wave back the way it came, so the word resolves
        // from the end the pointer left.
        const order = on ? i : chars.length - 1 - i;
        timers.push(
          window.setTimeout(
            () => c.classList.toggle('is-shape', on),
            still ? 0 : order * STEP,
          ),
        );
      });
    };

    el.addEventListener('mouseenter', () => set(true));
    el.addEventListener('mouseleave', () => set(false));
    el.addEventListener('focus', () => set(true));
    el.addEventListener('blur', () => set(false));
  });
}
