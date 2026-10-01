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
  heading: string;
  nodes: LoopNode[];
  closing: string;
}

const img = (id: string, alt: string, file: string): ImageSlot => ({ id, ratio: '1:1', alt, src: `/images/aangan/${file}`, width: 600, height: 600 });

export const loop: LoopContent = {
  heading: 'Everyone in one courtyard',
  nodes: [
    {
      key: 'homestay',
      name: 'Homestay',
      body: 'Hosts make a page for their home: the rooms, the view, the food, the family. Travellers who like what they see get in touch.',
      benefit: 'For hosts: guests who chose your home for what it is.',
      image: img('LOOP-01', 'A homestay host at the door', 'loop-01.webp'),
    },
    {
      key: 'driver',
      name: 'Driver',
      body: 'Drivers show their car, the routes they know and the languages they speak. Travellers pick someone they trust before they arrive.',
      benefit: 'For drivers: more trips, less waiting at the stand.',
      image: img('LOOP-02', 'A local driver beside their vehicle', 'loop-02.webp'),
    },
    {
      key: 'cafe',
      name: 'Cafe',
      body: 'Cafes share what they cook, when they open and what makes them special. Travellers nearby find them before they walk past.',
      benefit: 'For cafes: new faces at the table.',
      image: img('LOOP-03', 'A cafe owner serving tea', 'loop-03.webp'),
    },
    {
      key: 'tourist',
      name: 'Traveller',
      body: 'Scroll through homestays, cafes, drivers and the spots nearby. Choose what feels right, the way a friend who lives here would.',
      image: img('LOOP-04', 'A traveller looking out over the hills', 'loop-04.webp'),
    },
  ],
  closing: 'Less searching, more belonging.',
};
