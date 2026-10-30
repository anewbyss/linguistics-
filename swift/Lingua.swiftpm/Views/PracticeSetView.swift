import SwiftUI

/// A generated practice set for a lesson, topic or level. "Another set" builds a fresh, random one.
struct PracticeSetView: View {
    let lang: Language
    let scopeType: String
    let scopeId: String
    @EnvironmentObject var progress: ProgressStore
    @State private var items: [PracticeItem] = []
    @State private var index = 0
    @State private var results: [Bool] = []
    @State private var picked: Int?
    @State private var typed = ""
    @State private var typeResult: WritingCheck?
    @State private var chosen: [Int] = []
    @State private var showText = false
    @State private var finished = false

    private var scope: PracticeScope? { Engine.practiceScope(lang, type: scopeType, id: scopeId) }
    private var answered: Bool { results.count > index }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 14) {
                if let sc = scope {
                    HStack {
                        Text("🔁 \(sc.title) · \(finished ? "done" : "\(min(index + 1, max(items.count, 1))) of \(items.count)")")
                            .font(.caption).foregroundColor(.secondary)
                        Spacer()
                        if let best = progress.lang(lang.id).checks["drill:\(sc.key)"] {
                            Text("Best \(best)%").font(.caption.bold())
                        }
                    }
                    if finished {
                        summary(sc)
                    } else if index < items.count {
                        ProgressView(value: Double(index), total: Double(items.count)).tint(lang.color)
                        itemView(items[index]).card()
                    }
                }
            }
            .padding()
            .frame(maxWidth: 760)
            .frame(maxWidth: .infinity)
        }
        .background(Color(uiColor: .systemGroupedBackground))
        .navigationTitle("Practice")
        .navigationBarTitleDisplayMode(.inline)
        .tint(lang.color)
        .onAppear { if items.isEmpty { newSet() } }
    }

    private func newSet() {
        items = Engine.practiceSet(lang, type: scopeType, id: scopeId, seed: UInt32.random(in: 0...UInt32.max))
        index = 0
        results = []
        finished = false
        resetItem()
    }

    private func resetItem() {
        picked = nil
        typed = ""
        typeResult = nil
        chosen = []
        showText = false
    }

    @ViewBuilder
    private func itemView(_ it: PracticeItem) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            switch it.kind {
            case .choice: choiceView(it)
            case .type: typeView(it)
            case .order: orderView(it)
            }
            if answered {
                Button(index + 1 < items.count ? "Next →" : "Finish") { next() }
                    .buttonStyle(.borderedProminent)
            }
        }
    }

    private func feedback(_ ok: Bool, _ wrong: String, _ it: PracticeItem) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(ok ? "✓ Correct!" : "✗ \(wrong)").font(.subheadline.bold()).foregroundColor(ok ? .green : .red)
            if let e = it.explain { Text(Bidi.isolate(e)).font(.subheadline) }
        }
    }

    private func choiceView(_ it: PracticeItem) -> some View {
        let hideText = it.audio && !answered && !showText
        return VStack(alignment: .leading, spacing: 10) {
            if let c = it.context { Text(Bidi.isolate(c)).font(.caption).foregroundColor(.secondary) }
            Text(Bidi.isolate(it.q)).font(.headline)
            if it.audio, let t = it.t {
                HStack {
                    Button { Speaker.shared.speak(t, language: lang.speech) } label: { Label("Play", systemImage: "play.fill") }
                        .buttonStyle(.borderedProminent)
                    if hideText { Button("Show text") { showText = true }.buttonStyle(.bordered) }
                }
            }
            if let t = it.t, !hideText {
                HStack {
                    TargetText(text: t, lang: lang, size: 24)
                    Spacer()
                    if !t.contains("__") { SpeakButton(text: t, lang: lang) }
                }
                if let tr = it.tr, answered || !it.audio { Text(tr).font(.subheadline.italic()).foregroundColor(lang.color) }
            }
            ForEach(Array(it.options.enumerated()), id: \.offset) { i, option in
                Button {
                    guard !answered else { return }
                    picked = i
                    results.append(i == it.answer)
                } label: {
                    Text(option)
                        .font(Engine.hasArabic(option) ? .title3 : .body)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(12)
                        .background(RoundedRectangle(cornerRadius: 12).fill(fill(i, it)))
                }
                .buttonStyle(.plain)
                .disabled(answered)
            }
            if answered { feedback(results[index], "The answer is: \(it.options[it.answer])", it) }
        }
    }

    private func fill(_ i: Int, _ it: PracticeItem) -> Color {
        guard answered else { return Color(uiColor: .tertiarySystemGroupedBackground) }
        if i == it.answer { return Color.green.opacity(0.15) }
        if i == picked { return Color.red.opacity(0.15) }
        return Color(uiColor: .tertiarySystemGroupedBackground)
    }

    private func typeView(_ it: PracticeItem) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(it.q).font(.headline)
            TextField(lang.isArabic ? "اكتب هنا" : "Escribe aquí", text: $typed)
                .font(.system(size: lang.isArabic ? 26 : 20))
                .multilineTextAlignment(lang.isRTL ? .trailing : .leading)
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled()
                .padding(10)
                .background(RoundedRectangle(cornerRadius: 12).fill(Color(uiColor: .tertiarySystemFill)))
                .disabled(answered)
                .onSubmit { check(it) }
            if !answered {
                if let keys = lang.reading.keyboard { KeyPad(keys: keys, lang: lang, text: $typed) }
                if let hint = it.hint { DisclosureGroup("Hint") { Text(hint).font(.caption) }.font(.caption) }
                Button("Check") { check(it) }.buttonStyle(.borderedProminent)
            }
            if let r = typeResult { feedback(r.ok, "The answer is: \(it.answerText)", it) }
        }
    }

    private func check(_ it: PracticeItem) {
        guard !answered, !typed.trimmingCharacters(in: .whitespaces).isEmpty else { return }
        let r = Engine.checkWriting(typed, task: WritingTask(en: "", answer: it.answerText, alts: nil, hint: nil), lang: lang.id)
        typeResult = r
        results.append(r.ok)
    }

    private func orderView(_ it: PracticeItem) -> some View {
        let layout = lang.isRTL ? LayoutDirection.rightToLeft : .leftToRight
        return VStack(alignment: .leading, spacing: 10) {
            Text("Put the words in order: “\(it.en)”").font(.headline)
            TileFlow(spacing: 8) {
                ForEach(Array(chosen.enumerated()), id: \.offset) { pos, k in
                    tile(it.tiles[k], placed: true) { if !answered { chosen.remove(at: pos) } }
                }
            }
            .frame(maxWidth: .infinity, minHeight: 48, alignment: .leading)
            .padding(8)
            .background(RoundedRectangle(cornerRadius: 12).strokeBorder(style: StrokeStyle(lineWidth: 2, dash: [5])).foregroundColor(.secondary.opacity(0.5)))
            .environment(\.layoutDirection, layout)
            if !answered {
                TileFlow(spacing: 8) {
                    ForEach(Array(it.tiles.enumerated()), id: \.offset) { k, word in
                        if !chosen.contains(k) { tile(word, placed: false) { chosen.append(k) } }
                    }
                }
                .environment(\.layoutDirection, layout)
                HStack {
                    Button("Check") { results.append(Engine.checkOrder(chosen.map { it.tiles[$0] }, it.tokens)) }
                        .buttonStyle(.borderedProminent)
                        .disabled(chosen.count != it.tiles.count)
                    if !chosen.isEmpty { Button("Clear") { chosen = [] }.buttonStyle(.bordered) }
                }
            } else {
                feedback(results[index], "The sentence is: \(it.tokens.joined(separator: " "))\(it.tr.map { " · \($0)" } ?? "")", it)
            }
        }
    }

    private func tile(_ word: String, placed: Bool, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(word)
                .font(.system(size: lang.isArabic ? 22 : 18))
                .padding(.horizontal, 12).padding(.vertical, 6)
                .background(RoundedRectangle(cornerRadius: 10).fill(Color(uiColor: .secondarySystemGroupedBackground)))
                .overlay(RoundedRectangle(cornerRadius: 10).stroke(placed ? lang.color : Color.secondary.opacity(0.3)))
        }
        .buttonStyle(.plain)
    }

    private func next() {
        if index + 1 >= items.count {
            finish()
        } else {
            index += 1
            resetItem()
        }
    }

    private func finish() {
        guard let sc = scope else { return }
        let correct = results.filter { $0 }.count
        let score = Engine.percent(correct, results.count)
        let skills = items.prefix(results.count).map(\.skill)
        progress.update(lang, xp: correct * 3) { lp in
            lp.checks["drill:\(sc.key)"] = max(lp.checks["drill:\(sc.key)"] ?? 0, score)
            for skill in Engine.skills {
                let rs = zip(skills, results).filter { $0.0 == skill }.map(\.1)
                if !rs.isEmpty { lp.logPractice(skill, Engine.percent(rs.filter { $0 }.count, rs.count)) }
            }
        }
        finished = true
    }

    private func summary(_ sc: PracticeScope) -> some View {
        let correct = results.filter { $0 }.count
        let score = Engine.percent(correct, results.count)
        let level = sc.lessons.first?.level ?? "A1"
        let nextLevel = Engine.levels.firstIndex(of: scopeId).flatMap { $0 + 1 < Engine.levels.count ? Engine.levels[$0 + 1] : nil }
        return VStack(spacing: 12) {
            Text("\(score)%").font(.system(size: 52, weight: .bold)).foregroundColor(lang.color)
            Text("\(correct) of \(results.count) correct.")
            HayyaTip(text: score >= Engine.practicePass ? "Excellent! Try a wider set, or keep going: every set is different." : "Nice work. Another set mixes the same material in new ways, and that repetition is what makes it stick.",
                     mood: score >= Engine.practicePass ? .cheer : .happy, color: lang.color)
            Button("🔁 Another set") { newSet() }.buttonStyle(.borderedProminent)
            if scopeType == "lesson", let cat = sc.categories.first {
                NavigationLink(value: Route.practice(lang.id, "cat", cat.id)) { Text("Whole topic: \(cat.title)") }.buttonStyle(.bordered)
            }
            if scopeType != "level" {
                NavigationLink(value: Route.practice(lang.id, "level", level)) { Text("All of \(level)") }.buttonStyle(.bordered)
            } else if let nextLevel = nextLevel {
                NavigationLink(value: Route.practice(lang.id, "level", nextLevel)) { Text("Try \(nextLevel)") }.buttonStyle(.bordered)
            }
        }
        .frame(maxWidth: .infinity)
        .card()
    }
}

