/*
 * Data for the live dashboard in the hero. It is a working copy of the Pharma
 * ERP home screen, drawn in HTML. Everything here is made up: the pharmacy,
 * its people, branches and numbers. Never put a real client's details here.
 * Imported by both the component (first render) and its script (updates).
 */

export interface Product {
  id: string;
  name: string;
  /** What one unit is: a strip, a bottle, a sachet. */
  unit: string;
  price: number;
}

export type StockStatus = 'ok' | 'low' | 'expiring';

/** One medicine in the inventory table. */
export interface StockItem {
  name: string;
  generic: string;
  sku: string;
  unit: string;
  drawer: string;
  mrp: number;
  qty: number;
  status: StockStatus;
  /** Over-the-counter, or a schedule H prescription medicine. */
  cls: 'OTC' | 'H';
}

/** Inventory summary panel: medicines below their minimum. */
export interface LowAlert { name: string; sku: string; qty: number; min: number }

/** Inventory summary panel: batches close to expiry. */
export interface ExpiryAlert { name: string; batch: string; days: number; qty: number }

/** Clinic Queue: one doctor's card. */
export interface Doctor {
  initials: string;
  name: string;
  specialty: string;
  /** Colour of the specialty pill. */
  tone: 'green' | 'blue' | 'violet';
  fee: number;
  cabin: string;
  days: string;
  hours: string;
  saturday: string;
  waiting: number;
}

/** The made-up pharmacy the demo belongs to. */
export const SHOP = {
  name: 'Your Pharmacy',
  tagline: 'Pharmacy ERP',
  user: 'User',
  initials: 'U',
  role: 'Owner',
  branches: ['Main Road Branch', 'Market Branch'],
};

/** Today's counters as the page opens; sales and bills grow as bills come in. */
export const START = { sales: 48260, invoices: 126, lowStock: 14, expiring: 6, transfers: 2, billNo: 4180 };

/** Clinic Queue counters as the page opens. */
export const QUEUE = { doctors: 4, waiting: 7, serving: 2, completed: 31, token: 23 };

/** Revenue for the last 14 days, oldest first, in rupees. The last day is today. */
export const REVENUE = [36200, 39800, 41500, 38900, 43200, 45800, 42100, 40600, 44900, 47300, 46100, 49800, 45200, 48260];

/** Amounts the counter rings up on its own while the page is idle. */
export const SAMPLE_BILLS = [183, 462, 230, 95, 610, 148, 354, 312, 820, 276];

export const PRODUCTS: Product[] = [
  { id: 'pcm', name: 'Paracetamol 650', unit: 'strip of 15', price: 30 },
  { id: 'ors', name: 'ORS sachets', unit: 'sachet', price: 22 },
  { id: 'cet', name: 'Cetirizine 10', unit: 'strip of 10', price: 35 },
  { id: 'pan', name: 'Pantoprazole 40', unit: 'strip of 15', price: 96 },
  { id: 'amx', name: 'Amoxicillin 500', unit: 'strip of 10', price: 118 },
  { id: 'vtc', name: 'Vitamin C chewables', unit: 'bottle', price: 45 },
];

export const STOCK: StockItem[] = [
  { name: 'Paracetamol 650', generic: 'Paracetamol', sku: 'MED10421', unit: 'strip', drawer: 'B3', mrp: 30, qty: 154, status: 'ok', cls: 'OTC' },
  { name: 'Amoxicillin 500', generic: 'Amoxicillin', sku: 'MED10377', unit: 'strip', drawer: 'A3', mrp: 118, qty: 22, status: 'expiring', cls: 'H' },
  { name: 'Cetirizine 10', generic: 'Cetirizine', sku: 'MED10198', unit: 'strip', drawer: 'A1', mrp: 35, qty: 6, status: 'low', cls: 'OTC' },
  { name: 'ORS sachets', generic: 'Oral rehydration salts', sku: 'MED10052', unit: 'sachet', drawer: 'D2', mrp: 22, qty: 48, status: 'expiring', cls: 'OTC' },
  { name: 'Pantoprazole 40', generic: 'Pantoprazole', sku: 'MED10610', unit: 'strip', drawer: 'C4', mrp: 96, qty: 4, status: 'low', cls: 'H' },
  { name: 'Azithromycin 500', generic: 'Azithromycin', sku: 'MED10733', unit: 'strip', drawer: 'A2', mrp: 124, qty: 60, status: 'ok', cls: 'H' },
  { name: 'Vitamin C chewables', generic: 'Ascorbic acid', sku: 'MED10915', unit: 'bottle', drawer: 'E1', mrp: 45, qty: 3, status: 'low', cls: 'OTC' },
];

