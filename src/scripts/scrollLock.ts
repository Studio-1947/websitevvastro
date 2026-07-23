/**
 * Page scroll lock for overlays (person modal, contact modal, lightbox, mobile
 * menu).
 *
 * `document.body { overflow: hidden }` on its own does NOT hold the page still
 * on this site: Lenis drives the scroll position from its own rAF loop, so the
 * wheel kept moving the background behind an open overlay. Lenis has to be
 * stopped explicitly. The body rule stays because reduced-motion visitors get
 * native scrolling and no Lenis at all.
 *
 * Hiding the body scrollbar reclaims its width and shifts the whole page
 * sideways, so the gap is padded back out by exactly that much.
 *
 * Reference-counted: the lightbox can open over an already-locked modal, and
 * closing it must not restore scrolling while the modal is still up.
 */
import { getLenis } from './smoothScroll';

let depth = 0;

export function lockScroll(): void {
  if (depth++ > 0) return;
  getLenis()?.stop();
  const gap = window.innerWidth - document.documentElement.clientWidth;
  if (gap > 0) document.body.style.paddingRight = gap + 'px';
  document.body.style.overflow = 'hidden';
}

export function unlockScroll(): void {
  if (depth === 0) return;
  if (--depth > 0) return;
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
  getLenis()?.start();
}
