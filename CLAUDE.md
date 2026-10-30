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
- **Studio voice:** "we" / "Arcline", never "I". Rohan is named once, in Contact. Never claim a team; Arcline
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
  "Founder" (Rohan is still named once, in the Studio line) with a "Drag the face" hint shown only when it's
  interactive. Pupils follow the mouse only; dragging works with touch.
- **The face looks like the owner** (drawn from a photo the owner sent; the photo is not in the repo): quiff, trimmed
  beard and moustache, strong brows, warm skin (`--skin`, `--lip` on `.founder`), ears, nose, dark suit over a light
  shirt. The photo looks up and to the side, so it can't be used with moving eyes; a real-photo version would need a
  straight-to-camera shot (eyes open and sharp, even light, 1000px+) and redrawn irises, shown before going live.
  Offered tweaks, not asked for yet: skin tone, taller quiff, thinner beard, calmer smile, tie.
- **Live demo and pilot (30 October 2026), on the feature branch, preview first:** the owner asked for AI demos on
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
  host, so the box says so. Not live until the owner adds `GROQ_API_KEY` in Vercel; until then pasted emails get
  the WhatsApp fallback. Groq's model list changes; `GROQ_MODEL` overrides the default. The first default,
  `llama-3.3-70b-versatile`, had been shut down for free and developer accounts on 16 August 2026 (the owner spotted
  it when the 503 said "resting"); now `openai/gpt-oss-120b` with `reasoning_effort: 'low'`. When the demo stops
  answering, check console.groq.com/docs/deprecations; the 503's `why` names Groq's error code.

## Portable copy for other hosts (30 October 2026)

- The owner asked for the site as a zip, to deploy on Vercel or Netlify later with a new custom domain. Given as
  `arcline-ai-site.zip`: one top folder `arcline-ai-site/` with `index.html`, `style.css`, `script.js` and
  `assets/` (`favicon.svg`, `og-banner.jpg`). Internal paths are relative, so it works on any host unchanged;
  tested by serving the extracted folder.
- Leave `CLAUDE.md`, `README.md` and `.git` out of any deploy copy. Don't commit the zip; build it in the
  scratchpad and make a fresh one whenever the owner asks (it goes stale with the next change).
- Told the owner: Netlify Drop (app.netlify.com/drop) takes the folder; on Vercel, add the domain to the existing
  Git-linked `arcline-ai` project (recommended) or run `npx vercel --prod` in the folder.
- On a new domain, update `og:url`, `og:image` and `canonical` in `index.html` (lines 11, 13 and 20) and redraw
  the share image, whose printed address is arcline-ai-ace.vercel.app.

## Open items

1. Fill the testimonial and result slots when real ones exist.
2. A/B test a second headline once there is traffic. Measure WhatsApp and email clicks.
3. Studio email on an own domain to replace the Gmail address.
4. Own domain: when bought, update the three address tags and the share image (see "Portable copy").

## Checking a change

Serve with `python3 -m http.server`, test in Playwright (Node package, `NODE_PATH=/opt/node22/lib/node_modules`)
at 1360px, 390px and `reducedMotion: 'reduce'`: no console errors, `scrollWidth` equal to the viewport width.

- The hero box's state is in its classes: `is-thinking` (typing dots), `is-answered`, `is-approved`. `python3 -m
  http.server` answers POSTs with 501, so a pasted email shows the WhatsApp fallback; test the live path with
  `page.route('**/api/demo', ...)` returning JSON (`enquiry`, `missing`, `reply`). The pilot's chips are hidden
  radio inputs: `check({ force: true })`.
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
4. When this repo is added to a session mid-way (`add_repo`), the shallow clone tracks only `main`: `git push -u`
   doesn't set tracking for the feature branch, and a stop hook then reports it as unpushed. Fix with
   `git config --add remote.origin.fetch '+refs/heads/<branch>:refs/remotes/origin/<branch>'`, `git fetch`,
   `git branch -u origin/<branch>`.
