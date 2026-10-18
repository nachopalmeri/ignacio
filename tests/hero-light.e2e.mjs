import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const server = process.env.SITE ? null : require('../scripts/dev-server.cjs').createDevServer();
if (server) await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
const base = process.env.SITE || `http://127.0.0.1:${server.address().port}`;
await mkdir('output/hero-light', { recursive: true });
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
try {
  for (const mode of ['desktop', 'mobile', 'reduced', 'no-webgl', 'lite', 'data-saver']) {
    const context = await browser.newContext({
      viewport: mode === 'mobile' ? { width: 390, height: 844 } : { width: 1440, height: 900 },
      isMobile: mode === 'mobile', hasTouch: mode === 'mobile',
      reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference'
    });
    await context.route(/https?:\/\/(?!127\.0\.0\.1)/, (route) => route.abort());
    // Isolate the player/shader lifecycle from the film's external GSAP CDN.
    // Actual film playback is checked in the user's connected browser.
    await context.route('**/intro/interactive/index.html', (route) => route.fulfill({
      contentType: 'text/html', body: '<!doctype html><title>Film lifecycle fixture</title><script>parent.postMessage({type:"portfolio:intro-ready"},location.origin)</script>'
    }));
    await context.route('**/api/**', (route) => route.fulfill({ status: 503, body: '{}' }));
    await context.addInitScript((mode) => {
      // Exercise the first-visit behavior as a human browser.
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      // Inspect pixels within the draw call, before the default framebuffer
      // is discarded at presentation (preserveDrawingBuffer stays off).
      const draw = WebGLRenderingContext.prototype.drawArrays;
      WebGLRenderingContext.prototype.drawArrays = function (...args) {
        const result = draw.apply(this, args);
        if (this.canvas.matches('[data-hero-light]')) {
          const program = this.getParameter(this.CURRENT_PROGRAM);
          window.__heroLightPointer = Array.from(this.getUniform(program, this.getUniformLocation(program, 'pointer')));
        }
        if (this.canvas.matches('[data-hero-light]') && !window.__heroLightPixels) {
          const pixels = new Uint8Array(this.canvas.width * this.canvas.height * 4);
          this.readPixels(0, 0, this.canvas.width, this.canvas.height, this.RGBA, this.UNSIGNED_BYTE, pixels);
          window.__heroLightPixels = pixels.some((value, index) => index % 4 === 3 && value > 10);
        }
        return result;
      };
      sessionStorage.setItem('hero-lite', mode === 'lite' ? '1' : '0');
      if (mode === 'data-saver') Object.defineProperty(navigator, 'connection', { value: { saveData: true } });
      if (mode === 'no-webgl') {
        const original = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (kind, ...args) {
          return /^webgl/.test(kind) ? null : original.call(this, kind, ...args);
        };
      }
    }, mode);
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(base, { waitUntil: 'load' });
    if (!['reduced', 'data-saver'].includes(mode)) {
      await page.locator('.intro-player[open]').waitFor();
      assert.equal(await page.locator('.cine-light').evaluate((el) => el.classList.contains('is-ready')), false, `${mode}: light pauses during first-visit intro`);
      await page.locator('.intro-player-skip').click();
      assert.equal(await page.evaluate(() => localStorage.getItem('intro-interactive-v1-seen')), '1');
      await page.reload({ waitUntil: 'load' });
    }
    await page.waitForTimeout(1800);
    assert.equal(await page.locator('.intro-player').count(), 0, `${mode}: intro respects repeat visits and motion/data preferences`);
    const state = await page.evaluate(() => ({
      ready: document.querySelector('.cine-light').classList.contains('is-ready'),
      overflow: document.documentElement.scrollWidth > innerWidth,
      width: document.querySelector('[data-hero-light]').width
    }));
    assert.equal(state.overflow, false, `${mode}: no horizontal overflow`);
    assert.equal(state.ready, ['desktop', 'mobile'].includes(mode), `${mode}: correct shader/fallback`);
    if (state.ready) assert.ok(state.width <= 960, 'shader resolution is bounded');
    if (['desktop', 'lite', 'no-webgl'].includes(mode)) {
      const lightPosition = () => page.locator('.cine-light').evaluate((el) => ({
        x: parseFloat(getComputedStyle(el).getPropertyValue('--light-x')),
        y: parseFloat(getComputedStyle(el).getPropertyValue('--light-y')),
        background: getComputedStyle(el).backgroundImage
      }));
      await page.mouse.move(360, 270);
      await page.waitForTimeout(250);
      const first = await lightPosition();
      await page.mouse.move(1224, 630);
      await page.waitForTimeout(350);
      const second = await lightPosition();
      assert.ok(second.x - first.x > 50, `${mode}: light follows horizontal cursor movement`);
      assert.ok(second.y - first.y > 30, `${mode}: light follows vertical cursor movement`);
      if (state.ready) {
        const pointer = await page.evaluate(() => window.__heroLightPointer);
        assert.ok(Math.abs(pointer[0] - 0.85) < 0.02 && Math.abs(pointer[1] - 0.30) < 0.02, 'WebGL receives both cursor coordinates');
      }
      if (!state.ready) assert.notEqual(first.background, second.background, `${mode}: fallback light visibly moves`);
      await page.mouse.move(1439, 899);
    }
    await page.screenshot({ path: `output/hero-light/${mode}.png` });
    if (mode === 'desktop') {
      // Verify actual fragment output, not just successful context creation.
      const output = await page.evaluate(() => window.__heroLightPixels);
      assert.equal(output, true, 'shader produces visible pixels');
      await page.locator('[data-intro-replay]').first().click();
      await page.locator('.intro-player[open]').waitFor();
      assert.equal(await page.locator('.cine-hero').evaluate((el) => el.classList.contains('is-paused')), true);
      assert.equal(await page.locator('.cine-light').evaluate((el) => el.classList.contains('is-ready')), false);
      await page.locator('.intro-player-skip').click();
      await page.waitForTimeout(250);
      assert.equal(await page.locator('.intro-player').count(), 0);
      assert.equal(await page.locator('.cine-light').evaluate((el) => el.classList.contains('is-ready')), true);
      await page.locator('.project-preview').first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      assert.equal(await page.locator('.cine-light').evaluate((el) => el.classList.contains('is-ready')), false, 'shader pauses offscreen');
      await page.screenshot({ path: 'output/hero-light/project-proof.png' });
      await page.goto(`${base}/?intro=1`, { waitUntil: 'load' });
      await page.locator('.intro-player[open]').waitFor();
      await page.keyboard.press('Escape');
      await page.locator('.intro-player').waitFor({ state: 'detached' });
    }
    assert.deepEqual(errors, [], `${mode}: no page errors`);
    console.log(`PASS ${mode}: layout, first-visit intro, shader lifecycle/fallback`);
    await context.close();
  }
} finally {
  await browser.close();
  if (server) await new Promise((resolve) => server.close(resolve));
}
