// Run Lighthouse accessibility category across all key pages, print failures.
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { writeFileSync } from 'node:fs';

const BASE = 'http://localhost:4321';
const PAGES = [
  '/', '/about-us/', '/our-work/', '/initiatives/', '/sayhello/',
  '/blog/', '/blog/empathy-and-design/', '/blog/the-plow-story/', '/blog/sadhu/',
  '/work/aicrowd/', '/work/nest-homes/', '/work/healix/', '/work/fih/', '/work/rajkamal-prakashan/',
  '/work/awch/', '/work/bhagirath-homestays/', '/work/fermy-lab/', '/work/kulam-homestay/',
  '/work/local-futures/', '/work/mirik-college/', '/work/mohuna-media/', '/work/radha-madhav/',
  '/work/remodel-un/', '/work/village-ways/',
  '/products/', '/products/pharma-erp/',
  '/solutions/', '/solutions/data-design-tech/', '/solutions/capacity-building/',
  '/solutions/communication-campaign/', '/solutions/research-survey/',
  '/careers/', '/careers/software-engineer/', '/careers/marketing-manager/',
  '/accessibility-statement/', '/privacy-policy/', '/terms-of-service/',
  '/labour-employment-policy/',
];

const chrome = await chromeLauncher.launch({
  chromeFlags: ['--headless=new', '--no-sandbox'],
});

const results = [];
for (const path of PAGES) {
  try {
    const runner = await lighthouse(BASE + path, {
      logLevel: 'error', output: 'json', port: chrome.port,
      onlyCategories: ['accessibility'],
    });
    const report = JSON.parse(runner.report);
    const score = report.categories.accessibility.score;
    const failed = Object.values(report.audits).filter((a) =>
      a.scoreDisplayMode !== 'notApplicable' && a.scoreDisplayMode !== 'manual' &&
      a.score !== 1 && a.score !== null);
    results.push({ path, score, failed: failed.map((a) => ({ id: a.id, title: a.title, items: (a.details?.items || []).slice(0, 8) })) });
  } catch (e) {
    results.push({ path, score: null, failed: [], error: String(e).slice(0, 200) });
  }
}

try { await chrome.kill(); } catch (e) { /* windows cleanup noise */ }

writeFileSync('lh-pages-results.json', JSON.stringify(results, null, 1));

for (const r of results) {
  const pct = r.score === null ? 'ERR' : Math.round(r.score * 100);
  console.log(`\n=== ${r.path}  a11y=${pct}${r.error ? '  ' + r.error : ''}`);
  for (const f of r.failed) {
    console.log(`  FAIL ${f.id}: ${f.title}`);
    for (const it of f.items) {
      const keys = ['node', 'selector', 'snippet', 'target', 'nodeLabel'];
      const brief = keys.map((k) => it[k] !== undefined ? String(it[k]).replace(/\n/g, ' ').slice(0, 120) : null).filter(Boolean).join(' | ');
      console.log(`    - ${brief || JSON.stringify(it)}`);
    }
  }
}
