# Plan de evolución — portfolio ignaciopalmeri.vercel.app

Documento de ejecución para el próximo agente (Claude Sonnet). No es una propuesta especulativa: cada punto está atado a código real ya presente en el repo (`index.html`, `app.js`, `style.css`). Objetivo: evolución, no rediseño. Se mantiene identidad, estructura y contenido; se sube el nivel de ejecución visual/interactiva.

Pregunta guía para cada decisión: **¿esto hace que Ignacio se vea más interesante, talentoso y memorable como developer, sin sacrificar claridad profesional?**

---

## 1. Design direction

- **"Unexpected but tasteful"**: menos ornamento, más precisión. El sitio ya tiene una base editorial correcta (tokens de layout en `style.css:9-56`, tipografía Outfit/Space Grotesk + Inter + JetBrains Mono, paleta zinc con acentos blue/green/amber). No hace falta una nueva identidad visual — hace falta **terminar** la que ya existe: consistencia de spacing, jerarquía más marcada, y que cada pieza interactiva tenga un propósito legible en 2 segundos.
- Personalidad = **developer real, no landing de AI startup**. El sitio ya evita gradientes moradas genéricos (`--accent-purple` solo se usa 5 veces en todo el CSS) — hay que mantener esa disciplina, no introducirla.
- Cada mejora debe ser evaluable en términos de: ¿un recruiter entiende más rápido quién es Ignacio? ¿un dev quiere quedarse a explorar? Si una pieza no responde ninguna de las dos, no entra.

## 2. Diagnóstico del sitio actual

### Lo que está bien (no tocar la lógica, solo pulir)
- **Sistema de tokens de layout ya editorial**: grid de 12 columnas, `--layout-section-space` con `clamp()`, medida de prosa `66ch`. Es una base sólida, poco común en portfolios genéricos.
- **Respeto real a accesibilidad**: `prefers-reduced-motion` ya está manejado en el hero 3D (`app.js:1256-1258`) y hay un bloque `@media (prefers-reduced-motion: reduce)` global (`style.css:4229`). No hay que inventar esto, hay que extenderlo a lo nuevo.
- **Sistema de easter egg ya existente y bien pensado**: consola flotante con comandos (`runTerminalCommand`, `app.js:663`) que ya dispara la apertura de la biblioteca de libros vía comando de texto (`"books"` / `"open books"`). Esto es exactamente el tipo de detalle que un dev valora — hay que **extenderlo**, no reemplazarlo por otra mecánica.
- **i18n real** (ES/EN) con `data-i18n` + diccionario en `getCopy()`. Cualquier copy nuevo tiene que pasar por ahí — es una regla dura del proyecto, no una sugerencia.
- **Proyectos con fallback de imagen ya resuelto** (`handleProjectMediaError`, `app.js:1030`), con `data-project-*` para render de error prolijo.
- **Grafo de "Sistema" (`#workflow`, `#eco-viewport`)**: es una pieza ambiciosa (2000+ líneas: nodos, curvas bezier, sub-universo, HUD, tour guiado, ruta mobile). Ya cumple el rol de "momento memorable para developers". **No se toca su lógica** — es fuera de alcance de este plan y competiría por atención con el Hero nuevo.

### Lo que está flojo (prioridad real, no estética subjetiva)
- **Hero 3D es el típico "objeto flotando porque hay Three.js"** (`setupThreeAiOpsHero`, `app.js:1125-1301`): esfera + halo + 3 anillos + partículas + nodos que rotan solos en un timer (`time * 0.00012`, ciclo automático de "nodo activo" cada 1.1s). Cero interacción real: no reacciona al mouse, no reacciona al scroll, no lleva a ningún lado al hacer click. Es decorativo puro — exactamente lo que el brief pide evitar.
- **Proyectos son estáticos**: `renderProjectPreview` (`app.js:1070`) solo pinta imagen + copy, sin ningún hover state real más allá de CSS genérico (`:hover` en `.carousel-proof`, no en la card). No hay video, no hay revelado, no hay momento "pará, esto está bueno".
- **Solo se muestran 3 de 8 proyectos** (`FEATURED_PROJECTS.slice(0, 3)`, `app.js:1100`) sin ningún mecanismo para ver los otros 5 desde la sección principal (hay un `project-archive` en el código pero no está enlazado en el `index.html` actual). Esto es una pérdida real de evidencia para recruiters que quieren ver más.
- **Jerarquía tipográfica repetitiva**: casi todo usa `--font-display` (Outfit) en tamaños similares — hay ~90 apariciones de `font-family: var(--font-display)` en `style.css`. Falta contraste de escala entre headline hero, section titles y body — todo "empuja" al mismo nivel visual.

