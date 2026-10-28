/*
 * Text for the Business Intelligence Dashboards page below the hero. The
 * feature rows and closing are the Pharma ERP page's sections
 * (components/pharma/Rows, Closing), so both product pages read as one family;
 * the steps, map and toolkit sections are this page's own (components/isd/).
 * The mocks use the same made-up business as the live dashboard, which is
 * shown as one example of what the product does, not the whole of it.
 */
import { DEMO } from '../pharma/types';
import { CITIES } from './Dashboard/content';
import type { Pin } from './Map/IndiaMap.astro';
import type { Row } from '../pharma/Rows/content';
import type { ClosingContent } from '../pharma/Closing/content';

export const rows: Row[] = [
  {
    title: 'One version of the truth',
    body: 'Sales, finance, inventory and marketing read from the same synced data, so every team sees the same figure and meetings start with decisions, not with reconciling spreadsheets.',
    mock: {
      title: 'Monthly review',
      tag: 'Live',
      tagTone: 'green',
      head: ['Measure', 'Value', 'Team'],
      rows: [
        { cells: ['Net revenue', '₹5.53 Cr', 'Sales'] },
        { cells: ['Gross margin', '38.4%', 'Finance'] },
        { cells: ['Stock cover', '7.2 wks', 'Operations'] },
        { cells: ['Cost per order', '₹142', 'Marketing'], tone: 'green' },
      ],
    },
  },
  {
    title: 'Problems flagged before they grow',
    body: 'Set the limits that matter to you. When returns climb, a margin slips or a campaign overspends, the dashboard flags it and tells the person who can fix it.',
    mock: {
      title: 'Alerts',
      tag: '3 new',
      tagTone: 'red',
      rows: [
        { cells: ['Returns up at East Store', '14%'], tone: 'red', note: 'New' },
        { cells: ['Gross margin below target', '36.1%'], tone: 'amber' },
        { cells: ['Ad spend over budget', '+12%'], tone: 'amber' },
        { cells: ['Stock cover', 'Healthy'], tone: 'green' },
      ],
    },
  },
  {
    title: 'From what happened to what comes next',
    body: 'Trends, seasonality and run rates turn last year into a forecast, so planning for stock, cash and staffing starts from evidence instead of a hunch.',
    mock: {
      title: 'Forecast · next quarter',
      tag: 'Projected',
      tagTone: 'pine',
      head: ['Month', 'Revenue', 'vs last yr'],
      rows: [
        { cells: ['November', '₹62.4 L', '+11%'] },
        { cells: ['December', '₹58.1 L', '+9%'] },
        { cells: ['January', '₹66.8 L', '+13%'], tone: 'green', note: 'Peak' },
      ],
      foot: 'Based on two years of history and this year’s run rate',
    },
  },
  {
    title: 'Everyone sees what they should',
    body: 'Admins see every location and every team. A store’s sales team sees only its own store, so numbers can be shared widely without sharing everything. Try both in the dashboard above.',
    mock: {
      title: 'Who sees what',
      tag: 'Access',
      tagTone: 'pine',
      head: ['Role', 'Can see'],
      rows: [
        { cells: ['Admin', 'All locations'], tone: 'green' },
        { cells: ['North Store team', 'North Store only'], note: 'Own location' },
        { cells: ['Finance', 'Margins and costs'] },
        { cells: ['Marketing', 'Campaigns and reach'] },
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
  title: 'Three steps to dashboards your team trusts',
  lede: 'We do the setup with you, so it is live in days, not months.',
  steps: [
    {
      label: 'Connect',
      title: 'Bring your data together',
      body: 'Billing and ERP, CRM, accounting, ad platforms, your web store and the spreadsheets teams already keep. We connect them once and they stay in sync.',
    },
    {
      label: 'Build',
      title: 'Shaped around your questions',
      body: 'We start from the questions each team asks every week, then design the views that answer them: sales, finance, operations, marketing and people.',
    },
    {
      label: 'Share',
      title: 'The right numbers to the right people',
      body: 'Leaders see the whole business, each team sees its own. Reports land in the inbox on schedule, and anything exports in a click.',
    },
  ],
  sources: [
    { label: 'ERP and billing', color: '#3B82F6' },
    { label: 'CRM', color: '#F97316' },
    { label: 'Accounting', color: '#10B981' },
    { label: 'Spreadsheets', color: '#8B5CF6' },
  ],
};

export interface WhereContent { title: string; body: string; foot: string; cities: readonly Pin[] }

export const where: WhereContent = {
  title: 'See where your business happens',
  body: 'Orders, customers, field teams or service calls: anything with a location goes on the map, so you can see which regions are growing and where to invest next.',
  foot: 'Example: share of net revenue by city, financial year to date. Sample data.',
  cities: CITIES,
};

export interface Tool {
  title: string;
  body: string;
  /** Inner markup of a 24×24 stroke icon. */
  icon: string;
}
export interface ToolkitContent { title: string; lede: string; tools: Tool[] }

export const toolkit: ToolkitContent = {
  title: 'Everything in one place',
  lede: 'One source of truth for every team, so the numbers always agree.',
  tools: [
    {
      title: 'Sales performance',
      body: 'Revenue, orders and channels, against target and last year.',
      icon: '<path d="M3 3v18h18"/><path d="M7 15V9M12 15V6M17 15v-4"/>',
    },
    {
      title: 'Finance and margins',
      body: 'Margin, cash flow and costs by product, channel or branch.',
      icon: '<path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a5 5 0 0 0 0-10"/>',
    },
    {
      title: 'Inventory and operations',
      body: 'Stock cover, restocks and fulfilment, before they become problems.',
      icon: '<path d="M12 2 21 7v10l-9 5-9-5V7Z"/><path d="M12 12 21 7M12 12v10M12 12 3 7"/>',
    },
    {
      title: 'Marketing return',
      body: 'Spend, reach and the orders each campaign actually brought in.',
      icon: '<path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1Z"/><path d="M15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12"/>',
    },
    {
      title: 'Customers',
      body: 'Repeat buyers, basket size and what sells together.',
      icon: '<circle cx="9" cy="8" r="3.2"/><path d="M2.5 19c0-3 3-5 6.5-5s6.5 2 6.5 5"/><circle cx="17" cy="8.5" r="2.4"/><path d="M15.7 13.8c2.7.4 4.8 2.1 4.8 4.7"/>',
    },
    {
      title: 'Teams and targets',
      body: 'Leaderboards and progress against goals, for every team.',
      icon: '<path d="M8 21V11H3v10zM15 21V5h-5v16zM22 21v-7h-5v7z"/>',
    },
    {
      title: 'Forecasts',
      body: 'Seasonality and run rates turned into a plan for the months ahead.',
      icon: '<path d="M3 17l6-6 4 4 8-8"/><path d="M17 7h4v4"/>',
    },
    {
      title: 'Alerts and reports',
      body: 'A flag when a number crosses a line, and scheduled reports by email.',
      icon: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
    },
  ],
};

export const closing: ClosingContent = {
  title: 'See your own numbers in it',
  sub: "Book a demo and we'll show it working on a sample of your data.",
  primary: DEMO,
  secondary: {
    label: 'How dashboard design drives decisions',
    href: '/blog/dashboard-design-that-drives-decisions/',
  },
};
