/**
 * Full-page screenshot helper.
 *
 * Usage: node tests/shot.mjs <url> <out.png> [desktop|mobile|tablet]
 *
 * Case-study pages run 5-8k px tall with loading="lazy" on every figure. A fast
 * scroll-through leaves images below the fold un-decoded, and they then capture
 * as empty boxes — which reads as a broken page when nothing is wrong. So step
 * through in viewport-sized increments, then explicitly wait for every image to
 * finish decoding before shooting.
 */
import { chromium } from 'playwright';

const [url, out, vpName = 'desktop'] = process.argv.slice(2);
const VP = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
};
const vp = VP[vpName];
if (!url || !out || !vp) {
  console.error('usage: node tests/shot.mjs <url> <out.png> [desktop|tablet|mobile]');
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: vp });

const failures = [];
page.on('response', (r) => {
  if (r.status() >= 400 && /\.(webp|svg|png|jpe?g|avif)(\?|$)/i.test(r.url())) {
    failures.push(`${r.status()} ${r.url()}`);
  }
});

await page.goto(url, { waitUntil: 'load', timeout: 60000 });

// Force every lazy image to load. Scrolling alone is not enough: the page grows
// as images decode, so a loop bounded by the initial scrollHeight stops short
// and the lower figures are never requested at all.
await page.evaluate(() => {
  document.querySelectorAll('img[loading="lazy"]').forEach((i) => {
    i.loading = 'eager';
    if (!i.src && i.dataset.src) i.src = i.dataset.src;
  });
});

// Hide off-screen fixed overlays. The mobile menu sits at translateY(-100%) and
// the contact modal at opacity 0; Playwright's fullPage capture composites both
// into the image anyway, which reads as a broken page during review.
await page.addStyleTag({
  content: '.mobile-menu, .contact-modal, .lightbox { display: none !important; }',
});

// Still step through, so anything driven by IntersectionObserver reveals too.
await page.evaluate(async (step) => {
  for (let y = 0; y <= document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 100));
  }
  window.scrollTo(0, 0);
}, vp.height);

// Then wait for decode rather than guessing with a fixed timeout.
await page
  .waitForFunction(
    () => [...document.images].every((i) => i.complete && i.naturalWidth > 0),
    { timeout: 20000 },
  )
  .catch(() => console.warn('  !!! some images never finished loading'));

await page.screenshot({ path: out, fullPage: true });

const stats = await page.evaluate(() => ({
  h: document.body.scrollHeight,
  imgs: document.images.length,
  broken: [...document.images].filter((i) => !i.naturalWidth).map((i) => i.currentSrc || i.src),
}));

console.log(`${out} height=${stats.h} images=${stats.imgs} broken=${stats.broken.length}`);
if (stats.broken.length) stats.broken.forEach((b) => console.log('  broken:', b));
if (failures.length) failures.forEach((f) => console.log('  http:', f));

await browser.close();
