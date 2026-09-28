// The intro film: about a minute that opens the portfolio. It is code, not a
// video file, for two reasons: the window it plays in has to turn into the
// real site at the end, and the sound has to be cut to the picture (it is
// synthesized here, plus two short CC BY music cues in score.m4a).
//
// Structure: a list of cues on one clock. Visual cues fire on time; sound cues
// fire a little early and are scheduled on the AudioContext clock so they land
// exactly on the cut. Continuous sounds (room tone, drone, music) are "beds"
// that can also start mid-way, when someone turns the sound on late.
import { PORTRAIT } from '/intro/portrait.js';

const COPY = {
  es: {
    aria: 'Intro: una película de un minuto sobre Ignacio',
    title: 'dame un minuto.',
    hint: 'o hacé click · mejor con sonido',
    skip: 'Saltar intro →', soundOn: '♪ Sonido: sí', soundOff: '♪ Sonido: no',
    cmd1: 'python aprender.py',
    tb: ['Traceback (most recent call last):', '  File "aprender.py", line 1, in <module>', '    entender(todo)', "NameError: name 'todo' is not defined"],
    cmd2: 'python aprender.py --de-a-poco',
    pageHead: 'EL RETRATO DE DORIAN GRAY · IV',
    quote: ['La experiencia no tenía ningún valor ético. Era, simplemente, ', 'el nombre que los hombres daban a sus errores.'],
    code: ['aprender', 'de', 'errores'],
    commit: 'git commit -m "fix: la rotación mantiene la familia"',
    note: '¿por qué falla?',
    tests: ['34 passed', '0 failed · router de agentes'],
    spine: 'LOS HERMANOS KARAMÁZOV',
    push: ['$ git push origin main', '✓ deploy listo'],
    id: ['19 · Buenos Aires, Argentina', 'Gestión de TI · UADE', 'TI × IA × construir'],
    narr1: 'Todavía estoy empezando.',
    narr2: 'Pero ya estoy construyendo.',
    notif: ['JobBot', 'Nueva oferta · <em>92% match</em>', 'Frontend Developer · Remoto'],
    worlds: {
      jobbot: ['JobBot', 'buscar trabajo, automatizado', 'online'],
      darter: ['Darter', 'mis finanzas, con un brief diario hecho con IA', 'privado'],
      agents: ['Agents System', '19 agentes que trabajan conmigo', 'local']
    },
    wall: (n) => `${n} proyectos online.`,
    books: [['Crimen y castigo', 'Fiódor Dostoievski'], ['Romeo y Julieta', 'William Shakespeare'], ['El retrato de Dorian Gray', 'Oscar Wilde'], ['El Hobbit', 'J. R. R. Tolkien'], ['The Catcher in the Rye', 'J. D. Salinger'], ['AI Engineering', 'Chip Huyen'], ['Fooled by Randomness', 'Nassim N. Taleb'], ['Los hermanos Karamázov', 'Fiódor Dostoievski']],
    reading: 'leyendo ahora',
    narr3: 'Me gustan las historias donde alguien pregunta hasta entender.',
    narr4: 'Con el código hago lo mismo.',
    end1: 'eso es lo que entra en un minuto.',
    end2: 'el resto está detrás de esta ventana.',
    esKicker: 'Fin de la intro',
    enter: 'Entrar a la web', auto: (s) => `Entrás solo en ${s} s`, autoPaused: 'En pausa mientras mirás',
    keep: 'Seguí mirando', replay: '↺ Ver de nuevo',
    credit: '♪ Música: Portrayal, <a href="https://freemusicarchive.org/music/Portrayal/to-the-black-sea/universal-libraries/" target="_blank" rel="noopener">“Universal Libraries”</a> y <a href="https://freemusicarchive.org/music/Portrayal/to-the-black-sea/you-and-everyone/" target="_blank" rel="noopener">“You and Everyone”</a> (CC BY 4.0). El resto del sonido lo genera el navegador.'
  },
  en: {
    aria: 'Intro: a one-minute film about Ignacio',
    title: 'give me a minute.',
    hint: 'or click · better with sound',
    skip: 'Skip intro →', soundOn: '♪ Sound: on', soundOff: '♪ Sound: off',
    cmd1: 'python learn.py',
    tb: ['Traceback (most recent call last):', '  File "learn.py", line 1, in <module>', '    understand(everything)', "NameError: name 'everything' is not defined"],
    cmd2: 'python learn.py --step-by-step',
    pageHead: 'THE PICTURE OF DORIAN GRAY · IV',
    quote: ['Experience was of no ethical value. It was merely ', 'the name men gave to their mistakes.'],
    code: ['learn', 'from_', 'mistakes'],
    commit: 'git commit -m "fix: rotation keeps the token family"',
    note: 'why does it break?',
    tests: ['34 passed', '0 failed · agents router'],
    spine: 'THE BROTHERS KARAMAZOV',
    push: ['$ git push origin main', '✓ deployed'],
    id: ['19 · Buenos Aires, Argentina', 'IT Management · UADE', 'IT × AI × building'],
    narr1: 'I’m still starting out.',
    narr2: 'But I’m already building.',
    notif: ['JobBot', 'New job · <em>92% match</em>', 'Frontend Developer · Remote'],
    worlds: {
      jobbot: ['JobBot', 'job hunting, automated', 'live'],
      darter: ['Darter', 'my finances, with a daily AI brief', 'private'],
      agents: ['Agents System', '19 agents that work with me', 'local']
    },
    wall: (n) => `${n} projects live.`,
    books: [['Crime and Punishment', 'Fyodor Dostoevsky'], ['Romeo and Juliet', 'William Shakespeare'], ['The Picture of Dorian Gray', 'Oscar Wilde'], ['The Hobbit', 'J. R. R. Tolkien'], ['The Catcher in the Rye', 'J. D. Salinger'], ['AI Engineering', 'Chip Huyen'], ['Fooled by Randomness', 'Nassim N. Taleb'], ['The Brothers Karamazov', 'Fyodor Dostoevsky']],
    reading: 'reading now',
    narr3: 'I like stories where someone keeps asking until they understand.',
    narr4: 'I do the same with code.',
    end1: 'that’s what fits in a minute.',
    end2: 'the rest is behind this window.',
    esKicker: 'End of the intro',
    enter: 'Enter the site', auto: (s) => `Opening in ${s}s`, autoPaused: 'Paused while you look',
    keep: 'Keep watching', replay: '↺ Watch again',
    credit: '♪ Music: Portrayal, <a href="https://freemusicarchive.org/music/Portrayal/to-the-black-sea/universal-libraries/" target="_blank" rel="noopener">“Universal Libraries”</a> and <a href="https://freemusicarchive.org/music/Portrayal/to-the-black-sea/you-and-everyone/" target="_blank" rel="noopener">“You and Everyone”</a> (CC BY 4.0). Every other sound is generated by the browser.'
  }
};

