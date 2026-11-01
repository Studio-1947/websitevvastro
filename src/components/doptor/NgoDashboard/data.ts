/**
 * Sample data for the Doptor NGO Manager demo on /products/doptor-erp/.
 * Everything here is invented for the preview: the organisation, projects,
 * places and numbers. Totals are kept consistent with each other (villages by
 * state add up to the headline figure, the fund split adds up to funds
 * utilised) so the screens agree with one another.
 */

export const ORG = { name: 'Sample Foundation', product: 'NGO Manager', user: 'Programme Admin', initials: 'PA', year: 'FY 2025-26' };

export type Tone = 'green' | 'blue' | 'amber' | 'red' | 'pink' | 'navy' | 'leaf';

export const KPIS: { label: string; value: string; note: string; icon: string; tone: Tone }[] = [
  { label: 'Villages covered', value: '1,284', note: '+18 this month', icon: 'home', tone: 'green' },
  { label: 'Beneficiaries', value: '4,87,320', note: '+12,430 this month', icon: 'people', tone: 'blue' },
  { label: 'Active projects', value: '156', note: '+11 this month', icon: 'folder', tone: 'amber' },
  { label: 'Women reached', value: '2,18,450', note: '44.8% of total', icon: 'person', tone: 'red' },
  { label: 'Funds utilised', value: '₹28.4 Cr', note: '78% of total funds', icon: 'rupee', tone: 'pink' },
  { label: 'SDGs addressed', value: '11 / 17', note: 'On track', icon: 'target', tone: 'navy' },
  { label: 'CO₂ reduced', value: '12,400 t', note: 'This year', icon: 'leaf', tone: 'leaf' },
];

export type Risk = 'High' | 'Medium' | 'Low';
export interface StateRow {
  name: string;
  abbr: string;
  lon: number;
  lat: number;
  villages: number;
  projects: number;
  beneficiaries: number;
  risk: Risk;
  sector: string;
}

/** Villages add up to 1,284 (the headline figure). */
export const STATES: StateRow[] = [
  { name: 'Rajasthan', abbr: 'RJ', lon: 73.9, lat: 26.6, villages: 284, projects: 34, beneficiaries: 112400, risk: 'High', sector: 'Water and sanitation' },
  { name: 'Madhya Pradesh', abbr: 'MP', lon: 78.2, lat: 23.5, villages: 212, projects: 31, beneficiaries: 84100, risk: 'Medium', sector: 'Education' },
  { name: 'Odisha', abbr: 'OD', lon: 85.0, lat: 20.6, villages: 190, projects: 20, beneficiaries: 71300, risk: 'Medium', sector: 'Livelihoods' },
  { name: 'Bihar', abbr: 'BR', lon: 85.6, lat: 25.8, villages: 178, projects: 26, beneficiaries: 68900, risk: 'High', sector: 'Health' },
  { name: 'Jharkhand', abbr: 'JH', lon: 85.4, lat: 23.6, villages: 156, projects: 21, beneficiaries: 59800, risk: 'High', sector: 'Livelihoods' },
  { name: 'Uttar Pradesh', abbr: 'UP', lon: 80.9, lat: 26.9, villages: 148, projects: 29, beneficiaries: 55200, risk: 'Medium', sector: 'Health' },
  { name: 'Chhattisgarh', abbr: 'CG', lon: 82.0, lat: 21.3, villages: 116, projects: 17, beneficiaries: 35620, risk: 'Low', sector: 'Environment' },
];

export type Status = 'Active' | 'Monitoring' | 'Completed';
export interface Project {
  name: string;
  place: string;
  state: string;
  sector: string;
  status: Status;
  beneficiaries: number;
  budget: number; // ₹ Cr
  spent: number; // ₹ Cr
  progress: number; // %
  team: string;
}

