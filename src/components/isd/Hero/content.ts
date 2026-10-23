import { DEMO, type Cta } from '../../pharma/types';

export interface HeroContent {
  title: string;
  sub: string;
  primary: Cta;
}

export const hero: HeroContent = {
  title: 'See every sale in one place',
  sub: 'Stores, web, marketplaces and pop-ups in one live dashboard.',
  primary: DEMO,
};
