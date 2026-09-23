// Deterministic motion engine for launch films. A film is a list of scenes;
// every frame is a pure function of time, so render.mjs can seek to any t
// and screenshot it. Nothing here depends on the wall clock.

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, p) => a + (b - a) * p;
export const ease = {
  linear: (p) => p,
  outCubic: (p) => 1 - (1 - p) ** 3,
  outQuint: (p) => 1 - (1 - p) ** 5,
  outExpo: (p) => (p >= 1 ? 1 : 1 - 2 ** (-10 * p)),
  inCubic: (p) => p ** 3,
  inOutCubic: (p) => (p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2),
  inOutQuint: (p) => (p < 0.5 ? 16 * p ** 5 : 1 - (-2 * p + 2) ** 5 / 2),
  inOutSine: (p) => -(Math.cos(Math.PI * p) - 1) / 2,
  // Critically-damped-ish spring with a small overshoot.
  spring: (p) => (p >= 1 ? 1 : 1 - Math.exp(-7 * p) * Math.cos(9 * p * 0.9))
};

// Progress of t through [a, b], eased.
export const prog = (t, a, b, e = ease.outCubic) => e(clamp((t - a) / (b - a)));

// Keyframes: kf(t, [[t0, v0], [t1, v1, easeFn], ...]); values may be arrays.
export function kf(t, frames) {
  if (t <= frames[0][0]) return frames[0][1];
  for (let i = 1; i < frames.length; i++) {
    const [t1, v1, e = ease.inOutCubic] = frames[i];
    const [t0, v0] = frames[i - 1];
    if (t <= t1) {
      const p = e(clamp((t - t0) / (t1 - t0)));
      return Array.isArray(v0) ? v0.map((x, k) => lerp(x, v1[k], p)) : lerp(v0, v1, p);
    }
  }
  return frames[frames.length - 1][1];
}

export function h(tag, cls = '', parent = null, style = {}) {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  Object.assign(el.style, style);
  if (parent) parent.appendChild(el);
  return el;
}

export function set(el, { x = 0, y = 0, s = 1, sx, sy, rx = 0, ry = 0, rz = 0, o, blur, persp } = {}) {
  el.style.transform = `${persp ? `perspective(${persp}px) ` : ''}translate3d(${x}px, ${y}px, 0) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sx ?? s}, ${sy ?? s})`;
  if (o !== undefined) el.style.opacity = o;
  if (blur !== undefined) el.style.filter = blur > 0.05 ? `blur(${blur}px)` : 'none';
}

// Headline whose words blur-rise in one by one. `html` may wrap words in
// <em> for the accent serif. Returns update(t) with t relative to its start.
export function words(parent, html, { top = 110, size, stagger = 0.07, dur = 0.8, outAt = Infinity, outDur = 0.45, cls = 'headline', style = {} } = {}) {
  const el = h('div', cls, parent, { top: `${top}px`, ...(size ? { fontSize: `${size}px` } : {}), ...style });
  const tmp = h('div');
  tmp.innerHTML = html;
  const spans = [];
  const walk = (node, into) => {
    for (const n of [...node.childNodes]) {
      if (n.nodeType === 3) {
        for (const part of n.textContent.split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) { into.appendChild(document.createTextNode(' ')); continue; }
          const s = h('span', 'w', into);
          s.textContent = part;
          spans.push(s);
        }
      } else if (n.nodeName === 'BR') {
        into.appendChild(document.createElement('br'));
      } else {
        const clone = h(n.nodeName.toLowerCase(), n.className, into);
        walk(n, clone);
      }
    }
  };
  walk(tmp, el);
  const update = (t) => {
    spans.forEach((s, i) => {
      const p = prog(t, i * stagger, i * stagger + dur, ease.outExpo);
      const q = prog(t, outAt + i * 0.025, outAt + i * 0.025 + outDur, ease.inCubic);
      set(s, { y: (1 - p) * 42 - q * 30, o: p * (1 - q), blur: (1 - p) * 14 + q * 10 });
    });
  };
  update.el = el;
  return update;
}

