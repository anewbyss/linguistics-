import Foundation

// Port of web/js/engine.js. Keep the two in sync; tests/engine.test.mjs documents the expected behavior.

enum TranslateDirection: String, CaseIterable {
    case toEn, fromEn
}

struct TranslationToken: Hashable {
    let src: String
    let out: String
    let tr: String
    let how: String // phrase | word | stem | none | skip
}

struct TranslationResult {
    var output: String
    var outputTr: String
    var tokens: [TranslationToken]
    var exact: Phrase?
    var coverage: Double

    static let empty = TranslationResult(output: "", outputTr: "", tokens: [], exact: nil, coverage: 0)
}

struct WritingCheck {
    let ok: Bool
    let perfect: Bool
    let expected: String
}

struct SkillScore: Codable, Hashable {
    var c: Int
    var t: Int
}

struct PlacementResult {
    let level: String
    let beginner: Bool
    let score: Int
    let total: Int
    let byLevel: [String: SkillScore]
    let bySkill: [String: SkillScore]
}

struct LanguageStats {
    let lessonsDone: Int, lessonsTotal: Int
    let scenariosDone: Int, scenariosTotal: Int
    let lettersDone: Int, lettersTotal: Int
    let writingDone: Int, writingTotal: Int
    let percent: Int
    let level: String?
}

struct DictionaryIndex {
    private(set) var toEn: [String: [Phrase]] = [:]
    private(set) var fromEn: [String: [Phrase]] = [:]
    private(set) var maxTarget = 1
    private(set) var maxEn = 1

    init(language: Language) {
        for entry in language.dictionary {
            for form in entry.t.components(separatedBy: " / ") {
                let key = Engine.normalize(form, lang: language.id)
                if key.isEmpty { continue }
                toEn[key, default: []].appendUnique(entry)
                maxTarget = max(maxTarget, key.split(separator: " ").count)
            }
            for key in Engine.englishKeys(entry.en) {
                fromEn[key, default: []].appendUnique(entry)
                maxEn = max(maxEn, key.split(separator: " ").count)
            }
        }
        maxTarget = min(maxTarget, 6)
        maxEn = min(maxEn, 6)
    }
}

private extension Array where Element == Phrase {
    mutating func appendUnique(_ p: Phrase) {
        if !contains(p) { append(p) }
    }
}

enum Engine {
    static let levels = ["A1", "A2", "B1", "B2", "C1"]
    static let passMark = 0.6
    static let levelNames = [
        "A1": "Beginner", "A2": "Elementary", "B1": "Intermediate", "B2": "Upper intermediate", "C1": "Advanced",
    ]

    // MARK: Normalization

    private static let punctuation = Set("¿¡?!.,;:\"'“”‘’«»()[]…،؟؛—–-")

    private static func isArabicMark(_ s: Unicode.Scalar) -> Bool {
        (0x064B...0x065F).contains(s.value) || s.value == 0x0670 || s.value == 0x0640
    }

    private static func replacePunctuation(_ s: String) -> String {
        String(s.map { punctuation.contains($0) ? " " : $0 })
    }

    private static func collapse(_ s: String) -> String {
        s.split(whereSeparator: { $0.isWhitespace }).joined(separator: " ")
    }

    private static func stripArabicMarks(_ s: String) -> String {
        var out = String.UnicodeScalarView()
        for sc in s.unicodeScalars where !isArabicMark(sc) { out.append(sc) }
        return String(out)
    }

    private static func normalizeArabic(_ s: String) -> String {
        let alef: Unicode.Scalar = "\u{0627}"
        let yeh: Unicode.Scalar = "\u{064A}"
        let heh: Unicode.Scalar = "\u{0647}"
        let waw: Unicode.Scalar = "\u{0648}"
        var out = String.UnicodeScalarView()
        for sc in s.unicodeScalars {
            if isArabicMark(sc) { continue }
            switch sc.value {
            case 0x0623, 0x0625, 0x0622, 0x0671: out.append(alef)
            case 0x0649, 0x0626: out.append(yeh)
            case 0x0629: out.append(heh)
            case 0x0624: out.append(waw)
            default: out.append(sc)
            }
        }
        return String(out)
    }

    private static func stripLatinAccents(_ s: String) -> String {
        // Keep ñ distinct (año ≠ ano); drop other combining marks.
        var out = String.UnicodeScalarView()
        for sc in s.decomposedStringWithCanonicalMapping.unicodeScalars {
            if (0x0300...0x036F).contains(sc.value) && sc.value != 0x0303 { continue }
            out.append(sc)
        }
        return String(out).precomposedStringWithCanonicalMapping
    }

