// JobBot launch film. `captures` runs in Node (capture.mjs) against the live
// product; `film` runs in the browser (engine.html) and composes the stills.
const SITE = 'https://jobbot-lime.vercel.app/';

export const captures = {
  desktop: { run: async (k) => {
    await k.go(SITE, 4500);
    await k.shot('hero');
    await k.hideFixed();
    await k.el('hero-card', '.hero-visual');
    await k.scrollTo('#jobsGrid', 200); await k.wait(1500);
    await k.each('job', '#jobsGrid > *', 6);
    await k.scrollTo('#tab-table', 200); await k.wait(1500);
    await k.el('table-head', '#tab-table thead');
    await k.each('row', '#tab-table tbody tr', 6);
    await k.scrollTo('#demo-new', 100); await k.wait(2500);
    await k.el('dash', '#demo-new');
    await k.scrollTo('#como-funciona', 60); await k.wait(2000);
    await k.el('steps', '#como-funciona');
  } },
  chat: { run: async (k) => {
    await k.go(SITE, 4000);
    await k.page.click('#chatbotToggle'); await k.wait(1200);
    await k.el('chat-empty', '#chatbotPanel');
    await k.page.fill('#chatInput', '¿Cómo me ayuda JobBot si soy junior?');
    await k.page.click('#chatSend'); await k.wait(7000);
    await k.el('chat', '#chatbotPanel');
  } },
  dark: { run: async (k) => {
    await k.go(SITE, 4000);
    await k.page.click('#themeToggle'); await k.wait(1500);
    await k.shot('hero-dark');
  } },
  mobile: { viewport: { width: 390, height: 844 }, mobile: true, run: async (k) => {
    await k.go(SITE, 4500);
    await k.shot('m-hero');
    await k.scrollTo('#jobsGrid', 120); await k.wait(1500);
    await k.shot('m-jobs');
  } }
};


// ---------------------------------------------------------------- the film
import { h, set, kf, prog, ease, clamp, words, browser, cursor, ring } from '../engine.mjs';

const float = (t, amp = 6, sp = 0.9) => Math.sin(t * sp) * amp;

