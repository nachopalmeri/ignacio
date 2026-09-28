// The intro film: ~45 seconds that open the portfolio. It is code, not a video
// file, so the window it plays in can turn into the real site at the end.
// The avatar (intro/avatar/*.webp) was generated from my photo; the music is
// "Jangle" by Blank & Kytt (CC BY 3.0), cut to start on the downbeat at 142.2
// BPM, so cues are written in beats. Every other sound is synthesized here.
//
// One clock drives everything: visual cues fire on time, sound cues fire a
// little early and are scheduled on the AudioContext clock so they land on
// the beat. Continuous sounds are "beds" that can also start mid-way, when
// someone turns the sound on late.

const BEAT = 60 / 142.2;
const b = (n) => n * BEAT;
const A = '/project-assets/';
const AV = '/intro/avatar/';
const FACES = ['neutral', 'smile', 'wink', 'surprised', 'side', 'talk', 'blink'];

const COPY = {
  es: {
    aria: 'Intro: un minuto sobre Ignacio',
    pre: 'Dame un minuto.', start: '▶ Empezar', startKey: 'Enter · con sonido',
    skip: 'Saltar intro →', soundOn: '♪ Sonido: sí', soundOff: '♪ Sonido: no',
    ch: ['// 00 — antes', '// 01 — hola', '// 02 — quién', '// 03 — proyectos', '// 04 — jobbot', '// 05 — cómo', '// 06 — fuera del código', '// 07 — fin'],
    psst: 'psst',
    hook: [['¿Tenés'], ['un', '*minuto?*']],
    soy: [['Soy'], ['Nacho.']],
    who: [['19 años.'], ['Buenos Aires.']],
    chips: ['Gestión de TI · UADE', 'Busco pasantía o trainee'],
    build: [['Y construyo'], ['*cosas.*']],
    cards: [['JobBot', 'job-bot.webp', 'online'], ['Darter', 'darter.webp', 'privado'], ['Agents System', 'agents-system.webp', 'local'], ['Motor Estadístico', 'prode-mundial-2026.webp', 'online'], ['FulboTracker', 'futtracker.webp', 'online'], ['Comida de Barrio', 'comidadebarrio.webp', 'online']],
    jobbot: [['JobBot'], ['*busca trabajo*'], ['por vos.']],
    jobbotSub: 'SaaS · Next.js · FastAPI · PostgreSQL · Telegram',
    phoneTop: ['Hola, María', 'buscando: Frontend · remoto'],
    jobs: [['92%', 'Frontend Developer', 'Remoto · USD'], ['87%', 'Full Stack Engineer', 'Híbrido'], ['78%', 'React Developer', 'Remoto']],
    notif: ['<b>JobBot</b>', 'Nueva oferta · <em>92% match</em>'],
    tiles: { stack: '// stack', air: '// on air', pay: '// pagos', tests: '// tests', live: '// online', payTxt: 'Stripe y MercadoPago, confirmados por webhook.', testsTxt: 'evals del router · CI en cada push', liveTxt: 'proyectos online' },
    stamp: 'Deployado.',
    noir1: [['Fuera del código,'], ['leo novelas', '*rusas*'], ['y veo mucho cine.']],
    noir2: [['Me gustan las historias'], ['donde alguien pregunta'], ['*hasta entender.*']],
    noir3: [['Con el código'], ['hago lo mismo.']],
    ticker: 'CRIMEN Y CASTIGO · LOS HERMANOS KARAMÁZOV · EL RETRATO DE DORIAN GRAY · FOOLED BY RANDOMNESS · THE CATCHER IN THE RYE · AI ENGINEERING · EL HOBBIT · ROMEO Y JULIETA · ',
    start1: [['Todavía estoy'], ['*empezando.*']],
    start2: [['Pero ya estoy'], ['*construyendo.*']],
    sub: 'Busco pasantía o rol trainee. Buenos Aires o remoto.',
    enter: 'Entrar a la web', auto: (s) => `entrás solo en ${s}s`, autoPaused: 'en pausa',
    videos: 'Ver demos',
    foot: ['proyectos online', '34 tests en CI', 'Buenos Aires o remoto'],
    credit: '♪ “Jangle”, Blank &amp; Kytt (<a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener">CC BY 3.0</a>) · avatar generado a partir de mi foto'
  },
  en: {
    aria: 'Intro: a minute about Ignacio',
    pre: 'Give me a minute.', start: '▶ Start', startKey: 'Enter · sound on',
    skip: 'Skip intro →', soundOn: '♪ Sound: on', soundOff: '♪ Sound: off',
    ch: ['// 00 — before', '// 01 — hi', '// 02 — who', '// 03 — projects', '// 04 — jobbot', '// 05 — how', '// 06 — beyond code', '// 07 — end'],
    psst: 'psst',
    hook: [['Got'], ['a', '*minute?*']],
    soy: [['I’m'], ['Nacho.']],
    who: [['19.'], ['Buenos Aires.']],
    chips: ['IT Management · UADE', 'Looking for an internship'],
    build: [['And I build'], ['*things.*']],
    cards: [['JobBot', 'job-bot.webp', 'live'], ['Darter', 'darter.webp', 'private'], ['Agents System', 'agents-system.webp', 'local'], ['Motor Estadístico', 'prode-mundial-2026.webp', 'live'], ['FulboTracker', 'futtracker.webp', 'live'], ['Comida de Barrio', 'comidadebarrio.webp', 'live']],
    jobbot: [['JobBot'], ['*job hunts*'], ['for you.']],
    jobbotSub: 'SaaS · Next.js · FastAPI · PostgreSQL · Telegram',
    phoneTop: ['Hi, María', 'looking for: Frontend · remote'],
    jobs: [['92%', 'Frontend Developer', 'Remote · USD'], ['87%', 'Full Stack Engineer', 'Hybrid'], ['78%', 'React Developer', 'Remote']],
    notif: ['<b>JobBot</b>', 'New job · <em>92% match</em>'],
    tiles: { stack: '// stack', air: '// on air', pay: '// payments', tests: '// tests', live: '// live', payTxt: 'Stripe and MercadoPago, confirmed by webhook.', testsTxt: 'router evals · CI on every push', liveTxt: 'projects live' },
    stamp: 'Shipped.',
    noir1: [['Outside of code,'], ['I read', '*Russian*', 'novels'], ['and watch a lot of film.']],
    noir2: [['I like stories'], ['where someone keeps asking'], ['*until they understand.*']],
    noir3: [['I do the same'], ['with code.']],
    ticker: 'CRIME AND PUNISHMENT · THE BROTHERS KARAMAZOV · THE PICTURE OF DORIAN GRAY · FOOLED BY RANDOMNESS · THE CATCHER IN THE RYE · AI ENGINEERING · THE HOBBIT · ROMEO AND JULIET · ',
    start1: [['I’m still'], ['*starting out.*']],
    start2: [['But I’m already'], ['*building.*']],
    sub: 'Looking for an internship or trainee role. Buenos Aires or remote.',
    enter: 'Enter the site', auto: (s) => `opening in ${s}s`, autoPaused: 'paused',
    videos: 'Watch demos',
    foot: ['projects live', '34 tests in CI', 'Buenos Aires or remote'],
    credit: '♪ “Jangle”, Blank &amp; Kytt (<a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener">CC BY 3.0</a>) · avatar generated from my photo'
  }
};

