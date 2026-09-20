function esc(s) { return escapeHtml(String(s)); }
function sqL(field) { if (field == null) return ''; return typeof field === 'string' ? field : field[currentLang] || field.es || ''; }
function sqHash(str) { let h = 7; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0; return h; }
// ═══════════════════ NAVIGATION & TABS ═══════════════════

const UI_COPY = {
  es: {
    nav: { overview: 'Overview', projects: 'Proyectos', agents: 'Sistema de trabajo' },
    hero: {
      tagline: 'Junior AI Automation & Product Engineer',
      title: 'Ignacio Palmeri',
      rolePrefix: 'Construyo',
      availability: 'Disponible para pasantías y roles trainee',
      kicker: 'Estudiante de Gestión IT. Construyo herramientas desplegadas con Python, FastAPI, automatización de procesos y asistentes de IA.',
      description: 'Busco una pasantía o rol trainee donde pueda aportar criterio operativo, aprendizaje rápido y capacidad real de convertir procesos repetitivos en software útil.',
      contactCta: 'Contactame',
      cvCta: 'Descargar CV',
      projectsCta: 'Ver proyectos',
      agentsCta: 'Ver sistema de trabajo',
      githubCta: 'GitHub',
      status: 'Disponible para Trainee / Junior',
      locationLabel: 'Ubicación',
      location: 'Buenos Aires, Argentina',
      focusLabel: 'Foco',
      focus: 'Python - Bots - Dashboards - Product/Fintech',
      oldPortfolio: 'Portfolio anterior',
      email: 'Email'
    },
    console: {
      title: 'ignacio@portfolio',
      launcher: 'Terminal',
      welcome: 'Escribí help para explorar mi perfil.',
      prompt: 'Comandos: about, skills, projects, agents, contact, clear',
      unknown: 'Comando no encontrado',
      help: 'Comandos: about, skills, projects, agents, contact, clear',
      about: 'Ignacio Palmeri - estudiante de Gestión IT que combina experiencia operativa, producto y automatización para construir software útil.',
      skills: 'Python, FastAPI, TypeScript, SQL, Linux, Git, Playwright, automatización de procesos y desarrollo asistido por IA.',
      projects: 'Proyectos principales: JobBot, Agents System, Motor Estadístico Predictivo y Pisculichi Labs. El archivo completo muestra 9 piezas desplegadas o revisables.',
      agents: 'Uso asistentes de IA como parte de un flujo ordenado: plan, construcción, revisión, pruebas, documentación y publicación.',
      contact: 'GitHub: @nachopalmeri | LinkedIn: ignacio | Email: ignaciopalmeri1@gmail.com'
    },
    github: {
      eyebrow: 'Actividad verificable',
      title: 'GitHub como bitácora de trabajo',
      body: 'Actividad pública del perfil nachopalmeri: demos, repositorios, decisiones técnicas y continuidad visible.',
      profileLink: 'Ver perfil de GitHub',
      fallback: 'La actividad pública se muestra cuando está disponible.',
      loading: 'Cargando actividad pública de GitHub…',
      unavailable: 'La actividad pública no está disponible ahora. Podés revisar el perfil.',
      total: 'contribuciones en el último año',
      contribution: 'contribución',
      contributions: 'contribuciones',
      months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      less: 'Menos',
      more: 'Más',
      scrollHint: 'Deslizá el calendario para ver el año completo.',
      calendarLabel: 'Calendario de contribuciones públicas',
      legendLabel: 'De menos a más contribuciones',
      updated: 'Actualizado'
    },
    orchestration: {
      body: 'Evidencia visible.'
    },
    proof: {
      shipped: { label: 'Proyectos', body: 'JobBot, Agents System y motor predictivo.' },
      stack: { label: 'Stack', body: 'Python, FastAPI, PostgreSQL, Linux.' },
      ops: { label: 'Operaciones', body: 'Caja, inventario y auditorías.' }
    },
    about: {
      title: 'Sobre mí',
      p1: 'Estudio Gestión IT y estoy construyendo mi primera experiencia profesional en tecnología. Mezclo criterio de producto y contexto operativo para convertir procesos repetitivos en software útil.',
      p2: 'Trabajo con Python, FastAPI, SQL, Linux, Git y asistentes de IA para construir dashboards, bots, automatizaciones y prototipos desplegados. Me importa más entregar trabajo revisable que parecer senior.',
      p3: 'Mi experiencia en atención al cliente y operaciones me dio presión real, caja, inventario y auditorías. Quiero llevar esa base a soporte IT, QA trainee, automatización o startups.'
    },
    flow: {
      eyebrow: 'Cómo trabajo',
      title: 'Un flujo, cinco pasos',
      body: 'El mismo recorrido en cada proyecto, con asistentes de IA en cada etapa y trabajo revisable al final.',
      plan: { title: 'Plan', body: 'Defino el problema y el alcance antes de escribir una línea.' },
      build: { title: 'Build', body: 'Construyo la versión más chica que se pueda desplegar y usar.' },
      review: { title: 'Review', body: 'Reviso el diff buscando qué se rompe, no qué funciona.' },
      test: { title: 'Test', body: 'Pruebo el camino real en el browser, no solo que compile.' },
      ship: { title: 'Ship', body: 'Despliego y dejo documentado qué cambió y qué quedó pendiente.' },
      commits: 'Contribuciones públicas en el último año',
      projects: 'Proyectos desplegados',
      certs: 'Certificaciones'
    },
    ops: {
      eyebrow: 'Antes de programar',
      title: 'Contexto operativo',
      body: 'Trabajé en el negocio familiar manejando caja, inventario y auditorías. Ahí aprendí cómo se rompen los procesos en la práctica, que es exactamente lo que hoy automatizo.',
      cash: {
        title: 'Caja diaria que tenía que cuadrar',
        body: 'Cierres con plata real de por medio: aprendí que un sistema que falla en silencio es peor que uno que no existe. Por eso hoy valido entradas y registro todo lo que corre.'
      },
      stock: {
        title: 'Inventario y reposición',
        body: 'Contar stock a mano y cruzarlo con lo vendido es el caso de uso de automatización más claro que vi. Mis dashboards salen de haber hecho esa planilla a mano.'
      },
      audit: {
        title: 'Auditorías y control de procesos',
        body: 'Revisar que lo declarado coincida con lo real me dejó el hábito de dejar rastro: logs, documentación y pasos reproducibles en cada cosa que construyo.'
      }
    },
    certifications: {
      title: 'Certificaciones',
      cta: 'Ver credencial',
      rh: { title: 'RH124 / System Administrator', issuer: 'Red Hat' },
      cisco: { title: 'CCNA 1', issuer: 'Cisco Networking Academy' },
      anthropic: { title: 'Claude Code in Action', issuer: 'Anthropic' }
    },
    stack: { title: 'Stack y herramientas', core: 'Core técnico', product: 'Producto y operaciones', ai: 'IA aplicada' },
    projects: {
      title: 'Proyectos destacados',
      archiveTitle: 'Archivo de proyectos',
      featuredBody: 'Un camino por todos los proyectos: producto, trabajo, analytics, comercio y lab.',
      roadmapHint: 'Seguí scrolleando para recorrer el camino',
      archiveBody: 'El archivo completa el rango: CLI, deportes, comercio local y landings.',
      github: 'Ver GitHub',
      watchVideo: 'Ver video',
      status: { active: 'Activo', public: 'Público', demo: 'Demo', local: 'Local' },
      jobbotTitle: 'JobBot - Asynchronous Automation SaaS',
      agentsTitle: 'Sistema de trabajo - flujo con IA',
      jobbot: 'SaaS para búsquedas laborales. Next.js, FastAPI, PostgreSQL, auth, webhooks y pagos.',
      franquiya: 'Motor en Python para predicciones deportivas y dashboard.',
      agents: 'Laboratorio para bots, alertas y herramientas web.',
      roleJobbot: 'Automation SaaS / implementación AI-first',
      roleFranquiya: 'Analytics / producto desplegado',
      roleAgents: 'Laboratorio de producto / prototipado rápido',
      valueJobbot: 'Next.js + FastAPI + PostgreSQL, auth segura, webhooks, Telegram y pagos.',
      valueFranquiya: 'Python, fuentes múltiples, matrices Poisson y dashboard.',
      valueAgents: 'Bots, alertas y experimentos web.',
      proof: 'Ver prueba',
      open: 'Abrir proyecto',
      repo: 'Ver repo',
      exploreAgents: 'Explorar ecosistema'
    },
    agents: {
      eyebrow: 'Sistema real del repo',
      title: 'Sistema de trabajo',
      description: 'Sistema local que uso para construir, revisar y documentar con IA. Prioriza contexto, pruebas y decisiones claras.',
      guide: 'Cada nodo del grafo es un rol con instrucciones propias (planear, construir, revisar, testear, documentar). Resuelve el problema de perder contexto entre tareas: cada rol sabe qué hizo el anterior.',
      guideHint: 'Clickeá cualquier agente del grafo para ver su rol y simular un flujo documentado',
      workflowsTitle: 'Flujos de trabajo',
      workflowsBody: 'Basado en archivos reales de ~/.agents.',
      proofTitle: 'Flujo real',
      proofBody: 'Tres rutas que uso para entregar mejor.',
      workflow1: { label: 'JobBot feature', body: 'Plan, build, review y documentación.' },
      workflow2: { label: 'Portfolio verification', body: 'Playwright, mobile checks y localStorage.' },
      workflow3: { label: 'README handoff', body: 'Setup, diagramas y próximos pasos.' },
      stats: '19 roles reales - Workflows documentados - Memoria local activa',
      back: 'Volver a la red',
      hint: 'Click en un agente para explorar - Simula una ruta documentada',
      stageIdle: 'Esperando workflow',
      steps: { plan: 'Plan', build: 'Build', review: 'Review', test: 'Test', ship: 'Ship' }
    },
    graph: {
      subnodes: 'sub-nodos',
      connections: 'conexiones',
      step: 'Paso',
      complete: 'COMPLETO',
      ready: 'Listo',
      selfImproved: 'Automejora completada: sistema adaptado',
      validated: 'Ecosistema visualizado: evidencia revisada',
      system: 'Sistema'
    },
      contact: {
        eyebrow: 'Contacto',
        title: '¿Buscás un trainee que ya entrega software?',
        body: 'Estoy disponible para pasantía o rol trainee en Buenos Aires o remoto. Escribime y te respondo el mismo día.'
      },
      footer: { text: '2026 Ignacio Palmeri.', contact: 'Contacto' },
      sideQuests: { toggle: 'Side Quests', eyebrow: 'Fuera del código', heading: 'Side Quests', routeSummary: 'ver ruta técnica' },
      faq: {
        title: 'Preguntas frecuentes',
        q1: { q: '¿Cómo pasaste de atender un local a programar?', a: 'Trabajando en el negocio familiar manejando caja, inventario y auditorías vi de cerca cómo se rompen los procesos manuales. Esa fricción real fue lo que me hizo empezar a estudiar Gestión de IT y a construir software para resolverla — no al revés.' },
        q2: { q: '¿Por qué certificaciones tan distintas (Red Hat, Cisco, IA)?', a: 'Porque quiero entender la pila completa, no solo la capa de arriba: RH124 me dio administración de sistemas Linux, CCNA me dio la base de redes y Claude Code in Action me dio un flujo serio para trabajar con IA sin perder criterio propio. Prefiero tener base antes de especializarme.' },
        q3: { q: '¿Cómo usás la IA sin que te termine reemplazando el criterio?', a: 'La uso en cada etapa de mi flujo (plan, build, review, test, documentación), igual que cualquier developer usa hoy su IDE o un linter. Pero decidir qué construir, revisar el diff buscando qué se rompe y probar el camino real en el navegador sigue siendo trabajo mío. Si algo falla, la responsabilidad es mía, no de la IA.' },
        q4: { q: '¿Qué estás buscando ahora?', a: 'Una pasantía o rol trainee, en Buenos Aires o remoto, donde pueda seguir aprendiendo rápido y aportar el criterio operativo que traigo de caja, inventario y auditorías. Escribime directo — te respondo el mismo día.' }
      }
  },
  en: {
    nav: { overview: 'Overview', projects: 'Projects', agents: 'Workflow System' },
    hero: {
      tagline: 'Junior AI Automation & Product Engineer',
      title: 'Ignacio Palmeri',
      rolePrefix: 'Building',
      availability: 'Available for internships and trainee roles',
      kicker: 'IT Management student. I build deployed tools with Python, FastAPI, process automation and AI assistants.',
      description: 'I am looking for an internship or trainee role where I can contribute operational judgment, fast learning and the ability to turn repetitive workflows into useful software.',
      contactCta: 'Get in touch',
      cvCta: 'Download CV',
      projectsCta: 'View projects',
      agentsCta: 'View workflow system',
      githubCta: 'GitHub',
      status: 'Available for Trainee / Junior roles',
      locationLabel: 'Location',
      location: 'Buenos Aires, Argentina',
      focusLabel: 'Focus',
      focus: 'Python - Bots - Dashboards - Product/Fintech',
      oldPortfolio: 'Previous portfolio',
      email: 'Email'
    },
    console: {
      title: 'ignacio@portfolio',
      launcher: 'Terminal',
      welcome: 'Type help to explore my profile.',
      prompt: 'Commands: about, skills, projects, agents, contact, clear',
      unknown: 'Command not found',
      help: 'Commands: about, skills, projects, agents, contact, clear',
      about: 'Ignacio Palmeri - IT Management student combining operations, product and automation to build useful software.',
      skills: 'Python, FastAPI, TypeScript, SQL, Linux, Git, Playwright, process automation and applied AI.',
      projects: 'Main projects: JobBot, Agents System, Sports Predictive Analytics Engine and Pisculichi Labs. The full archive shows 9 deployed or reviewable pieces.',
      agents: 'I use AI assistants inside an ordered workflow: planning, building, review, tests, documentation and shipping.',
      contact: 'GitHub: @nachopalmeri | LinkedIn: ignacio | Email: ignaciopalmeri1@gmail.com'
    },
    github: {
      eyebrow: 'Verifiable activity',
      title: 'Repos you can review',
      body: 'Public proof of work: demos, repos and visible continuity.',
      profileLink: 'View GitHub profile',
      fallback: 'Public activity appears when GitHub is available.',
      loading: 'Loading public GitHub activity…',
      unavailable: 'Public activity is temporarily unavailable.',
      total: 'contributions in the last year',
      contribution: 'contribution',
      contributions: 'contributions',
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      less: 'Less',
      more: 'More',
      scrollHint: 'Swipe the calendar to view the full year.',
      calendarLabel: 'Public contribution calendar',
      legendLabel: 'Less to more contributions',
      updated: 'Updated'
    },
    orchestration: {
      body: 'Visible proof.'
    },
    proof: {
      shipped: { label: 'Projects', body: 'JobBot, Agents System and predictive engine.' },
      stack: { label: 'Stack', body: 'Python, FastAPI, PostgreSQL, Linux.' },
      ops: { label: 'Operations', body: 'Cash handling, inventory and audits.' }
    },
    about: {
      title: 'About me',
      p1: 'I am an IT Management student building my first professional path in technology. I combine product judgment and operational context to turn repetitive processes into useful software.',
      p2: 'I work with Python, FastAPI, SQL, Linux, Git and AI assistants to build dashboards, bots, automations and deployed prototypes. I care more about shipping reviewable work than looking senior.',
      p3: 'My customer service and operations background gave me real pressure, cash handling, inventory and audits. I want to bring that base into IT support, QA trainee, automation or startups.'
    },
    flow: {
      eyebrow: 'How I work',
      title: 'One flow, five steps',
      body: 'The same path on every project, with AI assistants at each stage and reviewable work at the end.',
      plan: { title: 'Plan', body: 'I define the problem and the scope before writing a line.' },
      build: { title: 'Build', body: 'I build the smallest version that can be deployed and used.' },
      review: { title: 'Review', body: 'I read the diff looking for what breaks, not what works.' },
      test: { title: 'Test', body: 'I walk the real path in the browser, not just check that it compiles.' },
      ship: { title: 'Ship', body: 'I deploy and document what changed and what is still pending.' },
      commits: 'Public contributions in the last year',
      projects: 'Deployed projects',
      certs: 'Certifications'
    },
    ops: {
      eyebrow: 'Before writing code',
      title: 'Operations background',
      body: 'I worked in the family business handling the till, inventory and audits. That is where I learned how processes actually break - exactly what I automate today.',
      cash: {
        title: 'A daily till that had to balance',
        body: 'Closing out with real money on the line taught me that a system failing silently is worse than no system at all. That is why I validate inputs and log everything that runs.'
      },
      stock: {
        title: 'Inventory and restocking',
        body: 'Counting stock by hand and reconciling it against sales is the clearest automation case I have seen. My dashboards come from having built that spreadsheet manually.'
      },
      audit: {
        title: 'Audits and process control',
        body: 'Checking that what was declared matched reality left me with the habit of leaving a trail: logs, documentation and reproducible steps in everything I build.'
      }
    },
    certifications: {
      title: 'Certifications',
      cta: 'View credential',
      rh: { title: 'RH124 / System Administrator', issuer: 'Red Hat' },
      cisco: { title: 'CCNA 1', issuer: 'Cisco Networking Academy' },
      anthropic: { title: 'Claude Code in Action', issuer: 'Anthropic' }
    },
    stack: { title: 'Stack and tools', core: 'Technical core', product: 'Product and operations', ai: 'Applied AI' },
    projects: {
      title: 'Featured projects',
      archiveTitle: 'Project archive',
      featuredBody: 'One path through every project: product, workflow systems, analytics, commerce and lab.',
      roadmapHint: 'Keep scrolling to travel the path',
      archiveBody: 'The first four are the core. The rest shows range: CLI, sports, local commerce and deployed landing pages.',
      github: 'View GitHub',
      watchVideo: 'Watch video',
      status: { active: 'Active', public: 'Public', demo: 'Demo', local: 'Local' },
      jobbotTitle: 'JobBot - Asynchronous Automation SaaS',
      agentsTitle: 'Workflow system - AI-fluent process',
      jobbot: 'Full-stack automation SaaS for job-search workflows. Built with Next.js, FastAPI, PostgreSQL, secure auth, webhook handling, Telegram notifications and payment integrations. Shows backend judgment, product thinking and deployment discipline.',
      franquiya: 'Python analytics engine for sports predictions, probability logic and market-style data workflows. It aggregates sources, models scenarios and updates a deployed dashboard for non-technical users.',
      agents: 'Experimental product lab for bots, alerts, prediction-market tools and portfolio systems. Shows domain exploration, fast prototyping and the ability to connect finance, automation and web interfaces.',
      roleJobbot: 'Automation SaaS / AI-first implementation',
      roleFranquiya: 'Analytics / deployed product',
      roleAgents: 'Product lab / rapid prototyping',
      valueJobbot: 'Next.js + FastAPI + PostgreSQL, secure auth, webhooks, Telegram and payments.',
      valueFranquiya: 'Python, multiple sources, Poisson matrices, Monte Carlo simulations and dashboard.',
      valueAgents: 'Bots, alerts and web experiments with explicit prototype scope.',
      proof: 'View proof',
      open: 'Open project',
      repo: 'View repo',
      exploreAgents: 'Explore ecosystem'
    },
    agents: {
      eyebrow: 'Real repo system',
      title: 'Workflow system',
      description: 'A local system I use to build, review and document with AI.',
      guide: 'Each node in the graph is a role with its own instructions (plan, build, review, test, document). It solves context loss between tasks: every role knows what the previous one did.',
      guideHint: 'Click any agent in the graph to see its role and simulate a documented flow',
      workflowsTitle: 'Workflows',
      workflowsBody: 'Based on real ~/.agents files.',
      proofTitle: 'Real flow',
      proofBody: 'Three routes I use to ship better.',
      workflow1: { label: 'JobBot feature', body: 'Plan, build, review and document.' },
      workflow2: { label: 'Portfolio verification', body: 'Playwright, mobile checks and localStorage.' },
      workflow3: { label: 'README handoff', body: 'Setup, diagrams and next steps.' },
      stats: '19 real roles - Documented workflows - Local memory active',
      back: 'Back to graph',
      hint: 'Click an agent to inspect it - Simulate a route',
      stageIdle: 'Waiting for workflow',
      steps: { plan: 'Plan', build: 'Build', review: 'Review', test: 'Test', ship: 'Ship' }
    },
    graph: {
      subnodes: 'sub-nodes',
      connections: 'connections',
      step: 'Step',
      complete: 'COMPLETE',
      ready: 'Ready',
      selfImproved: 'Self-improvement complete: system adapted',
      validated: 'Ecosystem visualized: evidence reviewed',
      system: 'System'
    },
      contact: {
        eyebrow: 'Contact',
        title: 'Looking for a trainee who already ships?',
        body: 'Available for an internship or trainee role in Buenos Aires or remote. Write me and I reply the same day.'
      },
      footer: { text: '2026 Ignacio Palmeri.', contact: 'Contact' },
      sideQuests: { toggle: 'Side Quests', eyebrow: 'Beyond the code', heading: 'Side Quests', routeSummary: 'view technical route' },
      faq: {
        title: 'FAQ',
        q1: { q: 'How did you go from working retail to programming?', a: 'Working at my family business handling cash, inventory and audits, I saw up close how manual processes break. That real friction is what pushed me to start studying IT Management and building software to fix it — not the other way around.' },
        q2: { q: 'Why such different certifications (Red Hat, Cisco, AI)?', a: 'Because I want to understand the whole stack, not just the top layer: RH124 gave me Linux system administration, CCNA gave me networking fundamentals, and Claude Code in Action gave me a real workflow for using AI without losing my own judgment. I prefer having a base before specializing.' },
        q3: { q: 'How do you use AI without it replacing your judgment?', a: "I use it at every stage of my workflow (plan, build, review, test, document), the same way any developer today uses their IDE or a linter. But deciding what to build, reviewing the diff for what breaks, and testing the real path in the browser is still my work. If something fails, that's on me, not the AI." },
        q4: { q: 'What are you looking for right now?', a: "An internship or trainee role, in Buenos Aires or remote, where I can keep learning fast and bring the operational judgment I built handling cash, inventory and audits. Write me directly — I'll reply the same day." }
      }
  }
};

const STORAGE_FALLBACK = new Map();

function safeStorageGet(key, fallback) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return STORAGE_FALLBACK.has(key) ? STORAGE_FALLBACK.get(key) : fallback;
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch {
    return STORAGE_FALLBACK.has(key) ? STORAGE_FALLBACK.get(key) : fallback;
  }
}

function safeStorageSet(key, value) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
      return;
    }
  } catch {
    // Fall through to the in-memory fallback.
  }
  STORAGE_FALLBACK.set(key, value);
}

function secureExternalLinks(root = document) {
  root.querySelectorAll('a[target="_blank"]').forEach((anchor) => {
    const rel = new Set((anchor.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
    rel.add('noopener');
    rel.add('noreferrer');
    anchor.setAttribute('rel', Array.from(rel).join(' '));
  });
}

let currentLang = safeStorageGet('portfolio-lang', 'es');
let currentTheme = safeStorageGet('portfolio-theme', 'light');

function getCopy(path, lang = currentLang) {
  return path.split('.').reduce((value, key) => value && value[key], UI_COPY[lang]) || path;
}

function applyStaticCopy() {
  document.documentElement.lang = currentLang;
  document.documentElement.dataset.theme = currentTheme;
  document.title = 'Ignacio Palmeri - Junior AI Automation & Product Engineer';
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = getCopy(el.dataset.i18n);
  });
  document.querySelectorAll('[data-lang-btn]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.langBtn === currentLang);
  });
  secureExternalLinks(document);
  resetTerminal();
  splitHeroTitle();
  if (document.getElementById('project-carousel')) renderProjectCarousel();
  if (githubContributionData) renderGithubCalendar(githubContributionData);
}

// The hero title enters word by word on load. It has to run after
// applyStaticCopy, which rewrites [data-i18n] nodes via textContent and would
// otherwise wipe the word spans on every language or theme switch.
function splitHeroTitle() {
  const title = document.querySelector('[data-hero-title]');
  if (!title) return;

  const words = title.textContent.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return;

  // Words keep their inline-block box from the first paint, so the entrance
  // animates opacity/transform only and never shifts layout.
  title.innerHTML = words
    .map((word, i) => `<span class="hero-word" style="--word-index:${i}">${escapeHtml(word)}</span>`)
    .join(' ');

  if (prefersReducedMotion()) {
    title.classList.add('is-entered');
    return;
  }
  title.classList.remove('is-entered');
  requestAnimationFrame(() => requestAnimationFrame(() => title.classList.add('is-entered')));
}

let githubContributionData = null;

function isContributionDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isValidGithubContributionData(data) {
  if (
    !data ||
    data.login !== 'nachopalmeri' ||
    data.profileUrl !== 'https://github.com/nachopalmeri' ||
    !Number.isInteger(data.totalContributions) ||
    data.totalContributions < 0 ||
    Number.isNaN(Date.parse(data.updatedAt)) ||
    !Array.isArray(data.weeks) ||
    data.weeks.length < 30 ||
    data.weeks.length > 110
  ) return false;

  return data.weeks.every((week) => isContributionDate(week?.firstDay) && Array.isArray(week.days) && week.days.every((day) => (
    isContributionDate(day?.date) &&
    Number.isInteger(day.weekday) && day.weekday >= 0 && day.weekday <= 6 &&
    Number.isInteger(day.count) && day.count >= 0 &&
    Number.isInteger(day.level) && day.level >= 0 && day.level <= 4
  )));
}

function githubLocale() {
  return currentLang === 'es' ? 'es-AR' : 'en-US';
}

function formatGithubDate(value, options) {
  return new Intl.DateTimeFormat(githubLocale(), { timeZone: 'UTC', ...options }).format(new Date(`${value}T00:00:00.000Z`));
}

