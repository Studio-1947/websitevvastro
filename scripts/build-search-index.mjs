/**
 * Rebuilds /search-index.json from the finished site in dist/, so the nav
 * search covers every page that was actually built: products with their own
 * component pages, initiatives, workshops, people, policies, the lot. Runs
 * after `astro build` (see package.json). The build-time endpoint in
 * src/pages/search-index.json.ts still serves the dev server.
 *
 * One record per page (title, description, type, keywords, body text), plus
 * one record per team member on the About page, so a name finds a person.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const OUT = join(DIST, 'search-index.json');

// Pages that are built but are not for finding: demos, scaffolding, assets.
const SKIP = [/^\/demos\//, /^\/assets\//, /^\/products\/aangar-erp\//, /^\/404/];

const TYPE_BY_PATH = [
  [/^\/work\//, 'Portfolio'],
  [/^\/blog\/.+/, 'Blog'],
  [/^\/products\/.+/, 'Product'],
  [/^\/solutions\/.+/, 'Solution'],
  [/^\/careers\/.+/, 'Career'],
];

const decode = (s) =>
  s
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&rsquo;|&lsquo;/gi, "'")
    .replace(/&ldquo;|&rdquo;/gi, '"')
    .replace(/&mdash;|&ndash;/gi, '-')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ');

const strip = (html) =>
  decode(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim();

const pick = (html, re) => {
  const m = html.match(re);
  return m ? strip(m[1]) : '';
};

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (f === 'index.html') out.push(p);
  }
  return out;
}

const docs = [];
for (const file of walk(DIST).sort()) {
  const url = file.slice(DIST.length - 1).replace(/index\.html$/, '');
  if (SKIP.some((re) => re.test(url))) continue;
  const html = readFileSync(file, 'utf8');

  const title = pick(html, /<title>([^<]*)<\/title>/).replace(/\s*\|\s*Studio 1947.*$/i, '');
  const h1 = pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/);
  const description = pick(html, /name="description" content="([^"]*)"/);
  const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0] ?? html;
  const type = TYPE_BY_PATH.find(([re]) => re.test(url))?.[1] ?? 'Page';
  // Headings carry the page's own vocabulary; they match before body text does.
  const headings = [...main.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi)].map((m) => strip(m[1])).join(' ');

  docs.push({
    url,
    type,
    // Blogs and case studies read best by their heading; everything else by its
    // <title>, since those pages' H1s are taglines ("Turn your data into decisions").
    title: url === '/' ? 'Home' : (type === 'Blog' || type === 'Portfolio') && h1 && h1.length <= 90 ? h1 : title || url,
    description,
    keywords: `${type} ${url.split('/').filter(Boolean).join(' ').replace(/-/g, ' ')} ${headings}`.toLowerCase(),
    text: strip(main).toLowerCase().slice(0, 5000),
  });

  // Team members: one record each, so searching a name finds the person.
  if (url === '/about-us/' || url === '/people/') {
    // Attributes may wrap onto several lines, so the tag pattern spans newlines.
    for (const m of main.matchAll(/<article[^>]*class="team-card[^"]*"[^>]*>([\s\S]*?)<\/article>/g)) {
      const card = m[1];
      const name = pick(card, /team-card__name">([\s\S]*?)<\/div>/);
      const role = pick(card, /team-card__role"[^>]*>([\s\S]*?)<\/div>/);
      const spec = pick(card, /team-card__spec"[^>]*>([\s\S]*?)<\/div>/);
      const bio = strip(card.match(/<div class="team-bio"[^>]*>([\s\S]*?)<\/div>\s*<\/article>|<div class="team-bio"[^>]*>([\s\S]*)$/)?.[0] ?? '');
      if (!name || /^you\b/i.test(name) || docs.some((d) => d.type === 'People' && d.title === name)) continue;
      docs.push({
        url: `${url}#team`,
        type: 'People',
        title: name,
        description: [role, spec].filter(Boolean).join(' · '),
        keywords: `people team ${name} ${role} ${spec}`.toLowerCase(),
        text: bio.toLowerCase().slice(0, 3000),
      });
    }
  }
}

writeFileSync(OUT, JSON.stringify(docs));
const by = {};
for (const d of docs) by[d.type] = (by[d.type] || 0) + 1;
console.log(`search index: ${docs.length} records`, by, `${(statSync(OUT).size / 1024).toFixed(0)} KB`);
