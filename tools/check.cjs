const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
(async () => {
  const root = path.resolve(__dirname, '..');
  fs.mkdirSync(path.join(root,'qa'),{recursive:true});
  const browser = await chromium.launch({headless:true});
  const errors = [];
  const report = [];
  const url = pathToFileURL(path.join(root,'index.html')).href;
  for (const width of [1440, 1024, 768, 390, 320]) {
    const page = await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:1});
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(url);
    await page.evaluate(()=>document.fonts.ready);
    await page.locator('h1').waitFor();
    await page.waitForTimeout(1200);
    const layout = await page.evaluate(()=>{
      const bad = [...document.querySelectorAll('body *')].filter(el=>{
        const box=el.getBoundingClientRect();
        return box.width && (box.right>innerWidth+1||box.left< -1) && !el.closest('svg') && !el.matches('.contact-orbit,.skip-link');
      }).map(el=>({tag:el.tagName,class:el.className}));
      return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,overflow:bad,images:[...document.images].map(i=>({src:i.getAttribute('src'),ok:i.complete&&i.naturalWidth>0})),glass:document.querySelector('.glass-surface').className};
    });
    if(layout.scrollWidth>width)errors.push('Horizontal overflow at '+width);
    if(layout.images.some(i=>!i.ok))errors.push('Missing image at '+width);
    for(const href of await page.locator('a[href*="instagram.com"]').evaluateAll(as=>as.map(a=>a.href))){
      if(href!=='https://www.instagram.com/koleso.shymkent.kz/')errors.push('Incorrect Instagram link '+href);
    }
    for(const href of await page.locator('a[href*="wa.me"]').evaluateAll(as=>as.map(a=>a.href))){
      const u=new URL(href);
      if(u.pathname!=='/77471440100'||!u.searchParams.get('text')?.startsWith('Здравствуйте'))errors.push('Incorrect WhatsApp link');
    }
    const question=page.locator('details').first();
    await question.locator('summary').click();
    if(!await question.getAttribute('open').then(v=>v!==null))errors.push('FAQ did not open');
    await question.locator('summary').click();
    if(width<=760){
      await page.locator('.menu-toggle').click();
      if(!await page.locator('#mobile-menu').isVisible())errors.push('Menu did not open');
      await page.keyboard.press('Escape');
      if(await page.locator('#mobile-menu').isVisible())errors.push('Escape did not close menu');
      await page.locator('.menu-toggle').click();
      await page.locator('#mobile-menu a').first().click();
      if(await page.locator('#mobile-menu').isVisible())errors.push('Menu did not close after navigation');
    }
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    await page.screenshot({path:path.join(root,'qa',width+'.png'),fullPage:true});
    report.push(layout);
    await page.close();
  }
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await page.goto(url);
  const motion=await page.locator('.hero-photo').evaluate(e=>getComputedStyle(e).animationName);
  if(motion!=='none')errors.push('Reduced-motion preference ignored');
  await page.close();
  const nojs=await browser.newPage({javaScriptEnabled:false});
  await nojs.goto(url);
  if(!await nojs.locator('noscript a[href*="wa.me"]').isVisible())errors.push('Missing no-JS contact fallback');
  await nojs.close();
  await browser.close();
  fs.writeFileSync(path.join(root,'qa','results.json'),JSON.stringify({report,errors},null,2));
  console.log(JSON.stringify({report,errors},null,2));
  if(errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
