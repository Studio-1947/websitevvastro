/** A call to action button. */
export interface Cta {
  label: string;
  href: string;
  /** Opens the site's contact modal instead of navigating. */
  contact?: boolean;
}

/** Anchor attributes for a CTA: external links open in a new tab. */
export function ctaAttrs(cta: Cta) {
  const external = /^https?:\/\//.test(cta.href);
  return {
    href: cta.href,
    target: external ? '_blank' : undefined,
    rel: external ? 'noopener' : undefined,
    'data-contact-open': cta.contact ? '' : undefined,
  };
}

export const DEMO: Cta = { label: 'Book a demo', href: '/sayhello/', contact: true };

/** Status colours, as the product uses them. */
export type Tone = 'green' | 'amber' | 'red' | 'pine';

/** One row of a mock table. `tone` tints the row; `note` is a small pill on it. */
export interface MockRow {
  cells: string[];
  tone?: Tone;
  note?: string;
}

/** A small piece of product UI, drawn in HTML. */
export interface Mock {
  title: string;
  tag: string;
  tagTone: Tone;
  head?: string[];
  rows: MockRow[];
  foot?: string;
}
