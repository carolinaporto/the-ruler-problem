# MASTER PROMPT FOR CLAUDE CODE
## Project: “Have We Reached AGI?” — Interactive Map of Intelligence

You are the senior designer + frontend engineer responsible for finishing a Harvard course project. Do not just give me a plan. Inspect the repository, then IMPLEMENT the finished site now.

Do not destroy unrelated work elsewhere in the repository. The final folder must contain a standalone website that works by double-clicking `index.html`.

Required deliverables:
- `index.html`
- `styles.css`
- `script.js`
- `README.md`

You may add `content.js` or `assets/` only if genuinely useful, but keep the project simple and robust.

---

# 1. NON-NEGOTIABLE ASSIGNMENT CONSTRAINTS

This is for a Harvard assignment called “Map of Intelligence.”

The project must:
- be an interactive visual map/display about a facet of intelligence;
- show intentional curation, not an encyclopedic survey;
- make relationships between ideas visible;
- teach the viewer something;
- make the organizing point of view clear;
- use simple interactions effectively: clicking, hovering, revealing information, filtering, transitions;
- be a standalone HTML/CSS/JavaScript site;
- run locally in a browser;
- require NO backend;
- require NO build step;
- require NO package installation;
- require NO CDN;
- require NO external fonts, libraries, scripts, images, APIs, or runtime dependencies.

External links may be used only as source links. The visual experience itself must be fully functional offline.

---

# 2. THE CENTRAL INTELLECTUAL THESIS

The site is NOT a generic explanation of AGI.

The thesis is:

> “Have we reached AGI?” cannot be answered until we decide what counts as general intelligence.

The site should make the viewer DISCOVER this through interaction rather than simply read it.

The viewer should begin with a seemingly binary question:
- YES
- NO
- I’M NOT SURE

Then the site progressively complicates that answer through three lenses:
1. Psychology
2. Evolution
3. Computer Science

The final conceptual reframing is:

> The more useful question may no longer be “Have we reached AGI?” but “What kind of generality have we achieved — and what is still missing?”

Do not force a yes/no conclusion. The point is that different operational definitions produce different verdicts.

---

# 3. OVERALL EXPERIENCE

This should feel like:

**Harvard academic editorial × serious research lab × elegant constellation/network visualization**

NOT:
- childish;
- cartoonish;
- gamified in a juvenile way;
- fake sci-fi;
- cyberpunk;
- neon gamer;
- “AI startup landing page”;
- cheesy galaxy wallpaper;
- generic dashboard;
- a wall of text;
- endless identical cards.

The site should feel intellectually serious, current, elegant, slightly cinematic, and worthy of a Harvard class.

Think:
- dark museum installation;
- academic journal;
- data visualization lab;
- celestial navigation chart;
- research interface.

The “space/constellation” metaphor is subtle: ideas are nodes, evidence forms constellations, definitions change which connections become visible.

---

# 4. VISUAL IDENTITY

Use this visual system unless implementation requires a tiny adjustment:

## Colors
- Main background: `#07090D`
- Secondary background: `#0C1016`
- Raised surface: `#11161D`
- Fine border: `rgba(245,241,232,0.12)`
- Primary text / warm ivory: `#F3F0E8`
- Secondary text: `#B7B6B0`
- Muted text: `#7E838B`
- Harvard crimson accent: `#A51C30`
- Deep crimson: `#741322`
- Soft academic gold, only for rare highlights: `#B89A62`
- Psychology series accent: muted cool blue such as `#718EA7`
- Evolution series accent: muted sage such as `#7F9882`
- Computer Science series accent: muted steel/violet such as `#8A82A8`

Do not make every element colorful. Crimson is the signature accent, not a paint bucket.

## Typography
No external fonts.