const A = '/project-assets/';
const SHOTS = {
  jobbot: `${A}job-bot.webp`, darter: `${A}darter.webp`, agents: `${A}agents-system.webp`,
  flash: [['Motor Estadístico', 'prode-mundial-2026.webp'], ['FulboTracker', 'futtracker.webp'], ['Comida de Barrio', 'comidadebarrio.webp'], ['Dulces Creaciones', 'dulcescreaciones.webp'], ['FranquiYA', 'franquiya.webp'], ['Piscubi Store', 'piscubi.webp'], ['Pisculichi Labs', 'polymarktporyect.webp'], ['PISKU CLI', 'pisku-cli-correct.webp']]
};
// The six films offered on the end screen (real demos, real durations).
const CARDS = [
  ['jobbot', 'JobBot', 'job-bot.webp', 'jobbot-demo.mp4', '0:40', { es: 'SaaS de búsqueda laboral', en: 'Job-search SaaS' }],
  ['darter', 'Darter', 'darter.webp', 'darter-demo.mp4', '0:50', { es: 'Mis finanzas, en un panel', en: 'My finances, one dashboard' }],
  ['agents-system', 'Agents System', 'agents-system.webp', 'agents-system-demo.mp4', '0:51', { es: 'Mi sistema de agentes', en: 'My agent system' }],
  ['motor-estadistico', 'Motor Estadístico', 'prode-mundial-2026.webp', 'prode-demo.mp4', '0:33', { es: 'Prode del Mundial 2026', en: 'World Cup 2026 predictor' }],
  ['fulbotracker', 'FulboTracker', 'futtracker.webp', 'fulbotracker-demo.mp4', '0:32', { es: 'Partidos y estadísticas', en: 'Matches and stats' }],
  ['comidadebarrio', 'Comida de Barrio', 'comidadebarrio.webp', 'comidadebarrio-demo.mp4', '0:29', { es: 'Pedidos de comida', en: 'Food ordering' }]
];

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const rand = (a, b) => a + Math.random() * (b - a);

