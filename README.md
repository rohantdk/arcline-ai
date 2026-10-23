# Arcline — Private AI for manufacturers and exporters

The niche site of Arcline: AI engineering only, for owners of manufacturing and export firms. One static page
(`index.html`, `style.css`, `script.js`, `assets/`), hand-coded, no framework, no build step.

The studio's full portfolio (websites, Shopify, apps, brand work) lives at `rohantdk/arcline.github.io`. The two
sites are kept separate on purpose and don't link to each other.

## Page structure

| Section | id | Job |
|---|---|---|
| Hero | `#top` | The "a." mark with a dot per job, the promise (headline), who it's for, the call to action, three proof points, and an example of the assistant answering with its sources |
| The problem | `#problem` | The 7 pm buyer email: the story the reader recognises |
| What we build | `#build` | Three jobs: export documents, buyer queries, live reports, each with "You get" |
| Why Arcline | `#why` | Four stats (30, 14, 4, 2), then: data stays yours, answers show sources, we already build for exporters, you stay in control |
| Proof | `#proof` | Four AI systems already built, each with "What it proves for you" |
| How it works | `#process` | Discovery call (30 min), written scope and fixed quotation, a pilot on one workflow, handover and support |
| Questions | `#questions` | Data training, software, non-technical staff, wrong answers, cost |
| Contact | `#contact` | Closes on the headline's promise; WhatsApp (pre-filled message) and email |

The copy follows David Ogilvy's principles (scored 94/100; 100 once a real testimonial and a measured result
exist). The core promise, "answers with their source, data stays yours", is repeated from hero to close; keep it
that way when editing.

## Colours and type

The studio's palette with the AI violet as the accent: `--ink` #22162A, `--band` #2B1631, `--accent` #5A3C9E,
`--accent-soft` #ECE6F7, `--accent-light` #C3AEF2 (on the dark band), `--paper` #F6F5F2. Schibsted Grotesk
(headings), DM Sans (body), DM Mono (labels).

## Motion (the main site's vibe)

- Hero: the logo's "a." heads the page. Its line and the "a" draw in, then three square dots pop in as its full
  stop, one per job (violet docs, wine queries, teal reports). Hover or focus shows the job's name, read from the
  "What we build" list; click jumps there.
- A strip under the hero lists what the assistant reads; it drifts, speeds up with the scroll and turns with its
  direction. Stops under the pointer.
- Mono labels decode letter by letter; the stats in Why Arcline count up.
- The section in view shows beside the nav logo (wide screens), named from each section's label.
- Live chips pulse; a spotlight follows the cursor on proof cards.
- Nav logo's baseline fills with scroll progress.
- Sections and cards fade up on scroll; section rules and process lines draw in.
- Hero example plays in order: question, answer, then each source.
- Contact: the "a." draws in and a dot slides along its line to land as the full stop.
- Magnetic buttons and the contact glow, mouse only.

Without JavaScript the page reads in full; under `prefers-reduced-motion: reduce` everything is in its finished
state.