Use a sophisticated system stack:
- display/editorial serif: `Georgia, "Times New Roman", serif`
- UI/body sans: `Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

Use serif selectively for major questions, statements, and section titles.
Use sans-serif for UI, labels, body, sources.

## Texture
Create depth with:
- faint grain using CSS gradients/noise-like layered gradients;
- sparse star/network points;
- ultra-subtle radial glows;
- hairline grid or orbital paths;
- never use cartoon stars or space illustrations.

---

# 5. MOTION LANGUAGE

Motion must have meaning.

Use:
- slow ambient node drift;
- thin connection lines that brighten when a concept is active;
- slight parallax tied to pointer movement;
- elegant fade/translate entrances;
- line-drawing animation for diagrams;
- gentle number/label transitions;
- hover states with depth and focus;
- selected nodes that persist until changed;
- smooth section transitions.

Avoid:
- bouncing;
- spinning logos;
- confetti;
- fast looping effects;
- excessive glowing;
- anything that distracts from reading.

Respect `prefers-reduced-motion`.

The site must remain usable without hover. Every hover interaction must also work via click/tap.

---

# 6. GLOBAL NAVIGATION

Desktop:
- small top-left identity: `MAP OF INTELLIGENCE / AGI`
- top-right compact controls:
  - `Overview`
  - `Psychology`
  - `Evolution`
  - `Computer Science`
  - `Sources`

Mobile:
- compact horizontal scroll or simple menu;
- no broken fixed overlays.

A subtle vertical or horizontal progress indicator may show where the viewer is in the conceptual journey.

---

# 7. SECTION 01 — OPENING QUESTION

First viewport: dramatic, sparse, not text-heavy.

Center:
# Have we reached AGI?

Subhead:
`Before we answer, we need to decide what “general intelligence” means.`

But initially delay/reveal the subhead after the user answers.

Three polished buttons:
- YES
- NO
- I’M NOT SURE

Store this choice in local JS state.

After selection:
- selected answer subtly moves into a small “Your first answer” indicator;
- reveal:
  `Now let’s move the line.`

Add a subtle constellation behind the question:
- not random decoration only;
- several faint nodes correspond to concepts that will later become named.

Do NOT immediately dump explanatory text.

---

# 8. SECTION 02 — “MOVE THE LINE”

Title:
# Where do we draw the line?

Core visual:
A sophisticated horizontal spectrum:

`NARROW / SPECIALIZED  ─────────────────────────  GENERAL / ADAPTIVE`

Below/above the line place conceptual capability markers:
- chess / narrow expertise
- language
- coding
- scientific reasoning
- novel learning
- long-horizon autonomy

Do NOT pretend these positions are numerical empirical measurements.
Label the visual:
`Conceptual map — positions are illustrative, not quantitative scores.`

Add a control:
`Choose a definition of AGI`

Four selectable definitions:

### A. DeepMind: Generality + Performance
Short explanation:
`How broad is the system’s capability, and at what level does it perform across that range?`

Effect:
- threshold line shifts;
- generality and performance labels illuminate;
- show micro-note:
  `The “Levels of AGI” framework separates breadth (generality), depth (performance), and deployment considerations such as autonomy.`

### B. Chollet: Skill-Acquisition Efficiency
Short explanation:
`How efficiently can the system acquire skill on tasks it did not already know how to solve?`

Effect:
- threshold line shifts toward novel learning;
- “novel learning” node becomes dominant.

### C. Economic / Autonomous Work
Short explanation:
`Can the system perform a broad range of economically valuable cognitive work with high autonomy?`

Effect:
- threshold shifts toward autonomy/reliability.

### D. Psychology: General Cognitive Ability
Short explanation:
`Is there a general capability that supports performance across many different cognitive tasks?`

Effect:
- highlight breadth, transfer, fluid reasoning.

The point should become visually obvious:
**the AGI boundary moves when the definition changes.**

Add one short concluding line:
`Same technology. Different threshold. Different answer.`

---

# 9. SECTION 03 — CENTRAL CONSTELLATION: THE MAP OF INTELLIGENCE

This is the visual centerpiece.

Title:
# One question. Three lenses.

Subtitle:
`Each lens asks something different of the word “general.”`

Create a large responsive SVG constellation/network.

Three primary lens nodes:
- PSYCHOLOGY
- EVOLUTION
- COMPUTER SCIENCE

Central node:
- AGI?

Secondary nodes:

## Psychology cluster
- g factor
- positive manifold
- fluid intelligence (Gf)
- crystallized intelligence (Gc)
- metacognition

## Evolution cluster
- adaptation
- novelty
- priors / core knowledge
- causal exploration
- culture
- cumulative knowledge

## Computer Science cluster
- breadth
- performance
- generalization
- autonomy
- reliability
- long-horizon work

## Evidence / benchmark nodes that bridge clusters
- HLE
- ARC-AGI
- METR
- Turing Test

Connections must be meaningful:
- HLE ↔ breadth/performance ↔ crystallized knowledge
- ARC-AGI ↔ fluid reasoning ↔ novelty ↔ adaptation ↔ generalization
- METR ↔ autonomy ↔ reliability ↔ long-horizon work
- Turing Test ↔ language/social behavior, but with caveat that conversational imitation is not a complete AGI criterion
- priors/core knowledge ↔ skill acquisition/generalization
- culture ↔ accumulated knowledge / training data / external tools

Interaction:
- hovering/clicking a lens highlights its subgraph;
- clicking a concept opens a side panel / floating detail panel;
- panel includes:
  - plain-language definition;
  - `Why it matters for AGI`;
  - relevant connection(s);
  - source link(s);
- when a panel opens, connected edges animate brighter;
- click outside/close to dismiss;
- keyboard accessible.

IMPORTANT:
This cannot just be 20 bubbles in random positions.
Compose the graph so the spatial relationships teach the story.

---

# 10. SECTION 04 — PSYCHOLOGY LENS

Transition:
When the user selects Psychology in nav or constellation, the network visually resolves into a psychological model.

Title:
# Psychology asks: is there something general underneath performance?

## 10.1 g factor visual
Create a clean branching diagram:

```
                 general ability (g)
                  /      |       \
                 /       |        \
           reasoning   memory    knowledge ...
