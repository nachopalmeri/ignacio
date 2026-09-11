import http from 'node:http';
import { createReadStream, existsSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);

const rootDir = path.dirname(fileURLToPath(new URL('../package.json', import.meta.url)));
const port = 4173;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf'
};

function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
  createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url || '/', `http://127.0.0.1:${port}`);
    const pathname = decodeURIComponent(requestUrl.pathname);
    const relativePath = pathname === '/' ? 'index.html' : pathname.slice(1);
    const filePath = path.join(rootDir, relativePath);
    const rootResolved = path.resolve(rootDir);
    const fileResolved = path.resolve(filePath);

    if (!fileResolved.startsWith(rootResolved)) {
      res.statusCode = 403;
      res.end('Forbidden');
      return;
    }

    if (!existsSync(fileResolved)) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }

    const info = await stat(fileResolved);
    if (!info.isFile()) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }

    serveFile(res, fileResolved);
  } catch (error) {
    res.statusCode = 500;
    res.end(String(error));
  }
});

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withPage(browser, options, run) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error));
  const consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  try {
    await run(page, { errors, consoleErrors, context });
  } finally {
    await context.close();
  }
}

async function main() {
  await new Promise((resolve) => server.listen(port, resolve));

  const browser = await chromium.launch({ headless: true });
  try {
    await withPage(browser, { viewport: { width: 1280, height: 720 } }, async (page, state) => {
      await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
      await page.waitForSelector('#overview-section .hero h1');
      await page.waitForFunction(() => document.querySelectorAll('#overview-section .featured-project-grid .project-preview').length === 4);
      const featuredImages = await page.locator('#overview-section .featured-project-grid .project-preview img').count();
      if (featuredImages !== 4) throw new Error(`expected 4 featured project images, got ${featuredImages}`);
      await page.waitForSelector('#overview-section .hero-description');
      const isAboutBeforeProjects = await page.evaluate(() => {
        const about = document.querySelector('#overview-section [data-i18n="about.title"]')?.closest('section');
        const projects = document.querySelector('#project-carousel-title')?.closest('section');
        if (!about || !projects) return false;
        return Boolean(about.compareDocumentPosition(projects) & Node.DOCUMENT_POSITION_FOLLOWING);
      });
      if (!isAboutBeforeProjects) {
        throw new Error('expected About section to appear before featured projects');
      }
      if (state.errors.length) throw new Error(`pageerror: ${state.errors[0].message}`);
      if (state.consoleErrors.length) throw new Error(`console error: ${state.consoleErrors[0]}`);

      const heroText = await page.locator('[data-i18n="hero.tagline"]').textContent();
      if (!heroText || !heroText.includes('Junior AI Automation')) {
        throw new Error(`unexpected hero text: ${heroText}`);
      }

      await page.getByRole('button', { name: 'EN', exact: true }).click();
      await page.waitForFunction(() => document.documentElement.lang === 'en');
      const englishHero = await page.locator('[data-i18n="hero.description"]').textContent();
      if (!englishHero || !englishHero.includes('trainee role')) {
        throw new Error(`unexpected English hero copy: ${englishHero}`);
      }

      await page.getByRole('button', { name: 'ES', exact: true }).click();
      await page.waitForFunction(() => document.documentElement.lang === 'es');

      await page.getByRole('button', { name: 'Toggle theme' }).click();
      await page.waitForFunction(() => document.documentElement.dataset.theme === 'light');
      await page.getByRole('button', { name: 'Toggle theme' }).click();
      await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');

      await page.getByRole('button', { name: 'Proyectos' }).click();
      await page.waitForSelector('#projects-section.view-section.active');
      const archiveRows = await page.locator('#project-archive .archive-row').count();
      if (archiveRows !== 11) throw new Error(`expected 11 archive rows, got ${archiveRows}`);
      const archiveImages = await page.locator('#project-archive img').evaluateAll((images) =>
        images.map((img) => ({
          src: img.getAttribute('src'),
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight
        }))
      );
      if (archiveImages.length !== 11) throw new Error(`expected 11 archive images, got ${archiveImages.length}`);
      const brokenArchiveImage = archiveImages.find((image) => !image.complete || image.naturalWidth <= 0 || image.naturalHeight <= 0);
      if (brokenArchiveImage) throw new Error(`archive image did not load: ${JSON.stringify(brokenArchiveImage)}`);
      const bodyText = await page.locator('body').textContent();
      if (bodyText && (bodyText.includes('Prueba a agregar') || bodyText.includes('Proof to add'))) {
        throw new Error('placeholder evidence text still present');
      }

      await page.getByRole('button', { name: 'Sistema de trabajo' }).click();
      await page.waitForSelector('#agents-section.view-section.active');
      await page.waitForSelector('#eco-wfp');
      await page.waitForSelector('#eco-wf-list .wf-item');
      await page.waitForSelector('#eco-stage');
      await page.waitForSelector('#eco-stats-badge');
      await page.waitForSelector('#eco-hint');
      await page.waitForSelector('#eco-graph-wrapper .eco-node');
      const workflowTitle = await page.locator('[data-i18n="agents.proofTitle"]').textContent();
      if (!workflowTitle || !workflowTitle.includes('Flujo')) {
        throw new Error(`expected compact workflow title, got ${workflowTitle}`);
      }
      const agentsText = await page.locator('#agents-section').textContent();
      if (agentsText && agentsText.includes('no cargos ni claims senior')) {
        throw new Error('old verbose workflow copy is still visible');
      }
      const workflowButtons = await page.locator('#eco-wf-list .wf-item').count();
      if (workflowButtons < 6) throw new Error(`expected workflow controls, got ${workflowButtons}`);
      const nodes = await page.locator('#eco-graph-wrapper .eco-node').count();
      if (nodes < 10) throw new Error(`expected graph nodes, got ${nodes}`);
      await page.locator('#eco-wf-list .wf-item').first().click();
      await page.waitForSelector('#eco-stage.active');
      const stageText = await page.locator('#eco-stage-text').textContent();
      if (!stageText || stageText.includes('agents.stageIdle')) {
        throw new Error(`expected workflow stage text, got ${stageText}`);
      }

      const cvResponse = await page.request.get(`http://127.0.0.1:${port}/cv/palmeri_cv_local_es.pdf`);
      if (!cvResponse.ok()) throw new Error(`CV ES returned ${cvResponse.status()}`);
      const cvEnResponse = await page.request.get(`http://127.0.0.1:${port}/cv/palmeri_cv_startups_en.pdf`);
      if (!cvEnResponse.ok()) throw new Error(`CV EN returned ${cvEnResponse.status()}`);
    });

    await withPage(browser, { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } , async (page, state) => {
      await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
      await page.waitForSelector('#overview-section');
      if (state.errors.length) throw new Error(`pageerror mobile: ${state.errors[0].message}`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
      if (!overflow) throw new Error('horizontal overflow detected on mobile');

      await page.goto(`http://127.0.0.1:${port}/#/agents`, { waitUntil: 'networkidle' });
      await page.waitForSelector('#agents-section.view-section.active');
      await page.waitForSelector('#eco-wfp');
      await page.waitForSelector('#eco-wf-list .wf-item');
      await page.waitForSelector('#eco-graph-wrapper .eco-node');
      const agentsOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
      if (!agentsOverflow) throw new Error('horizontal overflow detected on mobile agents');
      const mobileNodes = await page.locator('#eco-graph-wrapper .eco-node').count();
      if (mobileNodes < 10) throw new Error(`expected mobile graph list nodes, got ${mobileNodes}`);
    });

    await withPage(browser, { viewport: { width: 1280, height: 720 } }, async (page, state) => {
      await page.addInitScript(() => {
        Object.defineProperty(window, 'localStorage', {
          configurable: true,
          get() {
            throw new Error('localStorage blocked');
          }
        });
      });
      await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
      await page.waitForSelector('#overview-section .hero h1');
      await page.getByRole('button', { name: 'EN', exact: true }).click();
      await page.waitForFunction(() => document.documentElement.lang === 'en');
      if (state.errors.length) throw new Error(`pageerror storage-blocked: ${state.errors[0].message}`);
      await wait(100);
    });

    // ---- Slice 1 (portfolio-video-enrichment, infra-only, zero new videos) ----
    // PVP-1/2/3/4/6/7 probes: zero-mp4-on-load, hover/focus assign + leave
    // pause-and-src-release, row-switch release, reduced-motion gate, pinned
    // close release, poster pre-paint, CLS aspect reserve, dev-server mime+206,
    // LCP baseline print. No new video files are introduced by this block.
    await withPage(browser, { viewport: { width: 1280, height: 720 } }, async (page, state) => {
      const mp4Requests = [];
      page.on('request', (request) => {
        if (/\.mp4($|\?)/.test(request.url())) mp4Requests.push(request.url());
      });
      await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
      await page.waitForSelector('#overview-section .hero h1');
      if (mp4Requests.length !== 0) {
        throw new Error(`PVP-1: expected zero .mp4 on load, got ${JSON.stringify(mp4Requests)}`);
      }

      await page.getByRole('button', { name: 'Proyectos' }).click();
      await page.waitForSelector('#projects-section.view-section.active');
      const rows = page.locator('.archive-row[data-video]');
      const rowCount = await rows.count();
      if (rowCount < 2) throw new Error(`S1: need 2+ rows with data-video, got ${rowCount}`);
      const firstSrc = await rows.nth(0).getAttribute('data-video');
      const secondSrc = await rows.nth(1).getAttribute('data-video');
      if (!firstSrc || !secondSrc) throw new Error('S1: rows must carry data-video');

      // Poster pre-paint wiring (T3): staged via dataset, no asset committed.
      const posterPixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
      await rows.nth(0).evaluate((el, poster) => { el.dataset.poster = poster; }, posterPixel);

      // CLS reserve guard (PVP-2): frame keeps its box with no video loaded.
      const reserve = await page.evaluate(() => {
        const frame = document.querySelector('.project-video-frame');
        if (!frame) return null;
        const rect = frame.getBoundingClientRect();
        return { ratio: getComputedStyle(frame).aspectRatio, height: rect.height, width: rect.width };
      });
      if (!reserve) throw new Error('S1: .project-video-frame missing');
      if (reserve.ratio !== '16 / 9') throw new Error(`PVP-2: expected 16/9 reserve, got ${reserve.ratio}`);
      if (!(reserve.height > 0 && reserve.width > 0)) throw new Error('PVP-2: frame box collapsed');

      // Hover assigns src + shows overlay; detector proves real download intent.
      await rows.nth(0).hover();
      await page.waitForSelector('.project-video-reveal.is-visible');
      const shownSrc = await page.locator('#project-video-reveal-video').getAttribute('src');
      if (shownSrc !== firstSrc) throw new Error(`PVP-1: hover src ${shownSrc} !== ${firstSrc}`);
      if (mp4Requests.length === 0) throw new Error('PVP-1: hover fired zero .mp4 requests');
      const paintedPoster = await page.locator('#project-video-reveal-video').evaluate((video) => video.poster);
      if (paintedPoster !== posterPixel) throw new Error(`T3: poster not pre-painted, got ${paintedPoster}`);

      // Row switch releases the previous decoder and assigns the next src.
      await rows.nth(1).hover();
      await page.waitForFunction(
        (expected) => document.getElementById('project-video-reveal-video')?.getAttribute('src') === expected,
        secondSrc
      );

      // Leave pauses AND releases src (PVP-1/PVP-4: decoder released on leave).
      await page.mouse.move(5, 5);
      await page.waitForSelector('.project-video-reveal:not(.is-visible)');
      const afterLeave = await page.locator('#project-video-reveal-video').evaluate((video) => ({
        paused: video.paused,
        src: video.getAttribute('src')
      }));
      if (!afterLeave.paused) throw new Error('PVP-1: video not paused after leave');
      if (afterLeave.src !== null) throw new Error(`PVP-1: src not released after leave, got ${afterLeave.src}`);

      // Keyboard parity (PVP-3): focus shows the same panel, blur hides + releases.
      await rows.nth(0).focus();
      await page.waitForSelector('.project-video-reveal.is-visible');
      await page.evaluate(() => { if (document.activeElement) document.activeElement.blur(); });
      await page.waitForSelector('.project-video-reveal:not(.is-visible)');
      const afterBlur = await page.locator('#project-video-reveal-video').getAttribute('src');
      if (afterBlur !== null) throw new Error(`PVP-3: src not released after blur, got ${afterBlur}`);

      // Pinned (click/Enter) reveal + close release; Escape path included.
      await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
      const trigger = page.locator('[data-video-trigger]').first();
      if ((await trigger.count()) === 0) throw new Error('S1: no [data-video-trigger] on home');
      await trigger.click();
      await page.waitForSelector('.project-video-reveal.is-visible.is-pinned');
      await page.keyboard.press('Escape');
      await page.waitForSelector('.project-video-reveal:not(.is-visible)');
      const afterEsc = await page.locator('#project-video-reveal-video').evaluate((video) => ({
        paused: video.paused,
        src: video.getAttribute('src')
      }));
      if (!afterEsc.paused || afterEsc.src !== null) {
        throw new Error(`S1: Escape must pause + release, got ${JSON.stringify(afterEsc)}`);
      }
      if (state.errors.length) throw new Error(`pageerror s1: ${state.errors[0].message}`);

      // LCP baseline capture (PVP-7): measured value printed for the S1 PR record.
      const lcpMs = await page.evaluate(() => new Promise((resolve) => {
        let value = -1;
        try {
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) value = entry.startTime;
          });
          observer.observe({ type: 'largest-contentful-paint', buffered: true });
          setTimeout(() => { observer.disconnect(); resolve(value); }, 1500);
        } catch {
          resolve(value);
        }
      }));
      console.log(`__LCP_BASELINE_MS__=${lcpMs >= 0 ? Math.round(lcpMs) : 'n/a'}`);
      if (!Number.isFinite(lcpMs)) throw new Error('PVP-7: LCP baseline measurement failed');
    });

    await withPage(browser, { viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce' }, async (page, state) => {
      await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
      await page.getByRole('button', { name: 'Proyectos' }).click();
      await page.waitForSelector('#projects-section.view-section.active');
      await page.locator('.archive-row[data-video]').first().hover({ force: true });
      await wait(400);
      const visible = await page.locator('.project-video-reveal.is-visible').count();
      if (visible !== 0) throw new Error('PVP-3: reduced-motion must not autoplay the reveal');
      if (state.errors.length) throw new Error(`pageerror s1-reduced: ${state.errors[0].message}`);
    });

    // Dev-server media contract (PVP-6) against real production server code.
    {
      const devServerModule = require('../scripts/dev-server.cjs');
      const mediaPort = 4179;
      const mediaServer = devServerModule.createDevServer({ rootDir, port: mediaPort });
      await new Promise((resolve) => mediaServer.listen(mediaPort, resolve));
      try {
        const fixture = `http://127.0.0.1:${mediaPort}/project-assets/video/jobbot-demo.mp4`;
        const head = await fetch(fixture, { method: 'HEAD' });
        if (head.status !== 200) throw new Error(`PVP-6: HEAD status ${head.status}`);
        if (head.headers.get('content-type') !== 'video/mp4') {
          throw new Error(`PVP-6: HEAD mime ${head.headers.get('content-type')}`);
        }
        const total = Number(head.headers.get('content-length'));
        if (!(total > 0)) throw new Error('PVP-6: HEAD missing content-length');
        const partial = await fetch(fixture, { headers: { Range: 'bytes=0-99' } });
        if (partial.status !== 206) throw new Error(`PVP-6: Range status ${partial.status}`);
        if (partial.headers.get('content-range') !== `bytes 0-99/${total}`) {
          throw new Error(`PVP-6: content-range ${partial.headers.get('content-range')}`);
        }
        const chunk = Buffer.from(await partial.arrayBuffer());
        if (chunk.length !== 100) throw new Error(`PVP-6: partial body ${chunk.length} !== 100`);
      } finally {
        await new Promise((resolve) => mediaServer.close(resolve));
      }
    }

    console.log('E2E checks passed');
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
