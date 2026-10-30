import SwiftUI
import UIKit

// MARK: - Hayya, the feathered snake

/// "هيّا" (hayyā) means "let's go!" in Arabic; the feathers nod to Quetzalcóatl, Mexico's feathered serpent.
/// Patterned after Lyra, a real ball python: chocolate body, cream-edged caramel blotches,
/// a dark head with tan stripes and a cream chin.
struct HayyaMascot: View {
    enum Mood { case happy, cheer, think, sleep }

    var mood: Mood = .happy
    var size: CGFloat = 64

    private static func tone(_ light: UInt32, _ dark: UInt32) -> Color {
        func ui(_ v: UInt32) -> UIColor {
            UIColor(red: CGFloat((v >> 16) & 0xff) / 255, green: CGFloat((v >> 8) & 0xff) / 255, blue: CGFloat(v & 0xff) / 255, alpha: 1)
        }
        return Color(UIColor { $0.userInterfaceStyle == .dark ? ui(dark) : ui(light) })
    }
    private static let bodyColor = tone(0x3a281c, 0x5a4231)
    private static let rimColor = tone(0xefe1c2, 0xe6d3ab)
    private static let blotchColor = tone(0xb0844c, 0xb4884f)

    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var bob = false

    var body: some View {
        Canvas { ctx, canvasSize in
            let s = canvasSize.width / 120
            func pt(_ x: CGFloat, _ y: CGFloat) -> CGPoint { CGPoint(x: x * s, y: y * s) }
            func ellipse(_ cx: CGFloat, _ cy: CGFloat, _ rx: CGFloat, _ ry: CGFloat, degrees: CGFloat = 0) -> Path {
                let base = Path(ellipseIn: CGRect(x: (cx - rx) * s, y: (cy - ry) * s, width: 2 * rx * s, height: 2 * ry * s))
                guard degrees != 0 else { return base }
                let t = CGAffineTransform(translationX: cx * s, y: cy * s).rotated(by: degrees * .pi / 180).translatedBy(x: -cx * s, y: -cy * s)
                return base.applying(t)
            }
            let ink = Color(red: 0.11, green: 0.11, blue: 0.11)

            // Body: the same S-curve as the web SVG (smooth curves expanded to explicit control points).
            var body = Path()
            body.move(to: pt(14, 104))
            body.addCurve(to: pt(52, 88), control1: pt(8, 84), control2: pt(40, 80))
            body.addCurve(to: pt(94, 78), control1: pt(64, 96), control2: pt(90, 100))
            body.addCurve(to: pt(76, 40), control1: pt(98, 56), control2: pt(70, 56))
            // Rounded dashes of uneven length make the blotches; the phase matches the web's dash offset.
            let dash: [CGFloat] = [7, 19, 12, 19, 4, 19].map { $0 * s }
            ctx.stroke(body, with: .color(Self.bodyColor), style: StrokeStyle(lineWidth: 17 * s, lineCap: .round))
            ctx.stroke(body, with: .color(Self.rimColor), style: StrokeStyle(lineWidth: 13.5 * s, lineCap: .round, dash: dash, dashPhase: 71 * s))
            ctx.stroke(body, with: .color(Self.blotchColor), style: StrokeStyle(lineWidth: 11 * s, lineCap: .round, dash: dash, dashPhase: 71 * s))

            // Feather crest
            ctx.fill(ellipse(66, 13, 4, 9, degrees: -30), with: .color(Color(red: 0.93, green: 0.63, blue: 0)))
            ctx.fill(ellipse(80, 9, 4, 10), with: .color(Color(red: 0.92, green: 0.41, blue: 0.20)))
            ctx.fill(ellipse(94, 13, 4, 9, degrees: 30), with: .color(Color(red: 0.91, green: 0.48, blue: 0.64)))

            // Head
            ctx.fill(ellipse(81, 29, 17, 14), with: .color(Self.bodyColor))
            ctx.fill(ellipse(81, 35, 13, 6.5), with: .color(Self.rimColor))
            var stripes = Path()
            stripes.move(to: pt(65, 25)); stripes.addQuadCurve(to: pt(80, 17), control: pt(72, 16))
            stripes.move(to: pt(97, 25)); stripes.addQuadCurve(to: pt(82, 17), control: pt(90, 16))
            ctx.stroke(stripes, with: .color(Self.blotchColor), style: StrokeStyle(lineWidth: 2.4 * s, lineCap: .round))
            if mood == .sleep {
                var lids = Path()
                lids.move(to: pt(70, 27)); lids.addQuadCurve(to: pt(78, 27), control: pt(74, 30))
                lids.move(to: pt(83, 27)); lids.addQuadCurve(to: pt(91, 27), control: pt(87, 30))
                ctx.stroke(lids, with: .color(ink), style: StrokeStyle(lineWidth: 2 * s, lineCap: .round))
            } else {
                ctx.fill(ellipse(74, 26, 4.6, 4.6), with: .color(.white))
                ctx.fill(ellipse(87, 26, 4.6, 4.6), with: .color(.white))
                let dx: CGFloat = mood == .think ? -1 : 1
                let dy: CGFloat = mood == .think ? -1.5 : 0.6
                ctx.fill(ellipse(74 + dx, 26 + dy, 2.3, 2.3), with: .color(ink))
                ctx.fill(ellipse(87 + dx, 26 + dy, 2.3, 2.3), with: .color(ink))
            }
            ctx.fill(ellipse(68, 34, 2.6, 2.6), with: .color(Color(red: 0.96, green: 0.64, blue: 0.72).opacity(0.7)))
            ctx.fill(ellipse(94, 34, 2.6, 2.6), with: .color(Color(red: 0.96, green: 0.64, blue: 0.72).opacity(0.7)))

            var mouth = Path()
            switch mood {
            case .cheer:
                mouth.move(to: pt(74, 35)); mouth.addQuadCurve(to: pt(88, 35), control: pt(81, 45)); mouth.closeSubpath()
                ctx.fill(mouth, with: .color(ink))
            case .think:
                mouth.move(to: pt(77, 37)); mouth.addLine(to: pt(84, 37))
                ctx.stroke(mouth, with: .color(ink), style: StrokeStyle(lineWidth: 2 * s, lineCap: .round))
            default:
                mouth.move(to: pt(75, 35)); mouth.addQuadCurve(to: pt(87, 35), control: pt(81, 40))
                ctx.stroke(mouth, with: .color(ink), style: StrokeStyle(lineWidth: 2 * s, lineCap: .round))
            }
            if mood == .happy || mood == .cheer {
                var tongue = Path()
                tongue.move(to: pt(81, 41)); tongue.addLine(to: pt(81, 47))
                tongue.addLine(to: pt(78, 50)); tongue.move(to: pt(81, 47)); tongue.addLine(to: pt(84, 50))
                ctx.stroke(tongue, with: .color(Color(red: 0.89, green: 0.29, blue: 0.28)), style: StrokeStyle(lineWidth: 1.8 * s, lineCap: .round))
            }
        }
        .frame(width: size, height: size)
        .offset(y: bob ? -3 : 0)
        .onAppear {
            guard !reduceMotion else { return }
            withAnimation(.easeInOut(duration: 1.7).repeatForever(autoreverses: true)) { bob = true }
        }
        .accessibilityHidden(true)
    }
}

