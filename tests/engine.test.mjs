import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const E = require('../web/js/engine.js');
const lib = JSON.parse(readFileSync(new URL('../content/dist/lingua-content.json', import.meta.url), 'utf8'));
const ar = lib.languages.find((l) => l.id === 'ar');
const es = lib.languages.find((l) => l.id === 'es');
const arIdx = E.buildIndex(ar);
const esIdx = E.buildIndex(es);

test('normalize strips Arabic vowel marks and unifies alef / ta marbuta', () => {
  assert.equal(E.normalize('مَدِينَة', 'ar'), 'مدينه');
  assert.equal(E.normalize('أَهْلاً!', 'ar'), 'اهلا');
  assert.equal(E.normalize('إلى', 'ar'), 'الي');
});

test('normalize strips Spanish accents and punctuation but keeps ñ', () => {
  assert.equal(E.normalize('¿Dónde está?', 'es'), 'donde esta');
  assert.equal(E.normalize('Año', 'es'), 'año');
  assert.equal(E.normalize('pingüino', 'es'), 'pinguino');
});

test('exact phrase translation Arabic → English', () => {
  const r = E.translate('السلام عليكم', ar, 'toEn', arIdx);
  assert.equal(r.output, 'peace be upon you');
  assert.ok(r.exact);
  assert.equal(r.outputTr, 'as-salāmu ʿalaykum');
});

test('Arabic prefixes and possessive suffixes are glossed', () => {
  assert.equal(E.translate('والبيت', ar, 'toEn', arIdx).output, 'and the house');
  assert.equal(E.translate('بيتي', ar, 'toEn', arIdx).output, 'my house');
  assert.equal(E.translate('سيارتي', ar, 'toEn', arIdx).output, 'my car');
  assert.equal(E.translate('كتابها', ar, 'toEn', arIdx).output, 'her book');
});

test('vowelled Arabic input still matches', () => {
  assert.equal(E.translate('شُكْرًا', ar, 'toEn', arIdx).output, 'thank you');
});

test('English → Arabic drops the copula and articles', () => {
  const r = E.translate('the house is big', ar, 'fromEn', arIdx);
  assert.equal(r.output, 'بيت كبير');
  assert.equal(r.coverage, 1);
});

test('English → Arabic multi-word phrase', () => {
  assert.equal(E.translate('Where is the bathroom?', ar, 'fromEn', arIdx).output, 'أين الحمام');
});

test('English → Spanish phrase and word-by-word', () => {
  assert.equal(E.translate('thank you very much', es, 'fromEn', esIdx).output, 'muchas gracias');
  assert.equal(E.translate('I want water', es, 'fromEn', esIdx).output, 'quiero agua');
});

test('Spanish → English handles accents, plurals and diminutives', () => {
  assert.equal(E.translate('¿Dónde está el baño?', es, 'toEn', esIdx).output, 'where is the bathroom');
  assert.equal(E.translate('tacos', es, 'toEn', esIdx).output, 'taco');
  assert.equal(E.translate('cafecito', es, 'toEn', esIdx).output, 'coffee');
  assert.equal(E.translate('poquito', es, 'toEn', esIdx).output, 'a little');
  assert.equal(E.translate('ahorita', es, 'toEn', esIdx).output, 'right now');
});

test('ambiguous spellings show both meanings', () => {
  assert.equal(E.translate('el', es, 'toEn', esIdx).output, 'he / the');
});

test('unknown words are bracketed and lower coverage', () => {
  const r = E.translate('quiero zzz', es, 'toEn', esIdx);
  assert.equal(r.output, 'I want [zzz]');
  assert.equal(r.coverage, 0.5);
});

test('direction detection', () => {
  assert.equal(E.detectDirection('مرحبا', ar, arIdx), 'toEn');
  assert.equal(E.detectDirection('hello', ar, arIdx), 'fromEn');
  assert.equal(E.detectDirection('¿Dónde está?', es, esIdx), 'toEn');
  assert.equal(E.detectDirection('where is the bathroom', es, esIdx), 'fromEn');
});

