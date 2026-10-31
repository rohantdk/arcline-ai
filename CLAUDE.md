# Arcline AI — project memory

Niche site of Arcline (studio founded by Rohan Tidke) that sells only AI engineering, to owners of manufacturing
and export firms. Made in October 2026 because the owner wants Arcline niche: this site filters for AI clients,
while the full portfolio stays at `rohantdk/arcline.github.io`. The two sites stay separate; don't link one from
the other. Read `README.md` for structure, tokens and motion.

Live at https://arcline-ai-ace.vercel.app (Vercel project from this repo, deploys every push to `main`). The
network here blocks `*.vercel.app`; check deployments with the Vercel tools and `web_fetch_vercel_url`.

**Keep `.vercelignore`.** It stops Vercel publishing this file (`CLAUDE.md`), which holds private notes; before it
(30 October 2026) anyone could read them at /CLAUDE.md. Don't delete it, and add any new private file to it.
After a change to it, check that /CLAUDE.md returns 404 (the Context web-scrape tool can reach `*.vercel.app`
with `maxAgeMs: 0`). The GitHub repo itself is public, so the notes can still be read there.

## Ground rules (same as the main site)

- **Vanilla only.** No libraries, frameworks or CDN scripts.
- **Content is the owner's.** Don't change copy, numbers or claims unless asked.
- **Never invent proof.** No made-up results, testimonials or client names. Two slots are waiting for real ones:
  a client quote (name, role, firm type, with permission) and one measured result from a pilot. They go in Proof.
- **Studio voice:** "we" / "Arcline", never "I". Rohan is named once, in the founder caption in Contact. Never claim a team; Arcline
  "brings in specialist partners when a project needs them".
- **Never say where the studio is.** No city, state or address anywhere (page, meta, README, commits).
- **Motion:** without JavaScript the page reads in full (hidden states only under `html.js`); reduced motion gets
  the finished state (hidden states inside `prefers-reduced-motion: no-preference`); pointer effects check
  `(hover: hover) and (pointer: fine)`.

## Positioning (30 October 2026)

**First: outcomes.** The owner wants time, cost and revenue as the main message; privacy and ownership are the
second message ("And it stays yours"). The owner then mixed the two versions section by section: the hero
headline stays "Your company's own AI. Not rented. Not shared." with the outcomes in the line under it ("It saves
time, cuts costs and wins orders."); the problem, the three tiles (Win more orders, Save hours, Cut costs), the
ChatGPT answer and Contact ("Let's find the hours your team loses.") lead with outcomes; the tiles' title is "One
AI for your whole company." Keep outcomes concrete (tasks:
quotes, export documents, reports, sheet updates) and never print numbers until a pilot has measured them.
Angles advised: speed wins export orders ("reply to buyers first"); the big tools sell seats, Arcline builds the
finished workflow. Pending the owner's yes: "no per-user fees" (ownership as a cost argument) and "we measure
your hours before and after the pilot".

