/**
 * Copy for /products/doptor-erp/, laid out like the S47 Vyapar (BI Dashboard)
 * page. Order on the page:
 *
 *   hero → why → spaces (the three workspaces) → core (what every workspace has)
 *   → Campus block → Office block → NGO block → steps → plans → closing
 *
 * Each workspace block has the same three beats, in the order the spaces are
 * introduced (Campus, Office, NGO): a row with the challenge and what Doptor
 * changes, a grid of what only that workspace adds, a live demo, then who
 * sees what. The Office block points to the live demo in the hero; the Campus
 * and NGO blocks have their own.
 *
 * Every English string here has a Hindi, Bengali and Nepali entry in
 * src/i18n/text/products.ts; change both together. Mock text is product UI
 * and is not translated. Mock figures match the two live demos' sample data.
 * Doptor is one page: there are no links to separate module pages.
 */
import { DEMO } from '../pharma/types';
import type { ClosingContent } from '../pharma/Closing/content';
import type { HeroContent } from '../isd/Hero/content';
import type { StepsContent, ToolkitContent } from '../isd/content';
import type { CardsContent } from './Cards/index.astro';
import type { DoptorRow } from './Rows/index.astro';
import type { AccessContent } from './Access/index.astro';
import type { PlansContent } from './Plans/index.astro';

export const hero: HeroContent = {
  name: 'Doptor ERP',
  kind: 'For Campuses, Offices & NGOs',
  title: 'One platform for your entire organisation',
  sub: 'Three dedicated workspaces for campus administration, office operations and NGO impact tracking, run from a single dashboard.',
  primary: DEMO,
  example: 'Example: interactive Office Manager workspace, with sample data. Try it.',
};

