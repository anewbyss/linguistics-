import SwiftUI
import UIKit
import UIKit.UIGestureRecognizerSubclass
import PencilKit

enum ReadingTab: String, CaseIterable, Identifiable {
    case letters, marks, read, write, trace, quiz
    var id: String { rawValue }

    func label(arabic: Bool) -> String {
        switch self {
        case .letters: return arabic ? "Alphabet" : "Letters"
        case .marks: return arabic ? "Vowel marks" : "Accents"
        case .read: return "Read"
        case .write: return "Write"
        case .trace: return "Trace"
        case .quiz: return arabic ? "Letter quiz" : "Accent quiz"
        }
    }
}

struct ReadingView: View {
    let lang: Language
    @EnvironmentObject var progress: ProgressStore
    @State private var tab: ReadingTab = .letters
    @State private var selected: Letter?
    @State private var traceChar = ""

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 14) {
                VStack(alignment: .leading, spacing: 8) {
                    ForEach(lang.reading.intro, id: \.self) { Text($0).font(.subheadline) }
                }
                .card()

                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(ReadingTab.allCases) { t in
                            Button(t.label(arabic: lang.isArabic)) { tab = t }
                                .buttonStyle(.bordered)
                                .tint(tab == t ? lang.color : .secondary)
                        }
                    }
                }

                switch tab {
                case .letters: lettersTab
                case .marks: marksTab
                case .read: WordFlashView(lang: lang)
                case .write: WritingPracticeView(lang: lang)
                case .trace: TracingView(lang: lang, char: $traceChar)
                case .quiz: ReadingQuizView(lang: lang)
                }
            }
            .padding()
            .frame(maxWidth: 760)
            .frame(maxWidth: .infinity)
        }
        .background(Color(uiColor: .systemGroupedBackground))
        .navigationTitle(lang.reading.title)
        .navigationBarTitleDisplayMode(.inline)
        .tint(lang.color)
        .onAppear { if traceChar.isEmpty { traceChar = lang.reading.letters.first?.char ?? "" } }
        .sheet(item: $selected) { letter in
            LetterDetailView(lang: lang, letter: letter) {
                selected = nil
                traceChar = letter.char
                tab = .trace
            }
            .environmentObject(progress)
        }
    }

    private var lettersTab: some View {
        let lp = progress.lang(lang.id)
        return VStack(alignment: .leading, spacing: 12) {
            Text("Tap a letter to see \(lang.isArabic ? "its four forms, " : "")its sound and an example.")
                .font(.caption).foregroundColor(.secondary)
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 76), spacing: 8)], spacing: 8) {
                ForEach(lang.reading.letters) { letter in
                    Button {
                        let first = (lp.letters[letter.char] ?? 0) == 0
                        progress.update(lang.id, xp: first ? 2 : 0) { $0.letters[letter.char, default: 0] += 1 }
                        selected = letter
                    } label: {
                        VStack(spacing: 2) {
                            Text(letter.char).font(.system(size: lang.isArabic ? 36 : 30))
                            Text(letter.name).font(.caption2).foregroundColor(.secondary)
                        }
                        .frame(maxWidth: .infinity, minHeight: 74)
                        .background(RoundedRectangle(cornerRadius: 12).fill(Color(uiColor: .secondarySystemGroupedBackground)))
                        .overlay(alignment: .topTrailing) {
                            if (lp.letters[letter.char] ?? 0) > 0 {
                                Image(systemName: "checkmark.circle.fill").font(.caption).foregroundColor(.green).padding(4)
                            }
                        }
                    }
                    .buttonStyle(.plain)
                }
            }
            .environment(\.layoutDirection, lang.isRTL ? .rightToLeft : .leftToRight)
            ForEach(lang.reading.tips, id: \.self) { tip in
                VStack(alignment: .leading, spacing: 4) {
                    Text("💡 \(tip.title)").font(.subheadline.bold())
                    Text(tip.body).font(.subheadline)
                }
                .card()
            }
        }
    }

    private var marksTab: some View {
        VStack(spacing: 12) {
            ForEach(lang.reading.marks, id: \.self) { mark in
                VStack(alignment: .leading, spacing: 8) {
                    HStack {
                        Text(mark.name).font(.headline)
                        Spacer()
                        Text(mark.symbol).font(.system(size: lang.isArabic ? 30 : 22))
                    }
                    Text(mark.body).font(.subheadline)
                    if let ex = mark.example { PhraseRow(phrase: ex, lang: lang) }
                }
                .card()
            }
        }
    }
}

