// The intro: a one-minute animated short that opens the portfolio. It is code,
// not a video file, so the window it plays in can turn into the real site at
// the end. The shots (intro/film/*.webp) are painted by
// scripts/intro-film/painter.html: the places are drawn in canvas and "me" is
// a 2D illustration generated from my photo. Each shot is two layers, so the
// camera can move them at different speeds (parallax); weather, light and
// cuts on the music do the rest. The music is "You and Everyone" by Portrayal
// (CC BY 4.0), edited so it never drops out; every other sound is synthesized.
//
// One clock drives everything: visual cues fire on time, sound cues fire a
// little early and are scheduled on the AudioContext clock. Continuous sounds
// are "beds" that can also start mid-way, when someone turns the sound on late.

const F = '/intro/film/';
const A = '/project-assets/';
const TOTAL = 58.3;

// my age, so the film never goes stale (born 4 Oct 2006)
const AGE = (() => {
  const d = new Date();
  const before = d.getMonth() < 9 || (d.getMonth() === 9 && d.getDate() < 4);
  return Math.max(20, d.getFullYear() - 2006 - (before ? 1 : 0));
})();

const COPY = {
  es: {
    aria: 'Intro: un minuto sobre Ignacio',
    pre: 'Una historia de un minuto.', start: '▶ Ver con sonido', startKey: 'Enter',
    skip: 'Saltar intro →', soundOn: '♪ Sonido: sí', soundOff: '♪ Sonido: no',
    lines: [
      [0.7, 'Buenos Aires.'],
      [3.0, `Me llamo Ignacio. Tengo ${AGE} años.`],
      [6.2, 'Desde 2024 trabajo en operaciones:'],
      [8.1, 'caja, inventario, auditorías.'],
      [10.2, 'Y todos los días veía lo mismo: *tareas repetidas, a mano.*'],
      [13.4, 'Así que empecé a construir herramientas para dejar de hacerlas.'],
      [15.1, '*Bots.*', 'big'],
      [17.05, '*Automatizaciones.*', 'big'],
      [18.9, '*Apps que hoy están online.*', 'big'],
      [21.0, 'De día estudio Gestión de TI en UADE.'],
      [23.6, 'De noche, sigo construyendo.'],
      [26.7, 'Pero en el camino entendí algo:'],
      [28.6, 'saber de tecnología *no alcanza.*'],
      [32.3, 'Lo importante es *entender a las personas.*'],
      [34.6, 'Por eso me apasiona leer…'],
      [37.95, '…y el cine.'],
      [39.7, 'Cada historia me enseña a escuchar lo que alguien necesita,'],
      [42.0, '*aunque no lo diga.*'],
      [43.7, 'Todavía estoy empezando.'],
      [46.2, 'Pero ya estoy *construyendo.*'],
      [49.4, '¿Construimos algo *juntos?*', 'big']
    ],
    sub: 'Busco pasantía o rol trainee. Buenos Aires o remoto.',
    enter: 'Entrar a la web', auto: (s) => `entrás solo en ${s}s`, autoPaused: 'en pausa',
    videos: 'Ver demos',
    credit: '♪ “You and Everyone”, Portrayal (<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>) · personaje generado a partir de mi foto, escenas dibujadas en código'
  },
  en: {
    aria: 'Intro: a minute about Ignacio',
    pre: 'A one-minute story.', start: '▶ Watch with sound', startKey: 'Enter',
    skip: 'Skip intro →', soundOn: '♪ Sound: on', soundOff: '♪ Sound: off',
    lines: [
      [0.7, 'Buenos Aires.'],
      [3.0, `My name is Ignacio. I’m ${AGE}.`],
      [6.2, 'Since 2024 I’ve worked in operations:'],
      [8.1, 'cash, inventory, audits.'],
      [10.2, 'And every day I saw the same thing: *repetitive tasks, done by hand.*'],
      [13.4, 'So I started building tools to stop doing them.'],
      [15.1, '*Bots.*', 'big'],
      [17.05, '*Automations.*', 'big'],
      [18.9, '*Apps that are live today.*', 'big'],
      [21.0, 'By day I study IT Management at UADE.'],
      [23.6, 'By night, I keep building.'],
      [26.7, 'But along the way I learned something:'],
      [28.6, 'knowing technology *isn’t enough.*'],
      [32.3, 'What matters is *understanding people.*'],
      [34.6, 'That’s why I love reading…'],
      [37.95, '…and film.'],
      [39.7, 'Every story teaches me to hear what someone needs,'],
      [42.0, '*even when they don’t say it.*'],
      [43.7, 'I’m still starting out.'],
      [46.2, 'But I’m already *building.*'],
      [49.4, 'Shall we build something *together?*', 'big']
    ],
    sub: 'Looking for an internship or trainee role. Buenos Aires or remote.',
    enter: 'Enter the site', auto: (s) => `opening in ${s}s`, autoPaused: 'paused',
    videos: 'Watch demos',
    credit: '♪ “You and Everyone”, Portrayal (<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>) · character generated from my photo, scenes drawn in code'
  }
};