struct HayyaTip: View {
    let text: String
    var mood: HayyaMascot.Mood = .happy
    var color: Color? = nil

    var body: some View {
        HStack(alignment: .center, spacing: 12) {
            HayyaMascot(mood: mood, size: 56)
            VStack(alignment: .leading, spacing: 2) {
                Text("HAYYA").font(.caption2.bold()).foregroundColor(color ?? .green)
                Text(Bidi.isolate(text)).font(.subheadline).fixedSize(horizontal: false, vertical: true)
            }
            Spacer(minLength: 0)
        }
        .card()
        .accessibilityElement(children: .combine)
    }
}

struct SpeedPicker: View {
    @State private var rate = Speaker.shared.rateName

    var body: some View {
        Picker("Speech speed", selection: $rate) {
            ForEach(Speaker.rates, id: \.id) { r in Text(r.label).tag(r.id) }
        }
        .pickerStyle(.segmented)
        .onChange(of: rate) { Speaker.shared.rateName = $0 }
    }
}

// MARK: - Review (spaced repetition)

struct ReviewView: View {
    let lang: Language
    @EnvironmentObject var progress: ProgressStore
    @State private var queue: [SrsCardInfo] = []
    @State private var index = 0
    @State private var flipped = false
    @State private var first: [String: String] = [:]
    @State private var requeued = Set<String>()
    @State private var loaded = false
    @State private var logged = false

