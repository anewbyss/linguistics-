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
    case progress
}

struct RootView: View {
    @EnvironmentObject var content: ContentStore
    @State private var path = NavigationPath()

    var body: some View {
        NavigationStack(path: $path) {
            LandingView()
                .navigationDestination(for: Route.self) { route in
                    destination(route)
                }
        }
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
        case .progress:
            ProgressBackupView()
        }
    }
}

/// Text-to-speech using the device's offline voices.
final class Speaker {
    static let shared = Speaker()
    private let synth = AVSpeechSynthesizer()

    func speak(_ text: String, language: String) {
        let clean = text.replacingOccurrences(of: "\u{200D}", with: "")
        guard !clean.trimmingCharacters(in: .whitespaces).isEmpty else { return }
        #if os(iOS)
        try? AVAudioSession.sharedInstance().setCategory(.playback, mode: .spokenAudio, options: [.duckOthers])
        #endif
        if synth.isSpeaking { synth.stopSpeaking(at: .immediate) }
        let utterance = AVSpeechUtterance(string: clean)
        utterance.voice = AVSpeechSynthesisVoice(language: language) ?? AVSpeechSynthesisVoice(language: String(language.prefix(2)))
        utterance.rate = AVSpeechUtteranceDefaultSpeechRate * 0.85
        synth.speak(utterance)
    }
}
