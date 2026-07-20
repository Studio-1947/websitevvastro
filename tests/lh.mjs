import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { chromium } from 'playwright';
import fs from 'node:fs';

const CHROME = chromium.executablePath();
const BASE = process.env.LH_BASE || 'http://127.0.0.1:8001';
const ROUTES = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['/', '/blog/litti-chokha/', '/work/healix/', '/products/aangar-erp/', '/solutions/', '/privacy-policy/'];

const chrome = await chromeLauncher.launch({
  chromePath: CHROME,
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
});

const opts = {
  port: chrome.port,
  output: 'json',
  logLevel: 'error',
  onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  formFactor: 'desktop',
  screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
  throttlingMethod: 'simulate',
};

const rows = [];
for (const r of ROUTES) {
  try {
    const runnerResult = await lighthouse(BASE + r, opts);
    const c = runnerResult.lhr.categories;
    const s = (k) => Math.round((c[k].score ?? 0) * 100);
    const row = { route: r, perf: s('performance'), a11y: s('accessibility'), bp: s('best-practices'), seo: s('seo') };
    rows.push(row);
    console.log(`${r.padEnd(28)} perf=${row.perf}  a11y=${row.a11y}  best=${row.bp}  seo=${row.seo}`);
  } catch (e) {
    console.log(`${r.padEnd(28)} ERROR ${String(e).slice(0, 100)}`);
    rows.push({ route: r, error: String(e).slice(0, 120) });
  }
}
fs.writeFileSync(new URL('../../lighthouse.json', import.meta.url), JSON.stringify(rows, null, 1));
console.log('\nsaved lighthouse.json');
try { await chrome.kill(); } catch { /* Windows temp-cleanup EPERM is harmless */ }
process.exit(0);
