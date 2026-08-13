/**
 * Site-wide search overlay — opened from the nav magnifier. The search index
 * is generated at build time (src/lib/search.ts → /search-index.json); it is
 * fetched lazily on first open, cached for the session, and scored client-side
 * so keystrokes never hit the network.
 *
 * Scoring is a simple weighted term match over title / keywords / description /
 * body text, biased hard toward the title so a page called "Kulam Homestay"
 * wins over any blog that merely mentions it.
 */
import { lockScroll, unlockScroll } from './scrollLock';

interface SearchDoc {
  url: string;
  type: string;
  title: string;
  description: string;
  keywords: string;
  text: string;
}

const MAX_RESULTS = 8;
let indexPromise: Promise<SearchDoc[]> | null = null;

function loadIndex(): Promise<SearchDoc[]> {
  if (!indexPromise) {
    indexPromise = fetch('/search-index.json')
      .then((r) => (r.ok ? (r.json() as Promise<SearchDoc[]>) : []))
      .catch(() => []);
  }
  return indexPromise;
}

/** Lowercase, split into words (Latin + Devanagari/Bengali etc.). */
function tokenize(q: string): string[] {
  return q.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
}

function score(doc: SearchDoc, tokens: string[]): number {
  const title = doc.title.toLowerCase();
  const kw = doc.keywords.toLowerCase();
  const desc = doc.description.toLowerCase();
  let s = 0;
  for (const t of tokens) {
    if (title.includes(t)) s += 12;
    else if (title.startsWith(t)) s += 6;
    if (kw.includes(t)) s += 4;
    if (desc.includes(t)) s += 2;
    if (doc.text.includes(t)) s += 1;
  }
  // Exact-phrase hits in the title are the strongest signal.
  const phrase = tokens.join(' ');
  if (phrase && title.includes(phrase)) s += 20;
  return s;
}

export function siteSearch(): void {
  const modal = document.getElementById('search-modal');
  const openBtn = document.querySelector<HTMLElement>('[data-search-open]');
  const input = modal?.querySelector<HTMLInputElement>('[data-search-input]');
  const resultsEl = modal?.querySelector<HTMLElement>('[data-search-results]');
  if (!modal || !openBtn || !input || !resultsEl) return;

  let lastFocus: HTMLElement | null = null;
  let activeIndex = -1;
  let items: HTMLElement[] = [];
  let debounce = 0;

  function open(): void {
    lastFocus = document.activeElement as HTMLElement;
    modal!.classList.add('is-open');
    modal!.setAttribute('aria-hidden', 'false');
    openBtn!.setAttribute('aria-expanded', 'true');
    lockScroll();
    // The modal opens centered over the page; kick off the one-time index
    // fetch while the user starts typing.
    void loadIndex();
    input!.value = '';
    render([]);
    input!.focus();
  }

  function close(): void {
    modal!.classList.remove('is-open');
    modal!.setAttribute('aria-hidden', 'true');
    openBtn!.setAttribute('aria-expanded', 'false');
    unlockScroll();
    activeIndex = -1;
    if (lastFocus) lastFocus.focus();
  }

  /** Build the result rows from an already-scored, sorted doc list. */
  function render(docs: SearchDoc[]): void {
    resultsEl!.innerHTML = '';
    items = [];
    activeIndex = -1;
    if (!docs.length) {
      const empty = document.createElement('p');
      empty.className = 'search-modal__empty';
      empty.textContent = input!.value.trim()
        ? 'No results found.'
        : 'Type to search the whole site — portfolios, blogs, products and more.';
      resultsEl!.appendChild(empty);
      return;
    }
    docs.forEach((doc) => {
      const a = document.createElement('a');
      a.className = 'search-result';
      a.href = doc.url;
      a.setAttribute('role', 'option');

      const chip = document.createElement('span');
      chip.className = 'search-result__type';
      chip.textContent = doc.type;
      a.appendChild(chip);

      const body = document.createElement('span');
      body.className = 'search-result__body';
      const t = document.createElement('span');
      t.className = 'search-result__title';
      t.textContent = doc.title;
      body.appendChild(t);
      if (doc.description) {
        const d = document.createElement('span');
        d.className = 'search-result__desc';
        d.textContent = doc.description;
        body.appendChild(d);
      }
      a.appendChild(body);
      resultsEl!.appendChild(a);
      items.push(a);
    });
  }

  async function runSearch(q: string): Promise<void> {
    const tokens = tokenize(q);
    if (!tokens.length) {
      render([]);
      return;
    }
    const index = await loadIndex();
    // Guard: the user may have closed the overlay (or kept typing) while the
    // index was still loading — only paint results for the current query.
    if (input!.value !== q || !modal!.classList.contains('is-open')) return;
    const ranked = index
      .map((doc) => ({ doc, s: score(doc, tokens) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, MAX_RESULTS)
      .map((r) => r.doc);
    render(ranked);
  }

  function activate(i: number): void {
    if (!items.length) return;
    activeIndex = (i + items.length) % items.length;
    items.forEach((el, idx) => el.classList.toggle('is-active', idx === activeIndex));
    items[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }

  openBtn.addEventListener('click', () => {
    if (modal.classList.contains('is-open')) close();
    else open();
  });

  modal.querySelectorAll('[data-search-close]').forEach((el) => el.addEventListener('click', close));

  input.addEventListener('input', () => {
    window.clearTimeout(debounce);
    debounce = window.setTimeout(() => void runSearch(input!.value), 90);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      activate(activeIndex + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activate(activeIndex - 1);
    } else if (e.key === 'Enter') {
      const target = items[activeIndex >= 0 ? activeIndex : 0];
      if (target) {
        e.preventDefault();
        window.location.href = target.getAttribute('href') || '/';
      }
    }
  });

  // Clicking a result navigates; the page reload unmounts the modal anyway,
  // but clean up the scroll lock for same-page behaviour.
  resultsEl.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) unlockScroll();
  });

  document.addEventListener('keydown', (e) => {
    // Global shortcut: "/" opens search from anywhere on the site.
    if (e.key === '/' && !modal.classList.contains('is-open') && !isTyping(e.target as HTMLElement)) {
      e.preventDefault();
      open();
    }
    if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
  });
}

/** Don't hijack "/" while the user is typing in another field. */
function isTyping(el: HTMLElement | null): boolean {
  if (!el) return false;
  return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable;
}
