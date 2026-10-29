import SwiftUI
import UIKit

// MARK: - Scenarios

struct ScenarioListView: View {
    let lang: Language
    @EnvironmentObject var progress: ProgressStore

    var body: some View {
        let lp = progress.lang(lang.id)
        List {
            Section {
                Text("Role-play everyday situations. Choose what you'd say. If you get it wrong, you'll get feedback and can try again. You score points for answers you get right first time.")
                    .font(.subheadline).foregroundColor(.secondary)
            }
            ForEach(lang.scenarios) { s in
                NavigationLink(value: Route.scenario(lang.id, s.id)) {
                    HStack(alignment: .top, spacing: 12) {
                        Text(s.emoji).font(.largeTitle)
                        VStack(alignment: .leading, spacing: 3) {
                            Text(s.title).font(.headline)
                            Text(s.setting).font(.caption).foregroundColor(.secondary)
                            HStack {
                                LevelBadge(level: s.level, color: lang.color)
                                if let rec = lp.scenarios[s.id] {
                                    Text("Best \(rec.best)%").font(.caption.bold()).foregroundColor(.green)
                                }
                            }
                        }
                    }
                }
            }
        }
        .navigationTitle("Real-World Scenarios")
        .tint(lang.color)
    }
}

private struct Bubble: Identifiable {
    let id = UUID()
    let who: String
    let phrase: Phrase
    let mine: Bool
    let feedback: String?
}

struct ScenarioPlayView: View {
    @AppStorage(Prefs.showTransliteration) private var showTr = true
    let lang: Language
    let scenario: Scenario
    @EnvironmentObject var progress: ProgressStore

    @State private var step = 0
    @State private var log: [Bubble] = []
    @State private var tried: [Int] = []
    @State private var resolved: Int?
    @State private var firstTry = 0
    @State private var finished = false
    @State private var showEnglish = false

    private var choiceSteps: Int { scenario.steps.filter { $0.choices != nil }.count }

    var body: some View {
        ScrollViewReader { proxy in
            ScrollView {
                VStack(alignment: .leading, spacing: 12) {
                    VStack(alignment: .leading, spacing: 6) {
                        HStack {
                            Text("\(scenario.emoji) \(scenario.setting)").font(.subheadline)
                            Spacer()
                            LevelBadge(level: scenario.level, color: lang.color)
                        }
                        Text("Goal: ").bold() + Text(scenario.goal)
                        Toggle("Show English translations", isOn: $showEnglish).font(.subheadline)
                    }
                    .card()

                    ForEach(log) { b in bubbleView(b) }

                    if finished {
                        summary
                    } else {
                        currentStep(scenario.steps[step])
                    }
                    Color.clear.frame(height: 1).id("bottom")
                }
                .padding()
                .frame(maxWidth: 760)
                .frame(maxWidth: .infinity)
            }
            .onChange(of: log.count) { _ in
                withAnimation { proxy.scrollTo("bottom", anchor: .bottom) }
            }
        }
        .background(Color(uiColor: .systemGroupedBackground))
        .navigationTitle(scenario.title)
        .navigationBarTitleDisplayMode(.inline)
        .tint(lang.color)
    }

    private func bubbleView(_ b: Bubble) -> some View {
        HStack {
            if b.mine { Spacer(minLength: 40) }
            VStack(alignment: .leading, spacing: 3) {
                Text(b.who).font(.caption2).foregroundColor(b.mine ? .white.opacity(0.85) : .secondary)
                if !b.phrase.t.isEmpty {
                    HStack {
                        Text(b.phrase.t).font(.system(size: lang.isArabic ? 22 : 18))
                        if !b.mine { SpeakButton(text: b.phrase.t, lang: lang) }
                    }
                }
                if let tr = b.phrase.tr, !tr.isEmpty {
                    Text(tr).font(.caption.italic()).foregroundColor(b.mine ? .white.opacity(0.9) : lang.color)
                }
                if showEnglish || b.mine || b.phrase.t.isEmpty {
                    Text(b.phrase.en).font(.caption)
                }
                if let note = b.phrase.note, showEnglish {
                    Text("💡 \(note)").font(.caption2)
                }
                if let fb = b.feedback {
                    Text("✓ \(fb)").font(.caption2)
                }
            }
            .padding(10)
            .foregroundColor(b.mine ? .white : .primary)
            .background(RoundedRectangle(cornerRadius: 16).fill(b.mine ? lang.color : Color(uiColor: .secondarySystemGroupedBackground)))
            if !b.mine { Spacer(minLength: 40) }
        }
    }

