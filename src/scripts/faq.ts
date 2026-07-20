/** FAQ accordion — one-open, first item open by default. Ported from js/main.js. */
export function accordion(): void {
  const items = document.querySelectorAll<HTMLElement>('.faq__item');
  items.forEach((item) => {
    const q = item.querySelector('.faq__q');
    const a = item.querySelector<HTMLElement>('.faq__a');
    if (!q || !a) return;
    q.addEventListener('click', () => {
      const open = item.classList.contains('is-open');
      items.forEach((o) => {
        o.classList.remove('is-open');
        const oa = o.querySelector<HTMLElement>('.faq__a');
        if (oa) oa.style.maxHeight = '';
      });
      if (!open) {
        item.classList.add('is-open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });
  // open first by default
  if (items[0]) {
    items[0].classList.add('is-open');
    const fa = items[0].querySelector<HTMLElement>('.faq__a');
    if (fa) fa.style.maxHeight = fa.scrollHeight + 'px';
  }
}