export const film = {
  duration: 39.5,
  theme: { accent: '#5b45f0', 'accent-soft': '#ece8ff' },
  blobs: ['#7c6cff', '#ffb38a'],
  scenes: [
    { // Cold open: the problem, in one line.
      from: 0, to: 3.2, in: 0, out: 0.5,
      build(L) {
        const head = words(L, 'Buscar trabajo<br><em>es un trabajo.</em>', { top: 330, size: 150, stagger: 0.12, dur: 1.0 });
        return (t) => head(t - 0.25);
      }
    },
    { // The product arrives.
      from: 3.2, to: 8.3,
      build(L, a) {
        const head = words(L, 'JobBot busca <em>por vos.</em>', { top: 70, size: 72 });
        const win = browser(L, { src: a('hero.png'), url: 'jobbot-lime.vercel.app', w: 1360, h: 894 });
        Object.assign(win.el.style, { left: '280px', top: '193px' });
        return (t) => {
          head(t);
          const p = prog(t, 0.1, 1.7, ease.outExpo);
          set(win.el, { persp: 2600, y: (1 - p) * 420 + float(t, 4), rx: (1 - p) * 26, s: 0.8 + p * 0.04 + prog(t, 1.6, 5.2, ease.inOutSine) * 0.05, o: clamp(p * 2) });
        };
      }
    },
    { // The match score, made physical.
      from: 8.3, to: 13.1,
      build(L, a) {
        const head = words(L, 'Cada oferta, con su <em>% de match.</em>', { top: 70, size: 72 });
        const card = h('div', 'card', L, { width: '555px', height: '700px', left: '330px', top: '260px', background: 'transparent', boxShadow: 'none' });
        h('img', '', card).src = a('hero-card.png');
        const r = ring(L, { size: 330, stroke: 20 });
        Object.assign(r.el.style, { left: '1170px', top: '290px' });
        const title = h('div', 'abs', L, { left: '1060px', width: '560px', top: '660px', textAlign: 'center', font: '600 38px Inter', letterSpacing: '-.02em' });
        title.textContent = 'Senior Frontend Developer';
        const sub = h('div', 'abs', L, { left: '1060px', width: '560px', top: '716px', textAlign: 'center', font: '500 26px Inter', color: 'var(--muted)' });
        sub.textContent = 'TechFlow · Remoto · USD 2.400';
        return (t) => {
          head(t);
          const p = prog(t, 0, 1.3, ease.outExpo);
          set(card, { persp: 1800, x: (1 - p) * -160, ry: 22 - p * 14 + float(t, 2, 0.7), rx: 4, y: float(t, 8, 0.8), o: p });
          const q = prog(t, 0.5, 1.2, ease.spring);
          set(r.el, { s: 0.6 + q * 0.4, o: clamp(q * 1.5) });
          r.update(prog(t, 0.6, 2.4, ease.outCubic) * 92);
          const u = prog(t, 1.6, 2.4, ease.outExpo);
          set(title, { y: (1 - u) * 24, o: u, blur: (1 - u) * 8 });
          const v = prog(t, 1.8, 2.6, ease.outExpo);
          set(sub, { y: (1 - v) * 24, o: v, blur: (1 - v) * 8 });
        };
      }
    },
    { // Six offers land, then sort themselves by match.
      from: 13.1, to: 18.5,
      build(L, a) {
        const head = words(L, 'Filtra por <em>tu perfil.</em>', { top: 70, size: 72 });
        const W = 500, H = 222, G = 36;
        const x0 = (1920 - (3 * W + 2 * G)) / 2, y0 = 330;
        const slot = (k) => [x0 + (k % 3) * (W + G), y0 + Math.floor(k / 3) * (H + G)];
        const order = [0, 1, 4, 2, 5, 3]; // DOM order → rank by match (92 87 68 85 45 72)
        const cards = [1, 2, 3, 4, 5, 6].map((n) => {
          const c = h('div', 'card', L, { width: `${W}px`, height: `${H}px`, left: '0', top: '0' });
          h('img', '', c).src = a(`job-${n}.png`);
          return c;
        });
        const chip = h('div', 'abs', L, { left: '0', right: '0', top: '860px', textAlign: 'center' });
        chip.innerHTML = '<span class="chip"><span style="color:var(--accent)">↓</span> Ordenado por match</span>';
        const spin = [-9, 7, -5, 8, -7, 5];
        return (t) => {
          head(t);
          cards.forEach((c, i) => {
            const p = prog(t, 0.25 + i * 0.09, 1.25 + i * 0.09, ease.spring);
            const m = prog(t, 2.5 + order[i] * 0.05, 3.5 + order[i] * 0.05, ease.inOutQuint);
            const [ax, ay] = slot(i), [bx, by] = slot(order[i]);
            const lift = Math.sin(m * Math.PI);
            const dim = i === 4 ? prog(t, 3.8, 4.4) : 0;
            set(c, { x: ax + (bx - ax) * m, y: ay + (by - ay) * m + (1 - p) * 520 - lift * 40, rz: spin[i] * (1 - p), s: 1 + lift * 0.05, o: clamp(p * 1.6) * (1 - dim * 0.62) });
            c.style.filter = dim ? `grayscale(${dim})` : 'none';
            c.style.zIndex = String(10 + Math.round(lift * 10));
          });
          const q = prog(t, 2.3, 2.9, ease.outExpo);
          set(chip, { y: (1 - q) * 30, o: q });
        };
      }
    },
    { // Tracker: every application, in one place.
      from: 18.5, to: 23.3,
      build(L, a) {
        const head = words(L, 'Seguí cada <em>postulación.</em>', { top: 70, size: 72 });
        const group = h('div', 'abs', L, { left: '184px', top: '330px', width: '1552px', height: '400px' });
        const panel = h('div', 'card', group, { left: '-24px', top: '-20px', width: '1600px', height: '440px', background: '#fff' });
        const headImg = h('img', 'abs', group, { width: '1552px', left: '0', top: '0' });
        headImg.src = a('table-head.png');
        const rows = [1, 2, 3, 4].map((n, i) => {
          const im = h('img', 'abs', group, { width: '1552px', left: '0', top: `${65 + i * 83}px`, borderRadius: '14px' });
          im.src = a(`row-${n}.png`);
          return im;
        });
        return (t) => {
          head(t);
          const p = prog(t, 0, 0.9, ease.outExpo);
          set(panel, { o: p, y: (1 - p) * 40 });
          set(headImg, { o: prog(t, 0.2, 0.8), y: 0 });
          const zoom = prog(t, 2.5, 3.8, ease.inOutCubic);
          group.style.transformOrigin = '70% 330px';
          set(group, { s: 1 + zoom * 0.14, y: float(t, 3) - zoom * 30 });
          rows.forEach((r, i) => {
            const q = prog(t, 0.45 + i * 0.16, 1.35 + i * 0.16, ease.outExpo);
            const focus = i === 3 ? zoom : 0;
            set(r, { x: (1 - q) * 120, o: q * (i === 3 ? 1 : 1 - zoom * 0.55), blur: (1 - q) * 10, s: 1 + focus * 0.02 });
            r.style.boxShadow = focus ? `0 0 0 ${3 * focus}px var(--accent), 0 20px 50px -10px rgba(91,69,240,${0.45 * focus})` : 'none';
            r.style.zIndex = i === 3 ? '2' : '1';
          });
        };
      }
    },
    { // The personal dashboard, scrolled like a person would.
      from: 23.3, to: 28.5,
      build(L, a) {
        const head = words(L, 'Tu semana, <em>en un panel.</em>', { top: 70, size: 72 });
        const win = browser(L, { src: a('dash.png'), url: 'jobbot-lime.vercel.app/#demo', w: 1100, h: 684 });
        Object.assign(win.el.style, { left: '410px', top: '270px' });
        const cur = cursor(L);
        return (t) => {
          head(t);
          const p = prog(t, 0, 1.2, ease.outExpo);
          set(win.el, { persp: 2400, y: (1 - p) * 260 + float(t, 3), rx: (1 - p) * 16, o: clamp(p * 2) });
          win.scroll(kf(t, [[0.9, 0], [3.1, 470, ease.inOutCubic]]));
          cur.update(t, [[2.6, 1700, 1100], [3.9, 1398, 722]], [4.2]);
          cur.el.style.opacity = prog(t, 2.5, 2.9);
        };
      }
    },
    { // The assistant answers, line by line.
      from: 28.5, to: 32.3,
      build(L, a) {
        const head = words(L, 'Y un asistente <em>para dudas.</em>', { top: 70, size: 72 });
        const box = h('div', 'card', L, { width: '570px', height: '750px', left: '675px', top: '250px', background: '#fff' });
        const top = h('img', 'abs', box, { width: '570px', left: '0', top: '0' });
        top.src = a('chat.png');
        const bottom = h('img', 'abs', box, { width: '570px', left: '0', top: '0', clipPath: 'inset(85% 0 0 0)' });
        bottom.src = a('chat.png');
        return (t) => {
          head(t);
          const p = prog(t, 0, 1.0, ease.outExpo);
          set(box, { persp: 2000, y: (1 - p) * 200 + float(t, 5), ry: (1 - p) * -14, o: clamp(p * 2) });
          const r = kf(t, [[0.0, 17], [0.55, 17], [0.85, 33, ease.outCubic], [1.3, 33], [2.7, 63, ease.linear], [2.9, 63], [3.2, 84, ease.outCubic]]);
          top.style.clipPath = `inset(0 0 ${100 - r}% 0)`;
        };
      }
    },
    { // Light and dark, one wipe.
      from: 32.3, to: 34.9,
      build(L, a) {
        const head = words(L, 'Claro u <em>oscuro.</em>', { top: 70, size: 72 });
        const light = browser(L, { src: a('hero.png'), url: 'jobbot-lime.vercel.app', w: 1360, h: 894 });
        const dark = browser(L, { src: a('hero-dark.png'), url: 'jobbot-lime.vercel.app', w: 1360, h: 894, dark: true });
        for (const w of [light, dark]) Object.assign(w.el.style, { left: '280px', top: '193px' });
        return (t) => {
          head(t);
          const s = 0.84 + prog(t, 0, 2.6, ease.linear) * 0.03;
          set(light.el, { s, y: float(t, 3) });
          set(dark.el, { s, y: float(t, 3) });
          const w = prog(t, 0.5, 1.7, ease.inOutQuint) * 130;
          dark.el.style.clipPath = `polygon(${110 - w}% 0, 130% 0, 130% 100%, ${90 - w}% 100%)`;
        };
      }
    },
    { // End card.
      from: 34.9, to: 39.5, out: 0,
      build(L) {
        const logo = h('div', 'abs', L, { left: '885px', top: '250px', width: '150px', height: '150px', borderRadius: '38px', background: 'var(--accent)', color: '#fff', display: 'grid', placeItems: 'center', font: '700 92px Inter', boxShadow: '0 30px 60px -20px rgba(91,69,240,.6)' });
        logo.textContent = 'J';
        const name = words(L, 'JobBot', { top: 430, size: 150, stagger: 0 });
        const url = h('div', 'abs', L, { left: '0', right: '0', top: '630px', textAlign: 'center', font: '500 32px Mono', color: 'var(--muted)' });
        url.textContent = 'jobbot-lime.vercel.app';
        const chips = h('div', 'abs', L, { left: '0', right: '0', top: '720px', display: 'flex', justifyContent: 'center', gap: '14px' });
        const cs = ['Next.js', 'FastAPI', 'Supabase', 'Telegram', 'Groq'].map((s) => { const c = h('span', 'chip', chips); c.textContent = s; return c; });
        const by = h('div', 'abs', L, { left: '0', right: '0', top: '950px', textAlign: 'center', font: '500 24px Inter', color: 'var(--muted)' });
        by.innerHTML = 'Hecho por <b style="color:var(--ink)">Ignacio Palmeri</b> · ignaciopalmeri.dev';
        const fade = h('div', 'layer', L, { background: 'var(--bg)' });
        return (t) => {
          const p = prog(t, 0.1, 1.0, ease.spring);
          set(logo, { s: 0.3 + p * 0.7, rz: (1 - p) * -30, o: clamp(p * 2) });
          name(t - 0.4);
          const u = prog(t, 0.9, 1.6, ease.outExpo);
          set(url, { y: (1 - u) * 20, o: u, blur: (1 - u) * 6 });
          cs.forEach((c, i) => { const q = prog(t, 1.2 + i * 0.07, 1.9 + i * 0.07, ease.spring); set(c, { y: (1 - q) * 30, s: 0.8 + q * 0.2, o: clamp(q * 2) }); });
          set(by, { o: prog(t, 1.9, 2.6) });
          fade.style.opacity = prog(t, 3.9, 4.6, ease.inOutSine);
        };
      }
    }
  ]
};

export default { captures, film };
