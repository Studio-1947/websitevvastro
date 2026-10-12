import { AANGAN_URL, AANGAN_LIST_URL, type Cta, type ImageSlot } from '../types';

export interface HeroContent {
  /** Logo image: it is the page's headline. */
  logo: { src: string; alt: string; width: number; height: number };
  /** Quiet line under the logo. */
  tagline: string;
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
  logo: { src: '/assets/img/products/aangan/logo-white.webp', alt: 'Aangan.', width: 1109, height: 268 },
  tagline: 'A product by Studio 1947, for travellers and the people who host them',
  sub: 'Homestays, cafes and drivers, shared by the people who live here. Find the ones that suit you and talk to them directly. Starting in Darjeeling, open to everyone.',
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
