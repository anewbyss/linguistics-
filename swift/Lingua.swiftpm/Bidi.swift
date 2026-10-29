import Foundation

/// Arabic inside left-to-right text (an English question, a label, a "…" hint) is laid out left to
/// right, so a blank or ellipsis after an Arabic word lands on the wrong side. Wrapping each Arabic
/// run, with its blanks and ellipses, in Unicode right-to-left isolates (U+2067 … U+2069) fixes the
/// order. Mirrors isolateArabic in web/js/app.js.
enum Bidi {
    private static let letters = "\\u0600-\\u06FF\\u0750-\\u077F\\uFB50-\\uFDFF\\uFE70-\\uFEFF"
    private static let run = try? NSRegularExpression(
        pattern: "(?:[_…]+[ \\u00A0]*)?[\(letters)](?:[\(letters) \\u00A0_…،؛؟!.]*[\(letters)_…؟])?")

    static func isolate(_ text: String) -> String {
        guard let run = run, text.unicodeScalars.contains(where: { (0x0600...0x06FF).contains($0.value) }) else { return text }
        let range = NSRange(text.startIndex..., in: text)
        return run.stringByReplacingMatches(in: text, range: range, withTemplate: "\u{2067}$0\u{2069}")
    }

    /// Display-only fields of the content JSON. Fields used for matching, speech or answers are left alone.
    static let displayKeys: Set<String> = ["q", "explain", "body", "note", "prompt", "label", "starter",
                                           "summary", "setting", "goal", "feedback", "why", "intro"]

    /// Returns the JSON object with every display string isolated.
    static func isolateDisplayStrings(_ value: Any, key: String? = nil) -> Any {
        switch value {
        case let s as String:
            return key.map(displayKeys.contains) == true ? isolate(s) : s
        case let list as [Any]:
            return list.map { isolateDisplayStrings($0, key: key) }
        case let object as [String: Any]:
            var out: [String: Any] = [:]
            for (k, v) in object { out[k] = isolateDisplayStrings(v, key: k) }
            return out
        default:
            return value
        }
    }
}
