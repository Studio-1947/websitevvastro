/*
 * Text for the Business Intelligence Dashboards page below the hero. The
 * sections themselves are the Pharma ERP page's (components/pharma/Rows,
 * Toolkit, Closing), so both product pages read as one family.
 * The mocks use the same made-up business as the live dashboard.
 */
import { DEMO } from '../pharma/types';
import { CITIES } from './Dashboard/content';
import type { Pin } from './Map/IndiaMap.astro';
import type { Row } from '../pharma/Rows/content';
import type { ToolkitContent } from '../pharma/Toolkit/content';
import type { ClosingContent } from '../pharma/Closing/content';

export const rows: Row[] = [
  {
    title: 'One number everyone trusts',
    body: 'Stores, web store, pop-ups and partners add up into one net figure, with returns already taken off. Pick a channel and every number on the screen follows.',
    mock: {
      title: 'Net revenue · FYTD',
      tag: 'Live',
      tagTone: 'green',
      head: ['Channel', 'Net', 'Share'],
      rows: [
        { cells: ['North Store', '₹1.57 Cr', '28%'] },
        { cells: ['Online', '₹1.27 Cr', '23%'] },
        { cells: ['West Store', '₹98.1 L', '18%'] },
        { cells: ['All channels', '₹5.53 Cr', '100%'], tone: 'green' },
      ],
    },
  },
  {
    title: 'Returns, counted before they surprise you',
    body: 'What went out, what came back, and what is left. Each channel shows its own return rate, so a store sending back one item in seven stands out.',
    mock: {
      title: 'East Store',
      tag: '14% returned',
      tagTone: 'red',
      rows: [
        { cells: ['Gross out', '₹81.2 L'] },
        { cells: ['Returns in', '₹11.4 L'], tone: 'red', note: 'Highest' },
        { cells: ['Net', '₹69.8 L'], tone: 'green' },
      ],
    },
  },
  {
    title: 'See stock-outs before they happen',
    body: 'Every product shows how many weeks of stock are left at the rate it is selling, ranked so the next restock is always at the top.',
    mock: {
      title: 'Restock due',
      tag: 'This week',
      tagTone: 'pine',
      head: ['Product', 'Left', 'Weeks'],
      rows: [
        { cells: ['Yoga Mat Pro', '190', '2.0'], tone: 'red', note: 'Restock' },
        { cells: ['Organic Green Tea', '260', '2.2'], tone: 'red' },
        { cells: ['Herbal Face Wash', '380', '2.5'], tone: 'amber' },
      ],
    },
  },
];

export interface Step { label: string; title: string; body: string }
export interface StepsContent {
  title: string;
  lede: string;
  steps: Step[];
  /** Sources shown in the first step's picture. */
  sources: { label: string; color: string }[];
}

export const steps: StepsContent = {
  title: 'Three steps to a dashboard your team trusts',
  lede: 'We do the setup with you, so it is live in days, not months.',
  steps: [
    {
      label: 'Connect',
      title: 'Bring every sale into one place',
      body: 'Billing software, your web store, marketplaces and the spreadsheets your stores already keep. We connect them once and they stay in sync.',
    },
    {
      label: 'Build',
      title: 'Shaped around your questions',
      body: 'We start from what your team asks every week and build the views that answer it: channels, products, stock and people.',
    },
    {
      label: 'Share',
      title: 'The right numbers to the right people',
      body: 'Owners see every channel, store managers see their own. Reports land in the inbox on schedule, and anything exports in a click.',
    },
  ],
  sources: [
    { label: 'Store billing', color: '#3B82F6' },
    { label: 'Web store', color: '#F97316' },
    { label: 'Marketplaces', color: '#10B981' },
    { label: 'Spreadsheets', color: '#8B5CF6' },
  ],
};

export interface WhereContent { title: string; body: string; foot: string; cities: readonly Pin[] }

export const where: WhereContent = {
  title: 'Know where your orders come from',
  body: 'Every order is placed on the map, from the store till to the web checkout, so you can see which cities are growing and where a new store or a campaign would pay off.',
  foot: 'Share of net revenue by city, financial year to date. Sample data.',
  cities: CITIES,
};

export const toolkit: ToolkitContent = {
  title: 'Everything in one place',
  lede: 'Every view reads from the same synced sales data, so the numbers always agree.',
  tools: [
    {
      title: 'Live sales overview',
      body: 'Revenue, units and projections at a glance.',
      icon: '<path d="M3 3v18h18"/><path d="M7 15V9M12 15V6M17 15v-4"/>',
    },
    {
      title: 'Stock signals',
      body: 'Low stock and restocks, before they bite.',
      icon: '<path d="M12 2 21 7v10l-9 5-9-5V7Z"/><path d="M12 12 21 7M12 12v10M12 12 3 7"/>',
    },
    {
      title: 'Channel performance',
      body: 'Stores, online and pop-ups side by side.',
      icon: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    },
    {
      title: 'Year on year',
      body: 'Any period against the same one last year.',
      icon: '<path d="M3 17l6-6 4 4 8-8"/><path d="M17 7h4v4"/>',
    },
    {
      title: 'Geography',
      body: 'Orders by city and state.',
      icon: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    },
    {
      title: 'Product and team views',
      body: 'Top products and sellers, ranked.',
      icon: '<circle cx="9" cy="8" r="3.2"/><path d="M2.5 19c0-3 3-5 6.5-5s6.5 2 6.5 5"/><circle cx="17" cy="8.5" r="2.4"/><path d="M15.7 13.8c2.7.4 4.8 2.1 4.8 4.7"/>',
    },
    {
      title: 'Abandoned carts',
      body: 'Unfinished orders, with a reminder button.',
      icon: '<path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    },
    {
      title: 'Exportable reports',
      body: 'Filter by date and channel, then export.',
      icon: '<path d="M12 3v13"/><path d="m7 12 5 5 5-5"/><path d="M4 20h16"/>',
    },
  ],
};

export const closing: ClosingContent = {
  title: 'See your own numbers in it',
  sub: "Book a demo and we'll show it working on a sample of your sales data.",
  primary: DEMO,
  secondary: {
    label: 'How dashboard design drives decisions',
    href: '/blog/dashboard-design-that-drives-decisions/',
  },
};
