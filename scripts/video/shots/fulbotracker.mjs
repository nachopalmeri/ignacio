// FútbolTracker: register a real match and watch the dashboard react.
const seed = [
  ['2026-08-30', 'Canchas del Centro', 2, 'win', 24000],
  ['2026-09-06', 'Club Temperley F5', 0, 'loss', 22000],
  ['2026-09-13', 'Canchas del Centro', 3, 'win', 24000],
  ['2026-09-17', 'La Bombonera F7', 1, 'draw', 30000]
];

export default {
  id: 'fulbotracker',
  out: 'fulbotracker-demo.mp4',
  url: 'https://fulbotracker.vercel.app/',
  accent: '#65c728',
  accentInk: '#0b1a02',
  chapters: 5,
  title: {
    kicker: 'Proyecto personal · App web',
    title: 'FútbolTracker',
    text: 'Registrá cada partido, dividí el costo de la cancha y mirá tus estadísticas crecer.',
    chips: ['JavaScript', 'Tailwind', 'Chart.js', 'localStorage']
  },
  // A few earlier matches so the charts have a story before the camera rolls.
  async prepare(d) {
    const f = d.frame;
    for (const [date, place, goals, result, cost] of seed) {
      await f.locator('a[href="#registrar"]').first().evaluate((e) => e.click());
      await f.fill('#date', date);
      await f.fill('#location', place);
      await f.fill('#goals', String(goals));
      await f.locator(`input[name=result][value=${result}]`).evaluate((e) => e.click());
      await f.fill('#totalCost', String(cost));
      await f.locator('#matchForm button', { hasText: '50%' }).first().evaluate((e) => e.click());
      await f.locator('#matchForm button[type=submit]').evaluate((e) => e.click());
      await d.wait(400);
    }
    await f.locator('a[href="#dashboard"]').first().evaluate((e) => e.click());
    await f.evaluate(() => window.scrollTo(0, 0));
  },
  async run(d) {
    await d.chapter('Tu temporada de un vistazo', 'Partidos, goles y plata invertida, calculados solos');
    await d.zoom({ x: 280, y: 120, w: 1140, h: 140 }, { hold: 1400 });
    await d.zoom({ x: 280, y: 260, w: 1140, h: 400 }, { max: 1.35, hold: 1600 });
    await d.unzoom();

    await d.chapter('Cargar un partido nuevo', 'Fecha, cancha, goles y resultado');
    await d.click('a[href="#registrar"]', { after: 900 });
    await d.zoom({ x: 420, y: 130, w: 860, h: 400 }, { max: 1.5 });
    await d.type('#location', 'Canchas del Centro');
    await d.click('#goals', { after: 200 });
    await (await d.el('#goals')).fill('');
    await (await d.el('#goals')).pressSequentially('4', { delay: 120 });
    await d.click((f) => f.locator('#matchForm label', { hasText: 'Ganamos' }).first(), { after: 700 });

    await d.chapter('Dividir la cancha', 'Pone el total y tu porcentaje: calcula lo que te toca');
    await d.reveal('#totalCost', { align: 0.35 });
    await d.zoom({ x: 420, y: 250, w: 860, h: 320 }, { max: 1.6, ms: 1000 });
    await d.type('#totalCost', '28000', { delay: 110 });
    await d.click((f) => f.locator('#matchForm button', { hasText: '50%' }), { after: 500 });
    await d.click((f) => f.locator('#matchForm button', { hasText: '20%' }), { after: 1400 });
    await d.click((f) => f.locator('#matchForm button', { hasText: '50%' }), { after: 1200 });
    await d.unzoom(900);
    await d.click('#matchForm button[type=submit]', { after: 1500 });

    await d.chapter('El dashboard se actualiza', 'Cinco partidos, nueve goles, gráficos al día');
    await d.click('a[href="#dashboard"]', { after: 1200 });
    await d.zoom({ x: 280, y: 120, w: 1140, h: 140 }, { hold: 1200 });
    await d.unzoom();
    await d.scroll(520, 1800);
    await d.wait(1200);
    await d.scroll(-520, 1400);

    await d.chapter('Torneos entre amigos', 'Tabla de posiciones y pozo de premios');
    await d.click('a[href="#torneos"]', { after: 1000 });
    await d.click((f) => f.locator('button', { hasText: 'Crear Torneo' }).first(), { after: 1000 });
    await d.type('#tournamentName', 'Copa Primavera 2026', { delay: 45 });
    await d.type('#tournamentFriends', 'Nacho, Juan, Pedro, Luis, Tomi', { delay: 40 });
    await d.type('#tournamentPrizePool', '50000', { delay: 90 });
    await d.click('#createTournamentBtn', { after: 2200 });
  }
};
