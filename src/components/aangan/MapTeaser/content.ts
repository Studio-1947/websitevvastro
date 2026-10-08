import { AANGAN_LIST_URL, type Cta, type ImageSlot } from '../types';

export interface MapPin {
  name: string;
  status: string;
  /** Where aangan began. Other pins are open spots waiting for a listing. */
  home?: boolean;
  /** Studio 1947's headquarters. */
  hq?: boolean;
  /** Optional link, e.g. the office on a map. */
  href?: string;
}
/** A photo of somewhere around the hills. Leave `image.src` out until a file is chosen. */
export interface MapPlace {
  name: string;
  /** Photographer and licence, when the licence asks for a credit. */
  credit?: string;
  image: ImageSlot;
}
export interface MapContent {
  heading: string;
  body: string;
  pins: MapPin[];
  placesHeading: string;
  places: MapPlace[];
  cta: Cta;
  /** MAP-01 image fills the figure; the slot supplies its ID, alt and file. */
  slot: ImageSlot;
}

const place = (id: string, alt: string, src?: string): ImageSlot => ({ id, ratio: '4:3', alt, src });

export const map: MapContent = {
  heading: 'Where next? Wherever you are.',
  body: 'aangan began in Darjeeling, our home. But the courtyard is open to everyone. If you run a homestay, a cafe or a taxi anywhere, you can list it today and put your town on the map.',
  pins: [
    { name: 'Your town', status: 'List it today' },
    { name: 'Your town', status: 'List it today' },
    { name: 'Darjeeling', status: 'Where it began', home: true },
    { name: 'Mirik', status: 'Studio 1947 headquarters', hq: true, href: 'https://maps.app.goo.gl/mNnNQbUaWLFf5Xw79' },
  ],
  placesHeading: 'Around the hills',
  places: [
    { name: 'Darjeeling', image: place('PLACE-01', 'Darjeeling town with the snow peaks behind') },
    { name: 'Kalimpong', image: place('PLACE-02', 'Kalimpong on its ridge') },
    { name: 'Mirik', image: place('PLACE-03', 'The lake at Mirik') },
    { name: 'Kurseong', image: place('PLACE-04', 'Tea gardens around Kurseong') },
    { name: 'Sandakphu', image: place('PLACE-05', 'The view from Sandakphu') },
    { name: 'Lava', image: place('PLACE-06', 'Forest and monastery at Lava') },
  ],
  cta: { label: 'List your homestay, cafe or taxi', href: AANGAN_LIST_URL },
  slot: { id: 'MAP-01', ratio: '16:9', alt: 'A map of the hills with Darjeeling marked and open spots for new places', src: '/images/aangan/map-01.webp', width: 1672, height: 941 },
};
