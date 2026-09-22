# The Ruler Problem — Have We Reached AGI?

**Week 3 assignment — GENED 1201: Foundations of NeuroAI, Harvard (Fall 2026)**
*"Map of Intelligence" interactive.*

An interactive page about a question people ask as though it were factual:
**have we reached AGI?**

It isn't factual. Before you can answer it, two things have to be settled that
nobody agrees on — what general intelligence *is*, and how you would measure
it. Your answer to the first decides which rulers are even valid, which
decides the verdict. People argue about the verdict; the disagreement is one
floor down.

The site does not argue for yes or no. It walks a visitor through three
lenses that each ask something different of the word "general" —
**psychology**, **evolution**, and **computer science** — and lets the same
frontier‑AI evidence (Humanity's Last Exam, ARC‑AGI‑3, METR time horizons,
the Turing Test) come out looking like different kinds of proof depending on
which lens, and which operational definition of AGI, you're holding it up
against. The final reframing: maybe the useful question isn't "have we
reached AGI" but "what kind of generality have we achieved, and what is
still missing."

## Running it

Plain HTML, CSS and vanilla JavaScript. No framework, no build step, no
package installation, no CDN, no external fonts or scripts. Double‑click
`index.html` — it runs straight from disk over `file://`, no server needed.

## What's in it

- **Opening question** — a first, unforced answer (yes / no / not sure),
  stored only for the session.
- **Move the line** — one horizontal spectrum, four selectable AGI
  definitions (Morris et al.'s Levels of AGI, Chollet's skill‑acquisition
  efficiency, an economic/autonomy definition, and a psychology‑style general
  ability), each one moving the threshold and changing which capabilities
  count as "beyond it."
- **The map of intelligence** — a hand‑composed constellation (not a random
  force layout): three lens nodes, their concepts, and four benchmark nodes
  that bridge lenses, with a filter, hover/click detail panels, and keyboard
  access.
- **Three lens sections** — Psychology (g factor and the positive manifold,
  fluid vs. crystallized intelligence, metacognition), Evolution (the
  adaptation loop, a human‑vs‑AI "history" comparison marked *analogy, not
  equivalence*, culture as an extended system), Computer Science (six
  capability dimensions with no combined score).
- **Evidence cards** — HLE, ARC‑AGI‑3, METR, and the Turing Test, each with
  what it shows and what it explicitly does not establish.
- **The system‑boundary moment** — toggling GPT‑6 Astra's ARC‑AGI‑3 score
  between its standard harness (62.7%) and a provider‑adapter / state‑
  preservation setup (≈99.9%), with six concentric rings asking what should
  count as "the system."
- **Same AI, different verdict** — five criteria, five different states of
  evidence, no single stamped verdict.
- **Build your own definition** — seven toggleable criteria, a constellation
  that grows as you pick them, and a deterministic (non‑AI) summary of what
  kind of definition you've built.
- **Final question** — the same yes/no/it‑depends choice, next to your first
  answer, followed by the reframing.
- **Sources** — every benchmark figure and citation used on the page, grouped
  by lens, with links.

## Data and accuracy

All content and citations live in `content.js`, separate from the layout
(`index.html`) and behavior (`script.js`). Conceptual diagrams are labeled
*conceptual* or *illustrative*; every current benchmark number carries a
source link; no AI system is called "AGI" or "not AGI" anywhere on the page.

## Sources

Every claim and figure on the page is sourced. The full bibliography is in
the "Sources" section at the bottom of the page (and in the `sources` object
in `content.js`), grouped by lens, with a link next to every current
benchmark figure.