export const PROJECTS: Project[] = [
  { name: 'Rainwater harvesting', place: 'Barmer', state: 'Rajasthan', sector: 'Water', status: 'Active', beneficiaries: 10400, budget: 4.5, spent: 2.8, progress: 63, team: 'Team West' },
  { name: 'Women self-help group livelihoods', place: 'Kendujhar', state: 'Odisha', sector: 'Livelihoods', status: 'Active', beneficiaries: 2400, budget: 1.8, spent: 1.3, progress: 72, team: 'Team East' },
  { name: 'Village road connectivity', place: 'Gumla', state: 'Jharkhand', sector: 'Infrastructure', status: 'Monitoring', beneficiaries: 8000, budget: 2.1, spent: 2.0, progress: 98, team: 'Team East' },
  { name: 'Digital literacy for youth', place: 'Satna', state: 'Madhya Pradesh', sector: 'Education', status: 'Active', beneficiaries: 4200, budget: 1.2, spent: 0.5, progress: 43, team: 'Team Central' },
  { name: 'Solar pumps for farmers', place: 'Muzaffarpur', state: 'Bihar', sector: 'Energy', status: 'Monitoring', beneficiaries: 3100, budget: 2.6, spent: 2.2, progress: 85, team: 'Team North' },
  { name: 'Mother and child health camps', place: 'Bahraich', state: 'Uttar Pradesh', sector: 'Health', status: 'Completed', beneficiaries: 6800, budget: 1.5, spent: 1.5, progress: 100, team: 'Team North' },
  { name: 'Forest produce livelihoods', place: 'Bastar', state: 'Chhattisgarh', sector: 'Environment', status: 'Active', beneficiaries: 2900, budget: 0.9, spent: 0.3, progress: 31, team: 'Team Central' },
];

export const FEED: { title: string; detail: string; tag: string; time: string; icon: string; tone: Tone }[] = [
  { title: 'Field visit completed', detail: 'Barmer: water harvesting assessment', tag: 'Field visit', time: '2 min ago', icon: 'pin', tone: 'blue' },
  { title: 'Milestone reached', detail: 'Gumla road: 98% complete', tag: 'Milestone', time: '18 min ago', icon: 'flag', tone: 'green' },
  { title: 'Baseline survey submitted', detail: 'Satna: digital literacy, 412 households', tag: 'Survey', time: '1 hr ago', icon: 'clipboard', tone: 'amber' },
  { title: 'Fund release approved', detail: 'Solar pumps: ₹40 L second tranche', tag: 'Finance', time: '3 hr ago', icon: 'rupee', tone: 'pink' },
  { title: 'Resource gap alert', detail: 'Bahraich: medical supplies running low', tag: 'Alert', time: '5 hr ago', icon: 'alert', tone: 'red' },
];

/** Beneficiaries and women reached, in thousands, April to March. */
export const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
export const GROWTH = {
  beneficiaries: [312, 330, 344, 361, 379, 392, 410, 428, 441, 458, 474, 487],
  women: [131, 140, 147, 155, 164, 171, 180, 189, 196, 204, 211, 218],
};

/** Adds up to ₹28.4 Cr, the funds-utilised figure. */
export const FUNDS: { label: string; cr: number; color: string }[] = [
  { label: 'Programmes', cr: 17.04, color: '#1E8A55' },
  { label: 'Operations', cr: 5.68, color: '#2BA3D6' },
  { label: 'Capacity building', cr: 2.84, color: '#F2A93B' },
  { label: 'Monitoring and evaluation', cr: 1.42, color: '#D6336C' },
  { label: 'Others', cr: 1.42, color: '#9AA5A0' },
];

export const SECTORS: { label: string; share: number; color: string }[] = [
  { label: 'Livelihoods', share: 32, color: '#E08A1E' },
  { label: 'Education', share: 24, color: '#1F6FB2' },
  { label: 'Water and sanitation', share: 18, color: '#2BA3D6' },
  { label: 'Health', share: 14, color: '#D6336C' },
  { label: 'Environment', share: 8, color: '#1E8A55' },
  { label: 'Others', share: 4, color: '#9AA5A0' },
];

