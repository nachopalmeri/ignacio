# Ignacio Palmeri — ignaciopalmeri.dev

Portfolio estático de Ignacio Palmeri. HTML, CSS y JavaScript, sin framework. Los tests de Playwright corren en GitHub Actions y el sitio se despliega en el proyecto de Vercel `ignacio`.

El sitio está en español rioplatense. Si el navegador no es de español, arranca en inglés. El toggle ES/EN cambia la copia y el CV que se descarga.

## Qué muestra

- Hero con los proyectos en una pared. En el celular (o con ahorro de datos) esa pared es una imagen fija, para no pagar el costo de las pantallas en movimiento.
- Experiencia actual: Zentra, desde noviembre de 2026 (IT, web y SEO/GEO, e-commerce en Tiendanube). Antes, empleado en una franquicia de Grido durante cerca de dos años.
- Proyectos con demo, repo o video. El archivo suma WordDock (`vocabulary`), Kindle Offline Kit y Cm.
- Hackathons: onCheck, el proyecto de HackaTwin (repo del equipo, demo en vivo). El equipo ganó el track Blockchain, de Avalanche, el 7 de noviembre de 2026. Beca Modular / EduTrust fue participación en LABITCONF 2026, sin premio.
- Sistema de trabajo con agentes, lab y actividad pública de GitHub (`nachopalmeri`).

## Stack

- HTML, CSS y JavaScript
- Playwright para la verificación en el browser
- Vercel, hosting estático

## Estructura

- `index.html` — contenido, metadata y JSON-LD.
- `style.css` — sistema visual.
- `app.js` — idioma, tema, proyectos, hackathons y consola.
- `tests/` — unitarios y Playwright (hero, performance, intro).
- `cv/cv.pdf` — CV en español. Se deja como está hasta que haya uno nuevo.
- `cv-en.pdf` — CV en inglés. El sitio lo enlaza cuando el idioma es EN.
- `project-assets/` — capturas y el still del hero.

## Correr en local

```bash
npm install
npx playwright install chromium
npm run verify
npm run test:e2e
```

Para mirarlo, serví la raíz con cualquier servidor estático. Los links a `/cv.pdf` y `/cv-en.pdf` son de hosting estático: `file://` no los resuelve.

## Verificación

```bash
npm run test:syntax
npm run test:unit
npm run test:e2e
npm run verify
```

`npm run verify` corre la sintaxis de `app.js` y los unitarios. `npm run test:e2e` corre el hero y el presupuesto de performance, incluida la intro interactiva (`?intro=1`).

## Decisiones

- No inventar métricas ni seniority. onCheck se marca como ganador del track Blockchain porque Ignacio lo publicó. Beca Modular se cuenta como participación, sin premio.
- onCheck es un proyecto de equipo (`joacolasca/hackatwin-fondo-cheques`). Darter sigue en el sitio como proyecto privado, sin link a un repo ni botón de compartir.
- La intro que se abre hoy es `intro/player.js` (iframe). `intro/intro.js` es la película anterior y ya no es la que carga el sitio.
- El `@import` de Google Fonts que pedía Inter y Space Grotesk no se usa. Las familias que sí se usan se cargan desde el `<head>`.
