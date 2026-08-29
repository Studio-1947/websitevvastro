/**
 * The portfolio cards shown at the foot of a case study.
 *
 * /our-work/ is still a hand-authored HTML page (src/generated/our-work), and
 * it is the only place the thumbnails, tags and card titles live. Rather than
 * copy that list into a second file that would drift, the cards are read back
 * out of that markup at build time, so adding a project to the index adds it
 * to every case page's rail too.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** The index page is HTML, so its text arrives entity-encoded. */
function decode(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

export interface WorkCard {
  slug: string;
  href: string;
  title: string;
  img: string;
  alt: string;
  tags: string[];
  /**
   * The card's meta line on /our-work/ (location, reach, year), in order, as
   * the listing's own `<svg>` + text markup so the icons travel with it. The
   * listing is a file in this repo, so rendering it verbatim is safe.
   */
  meta: string[];
}

const CARD =
  /<a class="work-card"[^>]*href="\/work\/([^/"]+)\/"[\s\S]*?<img src="([^"]+)" alt="([^"]*)"[\s\S]*?<div class="work-tags">([\s\S]*?)<\/div>[\s\S]*?<h2 class="work-card__title">([^<]+)<\/h2>[\s\S]*?<div class="work-card__meta">([\s\S]*?)<\/div>/g;

let cache: WorkCard[] | null = null;

function allWork(): WorkCard[] {
  if (cache) return cache;
  const html = readFileSync(
    join(process.cwd(), 'src/generated/our-work/main.html'),
    'utf8',
  );
  const cards: WorkCard[] = [];
  for (const m of html.matchAll(CARD)) {
    const [, slug, img, alt, tagBlock, title, metaBlock] = m;
    cards.push({
      slug,
      href: `/work/${slug}/`,
      img,
      alt: decode(alt),
      title: decode(title.trim()),
      tags: [...tagBlock.matchAll(/<span class="work-tag">([^<]+)<\/span>/g)].map((t) =>
        decode(t[1].trim()),
      ),
      meta: [...metaBlock.matchAll(/<span>([\s\S]*?)<\/span>/g)].map((t) => t[1].trim()),
    });
  }
  cache = cards;
  return cards;
}

/**
 * The same listing with every card turned from a link into a plain card:
 * `<a class="work-card" href>` becomes `<div class="work-card work-card--soon">`
 * (styled as not-a-link in style.css). Applied to the production build while
 * the case studies are reworked; `astro dev` keeps the links.
 */
export function unlinkWorkCards(html: string): string {
  return html
    .replace(
      /<a class="work-card" href="(\/work\/[^"]+)">/g,
      '<div class="work-card work-card--soon" data-href="$1" aria-disabled="true">',
    )
    .replace(/\n {8}<\/a>(?=\n)/g, '\n        </div>');
}

/** Whether case cards link through: only under `astro dev` for now. */
export const workCardsLinked: boolean = import.meta.env.DEV;

/** Every other project, in the order the portfolio index lists them. */
export function otherWork(excludeSlug?: string): WorkCard[] {
  return allWork().filter((c) => c.slug !== excludeSlug);
}
