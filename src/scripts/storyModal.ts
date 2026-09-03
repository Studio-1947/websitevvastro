/**
 * "Submit your story" popup on /local-design/. Same visual system as the
 * site-wide contact modal (reuses .contact-modal CSS by class, not id), with
 * its own id/triggers so both can exist independently.
 */
import { lockScroll, unlockScroll } from './scrollLock';

export function storyModal(): void {
  const modal = document.getElementById('story-modal');
  if (!modal) return;
  const triggers = document.querySelectorAll<HTMLElement>('[data-story-open]');
  if (!triggers.length) return;
  const panel = modal.querySelector<HTMLElement>('.contact-modal__panel');
  let lastFocus: HTMLElement | null = null;

  function open(e?: Event): void {
    if (e) e.preventDefault();
    lastFocus = document.activeElement as HTMLElement;
    modal!.classList.add('is-open');
    modal!.setAttribute('aria-hidden', 'false');
    lockScroll();
    if (panel) panel.focus();
  }
  function close(): void {
    if (!modal!.classList.contains('is-open')) return;
    modal!.classList.remove('is-open');
    modal!.setAttribute('aria-hidden', 'true');
    unlockScroll();
    if (lastFocus) lastFocus.focus();
  }
  triggers.forEach((t) => t.addEventListener('click', open));
  modal.querySelectorAll('[data-story-close]').forEach((el) =>
    el.addEventListener('click', close)
  );
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
  });
}
