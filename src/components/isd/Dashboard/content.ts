/*
 * Data for the live dashboard in the hero: a working copy of an all-channel
 * sales dashboard, drawn in HTML, for a made-up business. Everything here is
 * made up: the business, its products, people, stores and numbers. Never put
 * a real client's details here.
 * Imported by both the component (first render) and its script (updates).
 */

/** The made-up business the demo belongs to. */
export const BRAND = {
  name: 'Your Business',
  tagline: 'Sales Dashboard',
  user: 'User',
  initials: 'U',
  role: 'Admin',
};

export type ChannelId = 'delhi' | 'mumbai' | 'patna' | 'kolkata' | 'online' | 'events';
export type Selection = ChannelId | 'all';

export interface Channel {
  id: ChannelId;
  label: string;
  /** Chip dot and bar colour. */
  color: string;
  /** Rough share of all sales, before the monthly wobble. */
  share: number;
  /** Share of units sent out that come back. */
  returns: number;
  /** Average price of one unit sold. */
  price: number;
}

export const CHANNELS: Channel[] = [
  { id: 'delhi', label: 'North Store', color: '#3B82F6', share: 0.27, returns: 0.11, price: 205 },
  { id: 'mumbai', label: 'West Store', color: '#10B981', share: 0.17, returns: 0.12, price: 220 },
  { id: 'patna', label: 'East Store', color: '#8B5CF6', share: 0.12, returns: 0.14, price: 185 },
  { id: 'kolkata', label: 'South Store', color: '#0D9488', share: 0.13, returns: 0.13, price: 195 },
  { id: 'online', label: 'Online', color: '#F97316', share: 0.22, returns: 0.07, price: 248 },
  { id: 'events', label: 'Pop-ups', color: '#EC4899', share: 0.09, returns: 0.02, price: 172 },
];

/** Period buttons. `months` is the window length; FYTD runs from 1 April. */
export const PERIODS = [
  { id: 'fytd', label: 'FYTD' },
  { id: '1m', label: '1M', months: 1 },
  { id: '3m', label: '3M', months: 3 },
  { id: '6m', label: '6M', months: 6 },
  { id: '1y', label: '1Y', months: 12 },
  { id: 'all', label: 'ALL', months: 24 },
] as const;
export type PeriodId = (typeof PERIODS)[number]['id'];

/** Analysis tabs under the banner. Each one is a different way of looking at the same sales. */
export const TABS = [
  { id: 'snapshot', label: 'Snapshot' },
  { id: 'momentum', label: 'Momentum' },
  { id: 'launches', label: 'Launches' },
  { id: 'seasonality', label: 'Seasonality' },
  { id: 'leaderboard', label: 'Leaderboard' },
  { id: 'stock', label: 'Stock Health' },
  { id: 'baskets', label: 'Baskets' },
] as const;

/* ---------- Monthly sales ---------- */

/** How busy each calendar month is (Jan = 0): trade events early in the year, festivals in autumn. */
const SEASON = [1.16, 1.1, 0.95, 0.9, 0.92, 0.88, 0.9, 0.97, 1.0, 1.12, 1.15, 1.0];
/** Events sell almost nothing outside event season. */
const EVENT_SEASON = [3.1, 2.6, 0.5, 0.3, 0.3, 0.2, 0.2, 0.4, 0.6, 1.4, 1.5, 0.9];
/** Months of history kept: up to two years shown, two more to compare them with. */
export const HISTORY = 48;

/**
 * Full-month net revenue per channel for the last HISTORY months, oldest
 * first; the last entry is the current month. Deterministic, so the page and
 * its script agree.
 */
