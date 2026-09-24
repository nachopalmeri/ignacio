// Portfolio launch film (ignaciopalmeri.dev), for the LinkedIn post.
const SITE = 'https://ignaciopalmeri.dev/';

export const captures = {
  desktop: { run: async (k) => {
    const p = k.page;
    await k.go(SITE, 6000);
    await k.shot('hero');
    await p.evaluate(() => document.getElementById('story')?.scrollIntoView());
    await k.wait(1800);
    await k.shot('story');
    await k.go(SITE, 3000);
    await p.locator('[data-recruiter-open]').first().click();
    await k.wait(1800);
    await k.shot('recruiter');
    await k.go(SITE + 'projects', 4000);
    await k.shot('projects');
    await k.full('projects-full', 3600);
    await k.go(SITE, 3000);
    await p.evaluate(() => document.getElementById('side-quests-toggle')?.click());
    await k.wait(3500);
    await k.shot('sidequests');
  } },
  lab: { run: async (k) => {
    const p = k.page;
    await k.go(SITE + 'lab', 9000);
    await p.click('#tour-skip').catch(() => {});
    await k.wait(1500);
    await k.shot('lab');
    await p.fill('#ask-input', 'Rotá el token secreto del bot de Telegram');
    await p.click('#ask button[type=submit]');
    await p.waitForSelector('#gate.show', { timeout: 40000 });
    await k.wait(800);
    await k.shot('lab-gate');
    await p.click('#gate-yes');
    await p.waitForSelector('#receipt.show', { timeout: 40000 });
    await k.wait(900);
    await k.shot('lab-receipt');
  } },
  mobile: { viewport: { width: 390, height: 844 }, mobile: true, run: async (k) => {
    await k.go(SITE, 6000);
    await k.shot('m-hero');
  } }
};


// ---------------------------------------------------------------- the film
import { h, set, kf, prog, ease, clamp, words, browser, endCard } from '../engine.mjs';

const float = (t, amp = 6, sp = 0.9) => Math.sin(t * sp) * amp;
const win = (L, a, src, url, extra = {}) => {
  const w = browser(L, { src: a(src), url, w: 1360, h: 894, dark: true, ...extra });
  Object.assign(w.el.style, { left: '280px', top: '193px' });
  return w;
};
const rise = (el, t, s = 0.84) => {
  const p = prog(t, 0.05, 1.5, ease.outExpo);
  set(el, { persp: 2600, y: (1 - p) * 380 + float(t, 4), rx: (1 - p) * 24, s: s - 0.04 + p * 0.04 + prog(t, 1.5, 5, ease.inOutSine) * 0.03, o: clamp(p * 2) });
};

