// Focused regression checks for the repository-base graph and bounded role/content changes.
// --serve keeps a local preview at http://127.0.0.1:4176/agents.
import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = process.argv.includes('--serve') ? 4176 : 4178;
const base = `http://127.0.0.1:${port}`;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.json': 'application/json', '.mp4': 'video/mp4' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, base).pathname);
  let file = path.resolve(root, '.' + pathname);
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
  if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!existsSync(file) && !path.extname(file)) file = path.join(root, 'index.html');
  if (!existsSync(file) || !statSync(file).isFile()) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  createReadStream(file).pipe(res);
});
await new Promise(resolve => server.listen(port, '127.0.0.1', resolve));

const browser=await chromium.launch();let checks=0;const errors=[];
const check=(label,ok)=>{assert.ok(ok,label);checks++;console.log('ok  '+label)};
try {
 await mkdir('D:/Codex/outputs/side-quests-curation',{recursive:true});
 for(const width of [1440,390]) {
  const context=await browser.newContext({viewport:{width,height:width===390?844:900},locale:'es-AR',hasTouch:width===390});
  await context.route(/\/api\//,r=>r.fulfill({status:503,body:'{}'}));
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  const artRequests=[];page.on('request',r=>{if(r.url().includes('/side-quests/'))artRequests.push(r.url())});
  await page.goto(base+'/agents');await page.waitForSelector('.eco-node');
  check('no artwork before opening '+width,artRequests.length===0);
  for(const lang of ['es','en']) {
   await page.locator(`[data-lang-btn="${lang}"]`).click();
   await page.locator('#side-quests-toggle').click();
   const panel=page.locator('#side-quests-reveal');await page.waitForTimeout(500);
   check('accessible modal '+width+'/'+lang,await panel.getAttribute('role')==='dialog'&&await panel.getAttribute('aria-hidden')==='false'&&await panel.evaluate(e=>!e.inert));
   check('opening moves focus inside '+width+'/'+lang,await panel.evaluate(e=>e.contains(document.activeElement)));
   check('exactly four books '+width+'/'+lang,await page.locator('.sq-thumb').count()===4);
   check('starts with AI Engineering '+width+'/'+lang,await page.locator('#sq-detail-title').textContent()==='AI Engineering');
   const books=['AI Engineering','Zero to One','El sueño de los héroes','Crimen y castigo'];
   const films=['The Perks of Being a Wallflower','Pusher II','Ciudad de Dios','Midnight in Paris'];
   for(const [kind,titles] of [['book',books],['film',films]]) {
    await page.locator(`[data-kind="${kind}"]`).click();
    for(const title of titles) {
     await page.locator('.sq-thumb').filter({has:page.locator(`img`)}).nth(titles.indexOf(title)).click();
     await page.waitForFunction(()=>{const i=document.querySelector('#sq-poster');return i.complete&&i.naturalWidth>0});
     check('correct work and loaded cover '+width+'/'+lang+'/'+title,await page.locator('#sq-detail-title').textContent()===title);
    }
    await page.locator('#sq-next').click();
    check('wraps within category '+width+'/'+lang+'/'+kind,await page.locator('#sq-detail-title').textContent()===titles[0]);
   }
   check('three bonus series '+width+'/'+lang,(await page.locator('.sq-series li strong').allTextContents()).join('|')==='The Sopranos|Silicon Valley|Twin Peaks');
   check('no scoring, history or recommendation crew '+width+'/'+lang,await page.locator('#sq-crew,#sq-seen-btn,#sq-snd-btn,#sq-share-btn,#sq-col-chips').count()===0);
   check('copy translated '+width+'/'+lang,(await page.locator('.sq-intro').textContent()).startsWith(lang==='es'?'Cuatro libros':'Four books'));
   check('no horizontal overflow '+width+'/'+lang,await panel.evaluate(e=>e.scrollWidth<=e.clientWidth+1));
   await page.locator('#side-quests-close').focus();await page.keyboard.press('Shift+Tab');
   check('focus stays within modal '+width+'/'+lang,await panel.evaluate(e=>e.contains(document.activeElement)));
   if(lang==='es') {
    await page.locator('[data-kind="book"]').click();
    await panel.evaluate(e=>e.scrollTo(0,0));await page.screenshot({path:`D:/Codex/outputs/side-quests-curation/${width}-books.png`});
    await page.locator('[data-kind="film"]').click();await page.locator('.sq-thumb').nth(3).click();
    await panel.evaluate(e=>e.scrollTo(0,0));await page.screenshot({path:`D:/Codex/outputs/side-quests-curation/${width}-films.png`});
    await page.locator('.sq-series').screenshot({path:`D:/Codex/outputs/side-quests-curation/${width}-series.png`});
   }
   await page.keyboard.press('Escape');
   check('close restores focus '+width+'/'+lang,await page.locator('#side-quests-toggle').evaluate(e=>e===document.activeElement));
   // Reopening deliberately retains the last category, so reset before next language.
   await page.locator('#side-quests-toggle').click();await page.locator('[data-kind="book"]').click();await page.keyboard.press('Escape');
  }
  await context.close();
 }
 const context=await browser.newContext({reducedMotion:'reduce'});
 await context.addInitScript(()=>{Object.defineProperty(Storage.prototype,'setItem',{value(){throw Error('blocked')}})});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'/agents');
 await page.locator('#side-quests-toggle').click();await page.locator('#sq-next').click();
 check('works with reduced motion and blocked storage',await page.locator('#sq-detail-title').textContent()==='Zero to One');
 await context.close();check('no browser errors',errors.length===0);console.log(`${checks} Side Quests checks passed.`);
} finally {await browser.close();server.close();}
