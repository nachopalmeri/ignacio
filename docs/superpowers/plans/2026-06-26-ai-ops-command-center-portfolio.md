# AI Ops Command Center Portfolio Implementation Plan

> Status: superseded by the recruiter-evidence iteration. This plan is kept as design history. The current implementation intentionally favors JobBot as the case study, Motor Estadistico Predictivo and Pisculichi Labs as featured projects, all 8 projects in the archive, and a static accessible grid instead of the earlier carousel/deck concept.

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an immersive AI Ops Command Center portfolio with animated hero, project carousel, multi-agent proof, and correct JobBot media.

**Architecture:** Keep the vanilla HTML/CSS/JS app. Add a local canvas animation controller for the hero, a small carousel controller for projects, and semantic HTML sections that degrade to static content when motion/canvas is unavailable.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Canvas 2D, existing static assets.

---

## File Structure

- Modify `index.html`: replace overview hero/showcase/project grid markup with command-center hero, multi-agent proof strip, and carousel structure.
- Modify `style.css`: add command-center layout, canvas layers, carousel visuals, responsive states, reduced-motion fallback, and JobBot fallback media styling.
- Modify `app.js`: add hero canvas animation, carousel state/actions, visibility/reduced-motion pause logic, i18n copy keys, and route-safe initialization.
- Use existing assets:
  - `project-assets/job-bot.png`
  - `project-assets/dashboard-franquiciados.PNG`
  - `project-assets/portfolio-v1.png`
  - `project-assets/yo.webp`

## Chunk 1: Markup And Content

### Task 0: Preserve Certification Requirements

**Files:**
- Modify: `index.html`
- Modify: `app.js`

- [ ] **Step 1: Verify certification markup**

Ensure:
- Red Hat item links to `https://www.credly.com/badges/761f7f8d-41c7-4e1e-8dda-1e29830e4e85`.
- Claude Code item links to `http://verify.skilljar.com/c/tco79gkq8a9k`.
- Cisco CCNA 1 remains visible without a link.
- Python Automation is removed from HTML and i18n copy.

Expected: certifications satisfy verified-content requirements before larger redesign work proceeds.

### Task 1: Replace Static Hero With Command Center Shell

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add hero canvas and fallback map**

Inside `.hero`, add:

```html
<canvas id="ai-ops-canvas" class="ai-ops-canvas" aria-hidden="true"></canvas>
<div class="ai-ops-fallback" aria-hidden="true">
  <span>Planner</span><span>Builder</span><span>Reviewer</span><span>Security</span><span>Docs</span>
  <span>JobBot</span><span>FranquiYA</span><span>Agents System</span>
</div>
```

Expected: canvas exists before foreground hero content and fallback labels are available if CSS/JS disables animation.

- [ ] **Step 2: Restructure hero foreground**

Keep the existing hero text, actions, photo, and terminal, but wrap them in:

```html
<div class="container hero-command-center">
  <div class="hero-copy">...</div>
  <aside class="hero-dock">...</aside>
</div>
```

Expected: no duplicate hero copy, terminal still has `terminal-form`, `terminal-output`, and command buttons.

- [ ] **Step 3: Add multi-agent proof strip**

After hero foreground, add:

```html
<div class="container orchestration-strip" aria-label="AI orchestration workflow">
  <span>Intent</span><span>Planner</span><span>Builder</span><span>Reviewer</span><span>Security</span><span>Docs</span><span>Memory</span>
  <p data-i18n="orchestration.body">Command/context sync across Claude Code, Windsurf and Zed.</p>
</div>
```

Expected: visible proof of multi-agent usage on overview.

### Task 2: Replace Project Grid With Carousel

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Replace `.hero-showcase` with carousel**

Remove/replace the static three preview cards with:

```html
<section class="container project-carousel-section" aria-labelledby="project-carousel-title">
  <div class="section-heading-row">
    <h2 id="project-carousel-title" class="section-title" data-i18n="projects.title">Proyectos destacados</h2>
    <div class="carousel-controls">
      <button id="project-prev" type="button" aria-label="Proyecto anterior">...</button>
      <button id="project-next" type="button" aria-label="Proyecto siguiente">...</button>
    </div>
  </div>
  <div id="project-carousel" class="project-carousel" tabindex="0" aria-live="polite"></div>
</section>
```

Expected: project carousel has semantic controls and a focusable viewport.

- [ ] **Step 2: Keep projects tab as fallback/detail**

Update the existing `projects-section` to also use only the three approved projects or link to the same data-driven cards.

Expected: no featured `FulboTracker`, `PISKU CLI`, or `Pisculichi Labs` cards.

## Chunk 2: Styling And Motion

### Task 3: Command Center CSS

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Add hero canvas layer styles**

Add styles for `.ai-ops-canvas`, `.ai-ops-fallback`, `.hero-command-center`, and `.hero-dock`.

Expected:
- canvas is full-bleed inside hero;
- content remains readable above canvas;
- fallback map is visible only when JS adds a disabled/fallback class or reduced motion applies.

- [ ] **Step 2: Convert hero from card-heavy to command-center layout**

Reduce heavy card styling around terminal/photo, add docked surfaces, and create visual continuity with the animated canvas.

Expected: first viewport reads as one integrated system, not separated cards.

