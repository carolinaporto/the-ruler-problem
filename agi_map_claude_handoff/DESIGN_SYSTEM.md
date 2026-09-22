# DESIGN SYSTEM — HARVARD × CONSTELLATION × RESEARCH LAB

## Design thesis
Serious, high-trust academic visualization with subtle celestial/network metaphors.

The site should feel like a research exhibit, not a startup landing page.

## Palette
```css
:root {
  --bg: #07090D;
  --bg-2: #0C1016;
  --surface: #11161D;
  --surface-2: #151B23;

  --text: #F3F0E8;
  --text-2: #B7B6B0;
  --muted: #7E838B;
  --border: rgba(245, 241, 232, 0.12);
  --border-strong: rgba(245, 241, 232, 0.22);

  --crimson: #A51C30;
  --crimson-deep: #741322;
  --gold: #B89A62;

  --psych: #718EA7;
  --evolution: #7F9882;
  --cs: #8A82A8;
}
```

Crimson should signal:
- active choice
- current position
- important line
- critical conceptual pivot

Do not use crimson as the fill for everything.

## Type
Display:
`Georgia, "Times New Roman", serif`

UI:
`Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

Use:
- serif for questions, quotes, big section headings;
- sans for navigation, labels, body text, controls, sources.

## Visual motifs
Use:
- thin orbital lines
- constellations
- sparse points
- faint coordinate marks
- subtle noise/grain
- fine rules
- research labels
- diagrammatic typography

Do not use:
- illustration of a brain
- robot heads
- glowing AI faces
- cartoon neurons
- stock imagery
- galaxies/planets
- binary-code rain
- Harvard crest/logo
- fake university branding

## Cards
Cards may exist only when they have a semantic reason:
- a selected node detail panel
- a benchmark evidence panel
- a source
- a user-selected criterion

Avoid a 3-column “features” grid.

## Depth
Prefer:
- borders
- translucent layered surfaces
- subtle background contrast
over large shadows.

## Animation
Timing:
- UI interactions: 180–350ms
- diagram transitions: 400–700ms
- ambient movement: 8–20s loops, extremely subtle

No bounce easing.
Prefer ease-out / cubic-bezier.

## Network
Nodes should vary by semantic role:
- central question: largest
- lenses: large outlined nodes
- concepts: medium
- benchmarks: distinct square/diamond or ringed markers
- bridge nodes: visually show multi-lens connections

Connections:
- 1px or less at rest
- low opacity
- brighten on selection
- selected path can use crimson accent
- other lens paths use muted lens colors

## Mobile
On mobile:
- preserve the intellectual sequence;
- simplify graph labels;
- allow tapping to show details;
- avoid tiny text;
- move side panels into normal document flow.

## Final visual test
If a screenshot could be mistaken for:
- a crypto site,
- a gaming UI,
- a children’s science site,
- a generic AI SaaS landing page,
then redesign it.
