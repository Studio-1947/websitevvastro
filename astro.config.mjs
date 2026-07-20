// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://1947.io',
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
    sitemap(),
  ],
  vite: {
    // GSAP 3.12.5 ships fine as an ESM import; nothing special needed here yet.
  },
});
