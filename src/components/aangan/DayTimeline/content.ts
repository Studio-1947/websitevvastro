import type { ImageSlot } from '../types';

export interface DayStop {
  time: string;
  text: string;
  image: ImageSlot;
}
export interface DayContent {
  heading: string;
  note: string;
  stops: DayStop[];
}

const img = (id: string, alt: string, file: string): ImageSlot => ({ id, ratio: '3:2', alt, src: `/images/aangan/${file}`, width: 1254, height: 1254 });

export const day: DayContent = {
  heading: 'A day with aangan',
  note: 'An example day',
  stops: [
    { time: 'Morning', text: 'Wake up in the homestay you picked for the view from its window. Tea in the courtyard.', image: img('DAY-01', 'Tea served on arrival', 'day-01.webp') },
    { time: 'Late morning', text: 'The driver you chose waits at the gate, and knows a viewpoint worth the early start.', image: img('DAY-02', 'A viewpoint on the drive', 'day-02.webp') },
    { time: 'Afternoon', text: 'Lunch at a small cafe you found while scrolling the night before.', image: img('DAY-03', 'Lunch at a local cafe', 'day-03.webp') },
    { time: 'Evening', text: 'Back in the courtyard, looking through the spots nearby for tomorrow.', image: img('DAY-04', 'An evening at the homestay', 'day-04.webp') },
  ],
};
