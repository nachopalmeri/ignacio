// Prode Mundial 2026 launch film.
const SITE = 'https://prode-mundial-2026-ten-omega.vercel.app/prode-mundial-2026.html';
const tab = (k, name) => k.page.locator('button', { hasText: name }).first().evaluate((e) => e.click());

export const captures = {
  desktop: { run: async (k) => {
    const { writeFile } = await import('node:fs/promises');
    await k.go(SITE, 5000);
    await k.shot('home');
    await k.full('full', 4000);
    // The live scoreboard: every source's points, straight from the page.
    const scores = await k.page.$$eval('#scoreboard .score-item', (items) => items.map((i) => ({
      label: i.querySelector('.score-label')?.textContent.trim(), value: i.querySelector('.score-value')?.textContent.trim()
    })));
    await writeFile(new URL('../assets/prode/scores.json', import.meta.url), JSON.stringify(scores, null, 1));
    console.log(JSON.stringify(scores));
    await k.hideFixed();
    await k.each('next', '#next-grid .next-card', 6);
    await k.each('recent', '#recent-grid .recent-card', 5);
    await k.el('header', 'header');
    for (const [name, file] of [['Comparativa 13 IA', 'tab-compare'], ['Accuracy IA', 'tab-accuracy'], ['Mapa Grupos', 'tab-map'], ['Dashboard', 'tab-dash']]) {
      await tab(k, name); await k.wait(1800);
      await k.page.locator('button', { hasText: name }).first().evaluate((e) => window.scrollTo(0, e.getBoundingClientRect().top + scrollY - 20));
      await k.wait(1200);
      await k.shot(file);
    }
  } }
};


// ---------------------------------------------------------------- the film
import { h, set, kf, prog, ease, clamp, words, browser, endCard } from '../engine.mjs';

const float = (t, amp = 6, sp = 0.9) => Math.sin(t * sp) * amp;
// Real points from the live scoreboard (captured with the stills).
const scores = typeof window === 'undefined' ? [] : (await (await fetch('assets/prode/scores.json')).json())
  .filter((s) => /pts/.test(s.value)).map((s) => ({ label: s.label.replace('★ ', ''), star: s.label.includes('★'), v: parseInt(s.value, 10) }));

