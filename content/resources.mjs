// Free outside resources from universities, government bodies and intergovernmental bodies only.
// Commercial apps, blogs and media outlets are deliberately left out. Links open the provider's site
// and need an internet connection. Levels say which learners each resource suits.

const R = (id, title, provider, providerType, url, levels, skills, what, note) => {
  const r = { id, title, provider, providerType, url, levels, skills, what };
  if (note) r.note = note;
  return r;
};
const ALL = ['A1', 'A2', 'B1', 'B2', 'C1'];

const cefr = (lang) => R(`${lang}-res-cefr`, 'The CEFR levels (A1–C2)', 'Council of Europe', 'Intergovernmental',
  'https://www.coe.int/en/web/common-european-framework-reference-languages/table-1-cefr-3.3-common-reference-levels-global-scale',
  ALL, ['levels'],
  'The official description of the six levels this app uses. Read it to see what each level really means and to judge your own.');

export const resources = {
  ar: [
    R('ar-res-qu', 'Arabic for non-Arabic Speakers I–III', 'Qatar University (on edX)', 'University',
      'https://www.edx.org/school/qux', ['A1', 'A2'], ['reading', 'writing', 'listening', 'speaking'],
      'A three-part university course from the alphabet to about mid-A2: greetings, family, daily routines, past and future.',
      'Free to take; edX charges only for a certificate. Check which parts are open for enrolment.'),
    R('ar-res-fsi', 'Modern Standard and Levantine Arabic courses', 'U.S. Foreign Service Institute', 'Government',
      'https://www.livelingua.com/project/fsi/arabic/msa', ['A1', 'A2', 'B1'], ['reading', 'listening', 'speaking', 'grammar'],
      'The State Department\'s own training courses: textbooks and drill audio for formal Arabic, Levantine and Saudi (Hijazi) Arabic.',
      'Public domain, hosted for free by Live Lingua (not a government site). Decades old: thorough drills, dated topics.'),
    R('ar-res-dli', 'Egyptian Arabic course', 'U.S. Defense Language Institute', 'Government',
      'https://www.livelingua.com/project/dli/arabic/egyptian', ['A1', 'A2', 'B1'], ['listening', 'speaking'],
      'Government course materials for spoken Egyptian Arabic, with audio.',
      'Public domain, hosted by Live Lingua. Older material; the dialect basics still hold.'),
    R('ar-res-aswaat', 'Aswaat Arabiyya (Arabic Voices)', 'University of Texas at Austin (COERLL)', 'University',
      'https://laits.utexas.edu/aswaat/', ALL, ['listening', 'culture'],
      'About 245 real clips from Arab TV and native speakers, sorted from Novice to Superior, with glossaries and worksheets. Mostly formal Arabic, with several dialects.',
      'Levels use the American ACTFL scale; see the level guide below to match them to A1–C1.'),
    R('ar-res-langmedia', 'LangMedia: Levantine Arabic', 'Five College Center for World Languages (Amherst, Smith, Mount Holyoke, Hampshire, UMass)', 'University',
      'https://langmedia.fivecolleges.edu/legacy/arabic/levantine/index.html', ['A2', 'B1', 'B2'], ['listening', 'speaking', 'culture'],
      'Videos of everyday conversations from Jordan, Lebanon, Palestine and Syria, with translations and comprehension guides.',
      'Some pages are being updated and may look old.'),
    R('ar-res-arabicorpus', 'arabiCorpus', 'Brigham Young University', 'University',
      'https://arabicorpus.byu.edu/', ['B2', 'C1'], ['reading', 'vocabulary'],
      'Search millions of words of real newspaper and literary Arabic to see how a word is actually used and what it goes with.',
      'The university plans to retire this tool on 1 July 2027.'),
    cefr('ar'),
  ],
  es: [
    R('es-res-spe', 'Spanish Proficiency Exercises', 'University of Texas at Austin', 'University',
      'https://www.laits.utexas.edu/spe/', ALL, ['listening', 'speaking', 'grammar'],
      'Short videos of native speakers from Mexico, elsewhere in Latin America and Spain doing everyday tasks at six levels, each with a Spanish transcript and English translation.',
      'Levels use the American ACTFL scale; see the level guide below.'),
    R('es-res-coerll', 'Open Spanish textbooks and Spanish Grammar in Context', 'University of Texas at Austin (COERLL)', 'University',
      'https://coerll.utexas.edu/coerll/materials/language/spanish/', ['A1', 'A2', 'B1', 'B2'], ['grammar', 'reading', 'writing'],
      'Free university textbooks, plus grammar explained through real video clips.'),
    R('es-res-fsi', 'Spanish Basic and Programmatic Courses', 'U.S. Foreign Service Institute', 'Government',
      'https://www.livelingua.com/project/fsi/spanish', ['A1', 'A2', 'B1'], ['speaking', 'listening', 'grammar'],
      'The State Department\'s classic courses: hundreds of pages of drills with audio, built to get diplomats speaking.',
      'Public domain, hosted for free by Live Lingua (not a government site). Decades old, with some Spain-style vocabulary.'),
    R('es-res-dem', 'Diccionario del español de México', 'El Colegio de México', 'University',
      'https://dem.colmex.mx/', ['A2', 'B1', 'B2', 'C1'], ['vocabulary', 'reading'],
      'The reference dictionary of Mexican Spanish: about 32,600 entries describing how words are used in Mexico. There is also a free app.'),
    R('es-res-pcic', 'Plan curricular: Niveles de referencia', 'Instituto Cervantes (Government of Spain)', 'Government',
      'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/default.htm', ALL, ['grammar', 'levels'],
      'The official checklist of the grammar, functions and vocabulary expected at each level. Use it to see what to learn next, not as a course.',
      'In Spanish. Its examples lean towards Spain, but it notes Latin American variants.'),
    cefr('es'),
  ],
};

// What each level means, paraphrased from the Council of Europe's CEFR global scale. The ACTFL column
// follows ACTFL's published CEFR alignment and is approximate; the scales were built differently.
export const levelGuide = {
  A1: { cefr: 'Understand and use familiar everyday expressions and very basic phrases. Introduce yourself and others, ask and answer simple personal questions, and get by if people speak slowly and clearly.', actfl: 'Novice High – Intermediate Low' },
  A2: { cefr: 'Understand common sentences about everyday life (family, shopping, work, your area). Handle simple routine exchanges and describe your background and immediate needs in simple terms.', actfl: 'Intermediate Mid – High' },
  B1: { cefr: 'Understand the main points of clear speech on familiar topics, handle most travel situations, write simple connected text, and describe experiences, hopes and plans with brief reasons.', actfl: 'Advanced Low' },
  B2: { cefr: 'Understand the main ideas of complex texts and discussions, talk with native speakers fluently without strain on either side, and explain a viewpoint with advantages and disadvantages.', actfl: 'Advanced Mid – High' },
  C1: { cefr: 'Understand demanding, longer texts and implied meaning, express yourself fluently without searching for words, and use the language flexibly for social, academic and professional purposes.', actfl: 'Superior' },
  C2: { cefr: 'Understand virtually everything heard or read, summarise from different sources, and express yourself spontaneously and precisely, with fine shades of meaning.', actfl: 'Distinguished' },
};