    var body: some View {
        let day = ProgressStore.day(Date())
        let lp = progress.lang(lang.id)
        let st = Engine.srsStats(lang, lp, day: day)
        ScrollView {
            VStack(alignment: .leading, spacing: 14) {
                VStack(alignment: .leading, spacing: 6) {
                    Text("\(st.learned)/\(st.total) words learned").font(.headline)
                    Text("Cards come back after 1, 3, 7, 14, 30, 60 and 120 days as you get them right, and start again when you don't. New words unlock when you finish lessons or save them in the translator.")
                        .font(.caption).foregroundColor(.secondary)
                }
                .card()

                if loaded && index >= queue.count {
                    let graded = Array(first.values)
                    let good = graded.filter { $0 != "again" }.count
                    if graded.isEmpty {
                        HayyaTip(text: st.due + st.newAvailable > 0 ? "Ready when you are." : "All caught up! Finish a lesson to unlock its words, or save words in the translator to add them here.", mood: .sleep, color: lang.color)
                    } else {
                        HayyaTip(text: "Done! You remembered \(good) of \(graded.count) on the first try. See you at the next review.", mood: .cheer, color: lang.color)
                    }
                    if st.due + st.newAvailable > 0 {
                        Button("Review more") { reload() }.buttonStyle(.borderedProminent)
                    }
                } else if index < queue.count {
                    card(queue[index], lp: lp)
                }
            }
            .padding()
            .frame(maxWidth: 760)
            .frame(maxWidth: .infinity)
        }
        .background(Color(uiColor: .systemGroupedBackground))
        .navigationTitle("Review")
        .navigationBarTitleDisplayMode(.inline)
        .tint(lang.color)
        .onAppear { if !loaded { reload() } }
    }

    private func card(_ c: SrsCardInfo, lp: LangProgress) -> some View {
        let rec = lp.srs[c.phrase.t]
        let recall = (rec?.seen ?? 0) >= 2 && c.phrase.t.count % 2 == 0
        return VStack(spacing: 14) {
            Text("Card \(index + 1) of \(queue.count) · \(rec.map { "box \($0.box)" } ?? "new word")")
                .font(.caption).foregroundColor(.secondary)
            if flipped || !recall {
                Text(c.phrase.t).font(.system(size: lang.isArabic ? 46 : 36, weight: .medium)).multilineTextAlignment(.center)
            }
            if recall && !flipped {
                Text("How do you say…").font(.caption).foregroundColor(.secondary)
                Text(c.phrase.en).font(.title2.bold()).multilineTextAlignment(.center)
            }
            if flipped {
                if let tr = c.phrase.tr { Text(tr).font(.headline.italic()).foregroundColor(lang.color) }
                Text(c.phrase.en).font(.title3)
            }
            HStack {
                SpeakButton(text: c.phrase.t, lang: lang)
                if flipped {
                    Button("↺ Again") { grade("again") }.buttonStyle(.bordered)
                    Button("✓ Good") { grade("good") }.buttonStyle(.borderedProminent)
                    Button("⚡ Easy") { grade("easy") }.buttonStyle(.bordered)
                } else {
                    Button("Show answer") { flipped = true }.buttonStyle(.borderedProminent)
                }
            }
        }
        .frame(maxWidth: .infinity)
        .card()
    }

    private func reload() {
        queue = Engine.srsQueue(lang, progress.lang(lang.id), day: ProgressStore.day(Date()))
        index = 0
        flipped = false
        first = [:]
        requeued = []
        logged = false
        loaded = true
    }

