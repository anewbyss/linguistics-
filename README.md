# Lingua: Arabic & Mexican Spanish

A language-learning app for **Arabic** (Modern Standard Arabic with everyday Egyptian and Levantine) and **Mexican Spanish**, built twice from one content source:

- **Web app** (`web/`): a PWA that works offline, runs in any modern browser, and can be installed to a phone's home screen.
- **Swift Playgrounds app** (`swift/Lingua.swiftpm`): a native SwiftUI app for iPad, iPhone and Mac.

A landing screen leads to a separate menu for each language.

## Features (in both apps)

| | Arabic | Mexican Spanish |
|---|---|---|
| **Lesson categories** (grammar + culture, A1–B2) | 8 categories, 16 lessons | 8 categories, 16 lessons |
| **Reading & writing** | 28 letters with all four joined forms, vowel marks, word reading, typing with an on-screen Arabic keyboard, finger tracing with scoring, letter quiz | Letters and Mexican pronunciation, accent rules, place-name reading, typing with accent keys, tracing, accent quiz |
| **Real-world scenarios** (branching role-play) | 7 (Amman café, Cairo taxi, souq, family dinner, directions, iftar, pharmacy) | 7 (taquería, CDMX Metro, market, pharmacy, Día de Muertos, weekend plans, job interview) |
| **Aptitude test** (placement A1–C1, broken down by level and skill) | 20 questions | 20 questions |
| **Offline translator** (both directions, phrasebook, saved words) | 290 entries with prefix and suffix handling (و، ال، ـي…) | 361 entries with plurals and diminutives |
| **Media picks by level** (A1–C1) | 18 | 18 |

Every lesson has a grammar explanation (with tables), key vocabulary, example sentences, a culture section and a quiz. Phrases have transliteration (Arabic) and text-to-speech using the device's offline voices.

**Progress saving.** Progress is saved after every answer: lessons, best scores, scenarios, test history, letters practised, writing tasks, saved words, XP and a daily streak.
- The web app saves to `localStorage` and keeps open tabs in sync.
- The Swift app writes a JSON file to Application Support.
- Both apps use the **same backup format**. Export from one and import into the other (Progress → Export / Import).

## Run the web app

No build step is needed to use it. Either:

- open `web/index.html` directly in a browser (works from `file://`), or
- serve it to get offline caching and installability: `npm run serve`, then visit http://localhost:8080.

To publish it, upload the `web/` folder to any static host (GitHub Pages, Netlify, etc.). After the first visit it works fully offline.

## Run the Swift Playgrounds app

1. Copy the `swift/Lingua.swiftpm` folder to your iPad or Mac (for example via iCloud Drive, or by downloading the repo).
2. Open it in **Swift Playgrounds 4.4+** (or Xcode 15+). It targets iOS 16 or later.
3. Press **Run**. To install it as a real app, use *App Settings → Install on device* in Playgrounds.

The course content is embedded in `ContentData.swift`, so there are no bundle resources to set up.

## Project layout

```
content/              ← edit lessons, scenarios, tests, dictionary and media here
  arabic.mjs
  spanish.mjs
  helpers.mjs
  dist/lingua-content.json   (generated)
scripts/build-content.mjs    validates content and generates both apps' data
web/
  index.html, css/, js/app.js  UI
  js/engine.js               translator, placement scoring, writing check, progress (shared with tests)
  data/content.js            (generated)
  sw.js, manifest.webmanifest
swift/Lingua.swiftpm/
  Engine.swift               Swift port of engine.js
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

## Tests

```sh
npm test          # content up to date + engine tests + Swift schema checks
npm run test:e2e  # drives the whole web app in headless Chromium (needs Playwright)
```

- The engine tests cover Arabic and Spanish normalisation, phrase and word-by-word translation, Arabic affixes, diminutives, writing checks, placement, streaks and progress repair.
- `swift-schema.test.mjs` checks the JSON embedded in the Swift app against every non-optional field in `Models.swift`.
- The end-to-end test runs every feature in both languages, checks that progress survives a reload, round-trips export/import, checks for horizontal scrolling at phone width, opens the app from `file://`, and loads it offline through the service worker.

## Notes and limits

- **The translator is dictionary-based, not machine translation.** It matches whole phrases first, then glosses word by word. It handles common Arabic prefixes and possessive suffixes and Spanish plurals and diminutives, and it marks unknown words. It does not reorder grammar. That keeps it fully offline and transparent, but treat its output as a study aid.
- **Speech** uses the voices installed on the device (Web Speech API / AVSpeechSynthesizer). If a device has no Arabic or Mexican Spanish voice, the listen buttons fall back to a related voice or stay silent.
- **The Swift code has not been compiled yet.** It was written against iOS 16 SwiftUI APIs and its data is validated by the schema test, but the environment it was written in had no Swift toolchain. Please report any compile error that Swift Playgrounds shows.
- The content was written with care, but a review by native speakers (especially of the dialect notes) is recommended before wider use.
