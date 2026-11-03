/**
 * Sample data for the Doptor Office Manager demo in the /products/doptor-erp/
 * hero. Everything here is invented: the company, its people, projects and
 * numbers. People are shown with initials avatars, not photos. Totals agree
 * with each other across screens.
 */

/** A round initials avatar as an SVG data URI, so it works anywhere an <img> does. */
const AVATAR_COLORS = ['#2BA38A', '#3B8FC9', '#C2507A', '#E39B37', '#7B6CF0', '#4FB0C6', '#E0605E', '#6C9B75', '#8F7CF0'];
export function avatar(fullName: string): string {
  const initials = fullName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const hash = [...fullName].reduce((n, c) => n + c.charCodeAt(0), 0);
  const bg = AVATAR_COLORS[hash % AVATAR_COLORS.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${bg}"/><text x="32" y="41" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="#fff">${initials}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const ORG = {
  name: 'Sample Company',
  version: 'v 0.5',
  user: { name: 'Arjun', role: 'Founder & CEO', access: 'Super Admin', photo: avatar('Arjun Mehta') },
};

/** The overview's headline figures. Open = total − completed; matches the "all time" delivery donut. */
export const PULSE = { open: 42, overdue: 12, completed: 86, total: 128, next14: 9, logged: '6.5h' };

export interface Slice { label: string; value: number; color: string }
export type Period = 'all' | 'month' | 'week';
export const PERIODS: { id: Period; label: string }[] = [
  { id: 'all', label: 'All time' },
  { id: 'month', label: 'This month' },
  { id: 'week', label: 'This week' },
];

/** The three donuts, each with a breakdown per period. Every period's slices add up to the same total across charts. */
export const CHARTS: { id: string; title: string; data: Record<Period, Slice[]> }[] = [
  {
    id: 'size',
    title: 'Tasks by size',
    data: {
      all: [
        { label: 'Small', value: 68, color: '#2BA38A' },
        { label: 'Medium', value: 31, color: '#E39B37' },
        { label: 'Big', value: 14, color: '#E0605E' },
        { label: 'Untagged', value: 15, color: '#5B6475' },
      ],
      month: [
        { label: 'Small', value: 21, color: '#2BA38A' },
        { label: 'Medium', value: 11, color: '#E39B37' },
        { label: 'Big', value: 4, color: '#E0605E' },
        { label: 'Untagged', value: 2, color: '#5B6475' },
      ],
      week: [
        { label: 'Small', value: 7, color: '#2BA38A' },
        { label: 'Medium', value: 3, color: '#E39B37' },
        { label: 'Big', value: 1, color: '#E0605E' },
        { label: 'Untagged', value: 1, color: '#5B6475' },
      ],
    },
  },
  {
    id: 'status',
    title: 'Delivery status',
    data: {
      all: [
        { label: 'Done', value: 86, color: '#2BA38A' },
        { label: 'Open', value: 22, color: '#8A93A3' },
        { label: 'In review', value: 8, color: '#3B8FC9' },
        { label: 'Overdue', value: 12, color: '#E0605E' },
      ],
      month: [
        { label: 'Done', value: 19, color: '#2BA38A' },
        { label: 'Open', value: 11, color: '#8A93A3' },
        { label: 'In review', value: 3, color: '#3B8FC9' },
        { label: 'Overdue', value: 5, color: '#E0605E' },
      ],
      week: [
        { label: 'Done', value: 4, color: '#2BA38A' },
        { label: 'Open', value: 5, color: '#8A93A3' },
        { label: 'In review', value: 1, color: '#3B8FC9' },
        { label: 'Overdue', value: 2, color: '#E0605E' },
      ],
    },
  },
  {
    id: 'effort',
    title: 'Project effort',
    data: {
      all: [
        { label: 'Clinic app', value: 36, color: '#7DD87D' },
        { label: 'Retail POS', value: 27, color: '#E0605E' },
        { label: 'Sales dashboard', value: 11, color: '#3B8FC9' },
        { label: 'HR toolkit', value: 16, color: '#2BA38A' },
        { label: 'Company website', value: 15, color: '#E39B37' },
        { label: 'Brand refresh', value: 23, color: '#C2507A' },
      ],
      month: [
        { label: 'Clinic app', value: 12, color: '#7DD87D' },
        { label: 'Retail POS', value: 6, color: '#E0605E' },
        { label: 'Sales dashboard', value: 5, color: '#3B8FC9' },
        { label: 'HR toolkit', value: 4, color: '#2BA38A' },
        { label: 'Company website', value: 7, color: '#E39B37' },
        { label: 'Brand refresh', value: 4, color: '#C2507A' },
      ],
      week: [
        { label: 'Clinic app', value: 4, color: '#7DD87D' },
        { label: 'Retail POS', value: 2, color: '#E0605E' },
        { label: 'Sales dashboard', value: 2, color: '#3B8FC9' },
        { label: 'HR toolkit', value: 1, color: '#2BA38A' },
        { label: 'Company website', value: 2, color: '#E39B37' },
        { label: 'Brand refresh', value: 1, color: '#C2507A' },
      ],
    },
  },
];

export type Status = 'Overdue' | 'Open' | 'In review' | 'Done';
export interface Task { title: string; project: string; size: 'Small' | 'Medium' | 'Big'; who: string; due: string; status: Status }

/** Today in the demo is Monday 2 November. */
export const TASKS: Task[] = [
  { title: 'Patient booking flow', project: 'Clinic app', size: 'Big', who: 'Neha', due: '28 Oct', status: 'Overdue' },
  { title: 'Low-stock alerts', project: 'Retail POS', size: 'Medium', who: 'Rohan', due: '30 Oct', status: 'Overdue' },
  { title: 'Product page translations', project: 'Company website', size: 'Medium', who: 'Vikram', due: '4 Nov', status: 'In review' },
  { title: 'Region filter on the sales map', project: 'Sales dashboard', size: 'Small', who: 'Rohan', due: '6 Nov', status: 'Open' },
  { title: 'Attendance export to Excel', project: 'HR toolkit', size: 'Small', who: 'Kavya', due: '5 Nov', status: 'Open' },
  { title: 'Weekly client update', project: 'Brand refresh', size: 'Small', who: 'Meera', due: '3 Nov', status: 'Open' },
  { title: 'Release checklist in the Wiki', project: 'HR toolkit', size: 'Small', who: 'Priya', due: '2 Nov', status: 'In review' },
  { title: 'Brand film edit, second cut', project: 'Brand refresh', size: 'Big', who: 'Vikram', due: '10 Nov', status: 'Open' },
  { title: 'Doctor profiles and ratings', project: 'Clinic app', size: 'Medium', who: 'Neha', due: '12 Nov', status: 'Open' },
  { title: 'Quarterly accounts close', project: 'HR toolkit', size: 'Medium', who: 'Kavya', due: '31 Oct', status: 'Done' },
  { title: 'Supplier purchase orders', project: 'Retail POS', size: 'Small', who: 'Rohan', due: '29 Oct', status: 'Done' },
  { title: 'Kick-off call with the client', project: 'Brand refresh', size: 'Small', who: 'Meera', due: '27 Oct', status: 'Done' },
];

export interface Space { name: string; note: string; color: string; done: number; total: number; members: string[]; status: 'Ongoing' | 'Completed'; logged: string }

export const SPACES: Space[] = [
  { name: 'Clinic app', status: 'Ongoing', logged: '14h 20m', note: 'Bookings, doctors and reminders', color: '#7DD87D', done: 30, total: 44, members: ['Neha', 'Arjun', 'Vikram'] },
  { name: 'Retail POS', status: 'Ongoing', logged: '9h 05m', note: 'Billing, stock and suppliers', color: '#E0605E', done: 24, total: 31, members: ['Rohan', 'Arjun'] },
  { name: 'Brand refresh', status: 'Ongoing', logged: '11h 40m', note: 'Logo, film and guidelines', color: '#C2507A', done: 22, total: 29, members: ['Vikram', 'Meera', 'Arjun'] },
  { name: 'Company website', status: 'Ongoing', logged: '6h 30m', note: 'Site, blog and translations', color: '#E39B37', done: 11, total: 17, members: ['Vikram', 'Neha'] },
  { name: 'HR toolkit', status: 'Ongoing', logged: '4h 15m', note: 'Attendance, leave and payroll', color: '#2BA38A', done: 10, total: 14, members: ['Kavya', 'Priya'] },
  { name: 'Sales dashboard', status: 'Ongoing', logged: '3h 10m', note: 'Sales and inventory reports', color: '#3B8FC9', done: 5, total: 8, members: ['Rohan'] },
  { name: 'Annual report 2025', status: 'Completed', logged: '0h', note: 'Design and print for a client', color: '#8F7CF0', done: 12, total: 12, members: ['Vikram', 'Arjun'] },
  { name: 'Admissions portal', status: 'Completed', logged: '0h', note: 'Online forms for a college', color: '#4FB0C6', done: 18, total: 18, members: ['Neha', 'Meera'] },
];

export const NOTES = [
  { text: 'Rohan moved "Supplier purchase orders" to Done', time: '12 min ago' },
  { text: 'Vikram asked for review on "Product page translations"', time: '1 h ago' },
  { text: '"Patient booking flow" is 5 days overdue', time: 'Today' },
];

/* ===================== Space ===================== */

/** Everyone in the workspace. Shown by first name. */
export interface Member {
  name: string; full: string; title: string; team: 'Leadership' | 'Engineering' | 'Design'; photo: string; manager?: string;
  attendance: number; tasks: number; kpis: number | null; checkIn: string; checkOut: string; today: 'In' | 'Out' | 'Leave' | 'Not yet';
}
const person = (m: Omit<Member, 'photo'>): Member => ({ ...m, photo: avatar(m.full) });
export const MEMBERS: Member[] = [
  person({ name: 'Arjun', full: 'Arjun Mehta', title: 'Founder & CEO', team: 'Leadership', attendance: 92, tasks: 89, kpis: null, checkIn: '09:52', checkOut: '', today: 'In' }),
  person({ name: 'Kavya', full: 'Kavya Rao', title: 'Co-founder', team: 'Leadership', attendance: 96, tasks: 94, kpis: 90, checkIn: '09:41', checkOut: '', today: 'In' }),
  person({ name: 'Rohan', full: 'Rohan Das', title: 'Co-founder', team: 'Engineering', attendance: 94, tasks: 82, kpis: 88, checkIn: '10:06', checkOut: '', today: 'In' }),
  person({ name: 'Meera', full: 'Meera Iyer', title: 'Co-founder', team: 'Leadership', attendance: 90, tasks: 90, kpis: null, checkIn: '', checkOut: '', today: 'Not yet' }),
  person({ name: 'Ishaan', full: 'Ishaan Ghosh', title: 'Motion Designer', team: 'Design', manager: 'Arjun', attendance: 97, tasks: 76, kpis: 92, checkIn: '', checkOut: '', today: 'Leave' }),
  person({ name: 'Priya', full: 'Priya Nair', title: 'Head of Technology', team: 'Engineering', manager: 'Arjun', attendance: 96, tasks: 84, kpis: 91, checkIn: '09:48', checkOut: '', today: 'In' }),
  person({ name: 'Vikram', full: 'Vikram Shah', title: 'Project Manager', team: 'Design', manager: 'Ishaan', attendance: 95, tasks: 78, kpis: 90, checkIn: '10:12', checkOut: '', today: 'In' }),
  person({ name: 'Neha', full: 'Neha Kapoor', title: 'Project Manager', team: 'Engineering', manager: 'Priya', attendance: 92, tasks: 71, kpis: 87, checkIn: '10:20', checkOut: '', today: 'In' }),
  person({ name: 'Aditya', full: 'Aditya Sen', title: 'Chief of Staff', team: 'Leadership', manager: 'Priya', attendance: 94, tasks: 85, kpis: 89, checkIn: '', checkOut: '', today: 'Not yet' }),
];
/** People with no manager sit at the top of the org chart, in this order. */
export const ORG_ROOTS = ['Kavya', 'Arjun', 'Rohan', 'Meera'];
/** Score = attendance 40% + task completion 30% + KPI fulfilment 30%. Unrated when a KPI is missing. */
export const scoreOf = (m: Member) => (m.kpis == null ? null : Math.round(m.attendance * 0.4 + m.tasks * 0.3 + m.kpis * 0.3));

export const OPS_INFO = [
  { title: 'Workspace profile', text: 'Company name, logo and default working hours.', action: 'Configure' },
  { title: 'Working week', text: 'Monday to Friday · 10:00 to 18:00 · Asia/Kolkata.', action: 'Edit schedule' },
  { title: 'Leave policy', text: 'Casual leave, earned leave, comp-off and approvals.', action: 'Manage policy' },
  { title: 'Notifications', text: 'Task reminders, reviews and daily activity summaries.', action: 'Set preferences' },
];
export const POLICY = [
  { label: 'Timezone', value: 'Asia/Kolkata' },
  { label: 'Start time', value: '10:00' },
  { label: 'End time', value: '18:00' },
  { label: 'Unpaid break', value: '45 min' },
  { label: 'Check-in grace period', value: '15 min' },
  { label: 'Maximum team on leave', value: '2 people' },
];
export const LEAVE_TYPES = [
  { type: 'Casual Leave', days: 12, carry: 'Lapses at year end', approval: 'Manager' },
  { type: 'Sick Leave', days: 8, carry: 'Lapses at year end', approval: 'Manager' },
  { type: 'Annual Leave', days: 15, carry: 'Up to 5 days', approval: 'Founder' },
];
export const HOLIDAYS = [
  { date: '25 Dec', day: 'Fri', name: 'Christmas', kind: 'Public holiday' },
  { date: '1 Jan', day: 'Fri', name: 'New Year', kind: 'Public holiday' },
  { date: '26 Jan', day: 'Tue', name: 'Republic Day', kind: 'Public holiday' },
];

/** Reports, per period. Each period's numbers match the overview's delivery-status donut. */
export const REPORT: Record<Period, { scope: number; done: number; progress: number; overdue: number; pass: string; logged: string; summary: string[] }> = {
  all: { scope: 128, done: 86, progress: 8, overdue: 12, pass: '84%', logged: '6.5h', summary: ['86 of 128 tasks are done, 67% of everything in scope.', '12 open tasks are past their due date; most sit in Clinic app and Retail POS.', 'Reviews pass first time 84% of the time.'] },
  month: { scope: 38, done: 19, progress: 3, overdue: 5, pass: '80%', logged: '3.2h', summary: ['19 of 38 tasks due this month are done.', '5 tasks slipped past their date; 3 are Medium or Big.', 'Clinic app and the company website took the most effort this month.'] },
  week: { scope: 12, done: 4, progress: 1, overdue: 2, pass: '75%', logged: '1.1h', summary: ['4 of 12 tasks due this week are done.', '2 tasks are overdue and need a new date.', 'Three Small tasks are due by Friday.'] },
};
/** Tasks due per week, eight weeks around today; done is the darker part. */
export const WEEKS = [
  { label: '28 Sep', due: 9, done: 9 }, { label: '5 Oct', due: 14, done: 13 }, { label: '12 Oct', due: 11, done: 10 },
  { label: '19 Oct', due: 16, done: 13 }, { label: '26 Oct', due: 13, done: 8 }, { label: '2 Nov', due: 12, done: 4, now: true },
  { label: '9 Nov', due: 7, done: 0 }, { label: '16 Nov', due: 4, done: 0 },
];

export const NOTICES: { title: string; body: string; who: string; date: string; kind: 'Announcement' | 'Holiday' | 'Policy'; pinned?: boolean }[] = [
  { title: 'Quarterly review on Friday', body: 'Each team shares three wins and one blocker. 30 minutes, in the main room and online.', who: 'Arjun', date: '2 Nov', kind: 'Announcement', pinned: true },
  { title: 'New leave policy from 1 December', body: 'Comp-off can now be taken within 60 days. The policy page in the Wiki has the details.', who: 'Kavya', date: '30 Oct', kind: 'Policy' },
  { title: 'Office closed for Christmas', body: 'The office is closed on Friday 25 December. Plan client handovers before then.', who: 'Kavya', date: '28 Oct', kind: 'Holiday' },
  { title: 'Reviews now have their own queue', body: 'Finished work goes to a reviewer before it counts as done. Find it under People, then Reviews.', who: 'Priya', date: '24 Oct', kind: 'Announcement' },
];

/* ===================== Tasks & Projects ===================== */

/** Ideas not yet committed to. Moving one makes it a task. */
export const UPCOMING: { id: string; title: string; project: string; note: string; when: string; size: 'Small' | 'Medium' | 'Big'; who: string }[] = [
  { id: 'u1', title: 'Offline mode for attendance', project: 'HR toolkit', note: 'Check-ins saved on the phone and sent when back online.', when: 'Later in November', size: 'Big', who: 'Priya' },
  { id: 'u2', title: 'Seasonal discounts at checkout', project: 'Retail POS', note: 'Let a store set a festival price with an end date.', when: 'December', size: 'Medium', who: 'Neha' },
  { id: 'u3', title: 'Monthly sales digest email', project: 'Sales dashboard', note: 'One email per month with the top movers and slow stock.', when: 'December', size: 'Small', who: 'Rohan' },
];
export const WEEKDAYS = [
  { key: '2 Nov', label: 'Mon 2' }, { key: '3 Nov', label: 'Tue 3' }, { key: '4 Nov', label: 'Wed 4' }, { key: '5 Nov', label: 'Thu 5' }, { key: '6 Nov', label: 'Fri 6' },
];

export const WIKI: { id: string; title: string; project: string; who: string; updated: string; body: { h?: string; p?: string; list?: string[] }[] }[] = [
  { id: 'w1', title: 'Release checklist', project: 'HR toolkit', who: 'Priya', updated: 'Today', body: [
    { p: 'Every release goes through the same five steps, so nothing reaches users half-finished.' },
    { list: ['Merge only reviewed tasks', 'Run the smoke test on staging', 'Back up the database', 'Deploy, then check login and attendance', 'Post a note on the notice board'] },
    { h: 'If something breaks', p: 'Roll back first, then open a Big task with what happened.' },
  ] },
  { id: 'w2', title: 'Onboarding: first week', project: 'Company', who: 'Kavya', updated: '3 days ago', body: [
    { p: 'A new teammate should finish the first week knowing who to ask, where work lives and how a task moves.' },
    { list: ['Day 1: accounts, laptop and a walk through Doptor', 'Day 2: shadow a project manager', 'Day 3 to 5: one Small task, start to review'] },
  ] },
  { id: 'w3', title: 'Task sizes, explained', project: 'Company', who: 'Arjun', updated: '1 week ago', body: [
    { p: 'Sizes keep estimates honest and make the overview charts meaningful.' },
    { list: ['Small: under 2 hours', 'Medium: half a day to a day', 'Big: more than a day; split it if you can'] },
  ] },
  { id: 'w4', title: 'Clinic photo guide', project: 'Clinic app', who: 'Vikram', updated: '2 weeks ago', body: [
    { p: 'Clinics upload their own photos. These rules keep listings consistent.' },
    { list: ['Shoot in daylight, lights on', 'One wide shot of the waiting area', 'No filters or text on photos'] },
  ] },
  { id: 'w5', title: 'Client handover template', project: 'Company', who: 'Meera', updated: '1 month ago', body: [
    { p: 'Use this list when a project ends, so the client has everything in one place.' },
    { list: ['Final files and source files', 'Logins and where they are stored', 'Who to call for support, and until when'] },
  ] },
];

/* ===================== People ===================== */

export const LEAVE_BALANCE = [
  { type: 'Casual Leave', allotted: 12, pending: 1, remaining: 9 },
  { type: 'Sick Leave', allotted: 8, pending: 0, remaining: 7 },
  { type: 'Annual Leave', allotted: 15, pending: 0, remaining: 11 },
];
export const LEAVE_REQUESTS = [
  { id: 'l1', who: 'Neha', type: 'Casual Leave', from: '9 Nov', to: '10 Nov', days: 2, reason: 'Family event' },
  { id: 'l2', who: 'Aditya', type: 'Sick Leave', from: '3 Nov', to: '3 Nov', days: 1, reason: 'Doctor visit' },
  { id: 'l3', who: 'Vikram', type: 'Annual Leave', from: '21 Dec', to: '24 Dec', days: 4, reason: 'Personal work' },
];

export type ReviewState = 'Pending' | 'Approved' | 'Sent back';
export const REVIEWS: { project: string; work: string; size: 'Small' | 'Medium' | 'Big'; who: string; reviewer: string; due: string; file: string; state: ReviewState }[] = [
  { project: 'Company website', work: 'Product page translations', size: 'Medium', who: 'Vikram', reviewer: 'Arjun', due: '4 Nov', file: 'translations-v2.xlsx', state: 'Pending' },
  { project: 'Company website', work: 'About page copy', size: 'Small', who: 'Aditya', reviewer: 'Arjun', due: '5 Nov', file: '', state: 'Pending' },
  { project: 'HR toolkit', work: 'Release checklist in the Wiki', size: 'Small', who: 'Priya', reviewer: 'Rohan', due: '2 Nov', file: 'Wiki page', state: 'Pending' },
  { project: 'HR toolkit', work: 'Quarterly accounts close', size: 'Medium', who: 'Kavya', reviewer: 'Arjun', due: '31 Oct', file: 'accounts-q2.pdf', state: 'Approved' },
  { project: 'Retail POS', work: 'Supplier purchase orders', size: 'Small', who: 'Rohan', reviewer: 'Priya', due: '29 Oct', file: 'PR #142', state: 'Approved' },
  { project: 'Clinic app', work: 'Patient booking flow', size: 'Big', who: 'Neha', reviewer: 'Priya', due: '28 Oct', file: 'Figma prototype', state: 'Sent back' },
];
