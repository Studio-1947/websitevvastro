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
}

const CARD =
  /<a class="work-card"[^>]*href="\/work\/([^/"]+)\/"[\s\S]*?<img src="([^"]+)" alt="([^"]*)"[\s\S]*?<div class="work-tags">([\s\S]*?)<\/div>[\s\S]*?<h2 class="work-card__title">([^<]+)<\/h2>/g;

let cache: WorkCard[] | null = null;

function allWork(): WorkCard[] {
  if (cache) return cache;
  const html = readFileSync(
    join(process.cwd(), 'src/generated/our-work/main.html'),
    'utf8',
  );
  const cards: WorkCard[] = [];
  for (const m of html.matchAll(CARD)) {
    const [, slug, img, alt, tagBlock, title] = m;
    cards.push({
      slug,
      href: `/work/${slug}/`,
      img,
      alt: decode(alt),
      title: decode(title.trim()),
      tags: [...tagBlock.matchAll(/<span class="work-tag">([^<]+)<\/span>/g)].map((t) =>
        decode(t[1].trim()),
      ),
    });
  }
  cache = cards;
  return cards;
}

/** Every other project, in the order the portfolio index lists them. */
export function otherWork(excludeSlug?: string): WorkCard[] {
  return allWork().filter((c) => c.slug !== excludeSlug);
}
