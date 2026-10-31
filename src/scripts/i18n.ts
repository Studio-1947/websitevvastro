import { translations, type Lang } from '../i18n/translations';

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
