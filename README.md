# Lingua: Arabic & Mexican Spanish

A language-learning app for **Arabic** (Modern Standard Arabic with everyday Egyptian and Levantine) and **Mexican Spanish**, built twice from one content source:

- **Web app** (`web/`): a PWA that works offline, runs in any modern browser, and can be installed to a phone's home screen.
- **Swift Playgrounds app** (`swift/Lingua.swiftpm`): a native SwiftUI app for iPad, iPhone and Mac.

A landing screen leads to a separate menu for each language. Your coach is **Hayya**, a feathered snake: هيّا (*hayyā*) means "let's go!" in Arabic, and the feathers nod to Quetzalcóatl, the feathered serpent of Mexico. Hayya's chocolate-and-caramel pattern comes from **Lyra**, a real ball python.

## Features (in both apps)

| | Arabic | Mexican Spanish |
|---|---|---|
| **Lesson categories** (grammar + culture, A1–C1) | 15 categories, 32 lessons, including an Egyptian and a Levantine dialect track and an Al-Kitaab Part Two companion | 13 categories, 25 lessons, including Mexican regional speech and slang |
| **Reading & writing** | 28 letters with all four joined forms, vowel marks, word reading, typing with an on-screen Arabic keyboard, finger tracing with scoring, letter quiz | Letters and Mexican pronunciation, accent rules, place-name reading, typing with accent keys, tracing, accent quiz |
| **Real-world scenarios** (branching role-play) | 14 (adds the doctor, a job interview, discussing the news, koshari in Cairo, manoushe in Beirut, renting an apartment in Damascus, a wedding invitation in Amman) | 11 (adds the doctor, renting an apartment, a debate, a customer-service call) |
| **Aptitude test** (placement A1–C1, broken down by level and skill) | 20 questions | 20 questions |
| **Offline translator** (both directions, phrasebook, saved words) | 605 entries with prefix and suffix handling (و، ال، ـي…) | 567 entries with plurals and diminutives |
| **Listening** (dictation and meaning checks, three speeds) | 151 lines | 116 lines |
| **Free-writing / free-speaking prompts** with automatic feedback | 12 / 8 | 8 / 6 |
| **Media picks by level** (A1–C1) | 18 | 18 |

**Learning plan and first-visit setup.** The first time you open a language, Hayya asks one question: brand new, can already read the script (Arabic), or already know some. For Arabic, it also asks which spoken dialect to learn alongside formal Arabic: Levantine, Egyptian, both, or formal only.

The plan always starts with the **alphabet**:
- the letters in small groups
- vowel marks or accents
- tracing (Arabic)
- reading first words
- typing
- a letter quiz

Then come units for A1–C1. Each unit mixes lessons, a role-play after every couple of lessons, speaking, listening, review, and writing and speaking prompts at that level.

How the plan behaves:
- **Steps check themselves off** from your real progress, and the language home always shows the next step.
- **The placement test adjusts the plan:** it marks lower units as tested out.
- **Nothing is ever locked,** and you can change your choices at any time.

The language home is grouped by stage, *Start here → Practice → Go further*, with lessons listed by level. The plan logic is shared: `learningPlan` in `web/js/engine.js`, mirrored in `Plan.swift`.

**Generated practice (endless and varied).** Every lesson, topic and level has a **Keep practicing** button. Each press builds a fresh, random set of ten exercises from that section's own vocabulary, example sentences, grammar tables and quiz questions:
- meaning, reverse (English → target), and listen-and-choose
- typing
- word-order tiles
- gap fills with an English cue
- grammar-table recall
- the lesson's quiz questions

Everything comes from checked course content, so nothing new is invented. The build of every set is tested: each choice has one correct answer, the options are distinct, and the tiles spell the original sentence. Best scores are saved. The end screen offers another set or a wider one (lesson → topic → level), and each level of the learning plan includes a mixed-practice step (80%).

**Daily challenge.** A new 10-item challenge each day per language: 3 reading, 3 writing (two typed answers and a spelling check), 2 listening (a dictation and a line to understand by ear) and 2 phrases to say aloud.
- Items are drawn from your current level, and the challenge stays the same all day.
- Your first completion each day counts toward fluency, XP and a challenge streak. You can replay it for practice without it being scored.
- Both apps use the same seeded generator, so they build the same challenge for the same day and progress.

**Speaking practice.** Listen to a model phrase (text-to-speech), say it, and get a pronunciation score from speech recognition, compared with the target phrase. Scores of 70% or more count as "spoken well".
- **Swift app:** uses Apple's Speech framework, on-device (offline) when the device supports the language.
- **Web app:** uses the browser's speech recognition, which may need an internet connection.
- **No microphone or recognition:** "I said it ✓" records a self-check. It counts as practice but never changes your accuracy.

