/** "Our Approach" animated vertical stepper — auto-advance 4.2s, click to jump. Ported. */
export function approachStepper(): void {
  const root = document.querySelector('[data-approach] .astep');
  if (!root) return;
  const items = Array.prototype.slice.call(
    root.querySelectorAll('.astep__item')
  ) as HTMLElement[];
  if (!items.length) return;
  let i = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let paused = false;
  const DELAY = 4200;
  function activate(n: number): void {
    i = (n + items.length) % items.length;
    items.forEach((it, idx) => it.classList.toggle('is-active', idx === i));
  }
  function schedule(): void {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      if (!paused) activate(i + 1);
      schedule();
    }, DELAY);
  }
  items.forEach((it, idx) => {
    const row = it.querySelector('.astep__row');
    if (row)
      row.addEventListener('click', () => {
        activate(idx);
        schedule();
      });
  });
  root.addEventListener('mouseenter', () => (paused = true));
  root.addEventListener('mouseleave', () => (paused = false));
  activate(0);
  schedule();
}
