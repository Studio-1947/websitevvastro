import { AANGAN_LIST_URL, type Cta, type ImageSlot } from '../types';

export interface MapPin {
  name: string;
  status: string;
  /** Where aangan began. Other pins are open spots waiting for a listing. */
  home?: boolean;
}
export interface MapContent {
  heading: string;
  body: string;
  pins: MapPin[];
  cta: Cta;
  /** MAP-01 image fills the figure; the slot supplies its ID, alt and file. */
  slot: ImageSlot;
}

export const map: MapContent = {
  heading: 'Where next? Wherever you are.',
  body: 'aangan began in Darjeeling, our home. But the courtyard is open to everyone. If you run a homestay, a cafe or a taxi anywhere, you can list it today and put your town on the map.',
  pins: [
    { name: 'Your town', status: 'List it today' },
    { name: 'Your town', status: 'List it today' },
    { name: 'Darjeeling', status: 'Where it began', home: true },
  ],
  cta: { label: 'List your homestay, cafe or taxi', href: AANGAN_LIST_URL },
  slot: { id: 'MAP-01', ratio: '16:9', alt: 'A map of the hills with Darjeeling marked and open spots for new places', src: '/images/aangan/map-01.webp', width: 1672, height: 941 },
};
