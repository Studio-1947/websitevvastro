/**
 * Client-side translation dictionary for `data-i18n` swapping (see
 * ../scripts/i18n.ts). English lives in the markup itself as the fallback
 * and source of truth; each page file below only needs to carry hi/bn/ne.
 *
 * Machine/first-pass translations — flag anything that reads awkwardly to a
 * native speaker before treating a language as launch-ready.
 */
import type { Entry } from './types';
import { global } from './pages/global';
import { home } from './pages/home';
import { about } from './pages/about';
import { solutions } from './pages/solutions';
import { careers } from './pages/careers';
import { blog } from './pages/blog';
import { work } from './pages/work';

export type { Lang } from './types';

export const translations: Record<string, Entry> = {
  ...global,
  ...home,
  ...about,
  ...solutions,
  ...careers,
  ...blog,
  ...work,
};