/** The 17 UN Sustainable Development Goals with their official colours. Progress is sample data; 0 = not addressed. */
export const SDGS: { n: number; name: string; color: string; progress: number; projects: number }[] = [
  { n: 1, name: 'No poverty', color: '#E5243B', progress: 68, projects: 34 },
  { n: 2, name: 'Zero hunger', color: '#DDA63A', progress: 72, projects: 26 },
  { n: 3, name: 'Good health', color: '#4C9F38', progress: 59, projects: 32 },
  { n: 4, name: 'Quality education', color: '#C5192D', progress: 81, projects: 41 },
  { n: 5, name: 'Gender equality', color: '#FF3A21', progress: 64, projects: 38 },
  { n: 6, name: 'Clean water', color: '#26BDE2', progress: 74, projects: 31 },
  { n: 7, name: 'Clean energy', color: '#FCC30B', progress: 45, projects: 14 },
  { n: 8, name: 'Decent work', color: '#A21942', progress: 57, projects: 29 },
  { n: 9, name: 'Industry and innovation', color: '#FD6925', progress: 0, projects: 0 },
  { n: 10, name: 'Reduced inequalities', color: '#DD1367', progress: 49, projects: 22 },
  { n: 11, name: 'Sustainable cities', color: '#FD9D24', progress: 0, projects: 0 },
  { n: 12, name: 'Responsible consumption', color: '#BF8B2E', progress: 0, projects: 0 },
  { n: 13, name: 'Climate action', color: '#3F7E44', progress: 42, projects: 18 },
  { n: 14, name: 'Life below water', color: '#0A97D9', progress: 0, projects: 0 },
  { n: 15, name: 'Life on land', color: '#56C02B', progress: 38, projects: 12 },
  { n: 16, name: 'Peace and justice', color: '#00689D', progress: 0, projects: 0 },
  { n: 17, name: 'Partnerships', color: '#19486A', progress: 0, projects: 0 },
];

export type ReportType = 'Donor' | 'M&E' | 'Field' | 'Finance' | 'Board';
export const REPORTS: { title: string; project: string; type: ReportType; date: string; status: 'Published' | 'Draft' | 'Due' }[] = [
  { title: 'Quarterly donor report, Q2', project: 'Rainwater harvesting', type: 'Donor', date: '12 Oct 2025', status: 'Published' },
  { title: 'Midline evaluation', project: 'Women self-help group livelihoods', type: 'M&E', date: '28 Oct 2025', status: 'Draft' },
  { title: 'Baseline survey summary', project: 'Digital literacy for youth', type: 'M&E', date: '03 Oct 2025', status: 'Published' },
  { title: 'Field visit report, Barmer block', project: 'Rainwater harvesting', type: 'Field', date: '30 Oct 2025', status: 'Published' },
  { title: 'Fund utilisation certificate', project: 'Solar pumps for farmers', type: 'Finance', date: '15 Nov 2025', status: 'Due' },
  { title: 'Endline evaluation', project: 'Mother and child health camps', type: 'M&E', date: '21 Sep 2025', status: 'Published' },
  { title: 'Monthly field activity summary', project: 'All Odisha projects', type: 'Field', date: '31 Oct 2025', status: 'Draft' },
  { title: 'Annual report 2024-25', project: 'All programmes', type: 'Board', date: '30 Jun 2025', status: 'Published' },
];

/** Theory of change, the chain each report traces. */
export const CHANGE = [
  { stage: 'Inputs', value: '₹36.5 Cr', note: 'Invested' },
  { stage: 'Activities', value: '1,248', note: 'Activities run' },
  { stage: 'Outputs', value: '2,89,450', note: 'Direct outputs' },
  { stage: 'Outcomes', value: '1,75,324', note: 'People benefited' },
  { stage: 'Impact', value: 'Lasting change', note: 'In 1,284 villages' },
];
