/**
 * Detect baked-in whitespace around case-study artwork.
 *
 * Several assets are exported from Figma with the artboard larger than the
 * artwork, so the image carries its own transparent or white margin. On the
 * page that reads as unexplained padding — usually a heavy gap under the image
 * — and no amount of CSS fixes it, because the emptiness is inside the file.
 *
 * Trims each image and reports the margin found on each edge as a percentage
 * of the canvas, so real padding bugs can be told apart from CSS ones.
 *
 * Usage: node tests/check-whitespace.mjs [slug]
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = 'public/assets/img/work';
const only = process.argv[2];
const THRESHOLD = 4; // percent of an edge worth reporting

const dirs = fs
  .readdirSync(ROOT)
  .filter((d) => fs.statSync(path.join(ROOT, d)).isDirectory())
  .filter((d) => !only || d === only);

const findings = [];

for (const dir of dirs) {
  for (const file of fs.readdirSync(path.join(ROOT, dir))) {
    if (!/\.(webp|png|jpe?g)$/i.test(file)) continue;
    const full = path.join(ROOT, dir, file);
    let meta, tr;
    try {
      meta = await sharp(full).metadata();
      // trim() reports where the content actually starts/ends.
      tr = await sharp(full).trim({ threshold: 6 }).toBuffer({ resolveWithObject: true });
    } catch {
      continue;
    }

    const { width: tw, height: th, trimOffsetLeft = 0, trimOffsetTop = 0 } = tr.info;
    const left = -trimOffsetLeft;
    const top = -trimOffsetTop;
    const right = meta.width - tw - left;
    const bottom = meta.height - th - top;

    const pct = (v, total) => Math.round((v / total) * 100);
    const edges = {
      top: pct(top, meta.height),
      bottom: pct(bottom, meta.height),
      left: pct(left, meta.width),
      right: pct(right, meta.width),
    };
    const worst = Math.max(...Object.values(edges));
    if (worst >= THRESHOLD) {
      findings.push({ dir, file, edges, size: `${meta.width}x${meta.height}`, worst });
    }
  }
}

findings.sort((a, b) => b.worst - a.worst);

if (!findings.length) {
  console.log('No baked-in whitespace above threshold.');
} else {
  console.log('slug / file                                          T   B   L   R    canvas');
  for (const f of findings) {
    const e = f.edges;
    const mark = (v) => String(v).padStart(3);
    console.log(
      `${(f.dir + '/' + f.file).slice(0, 50).padEnd(50)}${mark(e.top)} ${mark(e.bottom)} ${mark(e.left)} ${mark(e.right)}   ${f.size}`,
    );
  }
  console.log(`\n${findings.length} image(s) with >=${THRESHOLD}% empty margin on some edge.`);
  console.log('High B = baked-in bottom padding; CSS cannot remove it, the asset must be trimmed.');
}
