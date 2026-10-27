import Foundation

// Port of the listening, spaced-repetition, free-prompt and study-time parts of web/js/engine.js.

struct ListenItem: Hashable {
    let phrase: Phrase
    let level: String
    let source: String
}

struct SrsCardInfo: Hashable {
    let phrase: Phrase
    let lessonId: String?
    let level: String?
}

struct SrsStats {
    let total: Int
    let learned: Int
    let due: Int
    let newAvailable: Int
    let started: Int
}

struct RequirementResult: Hashable {
    let label: String
    let met: Bool
}

struct AccentHint: Hashable {
    let word: String
    let suggestion: String
}

struct PromptAnalysis {
    let words: Int
    let minWords: Int
    let requirements: [RequirementResult]
    let unknown: [String]
    let accentHints: [AccentHint]
    let score: Int
    let passed: Bool
}

struct StudyTime {
    let minutes: Int
    let weekMinutes: Int
    let hours: Double
    let nextLevel: String?
}

extension Engine {
    static let listenPass = 80
    static let promptPass = 70
    static let srsDays = [0, 1, 3, 7, 14, 30, 60, 120]

    private static func isPracticable(_ t: String) -> Bool {
        !(t.contains("/") || t.contains("…") || t.contains("..."))
    }

    // MARK: Listening

    /// Lesson examples and what people say in scenarios.
    static func listeningItems(_ language: Language) -> [ListenItem] {
        var seen = Set<String>()
        var out: [ListenItem] = []
        func add(_ p: Phrase?, _ level: String, _ source: String) {
            guard let p = p, !p.t.isEmpty, !seen.contains(p.t), isPracticable(p.t) else { return }
            seen.insert(p.t)
            out.append(ListenItem(phrase: p, level: level, source: source))
        }
        for cat in language.categories {
            for l in cat.lessons {
                for p in l.examples { add(p, l.level, l.id) }
            }
        }
        for sc in language.scenarios {
            for st in sc.steps { add(st.line, sc.level, sc.id) }
        }
        return out
    }

    static func dictationScore(_ typed: String, _ target: String, lang: String) -> Int {
        similarity(typed, target, lang: lang)
    }

    // MARK: Spaced repetition

    private static let dayParser: DateFormatter = {
        let f = DateFormatter()
        f.calendar = Calendar(identifier: .gregorian)
        f.locale = Locale(identifier: "en_US_POSIX")
        f.timeZone = .current
        f.dateFormat = "yyyy-MM-dd HH:mm"
        return f
    }()

    static func addDays(_ day: String, _ n: Int) -> String {
        guard let d = dayParser.date(from: "\(day) 12:00"),
              let moved = Calendar.current.date(byAdding: .day, value: n, to: d) else { return day }
        return ProgressStore.day(moved)
    }

    /// Lesson vocabulary in course order, then saved words.
    static func srsDeck(_ language: Language, _ lp: LangProgress) -> [SrsCardInfo] {
        var seen = Set<String>()
        var out: [SrsCardInfo] = []
        for cat in language.categories {
            for l in cat.lessons {
                for v in l.vocab where !seen.contains(v.t) && !v.t.contains("…") && !v.t.contains("...") {
                    seen.insert(v.t)
                    out.append(SrsCardInfo(phrase: v, lessonId: l.id, level: l.level))
                }
            }
        }
        for sv in lp.saved where !seen.contains(sv.t) {
            seen.insert(sv.t)
            out.append(SrsCardInfo(phrase: sv, lessonId: nil, level: nil))
        }
        return out
    }

