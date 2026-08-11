/**
 * Hero backdrop — an amorphous colour bulge trailing the cursor with a field of
 * 0s and 1s over it (faint grey, turning white over the bulge). Purely
 * decorative; a still frame for reduced-motion. Ported verbatim from js/main.js.
 */
export function heroAurora(): void {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.querySelector<HTMLCanvasElement>('[data-hero-aurora]');
  if (!canvas || !canvas.getContext) return;
  const wrap = canvas.parentNode as HTMLElement;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  // Backing-store scale, re-derived on resize so a phone rotated to landscape
  // doesn't keep drawing at portrait scale. Capped at 2× on desktop, 1.5× on
  // small screens — the extra 2× detail is wasted on a small physical pixel
  // pitch, and halving the backing store roughly halves the fill cost.
  let dpr = 1;
  let W = 0,
    H = 0,
    base = 0;

  // Grid cell in CSS px. Coarsened on small screens (fewer fillText calls per
  // frame; the glyph field is texture, not information).
  let cell = 30;
  let cols = 0,
    rows = 0;
  let chars: string[] = [],
    sizes: number[] = [],
    flip: number[] = [];
  function smooth(t: number): number {
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    return t * t * (3 - 2 * t);
  }

  function buildGrid(): void {
    cols = Math.ceil(W / cell) + 1;
    rows = Math.ceil(H / cell) + 1;
    chars = [];
    sizes = [];
    flip = [];
    for (let k = 0; k < cols * rows; k++) {
      chars.push(Math.random() < 0.5 ? '0' : '1');
      sizes.push(6 + Math.random() * Math.random() * 8);
      flip.push(Math.random() * 6000);
    }
  }
  function resize(): void {
    const small = window.innerWidth < 768;
    dpr = Math.max(1, Math.min(small ? 1.5 : 2, window.devicePixelRatio || 1));
    cell = small ? 44 : 30;
    W = wrap.clientWidth;
    H = wrap.clientHeight;
    base = Math.max(W, H);
    canvas!.width = W * dpr;
    canvas!.height = H * dpr;
    canvas!.style.width = W + 'px';
    canvas!.style.height = H + 'px';
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx!.textAlign = 'center';
    ctx!.textBaseline = 'middle';
    buildGrid();
  }
  resize();

  interface Lobe {
    ang: number;
    sp: number;
    dist: number;
    rad: number;
    wob: number;
    wsp: number;
    wph: number;
    hoff: number;
  }
  const lobes: Lobe[] = [];
  for (let i = 0; i < 4; i++) {
    lobes.push({
      ang: Math.random() * 6.28,
      sp: (0.00018 + Math.random() * 0.00016) * (Math.random() < 0.5 ? -1 : 1),
      dist: 0.05 + Math.random() * 0.07,
      rad: 0.16 + Math.random() * 0.08,
      wob: 0.18 + Math.random() * 0.16,
      wsp: 0.0011 + Math.random() * 0.0011,
      wph: Math.random() * 6.28,
      hoff: (i - 1.5) * 48,
    });
  }

  let cx = W * 0.5,
    cy = H * 0.5,
    tx = cx,
    ty = cy,
    on = false;

  function lobeBlob(x: number, y: number, r: number, hue: number, a: number): void {
    const g = ctx!.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'hsla(' + hue + ',85%,60%,' + a + ')');
    g.addColorStop(1, 'hsla(' + hue + ',85%,60%,0)');
    ctx!.fillStyle = g;
    ctx!.fillRect(0, 0, W, H);
  }

  function draw(now: number): void {
    ctx!.clearRect(0, 0, W, H);
    if (!on) {
      tx = W * (0.5 + 0.26 * Math.sin(now * 0.00021));
      ty = H * (0.5 + 0.22 * Math.cos(now * 0.00017));
    }
    cx += (tx - cx) * 0.09;
    cy += (ty - cy) * 0.09;
    let hue = ((cx / W) * 190 + (cy / H) * 150 + now * 0.015) % 360;
    if (hue < 0) hue += 360;

    for (let j = 0; j < lobes.length; j++) {
      const l = lobes[j];
      const d = l.dist * base * (1 + l.wob * Math.sin(now * l.wsp + l.wph));
      const lx = cx + Math.cos(l.ang + now * l.sp) * d;
      const ly = cy + Math.sin(l.ang + now * l.sp) * d;
      const rr = l.rad * base * (1 + 0.2 * Math.sin(now * l.wsp * 1.3 + l.wph));
      lobeBlob(lx, ly, rr, hue + l.hoff, 0.16);
    }

    const R = base * 0.34;
    let lastPx = -1;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const idx = y * cols + x;
        const gx = x * cell + cell / 2,
          gy = y * cell + cell / 2;
        if ((now + flip[idx]) % 6000 < 16) chars[idx] = chars[idx] === '0' ? '1' : '0';
        const dxx = gx - cx,
          dyy = gy - cy;
        const inten = smooth(1 - Math.sqrt(dxx * dxx + dyy * dyy) / R);
        let px = (sizes[idx] * (1 + inten * 0.6)) | 0;
        if (px < 6) px = 6;
        if (px !== lastPx) {
          ctx!.font = "600 " + px + "px 'Google Sans', monospace";
          lastPx = px;
        }
        if (inten <= 0.03) ctx!.fillStyle = 'rgba(0,0,0,0.045)';
        else ctx!.fillStyle = 'rgba(255,255,255,' + (0.28 + inten * 0.68) + ')';
        ctx!.fillText(chars[idx], gx, gy);
      }
    }
  }

  if (reduceMotion) {
    draw(0);
    window.addEventListener('resize', () => {
      resize();
      cx = tx = W * 0.5;
      cy = ty = H * 0.5;
      draw(0);
    });
    return;
  }
  window.addEventListener('resize', () => {
    resize();
    // resize() resets the backing store to transparent; repaint now so a
    // resize while the loop is asleep doesn't leave a blank hero.
    draw(performance.now());
  });

  const wake = (): void => {
    // Without this, the first frame after a wake sees `now - lastPointer` >
    // SLEEP_AFTER (lastPointer still dates from page load) and instantly puts
    // the loop back to sleep — a wake that never survives one frame.
    lastPointer = performance.now();
    if (!rafId) start();
  };
  wrap.addEventListener('pointermove', (e) => {
    const r = canvas!.getBoundingClientRect();
    tx = e.clientX - r.left;
    ty = e.clientY - r.top;
    on = true;
    wake();
  });
  // Touch: a tap fires pointerdown (with no move) — count it as interaction.
  wrap.addEventListener('pointerdown', wake);
  wrap.addEventListener('pointerleave', () => (on = false));

  let running = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((ents) => {
      running = ents[0].isIntersecting;
      if (running) start(); // re-wake after scrolling back into view
    }).observe(wrap);
  }
  /*
   * Cap the loop to ~30fps. The bulge drifts slowly and the cursor trails at
   * pointer speed, so 60fps buys nothing visible while doubling the per-second
   * fillText of the whole 0/1 grid — the main-thread cost that dominated the
   * performance audits. `now` still advances at full rate, so nothing about
   * the animation's speed or easing changes; frames are just skipped.
   *
   * The loop also sleeps after ~2s without a pointer move: the ambient drift
   * is nearly imperceptible frame to frame, so once the visitor stops
   * interacting the hero holds its last painted frame instead of keeping the
   * main thread busy for as long as the page is open. Any pointer movement
   * wakes it (see the handler above). 2s is short enough that the loop's
   * awake window no longer dominates a throttled load's total blocking time.
   */
  const FRAME_MS = 1000 / 30;
  const SLEEP_AFTER = 2000;
  let lastDraw = 0;
  let lastPointer = performance.now();
  let rafId = 0;
  function frame(now: number): void {
    if (!running || !rafId) return; // stopped (sleep or out of view)
    requestAnimationFrame(frame);
    if (now - lastDraw < FRAME_MS) return;
    if (now - lastPointer > SLEEP_AFTER) {
      rafId = 0;
      return; // hold the last frame until the pointer moves again
    }
    lastDraw = now;
    draw(now);
  }
  function start(): void {
    if (rafId || !running) return;
    rafId = requestAnimationFrame(frame);
  }
  // Paint the first frame synchronously so the hero is never blank, then start
  // the loop only once the browser is idle — the loop running through the
  // whole page-load window was the homepage's dominant main-thread cost.
  draw(0);
  // typeof, not `in`: requestIdleCallback is a declared Window property, so an
  // `in` check would narrow the else branch to never at compile time.
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(start, { timeout: 3000 });
  } else {
    window.addEventListener('load', start, { once: true });
    setTimeout(start, 2000);
  }
}
