# Plan de mejora — Side Quests (easter egg)

> Documento generado por el crew completo del sistema `.agents`.
> Cada agente aporta su análisis con las skills que usó. El router-core
> orquesta y prioriza. Estado base: spotlight cinematográfico + crew de
> reseñas + intel por quest + ruta técnica colapsada (deploy `fcbc7b9`).

---

## T0 · router-core — orquestación y prioridad

**Skills usadas:** `intent.parse` · `context.load` · `plan.decompose` · `impact.matrix`

**Diagnóstico:** la sección ya cumple su rol de "sala de crítica", pero hoy es
**de solo lectura y de un solo uso**: un visitante la abre, la recorre 40
segundos y nunca vuelve. El mayor upside no es más políishing visual — es
convertirla en un **sistema vivo**: quests que crecen, un perfil que se
enriquece con cada visita, y secretos que recompensan la curiosidad (que es
la definición de un easter egg).

**Priorización (impacto × esfuerzo):**

| # | Propuesta | Agente dueño | Impacto | Esfuerzo | Fase |
|---|---|---|---|---|---|
| 1 | Debate entre agentes (desacuerdos reales) | critico + curador | alto | bajo | 1 |
| 2 | Pósters degradados → arte normalizado | design | alto | bajo | 1 |
| 3 | Perfil de gusto persistente (taste-graph) | memoria | alto | medio | 2 |
| 4 | Quests ocultas + konami code | product | alto | medio | 2 |
| 5 | Colecciones temáticas | curador | medio | medio | 2 |
| 6 | Streak y progreso del visitante | estratega | medio | medio | 2 |
| 7 | Compartir quest (OG image dinámica) | release | medio | medio | 3 |
| 8 | Catálogo 10 → 25+ quests (juegos, música, lugares) | curador | alto | medio | 3 |
| 9 | Sonido ambiental por quest (opt-in) | design | medio | medio | 3 |
| 10 | Modo "hablá con el crew" (input libre → routing) | mcp | muy alto | alto | 4 |
| 11 | Quests que se desbloquean con hitos reales de GitHub | memoria + mcp | alto | alto | 4 |

---

## T1 · memoria — perfil de gusto y "para vos"

**Skills:** `memory.recall` · `signals.match` · `taste.graph`

Hoy las señales del perfil están hardcodeadas en `SQ_INTEL`. Propuesta:

- **Taste-graph en localStorage**: cada interacción suma peso —
  `quest.vista`, `quest.expandida`, `reel.visto`, `tag.click`. Estructura:
  `localStorage.sq_taste = { tags: {romance: 0.4, épico: 1.2, ...}, questsVistas: [], ultimaVisita }`.
- El **match %** de la reseña de `estratega` deja de ser determinístico por
  hash y pasa a calcularse contra el taste-graph real.
- Sección **"Para vos"** al abrir el modal: el quest con mayor match del
  catálogo, con la línea "por tu historial: diálogo, oficio clásico".
- **Export/import** del perfil (copy JSON al clipboard) — portabilidad entre
  dispositivos, y sirve de easter egg meta: tu perfil es un artefacto.

**Skill nueva:** `taste.graph.build` — construye/normaliza el grafo desde
eventos. Guard: si el grafo tiene < 3 señales, degradar a orden editorial.

---

## T2 · curador — catálogo, colecciones y arte

**Skills:** `catalog.index` · `genre.classify` · `pair.graph` · `art.direction`

**Catálogo:** pasar de 10 a 25+ quests manteniendo el formato
`SIDE_QUESTS` (el sistema es data-driven: agregar = sumar entradas).
Categorías nuevas sugeridas: **juegos** (Outer Wilds, Hades, Disco Elysium),
**música** (álbumes como quests: escuchar de corrido), **podcasts**,
**lugares** (una esquina de Buenos Aires al atardecer como quest).

**Colecciones temáticas:** agrupar quests con `collection: 'noches-argentinas'`
— el modal filtra por colección y el maratón respeta la colección activa.
Chips de colección arriba del filmstrip.

**Arte (fix urgente):** los pósters `silicon-valley-title.png` (logo sobre
negro) y `sopranos-logo.svg` rompen la grilla visual. Normalizar: todos
2:3, mínimo 600×900, `object-fit: cover` ya aplicado. Reemplazar los tres
pósters flojos por arte oficial o fan-art con crédito.

---

## T2 · critico — debate y veredictos con carácter

**Skills:** `verdict.draft` · `tone.analysis` · `spoiler.guard`

- **Debate entre agentes**: con probabilidad por quest (determinística por
  hash), `critico` **discrepa** de `curador` — "curador la catologó como
  reconfortante; yo la encuentro devastadora". El desacuerdo es lo más
  humano que se puede simular y es lo que la gente va a screenshotear.
