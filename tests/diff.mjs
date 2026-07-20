// Visual parity diff harness: screenshots every route on the original static
// site (:8000) and the Astro build (:8001), neutralizes animation, and pixel-
// diffs them. Usage: node tests/diff.mjs [desktop|tablet|mobile] [route,route,...]
import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '../dist');
const OUT = path.resolve(__dirname, '../../', 'diff-out');
const ORIG = 'http://127.0.0.1:8000';
const ASTRO = 'http://127.0.0.1:8001';

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
};

const vpName = process.argv[2] || 'desktop';
const vp = VIEWPORTS[vpName];
const routeArg = process.argv[3];

// discover routes from dist
function discover() {
  const routes = [];
  const walk = (dir, base) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) walk(path.join(dir, e.name), base + e.name + '/');
      else if (e.name === 'index.html') routes.push(base || '/');
    }
  };
  walk(DIST, '/');
  return routes.sort();
}
let routes = discover();
if (routeArg) routes = routeArg.split(',');

const PREP_CSS = `
  *,*::before,*::after{animation:none!important;transition:none!important;animation-duration:0s!important;}
  html{scroll-behavior:auto!important;}
  .reveal{opacity:1!important;transform:none!important;}
  [data-stagger]>*{opacity:1!important;transform:none!important;}
  [data-hero-aurora]{visibility:hidden!important;}
  .footer__live{display:none!important;}
`;

async function freeze(page) {
  await page.addStyleTag({ content: PREP_CSS });
  await page.evaluate(() => {
    // stop all timers (stepper / cocreate / carousel / clock) for a stable frame
    const hi = setTimeout(() => {}, 0);
    for (let i = 1; i < hi + 1; i++) { clearInterval(i); clearTimeout(i); }
    // reset any auto-cycling components to their initial state
    const reset = (sel) =>
      document.querySelectorAll(sel).forEach((el, i) => el.classList.toggle('is-active', i === 0));
    reset('.astep__item');
    reset('.commit__slide');
    reset('.cocreate__line');
    // Freeze any hero videos to their first frame so frame-timing isn't a diff.
    document.querySelectorAll('video').forEach((v) => { try { v.pause(); v.currentTime = 0; } catch {} });
    // The FAQ accordion captures its open panel's max-height at DOMContentLoaded
    // (before webfonts load), so the value is font-timing dependent on both
    // sites. Re-measure now (post-font) so both are compared at the same state.
    document.querySelectorAll('.faq__item.is-open .faq__a').forEach((a) => {
      a.style.maxHeight = a.scrollHeight + 'px';
    });
  });
  await page.waitForTimeout(120);
}

async function shot(page, url, file) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  // Wait for webfonts to be fully loaded AND laid out before capturing.
  try {
    await page.evaluate(async () => {
      if (document.fonts) { await document.fonts.ready; await document.fonts.load('500 120px "Google Sans"').catch(() => {}); }
    });
  } catch {}
  // trigger lazy images
  await page.evaluate(async () => {
    await new Promise((res) => {
      let y = 0;
      const step = () => {
        window.scrollTo(0, y);
        y += window.innerHeight;
        if (y < document.body.scrollHeight) requestAnimationFrame(step);
        else { window.scrollTo(0, 0); setTimeout(res, 150); }
      };
      step();
    });
  });
  await freeze(page);
  await page.waitForTimeout(200);
  await page.screenshot({ path: file, fullPage: true });
}

function loadPNG(f) { return PNG.sync.read(fs.readFileSync(f)); }
function crop(png, w, h) {
  if (png.width === w && png.height === h) return png;
  const out = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const si = (png.width * y + x) << 2;
      const di = (w * y + x) << 2;
      out.data[di] = png.data[si]; out.data[di + 1] = png.data[si + 1];
      out.data[di + 2] = png.data[si + 2]; out.data[di + 3] = png.data[si + 3];
    }
  return out;
}

const dirs = ['orig', 'astro', 'diff'].map((d) => path.join(OUT, vpName, d));
dirs.forEach((d) => fs.mkdirSync(d, { recursive: true }));

const browser = await chromium.launch();
const results = [];
for (const r of routes) {
  const slug = r === '/' ? 'home' : r.replace(/\//g, '_').replace(/^_|_$/g, '');
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const of = path.join(OUT, vpName, 'orig', slug + '.png');
  const af = path.join(OUT, vpName, 'astro', slug + '.png');
  try {
    await shot(page, ORIG + r, of);
    await shot(page, ASTRO + r, af);
    const a = loadPNG(of), b = loadPNG(af);
    const w = Math.min(a.width, b.width), h = Math.min(a.height, b.height);
    const ca = crop(a, w, h), cb = crop(b, w, h);
    const diff = new PNG({ width: w, height: h });
    const n = pixelmatch(ca.data, cb.data, diff.data, w, h, { threshold: 0.1 });
    fs.writeFileSync(path.join(OUT, vpName, 'diff', slug + '.png'), PNG.sync.write(diff));
    const ratio = n / (w * h);
    results.push({ route: r, slug, diff: n, ratio, hOrig: a.height, hAstro: b.height, dH: a.height - b.height });
    console.log(`${(ratio * 100).toFixed(2).padStart(6)}%  dH=${String(a.height - b.height).padStart(5)}  ${r}`);
  } catch (e) {
    results.push({ route: r, slug, error: String(e).slice(0, 120) });
    console.log(`  ERR  ${r}  ${String(e).slice(0, 80)}`);
  }
  await ctx.close();
}
await browser.close();

results.sort((x, y) => (y.ratio || 0) - (x.ratio || 0));
fs.writeFileSync(path.join(OUT, vpName, 'report.json'), JSON.stringify(results, null, 1));
console.log('\n=== WORST 15 (' + vpName + ') ===');
for (const r of results.slice(0, 15))
  console.log(`${((r.ratio || 0) * 100).toFixed(2).padStart(6)}%  dH=${String(r.dH ?? '?').padStart(5)}  ${r.route}${r.error ? '  ' + r.error : ''}`);