    /// Due cards (oldest first), then up to `newLimit` new cards from finished lessons and saved words.
    static func srsQueue(_ language: Language, _ lp: LangProgress, day: String, newLimit: Int = 10) -> [SrsCardInfo] {
        let deck = srsDeck(language, lp)
        let due = deck.enumerated()
            .filter { (lp.srs[$0.element.phrase.t]?.due ?? "9999") <= day }
            .sorted { a, b in
                let da = lp.srs[a.element.phrase.t]?.due ?? ""
                let db = lp.srs[b.element.phrase.t]?.due ?? ""
                return da == db ? a.offset < b.offset : da < db
            }
            .map(\.element)
        let fresh = deck.filter { card in
            guard lp.srs[card.phrase.t] == nil else { return false }
            guard let lesson = card.lessonId else { return true }
            return lp.lessons[lesson]?.done == true
        }
        return due + Array(fresh.prefix(max(0, newLimit)))
    }

    /// grade: "again" (back to the start), "good" (next box) or "easy" (skip a box).
    static func srsGrade(_ lp: inout LangProgress, _ cardT: String, grade: String, day: String) {
        let prev = lp.srs[cardT] ?? SrsRecord(box: 0, due: day, seen: 0)
        var box = prev.box
        switch grade {
        case "again": box = 0
        case "easy": box = min(srsDays.count - 1, box + 2)
        default: box = min(srsDays.count - 1, box + 1)
        }
        lp.srs[cardT] = SrsRecord(box: box, due: addDays(day, grade == "again" ? 0 : srsDays[box]), seen: prev.seen + 1)
    }

    static func srsStats(_ language: Language, _ lp: LangProgress, day: String) -> SrsStats {
        let deck = srsDeck(language, lp)
        let learned = deck.filter { (lp.srs[$0.phrase.t]?.box ?? 0) >= 3 }.count
        let due = deck.filter { (lp.srs[$0.phrase.t]?.due ?? "9999") <= day }.count
        let all = srsQueue(language, lp, day: day, newLimit: Int.max / 2).count
        return SrsStats(total: deck.count, learned: learned, due: due, newAvailable: all - due,
                        started: deck.filter { lp.srs[$0.phrase.t] != nil }.count)
    }

    // MARK: Free writing & speaking

    private static var knownCache: [String: [String: Set<String>]] = [:]

    private static func words(_ text: String) -> [String] {
        text.components(separatedBy: .whitespacesAndNewlines).filter { !$0.isEmpty }
    }

    /// Every word in the course for this language: loose form → strict spellings.
    static func knownWords(_ language: Language) -> [String: Set<String>] {
        if let cached = knownCache[language.id] { return cached }
        var map: [String: Set<String>] = [:]
        func addText(_ text: String?) {
            guard let text = text else { return }
            for w in words(text) {
                let loose = normalize(w, lang: language.id)
                if loose.isEmpty || loose.rangeOfCharacter(from: .decimalDigits) != nil { continue }
                map[loose, default: []].insert(normalizeStrict(w, lang: language.id))
            }
        }
        for e in language.dictionary { e.t.components(separatedBy: " / ").forEach { addText($0) } }
        for cat in language.categories {
            for l in cat.lessons {
                l.vocab.forEach { v in v.t.components(separatedBy: " / ").forEach { addText($0) } }
                l.examples.forEach { addText($0.t) }
                l.quiz.forEach { q in addText(q.t); q.options.forEach { addText($0) } }
                l.grammar.table?.rows.flatMap { $0 }.forEach { addText($0) }
            }
        }
        language.reading.words.forEach { addText($0.t) }
        language.reading.writing.forEach { w in addText(w.answer); (w.alts ?? []).forEach { addText($0) } }
        for sc in language.scenarios {
            for st in sc.steps {
                addText(st.line?.t)
                (st.choices ?? []).forEach { addText($0.t) }
            }
        }
        (language.writingPrompts + language.speakingPrompts).forEach { addText($0.model.t) }
        knownCache[language.id] = map
        return map
    }

