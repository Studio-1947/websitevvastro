import { translations, textTranslations, type Lang } from '../i18n/translations';

/**
 * Swaps text for every `[data-i18n]` node to the active language, using the
 * dictionary in ../i18n/translations.ts. English is never looked up — the
 * markup's own text already is the English copy, so a missing/未-added key
 * simply leaves it untouched (safe default for pages not yet translated).
 *
 * `[data-words-i18n]` is the same idea for the hero's `data-words` attribute
 * (a pipe-separated list consumed by the typewriter effect in HomeHero); it
 * fires a `words-updated` event so that script can restart with the new list.
 */
const englishHtml = new WeakMap<HTMLElement, string>();
const englishWords = new WeakMap<HTMLElement, string>();

function applyTranslations(lang: Lang): void {
  document.documentElement.lang = lang;

  // English is the markup itself, so remember each node's original copy the
  // first time it is visited; switching back to English restores it.
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    if (!englishHtml.has(el)) englishHtml.set(el, el.innerHTML);
    const key = el.dataset.i18n;
    const text = lang === 'en' ? englishHtml.get(el) : key && translations[key]?.[lang];
    if (text != null && el.innerHTML !== text) el.innerHTML = text;
  });

  applyTextTranslations(lang);

  document.querySelectorAll<HTMLElement>('[data-words-i18n]').forEach((el) => {
    if (!englishWords.has(el)) englishWords.set(el, el.dataset.words ?? '');
    const key = el.dataset.wordsI18n;
    const words = lang === 'en' ? englishWords.get(el) : key && translations[key]?.[lang];
    if (words != null && el.dataset.words !== words) {
      el.dataset.words = words;
      el.dispatchEvent(new CustomEvent('words-updated'));
    }
  });
}

/**
 * `[data-i18n-text]` regions (the product pages) are translated by exact
 * English text instead of keys: every text node's whitespace-normalised copy
 * is looked up in `textTranslations`. This suits pages whose copy lives in
 * many component/content files, where tagging each element would be noisy.
 * Text without an entry (names, brands, long bios) stays English. Subtrees
 * marked `[data-i18n-skip]` (the interactive product UI previews) and
 * `[data-i18n]` nodes (handled above) are left alone.
 */
const englishText = new WeakMap<Text, string>();
const SKIP = 'script,style,svg,noscript,template,[data-i18n],[data-i18n-skip]';

function applyTextTranslations(lang: Lang): void {
  document.querySelectorAll<HTMLElement>('[data-i18n-text]').forEach((root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) nodes.push(n as Text);
    nodes.forEach((node) => {
      if (node.parentElement?.closest(SKIP)) return;
      if (!englishText.has(node)) englishText.set(node, node.nodeValue ?? '');
      const en = englishText.get(node)!;
      const key = en.replace(/\s+/g, ' ').trim();
      if (!key) return;
      let next = en;
      if (lang !== 'en') {
        const t = textTranslations[key]?.[lang];
        if (t == null) return restore(node, en);
        // Keep the original surrounding whitespace so inline spacing holds.
        next = en.match(/^\s*/)![0] + t + en.match(/\s*$/)![0];
      }
      restore(node, next);
    });
  });
}

function restore(node: Text, value: string): void {
  if (node.nodeValue !== value) node.nodeValue = value;
}

export function i18n(): void {
  let stored: Lang = 'en';
  try {
    stored = (localStorage.getItem('site-language') as Lang | null) || 'en';
  } catch {
    // Storage unavailable; default to English.
  }
  applyTranslations(stored);

  document.addEventListener('site-language-change', (e) => {
    applyTranslations((e as CustomEvent<{ lang: Lang }>).detail.lang);
  });
}
