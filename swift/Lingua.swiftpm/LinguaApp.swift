import SwiftUI
import AVFoundation

@main
struct LinguaApp: App {
    @StateObject private var content = ContentStore()
    @StateObject private var progress = ProgressStore()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(content)
                .environmentObject(progress)
        }
    }
}

enum Route: Hashable {
    case language(String)
    case category(String, String)
    case lesson(String, String)
    case reading(String)
    case scenarios(String)
    case scenario(String, String)
    case translator(String)
    case aptitude(String)
    case media(String)
    case challenge(String)
    case speaking(String)
    case fluency(String)
    case review(String)
    case listening(String)
    case writing(String)
    case resources(String)
    case progress
}

struct RootView: View {
    @EnvironmentObject var content: ContentStore
    @EnvironmentObject var progress: ProgressStore
    @Environment(\.scenePhase) private var scenePhase
    @State private var path = NavigationPath()

    var body: some View {
        NavigationStack(path: $path) {
            LandingView()
                .navigationDestination(for: Route.self) { route in
                    destination(route)
                }
        }
        .onChange(of: scenePhase) { phase in progress.isAppActive = phase == .active }
    }

    @ViewBuilder
    private func destination(_ route: Route) -> some View {
        switch route {
        case .language(let id):
            if let lang = content.language(id) { LanguageHomeView(lang: lang) }
        case .category(let id, let catId):
            if let lang = content.language(id), let cat = lang.categories.first(where: { $0.id == catId }) {
                CategoryView(lang: lang, category: cat)
            }
        case .lesson(let id, let lessonId):
            if let lang = content.language(id), let lesson = lang.allLessons.first(where: { $0.id == lessonId }) {
                LessonView(lang: lang, lesson: lesson)
            }
        case .reading(let id):
            if let lang = content.language(id) { ReadingView(lang: lang) }
        case .scenarios(let id):
            if let lang = content.language(id) { ScenarioListView(lang: lang) }
        case .scenario(let id, let sid):
            if let lang = content.language(id), let s = lang.scenarios.first(where: { $0.id == sid }) {
                ScenarioPlayView(lang: lang, scenario: s)
            }
        case .translator(let id):
            if let lang = content.language(id) { TranslatorView(lang: lang) }
        case .aptitude(let id):
            if let lang = content.language(id) { AptitudeView(lang: lang) }
        case .media(let id):
            if let lang = content.language(id) { MediaView(lang: lang) }
        case .challenge(let id):
            if let lang = content.language(id) { DailyChallengeView(lang: lang) }
        case .speaking(let id):
            if let lang = content.language(id) { SpeakingPracticeView(lang: lang) }
        case .fluency(let id):
            if let lang = content.language(id) { FluencyView(lang: lang) }
        case .review(let id):
            if let lang = content.language(id) { ReviewView(lang: lang) }
        case .listening(let id):
            if let lang = content.language(id) { ListeningPracticeView(lang: lang) }
        case .writing(let id):
            if let lang = content.language(id) { WritingStudioView(lang: lang) }
        case .resources(let id):
            if let lang = content.language(id) { ResourcesView(lang: lang) }
        case .progress:
            ProgressBackupView()
        }
    }
}

/// Text-to-speech using the device's offline voices.
final class Speaker {
    static let shared = Speaker()
    private let synth = AVSpeechSynthesizer()

    static let rates: [(id: String, label: String, factor: Float)] = [("slow", "🐢 Slow", 0.6), ("normal", "Normal", 0.85), ("natural", "🐇 Natural", 1.05)]

    /// Remembered speech speed: slow, normal or natural.
    var rateName: String {
        get { UserDefaults.standard.string(forKey: "lingua.rate") ?? "normal" }
        set { UserDefaults.standard.set(newValue, forKey: "lingua.rate") }
    }

    func speak(_ text: String, language: String) {
        let clean = text.replacingOccurrences(of: "\u{200D}", with: "")
        guard !clean.trimmingCharacters(in: .whitespaces).isEmpty else { return }
        #if os(iOS)
        try? AVAudioSession.sharedInstance().setCategory(.playback, mode: .spokenAudio, options: [.duckOthers])
        #endif
        if synth.isSpeaking { synth.stopSpeaking(at: .immediate) }
        let utterance = AVSpeechUtterance(string: clean)
        utterance.voice = AVSpeechSynthesisVoice(language: language) ?? AVSpeechSynthesisVoice(language: String(language.prefix(2)))
        let factor = Self.rates.first { $0.id == rateName }?.factor ?? 0.85
        utterance.rate = min(AVSpeechUtteranceMaximumSpeechRate, AVSpeechUtteranceDefaultSpeechRate * factor)
        synth.speak(utterance)
    }
}
