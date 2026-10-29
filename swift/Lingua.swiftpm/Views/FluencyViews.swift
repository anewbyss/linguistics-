import SwiftUI
import UIKit
import Charts

// MARK: - Shared speaking panel

struct SpeakPanel: View {
    let text: String
    let tr: String?
    let en: String
    let lang: Language
    @ObservedObject var listener: SpeechListener
    var disabled = false
    var onScored: (Int) -> Void
    var onSelfCheck: () -> Void

    var body: some View {
        VStack(spacing: 10) {
            Text(text)
                .font(.system(size: lang.isArabic ? 38 : 30, weight: .medium))
                .multilineTextAlignment(.center)
            if let tr = tr, !tr.isEmpty {
                Text(tr).font(.headline.italic()).foregroundColor(lang.color)
            }
            Text(en).foregroundColor(.secondary)
            HStack {
                Button {
                    Speaker.shared.speak(text, language: lang.speech)
                } label: { Label("Listen", systemImage: "speaker.wave.2.fill") }
                    .buttonStyle(.bordered)
                if listener.status == .listening {
                    Button {
                        listener.stopListening()
                    } label: { Label("Stop", systemImage: "stop.circle.fill") }
                        .buttonStyle(.borderedProminent)
                        .tint(.red)
                } else {
                    Button {
                        listener.listen(locale: lang.speech, target: text, lang: lang.id, onScored: onScored)
                    } label: { Label("Say it", systemImage: "mic.fill") }
                        .buttonStyle(.borderedProminent)
                        .tint(lang.color)
                        .disabled(disabled)
                }
                Button("I said it ✓") {
                    listener.markSelfChecked()
                    onSelfCheck()
                }
                .buttonStyle(.bordered)
                .disabled(disabled)
            }
            feedback
            Text("Speech is recognised on your device when it supports this language.")
                .font(.caption2).foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
    }

    @ViewBuilder
    private var feedback: some View {
        switch listener.status {
        case .idle:
            EmptyView()
        case .listening:
            Label("Listening… say the phrase now", systemImage: "waveform").foregroundColor(lang.color)
        case .scored(let score, let heard):
            VStack(spacing: 4) {
                Text(score >= Engine.speakPass ? "✓ Great pronunciation! Score: \(score)%" : "Close. Listen again and try once more. Score: \(score)%")
                    .font(.subheadline.bold())
                    .foregroundColor(score >= Engine.speakPass ? .green : .orange)
                Text("I heard: “\(heard)”").font(.caption)
            }
        case .selfChecked:
            Text("✓ Marked as practised (self-checked). Only scored attempts change your accuracy.")
                .font(.caption).foregroundColor(.green).multilineTextAlignment(.center)
        case .failed(let message):
            Text(message).font(.caption).foregroundColor(.red).multilineTextAlignment(.center)
        }
    }
}

// MARK: - Speaking practice

struct SpeakingPracticeView: View {
    let lang: Language
    @EnvironmentObject var progress: ProgressStore
    @StateObject private var listener = SpeechListener()
    @State private var index = 0
    @State private var started = false
    @State private var tab = "repeat"