export function monthly(now: Date): Record<ChannelId, number[]> {
  const out = {} as Record<ChannelId, number[]>;
  CHANNELS.forEach((c, k) => {
    out[c.id] = Array.from({ length: HISTORY }, (_, i) => {
      const cal = (now.getMonth() - (HISTORY - 1 - i) + 120) % 12;
      const season = c.id === 'events' ? EVENT_SEASON[cal] : SEASON[cal];
      const wobble = 1 + 0.07 * Math.sin(i * 1.7 + k * 2.1);
      return 5.6e6 * Math.pow(1.011, i) * c.share * season * wobble;
    });
  });
  return out;
}

/** How far through the current month we are, 0 to 1. */
export const monthFraction = (now: Date) => {
  const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return now.getDate() / days;
};

/** Months since 1 April, counting the current month as the fraction gone. */
export const fytdMonths = (now: Date) => ((now.getMonth() - 3 + 12) % 12) + monthFraction(now);

/**
 * Revenue over the last `months` months ending `back` months ago (0 = now,
 * 12 = the same window last year). The current month counts only the part gone.
 */
export function windowSum(series: number[], months: number, frac: number, back = 0): number {
  let end = series.length - 1 - back;
  let left = months;
  let sum = 0;
  let take = Math.min(left, frac);
  while (left > 1e-9 && end >= 0) {
    sum += series[end] * take;
    left -= take;
    end -= 1;
    take = Math.min(left, 1);
  }
  return sum;
}

/** Headline numbers for one selection, over a period ending `back` months ago. */
export interface Totals {
  net: number;
  gross: number;
  returns: number;
  units: number;
  unitsGross: number;
  projected: number;
  velocity: number;
  rows: number;
  /** Net revenue per channel, for the breakdown. */
  byChannel: Record<ChannelId, number>;
}

export function totals(
  data: Record<ChannelId, number[]>, now: Date, sel: Selection, period: PeriodId, back = 0,
): Totals {
  const frac = monthFraction(now);
  const p = PERIODS.find((x) => x.id === period)!;
  const months = 'months' in p ? p.months : fytdMonths(now);
  const t: Totals = { net: 0, gross: 0, returns: 0, units: 0, unitsGross: 0, projected: 0, velocity: 0, rows: 0, byChannel: {} as Record<ChannelId, number> };
  for (const c of CHANNELS) {
    const net = windowSum(data[c.id], months, frac, back);
    t.byChannel[c.id] = net;
    if (sel !== 'all' && sel !== c.id) continue;
    const gross = net / (1 - c.returns);
    t.net += net;
    t.gross += gross;
    t.units += net / c.price;
    t.unitsGross += gross / c.price;
  }
  t.returns = t.gross - t.net;
  const days = months * 30.44;
  t.velocity = t.net / days;
  t.projected = t.velocity * 365;
  t.rows = Math.round(t.unitsGross * 0.48);
  return t;
}

/** Twelve months of revenue for the trend chart, ending this month (or a year ago), oldest first. */
export function trend(data: Record<ChannelId, number[]>, sel: Selection, back: number): number[] {
  const end = HISTORY - back;
  return Array.from({ length: 12 }, (_, i) => {
    const idx = end - 12 + i;
    return CHANNELS.reduce((s, c) => s + (sel === 'all' || sel === c.id ? data[c.id][idx] : 0), 0);
  });
}

/** Seasonality: twelve months of revenue per channel, ending `back` months ago. */
export const heat = (data: Record<ChannelId, number[]>, back: number) =>
  Object.fromEntries(CHANNELS.map((c) => [c.id, data[c.id].slice(HISTORY - back - 12, HISTORY - back)])) as Record<ChannelId, number[]>;

/** Snapshot donut: each channel's arc as [length, start] around a circle of radius DONUT_R. */
export const DONUT_R = 54;
export function donut(byChannel: Record<ChannelId, number>): Record<ChannelId, [number, number]> {
  const c = 2 * Math.PI * DONUT_R;
  const total = CHANNELS.reduce((s, x) => s + byChannel[x.id], 0);
  let at = 0;
  const out = {} as Record<ChannelId, [number, number]>;
  for (const x of CHANNELS) {
    const len = (byChannel[x.id] / total) * c;
    out[x.id] = [Math.max(len - 2, 0), at];
    at += len;
  }
  return out;
}