export const film = {
  duration: 36.5,
  theme: { bg: '#08090c', ink: '#f4f2ec', muted: '#9a9aa2', accent: '#34d399', card: 'transparent', chip: '#15171d', 'grain-blend': 'overlay', 'grain-o': '.05' },
  blobs: ['#10b981', '#6366f1'],
  blobOpacity: 0.32,
  scenes: [
    {
      from: 0, to: 3.2, in: 0, out: 0.5,
      build(L) {
        const head = words(L, 'Rehice mi portfolio<br><em>desde cero.</em>', { top: 320, size: 150, stagger: 0.1, dur: 1.0 });
        return (t) => head(t - 0.25);
      }
    },
    {
      from: 3.2, to: 7.8,
      build(L, a) {
        const head = words(L, 'ignaciopalmeri<em>.dev</em>', { top: 70, size: 76 });
        const w = win(L, a, 'hero.png', 'ignaciopalmeri.dev');
        return (t) => { head(t); rise(w.el, t); };
      }
    },
    {
      from: 7.8, to: 13.4,
      build(L, a) {
        const head = words(L, '10 proyectos online, <em>cada uno con su demo.</em>', { top: 70, size: 68 });
        const ids = ['jobbot', 'prode', 'fulbotracker', 'polytools', 'dulces', 'piscubi'];
        const W = 540, H = 304, G = 26, x0 = (1920 - (3 * W + 2 * G)) / 2, y0 = 270;
        const cards = ids.map((id, i) => {
          const c = h('div', 'card', L, { width: `${W}px`, height: `${H}px`, left: `${x0 + (i % 3) * (W + G)}px`, top: `${y0 + Math.floor(i / 3) * (H + G)}px`, borderRadius: '18px', boxShadow: '0 0 0 1px rgba(255,255,255,.08), 0 30px 70px -25px rgba(0,0,0,.8)' });
          const im = h('img', '', c); im.src = a(`film-${id}.png`); im.style.cssText = 'width:100%;height:100%;object-fit:cover';
          return c;
        });
        return (t) => {
          head(t);
          cards.forEach((c, i) => {
            const d = (i % 3) * 0.1 + Math.floor(i / 3) * 0.2;
            const p = prog(t, 0.2 + d, 1.3 + d, ease.outExpo);
            const hi = Math.max(0, 1 - Math.abs(t - (2.4 + i * 0.45)) / 0.4);
            set(c, { persp: 1800, y: (1 - p) * 260 - hi * 12, rx: (1 - p) * 35, s: 0.9 + p * 0.1 + hi * 0.04, o: clamp(p * 2) });
            c.style.boxShadow = `0 0 0 ${1 + hi * 2}px rgba(52,211,153,${0.08 + hi * 0.8}), 0 30px 70px -25px rgba(0,0,0,.8)`;
          });
        };
      }
    },
    {
      from: 13.4, to: 19.6,
      build(L, a) {
        const head = words(L, 'Mi sistema de agentes, <em>en 3D.</em>', { top: 70, size: 72 });
        const w1 = win(L, a, 'lab.png', 'ignaciopalmeri.dev/lab');
        const w2 = win(L, a, 'lab-gate.png', 'ignaciopalmeri.dev/lab');
        return (t) => {
          head(t);
          rise(w1.el, t);
          rise(w2.el, t);
          w2.el.style.opacity = prog(t, 2.8, 3.4);
        };
      }
    },
    {
      from: 19.6, to: 23.8,
      build(L, a) {
        const head = words(L, '¿Poco tiempo? <em>30 segundos.</em>', { top: 70, size: 72 });
        const w = win(L, a, 'recruiter.png', 'ignaciopalmeri.dev');
        return (t) => {
          head(t);
          const z = prog(t, 1.4, 3.6, ease.inOutCubic);
          w.el.style.transformOrigin = '30% 55%';
          rise(w.el, t, 0.84 + z * 0.22);
        };
      }
    },
    {
      from: 23.8, to: 28.0,
      build(L, a) {
        const head = words(L, 'Y lo que hago <em>cuando no programo.</em>', { top: 70, size: 72 });
        const w = win(L, a, 'sidequests.png', 'ignaciopalmeri.dev · Side Quests');
        return (t) => { head(t); rise(w.el, t); };
      }
    },
    {
      from: 28.0, to: 31.8,
      build(L, a) {
        const head = words(L, 'Pensado <em>para el celu.</em>', { top: 70, size: 72 });
        const phone = h('div', 'card', L, { width: '380px', height: '822px', left: '770px', top: '190px', borderRadius: '48px', border: '10px solid #1b1d24', background: '#000', boxShadow: '0 50px 120px -30px rgba(0,0,0,.9)' });
        const im = h('img', '', phone); im.src = a('m-hero.png'); im.style.cssText = 'width:100%;height:auto';
        return (t) => {
          head(t);
          const p = prog(t, 0.05, 1.4, ease.outExpo);
          set(phone, { persp: 2200, y: (1 - p) * 420 + float(t, 6), ry: (1 - p) * -30 + float(t, 4, 0.6), s: 0.86 + p * 0.1, o: clamp(p * 2) });
        };
      }
    },
    {
      from: 31.8, to: 36.5, out: 0,
      build(L) {
        const end = endCard(L, {
          mark: '<span style="font:700 64px Inter;letter-spacing:-.04em;color:#05140e">IP</span>',
          markStyle: { background: 'linear-gradient(135deg,#6ee7b7,#10b981)' },
          name: 'ignaciopalmeri<em>.dev</em>', nameSize: 120, url: 'Busco pasantía o rol trainee · Buenos Aires o remoto',
          chips: ['Python', 'FastAPI', 'Playwright', 'Next.js', 'Agentes de IA'],
          credit: '<b style="color:var(--ink)">Ignacio Palmeri</b> · Estudiante de Gestión IT (UADE)'
        });
        return (t) => end(t, 4.7);
      }
    }
  ]
};

export default { captures, film, webgl: true };