// The shots. t = when it starts; o = where the camera looks (% of the frame);
// s = zoom from → to; d = drift from → to (% of the frame); fg = there is a
// cut-out of me that moves a bit more than the background (parallax);
// fx = particles; m = focal point for the tall (phone) window.
const SHOTS = [
  { id: 'city', t: 0, o: [38, 52], s: [1.06, 1.42], d: [0, 0, 3, 1.5], fx: 'stars', m: 38, fade: 0 },
  { id: 'shop', t: 5.65, o: [50, 45], s: [1.16, 1.04], d: [-2, 0, 1.5, 0], fg: 1, m: 50 },
  { id: 'desk', t: 13.2, o: [48, 45], s: [1.04, 1.2], d: [0, 0, -1, -1], fg: 1, fx: 'glow', m: 50, fade: 0 },
  { id: 'street', t: 20.75, o: [30, 50], s: [1.06, 1.06], d: [4, 0, -4, 0], fg: 1, walk: 1, m: 32, fade: 0 },
  { id: 'rain', t: 26.4, o: [45, 40], s: [1.18, 1.05], d: [0, 0, 1.5, 0], fg: 1, fx: 'rain', m: 44 },
  { id: 'read', t: 32.05, o: [50, 45], s: [1.02, 1.16], d: [0, 0, 0, -1], fg: 1, fx: 'dust', m: 50 },
  { id: 'cinema', t: 37.75, o: [50, 40], s: [1.16, 1.04], d: [-1.5, 0, 1.5, 0], fg: 1, fx: 'beam', m: 50 },
  { id: 'roof', t: 43.4, o: [70, 45], s: [1.2, 1.04], d: [0, 2, 0, 0], fg: 1, fx: 'sun', m: 68 },
  { id: 'face', t: 49.1, o: [50, 40], s: [1.02, 1.1], d: [0, 0, 0, 0], fg: 1, m: 50 }
];
const T_TITLE = 52.85, T_END = 54.2;
// the three projects that pop out of the laptop on "Bots / Automations / Apps"
const MONTAGE = [[15.1, 'job-bot.webp'], [17.05, 'agents-system.webp'], [18.9, 'comidadebarrio.webp']];

