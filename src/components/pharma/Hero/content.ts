import { DEMO, type Cta } from '../types';

export interface HeroContent {
  title: string;
  sub: string;
  primary: Cta;
}

export const hero: HeroContent = {
  title: 'Run your pharmacy from one place',
  sub: 'Billing, stock and expiry dates in one simple system.',
  primary: DEMO,
};
