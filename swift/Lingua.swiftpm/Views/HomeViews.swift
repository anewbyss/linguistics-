import SwiftUI
import UIKit

struct LandingView: View {
    @EnvironmentObject var content: ContentStore
    @EnvironmentObject var progress: ProgressStore

    var body: some View {
        ScrollView {
            VStack(spacing: 18) {
                VStack(spacing: 8) {
                    Text("Learn Arabic & Mexican Spanish")
                        .font(.largeTitle.bold())
                        .multilineTextAlignment(.center)
                    Text("Grammar and culture lessons, reading and writing practice, real-world conversations, placement tests and an offline translator. Progress saves automatically.")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                }
                .padding(.top, 8)

                ForEach(content.languages) { lang in
                    NavigationLink(value: Route.language(lang.id)) {
                        LanguageCard(lang: lang, stats: Engine.stats(lang, progress.lang(lang.id)))
                    }
                    .buttonStyle(.plain)
                }

                HStack(spacing: 12) {
                    StatPill(value: "\(progress.data.xp)", label: "XP earned")
                    StatPill(value: "\(progress.data.streak.count)", label: "day streak")
                }

                NavigationLink(value: Route.progress) {
                    Label("Progress & backup", systemImage: "externaldrive")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.bordered)

                Text("Everything runs on your device and works offline.")
                    .font(.footnote)
                    .foregroundColor(.secondary)
            }
            .padding()
            .frame(maxWidth: 760)
            .frame(maxWidth: .infinity)
        }
        .background(Color(uiColor: .systemGroupedBackground))
        .navigationTitle("Lingua")
        .navigationBarTitleDisplayMode(.inline)
    }
}

struct LanguageCard: View {
    let lang: Language
    let stats: LanguageStats

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            ZStack {
                LinearGradient(colors: [lang.color, lang.color.opacity(0.65)], startPoint: .topLeading, endPoint: .bottomTrailing)
                Text(lang.symbol)
                    .font(.system(size: 64, weight: .medium))
                    .foregroundColor(.white)
            }
            .frame(height: 120)

            VStack(alignment: .leading, spacing: 6) {
                HStack {
                    Text(lang.name).font(.title2.bold())
                    Spacer()
                    if let level = stats.level {
                        LevelBadge(level: level, color: lang.color)
                    } else {
                        Text("Not tested yet").font(.caption).foregroundColor(.secondary)
                    }
                }
                Text(lang.nativeName).font(.title3).foregroundColor(.secondary)
                Text(lang.subtitle).font(.subheadline).foregroundColor(.secondary)
                ProgressView(value: Double(stats.percent), total: 100).tint(lang.color)
                Text("\(stats.lessonsDone)/\(stats.lessonsTotal) lessons · \(stats.scenariosDone)/\(stats.scenariosTotal) scenarios · \(stats.percent)%")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            .padding()
        }
        .background(Color(uiColor: .secondarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
        .contentShape(Rectangle())
    }
}

struct LanguageHomeView: View {
    let lang: Language
    @EnvironmentObject var progress: ProgressStore

    private var nextLesson: Lesson? {
        let lp = progress.lang(lang.id)
        let undone = lang.allLessons.filter { lp.lessons[$0.id]?.done != true }
        if let placed = lp.aptitude.last?.level, let placedIdx = Engine.levels.firstIndex(of: placed) {
            let target = min(placedIdx, 3)
            if let match = undone.first(where: { (Engine.levels.firstIndex(of: $0.level) ?? 0) >= target }) { return match }
        }
        return undone.first
    }

    var body: some View {
        let lp = progress.lang(lang.id)
        let stats = Engine.stats(lang, lp)
        List {
            Section {
                VStack(alignment: .leading, spacing: 8) {
                    Text(lang.nativeName).font(.title2)
                    if let level = stats.level {
                        Text("Level \(level) · \(Engine.levelNames[level] ?? "")").font(.subheadline.bold())
                    }
                    ProgressView(value: Double(stats.percent), total: 100).tint(lang.color)
                    Text("\(stats.percent)% of the course complete").font(.caption).foregroundColor(.secondary)
                }
                .padding(.vertical, 4)
                if let next = nextLesson {
                    NavigationLink(value: Route.lesson(lang.id, next.id)) {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Continue learning").font(.caption).foregroundColor(.secondary)
                            Text("\(lang.category(of: next)?.emoji ?? "") \(next.title)").font(.headline)
                            Text(next.summary).font(.caption).foregroundColor(.secondary)
                        }
                    }
                }
            }

            Section("Practice") {
                NavigationLink(value: Route.reading(lang.id)) {
                    MenuRow(emoji: lang.isArabic ? "ع" : "✍️", title: "Reading & Writing",
                            detail: "\(stats.lettersDone)/\(stats.lettersTotal) letters · \(stats.writingDone)/\(stats.writingTotal) written")
                }
                NavigationLink(value: Route.scenarios(lang.id)) {
                    MenuRow(emoji: "🎭", title: "Real-World Scenarios", detail: "\(stats.scenariosDone)/\(stats.scenariosTotal) completed")
                }
                NavigationLink(value: Route.translator(lang.id)) {
                    MenuRow(emoji: "🔄", title: "Offline Translator", detail: "\(lang.dictionary.count) entries, no internet needed")
                }
                NavigationLink(value: Route.aptitude(lang.id)) {
                    MenuRow(emoji: "🎯", title: "Aptitude Test", detail: stats.level.map { "Last result: \($0)" } ?? "Find your level (A1–C1)")
                }
                NavigationLink(value: Route.media(lang.id)) {
                    MenuRow(emoji: "🎬", title: "Media Picks", detail: "Films, shows, books and music by level")
                }
            }

            Section("Lessons: grammar & culture") {
                ForEach(lang.categories) { cat in
                    let done = cat.lessons.filter { lp.lessons[$0.id]?.done == true }.count
                    NavigationLink(value: Route.category(lang.id, cat.id)) {
                        MenuRow(emoji: cat.emoji, title: cat.title, detail: "\(cat.nativeTitle) · \(done)/\(cat.lessons.count) done")
                    }
                }
            }
        }
        .navigationTitle(lang.name)
        .tint(lang.color)
    }
}

