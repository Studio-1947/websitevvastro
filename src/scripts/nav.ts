/** Nav dropdowns (About / Solutions / Products). Ported from js/main.js. */
export function navDropdowns(): void {
  const items = document.querySelectorAll<HTMLElement>('.nav__item.has-dropdown');
  if (!items.length) return;
  function closeAll(): void {
    items.forEach((o) => {
      o.classList.remove('is-open');
      const t = o.querySelector('.nav__trigger');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }
  items.forEach((item) => {
    const trigger = item.querySelector('.nav__trigger');
    if (!trigger) return;
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = item.classList.contains('is-open');
      closeAll();
      if (!open) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
  document.addEventListener('click', closeAll);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });
  // Close on scroll so a panel never lingers detached (harmless with fixed header).
  window.addEventListener('scroll', closeAll, { passive: true });
}

/**
 * The bar sits flat at the top of a page and lifts on a shadow once the page
 * has moved. 8px of travel is enough to count as scrolled without the shadow
 * flickering on a trackpad's rubber-band.
 */
export function headerPill(): void {
  const header = document.querySelector<HTMLElement>('.site-header');
  if (!header) return;
  let ticking = false;
  const sync = (): void => {
    ticking = false;
    header.classList.toggle('is-stuck', window.scrollY > 8);
  };
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(sync);
    },
    { passive: true }
  );
  sync();
}
