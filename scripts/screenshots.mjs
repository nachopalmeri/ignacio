import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const URL = process.env.PORTFOLIO_URL || 'http://127.0.0.1:5180/';
const OUT_DIR = path.resolve('.agents/portfolio-screenshots');
await mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch();

async function shoot(viewport, label) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('#hero h1', { timeout: 8000 });
  await page.waitForTimeout(800);

  const stamp = `${label}-01-hero.png`;
  await page.screenshot({ path: path.join(OUT_DIR, stamp), fullPage: false });
  console.log('saved', stamp);

  // Workshop
  await page.evaluate(() => document.getElementById('workshop')?.scrollIntoView({ behavior: 'instant', block: 'start' }));
  await page.waitForTimeout(600);
  const workshopFile = `${label}-02-workshop.png`;
  await page.screenshot({ path: path.join(OUT_DIR, workshopFile), fullPage: false });
  console.log('saved', workshopFile);

  // Graph (workflow section) - scroll to the actual eco-viewport
  await page.evaluate(() => document.getElementById('eco-viewport')?.scrollIntoView({ behavior: 'instant', block: 'center' }));
  await page.waitForTimeout(2000);
  const graphFile = `${label}-03-graph.png`;
  await page.screenshot({ path: path.join(OUT_DIR, graphFile), fullPage: false });
  console.log('saved', graphFile);

  // Library modal (only on desktop)
  if (label === 'desktop') {
    // Scroll to the footer where the trigger button is
    await page.evaluate(() => document.querySelector('.app-footer')?.scrollIntoView({ behavior: 'instant', block: 'end' }));
    await page.waitForTimeout(400);
    // Click the library trigger
    await page.click('[data-library-trigger]');
    await page.waitForTimeout(800);
    const libFile = `${label}-04-library.png`;
    await page.screenshot({ path: path.join(OUT_DIR, libFile), fullPage: false });
    console.log('saved', libFile);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }

  await context.close();
}

await shoot({ width: 1440, height: 900 }, 'desktop');
await shoot({ width: 390, height: 844 }, 'mobile');

await browser.close();
console.log('done');
