/**
 * Sample data for the Social Flow demo on /products/social-flow/. Everything
 * is invented: the brand, its accounts, posts, videos, campaigns and numbers.
 * Each period's figures agree across screens (the overview adds up the
 * platform screens, and the ads screen adds up its campaigns).
 */

export type PeriodId = '7d' | '30d' | '90d';
export const PERIODS: { id: PeriodId; label: string; short: string }[] = [
  { id: '7d', label: 'Last 7 days', short: '7D' },
  { id: '30d', label: 'Last 30 days', short: '30D' },
  { id: '90d', label: 'Last 90 days', short: '90D' },
];

export const BRAND = { name: 'Sample Brand', handle: '@samplebrand', user: 'Riya', initials: 'RS', role: 'Marketing lead' };

export type PlatformId = 'instagram' | 'facebook' | 'youtube';
export const PLATFORMS: { id: PlatformId; label: string; color: string; soft: string }[] = [
  { id: 'instagram', label: 'Instagram', color: '#D62976', soft: '#FCE7F1' },
  { id: 'facebook', label: 'Facebook', color: '#1877F2', soft: '#E7F0FE' },
  { id: 'youtube', label: 'YouTube', color: '#E62117', soft: '#FDE8E7' },
];
export const META_COLOR = '#5B4CF0';

/** Chart tick labels along the x axis, per period. */
export const TICKS: Record<PeriodId, string[]> = {
  '7d': ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon'],
  '30d': ['4 Oct', '11 Oct', '18 Oct', '25 Oct', '2 Nov'],
  '90d': ['5 Aug', '2 Sep', '30 Sep', '28 Oct'],
};
/** Points per chart: daily for 7 and 30 days, weekly for 90. */
export const POINTS: Record<PeriodId, number> = { '7d': 7, '30d': 30, '90d': 13 };

/** A smooth, repeatable series of `n` values that adds up to `total`. */
export function series(n: number, total: number, seed: number, trend = 0.25): number[] {
  const raw = Array.from({ length: n }, (_, i) => {
    const t = n === 1 ? 0 : i / (n - 1);
    return 1 + trend * (t - 0.5) + 0.16 * Math.sin(i * 1.3 + seed) + 0.07 * Math.sin(i * 2.9 + seed * 2.1);
  });
  const sum = raw.reduce((a, b) => a + b, 0);
  return raw.map((v) => (v / sum) * total);
}

/* ---------- Platform figures per period ---------- */
export interface PlatformStats {
  followers: number; gained: number; reach: number; engagement: number; posts: number;
  /** Extra metric each platform shows in its fourth tile. */
  extra: { label: string; value: string; note: string };
}
export const STATS: Record<PlatformId, Record<PeriodId, PlatformStats>> = {
  instagram: {
    '7d': { followers: 48240, gained: 320, reach: 86400, engagement: 4.8, posts: 6, extra: { label: 'Profile visits', value: '3,920', note: '+11% on last week' } },
    '30d': { followers: 48240, gained: 1460, reach: 342000, engagement: 4.6, posts: 24, extra: { label: 'Profile visits', value: '15,800', note: '+8% on last month' } },
    '90d': { followers: 48240, gained: 4180, reach: 1020000, engagement: 4.4, posts: 71, extra: { label: 'Profile visits', value: '44,600', note: '+19% on last quarter' } },
  },
  facebook: {
    '7d': { followers: 21630, gained: 90, reach: 41200, engagement: 2.1, posts: 4, extra: { label: 'Link clicks', value: '1,240', note: '+6% on last week' } },
    '30d': { followers: 21630, gained: 410, reach: 168000, engagement: 2.3, posts: 16, extra: { label: 'Link clicks', value: '5,060', note: '+4% on last month' } },
    '90d': { followers: 21630, gained: 1120, reach: 486000, engagement: 2.2, posts: 47, extra: { label: 'Link clicks', value: '14,900', note: '+9% on last quarter' } },
  },
  youtube: {
    '7d': { followers: 9812, gained: 64, reach: 18400, engagement: 5.6, posts: 1, extra: { label: 'Watch time', value: '1,140 h', note: 'Avg view 3:42' } },
    '30d': { followers: 9812, gained: 288, reach: 76200, engagement: 5.4, posts: 4, extra: { label: 'Watch time', value: '4,720 h', note: 'Avg view 3:39' } },
    '90d': { followers: 9812, gained: 910, reach: 231000, engagement: 5.1, posts: 12, extra: { label: 'Watch time', value: '14,300 h', note: 'Avg view 3:44' } },
  },
};

/* ---------- Meta ads ---------- */
export type CampaignStatus = 'Active' | 'Paused' | 'Ended';
export interface Campaign { name: string; objective: string; status: CampaignStatus; budget: number; share: number; ctr: number; cpl: number }
/** `share` is each campaign's part of total spend; spend, clicks and leads below follow from it. */
export const CAMPAIGNS: Campaign[] = [
  { name: 'Festive offer: lead form', objective: 'Leads', status: 'Active', budget: 1.18, share: 0.34, ctr: 1.9, cpl: 152 },
  { name: 'New range: reels', objective: 'Reach', status: 'Active', budget: 0.96, share: 0.24, ctr: 1.2, cpl: 214 },
  { name: 'Store visits: Siliguri', objective: 'Traffic', status: 'Active', budget: 1.0, share: 0.18, ctr: 1.6, cpl: 168 },
  { name: 'Retargeting: cart viewers', objective: 'Sales', status: 'Paused', budget: 0.9, share: 0.14, ctr: 2.4, cpl: 131 },
  { name: 'Brand awareness: video', objective: 'Video views', status: 'Ended', budget: 1.0, share: 0.10, ctr: 0.8, cpl: 289 },
];
/** Leads are not stored here: each campaign's come from its spend and cost per lead, and the totals add those up. */
export const ADS: Record<PeriodId, { spend: number; impressions: number; clicks: number }> = {
  '7d': { spend: 38400, impressions: 412000, clicks: 6180 },
  '30d': { spend: 162000, impressions: 1710000, clicks: 25900 },
  '90d': { spend: 471000, impressions: 5020000, clicks: 74800 },
};