const VIDEOS = [
  ['JobBot', 'job-bot.webp', 'jobbot-demo.mp4', '0:40'],
  ['Darter', 'darter.webp', 'darter-demo.mp4', '0:50'],
  ['Agents System', 'agents-system.webp', 'agents-system-demo.mp4', '0:51'],
  ['Motor Estadístico', 'prode-mundial-2026.webp', 'prode-demo.mp4', '0:33'],
  ['FulboTracker', 'futtracker.webp', 'fulbotracker-demo.mp4', '0:32']
];

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const rand = (a, bb) => a + Math.random() * (bb - a);
const UNDERLINE = '<svg viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M2 6 C 25 3, 55 8, 98 4"/></svg>';

// ---------------------------------------------------------------- sound
class Sound {
  constructor() {
    const AC = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    const comp = this.ctx.createDynamicsCompressor();
    comp.threshold.value = -12; comp.ratio.value = 3;
    this.master.connect(comp).connect(this.ctx.destination);
    // music goes through its own filter: the noir section muffles it
    this.musicBus = this.ctx.createBiquadFilter();
    this.musicBus.type = 'lowpass'; this.musicBus.frequency.value = 18000; this.musicBus.Q.value = 0.7;
    this.musicGain = this.ctx.createGain(); this.musicGain.gain.value = 0.85;
    this.musicBus.connect(this.musicGain).connect(this.master);
    const len = this.ctx.sampleRate;
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
    s.start(when, Math.random() * 0.5); s.stop(when + decay + 0.05);
  }
  tone(when, { type = 'sine', f = 440, to, peak = 0.1, attack = 0.005, decay = 0.3 } = {}) {
    const o = this.ctx.createOscillator(), g = this.gain();
    o.type = type; o.frequency.value = f;
    if (to) o.frequency.exponentialRampToValueAtTime(to, when + attack + decay);
    o.connect(g).connect(this.master);
    this.env(g, when, peak, attack, decay);
    o.start(when); o.stop(when + attack + decay + 0.05);
  }
  pop(when, pitch = 1) { this.tone(when, { f: 520 * pitch, to: 1150 * pitch, peak: 0.13, decay: 0.07 }); }
  click(when) { this.burst(when, { f: 3200, q: 2, peak: 0.16, decay: 0.02 }); }
  whoosh(when, dur = 0.26) {
    const s = this.ctx.createBufferSource(); s.buffer = this.noise;
    const x = this.filter('bandpass', 400, 1.3), g = this.gain();
    x.frequency.setValueAtTime(400, when); x.frequency.exponentialRampToValueAtTime(3000, when + dur);
    s.connect(x).connect(g).connect(this.master);
    this.env(g, when, 0.18, dur * 0.4, dur * 0.6);
    s.start(when, Math.random() * 0.5); s.stop(when + dur + 0.05);
  }
  ping(when) { this.tone(when, { f: 1318.5, peak: 0.08, decay: 0.9 }); this.tone(when + 0.08, { f: 1975.5, peak: 0.05, decay: 0.8 }); }
  thump(when) { this.tone(when, { f: 110, to: 42, peak: 0.6, decay: 0.35 }); this.burst(when, { f: 900, q: 0.6, peak: 0.25, decay: 0.08, type: 'lowpass' }); }
  wink(when) { this.tone(when, { type: 'triangle', f: 1800, to: 2600, peak: 0.05, decay: 0.08 }); }
  music(when, offset, dur) {
    if (!this.score || dur <= 0.05) return;
    const s = this.ctx.createBufferSource(); s.buffer = this.score;
    const g = this.gain(0);
    s.connect(g).connect(this.musicBus);
    g.gain.setValueAtTime(0, when); g.gain.linearRampToValueAtTime(1, when + (offset ? 0.3 : 0.02));
    s.start(when, offset, dur);
  }
  muffle(when, on) { this.musicBus.frequency.setTargetAtTime(on ? 420 : 18000, when, on ? 0.06 : 0.12); this.musicGain.gain.setTargetAtTime(on ? 0.7 : 0.85, when, 0.1); }
  mute(on) { this.master.gain.setTargetAtTime(on ? 0 : 1, this.ctx.currentTime, 0.08); }
  close() { this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1); setTimeout(() => this.ctx.close().catch(() => {}), 700); }
}

