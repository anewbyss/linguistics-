import Foundation

// Port of the daily challenge, speaking and fluency parts of web/js/engine.js.
// Uses the same seeded generator, so both apps build the same challenge for the same day and progress.

struct SpeakPhrase: Hashable {
    let phrase: Phrase
    let level: String
    let lessonId: String
}

struct ChallengeItem: Hashable, Identifiable {
    enum Kind: String { case choice, type, speak, dictation }

    var id: String = ""
    let kind: Kind
    let skill: String
    // choice
    var q: String = ""
    var t: String?
    var tr: String?
    var options: [String] = []
    var answer: Int = 0
    var explain: String?
    // type
    var prompt: String = ""
    var answerText: String = ""
    var alts: [String]?
    var hint: String?
    // speak / dictation
    var en: String = ""
    /// Listening item: play the audio first and show the text only on request.
    var audio = false

    var writingTask: WritingTask { WritingTask(en: prompt, answer: answerText, alts: alts, hint: hint) }
}

struct FluencyPart: Hashable {
    let label: String
    let done: Int
    let total: Int
}

struct SkillFluency {
    let score: Int
    let band: String
    let coverage: Int
    let accuracy: Int?
    let samples: Int
    let parts: [FluencyPart]
}

struct FluencyReport {
    let reading: SkillFluency
    let writing: SkillFluency
    let listening: SkillFluency
    let speaking: SkillFluency
    let overall: Int
    let overallBand: String
    let testLevel: String?

    func skill(_ name: String) -> SkillFluency {
        switch name {
        case "reading": return reading
        case "writing": return writing
        case "listening": return listening
        default: return speaking
        }
    }
}

/// mulberry32, identical to the JavaScript version.
struct SeededRandom {
    private var state: UInt32

    init(seed: UInt32) { state = seed }

    mutating func next() -> Double {
        state = state &+ 0x6D2B79F5
        var t = (state ^ (state >> 15)) &* (state | 1)
        t = (t &+ ((t ^ (t >> 7)) &* (t | 61))) ^ t
        return Double(t ^ (t >> 14)) / 4294967296
    }

    mutating func pick<T>(_ items: [T]) -> T {
        items[min(items.count - 1, Int(next() * Double(items.count)))]
    }

    mutating func shuffled<T>(_ items: [T]) -> [T] {
        var a = items
        var i = a.count - 1
        while i > 0 {
            let j = Int(next() * Double(i + 1))
            a.swapAt(i, j)
            i -= 1
        }
        return a
    }
}

extension Engine {
    static let skills = ["reading", "writing", "listening", "speaking"]
    static let speakPass = 70

    /// FNV-1a over UTF-16 code units, like the JavaScript hash().
    static func hash(_ s: String) -> UInt32 {
        var h: UInt32 = 2166136261
        for unit in s.utf16 {
            h ^= UInt32(unit)
            h = h &* 16777619
        }
        return h
    }

    // MARK: Speaking

    static func speakingPhrases(_ language: Language) -> [SpeakPhrase] {
        var seen = Set<String>()
        var out: [SpeakPhrase] = []
        for cat in language.categories {
            for lesson in cat.lessons {
                for p in lesson.vocab + lesson.examples {
                    if p.t.contains("/") || p.t.contains("…") || p.t.contains("...") || seen.contains(p.t) { continue }
                    seen.insert(p.t)
                    out.append(SpeakPhrase(phrase: p, level: lesson.level, lessonId: lesson.id))
                }
            }
        }
        return out
    }

