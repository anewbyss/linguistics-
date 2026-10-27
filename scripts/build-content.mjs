#!/usr/bin/env node
// Compiles content/*.mjs into the files both apps load:
//   content/dist/lingua-content.json        (reference copy)
//   web/data/content.js                     (window.LINGUA_CONTENT, works from file://)
//   swift/Lingua.swiftpm/ContentData.swift  (embedded JSON string, no bundle resources needed)
// Usage: node scripts/build-content.mjs [--check]
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import arabic from '../content/arabic.mjs';
import spanish from '../content/spanish.mjs';

const require = createRequire(import.meta.url);
const engine = require('../web/js/engine.js');
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const LEVELS = engine.LEVELS;
const errors = [];
const warnings = [];
const fail = (msg) => errors.push(msg);

// Deterministic shuffle so builds are reproducible.
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffled(list, seedText) {
  const r = rng(hash(seedText));
  const out = list.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function compileQuestion(q, id, where) {
  if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 4) fail(`${where}: needs 2–4 options`);
  if (new Set(q.options).size !== q.options.length) fail(`${where}: duplicate options`);
  const correct = q.options[q.answer];
  const options = shuffled(q.options, id + q.q);
  const out = { id, q: q.q, options, answer: options.indexOf(correct) };
  if (q.t) out.t = q.t;
  if (q.explain) out.explain = q.explain;
  if (q.level) out.level = q.level;
  if (q.skill) out.skill = q.skill;
  return out;
}

function checkPhrase(p, where) {
  if (!p || typeof p.t !== 'string' || !p.t || typeof p.en !== 'string' || !p.en) fail(`${where}: phrase needs t and en`);
}

const ZWJ = '‍';
function arabicForms(char, connects) {
  // Contextual shapes rendered by the font via zero-width joiners.
  return connects
    ? [char, char + ZWJ, ZWJ + char + ZWJ, ZWJ + char]
    : [char, char, ZWJ + char, ZWJ + char];
}

function compileLanguage(lang) {
  const ids = new Set();
  const uniq = (id, where) => { if (ids.has(id)) fail(`${where}: duplicate id ${id}`); ids.add(id); };

  const categories = lang.categories.map((cat) => {
    uniq(cat.id, cat.id);
    return {
      id: cat.id, title: cat.title, nativeTitle: cat.nativeTitle, icon: cat.icon, emoji: cat.emoji, summary: cat.summary,
      lessons: cat.lessons.map((l) => {
        const where = `${lang.id}/${l.id}`;
        uniq(l.id, where);
        if (!LEVELS.includes(l.level)) fail(`${where}: bad level ${l.level}`);
        if (!l.grammar?.title || !l.grammar.body?.length) fail(`${where}: grammar missing`);
        if (!l.culture?.title || !l.culture.body?.length) fail(`${where}: culture missing`);
        if (l.grammar.table) {
          const w = l.grammar.table.headers.length;
          l.grammar.table.rows.forEach((r, i) => { if (r.length !== w) fail(`${where}: table row ${i} has ${r.length} cells, expected ${w}`); });
        }
        [...l.vocab, ...l.examples].forEach((p, i) => checkPhrase(p, `${where} phrase ${i}`));
        if (l.quiz.length < 3) fail(`${where}: quiz needs ≥3 questions`);
        return {
          id: l.id, title: l.title, level: l.level, summary: l.summary,
          grammar: l.grammar, vocab: l.vocab, examples: l.examples, culture: l.culture,
          quiz: l.quiz.map((q, i) => compileQuestion(q, `${l.id}-q${i + 1}`, `${where} q${i + 1}`)),
        };
      }),
    };
  });

  const r = lang.reading;
  const letters = r.letters.map((l) => {
    const out = { char: l.char, name: l.name, tr: l.tr, sound: l.sound, example: l.example };
    if (lang.id === 'ar') { out.connects = !!l.connects; out.forms = arabicForms(l.char, l.connects); }
    checkPhrase(l.example, `${lang.id} letter ${l.char}`);
    return out;
  });
  if (lang.id === 'ar' && letters.length !== 28) fail(`ar: expected 28 letters, got ${letters.length}`);
  const writingSeen = new Set();
  r.writing.forEach((w) => {
    if (writingSeen.has(w.answer)) fail(`${lang.id}: duplicate writing answer ${w.answer}`);
    writingSeen.add(w.answer);
    const ok = engine.checkWriting(w.answer, w, lang.id);
    if (!ok.perfect) fail(`${lang.id}: writing task "${w.en}" does not accept its own answer`);
  });
  const reading = { title: r.title, intro: r.intro, letters, marks: r.marks, words: r.words, writing: r.writing, tips: r.tips, keyboard: r.keyboard };

  const scenarios = lang.scenarios.map((s) => {
    const where = `${lang.id}/${s.id}`;
    uniq(s.id, where);
    if (!LEVELS.includes(s.level)) fail(`${where}: bad level`);
    return {
      ...s,
      steps: s.steps.map((st, i) => {
        if (st.line) checkPhrase(st.line, `${where} step ${i}`);
        if (!st.line && !st.prompt) fail(`${where} step ${i}: needs a line or prompt`);
        if (!st.choices) return st;
        if (!st.choices.some((c) => c.correct)) fail(`${where} step ${i}: no correct choice`);
        if (st.mode === 'understand' && st.choices.some((c) => c.t)) fail(`${where} step ${i}: understand choices are English-only`);
        if (st.mode !== 'understand' && st.choices.some((c) => !c.t)) fail(`${where} step ${i}: reply choices need target text`);
        return { ...st, choices: shuffled(st.choices, `${s.id}-${i}`) };
      }),
    };
  });

  const aptitude = lang.aptitude.map((q, i) => {
    const where = `${lang.id} aptitude ${i + 1}`;
    if (!LEVELS.includes(q.level)) fail(`${where}: bad level`);
    if (!q.skill) fail(`${where}: skill missing`);
    return compileQuestion(q, `${lang.id}-apt-${i + 1}`, where);
  });
  if (aptitude.length < 12) fail(`${lang.id}: aptitude test needs ≥12 questions`);

  const seen = new Map();
  const dictionary = lang.dictionary.map(([t, tr, en]) => {
    const key = engine.normalize(t, lang.id);
    if (seen.has(key)) warnings.push(`${lang.id}: "${seen.get(key)}" and "${t}" share a spelling once accents/hamza are ignored; the translator shows both`);
    else seen.set(key, t);
    return tr ? { t, tr, en } : { t, en };
  });

  const media = lang.media.map((m) => {
    if (!LEVELS.includes(m.level)) fail(`${lang.id} media ${m.title}: bad level`);
    const out = { ...m };
    if (!out.creator) delete out.creator;
    return out;
  });
  for (const l of LEVELS) if (!media.some((m) => m.level === l)) fail(`${lang.id}: no media for level ${l}`);

  const compilePrompts = (list, kind) => (list || []).map((pr) => {
    const where = `${lang.id} ${kind} ${pr.id}`;
    uniq(pr.id, where);
    if (!LEVELS.includes(pr.level)) fail(`${where}: bad level`);
    if (!pr.prompt || !pr.minWords || !pr.requirements?.length) fail(`${where}: needs prompt, minWords and requirements`);
    pr.requirements.forEach((r, i) => { if (!r.label || !r.any?.length) fail(`${where}: requirement ${i} needs a label and alternatives`); });
    checkPhrase(pr.model, `${where} model`);
    const out = { id: pr.id, level: pr.level, prompt: pr.prompt, minWords: pr.minWords, requirements: pr.requirements, model: pr.model };
    if (pr.starter) out.starter = pr.starter;
    return out;
  });
  const writingPrompts = compilePrompts(lang.writingPrompts, 'writing prompt');
  const speakingPrompts = compilePrompts(lang.speakingPrompts, 'speaking prompt');
  if (!lang.levelHours || LEVELS.some((l) => !Number.isFinite(lang.levelHours[l]))) fail(`${lang.id}: levelHours needs a number for every level`);

  const compiled = {
    id: lang.id, name: lang.name, nativeName: lang.nativeName, subtitle: lang.subtitle, symbol: lang.symbol,
    dir: lang.dir, speech: lang.speech, accent: lang.accent, translateSkipEn: lang.translateSkipEn,
    categories, reading, scenarios, aptitude, dictionary, media, writingPrompts, speakingPrompts, levelHours: lang.levelHours,
  };
  // Every model answer must satisfy its own prompt, or the checker would mark correct work as wrong.
  for (const pr of [...writingPrompts, ...speakingPrompts]) {
    const a = engine.analyzePrompt(pr.model.t, pr, compiled);
    const missing = a.requirements.filter((r) => !r.met).map((r) => r.label);
    if (missing.length) fail(`${lang.id} prompt ${pr.id}: model answer misses ${missing.join(', ')}`);
    if (a.words < pr.minWords) fail(`${lang.id} prompt ${pr.id}: model answer has ${a.words} words, needs ${pr.minWords}`);
    if (a.unknown.length) warnings.push(`${lang.id} prompt ${pr.id}: model words not found in course: ${a.unknown.join(' ')}`);
  }
  return compiled;
}