    @ViewBuilder
    private func currentStep(_ st: Step) -> some View {
        if let line = st.line {
            bubbleView(Bubble(who: st.speaker ?? "", phrase: line, mine: false, feedback: nil))
        }
        if let choices = st.choices {
            if let r = resolved {
                let c = choices[r]
                if st.isUnderstand {
                    Text("✓ \(c.en)\n\(c.feedback)").font(.subheadline).foregroundColor(.green).card()
                } else {
                    bubbleView(Bubble(who: "You", phrase: Phrase(t: c.t, tr: c.tr, en: c.en), mine: true, feedback: c.feedback))
                }
                continueButton
            } else {
                Text("\(st.isUnderstand ? "👂" : "🗣️") \(st.prompt ?? "What do you say?")").font(.headline)
                ForEach(Array(choices.enumerated()), id: \.offset) { i, c in
                    Button {
                        pick(i, choices)
                    } label: {
                        VStack(alignment: .leading, spacing: 2) {
                            if st.isUnderstand {
                                Text(c.en)
                            } else {
                                Text(c.t).font(.system(size: lang.isArabic ? 21 : 17))
                                if showTr, let tr = c.tr { Text(tr).font(.caption.italic()).foregroundColor(.secondary) }
                                if showEnglish { Text(c.en).font(.caption).foregroundColor(.secondary) }
                            }
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(12)
                        .background(RoundedRectangle(cornerRadius: 12).fill(tried.contains(i) ? Color.red.opacity(0.12) : Color(uiColor: .secondarySystemGroupedBackground)))
                    }
                    .buttonStyle(.plain)
                    .disabled(tried.contains(i))
                }
                if let last = tried.last {
                    Text("✗ \(choices[last].feedback)").font(.subheadline).foregroundColor(.red)
                }
            }
        } else {
            if let prompt = st.prompt { Text(prompt).font(.headline) }
            continueButton
        }
    }

    private var continueButton: some View {
        Button("Continue →") { advance() }
            .buttonStyle(.borderedProminent)
            .tint(lang.color)
    }

    private var summary: some View {
        VStack(spacing: 8) {
            Text("\(Engine.percent(firstTry, choiceSteps))%")
                .font(.system(size: 48, weight: .bold))
                .foregroundColor(lang.color)
            Text("You answered \(firstTry) of \(choiceSteps) correctly on your first try.")
                .multilineTextAlignment(.center)
            Button("Play again") { restart() }.buttonStyle(.bordered)
        }
        .frame(maxWidth: .infinity)
        .card()
    }

    private func pick(_ i: Int, _ choices: [Choice]) {
        if choices[i].correct {
            if tried.isEmpty { firstTry += 1 }
            resolved = i
        } else if !tried.contains(i) {
            tried.append(i)
        }
    }

    private func advance() {
        let st = scenario.steps[step]
        if let line = st.line {
            log.append(Bubble(who: st.speaker ?? "", phrase: line, mine: false, feedback: nil))
        }
        if let choices = st.choices, let r = resolved {
            let c = choices[r]
            if st.isUnderstand {
                log.append(Bubble(who: "You understood", phrase: Phrase(t: "", en: c.en), mine: true, feedback: c.feedback))
            } else {
                log.append(Bubble(who: "You", phrase: Phrase(t: c.t, tr: c.tr, en: c.en), mine: true, feedback: c.feedback))
            }
        }
        tried = []
        resolved = nil
        if step + 1 < scenario.steps.count {
            step += 1
        } else {
            finished = true
            let score = Engine.percent(firstTry, choiceSteps)
            let first = progress.lang(lang.id).scenarios[scenario.id] == nil
            let sid = scenario.id
            progress.update(lang, xp: firstTry * 5 + (first ? 15 : 0)) { lp in
                let best = max(score, lp.scenarios[sid]?.best ?? 0)
                lp.scenarios[sid] = ScenarioRecord(best: best, at: ProgressStore.isoNow())
                lp.logPractice("speaking", score)
            }
        }
    }

    private func restart() {
        step = 0
        log = []
        tried = []
        resolved = nil
        firstTry = 0
        finished = false
    }
}

// MARK: - Translator

struct TranslatorView: View {
    let lang: Language
    @EnvironmentObject var content: ContentStore
    @EnvironmentObject var progress: ProgressStore
    @State private var text = ""
    @State private var mode = "auto"