**Second: ownership.** Your company's own AI, built on its data, on its own servers or a private cloud account in
its name (the client's choice), never used to train anyone else's AI. The way in stays one workflow pilot, then
grow across teams; don't sell a company-wide setup from day one until a reference client exists.

## Promises the copy makes (must be deliverable)

The owner confirmed these can be delivered: answers that show their source document; actions a person approves
(drafts quotes, fills export documents, updates sheets); work across email, Excel and the client's ERP; a separate
AI per team (sales, accounts, production) with access limited to what that team may see; learning the company's
products and terms (tuned on its own data, never used to train anyone else's AI); answers in English, Hindi and
Marathi. "Tally" appears in the problem story only as where data lives; don't promise a Tally connection until
one is built. These are sold as a build service; no finished product exists yet.

## Owner's decisions (October 2026)

- The owner wanted the main site's vibe: the hero "a." mark (three dots instead of seven categories: "Win more
  orders", "Save hours", "Cut costs"; ids and colours still named docs, queries, reports), the
  scrolling strip, decoding labels, counting stats, nav section label, card spotlight. The headline stays the
  promise under the mark; don't swap it back for the brand name (the Ogilvy audit's main fix).
- Share image: `assets/og-banner.jpg` (1200 × 630), headline on the dark band with the live address. Rebuild it
  if the headline or address changes.
- Name: "Arcline" only (not "Arcline AI" or "Arcline Ace").
- Discovery call: 30 minutes.
- **Minimal copy** (30 October 2026): the owner found the page too wordy, so the copy was cut by half (about
  560 words). Say each point once, in the fewest words; no extra "You get" / "What it proves" lines.
- No "pilots start from ₹X" line for now.
- **Redesign (30 October 2026), live:** minimal copy (about 370 words), rounded interface with a square logo,
  a different layout per section, a nav that rounds into a pill on scroll, and a hero example that plays the
  task on hover. Reviewed first on a private claude.ai preview page, because this Vercel project builds only
  `main` (branches get no preview).
- The hero example (packing list request) is illustrative and labelled "Example".
- **Example loops, pills explain (30 October 2026):** the owner asked for the hero example to play by default and
  for each strip pill to show something of its own on hover. The example now loops while on screen; hovering pauses
  it so the visitor presses Approve ("That's your team's only step."). Each pill shows a small card: a question and
  what the AI does with it (illustrative, like the hero example; no numbers or results claimed, nothing beyond the
  confirmed promises). The strip still stops under the pointer so the card can be read.
- **Founder face (30 October 2026), live:** after rameerez.com's squishy face. The owner chose full squish over
  the gentler version advised. It first went live in the portfolio's About, then moved here at the owner's request.
  It sits right of the Contact headline on a violet disc (stacked under the buttons below 960px), captioned
  "Rohan Tidke" / "Founder · Arcline" with a "Drag the face" hint shown only when it's
  interactive. Pupils follow the mouse only; dragging works with touch.
- **The face looks like the owner** (drawn from a photo the owner sent; the photo is not in the repo): quiff, trimmed
  beard and moustache, strong brows, warm skin (`--skin`, `--lip` on `.founder`), ears, nose, dark suit over a light
  shirt. The photo looks up and to the side, so it can't be used with moving eyes; a real-photo version would need a
  straight-to-camera shot (eyes open and sharp, even light, 1000px+) and redrawn irises, shown before going live.
  Offered tweaks, not asked for yet: skin tone, taller quiff, thinner beard, calmer smile, tie.
- **Live demo and pilot (30 October 2026), live:** the owner asked for AI demos on
  open-source models via Groq ("Grok" in the request meant Groq, the host, not xAI's model) that make clients
  convert. Of seven ideas, two were kept: the hero example as a buyer-email reply with "try your own email" (sent to
  `api/demo.js`, Groq), and a "Your first pilot" section after Process that is sent on WhatsApp. Cut as
  low-conversion: sample-company Q&A, export-document filling, sheet reports (risk of wrong numbers), team switch.
  The owner chose: replace the hero example, scripted fallback, preview first.
  **Keep it simple (owner's words):** the first version (a details table, sources, language toggle, two samples,
  three pilot questions) was "too complex for a person who just visited" and "cluttered". Now the hero box is one
  buyer email, one reply, Approve, and a quiet "Try it with your own buyer email" link; the pilot is one question
  with five chips and a three-line pilot. Don't add back detail without asking.
  The pilot is rule-based, not a model: instant, and it only says what's confirmed. Pasted emails go to a public
  host, so the box says so. The owner added `GROQ_API_KEY` in Vercel and confirmed the chip shows "Live" (30 October
  2026); without the key, pasted emails get the WhatsApp fallback. Groq's model list changes; `GROQ_MODEL` overrides
  the default. The first default, `llama-3.3-70b-versatile`, had been shut down for free and developer accounts on
  16 August 2026 (the owner spotted it when the 503 said "resting"); now `openai/gpt-oss-120b` with
  `reasoning_effort: 'low'`. When the demo stops answering, check console.groq.com/docs/deprecations; the 503's
  `why` names Groq's error code.
  After Approve, "Book a 30-minute call" shows under "That's your team's only step." (owner's ask, 31 October
  2026: the site's goal is a discovery call). It opens WhatsApp with "I tried the buyer-email demo… I'd like to
  book a 30-minute discovery call." When a visitor presses Approve the box stays approved so the button can be
  used (this replaces the earlier 3-second return to the example, which would have hidden it); only the demo
  cursor's first two presses return the box to the example, and after its third the button stays on screen. The prompt keeps replies to "happy to quote", never "we can supply", and `missing` a short
  noun phrase (a first live reply read "We can supply 500…" and "missing: please confirm your…").

- **Demo cursors and a stretching neck (31 October 2026, live):** the owner asked for
  a cursor that shows Approve being pressed, a demo of dragging the face, and a neck that stretches instead of
  breaking. The hero box now has a cursor that glides to Approve and presses it, then the box resets and it plays
  again, three times in all (owner's choice, to teach the step without busy motion); it steps aside while a mouse is over the box and stops for good after a tap or "try your own email". The
  face gets a demo hand, three times about 6 seconds apart, that pulls the hairline up and lets go (eyes follow it); it pauses under
  the mouse and stops once a visitor drags. The neck is drawn each frame from the chin to the collar: it stretches,
  bends in an S when pulled sideways, thins as it stretches, with a shadow under the chin. None of it runs under
  reduced motion. The arrow cursor is used on phones too (clearer than a tap circle). Both pause only while the mouse moves over them and resume after 3 seconds
  still (a mouse resting where the face scrolled in had paused the face demo after one pull). The face caption now
  reads "Rohan Tidke" over "Founder · Arcline" (owner's ask, 31 October 2026), and the Studio line became "AI engineering for
  manufacturers and exporters." so Rohan is named once on the page, in the caption.

## Click counting (31 October 2026)

- The owner asked to count WhatsApp and email clicks and chose **Vercel Web Analytics** (no new account, no
  cookies, first-party: Vercel serves `/_vercel/insights/script.js` from the site itself, so the "no CDN scripts"
  rule holds). Alternatives offered: Umami Cloud (free, real events), an own `/api/click` counter with Upstash.
- The project is on the **Hobby** plan, which counts page views only (custom events need Pro). So `script.js`
  counts each click on a `[data-track]` element as a page view of `/click/<name>` (`va('pageview', { route,
  path })`, the same call as `@vercel/analytics`' `pageview()`). They show in Analytics → Pages. On Pro, switch to
  `va('event', { name })`.
- Names: `whatsapp-demo-call` (Book a 30-minute call after Approve), `whatsapp-demo-fallback` (demo resting),
  `whatsapp-pilot` (pilot section), `whatsapp-contact` / `email-contact` (Contact buttons), `whatsapp-footer` /
  `email-footer` (Contact list), `email-copy` (Copy button). A new WhatsApp or email link needs `data-track`.
- The script loads everywhere but localhost; on a non-Vercel host (Netlify) it would 404 harmlessly: remove it
  there. Analytics must be enabled in the Vercel project (Analytics tab → Enable) before the deploy that uses it;
  the `/_vercel/insights` route is added at deploy time.
- The /click/… views add to the page-view total; read visits from the `/` row. Test locally with a fake host
  (`page.route('https://arcline.test/**', …)` serving the folder) and read `window.vaq`.

## Portable copy for other hosts (30 October 2026)

- The owner asked for the site as a zip, to deploy on Vercel or Netlify later with a new custom domain. Given as
  `arcline-ai-site.zip`: one top folder `arcline-ai-site/` with `index.html`, `style.css`, `script.js` and
  `assets/` (`favicon.svg`, `og-banner.jpg`). Internal paths are relative, so it works on any host unchanged;
  tested by serving the extracted folder.
- Leave `CLAUDE.md`, `README.md` and `.git` out of any deploy copy. Don't commit the zip; build it in the
  scratchpad and make a fresh one whenever the owner asks (it goes stale with the next change).
- Told the owner: Netlify Drop (app.netlify.com/drop) takes the folder; on Vercel, add the domain to the existing
  Git-linked `arcline-ai` project (recommended) or run `npx vercel --prod` in the folder.
- Leave out the Vercel Analytics loader on a non-Vercel host (see "Click counting").
- On a new domain, update `og:url`, `og:image` and `canonical` in `index.html` (lines 11, 13 and 20) and redraw
  the share image, whose printed address is arcline-ai-ace.vercel.app.

## Open items

1. Fill the testimonial and result slots when real ones exist.
2. A/B test a second headline once there is traffic. (WhatsApp and email clicks are now counted; see
   "Click counting".)
3. Studio email on an own domain to replace the Gmail address.
4. Own domain: when bought, update the three address tags and the share image (see "Portable copy").
5. **Allow rule for page checks (owner said "later"):** in auto mode, Context Dev scrapes still asked the owner
   for permission (outbound to a paid third-party service). Offered: commit `.claude/settings.json` in this repo
   with `permissions.allow: ["mcp__Context_Dev__web-scrape"]`. It only takes effect in sessions with this repo
   alone, not in two-repo sessions.
6. Check the live demo's replies with real enquiries (German, terse WhatsApp-style, a non-enquiry) after the
   prompt change of 30 October: "happy to quote", placeholders like [price], no invented stock or dates. Watch
   Groq usage weekly at console.groq.com; the per-visitor limit is per server instance, so it is soft.

## Checking a change

Serve with `python3 -m http.server`, test in Playwright (Node package, `NODE_PATH=/opt/node22/lib/node_modules`)
at 1360px, 390px and `reducedMotion: 'reduce'`: no console errors, `scrollWidth` equal to the viewport width.

- The hero box's state is in its classes: `is-thinking` (typing dots), `is-answered`, `is-approved`. `python3 -m
  http.server` answers POSTs with 501, so a pasted email shows the WhatsApp fallback; test the live path with
  `page.route('**/api/demo', ...)` returning JSON (`enquiry`, `missing`, `reply`). The pilot's chips are hidden
  radio inputs: `check({ force: true })`.
- **The live demo can't be tested from a session:** the network blocks `*.vercel.app` for curl and WebFetch, and
  Context Dev's browser actions (typing, clicking) need a paid plan. Context Dev's plain scrape can read the live
  page and `script.js` (to confirm a deploy). For the API, the owner runs this in the site's DevTools Console and
  sends the line back; `why` in a 503 names the cause (no-key, `groq-<status>-<code>`, timeout, failed,
  empty-reply):
  `fetch('/api/demo',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:'Hello, we need 500 white cotton bath towels, 600 gsm, delivered to Rotterdam by June.'})}).then(r=>r.json().then(j=>console.log(r.status,j)))`.
  "grm ERROR" lines in the owner's console come from the Grammarly extension.
- The strip never stops moving, so Playwright's `scrollIntoViewIfNeeded` and locator actions on pills time out
  ("element is not stable"). Scroll `.marquee` into view with `evaluate`, keep the mouse off it (it pauses the
  strip), find a pill on screen with `getBoundingClientRect()` and hover it with `page.mouse.move`. The strip sits
  below the fold at 1360 × 900, so a mouse aimed at it without scrolling hits nothing.

## Making a change live

1. Work on the session's feature branch; show the owner screenshots first. Merge only when the owner says
   "make it live": open a pull request against `main` and squash-merge it. Vercel deploys `main` in about a minute.
2. Check the live page with the Context web-scrape tool (`maxAgeMs: 0`, `formats.parse` with CSS rules in
   `parseParams.rules`, e.g. the new element's text or attribute). The Vercel tools may not be in the session.
3. Restart the feature branch from the new `main` and give the owner the link, with a hard-reload reminder.
4. Restarting the branch: `git checkout -B <branch> origin/main` then `git push --force-with-lease`. Auto mode's
   safety check blocked `git commit --amend` with a plain `--force` push; make a new commit instead of amending.
   Backend-only fixes to an approved feature (the model switch, #6) were merged without a new "make it live";
   anything visible still waits for it.
5. When this repo is added to a session mid-way (`add_repo`), the shallow clone tracks only `main`: `git push -u`
   doesn't set tracking for the feature branch, and a stop hook then reports it as unpushed. Fix with
   `git config --add remote.origin.fetch '+refs/heads/<branch>:refs/remotes/origin/<branch>'`, `git fetch`,
   `git branch -u origin/<branch>`.
