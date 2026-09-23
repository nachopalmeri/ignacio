// Agents System: the AI workflow this portfolio is built with, as a live graph.
export default {
  id: 'agents-system',
  out: 'agents-system-demo.mp4',
  url: 'https://ignaciop.vercel.app/agents',
  accent: '#10b981',
  accentInk: '#03140d',
  chapters: 4,
  title: {
    kicker: 'Sistema de trabajo con IA',
    title: 'Agents System',
    text: 'Cómo construyo con IA sin perder criterio: agentes con roles claros, flujos documentados y revisión en cada paso.',
    chips: ['Claude Code', 'Agentes', 'Playwright', 'Obsidian', 'GitHub Actions']
  },
  async run(d) {
    await d.chapter('Un equipo de agentes', 'Cada nodo tiene instrucciones propias y un rol');
    await d.reveal('#eco-stage', { ms: 2200, align: 0.02 });
    await d.zoom('#eco-stage', { max: 1.15, hold: 1200 });
    await d.unzoom(800);

    await d.chapter('Qué hace cada uno', 'Click en un agente: su rol, entradas y salidas');
    await d.click((f) => f.locator('.eco-node:not(.system-node)').nth(2), { after: 2600 });
    await d.click('#eco-back-btn', { after: 1400 });
    await d.click((f) => f.locator('.eco-node:not(.system-node)').nth(5), { after: 2600 });
    await d.click('#eco-back-btn', { after: 1200 });

    await d.chapter('Un flujo real, de punta a punta', 'Implementar una feature: plan, build, review, test, ship');
    await d.click((f) => f.locator('.wf-item').nth(0), { after: 6500 });

    await d.chapter('Revisión entre agentes', 'Un agente revisa lo que escribió otro antes de publicar');
    await d.click((f) => f.locator('.wf-item').nth(3), { after: 6500 });
  }
};