    var body: some View {
        let index = content.index(for: lang)
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        let direction: TranslateDirection = mode == "auto"
            ? Engine.detectDirection(trimmed, language: lang, index: index)
            : (TranslateDirection(rawValue: mode) ?? .toEn)
        let result = Engine.translate(trimmed, language: lang, direction: direction, index: index)
        let saved = progress.lang(lang.id).saved

        ScrollView {
            VStack(alignment: .leading, spacing: 14) {
                VStack(alignment: .leading, spacing: 10) {
                    Text("Looks up phrases first, then translates word by word from the built-in dictionary of \(lang.dictionary.count) entries. Grammar isn't rearranged, so treat the result as a guide. Works offline.")
                        .font(.caption).foregroundColor(.secondary)
                    Picker("Direction", selection: $mode) {
                        Text("Auto").tag("auto")
                        Text("\(lang.isArabic ? "Arabic" : "Spanish") → EN").tag(TranslateDirection.toEn.rawValue)
                        Text("EN → \(lang.isArabic ? "Arabic" : "Spanish")").tag(TranslateDirection.fromEn.rawValue)
                    }
                    .pickerStyle(.segmented)
                    TextField("Type in English or \(lang.name)…", text: $text, axis: .vertical)
                        .lineLimit(2...5)
                        .font(.system(size: Engine.hasArabic(text) ? 24 : 18))
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled()
                        .padding(10)
                        .background(RoundedRectangle(cornerRadius: 12).fill(Color(uiColor: .tertiarySystemFill)))
                    if let keys = lang.reading.keyboard { KeyPad(keys: keys, lang: lang, text: $text) }
                }
                .card()

                if !trimmed.isEmpty {
                    resultCard(result, direction: direction, saved: saved)
                }

                VStack(alignment: .leading, spacing: 8) {
                    SectionHeader(icon: "📖", title: "Phrasebook")
                    ForEach(lang.dictionary.filter { $0.t.contains(" ") }.prefix(18), id: \.self) { entry in
                        Button {
                            text = entry.t
                            mode = "auto"
                        } label: {
                            HStack {
                                Text(entry.t).font(.system(size: lang.isArabic ? 20 : 16))
                                Spacer()
                                Text(Engine.primaryEnglish(entry.en)).font(.caption).foregroundColor(.secondary)
                            }
                        }
                        .buttonStyle(.plain)
                        Divider()
                    }
                }
                .card()

                VStack(alignment: .leading, spacing: 8) {
                    SectionHeader(icon: "⭐", title: "Saved words (\(saved.count))")
                    if saved.isEmpty {
                        Text("Save translations to build your own word list. Saved words are kept with your progress.")
                            .font(.caption).foregroundColor(.secondary)
                    }
                    ForEach(Array(saved.enumerated()), id: \.offset) { i, p in
                        HStack {
                            PhraseRow(phrase: p, lang: lang)
                            Button {
                                progress.update(lang) { lp in
                                    if i < lp.saved.count { lp.saved.remove(at: i) }
                                }
                            } label: { Image(systemName: "xmark.circle.fill").foregroundColor(.secondary) }
                            .buttonStyle(.plain)
                            .accessibilityLabel("Remove")
                        }
                    }
                }
                .card()
            }
            .padding()
            .frame(maxWidth: 760)
            .frame(maxWidth: .infinity)
        }
        .background(Color(uiColor: .systemGroupedBackground))
        .navigationTitle("Offline Translator")
        .navigationBarTitleDisplayMode(.inline)
        .tint(lang.color)
    }

