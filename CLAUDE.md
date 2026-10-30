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