### Oportunidades (esfuerzo bajo, impacto visual alto)
- El Hero ya tiene Three.js cargado (`index.html:275`, CDN, sin bundler) — no hace falta agregar ni sacar ninguna dependencia para mejorarlo.
- El video de demo de JobBot (`jobbot_demo_dnyx_v3_PRO.mp4`, 3.5MB) es liviano — no requiere pipeline de compresión pesado, solo recortarlo a un loop corto para el hover-preview.
- La consola flotante ya tiene la UI (input, output, botones de comando) — agregar 2-3 comandos nuevos es edición de un diccionario de copy, no una feature nueva.

## 3. Qué se mantiene

- Estructura de secciones y su orden (`hero → projects → workshop → github → about → workflow → contact`).
- Todo el contenido/copy real (bio, certificaciones, stack, proof points) salvo micro-ajustes de longitud si mejoran jerarquía.
- El grafo del Sistema (`#eco-viewport`) tal cual está, con su lógica intacta.
- La paleta de color y los tokens de `:root` — se usan, no se reemplazan.
- El sistema i18n y el patrón `data-i18n` / `getCopy()`.
- El stack técnico: vanilla JS/CSS/HTML, sin bundler, sin framework. **No se introduce build step.**
- El sistema de theme dark/light (`data-theme`) y su toggle.

## 4. Qué cambia

| Área | Cambio | Alcance |
|---|---|---|
| Hero | De orbitador decorativo a constelación interactiva con propósito | Rewrite de `setupThreeAiOpsHero`, sin nueva librería |
| Projects | De cards estáticas a lista editorial con preview de video en hover | Rewrite de `renderProjectPreview` + CSS nuevo + JS de interacción |
| Projects | Mostrar los 8 proyectos, no solo 3 | Activar/conectar el archivo ya existente en el código |
| Tipografía | Introducir más contraste de escala en headline y section titles | Ajustes puntuales de CSS, sin tocar el sistema de fuentes |
| Easter eggs | Extender la consola existente + 3 detalles nuevos pequeños | Ver sección 7 |
| Microinteracciones | Pulir hovers/transiciones existentes, agregar 4-5 puntuales | Ver sección 8 |

## 5. Hero concept — "Constelación con propósito"

**Se descarta** reemplazar el Three.js por otra tecnología (canvas 2D, WebGL shader custom, etc.) — la geometría actual (core + halo + anillos + nodos orbitando) es una base razonable. El problema no es la tecnología, es que **no significa nada y no reacciona a nadie**. Se evoluciona, no se reconstruye desde cero.

**Qué cambia concretamente** (`setupThreeAiOpsHero`, `app.js:1125`):

