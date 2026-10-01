import { AANGAN_URL, AANGAN_LIST_URL, type Cta, type ImageSlot } from '../types';

export interface HeroContent {
  eyebrow: string;
  /** Logo image that renders the "aangan" word of the headline. */
  logo: { src: string; alt: string; width: number; height: number };
  headlineRest: string;
  sub: string;
  /** For tourists: the main button. */
  primary: Cta;
  /** For hosts, drivers and cafes. */
  secondary: Cta;
  /** Background video. When set it replaces the image; the image slot stays as its fallback. */
  video?: { src: string; type: string; poster: string };
  image: ImageSlot;
}

export const hero: HeroContent = {
  eyebrow: 'By studio 1947',
  logo: { src: '/assets/img/products/aangan/logo-white.webp', alt: 'aangan.', width: 1109, height: 268 },
  headlineRest: 'Every experience.',
  sub: 'Homestays, cafes, drivers and the quiet spots nearby, shared by the people who live here. Scroll, pick what feels right, and you are already on your way. Starting in Darjeeling.',
  primary: { label: 'Plan your trip', href: AANGAN_URL },
  secondary: { label: 'List your homestay, cafe or taxi', href: AANGAN_LIST_URL },
  video: {
    src: '/assets/video/aangan/hero.webm',
    type: 'video/webm',
    poster: '/assets/img/products/aangan/hero-poster.webp',
  },
  image: {
    id: 'HERO-01',
    ratio: '16:9',
    alt: 'A homestay courtyard in Darjeeling with the hills behind',
    src: '/images/aangan/hero-01.svg',
    width: 1600,
    height: 900,
  },
};
