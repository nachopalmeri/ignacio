// Regenerates og-image.png (1200x630).
// Run with: node scripts/og-image.mjs
// Fonts are declared with explicit fallbacks so the output is deterministic
// even when Google Fonts is unreachable from the build environment.
//
// This script used to also emit a placeholder cv.pdf, which silently
// overwrote the real CV every time it ran. cv.pdf is a committed asset now
// and is never generated here.
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const OG_HTML = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; display: flex; flex-direction: column;
    justify-content: space-between; padding: 72px 80px;
    background:
      radial-gradient(circle at 78% 22%, rgba(16,185,129,0.16), transparent 46%),
      radial-gradient(circle at 20% 88%, rgba(59,130,246,0.12), transparent 44%),
      linear-gradient(160deg, #fbf8f1, #ffffff 62%);
    font-family: 'IBM Plex Sans', -apple-system, system-ui, sans-serif;
    color: #18181b;
  }
  .top { display: flex; align-items: center; gap: 14px; }
  .dot { width: 13px; height: 13px; border-radius: 50%; background: #10b981; }
  .eyebrow {
    font-size: 19px; font-weight: 700; letter-spacing: 2.4px;
    text-transform: uppercase; color: #3b82f6;
  }
  h1 {
    font-family: Fraunces, Georgia, 'Times New Roman', serif;
    font-size: 108px; line-height: 1; letter-spacing: -2px; font-weight: 700;
  }
  .kicker { margin-top: 26px; font-size: 30px; line-height: 1.34; color: #52525b; max-width: 24ch; }
  .bottom { display: flex; align-items: center; justify-content: space-between; }
  .chips { display: flex; gap: 11px; }
  .chip {
    padding: 11px 20px; border-radius: 999px; font-size: 19px; font-weight: 700;
    border: 1px solid rgba(16,185,129,0.34);
    background: linear-gradient(145deg, rgba(16,185,129,0.15), rgba(59,130,246,0.09));
    color: #3f3f46;
  }
  .url { font-size: 21px; font-weight: 700; color: #71717a; }
</style></head><body>
  <div class="top"><span class="dot"></span><span class="eyebrow">Junior AI Automation &amp; Product Engineer</span></div>
  <div>
    <h1>Ignacio Palmeri</h1>
    <p class="kicker">Convierto procesos repetitivos en software desplegado.</p>
  </div>
  <div class="bottom">
    <div class="chips">
      <span class="chip">Python</span><span class="chip">FastAPI</span>
      <span class="chip">Next.js</span><span class="chip">PostgreSQL</span>
    </div>
    <span class="url">ignaciopalmeri.dev</span>
  </div>
</body></html>`;

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });

await page.setContent(OG_HTML, { waitUntil: 'load' });
await page.screenshot({ path: path.join(rootDir, 'og-image.png') });

await browser.close();
console.log('Wrote og-image.png');