- **Veredicto estructurado**: score + `mejorMomento` + `aQuien` ("para quien
  mira Goku y llora con Pixar") + garantía **spoiler-free** (`spoiler.guard`
  valida que el texto no contenga nombres de giros).
- Los scores dejan de ser decorativos: se ordenan entre sí y el quest con
  mayor score del catálogo lleva chip "top del crew".

---

## T2 · estratega — maratones con checkpoints

**Skills:** `marathon.plan` · `timebox.estimate` · `streak.track`

- Maratón v2: cadenas con **checkpoints contextuales** — "fin de semana
  largo", "tren a La Plata (ida y vuelta)", "domingo lluvioso" — cada
  checkpoint filtra por tiempo/energía real.
- **Streak del visitante**: localStorage cuenta quests completadas (marcadas
  con un botón "ya la vi"); a las 3, chip de racha; a las 10, el quest
  secreto se desbloquea (ver product).
- Input "tengo X minutos" → filtro de duración con `timebox.estimate`.

---

## T2 · design — art direction y presencia

**Skills:** `motion.design` · `ambient.sound` · `art.direction`

- **Sala oscura**: el glow del póster (ya existe por accent color) se
  proyecta también al fondo del modal completo — el modal "respira" el color
  de la quest activa.
- Transición entre quests: crossfade del póster + slide vertical del texto
  (hoy es un fade simple).
- **Sonido ambiental opt-in** por quest: un icono de sonido en el póster que
  reproduce un loop corto (música de la peli/tema del libro). Muted by
  default, sin autoplay.
- Micro-interacciones: tilt 3D sutil del póster según posición del mouse
  (máx 2°), filmstrip con scroll-snap.

---

## T2 · product — el verdadero easter egg

**Skills:** `spec.author` · `scope.cut` · `secret.design`

- **Quests ocultas**: 3 quests que no aparecen en el filmstrip. Se
  desbloquean: (a) konami code en el modal, (b) 3 clicks seguidos en la
  viborita del calendario, (c) completar un maratón. Cada una con su propia
  revelación ("encontraste el archivo perdido").
- **Compartir**: botón que genera una **OG image dinámica por quest**
  (canvas: póster + veredicto del critico + score + firma del crew) →
  descarga PNG lista para compartir. Sin backend: 100% canvas local.
- CTA final del modal: "¿Tu quest favorita no está? · [Abrir issue]" —
  convierte el easter egg en canal de feedback.

---

## T2 · mcp — integraciones

**Skills:** `api.github` (ya existe en el sitio) · `context.bridge`

- **Quests por hitos reales**: la API de contribuciones ya está servida por
  `/api/github-contributions` — cuando el usuario llega a X contribuciones en
  el año, se desbloquea una quest "hitos". El portfolio celebra el trabajo
  real, no solo el simulado.
- **Modo conversación (fase 4)**: input libre "quiero llorar un domingo" →
  el router parsea intención (`intent.parse`), el crew responde con una
  recomendación firmada. Misma infraestructura del crew actual, input
  libre delante.

---

## T3 · tests · docs · release — calidad y entrega

- **tests** (`visual.regression`): screenshots por estado del modal (abrir,
  cambiar quest, cambiar workflow, maratón) — ya existe la base en
  `scripts/screenshots.mjs`.
- **docs** (`readme.handoff`): este documento + README del easter egg con el
  mapa de quests ocultas (encriptado, obviamente).
- **release** (`flag.rollout`): cada fase detrás de un flag en localStorage
  (`sq_flags`) — el crew decide qué ve cada visitante sin redeploys.

---

## Roadmap ejecutivo

- **Fase 1 — character (1 sesión):** debate entre agentes · scores con
  mejorMomento/aQuien · reemplazo de pósters flojos · chips de colección.
- **Fase 2 — sistema vivo (una tarde):** taste-graph en localStorage ·
  "Para vos" · streaks y botón "ya la vi" · quests ocultas (konami + viborita
  ×3 + maratón completado).
- **Fase 3 — fuera del modal (proyecto):** OG sharing por canvas · sonido
  ambiental opt-in · catálogo 25+ · quests por hitos de GitHub.
- **Fase 4 — moonshot:** modo conversación con el crew · el portfolio entero
  como sistema navegable de agentes.

**Métrica de éxito:** tiempo dentro del modal por visita (hoy ~40s →
objetivo >2min), quests exploradas por visita (1 → 3+), y % de visitantes
que descubren al menos un secreto.

---

*Crew firmante: router-core · memoria · curador · critico · estratega ·
design · product · mcp · tests · docs · release · principal.*
