/* ==========================================================================
   content.js — all data for the Map of Intelligence.
   Plain script (no modules) so the site works when index.html is opened
   straight from disk. Everything here is text and coordinates; behaviour
   lives in script.js.
   ========================================================================== */
window.AGI_DATA = (function () {
  'use strict';

  /* ---------- 1. Sources ------------------------------------------------
     `url: null` marks a background reference that is cited but not linked
     (no DOI is given where one could not be verified). */
  var sources = {
    morris: {
      group: 'cs', year: 2023,
      cite: 'Morris et al. — Levels of AGI — 2023',
      full: 'Meredith Ringel Morris, Jascha Sohl-dickstein, Noah Fiedel, Tris Warkentin, Allan Dafoe, Aleksandra Faust, Clement Farabet, Shane Legg. “Levels of AGI for Operationalizing Progress on the Path to AGI.”',
      url: 'https://arxiv.org/abs/2311.02462',
      use: 'Separates breadth (generality) from depth (performance), and treats autonomy as a related but separable deployment consideration.'
    },
    chollet: {
      group: 'cs', year: 2019,
      cite: 'François Chollet — On the Measure of Intelligence — 2019',
      full: 'François Chollet. “On the Measure of Intelligence.”',
      url: 'https://arxiv.org/abs/1911.01547',
      use: 'Task skill is not the same as intelligence; priors and training can “buy” performance; intelligence as skill-acquisition efficiency; ARC as a fluid-intelligence-oriented test.'
    },
    hle: {
      group: 'cs', year: 2026,
      cite: 'Scale AI / CAIS — Humanity’s Last Exam leaderboard — 2026',
      full: 'Humanity’s Last Exam leaderboard (Scale AI). Page update dated Sept. 17, 2026, which announces the September 17 version of HLE-Rolling.',
      url: 'https://labs.scale.com/leaderboard/humanitys_last_exam',
      use: 'Reported HLE result for GPT-6 Astra: 54.80 ± 1.94. Evidence of broad expert-level knowledge and reasoning on this benchmark.'
    },
    arcLaunch: {
      group: 'cs', year: 2026,
      cite: 'ARC Prize — Announcing ARC-AGI-3 — 2026',
      full: 'ARC Prize. “Announcing ARC-AGI-3.” Published Mar. 25, 2026.',
      url: 'https://arcprize.org/blog/arc-agi-3-launch',
      use: 'Interactive environments with no instructions, rules, or stated goals. At launch: humans 100%, frontier AI 0.51%.'
    },
    arcAstra: {
      group: 'cs', year: 2026,
      cite: 'ARC Prize — GPT-6 Astra ARC-AGI results — 2026',
      full: 'ARC Prize. “GPT-6 Astra — ARC-AGI Results.” Published Sept. 2, 2026.',
      url: 'https://arcprize.org/results/openai-gpt-6-astra',
      use: 'Best observed Standard-harness result 62.7%; Provider Adapter result ≈99.9% (verified table lists 99.95% at high reasoning).'
    },
    arcBlog: {
      group: 'cs', year: 2026,
      cite: 'ARC Prize — OpenAI’s GPT-6 Astra on ARC-AGI-3 — 2026',
      full: 'ARC Prize. “OpenAI’s GPT-6 Astra on ARC-AGI-3.” Published Sept. 3, 2026.',
      url: 'https://arcprize.org/blog/astra',
      use: 'Explains Standard harness versus Provider Adapter, and raises the system-boundary question.'
    },
    metr: {
      group: 'cs', year: 2026,
      cite: 'METR — Task-completion time horizons of frontier AI models — 2026',
      full: 'METR. “Task-Completion Time Horizons of Frontier AI Models.”',
      url: 'https://metr.org/time-horizons/',
      use: 'Time horizon = the human task duration at which an agent is predicted to succeed at a stated reliability (e.g. 50%, 80%). Suite is mostly software engineering, ML and cybersecurity. Not the same as hours of autonomous work.'
    },
    spelke: {
      group: 'psych', year: 2007,
      cite: 'Spelke & Kinzler — Core knowledge — 2007',
      full: 'Elizabeth S. Spelke and Katherine D. Kinzler. “Core knowledge.” Developmental Science (2007).',
      url: 'https://doi.org/10.1111/j.1467-7687.2007.00569.x',
      use: 'Proposed foundational systems for representing objects, actions, number, space, and possibly social partners.'
    },
    goddu: {
      group: 'psych', year: 2024,
      cite: 'Goddu & Gopnik — Human causal learning and reasoning — 2024',
      full: 'Mariel K. Goddu and Alison Gopnik. “The development of human causal learning and reasoning.” Nature Reviews Psychology (2024).',
      url: 'https://doi.org/10.1038/s44159-024-00300-5',
      use: 'Children actively intervene, explore and revise; causal reasoning develops through more than passive observation.'
    },
    cantlon: {
      group: 'psych', year: 2024,
      cite: 'Cantlon & Piantadosi — Expanded information capacity — 2024',
      full: 'Jessica F. Cantlon and Steven T. Piantadosi. “Uniquely human intelligence arose from expanded information capacity.” Nature Reviews Psychology (2024).',
      url: 'https://doi.org/10.1038/s44159-024-00283-3',
      use: 'One perspective: human distinctiveness may arise partly from quantitative increases in global capacity and information sharing across memory, attention and learning.'
    },
    herrmann: {
      group: 'evo', year: 2007,
      cite: 'Herrmann et al. — Cultural intelligence hypothesis — 2007',
      full: 'Esther Herrmann, Josep Call, María Victoria Hernàndez-Lloreda, Brian Hare, Michael Tomasello. “Humans have evolved specialized skills of social cognition: the cultural intelligence hypothesis.” Science (2007).',
      url: 'https://pubmed.ncbi.nlm.nih.gov/17823346/',
      use: 'Human distinctiveness may depend importantly on social-cognitive abilities that support participation in, and learning from, cultural groups.'
    },
    /* Background references — cited for standard psychometrics framing. Not linked. */
    spearman: {
      group: 'psych', year: 1904, url: null,
      cite: 'Spearman — “General intelligence,” objectively determined and measured — 1904',
      full: 'Charles Spearman. “‘General intelligence,’ objectively determined and measured.” American Journal of Psychology, 15(2), 201–292 (1904).',
      use: 'Origin of the g factor and the observation that cognitive tests correlate positively.'
    },
    cattell: {
      group: 'psych', year: 1963, url: null,
      cite: 'Cattell — Theory of fluid and crystallized intelligence — 1963',
      full: 'Raymond B. Cattell. “Theory of fluid and crystallized intelligence: A critical experiment.” Journal of Educational Psychology, 54(1), 1–22 (1963).',
      use: 'The fluid (Gf) / crystallized (Gc) distinction.'
    },
    carroll: {
      group: 'psych', year: 1993, url: null,
      cite: 'Carroll — Human Cognitive Abilities — 1993',
      full: 'John B. Carroll. Human Cognitive Abilities: A Survey of Factor-Analytic Studies. Cambridge University Press (1993).',
      use: 'Standard reference for hierarchical models with g above broad abilities.'
    },
    flavell: {
      group: 'psych', year: 1979, url: null,
      cite: 'Flavell — Metacognition and cognitive monitoring — 1979',
      full: 'John H. Flavell. “Metacognition and cognitive monitoring: A new area of cognitive–developmental inquiry.” American Psychologist, 34(10), 906–911 (1979).',
      use: 'Classic statement of metacognition as knowledge about, and monitoring of, one’s own thinking.'
    },
    turing: {
      group: 'cs', year: 1950,
      cite: 'Turing — Computing Machinery and Intelligence — 1950',
      full: 'Alan M. Turing. “Computing Machinery and Intelligence.” Mind, 59(236), 433–460 (1950).',
      url: 'https://doi.org/10.1093/mind/LIX.236.433',
      use: 'The imitation game, proposed as a behavioural way to sidestep “can machines think?”.'
    }
  };

  /* ---------- 2. Lenses ------------------------------------------------- */
  var lenses = {
    all:   { name: 'All',              desc: 'Three lenses, one word: “general.” Diamonds are evidence that speaks to more than one lens — that is where the disagreement gets tested.' },
    psych: { name: 'Psychology',       color: 'var(--psych)', question: 'Is there a general capacity underneath performance across tasks?', desc: 'Psychology asks: is there a general capacity underneath performance across tasks?' },
    evo:   { name: 'Evolution',        color: 'var(--evo)',   question: 'What is intelligence for?', desc: 'Evolution asks: what is intelligence for? Adaptation under uncertainty, from a starting point built by evolution, development and culture.' },
    cs:    { name: 'Computer Science', color: 'var(--cs)',    question: 'What can the system actually do?', desc: 'Computer science asks: what can the system actually do — across how many domains, with what level of adaptation, reliability and autonomy?' }
  };

  /* ---------- 3. Constellation nodes -------------------------------------
     Coordinates live in a 1000 × 760 space. Layout is deliberate:
       • Psychology top-left, Computer Science top-right, Evolution bottom.
       • Knowledge-flavoured evidence (HLE, Turing) sits on the top seam
         between Psychology and CS.
       • ARC-AGI sits low in the centre: it is the only node that touches
         all three lenses (fluid ability ↔ novelty ↔ generalization).
       • METR sits on the right, beside autonomy / reliability / long-horizon.
     type: center | lens | concept | bench
     bridges: for benchmark nodes, the lenses they connect (drawn as pips). */
  var nodes = [
    { id: 'agi', type: 'center', label: 'AGI?', x: 500, y: 372, lb: 'b',
      tip: 'The question at the centre. Each lens asks something different of the word “general.”',
      def: 'The word every lens is trying to define. Nothing on this map settles it — the map shows why different definitions pull toward different evidence.',
      why: 'This is the pivot of the whole page: the answer depends on which lens you read “general” through.' },

    /* --- lenses --- */
    { id: 'psych', type: 'lens', lens: 'psych', label: 'PSYCHOLOGY', x: 225, y: 262, lb: 't',
      tip: 'Is there a general capacity underneath performance across tasks?',
      def: 'The study of how mental abilities are measured, how they relate to one another, and what — if anything — they share.',
      why: 'Psychology supplies AGI’s oldest question: is there a general capacity underneath performance, or only many separate skills?',
      go: 'psychology' },
    { id: 'evo', type: 'lens', lens: 'evo', label: 'EVOLUTION', x: 500, y: 610, lb: 'b',
      tip: 'What is intelligence for?',
      def: 'The view that intelligence is best understood by what it is for: staying adaptive when the world is uncertain, starting from structure built by evolution, development and culture.',
      why: 'It moves the emphasis from “how many answers does the system hold?” to “what does it do when it meets something new?”',
      go: 'evolution' },
    { id: 'cs', type: 'lens', lens: 'cs', label: 'COMPUTER SCIENCE', x: 775, y: 262, lb: 't',
      tip: 'What can the system actually do — and how reliably?',
      def: 'The engineering view: define measurable dimensions — breadth, performance, generalization, autonomy, reliability, horizon — and test systems against them.',
      why: 'It turns “general” into things you can evaluate, at the price of having to decide which dimensions count.',
      go: 'cs' },

    /* --- Psychology cluster --- */
    { id: 'g', type: 'concept', lens: 'psych', label: 'g factor', x: 120, y: 150, lb: 't',
      tip: 'A statistical factor inferred from positive correlations among cognitive tasks.',
      def: 'A statistical factor inferred from the positive correlations among performance on different cognitive tasks. It summarises shared variance; it is not a single test, and not a single “AGI test.”',
      why: 'It recasts “general” as a pattern across many kinds of tasks rather than a score on one. Whether anything like it applies to AI systems is an open question, not an established finding.',
      src: ['spearman', 'carroll'] },
    { id: 'manifold', type: 'concept', lens: 'psych', label: 'positive manifold', x: 62, y: 290, lb: 'b',
      tip: 'Cognitive tests tend to correlate positively with one another.',
      def: 'The empirical observation that scores on very different cognitive tests tend to correlate positively: people who do well on one kind of test tend, on average, to do better on others.',
      why: 'It is the observation that motivates g. The AI analogue is a question to test rather than assume: does success on one benchmark predict success on very different ones?',
      src: ['spearman', 'carroll'] },
    { id: 'gf', type: 'concept', lens: 'psych', label: 'fluid intelligence (Gf)', x: 168, y: 408, lb: 'b',
      tip: 'Solving unfamiliar problems when stored knowledge helps less.',
      def: 'Solving unfamiliar problems: abstraction, inference and reasoning when stored knowledge helps less.',
      why: 'Gf is the human construct closest to what ARC-style tasks try to emphasise — an analogy for organising evidence, not a claim of psychometric equivalence between people and AI.',
      src: ['cattell', 'chollet'] },
    { id: 'gc', type: 'concept', lens: 'psych', label: 'crystallized intelligence (Gc)', x: 335, y: 140, lb: 't',
      tip: 'Accumulated knowledge and learned conceptual structures.',
      def: 'Accumulated knowledge and learned conceptual structures: vocabulary, facts, and skills built through experience and education.',
      why: 'Broad knowledge benchmarks such as HLE make Gc-like demands. Strength there shows breadth of stored knowledge; by itself it says little about solving genuinely novel problems.',
      src: ['cattell'] },
    { id: 'meta', type: 'concept', lens: 'psych', label: 'metacognition', x: 340, y: 392, lb: 'b',
      tip: 'Knowing when you know, when you do not, when to revise, and when to ask for help.',
      def: 'Knowing when you know, when you do not, when to revise, and when to ask for help.',
      why: 'Reliability, long-horizon work and autonomy all depend on noticing your own errors and uncertainty. It ties psychology directly to the engineering concerns in the Computer Science lens.',
      src: ['flavell'] },

    /* --- Evolution cluster --- */
    { id: 'adapt', type: 'concept', lens: 'evo', label: 'adaptation', x: 385, y: 528, lb: 'l',
      tip: 'Adjusting behaviour when conditions change.',
      def: 'Adjusting behaviour when conditions change: noticing that the world is different and updating accordingly.',
      why: 'Shifts the test from “how many answers do you hold?” to “what do you do when the world surprises you?” — a synthesis and framing for this map, not a direct quotation.',
      src: ['chollet'] },
    { id: 'novelty', type: 'concept', lens: 'evo', label: 'novelty', x: 255, y: 520, lb: 'b',
      tip: 'A situation that prior training or experience did not cover.',
      def: 'A situation that prior experience or training did not cover.',
      why: 'Novelty is where stored knowledge stops helping and adaptation begins. ARC-AGI-3’s environments are built around it.',
      src: ['chollet', 'arcLaunch'] },
    { id: 'priors', type: 'concept', lens: 'evo', label: 'priors / core knowledge', x: 175, y: 640, lb: 'b',
      tip: 'Proposed foundational systems: objects, actions, number, space, social partners.',
      def: 'Proposed foundational systems — for representing objects, actions, number, space, and possibly social partners — on which human cognition is thought to build from early in life.',
      why: 'No system starts from zero. Chollet argues priors must be accounted for when comparing skill acquisition. Relating this to model architecture or pretraining is a conceptual analogy created for this map — not an equivalence.',
      src: ['spelke', 'chollet'] },
    { id: 'causal', type: 'concept', lens: 'evo', label: 'causal exploration', x: 345, y: 690, lb: 'b',
      tip: 'Intervening in the world to see what happens.',
      def: 'Actively intervening in the world — testing, poking, revising — rather than only observing it.',
      why: 'Children learn causal structure by acting, not just watching. ARC-AGI-3 likewise requires an agent to explore an environment to work out how it behaves. A parallel in spirit, not an equivalence.',
      src: ['goddu', 'arcLaunch'] },
    { id: 'culture', type: 'concept', lens: 'evo', label: 'culture', x: 655, y: 690, lb: 'b',
      tip: 'Knowledge, tools and practices passed between people.',
      def: 'Knowledge, tools and practices passed between people and across generations.',
      why: 'If human intelligence is partly cultural, then what counts as “the system” being evaluated becomes a real question — for AI as well.',
      src: ['herrmann'] },
    { id: 'cumulative', type: 'concept', lens: 'evo', label: 'cumulative knowledge', x: 765, y: 555, lb: 'b',
      tip: 'Knowledge that builds across people and generations.',
      def: 'Knowledge that builds across individuals and generations rather than being rediscovered each time.',
      why: 'Human capability at any moment leans on an enormous inherited store. How to compare that with what AI systems absorb from human-produced data is an analogy to handle carefully: it is not the same thing.',
      src: ['herrmann', 'cantlon'] },

    /* --- Computer Science cluster --- */
    { id: 'breadth', type: 'concept', lens: 'cs', label: 'breadth', x: 650, y: 140, lb: 't',
      tip: 'The range of tasks and domains a system can handle.',
      def: 'The range of tasks and domains a system can handle. In Morris et al. this is “generality.”',
      why: 'Narrow systems can be superhuman at one thing. Breadth is what makes a capability “general” in the Levels of AGI framework.',
      src: ['morris'] },
    { id: 'performance', type: 'concept', lens: 'cs', label: 'performance', x: 835, y: 118, lb: 't',
      tip: 'How well the system does, compared with skilled humans.',
      def: 'How well the system does — its depth — compared with skilled humans.',
      why: 'Levels of AGI pairs performance depth with breadth. High performance in a narrow area is not generality; broad but shallow performance is not expert-level.',
      src: ['morris'] },
    { id: 'generalization', type: 'concept', lens: 'cs', label: 'generalization', x: 640, y: 410, lb: 'b',
      tip: 'Skill on tasks the system was not specifically prepared for.',
      def: 'Skill on tasks the system was not specifically prepared for. In Chollet’s terms: how efficiently new skill is acquired from limited experience and priors.',
      why: 'It is the dimension on which “knows a lot” and “can figure things out” come apart, which is why definitions that stress it draw the AGI line further out.',
      src: ['chollet'] },
    { id: 'autonomy', type: 'concept', lens: 'cs', label: 'autonomy', x: 935, y: 230, lb: 'b',
      tip: 'How independently the system can act.',
      def: 'How independently a system can act: setting sub-goals, using tools, and carrying a task through with little human steering.',
      why: 'Levels of AGI treats autonomy as a related but separable deployment consideration. An economic definition of AGI makes it central.',
      src: ['morris', 'metr'] },
    { id: 'reliability', type: 'concept', lens: 'cs', label: 'reliability', x: 930, y: 372, lb: 'b',
      tip: 'Consistent success on repeated attempts, and recovery from error.',
      def: 'How consistently the system succeeds on repeated attempts, knows when it is wrong, and recovers from errors.',
      why: 'A cross-cutting limitation: a capability that works one time in two is a different thing from one you can depend on. METR reports horizons at stated success rates for exactly this reason.',
      src: ['metr'] },
    { id: 'horizon', type: 'concept', lens: 'cs', label: 'long-horizon work', x: 795, y: 505, lb: 'b',
      tip: 'Sustaining coherent effort over long, multi-step tasks.',
      def: 'Sustaining coherent effort across long, multi-step tasks, where early mistakes compound.',
      why: 'Many valuable jobs are long. Success on a short question does not by itself tell you whether a system can carry a project for days.',
      src: ['metr'] },

    /* --- Evidence / benchmark nodes (bridges) --- */
    { id: 'hle', type: 'bench', label: 'HLE', x: 495, y: 205, lb: 'r', bridges: ['psych', 'cs'],
      tip: 'Humanity’s Last Exam: expert-level academic questions across many fields.',
      def: 'Humanity’s Last Exam: a benchmark built to challenge frontier models with expert-level academic questions across a broad range of fields.',
      why: 'Evidence of broad expert-level knowledge and reasoning on this benchmark. It does not by itself establish novel-task learning, long-horizon autonomy, or anything about consciousness.',
      src: ['hle'], stat: '54.80 ± 1.94', statNote: 'GPT-6 Astra, as listed on the Scale HLE leaderboard (page updated Sept. 17, 2026)', card: 'hle' },
    { id: 'arc', type: 'bench', label: 'ARC-AGI', x: 500, y: 490, lb: 'b', bridges: ['psych', 'evo', 'cs'],
      tip: 'Novel puzzles and, in ARC-AGI-3, interactive environments with no stated rules or goals.',
      def: 'A family of benchmarks designed to stress novel-task generalization. ARC-AGI-3 is interactive: turn-based environments with no instructions, rules or stated goals.',
      why: 'The only node here that touches all three lenses: fluid reasoning (psychology), novelty and adaptation (evolution), generalization (computer science). Results are sensitive to what counts as “the system” being tested.',
      src: ['arcLaunch', 'arcAstra', 'arcBlog'], card: 'arc' },
    { id: 'metrb', type: 'bench', label: 'METR', x: 900, y: 660, lb: 'l', bridges: ['psych', 'cs'],
      tip: 'Task-completion time horizons: how long a task can be while the agent still succeeds at a stated rate.',
      def: 'Measures a task-completion time horizon: the human task duration at which an AI agent is predicted to succeed at a stated reliability.',
      why: 'The clearest evidence on long tasks and reliability. METR warns that a time horizon is not the same as “the AI can work autonomously for that many hours,” and the current suite is mostly software, ML and cybersecurity.',
      src: ['metr'], card: 'metr' },
    { id: 'turing', type: 'bench', label: 'Turing Test', x: 505, y: 62, lb: 'r', bridges: ['psych', 'evo', 'cs'],
      tip: 'A behavioural criterion: can a machine’s conversation be told apart from a human’s?',
      def: 'Turing’s imitation game: can a machine’s conversation be told apart from a person’s?',
      why: 'A famous behavioural criterion linking language and social behaviour. Conversational imitation is not a complete AGI criterion — it became far less informative once language models became excellent conversational imitators.',
      src: ['turing'], card: 'turing' }
  ];

  /* ---------- 4. Edges ----------------------------------------------------
     [from, to, note, curvature]. Curvature 0 = straight. The note appears in
     the detail panel, so each line says what it means. */
  var edges = [
    /* lens ↔ centre */
    ['agi', 'psych', 'Psychology asks what “general” means as a capacity.', 0.0],
    ['agi', 'evo', 'Evolution asks what “general” is for.', 0.0],
    ['agi', 'cs', 'Computer science asks what “general” can be measured as.', 0.0],

    /* Psychology internals */
    ['psych', 'g', 'g is psychology’s candidate for a general capacity.', 0],
    ['psych', 'manifold', 'The positive manifold is the observation behind g.', 0],
    ['psych', 'gf', 'Fluid ability is one broad ability under g.', 0],
    ['psych', 'gc', 'Crystallized ability is another broad ability under g.', 0],
    ['psych', 'meta', 'Metacognition: monitoring one’s own thinking.', 0],
    ['g', 'manifold', 'g is inferred from the positive manifold.', 0.1],
    ['gf', 'gc', 'Fluid and crystallized abilities correlate, and are still distinguished.', 0.12],

    /* Evolution internals */
    ['evo', 'adapt', 'Adaptation is the loop intelligence serves.', 0],
    ['evo', 'novelty', 'Novelty is what adaptation is tested by.', 0],
    ['evo', 'priors', 'Inherited priors are the starting point.', 0],
    ['evo', 'causal', 'Exploration is how a system finds out about novelty.', 0],
    ['evo', 'culture', 'Culture extends what one individual can know.', 0],
    ['evo', 'cumulative', 'Culture accumulates over generations.', 0],
    ['culture', 'cumulative', 'Culture is how knowledge accumulates across people.', 0.1],
    ['novelty', 'adapt', 'Novelty demands adaptation.', 0.1],
    ['causal', 'adapt', 'Intervening produces the evidence adaptation updates on.', 0.1],

    /* CS internals */
    ['cs', 'breadth', 'Breadth is “generality” in Levels of AGI.', 0],
    ['cs', 'performance', 'Performance is “depth” in Levels of AGI.', 0],
    ['cs', 'generalization', 'Generalization: skill on tasks not prepared for.', 0],
    ['cs', 'autonomy', 'Autonomy: independent action.', 0],
    ['cs', 'reliability', 'Reliability: dependable success.', 0],
    ['cs', 'horizon', 'Long-horizon capability: sustained multi-step work.', 0],
    ['autonomy', 'reliability', 'Autonomy is only useful if it is dependable.', 0.12],
    ['reliability', 'horizon', 'Errors compound over long horizons.', 0.12],

    /* Bridges: evidence connecting lenses */
    ['hle', 'breadth', 'HLE probes breadth across many expert fields.', 0.05],
    ['hle', 'performance', 'HLE probes depth of performance on hard questions.', 0.05],
    ['hle', 'gc', 'HLE makes Gc-like demands: accumulated expert knowledge.', -0.05],

    ['arc', 'gf', 'ARC targets fluid-style reasoning on unfamiliar problems.', -0.06],
    ['arc', 'novelty', 'ARC-AGI-3 environments are built around novelty.', 0.06],
    ['arc', 'adapt', 'Agents must adapt inside an environment they were not told about.', 0],
    ['arc', 'generalization', 'ARC is Chollet’s test of generalization.', 0.05],

    ['metrb', 'autonomy', 'METR measures how far an agent can carry a task on its own.', -0.15],
    ['metrb', 'reliability', 'Time horizons are stated at a success rate (e.g. 50%, 80%).', -0.1],
    ['metrb', 'horizon', 'The horizon is the length of task the agent can complete.', 0],

    ['turing', 'gc', 'Conversation draws on language and knowledge.', 0.02],
    ['turing', 'breadth', 'Conversation can wander across any domain.', 0.02],
    ['turing', 'culture', 'Language and social behaviour are cultural skills. Caveat: imitation ≠ general intelligence.', 0.32],

    /* Cross-lens conceptual links named in the brief */
    ['priors', 'generalization', 'Priors vs. skill acquisition: what a system starts with shapes how efficiently it generalizes. Analogy, not equivalence.', -0.32],
    ['cumulative', 'breadth', 'Analogy: human-produced knowledge as the record models are trained on — not the same as living culture.', -0.34],
    ['culture', 'autonomy', 'Analogy: tools and other agents extend what a system can do. What counts as “the system”?', -0.22],
    ['meta', 'reliability', 'Knowing when you are wrong makes performance dependable.', 0.18],
    ['meta', 'horizon', 'Noticing drift and revising is what keeps long tasks on track.', 0.24],
    ['meta', 'autonomy', 'Knowing when to ask for help is part of acting independently.', 0.3]
  ];

  /* ---------- 5. “Move the line” definitions ------------------------------
     Positions p (0 narrow → 1 general) are illustrative, never scores. */
  var markers = [
    { id: 'chess',    p: 0.07, name: 'Chess',                 sub: 'narrow expertise',        side: 'up' },
    { id: 'language', p: 0.27, name: 'Language',              sub: 'fluent, open-ended text', side: 'down' },
    { id: 'coding',   p: 0.44, name: 'Coding',                sub: 'building working software', side: 'up' },
    { id: 'science',  p: 0.61, name: 'Scientific reasoning',  sub: 'hypotheses, evidence, inference', side: 'down' },
    { id: 'novel',    p: 0.78, name: 'Novel learning',        sub: 'new tasks, little experience', side: 'up' },
    { id: 'autonomy', p: 0.93, name: 'Long-horizon autonomy', sub: 'sustained, dependable agency', side: 'down' }
  ];

  var definitions = [
    { id: 'deepmind', key: 'A', name: 'DeepMind', sub: 'Generality + Performance', t: 0.36,
      bar: 'Breadth, at a stated level of performance',
      short: 'How broad is the system’s capability, and at what level does it perform across that range?',
      note: 'The “Levels of AGI” framework separates breadth (generality), depth (performance), and deployment considerations such as autonomy.',
      tags: ['Generality', 'Performance'], key_markers: ['language', 'coding'],
      src: ['morris'] },
    { id: 'chollet', key: 'B', name: 'Chollet', sub: 'Skill-acquisition efficiency', t: 0.70,
      bar: 'Efficient acquisition of skills it did not already have',
      short: 'How efficiently can the system acquire skill on tasks it did not already know how to solve?',
      note: 'Chollet distinguishes skill at a task from the intelligence that produced it: priors and training data can “buy” performance without any general ability being involved.',
      tags: ['Skill-acquisition efficiency', 'Novel tasks', 'Priors accounted for'], key_markers: ['novel'],
      src: ['chollet'] },
    { id: 'econ', key: 'C', name: 'Economic', sub: 'Autonomous work', t: 0.86,
      bar: 'Broad, autonomous, dependable cognitive work',
      short: 'Can the system perform a broad range of economically valuable cognitive work with high autonomy?',
      note: 'Here the question is deployment: not just what the system can do once, but whether it can be relied on to do broad work with little supervision.',
      tags: ['Autonomy', 'Reliability', 'Economic value'], key_markers: ['autonomy'],
      src: ['morris', 'metr'] },
    { id: 'psy', key: 'D', name: 'Psychology', sub: 'General cognitive ability', t: 0.56,
      bar: 'A capacity that supports many different tasks',
      short: 'Is there a general capability that supports performance across many different cognitive tasks?',
      note: 'The psychometric idea: a general factor shows up as a pattern — positive correlations across varied tasks — not as a score on any single one.',
      tags: ['Breadth', 'Transfer', 'Fluid reasoning'], key_markers: ['science', 'novel'],
      src: ['spearman', 'carroll'] }
  ];

  /* ---------- 6. Psychology: g tree ------------------------------------- */
  var gAbilities = [
    { id: 'reasoning', name: 'Reasoning', full: 'Reasoning', tasks: ['matrix puzzles', 'number series'],
      text: 'Inferring rules and relations in unfamiliar material. This is the part usually called fluid ability (Gf).' },
    { id: 'knowledge', name: 'Knowledge', full: 'Verbal knowledge', tasks: ['vocabulary', 'general information'],
      text: 'What a person has learned and can retrieve. This is the part usually called crystallized ability (Gc).' },
    { id: 'memory', name: 'Memory', full: 'Working memory', tasks: ['digit span', 'mental arithmetic'],
      text: 'Holding and manipulating information over a few seconds while working on it.' },
    { id: 'spatial', name: 'Spatial', full: 'Spatial ability', tasks: ['mental rotation', 'block design'],
      text: 'Representing and transforming shapes and layouts in the mind.' },
    { id: 'speed', name: 'Speed', full: 'Processing speed', tasks: ['symbol search', 'reaction time'],
      text: 'How quickly simple cognitive operations are carried out.' }
  ];

  /* ---------- 7. Evolution: adaptation loop ------------------------------ */
  var loop = [
    { id: 'l1', name: 'Encounter novelty', text: 'Something does not match what you expected: a new object, rule or situation that training and experience did not cover.' },
    { id: 'l2', name: 'Explore', text: 'Poke at it. Gather information about what is going on, rather than waiting for the answer to arrive.' },
    { id: 'l3', name: 'Form a hypothesis', text: 'Propose how it might work — a guess about cause and structure that can be wrong.' },
    { id: 'l4', name: 'Act', text: 'Intervene to test the hypothesis. Humans, especially children, do not only watch: they push, drop, ask and try.', src: ['goddu'] },
    { id: 'l5', name: 'Observe the consequence', text: 'See what actually happened, including the surprises that your hypothesis did not predict.', src: ['goddu'] },
    { id: 'l6', name: 'Update the model', text: 'Revise the hypothesis, and with it what you will expect next time.' },
    { id: 'l7', name: 'Repeat', text: 'Each update changes what counts as novel the next time. The loop does not end; it just gets a better starting point.' }
  ];

  /* ---------- 8. Evolution: human vs AI rows ----------------------------- */
  var pairs = [
    { h: 'Evolution', a: 'Architecture / model design',
      note: 'Both are design processes that fix what can be learned later — but evolution is not literally “architecture design”: it is unplanned, slow, and acts on whole organisms.' },
    { h: 'Innate / core priors', a: 'Pretraining',
      note: 'Spelke & Kinzler propose core systems for objects, actions, number, space and possibly social partners. Likening this to pretraining is a conceptual analogy for this map. Evolution is not pretraining.', src: ['spelke'] },
    { h: 'Development', a: 'Post-training',
      note: 'Both refine a starting structure with further experience. Human development is embodied, social and continuous; post-training is a designed process with its own objectives.' },
    { h: 'Culture', a: 'Human-produced cultural data',
      note: 'Models learn from a record of human output. Culture is a living practice of people teaching, correcting and building on one another. The record is not the practice: culture is not the same as training data.', src: ['herrmann'] },
    { h: 'Novel situation', a: 'Novel prompt / environment',
      note: 'The moment where stored knowledge runs out. This is the shared point of comparison that benchmarks like ARC-AGI-3 try to isolate.', src: ['arcLaunch'] },
    { h: 'Adaptation', a: 'In-context / agentic adaptation',
      note: 'Both may change behaviour in response to new information. Whether the mechanisms resemble one another is exactly what the map does not assume.' }
  ];

  /* ---------- 9. Culture chains ------------------------------------------ */
  var chains = {
    human: [
      { n: 'individual', t: 'A single person, with evolved priors and a lifetime of experience.' },
      { n: 'language', t: 'Language lets what one person learns travel to another without being rediscovered.' },
      { n: 'other humans', t: 'Teachers, peers, and rivals: learning is socially scaffolded from the first years of life.', src: ['herrmann'] },
      { n: 'books', t: 'Writing preserves knowledge beyond any single life.' },
      { n: 'institutions', t: 'Schools, laboratories and professions maintain and check what is known.' },
      { n: 'tools', t: 'Instruments, computers and notation extend memory and calculation.' },
      { n: 'cumulative culture', t: 'Each generation starts from the accumulated results of the last, rather than from zero.' }
    ],
    ai: [
      { n: 'model', t: 'The trained network itself, before any additional context or tools.' },
      { n: 'memory', t: 'Context, notes or preserved state that carry information between steps or sessions.' },
      { n: 'search / tools', t: 'Retrieval and other tools that reach information the model does not hold internally.' },
      { n: 'code execution', t: 'Running programs to calculate, test and check.' },
      { n: 'other agents', t: 'Other models or people that the system can delegate to or consult.' },
      { n: 'external knowledge', t: 'Documents, databases and the wider web available at run time.' }
    ]
  };

  var distinct = {
    cultural: { name: 'Cultural intelligence hypothesis', src: ['herrmann'],
      text: 'Human distinctiveness may depend importantly on specialized social-cognitive abilities: learning from, cooperating with, and communicating with others in cultural groups. On this view, intelligence is partly something people do together.' },
    capacity: { name: 'Expanded information capacity', src: ['cantlon'],
      text: 'One perspective argues that uniquely human cognition may arise partly from quantitative increases in global information-processing capacity — and sharing across memory, attention and learning — rather than only from many uniquely human, domain-specific modules.' }
  };

  /* ---------- 10. Computer science dimensions ---------------------------- */
  var dimensions = [
    { id: 'breadth', name: 'Breadth',
      def: 'The range of different domains and task types the system can handle at all.',
      evidence: 'Broad multi-domain evaluations.',
      bench: 'HLE and other broad evaluations', benchId: 'hle',
      cannot: 'A wide spread of academic questions is not the same as breadth of real-world, social or physical competence, and static question sets do not test acting.' },
    { id: 'performance', name: 'Performance',
      def: 'The depth of skill — how well the system does, compared with skilled humans, across what it can do.',
      evidence: 'Scores compared with human or expert baselines.',
      bench: 'HLE (hard expert-level questions)', benchId: 'hle',
      cannot: 'A high score shows performance on that task distribution. It does not by itself show the same performance on other tasks, or in deployment.' },
    { id: 'generalization', name: 'Novel learning / generalization',
      def: 'Acquiring skill on tasks the system was not specifically prepared for, from limited experience.',
      evidence: 'Performance on unfamiliar, held-out or interactive tasks.',
      bench: 'ARC-AGI (ARC-AGI-3 is interactive)', benchId: 'arc',
      cannot: 'ARC-AGI-3 results depend heavily on the harness — memory, state and scaffolding around the model — and do not cover every kind of generalization in the open world.' },
    { id: 'autonomy', name: 'Autonomy',
      def: 'Acting independently over many steps: choosing sub-goals, using tools, and finishing tasks with little human steering.',
      evidence: 'End-to-end task completion without intervention.',
      bench: 'METR time horizons', benchId: 'metrb',
      cannot: 'METR’s suite is primarily software engineering, ML and cybersecurity, and a time horizon is not the same as “the AI can work autonomously for that many hours.”' },
    { id: 'reliability', name: 'Reliability',
      def: 'Succeeding consistently on repeated attempts, knowing when it is wrong, and recovering from errors.',
      evidence: 'Repeated-trial success rates, calibration, error recovery. A cross-cutting limitation rather than one benchmark.',
      bench: 'Cross-cutting — METR reports horizons at 50% and 80% success', benchId: 'metrb',
      cannot: 'A single-run pass rate says little about calibration or recovery. Reliability is where metacognition (from the Psychology lens) turns into engineering.',
      bridge: 'meta' },
    { id: 'horizon', name: 'Long-horizon capability',
      def: 'Sustaining coherent effort across long, multi-step tasks in which early mistakes compound.',
      evidence: 'Success as a function of task length.',
      bench: 'METR time horizons', benchId: 'metrb',
      cannot: 'A time horizon is measured on a particular task suite at a particular reliability. It is not a general measure of how long the system can work.' }
  ];

  /* ---------- 11. Evidence cards ------------------------------------------ */
  var cards = [
    { id: 'hle', name: 'Humanity’s Last Exam', short: 'HLE', label: 'Breadth + expert knowledge/reasoning',
      bullets: [
        'HLE is designed to challenge frontier models across a broad range of expert-level academic knowledge and reasoning.',
        'Reported: GPT-6 Astra 54.80 ± 1.94 on the Scale leaderboard (page updated Sept. 17, 2026, the HLE-Rolling release).',
        'This is strong evidence of broad expert-level capability on this benchmark.'
      ],
      stat: '54.80 ± 1.94', statLabel: 'GPT-6 Astra · Scale leaderboard', statSrc: 'hle',
      not: 'It is not, by itself, evidence of robust novel-task learning, long-horizon autonomy, consciousness, or complete AGI.',
      src: ['hle'] },
    { id: 'arc', name: 'ARC-AGI-3', short: 'ARC-AGI-3', label: 'Novel environments + agentic adaptation',
      bullets: [
        'ARC-AGI-3 is interactive. It presents original turn-based environments with no instructions, rules or stated goals.',
        'Agents must explore, infer how the environment works, infer what “winning” means, and carry learning forward.',
        'At launch (Mar. 25, 2026), ARC Prize reported humans at 100% and frontier AI at 0.51%.',
        'ARC Prize later reported GPT-6 Astra at 62.7% with its Standard harness and ≈99.9% with a Provider Adapter setup.'
      ],
      stat: '0.51% → 62.7% / ≈99.9%', statLabel: 'Frontier AI at launch → GPT-6 Astra, two harnesses', statSrc: 'arcAstra',
      not: 'That harness sensitivity is conceptually important: the apparent capability of “the AI” changes depending on what memory, context and scaffolding belong to the evaluated system. This is benchmark evidence, not proof of AGI.',
      go: 'boundary', goText: 'See the system-boundary moment ↓',
      src: ['arcLaunch', 'arcAstra', 'arcBlog'] },
    { id: 'metr', name: 'METR time horizons', short: 'METR', label: 'Long-horizon task capability',
      bullets: [
        'METR measures a “task-completion time horizon”: the human task duration at which an AI agent is predicted to succeed at a given reliability.',
        'The current suite is primarily software engineering, machine learning and cybersecurity.',
        'Useful for asking how capability changes as tasks get longer and demand sustained execution.'
      ],
      not: 'METR explicitly warns that a time horizon is not equivalent to “the AI can autonomously do all work for that many hours.”',
      src: ['metr'] },
    { id: 'turing', name: 'Turing Test', short: 'Turing Test', label: 'Human-like conversation / imitation',
      bullets: [
        'Proposed in 1950 as a behavioural criterion: can a machine’s conversation be told apart from a person’s?',
        'Conversational indistinguishability became less useful as a sufficient criterion once language models became excellent conversational imitators.'
      ],
      not: 'The takeaway is not “passing = AGI.”',
      src: ['turing'] }
  ];

  /* ---------- 12. System boundary ---------------------------------------- */
  var boundaryModes = {
    standard: { label: 'Model + standard harness', score: 62.7, text: '62.7%', note: 'Best observed Standard-harness result. The standard harness lets the model keep notes while it works.' },
    adapter:  { label: 'Model + provider adapter / state preservation', score: 99.9, text: '≈99.9%', note: 'The Provider Adapter preserves reasoning state between requests and uses compaction for longer conversations, so earlier work can be reused.' }
  };

  var rings = [
    { id: 'model',   name: 'Model',              text: 'The trained network: weights and architecture, nothing else.' },
    { id: 'context', name: 'Context',            text: 'What is in the prompt or working window at a given moment: the task, the history, what has been shown.' },
    { id: 'memory',  name: 'Memory / state',     text: 'Information carried forward between steps or requests. This is what the Provider Adapter changes: it preserves reasoning state and compacts long conversations.', diff: true },
    { id: 'tools',   name: 'Tools',              text: 'Search, calculators, code execution and other things the model can call.' },
    { id: 'harness', name: 'Scaffold / harness', text: 'The program around the model that structures its inputs and outputs, decides what it sees, and manages its notes.' },
    { id: 'env',     name: 'Environment',        text: 'The world the system acts in and gets feedback from — here, ARC-AGI-3’s interactive games.' }
  ];

  /* ---------- 13. Same AI, different verdict ------------------------------ */
  var criteria = [
    { id: 'broad', name: 'Broad competence', state: 'Strong evidence',
      text: 'Current systems operate across language, coding, mathematics, science, multimodal tasks, and many other domains.' },
    { id: 'expert', name: 'Expert knowledge / reasoning', state: 'Strong but incomplete evidence',
      text: 'HLE shows rapid gains on difficult expert-level tasks, but it does not cover all forms of intelligence.', src: ['hle'] },
    { id: 'novel', name: 'Novel adaptation', state: 'Rapidly changing / benchmark-sensitive',
      text: 'ARC-AGI-3 shows major gains, while also demonstrating strong sensitivity to agent scaffolding and memory/state.', src: ['arcAstra', 'arcBlog'] },
    { id: 'longh', name: 'Reliable long-horizon autonomy', state: 'Still uneven',
      text: 'Long-horizon evaluations show progress, but capability remains domain-dependent and reliability matters.', src: ['metr'] },
    { id: 'human', name: 'Human-like cognition / consciousness', state: 'Not established — and not required by many AGI definitions',
      text: 'Behavioural similarity does not prove identical cognitive mechanisms; many operational definitions of AGI are capability-based rather than consciousness-based.' }
  ];

  /* ---------- 14. Definition builder -------------------------------------
     lenses: which lens nodes each criterion connects to.
     evidence: which benchmark nodes speak to it (empty = none on this map). */
  var builder = [
    { id: 'breadth', name: 'Broad performance across cognitive domains', short: 'Broad performance',
      lenses: ['cs', 'psych'], evidence: ['hle'], ang: -110 },
    { id: 'learning', name: 'Efficient learning of genuinely new tasks', short: 'New-task learning',
      lenses: ['psych', 'evo', 'cs'], evidence: ['arc'], ang: -62 },
    { id: 'autonomy', name: 'Reliable long-horizon autonomy', short: 'Reliable autonomy',
      lenses: ['cs'], evidence: ['metr'], ang: -14 },
    { id: 'selfcorrect', name: 'Error detection and self-correction', short: 'Self-correction',
      lenses: ['psych', 'cs', 'evo'], evidence: ['metr'], ang: 34 },
    { id: 'social', name: 'Ability to understand and adapt to other agents or people', short: 'Social adaptation',
      lenses: ['evo', 'psych'], evidence: ['turing'], ang: 82 },
    { id: 'embodied', name: 'Embodiment / acting in the physical world', short: 'Embodiment',
      lenses: ['evo'], evidence: [], ang: 130 },
    { id: 'conscious', name: 'Consciousness / subjective experience', short: 'Consciousness',
      lenses: ['psych'], evidence: [], ang: 178 }
  ];

  var evidenceNames = { hle: 'HLE', arc: 'ARC-AGI', metr: 'METR', turing: 'Turing Test' };

  return {
    sources: sources, lenses: lenses, nodes: nodes, edges: edges,
    markers: markers, definitions: definitions,
    gAbilities: gAbilities, loop: loop, pairs: pairs, chains: chains, distinct: distinct,
    dimensions: dimensions, cards: cards, boundaryModes: boundaryModes, rings: rings,
    criteria: criteria, builder: builder, evidenceNames: evidenceNames
  };
})();
