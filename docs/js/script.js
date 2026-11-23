/* The AppSec Dispatch: page behaviour. No dependencies. Settings live in config.js. */
(function () {
  'use strict';

  var CFG = window.PORTFOLIO_CONFIG || {};
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var OPEN_LABEL = 'Collapse', CLOSED_LABEL = 'Continue reading →';

  /* ------------------------------------------------------------------ *
   * Masthead volume: years of experience (Roman) · extra months
   * ------------------------------------------------------------------ */
  function volume() {
    var now = new Date();
    var toM = function (s) { if (!s) return now.getFullYear() * 12 + now.getMonth(); var p = s.split('-'); return +p[0] * 12 + (+p[1] - 1); };
    var months = (CFG.experience || []).reduce(function (t, s) { return t + Math.max(0, toM(s[1]) - toM(s[0])); }, 0);
    var yrs = Math.floor(months / 12), mos = months % 12, n = yrs, r = '';
    [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']].forEach(function (p) { while (n >= p[0]) { r += p[1]; n -= p[0]; } });
    $$('[data-js=volno]').forEach(function (el) {
      el.textContent = 'Vol. ' + r + ' · No. ' + mos;
      el.title = yrs + ' years ' + mos + ' months of experience';
    });
  }

  /* ------------------------------------------------------------------ *
   * Expand / collapse: work history, case studies, features, skills
   * ------------------------------------------------------------------ */
  function setPanel(panel, label, ctl, open, labels) {
    if (panel) panel.hidden = !open;
    if (label) label.textContent = open ? (labels ? labels[0] : OPEN_LABEL) : (labels ? labels[1] : CLOSED_LABEL);
    if (ctl) ctl.setAttribute('aria-expanded', String(open));
  }

  // Work history ("The record")
  var jobs = $$('[data-js=job]');
  function setJob(job, open) { setPanel($('[data-js=job-more]', job), $('[data-js=job-label]', job), job, open); }
  function jobOpen(job) { return !$('[data-js=job-more]', job).hidden; }
  function syncJobsAll() { var b = $('[data-js=jobs-all]'); if (b) b.textContent = jobs.every(jobOpen) ? 'Collapse all' : 'Open all entries'; }
  jobs.forEach(function (job) {
    var toggle = function () { setJob(job, !jobOpen(job)); syncJobsAll(); };
    job.addEventListener('click', toggle);
    job.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });
  var jobsAll = $('[data-js=jobs-all]');
  if (jobsAll) jobsAll.addEventListener('click', function () { var all = jobs.every(jobOpen); jobs.forEach(function (j) { setJob(j, !all); }); syncJobsAll(); });

  // Case studies ("Lessons")
  var cases = $$('[data-js=case]');
  function setCase(c, open) { setPanel($('[data-js=case-more]', c), $('[data-js=case-label]', c), $('[data-js=case-toggle]', c), open); }
  function caseOpen(c) { return !$('[data-js=case-more]', c).hidden; }
  function syncCasesAll() { var b = $('[data-js=cases-all]'); if (b) b.textContent = cases.every(caseOpen) ? 'Fold all stories' : 'Read all stories'; }
  cases.forEach(function (c) {
    $('[data-js=case-toggle]', c).addEventListener('click', function () { setCase(c, !caseOpen(c)); syncCasesAll(); });
  });
  var casesAll = $('[data-js=cases-all]');
  if (casesAll) casesAll.addEventListener('click', function () { var all = cases.every(caseOpen); cases.forEach(function (c) { setCase(c, !all); }); syncCasesAll(); });

  // Features ("Continue reading")
  $$('[data-js=feat-toggle]').forEach(function (btn) {
    var more = $('[data-js=feat-more]', btn.closest('article'));
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function () { setPanel(more, btn, btn, more.hidden); });
  });

  // Skills groups (+ / −)
  $$('[data-js=skill-toggle]').forEach(function (btn) {
    var items = $$('[data-js=skill-item]', btn.parentElement), icon = $('[data-js=skill-icon]', btn);
    btn.addEventListener('click', function () {
      var open = items.length && items[0].hidden;
      items.forEach(function (i) { i.hidden = !open; });
      if (icon) icon.textContent = open ? '−' : '+';
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  /* ------------------------------------------------------------------ *
   * In-page links: open a case study before scrolling to it
   * ------------------------------------------------------------------ */
  function goTo(id) {
    var el = document.getElementById(id);
    if (!el) return false;
    if (el.matches('[data-js=case]') && !caseOpen(el)) { setCase(el, true); syncCasesAll(); }
    setTimeout(function () {
      // offsetTop ignores the reveal animation's transforms, so the target is exact
      var y = 0; for (var n = el; n; n = n.offsetParent) y += n.offsetTop;
      window.scrollTo({ top: y - 24, behavior: 'smooth' });
      history.replaceState(null, '', '#' + id);
    }, 60);
    return true;
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').length < 2) return;
    if (goTo(decodeURIComponent(a.getAttribute('href').slice(1)))) e.preventDefault();
  });
  if (location.hash.length > 1) window.addEventListener('load', function () { goTo(decodeURIComponent(location.hash.slice(1))); });

  /* ------------------------------------------------------------------ *
   * Front-page headline: each line sized to the full column width
   * ------------------------------------------------------------------ */
  function fit() {
    $$('[data-fit]').forEach(function (s) {
      s.style.fontSize = '';
      var w = s.parentElement.clientWidth, sw = s.offsetWidth;
      if (w && sw) s.style.fontSize = Math.min(84, parseFloat(getComputedStyle(s).fontSize) * w / sw * 0.995) + 'px';
    });
  }

  /* ------------------------------------------------------------------ *
   * Floating "In this edition" index: highlights the current section
   * and is clipped to the page it sits over (split across page breaks)
   * ------------------------------------------------------------------ */
  var nav = $('#floatnav nav'), wrap = $('#floatnav');
  function place() { var fs = $('[data-grid][data-reveal]'); if (wrap && fs) wrap.style.top = fs.offsetTop + 'px'; }
  function clipTo(el, bands) {
    var nt = el.getBoundingClientRect().top, nh = el.offsetHeight, segs = [];
    bands.forEach(function (b) { var a = Math.max(0, Math.round(b.top - nt)), z = Math.min(nh, Math.round(b.bot - nt)); if (z > a) segs.push([a, z]); });
    var o = segs.length ? 1 : 0;
    if (el._o !== o) { el._o = o; el.style.opacity = o; el.style.pointerEvents = o ? 'auto' : 'none'; }
    var cp = !segs.length ? 'inset(0 0 100% 0)' : (segs.length === 1 && segs[0][0] === 0 && segs[0][1] >= nh) ? 'none'
      : 'polygon(' + segs.map(function (s) { return '0 ' + s[0] + 'px,100% ' + s[0] + 'px,100% ' + s[1] + 'px,0 ' + s[1] + 'px'; }).join(',') + ')';
    if (el._cp !== cp) { el._cp = cp; el.style.clipPath = cp; el.style.webkitClipPath = cp; }
  }
  function mark() {
    var ids = ['#top', '#cv', '#skills', '#work', '#off-cv', '#kind-words', '#contact'], cur = ids[0];
    ids.forEach(function (h) { var el = $(h); if (el && el.getBoundingClientRect().top < 160) cur = h; });
    $$('[data-navlink]').forEach(function (a) { var c = a.getAttribute('data-navlink') === cur ? '#0f766e' : '#151412'; if (a._c !== c) { a._c = c; a.style.color = c; } });
    if (!nav || !wrap || getComputedStyle(wrap).display === 'none') return;
    var w = wrap.getBoundingClientRect(), vh = window.innerHeight, full = Math.max(380, vh - 110), h0 = nav._h || full;
    var natural = Math.min(Math.max(w.top, 20), w.bottom - h0);
    var bands = $$('[data-page]').map(function (p) {
      var bb = p.getBoundingClientRect(); if (bb.bottom <= 0 || bb.top >= vh) return null;
      var st = $('[data-stats]', p), fs = st ? $('[data-grid]', p) : null;
      var top = st && fs ? fs.getBoundingClientRect().top : p.firstElementChild.getBoundingClientRect().bottom + 20;
      var bot = (st || p.lastElementChild).getBoundingClientRect().top - 16;
      return bot > top ? { top: top, bot: bot, st: st, fs: fs } : null;
    }).filter(Boolean);
    var dom = null, best = 0;
    bands.forEach(function (b) { var o = Math.min(b.bot, natural + h0) - Math.max(b.top, natural); if (o > best) { best = o; dom = b; } });
    var h = dom && dom.st && dom.fs ? Math.min(full, dom.fs.offsetHeight) : full;
    if (nav._h !== h) { nav._h = h; nav.style.height = h + 'px'; }
    clipTo(nav, bands);
  }
  var raf = 0;
  function tick() { cancelAnimationFrame(raf); raf = requestAnimationFrame(mark); }
  function layout() { fit(); place(); mark(); }

  /* ------------------------------------------------------------------ *
   * Reveal-on-scroll
   * ------------------------------------------------------------------ */
  function reveal() {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var els = $$('[data-reveal]');
    if (reduce || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.06 });
    els.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }

  /* ------------------------------------------------------------------ *
   * Chat: Dialogflow CX Messenger, with a built-in starter panel
   * until real agent IDs are configured (or if Google's script fails)
   * ------------------------------------------------------------------ */
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { if (k === 'text') n.textContent = attrs[k]; else n.setAttribute(k, attrs[k]); });
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }
  var SVG_NS = 'http://www.w3.org/2000/svg';
  function icon(d, size) {
    var s = document.createElementNS(SVG_NS, 'svg'), p = document.createElementNS(SVG_NS, 'path');
    s.setAttribute('width', size); s.setAttribute('height', size); s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('aria-hidden', 'true'); s.setAttribute('class', 'chat-ico'); p.setAttribute('d', d); s.appendChild(p);
    return s;
  }

  function chat() {
    var df = CFG.dialogflow || {}, email = CFG.contactEmail || '';
    var live = df.projectId && df.agentId && !/^YOUR_/.test(df.projectId) && !/^YOUR_/.test(df.agentId);

    // Built-in panel
    var log = el('div', { class: 'chat-log', id: 'chat-log' }, [el('div', { class: 'chat-msg chat-bot', text: 'Ask about Saksham’s work, or start with one of these:' })]);
    var chips = el('div', { class: 'chat-chips' });
    (CFG.starters || []).forEach(function (s) {
      var b = el('button', { type: 'button', class: 'chat-chip', text: s.q });
      b.addEventListener('click', function () {
        b.remove();
        var links = el('div', { class: 'chat-links' }, (s.sections || []).filter(function (x) { return document.getElementById(x[0]); }).map(function (x) {
          return el('a', { href: '#' + x[0], class: 'chat-link', text: (/^F-\d+$/.test(x[0]) ? x[0] + ' · ' : '') + x[1] + ' →' });
        }));
        var asked = el('div', { class: 'chat-msg chat-user', text: s.q });
        log.insertBefore(asked, chips);
        var ans = el('div', { class: 'chat-msg chat-bot' }, [s.a, links.childNodes.length ? el('div', { class: 'chat-links-label', text: 'Read more' }) : null, links.childNodes.length ? links : null]);
        log.insertBefore(ans, chips);
        log.scrollTop = asked.offsetTop - 14;
      });
      chips.appendChild(b);
    });
    log.appendChild(chips);
    log.appendChild(el('div', { class: 'chat-note' }, ['Live answers aren’t connected yet. Anything else: ', el('a', { href: 'mailto:' + email, text: email })]));

    var panel = el('div', { class: 'chat-panel', role: 'dialog', 'aria-label': df.title || 'Ask the Dispatch', id: 'chat-panel', hidden: '' }, [
      el('div', { class: 'chat-head' }, [el('div', { class: 'chat-title', text: df.title || 'Ask the Dispatch' }), el('div', { class: 'chat-sub', text: df.subtitle || '' })]),
      log,
      el('div', { class: 'chat-input' }, [el('input', { type: 'text', disabled: '', 'aria-label': 'Your question', placeholder: 'Free-text questions coming soon' }), el('span', { text: 'Send' })])
    ]);
    var openIco = icon('M4 5h16v11H9l-5 4zM8 9h8M8 12h5', 24), closeIco = icon('M6 6l12 12M18 6L6 18', 22);
    closeIco.style.display = 'none';
    var btn = el('button', { type: 'button', class: 'chat-bubble', 'aria-controls': 'chat-panel', 'aria-expanded': 'false', 'aria-label': 'Ask the Dispatch' }, [openIco, closeIco]);
    var box = el('div', { class: 'chat-fallback' }, [panel, btn]);
    function setOpen(open) {
      panel.hidden = !open; btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close the assistant' : 'Ask the Dispatch');
      openIco.style.display = open ? 'none' : ''; closeIco.style.display = open ? '' : 'none';
      if (open) { var f = $('.chat-chip', panel); if (f) f.focus(); }
    }
    btn.addEventListener('click', function () { setOpen(panel.hidden); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { setOpen(false); btn.focus(); } });
    document.body.appendChild(box);

    if (!live) return;
    // Live Dialogflow widget
    var m = el('df-messenger', { 'project-id': df.projectId, 'agent-id': df.agentId, location: df.location || 'global', 'language-code': df.languageCode || 'en', 'max-query-length': '-1' },
      [el('df-messenger-chat-bubble', { 'chat-title': df.title || 'Ask the Dispatch', 'chat-subtitle': df.subtitle || '', 'placeholder-text': 'e.g. What did he find at the bank?' })]);
    document.body.appendChild(m);
    var sc = el('script', { src: df.scriptUrl, async: '' });
    sc.onerror = function () { m.remove(); };
    document.body.appendChild(sc);
    if (window.customElements) customElements.whenDefined('df-messenger').then(function () { box.remove(); });
  }

  /* ------------------------------------------------------------------ */
  volume();
  reveal();
  chat();
  layout();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  window.addEventListener('load', layout);
  window.addEventListener('resize', layout);
  window.addEventListener('scroll', tick, { passive: true });
  // Expanding sections changes page height: keep the index in step
  if ('ResizeObserver' in window) new ResizeObserver(tick).observe(document.body);
})();
