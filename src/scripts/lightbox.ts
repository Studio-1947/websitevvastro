/**
 * Case-study image lightbox. Replaces the eight near-identical React `Lightbox`
 * components that each portfolio page in the source project defined inline.
 *
 * Event-delegated from a single listener, so it costs nothing on the pages that
 * have no zoomable figures and needs no per-image wiring.
 */

/** Elements are created on first zoom, not on every page load. */
let overlay: HTMLDivElement | null = null;
let img: HTMLImageElement | null = null;
let lastFocused: HTMLElement | null = null;

function build(): void {
  overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.hidden = true;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Expanded image');

  img = document.createElement('img');
  img.alt = '';

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'lightbox__close';
  close.setAttribute('aria-label', 'Close');
  close.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';

  overlay.append(img, close);
  document.body.appendChild(overlay);

  // Backdrop click closes; clicking the image itself should not.
  overlay.addEventListener('click', (e) => {
    if (e.target === img) return;
    hide();
  });
}

function show(src: string, alt: string): void {
  if (!overlay) build();
  if (!overlay || !img) return;
  lastFocused = document.activeElement as HTMLElement | null;
  img.src = src;
  img.alt = alt;
  overlay.hidden = false;
  // Prevent the page behind from scrolling while open.
  document.body.style.overflow = 'hidden';
  overlay.querySelector<HTMLButtonElement>('.lightbox__close')?.focus();
}

function hide(): void {
  if (!overlay) return;
  overlay.hidden = true;
  document.body.style.overflow = '';
  lastFocused?.focus();
  lastFocused = null;
}

export function caseLightbox(): void {
  const zoomables = document.querySelectorAll<HTMLElement>('.case-figure--zoom');
  if (!zoomables.length) return;

  document.addEventListener('click', (e) => {
    const fig = (e.target as HTMLElement).closest<HTMLElement>('.case-figure--zoom');
    if (!fig) return;
    const target = fig.querySelector('img');
    if (!target) return;
    // Prefer the full-resolution source when a srcset downscaled the render.
    show(target.getAttribute('data-full') || target.currentSrc || target.src, target.alt);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay && !overlay.hidden) hide();
  });
}
