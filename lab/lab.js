// Centro de mando: a 3D stage for the real agents-system router.
// router.js (a JS copy of orchestrator/router.ps1) makes every decision; this
// file only stages it. The HUD works on its own, so without WebGL the lab
// still routes and explains.
import { PROFILES, LANE_INFO, MISSIONS, readable } from '/lab/profiles.js';

// three.js comes from a CDN and is loaded dynamically: if a blocker or a bad
// network stops it, only the 3D stage is lost; the router, the HUD and the
// explanations keep working.
let THREE, OrbitControls, EffectComposer, RenderPass, UnrealBloomPass, OutputPass, CSS2DRenderer, CSS2DObject;
async function load3D() {
  const [three, oc, ec, rp, ub, op, css2d] = await Promise.all([
    import('three'),
    import('three/addons/controls/OrbitControls.js'),
    import('three/addons/postprocessing/EffectComposer.js'),
    import('three/addons/postprocessing/RenderPass.js'),
    import('three/addons/postprocessing/UnrealBloomPass.js'),
    import('three/addons/postprocessing/OutputPass.js'),
    import('three/addons/renderers/CSS2DRenderer.js')
  ]);
  THREE = three;
  ({ OrbitControls } = oc); ({ EffectComposer } = ec); ({ RenderPass } = rp);
  ({ UnrealBloomPass } = ub); ({ OutputPass } = op); ({ CSS2DRenderer, CSS2DObject } = css2d);
}

const $ = (s) => document.querySelector(s);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const small = matchMedia('(max-width: 900px)').matches;
const speed = reduceMotion ? 0.35 : 1;

const LANES = {
  SIMPLE: { color: '#34d399', label: 'SIMPLE', text: 'Un agente, sin revisores extra.' },
  SPECIALIZED: { color: '#60a5fa', label: 'SPECIALIZED', text: 'El dominio pide un especialista.' },
  PARALLEL: { color: '#c084fc', label: 'PARALLEL', text: 'Trabajos independientes, en paralelo.' },
  HIGH_RISK: { color: '#fb7185', label: 'HIGH_RISK', text: 'Credenciales, pagos, producción o borrados: aprobación humana.' }
};
// Where each agent stands: next to the lane that usually reaches it.
const HOME = {
  SIMPLE: ['agente-principal', 'agente-tests', 'agente-docs', 'kickoff-architect'],
  PARALLEL: ['agente-researcher', 'workflow-pruner'],
  HIGH_RISK: ['agente-security-auditor', 'agente-release-manager', 'agente-mcp-architect'],
  SPECIALIZED: ['agente-design', 'agente-seo', 'agente-growth-seo-geo', 'agente-marketing-strategist', 'agente-product-founder', 'agente-ai-architect', 'agente-obsidian-brain', 'agente-academic-tutor', 'agente-x-content-strategist', 'agente-code-reviewer']
};
const shortName = (id) => (PROFILES[id] && PROFILES[id].name) || id.replace(/^agente-/, '').replace(/-/g, ' ');
const embed = new URLSearchParams(location.search).has('embed');
if (embed) document.body.classList.add('embed');

