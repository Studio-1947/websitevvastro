/**
 * Products page bento cards: a field of red dots that drifts at rest and, when
 * the card is hovered or focused, flows together into that product's icon,
 * then scatters again on leave. One canvas per `[data-icon]` card.
 *
 * Icons are 24 × 24 stroke paths, drawn once to an offscreen canvas and
 * sampled for target points. Animation only runs while a card is on screen
 * and something is moving. With reduced motion the dots jump straight to
 * their place instead of flowing. On touch screens, where there is no hover,
 * a card gathers its icon while it sits in the middle of the screen.
 */

const ICONS: Record<string, string> = {
  // Graduation cap over a briefcase line: campuses, offices, NGOs
  doptor: 'M22 10 12 5 2 10l10 5 10-5Z M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5 M22 10v6',
  pharma: 'M12 4v16 M4 12h16',
  bi: 'M4 20V13 M10 20V8 M16 20v-5 M22 20H2 M4 9l6-5 6 4 5-4',
  aangan: 'M3 11 12 4l9 7 M5 10v10h14V10 M10 20v-6h4v6',
  social: 'M20.6 5a2.6 2.6 0 1 1-5.2 0a2.6 2.6 0 1 1 5.2 0 M8.6 12a2.6 2.6 0 1 1-5.2 0a2.6 2.6 0 1 1 5.2 0 M20.6 19a2.6 2.6 0 1 1-5.2 0a2.6 2.6 0 1 1 5.2 0 M8.3 13.3l7.4 4.4 M15.7 6.3l-7.4 4.4',
};

interface Dot { x: number; y: number; hx: number; hy: number; tx: number; ty: number; r: number; a: number; ph: number; d: number }

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const touch = window.matchMedia('(hover: none)').matches;

/** Points along the icon's strokes, sized to `size` px and centred on (cx, cy). */
function iconPoints(path: string, size: number, cx: number, cy: number, n: number): [number, number][] {
  const S = Math.ceil(size);
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d', { willReadFrequently: true })!;
  g.scale(S / 24, S / 24);
  g.lineWidth = 2.1;
  g.lineCap = 'round';
  g.lineJoin = 'round';
  g.stroke(new Path2D(path));
  const px = g.getImageData(0, 0, S, S).data;
  const pts: [number, number][] = [];
  const step = Math.max(2, Math.round(S / 110));
  for (let y = 0; y < S; y += step) for (let x = 0; x < S; x += step) if (px[(y * S + x) * 4 + 3] > 120) pts.push([x, y]);
  // Shuffle, then repeat to cover every dot.
  for (let i = pts.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [pts[i], pts[j]] = [pts[j], pts[i]]; }
  const out: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const [x, y] = pts[i % pts.length];
    out.push([cx - S / 2 + x + (Math.random() - 0.5) * step * 0.6, cy - S / 2 + y + (Math.random() - 0.5) * step * 0.6]);
  }
  return out;
}

function setup(card: HTMLElement): void {
  const canvas = card.querySelector<HTMLCanvasElement>('.bcard__dots');
  const icon = ICONS[card.dataset.icon || ''];
  if (!canvas || !icon) return;
  const ctx = canvas.getContext('2d')!;
  let dots: Dot[] = [];
  let w = 0, h = 0, dpr = 1;
  let gathered = false;
  let textTop = 0;
  let visible = false;
  let raf = 0;
  let t0 = performance.now();

  function layout(): void {
    const r = card.getBoundingClientRect();
    if (!r.width || !r.height) return;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const n = Math.min(520, Math.max(160, Math.round((w * h) / 520)));
    // The icon sits in the open space between the number badge and the text.
    const text = card.querySelector<HTMLElement>('.bcard__text');
    textTop = text ? text.offsetTop : h * 0.6;
    const top = 64;
    const room = Math.max(60, textTop - top - 14);
    const size = Math.min(w * 0.46, room, 280);
    const targets = iconPoints(icon, size, w * 0.5, top + room / 2, n);
    dots = targets.map(([tx, ty], i) => {
      const hx = Math.random() * w, hy = Math.random() * h;
      const old = dots[i];
      return {
        x: old ? old.x : hx, y: old ? old.y : hy, hx, hy, tx, ty,
        r: 0.7 + Math.random() * 1.1, a: 0.35 + Math.random() * 0.5,
        ph: Math.random() * Math.PI * 2, d: Math.random() * 0.35,
      };
    });
    draw(performance.now(), true);
  }

  function draw(now: number, still = false): boolean {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const t = (now - t0) / 1000;
    let moving = false;
    for (const p of dots) {
      // A gentle drift at rest; none while gathered so the icon reads cleanly.
      const gx = gathered ? p.tx : p.hx + Math.sin(t * 0.6 + p.ph) * 6;
      const gy = gathered ? p.ty : p.hy + Math.cos(t * 0.5 + p.ph) * 6;
      if (reduced || still) { p.x = gx; p.y = gy; }
      else {
        const k = gathered ? 0.075 - p.d * 0.12 : 0.05;
        p.x += (gx - p.x) * Math.max(0.03, k);
        p.y += (gy - p.y) * Math.max(0.03, k);
        if (Math.abs(gx - p.x) + Math.abs(gy - p.y) > 0.3) moving = true;
      }
      // Dots passing behind the text are dimmed so it stays readable.
      const behindText = p.y > textTop - 8;
      ctx.globalAlpha = (gathered ? Math.min(1, p.a + 0.35) : p.a) * (behindText ? 0.3 : 1);
      ctx.fillStyle = '#e60000';
      ctx.beginPath();
      ctx.arc(p.x, p.y, gathered ? p.r + 0.35 : p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    // At rest the field keeps drifting, so it is always "moving".
    return moving || (!gathered && !reduced);
  }

  function loop(now: number): void {
    raf = 0;
    if (!visible) return;
    if (draw(now)) raf = requestAnimationFrame(loop);
  }
  function kick(): void {
    if (!raf && visible) raf = requestAnimationFrame(loop);
  }
  function gather(on: boolean): void {
    if (gathered === on) return;
    gathered = on;
    if (reduced) draw(performance.now(), true);
    else kick();
  }

  new ResizeObserver(layout).observe(card);
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) { t0 = performance.now() - 1000; kick(); }
  }).observe(card);

  card.addEventListener('pointerenter', () => gather(true));
  card.addEventListener('pointerleave', () => gather(false));
  card.addEventListener('focus', () => gather(true));
  card.addEventListener('blur', () => gather(false));
  if (touch) {
    new IntersectionObserver(([e]) => gather(e.isIntersecting), { rootMargin: '-35% 0px -35% 0px' }).observe(card);
  }
}

