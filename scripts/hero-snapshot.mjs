// Renders the hero's project wall to still images (desktop + phone). Devices
// that can't keep the moving 3D wall smooth get this picture instead (see
// "is-lite" in setupCineHero). Re-run after changing the wall or the projects.
//   node scripts/hero-snapshot.mjs   (serve the site on :8766 first)
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = process.env.SITE || 'http://localhost:8766/';
const browser = await chromium.launch({ ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
for (const [name, viewport, mobile] of [['hero-wall', { width: 1600, height: 1000 }, false], ['hero-wall-m', { width: 430, height: 932 }, true]]) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: mobile ? 2 : 1.5, isMobile: mobile, hasTouch: mobile, reducedMotion: 'reduce' });
  await page.goto(base, { waitUntil: 'load' });
  await page.addStyleTag({ content: `
    .cine-copy, .cine-now, .cine-grade, .cine-grain, .cine-scroll-cue, header, [class*="console-launcher"], [class*="terminal"] { visibility: hidden !important; }
    .cine-wall { animation: none !important; opacity: 1 !important; transition: none !important; }
    .cine-col-track { animation: none !important; transform: translateY(-12%) !important; }
    .cine-tile.is-lit::after { opacity: 1 !important; }
    .cine-tile.is-lit { border-color: rgba(255,255,255,.08) !important; }` });
  await page.evaluate(async () => {
    await Promise.all([...document.querySelectorAll('.cine-wall img')].map((i) => { i.loading = 'eager'; return i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }); }));
  });
  await page.waitForTimeout(1200);
  const out = path.join(root, 'project-assets', `${name}.png`);
  await page.locator('.cine-stage').screenshot({ path: out });
  console.log('wrote', out);
  await page.close();
}
await browser.close();