    private func grade(_ g: String) {
        let c = queue[index]
        if first[c.phrase.t] == nil { first[c.phrase.t] = g }
        let day = ProgressStore.day(Date())
        let finishing = index + 1 >= queue.count && !(g == "again" && !requeued.contains(c.phrase.t))
        let graded = Array(first.values)
        let pct = Engine.percent(graded.filter { $0 != "again" }.count, graded.count)
        progress.update(lang, xp: finishing && !logged ? graded.count : 0) { lp in
            Engine.srsGrade(&lp, c.phrase.t, grade: g, day: day)
            if finishing && !logged { lp.logPractice("reading", pct) }
        }
        if finishing { logged = true }
        if g == "again" && !requeued.contains(c.phrase.t) {
            requeued.insert(c.phrase.t)
            queue.append(c)
        }
        index += 1
        flipped = false
    }
}

// MARK: - Listening

struct ListeningPracticeView: View {
    let lang: Language
    @EnvironmentObject var progress: ProgressStore
    @State private var mode = "dictation"
    @State private var level = "A1"
    @State private var index = -1
    @State private var typed = ""
    @State private var score: Int?
    @State private var options: [String] = []
    @State private var picked: Int?
    @State private var showText = false
    @State private var started = false

    private var pool: [ListenItem] {
        Engine.listeningItems(lang).filter { Engine.levelIndex($0.level) <= Engine.levelIndex(level) }
    }

    var body: some View {
        let items = pool
        let lp = progress.lang(lang.id)
        let all = Engine.listeningItems(lang)
        let understood = all.filter { (lp.listening[$0.phrase.t]?.best ?? 0) >= Engine.listenPass }.count
        ScrollView {
            VStack(alignment: .leading, spacing: 14) {
                VStack(alignment: .leading, spacing: 8) {
                    Text("\(understood)/\(all.count) lines understood").font(.headline)
                    Text("Real fluency needs hours of listening. Start slow, then switch to natural speed. The voice comes from your device, so it's clearer than street speech; add native media from Media Picks too.")
                        .font(.caption).foregroundColor(.secondary)
                    Picker("Exercise", selection: $mode) {
                        Text("Dictation").tag("dictation")
                        Text("What does it mean?").tag("meaning")
                    }
                    .pickerStyle(.segmented)
                    SpeedPicker()
                    Picker("Up to level", selection: $level) {
                        ForEach(Engine.levels, id: \.self) { Text("Up to \($0)").tag($0) }
                    }
                    .pickerStyle(.menu)
                }
                .card()

                if !items.isEmpty && index >= 0 && index < items.count {
                    exercise(items[index], lp: lp, count: items.count)
                }
            }
            .padding()
            .frame(maxWidth: 760)
            .frame(maxWidth: .infinity)
        }
        .background(Color(uiColor: .systemGroupedBackground))
        .navigationTitle("Listening")
        .navigationBarTitleDisplayMode(.inline)
        .tint(lang.color)
        .onAppear {
            guard !started else { return }
            started = true
            level = Engine.fluency(lang, progress.lang(lang.id)).overallBand
            jumpToFirstUnheard()
        }
        .onChange(of: level) { _ in jumpToFirstUnheard() }
        .onChange(of: mode) { _ in resetItem() }
    }

