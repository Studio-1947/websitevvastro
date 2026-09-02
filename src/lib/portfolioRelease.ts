/**
 * Portfolio release gate.
 *
 * Case studies are being corrected and published one at a time. On the live
 * site, a case whose slug is NOT in RELEASED_WORK does not open: clicking its
 * card shows a "Coming soon" popup, and visiting its URL directly shows a
 * "Coming soon" panel instead of the page. On local hosts (localhost,
 * 127.0.0.1, *.local) every case opens normally so it can be reviewed.
 *
 * To release a case: add its slug (the folder name under /work/) here and
 * deploy. Nothing else changes.
 */
export const RELEASED_WORK: string[] = [
  'nest-homes',
  'rajkamal-prakashan',
];

/** Hostnames where the gate is switched off. */
export const LOCAL_HOSTS = ['localhost', '127.0.0.1', '::1', '[::1]'];
