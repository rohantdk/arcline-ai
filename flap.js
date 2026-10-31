/* Arcline — "Departures"
   The page is a departures board at night. Every headline is a row of split-flap tiles:
   when it comes into view each tile spins through letters and lands, left to right, with
   a flap; pointing at a headline (mouse) spins it again. Orders leaving on time.
   The headline keeps its words for screen readers (aria-label); the tiles are hidden from
   them. Without JavaScript the headlines are plain text on the usual light page. Under
   reduced motion the tiles show at once and never spin.
*/

(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  const UP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const LO = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const pickFor = (ch) => /[a-z]/.test(ch) ? LO : /[A-Z0-9]/.test(ch) ? UP : null;

  const boards = $$('.hero__title, .block__title, .statement, .contact__title, .vows li');

  // turn each text node into words of tiles; spaces stay spaces, so lines still wrap
  function build(el) {
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    const tiles = [];
    const walk = (node) => [...node.childNodes].forEach(n => {
      if (n.nodeType === 1) { walk(n); return; }
      if (n.nodeType !== 3) return;
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.append(' '); return; }
        const word = document.createElement('span');
        word.className = 'fw';
        word.setAttribute('aria-hidden', 'true');
        [...part].forEach(ch => {
          const t = document.createElement('span');
          t.className = 'ft';
          const face = document.createElement('span');
          face.textContent = ch;
          t.append(face);
          t.dataset.c = ch;
          word.append(t);
          tiles.push(t);
        });
        frag.append(word);
      });
      n.replaceWith(frag);
    });
    walk(el);
    el.classList.add('is-board');
    return tiles;
  }

  // spin: each tile shows random characters, then lands; tiles further right land later
  function spin(tiles, quick) {
    tiles.forEach((t, i) => {
      const set = pickFor(t.dataset.c);
      if (!set) return;
      clearInterval(t._iv);
      t.classList.remove('is-landed');
      let left = (quick ? 3 : 6) + Math.floor(i * (quick ? 0.25 : 0.6)) + Math.floor(Math.random() * 4);
      const face = t.firstChild;
      t._iv = setInterval(() => {
        left--;
        face.textContent = left > 0 ? set[Math.floor(Math.random() * set.length)] : t.dataset.c;
        t.classList.remove('is-flip'); void t.offsetWidth; t.classList.add('is-flip');
        if (left <= 0) { clearInterval(t._iv); t.classList.add('is-landed'); }
      }, quick ? 42 : 55);
    });
  }

  const all = new Map(boards.map(el => [el, build(el)]));
  root.classList.add('has-flap');
  if (reduce) return;

  // before they come into view, the tiles are blank
  all.forEach(tiles => tiles.forEach(t => { if (pickFor(t.dataset.c)) t.firstChild.textContent = ' '; }));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const el = e.target;
      setTimeout(() => spin(all.get(el)), el.matches('.hero__title') ? 400 : 120);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.3 });
  all.forEach((_, el) => io.observe(el));

  if (fine) all.forEach((tiles, el) => {
    let cool = 0;
    el.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse' || performance.now() < cool) return;
      if (!tiles.every(t => !t._iv || t.classList.contains('is-landed'))) return;
      cool = performance.now() + 1600;
      spin(tiles, true);
    });
  });
})();
