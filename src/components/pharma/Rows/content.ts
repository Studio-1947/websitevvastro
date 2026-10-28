import type { Mock } from '../types';

export interface Row {
  title: string;
  body: string;
  mock: Mock;
}

/*
 * Five things the product does, each with the screen that shows it.
 * The same batch (B-2291) appears in each mock, so they agree with each other.
 */
export const rows: Row[] = [
  {
    title: 'Fast billing at the counter',
    body: 'Find a medicine in a few keystrokes and print the bill. The bill saves the moment you press save, so the queue keeps moving.',
    mock: {
      title: 'Bill #2291',
      tag: 'Saved',
      tagTone: 'green',
      head: ['Item', 'Qty', 'Amount'],
      rows: [
        { cells: ['Paracetamol 650', '2', '₹60'] },
        { cells: ['ORS sachets', '4', '₹88'] },
        { cells: ['Cetirizine 10', '1', '₹35'] },
        { cells: ['Total', '', '₹183'], tone: 'green' },
      ],
    },
  },
  {
    title: 'Know what expires, and when',
    body: 'Every box is stored with its batch and expiry date. The stock that expires first is sold first, so less goes to waste.',
    mock: {
      title: 'Paracetamol 650',
      tag: '3 batches',
      tagTone: 'pine',
      head: ['Batch', 'Expiry', 'In stock'],
      rows: [
        { cells: ['B-2291', 'Nov 2026', '34'], tone: 'amber', note: 'Sell first' },
        { cells: ['B-2364', 'Apr 2027', '120'] },
        { cells: ['B-2418', 'Sep 2027', '200'] },
      ],
    },
  },
  {
    title: 'Never run out',
    body: 'See what is running low before it is gone, and turn it into a purchase order for your supplier in one step.',
    mock: {
      title: 'Needs attention',
      tag: 'Today',
      tagTone: 'pine',
      rows: [
        { cells: ['Low stock', '19 items'], tone: 'red' },
        { cells: ['Expiring in 30 days', '1 batch'], tone: 'amber' },
        { cells: ['Purchase order ready', 'PO-0188'], tone: 'green', note: 'Review' },
      ],
    },
  },
  {
    title: 'Keeps working without internet',
    body: 'If the connection drops, billing carries on. Bills are saved on the computer and sent up as soon as you are back online.',
    mock: {
      title: 'Counter 1',
      tag: 'Offline',
      tagTone: 'amber',
      rows: [
        { cells: ['Bill #2304', '₹148'], tone: 'amber', note: 'Saved here' },
        { cells: ['Bill #2303', '₹62'], tone: 'amber', note: 'Saved here' },
        { cells: ['Bill #2302', '₹230'], tone: 'green', note: 'Sent' },
      ],
      foot: 'Sends the rest when the internet is back',
    },
  },
  {
    title: 'The right access for every role',
    body: 'The owner sees every branch and every report. Counter staff see their own branch and the screens they work in, so salaries, suppliers and settings stay with the people who need them.',
    mock: {
      title: 'Who sees what',
      tag: 'Access',
      tagTone: 'pine',
      head: ['Role', 'Can open'],
      rows: [
        { cells: ['Owner', 'All branches'], tone: 'green' },
        { cells: ['Counter staff', 'Own branch'], note: 'Billing, stock' },
        { cells: ['Pharmacist', 'Prescriptions'] },
        { cells: ['Doctor', 'Clinic queue'] },
      ],
      foot: 'Try both in the preview above: switch Owner and Counter staff',
    },
  },
];
