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