struct MenuRow: View {
    let emoji: String
    let title: String
    let detail: String

    var body: some View {
        HStack(spacing: 12) {
            Text(emoji).font(.title2).frame(width: 36)
            VStack(alignment: .leading, spacing: 2) {
                Text(title).font(.body.weight(.semibold))
                Text(detail).font(.caption).foregroundColor(.secondary)
            }
        }
        .padding(.vertical, 2)
    }
}

struct CategoryView: View {
    let lang: Language
    let category: Category
    @EnvironmentObject var progress: ProgressStore

    var body: some View {
        let lp = progress.lang(lang.id)
        List {
            Section {
                VStack(alignment: .leading, spacing: 4) {
                    Text(category.nativeTitle).font(.title3)
                    Text(category.summary).font(.subheadline).foregroundColor(.secondary)
                }
            }
            Section("Lessons") {
                ForEach(category.lessons) { lesson in
                    NavigationLink(value: Route.lesson(lang.id, lesson.id)) {
                        HStack {
                            VStack(alignment: .leading, spacing: 2) {
                                Text(lesson.title).font(.body.weight(.semibold))
                                Text(lesson.summary).font(.caption).foregroundColor(.secondary)
                            }
                            Spacer()
                            if let rec = lp.lessons[lesson.id], rec.done {
                                Text("✓ \(rec.best)%").font(.caption.bold()).foregroundColor(.green)
                            }
                            LevelBadge(level: lesson.level, color: lang.color)
                        }
                    }
                }
            }
        }
        .navigationTitle("\(category.emoji) \(category.title)")
        .tint(lang.color)
    }
}

struct LessonView: View {
    let lang: Language
    let lesson: Lesson
    @EnvironmentObject var progress: ProgressStore

    private var nextLesson: Lesson? {
        let all = lang.allLessons
        guard let i = all.firstIndex(where: { $0.id == lesson.id }), i + 1 < all.count else { return nil }
        return all[i + 1]
    }

    var body: some View {
        let record = progress.lang(lang.id).lessons[lesson.id]
        ScrollView {
            VStack(alignment: .leading, spacing: 14) {
                HStack {
                    LevelBadge(level: lesson.level, color: lang.color)
                    if let rec = record, rec.done {
                        Text("✓ Completed · best \(rec.best)%").font(.caption.bold()).foregroundColor(.green)
                    }
                }
                Text(lesson.summary).foregroundColor(.secondary)

                VStack(alignment: .leading, spacing: 10) {
                    SectionHeader(icon: "📐", title: "Grammar: \(lesson.grammar.title)")
                    ForEach(lesson.grammar.body, id: \.self) { Text($0) }
                    if let table = lesson.grammar.table { TableView(table: table) }
                }
                .card()

                VStack(alignment: .leading, spacing: 10) {
                    SectionHeader(icon: "🗂️", title: "Key vocabulary")
                    ForEach(lesson.vocab, id: \.self) { PhraseRow(phrase: $0, lang: lang) }
                }
                .card()

                VStack(alignment: .leading, spacing: 10) {
                    SectionHeader(icon: "💬", title: "In context")
                    ForEach(lesson.examples, id: \.self) { PhraseRow(phrase: $0, lang: lang) }
                }
                .card()

                VStack(alignment: .leading, spacing: 10) {
                    SectionHeader(icon: "🌍", title: "Culture: \(lesson.culture.title)")
                    ForEach(lesson.culture.body, id: \.self) { Text($0) }
                }
                .card()
                .overlay(alignment: .leading) {
                    Rectangle().fill(lang.color).frame(width: 4).clipShape(Capsule())
                }

                VStack(alignment: .leading, spacing: 10) {
                    SectionHeader(icon: "✅", title: "Check yourself")
                    QuizView(questions: lesson.quiz, mode: .practice, lang: lang) { correct, _ in
                        let score = Engine.percent(correct, lesson.quiz.count)
                        let first = record?.done != true
                        progress.update(lang.id, xp: correct * 10 + (first ? 20 : 0)) { lp in
                            let best = max(score, lp.lessons[lesson.id]?.best ?? 0)
                            lp.lessons[lesson.id] = LessonRecord(best: best, done: true, at: ProgressStore.isoNow())
                        }
                    }
                }
                .card()

                if let next = nextLesson {
                    NavigationLink(value: Route.lesson(lang.id, next.id)) {
                        Label("Next: \(next.title)", systemImage: "arrow.right.circle.fill")
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(lang.color)
                }
            }
            .padding()
            .frame(maxWidth: 760)
            .frame(maxWidth: .infinity)
        }
        .background(Color(uiColor: .systemGroupedBackground))
        .navigationTitle(lesson.title)
        .navigationBarTitleDisplayMode(.inline)
        .tint(lang.color)
    }
}
