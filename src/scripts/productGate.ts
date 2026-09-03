/**
 * Client side of the product page release gate (see lib/productRelease.ts).
 * The released list arrives on <body data-products-released="a,b,c">; local
 * hosts are exempt so the team can review every product before it ships.
 */
const LOCAL = ['localhost', '127.0.0.1', '::1', '[::1]'];

function isLocal(): boolean {
  const h = location.hostname;
  return LOCAL.includes(h) || h.endsWith('.local') || h.endsWith('.localhost');
}
function slugOf(href: string): string | null {
  try {
    const u = new URL(href, location.href);
    if (u.origin !== location.origin) return null;
    const m = u.pathname.match(/^\/products\/([a-z0-9-]+)\/?$/);
    return m ? m[1] : null;
  } catch { return null; }
}

let modal: HTMLElement | null = null;
function openModal(): void {
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'work-gate';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'product-gate-title');
    modal.innerHTML = `
      <div class="work-gate__backdrop" data-gate-close></div>
      <div class="work-gate__card">
        <p class="work-gate__eyebrow">Products</p>
        <h2 class="work-gate__title" id="product-gate-title">Coming soon</h2>
        <p class="work-gate__text">This product page is a work in progress. We are polishing it and will publish it shortly.</p>
        <div class="work-gate__actions">
          <button type="button" class="btn-hello work-gate__btn" data-gate-close>Got it
            <span class="arrow" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
          </button>
          <a class="work-gate__link" href="/sayhello/" data-contact-open>Ask us about this product</a>
        </div>
      </div>`;
    document.body.appendChild(modal);
    modal.querySelectorAll('[data-gate-close]').forEach((el) => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  }
  modal.classList.add('is-open');
  document.body.classList.add('work-gate-open');
  modal.querySelector<HTMLElement>('.work-gate__btn')?.focus();
}
function closeModal(): void {
  modal?.classList.remove('is-open');
  document.body.classList.remove('work-gate-open');
}

export function productGate(): void {
  if (isLocal()) return;
  const released = (document.body.dataset.productsReleased || '').split(',').map((s) => s.trim()).filter(Boolean);
  const gated = (slug: string): boolean => !released.includes(slug);

  // 1. A gated product visited directly: swap the page body for the panel.
  const here = slugOf(location.href);
  if (here && gated(here)) {
    const main = document.querySelector('main');
    if (main) {
      main.innerHTML = `
        <section class="section container work-gate-panel">
          <p class="eyebrow">Products</p>
          <h1 class="work-gate-panel__title">Coming soon.</h1>
          <p class="work-gate-panel__text">This product page is a work in progress. We are polishing it and will publish it shortly.</p>
          <a class="btn-hello" href="/products/">Back to products
            <span class="arrow" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
          </a>
        </section>`;
      main.removeAttribute('style');
    }
    document.title = 'Coming soon | Studio 1947';
  }

  // 2. Any link to a gated product anywhere on the site: popup instead.
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href]');
    if (!a) return;
    const slug = slugOf(a.href);
    if (slug && gated(slug)) { e.preventDefault(); openModal(); }
  }, true);
}
