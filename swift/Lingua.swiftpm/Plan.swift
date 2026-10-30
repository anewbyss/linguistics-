import Foundation

// Port of learningPlan in web/js/engine.js: a recommended path through the whole course, starting
// with the alphabet. Steps check themselves off from real progress; nothing is ever locked.

/// Saved onboarding choices; same JSON as the web app's `plan` object.
struct PlanRecord: Codable, Hashable {
    var start: String?
    var dialect: String?
}

enum PlanTarget: Hashable {
    case reading(ReadingTab)
    case lesson(String)
    case scenario(String)
    case speaking(answers: Bool)
    case listening
    case review
    case writing(String)
    case practice(String, String)
    case test

    func route(_ langId: String) -> Route {
        switch self {
        case .reading(let tab): return .readingSection(langId, tab.rawValue)
        case .lesson(let id): return .lesson(langId, id)
        case .scenario(let id): return .scenario(langId, id)
        case .speaking(let answers): return answers ? .speakingAnswers(langId) : .speaking(langId)
        case .listening: return .listening(langId)
        case .review: return .review(langId)
        case .writing(let id): return .writingPrompt(langId, id)
        case .practice(let scope, let id): return .practice(langId, scope, id)
        case .test: return .aptitude(langId)
        }
    }
}

struct PlanStep: Hashable, Identifiable {
    let id: String
    let title: String
    let why: String
    let target: PlanTarget
    let done: Bool
    var progress: (Int, Int)? = nil

    static func == (a: PlanStep, b: PlanStep) -> Bool { a.id == b.id && a.done == b.done }
    func hash(into h: inout Hasher) { h.combine(id) }
}

struct PlanUnit: Identifiable {
    let id: String
    let level: String?
    let title: String
    let intro: String
    var skipped = false
    let steps: [PlanStep]
    var done: Int { steps.filter(\.done).count }
}

struct LearningPlan {
    let start: String?
    let dialect: String?
    let units: [PlanUnit]
    let next: PlanStep?
    let nextUnit: PlanUnit?
    let done: Int
    let total: Int
    let placed: String?
    var needsSetup: Bool { start == nil }
}

extension Engine {
    static let planStarts = ["zero", "script", "test"]
    static let planDialects = ["both", "lev", "egy", "msa"]
    private static let planTargets: [String: [String: Int]] = [
        "speak": ["A1": 5, "A2": 15, "B1": 30, "B2": 45, "C1": 60],
        "listen": ["A1": 5, "A2": 15, "B1": 30, "B2": 45, "C1": 60],
        "review": ["A1": 15, "A2": 40, "B1": 80, "B2": 120, "C1": 160],
    ]
    private static let unitIntros = [
        "A1": "Greetings, introductions, numbers and food: short, high-frequency phrases and your first role-play.",
        "A2": "Everyday life: getting around, shopping, health and your routine, plus your first spoken dialect.",
        "B1": "Independence: telling stories, giving opinions, work and culture.",
        "B2": "Fluency: complex grammar, formal writing and longer conversations.",
        "C1": "Mastery: the news, formal argument and precise expression.",
    ]
    /// Scenarios set in one spoken dialect, skipped when the learner chose a different focus.
    private static let scenarioDialect = ["ar-sc-koshari": "egy", "ar-sc-manoushe": "lev", "ar-sc-flat": "lev", "ar-sc-wedding": "lev"]
    private static let categoryDialect = ["ar-egy": "egy", "ar-lev": "lev"]

    private static func dialectAllowed(_ dialect: String?, _ which: String?) -> Bool {
        guard let which = which else { return true }
        return dialect == "both" || dialect == which
    }

