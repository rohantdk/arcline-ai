/* Arcline — "Murmuration"
   A flock of square dots (the logo's full stop, many times over) lives beside the page.
   As the page scrolls it streams, like starlings, into a figure for the section in view:
   the "a." mark, a pile of loose papers, three bars, a vault, four blocks, a staircase,
   one block with an orbit, a clock, two chat bubbles, and the "a." again. Chaos into order:
   what the AI does to paperwork.
   - Wide screens: a dark stage on the right; the page reads in the column on the left.
   - Phones: the flock lives behind the page and shows in the gaps between sections.
   - Mouse only: the flock swirls away from the cursor; a click on the stage scatters it.
     Pointing at anything with a job colour (tiles, stats, cards) lights up that colour.
   Without JavaScript there is no flock and the page is the usual one. Under reduced motion
   the dots jump straight to each figure and never drift.
*/

(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const wideQ = matchMedia('(min-width: 1100px)');
  const $  = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  const css = getComputedStyle(root);
  const tok = (n) => css.getPropertyValue('--' + n).trim();
  // the palette, light versions first: the stage is dark
  const PAL = [
    ['paper', tok('paper'), null], ['on-band', tok('on-band'), null],
    ['docs-light', tok('docs-light'), 'docs'], ['queries-light', tok('queries-light'), 'queries'],
    ['reports-light', tok('reports-light'), 'reports'], ['accent-soft', tok('accent-soft'), 'docs'],
    ['accent', tok('accent'), 'docs'], ['queries', tok('queries'), 'queries'], ['reports', tok('reports'), 'reports'],
  ].map(([name, hex, job]) => {
    const n = parseInt(hex.replace('#', ''), 16);
    return { name, hex, job, r: n >> 16 & 255, g: n >> 8 & 255, b: n & 255 };
  });
  const P = Object.fromEntries(PAL.map(p => [p.name, p.hex]));

  /* ─── the stage ─── */
  const stage = document.createElement('div');
  stage.className = 'swarm';
  stage.setAttribute('aria-hidden', 'true');
  stage.innerHTML = '<canvas></canvas><p class="swarm__label"><b></b><span></span></p>';
  document.body.append(stage);
  const cv = $('canvas', stage);
  const ctx = cv.getContext('2d');
  const labelN = $('.swarm__label b', stage), labelT = $('.swarm__label span', stage);
  root.classList.add('has-swarm');

  // sections in page order, each with its figure
  const FIG = { problem: 'pile', build: 'columns', why: 'vault', proof: 'four', process: 'stairs', pilot: 'one', cost: 'clock', questions: 'bubbles', contact: 'markEnd' };
  const sections = [{ el: $('.hero'), fig: 'mark', label: 'Arcline' }].concat(
    $$('main > section[id]').filter(s => FIG[s.id]).map(s => ({ el: s, fig: FIG[s.id], label: ($('.eyebrow', s) || {}).textContent || '' }))
  );

  /* ─── figures, drawn on a hidden canvas and sampled into points ─── */
  let W = 0, H = 0, dpr = 1, N = 0;
  const off = document.createElement('canvas');
  const og = off.getContext('2d', { willReadFrequently: true });

  let seed = 1;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  const DRAW = {
    mark(g, cx, cy, S, end) {
      const u = Math.min(W * 0.78 / 119, H * 0.42 / 53, S / 70);
      const ox = cx - 46.5 * u, oy = cy - 50 * u;
      g.lineWidth = 13 * u; g.lineCap = 'butt'; g.strokeStyle = P.paper;
      g.beginPath(); g.arc(ox + 20 * u, oy + 50 * u, 20 * u, 0, Math.PI * 2); g.stroke();
      g.beginPath(); g.moveTo(ox + 40 * u, oy + 17 * u); g.lineTo(ox + 40 * u, oy + 76.5 * u); g.stroke();
      g.beginPath(); g.moveTo(ox - 13 * u, oy + 70 * u); g.lineTo(ox + 62.3 * u, oy + 70 * u); g.stroke();
      const dots = end ? [[72, 'docs-light']] : [[72, 'docs-light'], [86.7, 'queries-light'], [101.3, 'reports-light']];
      dots.forEach(([x, c]) => { g.fillStyle = P[c]; g.fillRect(ox + (x - 5) * u, oy + 65 * u, 10 * u, 10 * u); });
    },
    markEnd(g, cx, cy, S) { DRAW.mark(g, cx, cy, S, true); },
    pile(g, cx, cy, S) {
      seed = 7;
      for (let i = 0; i < 13; i++) {
        g.save();
        g.translate(cx + (rnd() - 0.5) * S * 0.8, cy + (rnd() - 0.5) * S * 0.75);
        g.rotate((rnd() - 0.5) * 1.1);
        g.lineWidth = Math.max(3, S * 0.012);
        g.strokeStyle = i % 5 === 2 ? P['queries-light'] : i % 4 === 0 ? P.paper : P['on-band'];
        const w = S * (0.22 + rnd() * 0.1), h = w * 1.35;
        g.strokeRect(-w / 2, -h / 2, w, h);
        // a few lines of "text" on some sheets
        if (i % 3 === 0) for (let k = 1; k < 4; k++) g.strokeRect(-w * 0.3, -h / 2 + k * h * 0.22, w * 0.6, 0.5);
        g.restore();
      }
    },
    columns(g, cx, cy, S) {
      const bw = S * 0.2, gap = S * 0.09, base = cy + S * 0.42;
      [[0.95, 'docs-light'], [0.7, 'queries-light'], [0.5, 'reports-light']].forEach(([hgt, c], i) => {
        g.fillStyle = P[c];
        const x = cx - bw * 1.5 - gap + i * (bw + gap);
        g.fillRect(x, base - S * hgt, bw, S * hgt);
      });
    },
    vault(g, cx, cy, S) {
      const s = S * 0.82;
      g.lineWidth = S * 0.055; g.strokeStyle = P.paper;
      g.strokeRect(cx - s / 2, cy - s / 2, s, s);
      g.fillStyle = P['docs-light']; g.fillRect(cx - S * 0.11, cy - S * 0.11, S * 0.22, S * 0.22);
    },
    four(g, cx, cy, S) {
      const s = S * 0.36, gap = S * 0.1;
      ['docs-light', 'queries-light', 'reports-light', 'paper'].forEach((c, i) => {
        const x = cx - s - gap / 2 + (i % 2) * (s + gap), y = cy - s - gap / 2 + Math.floor(i / 2) * (s + gap);
        g.lineWidth = S * 0.045; g.strokeStyle = P[c]; g.strokeRect(x, y, s, s);
        g.fillStyle = P[c]; g.fillRect(x + s * 0.66, y + s * 0.66, s * 0.34, s * 0.34);
      });
    },
    stairs(g, cx, cy, S) {
      const bw = S * 0.22, base = cy + S * 0.45;
      ['on-band', 'accent-soft', 'docs-light', 'paper'].forEach((c, i) => {
        g.fillStyle = P[c];
        const h = S * 0.22 * (i + 1);
        g.fillRect(cx - bw * 2 + i * bw + 3, base - h, bw - 6, h);
      });
    },
    one(g, cx, cy, S) {
      g.lineWidth = Math.max(2, S * 0.012); g.strokeStyle = P['on-band'];
      g.beginPath(); g.arc(cx, cy, S * 0.5, 0, Math.PI * 2); g.stroke();
      g.beginPath(); g.arc(cx, cy, S * 0.34, 0, Math.PI * 2); g.stroke();
      g.fillStyle = P['docs-light']; g.fillRect(cx - S * 0.15, cy - S * 0.15, S * 0.3, S * 0.3);
    },
    clock(g, cx, cy, S) {
      g.lineWidth = S * 0.06; g.strokeStyle = P['reports-light'];
      g.beginPath(); g.arc(cx, cy, S * 0.44, 0, Math.PI * 2); g.stroke();
      g.strokeStyle = P.paper; g.lineCap = 'butt';
      g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx, cy - S * 0.3); g.stroke();
      g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + S * 0.22, cy); g.stroke();
      g.fillStyle = P['queries-light']; g.fillRect(cx - S * 0.05, cy - S * 0.05, S * 0.1, S * 0.1);
      for (let k = 0; k < 12; k++) {
        const a = k * Math.PI / 6;
        g.fillStyle = P['on-band'];
        g.fillRect(cx + Math.cos(a) * S * 0.56 - 3, cy + Math.sin(a) * S * 0.56 - 3, 6, 6);
      }
    },
    bubbles(g, cx, cy, S) {
      const bub = (x, y, w, h, c, left) => {
        g.fillStyle = P[c];
        g.beginPath(); g.roundRect(x, y, w, h, [h * 0.4, h * 0.4, left ? h * 0.4 : h * 0.12, left ? h * 0.12 : h * 0.4]); g.fill();
      };
      bub(cx - S * 0.55, cy - S * 0.4, S * 0.7, S * 0.26, 'on-band', true);
      bub(cx - S * 0.15, cy + S * 0.02, S * 0.7, S * 0.36, 'docs-light', false);
    },
  };

  function sample(fig) {
    const w = Math.ceil(W), h = Math.ceil(H);
    off.width = w; off.height = h;
    og.clearRect(0, 0, w, h);
    const S = wideQ.matches ? Math.min(w * 0.72, h * 0.62) : Math.min(w * 0.62, h * 0.3);
    DRAW[fig](og, w / 2, h / 2, S);
    const data = og.getImageData(0, 0, w, h).data;
    // estimate the drawn area, then pick a grid step that gives about N points
    let area = 0;
    for (let y = 0; y < h; y += 3) for (let x = 0; x < w; x += 3) if (data[(y * w + x) * 4 + 3] > 128) area += 9;
    const step = Math.max(3, Math.sqrt(area / N));
    const pts = [];
    for (let y = step / 2; y < h; y += step) for (let x = step / 2; x < w; x += step) {
      const i = (Math.floor(y) * w + Math.floor(x)) * 4;
      if (data[i + 3] <= 128) continue;
      let best = 0, bd = 1e9;
      PAL.forEach((p, k) => { const d = (p.r - data[i]) ** 2 + (p.g - data[i + 1]) ** 2 + (p.b - data[i + 2]) ** 2; if (d < bd) { bd = d; best = k; } });
      pts.push({ x, y, c: best });
    }
    // exactly N: drop at random, or double up with a little jitter
    seed = 11;
    while (pts.length > N) pts.splice(Math.floor(rnd() * pts.length), 1);
    const base = pts.length;
    for (let k = 0; pts.length < N && base; k++) { const p = pts[k % base]; pts.push({ x: p.x + (rnd() - 0.5) * 2, y: p.y + (rnd() - 0.5) * 2, c: p.c }); }
    return { pts, size: clamp(step * 0.62, 2, 5) };
  }

  /* ─── the flock ─── */
  let X, Y, VX, VY, TX, TY, R, G, B, CI, DL;
  let size = 3, figCache = new Map(), current = -1, transit = 0, frame = 0, angleFor = 0;

  function setup() {
    const r = stage.getBoundingClientRect();
    W = r.width; H = r.height;
    dpr = Math.min(2, devicePixelRatio || 1);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    const n = wideQ.matches ? 1600 : 900;
    if (n !== N || !X) {
      N = n;
      X = new Float32Array(N); Y = new Float32Array(N); VX = new Float32Array(N); VY = new Float32Array(N);
      TX = new Float32Array(N); TY = new Float32Array(N); R = new Float32Array(N); G = new Float32Array(N); B = new Float32Array(N);
      CI = new Uint8Array(N); DL = new Float32Array(N);
      seed = 3;
      for (let i = 0; i < N; i++) { X[i] = rnd() * W; Y[i] = rnd() * H; R[i] = 217; G[i] = 204; B[i] = 220; }
    }
    figCache = new Map();
    const k = current; current = -1;
    go(Math.max(0, k), true);
  }

  function go(k, now) {
    if (k === current) return;
    current = k;
    const sec = sections[k];
    if (!figCache.has(sec.fig)) figCache.set(sec.fig, sample(sec.fig));
    const f = figCache.get(sec.fig);
    size = f.size;
    // particles pour into the figure in a sweep: both sorted along a direction that turns
    angleFor = (angleFor + 2.2) % (Math.PI * 2);
    const ca = Math.cos(angleFor), sa = Math.sin(angleFor);
    const order = Array.from({ length: N }, (_, i) => i).sort((a, b) => (X[a] * ca + Y[a] * sa) - (X[b] * ca + Y[b] * sa));
    const tg = f.pts.slice().sort((a, b) => (a.x * ca + a.y * sa) - (b.x * ca + b.y * sa));
    order.forEach((i, r) => {
      const t = tg[r];
      TX[i] = t.x; TY[i] = t.y; CI[i] = t.c;
      DL[i] = reduce || now ? 0 : (r / N) * 34;   // frames to wait: the stream
      if (reduce) { X[i] = t.x; Y[i] = t.y; const p = PAL[t.c]; R[i] = p.r; G[i] = p.g; B[i] = p.b; }
    });
    transit = 1;
    labelN.textContent = k ? String(k).padStart(2, '0') : '';
    labelT.textContent = sec.label;
    stage.dataset.fig = sec.fig;
    if (reduce) draw();
  }

  /* ─── the pointer ─── */
  let mx = -1e4, my = -1e4, hl = null;
  if (fine && !reduce) {
    addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = stage.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
      const over = wideQ.matches ? e.clientX >= r.left : !e.target.closest('.wrap, .marquee, .nav');
      if (!over) { mx = my = -1e4; }
      const j = e.target.closest('[data-job]');
      hl = j && !j.closest('.swarm') ? j.dataset.job : null;
    }, { passive: true });
    stage.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = stage.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      for (let i = 0; i < N; i++) {
        const dx = X[i] - x, dy = Y[i] - y, d = Math.hypot(dx, dy) || 1;
        if (d < 260) { const f = (1 - d / 260) * 22; VX[i] += dx / d * f; VY[i] += dy / d * f; }
      }
      transit = Math.max(transit, 0.6);
    });
    stage.style.pointerEvents = 'auto';
  }

  /* ─── each frame ─── */
  function tick(t) {
    frame++;
    const time = t / 1000;
    transit = Math.max(0, transit - 0.012);
    const turb = 0.05 + transit * 0.55;
    const R2 = 130 * 130;
    for (let i = 0; i < N; i++) {
      if (DL[i] > 0) DL[i]--;
      const k = DL[i] > 0 ? 0.002 : 0.016;
      let ax = (TX[i] - X[i]) * k, ay = (TY[i] - Y[i]) * k;
      // the flow: a slowly turning field the flock rides between figures
      const fa = Math.sin(Y[i] * 0.011 + time * 0.8) + Math.cos(X[i] * 0.009 - time * 0.6);
      ax += Math.cos(fa * 2.4) * turb; ay += Math.sin(fa * 2.4) * turb;
      const dx = X[i] - mx, dy = Y[i] - my, d2 = dx * dx + dy * dy;
      if (d2 < R2) {
        const d = Math.sqrt(d2) || 1, f = (1 - d / 130) * 1.4;
        ax += dx / d * f - dy / d * f * 0.9; ay += dy / d * f + dx / d * f * 0.9;   // away, and around
      }
      VX[i] = (VX[i] + ax) * 0.88; VY[i] = (VY[i] + ay) * 0.88;
      X[i] += VX[i]; Y[i] += VY[i];
      if (DL[i] <= 0) { const p = PAL[CI[i]]; R[i] += (p.r - R[i]) * 0.06; G[i] += (p.g - G[i]) * 0.06; B[i] += (p.b - B[i]) * 0.06; }
    }
    draw(time);
    requestAnimationFrame(tick);
  }

  function draw(time = 0) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < N; i++) {
      const job = PAL[CI[i]].job;
      let s = size, a = 1;
      if (hl) { if (job === hl) s *= 1.7; else a = 0.22; }
      const sp = Math.hypot(VX[i], VY[i]);
      // a breath at rest; a streak while flying
      const br = reduce ? 0 : Math.sin(time * 1.6 + i * 0.37) * 0.35;
      ctx.globalAlpha = a;
      ctx.fillStyle = `rgb(${R[i] | 0},${G[i] | 0},${B[i] | 0})`;
      if (sp > 2.2) {
        ctx.save(); ctx.translate(X[i], Y[i]); ctx.rotate(Math.atan2(VY[i], VX[i]));
        ctx.fillRect(-s * 0.5 - Math.min(sp, 14), -s * 0.35, s + Math.min(sp, 14), s * 0.7);
        ctx.restore();
      } else ctx.fillRect(X[i] - s / 2 + br, Y[i] - s / 2 - br, s, s);
    }
    ctx.globalAlpha = 1;
  }

  /* ─── which figure: the section in view ─── */
  function pick() {
    const line = innerHeight * (wideQ.matches ? 0.5 : 0.92);
    let k = 0;
    sections.forEach((s, i) => { if (s.el.getBoundingClientRect().top <= line) k = i; });
    go(k);
    // phones: the figure rides in the gap above its section, so the cards don't cover it
    if (!wideQ.matches) {
      const el = sections[current].el;
      const prev = el.previousElementSibling;
      const top = prev ? prev.getBoundingClientRect().bottom : 0;
      const card = el.querySelector('.wrap > *') ? (el.matches('.contact') ? el : el.querySelector('.wrap')) : el;
      const bottom = card.getBoundingClientRect().top;
      const mid = current === 0 ? H / 2 : clamp((top + bottom) / 2, -H, 2 * H);
      cv.style.transform = `translateY(${(mid - H / 2).toFixed(1)}px)`;
    } else cv.style.transform = '';
  }
  let q = false;
  addEventListener('scroll', () => { if (!q) { q = true; requestAnimationFrame(() => { q = false; pick(); }); } }, { passive: true });
  let rz;
  addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { setup(); pick(); }, 120); });

  setup();
  pick();
  if (reduce) draw(); else requestAnimationFrame(tick);
})();
