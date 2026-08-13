/** Mobile menu drawer. Ported from js/main.js. */
import { lockScroll, unlockScroll } from './scrollLock';

export function mobileMenu(): void {
  const burger = document.querySelector('.nav__burger');
  const menu = document.querySelector<HTMLElement>('.mobile-menu');
  if (!burger || !menu) return;
  const close = menu.querySelector('.mobile-menu__close');
  burger.addEventListener('click', () => {
    if (menu.classList.contains('is-open')) return;
    menu.classList.add('is-open');
    menu.inert = false;
    lockScroll();
  });
  // Guarded on the open state: `hide` is bound to every link in the drawer, and
  // the contact modal force-closes the drawer when it opens — without this an
  // extra `hide` would release a lock the drawer no longer owns.
  function hide(): void {
    if (!menu!.classList.contains('is-open')) return;
    menu!.classList.remove('is-open');
    // Closed drawer must leave the tab order and a11y tree entirely — with it
    // merely off-canvas, its links stay focusable and Lighthouse flags
    // "ARIA hidden element must not be focusable".
    menu!.inert = true;
    unlockScroll();
  }
  if (close) close.addEventListener('click', hide);
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', hide));
}
