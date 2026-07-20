import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [name, url] of [['ORIG','http://127.0.0.1:8000/about-us/'],['ASTRO','http://127.0.0.1:8001/about-us/']]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(url,{waitUntil:'networkidle'});
  const info = await p.evaluate(() => {
    const pick = (sel) => { const e=document.querySelector(sel); if(!e) return null; const r=e.getBoundingClientRect(); const cs=getComputedStyle(e); return {top:Math.round(r.top+scrollY),h:Math.round(r.height),pos:cs.position,vis:cs.visibility}; };
    return { bodyH: document.body.scrollHeight,
      footerBlock: pick('.footer-block'), personModal: pick('#person-modal'), contactModal: pick('#contact-modal'),
      main: pick('main') };
  });
  console.log(name, JSON.stringify(info));
  await p.context().close();
}
await b.close();
