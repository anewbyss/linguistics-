import Foundation

// Port of practiceSet in web/js/engine.js: endless, varied practice sets for a lesson, a topic
// (category) or a whole level. Every item is assembled from the course's own checked content
// (vocabulary, example sentences, grammar tables and quiz questions); nothing new is invented.

struct PracticeScope {
    let key: String
    let title: String
    let lessons: [Lesson]
    let categories: [Category]
}

struct PracticeItem: Identifiable {
    enum Kind { case choice, type, order }
    let id: String
    let kind: Kind
    let skill: String
    var q = ""
    var context: String?
    var t: String?
    var tr: String?
    var audio = false
    var options: [String] = []
    var answer = 0
    var answerText = ""
    var hint: String?
    var en = ""
    var tiles: [String] = []
    var tokens: [String] = []
    var explain: String?
}

extension Engine {
    static let practicePass = 80

    static func practiceScope(_ language: Language, type: String, id: String) -> PracticeScope? {
        switch type {
        case "lesson":
            guard let cat = language.categories.first(where: { $0.lessons.contains { $0.id == id } }),
                  let l = cat.lessons.first(where: { $0.id == id }) else { return nil }
            return PracticeScope(key: "lesson:\(l.id)", title: l.title, lessons: [l], categories: [cat])
        case "cat":
            guard let c = language.categories.first(where: { $0.id == id }) else { return nil }
            return PracticeScope(key: "cat:\(c.id)", title: c.title, lessons: c.lessons, categories: [c])
        case "level":
            guard levels.contains(id) else { return nil }
            let cats = language.categories.filter { $0.lessons.contains { $0.level == id } }
            return PracticeScope(key: "level:\(id)", title: "\(id) · \(levelNames[id] ?? "")",
                                 lessons: language.allLessons.filter { $0.level == id }, categories: cats)
        default:
            return nil
        }
    }

    /// The chosen tiles must spell the original sentence.
    static func checkOrder(_ chosen: [String], _ answer: [String]) -> Bool { chosen == answer }

