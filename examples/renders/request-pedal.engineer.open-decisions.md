---
reader: engineer
scope: Request PEDAL
purpose: open decisions
covers: ride_review → matching → driver_assigned; TR-003, TR-004; BR-004–BR-007, BR-013, BR-014; MB-005, MB-006; Flows 2–3; Booking S2 (Parts 2–5)
stage: Defined
rendered_from: 6508905
rendered_on: 2026-11-22
---

# Request PEDAL (ride_review → driver_assigned), for engineer, open decisions

> **Problem.** Hailing a pedicab is informal and uncertain. A rider may not know whether a driver is available, what the ride might cost, or whether someone is actually coming. The first PEDAL experience makes that basic journey legible without pretending the teaching app runs a real marketplace.
>
> **Success.** Someone can open the local app and complete the canonical rider path from destination entry through ride completion. The interface follows the agreed visual language, every state transition is deterministic and testable, a refresh restores the current ride, the complete path passes automated verification, and no implementation choice has widened the product boundary.
>
> **Stage.** Defined, per docs/Roadmap.md.

| Decision | What the artifacts say | What they leave silent | What it blocks |
|---|---|---|---|
| Is the fare shown on `driver_assigned`? | Flows, matching: "Pickup, destination, `4 min`, and `$18` remain visible". Flows, driver-assigned: "Trip context \| `Current location` → selected destination". S2: "Shared trip and driver cards \| Consistent request context". | Whether required content is a ceiling. Result A: the assigned screen keeps `$18` in the shared `TripSummaryCard`. Result B: it shows pickup and destination only, and the fare disappears until `ride_in_progress`. | `TripSummaryCard` props; assertions in `MatchingAndAssignment.test.tsx` and the assigned-state screenshot. |
| How long does matching last after a refresh? | Flows: "Persisted `matching` \| Restore `matching` and schedule the deterministic assignment again". BusinessRules: "Restore matching and schedule one assignment timer". TR-003: "Store request timestamp". | Whether the restored timer runs the full `1200ms` or the remainder since `requestedAt`. Refresh at 800ms: result A assigns 1,200ms after reload (2,000ms total); result B assigns 400ms after reload. No artifact states what `requestedAt` is for. | `useMatchingAssignment.ts` scheduling; fake-timer boundaries in `MatchingPersistence.test.tsx`. |
| What does a reduced-motion rider see while matching? | FunctionalBrief: "an immediate or minimally animated matching transition". Flows: "may shorten or remove the animation". S2: "a restrained local search animation or status treatment". | Which one. Result A: a static status treatment, no animation. Result B: a shortened animation. The 1,200ms timer is fixed either way (S2: may not "change the timer contract"). | `MatchingScreen.tsx` reduced-motion branch and any test under `prefers-reduced-motion`. |
| How are matching and assignment announced? | S2: "a semantic live region that announces matching without repeatedly interrupting assistive technology". FunctionalBrief: "Status changes must use text and semantic announcements". | The politeness level and the region's extent. Result A: one polite status region carries both `Finding a nearby pedicab` and `Maya is on the way`. Result B: an assertive announcement on assignment that interrupts the screen reader. | Live-region markup; the "announced semantically" acceptance criterion has no stated assertion. |
| What does Demo Controls show on this path under `?demo=1`? | BusinessRules: "Actions \| Exactly one valid next lifecycle action for the current state". S1: "`No demo action available` at `destination_entry`". S2: "must still show `Lifecycle controls arrive in Booking S3` or equivalent". | `ride_review` and `matching` have no lifecycle action, and no copy is given for them. Result A: the panel repeats `No demo action available`. Result B: it shows the state name only. At `driver_assigned`, "or equivalent" leaves the S2 placeholder string unfixed. | `DemoControls.tsx` empty state; any test asserting panel text before S3. |

## Open questions

None in scope.

<sub>Sources: README.md (Artifact map, Technical boundary); docs/Vision.md (The problem, Success at the end of the Booking epic); docs/FunctionalBrief.md (Request and matching, Screen inventory, Accessibility and responsive behavior); docs/Flows.md (Flow 2, Flow 3, Persistence and refresh flow, Transition guardrails); docs/BusinessRules.md (Canonical state model, Transition rules, Matching timer rules, Persistence contract, Demo Controls rules); docs/Roadmap.md (Sprints — Booking); docs/specs/booking/S1-App-Setup-and-Shell.md (Part 5); docs/specs/booking/S2-Ride-Request.md (Parts 2–5, Acceptance Criteria). No docs/results/ record exists.</sub>
