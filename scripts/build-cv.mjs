// Renders cv/cv-en.html to cv-en.pdf (A4) at the repo root.
// Run with: node scripts/build-cv.mjs
// cv.pdf (Spanish) is Ignacio's original document and is NOT generated here.
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage();
await page.goto(pathToFileURL(path.join(rootDir, 'cv', 'cv-en.html')).href, { waitUntil: 'load' });
await page.pdf({ path: path.join(rootDir, 'cv-en.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log('Wrote cv-en.pdf');