function setGithubFallback() {
  const calendar = document.querySelector('[data-github-calendar]');
  const fallback = document.querySelector('[data-github-fallback]');
  const status = document.querySelector('[data-github-status]');
  if (!calendar || !fallback || !status) return;
  calendar.hidden = true;
  calendar.dataset.state = 'fallback';
  fallback.hidden = false;
  status.textContent = getCopy('github.unavailable');
}

function renderGithubCalendar(data) {
  const calendar = document.querySelector('[data-github-calendar]');
  const fallback = document.querySelector('[data-github-fallback]');
  const status = document.querySelector('[data-github-status]');
  const profileLink = document.querySelector('[data-github-profile-link]');
  const total = document.querySelector('[data-github-total]');
  const updated = document.querySelector('[data-github-updated]');
  const months = document.querySelector('[data-github-months]');
  const weeks = document.querySelector('[data-github-weeks]');
  if (!calendar || !fallback || !status || !total || !months || !weeks) return;

  const totalCount = Number(data.totalContributions).toLocaleString(githubLocale());
  const totalLabel = `${totalCount} ${getCopy('github.total')}`;
  total.textContent = totalLabel;
  if (updated) {
    const updatedDate = formatGithubDate(data.updatedAt.slice(0, 10), { month: 'short', day: 'numeric', year: 'numeric' });
    updated.textContent = `${getCopy('github.updated')}: ${updatedDate}`;
  }
  status.textContent = totalLabel;
  if (profileLink) profileLink.href = data.profileUrl;

  months.replaceChildren();
  months.style.gridTemplateColumns = `repeat(${data.weeks.length}, var(--github-cell-size))`;
  let previousMonth = '';
  data.weeks.forEach((week, index) => {
    const monthKey = week.firstDay.slice(0, 7);
    if (monthKey === previousMonth) return;
    previousMonth = monthKey;
    const month = document.createElement('span');
    month.style.gridColumn = String(index + 1);
    month.textContent = formatGithubDate(week.firstDay, { month: 'short' }).replace('.', '');
    months.append(month);
  });

  weeks.replaceChildren();
  weeks.style.gridTemplateColumns = `repeat(${data.weeks.length}, var(--github-cell-size))`;
  data.weeks.forEach((week) => {
    const weekElement = document.createElement('div');
    weekElement.className = 'github-calendar-week';
    weekElement.setAttribute('role', 'group');
    weekElement.setAttribute('aria-label', week.firstDay);
    week.days.forEach((day) => {
      const cell = document.createElement('span');
      const contributionLabel = `${formatGithubDate(day.date, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}: ${day.count} ${getCopy(day.count === 1 ? 'github.contribution' : 'github.contributions')}`;
      cell.className = `github-contribution-cell level-${day.level}`;
      cell.dataset.githubCell = '';
      cell.style.gridRow = String(day.weekday + 1);
      cell.setAttribute('role', 'img');
      cell.setAttribute('aria-label', contributionLabel);
      cell.setAttribute('title', contributionLabel);
      cell.tabIndex = -1;
      weekElement.append(cell);
    });
    weeks.append(weekElement);
  });

  calendar.hidden = false;
  calendar.dataset.state = 'ready';
  fallback.hidden = true;
}

async function setupGithubContributions() {
  const calendar = document.querySelector('[data-github-calendar]');
  const status = document.querySelector('[data-github-status]');
  if (!calendar || !status) return;
  calendar.dataset.state = 'loading';
  status.textContent = getCopy('github.loading');

  // Without a deadline a hung serverless function leaves the panel stuck on
  // "Cargando…" forever, so abort and fall back instead of waiting.
  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  const timeout = setTimeout(() => controller && controller.abort(), 8000);

  try {
    const response = await fetch('/api/github-contributions', {
      headers: { Accept: 'application/json' },
      signal: controller ? controller.signal : undefined
    });
    if (!response.ok) throw new Error('GitHub activity unavailable');
    const data = await response.json();
    if (!isValidGithubContributionData(data)) throw new Error('Invalid GitHub activity response');
    githubContributionData = data;
    renderGithubCalendar(data);
    showCommitCounter(data.totalContributions);
  } catch (_error) {
    setGithubFallback();
  } finally {
    clearTimeout(timeout);
  }
}

function rebuildLocalizedEcosystem() {
  if (!ecoInitialized) return;
  stopWorkflow();
  setupCurrentAgentPortfolioData();
  buildNodes();
  collapseGraph();
  resizeCanvas();
}

const terminalHistory = [];

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function writeTerminal(line, tone = 'muted') {
  const output = document.getElementById('terminal-output');
  if (!output) return;
  terminalHistory.push({ line, tone });
  output.innerHTML = terminalHistory
    .slice(-8)
    .map(item => `<div class="terminal-line terminal-line-${item.tone}">${escapeHtml(item.line)}</div>`)
    .join('');
  output.scrollTop = output.scrollHeight;
}

function resetTerminal() {
  const output = document.getElementById('terminal-output');
  if (!output) return;
  terminalHistory.length = 0;
  writeTerminal(getCopy('console.welcome'));
  writeTerminal(getCopy('console.prompt'), 'accent');
}

function runTerminalCommand(rawCommand) {
  const command = rawCommand.trim().toLowerCase();
  if (!command) return;
  writeTerminal(`$ ${command}`, 'input');
  if (command === 'clear') {
    resetTerminal();
    return;
  }
  const key = `console.${command}`;
  const response = getCopy(key);
  writeTerminal(response === key ? `${getCopy('console.unknown')}: ${command}` : response, response === key ? 'error' : 'muted');
}

function setupTerminal() {
  const form = document.getElementById('terminal-form');
  const input = document.getElementById('terminal-input');
  if (!form || !input) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    runTerminalCommand(input.value);
    input.value = '';
  });

  document.querySelectorAll('[data-terminal-cmd]').forEach((button) => {
    button.addEventListener('click', () => runTerminalCommand(button.dataset.terminalCmd));
  });
}

function setupFloatingConsole() {
  const launcher = document.getElementById('console-launcher');
  const panel = document.getElementById('console-chat');
  const close = document.getElementById('console-close');
  const input = document.getElementById('terminal-input');
  if (!launcher || !panel) return;

  function setOpen(open) {
    panel.classList.toggle('open', open);
    panel.setAttribute('aria-hidden', String(!open));
    launcher.setAttribute('aria-expanded', String(open));
    launcher.classList.toggle('active', open);
    if (open && input) setTimeout(() => input.focus({ preventScroll: true }), 80);
  }

  launcher.addEventListener('click', () => setOpen(!panel.classList.contains('open')));
  close && close.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && panel.classList.contains('open')) setOpen(false);
  });
}

// Personal picks, not scraped poster art - color + typography only, drafts open to editing.



// ═══════════════════ SIDE QUESTS — sala cálida (v4) ═══════════════════
// Datos reales: las 50 películas del diario de Letterboxd + los 5 libros de
// Goodreads. Todo client-side, cálido y confortable.

function sqL(field) { if (field == null) return ''; return typeof field === 'string' ? field : field[currentLang] || field.es || ''; }
function esc(s) { return escapeHtml(String(s)); }
function sqHash(str) { let h = 7; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0; return h; }

const SQ_BOOKS = [
  { title: 'El sueño de los héroes', poster: 'project-assets/side-quests/el-sueno-de-los-heroes.jpg', color: '#c9a05c', cat: { es: 'Libro', en: 'Book' }, meta: 'Adolfo Bioy Casares, 1997',
    why: { es: 'La mejor novela argentina sobre el tiempo y las segundas oportunidades que nunca son iguales.', en: 'The best Argentine novel about time and second chances that are never the same.' },
    intel: { tags: ['fantástico', 'tiempo', 'argentino'], mood: { es: 'onírico y preciso', en: 'dreamlike and precise' }, time: '200 páginas', energy: { es: 'media', en: 'medium' }, bestMoment: { es: 'la primera vuelta al tablero: el tiempo empezando a doblarse', en: 'the first lap around the chessboard: time starting to fold' }, paraQuien: { es: 'para quien quiere tiempo y segundas oportunidades', en: 'for anyone who wants time and second chances' }, snd: 'cozy' } },
  { title: 'Crimen y castigo', poster: 'project-assets/side-quests/crimen-y-castigo.jpg', color: '#c96a5a', cat: { es: 'Libro', en: 'Book' }, meta: 'Fiódor Dostoievski, 1866',
    why: { es: 'Culpa y lógica al límite en 500 páginas que se sienten urgentes.', en: 'Guilt and logic pushed to the limit across 500 pages that still feel urgent.' },
    intel: { tags: ['psicológico', 'culpa', 'clásico'], mood: { es: 'urgente y claustrofóbico', en: 'urgent and claustrophobic' }, time: '500+ páginas', energy: { es: 'alta', en: 'high' }, bestMoment: { es: 'el interrogatorio de Porfiry: ajedrez verbal cien páginas antes del final', en: 'Porfiry\'s interrogation: verbal chess 100 pages before the end' }, paraQuien: { es: 'para quien quiere culpa y lógica al límite', en: 'for anyone who wants guilt and logic at the limit' }, snd: 'dark' } },
  { title: 'The Almanack of Naval Ravikant', poster: 'project-assets/side-quests/naval-almanack.jpg', color: '#d4b45c', cat: { es: 'Libro', en: 'Book' }, meta: 'Eric Jorgenson, 2020',
    why: { es: 'El resumen más denso de decisiones de vida que leí en formato de bolsillo.', en: "The densest life-decisions summary I've read in pocket-book form." },
    intel: { tags: ['decisiones', 'trabajo', 'bolsillo'], mood: { es: 'compacto y pragmático', en: 'compact and pragmatic' }, time: '242 páginas', energy: { es: 'media', en: 'medium' }, bestMoment: { es: 'la sección de apalancamiento: 40 páginas que reordenan cómo laburas', en: 'the leverage section: 40 pages that rewire how you work' }, paraQuien: { es: 'para quien quiere decisiones densas en formato bolsillo', en: 'for anyone who wants dense decisions in pocket form' }, snd: 'focus' } },
  { title: 'The Perks of Being a Wallflower', poster: 'project-assets/side-quests/perks-wallflower.jpg', color: '#6aa8b8', cat: { es: 'Libro', en: 'Book' }, meta: 'Stephen Chbosky, 1999',
    why: { es: 'Adolescencia honesta, sin la nostalgia impostada del género.', en: "Honest teenage years, without the genre's usual fake nostalgia." },
    intel: { tags: ['coming of age', 'honesto', 'breve'], mood: { es: 'tierno y directo', en: 'tender and direct' }, time: '213 páginas', energy: { es: 'media-baja', en: 'medium-low' }, bestMoment: { es: 'we are infinite en el túnel', en: 'we are infinite in the tunnel' }, paraQuien: { es: 'para quien quiere adolescencia honesta', en: 'for anyone who wants honest adolescence' }, snd: 'cozy' } },
  { title: 'Flowers for Algernon', poster: 'project-assets/side-quests/flowers-algernon.jpg', color: '#d4799a', cat: { es: 'Libro', en: 'Book' }, meta: 'Daniel Keyes, 1966',
    why: { es: 'La ciencia ficción más triste y más humana que leí: inteligencia y pérdida en el mismo arco.', en: 'The saddest, most human sci-fi I read: intelligence and loss on the same arc.' },
    intel: { tags: ['ciencia ficción', 'triste', 'breve'], mood: { es: 'devastador y limpio', en: 'devastating and clean' }, time: '311 páginas', energy: { es: 'media-alta', en: 'medium-high' }, bestMoment: { es: 'las faltas de ortografía volviendo al final: el idioma derrumbándose', en: 'the spelling errors creeping back at the end: a language falling apart' }, paraQuien: { es: 'para quien quiere la ciencia ficción más humana', en: 'for anyone who wants the most human sci-fi' }, snd: 'cozy' } }
];

const SQ_FILM_TAGS = {
  'showgirls': { t: ['camp', 'drama', 'años 90'], m: { es: 'demencial y sincero', en: 'deranged and sincere' }, s: 'fun' },
  'braveheart': { t: ['épico', 'histórico', 'batallas'], m: { es: 'grandioso y desgarrador', en: 'grand and heartbreaking' }, s: 'epic' },
  'obsession-2025': { t: ['suspenso', 'drama'], m: { es: 'tenso y moderno', en: 'tense and modern' }, s: 'dark' },
  'the-odyssey-2026': { t: ['épico', 'mitología'], m: { es: 'grandioso', en: 'grand' }, s: 'epic' },
  'ted': { t: ['comedia', 'humor absurdo'], m: { es: 'divertido', en: 'funny' }, s: 'fun' },
  'the-hunger-games-the-ballad-of-songbirds-snakes': { t: ['distopía', 'precuela'], m: { es: 'oscuro y elegante', en: 'dark and elegant' }, s: 'dark' },
  'the-hunger-games-mockingjay-part-2': { t: ['distopía', 'cierre'], m: { es: 'épico cierre', en: 'epic finale' }, s: 'epic' },
  'the-hunger-games-mockingjay-part-1': { t: ['distopía', 'política'], m: { es: 'político', en: 'political' }, s: 'dark' },
  'the-hunger-games-catching-fire': { t: ['distopía', 'acción'], m: { es: 'el mejor de la saga', en: 'the best of the saga' }, s: 'epic' },
  'the-hunger-games': { t: ['distopía', 'debut'], m: { es: 'adictivo', en: 'addictive' }, s: 'fun' },
  'the-perks-of-being-a-wallflower': { t: ['coming of age', 'emocional'], m: { es: 'tierno', en: 'tender' }, s: 'cozy' },
  'the-prestige': { t: ['twist', 'magos', 'obsesión'], m: { es: 'brillante', en: 'brilliant' }, s: 'dark' },
  'el-sueno-de-los-heroes': { t: ['argentino', 'fantástico'], m: { es: 'onírico', en: 'dreamlike' }, s: 'cozy' },
  'trainspotting': { t: ['crudo', 'británico', 'ritmo'], m: { es: 'eléctrico', en: 'electric' }, s: 'dark' },
  'her': { t: ['romance', 'ciencia ficción', 'melancolía'], m: { es: 'melancólico y cálido', en: 'melancholic and warm' }, s: 'cozy' },
  'ex-machina': { t: ['ciencia ficción', 'IA', 'minimal'], m: { es: 'inquietante', en: 'unsettling' }, s: 'dark' },
  'the-spanish-prisoner': { t: ['suspenso', 'estafas'], m: { es: 'laberíntico', en: 'labyrinthine' }, s: 'focus' },
  'eastern-promises': { t: ['mafia', 'crudo'], m: { es: 'brutal', en: 'brutal' }, s: 'dark' },
  'return-of-the-jedi': { t: ['star wars', 'cierre'], m: { es: 'clásico', en: 'classic' }, s: 'epic' },
  'my-2-cents': { t: ['drama', 'estreno'], m: { es: 'íntimo', en: 'intimate' }, s: 'cozy' },
  'the-empire-strikes-back': { t: ['star wars', 'twist'], m: { es: 'legendario', en: 'legendary' }, s: 'epic' },
  'star-wars': { t: ['star wars', 'origen'], m: { es: 'fundacional', en: 'foundational' }, s: 'epic' },
  'the-lord-of-the-rings-the-return-of-the-king': { t: ['épico', 'cierre', 'oscars'], m: { es: 'monumental', en: 'monumental' }, s: 'epic' },
  'the-lord-of-the-rings-the-two-towers': { t: ['épico', 'batallas'], m: { es: 'grandioso', en: 'grand' }, s: 'epic' },
  'the-lord-of-the-rings-the-fellowship-of-the-ring': { t: ['épico', 'inicio'], m: { es: 'perfecto', en: 'perfect' }, s: 'epic' },
  'the-crash': { t: ['suspenso', 'estreno'], m: { es: 'tenso', en: 'tense' }, s: 'dark' },
  'escape-from-alcatraz': { t: ['prisión', 'clásico'], m: { es: 'frío y preciso', en: 'cold and precise' }, s: 'dark' },
  'tropic-thunder': { t: ['comedia', 'sátira'], m: { es: 'demencial', en: 'deranged' }, s: 'fun' },
  'jennifers-body': { t: ['horror', 'camp'], m: { es: 'sardónico', en: 'sardonic' }, s: 'fun' },
  'all-quiet-on-the-western-front': { t: ['guerra', 'crudo'], m: { es: 'devastador', en: 'devastating' }, s: 'dark' },
  'a-beautiful-mind': { t: ['biopic', 'matemáticas'], m: { es: 'inspirador', en: 'inspiring' }, s: 'focus' },
  'chronicles-of-a-wandering-saint': { t: ['argentino', 'road movie'], m: { es: 'cálido', en: 'warm' }, s: 'cozy' },
  'too-big-to-fail': { t: ['crisis', 'finanzas'], m: { es: 'narrado como thriller', en: 'told like a thriller' }, s: 'focus' },
  'lethal-weapon': { t: ['buddy cop', 'años 80'], m: { es: 'clásico de acción', en: 'action classic' }, s: 'fun' },
  'point-break': { t: ['acción', 'surf'], m: { es: 'adrenalina', en: 'adrenaline' }, s: 'fun' },
  'training-day': { t: ['drama', 'corrupción'], m: { es: 'intenso', en: 'intense' }, s: 'dark' },
  'clue': { t: ['comedia', 'misterio', 'culto'], m: { es: 'caótico y encantador', en: 'chaotic and charming' }, s: 'fun' },
  'about-time': { t: ['romance', 'viaje en el tiempo'], m: { es: 'cálido', en: 'warm' }, s: 'cozy' },
  'limitless': { t: ['suspenso', 'potencial'], m: { es: 'adictivo', en: 'addictive' }, s: 'focus' },
  'zodiac': { t: ['fincher', 'investigación', 'obsesión'], m: { es: 'obsesivo', en: 'obsessive' }, s: 'dark' },
  'the-darjeeling-limited': { t: ['wes anderson', 'hermanos'], m: { es: 'colorido y melancólico', en: 'colorful and melancholic' }, s: 'cozy' },
  'pretty-woman': { t: ['romance', 'años 90'], m: { es: 'icónico', en: 'iconic' }, s: 'cozy' },
  'idiocracy': { t: ['sátira', 'futuro'], m: { es: 'profético', en: 'prophetic' }, s: 'fun' },
  'peaky-blinders-the-immortal-man': { t: ['cierre', 'crimen'], m: { es: 'sombrío', en: 'somber' }, s: 'dark' },
  'office-space': { t: ['culto', 'oficina', 'sátira'], m: { es: 'catártico', en: 'cathartic' }, s: 'fun' },
  'avatar-fire-and-ash': { t: ['avatar', 'visual'], m: { es: 'visual', en: 'visual' }, s: 'epic' },
  'f1': { t: ['deporte', 'adrenalina'], m: { es: 'adrenalina pura', en: 'pure adrenaline' }, s: 'fun' },
  'demolition': { t: ['drama', 'melancolía'], m: { es: 'melancólico', en: 'melancholic' }, s: 'cozy' },
  'jujutsu-kaisen-0': { t: ['anime', 'oscuro'], m: { es: 'estilizado', en: 'stylized' }, s: 'dark' },
  'city-of-god': { t: ['obra maestra', 'crudo', 'brasileño'], m: { es: 'obra maestra', en: 'a masterpiece' }, s: 'dark' }
};

// --- diary -> quests ---
const SQ_FILMS = (() => {
  try {
    return JSON.parse(document.getElementById('sq-diary').textContent);
  } catch (e) { return []; }
})();

const SIDE_QUESTS = SQ_FILMS.map(f => ({
  title: f.name,
  year: f.year,
  poster: f.poster,
  color: sqFilmColor(f.slug),
  cat: { es: 'Película', en: 'Film' },
  meta: (() => {
    const d = new Date(f.watched.replace('Watched on ', '').replace(/^([A-Za-z]+day)\s+/, ''));
    const es = isNaN(d) ? f.watched : 'Vista el ' + d.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
    const en = isNaN(d) ? f.watched : 'Watched ' + d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    return { es: es, en: en };
  })(),
  why: { es: (SQ_FILM_TAGS[f.slug] || {}).m ? 'En tu diary figura como ' + sqL((SQ_FILM_TAGS[f.slug]).m) + '.' : 'Del diario real de Letterboxd.', en: (SQ_FILM_TAGS[f.slug] || {}).m ? 'Your diary marks it as ' + sqL((SQ_FILM_TAGS[f.slug]).m) + '.' : 'From your real Letterboxd diary.' },
  kind: 'film', slug: f.slug, watched: f.watched
})).concat(SQ_BOOKS.map(b => ({ title: b.title, poster: b.poster, color: b.color, cat: b.cat, meta: b.meta, why: b.why, kind: 'book' })));

function sqFilmColor(slug) {
  const h = sqHash(slug) % 360;
  return 'hsl(' + h + ', 38%, 58%)';
}
function sqIntel(title) {
  const q = SIDE_QUESTS.find(q => q.title === title);
  if (!q) return null;
  if (q.kind === 'book') { const b = (SQ_BOOKS.find(b => b.title === title) || {}).intel || { tags: [], mood: { es: '', en: '' }, time: '—', energy: { es: '', en: '' } }; return Object.assign({ signals: b.tags }, b); }
  const ft = SQ_FILM_TAGS[q.slug] || { t: ['cine'], m: { es: 'del diario', en: 'from the diary' } };
  return { tags: ft.t, mood: ft.m, signals: ft.t, time: 'una peli', energy: { es: 'una sentada', en: 'one sitting' } };
}
function sqBookOf(title) { return SQ_BOOKS.find(b => b.title === title); }
function sqFilmOf(title) { return SQ_FILMS.find(f => f.name === title); }

// --- taste graph (localStorage) ---
const SQ_TASTE_KEY = 'sq_taste', SQ_SEEN_KEY = 'sq_seen';
function sqTasteGet() { try { return JSON.parse(localStorage.getItem(SQ_TASTE_KEY)) || { tags: {}, views: {} }; } catch (e) { return { tags: {}, views: {} }; } }
function sqTasteBump(tags, w) { const t = sqTasteGet(); (tags || []).forEach(tag => { t.tags[tag] = Math.min(9, (t.tags[tag] || 0) + w); }); localStorage.setItem(SQ_TASTE_KEY, JSON.stringify(t)); }
function sqMatch(quest) {
  const t = sqTasteGet();
  const intel = sqIntel(quest.title) || { tags: [] };
  let s = 46;
  intel.tags.forEach(tag => { s += (t.tags[tag] || 0) * 9; });
  if (t.views[quest.title]) s += 5;
  return Math.min(98, Math.round(s));
}
function sqSeenGet() { try { return JSON.parse(localStorage.getItem(SQ_SEEN_KEY)) || []; } catch (e) { return []; } }
function sqSeenToggle(title) {
  const s = sqSeenGet();
  const i = s.indexOf(title);
  if (i >= 0) s.splice(i, 1); else s.push(title);
  localStorage.setItem(SQ_SEEN_KEY, JSON.stringify(s));
  return i < 0;
}
function sqToast(msg) {
  let el = document.getElementById('sq-toast');
  if (!el) { el = document.createElement('div'); el.id = 'sq-toast'; document.body.appendChild(el); }
  el.textContent = msg;
  el.classList.add('on');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('on'), 3200);
}

// --- cozy poster frame for books (soft generated art) ---
function sqBookArt(item) {
  return item.poster;
}

