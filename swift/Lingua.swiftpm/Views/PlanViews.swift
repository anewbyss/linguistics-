import SwiftUI

// MARK: - First visit

/// Asks a new learner where to start (and, for Arabic, which spoken dialect), then builds their plan.
struct WelcomeCard: View {
    let lang: Language
    @EnvironmentObject var progress: ProgressStore
    @EnvironmentObject var router: AppRouter
    /// False when the card is already shown on the plan page.
    var opensPlan = true

    private var choices: [(String, String, String, String)] {
        var list = [("zero", "🌱", "I'm brand new to \(lang.name)", "Start with the alphabet. No experience needed.")]
        if lang.isArabic { list.append(("script", "📖", "I can read the Arabic script", "Skip the alphabet and start with the A1 lessons.")) }
        list.append(("test", "🎯", "I already know some \(lang.name)", "Take a five-minute placement test; your plan starts at your level."))
        return list
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HayyaTip(text: "Welcome to \(lang.name)! Let's build your plan. Which sounds like you?", mood: .cheer, color: lang.color)
            ForEach(choices, id: \.0) { key, emoji, title, detail in
                Button {
                    progress.update(lang, xp: 0) { $0.plan.start = key }
                    if key == "test" { router.path.append(Route.aptitude(lang.id)) } else if key == "zero" && opensPlan { router.path.append(Route.plan(lang.id)) }
                } label: {
                    HStack(alignment: .top, spacing: 12) {
                        Text(emoji).font(.title2)
                        VStack(alignment: .leading, spacing: 2) {
                            Text(title).font(.headline)
                            Text(detail).font(.caption).foregroundColor(.secondary)
                        }
                        Spacer(minLength: 0)
                    }
                    .padding(12)
                    .background(RoundedRectangle(cornerRadius: 12).fill(Color(uiColor: .tertiarySystemGroupedBackground)))
                }
                .buttonStyle(.plain)
            }
            if lang.isArabic {
                Text("Which spoken Arabic do you want alongside formal Arabic? Formal Arabic is for reading, writing and the news; people speak a dialect day to day.")
                    .font(.caption)
                DialectPicker(lang: lang)
            }
            Text("You can change these any time from your learning plan. Everything below stays open if you'd rather explore.")
                .font(.caption2).foregroundColor(.secondary)
        }
    }
}

struct DialectPicker: View {
    let lang: Language
    @EnvironmentObject var progress: ProgressStore

    var body: some View {
        let current = progress.lang(lang.id).plan.dialect ?? "both"
        Picker("Spoken Arabic", selection: Binding(
            get: { current },
            set: { value in progress.update(lang, xp: 0) { $0.plan.dialect = value } }
        )) {
            Text("Levantine").tag("lev")
            Text("Egyptian").tag("egy")
            Text("Both").tag("both")
            Text("Formal only").tag("msa")
        }
        .pickerStyle(.segmented)
    }
}

// MARK: - Plan summary on the language home

/// Rows for a List section: progress, the next step and quick links (each its own row, so each link works).
struct PlanCard: View {
    let lang: Language
    let plan: LearningPlan
    @EnvironmentObject var progress: ProgressStore

    var body: some View {
        let lp = progress.lang(lang.id)
        let due = Engine.srsStats(lang, lp, day: ProgressStore.day(Date())).due
        Group {
            VStack(alignment: .leading, spacing: 6) {
                HStack {
                    Text("🧭 Your learning plan").font(.headline)
                    Spacer()
                    Text("\(plan.done)/\(plan.total) steps").font(.caption).foregroundColor(.secondary)
                }
                ProgressView(value: Double(plan.done), total: Double(max(plan.total, 1))).tint(lang.color)
            }
            .padding(.vertical, 4)
            if let next = plan.next, let unit = plan.nextUnit {
                NavigationLink(value: next.target.route(lang.id)) {
                    VStack(alignment: .leading, spacing: 3) {
                        Text("Next step · \(unit.title)").font(.caption).foregroundColor(.secondary)
                        Text(Bidi.isolate(next.title)).font(.headline)
                        Text(Bidi.isolate(next.why)).font(.caption).foregroundColor(.secondary)
                        if let p = next.progress { Text("\(p.0)/\(p.1) so far").font(.caption2).foregroundColor(.secondary) }
                    }
                }
                .listRowBackground(lang.color.opacity(0.12))
            } else {
                Text("🎉 You've finished every step in your plan. Keep reviewing, read and listen widely, and talk to people as often as you can.")
                    .font(.subheadline)
            }
            NavigationLink(value: Route.plan(lang.id)) { Text("See the full plan").font(.subheadline) }
            if due > 0 {
                NavigationLink(value: Route.review(lang.id)) { Text("Also today: 🔁 \(due) review\(due == 1 ? "" : "s") due").font(.subheadline) }
            }
        }
    }
}

