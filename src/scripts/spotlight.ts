/**
 * Spotlight cards. Each card tracks the pointer and paints a soft highlight
 * under it, so a grid of cards lights up as the cursor crosses it. The maths
 * stays in CSS; this only reports where the pointer is, on a frame budget.
 */
export function spotlightCards(): void {
  const cards = document.querySelectorAll<HTMLElement>('[data-spotlight]');
  if (!cards.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(hover: hover)').matches) return;

  cards.forEach((card) => {
    let frame = 0;
    card.addEventListener('pointermove', (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
      });
    });
    card.addEventListener('pointerleave', () => card.style.removeProperty('--mouse-x'));
  });
}
