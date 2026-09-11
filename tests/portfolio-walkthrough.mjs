import { createRequire } from 'node:module';
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const require = createRequire(import.meta.url);
const { createDevServer } = require('../scripts/dev-server.cjs');
const port = 4174;
const baseUrl = `http://127.0.0.1:${port}`;
const outDir = resolve('.agents/portfolio-screenshots');
await mkdir(outDir, { recursive: true });

const server = createDevServer();
await new Promise((r) => server.listen(port, r));
const browser = await chromium.launch({ headless: true });

async function shot(page, name) {
  const path = resolve(outDir, name);
  await page.screenshot({ path, fullPage: false });
  console.log('  saved', name);
}

async function fullShot(page, name) {
  const path = resolve(outDir, name);
  await page.screenshot({ path, fullPage: true });
  console.log('  saved (full)', name);
}

function logSection(title) { console.log('\n==', title, '=='); }

try {
  logSection('Desktop 1440x900');
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

  await page.goto(baseUrl + '/', { waitUntil: 'networkidle' });
  await page.waitForSelector('#hero h1');
  await shot(page, '01-hero-desktop.png');
  console.log('  hero h1:', await page.locator('#hero h1').textContent());
  console.log('  hero role:', await page.locator('[data-i18n="hero.role"]').textContent());
  console.log('  hero value:', await page.locator('[data-i18n="hero.value"]').textContent());

  await page.locator('#projects').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await shot(page, '02-projects-desktop.png');

  await page.locator('#workshop').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await shot(page, '03-workshop-desktop.png');
  const workshopCount = await page.locator('.workshop-card').count();
  console.log('  workshop cards:', workshopCount);

  await page.locator('#workflow').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await shot(page, '04-graph-initial.png');
  const graphCount = await page.locator('#eco-graph-wrapper .eco-node').count();
  console.log('  graph nodes:', graphCount);

  logSection('Tour mode test');
  await page.locator('#eco-tour-btn').click();
  await page.waitForTimeout(800);
  await shot(page, '05-graph-tour-step1.png');
  console.log('  tour pressed:', await page.locator('#eco-tour-btn').getAttribute('aria-pressed'));
  console.log('  tour context name:', await page.locator('#eco-context-name').textContent());
  await page.waitForTimeout(4500);
  await shot(page, '06-graph-tour-step3.png');
  await page.locator('#eco-tour-btn').click();
  await page.waitForTimeout(400);

  logSection('Library modal via footer trigger');
  await page.locator('[data-library-trigger]').click();
  await page.waitForTimeout(500);
  await shot(page, '07-library-modal-desktop.png');
  const libraryVisible = await page.locator('#library-modal').isVisible();
  const categoryCount = await page.locator('.library-category').count();
  const bookCount = await page.locator('.library-book').count();
  console.log('  library visible:', libraryVisible, 'categories:', categoryCount, 'books:', bookCount);

  logSection('Library modal close via Escape');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  console.log('  library after escape:', await page.locator('#library-modal').isVisible());

  logSection('Library modal re-open and verify content');
  // NOTE: Terminal #console-launcher doesn't exist in the current HTML (pre-existing).
  // The books command still works because runTerminalCommand handles it directly.
  await page.locator('[data-library-trigger]').click();
  await page.waitForTimeout(500);
  const firstBook = await page.locator('.library-book-title').first().textContent();
  const firstAuthor = await page.locator('.library-book-author').first().textContent();
  console.log('  first book:', firstBook, '·', firstAuthor);
  await shot(page, '08-library-reopen-desktop.png');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  logSection('Workflow output visible in stage panel');
  await page.locator('#eco-wf-list .wf-item').first().click();
  await page.waitForTimeout(800);
  await shot(page, '09-workflow-with-output.png');
  const outputText = await page.locator('#eco-stage-output').textContent();
  const outputVisible = await page.locator('#eco-stage-output').isVisible();
  console.log('  workflow output:', JSON.stringify(outputText), 'visible:', outputVisible);

  logSection('Full page screenshot');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await fullShot(page, '10-fullpage-desktop.png');

  if (errors.length) {
    console.log('\nERRORS:');
    errors.forEach((e) => console.log('  ' + e));
  } else {
    console.log('\nNo client errors.');
  }
  await ctx.close();

  logSection('Mobile 390x844');
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const mpage = await mctx.newPage();
  await mpage.goto(baseUrl + '/', { waitUntil: 'networkidle' });
  await mpage.waitForSelector('#hero h1');
  await shot(mpage, '11-hero-mobile.png');
  await mpage.locator('#workshop').scrollIntoViewIfNeeded();
  await mpage.waitForTimeout(400);
  await shot(mpage, '12-workshop-mobile.png');
  await mpage.locator('#workflow').scrollIntoViewIfNeeded();
  await mpage.waitForTimeout(400);
  await shot(mpage, '13-graph-mobile.png');
  await mpage.locator('[data-library-trigger]').click();
  await mpage.waitForTimeout(500);
  await shot(mpage, '14-library-mobile.png');
  await mpage.keyboard.press('Escape');
  await mctx.close();

  console.log('\nAll screenshots saved to', outDir);
} catch (err) {
  console.error('FAIL:', err.message);
  process.exitCode = 1;
} finally {
  await browser.close();
  await new Promise((r) => server.close(r));
}
