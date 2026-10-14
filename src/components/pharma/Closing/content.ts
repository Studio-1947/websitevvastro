import { DEMO, type Cta } from '../types';

export interface ClosingContent {
  title: string;
  sub: string;
  primary: Cta;
  secondary: Cta;
}

export const closing: ClosingContent = {
  title: 'See it working in your shop',
  sub: "Book a demo and we'll walk you through it.",
  primary: DEMO,
  secondary: {
    label: 'What pharmacies need from inventory software',
    href: '/blog/pharmacy-inventory-management-software/',
  },
};