function setupSideQuests() {
  const toggle = document.getElementById('side-quests-toggle');
  const reveal = document.getElementById('side-quests-reveal');
  const closeBtn = document.getElementById('side-quests-close');
  const posterImg = document.getElementById('sq-poster');
  const glow = document.getElementById('sq-glow');
  const catChip = document.getElementById('sq-cat-chip');
  const titleEl = document.getElementById('sq-detail-title');
  const subEl = document.getElementById('sq-detail-sub');
  const whyEl = document.getElementById('sq-detail-why');
  const tagRow = document.getElementById('sq-tagrow');
  const actionRow = document.getElementById('sq-actions');
  const strip = document.getElementById('sq-strip');
  const chipRow = document.getElementById('sq-col-chips');
  const prevBtn = document.getElementById('sq-prev');
  const nextBtn = document.getElementById('sq-next');
  if (!toggle || !reveal || !posterImg) return;

  const n = SIDE_QUESTS.length;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let filterCat = 'all';
  let audioEl = null;

  function buildChips() {
    chipRow.innerHTML = '';
    const mk = (id, label) => {
      const c = document.createElement('button');
      c.type = 'button'; c.className = 'sq-col-chip'; c.dataset.col = id;
      c.textContent = label;
      c.addEventListener('click', () => { filterCat = id; if (!visibleQuests().some(q => q.title === SIDE_QUESTS[current].title)) current = 0; buildChips(); buildStrip(); render(); });
      chipRow.appendChild(c);
    };
    mk('all', currentLang === 'en' ? 'Everything' : 'Todo');
    mk('film', currentLang === 'en' ? 'Pelis' : 'Pelis');
    mk('book', currentLang === 'en' ? 'Libros' : 'Libros');
    const freq = {};
    SIDE_QUESTS.forEach(q => { (sqIntel(q.title) || { tags: [] }).tags.forEach(t => { freq[t] = (freq[t] || 0) + 1; }); });
    Object.keys(freq).sort((a, b) => freq[b] - freq[a]).slice(0, 4).forEach(t => mk(t, t));
    chipRow.querySelectorAll('.sq-col-chip').forEach(c => c.classList.toggle('active', c.dataset.col === filterCat));
  }

  function visibleQuests() {
    return SIDE_QUESTS.filter(q => filterCat === 'all' || q.kind === filterCat ||
      (sqIntel(q.title) || { tags: [] }).tags.some(t => t.toLowerCase() === filterCat.toLowerCase()));
  }

  function buildStrip() {
    strip.innerHTML = '';
    visibleQuests().forEach(item => {
      const t = document.createElement('button');
      t.type = 'button'; t.className = 'sq-thumb';
      // The poster img stays alt="" (decorative); the button carries the name.
      t.setAttribute('aria-label', sqL(item.title) || item.title || '');
      if (sqSeenGet().includes(item.title)) t.classList.add('seen');
      if (sqMatch(item) >= 80) t.classList.add('foryou');
      t.innerHTML = '<img src="' + (item.kind === 'book' ? sqBookArt(item) : item.poster) + '" alt="" loading="lazy" decoding="async">';
      t.addEventListener('click', () => { current = SIDE_QUESTS.indexOf(item); render(); });
      strip.appendChild(t);
    });
  }

  function render() {
    const item = SIDE_QUESTS[current];
    if (!item) return;
    const intel = sqIntel(item.title) || { tags: [], mood: { es: '', en: '' } };
    const accent = item.color;
    posterImg.style.opacity = 0;
    setTimeout(() => { posterImg.src = item.kind === 'book' ? sqBookArt(item) : item.poster; posterImg.alt = item.title; posterImg.style.opacity = 1; }, reduceMotion ? 0 : 150);
    glow.style.background = 'radial-gradient(closest-side, ' + accent + ', transparent 72%)';
    document.getElementById('side-quests-reveal').style.setProperty('--sq-accent', accent);
    catChip.textContent = localize(item.cat);
    catChip.style.color = accent;
    titleEl.textContent = item.title;
    subEl.textContent = localize(item.meta);
    whyEl.textContent = localize(item.why);
    tagRow.innerHTML = intel.tags.map(t => '<span>' + esc(t) + '</span>').join('');
    const seen = sqSeenGet().includes(item.title);
    const forYouEnd2 = sqMatch(item) >= 80;
    actionRow.innerHTML =
      '<button type="button" class="sq-act' + (seen ? ' on' : '') + '" id="sq-seen-btn">' + (seen ? '✓ ' : '') + (currentLang === 'en' ? (seen ? 'completed' : 'mark as done') : (seen ? 'completada' : 'marcar como vista')) + '</button>' +
      '<button type="button" class="sq-act" id="sq-share-btn">' + (currentLang === 'en' ? '\u2913 share' : '\u2913 compartir') + '</button>' +
      (intel.snd ? '<button type="button" class="sq-act sq-snd-btn" id="sq-snd-btn" title="' + (currentLang === 'en' ? 'ambient sound' : 'sonido ambiental') + '">♪</button>' : '');
    document.getElementById('sq-seen-btn').addEventListener('click', () => {
      const added = sqSeenToggle(item.title);
      (intel.tags || []).forEach(tag => sqTasteBump([tag], added ? 2 : -1));
      sqTasteBump([item.title], added ? 1 : -1);
      render();
    });
    document.getElementById('sq-share-btn').addEventListener('click', () => sqShareQuest(item, intel));
    const sndBtn = document.getElementById('sq-snd-btn');
    if (sndBtn && intel.snd) {
      sndBtn.addEventListener('click', () => {
        if (audioEl && !audioEl.paused) { audioEl.pause(); sndBtn.classList.remove('playing'); return; }
        if (!audioEl || audioEl.dataset.mood !== intel.snd) {
          if (audioEl) audioEl.pause();
          audioEl = new Audio('project-assets/side-quests/audio/' + intel.snd + '.mp3');
          audioEl.dataset.mood = intel.snd; audioEl.loop = true; audioEl.volume = 0.32;
        }
        sndBtn.classList.add('playing');
        audioEl.play().catch(() => {});
      });
    }
    sqTasteBump(intel.tags, 0.3);
    const taste = sqTasteGet();
    const views = taste.views || {};
    views[item.title] = (views[item.title] || 0) + 1;
    taste.views = views;
    localStorage.setItem(SQ_TASTE_KEY, JSON.stringify(taste));
    buildStrip();
    strip.querySelectorAll('.sq-thumb').forEach((t, i) => {
      const q = visibleQuests()[i];
      t.classList.toggle('active', q && q.title === item.title);
      if (q && q.title === item.title) t.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    const forYouEnd = sqMatch(item) >= 80;
    catChip.textContent = forYouEnd2 ? (currentLang === 'en' ? 'FOR YOU' : 'PARA VOS') : localize(item.cat);
    if (forYouEnd2) catChip.style.color = '#f5c04e'; else catChip.style.color = accent;
    if (window.SQAgentHook) window.SQAgentHook(current);
  }

  function localize(field) { return typeof field === 'string' ? field : field[currentLang]; }

  function sqBestForYou() {
    let best = null, bestM = -1;
    visibleQuests().forEach(q => { const m = sqMatch(q); if (m > bestM) { bestM = m; best = q; } });
    return best;
  }

  function sqShareQuest(item, intel) {
    const W = 1200, H = 630;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d');
    const grd = x.createLinearGradient(0, 0, W, H);
    grd.addColorStop(0, '#1c130a'); grd.addColorStop(0.55, '#120c07'); grd.addColorStop(1, '#0a0605');
    x.fillStyle = grd; x.fillRect(0, 0, W, H);
    x.save(); x.globalAlpha = 0.45; x.filter = 'blur(70px)';
    x.fillStyle = item.color; x.fillRect(W - 520, -140, 620, 480);
    x.restore();
    const img = new Image();
    const fin = () => { download(); sqToast(currentLang === 'en' ? 'Share image downloaded' : 'Imagen descargada'); };
    img.onload = () => { x.drawImage(img, 70, 90, 300, 450); drawText(); fin(); };
    img.onerror = () => { drawText(); fin(); };
    img.src = item.poster;
    function drawText() {
      x.fillStyle = '#f3ead9';
      x.font = '700 52px Fraunces, Georgia, serif';
      x.fillText(item.title.slice(0, 30), 430, 180);
      x.fillStyle = '#e8a84c';
      x.font = '600 21px "IBM Plex Mono", monospace';
      x.fillText((sqL(item.cat) + ' · ' + (intel.time || '')).toUpperCase(), 430, 228);
      x.fillStyle = 'rgba(243,234,217,.88)';
      x.font = 'italic 500 26px Fraunces, Georgia, serif';
      const why = sqL(item.why).slice(0, 110);
      wrap(x, '"' + why + '"', 430, 296, 700, 36);
      x.fillStyle = '#e8a84c';
      x.font = '700 28px "IBM Plex Mono", monospace';
      x.fillText('el club lo aprueba', 430, 470);
      x.fillStyle = 'rgba(243,234,217,.5)';
      x.font = '500 17px "IBM Plex Mono", monospace';
      x.fillText('ignacio.vercel.app', 430, 545);
    }
    function wrap(ctx, text, X, Y, maxW, lh) {
      const words = text.split(' '); let line = '', yy = Y;
      words.forEach(w => { const test = line + w + ' '; if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line.trim(), X, yy); line = w + ' '; yy += lh; } else line = test; });
      ctx.fillText(line.trim(), X, yy);
    }
    function download() {
      const a = document.createElement('a');
      a.download = 'side-quest-' + item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) + '.png';
      a.href = c.toDataURL('image/png');
      a.click();
    }
  }

  function step(delta) {
    const vis = visibleQuests();
    if (!vis.length) return;
    const i = vis.indexOf(SIDE_QUESTS[current]);
    const next = vis[(i + delta + vis.length) % vis.length];
    current = SIDE_QUESTS.indexOf(next);
    render();
  }

  function open() {
    toggle.setAttribute('aria-expanded', 'true');
    reveal.classList.add('is-visible');
    reveal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    buildChips(); buildStrip(); render();
  }

  function close() {
    toggle.setAttribute('aria-expanded', 'false');
    reveal.classList.remove('is-visible');
    reveal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (audioEl) audioEl.pause();
  }

  if (!toggle.dataset.bound) {
    toggle.dataset.bound = 'true';
    toggle.addEventListener('click', open);
    closeBtn && closeBtn.addEventListener('click', close);
    prevBtn && prevBtn.addEventListener('click', () => step(-1));
    nextBtn && nextBtn.addEventListener('click', () => step(1));
    reveal.addEventListener('click', (event) => { if (event.target === reveal) close(); });
    document.addEventListener('keydown', (event) => {
      if (!reveal.classList.contains('is-visible')) return;
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') step(-1);
      if (event.key === 'ArrowRight') step(1);
    });
  }

  buildChips(); buildStrip(); render();
}

const HERO_ROLE_WORDS = {
  es: ['automatizaciones', 'dashboards', 'bots', 'agentes de IA', 'APIs'],
  en: ['automations', 'dashboards', 'bots', 'AI agents', 'APIs']
};
let heroRoleIndex = 0;
let heroRoleTimer = null;

function tickHeroRoleWord() {
  const el = document.getElementById('hero-role-word');
  if (!el) return;
  const words = HERO_ROLE_WORDS[currentLang] || HERO_ROLE_WORDS.es;
  heroRoleIndex = (heroRoleIndex + 1) % words.length;
  el.classList.add('is-swapping');
  setTimeout(() => {
    el.textContent = words[heroRoleIndex];
    el.classList.remove('is-swapping');
  }, 220);
}

function initHeroRoleRotator() {
  const el = document.getElementById('hero-role-word');
  if (!el) return;
  const words = HERO_ROLE_WORDS[currentLang] || HERO_ROLE_WORDS.es;
  el.textContent = words[0];
  if (heroRoleTimer) clearInterval(heroRoleTimer);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  heroRoleTimer = setInterval(tickHeroRoleWord, 2400);
}

function initNavbarScroll() {
  const header = document.querySelector('header.app-header');
  if (!header) return;
  let ticking = false;
  function update() {
    header.classList.toggle('is-scrolled', window.scrollY > 60);
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  update();
}

function initScrollReveal() {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = Number(el.dataset.revealDelay || 0);
      setTimeout(() => el.classList.add('is-visible'), delay);
      const video = el.tagName === 'VIDEO' ? el : el.querySelector('video');
      if (video) video.play?.().catch(() => {});
      observer.unobserve(el);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
  targets.forEach((el, i) => {
    if (!el.dataset.revealDelay) el.dataset.revealDelay = String((i % 4) * 80);
    observer.observe(el);
  });
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;
  const animate = (el) => {
    const target = Number(el.dataset.counter || 0);
    const suffix = el.dataset.counterSuffix || '';
    const duration = 1100;
    const start = performance.now();
    function frame(now) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  };
  if (!('IntersectionObserver' in window)) {
    counters.forEach(animate);
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animate(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  counters.forEach((el) => observer.observe(el));
}

// ═══════════════════ SCROLL ENGINE ═══════════════════
// One scroll listener and one rAF for the entire page. Every pinned section
// registers here and receives a 0→1 progress value; no section adds its own
// listener, so the per-frame cost stays flat as sections are added.
const scrollEngine = {
  sections: [],
  frame: null,
  bound: false,
  resizeTimer: null
};

function scrollEngineUpdate() {
  scrollEngine.frame = null;
  const scrollY = window.scrollY;
  scrollEngine.sections.forEach((entry) => {
    if (!entry.active) return;
    const progress = Math.min(1, Math.max(0, (scrollY - entry.top) / entry.range));
    if (progress === entry.lastProgress) return;
    entry.lastProgress = progress;
    entry.onProgress(progress);
  });
}

function scrollEngineRequest() {
  if (scrollEngine.frame) return;
  scrollEngine.frame = window.requestAnimationFrame(scrollEngineUpdate);
}

// Measuring reads layout, so it happens here — never inside onProgress, which
// runs every frame and must only write transform/opacity.
function scrollEngineMeasure() {
  scrollEngine.sections.forEach((entry) => {
    const active = !!entry.el.offsetParent && entry.enabled();
    entry.active = active;
    // onDisable runs on every inactive measure, not just on the active→inactive
    // edge: on touch and reduced motion a section is inactive from the very
    // first measure and still needs its static state applied.
    if (!active) {
      entry.onDisable();
      return;
    }
    entry.onMeasure();
    entry.top = entry.el.getBoundingClientRect().top + window.scrollY;
    entry.range = Math.max(1, entry.el.offsetHeight - window.innerHeight);
    entry.lastProgress = -1;
  });
  scrollEngineUpdate();
}

function registerScrollSection(config) {
  // Re-registering the same element replaces it, so re-renders never stack
  // duplicate handlers.
  const previous = scrollEngine.sections.find((s) => s.el === config.el);
  if (previous && previous.active) previous.onDisable();
  scrollEngine.sections = scrollEngine.sections.filter((s) => s.el !== config.el);

  scrollEngine.sections.push({
    el: config.el,
    enabled: config.enabled || (() => true),
    onMeasure: config.onMeasure || (() => {}),
    onProgress: config.onProgress || (() => {}),
    onDisable: config.onDisable || (() => {}),
    top: 0,
    range: 1,
    lastProgress: -1,
    active: false
  });

  if (!scrollEngine.bound) {
    scrollEngine.bound = true;
    window.addEventListener('scroll', scrollEngineRequest, { passive: true });
    window.addEventListener('resize', () => {
      clearTimeout(scrollEngine.resizeTimer);
      scrollEngine.resizeTimer = setTimeout(scrollEngineMeasure, 180);
    });
    window.addEventListener('portfolio-tab-change', scrollEngineMeasure);
    // Images and videos settle after load and change section heights.
    window.addEventListener('load', scrollEngineMeasure, { once: true });
  }

  scrollEngineMeasure();
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isHandheld() {
  return window.matchMedia('(max-width: 767px)').matches;
}

// ═══════════════════ PROJECT ROADMAP (pinned vertical→horizontal scrub) ═══════
// The section is made as tall as the rail is wide, so 1px of page scroll maps to
// 1px of horizontal travel. The sticky child stays pinned for that whole range,
// the rail is translated by the scroll progress, and the SVG path is revealed
// with stroke-dashoffset. Requires `overflow-x: clip` (not `hidden`) on
// html/body — `hidden` makes body a scroll container and kills sticky.
function initProjectRoadmap() {
  const section = document.querySelector('[data-roadmap]');
  if (!section) return;

  const rail = section.querySelector('[data-roadmap-rail]');
  const viewport = section.querySelector('.roadmap-viewport');
  const lineBg = section.querySelector('[data-roadmap-line-bg]');
  const lineFg = section.querySelector('[data-roadmap-line-fg]');
  const svg = section.querySelector('[data-roadmap-svg]');
  const progressFill = section.querySelector('[data-roadmap-progress]');
  if (!rail || !viewport) return;

  let cards = [];
  let cardAnchors = [];
  let maxShift = 0;
  let railOriginLeft = 0;
  let pathLength = 0;

  function buildPath(railWidth, railHeight) {
    if (!svg || !lineBg || !lineFg || !cardAnchors.length) return;
    svg.setAttribute('viewBox', `0 0 ${railWidth} ${railHeight}`);
    svg.setAttribute('width', String(railWidth));
    svg.setAttribute('height', String(railHeight));

    // The line threads through each milestone's marker dot, so the road and the
    // cards stay locked together at any viewport size.
    const points = cardAnchors.map((anchor) => ({ x: anchor.x, y: anchor.y }));
    const midY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
    // Extend past the first and last milestone so the road enters and leaves frame.
    points.unshift({ x: -80, y: midY });
    points.push({ x: railWidth + 80, y: midY });

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const cur = points[i];
      const midX = (prev.x + cur.x) / 2;
      d += ` C ${midX} ${prev.y}, ${midX} ${cur.y}, ${cur.x} ${cur.y}`;
    }

    lineBg.setAttribute('d', d);
    lineFg.setAttribute('d', d);
    pathLength = lineFg.getTotalLength ? lineFg.getTotalLength() : railWidth;
    lineFg.style.strokeDasharray = String(pathLength);
    lineFg.style.strokeDashoffset = String(pathLength);
  }

  function measure() {
    cards = Array.from(rail.querySelectorAll('.project-preview, .project-static-card'));
    if (!cards.length) return;
    section.classList.add('is-pinned');

    // The roadmap drives its own entrance/active states, so hand the cards over
    // from the generic reveal system — otherwise both fight over transform and
    // opacity on the same elements.
    cards.forEach((card) => {
      card.removeAttribute('data-reveal');
      card.classList.add('is-visible');
    });

    rail.style.transform = 'translate3d(0, 0, 0)';

    // Lead-in and lead-out equal to half the viewport minus half a card, so the
    // journey starts centred on the first milestone and ends on the last one
    // instead of leaving them stranded against the edges.
    const halfViewport = viewport.clientWidth / 2;
    const firstWidth = cards[0].getBoundingClientRect().width;
    const lastWidth = cards[cards.length - 1].getBoundingClientRect().width;
    rail.style.paddingLeft = `${Math.max(24, halfViewport - firstWidth / 2)}px`;
    rail.style.paddingRight = `${Math.max(24, halfViewport - lastWidth / 2)}px`;

    const railRect = rail.getBoundingClientRect();
    const railWidth = rail.scrollWidth;
    railOriginLeft = railRect.left;

    maxShift = Math.max(0, railWidth - viewport.clientWidth);
    section.style.height = `${window.innerHeight + maxShift}px`;

    // MARKER_OFFSET matches the .project-preview::before dot in style.css, so
    // the drawn line lands on the dots instead of near them.
    const MARKER_OFFSET = 26;
    cardAnchors = cards.map((card) => {
      const rect = card.getBoundingClientRect();
      return {
        x: rect.left - railRect.left + rect.width / 2,
        y: rect.top - railRect.top - MARKER_OFFSET
      };
    });

    buildPath(railWidth, viewport.clientHeight);
  }

  function render(progress) {
    if (!cards.length) return;
    const shift = maxShift * progress;

    rail.style.transform = `translate3d(${-shift}px, 0, 0)`;
    if (lineFg && pathLength) {
      lineFg.style.strokeDashoffset = String(pathLength * (1 - progress));
    }
    if (progressFill) progressFill.style.transform = `scaleX(${progress})`;

    // Highlight the milestone closest to the middle of the pinned viewport.
    // Positions come from the measured centres, so no layout reads here.
    const focusX = viewport.clientWidth / 2;
    let activeIndex = 0;
    let bestDistance = Infinity;
    cardAnchors.forEach((anchor, i) => {
      const distance = Math.abs((railOriginLeft + anchor.x - shift) - focusX);
      if (distance < bestDistance) {
        bestDistance = distance;
        activeIndex = i;
      }
    });
    cards.forEach((card, i) => card.classList.toggle('is-roadmap-active', i === activeIndex));
    section.classList.toggle('is-roadmap-complete', progress >= 0.999);
  }

  // Touch and reduced motion fall back to a plain horizontal snap carousel.
  function disable() {
    section.classList.remove('is-pinned', 'is-roadmap-complete');
    section.style.height = '';
    rail.style.transform = '';
    rail.style.paddingLeft = '';
    rail.style.paddingRight = '';
    cards.forEach((card) => card.classList.remove('is-roadmap-active'));
  }

  registerScrollSection({
    el: section,
    enabled: () => !prefersReducedMotion() && !isHandheld(),
    onMeasure: measure,
    onProgress: render,
    onDisable: disable
  });
}

// ═══════════════════ FLOW SECTION (pinned step reveal + count-up) ═══════════
// Pins for one section height (CSS gives it ~300vh) while progress reveals
// the five steps in order and, past the halfway point, starts the metric
// count-up once. Falls back to a static block with everything already
// visible on touch and reduced motion.
function animateCountUp(el, target) {
  const start = performance.now();
  const duration = 1100;
  function frame(now) {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target).toLocaleString(currentLang === 'es' ? 'es-AR' : 'en-US');
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function initFlowSection() {
  const section = document.querySelector('[data-flow]');
  if (!section) return;

  const steps = Array.from(section.querySelectorAll('[data-flow-step]'));
  const metrics = Array.from(section.querySelectorAll('[data-flow-metric]'));
  if (!steps.length) return;

  let countersStarted = false;
  function startCounters() {
    if (countersStarted) return;
    countersStarted = true;
    metrics.forEach((metric) => {
      if (metric.hidden) return;
      const counterEl = metric.querySelector('[data-flow-counter]');
      if (!counterEl) return;
      animateCountUp(counterEl, Number(counterEl.dataset.counterTarget || 0));
    });
  }

  function measure() {
    section.classList.add('is-pinned');
    // 3.2x viewport height: enough scroll room to read five steps one at a
    // time plus the count-up, short of the ~4x that starts to drag.
    section.style.height = `${Math.round(window.innerHeight * 3.2)}px`;
  }

  function render(progress) {
    const revealCount = Math.ceil(progress * steps.length);
    steps.forEach((step, i) => step.classList.toggle('is-visible', i < revealCount));
    if (progress > 0.55) startCounters();
  }

  function disable() {
    section.classList.remove('is-pinned');
    section.style.height = '';
    steps.forEach((step) => step.classList.add('is-visible'));
    startCounters();
  }

  registerScrollSection({
    el: section,
    enabled: () => !prefersReducedMotion() && !isHandheld(),
    onMeasure: measure,
    onProgress: render,
    onDisable: disable
  });
}

// The commit counter starts hidden (there's nothing to count until the real
// total loads) and swaps in once GitHub activity resolves successfully.
function showCommitCounter(totalContributions) {
  const metric = document.querySelector('[data-flow-metric][data-metric="commits"]');
  if (!metric) return;
  const counterEl = metric.querySelector('[data-flow-counter]');
  if (counterEl) counterEl.dataset.counterTarget = String(totalContributions);
  metric.hidden = false;
}

// Mouse drag-to-scroll for the certifications carousel. Touch and scrollbar
// dragging already work natively via overflow-x; this only adds the mouse
// path and a grab/grabbing cursor to match it.
function initCertificationsDrag() {
  const list = document.querySelector('.certifications-list');
  if (!list) return;

  let isDown = false;
  let startX = 0;
  let startScroll = 0;
  let moved = false;

  list.addEventListener('mousedown', (event) => {
    isDown = true;
    moved = false;
    startX = event.pageX;
    startScroll = list.scrollLeft;
    list.classList.add('is-dragging');
  });

  window.addEventListener('mousemove', (event) => {
    if (!isDown) return;
    const delta = event.pageX - startX;
    if (Math.abs(delta) > 4) moved = true;
    list.scrollLeft = startScroll - delta;
  });

  function endDrag() {
    isDown = false;
    list.classList.remove('is-dragging');
  }
  window.addEventListener('mouseup', endDrag);
  list.addEventListener('mouseleave', endDrag);

  // A drag that actually moved the list shouldn't also fire the link click
  // underneath the cursor when the mouse button is released.
  list.addEventListener('click', (event) => {
    if (moved) event.preventDefault();
  }, { capture: true });
}

// FAQ accordion. The height animation is pure CSS (grid-template-rows tween
// on .faq-panel); this only flips aria-expanded, which both drives that CSS
// and keeps the state correct for screen readers.
function initFaqAccordion() {
  const list = document.querySelector('[data-faq-list]');
  if (!list) return;
  list.querySelectorAll('.faq-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!expanded));
    });
  });
}

function setupPreferenceControls() {
  applyStaticCopy();
  setupTerminal();
  setupFloatingConsole();
  setupSideQuests();
  initCertificationsDrag();
  initFaqAccordion();
  document.querySelectorAll('[data-lang-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentLang = btn.dataset.langBtn;
      safeStorageSet('portfolio-lang', currentLang);
      applyStaticCopy();
      rebuildLocalizedEcosystem();
      initHeroRoleRotator();
    });
  });

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      safeStorageSet('portfolio-theme', currentTheme);
      applyStaticCopy();
    });
  }
}

