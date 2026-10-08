export interface WhyReason {
  title: string;
  body: string;
}
export interface WhyContent {
  heading: string;
  intro: string;
  reasons: WhyReason[];
}

export const why: WhyContent = {
  heading: 'Why aangan',
  intro: 'Built in the hills, for the people who host, cook and drive here.',
  reasons: [
    { title: 'Your page, your words', body: 'You describe your home, your kitchen or your car yourself. Travellers meet you as you are, before they arrive.' },
    { title: 'No tech skills needed', body: 'A few photos and a few lines are enough to start. If you can send a message on your phone, you can make your page.' },
    { title: 'A price that fits', body: 'Rs 99 per year, as a launch offer. One small fee for a page that works for you all year.' },
    { title: 'Made by neighbours', body: 'aangan is built by Studio 1947 in Mirik, Darjeeling. We live here too, and we can knock on your door when you need help.' },
  ],
};