// ---------------------------------------------------------------- sound
class Sound {
  constructor() {
    const AC = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    const comp = this.ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 3;
    this.master.connect(comp).connect(this.ctx.destination);
    const len = this.ctx.sampleRate * 2;
    this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.score = null;
  }
  get running() { return this.ctx.state === 'running'; }
  src(loop = false) { const s = this.ctx.createBufferSource(); s.buffer = this.noise; s.loop = loop; return s; }
  gain(v = 0) { const g = this.ctx.createGain(); g.gain.value = v; return g; }
  filter(type, f, q = 1) { const b = this.ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; return b; }
  osc(type, f) { const o = this.ctx.createOscillator(); o.type = type; o.frequency.value = f; return o; }
  env(g, when, peak, attack, decay) {
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(peak, when + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, when + attack + decay);
  }
  burst(when, { f = 2400, q = 1, peak = 0.3, decay = 0.04, type = 'bandpass' } = {}) {
    const s = this.src(), b = this.filter(type, f, q), g = this.gain();
    s.connect(b).connect(g).connect(this.master);
    this.env(g, when, peak, 0.002, decay);
    s.start(when, Math.random()); s.stop(when + decay + 0.05);
  }
  tone(when, { type = 'sine', f = 440, to, peak = 0.1, attack = 0.005, decay = 0.3 } = {}) {
    const o = this.osc(type, f), g = this.gain();
    if (to) o.frequency.exponentialRampToValueAtTime(to, when + attack + decay);
    o.connect(g).connect(this.master);
    this.env(g, when, peak, attack, decay);
    o.start(when); o.stop(when + attack + decay + 0.05);
  }
  key(when, v = 1) {
    this.burst(when, { f: rand(1700, 3400), q: 1.3, peak: 0.22 * v, decay: 0.035 });
    this.tone(when, { f: rand(110, 150), peak: 0.05 * v, decay: 0.03 });
  }
  enter(when) { this.key(when, 1.7); this.tone(when + 0.01, { f: 85, peak: 0.16, decay: 0.12 }); }
  typewriter(when) {
    this.burst(when, { f: 3200, q: 3, peak: 0.28, decay: 0.05 });
    this.burst(when + 0.012, { f: 900, q: 0.8, peak: 0.14, decay: 0.07 });
  }
  thud(when) {
    this.tone(when, { f: 72, to: 30, peak: 0.55, decay: 0.9 });
    this.burst(when, { f: 260, q: 0.7, peak: 0.25, decay: 0.25, type: 'lowpass' });
  }
  glitch(when) {
    const g = this.gain(), hp = this.filter('highpass', 280);
    [110, 167, 233].forEach((f) => { const o = this.osc('square', f); o.connect(hp); o.start(when); o.stop(when + 0.2); });
    hp.connect(g).connect(this.master);
    for (let i = 0; i < 10; i++) g.gain.setValueAtTime(i % 2 ? 0 : 0.045, when + i * 0.018);
    g.gain.setValueAtTime(0, when + 0.19);
  }
  ping(when) {
    this.tone(when, { f: 1318.5, peak: 0.07, decay: 1.4 });
    this.tone(when + 0.005, { f: 1975.5, peak: 0.03, decay: 1.1 });
  }
  blip(when) { this.tone(when, { f: 660, to: 990, peak: 0.07, decay: 0.08 }); }
  tick(when, hi) {
    this.burst(when, { f: 5200, q: 2, peak: 0.16, decay: 0.012, type: 'highpass' });
    this.tone(when, { f: hi ? 2350 : 1850, peak: 0.035, decay: 0.03 });
  }
  paper(when, dur = 0.4, v = 1) {
    const s = this.src(), b = this.filter('bandpass', 700, 0.9), g = this.gain();
    b.frequency.setValueAtTime(700, when); b.frequency.exponentialRampToValueAtTime(2800, when + dur * 0.7);
    s.connect(b).connect(g).connect(this.master);
    this.env(g, when, 0.2 * v, dur * 0.35, dur * 0.65);
    s.start(when, Math.random()); s.stop(when + dur + 0.1);
  }
  whoosh(when) {
    const s = this.src(), b = this.filter('bandpass', 300, 1.4), g = this.gain();
    b.frequency.setValueAtTime(300, when); b.frequency.exponentialRampToValueAtTime(2600, when + 0.26);
    s.connect(b).connect(g).connect(this.master);
    this.env(g, when, 0.3, 0.12, 0.18);
    s.start(when, Math.random()); s.stop(when + 0.4);
  }
  pencil(when, dur) {
    const s = this.src(true), hp = this.filter('highpass', 2600), bp = this.filter('bandpass', 4600, 0.7), g = this.gain(0);
    s.connect(hp).connect(bp).connect(g).connect(this.master);
    for (let t = 0; t < dur; t += 0.03) g.gain.setValueAtTime(rand(0.03, 0.1), when + t);
    g.gain.setValueAtTime(0, when + dur);
    s.start(when); s.stop(when + dur + 0.05);
  }
  // beds: continuous sounds, started with an offset when needed
  room(when, dur, level = 1) {
    const s = this.src(true), lp = this.filter('lowpass', 420), g = this.gain(0);
    s.connect(lp).connect(g).connect(this.master);
    const fan = this.src(true), bp = this.filter('bandpass', 190, 4), fg = this.gain(0.02 * level);
    fan.connect(bp).connect(fg).connect(g);
    const hum = this.osc('sine', 50), hg = this.gain(0.01 * level);
    hum.connect(hg).connect(this.master);
    g.gain.setValueAtTime(0, when); g.gain.linearRampToValueAtTime(0.09 * level, when + 1.2);
    g.gain.setValueAtTime(0.09 * level, when + dur - 0.25); g.gain.linearRampToValueAtTime(0, when + dur);
    hg.gain.setValueAtTime(0.01 * level, when + dur - 0.25); hg.gain.linearRampToValueAtTime(0, when + dur);
    [s, fan, hum].forEach((n) => { n.start(when); n.stop(when + dur + 0.05); });
  }
  drone(when, dur, offset = 0) {
    const lp = this.filter('lowpass', 160, 2), g = this.gain(0);
    const oscs = [this.osc('sawtooth', 55), this.osc('sawtooth', 55.35), this.osc('sine', 36.7)];
    oscs.forEach((o) => { o.connect(lp); o.start(when); o.stop(when + dur - offset + 0.02); });
    lp.connect(g).connect(this.master);
    const k = offset / dur;
    lp.frequency.setValueAtTime(160 + 700 * k, when); lp.frequency.linearRampToValueAtTime(860, when + dur - offset);
    g.gain.setValueAtTime(0.02 + 0.2 * k, when); g.gain.linearRampToValueAtTime(0.24, when + dur - offset - 0.02);
    g.gain.setValueAtTime(0, when + dur - offset);
  }
  projector(when, dur) {
    const s = this.src(true), bp = this.filter('bandpass', 1500, 0.8), g = this.gain(0), out = this.gain(0);
    s.connect(bp).connect(g).connect(out).connect(this.master);
    const lfo = this.osc('square', 24), depth = this.gain(0.06);
    lfo.connect(depth).connect(g.gain);
    g.gain.value = 0.06;
    const motor = this.osc('sine', 98), mg = this.gain(0.012);
    motor.connect(mg).connect(out);
    out.gain.setValueAtTime(0, when); out.gain.linearRampToValueAtTime(1, when + 0.5);
    out.gain.setValueAtTime(1, when + dur - 0.6); out.gain.linearRampToValueAtTime(0, when + dur);
    lfo.frequency.setValueAtTime(24, when + dur - 0.6); lfo.frequency.linearRampToValueAtTime(9, when + dur);
    [s, lfo, motor].forEach((n) => { n.start(when); n.stop(when + dur + 0.05); });
  }
  music(when, clipOffset, dur, peak, { fadeIn = 0.02, fadeOut = 0.03 } = {}) {
    if (!this.score || dur <= 0.05) return;
    const s = this.ctx.createBufferSource(), g = this.gain(0);
    s.buffer = this.score; s.connect(g).connect(this.master);
    g.gain.setValueAtTime(0, when); g.gain.linearRampToValueAtTime(peak, when + fadeIn);
    g.gain.setValueAtTime(peak, when + dur - fadeOut); g.gain.linearRampToValueAtTime(0, when + dur);
    s.start(when, clipOffset, dur + 0.02);
  }
  mute(on) { this.master.gain.setTargetAtTime(on ? 0 : 1, this.ctx.currentTime, 0.08); }
  close() {
    this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
    setTimeout(() => this.ctx.close().catch(() => {}), 700);
  }
}

