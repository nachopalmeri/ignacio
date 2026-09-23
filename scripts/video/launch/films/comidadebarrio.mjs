// Comida de Barrio launch film (comidadebarrio.vercel.app).
const SITE = 'https://comidadebarrio.vercel.app/';

export const captures = {
  desktop: { run: async (k) => {
    const p = k.page;
    await k.go(SITE, 5000);
    await p.evaluate(async () => { for (let y = 0; y < 3000; y += 300) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 150)); } scrollTo(0, 0); });
    await k.wait(1200);
    await k.shot('hero');
    await k.hideFixed();
    await k.el('search', '.search-section .container');
    await k.each('resto', '.featured-section .card', 3);
    // The menu of one place, and a cart with three dishes.
    await p.goto(new URL('secciones/menu.html?restaurante=parrilla-asador', SITE).href).catch(() => {});
    await k.wait(300);
    await p.locator('a[href*="parrilla-asador"]').first().evaluate((e) => e.click()).catch(() => {});
    await k.wait(3500);
    console.log('menu url', p.url());
    await k.shot('menu');
    await k.full('menu-full', 3200);
    const add = (n) => p.locator('button', { hasText: 'Ver Detalles' }).nth(n).locator('xpath=following-sibling::button[1]').evaluate((e) => e.click());
    for (const n of [0, 2, 3]) { await add(n).catch((e) => console.log('add', n, e.message)); await k.wait(700); }
    await k.each('dish', '.card:has(button)', 6);
    await p.goto(new URL('secciones/carrito.html', SITE).href, { waitUntil: 'load' }); await k.wait(3000);
    await k.shot('cart');
  } }
};


// ---------------------------------------------------------------- the film
import { h, set, kf, prog, ease, clamp, words, browser, endCard } from '../engine.mjs';

const float = (t, amp = 6, sp = 0.9) => Math.sin(t * sp) * amp;

