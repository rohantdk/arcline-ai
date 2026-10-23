/* Arcline — Private AI for manufacturers and exporters
   - Mobile menu toggle
   - Highlight the nav link for the part of the page in view
   - Scroll progress on the nav logo's baseline, and the section in view beside it
   - Hero: the logo's "a." with a dot per job as its full stop
   - Scroll reveals, counting stats, labels that decode; the hero example plays
     question, answer, sources
   - Strip of what the assistant reads, which speeds up and turns with the scroll
   - The mark in Contact, with a dot that slides along its line
   - Card spotlight, magnetic buttons and the contact glow (mouse only)
   - Copy email
   All motion is skipped under prefers-reduced-motion.
*/

(() => {
  const root = document.documentElement;
  root.classList.add('motion');   // tells the <head> fallback that this script ran

  const $  = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp  = (a, b, t) => a + (b - a) * t;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine   = matchMedia('(hover: hover) and (pointer: fine)').matches;


  /* ─── MOBILE MENU ─── */
  const toggle = $('#navToggle');
  const links  = $('#navLinks');

  const setOpen = (open) => {
    links.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };

  toggle.addEventListener('click', () => setOpen(!links.classList.contains('is-open')));
  links.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });


  /* ─── ACTIVE NAV LINK ─── */
  const navLinks = $$('a[href^="#"]', links);
  const navIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = '#' + entry.target.id;
      navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navLinks.map(a => $(a.getAttribute('href'))).filter(Boolean).forEach(t => navIO.observe(t));


  /* ─── SCROLL PROGRESS: the logo's baseline fills ─── */
  const markFill = $('.nav__mark-fill');
  let progressQueued = false;
  const updateProgress = () => {
    progressQueued = false;
    const max = root.scrollHeight - innerHeight;
    markFill.style.strokeDashoffset = String(1 - (max > 0 ? clamp(scrollY / max, 0, 1) : 0));
    updateWhere();
  };

  /* ─── WHERE AM I: the section in view, beside the logo ─── */
  const where = $('.nav__where');
  // numbered in page order, named by each section's own label
  const sections = $$('main > section[id]').filter(s => $('.eyebrow', s));
  const sectionLabels = new Map(sections.map((s, i) => [s, {
    n: String(i + 1).padStart(2, '0'),
    t: $('.eyebrow', s).textContent,
  }]));
  let shownSection = null;

  function updateWhere() {
    const mid = innerHeight * 0.5;
    let cur = null;
    for (const s of sections) {
      if (s.getBoundingClientRect().top <= mid) cur = s; else break;
    }
    if (cur && cur.getBoundingClientRect().bottom < mid) cur = null;
    if (cur === shownSection) return;
    shownSection = cur;
    if (!cur) { where.classList.remove('is-on'); return; }
    const { n, t } = sectionLabels.get(cur);
    where.textContent = '';
    const b = document.createElement('b');
    b.textContent = n;
    where.append(b, ' ' + t);
    where.classList.remove('is-on');
    void where.offsetWidth;
    where.classList.add('is-on');
  }
  addEventListener('scroll', () => {
    if (!progressQueued) { progressQueued = true; requestAnimationFrame(updateProgress); }
  }, { passive: true });
  addEventListener('resize', updateProgress);
  updateProgress();


  /* ─── SCROLL REVEALS ─── */
  [['.hero__mark', 0], ['.hero .eyebrow', 0.5], ['.hero__title', 0.58], ['.hero__sub', 0.7], ['.hero__actions', 0.8], ['.hero__proof', 0.9]]
    .forEach(([sel, d]) => {
      const el = $(sel);
      el.classList.add('reveal');
      el.style.setProperty('--d', d + 's');
    });

  $$('.block .eyebrow, .block__title, .story p, .caption, .contact .eyebrow, .contact__title, .contact__lead, .contact__actions, .contact__mark')
    .forEach(el => el.classList.add('reveal'));

  // groups whose children come in one after another
  [['.jobs', 'li', 90], ['.stats', 'div', 90], ['.why', 'div', 80], ['.cards', '.card', 90], ['.steps', 'li', 280], ['.faq', 'div', 60], ['.contact__grid', 'div', 80]]
    .forEach(([parent, child, step]) => $$(parent).forEach(p => {
      $$(':scope > ' + child, p).forEach((el, i) => {
        el.classList.add('reveal');
        el.style.setProperty('--d', Math.min(i * step, 900) + 'ms');
      });
    }));

  const demo = $('.demo');
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      revealIO.unobserve(entry.target);
      const el = entry.target;
      if (el.parentElement.classList.contains('stats')) countUp(el);
      if (el.matches('.eyebrow')) decode(el);
      if (el.matches('.contact__mark')) travel(el);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

  $$('.reveal').forEach(el => revealIO.observe(el));
  revealIO.observe(demo);


  /* ─── COUNTING STATS ─── */
  $$('.stats dt').forEach(dt => {
    const n = parseInt(dt.textContent, 10);
    dt.dataset.n = n;
    dt.textContent = '';
    const sr = document.createElement('span');
    sr.className = 'sr';
    sr.textContent = n;
    const shown = document.createElement('span');
    shown.setAttribute('aria-hidden', 'true');
    shown.textContent = reduce ? n : 0;
    dt.append(sr, shown);
  });

  function countUp(item) {
    const dt = $('dt', item);
    const shown = dt.lastElementChild;
    const n = +dt.dataset.n;
    if (reduce) { shown.textContent = n; return; }
    const dur = 900 + n * 18, t0 = performance.now();
    const step = (t) => {
      const k = clamp((t - t0) / dur, 0, 1);
      shown.textContent = Math.round(n * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }


  /* ─── LABELS THAT DECODE ───
     Mono labels settle letter by letter, left to right, from random glyphs. */
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#';
  function decode(el) {
    if (reduce || !el) return;
    const nodes = [];
    const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (walk.nextNode()) if (walk.currentNode.nodeValue.trim()) nodes.push(walk.currentNode);
    const finals = nodes.map(n => n.nodeValue);
    const total = finals.reduce((a, f) => a + f.length, 0);
    const dur = 700, t0 = performance.now();
    const step = (t) => {
      const k = clamp((t - t0) / dur, 0, 1);
      let at = 0;
      nodes.forEach((n, j) => {
        const f = finals[j];
        let out = '';
        for (let i = 0; i < f.length; i++) {
          out += (at + i) / total < k || f[i] === ' ' ? f[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        n.nodeValue = out;
        at += f.length;
      });
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }


  /* ─── LIVE CHIPS: projects that are live keep a slow pulse ─── */
  $$('.chip--done').forEach(chip => {
    if (/^live/i.test(chip.textContent.trim())) chip.classList.add('chip--live');
  });


  /* ─── THE MARK (hero) ───
     The logo's "a." heads the page, a square dot per job as its full stop.
     Hover or focus a dot for the job's name; click to jump there. */
  const markBox = $('.hero__mark');
  const vb = $('svg', markBox).viewBox.baseVal;
  const tip = $('.mark__tip', markBox);

  // job names and numbers, read from the "What we build" list so nothing is written twice
  const jobInfo = {};
  $$('.jobs > li').forEach((li, i) => {
    jobInfo['#' + li.id] = { n: String(i + 1).padStart(2, '0'), t: $('h3', li).textContent };
  });

  $$('.mark__dot', markBox).forEach(dot => {
    const info = jobInfo[dot.getAttribute('href')];
    if (!info) return;
    dot.setAttribute('aria-label', `${info.n} ${info.t}`);
    const show = () => {
      const [x, y] = dot.getAttribute('transform').match(/[\d.]+/g).map(Number);
      tip.dataset.job = dot.dataset.job;
      tip.textContent = '';
      const b = document.createElement('b');
      b.textContent = info.n;
      tip.append(b, ' ' + info.t);
      tip.style.left = ((x - vb.x) / vb.width * 100) + '%';
      tip.style.top  = ((y - vb.y) / vb.height * 100) + '%';
      tip.style.setProperty('--ax', ((x - vb.x) / vb.width).toFixed(3));
      tip.classList.add('is-on');
    };
    const hide = () => tip.classList.remove('is-on');
    dot.addEventListener('pointerenter', show);
    dot.addEventListener('focus', show);
    dot.addEventListener('pointerleave', hide);
    dot.addEventListener('blur', hide);
  });


  /* ─── STRIP: what the assistant reads ─── */
  const marquee = $('.marquee');
  const track   = $('.marquee__track', marquee);
  const list    = $('.marquee__list', track);

  const fillMarquee = () => {
    while (track.children.length < 6 && track.scrollWidth < innerWidth + list.offsetWidth * 2) {
      const copy = list.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      track.appendChild(copy);
    }
  };

  if (!reduce) {
    fillMarquee();
    addEventListener('resize', fillMarquee);
    marquee.classList.add('is-moving');

    let x = 0, dir = 1, boost = 0, hold = 1, holdTarget = 1, lastY = scrollY, last = 0, raf = 0;
    addEventListener('scroll', () => {
      const dy = scrollY - lastY;
      lastY = scrollY;
      if (dy) dir = dy > 0 ? 1 : -1;
      boost = Math.min(boost + Math.abs(dy) * 0.5, 700);
    }, { passive: true });
    marquee.addEventListener('pointerenter', () => { holdTarget = 0; });
    marquee.addEventListener('pointerleave', () => { holdTarget = 1; });

    const step = (t) => {
      const dt = last ? Math.min(t - last, 64) / 1000 : 0;
      last = t;
      boost *= Math.exp(-dt * 2.5);
      hold = lerp(hold, holdTarget, 0.08);
      x -= (36 + boost) * dir * hold * dt;
      const w = list.offsetWidth;
      if (w) { while (x <= -w) x += w; while (x > 0) x -= w; }
      track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
      raf = requestAnimationFrame(step);
    };
    new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      last = 0;
      if (entry.isIntersecting) raf = requestAnimationFrame(step);
    }).observe(marquee);
  }


  /* ─── THE MARK (contact) ───
     A dot slides along the line and lands as its full stop. */
  const traveller = $('.contact__mark .mark__traveller');
  function travel(box) {
    if (reduce) return;   // the markup already places it at the end
    const [x1, y] = traveller.getAttribute('transform').match(/[\d.]+/g).map(Number);
    const x0 = Number(traveller.dataset.from);
    const put = (x) => traveller.setAttribute('transform', `translate(${x.toFixed(1)} ${y})`);
    put(x0);
    setTimeout(() => {
      const dur = 1500, t0 = performance.now();
      const step = (t) => {
        const k = clamp((t - t0) / dur, 0, 1);
        const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        put(x0 + (x1 - x0) * e);
        if (k < 1) requestAnimationFrame(step); else box.classList.add('is-landed');
      };
      requestAnimationFrame(step);
    }, 1150);
  }


  /* ─── POINTER POLISH: card spotlight, magnetic buttons, contact glow ─── */
  if (fine && !reduce) {
    $$('.card').forEach(card => card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }));

    $$('.btn, .nav__cta').forEach(el => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${(dx * 0.18).toFixed(1)}px, ${(dy * 0.3).toFixed(1)}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });

    const contact = $('.contact');
    contact.addEventListener('pointermove', (e) => {
      const r = contact.getBoundingClientRect();
      contact.style.setProperty('--gx', (e.clientX - r.left) + 'px');
      contact.style.setProperty('--gy', (e.clientY - r.top) + 'px');
    });
  }


  /* ─── COPY EMAIL + TOAST ─── */
  const toast = document.createElement('p');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  document.body.appendChild(toast);
  let toastTimer = 0;
  const say = (msg) => {
    toast.textContent = msg;
    toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-on'), 2200);
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch { /* not supported */ }
      ta.remove();
      return ok;
    }
  };

  $$('[data-copy]').forEach(btn => {
    btn.hidden = false;
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      say(await copyText(text) ? 'Email copied' : 'Could not copy. The address is ' + text);
      btn.textContent = 'Copied';
      setTimeout(() => { btn.textContent = 'Copy'; }, 1800);
    });
  });


  /* ─── DEEP LINKS ─── */
  // Opening on a #hash jumps before the web fonts load and shift the layout;
  // re-align once they have, then turn on smooth scrolling for in-page links.
  const target = location.hash && document.querySelector(location.hash);
  window.addEventListener('load', () => {
    const settle = () => requestAnimationFrame(() => {
      if (target) target.scrollIntoView();
      root.classList.add('is-ready');
    });
    document.fonts ? document.fonts.ready.then(settle) : settle();
  }, { once: true });
})();
