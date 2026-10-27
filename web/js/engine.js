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

  // ---------- normalisation ----------
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
    return { lessons: {}, scenarios: {}, aptitude: [], letters: {}, writing: {}, saved: [], lastVisit: null };
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

  return {
    LEVELS, LEVEL_NAMES, PASS,
    normalize, normalizeStrict, hasArabic, englishKeys, primaryEnglish, glossOf,
    buildIndex, translate, detectDirection, checkWriting, placement,
    emptyProgress, emptyLang, sanitizeProgress, touchStreak, localDay, languageStats,
  };
});
