import { DEMO, type Cta } from '../types';

export interface ClosingContent {
  title: string;
  sub: string;
  primary: Cta;
  secondary: Cta;
  /**
   * Opt-in: show the secondary link as a plain line of text that underlines on
   * hover, with this word before it (e.g. "Read"), instead of a second button.
   * Left out, it stays a button (the Pharma ERP page).
   */
  secondaryLead?: string;
}

export const closing: ClosingContent = {
  title: 'See it working in your shop',
  sub: "Book a demo and we'll walk you through it.",
  primary: DEMO,
  secondary: {
    label: 'What pharmacies need from inventory software',
    href: '/blog/pharmacy-inventory-management-software/',
  },
  secondaryLead: 'Read',
};