    private func resultCard(_ r: TranslationResult, direction: TranslateDirection, saved: [Phrase]) -> some View {
        let source = text.trimmingCharacters(in: .whitespacesAndNewlines)
        let outIsTarget = direction == .fromEn
        let item = outIsTarget
            ? Phrase(t: r.output, tr: r.outputTr.isEmpty ? nil : r.outputTr, en: source)
            : Phrase(t: source, tr: r.outputTr.isEmpty ? nil : r.outputTr, en: r.output)
        let isSaved = saved.contains { $0.t == item.t }
        return VStack(alignment: .leading, spacing: 8) {
            Text(direction == .toEn ? "\(lang.name) → English" : "English → \(lang.name)")
                .font(.caption).foregroundColor(.secondary)
            HStack {
                Text(r.output)
                    .font(.system(size: outIsTarget && lang.isArabic ? 30 : 24, weight: .semibold))
                    .textSelection(.enabled)
                Spacer()
                SpeakButton(text: outIsTarget ? r.output : source, lang: lang)
            }
            if !r.outputTr.isEmpty {
                Text(r.outputTr).font(.subheadline.italic()).foregroundColor(lang.color)
            }
            HStack {
                Text(r.exact != nil ? "✓ Exact phrase match" : "\(Int((r.coverage * 100).rounded()))% of words found")
                    .font(.caption)
                    .foregroundColor(r.coverage == 1 ? .green : .secondary)
                Spacer()
                if r.coverage > 0 {
                    Button(isSaved ? "★ Saved" : "☆ Save") {
                        progress.update(lang, xp: 1) { lp in
                            if !lp.saved.contains(where: { $0.t == item.t }) { lp.saved.insert(item, at: 0) }
                        }
                    }
                    .buttonStyle(.bordered)
                    .disabled(isSaved)
                }
            }
            if r.exact == nil || r.tokens.count > 1 {
                LazyVGrid(columns: [GridItem(.adaptive(minimum: 140), spacing: 6)], alignment: .leading, spacing: 6) {
                    ForEach(Array(r.tokens.enumerated()), id: \.offset) { _, t in
                        VStack(alignment: .leading, spacing: 1) {
                            Text(t.src).font(.caption.bold())
                            Text(t.out).font(.caption)
                            if direction == .fromEn && !t.tr.isEmpty { Text(t.tr).font(.caption2.italic()).foregroundColor(.secondary) }
                        }
                        .padding(6)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(RoundedRectangle(cornerRadius: 8).fill(t.how == "none" ? Color.red.opacity(0.12) : Color(uiColor: .tertiarySystemFill)))
                    }
                }
            }
        }
        .card()
    }
}

// MARK: - Aptitude test

struct AptitudeView: View {
    let lang: Language
    @EnvironmentObject var progress: ProgressStore
    @State private var phase = 0 // 0 intro, 1 running, 2 result
    @State private var result: PlacementResult?
    @State private var answers: [Int] = []

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 14) {
                switch phase {
                case 1:
                    QuizView(questions: lang.aptitude, mode: .test, lang: lang, showSummary: false) { _, picked in
                        finish(picked)
                    }
                    .card()
                case 2:
                    if let r = result { resultView(r) }
                default:
                    intro
                }
            }
            .padding()
            .frame(maxWidth: 760)
            .frame(maxWidth: .infinity)
        }
        .background(Color(uiColor: .systemGroupedBackground))
        .navigationTitle("Aptitude Test")
        .navigationBarTitleDisplayMode(.inline)
        .tint(lang.color)
    }

    private var intro: some View {
        let history = Array(progress.lang(lang.id).aptitude.reversed().prefix(5))
        let levels = Engine.levels.filter { l in lang.aptitude.contains { $0.level == l } }
        return VStack(alignment: .leading, spacing: 14) {
            VStack(alignment: .leading, spacing: 10) {
                Text("🎯 \(lang.name) Aptitude Test").font(.title2.bold())
                Text("\(lang.aptitude.count) questions covering grammar, vocabulary, reading and culture at levels \(levels.joined(separator: ", ")). It takes about 5 minutes.")
                Text("There's no feedback during the test, so answer honestly; you can review your answers at the end. Your level is the highest level where you get at least 60% right, as long as you also passed every level below it. If you score 80% or more on the top level, the test recommends C1.")
                    .font(.caption).foregroundColor(.secondary)
                Button("Start the test") {
                    answers = []
                    phase = 1
                }
                .buttonStyle(.borderedProminent)
            }
            .card()
            if !history.isEmpty {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Past results").font(.headline)
                    ForEach(Array(history.enumerated()), id: \.offset) { _, r in
                        HStack {
                            Text(ProgressStore.parseISO(r.at).map { $0.formatted(date: .abbreviated, time: .omitted) } ?? "-")
                            Spacer()
                            Text("\(r.score)/\(r.total)")
                            LevelBadge(level: r.level, color: lang.color)
                        }
                        .font(.subheadline)
                    }
                }
                .card()
            }
        }
    }

    private func finish(_ picked: [Int]) {
        let r = Engine.placement(lang.aptitude, answers: picked)
        answers = picked
        result = r
        phase = 2
        progress.update(lang, xp: 25) { lp in
            lp.aptitude.append(AptitudeRecord(at: ProgressStore.isoNow(), level: r.level, score: r.score, total: r.total, bySkill: r.bySkill))
            if lp.aptitude.count > 20 { lp.aptitude.removeFirst(lp.aptitude.count - 20) }
        }
    }

    private func resultView(_ r: PlacementResult) -> some View {
        let lessons = lang.allLessons.filter { $0.level == r.level || (r.level == "C1" && $0.level == "B2") }
        let media = lang.media.filter { $0.level == r.level }
        return VStack(alignment: .leading, spacing: 14) {
            VStack(spacing: 6) {
                Text("Your estimated level").foregroundColor(.secondary)
                Text(r.level).font(.system(size: 56, weight: .bold)).foregroundColor(lang.color)
                Text("\(Engine.levelNames[r.level] ?? "")\(r.beginner ? ": start at the beginning" : "")").font(.title3.bold())
                Text("\(r.score) of \(r.total) correct · saved to your progress").font(.subheadline)
                HStack {
                    Button("Retake") { phase = 0 }.buttonStyle(.bordered)
                    NavigationLink(value: Route.media(lang.id)) { Text("🎬 Media for \(r.level)") }.buttonStyle(.borderedProminent)
                }
            }
            .frame(maxWidth: .infinity)
            .card()

            VStack(alignment: .leading, spacing: 8) {
                Text("By level").font(.headline)
                ForEach(Engine.levels.filter { r.byLevel[$0] != nil }, id: \.self) { l in
                    scoreBar(l, r.byLevel[l] ?? SkillScore(c: 0, t: 0))
                }
                Text("By skill").font(.headline).padding(.top, 6)
                ForEach(r.bySkill.keys.sorted(), id: \.self) { k in
                    scoreBar(k.capitalized, r.bySkill[k] ?? SkillScore(c: 0, t: 0))
                }
            }
            .card()

            if !lessons.isEmpty {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Recommended lessons").font(.headline)
                    ForEach(lessons) { l in
                        NavigationLink(value: Route.lesson(lang.id, l.id)) {
                            HStack {
                                Text(l.title)
                                Spacer()
                                LevelBadge(level: l.level, color: lang.color)
                            }
                        }
                    }
                }
                .card()
            }
            if !media.isEmpty {
                VStack(alignment: .leading, spacing: 6) {
                    Text("Try these at your level").font(.headline)
                    ForEach(media) { m in
                        Text("• ").bold() + Text(m.title).bold() + Text(": \(m.why)")
                    }
                }
                .font(.subheadline)
                .card()
            }
            DisclosureGroup("Review your answers") {
                VStack(alignment: .leading, spacing: 10) {
                    ForEach(Array(lang.aptitude.enumerated()), id: \.offset) { i, q in
                        let a = i < answers.count ? answers[i] : -1
                        let ok = a == q.answer
                        VStack(alignment: .leading, spacing: 2) {
                            Text("\(ok ? "✓" : "✗") \(q.level ?? "") \(q.q) \(Bidi.isolate(q.t ?? ""))")
                                .foregroundColor(ok ? .green : .red)
                            Text("Correct: \(q.options[q.answer])\(q.explain.map { " · \($0)" } ?? "")")
                                .font(.caption)
                        }
                    }
                }
                .padding(.top, 6)
            }
            .card()
        }
    }

    private func scoreBar(_ label: String, _ s: SkillScore) -> some View {
        HStack {
            Text(label).frame(width: 90, alignment: .leading)
            ProgressView(value: Double(s.c), total: Double(max(s.t, 1))).tint(lang.color)
            Text("\(s.c)/\(s.t)").font(.caption).frame(width: 36)
        }
        .font(.subheadline)
    }
}

