(function () {
  'use strict';

  const E = window.LinguaEngine;
  const LIB = window.LINGUA_CONTENT;
  const LANGS = Object.fromEntries(LIB.languages.map((l) => [l.id, l]));
  const STORE_KEY = 'lingua.progress.v1';
  const app = document.getElementById('app');
  const indexes = {};
  const index = (id) => indexes[id] || (indexes[id] = E.buildIndex(LANGS[id]));

  // ---------------------------------------------------------------- storage
  let storageOK = true;
  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      return E.sanitizeProgress(raw ? JSON.parse(raw) : null);
    } catch (err) {
      storageOK = false;
      return E.emptyProgress();
    }
  }
  let progress = loadProgress();

  let savedTimer = null;
  /** Persist without the "Saved" flash (used by the study-time heartbeat). */
  function saveQuiet() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(progress)); } catch (err) { storageOK = false; }
  }
  function save() {
    progress.updatedAt = new Date().toISOString();
    const langId = route()[0];
    if (LANGS[langId]) E.recordFluency(LANGS[langId], lp(langId));
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(progress));
      storageOK = true;
      const el = document.getElementById('saved');
      el.textContent = '✓ Saved';
      el.style.opacity = '1';
      clearTimeout(savedTimer);
      savedTimer = setTimeout(() => { el.style.opacity = '0'; }, 1400);
    } catch (err) {
      storageOK = false;
    }
    document.getElementById('storage-warning').hidden = storageOK;
    updateChips();
  }
  const lp = (id) => progress.languages[id] || (progress.languages[id] = E.emptyLang());
  function award(xp) {
    progress.xp += xp;
    E.touchStreak(progress, new Date());
    save();
  }
  function updateChips() {
    document.getElementById('streak').textContent = `🔥 ${progress.streak.count}`;
    document.getElementById('xp').textContent = `⭐ ${progress.xp}`;
  }
  // Keep several open tabs in sync.
  window.addEventListener('storage', (e) => {
    if (e.key !== STORE_KEY) return;
    progress = loadProgress();
    updateChips();
    if (!view || !view.busy) render();
  });

  // ---------------------------------------------------------------- helpers
  const h = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const canSpeak = 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
  const pct = (c, t) => (t ? Math.round((c / t) * 100) : 0);
  const levelIdx = (l) => E.LEVELS.indexOf(l);
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const allLessons = (lang) => lang.categories.flatMap((c) => c.lessons.map((l) => ({ ...l, cat: c })));
  const isAr = (lang) => lang.id === 'ar';

  // Per-device learning preferences (not part of the progress backup).
  let prefs = { showTr: true, quiet: false };
  try { prefs = { ...prefs, ...JSON.parse(localStorage.getItem('lingua.prefs') || '{}') }; } catch (err) { /* defaults */ }
  function applyPrefs() {
    document.body.classList.toggle('hide-tr', !prefs.showTr);
    document.body.classList.toggle('quiet', !!prefs.quiet);
  }
  function setPref(key, value) {
    prefs[key] = value;
    try { localStorage.setItem('lingua.prefs', JSON.stringify(prefs)); } catch (err) { /* this session only */ }
    applyPrefs();
    render();
  }
  const REPORT_URL = 'https://github.com/anewbyss/linguistics-/issues/new';
  const reportLink = (what) => `<a class="small muted" target="_blank" rel="noopener" href="${REPORT_URL}?title=${encodeURIComponent(`Content: ${what}`)}&body=${encodeURIComponent('What is wrong, and what should it say?\n\n')}">⚑ Report a mistake</a>`;

  const RATES = { slow: 0.6, normal: 0.85, natural: 1.05 };
  let rateName = 'normal';
  try { rateName = localStorage.getItem('lingua.rate') || 'normal'; } catch (err) { /* default */ }
  if (!RATES[rateName]) rateName = 'normal';
  const speedControl = () => (canSpeak ? `<div class="seg small" role="group" aria-label="Speech speed">${Object.keys(RATES).map((k) => `<button aria-pressed="${rateName === k}" data-act="rate" data-rate="${k}">${k === 'slow' ? '🐢 Slow' : k === 'normal' ? 'Normal' : '🐇 Natural'}</button>`).join('')}</div>` : '');

  function speak(text, code) {
    if (!canSpeak || !text) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text.replace(/‍/g, ''));
      u.lang = code;
      u.rate = RATES[rateName];
      const voices = speechSynthesis.getVoices();
      const v = voices.find((x) => x.lang === code) || voices.find((x) => x.lang && x.lang.slice(0, 2) === code.slice(0, 2));
      if (v) u.voice = v;
      speechSynthesis.speak(u);
    } catch (err) { /* speech is optional */ }
  }
  const speakBtn = (text, lang) => (canSpeak && text
    ? `<button class="icon-btn" data-act="speak" data-text="${h(text)}" data-code="${h(lang.speech)}" aria-label="Listen" title="Listen">🔊</button>` : '');
  const tText = (text, lang, cls = 't') => `<span class="${cls}${isAr(lang) ? ' ar' : ''}" lang="${lang.id}" dir="${lang.dir}">${h(text)}</span>`;

  function phrase(p, lang) {
    return `<div class="phrase">
      <div class="top">${tText(p.t, lang)}${speakBtn(p.t, lang)}</div>
      ${p.tr ? `<div class="tr">${h(p.tr)}</div>` : ''}
      <div class="en">${h(p.en)}</div>
      ${p.note ? `<div class="note">💡 ${h(p.note)}</div>` : ''}
    </div>`;
  }
  const bar = (value) => `<div class="bar" role="progressbar" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100"><span style="width:${value}%"></span></div>`;
  const levelChip = (l) => `<span class="chip level" title="${h(E.LEVEL_NAMES[l] || '')}">${h(l)}</span>`;
  const cellHtml = (c) => (E.hasArabic(c) ? `<td dir="auto" lang="ar">${h(c)}</td>` : `<td>${h(c)}</td>`);
  function table(t) {
    if (!t) return '';
    return `<div class="table-wrap"><table><thead><tr>${t.headers.map((x) => `<th>${h(x)}</th>`).join('')}</tr></thead>
      <tbody>${t.rows.map((r) => `<tr>${r.map(cellHtml).join('')}</tr>`).join('')}</tbody></table></div>`;
  }

  // ---------------------------------------------------------------- Hayya, the feathered snake
  // "هيّا" (hayyā) means "let's go!" in Arabic; the feathers nod to Quetzalcóatl, Mexico's feathered serpent.
  function mascot(mood = 'happy', size = 72) {
    const think = mood === 'think';
    const eyes = mood === 'sleep'
      ? '<path d="M70 27 q4 3 8 0 M83 27 q4 3 8 0" class="hy-line"/>'
      : `<circle cx="74" cy="26" r="4.6" class="hy-eye"/><circle cx="87" cy="26" r="4.6" class="hy-eye"/>
         <circle cx="${think ? 73 : 75}" cy="${think ? 24.5 : 26.6}" r="2.3" class="hy-pupil"/><circle cx="${think ? 86 : 88}" cy="${think ? 24.5 : 26.6}" r="2.3" class="hy-pupil"/>`;
    const mouth = mood === 'cheer' ? '<path d="M74 35 Q81 45 88 35 Z" class="hy-mouth"/>'
      : think ? '<path d="M77 37 h7" class="hy-line"/>' : '<path d="M75 35 Q81 40 87 35" class="hy-line"/>';
    const tongue = mood === 'happy' || mood === 'cheer' ? '<path d="M81 41 v6 m0 0 l-3 3 m3 -3 l3 3" class="hy-tongue"/>' : '';
    // Patterned after Lyra, a real ball python: chocolate body, cream-edged caramel blotches,
    // a dark head with tan stripes and a cream chin. The feather crest nods to Quetzalcóatl.
    const body = 'M14 104 C 8 84, 40 80, 52 88 S 90 100, 94 78 S 70 56, 76 40';
    return `<svg class="hayya" width="${size}" height="${size}" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <path d="${body}" class="hy-body"/><path d="${body}" class="hy-rim"/><path d="${body}" class="hy-blotch"/>
      <ellipse cx="66" cy="13" rx="4" ry="9" transform="rotate(-30 66 13)" class="hy-f1"/><ellipse cx="80" cy="9" rx="4" ry="10" class="hy-f2"/>
      <ellipse cx="94" cy="13" rx="4" ry="9" transform="rotate(30 94 13)" class="hy-f3"/>
      <ellipse cx="81" cy="29" rx="17" ry="14" class="hy-head"/><ellipse cx="81" cy="35" rx="13" ry="6.5" class="hy-chin"/>
      <path d="M65 25 Q72 16 80 17 M97 25 Q90 16 82 17" class="hy-stripe"/>${eyes}
      <circle cx="68" cy="34" r="2.6" class="hy-blush"/><circle cx="94" cy="34" r="2.6" class="hy-blush"/>${mouth}${tongue}</svg>`;
  }
  /** Hayya with a speech bubble; pass href to make the whole tip a link. */
  function hayya(text, { mood = 'happy', href = null, size = 64 } = {}) {
    const inner = `${mascot(mood, size)}<div class="say"><b>Hayya</b><span>${text}</span></div>`;
    return href ? `<a class="hayya-tip" href="${href}">${inner}</a>` : `<div class="hayya-tip">${inner}</div>`;
  }


  // ---------------------------------------------------------------- quiz component
  function newQuiz(questions, mode, onFinish) {
    return { questions, mode, i: 0, picked: null, answers: [], correct: 0, done: false, onFinish };
  }
  function quizHtml(q, lang) {
    if (q.done) return '';
    const item = q.questions[q.i];
    const answered = q.picked !== null && q.mode === 'practice';
    const opts = item.options.map((o, i) => {
      let cls = 'option';
      if (answered) {
        if (i === item.answer) cls += ' correct';
        else if (i === q.picked) cls += ' wrong';
      }
      const lng = E.hasArabic(o) ? ' lang="ar" dir="auto"' : '';
      return `<button class="${cls}" data-act="quiz-pick" data-i="${i}"${lng}${answered ? ' disabled' : ''}>${h(o)}</button>`;
    }).join('');
    let fb = '';
    if (answered) {
      const ok = q.picked === item.answer;
      fb = `<div class="feedback ${ok ? 'good' : 'bad'}">${ok ? '✓ Correct!' : `✗ The answer is: ${h(item.options[item.answer])}`}
        ${item.explain ? `<span class="detail">${h(item.explain)}</span>` : ''}</div>
        <div class="row" style="margin-top:.8rem"><button class="btn primary" data-act="quiz-next">${q.i + 1 < q.questions.length ? 'Next question →' : 'See results'}</button></div>`;
    }
    return `<div class="progress-label">Question ${q.i + 1} of ${q.questions.length}</div>
      ${bar(pct(q.i, q.questions.length))}
      <div style="margin-top:.8rem" class="quiz-q">${h(item.q)}</div>
      ${item.t ? `<div class="quiz-t">${tText(item.t, lang, isAr(lang) && E.hasArabic(item.t) ? 'ar' : '')}${/_{2,}/.test(item.t) ? '' : speakBtn(item.t, lang)}</div>` : ''}
      <div class="options">${opts}</div>${fb}`;
  }
  function quizPick(i) {
    const q = view.quiz;
    if (!q || q.done || (q.picked !== null && q.mode === 'practice')) return;
    q.picked = i;
    q.answers[q.i] = i;
    if (i === q.questions[q.i].answer) q.correct++;
    if (q.mode === 'test') quizNext();
    else render();
  }
  function quizNext() {
    const q = view.quiz;
    if (!q) return;
    q.picked = null;
    if (q.i + 1 < q.questions.length) q.i++;
    else { q.done = true; q.onFinish && q.onFinish(q); }
    render();
  }

  // ---------------------------------------------------------------- router
  let view = null;
  let lastRouteKey = null;
  const route = () => location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);

  function setChrome(title, back, langId) {
    document.getElementById('title').textContent = title;
    const b = document.getElementById('back');
    b.hidden = !back;
    if (back) b.setAttribute('href', back);
    if (langId) document.body.dataset.lang = langId; else delete document.body.dataset.lang;
    document.title = title === 'Lingua' ? 'Lingua: Arabic & Mexican Spanish' : `${title} · Lingua`;
  }

  function render() {
    const parts = route();
    const key = parts.join('/');
    if (key !== lastRouteKey) { view = null; lastRouteKey = key; window.scrollTo(0, 0); }
    let html;
    try {
      html = dispatch(parts);
    } catch (err) {
      console.error(err);
      html = `<div class="card"><h2>Something went wrong</h2><p class="muted">${h(err.message)}</p><a class="btn" href="#/">Go home</a></div>`;
    }
    applyPrefs();
    app.innerHTML = html;
    isolateArabic(app);
    afterRender();
  }

  // Arabic inside left-to-right text (an English question, a label, a "…" hint) is laid out
  // left to right, so a blank or ellipsis after an Arabic word lands on the wrong side.
  // Wrap each Arabic run, with its blanks and ellipses, in a right-to-left isolate.
  const AR_CH = '\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF';
  const AR_RUN = new RegExp(`(?:[_…]+[ \u00A0]*)?[${AR_CH}](?:[${AR_CH} \u00A0_…،؛؟!.]*[${AR_CH}_…؟])?`, 'g');
  const HAS_AR = new RegExp(`[${AR_CH}]`);
  function isolateArabic(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (HAS_AR.test(n.nodeValue) && !n.parentElement.closest('[dir="rtl"], textarea, script, style')
        ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const text = node.nodeValue;
      const frag = document.createDocumentFragment();
      let last = 0;
      for (const m of text.matchAll(AR_RUN)) {
        if (m.index > last) frag.append(text.slice(last, m.index));
        const span = document.createElement('span');
        span.dir = 'rtl';
        span.textContent = m[0];
        frag.append(span);
        last = m.index + m[0].length;
      }
      if (last < text.length) frag.append(text.slice(last));
      node.replaceWith(frag);
    }
  }

  function dispatch(parts) {
    if (!parts.length) return landing();
    if (parts[0] === 'progress') return progressView();
    const lang = LANGS[parts[0]];
    if (!lang) { location.hash = '#/'; return ''; }
    const ld = lp(lang.id);
    if (ld.lastVisit !== E.localDay()) { ld.lastVisit = E.localDay(); save(); }
    switch (parts[1]) {
      case undefined: return langHome(lang);
      case 'cat': return categoryView(lang, parts[2]);
      case 'lesson': return lessonView(lang, parts[2]);
      case 'read': return readingView(lang, parts[2]);
      case 'scenarios': return scenarioList(lang);
      case 'scenario': return scenarioView(lang, parts[2]);
      case 'translate': return translateView(lang);
      case 'test': return testView(lang);
      case 'media': return mediaView(lang);
      case 'challenge': return challengeView(lang);
      case 'speak': return speakView(lang, parts[2]);
      case 'fluency': return fluencyView(lang);
      case 'review': return reviewView(lang);
      case 'listen': return listenView(lang);
      case 'write': return writeView(lang, parts[2]);
      case 'resources': return resourcesView(lang);
      case 'plan': return planView(lang);
      default: return langHome(lang);
    }
  }

  // ---------------------------------------------------------------- landing
  function landing() {
    setChrome('Lingua', null, null);
    const cards = LIB.languages.map((lang) => {
      const s = E.languageStats(lang, lp(lang.id));
      const f = E.fluency(lang, lp(lang.id));
      const doneToday = !!lp(lang.id).challenges[E.localDay()];
      return `<a class="lang-card" data-lang="${lang.id}" href="#/${lang.id}">
        <div class="banner-art" aria-hidden="true">${h(lang.symbol)}</div>
        <div class="body">
          <div class="row spread"><h2 style="margin:0">${h(lang.name)}</h2>${s.level ? levelChip(s.level) : '<span class="chip">Not tested yet</span>'}</div>
          <div class="native" lang="${lang.id}" dir="${lang.dir}">${h(lang.nativeName)}</div>
          <p class="muted small" style="margin:.4rem 0 .8rem">${h(lang.subtitle)}</p>
          ${bar(s.percent)}
          <div class="row spread small muted" style="margin-top:.4rem"><span>${s.lessonsDone}/${s.lessonsTotal} lessons · ${s.scenariosDone}/${s.scenariosTotal} scenarios</span><span>${s.percent}% of course</span></div>
          <div class="row spread small" style="margin-top:.6rem"><span>Fluency <b>${f.overall.score}</b>/100 · ${h(f.overall.band)}</span>
            <span class="chip ${doneToday ? 'done' : ''}">${doneToday ? '✓ Daily challenge done' : '⚡ Daily challenge ready'}</span></div>
        </div></a>`;
    }).join('');
    return `<section class="hero">
        <div class="hero-mascot">${mascot('cheer', 120)}</div>
        <h1>Learn Arabic &amp; Mexican Spanish</h1>
        <p>Lessons from your first letters to C1, a dialect track, daily challenges, spaced review, listening, writing and speaking practice, and fluency tracking. Your progress saves automatically.</p>
      </section>
      ${hayya(LIB.languages.every((l) => !lp(l.id).plan.start)
        ? "Hi, I'm Hayya! New here? Pick a language below and I'll set up a plan for you, starting with the alphabet. (My colors come from Lyra, a real ball python, and my feathers from Quetzalcóatl. My name is Arabic for “let's go!”, هيّا.)"
        : "Hi, I'm Hayya! My colors come from Lyra, a real ball python, and my feathers from Quetzalcóatl, Mexico's feathered serpent. My name is Arabic for “let's go!” (هيّا). Pick a language and I'll keep you on track.", { size: 56, mood: 'cheer' })}
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr))">${cards}</div>
      <div class="grid tight" style="margin-top:1.2rem">
        <div class="card center gamify"><div class="score-big">${progress.xp}</div><div class="muted small">XP earned</div></div>
        <div class="card center gamify"><div class="score-big">${progress.streak.count}</div><div class="muted small">day streak</div></div>
        <a class="tile" href="#/progress"><span class="emoji">💾</span><span class="title">Progress &amp; backup</span><span class="sub">Export, import or reset your progress</span></a>
      </div>
      <footer class="foot">Everything runs on your device and works offline.</footer>`;
  }

  // ---------------------------------------------------------------- language home

  function langHome(lang) {
    setChrome(lang.name, '#/', lang.id);
    const d = lp(lang.id);
    const s = E.languageStats(lang, d);
    const sr = E.srsStats(lang, d, E.localDay());
    const listenAll = E.listeningItems(lang);
    const listenDone = listenAll.filter((x) => d.listening[x.t] && d.listening[x.t].best >= E.LISTEN_PASS).length;
    const wpDone = (lang.writingPrompts || []).filter((pr) => d.prompts[pr.id] && d.prompts[pr.id].best >= E.PROMPT_PASS).length;
    const plan = E.learningPlan(lang, d);
    const tile = ([r, emoji, title, sub, meta]) => `<a class="tile" href="#/${lang.id}/${r}"><span class="emoji ${r === 'read' && isAr(lang) ? 'ar' : ''}">${emoji}</span><span class="title">${title}</span><span class="sub">${sub}</span><span class="meta small muted">${h(meta)}</span></a>`;
    const startTiles = [
      ['plan', '🧭', 'Learning plan', 'Every step in the recommended order, starting with the alphabet', `${plan.done}/${plan.total} steps done`],
      ['read', isAr(lang) ? 'ع' : '🔤', isAr(lang) ? 'The alphabet' : 'Alphabet & pronunciation', isAr(lang) ? 'Letters, vowel marks, tracing and typing' : 'Letters, sounds, accents and spelling', `${s.lettersDone}/${s.lettersTotal} letters · ${s.writingDone}/${s.writingTotal} written`],
      ['test', '🎯', 'Placement test', 'Already know some? Find your level (A1–B2)', s.level ? `Last result: ${s.level}` : 'Not taken yet'],
    ].map(tile).join('');
    const tiles = [
      ['review', '🔁', 'Review', 'Spaced repetition: words come back just before you forget them', sr.due ? `${sr.due} due now · ${sr.learned}/${sr.total} learned` : `${sr.learned}/${sr.total} learned · ${sr.newAvailable} new ready`],
      ['listen', '🎧', 'Listening', 'Dictation and comprehension at slow or natural speed', `${listenDone}/${listenAll.length} lines understood`],
      ['speak', '🎙️', 'Speaking Practice', 'Listen, repeat and get a pronunciation score', `${E.speakingPhrases(lang).filter((p) => d.speaking[p.t] && d.speaking[p.t].best >= E.SPEAK_PASS).length}/${E.speakingPhrases(lang).length} phrases spoken`],
      ['scenarios', '🎭', 'Real-World Scenarios', 'Role-play cafés, taxis, markets and more', `${s.scenariosDone}/${s.scenariosTotal} completed`],
      ['translate', '🔄', 'Offline Translator', 'Dictionary and phrasebook, no internet needed', `${lang.dictionary.length} entries`],
    ].map(tile).join('');
    const furtherTiles = [
      ['write', '📝', 'Writing Studio', 'Free writing with automatic checks and a model answer', `${wpDone}/${(lang.writingPrompts || []).length} prompts passed`],
      ['media', '🎬', 'Media Picks', 'Films, shows, books and music by level', `${lang.media.length} picks`],
      ['resources', '🏛️', 'Free Courses & Resources', 'From universities and government bodies, by level', `${lang.resources.length} sources`],
    ].map(tile).join('');
    const catTile = (c) => {
      const done = c.lessons.filter((l) => d.lessons[l.id] && d.lessons[l.id].done).length;
      const levels = [...new Set(c.lessons.map((l) => l.level))].join('–');
      return `<a class="tile" href="#/${lang.id}/cat/${c.id}"><span class="emoji">${c.emoji}</span>
        <span class="title">${h(c.title)}</span><span class="sub" lang="${lang.id}" dir="${lang.dir}">${h(c.nativeTitle)}</span>
        <span class="sub">${h(c.summary)}</span>
        <span class="meta"><span class="chip">${levels}</span><span class="chip ${done === c.lessons.length ? 'done' : ''}">${done}/${c.lessons.length} done</span></span></a>`;
    };
    // Categories grouped by the level of their first lesson, easiest first.
    const firstLevel = (c) => Math.min(...c.lessons.map((l) => levelIdx(l.level)));
    const cats = E.LEVELS.map((L, i) => {
      const group = lang.categories.filter((c) => firstLevel(c) === i);
      return group.length ? `<h3 class="level-head">${levelChip(L)} ${h(E.LEVEL_NAMES[L])}</h3><div class="grid">${group.map(catTile).join('')}</div>` : '';
    }).join('');
    return `<section class="lang-hero">
        <div class="row spread"><div><h1>${h(lang.name)}</h1><div lang="${lang.id}" dir="${lang.dir}" style="font-size:1.2rem;opacity:.9">${h(lang.nativeName)}</div></div>
        ${s.level ? `<span class="chip">Level ${h(s.level)} · ${h(E.LEVEL_NAMES[s.level])}</span>` : `<a class="btn" href="#/${lang.id}/test">🎯 Find your level</a>`}</div>
        ${bar(s.percent)}
        <div class="small" style="margin-top:.4rem;opacity:.9">${s.percent}% of the course complete</div>
      </section>
      ${plan.needsSetup ? welcomeCard(lang) : planCard(lang, plan, sr)}
      <div class="grid" style="margin-bottom:1rem">${challengeCard(lang)}${fluencyCard(lang)}</div>
      <h2 class="section-title">1 · Start here</h2>
      <p class="small muted section-sub">New learners begin with the alphabet; the learning plan takes you through everything else in order.</p>
      <div class="grid">${startTiles}</div>
      <h2 class="section-title">2 · Practice</h2>
      <p class="small muted section-sub">Use these alongside your lessons, a little every day.</p>
      <div class="grid">${tiles}</div>
      <h2 class="section-title">3 · Go further</h2>
      <p class="small muted section-sub">Best from A2 onwards: free writing, real media and outside courses.</p>
      <div class="grid">${furtherTiles}</div>
      <h2 class="section-title">Lessons by level</h2>
      <p class="small muted section-sub">Grammar and culture, easiest first. Every lesson is open; the plan suggests an order.</p>
      ${cats}`;
  }

  function categoryView(lang, id) {
    const c = lang.categories.find((x) => x.id === id);
    if (!c) return notFound(lang);
    setChrome(c.title, `#/${lang.id}`, lang.id);
    const d = lp(lang.id);
    const items = c.lessons.map((l) => {
      const rec = d.lessons[l.id];
      return `<a class="tile" href="#/${lang.id}/lesson/${l.id}"><span class="title">${h(l.title)}</span><span class="sub">${h(l.summary)}</span>
        <span class="meta">${levelChip(l.level)}${rec && rec.done ? `<span class="chip done">✓ Best ${rec.best}%</span>` : '<span class="chip">Not started</span>'}</span></a>`;
    }).join('');
    return `<div class="lesson-head"><span class="emoji" style="font-size:2rem">${c.emoji}</span><h1>${h(c.title)}</h1>
      <p class="muted" lang="${lang.id}" dir="${lang.dir}">${h(c.nativeTitle)}</p><p>${h(c.summary)}</p></div>
      <div class="grid">${items}</div>`;
  }

  function notFound(lang) {
    setChrome('Not found', `#/${lang.id}`, lang.id);
    return `<div class="card"><h2>Not found</h2><a class="btn" href="#/${lang.id}">Back to ${h(lang.name)}</a></div>`;
  }

  // ---------------------------------------------------------------- lesson
  function lessonView(lang, id) {
    const lessons = allLessons(lang);
    const idx = lessons.findIndex((l) => l.id === id);
    if (idx < 0) return notFound(lang);
    const l = lessons[idx];
    setChrome(l.title, `#/${lang.id}/cat/${l.cat.id}`, lang.id);
    if (!view) {
      view = {
        quiz: newQuiz(l.quiz, 'practice', (q) => {
          const d = lp(lang.id);
          const score = pct(q.correct, q.questions.length);
          const prev = d.lessons[l.id];
          const first = !(prev && prev.done);
          d.lessons[l.id] = { best: Math.max(score, prev ? prev.best : 0), done: true, at: new Date().toISOString() };
          E.logPractice(d, 'reading', score);
          award(q.correct * 10 + (first ? 20 : 0));
        }),
      };
    }
    const q = view.quiz;
    const rec = lp(lang.id).lessons[l.id];
    const prevL = lessons[idx - 1];
    const nextL = lessons[idx + 1];
    const quizBody = q.done
      ? `<div class="center"><div class="score-big">${pct(q.correct, q.questions.length)}%</div>
          <p>${q.correct} of ${q.questions.length} correct${rec ? ` · best ${rec.best}%` : ''}. Progress saved.</p>
          <div class="row" style="justify-content:center"><button class="btn" data-act="lesson-retry">Try again</button>
          ${nextL ? `<a class="btn primary" href="#/${lang.id}/lesson/${nextL.id}">Next lesson →</a>` : `<a class="btn primary" href="#/${lang.id}">Back to ${h(lang.name)}</a>`}</div></div>`
      : quizHtml(q, lang);
    return `<article>
      <div class="lesson-head"><div class="row">${levelChip(l.level)}<span class="muted small">${l.cat.emoji} ${h(l.cat.title)}</span>${rec && rec.done ? `<span class="chip done">✓ Completed · best ${rec.best}%</span>` : ''}</div>
        <h1 style="margin-top:.5rem">${h(l.title)}</h1><p class="muted">${h(l.summary)}</p></div>
      <section class="card"><h2><span class="icon">📐</span>Grammar: ${h(l.grammar.title)}</h2>
        ${l.grammar.body.map((p) => `<p>${h(p)}</p>`).join('')}${table(l.grammar.table)}</section>
      <section class="card"><h2><span class="icon">🗂️</span>Key vocabulary</h2><div class="phrases">${l.vocab.map((p) => phrase(p, lang)).join('')}</div></section>
      <section class="card"><h2><span class="icon">💬</span>In context</h2><div class="phrases wide">${l.examples.map((p) => phrase(p, lang)).join('')}</div></section>
      <section class="card culture"><h2><span class="icon">🌍</span>Culture: ${h(l.culture.title)}</h2>${l.culture.body.map((p) => `<p>${h(p)}</p>`).join('')}</section>
      <section class="card" id="quiz"><h2><span class="icon">✅</span>Check yourself</h2>${quizBody}</section>
      <div class="row spread">${prevL ? `<a class="btn" href="#/${lang.id}/lesson/${prevL.id}">← ${h(prevL.title)}</a>` : '<span></span>'}
        ${nextL ? `<a class="btn" href="#/${lang.id}/lesson/${nextL.id}">${h(nextL.title)} →</a>` : ''}</div>
      <p class="center" style="margin-top:1rem">${reportLink(`${l.id} (${l.title})`)}</p>
    </article>`;
  }

  // ---------------------------------------------------------------- reading & writing
  function letterQuiz(lang) {
    const letters = lang.reading.letters;
    return shuffle(letters).slice(0, 10).map((L, n) => {
      const wrong = shuffle(letters.filter((x) => x.char !== L.char)).slice(0, 3);
      const options = shuffle([L, ...wrong]).map((x) => `${x.name} (${x.tr})`);
      return { id: `lq${n}`, q: 'Which letter is this?', t: L.char, options, answer: options.indexOf(`${L.name} (${L.tr})`), explain: L.sound };
    });
  }
  function accentQuiz(lang) {
    // Words with a written accent; distractors move or drop the accent.
    const strip = (w) => w.normalize('NFD').replace(/[́]/g, '').normalize('NFC');
    const acute = { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú' };
    const words = [...new Set(lang.dictionary.map((e) => e.t).filter((t) => /^[a-zñü]+$/i.test(strip(t)) && /[áéíóú]/.test(t) && t.length > 3))];
    return shuffle(words).slice(0, 10).map((w, n) => {
      const bare = strip(w);
      const variants = new Set([bare]);
      [...bare].forEach((ch, i) => { if (acute[ch]) variants.add(bare.slice(0, i) + acute[ch] + bare.slice(i + 1)); });
      variants.delete(w);
      const options = shuffle([w, ...shuffle([...variants]).slice(0, 3)]);
      const entry = lang.dictionary.find((e) => e.t === w);
      return { id: `aq${n}`, q: `Which spelling is correct for "${E.primaryEnglish(entry.en)}"?`, options, answer: options.indexOf(w), explain: `${w}: the written accent marks the stressed syllable.` };
    });
  }

  const READ_TABS = ['letters', 'marks', 'read', 'write', 'trace', 'quiz'];
  function readingView(lang, tab) {
    const r = lang.reading;
    setChrome(r.title, `#/${lang.id}`, lang.id);
    if (!view) view = { tab: READ_TABS.includes(tab) ? tab : 'letters', letter: null, word: 0, reveal: false, task: 0, input: '', result: null, trace: r.letters[0].char, form: 0, traceScore: null };
    const tabs = [['letters', isAr(lang) ? 'Alphabet' : 'Letters & sounds'], ['marks', isAr(lang) ? 'Vowel marks' : 'Accents & rules'],
      ['read', 'Read words'], ['write', 'Write'], ['trace', 'Trace'], ['quiz', isAr(lang) ? 'Letter quiz' : 'Accent quiz']];
    const seg = `<div class="seg" role="tablist">${tabs.map(([k, label]) => `<button role="tab" aria-pressed="${view.tab === k}" data-act="tab" data-tab="${k}">${label}</button>`).join('')}</div>`;
    let body = '';
    const d = lp(lang.id);
    if (view.tab === 'letters') {
      const L = view.letter && r.letters.find((x) => x.char === view.letter);
      const detail = L ? `<div class="card">
          <div class="row spread"><h2 style="margin:0">${tText(L.char, lang, 'glyph')} ${h(L.name)} <span class="muted">(${h(L.tr)})</span></h2>
          <div class="row">${speakBtn(L.example.t, lang)}<button class="btn" data-act="trace-letter" data-char="${h(L.char)}">✍️ Trace it</button><button class="icon-btn" data-act="letter-close" aria-label="Close">✕</button></div></div>
          ${L.forms ? `<div class="forms">${['Isolated', 'Initial', 'Medial', 'Final'].map((lbl, i) => `<div><span class="glyph" lang="ar">${h(L.forms[i])}</span><span class="lbl">${lbl}</span></div>`).join('')}</div>
            ${L.connects === false ? '<p class="small muted">This letter does not join to the letter after it, so its initial and medial forms look like its isolated and final forms.</p>' : ''}` : ''}
          <p><b>Sound:</b> ${h(L.sound)}</p>
          <div class="phrases">${phrase(L.example, lang)}</div></div>` : '';
      body = `${detail}<div class="card"><p class="muted small">Tap a letter to see ${isAr(lang) ? 'its four forms, ' : ''}its sound and an example. Letters you have studied get a ✓.</p>
        <div class="letter-grid" ${isAr(lang) ? 'dir="rtl"' : ''}>${r.letters.map((x) => `<button class="letter ${d.letters[x.char] ? 'studied' : ''}" data-act="letter" data-char="${h(x.char)}">
          ${tText(x.char, lang, 'glyph')}<span class="name">${h(x.name)}</span></button>`).join('')}</div></div>
        <div class="grid">${r.tips.map((t) => `<div class="card"><h3>💡 ${h(t.title)}</h3><p class="small">${h(t.body)}</p></div>`).join('')}</div>`;
    } else if (view.tab === 'marks') {
      if (!d.checks.marks) { d.checks.marks = 1; saveQuiet(); }
      body = r.marks.map((m) => `<div class="card"><div class="row spread"><h3 style="margin:0">${h(m.name)}</h3>${tText(m.symbol, lang, isAr(lang) ? 'glyph' : 't')}</div>
        <p style="margin-top:.4rem">${h(m.body)}</p>${m.example ? `<div class="phrases">${phrase(m.example, lang)}</div>` : ''}</div>`).join('');
    } else if (view.tab === 'read') {
      const w = r.words[view.word];
      body = `<div class="card flash">
        <div class="progress-label">Word ${view.word + 1} of ${r.words.length}</div>
        <div class="big ${isAr(lang) ? 'ar' : ''}" lang="${lang.id}" dir="${lang.dir}">${h(w.t)}</div>
        <p class="muted">${isAr(lang) ? 'Sound it out letter by letter, then reveal.' : 'Read it aloud using the rules, then check.'}</p>
        ${view.reveal ? `${w.tr ? `<div class="reveal-tr">${h(w.tr)}</div>` : ''}<div style="font-size:1.1rem">${h(w.en)}</div>` : ''}
        <div class="row" style="justify-content:center;margin-top:1rem">
          <button class="btn" data-act="word-step" data-d="-1" ${view.word === 0 ? 'disabled' : ''}>←</button>
          <button class="btn primary" data-act="word-reveal">${view.reveal ? 'Hide' : 'Reveal'}</button>
          ${speakBtn(w.t, lang)}
          <button class="btn" data-act="word-step" data-d="1" ${view.word === r.words.length - 1 ? 'disabled' : ''}>→</button></div></div>`;
    } else if (view.tab === 'write') {
      const t = r.writing[view.task];
      const res = view.result;
      const doneCount = r.writing.filter((w) => d.writing[w.answer]).length;
      body = `<div class="card">
        <div class="row spread"><span class="progress-label">Task ${view.task + 1} of ${r.writing.length}</span><span class="chip">${doneCount}/${r.writing.length} mastered</span></div>
        <h2>Write in ${h(lang.name)}: “${h(t.en)}”</h2>
        ${t.hint && view.showHint ? `<p class="muted">Hint: ${h(t.hint)}</p>` : ''}
        <input class="input ${isAr(lang) ? 'ar' : ''}" id="write-input" dir="${lang.dir}" lang="${lang.id}" autocomplete="off" autocapitalize="off" spellcheck="false" value="${h(view.input)}" placeholder="${isAr(lang) ? 'اكتب هنا' : 'Escribe aquí'}">
        ${keyboard(lang, 'write-input')}
        ${res ? `<div class="feedback ${res.ok ? 'good' : 'bad'}">${res.ok ? (res.perfect ? '✓ Perfect!' : `✓ Correct, but check the ${isAr(lang) ? 'hamza / spelling' : 'accents'}: ${h(res.expected)}`) : `✗ Not quite. The answer is: <span lang="${lang.id}" dir="${lang.dir}">${h(t.answer)}</span>`}</div>` : ''}
        <div class="row" style="margin-top:.9rem">
          <button class="btn primary" data-act="write-check">Check</button>
          ${t.hint ? `<button class="btn" data-act="write-hint">Hint</button>` : ''}
          <button class="btn" data-act="write-step" data-d="-1" ${view.task === 0 ? 'disabled' : ''}>← Prev</button>
          <button class="btn" data-act="write-step" data-d="1" ${view.task === r.writing.length - 1 ? 'disabled' : ''}>Next →</button></div></div>`;
    } else if (view.tab === 'trace') {
      const L = r.letters.find((x) => x.char === view.trace) || r.letters[0];
      const forms = L.forms || [L.char];
      body = `<div class="card">
        <div class="row">
          <label class="small muted" for="trace-select">Letter</label>
          <select id="trace-select" class="btn" data-change="trace-select">${r.letters.map((x) => `<option value="${h(x.char)}" ${x.char === L.char ? 'selected' : ''}>${h(x.char)} · ${h(x.name)}</option>`).join('')}</select>
          ${L.forms ? `<div class="seg">${['Isolated', 'Initial', 'Medial', 'Final'].map((lbl, i) => `<button aria-pressed="${view.form === i}" data-act="trace-form" data-i="${i}">${lbl}</button>`).join('')}</div>` : ''}
        </div>
        <p class="small muted" style="margin-top:.6rem">Trace over the gray shape with your finger, mouse, Apple Pencil or stylus${isAr(lang) ? '. Draw the main body first, then the dots' : ''}. A stylus draws thicker when you press harder.</p>
        <p class="small" id="pen-note" hidden></p>
        <div class="trace-wrap"><canvas id="trace-guide" data-glyph="${h(forms[view.form] || L.char)}" aria-label="Letter to trace"></canvas><canvas id="trace-ink"></canvas></div>
        ${view.traceScore !== null ? `<div class="feedback ${view.traceScore >= 70 ? 'good' : 'bad'}">${view.traceScore >= 70 ? '✓ Nice tracing!' : 'Keep going. Try to cover the whole shape and stay inside the lines.'} Score: ${view.traceScore}%</div>` : ''}
        <div class="row" style="margin-top:.8rem;justify-content:center">
          <button class="btn" data-act="trace-clear">Clear</button>
          <button class="btn primary" data-act="trace-check">Check</button>
          <button class="btn" data-act="trace-next">Next letter →</button></div>
        <p class="center small muted">Traced successfully: ${d.tracing[L.char] || 0}×</p></div>`;
    } else if (view.tab === 'quiz') {
      if (!view.quiz) {
        const qs = isAr(lang) ? letterQuiz(lang) : accentQuiz(lang);
        view.quiz = newQuiz(qs, 'practice', (q) => {
          const score = pct(q.correct, q.questions.length);
          d.checks.readQuiz = Math.max(d.checks.readQuiz || 0, score);
          E.logPractice(d, 'reading', score);
          award(q.correct * 5);
        });
      }
      const q = view.quiz;
      body = `<div class="card">${q.done ? `<div class="center"><div class="score-big">${pct(q.correct, q.questions.length)}%</div><p>${q.correct} of ${q.questions.length} correct.</p>
        <button class="btn primary" data-act="readquiz-new">New quiz</button></div>` : quizHtml(q, lang)}</div>`;
    }
    return `<div class="card"><h1>${h(r.title)}</h1>${r.intro.map((p) => `<p>${h(p)}</p>`).join('')}</div>
      <div style="margin-bottom:1rem">${seg}</div>${body}`;
  }

  function keyboard(lang, target) {
    const keys = lang.reading.keyboard || [];
    if (!keys.length) return '';
    return `<div class="kbd ${isAr(lang) ? 'ar' : ''}" ${isAr(lang) ? 'dir="rtl"' : ''} data-target="${target}">
      ${keys.map((k) => `<button type="button" data-act="key" data-key="${h(k)}">${h(k)}</button>`).join('')}
      ${isAr(lang) ? '<button type="button" class="wide" data-act="key" data-key=" ">space</button>' : ''}
      <button type="button" class="wide" data-act="key" data-key="⌫" aria-label="Backspace">⌫</button></div>`;
  }

  // Tracing canvas
  let penSeen = false;      // a stylus has been used this session
  let penMode = 'auto';     // 'auto': ignore finger touches after a stylus is seen; 'any': accept all input
  function updatePenNote() {
    const el = document.getElementById('pen-note');
    if (!el) return;
    el.hidden = !penSeen;
    el.innerHTML = penMode === 'auto'
      ? '✏️ Stylus detected: finger and palm touches are ignored while you trace. <button class="btn" data-act="pen-mode">Allow finger drawing</button>'
      : '✏️ Finger and stylus both draw. <button class="btn" data-act="pen-mode">Stylus only</button>';
  }
  function setupTrace() {
    const guide = document.getElementById('trace-guide');
    const ink = document.getElementById('trace-ink');
    if (!guide || !ink) return;
    const lang = LANGS[route()[0]];
    const dpr = window.devicePixelRatio || 1;
    const size = guide.getBoundingClientRect().width || 300;
    [guide, ink].forEach((c) => { c.width = Math.round(size * dpr); c.height = Math.round(size * dpr); });
    const glyph = guide.dataset.glyph;
    const font = (px) => `${px}px ${isAr(lang) ? getComputedStyle(document.body).getPropertyValue('--font-ar') : getComputedStyle(document.body).getPropertyValue('--font')}`;
    const drawGlyph = (ctx, color, stroke) => {
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = font(size * (glyph.length > 2 ? 0.45 : 0.62));
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.direction = isAr(lang) ? 'rtl' : 'ltr';
      ctx.fillStyle = color;
      ctx.fillText(glyph, size / 2, size * 0.5);
      if (stroke) { ctx.lineWidth = stroke; ctx.strokeStyle = color; ctx.lineJoin = 'round'; ctx.strokeText(glyph, size / 2, size * 0.5); }
      ctx.restore();
    };
    const g = guide.getContext('2d');
    const theme = document.documentElement.dataset.theme;
    const dark = theme ? theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    drawGlyph(g, dark ? '#4a4a52' : '#d6d2c8');
    const ictx = ink.getContext('2d');
    ictx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const brush = size * 0.055;
    ictx.lineWidth = brush;
    ictx.lineCap = 'round';
    ictx.lineJoin = 'round';
    ictx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#0f766e';
    // Apple Pencil / stylus: pressure sets line width; once a pen is seen, finger and palm
    // touches are ignored (palm rejection) unless the learner allows finger drawing again.
    let activeId = null;
    let last = null;
    const pos = (e) => { const b = ink.getBoundingClientRect(); return [(e.clientX - b.left) * (size / b.width), (e.clientY - b.top) * (size / b.height)]; };
    const widthFor = (e) => (e.pointerType === 'pen' ? brush * (0.45 + 0.9 * Math.max(0.15, e.pressure || 0.5)) : brush);
    const accepts = (e) => !(e.pointerType === 'touch' && penSeen && penMode === 'auto');
    const segment = (e) => {
      const [x, y] = pos(e);
      ictx.lineWidth = widthFor(e);
      ictx.beginPath();
      ictx.moveTo(last[0], last[1]);
      ictx.lineTo(x, y);
      ictx.stroke();
      last = [x, y];
    };
    ink.onpointerdown = (e) => {
      if (e.pointerType === 'pen' && !penSeen) { penSeen = true; updatePenNote(); }
      if (activeId !== null || !accepts(e)) return;
      e.preventDefault();
      activeId = e.pointerId;
      try { ink.setPointerCapture(e.pointerId); } catch (err) { /* capture is optional */ }
      last = pos(e);
      last = [last[0] - 0.1, last[1] - 0.1];
      segment(e);
    };
    ink.onpointermove = (e) => {
      if (e.pointerId !== activeId) return;
      const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [];
      (events.length ? events : [e]).forEach(segment);
    };
    ink.onpointerup = ink.onpointercancel = (e) => { if (e.pointerId === activeId) { activeId = null; last = null; } };
    updatePenNote();
    view.traceCheck = () => {
      const w = ink.width, hgt = ink.height;
      const mk = (stroke) => { const c = document.createElement('canvas'); c.width = w; c.height = hgt; const x = c.getContext('2d'); drawGlyph(x, '#000', stroke); return x.getImageData(0, 0, w, hgt).data; };
      const shape = mk(0);
      const zone = mk(brush * 1.6); // tolerance band around the glyph
      const inkData = ictx.getImageData(0, 0, w, hgt).data;
      let glyphPx = 0, covered = 0, inkPx = 0, inside = 0;
      const step = Math.max(2, Math.round(dpr * 2));
      for (let y = 0; y < hgt; y += step) {
        for (let x = 0; x < w; x += step) {
          const k = (y * w + x) * 4 + 3;
          const isInk = inkData[k] > 100;
          if (shape[k] > 128) { glyphPx++; if (isInk) covered++; }
          if (isInk) { inkPx++; if (zone[k] > 60) inside++; }
        }
      }
      if (inkPx < 10 || !glyphPx) return 0;
      const coverage = Math.min(1, covered / glyphPx / 0.7);
      const precision = inside / inkPx;
      return Math.round(100 * (0.55 * coverage + 0.45 * precision));
    };
    view.traceClear = () => { ictx.clearRect(0, 0, size, size); };
  }

  // ---------------------------------------------------------------- scenarios
  function scenarioList(lang) {
    setChrome('Real-World Scenarios', `#/${lang.id}`, lang.id);
    const d = lp(lang.id);
    const items = lang.scenarios.map((s) => {
      const rec = d.scenarios[s.id];
      return `<a class="tile" href="#/${lang.id}/scenario/${s.id}"><span class="emoji">${s.emoji}</span><span class="title">${h(s.title)}</span>
        <span class="sub">${h(s.setting)}</span><span class="sub">🎯 ${h(s.goal)}</span>
        <span class="meta">${levelChip(s.level)}${rec ? `<span class="chip done">Best ${rec.best}%</span>` : ''}</span></a>`;
    }).join('');
    return `<div class="lesson-head"><h1>🎭 Real-World Scenarios</h1><p class="muted">Role-play everyday situations. Choose what you'd say. If you get it wrong, you'll get feedback and can try again. You score points for answers you get right first time.</p></div>
      <div class="grid">${items}</div>`;
  }

  function scenarioView(lang, id) {
    const s = lang.scenarios.find((x) => x.id === id);
    if (!s) return notFound(lang);
    setChrome(s.title, `#/${lang.id}/scenarios`, lang.id);
    if (!view) view = { step: 0, log: [], tried: [], resolved: null, firstTry: 0, choiceSteps: s.steps.filter((x) => x.choices).length, finished: false, showEn: false, busy: true };
    const bubble = (who, p, cls, extra) => `<div class="bubble ${cls}"><span class="who">${h(who)}</span>
      ${p.t ? `<div class="t ${isAr(lang) ? 'ar' : ''}" lang="${lang.id}" dir="${lang.dir}">${h(p.t)}${cls === 'npc' ? speakBtn(p.t, lang) : ''}</div>` : ''}
      ${p.tr ? `<div class="tr">${h(p.tr)}</div>` : ''}
      ${(view.showEn || cls !== 'npc' || !p.t) && p.en ? `<div class="en">${h(p.en)}</div>` : ''}
      ${p.note && view.showEn ? `<div class="note">💡 ${h(p.note)}</div>` : ''}${extra || ''}</div>`;
    const logHtml = view.log.map((b) => bubble(b.who, b.p, b.cls, b.fb ? `<div class="note">${b.ok ? '✓' : ''} ${h(b.fb)}</div>` : '')).join('');
    let current = '';
    if (view.finished) {
      const score = pct(view.firstTry, view.choiceSteps);
      current = `<div class="card center" style="margin-top:1rem"><div class="score-big">${score}%</div>
        <p>You answered ${view.firstTry} of ${view.choiceSteps} correctly on your first try.</p>
        <div class="row" style="justify-content:center"><button class="btn" data-act="sc-restart">Play again</button><a class="btn primary" href="#/${lang.id}/scenarios">More scenarios</a></div></div>`;
    } else {
      const st = s.steps[view.step];
      if (st.line) current += bubble(st.speaker || '', st.line, 'npc');
      if (st.choices) {
        if (view.resolved !== null) {
          const c = st.choices[view.resolved];
          current += st.mode === 'understand'
            ? `<div class="feedback good">✓ ${h(c.en)}<span class="detail">${h(c.feedback)}</span></div>`
            : bubble('You', c, 'me', `<div class="note">✓ ${h(c.feedback)}</div>`);
          current += `<div class="row" style="margin-top:.6rem"><button class="btn primary" data-act="sc-continue">Continue →</button></div>`;
        } else {
          const lastWrong = view.tried.length ? st.choices[view.tried[view.tried.length - 1]] : null;
          current += `<div class="prompt">${st.mode === 'understand' ? '👂 ' : '🗣️ '}${h(st.prompt || 'What do you say?')}</div>
            <div class="options">${st.choices.map((c, i) => `<button class="option ${view.tried.includes(i) ? 'wrong' : ''}" data-act="sc-pick" data-i="${i}" ${view.tried.includes(i) ? 'disabled' : ''}>
              ${st.mode === 'understand' ? h(c.en) : `<span lang="${lang.id}" dir="${lang.dir}" class="${isAr(lang) ? 'ar' : ''}" style="font-size:${isAr(lang) ? '1.3rem' : '1.05rem'}">${h(c.t)}</span>${c.tr ? `<span class="opt-tr">${h(c.tr)}</span>` : ''}${view.showEn ? `<span class="opt-en">${h(c.en)}</span>` : ''}`}
            </button>`).join('')}</div>
            ${lastWrong ? `<div class="feedback bad">✗ ${h(lastWrong.feedback)}</div>` : ''}`;
        }
      } else {
        if (st.prompt) current += `<div class="prompt">${h(st.prompt)}</div>`;
        current += `<div class="row" style="margin-top:.6rem"><button class="btn primary" data-act="sc-continue">Continue →</button></div>`;
      }
    }
    return `<div class="card"><div class="row spread"><div><h1 style="margin-bottom:.2rem">${s.emoji} ${h(s.title)}</h1><p class="muted" style="margin:0">${h(s.setting)}</p></div>${levelChip(s.level)}</div>
        <p style="margin:.6rem 0 0"><b>Goal:</b> ${h(s.goal)}</p>
        <div class="row" style="margin-top:.6rem"><label class="row small"><input type="checkbox" data-change="sc-en" ${view.showEn ? 'checked' : ''}> Show English translations</label>
        ${!view.finished ? `<span class="small muted">Step ${view.step + 1} of ${s.steps.length}</span>` : ''}</div></div>
      <div class="chat">${logHtml}${current}</div>`;
  }

  function scenarioPick(lang, i) {
    const s = lang.scenarios.find((x) => x.id === route()[2]);
    const st = s.steps[view.step];
    const c = st.choices[i];
    if (c.correct) {
      if (!view.tried.length) view.firstTry++;
      view.resolved = i;
    } else if (!view.tried.includes(i)) view.tried.push(i);
    render();
  }

  function scenarioContinue(lang) {
    const s = lang.scenarios.find((x) => x.id === route()[2]);
    const st = s.steps[view.step];
    if (st.line) view.log.push({ who: st.speaker || '', p: st.line, cls: 'npc' });
    if (st.choices && view.resolved !== null) {
      const c = st.choices[view.resolved];
      if (st.mode === 'understand') view.log.push({ who: 'You understood', p: { en: c.en }, cls: 'me', fb: c.feedback, ok: true });
      else view.log.push({ who: 'You', p: c, cls: 'me', fb: c.feedback, ok: true });
    }
    view.tried = [];
    view.resolved = null;
    if (view.step + 1 < s.steps.length) view.step++;
    else {
      view.finished = true;
      const d = lp(lang.id);
      const score = pct(view.firstTry, view.choiceSteps);
      const prev = d.scenarios[s.id];
      d.scenarios[s.id] = { best: Math.max(score, prev ? prev.best : 0), at: new Date().toISOString() };
      E.logPractice(d, 'speaking', score);
      award(view.firstTry * 5 + (prev ? 0 : 15));
    }
    render();
    requestAnimationFrame(() => { const last = app.querySelector('.chat > :last-child'); last && last.scrollIntoView({ behavior: 'smooth', block: 'end' }); });
  }

  // ---------------------------------------------------------------- translator
  function translateView(lang) {
    setChrome('Offline Translator', `#/${lang.id}`, lang.id);
    if (!view) view = { dir: 'auto', text: '' };
    const dirs = [['auto', 'Auto-detect'], ['toEn', `${lang.name} → English`], ['fromEn', `English → ${lang.name}`]];
    const phrasebook = lang.dictionary.filter((e) => e.t.includes(' ')).slice(0, 18);
    const saved = lp(lang.id).saved;
    return `<div class="card">
        <div class="row spread"><h1 style="margin:0">🔄 Translator</h1><span class="chip">Works offline</span></div>
        <p class="muted small">Looks up phrases first, then translates word by word from the built-in dictionary of ${lang.dictionary.length} entries. Grammar isn't rearranged, so treat the result as a guide.</p>
        <div class="seg" style="margin-bottom:.7rem">${dirs.map(([k, l]) => `<button aria-pressed="${view.dir === k}" data-act="tr-dir" data-dir="${k}">${h(l)}</button>`).join('')}</div>
        <textarea class="input ${isAr(lang) && view.dir === 'toEn' ? 'ar' : ''}" id="tr-input" dir="auto" placeholder="Type in English or ${h(lang.name)}…" autocomplete="off" spellcheck="false">${h(view.text)}</textarea>
        ${keyboard(lang, 'tr-input')}
        <div id="tr-result" style="margin-top:1rem">${translationResult(lang)}</div>
      </div>
      <div class="card"><h2>📖 Phrasebook</h2><p class="small muted">Tap a phrase to translate it.</p>
        <div class="pill-list">${phrasebook.map((e) => `<button class="pill" data-act="tr-fill" data-text="${h(e.t)}"><span class="${isAr(lang) ? 'ar' : ''}" lang="${lang.id}">${h(e.t)}</span> · ${h(E.primaryEnglish(e.en))}</button>`).join('')}</div></div>
      <div class="card"><h2>⭐ Saved words (${saved.length})</h2>
        ${saved.length ? `<div class="phrases">${saved.map((p, i) => `<div class="phrase"><div class="top">${tText(p.t, lang)}<span class="row">${speakBtn(p.t, lang)}<button class="icon-btn" data-act="tr-unsave" data-i="${i}" aria-label="Remove">✕</button></span></div>
          ${p.tr ? `<div class="tr">${h(p.tr)}</div>` : ''}<div class="en">${h(p.en)}</div></div>`).join('')}</div>` : '<p class="muted small">Save translations to build your own word list. Saved words are kept with your progress.</p>'}</div>`;
  }

  function translationResult(lang) {
    const text = view.text.trim();
    if (!text) return '<p class="muted small">Results appear as you type.</p>';
    const idx = index(lang.id);
    const dir = view.dir === 'auto' ? E.detectDirection(text, lang, idx) : view.dir;
    const r = E.translate(text, lang, dir, idx);
    view.last = { r, dir };
    const outIsTarget = dir === 'fromEn';
    const outAttr = outIsTarget ? `lang="${lang.id}" dir="${lang.dir}"` : 'lang="en"';
    const savedAlready = lp(lang.id).saved.some((s) => s.t === (outIsTarget ? r.output : text));
    return `<div class="small muted">${dir === 'toEn' ? `${h(lang.name)} → English` : `English → ${h(lang.name)}`}${view.dir === 'auto' ? ' (detected)' : ''}</div>
      <div class="tr-out ${outIsTarget && isAr(lang) ? 'ar' : ''}" ${outAttr}>${h(r.output)} ${outIsTarget ? speakBtn(r.output.replace(/\[[^\]]*\]/g, ''), lang) : speakBtn(text, lang)}</div>
      ${r.outputTr ? `<div class="reveal-tr">${h(r.outputTr)}</div>` : ''}
      <div class="row small" style="margin-top:.4rem">
        <span class="${r.coverage === 1 ? 'ok' : 'muted'}">${r.exact ? '✓ Exact phrase match' : `${Math.round(r.coverage * 100)}% of words found`}</span>
        ${r.coverage > 0 ? `<button class="btn" data-act="tr-save" ${savedAlready ? 'disabled' : ''}>${savedAlready ? '★ Saved' : '☆ Save'}</button>` : ''}</div>
      ${r.tokens.length > 1 || !r.exact ? `<div class="gloss">${r.tokens.map((t) => `<span class="${t.how === 'none' ? 'none' : ''}"><b dir="auto">${h(t.src)}</b> → <span dir="auto">${h(t.out)}</span>${t.tr && dir === 'fromEn' ? ` <i>${h(t.tr)}</i>` : ''}</span>`).join('')}</div>` : ''}`;
  }

  // ---------------------------------------------------------------- aptitude test
  function testView(lang) {
    setChrome('Aptitude Test', `#/${lang.id}`, lang.id);
    const d = lp(lang.id);
    if (!view) view = { phase: 'intro' };
    if (view.phase === 'intro') {
      const levels = [...new Set(lang.aptitude.map((q) => q.level))];
      const hist = d.aptitude.slice().reverse().slice(0, 5);
      return `<div class="card"><h1>🎯 ${h(lang.name)} Aptitude Test</h1>
          <p>${lang.aptitude.length} questions covering grammar, vocabulary, reading and culture at levels ${levels.join(', ')}. It takes about 5 minutes.</p>
          <p class="muted small">There's no feedback during the test, so answer honestly; you can review your answers at the end. Your level is the highest level where you get at least ${Math.round(E.PASS * 100)}% right, as long as you also passed every level below it. If you score 80% or more on the top level, the test recommends C1.</p>
          <button class="btn primary" data-act="test-start">Start the test</button></div>
        ${hist.length ? `<div class="card"><h2>Past results</h2>${hist.map((r) => `<div class="row spread review-item"><span>${new Date(r.at).toLocaleDateString()}</span><span>${r.score}/${r.total}</span>${levelChip(r.level)}</div>`).join('')}</div>` : ''}`;
    }
    if (view.phase === 'run') {
      return `<div class="card"><h2>🎯 Aptitude Test</h2>${quizHtml(view.quiz, lang)}</div>`;
    }
    const r = view.result;
    const lessons = allLessons(lang).filter((l) => l.level === r.level || (r.level === 'C1' && l.level === 'B2'));
    const media = lang.media.filter((m) => m.level === r.level);
    const lvlBars = E.LEVELS.filter((l) => r.byLevel[l]).map((l) => `<div class="lvl"><b>${l}</b>${bar(pct(r.byLevel[l].c, r.byLevel[l].t))}<span>${r.byLevel[l].c}/${r.byLevel[l].t}</span></div>`).join('');
    const skillBars = Object.entries(r.bySkill).map(([k, v]) => `<div class="lvl" style="grid-template-columns:6rem 1fr 3rem"><span style="text-transform:capitalize">${h(k)}</span>${bar(pct(v.c, v.t))}<span>${v.c}/${v.t}</span></div>`).join('');
    const review = lang.aptitude.map((q, i) => {
      const a = view.quiz.answers[i];
      const ok = a === q.answer;
      return `<div class="review-item"><span class="${ok ? 'ok' : 'no'}">${ok ? '✓' : '✗'}</span> <b>${h(q.level)}</b> ${h(q.q)} ${q.t ? `<span lang="${lang.id}" dir="${lang.dir}">${h(q.t)}</span>` : ''}
        <div class="small">${ok ? '' : `Your answer: <span dir="auto">${h(q.options[a] != null ? q.options[a] : '-')}</span> · `}Correct: <span dir="auto">${h(q.options[q.answer])}</span>${q.explain ? ` · <span class="muted">${h(q.explain)}</span>` : ''}</div></div>`;
    }).join('');
    return `<div class="card center"><p class="muted">Your estimated level</p><div class="score-big">${h(r.level)}</div>
        <h2>${h(E.LEVEL_NAMES[r.level])}${r.beginner ? ': start at the beginning' : ''}</h2><p>${r.score} of ${r.total} correct · saved to your progress</p>
        <div class="row" style="justify-content:center"><button class="btn" data-act="test-again">Retake</button><a class="btn primary" href="#/${lang.id}/media">🎬 Media for ${h(r.level)}</a></div></div>
      <div class="grid"><div class="card level-bars"><h3>By level</h3>${lvlBars}</div><div class="card level-bars"><h3>By skill</h3>${skillBars}</div></div>
      ${lessons.length ? `<div class="card"><h2>Recommended lessons</h2><div class="grid">${lessons.map((l) => `<a class="tile" href="#/${lang.id}/lesson/${l.id}"><span class="title">${l.cat.emoji} ${h(l.title)}</span><span class="meta">${levelChip(l.level)}</span></a>`).join('')}</div></div>` : ''}
      ${media.length ? `<div class="card"><h2>Try these at your level</h2><ul>${media.map((m) => `<li><b>${h(m.title)}</b>: ${h(m.why)}</li>`).join('')}</ul></div>` : ''}
      <details class="card"><summary><b>Review your answers</b></summary>${review}</details>`;
  }

  // ---------------------------------------------------------------- media
  function mediaView(lang) {
    setChrome('Media Picks', `#/${lang.id}`, lang.id);
    const d = lp(lang.id);
    const placed = d.aptitude.length ? d.aptitude[d.aptitude.length - 1].level : null;
    if (!view) view = { level: placed || 'all' };
    const levels = ['all', ...E.LEVELS];
    const items = lang.media.filter((m) => view.level === 'all' || m.level === view.level);
    return `<div class="lesson-head"><h1>🎬 Media Picks</h1><p class="muted">Films, TV, books, music and podcasts chosen for each level. ${placed ? `Your tested level is <b>${h(placed)}</b>.` : `<a href="#/${lang.id}/test">Take the aptitude test</a> to see picks for your level.`}</p></div>
      <div class="seg" style="margin-bottom:1rem">${levels.map((l) => `<button aria-pressed="${view.level === l}" data-act="media-level" data-level="${l}">${l === 'all' ? 'All levels' : l}${l === placed ? ' ★' : ''}</button>`).join('')}</div>
      <div class="grid">${items.map((m) => `<div class="card media-card"><div class="row spread"><span class="type">${h(m.type)}</span>${levelChip(m.level)}</div>
        <h3>${h(m.title)}</h3>${m.creator ? `<div class="small muted">${h(m.creator)}</div>` : ''}<p class="small" style="margin-top:.5rem">${h(m.why)}</p>
        <div class="small muted">📍 ${h(m.source)}</div><div class="tags">${m.skills.map((s) => `<span>${h(s)}</span>`).join('')}</div></div>`).join('')}</div>`;
  }

  // ---------------------------------------------------------------- fluency
  const SKILL_META = {
    reading: { label: 'Reading', icon: '📖', series: 'var(--series-2)', tip: 'Finish lessons, review your words and do letter / accent quizzes.', link: 'review' },
    writing: { label: 'Writing', icon: '✍️', series: 'var(--series-3)', tip: 'Do the Write and Trace exercises, and free writing in the Writing Studio.', link: 'write' },
    listening: { label: 'Listening', icon: '🎧', series: 'var(--series-5)', tip: 'Do dictations and comprehension in Listening, and play the scenarios.', link: 'listen' },
    speaking: { label: 'Speaking', icon: '🎙️', series: 'var(--series-4)', tip: 'Repeat phrases and answer prompts in Speaking Practice, and play the scenarios.', link: 'speak' },
    overall: { label: 'Overall', icon: '🏁', series: 'var(--series-1)' },
  };

  function fluencyCard(lang) {
    const f = E.fluency(lang, lp(lang.id));
    const row = (k) => `<div class="lvl" style="grid-template-columns:6.5rem 1fr 4.2rem"><span>${SKILL_META[k].icon} ${SKILL_META[k].label}</span>${bar(f[k].score)}<span class="small"><b>${f[k].score}</b> · ${f[k].band}</span></div>`;
    return `<a class="tile level-bars" href="#/${lang.id}/fluency"><span class="title">Progress to fluency</span>
      <span class="sub">Estimated level <b>${h(f.overall.band)}</b>. Tap for details and your trend.</span>
      <div style="margin-top:.5rem">${[...E.SKILLS, 'overall'].map(row).join('')}</div></a>`;
  }

  function trendChart(entries) {
    if (entries.length < 2) {
      return '<p class="small muted">Your trend appears here after you practice on two different days.</p>';
    }
    const W = 640, H = 220, L = 34, Rr = 96, T = 12, B = 26;
    const xs = (i) => L + (i * (W - L - Rr)) / (entries.length - 1);
    const ys = (v) => T + ((100 - v) * (H - T - B)) / 100;
    const keys = ['overall', 'reading', 'writing', 'listening', 'speaking'];
    const grid = [0, 25, 50, 75, 100].map((v) => `<line x1="${L}" x2="${W - Rr}" y1="${ys(v)}" y2="${ys(v)}" class="grid"/><text x="${L - 6}" y="${ys(v) + 4}" text-anchor="end" class="axis">${v}</text>`).join('');
    const lines = keys.map((k) => `<polyline fill="none" stroke="${SKILL_META[k].series}" stroke-width="${k === 'overall' ? 3 : 2}" stroke-linejoin="round" stroke-linecap="round" points="${entries.map((e, i) => `${xs(i)},${ys(e[k])}`).join(' ')}"/>`).join('');
    // Direct end labels, nudged apart so they don't collide.
    const ends = keys.map((k) => ({ k, y: ys(entries[entries.length - 1][k]) })).sort((a, b) => a.y - b.y);
    for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 17) ends[i].y = ends[i - 1].y + 17;
    const overflow = ends.length ? ends[ends.length - 1].y - (H - B) : 0;
    if (overflow > 0) ends.forEach((e) => { e.y -= overflow; });
    const labels = ends.map((e) => `<text x="${W - Rr + 6}" y="${e.y + 4}" class="lbl">${SKILL_META[e.k].label}</text>`).join('');
    const first = entries[0].day, last = entries[entries.length - 1].day;
    const hits = entries.map((e, i) => `<rect class="hit" x="${xs(i) - (W - L - Rr) / (entries.length - 1) / 2}" y="${T}" width="${(W - L - Rr) / (entries.length - 1)}" height="${H - T - B}" data-tip="${h(`${e.day}: overall ${e.overall} · reading ${e.reading} · writing ${e.writing} · listening ${e.listening} · speaking ${e.speaking}`)}" data-x="${xs(i)}"/>`).join('');
    return `<div class="trend" role="img" aria-label="Fluency scores over time, ${first} to ${last}">
      <div class="legend">${keys.map((k) => `<span><i style="background:${SKILL_META[k].series}"></i>${SKILL_META[k].label}</span>`).join('')}</div>
      <svg viewBox="0 0 ${W} ${H}">${grid}${lines}${labels}
        <line class="cross" x1="0" x2="0" y1="${T}" y2="${H - B}" visibility="hidden"/>
        <text x="${L}" y="${H - 6}" class="axis">${h(first)}</text><text x="${W - Rr}" y="${H - 6}" text-anchor="end" class="axis">${h(last)}</text>${hits}</svg>
      <div class="tip small" aria-live="polite"></div></div>`;
  }

  function fluencyView(lang) {
    setChrome('Progress to Fluency', `#/${lang.id}`, lang.id);
    const d = lp(lang.id);
    const f = E.fluency(lang, d);
    const skill = (k) => {
      const x = f[k];
      return `<div class="card"><div class="row spread"><h2 style="margin:0">${SKILL_META[k].icon} ${SKILL_META[k].label}</h2><span class="chip level">${x.band}</span></div>
        <div class="score-big" style="margin:.4rem 0">${x.score}<span class="small muted">/100</span></div>${bar(x.score)}
        <div class="level-bars small" style="margin-top:.8rem">
          ${x.parts.map((p) => `<div class="lvl" style="grid-template-columns:9.5rem 1fr 4rem"><span>${h(p.label)}</span>${bar(pct(p.done, p.total))}<span>${p.done}/${p.total}</span></div>`).join('')}
          <div class="lvl" style="grid-template-columns:9.5rem 1fr 4rem"><span>Recent accuracy</span>${bar(x.accuracy || 0)}<span>${x.accuracy === null ? 'none yet' : `${x.accuracy}%`}</span></div></div>
        <p class="small muted" style="margin-top:.6rem">${x.samples ? `Based on your last ${x.samples} scored attempts.` : 'No scored attempts yet, so this skill can reach at most 60.'} ${h(SKILL_META[k].tip)}</p>
        <a class="btn" href="#/${lang.id}/${SKILL_META[k].link}">Practice ${SKILL_META[k].label.toLowerCase()}</a></div>`;
    };
    const rows = d.fluency.slice().reverse().slice(0, 30);
    return `<div class="card center"><p class="muted" style="margin:0">Overall fluency</p><div class="score-big">${f.overall.score}<span class="small muted">/100</span></div>
        <h2>Estimated level ${h(f.overall.band)} · ${h(E.LEVEL_NAMES[f.overall.band])}</h2>
        <p class="small muted">The average of reading, writing, listening and speaking${f.overall.testLevel ? `, blended with your latest aptitude test (${h(f.overall.testLevel)})` : ''}. ${f.overall.testLevel ? '' : `<a href="#/${lang.id}/test">Take the aptitude test</a> to include it.`}</p></div>
      ${hayya(f.overall.score >= 80 ? 'You are in C1 territory here. Now the biggest gains come from real conversations and native media. Go talk to people!' : `Steady practice wins. Your lowest skill is ${SKILL_META[E.SKILLS.slice().sort((a, b) => f[a].score - f[b].score)[0]].label.toLowerCase()}: a few minutes on it each day lifts your overall score fastest.`, { mood: f.overall.score >= 80 ? 'cheer' : 'think' })}
      <div class="grid two" style="margin-top:1rem">${E.SKILLS.map(skill).join('')}</div>
      ${pathToFluency(lang, d)}
      <div class="card"><h2>Your trend</h2>${trendChart(d.fluency.slice(-60))}
        ${rows.length ? `<details><summary class="small">Show as a table</summary><div class="table-wrap"><table><thead><tr><th>Day</th><th>Overall</th><th>Reading</th><th>Writing</th><th>Listening</th><th>Speaking</th></tr></thead>
          <tbody>${rows.map((r) => `<tr><td>${h(r.day)}</td><td>${r.overall}</td><td>${r.reading}</td><td>${r.writing}</td><td>${r.listening}</td><td>${r.speaking}</td></tr>`).join('')}</tbody></table></div></details>` : ''}</div>
      <details class="card"><summary><b>How fluency is calculated</b></summary>
        <p class="small" style="margin-top:.6rem">Each skill scores 0–100: <b>60% coverage</b> (how much of the course you've practiced in that skill) plus <b>40% accuracy</b> (the average of your last 10 scored attempts). Bands: under 20 = A1, under 40 = A2, under 60 = B1, under 80 = B2, 80+ = C1.</p>
        <ul class="small"><li><b>Reading:</b> letters studied, lessons completed and words learned in Review; accuracy from lesson quizzes, reviews, letter / accent quizzes and challenge reading items.</li>
        <li><b>Writing:</b> writing tasks mastered, letters traced and Writing Studio prompts passed; accuracy from typed answers, tracing, free writing and challenge writing items.</li>
        <li><b>Listening:</b> lines understood (dictation ${E.LISTEN_PASS}%+ or a correct comprehension answer); accuracy from listening practice and challenge listening items.</li>
        <li><b>Speaking:</b> phrases spoken well (${E.SPEAK_PASS}%+), scenarios completed and speaking prompts answered; accuracy from pronunciation scores, spoken answers, scenarios and challenge speaking items.</li></ul>
        <p class="small muted">This is a study estimate, not an official CEFR certificate.</p></details>`;
  }

  // FSI's published estimate to professional working proficiency (ILR 3, roughly C1).
  const FSI_NOTE = {
    ar: 'The US Foreign Service Institute puts Arabic in its hardest category: about 2,200 classroom hours (88 weeks of full-time study) for professional working proficiency, roughly C1.',
    es: 'The US Foreign Service Institute puts Spanish in its easiest category: about 600–750 classroom hours (24–30 weeks of full-time study) for professional working proficiency, roughly C1.',
  };

  function pathToFluency(lang, d) {
    const t = E.studyTime(lang, d);
    const hrs = (m) => (m >= 60 ? `${(m / 60).toFixed(1)} h` : `${m} min`);
    const rows = E.LEVELS.map((l) => {
      const need = t.levelHours[l];
      const done = Math.min(100, Math.round((t.hours / need) * 100));
      return `<tr><td>${levelChip(l)}</td><td class="num">${need} h</td><td style="min-width:7rem">${bar(done)}</td><td class="small">${h(LIB.levelGuide[l].cefr)}</td></tr>`;
    }).join('');
    return `<div class="card"><h2>🧭 Your path to fluency</h2>
      <div class="row" style="gap:1.5rem;margin:.4rem 0 .8rem"><div><div class="score-big" style="font-size:2rem">${hrs(t.minutes)}</div><div class="small muted">active study time in this app</div></div>
        <div><div class="score-big" style="font-size:2rem">${hrs(t.weekMinutes)}</div><div class="small muted">in the last 7 days</div></div></div>
      <p class="small">${h(FSI_NOTE[lang.id] || '')} The hours for the earlier levels are our estimates. Self-study usually takes longer than full-time classes, and time counts here only while you're actively using the app. The level descriptions follow the Council of Europe's CEFR.</p>
      <div class="table-wrap"><table><thead><tr><th>Level</th><th>Hours</th><th>Your time</th><th>What you can do (CEFR)</th></tr></thead><tbody>${rows}</tbody></table></div>
      <h3 style="margin-top:1rem">Beyond the app</h3>
      <ul class="small">
        <li><b>Talk to people every week.</b> A tutor (for example on italki or Preply) or a language exchange (Tandem, HelloTalk, local meetups) is the fastest way to fluency. Bring this app's scenarios and speaking prompts as conversation topics.</li>
        <li><b>Take a free university or government course.</b> <a href="#/${lang.id}/resources">Free Courses &amp; Resources</a> lists options from your level up.</li>
        <li><b>Listen for hours.</b> Climb the Media Picks ladder: move up a level when you understand most of what you hear.</li>
        <li><b>Read real texts.</b> News sites, children's books, then novels. Save new words in the translator and they'll appear in Review.</li>
        ${isAr(lang) ? '<li><b>Pick a dialect.</b> Use the Egyptian or Levantine lessons, then watch shows in that dialect.</li>' : '<li><b>Spend time in Mexico if you can.</b> Even a week of immersion makes everything here click.</li>'}
      </ul></div>`;
  }

  // ---------------------------------------------------------------- learning plan
  function planHref(lang, t) {
    const base = `#/${lang.id}/`;
    switch (t.view) {
      case 'read': return `${base}read/${t.tab}`;
      case 'lesson': return `${base}lesson/${t.id}`;
      case 'scenario': return `${base}scenario/${t.id}`;
      case 'write': return `${base}write/${t.id}`;
      case 'speak': return t.tab ? `${base}speak/${t.tab}` : `${base}speak`;
      default: return base + t.view;
    }
  }
  const DIALECT_LABELS = [['lev', 'Levantine', 'Syria, Lebanon, Jordan, Palestine'], ['egy', 'Egyptian', 'Egypt; widely understood from films and TV'], ['both', 'Both', 'Learn both spoken varieties'], ['msa', 'Formal only', 'Modern Standard Arabic for reading and news']];
  function dialectPicker(lang, current) {
    return `<div class="seg plan-dialect" role="group" aria-label="Spoken Arabic">${DIALECT_LABELS.map(([k, label, sub]) => `<button aria-pressed="${current === k}" data-act="plan-dialect" data-dialect="${k}" title="${h(sub)}">${label}</button>`).join('')}</div>`;
  }
  function welcomeCard(lang) {
    const ar = isAr(lang);
    const choices = [
      ['zero', '🌱', ar ? "I'm brand new to Arabic" : "I'm brand new to Spanish", 'Start with the alphabet. No experience needed.'],
      ...(ar ? [['script', '📖', 'I can read the Arabic script', 'Skip the alphabet and start with the A1 lessons.']] : []),
      ['test', '🎯', ar ? 'I already know some Arabic' : 'I already know some Spanish', 'Take a five-minute placement test; your plan starts at your level.'],
    ];
    const settings = E.planSettings(lang, lp(lang.id));
    return `<div class="card welcome">
      ${hayya(`Welcome to ${h(lang.name)}! Let's build your plan. Which sounds like you?`, { mood: 'cheer', size: 56 })}
      <div class="welcome-choices">${choices.map(([k, emoji, title, sub]) => `<button class="tile" data-act="plan-start" data-start="${k}"><span class="emoji">${emoji}</span><span class="title">${h(title)}</span><span class="sub">${h(sub)}</span></button>`).join('')}</div>
      ${ar ? `<p class="small" style="margin:.8rem 0 .4rem"><b>Which spoken Arabic do you want alongside formal Arabic?</b> Formal Arabic is for reading, writing and the news; people speak a dialect day to day.</p>${dialectPicker(lang, settings.dialect)}` : ''}
      <p class="small muted" style="margin-top:.8rem">You can change these any time from your learning plan. Everything below stays open if you'd rather explore.</p></div>`;
  }
  function planCard(lang, plan, sr) {
    const today = !lp(lang.id).challenges[E.localDay()];
    const extras = [sr.due ? `<a class="chip" href="#/${lang.id}/review">🔁 ${sr.due} review${sr.due === 1 ? '' : 's'} due</a>` : '', today ? `<a class="chip" href="#/${lang.id}/challenge">⚡ Daily challenge</a>` : ''].join('');
    const body = plan.next
      ? `<a class="tile plan-next" href="${planHref(lang, plan.next.target)}"><span class="small muted">Next step · ${h(plan.nextUnit.title)}</span>
          <span class="title">${h(plan.next.title)}</span><span class="sub">${h(plan.next.why)}</span>
          ${plan.next.progress ? `<span class="meta small muted">${plan.next.progress[0]}/${plan.next.progress[1]} so far</span>` : ''}</a>`
      : `<p>🎉 You've finished every step in your plan. Keep reviewing, read and listen widely, and talk to people as often as you can.</p>`;
    return `<div class="card plan-card"><div class="row spread"><h2 style="margin:0">🧭 Your learning plan</h2><a class="small" href="#/${lang.id}/plan">See the full plan →</a></div>
      <div style="margin:.6rem 0">${bar(pct(plan.done, plan.total))}</div><p class="small muted" style="margin:0 0 .6rem">${plan.done} of ${plan.total} steps done</p>
      ${body}${extras ? `<div class="row" style="margin-top:.6rem;gap:.4rem"><span class="small muted">Also today:</span>${extras}</div>` : ''}</div>`;
  }
  function planView(lang) {
    setChrome('Learning plan', `#/${lang.id}`, lang.id);
    const d = lp(lang.id);
    const plan = E.learningPlan(lang, d);
    if (plan.needsSetup) return welcomeCard(lang);
    const startLabel = { zero: 'Starting from zero, with the alphabet', script: 'Skipping the alphabet (you read the script)', test: plan.placed ? `Starting at your tested level, ${plan.placed}` : 'Starting with the placement test' }[plan.settings.start];
    const units = plan.units.map((u) => {
      const isCurrent = plan.nextUnit === u;
      const steps = u.steps.map((st) => {
        const status = st.done ? 'done' : st === plan.next ? 'next' : '';
        return `<a class="plan-step ${status}" href="${planHref(lang, st.target)}"><span class="plan-icon" aria-hidden="true">${st.done ? '✓' : st === plan.next ? '▶' : '○'}</span>
          <span class="plan-text"><span class="plan-title">${h(st.title)}</span><span class="small muted">${h(st.why)}</span></span>
          ${st.progress && !st.done ? `<span class="small muted plan-count">${st.progress[0]}/${st.progress[1]}</span>` : ''}</a>`;
      }).join('');
      return `<details class="card plan-unit" ${isCurrent ? 'open' : ''}><summary><span class="row spread" style="width:100%"><span><b>${h(u.title)}</b>${u.skipped ? ' <span class="chip">tested out</span>' : ''}</span><span class="small muted">${u.done}/${u.total}</span></span></summary>
        <p class="small muted">${h(u.intro)}${u.skipped ? ' You tested above this unit, so the plan skips it; open any step to review.' : ''}</p>${bar(pct(u.done, u.total))}
        <div class="plan-steps">${steps}</div></details>`;
    }).join('');
    return `<div class="lesson-head"><h1>🧭 Your learning plan</h1>
        <p class="muted">The recommended order through the whole course. Steps check themselves off as you go, and nothing is locked: jump to anything whenever you like.</p></div>
      <div class="card"><div class="row spread"><span>${h(startLabel)}</span><button class="btn" data-act="plan-reset">Change</button></div>
        ${isAr(lang) ? `<p class="small" style="margin:.8rem 0 .4rem">Spoken Arabic in your plan:</p>${dialectPicker(lang, plan.settings.dialect)}` : ''}
        <div style="margin-top:.8rem">${bar(pct(plan.done, plan.total))}</div><p class="small muted">${plan.done} of ${plan.total} steps done</p></div>
      ${units}`;
  }

  // ---------------------------------------------------------------- free courses & resources
  const levelSpan = (levels) => (levels.length === E.LEVELS.length ? 'All levels' : levels.length === 1 ? levels[0] : `${levels[0]}–${levels[levels.length - 1]}`);
  function resourcesView(lang) {
    setChrome('Free Courses', `#/${lang.id}`, lang.id);
    const band = E.fluency(lang, lp(lang.id)).overall.band;
    if (!view) view = { level: band };
    const list = lang.resources.filter((r) => view.level === 'all' || r.levels.includes(view.level));
    const chips = ['all', ...E.LEVELS].map((l) => `<button aria-pressed="${view.level === l}" data-act="res-level" data-level="${l}">${l === 'all' ? 'All' : l}${l === band ? ' ·you' : ''}</button>`).join('');
    const cards = list.map((r) => `<div class="card"><div class="row spread"><h2 style="margin:0">${h(r.title)}</h2><span class="chip">${h(r.providerType)}</span></div>
        <p class="small muted" style="margin:.3rem 0 .5rem">${h(r.provider)} · ${levelSpan(r.levels)}</p>
        <p>${h(r.what)}</p>${r.note ? `<p class="small muted">${h(r.note)}</p>` : ''}
        <a class="btn primary" href="${h(r.url)}" target="_blank" rel="noopener">Open ↗</a></div>`).join('');
    const guide = [...E.LEVELS, 'C2'].map((l) => `<tr><td>${levelChip(l)}</td><td class="small">${h(LIB.levelGuide[l].cefr)}${l === 'C2' ? ' <span class="muted">(beyond this app)</span>' : ''}</td><td class="small">${h(LIB.levelGuide[l].actfl)}</td></tr>`).join('');
    return `<div class="lesson-head"><h1>🏛️ Free Courses &amp; Resources</h1>
        <p class="muted">Free materials from universities and government bodies only, chosen to sit alongside this app. They open on each provider's website and need an internet connection. Lingua isn't affiliated with any of them.</p></div>
      <div class="seg" role="group" aria-label="Level" style="margin-bottom:1rem;flex-wrap:wrap">${chips}</div>
      <div class="grid">${cards || '<p class="muted">Nothing listed for this level yet.</p>'}</div>
      <div class="card" style="margin-top:1rem"><h2>📏 What the levels mean</h2>
        <p class="small">This app uses the Council of Europe's CEFR levels. Some American resources use the ACTFL scale instead; the right-hand column shows roughly where they meet (ACTFL's own alignment, approximate).</p>
        <div class="table-wrap"><table><thead><tr><th>Level</th><th>What you can do (CEFR)</th><th>≈ ACTFL</th></tr></thead><tbody>${guide}</tbody></table></div></div>`;
  }

  // ---------------------------------------------------------------- review (spaced repetition)
  function reviewView(lang) {
    setChrome('Review', `#/${lang.id}`, lang.id);
    const d = lp(lang.id);
    const day = E.localDay();
    if (!view) view = { queue: E.srsQueue(lang, d, day), i: 0, flipped: false, requeued: new Set(), first: {}, busy: true };
    const st = E.srsStats(lang, d, day);
    const header = `<div class="card"><div class="row spread"><h1 style="margin:0">🔁 Review</h1><span class="chip">${st.learned}/${st.total} words learned</span></div>
      <p class="small muted" style="margin-top:.4rem">Cards come back after 1, 3, 7, 14, 30, 60 and 120 days as you get them right, and start again when you don't. New words unlock when you finish lessons or save them in the translator.</p></div>`;
    if (!view.queue.length || view.i >= view.queue.length) {
      const graded = Object.values(view.first);
      const good = graded.filter((g) => g !== 'again').length;
      if (graded.length && !view.logged) {
        view.logged = true;
        E.logPractice(d, 'reading', pct(good, graded.length));
        award(graded.length);
      }
      return header + (graded.length
        ? hayya(`Done! You remembered <b>${good} of ${graded.length}</b> on the first try. See you at the next review. 🐍`, { mood: 'cheer' })
        : hayya(st.newAvailable || st.due ? 'Ready when you are.' : 'All caught up! Finish a lesson to unlock its words, or save words in the translator to add them here.', { mood: 'sleep' }))
        + `<div class="row" style="margin-top:1rem"><a class="btn primary" href="#/${lang.id}">Back to ${h(lang.name)}</a>${st.due || st.newAvailable ? '<button class="btn" data-act="rv-more">Review more</button>' : ''}</div>`;
    }
    const card = view.queue[view.i];
    const rec = d.srs[card.t];
    const recall = rec && rec.seen >= 2 && card.t.length % 2 === 0;
    const front = recall
      ? `<div class="muted small">How do you say…</div><div class="big" style="font-size:1.8rem">${h(card.en)}</div>`
      : `<div class="big ${isAr(lang) ? 'ar' : ''}" lang="${lang.id}" dir="${lang.dir}">${h(card.t)}</div>`;
    const back = `<div class="big ${isAr(lang) ? 'ar' : ''}" lang="${lang.id}" dir="${lang.dir}" style="font-size:${isAr(lang) ? '2.6rem' : '2.2rem'}">${h(card.t)}</div>
      ${card.tr ? `<div class="reveal-tr">${h(card.tr)}</div>` : ''}<div style="font-size:1.15rem">${h(card.en)}</div>`;
    return header + `<div class="card flash">
      <div class="progress-label">Card ${view.i + 1} of ${view.queue.length} · ${rec ? `box ${rec.box}` : 'new word'}</div>
      ${view.flipped ? back : front}
      <div class="row" style="justify-content:center;margin-top:1rem">${speakBtn(card.t, lang)}
        ${view.flipped
          ? `<button class="btn" data-act="rv-grade" data-g="again">↺ Again</button><button class="btn primary" data-act="rv-grade" data-g="good">✓ Good</button><button class="btn" data-act="rv-grade" data-g="easy">⚡ Easy</button>`
          : '<button class="btn primary" data-act="rv-flip">Show answer</button>'}</div></div>`;
  }

  // ---------------------------------------------------------------- listening
  function listenView(lang) {
    setChrome('Listening', `#/${lang.id}`, lang.id);
    const d = lp(lang.id);
    const all = E.listeningItems(lang);
    if (!view) {
      const cap = E.LEVELS[Math.max(0, E.LEVELS.indexOf(E.fluency(lang, d).overall.band))];
      view = { mode: 'dictation', level: cap, i: -1, typed: '', result: null, picked: null, options: null, showText: !canSpeak, busy: true };
    }
    const pool = all.filter((x) => E.LEVELS.indexOf(x.level) <= E.LEVELS.indexOf(view.level));
    if (view.i < 0 || view.i >= pool.length) view.i = Math.max(0, pool.findIndex((x) => !(d.listening[x.t] && d.listening[x.t].best >= E.LISTEN_PASS)));
    const it = pool[view.i];
    const understood = all.filter((x) => d.listening[x.t] && d.listening[x.t].best >= E.LISTEN_PASS).length;
    if (view.mode === 'meaning' && !view.options) {
      const wrong = shuffle(pool.filter((x) => x.en !== it.en)).slice(0, 3).map((x) => x.en);
      view.options = shuffle([it.en, ...wrong]);
    }
    const textBlock = `<div class="big ${isAr(lang) ? 'ar' : ''}" lang="${lang.id}" dir="${lang.dir}" style="font-size:${isAr(lang) ? '2rem' : '1.6rem'}">${h(it.t)}</div>${it.tr ? `<div class="reveal-tr">${h(it.tr)}</div>` : ''}`;
    let body;
    if (view.mode === 'dictation') {
      const r = view.result;
      body = `<p class="quiz-q">Listen and type exactly what you hear.</p>
        <input class="input ${isAr(lang) ? 'ar' : ''}" id="ls-input" dir="${lang.dir}" lang="${lang.id}" autocomplete="off" autocapitalize="off" spellcheck="false" value="${h(view.typed)}" ${r ? 'disabled' : ''}>
        ${r ? '' : keyboard(lang, 'ls-input')}
        ${r ? `<div class="feedback ${r >= E.LISTEN_PASS ? 'good' : 'bad'}">${r >= E.LISTEN_PASS ? '✓ Great listening!' : 'Not quite. Compare with the line below.'} Score: ${r}%</div>
          <div class="flash" style="padding:.6rem 0">${textBlock}<div>${h(it.en)}</div></div>` : (view.showText ? `<div class="flash" style="padding:.6rem 0">${textBlock}</div>` : '')}
        <div class="row" style="margin-top:.8rem">${r ? '' : '<button class="btn primary" data-act="ls-check">Check</button>'}</div>`;
    } else {
      const answered = view.picked !== null;
      body = `<p class="quiz-q">Listen. What does it mean?</p>
        ${view.showText || answered ? `<div class="flash" style="padding:.4rem 0">${textBlock}</div>` : ''}
        <div class="options">${view.options.map((o, i) => {
          let cls = 'option';
          if (answered) { if (o === it.en) cls += ' correct'; else if (i === view.picked) cls += ' wrong'; }
          return `<button class="${cls}" data-act="ls-pick" data-i="${i}" ${answered ? 'disabled' : ''}>${h(o)}</button>`;
        }).join('')}</div>
        ${answered ? `<div class="feedback ${view.options[view.picked] === it.en ? 'good' : 'bad'}">${view.options[view.picked] === it.en ? '✓ Correct!' : `✗ It means: ${h(it.en)}`}</div>` : ''}`;
    }
    return `<div class="card"><div class="row spread"><h1 style="margin:0">🎧 Listening</h1><span class="chip">${understood}/${all.length} lines understood</span></div>
        <p class="small muted" style="margin-top:.4rem">Real fluency needs hours of listening. Start slow, then switch to natural speed. The voice comes from your device, so it's clearer than real street speech; add native media from Media Picks too.</p>
        <div class="row" style="margin-top:.6rem">
          <div class="seg" role="group" aria-label="Exercise">${[['dictation', 'Dictation'], ['meaning', 'What does it mean?']].map(([k, l]) => `<button aria-pressed="${view.mode === k}" data-act="ls-mode" data-mode="${k}">${l}</button>`).join('')}</div>
          ${speedControl()}
          <label class="small muted">Up to <select class="btn" data-change="ls-level">${E.LEVELS.map((l) => `<option ${l === view.level ? 'selected' : ''}>${l}</option>`).join('')}</select></label></div></div>
      ${canSpeak ? '' : `<div class="banner" style="border-radius:12px;margin-bottom:1rem">Your device has no voice for ${h(lang.name)}, so the text is shown instead. Read it aloud yourself, then answer.</div>`}
      <div class="card">
        <div class="row spread small muted"><span>Line ${view.i + 1} of ${pool.length} · ${levelChip(it.level)}</span><span>${d.listening[it.t] ? `Best ${d.listening[it.t].best}%` : 'Not tried yet'}</span></div>
        <div class="row" style="justify-content:center;margin:.8rem 0">
          ${canSpeak ? `<button class="btn primary" data-act="speak" data-text="${h(it.t)}" data-code="${h(lang.speech)}" style="font-size:1.1rem">▶ Play</button>` : ''}
          ${canSpeak && !view.showText && view.picked === null && !view.result ? '<button class="btn" data-act="ls-show">Show text</button>' : ''}</div>
        ${body}
        <div class="row" style="justify-content:center;margin-top:1rem">
          <button class="btn" data-act="ls-step" data-d="-1" ${view.i === 0 ? 'disabled' : ''}>← Previous</button>
          <button class="btn" data-act="ls-step" data-d="1" ${view.i >= pool.length - 1 ? 'disabled' : ''}>Next →</button></div></div>`;
  }

  function recordListening(lang, t, score) {
    const d = lp(lang.id);
    const prev = d.listening[t];
    const firstPass = !(prev && prev.best >= E.LISTEN_PASS) && score >= E.LISTEN_PASS;
    d.listening[t] = { best: Math.max(score, prev ? prev.best : 0) };
    E.logPractice(d, 'listening', score);
    if (firstPass) award(3); else save();
  }

  // ---------------------------------------------------------------- writing studio
  function promptFeedback(r, pr, lang) {
    return `<div class="feedback ${r.passed ? 'good' : 'bad'}"><b>${r.passed ? '✓ Well done!' : 'Good start. Check the points below.'}</b> Score: ${r.score}%
        <span class="detail">${r.words} words (aim for ${pr.minWords}+)</span></div>
      <ul class="checklist">${r.requirements.map((q) => `<li class="${q.met ? 'ok' : 'no'}">${q.met ? '✓' : '○'} ${h(q.label)}</li>`).join('')}</ul>
      ${r.accentHints.length ? `<p class="small"><b>Check ${isAr(lang) ? 'the hamza / spelling' : 'the accents'}:</b> ${r.accentHints.map((x) => `<span lang="${lang.id}" dir="auto">${h(x.word)} → <b>${h(x.suggestion)}</b></span>`).join(', ')}</p>` : ''}
      ${r.unknown.length ? `<p class="small"><b>Words the course doesn't know</b> (check the spelling, or they may be names): <span lang="${lang.id}" dir="auto">${r.unknown.map(h).join(', ')}</span></p>` : ''}
      <details ${r.passed ? '' : 'open'}><summary class="small"><b>Model answer</b></summary><div class="phrases wide" style="margin-top:.5rem">${phrase(pr.model, lang)}</div></details>
      <p class="small muted">Automatic checks can't judge every grammar point. Compare with the model, and if you can, show your writing to a tutor or native speaker.</p>`;
  }

  function recordPrompt(lang, id, score, self, skill) {
    const d = lp(lang.id);
    const prev = d.prompts[id];
    const firstPass = !(prev && prev.best >= E.PROMPT_PASS) && score >= E.PROMPT_PASS;
    if (!prev || score > prev.best || (prev.self && !self)) d.prompts[id] = self ? { best: Math.max(score, prev ? prev.best : 0), self: true } : { best: Math.max(score, prev && !prev.self ? prev.best : 0) };
    if (!self) E.logPractice(d, skill, score);
    if (firstPass) award(10); else save();
  }

  function writeView(lang, pid) {
    setChrome('Writing Studio', `#/${lang.id}`, lang.id);
    const d = lp(lang.id);
    const prompts = lang.writingPrompts || [];
    if (!view) view = { pid: prompts.some((x) => x.id === pid) ? pid : null, text: '', result: null, busy: true };
    if (!view.pid) {
      return `<div class="card"><h1>📝 Writing Studio</h1>
          <p class="muted">Write freely in ${h(lang.name)}. You'll get automatic feedback on the required points, length, spelling and ${isAr(lang) ? 'hamza' : 'accents'}, plus a model answer to compare with.</p></div>
        <div class="grid">${prompts.map((pr) => {
          const rec = d.prompts[pr.id];
          return `<button class="tile" data-act="wr-open" data-id="${pr.id}"><span class="title">${h(pr.prompt)}</span>
            <span class="meta">${levelChip(pr.level)}<span class="chip">${pr.minWords}+ words</span>${rec ? `<span class="chip ${rec.best >= E.PROMPT_PASS ? 'done' : ''}">Best ${rec.best}%</span>` : ''}</span></button>`;
        }).join('')}</div>`;
    }
    const pr = prompts.find((x) => x.id === view.pid);
    return `<div class="card"><div class="row spread"><span>${levelChip(pr.level)}</span><button class="btn" data-act="wr-back">← All prompts</button></div>
        <h2 style="margin-top:.6rem">${h(pr.prompt)}</h2>
        <p class="small muted">Include: ${pr.requirements.map((q) => h(q.label)).join(' · ')}</p>
        <textarea class="input ${isAr(lang) ? 'ar' : ''}" id="wr-input" dir="${lang.dir}" lang="${lang.id}" spellcheck="false" style="min-height:9rem">${h(view.text)}</textarea>
        ${keyboard(lang, 'wr-input')}
        <div class="row" style="margin-top:.8rem"><button class="btn primary" data-act="wr-check">Check my writing</button><span class="small muted" id="wr-count">${E.analyzePrompt(view.text, pr, lang, index(lang.id)).words} words</span></div>
        ${view.result ? `<div style="margin-top:1rem">${promptFeedback(view.result, pr, lang)}</div>` : ''}</div>`;
  }

  // ---------------------------------------------------------------- speech recognition
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let activeRec = null;

  /** Listen once in the target language; calls back with alternative transcripts or an error code. */
  function listen(code, onResult, onError, continuous) {
    if (!SR) { onError('unsupported'); return; }
    if (activeRec) { try { activeRec.abort(); } catch (err) { /* already stopped */ } }
    const rec = new SR();
    activeRec = rec;
    rec.lang = code;
    rec.interimResults = false;
    rec.maxAlternatives = continuous ? 1 : 5;
    rec.continuous = !!continuous;
    let settled = false;
    const heard = [];
    const settle = (fn) => { if (settled) return; settled = true; activeRec = null; fn(); };
    rec.onresult = (e) => {
      if (!continuous) { settle(() => onResult([...e.results[0]].map((a) => a.transcript))); return; }
      for (let i = e.resultIndex || 0; i < e.results.length; i++) if (e.results[i].isFinal !== false) heard[i] = e.results[i][0].transcript;
    };
    rec.onerror = (e) => settle(() => (heard.length ? onResult([heard.join(' ')]) : onError(e.error || 'error')));
    rec.onend = () => settle(() => (heard.length ? onResult([heard.filter(Boolean).join(' ')]) : onError('no-speech')));
    try { rec.start(); } catch (err) { settle(() => onError('error')); }
  }

  const SR_MESSAGES = {
    unsupported: "This browser doesn't support speech recognition. Say the phrase aloud, then check yourself.",
    'not-allowed': 'Microphone access was blocked. Allow it in your browser settings, or check yourself.',
    'service-not-allowed': 'Speech recognition is turned off in this browser. Check yourself instead.',
    network: 'Speech recognition needs an internet connection in this browser. Check yourself instead.',
    'no-speech': "I didn't hear anything. Tap the microphone and speak after the beep.",
    'language-not-supported': "This browser can't recognize this language. Check yourself instead.",
  };

  /** Shared listen / record / score panel. st: {status, transcript, score, message}. */
  function speakPanel(p, lang, st) {
    const result = st.status === 'scored'
      ? `<div class="feedback ${st.score >= E.SPEAK_PASS ? 'good' : 'bad'}">${st.score >= E.SPEAK_PASS ? '✓ Great pronunciation!' : 'Close. Listen again and try once more.'} Score: ${st.score}%
          <span class="detail">I heard: <span lang="${lang.id}" dir="${lang.dir}">“${h(st.transcript)}”</span></span></div>` : '';
    const self = st.status === 'self' ? '<div class="feedback good">✓ Marked as practiced (self-checked). Self-checks count as practice, but only scored attempts change your accuracy.</div>' : '';
    const msg = st.message ? `<div class="feedback bad">${h(st.message)}</div>` : '';
    return `<div class="flash" style="padding:.6rem 0">
        <div class="big ${isAr(lang) ? 'ar' : ''}" lang="${lang.id}" dir="${lang.dir}" style="font-size:${isAr(lang) ? '2.4rem' : '2rem'}">${h(p.t)}</div>
        ${p.tr ? `<div class="reveal-tr">${h(p.tr)}</div>` : ''}<div class="muted">${h(p.en)}</div></div>
      <div class="row" style="justify-content:center">
        ${canSpeak ? `<button class="btn" data-act="speak" data-text="${h(p.t)}" data-code="${h(lang.speech)}">🔊 Listen</button>` : ''}
        ${SR ? `<button class="btn primary" data-act="speak-listen" ${st.status === 'listening' ? 'disabled' : ''}>${st.status === 'listening' ? '🎙️ Listening…' : '🎙️ Say it'}</button>` : ''}
        <button class="btn" data-act="speak-self" title="Use this if you can't use the microphone">I said it ✓</button></div>
      ${result}${self}${msg}
      ${!SR ? `<p class="small muted center">${h(SR_MESSAGES.unsupported)}</p>` : '<p class="small muted center">Speech is recognized by your browser and may need an internet connection.</p>'}`;
  }

  function recordSpeaking(lang, phraseT, score, self) {
    const d = lp(lang.id);
    const prev = d.speaking[phraseT];
    const firstPass = !(prev && prev.best >= E.SPEAK_PASS) && score >= E.SPEAK_PASS;
    if (!prev || score > prev.best || (prev.self && !self)) d.speaking[phraseT] = self ? { best: Math.max(score, prev ? prev.best : 0), self: true } : { best: Math.max(score, prev && !prev.self ? prev.best : 0) };
    if (!self) E.logPractice(d, 'speaking', score);
    if (firstPass) award(3); else save();
  }

  function startListening(lang, phrase, onScored) {
    view.speak = { status: 'listening' };
    render();
    listen(lang.speech, (alts) => {
      const score = Math.max(...alts.map((a) => E.similarity(a, phrase.t, lang.id)));
      const best = alts.reduce((b, a) => (E.similarity(a, phrase.t, lang.id) > E.similarity(b, phrase.t, lang.id) ? a : b), alts[0] || '');
      view.speak = { status: 'scored', transcript: best, score };
      onScored(score);
      render();
    }, (code) => {
      view.speak = { status: 'error', message: SR_MESSAGES[code] || "Speech recognition didn't work this time. Try again, or check yourself." };
      render();
    });
  }

  // ---------------------------------------------------------------- speaking practice
  function speakView(lang, tab) {
    setChrome('Speaking Practice', `#/${lang.id}`, lang.id);
    const d = lp(lang.id);
    const all = E.speakingPhrases(lang);
    if (!view) {
      const firstUnspoken = all.findIndex((p) => !(d.speaking[p.t] && d.speaking[p.t].best >= E.SPEAK_PASS));
      view = { tab: tab === 'answer' ? 'answer' : 'repeat', i: Math.max(0, firstUnspoken), speak: { status: 'idle' }, pi: 0, answer: { status: 'idle' }, typed: '', busy: true };
    }
    const tabs = `<div class="seg" role="tablist" style="margin-bottom:1rem">${[['repeat', 'Repeat phrases'], ['answer', 'Answer questions']].map(([k, l]) => `<button role="tab" aria-pressed="${view.tab === k}" data-act="sp-tab" data-tab="${k}">${l}</button>`).join('')} ${speedControl()}</div>`;
    if (view.tab === 'answer') return answerView(lang, tabs);
    const p = all[view.i];
    const spoken = all.filter((x) => d.speaking[x.t] && d.speaking[x.t].best >= E.SPEAK_PASS).length;
    const rec = d.speaking[p.t];
    const lesson = allLessons(lang).find((l) => l.id === p.lesson);
    return `<div class="card"><div class="row spread"><h1 style="margin:0">🎙️ Speaking Practice</h1><span class="chip">${spoken}/${all.length} spoken well</span></div>
        <p class="muted small" style="margin-top:.4rem">Listen to the model, then tap <b>Say it</b> and repeat. Scores of ${E.SPEAK_PASS}% or more count toward your speaking fluency.</p></div>
      ${tabs}
      <div class="card">
        <div class="row spread small muted"><span>Phrase ${view.i + 1} of ${all.length} · ${levelChip(p.level)} ${lesson ? h(lesson.title) : ''}</span>
          <span>${rec ? `Best: ${rec.best}%${rec.self ? ' (self-checked)' : ''}` : 'Not tried yet'}</span></div>
        ${speakPanel(p, lang, view.speak)}
        <div class="row" style="justify-content:center;margin-top:1rem">
          <button class="btn" data-act="sp-step" data-d="-1" ${view.i === 0 ? 'disabled' : ''}>← Previous</button>
          <button class="btn" data-act="sp-step" data-d="1" ${view.i >= all.length - 1 ? 'disabled' : ''}>Next →</button></div></div>`;
  }

  function answerView(lang, tabs) {
    const d = lp(lang.id);
    const prompts = lang.speakingPrompts || [];
    const pr = prompts[view.pi];
    const a = view.answer;
    const rec = d.prompts[pr.id];
    const result = a.result ? promptFeedback(a.result, pr, lang) : '';
    return `<div class="card"><div class="row spread"><h1 style="margin:0">🎙️ Speaking Practice</h1><span class="chip">${prompts.filter((x) => d.prompts[x.id] && d.prompts[x.id].best >= E.PROMPT_PASS).length}/${prompts.length} prompts answered</span></div>
        <p class="muted small" style="margin-top:.4rem">Answer in your own words, out loud. The app transcribes what you say and checks it for the key points.</p></div>
      ${tabs}
      <div class="card">
        <div class="row spread small muted"><span>Prompt ${view.pi + 1} of ${prompts.length} · ${levelChip(pr.level)}</span><span>${rec ? `Best ${rec.best}%${rec.self ? ' (self-checked)' : ''}` : 'Not tried yet'}</span></div>
        <h2 style="margin-top:.5rem">${h(pr.prompt)}</h2>
        ${pr.starter ? `<p class="small">Start with: <span lang="${lang.id}" dir="${lang.dir}" class="${isAr(lang) ? 'ar' : ''}" style="font-size:1.1rem">${h(pr.starter)}</span></p>` : ''}
        <p class="small muted">Include: ${pr.requirements.map((q) => h(q.label)).join(' · ')}</p>
        <div class="row" style="justify-content:center;margin:.6rem 0">
          ${SR ? (a.status === 'listening'
            ? '<button class="btn primary" data-act="ans-stop">⏹ I’m done speaking</button><span class="small muted">Listening…</span>'
            : '<button class="btn primary" data-act="ans-listen">🎙️ Answer aloud</button>') : ''}
          <button class="btn" data-act="ans-self">I answered aloud ✓</button></div>
        ${a.transcript ? `<p class="small">I heard: <span lang="${lang.id}" dir="${lang.dir}">“${h(a.transcript)}”</span></p>` : ''}
        ${a.message ? `<div class="feedback bad">${h(a.message)}</div>` : ''}
        ${a.status === 'self' ? '<div class="feedback good">✓ Marked as practiced (self-checked). It counts as practice, but only transcribed answers change your accuracy.</div>' : ''}
        <details ${SR ? '' : 'open'}><summary class="small">Or type what you said</summary>
          <textarea class="input ${isAr(lang) ? 'ar' : ''}" id="ans-text" dir="${lang.dir}" lang="${lang.id}" style="min-height:4rem;margin-top:.5rem">${h(view.typed)}</textarea>
          <button class="btn" data-act="ans-typed" style="margin-top:.4rem">Check</button></details>
        ${result ? `<div style="margin-top:1rem">${result}</div>` : ''}
        <div class="row" style="justify-content:center;margin-top:1rem">
          <button class="btn" data-act="ans-step" data-d="-1" ${view.pi === 0 ? 'disabled' : ''}>← Previous</button>
          <button class="btn" data-act="ans-step" data-d="1" ${view.pi >= prompts.length - 1 ? 'disabled' : ''}>Next →</button></div></div>`;
  }

  // ---------------------------------------------------------------- daily challenge
  function challengeCard(lang) {
    const d = lp(lang.id);
    const today = d.challenges[E.localDay()];
    const streak = E.challengeStreak(d);
    return `<a class="tile" href="#/${lang.id}/challenge"><span class="emoji">⚡</span><span class="title">Daily Challenge</span>
      <span class="sub">${today ? `Done today: ${today.score}/${today.total}. A new one unlocks tomorrow.` : '10 quick items: reading, writing, listening and speaking. About 5 minutes.'}</span>
      <span class="meta"><span class="chip ${today ? 'done' : ''}">${today ? '✓ Completed' : 'Ready'}</span><span class="chip gamify">🔥 ${streak}-day challenge streak</span></span></a>`;
  }

  function challengeView(lang) {
    setChrome('Daily Challenge', `#/${lang.id}`, lang.id);
    const d = lp(lang.id);
    const day = E.localDay();
    const todayRec = d.challenges[day];
    if (!view) view = { phase: todayRec ? 'done' : 'intro', items: E.dailyChallenge(lang, d, day), i: 0, results: [], picked: null, typed: '', typeResult: null, speak: { status: 'idle' }, replay: false, busy: true };
    if (view.phase === 'intro') {
      return `<div class="card"><h1>⚡ Daily Challenge</h1><p class="muted">${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        <p>Ten quick items drawn from what you've been learning, at your level:</p>
        <ul><li>📖 3 reading: a meaning, a word to read and a lesson question</li><li>✍️ 3 writing: two typed answers and a spelling check</li><li>🎧 2 listening: a dictation and a line to understand by ear</li><li>🎙️ 2 speaking: two phrases to say aloud</li></ul>
        <p class="small muted">Everyone learning ${h(lang.name)} on this device gets the same challenge all day. Your first completion counts toward your fluency and challenge streak.</p>
        <button class="btn primary" data-act="ch-start">Start today's challenge</button></div>`;
    }
    if (view.phase === 'done') {
      const rec = view.replay ? view.summary : todayRec || view.summary;
      const skills = E.SKILLS.filter((k) => rec.bySkill[k]);
      return `<div class="card center"><p class="muted" style="margin:0">Today's challenge</p><div class="score-big">${rec.score}/${rec.total}</div>
          ${hayya(rec.score === rec.total ? 'Perfect score! I’m doing a happy wiggle. 🐍' : rec.score >= rec.total * 0.7 ? 'Great work! Come back tomorrow to keep the streak going.' : 'Good effort. Every day counts, and tomorrow’s challenge will feel easier.', { mood: rec.score >= rec.total * 0.7 ? 'cheer' : 'happy' })}
          <p class="small"><span class="gamify">🔥 ${E.challengeStreak(d)}-day challenge streak · </span>a new challenge unlocks tomorrow</p>
          <div class="row" style="justify-content:center"><button class="btn" data-act="ch-replay">Practice again (not scored)</button><a class="btn primary" href="#/${lang.id}/fluency">See your fluency</a></div></div>
        <div class="card level-bars"><h3>By skill</h3>${skills.map((k) => `<div class="lvl" style="grid-template-columns:7rem 1fr 3rem"><span>${SKILL_META[k].icon} ${SKILL_META[k].label}</span>${bar(pct(rec.bySkill[k].c, rec.bySkill[k].t))}<span>${rec.bySkill[k].c}/${rec.bySkill[k].t}</span></div>`).join('')}</div>`;
    }
    const it = view.items[view.i];
    const answered = view.results.length > view.i;
    let body = '';
    const hideText = it.audio && canSpeak && !answered && !view.showText;
    if (it.type === 'choice') {
      body = `<div class="quiz-q">${h(it.q)}</div>
        ${it.audio && canSpeak ? `<div class="row" style="margin-bottom:.6rem"><button class="btn primary" data-act="speak" data-text="${h(it.t)}" data-code="${h(lang.speech)}">▶ Play</button>${hideText ? '<button class="btn" data-act="ch-show">Show text</button>' : ''}</div>` : ''}
        ${it.t && !hideText ? `<div class="quiz-t">${tText(it.t, lang, E.hasArabic(it.t) && isAr(lang) ? 'ar' : '')}${speakBtn(it.t, lang)}</div>${it.tr ? `<div class="reveal-tr" style="margin:-.5rem 0 .6rem">${h(it.tr)}</div>` : ''}` : ''}
        <div class="options">${it.options.map((o, i) => {
          let cls = 'option';
          if (answered) { if (i === it.answer) cls += ' correct'; else if (i === view.picked) cls += ' wrong'; }
          return `<button class="${cls}" data-act="ch-pick" data-i="${i}" ${E.hasArabic(o) ? 'lang="ar" dir="auto"' : ''} ${answered ? 'disabled' : ''}>${h(o)}</button>`;
        }).join('')}</div>
        ${answered ? `<div class="feedback ${view.results[view.i].correct ? 'good' : 'bad'}">${view.results[view.i].correct ? '✓ Correct!' : `✗ The answer is: ${h(it.options[it.answer])}`}${it.explain ? `<span class="detail">${h(it.explain)}</span>` : ''}</div>` : ''}`;
    } else if (it.type === 'dictation') {
      const r = view.dictScore;
      body = `<div class="quiz-q">Listen and type what you hear.</div>
        <div class="row" style="margin-bottom:.6rem">${canSpeak ? `<button class="btn primary" data-act="speak" data-text="${h(it.t)}" data-code="${h(lang.speech)}">▶ Play</button>` : `<span class="small muted">No voice on this device, so here is the text: <span lang="${lang.id}" dir="${lang.dir}">${h(it.t)}</span></span>`}</div>
        <input class="input ${isAr(lang) ? 'ar' : ''}" id="ch-input" dir="${lang.dir}" lang="${lang.id}" autocomplete="off" autocapitalize="off" spellcheck="false" value="${h(view.typed)}" ${answered ? 'disabled' : ''}>
        ${answered ? '' : keyboard(lang, 'ch-input')}
        ${r != null ? `<div class="feedback ${r >= E.LISTEN_PASS ? 'good' : 'bad'}">${r >= E.LISTEN_PASS ? '✓ Great listening!' : 'Not quite.'} Score: ${r}%<span class="detail"><span lang="${lang.id}" dir="${lang.dir}">${h(it.t)}</span>${it.tr ? ` · <i>${h(it.tr)}</i>` : ''} · ${h(it.en)}</span></div>` : ''}
        ${answered ? '' : '<div class="row" style="margin-top:.8rem"><button class="btn primary" data-act="ch-dict">Check</button></div>'}`;
    } else if (it.type === 'type') {
      const r = view.typeResult;
      body = `<div class="quiz-q">${h(it.prompt)}</div>
        <input class="input ${isAr(lang) ? 'ar' : ''}" id="ch-input" dir="${lang.dir}" lang="${lang.id}" autocomplete="off" autocapitalize="off" spellcheck="false" value="${h(view.typed)}" ${answered ? 'disabled' : ''}>
        ${answered ? '' : keyboard(lang, 'ch-input')}
        ${it.hint && !answered ? `<p class="small muted" style="margin-top:.5rem">Hint: ${h(it.hint)}</p>` : ''}
        ${r ? `<div class="feedback ${r.ok ? 'good' : 'bad'}">${r.ok ? (r.perfect ? '✓ Perfect!' : `✓ Correct, but check the ${isAr(lang) ? 'spelling' : 'accents'}: ${h(r.expected)}`) : `✗ The answer is: <span lang="${lang.id}" dir="${lang.dir}">${h(it.answer)}</span>`}</div>` : ''}
        ${answered ? '' : '<div class="row" style="margin-top:.8rem"><button class="btn primary" data-act="ch-check">Check</button></div>'}`;
    } else {
      body = `<div class="quiz-q">Say this out loud</div>${speakPanel(it, lang, view.speak)}
        ${answered ? '' : '<div class="row" style="justify-content:center;margin-top:.6rem"><button class="btn" data-act="ch-skip">Skip (can\'t speak right now)</button></div>'}`;
    }
    return `<div class="card">
      <div class="row spread"><span class="progress-label">Item ${view.i + 1} of ${view.items.length} · ${SKILL_META[it.skill].icon} ${SKILL_META[it.skill].label}</span>${view.replay ? '<span class="chip">Practice replay</span>' : ''}</div>
      ${bar(pct(view.i, view.items.length))}<div style="margin-top:.9rem">${body}</div>
      ${answered ? `<div class="row" style="margin-top:.9rem"><button class="btn primary" data-act="ch-next">${view.i + 1 < view.items.length ? 'Next →' : 'Finish'}</button></div>` : ''}</div>`;
  }

  function challengeAnswer(result) {
    view.results[view.i] = result;
    render();
  }

  function challengeFinish(lang) {
    const d = lp(lang.id);
    const counted = view.results.filter((r) => !r.skipped);
    const bySkill = {};
    for (const r of counted) {
      const s = (bySkill[r.skill] = bySkill[r.skill] || { c: 0, t: 0 });
      s.t++; if (r.correct) s.c++;
    }
    const summary = { score: counted.filter((r) => r.correct).length, total: counted.length, bySkill };
    view.summary = summary;
    view.phase = 'done';
    const day = E.localDay();
    if (!view.replay && !d.challenges[day]) {
      d.challenges[day] = summary;
      const days = Object.keys(d.challenges).sort();
      for (const old of days.slice(0, Math.max(0, days.length - 60))) delete d.challenges[old];
      for (const skill of E.SKILLS) {
        const measured = counted.filter((r) => r.skill === skill && r.measured);
        if (measured.length) E.logPractice(d, skill, pct(measured.filter((r) => r.correct).length, measured.length));
      }
      award(summary.score * 10 + 30);
    }
    render();
  }

  // ---------------------------------------------------------------- progress & backup
  function progressView() {
    setChrome('Progress & Backup', '#/', null);
    const panels = LIB.languages.map((lang) => {
      const d = lp(lang.id);
      const s = E.languageStats(lang, d);
      const last = d.aptitude[d.aptitude.length - 1];
      return `<div class="card"><div class="row spread"><h2 style="margin:0">${h(lang.name)}</h2>${s.level ? levelChip(s.level) : ''}</div>
        <div style="margin:.6rem 0">${bar(s.percent)}</div>
        <div class="level-bars small">
          <div class="lvl" style="grid-template-columns:7rem 1fr 3.5rem"><span>Lessons</span>${bar(pct(s.lessonsDone, s.lessonsTotal))}<span>${s.lessonsDone}/${s.lessonsTotal}</span></div>
          <div class="lvl" style="grid-template-columns:7rem 1fr 3.5rem"><span>Scenarios</span>${bar(pct(s.scenariosDone, s.scenariosTotal))}<span>${s.scenariosDone}/${s.scenariosTotal}</span></div>
          <div class="lvl" style="grid-template-columns:7rem 1fr 3.5rem"><span>Letters</span>${bar(pct(s.lettersDone, s.lettersTotal))}<span>${s.lettersDone}/${s.lettersTotal}</span></div>
          <div class="lvl" style="grid-template-columns:7rem 1fr 3.5rem"><span>Writing</span>${bar(pct(s.writingDone, s.writingTotal))}<span>${s.writingDone}/${s.writingTotal}</span></div></div>
        <p class="small muted" style="margin-top:.6rem">${last ? `Last test: ${h(last.level)} (${last.score}/${last.total}) on ${new Date(last.at).toLocaleDateString()}` : 'No aptitude test yet.'} · ${d.saved.length} saved words</p>
        <a class="btn" href="#/${lang.id}">Open ${h(lang.name)}</a></div>`;
    }).join('');
    return `<div class="lesson-head"><h1>💾 Progress &amp; Backup</h1>
        <p class="muted">Progress is saved on this device after every answer${storageOK ? '' : ' (<b>storage is blocked in this browser</b>)'}.${progress.updatedAt ? ` Last saved ${new Date(progress.updatedAt).toLocaleString()}.` : ''}</p></div>
      <div class="grid tight gamify"><div class="card center"><div class="score-big">${progress.xp}</div><div class="small muted">XP</div></div>
        <div class="card center"><div class="score-big">${progress.streak.count}</div><div class="small muted">day streak</div></div></div>
      <div class="grid">${panels}</div>
      <div class="card"><h2>⚙️ Learning preferences</h2>
        <label class="pref"><input type="checkbox" data-change="pref" data-pref="showTr" ${prefs.showTr ? 'checked' : ''}> <span><b>Show Arabic transliteration</b><br><span class="small muted">Turn off once you can read the script; you can still tap a blurred line to peek.</span></span></label>
        <label class="pref"><input type="checkbox" data-change="pref" data-pref="quiet" ${prefs.quiet ? 'checked' : ''}> <span><b>Quiet mode</b><br><span class="small muted">Hide streaks and XP. Your progress and fluency tracking keep working.</span></span></label></div>
      <div class="card"><h2>🐍 How Lingua is different</h2>
        <ul class="small">
          <li><b>Free and open.</b> No ads, no account, no hearts or energy limits. Every lesson is open from day one, and the aptitude test lets you start at your level.</li>
          <li><b>Every answer is explained.</b> Each lesson starts with the grammar, and each question says why the answer is right.</li>
          <li><b>Arabic as it's really used.</b> Formal Arabic plus Egyptian and Levantine, the script taught properly with tracing and typing, and transliteration you can switch off.</li>
          <li><b>Real output.</b> Free writing and spoken answers are checked, not just repeat-after-me. Conversation with real people is still essential, and the app says so.</li>
          <li><b>Honest progress.</b> Fluency scores come from your own accuracy and coverage, measured against the CEFR. Streaks are optional.</li>
          <li><b>Your data stays yours.</b> Progress lives on your device, with export and import at any time.</li>
        </ul>
        <p class="small muted">The course was drafted with AI help and checked by automated tests, but it has not yet been reviewed by native-speaker teachers. If you spot an error, please ${reportLink('general').replace('⚑ Report a mistake', 'report it')}.</p></div>
      <div class="card"><h2>Backup &amp; sync</h2>
        <p class="small">Export a backup file to keep your progress safe or move it to another browser. The same file works in the Swift Playgrounds app: use <b>Progress → Import</b> there and paste the file's contents.</p>
        <div class="row"><button class="btn primary" data-act="export">⬇️ Export backup</button>
          <label class="btn">⬆️ Import backup<input type="file" accept="application/json,.json" data-change="import" hidden></label>
          <button class="btn" data-act="copy">📋 Copy as text</button>
          <button class="btn danger" data-act="reset">${resetArmed ? 'Tap again to erase everything' : 'Reset all progress'}</button></div>
        ${resetArmed ? '<p class="small no">This erases progress for both languages and cannot be undone. Export a backup first if you want to keep it.</p>' : ''}
        ${pendingImport ? `<div class="feedback bad"><b>Replace your current progress with this backup?</b>
          <span class="detail">The backup has ${pendingImport.xp} XP${pendingImport.updatedAt ? `, saved ${h(new Date(pendingImport.updatedAt).toLocaleString())}` : ''}. Your current progress (${progress.xp} XP) will be overwritten.</span>
          <div class="row" style="margin-top:.6rem"><button class="btn primary" data-act="import-confirm">Replace my progress</button><button class="btn" data-act="import-cancel">Cancel</button></div></div>` : ''}
        <details style="margin-top:.8rem"><summary class="small">Paste a backup instead</summary>
          <textarea class="input" id="import-text" style="font-size:.85rem;min-height:5rem;margin-top:.5rem" placeholder="Paste the backup text copied from the web app or the Swift app"></textarea>
          <button class="btn" data-act="import-paste" style="margin-top:.5rem">Import pasted backup</button></details>
        <p class="small muted" id="backup-msg" aria-live="polite">${h(backupNote)}</p>
        <p class="small muted">If Export doesn't download a file (some embedded viewers block downloads), use Copy as text and keep it somewhere safe.</p></div>`;
  }

  let pendingImport = null; // sanitized backup waiting for the learner to confirm
  let resetArmed = false;
  let resetTimer = null;
  let backupNote = '';
  function backupMsg(text) { backupNote = text; const el = document.getElementById('backup-msg'); if (el) el.textContent = text; }
  function stageImport(text) {
    try {
      const data = JSON.parse(text);
      if (!data || typeof data !== 'object' || !data.languages) throw new Error('that is not a Lingua backup');
      pendingImport = E.sanitizeProgress(data);
      backupNote = '';
    } catch (err) {
      pendingImport = null;
      backupNote = `Couldn't import: ${err.message === 'that is not a Lingua backup' ? err.message : 'the text is not valid backup JSON'}.`;
    }
    render();
  }

  // ---------------------------------------------------------------- events
  const actions = {
    speak: (el) => speak(el.dataset.text, el.dataset.code),
    'quiz-pick': (el) => quizPick(Number(el.dataset.i)),
    'quiz-next': () => quizNext(),
    'lesson-retry': () => { view = null; render(); document.getElementById('quiz').scrollIntoView(); },
    tab: (el) => { view.tab = el.dataset.tab; view.result = null; render(); },
    letter: (el) => {
      const lang = LANGS[route()[0]];
      view.letter = el.dataset.char;
      const d = lp(lang.id);
      const first = !d.letters[view.letter];
      d.letters[view.letter] = (d.letters[view.letter] || 0) + 1;
      if (first) award(2); else save();
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    'letter-close': () => { view.letter = null; render(); },
    'trace-letter': (el) => { view.tab = 'trace'; view.trace = el.dataset.char; view.form = 0; view.traceScore = null; render(); },
    'trace-form': (el) => { view.form = Number(el.dataset.i); view.traceScore = null; render(); },
    'speak-listen': () => {
      const lang = LANGS[route()[0]];
      if (route()[1] === 'speak') {
        const p = E.speakingPhrases(lang)[view.i];
        startListening(lang, p, (score) => recordSpeaking(lang, p.t, score, false));
      } else {
        const it = view.items[view.i];
        if (view.results[view.i]) return;
        startListening(lang, it, (score) => {
          if (!view.replay) recordSpeaking(lang, it.t, score, false);
          if (score >= E.SPEAK_PASS || (view.attempts = (view.attempts || 0) + 1) >= 3) {
            view.results[view.i] = { skill: it.skill, correct: score >= E.SPEAK_PASS, measured: true };
          }
        });
      }
    },
    'speak-self': () => {
      const lang = LANGS[route()[0]];
      if (route()[1] === 'speak') {
        const p = E.speakingPhrases(lang)[view.i];
        recordSpeaking(lang, p.t, E.SPEAK_PASS, true);
        view.speak = { status: 'self' };
        render();
      } else {
        const it = view.items[view.i];
        if (view.results[view.i]) return;
        if (!view.replay) recordSpeaking(lang, it.t, E.SPEAK_PASS, true);
        view.speak = { status: 'self' };
        challengeAnswer({ skill: it.skill, correct: true, measured: false });
      }
    },
    'plan-start': (el) => {
      const id = route()[0];
      lp(id).plan.start = el.dataset.start;
      save();
      if (el.dataset.start === 'test') location.hash = `#/${id}/test`;
      else if (el.dataset.start === 'zero') location.hash = `#/${id}/plan`;
      else render();
    },
    'plan-dialect': (el) => { lp(route()[0]).plan.dialect = el.dataset.dialect; save(); render(); },
    'plan-reset': () => { const id = route()[0]; delete lp(id).plan.start; save(); location.hash = `#/${id}`; },
    'res-level': (el) => { view.level = el.dataset.level; render(); },
    rate: (el) => { rateName = el.dataset.rate; try { localStorage.setItem('lingua.rate', rateName); } catch (err) { /* per-session */ } render(); },
    'sp-tab': (el) => { view.tab = el.dataset.tab; render(); },
    'ans-step': (el) => { view.pi += Number(el.dataset.d); view.answer = { status: 'idle' }; view.typed = ''; render(); },
    'ans-listen': () => {
      const lang = LANGS[route()[0]];
      const pr = lang.speakingPrompts[view.pi];
      view.answer = { status: 'listening' };
      render();
      listen(lang.speech, (alts) => {
        const transcript = alts[0] || '';
        const result = E.analyzePrompt(transcript, pr, lang, index(lang.id));
        view.answer = { status: 'scored', transcript, result };
        recordPrompt(lang, pr.id, result.score, false, 'speaking');
        render();
      }, (code) => { view.answer = { status: 'error', message: SR_MESSAGES[code] || "Speech recognition didn't work this time. Try again, or type what you said." }; render(); }, true);
    },
    'ans-stop': () => { if (activeRec) { try { activeRec.stop(); } catch (err) { /* already stopped */ } } },
    'ans-self': () => {
      const lang = LANGS[route()[0]];
      recordPrompt(lang, lang.speakingPrompts[view.pi].id, E.PROMPT_PASS, true, 'speaking');
      view.answer = { status: 'self' };
      render();
    },
    'ans-typed': () => {
      const lang = LANGS[route()[0]];
      const pr = lang.speakingPrompts[view.pi];
      view.typed = document.getElementById('ans-text').value;
      const result = E.analyzePrompt(view.typed, pr, lang, index(lang.id));
      // Typing isn't speaking, so a typed answer counts as a self-check for speaking accuracy.
      recordPrompt(lang, pr.id, result.score, true, 'speaking');
      view.answer = { status: 'scored', transcript: '', result };
      render();
    },
    'rv-flip': () => { view.flipped = true; render(); },
    'rv-grade': (el) => {
      const lang = LANGS[route()[0]];
      const d = lp(lang.id);
      const card = view.queue[view.i];
      const g = el.dataset.g;
      if (!(card.t in view.first)) view.first[card.t] = g;
      E.srsGrade(d, card.t, g, E.localDay());
      if (g === 'again' && !view.requeued.has(card.t)) { view.requeued.add(card.t); view.queue.push(card); }
      view.i++;
      view.flipped = false;
      save();
      render();
    },
    'rv-more': () => { view = null; render(); },
    'ls-mode': (el) => { view.mode = el.dataset.mode; view.typed = ''; view.result = null; view.picked = null; view.options = null; render(); },
    'ls-step': (el) => { view.i += Number(el.dataset.d); view.typed = ''; view.result = null; view.picked = null; view.options = null; view.showText = !canSpeak; render(); },
    'ls-show': () => { view.showText = true; render(); },
    'ls-check': () => {
      const lang = LANGS[route()[0]];
      const pool = E.listeningItems(lang).filter((x) => E.LEVELS.indexOf(x.level) <= E.LEVELS.indexOf(view.level));
      const it = pool[view.i];
      view.typed = document.getElementById('ls-input').value;
      view.result = E.dictationScore(view.typed, it.t, lang.id);
      recordListening(lang, it.t, view.result);
      render();
    },
    'ls-pick': (el) => {
      const lang = LANGS[route()[0]];
      if (view.picked !== null) return;
      const pool = E.listeningItems(lang).filter((x) => E.LEVELS.indexOf(x.level) <= E.LEVELS.indexOf(view.level));
      const it = pool[view.i];
      view.picked = Number(el.dataset.i);
      // Reading the text first makes it a reading task, so it scores lower.
      const correct = view.options[view.picked] === it.en;
      recordListening(lang, it.t, correct ? (view.showText && canSpeak ? 60 : 100) : 0);
      render();
    },
    'wr-open': (el) => { view.pid = el.dataset.id; view.text = ''; view.result = null; render(); },
    'wr-back': () => { view.pid = null; view.result = null; render(); },
    'wr-check': () => {
      const lang = LANGS[route()[0]];
      const pr = lang.writingPrompts.find((x) => x.id === view.pid);
      view.text = document.getElementById('wr-input').value;
      view.result = E.analyzePrompt(view.text, pr, lang, index(lang.id));
      recordPrompt(lang, pr.id, view.result.score, false, 'writing');
      render();
    },
    'ch-show': () => { view.showText = true; render(); },
    'ch-dict': () => {
      const lang = LANGS[route()[0]];
      const it = view.items[view.i];
      view.typed = document.getElementById('ch-input').value;
      view.dictScore = E.dictationScore(view.typed, it.t, lang.id);
      if (!view.replay) recordListening(lang, it.t, view.dictScore);
      challengeAnswer({ skill: it.skill, correct: view.dictScore >= E.LISTEN_PASS, measured: true });
    },
    'sp-step': (el) => { view.i += Number(el.dataset.d); view.speak = { status: 'idle' }; render(); },
    'ch-start': () => { view.phase = 'run'; render(); },
    'ch-replay': () => {
      const lang = LANGS[route()[0]];
      view = { phase: 'run', items: E.dailyChallenge(lang, lp(lang.id), E.localDay()), i: 0, results: [], picked: null, typed: '', typeResult: null, speak: { status: 'idle' }, replay: true, busy: true };
      render();
    },
    'ch-pick': (el) => {
      const it = view.items[view.i];
      if (view.results[view.i]) return;
      view.picked = Number(el.dataset.i);
      const correct = view.picked === it.answer;
      if (it.audio && !view.replay) recordListening(LANGS[route()[0]], it.t, correct ? (view.showText && canSpeak ? 60 : 100) : 0);
      challengeAnswer({ skill: it.skill, correct, measured: true });
    },
    'ch-check': () => {
      const lang = LANGS[route()[0]];
      const it = view.items[view.i];
      view.typed = document.getElementById('ch-input').value;
      view.typeResult = E.checkWriting(view.typed, it, lang.id);
      challengeAnswer({ skill: it.skill, correct: view.typeResult.ok, measured: true });
    },
    'ch-skip': () => { const it = view.items[view.i]; challengeAnswer({ skill: it.skill, correct: false, measured: false, skipped: true }); },
    'ch-next': () => {
      const lang = LANGS[route()[0]];
      if (view.i + 1 >= view.items.length) { challengeFinish(lang); return; }
      view.i++;
      Object.assign(view, { picked: null, typed: '', typeResult: null, dictScore: null, showText: false, speak: { status: 'idle' }, attempts: 0 });
      render();
    },
    'pen-mode': () => { penMode = penMode === 'auto' ? 'any' : 'auto'; updatePenNote(); },
    'trace-clear': () => { view.traceScore = null; render(); },
    'trace-check': () => {
      const lang = LANGS[route()[0]];
      const score = view.traceCheck ? view.traceCheck() : 0;
      view.traceScore = score;
      const d = lp(lang.id);
      E.logPractice(d, 'writing', score);
      if (score >= 70) {
        d.tracing[view.trace] = (d.tracing[view.trace] || 0) + 1;
        award(3);
      } else save();
      const keep = app.querySelector('#trace-ink').toDataURL();
      render();
      const ink = app.querySelector('#trace-ink');
      const img = new Image();
      img.onload = () => { const c = ink.getContext('2d'); c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(img, 0, 0); c.restore(); };
      img.src = keep;
    },
    'trace-next': () => {
      const letters = LANGS[route()[0]].reading.letters;
      const i = letters.findIndex((x) => x.char === view.trace);
      view.trace = letters[(i + 1) % letters.length].char;
      view.form = 0; view.traceScore = null; render();
    },
    'word-step': (el) => { view.word += Number(el.dataset.d); view.reveal = false; render(); },
    'word-reveal': () => {
      view.reveal = !view.reveal;
      if (view.reveal) {
        const d = lp(route()[0]);
        if ((d.checks.words || 0) < view.word + 1) { d.checks.words = view.word + 1; saveQuiet(); }
      }
      render();
    },
    'write-step': (el) => { view.task += Number(el.dataset.d); view.input = ''; view.result = null; view.showHint = false; render(); },
    'write-hint': () => { view.showHint = true; render(); },
    'write-check': () => {
      const lang = LANGS[route()[0]];
      const task = lang.reading.writing[view.task];
      view.input = document.getElementById('write-input').value;
      view.result = E.checkWriting(view.input, task, lang.id);
      const d = lp(lang.id);
      E.logPractice(d, 'writing', view.result.perfect ? 100 : view.result.ok ? 80 : 0);
      if (view.result.ok) {
        const first = !d.writing[task.answer];
        d.writing[task.answer] = true;
        if (first) award(5); else save();
      } else save();
      render();
    },
    'readquiz-new': () => { view.quiz = null; render(); },
    key: (el) => {
      const kb = el.closest('.kbd');
      const input = document.getElementById(kb.dataset.target);
      const k = el.dataset.key;
      const start = input.selectionStart != null ? input.selectionStart : input.value.length;
      const end = input.selectionEnd != null ? input.selectionEnd : input.value.length;
      if (k === '⌫') {
        const cut = start === end ? Math.max(0, start - 1) : start;
        input.value = input.value.slice(0, cut) + input.value.slice(end);
        input.setSelectionRange(cut, cut);
      } else {
        input.value = input.value.slice(0, start) + k + input.value.slice(end);
        input.setSelectionRange(start + k.length, start + k.length);
      }
      input.focus();
      input.dispatchEvent(new Event('input', { bubbles: true }));
    },
    'sc-pick': (el) => scenarioPick(LANGS[route()[0]], Number(el.dataset.i)),
    'sc-continue': () => scenarioContinue(LANGS[route()[0]]),
    'sc-restart': () => { view = null; render(); },
    'tr-dir': (el) => { view.dir = el.dataset.dir; render(); },
    'tr-fill': (el) => { view.text = el.dataset.text; view.dir = 'auto'; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); },
    'tr-save': () => {
      const lang = LANGS[route()[0]];
      const { r, dir } = view.last;
      const item = dir === 'fromEn'
        ? { t: r.output, tr: r.outputTr, en: view.text.trim() }
        : { t: view.text.trim(), tr: r.outputTr, en: r.output };
      if (!item.tr) delete item.tr;
      const d = lp(lang.id);
      if (!d.saved.some((s) => s.t === item.t)) { d.saved.unshift(item); award(1); }
      render();
    },
    'tr-unsave': (el) => { const d = lp(route()[0]); d.saved.splice(Number(el.dataset.i), 1); save(); render(); },
    'test-start': () => {
      const lang = LANGS[route()[0]];
      view = {
        phase: 'run', busy: true,
        quiz: newQuiz(lang.aptitude, 'test', (q) => {
          const answers = lang.aptitude.map((_, i) => (q.answers[i] == null ? -1 : q.answers[i]));
          const r = E.placement(lang.aptitude, answers);
          view.result = r;
          view.phase = 'result';
          view.busy = false;
          const d = lp(lang.id);
          d.aptitude.push({ at: new Date().toISOString(), level: r.level, score: r.score, total: r.total, bySkill: r.bySkill });
          d.aptitude = d.aptitude.slice(-20);
          award(25);
        }),
      };
      render();
    },
    'test-again': () => { view = { phase: 'intro' }; render(); },
    'media-level': (el) => { view.level = el.dataset.level; render(); },
    export: () => {
      const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `lingua-progress-${E.localDay()}.json`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 0);
      backupMsg('Backup downloaded.');
    },
    copy: async () => {
      try { await navigator.clipboard.writeText(JSON.stringify(progress)); backupMsg('Copied. Paste it into the Swift app’s Import screen.'); } catch (err) { backupMsg('Copying is blocked here. Use Export instead.'); }
    },
    reset: () => {
      clearTimeout(resetTimer);
      if (!resetArmed) {
        resetArmed = true;
        resetTimer = setTimeout(() => { resetArmed = false; if (route()[0] === 'progress') render(); }, 6000);
        render();
        return;
      }
      resetArmed = false;
      progress = E.emptyProgress();
      save();
      backupNote = 'All progress was reset.';
      render();
    },
    'import-confirm': () => {
      if (!pendingImport) return;
      progress = pendingImport;
      pendingImport = null;
      save();
      backupNote = 'Backup restored.';
      render();
    },
    'import-cancel': () => { pendingImport = null; backupNote = 'Import canceled. Nothing changed.'; render(); },
    'import-paste': () => stageImport(document.getElementById('import-text').value),
  };

  const changes = {
    'trace-select': (el) => { view.trace = el.value; view.form = 0; view.traceScore = null; render(); },
    'sc-en': (el) => { view.showEn = el.checked; render(); },
    pref: (el) => setPref(el.dataset.pref, el.checked),
    'ls-level': (el) => { view.level = el.value; view.i = -1; view.typed = ''; view.result = null; view.picked = null; view.options = null; render(); },
    import: (el) => {
      const file = el.files && el.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => stageImport(String(reader.result));
      reader.readAsText(file);
      el.value = ''; // so choosing the same file again still triggers a change
    },
  };

  app.addEventListener('click', (e) => {
    // With transliteration off, tapping a blurred line reveals it.
    const tr = document.body.classList.contains('hide-tr') && e.target.closest('.tr');
    if (tr) { tr.classList.toggle('peek'); return; }
    const el = e.target.closest('[data-act]');
    if (!el || !app.contains(el)) return;
    const fn = actions[el.dataset.act];
    if (fn) { e.preventDefault(); fn(el, e); }
  });
  app.addEventListener('change', (e) => {
    const el = e.target.closest('[data-change]');
    if (el && changes[el.dataset.change]) changes[el.dataset.change](el, e);
  });
  app.addEventListener('input', (e) => {
    if (e.target.id === 'tr-input' && view) {
      view.text = e.target.value;
      const lang = LANGS[route()[0]];
      const out = document.getElementById('tr-result');
      out.innerHTML = translationResult(lang);
      isolateArabic(out);
      e.target.classList.toggle('ar', E.hasArabic(view.text));
    } else if (e.target.id === 'write-input' && view) {
      view.input = e.target.value;
    } else if (e.target.id === 'ch-input' && view) {
      view.typed = e.target.value;
    } else if (e.target.id === 'ls-input' && view) {
      view.typed = e.target.value;
    } else if (e.target.id === 'wr-input' && view) {
      view.text = e.target.value;
      const lang = LANGS[route()[0]];
      const pr = lang.writingPrompts.find((x) => x.id === view.pid);
      const el = document.getElementById('wr-count');
      if (el && pr) el.textContent = `${E.analyzePrompt(view.text, pr, lang, index(lang.id)).words} words`;
    } else if (e.target.id === 'ans-text' && view) {
      view.typed = e.target.value;
    }
  });
  app.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.id === 'write-input') { e.preventDefault(); actions['write-check'](); }
    if (e.key === 'Enter' && e.target.id === 'ch-input') { e.preventDefault(); actions[view.items[view.i].type === 'dictation' ? 'ch-dict' : 'ch-check'](); }
    if (e.key === 'Enter' && e.target.id === 'ls-input') { e.preventDefault(); actions['ls-check'](); }
  });

  function setupTrend() {
    const box = app.querySelector('.trend');
    if (!box) return;
    const tip = box.querySelector('.tip');
    const cross = box.querySelector('.cross');
    const show = (el) => { tip.textContent = el.dataset.tip; cross.setAttribute('x1', el.dataset.x); cross.setAttribute('x2', el.dataset.x); cross.setAttribute('visibility', 'visible'); };
    box.querySelectorAll('.hit').forEach((el) => { el.addEventListener('pointerenter', () => show(el)); el.addEventListener('pointerdown', () => show(el)); });
    box.addEventListener('pointerleave', () => { cross.setAttribute('visibility', 'hidden'); tip.textContent = ''; });
  }

  function afterRender() {
    setupTrace();
    setupTrend();
    const ti = document.getElementById('tr-input');
    if (ti && E.hasArabic(ti.value)) ti.classList.add('ar');
  }

  // Study time: count a minute while the page is visible and the learner did something in the last two minutes.
  let lastInteraction = Date.now();
  ['pointerdown', 'keydown', 'input'].forEach((ev) => document.addEventListener(ev, () => { lastInteraction = Date.now(); }, { passive: true }));
  setInterval(() => {
    const id = route()[0];
    if (!LANGS[id] || document.visibilityState !== 'visible' || Date.now() - lastInteraction > 120000) return;
    E.logMinute(lp(id), E.localDay());
    saveQuiet();
  }, 60000);

  window.addEventListener('hashchange', render);
  updateChips();
  document.getElementById('storage-warning').hidden = storageOK;
  render();

  // Service workers can't run when the app is embedded in another page, so only register at top level.
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && window.self === window.top) {
    navigator.serviceWorker.register('sw.js').catch(() => { /* offline support is best-effort */ });
  }
})();