    /// Loose form used for matching. lang: "ar" | "es" | "en".
    static func normalize(_ text: String, lang: String) -> String {
        var s = replacePunctuation(text.lowercased())
        s = lang == "ar" ? normalizeArabic(s) : stripLatinAccents(s)
        return collapse(s)
    }

    /// Strict form: keeps accents; Arabic vowel marks removed.
    static func normalizeStrict(_ text: String, lang: String) -> String {
        var s = replacePunctuation(text.lowercased())
        if lang == "ar" { s = stripArabicMarks(s) }
        return collapse(s.precomposedStringWithCanonicalMapping)
    }

    static func hasArabic(_ s: String) -> Bool {
        s.unicodeScalars.contains { (0x0600...0x06FF).contains($0.value) }
    }

    // MARK: Dictionary helpers

    private static func removeParentheses(_ s: String) -> String {
        s.replacingOccurrences(of: "\\([^)]*\\)", with: " ", options: .regularExpression)
    }

    static func englishKeys(_ en: String) -> [String] {
        var keys: [String] = []
        for part in en.components(separatedBy: CharacterSet(charactersIn: ";,")) {
            let k = normalize(removeParentheses(part), lang: "en")
            if k.isEmpty { continue }
            if !keys.contains(k) { keys.append(k) }
            if k.hasPrefix("to ") {
                let bare = String(k.dropFirst(3))
                if !keys.contains(bare) { keys.append(bare) }
            }
        }
        return keys
    }

    static func primaryEnglish(_ en: String) -> String {
        let first = en.components(separatedBy: ";").first ?? en
        let stripped = collapse(removeParentheses(first))
        return stripped.isEmpty ? first.trimmingCharacters(in: .whitespaces) : stripped
    }

    /// Gloss for entries sharing one spelling, e.g. "he / the".
    static func glossOf(_ entries: [Phrase]) -> String {
        var seen: [String] = []
        for e in entries {
            let g = primaryEnglish(e.en)
            if !seen.contains(g) { seen.append(g) }
        }
        return seen.prefix(3).joined(separator: " / ")
    }

    // MARK: Morphology fallbacks

    static let arPrefixes: [(String, String)] = [
        ("وبال", "and with the"), ("وال", "and the"), ("بال", "with the"), ("فال", "so the"), ("كال", "like the"),
        ("لل", "for the"), ("ال", "the"), ("و", "and"), ("ب", "with"), ("ل", "for"), ("ف", "so"),
    ]
    static let arSuffixes: [(String, String)] = [
        ("كما", "your"), ("هما", "their"), ("كم", "your"), ("هم", "their"), ("نا", "our"), ("ها", "her"),
        ("ك", "your"), ("ه", "his"), ("ي", "my"),
    ]

    static func lookupArabicWord(_ word: String, _ index: DictionaryIndex) -> (entry: Phrase, gloss: String, how: String)? {
        if let direct = index.toEn[word], let e = direct.first { return (e, glossOf(direct), "word") }

        func tryStem(_ stem: String) -> Phrase? {
            if stem.count < 2 { return nil }
            if let hit = index.toEn[stem]?.first { return hit }
            if stem.hasSuffix("ت"), let hit = index.toEn[String(stem.dropLast()) + "ه"]?.first { return hit }
            if stem.hasSuffix("ات"), let hit = index.toEn[String(stem.dropLast(2)) + "ه"]?.first { return hit }
            if stem.hasSuffix("ون"), let hit = index.toEn[String(stem.dropLast(2))]?.first { return hit }
            if stem.hasSuffix("ين"), let hit = index.toEn[String(stem.dropLast(2))]?.first { return hit }
            return nil
        }

        // Candidate splits: (prefix gloss, suffix gloss, stem), whole word first.
        var options: [(String, String, String)] = []
        let prefixes: [(String, String)] = [("", "")] + arPrefixes.filter { word.hasPrefix($0.0) && word.count - $0.0.count >= 2 }
        for (p, pg) in prefixes {
            let rest = String(word.dropFirst(p.count))
            options.append((pg, "", rest))
            for (s, sg) in arSuffixes where rest.hasSuffix(s) && rest.count - s.count >= 2 {
                options.append((pg, sg, String(rest.dropLast(s.count))))
            }
        }
        for (pg, sg, stem) in options {
            guard let entry = tryStem(stem) else { continue }
            // A possessive ending replaces "the": والبيت → and the house, وبيتي → and my house.
            var prefix = pg
            if !sg.isEmpty && prefix.hasSuffix("the") {
                prefix = String(prefix.dropLast(3)).trimmingCharacters(in: .whitespaces)
            }
            let gloss = [prefix, sg, primaryEnglish(entry.en)].filter { !$0.isEmpty }.joined(separator: " ")
            return (entry, gloss, "stem")
        }
        return nil
    }

