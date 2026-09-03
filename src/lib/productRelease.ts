/**
 * Product page release gate.
 *
 * Same mechanism as the portfolio's RELEASED_WORK gate (see
 * lib/portfolioRelease.ts): on the live site, a product whose slug is NOT in
 * RELEASED_PRODUCTS does not open. Clicking its card/link shows a
 * "Coming soon" popup, and visiting its URL directly shows a "Coming soon"
 * panel instead of the page. On local hosts (localhost, 127.0.0.1, *.local)
 * every product opens normally so it can be reviewed.
 *
 * To release a product: add its slug (the folder name under /products/)
 * here and deploy. Nothing else changes.
 */
export const RELEASED_PRODUCTS: string[] = [];
