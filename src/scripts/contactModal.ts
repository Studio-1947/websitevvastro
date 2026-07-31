/**
 * Contact popup — nav / footer "Say Hello" buttons open a form modal instead of
 * navigating (href="/sayhello/" stays as the no-JS fallback). Ported from
 * js/main.js.
 */
import { lockScroll, unlockScroll } from './scrollLock';

export function contactModal(): void {
  const modal = document.getElementById('contact-modal');
  if (!modal) return;
  const triggers = document.querySelectorAll<HTMLElement>(
    '.site-header .btn-hello, .mobile-menu a[href="/sayhello/"], [data-contact-open]'
  );
  if (!triggers.length) return;
  const panel = modal.querySelector<HTMLElement>('.contact-modal__panel');
  const video = modal.querySelector<HTMLVideoElement>('[data-cm-video]');
  // Autoplaying a looping reel is motion the user didn't ask for — hold it for
  // reduced-motion visitors; the still first frame stays.
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lastFocus: HTMLElement | null = null;

  function open(e?: Event): void {
    if (e) e.preventDefault();
    lastFocus = document.activeElement as HTMLElement;
    // Hand the drawer's scroll lock over rather than stacking a second one —
    // the counter would otherwise never unwind back to zero.
    const mm = document.querySelector('.mobile-menu.is-open');
    if (mm) {
      mm.classList.remove('is-open');
      unlockScroll();
    }
    modal!.classList.add('is-open');
    modal!.setAttribute('aria-hidden', 'false');
    lockScroll();
    // Start the reel only now — preload="metadata" kept its 2.8 MB off the
    // page load, so the first open is what fetches and plays it.
    if (video && !reduce) video.play().catch(() => {});
    if (panel) panel.focus();
  }
  function close(): void {
    if (!modal!.classList.contains('is-open')) return;
    modal!.classList.remove('is-open');
    modal!.setAttribute('aria-hidden', 'true');
    unlockScroll();
    // Pause and rewind so it doesn't keep decoding off-screen and starts fresh
    // on the next open.
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    if (lastFocus) lastFocus.focus();
  }
  triggers.forEach((t) => t.addEventListener('click', open));
  modal.querySelectorAll('[data-cm-close]').forEach((el) =>
    el.addEventListener('click', close)
  );
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
  });
}