const FEATURED_PROJECTS = [
  {
    id: 'jobbot',
    title: 'JobBot',
    repo: 'https://github.com/nachopalmeri/jobbot',
    href: 'https://jobbot-lime.vercel.app',
    media: 'project-assets/job-bot.webp',
    video: 'project-assets/video/jobbot-demo.mp4',
    status: 'ACTIVE',
    kind: { es: 'Automation SaaS', en: 'Automation SaaS' },
    description: {
      es: 'Full-stack SaaS para búsquedas laborales. Next.js, FastAPI, PostgreSQL, auth, webhooks y pagos.',
      en: 'Full-stack SaaS for job searches. Next.js, FastAPI, PostgreSQL, auth, webhooks and payments.'
    },
    value: {
      es: 'Muestra criterio backend, pensamiento de producto y disciplina de despliegue.',
      en: 'Shows backend judgment, product thinking and deployment discipline.'
    },
    problem: {
      es: 'Automatizar búsqueda laboral sin perder control sobre seguridad, pagos y webhooks.',
      en: 'Automate job search without losing control over security, payments and webhooks.'
    },
    role: {
      es: 'Full-stack builder: dashboard, backend, autenticación, webhooks y despliegue.',
      en: 'Full-stack builder: dashboard, backend, authentication, webhooks and deployment.'
    },
    evidence: {
      es: 'Demo pública, repo revisable y stack claro: API, dashboard, auth, webhooks, pagos y Telegram.',
      en: 'Public demo, reviewable repo and clear stack: API, dashboard, auth, webhooks, payments and Telegram.'
    },
    stack: ['Python', 'FastAPI', 'Next.js', 'PostgreSQL', 'Webhooks'],
    result: {
      es: 'Desplegado en Vercel con demo pública y repo abierto: auth, webhooks y pagos funcionando end-to-end.',
      en: 'Deployed on Vercel with a public demo and open repo: auth, webhooks and payments working end to end.'
    },
    // Completar cuando haya números reales (usuarios, pedidos, uptime…).
    // Con un valor distinto de null la tarjeta muestra la métrica sola.
    metrics: null
  },
  {
    id: 'pisculichi',
    title: 'Pisculichi Labs',
    repo: 'https://github.com/nachopalmeri/a',
    href: 'https://polytools-omega.vercel.app',
    media: 'project-assets/polymarktporyect.webp',
    video: 'project-assets/video/polytools-demo.mp4',
    status: 'BETA',
    kind: { es: 'Product lab', en: 'Product lab' },
    description: {
      es: 'Laboratorio para bots, alertas y herramientas web.',
      en: 'Lab for bots, alerts and web tools.'
    },
    value: {
      es: 'Conecta finanzas, automatización e interfaces web con alcance explícito de prototipo.',
      en: 'Connects finance, automation and web interfaces with explicit prototype scope.'
    },
    problem: {
      es: 'Convertir información de mercados predictivos en herramientas accionables.',
      en: 'Turn prediction-market information into actionable tools.'
    },
    role: {
      es: 'Producto experimental, automatización, bots y experiencia web.',
      en: 'Experimental product, automation, bots and web experience.'
    },
    evidence: {
      es: 'Demo beta desplegada y repositorio de experimentos con bots, alertas e interfaces de mercado.',
      en: 'Deployed beta demo and experiment repository with bots, alerts and market interfaces.'
    },
    stack: ['HTML', 'Telegram Bot', 'Prediction Markets', 'Alerts'],
    result: {
      es: 'En beta pública: bots y alertas corriendo sobre prediction markets, con repo abierto.',
      en: 'In public beta: bots and alerts running on prediction markets, with an open repo.'
    },
    // Completar cuando haya números reales (usuarios, pedidos, uptime…).
    // Con un valor distinto de null la tarjeta muestra la métrica sola.
    metrics: null
  },
  {
    id: 'darter',
    title: 'Darter',
    media: 'project-assets/darter.webp',
    video: 'project-assets/video/darter-demo.mp4',
    status: 'PRIVATE',
    kind: { es: 'Sistema financiero personal', en: 'Personal finance OS' },
    description: {
      es: 'Command center personal para patrimonio, cartera de CEDEARs y research, con brief diario generado por IA.',
      en: 'A personal command center for net worth, CEDEAR portfolio and research, with an AI-generated daily brief.'
    },
    value: {
      es: 'Consolida patrimonio, alertas de rebalanceo y research desk en un solo dashboard, sin depender de planillas sueltas.',
      en: 'Consolidates net worth, rebalancing alerts and a research desk in one dashboard instead of scattered spreadsheets.'
    },
    problem: {
      es: 'Perdía visión real de mi cartera entre varias apps y planillas; quería un solo lugar con contexto y prioridades del día.',
      en: 'I was losing a real view of my portfolio across apps and spreadsheets; I wanted one place with context and daily priorities.'
    },
    role: {
      es: 'Diseño y desarrollo full-stack, integración de datos de mercado y lógica de alertas.',
      en: 'Full-stack design and development, market data integration and alert logic.'
    },
    evidence: {
      es: 'Proyecto personal en uso diario, sin demo pública: la evidencia es el video de producto.',
      en: 'A personal project in daily use, no public demo: the product video is the evidence.'
    },
    stack: ['Next.js', 'Dashboard', 'Fintech', 'AI'],
    result: {
      es: 'En uso personal diario. Repo privado por los datos financieros; la demo en video muestra el producto.',
      en: 'In daily personal use. Repo is private because of the financial data; the video demo shows the product.'
    },
    // Completar cuando haya números reales (usuarios, pedidos, uptime…).
    // Con un valor distinto de null la tarjeta muestra la métrica sola.
    metrics: null
  },
  {
    id: 'agents-system',
    title: 'Agents System',
    repo: 'https://github.com/nachopalmeri/agents-system',
    href: '/agents',
    media: 'project-assets/agents-system.webp',
    video: 'project-assets/video/agents-system-demo.mp4',
    status: 'LOCAL',
    kind: { es: 'Workflow system', en: 'Workflow system' },
    description: {
      es: 'Mapa visual de mi sistema local con agentes, reglas y memoria.',
      en: 'Visual map of my local system with agents, rules and memory.'
    },
    value: {
      es: 'Explica como uso IA para planear, revisar, verificar y documentar sin venderlo como producto falso.',
      en: 'Explains how I use AI to plan, review, verify and document without selling it as a fake product.'
    },
    problem: {
      es: 'Hacer visible un proceso de trabajo que normalmente queda escondido en prompts, notas y decisiones locales.',
      en: 'Make visible a work process that usually stays hidden in prompts, notes and local decisions.'
    },
    role: {
      es: 'Orquestación, documentación, UI del grafo, pruebas y narrativa del sistema.',
      en: 'Orchestration, documentation, graph UI, tests and system narrative.'
    },
    evidence: {
      es: 'Grafo interactivo, rutas seleccionables, capturas y tests de navegador del portfolio.',
      en: 'Interactive graph, selectable routes, screenshots and browser tests in the portfolio.'
    },
    stack: ['Agents', 'Playwright', 'Docs', 'Workflow'],
    result: {
      es: 'Sistema local que uso para construir estos proyectos. Repo público con la documentación del método.',
      en: 'Local system I use to build these projects. Public repo with the method documented.'
    },
    // Completar cuando haya números reales (usuarios, pedidos, uptime…).
    // Con un valor distinto de null la tarjeta muestra la métrica sola.
    metrics: null
  },
  {
    id: 'franquiya',
    title: 'FranquiYA',
    repo: 'https://github.com/nachopalmeri/FranquiYA',
    href: 'https://franqui-ya.vercel.app',
    media: 'project-assets/franquiya.webp',
    video: 'project-assets/video/franqui-demo.mp4',
    status: 'LIVE',
    kind: { es: 'Gestión de franquicias', en: 'Franchise operations OS' },
    description: {
      es: 'Panel operativo para franquicias Grido: stock, facturas, turnos, personal, caja y auditorías en un solo dashboard.',
      en: 'Operations panel for Grido franchises: stock, invoices, shifts, staff, cash register and audits in one dashboard.'
    },
    value: {
      es: 'Consolida 6 áreas operativas con alertas de stock crítico y extracción automática de facturas en PDF.',
      en: 'Consolidates 6 operational areas with critical-stock alerts and automatic PDF invoice extraction.'
    },
    problem: {
      es: 'Los franquiciados gestionaban stock, facturas y turnos en herramientas sueltas, sin visión unificada ni alertas.',
      en: 'Franchise owners managed stock, invoices and shifts in disconnected tools, with no unified view or alerts.'
    },
    role: {
      es: 'Diseño y desarrollo full-stack (FastAPI + Next.js), extracción de PDFs y lógica de alertas de stock.',
      en: 'Full-stack design and development (FastAPI + Next.js), PDF extraction and stock-alert logic.'
    },
    evidence: {
      es: 'Producto en uso real por una franquicia, con dashboard desplegado, repositorio público y suite de tests.',
      en: 'A product in real use by a franchise, with a deployed dashboard, a public repository and a test suite.'
    },
    stack: ['FastAPI', 'Next.js', 'Recharts', 'Groq AI'],
    result: {
      es: 'Desplegado y en uso para operación de franquicias: stock, facturas y auditorías en un solo dashboard.',
      en: 'Deployed and in use for franchise operations: stock, invoices and audits in a single dashboard.'
    },
    // Completar cuando haya números reales (usuarios, pedidos, uptime…).
    // Con un valor distinto de null la tarjeta muestra la métrica sola.
    metrics: null
  },
  {
    id: 'dulces',
    title: 'Dulces Creaciones',
    repo: 'https://github.com/nachopalmeri/dulcescreaciones',
    href: 'https://dulcescreaciones.vercel.app',
    media: 'project-assets/dulcescreaciones.webp',
    video: 'project-assets/video/dulces-demo.mp4',
    loop: 'project-assets/video/dulces-loop.mp4',
    status: 'PUBLIC',
    kind: { es: 'Commerce Landing', en: 'Commerce Landing' },
    description: {
      es: 'Sitio comercial desplegado para una marca de productos dulces, dentro de la línea de landing/producto para negocios reales.',
      en: 'Deployed commercial site for a sweets brand, part of the landing/product line for real businesses.'
    },
    value: {
      es: 'Práctica de empaquetado visual, mensaje y despliegue rápido.',
      en: 'Practice in visual packaging, messaging and fast deployment.'
    },
    problem: {
      es: 'Convertir una marca de productos dulces en una vidriera web clara.',
      en: 'Turn a sweets brand into a clear web storefront.'
    },
    role: {
      es: 'Brand landing, copy comercial, presentación visual y deploy.',
      en: 'Brand landing, commercial copy, visual presentation and deploy.'
    },
    evidence: {
      es: 'Muestra velocidad para entregar sitios simples con criterio comercial.',
      en: 'Shows speed delivering simple sites with commercial judgment.'
    },
    stack: ['HTML', 'Commerce', 'Brand', 'Vercel'],
    result: {
      es: 'Landing comercial desplegada para una marca real de productos dulces.',
      en: 'Commercial landing deployed for a real confectionery brand.'
    },
    // Completar cuando haya números reales (usuarios, pedidos, uptime…).
    // Con un valor distinto de null la tarjeta muestra la métrica sola.
    metrics: null
  },
  {
    id: 'motor-estadistico',
    title: 'Motor Estadístico Predictivo',
    repo: 'https://github.com/nachopalmeri/prode-mundial-2026',
    href: 'https://prode-mundial-2026-ten-omega.vercel.app',
    media: 'project-assets/prode-mundial-2026.webp',
    video: 'project-assets/video/prode-demo.mp4',
    loop: 'project-assets/video/prode-loop.mp4',
    status: 'LIVE',
    kind: { es: 'Analytics de deportes', en: 'Sports analytics' },
    description: {
      es: 'Motor en Python para predicciones deportivas, probabilidad y dashboard.',
      en: 'Python engine for sports predictions, probability and dashboard.'
    },
    value: {
      es: 'Python, múltiples fuentes, matrices Poisson, simulaciones Monte Carlo y dashboard para usuarios no técnicos.',
      en: 'Python, multiple sources, Poisson matrices, Monte Carlo simulations and a dashboard for non-technical users.'
    },
    problem: {
      es: 'Transformar datos y predicciones deportivas en una experiencia usable para usuarios no técnicos.',
      en: 'Turn sports data and predictions into a usable experience for non-technical users.'
    },
    role: {
      es: 'Modelado de reglas, lógica Python, deploy y experiencia de participación.',
      en: 'Rule modeling, Python logic, deployment and participation experience.'
    },
    evidence: {
      es: 'Dashboard desplegado, repositorio público y lógica de predicción explicable desde el código.',
      en: 'Deployed dashboard, public repository and prediction logic that can be inspected in code.'
    },
    stack: ['Python', 'Analytics', 'Vercel', 'Game Logic'],
    result: {
      es: 'Desplegado con dashboard público de predicciones y simulaciones.',
      en: 'Deployed with a public dashboard of predictions and simulations.'
    },
    // Completar cuando haya números reales (usuarios, pedidos, uptime…).
    // Con un valor distinto de null la tarjeta muestra la métrica sola.
    metrics: null
  },
  {
    id: 'piscubi',
    title: 'Piscubi Store',
    repo: 'https://github.com/nachopalmeri/piscubi-store',
    href: 'https://piscubi-store.vercel.app',
    media: 'project-assets/piscubi.webp',
    video: 'project-assets/video/piscubi-demo.mp4',
    loop: 'project-assets/video/piscubi-loop.mp4',
    status: 'PUBLIC',
    kind: { es: 'E-commerce libros', en: 'E-commerce bookstore' },
    description: {
      es: 'E-commerce para libros digitales y físicos con estética synthwave neón, catálogo TOP 30 y pasarela de pago.',
      en: 'E-commerce bookstore for digital and physical books with synthwave aesthetics, TOP 30 catalog and checkout.'
    },
    value: {
      es: 'Combina identidad visual fuerte (synthwave neón, grid 3D) con catálogo funcional y conversión clara.',
      en: 'Combines a strong visual identity (neon synthwave, 3D grid) with a functional catalog and clear conversion.'
    },
    problem: {
      es: 'Crear una librería online con experiencia memorable de navegación sin perder velocidad de carga.',
      en: 'Create an online bookstore with a memorable browsing experience without sacrificing speed.'
    },
    role: {
      es: 'Diseño frontend, catálogo interactivo, estética synthwave y despliegue en Vercel.',
      en: 'Frontend design, interactive catalog, synthwave aesthetic and Vercel deployment.'
    },
    evidence: {
      es: 'Demo desplegada, video de producto y repositorio público.',
      en: 'Deployed demo, product video and public repository.'
    },
    stack: ['Next.js', 'E-commerce', 'Tailwind', 'Stripe'],
    result: {
      es: 'E-commerce desplegado con catálogo interactivo y pasarela de pago integrada.',
      en: 'Deployed e-commerce with an interactive catalog and payment gateway.'
    },
    // Completar cuando haya números reales (usuarios, pedidos, uptime…).
    // Con un valor distinto de null la tarjeta muestra la métrica sola.
    metrics: null
  },
  {
    id: 'pisku',
    title: 'PISKU CLI',
    repo: 'https://github.com/nachopalmeri/pisku-',
    href: 'https://pisku-cli.vercel.app',
    media: 'project-assets/pisku-cli-correct.webp',
    status: 'PUBLIC',
    kind: { es: 'CLI Product Interface', en: 'CLI Product Interface' },
    description: {
      es: 'Interfaz estilo CLI para mostrar un producto de control de gasto/ahorro con identidad propia y experiencia directa.',
      en: 'CLI-style interface for a spending/savings control product with a strong identity and direct experience.'
    },
    value: {
      es: 'Explora una forma distinta de empaquetar producto financiero sin caer en landing genérica.',
      en: 'Explores a different way to package a finance product without a generic landing.'
    },
    problem: {
      es: 'Presentar gestión de gasto/ahorro con una interfaz recordable y directa.',
      en: 'Present spending/savings control with a memorable, direct interface.'
    },
    role: {
      es: 'Dirección de producto, copy, experiencia CLI y despliegue web.',
      en: 'Product direction, copy, CLI experience and web deployment.'
    },
    evidence: {
      es: 'Demuestra criterio de empaque, narrativa y UX fuera del molde de landing.',
      en: 'Shows packaging, narrative and UX judgment beyond generic landing pages.'
    },
    stack: ['Python', 'CLI', 'Finance UX', 'Landing'],
    result: {
      es: 'Interfaz CLI desplegada como producto demostrable, con repo abierto.',
      en: 'CLI interface deployed as a demonstrable product, with an open repo.'
    },
    // Completar cuando haya números reales (usuarios, pedidos, uptime…).
    // Con un valor distinto de null la tarjeta muestra la métrica sola.
    metrics: null
  },
  {
    id: 'fulbotracker',
    title: 'FulboTracker',
    repo: 'https://github.com/nachopalmeri/fulbotracker',
    href: 'https://fulbotracker.vercel.app',
    media: 'project-assets/futtracker.webp',
    video: 'project-assets/video/fulbotracker-demo.mp4',
    loop: 'project-assets/video/fulbotracker-loop.mp4',
    status: 'PUBLIC',
    kind: { es: 'Sports Product', en: 'Sports Product' },
    description: {
      es: 'Producto para trackear partidos, torneos y dinámicas entre amigos, con foco en experiencia social simple.',
      en: 'Product for tracking matches, tournaments and friend-group dynamics with a simple social experience.'
    },
    value: {
      es: 'Convierte una actividad informal en flujo medible y compartible.',
      en: 'Turns an informal activity into a measurable and shareable flow.'
    },
    problem: {
      es: 'Transformar partidos entre amigos en registro, dinámica social y seguimiento.',
      en: 'Turn friend-group matches into records, social dynamics and tracking.'
    },
    role: {
      es: 'Producto social, estructura de datos simple e interfaz clara.',
      en: 'Social product, simple data structure and clear interface.'
    },
    evidence: {
      es: 'Muestra sensibilidad para productos pequenos con uso recurrente.',
      en: 'Shows sensitivity for small products with recurring use.'
    },
    stack: ['HTML', 'Product UX', 'Sports', 'Vercel'],
    result: {
      es: 'Desplegado y usado para trackear partidos y torneos entre amigos.',
      en: 'Deployed and used to track matches and tournaments among friends.'
    },
    // Completar cuando haya números reales (usuarios, pedidos, uptime…).
    // Con un valor distinto de null la tarjeta muestra la métrica sola.
    metrics: null
  },
  {
    id: 'comidadebarrio',
    title: 'Comida de Barrio',
    repo: 'https://github.com/nachopalmeri/comidadebarrio',
    href: 'https://comidadebarrio.vercel.app',
    media: 'project-assets/comidadebarrio.webp',
    video: 'project-assets/video/comidadebarrio-demo.mp4',
    loop: 'project-assets/video/comidadebarrio-loop.mp4',
    status: 'PUBLIC',
    kind: { es: 'Local Commerce', en: 'Local Commerce' },
    description: {
      es: 'Experimento web para comercio gastronómico local, enfocado en oferta clara, marca y conversión simple.',
      en: 'Web experiment for local food commerce, focused on clear offer, brand and simple conversion.'
    },
    value: {
      es: 'Muestra criterio para llevar negocios chicos a una presencia digital usable.',
      en: 'Shows judgment for turning small businesses into usable digital presences.'
    },
    problem: {
      es: 'Dar presencia digital concreta a un comercio gastronómico local.',
      en: 'Give a local food business a concrete digital presence.'
    },
    role: {
      es: 'Landing, mensaje comercial, dirección visual y conversión simple.',
      en: 'Landing page, commercial message, visual direction and simple conversion.'
    },
    evidence: {
      es: 'Muestra criterio para resolver necesidades reales sin sobredisenar.',
      en: 'Shows judgment for solving real needs without overdesigning.'
    },
    stack: ['HTML', 'Local Business', 'Landing', 'Vercel'],
    result: {
      es: 'Landing desplegada para un comercio gastronómico de barrio.',
      en: 'Landing deployed for a neighbourhood food business.'
    },
    // Completar cuando haya números reales (usuarios, pedidos, uptime…).
    // Con un valor distinto de null la tarjeta muestra la métrica sola.
    metrics: null
  },
  {
    id: 'dom',
    title: 'DOM',
    repo: 'https://github.com/nachopalmeri/dom',
    href: 'https://dom-two.vercel.app',
    media: 'project-assets/dom.webp',
    status: 'PUBLIC',
    kind: { es: 'Sports Landing', en: 'Sports Landing' },
    description: {
      es: 'Landing visual para experiencia deportiva, con foco en narrativa, CTA y presentación de propuesta.',
      en: 'Visual landing for a sports experience, focused on narrative, CTA and offer presentation.'
    },
    value: {
      es: 'Prueba de dirección visual y conversión en un contexto no técnico.',
      en: 'Visual direction and conversion practice in a non-technical context.'
    },
    problem: {
      es: 'Comunicar una propuesta deportiva con narrativa, impacto visual y CTA.',
      en: 'Communicate a sports offer with narrative, visual impact and CTA.'
    },
    role: {
      es: 'Dirección visual, estructura de landing y experiencia responsive.',
      en: 'Visual direction, landing structure and responsive experience.'
    },
    evidence: {
      es: 'Demuestra amplitud para construir interfaces no solo tecnicas.',
      en: 'Shows range for building interfaces beyond technical dashboards.'
    },
    stack: ['HTML', 'Sports', 'Landing', 'Vercel'],
    result: {
      es: 'Landing desplegada con repo abierto.',
      en: 'Landing deployed with an open repo.'
    },
    // Completar cuando haya números reales (usuarios, pedidos, uptime…).
    // Con un valor distinto de null la tarjeta muestra la métrica sola.
    metrics: null
  }
];

// Internal hrefs are app routes (/agents); everything else opens in a new tab.
function isInternalHref(href) {
  return typeof href === 'string' && href.startsWith('/') && !href.startsWith('//');
}

function projectField(project, field) {
  const value = project[field];
  if (!value || typeof value === 'string') return value || '';
  return value[currentLang] || value.es || value.en || '';
}

