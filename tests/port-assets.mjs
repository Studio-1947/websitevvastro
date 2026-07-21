/**
 * One-shot asset port for the portfolio migration.
 *
 * Pulls case-study images out of the React project (studio-website) into this
 * site, and fixes two things that would otherwise bite in production:
 *
 *  1. Casing. Source folders are aiCrowd / fermylab / localFutures / remodelUN /
 *     villageWays. Windows resolves those case-insensitively, Linux (Vercel)
 *     does not — so mixed-case paths build clean locally and 404 once deployed.
 *     Everything is normalised to kebab-case.
 *  2. Spaces and unicode. 38 of 77 filenames contain spaces, em-dashes or
 *     apostrophes ("ADDI — Alzheimer's_Detection_Challenge.svg"), which have to
 *     be percent-encoded in URLs and are trivial to get wrong by hand.
 *
 * Raster images are converted to webp (the format the rest of the site uses);
 * svg/gif/video are copied verbatim. Writes asset-map.json so the page
 * conversion step can rewrite every `src` mechanically rather than by eye.
 *
 * Usage: node tests/port-assets.mjs [--dry]
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'D:/workcode/studiowebsite/studio-website/public';
const DEST = path.resolve(process.cwd(), 'public/assets/img/work');
const DRY = process.argv.includes('--dry');

/** Source folder → this site's work slug. */
const BRANDS = {
  'portfolio/aiCrowd': 'aicrowd',
  'portfolio/awch': 'awch',
  'portfolio/fermylab': 'fermy-lab',
  'portfolio/localFutures': 'local-futures',
  'portfolio/rajkamal': 'rajkamal-prakashan',
  'portfolio/remodelUN': 'remodel-un',
  'portfolio/villageWays': 'village-ways',
  'ourworks/mirikCollege': 'mirik-college',
};

const RASTER = new Set(['.png', '.jpg', '.jpeg', '.avif', '.webp']);
const VERBATIM = new Set(['.svg', '.gif', '.mp4', '.webm']);

/** "ADDI — Alzheimer's_Detection_Challenge" -> "addi-alzheimers-detection-challenge" */
function slugify(name) {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics
    .replace(/['’]/g, '') // apostrophes vanish rather than becoming dashes
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

const map = {};
let converted = 0;
let copied = 0;
let skipped = 0;

for (const [srcRel, slug] of Object.entries(BRANDS)) {
  const srcDir = path.join(SRC, srcRel);
  if (!fs.existsSync(srcDir)) {
    console.warn(`  ! missing source dir: ${srcRel}`);
    continue;
  }
  const outDir = path.join(DEST, slug);
  if (!DRY) fs.mkdirSync(outDir, { recursive: true });

  for (const file of fs.readdirSync(srcDir)) {
    const ext = path.extname(file).toLowerCase();
    const base = slugify(path.basename(file, path.extname(file)));
    const from = path.join(srcDir, file);
    if (!fs.statSync(from).isFile()) continue;

    let outName;
    if (RASTER.has(ext)) {
      outName = `${base}.webp`;
    } else if (VERBATIM.has(ext)) {
      outName = `${base}${ext}`;
    } else {
      skipped++;
      continue;
    }

    // Public URL both before (as referenced in the tsx) and after.
    map[`/${srcRel}/${file}`] = `/assets/img/work/${slug}/${outName}`;

    if (DRY) continue;
    const to = path.join(outDir, outName);
    if (RASTER.has(ext)) {
      await sharp(from).webp({ quality: 82 }).toFile(to);
      converted++;
    } else {
      fs.copyFileSync(from, to);
      copied++;
    }
  }
}

const mapPath = path.resolve(process.cwd(), 'tests/asset-map.json');
if (!DRY) fs.writeFileSync(mapPath, JSON.stringify(map, null, 2));

console.log(
  `${DRY ? '[dry] ' : ''}mapped=${Object.keys(map).length} converted=${converted} copied=${copied} skipped=${skipped}`,
);
if (!DRY) console.log(`map -> ${path.relative(process.cwd(), mapPath)}`);