    var body: some View {
        let phrases = Engine.speakingPhrases(lang)
        let lp = progress.lang(lang.id)
        let spoken = phrases.filter { (lp.speaking[$0.phrase.t]?.best ?? 0) >= Engine.speakPass }.count
        let item = phrases[min(index, phrases.count - 1)]
        let record = lp.speaking[item.phrase.t]
        ScrollView {
            VStack(spacing: 14) {
                Picker("Mode", selection: $tab) {
                    Text("Repeat phrases").tag("repeat")
                    Text("Answer questions").tag("answer")
                }
                .pickerStyle(.segmented)
                .onChange(of: tab) { _ in listener.reset() }
                SpeedPicker()

                if tab == "answer" {
                    if lang.speakingPrompts.isEmpty {
                        Text("No speaking prompts yet.").card()
                    } else {
                        AnswerPromptView(lang: lang, listener: listener)
                    }
                } else {
                VStack(alignment: .leading, spacing: 6) {
                    Text("Listen to the model, then tap “Say it” and repeat. Scores of \(Engine.speakPass)% or more count towards your speaking fluency.")
                        .font(.subheadline)
                    Text("\(spoken)/\(phrases.count) phrases spoken well").font(.caption.bold())
                    ProgressView(value: Double(spoken), total: Double(max(phrases.count, 1))).tint(lang.color)
                }
                .card()

                VStack(spacing: 12) {
                    HStack {
                        Text("Phrase \(index + 1) of \(phrases.count)").font(.caption).foregroundColor(.secondary)
                        LevelBadge(level: item.level, color: lang.color)
                        Spacer()
                        Text(record.map { "Best \($0.best)%\($0.selfChecked == true ? " (self)" : "")" } ?? "Not tried yet")
                            .font(.caption)
                    }
                    SpeakPanel(text: item.phrase.t, tr: item.phrase.tr, en: item.phrase.en, lang: lang, listener: listener,
                               onScored: { score in progress.recordSpeaking(lang, phrase: item.phrase.t, score: score, selfChecked: false) },
                               onSelfCheck: { progress.recordSpeaking(lang, phrase: item.phrase.t, score: Engine.speakPass, selfChecked: true) })
                    HStack {
                        Button { move(-1) } label: { Label("Previous", systemImage: "chevron.left") }
                            .buttonStyle(.bordered).disabled(index == 0)
                        Spacer()
                        Button { move(1) } label: { Label("Next", systemImage: "chevron.right") }
                            .buttonStyle(.bordered).disabled(index >= phrases.count - 1)
                    }
                }
                .card()
                }
            }
            .padding()
            .frame(maxWidth: 760)
            .frame(maxWidth: .infinity)
        }
        .background(Color(uiColor: .systemGroupedBackground))
        .navigationTitle("Speaking Practice")
        .navigationBarTitleDisplayMode(.inline)
        .tint(lang.color)
        .onAppear {
            guard !started else { return }
            started = true
            index = phrases.firstIndex { (lp.speaking[$0.phrase.t]?.best ?? 0) < Engine.speakPass } ?? 0
        }
        .onDisappear { listener.reset() }
    }

    private func move(_ d: Int) {
        index += d
        listener.reset()
    }
}

// MARK: - Daily challenge

private struct ChallengeResult {
    let skill: String
    let correct: Bool
    let measured: Bool
    var skipped = false
}

struct DailyChallengeView: View {
    let lang: Language
    @EnvironmentObject var progress: ProgressStore
    @StateObject private var listener = SpeechListener()
    @State private var phase = 0 // 0 intro, 1 running, 2 done
    @State private var items: [ChallengeItem] = []
    @State private var index = 0
    @State private var results: [ChallengeResult] = []
    @State private var picked: Int?
    @State private var typed = ""
    @State private var typeResult: WritingCheck?
    @State private var attempts = 0
    @State private var replay = false
    @State private var showText = false
    @State private var dictScore: Int?
    @State private var summary: ChallengeRecord?