    private static let diminutive = try! NSRegularExpression(pattern: "^(.+?)c?it([oa])s?$")

    static func lookupSpanishWord(_ word: String, _ index: DictionaryIndex) -> (entry: Phrase, gloss: String, how: String)? {
        if let direct = index.toEn[word], let e = direct.first { return (e, glossOf(direct), "word") }
        var variants: [String] = []
        if word.hasSuffix("es") { variants.append(String(word.dropLast(2))) }
        if word.hasSuffix("s") { variants.append(String(word.dropLast())) }
        // Diminutives: cafecito → café, ahorita → ahora, poquito → poco.
        let range = NSRange(word.startIndex..., in: word)
        if let m = diminutive.firstMatch(in: word, range: range),
           let r1 = Range(m.range(at: 1), in: word), let r2 = Range(m.range(at: 2), in: word) {
            let base = String(word[r1])
            let vowel = String(word[r2])
            var plain = base
            if plain.hasSuffix("qu") { plain = String(plain.dropLast(2)) + "c" }
            if plain.hasSuffix("gu") { plain = String(plain.dropLast(2)) + "g" }
            variants += [base, base + vowel, plain + vowel, plain + "o", plain + "a"]
        }
        if word.range(of: "[ao]s?$", options: .regularExpression) != nil {
            variants.append(word.replacingOccurrences(of: "as?$", with: "o", options: .regularExpression))
            variants.append(word.replacingOccurrences(of: "os?$", with: "a", options: .regularExpression))
        }
        for v in variants {
            if let hit = index.toEn[v], let e = hit.first { return (e, glossOf(hit), "stem") }
        }
        return nil
    }

    private static func lookupEnglishWord(_ word: String, _ index: DictionaryIndex) -> (entry: Phrase, how: String)? {
        if let e = index.fromEn[word]?.first { return (e, "word") }
        var variants: [String] = []
        if word.hasSuffix("ies") { variants.append(String(word.dropLast(3)) + "y") }
        if word.hasSuffix("es") { variants.append(String(word.dropLast(2))) }
        if word.hasSuffix("s") { variants.append(String(word.dropLast())) }
        if word.hasSuffix("ing") { variants += [String(word.dropLast(3)), String(word.dropLast(3)) + "e"] }
        if word.hasSuffix("ed") { variants += [String(word.dropLast(2)), String(word.dropLast())] }
        for v in variants {
            if let e = index.fromEn[v]?.first { return (e, "stem") }
        }
        return nil
    }

    // MARK: Translation

    static func translate(_ text: String, language: Language, direction: TranslateDirection, index: DictionaryIndex) -> TranslationResult {
        let lang = language.id
        let norm = normalize(text, lang: direction == .toEn ? lang : "en")
        if norm.isEmpty { return .empty }
        let map = direction == .toEn ? index.toEn : index.fromEn
        let maxN = direction == .toEn ? index.maxTarget : index.maxEn
        let skip = Set(direction == .fromEn ? language.translateSkipEn : [])
        let exactHit = map[norm]
        let words = norm.split(separator: " ").map(String.init)
        var tokens: [TranslationToken] = []
        var i = 0
        while i < words.count {
            var matched = false
            var n = min(maxN, words.count - i)
            while n >= 1 {
                let phrase = words[i..<(i + n)].joined(separator: " ")
                if let hit = map[phrase], let e = hit.first, n > 1 || !skip.contains(phrase) {
                    let out = direction == .toEn ? glossOf(hit) : e.t
                    tokens.append(TranslationToken(src: phrase, out: out, tr: e.tr ?? "", how: n > 1 ? "phrase" : "word"))
                    i += n
                    matched = true
                    break
                }
                n -= 1
            }
            if matched { continue }
            let w = words[i]
            i += 1
            if skip.contains(w) {
                tokens.append(TranslationToken(src: w, out: "", tr: "", how: "skip"))
                continue
            }
            var res: (entry: Phrase, gloss: String, how: String)?
            if direction == .toEn {
                res = lang == "ar" ? lookupArabicWord(w, index) : lookupSpanishWord(w, index)
            } else if let r = lookupEnglishWord(w, index) {
                res = (r.entry, r.entry.t, r.how)
            }
            if let res = res {
                tokens.append(TranslationToken(src: w, out: res.gloss, tr: res.entry.tr ?? "", how: res.how))
            } else {
                tokens.append(TranslationToken(src: w, out: "[\(w)]", tr: "", how: "none"))
            }
        }
        let shown = tokens.filter { $0.how != "skip" }
        let known = shown.filter { $0.how != "none" }.count
        var result = TranslationResult(
            output: shown.map(\.out).joined(separator: " "),
            outputTr: shown.map { !$0.tr.isEmpty ? $0.tr : ($0.how == "none" ? $0.out : "") }.filter { !$0.isEmpty }.joined(separator: " "),
            tokens: shown,
            exact: nil,
            coverage: shown.isEmpty ? 0 : Double(known) / Double(shown.count)
        )
        if let hit = exactHit, let e = hit.first {
            result.exact = e
            result.output = direction == .toEn ? glossOf(hit) : e.t
            result.outputTr = e.tr ?? ""
        }
        return result
    }

