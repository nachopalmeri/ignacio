// Dulces Creaciones launch film (dulcescreaciones.vercel.app).
const SITE = 'https://dulcescreaciones.vercel.app/';

export const captures = {
  desktop: { run: async (k) => {
    await k.go(SITE, 4500);
    await k.shot('hero');
    await k.full('full', 3200);
    await k.hideFixed();
    await k.scrollTo('#galeria', 0); await k.wait(1500);
    await k.each('cake', '#galeria .gallery-item img', 12);
    await k.scrollTo('#especialidades', 0); await k.wait(1500);
    await k.each('cat', '#especialidades .category-card', 4);
    await k.scrollTo('#proceso', 0); await k.wait(1500);
    await k.each('paso', '#proceso .paso-card', 3);
  } }
};


// ---------------------------------------------------------------- the film
import { h, set, kf, prog, ease, clamp, words, browser, endCard } from '../engine.mjs';

const float = (t, amp = 6, sp = 0.9) => Math.sin(t * sp) * amp;
const serif = { fontFamily: 'Serif', fontWeight: 400, letterSpacing: '-0.01em' };

export const film = {
  duration: 26.3,
  theme: { bg: '#f6eee8', ink: '#3a2320', muted: '#8a6f68', accent: '#c2577a', chip: '#fffaf6' },
  blobs: ['#f2a7bf', '#f6c89a'],
  blobOpacity: 0.5,
  scenes: [
    {
      from: 0, to: 3.2, in: 0, out: 0.5,
      build(L) {
        const head = words(L, 'Tortas de autor<br><em>para festejos únicos.</em>', { top: 320, size: 150, stagger: 0.1, dur: 1.0, style: serif });
        return (t) => head(t - 0.25);
      }
    },
    {
      from: 3.2, to: 7.8,
      build(L, a) {
        const head = words(L, 'Dulces Creaciones, <em>en la web.</em>', { top: 60, size: 84, style: serif });
        const win = browser(L, { src: a('full.png'), url: 'dulcescreaciones.vercel.app', w: 1360, h: 894 });
        Object.assign(win.el.style, { left: '280px', top: '193px' });
        return (t) => {
          head(t);
          const p = prog(t, 0.1, 1.7, ease.outExpo);
          set(win.el, { persp: 2600, y: (1 - p) * 420 + float(t, 4), rx: (1 - p) * 26, s: 0.8 + p * 0.04 + prog(t, 1.6, 4.6, ease.inOutSine) * 0.05, o: clamp(p * 2) });
          win.scroll(kf(t, [[2.0, 0], [4.2, 900, ease.inOutCubic]]));
        };
      }
    },
    {
      from: 7.8, to: 13.0,
      build(L, a) {
        const head = words(L, 'Cada torta, <em>una historia.</em>', { top: 60, size: 84, style: serif });
        const wall = h('div', 'abs', L, { left: '0', top: '230px', width: '1920px', height: '760px' });
        const tiles = Array.from({ length: 12 }, (_, i) => {
          const c = h('div', 'card', wall, { width: '330px', height: '330px', left: `${(i % 6) * 354}px`, top: `${Math.floor(i / 6) * 364 + 30}px`, borderRadius: '26px' });
          h('img', '', c).src = a(`cake-${i + 1}.png`);
          return c;
        });
        return (t) => {
          head(t);
          tiles.forEach((c, i) => {
            const row = Math.floor(i / 6);
            const p = prog(t, 0.15 + (i % 6) * 0.07 + row * 0.12, 1.1 + (i % 6) * 0.07 + row * 0.12, ease.outExpo);
            const pan = row === 0 ? kf(t, [[0, 60], [5.2, -330, ease.linear]]) : kf(t, [[0, -330], [5.2, 60, ease.linear]]);
            set(c, { x: pan, y: (1 - p) * 120, s: 0.85 + p * 0.15, o: clamp(p * 2) });
          });
          set(wall, { persp: 2400, rx: 14, rz: -3 });
        };
      }
    },
    {
      from: 13.0, to: 17.6,
      build(L, a) {
        const head = words(L, 'Elegí tu <em>especialidad.</em>', { top: 60, size: 84, style: serif });
        const cards = [1, 2, 3, 4].map((n, i) => {
          const c = h('div', 'card', L, { width: '284px', height: '475px', left: `${347 + i * 314}px`, top: '300px', borderRadius: '24px' });
          h('img', '', c).src = a(`cat-${n}.png`);
          return c;
        });
        return (t) => {
          head(t);
          cards.forEach((c, i) => {
            const p = prog(t, 0.2 + i * 0.1, 1.4 + i * 0.1, ease.spring);
            const dx = (1.5 - i) * 314;
            set(c, { x: dx * (1 - p), y: (1 - p) * 140 + float(t + i, 5, 1), rz: (1 - p) * (i - 1.5) * 9, o: clamp(p * 3) });
          });
        };
      }
    },
    {
      from: 17.6, to: 21.8,
      build(L, a) {
        const head = words(L, 'Pedís por WhatsApp, <em>en 3 pasos.</em>', { top: 60, size: 84, style: serif });
        const cards = [1, 2, 3].map((n, i) => {
          const c = h('div', 'card', L, { width: '472px', height: '359px', left: `${222 + i * 502}px`, top: '360px', borderRadius: '26px', background: '#3b2019' });
          h('img', '', c).src = a(`paso-${n}.png`);
          return c;
        });
        return (t) => {
          head(t);
          cards.forEach((c, i) => {
            const p = prog(t, 0.25 + i * 0.35, 1.2 + i * 0.35, ease.outExpo);
            set(c, { persp: 1600, y: (1 - p) * 260 + float(t + i, 5, 1), rx: (1 - p) * 40, o: clamp(p * 2) });
          });
        };
      }
    },
    {
      from: 21.8, to: 26.3, out: 0,
      build(L) {
        const end = endCard(L, {
          mark: '<span style="font:400 96px Serif;font-style:italic">d</span>',
          markStyle: { background: 'linear-gradient(135deg,#e88aa8,#c2577a)' },
          name: 'Dulces <em>Creaciones</em>', nameStyle: serif, url: 'dulcescreaciones.vercel.app',
          chips: ['HTML', 'CSS', 'JavaScript', 'WhatsApp']
        });
        return (t) => end(t, 4.5);
      }
    }
  ]
};

export default { captures, film };