struct LetterDetailView: View {
    let lang: Language
    let letter: Letter
    var onTrace: () -> Void
    @Environment(\.dismiss) private var dismiss

    private let formNames = ["Isolated", "Initial", "Medial", "Final"]

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    HStack(alignment: .firstTextBaseline) {
                        Text(letter.char).font(.system(size: 64))
                        VStack(alignment: .leading) {
                            Text(letter.name).font(.title2.bold())
                            Text(letter.tr).foregroundColor(.secondary)
                        }
                        Spacer()
                        SpeakButton(text: letter.example.t, lang: lang)
                    }
                    if let forms = letter.forms {
                        HStack(spacing: 8) {
                            ForEach(Array(forms.enumerated()), id: \.offset) { i, form in
                                VStack(spacing: 4) {
                                    Text(form).font(.system(size: 40))
                                    Text(formNames[min(i, 3)]).font(.caption2).foregroundColor(.secondary)
                                }
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 8)
                                .background(RoundedRectangle(cornerRadius: 10).fill(Color(uiColor: .tertiarySystemFill)))
                            }
                        }
                        .environment(\.layoutDirection, .leftToRight)
                        if letter.connects == false {
                            Text("This letter never joins to the letter after it, so its initial and medial forms look like its isolated and final forms.")
                                .font(.caption).foregroundColor(.secondary)
                        }
                    }
                    Text("Sound: ").bold() + Text(letter.sound)
                    PhraseRow(phrase: letter.example, lang: lang)
                    Button {
                        onTrace()
                    } label: {
                        Label("Trace this letter", systemImage: "hand.draw")
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(lang.color)
                }
                .padding()
            }
            .navigationTitle(letter.name)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) { Button("Done") { dismiss() } }
            }
        }
    }
}

struct WordFlashView: View {
    let lang: Language
    @State private var index = 0
    @State private var reveal = false

    var body: some View {
        let words = lang.reading.words
        let word = words[min(index, words.count - 1)]
        VStack(spacing: 14) {
            Text("Word \(index + 1) of \(words.count)").font(.caption).foregroundColor(.secondary)
            Text(word.t).font(.system(size: lang.isArabic ? 60 : 44, weight: .medium))
            Text(lang.isArabic ? "Sound it out letter by letter, then reveal." : "Read it aloud using the rules, then check.")
                .font(.caption).foregroundColor(.secondary)
            if reveal {
                if let tr = word.tr { Text(tr).font(.title3.italic()).foregroundColor(lang.color) }
                Text(word.en).font(.title3)
            }
            HStack(spacing: 12) {
                Button { index -= 1; reveal = false } label: { Image(systemName: "chevron.left") }
                    .buttonStyle(.bordered).disabled(index == 0)
                Button(reveal ? "Hide" : "Reveal") { reveal.toggle() }
                    .buttonStyle(.borderedProminent).tint(lang.color)
                SpeakButton(text: word.t, lang: lang)
                Button { index += 1; reveal = false } label: { Image(systemName: "chevron.right") }
                    .buttonStyle(.bordered).disabled(index >= words.count - 1)
            }
        }
        .frame(maxWidth: .infinity)
        .card()
    }
}

struct WritingPracticeView: View {
    let lang: Language
    @EnvironmentObject var progress: ProgressStore
    @State private var index = 0
    @State private var input = ""
    @State private var result: WritingCheck?
    @State private var showHint = false

