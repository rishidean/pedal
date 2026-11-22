---
reader: engineer
scope: Request PEDAL
purpose: contract
covers: ride_review → matching → driver_assigned; Flows 2–3; TR-003, TR-004; Booking S2 (Parts 2–5)
stage: Defined
rendered_from: fcebfdc
rendered_on: 2026-11-22
---

# Request PEDAL (ride_review → driver_assigned), for engineer

> **Problem.** Hailing a pedicab is informal and uncertain. A rider may not know whether a driver is available, what the ride might cost, or whether someone is actually coming. The first PEDAL experience makes that basic journey legible without pretending the teaching app runs a real marketplace.
>
> **Success.** Someone can open the local app and complete the canonical rider path from destination entry through ride completion. The interface follows the agreed visual language, every state transition is deterministic and testable, a refresh restores the current ride, the complete path passes automated verification, and no implementation choice has widened the product boundary.
>
> **Stage.** Defined, per docs/Roadmap.md.

## State and transitions

| Rule | From | Event | Guard | Effect | To |
|---|---|---|---|---|---|
| **TR-003** | `ride_review` | `REQUEST_RIDE` (`now`: ISO timestamp from the application boundary) | Destination and estimate are present | Store request timestamp; preserve request context | `matching` |
| **TR-004** | `matching` | `ASSIGN_DRIVER` (automatic mock) | Valid matching state | Assign `maya-chen`, `pedal-14`, `assignedEtaMinutes: 3` | `driver_assigned` |

`driver_assigned` waits on `DRIVER_ARRIVED`, a Demo Controls event owned by Booking S3.

## Invariants

- **BR-005:** a submitted request is matching, not assigned.
- **BR-006:** `driverId` and `pedicabId` are `null` before `ASSIGN_DRIVER`, canonical after.
- **BR-007:** only one assignment transition may take effect.
- Unknown or state-invalid events, including a repeated `ASSIGN_DRIVER`, return state unchanged.
- Double request: "The request action is disabled after the first valid submission."
- `matching` and `driver_assigned` have no rider action. `Estimated fare $18` stays visible on `driver_assigned`; `3 min` replaces the pre-request pickup estimate.

## Timing and side effects

- Delay is the `1200` ms fixture.
- The timer belongs to the application layer, not the reducer, in one hook (`useMatchingAssignment.ts`). It schedules only when `state.stage === 'matching'`, dispatches once, clears on cleanup, stage exit, reset, or unmount, and does not duplicate under React Strict Mode.
- Every valid transition persists `PedalState` as JSON under `pedal.ride.v1`.
- Refresh in `matching`: restore `matching` and schedule exactly one assignment. Refresh in `driver_assigned`: restore it with driver context.
- Reduced motion may remove decorative animation; it may not skip the rendered `matching` state or change the timer contract.

## Boundaries

| Mock | Honest boundary |
|---|---|
| **MB-004** fixed `4 min`, `$18` | No distance, demand, pricing, or route calculation |
| **MB-005** 1,200ms deterministic delay | No driver supply, dispatch, or marketplace claim |
| **MB-006** `Maya Chen`, `PEDAL 14` fixtures | No driver account, location, contact, or acceptance action |

The request "does not create a payment authorization, driver record, network request, map route, notification, or cancellation entitlement." No new storage key or second state model.

## Proof

Booking S2 acceptance criteria in scope:

- `Request PEDAL` enters `matching`, not `driver_assigned`.
- Matching preserves pickup, destination, ETA, and fare; `Finding a nearby pedicab` is visible and announced semantically.
- At 1199ms the state remains matching; after the canonical delay it assigns the fixture driver.
- Assignment displays Maya Chen, PEDAL 14, `3 min away`, pickup, destination, and `Estimated fare $18`; no call, chat, cancel, payment, rating, or live-location control.
- Restore from persisted matching schedules one and only one assignment; refresh restores the assigned state.

Tests: `MatchingAndAssignment.test.tsx`, `MatchingPersistence.test.tsx` (fake timers), and `e2e/ride-request.spec.ts`, which must not seed state to skip matching.

Commands: `npm run typecheck`, `npm run test:run`, `npm run build`, `npm run test:e2e`. Network evidence must confirm no external application request.

## Open questions

None in scope.

<sub>Sources: README.md (Artifact map); docs/Vision.md (The problem; Success at the end of the Booking epic); docs/FunctionalBrief.md (Request and matching; Canonical fixture set); docs/Flows.md (State flow; Flow 2; Flow 3; Persistence and refresh flow; Transition guardrails); docs/BusinessRules.md (Canonical fixtures; Events; Transition rules; Business rules and invariants; Matching timer rules; Persistence contract; Mock boundaries); docs/Roadmap.md (Sprints — Booking); docs/specs/booking/S2-Ride-Request.md (Parts 2–5; Acceptance Criteria; Required commands)</sub>
