import Foundation
import Speech
import AVFoundation

/// Listens for one phrase and scores it against a target with Engine.similarity.
/// Uses on-device recognition when the device supports it for the language, so it works offline.
final class SpeechListener: ObservableObject {
    enum Status: Equatable {
        case idle
        case listening
        case scored(Int, String)
        case heard(String)
        case selfChecked
        case failed(String)
    }

    @Published private(set) var status: Status = .idle

    private let engine = AVAudioEngine()
    private var request: SFSpeechAudioBufferRecognitionRequest?
    private var task: SFSpeechRecognitionTask?
    private var finished = true
    private var timeout: DispatchWorkItem?

    func reset() {
        cancel()
        status = .idle
    }

    func markSelfChecked() {
        cancel()
        status = .selfChecked
    }

    /// Listen for one phrase and score it against `target`.
    func listen(locale: String, target: String, lang: String, onScored: @escaping (Int) -> Void) {
        start(locale: locale, maxSeconds: 5) { [weak self] transcripts in
            let scored = transcripts.map { ($0, Engine.similarity($0, target, lang: lang)) }
            guard let self = self, let best = scored.max(by: { $0.1 < $1.1 }), !best.0.isEmpty else {
                self?.status = .failed("I didn't catch that. Tap “Say it” and speak clearly after the tone.")
                return
            }
            self.status = .scored(best.1, best.0)
            onScored(best.1)
        }
    }

    /// Listen to a longer free answer (stop it with stopListening) and return the transcript.
    func listenForAnswer(locale: String, maxSeconds: Double = 20, onTranscript: @escaping (String) -> Void) {
        start(locale: locale, maxSeconds: maxSeconds) { [weak self] transcripts in
            guard let self = self, let text = transcripts.first, !text.isEmpty else {
                self?.status = .failed("I didn't catch that. Tap “Answer aloud” and try again, or type what you said.")
                return
            }
            self.status = .heard(text)
            onTranscript(text)
        }
    }

    private func start(locale: String, maxSeconds: Double, onFinal: @escaping ([String]) -> Void) {
        SFSpeechRecognizer.requestAuthorization { auth in
            DispatchQueue.main.async {
                guard auth == .authorized else {
                    self.status = .failed("Speech recognition is turned off for Lingua. Turn it on in Settings › Privacy & Security › Speech Recognition, or use “I said it”.")
                    return
                }
                AVAudioSession.sharedInstance().requestRecordPermission { granted in
                    DispatchQueue.main.async {
                        guard granted else {
                            self.status = .failed("Microphone access is off for Lingua. Turn it on in Settings, or use “I said it”.")
                            return
                        }
                        self.begin(locale: locale, maxSeconds: maxSeconds, onFinal: onFinal)
                    }
                }
            }
        }
    }

    /// Stop recording early; the final transcription is then scored.
    func stopListening() {
        request?.endAudio()
        stopAudio()
    }

    private func begin(locale: String, maxSeconds: Double, onFinal: @escaping ([String]) -> Void) {
        cancel()
        guard let recognizer = SFSpeechRecognizer(locale: Locale(identifier: locale)), recognizer.isAvailable else {
            status = .failed("Speech recognition for this language isn't available on this device right now. Use “I said it” instead.")
            return
        }
        let request = SFSpeechAudioBufferRecognitionRequest()
        request.shouldReportPartialResults = false
        if recognizer.supportsOnDeviceRecognition { request.requiresOnDeviceRecognition = true }
        self.request = request
        do {
            let session = AVAudioSession.sharedInstance()
            try session.setCategory(.playAndRecord, mode: .measurement, options: [.duckOthers, .defaultToSpeaker])
            try session.setActive(true, options: .notifyOthersOnDeactivation)
            let input = engine.inputNode
            input.removeTap(onBus: 0)
            input.installTap(onBus: 0, bufferSize: 1024, format: input.outputFormat(forBus: 0)) { buffer, _ in
                request.append(buffer)
            }
            engine.prepare()
            try engine.start()
        } catch {
            stopAudio()
            status = .failed("Couldn't start the microphone: \(error.localizedDescription)")
            return
        }
        finished = false
        status = .listening
        task = recognizer.recognitionTask(with: request) { [weak self] result, error in
            DispatchQueue.main.async {
                guard let self = self, !self.finished else { return }
                if let result = result, result.isFinal {
                    self.complete(result.transcriptions.map(\.formattedString), onFinal: onFinal)
                } else if error != nil {
                    self.complete([], onFinal: onFinal)
                }
            }
        }
        // Stop listening automatically after a few seconds.
        let work = DispatchWorkItem { [weak self] in self?.stopListening() }
        timeout = work
        DispatchQueue.main.asyncAfter(deadline: .now() + maxSeconds, execute: work)
    }

    private func complete(_ transcripts: [String], onFinal: ([String]) -> Void) {
        finished = true
        timeout?.cancel()
        stopAudio()
        task = nil
        request = nil
        onFinal(transcripts)
    }

    private func stopAudio() {
        if engine.isRunning { engine.stop() }
        engine.inputNode.removeTap(onBus: 0)
        try? AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
    }

    private func cancel() {
        finished = true
        timeout?.cancel()
        task?.cancel()
        task = nil
        request = nil
        stopAudio()
    }
}
