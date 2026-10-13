export interface WhyReason {
  title: string;
  body: string;
  /** Square photo (1200px), cropped to fit its panel. */
  image: string;
  alt: string;
  /** Crop focus (CSS object-position), so faces stay in view in narrow strips. */
  focus?: string;
}
export interface WhyContent {
  heading: string;
  intro: string;
  reasons: WhyReason[];
}

const DIR = '/assets/img/products/aangan/why';

export const why: WhyContent = {
  heading: 'Why Aangan?',
  intro: 'Because travel should feel more personal, and local businesses deserve a fair chance.',
  reasons: [
    {
      title: 'Beyond the Usual',
      body: 'Discover local homestays, cafes and drivers you might otherwise miss.',
      image: `${DIR}/01-beyond.webp`,
      alt: 'A traveller with a backpack walking down a misty hill-town lane past cafes and a parked jeep',
      focus: '35% 55%',
    },
    {
      title: 'Real People, Real Experiences',
      body: 'Get to know the people who make a place worth visiting.',
      image: `${DIR}/02-people.webp`,
      alt: 'Three locals smiling outside a café, one holding a cup of tea',
      focus: '50% 45%',
    },
    {
      title: 'Direct Connections',
      body: 'Fewer barriers between travellers and locals. Just real conversations.',
      image: `${DIR}/03-connections.webp`,
      alt: 'A traveller and a homestay host chatting warmly at her door',
      focus: '48% 40%',
    },
    {
      title: 'Fair for Everyone',
      body: 'Rs 1 for travellers to join, Rs 99 a year for local providers. No booking commissions: locals keep what they earn.',
      image: `${DIR}/04-fair.webp`,
      alt: 'Hosts and travellers sharing tea around a table in a Darjeeling courtyard',
      focus: '50% 42%',
    },
  ],
};
