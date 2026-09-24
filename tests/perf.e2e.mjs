// Performance and resilience budgets, so the fixes of the performance pass
// can't silently regress. Run: node tests/perf.e2e.mjs  (CHROMIUM_PATH optional)
import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = 4175;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp4': 'video/mp4', '.svg': 'image/svg+xml', '.json': 'application/json' };

// Mirrors Vercel: /lab serves lab/index.html; SPA paths fall back to index.html.
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = path.resolve(rootDir, pathname === '/' ? 'index.html' : pathname.slice(1));
  if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!existsSync(file) && !path.extname(file)) file = path.join(rootDir, 'index.html');
  if (!file.startsWith(rootDir) || !existsSync(file) || !statSync(file).isFile()) { res.statusCode = 404; return res.end(); }
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  createReadStream(file).pipe(res);
});

const failures = [];
function check(name, ok, detail = '') {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? ` (${detail})` : ''}`);
  if (!ok) failures.push(name);
}

async function context(browser, options = {}, init) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...options });
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => route.abort());
  await ctx.route(/\/api\//, (route) => route.fulfill({ status: 503, body: '{}' }));
  if (init) await ctx.addInitScript(init);
  return ctx;
}

await new Promise((resolve) => server.listen(port, resolve));
const base = `http://127.0.0.1:${port}`;
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
try {
  // 1. No layout jumps on a slow phone while the role word rotates.
  {
    const ctx = await context(browser, { viewport: { width: 360, height: 780 }, isMobile: true, hasTouch: true }, () => {
      window.__cls = 0;
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await page.goto(`${base}/`, { waitUntil: 'load' });
    await page.waitForTimeout(8000);
    const cls = await page.evaluate(() => window.__cls);
    check('mobile CLS under 0.1 across word swaps', cls < 0.1, cls.toFixed(3));
    await ctx.close();
  }

  // 2. First load stays light: no Side Quests posters until the panel opens.
  {
    const ctx = await context(browser);
    const page = await ctx.newPage();
    const urls = [];
    page.on('request', (r) => urls.push(r.url()));
    await page.goto(`${base}/`, { waitUntil: 'load' });
    await page.waitForTimeout(2500);
    const posters = urls.filter((u) => u.includes('/side-quests/')).length;
    check('no Side Quests posters on first load', posters === 0, `${posters} requested`);
    check('first load under 35 requests', urls.length < 35, `${urls.length}`);
    await page.evaluate(() => document.getElementById('side-quests-toggle').click());
    await page.waitForTimeout(1500);
    check('posters load once Side Quests opens', urls.some((u) => u.includes('/side-quests/')));
    check('no thumb without an image', await page.$$eval('.sq-thumb img', (imgs) => imgs.every((i) => i.getAttribute('src'))));
    await ctx.close();
  }

  // 3. Adaptive hero: the lite decision swaps the 3D wall for a still image.
  {
    const ctx = await context(browser, {}, () => sessionStorage.setItem('hero-lite', '1'));
    const page = await ctx.newPage();
    await page.goto(`${base}/`, { waitUntil: 'load' });
    await page.waitForTimeout(800);
    const state = await page.evaluate(() => {
      const hero = document.querySelector('.cine-hero');
      return {
        lite: hero.classList.contains('is-lite'),
        wallHidden: getComputedStyle(hero.querySelector('.cine-wall')).display === 'none',
        still: getComputedStyle(hero.querySelector('.cine-stage')).backgroundImage.includes('hero-wall'),
        playing: [...hero.querySelectorAll('video')].filter((v) => !v.paused).length
      };
    });
    check('lite hero: still image instead of the wall', state.lite && state.wallHidden && state.still, JSON.stringify(state));
    check('lite hero: no clips playing', state.playing === 0);
    await ctx.close();
  }
  {
    const ctx = await context(browser, {}, () => sessionStorage.setItem('hero-lite', '0'));
    const page = await ctx.newPage();
    await page.goto(`${base}/`, { waitUntil: 'load' });
    await page.waitForTimeout(2500);
    check('smooth devices keep the moving wall', await page.evaluate(() => !document.querySelector('.cine-hero').classList.contains('is-lite')));
    await ctx.close();
  }

  // 4. Agents tab: 3D/2D switch, remembered.
  {
    const ctx = await context(browser);
    const page = await ctx.newPage();
    await page.goto(`${base}/agents`, { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    check('3D view by default', await page.isVisible('#agents-3d') && !(await page.isVisible('#eco-viewport')));
    check('3D view embeds the lab', (await page.getAttribute('#agents-3d iframe', 'src')) === '/lab?embed=1');
    await page.click('[data-agents-view="2d"]');
    await page.waitForTimeout(800);
    check('2D shows the original graph', await page.isVisible('#eco-viewport') && await page.locator('#eco-graph-wrapper *').count() > 20);
    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(800);
    check('view choice is remembered', await page.isVisible('#eco-viewport'));
    await ctx.close();
  }

  // 5. Lab without its CDN (blockers, offline): the router still answers.
  {
    const ctx = await context(browser);
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(`${base}/lab`, { waitUntil: 'load' });
    await page.waitForFunction(() => window.__labReady === true, null, { timeout: 15000 }).catch(() => {});
    check('lab boots without three.js', await page.evaluate(() => window.__labReady === true && document.body.classList.contains('no-webgl')));
    await page.fill('#ask-input', 'Rotá el token secreto del bot de Telegram');
    await page.click('#ask button[type=submit]');
    await page.waitForSelector('#gate.show', { timeout: 15000 });
    await page.click('#gate-yes');
    await page.waitForSelector('#receipt.show', { timeout: 15000 });
    check('lab routes and explains without 3D', (await page.textContent('#receipt')).includes('HIGH_RISK'));
    check('lab: no page errors', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }
} finally {
  await browser.close();
  server.close();
}

if (failures.length) {
  console.error(`\n${failures.length} perf check(s) failed`);
  process.exit(1);
}
console.log('\nall perf checks passed');
