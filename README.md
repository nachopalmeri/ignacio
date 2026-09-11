# ignacio portfolio (anonymous / Twitter version)

Static portfolio for `ignacio`, built with vanilla HTML, CSS, JavaScript, and Playwright verification. Anonymized fork of the main portfolio: no photo, no CV download, no full name in on-page text.

The site is optimized for one outcome: helping an AI startup founder or recruiter understand both potential and evidence quickly.

## What the site shows

- A direct hero focused on software systems that remove repetitive work.
- A hybrid portfolio structure with navigation, portrait/status signal, project proof, stack, GitHub activity, workflow system, and contact.
- Four featured project cards: JobBot, Agents System, Sports Predictive Analytics Engine, and Pisculichi Labs.
- A project archive that frames 9 projects by problem, role, proof, stack, and deployment/review status.
- The V7 agent ecosystem graph with portraits, canvas connection lines, HUD, workflow controls, and animated route playback.
- An AI-assisted workflow section that shows documented agent routes instead of generic AI claims.
- Honest junior positioning: no invented metrics, no fake seniority, and explicit limitations.

## Stack

- HTML
- CSS
- Vanilla JavaScript
- Playwright for browser verification
- Vercel static hosting

## Structure

- `index.html` - page content, SEO metadata, and evidence sections.
- `style.css` - visual system, responsive layout, and motion.
- `app.js` - theme toggle, language toggle, safe localStorage handling, link hardening, and reveal behavior.
- `tests/portfolio.e2e.mjs` - desktop, mobile, language, theme, asset, CV, and legacy-regression checks.
- `cv/` - downloadable CV PDFs.
- `project-assets/` - screenshots and visuals used by the portfolio.

## Run locally

```bash
npm install
npx playwright install chromium
npm run verify
```

For manual preview, serve the repository root with any static server. Avoid `file://` because root-relative CV links are meant for static hosting.

## Verification

```bash
npm run test:syntax
npm run test:e2e
npm run verify
```

The E2E suite checks:

- hero copy and core sections render
- hybrid navigation, portrait/status, projects, stack, GitHub activity, and V7 agent ecosystem render
- documented workflow controls activate the graph stage and visible route animation
- 4 featured projects and their screenshots exist on desktop
- 9 archive projects render on the projects tab
- project screenshots are served locally
- agent graph has visible nodes, workflow launcher, stage, stats, and no mobile overflow
- language and theme controls work
- mobile has no horizontal overflow
- CV, README, favicon, and path traversal behavior are valid
- localStorage-blocked mode still works

## Decisions

- Keep the implementation simple and inspectable.
- Prefer proof and tradeoffs over broad claims.
- Present the AI workflow as a review system, not as a fake product.
- Keep English as default for remote/startup recruiting while preserving Spanish copy.
