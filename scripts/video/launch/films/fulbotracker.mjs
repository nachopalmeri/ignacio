const SITE = 'https://fulbotracker.vercel.app/';
const seed = [
  ['2026-08-30', 'Canchas del Centro', 2, 'win', 24000],
  ['2026-09-06', 'Club Temperley F5', 0, 'loss', 22000],
  ['2026-09-13', 'Canchas del Centro', 3, 'win', 24000],
  ['2026-09-17', 'La Bombonera F7', 1, 'draw', 30000],
  ['2026-09-20', 'Canchas del Centro', 4, 'win', 28000]
];
async function seedMatches(k) {
  const p = k.page;
  for (const [date, place, goals, result, cost] of seed) {
    await p.locator('a[href="#registrar"]').first().evaluate((e) => e.click());
    await p.fill('#date', date);
    await p.fill('#location', place);
    await p.fill('#goals', String(goals));
    await p.locator(`input[name=result][value=${result}]`).evaluate((e) => e.click());
    await p.fill('#totalCost', String(cost));
    await p.locator('#matchForm button', { hasText: '50%' }).first().evaluate((e) => e.click());
    await p.locator('#matchForm button[type=submit]').evaluate((e) => e.click());
    await k.wait(400);
  }
  await p.locator('a[href="#dashboard"]').first().evaluate((e) => e.click());
  await p.evaluate(() => window.scrollTo(0, 0));
  await k.wait(2000);
}
export const captures = {
  desktop: { run: async (k) => {
    const p = k.page;
    await k.go(SITE, 3500);
    await seedMatches(k);
    await k.shot('dash');
    await p.evaluate(() => {
      const card = (id) => document.getElementById(id).closest('[class*="rounded"]');
      card('totalMatches').dataset.cap = 's1';
      card('totalSpent').dataset.cap = 's3';
      const goals = [...document.querySelectorAll('#dashboard p')].find((e) => /Goles Totales/i.test(e.textContent));
      if (goals) goals.closest('[class*="rounded"]').dataset.cap = 's2';
      document.getElementById('statsChart').closest('[class*="rounded"]').dataset.cap = 'c1';
      document.getElementById('goalsChart').closest('[class*="rounded"]').dataset.cap = 'c2';
    });
    await k.hideFixed();
    for (const c of ['s1', 's2', 's3', 'c1', 'c2']) await k.el(c, `[data-cap=${c}]`);
    // A new match, filled in like a person would.
    await p.locator('a[href="#registrar"]').first().evaluate((e) => e.click()); await k.wait(900);
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.fill('#date', '2026-09-24');
    await p.fill('#location', 'Canchas del Centro');
    await p.fill('#goals', '3');
    await p.locator('input[name=result][value=win]').evaluate((e) => e.click());
    await p.fill('#totalCost', '28000');
    await p.locator('#matchForm button', { hasText: '50%' }).first().evaluate((e) => e.click());
    await k.wait(800);
    await k.shot('form');
    await k.el('form-el', '#matchForm');
    // A tournament between friends (reload: hideFixed also hid the modal).
    await k.go(SITE, 2500);
    await p.locator('a[href="#torneos"]').first().evaluate((e) => e.click()); await k.wait(900);
    await p.locator('button', { hasText: 'Crear Torneo' }).first().evaluate((e) => e.click()); await k.wait(900);
    await p.fill('#tournamentName', 'Copa Primavera 2026');
    await p.fill('#tournamentFriends', 'Nacho, Juan, Pedro, Luis, Tomi');
    await p.fill('#tournamentPrizePool', '50000');
    await p.locator('#createTournamentBtn').evaluate((e) => e.click()); await k.wait(1500);
    await p.locator('.swal2-confirm').evaluate((e) => e.click()).catch(() => {}); await k.wait(1200);
    await p.evaluate(() => window.scrollTo(0, 0));
    await k.shot('torneo');
    await k.shot('torneo-card', { clip: { x: 294, y: 135, width: 356, height: 266 } });
    await p.locator('button, a', { hasText: 'Ver Tabla de Posiciones' }).first().evaluate((e) => e.click()); await k.wait(1500);
    await k.shot('tabla');
  } }
};


