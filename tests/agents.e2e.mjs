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
const port = process.argv.includes('--serve') ? 4176 : 4177;
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

if (process.argv.includes('--serve')) {
  console.log(`Agents preview: ${base}/agents`);
} else {
 const browser=await chromium.launch();let checks=0;const errors=[];
 const check=(name,ok)=>{assert.ok(ok,name);checks++;console.log('ok  '+name)};
 try {
  const output='D:/Codex/outputs/agents-base-corrected';await mkdir(output,{recursive:true});
  for(const width of [1440,390]) {
   const context=await browser.newContext({viewport:{width,height:width===390?844:900},hasTouch:width<=768,locale:'es-AR'});
   await context.route(/\/api\//,r=>r.fulfill({status:503,body:'{}'}));
   const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'/agents');await page.waitForSelector('.eco-node.visible');await page.waitForTimeout(1200);
   check('six roles '+width,await page.locator('.eco-node').count()===6);
   check('one graph, no embedded lab '+width,await page.locator('#eco-viewport').isVisible()&&await page.locator('[data-agents-view],#agents-section iframe').count()===0);
   check('Gandalf centered '+width,await page.locator('[data-id=principal]').evaluate(el=>el.style.left==='50%'&&el.textContent.includes('Gandalf')));
   check('original styles only '+width,await page.locator('link[href="agents.css"],script[src="agents.js"]').count()===0);
   for(const language of ['es','en']) {
    await page.locator(`[data-lang-btn="${language}"]`).click();await page.waitForTimeout(500);
    check('translated learning '+width+'/'+language,(await page.locator('#agents-learning-title').textContent()).includes(language==='es'?'Más':'More'));
    check('no horizontal overflow '+width+'/'+language,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   }
   await page.locator('[data-lang-btn="es"]').click();await page.waitForTimeout(300);
   await page.locator('#eco-viewport').scrollIntoViewIfNeeded();await page.screenshot({path:`${output}/${width}-graph.png`});
   const first=page.locator('.eco-node[data-id=explorador]');await first.focus();await page.keyboard.press('Enter');await page.waitForTimeout(1300);
   if(width>768) {
    check('keyboard opens original expansion '+width,await page.locator('#eco-back-btn').evaluate(el=>el.classList.contains('active'))&&await page.locator('.sub-node').count()===3);
    await page.locator('#eco-back-btn').click();await page.waitForTimeout(1200);
   } else {
    check('keyboard opens original mobile detail',await first.evaluate(el=>el.classList.contains('mobile-open')));
    await page.locator('.eco-node[data-id=planner]').tap();
    check('tap selects mobile detail',await page.locator('.eco-node[data-id=planner]').evaluate(el=>el.classList.contains('mobile-open')));
   }
   for(let i=0;i<3;i++) {
    await page.locator('.wf-item').nth(i).click();await page.waitForTimeout(300);
    check('workflow runs '+width+'/'+i,await page.locator('.wf-item.active').count()===1);
   }
   await page.locator('[data-lang-btn="en"]').click();await page.waitForTimeout(300);
   await page.locator('[data-lang-btn="es"]').click();await page.waitForTimeout(300);
   await page.goto(base+'/#/agents');await page.waitForTimeout(700);
   check('hash route '+width,await page.locator('#agents-section').evaluate(el=>el.classList.contains('active')));
   await page.emulateMedia({reducedMotion:'reduce'});await page.reload();await page.waitForSelector('.eco-node');
   check('reduced motion graph '+width,await page.locator('.eco-node').count()===6&&await page.locator('#eco-viewport').isVisible());
   await context.close();
  }
  check('no browser errors',errors.length===0);console.log(`${checks} base Agents checks passed.`);
 } finally {await browser.close();server.close();}
}
