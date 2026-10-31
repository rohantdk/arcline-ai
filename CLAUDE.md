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
  task on hover. Reviewed first on a private claude.ai preview page. (Since then Vercel also builds a Preview
  deployment for every feature-branch push, seen 31 October 2026; its links sit behind Vercel login.)
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

- **Chat-style questions (31 October 2026, live):** the owner sent a React + motion FAQ component ("use this code
  for FAQs"); rebuilt in vanilla, since the site has no framework. Questions are grey bubbles on the left; a click
  opens the answer as a violet reply bubble on the right with the "a." mark as avatar (the component's RareMark is
  another company's logo, so it wasn't used). One open at a time; the answer pops in on a spring (a damped spring
  sampled into a CSS `linear()` easing), the questions below slide (FLIP), a closing answer leaves the flow and
  fades; arrow keys, Home and End move between questions. No JS: every answer shows. Reduced motion: instant.
  Copy unchanged.

- **"Your numbers" cost calculator (31 October 2026, live):** the owner asked for a measurable "see the difference"
  section, like EV sites' fuel-savings calculators, using a React rolling-counter component, in the visitor's
  currency. Advised against a savings figure: it needs a percentage we haven't measured (the "no numbers until a
  pilot" rule). The owner chose option 1: the visitor's **current** cost only. After the pilot section: people ×
  hours each a week × cost per hour × 52 → "Every year ₹6,24,000 and 1,560 hours of your team's time. That's one
  repetitive task, today. Let's cut it." + "Book a 30-minute call" (WhatsApp with the figure, `data-track=
  "whatsapp-calculator"`). Rebuilt in vanilla: one 0–9 column per place on a spring, rolling up when on screen.
  Currency from the time zone (Asia/Kolkata → INR, London → GBP, Dubai → AED, eurozone → EUR, Americas → USD),
  then the browser language region, else USD; menu to change. INR uses Indian grouping (6,24,000). Default rates
  per currency (INR 400, USD 30, EUR 30, GBP 25, AED 100) and 3 people × 10 hours are placeholders the owner
  didn't set; change them in `script.js` (`CUR`) and the inputs' `value`s in `index.html`. Never add a "saved"
  figure until a pilot has measured one.

- **Hero box as a conversation (31 October 2026, live):** the owner asked to use
  `npx shadcn add @kobra/conversation` (React + base-ui + Tailwind, registry kobra.systems/r/{name}.json) for the
  hero box. Rebuilt its look in CSS only, same markup and script: the buyer's email a grey bubble on the left, the
  AI's note (violet tint) and drafted reply (solid violet, white text) as joined bubbles on the right with
  "Your AI" above, 18px corners with an 8px corner on the sender's side. Owner's choices: same demo and words,
  Arcline violet (not the component's iMessage blue), no tap-to-show timestamps, screenshots first.

- **Nav pill with a neon edge (31 October 2026, live):** the owner sent a React "Neon
  Edge Button" (white conic beam circling a black button, lucide Zap icon) for the current section in the nav, and
  asked that it "transfer as we progress". Built in CSS + a few lines in script.js: one `.nav__pill` behind the
  links, faint violet edge, a violet conic beam looping round it every 3 s, gliding (transform + width) to the active
  link. Owner's choices: loop all the time (advised a single run, owner chose the loop), no icon. Desktop bar
  only; the phone menu keeps the plain tint. Reduced motion: a still violet edge, no beam, no glide.

- **Components the owner sends (pattern since 31 October 2026):** the owner often pastes React / shadcn / motion /
  Tailwind components ("use this code", `npx shadcn add @…`). The site stays vanilla, so each is rebuilt in plain
  CSS/JS in the site's tokens, keeping its look and motion, and the owner is told why. Swap out brand marks (use the
  "a." mark), use Arcline violet instead of the component's colour, keep the three motion must-haves, and ask about
  content, colour, extras and preview vs live first. To read a shadcn registry item: the network blocks the
  registries, but Context Dev can: find the namespace's URL in `https://ui.shadcn.com/r/registries.json`
  (`formats.highlights`, query `"name":"@kobra"`; `formats.json` guessed wrong), then scrape the item JSON
  (e.g. `https://kobra.systems/r/conversation.json`) with `formats.bytes` and decode the base64.

- **"One Line" redesign (31 October 2026), preview only, not live:** the owner asked for a "crazy, eye-catching,
  interactive" redesign keeping the palette and every word of copy, with a backup first. Backup: branch
  `backup/pre-redesign` (commit 5c073bd, the live site before it; the proxy refused the tag push). Restore with
  `git checkout -B main origin/backup/pre-redesign` in a PR, or just don't merge the redesign. Concept chosen by the
  owner from four: the logo's one thick line runs through the whole page (`line.js`): it leaves the hero "a.", runs
  under each heading left-right-left, the process steps are stops on it, and it ends as the baseline of the Contact
  "a."; it draws with the scroll, a square head takes each section's job colour, section numbers light up when it
  arrives. Mouse only: crossing it plucks it (a damped wave), grabbing pulls it. Everything else went square (the
  logo's ends): `--r*` and `--pill` are 0, hard offset shadows (`--hard`), full-bleed bands; chat bubbles stay round.
  Bigger type (hero 132px max). Reduced motion: full line, no head, no wave; no JS: no line.

- **"The Document" redesign (31 October 2026), preview only, not live:** a second, separate experiment the owner
  asked for after liking One Line ("whole new redesign, we are just experimenting"). Built from the live site, not
  on top of One Line, which stays in this branch's history (commit 9de6003) and its own preview page. The page is a
  dark desk (`--desk`, the band colour, with a lamp glow following the mouse) and every section's `.wrap` is a white
  sheet at a slight angle, with line numbers, a red margin rule and a page number (`doc.js`). Sheets slide onto the
  desk; headings type themselves with a violet caret (the full text stays in `aria-label` while typing); the problem
  is a pink memo with "paperwork." highlighted (a `<mark>`, copy unchanged); the three jobs and the four steps are
  form boxes that tick; the promises are rubber stamps; proof cards are clipped index cards; the plan is a carbon
  copy; the yearly cost is double-underlined; Contact is the last page with a signature line and the founder as a
  clipped photo. Palette and copy unchanged. Reduced motion: no dealing, typing or lamp; no JS: every sheet reads.

- **"Murmuration" redesign (31 October 2026), preview only, not live:** the third experiment ("really crazy,
  something no one ever thought about"), again built from the live site; One Line (9de6003) and The Document
  (4ff6aa0) stay in this branch's history with their own preview pages. A flock of 1,600 square dots (900 on
  phones), the logo's full stop many times over, streams like starlings into a figure per section (`swarm.js`):
  the "a." with three dots, a pile of loose sheets (problem), three bars (build), a vault (why), four blocks
  (proof), a staircase (process), one block with orbits (pilot), a clock (cost), two chat bubbles (questions),
  the "a." with one dot (contact). Story: chaos into order. Wide screens (1100px+): a dark stage on the right
  (44vw) with the section's number and label, the page a reading column on the left; phones: the flock lives
  behind the page and each figure rides in the 46vh gap above its section. Mouse: the flock swirls from the
  cursor, a click on the stage scatters it, pointing at anything with `data-job` lights up that colour. Figures
  are drawn on a hidden canvas and sampled into points, so new ones are a few lines in `DRAW`. Reduced motion:
  dots jump to each figure, no drift; no JS: the usual page.

## Click counting (31 October 2026)

- The owner asked to count WhatsApp and email clicks and chose **Vercel Web Analytics** (no new account, no
  cookies, first-party: Vercel serves `/_vercel/insights/script.js` from the site itself, so the "no CDN scripts"
  rule holds). Alternatives offered: Umami Cloud (free, real events), an own `/api/click` counter with Upstash.
- The project is on the **Hobby** plan, which counts page views only (custom events need Pro). So `script.js`
  counts each click on a `[data-track]` element as a page view of `/click/<name>` (`va('pageview', { route,
  path })`, the same call as `@vercel/analytics`' `pageview()`). They show in Analytics → Pages. On Pro, switch to
  `va('event', { name })`.
- Names: `whatsapp-demo-call` (Book a 30-minute call after Approve), `whatsapp-demo-fallback` (demo resting),
  `whatsapp-pilot` (pilot section), `whatsapp-calculator` (Your numbers), `whatsapp-contact` / `email-contact` (Contact buttons), `whatsapp-footer` /
  `email-footer` (Contact list), `email-copy` (Copy button). A new WhatsApp or email link needs `data-track`.
- The script loads everywhere but localhost; on a non-Vercel host (Netlify) it would 404 harmlessly: remove it
  there. Analytics must be enabled in the Vercel project (Analytics tab → Enable) before the deploy that uses it;
  the `/_vercel/insights` route is added at deploy time. On 31 October the merge (#13) deployed before the switch
  took effect, so `/_vercel/insights/script.js` gave 404 until the owner redeployed (project → Deployments →
  Production row → ⋯ → Redeploy). It is served now (script "0.1.3"; `va('pageview', { route, path })` sends a
  view of `path`). The script skips headless browsers, so Playwright can't produce a real count.
- Check the counts: Vercel → arcline-ai → Analytics → Pages, rows starting `/click/`.
- **How the owner uses it (advised 31 October 2026):** the score is call clicks (all `whatsapp-*` and `email-*`
  rows) ÷ visits (the `/` row); `whatsapp-demo-call` is the main number. Change one thing at a time and compare two
  weeks before and after, once there are at least 100 visits. Use Referrers and countries to see which posts bring
  visitors. A click isn't a call: monthly, count WhatsApp chats opening with "I tried the buyer-email demo…" and
  follow clicks → chats → calls → clients. Owner's routine: a test click first (an ad blocker can hide it), then
  5 minutes every Monday noting visits, call clicks and score; after a month, ask to improve the weakest button.
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
2. A/B test a second headline once there is traffic (100+ visits), judged by the click score (see "Click
   counting").
3. Studio email on an own domain to replace the Gmail address.
4. Own domain: when bought, update the three address tags and the share image (see "Portable copy").
5. **Allow rule for page checks (owner said "later"):** in auto mode, Context Dev scrapes still asked the owner
   for permission (outbound to a paid third-party service). Offered: commit `.claude/settings.json` in this repo
   with `permissions.allow: ["mcp__Context_Dev__web-scrape"]`. It only takes effect in sessions with this repo
   alone, not in two-repo sessions.
6. Check the live demo's replies with real enquiries (German, terse WhatsApp-style, a non-enquiry) after the
   prompt change of 30 October: "happy to quote", placeholders like [price], no invented stock or dates. Watch
   Groq usage weekly at console.groq.com; the per-visitor limit is per server instance, so it is soft.
7. **About December 2026:** after a month of counts, the owner brings the numbers; improve the weakest call button
   or remove buttons with no clicks. The owner's test click (Approve → Book a 30-minute call → a
   `/click/whatsapp-demo-call` row in Analytics → Pages) was not confirmed in the session.

## Checking a change

Serve with `python3 -m http.server`, test in Playwright (Node package, `NODE_PATH=/opt/node22/lib/node_modules`)
at 1360px, 390px and `reducedMotion: 'reduce'`: no console errors, `scrollWidth` equal to the viewport width.

- The hero box's state is in its classes: `is-thinking` (typing dots), `is-answered`, `is-approved`. `python3 -m
  http.server` answers POSTs with 501, so a pasted email shows the WhatsApp fallback; test the live path with
  `page.route('**/api/demo', ...)` returning JSON (`enquiry`, `missing`, `reply`). The pilot's chips are hidden
  radio inputs: `check({ force: true })`.
- Your numbers: test currencies with Playwright's `timezoneId` (`Asia/Kolkata` → ₹6,24,000, `America/Chicago` →
  $46,800, `Europe/Berlin` → €46,800, `Asia/Tokyo` → USD fallback); the sum's text is in `.cost__sum .sr`. Try a
  huge sum (250 × 40 × 2000) on a phone: it must shrink to fit.
- Right after a jump scroll the nav itself can be out of a screenshot; to see the pill glide, sample `.nav__pill` `getBoundingClientRect().left`
  every ~90 ms after a scroll to see it glide.
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