test('writing check: accents and hamza', () => {
  const task = { en: 'Where is the bathroom?', answer: '¿Dónde está el baño?' };
  assert.deepEqual(E.checkWriting('¿Dónde está el baño?', task, 'es'), { ok: true, perfect: true, expected: task.answer });
  const loose = E.checkWriting('donde esta el baño', task, 'es');
  assert.equal(loose.ok, true);
  assert.equal(loose.perfect, false);
  assert.equal(E.checkWriting('donde', task, 'es').ok, false);
  // Vowel marks are optional; a missing hamza seat is accepted but not "perfect".
  assert.equal(E.checkWriting('مَرْحَباً', { answer: 'مرحبا' }, 'ar').perfect, true);
  const hamza = E.checkWriting('اهلا', { answer: 'أهلا' }, 'ar');
  assert.equal(hamza.ok, true);
  assert.equal(hamza.perfect, false);
});

test('every writing task accepts its own answer', () => {
  for (const lang of [ar, es]) for (const w of lang.reading.writing) assert.ok(E.checkWriting(w.answer, w, lang.id).perfect, w.en);
});

test('placement: all correct → C1, none → A1 beginner', () => {
  const qs = ar.aptitude;
  const all = E.placement(qs, qs.map((q) => q.answer));
  assert.equal(all.level, 'C1');
  assert.equal(all.score, qs.length);
  const none = E.placement(qs, qs.map(() => -1));
  assert.equal(none.level, 'A1');
  assert.equal(none.beginner, true);
});

test('placement stops at the first failed level', () => {
  const qs = es.aptitude;
  const answers = qs.map((q) => (q.level === 'A1' || q.level === 'A2' || q.level === 'B2' ? q.answer : -1));
  const r = E.placement(qs, answers);
  assert.equal(r.level, 'A2');
  assert.equal(r.beginner, false);
  assert.deepEqual(r.byLevel.B1, { c: 0, t: 5 });
});

test('sanitizeProgress repairs bad data and keeps good data', () => {
  const p = E.sanitizeProgress({
    xp: 42.7, streak: { count: 3, last: '2026-01-01' },
    languages: { ar: { lessons: { 'ar-greet-1': { best: 150, done: 1 } }, saved: [{ t: 'باب', en: 'door' }, { bad: true }], letters: { 'ب': 2, 'x': 'no' } } },
  });
  assert.equal(p.xp, 42);
  assert.deepEqual(p.languages.ar.lessons['ar-greet-1'], { best: 100, done: true, at: null });
  assert.equal(p.languages.ar.saved.length, 1);
  assert.deepEqual(p.languages.ar.letters, { 'ب': 2 });
  assert.ok(p.languages.es, 'missing language gets defaults');
  assert.deepEqual(E.sanitizeProgress('garbage'), E.emptyProgress());
});

test('streak counts consecutive days and resets after a gap', () => {
  const p = E.emptyProgress();
  E.touchStreak(p, new Date(2026, 9, 1, 10));
  E.touchStreak(p, new Date(2026, 9, 1, 22));
  assert.equal(p.streak.count, 1);
  E.touchStreak(p, new Date(2026, 9, 2, 9));
  assert.equal(p.streak.count, 2);
  E.touchStreak(p, new Date(2026, 9, 5, 9));
  assert.equal(p.streak.count, 1);
});

test('quiz answers point at a valid option and are not all the same index', () => {
  for (const lang of [ar, es]) {
    const qs = [...lang.categories.flatMap((c) => c.lessons.flatMap((l) => l.quiz)), ...lang.aptitude];
    for (const q of qs) assert.ok(q.answer >= 0 && q.answer < q.options.length, q.id);
    assert.ok(new Set(qs.map((q) => q.answer)).size > 2, `${lang.id} answers are spread out`);
  }
});
