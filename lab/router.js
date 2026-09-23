// JS port of orchestrator/router.ps1 from github.com/nachopalmeri/agents-system.
// Same precedence: risk → explicit agent → explicit parallel/council →
// specialist → SIMPLE. Besides the route it returns `trace`, the list of
// checks in the order the router made them, so the lab can animate it.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.AgentRouter = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  // Lowercase and strip diacritics, like ConvertTo-RouteText (FormD minus
  // non-spacing marks).
  function normalize(text) {
    return String(text || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC');
  }

  // PowerShell -match is case-insensitive and these patterns use \b; the text
  // is already ASCII-folded, so JS regexes behave the same.
  function firstMatch(text, patterns) {
    for (const p of patterns || []) {
      const m = new RegExp(p, 'i').exec(text);
      if (m) return { pattern: p, match: m[0] };
    }
    return null;
  }

  const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  function route(task, data) {
    const { rules, agents } = data;
    const byId = Object.fromEntries(agents.map((a) => [a.id, a]));
    const text = normalize(`${task.title || ''} ${task.body || ''} ${(task.labels || []).join(' ')}`);
    const trace = [];
    let lane = 'SIMPLE', primary = 'agente-principal', support = [], components = [], reasons = ['simple-fallback'];
    let approvalRequired = Boolean(task.requiresApproval);

    let risk = null;
    for (const rule of rules.highRisk || []) {
      const m = firstMatch(text, rule.patterns);
      if (m) { risk = { rule, m }; break; }
    }
    const riskLevelHigh = task.riskLevel === 'high';
    trace.push({ step: 'riesgo', hit: Boolean(risk || riskLevelHigh), detail: risk ? `"${risk.m.match}" → ${risk.rule.reason}` : riskLevelHigh ? 'riskLevel: high' : 'sin credenciales, pagos, producción, mensajes externos ni borrados' });

    if (risk || riskLevelHigh) {
      lane = 'HIGH_RISK';
      primary = risk ? risk.rule.primary : 'agente-security-auditor';
      components = ['.agents/workflows/validation.md'];
      reasons = [risk ? risk.rule.reason : 'risk-level-high'];
      approvalRequired = true;
    } else {
      const explicit = agents.filter((a) => new RegExp(`(?<![a-z0-9-])${escapeRe(a.id)}(?![a-z0-9-])`).test(text)).map((a) => a.id);
      trace.push({ step: 'agente explícito', hit: explicit.length > 0, detail: explicit.length ? explicit[0] : 'no nombra a ningún agente' });
      if (explicit.length) {
        primary = explicit[0];
        lane = primary === 'agente-principal' ? 'SIMPLE' : 'SPECIALIZED';
        reasons = ['explicit-agent'];
      } else {
        const council = firstMatch(text, rules.parallel.councilPatterns);
        const par = council || firstMatch(text, rules.parallel.patterns);
        trace.push({ step: 'paralelismo', hit: Boolean(par), detail: par ? `"${par.match}"${council ? ' → council' : ''}` : 'no pide agentes en paralelo' });
        if (par) {
          lane = 'PARALLEL';
          primary = /\b(?:research|investiga|documentation|documentacion|libraries|costos)\b/.test(text) ? 'agente-researcher' : 'agente-principal';
          support = primary === 'agente-researcher' ? ['agente-principal'] : ['agente-researcher'];
          components = [council ? '.agents/workflows/multiagent_review_loop.md' : '.agents/workflows/parallel_agents.md'];
          reasons = [council ? 'explicit-council' : 'explicit-parallel'];
        } else {
          const matches = [...rules.specialists].sort((a, b) => a.priority - b.priority)
            .map((rule) => ({ rule, m: firstMatch(text, rule.patterns) })).filter((x) => x.m);
          trace.push({ step: 'especialista', hit: matches.length > 0, detail: matches.length ? `"${matches[0].m.match}" → ${matches[0].rule.primary}${matches.length > 1 ? ` (+${matches.length - 1} ambiguo)` : ''}` : 'ningún dominio especial' });
          if (matches.length) {
            lane = 'SPECIALIZED';
            primary = matches[0].rule.primary;
            components = matches[0].rule.component ? [matches[0].rule.component] : [];
            reasons = [matches[0].rule.reason];
            if (matches.length > 1) reasons.push('ambiguous-specialist');
          } else {
            trace.push({ step: 'SIMPLE', hit: true, detail: 'el menor componente suficiente' });
          }
        }
      }
    }

    if (!byId[primary]) throw new Error(`Routing rule selected unknown agent: ${primary}`);
    support = support.filter((id) => byId[id] && id !== primary);
    const budget = rules.laneBudgets[lane];
    return {
      lane, primary, support, components, reasons, approvalRequired,
      capability: (rules.capabilityByAgent || {})[primary] || 'general-implementation',
      budgets: { maxIterations: budget.maxIterations, maxReplans: budget.maxReplans, maxAgents: budget.maxAgents },
      trace
    };
  }

  // Same checks as bin/run-runtime-evals.ps1 cares about for routing.
  function checkCase(c, data) {
    const r = route(c.task, data);
    const e = c.expected;
    const all = [r.primary, ...r.support.map((s) => `support:${s}`), ...r.components];
    const problems = [];
    if (r.lane !== e.lane) problems.push(`lane ${r.lane} ≠ ${e.lane}`);
    if (r.primary !== e.primary) problems.push(`primary ${r.primary} ≠ ${e.primary}`);
    if (r.budgets.maxAgents !== e.maxAgents) problems.push(`maxAgents ${r.budgets.maxAgents} ≠ ${e.maxAgents}`);
    if (r.approvalRequired !== e.approvalRequired) problems.push('approval');
    for (const req of e.requiredComponents || []) if (!all.includes(req)) problems.push(`falta ${req}`);
    for (const bad of e.forbiddenComponents || []) if (all.includes(bad)) problems.push(`sobra ${bad}`);
    return { ok: problems.length === 0, problems, route: r };
  }

  return { normalize, route, checkCase };
});
