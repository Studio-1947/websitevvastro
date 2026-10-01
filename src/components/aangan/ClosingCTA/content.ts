import { AANGAN_URL, AANGAN_LIST_URL, type Cta, type ImageSlot } from '../types';

export interface ClosingContent {
  headline: string;
  primary: Cta;
  secondary: Cta;
  credit: string;
  texture: ImageSlot;
}

export const closing: ClosingContent = {
  headline: 'Come into the aangan.',
  primary: { label: 'Plan your trip', href: AANGAN_URL },
  secondary: { label: 'List your homestay, cafe or taxi', href: AANGAN_LIST_URL },
  credit: 'aangan. Every experience. By studio 1947',
  texture: { id: 'CTA-01', ratio: '16:5', alt: 'Decorative aangan courtyard background', src: '/assets/img/products/aangan/footer.webp', width: 2560, height: 800 },
};