    private static func isKnownWord(_ token: String, _ language: Language, _ index: DictionaryIndex) -> Bool {
        let map = knownWords(language)
        if map[token] != nil { return true }
        let hit = language.isArabic ? lookupArabicWord(token, index) : lookupSpanishWord(token, index)
        if hit != nil { return true }
        if language.isArabic {
            for (p, _) in arPrefixes where token.hasPrefix(p) && map[String(token.dropFirst(p.count))] != nil { return true }
            for (sfx, _) in arSuffixes where token.hasSuffix(sfx) && map[String(token.dropLast(sfx.count))] != nil { return true }
        } else {
            for end in ["s", "es", "mente"] where token.hasSuffix(end) && map[String(token.dropLast(end.count))] != nil { return true }
        }
        return false
    }

    /// Matches whole words or phrases; Arabic tokens are also tried without a leading و / ف.
    private static func meetsRequirement(_ normText: String, _ req: PromptRequirement, lang: String) -> Bool {
        let padded = " \(normText) "
        var stripped = padded
        if lang == "ar" {
            let tokens = normText.split(separator: " ").map { t -> String in
                let s = String(t)
                if s.count > 2, let first = s.first, first == "و" || first == "ف" { return String(s.dropFirst()) }
                return s
            }
            stripped = " \(tokens.joined(separator: " ")) "
        }
        return req.any.contains { alt in
            let a = normalize(alt, lang: lang)
            return !a.isEmpty && (padded.contains(" \(a) ") || stripped.contains(" \(a) "))
        }
    }

    private static func stripPunctuation(_ w: String) -> String {
        w.replacingOccurrences(of: "[¿¡?!.,;:\"'“”«»()]", with: "", options: .regularExpression)
    }

    /// Automatic feedback: requirements met, length, words the course doesn't know, and missing accents / hamza.
    static func analyzePrompt(_ text: String, _ prompt: PracticePrompt, _ language: Language, _ index: DictionaryIndex) -> PromptAnalysis {
        let lang = language.id
        let norm = normalize(text, lang: lang)
        let raw = words(text).filter { !normalize($0, lang: lang).isEmpty }
        let requirements = prompt.requirements.map { RequirementResult(label: $0.label, met: meetsRequirement(norm, $0, lang: lang)) }
        let map = knownWords(language)
        var unknown: [String] = []
        var hints: [AccentHint] = []
        var seen = Set<String>()
        for w in raw {
            let loose = normalize(w, lang: lang)
            let strict = normalizeStrict(w, lang: lang)
            if loose.isEmpty || loose.rangeOfCharacter(from: .decimalDigits) != nil || seen.contains(loose) { continue }
            seen.insert(loose)
            if loose.count <= 1 { continue }
            if let spellings = map[loose] {
                if !strict.isEmpty && !spellings.contains(strict), let first = spellings.sorted().first {
                    hints.append(AccentHint(word: stripPunctuation(w), suggestion: first))
                }
            } else if !isKnownWord(loose, language, index) {
                unknown.append(stripPunctuation(w))
            }
        }
        let met = requirements.filter(\.met).count
        let lengthPart = min(1, Double(raw.count) / Double(max(1, prompt.minWords)))
        let knownPart = raw.isEmpty ? 0 : max(0, 1 - Double(unknown.count) / Double(max(1, seen.count)))
        let score = raw.isEmpty ? 0 : Int((100 * (0.5 * Double(met) / Double(max(1, requirements.count)) + 0.3 * lengthPart + 0.2 * knownPart)).rounded())
        return PromptAnalysis(words: raw.count, minWords: prompt.minWords, requirements: requirements, unknown: unknown,
                              accentHints: hints, score: score, passed: score >= promptPass)
    }

    // MARK: Study time

    static func studyTime(_ language: Language, _ lp: LangProgress, now: Date = Date()) -> StudyTime {
        let total = lp.minutes.values.reduce(0, +)
        var week = 0
        var d = now
        for _ in 0..<7 {
            week += lp.minutes[ProgressStore.day(d)] ?? 0
            d = Calendar.current.date(byAdding: .day, value: -1, to: d) ?? d
        }
        let hours = Double(total) / 60
        let next = levels.first { Double(language.levelHours[$0] ?? 0) > hours }
        return StudyTime(minutes: total, weekMinutes: week, hours: hours, nextLevel: next)
    }
}
