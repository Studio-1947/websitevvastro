/** Commitment carousel — prev/next slide toggle. Ported from js/main.js. */
export function commitmentCarousel(): void {
  const root = document.querySelector('[data-commit]');
  if (!root) return;
  const slides = root.querySelectorAll<HTMLElement>('.commit__slide');
  const prev = root.querySelector('[data-commit-prev]');
  const next = root.querySelector('[data-commit-next]');
  let i = 0;
  function show(n: number): void {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, idx) => s.classList.toggle('is-active', idx === i));
  }
  if (prev) prev.addEventListener('click', () => show(i - 1));
  if (next) next.addEventListener('click', () => show(i + 1));
  show(0);
}