export const LOW_ALERTS: LowAlert[] = [
  { name: 'Vitamin C chewables', sku: 'MED10915', qty: 3, min: 20 },
  { name: 'Pantoprazole 40', sku: 'MED10610', qty: 4, min: 30 },
  { name: 'Cetirizine 10', sku: 'MED10198', qty: 6, min: 25 },
];

export const EXPIRY_ALERTS: ExpiryAlert[] = [
  { name: 'Amoxicillin 500', batch: 'A-1180', days: 12, qty: 22 },
  { name: 'ORS sachets', batch: 'O-0912', days: 19, qty: 48 },
  { name: 'Paracetamol 650', batch: 'B-2291', days: 26, qty: 34 },
];

/** Made-up doctors for the Clinic Queue screen. */
export const DOCTORS: Doctor[] = [
  { initials: 'MT', name: 'Dr. Meera Thapa', specialty: 'General Medicine', tone: 'green', fee: 400, cabin: 'OPD Cabin 1', days: 'Mon - Fri', hours: '09:00 AM - 01:00 PM', saturday: '09:00 AM - 12:00 PM', waiting: 3 },
  { initials: 'AS', name: 'Dr. Arjun Sen', specialty: 'Paediatrics', tone: 'blue', fee: 500, cabin: 'OPD Cabin 2', days: 'Mon - Sat', hours: '10:00 AM - 02:00 PM', saturday: '10:00 AM - 01:00 PM', waiting: 2 },
  { initials: 'KI', name: 'Dr. Kavya Iyer', specialty: 'ENT', tone: 'violet', fee: 600, cabin: 'OPD Cabin 3', days: 'Tue - Sat', hours: '04:00 PM - 08:00 PM', saturday: '11:00 AM - 02:00 PM', waiting: 2 },
];


/** Billing: medicines each doctor usually prescribes, as product ids, for one-tap adding. */
export const USUAL: { doctor: string; specialty: string; products: string[] }[] = [
  { doctor: 'Dr. Meera Thapa', specialty: 'General Medicine · Cabin 1', products: ['pcm', 'cet', 'pan'] },
  { doctor: 'Dr. Arjun Sen', specialty: 'Paediatrics · Cabin 2', products: ['ors', 'vtc', 'amx'] },
];

/** Billing: bills already saved today, newest first. */
export const TODAYS_BILLS = [
  { who: 'Anil Gurung', ref: 'MRB-4180', amount: 412, time: '11:42 AM' },
  { who: 'Walk-in', ref: 'MRB-4179', amount: 96, time: '11:35 AM' },
  { who: 'Sunita Pradhan', ref: 'MRB-4178', amount: 1280, time: '11:21 AM' },
];

export type RxStatus = 'pending' | 'verified' | 'rejected';
export const PRESCRIPTIONS: { id: string; patient: string; doctor: string; items: number; date: string; status: RxStatus }[] = [
  { id: 'RX-2041', patient: 'Anil Gurung', doctor: 'Dr. Meera Thapa', items: 3, date: 'Today, 11:40 AM', status: 'pending' },
  { id: 'RX-2040', patient: 'Kiran Lama', doctor: 'Dr. Arjun Sen', items: 2, date: 'Today, 11:12 AM', status: 'pending' },
  { id: 'RX-2039', patient: 'Sunita Pradhan', doctor: 'Dr. Kavya Iyer', items: 4, date: 'Today, 10:58 AM', status: 'verified' },
  { id: 'RX-2038', patient: 'Rohan Tamang', doctor: 'Dr. Meera Thapa', items: 1, date: 'Today, 10:31 AM', status: 'verified' },
  { id: 'RX-2037', patient: 'Pema Sherpa', doctor: 'Dr. Arjun Sen', items: 2, date: 'Yesterday', status: 'rejected' },
  { id: 'RX-2036', patient: 'Neha Sharma', doctor: 'Dr. Kavya Iyer', items: 3, date: 'Yesterday', status: 'verified' },
];
export const RX_LABEL: Record<RxStatus, string> = { pending: 'Pending', verified: 'Verified', rejected: 'Rejected' };

