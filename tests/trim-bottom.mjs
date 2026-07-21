/**
 * Trim baked-in bottom whitespace from case-study artwork.
 *
 * A batch of Figma exports (fermy-lab, remodel-un) sit high on their artboard:
 * 12-19% of the canvas is empty at the bottom against 1-2% at the top. That
 * asymmetry reads on the page as a large unexplained gap under the image, and
 * CSS cannot remove it because the emptiness is inside the file.
 *
 * Crops the bottom so the lower margin mirrors the upper one — deliberately not
 * trimming to zero, since the top margin is the breathing room the designer
 * actually drew. Only touches images referenced by a case study, and only when
 * the asymmetry is large enough to be a mistake rather than a choice.
 *
 * Usage: node tests/trim-bottom.mjs [--dry]
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const CONTENT = 'src/content/work';
const PUBLIC = 'public';
const DRY = process.argv.includes('--dry');

/**
 * `--threshold` controls what counts as background.
 *   6  (default) stops at the soft drop-shadow edge — the conservative pass.
 *   20 sees through the shadow to the card's own border, so the leftover
 *      shadow margin can be cropped away too ("crop into the shadow").
 * Going higher starts eating the border itself, so 20 is the safe ceiling.
 */
const arg = (name, dflt) => {
  const i = process.argv.indexOf(name);
  return i > -1 ? Number(process.argv[i + 1]) : dflt;
};
const THRESHOLD = arg('--threshold', 6);
const MIN_ASYMMETRY = arg('--min-asymmetry', 8); // percentage points of (bottom - top)

// Only consider images a page actually renders.
const used = new Set();
for (const f of fs.readdirSync(CONTENT).filter((x) => x.endsWith('.json'))) {
  const d = JSON.parse(fs.readFileSync(path.join(CONTENT, f), 'utf8'));
  if (d.hero?.src) used.add(d.hero.src);
  (d.sections ?? []).forEach((s) => (s.media ?? []).forEach((m) => used.add(m.src)));
}

let done = 0;
for (const url of [...used].sort()) {
  if (!/\.(webp|png|jpe?g)$/i.test(url)) continue;
  const file = path.join(PUBLIC, url.replace(/^\//, ''));
  if (!fs.existsSync(file)) continue;

  // Read into memory up front: sharp keeps a handle on a file path, and on
  // Windows that blocks writing the result back to the same path.
  const src = fs.readFileSync(file);
  const meta = await sharp(src).metadata();
  let info;
  try {
    ({ info } = await sharp(src).trim({ threshold: THRESHOLD }).toBuffer({ resolveWithObject: true }));
  } catch {
    continue;
  }

  const top = -(info.trimOffsetTop ?? 0);
  const bottom = meta.height - info.height - top;
  const topPct = (top / meta.height) * 100;
  const bottomPct = (bottom / meta.height) * 100;
  if (bottomPct - topPct < MIN_ASYMMETRY) continue;

  // Keep a bottom margin equal to the top one.
  const newHeight = Math.min(meta.height, top + info.height + top);
  if (newHeight >= meta.height) continue;

  console.log(
    `${url.split('/').slice(-2).join('/').padEnd(46)} ${meta.height} -> ${newHeight}px  (bottom ${bottomPct.toFixed(0)}% -> ${topPct.toFixed(0)}%)`,
  );
  if (!DRY) {
    const buf = await sharp(src)
      .extract({ left: 0, top: 0, width: meta.width, height: newHeight })
      .webp({ quality: 82 })
      .toBuffer();
    fs.writeFileSync(file, buf);
  }
  done++;
}

console.log(`\n${DRY ? '[dry] ' : ''}${done} image(s) trimmed.`);
