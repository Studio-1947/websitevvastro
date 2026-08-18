/**
 * SEO helpers — meta + JSON-LD generation.
 * The base shape is defined here in Phase 2; the JSON-LD builders (Organization
 * sitewide, Article on posts, Product/Service on work) are finalized in Phase 5.
 */

export const SITE = {
  name: 'Studio 1947',
  url: 'https://www.1947.io',
  defaultTitle: 'Data, Design & Tech Consulting | Studio 1947',
  defaultDescription:
    'Studio 1947 — crafting & co-creating data, design and technology solutions from Darjeeling. We understand, design, build and grow impactful solutions for organisations worldwide.',
  locale: 'en',
  logo: 'https://www.1947.io/assets/img/brand-mark.png',
  sameAs: [
    'https://www.instagram.com/1947.io/',
    'https://www.linkedin.com/company/studio-1947',
    'https://www.facebook.com/1947.io/',
  ],
} as const;

/**
 * Default Google Fonts href — the set 54 of 60 original pages loaded
 * (Syne + Google Sans 400/500/700). The homepage and the ERP product pages
 * override this with their own exact set via the `fontHref` prop.
 */
export const DEFAULT_FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Google+Sans:wght@400;500;700&family=Google+Sans+Flex:wght@400..700&family=Archivo:wght@800&display=swap';

/**
 * The latin subset of Syne — a variable font, so this ONE file covers every
 * weight (400–800) this site uses. Preloaded on pages whose font set includes
 * Syne so the hero/heading swap happens the moment the font arrives, instead
 * of waiting on the async stylesheet's 90+ @font-face blocks being parsed.
 * If Google ever bumps the version, the stale URL 404s (a console error, one
 * wasted request) and the stylesheet's own src takes over.
 */
export const SYNE_LATIN_URL = 'https://fonts.gstatic.com/s/syne/v24/8vIH7w4qzmVxm2BL9A.woff2';

export interface SeoProps {
  title?: string;
  description?: string;
  /** Open Graph title (falls back to `title`). */
  ogTitle?: string;
  /** Open Graph description (falls back to `description`). */
  ogDescription?: string;
  ogType?: 'website' | 'article' | 'product';
  /** Absolute or root-relative OG image. */
  image?: string;
  /** Pixel size of `image`, emitted as og:image:width/height. */
  imageSize?: { w: number; h: number };
  /** Alt text for the share card image. */
  imageAlt?: string;
  /** Root-relative path used to build the canonical URL. */
  path?: string;
  /** Extra JSON-LD objects to embed on the page. */
  jsonLd?: Record<string, unknown>[];
  /**
   * Keep the page out of search results. Used for pages that build and are
   * reachable by direct URL but are not ready to be found — currently the two
   * unwritten product pages, whose body copy is still TODO scaffolding.
   * Also excludes the page from the sitemap (see astro.config.mjs).
   */
  noindex?: boolean;
}

/** Build an absolute canonical URL from a root-relative path. */
export function canonicalUrl(path: string | undefined, sitePath: string): string {
  const p = path ?? sitePath;
  try {
    return new URL(p, SITE.url).href;
  } catch {
    return SITE.url + (p.startsWith('/') ? p : '/' + p);
  }
}

/** Absolute URL for an asset/image path. */
export function absoluteUrl(path: string | undefined): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//.test(path)) return path;
  return SITE.url + (path.startsWith('/') ? path : '/' + path);
}

/** Article JSON-LD — blog posts. */
export function articleJsonLd(opts: {
  headline: string;
  description?: string;
  image?: string;
  author?: string;
  url: string;
  section?: string;
  /** ISO date (YYYY-MM-DD). Emitted as datePublished, required for Article
   * rich results. */
  date?: string;
}): Record<string, unknown> {
  const o: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    author: opts.author
      ? { '@type': 'Person', name: opts.author }
      : { '@type': 'Organization', name: SITE.name },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: { '@type': 'ImageObject', url: SITE.logo },
    },
    mainEntityOfPage: opts.url,
    inLanguage: 'en',
  };
  if (opts.description) o.description = opts.description;
  if (opts.image) o.image = absoluteUrl(opts.image);
  if (opts.section) o.articleSection = opts.section;
  if (opts.date) o.datePublished = opts.date;
  return o;
}

/** Product JSON-LD — product detail pages. */
export function productJsonLd(opts: {
  name: string;
  description?: string;
  image?: string;
  url: string;
}): Record<string, unknown> {
  const o: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: opts.name,
    brand: { '@type': 'Brand', name: SITE.name },
    url: opts.url,
  };
  if (opts.description) o.description = opts.description;
  if (opts.image) o.image = absoluteUrl(opts.image);
  return o;
}

/** Service JSON-LD — work case studies & solution categories. */
export function serviceJsonLd(opts: {
  name: string;
  description?: string;
  url: string;
}): Record<string, unknown> {
  const o: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    provider: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    areaServed: 'Worldwide',
    url: opts.url,
  };
  if (opts.description) o.description = opts.description;
  return o;
}

/** Strip the " | Studio 1947…" suffix from a page <title> to get a clean name. */
export function cleanName(title: string): string {
  return title.split('|')[0].trim();
}

/**
 * "2025-06-04" → "Jun 4, 2025". Parsed as UTC so the build's local timezone
 * can never shift the day — the JSON-LD datePublished and the visible meta
 * must agree on the exact date.
 */
export function formatPostDate(iso: string): string {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * FAQPage JSON-LD. Only valid when the answers are visible on the page, which
 * they are — the accordion hides them with CSS, not from the DOM.
 */
export function faqJsonLd(
  items: { question: string; answer: string }[],
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.question,
      acceptedAnswer: { '@type': 'Answer', text: i.answer },
    })),
  };
}

/**
 * BreadcrumbList JSON-LD. `trail` is ordered root-first and excludes the
 * current page's own URL only if you omit its `path`.
 */
export function breadcrumbJsonLd(
  trail: { name: string; path: string }[],
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: new URL(t.path, SITE.url).href,
    })),
  };
}

/** Organization JSON-LD — embedded on every page. */
export function organizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    logo: SITE.logo,
    description: SITE.defaultDescription,
    sameAs: [...SITE.sameAs],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1/149 Manbir Thapa Road, Ward 4',
      addressLocality: 'Mirik',
      addressRegion: 'Darjeeling, West Bengal',
      postalCode: '734214',
      addressCountry: 'IN',
    },
  };
}
