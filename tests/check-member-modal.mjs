/**
 * Verifies the team-member deep-link flow:
 *   - /about-us/?member=<key> opens that member's dialog
 *   - the dialog's blocks are ordered Work Area → Interests → About/bio → Portfolio
 *   - a former member key (soumajit) opens nothing
 *   - case study credits link current members and leave former members plain text
 * Run against `astro preview`.
 */
import { chromium } from '@playwright/test';

const BASE = process.env.BASE || 'http://localhost:4322';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const out = [];

const modalState = () =>
  page.evaluate(() => {
    const modal = document.getElementById('person-modal');
    if (!modal || !modal.classList.contains('is-open')) return { open: false };
    const blocks = [...modal.querySelectorAll('[data-pm-blocks] > .pm-block')].map((b) => {
      const h = b.querySelector('h4');
      return {
        title: h ? h.textContent.trim() : '(no h4)',
        isBio: b.classList.contains('pm-bio'),
        isProjects: b.classList.contains('pm-projects'),
        links: [...b.querySelectorAll('a')].map((a) => a.textContent.trim() + ' → ' + a.getAttribute('href')),
      };
    });
    return {
      open: true,
      name: modal.querySelector('[data-pm-name]').textContent.trim(),
      role: modal.querySelector('[data-pm-role]').textContent.trim(),
      order: blocks.map((b) => (b.isBio ? 'About' : b.isProjects ? 'Portfolio' : b.title)),
      hasBioAfterProjects: false,
      portfolioBelowBio:
        blocks.findIndex((b) => b.isBio) !== -1 &&
        blocks.findIndex((b) => b.isProjects) > blocks.findIndex((b) => b.isBio),
      blocks,
    };
  });

try {
  // 1. Deep link to Nikhil Raj Subba (has projects: awch, kulam, mirik-college, mohuna).
  await page.goto(BASE + '/about-us/?member=nikhil%20raj%20subba', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  let m = await modalState();
  out.push('1. deep-link nikhil: ' + JSON.stringify({ open: m.open, name: m.name, order: m.order }));
  out.push('   portfolioBelowBio: ' + m.portfolioBelowBio);
  out.push('   projects: ' + JSON.stringify(m.blocks.find((b) => b.isProjects)?.links));

  // 2. Deep link to a former member → nothing should open.
  await page.goto(BASE + '/about-us/?member=soumajit%20das', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  m = await modalState();
  out.push('2. deep-link soumajit (former): open=' + m.open);

  // 3. Click a card directly and confirm ordering incl. a no-portfolio member.
  await page.goto(BASE + '/about-us/', { waitUntil: 'networkidle' });
  await page.click('.team-card[data-fullname="Rabi (Rabiul Islam)"]');
  await page.waitForTimeout(500);
  m = await modalState();
  out.push('3. click Rabi: ' + JSON.stringify({ open: m.open, name: m.name, order: m.order }));
  out.push('   portfolioBelowBio: ' + m.portfolioBelowBio);
  out.push('   first projects: ' + JSON.stringify(m.blocks.find((b) => b.isProjects)?.links?.[0]));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  // 4. Credits on a case study: Nikhil Subba links, Soumajit stays plain text.
  await page.goto(BASE + '/work/kulam-homestay/', { waitUntil: 'networkidle' });
  const credits = await page.evaluate(() => {
    const members = document.querySelector('.case-credit__members');
    if (!members) return null;
    return members.innerHTML;
  });
  out.push('4. kulam credits html: ' + credits);

  // 5. Click a credited member → lands on about page with the right dialog open.
  await page.click('.case-credit__members a[href="/about-us/?member=nikhil%20raj%20subba"]');
  await page.waitForURL('**/about-us/**');
  await page.waitForTimeout(800);
  m = await modalState();
  out.push('5. click credit → ' + JSON.stringify({ open: m.open, name: m.name, order: m.order }));
} catch (e) {
  out.push('ERROR: ' + e.message);
} finally {
  await browser.close();
}

console.log(out.join('\n'));