```

Short explanation:
`In psychometrics, g is a statistical factor inferred from the positive correlations among performance on different cognitive tasks. It is not a single “AGI test.”`

Highlight:
`One implication for AI: broad success on one benchmark is less informative than a coherent pattern of capability across different kinds of tasks.`

Do NOT claim we have established an AI g factor unless sourced. Frame as a question / analogy.

## 10.2 Fluid vs Crystallized Intelligence
Create a split visual, not paragraphs.

LEFT:
### Gf — Fluid intelligence
- solving unfamiliar problems
- abstraction
- transfer
- reasoning when stored knowledge helps less
- conceptual connection: ARC-AGI

RIGHT:
### Gc — Crystallized intelligence
- accumulated knowledge
- vocabulary / factual knowledge
- learned conceptual structures
- conceptual connection: HLE / knowledge benchmarks

Then show a conceptual “AI profile evolution” comparison:
- Earlier language models: extremely strong-looking Gc-like abilities, weaker novel-task adaptation
- Frontier systems: gap appears to be narrowing on some tests

Do NOT put fabricated percentages.
Use proportional visual bars labeled `conceptual, not psychometric scores`.

Central question:
> If AI becomes broad in knowledge AND strong at novel problem solving, what is still missing from “general intelligence”?

## 10.3 Metacognition
Small interactive node:
`Knowing when you know, when you do not, when to revise, and when to ask for help.`

Connect to:
- reliability;
- long-horizon work;
- autonomy.

---

# 11. SECTION 05 — EVOLUTION LENS

This is the section that takes the project meaningfully beyond a standard CS lecture.

Title:
# Evolution asks: what is intelligence for?

Large statement:
> Intelligence may be less about knowing many answers than remaining adaptive when the world surprises you.

Make clear this sentence is a synthesis / framing, not a direct quotation.

## 11.1 Adaptation loop
Build an animated circular or orbital loop:

`encounter novelty → explore → form hypothesis → act → observe consequence → update model → repeat`

Each step is clickable.
Short text appears beneath it.

Connect this to developmental causal learning:
Humans, especially children, do not only passively observe. They intervene, test, explore, and revise.

## 11.2 “No system starts from zero”
Create a mirrored comparison:

### HUMAN
Evolution  
↓  
innate / core priors  
↓  
development  
↓  
culture  
↓  
novel situation  
↓  
adaptation

### AI
architecture / model design  
↓  
pretraining  
↓  
post-training  
↓  
human-produced cultural data  
↓  
novel prompt/environment  
↓  
in-context / agentic adaptation

Important label:
`Analogy, not equivalence.`

Center bridge:
`Both enter new situations with a history.`

Use Spelke & Kinzler’s “core knowledge” carefully:
- systems for objects, actions, number, space, and potentially social partners are proposed as foundations of human cognition;
- do not reduce evolution literally to “pretraining.”
The evolution ↔ pretraining connection is a conceptual analogy created for this map.

## 11.3 Culture as part of intelligence
Title:
# Is human intelligence actually individual?

Create two expandable chains.

Human:
`individual → language → other humans → books → institutions → tools → cumulative culture`

AI system:
`model → memory → search/tools → code execution → other agents → external knowledge`

Then ask:
> If tools and accumulated culture count when evaluating humans, what should count as “the AI system” when evaluating AGI?

This should visually connect to the ARC-AGI harness result later.

---

# 12. SECTION 06 — COMPUTER SCIENCE LENS

Title:
# Computer science asks: what can the system actually do?

Do not use a fake single “AGI score.”

Create a six-dimension hexagonal/radial diagram with NO arbitrary numeric values:
- Breadth
- Performance
- Novel learning / Generalization
- Autonomy
- Reliability
- Long-horizon capability

Interaction:
click each dimension to reveal:
- definition;
- evidence type;
- benchmark most relevant;
- what that benchmark still cannot prove.

Example mapping:
- Breadth / performance → HLE and broad evaluations
- Novel learning / generalization → ARC-AGI
- Autonomy / long horizon → METR
- Reliability → cross-cutting limitation; repeated-trial success, calibration, error recovery
- Metacognition → bridge back to Psychology

The key text:
`AGI is not one axis. A system can be extraordinary on one dimension and fragile on another.`

---

# 13. SECTION 07 — EVIDENCE CARDS / BENCHMARK CONSTELLATION

Do not make this section a generic card grid.
Lay benchmark cards around a thin orbital path or network and expand them one at a time.

Use these benchmark nodes:

## Humanity’s Last Exam (HLE)
Label:
`Breadth + expert knowledge/reasoning`

Content:
- HLE is designed to challenge frontier models across a broad range of expert-level academic knowledge and reasoning.
- The Scale leaderboard updated Sept. 17, 2026 reports GPT-6 Astra at 54.80 ± 1.94 on HLE-Rolling.
- This is strong evidence of broad expert-level capability.
- It is NOT, by itself, evidence of robust novel-task learning, long-horizon autonomy, consciousness, or complete AGI.

Source:
https://labs.scale.com/leaderboard/humanitys_last_exam

## ARC-AGI-3
Label:
`Novel environments + agentic adaptation`

Content:
- ARC-AGI-3 is interactive.
- It presents original turn-based environments with no instructions, rules, or stated goals.
- Agents must explore, infer how the environment works, infer what “winning” means, and carry learning forward.
- At launch (March 25, 2026), ARC Prize reported humans at 100% and frontier AI at 0.51%.
- ARC Prize later reported GPT-6 Astra at 62.7% with its Standard harness and ~99.9% with a Provider Adapter setup.
- That harness sensitivity is conceptually important: the apparent capability of “the AI” changes depending on what memory/context/scaffolding belongs to the evaluated system.

Sources:
https://arcprize.org/blog/arc-agi-3-launch
https://arcprize.org/results/openai-gpt-6-astra
https://arcprize.org/blog/astra

## METR Time Horizons
Label:
`Long-horizon task capability`

Content:
- METR measures a “task-completion time horizon”: the human task duration at which an AI agent is predicted to succeed at a given reliability.
- Current suite is primarily software engineering, machine learning, and cybersecurity.
- METR explicitly warns that a time horizon is NOT equivalent to “the AI can autonomously do all work for that many hours.”
- Use it to discuss how capability changes as tasks become longer and require sustained execution.

Source:
https://metr.org/time-horizons/

## Turing Test
Label:
`Human-like conversation / imitation`

Content:
- Present it historically as a famous behavioral criterion.
- The conceptual takeaway is not “passing = AGI.”
- Instead: conversational indistinguishability became less useful as a sufficient criterion once language models became excellent conversational imitators.
- Keep this card shorter than the others.

Do not use a numerical current claim unless it is present in the source list and verified.

---

# 14. SECTION 08 — THE ARC “SYSTEM BOUNDARY” MOMENT

This should be one of the strongest interactive moments.

Title:
# What exactly are we calling “the intelligent system”?

Visual:
one central `GPT-6 Astra` model node.

Toggle:
- `Model + standard harness`
- `Model + provider adapter / state preservation`

Animate score label changing:
- Standard harness: `62.7%`
- Provider adapter: `~99.9%`

Under it, show:
`Same underlying model family. Different system boundary. Very different observed performance.`

Then reveal concentric rings:
1. model
2. context
3. memory/state
4. tools
5. scaffold/harness
6. environment

Question:
> Should AGI be a property of a neural network, or of a complete cognitive system?

Connect back to the Evolution/Culture question:
humans are also not isolated brains; humans operate with language, memory aids, tools, institutions, and other people.

Do NOT imply the human/AI cases are equivalent. Present the comparison as a question about evaluation boundaries.

---

# 15. SECTION 09 — “SAME AI. DIFFERENT VERDICT.”

Title:
# Same AI. Different definition. Different verdict.

Center: `FRONTIER AI`

Around it, five criteria.

### Broad competence
State:
`Strong evidence`
Explanation:
Current systems operate across language, coding, mathematics, science, multimodal tasks, and many other domains.

### Expert knowledge / reasoning
State:
`Strong but incomplete evidence`
Explanation:
HLE shows rapid gains on difficult expert-level tasks, but it does not cover all forms of intelligence.

### Novel adaptation
State:
`Rapidly changing / benchmark-sensitive`
Explanation:
ARC-AGI-3 shows major gains, while also demonstrating strong sensitivity to agent scaffolding and memory/state.

### Reliable long-horizon autonomy
State:
`Still uneven`
Explanation:
Long-horizon evaluations show progress, but capability remains domain-dependent and reliability matters.

### Human-like cognition / consciousness
State:
`Not established — and not required by many AGI definitions`
Explanation:
Behavioral similarity does not prove identical cognitive mechanisms; many operational definitions of AGI are capability-based rather than consciousness-based.

Never label the model “AGI” or “not AGI” in this section.

---

# 16. SECTION 10 — BUILD YOUR OWN DEFINITION OF AGI

This should be genuinely interactive and memorable.

Title:
# What would YOU require before calling a system AGI?

Use seven toggleable criteria:
- broad performance across cognitive domains
- efficient learning of genuinely new tasks
- reliable long-horizon autonomy
- error detection and self-correction
- ability to understand/adapt to other agents or people
- embodiment / acting in the physical world
- consciousness / subjective experience

As user selects criteria:
- a small constellation builds itself;
- selected criteria connect to relevant lens nodes;
- show a generated summary using deterministic rules, NOT an AI API.

Possible summaries:

If user emphasizes breadth/performance only:
`Your definition is capability-centered. Under definitions like this, several traditional AGI thresholds look much closer — and some lower thresholds may already have been crossed.`

If user emphasizes novelty + adaptation:
`Your definition is adaptation-centered. ARC-style evidence becomes more important than static knowledge benchmarks.`

If autonomy + reliability selected:
`Your definition requires not just intelligence, but dependable agency over time. Long-horizon and reliability evidence becomes decisive.`

If embodiment selected:
`Your definition requires interaction with the physical world, which is stricter than many capability-based AGI definitions.`

If consciousness selected:
`Your definition includes a criterion that current behavioral benchmarks do not know how to establish.`

Always include:
`There is no single universally accepted AGI threshold.`

No fake scientific scoring.

---

# 17. SECTION 11 — FINAL QUESTION

Return to visual language of the opening.

Large:
# Have we reached AGI?

Buttons:
- YES
- NO
- IT DEPENDS

Display:
`Your first answer: [stored opening answer]`

After final answer, show:
`Your answer after exploring the map: [new answer]`

Then the final reframing:

> Perhaps the more useful question is not:
> **“Have we reached AGI?”**
>
> but:
> **“What kind of generality have we achieved — and what is still missing?”**

Finish with a small `Explore sources ↓` prompt.

Do NOT celebrate any answer. No confetti. No “correct answer.”

---

# 18. SOURCES SECTION

Create an elegant bibliography/source drawer or final section.

Group sources by lens:

## Definitions / Computer Science
- Morris et al. (2023), “Levels of AGI for Operationalizing Progress on the Path to AGI”
  https://arxiv.org/abs/2311.02462

- François Chollet (2019), “On the Measure of Intelligence”
  https://arxiv.org/abs/1911.01547

- ARC Prize, “Announcing ARC-AGI-3”
  https://arcprize.org/blog/arc-agi-3-launch

- ARC Prize, “GPT-6 Astra — ARC-AGI Results”
  https://arcprize.org/results/openai-gpt-6-astra

- ARC Prize, “OpenAI’s GPT-6 Astra on ARC-AGI-3”
  https://arcprize.org/blog/astra

- Humanity’s Last Exam leaderboard
  https://labs.scale.com/leaderboard/humanitys_last_exam

- METR, “Task-Completion Time Horizons of Frontier AI Models”
  https://metr.org/time-horizons/

## Psychology / Cognitive Science
- Spelke & Kinzler (2007), “Core knowledge”
  https://doi.org/10.1111/j.1467-7687.2007.00569.x

- Goddu & Gopnik (2024), “The development of human causal learning and reasoning”
  https://doi.org/10.1038/s44159-024-00300-5

- Cantlon & Piantadosi (2024), “Uniquely human intelligence arose from expanded information capacity”
  https://doi.org/10.1038/s44159-024-00283-3

## Evolution / Culture
- Herrmann et al. (2007), “Humans have evolved specialized skills of social cognition: the cultural intelligence hypothesis”
  https://pubmed.ncbi.nlm.nih.gov/17823346/

For `g`, fluid intelligence, crystallized intelligence, and positive manifold:
- use standard psychometrics framing;
- if you add a specific citation, use a reputable source already present in the repository or add a conservative bibliographic reference in the sources area;
- do not fabricate a paper title or DOI.

---

# 19. CLAIM DISCIPLINE / SCIENTIFIC ACCURACY

This is an academic project. Accuracy matters more than dramatic copy.

Rules:
1. Never present a conceptual diagram as quantitative measurement.
2. Every conceptual comparison must be marked when appropriate:
   - `conceptual`
   - `illustrative`
   - `analogy, not equivalence`
3. Do not invent AGI scores.
4. Do not invent consensus.
5. Do not say “we have AGI” or “we do not have AGI” as a factual conclusion.
6. Distinguish:
   - performance;
   - generality;
   - learning/adaptation;
   - autonomy;
   - reliability;
   - consciousness.
7. Do not equate:
   - passing a benchmark with possessing the psychological construct;
   - fluent conversation with general intelligence;
   - evolution with machine pretraining;
   - AI tools/scaffolds with human culture.
8. Do not describe consciousness as measurable by the included benchmarks.
9. Use cautious language for frontier results:
   - “reported”
   - “observed on this benchmark”
   - “evidence for”
   - “does not by itself establish”
10. Put a source icon/link on claims with current benchmark numbers.

---

# 20. COMPONENT BEHAVIOR

Implement all of these:

## Interactive nodes
- hover: connected edges highlight + tooltip
- click: persistent selection + detail panel
- keyboard Enter/Space works
- Escape closes detail panel

## Lens filter
Buttons:
- All
- Psychology
- Evolution
- Computer Science

Clicking a lens:
- dims unrelated nodes;
- emphasizes relevant nodes and bridge nodes;
- changes a small lens description;
- never removes so much that network context disappears completely.

## Definition threshold
- 4 selectable definitions;
- animated marker/threshold movement;
- content changes;
- positions are conceptual.

## Adaptation loop
- steps highlight in sequence once when entering viewport;
- then user can click any step;
- no infinite distracting animation.

## Build-your-definition
- checkboxes/toggles;
- deterministic text summary;
- visual constellation updates live;
- `Reset` button.

## Opening/final answer
- store in memory only for the session;
- no localStorage needed;
- display comparison at end.

## Sources
- source links open in a new tab with `rel="noopener noreferrer"`.

---

# 21. RESPONSIVE / ACCESSIBILITY REQUIREMENTS

Test mentally and implement for:
- 1440px desktop
- 1024px laptop
- 768px tablet
- 390px phone

Requirements:
- no page-level horizontal overflow;
- network visualization may use a responsive SVG viewBox;
- detail panel becomes a bottom sheet-like in-flow panel on mobile, not fixed off-screen;
- minimum ~44px touch targets;
- visible focus states;
- contrast must be strong;
- semantic buttons;
- ARIA labels for graph controls;
- reduced-motion support;
- tooltips are supplementary, never the only way to access content.

---

# 22. TECHNICAL IMPLEMENTATION

Use only:
- semantic HTML
- modern CSS
- vanilla JavaScript
- inline or dynamically created SVG
- Canvas only if used for subtle ambient background particles

No:
- React
- Vue
- Svelte
- Tailwind CDN
- D3 CDN
- GSAP
- Three.js
- npm
- build tools
- external fonts
- external images
- external scripts

Why: submission must run locally just by opening `index.html`.

Recommended architecture:

## `index.html`
- semantic section structure;
- all core content present;
- source links;
- SVG containers;
- buttons and accessible controls.

## `styles.css`
Organize with comments:
1. tokens
2. reset/base
3. typography
4. nav
5. hero
6. map/network
7. lens sections
8. diagrams
9. benchmark orbit
10. builder
11. sources
12. responsive
13. reduced motion

## `script.js`
Organize with clear functions:
- state
- navigation / section observer
- hero answer state
- constellation data
- draw/update network
- node selection
- lens filtering
- AGI definition threshold
- adaptation loop
- system-boundary toggle
- definition builder
- final answer
- reduced motion / cleanup

Keep code readable enough that a student can explain it.

---

# 23. POLISH DETAILS THAT MATTER

Add sophisticated details:
- tiny labels like `LENS 01`, `EVIDENCE`, `CONCEPTUAL MAP`;
- source superscripts/icons;
- serif pull-questions;
- thin crimson rules;
- coordinates / network IDs used sparingly;
- animated SVG edge tracing;
- background constellation nodes becoming the actual conceptual map as the user scrolls;
- a subtle cursor-proximity response on the main network;
- microcopy such as `select a node to inspect`;
- numbers in tabular-nums styling;
- smooth but fast transitions (~200–500ms for UI, slower only for ambient motion).

Do NOT clutter.

---

# 24. WHAT “DONE” MEANS — ACCEPTANCE CHECKLIST

Before you stop, verify all of the following yourself:

### Functional
- [ ] opening answer buttons work
- [ ] selected opening answer reappears at end
- [ ] definition buttons move/update threshold
- [ ] constellation renders
- [ ] every primary node is clickable
- [ ] node detail panel closes correctly
- [ ] lens filtering works
- [ ] Psychology diagram works
- [ ] Evolution adaptation loop works
- [ ] human-vs-AI comparison is visible
- [ ] CS dimensions are interactive
- [ ] benchmark evidence opens/reveals correctly
- [ ] ARC system-boundary toggle works
- [ ] build-your-definition controls update a summary
- [ ] reset works
- [ ] final answer buttons work
- [ ] source links are present
- [ ] keyboard access works for primary interactions

### Offline
- [ ] no runtime fetch
- [ ] no CDN
- [ ] no external JS/CSS/font/image dependencies
- [ ] opening `index.html` via `file://` works