    var body: some View {
        let tasks = lang.reading.writing
        let task = tasks[min(index, tasks.count - 1)]
        let mastered = tasks.filter { progress.lang(lang.id).writing[$0.answer] == true }.count
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Task \(index + 1) of \(tasks.count)").font(.caption).foregroundColor(.secondary)
                Spacer()
                Text("\(mastered)/\(tasks.count) mastered").font(.caption.bold())
            }
            Text("Write in \(lang.name): “\(task.en)”").font(.headline)
            if showHint, let hint = task.hint { Text("Hint: \(hint)").font(.subheadline).foregroundColor(.secondary) }
            TextField(lang.isArabic ? "اكتب هنا" : "Escribe aquí", text: $input)
                .font(.system(size: lang.isArabic ? 28 : 22))
                .multilineTextAlignment(lang.isRTL ? .trailing : .leading)
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled()
                .padding(10)
                .background(RoundedRectangle(cornerRadius: 12).fill(Color(uiColor: .tertiarySystemFill)))
                .onSubmit { check(task) }
            if let keys = lang.reading.keyboard { KeyPad(keys: keys, lang: lang, text: $input) }
            if let r = result {
                Group {
                    if r.ok && r.perfect {
                        Text("✓ Perfect!").foregroundColor(.green)
                    } else if r.ok {
                        Text("✓ Correct, but check the \(lang.isArabic ? "hamza / spelling" : "accents"): \(r.expected)").foregroundColor(.green)
                    } else {
                        Text("✗ Not quite. The answer is: \(task.answer)").foregroundColor(.red)
                    }
                }
                .font(.subheadline.bold())
            }
            HStack {
                Button("Check") { check(task) }.buttonStyle(.borderedProminent).tint(lang.color)
                if task.hint != nil { Button("Hint") { showHint = true }.buttonStyle(.bordered) }
                Spacer()
                Button { move(-1) } label: { Image(systemName: "chevron.left") }.buttonStyle(.bordered).disabled(index == 0)
                Button { move(1) } label: { Image(systemName: "chevron.right") }.buttonStyle(.bordered).disabled(index >= tasks.count - 1)
            }
        }
        .card()
    }

    private func check(_ task: WritingTask) {
        let r = Engine.checkWriting(input, task: task, lang: lang.id)
        result = r
        guard r.ok else { return }
        let first = progress.lang(lang.id).writing[task.answer] != true
        progress.update(lang.id, xp: first ? 5 : 0) { $0.writing[task.answer] = true }
    }

    private func move(_ d: Int) {
        index += d
        input = ""
        result = nil
        showHint = false
    }
}

/// Tracing over a letter with Apple Pencil (pressure, tilt, palm rejection), finger or mouse.
/// The ink is scored by comparing it with the glyph shape.
@MainActor
struct TracingView: View {
    let lang: Language
    @Binding var char: String
    @EnvironmentObject var progress: ProgressStore
    @State private var form = 0
    @State private var drawing = PKDrawing()
    @State private var clearToken = 0
    @State private var score: Int?
    @State private var pencilSeen = false
    @State private var allowFinger = false

    private let size: CGFloat = 300
    private var brush: CGFloat { size * 0.055 }

    private var letter: Letter {
        lang.reading.letters.first { $0.char == char } ?? lang.reading.letters[0]
    }

    private var glyph: String {
        if let forms = letter.forms, form < forms.count { return forms[form] }
        return letter.char
    }

    private var fontSize: CGFloat {
        size * (glyph.replacingOccurrences(of: "\u{200D}", with: "").count > 2 ? 0.45 : 0.62)
    }

