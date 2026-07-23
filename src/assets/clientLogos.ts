/**
 * Client logo marquee assets.
 *
 * The homepage renders the logo strip twice (small, inside the hero row; and
 * large, above the testimonials), so the imports live here rather than being
 * duplicated in both components. Importing through `src/assets` — not
 * `public/` — is what lets Astro emit width/height + a density srcset for each
 * logo, which is why these files were moved out of `public/`.
 */
import type { ImageMetadata } from 'astro';

import logo01 from './img/logo-01.webp';
import logo02 from './img/logo-02.webp';
import logo03 from './img/logo-03.webp';
import logo04 from './img/logo-04.webp';
import logo05 from './img/logo-05.webp';
import logo06 from './img/logo-06.webp';
import logo07 from './img/logo-07.webp';
import logo08 from './img/logo-08.webp';
import logo09 from './img/logo-09.webp';
import logo10 from './img/logo-10.webp';

export interface ClientLogo {
  src: ImageMetadata;
  /** `.logo-seal` renders taller — the two seal-shaped marks in the hero strip. */
  seal?: boolean;
}

export const clientLogos: ClientLogo[] = [
  { src: logo01 },
  { src: logo02 },
  { src: logo03 },
  { src: logo04, seal: true },
  { src: logo05, seal: true },
  { src: logo06 },
  { src: logo07 },
  { src: logo08 },
  { src: logo09 },
  { src: logo10 },
];
