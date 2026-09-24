// Who each agent is, in plain words (Spanish and English), plus the
// portraits from the portfolio's agents graph. The routing itself comes from
// data.json (the real rules).
import { LANG } from '/lab/i18n.js';

const P = '/project-assets/agent-avatars/';

const RAW = {
  'agente-principal': { photo: `${P}principal.jpg`,
    es: ['Principal', 'El que hace la mayor parte del trabajo: features, APIs, base de datos, integraciones.', 'Es el default. Si ninguna otra regla aplica, va él.'],
    en: ['Main', 'Does most of the work: features, APIs, database, integrations.', 'The default. If no other rule applies, it goes to him.'] },
  'agente-tests': { photo: `${P}tests.jpg`,
    es: ['QA / Tests', 'Escribe y mantiene tests: Playwright, pytest, regresión y evidencia.', 'Lo llamo por nombre cuando quiero cobertura o reproducir un bug.'],
    en: ['QA / Tests', 'Writes and maintains tests: Playwright, pytest, regression and evidence.', 'I call it by name when I want coverage or to reproduce a bug.'] },
  'agente-docs': { photo: `${P}docs.jpg`,
    es: ['Docs', 'README, guías y handoff, para que otro (o yo en un mes) entienda qué se hizo.', 'Lo llamo por nombre al cerrar algo.'],
    en: ['Docs', 'READMEs, guides and handoffs, so someone else (or me in a month) understands what was done.', 'I call it by name when wrapping something up.'] },
  'kickoff-architect': {
    es: ['Kickoff', 'Arranca proyectos nuevos: estructura, stack y primeros pasos.', 'Lo llamo por nombre el día cero de un proyecto.'],
    en: ['Kickoff', 'Starts new projects: structure, stack and first steps.', 'I call it by name on day zero of a project.'] },
  'agente-design': { photo: `${P}design.jpg`,
    es: ['Diseño', 'Interfaz, responsive, accesibilidad y motion.', 'Cuando el pedido habla de UI, landing, sistema visual.'],
    en: ['Design', 'Interface, responsive layout, accessibility and motion.', 'When the request is about UI, a landing page or a visual system.'] },
  'agente-seo': {
    es: ['SEO técnico', 'Canonical, sitemap, robots y metadata: que Google entienda el sitio.', 'Cuando el pedido habla de SEO técnico.'],
    en: ['Technical SEO', 'Canonical, sitemap, robots and metadata: making sure Google understands the site.', 'When the request is about technical SEO.'] },
  'agente-growth-seo-geo': { photo: `${P}growth.jpg`,
    es: ['Growth / GEO', 'Keywords y visibilidad en buscadores con IA (ChatGPT, Perplexity).', 'Cuando el pedido habla de estrategia GEO o AEO.'],
    en: ['Growth / GEO', 'Keywords and visibility in AI search (ChatGPT, Perplexity).', 'When the request is about a GEO or AEO strategy.'] },
  'agente-marketing-strategist': { photo: `${P}marketing.jpg`,
    es: ['Marketing', 'Posicionamiento: a quién le hablo, qué digo y por dónde.', 'Lo llamo por nombre.'],
    en: ['Marketing', 'Positioning: who I talk to, what I say and where.', 'I call it by name.'] },
  'agente-product-founder': { photo: `${P}product.jpg`,
    es: ['Producto', 'Recorta el MVP: qué validar y cuándo matar o escalar una idea.', 'Cuando el pedido habla de MVP, validación de demanda, kill or scale.'],
    en: ['Product', 'Cuts the MVP down: what to validate and when to kill or scale an idea.', 'When the request is about an MVP, demand validation, kill or scale.'] },
  'agente-ai-architect': { photo: `${P}architect.jpg`,
    es: ['Arquitecto IA', 'Sistemas con LLMs en producción: RAG, evals, costos y observabilidad.', 'Cuando el pedido habla de arquitectura de IA en producción.'],
    en: ['AI architect', 'LLM systems in production: RAG, evals, costs and observability.', 'When the request is about AI architecture in production.'] },
  'agente-obsidian-brain': {
    es: ['Obsidian', 'Mi segundo cerebro: notas, MOCs y memoria de lo que aprendo.', 'Cuando el pedido habla de Obsidian o del vault.'],
    en: ['Obsidian', 'My second brain: notes, MOCs and memory of what I learn.', 'When the request is about Obsidian or the vault.'] },
  'agente-academic-tutor': {
    es: ['Tutor UADE', 'Me prepara para parciales con ejercicios y feedback.', 'Cuando el pedido habla de parciales o de practicar una materia.'],
    en: ['UADE tutor', 'Gets me ready for exams with exercises and feedback.', 'When the request is about exams or practicing a subject.'] },
  'agente-x-content-strategist': { photo: `${P}content.jpg`,
    es: ['Contenido X', 'Posts para X con mi voz.', 'Lo llamo por nombre.'],
    en: ['X content', 'Posts for X in my voice.', 'I call it by name.'] },
  'agente-code-reviewer': { photo: `${P}reviewer.jpg`,
    es: ['Code review', 'Revisa código antes de integrar: bugs, riesgos y calidad.', 'Cuando el pedido pide revisar un PR o un diff.'],
    en: ['Code review', 'Reviews code before merging: bugs, risks and quality.', 'When the request asks to review a PR or a diff.'] },
  'agente-researcher': { photo: `${P}researcher.jpg`,
    es: ['Researcher', 'Investiga documentación oficial y alternativas antes de implementar.', 'Cuando hay que investigar, o en paralelo con otros.'],
    en: ['Researcher', 'Digs into official docs and alternatives before building.', 'When something needs research, or in parallel with others.'] },
  'workflow-pruner': {
    es: ['Podador', 'Limpia el propio sistema: saca workflows que ya no se usan.', 'Lo llamo por nombre.'],
    en: ['Pruner', 'Cleans up the system itself: removes workflows nobody uses anymore.', 'I call it by name.'] },
  'agente-security-auditor': { photo: `${P}security.jpg`,
    es: ['Seguridad', 'Secretos, permisos y dependencias. Frena lo peligroso.', 'Todo lo que toca credenciales, pagos, producción, mensajes externos o borrados.'],
    en: ['Security', 'Secrets, permissions and dependencies. Stops anything dangerous.', 'Anything touching credentials, payments, production, external messages or deletions.'] },
  'agente-release-manager': { photo: `${P}release.jpg`,
    es: ['Release', 'Changelog, validación y publicación a producción.', 'Cuando el pedido es publicar un release en producción.'],
    en: ['Release', 'Changelog, validation and shipping to production.', 'When the request is to publish a production release.'] },
  'agente-mcp-architect': { photo: `${P}mcp.jpg`,
    es: ['Herramientas', 'Evalúa integraciones (MCP) y permisos antes de sumarlas.', 'Lo llamo por nombre.'],
    en: ['Tools', 'Vets integrations (MCP) and permissions before adding them.', 'I call it by name.'] }
};