/**
 * Hero visual: one field of dots that gathers into each product's icon
 * in turn, holding each for a moment and showing its name underneath.
 */
function hero(box: HTMLElement): void {
  const canvas = box.querySelector('canvas');
  const names = box.querySelectorAll<HTMLElement>('[data-hero-name]');
  if (!canvas || !names.length) return;
  const ctx = canvas.getContext('2d')!;
  const order = [...names].map((n) => n.dataset.heroName || '').filter((k) => ICONS[k]);
  const N = 900;
  let w = 0, dpr = 1, idx = 0, visible = false, raf = 0, timer = 0;
  let dots: { x: number; y: number; tx: number; ty: number; r: number; a: number; d: number }[] = [];

  function targets(): [number, number][] {
    return iconPoints(ICONS[order[idx]], w * 0.62, w / 2, w * 0.44, N);
  }
  function layout(): void {
    w = box.clientWidth;
    if (!w) return;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas!.width = canvas!.height = Math.round(w * dpr);
    const t = targets();
    dots = t.map(([tx, ty], i) => {
      const old = dots[i];
      // Start scattered across the area, then gather.
      const ang = Math.random() * Math.PI * 2, rad = Math.sqrt(Math.random()) * w * 0.48;
      return { x: old ? old.x : w / 2 + Math.cos(ang) * rad, y: old ? old.y : w / 2 + Math.sin(ang) * rad, tx, ty, r: 0.9 + Math.random() * 1.3, a: 0.45 + Math.random() * 0.5, d: Math.random() * 0.5 };
    });
    if (reduced) draw(true); else kick();
  }
  function draw(still = false): boolean {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, w);
    ctx.fillStyle = '#e60000';
    let moving = false;
    for (const p of dots) {
      if (still) { p.x = p.tx; p.y = p.ty; }
      else {
        const k = Math.max(0.025, 0.07 - p.d * 0.08);
        p.x += (p.tx - p.x) * k;
        p.y += (p.ty - p.y) * k;
        if (Math.abs(p.tx - p.x) + Math.abs(p.ty - p.y) > 0.3) moving = true;
      }
      ctx.globalAlpha = p.a;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    return moving;
  }
  function loop(): void {
    raf = 0;
    if (visible && draw()) raf = requestAnimationFrame(loop);
  }
  function kick(): void {
    if (!raf && visible) raf = requestAnimationFrame(loop);
  }
  function next(): void {
    idx = (idx + 1) % order.length;
    names.forEach((n) => (n.hidden = n.dataset.heroName !== order[idx]));
    const t = targets();
    // Burst outwards a little first, so the change reads as a regroup.
    dots.forEach((p, i) => {
      p.tx = t[i][0]; p.ty = t[i][1];
      p.x += (Math.random() - 0.5) * w * 0.12;
      p.y += (Math.random() - 0.5) * w * 0.12;
    });
    if (reduced) draw(true); else kick();
  }

  new ResizeObserver(layout).observe(box);
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    clearInterval(timer);
    if (visible) { kick(); timer = window.setInterval(next, reduced ? 4000 : 2800); }
  }).observe(box);
}

export function bentoDots(): void {
  document.querySelectorAll<HTMLElement>('.bcard[data-icon]').forEach(setup);
  document.querySelectorAll<HTMLElement>('[data-hero-dots]').forEach(hero);
}
