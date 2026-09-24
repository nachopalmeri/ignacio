// Lab copy in Spanish and English. The language follows the portfolio:
// ?lang= first, then the saved choice (same origin, same localStorage key),
// then the browser (no Spanish at all → English).
export const LANG = (() => {
  const q = new URLSearchParams(location.search).get('lang');
  if (q === 'es' || q === 'en') return q;
  try {
    const saved = localStorage.getItem('portfolio-lang');
    if (saved === 'es' || saved === 'en') return saved;
  } catch (_e) {}
  const langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'es'];
  return langs.some((l) => /^es\b/i.test(l)) ? 'es' : 'en';
})();

const STRINGS = {
  es: {
    title: 'Centro de mando · Ignacio Palmeri',
    kicker: 'Router en vivo · agents-system',
    h1: 'Centro de <em>mando</em>',
    intro: 'Así decide mi sistema de agentes quién hace cada tarea. Escribile un pedido y mirá a quién se lo da y por qué.',
    sound: 'Sonido', whatIsThis: '¿Qué es esto?', runLong: 'Correr las ', runShort: '34 pruebas', full: 'Pantalla completa ↗', back: '← Portfolio',
    request: 'Pedido', checks: 'Qué revisa el router, en orden',
    placeholder: 'Pedile algo, como a un equipo: «Revisá el SEO técnico del sitio»', inputLabel: 'Pedido para el sistema', send: 'Enviar',
    close: 'Cerrar', next: 'Siguiente', start: 'Empezar', skip: 'Saltar',
    gateTitle: 'Esto necesita <em>tu OK.</em>', approve: 'Aprobar', cancel: 'Cancelar',
    gateText: (t, reason) => `«${t}» cae en HIGH_RISK (${reason}). En el sistema real ningún agente toca credenciales, pagos, producción, mensajes externos ni borra datos sin una aprobación explícita. Lo decidís vos.`,
    foot: 'Simulación visual. La decisión la toma una copia en JS de <code>orchestrator/router.ps1</code> con las reglas y los evals de <a href="https://github.com/nachopalmeri/agents-system" target="_blank" rel="noopener">nachopalmeri/agents-system</a>. No ejecuta agentes ni manda nada a ningún lado.',
    fallback: 'No se pudo cargar la escena 3D (sin WebGL, o algún bloqueador de scripts). El router funciona igual: escribile un pedido abajo.',
    loading: 'Cargando el centro de mando',
    steps: { riesgo: '¿Es riesgoso?', 'agente explícito': '¿Nombra a un agente?', paralelismo: '¿Pide trabajo en paralelo?', especialista: '¿Es de un tema especial?', SIMPLE: 'Nada de lo anterior → SIMPLE' },
    no: 'No',
    details: {},
    cancelled: (lane) => `No se ejecuta: era ${lane} y no lo aprobaste. En el sistema real pasa lo mismo, sin tu OK no se toca nada.`,
    withHelp: (who, helpers) => `Lo encara ${who} con ayuda de ${helpers}.`,
    alone: (who) => `Lo hace ${who}, solo.`,
    riskExtra: ' Recién arranca con tu aprobación y tiene que pasar por <b>validation.md</b>: evidencia antes de darlo por cerrado.',
    workflow: (w) => ` Sigue el workflow <b>${w}</b>.`,
    budgetLine: (i, r) => ` Tiene hasta ${i} intentos y ${r} replanes; si falla igual, se frena en vez de girar en falso.`,
    iterations: 'intentos', iterationsHint: 'Cuántas vueltas de trabajo puede dar',
    replans: 'replanes', replansHint: 'Cuántas veces puede rehacer el plan',
    agentsMax: 'agentes máx.', agentsMaxHint: 'Cuántos agentes pueden trabajar a la vez',
    rawRoute: 'Ver la ruta técnica',
    whenTitle: '¿Cuándo le toca?', tryIt: (t) => `Probar: «${t}»`, seeWhat: (n) => `${n}: ver qué hace`,
    evalsProgress: (ok, n, title) => `Pruebas del repo: <b>${ok}/${n}</b> ✓<br><span>${title}</span>`,
    evalsDone: (ok, n) => `<b>${ok}/${n}</b> pruebas del repo pasan: para cada pedido de prueba, el router elige el carril y el agente que el caso espera.`,
    legendLabel: 'Carriles del router',
    tour: [
      ['Mi sistema de agentes', 'Uso 19 asistentes de IA para construir mis proyectos (JobBot, este portfolio…). Cada uno tiene un rol: programar, testear, diseñar, cuidar la seguridad.'],
      ['El router, en el centro', 'Cuando le pido algo en lenguaje normal, el router decide quién lo hace. No adivina: sigue reglas que escribí, en un orden fijo.'],
      ['4 carriles', 'SIMPLE, SPECIALIZED, PARALLEL y HIGH_RISK. Cada uno tiene su portal y sus límites. Lo riesgoso (producción, pagos, credenciales) siempre pide mi aprobación.'],
      ['Probalo', 'Tocá un agente para ver qué hace, elegí una misión de abajo o escribí tu propio pedido.']
    ]
  },
  en: {
    title: 'Command center · Ignacio Palmeri',
    kicker: 'Live router · agents-system',
    h1: 'Command <em>center</em>',
    intro: 'This is how my agent system decides who does each task. Send it a request and watch who gets it and why.',
    sound: 'Sound', whatIsThis: 'What is this?', runLong: 'Run the ', runShort: '34 tests', full: 'Full screen ↗', back: '← Portfolio',
    request: 'Request', checks: 'What the router checks, in order',
    placeholder: 'Ask it like you would a team: “Review the technical SEO of the site”', inputLabel: 'Request for the system', send: 'Send',
    close: 'Close', next: 'Next', start: 'Start', skip: 'Skip',
    gateTitle: 'This needs <em>your OK.</em>', approve: 'Approve', cancel: 'Cancel',
    gateText: (t, reason) => `“${t}” falls into HIGH_RISK (${reason}). In the real system no agent touches credentials, payments, production, external messages or deletes data without explicit approval. Your call.`,
    foot: 'Visual simulation. The decision is made by a JS copy of <code>orchestrator/router.ps1</code> with the rules and evals from <a href="https://github.com/nachopalmeri/agents-system" target="_blank" rel="noopener">nachopalmeri/agents-system</a>. It doesn’t run agents or send anything anywhere.',
    fallback: 'The 3D scene couldn’t load (no WebGL, or a script blocker). The router still works: send it a request below.',
    loading: 'Loading the command center',
    steps: { riesgo: 'Is it risky?', 'agente explícito': 'Does it name an agent?', paralelismo: 'Does it ask for parallel work?', especialista: 'Is it a specialist topic?', SIMPLE: 'None of the above → SIMPLE' },
    no: 'No',
    details: {
      'sin credenciales, pagos, producción, mensajes externos ni borrados': 'no credentials, payments, production, external messages or deletions',
      'no nombra a ningún agente': 'it doesn’t name any agent',
      'no pide agentes en paralelo': 'it doesn’t ask for agents in parallel',
      'ningún dominio especial': 'no special domain',
      'el menor componente suficiente': 'the smallest component that does the job'
    },
    cancelled: (lane) => `Not executed: it was ${lane} and you didn’t approve it. The real system does the same: without your OK nothing gets touched.`,
    withHelp: (who, helpers) => `${who} takes it, with help from ${helpers}.`,
    alone: (who) => `${who} does it, alone.`,
    riskExtra: ' It only starts after your approval and has to go through <b>validation.md</b>: evidence before calling it done.',
    workflow: (w) => ` It follows the <b>${w}</b> workflow.`,
    budgetLine: (i, r) => ` It gets up to ${i} attempts and ${r} re-plans; if it still fails, it stops instead of spinning.`,
    iterations: 'attempts', iterationsHint: 'How many work loops it may run',
    replans: 're-plans', replansHint: 'How many times it may redo the plan',
    agentsMax: 'agents max', agentsMaxHint: 'How many agents may work at once',
    rawRoute: 'See the technical route',
    whenTitle: 'When does it get picked?', tryIt: (t) => `Try: “${t}”`, seeWhat: (n) => `${n}: see what it does`,
    evalsProgress: (ok, n, title) => `Repo tests: <b>${ok}/${n}</b> ✓<br><span>${title}</span>`,
    evalsDone: (ok, n) => `<b>${ok}/${n}</b> repo tests pass: for every test request, the router picks the lane and the agent the case expects.`,
    legendLabel: 'Router lanes',
    tour: [
      ['My agent system', 'I use 19 AI assistants to build my projects (JobBot, this portfolio…). Each has a role: coding, testing, design, security.'],
      ['The router, in the middle', 'When I ask for something in plain language, the router decides who does it. It doesn’t guess: it follows rules I wrote, in a fixed order.'],
      ['4 lanes', 'SIMPLE, SPECIALIZED, PARALLEL and HIGH_RISK. Each has its own gate and limits. Anything risky (production, payments, credentials) always asks for my approval.'],
      ['Try it', 'Click an agent to see what it does, pick a mission below or type your own request.']
    ]
  }
};

export const T = STRINGS[LANG];
export const trDetail = (d) => T.details[d] || String(d).replace('ambiguo', 'ambiguous');

// Static text in index.html carries data-t="key" (textContent) or
// data-t-html="key" (innerHTML); attributes use data-t-attr="attr:key".
export function applyStatic() {
  document.documentElement.lang = LANG;
  document.title = T.title;
  document.querySelectorAll('[data-t]').forEach((el) => { el.textContent = T[el.dataset.t]; });
  document.querySelectorAll('[data-t-html]').forEach((el) => { el.innerHTML = T[el.dataset.tHtml]; });
  document.querySelectorAll('[data-t-attr]').forEach((el) => {
    for (const pair of el.dataset.tAttr.split(';')) {
      const [attr, key] = pair.split(':');
      el.setAttribute(attr, T[key]);
    }
  });
}