/// Wraps tiles onto as many lines as needed (respects the layout direction).
struct TileFlow: Layout {
    var spacing: CGFloat = 8

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let width = proposal.width ?? 320
        var x: CGFloat = 0, y: CGFloat = 0, rowHeight: CGFloat = 0
        for v in subviews {
            let s = v.sizeThatFits(.unspecified)
            if x > 0 && x + s.width > width { x = 0; y += rowHeight + spacing; rowHeight = 0 }
            x += s.width + spacing
            rowHeight = max(rowHeight, s.height)
        }
        return CGSize(width: width, height: y + rowHeight)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        var x = bounds.minX, y = bounds.minY, rowHeight: CGFloat = 0
        for v in subviews {
            let s = v.sizeThatFits(.unspecified)
            if x > bounds.minX && x + s.width > bounds.maxX { x = bounds.minX; y += rowHeight + spacing; rowHeight = 0 }
            v.place(at: CGPoint(x: x, y: y), proposal: ProposedViewSize(s))
            x += s.width + spacing
            rowHeight = max(rowHeight, s.height)
        }
    }
}

/// "Keep practicing" prompt for lessons and topics.
struct KeepPracticingCard: View {
    let lang: Language
    let scopeType: String
    let scopeId: String
    let text: String
    var extra: [(String, Route)] = []
    @EnvironmentObject var progress: ProgressStore

    var body: some View {
        let key = Engine.practiceScope(lang, type: scopeType, id: scopeId)?.key ?? ""
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text("🔁 Keep practicing").font(.headline)
                Spacer()
                if let best = progress.lang(lang.id).checks["drill:\(key)"] { Text("Best \(best)%").font(.caption.bold()) }
            }
            Text(text).font(.caption).foregroundColor(.secondary)
            HStack {
                NavigationLink(value: Route.practice(lang.id, scopeType, scopeId)) {
                    Text(scopeType == "lesson" ? "Practice this lesson" : scopeType == "cat" ? "Practice this topic" : "Practice all of \(scopeId)")
                }
                .buttonStyle(.borderedProminent)
                ForEach(Array(extra.enumerated()), id: \.offset) { _, item in
                    NavigationLink(value: item.1) { Text(item.0) }.buttonStyle(.bordered)
                }
            }
        }
        .card()
    }
}