    private var today: String { ProgressStore.day(Date()) }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 14) {
                switch phase {
                case 1:
                    if index < items.count { run(items[index]) }
                case 2:
                    done
                default:
                    intro
                }
            }
            .padding()
            .frame(maxWidth: 760)
            .frame(maxWidth: .infinity)
        }
        .background(Color(uiColor: .systemGroupedBackground))
        .navigationTitle("Daily Challenge")
        .navigationBarTitleDisplayMode(.inline)
        .tint(lang.color)
        .onAppear {
            if items.isEmpty {
                items = Engine.dailyChallenge(lang, progress.lang(lang.id), day: today)
                phase = progress.lang(lang.id).challenges[today] == nil ? 0 : 2
            }
        }
        .onDisappear { listener.reset() }
    }

    private var intro: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("⚡ Daily Challenge").font(.title2.bold())
            Text(Date().formatted(date: .complete, time: .omitted)).foregroundColor(.secondary)
            Text("Ten quick items drawn from what you've been learning, at your level:")
            Text("📖 3 reading: meanings, a word to read, a lesson question")
            Text("✍️ 3 writing: two typed answers and a spelling check")
            Text("🎧 2 listening: a dictation and a line to understand by ear")
            Text("🎙️ 2 speaking: phrases to say out loud")
            Text("The challenge stays the same all day. Your first completion counts towards your fluency and challenge streak.")
                .font(.caption).foregroundColor(.secondary)
            Button("Start today's challenge") { phase = 1 }
                .buttonStyle(.borderedProminent)
        }
        .card()
    }

    private var answered: Bool { results.count > index }

    @ViewBuilder
    private func run(_ it: ChallengeItem) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Item \(index + 1) of \(items.count) · \(skillLabel(it.skill))").font(.caption).foregroundColor(.secondary)
                Spacer()
                if replay { Text("Practice replay").font(.caption.bold()) }
            }
            ProgressView(value: Double(index), total: Double(items.count)).tint(lang.color)
            switch it.kind {
            case .choice: choice(it)
            case .type: typing(it)
            case .speak: speaking(it)
            case .dictation: dictation(it)
            }
            if answered {
                Button(index + 1 < items.count ? "Next →" : "Finish") { next() }
                    .buttonStyle(.borderedProminent)
            }
        }
        .card()
    }

    private func choice(_ it: ChallengeItem) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(it.q).font(.headline)
            if let t = it.t {
                if it.audio && !showText && !answered {
                    HStack {
                        Button {
                            Speaker.shared.speak(t, language: lang.speech)
                        } label: { Label("Play", systemImage: "play.fill") }
                            .buttonStyle(.borderedProminent)
                        Button("Show text") { showText = true }.buttonStyle(.bordered)
                    }
                } else {
                    HStack {
                        TargetText(text: t, lang: lang, size: 24)
                        Spacer()
                        if !t.contains("__") { SpeakButton(text: t, lang: lang) }
                    }
                    if let tr = it.tr { Text(tr).font(.subheadline.italic()).foregroundColor(lang.color) }
                }
            }
            ForEach(Array(it.options.enumerated()), id: \.offset) { i, option in
                Button {
                    guard !answered else { return }
                    picked = i
                    if it.audio, !replay, let t = it.t {
                        progress.recordListening(lang, line: t, score: i == it.answer ? (showText ? 60 : 100) : 0)
                    }
                    answer(ChallengeResult(skill: it.skill, correct: i == it.answer, measured: true))
                } label: {
                    Text(option)
                        .font(Engine.hasArabic(option) ? .title3 : .body)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(12)
                        .background(RoundedRectangle(cornerRadius: 12).fill(optionFill(i, it)))
                }
                .buttonStyle(.plain)
                .disabled(answered)
            }
            if answered, let r = results.last {
                Text(r.correct ? "✓ Correct!" : "✗ The answer is: \(it.options[it.answer])")
                    .font(.subheadline.bold()).foregroundColor(r.correct ? .green : .red)
                if let explain = it.explain { Text(explain).font(.subheadline) }
            }
        }
    }

    private func optionFill(_ i: Int, _ it: ChallengeItem) -> Color {
        guard answered else { return Color(uiColor: .tertiarySystemGroupedBackground) }
        if i == it.answer { return Color.green.opacity(0.15) }
        if i == picked { return Color.red.opacity(0.15) }
        return Color(uiColor: .tertiarySystemGroupedBackground)
    }

    private func typing(_ it: ChallengeItem) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(it.prompt).font(.headline)
            TextField(lang.isArabic ? "اكتب هنا" : "Escribe aquí", text: $typed)
                .font(.system(size: lang.isArabic ? 28 : 22))
                .multilineTextAlignment(lang.isRTL ? .trailing : .leading)
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled()
                .padding(10)
                .background(RoundedRectangle(cornerRadius: 12).fill(Color(uiColor: .tertiarySystemFill)))
                .disabled(answered)
                .onSubmit { check(it) }
            if !answered {
                if let keys = lang.reading.keyboard { KeyPad(keys: keys, lang: lang, text: $typed) }
                if let hint = it.hint { Text("Hint: \(hint)").font(.caption).foregroundColor(.secondary) }
                Button("Check") { check(it) }.buttonStyle(.borderedProminent)
            }
            if let r = typeResult {
                Text(r.ok ? (r.perfect ? "✓ Perfect!" : "✓ Correct, but check the \(lang.isArabic ? "spelling" : "accents"): \(r.expected)") : "✗ The answer is: \(it.answerText)")
                    .font(.subheadline.bold()).foregroundColor(r.ok ? .green : .red)
            }
        }
    }

    private func speaking(_ it: ChallengeItem) -> some View {
        VStack(spacing: 10) {
            Text("Say this out loud").font(.headline).frame(maxWidth: .infinity, alignment: .leading)
            SpeakPanel(text: it.t ?? "", tr: it.tr, en: it.en, lang: lang, listener: listener, disabled: answered,
                       onScored: { score in
                           guard !answered else { return }
                           if !replay { progress.recordSpeaking(lang, phrase: it.t ?? "", score: score, selfChecked: false) }
                           attempts += 1
                           if score >= Engine.speakPass || attempts >= 3 {
                               answer(ChallengeResult(skill: it.skill, correct: score >= Engine.speakPass, measured: true))
                           }
                       },
                       onSelfCheck: {
                           guard !answered else { return }
                           if !replay { progress.recordSpeaking(lang, phrase: it.t ?? "", score: Engine.speakPass, selfChecked: true) }
                           answer(ChallengeResult(skill: it.skill, correct: true, measured: false))
                       })
            if !answered {
                Button("Skip (can't speak right now)") {
                    answer(ChallengeResult(skill: it.skill, correct: false, measured: false, skipped: true))
                }
                .buttonStyle(.bordered)
            }
        }
    }

    private func dictation(_ it: ChallengeItem) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Listen and type exactly what you hear").font(.headline)
            Button {
                Speaker.shared.speak(it.t ?? "", language: lang.speech)
            } label: { Label("Play", systemImage: "play.fill") }
                .buttonStyle(.borderedProminent)
            TextField(lang.isArabic ? "اكتب هنا" : "Escribe aquí", text: $typed)
                .font(.system(size: lang.isArabic ? 26 : 20))
                .multilineTextAlignment(lang.isRTL ? .trailing : .leading)
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled()
                .padding(10)
                .background(RoundedRectangle(cornerRadius: 12).fill(Color(uiColor: .tertiarySystemFill)))
                .disabled(answered)
                .onSubmit { checkDictation(it) }
            if !answered {
                if let keys = lang.reading.keyboard { KeyPad(keys: keys, lang: lang, text: $typed) }
                Button("Check") { checkDictation(it) }.buttonStyle(.borderedProminent)
            }
            if let s = dictScore {
                Text(s >= Engine.listenPass ? "✓ Great listening! Score: \(s)%" : "Not quite. Score: \(s)%")
                    .font(.subheadline.bold()).foregroundColor(s >= Engine.listenPass ? .green : .orange)
                Text(it.t ?? "").font(.system(size: lang.isArabic ? 26 : 20, weight: .medium))
                if let tr = it.tr { Text(tr).font(.subheadline.italic()).foregroundColor(lang.color) }
                Text(it.en).font(.subheadline)
            }
        }
    }

    private func checkDictation(_ it: ChallengeItem) {
        guard !answered else { return }
        let s = Engine.dictationScore(typed, it.t ?? "", lang: lang.id)
        dictScore = s
        if !replay { progress.recordListening(lang, line: it.t ?? "", score: s) }
        answer(ChallengeResult(skill: it.skill, correct: s >= Engine.listenPass, measured: true))
    }

    private func check(_ it: ChallengeItem) {
        guard !answered else { return }
        let r = Engine.checkWriting(typed, task: it.writingTask, lang: lang.id)
        typeResult = r
        answer(ChallengeResult(skill: it.skill, correct: r.ok, measured: true))
    }

    private func answer(_ r: ChallengeResult) {
        if results.count == index { results.append(r) }
    }

    private func next() {
        if index + 1 >= items.count {
            finish()
            return
        }
        index += 1
        picked = nil
        typed = ""
        typeResult = nil
        attempts = 0
        showText = false
        dictScore = nil
        listener.reset()
    }

    private func finish() {
        let counted = results.filter { !$0.skipped }
        var bySkill: [String: SkillScore] = [:]
        for r in counted {
            bySkill[r.skill, default: SkillScore(c: 0, t: 0)].t += 1
            if r.correct { bySkill[r.skill]?.c += 1 }
        }
        let record = ChallengeRecord(score: counted.filter(\.correct).count, total: counted.count, bySkill: bySkill)
        summary = record
        phase = 2
        listener.reset()
        let day = today
        guard !replay, progress.lang(lang.id).challenges[day] == nil else { return }
        progress.update(lang, xp: record.score * 10 + 30) { lp in
            lp.challenges[day] = record
            let days = lp.challenges.keys.sorted()
            for old in days.prefix(max(0, days.count - 60)) { lp.challenges[old] = nil }
            for skill in Engine.skills {
                let measured = counted.filter { $0.skill == skill && $0.measured }
                if !measured.isEmpty {
                    lp.logPractice(skill, Engine.percent(measured.filter(\.correct).count, measured.count))
                }
            }
        }
    }

    private var done: some View {
        let lp = progress.lang(lang.id)
        let rec = replay ? summary : (lp.challenges[today] ?? summary)
        return VStack(alignment: .leading, spacing: 14) {
            if let rec = rec {
                VStack(spacing: 8) {
                    Text("Today's challenge").foregroundColor(.secondary)
                    Text("\(rec.score)/\(rec.total)").font(.system(size: 52, weight: .bold)).foregroundColor(lang.color)
                    Text(rec.score == rec.total ? "Perfect score! 🎉" : Double(rec.score) >= Double(rec.total) * 0.7 ? "Great work!" : "Good effort. Every day counts.")
                    Text("🔥 \(Engine.challengeStreak(lp))-day challenge streak · a new challenge unlocks tomorrow").font(.caption)
                    HStack {
                        Button("Practise again (not scored)") {
                            replay = true
                            items = Engine.dailyChallenge(lang, lp, day: today)
                            index = 0
                            results = []
                            picked = nil
                            typed = ""
                            typeResult = nil
                            attempts = 0
                            showText = false
                            dictScore = nil
                            phase = 1
                        }
                        .buttonStyle(.bordered)
                        NavigationLink(value: Route.fluency(lang.id)) { Text("See your fluency") }
                            .buttonStyle(.borderedProminent)
                    }
                }
                .frame(maxWidth: .infinity)
                .card()
                VStack(alignment: .leading, spacing: 8) {
                    Text("By skill").font(.headline)
                    ForEach(Engine.skills.filter { rec.bySkill[$0] != nil }, id: \.self) { k in
                        let v = rec.bySkill[k] ?? SkillScore(c: 0, t: 0)
                        HStack {
                            Text(skillLabel(k)).frame(width: 110, alignment: .leading)
                            ProgressView(value: Double(v.c), total: Double(max(v.t, 1))).tint(lang.color)
                            Text("\(v.c)/\(v.t)").font(.caption)
                        }
                    }
                }
                .card()
            }
        }
    }
}

