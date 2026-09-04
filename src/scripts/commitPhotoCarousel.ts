/** Home "Our Commitment" photo — cross-fades through a shuffled order of
 * the team photos, one after another, so the slot doesn't always open on
 * the same shot. */
export function commitPhotoCarousel(): void {
  const root = document.querySelector<HTMLElement>('[data-commit-photos]');
  if (!root) return;
  const photos = Array.from(root.querySelectorAll<HTMLElement>('.commit__photo'));
  if (photos.length < 2) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Fisher-Yates shuffle so playback order differs per page load.
  const order = photos.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }

  let step = 0;
  setInterval(() => {
    step = (step + 1) % order.length;
    photos.forEach((p, i) => p.classList.toggle('is-active', i === order[step]));
  }, 4500);
}
