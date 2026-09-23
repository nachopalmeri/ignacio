// Pisculichi Labs: tooling hub for prediction-market traders.
export default {
  id: 'polytools',
  out: 'polytools-demo.mp4',
  url: 'https://polytools-omega.vercel.app/',
  accent: '#60a5fa',
  accentInk: '#06122a',
  chapters: 4,
  title: {
    kicker: 'Product lab · Prediction markets',
    title: 'Pisculichi Labs',
    text: 'Herramientas para traders de Polymarket: alertas por Telegram, feeds de señales y un directorio curado.',
    chips: ['JavaScript', 'Telegram Bot', 'Polymarket API', 'Vercel']
  },
  async run(d) {
    await d.chapter('Un hub de herramientas', 'Ejecución, alertas y seguimiento de portfolio');
    await d.zoom({ x: 300, y: 60, w: 840, h: 380 }, { max: 1.5, hold: 1600 });
    await d.unzoom();

    await d.chapter('FillSense Bot', 'Avisos en Telegram cuando se completa una orden');
    await d.click('a[href="#tools"]', { reveal: false, after: 1800 });
    await d.zoom('#tools', { max: 1.5, hold: 900 });
    await d.point((f) => f.locator('#tools button, #tools a').first(), { reveal: false });
    await d.wait(1200);
    await d.unzoom();

    await d.chapter('Feeds de inteligencia', 'Fuentes recomendadas para anticipar el mercado');
    await d.click('a[href="#alpha"]', { reveal: false, after: 1800 });
    await d.zoom('#alpha', { max: 1.4, hold: 1600 });
    await d.unzoom();

    await d.chapter('Directorio curado', 'A quién seguir, organizado por categoría');
    await d.click('a[href="#directory"]', { reveal: false, after: 1800 });
    await d.zoom('#directory', { max: 1.4, hold: 1600 });
    await d.unzoom();
  }
};