    static func detectDirection(_ text: String, language: Language, index: DictionaryIndex) -> TranslateDirection {
        if language.isArabic { return hasArabic(text) ? .toEn : .fromEn }
        var es = 0
        var en = 0
        for w in normalize(text, lang: "es").split(separator: " ").map(String.init) {
            if index.toEn[w] != nil { es += 1 }
            if index.fromEn[normalize(w, lang: "en")] != nil { en += 1 }
        }
        if text.range(of: "[ñ¿¡áéíóú]", options: [.regularExpression, .caseInsensitive]) != nil { es += 2 }
        return es > en ? .toEn : .fromEn
    }

    // MARK: Writing

    static func checkWriting(_ input: String, task: WritingTask, lang: String) -> WritingCheck {
        let answers = [task.answer] + (task.alts ?? [])
        let loose = normalize(input, lang: lang)
        let strict = normalizeStrict(input, lang: lang)
        if loose.isEmpty { return WritingCheck(ok: false, perfect: false, expected: task.answer) }
        for a in answers where normalizeStrict(a, lang: lang) == strict {
            return WritingCheck(ok: true, perfect: true, expected: a)
        }
        for a in answers where normalize(a, lang: lang) == loose {
            return WritingCheck(ok: true, perfect: false, expected: a)
        }
        return WritingCheck(ok: false, perfect: false, expected: task.answer)
    }

    // MARK: Placement

    /// Placement = highest level passed (≥60%) with every lower level also passed.
    /// ≥80% on the top tested level recommends the next level up.
    static func placement(_ questions: [Question], answers: [Int]) -> PlacementResult {
        var byLevel: [String: SkillScore] = [:]
        var bySkill: [String: SkillScore] = [:]
        var correct = 0
        for (i, q) in questions.enumerated() {
            let ok = i < answers.count && answers[i] == q.answer
            if ok { correct += 1 }
            let lv = q.level ?? "A1"
            let sk = q.skill ?? "general"
            byLevel[lv, default: SkillScore(c: 0, t: 0)].t += 1
            bySkill[sk, default: SkillScore(c: 0, t: 0)].t += 1
            if ok {
                byLevel[lv]?.c += 1
                bySkill[sk]?.c += 1
            }
        }
        let tested = levels.filter { byLevel[$0] != nil }
        var level = "A1"
        var passedAll = true
        var lastPassed: String?
        for l in tested {
            guard let r = byLevel[l] else { continue }
            if Double(r.c) / Double(r.t) >= passMark {
                lastPassed = l
                level = l
            } else {
                passedAll = false
                break
            }
        }
        if lastPassed != nil, passedAll, let top = tested.last, let r = byLevel[top],
           let idx = levels.firstIndex(of: top), idx + 1 < levels.count, Double(r.c) / Double(r.t) >= 0.8 {
            level = levels[idx + 1]
        }
        return PlacementResult(level: level, beginner: lastPassed == nil, score: correct, total: questions.count, byLevel: byLevel, bySkill: bySkill)
    }

    // MARK: Stats

    static func stats(_ language: Language, _ lp: LangProgress) -> LanguageStats {
        let lessons = language.allLessons
        let done = lessons.filter { lp.lessons[$0.id]?.done == true }.count
        let scen = language.scenarios.filter { lp.scenarios[$0.id] != nil }.count
        let letters = language.reading.letters.filter { (lp.letters[$0.char] ?? 0) > 0 }.count
        let writing = language.reading.writing.filter { lp.writing[$0.answer] == true }.count
        let total = lessons.count + language.scenarios.count + language.reading.letters.count + language.reading.writing.count
        let got = done + scen + letters + writing
        return LanguageStats(
            lessonsDone: done, lessonsTotal: lessons.count,
            scenariosDone: scen, scenariosTotal: language.scenarios.count,
            lettersDone: letters, lettersTotal: language.reading.letters.count,
            writingDone: writing, writingTotal: language.reading.writing.count,
            percent: total == 0 ? 0 : Int((Double(got) / Double(total) * 100).rounded()),
            level: lp.aptitude.last?.level
        )
    }

    static func percent(_ c: Int, _ t: Int) -> Int {
        t == 0 ? 0 : Int((Double(c) / Double(t) * 100).rounded())
    }
}
