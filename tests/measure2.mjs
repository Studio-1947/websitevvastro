import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [name, url] of [['ORIG','http://127.0.0.1:8000/about-us/'],['ASTRO','http://127.0.0.1:8001/about-us/']]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(url,{waitUntil:'networkidle'});
  const info = await p.evaluate(() => {
    return [...document.body.children].map(c => {
      const r=c.getBoundingClientRect(); const cs=getComputedStyle(c);
      return `${c.tagName}.${(c.className||'').toString().slice(0,24)} pos=${cs.position} top=${Math.round(r.top+scrollY)} h=${Math.round(r.height)}`;
    });
  });
  console.log('=== '+name+' body children ===');
  info.forEach(x=>console.log('  '+x));
  await p.context().close();
}
await b.close();
