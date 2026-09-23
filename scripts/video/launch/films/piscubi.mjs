// Piscubi Store launch film (piscubi-store.vercel.app).
const SITE = 'https://piscubi-store.vercel.app/';

export const captures = {
  desktop: { run: async (k) => {
    await k.go(SITE, 5000);
    await k.shot('hero');
    await k.full('full', 3000);
    await k.hideFixed();
    await k.el('count', '#countHeader');
    await k.scrollTo('#top30', 40); await k.wait(1500);
    await k.el('top30', '#top30');
    await k.each('top', '#topRail > *', 10);
    await k.scrollTo('#autores', 40); await k.wait(1200);
    await k.el('autores', '#autores');
    await k.scrollTo('#grid', 120); await k.wait(2000);
    await k.each('book', '#grid > *', 12);
  } }
};


// ---------------------------------------------------------------- the film
import { h, set, kf, prog, ease, clamp, words, browser, endCard } from '../engine.mjs';

const float = (t, amp = 6, sp = 0.9) => Math.sin(t * sp) * amp;
const serif = { fontFamily: 'Serif', fontWeight: 400, letterSpacing: '-0.01em' };

export const film = {
  duration: 26,
  theme: { bg: '#f5f1ea', ink: '#1c1a17', muted: '#7b736a', accent: '#b3261e', chip: '#fffdf8' },
  blobs: ['#e9b6a0', '#c9d6c2'],
  blobOpacity: 0.45,
  scenes: [
    {
      from: 0, to: 3.2, in: 0, out: 0.5,
      build(L) {
        const head = words(L, '¿Buscás un libro?<br><em>Acá está.</em>', { top: 320, size: 156, stagger: 0.1, dur: 1.0, style: serif });
        return (t) => head(t - 0.25);
      }
    },
    {
      from: 3.2, to: 7.8,
      build(L, a) {
        const head = words(L, 'Piscubi, <em>libros digitales y físicos.</em>', { top: 60, size: 80, style: serif });
        const win = browser(L, { src: a('full.png'), url: 'piscubi-store.vercel.app', w: 1360, h: 894 });
        Object.assign(win.el.style, { left: '280px', top: '193px' });
        return (t) => {
          head(t);
          const p = prog(t, 0.1, 1.7, ease.outExpo);
          set(win.el, { persp: 2600, y: (1 - p) * 420 + float(t, 4), rx: (1 - p) * 26, s: 0.8 + p * 0.04 + prog(t, 1.6, 4.6, ease.inOutSine) * 0.05, o: clamp(p * 2) });
          win.scroll(kf(t, [[2.0, 0], [4.2, 620, ease.inOutCubic]]));
        };
      }
    },
    {
      from: 7.8, to: 12.8,
      build(L, a) {
        const num = h('div', 'abs', L, { left: '0', right: '0', top: '170px', textAlign: 'center', font: '400 300px Serif', letterSpacing: '-0.02em', lineHeight: '1' });
        const lab = words(L, 'libros <em>en catálogo.</em>', { top: 480, size: 72, style: serif });
        const covers = Array.from({ length: 10 }, (_, i) => {
          const c = h('div', 'card', L, { width: '151px', height: '230px', left: `${960 - 75}px`, top: '640px', borderRadius: '10px' });
          h('img', '', c).src = a(`top-${i + 1}.png`);
          c.firstChild.style.cssText = 'width:100%;height:auto';
          return c;
        });
        return (t) => {
          const p = prog(t, 0.1, 1.8, ease.outCubic);
          num.textContent = String(Math.round(346 * p));
          set(num, { o: prog(t, 0, 0.3), s: 0.9 + p * 0.1 });
          lab(t - 0.9);
          covers.forEach((c, i) => {
            const q = prog(t, 1.6 + i * 0.07, 2.6 + i * 0.07, ease.spring);
            const k = i - 4.5;
            set(c, { x: k * 150 * q, y: Math.abs(k) * 10 * q + (1 - q) * 300 + float(t + i, 4, 1.2), rz: k * 3.2 * q, o: clamp(q * 3) });
          });
        };
      }
    },
    {
      from: 12.8, to: 17.8,
      build(L, a) {
        const head = words(L, 'PDF, EPUB <em>o en papel.</em>', { top: 60, size: 84, style: serif });
        const strip = h('div', 'abs', L, { left: '0', top: '230px', width: '3600px', height: '760px' });
        const cards = Array.from({ length: 12 }, (_, i) => {
          const c = h('div', 'card', strip, { width: '300px', height: '640px', left: `${i * 326}px`, top: '0', borderRadius: '18px', background: '#fffdf8' });
          const im = h('img', '', c); im.src = a(`book-${i + 1}.png`); im.style.cssText = 'width:100%;height:auto';
          return c;
        });
        return (t) => {
          head(t);
          set(strip, { x: kf(t, [[0, 120], [5.0, -1900, ease.inOutSine]]) });
          cards.forEach((c, i) => {
            const p = prog(t, 0.1 + i * 0.06, 1.1 + i * 0.06, ease.outExpo);
            set(c, { y: (1 - p) * 200 + float(t + i * 0.7, 6, 1), o: clamp(p * 2) });
          });
        };
      }
    },
    {
      from: 17.8, to: 21.8,
      build(L, a) {
        const head = words(L, 'Y los autores <em>más pedidos.</em>', { top: 60, size: 84, style: serif });
        const card = h('div', 'card', L, { width: '1625px', height: '524px', left: '148px', top: '300px', borderRadius: '22px', background: '#fffdf8' });
        h('img', '', card).src = a('autores.png');
        return (t) => {
          head(t);
          const p = prog(t, 0.1, 1.4, ease.outExpo);
          set(card, { persp: 2200, y: (1 - p) * 300 + float(t, 4), rx: (1 - p) * 30 + 4, s: 0.94 + prog(t, 0.5, 4, ease.inOutSine) * 0.04, o: clamp(p * 2) });
        };
      }
    },
    {
      from: 21.8, to: 26, out: 0,
      build(L) {
        const end = endCard(L, {
          mark: '<span style="font:400 100px Serif;font-style:italic">P</span>',
          markStyle: { background: '#1c1a17' },
          name: 'Piscubi <em>Store</em>', nameStyle: serif, url: 'piscubi-store.vercel.app',
          chips: ['Next.js', 'Tailwind', 'E-commerce', 'Vercel']
        });
        return (t) => end(t, 4.2);
      }
    }
  ]
};

export default { captures, film };