/** Phone numbers are masked, as the product shows them to counter staff. */
export const PATIENTS = [
  { name: 'Anil Gurung', phone: '98XXX X4521', gender: 'Male', blood: 'B+', points: 42, since: 'Mar 2, 2026', due: 0 },
  { name: 'Sunita Pradhan', phone: '97XXX X1187', gender: 'Female', blood: 'O+', points: 118, since: 'Jan 14, 2026', due: 1240 },
  { name: 'Kiran Lama', phone: '90XXX X7730', gender: 'Male', blood: 'A+', points: 9, since: 'Aug 21, 2026', due: 0 },
  { name: 'Pema Sherpa', phone: '96XXX X3302', gender: 'Female', blood: 'AB+', points: 27, since: 'May 8, 2026', due: 0 },
  { name: 'Rohan Tamang', phone: '81XXX X9064', gender: 'Male', blood: 'O-', points: 64, since: 'Feb 19, 2026', due: 560 },
  { name: 'Neha Sharma', phone: '70XXX X2215', gender: 'Female', blood: 'B-', points: 15, since: 'Sep 30, 2026', due: 0 },
];

export const SUPPLIERS = [
  { code: 'NFMA', name: 'Northfield Medical Agency', place: 'Siliguri', stars: 3, outstanding: 18450 },
  { code: 'TPD', name: 'Teesta Pharma Distributors', place: 'Jalpaiguri', stars: 3, outstanding: 0 },
  { code: 'KDH', name: 'Kanchan Drug House', place: 'Siliguri', stars: 2, outstanding: 6320 },
  { code: 'VHS', name: 'Valley Health Supplies', place: 'Darjeeling', stars: 3, outstanding: 0 },
  { code: 'SMD', name: 'Summit Medico', place: 'Kalimpong', stars: 2, outstanding: 2980 },
  { code: 'RPD', name: 'Riverside Pharma Depot', place: 'Siliguri', stars: 3, outstanding: 0 },
];

export type Role = 'manager' | 'pharmacist' | 'doctor' | 'cashier';
export const ROLE_LABEL: Record<Role, string> = { manager: 'Shop Manager', pharmacist: 'Pharmacist', doctor: 'Doctor', cashier: 'Cashier' };
export const STAFF: { initials: string; name: string; role: Role; branch: string; joined: string }[] = [
  { initials: 'U', name: 'User', role: 'manager', branch: 'All branches', joined: 'Jan 4, 2026' },
  { initials: 'BT', name: 'Bikash Thapa', role: 'pharmacist', branch: 'Main Road Branch', joined: 'Jan 4, 2026' },
  { initials: 'SM', name: 'Sanjana Mukhia', role: 'pharmacist', branch: 'Market Branch', joined: 'Feb 11, 2026' },
  { initials: 'DG', name: 'Dawa Gurung', role: 'cashier', branch: 'Main Road Branch', joined: 'Mar 1, 2026' },
  { initials: 'MT', name: 'Dr. Meera Thapa', role: 'doctor', branch: 'Main Road Branch', joined: 'Mar 18, 2026' },
  { initials: 'AS', name: 'Dr. Arjun Sen', role: 'doctor', branch: 'Main Road Branch', joined: 'Apr 2, 2026' },
  { initials: 'KI', name: 'Dr. Kavya Iyer', role: 'doctor', branch: 'Market Branch', joined: 'Jun 9, 2026' },
];

export type TransferStatus = 'pending' | 'transit' | 'delivered';
export const TRANSFER_LABEL: Record<TransferStatus, string> = { pending: 'Awaiting approval', transit: 'In transit', delivered: 'Delivered' };
export const TRANSFERS: { id: string; from: string; to: string; items: number; status: TransferStatus; date: string }[] = [
  { id: 'TR-0112', from: 'Main Road', to: 'Market', items: 14, status: 'pending', date: 'Today' },
  { id: 'TR-0111', from: 'Market', to: 'Main Road', items: 6, status: 'pending', date: 'Today' },
  { id: 'TR-0110', from: 'Main Road', to: 'Market', items: 22, status: 'transit', date: 'Yesterday' },
  { id: 'TR-0109', from: 'Main Road', to: 'Market', items: 9, status: 'delivered', date: 'Oct 11' },
  { id: 'TR-0108', from: 'Market', to: 'Main Road', items: 4, status: 'delivered', date: 'Oct 9' },
];

