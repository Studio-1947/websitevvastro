/**
 * Consistency check for migrated case studies.
 *
 * The portfolio pages were converted from a React project with a different
 * design system, so the failure modes are specific: leftover Tailwind class
 * names, un-rewritten /portfolio/ asset paths, and images referenced but never
 * ported. Catches all three plus the schema invariants the zod parse alone
 * would not (e.g. a section that renders as nothing).
 *
 * Usage: node tests/check-cases.mjs
 * Exits non-zero if anything fails, so it can gate a build.
 */
import fs from 'node:fs';
import path from 'node:path';

const DIR = 'src/content/work';
const PUBLIC = 'public';
const problems = [];
const rows = [];

/** Class-attribute soup and utility names that should never survive the port. */
const TAILWIND = /\b(className|class)=|\b(text-(xs|sm|base|lg|xl|\d?xl)|font-(black|bold|semibold)|bg-\[|text-\[|md:|lg:|rounded-(xl|2xl|3xl)|px-\d|py-\d|mb-\d|gap-\d)\b/;

for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith('.json'))) {
  const slug = path.basename(file, '.json');
  const raw = fs.readFileSync(path.join(DIR, file), 'utf8');

  let d;
  try {
    d = JSON.parse(raw);
  } catch (e) {
    problems.push(`${slug}: INVALID JSON — ${e.message}`);
    continue;
  }

  // Legacy entries still render through StructuredLayout; skip them.
  if (!Array.isArray(d.sections)) {
    rows.push({ slug, mode: 'legacy', sections: '-', imgs: '-', brand: '-' });
    continue;
  }

  // 1. No Tailwind / class attributes anywhere in the content.
  if (TAILWIND.test(raw)) {
    const hit = raw.match(TAILWIND);
    problems.push(`${slug}: Tailwind/class residue in content — matched "${hit[0]}"`);
  }

  // 2. No un-rewritten source asset paths.
  for (const bad of raw.matchAll(/"(\/(?:portfolio|ourworks)\/[^"]+)"/g)) {
    problems.push(`${slug}: un-mapped source asset path ${bad[1]}`);
  }

  // 3. Required top-level fields. `brand` is deliberately NOT required: pages
  //    with no defined brand colour should omit it and inherit the site red
  //    via --brand's fallback. Requiring it forced authors to hand-copy the
  //    red, which is the same value written twice and drifts on a rebrand.
  for (const k of ['title', 'client', 'hero']) {
    if (!d[k]) problems.push(`${slug}: missing "${k}"`);
  }
  if (d.brand && !/^#[0-9a-fA-F]{6}$/.test(d.brand)) {
    problems.push(`${slug}: brand "${d.brand}" is not a 6-digit hex`);
  }

  // 4. Every referenced image must exist on disk.
  const srcs = [];
  if (d.hero?.src) srcs.push(d.hero.src);
  d.sections.forEach((s) => (s.media ?? []).forEach((m) => srcs.push(m.src)));
  for (const s of srcs) {
    if (!fs.existsSync(path.join(PUBLIC, s.replace(/^\//, '')))) {
      problems.push(`${slug}: image not on disk — ${s}`);
    }
  }

  // 5. A section that renders no content at all is just an empty divider —
  //    usually a conversion slip. Every content-bearing field must be counted
  //    here, or a legitimately cards-only (or swatches-only) section is
  //    reported as broken and authors get pushed into contorting the data.
  d.sections.forEach((s, i) => {
    const empty =
      !s.heading &&
      !s.subheading &&
      !s.label &&
      !s.embed &&
      !(s.body ?? []).length &&
      !(s.cards ?? []).length &&
      !(s.swatches ?? []).length &&
      !(s.media ?? []).length;
    if (empty) problems.push(`${slug}: section[${i}] renders nothing`);
  });

  rows.push({ slug, mode: 'modular', sections: d.sections.length, imgs: srcs.length, brand: d.brand });
}

console.log('slug                    mode      sections  images  brand');
for (const r of rows.sort((a, b) => a.slug.localeCompare(b.slug))) {
  console.log(
    `${r.slug.padEnd(23)} ${String(r.mode).padEnd(9)} ${String(r.sections).padStart(8)} ${String(r.imgs).padStart(7)}  ${r.brand}`,
  );
}

console.log(
  `\n${rows.filter((r) => r.mode === 'modular').length} modular, ${rows.filter((r) => r.mode === 'legacy').length} legacy`,
);
if (problems.length) {
  console.error(`\n${problems.length} PROBLEM(S):`);
  problems.forEach((p) => console.error('  - ' + p));
  process.exit(1);
}
console.log('All checks passed.');
