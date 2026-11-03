import { DEMO, type Cta } from '../types';

export interface HeroContent {
  /** Product name, shown above the headline. */
  name: string;
  /** What it is, after the name. */
  kind: string;
  title: string;
  sub: string;
  primary: Cta;
  /** Caption over the live demo: it is one example, not the whole product. */
  example: string;
}

export const hero: HeroContent = {
  name: 'Pharma ERP',
  kind: '(Pharmacy management)',
  title: 'Run your pharmacy from one place',
  sub: 'Billing, stock and expiry dates in one simple system.',
  primary: DEMO,
  example: "Example: a pharmacy's billing and stock screens, with sample data. Try it.",
};