    var body: some View {
        VStack(spacing: 12) {
            Picker("Letter", selection: $char) {
                ForEach(lang.reading.letters) { l in
                    Text("\(l.char)  \(l.name)").tag(l.char)
                }
            }
            .pickerStyle(.menu)
            if letter.forms != nil {
                Picker("Form", selection: $form) {
                    Text("Isolated").tag(0)
                    Text("Initial").tag(1)
                    Text("Medial").tag(2)
                    Text("Final").tag(3)
                }
                .pickerStyle(.segmented)
            }
            Text("Trace over the grey shape with Apple Pencil or your finger\(lang.isArabic ? ". Draw the main body first, then the dots" : ""). Press harder for a thicker line; double-tap Apple Pencil (2nd gen / Pro) to switch to the eraser.")
                .font(.caption).foregroundColor(.secondary)
                .multilineTextAlignment(.center)

            ZStack {
                RoundedRectangle(cornerRadius: 16).fill(Color(uiColor: .tertiarySystemFill))
                glyphView(Color.secondary.opacity(0.35))
                PencilCanvas(
                    drawing: $drawing,
                    clearToken: clearToken,
                    color: UIColor(lang.color),
                    width: brush,
                    pencilOnly: pencilSeen && !allowFinger,
                    onPencilDetected: { if !pencilSeen { pencilSeen = true } }
                )
            }
            .frame(width: size, height: size)
            .clipShape(RoundedRectangle(cornerRadius: 16))

            if pencilSeen {
                Toggle(isOn: $allowFinger) {
                    Text(allowFinger ? "✏️ Finger and Pencil both draw" : "✏️ Apple Pencil detected: finger and palm touches are ignored")
                        .font(.caption)
                }
            }

            if let s = score {
                Text(s >= 70 ? "✓ Nice tracing! Score: \(s)%" : "Keep going. Cover the whole shape and stay inside the lines. Score: \(s)%")
                    .font(.subheadline.bold())
                    .foregroundColor(s >= 70 ? .green : .orange)
                    .multilineTextAlignment(.center)
            }
            HStack {
                Button("Clear") { clear() }.buttonStyle(.bordered)
                Button("Check") { check() }.buttonStyle(.borderedProminent).tint(lang.color)
                Button("Next →") { nextLetter() }.buttonStyle(.bordered)
            }
            Text("Practised: \(progress.lang(lang.id).letters[letter.char] ?? 0)×")
                .font(.caption).foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .card()
        .onChange(of: char) { _ in
            form = 0
            clear()
        }
        .onChange(of: form) { _ in clear() }
    }

    private func glyphView(_ color: Color) -> some View {
        Text(glyph)
            .font(.system(size: fontSize))
            .foregroundColor(color)
            .frame(width: size, height: size)
    }

    private func clear() {
        drawing = PKDrawing()
        clearToken += 1
        score = nil
    }

    private func nextLetter() {
        let letters = lang.reading.letters
        let i = letters.firstIndex { $0.char == char } ?? 0
        char = letters[(i + 1) % letters.count].char
    }

    private func check() {
        let s = traceScore()
        score = s
        if s >= 70 {
            let c = letter.char
            progress.update(lang.id, xp: 3) { $0.letters[c, default: 0] += 1 }
        }
    }

    private func traceScore() -> Int {
        if drawing.strokes.isEmpty { return 0 }
        let r = brush * 0.8
        let zoneView = ZStack {
            glyphView(.black)
            ForEach(0..<8, id: \.self) { i in
                glyphView(.black)
                    .offset(x: CGFloat(cos(Double(i) * .pi / 4)) * r, y: CGFloat(sin(Double(i) * .pi / 4)) * r)
            }
        }
        let inkImage = drawing.image(from: CGRect(x: 0, y: 0, width: size, height: size), scale: 1).cgImage
        guard let shapeImage = render(glyphView(.black)), let zoneImage = render(zoneView), let inkCG = inkImage,
              let shape = alphaMask(shapeImage), let zone = alphaMask(zoneImage), let ink = alphaMask(inkCG) else { return 0 }
        let w = Int(size)
        var glyphPx = 0, covered = 0, inkPx = 0, inside = 0
        for y in stride(from: 0, to: w, by: 2) {
            for x in stride(from: 0, to: w, by: 2) {
                let k = y * w + x
                let isInk = ink[k] > 100
                if shape[k] > 128 {
                    glyphPx += 1
                    if isInk { covered += 1 }
                }
                if isInk {
                    inkPx += 1
                    if zone[k] > 60 { inside += 1 }
                }
            }
        }
        if inkPx < 10 || glyphPx == 0 { return 0 }
        let coverage = min(1, Double(covered) / Double(glyphPx) / 0.7)
        let precision = Double(inside) / Double(inkPx)
        return Int((100 * (0.55 * coverage + 0.45 * precision)).rounded())
    }

    private func render<V: View>(_ view: V) -> CGImage? {
        let renderer = ImageRenderer(content: view.frame(width: size, height: size))
        renderer.scale = 1
        return renderer.cgImage
    }

    /// Redraws an image at size × size and returns its alpha channel.
    private func alphaMask(_ cg: CGImage) -> [UInt8]? {
        let w = Int(size)
        guard let ctx = CGContext(data: nil, width: w, height: w, bitsPerComponent: 8, bytesPerRow: w * 4,
                                  space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue) else { return nil }
        ctx.draw(cg, in: CGRect(x: 0, y: 0, width: w, height: w))
        guard let data = ctx.data else { return nil }
        let px = data.bindMemory(to: UInt8.self, capacity: w * w * 4)
        var out = [UInt8](repeating: 0, count: w * w)
        for i in 0..<(w * w) { out[i] = px[i * 4 + 3] }
        return out
    }
}

/// PencilKit canvas. Apple Pencil gets pressure and tilt; `pencilOnly` turns on palm rejection.
/// Double-tapping Apple Pencil toggles the eraser (respecting the user's system setting).
struct PencilCanvas: UIViewRepresentable {
    @Binding var drawing: PKDrawing
    let clearToken: Int
    let color: UIColor
    let width: CGFloat
    let pencilOnly: Bool
    var onPencilDetected: () -> Void

