// Regression checks for the cinematic hero and the acts below it.
// Run with: node tests/hero.e2e.mjs  (set CHROMIUM_PATH to use a system Chromium)
import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = 4174;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp4': 'video/mp4', '.svg': 'image/svg+xml', '.json': 'application/json' };

const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = path.resolve(rootDir, pathname === '/' ? 'index.html' : pathname.slice(1));
  if (!file.startsWith(rootDir) || !existsSync(file) || !statSync(file).isFile()) { res.statusCode = 404; return res.end(); }
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  createReadStream(file).pipe(res);
});

const failures = [];
function check(name, ok, detail = '') {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? ` (${detail})` : ''}`);
  if (!ok) failures.push(name);
}

async function open(browser, options = {}) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, ...options });
  // External requests (fonts, GitHub API) are irrelevant here and flaky offline.
  await context.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => route.abort());
  await context.route(/\/api\//, (route) => route.fulfill({ status: 503, body: '{}' }));
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'load' });
  await page.waitForSelector('[data-cine-hero] .cine-tile');
  return { context, page, errors };
}

await new Promise((resolve) => server.listen(port, resolve));
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
try {
  {
    const { context, page, errors } = await open(browser);
    const h1 = await page.locator('.cine-hero h1').textContent();
    check('spanish headline', h1.includes('trabajo aburrido'), h1);
    check('accent word marked', await page.locator('.cine-hero h1 .hero-word--accent').count() === 1);
    const live = await page.locator('[data-i18n="hero.trustLive"]').textContent();
    const deployed = await page.evaluate(() => projectStats().deployed);
    check('trust row uses real deployed count', live.startsWith(String(deployed)), live);
    check('wall only shows project screenshots', await page.evaluate(() => [...document.querySelectorAll('.cine-tile')].every((t) => FEATURED_PROJECTS.some((p) => p.id === t.dataset.cineId))));
    check('spotlight lights a project', await page.locator('.cine-tile.is-lit').count() > 0);
    const first = await page.locator('[data-cine-now] strong').textContent();
    await page.waitForTimeout(3600);
    check('spotlight cycles', (await page.locator('[data-cine-now] strong').textContent()) !== first);

    await page.getByRole('button', { name: 'EN', exact: true }).click();
    check('english headline', (await page.locator('.cine-hero h1').textContent()).includes('boring work'));
    check('english caption', (await page.locator('.cine-now-label').textContent()) === 'Now showing');

    const explode = () => page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('[data-exploded]')).getPropertyValue('--explode')));
    await page.evaluate(() => { const s = document.querySelector('[data-exploded]'); window.scrollTo(0, s.offsetTop); });
    await page.waitForTimeout(300);
    const start = await explode();
    await page.evaluate(() => { const s = document.querySelector('[data-exploded]'); window.scrollTo(0, s.offsetTop + s.offsetHeight - innerHeight); });
    await page.waitForTimeout(300);
    const end = await explode();
    check('exploded stack opens with scroll', start < 0.1 && end > 0.95, `${start} -> ${end}`);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    check('hero runs when visible', !(await page.locator('[data-cine-hero]').evaluate((el) => el.classList.contains('is-paused'))));
    await page.locator('#side-quests-toggle').click();
    await page.waitForTimeout(300);
    check('hero pauses under side quests', await page.locator('[data-cine-hero]').evaluate((el) => el.classList.contains('is-paused')));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: 'Projects', exact: true }).first().click();
    await page.waitForTimeout(300);
    check('hero pauses on other tabs', await page.locator('[data-cine-hero]').evaluate((el) => el.classList.contains('is-paused')));
    check('no page errors (desktop)', errors.length === 0, errors[0]);
    await context.close();
  }
  for (const width of [360, 390]) {
    const { context, page, errors } = await open(browser, { viewport: { width, height: 780 }, isMobile: true, hasTouch: true });
    for (const y of [0, 900, 2400]) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForTimeout(150);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      check(`no horizontal scroll at ${width}px, y=${y}`, overflow <= 0, `${overflow}px`);
    }
    check(`no page errors (${width}px)`, errors.length === 0, errors[0]);
    await context.close();
  }
  {
    const { context, page } = await open(browser, { reducedMotion: 'reduce' });
    const state = await page.evaluate(() => ({
      paused: document.querySelector('[data-cine-hero]').classList.contains('is-paused'),
      videos: document.querySelectorAll('.cine-tile video').length,
      explode: getComputedStyle(document.querySelector('[data-exploded]')).getPropertyValue('--explode').trim()
    }));
    check('reduced motion: still, no videos, stack pre-opened', state.paused && state.videos === 0 && state.explode === '1', JSON.stringify(state));
    await context.close();
  }
} finally {
  await browser.close();
  server.close();
}

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed`);
  process.exit(1);
}
console.log('\nall hero checks passed');
