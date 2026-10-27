// Authoring helpers. In quizzes and tests the correct option is always written
// first; the build script shuffles options deterministically and records the index.

/** Phrase: target text, transliteration / pronunciation (may be ''), English, optional note. */
export const P = (t, tr, en, note) => {
  const p = { t, en };
  if (tr) p.tr = tr;
  if (note) p.note = note;
  return p;
};

/** Quiz question. options[0] is the correct answer. */
export const Q = (q, options, explain, t) => {
  const item = { q, options, answer: 0 };
  if (explain) item.explain = explain;
  if (t) item.t = t;
  return item;
};

/** Aptitude (placement) question with CEFR level and skill tag. */
export const A = (level, skill, q, options, explain, t) => ({ ...Q(q, options, explain, t), level, skill });

/** Scenario choice. */
export const C = (t, tr, en, correct, feedback) => {
  const c = { t, en, correct, feedback };
  if (tr) c.tr = tr;
  return c;
};

/** Media recommendation. */
export const M = (level, type, title, creator, why, source, skills) => ({
  level, type, title, creator, why, source, skills,
});

/** Turn a compact table [[...headers], ...rows] into {headers, rows}. */
export const T = (headers, ...rows) => ({ headers, rows });