    func makeCoordinator() -> Coordinator { Coordinator(self) }

    func makeUIView(context: Context) -> PKCanvasView {
        let canvas = PKCanvasView()
        canvas.backgroundColor = .clear
        canvas.isOpaque = false
        canvas.isScrollEnabled = false
        canvas.drawing = drawing
        canvas.delegate = context.coordinator

        let detector = PencilDetector(target: nil, action: nil)
        detector.onPencil = { [weak coordinator = context.coordinator] in coordinator?.parent.onPencilDetected() }
        canvas.addGestureRecognizer(detector)

        #if !targetEnvironment(macCatalyst)
        let interaction = UIPencilInteraction()
        interaction.delegate = context.coordinator
        canvas.addInteraction(interaction)
        #endif

        context.coordinator.apply(to: canvas)
        return canvas
    }

    func updateUIView(_ canvas: PKCanvasView, context: Context) {
        let coordinator = context.coordinator
        coordinator.parent = self
        if coordinator.clearToken != clearToken {
            coordinator.clearToken = clearToken
            coordinator.erasing = false
            canvas.drawing = PKDrawing()
        }
        coordinator.apply(to: canvas)
    }

    final class Coordinator: NSObject, PKCanvasViewDelegate {
        var parent: PencilCanvas
        var clearToken: Int
        var erasing = false
        weak var canvas: PKCanvasView?

        init(_ parent: PencilCanvas) {
            self.parent = parent
            self.clearToken = parent.clearToken
        }

        func apply(to canvas: PKCanvasView) {
            self.canvas = canvas
            canvas.tool = erasing ? PKEraserTool(.vector) : PKInkingTool(.pen, color: parent.color, width: parent.width)
            canvas.drawingPolicy = parent.pencilOnly ? .pencilOnly : .anyInput
        }

        func canvasViewDrawingDidChange(_ canvasView: PKCanvasView) {
            let updated = canvasView.drawing
            // Deferred: this also fires while SwiftUI is updating the view (e.g. on clear).
            DispatchQueue.main.async { self.parent.drawing = updated }
        }

