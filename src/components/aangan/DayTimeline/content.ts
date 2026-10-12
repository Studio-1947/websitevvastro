import type { ImageSlot } from '../types';

export interface DayStop {
  time: string;
  /** 24-hour "HH:MM": sets the clock hands and the time shown beside them. */
  clock: string;
  /** The sky at that hour: it shades the stop's card. */
  sky: 'dawn' | 'morning' | 'afternoon' | 'dusk';
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
  heading: 'A day with Aangan',
  note: 'An example day',
  stops: [
    { time: 'Morning', clock: '06:30', sky: 'dawn', text: 'Wake up in the homestay you picked for the view from its window. Tea in the courtyard.', image: img('DAY-01', 'Tea served on arrival', 'day-01.webp') },
    { time: 'Late morning', clock: '10:30', sky: 'morning', text: 'The driver you chose waits at the gate, and knows a viewpoint worth the early start.', image: img('DAY-02', 'A viewpoint on the drive', 'day-02.webp') },
    { time: 'Afternoon', clock: '13:30', sky: 'afternoon', text: 'Lunch at a small cafe you found on Aangan the night before.', image: img('DAY-03', 'Lunch at a local cafe', 'day-03.webp') },
    { time: 'Evening', clock: '18:30', sky: 'dusk', text: 'Back in the courtyard, planning tomorrow with your host.', image: img('DAY-04', 'An evening at the homestay', 'day-04.webp') },
  ],
};
