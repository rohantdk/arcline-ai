# Arcline — Your company's own AI

The niche site of Arcline: AI engineering only, for owners of manufacturing and export firms. One static page
(`index.html`, `style.css`, `script.js`, `assets/`), hand-coded, no framework, no build step.

The studio's full portfolio (websites, Shopify, apps, brand work) lives at `rohantdk/arcline.github.io`. The two
sites are kept separate on purpose and don't link to each other.

## Page structure

| Section | id | Job |
|---|---|---|
| Hero | `#top` | The "a." mark with a dot per tile, the headline "Your company's own AI. Not rented. Not shared.", the outcomes line (time, cost, orders), two buttons, and the example of the AI preparing a document |
| The problem | `#problem` | Dark panel: time lost to paperwork while orders wait |
| What we build | `#build` | "One AI for your whole company.": three tiles, Win more orders, Save hours, Cut costs (the first one tall) |
| And it stays yours | `#why` | Three promises in giant type (own it, data stays inside, never trains anyone else's AI), then four stats (30, 14, 4, 2) |
| Proof | `#proof` | Four AI systems already built, one line each; the right column sits lower |
| Process | `#process` | Four steps as a staircase: call, fixed quote, one-workflow pilot, grow across teams |
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
  direction. Stops under the pointer.
- Mono labels decode letter by letter; the stats count up.
- The section in view shows beside the nav logo (wide screens), named from each section's label.
- Live chips pulse; a spotlight follows the cursor on proof cards.
- Nav logo's baseline fills with scroll progress; it and the logo's dots take the next job colour (wine, teal,
  violet in turn) for each section, and the section's name shows beside the logo on wide screens.
- Sections and cards fade up on scroll; the process steps grow up from the floor like a staircase.
- Tiles lift on hover; pointing at one promise fades the other two (mouse only).
- Hero example plays in order on load: request, answer, each source, the document. Hovering it with a mouse
  plays the task out: typing dots, the answer, sources, the packing list, then Approve turns to Approved.
- Contact: the "a." draws in and a dot slides along its line to land as the full stop.
- Contact: the founder's face, a geometric face in the logo's style on a violet disc beside the headline. Its
  square pupils follow the cursor and it blinks; drag it (mouse or touch) and it stretches toward the pointer, then
  wobbles back on a spring. Shapes are read from the SVG in `index.html`. Static without JavaScript and under
  reduced motion.
- Magnetic buttons and the contact glow, mouse only.

Without JavaScript the page reads in full; under `prefers-reduced-motion: reduce` everything is in its finished
state.
