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
