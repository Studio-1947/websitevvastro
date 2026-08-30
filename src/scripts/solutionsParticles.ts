/**
 * Solutions overview: a particle field inside each practice card.
 *
 * Two canvases per card:
 *  - dust: hundreds of tiny faint dots spread over the card, flickering and
 *    drifting slightly, nudged away from the cursor;
 *  - shape: a few hundred accent-coloured particles. At rest they hold a soft,
 *    breathing rounded blob; when the card is hovered they morph into the
 *    card's glyph (sampled from rendered text), bulging away from the pointer.
 *
 * Colours come from CSS custom properties on the card (--sol-dust, --sol-accent,
 * --sol-accent-alt as "r,g,b"), re-read on hover so the red hover state gets
 * white particles. Decorative only: pauses out of view, still frame for
 * reduced-motion.
 */
const GLYPHS = ['</>', '@', '?', '+'];

type Pt = [number, number];

/** Sample a glyph into normalised [0..1] points by rasterising it off-screen. */
function glyphPoints(text: string, count: number, aspect: number): Pt[] {
  const w = 600, h = Math.max(200, Math.round(600 / Math.max(0.6, aspect)));
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  if (!g) return Array.from({ length: count }, () => [0.5, 0.5] as Pt);
  g.fillStyle = '#000';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = '700 ' + Math.round(h * 0.78) + 'px "Google Sans Flex", "Google Sans", Arial, sans-serif';
  g.fillText(text, w / 2, h / 2 + h * 0.03);
  const data = g.getImageData(0, 0, w, h).data;
  const pts: Pt[] = [];
  for (let y = 0; y < h; y += 3) for (let x = 0; x < w; x += 3) if (data[(y * w + x) * 4 + 3] > 128) pts.push([x, y]);
  if (!pts.length) return Array.from({ length: count }, () => [0.5, 0.5] as Pt);
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const scale = Math.min((w * 0.9) / Math.max(1, maxX - minX), (h * 0.88) / Math.max(1, maxY - minY));
  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
  return Array.from({ length: count }, () => {
    const p = pts[(Math.random() * pts.length) | 0];
    return [0.5 + ((p[0] - cx) * scale) / w, 0.5 + ((p[1] - cy) * scale) / h] as Pt;
  });
}

interface Dust { x: number; y: number; size: number; phase: number; driftX: number; driftY: number }
interface Spark { gx: number; gy: number; bx: number; by: number; radius: number; size: number; phase: number; depth: number }