export const film = {
  duration: 29,
  theme: { accent: '#f26b1d', 'accent-soft': '#ffe9dc' },
  blobs: ['#ffae7a', '#ffd76a'],
  blobOpacity: 0.45,
  scenes: [
    {
      from: 0, to: 3.2, in: 0, out: 0.5,
      build(L) {
        const head = words(L, '¿Qué se come<br><em>en tu barrio?</em>', { top: 320, size: 150, stagger: 0.1, dur: 1.0 });
        return (t) => head(t - 0.25);
      }
    },
    {
      from: 3.2, to: 7.8,
      build(L, a) {
        const head = words(L, 'Comida de Barrio <em>te lo muestra.</em>', { top: 70, size: 72 });
        const win = browser(L, { src: a('hero.png'), url: 'comidadebarrio.vercel.app', w: 1360, h: 894 });
        Object.assign(win.el.style, { left: '280px', top: '193px' });
        return (t) => {
          head(t);
          const p = prog(t, 0.1, 1.7, ease.outExpo);
          set(win.el, { persp: 2600, y: (1 - p) * 420 + float(t, 4), rx: (1 - p) * 26, s: 0.8 + p * 0.04 + prog(t, 1.6, 4.6, ease.inOutSine) * 0.05, o: clamp(p * 2) });
        };
      }
    },
    {
      from: 7.8, to: 12.2,
      build(L, a) {
        const head = words(L, 'Buscás <em>por antojo.</em>', { top: 70, size: 72 });
        const box = h('div', 'card', L, { width: '1560px', height: '213px', left: '180px', top: '420px', borderRadius: '24px' });
        h('img', '', box).src = a('search.png');
        const typed = h('div', 'abs', box, { left: '362px', top: '10px', width: '560px', height: '42px', background: '#fff', font: '500 22px Inter', lineHeight: '42px', color: '#222' });
        const word = 'empanadas';
        return (t) => {
          head(t);
          const p = prog(t, 0.1, 1.2, ease.outExpo);
          set(box, { persp: 2000, y: (1 - p) * 200 + float(t, 4), rx: (1 - p) * 30, s: 0.95 + prog(t, 1.2, 4.2, ease.inOutSine) * 0.05, o: clamp(p * 2) });
          const n = Math.floor(prog(t, 1.2, 2.3, ease.linear) * word.length);
          const caret = Math.floor(t * 2) % 2 ? '' : '<span style="color:var(--accent)">|</span>';
          typed.innerHTML = word.slice(0, n) + caret;
        };
      }
    },
    {
      from: 12.2, to: 16.8,
      build(L, a) {
        const head = words(L, 'Los del barrio, <em>con puntaje.</em>', { top: 70, size: 72 });
        const cards = [1, 2, 3].map((n, i) => {
          const c = h('div', 'card', L, { width: '470px', height: '514px', left: `${210 + i * 510}px`, top: '300px', borderRadius: '22px' });
          h('img', '', c).src = a(`resto-${n}.png`);
          return c;
        });
        return (t) => {
          head(t);
          cards.forEach((c, i) => {
            const p = prog(t, 0.2 + i * 0.14, 1.3 + i * 0.14, ease.spring);
            set(c, { persp: 1800, x: (1 - i) * 510 * (1 - p), y: (1 - p) * 160 + float(t + i, 5, 1), rz: (1 - p) * (i - 1) * -10, ry: (i - 1) * -6 * p, o: clamp(p * 3) });
          });
        };
      }
    },
    {
      from: 16.8, to: 21.8,
      build(L, a) {
        const head = words(L, 'Del menú <em>al carrito.</em>', { top: 70, size: 72 });
        const win = browser(L, { src: a('menu-full.png'), url: 'comidadebarrio.vercel.app/menu', w: 1360, h: 894 });
        Object.assign(win.el.style, { left: '280px', top: '193px' });
        const badge = h('div', 'abs', L, { left: '1480px', top: '220px', padding: '14px 26px', borderRadius: '999px', background: 'var(--accent)', color: '#fff', font: '700 30px Inter', boxShadow: '0 20px 40px -12px rgba(242,107,29,.6)' });
        return (t) => {
          head(t);
          const p = prog(t, 0, 1.2, ease.outExpo);
          set(win.el, { persp: 2600, y: (1 - p) * 300 + float(t, 3), rx: (1 - p) * 18, s: 0.84, o: clamp(p * 2) });
          win.scroll(kf(t, [[1.0, 0], [4.4, 640, ease.inOutSine]]));
          const n = t < 1.6 ? 0 : t < 2.5 ? 1 : t < 3.4 ? 2 : 3;
          const bump = [1.6, 2.5, 3.4].reduce((m, c) => Math.max(m, 1 - Math.abs(t - c - 0.1) / 0.25), 0);
          badge.textContent = `Carrito · ${n}`;
          set(badge, { s: 1 + clamp(bump) * 0.18, o: prog(t, 1.4, 1.7) });
        };
      }
    },
    {
      from: 21.8, to: 25.2,
      build(L, a) {
        const head = words(L, 'Tu pedido, <em>listo.</em>', { top: 70, size: 72 });
        const win = browser(L, { src: a('cart.png'), url: 'comidadebarrio.vercel.app/carrito', w: 1360, h: 894 });
        Object.assign(win.el.style, { left: '280px', top: '193px' });
        return (t) => {
          head(t);
          const p = prog(t, 0, 1.1, ease.outExpo);
          const z = prog(t, 1.2, 3.0, ease.inOutCubic);
          win.el.style.transformOrigin = '75% 30%';
          set(win.el, { persp: 2600, y: (1 - p) * 300, rx: (1 - p) * 18, s: 0.84 + z * 0.3, o: clamp(p * 2) });
        };
      }
    },
    {
      from: 25.2, to: 29, out: 0,
      build(L) {
        const end = endCard(L, {
          mark: '<svg width="80" height="80" viewBox="0 0 24 24"><path d="M12 3 2 21h20z" fill="#fff"/></svg>',
          name: 'Comida de <em>Barrio</em>', url: 'comidadebarrio.vercel.app',
          chips: ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'localStorage']
        });
        return (t) => end(t, 3.8);
      }
    }
  ]
};

export default { captures, film };
