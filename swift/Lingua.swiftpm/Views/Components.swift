import SwiftUI
import UIKit

struct CardModifier: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding()
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Color(uiColor: .secondarySystemGroupedBackground))
            .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
    }
}

extension View {
    func card() -> some View { modifier(CardModifier()) }
}

struct SpeakButton: View {
    let text: String
    let lang: Language

    var body: some View {
        Button {
            Speaker.shared.speak(text, language: lang.speech)
        } label: {
            Image(systemName: "speaker.wave.2.fill")
                .font(.subheadline)
                .padding(8)
                .background(Circle().fill(Color(uiColor: .tertiarySystemFill)))
        }
        .buttonStyle(.plain)
        .accessibilityLabel("Listen")
    }
}

struct LevelBadge: View {
    let level: String
    var color: Color = .accentColor

    var body: some View {
        Text(level)
            .font(.caption.bold())
            .padding(.horizontal, 8)
            .padding(.vertical, 3)
            .background(Capsule().fill(color))
            .foregroundColor(.white)
            .accessibilityLabel("Level \(level), \(Engine.levelNames[level] ?? "")")
    }
}

/// Target-language text with the right font size and direction.
struct TargetText: View {
    let text: String
    let lang: Language
    var size: CGFloat = 20

    var body: some View {
        Text(text)
            .font(.system(size: lang.isArabic ? size * 1.25 : size, weight: lang.isArabic ? .regular : .semibold))
            .multilineTextAlignment(lang.isRTL ? .trailing : .leading)
            .environment(\.layoutDirection, lang.isRTL ? .rightToLeft : .leftToRight)
    }
}

struct PhraseRow: View {
    let phrase: Phrase
    let lang: Language
    @AppStorage(Prefs.showTransliteration) private var showTr = true
    @State private var peek = false

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            VStack(alignment: .leading, spacing: 3) {
                TargetText(text: phrase.t, lang: lang)
                if let tr = phrase.tr, !tr.isEmpty {
                    // With transliteration off, the line is blurred until tapped.
                    Text(tr).font(.subheadline.italic()).foregroundColor(lang.color)
                        .blur(radius: showTr || peek ? 0 : 5)
                        .onTapGesture { if !showTr { peek.toggle() } }
                        .accessibilityHidden(!showTr && !peek)
                }
                Text(phrase.en).font(.subheadline)
                if let note = phrase.note {
                    Text("💡 \(note)").font(.caption).foregroundColor(.secondary)
                }
            }
            Spacer(minLength: 0)
            SpeakButton(text: phrase.t, lang: lang)
        }
        .padding(12)
        .background(Color(uiColor: .tertiarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
    }
}

struct TableView: View {
    let table: TableData

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            Grid(alignment: .leading, horizontalSpacing: 14, verticalSpacing: 8) {
                GridRow {
                    ForEach(Array(table.headers.enumerated()), id: \.offset) { _, header in
                        Text(header).font(.caption.bold()).foregroundColor(.secondary)
                    }
                }
                Divider()
                ForEach(Array(table.rows.enumerated()), id: \.offset) { _, row in
                    GridRow {
                        ForEach(Array(row.enumerated()), id: \.offset) { _, cell in
                            Text(Bidi.isolate(cell))
                                .font(Engine.hasArabic(cell) ? .body : .subheadline)
                                .fixedSize(horizontal: false, vertical: true)
                                .frame(maxWidth: 230, alignment: .leading)
                        }
                    }
                }
            }
            .padding(.vertical, 4)
        }
    }
}

struct SectionHeader: View {
    let icon: String
    let title: String

    var body: some View {
        Text("\(icon) \(title)").font(.headline)
    }
}

struct StatPill: View {
    let value: String
    let label: String

    var body: some View {
        VStack(spacing: 2) {
            Text(value).font(.title.bold())
            Text(label).font(.caption).foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .card()
    }
}

/// On-screen keys appended to a text binding (Arabic letters, Spanish accents).
struct KeyPad: View {
    let keys: [String]
    let lang: Language
    @Binding var text: String

    var body: some View {
        LazyVGrid(columns: [GridItem(.adaptive(minimum: 40), spacing: 6)], spacing: 6) {
            ForEach(keys, id: \.self) { key in
                keyButton(key) { text.append(key) }
            }
            if lang.isArabic {
                keyButton("␣") { text.append(" ") }
            }
            keyButton("⌫") { if !text.isEmpty { text.removeLast() } }
        }
        .environment(\.layoutDirection, lang.isRTL ? .rightToLeft : .leftToRight)
    }