    private func exercise(_ it: ListenItem, lp: LangProgress, count: Int) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Line \(index + 1) of \(count)").font(.caption).foregroundColor(.secondary)
                LevelBadge(level: it.level, color: lang.color)
                Spacer()
                Text(lp.listening[it.phrase.t].map { "Best \($0.best)%" } ?? "Not tried yet").font(.caption)
            }
            HStack {
                Button {
                    Speaker.shared.speak(it.phrase.t, language: lang.speech)
                } label: { Label("Play", systemImage: "play.fill") }
                    .buttonStyle(.borderedProminent)
                if !showText && score == nil && picked == nil {
                    Button("Show text") { showText = true }.buttonStyle(.bordered)
                }
            }
            if mode == "dictation" {
                Text("Listen and type exactly what you hear.").font(.headline)
                TextField(lang.isArabic ? "اكتب هنا" : "Escribe aquí", text: $typed)
                    .font(.system(size: lang.isArabic ? 26 : 20))
                    .multilineTextAlignment(lang.isRTL ? .trailing : .leading)
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled()
                    .padding(10)
                    .background(RoundedRectangle(cornerRadius: 12).fill(Color(uiColor: .tertiarySystemFill)))
                    .disabled(score != nil)
                    .onSubmit { checkDictation(it) }
                if score == nil, let keys = lang.reading.keyboard { KeyPad(keys: keys, lang: lang, text: $typed) }
                if let s = score {
                    Text(s >= Engine.listenPass ? "✓ Great listening! Score: \(s)%" : "Not quite. Compare with the line below. Score: \(s)%")
                        .font(.subheadline.bold()).foregroundColor(s >= Engine.listenPass ? .green : .orange)
                }
                if showText || score != nil { lineText(it) }
                if score == nil { Button("Check") { checkDictation(it) }.buttonStyle(.borderedProminent) }
            } else {
                Text("Listen. What does it mean?").font(.headline)
                if showText || picked != nil { lineText(it) }
                ForEach(Array(options.enumerated()), id: \.offset) { i, option in
                    Button {
                        guard picked == nil else { return }
                        picked = i
                        let correct = option == it.phrase.en
                        progress.recordListening(lang, line: it.phrase.t, score: correct ? (showText ? 60 : 100) : 0)
                    } label: {
                        Text(option)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .padding(12)
                            .background(RoundedRectangle(cornerRadius: 12).fill(optionColor(i, it)))
                    }
                    .buttonStyle(.plain)
                }
                if let p = picked {
                    Text(options[p] == it.phrase.en ? "✓ Correct!" : "✗ It means: \(it.phrase.en)")
                        .font(.subheadline.bold()).foregroundColor(options[p] == it.phrase.en ? .green : .red)
                }
            }
            HStack {
                Button { move(-1) } label: { Label("Previous", systemImage: "chevron.left") }.buttonStyle(.bordered).disabled(index == 0)
                Spacer()
                Button { move(1) } label: { Label("Next", systemImage: "chevron.right") }.buttonStyle(.bordered).disabled(index >= count - 1)
            }
        }
        .card()
    }

    private func lineText(_ it: ListenItem) -> some View {
        VStack(spacing: 4) {
            Text(it.phrase.t).font(.system(size: lang.isArabic ? 28 : 22, weight: .medium)).multilineTextAlignment(.center)
            if let tr = it.phrase.tr { Text(tr).font(.subheadline.italic()).foregroundColor(lang.color) }
            if score != nil || picked != nil { Text(it.phrase.en).font(.subheadline) }
        }
        .frame(maxWidth: .infinity)
    }

    private func optionColor(_ i: Int, _ it: ListenItem) -> Color {
        guard let p = picked else { return Color(uiColor: .tertiarySystemGroupedBackground) }
        if options[i] == it.phrase.en { return Color.green.opacity(0.15) }
        if i == p { return Color.red.opacity(0.15) }
        return Color(uiColor: .tertiarySystemGroupedBackground)
    }

    private func checkDictation(_ it: ListenItem) {
        guard score == nil else { return }
        let s = Engine.dictationScore(typed, it.phrase.t, lang: lang.id)
        score = s
        progress.recordListening(lang, line: it.phrase.t, score: s)
    }

    private func jumpToFirstUnheard() {
        let lp = progress.lang(lang.id)
        index = max(0, pool.firstIndex { (lp.listening[$0.phrase.t]?.best ?? 0) < Engine.listenPass } ?? 0)
        resetItem()
    }

    private func move(_ d: Int) {
        index += d
        resetItem()
    }

    private func resetItem() {
        typed = ""
        score = nil
        picked = nil
        showText = false
        let items = pool
        guard index >= 0, index < items.count else { options = []; return }
        let it = items[index]
        let wrong = items.filter { $0.phrase.en != it.phrase.en }.shuffled().prefix(3).map(\.phrase.en)
        options = ([it.phrase.en] + wrong).shuffled()
    }
}