const VIDEOS = [
  ['JobBot', 'job-bot.webp', 'jobbot-demo.mp4', '0:40'],
  ['Darter', 'darter.webp', 'darter-demo.mp4', '0:50'],
  ['Agents System', 'agents-system.webp', 'agents-system-demo.mp4', '0:51'],
  ['Motor Estadístico', 'prode-mundial-2026.webp', 'prode-demo.mp4', '0:33'],
  ['FulboTracker', 'futtracker.webp', 'fulbotracker-demo.mp4', '0:32']
];

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const rand = (a, b) => a + Math.random() * (b - a);
const ease = (k) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);

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
  gain(v = 0) { const g = this.ctx.createGain(); g.gain.value = v; return g; }
  filter(type, f, q = 1) { const x = this.ctx.createBiquadFilter(); x.type = type; x.frequency.value = f; x.Q.value = q; return x; }
  env(g, when, peak, attack, decay) {
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(peak, when + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, when + attack + decay);
  }
  burst(when, { f = 2400, q = 1, peak = 0.3, decay = 0.04, type = 'bandpass' } = {}) {
    const s = this.ctx.createBufferSource(); s.buffer = this.noise;
    const x = this.filter(type, f, q), g = this.gain();
    s.connect(x).connect(g).connect(this.master);
    this.env(g, when, peak, 0.002, decay);
    s.start(when, Math.random()); s.stop(when + decay + 0.05);
  }
  tone(when, { type = 'sine', f = 440, to, peak = 0.1, attack = 0.005, decay = 0.3 } = {}) {
    const o = this.ctx.createOscillator(), g = this.gain();
    o.type = type; o.frequency.value = f;
    if (to) o.frequency.exponentialRampToValueAtTime(to, when + attack + decay);
    o.connect(g).connect(this.master);
    this.env(g, when, peak, attack, decay);
    o.start(when); o.stop(when + attack + decay + 0.05);
  }
  key(when) { this.burst(when, { f: rand(2600, 4200), q: 3, peak: rand(0.03, 0.06), decay: 0.018 }); }
  step(when) { this.burst(when, { f: 180, q: 0.8, peak: 0.09, decay: 0.07, type: 'lowpass' }); this.burst(when + 0.01, { f: 2200, q: 2, peak: 0.02, decay: 0.03 }); }
  page(when) {
    const s = this.ctx.createBufferSource(); s.buffer = this.noise;
    const x = this.filter('bandpass', 1800, 0.7), g = this.gain();
    x.frequency.setValueAtTime(900, when); x.frequency.exponentialRampToValueAtTime(4200, when + 0.35);
    s.connect(x).connect(g).connect(this.master);
    this.env(g, when, 0.07, 0.12, 0.3);
    s.start(when, Math.random()); s.stop(when + 0.5);
  }
  whoosh(when, dur = 0.5, peak = 0.08) {
    const s = this.ctx.createBufferSource(); s.buffer = this.noise;
    const x = this.filter('bandpass', 300, 1.1), g = this.gain();
    x.frequency.setValueAtTime(300, when); x.frequency.exponentialRampToValueAtTime(2600, when + dur);
    s.connect(x).connect(g).connect(this.master);
    this.env(g, when, peak, dur * 0.6, dur * 0.4);
    s.start(when, Math.random()); s.stop(when + dur + 0.05);
  }
  chirp(when) { const f = rand(2800, 4200); this.tone(when, { f, to: f * 1.35, peak: 0.018, decay: 0.07 }); this.tone(when + 0.1, { f: f * 1.1, to: f * 1.5, peak: 0.014, decay: 0.06 }); }
  shimmer(when) { [1318.5, 1975.5, 2637].forEach((f, i) => this.tone(when + i * 0.07, { f, peak: 0.025, attack: 0.02, decay: 1.4 })); }
  // a looping noise texture with a fade in/out: city, shop hum, rain, projector…
  ambience(when, off, dur, kind) {
    if (dur <= 0.1) return;
    const out = this.gain(0);
    out.connect(this.master);
    const layer = (type, f, q, v, lfo) => {
      const s = this.ctx.createBufferSource(); s.buffer = this.noise; s.loop = true;
      const x = this.filter(type, f, q), g = this.gain(v);
      s.connect(x).connect(g).connect(out);
      if (lfo) { const o = this.ctx.createOscillator(), lg = this.gain(v * lfo[1]); o.frequency.value = lfo[0]; o.connect(lg).connect(g.gain); o.start(when); o.stop(when + dur + 0.1); }
      s.start(when, Math.random()); s.stop(when + dur + 0.1);
    };
    const hum = (f, v) => { const o = this.ctx.createOscillator(), g = this.gain(v); o.frequency.value = f; o.connect(g).connect(out); o.start(when); o.stop(when + dur + 0.1); };
    if (kind === 'city') { layer('lowpass', 420, 0.7, 0.5); layer('bandpass', 1100, 0.6, 0.12, [0.13, 0.8]); }
    if (kind === 'shop') { layer('lowpass', 260, 0.7, 0.35); hum(100, 0.05); hum(200, 0.02); }
    if (kind === 'room') { layer('lowpass', 220, 0.7, 0.25); }
    if (kind === 'street') { layer('bandpass', 700, 0.5, 0.45, [0.2, 0.5]); layer('highpass', 5000, 0.7, 0.04); }
    if (kind === 'rain') { layer('highpass', 1400, 0.6, 0.5); layer('lowpass', 500, 0.7, 0.35); }
    if (kind === 'rainsoft') { layer('highpass', 1800, 0.6, 0.18); layer('lowpass', 400, 0.7, 0.12); }
    if (kind === 'projector') { layer('bandpass', 2200, 1.2, 0.18, [24, 0.9]); layer('lowpass', 180, 0.7, 0.2); }
    if (kind === 'wind') { layer('lowpass', 520, 0.8, 0.4, [0.25, 0.7]); }
    const peak = { city: 0.14, shop: 0.12, room: 0.08, street: 0.12, rain: 0.13, rainsoft: 0.1, projector: 0.09, wind: 0.1 }[kind] || 0.1;
    const fin = off > 0 ? 0.3 : 0.8, fout = 0.7;
    out.gain.setValueAtTime(0, when);
    out.gain.linearRampToValueAtTime(peak, when + fin);
    out.gain.setValueAtTime(peak, when + Math.max(fin, dur - fout));
    out.gain.linearRampToValueAtTime(0, when + dur);
  }
  music(when, offset, dur) {
    if (!this.score || dur <= 0.05) return;
    const s = this.ctx.createBufferSource(); s.buffer = this.score;
    const g = this.gain(0);
    s.connect(g).connect(this.master);
    g.gain.setValueAtTime(0, when); g.gain.linearRampToValueAtTime(0.9, when + (offset ? 0.4 : 0.02));
    s.start(when, offset, dur);
  }
  mute(on) { this.master.gain.setTargetAtTime(on ? 0 : 1, this.ctx.currentTime, 0.08); }
  close() { this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.12); setTimeout(() => this.ctx.close().catch(() => {}), 800); }
}