// ---------------------------------------------------------------- portrait
const RAMP = " .'`:-~=+*<>/(){}[]%#@";
const CODE_CHARS = '{}()[]<>=/;:+*#01';
function makePortrait(canvas) {
  const bin = atob(PORTRAIT);
  const cols = 96, rows = 54, cells = [];
  for (let i = 0; i < cols * rows; i++) {
    const byte = bin.charCodeAt(i >> 1);
    const l = i & 1 ? byte & 15 : byte >> 4;
    if (l < 2) continue;
    cells.push({ c: i % cols, r: Math.floor(i / cols), l, ch: RAMP[Math.min(RAMP.length - 1, Math.round((l / 15) * (RAMP.length - 1)))], sx: Math.random(), sy: Math.random(), delay: Math.random() * 0.45 + ((i % cols) / cols) * 0.25, green: Math.random() < 0.05 });
  }
  let g, W, H, cw, rh, raf = 0, t0 = 0, living = 0;
  function size() {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.max(1, Math.round(r.width * dpr)); canvas.height = Math.max(1, Math.round(r.height * dpr));
    W = canvas.width; H = canvas.height; cw = W / cols; rh = H / rows;
    g = canvas.getContext('2d');
    g.font = `500 ${rh * 0.95}px ui-monospace, 'SF Mono', Menlo, Consolas, monospace`;
    g.textBaseline = 'top';
  }
  const color = (cell, a = 1) => (cell.green ? `rgba(52,211,153,${a * (0.35 + 0.6 * cell.l / 15)})` : `rgba(246,236,214,${a * (0.18 + 0.82 * cell.l / 15)})`);
  function draw(p) {
    g.clearRect(0, 0, W, H);
    for (const cell of cells) {
      const k = Math.min(1, Math.max(0, (p - cell.delay) / 0.9));
      const e = 1 - Math.pow(1 - k, 3);
      const x = (cell.sx * 1.4 - 0.2) * W + (cell.c * cw - (cell.sx * 1.4 - 0.2) * W) * e;
      const y = (cell.sy * 1.4 - 0.2) * H + (cell.r * rh - (cell.sy * 1.4 - 0.2) * H) * e;
      g.fillStyle = color(cell, 0.25 + 0.75 * e);
      g.fillText(k < 1 && Math.random() < 0.3 ? CODE_CHARS[(Math.random() * CODE_CHARS.length) | 0] : cell.ch, x, y);
    }
  }
  return {
    // dust drifting in the dark, then the characters find their places
    assemble(duration) {
      size(); t0 = performance.now();
      const frame = (now) => {
        const p = ((now - t0) / 1000 / duration) * 1.65;
        draw(Math.min(p, 1.65));
        if (p < 1.65) raf = requestAnimationFrame(frame);
        else this.live();
      };
      raf = requestAnimationFrame(frame);
    },
    // once formed, a few characters keep changing: it is still code
    live() {
      draw(2);
      living = setInterval(() => {
        for (let i = 0; i < 14; i++) {
          const cell = cells[(Math.random() * cells.length) | 0];
          g.clearRect(cell.c * cw, cell.r * rh, cw, rh);
          g.fillStyle = color({ ...cell, green: true });
          g.fillText(CODE_CHARS[(Math.random() * CODE_CHARS.length) | 0], cell.c * cw, cell.r * rh);
          setTimeout(() => { g.clearRect(cell.c * cw, cell.r * rh, cw, rh); g.fillStyle = color(cell); g.fillText(cell.ch, cell.c * cw, cell.r * rh); }, 160);
        }
      }, 150);
    },
    stop() { cancelAnimationFrame(raf); clearInterval(living); }
  };
}

