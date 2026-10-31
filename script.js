/* Arcline — Your company's own AI
   - Mobile menu toggle
   - Highlight the nav link for the part of the page in view
   - Scroll progress on the nav logo's baseline, the section in view beside it, and
     the nav bar rounding into a pill once the page scrolls
   - Hero: the logo's "a." with a dot per job as its full stop
   - Scroll reveals, counting stats, labels that decode
   - The hero example: a buyer's email, the reply drafted, Approve; a visitor can
     try their own email, sent to /api/demo
   - Your first pilot: picking a task shows the pilot, sent to us on WhatsApp
   - Strip of what the AI works with, which speeds up and turns with the scroll;
     pointing at a pill shows what the AI does with it (mouse only)
   - The mark in Contact, with a dot that slides along its line
   - The founder's face in Contact: eyes follow the cursor, drag to squish
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


  /* ─── SCROLL PROGRESS: the logo's baseline fills; the bar rounds into a pill ─── */
  const nav = $('#nav');
  const markFill = $('.nav__mark-fill');
  let progressQueued = false;
  const updateProgress = () => {
    progressQueued = false;
    const max = root.scrollHeight - innerHeight;
    markFill.style.strokeDashoffset = String(1 - (max > 0 ? clamp(scrollY / max, 0, 1) : 0));
    nav.classList.toggle('is-scrolled', scrollY > 16);
    updateWhere();
  };

  /* ─── WHERE AM I: the section in view, beside the logo, tints the logo ─── */
  const logo  = $('.nav__logo');
  const where = $('.nav__where', logo);
  // each section takes the next of the three job colours
  const tints = ['queries', 'reports', 'docs'];
  // numbered in page order, named by each section's own label
  const sections = $$('main > section[id]').filter(s => $('.eyebrow', s));
  const sectionLabels = new Map(sections.map((s, i) => [s, {
    n: String(i + 1).padStart(2, '0'),
    t: $('.eyebrow', s).textContent,
    job: tints[i % tints.length],
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
    if (!cur) { logo.removeAttribute('data-job'); where.classList.remove('is-on'); return; }
    const { n, t, job } = sectionLabels.get(cur);
    logo.dataset.job = job;
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
  [['.hero__mark', 0], ['.hero__title', 0.5], ['.hero__sub', 0.7], ['.hero__actions', 0.8]]
    .forEach(([sel, d]) => {
      const el = $(sel);
      el.classList.add('reveal');
      el.style.setProperty('--d', d + 's');
    });

  $$('.block .eyebrow, .block__title, .statement, .statement__after, .contact .eyebrow, .contact__title, .contact__lead, .contact__actions, .founder, .contact__mark')
    .forEach(el => el.classList.add('reveal'));

  // groups whose children come in one after another
  [['.jobs', 'li', 110], ['.vows', 'li', 140], ['.stats', 'div', 90], ['.cards', '.card', 90], ['.steps', 'li', 160], ['.faq', 'details', 70], ['.contact__grid', 'div', 80]]
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


  /* ─── THE EXAMPLE: a buyer's email, the reply drafted, Approve ───
     The example is in the HTML, so the page reads without JavaScript; it plays in
     once when the box comes into view. "Try it with your own buyer email" opens a
     box; that email goes to /api/demo (an open-source model on Groq, api/demo.js).
     When that isn't there (no key, busy, offline) the answer offers WhatsApp, so
     the box never looks broken. Answers are written with textContent only. */
  {
    const chat   = $('.demo__chat', demo);
    const ask    = $('.demo__ask', demo);
    const own    = $('.demo__own', demo);
    const open   = $('.demo__try', demo);
    const field  = $('#demoMail');
    const send   = $('.demo__send', demo);
    const mode   = $('.demo__mode', demo);
    const typing = $('.demo__typing', chat);
    const mailTpl = $('.demo__mail', chat).cloneNode(true);
    const firstA  = $('.demo__a', chat).cloneNode(true);
    const tpl    = (id) => $('#' + id).content.cloneNode(true).firstElementChild;
    let asked = 0, resetTimer;
    const keep = () => clearTimeout(resetTimer);
    const set = (...cls) => {
      demo.classList.remove('is-thinking', 'is-answered', 'is-approved');
      demo.classList.add(...cls);
    };

    const fill = (data) => {
      const a = tpl('demo-live');
      const missing = String(data.missing || '').trim();
      $('[data-slot="missing"]', a).textContent = missing ? ' It asks for what is missing: ' + missing[0].toLowerCase() + missing.slice(1).replace(/\.$/, '') + '.' : '';
      $('[data-slot="reply"]', a).textContent = String(data.reply).trim();
      return a;
    };
    const rest = (text) => {
      const a = tpl('demo-rest');
      $('.demo__wa', a).href = 'https://wa.me/918857852631?text=' +
        encodeURIComponent("Hi Arcline, here's a buyer email. Can you show me the reply our own AI would draft?\n\n" + text.slice(0, 1200));
      return a;
    };
    // after Approve, the box goes back to the example, ready for the next visitor
    const reset = () => {
      asked++;
      const mail = mailTpl.cloneNode(true);
      mail.classList.add('is-new');
      chat.replaceChildren(mail, typing, firstA.cloneNode(true));
      mode.textContent = 'Example';
      mode.classList.remove('is-live');
      own.hidden = true;
      open.setAttribute('aria-expanded', 'false');
      field.value = '';
      own.classList.remove('is-short');
      set('is-answered');
    };

    const draft = async (text) => {
      keep();
      const mail = mailTpl.cloneNode(true);
      $('.demo__from', mail).textContent = "Your buyer's email";
      $('.demo__text', mail).textContent = text;
      mail.classList.add('is-new');
      chat.replaceChildren(mail, typing);
      set('is-thinking');
      send.disabled = true;
      const id = ++asked;
      let node, live = false;
      try {
        const r = await fetch('/api/demo', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }), signal: AbortSignal.timeout(15000),
        });
        if (!r.ok) throw new Error(r.status);
        const data = await r.json();
        if (data.enquiry === false) node = tpl('demo-odd');
        else if (data.reply) { node = fill(data); live = true; }
        else throw new Error('empty');
      } catch (e) {
        node = rest(text);
      }
      send.disabled = false;
      if (id !== asked) return;
      chat.append(node);
      mode.textContent = live ? 'Live' : 'Example';
      mode.classList.toggle('is-live', live);
      set('is-answered');
    };

    ask.hidden = false;
    open.addEventListener('click', () => {
      keep();
      own.hidden = !own.hidden;
      open.setAttribute('aria-expanded', String(!own.hidden));
      if (!own.hidden) field.focus();
    });
    ask.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = field.value.trim();
      own.classList.toggle('is-short', text.length < 20);
      if (text.length < 20) { field.focus(); return; }
      draft(text);
    });
    field.addEventListener('input', () => { keep(); own.classList.remove('is-short'); });

    const approve = () => {
      set('is-answered', 'is-approved');
      keep();
      resetTimer = setTimeout(() => { reset(); guide.next(); }, 3000);
    };
    demo.addEventListener('click', (e) => {
      if (e.target.closest('button.demo__ok')) approve();
    });

    /* A cursor shows the one step: it glides to Approve and presses it, then the
       box goes back to the example and it plays again, three times in all. It steps aside while a
       mouse is over the box (so the visitor can press it), and stops for good
       once the visitor taps the box or tries their own email. */
    const guide = { next() {} };
    if (!reduce) {
      const hand = document.createElement('span');
      hand.className = 'demo__cursor';
      hand.setAttribute('aria-hidden', 'true');
      hand.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 2v17.5l4.6-4.3 3 6.6 3-1.3-3-6.5H18Z"/></svg>';
      demo.append(hand);

      let timer, seen = false, over = false, off = false, plays = 0;
      const stop = () => {
        clearTimeout(timer);
        hand.classList.remove('is-on', 'is-press', 'is-tap');
      };
      const at = (x, y) => { hand.style.transform = `translate(${x}px, ${y}px)`; };
      const ready = () => seen && !over && !off && demo.classList.contains('is-answered') &&
        !demo.classList.contains('is-approved') && own.hidden && $('.demo__ok', chat);
      const play = () => {
        if (!ready()) return;
        const ok = $('.demo__ok', chat), d = demo.getBoundingClientRect(), b = ok.getBoundingClientRect();
        const x = b.left - d.left + b.width * 0.55, y = b.top - d.top + b.height * 0.55;
        hand.style.transition = 'none';
        at(x + 70, y + 90);
        hand.getBoundingClientRect();
        hand.style.transition = '';
        hand.classList.add('is-on');
        at(x, y);
        timer = setTimeout(() => {
          if (!ready()) return stop();
          hand.classList.add('is-press', 'is-tap');
          timer = setTimeout(() => {
            hand.classList.remove('is-press');
            if (++plays >= 3) off = true;   // three plays teach the step; then it rests
            approve();
            timer = setTimeout(() => hand.classList.remove('is-on', 'is-tap'), 700);
          }, 160);
        }, 1050);
      };
      guide.next = () => { stop(); timer = setTimeout(play, 1500); };

      new IntersectionObserver(([e]) => {
        seen = e.isIntersecting;
        if (seen) guide.next(); else stop();
      }).observe(demo);
      if (fine) {
        demo.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { over = true; stop(); } });
        demo.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') { over = false; guide.next(); } });
      }
      demo.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') { off = true; stop(); } });
      open.addEventListener('click', () => { off = true; stop(); });
    }

    // the first time the box is on screen, the reply is drafted
    if (!reduce) {
      set('is-thinking');
      const io = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setTimeout(() => { if (!asked) { set('is-answered'); guide.next(); } }, 2200);
      });
      io.observe(demo);
    }
  }


  /* ─── YOUR FIRST PILOT ───
     Picking a task fills the pilot beside it. Its lines are the inputs' data-build
     and data-still in index.html (no model: instant, and it only says what we can
     deliver). The WhatsApp link carries it as text. */
  {
    const form = $('.pilot__form');
    const plan = $('.plan');
    const slot = (k) => $(`[data-plan="${k}"]`, plan);
    const wa   = $('.plan__wa', plan);
    const put  = (k, text) => {
      const dd = slot(k);
      dd.textContent = text || dd.dataset.empty;
      dd.classList.toggle('is-empty', !text);
      if (!reduce && text) { dd.classList.remove('is-new'); void dd.offsetWidth; dd.classList.add('is-new'); }
    };
    $$('dd[data-empty]', plan).forEach(dd => dd.classList.add('is-empty'));

    form.addEventListener('change', () => {
      const task = $('input[name="task"]:checked', form);
      slot('task').textContent = task.value;
      put('build', task.dataset.build);
      put('still', task.dataset.still);
      wa.href = 'https://wa.me/918857852631?text=' + encodeURIComponent(
        `Hi Arcline, our first pilot would be: ${task.value}. Can we book the 30-minute call?`);
    });
  }


  /* ─── STRIP: what the AI works with ─── */
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


  /* ─── WHAT EACH PILL DOES (mouse only) ───
     Pointing at a pill stops the strip and shows a small card: something the
     team might ask, and what the AI does with it. Words come from the pill's
     data-ask / data-does in index.html. */
  if (fine && !reduce) {
    const card = document.createElement('div');
    card.className = 'pill-card';
    card.setAttribute('aria-hidden', 'true');
    card.innerHTML = '<p class="pill-card__label"></p><p class="pill-card__ask"></p><p class="pill-card__does"></p>';
    document.body.appendChild(card);
    const [label, ask, does] = card.children;

    const show = (li) => {
      label.textContent = li.textContent;
      ask.textContent = li.dataset.ask;
      does.textContent = li.dataset.does;
      card.style.setProperty('--dot', getComputedStyle(li, '::before').backgroundColor);
      card.classList.add('is-on');
      current = li;
      if (!follow) follow = requestAnimationFrame(place);
    };
    // the strip glides to a stop, so the card follows its pill until it settles
    let current = null, follow = 0;
    const place = () => {
      follow = 0;
      if (!current) return;
      const r = current.getBoundingClientRect(), w = card.offsetWidth, h = card.offsetHeight;
      const x = clamp(r.left + r.width / 2 - w / 2, 16, innerWidth - w - 16);
      const y = r.top - h - 12 > 8 ? r.top - h - 12 : r.bottom + 12;
      card.style.left = x.toFixed(1) + 'px';
      card.style.top = y.toFixed(1) + 'px';
      follow = requestAnimationFrame(place);
    };
    const hide = () => {
      card.classList.remove('is-on');
      current = null;
      cancelAnimationFrame(follow);
      follow = 0;
    };

    marquee.addEventListener('pointerover', (e) => {
      const li = e.target.closest('li[data-ask]');
      if (li && e.pointerType === 'mouse') show(li);
    });
    marquee.addEventListener('pointerout', (e) => {
      if (!e.relatedTarget || !e.relatedTarget.closest || e.relatedTarget.closest('li[data-ask]') !== e.target.closest('li[data-ask]')) hide();
    });
    addEventListener('scroll', hide, { passive: true });
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


  /* ─── THE FOUNDER'S FACE (contact) ───
     Drag it and the face stretches toward the pointer, then wobbles back on a
     spring. The square pupils follow the cursor (or the finger while dragging)
     and it blinks now and then. Shapes are read from the SVG in index.html and
     redrawn as dense polylines, so the static face is what no-JS readers see. */
  const founder = $('.founder');
  if (founder && !reduce) {
    const svg = $('svg', founder);
    const head = $('.founder__head', founder);
    const shapes = $$('[data-squish]', founder).map(el => {
      const len = el.getTotalLength();
      const n = el === head ? 72 : Math.max(28, Math.round(len / 5));
      const pts = Array.from({ length: n + 1 }, (_, i) => {
        const p = el.getPointAtLength(len * i / n);
        return [p.x, p.y];
      });
      const closed = /z\s*$/i.test(el.getAttribute('d'));
      if (closed) pts.pop();
      const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length;
      const cy = pts.reduce((a, p) => a + p[1], 0) / pts.length;
      return { el, pts, closed, cx, cy, kind: el.dataset.squish };
    });
    const whites = shapes.filter(s => s.el.classList.contains('founder__white'));
    const pupils = $$('.founder__pupil', founder);
    const hc = { x: 120, y: 104, r: 76 };   // the head circle in index.html

    const neck = $('.founder__neck', founder), shade = $('.founder__shade', founder);
    const NECK = { x: 120, w: 16, top: 150, chin: 172, base: 198 };
    const ease = (u) => u * u * (3 - 2 * u);

    // the neck: joined to the chin above and the collar below, so it stretches and
    // bends with the head (an S-curve when pulled sideways) and thins as it stretches
    const drawNeck = () => {
      const [tx, ty] = move(NECK.x, NECK.chin);
      const T = { x: tx - NECK.x, y: ty - NECK.chin };
      const rest = NECK.base - NECK.chin;
      const now = Math.hypot(T.x, NECK.base - ty);
      const thin = clamp(Math.sqrt(rest / Math.max(now, 1)), 0.78, 1.15);
      const N = 14, L = [], R = [], S = [];
      for (let i = 0; i <= N; i++) {
        const u = i / N, k = 1 - ease(u);
        const cx = NECK.x + T.x * k, cy = lerp(NECK.chin + T.y, NECK.base, u);
        const w = NECK.w * (1 + (thin - 1) * Math.sin(Math.PI * Math.min(1, u * 1.3)));
        L.push([cx - w, cy]); R.push([cx + w, cy]);
      }
      const cap = [[NECK.x - NECK.w + T.x, NECK.top + T.y], [NECK.x + NECK.w + T.x, NECK.top + T.y]];
      const pts = [cap[0], ...L, ...R.reverse(), cap[1]];
      neck.setAttribute('d', pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('') + 'Z');
      // a soft shadow under the chin, deeper as the neck stretches
      const depth = 7 + clamp((now - rest) * 0.25, 0, 12);
      const top = NECK.chin + T.y, a = L[0], b = R[R.length - 1];
      shade.setAttribute('d', `M${(a[0] - 1).toFixed(1)} ${(top - 6).toFixed(1)}L${(b[0] + 1).toFixed(1)} ${(top - 6).toFixed(1)}L${(b[0] + 1).toFixed(1)} ${(top + depth * 0.6).toFixed(1)}Q${(NECK.x + T.x).toFixed(1)} ${(top + depth * 1.6).toFixed(1)} ${(a[0] - 1).toFixed(1)} ${(top + depth * 0.6).toFixed(1)}Z`);
    };

    const M = 70, SIGMA = 62;               // how far it stretches, how wide the pull is
    let grab = null, start = null, pull = { x: 0, y: 0 };
    let D = { x: 0, y: 0 }, V = { x: 0, y: 0 };
    const gaze = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
    let aim = null;
    let blinkAt = 0, visible = false, raf = 0;

    const toSvg = (cx, cy) => {
      const m = svg.getScreenCTM();
      return m ? new DOMPoint(cx, cy).matrixTransform(m.inverse()) : { x: 0, y: 0 };
    };

    // where a resting point goes: a soft local pull around the grab, plus a little of the whole head
    const move = (x, y) => {
      if (!grab) return [x, y];
      const dx = x - grab.x, dy = y - grab.y;
      const w = Math.exp(-(dx * dx + dy * dy) / (2 * SIGMA * SIGMA));
      const k = 0.78 * w + 0.22;
      return [x + D.x * k, y + D.y * k];
    };

    const frame = (t) => {
      raf = 0;
      // spring: stiff while held, loose and wobbly once let go
      const held = !!start;
      const tx = held ? pull.x : 0, ty = held ? pull.y : 0;
      const kS = held ? 0.3 : 0.11, damp = held ? 0.62 : 0.86;
      V.x = V.x * damp + (tx - D.x) * kS; V.y = V.y * damp + (ty - D.y) * kS;
      D.x += V.x; D.y += V.y;
      const s = clamp(Math.hypot(D.x, D.y) / M, 0, 1);

      const blink = t - blinkAt < 140 ? 0.12 : 1;

      shapes.forEach(sh => {
        const isWhite = whites.includes(sh);
        const d = sh.pts.map(([x, y], i) => {
          if (sh.kind === 'brow') y -= s * 9;
          if (sh.kind === 'mouth') y = sh.cy + (y - sh.cy) * (1 + s * 0.9);
          if (isWhite) y = sh.cy + (y - sh.cy) * blink;
          const [px, py] = move(x, y);
          return (i ? 'L' : 'M') + px.toFixed(1) + ' ' + py.toFixed(1);
        }).join('') + (sh.closed ? 'Z' : '');
        sh.el.setAttribute('d', d);
      });

      drawNeck();

      // pupils: look at the pointer, from wherever the eye has been pulled to
      whites.forEach((w, i) => {
        const [ex, ey] = move(w.cx, w.cy);
        let gx = 0, gy = 0;
        if (ghost.aim || aim) {
          const p = ghost.aim || toSvg(aim.x, aim.y);
          const vx = p.x - ex, vy = p.y - ey, len = Math.hypot(vx, vy) || 1;
          const r = Math.min(6, len * 0.06);
          gx = vx / len * r; gy = vy / len * r;
        }
        const g = gaze[i];
        g.x = lerp(g.x, gx, 0.22); g.y = lerp(g.y, gy, 0.22);
        const px = ex + g.x, py = ey + g.y;
        pupils[i].setAttribute('x', (px - 6).toFixed(1));
        pupils[i].setAttribute('y', (py - 6 * blink).toFixed(1));
        pupils[i].setAttribute('height', (12 * blink).toFixed(1));
      });

      const settled = !held && Math.hypot(D.x, D.y) < 0.05 && Math.hypot(V.x, V.y) < 0.05;
      if (settled && grab) { D = { x: 0, y: 0 }; V = { x: 0, y: 0 }; grab = null; }
      if (visible) raf = requestAnimationFrame(frame);
    };
    const wake = () => { if (!raf && visible) raf = requestAnimationFrame(frame); };

    new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake(); }).observe(svg);

    const scheduleBlink = () => setTimeout(() => { blinkAt = performance.now(); scheduleBlink(); }, 2600 + Math.random() * 3800);
    scheduleBlink();

    if (fine) {
      window.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') aim = { x: e.clientX, y: e.clientY }; }, { passive: true });
      document.addEventListener('mouseleave', () => { if (!start) aim = null; });
    }

    svg.addEventListener('pointerdown', (e) => {
      const p = toSvg(e.clientX, e.clientY);
      if (Math.hypot(p.x - hc.x, p.y - hc.y) > hc.r + 10) return;
      ghost.off = true; ghost.stop();
      e.preventDefault();
      svg.setPointerCapture(e.pointerId);
      // grab where the pointer lands on the face as it is drawn now
      grab = { x: p.x - D.x, y: p.y - D.y };
      start = { x: p.x - D.x, y: p.y - D.y };
      pull = { x: D.x, y: D.y };
      aim = { x: e.clientX, y: e.clientY };
      founder.classList.add('is-dragging');
      wake();
    });
    svg.addEventListener('pointermove', (e) => {
      if (!start) return;
      const p = toSvg(e.clientX, e.clientY);
      const dx = p.x - start.x, dy = p.y - start.y, r = Math.hypot(dx, dy) || 1;
      const soft = M * Math.tanh(r / M);    // rubber band: harder to pull the further it goes
      pull = { x: dx / r * soft, y: dy / r * soft };
      aim = { x: e.clientX, y: e.clientY };
    });
    const release = (e) => {
      if (!start) return;
      start = null;
      if (e.pointerType !== 'mouse') aim = null;
      founder.classList.remove('is-dragging');
      wake();
    };
    svg.addEventListener('pointerup', release);
    svg.addEventListener('pointercancel', release);

    /* The demo drag: while nobody is using the face, a hand grabs the top of the
       head every few seconds, pulls it up (the neck stretches), and lets go, three times in all. It
       steps aside while a mouse is over the face and stops once someone drags it. */
    const hand = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    hand.setAttribute('class', 'founder__ghost');
    hand.innerHTML = '<g><path d="M0 0v21l5.5-5.2 3.6 7.9 3.6-1.6-3.6-7.8H17Z"/></g>';
    svg.append(hand);
    const ghost = { aim: null, off: false, over: false, timers: [], plays: 0 };
    const later = (ms, fn) => ghost.timers.push(setTimeout(fn, ms));
    const place = (x, y) => { hand.style.transform = `translate(${x}px, ${y}px)`; };
    ghost.stop = () => {
      ghost.timers.forEach(clearTimeout); ghost.timers = [];
      cancelAnimationFrame(ghost.raf);
      if (ghost.held) { ghost.held = false; start = null; wake(); }
      ghost.aim = null;
      hand.classList.remove('is-on', 'is-press');
    };
    ghost.run = () => {
      ghost.stop();
      if (ghost.off || ghost.over || !visible || start) return;
      const g = { x: 122, y: 64 };                 // the hairline
      const to = { x: 12 - Math.random() * 24, y: -62 };
      hand.style.transition = 'none';
      place(g.x + 60, g.y - 30);
      hand.getBoundingClientRect();
      hand.style.transition = '';
      hand.classList.add('is-on');
      place(g.x, g.y);
      ghost.aim = { x: g.x, y: g.y };
      later(950, () => {
        hand.classList.add('is-press');
        hand.style.transition = 'opacity .35s ease';   // follow the face frame by frame
        ghost.held = true;
        grab = { x: g.x, y: g.y }; start = { ...g }; pull = { x: 0, y: 0 };
        wake();
        const t0 = performance.now();
        const step = (t) => {
          const u = Math.min(1, (t - t0) / 900), e = ease(u);
          pull = { x: to.x * e, y: to.y * e };
          place(g.x + D.x, g.y + D.y);
          ghost.aim = { x: g.x + D.x, y: g.y + D.y };
          if (ghost.held) ghost.raf = requestAnimationFrame(step);
        };
        ghost.raf = requestAnimationFrame(step);
        later(1500, () => {
          cancelAnimationFrame(ghost.raf);
          ghost.held = false; start = null; wake();
          hand.classList.remove('is-press');
          later(350, () => { hand.classList.remove('is-on'); ghost.aim = null; });
          if (++ghost.plays >= 3) ghost.off = true;   // three pulls, then it rests
          else later(5200, ghost.run);
        });
      });
    };
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { ghost.stop(); later(1400, ghost.run); } else ghost.stop();
    }).observe(svg);
    if (fine) {
      founder.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { ghost.over = true; ghost.stop(); } });
      founder.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') { ghost.over = false; ghost.stop(); later(2500, ghost.run); } });
    }

    $('.founder__hint', founder).hidden = false;
    founder.classList.add('is-live');
  }


  /* ─── QUESTIONS: answers slide open and shut ───
     Browsers with ::details-content do this in CSS; this covers the rest. */
  if (!reduce && !CSS.supports('selector(::details-content)')) {
    $$('.faq details').forEach(d => {
      const answer = $('p', d);
      let anim = null, isOpen = d.open;
      const slide = (open) => {
        if (anim) anim.cancel();
        if (open) d.open = true;
        const h = answer.offsetHeight;
        answer.style.overflow = 'hidden';
        anim = answer.animate(
          [{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }],
          { duration: 420, easing: 'cubic-bezier(.2,.7,.2,1)', direction: open ? 'normal' : 'reverse' });
        anim.onfinish = () => { if (!open) d.open = false; answer.style.overflow = ''; anim = null; };
      };
      $('summary', d).addEventListener('click', (e) => {
        e.preventDefault();
        isOpen = !isOpen;
        slide(isOpen);
      });
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
