/**
 * Balance bottom-heavy case-study artwork.
 *
 * trim-bottom.mjs squares up the *canvas* — it crops empty margin outside the
 * card. But several assets are a faint white card that fills the canvas with
 * the actual artwork sitting high INSIDE it, leaving a dead band underneath.
 * Edge-to-edge those files measure symmetric, yet on the page they still read
 * as bottom-padded, because what the eye tracks is the ink, not the card.
 *
 * So crop the canvas until the space below the ink matches the space above it.
 * That does clip the card's bottom border, which is acceptable here: the card
 * is white-on-white with a hairline edge and is all but invisible against the
 * figure background.
 *
 * Only touches bottom-heavy images. Top-heavy ones are left alone — their
 * content runs to the bottom edge on purpose, and cropping the top would eat
 * into the artwork.
 *
 * Usage: node tests/balance-ink.mjs [--dry] [--min 5]
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const CONTENT = 'src/content/work';
const PUBLIC = 'public';
const DRY = process.argv.includes('--dry');
const INK = 40;
const MIN_SKEW = (() => {
  const i = process.argv.indexOf('--min');
  return i > -1 ? Number(process.argv[i + 1]) : 5; // percent
})();

const used = new Set();
for (const f of fs.readdirSync(CONTENT).filter((x) => x.endsWith('.json'))) {
  const d = JSON.parse(fs.readFileSync(path.join(CONTENT, f), 'utf8'));
  if (d.hero?.src) used.add(d.hero.src);
  (d.sections ?? []).forEach((s) => (s.media ?? []).forEach((m) => used.add(m.src)));
}

let n = 0;
for (const url of [...used].sort()) {
  if (!/\.(webp|png|jpe?g)$/i.test(url)) continue;
  const file = path.join(PUBLIC, url.replace(/^\//, ''));
  if (!fs.existsSync(file)) continue;

  const src = fs.readFileSync(file);
  const { data, info } = await sharp(src)
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
  if (first < 0) continue;

  const topPct = (first / h) * 100;
  const bottomPct = ((h - 1 - last) / h) * 100;
  if (bottomPct - topPct <= MIN_SKEW) continue; // balanced, or top-heavy

  // Mirror the top margin beneath the ink.
  const newHeight = Math.min(h, last + 1 + first);
  if (newHeight >= h) continue;

  console.log(
    `${url.split('/').slice(-2).join('/').padEnd(48)} ${h} -> ${newHeight}px  (below ink ${bottomPct.toFixed(0)}% -> ${topPct.toFixed(0)}%)`,
  );
  if (!DRY) {
    const buf = await sharp(src)
      .extract({ left: 0, top: 0, width: w, height: newHeight })
      .webp({ quality: 82 })
      .toBuffer();
    fs.writeFileSync(file, buf);
  }
  n++;
}

console.log(`\n${DRY ? '[dry] ' : ''}${n} image(s) balanced.`);
