/* Arcline — Private AI for manufacturers and exporters
   - Mobile menu toggle
   - Highlight the nav link for the part of the page in view
   - Scroll progress on the nav logo's baseline
   - Scroll reveals; the hero example plays question, answer, sources
   - The mark in Contact, with a dot that slides along its line
   - Magnetic buttons and the contact glow (mouse only)
   - Copy email
   All motion is skipped under prefers-reduced-motion.
*/

(() => {
  const root = document.documentElement;
  root.classList.add('motion');   // tells the <head> fallback that this script ran

  const $  = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

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
  };
  addEventListener('scroll', () => {
    if (!progressQueued) { progressQueued = true; requestAnimationFrame(updateProgress); }
  }, { passive: true });
  addEventListener('resize', updateProgress);
  updateProgress();


  /* ─── SCROLL REVEALS ─── */
  [['.hero .eyebrow', 0], ['.hero__title', 0.08], ['.hero__sub', 0.2], ['.hero__actions', 0.3], ['.hero__proof', 0.4]]
    .forEach(([sel, d]) => {
      const el = $(sel);
      el.classList.add('reveal');
      el.style.setProperty('--d', d + 's');
    });

  $$('.block .eyebrow, .block__title, .story p, .caption, .contact .eyebrow, .contact__title, .contact__lead, .contact__actions, .contact__mark')
    .forEach(el => el.classList.add('reveal'));

  // groups whose children come in one after another
  [['.jobs', 'li', 90], ['.why', 'div', 80], ['.cards', '.card', 90], ['.steps', 'li', 280], ['.faq', 'div', 60], ['.contact__grid', 'div', 80]]
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
      if (entry.target.matches('.contact__mark')) travel(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

  $$('.reveal').forEach(el => revealIO.observe(el));
  revealIO.observe(demo);


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


  /* ─── POINTER POLISH: magnetic buttons, contact glow ─── */
  if (fine && !reduce) {
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