// MARK: - Media

struct MediaView: View {
    let lang: Language
    @EnvironmentObject var progress: ProgressStore
    @State private var level = ""

    var body: some View {
        let placed = progress.lang(lang.id).aptitude.last?.level
        let items = lang.media.filter { level == "all" || $0.level == level }
        List {
            Section {
                Picker("Level", selection: $level) {
                    Text("All").tag("all")
                    ForEach(Engine.levels, id: \.self) { l in
                        Text(l == placed ? "\(l) ★" : l).tag(l)
                    }
                }
                .pickerStyle(.segmented)
                if placed == nil {
                    NavigationLink(value: Route.aptitude(lang.id)) {
                        Text("Take the aptitude test to see picks for your level").font(.subheadline)
                    }
                }
            }
            ForEach(items) { m in
                VStack(alignment: .leading, spacing: 4) {
                    HStack {
                        Text(m.type.uppercased()).font(.caption.bold()).foregroundColor(lang.color)
                        Spacer()
                        LevelBadge(level: m.level, color: lang.color)
                    }
                    Text(m.title).font(.headline)
                    if let creator = m.creator { Text(creator).font(.caption).foregroundColor(.secondary) }
                    Text(m.why).font(.subheadline)
                    Text("📍 \(m.source) · \(m.skills.joined(separator: ", "))").font(.caption).foregroundColor(.secondary)
                }
                .padding(.vertical, 4)
            }
        }
        .navigationTitle("Media Picks")
        .tint(lang.color)
        .onAppear { if level.isEmpty { level = placed ?? "all" } }
    }
}