    static func learningPlan(_ language: Language, _ lp: LangProgress) -> LearningPlan {
        let ar = language.isArabic
        let start = lp.plan.start
        let dialect = ar ? (lp.plan.dialect ?? "both") : nil
        let r = language.reading
        let placed = lp.aptitude.last?.level
        let placedIdx = placed.map(levelIndex) ?? -1
        var units: [PlanUnit] = []

        if start == "test" {
            units.append(PlanUnit(id: "placement", level: nil, title: "Find your level", intro: "A five-minute placement test sets where your plan starts.", steps: [
                PlanStep(id: "placement-test", title: "Take the placement test", why: "Twenty questions from A1 to B2. Your plan then starts at your level, and earlier units stay open for review.", target: .test, done: !lp.aptitude.isEmpty),
            ]))
        }

        // The alphabet comes first.
        let size = ar ? 7 : 14
        var alpha: [PlanStep] = []
        var i = 0
        while i < r.letters.count {
            let group = Array(r.letters[i..<min(i + size, r.letters.count)])
            let seen = group.filter { (lp.letters[$0.char] ?? 0) > 0 }.count
            let label = ar
                ? "Letters \(i + 1)–\(i + group.count): \(group.map(\.char).joined(separator: " "))"
                : "Letters \(group.first?.char.uppercased() ?? "")–\(group.last?.char.uppercased() ?? "")"
            let why = ar
                ? (i == 0 ? "Tap each letter to hear it and see its shapes. ب ت ث share one shape: only the dots differ." : "Tap each letter to hear its sound and see how it joins its neighbors.")
                : (i == 0 ? "Tap each letter to hear it. Spanish vowels are short and always pronounced the same way." : "Tap each letter to hear it, including ñ and the rolled rr.")
            alpha.append(PlanStep(id: "alpha-\(alpha.count + 1)", title: label, why: why, target: .reading(.letters), done: seen == group.count, progress: (seen, group.count)))
            i += size
        }
        alpha.append(PlanStep(id: "alpha-marks", title: ar ? "Short vowels and other marks" : "Accents and pronunciation rules",
                              why: ar ? "Learn the small marks for a, i and u, doubled letters and silent letters." : "Learn where the stress falls and what the written accent tells you.",
                              target: .reading(.marks), done: (lp.checks["marks"] ?? 0) > 0))
        if ar {
            let traced = lp.tracing.values.filter { $0 > 0 }.count
            alpha.append(PlanStep(id: "alpha-trace", title: "Trace 10 letters", why: "Writing the shapes by hand (or with a finger or pencil) fixes them in memory.",
                                  target: .reading(.trace), done: traced >= 10, progress: (min(traced, 10), 10)))
        }
        let wordsGoal = min(10, r.words.count)
        let wordsSeen = lp.checks["words"] ?? 0
        alpha.append(PlanStep(id: "alpha-read", title: "Read your first words", why: ar ? "Sound out real words letter by letter, then check." : "Read real words aloud using the rules, then check.",
                              target: .reading(.read), done: wordsSeen >= wordsGoal, progress: (min(wordsSeen, wordsGoal), wordsGoal)))
        let written = r.writing.filter { lp.writing[$0.answer] == true }.count
        let writeGoal = min(5, r.writing.count)
        alpha.append(PlanStep(id: "alpha-write", title: "Type 5 words", why: ar ? "Use the on-screen Arabic keyboard to spell words yourself." : "Spell words with the accent keys.",
                              target: .reading(.write), done: written >= writeGoal, progress: (min(written, writeGoal), writeGoal)))
        alpha.append(PlanStep(id: "alpha-quiz", title: ar ? "Letter quiz: score 80% or more" : "Accent quiz: score 80% or more", why: "Check you can recognize them before moving on.",
                              target: .reading(.quiz), done: (lp.checks["readQuiz"] ?? 0) >= 80))
        units.append(PlanUnit(id: "alphabet", level: "A1", title: ar ? "The Arabic alphabet" : "The alphabet and pronunciation",
                              intro: ar ? "Start here: 28 letters, written right to left and joined together. Most learners need a week or two." : "Start here: Spanish is spelled almost exactly as it sounds, so this goes quickly.",
                              skipped: start == "script" || (start == "test" && placedIdx >= 1), steps: alpha))

        let phrases = speakingPhrases(language)
        let spoken = phrases.filter { (lp.speaking[$0.phrase.t]?.best ?? 0) >= speakPass }.count
        let listenAll = listeningItems(language)
        let understood = listenAll.filter { (lp.listening[$0.phrase.t]?.best ?? 0) >= listenPass }.count
        let deck = srsDeck(language, lp)
        let learned = deck.filter { (lp.srs[$0.phrase.t]?.box ?? 0) >= 3 }.count

        for (li, level) in levels.enumerated() {
            var steps: [PlanStep] = []
            var lessons: [Lesson] = []
            for c in language.categories where !ar || dialectAllowed(dialect, categoryDialect[c.id]) {
                lessons.append(contentsOf: c.lessons.filter { $0.level == level })
            }
            var scenarios = language.scenarios.filter { $0.level == level && (!ar || dialectAllowed(dialect, scenarioDialect[$0.id])) }
            func scenarioStep(_ s: Scenario) -> PlanStep {
                PlanStep(id: "scenario-\(s.id)", title: "Role-play: \(s.title)", why: s.goal, target: .scenario(s.id), done: lp.scenarios[s.id] != nil)
            }
            for (n, l) in lessons.enumerated() {
                steps.append(PlanStep(id: "lesson-\(l.id)", title: l.title, why: l.summary, target: .lesson(l.id), done: lp.lessons[l.id]?.done == true))
                if n % 2 == 1, !scenarios.isEmpty { steps.append(scenarioStep(scenarios.removeFirst())) }
            }
            steps.append(contentsOf: scenarios.map(scenarioStep))
            func capped(_ n: Int, _ total: Int) -> Int { max(1, min(n, total)) }
            let speakGoal = capped(planTargets["speak"]?[level] ?? 5, phrases.count)
            steps.append(PlanStep(id: "speak-\(level)", title: "Say \(speakGoal) phrases well", why: "Listen, repeat and get a pronunciation score in Speaking Practice.",
                                  target: .speaking(answers: false), done: spoken >= speakGoal, progress: (min(spoken, speakGoal), speakGoal)))
            let atLevel = listenAll.filter { levelIndex($0.level) <= li }.count
            let listenGoal = capped(planTargets["listen"]?[level] ?? 5, atLevel)
            steps.append(PlanStep(id: "listen-\(level)", title: "Understand \(listenGoal) spoken lines", why: "Dictation and meaning checks in Listening. Start slow, then try natural speed.",
                                  target: .listening, done: understood >= listenGoal, progress: (min(understood, listenGoal), listenGoal)))
            let reviewGoal = capped(planTargets["review"]?[level] ?? 15, deck.count)
            steps.append(PlanStep(id: "review-\(level)", title: "Learn \(reviewGoal) words in Review", why: "A few minutes of spaced review a day keeps words from slipping away.",
                                  target: .review, done: learned >= reviewGoal, progress: (min(learned, reviewGoal), reviewGoal)))
            for pr in language.writingPrompts where pr.level == level {
                steps.append(PlanStep(id: "write-\(pr.id)", title: "Write: \(pr.prompt)", why: "Aim for \(pr.minWords)+ words; you get feedback and a model answer.",
                                      target: .writing(pr.id), done: (lp.prompts[pr.id]?.best ?? 0) >= promptPass))
            }
            for pr in language.speakingPrompts where pr.level == level {
                steps.append(PlanStep(id: "answer-\(pr.id)", title: "Answer aloud: \(pr.prompt)", why: "Speak freely; your answer is transcribed and checked.",
                                      target: .speaking(answers: true), done: (lp.prompts[pr.id]?.best ?? 0) >= promptPass))
            }
            if language.categories.contains(where: { $0.lessons.contains { $0.level == level } }) {
                let best = lp.checks["drill:level:\(level)"] ?? 0
                steps.append(PlanStep(id: "drill-\(level)", title: "Mixed practice: score \(practicePass)% on a \(level) set",
                                      why: "Ten fresh exercises drawn from every lesson at this level. Each set is different.",
                                      target: .practice("level", level), done: best >= practicePass))
            }
            if level == "A2" && start != "test" {
                steps.append(PlanStep(id: "level-check", title: "Check your level", why: "Take the placement test to see how far you have come.", target: .test, done: !lp.aptitude.isEmpty))
            }
            units.append(PlanUnit(id: "level-\(level)", level: level, title: "\(level) · \(levelNames[level] ?? "")", intro: unitIntros[level] ?? "",
                                  skipped: start == "test" && placedIdx > li, steps: steps))
        }

        var next: PlanStep?
        var nextUnit: PlanUnit?
        var done = 0
        var total = 0
        for u in units where !u.skipped {
            done += u.done
            total += u.steps.count
            if next == nil, let s = u.steps.first(where: { !$0.done }) {
                next = s
                nextUnit = u
            }
        }
        return LearningPlan(start: start, dialect: dialect, units: units, next: next, nextUnit: nextUnit, done: done, total: total, placed: placed)
    }
}
