/**
 * Team members → the credit names used in src/content/work/*.json `credits`.
 * Keyed by the exact name the person modal resolves (data-fullname, else the
 * card's display name), lowercased — so credit links can target the same key
 * the modal looks up. Non-team names in credits (Tanisha, Mohanty, Zahid, …)
 * simply never match.
 *
 * Former members (Sankhadipta, Soumajit) are intentionally absent: they have
 * no profile on /about-us/ anymore, so their credits render as plain text.
 */
export const TEAM_CREDIT_KEYS: Record<string, string[]> = {
  'rabi (rabiul islam)': ['rabi'],
  'anjali chetri': ['anjali'],
  'subhendu kundu': ['subhendu'],
  santam: ['santam'],
  'soumic sarkar': ['soumic'],
  'nikhil raj subba': ['nikhil subba', 'nikhil raj'],
  'nikhil rai': ['nikhil rai'],
};

/**
 * Resolve one credit name (a comma-split member from work JSON) to the team
 * member key it refers to, or undefined when it is not a current team member.
 */
export function teamMemberKeyForCreditName(name: string): string | undefined {
  const n = name.trim().toLowerCase();
  if (!n) return undefined;
  for (const [member, keys] of Object.entries(TEAM_CREDIT_KEYS)) {
    if (keys.some((k) => n === k || n.startsWith(k + ' '))) return member;
  }
  return undefined;
}

/** Deep link to a member's profile dialog on the About page. */
export function teamMemberHref(memberKey: string): string {
  return `/about-us/?member=${encodeURIComponent(memberKey)}`;
}