/** Analytics: daily revenue for the last 30 days, oldest first. */
export const REVENUE_30 = [
  31200, 33800, 35100, 32400, 36900, 38200, 34700, 33300, 37800, 39600, 38100, 41200, 37700, 36400, 39900,
  42300, 40800, 43600, 41900, 39400, 42800, 45800, 42100, 40600, 44900, 47300, 46100, 49800, 45200, 48260,
];
export const PAYMENTS = [
  { label: 'UPI / Digital', share: 52, color: '#16B07F' },
  { label: 'Cash', share: 36, color: '#38B6D8' },
  { label: 'Card', share: 12, color: '#F5A524' },
];
export const TOP_PRODUCTS = [
  { name: 'Paracetamol 650', qty: 1840, revenue: 55200 },
  { name: 'Pantoprazole 40', qty: 412, revenue: 39552 },
  { name: 'Amoxicillin 500', qty: 286, revenue: 33748 },
  { name: 'Cetirizine 10', qty: 690, revenue: 24150 },
];

/** Reports: daily revenue for the last 90 days (60 gently rising days, then the 30 above). */
export const REVENUE_90 = [
  ...Array.from({ length: 60 }, (_, i) => Math.round(24000 + i * 120 + Math.sin(i / 2.6) * 2400)),
  ...REVENUE_30,
];

/** Reports: totals for each period, in days. */
export const PERIODS: Record<string, { revenue: number; invoices: number; gst: number }> = {
  '7': { revenue: 318400, invoices: 862, gst: 15920 },
  '14': { revenue: 611300, invoices: 1655, gst: 30565 },
  '30': { revenue: 1242700, invoices: 3368, gst: 62135 },
  '90': { revenue: 3561900, invoices: 9714, gst: 178095 },
};

/** Admin Console tiles. */
export const ADMIN = [
  { label: 'Users', value: '9', sub: '9 active · 0 inactive', icon: 'people' },
  { label: 'Super admins', value: '1', sub: 'Owner account', icon: 'shield' },
  { label: 'Branches', value: '2', sub: '2 active', icon: 'store' },
  { label: 'Active sessions', value: '6', sub: 'Across 4 devices', icon: 'key' },
  { label: 'Audit entries', value: '1,284', sub: '96 in the last 24h', icon: 'report' },
  { label: 'Medicines', value: '4,812', sub: '4,390 active', icon: 'stock' },
  { label: 'Batches expiring', value: '6', sub: 'within 30 days', icon: 'clock' },
  { label: 'Invoices today', value: '126', sub: '38,906 all time', icon: 'bill' },
] as const;
export const ROLES_COUNT = [
  { role: 'Owner', total: 1 },
  { role: 'Shop Manager', total: 1 },
  { role: 'Pharmacist', total: 2 },
  { role: 'Cashier', total: 2 },
  { role: 'Doctor', total: 3 },
];

export const STATUS_LABEL: Record<StockStatus, string> = { ok: 'Active', low: 'Low stock', expiring: 'Expires soon' };

export const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

/** ₹48K style, for chart axes. */
export const inrShort = (n: number) => (n >= 1000 ? `₹${Math.round(n / 1000)}K` : `₹${Math.round(n)}`);

/** Chart geometry, in the SVG's own units. Every chart uses the same box and stretches to fit. */
export const CHART = { w: 640, h: 200, pad: 6 };

/** The top of the chart's scale: a little above the best day, rounded up. */
export const chartMax = (values: number[]) => Math.ceil((Math.max(...values) * 1.1) / 10000) * 10000;

/** Axis labels, top to bottom. */
export const chartTicks = (values: number[]) => {
  const max = chartMax(values);
  return [1, 0.75, 0.5, 0.25, 0].map((f) => inrShort(max * f));
};

/** Points of the revenue line, scaled to the chart box. */
export function chartPoints(values: number[]): [number, number][] {
  const { w, h, pad } = CHART;
  const max = chartMax(values);
  const step = (w - pad * 2) / (values.length - 1);
  return values.map((v, i) => [pad + i * step, h - (v / max) * h]);
}

/** A smooth line through the points (Catmull-Rom turned into cubic Béziers). */
export function chartLine(values: number[]): string {
  const p = chartPoints(values);
  let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

/** The same line, closed down to the baseline, for the soft fill under it. */
export function chartArea(values: number[]): string {
  const { w, h, pad } = CHART;
  return `${chartLine(values)} L${(w - pad).toFixed(1)} ${h} L${pad} ${h} Z`;
}
