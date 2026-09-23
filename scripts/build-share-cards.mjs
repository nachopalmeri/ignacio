// Builds a share card per project:
//   og/<id>.jpg  1200x630 preview image (what LinkedIn/WhatsApp/X show)
//   p/<id>.html  tiny page carrying that project's Open Graph tags, which
//                sends humans on to /projects?p=<id> (the card in the site)
// Also writes og/jobbot.jpg, used by the /jobbot case study.
// Run with: node scripts/build-share-cards.mjs
import { chromium } from 'playwright';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://ignaciop.vercel.app';

// FEATURED_PROJECTS lives in app.js (no build step), so lift it out of there.
const appJs = await readFile(path.join(rootDir, 'app.js'), 'utf8');
const start = appJs.indexOf('const FEATURED_PROJECTS = [');
const end = appJs.indexOf('\n];', start) + 3;
const projects = new Function(appJs.slice(start, end) + '\nreturn FEATURED_PROJECTS;')();

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

async function mediaDataUri(p) {
  if (!p.media) return '';
  const buf = await readFile(path.join(rootDir, p.media));
  const ext = path.extname(p.media).slice(1).replace('jpg', 'jpeg');
  return `data:image/${ext};base64,${buf.toString('base64')}`;
}

function cardHtml(p, media) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; display: grid; grid-template-columns: 600px 1fr; overflow: hidden;
         font-family: 'IBM Plex Sans', -apple-system, system-ui, sans-serif; color: #18181b;
         background: radial-gradient(circle at 12% 88%, rgba(16,185,129,0.14), transparent 45%), linear-gradient(160deg, #fbf8f1, #ffffff 70%); }
  .copy { padding: 60px 40px 52px 64px; display: flex; flex-direction: column; justify-content: space-between; }
  .kicker { font-size: 17px; font-weight: 700; letter-spacing: 2.2px; text-transform: uppercase; color: #047857; }
  h1 { font-family: Fraunces, Georgia, serif; font-size: 72px; line-height: 1; letter-spacing: -1.5px; margin: 18px 0 18px; }
  p { font-size: 24px; line-height: 1.38; color: #52525b; }
  .tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 22px; }
  .tags span { padding: 7px 14px; border-radius: 999px; font-size: 16px; font-weight: 700; color: #3f3f46; border: 1px solid rgba(16,185,129,0.34); background: rgba(16,185,129,0.08); }
  .who { font-size: 19px; font-weight: 700; color: #71717a; }
  .shot { position: relative; padding: 56px 0 56px 0; }
  .shot img { position: absolute; top: 56px; left: 0; width: 680px; height: 518px; object-fit: cover; object-position: top left;
              border-radius: 18px; box-shadow: 0 30px 70px rgba(24,24,27,0.22); border: 1px solid rgba(24,24,27,0.08); }
</style></head><body>
  <div class="copy">
    <div>
      <div class="kicker">${esc(p.kind.es)}</div>
      <h1>${esc(p.title)}</h1>
      <p>${esc(p.description.es)}</p>
      <div class="tags">${p.stack.slice(0, 4).map((t) => `<span>${esc(t)}</span>`).join('')}</div>
    </div>
    <div class="who">Ignacio Palmeri · ignaciop.vercel.app</div>
  </div>
  <div class="shot">${media ? `<img src="${media}">` : ''}</div>
</body></html>`;
}

function sharePage(p) {
  const url = `${SITE}/p/${p.id}`;
  const target = `/projects?p=${encodeURIComponent(p.id)}`;
  const title = `${p.title} - Ignacio Palmeri`;
  return `<!doctype html>
<html lang="es"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(p.description.es)}">
<link rel="canonical" href="${SITE}${target}">
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="Ignacio Palmeri">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(p.description.es)}">
<meta property="og:image" content="${SITE}/og/${p.id}.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(p.description.es)}">
<meta name="twitter:image" content="${SITE}/og/${p.id}.jpg">
<meta http-equiv="refresh" content="0; url=${target}">
<script>location.replace(${JSON.stringify(target)});</script>
</head><body>
<p><a href="${target}">${esc(p.title)}</a></p>
</body></html>
`;
}

await mkdir(path.join(rootDir, 'og'), { recursive: true });
await mkdir(path.join(rootDir, 'p'), { recursive: true });

const launchOpts = process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {};
const browser = await chromium.launch(launchOpts);
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const p of projects) {
  await page.setContent(cardHtml(p, await mediaDataUri(p)), { waitUntil: 'load' });
  await page.screenshot({ path: path.join(rootDir, 'og', `${p.id}.jpg`), type: 'jpeg', quality: 86 });
  await writeFile(path.join(rootDir, 'p', `${p.id}.html`), sharePage(p));
}
await browser.close();
console.log(`Wrote ${projects.length} share cards to og/ and p/`);
