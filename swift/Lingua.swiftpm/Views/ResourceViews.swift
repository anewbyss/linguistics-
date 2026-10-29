import SwiftUI

/// Per-device learning preferences (not part of the progress backup). Same meaning as the web app's.
enum Prefs {
    static let showTransliteration = "lingua.showTransliteration"
    static let quietMode = "lingua.quietMode"
}

/// Opens a pre-filled GitHub issue so learners can flag a content error.
struct ReportMistakeLink: View {
    let subject: String
    var label = "⚑ Report a mistake"

    private var url: URL? {
        var parts = URLComponents(string: "https://github.com/anewbyss/linguistics-/issues/new")
        parts?.queryItems = [
            URLQueryItem(name: "title", value: "Content: \(subject)"),
            URLQueryItem(name: "body", value: "What is wrong, and what should it say?\n\n"),
        ]
        return parts?.url
    }

    var body: some View {
        if let url = url {
            Link(label, destination: url).font(.caption).foregroundColor(.secondary)
        }
    }
}

// MARK: - Free courses & resources

struct ResourcesView: View {
    let lang: Language
    @EnvironmentObject var content: ContentStore
    @EnvironmentObject var progress: ProgressStore
    @State private var level: String?
    @State private var started = false

    var body: some View {
        let band = Engine.fluency(lang, progress.lang(lang.id)).overallBand
        let list = lang.resources.filter { level == nil || $0.levels.contains(level ?? "") }
        ScrollView {
            VStack(alignment: .leading, spacing: 14) {
                Text("Free materials from universities and government bodies only, chosen to sit alongside this app. They open on each provider's website and need an internet connection. Lingua isn't affiliated with any of them.")
                    .font(.subheadline).foregroundColor(.secondary)
                Picker("Level", selection: $level) {
                    Text("All").tag(String?.none)
                    ForEach(Engine.levels, id: \.self) { l in Text(l == band ? "\(l) ·you" : l).tag(String?.some(l)) }
                }
                .pickerStyle(.segmented)
                if list.isEmpty {
                    Text("Nothing listed for this level yet.").foregroundColor(.secondary)
                }
                ForEach(list) { r in resourceCard(r) }
                LevelGuideCard(guide: content.levelGuide, color: lang.color)
            }
            .padding()
            .frame(maxWidth: 760)
            .frame(maxWidth: .infinity)
        }
        .background(Color(uiColor: .systemGroupedBackground))
        .navigationTitle("Free Courses")
        .navigationBarTitleDisplayMode(.inline)
        .tint(lang.color)
        .onAppear {
            guard !started else { return }
            started = true
            level = band
        }
    }

    private func resourceCard(_ r: LearningResource) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(alignment: .firstTextBaseline) {
                Text(r.title).font(.headline)
                Spacer()
                Text(r.providerType).font(.caption.bold())
                    .padding(.horizontal, 8).padding(.vertical, 3)
                    .background(Capsule().fill(lang.color.opacity(0.15)))
            }
            Text("\(r.provider) · \(r.levelSpan)").font(.caption).foregroundColor(.secondary)
            Text(r.what).font(.subheadline)
            if let note = r.note { Text(note).font(.caption).foregroundColor(.secondary) }
            if let url = URL(string: r.url) {
                Link(destination: url) { Label("Open", systemImage: "arrow.up.right.square") }
                    .buttonStyle(.borderedProminent)
            }
        }
        .card()
    }
}

/// CEFR levels (Council of Europe) with their rough ACTFL equivalents.
struct LevelGuideCard: View {
    let guide: [String: LevelGuide]
    let color: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("📏 What the levels mean").font(.headline)
            Text("This app uses the Council of Europe's CEFR levels. Some American resources use the ACTFL scale instead; ACTFL's own alignment shows roughly where they meet.")
                .font(.caption).foregroundColor(.secondary)
            ForEach(Engine.levels + ["C2"], id: \.self) { l in
                if let g = guide[l] {
                    HStack(alignment: .top, spacing: 10) {
                        LevelBadge(level: l, color: color)
                        VStack(alignment: .leading, spacing: 2) {
                            Text(g.cefr + (l == "C2" ? " (beyond this app)" : "")).font(.caption)
                            Text("≈ ACTFL \(g.actfl)").font(.caption2.bold()).foregroundColor(.secondary)
                        }
                    }
                }
            }
        }
        .card()
    }
}