function grainTile() {
  const c = document.createElement('canvas');
  c.width = c.height = 160;
  const g = c.getContext('2d'), img = g.createImageData(160, 160);
  for (let i = 0; i < img.data.length; i += 4) { const v = Math.random() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
  g.putImageData(img, 0, 0);
  return c.toDataURL('image/png');
}

// '*x y*' marks the words that get the accent
function words(line) {
  let acc = false, i = 0;
  return line.split(' ').map((w) => {
    const open = w.startsWith('*'), close = w.endsWith('*');
    if (open) acc = true;
    const txt = w.replace(/\*/g, '');
    const span = `<span class="w${acc ? ' acc' : ''}" style="--i:${i++}">${esc(txt)}</span>`;
    if (close) acc = false;
    return span;
  }).join(' ');
}

// ---------------------------------------------------------------- particles
// One canvas over the scene: stars that twinkle, rain, dust in a lamp or a
// projector beam, light on a sunrise. Cheap, and off on low-end devices.
class Particles {
  constructor(canvas) { this.c = canvas; this.g = canvas.getContext('2d'); this.mode = ''; this.p = []; }
  size() {
    const r = this.c.getBoundingClientRect(), k = Math.min(2, window.devicePixelRatio || 1);
    this.w = r.width; this.h = r.height;
    this.c.width = Math.round(r.width * k); this.c.height = Math.round(r.height * k);
    this.g.setTransform(k, 0, 0, k, 0, 0);
  }
  set(mode) {
    this.mode = mode; this.p = [];
    const { w, h } = this, n = { stars: 70, rain: 170, dust: 60, beam: 90, sun: 40, glow: 0 }[mode] || 0;
    for (let i = 0; i < n; i++) this.p.push({ x: rand(0, w), y: rand(0, h), z: rand(0.3, 1), a: rand(0, 6.28), v: rand(0.5, 1.5) });
  }
  draw(dt) {
    const { g, w, h } = this;
    g.clearRect(0, 0, w, h);
    const m = this.mode;
    if (m === 'stars') {
      for (const p of this.p) {
        if (p.y > h * 0.42) continue;
        p.a += dt * p.v * 2;
        g.fillStyle = `rgba(255,244,220,${0.25 + 0.35 * (0.5 + 0.5 * Math.sin(p.a)) * p.z})`;
        g.fillRect(p.x, p.y, 1.4 * p.z, 1.4 * p.z);
      }
    } else if (m === 'rain') {
      g.strokeStyle = 'rgba(200,215,235,.32)'; g.lineWidth = 1;
      g.beginPath();
      for (const p of this.p) {
        p.y += dt * h * 1.6 * p.v * p.z; p.x -= dt * 40 * p.z;
        if (p.y > h) { p.y = -20; p.x = rand(0, w * 1.1); }
        g.moveTo(p.x, p.y); g.lineTo(p.x - 3 * p.z, p.y + 16 * p.z);
      }
      g.stroke();
    } else if (m === 'dust' || m === 'beam') {
      const warm = m === 'dust';
      for (const p of this.p) {
        p.a += dt * 0.4 * p.v;
        p.x += Math.cos(p.a) * dt * 8 + dt * 4; p.y += Math.sin(p.a * 0.7) * dt * 6 - dt * 3;
        if (p.x > w) p.x = 0; if (p.y < 0) p.y = h;
        const alpha = 0.18 + 0.4 * p.z * (0.5 + 0.5 * Math.sin(p.a * 3));
        g.fillStyle = warm ? `rgba(255,214,150,${alpha})` : `rgba(230,236,255,${alpha})`;
        g.beginPath(); g.arc(p.x, p.y, 1.3 * p.z + 0.3, 0, 6.28); g.fill();
      }
    } else if (m === 'sun') {
      for (const p of this.p) {
        p.y -= dt * 10 * p.v; p.a += dt;
        if (p.y < 0) { p.y = h; p.x = rand(0, w); }
        g.fillStyle = `rgba(255,220,160,${0.12 + 0.25 * p.z * (0.5 + 0.5 * Math.sin(p.a))})`;
        g.beginPath(); g.arc(p.x, p.y, 1.6 * p.z, 0, 6.28); g.fill();
      }
    }
  }
}

// ---------------------------------------------------------------- film
let active = null;

export function playIntro({ replay = false } = {}) {
  if (active) return;
  const lang = document.documentElement.lang === 'en' ? 'en' : 'es';
  const C = COPY[lang];
  const root = document.documentElement;
  const lite = !!document.querySelector('.cine-hero.is-lite');
  if (replay) window.scrollTo(0, 0);

  if (!document.querySelector('link[href="/intro/intro.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = '/intro/intro.css';
    document.head.appendChild(link);
  }

  const shotHTML = (s) => `<div class="shot" data-id="${s.id}" style="--m:${s.m}%">
      <div class="cam"><img alt="" class="bg" data-src="${F}${s.id}${s.fg ? '-bg' : ''}.webp">${s.fg ? `<img alt="" class="fg${s.walk ? ' walk' : ''}" data-src="${F}${s.id}-fg.webp">` : ''}</div>
    </div>`;

  const el = document.createElement('div');
  el.className = `intro${lite ? ' is-lite' : ''}`;
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-label', C.aria);
  el.innerHTML = `
    <div class="intro-veil"></div>
    <div class="intro-frame">
      <div class="intro-win is-waiting" tabindex="-1">
        <div class="film">
          ${SHOTS.map(shotHTML).join('')}
          <div class="montage">${MONTAGE.map(([, img]) => `<div class="mshot"><img alt="" data-src="${A}${img}"></div>`).join('')}</div>
          <canvas class="fx" aria-hidden="true"></canvas>
          <div class="glow" aria-hidden="true"></div>
          <div class="scrim"></div>
          <p class="cap" aria-live="polite"></p>
          <div class="title"><span>Ignacio Palmeri</span></div>
        </div>
        <div class="pre"><p>${esc(C.pre)}</p><button type="button" class="pre-start">${esc(C.start)} <kbd>${esc(C.startKey)}</kbd></button></div>
        <div class="end">
          <h2 class="es-name">Ignacio Palmeri</h2>
          <p class="es-sub">${esc(C.sub)}</p>
          <div class="es-row">
            <button type="button" class="es-enter"><svg viewBox="0 0 36 36" aria-hidden="true"><circle class="bg" cx="18" cy="18" r="15"/><circle class="fg" cx="18" cy="18" r="15" pathLength="1"/><path d="M15 12.5l7 5.5-7 5.5z" fill="#fff"/></svg>${esc(C.enter)}</button>
            <span class="es-auto" aria-live="off"></span>
          </div>
          <div class="es-videos" aria-label="${esc(C.videos)}"><span class="es-label">${esc(C.videos)}</span>${VIDEOS.map(([n, img, v, d]) => `<button type="button" class="es-card" data-video="/project-assets/video/${v}"><div class="es-thumb"><img alt="" data-src="${A}${img}"><span>▶ ${d}</span></div><b>${esc(n)}</b></button>`).join('')}</div>
          <p class="es-foot">${C.credit}</p>
        </div>
        <div class="bars" aria-hidden="true"></div>
        <div class="grain" aria-hidden="true"></div>
      </div>
    </div>
    <div class="intro-top">
      <button type="button" class="intro-sound" aria-pressed="true">${esc(C.soundOn)}</button>
      <button type="button" class="intro-skip">${esc(C.skip)}</button>
    </div>`;

  const $ = (s) => el.querySelector(s);
  const $$ = (s) => [...el.querySelectorAll(s)];
  const win = $('.intro-win'), frame = $('.intro-frame'), veil = $('.intro-veil');
  const cap = $('.cap'), soundBtn = $('.intro-sound'), skipBtn = $('.intro-skip');
  const shots = $$('.shot'), mshots = $$('.mshot');
  $('.grain').style.backgroundImage = `url(${grainTile()})`;
  const load = (img) => { if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); } return img; };
  // the first shots right away (the pre-roll sits on the first one), the rest after
  shots.slice(0, 3).forEach((s) => s.querySelectorAll('img').forEach(load));
  const loadAll = () => $$('img[data-src]').forEach(load);
  setTimeout(loadAll, 600);

  const inerted = [...document.body.children].filter((n) => n !== el && !n.hasAttribute('inert') && n.tagName !== 'SCRIPT');
  inerted.forEach((n) => n.setAttribute('inert', ''));
  document.body.appendChild(el);
  root.classList.add('intro-on');
  root.classList.remove('intro-pending');
  window.dispatchEvent(new Event('intro-state'));
  window.__introReady = true;

  const fx = lite ? null : new Particles($('.fx'));
  if (fx) fx.size();
  const onResize = () => { if (fx) { fx.size(); fx.set(fx.mode); } };
  window.addEventListener('resize', onResize);

  // ---------------------------------------------------------- clock + cues
  let base = 0, startedAt = null, rafId = 0, running = false, finished = false, lastFrame = 0;
  const now = () => (startedAt === null ? base : base + (performance.now() - startedAt) / 1000);
  const vis = [], aud = [], beds = [];
  let vi = 0, ai = 0;
  const at = (t, fn) => vis.push({ t, fn });
  const sfx = (t, fn) => aud.push({ t, fn });
  const bed = (from, to, start) => { beds.push({ from, to, start }); sfx(from, (w) => start(w, 0)); };
  let snd = null, muted = false;
  const audible = () => snd && snd.running;
  const whenFor = (t) => snd.ctx.currentTime + Math.max(0, t - now());

  // the camera: every frame, the visible shot gets its zoom/drift for "now"
  let cur = -1;
  function camera(t) {
    let i = SHOTS.length - 1;
    while (i > 0 && SHOTS[i].t > t) i--;
    if (i !== cur) cut(i);
    for (const k of [i - 1, i]) {
      if (k < 0) continue;
      const s = SHOTS[k], node = shots[k];
      const end = SHOTS[k + 1] ? SHOTS[k + 1].t + 0.8 : T_END + 1;
      const p = Math.min(1, Math.max(0, (t - s.t) / (end - s.t)));
      const e = ease(p);
      const sc = s.s[0] + (s.s[1] - s.s[0]) * e;
      const dx = s.d[0] + (s.d[2] - s.d[0]) * e, dy = s.d[1] + (s.d[3] - s.d[1]) * e;
      const cam = node.firstElementChild;
      cam.style.transform = `translate(${dx}%, ${dy}%) scale(${sc})`;
      const fg = cam.querySelector('.fg');
      if (fg) fg.style.transform = `translate(${dx * 0.5}%, ${dy * 0.5}%) scale(${1 + (sc - 1) * 0.35})`;
    }
  }
  function cut(i) {
    const s = SHOTS[i];
    shots.forEach((n, k) => {
      n.classList.toggle('on', k === i);
      n.classList.toggle('prev', k === i - 1);
      n.style.transitionDuration = k === i ? `${s.fade ?? 0.6}s` : '';
    });
    shots[i].firstElementChild.style.transformOrigin = `${s.o[0]}% ${s.o[1]}%`;
    win.dataset.shot = s.id;
    if (fx) fx.set(s.fx || '');
    cur = i;
  }

  function loop(ts) {
    if (!running) return;
    const t = now();
    const dt = Math.min(0.05, (ts - (lastFrame || ts)) / 1000); lastFrame = ts;
    while (vi < vis.length && vis[vi].t <= t) vis[vi++].fn(t);
    while (ai < aud.length && aud[ai].t <= t + 0.08) { const c = aud[ai++]; if (audible()) c.fn(whenFor(c.t)); }
    if (t < T_END + 1) camera(t);
    if (fx && t < T_TITLE) fx.draw(dt);
    rafId = requestAnimationFrame(loop);
  }
  function pause() { if (startedAt === null) return; base = now(); startedAt = null; if (snd) snd.ctx.suspend().catch(() => {}); }
  function resume() { if (startedAt !== null || !running) return; startedAt = performance.now(); lastFrame = 0; if (snd && !muted) snd.ctx.resume().catch(() => {}); }
  const onVis = () => (document.visibilityState === 'hidden' ? pause() : resume());
  document.addEventListener('visibilitychange', onVis);

  const scoreBytes = fetch('/intro/score.m4a').then((r) => (r.ok ? r.arrayBuffer() : null)).catch(() => null);
  function unlockSound() {
    if (snd) { if (!muted) snd.ctx.resume().catch(() => {}); return; }
    try { snd = new Sound(); } catch (_e) { return; }
    const late = running;
    // ambience can start right away; the music joins in time once decoded
    if (late) { const t = now(); beds.forEach((bd) => { if (!bd.music && bd.from <= t && t < bd.to - 0.3) bd.start(snd.ctx.currentTime + 0.02, t - bd.from); }); }
    scoreBytes.then((buf) => buf && snd.ctx.decodeAudioData(buf.slice(0)).then((dec) => {
      snd.score = dec;
      const t = now();
      if (running && t > 0.05) snd.music(snd.ctx.currentTime + 0.02, t, TOTAL - t);
    })).catch(() => {});
  }

  // ---------------------------------------------------------- pre-roll
  // The first shot, dimmed, and one line. The film waits for a click so it can
  // play with sound; if nobody moves, it starts silent after a few seconds.
  let started = false;
  shots[0].classList.add('on');
  setTimeout(() => $('.pre')?.classList.add('on'), 250);
  const autoTimer = setTimeout(() => start(false), 9000);
  win.focus({ preventScroll: true });

  async function start(withSound) {
    if (started || finished) return;
    started = true; clearTimeout(autoTimer);
    win.classList.remove('is-waiting');
    $('.pre').classList.add('out');
    setTimeout(() => $('.pre')?.remove(), 700);
    if (withSound) unlockSound();
    else { soundBtn.setAttribute('aria-pressed', 'false'); soundBtn.textContent = C.soundOff; soundBtn.classList.add('is-nudge'); muted = true; }
    // don't start on a blank frame
    const first = shots.slice(0, 2).flatMap((s) => [...s.querySelectorAll('img')]).map(load);
    await Promise.race([Promise.all(first.map((i) => i.decode().catch(() => {}))), wait(1500)]);
    if (finished) return;
    vis.sort((x, y) => x.t - y.t); aud.sort((x, y) => x.t - y.t);
    // ?introAt=40 starts the film at 40 s (for checking a scene; no sound cues before it)
    const seek = Math.min(T_END, Number(new URLSearchParams(location.search).get('introAt')) || 0);
    while (ai < aud.length && aud[ai].t < seek) ai++;
    running = true; base = seek; startedAt = performance.now();
    win.classList.add('is-playing');
    rafId = requestAnimationFrame(loop);
  }

  // ---------------------------------------------------------- timeline
  const music = { from: 0, to: TOTAL, music: true, start: (w, off) => snd.music(w, off, TOTAL - off) };
  beds.push(music); sfx(0, (w) => music.start(w, 0));
  const amb = (from, to, kind) => bed(from, to, (w, off) => snd.ambience(w, off, to - from - off, kind));
  amb(0, 6.1, 'city');
  amb(5.4, 13.6, 'shop');
  amb(13.0, 21.1, 'room');
  amb(20.5, 26.8, 'street');
  amb(26.2, 32.4, 'rain');
  amb(31.8, 38.1, 'rainsoft');
  amb(37.5, 43.8, 'projector');
  amb(43.2, 53.2, 'wind');

  // narration: one line at a time, words ease in
  C.lines.forEach(([t, line, kind], i) => {
    const next = C.lines[i + 1] ? C.lines[i + 1][0] : T_TITLE;
    at(t, () => {
      cap.className = `cap${kind ? ` ${kind}` : ''}`;
      cap.innerHTML = words(line);
      void cap.offsetWidth; cap.classList.add('on');
    });
    if (next - t > 3.4) at(next - 0.5, () => cap.classList.remove('on'));
  });
  at(T_TITLE - 0.4, () => cap.classList.remove('on'));

  // the shop: the register ticks now and then
  [6.8, 8.9, 11.4].forEach((t) => sfx(t, (w) => { snd.key(w); snd.key(w + 0.09); }));
  // the desk: typing, then the projects pop out of the laptop on each chord
  for (let t = 13.4; t < 20.4; t += rand(0.07, 0.22)) if (t % 1.9 > 0.4) sfx(t, (w) => snd.key(w));
  MONTAGE.forEach(([t], i) => {
    at(t, () => { mshots.forEach((m, k) => m.classList.toggle('on', k === i)); });
    sfx(t, (w) => snd.whoosh(w, 0.4, 0.06));
  });
  at(20.5, () => mshots.forEach((m) => m.classList.remove('on')));
  // the street: footsteps with the walk
  for (let t = 20.9; t < 26.3; t += 0.52) sfx(t, (w) => snd.step(w));
  // reading: pages turn
  [32.9, 35.9].forEach((t) => sfx(t, (w) => snd.page(w)));
  // sunrise: birds
  [44.0, 45.1, 46.9, 48.2, 50.3].forEach((t) => sfx(t, (w) => snd.chirp(w)));
  // the question, the title, the end card
  sfx(49.3, (w) => snd.shimmer(w));
  at(T_TITLE, () => { win.classList.add('is-title'); loadAll(); });
  sfx(T_TITLE, (w) => snd.whoosh(w, 0.8, 0.05));
  at(T_END, () => { win.classList.add('is-end'); $('.end').classList.add('on'); startCountdown(); });

  // ---------------------------------------------------------- end card
  let cdTimer = 0, cdLeft = 14, cdHold = false;
  function startCountdown() {
    const ring = $('.es-enter .fg'), autoEl = $('.es-auto');
    const total = 14;
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
    $('.es-enter').focus({ preventScroll: true });
    const end = $('.end');
    end.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') cdHold = true; });
    end.addEventListener('pointerleave', () => { cdHold = false; });
    end.addEventListener('keydown', (e) => { if (e.key === 'Tab') cdHold = true; });
  }

  // ---------------------------------------------------------- the door opens
  function holePath(r) {
    const W = innerWidth, H = innerHeight;
    return `polygon(evenodd, 0 0, ${W}px 0, ${W}px ${H}px, 0 ${H}px, 0 0, ${r.x}px ${r.y}px, ${r.x + r.w}px ${r.y}px, ${r.x + r.w}px ${r.y + r.h}px, ${r.x}px ${r.y + r.h}px, ${r.x}px ${r.y}px)`;
  }
  // The end card's name becomes the hero's title when both are on screen and
  // the hero sets it on one line.
  function morphName() {
    const from = $('.end.on .es-name');
    const to = document.getElementById('hero-title');
    if (!from || !to) return null;
    const a = from.getBoundingClientRect(), bb = to.getBoundingClientRect();
    const oneLine = bb.height < parseFloat(getComputedStyle(to).fontSize) * 1.3;
    if (!oneLine || bb.top < 0 || bb.bottom > innerHeight || a.width === 0) return null;
    const clone = from.cloneNode(true);
    clone.className = 'es-name intro-morph';
    Object.assign(clone.style, { left: `${a.left}px`, top: `${a.top}px`, fontSize: getComputedStyle(from).fontSize, lineHeight: getComputedStyle(from).lineHeight });
    document.body.appendChild(clone);
    to.style.opacity = '0';
    clone.animate([{ transform: 'none', color: getComputedStyle(from).color }, { transform: `translate(${bb.left - a.left}px, ${bb.top - a.top}px) scale(${bb.height / a.height})`, color: getComputedStyle(to).color }], { duration: 1100, easing: 'cubic-bezier(.65,0,.25,1)', fill: 'forwards' });
    return () => { to.style.transition = 'opacity .25s'; to.style.opacity = ''; setTimeout(() => { clone.remove(); to.style.transition = ''; }, 260); };
  }

  async function finish(mode, then) {
    if (finished) return;
    finished = true; running = false;
    cancelAnimationFrame(rafId); cancelAnimationFrame(cdTimer); clearTimeout(autoTimer);
    if (snd) snd.close();
    try { localStorage.setItem('intro-seen', '1'); } catch (_e) {}
    const r0 = frame.getBoundingClientRect();
    const endMorph = mode !== 'skip' ? morphName() : null;
    win.classList.add('is-clearing');
    veil.style.clipPath = holePath({ x: r0.left, y: r0.top, w: r0.width, h: r0.height });
    await wait(mode === 'skip' ? 220 : 420);
    frame.classList.add('is-free');
    Object.assign(frame.style, { left: `${r0.left}px`, top: `${r0.top}px`, width: `${r0.width}px`, height: `${r0.height}px` });
    const dur = mode === 'skip' ? 620 : 950;
    const t0 = performance.now();
    const cubic = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
    await new Promise((done) => {
      const grow = (n) => {
        const k = Math.min(1, (n - t0) / dur), e = cubic(k);
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
    window.removeEventListener('resize', onResize);
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
  $$('.es-card').forEach((card) => card.addEventListener('click', () => {
    const video = card.dataset.video;
    finish('card', () => { if (typeof window.openProjectVideo === 'function') window.openProjectVideo(video); });
  }));

  active = { finish };
}
