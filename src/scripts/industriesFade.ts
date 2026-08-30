/**
 * Solutions page, "Our journey across industries": the heading is pinned in
 * the background while the cards scroll over it. As the first card passes
 * the heading, the heading fades to 20% and stays there until the section
 * has scrolled out; scrolling back up restores it. Driven from the scroll
 * position every frame (no transition lag), eased for smoothness.
 */
export function industriesFade(): void {
  const head = document.querySelector<HTMLElement>('.ind-head');
  const first = document.querySelector<HTMLElement>('.ind__card');
  const section = head?.closest<HTMLElement>('.ind-section');
  if (!head || !first || !section) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const MIN = 0.2;
  let current = 1, target = 1, raf = 0;
  const smooth = (t: number): number => t * t * (3 - 2 * t);

  const compute = (): void => {
    const h = head.getBoundingClientRect();
    const c = first.getBoundingClientRect();
    // Progress 0 -> 1 as the first card travels up over the heading: from its
    // top touching the heading's bottom edge until its bottom clears the
    // heading's centre, so the fade spans the whole pass.
    const start = h.bottom, span = c.height + h.height * 0.5;
    const p = Math.max(0, Math.min(1, (start - c.top) / Math.max(1, span)));
    target = 1 - (1 - MIN) * smooth(p);
  };
  const tick = (): void => {
    compute();
    current += (target - current) * 0.18;
    if (Math.abs(target - current) < 0.002) current = target;
    head.style.opacity = current.toFixed(3);
    raf = current !== target ? requestAnimationFrame(tick) : 0;
  };
  const kick = (): void => { if (!raf) raf = requestAnimationFrame(tick); };
  window.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', kick);
  kick();
}
