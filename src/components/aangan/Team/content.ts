export interface TeamPerson {
  /** Name shown on the card. */
  name: string;
  /** Their part in aangan. */
  role: string;
  /** Portrait, reused from the About page. */
  photo: string;
  /** The person's key on /about-us/ (data-fullname, else the card name,
   *  lowercased). Links to their profile via teamMemberHref. */
  member: string;
  /** Scale the photo up inside its square so every face reads at a similar
   *  size; the source portraits are framed differently. Default 1. */
  zoom?: number;
  /** Vertical focus point, as a % of the photo's height. Default 35. */
  y?: number;
  /** Horizontal focus point, as a % of the photo's width. Default 50. */
  x?: number;
}
export interface TeamContent {
  heading: string;
  intro: string;
  people: TeamPerson[];
}

const img = (file: string) => `/assets/img/about-us/team/${file}.webp`;

export const team: TeamContent = {
  heading: 'The people behind Aangan',
  intro: 'A small team from Mirik, in the Darjeeling hills, building something for the place we call home.',
  people: [
    { name: 'Rabi', role: 'Dreamer of this project', photo: img('rabi'), member: 'rabi (rabiul islam)', zoom: 1.25, y: 24 },
    { name: 'Dipam', role: 'Co-creator', photo: img('dipam'), member: 'dipam', zoom: 1.25, y: 24 },
    { name: 'Anjali', role: 'Co-creator', photo: img('anjali'), member: 'anjali chetri', zoom: 1.25, y: 24 },
    { name: 'Subhendu', role: 'Co-creator', photo: img('subhendu'), member: 'subhendu kundu', zoom: 1.2, y: 24 },
    // Cultural Studies scholar from the Darjeeling hills; also appears in the aangan ad.
    { name: 'Subhayu', role: 'Advisor', photo: img('subhayu'), member: 'subhayu bhattacharjee', zoom: 1.3, x: 62, y: 34 },
    { name: 'Soumic', role: 'Developer', photo: img('soumic'), member: 'soumic sarkar', zoom: 1.25, y: 24 },
    { name: 'Santam', role: 'Developer', photo: img('santam'), member: 'santam', zoom: 1.25, y: 24 },
    { name: 'Rahul', role: 'Developer', photo: img('rahul'), member: 'rahul', zoom: 1.2, y: 24 },
    // Tall 4:5 portrait framed close: no zoom, focus on the face.
    { name: 'Dipanjan', role: 'Promotion & creatives', photo: img('dipanjan'), member: 'dipanjan', y: 22 },
    { name: 'Nikhil', role: 'Promotion & creatives', photo: img('nikhilsubba'), member: 'nikhil raj subba', zoom: 1.4, y: 24 },
  ],
};
