import { chromium } from 'playwright';
const b = await chromium.launch();
const sels = ['.hero','#featured-work','.solutions__head','.stats','.commit','.approach-band','.marquee--lg','.testi__track','.faq','.faq__media','.faq__list','.footer-block'];
for (const [name, url] of [['ORIG','http://127.0.0.1:8000/'],['ASTRO','http://127.0.0.1:8001/']]) {
  const p = await (await b.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'})).newPage();
  await p.goto(url,{waitUntil:'networkidle'});
  await p.addStyleTag({content:'*{animation:none!important;transition:none!important}[data-hero-aurora]{visibility:hidden}'});
  const info = await p.evaluate((sels)=>{const o={};for(const s of sels){const e=document.querySelector(s);o[s]=e?Math.round(e.getBoundingClientRect().top+scrollY):null;}o.bodyH=document.body.scrollHeight;return o;},sels);
  console.log(name, JSON.stringify(info));
  await p.context().close();
}
await b.close();
