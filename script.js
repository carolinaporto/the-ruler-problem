/* ==========================================================================
   script.js — behaviour for the Map of Intelligence.
   Vanilla JS, no modules, no network. Data lives in content.js (AGI_DATA).

   Contents
     0. helpers
     1. state
     2. ambient background + parallax
     3. navigation / section observer / reveal
     4. hero (opening answer)
     5. constellation: build, layout, draw, hover, select, lens filter
     6. lens mini-maps
     7. "Move the line" (definitions)
     8. psychology: g tree, Gf/Gc profile, metacognition
     9. evolution: adaptation loop, human-vs-AI rows, culture chains
    10. computer science: six dimensions
    11. evidence orbit
    12. system boundary (ARC harness moment)
    13. same AI, different verdict
    14. build-your-own definition
    15. final answer
    16. sources
    17. reduced motion / boot
   ========================================================================== */
(function () {
  'use strict';

  var D = window.AGI_DATA;
  if (!D) { return; }

  /* ---------------------------------------------------------------- 0. helpers */
  var SVGNS = 'http://www.w3.org/2000/svg';

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* Create an SVG element with attributes; optionally append to a parent. */
  function svgEl(tag, attrs, parent) {
    var node = document.createElementNS(SVGNS, tag);
    if (attrs) { for (var k in attrs) { if (attrs[k] !== null && attrs[k] !== undefined) { node.setAttribute(k, attrs[k]); } } }
    if (parent) { parent.appendChild(parent === node ? null : node); }
    return node;
  }
  function clear(node) { while (node.firstChild) { node.removeChild(node.firstChild); } return node; }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  /* Tiny seeded random so the star field is the same on every visit. */
  function rng(seed) { var s = seed; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

  var motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  function reduced() { return motionQuery.matches; }

  function scrollToId(id, block) {
    var target = document.getElementById(id);
    if (!target) { return; }
    target.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: block || 'start' });
  }

  /* Run fn once when el first becomes visible. */
  function onceVisible(el, fn, threshold) {
    if (!el) { return; }
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) { io.disconnect(); fn(); }
    }, { threshold: threshold || 0.25 });
    io.observe(el);
  }

  /* Source link helpers. External links always open in a new tab. */
  function srcLink(id, label) {
    var s = D.sources[id];
    if (!s) { return ''; }
    if (!s.url) { return '<span class="src src-static">' + esc(label || s.cite) + '</span>'; }
    return '<a class="src" href="' + s.url + '" target="_blank" rel="noopener noreferrer" aria-label="Source: ' + esc(s.cite) + ' (opens in a new tab)">' + esc(label || 'source') + ' ↗</a>';
  }
  function srcList(ids) {
    if (!ids || !ids.length) { return ''; }
    return '<ul class="src-list">' + ids.map(function (id) {
      var s = D.sources[id];
      if (!s) { return ''; }
      return '<li>' + (s.url
        ? '<a href="' + s.url + '" target="_blank" rel="noopener noreferrer">' + esc(s.cite) + ' ↗</a>'
        : '<span>' + esc(s.cite) + ' <em>(background reference)</em></span>') + '</li>';
    }).join('') + '</ul>';
  }

  /* Replace content and replay a short fade so changes read as changes. */
  function swap(container, html) {
    container.innerHTML = html;
    if (reduced()) { return; }
    container.classList.remove('swap');
    void container.offsetWidth;
    container.classList.add('swap');
  }

  function animateNumber(node, from, to, ms, decimals) {
    if (reduced() || !window.requestAnimationFrame) { node.textContent = to.toFixed(decimals); return; }
    var start = null;
    function step(ts) {
      if (start === null) { start = ts; }
      var p = clamp((ts - start) / ms, 0, 1);
      var e = 1 - Math.pow(1 - p, 3);
      node.textContent = (from + (to - from) * e).toFixed(decimals);
      if (p < 1) { requestAnimationFrame(step); }
    }
    requestAnimationFrame(step);
  }

  function lensLabel(id) { return D.lenses[id] ? D.lenses[id].name : ''; }

  /* ---------------------------------------------------------------- 1. state */
  var state = {
    first: null,          // opening answer (memory only, no storage)
    final: null,          // answer after exploring
    lens: 'all',          // constellation filter
    selected: null,       // selected node id
    hovered: null,
    def: 'deepmind',
    era: 'early',
    manifold: false,
    ability: null,
    loopStep: null,
    pair: null,
    chain: null,
    distinct: 'cultural',
    dim: null,
    card: 'hle',
    mode: 'standard',
    ring: null,
    verdict: 'broad',
    crit: {},
    pointer: { x: 0, y: 0, nx: 0, ny: 0, inMap: false, mx: 0, my: 0 }
  };

  var ANSWER_FIRST = { yes: 'YES', no: 'NO', unsure: 'I’M NOT SURE' };
  var ANSWER_FINAL = { yes: 'YES', no: 'NO', depends: 'IT DEPENDS' };

  /* ---------------------------------------------------------------- 2. ambient background + parallax */
  var bgLayer = $('.bg');
  var parallaxTargets = [];

  function buildStars() {
    var svg = $('#bgStars');
    if (!svg) { return; }
    svg.setAttribute('viewBox', '0 0 1000 1000');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    var r = rng(7);
    var pts = [];
    for (var i = 0; i < 64; i++) { pts.push({ x: r() * 1000, y: r() * 1000, r: 0.6 + r() * 1.2, o: 0.18 + r() * 0.5 }); }
    // a few faint hairlines between near neighbours: "network" rather than "sky"
    for (var a = 0; a < pts.length; a++) {
      for (var b = a + 1; b < pts.length; b++) {
        var dx = pts[a].x - pts[b].x, dy = pts[a].y - pts[b].y;
        if (dx * dx + dy * dy < 105 * 105 && (a + b) % 3 === 0) {
          svgEl('line', { class: 'bg-line', x1: pts[a].x, y1: pts[a].y, x2: pts[b].x, y2: pts[b].y }, svg);
        }
      }
    }
    pts.forEach(function (p, i) {
      var c = svgEl('circle', { class: 'bg-star', cx: p.x, cy: p.y, r: p.r, opacity: p.o }, svg);
      c.style.animationDelay = (-(i * 1.7) % 18) + 's';
      c.style.animationDuration = (11 + (i % 7) * 2) + 's';
    });
  }

  function initPointer() {
    window.addEventListener('pointermove', function (e) {
      state.pointer.nx = (e.clientX / window.innerWidth - 0.5) * 2;   // -1 … 1
      state.pointer.ny = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  /* Smooth pointer parallax for the background and the two skies. */
  function parallaxTick() {
    var p = state.pointer;
    p.x += (p.nx - p.x) * 0.06;
    p.y += (p.ny - p.y) * 0.06;
    if (bgLayer) { bgLayer.style.transform = 'translate3d(' + (p.x * -10).toFixed(2) + 'px,' + (p.y * -10).toFixed(2) + 'px,0)'; }
    parallaxTargets.forEach(function (t) {
      if (t.visible) { t.el.style.transform = 'translate3d(' + (p.x * t.k).toFixed(2) + 'px,' + (p.y * t.k).toFixed(2) + 'px,0)'; }
    });
  }
  function registerParallax(el, k) {
    var t = { el: el, k: k, visible: true };
    parallaxTargets.push(t);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { t.visible = es[0].isIntersecting; }).observe(el);
    }
  }

  /* ---------------------------------------------------------------- 3. navigation, progress, reveal */
  function initNav() {
    var sections = $$('main > section[id]');
    var links = $$('#topnav a');
    var rail = $('#rail');
    var bar = $('#progressBar');

    sections.forEach(function (sec) {
      var a = document.createElement('a');
      a.href = '#' + sec.id;
      a.setAttribute('data-target', sec.id);
      a.setAttribute('aria-label', sec.getAttribute('data-title'));
      a.innerHTML = '<span class="rail-tip">' + esc(sec.getAttribute('data-title')) + '</span>';
      rail.appendChild(a);
    });
    var dots = $$('#rail a');

    function activate(sec) {
      var key = sec.getAttribute('data-nav');
      links.forEach(function (l) {
        var on = l.getAttribute('data-nav') === key;
        l.classList.toggle('active', on);
        if (on) { l.setAttribute('aria-current', 'true'); } else { l.removeAttribute('aria-current'); }
      });
      dots.forEach(function (d) {
        var on = d.getAttribute('data-target') === sec.id;
        d.classList.toggle('active', on);
        if (on) { d.setAttribute('aria-current', 'location'); } else { d.removeAttribute('aria-current'); }
      });
      // keep the active link in view on the horizontally scrolling mobile nav
      var act = $('#topnav a.active');
      var nav = $('#topnav');
      if (act && nav.scrollWidth > nav.clientWidth) {
        nav.scrollTo({ left: act.offsetLeft - (nav.clientWidth - act.offsetWidth) / 2, behavior: reduced() ? 'auto' : 'smooth' });
      }
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { activate(e.target); } });
      }, { rootMargin: '-42% 0px -55% 0px' });
      sections.forEach(function (s) { io.observe(s); });
    } else { activate(sections[0]); }

    var ticking = false;
    function onScroll() {
      if (ticking) { return; }
      ticking = true;
      requestAnimationFrame(function () {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = 'scaleX(' + (max > 0 ? clamp(window.scrollY / max, 0, 1) : 0).toFixed(4) + ')';
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initReveal() {
    var els = $$('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  /* Generic in-page buttons: [data-goto], [data-goto-node], [data-lens-return] */
  function initGotos() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-goto],[data-goto-node],[data-lens-return],[data-go]') : null;
      if (!t) { return; }
      if (t.hasAttribute('data-goto')) { scrollToId(t.getAttribute('data-goto')); }
      else if (t.hasAttribute('data-goto-node')) { scrollToId('map', 'start'); setLens('all'); selectNode(t.getAttribute('data-goto-node')); }
      else if (t.hasAttribute('data-lens-return')) { deselect(); setLens(t.getAttribute('data-lens-return')); scrollToId('map', 'start'); }
      else if (t.hasAttribute('data-go')) { scrollToId(t.getAttribute('data-go')); }
    });
  }

  /* ---------------------------------------------------------------- 4. hero (opening answer) */
  function buildSky(svg, opts) {
    clear(svg);
    var byId = {};
    D.nodes.forEach(function (n) { byId[n.id] = n; });
    var g = svgEl('g', { class: 'sky-layer' }, svg);
    svg.appendChild(g);
    // hairline orbit rings around the centre
    [140, 250, 370].forEach(function (rr) { g.appendChild(svgEl('circle', { class: 'sky-orbit', cx: 500, cy: 372, r: rr })); });
    D.edges.forEach(function (e) {
      var a = byId[e[0]], b = byId[e[1]];
      g.appendChild(svgEl('line', { class: 'sky-edge', x1: a.x, y1: a.y, x2: b.x, y2: b.y }));
    });
    var r = rng(opts && opts.seed ? opts.seed : 3);
    D.nodes.forEach(function (n, i) {
      var grp = svgEl('g', { class: 'sky-node sky-' + n.type + (n.lens ? ' lens-' + n.lens : ''), transform: 'translate(' + n.x + ' ' + n.y + ')' });
      var inner = svgEl('g', { class: 'sky-drift' });
      inner.style.animationDelay = (-r() * 14).toFixed(1) + 's';
      inner.style.animationDuration = (10 + r() * 10).toFixed(1) + 's';
      var size = n.type === 'center' ? 5 : n.type === 'lens' ? 4.5 : n.type === 'bench' ? 3.6 : 2.6;
      if (n.type === 'bench') { inner.appendChild(svgEl('rect', { x: -size, y: -size, width: size * 2, height: size * 2, transform: 'rotate(45)' })); }
      else { inner.appendChild(svgEl('circle', { r: size })); }
      if (opts && opts.labels && n.type !== 'center') {
        var t = svgEl('text', { class: 'sky-label', x: 8, y: 4 });
        t.textContent = n.type === 'lens' ? n.label.toLowerCase() : n.label;
        t.style.transitionDelay = (i * 60) + 'ms';
        inner.appendChild(t);
      }
      grp.appendChild(inner);
      g.appendChild(grp);
    });
    registerParallax(g, opts && opts.k ? opts.k : 14);
    return svg;
  }

  function initHero() {
    var hero = $('#hero');
    var answers = $('#heroAnswers');
    var chip = $('#heroChip');
    var chipVal = $('#heroChipValue');

    buildSky($('#heroSky'), { labels: true, k: 16, seed: 5 });

    function flip(fromRect, toEl) {
      if (reduced() || !toEl.animate) { return; }
      var b = toEl.getBoundingClientRect();
      var dx = fromRect.left + fromRect.width / 2 - (b.left + b.width / 2);
      var dy = fromRect.top + fromRect.height / 2 - (b.top + b.height / 2);
      toEl.animate([
        { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(1.5)', opacity: 0 },
        { transform: 'translate(' + dx * 0.25 + 'px,' + dy * 0.25 + 'px) scale(1.15)', opacity: 1, offset: 0.55 },
        { transform: 'none', opacity: 1 }
      ], { duration: 720, easing: 'cubic-bezier(.2,.7,.2,1)' });
    }

    $$('.btn-answer', answers).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-answer');
        var from = btn.getBoundingClientRect();
        state.first = key;
        chipVal.textContent = ANSWER_FIRST[key];
        $('#cmpFirst').textContent = ANSWER_FIRST[key];
        hero.classList.add('revealed', 'answered');
        chip.hidden = false;
        $$('.btn-answer', answers).forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        flip(from, chip);
      });
    });

    $('#heroChange').addEventListener('click', function () {
      hero.classList.remove('answered');
      chip.hidden = true;
      var first = $('.btn-answer', answers);
      if (first) { first.focus({ preventScroll: true }); }
    });
  }

  /* ---------------------------------------------------------------- 5. constellation */
  var G = { nodes: [], byId: {}, edges: [], adj: {}, svg: null, nodeEls: {}, edgeEls: [], compact: false, fs: 13, visible: false };
  var R = { center: 32, lens: 24, concept: 8.5, bench: 11 };

  function buildGraphData() {
    G.nodes = D.nodes.map(function (n) { var c = {}; for (var k in n) { c[k] = n[k]; } c.px = n.x; c.py = n.y; c.ox = 0; c.oy = 0; c.ph = Math.random() * 6.28; return c; });
    G.nodes.forEach(function (n) { G.byId[n.id] = n; G.adj[n.id] = []; });
    G.edges = D.edges.map(function (e, i) {
      var edge = { a: e[0], b: e[1], note: e[2], k: e[3] || 0, i: i };
      G.adj[edge.a].push({ other: edge.b, edge: edge });
      G.adj[edge.b].push({ other: edge.a, edge: edge });
      return edge;
    });
    // Bridge pips: which lenses does an evidence node actually connect to? (derived from edges, not asserted)
    G.nodes.forEach(function (n) {
      if (n.type !== 'bench') { return; }
      var seen = {};
      G.adj[n.id].forEach(function (x) { var o = G.byId[x.other]; if (o.lens) { seen[o.lens] = true; } });
      n.pips = ['psych', 'evo', 'cs'].filter(function (l) { return seen[l]; });
    });
  }

  function wrapLabel(text) {
    if (text.length <= 15) { return [text]; }
    var mid = text.length / 2, best = -1, bd = 1e9;
    for (var i = 0; i < text.length; i++) { if (text[i] === ' ' && Math.abs(i - mid) < bd) { bd = Math.abs(i - mid); best = i; } }
    return best < 0 ? [text] : [text.slice(0, best), text.slice(best + 1)];
  }

  function nodeRadius(n) { return R[n.type]; }

  function edgePath(e) {
    var a = G.byId[e.a], b = G.byId[e.b];
    var x1 = a.px, y1 = a.py, x2 = b.px, y2 = b.py;
    if (!e.k) { return 'M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + 'L' + x2.toFixed(1) + ' ' + y2.toFixed(1); }
    var mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1;
    var cx = mx - dy * e.k, cy = my + dx * e.k;   // control point offset along the normal
    return 'M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + 'Q' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ' ' + x2.toFixed(1) + ' ' + y2.toFixed(1);
  }

  function buildMap() {
    var svg = G.svg = $('#mapSvg');
    clear(svg);
    buildGraphData();

    // decoration: orbital hairlines + coordinate ticks (layer moves a little with the pointer)
    var deco = svgEl('g', { class: 'map-deco', 'aria-hidden': 'true' }, svg);
    svg.appendChild(deco);
    [120, 215, 330].forEach(function (rr, i) { deco.appendChild(svgEl('circle', { class: 'deco-orbit', cx: 500, cy: 372, r: rr, 'stroke-dasharray': i === 1 ? '2 7' : null })); });
    deco.appendChild(svgEl('line', { class: 'deco-axis', x1: 40, y1: 372, x2: 960, y2: 372 }));
    deco.appendChild(svgEl('line', { class: 'deco-axis', x1: 500, y1: 30, x2: 500, y2: 730 }));
    var coords = [['α 00h', 40, 366], ['α 12h', 960, 366], ['δ +90°', 506, 36], ['δ −90°', 506, 730]];
    coords.forEach(function (c) {
      var t = svgEl('text', { class: 'deco-coord', x: c[1], y: c[2], 'text-anchor': c[1] > 900 ? 'end' : 'start' });
      t.textContent = c[0]; deco.appendChild(t);
    });
    registerParallax(deco, 7);

    var gEdges = svgEl('g', { class: 'edges' }, svg); svg.appendChild(gEdges);
    var gNodes = svgEl('g', { class: 'nodes' }, svg); svg.appendChild(gNodes);

    G.edges.forEach(function (e) {
      var a = G.byId[e.a], b = G.byId[e.b];
      var same = a.lens && a.lens === b.lens;
      var lensOf = same ? a.lens : (a.type === 'center' || b.type === 'center') ? (a.lens || b.lens) : null;
      var p = svgEl('path', { class: 'edge' + (lensOf ? ' lens-' + lensOf : ' cross'), d: edgePath(e), pathLength: 1 });
      p.style.setProperty('--d', (300 + e.i * 28) + 'ms');
      gEdges.appendChild(p);
      e.el = p;
    });

    G.nodes.forEach(function (n, i) {
      var grp = svgEl('g', {
        class: 'node node-' + n.type + (n.lens ? ' lens-' + n.lens : ''),
        transform: 'translate(' + n.x + ' ' + n.y + ')',
        tabindex: 0, role: 'button', 'aria-pressed': 'false', 'data-id': n.id,
        'aria-label': n.label.replace(/\n/g, ' ') + (n.type === 'lens' ? ' lens' : n.type === 'bench' ? ' evidence' : n.type === 'center' ? ' central question' : ' concept') + '. ' + n.tip
      });
      grp.style.setProperty('--d', (200 + i * 45) + 'ms');
      var hit = svgEl('circle', { class: 'hit', r: 20 }); grp.appendChild(hit);
      var r = nodeRadius(n);
      if (n.type === 'center') {
        grp.appendChild(svgEl('circle', { class: 'halo', r: r + 13 }));
        grp.appendChild(svgEl('circle', { class: 'shape', r: r }));
        var t = svgEl('text', { class: 'center-label', x: 0, y: 7, 'text-anchor': 'middle' }); t.textContent = n.label; grp.appendChild(t);
      } else if (n.type === 'lens') {
        grp.appendChild(svgEl('circle', { class: 'halo', r: r + 8 }));
        grp.appendChild(svgEl('circle', { class: 'shape', r: r }));
        grp.appendChild(svgEl('circle', { class: 'core', r: 4.5 }));
      } else if (n.type === 'bench') {
        grp.appendChild(svgEl('circle', { class: 'halo', r: 19 }));
        grp.appendChild(svgEl('rect', { class: 'shape', x: -8.5, y: -8.5, width: 17, height: 17, transform: 'rotate(45)' }));
        var pips = n.pips || [];
        pips.forEach(function (l, j) {
          var ang = (90 + (j - (pips.length - 1) / 2) * 46) * Math.PI / 180;
          grp.appendChild(svgEl('circle', { class: 'pip lens-' + l, cx: (Math.cos(ang) * 19).toFixed(1), cy: (Math.sin(ang) * 19).toFixed(1), r: 3.4 }));
        });
      } else {
        grp.appendChild(svgEl('circle', { class: 'halo', r: r + 6 }));
        grp.appendChild(svgEl('circle', { class: 'shape', r: r }));
      }
      if (n.type !== 'center') { var lab = svgEl('text', { class: 'nlabel' }); grp.appendChild(lab); n.labelEl = lab; }
      gNodes.appendChild(grp);
      G.nodeEls[n.id] = grp;
      n.el = grp;
      bindNode(n, grp);
    });

    updateScale(true);
    initMapPointer();
    renderNodeIndex();
    setLens('all');
    renderPanel();

    onceVisible($('#mapStage'), function () { svg.classList.add('drawn'); }, 0.2);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { G.visible = es[0].isIntersecting; }, { threshold: 0 }).observe($('#mapStage'));
    } else { G.visible = true; }

    svg.addEventListener('click', function (e) { if (!e.target.closest('.node')) { deselect(); } });
    if ('ResizeObserver' in window) { new ResizeObserver(function () { updateScale(false); }).observe($('#mapStage')); }
    else { window.addEventListener('resize', function () { updateScale(false); }); }
  }

  /* Text and touch targets are sized in screen pixels, not viewBox units,
     so labels stay legible and tappable when the SVG shrinks on a phone. */
  function updateScale(force) {
    var w = G.svg.getBoundingClientRect().width || 1000;
    var scale = w / 1000;
    var compact = w < 640;
    G.fs = clamp((compact ? 11 : 12.5) / scale, 11, 36);
    G.svg.style.setProperty('--fs', G.fs.toFixed(1) + 'px');
    var hitR = Math.max(20, 23 / scale);
    $$('.hit', G.svg).forEach(function (h) { h.setAttribute('r', hitR.toFixed(1)); });
    if (force || compact !== G.compact) {
      G.compact = compact;
      G.svg.classList.toggle('compact', compact);
      layoutLabels();
    }
  }

  function layoutLabels() {
    G.nodes.forEach(function (n) {
      if (!n.labelEl) { return; }
      var lb = n.lb;
      if (G.compact && n.x < 220 && (lb === 't' || lb === 'b')) { lb = 'r'; }
      if (G.compact && n.x > 780 && (lb === 't' || lb === 'b')) { lb = 'l'; }
      var lines = wrapLabel(n.type === 'lens' ? n.label : n.label);
      var r = nodeRadius(n) + (n.type === 'bench' ? 10 : n.type === 'lens' ? 6 : 4);
      var el = clear(n.labelEl);
      var x = 0, y = 0, anchor = 'middle', firstDy;
      if (lb === 't') { y = -(r + 4); firstDy = (-(lines.length - 1) * 1.15) + 'em'; }
      else if (lb === 'b') { y = r + 4; firstDy = '0.95em'; }
      else if (lb === 'l') { x = -(r + 3); anchor = 'end'; firstDy = (0.35 - (lines.length - 1) * 0.575) + 'em'; }
      else { x = r + 3; anchor = 'start'; firstDy = (0.35 - (lines.length - 1) * 0.575) + 'em'; }
      el.setAttribute('x', x); el.setAttribute('y', y); el.setAttribute('text-anchor', anchor);
      lines.forEach(function (ln, i) {
        var ts = svgEl('tspan', { x: x, dy: i === 0 ? firstDy : '1.15em' });
        ts.textContent = ln; el.appendChild(ts);
      });
    });
  }

  /* --- node interaction -------------------------------------------------- */
  function bindNode(n, grp) {
    grp.addEventListener('click', function (e) { e.stopPropagation(); selectNode(n.id); });
    grp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectNode(n.id); }
    });
    grp.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { hoverNode(n.id); showTip(n); } });
    grp.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { hoverNode(null); hideTip(); } });
    grp.addEventListener('focus', function () { hoverNode(n.id); showTip(n); });
    grp.addEventListener('blur', function () { hoverNode(null); hideTip(); });
  }

  function showTip(n) {
    var tip = $('#tip'), stage = $('#mapStage');
    tip.innerHTML = '<b>' + esc(n.label.replace(/\n/g, ' ')) + '</b><span>' + esc(n.tip) + '</span>';
    tip.hidden = false;
    var r = n.el.getBoundingClientRect(), s = stage.getBoundingClientRect();
    var cx = r.left + r.width / 2 - s.left;
    var half = tip.offsetWidth / 2;
    tip.style.left = clamp(cx, half + 6, s.width - half - 6) + 'px';
    var top = r.top - s.top - 10;
    var below = top - tip.offsetHeight < 4;
    tip.style.top = (below ? r.bottom - s.top + 10 : top) + 'px';
    tip.classList.toggle('below', below);
  }
  function hideTip() { $('#tip').hidden = true; }

  function hoverNode(id) { state.hovered = id; applyHighlight(); }

  function selectNode(id) {
    if (!G.byId[id]) { return; }
    state.selected = id;
    var n = G.byId[id];
    if (n.type === 'lens') { setLens(n.lens, true); }
    applyHighlight();
    renderPanel();
    syncIndex();
    if (G.compact) {
      var p = $('#mapPanel'), r = p.getBoundingClientRect();
      if (r.top > window.innerHeight * 0.75 || r.bottom < 0) { p.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'nearest' }); }
    }
  }

  function deselect() {
    if (state.selected === null) { return; }
    state.selected = null;
    applyHighlight();
    renderPanel();
    syncIndex();
  }

  /* Which nodes are "in" the current lens? Concepts of the lens, the lens node, and
     evidence nodes that connect to it. The centre is always kept for context. */
  function inLens(n, lens) {
    if (lens === 'all' || n.type === 'center') { return true; }
    if (n.lens === lens) { return true; }
    if (n.type === 'bench') { return (n.pips || []).indexOf(lens) >= 0; }
    return false;
  }

  function setLens(lens, keepSelection) {
    state.lens = lens;
    $$('#lensFilter .chip').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lens') === lens ? 'true' : 'false'); });
    var d = D.lenses[lens];
    $('#lensDesc').textContent = d.desc;
    if (!keepSelection && state.selected) { state.selected = null; }
    applyHighlight();
    renderPanel();
    syncIndex();
  }

  /* One function decides every visual state of the graph, so hover, selection
     and lens filter always agree with each other. */
  function applyHighlight() {
    var sel = state.selected, hov = state.hovered, lens = state.lens;
    var focus = hov || sel;
    var linked = {};
    if (focus) {
      linked[focus] = true;
      G.adj[focus].forEach(function (x) { linked[x.other] = true; });
      // hovering a lens lights its whole cluster
      var fn = G.byId[focus];
      if (fn.type === 'lens') { G.nodes.forEach(function (m) { if (m.lens === fn.lens) { linked[m.id] = true; } }); }
    }
    var lensHover = focus && G.byId[focus].type === 'lens' ? G.byId[focus].lens : null;
    G.svg.classList.toggle('has-focus', !!focus);
    G.svg.classList.toggle('has-selection', !!sel);

    G.nodes.forEach(function (n) {
      var el = n.el;
      el.classList.toggle('dim', !inLens(n, lens) || (!!focus && !linked[n.id]));
      el.classList.toggle('is-selected', sel === n.id);
      el.classList.toggle('is-linked', !!focus && linked[n.id] && n.id !== focus);
      el.setAttribute('aria-pressed', sel === n.id ? 'true' : 'false');
    });
    G.edges.forEach(function (e) {
      var a = G.byId[e.a], b = G.byId[e.b];
      var inScope = inLens(a, lens) && inLens(b, lens);
      var incident = !!focus && (e.a === focus || e.b === focus);
      var clusterEdge = lensHover && (a.lens === lensHover || b.lens === lensHover) && (!a.lens || a.lens === lensHover || a.type === 'center') && (!b.lens || b.lens === lensHover || b.type === 'center');
      var selIncident = !!sel && (e.a === sel || e.b === sel);
      e.el.classList.toggle('dim', !inScope || (!!focus && !incident && !clusterEdge));
      e.el.classList.toggle('is-active', selIncident);
      e.el.classList.toggle('is-hover', (incident || clusterEdge) && !selIncident);
      e.el.classList.toggle('in-lens', lens !== 'all' && inScope && a.type !== 'center' && b.type !== 'center');
    });
    $('#mapHint').classList.toggle('gone', !!sel);
  }

  /* --- detail panel ------------------------------------------------------ */
  function nodeKind(n) {
    if (n.type === 'center') { return 'The question'; }
    if (n.type === 'lens') { return 'Lens'; }
    if (n.type === 'bench') { return 'Evidence · bridges lenses'; }
    return lensLabel(n.lens) + ' · concept';
  }

  function renderPanel() {
    var panel = $('#mapPanel');
    var id = state.selected;
    if (!id) {
      var L = D.lenses[state.lens];
      var html = '<div class="panel-inner"><p class="mini-label">Select a node to inspect</p>';
      if (state.lens === 'all') {
        html += '<h3 class="serif">Start anywhere.</h3><p>Hover a node to see what it connects to. Select it to open its definition, why it matters for AGI, and where the claim comes from.</p>' +
          '<p class="muted">Diamonds are evidence. The pips beneath them show which lenses they actually connect to — ARC-AGI and the Turing Test touch all three.</p>';
      } else {
        var members = G.nodes.filter(function (n) { return n.lens === state.lens && n.type === 'concept'; });
        html += '<h3 class="serif" style="color:' + L.color + '">' + esc(L.name) + '</h3><p>' + esc(L.desc) + '</p><p class="mini-label">Concepts in this lens</p><div class="chip-row">' +
          members.map(function (m) { return '<button type="button" class="chip chip-sm" data-node="' + m.id + '">' + esc(m.label.replace(/\n/g, ' ')) + '</button>'; }).join('') + '</div>' +
          '<p><button type="button" class="btn-ghost" data-go="' + G.byId[state.lens].go + '">Open the ' + esc(L.name) + ' lens ↓</button></p>';
      }
      panel.innerHTML = html + '</div>';
      return;
    }
    renderDetail(panel, id);
  }

  function renderDetail(panel, id) {
    var n = G.byId[id];
    var kindColor = n.lens ? 'var(--' + n.lens + ')' : 'var(--gold)';
    var conns = G.adj[id].map(function (x) {
      var o = G.byId[x.other];
      return '<li><button type="button" data-node="' + o.id + '"><span class="cn">' + esc(o.label.replace(/\n/g, ' ')) + '</span><span class="cnote">' + esc(x.edge.note) + '</span></button></li>';
    }).join('');
    var html = '<div class="panel-inner"><div class="panel-top"><p class="kind" style="color:' + kindColor + '">' + esc(nodeKind(n)) + '</p>' +
      '<button type="button" class="x" id="panelClose" aria-label="Close detail panel">×<span class="x-hint">Esc</span></button></div>' +
      '<h3 class="serif">' + esc(n.label.replace(/\n/g, ' ')) + '</h3>' +
      '<p class="def">' + esc(n.def) + '</p>';
    if (n.stat) {
      html += '<p class="stat"><span class="num-tab">' + esc(n.stat) + '</span> ' + srcLink(n.src[0]) + '</p><p class="statnote">' + esc(n.statNote) + '</p>';
    }
    html += '<div class="psec"><p class="mini-label">Why it matters for AGI</p><p>' + esc(n.why) + '</p></div>';
    if (conns) { html += '<div class="psec"><p class="mini-label">Connections</p><ul class="conn-list">' + conns + '</ul></div>'; }
    if (n.src && n.src.length) { html += '<div class="psec"><p class="mini-label">Sources</p>' + srcList(n.src) + '</div>'; }
    if (n.go) { html += '<p><button type="button" class="btn-ghost" data-go="' + n.go + '">Open the ' + esc(lensLabel(n.lens)) + ' lens ↓</button></p>'; }
    if (n.card) { html += '<p><button type="button" class="btn-ghost" data-open-card="' + n.card + '">Open the evidence card ↓</button></p>'; }
    html += '</div>';
    swap(panel, html);
  }

  function initPanelEvents() {
    var panel = $('#mapPanel');
    panel.addEventListener('click', function (e) {
      var t = e.target.closest('button');
      if (!t) { return; }
      if (t.id === 'panelClose') { deselect(); var f = state.lastFocus; if (f && f.focus) { f.focus({ preventScroll: true }); } return; }
      if (t.hasAttribute('data-node')) { selectNode(t.getAttribute('data-node')); }
      if (t.hasAttribute('data-open-card')) { selectCard(t.getAttribute('data-open-card')); scrollToId('evidence'); }
    });
    G.svg.addEventListener('focusin', function (e) { var n = e.target.closest && e.target.closest('.node'); if (n) { state.lastFocus = n; } });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        hideTip();
        if (state.selected) { var last = state.lastFocus; deselect(); if (last && document.activeElement === last) { /* keep focus on node */ } }
      }
    });
    $$('#lensFilter .chip').forEach(function (b) {
      b.addEventListener('click', function () { setLens(b.getAttribute('data-lens')); });
    });
  }

  function renderNodeIndex() {
    var wrap = $('#nodeIndex');
    var groups = [['center', 'The question'], ['psych', 'Psychology'], ['evo', 'Evolution'], ['cs', 'Computer Science'], ['bench', 'Evidence']];
    wrap.innerHTML = groups.map(function (g) {
      var items = G.nodes.filter(function (n) {
        if (g[0] === 'center') { return n.type === 'center'; }
        if (g[0] === 'bench') { return n.type === 'bench'; }
        return n.lens === g[0];
      });
      return '<div class="ni-group"><p class="mini-label">' + g[1] + '</p><div class="chip-row">' +
        items.map(function (n) { return '<button type="button" class="chip chip-sm' + (n.lens ? ' t-' + n.lens : '') + '" data-node="' + n.id + '" aria-pressed="false">' + esc(n.label.replace(/\n/g, ' ')) + '</button>'; }).join('') +
        '</div></div>';
    }).join('');
    wrap.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-node]');
      if (b) { selectNode(b.getAttribute('data-node')); }
    });
  }
  function syncIndex() {
    $$('#nodeIndex button').forEach(function (b) {
      var id = b.getAttribute('data-node');
      b.setAttribute('aria-pressed', state.selected === id ? 'true' : 'false');
      b.classList.toggle('dim', !inLens(G.byId[id], state.lens));
    });
  }

  /* --- ambient drift + cursor proximity ----------------------------------- */
  function initMapPointer() {
    var svg = G.svg;
    var pt = svg.createSVGPoint ? svg.createSVGPoint() : null;
    svg.addEventListener('pointermove', function (e) {
      if (!pt || e.pointerType !== 'mouse') { return; }
      pt.x = e.clientX; pt.y = e.clientY;
      var m = svg.getScreenCTM();
      if (!m) { return; }
      var p = pt.matrixTransform(m.inverse());
      state.pointer.mx = p.x; state.pointer.my = p.y; state.pointer.inMap = true;
    });
    svg.addEventListener('pointerleave', function () { state.pointer.inMap = false; });
  }

  /* Each node drifts on its own slow sine path; nodes near the cursor lean toward it. */
  function mapTick(t) {
    if (!G.visible) { return; }
    var s = t / 1000, p = state.pointer;
    G.nodes.forEach(function (n) {
      var amp = n.type === 'center' ? 0 : n.type === 'lens' ? 2.2 : 3.4;
      var dx = Math.sin(s * 0.33 + n.ph) * amp, dy = Math.cos(s * 0.27 + n.ph * 1.3) * amp;
      var tx = 0, ty = 0;
      if (p.inMap && n.type !== 'center') {
        var ex = p.mx - n.x, ey = p.my - n.y, d = Math.sqrt(ex * ex + ey * ey), rr = 170;
        if (d < rr && d > 0.1) { var f = Math.pow(1 - d / rr, 2) * 9; tx = ex / d * f; ty = ey / d * f; }
      }
      n.ox += (tx - n.ox) * 0.08; n.oy += (ty - n.oy) * 0.08;
      n.px = n.x + dx + n.ox; n.py = n.y + dy + n.oy;
      n.el.setAttribute('transform', 'translate(' + n.px.toFixed(2) + ' ' + n.py.toFixed(2) + ')');
    });
    G.edges.forEach(function (e) { e.el.setAttribute('d', edgePath(e)); });
  }

  /* ---------------------------------------------------------------- 6. lens mini-maps */
  function buildLensMinis() {
    $$('.lens-mini').forEach(function (svg) {
      var lens = svg.getAttribute('data-mini');
      var host = svg.parentNode;
      var cap = document.createElement('div');
      cap.className = 'mini-cap';
      cap.setAttribute('aria-live', 'polite');
      cap.innerHTML = '<p class="muted">select a concept</p>';
      svg.insertAdjacentElement('afterend', cap);
      // Wrap svg + caption in one column so they stack inside the two-column header.
      var col = document.createElement('div');
      col.className = 'lens-mini-col';
      host.insertBefore(col, svg); col.appendChild(svg); col.appendChild(cap);

      var cx = 190, cy = 138, rx = 128, ry = 90;
      var members = G.nodes.filter(function (n) { return n.lens === lens && n.type === 'concept'; });
      var pos = {};
      members.forEach(function (m, i) {
        var a = (-90 + i * 360 / members.length) * Math.PI / 180;
        pos[m.id] = { x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry, a: a };
      });
      var gE = svgEl('g', null, svg), gN = svgEl('g', null, svg);
      svg.appendChild(gE); svg.appendChild(gN);
      svgEl('ellipse', { class: 'deco-orbit', cx: cx, cy: cy, rx: rx, ry: ry }, gE); gE.appendChild(svgEl('ellipse', { class: 'deco-orbit', cx: cx, cy: cy, rx: rx, ry: ry }));
      var idx = 0;
      members.forEach(function (m) {
        var l = svgEl('line', { class: 'mini-edge lens-' + lens, x1: cx, y1: cy, x2: pos[m.id].x, y2: pos[m.id].y, pathLength: 1 });
        l.style.setProperty('--d', (idx++ * 110) + 'ms'); gE.appendChild(l);
      });
      G.edges.forEach(function (e) {
        if (pos[e.a] && pos[e.b]) {
          var l = svgEl('line', { class: 'mini-edge lens-' + lens + ' faint', x1: pos[e.a].x, y1: pos[e.a].y, x2: pos[e.b].x, y2: pos[e.b].y, pathLength: 1 });
          l.style.setProperty('--d', (idx++ * 110) + 'ms'); gE.appendChild(l);
        }
      });
      var lensNode = G.byId[lens];
      var core = svgEl('g', { class: 'mini-lens lens-' + lens }); gN.appendChild(core);
      core.appendChild(svgEl('circle', { class: 'shape', cx: cx, cy: cy, r: 17 }));
      core.appendChild(svgEl('circle', { class: 'core', cx: cx, cy: cy, r: 4 }));
      var lt = svgEl('text', { class: 'mini-label-t', x: cx, y: cy + 33, 'text-anchor': 'middle' }); lt.textContent = lensNode.label; core.appendChild(lt);

      members.forEach(function (m, i) {
        var p = pos[m.id];
        var g = svgEl('g', { class: 'mini-node lens-' + lens, tabindex: 0, role: 'button', 'aria-label': m.label.replace(/\n/g, ' ') + '. ' + m.tip, transform: 'translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ')' });
        g.style.setProperty('--d', (250 + i * 110) + 'ms');
        g.appendChild(svgEl('circle', { class: 'hit', r: 20 }));
        g.appendChild(svgEl('circle', { class: 'shape', r: 6.5 }));
        var cosA = Math.cos(p.a), anchor = cosA > 0.35 ? 'start' : cosA < -0.35 ? 'end' : 'middle';
        var lines = wrapLabel(m.label);
        var lx = anchor === 'start' ? 12 : anchor === 'end' ? -12 : 0;
        var ly = anchor === 'middle' ? (Math.sin(p.a) < 0 ? -12 - (lines.length - 1) * 13 : 20) : 4 - (lines.length - 1) * 6.5;
        var t = svgEl('text', { class: 'mini-t', x: lx, y: ly, 'text-anchor': anchor });
        lines.forEach(function (ln, j) { var ts = svgEl('tspan', { x: lx, dy: j === 0 ? 0 : 13 }); ts.textContent = ln; t.appendChild(ts); });
        g.appendChild(t);
        function pick() {
          $$('.mini-node', svg).forEach(function (x) { x.classList.toggle('is-selected', x === g); });
          cap.innerHTML = '<p><b>' + esc(m.label.replace(/\n/g, ' ')) + '.</b> ' + esc(m.tip) + '</p><button type="button" class="link-btn" data-goto-node="' + m.id + '">Open on the map →</button>';
        }
        g.addEventListener('click', pick);
        g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
        gN.appendChild(g);
      });
      onceVisible(svg, function () { svg.classList.add('drawn'); }, 0.3);
    });
  }

  /* ---------------------------------------------------------------- 7. move the line */
  function initLine() {
    var list = $('#defList');
    var spec = $('#spectrum');

    D.definitions.forEach(function (d) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'def-btn'; b.setAttribute('data-def', d.id);
      b.setAttribute('aria-pressed', d.id === state.def ? 'true' : 'false');
      b.innerHTML = '<span class="def-key" aria-hidden="true">' + d.key + '</span><span class="def-name">' + esc(d.name) + '</span><span class="def-sub">' + esc(d.sub) + '</span>';
      b.addEventListener('click', function () { setDefinition(d.id); });
      list.appendChild(b);
    });

    spec.innerHTML = '<div class="axis"></div><span class="axis-end axis-narrow">NARROW / SPECIALIZED</span><span class="axis-end axis-general">GENERAL / ADAPTIVE</span>' +
      '<div class="zone" aria-hidden="true"></div><div class="threshold"><span class="th-label" id="thLabel"></span></div>' +
      D.markers.map(function (m) {
        return '<div class="marker" data-id="' + m.id + '" data-side="' + m.side + '" style="--p:' + m.p + '"><span class="m-dot"></span><span class="m-stem"></span><span class="m-label"><b>' + esc(m.name) + '</b><small>' + esc(m.sub) + '</small></span></div>';
      }).join('');

    setDefinition(state.def, true);
  }

  function setDefinition(id, silent) {
    var d = D.definitions.filter(function (x) { return x.id === id; })[0];
    if (!d) { return; }
    state.def = id;
    $$('#defList .def-btn').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-def') === id ? 'true' : 'false'); });
    var spec = $('#spectrum');
    spec.style.setProperty('--t', d.t);
    $('#thLabel').textContent = d.bar;
    $$('.marker', spec).forEach(function (m) {
      var p = parseFloat(m.style.getPropertyValue('--p'));
      m.classList.toggle('is-beyond', p >= d.t);
      m.classList.toggle('is-key', d.key_markers.indexOf(m.getAttribute('data-id')) >= 0);
    });
    $('#specTags').innerHTML = '<span class="tags-label">This definition lights up:</span>' + d.tags.map(function (t) { return '<span class="spec-tag">' + esc(t) + '</span>'; }).join('');
    swap($('#defDetail'),
      '<p class="tag">Definition ' + d.key + '</p><h3 class="serif">' + esc(d.name) + ': ' + esc(d.sub) + '</h3>' +
      '<p class="def-short">' + esc(d.short) + '</p><p class="micro">' + esc(d.note) + ' ' + d.src.map(function (s) { return srcLink(s); }).join(' ') + '</p>');
  }

  /* ---------------------------------------------------------------- 8. psychology */
  function buildGTree() {
    var svg = $('#gTree');
    clear(svg);
    var top = { x: 500, y: 74 };
    var gE = svgEl('g', { class: 'gt-edges' }, svg), gA = svgEl('g', { class: 'gt-arcs' }, svg), gN = svgEl('g', { class: 'gt-nodes' }, svg);
    svg.appendChild(gE); svg.appendChild(gA); svg.appendChild(gN);
    var abilities = D.gAbilities.map(function (a, i) { return { a: a, x: 100 + i * 200, y: 262 }; });
    var tasks = [];
    abilities.forEach(function (ab, i) {
      ab.a.tasks.forEach(function (t, j) { tasks.push({ name: t, x: ab.x + (j ? 58 : -58), y: 452, ab: ab.a.id }); });
    });

    abilities.forEach(function (ab, i) {
      var p = svgEl('path', { class: 'gt-edge', d: 'M500 108 C500 ' + 175 + ' ' + ab.x + ' ' + 175 + ' ' + ab.x + ' ' + (ab.y - 26), pathLength: 1 }, gE);
      p.style.setProperty('--d', (i * 120) + 'ms'); p.setAttribute('data-ab', ab.a.id);
    });
    tasks.forEach(function (t, i) {
      var ab = abilities.filter(function (a) { return a.a.id === t.ab; })[0];
      var p = svgEl('path', { class: 'gt-edge gt-edge-task', d: 'M' + ab.x + ' ' + (ab.y + 26) + ' C' + ab.x + ' 360 ' + t.x + ' 360 ' + t.x + ' ' + (t.y - 10), pathLength: 1 }, gE);
      p.style.setProperty('--d', (500 + i * 60) + 'ms'); p.setAttribute('data-ab', t.ab);
    });
    // positive-manifold arcs: every pair of tasks. Hidden until revealed.
    var n = 0;
    for (var i = 0; i < tasks.length; i++) {
      for (var j = i + 1; j < tasks.length; j++) {
        var dx = tasks[j].x - tasks[i].x;
        var lift = 22 + Math.abs(dx) * 0.6;
        var arc = svgEl('path', { class: 'gt-arc', d: 'M' + tasks[i].x + ' ' + (tasks[i].y - 10) + ' Q' + (tasks[i].x + dx / 2) + ' ' + (tasks[i].y - 10 - lift) + ' ' + tasks[j].x + ' ' + (tasks[j].y - 10), pathLength: 1 }, gA);
        arc.style.setProperty('--d', ((n++ % 12) * 35) + 'ms');
      }
    }
    // g
    var gg = svgEl('g', { class: 'gt-g', transform: 'translate(500 74)' }, gN);
    gg.appendChild(svgEl('circle', { class: 'gt-g-halo', r: 46 }));
    gg.appendChild(svgEl('circle', { class: 'shape', r: 34 }));
    var gt = svgEl('text', { class: 'gt-g-text', x: 0, y: 10, 'text-anchor': 'middle' }); gt.textContent = 'g'; gg.appendChild(gt);
    var gl = svgEl('text', { class: 'gt-label gt-g-label', x: 60, y: 6 }); gl.textContent = 'general ability'; gg.appendChild(gl);
    var gl2 = svgEl('text', { class: 'gt-sub gt-g-sub', x: 60, y: 24 }); gl2.textContent = 'inferred, not observed directly'; gg.appendChild(gl2);

    abilities.forEach(function (ab, i) {
      var g = svgEl('g', { class: 'gt-ab', transform: 'translate(' + ab.x + ' ' + ab.y + ')', tabindex: 0, role: 'button', 'aria-pressed': 'false', 'data-ab': ab.a.id, 'aria-label': ab.a.full + ' — show example tasks' }, gN);
      g.appendChild(svgEl('circle', { class: 'hit', r: 44 }));
      g.appendChild(svgEl('circle', { class: 'shape', r: 26 }));
      var t = svgEl('text', { class: 'gt-label', x: 0, y: 48, 'text-anchor': 'middle' }); t.textContent = ab.a.name; g.appendChild(t);
      g.addEventListener('click', function () { selectAbility(ab.a.id); });
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectAbility(ab.a.id); } });
    });
    tasks.forEach(function (t) {
      var g = svgEl('g', { class: 'gt-task', transform: 'translate(' + t.x + ' ' + t.y + ')', 'data-ab': t.ab }, gN);
      g.appendChild(svgEl('circle', { class: 'shape', r: 8 }));
      var tx = svgEl('text', { class: 'gt-sub gt-task-label', x: 0, y: 30, 'text-anchor': 'middle' }); tx.textContent = t.name; g.appendChild(tx);
    });
    var wrap = svg.parentNode;
    onceVisible(svg, function () { svg.classList.add('drawn'); }, 0.3);

    $('#manifoldBtn').addEventListener('click', function () {
      state.manifold = !state.manifold;
      svg.classList.toggle('manifold', state.manifold);
      this.setAttribute('aria-pressed', state.manifold ? 'true' : 'false');
      this.textContent = state.manifold ? 'Hide the positive manifold' : 'Reveal the positive manifold';
      if (state.manifold) { selectAbility(null); }
      renderGDetail();
    });
    renderGDetail();
  }

  function selectAbility(id) {
    state.ability = (state.ability === id) ? null : id;
    var svg = $('#gTree');
    svg.classList.toggle('has-ab', !!state.ability);
    $$('.gt-ab', svg).forEach(function (g) {
      var on = g.getAttribute('data-ab') === state.ability;
      g.classList.toggle('is-selected', on); g.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    $$('[data-ab]', svg).forEach(function (el) { if (!el.classList.contains('gt-ab')) { el.classList.toggle('is-on', el.getAttribute('data-ab') === state.ability); } });
    if (state.ability && state.manifold) { state.manifold = false; svg.classList.remove('manifold'); var mb = $('#manifoldBtn'); mb.setAttribute('aria-pressed', 'false'); mb.textContent = 'Reveal the positive manifold'; }
    renderGDetail();
  }

  function renderGDetail() {
    var box = $('#gDetail');
    if (state.manifold) {
      swap(box, '<p class="mini-label">Positive manifold</p><p>Each arc is a pair of tasks. Across large samples of people, scores on almost every pair tend to correlate positively. g is the statistical summary of that overlap — it is inferred from the pattern, not measured by any one task.</p>');
    } else if (state.ability) {
      var a = D.gAbilities.filter(function (x) { return x.id === state.ability; })[0];
      swap(box, '<p class="mini-label">' + esc(a.full) + '</p><p>' + esc(a.text) + '</p><p class="muted">Example tasks: ' + esc(a.tasks.join(', ')) + '.</p>');
    } else {
      swap(box, '<p class="muted">Select a broad ability to see example tasks — or reveal the positive manifold.</p>');
    }
  }

  var ERAS = {
    early:    { gc: 88, gf: 22, text: 'Earlier language models: extremely strong-looking Gc-like abilities — fluent, knowledgeable — with weaker adaptation to genuinely novel tasks.' },
    frontier: { gc: 94, gf: 62, text: 'Frontier systems: the gap appears to be narrowing on some tests. Reported results on interactive, novel-task benchmarks such as ARC-AGI-3 are far higher than at launch — but they are sensitive to the harness around the model, so read this as a direction, not a measurement.' }
  };
  function initProfile() {
    function set(era) {
      state.era = era;
      var e = ERAS[era], early = ERAS.early;
      $$('[data-era]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-era') === era ? 'true' : 'false'); });
      $('#barGc').style.width = e.gc + '%'; $('#barGf').style.width = e.gf + '%';
      var ghost = era === 'frontier';
      $('#barGcGhost').style.width = ghost ? early.gc + '%' : '0%';
      $('#barGfGhost').style.width = ghost ? early.gf + '%' : '0%';
      $('#profileText').textContent = e.text;
    }
    $$('[data-era]').forEach(function (b) { b.addEventListener('click', function () { set(b.getAttribute('data-era')); }); });
    var bars = $('.bars');
    // start empty so the bars grow when first seen
    $('#barGc').style.width = '0%'; $('#barGf').style.width = '0%';
    onceVisible(bars, function () { set('early'); }, 0.4);
    $('#profileText').textContent = ERAS.early.text;
  }

  var META = {
    reliability: 'A system that can tell when its own answer is probably wrong can retry, check, or abstain. That is what turns a capability that works sometimes into one you can depend on.',
    horizon: 'Long tasks drift. Noticing that a plan has gone wrong, and revising it, keeps early mistakes from compounding into a failed project.',
    autonomy: 'Acting independently includes knowing when not to: recognising the edge of your own competence, and asking for help.'
  };
  function initMeta() {
    var box = $('#metaText');
    swap(box, '<p class="muted">Select a connection to see how metacognition reaches the engineering concerns of the Computer Science lens.</p>');
    $$('.meta-sat').forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-meta');
        $$('.meta-sat').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        $('#metaFig').setAttribute('data-active', k);
        swap(box, '<p class="mini-label">metacognition → ' + esc(b.textContent) + '</p><p>' + esc(META[k]) + '</p><p><button type="button" class="link-btn" data-goto-node="' + k + '">See “' + esc(b.textContent) + '” on the map →</button></p>' + srcList(['flavell']));
      });
    });
  }

  /* ---------------------------------------------------------------- 9. evolution */
  function initLoop() {
    var fig = $('#loopFig');
    var n = D.loop.length;
    var timers = [];
    var chips = document.createElement('div'); chips.className = 'step-chips'; chips.setAttribute('role', 'group'); chips.setAttribute('aria-label', 'Steps of the adaptation loop');
    D.loop.forEach(function (st, i) {
      var a = (-90 + i * 360 / n) * Math.PI / 180;
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'loop-step'; b.setAttribute('data-i', i); b.setAttribute('aria-pressed', 'false');
      b.style.setProperty('--x', (50 + Math.cos(a) * 41.5).toFixed(2) + '%');
      b.style.setProperty('--y', (50 + Math.sin(a) * 41.5).toFixed(2) + '%');
      b.setAttribute('data-side', Math.cos(a) > 0.3 ? 'r' : Math.cos(a) < -0.3 ? 'l' : (Math.sin(a) < 0 ? 't' : 'b'));
      b.innerHTML = '<span class="ls-n">' + (i + 1) + '</span><span class="ls-t">' + esc(st.name) + '</span>';
      b.addEventListener('click', function () { cancel(); pick(i); });
      fig.appendChild(b);
      var c = document.createElement('button');
      c.type = 'button'; c.className = 'chip chip-sm'; c.setAttribute('data-i', i); c.setAttribute('aria-pressed', 'false');
      c.innerHTML = '<span class="ls-n-sm">' + (i + 1) + '</span> ' + esc(st.name);
      c.addEventListener('click', function () { cancel(); pick(i); });
      chips.appendChild(c);
    });
    fig.parentNode.insertBefore(chips, fig.nextSibling);

    function cancel() { timers.forEach(clearTimeout); timers = []; $$('.loop-step', fig).forEach(function (b) { b.classList.remove('is-lit'); }); }
    function pick(i) {
      state.loopStep = i;
      $$('.loop-step,.step-chips .chip', fig.parentNode).forEach(function (b) { b.setAttribute('aria-pressed', parseInt(b.getAttribute('data-i'), 10) === i ? 'true' : 'false'); });
      var st = D.loop[i];
      swap($('#loopText'), '<p class="mini-label">Step ' + (i + 1) + ' of ' + n + '</p><h4 class="serif">' + esc(st.name) + '</h4><p>' + esc(st.text) + '</p>' +
        (st.src ? '<p class="micro">' + st.src.map(function (s) { return srcLink(s); }).join(' ') + '</p>' : '') +
        (i === 3 || i === 4 ? '<p class="caveat"><span class="caveat-mark">Developmental link</span> Children learn causal structure by intervening, not only observing (Goddu &amp; Gopnik 2024).</p>' : ''));
    }
    swap($('#loopText'), '<p class="mini-label">Adaptation loop</p><h4 class="serif">Watch it turn once, then choose any step.</h4><p class="muted">Each step is a place where a system can fail to adapt.</p>');

    // Highlight the steps in sequence once, when the loop first enters the viewport.
    onceVisible(fig, function () {
      fig.classList.add('in');
      if (reduced()) { return; }
      D.loop.forEach(function (st, i) {
        timers.push(setTimeout(function () {
          $$('.loop-step', fig).forEach(function (b, j) { b.classList.toggle('is-lit', j === i); });
          if (i === n - 1) { timers.push(setTimeout(function () { $$('.loop-step', fig).forEach(function (b) { b.classList.remove('is-lit'); }); }, 900)); }
        }, 500 + i * 620));
      });
    }, 0.45);
  }

  function initMirror() {
    var mirror = $('#mirror');
    D.pairs.forEach(function (p, i) {
      var row = document.createElement('button');
      row.type = 'button'; row.className = 'pair-row'; row.setAttribute('data-i', i); row.setAttribute('aria-pressed', 'false');
      row.innerHTML = '<span class="pcell human">' + esc(p.h) + '</span><span class="pmid" aria-hidden="true"></span><span class="pcell ai">' + esc(p.a) + '</span>';
      row.style.setProperty('--i', i);
      row.addEventListener('click', function () { pickPair(i); });
      mirror.appendChild(row);
    });
    function pickPair(i) {
      state.pair = i;
      $$('.pair-row', mirror).forEach(function (r) { r.setAttribute('aria-pressed', parseInt(r.getAttribute('data-i'), 10) === i ? 'true' : 'false'); });
      var p = D.pairs[i];
      swap($('#pairNote'), '<p class="mini-label">' + esc(p.h) + ' ↔ ' + esc(p.a) + '</p><p>' + esc(p.note) + '</p><p class="micro"><span class="badge badge-sm">Analogy, not equivalence</span> ' + (p.src ? p.src.map(function (s) { return srcLink(s); }).join(' ') : '') + '</p>');
    }
    swap($('#pairNote'), '<p class="muted">select any pair to read what the analogy does — and does not — claim</p>');
    onceVisible(mirror, function () { mirror.classList.add('in'); }, 0.25);
  }

  function initChains() {
    function build(kind, ol) {
      var items = D.chains[kind];
      items.forEach(function (it, i) {
        var li = document.createElement('li');
        li.style.setProperty('--k', ((i + 1) / items.length).toFixed(3));
        var b = document.createElement('button');
        b.type = 'button'; b.setAttribute('data-chain', kind); b.setAttribute('data-i', i); b.setAttribute('aria-expanded', 'false');
        b.innerHTML = '<span class="cn-i">' + (i + 1) + '</span>' + esc(it.n);
        b.addEventListener('click', function () { pick(kind, i); });
        li.appendChild(b); ol.appendChild(li);
      });
    }
    build('human', $('#chainHuman'));
    build('ai', $('#chainAi'));
    function pick(kind, i) {
      var same = state.chain && state.chain.kind === kind && state.chain.i === i;
      state.chain = same ? null : { kind: kind, i: i };
      $$('.chain button').forEach(function (b) {
        var on = !!state.chain && b.getAttribute('data-chain') === kind && parseInt(b.getAttribute('data-i'), 10) === i && !same;
        b.setAttribute('aria-expanded', on ? 'true' : 'false');
      });
      if (same) { swap($('#chainDetail'), '<p class="muted">select a step to expand it</p>'); return; }
      var it = D.chains[kind][i];
      swap($('#chainDetail'), '<p class="mini-label">' + (kind === 'human' ? 'Human' : 'AI system') + ' · step ' + (i + 1) + '</p><h4 class="serif">' + esc(it.n) + '</h4><p>' + esc(it.t) + '</p>' +
        (it.src ? '<p class="micro">' + it.src.map(function (s) { return srcLink(s); }).join(' ') + '</p>' : '') +
        (kind === 'ai' ? '<p class="caveat"><span class="caveat-mark">Analogy, not equivalence</span> AI tools and scaffolds are not the same thing as human culture. The question is what belongs inside the boundary of the evaluated system.</p>' : ''));
    }
    onceVisible($('.chains'), function () { $('.chains').classList.add('in'); }, 0.3);

    function setDistinct(k) {
      state.distinct = k;
      $$('[data-distinct]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-distinct') === k ? 'true' : 'false'); });
      var d = D.distinct[k];
      swap($('#distinctText'), '<h4 class="serif">' + esc(d.name) + '</h4><p>' + esc(d.text) + '</p><p class="micro">' + d.src.map(function (s) { return srcLink(s); }).join(' ') + '</p>');
    }
    $$('[data-distinct]').forEach(function (b) { b.addEventListener('click', function () { setDistinct(b.getAttribute('data-distinct')); }); });
    setDistinct('cultural');
  }

  /* ---------------------------------------------------------------- 10. computer science */
  function initHex() {
    var fig = $('#hexFig'), svg = $('#hexSvg');
    var n = D.dimensions.length, cx = 50, cy = 50, rad = 30;
    var pts = D.dimensions.map(function (d, i) { var a = (-90 + i * 60) * Math.PI / 180; return { x: cx + Math.cos(a) * rad, y: cy + Math.sin(a) * rad, a: a }; });
    // hexagon outline, axes and one faint inner hexagon. No tick values on purpose.
    svgEl('polygon', { class: 'hex-out', points: pts.map(function (p) { return p.x.toFixed(2) + ',' + p.y.toFixed(2); }).join(' ') }, svg);
    svgEl('polygon', { class: 'hex-in', points: pts.map(function (p) { return (cx + (p.x - cx) * 0.5).toFixed(2) + ',' + (cy + (p.y - cy) * 0.5).toFixed(2); }).join(' ') }, svg);
    pts.forEach(function (p, i) { var l = svgEl('line', { class: 'hex-axis', x1: cx, y1: cy, x2: p.x, y2: p.y, pathLength: 1 }, svg); l.style.setProperty('--d', (i * 90) + 'ms'); });
    var chips = document.createElement('div'); chips.className = 'step-chips'; chips.setAttribute('role', 'group'); chips.setAttribute('aria-label', 'Dimensions');
    D.dimensions.forEach(function (d, i) {
      var p = pts[i];
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'hex-node'; b.setAttribute('data-i', i); b.setAttribute('aria-pressed', 'false');
      b.style.setProperty('--x', (cx + Math.cos(p.a) * 30).toFixed(2) + '%'); b.style.setProperty('--y', (cy + Math.sin(p.a) * 30).toFixed(2) + '%');
      b.setAttribute('data-side', Math.cos(p.a) > 0.3 ? 'r' : Math.cos(p.a) < -0.3 ? 'l' : (Math.sin(p.a) < 0 ? 't' : 'b'));
      b.innerHTML = '<span class="hn-dot">' + (i + 1) + '</span><span class="hn-t">' + esc(d.name) + '</span>';
      b.addEventListener('click', function () { pick(i); });
      fig.appendChild(b);
      var c = document.createElement('button');
      c.type = 'button'; c.className = 'chip chip-sm'; c.setAttribute('data-i', i); c.setAttribute('aria-pressed', 'false');
      c.innerHTML = '<span class="ls-n-sm">' + (i + 1) + '</span> ' + esc(d.name);
      c.addEventListener('click', function () { pick(i); });
      chips.appendChild(c);
    });
    fig.parentNode.insertBefore(chips, fig.nextSibling);

    function pick(i) {
      state.dim = i;
      $$('.hex-node,.step-chips .chip', fig.parentNode).forEach(function (b) { b.setAttribute('aria-pressed', parseInt(b.getAttribute('data-i'), 10) === i ? 'true' : 'false'); });
      var d = D.dimensions[i];
      var bench = G.byId[d.benchId];
      swap($('#hexPanel'),
        '<div class="panel-inner"><p class="kind" style="color:var(--cs)">Dimension ' + (i + 1) + ' of ' + n + '</p><h3 class="serif">' + esc(d.name) + '</h3>' +
        '<p class="def">' + esc(d.def) + '</p>' +
        '<div class="psec"><p class="mini-label">Evidence type</p><p>' + esc(d.evidence) + '</p></div>' +
        '<div class="psec"><p class="mini-label">Most relevant benchmark</p><p>' + esc(d.bench) + ' <button type="button" class="link-btn" data-goto-node="' + d.benchId + '">see on the map →</button></p></div>' +
        '<div class="psec psec-cannot"><p class="mini-label">What it still cannot prove</p><p>' + esc(d.cannot) + '</p></div>' +
        (d.bridge ? '<p><button type="button" class="btn-ghost" data-goto-node="' + d.bridge + '">Bridge back to Psychology: metacognition →</button></p>' : '') +
        '<p class="micro">' + (bench && bench.src ? bench.src.slice(0, 1).map(function (s) { return srcLink(s); }).join(' ') : '') + '</p></div>');
    }
    swap($('#hexPanel'), '<div class="panel-inner"><p class="mini-label">Select a dimension</p><h3 class="serif">Six dimensions. No total.</h3><p>Each one has its own evidence, and its own blind spot. Select one to see the definition, the benchmark that speaks to it most directly, and what that benchmark cannot show.</p></div>');
    onceVisible(fig, function () { fig.classList.add('in'); }, 0.35);
  }

  /* ---------------------------------------------------------------- 11. evidence orbit */
  function selectCard(id) {
    var c = D.cards.filter(function (x) { return x.id === id; })[0];
    if (!c) { return; }
    state.card = id;
    $$('.orbit-node').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-card') === id ? 'true' : 'false'); });
    var html = '<p class="kind">Evidence</p><h3 class="serif">' + esc(c.name) + '</h3><p class="card-label">' + esc(c.label) + '</p>' +
      (c.stat ? '<p class="stat"><span class="num-tab">' + esc(c.stat) + '</span> ' + srcLink(c.statSrc) + '</p><p class="statnote">' + esc(c.statLabel) + '</p>' : '') +
      '<ul class="bul">' + c.bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>' +
      '<div class="not"><p class="mini-label">What it does not establish</p><p>' + esc(c.not) + '</p></div>' +
      (c.go ? '<p><button type="button" class="btn-ghost" data-go="' + c.go + '">' + esc(c.goText) + '</button></p>' : '') +
      '<div class="psec"><p class="mini-label">Sources</p>' + srcList(c.src) + '</div>';
    swap($('#evCard'), html);
  }
  function initOrbit() {
    var fig = $('#orbitFig');
    var angles = [-140, -40, 40, 140];
    D.cards.forEach(function (c, i) {
      var a = angles[i] * Math.PI / 180;
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'orbit-node'; b.setAttribute('data-card', c.id); b.setAttribute('aria-pressed', 'false');
      b.style.setProperty('--x', (50 + Math.cos(a) * 41).toFixed(2) + '%'); b.style.setProperty('--y', (50 + Math.sin(a) * 38).toFixed(2) + '%');
      b.innerHTML = '<span class="on-d" aria-hidden="true"></span><span class="on-t">' + esc(c.short) + '</span><span class="on-s">' + esc(c.label) + '</span>';
      b.addEventListener('click', function () { selectCard(c.id); });
      fig.appendChild(b);
    });
    selectCard('hle');
    onceVisible(fig, function () { fig.classList.add('in'); }, 0.35);
  }

  /* ---------------------------------------------------------------- 12. system boundary */
  function initBoundary() {
    var svg = $('#ringsSvg');
    var cx = 200, cy = 200;
    var radii = [70, 95, 120, 145, 170, 195];   // ring i; the model sits at the centre
    svgEl('circle', { class: 'ring-model', cx: cx, cy: cy, r: 46 }, svg);
    D.rings.forEach(function (rg, i) {
      var g = svgEl('g', { class: 'ring' + (rg.diff ? ' ring-diff' : ''), 'data-ring': rg.id, style: '--i:' + i }, svg);
      g.appendChild(svgEl('circle', { class: 'ring-line', cx: cx, cy: cy, r: radii[i] - 12 }));
      g.appendChild(svgEl('circle', { class: 'ring-hit', cx: cx, cy: cy, r: radii[i] - 12 }));
      var a = -38 * Math.PI / 180;
      var bx = cx + Math.cos(a) * (radii[i] - 12), by = cy + Math.sin(a) * (radii[i] - 12);
      g.appendChild(svgEl('circle', { class: 'ring-tag', cx: bx.toFixed(1), cy: by.toFixed(1), r: 9 }));
      var t = svgEl('text', { class: 'ring-num', x: bx.toFixed(1), y: (by + 4).toFixed(1), 'text-anchor': 'middle' }); t.textContent = i + 1; g.appendChild(t);
      g.addEventListener('click', function () { pickRing(rg.id); });
    });
    var name = svgEl('text', { class: 'model-name', x: cx, y: cy - 2, 'text-anchor': 'middle' }, svg); name.textContent = 'GPT-6';
    var name2 = svgEl('text', { class: 'model-name', x: cx, y: cy + 15, 'text-anchor': 'middle' }, svg); name2.textContent = 'Astra';

    var list = $('#ringList');
    D.rings.forEach(function (rg, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'chip'; b.setAttribute('data-ring', rg.id); b.setAttribute('aria-pressed', 'false');
      b.innerHTML = '<span class="ls-n-sm">' + (i + 1) + '</span> ' + esc(rg.name);
      b.addEventListener('click', function () { pickRing(rg.id); });
      list.appendChild(b);
    });
    function pickRing(id) {
      state.ring = state.ring === id ? null : id;
      $$('[data-ring]').forEach(function (el) {
        var on = el.getAttribute('data-ring') === state.ring;
        el.classList.toggle('is-selected', on);
        if (el.tagName === 'BUTTON') { el.setAttribute('aria-pressed', on ? 'true' : 'false'); }
      });
      var rg = D.rings.filter(function (r) { return r.id === state.ring; })[0];
      $('#ringText').innerHTML = rg ? '<b>' + esc(rg.name) + '.</b> ' + esc(rg.text) : 'Six layers could all be called “the system.” Where you draw the boundary changes what the score is a score of.';
    }
    pickRing(null);

    $$('#boundaryToggle button').forEach(function (b) {
      b.addEventListener('click', function () { setMode(b.getAttribute('data-mode')); });
    });
    setMode('standard', true);
    onceVisible(svg, function () { svg.classList.add('in'); }, 0.3);
  }

  function setMode(mode, silent) {
    var m = D.boundaryModes[mode], prev = D.boundaryModes[state.mode];
    $$('#boundaryToggle button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-mode') === mode ? 'true' : 'false'); });
    $('#scorePrefix').textContent = mode === 'adapter' ? '≈' : '';
    if (!silent) { animateNumber($('#scoreNum'), prev.score, m.score, 800, 1); } else { $('#scoreNum').textContent = m.score.toFixed(1); }
    $('#scoreNote').textContent = m.note;
    state.mode = mode;
    $('#ringsSvg').classList.toggle('mode-adapter', mode === 'adapter');
    $('.b-layout').setAttribute('data-mode', mode);
  }

  /* ---------------------------------------------------------------- 13. same AI, different verdict */
  function initVerdict() {
    var box = $('#radial'), svg = $('#radialSvg');
    var n = D.criteria.length;
    D.criteria.forEach(function (c, i) {
      var a = (-90 + i * 360 / n) * Math.PI / 180;
      var x = 50 + Math.cos(a) * 33, y = 50 + Math.sin(a) * 39;
      var ln = svgEl('line', { class: 'r-line', x1: 50, y1: 50, x2: x.toFixed(2), y2: y.toFixed(2), 'data-id': c.id, 'vector-effect': 'non-scaling-stroke', pathLength: 1 }, svg);
      ln.style.setProperty('--d', (i * 130) + 'ms');
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'r-node'; b.setAttribute('data-id', c.id); b.setAttribute('aria-pressed', 'false');
      b.style.setProperty('--x', x.toFixed(2) + '%'); b.style.setProperty('--y', y.toFixed(2) + '%');
      b.innerHTML = '<span class="r-n">' + (i + 1) + '</span><span class="r-t">' + esc(c.name) + '</span>';
      b.addEventListener('click', function () { pick(c.id); });
      box.appendChild(b);
    });
    function pick(id) {
      state.verdict = id;
      var c = D.criteria.filter(function (x) { return x.id === id; })[0];
      $$('.r-node', box).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-id') === id ? 'true' : 'false'); });
      $$('.r-line', svg).forEach(function (l) { l.classList.toggle('is-on', l.getAttribute('data-id') === id); });
      swap($('#vCard'), '<p class="kind">Criterion</p><h3 class="serif">' + esc(c.name) + '</h3>' +
        '<p class="state">' + esc(c.state) + '</p><p>' + esc(c.text) + '</p>' +
        (c.src ? '<p class="micro">' + c.src.map(function (s) { return srcLink(s); }).join(' ') + '</p>' : '') +
        '<p class="muted verdict-note">This map does not turn the five states into a single verdict.</p>');
    }
    pick('broad');
    onceVisible(box, function () { box.classList.add('in'); }, 0.3);
  }

  /* ---------------------------------------------------------------- 14. build your own definition */
  var BSVG = { built: false, els: {} };

  function initBuilder() {
    var list = $('#critList');
    D.builder.forEach(function (c, i) {
      var lab = document.createElement('label');
      lab.className = 'crit-item';
      lab.innerHTML = '<input type="checkbox" value="' + c.id + '"><span class="crit-n" aria-hidden="true">' + (i + 1) + '</span><span class="crit-t">' + esc(c.name) + '</span><span class="crit-sw" aria-hidden="true"></span>';
      $('input', lab).addEventListener('change', function (e) { state.crit[c.id] = e.target.checked; renderBuilder(); });
      list.appendChild(lab);
    });
    $('#builderReset').addEventListener('click', function () { setCriteria([]); });
    $$('[data-preset]').forEach(function (b) {
      b.addEventListener('click', function () {
        var p = b.getAttribute('data-preset');
        setCriteria(p === 'capability' ? ['breadth'] : p === 'adaptation' ? ['learning', 'selfcorrect'] : ['autonomy', 'selfcorrect']);
      });
    });
    buildBuilderSvg();
    renderBuilder();
  }

  function setCriteria(ids) {
    state.crit = {};
    ids.forEach(function (id) { state.crit[id] = true; });
    $$('#critList input').forEach(function (i) { i.checked = !!state.crit[i.value]; });
    renderBuilder();
  }

  /* The builder constellation is drawn once with every possible criterion node
     "ghosted"; toggling a criterion switches CSS classes so it lights up and its
     lines draw to the lenses it relates to. */
  function buildBuilderSvg() {
    var svg = $('#builderSvg');
    clear(svg);
    var C = { x: 300, y: 235 };
    var lensPos = { psych: { x: 70, y: 66 }, cs: { x: 530, y: 66 }, evo: { x: 300, y: 438 } };
    var gE = svgEl('g', null, svg), gN = svgEl('g', null, svg);
    svg.appendChild(gE); svg.appendChild(gN);
    gE.appendChild(svgEl('ellipse', { class: 'deco-orbit', cx: C.x, cy: C.y, rx: 175, ry: 118 }));
    gE.appendChild(svgEl('ellipse', { class: 'deco-orbit', cx: C.x, cy: C.y, rx: 255, ry: 175, 'stroke-dasharray': '2 7' }));

    ['psych', 'cs', 'evo'].forEach(function (l) {
      var p = lensPos[l];
      var g = svgEl('g', { class: 'b-lens lens-' + l, transform: 'translate(' + p.x + ' ' + p.y + ')' }, gN);
      g.appendChild(svgEl('circle', { class: 'shape', r: 17 })); g.appendChild(svgEl('circle', { class: 'core', r: 4 }));
      var t = svgEl('text', { class: 'b-lens-t', x: 0, y: l === 'evo' ? 34 : -25, 'text-anchor': 'middle' }); t.textContent = G.byId[l].label; g.appendChild(t);
      BSVG.els[l] = g;
    });
    var cg = svgEl('g', { class: 'b-center', transform: 'translate(' + C.x + ' ' + C.y + ')' }, gN);
    cg.appendChild(svgEl('circle', { class: 'shape', r: 30 }));
    var ct = svgEl('text', { class: 'b-center-t', x: 0, y: -2, 'text-anchor': 'middle' }); ct.textContent = 'YOUR'; cg.appendChild(ct);
    var ct2 = svgEl('text', { class: 'b-center-t', x: 0, y: 11, 'text-anchor': 'middle' }); ct2.textContent = 'DEFINITION'; cg.appendChild(ct2);

    D.builder.forEach(function (c, i) {
      var a = c.ang * Math.PI / 180;
      var x = C.x + Math.cos(a) * 175, y = C.y + Math.sin(a) * 118;
      var edges = [];
      var dashed = c.evidence.length === 0;
      // edge to centre
      var e0 = svgEl('path', { class: 'b-edge b-edge-c' + (dashed ? ' dashed' : ''), d: 'M' + x.toFixed(1) + ' ' + y.toFixed(1) + 'L' + C.x + ' ' + C.y, pathLength: 1 }, gE);
      edges.push(e0);
      c.lenses.forEach(function (l) {
        var p = lensPos[l];
        var mx = (x + p.x) / 2, my = (y + p.y) / 2, dx = p.x - x, dy = p.y - y;
        var e = svgEl('path', { class: 'b-edge lens-' + l + (dashed ? ' dashed' : ''), d: 'M' + x.toFixed(1) + ' ' + y.toFixed(1) + 'Q' + (mx - dy * 0.1).toFixed(1) + ' ' + (my + dx * 0.1).toFixed(1) + ' ' + p.x + ' ' + p.y, pathLength: 1 }, gE);
        edges.push(e);
      });
      var g = svgEl('g', { class: 'b-crit', transform: 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')' }, gN);
      g.appendChild(svgEl('circle', { class: 'shape', r: 12 }));
      var nt = svgEl('text', { class: 'b-crit-n', x: 0, y: 4, 'text-anchor': 'middle' }); nt.textContent = i + 1; g.appendChild(nt);
      var lx = Math.cos(a) > 0.3 ? 20 : Math.cos(a) < -0.3 ? -20 : 0;
      var lt = svgEl('text', { class: 'b-crit-t', x: lx, y: Math.abs(Math.cos(a)) <= 0.3 ? (Math.sin(a) < 0 ? -20 : 30) : 4, 'text-anchor': lx > 0 ? 'start' : lx < 0 ? 'end' : 'middle' });
      lt.textContent = c.short; g.appendChild(lt);
      BSVG.els[c.id] = { g: g, edges: edges };
    });
    BSVG.built = true;
  }

  function summarize(sel) {
    var has = function (id) { return !!sel[id]; };
    var ids = Object.keys(sel).filter(function (k) { return sel[k]; });
    var out = { type: '', paras: [], evidence: '' };
    if (!ids.length) {
      out.paras.push('<p class="muted">Choose one or more criteria to build a definition. The constellation will grow, and a summary will appear here.</p>');
      return out;
    }
    var fam = [];
    if (has('breadth')) { fam.push('capability'); }
    if (has('learning')) { fam.push('adaptation'); }
    if (has('autonomy')) { fam.push('agency'); }
    if (has('selfcorrect')) { fam.push('self-monitoring'); }
    if (has('social')) { fam.push('social'); }
    if (has('embodied')) { fam.push('embodied'); }
    if (has('conscious')) { fam.push('phenomenal'); }
    out.type = fam.length === 1 ? fam[0] + '-centered definition'
      : fam.length === 2 ? fam[0] + ' + ' + fam[1] + ' definition'
      : 'Composite definition · ' + fam.length + ' kinds of criteria';
    out.type = out.type.charAt(0).toUpperCase() + out.type.slice(1);

    var onlyBreadth = has('breadth') && ids.length === 1;
    if (onlyBreadth) { out.paras.push('Your definition is capability-centered. Under definitions like this, several traditional AGI thresholds look much closer — and some lower thresholds may already have been crossed.'); }
    if (has('learning')) { out.paras.push('Your definition is adaptation-centered. ARC-style evidence becomes more important than static knowledge benchmarks.'); }
    if (has('autonomy')) { out.paras.push('Your definition requires not just intelligence, but dependable agency over time. Long-horizon and reliability evidence becomes decisive.'); }
    if (has('selfcorrect')) { out.paras.push('Requiring error detection and self-correction ties psychology’s metacognition to computer science’s reliability: it asks whether a system can notice when it is wrong.'); }
    if (has('social')) { out.paras.push('Requiring social adaptation brings the cultural side of intelligence into view — something most benchmarks on this map touch only indirectly.'); }
    if (has('embodied')) { out.paras.push('Your definition requires interaction with the physical world, which is stricter than many capability-based AGI definitions.'); }
    if (has('conscious')) { out.paras.push('Your definition includes a criterion that current behavioural benchmarks do not know how to establish.'); }
    if (ids.length >= 4) { out.paras.push('Requiring several criteria at once is a stricter definition: each one you add narrows what could count, and for some of them the map has no benchmark at all.'); }

    var ev = [], none = [];
    D.builder.forEach(function (c) {
      if (!has(c.id)) { return; }
      if (c.evidence.length) { c.evidence.forEach(function (e) { if (ev.indexOf(e) < 0) { ev.push(e); } }); } else { none.push(c.short.toLowerCase()); }
    });
    var parts = [];
    if (ev.length) { parts.push('Evidence on this map that speaks to your criteria: <b>' + ev.map(function (e) { return D.evidenceNames[e]; }).join(', ') + '</b>.'); }
    if (none.length) { parts.push('Nothing on this map speaks to: <b>' + none.join(', ') + '</b>.'); }
    out.evidence = parts.join(' ');
    return out;
  }

  function renderBuilder() {
    var sel = state.crit;
    D.builder.forEach(function (c) {
      var on = !!sel[c.id], o = BSVG.els[c.id];
      o.g.classList.toggle('on', on);
      o.edges.forEach(function (e) { e.classList.toggle('on', on); });
    });
    ['psych', 'evo', 'cs'].forEach(function (l) {
      var lit = D.builder.some(function (c) { return sel[c.id] && c.lenses.indexOf(l) >= 0; });
      BSVG.els[l].classList.toggle('lit', lit);
    });
    var count = Object.keys(sel).filter(function (k) { return sel[k]; }).length;
    $('.b-center').classList.toggle('lit', count > 0);
    var s = summarize(sel);
    $('#sumType').textContent = count ? s.type + ' · ' + count + ' of 7 criteria' : 'No criteria yet';
    swap($('#sumText'), s.paras.map(function (p) { return p.charAt(0) === '<' ? p : '<p>' + p + '</p>'; }).join(''));
    $('#sumEvidence').innerHTML = s.evidence;
  }

  /* ---------------------------------------------------------------- 15. final answer */
  function initFinal() {
    buildSky($('#finalSky'), { labels: false, k: 12, seed: 11 });
    var reframe = $('#reframe');
    $$('[data-final]').forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-final');
        state.final = k;
        $$('[data-final]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        $('#cmpFirst').textContent = state.first ? ANSWER_FIRST[state.first] : '— (not answered)';
        $('#cmpFinal').textContent = ANSWER_FINAL[k];
        $('#cmpFinalRow').hidden = false;
        var note = '';
        if (state.first === 'yes' && k === 'yes' || state.first === 'no' && k === 'no') { note = 'Same answer as before. The map asks whether it rests on the same definition.'; }
        else if (state.first === 'unsure' && k === 'depends') { note = 'From “not sure” to “it depends” — perhaps now with a sense of what it depends on.'; }
        else if (state.first) { note = 'Your answer moved. Which definition moved it?'; }
        $('#cmpNote').textContent = note;
        reframe.classList.add('shown');
      });
    });
    $('#cmpFirst').textContent = '—';
    var skip = $('#finalSkip');
    if (skip) { skip.addEventListener('click', function () { reframe.classList.add('shown'); }); }
  }

  /* ---------------------------------------------------------------- 16. sources */
  function initSources() {
    var groups = [
      { title: 'Definitions / Computer Science', ids: ['morris', 'chollet', 'arcLaunch', 'arcAstra', 'arcBlog', 'hle', 'metr', 'turing'] },
      { title: 'Psychology / Cognitive Science', ids: ['spelke', 'goddu', 'cantlon'] },
      { title: 'Evolution / Culture', ids: ['herrmann'] },
      { title: 'Background references for g, Gf/Gc, positive manifold, metacognition', ids: ['spearman', 'cattell', 'carroll', 'flavell'], note: 'Standard psychometrics framing. Cited without links because no DOI was verified.' }
    ];
    $('#srcGroups').innerHTML = groups.map(function (g) {
      return '<section class="src-group reveal"><h3 class="serif">' + esc(g.title) + '</h3>' + (g.note ? '<p class="muted">' + esc(g.note) + '</p>' : '') + '<ol class="src-rows">' +
        g.ids.map(function (id) {
          var s = D.sources[id];
          return '<li><p class="src-cite">' + esc(s.cite) + '</p><p class="src-full">' + esc(s.full) + '</p><p class="src-use"><span>Used for</span> ' + esc(s.use) + '</p>' +
            (s.url ? '<a class="src-url" href="' + s.url + '" target="_blank" rel="noopener noreferrer">' + esc(s.url.replace(/^https?:\/\//, '')) + ' ↗</a>' : '') + '</li>';
        }).join('') + '</ol></section>';
    }).join('');
  }

  /* ---------------------------------------------------------------- 17. reduced motion + boot */
  var raf = 0;
  function frame(t) {
    if (!reduced()) { parallaxTick(); mapTick(t); }
    raf = requestAnimationFrame(frame);
  }
  function startLoop() { if (!raf) { raf = requestAnimationFrame(frame); } }
  function stopLoop() {
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    // return everything to its resting position
    if (bgLayer) { bgLayer.style.transform = ''; }
    parallaxTargets.forEach(function (t) { t.el.style.transform = ''; });
    G.nodes.forEach(function (n) { n.px = n.x; n.py = n.y; n.ox = n.oy = 0; n.el.setAttribute('transform', 'translate(' + n.x + ' ' + n.y + ')'); });
    G.edges.forEach(function (e) { e.el.setAttribute('d', edgePath(e)); });
  }
  function onMotionChange() {
    document.documentElement.classList.toggle('reduce-motion', reduced());
    if (reduced()) { stopLoop(); } else { startLoop(); }
  }

  function boot() {
    document.documentElement.classList.toggle('reduce-motion', reduced());
    buildStars();
    initPointer();
    initNav();
    initReveal();
    initGotos();
    initHero();
    initLine();
    buildMap();
    initPanelEvents();
    buildLensMinis();
    buildGTree();
    initProfile();
    initMeta();
    initLoop();
    initMirror();
    initChains();
    initHex();
    initOrbit();
    initBoundary();
    initVerdict();
    initBuilder();
    initFinal();
    initSources();
    initReveal();   // pick up elements created by the sources renderer

    if (motionQuery.addEventListener) { motionQuery.addEventListener('change', onMotionChange); }
    else if (motionQuery.addListener) { motionQuery.addListener(onMotionChange); }
    if (!reduced()) { startLoop(); }
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', boot); } else { boot(); }
})();