func skillLabel(_ skill: String) -> String {
    switch skill {
    case "reading": return "📖 Reading"
    case "writing": return "✍️ Writing"
    case "speaking": return "🎙️ Speaking"
    case "listening": return "🎧 Listening"
    default: return "🏁 Overall"
    }
}

// MARK: - Fluency

/// Validated categorical slots 1–5, stepped separately for light and dark mode.
private func seriesColor(_ skill: String) -> Color {
    let pairs: [String: (UInt32, UInt32)] = [
        "Overall": (0x2a78d6, 0x3987e5), "Reading": (0xeb6834, 0xd95926),
        "Writing": (0x1baf7a, 0x199e70), "Speaking": (0xeda100, 0xc98500),
        "Listening": (0xe87ba4, 0xd55181),
    ]
    let (light, dark) = pairs[skill] ?? (0x888888, 0x888888)
    func ui(_ v: UInt32) -> UIColor {
        UIColor(red: CGFloat((v >> 16) & 0xff) / 255, green: CGFloat((v >> 8) & 0xff) / 255, blue: CGFloat(v & 0xff) / 255, alpha: 1)
    }
    return Color(UIColor { $0.userInterfaceStyle == .dark ? ui(dark) : ui(light) })
}

private struct FluencyPoint: Identifiable {
    let id: String
    let date: Date
    let skill: String
    let value: Int
}