function card(el: HTMLElement, index: number): void {
  const mk = (cls: string): HTMLCanvasElement => {
    const c = document.createElement('canvas');
    c.className = 'solcard__layer ' + cls;
    c.setAttribute('aria-hidden', 'true');
    return c;
  };
  const dustC = mk('solcard__layer--dust'), shapeC = mk('solcard__layer--shape');
  el.prepend(dustC, shapeC);
  const dctx = dustC.getContext('2d'), sctx = shapeC.getContext('2d');
  if (!dctx || !sctx) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  let W = 0, H = 0;
  let dust: Dust[] = [], sparks: Spark[] = [];
  let dustRGB = '17,17,17', accent = [230, 0, 0], accentAlt = [158, 42, 42];
  // pointer: target/current position, influence 0..1, morph 0..1 (blob -> glyph)
  let tx = 0, ty = 0, px = 0, py = 0, infl = 0, inflT = 0, morph = 0, morphT = 0;
  let running = false, raf: number | null = null;

  const readColours = (): void => {
    const cs = getComputedStyle(el);
    const v = (n: string): string => cs.getPropertyValue(n).trim();
    dustRGB = v('--sol-dust') || dustRGB;
    const a = v('--sol-accent'), b = v('--sol-accent-alt');
    if (a) accent = a.split(',').map(Number);
    accentAlt = b ? b.split(',').map(Number) : accent;
  };
  // Push a point away from the pointer within `reach`, scaled by influence.
  const repel = (x: number, y: number, reach: number, amt: number): Pt => {
    if (infl < 0.001) return [x, y];
    const dx = x - px, dy = y - py, d = Math.hypot(dx, dy);
    if (d >= reach) return [x, y];
    const f = (1 - d / reach) ** 2 * amt * infl, ang = d > 0.01 ? Math.atan2(dy, dx) : 0;
    return [x + Math.cos(ang) * f, y + Math.sin(ang) * f];
  };

  const draw = (now: number): void => {
    const t = now * 0.001;
    px += (tx - px) * 0.09; py += (ty - py) * 0.09;
    infl += (inflT - infl) * 0.075;
    morph += (morphT - morph) * (reduce ? 1 : 0.055);

    dctx.clearRect(0, 0, W, H);
    for (const d of dust) {
      const a = reduce ? 0 : t * 0.18;
      const x = d.x + Math.sin(a + d.phase) * d.driftX, y = d.y + Math.cos(a * 0.8 + d.phase) * d.driftY;
      const [rx, ry] = repel(x, y, 105, 11);
      const al = reduce ? 0.16 : 0.13 + (Math.sin(t * 1.35 + d.phase) + 1) * 0.05;
      dctx.fillStyle = `rgba(${dustRGB},${al.toFixed(3)})`;
      dctx.fillRect(rx, ry, d.size, d.size);
    }

    sctx.clearRect(0, 0, W, H);
    const breathe = reduce ? 1 : 1 + Math.sin(t * 0.62 + index) * 0.035;
    const ease = morph * morph * (3 - 2 * morph);
    for (const s of sparks) {
      const wob = reduce ? 0 : Math.sin(t * 0.8 + s.phase) * 1.8 * s.depth;
      // glyph target
      const gx = W * 0.5 + (s.gx - 0.5) * W * breathe + wob, gy = H * 0.5 + (s.gy - 0.5) * H * breathe + wob * 0.25;
      // blob target: a rounded cloud that slowly turns and breathes
      const ang = s.by * 6.283 + (reduce ? 0 : t * 0.08);
      const r = s.bx * (1 + 0.14 * Math.sin(3 * ang + t * 0.5) + 0.08 * Math.sin(5 * ang - t * 0.35));
      const bx = W * 0.5 + Math.cos(ang) * r * Math.min(W, H) * 0.36 * breathe;
      const by = H * 0.5 + Math.sin(ang) * r * Math.min(W, H) * 0.36 * breathe;
      const x = bx + (gx - bx) * ease, y = by + (gy - by) * ease;
      const [rx, ry] = repel(x, y, 125, 28 * s.depth);
      const pulse = reduce ? 1 : 0.84 + (Math.sin(t * 1.1 + s.phase) + 1) * 0.08;
      const size = s.size * (0.75 + s.radius * 0.35), alpha = 0.82 * pulse;
      const q = Math.max(0, Math.min(1, rx / W));
      const col = accent.map((v, i) => Math.round(v + (accentAlt[i] - v) * q));
      sctx.fillStyle = `rgba(${col.join(',')},${alpha.toFixed(3)})`;
      sctx.beginPath(); sctx.arc(rx, ry, size, 0, 6.283); sctx.fill();
    }
    raf = running && !reduce ? requestAnimationFrame(draw) : null;
  };

  const layout = (): void => {
    const r = el.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    for (const c of [dustC, shapeC]) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
    dctx.setTransform(dpr, 0, 0, dpr, 0, 0); sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    readColours();
    const nDust = Math.max(650, Math.min(1600, Math.round((W * H) / 310)));
    const nSpark = Math.max(420, Math.min(920, Math.round((W * H) / 510)));
    const glyph = glyphPoints(GLYPHS[index % GLYPHS.length], nSpark, W / H);
    dust = Array.from({ length: nDust }, () => ({ x: Math.random() * W, y: Math.random() * H, size: 0.35 + Math.random() * 0.8, phase: Math.random() * 6.283, driftX: (Math.random() - 0.5) * 1.8, driftY: (Math.random() - 0.5) * 1.8 }));
    sparks = Array.from({ length: nSpark }, (_, i) => {
      const g = glyph[i] ?? [0.5, 0.5];
      return { gx: g[0], gy: g[1], bx: 0.55 + Math.sqrt(Math.random()) * 0.45, by: Math.random(), radius: Math.sqrt(Math.random()), size: 0.65 + Math.random() * 1.25, phase: Math.random() * 6.283, depth: 0.45 + Math.random() * 0.55 };
    });
    tx = px = W * 0.5; ty = py = H * 0.5;
    if (raf !== null) cancelAnimationFrame(raf);
    raf = null; draw(performance.now());
  };
  const start = (): void => { running = true; if (!reduce && raf === null) raf = requestAnimationFrame(draw); if (reduce) draw(0); };
  const stop = (): void => { running = false; if (raf !== null) cancelAnimationFrame(raf); raf = null; };

  el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top; inflT = 1; }, { passive: true });
  el.addEventListener('pointerenter', () => { morphT = 1; readColours(); if (reduce) draw(0); });
  el.addEventListener('pointerleave', () => { inflT = 0; morphT = 0; readColours(); if (reduce) draw(0); });
  // The hover colour change on the card transitions over ~.4s; re-read
  // colours a few times so the particles follow it.
  el.addEventListener('transitionend', readColours);

  let tm = 0;
  new ResizeObserver(() => { clearTimeout(tm); tm = window.setTimeout(layout, 120); }).observe(el);
  layout();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((ents) => { if (ents[0].isIntersecting && !document.hidden) start(); else stop(); }, { threshold: 0.05 }).observe(el);
  } else start();
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else { const r = el.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) start(); } });
}

export function solutionsParticles(): void {
  document.querySelectorAll<HTMLElement>('[data-sol-particles] .solcard').forEach(card);
}
