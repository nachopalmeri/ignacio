// JobBot: the product itself — dashboard, tracker, assistant — not the
// landing's marketing numbers or testimonials.
export default {
  id: 'jobbot',
  out: 'jobbot-demo.mp4',
  url: 'https://jobbot-lime.vercel.app/',
  accent: '#7c5cff',
  accentInk: '#ffffff',
  chapters: 5,
  title: {
    kicker: 'SaaS full-stack · Búsqueda laboral',
    title: 'JobBot',
    text: 'Escanea portales de empleo, filtra por tu perfil y te avisa solo de lo que vale la pena.',
    chips: ['Next.js', 'FastAPI', 'PostgreSQL', 'Webhooks', 'Telegram']
  },
  async run(d) {
    await d.chapter('La promesa, en una pantalla', 'Ofertas nuevas con su porcentaje de match');
    await d.point('h1', { reveal: false, ms: 900 });
    await d.wait(500);
    await d.zoom({ x: 820, y: 40, w: 520, h: 600 }, { max: 1.5, hold: 1800 });
    await d.unzoom();

    await d.chapter('Un asistente para dudas', 'Preguntale al bot sin salir del sitio');
    await d.click('#chatbotToggle', { reveal: false, after: 1200 });
    await d.zoom('#chatbotPanel', { max: 1.6 });
    await d.type('#chatInput', '¿Cómo me ayuda JobBot si soy junior?', { delay: 45 });
    await d.click('#chatSend', { reveal: false, after: 3400 });
    await d.unzoom();
    await d.click('#chatbotClose', { reveal: false, after: 700 });

    await d.chapter('El panel del usuario', 'Objetivo semanal, recomendaciones y próximos pasos');
    await d.reveal('#demo-new', { ms: 2600, align: 0.04 });
    const panel = await d.rect('#demo-new');
    await d.zoom({ x: panel.x, y: panel.y, w: panel.w, h: Math.min(panel.h, 520) }, { max: 1.45, hold: 1400 });
    await d.unzoom(900);
    await d.click((f) => f.locator('.toggle-btn', { hasText: 'Tengo experiencia' }), { after: 1800 });
    await d.click((f) => f.locator('.toggle-btn', { hasText: 'Soy nuevo en IT' }), { after: 1200 });

    await d.chapter('Tracker de postulaciones', 'Empresa, puesto, salario y estado de cada una');
    await d.reveal('#tab-table', { ms: 2000, align: 0.3 });
    await d.zoom('#tab-table', { max: 1.5, hold: 600 });
    await d.spot('#tab-table tbody tr:nth-child(1)', 900);
    await d.spot('#tab-table tbody tr:nth-child(4)', 1200);
    await d.spot(null);
    await d.unzoom();

    await d.chapter('Modo claro y oscuro', 'Toda la interfaz respeta el tema elegido');
    await d.reveal('h1', { ms: 2400 });
    await d.click('#themeToggle', { reveal: false, after: 1600 });
    await d.reveal('#use-cases', { ms: 2200, align: 0.05 });
    await d.wait(1200);
    await d.click('#themeToggle', { reveal: false, after: 1400 });
  }
};
