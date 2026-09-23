// Pisculichi Labs launch film (polytools-omega.vercel.app).
const SITE = 'https://polytools-omega.vercel.app/';

export const captures = {
  desktop: { colorScheme: 'dark', run: async (k) => {
    await k.go(SITE, 4500);
    await k.shot('hero');
    await k.hideFixed();
    // The featured card tilts toward the mouse; park the mouse far away.
    await k.page.mouse.move(5, 895);
    await k.el('fillsense', '#tools .glass-card.featured');
    await k.each('feed', '#alpha .glass-card', 2);
    await k.each('dir', '#directory .col-md-4 > div', 3);
  } }
};


// ---------------------------------------------------------------- the film
import { h, set, kf, prog, ease, clamp, words, browser, cursor, endCard, sheen } from '../engine.mjs';

const float = (t, amp = 6, sp = 0.9) => Math.sin(t * sp) * amp;

export const film = {
  duration: 28.5,
  theme: { bg: '#070a12', ink: '#f2f4f8', muted: '#8a93a8', accent: '#5aa8ff', card: 'transparent', chip: '#141b2b', 'grain-blend': 'overlay', 'grain-o': '.05' },
  blobs: ['#1d4ed8', '#6d28d9'],
  blobOpacity: 0.42,
  scenes: [
    {
      from: 0, to: 3.2, in: 0, out: 0.5,
      build(L) {
        const head = words(L, 'Los mercados predictivos<br><em>no esperan.</em>', { top: 330, size: 136, stagger: 0.1, dur: 1.0 });
        return (t) => head(t - 0.25);
      }
    },
    {
      from: 3.2, to: 8.2,
      build(L, a) {
        const head = words(L, 'Un laboratorio <em>para operar mejor.</em>', { top: 70, size: 72 });
        const win = browser(L, { src: a('explore-full.png'), url: 'polytools-omega.vercel.app', w: 1360, h: 894, dark: true });
        Object.assign(win.el.style, { left: '280px', top: '193px' });
        return (t) => {
          head(t);
          const p = prog(t, 0.1, 1.7, ease.outExpo);
          set(win.el, { persp: 2600, y: (1 - p) * 420 + float(t, 4), rx: (1 - p) * 26, s: 0.8 + p * 0.04 + prog(t, 1.6, 5.0, ease.inOutSine) * 0.05, o: clamp(p * 2) });
          win.scroll(kf(t, [[2.4, 0], [4.6, 260, ease.inOutCubic]]));
        };
      }
    },
    {
      from: 8.2, to: 13.6,
      build(L, a) {
        const head = words(L, 'FillSense te avisa <em>por Telegram.</em>', { top: 70, size: 72 });
        const card = h('div', 'card', L, { width: '1300px', height: '475px', left: '310px', top: '330px', borderRadius: '28px', boxShadow: '0 0 0 1px rgba(120,160,255,.18), 0 50px 120px -30px rgba(40,90,255,.45)' });
        h('img', '', card).src = a('fillsense.png');
        const shine = sheen(card);
        const cur = cursor(L);
        return (t) => {
          head(t);
          const p = prog(t, 0, 1.4, ease.outExpo);
          set(card, { persp: 2200, y: (1 - p) * 260 + float(t, 5), rx: (1 - p) * 30 + 2, ry: -3 + float(t, 2, 0.6), s: 0.92 + p * 0.08, o: clamp(p * 2) });
          shine(prog(t, 1.2, 2.4, ease.inOutCubic));
          cur.update(t, [[2.4, 1500, 1060], [3.6, 1318, 548]], [3.9]);
          cur.el.style.opacity = prog(t, 2.3, 2.7);
        };
      }
    },
    {
      from: 13.6, to: 19.0,
      build(L, a) {
        const head = words(L, 'Señales <em>antes que el mercado.</em>', { top: 70, size: 72 });
        const cards = [1, 2].map((n) => {
          const c = h('div', 'card', L, { width: '795px', height: '394px', top: '360px', left: n === 1 ? '145px' : '980px', borderRadius: '26px', boxShadow: '0 0 0 1px rgba(120,160,255,.14), 0 40px 90px -30px rgba(40,90,255,.4)' });
          h('img', '', c).src = a(`feed-${n}.png`);
          return c;
        });
        return (t) => {
          head(t);
          cards.forEach((c, i) => {
            const p = prog(t, 0.15 + i * 0.18, 1.5 + i * 0.18, ease.outExpo);
            const dir = i ? 1 : -1;
            set(c, { persp: 2000, x: dir * (1 - p) * 300, ry: -dir * (1 - p) * 40 + dir * -4, y: float(t + i, 6, 0.8), o: clamp(p * 2) });
          });
        };
      }
    },
    {
      from: 19.0, to: 23.8,
      build(L, a) {
        const head = words(L, 'Y a quién <em>seguir.</em>', { top: 70, size: 72 });
        const cards = [1, 2, 3].map((n, i) => {
          const c = h('div', 'card', L, { width: '520px', height: '305px', top: '380px', left: `${140 + i * 560}px`, borderRadius: '24px', boxShadow: '0 0 0 1px rgba(120,160,255,.14), 0 40px 80px -30px rgba(40,90,255,.35)' });
          h('img', '', c).src = a(`dir-${n}.png`);
          return c;
        });
        return (t) => {
          head(t);
          cards.forEach((c, i) => {
            const p = prog(t, 0.2 + i * 0.14, 1.2 + i * 0.14, ease.spring);
            const hi = Math.max(0, 1 - Math.abs(t - (2.0 + i * 0.7)) / 0.45);
            set(c, { y: (1 - p) * 380 - hi * 18, rz: (1 - p) * (i - 1) * 8, s: 1 + hi * 0.04, o: clamp(p * 2) });
            c.style.boxShadow = `0 0 0 ${1 + hi * 2}px rgba(90,168,255,${0.14 + hi * 0.7}), 0 40px 80px -30px rgba(40,90,255,${0.35 + hi * 0.3})`;
          });
        };
      }
    },
    {
      from: 23.8, to: 28.5, out: 0,
      build(L) {
        const end = endCard(L, {
          mark: '<span style="font:600 64px Mono">P_</span>',
          markStyle: { background: 'linear-gradient(135deg,#38bdf8,#6366f1)' },
          name: 'Pisculichi <em>Labs</em>', url: 'polytools-omega.vercel.app',
          chips: ['JavaScript', 'Telegram Bot', 'Polymarket API', 'Vercel']
        });
        return (t) => end(t, 4.7);
      }
    }
  ]
};

export default { captures, film };
