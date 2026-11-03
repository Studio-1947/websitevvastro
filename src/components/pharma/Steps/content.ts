import type { StepsContent } from '../../isd/content';

/*
 * How it works on the Pharma ERP page: set up, sell, restock. Every English
 * string here has a Hindi, Bengali and Nepali entry in
 * src/i18n/text/products.ts; change both together.
 */
export const steps: StepsContent = {
  title: 'Three steps to a smoother counter',
  lede: 'We set it up with you, so you are billing from it within days.',
  steps: [
    {
      label: 'Set up',
      title: 'Bring your stock in',
      body: 'Your medicine list, batches, expiry dates and suppliers come in once, from the spreadsheets or software you use today.',
    },
    {
      label: 'Sell',
      title: 'Bill at the counter',
      body: 'Search a medicine, print the bill and move on. Stock and expiry update with every sale, even when the internet drops.',
    },
    {
      label: 'Restock',
      title: 'Reorder before you run out',
      body: 'Low stock and short-dated batches are flagged every morning, and a purchase order goes to your supplier in one step.',
    },
  ],
  sources: [
    { label: 'Medicine list', color: '#E8900C' },
    { label: 'Batches and expiry', color: '#0F9D74' },
    { label: 'Suppliers', color: '#2563EB' },
    { label: 'Old billing software', color: '#D9364A' },
  ],
};
