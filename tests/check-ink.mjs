/**
 * Report where the real "ink" sits inside every case-study image.
 *
 * check-whitespace.mjs trims at a low threshold, which stops at the soft edge
 * of a drop shadow or the border of a card drawn inside the asset. That is the
 * right measure for cropping safely, but it does NOT tell you whether the
 * artwork LOOKS bottom-heavy: a mockup can be perfectly symmetric edge-to-edge
 * while its logo sits high inside the card, which still reads as a gap.
 *
 * So scan raw pixels for the first and last row containing a pixel meaningfully
 * darker or more saturated than the background, and report those margins.
 *
 * Usage: node tests/check-ink.mjs [slug]
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const CONTENT = 'src/content/work';
const PUBLIC = 'public';
const only = process.argv[2];
const INK = 40; // how far from background a pixel must be to count as ink
const REPORT = 5; // report when |bottom-top| exceeds this % of height

const used = new Map(); // url -> slug
for (const f of fs.readdirSync(CONTENT).filter((x) => x.endsWith('.json'))) {
  const slug = path.basename(f, '.json');
  if (only && slug !== only) continue;
  const d = JSON.parse(fs.readFileSync(path.join(CONTENT, f), 'utf8'));
  if (d.hero?.src) used.set(d.hero.src, slug);
  (d.sections ?? []).forEach((s) => (s.media ?? []).forEach((m) => used.set(m.src, slug)));
}

const rows = [];
for (const [url, slug] of used) {
  if (!/\.(webp|png|jpe?g)$/i.test(url)) continue;
  const file = path.join(PUBLIC, url.replace(/^\//, ''));
  if (!fs.existsSync(file)) continue;

  // Flatten onto white so alpha behaves like the page does, then scan greyscale.
  const { data, info } = await sharp(fs.readFileSync(file))
    .flatten({ background: '#ffffff' })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h } = info;
  let first = -1;
  let last = -1;
  for (let y = 0; y < h; y++) {
    let hit = false;
    for (let x = 0; x < w; x += 2) {
      if (255 - data[y * w + x] > INK) { hit = true; break; }
    }
    if (hit) { if (first < 0) first = y; last = y; }
  }
  if (first < 0) continue; // blank image

  const top = Math.round((first / h) * 100);
  const bottom = Math.round(((h - 1 - last) / h) * 100);
  rows.push({ slug, file: path.basename(url), h, top, bottom, skew: bottom - top });
}

rows.sort((a, b) => b.skew - a.skew);
const bad = rows.filter((r) => Math.abs(r.skew) > REPORT);

console.log('ink margins as % of image height (T = above artwork, B = below)\n');
console.log('slug / file                                          T    B   skew  height');
for (const r of rows) {
  const flag = Math.abs(r.skew) > REPORT ? '  <--' : '';
  console.log(
    `${(r.slug + '/' + r.file).slice(0, 50).padEnd(50)}${String(r.top).padStart(3)} ${String(r.bottom).padStart(4)} ${String(r.skew).padStart(6)}  ${r.h}${flag}`,
  );
}
console.log(`\n${bad.length} of ${rows.length} image(s) skewed by more than ${REPORT}%.`);
console.log('Positive skew = more empty space BELOW the artwork than above.');
