/*
 * Text for the S47 Vyapar (BI Dashboard) page below the hero. The
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

/**
 * One delivery area in the location section's sample data. `revenue` is net
 * revenue, financial year to date, in ₹ lakh; shares are worked out from it
 * for whatever the state / pincode filters leave in view. `state` must match
 * a name in Map/states.ts so the map can find and zoom to it.
 */
export interface Place {
  pincode: string;
  area: string;
  city: string;
  state: string;
  lon: number;
  lat: number;
  revenue: number;
}

export interface WhereContent {
  title: string;
  body: string;
  foot: string;
  /** Pins for the no-JavaScript view (all states, by city). */
  cities: readonly Pin[];
  places: Place[];
}

export const PLACES: Place[] = [
  { pincode: '110001', area: 'Connaught Place', city: 'Delhi NCR', state: 'Delhi', lon: 77.22, lat: 28.63, revenue: 498 },
  { pincode: '110017', area: 'Saket', city: 'Delhi NCR', state: 'Delhi', lon: 77.21, lat: 28.52, revenue: 277 },
  { pincode: '122002', area: 'Gurugram', city: 'Delhi NCR', state: 'Haryana', lon: 77.08, lat: 28.47, revenue: 332 },
  { pincode: '201301', area: 'Noida', city: 'Delhi NCR', state: 'Uttar Pradesh', lon: 77.32, lat: 28.57, revenue: 221 },
  { pincode: '400001', area: 'Fort', city: 'Mumbai', state: 'Maharashtra', lon: 72.84, lat: 18.94, revenue: 277 },
  { pincode: '400050', area: 'Bandra West', city: 'Mumbai', state: 'Maharashtra', lon: 72.83, lat: 19.06, revenue: 332 },
  { pincode: '400601', area: 'Thane', city: 'Mumbai', state: 'Maharashtra', lon: 72.97, lat: 19.19, revenue: 221 },
  { pincode: '411001', area: 'Pune Camp', city: 'Pune', state: 'Maharashtra', lon: 73.88, lat: 18.52, revenue: 96 },
  { pincode: '800001', area: 'Patna GPO', city: 'Patna', state: 'Bihar', lon: 85.14, lat: 25.61, revenue: 332 },
  { pincode: '800020', area: 'Kankarbagh', city: 'Patna', state: 'Bihar', lon: 85.16, lat: 25.59, revenue: 221 },
  { pincode: '842001', area: 'Muzaffarpur', city: 'Muzaffarpur', state: 'Bihar', lon: 85.39, lat: 26.12, revenue: 166 },
  { pincode: '812001', area: 'Bhagalpur', city: 'Bhagalpur', state: 'Bihar', lon: 87.0, lat: 25.25, revenue: 111 },
  { pincode: '823001', area: 'Gaya', city: 'Gaya', state: 'Bihar', lon: 85.0, lat: 24.79, revenue: 111 },
  { pincode: '700001', area: 'BBD Bagh', city: 'Kolkata', state: 'West Bengal', lon: 88.35, lat: 22.57, revenue: 221 },
  { pincode: '700091', area: 'Salt Lake', city: 'Kolkata', state: 'West Bengal', lon: 88.42, lat: 22.58, revenue: 221 },
  { pincode: '711101', area: 'Howrah', city: 'Kolkata', state: 'West Bengal', lon: 88.31, lat: 22.59, revenue: 111 },
  { pincode: '734001', area: 'Siliguri', city: 'Siliguri', state: 'West Bengal', lon: 88.43, lat: 26.71, revenue: 74 },
  { pincode: '226001', area: 'Hazratganj', city: 'Lucknow', state: 'Uttar Pradesh', lon: 80.95, lat: 26.85, revenue: 221 },
  { pincode: '226010', area: 'Gomti Nagar', city: 'Lucknow', state: 'Uttar Pradesh', lon: 81.0, lat: 26.85, revenue: 166 },
  { pincode: '208001', area: 'Kanpur', city: 'Kanpur', state: 'Uttar Pradesh', lon: 80.33, lat: 26.46, revenue: 221 },
  { pincode: '221001', area: 'Varanasi', city: 'Varanasi', state: 'Uttar Pradesh', lon: 82.97, lat: 25.32, revenue: 166 },
  { pincode: '282001', area: 'Agra', city: 'Agra', state: 'Uttar Pradesh', lon: 78.01, lat: 27.18, revenue: 111 },
  { pincode: '302001', area: 'Jaipur City', city: 'Jaipur', state: 'Rajasthan', lon: 75.82, lat: 26.92, revenue: 194 },
  { pincode: '302017', area: 'Malviya Nagar', city: 'Jaipur', state: 'Rajasthan', lon: 75.81, lat: 26.85, revenue: 138 },
  { pincode: '342001', area: 'Jodhpur', city: 'Jodhpur', state: 'Rajasthan', lon: 73.02, lat: 26.29, revenue: 111 },
  { pincode: '313001', area: 'Udaipur', city: 'Udaipur', state: 'Rajasthan', lon: 73.71, lat: 24.58, revenue: 111 },
  { pincode: '560001', area: 'MG Road', city: 'Bengaluru', state: 'Karnataka', lon: 77.6, lat: 12.97, revenue: 166 },
  { pincode: '560034', area: 'Koramangala', city: 'Bengaluru', state: 'Karnataka', lon: 77.62, lat: 12.93, revenue: 111 },
  { pincode: '452001', area: 'Indore', city: 'Indore', state: 'Madhya Pradesh', lon: 75.86, lat: 22.72, revenue: 166 },
  { pincode: '462001', area: 'Bhopal', city: 'Bhopal', state: 'Madhya Pradesh', lon: 77.41, lat: 23.26, revenue: 111 },
  { pincode: '248001', area: 'Dehradun', city: 'Dehradun', state: 'Uttarakhand', lon: 78.03, lat: 30.32, revenue: 166 },
  { pincode: '834001', area: 'Ranchi', city: 'Ranchi', state: 'Jharkhand', lon: 85.33, lat: 23.36, revenue: 111 },
  { pincode: '831001', area: 'Jamshedpur', city: 'Jamshedpur', state: 'Jharkhand', lon: 86.2, lat: 22.8, revenue: 55 },
  { pincode: '600001', area: 'Parrys', city: 'Chennai', state: 'Tamil Nadu', lon: 80.29, lat: 13.09, revenue: 88 },
  { pincode: '500001', area: 'Abids', city: 'Hyderabad', state: 'Telangana', lon: 78.47, lat: 17.39, revenue: 92 },
  { pincode: '380001', area: 'Lal Darwaja', city: 'Ahmedabad', state: 'Gujarat', lon: 72.58, lat: 23.02, revenue: 84 },
  { pincode: '781001', area: 'Pan Bazaar', city: 'Guwahati', state: 'Assam', lon: 91.74, lat: 26.18, revenue: 61 },
  { pincode: '751001', area: 'Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', lon: 85.82, lat: 20.27, revenue: 58 },
];

export const where: WhereContent = {
  title: 'See where your business happens',
  body: 'Orders, customers, field teams or service calls: anything with a location goes on the map, so you can see which regions are growing and where to invest next.',
  foot: 'Example: share of net revenue, financial year to date. Sample data.',
  cities: CITIES,
  places: PLACES,
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
  secondaryLead: 'Read',
};
