import { DEMO, type Cta } from '../../pharma/types';

export interface HeroContent {
  title: string;
  sub: string;
  primary: Cta;
  /** Caption over the live dashboard: it is one example, not the whole product. */
  example: string;
}

export const hero: HeroContent = {
  title: 'Turn your data into decisions',
  sub: 'Dashboards for sales, finance, operations and marketing, built around the questions your team asks.',
  primary: DEMO,
  example: 'Example: a multi-channel sales dashboard, with sample data. Try it.',
};