1. **Los nodos dejan de ser labels genéricos** y pasan a representar piezas reales del stack de Ignacio con proof real detrás (ej: "FastAPI" → JobBot, "SQL" → dashboards de franquiciados, "Playwright" → verificación del propio portfolio). Esto conecta el Hero con contenido que ya existe en `about.stack.*` y `FEATURED_PROJECTS` — cero contenido inventado.
2. **Interacción por mouse (parallax sutil)**: el `group` entero sigue al cursor con un lerp acotado (máx. ~6-8° de rotación extra), dando la sensación de que la constelación "nota" al visitante. Esto reemplaza la rotación 100% automática por una que responde, cae de vuelta a idle si no hay movimiento, y en touch/mobile queda en el ciclo automático actual (ya está resuelto el fallback de reduced-motion, se reutiliza el mismo gate).
3. **Hover en nodo = tooltip con el proof point real** (reusa el patrón de sprite/canvas-texture que ya existe en `makeTextSprite`, `app.js:1204`, pero ahora con texto de 2 líneas: herramienta + resultado concreto).
4. **Click en un nodo = scroll suave a la sección/proyecto correspondiente** (usa el mismo `data-scroll-link` que ya maneja la navegación del sitio). Esto convierte al Hero en un mapa de navegación real, no solo un adorno — es la diferencia entre "tiene Three.js" y "el Three.js hace algo".
5. **El ciclo automático de "nodo activo" se conserva** para estado idle (mobile, o desktop sin interacción reciente) — no se pierde la vida ambiental del hero cuando nadie interactúa.
6. Sin cambios de geometría/colores base (esfera, halo, anillos, partículas) — ya son sobrios y coherentes con la paleta. Se ajusta únicamente la opacidad/tamaño del nodo activo y se agrega un cursor `pointer` + `outline`/`focus-visible` accesible para quienes navegan con teclado (los nodos pasan a ser `<button>` reales superpuestos en HTML posicionados por proyección de cámara, no solo geometría 3D — necesario para accesibilidad y para que el click funcione sin raycasting complejo).

**Por qué no un shader/generative art más ambicioso**: el brief pide "rápido, elegante, usable, accesible, responsive, performant" antes que espectacular. Un shader custom (ruido, partículas GPU masivas, post-processing) agrega complejidad de mantenimiento y riesgo de performance en gama baja, para un beneficio marginal sobre "constelación interactiva y con significado". Se descarta explícitamente — ver DON'T.

## 6. Project / video interaction

**Problema a resolver**: solo existe 1 video real (JobBot demo, 3.5MB, vive fuera del repo en `Downloads`). No se puede prometer video para los 8 proyectos — el sistema tiene que degradar bien a imagen para los que no tienen.

**Ubicación del asset**: mover (copiar) el archivo a `project-assets/video/jobbot-demo.mp4`. Generar además un recorte corto (8-12s, loop, sin audio, <2MB) para el hover-preview — el archivo completo (con audio si lo tiene) se reserva para cuando el usuario hace click/expand. Si no hay herramienta de recorte de video disponible en el entorno de ejecución, usar el archivo completo con `muted loop` igual (3.5MB es aceptable con `preload="none"` y carga diferida por hover-intent), y dejarlo anotado como mejora futura (P2) recortarlo.

**Interacción (desktop, mouse)**:
1. La lista de proyectos pasa a un layout más editorial: título grande + una línea de contexto + tags, en una lista vertical (no grid de cards con imagen incrustada) — texto primero, igual que ya insinúa `project-archive` en el código existente pero sin usar.
2. Al hacer `mouseenter` sobre una fila, aparece un panel flotante (`position: fixed`, no en el flujo) con el video en loop muted, tamaño moderado (~380×240px), con transición de opacity+scale (~200ms, reusa `--transition-fast`/`--ease` ya definidos).
3. El panel sigue al cursor con un offset fijo y un lerp suave (no 1:1, para que se sienta "flotando", no "pegado") — mismo patrón de amortiguación que el parallax del Hero, para consistencia de sensación en todo el sitio.
4. Fondo: un overlay muy sutil (`background: color-mix` con `--bg` al ~40-50% opacity, sin `backdrop-filter: blur` pesado — usar opacity simple para performance) que atenúa el resto de la lista sin sacarla de foco por completo.
5. Al cambiar de fila (hover a otro proyecto), el video anterior hace fade-out y el nuevo fade-in — sin salto brusco. Si el proyecto no tiene video, el panel muestra la imagen estática existente con el mismo tratamiento (mismo componente, distinto medio — reusa `projectImage()`).
6. Al salir del área de la lista completa, el panel desaparece con la misma transición de entrada invertida.

**Touch/mobile**: no hay hover, así que no hay panel flotante. Cada fila expande inline (accordion simple) al tap, mostrando el video/imagen dentro del flujo normal del documento (sin `position: fixed`, evita bugs de viewport en iOS). Autoplay muted+loop+`playsinline` al expandir, se pausa al colapsar o al perder visibilidad (`IntersectionObserver`, patrón ya usado implícitamente en el proyecto para lazy-load de imágenes).