    static func levenshtein(_ a: [Character], _ b: [Character]) -> Int {
        if a.isEmpty { return b.count }
        if b.isEmpty { return a.count }
        var prev = Array(0...b.count)
        for i in 1...a.count {
            var cur = [i] + Array(repeating: 0, count: b.count)
            for j in 1...b.count {
                cur[j] = min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] == b[j - 1] ? 0 : 1))
            }
            prev = cur
        }
        return prev[b.count]
    }

    /// How close a transcript is to the target, 0–100 (spaces, case, accents and vowel marks ignored).
    static func similarity(_ said: String, _ target: String, lang: String) -> Int {
        let a = Array(normalize(said, lang: lang).replacingOccurrences(of: " ", with: ""))
        let b = Array(normalize(target, lang: lang).replacingOccurrences(of: " ", with: ""))
        if a.isEmpty || b.isEmpty { return 0 }
        let d = Double(levenshtein(a, b))
        return Int((100 * (1 - d / Double(max(a.count, b.count)))).rounded())
    }

    // MARK: Daily challenge

    private static let dotGroups = ["بتثني", "جحخ", "دذ", "رز", "سش", "صض", "طظ", "عغ", "فق"]
    private static let acute: [Character: Character] = ["a": "á", "e": "é", "i": "í", "o": "ó", "u": "ú"]

    /// Plausible misspellings, in a stable order (Arabic: dot swaps; Spanish: moved / missing accents).
    static func misspellings(_ word: String, lang: String) -> [String] {
        var out: [String] = []
        func add(_ s: String) { if s != word && !out.contains(s) { out.append(s) } }
        let chars = Array(word)
        if lang == "ar" {
            for (i, ch) in chars.enumerated() {
                guard let group = dotGroups.first(where: { $0.contains(ch) }) else { continue }
                for alt in group where alt != ch {
                    var copy = chars
                    copy[i] = alt
                    add(String(copy))
                }
            }
        } else {
            var bareScalars = String.UnicodeScalarView()
            for sc in word.decomposedStringWithCanonicalMapping.unicodeScalars where sc.value != 0x0301 { bareScalars.append(sc) }
            let bare = String(bareScalars).precomposedStringWithCanonicalMapping
            add(bare)
            let bareChars = Array(bare)
            for (i, ch) in bareChars.enumerated() {
                if let accented = acute[ch] {
                    var copy = bareChars
                    copy[i] = accented
                    add(String(copy))
                }
            }
        }
        return out
    }

    static func workingLevelIndex(_ language: Language, _ lp: LangProgress) -> Int {
        var idx = 0
        if let last = lp.aptitude.last, let i = levels.firstIndex(of: last.level) { idx = max(idx, i) }
        for lesson in language.allLessons where lp.lessons[lesson.id]?.done == true {
            idx = max(idx, levels.firstIndex(of: lesson.level) ?? 0)
        }
        return min(idx + 1, levels.count - 1)
    }

    static func levelIndex(_ level: String) -> Int { levels.firstIndex(of: level) ?? 0 }

    /// Ten mixed items, the same all day: 3 reading, 3 writing, 2 speaking, 2 listening (dictation + comprehension).
    static func dailyChallenge(_ language: Language, _ lp: LangProgress, day: String) -> [ChallengeItem] {
        var rand = SeededRandom(seed: hash("\(language.id):\(day)"))
        let cap = workingLevelIndex(language, lp)
        let lessons = language.allLessons
        var pool = lessons.filter { levelIndex($0.level) <= cap }
        if pool.count < 4 { pool = Array(lessons.prefix(4)) }
        var vocab: [Phrase] = []
        var seenEn = Set<String>()
        for l in pool {
            for v in l.vocab where !seenEn.contains(v.en) && !v.t.contains("…") && !v.t.contains("...") {
                seenEn.insert(v.en)
                vocab.append(v)
            }
        }
        var items: [ChallengeItem] = []

        func meaning(_ p: Phrase, q: String) -> ChallengeItem {
            let wrong = rand.shuffled(vocab.filter { $0.en != p.en }).prefix(3).map(\.en)
            let options = rand.shuffled([p.en] + wrong)
            return ChallengeItem(kind: .choice, skill: "reading", q: q, t: p.t, options: options, answer: options.firstIndex(of: p.en) ?? 0)
        }

        // Reading
        for v in rand.shuffled(vocab).prefix(1) {
            let item = meaning(v, q: "What does this mean?")
            items.append(item)
        }
        let word = rand.pick(language.reading.words)
        let wordItem = meaning(word, q: "Read this word. What does it mean?")
        items.append(wordItem)
        let lessonForQuiz = rand.pick(pool)
        let lq = rand.pick(lessonForQuiz.quiz)
        items.append(ChallengeItem(kind: .choice, skill: "reading", q: lq.q, t: lq.t, options: lq.options, answer: lq.answer, explain: lq.explain))

        // Writing
        for w in rand.shuffled(language.reading.writing).prefix(2) {
            items.append(ChallengeItem(kind: .type, skill: "writing", prompt: "Write “\(w.en)” in \(language.name)", answerText: w.answer, alts: w.alts, hint: w.hint))
        }
        let real = Set((language.dictionary + language.reading.words).map { normalizeStrict($0.t, lang: language.id) })
        func wrongSpellings(_ w: String) -> [String] {
            misspellings(w, lang: language.id).filter { !real.contains(normalizeStrict($0, lang: language.id)) }
        }
        let candidates: [Phrase]
        if language.isArabic {
            candidates = language.reading.words.map { Phrase(t: normalizeStrict($0.t, lang: "ar"), en: $0.en) }
        } else {
            candidates = language.dictionary.filter { e in
                e.t.range(of: "[áéíóú]", options: .regularExpression) != nil
                    && e.t.range(of: "^[a-zñüáéíóú]+$", options: [.regularExpression, .caseInsensitive]) != nil
                    && e.t.utf16.count > 3
            }
        }
        let spellPool = candidates.filter { wrongSpellings($0.t).count >= 3 }
        if !spellPool.isEmpty {
            let sp = rand.pick(spellPool)
            let wrong = rand.shuffled(wrongSpellings(sp.t)).prefix(3)
            let options = rand.shuffled([sp.t] + wrong)
            items.append(ChallengeItem(
                kind: .choice, skill: "writing", q: "Which is the correct spelling of “\(primaryEnglish(sp.en))”?",
                options: options, answer: options.firstIndex(of: sp.t) ?? 0,
                explain: language.isArabic ? "Watch the dots: they are the only difference between many Arabic letters." : "The written accent marks the stressed syllable."
            ))
        }

        // Speaking
        let speakPool = speakingPhrases(language).filter { levelIndex($0.level) <= cap && $0.phrase.t.split(separator: " ").count <= 5 }
        for p in rand.shuffled(speakPool).prefix(2) {
            items.append(ChallengeItem(kind: .speak, skill: "speaking", t: p.phrase.t, tr: p.phrase.tr, en: p.phrase.en))
        }

        // Listening: a dictation, then a scenario line to understand by ear
        let allListen = listeningItems(language)
        let dictPool = allListen.filter { levelIndex($0.level) <= cap && $0.phrase.t.split(separator: " ").count <= 6 }
        if !allListen.isEmpty {
            let dict = rand.pick(dictPool.isEmpty ? allListen : dictPool)
            items.append(ChallengeItem(kind: .dictation, skill: "listening", t: dict.phrase.t, tr: dict.phrase.tr, en: dict.phrase.en))
        }
        var listen: [Step] = []
        for sc in language.scenarios where levelIndex(sc.level) <= cap {
            for st in sc.steps where st.isUnderstand && st.line != nil { listen.append(st) }
        }
        if !listen.isEmpty {
            let st = rand.pick(listen)
            let choices = st.choices ?? []
            var item = ChallengeItem(
                kind: .choice, skill: "listening", q: "Listen to \(st.speaker ?? "the speaker"). What do they say?",
                t: st.line?.t, tr: st.line?.tr, options: choices.map(\.en), answer: choices.firstIndex { $0.correct } ?? 0
            )
            item.audio = true
            items.append(item)
        }
        for i in items.indices { items[i].id = "\(language.id)-\(day)-\(i)" }
        return items
    }

    /// Consecutive days (ending today or yesterday) with a completed challenge.
    static func challengeStreak(_ lp: LangProgress, now: Date = Date()) -> Int {
        let cal = Calendar.current
        var date = now
        if lp.challenges[ProgressStore.day(date)] == nil {
            date = cal.date(byAdding: .day, value: -1, to: date) ?? date
        }
        var n = 0
        while lp.challenges[ProgressStore.day(date)] != nil {
            n += 1
            date = cal.date(byAdding: .day, value: -1, to: date) ?? date
        }
        return n
    }

    // MARK: Fluency

    static func band(_ score: Int) -> String {
        switch score {
        case ..<20: return "A1"
        case ..<40: return "A2"
        case ..<60: return "B1"
        case ..<80: return "B2"
        default: return "C1"
        }
    }

    private static let levelScore = ["A1": 10.0, "A2": 30.0, "B1": 50.0, "B2": 70.0, "C1": 90.0]

    /// Each skill: 60% coverage + 40% accuracy (average of the last 10 scored attempts).
    /// Overall: mean of the four skills, blended 75/25 with the latest aptitude-test level.
    static func fluency(_ language: Language, _ lp: LangProgress) -> FluencyReport {
        let lessons = language.allLessons
        let letters = language.reading.letters
        let phrases = speakingPhrases(language)
        let listen = listeningItems(language)
        let deck = srsDeck(language, lp)
        let passed = { (id: String) in (lp.prompts[id]?.best ?? 0) >= promptPass }
        let parts: [String: [FluencyPart]] = [
            "reading": [
                FluencyPart(label: "Letters studied", done: letters.filter { (lp.letters[$0.char] ?? 0) > 0 }.count, total: letters.count),
                FluencyPart(label: "Lessons completed", done: lessons.filter { lp.lessons[$0.id]?.done == true }.count, total: lessons.count),
                FluencyPart(label: "Words learned (review)", done: deck.filter { (lp.srs[$0.phrase.t]?.box ?? 0) >= 3 }.count, total: deck.count),
            ],
            "writing": [
                FluencyPart(label: "Writing tasks mastered", done: language.reading.writing.filter { lp.writing[$0.answer] == true }.count, total: language.reading.writing.count),
                FluencyPart(label: "Letters traced", done: letters.filter { (lp.tracing[$0.char] ?? 0) > 0 }.count, total: letters.count),
                FluencyPart(label: "Free-writing prompts passed", done: language.writingPrompts.filter { passed($0.id) }.count, total: language.writingPrompts.count),
            ],
            "listening": [
                FluencyPart(label: "Lines understood", done: listen.filter { (lp.listening[$0.phrase.t]?.best ?? 0) >= listenPass }.count, total: listen.count),
            ],
            "speaking": [
                FluencyPart(label: "Phrases spoken", done: phrases.filter { (lp.speaking[$0.phrase.t]?.best ?? 0) >= speakPass }.count, total: phrases.count),
                FluencyPart(label: "Scenarios completed", done: language.scenarios.filter { lp.scenarios[$0.id] != nil }.count, total: language.scenarios.count),
                FluencyPart(label: "Speaking prompts answered", done: language.speakingPrompts.filter { passed($0.id) }.count, total: language.speakingPrompts.count),
            ],
        ]
        func skill(_ name: String) -> SkillFluency {
            let ps = parts[name] ?? []
            let coverage = ps.isEmpty ? 0 : ps.reduce(0.0) { $0 + ($1.total == 0 ? 0 : min(1, Double($1.done) / Double($1.total))) } / Double(ps.count)
            let recent = Array(lp.practice.list(name).suffix(10))
            let accuracy: Double? = recent.isEmpty ? nil : Double(recent.reduce(0, +)) / Double(recent.count) / 100
            let score = Int((100 * (0.6 * coverage + 0.4 * (accuracy ?? 0))).rounded())
            return SkillFluency(score: score, band: band(score), coverage: Int((coverage * 100).rounded()),
                                accuracy: accuracy.map { Int(($0 * 100).rounded()) }, samples: recent.count, parts: ps)
        }
        let r = skill("reading"), w = skill("writing"), l = skill("listening"), s = skill("speaking")
        let base = Double(r.score + w.score + l.score + s.score) / 4
        let testLevel = lp.aptitude.last?.level
        let overall = Int((testLevel.flatMap { levelScore[$0] }.map { 0.75 * base + 0.25 * $0 } ?? base).rounded())
        return FluencyReport(reading: r, writing: w, listening: l, speaking: s, overall: overall, overallBand: band(overall), testLevel: testLevel)
    }

    /// Stores today's snapshot (one per day) for the trend chart.
    @discardableResult
    static func recordFluency(_ language: Language, _ lp: inout LangProgress, now: Date = Date()) -> FluencyReport {
        let f = fluency(language, lp)
        let entry = FluencySnapshot(day: ProgressStore.day(now), reading: f.reading.score, writing: f.writing.score,
                                    listening: f.listening.score, speaking: f.speaking.score, overall: f.overall)
        if let last = lp.fluency.last, last.day == entry.day {
            lp.fluency[lp.fluency.count - 1] = entry
        } else {
            lp.fluency.append(entry)
        }
        if lp.fluency.count > 180 { lp.fluency.removeFirst(lp.fluency.count - 180) }
        return f
    }
}