**Al-Kitaab companion (Arabic).** Five lessons that follow *Al-Kitaab fii Taʿallum al-ʿArabiyya, Part Two* (3rd ed.), Lessons 1–4. They cover:
- Topics: housing, Arabs in America, the market, occasions, and month names.
- Grammar: verb patterns, nouns of place, relative clauses, negation, colors, كان and its sisters, and case endings.
- Vocabulary notes that give the Levantine and Egyptian words.
- Matching scenarios and writing and speaking prompts.

All of this is written for this app. It reproduces no text, exercises or dialogues from the book, and it isn't affiliated with the publisher. Use it alongside the book.

**Free Courses & Resources.** Each language has a page of free outside material, sorted by level, from universities and government bodies only:
- **Arabic:** Qatar University's edX course, the US Foreign Service Institute and Defense Language Institute courses, UT Austin's *Aswaat Arabiyya*, Five Colleges' LangMedia, BYU's arabiCorpus.
- **Spanish:** UT Austin's *Spanish Proficiency Exercises* and COERLL textbooks, the FSI courses, El Colegio de México's *Diccionario del español de México*, and the Instituto Cervantes *Plan curricular*.
- **Both:** the Council of Europe's CEFR level descriptions.

The page also explains how the CEFR levels used here line up with the ACTFL levels that American materials use. The fluency guide quotes the FSI's own hour estimates and describes the levels in CEFR terms.

**Every answer is explained.** Every quiz and placement question explains why its answer is right. The build fails if one doesn't (`content/explanations.mjs`).

**Learning preferences** (Progress page, both apps):
- **Arabic transliteration:** can be switched off; tap a blurred line to peek.
- **Quiet mode:** hides streaks and XP.

**Review (spaced repetition).** Vocabulary from finished lessons and words saved in the translator come back after 1, 3, 7, 14, 30, 60 and 120 days, and start again when you forget them.

**Listening.** Dictation (type what you hear, scored by similarity) and meaning checks on lesson and scenario lines, at slow, normal or natural speed.

**Writing Studio and spoken answers.** Open-ended prompts from A1 to C1 (introduce yourself, tell a story, write a formal email, summarize the news…). Automatic feedback checks the required points, length, unknown words and missing accents or hamza, then shows a model answer. Speaking Practice has an "Answer questions" tab that transcribes a spoken answer and checks it the same way.

