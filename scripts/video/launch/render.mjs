// Renders a launch film frame by frame: engine.html seeks to each t, Chrome
// screenshots it, ffmpeg encodes the stream and lays the film's track under
// it (music.json, same credits as the site). Frames are exact, so motion is
// perfectly smooth at any fps.
//
//   node scripts/video/launch/render.mjs <id> [--jobs 3] [--fps 60]
//        [--stills 1,5.2,9] [--name site-video-id] [--out file.mp4] [--no-audio]
//
// Env: CHROMIUM_PATH, FFMPEG, MUSIC_DIR (folder with "<artist> - <title>.mp3").
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(here, '../../..');
const args = process.argv.slice(2);
const id = args[0];
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i > 0 ? args[i + 1] : d; };
const flag = (k) => args.includes(`--${k}`);
if (!id) throw new Error('usage: render.mjs <id>');

const types = { '.html': 'text/html', '.mjs': 'text/javascript', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  const p = path.join(here, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(here)) { res.writeHead(403).end(); return; }
  try {
    const body = await readFile(p);
    res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' }).end(body);
  } catch { res.writeHead(404).end(); }
}).listen(0);
const port = server.address().port;

const browser = await chromium.launch({
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
  args: ['--force-color-profile=srgb', '--disable-gpu-vsync']
});
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on('pageerror', (e) => console.error('page error:', e.message));
page.on('console', (m) => { if (m.type() === 'error') console.error('console:', m.text()); });
await page.goto(`http://127.0.0.1:${port}/engine.html?film=${id}`);
await page.waitForFunction(() => window.__ready === true, null, { timeout: 60000 });
const { duration } = await page.evaluate(() => ({ duration: window.__film.duration }));
const cdp = await page.context().newCDPSession(page);
const grab = async (quality = 92) => Buffer.from((await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality, optimizeForSpeed: true })).data, 'base64');
const seek = (t) => page.evaluate((tt) => new Promise((r) => { window.__film.seek(tt); requestAnimationFrame(() => r()); }), t);

const stills = opt('stills');
if (stills) {
  const dir = path.join(rootDir, '.video-frames', id);
  await mkdir(dir, { recursive: true });
  const { writeFile } = await import('node:fs/promises');
  for (const t of stills.split(',').map(Number)) {
    await seek(t);
    await writeFile(path.join(dir, `still-${t}.jpg`), await grab(88));
    console.log('still', t);
  }
  await browser.close(); server.close();
  process.exit(0);
}

const fps = Number(opt('fps', 60));
const jobs = Number(opt('jobs', 1));
const out = opt('out', path.join(rootDir, 'project-assets/video', `${opt('name', id)}-demo.mp4`));
const totalFrames = Math.round(duration * fps);
const f0 = Number(opt('f0', 0));
const f1 = Math.min(Number(opt('f1', totalFrames)), totalFrames);

function run(cmd, argv, stdio = 'inherit') {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, argv, { stdio });
    p.on('close', (c) => (c === 0 ? resolve() : reject(new Error(`${cmd} exited ${c}`))));
  });
}

// Parent mode: split the frame range across child renderers, then join the
// chunks losslessly and lay the music under the whole film.
if (jobs > 1) {
  await browser.close();
  server.close();
  const tmp = path.join(rootDir, '.video-frames', `${id}-chunks`);
  await mkdir(tmp, { recursive: true });
  const { writeFile } = await import('node:fs/promises');
  const bounds = Array.from({ length: jobs + 1 }, (_, k) => Math.round((totalFrames * k) / jobs));
  const t0 = Date.now();
  await Promise.all(bounds.slice(0, -1).map((b, k) => run(process.execPath, [
    fileURLToPath(import.meta.url), id, '--fps', String(fps), '--f0', String(b), '--f1', String(bounds[k + 1]),
    '--out', path.join(tmp, `c${k}.mp4`), '--crf', String(opt('crf', 18)), '--quiet'
  ])));
  await writeFile(path.join(tmp, 'list.txt'), bounds.slice(0, -1).map((_, k) => `file 'c${k}.mp4'`).join('\n'));
  const music = JSON.parse(await readFile(path.join(here, '../music.json'), 'utf8'))[opt('track', opt('name', id))];
  const ff = ['-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(tmp, 'list.txt')];
  if (music && process.env.MUSIC_DIR && !flag('no-audio')) {
    ff.push('-ss', String(music.start), '-t', String(duration), '-i', path.join(process.env.MUSIC_DIR, `${music.artist} - ${music.title}.mp3`),
      '-map', '0:v', '-map', '1:a', '-af', `afade=t=in:st=0:d=0.6,afade=t=out:st=${(duration - 2.8).toFixed(2)}:d=2.8,loudnorm=I=-18:TP=-2:LRA=9`,
      '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-shortest');
  } else console.warn('no music for', id);
  ff.push('-c:v', 'copy', '-movflags', '+faststart', out);
  await run(process.env.FFMPEG || 'ffmpeg', ff);
  console.log('wrote', out, `in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  process.exit(0);
}

// Child / single mode: encode frames [f0, f1) as silent H.264.
const ff = spawn(process.env.FFMPEG || 'ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', String(opt('crf', 18)), '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-r', String(fps), out], { stdio: ['pipe', 'inherit', 'inherit'] });
const done = new Promise((r, j) => ff.on('close', (c) => (c === 0 ? r() : j(new Error(`ffmpeg exited ${c}`)))));
const t0 = Date.now();
for (let i = f0; i < f1; i++) {
  await seek(i / fps);
  const buf = await grab();
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  if (!flag('quiet') && (i - f0) % (fps * 2) === 0) console.log(`${id}: frame ${i} / ${f1}  (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
}
ff.stdin.end();
await done;
await browser.close();
server.close();
if (!flag('quiet')) console.log('wrote', out, `${f1 - f0} frames in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
