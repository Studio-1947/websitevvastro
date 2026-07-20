import { chromium } from 'playwright';
const OUT='d:/downloadss/Studio 1947 website/website/diff-out/';
const b = await chromium.launch();
for (const [name, url] of [['orig','http://127.0.0.1:8000/products/aangar-erp/'],['astro','http://127.0.0.1:8001/products/aangar-erp/']]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'})).newPage();
  await p.goto(url,{waitUntil:'networkidle'});
  await p.evaluate(async()=>{if(document.fonts){await document.fonts.ready;}});
  await p.addStyleTag({content:'*{animation:none!important;transition:none!important}[data-hero-aurora]{visibility:hidden}'});
  const el = await p.$('.footer__bar');
  await el.screenshot({path:OUT+'footerbar_'+name+'.png'});
  await p.context().close();
}
await b.close(); console.log('saved to',OUT);
