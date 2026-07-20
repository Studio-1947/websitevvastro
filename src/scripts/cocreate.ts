/** "We Co-Create" lines — auto-cycle a highlight every 1.8s. Ported from js/main.js. */
export function cocreateCycle(): void {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lines = Array.prototype.slice.call(
    document.querySelectorAll('.cocreate__line')
  ) as HTMLElement[];
  if (lines.length < 2 || reduceMotion) return;
  let i = 0;
  let paused = false;
  const wrap = lines[0].closest('.cocreate__lines');
  if (wrap) {
    wrap.addEventListener('mouseenter', () => (paused = true));
    wrap.addEventListener('mouseleave', () => (paused = false));
  }
  function tick(): void {
    if (paused) return;
    lines.forEach((l, idx) => l.classList.toggle('is-active', idx === i));
    i = (i + 1) % lines.length;
  }
  tick();
  setInterval(tick, 1800);
}
