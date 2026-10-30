# Arcline AI — project memory

Niche site of Arcline (studio founded by Rohan Tidke) that sells only AI engineering, to owners of manufacturing
and export firms. Made in October 2026 because the owner wants Arcline niche: this site filters for AI clients,
while the full portfolio stays at `rohantdk/arcline.github.io`. The two sites stay separate; don't link one from
the other. Read `README.md` for structure, tokens and motion.

Live at https://arcline-ai-ace.vercel.app (Vercel project from this repo, deploys every push to `main`). The
network here blocks `*.vercel.app`; check deployments with the Vercel tools and `web_fetch_vercel_url`.

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

"Your company's own AI. Not rented. Not shared." Arcline builds custom AI for the whole company, owned by the
company: built on its data, on its own servers or a private cloud account in its name (the client's choice). Not
"a private ChatGPT that finds documents". The way in stays one workflow pilot, then grow across teams; don't sell
a company-wide setup from day one until a reference client exists.

## Promises the copy makes (must be deliverable)

The owner confirmed these can be delivered: answers that show their source document; actions a person approves
(drafts quotes, fills export documents, updates sheets); work across email, Excel and the client's ERP; a separate
AI per team (sales, accounts, production) with access limited to what that team may see; learning the company's
products and terms (tuned on its own data, never used to train anyone else's AI); answers in English, Hindi and
Marathi. "Tally" appears in the problem story only as where data lives; don't promise a Tally connection until
one is built. These are sold as a build service; no finished product exists yet.

## Owner's decisions (October 2026)

- The owner wanted the main site's vibe: the hero "a." mark (three dots instead of seven categories: "Knows your
  business", "Does the work", "Fits every team"; ids and colours still named docs, queries, reports), the
  scrolling strip, decoding labels, counting stats, nav section label, card spotlight. The headline stays the
  promise under the mark; don't swap it back for the brand name (the Ogilvy audit's main fix).
- Share image: `assets/og-banner.jpg` (1200 × 630), headline on the dark band with the live address. Rebuild it
  if the headline or address changes.
- Name: "Arcline" only (not "Arcline AI" or "Arcline Ace").
- Discovery call: 30 minutes.
- **Minimal copy** (30 October 2026): the owner found the page too wordy, so the copy was cut by half (about
  560 words). Say each point once, in the fewest words; no extra "You get" / "What it proves" lines.
- No "pilots start from ₹X" line for now.
- The hero example (spec sheet question) is illustrative and labelled "Example, not client data".

## Open items

1. Fill the testimonial and result slots when real ones exist.
2. A/B test a second headline once there is traffic. Measure WhatsApp and email clicks.
3. Studio email on an own domain to replace the Gmail address.

## Checking a change

Serve with `python3 -m http.server`, test in Playwright (Node package, `NODE_PATH=/opt/node22/lib/node_modules`)
at 1360px, 390px and `reducedMotion: 'reduce'`: no console errors, `scrollWidth` equal to the viewport width.