function grainTile() {
  const c = document.createElement('canvas');
  c.width = c.height = 180;
  const g = c.getContext('2d'), img = g.createImageData(180, 180);
  for (let i = 0; i < img.data.length; i += 4) { const v = Math.random() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
  g.putImageData(img, 0, 0);
  return c.toDataURL('image/png');
}

// words: [['Soy'], ['*Nacho.*']] → lines of spans; *x* marks the accent word
function lines(rows, cls = '') {
  return rows.map((row) => `<span class="ln ${cls}">${row.map((w) => (w.startsWith('*')
    ? `<span class="w"><span class="acc">${esc(w.slice(1, -1))}${UNDERLINE}</span></span>`
    : `<span class="w">${esc(w)}</span>`)).join(' ')}</span>`).join('');
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
  el.innerHTML = `
    <div class="intro-veil"></div>
    <div class="intro-frame">
      <div class="intro-win is-waiting" tabindex="-1">
        <div class="iw-stage">
          <div class="pre"><span class="ln">${esc(C.pre)}</span><br><button type="button" class="pre-start">${esc(C.start)} <kbd>${esc(C.startKey)}</kbd></button></div>
          <div class="head" aria-live="polite"></div>
          <div class="chips">${C.chips.map((c, i) => `<span class="chip${i ? ' g' : ''}">${esc(c)}</span>`).join('')}</div>
          <div class="cards">${C.cards.map(([n, img, tag]) => `<div class="card"><img alt="" data-src="${A}${img}"><b>${esc(n)}</b><span>${esc(tag)}</span></div>`).join('')}</div>
          <div class="phone"><div class="top">${esc(C.phoneTop[0])}<small>${esc(C.phoneTop[1])}</small></div>
            ${C.jobs.map(([p, t, s]) => `<div class="job"><i>${p}</i><div><b>${esc(t)}</b><span>${esc(s)}</span></div></div>`).join('')}</div>
          <div class="notif"><i>J</i><div>${C.notif[0]}<br>${C.notif[1]}</div></div>
          <div class="bento">
            <div class="tile"><span class="t">${esc(C.tiles.stack)}</span><div class="pills"><span>Next.js</span><span>FastAPI</span><span>PostgreSQL</span><span>Python</span><span>Telegram</span><span>Vercel</span></div></div>
            <div class="tile air"><span class="t">${esc(C.tiles.air)}</span><img alt="" data-src="${AV}smile.webp"></div>
            <div class="tile"><span class="t">${esc(C.tiles.tests)}</span><span class="big">34/34 <small>✓</small></span><span class="txt">${esc(C.tiles.testsTxt)}</span></div>
            <div class="tile"><span class="t">${esc(C.tiles.pay)}</span><span class="txt">${esc(C.tiles.payTxt)}</span></div>
            <div class="tile"><span class="t">${esc(C.tiles.live)}</span><span class="big">${deployed} <small>${esc(C.tiles.liveTxt)}</small></span><div class="bar">${[3, 5, 4, 7, 6, 9, 8, 10].map((h) => `<i style="height:${h * 10}%"></i>`).join('')}</div></div>
          </div>
          <div class="stamp">${esc(C.stamp)}</div>
          <div class="noir"><img alt="" data-src="${AV}reading.webp"></div>
          <div class="ticker"><span>${esc(C.ticker.repeat(2))}</span></div>
          <div class="nacho peek"><div class="bob">${FACES.map((f) => `<img alt="" data-src="${AV}${f}.webp" data-face="${f}"${f === 'neutral' ? ' class="on"' : ''}>`).join('')}<span class="bubble">${esc(C.psst)}</span></div></div>
          <div class="end">
            <div class="es-face"><img alt="" data-src="${AV}smile.webp" class="on"><img alt="" data-src="${AV}wink.webp"></div>
            <h2 class="es-name">Ignacio Palmeri</h2>
            <p class="es-sub">${esc(C.sub)}</p>
            <div class="es-row">
              <button type="button" class="es-enter"><svg viewBox="0 0 36 36" aria-hidden="true"><circle class="bg" cx="18" cy="18" r="15"/><circle class="fg" cx="18" cy="18" r="15" pathLength="1"/><path d="M15 12.5l7 5.5-7 5.5z" fill="#fff"/></svg>${esc(C.enter)}</button>
              <span class="es-url">ignaciopalmeri.dev</span>
              <span class="es-auto" aria-live="off"></span>
            </div>
            <div class="es-videos" aria-label="${esc(C.videos)}">${VIDEOS.map(([n, img, v, d]) => `<button type="button" class="es-card" data-video="/project-assets/video/${v}"><div class="es-thumb"><img alt="" data-src="${A}${img}"><span>▶ ${d}</span></div><b>${esc(n)}</b></button>`).join('')}</div>
            <p class="es-foot">${deployed} ${esc(C.foot[0])}<span class="sep">·</span>${esc(C.foot[1])}<span class="sep">·</span>${esc(C.foot[2])}<br>${C.credit}</p>
          </div>
        </div>
        <div class="hud" aria-hidden="true"><span class="hud-ch">${esc(C.ch[0])}</span><span>IGNACIO PALMERI · <span class="hud-tc">00:00:00:00</span></span></div>
        <div class="iw-flash"></div>
        <div class="iw-grain"></div>
      </div>
    </div>
    <div class="intro-top">
      <button type="button" class="intro-sound" aria-pressed="true">${esc(C.soundOn)}</button>
      <button type="button" class="intro-skip">${esc(C.skip)}</button>
    </div>`;

  const $ = (s) => el.querySelector(s);
  const $$ = (s) => [...el.querySelectorAll(s)];
  const win = $('.intro-win'), frame = $('.intro-frame'), veil = $('.intro-veil');
  const head = $('.head'), nacho = $('.nacho'), tcEl = $('.hud-tc'), chEl = $('.hud-ch');
  const soundBtn = $('.intro-sound'), skipBtn = $('.intro-skip');
  $('.iw-grain').style.backgroundImage = `url(${grainTile()})`;
  // the avatar first (the pre-roll shows it), then everything else
  $$('.nacho img').forEach((i) => { i.src = i.dataset.src; i.removeAttribute('data-src'); });
  const loadImgs = () => $$('img[data-src]').forEach((i) => { i.src = i.dataset.src; i.removeAttribute('data-src'); });
  setTimeout(loadImgs, 1200);

  const inerted = [...document.body.children].filter((n) => n !== el && !n.hasAttribute('inert') && n.tagName !== 'SCRIPT');
  inerted.forEach((n) => n.setAttribute('inert', ''));
  document.body.appendChild(el);
  root.classList.add('intro-on');
  root.classList.remove('intro-pending');
  window.dispatchEvent(new Event('intro-state'));
  window.__introReady = true;

  // ---------------------------------------------------------- the character
  let face = 'neutral', talkTimer = 0, blinkTimer = 0;
  function show(f) {
    face = f;
    $$('.nacho img').forEach((i) => i.classList.toggle('on', i.dataset.face === f));
  }
  function place(pos) { nacho.className = `nacho ${pos}`; }
  function popIn(pos) { place(`${pos} pop`); }
  function talk(ms) {
    clearInterval(talkTimer);
    let open = false;
    talkTimer = setInterval(() => { open = !open; show(open ? 'talk' : 'neutral'); }, 130);
    setTimeout(() => { clearInterval(talkTimer); show('neutral'); }, ms);
  }
  // blinks on its own, never in the middle of another expression
  (function blinkLoop() {
    blinkTimer = setTimeout(() => {
      if (face === 'neutral') { show('blink'); setTimeout(() => { if (face === 'blink') show('neutral'); }, 120); }
      blinkLoop();
    }, rand(2200, 4200));
  })();

  // ---------------------------------------------------------- clock + cues
  let base = 0, startedAt = null, rafId = 0, running = false, finished = false;
  const now = () => (startedAt === null ? base : base + (performance.now() - startedAt) / 1000);
  const vis = [], aud = [], beds = [];
  let vi = 0, ai = 0;
  const at = (t, fn) => vis.push({ t, fn });
  const sfx = (t, fn) => aud.push({ t, fn });
  const bed = (from, to, start) => { beds.push({ from, to, start }); sfx(from, (w) => start(w, 0)); };
  let snd = null, muted = false;
  const audible = () => snd && snd.running;
  const whenFor = (t) => snd.ctx.currentTime + Math.max(0, t - now());

  function loop() {
    if (!running) return;
    const t = now();
    while (vi < vis.length && vis[vi].t <= t) vis[vi++].fn(t);
    while (ai < aud.length && aud[ai].t <= t + 0.08) { const c = aud[ai++]; if (audible()) c.fn(whenFor(c.t)); }
    tcEl.textContent = `00:00:${String(Math.floor(t)).padStart(2, '0')}:${String(Math.floor((t % 1) * 24)).padStart(2, '0')}`;
    rafId = requestAnimationFrame(loop);
  }
  function pause() { if (startedAt === null) return; base = now(); startedAt = null; if (snd) snd.ctx.suspend().catch(() => {}); }
  function resume() { if (startedAt !== null || !running) return; startedAt = performance.now(); if (snd && !muted) snd.ctx.resume().catch(() => {}); }
  const onVis = () => (document.visibilityState === 'hidden' ? pause() : resume());
  document.addEventListener('visibilitychange', onVis);

  const scoreBytes = fetch('/intro/score.m4a').then((r) => (r.ok ? r.arrayBuffer() : null)).catch(() => null);
  function unlockSound() {
    if (snd) { if (!muted) snd.ctx.resume().catch(() => {}); return; }
    try { snd = new Sound(); } catch (_e) { return; }
    const late = running;
    scoreBytes.then((buf) => buf && snd.ctx.decodeAudioData(buf.slice(0)).then((dec) => {
      snd.score = dec;
      // started before the music was ready (or turned on late): join in time
      const t = now();
      if (running && (late || t > 0.05)) beds.forEach((bd) => { if (bd.from <= t && t < bd.to - 0.3) bd.start(snd.ctx.currentTime + 0.02, t - bd.from); });
      if (running && t > T.noir && t < T.back) snd.muffle(snd.ctx.currentTime, true);
    })).catch(() => {});
  }

  // ---------------------------------------------------------- helpers
  const chapter = (t, i) => at(t, () => { chEl.textContent = C.ch[i]; });
  function headline(t, rows, { cls = '', kick = '', sub = '', stepBeats = 1, pitch = 1 } = {}) {
    let words;
    at(t, () => {
      head.innerHTML = `${kick ? `<span class="kick">${esc(kick)}</span>` : ''}${lines(rows, cls)}${sub ? `<span class="sub">${esc(sub)}</span>` : ''}`;
      words = [...head.querySelectorAll('.w')];
      head.querySelector('.kick')?.classList.add('on');
    });
    const count = rows.flat().length;
    for (let i = 0; i < count; i++) {
      const tt = t + b(i * stepBeats);
      at(tt, () => {
        const w = words[i]; w.classList.add('on');
        const acc = w.querySelector('.acc');
        if (acc) setTimeout(() => acc.classList.add('draw'), 180);
      });
      sfx(tt, (w) => snd.pop(w, pitch * (1 + i * 0.06)));
    }
    if (sub) at(t + b(count * stepBeats), () => head.querySelector('.sub')?.classList.add('on'));
    return t + b(count * stepBeats);
  }
  const clearHead = (t) => at(t, () => { head.innerHTML = ''; });
  const mode = (t, m) => at(t, () => { win.classList.toggle('is-green', m === 'green'); win.classList.toggle('is-dark', m === 'dark'); });
  const flash = () => { const f = $('.iw-flash'); f.classList.remove('is-on'); void f.offsetWidth; f.classList.add('is-on'); };
  const onoff = (t, sel, on = true) => at(t, () => $$(sel).forEach((n) => n.classList.toggle('on', on)));

  // ---------------------------------------------------------- pre-roll
  // The window, the avatar peeking from below, one line. The film waits for
  // a click (so it can play with sound); if nobody moves, it starts silent.
  let started = false;
  setTimeout(() => $('.pre-start')?.classList.add('on'), 900);
  const autoTimer = setTimeout(() => start(false), 9000);
  win.focus({ preventScroll: true });

  function start(withSound) {
    if (started || finished) return;
    started = true; clearTimeout(autoTimer);
    win.classList.remove('is-waiting');
    $('.pre').remove();
    if (withSound) unlockSound();
    else { soundBtn.setAttribute('aria-pressed', 'false'); soundBtn.textContent = C.soundOff; soundBtn.classList.add('is-nudge'); muted = true; }
    vis.sort((x, y) => x.t - y.t); aud.sort((x, y) => x.t - y.t);
    running = true; base = 0; startedAt = performance.now();
    rafId = requestAnimationFrame(loop);
  }

  // ---------------------------------------------------------- timeline
  const T = { hook: 0, green: b(16), who: b(22), build: b(30), cards: b(35), jobbot: b(44), bento: b(56), stamp: b(62), noir: b(66), start1: b(90), back: b(96), end: b(104), total: 50 };
  bed(0, T.total, (w, off) => snd.music(w, off, T.total - off));

  // 01 — hola: pops up, whispers, asks for a minute
  chapter(0, 1);
  at(0, () => { popIn('right'); });
  sfx(0, (w) => snd.whoosh(w, 0.3));
  at(b(2), () => { $('.bubble').classList.add('on'); talk(b(2) * 1000); });
  sfx(b(2), (w) => snd.pop(w, 1.3));
  at(b(4), () => $('.bubble').classList.remove('on'));
  headline(b(4), C.hook);
  at(b(6), () => show('side'));
  at(b(9), () => show('wink'));
  sfx(b(9), (w) => snd.wink(w));
  at(b(11), () => show('smile'));

  // 02 — Soy Nacho, on green
  at(T.green, () => { head.innerHTML = ''; show('smile'); place('greenpos'); flash(); });
  mode(T.green, 'green');
  sfx(T.green, (w) => snd.thump(w));
  headline(T.green + b(1), C.soy, { stepBeats: 2, pitch: 0.8 });

  // who: age, city, what I study and what I'm after
  mode(T.who, 'light');
  chapter(T.who, 2);
  at(T.who, () => { show('neutral'); place('right'); });
  headline(T.who, C.who, { stepBeats: 2 });
  onoff(T.who + b(5), '.chips .chip:nth-child(1)');
  onoff(T.who + b(6), '.chips .chip:nth-child(2)');
  sfx(T.who + b(5), (w) => snd.click(w)); sfx(T.who + b(6), (w) => snd.click(w));
  at(T.who + b(5), () => show('side'));
  at(T.who + b(7), () => show('neutral'));
  onoff(T.build, '.chips .chip', false);
  headline(T.build, C.build, { stepBeats: 2 });
  at(T.build + b(2), () => show('smile'));

  // 03 — projects fly in on the beat
  chapter(T.cards, 3);
  at(T.cards, () => { head.innerHTML = ''; show('surprised'); place('corner'); });
  $$('.card').forEach((c, i) => { onoff(T.cards + b(i), `.card:nth-child(${i + 1})`); sfx(T.cards + b(i), (w) => snd.whoosh(w, 0.22)); });
  at(T.cards + b(4), () => show('smile'));
  at(T.jobbot - b(1), () => $('.cards').classList.add('out'));

  // 04 — JobBot: a phone, the jobs, the notification lands
  chapter(T.jobbot, 4);
  at(T.jobbot, () => { $('.cards').classList.add('gone-el'); show('neutral'); });
  headline(T.jobbot, C.jobbot, { sub: C.jobbotSub });
  onoff(T.jobbot, '.phone');
  sfx(T.jobbot, (w) => snd.whoosh(w, 0.35));
  $$('.job').forEach((j, i) => { onoff(T.jobbot + b(3 + i), `.job:nth-child(${i + 2})`); sfx(T.jobbot + b(3 + i), (w) => snd.click(w)); });
  onoff(T.jobbot + b(8), '.notif');
  sfx(T.jobbot + b(8), (w) => snd.ping(w));
  at(T.jobbot + b(8), () => show('surprised'));
  at(T.jobbot + b(10), () => show('smile'));

  // 05 — how: the bento, then the stamp
  chapter(T.bento, 5);
  at(T.bento, () => { head.innerHTML = ''; $('.phone').classList.remove('on'); $('.notif').classList.remove('on'); place('gone'); });
  $$('.tile').forEach((tile, i) => { onoff(T.bento + b(i), `.tile:nth-child(${i + 1})`); sfx(T.bento + b(i), (w) => snd.pop(w, 0.7 + i * 0.08)); });
  onoff(T.stamp, '.stamp');
  sfx(T.stamp + 0.2, (w) => snd.thump(w));

  // 06 — noir: cut to black, the music muffles, he's reading
  chapter(T.noir, 6);
  mode(T.noir, 'dark');
  at(T.noir, () => { $$('.tile, .stamp').forEach((n) => n.classList.remove('on')); $('.bento').classList.add('gone-el'); $('.noir').classList.add('on'); $('.ticker').classList.add('on'); });
  sfx(T.noir, (w) => snd.muffle(w, true));
  headline(T.noir + b(2), C.noir1, { cls: 'sm', stepBeats: 2, pitch: 0.7 });
  headline(T.noir + b(10), C.noir2, { cls: 'sm', stepBeats: 2, pitch: 0.7 });
  headline(T.noir + b(18), C.noir3, { cls: 'sm', stepBeats: 2, pitch: 0.7 });
  at(T.start1, () => { $('.noir').classList.add('solo'); $('.ticker').classList.remove('on'); });
  headline(T.start1, C.start1, { stepBeats: 2, pitch: 0.7 });

  // back to light: the music opens up again on "building"
  mode(T.back, 'light');
  at(T.back, () => { $('.noir').classList.remove('on'); flash(); show('smile'); popIn('right'); });
  sfx(T.back, (w) => { snd.muffle(w, false); snd.thump(w); });
  headline(T.back, C.start2, { stepBeats: 2 });

  // 07 — end card: the avatar peeks over my name
  chapter(T.end, 7);
  at(T.end, () => { head.innerHTML = ''; place('gone'); loadImgs(); $('.end').classList.add('on'); tcEl.parentElement.style.opacity = '.6'; startCountdown(); });
  sfx(T.end, (w) => snd.whoosh(w, 0.3));
  const endFace = (i) => $$('.es-face img').forEach((im, k) => im.classList.toggle('on', k === i));
  at(T.end + b(6), () => endFace(1));
  sfx(T.end + b(6), (w) => snd.wink(w));
  at(T.end + b(8), () => endFace(0));

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
    Object.assign(clone.style, { left: `${a.left}px`, top: `${a.top}px`, fontSize: getComputedStyle(from).fontSize, lineHeight: getComputedStyle(from).lineHeight, color: getComputedStyle(to).color });
    document.body.appendChild(clone);
    to.style.opacity = '0';
    clone.animate([{ transform: 'none' }, { transform: `translate(${bb.left - a.left}px, ${bb.top - a.top}px) scale(${bb.height / a.height})` }], { duration: 1100, easing: 'cubic-bezier(.65,0,.25,1)', fill: 'forwards' });
    return () => { to.style.transition = 'opacity .25s'; to.style.opacity = ''; setTimeout(() => { clone.remove(); to.style.transition = ''; }, 260); };
  }

  async function finish(mode, then) {
    if (finished) return;
    finished = true; running = false;
    cancelAnimationFrame(rafId); cancelAnimationFrame(cdTimer); clearTimeout(autoTimer); clearTimeout(blinkTimer); clearInterval(talkTimer);
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
  $$('.es-card').forEach((card) => card.addEventListener('click', () => {
    const video = card.dataset.video;
    finish('card', () => { if (typeof window.openProjectVideo === 'function') window.openProjectVideo(video); });
  }));

  active = { finish };
}
