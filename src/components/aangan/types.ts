/** One image slot from the aangan brief (section 6). `src` is optional: a slot
 *  without a file renders a labelled placeholder at the right ratio. */
export interface ImageSlot {
  id: string;
  /** "16:9", "4:5", ... */
  ratio: string;
  alt: string;
  src?: string;
  width?: number;
  height?: number;
}

/** A call to action button. */
export interface Cta {
  label: string;
  href: string;
  /** Opens the site's contact modal instead of navigating. */
  contact?: boolean;
}

/** The aangan product site every CTA points to. */
export const AANGAN_URL = 'https://aanganerp.in/';

/** Where hosts sign in to list a homestay, cafe or taxi. */
export const AANGAN_LIST_URL = 'https://aanganerp.in/login';

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