// MARK: - Full plan

struct LearningPlanView: View {
    let lang: Language
    @EnvironmentObject var progress: ProgressStore

    var body: some View {
        let plan = Engine.learningPlan(lang, progress.lang(lang.id))
        List {
            Section {
                Text("The recommended order through the whole course. Steps tick themselves off as you go, and nothing is locked: jump to anything whenever you like.")
                    .font(.subheadline)
                if plan.needsSetup {
                    WelcomeCard(lang: lang, opensPlan: false)
                } else {
                    HStack {
                        Text(startLabel(plan)).font(.subheadline)
                        Spacer()
                        Button("Change") { progress.update(lang, xp: 0) { $0.plan.start = nil } }
                    }
                    if lang.isArabic {
                        Text("Spoken Arabic in your plan").font(.caption).foregroundColor(.secondary)
                        DialectPicker(lang: lang)
                    }
                    ProgressView(value: Double(plan.done), total: Double(max(plan.total, 1))).tint(lang.color)
                    Text("\(plan.done) of \(plan.total) steps done").font(.caption).foregroundColor(.secondary)
                }
            }
            if !plan.needsSetup {
                ForEach(plan.units) { unit in
                    Section {
                        DisclosureGroup(isExpanded: expansion(unit, plan)) {
                            Text(unit.intro + (unit.skipped ? " You tested above this unit, so the plan skips it; open any step to revise." : ""))
                                .font(.caption).foregroundColor(.secondary)
                            ForEach(unit.steps) { step in stepRow(step, isNext: step.id == plan.next?.id) }
                        } label: {
                            HStack {
                                Text(unit.title).font(.headline)
                                if unit.skipped { Text("tested out").font(.caption2.bold()).foregroundColor(.secondary) }
                                Spacer()
                                Text("\(unit.done)/\(unit.steps.count)").font(.caption).foregroundColor(.secondary)
                            }
                        }
                    }
                }
            }
        }
        .navigationTitle("Learning plan")
        .navigationBarTitleDisplayMode(.inline)
        .tint(lang.color)
    }

    @State private var expanded: Set<String> = []

    private func expansion(_ unit: PlanUnit, _ plan: LearningPlan) -> Binding<Bool> {
        Binding(
            get: { expanded.contains(unit.id) || (expanded.isEmpty && unit.id == plan.nextUnit?.id) },
            set: { open in
                if expanded.isEmpty, let current = plan.nextUnit?.id { expanded.insert(current) }
                if open { expanded.insert(unit.id) } else { expanded.remove(unit.id) }
            }
        )
    }

    private func startLabel(_ plan: LearningPlan) -> String {
        switch plan.start {
        case "zero": return "Starting from zero, with the alphabet"
        case "script": return "Skipping the alphabet (you read the script)"
        default: return plan.placed.map { "Starting at your tested level, \($0)" } ?? "Starting with the placement test"
        }
    }

    private func stepRow(_ step: PlanStep, isNext: Bool) -> some View {
        NavigationLink(value: step.target.route(lang.id)) {
            HStack(alignment: .top, spacing: 10) {
                Image(systemName: step.done ? "checkmark.circle.fill" : isNext ? "play.circle.fill" : "circle")
                    .foregroundColor(step.done ? .green : lang.color)
                VStack(alignment: .leading, spacing: 2) {
                    Text(Bidi.isolate(step.title)).font(.subheadline.weight(isNext ? .bold : .semibold))
                        .foregroundColor(step.done ? .secondary : .primary)
                    Text(Bidi.isolate(step.why)).font(.caption).foregroundColor(.secondary)
                }
                Spacer(minLength: 0)
                if let p = step.progress, !step.done { Text("\(p.0)/\(p.1)").font(.caption).foregroundColor(.secondary) }
            }
        }
        .listRowBackground(isNext ? lang.color.opacity(0.12) : nil)
    }
}