function projectMediaFallbackMarkup(project, kind, label) {
  return `
    <div class="project-media-fallback ${kind ? `kind-${kind.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : ''}">
      <span class="project-media-fallback-kicker">${escapeHtml(project.status)}</span>
      <strong>${escapeHtml(project.title)}</strong>
      <span>${escapeHtml(label || projectField(project, 'kind'))}</span>
    </div>
  `;
}

window.handleProjectMediaError = function handleProjectMediaError(img) {
  if (!img || !img.parentElement || img.dataset.fallbackApplied === 'true') return;
  const projectTitle = img.dataset.projectTitle || 'Project';
  const projectKind = img.dataset.projectKind || '';
  img.dataset.fallbackApplied = 'true';
  const container = img.parentElement;
  container.classList.add('media-fallback');
  container.innerHTML = projectMediaFallbackMarkup(
    {
      title: projectTitle,
      status: img.dataset.projectStatus || 'LIVE',
      kind: projectKind
    },
    projectKind,
    img.dataset.projectLabel || projectKind
  );
};

function projectImage(project, index, variant = 'mission') {
  const alt = `${project.title} screenshot`;
  const loading = variant === 'preview' && index === 0 ? 'eager' : 'lazy';
  const dataset = [
    `data-project-title="${escapeHtml(project.title)}"`,
    `data-project-kind="${escapeHtml(projectField(project, 'kind'))}"`,
    `data-project-status="${escapeHtml(project.status)}"`,
    `data-project-label="${escapeHtml(projectField(project, 'value'))}"`
  ].join(' ');
  return `
    <img
      src="${project.media}"
      alt="${escapeHtml(alt)}"
      loading="${loading}"
      decoding="async"
      onerror="handleProjectMediaError(this)"
      ${dataset}
      class="project-media-img project-media-${variant}"
    >
  `;
}

function renderProjectPreview(project, index, mode = 'active') {
  const previewClass = mode === 'hover' ? 'hover' : 'active';
  const videoSrc = project.loop || project.video;
  return `
    <article class="project-preview ${previewClass}" data-project-id="${project.id}" data-reveal="zoom" data-reveal-delay="${index * 90}">
      <figure class="project-preview-media project-media-container" data-project-id="${project.id}" ${project.video ? `data-video="${project.video}" tabindex="0" role="button" aria-label="${escapeHtml(project.title)} video preview"` : ''}>
        ${projectImage(project, index, 'preview')}
        ${videoSrc ? `<video class="project-media-video" muted loop playsinline preload="none" src="${videoSrc}"></video>` : ''}
        ${project.video ? `<span class="project-video-badge" aria-hidden="true"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"></polygon></svg> <span>Preview</span></span>` : ''}
      </figure>
      <div class="project-preview-copy">
        <div class="project-preview-kicker">${escapeHtml(project.status)} / ${escapeHtml(projectField(project, 'kind'))}</div>
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(projectField(project, 'description'))}</p>
        <dl class="project-proof-points">
          <div><dt>${currentLang === 'es' ? 'Problema' : 'Problem'}</dt><dd>${escapeHtml(projectField(project, 'problem'))}</dd></div>
          <div><dt>${currentLang === 'es' ? 'Rol' : 'Role'}</dt><dd>${escapeHtml(projectField(project, 'role'))}</dd></div>
          <div><dt>${currentLang === 'es' ? 'Resultado' : 'Result'}</dt><dd>${escapeHtml(projectField(project, 'result'))}</dd></div>
          ${project.metrics ? `<div><dt>${currentLang === 'es' ? 'Métricas' : 'Metrics'}</dt><dd>${escapeHtml(projectField(project, 'metrics'))}</dd></div>` : ''}
        </dl>
        <div class="project-preview-tags">${project.stack.slice(0, 4).map(item => `<span>${escapeHtml(item)}</span>`).join('')}</div>
        <div class="project-preview-links">
          ${project.href ? `<a class="carousel-proof" href="${project.href}" ${isInternalHref(project.href) ? `data-route="${project.href.replace(/^\//, '')}"` : 'target="_blank" rel="noopener noreferrer"'}>${escapeHtml(getCopy('projects.open'))}</a>` : ''}
          ${project.repo ? `<a class="carousel-proof subtle" href="${project.repo}" target="_blank" rel="noopener noreferrer">${escapeHtml(getCopy('projects.repo'))}</a>` : ''}
          ${project.video ? `<button type="button" class="carousel-proof subtle video-trigger" data-video-trigger="${project.video}">${escapeHtml(getCopy('projects.watchVideo'))}</button>` : ''}
        </div>
      </div>
    </article>
  `;
}

function renderProjectCarousel() {
  const carousel = document.getElementById('project-carousel');
  const archive = document.getElementById('project-archive');
  if (!carousel && !archive) return;

  if (carousel) {
    carousel.innerHTML = `
      <div class="featured-project-grid" aria-label="Featured projects">
        ${FEATURED_PROJECTS.map((project, index) => renderProjectPreview(project, index, 'active')).join('')}
      </div>
    `;
  }

  if (archive) {
    archive.innerHTML = FEATURED_PROJECTS.map((project, index) => {
      const tag = project.href ? 'a' : 'div';
      const hrefAttr = project.href ? ` href="${project.href}"` : '';
      const targetAttr = project.href && !isInternalHref(project.href) ? ' target="_blank" rel="noopener noreferrer"' : ` data-route="${(project.href || '').replace(/^\//, '')}"`;
      const videoSrc = project.loop || project.video;
      return `
      <${tag} class="archive-row ${index < 4 ? 'archive-row-featured' : 'archive-row-secondary'}" data-project-id="${project.id}" data-reveal="${index % 2 === 0 ? 'left' : 'right'}"${hrefAttr}${targetAttr}>
        <span class="archive-number">${String(index + 1).padStart(2, '0')}</span>
        <span class="archive-thumb project-media-container" tabindex="0" ${project.video ? `data-video="${project.video}" role="button" aria-label="${escapeHtml(project.title)} video preview"` : ''}>
          ${projectImage(project, index, 'archive')}
          ${videoSrc ? `<video class="project-media-video" muted loop playsinline preload="none" src="${videoSrc}"></video>` : ''}
          ${project.video ? `<span class="project-video-badge" aria-hidden="true"><svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"></polygon></svg></span>` : ''}
        </span>
        <span class="archive-main">
          <span class="archive-meta">${escapeHtml(project.status)} / ${escapeHtml(projectField(project, 'kind'))}</span>
          <strong>${escapeHtml(project.title)}</strong>
          <small>${escapeHtml(projectField(project, 'description'))}</small>
          <span class="archive-problem">${escapeHtml(projectField(project, 'problem'))}</span>
        </span>
        <span class="archive-tags">${project.stack.slice(0, 3).map(item => `<em>${escapeHtml(item)}</em>`).join('')}</span>
        ${project.href ? `<span class="archive-open">${escapeHtml(getCopy('projects.open'))}</span>` : ''}
      </${tag}>
    `;
    }).join('');
  }

  setupProjectVideoReveal();
  initScrollReveal();
  initProjectRoadmap();
}

const projectVideoRevealState = { canReveal: null };

function setupProjectVideoReveal() {
  const overlay = document.getElementById('project-video-reveal');
  const video = document.getElementById('project-video-reveal-video');
  const closeBtn = document.getElementById('project-video-reveal-close');

  if (projectVideoRevealState.canReveal === null) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    projectVideoRevealState.canReveal = canHover && !reduceMotion;
  }

  // 1. Silent Inline Hover Loop: activates ONLY when cursor is directly over project image
  if (projectVideoRevealState.canReveal) {
    document.querySelectorAll('.project-media-container').forEach((container) => {
      const mediaVideo = container.querySelector('video.project-media-video');
      if (!mediaVideo) return;

      let hoverTimer = null;

      container.addEventListener('mouseenter', () => {
        hoverTimer = setTimeout(() => {
          container.classList.add('is-playing');
          mediaVideo.play().catch(() => {});
        }, 75);
      });

      container.addEventListener('mouseleave', () => {
        if (hoverTimer) clearTimeout(hoverTimer);
        container.classList.remove('is-playing');
        try {
          mediaVideo.pause();
          mediaVideo.currentTime = 0;
        } catch (_e) {}
      });

      container.addEventListener('focusin', () => {
        container.classList.add('is-playing');
        mediaVideo.play().catch(() => {});
      });

      container.addEventListener('focusout', () => {
        container.classList.remove('is-playing');
        try {
          mediaVideo.pause();
          mediaVideo.currentTime = 0;
        } catch (_e) {}
      });
    });
  }

  // 2. Full Lightbox Player with audio & native controls (clicks only)
  function showModal(src) {
    if (!overlay || !video || !src) return;
    video.pause();
    video.setAttribute('src', src);
    video.muted = false;
    video.volume = 0.5; // Comfortable default volume
    video.controls = true;
    overlay.classList.add('is-visible', 'is-pinned');
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => {});
    });
  }

  function hideModal() {
    if (!overlay || !video) return;
    overlay.classList.remove('is-visible', 'is-pinned');
    video.pause();
    video.removeAttribute('src');
    try { video.load(); } catch (_e) {}
  }

  document.querySelectorAll('[data-video-trigger]').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      showModal(btn.dataset.videoTrigger);
    });
  });

  // Clicking directly on project media opens the full lightbox with sound
  document.querySelectorAll('.project-media-container[data-video]').forEach((container) => {
    container.addEventListener('click', (event) => {
      if (event.target.tagName === 'A') return;
      event.preventDefault();
      event.stopPropagation();
      showModal(container.dataset.video);
    });
  });

  if (!projectVideoRevealState.globalListenersBound && overlay) {
    projectVideoRevealState.globalListenersBound = true;
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) hideModal();
    });
    if (closeBtn) closeBtn.addEventListener('click', hideModal);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && overlay.classList.contains('is-visible')) hideModal();
    });
  }
}

function setupProjectCarousel() {
  renderProjectCarousel();
}

function setupThreeAiOpsHero(canvas, hero, nodes, reduceMotion) {
  const THREE = window.THREE;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 8.5);

  const group = new THREE.Group();
  scene.add(group);

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.72, 48, 48),
    new THREE.MeshBasicMaterial({ color: 0x0f172a, transparent: true, opacity: 0.82 })
  );
  group.add(core);

  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(1.08, 48, 48),
    new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.08, wireframe: true })
  );
  group.add(halo);

  const rings = [1.4, 2.0, 2.55].map((radius, index) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.008, 8, 120),
      new THREE.MeshBasicMaterial({ color: index === 1 ? 0x3b82f6 : 0x10b981, transparent: true, opacity: 0.34 })
    );
    ring.rotation.x = Math.PI / 2.8 + index * 0.18;
    ring.rotation.y = index * 0.45;
    group.add(ring);
    return ring;
  });

  const particleCount = window.innerWidth < 760 ? 36 : 90;
  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const radius = 1.5 + Math.random() * 3.8;
    const angle = Math.random() * Math.PI * 2;
    particlePositions[i * 3] = Math.cos(angle) * radius;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 3.8;
    particlePositions[i * 3 + 2] = Math.sin(angle) * radius * 0.72;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({ color: 0xededed, size: 0.035, transparent: true, opacity: 0.62 })
  );
  group.add(particles);

  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.24 });
  const nodeObjects = nodes.map((node, index) => {
    const nodeGroup = new THREE.Group();
    const angle = (index / nodes.length) * Math.PI * 2;
    nodeGroup.position.set(Math.cos(angle) * 3.0, Math.sin(angle) * 1.55, Math.sin(angle) * 0.85);

    const nodeMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.78 })
    );
    nodeGroup.add(nodeMesh);

    const sprite = makeTextSprite(node.label);
    sprite.position.set(0, -0.42, 0);
    nodeGroup.add(sprite);

    const lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), nodeGroup.position.clone()]);
    const line = new THREE.Line(lineGeometry, lineMaterial.clone());
    group.add(line);
    group.add(nodeGroup);
    return { group: nodeGroup, mesh: nodeMesh, line, angle, data: node, button: null };
  });

  // DOM buttons for each node, projected from world space to screen space
  // every frame (see updateNodeButtons). Real <button> elements so nodes are
  // keyboard-focusable and clickable without WebGL raycasting.
  const nodeLayer = hero.querySelector('[data-hero-node-layer]');
  if (nodeLayer) {
    nodeLayer.innerHTML = '';
    nodeObjects.forEach((node) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'hero-node-btn';
      const proofText = node.data.proof[currentLang] || node.data.proof.es;
      btn.setAttribute('aria-label', `${node.data.label}: ${proofText}`);
      btn.innerHTML = `<span class="hero-node-tooltip"><strong>${escapeHtml(node.data.label)}</strong><span>${escapeHtml(proofText)}</span></span>`;
      btn.addEventListener('click', () => {
        const target = document.querySelector(`#project-carousel [data-project-id="${node.data.projectId}"]`)
          || document.getElementById('project-carousel-title');
        if (!target) return;
        target.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'center' });
        target.classList.add('is-highlighted');
        setTimeout(() => target.classList.remove('is-highlighted'), 1600);
      });
      nodeLayer.appendChild(btn);
      node.button = btn;
    });
  }

  const nodeWorldPos = new THREE.Vector3();
  function updateNodeButtons() {
    if (!nodeLayer) return;
    nodeObjects.forEach((node) => {
      if (!node.button) return;
      const projected = node.group.getWorldPosition(nodeWorldPos).project(camera);
      const inView = projected.z < 1 && Math.abs(projected.x) < 1.15 && Math.abs(projected.y) < 1.15;
      node.button.classList.toggle('is-visible', inView);
      if (!inView) return;
      const x = (projected.x * 0.5 + 0.5) * width;
      const y = (projected.y * -0.5 + 0.5) * height;
      node.button.style.left = `${x}px`;
      node.button.style.top = `${y}px`;
    });
  }

  // Bounded mouse parallax: the group tilts toward the cursor within the
  // hero, gently, and eases back to idle rotation when the mouse leaves or
  // stays still. Disabled below the 900px breakpoint (same gate as resize())
  // and for prefers-reduced-motion.
  const parallax = { targetX: 0, targetY: 0, x: 0, y: 0 };
  function onHeroMouseMove(event) {
    if (reduceMotion.matches || width < 900) return;
    const rect = hero.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    parallax.targetX = -ny * 0.16;
    parallax.targetY = nx * 0.16;
  }
  function onHeroMouseLeave() {
    parallax.targetX = 0;
    parallax.targetY = 0;
  }
  hero.addEventListener('mousemove', onHeroMouseMove);
  hero.addEventListener('mouseleave', onHeroMouseLeave);

  let width = 0;
  let height = 0;
  let frameId = null;
  let running = false;

  function makeTextSprite(text) {
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 256;
    labelCanvas.height = 74;
    const labelCtx = labelCanvas.getContext('2d');
    if (!labelCtx) {
      const fallbackMaterial = new THREE.SpriteMaterial({ color: 0x10b981, transparent: true, opacity: 0.12 });
      const fallbackSprite = new THREE.Sprite(fallbackMaterial);
      fallbackSprite.scale.set(0.9, 0.24, 1);
      return fallbackSprite;
    }
    labelCtx.fillStyle = 'rgba(9,9,11,0.82)';
    roundedCanvasRect(labelCtx, 12, 12, 232, 46, 23);
    labelCtx.fill();
    labelCtx.strokeStyle = 'rgba(16,185,129,0.72)';
    labelCtx.lineWidth = 2;
    labelCtx.stroke();
    labelCtx.fillStyle = '#ededed';
    labelCtx.font = '700 24px Space Grotesk, Arial, sans-serif';
    labelCtx.textAlign = 'center';
    labelCtx.textBaseline = 'middle';
    labelCtx.fillText(text, 128, 35);
    const texture = new THREE.CanvasTexture(labelCanvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(1.18, 0.34, 1);
    return sprite;
  }

  function roundedCanvasRect(context, x, y, w, h, r) {
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + w, y, x + w, y + h, r);
    context.arcTo(x + w, y + h, x, y + h, r);
    context.arcTo(x, y + h, x, y, r);
    context.arcTo(x, y, x + w, y, r);
    context.closePath();
  }

  function resize() {
    const rect = hero.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(420, rect.height);
    renderer.setPixelRatio(Math.min(2, Math.max(1, window.devicePixelRatio || 1)));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // Convert the same "empty space right of the text column" pixel boundary
    // the 2D canvas uses (measureHeroGraphicLeft) into Three.js world space,
    // via the perspective camera's FOV: at distance z from the camera, a
    // plane through the origin shows a visible half-height of z*tan(fov/2),
    // and a visible half-width of that times the aspect ratio. Pixel->NDC
    // (-1..1) then NDC->world just scales by those half-extents.
    const halfHeightWorld = camera.position.z * Math.tan((camera.fov * Math.PI) / 360);
    const halfWidthWorld = halfHeightWorld * camera.aspect;
    const graphicLeftPx = width < 900 ? null : measureHeroGraphicLeft(hero);

    if (graphicLeftPx == null) {
      group.position.x = width < 900 ? 1.55 : 4.05;
      group.position.y = width < 760 ? 0.65 : -0.05;
      group.scale.setScalar(width < 760 ? 0.85 : 1.2);
    } else {
      const graphicWidthPx = Math.max(240, width - graphicLeftPx);
      const graphicCenterPx = graphicLeftPx + graphicWidthPx * 0.5;
      const ndcX = (graphicCenterPx / width) * 2 - 1;
      group.position.x = ndcX * halfWidthWorld;
      group.position.y = 0;

      // Scale the whole scene up to fill the available circle: rings extend
      // to radius 2.55 at scale 1, so ~2.6 world units is that footprint's
      // half-extent. Fit it inside whichever is tighter, the graphic column's
      // half-width or the hero's half-height, then go "gigante" (up to 1.8x)
      // while leaving a safety margin so rings never clip the hero edges.
      const graphicHalfWidthWorld = (graphicWidthPx / width) * halfWidthWorld;
      const fitWorld = Math.min(graphicHalfWidthWorld, halfHeightWorld) * 0.92;
      const baseFootprint = 2.6;
      group.scale.setScalar(Math.min(1.8, Math.max(0.9, fitWorld / baseFootprint)));
    }
  }

  function shouldRun() {
    return !reduceMotion.matches && document.visibilityState === 'visible' && document.getElementById('overview-section')?.classList.contains('active');
  }

  function render(time = 0) {
    const active = Math.floor(time / 1100) % nodeObjects.length;
    parallax.x += (parallax.targetX - parallax.x) * 0.06;
    parallax.y += (parallax.targetY - parallax.y) * 0.06;
    group.rotation.y = time * 0.00012 + parallax.y;
    group.rotation.x = parallax.x;
    core.rotation.y = time * 0.0005;
    halo.rotation.y = -time * 0.00035;
    particles.rotation.y = time * 0.00008;
    rings.forEach((ring, index) => {
      ring.rotation.z = time * (0.00018 + index * 0.00006);
    });
    nodeObjects.forEach((node, index) => {
      const angle = node.angle + time * 0.00022;
      node.group.position.set(Math.cos(angle) * 3.0, Math.sin(angle) * 1.55, Math.sin(angle) * 0.85);
      node.mesh.material.color.set(0x10b981);
      node.mesh.scale.setScalar(index === active ? 1.28 + Math.sin(time * 0.008) * 0.12 : 1);
      node.line.geometry.setFromPoints([new THREE.Vector3(0, 0, 0), node.group.position.clone()]);
      node.line.material.opacity = index === active ? 0.72 : 0.2;
    });
    group.updateMatrixWorld(true);
    updateNodeButtons();
    renderer.render(scene, camera);
    if (running) frameId = requestAnimationFrame(render);
  }

  function start() {
    running = shouldRun();
    if (frameId) cancelAnimationFrame(frameId);
    if (running) frameId = requestAnimationFrame(render);
    else render(0);
  }

  resize();
  start();
  window.addEventListener('resize', () => {
    resize();
    start();
  });
  document.addEventListener('visibilitychange', start);
  reduceMotion.addEventListener('change', () => {
    if (reduceMotion.matches) renderer.render(scene, camera);
    start();
  });
  window.addEventListener('hashchange', start);
  window.addEventListener('portfolio-tab-change', start);
}

// Shared by both the 3D and 2D hero: the graphic sits to the right of the
// text column, not in the middle of the whole (mostly-text) hero. Returns the
// pixel x, relative to the hero's left edge, where that empty space starts.
function measureHeroGraphicLeft(hero) {
  const heroCopy = hero.querySelector('.hero-copy');
  if (!heroCopy) return null;
  const heroRect = hero.getBoundingClientRect();
  const copyRect = heroCopy.getBoundingClientRect();
  return Math.max(0, copyRect.right - heroRect.left + 56);
}