// MARK: - Free writing and speaking

struct PromptFeedbackView: View {
    let analysis: PromptAnalysis
    let prompt: PracticePrompt
    let lang: Language
    @State private var showModel = false

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(analysis.passed ? "✓ Well done! Score: \(analysis.score)%" : "Good start. Check the points below. Score: \(analysis.score)%")
                .font(.headline).foregroundColor(analysis.passed ? .green : .orange)
            Text("\(analysis.words) words (aim for \(prompt.minWords)+)").font(.caption)
            ForEach(analysis.requirements, id: \.self) { r in
                Text("\(r.met ? "✓" : "○") \(r.label)").font(.subheadline).foregroundColor(r.met ? .green : .secondary)
            }
            if !analysis.accentHints.isEmpty {
                Text("Check \(lang.isArabic ? "the hamza / spelling" : "the accents"): " + analysis.accentHints.map { "\($0.word) → \($0.suggestion)" }.joined(separator: ", "))
                    .font(.subheadline)
            }
            if !analysis.unknown.isEmpty {
                Text("Words the course doesn't know (check the spelling, or they may be names): \(analysis.unknown.joined(separator: ", "))")
                    .font(.subheadline)
            }
            DisclosureGroup("Model answer", isExpanded: $showModel) {
                PhraseRow(phrase: prompt.model, lang: lang).padding(.top, 4)
            }
            Text("Automatic checks can't judge every grammar point. Compare with the model, and if you can, show your work to a tutor or native speaker.")
                .font(.caption).foregroundColor(.secondary)
        }
        .onAppear { showModel = !analysis.passed }
    }
}

struct WritingStudioView: View {
    let lang: Language
    @EnvironmentObject var content: ContentStore
    @EnvironmentObject var progress: ProgressStore
    @State private var selected: PracticePrompt?

    init(lang: Language, initialPromptId: String? = nil) {
        self.lang = lang
        _selected = State(initialValue: lang.writingPrompts.first { $0.id == initialPromptId })
    }
    @State private var text = ""
    @State private var analysis: PromptAnalysis?

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 14) {
                if let pr = selected {
                    editor(pr)
                } else {
                    Text("Write freely in \(lang.name). You'll get automatic feedback on the required points, length, spelling and \(lang.isArabic ? "hamza" : "accents"), plus a model answer to compare with.")
                        .font(.subheadline).card()
                    ForEach(lang.writingPrompts) { pr in
                        let rec = progress.lang(lang.id).prompts[pr.id]
                        Button {
                            selected = pr
                            text = ""
                            analysis = nil
                        } label: {
                            VStack(alignment: .leading, spacing: 6) {
                                Text(pr.prompt).font(.headline).multilineTextAlignment(.leading)
                                HStack {
                                    LevelBadge(level: pr.level, color: lang.color)
                                    Text("\(pr.minWords)+ words").font(.caption)
                                    if let r = rec { Text("Best \(r.best)%").font(.caption.bold()).foregroundColor(r.best >= Engine.promptPass ? .green : .secondary) }
                                }
                            }
                            .card()
                        }
                        .buttonStyle(.plain)
                    }
                }
            }
            .padding()
            .frame(maxWidth: 760)
            .frame(maxWidth: .infinity)
        }
        .background(Color(uiColor: .systemGroupedBackground))
        .navigationTitle("Writing Studio")
        .navigationBarTitleDisplayMode(.inline)
        .tint(lang.color)
    }

    private func editor(_ pr: PracticePrompt) -> some View {
        let words = text.components(separatedBy: .whitespacesAndNewlines).filter { !Engine.normalize($0, lang: lang.id).isEmpty }.count
        return VStack(alignment: .leading, spacing: 10) {
            HStack {
                LevelBadge(level: pr.level, color: lang.color)
                Spacer()
                Button("← All prompts") { selected = nil }.buttonStyle(.bordered)
            }
            Text(pr.prompt).font(.title3.bold())
            Text("Include: " + pr.requirements.map(\.label).joined(separator: " · ")).font(.caption).foregroundColor(.secondary)
            TextEditor(text: $text)
                .font(.system(size: lang.isArabic ? 22 : 18))
                .multilineTextAlignment(lang.isRTL ? .trailing : .leading)
                .frame(minHeight: 160)
                .padding(6)
                .background(RoundedRectangle(cornerRadius: 12).fill(Color(uiColor: .tertiarySystemFill)))
                .autocorrectionDisabled()
                .textInputAutocapitalization(.never)
            if let keys = lang.reading.keyboard { KeyPad(keys: keys, lang: lang, text: $text) }
            HStack {
                Button("Check my writing") {
                    let a = Engine.analyzePrompt(text, pr, lang, content.index(for: lang))
                    analysis = a
                    progress.recordPrompt(lang, id: pr.id, score: a.score, selfChecked: false, skill: "writing")
                }
                .buttonStyle(.borderedProminent)
                Text("\(words) words").font(.caption).foregroundColor(.secondary)
            }
            if let a = analysis { PromptFeedbackView(analysis: a, prompt: pr, lang: lang).id(a.score + a.words) }
        }
        .card()
    }
}

