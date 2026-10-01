import { AANGAN_URL, type Cta } from '../types';

export interface PassTier {
  name: string;
  /** Referrals needed. The last tier is open-ended ("50+"). */
  at: number;
  openEnded?: boolean;
}
export interface PassContent {
  heading: string;
  passName: string;
  firstYear: string;
  /** Yearly price after the first year, in rupees. Animated by the counter. */
  priceAfter: number;
  priceAfterLabel: string;
  cta: Cta;
  referral: {
    title: string;
    body: string;
    tiers: PassTier[];
    note: string;
    confirm?: string;
  };
}

export const pass: PassContent = {
  heading: 'For tourists',
  passName: 'aangan pass',
  firstYear: 'Free for the first year',
  priceAfter: 499,
  priceAfterLabel: 'per year after',
  cta: { label: 'Get the pass', href: AANGAN_URL },
  referral: {
    title: 'Bring friends, earn perks',
    body: 'Free meals and discounted stays, unlocked as your referrals grow.',
    tiers: [
      { name: 'Bronze', at: 5 },
      { name: 'Silver', at: 15 },
      { name: 'Gold', at: 30 },
      { name: 'Platinum', at: 50, openEnded: true },
    ],
    note: 'Perks only, never cash.',
    confirm: 'which perk each tier unlocks',
  },
};
