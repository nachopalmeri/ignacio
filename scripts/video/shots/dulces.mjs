// Dulces Creaciones: a real bakery's site, from gallery to WhatsApp order.
export default {
  id: 'dulces',
  out: 'dulces-demo.mp4',
  url: 'https://dulcescreaciones.vercel.app/',
  accent: '#d9467a',
  accentInk: '#ffffff',
  chapters: 5,
  title: {
    kicker: 'Sitio para un negocio real · Temperley',
    title: 'Dulces Creaciones',
    text: 'Web de una pastelería de autor: galería filtrable, proceso de pedido y SEO local para Zona Sur.',
    chips: ['HTML', 'CSS', 'JavaScript', 'SEO local', 'WhatsApp']
  },
  async prepare(d) {
    // The exit-intent popup is for real visitors; keep it out of the film.
    await d.frame.addStyleTag({ content: '#exit-popup, .exit-popup, [id*="exit-popup"] { display: none !important; }' }).catch(() => {});
  },
  async run(d) {
    await d.chapter('Una marca con identidad', 'Tipografía, paleta y fotos del trabajo real');
    await d.zoom({ x: 30, y: 60, w: 1380, h: 560 }, { max: 1.25, hold: 1500 });
    await d.unzoom();

    await d.chapter('Especialidades', 'Cada tipo de torta con su propia página');
    await d.click('a[href="#especialidades"]', { reveal: false, after: 1800 });
    await d.zoom('#especialidades h2', { max: 1.1, hold: 800 });
    await d.unzoom(700);

    await d.chapter('Galería filtrable', 'Por evento, con vista ampliada de cada diseño');
    await d.click('a[href="#galeria"]', { reveal: false, after: 1600 });
    await d.click('button[data-filter="infantil"]', { after: 1300 });
    await d.click('button[data-filter="tematica"]', { after: 1300 });
    await d.click('button[data-filter="all"]', { after: 1100 });
    await d.click((f) => f.locator('#galeria img').nth(1), { after: 1400 });
    await d.click((f) => f.locator('button', { hasText: '›' }).first(), { reveal: false, after: 1100 });
    await d.click((f) => f.locator('button', { hasText: '›' }).first(), { reveal: false, after: 1100 });
    await d.press('Escape', 900);

    await d.chapter('Cómo pedir, en tres pasos', 'WhatsApp, sabores y seña, retiro en el taller');
    await d.click('a[href="#proceso"]', { reveal: false, after: 1800 });
    await d.zoom('#proceso', { max: 1.3, hold: 1400 });
    await d.unzoom();

    await d.chapter('Preguntas frecuentes', 'Porciones, pagos y conservación, sin escribir a nadie');
    await d.click('a[href="#faq"]', { reveal: false, after: 1800 });
    await d.click((f) => f.locator('#faq summary, #faq button, #faq .faq-question').first(), { after: 1400 });
    await d.click((f) => f.locator('#faq summary, #faq button, #faq .faq-question').nth(1), { after: 1600 });
  }
};
