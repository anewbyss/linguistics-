import SwiftUI

// Progress uses the same JSON shape as the web app (see sanitizeProgress in web/js/engine.js),
// so a backup exported from either app can be imported into the other.

struct LessonRecord: Codable, Hashable {
    var best: Int
    var done: Bool
    var at: String?

    init(best: Int, done: Bool, at: String?) {
        self.best = best
        self.done = done
        self.at = at
    }

    enum CodingKeys: String, CodingKey { case best, done, at }

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        best = min(100, max(0, (try? c.decodeIfPresent(Int.self, forKey: .best)) ?? 0))
        done = (try? c.decodeIfPresent(Bool.self, forKey: .done)) ?? false
        at = try? c.decodeIfPresent(String.self, forKey: .at)
    }
}

struct ScenarioRecord: Codable, Hashable {
    var best: Int
    var at: String?

    init(best: Int, at: String?) {
        self.best = best
        self.at = at
    }

    enum CodingKeys: String, CodingKey { case best, at }

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        best = min(100, max(0, (try? c.decodeIfPresent(Int.self, forKey: .best)) ?? 0))
        at = try? c.decodeIfPresent(String.self, forKey: .at)
    }
}

struct AptitudeRecord: Codable, Hashable {
    var at: String?
    var level: String
    var score: Int
    var total: Int
    var bySkill: [String: SkillScore]

    init(at: String?, level: String, score: Int, total: Int, bySkill: [String: SkillScore]) {
        self.at = at
        self.level = level
        self.score = score
        self.total = total
        self.bySkill = bySkill
    }

    enum CodingKeys: String, CodingKey { case at, level, score, total, bySkill }

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        at = try? c.decodeIfPresent(String.self, forKey: .at)
        let lv = (try? c.decodeIfPresent(String.self, forKey: .level)) ?? "A1"
        level = Engine.levels.contains(lv) ? lv : "A1"
        score = (try? c.decodeIfPresent(Int.self, forKey: .score)) ?? 0
        total = (try? c.decodeIfPresent(Int.self, forKey: .total)) ?? 0
        bySkill = (try? c.decodeIfPresent([String: SkillScore].self, forKey: .bySkill)) ?? [:]
    }
}

struct SpeakRecord: Codable, Hashable {
    var best: Int
    var selfChecked: Bool?

    init(best: Int, selfChecked: Bool? = nil) {
        self.best = best
        self.selfChecked = selfChecked
    }

    enum CodingKeys: String, CodingKey {
        case best
        case selfChecked = "self"
    }

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        best = min(100, max(0, (try? c.decodeIfPresent(Int.self, forKey: .best)) ?? 0))
        selfChecked = (try? c.decodeIfPresent(Bool.self, forKey: .selfChecked)) == true ? true : nil
    }
}

/// Recent scored results per skill (0–100); drives the accuracy half of fluency.
struct PracticeLog: Codable, Hashable {
    var reading: [Int] = []
    var writing: [Int] = []
    var speaking: [Int] = []

    init() {}

    enum CodingKeys: String, CodingKey { case reading, writing, speaking }

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        func load(_ key: CodingKeys) -> [Int] {
            Array(((try? c.decodeIfPresent([Int].self, forKey: key)) ?? []).map { min(100, max(0, $0)) }.suffix(30))
        }
        reading = load(.reading)
        writing = load(.writing)
        speaking = load(.speaking)
    }

    func list(_ skill: String) -> [Int] {
        switch skill {
        case "reading": return reading
        case "writing": return writing
        default: return speaking
        }
    }

    mutating func log(_ skill: String, _ pct: Int) {
        let v = min(100, max(0, pct))
        switch skill {
        case "reading": reading = Array((reading + [v]).suffix(30))
        case "writing": writing = Array((writing + [v]).suffix(30))
        case "speaking": speaking = Array((speaking + [v]).suffix(30))
        default: break
        }
    }
}

struct ChallengeRecord: Codable, Hashable {
    var score: Int
    var total: Int
    var bySkill: [String: SkillScore]