**Accesibilidad**: el trigger de hover tiene que ser también accesible por teclado (`:focus-visible` dispara el mismo panel que `:hover`), y el video lleva `aria-hidden="true"` + la fila mantiene el texto real como contenido accesible (el video es decorativo/complementario, no reemplaza la descripción).

## 7. Easter eggs (4, no 20)

Todos construidos **sobre la consola flotante que ya existe** (`runTerminalCommand`, `app.js:663-674`) o sobre elementos que ya están en el DOM — cero mecanismos nuevos desde cero.

1. **Comandos nuevos en la consola** (agregar 2-3 claves a `console.*` en el diccionario de copy, mismo patrón que ya soporta `books`): por ejemplo `whoami` (una línea de identidad real), `git log` (muestra 3-4 líneas estilo commit con hitos reales del portfolio/proyectos, ya existe el tono técnico para esto), y uno que sea puramente divertido pero con voz propia (no genérico tipo "sudo make me a sandwich" — algo propio de Ignacio).
2. **`console.log` de devtools con gancho real**: al cargar la página, un mensaje corto y prolijo en la consola del navegador (sin ASCII art gigante) que invita a probar la consola flotante del sitio (`"Si llegaste hasta acá, probá el comando 'whoami' abajo a la derecha."`) — conecta el easter egg "para devs que abren devtools" con el que ya existe en la UI, en vez de duplicar mecánica.
3. **Firma oculta en el Hero**: click (o long-press en touch) sobre la esfera central del nuevo Hero interactivo revela por 2-3s una línea de firma cerca del cursor (ej. commit hash corto + "hecho a mano, iterado con IA" — coherente con el mensaje real del portfolio sobre método de trabajo). Reusa la infraestructura de tooltip ya construida para los nodos del Hero (punto 5).
4. **Detalle en el footer**: hover sobre el año/copyright del footer (`app-footer`, `index.html:263`) muestra un tooltip breve estilo `git blame` con un mensaje corto y real (no lorem ipsum, algo que sume una micro-anécdota o dato verídico del proyecto).

Todos son **descubribles pero no invasivos**: ninguno se dispara solo, todos requieren una acción deliberada del visitante (hover, click, abrir devtools, escribir un comando).

## 8. Microinteracciones

- **Transiciones de hover en proyectos y nodos del Hero** ya cubiertas en 5 y 6.
- **Botones primarios/secundarios** (`.btn-primary`, `.btn-secondary`): ya tienen `:hover`, agregar un `:active` con scale sutil (~0.98) para feedback táctil de click — falta hoy.
- **Scroll-reveal muy sutil** en headers de sección (`.eyebrow` + `.section-title`): fade+translateY(8px) al entrar en viewport, una sola vez, `IntersectionObserver` liviano, respeta `prefers-reduced-motion`. No aplicar a texto largo (bio, párrafos) — solo a headers, para no entorpecer lectura.
- **Menu/nav**: los links de `.desktop-nav` ya tienen estados — agregar un underline animado (`transform: scaleX`) en vez de solo cambio de color, coherente con el tono "editorial".
- **Toggle de tema**: si no tiene ya una transición de color suave al cambiar `data-theme`, agregar `transition: background-color, color` acotada a variables de color en `:root` (cuidado con no animar TODO el árbol, por performance — acotar a `body`, `.app-header`, cards principales).

## 9. Responsive behavior

- Hero: el parallax por mouse se desactiva completamente por debajo de 900px (ya existe ese breakpoint en `resize()`, `app.js:1251`) — en mobile el ciclo automático de nodos es el único comportamiento, como ya sucede hoy.
- Projects: el panel flotante de video **no existe** en touch — se reemplaza por expansión inline (sección 6). Confirmar breakpoint con el existente `@media (max-width: 768px)` (`style.css:3981`).
- Verificar que los 8 proyectos completos (si se activa el archivo) no rompan el layout en mobile — usar el mismo patrón de fila que ya existe en `.archive-row` (`app.js:1106-1116`), que ya está pensado como lista, no grid.
- Nada de esto requiere nuevos breakpoints — reusar los tres que ya existen (`420px`, `768px`, `992px`).

## 10. Accessibility