struct FluencyTrendChart: View {
    let entries: [FluencySnapshot]
    @State private var selected: FluencySnapshot?

    private static let parser: DateFormatter = {
        let f = DateFormatter()
        f.calendar = Calendar(identifier: .gregorian)
        f.locale = Locale(identifier: "en_US_POSIX")
        f.dateFormat = "yyyy-MM-dd"
        return f
    }()

    private func date(_ day: String) -> Date { Self.parser.date(from: day) ?? Date() }

    private var points: [FluencyPoint] {
        entries.flatMap { e -> [FluencyPoint] in
            let d = date(e.day)
            return [("Overall", e.overall), ("Reading", e.reading), ("Writing", e.writing), ("Speaking", e.speaking), ("Listening", e.listening)]
                .map { FluencyPoint(id: "\(e.day)-\($0.0)", date: d, skill: $0.0, value: $0.1) }
        }
    }

    var body: some View {
        let lastDay = entries.last?.day
        VStack(alignment: .leading, spacing: 8) {
            Chart {
                ForEach(points) { p in
                    LineMark(x: .value("Day", p.date), y: .value("Score", p.value))
                        .foregroundStyle(by: .value("Skill", p.skill))
                        .lineStyle(StrokeStyle(lineWidth: p.skill == "Overall" ? 3 : 2, lineCap: .round, lineJoin: .round))
                    if p.id.hasPrefix(lastDay ?? "-") {
                        PointMark(x: .value("Day", p.date), y: .value("Score", p.value))
                            .foregroundStyle(by: .value("Skill", p.skill))
                            .annotation(position: .trailing, alignment: .leading) {
                                Text(p.skill).font(.caption2.bold()).foregroundColor(.primary)
                            }
                    }
                }
                if let s = selected {
                    RuleMark(x: .value("Selected", date(s.day)))
                        .foregroundStyle(Color.secondary.opacity(0.6))
                        .lineStyle(StrokeStyle(lineWidth: 1, dash: [3, 3]))
                }
            }
            .chartForegroundStyleScale([
                "Overall": seriesColor("Overall"), "Reading": seriesColor("Reading"),
                "Writing": seriesColor("Writing"), "Speaking": seriesColor("Speaking"),
                "Listening": seriesColor("Listening"),
            ])
            .chartYScale(domain: 0...100)
            .chartLegend(position: .top, alignment: .leading)
            .chartOverlay { proxy in
                GeometryReader { geo in
                    Rectangle().fill(Color.clear).contentShape(Rectangle())
                        .gesture(
                            DragGesture(minimumDistance: 0)
                                .onChanged { value in
                                    let x = value.location.x - geo[proxy.plotAreaFrame].origin.x
                                    if let d: Date = proxy.value(atX: x) {
                                        selected = entries.min { abs(date($0.day).timeIntervalSince(d)) < abs(date($1.day).timeIntervalSince(d)) }
                                    }
                                }
                        )
                }
            }
            .padding(.trailing, 56)
            .frame(height: 230)
            .accessibilityLabel("Fluency scores over time")

            Text(selected.map { "\($0.day): overall \($0.overall) · reading \($0.reading) · writing \($0.writing) · listening \($0.listening) · speaking \($0.speaking)" } ?? "Touch the chart to see a day's scores.")
                .font(.caption)
                .foregroundColor(.secondary)

            DisclosureGroup("Show as a table") {
                VStack(spacing: 4) {
                    HStack {
                        Text("Day").frame(maxWidth: .infinity, alignment: .leading)
                        Text("Overall"); Text("Read"); Text("Write"); Text("Listen"); Text("Speak")
                    }
                    .font(.caption.bold())
                    ForEach(Array(entries.reversed()), id: \.day) { e in
                        HStack {
                            Text(e.day).frame(maxWidth: .infinity, alignment: .leading)
                            Text("\(e.overall)").frame(width: 48)
                            Text("\(e.reading)").frame(width: 40)
                            Text("\(e.writing)").frame(width: 40)
                            Text("\(e.listening)").frame(width: 44)
                            Text("\(e.speaking)").frame(width: 44)
                        }
                        .font(.caption)
                    }
                }
            }
            .font(.subheadline)
        }
    }
}

