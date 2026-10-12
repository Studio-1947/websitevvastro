import type { ImageSlot } from '../types';

export interface LoopNode {
  key: 'homestay' | 'driver' | 'cafe' | 'tourist';
  name: string;
  body: string;
  benefit?: string;
  /** Open fact from the brief; shown as a flag in dev only. */
  confirm?: string;
  image: ImageSlot;
}
export interface LoopContent {
  /** In Hindi; `headingEn` is the same line in English, shown small underneath. */
  heading: string;
  headingEn: string;
  nodes: LoopNode[];
  closing: string;
}

const img = (id: string, alt: string, file: string): ImageSlot => ({ id, ratio: '1:1', alt, src: `/images/aangan/${file}`, width: 600, height: 600 });

export const loop: LoopContent = {
  heading: 'सब एक ही आँगन में',
  headingEn: 'Everyone in one courtyard',
  nodes: [
    // In the order the traveller meets them: arrive, ride, stay, eat.
    {
      key: 'tourist',
      name: 'Traveller',
      body: 'Arrives knowing who they will meet: a driver, a host and a cafe, chosen the way a friend who lives here would choose.',
      image: img('LOOP-04', 'A traveller looking out over the hills', 'loop-04.webp'),
    },
    {
      key: 'driver',
      name: 'Driver',
      body: 'Waiting at the station, already a familiar name. Knows the roads, and the viewpoint worth stopping for.',
      image: img('LOOP-02', 'A local driver beside their vehicle', 'loop-02.webp'),
    },
    {
      key: 'homestay',
      name: 'Homestay',
      body: 'A room with a view, a family at the table, and tea in the courtyard. Guests arrive as strangers and leave as friends.',
      image: img('LOOP-01', 'A homestay host at the door', 'loop-01.webp'),
    },
    {
      key: 'cafe',
      name: 'Cafe',
      body: 'The small place the whole lane swears by, found before walking past it.',
      image: img('LOOP-03', 'A cafe owner serving tea', 'loop-03.webp'),
    },
  ],
  closing: 'Less searching, more belonging.',
};
