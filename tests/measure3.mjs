import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [name, url] of [['ORIG','http://127.0.0.1:8000/products/aangar-erp/'],['ASTRO','http://127.0.0.1:8001/products/aangar-erp/']]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'})).newPage();
  await p.goto(url,{waitUntil:'networkidle'});
  await p.addStyleTag({content:'*{animation:none!important;transition:none!important}'});
  const info = await p.evaluate(() => {
    const r=(s)=>{const e=document.querySelector(s);if(!e)return null;const b=e.getBoundingClientRect();return {top:+(b.top+scrollY).toFixed(2),h:+b.height.toFixed(2),left:+b.left.toFixed(2)};};
    return {footerBlock:r('.footer-block'), wordmark:r('.footer__wordmark'), addr:r('.footer__addr'), bodyH:document.body.scrollHeight, fontWM: getComputedStyle(document.querySelector('.footer__wordmark')).fontFamily};
  });
  console.log(name, JSON.stringify(info));
  await p.context().close();
}
await b.close();
