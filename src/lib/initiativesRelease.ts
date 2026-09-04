/**
 * Initiatives page release gate.
 *
 * Same mechanism as the portfolio's RELEASED_WORK gate (see
 * lib/portfolioRelease.ts): on the live site, an initiative page whose slug
 * is NOT in RELEASED_INITIATIVES does not open. Clicking its link shows a
 * "Coming soon" popup, and visiting its URL directly shows a "Coming soon"
 * panel instead of the page. On local hosts (localhost, 127.0.0.1, *.local)
 * every page opens normally so it can be reviewed.
 *
 * Slugs match the top-level route: /local-design/, /fellowship/,
 * /workshops/. To release one: add its slug here and deploy.
 */
export const RELEASED_INITIATIVES: string[] = [];

/** The gated top-level routes. */
export const INITIATIVE_SLUGS = ['local-design', 'fellowship', 'workshops'];