    static func practiceSet(_ language: Language, type: String, id: String, seed: UInt32, count: Int = 10) -> [PracticeItem] {
        guard let sc = practiceScope(language, type: type, id: id), !sc.lessons.isEmpty else { return [] }
        var rng = SeededRandom(seed: seed)
        let lid = language.id
        func norm(_ t: String) -> String { normalize(t, lang: lid) }
        func words(_ t: String) -> [String] { t.split(whereSeparator: { $0 == " " || $0 == "\n" }).map(String.init) }
        func usable(_ p: Phrase) -> Bool { !p.t.isEmpty && !p.en.isEmpty && !p.t.contains("…") && !p.t.contains("...") && !p.t.contains("/") }
        func uniq(_ list: [Phrase]) -> [Phrase] {
            var seen = Set<String>()
            return list.filter { seen.insert($0.t).inserted }
        }
        let vocab = uniq(sc.lessons.flatMap(\.vocab).filter(usable))
        let examples = uniq(sc.lessons.flatMap(\.examples).filter(usable))
        let phrases = uniq(vocab + examples)
        let top = sc.lessons.map { levelIndex($0.level) }.max() ?? 0
        let wider = uniq(language.allLessons.filter { levelIndex($0.level) <= top }.flatMap { $0.vocab + $0.examples }.filter(usable))

        // Options must look alike: words go with words, sentences with sentences.
        func isShort(_ p: Phrase) -> Bool { words(p.t).count <= 2 }
        func others(_ p: Phrase, _ n: Int) -> [Phrase] {
            var seenEn: Set<String> = [p.en]
            var out: [Phrase] = []
            for q in rng.shuffled(phrases) + rng.shuffled(wider) {
                if out.count >= n { break }
                if seenEn.contains(q.en) || norm(q.t) == norm(p.t) || isShort(q) != isShort(p) { continue }
                seenEn.insert(q.en)
                out.append(q)
            }
            return out
        }
        func about(_ p: Phrase) -> String {
            "\(p.t)\(p.tr.map { " (\($0))" } ?? ""): “\(p.en)”\(p.note.map { " · \($0)" } ?? "")"
        }
        var used = Set<String>()
        func fresh(_ list: [Phrase]) -> Phrase? { rng.shuffled(list).first { !used.contains($0.t) } }
        var n = 0
        func choice(_ skill: String, _ q: String, _ options: [String], _ correct: String) -> PracticeItem {
            let opts = rng.shuffled(options)
            n += 1
            return PracticeItem(id: "\(sc.key)-\(seed)-\(n)", kind: .choice, skill: skill, q: q, options: opts, answer: opts.firstIndex(of: correct) ?? 0)
        }

        func meaning(listen: Bool) -> PracticeItem? {
            guard let p = fresh(phrases) else { return nil }
            let d = others(p, 3)
            guard d.count >= 2 else { return nil }
            used.insert(p.t)
            var item = choice(listen ? "listening" : "reading", listen ? "Listen. What does it mean?" : "What does this mean?", [p.en] + d.map(\.en), p.en)
            item.t = p.t
            item.tr = p.tr
            item.audio = listen
            item.explain = about(p)
            return item
        }
        func reverse() -> PracticeItem? {
            guard let p = fresh(phrases) else { return nil }
            let d = others(p, 3)
            guard d.count >= 2 else { return nil }
            used.insert(p.t)
            var item = choice("reading", "How do you say “\(primaryEnglish(p.en))”?", [p.t] + d.map(\.t), p.t)
            item.explain = about(p)
            return item
        }
        func typing() -> PracticeItem? {
            guard let v = fresh(vocab.filter { words($0.t).count <= 3 }) else { return nil }
            used.insert(v.t)
            n += 1
            return PracticeItem(id: "\(sc.key)-\(seed)-\(n)", kind: .type, skill: "writing", q: "Write “\(primaryEnglish(v.en))” in \(language.name)",
                                answerText: v.t, hint: v.tr, explain: about(v))
        }
        func order() -> PracticeItem? {
            guard let s = fresh(examples.filter { let c = words($0.t).count; return c >= 3 && c <= 8 && !$0.t.contains(" — ") }) else { return nil }
            let tokens = words(s.t)
            var tiles = rng.shuffled(tokens)
            var tries = 0
            while tiles == tokens && tries < 5 { tiles = rng.shuffled(tokens); tries += 1 }
            guard tiles != tokens else { return nil }
            used.insert(s.t)
            n += 1
            return PracticeItem(id: "\(sc.key)-\(seed)-\(n)", kind: .order, skill: "writing", q: "Put the words in order", tr: s.tr, en: s.en,
                                tiles: tiles, tokens: tokens, explain: about(s))
        }
        func gap() -> PracticeItem? {
            let single = vocab.filter { !$0.t.contains(" ") }
            for s in rng.shuffled(examples) where !used.contains(s.t) {
                let tokens = words(s.t)
                guard tokens.count >= 3 else { continue }
                let sentenceWords = Set(tokens.map(norm))
                let hits = tokens.enumerated().filter { tk in single.contains { norm($0.t) == norm(tk.element) } }
                guard !hits.isEmpty else { continue }
                let hit = rng.pick(hits)
                let d = Array(rng.shuffled(single.filter { !sentenceWords.contains(norm($0.t)) }).prefix(3))
                guard d.count >= 2 else { continue }
                used.insert(s.t)
                let blanked = tokens.enumerated().map { $0.offset == hit.offset ? "___" : $0.element }.joined(separator: " ")
                var item = choice("reading", "Complete the sentence: “\(s.en)”", [hit.element] + d.map(\.t), hit.element)
                item.t = blanked
                item.explain = about(s)
                return item
            }
            return nil
        }
        func table() -> PracticeItem? {
            if used.filter({ $0.hasPrefix("table:") }).count >= 2 { return nil }
            let withTables = rng.shuffled(sc.lessons.filter { ($0.grammar.table?.rows.count ?? 0) >= 3 && ($0.grammar.table?.headers.count ?? 0) >= 2 })
            for l in withTables {
                guard let tb = l.grammar.table else { continue }
                let firstDistinct = Set(tb.rows.map { $0.first ?? "" }).count == tb.rows.count
                let cols = rng.shuffled(Array(1..<tb.headers.count)).filter { c in
                    firstDistinct && tb.rows.allSatisfy { $0.count > c } && Set(tb.rows.map { $0[c] }).count == tb.rows.count
                }
                guard let c = cols.first else { continue }
                let row = rng.pick(tb.rows)
                let key = "table:\(l.id):\(row[0]):\(c)"
                if used.contains(key) { continue }
                used.insert(key)
                let wrong = Array(rng.shuffled(tb.rows.filter { $0 != row }.map { $0[c] }).prefix(3))
                var item = choice("reading", "\(tb.headers[0]) “\(row[0])” → \(tb.headers[c])?", [row[c]] + wrong, row[c])
                item.context = "Grammar: \(l.grammar.title)"
                item.explain = "\(row[0]) → \(row[c]) (\(tb.headers[c]))"
                return item
            }
            return nil
        }
        func quiz() -> PracticeItem? {
            guard let q = rng.shuffled(sc.lessons.flatMap(\.quiz)).first(where: { !used.contains("quiz:\($0.id)") }) else { return nil }
            used.insert("quiz:\(q.id)")
            var item = choice("reading", q.q, q.options, q.options[q.answer])
            item.t = q.t
            item.explain = q.explain
            return item
        }

        // A varied mix: each round visits every exercise type once, in a random order.
        let kinds = ["meaning", "reverse", "listen", "type", "order", "gap", "table", "quiz"]
        var items: [PracticeItem] = []
        var misses = 0
        while items.count < count && misses < kinds.count * 3 {
            for k in rng.shuffled(kinds) {
                if items.count >= count { break }
                let item: PracticeItem?
                switch k {
                case "meaning": item = meaning(listen: false)
                case "reverse": item = reverse()
                case "listen": item = meaning(listen: true)
                case "type": item = typing()
                case "order": item = order()
                case "gap": item = gap()
                case "table": item = table()
                default: item = quiz()
                }
                if let item = item { items.append(item) } else { misses += 1 }
            }
        }
        return items
    }
}
