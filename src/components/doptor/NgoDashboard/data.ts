/**
 * Sample data for the Doptor NGO Manager demo on /products/doptor-erp/.
 * Everything here is invented for the preview: the organisation, projects,
 * places and numbers. Totals are kept consistent with each other (villages by
 * state add up to the headline figure, the fund split adds up to funds
 * utilised) so the screens agree with one another.
 */

export const ORG = { name: 'Sample Foundation', product: 'NGO Manager', first: 'Ananya', user: 'Ananya Sharma', role: 'Super Admin', initials: 'AS', year: 'FY 2025-26' };

export type Tone = 'green' | 'blue' | 'amber' | 'red' | 'pink' | 'navy' | 'leaf' | 'purple';

export const KPIS: { label: string; value: string; note: string; icon: string; tone: Tone }[] = [
  { label: 'Villages covered', value: '1,284', note: '+18 this month', icon: 'home', tone: 'green' },
  { label: 'Beneficiaries', value: '4,87,320', note: '+12,430 this month', icon: 'people', tone: 'blue' },
  { label: 'Active projects', value: '156', note: '+11 this month', icon: 'folder', tone: 'amber' },
  { label: 'Women reached', value: '2,18,450', note: '44.8% of total', icon: 'venus', tone: 'pink' },
  { label: 'Funds utilised', value: '₹28.4 Cr', note: '78% of total funds', icon: 'rupee', tone: 'leaf' },
  { label: 'SDGs addressed', value: '11 / 17', note: 'On track', icon: 'sdg', tone: 'navy' },
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

export const FEED: { title: string; place: string; tag: string; time: string; photo: string; tone: Tone }[] = [
  { title: 'Field visit completed: water harvesting', place: 'Barmer, Rajasthan', tag: 'Field visit', time: '10 mins ago', photo: 'feed-field', tone: 'blue' },
  { title: '150 women trained in organic farming', place: 'Kendujhar, Odisha', tag: 'Success story', time: '1 hour ago', photo: 'feed-women', tone: 'green' },
  { title: 'Digital literacy centre opened', place: 'Satna, Madhya Pradesh', tag: 'Milestone', time: '3 hours ago', photo: 'feed-school', tone: 'navy' },
  { title: 'Mother and child health camp held', place: 'Bahraich, Uttar Pradesh', tag: 'Activity', time: '5 hours ago', photo: 'feed-health', tone: 'amber' },
];

/** Project clusters by district for the overview map. Each state's clusters add up to its project count. */
export const CLUSTERS: { place: string; lon: number; lat: number; n: number }[] = [
  { place: 'Barmer', lon: 71.4, lat: 25.75, n: 18 },
  { place: 'Jodhpur', lon: 73.0, lat: 26.9, n: 11 },
  { place: 'Udaipur', lon: 73.7, lat: 24.6, n: 5 },
  { place: 'Satna', lon: 80.8, lat: 24.6, n: 14 },
  { place: 'Bhopal', lon: 77.4, lat: 23.3, n: 9 },
  { place: 'Jabalpur', lon: 79.9, lat: 22.6, n: 8 },
  { place: 'Kendujhar', lon: 85.6, lat: 21.6, n: 16 },
  { place: 'Ganjam', lon: 84.8, lat: 19.6, n: 4 },
  { place: 'Muzaffarpur', lon: 85.4, lat: 26.1, n: 16 },
  { place: 'Gaya', lon: 85.0, lat: 24.8, n: 10 },
  { place: 'Gumla', lon: 84.5, lat: 23.0, n: 13 },
  { place: 'Dumka', lon: 87.25, lat: 24.3, n: 8 },
  { place: 'Bahraich', lon: 81.6, lat: 27.6, n: 17 },
  { place: 'Varanasi', lon: 83.0, lat: 25.3, n: 12 },
  { place: 'Bastar', lon: 81.9, lat: 19.2, n: 12 },
  { place: 'Raipur', lon: 81.6, lat: 21.25, n: 5 },
];
/** Map legend buckets, biggest first. */
export const BUCKETS: { label: string; min: number; color: string }[] = [
  { label: '16+', min: 16, color: '#E04A3F' },
  { label: '11 - 15', min: 11, color: '#F08A24' },
  { label: '6 - 10', min: 6, color: '#F2B632' },
  { label: '1 - 5', min: 1, color: '#3FA454' },
];

export const STORY = {
  photo: 'story-farmer',
  quote: 'Earlier we used to depend on rainwater. Now our farm produces year-round thanks to the irrigation project.',
  name: 'Sunita Devi',
  role: 'Farmer, Barmer, Rajasthan',
};

export const DONOR = { name: 'GreenFuture CSR Initiative', note: 'Supporting 24 projects across 5 states', amount: '₹12.8 Cr', label: 'Total contribution' };

export const ALERTS: { title: string; note: string; icon: string; tone: Tone }[] = [
  { title: '3 projects are behind schedule', note: 'Action required', icon: 'alert', tone: 'red' },
  { title: '2 districts need attention', note: 'Low progress', icon: 'clock', tone: 'amber' },
  { title: 'New government circular released', note: 'Programme guidelines', icon: 'info', tone: 'blue' },
];

export const QUICK: { label: string; icon: string; tone: Tone; go: string }[] = [
  { label: 'Add new project', icon: 'filePlus', tone: 'green', go: 'projects' },
  { label: 'Upload field report', icon: 'upload', tone: 'amber', go: 'reports' },
  { label: 'Add beneficiary', icon: 'userPlus', tone: 'blue', go: 'geography' },
  { label: 'Community feedback', icon: 'chat', tone: 'purple', go: 'reports' },
];

/** Beneficiaries, women reached and youth trained, in thousands, April to March. */
export const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
export const GROWTH = {
  beneficiaries: [312, 330, 344, 361, 379, 392, 410, 428, 441, 458, 474, 487],
  women: [131, 140, 147, 155, 164, 171, 180, 189, 196, 204, 211, 218],
  youth: [58, 64, 69, 77, 82, 90, 97, 105, 111, 120, 128, 136],
};

/** Adds up to ₹28.4 Cr, the funds-utilised figure. */
export const FUNDS: { label: string; short: string; cr: number; pct: number; color: string }[] = [
  { label: 'Programmes', short: 'Programmes', cr: 17.04, pct: 60, color: '#1E8A55' },
  { label: 'Operations', short: 'Operations', cr: 5.68, pct: 20, color: '#F2B632' },
  { label: 'Capacity building', short: 'Capacity', cr: 2.84, pct: 10, color: '#F08A24' },
  { label: 'Monitoring and evaluation', short: 'M&E', cr: 1.42, pct: 5, color: '#8B6AD6' },
  { label: 'Others', short: 'Others', cr: 1.42, pct: 5, color: '#BBA9EC' },
];

export const SECTORS: { label: string; share: number; icon: string; color: string }[] = [
  { label: 'Livelihoods', share: 32, icon: 'hut', color: '#B8730C' },
  { label: 'Education', share: 24, icon: 'book', color: '#D98A1A' },
  { label: 'Water & sanitation', share: 18, icon: 'drop', color: '#1F7FB2' },
  { label: 'Health', share: 14, icon: 'heart', color: '#D1373F' },
  { label: 'Environment', share: 8, icon: 'sprout', color: '#3F7E44' },
  { label: 'Others', share: 4, icon: 'dots', color: '#66736C' },
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
  { stage: 'Activities', value: '1,248', note: 'Activities' },
  { stage: 'Outputs', value: '2,89,450', note: 'Direct outputs' },
  { stage: 'Outcomes', value: '1,75,324', note: 'People benefited' },
  { stage: 'Impact', value: 'Sustainable change', note: 'In 1,284 villages' },
];

/* ---------- Communities ---------- */
export const COMMUNITY_TILES = [
  { label: 'Villages', value: '1,284' },
  { label: 'Households reached', value: '1,12,640' },
  { label: 'Self-help groups', value: '486' },
  { label: 'Community volunteers', value: '1,920' },
];
export const VILLAGES: { name: string; district: string; state: string; households: number; shgs: number; committee: string; engagement: number; visit: string }[] = [
  { name: 'Rampura', district: 'Barmer', state: 'Rajasthan', households: 412, shgs: 9, committee: 'Water user committee', engagement: 86, visit: '2 days ago' },
  { name: 'Kusumi', district: 'Kendujhar', state: 'Odisha', households: 338, shgs: 14, committee: 'Women farmers collective', engagement: 91, visit: 'Yesterday' },
  { name: 'Chainpur', district: 'Gumla', state: 'Jharkhand', households: 296, shgs: 7, committee: 'Road maintenance group', engagement: 74, visit: '5 days ago' },
  { name: 'Telgaon', district: 'Satna', state: 'Madhya Pradesh', households: 264, shgs: 6, committee: 'Youth learning circle', engagement: 68, visit: '1 week ago' },
  { name: 'Basantpur', district: 'Muzaffarpur', state: 'Bihar', households: 371, shgs: 11, committee: 'Farmer producer group', engagement: 79, visit: '3 days ago' },
  { name: 'Kotra', district: 'Bahraich', state: 'Uttar Pradesh', households: 452, shgs: 12, committee: 'Village health committee', engagement: 83, visit: 'Today' },
];
/** Share of beneficiaries in each group (groups overlap). */
export const REACH: { label: string; pct: number; color: string }[] = [
  { label: 'Women and girls', pct: 44.8, color: '#C2255C' },
  { label: 'Tribal communities', pct: 31, color: '#B8730C' },
  { label: 'Children under 14', pct: 22, color: '#1F7FB2' },
  { label: 'Youth, 15 to 29', pct: 18, color: '#6D4FC4' },
  { label: 'Elderly', pct: 9, color: '#3F7E44' },
  { label: 'Persons with disabilities', pct: 3.2, color: '#66736C' },
];
export const VOICES = [
  { quote: 'The committee meets every month now. We decide which handpump gets fixed first.', name: 'Meena Kumari', place: 'Rampura, Barmer' },
  { quote: 'Our group saved enough to buy a rice huller. Twelve families use it.', name: 'Sabita Munda', place: 'Kusumi, Kendujhar' },
];

/* ---------- Impact analytics ---------- */
export const INSIGHTS: { title: string; text: string; icon: string; tone: Tone }[] = [
  { title: 'Scale water projects in Rajasthan', text: 'Barmer harvesting cut water trips by 3x. Four more blocks match the same profile.', icon: 'bulb', tone: 'amber' },
  { title: 'Women participation rising', text: 'SHG enrolment in Odisha is up 18% over 3 months, tracking with income gains.', icon: 'trend', tone: 'green' },
  { title: '3 projects at risk of delay', text: 'Procurement delays in Jharkhand and Bihar. Action needed by 15 December.', icon: 'alert', tone: 'red' },
  { title: 'SDG 4 approaching target', text: 'Quality education is at 81%, on course for the year-end milestone.', icon: 'target', tone: 'blue' },
];
/** Sector coverage index (0-100), now and at baseline. */
export const RADAR = {
  axes: ['Health', 'Education', 'Water', 'Livelihood', 'Gender', 'Environment'],
  current: [62, 81, 74, 68, 64, 42],
  baseline: [38, 52, 41, 45, 36, 25],
};

/* ---------- Financial transparency ---------- */
export const FIN_TILES: { label: string; value: string; note: string; icon: string; tone: Tone }[] = [
  { label: 'Total received', value: '₹36.5 Cr', note: 'From 6 funders', icon: 'arrowDown', tone: 'green' },
  { label: 'Total disbursed', value: '₹28.4 Cr', note: 'To 156 projects', icon: 'arrowUp', tone: 'blue' },
  { label: 'Utilisation rate', value: '78%', note: 'Of funds received', icon: 'trend', tone: 'amber' },
  { label: 'Active donors', value: '6', note: '2 renewals due', icon: 'rupee', tone: 'purple' },
];
/** Received adds up to ₹36.5 Cr and used to ₹28.4 Cr. UC = utilisation certificate. */
export const GRANTS: { donor: string; project: string; received: number; used: number; uc: 'Submitted' | 'Due' | 'Not needed' }[] = [
  { donor: 'GreenFuture CSR Initiative', project: 'Rainwater harvesting', received: 12.8, used: 10.4, uc: 'Submitted' },
  { donor: 'State Rural Livelihood Mission', project: 'Women SHG livelihoods', received: 7.2, used: 5.9, uc: 'Submitted' },
  { donor: 'Sample Family Foundation', project: 'Digital literacy for youth', received: 5.5, used: 4.6, uc: 'Due' },
  { donor: 'Clean Energy Trust', project: 'Solar pumps for farmers', received: 4.0, used: 3.1, uc: 'Due' },
  { donor: 'Health Partners Fund', project: 'Mother and child health camps', received: 3.6, used: 2.6, uc: 'Submitted' },
  { donor: 'Individual donors', project: 'Unrestricted', received: 3.4, used: 1.8, uc: 'Not needed' },
];
/** Monthly disbursement in ₹ Cr, April to March. Adds up to ₹28.4 Cr. */
export const DISBURSED = [1.6, 1.9, 2.1, 2.3, 2.2, 2.5, 2.6, 2.4, 2.5, 2.6, 2.7, 3.0];

/* ---------- Participation ---------- */
export const PART_TILES = [
  { label: 'Open surveys', value: '2', tone: 'pink' as Tone },
  { label: 'Households responded', value: '231', tone: 'amber' as Tone },
  { label: 'Completed this month', value: '3', tone: 'green' as Tone },
  { label: 'Feedback received', value: '48', tone: 'blue' as Tone },
];
/** Responses add up to 231, the households-responded figure. */
export const SURVEYS = [
  { title: 'Drinking water survey', place: 'Barmer, Rajasthan', closes: 'Closes 30 Nov', responded: 143, target: 342, reward: '₹50 mobile recharge' },
  { title: 'Women empowerment feedback', place: 'Kendujhar, Odisha', closes: 'Closes 15 Dec', responded: 88, target: 342, reward: 'Village recognition' },
];
export const FEEDBACK: { kind: 'Suggestion' | 'Grievance' | 'Appreciation'; text: string; place: string; status: 'New' | 'In review' | 'Resolved'; time: string }[] = [
  { kind: 'Grievance', text: 'Handpump near the school has been dry for a week.', place: 'Rampura, Barmer', status: 'In review', time: '2 hr ago' },
  { kind: 'Suggestion', text: 'Hold the evening class after harvest, not before.', place: 'Telgaon, Satna', status: 'New', time: '5 hr ago' },
  { kind: 'Appreciation', text: 'Health camp staff stayed until every mother was seen.', place: 'Kotra, Bahraich', status: 'Resolved', time: 'Yesterday' },
  { kind: 'Grievance', text: 'Seed kits arrived after the sowing window.', place: 'Basantpur, Muzaffarpur', status: 'Resolved', time: '2 days ago' },
  { kind: 'Suggestion', text: 'Add a second SHG meeting day for working women.', place: 'Kusumi, Kendujhar', status: 'In review', time: '3 days ago' },
];
export const MEETINGS = [
  { day: '08', month: 'Nov', title: 'Gram sabha: water budget', place: 'Rampura, Barmer' },
  { day: '12', month: 'Nov', title: 'SHG federation meeting', place: 'Kusumi, Kendujhar' },
  { day: '19', month: 'Nov', title: 'Road social audit', place: 'Chainpur, Gumla' },
];

/* ---------- Alerts ---------- */
export type Severity = 'Critical' | 'Warning' | 'Info' | 'Success';
export const ALERT_LIST: { sev: Severity; cat: 'Field' | 'Finance' | 'SDG' | 'Project' | 'Reporting' | 'Community'; title: string; detail: string; time: string; action: string }[] = [
  { sev: 'Critical', cat: 'Field', title: 'Medical supplies running low', detail: 'Mother and child health camps, Bahraich. Stock lasts 4 days.', time: '5 hr ago', action: 'Raise request' },
  { sev: 'Warning', cat: 'Project', title: '3 projects are behind schedule', detail: 'Digital literacy, Satna; forest produce, Bastar; solar pumps, Muzaffarpur.', time: 'Today', action: 'Review' },
  { sev: 'Warning', cat: 'Finance', title: 'Utilisation certificate due in 13 days', detail: 'Solar pumps for farmers, Clean Energy Trust grant.', time: 'Today', action: 'Prepare' },
  { sev: 'Warning', cat: 'SDG', title: 'SDG 13 progress below plan', detail: 'Climate action at 42% against a 55% mid-year target.', time: 'Yesterday', action: 'View SDG' },
  { sev: 'Info', cat: 'Reporting', title: 'New government circular released', detail: 'Revised programme reporting guidelines from 1 December.', time: 'Yesterday', action: 'Read' },
  { sev: 'Success', cat: 'Project', title: 'Gumla road 98% complete', detail: 'Village road connectivity, Jharkhand. Handover planned.', time: '18 min ago', action: 'Open' },
  { sev: 'Success', cat: 'Field', title: 'Baseline survey submitted', detail: 'Digital literacy, Satna: 412 households covered.', time: '1 hr ago', action: 'Open' },
  { sev: 'Success', cat: 'Community', title: 'Water survey passed 40% response', detail: '143 of 342 households in Barmer have answered.', time: '3 hr ago', action: 'Open' },
];

/* ---------- Settings ---------- */
export const PROFILE = { email: 'ananya@example.org', phone: '+91 90000 12345', org: 'Sample Foundation' };
export const ROLES = [
  { role: 'Super admin', people: 2, access: 'Everything, including billing and roles' },
  { role: 'Programme manager', people: 8, access: 'Projects, reports and team in their states' },
  { role: 'Field officer', people: 46, access: 'Field visits, surveys and beneficiary records' },
  { role: 'Finance', people: 4, access: 'Grants, disbursement and certificates' },
  { role: 'Donor viewer', people: 6, access: 'Read-only view of the grants they fund' },
];
export const NOTIFY = [
  { label: 'Field updates', note: 'Visits, surveys and milestones as they happen', on: true },
  { label: 'Finance alerts', note: 'Releases, certificates and budget overruns', on: true },
  { label: 'Weekly summary email', note: 'Every Monday at 9 am', on: true },
  { label: 'SMS for critical alerts', note: 'Only for alerts marked critical', on: false },
];
export const LANGUAGES = ['English', 'हिन्दी Hindi', 'বাংলা Bengali', 'ଓଡ଼ିଆ Odia', 'नेपाली Nepali'];
