/* Arcline — "The Loom"
   The page weaves itself. A warp of fine threads runs down behind the whole page; between
   sections a shuttle weaves a band of cloth, row by row, as the band comes into view:
   a twill in the section's colour with the logo's three dots woven in. Scattered threads
   (email, Excel, the ERP) woven into one cloth: one AI for the whole company.
   - Mouse only: the warp threads part around the cursor like strings under fingers and
     spring back.
   Without JavaScript there are no threads or bands and the page reads in full. Under reduced
   motion every band is already woven and the threads never move.
*/

(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $  = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  const css = getComputedStyle(root);
  const tok = (n) => css.getPropertyValue('--' + n).trim();
  const C = {
    ink: tok('ink'), paper: tok('paper'), accent: tok('accent'), band: tok('band'),
    docs: tok('docs'), queries: tok('queries'), reports: tok('reports'),
    'docs-light': tok('docs-light'), 'queries-light': tok('queries-light'), 'reports-light': tok('reports-light'),
    'docs-soft': tok('docs-soft'), 'queries-soft': tok('queries-soft'), 'reports-soft': tok('reports-soft'),
  };
  root.classList.add('has-loom');

  /* ─── the warp: threads behind the page ─── */
  const warp = document.createElement('canvas');
  warp.className = 'loom__warp';
  warp.setAttribute('aria-hidden', 'true');
  document.body.prepend(warp);
  const wg = warp.getContext('2d');
  const GAP = 14;
  let W = 0, H = 0, dpr = 1, amp = [], vel = [], goal = [];
  let mx = -1e4, my = -1e4;

  function sizeWarp() {
    W = innerWidth; H = innerHeight; dpr = Math.min(2, devicePixelRatio || 1);
    warp.width = Math.round(W * dpr); warp.height = Math.round(H * dpr);
    const n = Math.ceil(W / GAP) + 1;
    amp = new Float32Array(n); vel = new Float32Array(n); goal = new Float32Array(n);
    drawWarp();
  }
  function drawWarp() {
    wg.setTransform(dpr, 0, 0, dpr, 0, 0);
    wg.clearRect(0, 0, W, H);
    const n = amp.length;
    const off = (scrollY * 0.15) % GAP;            // a hint of depth as the page moves
    for (let i = 0; i < n; i++) {
      const x = i * GAP + GAP / 2;
      const strong = i % 7 === 3;
      wg.strokeStyle = strong ? C.accent : C.ink;
      wg.globalAlpha = strong ? 0.13 : 0.06;
      wg.lineWidth = strong ? 1.5 : 1;
      wg.beginPath();
      const a = amp[i];
      if (Math.abs(a) < 0.3) { wg.moveTo(x, 0); wg.lineTo(x, H); }
      else {
        // the thread bows around the cursor's height
        for (let y = -20; y <= H + 20; y += 12) {
          const g = Math.exp(-((y - my) ** 2) / (2 * 110 * 110));
          const px = x + a * g;
          y === -20 ? wg.moveTo(px, y) : wg.lineTo(px, y);
        }
      }
      wg.stroke();
      // knots along the strong threads, like a selvedge
      if (strong) {
        wg.globalAlpha = 0.18; wg.fillStyle = C.accent;
        for (let y = GAP - off; y < H; y += GAP * 6) wg.fillRect(x - 1.5, y, 3, 3);
      }
    }
    wg.globalAlpha = 1;
  }

  let raf = 0;
  const kick = () => { if (!raf) raf = requestAnimationFrame(step); };
  function step() {
    raf = 0;
    let moving = false;
    const n = amp.length;
    for (let i = 0; i < n; i++) {
      const x = i * GAP + GAP / 2, dx = x - mx, d = Math.abs(dx);
      goal[i] = d < 120 ? Math.sign(dx || 1) * (120 - d) * 0.55 : 0;
      vel[i] = (vel[i] + (goal[i] - amp[i]) * 0.12) * 0.78;
      amp[i] += vel[i];
      if (Math.abs(vel[i]) > 0.05 || Math.abs(goal[i] - amp[i]) > 0.3) moving = true;
    }
    drawWarp();
    if (moving) kick();
  }
  if (fine && !reduce) {
    addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      mx = e.clientX; my = e.clientY; kick();
    }, { passive: true });
    document.addEventListener('pointerleave', () => { mx = my = -1e4; kick(); });
  }
  addEventListener('scroll', () => { if (!reduce) kick(); }, { passive: true });

  /* ─── the bands: woven between sections ─── */
  const jobsCycle = ['docs', 'queries', 'reports'];
  const before = [$('.marquee')].concat($$('main > section[id]'));
  const bands = before.filter(Boolean).map((el, i) => {
    const band = document.createElement('div');
    band.className = 'weave';
    band.setAttribute('aria-hidden', 'true');
    band.innerHTML = '<canvas></canvas><i class="weave__shuttle"></i>';
    el.before(band);
    return { el: band, cv: $('canvas', band), shuttle: $('.weave__shuttle', band), job: jobsCycle[i % 3], p: reduce ? 1e9 : 0, on: false, cols: 0, rows: 0, cell: 10 };
  });

  // the cloth: a twill ground in the band's colour, the logo's three dots woven in
  function cellOf(b, c, r) {
    const R = b.rows;
    const rep = 30, k = c % rep;
    const top = Math.round(R / 2) - 2, bot = top + 4;
    if (r >= top && r <= bot) {
      const sq = [[3, 'docs'], [9, 'queries'], [15, 'reports']].find(([s]) => k >= s && k < s + 5);
      if (sq) return { over: 'weft', color: C[sq[1]] };
    }
    // a border row of paper-white weft at the top and bottom
    if (r === 0 || r === R - 1) return { over: (c % 2) ? 'weft' : 'warp', color: C.paper };
    const twill = ((c + r) % 4) < 2;
    return twill ? { over: 'weft', color: C[b.job + '-light'] } : { over: 'warp', color: C[b.job + '-soft'] };
  }

  function sizeBand(b) {
    const w = b.el.clientWidth;
    b.cell = w < 600 ? 8 : 10;
    b.rows = 12;
    b.cols = Math.ceil(w / b.cell);
    const h = b.rows * b.cell;
    b.el.style.height = h + 'px';
    const d = Math.min(2, devicePixelRatio || 1);
    b.cv.width = Math.round(w * d); b.cv.height = Math.round(h * d);
    b.d = d;
    drawBand(b);
  }

  function drawBand(b) {
    const g = b.cv.getContext('2d');
    const s = b.cell;
    g.setTransform(b.d, 0, 0, b.d, 0, 0);
    g.clearRect(0, 0, b.cols * s, b.rows * s);
    // the bare warp, waiting for the weft
    g.fillStyle = C.ink;
    g.globalAlpha = 0.16;
    for (let c = 0; c < b.cols; c++) g.fillRect(c * s + s * 0.38, 0, s * 0.24, b.rows * s);
    g.globalAlpha = 1;
    const full = Math.floor(b.p), frac = b.p - full;
    let sx = 0, sy = 0;
    for (let r = 0; r < b.rows; r++) {
      if (r > full) break;
      const dirRight = r % 2 === 0;
      const upto = r < full ? b.cols : Math.floor(frac * b.cols);
      for (let k = 0; k < upto; k++) {
        const c = dirRight ? k : b.cols - 1 - k;
        const cell = cellOf(b, c, r);
        const x = c * s, y = r * s;
        if (cell.over === 'weft') {
          g.fillStyle = cell.color;
          g.fillRect(x - 0.5, y + 1, s + 1, s - 2);
          g.fillStyle = 'rgba(34,22,42,.12)';
          g.fillRect(x - 0.5, y + s - 2.5, s + 1, 1.5);
        } else {
          g.fillStyle = cell.color;
          g.fillRect(x - 0.5, y, s + 1, s);
          g.fillStyle = C.ink;
          g.globalAlpha = 0.55;
          g.fillRect(x + s * 0.3, y, s * 0.4, s);
          g.globalAlpha = 1;
        }
      }
      if (r === full) { sx = dirRight ? upto * s : (b.cols - upto) * s; sy = r * s + s / 2; }
    }
    const weaving = b.p < b.rows;
    b.shuttle.style.opacity = weaving && b.on ? 1 : 0;
    if (weaving) b.shuttle.style.transform = `translate(${sx.toFixed(1)}px, ${sy.toFixed(1)}px)`;
  }

  // weave a band when it comes into view: about a fifth of a second a row
  let last = 0, looping = false;
  function weave(t) {
    const dt = last ? Math.min(0.05, (t - last) / 1000) : 0.016;
    last = t;
    let busy = false;
    bands.forEach(b => {
      if (!b.on || b.p >= b.rows) return;
      b.p = Math.min(b.rows, b.p + dt * 5.2);
      drawBand(b);
      busy = true;
    });
    if (busy) requestAnimationFrame(weave); else { looping = false; last = 0; }
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const b = bands.find(x => x.el === e.target);
      b.on = true;
      io.unobserve(e.target);
      if (!looping && !reduce) { looping = true; requestAnimationFrame(weave); }
    });
  }, { rootMargin: '0px 0px -15% 0px' });
  bands.forEach(b => io.observe(b.el));

  let rz;
  const resize = () => { sizeWarp(); bands.forEach(sizeBand); };
  addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(resize, 100); });
  resize();
})();
