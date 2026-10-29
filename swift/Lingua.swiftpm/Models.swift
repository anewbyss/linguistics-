import Foundation

// Course content. Field names match content/dist/lingua-content.json (built by scripts/build-content.mjs).

struct Library: Decodable {
    let version: Int
    let levels: [String]
    let levelGuide: [String: LevelGuide]
    let languages: [Language]
}

/// What a CEFR level means (paraphrased from the Council of Europe) and its rough ACTFL equivalent.
struct LevelGuide: Decodable, Hashable {
    let cefr: String
    let actfl: String
}

/// A free outside course or reference from a university or government body.
struct LearningResource: Decodable, Hashable, Identifiable {
    let id: String
    let title: String
    let provider: String
    let providerType: String
    let url: String
    let levels: [String]
    let skills: [String]
    let what: String
    let note: String?

    var levelSpan: String {
        if levels.count == Engine.levels.count { return "All levels" }
        guard let first = levels.first, let last = levels.last else { return "" }
        return first == last ? first : "\(first)–\(last)"
    }
}

struct Language: Decodable, Identifiable {
    let id: String
    let name: String
    let nativeName: String
    let subtitle: String
    let symbol: String
    let dir: String
    let speech: String
    let accent: String
    let translateSkipEn: [String]
    let categories: [Category]
    let reading: Reading
    let scenarios: [Scenario]
    let aptitude: [Question]
    let dictionary: [Phrase]
    let media: [MediaItem]
    let writingPrompts: [PracticePrompt]
    let speakingPrompts: [PracticePrompt]
    let levelHours: [String: Int]
    let resources: [LearningResource]

    var isArabic: Bool { id == "ar" }
    var isRTL: Bool { dir == "rtl" }
    var allLessons: [Lesson] { categories.flatMap { $0.lessons } }

    func category(of lesson: Lesson) -> Category? {
        categories.first { cat in cat.lessons.contains { $0.id == lesson.id } }
    }
}

struct Phrase: Codable, Hashable {
    let t: String
    let tr: String?
    let en: String
    let note: String?

    init(t: String, tr: String? = nil, en: String, note: String? = nil) {
        self.t = t
        self.tr = tr
        self.en = en
        self.note = note
    }
}

struct TableData: Decodable, Hashable {
    let headers: [String]
    let rows: [[String]]
}

struct LessonSection: Decodable, Hashable {
    let title: String
    let body: [String]
    let table: TableData?
}

struct Question: Decodable, Hashable, Identifiable {
    let id: String
    let q: String
    let t: String?
    let options: [String]
    let answer: Int
    let explain: String?
    let level: String?
    let skill: String?

    init(id: String, q: String, t: String? = nil, options: [String], answer: Int, explain: String? = nil, level: String? = nil, skill: String? = nil) {
        self.id = id
        self.q = q
        self.t = t
        self.options = options
        self.answer = answer
        self.explain = explain
        self.level = level
        self.skill = skill
    }
}

struct Lesson: Decodable, Hashable, Identifiable {
    let id: String
    let title: String
    let level: String
    let summary: String
    let grammar: LessonSection
    let vocab: [Phrase]
    let examples: [Phrase]
    let culture: LessonSection
    let quiz: [Question]
}

struct Category: Decodable, Hashable, Identifiable {
    let id: String
    let title: String
    let nativeTitle: String
    let icon: String
    let emoji: String
    let summary: String
    let lessons: [Lesson]
}

struct Letter: Decodable, Hashable, Identifiable {
    let char: String
    let name: String
    let tr: String
    let sound: String
    let example: Phrase
    let connects: Bool?
    let forms: [String]?

    var id: String { char }
}

struct Mark: Decodable, Hashable {
    let symbol: String
    let name: String
    let body: String
    let example: Phrase?
}

struct WritingTask: Decodable, Hashable {
    let en: String
    let answer: String
    let alts: [String]?
    let hint: String?
}

struct Tip: Decodable, Hashable {
    let title: String
    let body: String
}

struct Reading: Decodable {
    let title: String
    let intro: [String]
    let letters: [Letter]
    let marks: [Mark]
    let words: [Phrase]
    let writing: [WritingTask]
    let tips: [Tip]
    let keyboard: [String]?
}

struct Choice: Decodable, Hashable {
    let t: String
    let tr: String?
    let en: String
    let correct: Bool
    let feedback: String
}

struct Step: Decodable, Hashable {
    let speaker: String?
    let line: Phrase?
    let prompt: String?
    let mode: String?
    let choices: [Choice]?

    var isUnderstand: Bool { mode == "understand" }
}

struct Scenario: Decodable, Hashable, Identifiable {
    let id: String
    let title: String
    let level: String
    let emoji: String
    let icon: String
    let setting: String
    let goal: String
    let steps: [Step]
}

struct MediaItem: Decodable, Hashable, Identifiable {
    let level: String
    let type: String
    let title: String
    let creator: String?
    let why: String
    let source: String
    let skills: [String]

    var id: String { title }
}

struct PromptRequirement: Decodable, Hashable {
    let label: String
    let any: [String]
}

/// A free-writing or free-speaking task, checked by Engine.analyzePrompt.
struct PracticePrompt: Decodable, Hashable, Identifiable {
    let id: String
    let level: String
    let prompt: String
    let minWords: Int
    let requirements: [PromptRequirement]
    let model: Phrase
    let starter: String?
}