/* ---------- Content ---------- */
export type ContentType = 'Reel' | 'Post' | 'Story' | 'Video' | 'Short';
export interface Piece { platform: PlatformId; type: ContentType; title: string; reach: number; engagement: number; date: string; hue: number }
export const TOP_CONTENT: Piece[] = [
  { platform: 'instagram', type: 'Reel', title: 'Behind the scenes: packing day', reach: 64200, engagement: 7.9, date: '31 Oct', hue: 330 },
  { platform: 'youtube', type: 'Video', title: 'How we make it, start to finish', reach: 21800, engagement: 6.2, date: '27 Oct', hue: 2 },
  { platform: 'instagram', type: 'Post', title: 'Festive range, first look', reach: 38900, engagement: 5.4, date: '29 Oct', hue: 20 },
  { platform: 'facebook', type: 'Post', title: 'Store timings for the festival week', reach: 26100, engagement: 3.1, date: '30 Oct', hue: 215 },
  { platform: 'instagram', type: 'Story', title: 'Poll: which colour next?', reach: 17400, engagement: 9.6, date: '1 Nov', hue: 280 },
  { platform: 'youtube', type: 'Short', title: '30 seconds in the workshop', reach: 15600, engagement: 8.1, date: '2 Nov', hue: 12 },
];
/** Reach by Instagram content type, as a share of Instagram reach. */
export const IG_TYPES = [
  { type: 'Reels', share: 0.58, color: '#D62976' },
  { type: 'Posts', share: 0.27, color: '#F58529' },
  { type: 'Stories', share: 0.15, color: '#8134AF' },
];
/** Audience activity by day and time (0 to 1), for the best-time heatmap. */
export const HEAT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const HEAT_HOURS = ['9 am', '12 pm', '3 pm', '6 pm', '9 pm'];
export const HEAT: number[][] = [
  [0.32, 0.48, 0.41, 0.66, 0.78],
  [0.30, 0.52, 0.44, 0.70, 0.81],
  [0.34, 0.50, 0.46, 0.72, 0.86],
  [0.31, 0.47, 0.43, 0.69, 0.83],
  [0.28, 0.44, 0.40, 0.74, 0.92],
  [0.42, 0.61, 0.58, 0.80, 0.95],
  [0.46, 0.66, 0.62, 0.77, 0.88],
];
export const FB_AGES = [
  { label: '18-24', share: 0.14 }, { label: '25-34', share: 0.36 }, { label: '35-44', share: 0.27 },
  { label: '45-54', share: 0.15 }, { label: '55+', share: 0.08 },
];

/* ---------- YouTube videos ---------- */
export interface Video { title: string; views: number; watch: string; avg: string; ctr: number; hue: number; retention: number[] }
export const VIDEOS: Video[] = [
  { title: 'How we make it, start to finish', views: 21800, watch: '1,620 h', avg: '4:28', ctr: 6.8, hue: 2, retention: [100, 82, 71, 64, 58, 54, 51, 48, 45, 41, 36] },
  { title: 'Five ways to style the new range', views: 14200, watch: '940 h', avg: '3:58', ctr: 5.9, hue: 28, retention: [100, 76, 63, 55, 50, 46, 42, 40, 37, 33, 27] },
  { title: 'A day at the workshop', views: 9600, watch: '610 h', avg: '3:49', ctr: 4.7, hue: 200, retention: [100, 71, 58, 51, 47, 44, 41, 37, 34, 30, 22] },
  { title: 'Customer stories: the first year', views: 6300, watch: '380 h', avg: '3:36', ctr: 4.1, hue: 140, retention: [100, 68, 55, 49, 44, 40, 37, 35, 31, 27, 20] },
];

/* ---------- Reports ---------- */
export const REPORTS = [
  { name: 'Weekly social summary', to: 'Marketing team', when: 'Every Monday, 9:00 am', channels: 'All channels', last: 'Sent 2 Nov' },
  { name: 'Monthly ads report', to: 'Founders', when: '1st of every month', channels: 'Meta Ads', last: 'Sent 1 Nov' },
  { name: 'YouTube channel review', to: 'Content team', when: 'Every other Friday', channels: 'YouTube', last: 'Sent 30 Oct' },
];

export const INSIGHTS = [
  { tone: 'green', text: 'Reels reach 2.1× more people than photo posts on Instagram.' },
  { tone: 'amber', text: 'Festive offer is spending 12% faster than its daily budget.' },
  { tone: 'blue', text: 'Your audience is most active on Saturdays after 9 pm.' },
];

/* ---------- Formatting ---------- */
export const compact = (n: number) =>
  n >= 1e6 ? `${(n / 1e6).toFixed(2).replace(/\.?0+$/, '')}M` : n >= 1e4 ? `${(n / 1e3).toFixed(1).replace(/\.0$/, '')}K` : n.toLocaleString('en-IN');
export const inr = (n: number) =>
  n >= 1e5 ? `₹${(n / 1e5).toFixed(2).replace(/\.?0+$/, '')} L` : `₹${Math.round(n).toLocaleString('en-IN')}`;
export const num = (n: number) => Math.round(n).toLocaleString('en-IN');