// A browser window showing a screenshot. `img` is scrolled via update(scrollY).
export function browser(parent, { src, url, w, h: hh, dark = false }) {
  const el = h('div', `window${dark ? ' dark' : ''}`, parent, { width: `${w}px`, height: `${hh}px`, left: '0', top: '0' });
  const bar = h('div', 'bar', el);
  for (const c of ['#ff5f57', '#febc2e', '#28c840']) h('span', 'dot', bar, { background: c });
  const u = h('div', 'url', bar);
  u.textContent = url;
  const view = h('div', 'view', el);
  const img = h('img', '', view);
  img.src = src;
  return { el, view, img, scroll(y) { img.style.transform = `translate3d(0, ${-y}px, 0)`; } };
}

export function cursor(parent) {
  const el = h('div', 'cursor', parent);
  el.innerHTML = '<svg viewBox="0 0 32 32" width="34" height="34"><path d="M6 3l19 11.5-8.2 1.9-4.3 8.1z" fill="#111" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>';
  const ripple = h('div', 'ripple', parent, { opacity: 0 });
  return {
    el,
    // path: [[t, x, y], ...]; clicks: [t, ...]
    update(t, path, clicks = []) {
      const [x, y] = kf(t, path.map(([tt, px, py]) => [tt, [px, py], ease.inOutCubic]));
      const press = clicks.reduce((m, c) => Math.max(m, 1 - Math.abs(t - c - 0.06) / 0.12), 0);
      set(el, { x, y, s: 1 - clamp(press) * 0.18 });
      el.style.transformOrigin = '6px 3px';
      const c = clicks.find((cc) => t >= cc && t < cc + 0.7);
      if (c !== undefined) {
        const p = prog(t, c, c + 0.7, ease.outCubic);
        set(ripple, { x: x + 6, y: y + 3, s: 0.2 + p * 1.6, o: 1 - p });
      } else ripple.style.opacity = 0;
    }
  };
}

// Radial progress ring with a counting number.
export function ring(parent, { size = 300, stroke = 18, color = 'var(--accent)', track = 'rgba(0,0,0,.07)', font = 88 }) {
  const el = h('div', 'abs', parent, { width: `${size}px`, height: `${size}px` });
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  el.innerHTML = `<svg width="${size}" height="${size}" style="transform:rotate(-90deg)"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${track}" stroke-width="${stroke}"/><circle class="arc" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c}"/></svg><div class="num" style="position:absolute;inset:0;display:grid;place-items:center;font:700 ${font}px Inter;letter-spacing:-.04em"></div>`;
  const arc = el.querySelector('.arc');
  const num = el.querySelector('.num');
  return { el, update(v) { arc.setAttribute('stroke-dashoffset', c * (1 - v / 100)); num.textContent = `${Math.round(v)}%`; } };
}

function grain(parent) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = 256;
  const g = cv.getContext('2d');
  const d = g.createImageData(256, 256);
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < d.data.length; i += 4) { const v = rnd() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
  g.putImageData(d, 0, 0);
  return h('div', 'grain', parent, { backgroundImage: `url(${cv.toDataURL()})` });
}

