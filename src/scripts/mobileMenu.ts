/** Mobile menu drawer. Ported from js/main.js. */
export function mobileMenu(): void {
  const burger = document.querySelector('.nav__burger');
  const menu = document.querySelector('.mobile-menu');
  if (!burger || !menu) return;
  const close = menu.querySelector('.mobile-menu__close');
  burger.addEventListener('click', () => {
    menu.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  });
  function hide(): void {
    menu!.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  if (close) close.addEventListener('click', hide);
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', hide));
}
