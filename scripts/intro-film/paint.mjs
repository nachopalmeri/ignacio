// Paints the intro's shots (intro/film/*.webp) from painter.html.
//   node scripts/intro-film/paint.mjs
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', '..', 'intro', 'film');
mkdirSync(out, { recursive: true });
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const page = await browser.newPage();
page.on('pageerror', (e) => { console.error(e); process.exitCode = 1; });
await page.goto('file://' + join(here, 'painter.html'));
const char = 'data:image/png;base64,' + readFileSync(join(here, 'char.png')).toString('base64');
const files = await page.evaluate((c) => window.paint(c), char);
for (const [name, url] of Object.entries(files)) {
  const buf = Buffer.from(url.split(',')[1], 'base64');
  writeFileSync(join(out, `${name}.webp`), buf);
  console.log(name, Math.round(buf.length / 1024) + ' KB');
}
await browser.close();
