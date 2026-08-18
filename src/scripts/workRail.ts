/**
 * Arrow paging for the "More work" rail. The track is a scroll-snapping row,
 * so the arrows only have to move it by one page of cards; the browser keeps
 * the snapping and the momentum. Arrows disable themselves at either end.
 */
export function workRail(): void {
  const rails = document.querySelectorAll<HTMLElement>('[data-work-rail]');
  rails.forEach((rail) => {
    const track = rail.querySelector<HTMLElement>('[data-rail-track]');
    const prev = rail.querySelector<HTMLButtonElement>('[data-rail-prev]');
    const next = rail.querySelector<HTMLButtonElement>('[data-rail-next]');
    if (!track || !prev || !next) return;

    const page = (): number => track.clientWidth;
    const sync = (): void => {
      const max = track.scrollWidth - track.clientWidth - 1;
      prev.disabled = track.scrollLeft <= 1;
      next.disabled = track.scrollLeft >= max;
    };
    const go = (dir: number): void =>
      track.scrollBy({ left: dir * page(), behavior: 'smooth' });

    prev.addEventListener('click', () => go(-1));
    next.addEventListener('click', () => go(1));
    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  });
}
