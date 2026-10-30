/*
 * Lingua engine: pure logic shared by the web UI and the Node tests.
 * The Swift app mirrors these algorithms in Translator.swift / Placement.swift / ProgressStore.swift.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.LinguaEngine = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];
  const PASS = 0.6;

  // ---------- normalization ----------
  const PUNCT = /[¿¡?!.,;:"'“”‘’«»()\[\]…،؟؛—–\-]/g;
  const ARABIC_MARKS = /[ً-ٰٟـ]/g; // harakat, dagger alif, tatweel

  function stripLatinAccents(s) {
    // Keep ñ distinct (año ≠ ano); drop other combining marks.
    return s.normalize('NFD').replace(/(?!̃)[̀-ͯ]/g, '').normalize('NFC');
  }

  function normalizeArabic(s) {
    return s
      .replace(ARABIC_MARKS, '')
      .replace(/[أإآٱ]/g, 'ا')
      .replace(/ى/g, 'ي')
      .replace(/ة/g, 'ه')
      .replace(/ؤ/g, 'و')
      .replace(/ئ/g, 'ي');
  }

  /** Loose form used for matching. lang: 'ar' | 'es' | 'en'. */
  function normalize(text, lang) {
    let s = String(text || '').toLowerCase().replace(PUNCT, ' ');
    if (lang === 'ar') s = normalizeArabic(s);
    else s = stripLatinAccents(s);
    return s.replace(/\s+/g, ' ').trim();
  }

  /** Strict form: punctuation/case/whitespace only (keeps accents), Arabic vowel marks removed. */
  function normalizeStrict(text, lang) {
    let s = String(text || '').toLowerCase().replace(PUNCT, ' ');
    if (lang === 'ar') s = s.replace(ARABIC_MARKS, '');
    return s.normalize('NFC').replace(/\s+/g, ' ').trim();
  }

  const hasArabic = (s) => /[؀-ۿ]/.test(s || '');

  // ---------- dictionary index ----------
  /** English keys for an entry: split alternatives, drop (notes), and "to " for verbs. */
  function englishKeys(en) {
    const keys = new Set();
    String(en).split(/[;,]/).forEach((part) => {
      const clean = part.replace(/\([^)]*\)/g, ' ');
      const k = normalize(clean, 'en');
      if (!k) return;
      keys.add(k);
      if (k.startsWith('to ')) keys.add(k.slice(3));
    });
    return [...keys];
  }

  /** First English alternative without notes, for display. */
  function primaryEnglish(en) {
    const first = String(en).split(';')[0];
    const stripped = first.replace(/\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
    return stripped || first.trim();
  }

  /** Gloss for a list of entries sharing one spelling: "he / the". */
  function glossOf(entries) {
    return [...new Set(entries.map((e) => primaryEnglish(e.en)))].slice(0, 3).join(' / ');
  }

  function buildIndex(language) {
    const lang = language.id;
    const toEn = new Map();
    const fromEn = new Map();
    let maxTarget = 1;
    let maxEn = 1;
    const add = (map, key, entry) => {
      if (!key) return;
      if (!map.has(key)) map.set(key, []);
      const list = map.get(key);
      if (!list.includes(entry)) list.push(entry);
    };
    for (const entry of language.dictionary) {
      String(entry.t).split(' / ').forEach((form) => {
        const k = normalize(form, lang);
        add(toEn, k, entry);
        maxTarget = Math.max(maxTarget, k.split(' ').length);
      });
      for (const k of englishKeys(entry.en)) {
        add(fromEn, k, entry);
        maxEn = Math.max(maxEn, k.split(' ').length);
      }
    }
    return { lang, toEn, fromEn, maxTarget: Math.min(maxTarget, 6), maxEn: Math.min(maxEn, 6) };
  }

  // ---------- morphology fallbacks ----------
  const AR_PREFIXES = [
    ['وبال', 'and with the'], ['وال', 'and the'], ['بال', 'with the'], ['فال', 'so the'], ['كال', 'like the'],
    ['لل', 'for the'], ['ال', 'the'], ['و', 'and'], ['ب', 'with'], ['ل', 'for'], ['ف', 'so'],
  ];
  const AR_SUFFIXES = [
    ['كما', 'your'], ['هما', 'their'], ['كم', 'your'], ['هم', 'their'], ['نا', 'our'], ['ها', 'her'],
    ['ك', 'your'], ['ه', 'his'], ['ي', 'my'],
  ];

  function lookupArabicWord(word, index) {
    const direct = index.toEn.get(word);
    if (direct) return { entry: direct[0], gloss: primaryEnglish(direct[0].en), how: 'word' };
    const tryStem = (stem) => {
      if (stem.length < 2) return null;
      let hit = index.toEn.get(stem);
      if (!hit && stem.endsWith('ت')) hit = index.toEn.get(stem.slice(0, -1) + 'ه'); // سيارتي → سياره
      if (!hit && stem.endsWith('ات')) hit = index.toEn.get(stem.slice(0, -2) + 'ه'); // plural -āt
      if (!hit && stem.endsWith('ون')) hit = index.toEn.get(stem.slice(0, -2)); // plural -ūn
      if (!hit && stem.endsWith('ين')) hit = index.toEn.get(stem.slice(0, -2)); // plural -īn
      return hit ? hit[0] : null;
    };
    // Candidate splits: [prefix gloss, suffix gloss, stem], whole word first.
    const options = [];
    const prefixes = [['', ''], ...AR_PREFIXES.filter(([p]) => word.startsWith(p) && word.length - p.length >= 2)];
    for (const [p, pg] of prefixes) {
      const rest = word.slice(p.length);
      options.push([pg, '', rest]);
      for (const [s, sg] of AR_SUFFIXES) {
        if (rest.endsWith(s) && rest.length - s.length >= 2) options.push([pg, sg, rest.slice(0, -s.length)]);
      }
    }
    for (const [pg, sg, stem] of options) {
      const entry = tryStem(stem);
      if (!entry) continue;
      // A possessive ending replaces "the": والبيت → and the house, وبيتي → and my house.
      const prefix = sg ? pg.replace(/ ?the$/, '') : pg;
      const gloss = [prefix, sg, primaryEnglish(entry.en)].filter(Boolean).join(' ');
      return { entry, gloss, how: 'stem' };
    }
    return null;
  }

  function lookupSpanishWord(word, index) {
    const direct = index.toEn.get(word);
    if (direct) return { entry: direct[0], gloss: glossOf(direct), how: 'word' };
    const variants = [];
    if (word.endsWith('es')) variants.push(word.slice(0, -2));
    if (word.endsWith('s')) variants.push(word.slice(0, -1));
    // Diminutives: cafecito → café, ahorita → ahora, poquito → poco.
    const dim = word.match(/^(.+?)c?it([oa])s?$/);
    if (dim) {
      const base = dim[1];
      const plain = base.replace(/qu$/, 'c').replace(/gu$/, 'g');
      variants.push(base, base + dim[2], plain + dim[2], plain + 'o', plain + 'a');
    }
    if (/[ao]s?$/.test(word)) variants.push(word.replace(/as?$/, 'o'), word.replace(/os?$/, 'a'));
    for (const v of variants) {
      const hit = index.toEn.get(v);
      if (hit) return { entry: hit[0], gloss: glossOf(hit), how: 'stem' };
    }
    return null;
  }

  function lookupEnglishWord(word, index) {
    const direct = index.fromEn.get(word);
    if (direct) return { entry: direct[0], how: 'word' };
    const variants = [];
    if (word.endsWith('ies')) variants.push(word.slice(0, -3) + 'y');
    if (word.endsWith('es')) variants.push(word.slice(0, -2));
    if (word.endsWith('s')) variants.push(word.slice(0, -1));
    if (word.endsWith('ing')) variants.push(word.slice(0, -3), word.slice(0, -3) + 'e');
    if (word.endsWith('ed')) variants.push(word.slice(0, -2), word.slice(0, -1));
    for (const v of variants) {
      const hit = index.fromEn.get(v);
      if (hit) return { entry: hit[0], how: 'stem' };
    }
    return null;
  }

  // ---------- translation ----------
  /**
   * Offline dictionary translation.
   * direction: 'toEn' (target → English) or 'fromEn' (English → target).
   * Returns { output, outputTr, tokens:[{src, out, tr, how}], exact }.
   */
  function translate(text, language, direction, index) {
    index = index || buildIndex(language);
    const lang = language.id;
    const srcLang = direction === 'toEn' ? lang : 'en';
    const norm = normalize(text, srcLang);
    const empty = { output: '', outputTr: '', tokens: [], exact: null, coverage: 0 };
    if (!norm) return empty;
    const map = direction === 'toEn' ? index.toEn : index.fromEn;
    const maxN = direction === 'toEn' ? index.maxTarget : index.maxEn;
    const skip = new Set(direction === 'fromEn' ? (language.translateSkipEn || []) : []);

    const exactHit = map.get(norm);
    const words = norm.split(' ');
    const tokens = [];
    let i = 0;
    while (i < words.length) {
      let matched = false;
      for (let n = Math.min(maxN, words.length - i); n >= 1; n--) {
        const phrase = words.slice(i, i + n).join(' ');
        const hit = map.get(phrase);
        if (hit && (n > 1 || !skip.has(phrase))) {
          const e = hit[0];
          tokens.push(direction === 'toEn'
            ? { src: phrase, out: glossOf(hit), tr: e.tr || '', how: n > 1 ? 'phrase' : 'word', entry: e }
            : { src: phrase, out: e.t, tr: e.tr || '', how: n > 1 ? 'phrase' : 'word', entry: e });
          i += n;
          matched = true;
          break;
        }
      }
      if (matched) continue;
      const w = words[i];
      if (skip.has(w)) { tokens.push({ src: w, out: '', tr: '', how: 'skip' }); i++; continue; }
      let res = null;
      if (direction === 'toEn') res = lang === 'ar' ? lookupArabicWord(w, index) : lookupSpanishWord(w, index);
      else {
        const r = lookupEnglishWord(w, index);
        if (r) res = { entry: r.entry, gloss: r.entry.t, how: r.how };
      }
      if (res) tokens.push({ src: w, out: res.gloss, tr: res.entry.tr || '', how: res.how, entry: res.entry });
      else tokens.push({ src: w, out: `[${w}]`, tr: '', how: 'none' });
      i++;
    }
    const shown = tokens.filter((t) => t.how !== 'skip');
    const known = shown.filter((t) => t.how !== 'none').length;
    const exact = exactHit ? exactHit[0] : null;
    let output = shown.map((t) => t.out).join(' ');
    let outputTr = shown.map((t) => t.tr || (t.how === 'none' ? t.out : '')).filter(Boolean).join(' ');
    if (exact) {
      output = direction === 'toEn' ? glossOf(exactHit) : exact.t;
      outputTr = exact.tr || '';
    }
    return {
      output, outputTr,
      tokens: shown.map(({ src, out, tr, how }) => ({ src, out, tr, how })),
      exact: exact ? { t: exact.t, tr: exact.tr || '', en: exact.en } : null,
      coverage: shown.length ? known / shown.length : 0,
    };
  }

  /** Guess direction: Arabic script → toEn; otherwise compare dictionary hits. */
  function detectDirection(text, language, index) {
    index = index || buildIndex(language);
    if (language.id === 'ar') return hasArabic(text) ? 'toEn' : 'fromEn';
    const words = normalize(text, 'es').split(' ').filter(Boolean);
    let es = 0, en = 0;
    for (const w of words) {
      if (index.toEn.has(w)) es++;
      if (index.fromEn.has(normalize(w, 'en'))) en++;
    }
    if (/[ñ¿¡áéíóú]/i.test(text)) es += 2;
    return es > en ? 'toEn' : 'fromEn';
  }

  // ---------- writing practice ----------
  /** Returns { ok, perfect, expected }. ok ignores accents; perfect also matches accents. */
  function checkWriting(input, task, lang) {
    const answers = [task.answer, ...(task.alts || [])];
    const loose = normalize(input, lang);
    const strict = normalizeStrict(input, lang);
    if (!loose) return { ok: false, perfect: false, expected: task.answer };
    for (const a of answers) {
      if (normalizeStrict(a, lang) === strict) return { ok: true, perfect: true, expected: a };
    }
    for (const a of answers) {
      if (normalize(a, lang) === loose) return { ok: true, perfect: false, expected: a };
    }
    return { ok: false, perfect: false, expected: task.answer };
  }

  // ---------- placement ----------
  /**
   * questions: aptitude list; answers: array of chosen option indexes (or -1 / null).
   * Placement = highest level L such that every level up to L is passed (≥60%).
   * Scoring ≥80% at the top tested level recommends the next level (e.g. C1).
   */
  function placement(questions, answers) {
    const byLevel = {};
    const bySkill = {};
    let correct = 0;
    questions.forEach((q, i) => {
      const ok = answers[i] === q.answer;
      if (ok) correct++;
      const L = (byLevel[q.level] = byLevel[q.level] || { c: 0, t: 0 });
      L.t++; if (ok) L.c++;
      const S = (bySkill[q.skill] = bySkill[q.skill] || { c: 0, t: 0 });
      S.t++; if (ok) S.c++;
    });
    const tested = LEVELS.filter((l) => byLevel[l]);
    let level = 'A1';
    let passedAll = true;
    let lastPassed = null;
    for (const l of tested) {
      const r = byLevel[l];
      if (r.c / r.t >= PASS) { lastPassed = l; level = l; } else { passedAll = false; break; }
    }
    if (lastPassed && passedAll) {
      const top = tested[tested.length - 1];
      const r = byLevel[top];
      const next = LEVELS[LEVELS.indexOf(top) + 1];
      if (next && r.c / r.t >= 0.8) level = next;
    }
    const beginner = !lastPassed;
    return { level, beginner, score: correct, total: questions.length, byLevel, bySkill };
  }

  const LEVEL_NAMES = {
    A1: 'Beginner', A2: 'Elementary', B1: 'Intermediate', B2: 'Upper intermediate', C1: 'Advanced',
  };

  // ---------- progress ----------
  function emptyLang() {
    return {
      lessons: {}, scenarios: {}, aptitude: [], letters: {}, writing: {}, saved: [], lastVisit: null,
      tracing: {}, speaking: {}, practice: { reading: [], writing: [], listening: [], speaking: [] }, challenges: {}, fluency: [],
      listening: {}, srs: {}, prompts: {}, minutes: {},
      checks: {}, plan: {},
    };
  }
  function emptyProgress() {
    return { version: 1, xp: 0, streak: { count: 0, last: null }, languages: { ar: emptyLang(), es: emptyLang() }, updatedAt: null };
  }
  const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);

  /** Coerce any parsed JSON into a valid progress object (used on load and import). */
  function sanitizeProgress(raw) {
    const p = emptyProgress();
    if (!isObj(raw)) return p;
    p.xp = Number.isFinite(raw.xp) ? Math.max(0, Math.floor(raw.xp)) : 0;
    if (isObj(raw.streak)) {
      p.streak.count = Number.isFinite(raw.streak.count) ? Math.max(0, Math.floor(raw.streak.count)) : 0;
      p.streak.last = typeof raw.streak.last === 'string' ? raw.streak.last : null;
    }
    p.updatedAt = typeof raw.updatedAt === 'string' ? raw.updatedAt : null;
    const langs = isObj(raw.languages) ? raw.languages : {};
    for (const id of Object.keys(langs)) {
      const src = langs[id];
      if (!isObj(src)) continue;
      const dst = emptyLang();
      if (isObj(src.lessons)) for (const [k, v] of Object.entries(src.lessons)) {
        if (isObj(v)) dst.lessons[k] = { best: clampPct(v.best), done: !!v.done, at: typeof v.at === 'string' ? v.at : null };
      }
      if (isObj(src.scenarios)) for (const [k, v] of Object.entries(src.scenarios)) {
        if (isObj(v)) dst.scenarios[k] = { best: clampPct(v.best), at: typeof v.at === 'string' ? v.at : null };
      }
      if (Array.isArray(src.aptitude)) dst.aptitude = src.aptitude.filter(isObj).map((r) => ({
        at: typeof r.at === 'string' ? r.at : null,
        level: LEVELS.includes(r.level) ? r.level : 'A1',
        score: Number.isFinite(r.score) ? r.score : 0,
        total: Number.isFinite(r.total) ? r.total : 0,
        bySkill: isObj(r.bySkill) ? Object.fromEntries(Object.entries(r.bySkill).filter(([, v]) => isObj(v)).map(([k, v]) => [k, { c: v.c | 0, t: v.t | 0 }])) : {},
      })).slice(-20);
      if (isObj(src.letters)) for (const [k, v] of Object.entries(src.letters)) if (Number.isFinite(v)) dst.letters[k] = Math.max(0, Math.floor(v));
      if (isObj(src.writing)) for (const [k, v] of Object.entries(src.writing)) if (v === true) dst.writing[k] = true;
      if (Array.isArray(src.saved)) dst.saved = src.saved.filter((s) => isObj(s) && typeof s.t === 'string' && typeof s.en === 'string')
        .map((s) => (s.tr ? { t: s.t, tr: String(s.tr), en: s.en } : { t: s.t, en: s.en })).slice(0, 500);
      dst.lastVisit = typeof src.lastVisit === 'string' ? src.lastVisit : null;
      if (isObj(src.tracing)) for (const [k, v] of Object.entries(src.tracing)) if (Number.isFinite(v)) dst.tracing[k] = Math.max(0, Math.floor(v));
      if (isObj(src.speaking)) for (const [k, v] of Object.entries(src.speaking)) {
        if (isObj(v)) dst.speaking[k] = v.self ? { best: clampPct(v.best), self: true } : { best: clampPct(v.best) };
      }
      if (isObj(src.practice)) for (const skill of SKILLS) {
        const list = src.practice[skill];
        if (Array.isArray(list)) dst.practice[skill] = list.filter(Number.isFinite).map(clampPct).slice(-PRACTICE_KEEP);
      }
      if (isObj(src.challenges)) {
        const days = Object.keys(src.challenges).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && isObj(src.challenges[d])).sort().slice(-CHALLENGE_KEEP);
        for (const d of days) {
          const c = src.challenges[d];
          dst.challenges[d] = {
            score: Number.isFinite(c.score) ? Math.max(0, c.score | 0) : 0,
            total: Number.isFinite(c.total) ? Math.max(0, c.total | 0) : 0,
            bySkill: isObj(c.bySkill) ? Object.fromEntries(Object.entries(c.bySkill).filter(([, v]) => isObj(v)).map(([k, v]) => [k, { c: v.c | 0, t: v.t | 0 }])) : {},
          };
        }
      }
      if (isObj(src.listening)) for (const [k, v] of Object.entries(src.listening)) if (isObj(v)) dst.listening[k] = { best: clampPct(v.best) };
      if (isObj(src.srs)) for (const [k, v] of Object.entries(src.srs)) {
        if (isObj(v) && typeof v.due === 'string') dst.srs[k] = { box: Math.max(0, Math.min(SRS_DAYS.length - 1, v.box | 0)), due: v.due, seen: Math.max(0, v.seen | 0) };
      }
      if (isObj(src.prompts)) for (const [k, v] of Object.entries(src.prompts)) {
        if (isObj(v)) dst.prompts[k] = v.self ? { best: clampPct(v.best), self: true } : { best: clampPct(v.best) };
      }
      if (isObj(src.minutes)) {
        const days = Object.keys(src.minutes).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && Number.isFinite(src.minutes[d])).sort().slice(-MINUTES_KEEP);
        for (const d of days) dst.minutes[d] = Math.max(0, Math.min(1440, src.minutes[d] | 0));
      }
      if (isObj(src.checks)) for (const [k, v] of Object.entries(src.checks)) if (Number.isFinite(v)) dst.checks[k] = Math.max(0, Math.min(1000, Math.floor(v)));
      if (isObj(src.plan)) {
        if (PLAN_STARTS.includes(src.plan.start)) dst.plan.start = src.plan.start;
        if (PLAN_DIALECTS.includes(src.plan.dialect)) dst.plan.dialect = src.plan.dialect;
      }
      if (Array.isArray(src.fluency)) dst.fluency = src.fluency.filter((f) => isObj(f) && typeof f.day === 'string')
        .map((f) => ({ day: f.day, reading: clampPct(f.reading), writing: clampPct(f.writing), listening: clampPct(f.listening), speaking: clampPct(f.speaking), overall: clampPct(f.overall) }))
        .slice(-FLUENCY_KEEP);
      p.languages[id] = dst;
    }
    return p;
  }
  function clampPct(v) { return Number.isFinite(v) ? Math.max(0, Math.min(100, Math.round(v))) : 0; }

  function localDay(d) {
    d = d || new Date();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
  }

  /** Update streak in place for activity on `now`. */
  function touchStreak(progress, now) {
    const today = localDay(now);
    const last = progress.streak.last;
    if (last === today) return progress;
    const y = new Date(now || Date.now());
    y.setDate(y.getDate() - 1);
    progress.streak.count = last === localDay(y) ? progress.streak.count + 1 : 1;
    progress.streak.last = today;
    return progress;
  }

  /** Summary numbers for a language. */
  function languageStats(language, lp) {
    const lessons = language.categories.flatMap((c) => c.lessons);
    const done = lessons.filter((l) => lp.lessons[l.id] && lp.lessons[l.id].done).length;
    const scen = language.scenarios.filter((s) => lp.scenarios[s.id]).length;
    const letters = language.reading.letters.filter((l) => (lp.letters[l.char] || 0) > 0).length;
    const writing = language.reading.writing.filter((w) => lp.writing[w.answer]).length;
    const total = lessons.length + language.scenarios.length + language.reading.letters.length + language.reading.writing.length;
    const got = done + scen + letters + writing;
    const last = lp.aptitude.length ? lp.aptitude[lp.aptitude.length - 1] : null;
    return {
      lessonsDone: done, lessonsTotal: lessons.length,
      scenariosDone: scen, scenariosTotal: language.scenarios.length,
      lettersDone: letters, lettersTotal: language.reading.letters.length,
      writingDone: writing, writingTotal: language.reading.writing.length,
      percent: total ? Math.round((got / total) * 100) : 0,
      level: last ? last.level : null,
    };
  }

  // ---------- practice log ----------
  const SKILLS = ['reading', 'writing', 'listening', 'speaking'];
  const PRACTICE_KEEP = 30;
  const MINUTES_KEEP = 400;
  const SRS_DAYS = [0, 1, 3, 7, 14, 30, 60, 120];
  const LISTEN_PASS = 80;
  const PROMPT_PASS = 70;
  const CHALLENGE_KEEP = 60;
  const FLUENCY_KEEP = 180;

  /** Record a measured result (0–100) for a skill; recent results drive the accuracy part of fluency. */
  function logPractice(lp, skill, pct) {
    if (!SKILLS.includes(skill) || !Number.isFinite(pct)) return;
    lp.practice[skill].push(clampPct(pct));
    lp.practice[skill] = lp.practice[skill].slice(-PRACTICE_KEEP);
  }

  // ---------- speaking ----------
  /** Phrases suitable for speaking practice: lesson vocabulary and examples without slashes or ellipses. */
  function speakingPhrases(language) {
    const seen = new Set();
    const out = [];
    for (const cat of language.categories) {
      for (const lesson of cat.lessons) {
        for (const p of [...lesson.vocab, ...lesson.examples]) {
          if (/[\/…]|\.\.\./.test(p.t) || seen.has(p.t)) continue;
          seen.add(p.t);
          out.push({ ...p, level: lesson.level, lesson: lesson.id });
        }
      }
    }
    return out;
  }

  function levenshtein(a, b) {
    const x = [...a], y = [...b];
    let prev = Array.from({ length: y.length + 1 }, (_, j) => j);
    for (let i = 1; i <= x.length; i++) {
      const cur = [i];
      for (let j = 1; j <= y.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (x[i - 1] === y[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return prev[y.length];
  }

  /** How close a spoken transcript is to the target phrase, 0–100 (spaces, case, accents and vowel marks ignored). */
  function similarity(said, target, lang) {
    const a = normalize(said, lang).replace(/ /g, '');
    const b = normalize(target, lang).replace(/ /g, '');
    if (!a || !b) return 0;
    return Math.round(100 * (1 - levenshtein(a, b) / Math.max([...a].length, [...b].length)));
  }
  const SPEAK_PASS = 70;

  // ---------- seeded randomness (daily challenge) ----------
  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function seeded(seed) {
    // mulberry32
    return () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function seededShuffle(list, rand) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  // Arabic letters that differ only by dots: swapping them makes convincing misspellings.
  const DOT_GROUPS = ['بتثني', 'جحخ', 'دذ', 'رز', 'سش', 'صض', 'طظ', 'عغ', 'فق'];
  const ACUTE = { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú' };

  /** Plausible misspellings of a word (Arabic: dot swaps; Spanish: moved / missing accents). */
  function misspellings(word, lang) {
    const out = new Set();
    const chars = [...word];
    if (lang === 'ar') {
      chars.forEach((ch, i) => {
        const group = DOT_GROUPS.find((g) => g.includes(ch));
        if (!group) return;
        for (const alt of group) if (alt !== ch) out.add([...chars.slice(0, i), alt, ...chars.slice(i + 1)].join(''));
      });
    } else {
      const bare = word.normalize('NFD').replace(/́/g, '').normalize('NFC');
      out.add(bare);
      [...bare].forEach((ch, i) => {
        if (ACUTE[ch]) { const b = [...bare]; b[i] = ACUTE[ch]; out.add(b.join('')); }
      });
    }
    out.delete(word);
    return [...out];
  }

  /** Highest level the learner is working at: their test result or hardest finished lesson, plus one. */
  function workingLevelIndex(language, lp) {
    let idx = 0;
    const last = lp.aptitude.length ? lp.aptitude[lp.aptitude.length - 1] : null;
    if (last) idx = Math.max(idx, LEVELS.indexOf(last.level));
    for (const c of language.categories) for (const l of c.lessons) {
      if (lp.lessons[l.id] && lp.lessons[l.id].done) idx = Math.max(idx, LEVELS.indexOf(l.level));
    }
    return Math.min(idx + 1, LEVELS.length - 1);
  }

  /**
   * Ten mixed items, the same all day for a given language and date:
   * 3 reading, 3 writing, 2 listening (dictation + comprehension) and 2 speaking.
   * Item types: choice {q, t?, tr?, options, answer, explain?, audio?}, type {prompt, answer, alts?, hint?},
   * dictation {t, tr?, en}, speak {t, tr?, en}.
   */
  function dailyChallenge(language, lp, day) {
    const rand = seeded(hash(`${language.id}:${day}`));
    const pick = (arr) => arr[Math.floor(rand() * arr.length)];
    const cap = workingLevelIndex(language, lp);
    const lessons = language.categories.flatMap((c) => c.lessons);
    let pool = lessons.filter((l) => LEVELS.indexOf(l.level) <= cap);
    if (pool.length < 4) pool = lessons.slice(0, 4);
    const vocab = [];
    const seenV = new Set();
    for (const l of pool) for (const v of l.vocab) if (!seenV.has(v.en) && !/…|\.\.\./.test(v.t)) { seenV.add(v.en); vocab.push(v); }
    const items = [];
    const meaning = (p, withTr) => {
      const wrong = seededShuffle(vocab.filter((v) => v.en !== p.en), rand).slice(0, 3).map((v) => v.en);
      const options = seededShuffle([p.en, ...wrong], rand);
      const item = { type: 'choice', skill: 'reading', q: 'What does this mean?', t: p.t, options, answer: options.indexOf(p.en) };
      if (withTr && p.tr) item.tr = p.tr;
      return item;
    };
    // Reading
    seededShuffle(vocab, rand).slice(0, 1).forEach((v) => items.push(meaning(v, false)));
    const word = pick(language.reading.words);
    items.push({ ...meaning(word, false), q: 'Read this word. What does it mean?' });
    const lq = pick(pick(pool).quiz);
    items.push({ type: 'choice', skill: 'reading', q: lq.q, ...(lq.t ? { t: lq.t } : {}), options: lq.options, answer: lq.answer, ...(lq.explain ? { explain: lq.explain } : {}) });
    // Writing
    seededShuffle(language.reading.writing, rand).slice(0, 2).forEach((w) => {
      const item = { type: 'type', skill: 'writing', prompt: `Write “${w.en}” in ${language.name}`, answer: w.answer };
      if (w.alts) item.alts = w.alts;
      if (w.hint) item.hint = w.hint;
      items.push(item);
    });
    // A "misspelling" that is itself a real word (como / cómo) would be a wrong distractor.
    const real = new Set([...language.dictionary, ...language.reading.words].map((e) => normalizeStrict(e.t, language.id)));
    const wrongSpellings = (w) => misspellings(w, language.id).filter((m) => !real.has(normalizeStrict(m, language.id)));
    const spellPool = (language.id === 'ar'
      ? language.reading.words.map((w) => ({ t: normalizeStrict(w.t, 'ar'), en: w.en }))
      : language.dictionary.filter((e) => /[áéíóú]/.test(e.t) && /^[a-zñüáéíóú]+$/i.test(e.t) && e.t.length > 3))
      .filter((w) => wrongSpellings(w.t).length >= 3);
    const sp = pick(spellPool);
    const wrongSp = seededShuffle(wrongSpellings(sp.t), rand).slice(0, 3);
    const spOptions = seededShuffle([sp.t, ...wrongSp], rand);
    items.push({
      type: 'choice', skill: 'writing', q: `Which is the correct spelling of “${primaryEnglish(sp.en)}”?`, options: spOptions, answer: spOptions.indexOf(sp.t),
      explain: language.id === 'ar' ? 'Watch the dots: they are the only difference between many Arabic letters.' : 'The written accent marks the stressed syllable.',
    });
    // Speaking
    const speakPool = speakingPhrases(language).filter((p) => LEVELS.indexOf(p.level) <= cap && p.t.split(' ').length <= 5);
    seededShuffle(speakPool, rand).slice(0, 2).forEach((p) => items.push({ type: 'speak', skill: 'speaking', t: p.t, ...(p.tr ? { tr: p.tr } : {}), en: p.en }));
    // Listening: dictation, then comprehension of a scenario line (audio first, text on request)
    const dictPool = listeningItems(language).filter((x) => LEVELS.indexOf(x.level) <= cap && x.t.split(' ').length <= 6);
    const dict = pick(dictPool.length ? dictPool : listeningItems(language));
    items.push({ type: 'dictation', skill: 'listening', t: dict.t, ...(dict.tr ? { tr: dict.tr } : {}), en: dict.en });
    const listen = [];
    for (const sc of language.scenarios) {
      if (LEVELS.indexOf(sc.level) > cap) continue;
      for (const st of sc.steps) if (st.mode === 'understand' && st.line) listen.push({ sc, st });
    }
    const pickL = listen.length ? pick(listen) : null;
    if (pickL) {
      const options = pickL.st.choices.map((c) => c.en);
      const item = { type: 'choice', skill: 'listening', audio: true, q: `Listen to ${pickL.st.speaker || 'the speaker'}. What do they say?`, t: pickL.st.line.t, options, answer: pickL.st.choices.findIndex((c) => c.correct) };
      if (pickL.st.line.tr) item.tr = pickL.st.line.tr;
      items.push(item);
    }
    return items.map((it, i) => ({ id: `${language.id}-${day}-${i}`, ...it }));
  }

  /** Consecutive days (ending today or yesterday) with a completed daily challenge. */
  function challengeStreak(lp, now) {
    const done = new Set(Object.keys(lp.challenges));
    const d = new Date(now || Date.now());
    if (!done.has(localDay(d))) d.setDate(d.getDate() - 1);
    let n = 0;
    while (done.has(localDay(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  // ---------- listening ----------
  /** Lines to listen to: lesson examples and what people say in scenarios. */
  function listeningItems(language) {
    const seen = new Set();
    const out = [];
    const add = (p, level, source) => {
      if (!p || !p.t || seen.has(p.t) || /[\/…]|\.\.\./.test(p.t)) return;
      seen.add(p.t);
      out.push({ t: p.t, ...(p.tr ? { tr: p.tr } : {}), en: p.en, level, source });
    };
    for (const cat of language.categories) for (const l of cat.lessons) for (const p of l.examples) add(p, l.level, l.id);
    for (const sc of language.scenarios) for (const st of sc.steps) add(st.line, sc.level, sc.id);
    return out;
  }

  /** Score a dictation attempt 0–100 against the line (accents and vowel marks don't count against you). */
  function dictationScore(typed, target, lang) {
    return similarity(typed, target, lang);
  }

  // ---------- spaced repetition ----------
  function addDays(day, n) {
    const d = new Date(`${day}T12:00:00`);
    d.setDate(d.getDate() + n);
    return localDay(d);
  }

  /** Every vocabulary card: lesson vocabulary (in course order) plus saved words. */
  function srsDeck(language, lp) {
    const seen = new Set();
    const out = [];
    for (const cat of language.categories) {
      for (const l of cat.lessons) {
        for (const v of l.vocab) {
          if (seen.has(v.t) || /…|\.\.\./.test(v.t)) continue;
          seen.add(v.t);
          out.push({ t: v.t, ...(v.tr ? { tr: v.tr } : {}), en: v.en, lesson: l.id, level: l.level });
        }
      }
    }
    for (const sv of lp.saved) {
      if (seen.has(sv.t)) continue;
      seen.add(sv.t);
      out.push({ t: sv.t, ...(sv.tr ? { tr: sv.tr } : {}), en: sv.en, lesson: null, level: null });
    }
    return out;
  }

  /**
   * Today's review queue: cards that are due (oldest first), then new cards from lessons you've
   * finished and words you've saved, up to `newLimit`.
   */
  function srsQueue(language, lp, day, newLimit) {
    const limit = newLimit == null ? 10 : newLimit;
    const deck = srsDeck(language, lp);
    const due = deck.filter((c) => lp.srs[c.t] && lp.srs[c.t].due <= day)
      .sort((a, b) => (lp.srs[a.t].due < lp.srs[b.t].due ? -1 : lp.srs[a.t].due > lp.srs[b.t].due ? 1 : 0));
    const unlocked = (c) => (c.lesson ? !!(lp.lessons[c.lesson] && lp.lessons[c.lesson].done) : true);
    const fresh = deck.filter((c) => !lp.srs[c.t] && unlocked(c)).slice(0, limit);
    return [...due, ...fresh];
  }

  /** Grade a card: 'again' (back to the start), 'good' (next box) or 'easy' (skip a box). */
  function srsGrade(lp, cardT, grade, day) {
    const prev = lp.srs[cardT] || { box: 0, due: day, seen: 0 };
    let box = prev.box;
    if (grade === 'again') box = 0;
    else if (grade === 'easy') box = Math.min(SRS_DAYS.length - 1, box + 2);
    else box = Math.min(SRS_DAYS.length - 1, box + 1);
    lp.srs[cardT] = { box, due: addDays(day, grade === 'again' ? 0 : SRS_DAYS[box]), seen: prev.seen + 1 };
    return lp.srs[cardT];
  }

  function srsStats(language, lp, day) {
    const deck = srsDeck(language, lp);
    const learned = deck.filter((c) => lp.srs[c.t] && lp.srs[c.t].box >= 3).length;
    const due = deck.filter((c) => lp.srs[c.t] && lp.srs[c.t].due <= day).length;
    const unlockedNew = srsQueue(language, lp, day, Infinity).length - due;
    return { total: deck.length, learned, due, newAvailable: unlockedNew, started: deck.filter((c) => lp.srs[c.t]).length };
  }

  // ---------- free writing & speaking ----------
  const knownCache = new Map();
  /** Every word that appears anywhere in the course for this language (loose form → strict spellings). */
  function knownWords(language) {
    if (knownCache.has(language)) return knownCache.get(language);
    const map = new Map();
    const addText = (text) => {
      if (!text) return;
      String(text).split(/\s+/).forEach((w) => {
        const strict = normalizeStrict(w, language.id);
        const loose = normalize(w, language.id);
        if (!loose || /\d/.test(loose)) return;
        if (!map.has(loose)) map.set(loose, new Set());
        map.get(loose).add(strict);
      });
    };
    const addP = (p) => { if (p) addText(p.t); };
    language.dictionary.forEach((e) => String(e.t).split(' / ').forEach(addText));
    for (const c of language.categories) for (const l of c.lessons) {
      l.vocab.forEach((v) => String(v.t).split(' / ').forEach(addText));
      l.examples.forEach(addP);
      l.quiz.forEach((q) => { addText(q.t); q.options.forEach(addText); });
      (l.grammar.table ? l.grammar.table.rows.flat() : []).forEach(addText);
    }
    language.reading.words.forEach(addP);
    language.reading.writing.forEach((w) => { addText(w.answer); (w.alts || []).forEach(addText); });
    for (const sc of language.scenarios) for (const st of sc.steps) { addP(st.line); (st.choices || []).forEach((c) => addText(c.t)); }
    for (const pr of [...(language.writingPrompts || []), ...(language.speakingPrompts || [])]) addP(pr.model);
    knownCache.set(language, map);
    return map;
  }

  function isKnownWord(token, language, index) {
    const map = knownWords(language);
    if (map.has(token)) return true;
    const hit = language.id === 'ar' ? lookupArabicWord(token, index) : lookupSpanishWord(token, index);
    if (hit) return true;
    if (language.id === 'ar') {
      for (const [p] of AR_PREFIXES) if (token.startsWith(p) && map.has(token.slice(p.length))) return true;
      for (const [sfx] of AR_SUFFIXES) if (token.endsWith(sfx) && map.has(token.slice(0, -sfx.length))) return true;
    } else {
      for (const end of ['s', 'es', 'mente']) if (token.endsWith(end) && map.has(token.slice(0, -end.length))) return true;
    }
    return false;
  }

  /** Does the text use any of the alternatives? Arabic tokens are also checked without a leading و / ف. */
  function meetsRequirement(normText, req, lang) {
    const padded = ` ${normText} `;
    const stripped = lang === 'ar' ? ` ${normText.split(' ').map((w) => (w.length > 2 && /^[وف]/.test(w) ? w.slice(1) : w)).join(' ')} ` : padded;
    return req.any.some((alt) => {
      const a = normalize(alt, lang);
      return a && (padded.includes(` ${a} `) || stripped.includes(` ${a} `));
    });
  }

  /**
   * Automatic feedback on free writing or a spoken answer. It checks the prompt's requirements,
   * length, words the course doesn't know (possible misspellings) and missing accents / hamza.
   * It cannot judge grammar fully, so the model answer is always shown too.
   */
  function analyzePrompt(text, prompt, language, index) {
    index = index || buildIndex(language);
    const lang = language.id;
    const norm = normalize(text, lang);
    const rawWords = String(text || '').split(/\s+/).filter((w) => normalize(w, lang));
    const words = rawWords.length;
    const requirements = prompt.requirements.map((r) => ({ label: r.label, met: meetsRequirement(norm, r, lang) }));
    const map = knownWords(language);
    const unknown = [];
    const accentHints = [];
    const seenU = new Set();
    for (const w of rawWords) {
      const loose = normalize(w, lang);
      const strict = normalizeStrict(w, lang);
      if (!loose || /\d/.test(loose) || seenU.has(loose)) continue;
      seenU.add(loose);
      if (loose.length <= 1) continue;
      if (map.has(loose)) {
        const spellings = map.get(loose);
        if (!spellings.has(strict) && strict) accentHints.push({ word: w.replace(/[¿¡?!.,;:"'“”«»()]/g, ''), suggestion: [...spellings][0] });
      } else if (!isKnownWord(loose, language, index)) {
        unknown.push(w.replace(/[¿¡?!.,;:"'“”«»()]/g, ''));
      }
    }
    const met = requirements.filter((r) => r.met).length;
    const lengthPart = Math.min(1, words / Math.max(1, prompt.minWords));
    const knownPart = words ? Math.max(0, 1 - unknown.length / Math.max(1, seenU.size)) : 0;
    const score = words ? Math.round(100 * (0.5 * (met / requirements.length) + 0.3 * lengthPart + 0.2 * knownPart)) : 0;
    return { words, minWords: prompt.minWords, requirements, unknown, accentHints, score, passed: score >= PROMPT_PASS };
  }

  // ---------- study time ----------
  /** Add one active minute for `day`. */
  function logMinute(lp, day) {
    lp.minutes[day] = (lp.minutes[day] || 0) + 1;
    const days = Object.keys(lp.minutes).sort();
    for (const old of days.slice(0, Math.max(0, days.length - MINUTES_KEEP))) delete lp.minutes[old];
  }

  /** Total and recent study time, compared with the rough hours each level takes. */
  function studyTime(language, lp, now) {
    const total = Object.values(lp.minutes).reduce((a, b) => a + b, 0);
    let week = 0;
    const d = new Date(now || Date.now());
    for (let i = 0; i < 7; i++) { week += lp.minutes[localDay(d)] || 0; d.setDate(d.getDate() - 1); }
    const hours = total / 60;
    const levelHours = language.levelHours || {};
    const next = LEVELS.find((l) => (levelHours[l] || 0) > hours) || null;
    return { minutes: total, hours, weekMinutes: week, levelHours, nextLevel: next, nextLevelHours: next ? levelHours[next] : null };
  }

  // ---------- fluency ----------
  const BAND_EDGES = [[20, 'A1'], [40, 'A2'], [60, 'B1'], [80, 'B2'], [101, 'C1']];
  const LEVEL_SCORE = { A1: 10, A2: 30, B1: 50, B2: 70, C1: 90 };
  const band = (score) => BAND_EDGES.find(([edge]) => score < edge)[1];

  /**
   * Fluency per skill, 0–100: 60% coverage (how much of the course you've practiced) +
   * 40% accuracy (average of your last 10 measured results). Without measured results a skill tops out at 60.
   * Overall = average of the four skills, blended 75/25 with the latest aptitude-test level when there is one.
   */
  function fluency(language, lp) {
    const lessons = language.categories.flatMap((c) => c.lessons);
    const letters = language.reading.letters;
    const phrases = speakingPhrases(language);
    const listen = listeningItems(language);
    const deck = srsDeck(language, lp);
    const wPrompts = language.writingPrompts || [];
    const sPrompts = language.speakingPrompts || [];
    const part = (label, done, total) => ({ label, done, total });
    const cov = (parts) => parts.reduce((s, p) => s + (p.total ? Math.min(1, p.done / p.total) : 0), 0) / parts.length;
    const parts = {
      reading: [
        part('Letters studied', letters.filter((l) => (lp.letters[l.char] || 0) > 0).length, letters.length),
        part('Lessons completed', lessons.filter((l) => lp.lessons[l.id] && lp.lessons[l.id].done).length, lessons.length),
        part('Words learned (review)', deck.filter((c) => lp.srs[c.t] && lp.srs[c.t].box >= 3).length, deck.length),
      ],
      writing: [
        part('Writing tasks mastered', language.reading.writing.filter((w) => lp.writing[w.answer]).length, language.reading.writing.length),
        part('Letters traced', letters.filter((l) => (lp.tracing[l.char] || 0) > 0).length, letters.length),
        part('Free-writing prompts passed', wPrompts.filter((pr) => lp.prompts[pr.id] && lp.prompts[pr.id].best >= PROMPT_PASS).length, wPrompts.length),
      ],
      listening: [
        part('Lines understood', listen.filter((x) => lp.listening[x.t] && lp.listening[x.t].best >= LISTEN_PASS).length, listen.length),
      ],
      speaking: [
        part('Phrases spoken', phrases.filter((p) => lp.speaking[p.t] && lp.speaking[p.t].best >= SPEAK_PASS).length, phrases.length),
        part('Scenarios completed', language.scenarios.filter((s) => lp.scenarios[s.id]).length, language.scenarios.length),
        part('Speaking prompts answered', sPrompts.filter((pr) => lp.prompts[pr.id] && lp.prompts[pr.id].best >= PROMPT_PASS).length, sPrompts.length),
      ],
    };
    const result = {};
    for (const skill of SKILLS) {
      const recent = lp.practice[skill].slice(-10);
      const accuracy = recent.length ? recent.reduce((a, b) => a + b, 0) / recent.length / 100 : null;
      const coverage = cov(parts[skill]);
      const score = Math.round(100 * (0.6 * coverage + 0.4 * (accuracy || 0)));
      result[skill] = { score, band: band(score), coverage: Math.round(coverage * 100), accuracy: accuracy === null ? null : Math.round(accuracy * 100), samples: recent.length, parts: parts[skill] };
    }
    const base = SKILLS.reduce((sum, k) => sum + result[k].score, 0) / SKILLS.length;
    const last = lp.aptitude.length ? lp.aptitude[lp.aptitude.length - 1] : null;
    const overall = Math.round(last ? 0.75 * base + 0.25 * LEVEL_SCORE[last.level] : base);
    result.overall = { score: overall, band: band(overall), testLevel: last ? last.level : null };
    return result;
  }

  /** Store today's fluency snapshot (one per day) for the progress-over-time chart. */
  function recordFluency(language, lp, now) {
    const f = fluency(language, lp);
    const day = localDay(now);
    const entry = { day, reading: f.reading.score, writing: f.writing.score, listening: f.listening.score, speaking: f.speaking.score, overall: f.overall.score };
    const lastEntry = lp.fluency[lp.fluency.length - 1];
    if (lastEntry && lastEntry.day === day) lp.fluency[lp.fluency.length - 1] = entry;
    else lp.fluency.push(entry);
    lp.fluency = lp.fluency.slice(-FLUENCY_KEEP);
    return f;
  }

  // ---------------------------------------------------------------- learning plan
  // A recommended path through the whole course, starting with the alphabet. Steps check themselves
  // off from real progress; nothing is ever locked. Mirrored in the Swift app (Plan.swift).
  const PLAN_STARTS = ['zero', 'script', 'test'];
  const PLAN_DIALECTS = ['both', 'lev', 'egy', 'msa'];
  const PLAN_TARGETS = {
    speak: { A1: 5, A2: 15, B1: 30, B2: 45, C1: 60 },
    listen: { A1: 5, A2: 15, B1: 30, B2: 45, C1: 60 },
    review: { A1: 15, A2: 40, B1: 80, B2: 120, C1: 160 },
  };
  const UNIT_INTROS = {
    A1: 'Greetings, introductions, numbers and food: short, high-frequency phrases and your first role-play.',
    A2: 'Everyday life: getting around, shopping, health and your routine, plus your first spoken dialect.',
    B1: 'Independence: telling stories, giving opinions, work and culture.',
    B2: 'Fluency: complex grammar, formal writing and longer conversations.',
    C1: 'Mastery: the news, formal argument and precise expression.',
  };
  // Scenarios set in one spoken dialect, skipped when the learner chose a different focus.
  const SCENARIO_DIALECT = { 'ar-sc-koshari': 'egy', 'ar-sc-manoushe': 'lev', 'ar-sc-flat': 'lev', 'ar-sc-wedding': 'lev' };
  const DIALECT_CATEGORY = { 'ar-egy': 'egy', 'ar-lev': 'lev' };

  function planSettings(language, lp) {
    const plan = (lp && lp.plan) || {};
    return { start: plan.start || null, dialect: language.id === 'ar' ? (plan.dialect || 'both') : null };
  }
  function dialectAllowed(dialect, which) {
    return !which || dialect === 'both' || dialect === which;
  }

  function learningPlan(language, lp) {
    const ar = language.id === 'ar';
    const settings = planSettings(language, lp);
    const checks = lp.checks || {};
    const r = language.reading;
    const placed = lp.aptitude.length ? lp.aptitude[lp.aptitude.length - 1].level : null;
    const placedIdx = placed ? LEVELS.indexOf(placed) : -1;
    const step = (id, kind, title, why, target, done, prog) => ({ id, kind, title, why, target, done: !!done, progress: prog || null });
    const units = [];

    if (settings.start === 'test') {
      units.push({ id: 'placement', level: null, title: 'Find your level', intro: 'A five-minute placement test sets where your plan starts.', steps: [
        step('placement-test', 'test', 'Take the placement test', 'Twenty questions from A1 to B2. Your plan then starts at your level, and earlier units stay open for review.', { view: 'test' }, lp.aptitude.length > 0),
      ] });
    }

    // The alphabet comes first.
    const size = ar ? 7 : 14;
    const alpha = [];
    for (let i = 0; i < r.letters.length; i += size) {
      const group = r.letters.slice(i, i + size);
      const seen = group.filter((l) => (lp.letters[l.char] || 0) > 0).length;
      const label = ar ? `Letters ${i + 1}–${i + group.length}: ${group.map((l) => l.char).join(' ')}`
        : `Letters ${group[0].char.toUpperCase()}–${group[group.length - 1].char.toUpperCase()}`;
      const why = ar
        ? (i === 0 ? 'Tap each letter to hear it and see its shapes. ب ت ث share one shape: only the dots differ.' : 'Tap each letter to hear its sound and see how it joins its neighbors.')
        : (i === 0 ? 'Tap each letter to hear it. Spanish vowels are short and always pronounced the same way.' : 'Tap each letter to hear it, including ñ and the rolled rr.');
      alpha.push(step(`alpha-${alpha.length + 1}`, 'letters', label, why, { view: 'read', tab: 'letters' }, seen === group.length, [seen, group.length]));
    }
    alpha.push(step('alpha-marks', 'marks', ar ? 'Short vowels and other marks' : 'Accents and pronunciation rules',
      ar ? 'Learn the small marks for a, i and u, doubled letters and silent letters.' : 'Learn where the stress falls and what the written accent tells you.',
      { view: 'read', tab: 'marks' }, (checks.marks || 0) > 0));
    if (ar) {
      const traced = Object.values(lp.tracing).filter((v) => v > 0).length;
      alpha.push(step('alpha-trace', 'trace', 'Trace 10 letters', 'Writing the shapes by hand (or with a finger or pencil) fixes them in memory.',
        { view: 'read', tab: 'trace' }, traced >= 10, [Math.min(traced, 10), 10]));
    }
    const wordsGoal = Math.min(10, r.words.length);
    alpha.push(step('alpha-read', 'read', 'Read your first words', ar ? 'Sound out real words letter by letter, then check.' : 'Read real words aloud using the rules, then check.',
      { view: 'read', tab: 'read' }, (checks.words || 0) >= wordsGoal, [Math.min(checks.words || 0, wordsGoal), wordsGoal]));
    const written = r.writing.filter((w) => lp.writing[w.answer]).length;
    const writeGoal = Math.min(5, r.writing.length);
    alpha.push(step('alpha-write', 'write', 'Type 5 words', ar ? 'Use the on-screen Arabic keyboard to spell words yourself.' : 'Spell words with the accent keys.',
      { view: 'read', tab: 'write' }, written >= writeGoal, [Math.min(written, writeGoal), writeGoal]));
    alpha.push(step('alpha-quiz', 'quiz', ar ? 'Letter quiz: score 80% or more' : 'Accent quiz: score 80% or more', 'Check you can recognize them before moving on.',
      { view: 'read', tab: 'quiz' }, (checks.readQuiz || 0) >= 80));
    units.push({ id: 'alphabet', level: 'A1', title: ar ? 'The Arabic alphabet' : 'The alphabet and pronunciation',
      intro: ar ? 'Start here: 28 letters, written right to left and joined together. Most learners need a week or two.' : 'Start here: Spanish is spelled almost exactly as it sounds, so this goes quickly.',
      skipped: settings.start === 'script' || (settings.start === 'test' && placedIdx >= 1), steps: alpha });

    const phrases = speakingPhrases(language);
    const spoken = phrases.filter((p) => lp.speaking[p.t] && lp.speaking[p.t].best >= SPEAK_PASS).length;
    const listenAll = listeningItems(language);
    const understood = listenAll.filter((x) => lp.listening[x.t] && lp.listening[x.t].best >= LISTEN_PASS).length;
    const deck = srsDeck(language, lp);
    const learned = deck.filter((c) => lp.srs[c.t] && lp.srs[c.t].box >= 3).length;

    LEVELS.forEach((L, li) => {
      const steps = [];
      const lessons = [];
      for (const c of language.categories) {
        if (ar && !dialectAllowed(settings.dialect, DIALECT_CATEGORY[c.id])) continue;
        for (const l of c.lessons) if (l.level === L) lessons.push(l);
      }
      const scenarios = language.scenarios.filter((s) => s.level === L && !(ar && !dialectAllowed(settings.dialect, SCENARIO_DIALECT[s.id])));
      const scenarioStep = (s) => step(`scenario-${s.id}`, 'scenario', `Role-play: ${s.title}`, s.goal, { view: 'scenario', id: s.id }, !!lp.scenarios[s.id]);
      lessons.forEach((l, i) => {
        steps.push(step(`lesson-${l.id}`, 'lesson', l.title, l.summary, { view: 'lesson', id: l.id }, lp.lessons[l.id] && lp.lessons[l.id].done));
        if (i % 2 === 1 && scenarios.length) steps.push(scenarioStep(scenarios.shift()));
      });
      scenarios.forEach((s) => steps.push(scenarioStep(s)));
      const capped = (n, total) => Math.max(1, Math.min(n, total));
      const speakGoal = capped(PLAN_TARGETS.speak[L], phrases.length);
      steps.push(step(`speak-${L}`, 'speak', `Say ${speakGoal} phrases well`, 'Listen, repeat and get a pronunciation score in Speaking Practice.', { view: 'speak' }, spoken >= speakGoal, [Math.min(spoken, speakGoal), speakGoal]));
      const atLevel = listenAll.filter((x) => LEVELS.indexOf(x.level) <= li).length;
      const listenGoal = capped(PLAN_TARGETS.listen[L], atLevel);
      steps.push(step(`listen-${L}`, 'listen', `Understand ${listenGoal} spoken lines`, 'Dictation and meaning checks in Listening. Start slow, then try natural speed.', { view: 'listen' }, understood >= listenGoal, [Math.min(understood, listenGoal), listenGoal]));
      const reviewGoal = capped(PLAN_TARGETS.review[L], deck.length);
      steps.push(step(`review-${L}`, 'review', `Learn ${reviewGoal} words in Review`, 'A few minutes of spaced review a day keeps words from slipping away.', { view: 'review' }, learned >= reviewGoal, [Math.min(learned, reviewGoal), reviewGoal]));
      for (const pr of language.writingPrompts.filter((x) => x.level === L)) {
        steps.push(step(`write-${pr.id}`, 'writing', `Write: ${pr.prompt}`, `Aim for ${pr.minWords}+ words; you get feedback and a model answer.`, { view: 'write', id: pr.id }, lp.prompts[pr.id] && lp.prompts[pr.id].best >= PROMPT_PASS));
      }
      for (const pr of language.speakingPrompts.filter((x) => x.level === L)) {
        steps.push(step(`answer-${pr.id}`, 'answer', `Answer aloud: ${pr.prompt}`, 'Speak freely; your answer is transcribed and checked.', { view: 'speak', tab: 'answer' }, lp.prompts[pr.id] && lp.prompts[pr.id].best >= PROMPT_PASS));
      }
      if (L === 'A2' && settings.start !== 'test') {
        steps.push(step('level-check', 'test', 'Check your level', 'Take the placement test to see how far you have come.', { view: 'test' }, lp.aptitude.length > 0));
      }
      units.push({ id: `level-${L}`, level: L, title: `${L} · ${LEVEL_NAMES[L]}`, intro: UNIT_INTROS[L],
        skipped: settings.start === 'test' && placedIdx > li, steps });
    });

    let next = null;
    let nextUnit = null;
    let done = 0;
    let total = 0;
    for (const u of units) {
      u.done = u.steps.filter((x) => x.done).length;
      u.total = u.steps.length;
      if (u.skipped) continue;
      done += u.done;
      total += u.total;
      if (!next) {
        const s = u.steps.find((x) => !x.done);
        if (s) { next = s; nextUnit = u; }
      }
    }
    return { settings, needsSetup: !settings.start, units, next, nextUnit, done, total, placed };
  }

  return {
    PLAN_STARTS, PLAN_DIALECTS, learningPlan, planSettings,
    LEVELS, LEVEL_NAMES, PASS, SKILLS, SPEAK_PASS, LISTEN_PASS, PROMPT_PASS, SRS_DAYS,
    listeningItems, dictationScore, addDays, srsDeck, srsQueue, srsGrade, srsStats, analyzePrompt, logMinute, studyTime,
    logPractice, speakingPhrases, similarity, misspellings, dailyChallenge, challengeStreak, fluency, recordFluency,
    normalize, normalizeStrict, hasArabic, englishKeys, primaryEnglish, glossOf,
    buildIndex, translate, detectDirection, checkWriting, placement,
    emptyProgress, emptyLang, sanitizeProgress, touchStreak, localDay, languageStats,
  };
});
