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
    return {
      lessons: {}, scenarios: {}, aptitude: [], letters: {}, writing: {}, saved: [], lastVisit: null,
      tracing: {}, speaking: {}, practice: { reading: [], writing: [], speaking: [] }, challenges: {}, fluency: [],
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
      if (Array.isArray(src.fluency)) dst.fluency = src.fluency.filter((f) => isObj(f) && typeof f.day === 'string')
        .map((f) => ({ day: f.day, reading: clampPct(f.reading), writing: clampPct(f.writing), speaking: clampPct(f.speaking), overall: clampPct(f.overall) }))
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
  const SKILLS = ['reading', 'writing', 'speaking'];
  const PRACTICE_KEEP = 30;
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
   * 4 reading, 3 writing, 2 speaking and 1 listening-comprehension (counted as speaking).
   * Item types: choice {q, t?, tr?, options, answer, explain?}, type {prompt, answer, alts?, hint?}, speak {t, tr?, en}.
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
    seededShuffle(vocab, rand).slice(0, 2).forEach((v) => items.push(meaning(v, false)));
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
    // Listening comprehension from a scenario
    const listen = [];
    for (const sc of language.scenarios) {
      if (LEVELS.indexOf(sc.level) > cap) continue;
      for (const st of sc.steps) if (st.mode === 'understand' && st.line) listen.push({ sc, st });
    }
    const pickL = listen.length ? pick(listen) : null;
    if (pickL) {
      const options = pickL.st.choices.map((c) => c.en);
      const item = { type: 'choice', skill: 'speaking', q: `${pickL.st.speaker || 'Someone'} says this. What does it mean?`, t: pickL.st.line.t, options, answer: pickL.st.choices.findIndex((c) => c.correct) };
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

  // ---------- fluency ----------
  const BAND_EDGES = [[20, 'A1'], [40, 'A2'], [60, 'B1'], [80, 'B2'], [101, 'C1']];
  const LEVEL_SCORE = { A1: 10, A2: 30, B1: 50, B2: 70, C1: 90 };
  const band = (score) => BAND_EDGES.find(([edge]) => score < edge)[1];

  /**
   * Fluency per skill, 0–100: 60% coverage (how much of the course you've practised) +
   * 40% accuracy (average of your last 10 measured results). Without measured results a skill tops out at 60.
   * Overall = average of the three skills, blended 75/25 with the latest aptitude-test level when there is one.
   */
  function fluency(language, lp) {
    const lessons = language.categories.flatMap((c) => c.lessons);
    const letters = language.reading.letters;
    const phrases = speakingPhrases(language);
    const part = (label, done, total) => ({ label, done, total });
    const cov = (parts) => parts.reduce((s, p) => s + (p.total ? Math.min(1, p.done / p.total) : 0), 0) / parts.length;
    const parts = {
      reading: [
        part('Letters studied', letters.filter((l) => (lp.letters[l.char] || 0) > 0).length, letters.length),
        part('Lessons completed', lessons.filter((l) => lp.lessons[l.id] && lp.lessons[l.id].done).length, lessons.length),
      ],
      writing: [
        part('Writing tasks mastered', language.reading.writing.filter((w) => lp.writing[w.answer]).length, language.reading.writing.length),
        part('Letters traced', letters.filter((l) => (lp.tracing[l.char] || 0) > 0).length, letters.length),
      ],
      speaking: [
        part('Phrases spoken', phrases.filter((p) => lp.speaking[p.t] && lp.speaking[p.t].best >= SPEAK_PASS).length, phrases.length),
        part('Scenarios completed', language.scenarios.filter((s) => lp.scenarios[s.id]).length, language.scenarios.length),
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
    const base = (result.reading.score + result.writing.score + result.speaking.score) / 3;
    const last = lp.aptitude.length ? lp.aptitude[lp.aptitude.length - 1] : null;
    const overall = Math.round(last ? 0.75 * base + 0.25 * LEVEL_SCORE[last.level] : base);
    result.overall = { score: overall, band: band(overall), testLevel: last ? last.level : null };
    return result;
  }

  /** Store today's fluency snapshot (one per day) for the progress-over-time chart. */
  function recordFluency(language, lp, now) {
    const f = fluency(language, lp);
    const day = localDay(now);
    const entry = { day, reading: f.reading.score, writing: f.writing.score, speaking: f.speaking.score, overall: f.overall.score };
    const lastEntry = lp.fluency[lp.fluency.length - 1];
    if (lastEntry && lastEntry.day === day) lp.fluency[lp.fluency.length - 1] = entry;
    else lp.fluency.push(entry);
    lp.fluency = lp.fluency.slice(-FLUENCY_KEEP);
    return f;
  }

  return {
    LEVELS, LEVEL_NAMES, PASS, SKILLS, SPEAK_PASS,
    logPractice, speakingPhrases, similarity, misspellings, dailyChallenge, challengeStreak, fluency, recordFluency,
    normalize, normalizeStrict, hasArabic, englishKeys, primaryEnglish, glossOf,
    buildIndex, translate, detectDirection, checkWriting, placement,
    emptyProgress, emptyLang, sanitizeProgress, touchStreak, localDay, languageStats,
  };
});
