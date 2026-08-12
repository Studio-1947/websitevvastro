/**
 * Verifies the mobile-menu drawer's inert toggling (a11y fix for the
 * Lighthouse "aria-hidden focus" audit). Run against `astro preview`.
 */
import { chromium } from '@playwright/test';

const BASE = process.env.BASE || 'http://localhost:4321';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const out = [];

const state = () =>
  page.evaluate(() => {
    const menu = document.querySelector('.mobile-menu');
    if (!menu) return null;
    const focusable = [...menu.querySelectorAll('a, button')].filter(
      (el) => el.tabIndex >= 0 && !el.hasAttribute('inert') && !el.closest('[inert]')
    ).length;
    return {
      inert: menu.hasAttribute('inert'),
      ariaHidden: menu.getAttribute('aria-hidden'),
      isOpen: menu.classList.contains('is-open'),
      focusableLinks: focusable,
    };
  });

try {
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });

  out.push('CLOSED (initial): ' + JSON.stringify(await state()));

  await page.click('.nav__burger');
  await page.waitForTimeout(650); // slide transition
  out.push('OPEN (burger):     ' + JSON.stringify(await state()));

  // First Tab from the page should land inside the open drawer (close button).
  await page.keyboard.press('Tab');
  const activeAfterTab = await page.evaluate(() => {
    const a = document.activeElement;
    return a ? `${a.tagName}.${a.className}` : 'none';
  });
  out.push('focus after Tab:    ' + activeAfterTab);

  // Close via the close button.
  await page.click('.mobile-menu__close');
  await page.waitForTimeout(650);
  out.push('CLOSED (btn):       ' + JSON.stringify(await state()));

  // Open again, then trigger the contact modal from inside the drawer — this
  // exercises contactModal's force-close path.
  await page.click('.nav__burger');
  await page.waitForTimeout(650);
  await page.click('.mobile-menu a[href="/sayhello/"]');
  await page.waitForTimeout(650);
  out.push('MODAL OPEN:         ' + JSON.stringify(await state()));
  const modalOpen = await page.evaluate(() =>
    document.getElementById('contact-modal')?.classList.contains('is-open')
  );
  out.push('contact modal open: ' + modalOpen);
} catch (e) {
  out.push('ERROR: ' + e.message);
} finally {
  await browser.close();
}

console.log(out.join('\n'));
