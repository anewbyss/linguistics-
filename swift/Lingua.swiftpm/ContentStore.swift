import SwiftUI
import UIKit

/// Decodes the embedded course content once and caches dictionary indexes.
final class ContentStore: ObservableObject {
    let languages: [Language]
    private var indexes: [String: DictionaryIndex] = [:]

    init() {
        do {
            let library = try JSONDecoder().decode(Library.self, from: Data(ContentData.json.utf8))
            languages = library.languages
        } catch {
            fatalError("Lingua content failed to decode: \(error)")
        }
    }

    func language(_ id: String) -> Language? {
        languages.first { $0.id == id }
    }

    func index(for language: Language) -> DictionaryIndex {
        if let cached = indexes[language.id] { return cached }
        let built = DictionaryIndex(language: language)
        indexes[language.id] = built
        return built
    }
}

extension Color {
    /// Parses "#rrggbb".
    init(hex: String) {
        let clean = hex.trimmingCharacters(in: CharacterSet(charactersIn: "#"))
        let value = UInt32(clean, radix: 16) ?? 0x3b5bdb
        self.init(
            red: Double((value >> 16) & 0xff) / 255,
            green: Double((value >> 8) & 0xff) / 255,
            blue: Double(value & 0xff) / 255
        )
    }
}

extension Language {
    var color: Color { Color(hex: accent) }
}