/* ---------- Why management matters ---------- */
export const why: CardsContent = {
  id: 'doptor-why',
  eyebrow: 'Why management matters',
  title: "Every organisation runs on admin. It shouldn't run on chasing it.",
  lede: 'Behind every class taught, every file approved and every village reached is a long trail of admin: attendance, approvals, budgets, records and reports. When that trail lives in registers, spreadsheets and inboxes, people spend their days looking for information instead of using it.',
  cols: 3,
  cards: [
    { title: 'Scattered', body: 'Information split across registers, sheets and chat groups.', icon: '<path d="M4 4h6v6H4zM14 5h6v5h-6zM5 14h5v6H5zM15 15h5v5h-5z"/>' },
    { title: 'Repeated', body: 'The same details typed again for every form and report.', icon: '<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>' },
    { title: 'Rushed', body: 'Reports pieced together at the last minute, from memory.', icon: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/>' },
  ],
  note: 'Doptor ERP keeps it all in one place: entered once, used everywhere, so the work that matters gets the time it deserves.',
};

/* ---------- Three spaces: the modules ---------- */
export const spaces: CardsContent = {
  id: 'doptor-spaces',
  eyebrow: 'Three spaces, one platform',
  title: 'Management made easier, wherever you work',
  lede: 'An office, a college and an NGO look very different from the outside. Inside, they wrestle with the same thing: too much admin, spread across too many places.',
  cols: 3,
  cards: [
    { title: 'Campus Manager', body: 'Admissions, departments, faculty, student records, examinations and results, all from one campus workspace.', icon: '<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1 2.7 2 6 2s6-1 6-2v-5"/><path d="M22 10v6"/>' },
    { title: 'Office Manager', body: 'A simple hub for daily admin: centralised operations, shared task views and real-time oversight for your team.', icon: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/>' },
    { title: 'NGO Manager', body: 'Track projects, teams, funds and field activities from one impact dashboard.', icon: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>' },
  ],
  note: 'Pick the module built for how you work, campus administration, office operations or NGO impact tracking, all inside one platform.',
};

/* ===================== Campus Manager ===================== */
const WITH = 'With Doptor ERP';
export const rowsCampus: DoptorRow[] = [
  {
    eyebrow: 'Campus Manager',
    title: 'More time for teaching and learning',
    challenge: 'A campus runs on thousands of moving parts: admissions, timetables, attendance, fees, exams and results, across departments that often keep their own records. Teachers end up doing data entry, and students wait days for answers that should take a minute.',
    pointsLabel: WITH,
    points: [
      { text: 'One record for every student, from admission onwards' },
      { text: 'Attendance, timetables and fees without duplicate registers' },
      { text: 'Exams planned, results recorded and published in one flow' },
      { text: 'Academic analytics for principals, heads and faculty' },
    ],
    mock: {
      title: 'Today on campus',
      tag: 'Live',
      tagTone: 'green',
      rows: [
        { cells: ['Teachers checked in today', '38 / 42'], tone: 'green' },
        { cells: ['Leave requests waiting', '3'], tone: 'amber' },
        { cells: ['Lesson plans submitted', '26 / 31'] },
        { cells: ['Question papers past due', '4'], tone: 'red', note: 'Remind' },
      ],
    },
  },
];

/** Only what a campus adds; the shared core above already covers attendance, tasks, chat and the Wiki. */
export const campus: CardsContent = {
  id: 'doptor-campus',
  eyebrow: 'For schools and colleges',
  title: 'The everyday running of a campus, in one place',
  lede: 'On top of what every workspace has, Campus Manager adds what only a school or college needs.',
  cols: 3,
  cards: [
    { title: 'Admissions and student records', body: 'One record for every student, from the first application to the final result.', icon: '<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1 2.7 2 6 2s6-1 6-2v-5"/>' },
    { title: 'Timetables and fees', body: 'Class timetables and fee dues kept for each student, without duplicate registers.', icon: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M8 14h3M8 17h6"/>' },
    { title: 'Exams and results', body: 'Exams planned, results recorded and published in one flow.', icon: '<path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/>' },
    { title: 'Leave for faculty', body: 'Apply for leave, see the balance and get a decision. Holidays and weekends are left out of the count, and heads see who is away before planning cover.', icon: '<path d="M5 4h14v16l-7-3-7 3z"/>' },
    { title: 'Weekly teaching plan', body: "Each department's week from Monday to Friday: classes, unit tests and duties, and what is still waiting from last week.", icon: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 4v16M13 4v16M18 4v16"/>' },
    { title: 'Academic analytics', body: 'Attendance, results and progress by class and department, for principals, heads and faculty.', icon: '<path d="M3 3v18h18"/><path d="M7 15V9M12 15V6M17 15v-4"/>' },
  ],
};

/** The live Doptor Campus demo: the "see it" beat of the Campus block. */
export const campusDemo = {
  title: 'A campus dashboard, from admission to result',
  lede: 'Pick a school, college or university, then a role: principal, teacher, registrar, student, parent and more. Each one sees their own Doptor Campus. Click through it: this is Doptor Campus with sample data.',
  note: 'Sample institution and data, for illustration.',
};

export const accessCampus: AccessContent = {
  space: 'Campus Manager',
  roles: [
    { role: 'Principal', text: 'Runs the institution: people, departments, leave types, holidays and working hours.' },
    { role: 'Head of department', text: 'Runs the department: all its plans and reports, and approves leave and attendance corrections.' },
    { role: 'Teachers and staff', text: 'Do the work: their classes and tasks, the weekly plan, the Wiki, and their own attendance and leave.' },
  ],
};

/* ===================== Office Manager ===================== */
export const rowsOffice: DoptorRow[] = [
  {
    eyebrow: 'Office Manager',
    title: 'Less chasing, more doing',
    challenge: 'Office work is a web of small tasks: leave requests, approvals, files, purchases, meetings and follow-ups. Each one is simple. Together they swallow the day, and when one person is away, nobody knows where things stand.',
    pointsLabel: WITH,
    points: [
      { text: 'Tasks, approvals and files in one shared place' },
      { text: 'Attendance, leave and staff records kept up to date' },
      { text: 'Clear owners, so nothing waits on a missing reply' },
      { text: 'A live view of workloads and progress for managers' },
    ],
    mock: {
      title: 'Waiting on you',
      tag: '4 today',
      tagTone: 'pine',
      head: ['Request', 'From', 'Status'],
      rows: [
        { cells: ['Leave, 9 to 10 Nov', 'Neha', 'Waiting'], tone: 'amber', note: 'Approve' },
        { cells: ['Printer toner', 'Aditya', 'Approved'], tone: 'green' },
        { cells: ['Client contract v3', 'Meera', 'In review'] },
        { cells: ['Travel claim', 'Rohan', 'Approved'], tone: 'green' },
      ],
    },
  },
];

/** Only what an office adds; screens from the live Office Manager demo in the hero. */
export const office: CardsContent = {
  id: 'doptor-office',
  eyebrow: 'For offices',
  title: 'Built for offices and admin teams',
  lede: 'On top of what every workspace has, Office Manager adds the screens that keep a team organised.',
  cols: 3,
  cards: [
    { title: 'Approvals', body: 'Leave, purchases and claims approved in a tap, with the decision kept on record.', icon: '<path d="M9 12l2 2 4-4"/><path d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6z"/>' },
    { title: 'Organisation chart', body: 'Who reports to whom, team by team, kept current as people join and move.', icon: '<rect x="9" y="3" width="6" height="5" rx="1"/><rect x="3" y="16" width="6" height="5" rx="1"/><rect x="15" y="16" width="6" height="5" rx="1"/><path d="M12 8v4M6 16v-2h12v2"/>' },
    { title: 'Notice board', body: 'Announcements, policies and holidays, where everyone will see them.', icon: '<path d="M4 4h16v12H8l-4 4z"/><path d="M8 8h8M8 11h5"/>' },
    { title: 'Team scorecard', body: 'Attendance, task completion and KPIs for each person, ready for appraisals.', icon: '<path d="M8 21h8M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>' },
    { title: 'Upcoming work', body: 'Plan ideas before they become tasks, then move them in when the time is right.', icon: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3"/><circle cx="12" cy="12" r="5"/>' },
    { title: 'Working week and holidays', body: 'Set working hours, the leave policy and holidays once, for the whole office.', icon: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>' },
  ],
  link: { label: 'Try the live Office Manager workspace at the top of this page', href: '#office-demo' },
};

export const accessOffice: AccessContent = {
  space: 'Office Manager',
  roles: [
    { role: 'Admin', text: 'Runs the workspace: people, roles, working hours, the leave policy and holidays.' },
    { role: 'Manager', text: 'Runs a team: its tasks, plans and reports, and approves leave and reviews.' },
    { role: 'Staff', text: 'Do the work: their own tasks, attendance and leave, and the notice board.' },
  ],
};

/* ===================== NGO Manager ===================== */
export const rowsNgo: DoptorRow[] = [
  {
    eyebrow: 'NGO Manager',
    title: 'Impact you can show, not just claim',
    challenge: 'NGOs work across many projects, places and donors, each with its own budget, indicators and reporting format. Field data arrives on paper, phones and spreadsheets, and turning it into evaluation reports takes weeks of compiling.',
    pointsLabel: WITH,
    points: [
      { text: 'Projects, teams and field activities tracked by location' },
      { text: 'Funds and spending traced back to every grant' },
      { text: 'Beneficiary and survey data collected once, in the field' },
      { text: 'Evaluation reports built from the data you already have' },
    ],
    mock: {
      title: 'Fund utilisation',
      tag: '78% used',
      tagTone: 'green',
      head: ['Grant', 'Received', 'Used'],
      rows: [
        { cells: ['Sample Family Foundation', '₹5.5 Cr', '₹4.6 Cr'] },
        { cells: ['Clean Energy Trust', '₹4.0 Cr', '₹3.1 Cr'], tone: 'amber', note: 'UC due' },
        { cells: ['Health Partners Fund', '₹3.6 Cr', '₹2.6 Cr'] },
        { cells: ['All grants', '₹36.5 Cr', '₹28.4 Cr'], tone: 'green' },
      ],
    },
  },
];

/* ---------- Evaluation and reporting ---------- */
export const reports: CardsContent = {
  id: 'doptor-reports',
  eyebrow: 'Evaluation and reporting',
  title: 'Evaluation reports, without the scramble',
  lede: 'An NGO is asked to report all the time: to donors, boards, government departments and its own teams. Each report wants the same facts in a different shape. Doptor keeps every activity, beneficiary, rupee and indicator in one place, so a report becomes a matter of choosing what to include, not weeks of gathering it.',
  cols: 3,
  cards: [
    { title: 'Donor and grant reports', body: 'Progress, spending and outcomes for each grant, in the format each funder asks for.', icon: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6"/><path d="M8 13h8M8 17h5"/>' },
    { title: 'Monitoring and evaluation', body: 'Indicators tracked against your logframe or results framework, project by project.', icon: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>' },
    { title: 'Baseline, midline and endline', body: 'Survey rounds compared side by side, to show what changed and where.', icon: '<path d="M3 3v18h18"/><path d="M7 15V9M12 15V6M17 15v-4"/>' },
    { title: 'Field and activity reports', body: 'Visits, trainings and distributions logged from the field, with photos and locations.', icon: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>' },
    { title: 'Fund utilisation', body: 'Budget against actual spend for every project, ready for utilisation certificates and audits.', icon: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/><path d="M7 15h3"/>' },
    { title: 'Board and annual reports', body: 'Organisation-wide numbers and stories, brought together for the year.', icon: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>' },
  ],
  note: 'Because every report draws on the same records, the numbers match across all of them.',
};

/** The NGO dashboard: the "see it" beat of the NGO block. */
export const ngo = {
  title: 'An NGO dashboard, from field to report',
  lede: 'Projects, places, SDGs and reports, all from the same records. Click through the screens: this is Doptor NGO Manager with sample data.',
  note: 'Sample organisation and data, for illustration.',
};

export const accessNgo: AccessContent = {
  space: 'NGO Manager',
  roles: [
    { role: 'Director', text: 'Sees every project, grant and report across the organisation.' },
    { role: 'Programme manager', text: 'Runs their projects: budgets, field teams, indicators and reports.' },
    { role: 'Field staff', text: 'Log visits, surveys and spending from the field, for their own projects.' },
  ],
};

/* ---------- Three steps ---------- */
export const steps: StepsContent = {
  title: 'Three steps to running on Doptor',
  lede: 'We set it up with you, so your team is working in it within days.',
  steps: [
    {
      label: 'Set up',
      title: 'Bring your records in',
      body: 'Staff lists, leave balances, registers and spreadsheets come in once. We map your teams, roles and working hours with you.',
    },
    {
      label: 'Work',
      title: 'Run the day in one place',
      body: 'People check in, apply for leave and move their tasks along. Managers approve from the same screen, so nothing waits on a missing reply.',
    },
    {
      label: 'Report',
      title: 'Reports that build themselves',
      body: 'Weekly reviews, attendance summaries and donor reports come from the same records, so the numbers match wherever they are shared.',
    },
  ],
  sources: [
    { label: 'Staff register', color: '#E8900C' },
    { label: 'Leave forms', color: '#0F9D74' },
    { label: 'Task sheets', color: '#2563EB' },
    { label: 'Student records', color: '#D9364A' },
  ],
};

/* ---------- How you run it ---------- */
export const plans: PlansContent = {
  title: 'Run it the way that suits you',
  lede: 'The same Doptor, three ways to run it. Whichever you choose, we set it up with you.',
  plans: [
    {
      label: 'Online (SaaS)',
      tag: 'Pay as you go',
      title: 'Use it as a service',
      body: 'We host Doptor for you. Sign in from any browser or phone, and pay each month for the people and modules you use.',
      points: ['Nothing to install or look after', 'Updates and backups handled by us', 'Add people or modules as you grow'],
      icon: '<path d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 8a4 4 0 0 1-.5 10Z"/>',
    },
    {
      label: 'On your site',
      title: 'Installed at your premises',
      body: 'We set Doptor up on a computer at your office, campus or field office, so your records stay in your building.',
      points: ['Your data stays on site', 'Runs on your local network', 'We install it and train your team'],
      icon: '<path d="M3 21h18M5 21V8l7-5 7 5v13"/><path d="M9 21v-6h6v6"/>',
    },
    {
      label: 'On your own server',
      title: 'On your server or cloud account',
      body: 'Run Doptor on your own server or cloud account, under your own domain, with your IT team in control.',
      points: ['Your domain and your data', 'Fits your own security rules', 'We set it up and hand it over'],
      icon: '<rect x="3" y="4" width="18" height="7" rx="1.5"/><rect x="3" y="13" width="18" height="7" rx="1.5"/><path d="M7 7.5h.01M7 16.5h.01"/>',
    },
  ],
  note: 'Not sure which fits? Talk to us and we will help you choose.',
};

/* ---------- The shared core: what every workspace has ---------- */
export const toolkit: ToolkitContent = {
  title: 'Built into every workspace',
  lede: 'These work the same on a campus, in an office and in an NGO, from the same records, so nothing is typed in twice.',
  tools: [
    { title: 'Attendance', body: 'One-tap check-in, with times from the server.', icon: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>' },
    { title: 'Leave', body: 'Requests, balances and approvals in one flow.', icon: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="m9 15 2 2 4-4"/>' },
    { title: 'Tasks and projects', body: 'Every task with an owner, a size and a due date.', icon: '<path d="M4 6h16M4 12h16M4 18h10"/><path d="m16 17 2 2 4-4"/>' },
    { title: 'Weekly plan', body: 'The week ahead for every team, Monday to Friday.', icon: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 4v16M13 4v16M18 4v16"/>' },
    { title: 'Reviews', body: 'Finished work is checked before it counts as done.', icon: '<path d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>' },
    { title: 'Team chat', body: 'A conversation for every team, with files and links.', icon: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>' },
    { title: 'Wiki', body: 'Policies, notes and how-tos, with every version kept.', icon: '<path d="M5 4h10l4 4v12H5z"/><path d="M14 4v5h5M8 13h8M8 17h6"/>' },
    { title: 'Reports', body: 'Delivery, people and projects, ready to share as a PDF.', icon: '<path d="M3 17l6-6 4 4 8-8"/><path d="M17 7h4v4"/>' },
  ],
};

export const closing: ClosingContent = {
  title: 'See Doptor running in your organisation',
  sub: "Book a demo and we'll walk you through it.",
  primary: DEMO,
  secondary: { label: 'Our Products', href: '/products/' },
};