/// "Answer questions" tab of Speaking Practice: free spoken answers checked like writing.
struct AnswerPromptView: View {
    let lang: Language
    @ObservedObject var listener: SpeechListener
    @EnvironmentObject var content: ContentStore
    @EnvironmentObject var progress: ProgressStore
    @State private var index = 0
    @State private var typed = ""
    @State private var analysis: PromptAnalysis?
    @State private var transcript = ""
    @State private var selfChecked = false

    var body: some View {
        let prompts = lang.speakingPrompts
        let pr = prompts[min(index, prompts.count - 1)]
        let lp = progress.lang(lang.id)
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text("Prompt \(index + 1) of \(prompts.count)").font(.caption).foregroundColor(.secondary)
                LevelBadge(level: pr.level, color: lang.color)
                Spacer()
                Text(lp.prompts[pr.id].map { "Best \($0.best)%\($0.selfChecked == true ? " (self)" : "")" } ?? "Not tried yet").font(.caption)
            }
            Text(pr.prompt).font(.title3.bold())
            if let starter = pr.starter {
                Text("Start with: \(starter)").font(.subheadline)
            }
            Text("Include: " + pr.requirements.map(\.label).joined(separator: " · ")).font(.caption).foregroundColor(.secondary)
            HStack {
                if listener.status == .listening {
                    Button { listener.stopListening() } label: { Label("I'm done speaking", systemImage: "stop.circle.fill") }
                        .buttonStyle(.borderedProminent).tint(.red)
                } else {
                    Button {
                        listener.listenForAnswer(locale: lang.speech) { text in
                            transcript = text
                            let a = Engine.analyzePrompt(text, pr, lang, content.index(for: lang))
                            analysis = a
                            progress.recordPrompt(lang, id: pr.id, score: a.score, selfChecked: false, skill: "speaking")
                        }
                    } label: { Label("Answer aloud", systemImage: "mic.fill") }
                        .buttonStyle(.borderedProminent)
                }
                Button("I answered aloud ✓") {
                    listener.markSelfChecked()
                    selfChecked = true
                    progress.recordPrompt(lang, id: pr.id, score: Engine.promptPass, selfChecked: true, skill: "speaking")
                }
                .buttonStyle(.bordered)
            }
            if case .failed(let message) = listener.status {
                Text(message).font(.caption).foregroundColor(.red)
            }
            if !transcript.isEmpty { Text("I heard: “\(transcript)”").font(.subheadline) }
            if selfChecked {
                Text("✓ Marked as practised (self-checked). Only transcribed answers change your accuracy.").font(.caption).foregroundColor(.green)
            }
            DisclosureGroup("Or type what you said") {
                VStack(alignment: .leading) {
                    TextField("", text: $typed, axis: .vertical)
                        .lineLimit(2...5)
                        .padding(8)
                        .background(RoundedRectangle(cornerRadius: 10).fill(Color(uiColor: .tertiarySystemFill)))
                    Button("Check") {
                        let a = Engine.analyzePrompt(typed, pr, lang, content.index(for: lang))
                        analysis = a
                        // Typing isn't speaking, so it counts as a self-check for speaking accuracy.
                        progress.recordPrompt(lang, id: pr.id, score: a.score, selfChecked: true, skill: "speaking")
                    }
                    .buttonStyle(.bordered)
                }
            }
            if let a = analysis { PromptFeedbackView(analysis: a, prompt: pr, lang: lang).id(a.score + a.words) }
            HStack {
                Button { move(-1) } label: { Label("Previous", systemImage: "chevron.left") }.buttonStyle(.bordered).disabled(index == 0)
                Spacer()
                Button { move(1) } label: { Label("Next", systemImage: "chevron.right") }.buttonStyle(.bordered).disabled(index >= prompts.count - 1)
            }
        }
        .card()
    }

    private func move(_ d: Int) {
        index += d
        typed = ""
        transcript = ""
        analysis = nil
        selfChecked = false
        listener.reset()
    }
}

