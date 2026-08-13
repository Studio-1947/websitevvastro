/**
 * Verifies the site-wide search overlay:
 *   - the nav magnifier opens the overlay
 *   - typing fetches the build-time index and shows ranked results
 *   - keyboard arrows + Enter navigate, Escape closes
 *   - the "/" shortcut opens search
 * Run against `astro preview`.
 */
import { chromium } from '@playwright/test';

const BASE = process.env.BASE || 'http://localhost:4323';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const out = [];

const state = () =>
  page.evaluate(() => {
    const modal = document.getElementById('search-modal');
    if (!modal) return null;
    return {
      open: modal.classList.contains('is-open'),
      ariaHidden: modal.getAttribute('aria-hidden'),
      results: [...modal.querySelectorAll('.search-result')].map((r) => ({
        type: r.querySelector('.search-result__type')?.textContent,
        title: r.querySelector('.search-result__title')?.textContent,
        href: r.getAttribute('href'),
      })),
      active: [...modal.querySelectorAll('.search-result.is-active')].map((r) =>
        r.querySelector('.search-result__title')?.textContent,
      ),
      empty: modal.querySelector('.search-modal__empty')?.textContent ?? null,
    };
  });

try {
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });

  // 1. Open via the nav button.
  await page.click('[data-search-open]');
  await page.waitForTimeout(400);
  out.push('1. open: ' + JSON.stringify(await state()));

  // 2. Search "kulam" — should surface the Kulam Homestay portfolio.
  await page.type('[data-search-input]', 'kulam');
  await page.waitForTimeout(400);
  let s = await state();
  out.push('2. "kulam": ' + JSON.stringify(s.results.slice(0, 3)));
  out.push('   first title: ' + s.results[0]?.title + ' → ' + s.results[0]?.href);

  // 3. Cross-type search: "design" should include blogs + portfolios.
  await page.fill('[data-search-input]', 'design');
  await page.waitForTimeout(400);
  s = await state();
  out.push('3. "design" types: ' + JSON.stringify(s.results.map((r) => r.type + ':' + r.title).slice(0, 6)));

  // 4. Empty query shows the hint.
  await page.fill('[data-search-input]', '');
  await page.waitForTimeout(200);
  out.push('4. empty: ' + JSON.stringify(await state()));

  // 5. Keyboard: type, arrow down, Enter navigates.
  await page.type('[data-search-input]', 'mirik college');
  await page.waitForTimeout(400);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.waitForURL('**/mirik-college/**', { timeout: 5000 }).catch(() => {});
  out.push('5. enter URL: ' + page.url());

  // 6. "/" shortcut opens search from a fresh page.
  await page.goto(BASE + '/about-us/', { waitUntil: 'networkidle' });
  await page.keyboard.press('/');
  await page.waitForTimeout(400);
  out.push('6. "/" opens: ' + JSON.stringify((await state()).open));

  // 7. Escape closes.
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  out.push('7. escape closed: ' + JSON.stringify((await state()).open));
} catch (e) {
  out.push('ERROR: ' + e.message);
} finally {
  await browser.close();
}

console.log(out.join('\n'));
