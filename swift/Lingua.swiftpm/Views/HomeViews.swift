import SwiftUI
import UIKit

struct LandingView: View {
    @AppStorage(Prefs.quietMode) private var quiet = false
    @EnvironmentObject var content: ContentStore
    @EnvironmentObject var progress: ProgressStore

    var body: some View {
        ScrollView {
            VStack(spacing: 18) {
                VStack(spacing: 8) {
                    HayyaMascot(mood: .cheer, size: 110)
                    Text("Learn Arabic & Mexican Spanish")
                        .font(.largeTitle.bold())
                        .multilineTextAlignment(.center)
                    Text("Grammar and culture lessons, reading and writing practice, real-world conversations, placement tests and an offline translator. Progress saves automatically.")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                }
                .padding(.top, 8)

                HayyaTip(text: content.languages.allSatisfy { progress.lang($0.id).plan.start == nil }
                    ? "Hi, I'm Hayya! New here? Pick a language below and I'll set up a plan for you, starting with the alphabet."
                    : "Hi, I'm Hayya! My colours come from Lyra, a real ball python, and my feathers from Quetzalcóatl, Mexico's feathered serpent. My name is Arabic for “let's go!” (هيّا). Pick a language and I'll coach you all the way to fluency.", mood: .cheer)

                ForEach(content.languages) { lang in
                    NavigationLink(value: Route.language(lang.id)) {
                        LanguageCard(lang: lang, stats: Engine.stats(lang, progress.lang(lang.id)),
                                     fluency: Engine.fluency(lang, progress.lang(lang.id)),
                                     challengeDone: progress.lang(lang.id).challenges[ProgressStore.day(Date())] != nil)
                    }
                    .buttonStyle(.plain)
                }

                HStack(spacing: 12) {
                    if !quiet {
                        StatPill(value: "\(progress.data.xp)", label: "XP earned")
                        StatPill(value: "\(progress.data.streak.count)", label: "day streak")
                    }
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
    let fluency: FluencyReport
    let challengeDone: Bool

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
                Text("\(stats.lessonsDone)/\(stats.lessonsTotal) lessons · \(stats.scenariosDone)/\(stats.scenariosTotal) scenarios · \(stats.percent)% of course")
                    .font(.caption)
                    .foregroundColor(.secondary)
                HStack {
                    Text("Fluency \(fluency.overall)/100 · \(fluency.overallBand)").font(.subheadline.bold())
                    Spacer()
                    Text(challengeDone ? "✓ Daily challenge done" : "⚡ Daily challenge ready")
                        .font(.caption.bold())
                        .foregroundColor(challengeDone ? .green : lang.color)
                }
            }
            .padding()
        }
        .background(Color(uiColor: .secondarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
        .contentShape(Rectangle())
    }
}

struct LanguageHomeView: View {
    @AppStorage(Prefs.quietMode) private var quiet = false
    let lang: Language
    @EnvironmentObject var progress: ProgressStore

    var body: some View {
        let lp = progress.lang(lang.id)
        let stats = Engine.stats(lang, lp)
        let plan = Engine.learningPlan(lang, lp)
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
            }

            Section {
                if plan.needsSetup {
                    WelcomeCard(lang: lang)
                } else {
                    PlanCard(lang: lang, plan: plan)
                }
            }

            Section("Today") {
                let todayRecord = lp.challenges[ProgressStore.day(Date())]
                NavigationLink(value: Route.challenge(lang.id)) {
                    MenuRow(emoji: "⚡", title: "Daily Challenge",
                            detail: (todayRecord.map { "Done today: \($0.score)/\($0.total)" } ?? "10 quick items: reading, writing, listening, speaking")
                                + (quiet ? "" : " · 🔥 \(Engine.challengeStreak(lp))-day streak"))
                }
                NavigationLink(value: Route.fluency(lang.id)) {
                    FluencySummaryRow(lang: lang, report: Engine.fluency(lang, lp))
                }
            }

            Section {
                NavigationLink(value: Route.plan(lang.id)) {
                    MenuRow(emoji: "🧭", title: "Learning plan", detail: "Every step in the recommended order · \(plan.done)/\(plan.total) done")
                }
                NavigationLink(value: Route.reading(lang.id)) {
                    MenuRow(emoji: lang.isArabic ? "ع" : "🔤", title: lang.isArabic ? "The alphabet" : "Alphabet & pronunciation",
                            detail: "\(stats.lettersDone)/\(stats.lettersTotal) letters · \(stats.writingDone)/\(stats.writingTotal) written")
                }
                NavigationLink(value: Route.aptitude(lang.id)) {
                    MenuRow(emoji: "🎯", title: "Placement test", detail: stats.level.map { "Last result: \($0)" } ?? "Already know some? Find your level (A1–B2)")
                }
            } header: {
                Text("1 · Start here")
            } footer: {
                Text("New learners begin with the alphabet; the learning plan takes you through everything else in order.")
            }

            Section {
                let srs = Engine.srsStats(lang, lp, day: ProgressStore.day(Date()))
                NavigationLink(value: Route.review(lang.id)) {
                    MenuRow(emoji: "🔁", title: "Review", detail: "\(srs.due) due · \(srs.newAvailable) new · \(srs.learned)/\(srs.total) words learned")
                }
                NavigationLink(value: Route.speaking(lang.id)) {
                    MenuRow(emoji: "🎙️", title: "Speaking Practice", detail: "Repeat phrases and answer questions out loud")
                }
                NavigationLink(value: Route.listening(lang.id)) {
                    MenuRow(emoji: "🎧", title: "Listening", detail: "Dictation and meaning checks at three speeds")
                }
                NavigationLink(value: Route.scenarios(lang.id)) {
                    MenuRow(emoji: "🎭", title: "Real-World Scenarios", detail: "\(stats.scenariosDone)/\(stats.scenariosTotal) completed")
                }
                NavigationLink(value: Route.translator(lang.id)) {
                    MenuRow(emoji: "🔄", title: "Offline Translator", detail: "\(lang.dictionary.count) entries, no internet needed")
                }
            } header: {
                Text("2 · Practise")
            } footer: {
                Text("Use these alongside your lessons, a little every day.")
            }

            Section {
                NavigationLink(value: Route.writing(lang.id)) {
                    MenuRow(emoji: "📝", title: "Writing Studio", detail: "\(lang.writingPrompts.count) free-writing prompts with feedback")
                }
                NavigationLink(value: Route.media(lang.id)) {
                    MenuRow(emoji: "🎬", title: "Media Picks", detail: "Films, shows, books and music by level")
                }
                NavigationLink(value: Route.resources(lang.id)) {
                    MenuRow(emoji: "🏛️", title: "Free Courses & Resources", detail: "From universities and government bodies, by level")
                }
            } header: {
                Text("3 · Go further")
            } footer: {
                Text("Best from A2 onwards: free writing, real media and outside courses.")
            }

            // Lesson categories grouped by the level of their first lesson, easiest first.
            ForEach(Array(Engine.levels.enumerated()), id: \.offset) { i, level in
                let group = lang.categories.filter { cat in (cat.lessons.map { Engine.levelIndex($0.level) }.min() ?? 0) == i }
                if !group.isEmpty {
                    Section("Lessons · \(level) \(Engine.levelNames[level] ?? "")") {
                        ForEach(group) { cat in
                            let done = cat.lessons.filter { lp.lessons[$0.id]?.done == true }.count
                            let levels = Array(Set(cat.lessons.map(\.level))).sorted().joined(separator: "–")
                            NavigationLink(value: Route.category(lang.id, cat.id)) {
                                MenuRow(emoji: cat.emoji, title: cat.title, detail: "\(cat.nativeTitle) · \(levels) · \(done)/\(cat.lessons.count) done")
                            }
                        }
                    }
                }
            }
        }
        .navigationTitle(lang.name)
        .tint(lang.color)
        .onAppear { progress.refreshFluency(lang) }
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
                        progress.update(lang, xp: correct * 10 + (first ? 20 : 0)) { lp in
                            let best = max(score, lp.lessons[lesson.id]?.best ?? 0)
                            lp.lessons[lesson.id] = LessonRecord(best: best, done: true, at: ProgressStore.isoNow())
                            lp.logPractice("reading", score)
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
                ReportMistakeLink(subject: "\(lesson.id) (\(lesson.title))")
                    .frame(maxWidth: .infinity)
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