    init(score: Int, total: Int, bySkill: [String: SkillScore]) {
        self.score = score
        self.total = total
        self.bySkill = bySkill
    }

    enum CodingKeys: String, CodingKey { case score, total, bySkill }

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        score = max(0, (try? c.decodeIfPresent(Int.self, forKey: .score)) ?? 0)
        total = max(0, (try? c.decodeIfPresent(Int.self, forKey: .total)) ?? 0)
        bySkill = (try? c.decodeIfPresent([String: SkillScore].self, forKey: .bySkill)) ?? [:]
    }
}

struct FluencySnapshot: Codable, Hashable {
    var day: String
    var reading: Int
    var writing: Int
    var speaking: Int
    var overall: Int
}

struct Streak: Codable, Hashable {
    var count: Int = 0
    var last: String?
}

struct LangProgress: Codable {
    var lessons: [String: LessonRecord] = [:]
    var scenarios: [String: ScenarioRecord] = [:]
    var aptitude: [AptitudeRecord] = []
    var letters: [String: Int] = [:]
    var writing: [String: Bool] = [:]
    var saved: [Phrase] = []
    var lastVisit: String?
    var tracing: [String: Int] = [:]
    var speaking: [String: SpeakRecord] = [:]
    var practice = PracticeLog()
    var challenges: [String: ChallengeRecord] = [:]
    var fluency: [FluencySnapshot] = []

    init() {}

    enum CodingKeys: String, CodingKey {
        case lessons, scenarios, aptitude, letters, writing, saved, lastVisit
        case tracing, speaking, practice, challenges, fluency
    }

    mutating func logPractice(_ skill: String, _ pct: Int) {
        practice.log(skill, pct)
    }

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        lessons = (try? c.decodeIfPresent([String: LessonRecord].self, forKey: .lessons)) ?? [:]
        scenarios = (try? c.decodeIfPresent([String: ScenarioRecord].self, forKey: .scenarios)) ?? [:]
        aptitude = Array(((try? c.decodeIfPresent([AptitudeRecord].self, forKey: .aptitude)) ?? []).suffix(20))
        letters = (try? c.decodeIfPresent([String: Int].self, forKey: .letters)) ?? [:]
        writing = (try? c.decodeIfPresent([String: Bool].self, forKey: .writing)) ?? [:]
        saved = Array(((try? c.decodeIfPresent([Phrase].self, forKey: .saved)) ?? []).prefix(500))
        lastVisit = try? c.decodeIfPresent(String.self, forKey: .lastVisit)
        tracing = (try? c.decodeIfPresent([String: Int].self, forKey: .tracing)) ?? [:]
        speaking = (try? c.decodeIfPresent([String: SpeakRecord].self, forKey: .speaking)) ?? [:]
        practice = (try? c.decodeIfPresent(PracticeLog.self, forKey: .practice)) ?? PracticeLog()
        challenges = (try? c.decodeIfPresent([String: ChallengeRecord].self, forKey: .challenges)) ?? [:]
        fluency = Array(((try? c.decodeIfPresent([FluencySnapshot].self, forKey: .fluency)) ?? []).suffix(180))
    }
}

struct ProgressData: Codable {
    var version: Int = 1
    var xp: Int = 0
    var streak = Streak()
    var languages: [String: LangProgress] = ["ar": LangProgress(), "es": LangProgress()]
    var updatedAt: String?

    init() {}

    enum CodingKeys: String, CodingKey { case version, xp, streak, languages, updatedAt }

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        version = (try? c.decodeIfPresent(Int.self, forKey: .version)) ?? 1
        xp = max(0, (try? c.decodeIfPresent(Int.self, forKey: .xp)) ?? 0)
        streak = (try? c.decodeIfPresent(Streak.self, forKey: .streak)) ?? Streak()
        guard let langs = try c.decodeIfPresent([String: LangProgress].self, forKey: .languages) else {
            throw DecodingError.keyNotFound(CodingKeys.languages, .init(codingPath: c.codingPath, debugDescription: "Not a Lingua backup"))
        }
        languages = langs
        for id in ["ar", "es"] where languages[id] == nil { languages[id] = LangProgress() }
        updatedAt = try? c.decodeIfPresent(String.self, forKey: .updatedAt)
    }
}

