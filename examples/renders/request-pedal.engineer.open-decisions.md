---
reader: engineer
scope: Request PEDAL
purpose: open decisions
covers: ride_review → matching → driver_assigned; Flows 2–3; TR-003, TR-004; BR-004–BR-007; Booking S2 Parts 2–4
stage: Defined
rendered_from: fcebfdc
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
| Are the Functional Brief's supporting-copy strings rendered on review and assigned? | Brief, Content and tone: Ride review "`Pickup in 4 min · Estimated fare $18`"; Assigned "`PEDAL 14 · 3 min away`". Flows and S2 list the same facts as separate elements ("Pickup estimate \| `4 min`", "Fare \| `Estimated fare $18`"; "Driver card \| `Maya Chen`, `PEDAL 14`, `3 min away`") and no supporting-text row for either screen. | Whether the combined line is required. Result A: each screen shows the joined string under the headline, plus the cards. Result B: only the separate card fields; the joined strings never appear. | The text assertions in `DestinationAndReview.test.tsx`, `MatchingAndAssignment.test.tsx`, and `e2e/ride-request.spec.ts`. |
| How is the fare labeled in `matching`? | Flows, Matching screen contract: "Pickup, destination, `4 min`, and `$18` remain visible". S2 Part 3: "pickup, selected destination, `4 min`, and `$18` in a compact `TripSummaryCard`". Review and assigned both require "`Estimated fare $18`". | The label. Result A: `Estimated fare $18` on all three screens. Result B: bare `$18` during matching only. | `TripSummaryCard` props and the matching-screen fare assertion. |
| After a refresh during `matching`, how long until assignment? | Flows: "Persisted `matching` \| Restore `matching` and schedule the deterministic assignment again". BR-007: "Matching resolves after a deterministic 1,200ms delay". S2 hook: "use the fixture delay of `1200ms`"; "schedule correctly when a persisted matching state is restored". TR-003: "Store request timestamp". | Whether the delay restarts or resumes, and what `requestedAt` is for. Result A: a full `1200ms` from restoration, so total matching time exceeds 1,200ms. Result B: the remainder measured from `requestedAt`, so a reload after 1,200ms assigns immediately. | `useMatchingAssignment.ts` restore path and the timer boundary in `MatchingPersistence.test.tsx`. |
| What does the Demo Controls panel show at `driver_assigned` under `?demo=1` in Booking S2? | S2 Part 4: "Demo Controls may display the current `driver_assigned` state but must still show `Lifecycle controls arrive in Booking S3` or equivalent." | Whether the stage is shown, and the exact placeholder text. Result A: stage name plus that exact string. Result B: no stage, different wording. Both pass "exposes no lifecycle transition button". | Any panel text assertion at the end state. |

## Open questions
None in scope.

<sub>Sources: docs/Vision.md (The problem; Success at the end of the Booking epic); docs/FunctionalBrief.md (Request and matching; Content and tone); docs/Flows.md (Flow 2; Flow 3; Persistence and refresh flow; Transition guardrails); docs/BusinessRules.md (Canonical fixtures; Transition rules; Business rules and invariants; Matching timer rules); docs/Roadmap.md (Sprints — Booking); docs/specs/booking/S2-Ride-Request.md (Parts 2–5; Acceptance Criteria)</sub>
