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

  function speak(text, code) {
    if (!canSpeak || !text) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text.replace(/‍/g, ''));
      u.lang = code;
      u.rate = 0.85;
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
      ${item.t ? `<div class="quiz-t">${tText(item.t, lang, isAr(lang) && E.hasArabic(item.t) ? 'ar' : '')}${speakBtn(item.t, lang)}</div>` : ''}
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
    app.innerHTML = html;
    afterRender();
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
      case 'read': return readingView(lang);
      case 'scenarios': return scenarioList(lang);
      case 'scenario': return scenarioView(lang, parts[2]);
      case 'translate': return translateView(lang);
      case 'test': return testView(lang);
      case 'media': return mediaView(lang);
      case 'challenge': return challengeView(lang);
      case 'speak': return speakView(lang);
      case 'fluency': return fluencyView(lang);
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
        <h1>Learn Arabic &amp; Mexican Spanish</h1>
        <p>Grammar and culture lessons, reading and writing practice, real-world conversations, placement tests and an offline translator. Your progress saves automatically.</p>
      </section>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr))">${cards}</div>
      <div class="grid tight" style="margin-top:1.2rem">
        <div class="card center"><div class="score-big">${progress.xp}</div><div class="muted small">XP earned</div></div>
        <div class="card center"><div class="score-big">${progress.streak.count}</div><div class="muted small">day streak</div></div>
        <a class="tile" href="#/progress"><span class="emoji">💾</span><span class="title">Progress &amp; backup</span><span class="sub">Export, import or reset your progress</span></a>
      </div>
      <footer class="foot">Everything runs on your device and works offline.</footer>`;
  }

  // ---------------------------------------------------------------- language home
  function nextLesson(lang) {
    const d = lp(lang.id);
    const lessons = allLessons(lang);
    const placed = d.aptitude.length ? d.aptitude[d.aptitude.length - 1].level : null;
    const undone = lessons.filter((l) => !(d.lessons[l.id] && d.lessons[l.id].done));
    if (!undone.length) return null;
    if (placed) {
      const atLevel = undone.find((l) => levelIdx(l.level) >= Math.min(levelIdx(placed), 3));
      if (atLevel) return atLevel;
    }
    return undone[0];
  }

  function langHome(lang) {
    setChrome(lang.name, '#/', lang.id);
    const d = lp(lang.id);
    const s = E.languageStats(lang, d);
    const next = nextLesson(lang);
    const tiles = [
      ['read', isAr(lang) ? 'ع' : '✍️', 'Reading & Writing', isAr(lang) ? 'Alphabet, vowel marks, tracing and typing' : 'Pronunciation, accents and writing practice', `${s.lettersDone}/${s.lettersTotal} letters · ${s.writingDone}/${s.writingTotal} written`],
      ['speak', '🎙️', 'Speaking Practice', 'Listen, repeat and get a pronunciation score', `${E.speakingPhrases(lang).filter((p) => d.speaking[p.t] && d.speaking[p.t].best >= E.SPEAK_PASS).length}/${E.speakingPhrases(lang).length} phrases spoken`],
      ['scenarios', '🎭', 'Real-World Scenarios', 'Role-play cafés, taxis, markets and more', `${s.scenariosDone}/${s.scenariosTotal} completed`],
      ['translate', '🔄', 'Offline Translator', 'Dictionary and phrasebook, no internet needed', `${lang.dictionary.length} entries`],
      ['test', '🎯', 'Aptitude Test', 'Find your level (A1–C1)', s.level ? `Last result: ${s.level}` : 'Not taken yet'],
      ['media', '🎬', 'Media Picks', 'Films, shows, books and music by level', `${lang.media.length} picks`],
    ].map(([r, emoji, title, sub, meta]) => `<a class="tile" href="#/${lang.id}/${r}"><span class="emoji ${r === 'read' && isAr(lang) ? 'ar' : ''}">${emoji}</span><span class="title">${title}</span><span class="sub">${sub}</span><span class="meta small muted">${h(meta)}</span></a>`).join('');
    const cats = lang.categories.map((c) => {
      const done = c.lessons.filter((l) => d.lessons[l.id] && d.lessons[l.id].done).length;
      const levels = [...new Set(c.lessons.map((l) => l.level))].join('–');
      return `<a class="tile" href="#/${lang.id}/cat/${c.id}"><span class="emoji">${c.emoji}</span>
        <span class="title">${h(c.title)}</span><span class="sub" lang="${lang.id}" dir="${lang.dir}">${h(c.nativeTitle)}</span>
        <span class="sub">${h(c.summary)}</span>
        <span class="meta"><span class="chip">${levels}</span><span class="chip ${done === c.lessons.length ? 'done' : ''}">${done}/${c.lessons.length} done</span></span></a>`;
    }).join('');
    return `<section class="lang-hero">
        <div class="row spread"><div><h1>${h(lang.name)}</h1><div lang="${lang.id}" dir="${lang.dir}" style="font-size:1.2rem;opacity:.9">${h(lang.nativeName)}</div></div>
        ${s.level ? `<span class="chip">Level ${h(s.level)} · ${h(E.LEVEL_NAMES[s.level])}</span>` : `<a class="btn" href="#/${lang.id}/test">🎯 Find your level</a>`}</div>
        ${bar(s.percent)}
        <div class="small" style="margin-top:.4rem;opacity:.9">${s.percent}% of the course complete</div>
      </section>
      <div class="grid" style="margin-bottom:1rem">${challengeCard(lang)}${fluencyCard(lang)}</div>
      ${next ? `<a class="tile" href="#/${lang.id}/lesson/${next.id}" style="margin-bottom:1rem"><span class="small muted">Continue learning</span>
        <span class="title">${next.cat.emoji} ${h(next.title)}</span><span class="sub">${h(next.cat.title)} · ${h(next.summary)}</span><span class="meta">${levelChip(next.level)}</span></a>` : ''}
      <div class="grid">${tiles}</div>
      <h2 class="section-title">Lessons: grammar &amp; culture</h2>
      <div class="grid">${cats}</div>`;
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

  function readingView(lang) {
    const r = lang.reading;
    setChrome(r.title, `#/${lang.id}`, lang.id);
    if (!view) view = { tab: 'letters', letter: null, word: 0, reveal: false, task: 0, input: '', result: null, trace: r.letters[0].char, form: 0, traceScore: null };
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
        <p class="small muted" style="margin-top:.6rem">Trace over the grey shape with your finger, mouse, Apple Pencil or stylus${isAr(lang) ? '. Draw the main body first, then the dots' : ''}. A stylus draws thicker when you press harder.</p>
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
        view.quiz = newQuiz(qs, 'practice', (q) => { E.logPractice(d, 'reading', pct(q.correct, q.questions.length)); award(q.correct * 5); });
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
    const dark = matchMedia('(prefers-color-scheme: dark)').matches;
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
    reading: { label: 'Reading', icon: '📖', series: 'var(--series-2)', tip: 'Study letters, finish lessons and do letter / accent quizzes.', link: 'read' },
    writing: { label: 'Writing', icon: '✍️', series: 'var(--series-3)', tip: 'Do the Write and Trace exercises in Reading & Writing.', link: 'read' },
    speaking: { label: 'Speaking', icon: '🎙️', series: 'var(--series-4)', tip: 'Use Speaking Practice and play the real-world scenarios.', link: 'speak' },
    overall: { label: 'Overall', icon: '🏁', series: 'var(--series-1)' },
  };

  function fluencyCard(lang) {
    const f = E.fluency(lang, lp(lang.id));
    const row = (k) => `<div class="lvl" style="grid-template-columns:6.5rem 1fr 4.2rem"><span>${SKILL_META[k].icon} ${SKILL_META[k].label}</span>${bar(f[k].score)}<span class="small"><b>${f[k].score}</b> · ${f[k].band}</span></div>`;
    return `<a class="tile level-bars" href="#/${lang.id}/fluency"><span class="title">Progress to fluency</span>
      <span class="sub">Estimated level <b>${h(f.overall.band)}</b>. Tap for details and your trend.</span>
      <div style="margin-top:.5rem">${['reading', 'writing', 'speaking', 'overall'].map(row).join('')}</div></a>`;
  }

  function trendChart(entries) {
    if (entries.length < 2) {
      return '<p class="small muted">Your trend appears here after you practise on two different days.</p>';
    }
    const W = 640, H = 220, L = 34, Rr = 70, T = 12, B = 26;
    const xs = (i) => L + (i * (W - L - Rr)) / (entries.length - 1);
    const ys = (v) => T + ((100 - v) * (H - T - B)) / 100;
    const keys = ['overall', 'reading', 'writing', 'speaking'];
    const grid = [0, 25, 50, 75, 100].map((v) => `<line x1="${L}" x2="${W - Rr}" y1="${ys(v)}" y2="${ys(v)}" class="grid"/><text x="${L - 6}" y="${ys(v) + 4}" text-anchor="end" class="axis">${v}</text>`).join('');
    const lines = keys.map((k) => `<polyline fill="none" stroke="${SKILL_META[k].series}" stroke-width="${k === 'overall' ? 3 : 2}" stroke-linejoin="round" stroke-linecap="round" points="${entries.map((e, i) => `${xs(i)},${ys(e[k])}`).join(' ')}"/>`).join('');
    // Direct end labels, nudged apart so they don't collide.
    const ends = keys.map((k) => ({ k, y: ys(entries[entries.length - 1][k]) })).sort((a, b) => a.y - b.y);
    for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 18) ends[i].y = ends[i - 1].y + 18;
    const labels = ends.map((e) => `<text x="${W - Rr + 6}" y="${e.y + 4}" class="lbl">${SKILL_META[e.k].label}</text>`).join('');
    const first = entries[0].day, last = entries[entries.length - 1].day;
    const hits = entries.map((e, i) => `<rect class="hit" x="${xs(i) - (W - L - Rr) / (entries.length - 1) / 2}" y="${T}" width="${(W - L - Rr) / (entries.length - 1)}" height="${H - T - B}" data-tip="${h(`${e.day}: overall ${e.overall} · reading ${e.reading} · writing ${e.writing} · speaking ${e.speaking}`)}" data-x="${xs(i)}"/>`).join('');
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
        <a class="btn" href="#/${lang.id}/${SKILL_META[k].link}">Practise ${SKILL_META[k].label.toLowerCase()}</a></div>`;
    };
    const rows = d.fluency.slice().reverse().slice(0, 30);
    return `<div class="card center"><p class="muted" style="margin:0">Overall fluency</p><div class="score-big">${f.overall.score}<span class="small muted">/100</span></div>
        <h2>Estimated level ${h(f.overall.band)} · ${h(E.LEVEL_NAMES[f.overall.band])}</h2>
        <p class="small muted">The average of reading, writing and speaking${f.overall.testLevel ? `, blended with your latest aptitude test (${h(f.overall.testLevel)})` : ''}. ${f.overall.testLevel ? '' : `<a href="#/${lang.id}/test">Take the aptitude test</a> to include it.`}</p></div>
      <div class="grid">${['reading', 'writing', 'speaking'].map(skill).join('')}</div>
      <div class="card"><h2>Your trend</h2>${trendChart(d.fluency.slice(-60))}
        ${rows.length ? `<details><summary class="small">Show as a table</summary><div class="table-wrap"><table><thead><tr><th>Day</th><th>Overall</th><th>Reading</th><th>Writing</th><th>Speaking</th></tr></thead>
          <tbody>${rows.map((r) => `<tr><td>${h(r.day)}</td><td>${r.overall}</td><td>${r.reading}</td><td>${r.writing}</td><td>${r.speaking}</td></tr>`).join('')}</tbody></table></div></details>` : ''}</div>
      <details class="card"><summary><b>How fluency is calculated</b></summary>
        <p class="small" style="margin-top:.6rem">Each skill scores 0–100: <b>60% coverage</b> (how much of the course you've practised in that skill) plus <b>40% accuracy</b> (the average of your last 10 scored attempts). Bands: under 20 = A1, under 40 = A2, under 60 = B1, under 80 = B2, 80+ = C1.</p>
        <ul class="small"><li><b>Reading:</b> letters studied and lessons completed; accuracy from lesson quizzes, letter / accent quizzes and challenge reading items.</li>
        <li><b>Writing:</b> writing tasks mastered and letters traced; accuracy from typed answers, tracing scores and challenge writing items.</li>
        <li><b>Speaking:</b> phrases spoken well (score ${E.SPEAK_PASS}+) and scenarios completed; accuracy from pronunciation scores, scenario first-try scores and challenge speaking items.</li></ul>
        <p class="small muted">This is a study estimate, not an official CEFR certificate.</p></details>`;
  }

  // ---------------------------------------------------------------- speech recognition
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let activeRec = null;

  /** Listen once in the target language; calls back with alternative transcripts or an error code. */
  function listen(code, onResult, onError) {
    if (!SR) { onError('unsupported'); return; }
    if (activeRec) { try { activeRec.abort(); } catch (err) { /* already stopped */ } }
    const rec = new SR();
    activeRec = rec;
    rec.lang = code;
    rec.interimResults = false;
    rec.maxAlternatives = 5;
    rec.continuous = false;
    let settled = false;
    const settle = (fn) => { if (settled) return; settled = true; activeRec = null; fn(); };
    rec.onresult = (e) => settle(() => onResult([...e.results[0]].map((a) => a.transcript)));
    rec.onerror = (e) => settle(() => onError(e.error || 'error'));
    rec.onend = () => settle(() => onError('no-speech'));
    try { rec.start(); } catch (err) { settle(() => onError('error')); }
  }

  const SR_MESSAGES = {
    unsupported: "This browser doesn't support speech recognition. Say the phrase aloud, then check yourself.",
    'not-allowed': 'Microphone access was blocked. Allow it in your browser settings, or check yourself.',
    'service-not-allowed': 'Speech recognition is turned off in this browser. Check yourself instead.',
    network: 'Speech recognition needs an internet connection in this browser. Check yourself instead.',
    'no-speech': "I didn't hear anything. Tap the microphone and speak after the beep.",
    'language-not-supported': "This browser can't recognise this language. Check yourself instead.",
  };

  /** Shared listen / record / score panel. st: {status, transcript, score, message}. */
  function speakPanel(p, lang, st) {
    const result = st.status === 'scored'
      ? `<div class="feedback ${st.score >= E.SPEAK_PASS ? 'good' : 'bad'}">${st.score >= E.SPEAK_PASS ? '✓ Great pronunciation!' : 'Close. Listen again and try once more.'} Score: ${st.score}%
          <span class="detail">I heard: <span lang="${lang.id}" dir="${lang.dir}">“${h(st.transcript)}”</span></span></div>` : '';
    const self = st.status === 'self' ? '<div class="feedback good">✓ Marked as practised (self-checked). Self-checks count as practice, but only scored attempts change your accuracy.</div>' : '';
    const msg = st.message ? `<div class="feedback bad">${h(st.message)}</div>` : '';
    return `<div class="flash" style="padding:.6rem 0">
        <div class="big ${isAr(lang) ? 'ar' : ''}" lang="${lang.id}" dir="${lang.dir}" style="font-size:${isAr(lang) ? '2.4rem' : '2rem'}">${h(p.t)}</div>
        ${p.tr ? `<div class="reveal-tr">${h(p.tr)}</div>` : ''}<div class="muted">${h(p.en)}</div></div>
      <div class="row" style="justify-content:center">
        ${canSpeak ? `<button class="btn" data-act="speak" data-text="${h(p.t)}" data-code="${h(lang.speech)}">🔊 Listen</button>` : ''}
        ${SR ? `<button class="btn primary" data-act="speak-listen" ${st.status === 'listening' ? 'disabled' : ''}>${st.status === 'listening' ? '🎙️ Listening…' : '🎙️ Say it'}</button>` : ''}
        <button class="btn" data-act="speak-self" title="Use this if you can't use the microphone">I said it ✓</button></div>
      ${result}${self}${msg}
      ${!SR ? `<p class="small muted center">${h(SR_MESSAGES.unsupported)}</p>` : '<p class="small muted center">Speech is recognised by your browser and may need an internet connection.</p>'}`;
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
  function speakView(lang) {
    setChrome('Speaking Practice', `#/${lang.id}`, lang.id);
    const d = lp(lang.id);
    const all = E.speakingPhrases(lang);
    if (!view) {
      const firstUnspoken = all.findIndex((p) => !(d.speaking[p.t] && d.speaking[p.t].best >= E.SPEAK_PASS));
      view = { i: Math.max(0, firstUnspoken), speak: { status: 'idle' }, busy: true };
    }
    const p = all[view.i];
    const spoken = all.filter((x) => d.speaking[x.t] && d.speaking[x.t].best >= E.SPEAK_PASS).length;
    const rec = d.speaking[p.t];
    const lesson = allLessons(lang).find((l) => l.id === p.lesson);
    return `<div class="card"><div class="row spread"><h1 style="margin:0">🎙️ Speaking Practice</h1><span class="chip">${spoken}/${all.length} spoken well</span></div>
        <p class="muted small" style="margin-top:.4rem">Listen to the model, then tap <b>Say it</b> and repeat. Scores of ${E.SPEAK_PASS}% or more count towards your speaking fluency.</p></div>
      <div class="card">
        <div class="row spread small muted"><span>Phrase ${view.i + 1} of ${all.length} · ${levelChip(p.level)} ${lesson ? h(lesson.title) : ''}</span>
          <span>${rec ? `Best: ${rec.best}%${rec.self ? ' (self-checked)' : ''}` : 'Not tried yet'}</span></div>
        ${speakPanel(p, lang, view.speak)}
        <div class="row" style="justify-content:center;margin-top:1rem">
          <button class="btn" data-act="sp-step" data-d="-1" ${view.i === 0 ? 'disabled' : ''}>← Previous</button>
          <button class="btn" data-act="sp-step" data-d="1" ${view.i >= all.length - 1 ? 'disabled' : ''}>Next →</button></div></div>`;
  }

  // ---------------------------------------------------------------- daily challenge
  function challengeCard(lang) {
    const d = lp(lang.id);
    const today = d.challenges[E.localDay()];
    const streak = E.challengeStreak(d);
    return `<a class="tile" href="#/${lang.id}/challenge"><span class="emoji">⚡</span><span class="title">Daily Challenge</span>
      <span class="sub">${today ? `Done today: ${today.score}/${today.total}. A new one unlocks tomorrow.` : '10 quick items: reading, writing and speaking. About 5 minutes.'}</span>
      <span class="meta"><span class="chip ${today ? 'done' : ''}">${today ? '✓ Completed' : 'Ready'}</span><span class="chip">🔥 ${streak}-day challenge streak</span></span></a>`;
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
        <ul><li>📖 4 reading: meanings, a word to read, a lesson question</li><li>✍️ 3 writing: two typed answers and a spelling check</li><li>🎙️ 3 speaking &amp; listening: two phrases to say and one line to understand</li></ul>
        <p class="small muted">Everyone learning ${h(lang.name)} on this device gets the same challenge all day. Your first completion counts towards your fluency and challenge streak.</p>
        <button class="btn primary" data-act="ch-start">Start today's challenge</button></div>`;
    }
    if (view.phase === 'done') {
      const rec = view.replay ? view.summary : todayRec || view.summary;
      const skills = ['reading', 'writing', 'speaking'].filter((k) => rec.bySkill[k]);
      return `<div class="card center"><p class="muted" style="margin:0">Today's challenge</p><div class="score-big">${rec.score}/${rec.total}</div>
          <p>${rec.score === rec.total ? 'Perfect score! 🎉' : rec.score >= rec.total * 0.7 ? 'Great work!' : 'Good effort. Every day counts.'}</p>
          <p class="small">🔥 ${E.challengeStreak(d)}-day challenge streak · a new challenge unlocks tomorrow</p>
          <div class="row" style="justify-content:center"><button class="btn" data-act="ch-replay">Practise again (not scored)</button><a class="btn primary" href="#/${lang.id}/fluency">See your fluency</a></div></div>
        <div class="card level-bars"><h3>By skill</h3>${skills.map((k) => `<div class="lvl" style="grid-template-columns:7rem 1fr 3rem"><span>${SKILL_META[k].icon} ${SKILL_META[k].label}</span>${bar(pct(rec.bySkill[k].c, rec.bySkill[k].t))}<span>${rec.bySkill[k].c}/${rec.bySkill[k].t}</span></div>`).join('')}</div>`;
    }
    const it = view.items[view.i];
    const answered = view.results.length > view.i;
    let body = '';
    if (it.type === 'choice') {
      body = `<div class="quiz-q">${h(it.q)}</div>
        ${it.t ? `<div class="quiz-t">${tText(it.t, lang, E.hasArabic(it.t) && isAr(lang) ? 'ar' : '')}${speakBtn(it.t, lang)}</div>${it.tr ? `<div class="reveal-tr" style="margin:-.5rem 0 .6rem">${h(it.tr)}</div>` : ''}` : ''}
        <div class="options">${it.options.map((o, i) => {
          let cls = 'option';
          if (answered) { if (i === it.answer) cls += ' correct'; else if (i === view.picked) cls += ' wrong'; }
          return `<button class="${cls}" data-act="ch-pick" data-i="${i}" ${E.hasArabic(o) ? 'lang="ar" dir="auto"' : ''} ${answered ? 'disabled' : ''}>${h(o)}</button>`;
        }).join('')}</div>
        ${answered ? `<div class="feedback ${view.results[view.i].correct ? 'good' : 'bad'}">${view.results[view.i].correct ? '✓ Correct!' : `✗ The answer is: ${h(it.options[it.answer])}`}${it.explain ? `<span class="detail">${h(it.explain)}</span>` : ''}</div>` : ''}`;
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
      <div class="grid tight"><div class="card center"><div class="score-big">${progress.xp}</div><div class="small muted">XP</div></div>
        <div class="card center"><div class="score-big">${progress.streak.count}</div><div class="small muted">day streak</div></div></div>
      <div class="grid">${panels}</div>
      <div class="card"><h2>Backup &amp; sync</h2>
        <p class="small">Export a backup file to keep your progress safe or move it to another browser. The same file works in the Swift Playgrounds app: use <b>Progress → Import</b> there and paste the file's contents.</p>
        <div class="row"><button class="btn primary" data-act="export">⬇️ Export backup</button>
          <label class="btn">⬆️ Import backup<input type="file" accept="application/json,.json" data-change="import" hidden></label>
          <button class="btn" data-act="copy">📋 Copy as text</button>
          <button class="btn danger" data-act="reset">Reset all progress</button></div>
        <p class="small muted" id="backup-msg" aria-live="polite"></p></div>`;
  }

  function backupMsg(text) { const el = document.getElementById('backup-msg'); if (el) el.textContent = text; }

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
      challengeAnswer({ skill: it.skill, correct: view.picked === it.answer, measured: true });
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
      Object.assign(view, { picked: null, typed: '', typeResult: null, speak: { status: 'idle' }, attempts: 0 });
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
    'word-reveal': () => { view.reveal = !view.reveal; render(); },
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
      if (!confirm('Reset ALL progress for both languages? This cannot be undone. Export a backup first if you want to keep it.')) return;
      progress = E.emptyProgress();
      save();
      render();
    },
  };

  const changes = {
    'trace-select': (el) => { view.trace = el.value; view.form = 0; view.traceScore = null; render(); },
    'sc-en': (el) => { view.showEn = el.checked; render(); },
    import: (el) => {
      const file = el.files && el.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          if (!data || typeof data !== 'object' || !data.languages) throw new Error('not a Lingua backup');
          if (!confirm('Replace your current progress with this backup?')) return;
          progress = E.sanitizeProgress(data);
          save();
          render();
          backupMsg('Backup restored.');
        } catch (err) { backupMsg(`Couldn't import: ${err.message}.`); }
      };
      reader.readAsText(file);
    },
  };

  app.addEventListener('click', (e) => {
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
      document.getElementById('tr-result').innerHTML = translationResult(lang);
      e.target.classList.toggle('ar', E.hasArabic(view.text));
    } else if (e.target.id === 'write-input' && view) {
      view.input = e.target.value;
    } else if (e.target.id === 'ch-input' && view) {
      view.typed = e.target.value;
    }
  });
  app.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.id === 'write-input') { e.preventDefault(); actions['write-check'](); }
    if (e.key === 'Enter' && e.target.id === 'ch-input') { e.preventDefault(); actions['ch-check'](); }
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

  window.addEventListener('hashchange', render);
  updateChips();
  document.getElementById('storage-warning').hidden = storageOK;
  render();

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    navigator.serviceWorker.register('sw.js').catch(() => { /* offline support is best-effort */ });
  }
})();