        func toggleEraser() {
            guard let canvas = canvas else { return }
            erasing.toggle()
            apply(to: canvas)
        }
    }
}

#if !targetEnvironment(macCatalyst)
extension PencilCanvas.Coordinator: UIPencilInteractionDelegate {
    func pencilInteractionDidTap(_ interaction: UIPencilInteraction) {
        if UIPencilInteraction.preferredTapAction != .ignore { toggleEraser() }
    }
}
#endif

/// Watches touches without interfering, and reports when one comes from Apple Pencil.
final class PencilDetector: UIGestureRecognizer {
    var onPencil: (() -> Void)?

    override init(target: Any?, action: Selector?) {
        super.init(target: target, action: action)
        cancelsTouchesInView = false
        delaysTouchesBegan = false
        delaysTouchesEnded = false
    }

    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent) {
        if touches.contains(where: { $0.type == .pencil }) { onPencil?() }
        state = .failed
    }
}

struct ReadingQuizView: View {
    let lang: Language
    @EnvironmentObject var progress: ProgressStore
    @State private var questions: [Question] = []
    @State private var key = UUID()

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            if questions.isEmpty {
                ProgressView()
            } else {
                QuizView(questions: questions, mode: .practice, lang: lang) { correct, _ in
                    progress.update(lang.id, xp: correct * 5) { _ in }
                }
                .id(key)
                Button("New quiz") { regenerate() }.buttonStyle(.bordered)
            }
        }
        .card()
        .onAppear { if questions.isEmpty { regenerate() } }
    }

    private func regenerate() {
        questions = lang.isArabic ? Self.letterQuiz(lang) : Self.accentQuiz(lang)
        key = UUID()
    }

    static func letterQuiz(_ lang: Language) -> [Question] {
        let letters = lang.reading.letters
        func label(_ l: Letter) -> String { "\(l.name) (\(l.tr))" }
        var out: [Question] = []
        for (n, letter) in letters.shuffled().prefix(10).enumerated() {
            let wrong = letters.filter { $0.char != letter.char }.shuffled().prefix(3)
            let options = ([letter] + wrong).shuffled().map(label)
            out.append(Question(id: "lq\(n)", q: "Which letter is this?", t: letter.char, options: options,
                                answer: options.firstIndex(of: label(letter)) ?? 0, explain: letter.sound))
        }
        return out
    }

    static func accentQuiz(_ lang: Language) -> [Question] {
        let acute: [Character: Character] = ["a": "á", "e": "é", "i": "í", "o": "ó", "u": "ú"]
        func strip(_ w: String) -> String {
            var out = String.UnicodeScalarView()
            for sc in w.decomposedStringWithCanonicalMapping.unicodeScalars where sc.value != 0x0301 { out.append(sc) }
            return String(out).precomposedStringWithCanonicalMapping
        }
        var seen = Set<String>()
        let words = lang.dictionary.map(\.t).filter { t in
            let bare = strip(t)
            return bare.range(of: "^[a-zñü]+$", options: [.regularExpression, .caseInsensitive]) != nil
                && t.range(of: "[áéíóú]", options: .regularExpression) != nil
                && t.count > 3
                && seen.insert(t).inserted
        }
        var out: [Question] = []
        for (n, word) in words.shuffled().prefix(10).enumerated() {
            let bare = strip(word)
            var variants = Set([bare])
            let chars = Array(bare)
            for (i, ch) in chars.enumerated() {
                if let accented = acute[ch] {
                    var copy = chars
                    copy[i] = accented
                    variants.insert(String(copy))
                }
            }
            variants.remove(word)
            let options = ([word] + Array(variants.shuffled().prefix(3))).shuffled()
            let meaning = lang.dictionary.first { $0.t == word }.map { Engine.primaryEnglish($0.en) } ?? word
            out.append(Question(id: "aq\(n)", q: "Which spelling is correct for “\(meaning)”?", options: options,
                                answer: options.firstIndex(of: word) ?? 0, explain: "\(word): the written accent marks the stressed syllable."))
        }
        return out
    }
}
