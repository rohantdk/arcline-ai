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

## Promises the copy makes (must be deliverable)

Answers that show their source document; an on-premises option (office computer) or a private cloud account in
the client's name; never used to train AI; answers in English, Hindi and Marathi; reads email, spreadsheets and
shared folders. "Tally" appears in the problem story only as where data lives; don't promise a Tally connection
until one is built. These are sold as a build service; no finished product exists yet.

## Owner's decisions (October 2026)

- The owner wanted the main site's vibe: the hero "a." mark (three job dots instead of seven categories), the
  scrolling strip, decoding labels, counting stats, nav section label, card spotlight. The headline stays the
  promise under the mark; don't swap it back for the brand name (the Ogilvy audit's main fix).
- Share image: `assets/og-banner.jpg` (1200 × 630), headline on the dark band with the live address. Rebuild it
  if the headline or address changes.
- Name: "Arcline" only (not "Arcline AI" or "Arcline Ace").
- Discovery call: 30 minutes.
- **Minimal copy** (30 October 2026): the owner found the page too wordy, so the copy was cut by half (about
  560 words). Say each point once, in the fewest words; no extra "You get" / "What it proves" lines. The share
  image still shows the old, longer headline.
- No "pilots start from ₹X" line for now.
- The hero example (spec sheet question) is illustrative and labelled "Example, not client data".

## Open items

1. Fill the testimonial and result slots when real ones exist.
2. A/B test: headline B "Private AI that answers from your own export files. Your data never leaves your
   control."; CTA B "Show us one task that eats your team's week". Measure WhatsApp and email clicks.
3. Studio email on an own domain to replace the Gmail address.

## Checking a change

Serve with `python3 -m http.server`, test in Playwright (Node package, `NODE_PATH=/opt/node22/lib/node_modules`)
at 1360px, 390px and `reducedMotion: 'reduce'`: no console errors, `scrollWidth` equal to the viewport width.
