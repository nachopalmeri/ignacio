import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const URL = 'https://ignaciopalmeri.vercel.app/';
const OUT = path.resolve('.agents/audit-screenshots');
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
page.on('pageerror', e => console.log('pageerror:', e.message));
page.on('console', m => { if (m.type() === 'error') console.log('console error:', m.text()); });
page.on('dialog', async d => { console.log('DIALOG:', d.message()); await d.dismiss(); });

await page.goto(URL, { waitUntil: 'load', timeout: 30000 });
await page.waitForTimeout(1000);

// Click "Sistema de trabajo" nav link
try {
  await page.getByText('Sistema de trabajo', { exact: true }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT, 'nav-sistema-trabajo.png') });
  console.log('clicked Sistema de trabajo, url:', page.url());
} catch (e) { console.log('nav sistema failed:', e.message); }

await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);

// Click the $ floating button
try {
  const dollarBtn = await page.$('button:has-text("$"), a:has-text("$"), [class*="fab"], [class*="floating"]');
  if (dollarBtn) {
    await dollarBtn.click({ timeout: 5000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(OUT, 'dollar-button-clicked.png') });
    console.log('clicked dollar button');
  } else {
    console.log('dollar button not found via selector, trying coords');
    await page.mouse.click(70, 1178);
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(OUT, 'dollar-button-coords.png') });
  }
} catch (e) { console.log('dollar btn failed:', e.message); }

// Check theme toggle
try {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  const themeBtn = await page.$('[aria-label*="theme" i], [class*="theme-toggle"], button:near(:text("EN"))');
  if (themeBtn) {
    await themeBtn.click({ timeout: 5000 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT, 'theme-toggled.png') });
    console.log('theme toggled');
  } else {
    console.log('theme button not found');
  }
} catch (e) { console.log('theme toggle failed:', e.message); }

// hover Abrir proyecto button
try {
  await page.evaluate(() => window.scrollTo(0, 0));
  const projSection = await page.$('text=Proyectos destacados');
  if (projSection) await projSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const btn = await page.$('text=Abrir proyecto');
  if (btn) {
    await btn.hover();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT, 'hover-abrir-proyecto.png') });
  }
} catch (e) { console.log('hover btn failed:', e.message); }

// Mobile menu check
const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const mpage = await mctx.newPage();
await mpage.goto(URL, { waitUntil: 'load', timeout: 30000 });
await mpage.waitForTimeout(1000);
await mpage.screenshot({ path: path.join(OUT, 'mobile-nav-check.png') });
console.log('mobile nav visible items:', await mpage.locator('nav a, nav button').allTextContents());

await browser.close();
console.log('done');
