// Who each agent is, in plain words, plus the portraits from the portfolio's
// agents graph. The routing itself comes from data.json (the real rules).
const P = '/project-assets/agent-avatars/';

export const PROFILES = {
  'agente-principal': { name: 'Principal', photo: `${P}principal.jpg`, role: 'El que hace la mayor parte del trabajo: features, APIs, base de datos, integraciones.', when: 'Es el default. Si ninguna otra regla aplica, va él.' },
  'agente-tests': { name: 'QA / Tests', photo: `${P}tests.jpg`, role: 'Escribe y mantiene tests: Playwright, pytest, regresión y evidencia.', when: 'Lo llamo por nombre cuando quiero cobertura o reproducir un bug.' },
  'agente-docs': { name: 'Docs', photo: `${P}docs.jpg`, role: 'README, guías y handoff, para que otro (o yo en un mes) entienda qué se hizo.', when: 'Lo llamo por nombre al cerrar algo.' },
  'kickoff-architect': { name: 'Kickoff', role: 'Arranca proyectos nuevos: estructura, stack y primeros pasos.', when: 'Lo llamo por nombre el día cero de un proyecto.' },
  'agente-design': { name: 'Diseño', photo: `${P}design.jpg`, role: 'Interfaz, responsive, accesibilidad y motion.', when: 'Cuando el pedido habla de UI, landing, sistema visual.' },
  'agente-seo': { name: 'SEO técnico', role: 'Canonical, sitemap, robots y metadata: que Google entienda el sitio.', when: 'Cuando el pedido habla de SEO técnico.' },
  'agente-growth-seo-geo': { name: 'Growth / GEO', photo: `${P}growth.jpg`, role: 'Keywords y visibilidad en buscadores con IA (ChatGPT, Perplexity).', when: 'Cuando el pedido habla de estrategia GEO o AEO.' },
  'agente-marketing-strategist': { name: 'Marketing', photo: `${P}marketing.jpg`, role: 'Posicionamiento: a quién le hablo, qué digo y por dónde.', when: 'Lo llamo por nombre.' },
  'agente-product-founder': { name: 'Producto', photo: `${P}product.jpg`, role: 'Recorta el MVP: qué validar y cuándo matar o escalar una idea.', when: 'Cuando el pedido habla de MVP, validación de demanda, kill or scale.' },
  'agente-ai-architect': { name: 'Arquitecto IA', photo: `${P}architect.jpg`, role: 'Sistemas con LLMs en producción: RAG, evals, costos y observabilidad.', when: 'Cuando el pedido habla de arquitectura de IA en producción.' },
  'agente-obsidian-brain': { name: 'Obsidian', role: 'Mi segundo cerebro: notas, MOCs y memoria de lo que aprendo.', when: 'Cuando el pedido habla de Obsidian o del vault.' },
  'agente-academic-tutor': { name: 'Tutor UADE', role: 'Me prepara para parciales con ejercicios y feedback.', when: 'Cuando el pedido habla de parciales o de practicar una materia.' },
  'agente-x-content-strategist': { name: 'Contenido X', photo: `${P}content.jpg`, role: 'Posts para X con mi voz.', when: 'Lo llamo por nombre.' },
  'agente-code-reviewer': { name: 'Code review', photo: `${P}reviewer.jpg`, role: 'Revisa código antes de integrar: bugs, riesgos y calidad.', when: 'Cuando el pedido pide revisar un PR o un diff.' },
  'agente-researcher': { name: 'Researcher', photo: `${P}researcher.jpg`, role: 'Investiga documentación oficial y alternativas antes de implementar.', when: 'Cuando hay que investigar, o en paralelo con otros.' },
  'workflow-pruner': { name: 'Podador', role: 'Limpia el propio sistema: saca workflows que ya no se usan.', when: 'Lo llamo por nombre.' },
  'agente-security-auditor': { name: 'Seguridad', photo: `${P}security.jpg`, role: 'Secretos, permisos y dependencias. Frena lo peligroso.', when: 'Todo lo que toca credenciales, pagos, producción, mensajes externos o borrados.' },
  'agente-release-manager': { name: 'Release', photo: `${P}release.jpg`, role: 'Changelog, validación y publicación a producción.', when: 'Cuando el pedido es publicar un release en producción.' },
  'agente-mcp-architect': { name: 'Herramientas', photo: `${P}mcp.jpg`, role: 'Evalúa integraciones (MCP) y permisos antes de sumarlas.', when: 'Lo llamo por nombre.' }
};

export const LANE_INFO = {
  SIMPLE: { title: 'SIMPLE', short: 'Un agente, directo', long: 'Algo chico o general: lo hace un solo agente, sin revisores extra.' },
  SPECIALIZED: { title: 'SPECIALIZED', short: 'Un especialista', long: 'El tema cambia cómo se hace (SEO, diseño, IA…): lo toma el especialista.' },
  PARALLEL: { title: 'PARALLEL', short: 'Varios a la vez', long: 'Pedís trabajos independientes en paralelo: se reparten entre varios agentes.' },
  HIGH_RISK: { title: 'HIGH_RISK', short: 'Pide tu aprobación', long: 'Producción, pagos, credenciales, mensajes externos o borrados: nada se ejecuta sin tu OK.' }
};

// Pedidos de ejemplo con mis proyectos. El carril lo decide el router en vivo.
export const MISSIONS = [
  'Agregá un filtro por salario a JobBot',
  'Revisá el SEO técnico del portfolio: canonical y sitemap',
  'Rotá el token secreto del bot de Telegram',
  'Investigá en paralelo Supabase vs Firebase para FranquiYA',
  'Diseñá una landing page responsive para Dulces Creaciones',
  'Preparame para el parcial de Sistemas de Información',
  'Armá una estrategia GEO para que me encuentren en ChatGPT',
  'Borrá todos los datos de clientes de la base',
  'Organizá mi vault de Obsidian'
];

// Turns a routing regex into readable words, or null when it's too regex-y.
export function readable(pattern) {
  const s = pattern.replace(/\\b/g, '').replace(/\(\?:([^()]*)\)\??/g, (_m, g) => g.split('|')[0]).replace(/\\w\*/g, '');
  return /[\\.{}[\]()|?*+]/.test(s) ? null : s.trim();
}
