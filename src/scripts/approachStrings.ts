/**
 * Pluckable strings across the "Our Approach" steps.
 *
 * Five full-width strings run edge to edge across the stepper — one above each
 * of the four steps, plus one closing the set — so the section reads like a
 * fretboard rather than a decoration hung off each title.
 *
 * Design notes:
 *   • The strings are real <li> elements inserted into the existing <ol>, not
 *     an absolutely-positioned overlay. The panels expand and collapse, which
 *     constantly changes row heights; anything overlaid would need to chase
 *     those transitions. In flow, they simply move with the layout.
 *   • Velocity-sensitive. The note's gain and the string's amplitude come from
 *     how fast the pointer crossed, so a slow drag whispers and a quick swipe
 *     rings — that is what separates this from a button that makes a noise.
 *   • The rAF loop runs only while a string is moving; at rest it costs nothing.
 *   • Decorative: injected by script and aria-hidden, so it never reaches
 *     assistive tech or no-JS visitors. Keyboard users still get a note from
 *     the underlying <button> at a fixed velocity.
 */
import { pluck, warmAudio, initMuteState, isMuted, setMuted } from './pluckAudio';

interface StringState {
  el: HTMLElement;
  path: SVGPathElement;
  index: number;
  w: number;
  h: number;
  /** Displacement of the string's midpoint, px. */
  y: number;
  v: number;
  /** Where along the string it is pulled, 0–1. */
  at: number;
  held: boolean;
  lastY: number;
  lastT: number;
  speed: number;
}

const GRAB = 20; // px from the rest line that counts as touching the string
const MAX_PULL = 12; // clamp: the string bends, it does not sag
const BOW = 1.15; // control-point multiplier — how deep the curve reads
const STIFFNESS = 300;
const DAMPING = 11;

