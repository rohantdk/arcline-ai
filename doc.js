/* Arcline — "The Document"
   The page is a desk; each section is a sheet of paper dealt onto it, and the AI fills
   the paperwork in as you read:
   - sheets slide onto the desk as they come into view, each at its own slight angle
   - headings type themselves, with a violet caret
   - line numbers run down each sheet's margin, and each sheet has a page number
   - (CSS) boxes tick, the three promises are stamped, the yearly cost is double-underlined
   - a desk lamp follows the mouse
   Without JavaScript every sheet and word is in place. Under reduced motion nothing moves:
   no typing, no dealing, no lamp.
*/

(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ─── the sheets ─── */
  const sheets = $$('.hero > .wrap, .block > .wrap, .contact > .wrap');
  const angles = [0, -0.5, 0.35, -0.3, 0.45, -0.4, 0.3, -0.35, 0.4, 0];
  sheets.forEach((s, i) => {
    s.classList.add('sheet');
    s.style.setProperty('--rot', (angles[i % angles.length]) + 'deg');
    s.dataset.page = String(i + 1).padStart(2, '0') + ' / ' + String(sheets.length).padStart(2, '0');

    // line numbers in the margin, as many as the sheet is tall
    const lines = document.createElement('div');
    lines.className = 'sheet__lines';
    lines.setAttribute('aria-hidden', 'true');
    s.prepend(lines);
    let shown = 0;
    const fill = () => {
      const n = Math.ceil(s.offsetHeight / 40);
      if (n === shown) return;
      shown = n;
      lines.textContent = Array.from({ length: n }, (_, k) => k + 1).join('\n');
    };
    fill();
    new ResizeObserver(fill).observe(s);
  });
  root.classList.add('has-doc');

  if (reduce) { sheets.forEach(s => s.classList.add('is-dealt')); return; }

  const dealIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-dealt');
      dealIO.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0 });
  sheets.forEach(s => dealIO.observe(s));

  /* ─── headings type themselves ─── */
  const typed = $$('.hero__title, .block__title, .statement, .contact__title');
  function prepare(el) {
    const nodes = [];
    const walk = (n) => n.childNodes.forEach(c => c.nodeType === 3 ? nodes.push(c) : walk(c));
    walk(el);
    const texts = nodes.map(n => n.textContent);
    el.style.minHeight = el.offsetHeight + 'px';     // no jump while it types
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    nodes.forEach(n => { n.textContent = ''; });
    el.classList.add('is-typing');
    return { el, nodes, texts };
  }
  function type({ el, nodes, texts }) {
    const caret = document.createElement('span');
    caret.className = 'caret';
    caret.setAttribute('aria-hidden', 'true');
    let i = 0, j = 0;
    const total = texts.join('').length;
    const speed = Math.max(14, Math.min(38, 1100 / total));   // long headings type faster
    const step = () => {
      if (i >= nodes.length) {
        el.classList.remove('is-typing');
        el.style.minHeight = '';
        el.removeAttribute('aria-label');
        setTimeout(() => caret.remove(), 1400);
        return;
      }
      const t = texts[i];
      j = Math.min(t.length, j + 1 + (Math.random() < 0.25 ? 1 : 0));
      nodes[i].textContent = t.slice(0, j);
      nodes[i].after(caret);
      if (j >= t.length) { i++; j = 0; }
      setTimeout(step, speed + (t[j - 1] === ' ' ? speed * 0.6 : 0));
    };
    step();
  }
  const jobs = new Map();
  const typeIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      typeIO.unobserve(e.target);
      const job = jobs.get(e.target);
      setTimeout(() => type(job), e.target.matches('.hero__title') ? 700 : 250);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.2 });
  const start = () => typed.forEach(el => { jobs.set(el, prepare(el)); typeIO.observe(el); });
  // wait for the fonts, so the reserved height is the real one
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(start);

  /* ─── the desk lamp ─── */
  if (fine) {
    let q = false, x = 0, y = 0;
    addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX; y = e.clientY;
      if (q) return;
      q = true;
      requestAnimationFrame(() => {
        q = false;
        root.style.setProperty('--lx', x + 'px');
        root.style.setProperty('--ly', y + 'px');
        root.classList.add('has-lamp');
      });
    }, { passive: true });
  }
})();
