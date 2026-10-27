---
reader: engineer
scope: Request PEDAL (ride review through driver assigned)
covers: states ride_review, matching, driver_assigned; Flows.md Flow 2 and Flow 3, Persistence and refresh flow, Transition guardrails; BusinessRules.md TR-002, TR-003, TR-004, BR-003 to BR-007, BR-012 to BR-014, BR-016, MB-004 to MB-006; sprint Booking S2
stage: Defined
rendered_from: 80d4afb
rendered_on: 2026-10-26
---

# Request PEDAL (ride review through driver assigned), for engineer

> **Problem.** Hailing a pedicab is informal and uncertain. A rider may not know whether a driver is available, what the ride might cost, or whether someone is actually coming. The first PEDAL experience makes that basic journey legible without pretending the teaching app runs a real marketplace.
>
> **Success.** Someone can open the local app and complete the canonical rider path from destination entry through ride completion. The interface follows the agreed visual language, every state transition is deterministic and testable, a refresh restores the current ride, the complete path passes automated verification, and no implementation choice has widened the product boundary.
>
> **Stage.** Defined, per docs/Roadmap.md.

## State and transitions

Entry is TR-001 (`SELECT_DESTINATION`, stores destination and canonical estimate).

| Rule | From | Event | Guard | Effect | To |
|---|---|---|---|---|---|
| TR-002 | `ride_review` | `CHANGE_DESTINATION` | None | Clear destination and estimate; retain pickup | `destination_entry` |
| TR-003 | `ride_review` | `REQUEST_RIDE` (`now: string`) | Destination and estimate are present | Store request timestamp; preserve request context | `matching` |
| TR-004 | `matching` | `ASSIGN_DRIVER` | Valid matching state | Assign `maya-chen`, `pedal-14`, `assignedEtaMinutes: 3` | `driver_assigned` |

Unknown or invalid events leave state unchanged. No other transition is valid.

## Invariants

- BR-004: no `matching` without destination and canonical estimate (`pickupEtaMinutes: 4`, `fareCents: 1800`, `USD`).
- BR-005: a submitted request is matching, not assigned.
- BR-006: `driverId`, `pedicabId` are `null` before `ASSIGN_DRIVER`, canonical after.
- BR-007: only one assignment transition may take effect.
- BR-013: no random drivers, estimates, timing, or destinations.
- Components dispatch typed events and render state; they never copy fixture values into local state (S2).

## Timing and side effects

- `useMatchingAssignment.ts` owns the timer: schedules only when `stage === 'matching'`, waits `1200ms`, dispatches `{ type: 'ASSIGN_DRIVER' }` once, clears on stage exit, reset, or unmount, and is Strict Mode safe. The reducer stays the final guard.
- Every valid transition persists `PedalState` as JSON under `pedal.ride.v1`; read once at init.
- Refresh in `matching`: restore `matching` and schedule exactly one assignment timer. Refresh in `driver_assigned`: restore with driver context.
- Malformed, unknown-version, invalid-stage, or unknown-fixture records: clear and return initial state (BR-016).
- Reduced motion may drop animation; it may not skip `matching` or change the timer.

## Boundaries

- Mocked: estimate (MB-004), matching delay (MB-005), driver fixtures (MB-006). No supply, dispatch, or pricing.
- `REQUEST_RIDE` creates no payment authorization, driver record, network request, map route, notification, or cancellation entitlement.
- Never add: call, chat, cancel, rating, photo URL, license, live-location, payment, promo, scheduling, or ride-type controls; network calls (BR-014); new storage keys.
- Under `?demo=1`, Demo Controls show the state but no lifecycle action in S2.

## Proof

Commands: `npm run typecheck`, `npm run test:run`, `npm run build`, `npm run test:e2e`.

| Test | Must prove |
|---|---|
| `MatchingAndAssignment.test.tsx` | Matching renders first; at 1199ms still `matching`; then Maya Chen / PEDAL 14 / 3 min; no call, chat, cancel, payment control |
| `MatchingPersistence.test.tsx` | Matching persists; restore schedules one assignment; assigned restores; no duplicate effects |
| `e2e/ride-request.spec.ts` | At 375px: Ferry Building review, `Finding a nearby pedicab` before `Maya is on the way`, reload restores, no Demo Controls by default, no overflow, no external request, screenshots of review, matching, assignment. No seeding past matching. |

## Open questions

- On restore of a persisted `matching` state, is the 1,200ms delay measured from restore or from `requestedAt`? Not defined in the context.
- The `assigned-eta` fixture "Replaces the pre-request pickup estimate after assignment," yet TR-006 preserves `estimate`. Is the replacement display-only, with `estimate.pickupEtaMinutes` retained in state? Not defined in the context.

<sub>Sources: README.md (Technical boundary, Agent operating rules); docs/Vision.md (The problem, Success at the end of the Booking epic); docs/FunctionalBrief.md (Technical constraints); docs/Flows.md (State flow, Flow 2, Flow 3, Persistence and refresh flow, Transition guardrails); docs/BusinessRules.md (Canonical state model, Canonical fixtures, Events, Transition rules, Business rules and invariants, Matching timer rules, Persistence contract, Mock boundaries); docs/Roadmap.md (Sprints — Booking); docs/specs/booking/S2-Ride-Request.md (Scope, Dependencies and Technical Constraints, Parts 2–5, Acceptance Criteria, Verification & Testing).</sub>
