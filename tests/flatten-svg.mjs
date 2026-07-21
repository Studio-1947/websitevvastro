/**
 * Rasterise "fake" SVGs to webp.
 *
 * Several case-study assets are Figma exports that wrap a full-resolution PNG
 * in a base64 data URI inside an <svg> shell. They carry none of SVG's benefits
 * (not scalable, not styleable) and all of PNG's weight — 47 MB across 19 files,
 * with two single images at 11 MB each. Browsers also decode them slowly enough
 * that they show as blank boxes on first paint.
 *
 * Genuine vector art (small line-art logos) is left alone; only files over the
 * threshold are converted. References in src/content/work/*.json are rewritten
 * to match, and the originals are deleted so they never reach the bundle.
 *
 * Usage: node tests/flatten-svg.mjs [--dry]
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = 'public/assets/img/work';
const CONTENT = 'src/content/work';
const THRESHOLD = 200 * 1024; // below this it is almost certainly real vector art
const MAX_WIDTH = 1600; // no case figure renders wider than the 1400px shell
const DRY = process.argv.includes('--dry');

const targets = [];
for (const dir of fs.readdirSync(ROOT)) {
  const d = path.join(ROOT, dir);
  if (!fs.statSync(d).isDirectory()) continue;
  for (const f of fs.readdirSync(d)) {
    if (!f.toLowerCase().endsWith('.svg')) continue;
    const full = path.join(d, f);
    if (fs.statSync(full).size >= THRESHOLD) targets.push(full);
  }
}

let before = 0;
let after = 0;
const rename = {}; // public URL .svg -> .webp

for (const svg of targets) {
  const webp = svg.replace(/\.svg$/i, '.webp');
  const sizeBefore = fs.statSync(svg).size;
  before += sizeBefore;

  if (!DRY) {
    // density bumps resvg's rasterisation DPI so embedded bitmaps stay sharp.
    await sharp(svg, { density: 150, unlimited: true })
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(webp);
    fs.unlinkSync(svg);
    after += fs.statSync(webp).size;
  }

  const toUrl = (p) => '/' + p.replace(/\\/g, '/').replace(/^public\//, '');
  rename[toUrl(svg)] = toUrl(webp);
  console.log(
    `${(sizeBefore / 1048576).toFixed(1)}MB -> ${DRY ? '?' : (fs.statSync(webp).size / 1024).toFixed(0) + 'KB'}  ${path.basename(svg)}`,
  );
}

// Rewrite every reference in the case-study content.
let edits = 0;
for (const f of fs.readdirSync(CONTENT).filter((x) => x.endsWith('.json'))) {
  const p = path.join(CONTENT, f);
  let raw = fs.readFileSync(p, 'utf8');
  const orig = raw;
  for (const [from, to] of Object.entries(rename)) raw = raw.split(from).join(to);
  if (raw !== orig) {
    if (!DRY) fs.writeFileSync(p, raw);
    edits++;
  }
}

console.log(
  `\n${DRY ? '[dry] ' : ''}${targets.length} files: ${(before / 1048576).toFixed(1)}MB -> ${(after / 1048576).toFixed(1)}MB` +
    (DRY ? '' : ` (saved ${(((before - after) / before) * 100).toFixed(1)}%)`),
);
console.log(`${edits} content file(s) rewritten`);
