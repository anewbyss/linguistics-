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

test('daily challenge: 10 items, fixed for the day, mixed skills', () => {
  for (const lang of [ar, es]) {
    const a = E.dailyChallenge(lang, E.emptyLang(), '2026-10-28');
    const b = E.dailyChallenge(lang, E.emptyLang(), '2026-10-28');
    const c = E.dailyChallenge(lang, E.emptyLang(), '2026-10-29');
    assert.deepEqual(a, b, 'same day → same challenge');
    assert.notDeepEqual(a, c, 'next day → new challenge');
    assert.equal(a.length, 10);
    const count = (skill) => a.filter((i) => i.skill === skill).length;
    assert.deepEqual([count('reading'), count('writing'), count('speaking')], [4, 3, 3]);
    assert.ok(a.some((i) => i.type === 'type') && a.some((i) => i.type === 'speak'));
  }
});

test('daily challenge choices are valid across many days', () => {
  for (const lang of [ar, es]) {
    for (let d = 0; d < 120; d++) {
      for (const item of E.dailyChallenge(lang, E.emptyLang(), `day-${d}`)) {
        if (item.type !== 'choice') continue;
        assert.ok(item.options.length >= 3, `${item.id} has enough options`);
        assert.equal(new Set(item.options).size, item.options.length, `${item.id} options unique`);
        assert.ok(item.answer >= 0 && item.answer < item.options.length, `${item.id} answer valid`);
      }
    }
  }
});

test('Arabic misspellings swap dotted letters', () => {
  const m = E.misspellings('بيت', 'ar');
  assert.ok(m.includes('بنت') && m.includes('ثيت'));
  assert.ok(!m.includes('بيت'));
  assert.deepEqual(new Set(E.misspellings('café', 'es')), new Set(['cafe', 'cáfe']));
});

test('speech similarity ignores case, accents, vowel marks and spaces', () => {
  assert.equal(E.similarity('Muchas gracias', 'muchas gracias', 'es'), 100);
  assert.equal(E.similarity('donde esta el baño', '¿Dónde está el baño?', 'es'), 100);
  assert.equal(E.similarity('شكرا جزيلا', 'شكراً جزيلاً', 'ar'), 100);
  const close = E.similarity('mucha gracia', 'muchas gracias', 'es');
  assert.ok(close > 70 && close < 100);
  assert.ok(E.similarity('hola', 'muchas gracias', 'es') < 40);
  assert.equal(E.similarity('', 'hola', 'es'), 0);
});

test('fluency: zero at start, coverage alone caps at 60, full mastery reaches C1', () => {
  const lp = E.emptyLang();
  const f0 = E.fluency(es, lp);
  assert.deepEqual([f0.reading.score, f0.writing.score, f0.speaking.score, f0.overall.score], [0, 0, 0, 0]);
  assert.equal(f0.overall.band, 'A1');
  for (const c of es.categories) for (const l of c.lessons) lp.lessons[l.id] = { best: 100, done: true, at: null };
  for (const l of es.reading.letters) { lp.letters[l.char] = 1; lp.tracing[l.char] = 1; }
  for (const w of es.reading.writing) lp.writing[w.answer] = true;
  for (const p of E.speakingPhrases(es)) lp.speaking[p.t] = { best: 90 };
  for (const s of es.scenarios) lp.scenarios[s.id] = { best: 100, at: null };
  const f1 = E.fluency(es, lp);
  assert.equal(f1.reading.score, 60);
  assert.equal(f1.speaking.accuracy, null);
  for (const skill of E.SKILLS) for (let i = 0; i < 10; i++) E.logPractice(lp, skill, 100);
  const f2 = E.fluency(es, lp);
  assert.deepEqual([f2.reading.score, f2.writing.score, f2.speaking.score, f2.overall.score], [100, 100, 100, 100]);
  assert.equal(f2.overall.band, 'C1');
  lp.aptitude.push({ at: null, level: 'A2', score: 8, total: 20, bySkill: {} });
  assert.equal(E.fluency(es, lp).overall.score, Math.round(0.75 * 100 + 0.25 * 30), 'test level is blended into overall');
});

test('self-checked speaking below the pass mark does not count as spoken', () => {
  const lp = E.emptyLang();
  const phrase = E.speakingPhrases(ar)[0];
  lp.speaking[phrase.t] = { best: 50, self: true };
  assert.equal(E.fluency(ar, lp).speaking.parts[0].done, 0);
  lp.speaking[phrase.t] = { best: 85 };
  assert.equal(E.fluency(ar, lp).speaking.parts[0].done, 1);
});

test('fluency snapshots: one per day', () => {
  const lp = E.emptyLang();
  E.recordFluency(ar, lp, new Date(2026, 9, 1, 9));
  lp.letters['ب'] = 1;
  E.recordFluency(ar, lp, new Date(2026, 9, 1, 18));
  E.recordFluency(ar, lp, new Date(2026, 9, 2, 9));
  assert.equal(lp.fluency.length, 2);
  assert.ok(lp.fluency[0].reading > 0, 'same-day snapshot updated');
});

test('challenge streak counts consecutive days', () => {
  const lp = E.emptyLang();
  for (const d of ['2026-10-05', '2026-10-06', '2026-10-07', '2026-10-01']) lp.challenges[d] = { score: 5, total: 10, bySkill: {} };
  assert.equal(E.challengeStreak(lp, new Date(2026, 9, 7, 12)), 3);
  assert.equal(E.challengeStreak(lp, new Date(2026, 9, 8, 12)), 3, 'today not done yet still shows the streak');
  assert.equal(E.challengeStreak(lp, new Date(2026, 9, 10, 12)), 0);
});

test('sanitizeProgress keeps the new fluency fields', () => {
  const raw = E.emptyProgress();
  const lp = raw.languages.es;
  lp.tracing = { a: 2 };
  lp.speaking = { hola: { best: 88 }, adiós: { best: 40, self: true } };
  lp.practice = { reading: [50, 'x', 120], writing: [], speaking: [70] };
  lp.challenges = { '2026-10-01': { score: 7, total: 10, bySkill: { reading: { c: 3, t: 4 } } }, nope: {} };
  lp.fluency = [{ day: '2026-10-01', reading: 10, writing: 5, speaking: 0, overall: 5 }];
  const s = E.sanitizeProgress(JSON.parse(JSON.stringify(raw))).languages.es;
  assert.deepEqual(s.tracing, { a: 2 });
  assert.deepEqual(s.speaking, { hola: { best: 88 }, adiós: { best: 40, self: true } });
  assert.deepEqual(s.practice.reading, [50, 100]);
  assert.deepEqual(Object.keys(s.challenges), ['2026-10-01']);
  assert.equal(s.fluency.length, 1);
  // Old backups without the new fields still load.
  const old = E.sanitizeProgress({ languages: { ar: { lessons: {} } } }).languages.ar;
  assert.deepEqual(old.practice, { reading: [], writing: [], speaking: [] });
});