- Hero: nodos interactivos son elementos DOM reales (`<button>`) posicionados sobre el canvas vía proyección de cámara a coordenadas de pantalla, no solo geometría WebGL — necesario para foco de teclado, lectores de pantalla y `aria-label` con el proof point real.
- Todo lo nuevo respeta `prefers-reduced-motion`: parallax del Hero, panel flotante de proyectos (cae a expansión estática sin animación de seguimiento de cursor), scroll-reveal.
- Video de proyecto: `muted`, sin autoplay de sonido nunca, `aria-hidden="true"` en el `<video>` en el modo hover-preview (la información real vive en el texto de la fila).
- Mantener contraste AA en cualquier texto nuevo sobre el overlay de proyectos (verificar sobre `--bg` oscuro y el tema claro).
- Comandos de consola: seguir devolviendo error legible ante comando desconocido (ya lo hace, `app.js:673`) — no romper ese contrato con los comandos nuevos.

## 11. Performance considerations

- **No agregar dependencias nuevas.** Three.js ya está cargado por CDN; no hace falta librería de animación (GSAP, Framer Motion) — todo lo descrito (lerp de parallax, fade de panel, scroll-reveal) se resuelve con CSS transitions + `requestAnimationFrame` puntual, patrón que el proyecto ya usa en el Hero y el grafo del Sistema.
- Video: `preload="none"` por defecto, el `src` real se asigna recién al primer hover-intent (no en el render inicial) para no descargar 3.5MB (u 8 si hay más proyectos) sin necesidad. Pausar y limpiar el `<video>` al salir de hover para no dejar múltiples decodificadores activos.
- Overlay de proyectos: opacity simple, **no** `backdrop-filter: blur()` (costoso en repaint, especialmente en listas largas) — decisión explícita, no omisión.
- Hero: el parallax por mouse debe estar throttleado al frame (`requestAnimationFrame`), nunca recalcular en cada evento `mousemove` crudo.
- Confirmar que `npm run verify` (`test:syntax` + `test:unit` + `test:e2e`) sigue pasando después de cada cambio — es el único gate de calidad automatizado que tiene el proyecto hoy.

## 12. Orden de implementación exacto

1. **Setup de assets**: copiar el video de JobBot a `project-assets/video/jobbot-demo.mp4` (y el recorte corto si es viable generarlo). Confirmar que Vercel sirve `project-assets/` como estático (ya lo hace para las imágenes).
2. **Activar los 8 proyectos**: conectar `project-archive` (ya existe en `app.js`) al `index.html`, con el layout de fila editorial. Esto es la base sobre la que se monta el hover de video.
3. **Interacción de video en proyectos** (sección 6): JS del panel flotante + fallback touch + CSS. Empezar solo con JobBot teniendo video real; el resto usa imagen con el mismo componente.
4. **Rewrite del Hero** (sección 5): nodos reales con proof points, parallax, tooltip, click-to-scroll, accesibilidad con `<button>` proyectados.
5. **Easter eggs** (sección 7): comandos de consola nuevos, `console.log` de devtools, firma del Hero, tooltip del footer.
6. **Microinteracciones** (sección 8): pasada final de pulido sobre botones, nav, scroll-reveal, toggle de tema.
7. **Pasada de responsive + accesibilidad** end-to-end en los tres breakpoints existentes, dark y light theme.
8. **`npm run verify`** + revisión manual en navegador (mouse y touch/DevTools mobile emulation) antes de dar por cerrado.

No paralelizar el paso 3 y 4 — son las dos piezas de mayor riesgo visual, mejor una completa y validada antes de la siguiente.

## 13. Files/components likely to change