export const PROFILES = Object.fromEntries(Object.entries(RAW).map(([id, p]) => {
  const [name, role, when] = p[LANG] || p.es;
  return [id, { name, role, when, photo: p.photo }];
}));

const LANES_TEXT = {
  es: {
    SIMPLE: ['Un agente, directo', 'Algo chico o general: lo hace un solo agente, sin revisores extra.'],
    SPECIALIZED: ['Un especialista', 'El tema cambia cómo se hace (SEO, diseño, IA…): lo toma el especialista.'],
    PARALLEL: ['Varios a la vez', 'Pedís trabajos independientes en paralelo: se reparten entre varios agentes.'],
    HIGH_RISK: ['Pide tu aprobación', 'Producción, pagos, credenciales, mensajes externos o borrados: nada se ejecuta sin tu OK.']
  },
  en: {
    SIMPLE: ['One agent, direct', 'Something small or general: one agent does it, no extra reviewers.'],
    SPECIALIZED: ['A specialist', 'The topic changes how it’s done (SEO, design, AI…): the specialist takes it.'],
    PARALLEL: ['Several at once', 'Independent work in parallel: it’s split across several agents.'],
    HIGH_RISK: ['Asks for your OK', 'Production, payments, credentials, external messages or deletions: nothing runs without your OK.']
  }
};
export const LANE_INFO = Object.fromEntries(Object.entries(LANES_TEXT[LANG]).map(([k, [short, long]]) => [k, { title: k, short, long }]));

// Requests about my projects. The lane is decided live by the router; each
// English line lands on the same agent as its Spanish twin.
const MISSIONS_BY_LANG = {
  es: [
    'Agregá un filtro por salario a JobBot',
    'Revisá el SEO técnico del portfolio: canonical y sitemap',
    'Rotá el token secreto del bot de Telegram',
    'Investigá en paralelo Supabase vs Firebase para FranquiYA',
    'Diseñá una landing page responsive para Dulces Creaciones',
    'Preparame para el parcial de Sistemas de Información',
    'Armá una estrategia GEO para que me encuentren en ChatGPT',
    'Borrá todos los datos de clientes de la base',
    'Organizá mi vault de Obsidian'
  ],
  en: [
    'Add a salary filter to JobBot',
    'Review the technical SEO of my portfolio: canonical and sitemap',
    'Rotate the secret token of the Telegram bot',
    'Research Supabase vs Firebase in parallel for FranquiYA',
    'Design a responsive landing page for Dulces Creaciones',
    'Exam prep for my Information Systems course',
    'Build a GEO strategy so AI search recommends me',
    'Delete all stored customer files',
    'Organize my Obsidian vault notes'
  ]
};
export const MISSIONS = MISSIONS_BY_LANG[LANG];

// Turns a routing regex into readable words, or null when it's too regex-y.
export function readable(pattern) {
  const s = pattern.replace(/\\b/g, '').replace(/\(\?:([^()]*)\)\??/g, (_m, g) => g.split('|')[0]).replace(/\\w\*/g, '');
  return /[\\.{}[\]()|?*+]/.test(s) ? null : s.trim();
}