function grainTile() {
  const c = document.createElement('canvas');
  c.width = c.height = 180;
  const g = c.getContext('2d'), img = g.createImageData(180, 180);
  for (let i = 0; i < img.data.length; i += 4) { const v = Math.random() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
  g.putImageData(img, 0, 0);
  return c.toDataURL('image/png');
}

// ---------------------------------------------------------------- film
let active = null;

export function playIntro({ replay = false } = {}) {
  if (active) return;
  const lang = document.documentElement.lang === 'en' ? 'en' : 'es';
  const C = COPY[lang];
  const root = document.documentElement;
  const lite = !!document.querySelector('.cine-hero.is-lite');
  const deployed = Number(document.body.dataset.deployed) || 10;
  if (replay) window.scrollTo(0, 0);

  if (!document.querySelector('link[href="/intro/intro.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = '/intro/intro.css';
    document.head.appendChild(link);
  }

  const el = document.createElement('div');
  el.className = `intro${lite ? ' is-lite' : ''}`;
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-label', C.aria);
  const [before, under] = C.quote;
  el.innerHTML = `
    <div class="intro-veil"></div>
    <div class="intro-frame">
      <div class="intro-win is-waiting" tabindex="-1">
        <div class="iw-stage">
          <section class="sc sc-term on"><div class="term" aria-live="polite"></div><button type="button" class="term-hint"><kbd>Enter ↵</kbd>${esc(C.hint)}</button></section>
          <section class="sc sc-page"><div class="pg">
            <div class="pg-head">${esc(C.pageHead)}</div>
            <div class="pg-line" style="width:92%"></div><div class="pg-line" style="width:84%"></div><div class="pg-line" style="width:88%"></div>
            <p class="pg-quote">${esc(before)}<span class="u">${esc(under)}</span></p>
            <div class="pg-line" style="width:90%"></div><div class="pg-line" style="width:79%"></div><div class="pg-line" style="width:86%"></div><div class="pg-line" style="width:60%"></div>
          </div></section>
          <section class="sc sc-code"><div class="code-row"><span class="ln">12</span><span><span class="fn">${esc(C.code[0])}</span>(${esc(C.code[1])}=<span class="sq">${esc(C.code[2])}</span>) <span class="chk">✓</span></span></div></section>
          <section class="sc sc-mont">
            <div class="shot shot-key"><div class="key">enter ↵</div></div>
            <div class="shot"><div class="shot-term"><span style="color:#34d399">$</span> ${esc(C.commit)}</div></div>
            <div class="shot shot-note"><span>${esc(C.note)}</span></div>
            <div class="shot shot-tests"><div><span>✓ ${esc(C.tests[0])}</span><small>${esc(C.tests[1])}</small></div></div>
            <div class="shot shot-spine"><div class="spine"><i></i><b>${esc(C.spine)}</b></div></div>
            <div class="shot shot-tab"><div class="tabbar"><span>localhost:3000</span></div><div class="loadbar"><i></i></div><div class="skel"><i></i><i></i><i style="width:80%"></i><i style="width:64%"></i></div></div>
            <div class="shot"><div class="shot-term">${esc(C.push[0])}\n<span style="color:#34d399">${esc(C.push[1])}</span></div></div>
            <div class="shot shot-tc"><span data-bigtc>00:00:00</span></div>
          </section>
          <section class="sc sc-portrait"><canvas aria-hidden="true"></canvas>
            <div class="id"><h2 class="id-name">Ignacio Palmeri</h2>${C.id.map((l, i) => `<div class="id-line${i === 2 ? ' hl' : ''}">${esc(l)}</div>`).join('')}</div>
          </section>
          <section class="sc sc-worlds">
            <div class="w w-code"><pre>${[
              '<span class="k">async def</span> scan(profile):',
              '    jobs = <span class="k">await</span> sources.search(profile.query)',
              '    <span class="k">for</span> job <span class="k">in</span> dedupe(jobs):',
              '        score = match(job, profile)',
              '        <span class="k">if</span> score &lt; profile.threshold:',
              '            <span class="k">continue</span>',
              '        <span class="k">await</span> telegram.send(profile.chat_id, job)',
              '',
              '<span class="k">@router</span>.post(<span class="s">"/webhooks/mercadopago"</span>)',
              '<span class="k">async def</span> payment(event):',
              '    <span class="k">await</span> plans.activate(event.user_id)',
              '',
              '<span class="k">def</span> test_plan_limits():',
              '    <span class="k">assert</span> limits(<span class="s">"pro"</span>).alerts == 50'
            ].join('\n')}</pre>
              <div class="notif"><i>J</i><div><b>${esc(C.notif[0])}</b>${C.notif[1]}<br>${esc(C.notif[2])}</div></div>
            </div>
            ${['jobbot', 'darter', 'agents'].map((k, i) => `<div class="w w-world" data-w="${k}">
              <div class="browser"><div class="bar"><i></i><i></i><i></i><span>${k === 'jobbot' ? 'jobbot-lime.vercel.app' : k === 'darter' ? 'darter · local' : 'agents-system · local'}</span></div><div class="view"><img alt="" data-src="${SHOTS[k]}"></div></div>
              <div class="label"><span class="n">0${i + 1}</span><h3>${esc(C.worlds[k][0])}<span class="tag">${esc(C.worlds[k][2])}</span></h3><p>${esc(C.worlds[k][1])}</p></div>
            </div>`).join('')}
            ${SHOTS.flash.map(([name, img]) => `<div class="w w-flash"><img alt="" data-src="${A}${img}"><h3>${esc(name)}</h3></div>`).join('')}
            <div class="w w-wall"><div class="wall">${[SHOTS.jobbot, SHOTS.darter, SHOTS.agents, ...SHOTS.flash.map(([, i]) => A + i), `${A}dom.webp`, SHOTS.jobbot].map((s) => `<img alt="" data-src="${s}">`).join('')}</div><h3>${esc(C.wall(deployed))}</h3></div>
          </section>
          <section class="sc sc-desk">
            <div class="book"><div class="page left"></div><div class="page right"></div>
              ${C.books.map(([t, a], i) => `<div class="leaf" style="z-index:${20 - i}"><div class="front"><strong>${esc(t)}</strong><div class="rule"></div><small>${esc(a)}</small>${i === C.books.length - 1 ? `<span class="pencil-note">${esc(C.reading)}</span>` : ''}</div><div class="back"></div></div>`).join('')}
            </div>
            <div class="lamp"></div><div class="gate"></div>
          </section>
          <section class="sc sc-endscreen">
            <div class="es-left">
              <p class="es-kicker">${esc(C.esKicker)}</p>
              <h2 class="es-name">Ignacio Palmeri</h2>
              <button type="button" class="es-enter"><svg viewBox="0 0 36 36" aria-hidden="true"><circle class="bg" cx="18" cy="18" r="15"/><circle class="fg" cx="18" cy="18" r="15" pathLength="1"/><path d="M15 12.5l7 5.5-7 5.5z" fill="#0b0b0d"/></svg>${esc(C.enter)}</button>
              <p class="es-auto" aria-live="off"></p>
              <button type="button" class="es-replay">${esc(C.replay)}</button>
            </div>
            <div class="es-right">
              <h4>${esc(C.keep)}</h4>
              <div class="es-grid">${CARDS.map(([id, name, img, video, dur, line]) => `<button type="button" class="es-card" data-video="/project-assets/video/${video}" data-project="${id}"><div class="es-thumb"><img alt="" data-src="${A}${img}"><span>${dur}</span></div><b>${esc(name)}</b><small>${esc(line[lang])}</small></button>`).join('')}</div>
            </div>
            <p class="es-credit">${C.credit}</p>
          </section>
        </div>
        <div class="iw-narr" aria-live="polite"></div>
        <div class="iw-flash"></div>
        <div class="iw-vignette"></div>
        <div class="iw-grain"></div>
        <div class="iw-tc" aria-hidden="true">00:00:00:00</div>
      </div>
    </div>
    <div class="intro-top">
      <button type="button" class="intro-sound" aria-pressed="true">${esc(C.soundOn)}</button>
      <button type="button" class="intro-skip">${esc(C.skip)}</button>
    </div>`;

  const $ = (s) => el.querySelector(s);
  const $$ = (s) => [...el.querySelectorAll(s)];
  const win = $('.intro-win'), frame = $('.intro-frame'), veil = $('.intro-veil');
  const term = $('.term'), narr = $('.iw-narr'), tcEl = $('.iw-tc'), bigTc = $('[data-bigtc]');
  const soundBtn = $('.intro-sound'), skipBtn = $('.intro-skip');
  $('.iw-grain').style.backgroundImage = `url(${grainTile()})`;

  // The site underneath: frozen, blurred, out of reach until the door opens.
  const inerted = [...document.body.children].filter((n) => n !== el && !n.hasAttribute('inert') && n.tagName !== 'SCRIPT');
  inerted.forEach((n) => n.setAttribute('inert', ''));
  document.body.appendChild(el);
  root.classList.add('intro-on');
  root.classList.remove('intro-pending');
  window.dispatchEvent(new Event('intro-state'));
  window.__introReady = true;

  // ---------------------------------------------------------- clock + cues
  let base = 0, startedAt = null, rafId = 0, running = false, finished = false;
  const now = () => (startedAt === null ? base : base + (performance.now() - startedAt) / 1000);
  const vis = [], aud = [], beds = [];
  let vi = 0, ai = 0;
  const at = (t, fn) => vis.push({ t, fn });
  const sfx = (t, fn) => aud.push({ t, fn });
  const bed = (from, to, start) => { beds.push({ from, to, start }); sfx(from, (when) => start(when, 0)); };
  let snd = null, muted = false;
  const audible = () => snd && snd.running;
  const whenFor = (t) => snd.ctx.currentTime + Math.max(0, t - now());

  function loop() {
    if (!running) return;
    const t = now();
    while (vi < vis.length && vis[vi].t <= t) vis[vi++].fn(t);
    while (ai < aud.length && aud[ai].t <= t + 0.08) { const c = aud[ai++]; if (audible()) c.fn(whenFor(c.t)); }
    const f = Math.floor((t % 1) * 24);
    const s = Math.floor(t);
    const tc = `00:00:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
    tcEl.textContent = tc;
    if (bigTc.offsetParent) bigTc.textContent = tc.slice(3);
    rafId = requestAnimationFrame(loop);
  }
  function pause() { if (startedAt === null) return; base = now(); startedAt = null; if (snd) snd.ctx.suspend().catch(() => {}); }
  function resume() { if (startedAt !== null || !running) return; startedAt = performance.now(); if (snd && !muted) snd.ctx.resume().catch(() => {}); }
  const onVis = () => (document.visibilityState === 'hidden' ? pause() : resume());
  document.addEventListener('visibilitychange', onVis);

  // Sound is created on a gesture (browser rule). Beds that should already
  // be playing start mid-way so a late "sound on" still lands in sync.
  function unlockSound() {
    if (snd) { if (!muted) snd.ctx.resume().catch(() => {}); return; }
    try { snd = new Sound(); } catch (_e) { return; }
    if (scoreBytes) scoreBytes.then((buf) => buf && snd.ctx.decodeAudioData(buf.slice(0)).then((b) => { snd.score = b; }).catch(() => {}));
    if (running) {
      const t = now();
      beds.forEach((b) => { if (b.from <= t && t < b.to - 0.3) b.start(snd.ctx.currentTime + 0.02, t - b.from); });
    }
  }
  const scoreBytes = fetch('/intro/score.m4a').then((r) => (r.ok ? r.arrayBuffer() : null)).catch(() => null);

  // ---------------------------------------------------------- helpers
  function scene(name) { $$('.sc').forEach((s) => s.classList.toggle('on', s.classList.contains(`sc-${name}`))); }
  function line(html, cls = '') { const d = document.createElement('div'); if (cls) d.className = cls; d.innerHTML = html; term.appendChild(d); return d; }
  function cursorTo(node) { term.querySelector('.cursor')?.remove(); const c = document.createElement('span'); c.className = 'cursor'; node.appendChild(c); }
  // Types text into a node, one cue per character, with its own key sounds.
  function typeAt(t, node, text, cps, { sound = 'key', jitter = 0.35 } = {}) {
    let tt = t;
    const target = () => (typeof node === 'function' ? node() : node);
    for (let i = 0; i < text.length; i++) {
      const upto = i + 1, ch = text[i];
      at(tt, () => { const n = target(); const c = n.querySelector('.cursor'); n.firstChild.nodeValue = text.slice(0, upto); if (c) n.appendChild(c); });
      if (sound && ch !== ' ') sfx(tt, (w) => (sound === 'type' ? snd.typewriter(w) : snd.key(w, rand(0.7, 1.1))));
      tt += (1 / cps) * (1 + rand(-jitter, jitter));
    }
    return tt;
  }
  function textLine(prefixHtml, cls) { const d = line(`${prefixHtml}<span class="tx">​</span>`, cls); const tx = d.querySelector('.tx'); tx.firstChild.nodeValue = ''; cursorTo(tx); return tx; }
  function narrate(t, text, { cls = '', cps = 26, keep = false } = {}) {
    let span;
    at(t, () => { if (!keep) narr.innerHTML = ''; span = document.createElement('span'); if (cls) span.className = cls; span.textContent = '​'; narr.appendChild(span); span.firstChild.nodeValue = ''; });
    let tt = t;
    for (let i = 0; i < text.length; i++) { const upto = i + 1; at(tt, () => { span.firstChild.nodeValue = text.slice(0, upto); }); tt += 1 / cps; }
    return tt;
  }
  const flash = () => { const f = $('.iw-flash'); f.classList.remove('is-on'); void f.offsetWidth; f.classList.add('is-on'); };
  const loadImgs = () => $$('img[data-src]').forEach((i) => { i.src = i.dataset.src; i.removeAttribute('data-src'); });

  // ---------------------------------------------------------- the pre-roll
  // Almost nothing: the window, a cursor, one line. The film waits for a
  // gesture (so it can have sound); if nobody moves, it starts silent.
  let started = false, autoTimer = 0;
  const titleNode = textLine('', 'title');
  (async () => {
    await wait(900);
    for (let i = 1; i <= C.title.length && !started; i++) { titleNode.firstChild.nodeValue = C.title.slice(0, i); await wait(i === 1 ? 160 : rand(70, 120)); }
    await wait(500);
    if (!started) $('.term-hint').classList.add('is-on');
  })();
  autoTimer = setTimeout(() => start(false), 9000);
  win.focus({ preventScroll: true });

  function start(withSound) {
    if (started || finished) return;
    started = true; clearTimeout(autoTimer);
    win.classList.remove('is-waiting');
    $('.term-hint').remove();
    if (withSound) unlockSound();
    else { soundBtn.setAttribute('aria-pressed', 'false'); soundBtn.textContent = C.soundOff; soundBtn.classList.add('is-nudge'); muted = true; }
    titleNode.parentElement.classList.add('dim');
    running = true; base = 0; startedAt = performance.now();
    rafId = requestAnimationFrame(loop);
  }

  // ---------------------------------------------------------- timeline
  const T = { page: 9.0, code: 12.2, mont: 13.6, dark: 17.6, portrait: 17.9, drop: 26.0, worlds: 26.0, silence: 40.0, desk: 40.7, end: 50.8, endscreen: 56.6 };

  // 1. The terminal: an error, a pause, another try. (learn → break → understand)
  bed(0, T.dark, (w, off) => snd.room(w, T.dark - off, 1));
  at(0.2, () => { titleNode.parentElement.style.transition = 'opacity 1s'; titleNode.parentElement.style.opacity = '.35'; titleNode.parentElement.querySelector('.cursor')?.remove(); });
  let cmd;
  at(1.3, () => { cmd = textLine('<span class="p">$</span> '); });
  let t = typeAt(1.4, () => cmd, C.cmd1, 13);
  sfx(t + 0.25, (w) => snd.enter(w));
  at(t + 0.4, () => {
    term.querySelector('.cursor')?.remove();
    C.tb.forEach((l, i) => line(esc(l), i === C.tb.length - 1 ? 'err' : 'dim'));
    win.classList.add('is-jolt'); setTimeout(() => win.classList.remove('is-jolt'), 400);
  });
  sfx(t + 0.4, (w) => { snd.thud(w); snd.glitch(w); });
  at(4.8, () => { term.innerHTML = ''; cmd = textLine('<span class="p">$</span> '); });
  t = typeAt(5.0, () => cmd, C.cmd2, 16);
  sfx(t + 0.1, (w) => snd.enter(w));
  let dots;
  at(t + 0.25, () => { term.querySelector('.cursor')?.remove(); dots = line('', 'dim'); });
  for (let i = 0; i < 4; i++) { at(t + 0.35 + i * 0.24, () => { dots.textContent += '. '; }); sfx(t + 0.35 + i * 0.24, (w) => snd.tick(w, i % 2)); }
  at(t + 1.4, () => { dots.innerHTML += '<span class="ok">ok</span>'; });
  sfx(t + 1.4, (w) => snd.ping(w));

  // 2. A sentence, underlined by hand: the page is an object with a meaning.
  at(T.page, () => { scene('page'); });
  sfx(T.page, (w) => snd.paper(w, 0.5, 0.8));
  at(T.page + 0.9, () => $('.pg-quote').classList.add('draw'));
  sfx(T.page + 0.9, (w) => snd.pencil(w, 1.8));
  // match cut: the pencil line becomes a red squiggle under code
  at(T.code, () => scene('code'));
  sfx(T.code, (w) => snd.blip(w));
  at(T.code + 0.95, () => $('.sc-code').classList.add('fixed'));
  sfx(T.code + 0.95, (w) => snd.key(w, 1.2));

  // 3. Montage on a clock: half a second per shot, a tick on every cut.
  $$('.shot').forEach((shot, i) => {
    const st = T.mont + i * 0.5;
    at(st, () => { if (i === 0) scene('mont'); $$('.shot').forEach((s) => s.classList.toggle('on', s === shot)); });
    sfx(st, (w) => {
      snd.tick(w, i % 2);
      [() => snd.enter(w), () => snd.typewriter(w), () => snd.pencil(w, 0.3), () => snd.ping(w), () => snd.paper(w, 0.3), () => snd.blip(w), () => snd.key(w, 1.3), () => snd.tick(w + 0.25, 1)][i]();
    });
  });
  // then everything stops: black, silence
  at(T.dark, () => { scene('none'); loadImgs(); });

  // 4. The portrait: the characters of the code find their places.
  const portrait = makePortrait($('.sc-portrait canvas'));
  bed(T.portrait - 0.1, T.drop, (w, off) => snd.drone(w, T.drop - T.portrait + 0.1, off));
  at(T.portrait, () => { scene('portrait'); portrait.assemble(3.2); });
  at(21.5, () => { $('.sc-portrait').classList.add('push'); $('.id-name').classList.add('on'); });
  sfx(21.5, (w) => snd.thud(w));
  $$('.id-line').forEach((l, i) => { at(22.4 + i * 0.6, () => l.classList.add('on')); sfx(22.4 + i * 0.6, (w) => snd.typewriter(w)); });
  // the music comes in under the title and kicks exactly on the second line
  bed(20.2, T.silence, (w, off) => snd.music(w, off, T.silence - 20.2 - off, 0.9, { fadeIn: off ? 0.3 : 0.6 }));
  narrate(24.3, C.narr1, { cps: 24 });
  at(T.drop, () => { narr.innerHTML = `<span>${esc(C.narr1)}</span><span class="l2">${esc(C.narr2)}</span>`; flash(); });

  // 5. The worlds: code turns into a product, products into more products.
  at(27.0, () => { portrait.stop(); narr.innerHTML = ''; scene('worlds'); showW($('.w-code')); });
  at(27.9, () => $('.notif').classList.add('on'));
  sfx(27.9, (w) => snd.ping(w));
  let current = null;
  function showW(w, whip) {
    if (current && whip) { const old = current; old.classList.remove('on', 'whip-in'); old.classList.add('whip-out'); setTimeout(() => old.classList.remove('whip-out'), 260); }
    else if (current) current.classList.remove('on', 'whip-in');
    w.classList.add('on'); if (whip) w.classList.add('whip-in');
    current = w;
  }
  const worlds = $$('.w-world');
  [[28.8, 0, 2.6], [31.4, 1, 2.3], [33.7, 2, 2.2]].forEach(([st, i, d]) => {
    at(st, () => { worlds[i].style.setProperty('--d', `${d}s`); showW(worlds[i], i > 0); });
    if (i > 0) sfx(st - 0.08, (w) => snd.whoosh(w));
  });
  $$('.w-flash').forEach((f, i) => at(35.9 + i * 0.3, () => showW(f)));
  at(38.3, () => showW($('.w-wall')));
  sfx(38.3, (w) => snd.whoosh(w));
  // music stops dead
  at(T.silence, () => { scene('none'); if (current) current.classList.remove('on'); });

  // 6. The desk: pages turning, the book I'm on now, then a projector.
  bed(T.desk, T.end - 0.2, (w, off) => snd.room(w, T.end - 0.2 - T.desk - off, 0.75));
  bed(41.05, 50.6, (w, off) => snd.music(w, 20.6 + off, 50.6 - 41.05 - off, 0.8, { fadeIn: off ? 0.3 : 0.01, fadeOut: 2.5 }));
  at(T.desk, () => scene('desk'));
  const leaves = $$('.leaf');
  let ft = 41.6;
  [0.62, 0.5, 0.4, 0.34, 0.34, 0.42, 0.55].forEach((gap, i) => {
    at(ft, () => leaves[i].classList.add('flipped'));
    sfx(ft, (w) => snd.paper(w, 0.36, 0.7));
    ft += gap;
  });
  at(ft + 0.5, () => $('.pencil-note').classList.add('on'));
  sfx(ft + 0.5, (w) => snd.pencil(w, 0.7));
  bed(45.6, 50.3, (w, off) => snd.projector(w, 50.3 - 45.6 - off));
  at(45.6, () => $('.sc-desk').classList.add('proj'));
  narrate(46.0, C.narr3, { cps: 30 });
  at(48.4, () => { const s = document.createElement('span'); s.className = 'l2'; s.textContent = C.narr4; narr.appendChild(s); });
  at(50.3, () => { $('.sc-desk').classList.remove('proj'); narr.innerHTML = ''; scene('none'); });

  // 7. Back to the window it started in. Same cursor, same place.
  bed(T.end, T.endscreen + 0.5, (w, off) => snd.room(w, T.endscreen + 0.5 - T.end - off, 0.8));
  let e1, e2;
  at(T.end, () => { term.innerHTML = ''; term.style.opacity = '1'; scene('term'); e1 = textLine('', 'title'); });
  t = typeAt(51.6, () => e1, C.end1, 15, { sound: 'type', jitter: 0.25 });
  at(t + 0.8, () => { term.querySelector('.cursor')?.remove(); e2 = textLine('', 'title'); });
  t = typeAt(t + 1.1, () => e2, C.end2, 15, { sound: 'type', jitter: 0.25 });
  sfx(t + 0.15, (w) => snd.ping(w));

  // 8. End screen: enter the site, or keep watching the real demos.
  at(T.endscreen, () => { loadImgs(); scene('endscreen'); requestAnimationFrame(() => $('.sc-endscreen').classList.add('show')); tcEl.style.opacity = '0'; startCountdown(); });

  // ---------------------------------------------------------- end screen
  let cdTimer = 0, cdLeft = 12, cdHold = false;
  function startCountdown() {
    const ring = $('.es-enter .fg'), autoEl = $('.es-auto');
    const total = 12;
    let last = performance.now();
    const step = (n) => {
      if (finished) return;
      if (!cdHold) cdLeft -= (n - last) / 1000;
      last = n;
      ring.style.strokeDashoffset = String(Math.max(0, 1 - cdLeft / total));
      autoEl.textContent = cdHold ? C.autoPaused : C.auto(Math.max(0, Math.ceil(cdLeft)));
      if (cdLeft <= 0) return finish('auto');
      cdTimer = requestAnimationFrame(step);
    };
    cdTimer = requestAnimationFrame(step);
    // hovering or tabbing through the end screen pauses the countdown
    $('.es-enter').focus({ preventScroll: true });
    const es = $('.sc-endscreen');
    es.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') cdHold = true; });
    es.addEventListener('pointerleave', () => { cdHold = false; });
    es.addEventListener('keydown', (e) => { if (e.key === 'Tab') cdHold = true; });
  }

  // ---------------------------------------------------------- the door opens
  function holePath(r) {
    const W = innerWidth, H = innerHeight;
    return `polygon(evenodd, 0 0, ${W}px 0, ${W}px ${H}px, 0 ${H}px, 0 0, ${r.x}px ${r.y}px, ${r.x + r.w}px ${r.y}px, ${r.x + r.w}px ${r.y + r.h}px, ${r.x}px ${r.y + r.h}px, ${r.x}px ${r.y}px)`;
  }
  // The end screen's name becomes the hero's title, when both are on screen
  // and set on one line.
  function morphName() {
    const from = $('.sc-endscreen.show .es-name');
    const to = document.getElementById('hero-title');
    if (!from || !to) return null;
    const a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
    const oneLine = b.height < parseFloat(getComputedStyle(to).fontSize) * 1.3;
    if (!oneLine || b.top < 0 || b.bottom > innerHeight || a.width === 0) return null;
    const clone = from.cloneNode(true);
    clone.className = 'es-name intro-morph';
    Object.assign(clone.style, { left: `${a.left}px`, top: `${a.top}px`, fontSize: getComputedStyle(from).fontSize, lineHeight: getComputedStyle(from).lineHeight });
    document.body.appendChild(clone);
    const s = b.height / a.height;
    to.style.opacity = '0';
    clone.animate([{ transform: 'none' }, { transform: `translate(${b.left - a.left}px, ${b.top - a.top}px) scale(${s})` }], { duration: 1100, easing: 'cubic-bezier(.65,0,.25,1)', fill: 'forwards' });
    return () => { to.style.transition = 'opacity .25s'; to.style.opacity = ''; setTimeout(() => { clone.remove(); to.style.transition = ''; }, 260); };
  }

  async function finish(mode, then) {
    if (finished) return;
    finished = true; running = false;
    cancelAnimationFrame(rafId); cancelAnimationFrame(cdTimer); clearTimeout(autoTimer);
    portrait.stop();
    if (snd) snd.close();
    try { localStorage.setItem('intro-seen', '1'); } catch (_e) {}
    const r0 = frame.getBoundingClientRect();
    const endMorph = mode !== 'skip' ? morphName() : null;
    // the film fades out of the window: through it, the real site, sharp
    win.classList.add('is-clearing');
    veil.style.clipPath = holePath({ x: r0.left, y: r0.top, w: r0.width, h: r0.height });
    await wait(mode === 'skip' ? 220 : 420);
    // then the window grows until it is the whole screen
    frame.classList.add('is-free');
    Object.assign(frame.style, { left: `${r0.left}px`, top: `${r0.top}px`, width: `${r0.width}px`, height: `${r0.height}px` });
    const dur = mode === 'skip' ? 620 : 950;
    const t0 = performance.now();
    const ease = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
    await new Promise((done) => {
      const grow = (n) => {
        const k = Math.min(1, (n - t0) / dur), e = ease(k);
        const r = { x: r0.left * (1 - e), y: r0.top * (1 - e), w: r0.width + (innerWidth - r0.width) * e, h: r0.height + (innerHeight - r0.height) * e };
        Object.assign(frame.style, { left: `${r.x}px`, top: `${r.y}px`, width: `${r.w}px`, height: `${r.h}px`, borderRadius: `${14 * (1 - e)}px`, opacity: String(1 - e * 0.6) });
        veil.style.clipPath = holePath(r);
        veil.style.opacity = String(1 - e);
        if (k < 1) requestAnimationFrame(grow); else done();
      };
      requestAnimationFrame(grow);
    });
    if (endMorph) endMorph();
    cleanup();
    if (then) then();
  }

  function cleanup() {
    document.removeEventListener('visibilitychange', onVis);
    document.removeEventListener('keydown', onKey, true);
    inerted.forEach((n) => n.removeAttribute('inert'));
    el.remove();
    root.classList.remove('intro-on');
    window.dispatchEvent(new Event('intro-state'));
    active = null;
  }

  // ---------------------------------------------------------- controls
  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); finish('skip'); }
    else if (!started && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); start(true); }
  }
  document.addEventListener('keydown', onKey, true);
  win.addEventListener('click', () => { if (!started) start(true); });
  skipBtn.addEventListener('click', () => finish('skip'));
  soundBtn.addEventListener('click', () => {
    soundBtn.classList.remove('is-nudge');
    if (muted || !snd) {
      muted = false; unlockSound(); if (snd) snd.mute(false);
      soundBtn.setAttribute('aria-pressed', 'true'); soundBtn.textContent = C.soundOn;
    } else {
      muted = true; snd.mute(true);
      soundBtn.setAttribute('aria-pressed', 'false'); soundBtn.textContent = C.soundOff;
    }
  });
  $('.es-enter').addEventListener('click', () => finish('enter'));
  $('.es-replay').addEventListener('click', () => finish('skip', () => setTimeout(() => playIntro({ replay: true }), 60)));
  $$('.es-card').forEach((card) => card.addEventListener('click', () => {
    const video = card.dataset.video;
    finish('card', () => { if (typeof window.openProjectVideo === 'function') window.openProjectVideo(video); });
  }));

  active = { finish };
}
