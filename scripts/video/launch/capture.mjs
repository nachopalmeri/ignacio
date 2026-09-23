// Captures the raw material for a launch film: sharp (2x) screenshots of the
// real, live product in the states the film needs. The film itself is then
// composed from these stills by engine.html + render.mjs, so every frame is
// deterministic and motion stays perfectly smooth.
//
//   node scripts/video/launch/capture.mjs <project-id>
//
// Env: CHROMIUM_PATH, PROXY (egress proxy, if any).
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function routeWithRetries(context) {
  // The egress proxy drops some parallel tunnels; fetching each request from
  // Node with retries makes page loads deterministic.
  await context.route(/^https?:/, async (route) => {
    for (let i = 0; i < 6; i++) {
      try {
        return await route.fulfill({ response: await route.fetch({ maxRetries: 3, timeout: 30000 }) });
      } catch (_e) {
        await sleep(400 * (i + 1));
      }
    }
    return route.abort().catch(() => {});
  });
}

const id = process.argv[2];
if (!id) throw new Error('usage: capture.mjs <project-id>');
const film = (await import(pathToFileURL(path.join(here, 'films', `${id}.mjs`)).href)).default;
const outDir = path.join(here, 'assets', id);
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
  ...(process.env.PROXY ? { proxy: { server: process.env.PROXY } } : {})
});

async function open(viewport, { mobile = false, colorScheme = 'light' } = {}) {
  const context = await browser.newContext({
    viewport, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile,
    ignoreHTTPSErrors: true, locale: 'es-AR', colorScheme,
    reducedMotion: 'no-preference'
  });
  await routeWithRetries(context);
  const page = await context.newPage();
  return { context, page };
}

// Helpers handed to the film's capture script.
function kit(page) {
  const k = {
    page,
    async go(url, settle = 2500) {
      await page.goto(url, { waitUntil: 'load', timeout: 90000 }).catch((e) => console.warn('goto:', e.message));
      await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
      await sleep(settle);
    },
    wait: sleep,
    async shot(name, opts = {}) {
      await page.screenshot({ path: path.join(outDir, `${name}.png`), ...opts });
      console.log('  ✓', name);
    },
    // Full page, capped so huge pages stay usable as a pan.
    async full(name, maxHeight = 5200) {
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      const w = page.viewportSize().width;
      await page.evaluate(async () => {
        // Walk the page once so lazy content and reveal animations settle.
        for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
        window.scrollTo(0, 0);
      });
      await sleep(800);
      await k.shot(name, { clip: { x: 0, y: 0, width: w, height: Math.min(h, maxHeight) }, fullPage: true });
    },
    async el(name, selector) {
      const loc = page.locator(selector).first();
      await loc.scrollIntoViewIfNeeded().catch(() => {});
      await sleep(600);
      await loc.screenshot({ path: path.join(outDir, `${name}.png`) });
      console.log('  ✓', name);
    },
    // Rect of an element in page coordinates (CSS px), for camera targets.
    async rect(selector) {
      return page.locator(selector).first().evaluate((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height };
      });
    },
    // Fixed/sticky chrome (navbars, chat bubbles) would stamp itself onto
    // every element shot; hide it unless a capture needs it.
    async hideFixed(except = []) {
      await page.evaluate((keep) => {
        for (const el of document.querySelectorAll('body *')) {
          const pos = getComputedStyle(el).position;
          if ((pos === 'fixed' || pos === 'sticky') && !keep.some((s) => el.matches(s) || el.closest(s))) el.style.setProperty('visibility', 'hidden', 'important');
        }
      }, except);
    },
    // Screenshots every match of a selector as name-1, name-2, ...
    async each(name, selector, max = 12) {
      const n = Math.min(await page.locator(selector).count(), max);
      for (let i = 0; i < n; i++) {
        const loc = page.locator(selector).nth(i);
        await loc.scrollIntoViewIfNeeded().catch(() => {});
        await sleep(250);
        await loc.screenshot({ path: path.join(outDir, `${name}-${i + 1}.png`) });
      }
      console.log('  ✓', name, `x${n}`);
    },
    async scrollTo(selector, offset = 80) {
      await page.locator(selector).first().evaluate((el, o) => window.scrollTo(0, el.getBoundingClientRect().top + scrollY - o), offset);
      await sleep(900);
    }
  };
  return k;
}

for (const [name, spec] of Object.entries(film.captures)) {
  console.log(name);
  const { context, page } = await open(spec.viewport || { width: 1440, height: 900 }, spec);
  try {
    await spec.run(kit(page));
  } catch (e) {
    console.error('  ✗', name, e.message);
  }
  await context.close();
}
await browser.close();
