import { getCollection } from 'astro:content';
import { cleanName, SITE } from './seo';

/**
 * Search index builder — runs at build time and emits one static JSON file
 * (src/pages/search-index.json.ts). Every searchable page becomes one compact
 * record; body HTML is stripped to plain text at build time so the shipped
 * payload is as small as possible and the client never touches markup.
 *
 * The scale (22 portfolios + 4 products + 40+ blogs) is a few hundred KB of
 * text at most, so a single fetched-and-cached index with client-side scoring
 * is the right trade — no search service, no per-keystroke network calls.
 */

export interface SearchDoc {
  url: string;
  /** Display label used by the results UI ("Portfolio", "Blog", …). */
  type: string;
  title: string;
  description: string;
  /** Low-weight match field (tags, authors, clients, roles, …). */
  keywords: string;
  /** Full body text, lowercased + whitespace-collapsed, for term scoring. */
  text: string;
}

/** Strip HTML to plain text: drop tags/scripts/styles, decode a few entities,
 * collapse whitespace and lowercase (text is only ever matched, never shown). */
function toText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&mdash;|&ndash;/gi, '-')
    .replace(/&rsquo;|&lsquo;|&ldquo;|&rdquo;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/** Flatten a case study's modular sections into one searchable string. */
function sectionsText(sections: Array<Record<string, unknown>>): string {
  return sections
    .map((s) =>
      [
        s.heading,
        s.subheading,
        s.label,
        ...(Array.isArray(s.body) ? (s.body as string[]) : []),
        ...(Array.isArray(s.list) ? (s.list as string[]) : []),
        ...(Array.isArray(s.cards)
          ? (s.cards as { num?: string; title?: string; body?: string }[]).map(
              (c) => `${c.num ?? ''} ${c.title ?? ''} ${c.body ?? ''}`,
            )
          : []),
      ]
        .filter(Boolean)
        .join(' '),
    )
    .join(' ');
}

/** Non-collection pages — curated so the index still covers the whole site. */
const STATIC_PAGES: Array<Omit<SearchDoc, 'text'>> = [
  {
    url: '/',
    type: 'Page',
    title: 'Home',
    description: SITE.defaultDescription,
    keywords: 'home studio 1947 data design tech consulting darjeeling',
  },
  {
    url: '/about-us/',
    type: 'Page',
    title: 'About Studio 1947',
    description:
      'Meet Studio 1947 — designers, technologists, storytellers and researchers crafting accessible, affordable solutions from Darjeeling.',
    keywords: 'about team people story values founders studio 1947',
  },
  {
    url: '/our-work/',
    type: 'Page',
    title: 'Our Work',
    description:
      'Selected Studio 1947 projects — branding, marketing, web design, research and growth work for organisations across India and beyond.',
    keywords: 'portfolio work case studies projects showcase',
  },
  {
    url: '/blog/',
    type: 'Page',
    title: 'Blog',
    description:
      'Stories, ideas and perspectives from Studio 1947 — on traditional knowledge, design thinking, culture, craft and community from Darjeeling and beyond.',
    keywords: 'blog stories ideas perspectives articles writings',
  },
  {
    url: '/products/',
    type: 'Page',
    title: 'Products',
    description:
      'Doptor Campus, Office and NGO Manager, Aangan ERP, 1 Darjeeling and Pharma ERP — digital products crafted by Studio 1947 from Darjeeling.',
    keywords: 'products erp dashboards software tools saas',
  },
  {
    url: '/solutions/',
    type: 'Page',
    title: 'Solutions',
    description:
      'Studio 1947 solutions across Data, Design & Tech, Communication & Campaign, Research & Survey and Capacity Building.',
    keywords: 'solutions services data design tech research capacity building',
  },
  {
    url: '/careers/',
    type: 'Page',
    title: 'Careers',
    description:
      'Build what matters, together. Explore open roles at Studio 1947 and help us craft data, design and technology solutions from Darjeeling.',
    keywords: 'careers jobs hiring roles apply',
  },
  {
    url: '/initiatives/',
    type: 'Page',
    title: 'Initiatives',
    description:
      'Sirf Local and Local Archives — Studio 1947 initiatives empowering businesses and artisans across the Darjeeling hills with affordable data-design.',
    keywords: 'initiatives sirf local local archives community artisans',
  },
  {
    url: '/sayhello/',
    type: 'Page',
    title: 'Say Hello',
    description:
      "Say hello to Studio 1947 — let's co-create meaningful data, design and technology solutions. Reach our studio in Mirik, Darjeeling.",
    keywords: 'contact say hello get in touch reach out',
  },
  {
    url: '/accessibility-statement/',
    type: 'Page',
    title: 'Accessibility Statement',
    description: 'How Studio 1947 keeps this website accessible to everyone.',
    keywords: 'accessibility statement a11y inclusive',
  },
  {
    url: '/privacy-policy/',
    type: 'Page',
    title: 'Privacy Policy',
    description: 'How Studio 1947 collects, uses and protects your information.',
    keywords: 'privacy policy data protection cookies',
  },
  {
    url: '/terms-of-service/',
    type: 'Page',
    title: 'Terms of Service',
    description: 'The terms that govern your use of the Studio 1947 website.',
    keywords: 'terms of service terms conditions legal',
  },
  {
    url: '/labour-employment-policy/',
    type: 'Page',
    title: 'Labour & Employment Policy',
    description: 'Studio 1947’s policy on fair labour and employment practices.',
    keywords: 'labour employment policy hr fair work',
  },
];

export async function buildSearchIndex(): Promise<SearchDoc[]> {
  const docs: SearchDoc[] = [];

  // ── Portfolio / case studies ───────────────────────────────────────────
  for (const entry of await getCollection('work')) {
    if (entry.data.active === false) continue; // unfinished — hidden from grids too
    const d = entry.data;
    const html = 'html' in d ? (d.html as string | undefined) : undefined;
    const sections = Array.isArray(d.sections) ? d.sections : undefined;
    docs.push({
      url: `/work/${entry.id}/`,
      type: 'Portfolio',
      title: d.client || cleanName(d.title),
      description: d.description || '',
      keywords: [d.location, d.year, ...(d.tags ?? []), ...(d.credits ?? []).map((c) => c.members)]
        .filter(Boolean)
        .join(' '),
      text: toText(sections ? sectionsText(sections) : html || ''),
    });
  }

  // ── Blog posts ─────────────────────────────────────────────────────────
  for (const entry of await getCollection('blog')) {
    const d = entry.data;
    docs.push({
      url: `/blog/${entry.id}/`,
      type: 'Blog',
      title: d.heading || cleanName(d.title),
      description: d.description || '',
      keywords: [d.author, d.section].filter(Boolean).join(' '),
      text: toText(d.html),
    });
  }

  // ── Products / solutions / careers (skip noindex = still scaffolding) ──
  for (const [name, type] of [
    ['products', 'Product'],
    ['solutions', 'Solution'],
    ['careers', 'Career'],
  ] as const) {
    for (const entry of await getCollection(name)) {
      if (entry.data.noindex) continue;
      docs.push({
        url: `/${name}/${entry.id}/`,
        type,
        title: cleanName(entry.data.title),
        description: entry.data.description || '',
        keywords: name,
        text: toText(entry.data.html),
      });
    }
  }

  // ── Static pages ───────────────────────────────────────────────────────
  for (const p of STATIC_PAGES) docs.push({ ...p, text: '' });

  return docs;
}
