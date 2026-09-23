// Films a project demo: the live site runs inside stage.html's browser window
// while a shot script clicks, types and scrolls through it for real. Frames
// come from the Chrome screencast (so real animations are captured as they
// happen) and are encoded to H.264 with ffmpeg. No music, on purpose.
//
//   node scripts/video/director.mjs <shot-id> [--keep-frames]
//
// Env: CHROMIUM_PATH (browser binary), FFMPEG (ffmpeg binary, default
// "ffmpeg"), PROXY (e.g. http://127.0.0.1:40765 when egress needs a proxy).
import { chromium } from 'playwright';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(here, '../..');
const outDir = path.join(rootDir, 'project-assets/video');
const FPS = 30;
// Chrome's screencast manages ~18 fps here, so the set is filmed in slow
// motion: page clocks, timers and CSS/Web animations all run SLOW times
// slower, and frame timestamps are divided back. 3x gives ~50 fps of source.
const SLOW = Number(process.env.VIDEO_SLOW || 3);
let dilation = 1;
const rawSleep = (ms) => new Promise((r) => setTimeout(r, ms));
const sleep = (ms) => rawSleep(ms * dilation);

// Installed in every frame. Idempotent: later calls just change the rate,
// rebasing so page clocks never jump.
function dilate(k) {
  if (window.__dilate) return window.__dilate(k);
  const pn = performance.now.bind(performance);
  const dn = Date.now.bind(Date);
  let rate = 1, baseReal = pn(), baseVirt = baseReal, baseDate = dn(), baseDateVirt = baseDate;
  const virt = (real) => baseVirt + (real - baseReal) / rate;
  performance.now = () => virt(pn());
  Date.now = () => baseDateVirt + (dn() - baseDate) / rate;
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => raf((ts) => cb(virt(ts)));
  const st = window.setTimeout.bind(window);
  const si = window.setInterval.bind(window);
  window.setTimeout = (fn, ms, ...a) => st(fn, (Number(ms) || 0) * rate, ...a);
  window.setInterval = (fn, ms, ...a) => si(fn, (Number(ms) || 0) * rate, ...a);
  window.__dilate = (next) => {
    const r = pn(), d = dn();
    baseVirt = virt(r); baseReal = r;
    baseDateVirt = baseDateVirt + (d - baseDate) / rate; baseDate = d;
    rate = next;
  };
  window.__dilate(k);
}

// Runs inside the site's frame. Finds the element's scroll container and
// glides it so the element sits in the upper-middle of the view.
const IN_FRAME = {
  rect: (el) => { const r = el.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; },
  glide: async (el, [ms, align]) => {
    const scroller = (() => {
      for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
        const s = getComputedStyle(n);
        if (/(auto|scroll)/.test(s.overflowY) && n.scrollHeight > n.clientHeight + 4) return n;
      }
      return document.scrollingElement;
    })();
    const isDoc = scroller === document.scrollingElement;
    const view = isDoc ? innerHeight : scroller.clientHeight;
    const top = el.getBoundingClientRect().top - (isDoc ? 0 : scroller.getBoundingClientRect().top);
    const from = scroller.scrollTop;
    const to = Math.max(0, Math.min(scroller.scrollHeight - view, from + top - view * align));
    if (Math.abs(to - from) < 4) return;
    const t0 = performance.now();
    await new Promise((done) => {
      const step = (now) => {
        const p = Math.min(1, (now - t0) / ms);
        const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        scroller.scrollTop = from + (to - from) * e;
        p < 1 ? requestAnimationFrame(step) : done();
      };
      requestAnimationFrame(step);
    });
  }
};

class Director {
  constructor(page, shot) {
    this.page = page;
    this.shot = shot;
    this.n = 0;
  }

  get frame() {
    return this.page.frames().find((f) => f.parentFrame() === this.page.mainFrame());
  }

  stage(fn, ...args) {
    return this.page.evaluate(([name, a]) => window.stage[name](...a), [fn, args]);
  }

  async el(sel) {
    const loc = typeof sel === 'string' ? this.frame.locator(sel).first() : sel(this.frame);
    await loc.waitFor({ state: 'visible', timeout: 15000 });
    return loc;
  }

  async rect(sel) {
    return (await this.el(sel)).evaluate(IN_FRAME.rect);
  }

  wait(ms) { return sleep(ms); }

  async chapter(title, sub, hold = 400) {
    this.n += 1;
    await this.stage('caption', this.n, this.shot.chapters, title, sub);
    await sleep(hold);
  }

  // Bring an element into view the way a person would: a smooth scroll.
  async reveal(sel, { ms = 1100, align = 0.3 } = {}) {
    const loc = await this.el(sel);
    await loc.evaluate(IN_FRAME.glide, [ms, align]);
    await sleep(120);
    return loc;
  }

