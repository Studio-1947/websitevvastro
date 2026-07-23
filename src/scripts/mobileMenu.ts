/** Mobile menu drawer. Ported from js/main.js. */
import { lockScroll, unlockScroll } from './scrollLock';

export function mobileMenu(): void {
  const burger = document.querySelector('.nav__burger');
  const menu = document.querySelector('.mobile-menu');
  if (!burger || !menu) return;
  const close = menu.querySelector('.mobile-menu__close');
  burger.addEventListener('click', () => {
    if (menu.classList.contains('is-open')) return;
    menu.classList.add('is-open');
    lockScroll();
  });
  // Guarded on the open state: `hide` is bound to every link in the drawer, and
  // the contact modal force-closes the drawer when it opens — without this an
  // extra `hide` would release a lock the drawer no longer owns.
  function hide(): void {
    if (!menu!.classList.contains('is-open')) return;
    menu!.classList.remove('is-open');
    unlockScroll();
  }
  if (close) close.addEventListener('click', hide);
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', hide));
}