// MARK: - Path to fluency

struct PathToFluencyView: View {
    let lang: Language
    let lp: LangProgress
    @EnvironmentObject var content: ContentStore

    /// FSI's published estimate to professional working proficiency (ILR 3, roughly C1).
    private var fsiNote: String {
        lang.isArabic
            ? "The US Foreign Service Institute puts Arabic in its hardest category: about 2,200 classroom hours (88 weeks of full-time study) for professional working proficiency, roughly C1."
            : "The US Foreign Service Institute puts Spanish in its easiest category: about 600–750 classroom hours (24–30 weeks of full-time study) for professional working proficiency, roughly C1."
    }

    private func format(_ minutes: Int) -> String {
        minutes >= 60 ? String(format: "%.1f h", Double(minutes) / 60) : "\(minutes) min"
    }

    var body: some View {
        let t = Engine.studyTime(lang, lp)
        VStack(alignment: .leading, spacing: 10) {
            Text("🧭 Your path to fluency").font(.headline)
            HStack(spacing: 24) {
                VStack(alignment: .leading) {
                    Text(format(t.minutes)).font(.title.bold()).foregroundColor(lang.color)
                    Text("active study time").font(.caption).foregroundColor(.secondary)
                }
                VStack(alignment: .leading) {
                    Text(format(t.weekMinutes)).font(.title.bold()).foregroundColor(lang.color)
                    Text("in the last 7 days").font(.caption).foregroundColor(.secondary)
                }
            }
            Text("\(fsiNote) The hours for the earlier levels are our estimates. Self-study usually takes longer than full-time classes, and time counts only while you're actively using the app. Level descriptions follow the Council of Europe's CEFR.")
                .font(.caption).foregroundColor(.secondary)
            ForEach(Engine.levels, id: \.self) { level in
                let need = Double(lang.levelHours[level] ?? 1)
                HStack(alignment: .top) {
                    LevelBadge(level: level, color: lang.color)
                    VStack(alignment: .leading, spacing: 2) {
                        HStack {
                            Text("\(Int(need)) h").font(.caption.bold().monospacedDigit())
                            ProgressView(value: min(t.hours, need), total: need).tint(lang.color)
                        }
                        Text(content.levelGuide[level]?.cefr ?? "").font(.caption)
                    }
                }
            }
            Text("Beyond the app").font(.subheadline.bold()).padding(.top, 4)
            Text("• Talk to people every week: a tutor (for example on italki or Preply) or a language exchange (Tandem, HelloTalk, local meetups). Use the scenarios and speaking prompts as topics.")
            NavigationLink(value: Route.resources(lang.id)) {
                Text("• Take a free university or government course: see Free Courses & Resources.")
                    .multilineTextAlignment(.leading)
            }
            Text("• Listen for hours: climb the Media Picks ladder and move up when you understand most of it.")
            Text("• Read real texts and save new words in the translator; they'll appear in Review.")
            Text(lang.isArabic ? "• Pick a dialect: use the Egyptian or Levantine lessons, then watch shows in that dialect." : "• Spend time in Mexico if you can: even a week of immersion makes everything click.")
        }
        .font(.caption)
        .card()
    }
}
