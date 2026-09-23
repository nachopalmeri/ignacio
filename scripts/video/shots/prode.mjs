// Prode Mundial 2026: predictions from many sources, blended into one call.
const tab = (name) => (f) => f.locator('button', { hasText: name }).first();

export default {
  id: 'prode',
  out: 'prode-demo.mp4',
  url: 'https://prode-mundial-2026-ten-omega.vercel.app/prode-mundial-2026.html',
  accent: '#3b82f6',
  accentInk: '#ffffff',
  chapters: 5,
  title: {
    kicker: 'Motor estadístico · Mundial 2026',
    title: 'Prode Mundial',
    text: 'Junta las predicciones de muchas fuentes y modelos de IA, las pondera y arma un consenso por partido.',
    chips: ['JavaScript', 'Estadística', 'Ponderación', 'Chart.js']
  },
  async run(d) {
    await d.chapter('Próximos partidos', 'Resultado sugerido y nivel de consenso de las fuentes');
    await d.zoom({ x: 60, y: 100, w: 720, h: 330 }, { max: 1.7, hold: 1800 });
    await d.unzoom();
    await d.scroll(620, 2200);

    await d.chapter('¿Acertaron?', 'Partidos jugados contra lo que predijo cada fuente');
    await d.scroll(520, 2000);
    await d.wait(900);
    await d.zoom({ x: 60, y: 200, w: 760, h: 380 }, { max: 1.6, hold: 1600 });
    await d.unzoom();

    await d.chapter('Ranking de fuentes', 'Puntaje acumulado de cada modelo e IA');
    await d.click(tab('Comparativa 13 IA'), { after: 1400 });
    await d.reveal(tab('Comparativa 13 IA'), { align: 0.08, ms: 900 });
    await d.wait(800);
    await d.scroll(420, 1800);
    await d.zoom({ x: 20, y: 90, w: 1000, h: 420 }, { max: 1.5, hold: 1400 });
    await d.unzoom(900);

    await d.chapter('Accuracy por modelo', 'Qué tan seguido acierta cada uno');
    await d.reveal(tab('Accuracy IA'), { align: 0.08, ms: 1400 });
    await d.click(tab('Accuracy IA'), { reveal: false, after: 1600 });
    await d.scroll(300, 1600);
    await d.zoom({ x: 20, y: 80, w: 1000, h: 420 }, { max: 1.5, hold: 1400 });
    await d.unzoom(900);

    await d.chapter('Mapa del torneo y dashboard', 'Los 48 equipos y el resumen de la fecha');
    await d.reveal(tab('Mapa Grupos'), { align: 0.08, ms: 1400 });
    await d.click(tab('Mapa Grupos'), { reveal: false, after: 1600 });
    await d.scroll(420, 1800);
    await d.wait(900);
    await d.reveal(tab('Dashboard'), { align: 0.08, ms: 1400 });
    await d.click(tab('Dashboard'), { reveal: false, after: 1600 });
    await d.scroll(360, 1800);
    await d.wait(1400);
  }
};