  async point(sel, { ms = 750, dx = 0.5, dy = 0.5, reveal = true } = {}) {
    if (reveal) await this.reveal(sel);
    const r = await this.rect(sel);
    await this.stage('moveCursor', r.x + r.w * dx, r.y + r.h * dy, ms);
    await sleep(ms + 60);
    return r;
  }

  async click(sel, opts = {}) {
    const loc = await this.el(sel);
    await this.point(sel, opts);
    await this.stage('ripple');
    await sleep(140);
    await loc.click({ timeout: 8000, force: true, noWaitAfter: true }).catch(() => loc.evaluate((e) => e.click()));
    await sleep(opts.after ?? 900);
  }

  async type(sel, text, { delay = 55, clear = true } = {}) {
    await this.click(sel, { after: 250 });
    const loc = await this.el(sel);
    if (clear) await loc.fill('');
    await loc.pressSequentially(text, { delay: delay * dilation });
    await sleep(350);
  }

  async press(key, after = 900) {
    await this.frame.page().keyboard.press(key);
    await sleep(after);
  }

  // Smooth page scroll by a distance (px) inside the site.
  async scroll(dy, ms = 1600) {
    await this.frame.evaluate(async ([dy, ms]) => {
      const s = document.scrollingElement; const from = s.scrollTop;
      const to = Math.max(0, Math.min(s.scrollHeight - innerHeight, from + dy));
      const t0 = performance.now();
      await new Promise((done) => { const step = (now) => { const p = Math.min(1, (now - t0) / ms); const e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; s.scrollTop = from + (to - from) * e; p < 1 ? requestAnimationFrame(step) : done(); }; requestAnimationFrame(step); });
    }, [dy, ms]);
    await sleep(150);
  }

  async zoom(sel, { ms = 1300, max = 1.9, hold = 0 } = {}) {
    const r = sel ? (typeof sel === 'object' && 'w' in sel ? sel : await this.rect(sel)) : null;
    await this.stage('zoom', r, ms, max);
    await sleep(ms + hold);
  }

  unzoom(ms = 1100) { return this.zoom(null, { ms }); }

  async spot(sel, hold = 0) {
    await this.stage('spot', sel ? await this.rect(sel) : null);
    await sleep(700 + hold);
  }

  async goto(url, settle = 2500) {
    await this.frame.goto(url, { waitUntil: 'load', timeout: 45000 * dilation }).catch(() => {});
    await this.stage('setUrl', url);
    await sleep(settle);
  }

  async waitForUrl(re, timeout = 20000) {
    const t0 = Date.now();
    while (Date.now() - t0 < timeout * dilation) {
      if (re.test(this.frame.url())) { await this.stage('setUrl', this.frame.url()); return true; }
      await rawSleep(200);
    }
    return false;
  }
}

async function routeWithRetries(context) {
  // The egress proxy drops some parallel tunnels; fetching each request from
  // Node with retries makes page loads deterministic. Frame-blocking headers
  // are removed so the site can be shown inside the stage window.
  await context.route(/^https?:/, async (route) => {
    for (let i = 0; i < 6; i++) {
      try {
        const res = await route.fetch({ maxRetries: 3, timeout: 30000 });
        const headers = { ...res.headers() };
        delete headers['x-frame-options'];
        if (headers['content-security-policy']) headers['content-security-policy'] = headers['content-security-policy'].replace(/frame-ancestors[^;]*;?/gi, '');
        return await route.fulfill({ response: res, headers });
      } catch (_e) {
        await rawSleep(400 * (i + 1));
      }
    }
    return route.abort().catch(() => {});
  });
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let err = '';
    p.stderr.on('data', (d) => { err += d; });
    p.on('close', (code) => (code === 0 ? resolve() : reject(new Error(err.slice(-2000)))));
  });
}

