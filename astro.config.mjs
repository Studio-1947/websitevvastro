// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

// Blog post dates (YYYY-MM-DD), read at config-eval time so the sitemap's
// <lastmod> stays in sync with the content files. Only blog URLs carry a real
// date; every other page is left without lastmod rather than stamped with a
// guess.
const blogDates = (() => {
  const dir = path.join(process.cwd(), 'src/content/blog');
  const dates = new Map();
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.json')) continue;
    const slug = f.replace(/\.json$/, '');
    const d = JSON.parse(readFileSync(path.join(dir, f), 'utf-8'));
    if (d.date) dates.set(slug, d.date);
  }
  return dates;
})();

// https://astro.build/config
export default defineConfig({
  site: 'https://www.1947.io',
  // Clean directory URLs so routes resolve at /about-us/ etc. — identical to the
  // original static site's <slug>/index.html structure.
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [
    tailwind({
      // We keep the site's own base styles in src/styles/global.css; Tailwind's
      // Preflight would clash with the ported reset, so it's disabled here.
      applyBaseStyles: false,
    }),
    mdx(),
    sitemap({
      // Pages marked `noindex` must not be advertised in the sitemap either —
      // submitting a URL while asking robots to ignore it is contradictory.
      // Currently the two unwritten product pages (body copy still TODO).
      filter: (page) =>
        !/\/products\/(aangar-erp|1-darjeeling)\/$/.test(page) &&
        // Retired case studies (active: false) are out of the portfolio, so
        // they are not advertised here either.
        !/\/work\/(sundargaan)\/$/.test(page),
      // Stamp each blog post's real publication date as its <lastmod>.
      serialize: (item) => {
        const m = /^https:\/\/www\.1947\.io\/blog\/([^/]+)\/$/.exec(item.url);
        const date = m && blogDates.get(m[1]);
        return date ? { ...item, lastmod: date } : item;
      },
    }),
  ],
  vite: {
    // GSAP 3.12.5 ships fine as an ESM import; nothing special needed here yet.
  },
});