export const film = {
  duration: 33,
  theme: { accent: '#2563eb', 'accent-soft': '#e3ecff' },
  blobs: ['#5b7cff', '#b06bff'],
  blobOpacity: 0.4,
  scenes: [
    {
      from: 0, to: 3.2, in: 0, out: 0.5,
      build(L) {
        const head = words(L, `${scores.length - 1} fuentes opinan.<br><em>Una sola predicción.</em>`, { top: 330, size: 132, stagger: 0.1, dur: 1.0 });
        return (t) => head(t - 0.25);
      }
    },
    {
      from: 3.2, to: 8.0,
      build(L, a) {
        const head = words(L, 'Prode Mundial <em>2026.</em>', { top: 70, size: 72 });
        const win = browser(L, { src: a('full.png'), url: 'prode-mundial-2026.vercel.app', w: 1360, h: 894 });
        Object.assign(win.el.style, { left: '280px', top: '193px' });
        return (t) => {
          head(t);
          const p = prog(t, 0.1, 1.7, ease.outExpo);
          set(win.el, { persp: 2600, y: (1 - p) * 420 + float(t, 4), rx: (1 - p) * 26, s: 0.8 + p * 0.04 + prog(t, 1.6, 4.8, ease.inOutSine) * 0.05, o: clamp(p * 2) });
          win.scroll(kf(t, [[2.0, 0], [4.4, 420, ease.inOutCubic]]));
        };
      }
    },
    {
      from: 8.0, to: 13.0,
      build(L, a) {
        const head = words(L, 'Cada partido, <em>con su consenso.</em>', { top: 70, size: 72 });
        const W = 458, H = 296, G = 34, x0 = (1920 - (3 * W + 2 * G)) / 2, y0 = 260;
        const cards = [1, 2, 3, 4, 5, 6].map((n, i) => {
          const c = h('div', 'card', L, { width: `${W}px`, height: `${H}px`, left: `${x0 + (i % 3) * (W + G)}px`, top: `${y0 + Math.floor(i / 3) * (H + G)}px`, borderRadius: '22px' });
          h('img', '', c).src = a(`next-${n}.png`);
          return c;
        });
        return (t) => {
          head(t);
          cards.forEach((c, i) => {
            const d = (i % 3) * 0.1 + Math.floor(i / 3) * 0.18;
            const p = prog(t, 0.2 + d, 1.3 + d, ease.outExpo);
            set(c, { persp: 1600, y: (1 - p) * 240 + float(t + i, 4, 1), rx: (1 - p) * 40, s: 0.9 + p * 0.1, o: clamp(p * 2) });
          });
        };
      }
    },
    {
      from: 13.0, to: 19.2,
      build(L) {
        const head = words(L, 'El consenso <em>le gana a todas.</em>', { top: 60, size: 72 });
        const n = scores.length, RH = 50, GAP = 8, top0 = 190, maxW = 1080;
        const sorted = [...scores].sort((x, y) => y.v - x.v);
        const rows = scores.map((s) => {
          const row = h('div', 'abs', L, { left: '330px', top: '0', width: '1360px', height: `${RH}px` });
          const lab = h('div', 'abs', row, { left: '-230px', width: '210px', top: '0', height: `${RH}px`, lineHeight: `${RH}px`, textAlign: 'right', font: `${s.star ? 700 : 600} 26px Inter`, color: s.star ? 'var(--accent)' : 'var(--ink)' });
          lab.textContent = (s.star ? '★ ' : '') + s.label;
          const bar = h('div', 'abs', row, { left: '0', top: '6px', height: `${RH - 12}px`, borderRadius: '10px', background: s.star ? 'linear-gradient(90deg,#2563eb,#7c3aed)' : 'rgba(25,25,25,.13)', boxShadow: s.star ? '0 12px 30px -10px rgba(37,99,235,.6)' : 'none' });
          const val = h('div', 'abs', row, { top: '0', height: `${RH}px`, lineHeight: `${RH}px`, font: `700 26px Inter`, color: s.star ? 'var(--accent)' : 'var(--muted)' });
          return { s, row, bar, val, from: scores.indexOf(s), to: sorted.indexOf(s) };
        });
        return (t) => {
          head(t);
          rows.forEach((r, i) => {
            const g = prog(t, 0.4 + i * 0.05, 1.8 + i * 0.05, ease.outCubic);
            const m = prog(t, 2.4 + r.to * 0.03, 3.5 + r.to * 0.03, ease.inOutQuint);
            const slot = r.from + (r.to - r.from) * m;
            set(r.row, { y: top0 + slot * (RH + GAP), o: clamp(g * 4) });
            const w = (r.s.v / 100) * maxW * g;
            r.bar.style.width = `${w}px`;
            r.val.style.left = `${w + 16}px`;
            r.val.textContent = `${Math.round(r.s.v * g)} pts`;
            if (r.s.star) {
              const pop = prog(t, 3.6, 4.2, ease.spring);
              set(r.bar, { sy: 1 + pop * 0.12 });
              r.row.style.zIndex = '5';
            }
          });
        };
      }
    },
    {
      from: 19.2, to: 23.6,
      build(L, a) {
        const head = words(L, '¿Acertaron? <em>Se mide solo.</em>', { top: 70, size: 72 });
        const cards = [1, 2, 3, 4, 5].map((n, i) => {
          const col = i % 2, row = Math.floor(i / 2);
          const c = h('div', 'card', L, { width: '560px', height: '177px', left: `${i === 4 ? 680 : 380 + col * 600}px`, top: `${280 + row * 205}px`, borderRadius: '22px' });
          h('img', '', c).src = a(`recent-${n}.png`);
          return c;
        });
        return (t) => {
          head(t);
          cards.forEach((c, i) => {
            const p = prog(t, 0.2 + i * 0.12, 1.1 + i * 0.12, ease.spring);
            set(c, { x: (1 - p) * (i % 2 ? 260 : -260), y: float(t + i, 4, 1.1), rz: (1 - p) * (i % 2 ? 6 : -6), o: clamp(p * 2) });
          });
        };
      }
    },
    {
      from: 23.6, to: 28.4,
      build(L, a) {
        const head = words(L, 'Todo, <em>en un tablero.</em>', { top: 70, size: 72 });
        const back = browser(L, { src: a('tab-dash.png'), url: 'prode · Dashboard', w: 1360, h: 894 });
        const front = browser(L, { src: a('tab-accuracy.png'), url: 'prode · Accuracy IA', w: 1360, h: 894 });
        for (const w of [back, front]) Object.assign(w.el.style, { left: '280px', top: '193px' });
        return (t) => {
          head(t);
          const p = prog(t, 0, 1.3, ease.outExpo);
          const q = prog(t, 2.0, 3.1, ease.inOutQuint);
          set(back.el, { persp: 2600, y: (1 - p) * 360 - q * 40, rx: (1 - p) * 20, s: 0.84 - q * 0.06, o: clamp(p * 2) * (1 - q * 0.4) });
          set(front.el, { persp: 2600, y: (1 - q) * 900 + 20 * q, rx: (1 - q) * -10, s: 0.84, o: clamp(q * 3) });
        };
      }
    },
    {
      from: 28.4, to: 33, out: 0,
      build(L) {
        const end = endCard(L, {
          mark: '<span style="font:700 70px Inter;letter-spacing:-.04em">26</span>',
          markStyle: { background: 'linear-gradient(135deg,#1e3a8a,#6d28d9)' },
          name: 'Prode <em>Mundial</em>', url: 'prode-mundial-2026-ten-omega.vercel.app',
          chips: ['JavaScript', 'Estadística', 'Ponderación', 'Chart.js']
        });
        return (t) => end(t, 4.6);
      }
    }
  ]
};

export default { captures, film };