- [ ] **Step 3: Add telemetry styling for GitHub activity**

Restyle `.github-activity` as a command-center telemetry band while keeping the public GitHub SVG cards.

Expected: GitHub block reads like live telemetry, not generic cards.

- [ ] **Step 4: Add reduced-motion CSS**

Use:

```css
@media (prefers-reduced-motion: reduce) {
  .ai-ops-canvas { opacity: .22; }
  .ai-ops-fallback { display: grid; }
}
```

Expected: motion-sensitive users still see the command-center concept.

### Task 4: Carousel CSS

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Add carousel viewport and slide styles**

Create stable dimensions for `.project-carousel`, `.carousel-slide`, `.carousel-slide.active`, `.carousel-media`, `.carousel-meta`, and `.carousel-controls button`.

Expected:
- active slide is dominant;
- adjacent slides are partially visible on desktop;
- mobile shows one slide at a time;
- buttons have 44px hit area.

- [ ] **Step 2: Add JobBot fallback CSS**

If `job-bot.png` fails, JS should add `.media-fallback-jobbot`; CSS renders a terminal-like automation panel.

Expected: JobBot never shows PISKU imagery.

## Chunk 3: JavaScript Behavior

### Task 5: Hero Canvas Animation

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Add `setupAiOpsHero()`**

Create a function that:
- finds `#ai-ops-canvas`;
- caps DPR at 2;
- uses <=90 particles desktop and <=36 mobile;
- draws central core, rings, labeled nodes, and streams between `Planner`, `Builder`, `Reviewer`, `Security`, `Docs`;
- pauses when document is hidden or overview is inactive;
- respects `prefers-reduced-motion`.

Expected: nonblank animated scene without external dependencies.

- [ ] **Step 2: Call setup safely**

Call `setupAiOpsHero()` on `DOMContentLoaded`; expose resize/visibility listeners without duplicating loops.

Expected: no console errors when switching tabs.

### Task 6: Project Carousel Controller

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Add project data array**

Define `FEATURED_PROJECTS` with the three approved projects and fields:
`id`, `titleKey`, `descriptionKey`, `media`, `href`, `role`, `stack`, `value`.

Use these exact records:

```js
{
  id: 'jobbot',
  media: 'project-assets/job-bot.png',
  href: 'https://github.com/nachopalmeri/jobbot',
  role: 'Automation SaaS / AI-first implementation',
  stack: ['Next.js', 'FastAPI', 'PostgreSQL', 'HMAC', 'Stripe/MercadoPago'],
  value: 'Asynchronous job-search automation with production security patterns.'
}
{
  id: 'franquiya',
  media: 'project-assets/dashboard-franquiciados.PNG',
  href: 'https://github.com/nachopalmeri/FranquiYA',
  role: 'Operations dashboard / process control',
  stack: ['TypeScript', 'Dashboard', 'Inventory', 'Cash Flow', 'Audits'],
  value: 'Operational control for stock, invoices, shifts, employees, audits, and cash visibility.'
}
{
  id: 'agents',
  media: 'project-assets/portfolio-v1.png',
  href: '#/agents',
  role: 'Multi-IDE orchestration infrastructure',
  stack: ['Claude Code', 'Windsurf', 'Zed', 'PowerShell', 'Bash', 'Symlinks'],
  value: 'Portable prompts, shared context, rules, validation, and local automation across AI development environments.'
}
```

Expected: one source of truth for carousel rendering.

- [ ] **Step 2: Add render and navigation**

Implement:
- `renderProjectCarousel()`;
- `setActiveProject(index)`;
- previous/next buttons;
- keyboard ArrowLeft/ArrowRight;
- pointer/touch swipe.

Expected: carousel is usable by mouse, keyboard, and touch.

- [ ] **Step 3: Add image fallback**

On media error for JobBot, replace image with fallback markup/class.

Expected: no PISKU image can appear in JobBot slide.

### Task 7: i18n Copy

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Add copy keys**

Add `orchestration.body`, carousel labels, project role/value text for ES/EN.

Expected: language toggle updates all new text.

## Chunk 4: Verification

### Task 8: Static Verification

**Files:**
- Verify: `app.js`, `index.html`, `style.css`

- [ ] **Step 1: Run syntax check**

Run: `node --check app.js`

Expected: no output, exit code 0.

- [ ] **Step 2: Search forbidden content**

Run: `rg -n "Python Automation|Backend Developer|FulboTracker|PISKU CLI" index.html app.js style.css`

Expected: no visible featured-content matches except unrelated assets if still present on disk.

### Task 9: Browser Verification

**Files:**
- Verify: rendered `index.html`

- [ ] **Step 1: Desktop browser check**

Use Playwright/Chromium:
- canvas exists and has nonzero painted pixels;
- carousel has exactly 3 slides;
- carousel next/prev and keyboard work;
- JobBot image src is `project-assets/job-bot.png` or fallback, never `pisku-cli.png`;
- no horizontal overflow.

- [ ] **Step 2: Mobile browser check**

Viewport 390x844:
- no horizontal overflow;
- hero text readable;
- carousel usable;
- agents mobile inline details still work.

- [ ] **Step 3: Reduced motion check**

Emulate reduced motion:
- canvas loop is paused/static;
- fallback/proof content remains visible.

Expected: all checks pass before claiming completion.
