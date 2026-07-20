/**
 * Contact popup — nav / footer "Say Hello" buttons open a form modal instead of
 * navigating (href="/sayhello/" stays as the no-JS fallback). Ported from
 * js/main.js.
 */
export function contactModal(): void {
  const modal = document.getElementById('contact-modal');
  if (!modal) return;
  const triggers = document.querySelectorAll<HTMLElement>(
    '.site-header .btn-hello, .mobile-menu a[href="/sayhello/"], [data-contact-open]'
  );
  if (!triggers.length) return;
  const panel = modal.querySelector<HTMLElement>('.contact-modal__panel');
  let lastFocus: HTMLElement | null = null;

  function open(e?: Event): void {
    if (e) e.preventDefault();
    lastFocus = document.activeElement as HTMLElement;
    const mm = document.querySelector('.mobile-menu.is-open');
    if (mm) mm.classList.remove('is-open');
    modal!.classList.add('is-open');
    modal!.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (panel) panel.focus();
  }
  function close(): void {
    modal!.classList.remove('is-open');
    modal!.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
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
