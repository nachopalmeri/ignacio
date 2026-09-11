import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const URL = 'https://ignaciopalmeri.vercel.app/';
const OUT = path.resolve('.agents/audit-screenshots');
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();

async function run(viewport, label) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

  await page.goto(URL, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(1500);

  await page.screenshot({ path: path.join(OUT, `${label}-01-top.png`) });

  if (label === 'desktop') {
    await page.screenshot({ path: path.join(OUT, `${label}-00-full.png`), fullPage: true });
  }

  const sections = ['project-carousel', 'project-archive', 'eco-viewport', 'console-chat', 'project-video-reveal'];
  let i = 2;
  for (const id of sections) {
    try {
      const box = await page.evaluate((elId) => {
        const el = document.getElementById(elId);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        window.scrollTo(0, window.scrollY + r.top - 100);
        return { top: r.top, height: r.height, display: getComputedStyle(el).display, visibility: getComputedStyle(el).visibility };
      }, id);
      console.log(`  [${label}] #${id}`, box);
      await page.waitForTimeout(700);
      await page.screenshot({ path: path.join(OUT, `${label}-${String(i).padStart(2,'0')}-${id}.png`) });
    } catch (e) {
      console.log(`  [${label}] failed #${id}:`, e.message);
    }
    i++;
  }

  try {
    const card = await page.$('.project-card, [class*="project"]');
    if (card) {
      await card.hover({ timeout: 5000 });
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(OUT, `${label}-hover-card.png`) });
    }
  } catch (e) {
    console.log(`  [${label}] hover failed:`, e.message);
  }

  console.log(`[${label}] errors:`, errors);
  await ctx.close();
}

await run({ width: 1440, height: 900 }, 'desktop');
await run({ width: 390, height: 844 }, 'mobile');

await browser.close();
console.log('done');
