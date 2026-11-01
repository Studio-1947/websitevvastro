/**
 * Pin colour by share: a pale red for the smallest share in view through to a
 * deep red for the biggest, so both colour and size carry the percentage.
 * `t` is the share relative to the biggest one shown (0–1).
 */
const LIGHT = [255, 160, 148];
const DEEP = [163, 0, 0];

export function shade(t: number): string {
  const k = Math.min(1, Math.max(0, t));
  const c = LIGHT.map((l, i) => Math.round(l + (DEEP[i] - l) * k));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

/** The two ends of the scale, for a legend. */
export const SHADE_RANGE = { light: shade(0), deep: shade(1) };