/** Short month names for the twelve months ending `back` months ago. */
export const trendLabels = (now: Date, back: number) =>
  Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - back - 11 + i, 1);
    return d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
  });

/* ---------- Products, the team and the other tabs ---------- */

export type Category = 'Apparel' | 'Home & Kitchen' | 'Personal Care' | 'Electronics' | 'Food & Beverage' | 'Fitness';

/** One product. `share` is its part of net revenue; `growth` is against last year. */
export interface Product {
  name: string;
  sku: string;
  isNew: boolean;
  category: Category;
  share: number;
  growth: number;
  price: number;
  /** Units left in the warehouse, and units sold in a typical week. */
  stock: number;
  weekly: number;
  /** New products: weeks since launch. */
  weeksLive?: number;
}

export const PRODUCTS: Product[] = [
  { name: 'Steel Water Bottle 1L', sku: 'HK-1042', isNew: true, weeksLive: 22, category: 'Home & Kitchen', share: 0.031, growth: 0.64, price: 299, stock: 640, weekly: 210 },
  { name: 'Classic Cotton Tee', sku: 'AP-2210', isNew: false, category: 'Apparel', share: 0.027, growth: 0.41, price: 250, stock: 2200, weekly: 160 },
  { name: 'Herbal Face Wash', sku: 'PC-0318', isNew: true, weeksLive: 15, category: 'Personal Care', share: 0.022, growth: 0.38, price: 199, stock: 380, weekly: 150 },
  { name: 'LED Desk Lamp', sku: 'EL-0907', isNew: false, category: 'Electronics', share: 0.019, growth: -0.07, price: 350, stock: 1800, weekly: 70 },
  { name: 'Organic Green Tea 100g', sku: 'FB-0551', isNew: true, weeksLive: 11, category: 'Food & Beverage', share: 0.017, growth: 0.55, price: 225, stock: 260, weekly: 120 },
  { name: 'Canvas Tote Bag', sku: 'AP-2384', isNew: false, category: 'Apparel', share: 0.015, growth: -0.12, price: 175, stock: 3100, weekly: 60 },
  { name: 'Ceramic Mug Set', sku: 'HK-1120', isNew: false, category: 'Home & Kitchen', share: 0.014, growth: 0.22, price: 450, stock: 520, weekly: 55 },
  { name: 'Bamboo Desk Organiser', sku: 'HK-1188', isNew: false, category: 'Home & Kitchen', share: 0.013, growth: -0.18, price: 275, stock: 1400, weekly: 45 },
  { name: 'Yoga Mat Pro', sku: 'FT-0402', isNew: true, weeksLive: 8, category: 'Fitness', share: 0.011, growth: 0.71, price: 325, stock: 190, weekly: 95 },
  { name: 'Wireless Earbuds Lite', sku: 'EL-1015', isNew: true, weeksLive: 5, category: 'Electronics', share: 0.009, growth: -0.04, price: 499, stock: 900, weekly: 30 },
];

/** Twelve weeks of units for a product's sparkline, oldest first, bending with its growth. */
export const spark = (p: Product, k: number) =>
  Array.from({ length: 12 }, (_, i) => p.weekly * (1 - p.growth / 2 + (p.growth * i) / 11) * (1 + 0.04 * Math.sin(i * 1.3 + k)));

/** An SVG polyline through values, in a w × h box. */
export function sparkPath(values: number[], w = 96, h = 28): string {
  const lo = Math.min(...values), hi = Math.max(...values);
  return values.map((v, i) => `${((i / (values.length - 1)) * w).toFixed(1)},${(h - 2 - ((v - lo) / (hi - lo || 1)) * (h - 4)).toFixed(1)}`).join(' ');
}

