import { AANGAN_LIST_URL, type Cta } from '../types';

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
/** A view from around the hills, shown in an arched window in the ribbon. */
export interface MapView {
  src: string;
  alt: string;
  /** Crop focus inside the arch (CSS object-position). Default centre. */
  focus?: string;
}
export interface MapContent {
  heading: string;
  body: string;
  pins: MapPin[];
  /** The drifting ribbon of arched windows, in order. */
  views: MapView[];
  cta: Cta;
}

const view = (file: string, alt: string, focus?: string): MapView => ({
  src: `/assets/img/products/aangan/places/${file}.webp`,
  alt,
  focus,
});

export const map: MapContent = {
  heading: 'Where next? Wherever you are.',
  body: 'Aangan begins in Darjeeling, our home. But the courtyard is open to everyone: wherever you are, you can join today, and list your homestay, cafe or taxi to put your town on the map.',
  pins: [
    { name: 'Darjeeling', status: 'Live now', home: true },
    { name: 'Your town', status: 'Register today' },
    { name: 'Anywhere else', status: 'Register today' },
  ],
  views: [
    view('tinchuley', 'A cottage above tea gardens, with mist in the valleys and peaks beyond', '30% 50%'),
    view('lamahatta', 'Prayer flags strung between tall pines, a snow peak in the distance', '40% 50%'),
    view('srikhola', 'A footbridge over a rocky mountain river, cottages on the bank', '45% 50%'),
    view('soureni', 'A road curving past tea gardens above a lake in the hills', '55% 50%'),
    view('takdah', 'A quiet lane through tall pines, a bungalow and misty ridges beyond', '35% 50%'),
    view('sittong', 'Orange trees beside green-roofed houses on a hillside', '30% 50%'),
    view('lepchajagat', 'A misty forest road between tall trees', '50% 50%'),
    view('chatakpur', 'A wooden cottage on a ridge, snow peaks rising above the clouds', '25% 50%'),
    view('tabakoshi', 'Clear water running over boulders, homestays among the trees', '60% 50%'),
    view('bunkulung', 'A farmhouse on terraced green slopes, a lake in the valley', '40% 50%'),
  ],
  cta: { label: 'List your homestay, cafe or taxi', href: AANGAN_LIST_URL },
};