### Visual
- [ ] sophisticated dark academic identity
- [ ] Harvard crimson is restrained
- [ ] no childish icons
- [ ] no cheesy galaxy art
- [ ] no generic SaaS card wall
- [ ] network is genuinely central
- [ ] diagrams are visually distinct from one another
- [ ] mobile layout is usable

### Academic
- [ ] no fake quantitative scores except sourced benchmark results
- [ ] conceptual visuals labeled as conceptual
- [ ] ARC numbers source-linked
- [ ] HLE number source-linked
- [ ] claims distinguish evidence from interpretation
- [ ] final conclusion remains open rather than pretending consensus

### Code
- [ ] no console errors
- [ ] no missing DOM IDs
- [ ] no broken links caused by local paths
- [ ] CSS is organized
- [ ] JS is understandable
- [ ] README explains how to open the site and project thesis

---

# 25. EXECUTION INSTRUCTION

Do not return a hypothetical design.

1. Inspect the existing repository.
2. Build the complete site.
3. Open/read every generated file and perform a consistency pass.
4. If a browser-preview/testing capability is available, use it and fix visible issues.
5. Ensure the site runs through `file://` with no server.
6. Give me a concise final report listing:
   - files created;
   - major interactions implemented;
   - any limitations that genuinely remain.

Do not ask me follow-up questions. Make strong design decisions using this specification.
