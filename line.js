/* Arcline — the One Line
   The logo is one thick line on its baseline. Here that line runs through the whole page:
   it leaves the hero's "a.", runs under each section's heading (left to right, then back),
   drops down the margins between them and ends as the baseline of the "a." in Contact.
   - It draws itself as the page scrolls; a square dot, the logo's full stop, rides its head
     in the colour of the section it is in.
   - Each section's label lights up when the line reaches it (.is-reached).
   - Mouse only: crossing the line plucks it like a string; grab it to pull it, let go and
     it springs back (a damped wave travels along it).
   Without JavaScript there is no line and the page reads in full. Under reduced motion the
   whole line is drawn at once and never moves.
*/

(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $  = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const NS = 'http://www.w3.org/2000/svg';

  const heroLine = $('.hero__mark .mark__line');
  const contactSec = $('#contact');
  const contactLine = $('.contact__mark .mark__line');
  if (!heroLine || !contactLine) return;

  /* ─── the layer ─── */
  const svg = document.createElementNS(NS, 'svg');
  svg.classList.add('oneline');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML =
    '<defs><linearGradient id="onelineInk" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1"></linearGradient></defs>' +
    '<path class="oneline__path" stroke="url(#onelineInk)" />' +
    '<g class="oneline__head"><rect class="oneline__halo" /><rect class="oneline__dot" /></g>';
  document.body.prepend(svg);
  const grad = $('linearGradient', svg);
  const path = $('.oneline__path', svg);
  const head = $('.oneline__head', svg);
  const [halo, dot] = $$('rect', head);

  // where the line runs: each section's heading (or the part it should sit under)
  const stationFor = {
    problem: '.statement__after',
    build: '.block__title',
    why: '.vows',
    proof: '.block__title',
    process: '.steps',            // the steps sit on the line itself, like stops
    pilot: '.block__title',
    cost: '.block__title',
    questions: '.faq-wrap',
  };
  const tints = { problem: 'queries', build: 'reports', why: 'docs', proof: 'queries', process: 'reports', pilot: 'docs', cost: 'queries', questions: 'reports', contact: 'docs', end: 'docs', end2: 'docs' };
  const COLORS = {};
  const css = getComputedStyle(root);
  ['docs', 'queries', 'reports'].forEach(k => {
    COLORS[k] = css.getPropertyValue('--' + k).trim();
    COLORS[k + '-light'] = css.getPropertyValue('--' + k + '-light').trim();
  });
  const INK = css.getPropertyValue('--ink').trim();
  const PAPER = css.getPropertyValue('--paper').trim();

  /* ─── geometry: a polyline sampled every few pixels, with round corners ─── */
  const STEP = 6;
  let P = [];            // samples: {x, y, nx, ny, t, sec}
  let N = 0;
  let u, v;              // the wave: offset along the normal, and its speed
  let grid = new Map();  // spatial buckets for finding the nearest sample
  let stroke = 13;
  let runs = [];         // { sec, from } : the sample index where each section's run starts
  let bands = [];        // dark bands, [top, bottom] in page coordinates

  const docPos = (el) => {
    const r = el.getBoundingClientRect();
    return { left: r.left + scrollX, right: r.right + scrollX, top: r.top + scrollY, bottom: r.bottom + scrollY, width: r.width, height: r.height };
  };

  function build() {
    const W = root.clientWidth;
    const wrap = $('.block .wrap') || $('.wrap');
    const wr = docPos(wrap);
    const pad = parseFloat(getComputedStyle(wrap).paddingLeft) || 24;
    stroke = W < 600 ? 7 : W < 1000 ? 10 : 13;
    const inset = Math.max(stroke, Math.min(pad * 0.5, 64));
    const xL = Math.max(wr.left + pad - inset, stroke);
    const xR = Math.min(wr.right - pad + inset, W - stroke);
    const R = W < 600 ? 22 : 40;          // corner radius: the logo's bowl
    const gap = W < 600 ? 14 : 22;         // how far under a heading the line runs

    // the corners: start at the hero "a." baseline, run to the left margin, then serpentine
    const h = docPos(heroLine);
    const pts = [];
    const secAt = [];      // section name for each corner
    pts.push([h.left + 2, h.top]); secAt.push(null);
    let side = 'L';
    pts.push([xL, h.top]); secAt.push(null);

    const stations = [];
    Object.entries(stationFor).forEach(([id, sel]) => {
      const s = document.getElementById(id);
      const el = s && $(sel, s);
      if (!el) return;
      const r = docPos(el);
      const y = id === 'process' ? r.top : r.bottom + gap;
      stations.push({ id, y });
    });
    const c = docPos(contactLine);
    // the line must reach Contact from the left, so the count of runs is kept even
    if (stations.length % 2) {
      const t = docPos($('.contact__title'));
      stations.push({ id: 'contact', y: t.bottom + gap });
    }
    stations.forEach(st => {
      const x0 = side === 'L' ? xL : xR;
      const x1 = side === 'L' ? xR : xL;
      pts.push([x0, st.y]); secAt.push(st.id);
      pts.push([x1, st.y]); secAt.push(st.id);
      side = side === 'L' ? 'R' : 'L';
    });
    pts.push([xL, c.top]); secAt.push('end');
    pts.push([c.left - 1, c.top]); secAt.push('end2');

    // sample the polyline, rounding each corner with a quarter circle
    const out = [];
    const push = (x, y, sec, run = -1) => out.push({ x, y, sec, run });
    let lastSec = null;
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, ay] = pts[i], [bx, by] = pts[i + 1];
      const len = Math.hypot(bx - ax, by - ay);
      if (len < 0.5) continue;
      const dx = (bx - ax) / len, dy = (by - ay) / len;
      // trim for the round corner at each end (not at the line's two ends)
      const prev = pts[i - 1], next = pts[i + 2];
      const rIn = prev ? Math.min(R, len / 2) : 0;
      const rOut = next ? Math.min(R, len / 2, Math.hypot(next[0] - bx, next[1] - by) / 2) : 0;
      if (secAt[i]) lastSec = secAt[i];
      const isRun = secAt[i] && secAt[i] === secAt[i + 1] && i >= 2 && i < pts.length - 3;
      const sec = isRun ? secAt[i] : lastSec;
      for (let d = rIn; d < len - rOut; d += STEP) push(ax + dx * d, ay + dy * d, sec, isRun ? i : -1);
      if (next && rOut > 1) {
        const ex = bx - dx * rOut, ey = by - dy * rOut;
        const nlen = Math.hypot(next[0] - bx, next[1] - by);
        const ndx = (next[0] - bx) / nlen, ndy = (next[1] - by) / nlen;
        const fx = bx + ndx * rOut, fy = by + ndy * rOut;
        // a quadratic curve through the corner is close enough to a circle here
        const steps = Math.max(3, Math.round((Math.PI * rOut / 2) / STEP));
        for (let k = 0; k <= steps; k++) {
          const t = k / steps, m = 1 - t;
          push(m * m * ex + 2 * m * t * bx + t * t * fx, m * m * ey + 2 * m * t * by + t * t * fy, sec);
        }
      }
    }
    const [lx, ly] = pts[pts.length - 1];
    push(lx, ly, 'contact');

    // normals, and a "scroll time" for each sample: vertical parts draw with the scroll,
    // each heading's run sweeps across while the heading rises into view
    const H0 = Math.min(innerHeight * 0.32, 300);
    P = out;
    N = P.length;
    for (let i = 0; i < N; i++) {
      const a = P[Math.max(0, i - 1)], b = P[Math.min(N - 1, i + 1)];
      const tx = b.x - a.x, ty = b.y - a.y, l = Math.hypot(tx, ty) || 1;
      P[i].nx = -ty / l; P[i].ny = tx / l;
    }
    // time: a heading's run sweeps across in the window [y - H, y]; the stretches between
    // runs share out the time left, by height
    runs = [];
    let i = 0, tPrev = P[0].y - innerHeight * 0.62, yPrev = P[0].y;
    while (i < N) {
      if (P[i].run < 0) {
        let j = i; while (j < N && P[j].run < 0) j++;
        const yNext = j < N ? P[j].y : P[N - 1].y;
        const H = j < N ? Math.min(H0, Math.max(0, (yNext - yPrev) * 0.5)) : 0;
        const tEnd = Math.max(tPrev, yNext - H);
        const y0 = P[i].y, y1 = P[j - 1].y;
        for (let k = i; k < j; k++) {
          const f = y1 - y0 > 1 ? clamp((P[k].y - y0) / (y1 - y0), 0, 1) : (k - i) / Math.max(1, j - i);
          P[k].t = tPrev + (tEnd - tPrev) * f;
        }
        tPrev = tEnd; i = j;
      } else {
        let j = i; while (j < N && P[j].run === P[i].run) j++;
        const tEnd = Math.max(tPrev, P[i].y);
        runs.push({ sec: P[i].sec, from: i });
        for (let k = i; k < j; k++) P[k].t = tPrev + (tEnd - tPrev) * ((k - i) / Math.max(1, j - i - 1));
        tPrev = tEnd; yPrev = P[i].y; i = j;
      }
    }
    for (let k = 1; k < N; k++) if (!(P[k].t >= P[k - 1].t)) P[k].t = P[k - 1].t;

    u = new Float32Array(N); v = new Float32Array(N);
    grid = new Map();
    P.forEach((p, k) => {
      const key = Math.floor(p.x / 64) + ':' + Math.floor(p.y / 64);
      (grid.get(key) || grid.set(key, []).get(key)).push(k);
    });

    // the dark bands: the line turns paper-coloured on them
    bands = $$('#problem, .contact').map(el => { const r = docPos(el); return [r.top, r.bottom]; });
    svg.setAttribute('height', 0);      // measured without the line itself
    const H = root.scrollHeight;
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    grad.setAttribute('y2', H);
    let stops = '';
    const stop = (y, c) => { stops += `<stop offset="${clamp(y / H, 0, 1).toFixed(5)}" stop-color="${c}"/>`; };
    stop(0, INK);
    bands.forEach(([t, b]) => { stop(t, INK); stop(t, PAPER); stop(b, PAPER); stop(b, INK); });
    stop(H, INK);
    grad.innerHTML = stops;
    path.setAttribute('stroke-width', stroke);
    const s = stroke * 1.7;
    dot.setAttribute('x', -s / 2); dot.setAttribute('y', -s / 2); dot.setAttribute('width', s); dot.setAttribute('height', s);
    const hs = s * 2;
    halo.setAttribute('x', -hs / 2); halo.setAttribute('y', -hs / 2); halo.setAttribute('width', hs); halo.setAttribute('height', hs);

    headS = Math.min(headS, N - 1);
    if (reduce) headS = N - 1;
    draw(true);
  }

  /* ─── drawing ─── */
  let headS = 0;        // the head, as a (fractional) sample index
  let drawnTo = -1;
  const onBand = (y) => bands.some(([t, b]) => y >= t && y <= b);

  function targetS() {
    // near the bottom the target runs ahead, so the line lands in Contact at the end
    const max = root.scrollHeight - innerHeight;
    const k = clamp((scrollY - (max - innerHeight * 0.6)) / (innerHeight * 0.6), 0, 1);
    const t = scrollY + innerHeight * (0.62 + 0.6 * k);
    // binary search: the last sample whose time has come
    let lo = 0, hi = N - 1;
    if (P[hi].t <= t) return hi;
    while (lo < hi) { const m = (lo + hi + 1) >> 1; if (P[m].t <= t) lo = m; else hi = m - 1; }
    const a = P[lo], b = P[lo + 1];
    return lo + (b && b.t > a.t ? clamp((t - a.t) / (b.t - a.t), 0, 1) : 0);
  }

  let waveOn = false;
  function draw(force) {
    const end = Math.min(N - 1, Math.floor(headS));
    if (!force && end === drawnTo && !waveOn) { placeHead(); return; }
    drawnTo = end;
    let d = '';
    for (let k = 0; k <= end; k++) {
      const p = P[k], o = u[k];
      d += (k ? 'L' : 'M') + (p.x + p.nx * o).toFixed(1) + ' ' + (p.y + p.ny * o).toFixed(1);
    }
    const f = headS - end;
    if (end < N - 1 && f > 0) {
      const a = P[end], b = P[end + 1];
      d += 'L' + (a.x + (b.x - a.x) * f).toFixed(1) + ' ' + (a.y + (b.y - a.y) * f).toFixed(1);
    }
    path.setAttribute('d', d);
    placeHead();
  }

  let lastSec;
  function placeHead() {
    const end = Math.min(N - 1, Math.floor(headS));
    const a = P[end], b = P[Math.min(N - 1, end + 1)], f = headS - end;
    const x = a.x + (b.x - a.x) * f + a.nx * u[end], y = a.y + (b.y - a.y) * f + a.ny * u[end];
    head.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    head.classList.toggle('is-done', headS >= N - 1.5);
    const sec = a.sec;
    const job = tints[sec] || 'docs';
    const col = onBand(y) ? COLORS[job + '-light'] : COLORS[job];
    if (col !== lastSec) { lastSec = col; head.style.setProperty('--c', col); }
    // stations the line has reached light up
    runs.forEach(r => {
      const s = document.getElementById(r.sec);
      if (s) s.classList.toggle('is-reached', headS >= r.from);
    });
    contactSec.classList.toggle('is-reached', headS >= N - 1.5);
  }

  /* ─── the loop: the head eases toward the scroll; the wave plays out ─── */
  let raf = 0;
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
  function tick() {
    raf = 0;
    const goal = reduce ? N - 1 : targetS();   // reduced motion: the whole line, always
    const diff = goal - headS;
    let moving = false;
    if (Math.abs(diff) > 0.05) {
      // draws forward at a pace, and rewinds a little faster
      const step = diff > 0 ? Math.max(1.2, diff * 0.12) : Math.min(-2, diff * 0.2);
      headS = diff > 0 ? Math.min(goal, headS + step) : Math.max(goal, headS + step);
      moving = true;
    }
    if (waveOn || grab) simulate();
    draw(false);
    if (moving || waveOn || grab) kick();
  }

  /* ─── the string: pluck it, pull it ─── */
  const C = 0.42, K = 0.0022, D = 0.993, SUB = 3;
  function simulate() {
    let energy = 0;
    for (let s = 0; s < SUB; s++) {
      if (grab) hold();
      for (let k = 1; k < N - 1; k++) v[k] = (v[k] + C * (u[k - 1] + u[k + 1] - 2 * u[k]) - K * u[k]) * D;
      for (let k = 1; k < N - 1; k++) u[k] += v[k];
    }
    if (grab) hold();
    for (let k = 0; k < N; k++) energy = Math.max(energy, Math.abs(u[k]) + Math.abs(v[k]));
    if (energy < 0.04 && !grab) { u.fill(0); v.fill(0); waveOn = false; draw(true); }
    else waveOn = true;
  }

  function nearest(x, y, within) {
    let best = -1, bd = within * within;
    const gx = Math.floor(x / 64), gy = Math.floor(y / 64);
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) {
      const list = grid.get((gx + i) + ':' + (gy + j));
      if (!list) continue;
      for (const k of list) {
        if (k > headS) continue;            // only the part already drawn
        const dx = x - P[k].x, dy = y - P[k].y, d = dx * dx + dy * dy;
        if (d < bd) { bd = d; best = k; }
      }
    }
    return best;
  }
  const side = (k, x, y) => (x - P[k].x) * P[k].nx + (y - P[k].y) * P[k].ny;

  let grab = null;      // { k, off }
  const SIG = 9;        // how wide a pull is, in samples
  function hold() {
    const { k, off } = grab;
    for (let j = -3 * SIG; j <= 3 * SIG; j++) {
      const i = k + j;
      if (i <= 0 || i >= N - 1) continue;
      const g = Math.exp(-(j * j) / (2 * SIG * SIG));
      u[i] = u[i] * (1 - g) + off * g;
      v[i] *= 1 - g;
    }
  }

  if (fine && !reduce) {
    let px = null, py = null;
    const interactive = 'a, button, input, select, textarea, label, .demo, .founder, .marquee, .faq';
    addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse' || !N) return;
      const x = e.clientX + scrollX, y = e.clientY + scrollY;
      if (grab) {
        grab.off = clamp(side(grab.k, x, y), -150, 150);
        kick();
      } else {
        const k = nearest(x, y, 40);
        if (k > 0 && k < N - 1 && px !== null) {
          const s0 = side(k, px, py), s1 = side(k, x, y);
          // crossing the line plucks it, harder the faster the mouse goes
          if (s0 * s1 < 0 && Math.abs(s0) < 60) {
            const imp = clamp((s1 - s0) * 0.22, -7, 7);
            for (let j = -2 * SIG; j <= 2 * SIG; j++) {
              const i = k + j;
              if (i > 0 && i < N - 1) v[i] += imp * Math.exp(-(j * j) / (2 * 25));
            }
            waveOn = true; kick();
          }
        }
        const near = k >= 0 && Math.abs(side(k, x, y)) < stroke + 8 && !e.target.closest(interactive);
        root.classList.toggle('is-on-line', near);
      }
      px = x; py = y;
    }, { passive: true });

    addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0 || e.target.closest(interactive)) return;
      const x = e.clientX + scrollX, y = e.clientY + scrollY;
      const k = nearest(x, y, stroke + 10);
      if (k <= 0 || k >= N - 1) return;
      e.preventDefault();        // no text selection while pulling the line
      grab = { k, off: side(k, x, y) };
      root.classList.add('is-pulling');
      waveOn = true; kick();
    });
    const release = () => {
      if (!grab) return;
      grab = null;
      root.classList.remove('is-pulling');
      kick();
    };
    addEventListener('pointerup', release);
    addEventListener('pointercancel', release);
    addEventListener('blur', release);
  }

  /* ─── keep it in step with the layout ─── */
  let queued = false;
  const rebuild = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; grab = null; build(); kick(); });
  };
  addEventListener('scroll', kick, { passive: true });
  addEventListener('resize', rebuild);
  new ResizeObserver(rebuild).observe(document.body);
  if (document.fonts) document.fonts.ready.then(rebuild);
  addEventListener('load', rebuild);
  root.classList.add('has-line');
  build();
  if (!reduce) { headS = 0; drawnTo = -1; }
  kick();
})();