async function film(shotId, { keepFrames = false } = {}) {
  const shot = (await import(pathToFileURL(path.join(here, 'shots', `${shotId}.mjs`)).href)).default;
  const framesDir = path.join(rootDir, '.video-frames', shotId);
  await rm(framesDir, { recursive: true, force: true });
  await mkdir(framesDir, { recursive: true });

  const browser = await chromium.launch({
    ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
    ...(process.env.PROXY ? { proxy: { server: process.env.PROXY } } : {}),
    args: ['--autoplay-policy=no-user-gesture-required', '--disable-features=IsolateOrigins,site-per-process']
  });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: Number(process.env.VIDEO_DPR || 1),
    ignoreHTTPSErrors: true,
    locale: 'es-AR',
    colorScheme: shot.colorScheme || 'light'
  });
  await routeWithRetries(context);
  const page = await context.newPage();
  page.on('crash', () => console.error('page crashed'));
  page.on('close', () => console.error('page closed'));
  page.on('framenavigated', (f) => { if (f === page.mainFrame() && !f.url().startsWith('file:')) console.error('stage navigated away to', f.url()); });
  await page.goto(pathToFileURL(path.join(here, 'stage.html')).href);
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate((s) => window.stage.setup(s), { accent: shot.accent, accentInk: shot.accentInk, url: shot.url });
  await page.evaluate((n) => window.stage.chapters(n), shot.chapters);
  await page.evaluate((u) => { document.getElementById('site').src = u; }, shot.url);
  await page.waitForFunction(() => document.getElementById('site').contentWindow, null, { timeout: 30000 });
  const d = new Director(page, shot);
  const origin = new URL(shot.url).origin;
  for (let i = 0; i < 600 && !(d.frame && d.frame.url().startsWith(origin)); i++) await rawSleep(100);
  console.log('frame:', d.frame?.url());
  await d.frame.waitForLoadState('load', { timeout: 60000 }).catch(() => {});
  if (shot.prepare) await shot.prepare(d);
  await sleep(shot.settle ?? 3000);

  // Record, in slow motion.
  const cdp = await context.newCDPSession(page);
  dilation = SLOW;
  await context.addInitScript(dilate, SLOW);
  for (const f of page.frames()) await f.evaluate(dilate, SLOW).catch(() => {});
  await cdp.send('Animation.enable');
  await cdp.send('Animation.setPlaybackRate', { playbackRate: 1 / SLOW });
  const frames = [];
  let writes = Promise.resolve();
  cdp.on('Page.screencastFrame', ({ data, metadata, sessionId }) => {
    const file = path.join(framesDir, `f${String(frames.length).padStart(6, '0')}.jpg`);
    frames.push({ file, t: metadata.timestamp / SLOW });
    writes = writes.then(() => writeFile(file, Buffer.from(data, 'base64')));
    cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 90, maxWidth: 1920, maxHeight: 1080, everyNthFrame: 1 });

  await page.evaluate((t) => window.stage.title(t), shot.title);
  await sleep(3400);
  await page.evaluate(() => window.stage.titleOut());
  await sleep(250);
  await page.evaluate(() => window.stage.windowIn());
  await sleep(1300);
  await shot.run(d);
  await d.stage('spot', null);
  await d.unzoom(900);
  await sleep(600);
  await page.evaluate(() => window.stage.windowOut());
  await sleep(700);
  await page.evaluate((e) => window.stage.end(e), { title: shot.end?.title || shot.title.title, url: shot.end?.url || shot.url.replace(/^https?:\/\//, '').replace(/\/$/, ''), by: 'Proyecto de Ignacio Palmeri · ignaciopalmeri.dev' });
  await sleep(3600);
  await cdp.send('Page.stopScreencast');
  await sleep(300);
  await writes;
  await browser.close();

  // Frames arrive only when something repaints, so each one is held until
  // the next; ffmpeg's concat demuxer turns that into a constant 30 fps.
  const lines = [];
  for (let i = 0; i < frames.length; i++) {
    const dur = i + 1 < frames.length ? frames[i + 1].t - frames[i].t : 1 / FPS;
    lines.push(`file '${frames[i].file}'`, `duration ${Math.max(dur, 0.001).toFixed(4)}`);
  }
  lines.push(`file '${frames[frames.length - 1].file}'`);
  const list = path.join(framesDir, 'list.txt');
  await writeFile(list, lines.join('\n'));
  const out = path.join(outDir, shot.out);
  await run(process.env.FFMPEG || 'ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', list,
    '-vf', `fps=${FPS},format=yuv420p`, '-c:v', 'libx264', '-preset', 'slow', '-crf', String(shot.crf ?? 23),
    '-tune', 'animation', '-movflags', '+faststart', '-an', out]);
  const seconds = frames.length ? frames[frames.length - 1].t - frames[0].t : 0;
  console.log(`${shot.out}: ${frames.length} frames, ${seconds.toFixed(1)}s, avg ${(frames.length / seconds).toFixed(1)} fps captured`);
  if (!keepFrames) await rm(framesDir, { recursive: true, force: true });
  return out;
}

const [shotId, ...flags] = process.argv.slice(2);
if (!shotId) {
  console.error('usage: node scripts/video/director.mjs <shot-id> [--keep-frames]');
  process.exit(1);
}
film(shotId, { keepFrames: flags.includes('--keep-frames') }).catch((e) => { console.error(e); process.exit(1); });