export async function boot(stage, film, assetBase) {
  const root = document.documentElement.style;
  for (const [k, v] of Object.entries(film.theme || {})) root.setProperty(`--${k}`, v);

  // Ambient background: two soft accent blobs drifting slowly.
  const bg = h('div', 'layer', stage);
  const blobs = (film.blobs || ['var(--accent)', '#f4b183']).map((c, i) => h('div', 'blob', bg, { width: `${1300 - i * 200}px`, height: `${1300 - i * 200}px`, background: `radial-gradient(circle, ${c} 0%, transparent 68%)` }));

  const asset = (name) => `${assetBase}${name}`;
  const scenes = film.scenes.map((sc) => {
    const layer = h('div', 'layer', stage, { opacity: 0 });
    const update = sc.build(layer, asset);
    return { ...sc, layer, update };
  });
  const gr = grain(stage);

  await Promise.all([...document.images].map((im) => (im.complete ? im.decode().catch(() => {}) : new Promise((r) => { im.onload = im.onerror = r; }).then(() => im.decode().catch(() => {})))));
  await document.fonts.ready;

  function seek(t) {
    blobs.forEach((b, i) => set(b, {
      x: 960 - (650 - i * 100) + Math.sin(t * 0.21 + i * 2.1) * 520 + (i ? 380 : -380),
      y: 540 - (650 - i * 100) + Math.cos(t * 0.17 + i * 1.3) * 260 + (i ? 200 : -140),
      o: film.blobOpacity ?? 0.5
    }));
    // Grain stays still: per-frame noise looks filmic but costs ~10x in
    // bitrate, and these films are meant to stream from a portfolio.
    for (const sc of scenes) {
      const inD = sc.in ?? 0.5, outD = sc.out ?? 0.45;
      const live = t >= sc.from && t <= sc.to + outD;
      sc.layer.style.display = live ? 'block' : 'none';
      if (!live) continue;
      const lt = t - sc.from;
      // Shared cut grammar: settle in from a soft blur, leave by pushing
      // forward into blur, so consecutive scenes cross-dissolve with depth.
      const pin = sc.in === 0 ? 1 : prog(t, sc.from, sc.from + inD, ease.outCubic);
      const pout = sc.out === 0 ? 0 : prog(t, sc.to, sc.to + outD, ease.inCubic);
      set(sc.layer, { s: (0.97 + 0.03 * pin) * (1 + 0.06 * pout), o: pin * (1 - pout), blur: (1 - pin) * 10 + pout * 16 });
      sc.update(lt, t);
    }
  }
  seek(0);
  return { seek, duration: film.duration, fps: film.fps || 60 };
}

// Closing card shared by every film: mark, name, url, stack chips, credit,
// and a final fade to the background.
export function endCard(L, { mark, markStyle = {}, name, nameSize = 150, nameStyle = {}, url, chips = [], credit = 'Hecho por <b style="color:var(--ink)">Ignacio Palmeri</b> · ignaciopalmeri.dev' }) {
  const logo = h('div', 'abs', L, { left: '885px', top: '250px', width: '150px', height: '150px', borderRadius: '38px', background: 'var(--accent)', color: '#fff', display: 'grid', placeItems: 'center', font: '700 92px Inter', boxShadow: '0 30px 60px -20px var(--accent)', ...markStyle });
  logo.innerHTML = mark;
  const title = words(L, name, { top: 430, size: nameSize, stagger: 0.05, style: nameStyle });
  const u = h('div', 'abs', L, { left: '0', right: '0', top: '630px', textAlign: 'center', font: '500 32px Mono', color: 'var(--muted)' });
  u.textContent = url;
  const row = h('div', 'abs', L, { left: '0', right: '0', top: '720px', display: 'flex', justifyContent: 'center', gap: '14px' });
  const cs = chips.map((s) => { const c = h('span', 'chip', row); c.textContent = s; return c; });
  const by = h('div', 'abs', L, { left: '0', right: '0', top: '950px', textAlign: 'center', font: '500 24px Inter', color: 'var(--muted)' });
  by.innerHTML = credit;
  const fade = h('div', 'layer', L, { background: 'var(--bg)' });
  return (t, end) => {
    const p = prog(t, 0.1, 1.0, ease.spring);
    set(logo, { s: 0.3 + p * 0.7, rz: (1 - p) * -30, o: clamp(p * 2) });
    title(t - 0.4);
    const q = prog(t, 0.9, 1.6, ease.outExpo);
    set(u, { y: (1 - q) * 20, o: q, blur: (1 - q) * 6 });
    cs.forEach((c, i) => { const r = prog(t, 1.2 + i * 0.07, 1.9 + i * 0.07, ease.spring); set(c, { y: (1 - r) * 30, s: 0.8 + r * 0.2, o: clamp(r * 2) }); });
    set(by, { o: prog(t, 1.9, 2.6) });
    fade.style.opacity = prog(t, end - 0.7, end, ease.inOutSine);
  };
}

// A soft light band sweeping across an element (glossy "sheen").
export function sheen(parent) {
  const el = h('div', 'abs', parent, { inset: '0', pointerEvents: 'none', background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,.22) 50%, transparent 65%)', backgroundSize: '250% 100%', mixBlendMode: 'screen' });
  return (p) => { el.style.backgroundPosition = `${130 - p * 160}% 0`; el.style.opacity = p > 0 && p < 1 ? 1 : 0; };
}
