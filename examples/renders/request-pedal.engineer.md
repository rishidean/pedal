---
reader: engineer
scope: Request PEDAL
purpose: contract
covers: ride_review → matching → driver_assigned · TR-003, TR-004 · Flows 2–3 · Booking S2 (Parts 2–5), on the Booking S1 reducer and storage foundation
stage: Defined
rendered_from: 6508905
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
| **TR-003** | `ride_review` | `REQUEST_RIDE` (`now`: ISO timestamp from the application boundary) | Destination and estimate are present | Store request timestamp; preserve request context; persist | `matching` |
| **TR-004** | `matching` | `ASSIGN_DRIVER` (automatic mock) | Valid matching state | Assign `maya-chen`, `pedal-14`, `assignedEtaMinutes: 3` | `driver_assigned` |

`driver_assigned` is the end state: it waits for `DRIVER_ARRIVED`, a Demo Controls event owned by Booking S3.

## Invariants

- **BR-004:** no `matching` without both a destination and the canonical estimate.
- **BR-005:** a submitted request is matching, not assigned.
- **BR-006:** `driverId` and `pedicabId` are `null` before `ASSIGN_DRIVER` and canonical after it.
- **BR-007:** only one assignment transition may take effect.
- **BR-013:** no random drivers, estimates, timing, or destinations.
- Events invalid for the current state leave state unchanged.
- Double request: "The request action is disabled after the first valid submission."
- `matching` has no rider action; `driver_assigned` has none in the default view.

## Timing and side effects

| Concern | Contract |
|---|---|
| Delay | `1200` ms fixture; at 1199ms the state is still `matching` |
| Owner | Application layer, not the reducer: `useMatchingAssignment.ts` |
| Schedule | Only when `state.stage === 'matching'`; dispatches `ASSIGN_DRIVER` once |
| Cleanup | Cleared on stage exit, reset, or unmount; no duplicate under React Strict Mode |
| Persistence | `pedal.ride.v1`, written after every valid transition |
| Refresh in `matching` | Restore `matching`; exactly one assignment transition is scheduled |
| Refresh in `driver_assigned` | Restores with driver context |
| Reduced motion | May remove animation; may not skip `matching` or change the timer contract |

## Boundaries

| ID | Mock | Never |
|---|---|---|
| **MB-005** | 1,200ms deterministic delay | Driver supply, dispatch, or marketplace claim |
| **MB-006** | `Maya Chen` and `PEDAL 14` fixtures | Driver account, location, contact, or acceptance action |
| **MB-003** | Static route treatment | Tile provider, pan, zoom, route, or live marker |

The request creates no "payment authorization, driver record, network request, map route, notification, or cancellation entitlement". No new storage key or data layer. Booking S2 must not dispatch `DRIVER_ARRIVED`, even under `?demo=1`.

## Proof

Booking S2 acceptance criteria covering this moment:

- `Request PEDAL` enters `matching`, not `driver_assigned`.
- Matching preserves pickup, destination, ETA, and fare context.
- At 1199ms the state remains matching; after the canonical delay it assigns the fixture driver.
- Restore from persisted matching schedules one and only one assignment.
- Assignment displays Maya Chen, PEDAL 14, and `3 min away`; refresh restores it.
- No call, chat, cancel, payment, rating, or live-location control exists.
- Network evidence confirms no external application request.

`e2e/ride-request.spec.ts` must observe matching before assignment and may not seed state to skip it.

```bash
npm run typecheck
npm run test:run
npm run build
npm run test:e2e
```

## Open questions

- **Delay after a refresh in `matching`.** Flows says "Restore `matching` and schedule the deterministic assignment again"; BR-007 says "Matching resolves after a deterministic 1,200ms delay". Silent on whether the restored timer runs a full 1,200ms from restore or the remainder measured from `requestedAt`. A refresh at 800ms assigns 1,200ms later under one reading and 400ms later under the other; a timer test tells them apart.

<sub>Sources: README.md (Artifact map, Technical boundary) · docs/Vision.md (The problem; Success at the end of the Booking epic) · docs/FunctionalBrief.md (Request and matching; Accessibility and responsive behavior) · docs/Flows.md (State flow; Flows 2–3; Persistence and refresh flow; Transition guardrails) · docs/BusinessRules.md (Events; Transition rules; Business rules and invariants; Matching timer rules; Persistence contract; Mock boundaries) · docs/Roadmap.md (Sprints — Booking) · docs/specs/booking/S2-Ride-Request.md (Dependencies and Technical Constraints; Parts 2–5; Acceptance Criteria; Required commands) · docs/specs/booking/S1-App-Setup-and-Shell.md (Scope). No docs/results/ record exists.</sub>