function setupAiOpsHero() {
  const canvas = document.getElementById('ai-ops-canvas');
  const hero = document.querySelector('.ai-ops-hero');
  if (!canvas || !hero) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Real stack items tied to a real project, not generic labels — each node
  // in the hero is a legitimate proof point, and clicking one jumps to it.
  const nodes = [
    { label: 'FastAPI', projectId: 'jobbot', proof: { es: 'Backend y pagos de JobBot', en: 'JobBot backend and payments' } },
    { label: 'PostgreSQL', projectId: 'franquiya', proof: { es: 'Stock y facturas de FranquiYA', en: 'FranquiYA stock and invoices' } },
    { label: 'Python', projectId: 'motor-estadistico', proof: { es: 'Motor de predicciones deportivas', en: 'Sports prediction engine' } },
    { label: 'Next.js', projectId: 'piscubi', proof: { es: 'E-commerce de Piscubi Store', en: 'Piscubi Store e-commerce' } },
    { label: 'Playwright', projectId: 'agents-system', proof: { es: 'Tests de este mismo portfolio', en: 'Tests for this very portfolio' } }
  ];
  if (window.THREE && !reduceMotion.matches) {
    try {
      setupThreeAiOpsHero(canvas, hero, nodes, reduceMotion);
      return;
    } catch (error) {
      console.warn('Three.js hero failed, falling back to canvas 2D.', error);
    }
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    hero.classList.add('no-canvas');
    canvas.hidden = true;
    return;
  }
  let width = 0;
  let height = 0;
  let graphicLeft = 0; // where the text column ends, in canvas-local px
  let particles = [];
  let frameId = null;
  let running = false;
  const heroCopy = hero.querySelector('.hero-copy');

  function resize() {
    const rect = hero.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(420, rect.height);

    // The canvas is a full-bleed background layer, but the core should sit
    // centered in the empty space to the right of the text column, not in
    // the middle of the whole hero (which is mostly text on desktop).
    // Below the 900px breakpoint the grid drops to one column and this
    // canvas is hidden entirely (see the max-width:900px rule in style.css),
    // so a heroCopy-driven boundary only ever applies to the two-column case.
    graphicLeft = measureHeroGraphicLeft(hero) ?? width * 0.5;

    const ratio = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = width < 760 ? 36 : 90;
    particles = Array.from({ length: count }, (_, i) => ({
      seed: i,
      radius: 80 + Math.random() * Math.min(width, height) * 0.42,
      angle: Math.random() * Math.PI * 2,
      speed: 0.001 + Math.random() * 0.0022,
      size: 1 + Math.random() * 2.2,
      alpha: 0.14 + Math.random() * 0.42
    }));
  }

  function getCore() {
    const graphicWidth = Math.max(240, width - graphicLeft);
    return {
      x: width < 900 ? width * 0.54 : graphicLeft + graphicWidth * 0.5,
      y: height * 0.5,
      // Bigger presence on desktop: ~1.7x the old radius (r scales area, so
      // ~2.9x more "mass" on screen), while staying inside min(graphicWidth,
      // height) so the orbit rings (up to ~1.85x r) never clip the hero edges.
      r: Math.min(graphicWidth, height) * (width < 760 ? 0.11 : 0.22)
    };
  }

  function nodePosition(index, time) {
    const core = getCore();
    const angle = (index / nodes.length) * Math.PI * 2 - Math.PI / 2 + Math.sin(time * 0.0004) * 0.08;
    const rx = core.r * 2.8;
    const ry = core.r * 2.05;
    return {
      x: core.x + Math.cos(angle) * rx,
      y: core.y + Math.sin(angle) * ry
    };
  }

  function draw(time = 0) {
    ctx.clearRect(0, 0, width, height);
    const core = getCore();
    const active = Math.floor(time / 1100) % nodes.length;

    const gradient = ctx.createRadialGradient(core.x, core.y, 0, core.x, core.y, core.r * 3.6);
    gradient.addColorStop(0, 'rgba(16,185,129,0.28)');
    gradient.addColorStop(0.38, 'rgba(59,130,246,0.11)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(core.x, core.y, core.r * 3.6, 0, Math.PI * 2);
    ctx.fill();

    particles.forEach((particle) => {
      if (!reduceMotion.matches) particle.angle += particle.speed;
      const x = core.x + Math.cos(particle.angle) * particle.radius;
      const y = core.y + Math.sin(particle.angle * 0.86) * particle.radius * 0.55;
      ctx.fillStyle = `rgba(237,237,237,${particle.alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });

    for (let ring = 0; ring < 3; ring++) {
      ctx.strokeStyle = ring === 1 ? 'rgba(59,130,246,0.28)' : 'rgba(16,185,129,0.24)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(core.x, core.y, core.r * (1.25 + ring * 0.62), core.r * (0.74 + ring * 0.34), time * 0.00025 + ring, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = 'rgba(9,9,11,0.72)';
    ctx.strokeStyle = 'rgba(16,185,129,0.62)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(core.x, core.y, core.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ededed';
    ctx.font = '700 13px Space Grotesk, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('AI CORE', core.x, core.y + 4);

    nodes.forEach((node, index) => {
      const pos = nodePosition(index, time);
      const isActive = index === active;
      ctx.strokeStyle = isActive ? 'rgba(16,185,129,0.82)' : 'rgba(255,255,255,0.12)';
      ctx.lineWidth = isActive ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(core.x, core.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();

      const pulse = isActive && !reduceMotion.matches ? Math.sin(time * 0.008) * 4 : 0;
      ctx.fillStyle = isActive ? 'rgba(16,185,129,0.22)' : 'rgba(18,18,21,0.78)';
      ctx.strokeStyle = isActive ? 'rgba(16,185,129,0.86)' : 'rgba(255,255,255,0.15)';
      roundRect(ctx, pos.x - 52 - pulse / 2, pos.y - 18 - pulse / 2, 104 + pulse, 36 + pulse, 18);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = isActive ? '#ededed' : 'rgba(237,237,237,0.72)';
      ctx.font = '700 11px Space Grotesk, sans-serif';
      ctx.fillText(node.label, pos.x, pos.y + 4);
    });

    if (!reduceMotion.matches && running) frameId = requestAnimationFrame(draw);
  }

  function roundRect(context, x, y, w, h, r) {
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + w, y, x + w, y + h, r);
    context.arcTo(x + w, y + h, x, y + h, r);
    context.arcTo(x, y + h, x, y, r);
    context.arcTo(x, y, x + w, y, r);
    context.closePath();
  }

  function shouldRun() {
    return !reduceMotion.matches && document.visibilityState === 'visible' && document.getElementById('overview-section')?.classList.contains('active');
  }

  function start() {
    running = shouldRun();
    if (frameId) cancelAnimationFrame(frameId);
    if (running) frameId = requestAnimationFrame(draw);
    else draw(0);
  }

  resize();
  start();
  window.addEventListener('resize', () => {
    resize();
    start();
  });
  document.addEventListener('visibilitychange', start);
  reduceMotion.addEventListener('change', start);
  window.addEventListener('hashchange', start);
  window.addEventListener('portfolio-tab-change', start);
}

document.addEventListener('DOMContentLoaded', () => {
  setupPreferenceControls();
  setupProjectCarousel();
  setupAiOpsHero();
  setupGithubContributions();
  initHeroRoleRotator();
  initNavbarScroll();
  initScrollReveal();
  initCounters();
  initProjectRoadmap();
  initFlowSection();
  // Navigation tabs
  const navTabs = document.querySelectorAll('.nav-tab');
  const viewSections = document.querySelectorAll('.view-section');

  function switchTab(tabId) {
    // Update tabs active state
    navTabs.forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-tab') === tabId);
    });

    // Update section active state
    viewSections.forEach(section => {
      section.classList.toggle('active', section.id === `${tabId}-section`);
    });

    // Initialize ecosystem canvas when switching to agents tab
    if (tabId === 'agents') {
      setTimeout(initEcosystem, 100);
    } else {
      stopEcosystemLoop();
    }
    window.dispatchEvent(new CustomEvent('portfolio-tab-change', { detail: { tabId } }));
  }

  const VALID_TABS = ['overview', 'projects', 'agents'];

  function pathForTab(tabId) {
    return tabId === 'overview' ? '/' : `/${tabId}`;
  }

  function navigate(tabId, { replace = false } = {}) {
    const path = pathForTab(tabId);
    if (window.location.pathname !== path) {
      history[replace ? 'replaceState' : 'pushState']({ tabId }, '', path);
    }
    switchTab(tabId);
  }

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => navigate(tab.getAttribute('data-tab')));
  });

  // In-page links to a tab (hero CTA, header CTA, project cards) route without
  // a full reload; everything else keeps its normal behaviour.
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-route]');
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    const tabId = link.dataset.route;
    if (!VALID_TABS.includes(tabId)) return;
    event.preventDefault();
    navigate(tabId);
  });

  // Routes are real paths (/projects). Legacy #/projects links still work and
  // get rewritten to the clean path on arrival.
  function handleRouting({ replace = false } = {}) {
    const hash = window.location.hash;
    if (hash.startsWith('#/')) {
      const hashTab = hash.slice(2);
      if (VALID_TABS.includes(hashTab)) {
        history.replaceState({ tabId: hashTab }, '', pathForTab(hashTab));
        switchTab(hashTab);
        return;
      }
    }

    const pathTab = window.location.pathname.replace(/^\/+|\/+$/g, '');
    if (VALID_TABS.includes(pathTab)) {
      switchTab(pathTab);
      return;
    }
    navigate('overview', { replace });
  }

  window.addEventListener('popstate', () => handleRouting());
  handleRouting({ replace: true }); // Initial call
});


// ═══════════════════ AGENT ECOSYSTEM CODE (V7) ═══════════════════

let ecoInitialized = false;
let canvasUnder, canvasOver, ctxUnder, ctxOver;
let ecoVp, ecoGraphWrapper, ecoSubUniverse;
let hudElement, hudDot, hudName, hudRole, hudBody, hudMeta;
let wfpPanel, wfList, stagePanel, stageBadge, stageText, stageStep;
let backBtn, ecoHint, statsBadge;
let ecoGraphicsReady = false;

let nodesData = [];
let linksData = [];
let workflowsData = [];
let ambientParticles = [];
let activeWfParticles = [];

let width = 0, height = 0;
let selectedNodeId = null;
let hoveredNodeId = null;
let activeWorkflow = null;
let workflowTimeout = null;
let animationFrameId = null;

// Colors
const ACCENT_COLORS = {
  principal:  { c: '#3b82f6', s: 'rgba(59, 130, 246, 0.15)' }, // Blue
  architect:  { c: '#f97316', s: 'rgba(249, 115, 22, 0.15)' },  // Orange
  design:     { c: '#a855f7', s: 'rgba(168, 85, 247, 0.15)' }, // Purple
  growth:     { c: '#10b981', s: 'rgba(16, 185, 129, 0.15)' }, // Green
  security:   { c: '#ef4444', s: 'rgba(239, 68, 68, 0.15)' },   // Red
  tests:      { c: '#22c55e', s: 'rgba(34, 197, 94, 0.15)' },   // Emerald
  docs:       { c: '#facc15', s: 'rgba(250, 204, 21, 0.15)' },   // Yellow
  product:    { c: '#f472b6', s: 'rgba(244, 114, 182, 0.15)' }, // Pink
  mcp:        { c: '#06b6d4', s: 'rgba(6, 182, 212, 0.15)' },   // Cyan
  researcher: { c: '#8b5cf6', s: 'rgba(139, 92, 246, 0.15)' },  // Violet
  reviewer:   { c: '#60a5fa', s: 'rgba(96, 165, 250, 0.15)' },  // Sky
  obsidian:   { c: '#c084fc', s: 'rgba(192, 132, 252, 0.15)' }, // Purple
  release:    { c: '#fbbf24', s: 'rgba(251, 191, 36, 0.15)' },  // Gold
  content:    { c: '#fb7185', s: 'rgba(251, 113, 133, 0.15)' }, // Rose
  marketing:  { c: '#fb923c', s: 'rgba(251, 146, 60, 0.15)' },  // Orange
  system:     { c: '#71717a', s: 'rgba(113, 113, 122, 0.15)' }, // Gray
  gate:       { c: '#f59e0b', s: 'rgba(245, 158, 11, 0.15)' },   // Amber
  harness:    { c: '#a855f7', s: 'rgba(168, 85, 247, 0.15)' }  // Purple
};

function getAccent(colKey) {
  return ACCENT_COLORS[colKey] || ACCENT_COLORS.system;
}

const SYSTEM_ICONS = {
  user: `<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  rules: `<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  memory: `<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
  gate: `<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  harness: `<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,
  check: `<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/><path d="M19 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h8"/></svg>`,
  layout: `<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>`
};

// Original illustrated bust avatars. Each of the 14 agent roles is coded as a distinct,
// recognizable Middle-earth character (Gandalf, Aragorn, Legolas...) so no two nodes look
// alike, while every shape below is hand-authored artwork for this project, not a trace
// or reproduction of any studio's licensed costume/character design.
function fantasyBust(o) {
  const ear = o.ears === 'point'
    ? `<path d="M20 38 L6 30 L18 50 Z" fill="${o.skin}"/><path d="M80 38 L94 30 L82 50 Z" fill="${o.skin}"/>`
    : o.ears === 'round'
    ? `<circle cx="23" cy="46" r="5.5" fill="${o.skin}"/><circle cx="77" cy="46" r="5.5" fill="${o.skin}"/>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M8 100 Q8 70 28 64 L72 64 Q92 70 92 100 Z" fill="${o.cloak}"/>${o.cloakTrim || ''}<rect x="41" y="52" width="18" height="18" rx="5" fill="${o.skin}"/>${ear}<circle cx="50" cy="38" r="23" fill="${o.skin}"/>${o.hair || ''}${o.gearBack || ''}<circle cx="41.5" cy="38" r="2.4" fill="#2b2320"/><circle cx="58.5" cy="38" r="2.4" fill="#2b2320"/>${o.beard || ''}${o.gear || ''}</svg>`;
}

const AGENT_ICONS = {
  // Gandalf the Grey
  principal: fantasyBust({
    cloak:'#4b5563', skin:'#e8b98a', ears:'none',
    beard:`<path d="M32 44 Q30 66 40 80 Q50 86 60 80 Q70 66 68 44 Q64 56 50 58 Q36 56 32 44Z" fill="#e8e9ec"/>`,
    gear:`<path d="M50 2 L66 30 Q50 24 34 30 Z" fill="#6b7280"/><ellipse cx="50" cy="30" rx="18" ry="4" fill="#334155"/><line x1="80" y1="62" x2="87" y2="16" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/><path d="M84 12 Q87 8 90 12 Q90 17 87 20 Q84 17 84 12Z" fill="#93c5fd"/>`
  }),
  // Gimli, son of Glóin
  mcp: fantasyBust({
    cloak:'#5b3a1f', skin:'#d99a6c', ears:'none',
    beard:`<path d="M28 42 Q22 70 32 86 Q42 94 50 90 Q58 94 68 86 Q78 70 72 42 Q64 60 50 62 Q36 60 28 42Z" fill="#8b5e34"/><path d="M34 66 Q30 78 36 88" stroke="#6b4423" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M66 66 Q70 78 64 88" stroke="#6b4423" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    gear:`<path d="M27 32 Q27 12 50 12 Q73 12 73 32 L73 24 Q50 15 27 24Z" fill="#71717a"/><path d="M27 24 Q16 20 15 8 Q24 10 30 22Z" fill="#a1a1aa"/><path d="M73 24 Q84 20 85 8 Q76 10 70 22Z" fill="#a1a1aa"/><rect x="78" y="58" width="6" height="26" rx="2" fill="#78350f" transform="rotate(38 81 71)"/><path d="M68 46 Q78 34 92 40 Q94 52 82 58 Q72 56 68 46Z" fill="#cbd5e1"/>`
  }),
  // Aragorn, son of Arathorn
  architect: fantasyBust({
    cloak:'#374151', skin:'#c98a5e', ears:'none',
    hair:`<path d="M27 30 Q27 14 50 14 Q73 14 73 30 Q73 20 50 20 Q27 20 27 30Z" fill="#2b2320"/>`,
    beard:`<path d="M36 50 Q34 60 40 66 Q50 70 60 66 Q66 60 64 50 Q56 58 50 58 Q44 58 36 50Z" fill="#2b2320"/>`,
    gear:`<line x1="74" y1="44" x2="90" y2="86" stroke="#e5e7eb" stroke-width="4" stroke-linecap="round"/><path d="M78 42 L92 40 L94 48 L80 50Z" fill="#94a3b8"/><rect x="76" y="52" width="16" height="5" rx="1.5" fill="#78350f" transform="rotate(66 84 54)"/><rect x="30" y="20" width="40" height="5" rx="2.5" fill="#a1a1aa"/>`
  }),
  // Elrond of Rivendell
  researcher: fantasyBust({
    cloak:'#4c1d95', skin:'#e7c9a9', ears:'point',
    hair:`<path d="M26 34 Q24 18 50 15 Q76 18 74 34 Q78 60 70 66 L68 40 Q68 22 50 21 Q32 22 32 40 L30 66 Q22 60 26 34Z" fill="#2e1065"/>`,
    gear:`<rect x="31" y="19" width="38" height="4" rx="2" fill="#c4b5fd"/><rect x="76" y="58" width="14" height="10" rx="1.5" fill="#ede9fe" stroke="#8b5cf6" stroke-width="1.5"/><line x1="83" y1="58" x2="83" y2="68" stroke="#8b5cf6" stroke-width="1"/>`
  }),
  // Legolas Greenleaf
  design: fantasyBust({
    cloak:'#166534', skin:'#f0d3b3', ears:'point',
    hair:`<path d="M27 32 Q26 15 50 13 Q74 15 73 32 Q69 20 61 24 Q56 12 50 20 Q44 12 39 24 Q31 20 27 32Z" fill="#eab308"/><path d="M70 30 Q82 34 79 52 Q74 46 70 38Z" fill="#eab308"/>`,
    gear:`<path d="M80 22 Q98 48 80 76" stroke="#78350f" stroke-width="3" fill="none" stroke-linecap="round"/><line x1="80" y1="22" x2="80" y2="76" stroke="#e5e7eb" stroke-width="1.2"/><rect x="60" y="46" width="24" height="4" rx="2" fill="#fbbf24" transform="rotate(-8 72 48)"/>`
  }),
  // Frodo Baggins, Ring-bearer
  product: fantasyBust({
    cloak:'#166534', skin:'#e8b98a', ears:'round',
    hair:`<path d="M27 32 Q24 12 50 12 Q76 12 73 32 Q68 18 60 24 Q54 14 50 22 Q46 14 40 24 Q32 18 27 32Z" fill="#92400e"/>`,
    gear:`<line x1="50" y1="64" x2="50" y2="80" stroke="#cbd5e1" stroke-width="1.5"/><circle cx="50" cy="83" r="4.5" fill="none" stroke="#fbbf24" stroke-width="2.5"/>`
  }),
  // Bilbo Baggins, author of the Red Book
  docs: fantasyBust({
    cloak:'#78350f', skin:'#d9a066', ears:'round',
    hair:`<path d="M28 30 Q28 16 50 15 Q72 16 72 30 Q72 22 50 21 Q28 22 28 30Z" fill="#d1d5db"/>`,
    gear:`<circle cx="41.5" cy="38" r="7" fill="none" stroke="#d4a017" stroke-width="1.6"/><circle cx="58.5" cy="38" r="7" fill="none" stroke="#d4a017" stroke-width="1.6"/><line x1="48.5" y1="38" x2="51.5" y2="38" stroke="#d4a017" stroke-width="1.6"/><rect x="78" y="56" width="3.2" height="24" rx="1.5" fill="#facc15" transform="rotate(24 80 56)"/>`
  }),
  // Samwise Gamgee
  tests: fantasyBust({
    cloak:'#a16207', skin:'#c17a4d', ears:'round',
    hair:`<path d="M27 32 Q25 13 50 12 Q75 13 73 32 Q70 20 63 22 Q56 12 50 20 Q44 12 37 22 Q30 20 27 32Z" fill="#b45309"/>`,
    gear:`<path d="M30 66 Q50 76 70 66 L70 72 Q50 82 30 72Z" fill="#78350f"/><circle cx="40" cy="69" r="2" fill="#fde68a"/><circle cx="60" cy="69" r="2" fill="#fde68a"/>`
  }),
  // Boromir, Captain of the White Tower
  security: fantasyBust({
    cloak:'#7f1d1d', skin:'#c98a5e', ears:'none',
    gear:`<path d="M26 36 Q24 12 50 10 Q76 12 74 36 L74 46 L64 46 L64 34 L36 34 L36 46 L26 46Z" fill="#a3a3a3"/><rect x="47" y="30" width="6" height="30" fill="#525252"/><circle cx="50" cy="12" r="4" fill="#d4d4d4"/><path d="M76 50 Q88 54 90 44 Q94 56 82 62 Q76 60 76 50Z" fill="#eab308"/>`
  }),
  // Éowyn, Shieldmaiden of Rohan
  growth: fantasyBust({
    cloak:'#15803d', skin:'#f0d3b3', ears:'none',
    hair:`<path d="M27 30 Q25 15 50 14 Q75 15 73 30 L70 68 Q66 50 68 34 Q60 20 50 20 Q40 20 32 34 Q34 50 30 68Z" fill="#eab308"/>`,
    gear:`<circle cx="80" cy="64" r="10" fill="none" stroke="#e5e7eb" stroke-width="3"/><line x1="80" y1="57" x2="80" y2="71" stroke="#e5e7eb" stroke-width="1.6"/><line x1="73" y1="64" x2="87" y2="64" stroke="#e5e7eb" stroke-width="1.6"/><line x1="18" y1="82" x2="26" y2="40" stroke="#e5e7eb" stroke-width="3" stroke-linecap="round"/><rect x="16" y="76" width="14" height="5" rx="1.5" fill="#78350f" transform="rotate(-10 23 78)"/>`
  }),
  // Meriadoc Brandybuck, blower of the Horn of the Mark
  marketing: fantasyBust({
    cloak:'#c2410c', skin:'#d9a066', ears:'round',
    hair:`<path d="M28 30 Q26 13 50 12 Q74 13 72 30 Q68 18 60 22 Q54 12 50 20 Q46 12 40 22 Q32 18 28 30Z" fill="#b91c1c"/>`,
    gear:`<path d="M72 48 Q88 44 90 32 Q95 44 86 54 Q78 56 72 48Z" fill="#eab308"/><circle cx="90" cy="33" r="2.3" fill="#eab308"/>`
  }),
  // Galadriel, Lady of Lothlórien
  content: fantasyBust({
    cloak:'#a16207', skin:'#f0d3b3', ears:'point',
    hair:`<path d="M27 34 Q23 14 50 13 Q77 14 73 34 Q76 60 68 70 L67 40 Q67 22 50 21 Q33 22 33 40 L32 70 Q24 60 27 34Z" fill="#f5f0dc"/>`,
    gear:`<rect x="30" y="19" width="40" height="4" rx="2" fill="#fef9c3"/><path d="M84 66 L88 76 L98 78 L90 85 L92 96 L84 90 L76 96 L78 85 L70 78 L80 76Z" fill="#fef08a"/>`
  }),
  // Saruman the White
  reviewer: fantasyBust({
    cloak:'#e5e7eb', skin:'#e0c3a3', ears:'none',
    cloakTrim:`<path d="M28 64 L72 64 L72 72 L28 72Z" fill="#94a3b8"/>`,
    hair:`<path d="M29 28 Q29 16 50 16 Q71 16 71 28 Q65 20 50 20 Q35 20 29 28Z" fill="#f9fafb"/>`,
    beard:`<path d="M34 46 Q32 62 40 72 Q50 78 60 72 Q68 62 66 46 Q60 56 50 56 Q40 56 34 46Z" fill="#f9fafb"/>`,
    gear:`<line x1="18" y1="80" x2="24" y2="14" stroke="#d1d5db" stroke-width="2.5" stroke-linecap="round"/><path d="M21 10 Q24 6 27 10 Q27 15 24 18 Q21 15 21 10Z" fill="#f9fafb"/>`
  }),
  // Théoden, King of Rohan
  release: fantasyBust({
    cloak:'#1e3a5f', skin:'#c98a5e', ears:'none',
    hair:`<path d="M28 30 Q28 16 50 15 Q72 16 72 30 Q70 20 50 19 Q30 20 28 30Z" fill="#d1d5db"/>`,
    beard:`<path d="M38 48 Q36 56 42 60 Q50 63 58 60 Q64 56 62 48 Q56 54 50 54 Q44 54 38 48Z" fill="#d1d5db"/>`,
    gear:`<path d="M26 26 Q26 10 50 8 Q74 10 74 26 Q74 18 50 15 Q26 18 26 26Z" fill="#78350f"/><ellipse cx="50" cy="26" rx="26" ry="4" fill="#fbbf24"/><path d="M40 8 Q44 -6 48 8Z" fill="#e5e7eb"/><path d="M60 8 Q56 -6 52 8Z" fill="#e5e7eb"/>`
  })
};

// Personal-use only (not public): real movie-still photos, one per role, mapped to the same
// characters as AGENT_ICONS above. AGENT_ICONS remains as the onerror fallback.
const AGENT_AVATARS = {
  principal: 'project-assets/agent-avatars/principal.jpg',
  mcp: 'project-assets/agent-avatars/mcp.jpg',
  architect: 'project-assets/agent-avatars/architect.jpg',
  researcher: 'project-assets/agent-avatars/researcher.jpg',
  design: 'project-assets/agent-avatars/design.jpg',
  product: 'project-assets/agent-avatars/product.jpg',
  docs: 'project-assets/agent-avatars/docs.jpg',
  tests: 'project-assets/agent-avatars/tests.jpg',
  security: 'project-assets/agent-avatars/security.jpg',
  growth: 'project-assets/agent-avatars/growth.jpg',
  marketing: 'project-assets/agent-avatars/marketing.jpg',
  content: 'project-assets/agent-avatars/content.jpg',
  reviewer: 'project-assets/agent-avatars/reviewer.jpg',
  release: 'project-assets/agent-avatars/release.jpg'
};

function initEcosystem() {
  if (ecoInitialized) {
    resizeCanvas();
    startEcosystemLoop();
    return;
  }

  // Get DOM Elements
  canvasUnder = document.getElementById('eco-canvas-under');
  canvasOver = document.getElementById('eco-canvas-over');
  ecoVp = document.getElementById('eco-viewport');
  ecoGraphWrapper = document.getElementById('eco-graph-wrapper');
  ecoSubUniverse = document.getElementById('eco-sub-universe');
  
  hudElement = document.getElementById('eco-hud');
  hudDot = document.getElementById('eco-hud-dot');
  hudName = document.getElementById('eco-hud-name');
  hudRole = document.getElementById('eco-hud-role');
  hudBody = document.getElementById('eco-hud-body');
  hudMeta = document.getElementById('eco-hud-meta');
  
  wfpPanel = document.getElementById('eco-wfp');
  wfList = document.getElementById('eco-wf-list');
  
  stagePanel = document.getElementById('eco-stage');
  stageBadge = document.getElementById('eco-stage-badge');
  stageText = document.getElementById('eco-stage-text');
  stageStep = document.getElementById('eco-stage-step');
  
  backBtn = document.getElementById('eco-back-btn');
  ecoHint = document.getElementById('eco-hint');
  statsBadge = document.getElementById('eco-stats-badge');

  ecoGraphicsReady = Boolean(canvasUnder && canvasOver);
  ctxUnder = ecoGraphicsReady ? canvasUnder.getContext('2d') : null;
  ctxOver = ecoGraphicsReady ? canvasOver.getContext('2d') : null;
  ecoGraphicsReady = Boolean(ecoGraphicsReady && ctxUnder && ctxOver);
  if (!ecoGraphicsReady && ecoVp) {
    ecoVp.classList.add('no-canvas');
  }

  // Load Data
  setupCurrentAgentPortfolioData();
  
  // Render HTML Nodes
  buildNodes();
  
  // Event listeners
  resizeCanvas();
  if (ecoGraphicsReady) {
    // Re-measure after the browser paints the now-visible section
    requestAnimationFrame(() => {
      resizeCanvas();
      requestAnimationFrame(resizeCanvas);
    });
    window.addEventListener('resize', resizeCanvas);
  }
  
  backBtn && backBtn.addEventListener('click', collapseGraph);
  ecoVp.addEventListener('click', (e) => {
    if (selectedNodeId && !e.target.closest('.eco-node') && !e.target.closest('.sub-node') && !e.target.closest('#eco-hud')) {
      collapseGraph();
    }
  });

  ecoInitialized = true;
  if (ecoGraphicsReady) startEcosystemLoop();
}

function setupCurrentAgentPortfolioData() {
  const es = currentLang === 'es';
  const g = {
    director: es ? 'Ordena prioridades, define el siguiente paso y mantiene evidencia visible.' : 'Orders priorities, defines the next step and keeps evidence visible.',
    architect: es ? 'Baja una idea a arquitectura simple: datos, API, UI, riesgos y despliegue.' : 'Turns an idea into simple architecture: data, API, UI, risks and deployment.',
    mcp: es ? 'Evalúa herramientas, permisos e integraciones antes de sumarlas al flujo.' : 'Reviews tools, permissions and integrations before adding them to the workflow.',
    researcher: es ? 'Investiga documentación y alternativas antes de proponer una implementación.' : 'Researches documentation and alternatives before proposing an implementation.',
    design: es ? 'Cuida responsive, accesibilidad visual, motion y claridad de interfaz.' : 'Cares about responsive behavior, visual accessibility, motion and interface clarity.',
    tests: es ? 'Cobertura, Playwright, regresión y evidencia verificable.' : 'Coverage, Playwright, regression and verifiable evidence.',
    security: es ? 'Secretos, dependencias, permisos y publicación segura.' : 'Secrets, dependencies, permissions and safe publishing.',
    docs: es ? 'Documentación técnica clara: README, guías, API docs y handoff.' : 'Clear technical documentation: README, guides, API docs and handoff.',
    obsidian: es ? 'Memoria local, MOCs, notas y captura durable de conocimiento.' : 'Local memory, MOCs, notes and durable knowledge capture.',
    product: es ? 'Define alcance, usuario, prueba mínima y próximos pasos concretos.' : 'Defines scope, user, minimum proof and concrete next steps.',
    growth: es ? 'Ajusta posicionamiento, claridad de oferta y canales de búsqueda.' : 'Improves positioning, offer clarity and search channels.',
    marketing: es ? 'Posicionamiento, GTM y research de audiencia.' : 'Positioning, GTM and audience research.',
    content: es ? 'Contenido multiplataforma con voz propia y consistencia.' : 'Multi-platform content with a consistent voice.',
    reviewer: es ? 'Revisión de código, riesgos y calidad antes de integrar cambios.' : 'Code review, risks and quality before merging changes.',
    release: es ? 'Changelog, validación de instalación y publicación reproducible.' : 'Changelog, install validation and reproducible publishing.',
    user: es ? 'Entrada externa y pedidos en lenguaje natural.' : 'External input and requests in natural language.',
    rules: es ? 'Reglas globales, permisos y estilo del sistema.' : 'Global rules, permissions and system style.',
    memory: es ? 'Notas locales para no perder decisiones, lecciones y patrones útiles.' : 'Local notes for preserving decisions, lessons and useful patterns.',
    gate: es ? 'Criterios de validación y evidencia antes de cerrar una tarea.' : 'Validation criteria and evidence before closing a task.',
    harness: es ? 'Captura correcciones y mejora el sistema con feedback.' : 'Captures corrections and improves the system with feedback.'
  };

  nodesData = [
    agentNode('principal', es ? 'Plan' : 'Plan', 'workflow-planning', g.director, 50, 48, 'principal', [
      sub('workflows/index.md', 'workflow'), sub('Agent Routing', 'workflow'), sub('validation.md', 'rules'), sub('session_checkpoint.md', 'memory'), sub('Release Manager', 'workflow'), sub('project_kickoff_lean.md', 'workflow')
    ]),
    agentNode('mcp', es ? 'Tools' : 'Tools', 'tooling-check', g.mcp, 50, 15, 'mcp', [
      sub('mcp_catalog.md', 'workflow'), sub('mcp_adoption.md', 'workflow'), sub('mcp_security.md', 'rules'), sub('Tool Schemas', 'tool')
    ]),
    agentNode('architect', es ? 'Architecture' : 'Architecture', 'simple-architecture', g.architect, 67, 21, 'architect', [
      sub('ai_production.md', 'workflow'), sub('Prompt Registry', 'memory'), sub('Evaluations', 'rules'), sub('Cost Control', 'rules'), sub('Tech Radar', 'rules')
    ]),
    agentNode('researcher', 'Researcher', 'agente-researcher.md', g.researcher, 81, 33, 'researcher', [
      sub('Current Docs', 'tool'), sub('Library Research', 'workflow'), sub('Repo Grep', 'tool'), sub('Options Brief', 'memory')
    ]),
    agentNode('design', 'Designer', 'agente-design.md', g.design, 32, 24, 'design', [
      sub('Responsive Gate', 'rules'), sub('AI Slop Test', 'rules'), sub('world-class-web.md', 'workflow'), sub('Accessibility Gate', 'rules')
    ]),
    agentNode('product', 'Product', 'product-scope', g.product, 18, 42, 'product', [
      sub('venture_loop.md', 'workflow'), sub('MVP Scope', 'rules'), sub('Kill / Keep / Scale', 'rules'), sub('Product Evidence', 'memory')
    ]),
    agentNode('docs', 'Docs', 'agente-docs.md', g.docs, 22, 64, 'docs', [
      sub('README', 'tool'), sub('API Docs', 'workflow'), sub('Changelog', 'memory'), sub('Handoff', 'workflow')
    ]),
    agentNode('tests', 'QA', 'agente-tests.md', g.tests, 40, 83, 'tests', [
      sub('Playwright E2E', 'tool'), sub('Unit Tests', 'tool'), sub('Coverage', 'rules'), sub('Regression Evidence', 'memory')
    ]),
    agentNode('security', 'Security', 'agente-security-auditor.md', g.security, 63, 74, 'security', [
      sub('Secret Scan', 'tool'), sub('mcp_security.md', 'workflow'), sub('Permission Boundaries', 'rules'), sub('Repo Safety', 'workflow')
    ]),
    agentNode('growth', 'Positioning', 'positioning', g.growth, 82, 60, 'growth', [
      sub('seo_geo_growth.md', 'workflow'), sub('AEO / GEO', 'rules'), sub('Opportunity Map', 'memory'), sub('Programmatic SEO', 'workflow'), sub('SEO / Metadata', 'tool')
    ]),
    agentNode('marketing', 'Marketing', 'agente-marketing-strategist.md', g.marketing, 88, 70, 'marketing', [
      sub('marketing.md', 'workflow'), sub('GTM', 'workflow'), sub('GO / NO-GO / PIVOT', 'rules'), sub('Audience Research', 'memory')
    ]),
    agentNode('content', 'X Content', 'agente-x-content-strategist.md', g.content, 75, 85, 'content', [
      sub('x_content_system.md', 'workflow'), sub('LinkedIn', 'tool'), sub('Substack', 'tool'), sub('Authentic Voice', 'rules')
    ]),
    agentNode('reviewer', 'Review', 'code-review', g.reviewer, 46, 89, 'reviewer', [
      sub('pr_code_review.md', 'workflow'), sub('Residual Risks', 'rules'), sub('Scope Check', 'rules'), sub('Review Verdict', 'memory'), sub('Simplify System', 'workflow')
    ]),
    agentNode('release', 'Ship', 'release-check', g.release, 28, 90, 'release', [
      sub('pr_policy.md', 'workflow'), sub('Changelog', 'memory'), sub('Install Checks', 'tool'), sub('Release Checklist', 'rules')
    ]),
    systemNode('user', 'User', es ? 'Entrada externa' : 'External input', g.user, 'user', 92, 22, 'system', []),
    systemNode('rules', 'AGENTS.md', es ? 'Reglas globales' : 'Global rules', g.rules, 'rules', 41, 38, 'system', [
      sub('rules/*.md', 'rules'), sub('workflows/index.md', 'workflow'), sub('Permissions', 'rules'), sub('Chat-first', 'rules')
    ]),
    systemNode('memory', 'Memory', es ? 'Lessons / Notas / Tech Radar' : 'Lessons / Notes / Tech Radar', g.memory, 'memory', 42, 60, 'obsidian', [
      sub('Local Lessons', 'memory'), sub('Global Lessons', 'memory'), sub('promote_lesson.md', 'workflow'), sub('developer_growth.md', 'memory'), sub('Obsidian Vault Sync', 'workflow')
    ]),
    systemNode('gate', 'Validation', 'validation.md', g.gate, 'gate', 58, 58, 'gate', [
      sub('Evidence Levels', 'rules'), sub('Scope Check', 'workflow'), sub('Residual Risks', 'rules'), sub('Human Verdict', 'rules')
    ]),
    systemNode('harness', 'Harness', es ? 'Feedback loop' : 'Feedback loop', g.harness, 'harness', 50, 68, 'harness', [
      sub('feedback_loop.md', 'workflow'), sub('Capture', 'workflow'), sub('Analyze', 'workflow'), sub('Promote Proposal', 'workflow')
    ])
  ];

  linksData = [
    link('user', 'principal', 'core'), link('rules', 'principal', 'core'), link('memory', 'principal', 'core'),
    link('principal', 'architect', 'primary'), link('principal', 'design', 'primary'), link('principal', 'tests', 'primary'), link('principal', 'security', 'primary'),
    link('principal', 'docs', 'primary'), link('principal', 'growth', 'secondary'), link('principal', 'mcp', 'secondary'),
    link('principal', 'researcher', 'secondary'), link('principal', 'product', 'primary'), link('principal', 'reviewer', 'secondary'), link('principal', 'release', 'secondary'),
    link('growth', 'marketing', 'primary'), link('marketing', 'content', 'primary'), link('product', 'marketing', 'secondary'), link('product', 'design', 'primary'),
    link('docs', 'memory', 'secondary'), link('architect', 'researcher', 'primary'), link('mcp', 'security', 'primary'),
    link('tests', 'gate', 'core'), link('security', 'gate', 'core'), link('reviewer', 'gate', 'secondary'), link('release', 'gate', 'secondary'),
    link('gate', 'harness', 'core'), link('harness', 'memory', 'core')
  ];

  workflowsData = [
    workflow('feature', es ? 'Implementacion de feature' : 'Feature Implementation', false, es ? 'User -> Director -> Architect -> Design -> QA -> Security -> Validation' : 'User -> Director -> Architect -> Design -> QA -> Security -> Validation', [
      step('user', 'principal', '[Intent]', es ? 'Leyendo pedido y seleccionando el workflow mínimo útil' : 'Parsing request and selecting the smallest useful workflow'),
      step('principal', 'architect', '[Architecture]', es ? 'Definiendo profundidad técnica para la tarea' : 'Choosing technical depth for the task'),
      step('architect', 'researcher', '[Docs]', es ? 'Verificando docs actuales y alternativas' : 'Checking current docs and alternatives'),
      step('principal', 'design', '[UI]', es ? 'Refinando interacción responsive y estados visuales' : 'Refining responsive interaction and visual states'),
      step('design', 'tests', '[QA path]', es ? 'Preparando superficie de validación visible' : 'Preparing user-facing validation surface'),
      step('tests', 'security', '[Risk]', es ? 'Chequeando regresión, secretos y comportamiento riesgoso' : 'Checking regression, secrets and risky behavior'),
      step('security', 'gate', '[Evidence]', es ? 'Enviando evidencia a validation.md' : 'Sending evidence to validation.md'),
      step('gate', 'principal', '[Report]', es ? 'Reportando resultado verificado y riesgos residuales' : 'Reporting verified outcome and residual risks', '#10b981')
    ]),
    workflow('validation', es ? 'Validation Gate' : 'Validation Gate', false, es ? 'Diff / tests / build / logs / screenshot -> reporte honesto' : 'Diff / tests / build / logs / screenshot -> honest report', [
      step('principal', 'tests', '[Checks]', es ? 'Ejecutando verificación relevante para el cambio' : 'Running relevant verification for the change'),
      step('tests', 'security', '[Risk]', es ? 'Revisando regresión y riesgos del cambio' : 'Reviewing regression and change risk'),
      step('security', 'gate', '[Evidence]', es ? 'Consolidando evidencia en validation.md' : 'Consolidating evidence in validation.md'),
      step('gate', 'principal', '[Report]', es ? 'Reportando resultado y limitaciones explícitas' : 'Reporting result and explicit limitations', '#10b981')
    ]),
    workflow('learning-loop', es ? 'Harness Learning Loop' : 'Harness Learning Loop', true, es ? 'Corrección -> Harness -> Lessons -> Patrón -> promoción humana' : 'Correction -> Harness -> Lessons -> Pattern -> human promotion', [
      step('user', 'principal', '[Correction]', es ? 'La corrección del usuario se convierte en señal de aprendizaje' : 'User correction becomes a learning signal'),
      step('principal', 'harness', '[Watch]', es ? 'Harness detecta señal de routing, output, scope o calidad' : 'Harness detects routing, output, scope or quality signals'),
      step('harness', 'memory', '[Capture]', es ? 'Guardando lesson local en markdown' : 'Writing local lesson to markdown', '#a855f7'),
      step('memory', 'harness', '[Analyze]', es ? 'Buscando patrones repetidos y estado candidato' : 'Checking repeated patterns and candidate status', '#a855f7'),
      step('harness', 'principal', '[Proposal]', es ? 'Preparando propuesta promote_lesson.md si hay evidencia' : 'Preparing promote_lesson.md proposal when evidence exists'),
      step('principal', 'user', '[Human OK]', es ? 'La promoción global espera confirmación humana explícita' : 'Global promotion waits for explicit human confirmation', '#10b981')
    ]),
    workflow('review-loop', es ? 'Review Loop multiagente' : 'Multiagent Review Loop', true, es ? 'Crear -> Criticar -> Red Team -> Roadmap -> Re-evaluar' : 'Create -> Critique -> Red Team -> Roadmap -> Re-evaluate', [
      step('principal', 'architect', '[Create]', es ? 'Borrador inicial con contexto real' : 'Drafting initial solution with real context'),
      step('architect', 'reviewer', '[Critique]', es ? 'Buscando contradicciones, riesgos y falta de tests' : 'Finding contradictions, risks and missing tests'),
      step('reviewer', 'security', '[Red Team]', es ? 'Atacando modos de falla y automatización insegura' : 'Attacking failure modes and unsafe automation', '#ef4444'),
      step('security', 'reviewer', '[Simplify]', es ? 'Quitando proceso que no cambia el resultado' : 'Removing process that does not change the outcome'),
      step('reviewer', 'principal', '[Roadmap]', es ? 'Devolviendo fases ejecutables y criterios de exito' : 'Returning executable phases and success criteria'),
      step('principal', 'gate', '[Re-evaluate]', es ? 'Verificando si las criticas originales quedaron resueltas' : 'Checking whether original critiques are resolved')
    ]),
    workflow('obsidian-flow', es ? 'Obsidian Knowledge Sync' : 'Obsidian Knowledge Sync', false, es ? 'Decision -> Docs -> Obsidian Brain -> MOC / Retro / Lesson' : 'Decision -> Docs -> Obsidian Brain -> MOC / Retro / Lesson', [
      step('principal', 'docs', '[Decision]', es ? 'Capturando decisión, retro o aprendizaje técnico' : 'Capturing decision, retro or technical learning'),
      step('docs', 'memory', '[Vault]', es ? 'Eligiendo tipo de nota y ruta en Obsidian' : 'Choosing Obsidian note type and path'),
      step('memory', 'principal', '[Handoff]', es ? 'Devolviendo ruta de nota y próxima acción' : 'Returning note path and next action', '#10b981')
    ]),
    workflow('parallel-agents', es ? 'Parallel Agents' : 'Parallel Agents', true, es ? 'Director -> tareas independientes -> revisión -> integración' : 'Director -> independent tasks -> review -> integration', [
      step('principal', 'researcher', '[Research]', es ? 'Investigación independiente de opciones' : 'Independent options research'),
      step('principal', 'design', '[Design]', es ? 'Exploración visual independiente' : 'Independent visual exploration'),
      step('principal', 'security', '[Risk]', es ? 'Revisión de riesgos en paralelo' : 'Parallel risk review'),
      step('reviewer', 'principal', '[Integrate]', es ? 'Integrando conclusiones con criterio humano' : 'Integrating conclusions with human judgment', '#10b981')
    ]),
    
  ];
}

function sub(l, t) {
  return { l, t };
}

function step(f, t, lbl, act, col) {
  return { f, t, lbl, act, col };
}

function workflow(id, name, isLoop, desc, seq) {
  return { id, name, isLoop, desc, seq };
}

function link(from, to, tier = 'secondary') {
  return { from, to, tier };
}

function getNodeLayer(id) {
  const core = new Set(['principal', 'rules', 'memory', 'gate', 'harness']);
  const execution = new Set(['architect', 'design', 'product', 'docs', 'security', 'tests', 'growth']);
  if (core.has(id)) return 'core';
  if (execution.has(id)) return 'execution';
  return 'specialist';
}

function agentNode(id, name, role, desc, x, y, col, subs) {
  const roleLabels = currentLang === 'es'
    ? {
      principal: 'PLAN / EVIDENCIA',
      mcp: 'TOOLS / PERMISOS',
      architect: 'API / DATOS / RIESGO',
      researcher: 'RESEARCH / DOCS',
      growth: 'POSICIONAMIENTO',
      security: 'SEGURIDAD / AUDIT',
      tests: 'TESTING / E2E / COVERAGE',
      reviewer: 'REVISIÓN / CALIDAD',
      docs: 'DOCUMENTACIÓN TÉCNICA',
      product: 'PRODUCTO / MVP',
      design: 'UI / VISUAL / CSS',
      marketing: 'MARKETING / GTM',
      content: 'CONTENIDO / PERSONAL BRAND',
      release: 'PUBLICACIÓN'
    }
    : {
      principal: 'PLANNING / EVIDENCE',
      mcp: 'TOOLS / PERMISSIONS',
      architect: 'API / DATA / RISK',
      researcher: 'RESEARCH / DOCS',
      growth: 'POSITIONING',
      security: 'GUARDIAN / AUDIT',
      tests: 'TESTING / E2E / COVERAGE',
      reviewer: 'PR REVIEW / QUALITY',
      docs: 'TECHNICAL DOCUMENTATION',
      product: 'FOUNDER / MVP BUILDER',
      design: 'UI / VISUAL / CSS',
      marketing: 'MARKETING / GTM',
      content: 'CONTENT / PERSONAL BRAND',
      release: 'PUBLISHING'
    };
  return { id, type: 'agent', layer: getNodeLayer(id), name, role: roleLabels[id] || role, source: role, desc, x, y, col, subs };
}

function systemNode(id, name, role, desc, icon, x, y, col, subs) {
  return { id, type: 'system', layer: getNodeLayer(id), name, role, desc, icon, x, y, col, subs };
}

function buildNodes() {
  ecoGraphWrapper.innerHTML = '';
  
  nodesData.forEach(node => {
    const col = getAccent(node.col);
    const nodeEl = document.createElement('div');
    nodeEl.className = `eco-node ${node.type === 'system' ? 'system-node' : ''} ${node.layer || ''}`.trim();
    nodeEl.style.left = `${node.x}%`;
    nodeEl.style.top = `${node.y}%`;
    nodeEl.setAttribute('data-id', node.id);
    nodeEl.setAttribute('data-layer', node.layer || 'specialist');
    nodeEl.setAttribute('role', 'button');
    nodeEl.setAttribute('tabindex', '0');
    nodeEl.setAttribute('aria-label', `${node.name}: ${node.desc}`);
    nodeEl.style.setProperty('--active-color', col.c);
    nodeEl.style.setProperty('--shadow-color', col.s);
    
    let bubbleContent = '';
    if (node.type === 'agent') {
      const avatar = AGENT_AVATARS[node.id];
      const fallbackIcon = (AGENT_ICONS[node.id] || '').replace(/'/g, "\'").replace(/"/g, '&quot;');
      const inner = avatar
        ? `<img src="${avatar}" alt="" loading="lazy" decoding="async" onerror="this.parentElement.innerHTML='${fallbackIcon}'">`
        : (AGENT_ICONS[node.id] || '');
      bubbleContent = `<div class="node-bubble" style="border-color:${col.c}33;">${inner}</div>`;
    } else {
      bubbleContent = `<div class="node-bubble" style="color:${col.c}; border-color:${col.c}33;">${SYSTEM_ICONS[node.icon]}</div>`;
    }
    
    nodeEl.innerHTML = `
      ${bubbleContent}
      <div class="node-info">
        <div class="node-name">${node.name}</div>
        <div class="node-role">${node.role}</div>
        <div class="node-detail">${node.desc}</div>
      </div>
    `;
    
    const activateNode = (e) => {
      e.stopPropagation();
      if (activeWorkflow) stopWorkflow();
      if (window.matchMedia('(max-width: 768px)').matches) {
        nodesData.forEach(n => n.el && n.el.classList.toggle('mobile-open', n.id === node.id));
        return;
      }
      expandNode(node.id);
    };
    
    nodeEl.addEventListener('click', activateNode);
    nodeEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateNode(e);
      }
    });
    
    nodeEl.addEventListener('mouseenter', () => {
      if (!selectedNodeId && !activeWorkflow) {
        hoveredNodeId = node.id;
        showHUD(node);
      }
    });
    
    nodeEl.addEventListener('mouseleave', () => {
      if (!selectedNodeId && !activeWorkflow) {
        hoveredNodeId = null;
        hideHUD();
      }
    });
    
    ecoGraphWrapper.appendChild(nodeEl);
    node.el = nodeEl;
  });

  // Workflow controls are optional; the simplified public view keeps only the graph.
  if (wfList) {
    wfList.innerHTML = '';
    workflowsData.forEach(wf => {
      const wfEl = document.createElement('button');
      wfEl.type = 'button';
      wfEl.className = `wf-item ${wf.isLoop ? 'loop' : ''}`;
      wfEl.setAttribute('aria-pressed', 'false');
      wfEl.setAttribute('aria-label', `${wf.name}: ${wf.desc}`);
      wfEl.innerHTML = `
        <div>
          <div class="wf-name">${wf.name}</div>
          <div class="wf-desc">${wf.desc}</div>
        </div>
        <div class="wf-play-btn">
          <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </div>
      `;

      wfEl.addEventListener('click', (e) => {
        e.stopPropagation();
        runWorkflow(wf);
      });

      wfList.appendChild(wfEl);
      wf.uiEl = wfEl;
    });
  }
  
  // Stagger nodes entrance
  setTimeout(() => {
    nodesData.forEach((node, i) => {
      setTimeout(() => {
        if (node.el) node.el.classList.add('visible');
      }, i * 40);
    });
  }, 150);

  // Setup Ambient Particles
  ambientParticles = [];
  linksData.forEach((linkDef) => {
    const fromId = linkDef.from;
    const toId = linkDef.to;
    // 3 ambient particles per connection path
    const particleCount = linkDef.tier === 'core' ? 2 : linkDef.tier === 'primary' ? 2 : 1;
    for (let i = 0; i < particleCount; i++) {
      ambientParticles.push({
        from: fromId,
        to: toId,
        t: Math.random(),
        speed: 0.00024 + Math.random() * 0.00042,
        size: linkDef.tier === 'core' ? 1.2 : 0.9 + Math.random() * 1.1,
        alpha: linkDef.tier === 'core' ? 0.18 : linkDef.tier === 'primary' ? 0.12 + Math.random() * 0.2 : 0.06 + Math.random() * 0.1,
        tier: linkDef.tier,
        direction: Math.random() > 0.5 ? 1 : -1
      });
    }
  });
}

function resizeCanvas() {
  if (!ecoVp) return;
  const rect = ecoVp.getBoundingClientRect();
  // If the viewport is hidden (display:none), dimensions will be 0.
  // Use the CSS-defined fallback size to ensure canvas is properly sized.
  width = rect.width || ecoVp.offsetWidth || 1200;
  height = rect.height || ecoVp.offsetHeight || 720;
  if (!ecoGraphicsReady) return;
  const ratio = Math.max(1, window.devicePixelRatio || 1);
  [canvasUnder, canvasOver].forEach((canvas) => {
    if (!canvas) return;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  });
  [ctxUnder, ctxOver].forEach((ctx) => {
    if (!ctx) return;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  });
}

// ═══════════════════ COORDINATE MATH ═══════════════════

function getNodeCoords(nodeId) {
  const node = nodesData.find(n => n.id === nodeId);
  if (!node || !node.el) return { x: 0, y: 0 };

  const nodeRect = node.el.getBoundingClientRect();
  const vpRect = ecoVp.getBoundingClientRect();
  if (nodeRect.width && vpRect.width) {
    return {
      x: nodeRect.left - vpRect.left + nodeRect.width / 2,
      y: nodeRect.top - vpRect.top + nodeRect.height / 2
    };
  }

  return {
    x: (node.x / 100) * width,
    y: (node.y / 100) * height
  };
}

// Bezier Control points calculation
function getControlPoints(p1, p2, curveStrength = 0.16) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  const midX = (p1.x + p2.x) / 2;
  const midY = (p1.y + p2.y) / 2;
  
  const angle = Math.atan2(dy, dx);
  const perpAngle = angle + Math.PI / 2;
  
  const offset = distance * curveStrength;
  
  return {
    c1: {
      x: midX + Math.cos(perpAngle) * offset,
      y: midY + Math.sin(perpAngle) * offset
    },
    c2: {
      x: midX - Math.cos(perpAngle) * offset,
      y: midY - Math.sin(perpAngle) * offset
    }
  };
}

// Bezier interpolation
function bezierPoint(p0, c1, c2, p3, t) {
  const u = 1 - t;
  const uu = u * u;
  const uuu = uu * u;
  const tt = t * t;
  const ttt = tt * t;
  
  return {
    x: uuu * p0.x + 3 * uu * t * c1.x + 3 * u * tt * c2.x + ttt * p3.x,
    y: uuu * p0.y + 3 * uu * t * c1.y + 3 * u * tt * c2.y + ttt * p3.y
  };
}

// ═══════════════════ HUD RENDER ═══════════════════

function showHUD(node) {
  const col = getAccent(node.col);
  hudDot.style.color = col.c;
  hudDot.style.background = col.c;
  hudDot.style.boxShadow = `0 0 8px ${col.c}`;
  hudName.textContent = node.name;
  hudRole.textContent = node.role;
  hudRole.style.color = col.c;
  hudBody.textContent = node.desc;
  
  const sourceMeta = node.source ? `<span style="opacity:.72">${escapeHtml(node.source)}</span>` : '';
  hudMeta.innerHTML = `
    <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:${col.c}; margin-right:6px;"></span>
    ${node.layer === 'core' ? (currentLang === 'es' ? 'Núcleo' : 'Core') : node.layer === 'execution' ? (currentLang === 'es' ? 'Ejecución' : 'Execution') : (currentLang === 'es' ? 'Especialista' : 'Specialist')}
    ${sourceMeta ? ` - ${sourceMeta}` : ''}
  `;
  hudElement.classList.add('active');
}

function hideHUD() {
  hudElement.classList.remove('active');
}

// ═══════════════════ INTERACTIVE ZOOM (V7) ═══════════════════

function expandNode(nodeId) {
  selectedNodeId = nodeId;
  hoveredNodeId = null;
  
  const node = nodesData.find(n => n.id === nodeId);
  if (!node) return;
  
  // Calculate zoom transform (V7 Zoom: scale 1.8 centered on expanded node)
  const targetX = width * (0.5 - node.x / 100);
  const targetY = height * (0.5 - node.y / 100);
  
  ecoGraphWrapper.style.transform = `scale(1.8) translate(${targetX}px, ${targetY}px)`;
  
  // Update view states
  backBtn && backBtn.classList.add('active');
  statsBadge && statsBadge.classList.add('faded');
  wfpPanel && wfpPanel.classList.add('faded');
  ecoHint && ecoHint.classList.add('faded');
  
  // Stagger node updates (selected vs faded)
  nodesData.forEach(n => {
    if (!n.el) return;
    if (n.id === nodeId) {
      n.el.classList.add('selected');
      n.el.classList.remove('faded');
    } else {
      n.el.classList.add('faded');
      n.el.classList.remove('selected');
    }
  });
  
  showHUD(node);
  buildSubUniverse(node);
}

function collapseGraph() {
  selectedNodeId = null;
  hoveredNodeId = null;
  
  // Reset zoom transform
  ecoGraphWrapper.style.transform = 'scale(1) translate(0px, 0px)';
  
  backBtn && backBtn.classList.remove('active');
  statsBadge && statsBadge.classList.remove('faded');
  wfpPanel && wfpPanel.classList.remove('faded');
  ecoHint && ecoHint.classList.remove('faded');
  
  nodesData.forEach(n => {
    if (!n.el) return;
    n.el.classList.remove('selected', 'faded');
  });
  
  ecoSubUniverse.classList.remove('active');
  setTimeout(() => {
    ecoSubUniverse.innerHTML = '';
  }, 400);
  
  hideHUD();
}

function buildSubUniverse(node) {
  ecoSubUniverse.innerHTML = '';
  ecoSubUniverse.classList.add('active');
  
  const col = getAccent(node.col);
  const subRadius = Math.min(300, Math.min(width, height) * 0.36);
  const minLabelWidth = node.subs.length > 5 ? 132 : 150;
  
  node.subs.forEach((sub, i) => {
    const ring = i % 2 === 0 ? subRadius : subRadius * 0.74;
    const angle = (i / node.subs.length) * Math.PI * 2 - Math.PI / 2;
    const subX = Math.cos(angle) * ring * 1.15;
    const subY = Math.sin(angle) * ring * 0.82;
    
    const subEl = document.createElement('div');
    subEl.className = `sub-node type-${sub.t}`;
    subEl.style.setProperty('--sub-color', col.c);
    subEl.style.setProperty('--sub-shadow', col.s);
    subEl.style.minWidth = `${minLabelWidth}px`;
    
    subEl.innerHTML = `
      <div class="sub-indicator"></div>
      <div class="sub-label">${sub.l}</div>
      <div class="sub-type">${sub.t}</div>
    `;
    
    // Position sub-node relative to parent center on viewport
    subEl.style.left = `calc(50% + ${subX}px)`;
    subEl.style.top = `calc(50% + ${subY}px)`;
    
    ecoSubUniverse.appendChild(subEl);
    
    // V7 Emerge Transition: explode outward from the center
    setTimeout(() => {
      subEl.classList.add('visible');
    }, 150 + i * 50);
  });
}

// ═══════════════════ WORKFLOW EXECUTION ═══════════════════

function runWorkflow(wf) {
  stopWorkflow();
  collapseGraph();
  
  activeWorkflow = wf;
  
  // Highlight active item in the list
  workflowsData.forEach(item => {
    if (item.uiEl) {
      const isActive = item.id === wf.id;
      item.uiEl.classList.toggle('active', isActive);
      item.uiEl.setAttribute('aria-pressed', String(isActive));
    }
  });
  
  statsBadge && statsBadge.classList.add('faded');
  ecoHint && ecoHint.classList.add('faded');
  executeWorkflowStep(0);
}

function stopWorkflow() {
  activeWorkflow = null;
  if (workflowTimeout) clearTimeout(workflowTimeout);

  if (!stagePanel) {
    activeWfParticles = [];
    return;
  }
  
  stagePanel.classList.remove('active');
  activeWfParticles = [];
  
  // Clear highlighting and fades
  nodesData.forEach(node => {
    if (!node.el) return;
    node.el.classList.remove('faded');
    const bubble = node.el.querySelector('.node-bubble');
    if (!bubble) return;
    bubble.style.boxShadow = '';
    bubble.style.borderColor = '';
  });
  
  workflowsData.forEach(item => {
    if (item.uiEl) {
      item.uiEl.classList.remove('active');
      item.uiEl.setAttribute('aria-pressed', 'false');
    }
  });
  
  statsBadge && statsBadge.classList.remove('faded');
  ecoHint && ecoHint.classList.remove('faded');
}

function executeWorkflowStep(stepIndex) {
  if (!activeWorkflow) return;
  if (!stagePanel || !stageBadge || !stageText || !stageStep) {
    activeWfParticles = [];
    return;
  }

  const seq = activeWorkflow.seq;
  
  // If workflow completes
  if (stepIndex >= seq.length) {
    stageBadge.textContent = getCopy('graph.complete');
    stageBadge.style.background = '#10b981';
    stageBadge.style.boxShadow = '0 0 10px rgba(16,185,129,0.3)';
    stageText.textContent = activeWorkflow.isLoop 
      ? getCopy('graph.selfImproved')
      : getCopy('graph.validated');
    stageStep.textContent = `${getCopy('graph.ready')} ✓`;
    
    // Highlight all participating nodes at the end
    const uniqueIds = [...new Set(seq.flatMap(s => [s.f, s.t]))];
    uniqueIds.forEach(id => {
      const node = nodesData.find(n => n.id === id);
      if (node && node.el) {
        const bubble = node.el.querySelector('.node-bubble');
        if (!bubble) return;
        const col = getAccent(node.col).c;
        bubble.style.boxShadow = `0 0 25px ${col}55`;
      }
    });
    
    workflowTimeout = setTimeout(stopWorkflow, 4000);
    return;
  }
  
  const step = seq[stepIndex];
  const sourceNode = nodesData.find(n => n.id === step.f);
  const targetNode = nodesData.find(n => n.id === step.t);
  
  const stepColor = step.col || (targetNode ? getAccent(targetNode.col).c : '#ffffff');
  
  // Update floating stage controls
  stageBadge.textContent = targetNode ? targetNode.name : getCopy('graph.system');
  stageBadge.style.background = stepColor;
  stageBadge.style.boxShadow = `0 0 10px ${stepColor}33`;
  stageText.textContent = step.act;
  stageStep.textContent = `${getCopy('graph.step')} ${stepIndex + 1} / ${seq.length}`;
  stagePanel.classList.add('active');
  
  // Fade non-participants in the active step
  nodesData.forEach(node => {
    if (!node.el) return;
    if (node.id === step.f || node.id === step.t) {
      node.el.classList.remove('faded');
      if (node.id === step.t) {
        const bubble = node.el.querySelector('.node-bubble');
        if (!bubble) return;
        bubble.style.boxShadow = `0 0 30px ${stepColor}77`;
        bubble.style.borderColor = stepColor;
      }
    } else {
      // Fade if not in this active link transition
      node.el.classList.add('faded');
      const bubble = node.el.querySelector('.node-bubble');
      if (!bubble) return;
      bubble.style.boxShadow = '';
      bubble.style.borderColor = '';
    }
  });
  
  // Trigger particle burst stream between nodes
  const pStart = getNodeCoords(step.f);
  const pEnd = getNodeCoords(step.t);
  const cps = getControlPoints(pStart, pEnd, 0.24);
  
  let finishedCount = 0;
  const numParticles = 6;
  
  for (let i = 0; i < numParticles; i++) {
    activeWfParticles.push({
      fromCoords: pStart,
      toCoords: pEnd,
      c1: cps.c1,
      c2: cps.c2,
      t: 0,
      speed: 0.013 - i * 0.001,
      delay: i * 80,
      size: 4 - i * 0.25,
      color: stepColor,
      label: i === 0 ? step.lbl : null,
      done: false,
      onComplete: () => {
        finishedCount++;
        if (finishedCount === numParticles) {
          // Proceed to next step with slight pause
          workflowTimeout = setTimeout(() => {
            executeWorkflowStep(stepIndex + 1);
          }, 450);
        }
      }
    });
  }
}

// ═══════════════════ CANVAS RENDER LOOP ═══════════════════

function renderEcosystem(timestamp) {
  if (!ecoGraphicsReady || !ctxUnder || !ctxOver) return;
  // Clear buffers
  ctxUnder.clearRect(0, 0, width, height);
  ctxOver.clearRect(0, 0, width, height);
  
  const isZoomed = selectedNodeId !== null;
  
  // 1. RENDER GLOBAL CONNECTION LINES
  if (!isZoomed) {
    const focusId = selectedNodeId || hoveredNodeId;
    linksData.forEach((linkDef) => {
      const { from: fromId, to: toId, tier } = linkDef;
      const p1 = getNodeCoords(fromId);
      const p2 = getNodeCoords(toId);
      const cps = getControlPoints(p1, p2);
      
      const isHoveredLink = (focusId === fromId || focusId === toId);
      
      const fromNode = nodesData.find(n => n.id === fromId);
      const toNode = nodesData.find(n => n.id === toId);
      
      const color1 = getAccent(fromNode.col).c;
      const color2 = getAccent(toNode.col).c;
      
      const grad = ctxUnder.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
      grad.addColorStop(0, color1);
      grad.addColorStop(1, color2);
      
      ctxUnder.strokeStyle = grad;
      ctxUnder.lineWidth = isHoveredLink ? 2.2 : tier === 'core' ? 1.35 : tier === 'primary' ? 1.08 : 0.78;
      
      const baseAlpha = isHoveredLink ? 0.56 : tier === 'core' ? 0.24 : tier === 'primary' ? 0.2 : 0.14;
      const breathingPulse = Math.sin(timestamp * 0.0012 + (p1.x + p1.y) * 0.001) * (tier === 'core' ? 0.04 : 0.025);
      ctxUnder.globalAlpha = Math.max(0.04, baseAlpha + breathingPulse);
      
      // Draw bezier link curve
      ctxUnder.beginPath();
      ctxUnder.moveTo(p1.x, p1.y);
      ctxUnder.bezierCurveTo(cps.c1.x, cps.c1.y, cps.c2.x, cps.c2.y, p2.x, p2.y);
      ctxUnder.stroke();
      
      // Connection glow on hover
      if (isHoveredLink) {
        ctxUnder.lineWidth = 5;
        ctxUnder.globalAlpha = 0.08;
        ctxUnder.beginPath();
        ctxUnder.moveTo(p1.x, p1.y);
        ctxUnder.bezierCurveTo(cps.c1.x, cps.c1.y, cps.c2.x, cps.c2.y, p2.x, p2.y);
        ctxUnder.stroke();
      }
      ctxUnder.globalAlpha = 1.0;
    });
    
    // RENDER AMBIENT TRAFFIC PARTICLES
    ambientParticles.forEach(p => {
      if (p.tier === 'secondary' && !(selectedNodeId || hoveredNodeId)) return;
      const p1 = getNodeCoords(p.from);
      const p2 = getNodeCoords(p.to);
      const cps = getControlPoints(p1, p2);
      
      // Animate progress
      p.t += p.speed * p.direction;
      if (p.t > 1) p.t = 0;
      if (p.t < 0) p.t = 1;
      
      const pt = bezierPoint(p1, cps.c1, cps.c2, p2, p.t);
      const isHoverLink = ((selectedNodeId || hoveredNodeId) === p.from || (selectedNodeId || hoveredNodeId) === p.to);
      
      ctxUnder.beginPath();
      ctxUnder.arc(pt.x, pt.y, p.size, 0, Math.PI * 2);
      ctxUnder.fillStyle = isHoverLink ? '#ffffff' : getAccent(nodesData.find(n => n.id === p.from).col).c;
      ctxUnder.globalAlpha = isHoverLink ? 0.75 : p.alpha;
      ctxUnder.fill();
      ctxUnder.globalAlpha = 1.0;
    });
  }
  
  // 2. RENDER SUB-UNIVERSE INNER-LINK CURVES
  if (isZoomed) {
    const parentNode = nodesData.find(n => n.id === selectedNodeId);
    const pCoords = getNodeCoords(selectedNodeId);
    const parentColor = getAccent(parentNode.col).c;
    
    const subNodes = ecoSubUniverse.querySelectorAll('.sub-node');
    subNodes.forEach((subEl, index) => {
      const rect = subEl.getBoundingClientRect();
      const vpRect = ecoVp.getBoundingClientRect();
      
      // Calculate coordinates relative to viewport
      const subX = rect.left - vpRect.left + rect.width / 2;
      const subY = rect.top - vpRect.top + rect.height / 2;
      
      const sCoords = { x: subX, y: subY };
      const cps = getControlPoints(pCoords, sCoords, 0.1);
      
      // Draw sub-links
      ctxUnder.lineWidth = 1.8;
      ctxUnder.strokeStyle = parentColor;
      ctxUnder.globalAlpha = 0.35;
      
      ctxUnder.beginPath();
      ctxUnder.moveTo(pCoords.x, pCoords.y);
      ctxUnder.bezierCurveTo(cps.c1.x, cps.c1.y, cps.c2.x, cps.c2.y, sCoords.x, sCoords.y);
      ctxUnder.stroke();
      
      // Sub-node pulse particle stream
      const t = (timestamp * 0.0008 + index * 0.3) % 1.0;
      const pt = bezierPoint(pCoords, cps.c1, cps.c2, sCoords, t);
      
      ctxUnder.beginPath();
      ctxUnder.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
      ctxUnder.fillStyle = '#ffffff';
      ctxUnder.globalAlpha = 0.8 * (1.0 - t) * t * 4; // Fade out near targets
      ctxUnder.fill();
      ctxUnder.globalAlpha = 1.0;
    });
  }
  
  // 3. RENDER ACTIVE WORKFLOW FLOW STREAMS
  if (activeWorkflow && activeWfParticles.length) {
    for (let i = activeWfParticles.length - 1; i >= 0; i--) {
      const p = activeWfParticles[i];
      if (p.done) continue;
      
      if (p.delay > 0) {
        p.delay -= 16.6; // ~1 frame duration in ms
        continue;
      }
      
      // Draw flow line background highlight
      ctxOver.lineWidth = 2.8;
      ctxOver.strokeStyle = p.color;
      ctxOver.globalAlpha = 0.15;
      ctxOver.beginPath();
      ctxOver.moveTo(p.fromCoords.x, p.fromCoords.y);
      ctxOver.bezierCurveTo(p.c1.x, p.c1.y, p.c2.x, p.c2.y, p.toCoords.x, p.toCoords.y);
      ctxOver.stroke();
      ctxOver.globalAlpha = 1.0;
      
      // Update particle position
      p.t += p.speed;
      if (p.t >= 1.0) {
        p.done = true;
        p.onComplete();
        activeWfParticles.splice(i, 1);
        continue;
      }
      
      const pt = bezierPoint(p.fromCoords, p.c1, p.c2, p.toCoords, p.t);
      const alphaVal = Math.sin(p.t * Math.PI); // Pulse glow shape
      
      // Core glow
      ctxOver.beginPath();
      ctxOver.arc(pt.x, pt.y, p.size * 3.5, 0, Math.PI * 2);
      ctxOver.fillStyle = p.color;
      ctxOver.globalAlpha = alphaVal * 0.24;
      ctxOver.fill();
      
      // Bright core
      ctxOver.beginPath();
      ctxOver.arc(pt.x, pt.y, p.size, 0, Math.PI * 2);
      ctxOver.fillStyle = '#ffffff';
      ctxOver.globalAlpha = alphaVal * 0.95;
      ctxOver.fill();
      
      // Flow pill labels (V7 premium step markers)
      if (p.label) {
        ctxOver.font = 'bold 10px "Space Grotesk", sans-serif';
        const textWidth = ctxOver.measureText(p.label).width;
        const rectX = pt.x - textWidth / 2 - 8;
        const rectY = pt.y - 32;
        
        ctxOver.fillStyle = 'rgba(9, 9, 11, 0.9)';
        ctxOver.beginPath();
        ctxOver.roundRect(rectX, rectY, textWidth + 16, 20, 6);
        ctxOver.fill();
        
        ctxOver.strokeStyle = `${p.color}88`;
        ctxOver.lineWidth = 1.0;
        ctxOver.stroke();
        
        ctxOver.fillStyle = p.color;
        ctxOver.globalAlpha = 1.0;
        ctxOver.fillText(p.label, pt.x - textWidth / 2, pt.y - 18);
      }
      ctxOver.globalAlpha = 1.0;
    }
  }
  
  animationFrameId = requestAnimationFrame(renderEcosystem);
}

function startEcosystemLoop() {
  if (!ecoGraphicsReady) return;
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  animationFrameId = requestAnimationFrame(renderEcosystem);
}

function stopEcosystemLoop() {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  animationFrameId = null;
  stopWorkflow();
}



// ═══════════════════ SIDE QUESTS × AGENT CREW (v3) ═══════════════════
// Reviews with debate, hidden-quest unlocks, share OG image hook and
// a conversational router. The technical route stays collapsed in <details>.

const SQ_AGENTS = [
  { id: 'curador', name: 'curador', role: { es: 'Curador de catálogo', en: 'Catalog curator' }, avatar: 'project-assets/agent-avatars/content.jpg', skills: ['catalog.index', 'genre.classify', 'pair.graph'] },
  { id: 'critico', name: 'critico', role: { es: 'Crítico residente', en: 'Resident critic' }, avatar: 'project-assets/agent-avatars/reviewer.jpg', skills: ['tone.analysis', 'verdict.draft', 'spoiler.guard'] },
  { id: 'estratega', name: 'estratega', role: { es: 'Estratega de maratones', en: 'Marathon strategist' }, avatar: 'project-assets/agent-avatars/growth.jpg', skills: ['marathon.plan', 'timebox.estimate'] }
];

const SQ_WORKFLOWS = [
  { id: 'deep', label: { es: 'Análisis', en: 'Deep' }, seq: ['curador', 'critico'] },
  { id: 'match', label: { es: 'Match', en: 'Match' }, seq: ['memoria', 'critico'] },
  { id: 'marathon', label: { es: 'Maratón', en: 'Marathon' }, seq: ['curador', 'estratega'] }
];

function sqRouteLog() { return document.getElementById('sq-route-log'); }

function setupSideQuestAgents() {
  const crewEl = document.getElementById('sq-crew');
  if (!crewEl || crewEl.dataset.built) return;
  crewEl.dataset.built = 'true';

  const modesEl = document.getElementById('sq-crew-modes');
  const cardsEl = document.getElementById('sq-crew-cards');
  const lineEl = document.getElementById('sq-crew-line');
  const logEl = sqRouteLog();
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let currentQuest = 0;
  let currentWf = 'deep';
  let runSeq = 0;
  let konami = [];

  SQ_WORKFLOWS.forEach(wf => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'sq-mode'; b.dataset.wf = wf.id;
    b.textContent = sqL(wf.label);
    b.title = (currentLang === 'en' ? 'Agent route: ' : 'Ruta de agentes: ') + wf.seq.join(' → ');
    b.addEventListener('click', () => { currentWf = wf.id; syncModes(); run(currentQuest); });
    modesEl.appendChild(b);
  });

  // conversational router row
  const askRow = document.createElement('div');
  askRow.className = 'sq-ask-row';
  askRow.innerHTML = '<input type="text" id="sq-ask-input" placeholder="' + (currentLang === 'en' ? 'Tell the crew what you feel like… (e.g. \u201csomething that destroys you\u201d)' : 'Contale al crew qué te apetece… (ej. \u201calgo que te destruya\u201d)') + '" maxlength="80">' +
    '<button type="button" id="sq-ask-btn">' + (currentLang === 'en' ? 'Route' : 'Enrutar') + '</button>';
  cardsEl.parentNode.insertBefore(askRow, cardsEl);

  function syncModes() {
    modesEl.querySelectorAll('.sq-mode').forEach(b => b.classList.toggle('active', b.dataset.wf === currentWf));
  }

  function log(html) {
    if (!logEl) return;
    const d = document.createElement('div');
    d.innerHTML = html;
    logEl.appendChild(d);
    logEl.scrollTop = logEl.scrollHeight;
  }
  const esc = s => escapeHtml(s == null ? '' : String(s));

  function reviewCard(ag, quote, score, debate) {
    return '<div class="sq-review in">' +
      '<div class="rq-top"><img src="' + ag.avatar + '" alt="" loading="lazy">' +
      '<div><div class="rq-name">' + ag.name + '</div><div class="rq-role">' + esc(sqL(ag.role)) + '</div></div></div>' +
      (score ? '<span class="rq-score">' + score + '</span>' : '') +
      (debate ? '<p class="rq-debate">⚠ ' + esc(sqL(debate)) + '</p>' : '') +
      '<p class="rq-quote">' + quote + '</p></div>';
  }

  function shimmerCards(count) {
    cardsEl.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const ag = SQ_AGENTS[i % SQ_AGENTS.length];
      const d = document.createElement('div');
      d.className = 'sq-review loading';
      d.innerHTML = '<div class="rq-top"><img src="' + ag.avatar + '" alt=""><div><div class="rq-name">' + ag.name + '</div><div class="rq-role">' + esc(sqL(ag.role)) + '</div></div></div><p class="rq-quote"></p>';
      cardsEl.appendChild(d);
    }
  }

  function marathonChain(quest) {
    const chain = [quest];
    let cur = quest.title;
    for (let i = 0; i < 2; i++) {
      const intel = sqIntel(cur);
      if (!intel || !intel.pairWith || intel.pairWith === cur) break;
      const next = SIDE_QUESTS.find(q => q.title === intel.pairWith);
      if (!next || chain.includes(next)) break;
      chain.push(next); cur = next.title;
    }
    return chain;
  }

  function totalHours(chain) {
    let mins = 0;
    for (const q of chain) {
      const it = sqIntel(q.title) || { time: '' };
      const mh = it.time.match(/([\d.,]+)\s*(h|páginas|paginas)/i);
      if (!mh) continue;
      const n = parseFloat(mh[1].replace(',', '.'));
      mins += mh[2].toLowerCase().startsWith('h') ? n * 60 : n * 1.4;
    }
    return Math.round(mins / 60 * 10) / 10;
  }

  function buildReviews(wf, quest) {
    const intel = sqIntel(quest.title) || { tags: [], mood: { es: '', en: '' }, time: '—', energy: { es: '', en: '' }, pairWith: '', pairWhy: { es: '', en: '' }, signals: [], bestMoment: null, paraQuien: null, debate: null };
    const h = sqHash(quest.title + wf.id);
    const score = (7.6 + (h % 24) / 10).toFixed(1);
    const cards = [];

    if (wf.id === 'marathon') {
      const chain = marathonChain(quest);
      const names = chain.map(q => '<b>' + esc(q.title) + '</b>').join(' → ');
      cards.push(reviewCard(SQ_AGENTS[0],
        (currentLang === 'en' ? 'Chain for this quest: ' : 'Cadena para esta quest: ') + names + '. ' + esc(sqL(intel.pairWhy)), null));
      cards.push(reviewCard(SQ_AGENTS[1],
        (currentLang === 'en'
          ? 'Opening with "' + esc(quest.title) + '" is the right call: ' + sqL(quest.why).toLowerCase()
          : 'Arrancar con "' + esc(quest.title) + '" es la decisión correcta: ' + sqL(quest.why).toLowerCase()), score + '/10'));
      cards.push(reviewCard(SQ_AGENTS[2],
        (currentLang === 'en'
          ? 'Total estimate for the chain: ~' + totalHours(chain) + ' h. Best pace: one per weekend.'
          : 'Estimación total de la cadena: ~' + totalHours(chain) + ' h. Mejor ritmo: uno por finde.'), null));
    } else {
      const debate = intel.debate && h % 3 === 0 ? intel.debate : null;
      cards.push(reviewCard(SQ_AGENTS[0],
        (currentLang === 'en'
          ? 'Classified as <b>' + esc(sqL(intel.mood)) + '</b> — ' + intel.tags.join(', ') + '. Closest pair in the catalog: <b>' + esc(intel.pairWith) + '</b>.'
          : 'Clasificada como <b>' + esc(sqL(intel.mood)) + '</b> — ' + intel.tags.join(', ') + '.' + (intel.pairWith ? ' El par más cercano del catálogo: <b>' + esc(intel.pairWith) + '</b>.' : '')), null));
      cards.push(reviewCard(SQ_AGENTS[1],
        (currentLang === 'en'
          ? 'Verdict: ' + sqL(intel.mood) + '. ' + sqL(quest.why) + (debate ? ' Curador disagrees, and that is fine.' : ' Would not change a single scene.')
          : 'Veredicto: ' + sqL(intel.mood) + '. ' + sqL(quest.why) + (debate ? ' Discrepo con curador, y está bien.' : ' No cambiaría una sola escena.')) +
        (intel.bestMoment ? '<br><span class="rq-bm">' + (currentLang === 'en' ? 'best moment: ' : 'mejor momento: ') + esc(sqL(intel.bestMoment)) + '</span>' : ''), score + '/10', debate));
      cards.push(reviewCard(SQ_AGENTS[2],
        (currentLang === 'en'
          ? 'Tiempo: <b>' + esc(intel.time) + '</b> · etiquetas: ' + intel.tags.join(', ') + '. Vistas: ' + sqSeenGet().length + '/' + SIDE_QUESTS.length + '.'
          : 'Tiempo: <b>' + esc(intel.time) + '</b> · energía: ' + esc(sqL(intel.energy)) + '.' + (intel.paraQuien ? ' Para: ' + esc(sqL(intel.paraQuien)) + '.' : '') + ' Vistas: ' + sqSeenGet().length + '/' + SIDE_QUESTS.length + '.'), null));
    }
    return cards;
  }

  const sleep = ms => new Promise(r => setTimeout(r, reduceMotion ? 0 : ms));

  function crewLine(running, quest, secs) {
    if (running) {
      lineEl.innerHTML = '<span class="dot"></span>' + (currentLang === 'en'
        ? 'agents reviewing <b>' + esc(quest.title) + '</b> · route T0\u2192T3\u2026'
        : 'agentes analizando <b>' + esc(quest.title) + '</b> · ruta T0\u2192T3\u2026');
    } else {
      lineEl.innerHTML = '<span class="dot"></span>' +
        (currentLang === 'en'
          ? '3 agents reviewed this quest · route T0\u2192T3 · ' + secs.toFixed(1) + 's · ' + sqSeenGet().length + '/' + SIDE_QUESTS.length + ' completed'
          : '3 agentes revisaron esta quest · ruta T0\u2192T3 · ' + secs.toFixed(1) + 's · ' + sqSeenGet().length + '/' + SIDE_QUESTS.length + ' completadas');
    }
  }

  async function run(questIndex) {
    const seq = ++runSeq;
    const quest = SIDE_QUESTS[questIndex];
    if (!quest) return;
    const wf = SQ_WORKFLOWS.find(w => w.id === currentWf) || SQ_WORKFLOWS[0];
    const intel = sqIntel(quest.title);
    const t0 = performance.now();
    const alive = () => { if (seq !== runSeq) throw 'cancelled'; };

    crewLine(true, quest);
    if (logEl) logEl.innerHTML = '';
    shimmerCards(wf.id === 'marathon' ? 3 : 3);

    const my = () => ((performance.now() - t0) / 1000).toFixed(1);
    const step = async ms => { await sleep(ms); alive(); };

    try {
      log(my() + 's T0 route \u25b8 intent.parse("' + esc(quest.title) + '") <span class="ok">\u2713</span>');
      await step(420); alive();
      log(my() + 's T1 memoria \u25b8 signals.match(profile) \u2192 ' + (intel ? intel.signals.length : 0) + ' señales <span class="ok">\u2713</span>');
      await step(400); alive();
      for (const aid of wf.seq) {
        log(my() + 's T2 ' + aid + ' \u25b8 ' + aid + '.run("' + esc(quest.title) + '") <span class="ok">\u2713</span>');
        await step(reduceMotion ? 30 : 400); alive();
      }
      log(my() + 's T3 synthesize \u25b8 quality.gate \u2192 briefing <span class="ok">\u2713</span>');

      const secs = (performance.now() - t0) / 1000;
      crewLine(false, quest, secs);
      cardsEl.innerHTML = buildReviews(wf, quest).join('');
      const cards = cardsEl.querySelectorAll('.sq-review');
      cards.forEach((c, i) => setTimeout(() => c.classList.add('in'), reduceMotion ? 0 : 90 * i));

    } catch (e) { if (e !== 'cancelled') throw e; }
  }

  // conversational router: free text -> intent -> crew recommendation
  const SQ_INTENT_MAP = {
    'llorar': ['emocional', 'triste', 'devastador'], 'cry': ['emocional', 'triste', 'devastador'],
    'reír': ['comedia', 'sátira'], 'laugh': ['comedia', 'sátira'],
    'épico': ['épico', 'escala', 'worldbuilding'], 'epic': ['épico', 'escala', 'worldbuilding'],
    'tech': ['tech', 'startup'], 'argentino': ['argentino', 'literatura argentina', 'cómic argentino'],
    'música': ['música'], 'music': ['música'], 'disco': ['música'], 'album': ['música'],
    'libro': ['libro', 'páginas'], 'book': ['libro', 'páginas'],
    'juego': ['juego'], 'game': ['juego'],
    'corto': ['breve'], 'short': ['breve'], 'grande': ['largo aliento', 'compromiso alto', '600'],
    'serie': ['serie'], 'película': [], 'film': [], 'pelicula': [],
    'crimen': ['crimen', 'detective', 'antihero'], 'misterio': ['misterio', 'detective'],
    'destruir': ['devastador', 'psicológico', 'triste'], 'destroy': ['devastador', 'psicológico', 'triste'],
    'calma': ['baja', 'sereno'], 'calm': ['baja', 'sereno'], 'tiempo': ['tiempo', 'infinito']
  };

  function routeAsk(text) {
    const norm = text.toLowerCase();
    const wanted = new Set();
    Object.keys(SQ_INTENT_MAP).forEach(k => { if (norm.includes(k)) SQ_INTENT_MAP[k].forEach(t => wanted.add(t)); });
    let best = null, bestS = -1;
    SIDE_QUESTS.filter(q => !q.hidden || sqUnlockGet().includes(q.title)).forEach(q => {
      const intel = sqIntel(q.title) || { tags: [] };
      let s = sqMatch(q);
      intel.tags.forEach(t => { if (wanted.has(t)) s += 14; });
      if (norm.includes(q.title.toLowerCase())) s += 50;
      if (s > bestS) { bestS = s; best = q; }
    });
    return best;
  }

  const askInput = document.getElementById('sq-ask-input');
  const askBtn = document.getElementById('sq-ask-btn');
  function doAsk() {
    const q = (askInput.value || '').trim();
    if (!q) return;
    const best = routeAsk(q);
    const secs = (1 + sqHash(q) % 22 / 10).toFixed(1);
    if (!best) { sqToast(currentLang === 'en' ? 'No route found — try another feeling' : 'No encontré ruta — probá otro sentir'); return; }
    const intel = sqIntel(best.title);
    cardsEl.innerHTML = reviewCard(SQ_AGENTS[2],
      (currentLang === 'en'
        ? 'For "' + esc(q) + '" the crew routes to <b>' + esc(best.title) + '</b> — ' + esc(sqL(intel.mood)) + ', ' + esc(intel.time) + '. Signals: ' + intel.signals.join(', ') + '.'
        : 'Para "' + esc(q) + '" el crew enruta a <b>' + esc(best.title) + '</b> — ' + esc(sqL(intel.mood)) + ', ' + esc(intel.time) + '. Señales: ' + intel.signals.join(', ') + '.'), null) +
      '<button type="button" class="sq-act" id="sq-ask-go" style="margin:0 14px 6px">' + (currentLang === 'en' ? '→ open quest' : '→ abrir quest') + '</button>';
    document.getElementById('sq-ask-go').addEventListener('click', () => {
      const i = SIDE_QUESTS.indexOf(best);
      if (i >= 0) { currentQuest = i; run(i); window.SQAgentJump && window.SQAgentJump(i); }
    });
    log('ask ▸ route("' + esc(q) + '") \u2192 ' + esc(best.title) + ' <span class="ok">\u2713</span> ' + secs + 's');
  }
  askBtn.addEventListener('click', doAsk);
  askInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); doAsk(); } });


  // marathon completion unlock (El Eternauta) handled inside run()

  window.SQAgentHook = function (questIndex) {
    currentQuest = questIndex;
    if (document.getElementById('side-quests-reveal')?.classList.contains('is-visible')) run(questIndex);
  };
  window.SQAgentJump = function (questIndex) {
    const reveal = document.getElementById('side-quests-reveal');
    if (reveal?.classList.contains('is-visible') && window.SQAgentSelect) window.SQAgentSelect(questIndex);
  };

  syncModes();
}
setupSideQuestAgents();