const library = { version: 1, levels: LEVELS, languages: [compileLanguage(arabic), compileLanguage(spanish)] };

if (errors.length) {
  console.error('Content errors:\n  ' + errors.join('\n  '));
  process.exit(1);
}

const json = JSON.stringify(library);
if (json.includes('"""#')) { console.error('Content contains """# which would break the Swift raw string'); process.exit(1); }

const outputs = {
  'content/dist/lingua-content.json': JSON.stringify(library, null, 1) + '\n',
  'web/data/content.js': `// Generated by scripts/build-content.mjs. Do not edit; edit content/*.mjs instead.\nwindow.LINGUA_CONTENT = ${json};\n`,
  'swift/Lingua.swiftpm/ContentData.swift':
    '// Generated by scripts/build-content.mjs. Do not edit; edit content/*.mjs instead.\n' +
    '// The course content is embedded as JSON so the app needs no bundle resources.\n\n' +
    'enum ContentData {\n    static let json = #"""\n' + JSON.stringify(library, null, 1) + '\n"""#\n}\n',
};

const check = process.argv.includes('--check');
let stale = [];
for (const [rel, text] of Object.entries(outputs)) {
  const file = join(root, rel);
  if (check) {
    if (!existsSync(file) || readFileSync(file, 'utf8') !== text) stale.push(rel);
    continue;
  }
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, text);
}
if (check && stale.length) {
  console.error('Generated files are out of date (run npm run build):\n  ' + stale.join('\n  '));
  process.exit(1);
}

const counts = library.languages.map((l) => {
  const lessons = l.categories.reduce((n, c) => n + c.lessons.length, 0);
  return `${l.id}: ${l.categories.length} categories, ${lessons} lessons, ${l.scenarios.length} scenarios, ` +
    `${l.aptitude.length} test questions, ${l.dictionary.length} dictionary entries, ${l.media.length} media picks, ` +
    `${l.writingPrompts.length} writing + ${l.speakingPrompts.length} speaking prompts, ${engine.listeningItems(l).length} listening lines`;
});
console.log((check ? 'Content up to date. ' : 'Built content. ') + '\n  ' + counts.join('\n  '));
if (warnings.length) console.log('Warnings:\n  ' + warnings.join('\n  '));