**Path to fluency.** Active study time (counted only while you're using the app) against rough hour estimates for each level based on US Foreign Service Institute figures (Arabic is a Category IV language, Spanish Category I), with what you can do at each level and how to practice beyond the app.

**Progress to fluency.** Reading, writing, listening, speaking and overall scores (0–100), each with an estimated CEFR band, a breakdown of what counts, and a trend chart with a table view.
- **Each skill:** 60% coverage (how much of the course you've practiced in that skill) plus 40% accuracy (the average of your last 10 scored attempts).
- **Overall:** the average of the four skills, blended 25% with your latest aptitude-test level.
- It's a study estimate, not an official CEFR certificate.

**Apple Pencil and stylus.**
- **Swift app:** tracing uses PencilKit, so Apple Pencil gets pressure, tilt and palm rejection. Once a Pencil touch is detected, finger and palm touches are ignored; a toggle turns finger drawing back on. Double-tapping Apple Pencil (2nd generation or Pro) switches to the eraser, following the system setting.
- **Web app:** works with any stylus that browsers report as a pen, including Apple Pencil in Safari and Windows/Android pens. Pressure changes line width, and finger or palm touches are ignored after a pen is used.

Every lesson has a grammar explanation (with tables), key vocabulary, example sentences, a culture section and a quiz. Phrases have transliteration (Arabic) and text-to-speech using the device's offline voices.

**Progress saving.** Progress is saved after every answer: lessons, best scores, scenarios, test history, letters practiced, writing tasks, saved words, XP and a daily streak.
- The web app saves to `localStorage` and keeps open tabs in sync.
- The Swift app writes a JSON file to Application Support.
- Both apps use the **same backup format**. Export from one and import into the other (Progress → Export / Import).

## Run the web app

No build step is needed to use it. Either:

- open `web/index.html` directly in a browser (works from `file://`), or
- serve it to get offline caching and installability: `npm run serve`, then visit http://localhost:8080.

To publish it, upload the `web/` folder to any static host. After the first visit it works fully offline.

**GitHub Pages (included).** `.github/workflows/pages.yml` deploys `web/` on every push to `main`. One-time setup: repository **Settings → Pages → Build and deployment → Source: GitHub Actions**. The site is then served at `https://anewbyss.github.io/linguistics-/`.

## Run the Swift Playgrounds app

1. Copy the `swift/Lingua.swiftpm` folder to your iPad or Mac (for example via iCloud Drive, or by downloading the repo).
2. Open it in **Swift Playgrounds 4.4+** (or Xcode 15+). It targets iOS 16 or later.
3. Press **Run**. To install it as a real app, use *App Settings → Install on device* in Playgrounds.

The course content is embedded in `ContentData.swift`, so there are no bundle resources to set up.

## Project layout

```
content/              ← edit lessons, scenarios, tests, dictionary and media here
  arabic.mjs, arabic-more.mjs     (B1–C1, dialects, prompts, level hours)
  arabic-kitaab.mjs               (Al-Kitaab Part Two companion)
  explanations.mjs                (why each quiz answer is right)
  resources.mjs                   (free university / government resources, CEFR level guide)
  spanish.mjs, spanish-more.mjs
  helpers.mjs
  dist/lingua-content.json   (generated)
scripts/build-content.mjs    validates content and generates both apps' data
web/
  index.html, css/, js/app.js  UI
  js/engine.js               translator, placement, writing check, daily challenge, fluency, progress (shared with tests)
  data/content.js            (generated)
  sw.js, manifest.webmanifest
swift/Lingua.swiftpm/
  Engine.swift               Swift port of engine.js (translator, placement, writing)
  Fluency.swift              daily challenge, speech scoring and fluency (port of engine.js)
  Practice.swift             listening, spaced repetition, prompt feedback, study time
  Plan.swift                 the learning plan (port of learningPlan in engine.js)
  PracticeSet.swift          generated practice sets (port of practiceSet in engine.js)
  Speech.swift               on-device speech recognition
  ProgressStore.swift        persistence + backup import/export
  Models.swift, ContentStore.swift, LinguaApp.swift, Views/
  ContentData.swift          (generated)
tests/
```

## Editing content

Edit `content/arabic.mjs` or `content/spanish.mjs`, then run:

```sh
npm run build
```

When writing a quiz or test question, put the **correct option first**. The build shuffles options into a fixed order and records the answer index. The build also rejects mistakes before they reach either app:
- missing fields
- bad CEFR levels
- duplicate IDs
- table rows with the wrong number of cells
- scenario steps with no correct choice
- writing tasks that reject their own answer
- levels with no media picks
- writing or speaking prompts whose model answer fails its own requirements

## Tests

```sh
npm test          # content up to date + engine tests + Swift schema checks
npm run test:e2e  # drives the whole web app in headless Chromium (needs Playwright)
```

- The engine tests cover Arabic and Spanish normalization, phrase and word-by-word translation, Arabic affixes, diminutives, writing checks, placement, streaks and progress repair.
- `swift-schema.test.mjs` checks the JSON embedded in the Swift app against every non-optional field in `Models.swift`.
- The end-to-end test runs every feature in both languages, checks that progress survives a reload, round-trips export/import, checks for horizontal scrolling at phone width, opens the app from `file://`, and loads it offline through the service worker.

## What Lingua avoids

Common complaints about Duolingo and similar apps, and how this app answers them:

| Complaint | Lingua |
|---|---|
| Thin grammar explanations | Every lesson opens with the grammar, and every question explains its answer. |
| Unnatural or wrong sentences | Examples written for the app and checked by automated tests; a "Report a mistake" link on every lesson. |
| Hearts, energy limits, ads, paywalls | None. Everything is free and open from day one; the aptitude test lets you skip ahead. |
| Streak guilt and gamification over learning | Fluency is measured from real accuracy against the CEFR; quiet mode hides streaks and XP; no notifications. |
| Little real speaking | Spoken answers to open questions, pronunciation scoring and scenarios, plus an honest push toward real conversation. |
| Arabic: formal Arabic only, weak script teaching, too much romanisation | Egyptian and Levantine tracks, letter tracing and typing, and transliteration you can switch off. |
| Stalls at beginner level | Lessons to C1 and free university and government courses for every level. |
| Lost progress, subscriptions that change | No account: progress stays on the device and can be exported at any time. |

## Notes and limits

- **No app alone makes you fully fluent.** This one now covers A1–C1 in all four skills, but real fluency also needs hundreds of hours of native listening and regular conversation with people. The Path to fluency section shows how to add those.
- **Free-writing feedback is automatic,** so it checks required points, vocabulary, length and accents, not every grammar point. Compare with the model answer and, if you can, show your writing to a tutor.
- **The translator is dictionary-based, not machine translation.** It matches whole phrases first, then glosses word by word. It handles common Arabic prefixes and possessive suffixes and Spanish plurals and diminutives, and it marks unknown words. It does not reorder grammar. That keeps it fully offline and transparent, but treat its output as a study aid.
- **Speech recognition** quality depends on the device and browser. Safari and Chrome support it, Firefox doesn't, and Chrome sends audio to an online service. Scores compare the transcript with the target text, so they reflect intelligibility rather than accent detail.
- **Speech** uses the voices installed on the device (Web Speech API / AVSpeechSynthesizer). If a device has no Arabic or Mexican Spanish voice, the listen buttons fall back to a related voice or stay silent.
- **The Swift code has not been compiled yet.** It was written against iOS 16 SwiftUI APIs and its data is validated by the schema test, but the environment it was written in had no Swift toolchain. Please report any compile error that Swift Playgrounds shows.
- **The course was drafted with AI help** and is checked by automated tests (answers, explanations, prompt model answers, layout), but it has not yet been reviewed by native-speaker teachers. Please use "Report a mistake" (it opens a GitHub issue) if you find an error.
