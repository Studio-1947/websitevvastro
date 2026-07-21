/**
 * Side-by-side comparison: the source React page vs the migrated Astro page.
 *
 *   node tests/compare.mjs <slug|all> [desktop|tablet|mobile]
 *
 * Requires BOTH servers running:
 *   source : cd D:/workcode/studiowebsite/studio-website && npx vite --port 5174
 *   astro  : cd <this repo> && npx astro preview --port 8011
 *
 * NOTE this is deliberately NOT a pixel diff. The theme decision was to render
 * case studies in the site's own tokens (Syne 400, site greys) rather than the
 * source's Bricolage/font-black, so a pixel diff would flag every intentional
 * difference and bury the real ones. This stitches the two full pages together
 * so layout, order, grouping and spacing can be compared by eye, and prints the
 * structural counts that SHOULD match.
 */
import { chromium } from 'playwright';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'http://localhost:5174/portfolio';
const DST = 'http://localhost:4321/work';
const OUT = process.env.COMPARE_OUT || 'compare-out';

/** slug here -> route in the source SPA (note ai-crowd's hyphen). */
const ROUTES = {
  awch: 'awch',
  'fermy-lab': 'fermy-lab',
  'local-futures': 'local-futures',
  'mirik-college': 'mirik-college',
  'rajkamal-prakashan': 'rajkamal-prakashan',
  'remodel-un': 'remodel-un',
  'village-ways': 'village-ways',
  aicrowd: 'ai-crowd',
};

const VP = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
};

const arg = process.argv[2] || 'all';
const vpName = process.argv[3] || 'desktop';
const vp = VP[vpName];
const slugs = arg === 'all' ? Object.keys(ROUTES) : [arg];
if (!vp || slugs.some((s) => !ROUTES[s])) {
  console.error(`usage: node tests/compare.mjs <${Object.keys(ROUTES).join('|')}|all> [desktop|tablet|mobile]`);
  process.exit(1);
}

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();

/** Full-page shot with every lazy image forced in (see tests/shot.mjs). */
async function grab(url, file) {
  const page = await browser.newPage({ viewport: vp });
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(1500); // SPA route render
  await page.evaluate(() =>
    document.querySelectorAll('img[loading="lazy"]').forEach((i) => (i.loading = 'eager')),
  );
  await page.evaluate(async (step) => {
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
  }, vp.height);
  await page
    .waitForFunction(() => [...document.images].every((i) => i.complete), { timeout: 15000 })
    .catch(() => {});
  await page.screenshot({ path: file, fullPage: true });

  // Structural counts — these are what SHOULD line up between the two.
  // Scoped to the page body: the two sites have different headers and footers
  // (the source renders its nav logo twice, this site once), and counting that
  // chrome reports a phantom off-by-one on every page.
  const stats = await page.evaluate(() => {
    const root =
      document.querySelector('main.case-page') ||
      document.querySelector('article.portfolio-page') ||
      document.querySelector('main') ||
      document.body;
    return {
      h: document.body.scrollHeight,
      imgs: [...root.querySelectorAll('img')].filter((i) => i.naturalWidth > 0).length,
      h2: root.querySelectorAll('h2').length,
      h3: root.querySelectorAll('h3').length,
    };
  });
  await page.close();
  return stats;
}

console.log(`viewport: ${vpName} (${vp.width}x${vp.height})\n`);

for (const slug of slugs) {
  const a = path.join(OUT, `${slug}-${vpName}-source.png`);
  const b = path.join(OUT, `${slug}-${vpName}-astro.png`);
  let sa, sb;
  try {
    sa = await grab(`${SRC}/${ROUTES[slug]}`, a);
    sb = await grab(`${DST}/${slug}/`, b);
  } catch (e) {
    console.error(`${slug}: FAILED — ${e.message.split('\n')[0]}`);
    continue;
  }

  // Stitch: source left, astro right, padded to the taller of the two.
  const [ma, mb] = [await sharp(a).metadata(), await sharp(b).metadata()];
  const H = Math.max(ma.height, mb.height);
  const GAP = 24;
  const stitched = path.join(OUT, `${slug}-${vpName}-COMPARE.png`);
  await sharp({
    create: { width: ma.width + mb.width + GAP, height: H, channels: 3, background: '#333' },
  })
    .composite([
      { input: a, top: 0, left: 0 },
      { input: b, top: 0, left: ma.width + GAP },
    ])
    .png()
    .toFile(stitched);

  const d = (x, y) => {
    const pct = y ? (((x - y) / y) * 100).toFixed(0) : '0';
    return `${x} vs ${y} (${pct > 0 ? '+' : ''}${pct}%)`;
  };
  console.log(`${slug}`);
  console.log(`  height  ${d(sb.h, sa.h)}`);
  console.log(`  images  ${sb.imgs} vs ${sa.imgs}${sb.imgs !== sa.imgs ? '   <-- MISMATCH' : ''}`);
  console.log(`  h2/h3   ${sb.h2}/${sb.h3} vs ${sa.h2}/${sa.h3}`);
  console.log(`  -> ${stitched}\n`);
}

await browser.close();
console.log(`Done. Open the *-COMPARE.png files (source on the left, Astro on the right).`);
