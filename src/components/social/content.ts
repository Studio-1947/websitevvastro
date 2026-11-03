/**
 * Copy for /products/social-flow/, laid out like the S47 Vyapar (BI
 * Dashboard) page: hero with the live dashboard, feature rows, three steps,
 * the toolkit and a closing call to action. Every English string here has a
 * Hindi, Bengali and Nepali entry in src/i18n/text/products.ts; change both
 * together. Mock text is product UI and is not translated. Mock figures come
 * from the live demo's sample data (Dashboard/data.ts), so they agree.
 */
import { DEMO } from '../pharma/types';
import type { Row } from '../pharma/Rows/content';
import type { ClosingContent } from '../pharma/Closing/content';
import type { HeroContent } from '../isd/Hero/content';
import type { StepsContent, ToolkitContent } from '../isd/content';

export const hero: HeroContent = {
  name: 'Social Flow',
  kind: '(Social media dashboard)',
  title: 'See what your social media is really doing',
  sub: 'Meta ads, Instagram, Facebook and YouTube in one dashboard, so you know what works and where to spend.',
  primary: DEMO,
  example: "Example: a brand's social media and ads dashboard, with sample data. Try it.",
};

export const rows: Row[] = [
  {
    title: 'Every channel, side by side',
    body: 'Followers, reach and engagement from Instagram, Facebook and YouTube sit together and are counted the same way, so you can compare them fairly.',
    mock: {
      title: 'Last 30 days',
      tag: '3 channels',
      tagTone: 'pine',
      head: ['Channel', 'Followers', 'Reach'],
      rows: [
        { cells: ['Instagram', '48,240', '342K'], tone: 'green', note: '+1,460' },
        { cells: ['Facebook', '21,630', '168K'] },
        { cells: ['YouTube', '9,812', '76.2K'] },
        { cells: ['All channels', '79,682', '586K'], tone: 'green' },
      ],
    },
  },
  {
    title: 'Ad spend you can account for',
    body: 'Every Meta campaign shows what it cost and what it brought in: clicks and leads against spend, updated each day, with the campaign that is overspending flagged.',
    mock: {
      title: 'Meta Ads',
      tag: '₹1.62 L spent',
      tagTone: 'pine',
      head: ['Campaign', 'Leads', 'Per lead'],
      rows: [
        { cells: ['Festive offer: lead form', '362', '₹152'], tone: 'amber', note: 'Over pace' },
        { cells: ['Store visits: Siliguri', '174', '₹168'] },
        { cells: ['Retargeting: cart viewers', '173', '₹131'], tone: 'green' },
        { cells: ['New range: reels', '182', '₹214'] },
      ],
    },
  },
  {
    title: 'Know what to post next',
    body: 'See which posts, reels and videos held attention, and the days and hours your audience is most active, before you plan next week.',
    mock: {
      title: 'Top content',
      tag: 'This month',
      tagTone: 'green',
      head: ['Post', 'Reach', 'Engaged'],
      rows: [
        { cells: ['Reel: packing day', '64.2K', '7.9%'], tone: 'green', note: 'Best' },
        { cells: ['Post: festive range', '38.9K', '5.4%'] },
        { cells: ['Video: start to finish', '21.8K', '6.2%'] },
        { cells: ['Best time to post', 'Sat, 9 pm', ''], tone: 'amber' },
      ],
    },
  },
  {
    title: 'Reports that send themselves',
    body: 'A weekly summary lands in the inbox of whoever needs it, and the same numbers are ready to share with your team or your clients in a click.',
    mock: {
      title: 'Scheduled reports',
      tag: '3 active',
      tagTone: 'green',
      rows: [
        { cells: ['Weekly social summary', 'Mon, 9:00 am'], tone: 'green', note: 'Sent' },
        { cells: ['Monthly ads report', '1st of month'] },
        { cells: ['YouTube channel review', 'Every other Fri'] },
      ],
      foot: 'Same numbers as the dashboard',
    },
  },
];

export const steps: StepsContent = {
  title: 'Three steps to one view of your social media',
  lede: 'We connect your accounts with you, so the dashboard is live within a day.',
  steps: [
    {
      label: 'Connect',
      title: 'Link your accounts',
      body: 'Sign in to Meta Business, Instagram, your Facebook page and your YouTube channel once. Social Flow keeps them in sync from then on.',
    },
    {
      label: 'Measure',
      title: 'See every channel together',
      body: 'Reach, engagement, followers and ad results sit side by side, for the last week, month or quarter, counted the same way.',
    },
    {
      label: 'Share',
      title: 'Send the numbers on',
      body: 'Weekly summaries reach your team on schedule, and agencies can give each client a view of only their own accounts.',
    },
  ],
  sources: [
    { label: 'Meta Business', color: '#5B4CF0' },
    { label: 'Instagram', color: '#D62976' },
    { label: 'Facebook page', color: '#1877F2' },
    { label: 'YouTube channel', color: '#E62117' },
  ],
};

export const toolkit: ToolkitContent = {
  title: 'Everything in one place',
  lede: 'Every channel and every campaign, so the numbers always agree.',
  tools: [
    {
      title: 'Instagram insights',
      body: 'Followers, reach and saves for reels, posts and stories.',
      icon: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/>',
    },
    {
      title: 'Facebook page',
      body: 'Reach, reactions, shares and link clicks for every post.',
      icon: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8Z"/>',
    },
    {
      title: 'YouTube analytics',
      body: 'Views, watch time and how long people keep watching.',
      icon: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9 5 3-5 3Z"/>',
    },
    {
      title: 'Meta Ads',
      body: 'Spend, clicks, leads and cost per lead by campaign.',
      icon: '<path d="M3 11v2a2 2 0 0 0 2 2h2l5 4V5L7 9H5a2 2 0 0 0-2 2Z"/><path d="M16 8a5 5 0 0 1 0 8M19 5a9 9 0 0 1 0 14"/>',
    },
    {
      title: 'Content performance',
      body: 'Your best posts and videos, ranked by reach or engagement.',
      icon: '<path d="M3 17l6-6 4 4 8-8"/><path d="M17 7h4v4"/>',
    },
    {
      title: 'Audience',
      body: 'Who follows you, by age, and where they are growing.',
      icon: '<circle cx="9" cy="8" r="3.2"/><path d="M2.5 19c0-3 3-5 6.5-5s6.5 2 6.5 5"/><circle cx="17" cy="8.5" r="2.4"/><path d="M15.7 13.8c2.7.4 4.8 2.1 4.8 4.7"/>',
    },
    {
      title: 'Best time to post',
      body: 'The days and hours your followers are most active.',
      icon: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    },
    {
      title: 'Scheduled reports',
      body: 'Weekly and monthly summaries, sent on their own.',
      icon: '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4Z"/>',
    },
  ],
};

export const closing: ClosingContent = {
  title: 'See your own channels in it',
  sub: "Book a demo and we'll show it working on a sample of your accounts.",
  primary: DEMO,
  secondary: { label: 'Social listening before you launch', href: '/blog/social-listening-before-launch/' },
  secondaryLead: 'Read',
};