// ---------------------------------------------------------------- the film
import { h, set, kf, prog, ease, clamp, words, browser, cursor, endCard } from '../engine.mjs';

const float = (t, amp = 6, sp = 0.9) => Math.sin(t * sp) * amp;

// Deterministic confetti: same pieces every render.
function confetti(L, n = 70) {
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const colors = ['#3fae2a', '#f5b400', '#2f6bff', '#ff5a5f', '#ffffff'];
  return Array.from({ length: n }, () => {
    const el = h('div', 'abs', L, { width: `${8 + rnd() * 10}px`, height: `${12 + rnd() * 14}px`, background: colors[Math.floor(rnd() * colors.length)], borderRadius: '2px', left: '0', top: '0' });
    return { el, a: rnd() * Math.PI * 2, v: 700 + rnd() * 900, spin: (rnd() - 0.5) * 1400, drift: (rnd() - 0.5) * 300 };
  });
}

export const film = {
  duration: 31.5,
  theme: { accent: '#2f9e1f', 'accent-soft': '#e7f7e1' },
  blobs: ['#7ad65b', '#6aa7ff'],
  blobOpacity: 0.42,
  scenes: [
    {
      from: 0, to: 3.2, in: 0, out: 0.5,
      build(L) {
        const head = words(L, 'El fútbol del martes<br><em>también tiene números.</em>', { top: 330, size: 128, stagger: 0.1, dur: 1.0 });
        return (t) => head(t - 0.25);
      }
    },
    {
      from: 3.2, to: 8.0,
      build(L, a) {
        const head = words(L, 'FútbolTracker <em>lleva la cuenta.</em>', { top: 70, size: 72 });
        const win = browser(L, { src: a('dash.png'), url: 'fulbotracker.vercel.app', w: 1360, h: 894 });
        Object.assign(win.el.style, { left: '280px', top: '193px' });
        return (t) => {
          head(t);
          const p = prog(t, 0.1, 1.7, ease.outExpo);
          set(win.el, { persp: 2600, y: (1 - p) * 420 + float(t, 4), rx: (1 - p) * 26, s: 0.8 + p * 0.04 + prog(t, 1.6, 4.8, ease.inOutSine) * 0.05, o: clamp(p * 2) });
        };
      }
    },
    {
      from: 8.0, to: 12.6,
      build(L, a) {
        const head = words(L, 'Partidos, goles <em>y plata.</em>', { top: 70, size: 72 });
        const cards = ['s1', 's2', 's3'].map((n, i) => {
          const c = h('div', 'card', L, { width: '563px', height: '170px', left: `${85 + i * 593}px`, top: '440px', borderRadius: '26px' });
          h('img', '', c).src = a(`${n}.png`);
          return c;
        });
        return (t) => {
          head(t);
          cards.forEach((c, i) => {
            const p = prog(t, 0.25 + i * 0.16, 1.25 + i * 0.16, ease.spring);
            set(c, { persp: 1600, y: (1 - p) * 300 + float(t + i * 0.8, 7, 1.1), rx: (1 - p) * 50, rz: (1 - p) * (i - 1) * 6, s: 0.85 + p * 0.15, o: clamp(p * 2) });
          });
        };
      }
    },
    {
      from: 12.6, to: 17.6,
      build(L, a) {
        const head = words(L, 'Cómo viene <em>la temporada.</em>', { top: 70, size: 72 });
        const mk = (n, left) => {
          const c = h('div', 'card', L, { width: '777px', height: '519px', left: `${left}px`, top: '330px', borderRadius: '26px' });
          h('img', '', c).src = a(`${n}.png`);
          return c;
        };
        const donut = mk('c1', 163), line = mk('c2', 980);
        // The donut "paints" around; the line chart draws left to right.
        const ring = h('div', 'abs', donut, { left: `${389 - 190}px`, top: `${265 - 190}px`, width: '380px', height: '380px', borderRadius: '50%' });
        const cover = h('div', 'abs', line, { top: '16%', bottom: '0', right: '0', background: '#fff' });
        return (t) => {
          head(t);
          const p = prog(t, 0.1, 1.2, ease.outExpo), q = prog(t, 0.3, 1.4, ease.outExpo);
          set(donut, { persp: 1800, x: (1 - p) * -200, ry: (1 - p) * 30, y: float(t, 5), o: clamp(p * 2) });
          set(line, { persp: 1800, x: (1 - q) * 200, ry: -(1 - q) * 30, y: float(t + 1, 5), o: clamp(q * 2) });
          const d = prog(t, 0.9, 2.4, ease.inOutCubic) * 360;
          ring.style.background = `conic-gradient(transparent 0deg, transparent ${d}deg, #fff ${d}deg)`;
          cover.style.left = `${5 + prog(t, 1.1, 2.9, ease.inOutSine) * 95}%`;
        };
      }
    },
    {
      from: 17.6, to: 23.0,
      build(L, a) {
        const head = words(L, 'Cargás un partido <em>en segundos.</em>', { top: 70, size: 72, outAt: 2.3 });
        const group = h('div', 'abs', L, { left: '585px', top: '230px', width: '750px', height: '790px' });
        const card = h('div', 'card', group, { width: '750px', height: '790px', left: '0', top: '0', borderRadius: '24px', padding: '0' });
        h('img', '', card).src = a('form-el.png');
        const cur = cursor(L);
        return (t) => {
          head(t);
          const p = prog(t, 0, 1.2, ease.outExpo);
          const z = prog(t, 2.6, 3.8, ease.inOutCubic);
          group.style.transformOrigin = '619px 484px';
          set(group, { persp: 2000, x: -244 * z, y: (1 - p) * 300 + float(t, 4) - z * 150, rx: (1 - p) * 24, s: 0.9 + z * 0.5, o: clamp(p * 2) });
          cur.update(t, [[1.0, 1500, 1060], [2.0, 585 + 440 * 0.9 + 37, 230 + 287 * 0.9 + 40]], [2.2]);
          cur.el.style.opacity = prog(t, 0.9, 1.2) * (1 - prog(t, 2.5, 2.8));
        };
      }
    },
    {
      from: 23.0, to: 27.0,
      build(L, a) {
        const head = words(L, 'Y torneos <em>con amigos.</em>', { top: 70, size: 72 });
        const card = h('div', 'card', L, { width: '668px', height: '499px', left: '626px', top: '320px', borderRadius: '30px' });
        h('img', '', card).src = a('torneo-card.png');
        const bits = confetti(L);
        return (t) => {
          head(t);
          const p = prog(t, 0.1, 1.3, ease.spring);
          set(card, { persp: 1600, ry: (1 - p) * 90, y: float(t, 6), s: 0.9 + p * 0.1, o: clamp(p * 3) });
          const ct = t - 0.9;
          bits.forEach((b) => {
            if (ct < 0) { b.el.style.opacity = 0; return; }
            const x = 960 + Math.cos(b.a) * b.v * ct * 0.9 + b.drift * ct;
            const y = 560 + Math.sin(b.a) * b.v * ct * 0.7 + 900 * ct * ct;
            set(b.el, { x, y, rz: b.spin * ct, o: 1 - prog(ct, 1.6, 2.6) });
          });
        };
      }
    },
    {
      from: 27.0, to: 31.5, out: 0,
      build(L) {
        const end = endCard(L, {
          mark: 'F', markStyle: { background: 'linear-gradient(135deg,#65c728,#2f9e1f)' },
          name: 'Fútbol<em>Tracker</em>', url: 'fulbotracker.vercel.app',
          chips: ['JavaScript', 'Tailwind', 'Chart.js', 'localStorage']
        });
        return (t) => end(t, 4.5);
      }
    }
  ]
};

export default { captures, film };