- `app.js`: `setupThreeAiOpsHero`, `setupAiOpsHero`, `renderProjectPreview`, `renderProjectCarousel`, `setupProjectCarousel`, `runTerminalCommand` (agregar claves), copy dictionaries (ES/EN) para nuevo texto de proof points y easter eggs.
- `index.html`: sección `#projects` (nuevo layout de lista + panel flotante placeholder), footer (hook de easter egg), posible ajuste de `#hero-title`/estructura si los nodos pasan a ser DOM real superpuesto.
- `style.css`: nuevo bloque para `.project-row` / panel flotante de video, ajustes de escala tipográfica en hero/section titles, estados `:active` de botones, underline animado de nav, transición de tema.
- `project-assets/video/`: carpeta nueva para el/los video(s).
- No se toca: `api/github-profile.js`, el grafo `#eco-viewport` y su lógica (`buildNodes`, `renderEcosystem`, etc.), `scripts/dev-server.cjs`, tests existentes salvo que haya que actualizar selectores de e2e si cambian IDs/clases de proyectos.

## 14. Dependencies to add

Ninguna. Three.js ya está. Todo lo propuesto es CSS + JS vanilla con las APIs del navegador (`IntersectionObserver`, `requestAnimationFrame`, CSS transitions).

## 15. Dependencies NOT worth adding

- **GSAP / Framer Motion / anime.js**: el volumen de animación propuesto no lo justifica; CSS transitions + un puñado de `requestAnimationFrame` cubren todo el plan.
- **Lenis / smooth-scroll libraries**: el sitio ya usa `data-scroll-link` con scroll nativo — no hay problema que resolver ahí.
- **Video.js / Plyr**: son 1-2 videos con controles mínimos (loop, muted, play en click) — un `<video>` nativo alcanza.
- **React/Vue/cualquier framework**: fuera de discusión, rompería la arquitectura actual sin ningún beneficio para el alcance de este plan.
- **Compresores de video vía npm (ffmpeg.wasm, etc.)**: el archivo ya es liviano (3.5MB); si hace falta recortar, hacerlo una vez con una herramienta externa al repo, no como dependencia del proyecto.

## 16. Definition of done

- Hero: los nodos son interactivos (hover = tooltip con proof real, click = navega), reaccionan al cursor con parallax acotado, degradan a ciclo automático en mobile/reduced-motion, y son accesibles por teclado.
- Projects: los 8 proyectos son visibles; al menos JobBot tiene preview de video en hover (desktop) y expansión táctil (mobile); el resto degrada a imagen sin errores visuales.
- 4 easter eggs implementados, ninguno invasivo ni auto-disparado.
- Ningún cambio rompe el sistema i18n (ES/EN) ni el theme toggle (dark/light).
- `npm run verify` pasa.
- Verificación manual en al menos un viewport mobile y uno desktop, ambos temas, con `prefers-reduced-motion` activado y desactivado.
- Nada de lo existente en `#workflow`/`#eco-viewport` cambió de comportamiento.
- No se agregó ninguna dependencia nueva a `package.json`.

## 17. Checklist priorizado para Sonnet

**P0 — must have**
- [ ] Activar los 8 proyectos en la sección principal (layout de lista editorial).
- [ ] Interacción de video en hover para JobBot + fallback de imagen para el resto (desktop + touch).
- [ ] Hero: nodos con proof real, click-to-scroll, parallax de cursor, accesibilidad por teclado.
- [ ] Verificar que `npm run verify` sigue pasando.

**P1 — high impact**
- [ ] 4 easter eggs (sección 7).
- [ ] Contraste de escala tipográfica en hero/section titles.
- [ ] Microinteracciones de botones/nav/tema (sección 8).

**P2 — nice to have (solo si sobra tiempo/tokens)**
- [ ] Recorte del video de JobBot a loop corto (<2MB) para el hover-preview, separado del archivo completo.
- [ ] Scroll-reveal en headers de sección.
- [ ] Video adicional para un segundo proyecto, si el usuario provee el archivo.

**DON'T**
- No reemplazar el Hero por un shader/generative art custom — complejidad alta, beneficio marginal sobre la constelación interactiva propuesta.
- No usar `backdrop-filter: blur()` pesado en el overlay de proyectos.
- No agregar ninguna librería de animación o de video.
- No tocar la lógica del grafo `#eco-viewport`.
- No fabricar videos o proyectos que no existen — degradar a imagen es la respuesta correcta, no simular contenido.
- No introducir un build step (bundler, framework) al proyecto.
- No cambiar el orden de secciones ni el copy salvo lo estrictamente necesario para los proof points del Hero (que además ya existen en el contenido de `about.stack.*`).