struct FluencyView: View {
    let lang: Language
    @EnvironmentObject var progress: ProgressStore

    private let tips = [
        "reading": "Study letters, finish lessons and do letter / accent quizzes.",
        "writing": "Do the Write and Trace exercises, then free-write in the Writing Studio.",
        "listening": "Do dictations and meaning checks in Listening, starting slow.",
        "speaking": "Use Speaking Practice (repeat and answer questions) and play the scenarios.",
    ]

    var body: some View {
        let lp = progress.lang(lang.id)
        let f = Engine.fluency(lang, lp)
        ScrollView {
            VStack(alignment: .leading, spacing: 14) {
                VStack(spacing: 6) {
                    Text("Overall fluency").foregroundColor(.secondary)
                    Text("\(f.overall)").font(.system(size: 56, weight: .bold)).foregroundColor(lang.color)
                    Text("Estimated level \(f.overallBand) · \(Engine.levelNames[f.overallBand] ?? "")").font(.title3.bold())
                    Text(f.testLevel.map { "The average of reading, writing, listening and speaking, blended with your latest aptitude test (\($0))." }
                         ?? "The average of reading, writing, listening and speaking. Take the aptitude test to include it.")
                        .font(.caption).foregroundColor(.secondary).multilineTextAlignment(.center)
                }
                .frame(maxWidth: .infinity)
                .card()

                HayyaTip(text: f.overall < 20 ? "Every expert started here. Little and often beats cramming: 15 minutes a day adds up fast."
                         : f.overall < 60 ? "You're building real momentum. Keep all four skills moving, and start talking with real people."
                         : "Impressive! Now live in the language: native media, conversations and reading every day.",
                         mood: f.overall < 60 ? .happy : .cheer, color: lang.color)

                ForEach(Engine.skills, id: \.self) { name in
                    skillCard(name, f.skill(name))
                }

                PathToFluencyView(lang: lang, lp: lp)

                VStack(alignment: .leading, spacing: 8) {
                    Text("Your trend").font(.headline)
                    if lp.fluency.count >= 2 {
                        FluencyTrendChart(entries: Array(lp.fluency.suffix(60)))
                    } else {
                        Text("Your trend appears here after you practise on two different days.")
                            .font(.subheadline).foregroundColor(.secondary)
                    }
                }
                .card()

                DisclosureGroup("How fluency is calculated") {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Each skill scores 0–100: 60% coverage (how much of the course you've practised in that skill) plus 40% accuracy (the average of your last 10 scored attempts). Bands: under 20 = A1, under 40 = A2, under 60 = B1, under 80 = B2, 80+ = C1.")
                        Text("Reading: letters studied, lessons completed and words learned in Review; accuracy from lesson quizzes, letter / accent quizzes and challenge reading items.")
                        Text("Writing: writing tasks mastered, letters traced and free-writing prompts passed; accuracy from typed answers, tracing scores and challenge writing items.")
                        Text("Listening: lines understood (\(Engine.listenPass)+); accuracy from dictation and meaning checks and challenge listening items.")
                        Text("Speaking: phrases spoken well (\(Engine.speakPass)+), scenarios completed and speaking prompts answered; accuracy from pronunciation scores, scenario first-try scores and challenge speaking items.")
                        Text("This is a study estimate, not an official CEFR certificate.").foregroundColor(.secondary)
                    }
                    .font(.caption)
                    .padding(.top, 6)
                }
                .card()
            }
            .padding()
            .frame(maxWidth: 760)
            .frame(maxWidth: .infinity)
        }
        .background(Color(uiColor: .systemGroupedBackground))
        .navigationTitle("Progress to Fluency")
        .navigationBarTitleDisplayMode(.inline)
        .tint(lang.color)
        .onAppear { progress.refreshFluency(lang) }
    }