/** Sales team: share of net revenue each one closed, and how far they are against target. */
export const TEAM = [
  { name: 'Meera Joshi', region: 'North', accounts: 42, share: 0.092, target: 1.12 },
  { name: 'Arun Verma', region: 'West', accounts: 37, share: 0.081, target: 1.04 },
  { name: 'Sana Qureshi', region: 'East', accounts: 29, share: 0.064, target: 0.97 },
  { name: 'Vikram Rao', region: 'South', accounts: 33, share: 0.055, target: 0.86 },
  { name: 'Nidhi Sharma', region: 'Online', accounts: 18, share: 0.041, target: 0.74 },
];

/** Stock Health: products grouped by how many weeks their stock will last. */
export const STOCK_BUCKETS = [
  { label: 'Critical', note: 'under 3 weeks', count: 6, tone: 'red' },
  { label: 'Watch', note: '3 to 6 weeks', count: 14, tone: 'amber' },
  { label: 'Healthy', note: '6 to 16 weeks', count: 182, tone: 'green' },
  { label: 'Overstock', note: 'over 16 weeks', count: 23, tone: 'blue' },
] as const;

export const CATEGORIES: { label: Category; share: number }[] = [
  { label: 'Apparel', share: 0.24 },
  { label: 'Home & Kitchen', share: 0.21 },
  { label: 'Personal Care', share: 0.17 },
  { label: 'Electronics', share: 0.15 },
  { label: 'Food & Beverage', share: 0.13 },
  { label: 'Fitness', share: 0.1 },
];

/** Baskets: what a typical order looks like, and what sells together. */
export const BASKET = { aov: 1840, items: 2.4, repeat: 0.34 };
export const PAIRS = [
  { a: 'Yoga Mat Pro', b: 'Steel Water Bottle 1L', rate: 0.31 },
  { a: 'Herbal Face Wash', b: 'Organic Green Tea 100g', rate: 0.22 },
  { a: 'Classic Cotton Tee', b: 'Canvas Tote Bag', rate: 0.19 },
  { a: 'LED Desk Lamp', b: 'Bamboo Desk Organiser', rate: 0.17 },
];

/** Geo Insights: where orders come from, as shares of net revenue. */
export const CITIES = [
  { label: 'Delhi NCR', share: 0.24, lon: 77.21, lat: 28.61 },
  { label: 'Mumbai', share: 0.15, lon: 72.88, lat: 19.08 },
  { label: 'Patna', share: 0.1, lon: 85.14, lat: 25.59 },
  { label: 'Kolkata', share: 0.1, lon: 88.36, lat: 22.57 },
  { label: 'Lucknow', share: 0.07, lon: 80.95, lat: 26.85 },
  { label: 'Jaipur', share: 0.06, lon: 75.79, lat: 26.91, side: 'l' },
  { label: 'Bengaluru', share: 0.05, lon: 77.59, lat: 12.97 },
] as const;
export const STATES = [
  { label: 'Uttar Pradesh', share: 0.09 },
  { label: 'Bihar', share: 0.07 },
  { label: 'Madhya Pradesh', share: 0.05 },
  { label: 'Rajasthan', share: 0.04 },
  { label: 'Uttarakhand', share: 0.03 },
  { label: 'Jharkhand', share: 0.03 },
];
/** Average price of a unit across the catalogue, to turn revenue into units. */
export const AVG_PRICE = 212;

/** Abandoned carts on the website this week. */
export const CARTS = [
  { who: 'R. Gupta', city: 'Lucknow', items: 3, value: 874, ago: '12 min ago' },
  { who: 'A. Sinha', city: 'Patna', items: 1, value: 299, ago: '40 min ago' },
  { who: 'P. Nair', city: 'Kochi', items: 5, value: 1420, ago: '2 h ago' },
  { who: 'S. Das', city: 'Kolkata', items: 2, value: 524, ago: '3 h ago' },
  { who: 'K. Mehta', city: 'Ahmedabad', items: 4, value: 1096, ago: '5 h ago' },
  { who: 'T. Ansari', city: 'Bhopal', items: 2, value: 450, ago: 'Yesterday' },
  { who: 'M. Iyer', city: 'Chennai', items: 3, value: 947, ago: 'Yesterday' },
  { who: 'J. Kaur', city: 'Amritsar', items: 1, value: 350, ago: '2 days ago' },
];
export const CART_STATS = { week: 46, value: 38420, recovered: 0.18 };

