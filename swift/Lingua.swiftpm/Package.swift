// swift-tools-version: 5.9

// Open this folder (Lingua.swiftpm) in Swift Playgrounds on iPad or Mac, or in Xcode.

import PackageDescription
import AppleProductTypes

let package = Package(
    name: "Lingua",
    platforms: [
        .iOS("16.0")
    ],
    products: [
        .iOSApplication(
            name: "Lingua",
            targets: ["AppModule"],
            bundleIdentifier: "app.lingua.learn",
            teamIdentifier: "",
            displayVersion: "1.0",
            bundleVersion: "1",
            appIcon: .placeholder(icon: .chatMessage),
            accentColor: .presetColor(.teal),
            supportedDeviceFamilies: [
                .pad,
                .phone
            ],
            supportedInterfaceOrientations: [
                .portrait,
                .landscapeRight,
                .landscapeLeft,
                .portraitUpsideDown(.when(deviceFamilies: [.pad]))
            ],
            capabilities: [
                .microphone(purposeString: "Lingua listens when you practise speaking so it can score your pronunciation."),
                .speechRecognition(purposeString: "Lingua turns your speech into text to check your pronunciation. Recognition runs on your device when supported.")
            ]
        )
    ],
    targets: [
        .executableTarget(
            name: "AppModule",
            path: "."
        )
    ]
)
