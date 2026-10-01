import { AANGAN_LIST_URL, type Cta, type ImageSlot } from '../types';

export interface ProviderTab {
  key: string;
  label: string;
  get: string;
  how: string;
  cost: string;
  confirm?: string;
  image: ImageSlot;
}
export interface ProviderContent {
  heading: string;
  intro: string;
  labels: { get: string; how: string; cost: string };
  tabs: ProviderTab[];
  region: string;
  cta: Cta;
}

const cost = 'Rs 99 per year, as a launch offer.';
const img = (id: string, alt: string, file: string): ImageSlot => ({ id, ratio: '4:3', alt, src: `/images/aangan/${file}`, width: 1254, height: 1254 });

export const providers: ProviderContent = {
  heading: 'For homestays, cafes and drivers',
  intro: 'Make your page, show people who you are, and let travellers find you. No tech skills needed.',
  labels: { get: 'What you get', how: 'How it works', cost: 'What it costs' },
  tabs: [
    {
      key: 'homestay',
      label: 'Homestays',
      get: 'Guests who chose your home for what it is, not just for a price.',
      how: 'Add your rooms, a few photos and a little about your family. Travellers scroll through, like what they see and get in touch.',
      cost,
      image: img('PROV-01', 'A guest room in a homestay', 'prov-01.webp'),
    },
    {
      key: 'cafe',
      label: 'Cafes',
      get: 'New faces who came looking for you.',
      how: 'Share what you cook, when you are open and what you are known for. Travellers staying nearby find you on their way.',
      cost,
      image: img('PROV-03', 'Inside a small cafe', 'prov-03.webp'),
    },
    {
      key: 'driver',
      label: 'Drivers',
      get: 'More trips, less waiting at the stand.',
      how: 'Add your car, the routes you know and the languages you speak. Travellers pick you before they arrive.',
      cost,
      image: img('PROV-02', 'A taxi on a hill road', 'prov-02.webp'),
    },
  ],
  region: 'Register in Darjeeling now. Other towns are on the way.',
  cta: { label: 'List your homestay, cafe or taxi', href: AANGAN_LIST_URL },
};
