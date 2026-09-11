# AI Ops Command Center Portfolio Redesign

> Status: superseded by the recruiter-evidence iteration. The live implementation now uses a static featured-project grid, a JobBot case study, an 8-project archive, and a local workflow-system graph. Historical mentions of FranquiYA, Agents System as a featured project, and an interactive carousel describe an earlier design direction, not the current acceptance criteria.

## Objective
Redesign Ignacio Palmeri's portfolio into a memorable AI-first builder portfolio that feels like a live command center, not a generic landing page. The experience must prove autonomy, process thinking, agent orchestration, and production-oriented automation.

## Approved Direction
Use the **AI Ops Command Center** concept:

- First viewport as a full-screen control room.
- Animated 3D/canvas AI core with orbiting agent/project nodes and moving data streams.
- Console integrated into the system instead of isolated as a decorative card.
- Project section as a premium carousel focused on JobBot, FranquiYA, and Agents System.
- Agents ecosystem preserved and visually connected to the overview.

## Content Requirements
- Keep the positioning: `AI-First Automation Builder & Process Analyst`.
- Preserve verified content only.
- Fix JobBot asset so it does not show the PISKU CLI image:
  - preferred asset: `project-assets/job-bot.png`;
  - fallback if the image fails: a generated CSS terminal/automation panel labeled `JobBot`, never `project-assets/pisku-cli.png`.
- Certifications:
  - Red Hat links to Credly.
  - Claude Code links to Skilljar.
  - Cisco remains visible without invented link if no direct certificate URL is available.
  - Python Automation is removed.
- Projects:
  - JobBot: asynchronous automation SaaS, Next.js dashboard, FastAPI/PostgreSQL backend, httpOnly cookies, HMAC webhooks, Stripe/MercadoPago.
  - FranquiYA: operations, stock, invoices, shifts, audits, inventory/cash-flow.
  - Agents System: multi-IDE orchestration infrastructure, Claude Code/Windsurf/Zed, PowerShell/Bash, symlinks, portable prompts/context.

## Visual Architecture
### Hero
The hero should become an immersive scene:

- Full-bleed animated canvas scene implemented locally in `app.js`.
- Do not add Three.js unless the canvas implementation cannot achieve a nonblank moving scene.
- Central AI core with moving rings, particles, and agent-node links.
- Visible proof of multi-agent usage in the hero: at least five labeled nodes around the AI core (`Planner`, `Builder`, `Reviewer`, `Security`, `Docs`) with animated data streams and a small "workflow pulse" state that cycles between them.
- Text content overlays/anchors cleanly at left.
- Console and profile/photo become docked command surfaces, not regular cards.
- Motion should be purposeful and pause/respect reduced motion.
- Canvas failure fallback: show a static CSS command-center map with the same five labeled nodes and project chips.
- `prefers-reduced-motion`: disable particle animation, keep a static core, and keep all content visible.

### Projects Carousel
Replace static grid/showcase with an interactive carousel:

- One featured project in focus with large media.
- Adjacent projects partially visible.
- Keyboard buttons, touch/drag support, and accessible labels.
- Project metadata: role, stack, system value, proof link.
- No layout shift on hover.
- Concrete carousel slides:
  - JobBot:
    - media: `project-assets/job-bot.png`;
    - proof link: `https://github.com/nachopalmeri/jobbot`;
    - role: `Automation SaaS / AI-first implementation`;
    - stack: `Next.js`, `FastAPI`, `PostgreSQL`, `HMAC`, `Stripe/MercadoPago`;
    - system value: asynchronous job-search automation with production security patterns.
  - FranquiYA:
    - media: `project-assets/dashboard-franquiciados.PNG`;
    - proof link: `https://github.com/nachopalmeri/FranquiYA`;
    - role: `Operations dashboard / process control`;
    - stack: `TypeScript`, `Dashboard`, `Inventory`, `Cash Flow`, `Audits`;
    - system value: operational control for stock, invoices, shifts, employees, audits, and cash visibility.
  - Agents System:
    - media: `project-assets/portfolio-v1.png`;
    - proof link: `#/agents`;
    - role: `Multi-IDE orchestration infrastructure`;
    - stack: `Claude Code`, `Windsurf`, `Zed`, `PowerShell`, `Bash`, `Symlinks`;
    - system value: portable prompts, shared context, rules, validation, and local automation across AI development environments.

### GitHub Activity
Keep the GitHub activity block but make it feel integrated with the command center:

- It should read like live telemetry.
- Avoid generic metric cards.
- Keep external public GitHub SVG cards if they render reliably.

### Agents Tab
Keep current graph concept, but connect the overview visually to it:

- Reuse the same node/data-stream language.
- Preserve desktop graph functionality.
- Preserve mobile inline details.
- Add/keep an overview proof strip near the hero or carousel showing the orchestration chain:
  `Intent -> Planner -> Builder -> Reviewer -> Security -> Docs -> Memory`.
- The proof strip must mention command/context sync across Claude Code, Windsurf, and Zed.

## Technical Plan Boundaries
- Keep vanilla HTML/CSS/JS. No build tooling unless unavoidable.
- Prefer canvas for hero if Three.js would add too much CDN/runtime fragility.
- If using CDN dependencies, verify offline/failure degradation.
- Keep edits scoped to `index.html`, `style.css`, `app.js`, and assets.

## Accessibility And Performance
- Text must not overlap on mobile or desktop.
- Carousel controls must be buttons with labels and keyboard support.
- Canvas must not block content or interaction.
- Respect `prefers-reduced-motion`.
- Maintain no horizontal overflow on mobile.
- Verify light/dark mode contrast.
- Hero canvas performance:
  - cap particle count to a small fixed budget, target <= 90 particles desktop and <= 36 mobile;
  - pause animation when overview is not visible or document is hidden;
  - use `requestAnimationFrame`, not timers;
  - scale for `devicePixelRatio` but cap DPR at 2;
  - all project images use stable dimensions and lazy loading outside first viewport.
- No required external runtime dependency for the hero animation.

## Verification
- `node --check app.js`.
- Browser desktop:
  - hero animated scene visible/nonblank;
  - JobBot uses correct asset;
  - project carousel works with buttons and keyboard;
  - no old static project grid dominance.
- Browser mobile:
  - no horizontal overflow;
  - hero remains legible;
  - carousel usable;
  - agents remain accessible.
- Content:
  - no `Python Automation`;
  - no old `Backend Developer` positioning;
  - no `FulboTracker`/`PISKU CLI` in featured projects;
  - no invented certification links.