    private func keyButton(_ label: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(label)
                .font(.system(size: lang.isArabic ? 22 : 18))
                .frame(minWidth: 40, minHeight: 40)
                .background(RoundedRectangle(cornerRadius: 8).fill(Color(uiColor: .tertiarySystemFill)))
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Quiz

enum QuizMode {
    case practice // feedback after each answer
    case test     // no feedback, advance immediately
}

struct QuizView: View {
    let questions: [Question]
    let mode: QuizMode
    let lang: Language
    var showSummary = true
    var onFinish: (_ correct: Int, _ answers: [Int]) -> Void

    @State private var index = 0
    @State private var picked: Int?
    @State private var answers: [Int] = []
    @State private var correct = 0
    @State private var finished = false

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            if finished {
                if showSummary { summary }
            } else if index < questions.count {
                questionView(questions[index])
            }
        }
    }

    private var summary: some View {
        VStack(spacing: 8) {
            Text("\(Engine.percent(correct, questions.count))%")
                .font(.system(size: 48, weight: .bold))
                .foregroundColor(lang.color)
            Text("\(correct) of \(questions.count) correct. Progress saved.")
            Button("Try again") { restart() }
                .buttonStyle(.bordered)
        }
        .frame(maxWidth: .infinity)
    }

    private func questionView(_ q: Question) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Question \(index + 1) of \(questions.count)").font(.caption).foregroundColor(.secondary)
            ProgressView(value: Double(index), total: Double(questions.count)).tint(lang.color)
            Text(q.q).font(.headline)
            if let t = q.t {
                HStack {
                    TargetText(text: t, lang: lang, size: 24)
                    Spacer()
                    // A fill-in-the-blank sentence ("أنا ___") isn't worth reading aloud.
                    if !t.contains("__") { SpeakButton(text: t, lang: lang) }
                }
            }
            ForEach(Array(q.options.enumerated()), id: \.offset) { i, option in
                Button {
                    pick(i, q)
                } label: {
                    Text(option)
                        .font(Engine.hasArabic(option) ? .title3 : .body)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(12)
                        .background(RoundedRectangle(cornerRadius: 12).fill(fill(for: i, q)))
                        .overlay(RoundedRectangle(cornerRadius: 12).stroke(stroke(for: i, q), lineWidth: 1.5))
                }
                .buttonStyle(.plain)
                .disabled(picked != nil && mode == .practice)
            }
            if let p = picked, mode == .practice {
                let ok = p == q.answer
                VStack(alignment: .leading, spacing: 4) {
                    Text(ok ? "✓ Correct!" : "✗ The answer is: \(q.options[q.answer])")
                        .font(.subheadline.bold())
                        .foregroundColor(ok ? .green : .red)
                    if let explain = q.explain { Text(explain).font(.subheadline) }
                }
                Button(index + 1 < questions.count ? "Next question →" : "See results") { next() }
                    .buttonStyle(.borderedProminent)
                    .tint(lang.color)
            }
        }
    }

    private func fill(for i: Int, _ q: Question) -> Color {
        guard let p = picked, mode == .practice else { return Color(uiColor: .tertiarySystemGroupedBackground) }
        if i == q.answer { return Color.green.opacity(0.15) }
        if i == p { return Color.red.opacity(0.15) }
        return Color(uiColor: .tertiarySystemGroupedBackground)
    }

    private func stroke(for i: Int, _ q: Question) -> Color {
        guard let p = picked, mode == .practice else { return Color.secondary.opacity(0.25) }
        if i == q.answer { return .green }
        if i == p { return .red }
        return Color.secondary.opacity(0.25)
    }

    private func pick(_ i: Int, _ q: Question) {
        guard picked == nil || mode == .test else { return }
        picked = i
        answers.append(i)
        if i == q.answer { correct += 1 }
        if mode == .test { next() }
    }

    private func next() {
        picked = nil
        if index + 1 < questions.count {
            index += 1
        } else {
            finished = true
            onFinish(correct, answers)
        }
    }

    private func restart() {
        index = 0
        picked = nil
        answers = []
        correct = 0
        finished = false
    }
}