// MARK: - Progress & backup

struct ProgressBackupView: View {
    @AppStorage(Prefs.quietMode) private var quiet = false
    @AppStorage(Prefs.showTransliteration) private var showTr = true
    @EnvironmentObject var content: ContentStore
    @EnvironmentObject var progress: ProgressStore
    @State private var showImport = false
    @State private var importText = ""
    @State private var message: String?
    @State private var confirmReset = false

    var body: some View {
        List {
            Section {
                if !quiet {
                    HStack {
                        StatPill(value: "\(progress.data.xp)", label: "XP")
                        StatPill(value: "\(progress.data.streak.count)", label: "day streak")
                    }
                    .listRowBackground(Color.clear)
                }
                if let err = progress.lastSaveError {
                    Text("⚠️ Couldn't save: \(err)").foregroundColor(.red).font(.caption)
                } else if let at = ProgressStore.parseISO(progress.data.updatedAt) {
                    Text("Saved on this device after every answer. Last saved \(at.formatted(date: .abbreviated, time: .shortened)).")
                        .font(.caption).foregroundColor(.secondary)
                }
            }
            ForEach(content.languages) { lang in
                let s = Engine.stats(lang, progress.lang(lang.id))
                Section(lang.name) {
                    statRow("Overall", s.percent, 100, lang)
                    statRow("Lessons", s.lessonsDone, s.lessonsTotal, lang)
                    statRow("Scenarios", s.scenariosDone, s.scenariosTotal, lang)
                    statRow("Letters", s.lettersDone, s.lettersTotal, lang)
                    statRow("Writing", s.writingDone, s.writingTotal, lang)
                    if let level = s.level {
                        HStack { Text("Tested level"); Spacer(); LevelBadge(level: level, color: lang.color) }
                    }
                }
            }
            Section {
                Toggle(isOn: $showTr) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Show Arabic transliteration")
                        Text("Turn off once you can read the script; tap a blurred line to peek.").font(.caption).foregroundColor(.secondary)
                    }
                }
                Toggle(isOn: $quiet) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Quiet mode")
                        Text("Hide streaks and XP. Progress and fluency tracking keep working.").font(.caption).foregroundColor(.secondary)
                    }
                }
            } header: {
                Text("Learning preferences")
            }
            Section {
                ForEach(Array(Self.differences.enumerated()), id: \.offset) { _, item in
                    VStack(alignment: .leading, spacing: 2) {
                        Text(item.0).font(.subheadline.bold())
                        Text(item.1).font(.caption)
                    }
                }
                Text("The course was drafted with AI help and checked by automated tests, but it has not yet been reviewed by native-speaker teachers. If you spot an error, please report it.")
                    .font(.caption).foregroundColor(.secondary)
                ReportMistakeLink(subject: "general")
            } header: {
                Text("🐍 How Lingua is different")
            }
            Section {
                ShareLink(item: progress.exportJSON(), preview: SharePreview("Lingua progress backup")) {
                    Label("Export backup", systemImage: "square.and.arrow.up")
                }
                Button {
                    UIPasteboard.general.string = progress.exportJSON()
                    message = "Copied. Paste it into the web app, or keep it somewhere safe."
                } label: { Label("Copy backup as text", systemImage: "doc.on.doc") }
                Button {
                    importText = UIPasteboard.general.string ?? ""
                    showImport = true
                } label: { Label("Import backup", systemImage: "square.and.arrow.down") }
                Button(role: .destructive) { confirmReset = true } label: { Label("Reset all progress", systemImage: "trash") }
                if let m = message { Text(m).font(.caption).foregroundColor(.secondary) }
            } header: {
                Text("Backup & sync")
            } footer: {
                Text("The backup is the same JSON the web app exports, so you can move progress between the web app and this app.")
            }
        }
        .navigationTitle("Progress & Backup")
        .confirmationDialog("Reset ALL progress for both languages? This can't be undone.", isPresented: $confirmReset, titleVisibility: .visible) {
            Button("Reset everything", role: .destructive) {
                progress.reset()
                message = "Progress reset."
            }
        }
        .sheet(isPresented: $showImport) {
            NavigationStack {
                VStack(alignment: .leading, spacing: 10) {
                    Text("Paste a backup exported from the Lingua web app or this app. It replaces your current progress.")
                        .font(.subheadline).foregroundColor(.secondary)
                    TextEditor(text: $importText)
                        .font(.system(.caption, design: .monospaced))
                        .border(Color.secondary.opacity(0.3))
                }
                .padding()
                .navigationTitle("Import backup")
                .navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    ToolbarItem(placement: .cancellationAction) { Button("Cancel") { showImport = false } }
                    ToolbarItem(placement: .confirmationAction) {
                        Button("Import") {
                            do {
                                try progress.importJSON(importText)
                                message = "Backup restored."
                            } catch {
                                message = "Couldn't import: that doesn't look like a Lingua backup."
                            }
                            showImport = false
                        }
                    }
                }
            }
        }
    }

    static let differences: [(String, String)] = [
        ("Free and open", "No ads, no account, no hearts or energy limits. Every lesson is open from day one, and the aptitude test lets you start at your level."),
        ("Every answer is explained", "Each lesson starts with the grammar, and each question says why the answer is right."),
        ("Arabic as it's really used", "Formal Arabic plus Egyptian and Levantine, the script taught properly with tracing and typing, and transliteration you can switch off."),
        ("Real output", "Free writing and spoken answers are checked, not just repeat-after-me. Conversation with real people is still essential, and the app says so."),
        ("Honest progress", "Fluency scores come from your own accuracy and coverage, measured against the CEFR. Streaks are optional."),
        ("Your data stays yours", "Progress lives on your device, with export and import at any time."),
    ]

    private func statRow(_ label: String, _ done: Int, _ total: Int, _ lang: Language) -> some View {
        HStack {
            Text(label).frame(width: 90, alignment: .leading)
            ProgressView(value: Double(done), total: Double(max(total, 1))).tint(lang.color)
            Text(label == "Overall" ? "\(done)%" : "\(done)/\(total)").font(.caption).frame(width: 44, alignment: .trailing)
        }
    }
}