// Round portrait (or initials) used on the stage, the profile and the receipt.
function avatarHTML(id, lane, size = 26) {
  const p = PROFILES[id] || {};
  const color = LANES[lane] ? LANES[lane].color : '#a5b4fc';
  if (p.photo) return `<img class="av" src="${p.photo}" alt="" width="${size}" height="${size}" style="--c:${color}">`;
  const initials = shortName(id).split(/[\s/]+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
  return `<span class="av mono" style="--c:${color};width:${size}px;height:${size}px;font-size:${Math.round(size * 0.38)}px">${initials}</span>`;
}
const laneOf = (id) => Object.keys(HOME).find((l) => HOME[l].includes(id)) || 'SPECIALIZED';

const data = await (await fetch('/lab/data.json')).json();
const Router = window.AgentRouter;

// ------------------------------------------------------------------ stage
let stage = null;
try {
  await load3D();
  stage = buildStage();
} catch (e) {
  console.warn('WebGL unavailable:', e);
  document.body.classList.add('no-webgl');
}

function buildStage() {
  const canvas = $('#scene');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.25 : 1.75));
  renderer.setSize(innerWidth, innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#04050a');
  scene.fog = new THREE.FogExp2('#04050a', 0.026);

  const camera = new THREE.PerspectiveCamera(small ? 55 : 42, innerWidth / innerHeight, 0.1, 200);
  const home = new THREE.Vector3(0, small ? 18 : 13.5, small ? 30 : 24);
  camera.position.set(0, 46, 58);

  const labels = new CSS2DRenderer({ element: $('#labels') });
  labels.setSize(innerWidth, innerHeight);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enablePan = false;
  controls.minDistance = 12;
  controls.maxDistance = 46;
  controls.maxPolarAngle = 1.36;
  controls.autoRotate = !reduceMotion;
  controls.autoRotateSpeed = 0.35;
  controls.target.set(0, 1.5, 0);

  scene.add(new THREE.AmbientLight('#8090ff', 0.35));
  const key = new THREE.DirectionalLight('#c7d2fe', 1.1);
  key.position.set(8, 16, 10);
  scene.add(key);

  // Floor: a dark disc with faint rings and spokes, plus a shock wave the
  // router sends out in the lane's colour.
  const floorMat = new THREE.ShaderMaterial({
    uniforms: { uWaveR: { value: -10 }, uWaveA: { value: 0 }, uWaveC: { value: new THREE.Color('#6366f1') }, uTime: { value: 0 } },
    vertexShader: 'varying vec3 vP; void main(){ vec4 w = modelMatrix * vec4(position,1.); vP = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: `
      varying vec3 vP; uniform float uWaveR, uWaveA, uTime; uniform vec3 uWaveC;
      void main(){
        float r = length(vP.xz);
        float ringD = abs(fract(r / 2.5 + .5) - .5) * 2.5;
        float ring = 1. - smoothstep(0., .045, ringD);
        float a = atan(vP.z, vP.x);
        float step = 6.2831853 / 36.;
        float spokeD = abs(fract(a / step + .5) - .5) * step * r;
        float spoke = (1. - smoothstep(0., .03, spokeD)) * smoothstep(3., 6., r);
        float fade = smoothstep(32., 3., r);
        vec3 col = vec3(.28, .34, .9) * (ring * .32 + spoke * .12) * fade;
        col += vec3(.1, .12, .3) * smoothstep(9., 0., r) * .35;
        float wave = exp(-pow((r - uWaveR) * 1.4, 2.)) * uWaveA * fade;
        col += uWaveC * wave * 1.6;
        gl_FragColor = vec4(col + vec3(.012, .014, .028), 1.);
      }`
  });
  const floor = new THREE.Mesh(new THREE.CircleGeometry(34, 96), floorMat);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // The router core.
  const core = new THREE.Group();
  core.position.set(0, 2.4, 0);
  const heart = new THREE.Mesh(new THREE.SphereGeometry(0.62, 48, 48), new THREE.MeshBasicMaterial({ color: '#a5b4fc' }));
  core.add(heart);
  const shell = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.15, 1)), new THREE.LineBasicMaterial({ color: '#6366f1', transparent: true, opacity: 0.75 }));
  core.add(shell);
  const rings = [1.7, 2.2, 2.75].map((r, i) => {
    const m = new THREE.Mesh(new THREE.TorusGeometry(r, 0.022, 8, 160), new THREE.MeshBasicMaterial({ color: ['#818cf8', '#a78bfa', '#38bdf8'][i], transparent: true, opacity: 0.8 }));
    m.rotation.set(Math.random() * 3, Math.random() * 3, 0);
    core.add(m);
    return m;
  });
  const coreLight = new THREE.PointLight('#8b9cff', 30, 18, 2);
  core.add(coreLight);
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.6, 0.9, 6), new THREE.MeshStandardMaterial({ color: '#0b0e1a', metalness: 0.7, roughness: 0.35 }));
  pedestal.position.y = 0.45;
  scene.add(pedestal, core);
  const coreTag = tag('ROUTER', 'gate-tag');
  coreTag.position.set(0, 3.2, 0);
  core.add(coreTag);

  // Agents on the outer ring, grouped by the lane that usually reaches them;
  // each lane's gate stands in front of its group.
  const order = ['SIMPLE', 'SPECIALIZED', 'PARALLEL', 'HIGH_RISK'];
  const total = order.reduce((n, l) => n + HOME[l].length, 0);
  const agents = {};
  const gates = {};
  let slot = 0;
  const R = 14;
  for (const lane of order) {
    const ids = HOME[lane].filter((id) => data.agents.some((a) => a.id === id));
    const a0 = (slot / total) * Math.PI * 2;
    ids.forEach((id, k) => {
      const ang = ((slot + k + 0.5) / total) * Math.PI * 2;
      const h = 0.9 + ((k * 37) % 7) * 0.12;
      const g = new THREE.Group();
      g.position.set(Math.cos(ang) * R, 0, Math.sin(ang) * R);
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.72, h, 6), new THREE.MeshStandardMaterial({ color: '#0d1122', metalness: 0.65, roughness: 0.32 }));
      body.position.y = h / 2;
      const capMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(LANES[lane].color).multiplyScalar(0.28) });
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.07, 6), capMat);
      cap.position.y = h + 0.04;
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.32, 9, 12, 1, true), new THREE.MeshBasicMaterial({ color: LANES[lane].color, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
      beam.position.y = h + 4.5;
      const label = agentChip(id, lane);
      label.position.set(0, h + 0.7, 0);
      g.add(body, cap, beam, label);
      scene.add(g);
      agents[id] = { group: g, cap, capMat, beam, label, lane, h, base: new THREE.Color(LANES[lane].color) };
    });
    const mid = ((slot + ids.length / 2) / total) * Math.PI * 2;
    const gate = new THREE.Group();
    gate.position.set(Math.cos(mid) * 7.4, 0, Math.sin(mid) * 7.4);
    gate.lookAt(0, 0, 0);
    const arch = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.075, 12, 64, Math.PI), new THREE.MeshBasicMaterial({ color: new THREE.Color(LANES[lane].color).multiplyScalar(0.45) }));
    const posts = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.12, 0.5), new THREE.MeshStandardMaterial({ color: '#0d1122', metalness: 0.6, roughness: 0.4 }));
    posts.position.y = 0.06;
    const gl = tag(LANES[lane].label, 'gate-tag');
    gl.element.style.color = LANES[lane].color;
    gl.position.set(0, 2.05, 0);
    gate.add(arch, posts, gl);
    scene.add(gate);
    gates[lane] = { group: gate, arch, label: gl, color: new THREE.Color(LANES[lane].color), angle: mid };
    slot += ids.length;
  }

  // Dust drifting up through the room.
  const N = small ? 500 : 1400;
  const dustPos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const r = 3 + Math.random() * 27, a = Math.random() * Math.PI * 2;
    dustPos.set([Math.cos(a) * r, Math.random() * 14, Math.sin(a) * r], i * 3);
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: '#9aa8ff', size: 0.06, transparent: true, opacity: 0.55, depthWrite: false }));
  scene.add(dust);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth / (small ? 2 : 1), innerHeight / (small ? 2 : 1)), 1.05, 0.55, 0.18);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  function agentChip(id, lane) {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'agent-chip';
    el.style.setProperty('--c', LANES[lane].color);
    el.innerHTML = `${avatarHTML(id, lane)}<span>${shortName(id)}</span>`;
    el.setAttribute('aria-label', `${shortName(id)}: ver qué hace`);
    el.addEventListener('click', (e) => { e.stopPropagation(); dispatchEvent(new CustomEvent('agent-open', { detail: id })); });
    return new CSS2DObject(el);
  }

  function tag(text, cls = 'tag') {
    const el = document.createElement('div');
    el.className = cls === 'tag' ? 'tag' : `tag ${cls}`;
    el.textContent = text;
    return new CSS2DObject(el);
  }

  // --- tweens: every animation is a promise driven by the render loop.
  const tweens = new Set();
  const tween = (ms, fn, ease = (p) => 1 - (1 - p) ** 3) => new Promise((res) => {
    tweens.add({ t0: performance.now(), ms: ms * speed, fn, ease, res });
  });

  // An orb with a fading trail.
  function orb(color) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.26, 24, 24), new THREE.MeshBasicMaterial({ color }));
    const light = new THREE.PointLight(color, 14, 8, 2);
    mesh.add(light);
    const TL = 36;
    const trailPos = new Float32Array(TL * 3);
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
    const trail = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending }));
    trail.frustumCulled = false;
    scene.add(mesh, trail);
    const pts = [];
    const o = {
      mesh,
      setColor(c) { mesh.material.color.set(c); light.color.set(c); trail.material.color.set(c); },
      place(v) {
        mesh.position.copy(v);
        pts.unshift(v.clone());
        if (pts.length > TL) pts.pop();
        for (let i = 0; i < TL; i++) { const p = pts[Math.min(i, pts.length - 1)]; trailPos.set([p.x, p.y, p.z], i * 3); }
        trailGeo.attributes.position.needsUpdate = true;
      },
      async fly(to, ms, lift = 3) {
        const from = mesh.position.clone();
        const mid = from.clone().lerp(to, 0.5);
        mid.y += lift;
        const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
        await tween(ms, (p) => o.place(curve.getPoint(p)), (p) => (p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2));
      },
      async fade(ms = 500) {
        await tween(ms, (p) => { mesh.scale.setScalar(1 - p); trail.material.opacity = 0.8 * (1 - p); });
        scene.remove(mesh, trail);
        mesh.geometry.dispose(); trailGeo.dispose();
      }
    };
    return o;
  }

  let pulse = 0;
  function wave(color) {
    floorMat.uniforms.uWaveC.value.set(color);
    return tween(1600, (p) => { floorMat.uniforms.uWaveR.value = p * 30; floorMat.uniforms.uWaveA.value = 1 - p; }, (p) => p);
  }

  function lightGate(lane, on) {
    for (const [k, g] of Object.entries(gates)) {
      const active = on && k === lane;
      g.arch.material.color.copy(g.color).multiplyScalar(active ? 1.6 : 0.45);
      g.label.element.classList.toggle('on', active);
    }
  }

  function lightAgent(id, on) {
    const a = agents[id];
    if (!a) return;
    a.label.element.classList.toggle('on', on);
    tween(700, (p) => {
      const k = on ? p : 1 - p;
      a.capMat.color.copy(a.base).multiplyScalar(0.28 + k * 1.5);
      a.beam.material.opacity = k * 0.5;
      a.group.position.y = k * 0.5;
    });
  }

  function resetAgents() {
    for (const id of Object.keys(agents)) if (agents[id].label.element.classList.contains('on')) lightAgent(id, false);
    lightGate(null, false);
  }

  const agentTop = (id) => {
    const a = agents[id];
    return new THREE.Vector3(a.group.position.x, a.h + 1.4, a.group.position.z);
  };
  const gatePoint = (lane) => gates[lane].group.position.clone().setY(1.3);

  // Camera moves: stand behind the router and look out at a point (a gate,
  // then the chosen agent), or go back to the overview.
  let camGoal = null;
  function focus(point) {
    if (!point) { camGoal = { pos: home.clone(), target: new THREE.Vector3(0, 1.5, 0) }; return; }
    // From just past the router, high up, looking out at the point: the
    // core stays below the frame instead of filling it.
    const flat = new THREE.Vector3(point.x, 0, point.z);
    const out = flat.lengthSq() > 0.01 ? flat.clone().normalize() : new THREE.Vector3(0, 0, 1);
    const reach = Math.min(flat.length(), 14);
    camGoal = {
      pos: out.clone().multiplyScalar(reach * 0.3 - (small ? 9 : 5)).setY(small ? 15 : 11),
      target: out.clone().multiplyScalar(reach * 0.85).setY(1.2)
    };
  }

  // Intro: descend from above into the room.
  camGoal = { pos: home.clone(), target: controls.target.clone(), slow: true };

  let running = true;
  const clock = new THREE.Clock();
  // Adaptive quality: watch the first ~2 s of real frames; if this device
  // struggles, drop the bloom pass and render at 1x (the look stays, the
  // glow gets simpler).
  let lite = false;
  const probe = [];
  function frame() {
    const raw = clock.getDelta();
    if (!lite && probe.length < 120) {
      if (clock.elapsedTime > 1.2) probe.push(raw * 1000);
      if (probe.length === 120) {
        const sorted = [...probe].sort((a, b) => a - b);
        if (sorted[60] > 24) {
          lite = true;
          renderer.setPixelRatio(1);
          renderer.setSize(innerWidth, innerHeight);
          dust.visible = false;
        }
      }
    }
    const dt = Math.min(raw, 0.05);
    const t = clock.elapsedTime;
    const now = performance.now();
    for (const tw of tweens) {
      const p = Math.min(1, (now - tw.t0) / tw.ms);
      tw.fn(tw.ease(p));
      if (p >= 1) { tweens.delete(tw); tw.res(); }
    }
    pulse = Math.max(0, pulse - dt * 1.8);
    heart.scale.setScalar(1 + Math.sin(t * 2.2) * 0.04 + pulse * 0.45);
    heart.material.color.setHSL(0.64, 0.9, 0.78 + pulse * 0.2);
    coreLight.intensity = 30 + pulse * 90;
    shell.rotation.y += dt * (0.25 + pulse * 3);
    shell.rotation.x += dt * 0.08;
    rings.forEach((r, i) => { r.rotation.x += dt * (0.2 + i * 0.13) * (1 + pulse * 4); r.rotation.y += dt * (0.15 - i * 0.05); });
    const dp = dust.geometry.attributes.position;
    for (let i = 0; i < N; i++) { let y = dp.getY(i) + dt * 0.25; if (y > 14) y = 0; dp.setY(i, y); }
    dp.needsUpdate = true;
    if (camGoal) {
      const k = camGoal.slow ? 0.018 : 0.04;
      camera.position.lerp(camGoal.pos, k);
      controls.target.lerp(camGoal.target, k);
      if (camera.position.distanceTo(camGoal.pos) < 0.05) camGoal = null;
    }
    controls.update();
    if (lite) renderer.render(scene, camera); else composer.render();
    labels.render(scene, camera);
  }
  renderer.setAnimationLoop(frame);

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    composer.setSize(innerWidth, innerHeight);
    labels.setSize(innerWidth, innerHeight);
  });
  document.addEventListener('visibilitychange', () => {
    running = document.visibilityState === 'visible';
    renderer.setAnimationLoop(running ? frame : null);
    if (running) clock.getDelta();
  });
  // Any drag hands the camera back to the visitor.
  controls.addEventListener('start', () => { camGoal = null; });

  return {
    gates, agents,
    orb, wave, focus, lightGate, lightAgent, resetAgents, agentTop, gatePoint,
    corePoint: () => new THREE.Vector3(0, 2.4, 0),
    kick: () => { pulse = 1; },
    spawnPoint: () => { const a = Math.random() * Math.PI * 2; return new THREE.Vector3(Math.cos(a) * 26, 1.2, Math.sin(a) * 26); },
    autoRotate: (on) => { controls.autoRotate = on && !reduceMotion; },
    ready: () => sleep(50)
  };
}


// ------------------------------------------------------------------ sound
// Synthesized with Web Audio: no files to download. Off until the visitor
// turns it on (browsers also require a click before any audio).
const Sound = (() => {
  let ctx = null, master = null, drone = null, on = false;
  const ensure = () => {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0.0; master.connect(ctx.destination);
    // Ambient: two detuned low oscillators through a slow filter.
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 380; f.Q.value = 0.7;
    const g = ctx.createGain(); g.gain.value = 0.05; f.connect(g); g.connect(master);
    drone = [55, 55.4, 82.5].map((hz) => { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = hz; o.connect(f); o.start(); return o; });
    const lfo = ctx.createOscillator(); const lg = ctx.createGain(); lfo.frequency.value = 0.07; lg.gain.value = 140; lfo.connect(lg); lg.connect(f.frequency); lfo.start();
  };
  const tone = (hz, dur = 0.18, type = 'sine', vol = 0.14, slideTo) => {
    if (!on) return;
    const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(hz, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.02);
  };
  const noise = (dur = 0.6, from = 300, to = 2400, vol = 0.12) => {
    if (!on) return;
    const t = ctx.currentTime, len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource(); src.buffer = buf;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.2;
    bp.frequency.setValueAtTime(from, t); bp.frequency.exponentialRampToValueAtTime(to, t + dur);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.4); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(bp); bp.connect(g); g.connect(master); src.start(t);
  };
  return {
    get on() { return on; },
    toggle() {
      ensure();
      on = !on;
      if (ctx.state === 'suspended') ctx.resume();
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(on ? 0.9 : 0, ctx.currentTime + 0.4);
      return on;
    },
    whoosh: (ms = 900) => noise(ms / 1000, 250, 2600, 0.1),
    tick: (hit) => tone(hit ? 880 : 520, hit ? 0.22 : 0.08, hit ? 'triangle' : 'sine', hit ? 0.12 : 0.05),
    lane: () => { tone(392, 0.5, 'triangle', 0.08); setTimeout(() => tone(587, 0.6, 'triangle', 0.07), 90); },
    chime: () => [659, 988, 1319].forEach((hz, i) => setTimeout(() => tone(hz, 0.7, 'sine', 0.09), i * 70)),
    alarm: () => [0, 260].forEach((d) => setTimeout(() => tone(740, 0.2, 'square', 0.05, 520), d)),
    blip: () => tone(1200 + Math.random() * 400, 0.06, 'sine', 0.04)
  };
})();

// --------------------------------------------------------------- the HUD
const steps = $('#steps');
const receipt = $('#receipt');
const trace = $('#trace');
const profile = $('#profile');
let busy = false;

const STEP_NAMES = {
  riesgo: '¿Es riesgoso?', 'agente explícito': '¿Nombra a un agente?', paralelismo: '¿Pide trabajo en paralelo?', especialista: '¿Es de un tema especial?', SIMPLE: 'Nada de lo anterior → SIMPLE'
};

// Lane legend: always on screen, lights up with the chosen lane.
function renderLegend() {
  $('#legend').innerHTML = Object.entries(LANE_INFO).map(([k, v]) => `
    <li data-lane="${k}" style="--c:${LANES[k].color}"><i></i><span><b>${v.title}</b>${v.short}</span></li>`).join('');
}
function markLegend(lane) {
  document.querySelectorAll('#legend li').forEach((li) => li.classList.toggle('on', li.dataset.lane === lane));
}

function plainSentence(r, cancelled) {
  const who = (id) => `<b>${shortName(id)}</b>`;
  if (cancelled) return `No se ejecuta: era ${r.lane} y no lo aprobaste. En el sistema real pasa lo mismo, sin tu OK no se toca nada.`;
  const base = r.support.length
    ? `Lo encara ${who(r.primary)} con ayuda de ${r.support.map(who).join(', ')}.`
    : `Lo hace ${who(r.primary)}, solo.`;
  const extra = r.lane === 'HIGH_RISK'
    ? ' Recién arranca con tu aprobación y tiene que pasar por <b>validation.md</b>: evidencia antes de darlo por cerrado.'
    : r.components.length ? ` Sigue el workflow <b>${r.components[0].split('/').pop()}</b>.` : '';
  return `${base}${extra} Tiene hasta ${r.budgets.maxIterations} intentos y ${r.budgets.maxReplans} replanes; si falla igual, se frena en vez de girar en falso.`;
}

function renderReceipt(r, cancelled = false) {
  const c = LANES[r.lane].color;
  receipt.innerHTML = `
    <div class="who">${avatarHTML(r.primary, r.lane, 44)}<div><span class="lane-pill" style="--c:${c}">${r.lane}</span><strong>${shortName(r.primary)}</strong></div></div>
    <p class="plain">${plainSentence(r, cancelled)}</p>
    <div class="budget">
      <span title="Cuántas vueltas de trabajo puede dar"><b>${r.budgets.maxIterations}</b>intentos</span>
      <span title="Cuántas veces puede rehacer el plan"><b>${r.budgets.maxReplans}</b>replanes</span>
      <span title="Cuántos agentes pueden trabajar a la vez"><b>${r.budgets.maxAgents}</b>agentes máx.</span>
    </div>
    <details class="raw"><summary>Ver la ruta técnica</summary>
      <dl class="kv">
        <dt>primary</dt><dd>${r.primary}</dd>
        <dt>support</dt><dd>${r.support.join(', ') || '—'}</dd>
        <dt>components</dt><dd>${r.components.join(', ') || '—'}</dd>
        <dt>reasons</dt><dd>${r.reasons.join(', ')}</dd>
      </dl>
    </details>`;
  receipt.classList.add('show');
}

// Agent profile card: who it is, what it does, what words make the router
// pick it (read straight from the rules).
function openProfile(id) {
  const p = PROFILES[id] || {};
  const lane = laneOf(id);
  const rule = [...data.rules.specialists, ...data.rules.highRisk].find((r) => r.primary === id);
  const words = rule ? [...new Set(rule.patterns.map(readable).filter(Boolean))].slice(0, 6) : [];
  const example = data.cases.find((c) => c.expected.primary === id);
  profile.innerHTML = `
    <button class="trace-close" type="button" aria-label="Cerrar">×</button>
    <div class="who">${avatarHTML(id, lane, 64)}<div><strong>${shortName(id)}</strong><code>${id}</code></div></div>
    <p>${p.role || ''}</p>
    <h2>¿Cuándo le toca?</h2>
    <p>${p.when || ''}</p>
    ${words.length ? `<div class="words">${words.map((w) => `<span>${w}</span>`).join('')}</div>` : ''}
    ${example ? `<button class="btn primary try" type="button">Probar: «${example.task.title}»</button>` : ''}`;
  profile.querySelector('.trace-close').onclick = () => profile.classList.remove('show');
  const tryBtn = profile.querySelector('.try');
  if (tryBtn) tryBtn.onclick = () => { profile.classList.remove('show'); play(example.task); };
  trace.classList.remove('show');
  profile.classList.add('show');
  if (stage) { stage.resetAgents(); stage.lightAgent(id, true); stage.focus(stage.agentTop(id)); stage.autoRotate(false); }
}
addEventListener('agent-open', (e) => { if (!busy) openProfile(e.detail); });

function askApproval(r, task) {
  return new Promise((resolve) => {
    $('#gate-text').textContent = `«${task.title}» cae en HIGH_RISK (${r.reasons[0]}). En el sistema real ningún agente toca credenciales, pagos, producción, mensajes externos ni borra datos sin una aprobación explícita. Lo decidís vos.`;
    const gate = $('#gate');
    gate.classList.add('show');
    $('#gate-yes').focus();
    const done = (ok) => { gate.classList.remove('show'); $('#gate-yes').onclick = $('#gate-no').onclick = null; removeEventListener('keydown', esc); resolve(ok); };
    const esc = (e) => { if (e.key === 'Escape') done(false); };
    addEventListener('keydown', esc);
    $('#gate-yes').onclick = () => done(true);
    $('#gate-no').onclick = () => done(false);
  });
}

const lock = (on) => document.querySelectorAll('.console button, #run-evals, #tour-open').forEach((b) => { b.disabled = on; });

async function play(task) {
  if (busy) return;
  busy = true;
  lock(true);
  endTour();
  profile.classList.remove('show');
  const r = Router.route(task, data);
  const color = LANES[r.lane].color;
  $('#task-text').textContent = task.body ? `${task.title}. ${task.body}` : task.title;
  steps.innerHTML = '';
  receipt.classList.remove('show');
  trace.classList.add('show');
  markLegend(null);

  if (stage) { stage.autoRotate(false); stage.resetAgents(); stage.focus(null); }
  const o = stage && stage.orb('#c7d2fe');
  if (o) { o.place(stage.spawnPoint()); Sound.whoosh(1100); await o.fly(stage.corePoint(), 1100, 4); stage.kick(); }

  // Walk the precedence exactly as the router did.
  for (const s of r.trace) {
    const li = document.createElement('li');
    li.innerHTML = `<span class="mark">${s.hit ? '✓' : '·'}</span><span><b>${STEP_NAMES[s.step] || s.step}</b><small></small></span>`;
    li.querySelector('small').textContent = s.hit ? s.detail : `No: ${s.detail}`;
    li.style.setProperty('--c', color);
    steps.appendChild(li);
    await sleep(40);
    li.classList.add('done');
    if (s.hit) li.classList.add('hit');
    Sound.tick(s.hit);
    if (stage) stage.kick();
    await sleep(420 * speed);
  }
  markLegend(r.lane);
  Sound.lane();

  let cancelled = false;
  if (stage) {
    o.setColor(color);
    stage.wave(color);
    stage.lightGate(r.lane, true);
    stage.focus(stage.gatePoint(r.lane));
    Sound.whoosh(900);
    await o.fly(stage.gatePoint(r.lane), 900, 1.5);
  }
  if (r.lane === 'HIGH_RISK') Sound.alarm();
  if (r.lane === 'HIGH_RISK') cancelled = !(await askApproval(r, task));

  if (!cancelled && stage) {
    stage.focus(stage.agentTop(r.primary));
    const helpers = r.support.map(() => { const h = stage.orb(color); h.place(o.mesh.position.clone()); return h; });
    await Promise.all([o.fly(stage.agentTop(r.primary), 900, 2), ...helpers.map((h, i) => h.fly(stage.agentTop(r.support[i]), 1000, 2.5))]);
    stage.lightAgent(r.primary, true);
    r.support.forEach((id) => stage.lightAgent(id, true));
    Sound.chime();
    await Promise.all(helpers.map((h) => h.fade()));
  }
  if (o) await o.fade();
  renderReceipt(r, cancelled);
  if (stage) setTimeout(() => { if (!busy) { stage.focus(null); stage.autoRotate(true); } }, 3500);
  busy = false;
  lock(false);
}

async function runEvals() {
  if (busy) return;
  busy = true;
  endTour();
  trace.classList.remove('show');
  profile.classList.remove('show');
  const box = $('#evals');
  box.classList.add('show');
  lock(true);
  if (stage) { stage.resetAgents(); stage.focus(null); }
  let ok = 0, n = 0;
  const flights = [];
  for (const c of data.cases) {
    const res = Router.checkCase(c, data);
    n++;
    if (res.ok) ok++;
    box.innerHTML = `Pruebas del repo: <b>${ok}/${n}</b> ✓<br><span>${c.task.title}</span>`;
    Sound.blip();
    if (stage) {
      const r = res.route;
      const o = stage.orb(LANES[r.lane].color);
      o.place(stage.corePoint());
      stage.kick();
      flights.push(o.fly(stage.gatePoint(r.lane), 500, 1).then(() => o.fly(stage.agentTop(r.primary), 520, 1.5)).then(() => { stage.lightAgent(r.primary, true); return o.fade(250); }));
    }
    await sleep(170 * speed);
  }
  await Promise.all(flights);
  box.innerHTML = `<b>${ok}/${data.cases.length}</b> pruebas del repo pasan: para cada pedido de prueba, el router elige el carril y el agente que el caso espera.`;
  setTimeout(() => stage && stage.resetAgents(), 2500);
  lock(false);
  busy = false;
}

function renderChips() {
  const box = $('#chips');
  box.innerHTML = '';
  for (const text of MISSIONS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = text;
    b.addEventListener('click', () => play({ title: text, body: '', labels: [] }));
    box.appendChild(b);
  }
}

// ---------------------------------------------------------------- the tour
const TOUR = [
  { title: 'Mi sistema de agentes', text: 'Uso 19 asistentes de IA para construir mis proyectos (JobBot, este portfolio…). Cada uno tiene un rol: programar, testear, diseñar, cuidar la seguridad.', at: () => stage && stage.focus(null) },
  { title: 'El router, en el centro', text: 'Cuando le pido algo en lenguaje normal, el router decide quién lo hace. No adivina: sigue reglas que escribí, en un orden fijo.', at: () => stage && stage.focus(stage.corePoint().setY(0.5)) },
  { title: '4 carriles', text: 'SIMPLE, SPECIALIZED, PARALLEL y HIGH_RISK. Cada uno tiene su portal y sus límites. Lo riesgoso (producción, pagos, credenciales) siempre pide mi aprobación.', at: () => { if (stage) { stage.focus(stage.gatePoint('HIGH_RISK')); stage.lightGate('HIGH_RISK', true); } markLegend('HIGH_RISK'); } },
  { title: 'Probalo', text: 'Tocá un agente para ver qué hace, elegí una misión de abajo o escribí tu propio pedido.', at: () => { if (stage) { stage.lightGate(null, false); stage.focus(null); } markLegend(null); } }
];
let tourStep = -1;
function showTour(i) {
  tourStep = i;
  const t = TOUR[i];
  $('#tour-title').textContent = t.title;
  $('#tour-text').textContent = t.text;
  $('#tour-count').textContent = `${i + 1}/${TOUR.length}`;
  $('#tour-next').textContent = i === TOUR.length - 1 ? 'Empezar' : 'Siguiente';
  $('#tour').classList.add('show');
  if (stage) stage.autoRotate(false);
  t.at();
}
function endTour() {
  if (tourStep < 0) return;
  tourStep = -1;
  $('#tour').classList.remove('show');
  if (stage && !busy) stage.autoRotate(true);
  try { localStorage.setItem('lab-tour-done', '1'); } catch (_e) {}
}
$('#tour-next').addEventListener('click', () => (tourStep < TOUR.length - 1 ? showTour(tourStep + 1) : endTour()));
$('#tour-skip').addEventListener('click', endTour);
$('#tour-open').addEventListener('click', () => { trace.classList.remove('show'); profile.classList.remove('show'); showTour(0); });

$('#ask').addEventListener('submit', (e) => {
  e.preventDefault();
  const text = $('#ask-input').value.trim();
  if (!text) return;
  play({ title: text, body: '', labels: [], riskLevel: 'low', requiresApproval: false });
});
$('#run-evals').addEventListener('click', runEvals);
$('#sound').addEventListener('click', (e) => {
  const on = Sound.toggle();
  e.currentTarget.setAttribute('aria-pressed', String(on));
  e.currentTarget.textContent = on ? '🔊 Sonido' : '🔈 Sonido';
});
$('#trace-close').addEventListener('click', () => trace.classList.remove('show'));
renderChips();
renderLegend();

if (stage) await stage.ready();
window.__labReady = true;
setTimeout(() => $('#intro').classList.add('gone'), reduceMotion ? 0 : 400);
let seen = false;
try { seen = localStorage.getItem('lab-tour-done') === '1'; } catch (_e) {}
if (!seen) setTimeout(() => showTour(0), reduceMotion ? 0 : 1600);