/** Social Media: this month on each platform. */
export const SOCIAL = [
  { id: 'facebook', label: 'Facebook', color: '#2563EB', followers: 128400, reach: 412000, clicks: 9100, orders: 214 },
  { id: 'instagram', label: 'Instagram', color: '#DB2777', followers: 96200, reach: 538000, clicks: 12600, orders: 297 },
  { id: 'youtube', label: 'YouTube', color: '#DC2626', followers: 41800, reach: 186000, clicks: 3800, orders: 88 },
] as const;

export const POSTS = [
  { platform: 'instagram', post: 'Reel: unboxing the Yoga Mat Pro', reach: 142000, orders: 96 },
  { platform: 'facebook', post: 'Expo stall, day one', reach: 88400, orders: 61 },
  { platform: 'youtube', post: 'Founder in conversation', reach: 54200, orders: 38 },
  { platform: 'instagram', post: 'Festive gift guide carousel', reach: 76900, orders: 33 },
  { platform: 'facebook', post: 'Monsoon essentials list', reach: 49100, orders: 27 },
] as const;

/* ---------- Formatting ---------- */

/** ₹7,59,90,003 */
export const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');
/** 3,60,895 */
export const num = (n: number) => Math.round(n).toLocaleString('en-IN');
/** ₹4.82 Cr / ₹56.2 L / ₹8,400 */
export const short = (n: number) =>
  n >= 1e7 ? `₹${(n / 1e7).toFixed(2)} Cr` : n >= 1e5 ? `₹${(n / 1e5).toFixed(1)} L` : inr(n);
/** +12.4% */
export const pct = (n: number, signed = false) => `${signed && n > 0 ? '+' : ''}${(n * 100).toFixed(1)}%`;

/** Formats a share of net revenue, as the tabs show it. */
export const FORMATS = {
  short: (net: number, share: number) => short(net * share),
  units: (net: number, share: number, price = AVG_PRICE) => num((net * share) / price),
} as const;

/* ---------- Trend chart geometry ---------- */

/** In the SVG's own units; the chart stretches to fit its box. */
export const CHART = { w: 640, h: 200, pad: 6 };

/** Top of the scale: a little above the best month, in four even steps of ₹1, 2, 2.5 or 5 (× 10ⁿ). */
export const chartMax = (...series: number[][]) => {
  const raw = (Math.max(...series.flat()) * 1.1) / 4;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].find((m) => m * pow >= raw)! * pow;
  return step * 4;
};

/** Axis labels, top to bottom: ₹2 Cr, ₹1.5 Cr, ₹75 L… */
export const chartTicks = (max: number) => [1, 0.75, 0.5, 0.25, 0].map((f) => {
  const n = max * f;
  return !n ? '₹0' : n >= 1e7 ? `₹${+(n / 1e7).toFixed(2)} Cr` : `₹${+(n / 1e5).toFixed(1)} L`;
});

export function chartPoints(values: number[], max: number): [number, number][] {
  const { w, h, pad } = CHART;
  const step = (w - pad * 2) / (values.length - 1);
  return values.map((v, i) => [pad + i * step, h - (v / max) * h]);
}

/** A smooth line through the points (Catmull-Rom turned into cubic Béziers). */
export function chartLine(values: number[], max: number): string {
  const p = chartPoints(values, max);
  let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

export function chartArea(values: number[], max: number): string {
  const { w, h, pad } = CHART;
  return `${chartLine(values, max)} L${(w - pad).toFixed(1)} ${h} L${pad} ${h} Z`;
}
