import type { ImageSlot } from '../types';

export interface StoryChapter {
  label: string;
  title: string;
  body: string;
  image: ImageSlot;
}
export interface StoryContent {
  heading: string;
  chapters: StoryChapter[];
}

export const story: StoryContent = {
  heading: 'Why we called it aangan',
  chapters: [
    {
      label: 'Chapter 1',
      title: 'The courtyard',
      body: 'In a hill home, the aangan is the open courtyard at the heart of the house. It is where guests are welcomed, tea is poured, and people who arrived as strangers leave as friends.',
      image: { id: 'STORY-01', ratio: '4:3', alt: 'A host pouring tea for travellers at a courtyard table, with snow peaks behind', src: '/assets/img/products/aangan/story-01.webp', width: 1400, height: 1050 },
    },
    {
      label: 'Chapter 2',
      title: 'Easy to love, hard to find',
      body: 'The hills are full of good people doing good work. A family with a spare room and a window full of mountains. A driver who knows every bend in the road. A small cafe the whole lane swears by. From the outside, they are hard to find, and harder to reach.',
      image: { id: 'STORY-02', ratio: '4:3', alt: 'Smiling hill-town hosts, drivers and cafe owners', src: '/assets/img/products/aangan/story-02.webp', width: 1400, height: 1050 },
    },
    {
      label: 'Chapter 3',
      title: 'One place to meet',
      body: 'aangan brings everyone into one courtyard. Homestays, cafes and drivers each make their own page, in their own words. Travellers scroll through, find the people and places that feel right, and reach out. That is all it takes.',
      image: { id: 'STORY-03', ratio: '4:3', alt: 'A traveller browsing homestays, cafes and drivers on aangan while local hosts look on', src: '/assets/img/products/aangan/story-03.webp', width: 1400, height: 1050 },
    },
    {
      label: 'Chapter 4',
      title: 'Starting at home',
      body: 'We are starting in Darjeeling, where we live and where we can knock on doors. Other hill towns will follow, when the people who live there ask us in.',
      image: { id: 'STORY-04', ratio: '4:3', alt: 'The aangan team showing a homestay owner how to create her profile on a tablet', src: '/assets/img/products/aangan/story-04.webp', width: 1400, height: 1050 },
    },
  ],
};