/// Saves progress to Application Support after every change.
final class ProgressStore: ObservableObject {
    @Published private(set) var data: ProgressData
    @Published private(set) var lastSaveError: String?

    private let fileURL: URL

    init() {
        let dir = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
        try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
        fileURL = dir.appendingPathComponent("lingua-progress.json")
        if let raw = try? Data(contentsOf: fileURL), let decoded = try? JSONDecoder().decode(ProgressData.self, from: raw) {
            data = decoded
        } else {
            data = ProgressData()
        }
    }

    func lang(_ id: String) -> LangProgress {
        data.languages[id] ?? LangProgress()
    }

    /// Applies a change to one language's progress, refreshes today's fluency snapshot, awards XP and saves.
    func update(_ language: Language, xp: Int = 0, _ change: (inout LangProgress) -> Void) {
        var lp = data.languages[language.id] ?? LangProgress()
        change(&lp)
        Engine.recordFluency(language, &lp)
        data.languages[language.id] = lp
        if xp > 0 {
            data.xp += xp
            touchStreak()
        }
        save()
    }

    /// Saves a speaking attempt. Self-checks count as practice for coverage but never change accuracy.
    func recordSpeaking(_ language: Language, phrase: String, score: Int, selfChecked: Bool) {
        let prev = lang(language.id).speaking[phrase]
        let firstPass = (prev?.best ?? 0) < Engine.speakPass && score >= Engine.speakPass
        update(language, xp: firstPass ? 3 : 0) { lp in
            let prevBest = prev?.best ?? 0
            let prevSelf = prev?.selfChecked == true
            if prev == nil || score > prevBest || (prevSelf && !selfChecked) {
                lp.speaking[phrase] = selfChecked
                    ? SpeakRecord(best: max(score, prevBest), selfChecked: true)
                    : SpeakRecord(best: max(score, prevSelf ? 0 : prevBest))
            }
            if !selfChecked { lp.logPractice("speaking", score) }
        }
    }

    /// Records today's fluency snapshot without changing anything else.
    func refreshFluency(_ language: Language) {
        update(language) { _ in }
    }

    func touchStreak(now: Date = Date()) {
        let today = Self.day(now)
        if data.streak.last == today { return }
        let yesterday = Calendar.current.date(byAdding: .day, value: -1, to: now).map(Self.day)
        data.streak.count = data.streak.last == yesterday ? data.streak.count + 1 : 1
        data.streak.last = today
    }

    func save() {
        data.updatedAt = Self.isoNow()
        do {
            let encoder = JSONEncoder()
            encoder.outputFormatting = [.sortedKeys]
            try encoder.encode(data).write(to: fileURL, options: .atomic)
            lastSaveError = nil
        } catch {
            lastSaveError = error.localizedDescription
        }
    }

    func exportJSON() -> String {
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        guard let raw = try? encoder.encode(data), let text = String(data: raw, encoding: .utf8) else { return "{}" }
        return text
    }

    func importJSON(_ text: String) throws {
        let decoded = try JSONDecoder().decode(ProgressData.self, from: Data(text.utf8))
        data = decoded
        save()
    }

    func reset() {
        data = ProgressData()
        save()
    }

    // MARK: Dates

    static func day(_ date: Date) -> String {
        let f = DateFormatter()
        f.calendar = Calendar(identifier: .gregorian)
        f.locale = Locale(identifier: "en_US_POSIX")
        f.timeZone = .current
        f.dateFormat = "yyyy-MM-dd"
        return f.string(from: date)
    }

    static func isoNow() -> String {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return f.string(from: Date())
    }

    static func parseISO(_ s: String?) -> Date? {
        guard let s = s else { return nil }
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        if let d = f.date(from: s) { return d }
        f.formatOptions = [.withInternetDateTime]
        return f.date(from: s)
    }
}
