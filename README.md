# Arcline — Your company's own AI

The niche site of Arcline: AI engineering only, for owners of manufacturing and export firms. One static page
(`index.html`, `style.css`, `script.js`, `assets/`), hand-coded, no framework, no build step.

The studio's full portfolio (websites, Shopify, apps, brand work) lives at `rohantdk/arcline.github.io`. The two
sites are kept separate on purpose and don't link to each other.

## Page structure

| Section | id | Job |
|---|---|---|
| Hero | `#top` | The "a." mark with a dot per tile, the headline "Your company's own AI. Not rented. Not shared.", the outcomes line (time, cost, orders), two buttons, and the example: a buyer's email, the reply the AI drafted, and Approve; visitors can try their own email |
| The problem | `#problem` | Dark panel: time lost to paperwork while orders wait |
| What we build | `#build` | "One AI for your whole company.": three tiles, Win more orders, Save hours, Cut costs (the first one tall) |
| And it stays yours | `#why` | Three promises in giant type (own it, data stays inside, never trains anyone else's AI), then four stats (30, 14, 4, 2) |
| Proof | `#proof` | Four AI systems already built, one line each; the right column sits lower |
| Process | `#process` | Four steps as a staircase: call, fixed quote, one-workflow pilot, grow across teams |
| Your first pilot | `#pilot` | One question, "Which task eats your team's week?" (five chips); the pick shows a three-line pilot beside it, sent to us on WhatsApp |
| Questions | `#questions` | Four questions that open on click (`<details>`, no script) |
| Contact | `#contact` | Dark rounded panel; WhatsApp (pre-filled message) and email |

The copy is minimal: say each point once, in the fewest words (about 370 words). Outcomes (time, cost, orders)
lead; ownership and privacy come second.

## Colours, shape and type

Rounded interface, square logo: the nav (once scrolled), buttons, chips, tiles, cards and panels are rounded
(`--r-sm` 14px, `--r` 24px, `--r-lg` up to 44px, `--pill`); the logo, the hero "a.", its dots and the strip's
bullets stay square, and the square is the full stop of the three promises.

The studio's palette with the AI violet as the accent: `--ink` #22162A, `--band` #2B1631, `--accent` #5A3C9E,
`--accent-soft` #ECE6F7, `--accent-light` #C3AEF2 (on the dark band), `--paper` #F6F5F2. Schibsted Grotesk
(headings), DM Sans (body), DM Mono (labels).

## Motion (the main site's vibe)

- Hero: the logo's "a." heads the page. Its line and the "a" draw in, then three square dots pop in as its full
  stop, one per job (violet docs, wine queries, teal reports). Hover or focus shows the job's name, read from the
  "What we build" list; click jumps there.
- Nav: a flat edge-to-edge bar at the top that lifts into a rounded pill once the page scrolls.
- A strip of pills under the hero lists what the AI works with; it drifts, speeds up with the scroll and turns with its
  direction. Pointing at a pill (mouse only) stops the strip and shows a card above it: something the team might
  ask, and what the AI does with it. The words are each pill's `data-ask` and `data-does` in `index.html`.
- Mono labels decode letter by letter; the stats count up.
- The section in view shows beside the nav logo (wide screens), named from each section's label.
- Live chips pulse; a spotlight follows the cursor on proof cards.
- Nav logo's baseline fills with scroll progress; it and the logo's dots take the next job colour (wine, teal,
  violet in turn) for each section, and the section's name shows beside the logo on wide screens.
- Sections and cards fade up on scroll; the process steps grow up from the floor like a staircase.
- Tiles lift on hover; pointing at one promise fades the other two (mouse only).
- Hero example: one buyer email and the reply the AI drafted, in the HTML so the page reads without JavaScript.
  With it, typing dots play once when the box comes into view, then the reply; Approve pulses until pressed, then
  shows "That's your team's only step." and a "Book a 30-minute call" button (WhatsApp, pre-filled). A demo cursor
  presses Approve three times (pausing while a mouse moves over the box, stopping after a tap); its first two
  presses return the box to the example after three seconds. Under the box, "Try it with your own buyer email" opens a text box; that
  email goes to `/api/demo` (`api/demo.js`, an open-source model on Groq) and the answer fills the `demo-live`
  template. When the API isn't there (no key, busy, timeout, or a local server) the `demo-rest` template offers
  WhatsApp with the email pre-filled. The bar's chip reads "Example", or "Live" for a model answer. A visitor's own Approve leaves the box
  approved, so the call button stays.
- Your first pilot: picking a task fills the pilot beside it (`data-build`, `data-still` on the inputs in
  `index.html`; no model) and the WhatsApp link. Without JavaScript the chips are hidden and a line with a WhatsApp
  link shows instead.

## Click counting

WhatsApp and email links carry `data-track="<name>"`. `script.js` loads Vercel Web Analytics
(`/_vercel/insights/script.js`, served by Vercel once Analytics is enabled in the project; skipped on localhost)
and counts each click as a page view of `/click/<name>`, because the Hobby plan has no custom events. Read them in
the project's Analytics tab under Pages. Give any new WhatsApp or email link a `data-track` name.

## The live demo (`api/demo.js`)

A Vercel serverless function with no dependencies. It needs `GROQ_API_KEY` in the Vercel project's environment
variables; `GROQ_MODEL` (default `openai/gpt-oss-120b`, with low reasoning effort) and `ALLOWED_ORIGINS` (default the live site) are
optional. It accepts POSTs from the site only, 1,500 characters at most, six calls per visitor per 10 minutes (per
server instance) and waits 9 seconds at most. It returns only `missing` and `reply`. The prompt tells the model never to state prices, stock, dates or
certificates and to write placeholders like `[price]` instead. Without the key the page still works, with samples
and the WhatsApp fallback.

Without JavaScript the page reads in full; under `prefers-reduced-motion: reduce` everything is in its finished
state.
