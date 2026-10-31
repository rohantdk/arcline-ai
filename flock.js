/* Arcline — the flock, in windows on the line
   Each main section has a small dark window beside its heading, sitting on the One Line.
   When it comes into view a flock of square dots (the logo's full stop, many times over)
   streams in and forms a picture of what the heading says: a stack of documents (problem),
   the letters AI (build), a database locked in a square (why), four AI chips (proof), steps
   with the first one lit (process), a calendar week mostly taken by one task (pilot), a
   clock and a stack of coins (cost). Chaos into order.
   - Mouse only: the dots swirl away from the cursor; a click scatters them. Pointing at
     anything with a job colour on the page lights up that colour in the window in view.
   - Only a window on screen animates.
   Without JavaScript the windows are hidden. Under reduced motion each figure is drawn
   at once and never moves.
*/

(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  const css = getComputedStyle(root);
  const PAL = [
    ['paper', null], ['on-band', null], ['docs-light', 'docs'], ['queries-light', 'queries'],
    ['reports-light', 'reports'], ['accent-soft', 'docs'],
  ].map(([name, job]) => {
    const hex = css.getPropertyValue('--' + name).trim();
    const n = parseInt(hex.replace('#', ''), 16);
    return { name, hex, job, r: n >> 16 & 255, g: n >> 8 & 255, b: n & 255 };
  });
  const P = Object.fromEntries(PAL.map(p => [p.name, p.hex]));
  P.band = css.getPropertyValue('--band').trim();   // drawn but never sampled: it hides what's behind
  const BAND = (() => { const n = parseInt(P.band.replace('#', ''), 16); return { r: n >> 16 & 255, g: n >> 8 & 255, b: n & 255 }; })();

  let seed = 1;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  // the figures, drawn on a hidden canvas at the window's size (S: the figure's size).
  // Each one shows what its heading says.
  const FONT = (px) => `800 ${px}px 'Schibsted Grotesk', system-ui, sans-serif`;
  const DRAW = {
    // "…the day on paperwork.": a fanned stack of documents, lines of text, a folded corner
    papers(g, cx, cy, S) {
      const w = S * 0.5, h = S * 0.66, lw = Math.max(3, S * 0.028);
      const sheet = (dx, dy, rot, stroke, lines, fold) => {
        g.save(); g.translate(cx + dx, cy + dy); g.rotate(rot);
        g.fillStyle = P.band; g.fillRect(-w / 2, -h / 2, w, h);     // hides the sheet behind
        g.lineWidth = lw; g.strokeStyle = stroke;
        const f = fold ? w * 0.24 : 0;
        g.beginPath();
        g.moveTo(-w / 2, -h / 2); g.lineTo(w / 2 - f, -h / 2); g.lineTo(w / 2, -h / 2 + f);
        g.lineTo(w / 2, h / 2); g.lineTo(-w / 2, h / 2); g.closePath(); g.stroke();
        if (fold) { g.beginPath(); g.moveTo(w / 2 - f, -h / 2); g.lineTo(w / 2 - f, -h / 2 + f); g.lineTo(w / 2, -h / 2 + f); g.stroke(); }
        g.fillStyle = lines;
        for (let k = 0; k < 5; k++) g.fillRect(-w * 0.32, -h * 0.22 + k * h * 0.13, w * (k === 4 ? 0.36 : 0.64), lw);
        g.restore();
      };
      sheet(-S * 0.16, S * 0.02, -0.28, P['on-band'], P['on-band'], false);
      sheet(S * 0.16, S * 0.0, 0.22, P['on-band'], P['on-band'], false);
      sheet(0, S * 0.04, 0, P.paper, P['queries-light'], true);
    },
    // "One AI for your whole company.": the letters AI on the logo's baseline
    ai(g, cx, cy, S) {
      g.font = FONT(S * 0.62); g.textAlign = 'center'; g.textBaseline = 'alphabetic';
      g.fillStyle = P['docs-light'];
      g.fillText('AI', cx - S * 0.04, cy + S * 0.2);
      g.fillStyle = P.paper; g.fillRect(cx - S * 0.42, cy + S * 0.29, S * 0.68, S * 0.07);
      g.fillStyle = P['queries-light']; g.fillRect(cx + S * 0.32, cy + S * 0.27, S * 0.11, S * 0.11);
    },
    // "Your data stays inside.": a database locked inside a square
    data(g, cx, cy, S) {
      const s = S * 0.86;
      g.lineWidth = S * 0.05; g.strokeStyle = P.paper;
      g.strokeRect(cx - s / 2, cy - s / 2, s, s);
      const rx = S * 0.2, ry = S * 0.065, top = cy - S * 0.2, bot = cy + S * 0.2;
      g.lineWidth = Math.max(3, S * 0.03); g.strokeStyle = P['docs-light'];
      g.beginPath(); g.ellipse(cx, top, rx, ry, 0, 0, Math.PI * 2); g.stroke();
      [cy, bot].forEach(y => { g.beginPath(); g.ellipse(cx, y, rx, ry, 0, 0, Math.PI); g.stroke(); });
      g.beginPath(); g.moveTo(cx - rx, top); g.lineTo(cx - rx, bot); g.moveTo(cx + rx, top); g.lineTo(cx + rx, bot); g.stroke();
    },
    // "Four AI systems, already built.": four AI chips
    chips(g, cx, cy, S) {
      const s = S * 0.34, gap = S * 0.16, lw = Math.max(2.5, S * 0.025);
      ['docs-light', 'queries-light', 'reports-light', 'paper'].forEach((c, i) => {
        const x = cx - s - gap / 2 + (i % 2) * (s + gap), y = cy - s - gap / 2 + Math.floor(i / 2) * (s + gap);
        g.strokeStyle = P[c]; g.fillStyle = P[c]; g.lineWidth = lw;
        g.strokeRect(x, y, s, s);
        for (let k = 1; k <= 3; k++) {          // the pins
          const o = s * k / 4, p = s * 0.13;
          g.fillRect(x + o - lw / 2, y - p, lw, p); g.fillRect(x + o - lw / 2, y + s, lw, p);
          g.fillRect(x - p, y + o - lw / 2, p, lw); g.fillRect(x + s, y + o - lw / 2, p, lw);
        }
        g.font = FONT(s * 0.5); g.textAlign = 'center'; g.textBaseline = 'middle';
        g.fillText('AI', x + s / 2, y + s / 2 + s * 0.04);
      });
    },
    // "Start with one job. Grow from there.": steps, the first one lit
    stairs(g, cx, cy, S) {
      const bw = S * 0.23, base = cy + S * 0.46;
      ['docs-light', 'on-band', 'on-band', 'paper'].forEach((c, i) => {
        const h = S * 0.23 * (i + 1);
        g.fillStyle = P[c];
        g.fillRect(cx - bw * 2 + i * bw + 3, base - h, bw - 6, h);
      });
    },
    // "Which task eats your team's week?": a calendar week, most of it taken by one task
    week(g, cx, cy, S) {
      const w = S * 0.94, h = S * 0.72, x = cx - w / 2, y = cy - h / 2 + S * 0.06, lw = Math.max(3, S * 0.03);
      g.lineWidth = lw; g.strokeStyle = P.paper; g.strokeRect(x, y, w, h);
      g.fillStyle = P.paper; g.fillRect(x, y, w, h * 0.2);                       // the header
      g.fillRect(x + w * 0.22, y - S * 0.1, lw * 1.6, S * 0.16);                 // the rings
      g.fillRect(x + w * 0.78 - lw * 1.6, y - S * 0.1, lw * 1.6, S * 0.16);
      const cols = 7, cw = w / cols, top = y + h * 0.3, ch = h * 0.6;
      for (let d = 0; d < cols; d++) {
        const taken = d < 5 && d !== 2 ? 1 : 0;   // the task eats most of the week
        g.fillStyle = taken ? P['queries-light'] : P['on-band'];
        const ih = taken ? ch * 0.84 : ch * 0.22;
        g.fillRect(x + d * cw + cw * 0.18, top + ch - ih, cw * 0.64, ih);
      }
    },
    // "What does that task cost you now?": time and money, a clock and a stack of coins
    cost(g, cx, cy, S) {
      const r = S * 0.27, ox = cx - S * 0.2;
      g.lineWidth = S * 0.05; g.strokeStyle = P['reports-light'];
      g.beginPath(); g.arc(ox, cy, r, 0, Math.PI * 2); g.stroke();
      g.strokeStyle = P.paper;
      g.beginPath(); g.moveTo(ox, cy); g.lineTo(ox, cy - r * 0.62); g.moveTo(ox, cy); g.lineTo(ox + r * 0.45, cy); g.stroke();
      const kx = cx + S * 0.3, kw = S * 0.32, kh = S * 0.075;
      g.fillStyle = P['queries-light'];
      for (let k = 0; k < 5; k++) {
        g.beginPath(); g.ellipse(kx, cy + S * 0.3 - k * kh * 1.25, kw / 2, kh / 2, 0, 0, Math.PI * 2); g.fill();
      }
    },
  };

  const off = document.createElement('canvas');
  const og = off.getContext('2d', { willReadFrequently: true });

  function sample(fig, w, h, n) {
    off.width = w; off.height = h;
    og.clearRect(0, 0, w, h);
    DRAW[fig](og, w / 2, h / 2, Math.min(w, h) * 0.8);
    const data = og.getImageData(0, 0, w, h).data;
    let area = 0;
    for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) if (data[(y * w + x) * 4 + 3] > 128) area += 4;
    const step = Math.max(2.5, Math.sqrt(area / n));
    const pts = [];
    for (let y = step / 2; y < h; y += step) for (let x = step / 2; x < w; x += step) {
      const i = (Math.floor(y) * w + Math.floor(x)) * 4;
      if (data[i + 3] <= 128) continue;
      if (Math.abs(data[i] - BAND.r) + Math.abs(data[i + 1] - BAND.g) + Math.abs(data[i + 2] - BAND.b) < 30) continue;   // the window's own colour: empty
      let best = 0, bd = 1e9;
      PAL.forEach((p, k) => { const d = (p.r - data[i]) ** 2 + (p.g - data[i + 1]) ** 2 + (p.b - data[i + 2]) ** 2; if (d < bd) { bd = d; best = k; } });
      pts.push({ x, y, c: best });
    }
    seed = 11;
    while (pts.length > n) pts.splice(Math.floor(rnd() * pts.length), 1);
    const base = pts.length;
    for (let k = 0; pts.length < n && base; k++) { const p = pts[k % base]; pts.push({ x: p.x + (rnd() - 0.5) * 2, y: p.y + (rnd() - 0.5) * 2, c: p.c }); }
    return { pts, size: clamp(step * 0.72, 2, 4) };
  }

  /* ─── one flock per window ─── */
  let hl = null;
  const flocks = $$('.flock').map((box) => {
    const cv = document.createElement('canvas');
    box.append(cv);
    const ctx = cv.getContext('2d');
    const f = { box, cv, ctx, fig: box.dataset.fig, on: false, raf: 0, mx: -1e4, my: -1e4, transit: 1 };

    f.setup = () => {
      const r = box.getBoundingClientRect();
      f.W = Math.max(1, Math.round(r.width)); f.H = Math.max(1, Math.round(r.height));
      f.dpr = Math.min(2, devicePixelRatio || 1);
      cv.width = Math.round(f.W * f.dpr); cv.height = Math.round(f.H * f.dpr);
      f.N = f.W < 260 ? 650 : 900;
      const s = sample(f.fig, f.W, f.H, f.N);
      f.size = s.size;
      const N = f.N;
      f.X = new Float32Array(N); f.Y = new Float32Array(N); f.VX = new Float32Array(N); f.VY = new Float32Array(N);
      f.TX = new Float32Array(N); f.TY = new Float32Array(N); f.C = new Uint8Array(N); f.DL = new Float32Array(N);
      // they wait scattered outside the window, then stream in, sorted so they arrive in a sweep
      seed = 5;
      const pts = s.pts.slice().sort((a, b) => (a.x + a.y * 0.4) - (b.x + b.y * 0.4));
      pts.forEach((p, i) => {
        f.TX[i] = p.x; f.TY[i] = p.y; f.C[i] = p.c;
        const a = rnd() * Math.PI * 2, d = Math.max(f.W, f.H) * (0.7 + rnd() * 0.5);
        f.X[i] = reduce ? p.x : f.W / 2 + Math.cos(a) * d - f.W * 0.4;
        f.Y[i] = reduce ? p.y : f.H / 2 + Math.sin(a) * d;
        f.DL[i] = (i / N) * 30;
      });
      f.transit = 1;
      f.draw(0);
    };

    f.draw = (time) => {
      const { ctx, W, H, N } = f;
      ctx.setTransform(f.dpr, 0, 0, f.dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < N; i++) {
        const p = PAL[f.C[i]];
        let s = f.size, a = 1;
        if (hl) { if (p.job === hl) s *= 1.6; else a = 0.25; }
        const sp = Math.hypot(f.VX[i], f.VY[i]);
        ctx.globalAlpha = a;
        ctx.fillStyle = p.hex;
        if (sp > 2) {
          ctx.save(); ctx.translate(f.X[i], f.Y[i]); ctx.rotate(Math.atan2(f.VY[i], f.VX[i]));
          const l = Math.min(sp, 10);
          ctx.fillRect(-s / 2 - l, -s * 0.35, s + l, s * 0.7);
          ctx.restore();
        } else {
          const br = reduce ? 0 : Math.sin(time * 1.6 + i * 0.37) * 0.3;
          ctx.fillRect(f.X[i] - s / 2 + br, f.Y[i] - s / 2 - br, s, s);
        }
      }
      ctx.globalAlpha = 1;
    };

    f.tick = (t) => {
      f.raf = 0;
      const time = t / 1000;
      f.transit = Math.max(0, f.transit - 0.01);
      const turb = 0.03 + f.transit * 0.4, R = 70;
      for (let i = 0; i < f.N; i++) {
        if (f.DL[i] > 0) { f.DL[i]--; continue; }
        let ax = (f.TX[i] - f.X[i]) * 0.02, ay = (f.TY[i] - f.Y[i]) * 0.02;
        const fa = Math.sin(f.Y[i] * 0.03 + time * 0.8) + Math.cos(f.X[i] * 0.025 - time * 0.6);
        ax += Math.cos(fa * 2.4) * turb; ay += Math.sin(fa * 2.4) * turb;
        const dx = f.X[i] - f.mx, dy = f.Y[i] - f.my, d2 = dx * dx + dy * dy;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1, k = (1 - d / R) * 1.3;
          ax += dx / d * k - dy / d * k * 0.9; ay += dy / d * k + dx / d * k * 0.9;
        }
        f.VX[i] = (f.VX[i] + ax) * 0.86; f.VY[i] = (f.VY[i] + ay) * 0.86;
        f.X[i] += f.VX[i]; f.Y[i] += f.VY[i];
      }
      f.draw(time);
      if (f.on) f.raf = requestAnimationFrame(f.tick);
    };

    if (fine && !reduce) {
      box.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        const r = box.getBoundingClientRect();
        f.mx = e.clientX - r.left; f.my = e.clientY - r.top;
      });
      box.addEventListener('pointerleave', () => { f.mx = f.my = -1e4; });
      box.addEventListener('pointerdown', (e) => {
        if (e.pointerType !== 'mouse') return;
        const r = box.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        for (let i = 0; i < f.N; i++) {
          const dx = f.X[i] - x, dy = f.Y[i] - y, d = Math.hypot(dx, dy) || 1;
          if (d < 160) { const k = (1 - d / 160) * 16; f.VX[i] += dx / d * k; f.VY[i] += dy / d * k; }
        }
        f.transit = Math.max(f.transit, 0.5);
      });
    }
    return f;
  });
  if (!flocks.length) return;
  root.classList.add('has-flock');

  // light up a job colour while the mouse is on something of that colour
  if (fine && !reduce) addEventListener('pointerover', (e) => {
    const j = e.target.closest && e.target.closest('[data-job]');
    hl = j ? j.dataset.job : null;
  });

  // only windows on screen move
  const io = new IntersectionObserver((entries) => entries.forEach(e => {
    const f = flocks.find(x => x.box === e.target);
    f.on = e.isIntersecting && !reduce;
    if (f.on && !f.raf) f.raf = requestAnimationFrame(f.tick);
  }), { rootMargin: '0px 0px -8% 0px' });

  const setupAll = () => flocks.forEach(f => f.setup());
  setupAll();
  // the AI letters use the heading font: draw again once it has loaded
  if (document.fonts) document.fonts.load("800 40px 'Schibsted Grotesk'").then(setupAll);
  flocks.forEach(f => io.observe(f.box));
  let rz;
  addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(setupAll, 150); });
})();