    private func skillCard(_ name: String, _ s: SkillFluency) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(skillLabel(name)).font(.headline)
                Spacer()
                LevelBadge(level: s.band, color: lang.color)
            }
            HStack(alignment: .firstTextBaseline, spacing: 2) {
                Text("\(s.score)").font(.system(size: 40, weight: .bold)).foregroundColor(lang.color)
                Text("/100").font(.caption).foregroundColor(.secondary)
            }
            ProgressView(value: Double(s.score), total: 100).tint(lang.color)
            ForEach(s.parts, id: \.self) { p in
                fluencyRow(p.label, Double(p.done), Double(max(p.total, 1)), "\(p.done)/\(p.total)")
            }
            fluencyRow("Recent accuracy", Double(s.accuracy ?? 0), 100, s.accuracy.map { "\($0)%" } ?? "none yet")
            Text(s.samples > 0 ? "Based on your last \(s.samples) scored attempts. \(tips[name] ?? "")" : "No scored attempts yet, so this skill can reach at most 60. \(tips[name] ?? "")")
                .font(.caption).foregroundColor(.secondary)
            NavigationLink(value: practiceRoute(name)) {
                Text("Practise \(name)")
            }
            .buttonStyle(.bordered)
        }
        .card()
    }

    private func practiceRoute(_ name: String) -> Route {
        switch name {
        case "speaking": return .speaking(lang.id)
        case "listening": return .listening(lang.id)
        case "writing": return .writing(lang.id)
        default: return .reading(lang.id)
        }
    }

    private func fluencyRow(_ label: String, _ value: Double, _ total: Double, _ detail: String) -> some View {
        HStack {
            Text(label).font(.caption).frame(width: 140, alignment: .leading)
            ProgressView(value: value, total: total).tint(lang.color)
            Text(detail).font(.caption).frame(width: 64, alignment: .trailing)
        }
    }
}

/// Compact summary for the language home screen.
struct FluencySummaryRow: View {
    let lang: Language
    let report: FluencyReport

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text("Progress to fluency").font(.headline)
                Spacer()
                LevelBadge(level: report.overallBand, color: lang.color)
            }
            ForEach(["reading", "writing", "listening", "speaking", "overall"], id: \.self) { name in
                let score = name == "overall" ? report.overall : report.skill(name).score
                HStack {
                    Text(skillLabel(name)).font(.caption).frame(width: 100, alignment: .leading)
                    ProgressView(value: Double(score), total: 100).tint(lang.color)
                    Text("\(score)").font(.caption.bold()).frame(width: 30, alignment: .trailing)
                }
            }
        }
        .padding(.vertical, 4)
    }
}
