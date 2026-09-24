// Regenerates og-image.jpg/.png (1200x630): the card LinkedIn, WhatsApp and X show
// when someone shares the site. Same look as the hero: the project wall
// (project-assets/hero-wall.webp, from scripts/hero-snapshot.mjs) behind the
// name, what I build, what I'm looking for and three things you can verify.
// Fonts and the background are inlined, so the output doesn't depend on the
// network.
//   node scripts/og-image.mjs
//
// This script used to also emit a placeholder cv.pdf, which silently
// overwrote the real CV every time it ran. cv.pdf is a committed asset now
// and is never generated here.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fontDir = path.join(rootDir, 'scripts/video/launch/fonts');
const b64 = (file) => readFileSync(file).toString('base64');
const font = (name) => `data:font/woff2;base64,${b64(path.join(fontDir, name))}`;
const wall = `data:image/webp;base64,${b64(path.join(rootDir, 'project-assets/hero-wall.webp'))}`;

// The live-project count the site shows (projects with a public demo URL).
const appJs = readFileSync(path.join(rootDir, 'app.js'), 'utf8');
const deployed = (appJs.match(/^\s{4}href: 'https:\/\//gm) || []).length;

const OG_HTML = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face { font-family: Inter; font-weight: 500; src: url(${font('inter-latin-500-normal.woff2')}); }
  @font-face { font-family: Inter; font-weight: 700; src: url(${font('inter-latin-700-normal.woff2')}); }
  @font-face { font-family: Serif; font-style: italic; src: url(${font('instrument-serif-latin-400-italic.woff2')}); }
  @font-face { font-family: Mono; src: url(${font('jetbrains-mono-latin-500-normal.woff2')}); }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; overflow: hidden; position: relative;
    background: #0a0a0c url(${wall}) 68% 40% / 118% auto no-repeat;
    font-family: Inter, system-ui, sans-serif; color: #f6f3ec;
  }
  .grade { position: absolute; inset: 0;
    background:
      linear-gradient(90deg, rgba(10,10,12,.97) 0%, rgba(10,10,12,.9) 42%, rgba(10,10,12,.35) 78%, rgba(10,10,12,.55) 100%),
      linear-gradient(0deg, rgba(10,10,12,.9) 0%, rgba(10,10,12,0) 45%),
      radial-gradient(ellipse at 75% 30%, rgba(16,185,129,.18), transparent 55%); }
  .wrap { position: relative; height: 100%; padding: 58px 70px 52px; display: flex; flex-direction: column; justify-content: space-between; }
  .top { display: flex; align-items: center; gap: 12px; font: 500 17px Mono, monospace; letter-spacing: .14em; text-transform: uppercase; color: #34d399; }
  .top i { width: 11px; height: 11px; border-radius: 50%; background: #34d399; box-shadow: 0 0 14px #34d399; }
  h1 { font-weight: 700; font-size: 104px; line-height: .95; letter-spacing: -.045em; }
  .line { margin-top: 18px; font-weight: 700; font-size: 40px; letter-spacing: -.02em; }
  .line em { font-family: Serif, Georgia, serif; font-weight: 400; font-style: italic; color: #34d399; font-size: 1.12em; letter-spacing: 0; }
  .chips { display: flex; gap: 10px; margin-top: 26px; }
  .chip { padding: 10px 17px; border-radius: 999px; font-weight: 700; font-size: 18px; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.16); }
  .chip b { color: #34d399; }
  .bottom { display: flex; align-items: center; justify-content: space-between; font-size: 20px; }
  .seek { display: flex; align-items: center; gap: 10px; color: rgba(246,243,236,.82); font-weight: 500; }
  .seek i { width: 9px; height: 9px; border-radius: 50%; background: #34d399; }
  .url { font: 500 21px Mono, monospace; color: #f6f3ec; }
</style></head><body>
  <div class="grade"></div>
  <div class="wrap">
    <div class="top"><i></i>Junior AI Automation &amp; Product Engineer</div>
    <div>
      <h1>Ignacio Palmeri</h1>
      <p class="line">Construyo <em>agentes de IA</em>, bots y automatizaciones.</p>
      <div class="chips">
        <span class="chip"><b>${deployed}</b> proyectos online</span>
        <span class="chip">Tests en CI</span>
        <span class="chip">Sistema de agentes en 3D</span>
      </div>
    </div>
    <div class="bottom">
      <span class="seek"><i></i>Busco pasantía o rol trainee · Buenos Aires o remoto</span>
      <span class="url">ignaciopalmeri.dev</span>
    </div>
  </div>
</body></html>`;

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(OG_HTML, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
// og-image.jpg is what the meta tags point to (84 KB vs 440 KB as PNG); the
// PNG stays for links that were shared before the switch.
await page.screenshot({ path: path.join(rootDir, 'og-image.png') });
await page.screenshot({ path: path.join(rootDir, 'og-image.jpg'), type: 'jpeg', quality: 86 });
await browser.close();
console.log(`Wrote og-image.jpg + og-image.png (${deployed} live projects)`);