export function approachStrings(): void {
  const root = document.querySelector<HTMLElement>('[data-approach] .astep');
  if (!root) return;
  const items = Array.from(root.querySelectorAll<HTMLElement>('.astep__item'));
  if (!items.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  initMuteState();

  const strings: StringState[] = [];

  function makeString(index: number): HTMLElement {
    const li = document.createElement('li');
    li.className = 'astep__stringrow';
    li.setAttribute('aria-hidden', 'true');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('preserveAspectRatio', 'none');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    svg.appendChild(path);
    li.appendChild(svg);
    strings.push({
      el: li, path, index,
      w: 0, h: 0, y: 0, v: 0, at: 0.5,
      held: false, lastY: 0, lastT: 0, speed: 0,
    });
    return li;
  }

  // One above each step, plus one closing the set → 5 for 4 steps.
  items.forEach((item, i) => root.insertBefore(makeString(i), item));
  root.appendChild(makeString(items.length));

  function measure(s: StringState): void {
    const r = s.el.getBoundingClientRect();
    s.w = r.width;
    s.h = r.height;
    s.path.ownerSVGElement?.setAttribute(
      'viewBox',
      `0 0 ${Math.max(1, r.width)} ${Math.max(1, r.height)}`,
    );
  }

  function draw(s: StringState): void {
    const mid = s.h / 2;
    s.path.setAttribute(
      'd',
      `M 0 ${mid} Q ${s.at * s.w} ${mid + s.y * BOW} ${s.w} ${mid}`,
    );
  }

  strings.forEach((s) => { measure(s); draw(s); });

  // Panels expand/collapse and the viewport changes; keep geometry in sync.
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => strings.forEach((s) => { measure(s); draw(s); }));
    strings.forEach((s) => ro.observe(s.el));
  } else {
    window.addEventListener('resize', () =>
      strings.forEach((s) => { measure(s); draw(s); }),
    );
  }

  // ── Animation ────────────────────────────────────────────────────────────
  let raf = 0;
  let last = 0;
  function frame(now: number): void {
    const dt = Math.min(0.032, last ? (now - last) / 1000 : 0.016);
    last = now;
    let alive = false;

    for (const s of strings) {
      if (s.held) { alive = true; continue; } // pointer owns the position
      const a = -STIFFNESS * s.y - DAMPING * s.v; // damped spring back to rest
      s.v += a * dt;
      s.y += s.v * dt;
      if (Math.abs(s.y) < 0.05 && Math.abs(s.v) < 0.5) {
        s.y = 0;
        s.v = 0;
        s.el.classList.remove('is-ringing');
      } else {
        alive = true;
      }
      draw(s);
    }

    raf = alive ? requestAnimationFrame(frame) : 0;
    if (!alive) last = 0;
  }
  function kick(): void {
    if (!raf) { last = 0; raf = requestAnimationFrame(frame); }
  }

  // ── Pointer ──────────────────────────────────────────────────────────────
  function release(s: StringState): void {
    if (!s.held) return;
    s.held = false;
    s.el.classList.add('is-ringing');
    // Launch the oscillation; the pull sets the amplitude, capped so a fast
    // swipe cannot throw the string across the section.
    s.v = Math.max(-260, Math.min(260, -s.y * 9 - s.speed * 0.06));
    if (!reduce) {
      const strength = Math.abs(s.y) / MAX_PULL * 0.6 + Math.min(0.4, s.speed / 2600);
      pluck(s.index, Math.max(0.12, Math.min(1, strength)));
    }
    s.speed = 0;
    kick();
  }

  function onMove(e: PointerEvent): void {
    const now = performance.now();
    for (const s of strings) {
      const r = s.el.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right;
      const dy = e.clientY - (r.top + r.height / 2);

      if (inside && Math.abs(dy) < GRAB) {
        if (!s.held) { s.held = true; s.lastY = e.clientY; s.lastT = now; }
        const dt = Math.max(1, now - s.lastT);
        s.speed = (Math.abs(e.clientY - s.lastY) / dt) * 1000; // px/s
        s.lastY = e.clientY;
        s.lastT = now;
        s.y = reduce ? 0 : Math.max(-MAX_PULL, Math.min(MAX_PULL, dy));
        s.at = Math.max(0.06, Math.min(0.94, (e.clientX - r.left) / Math.max(1, r.width)));
        draw(s);
        kick();
      } else if (s.held) {
        release(s);
      }
    }
  }

  root.addEventListener('pointermove', onMove, { passive: true });
  root.addEventListener('pointerleave', () => strings.forEach(release), { passive: true });
  // Start fetching and decoding the moment the pointer reaches the section, not
  // on the first strike — otherwise that strike lands before the buffers are
  // ready and falls back to the synth, so the first note a visitor hears is the
  // wrong one. Decoding needs no user gesture; only playback does.
  root.addEventListener('pointerenter', warmAudio, { passive: true, once: true });
  root.addEventListener('pointerdown', warmAudio, { passive: true, once: true });

  // Keyboard: opening a step sounds the string above it, at a fixed velocity.
  items.forEach((item, i) => {
    const row = item.querySelector('.astep__row');
    if (!row) return;
    row.addEventListener('keydown', (e) => {
      const k = (e as KeyboardEvent).key;
      if (k !== 'Enter' && k !== ' ') return;
      if (reduce) return;
      warmAudio();
      pluck(i, 0.5);
      const s = strings[i];
      s.y = MAX_PULL * 0.7;
      s.v = 0;
      s.at = 0.5;
      s.el.classList.add('is-ringing');
      kick();
    });
  });

  mountMuteToggle(root);
}

/** Audio that cannot be switched off is user-hostile; give it a real control. */
function mountMuteToggle(root: HTMLElement): void {
  const host = root.closest('.approach2') ?? root.parentElement;
  if (!host) return;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'astep__mute';
  const paint = () => {
    const off = isMuted();
    btn.setAttribute('aria-pressed', String(off));
    btn.setAttribute('aria-label', off ? 'Unmute string sounds' : 'Mute string sounds');
    btn.innerHTML = off
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="m23 9-6 6M17 9l6 6"/></svg><span>Sound off</span>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14"/></svg><span>Sound on</span>';
  };
  btn.addEventListener('click', () => { setMuted(!isMuted()); paint(); });
  paint();
  host.appendChild(btn);
}
