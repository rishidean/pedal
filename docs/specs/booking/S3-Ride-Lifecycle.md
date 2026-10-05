# Sprint 3: Ride Lifecycle

## Goal

Complete the basic PEDAL rider journey after driver assignment. Implement rider-visible arrival, ride-in-progress, and completion states; wire the query-gated Demo Controls to the valid driver-side transitions; preserve active state across refresh; show the direct-payment instruction; reset cleanly; and verify the entire the Booking epic path.

**Demo-Ready Outcome:** With `?demo=1`, a rider can complete the Ferry Building journey from destination selection through matching, assignment, driver arrival, ride in progress, and ride completion, then see `$18` and **Pay the driver directly** and reset to a fresh ride. The default view exposes no driver-side controls, every lifecycle state restores after refresh, the complete Playwright flow passes, and no external application request occurs.

## Progress Summary

| Part | Description | Status |
|---|---|---|
| **1** | Implement the driver-arrived rider state | ✅ Done |
| **2** | Implement the ride-in-progress rider state | ✅ Done |
| **3** | Implement completion, direct-payment instruction, and reset | ✅ Done |
| **4** | Wire honest query-gated Demo Controls to valid lifecycle events | ✅ Done |
| **5** | Verify restoration, invalid transitions, accessibility, full E2E, and the Booking epic acceptance | ✅ Done |

## Prerequisites

- Booking S1 and Booking S2 are accepted with result files and recovery commits.
- `docs/Roadmap.md` marks Booking S1 and Booking S2 done and Booking S3 next.
- The default rider flow reaches `driver_assigned` with Maya Chen, PEDAL 14, and a 3-minute ETA.
- Matching and assigned states restore correctly from `pedal.ride.v1`.
- Typecheck, build, unit/component tests, and Booking S2 Playwright tests pass.
- Read the lifecycle and payment rules in `docs/Flows.md` and `docs/BusinessRules.md` before implementation.

## What’s Already Working

| Existing capability | Required state |
|---|---|
| Destination and review | Fixture selection, estimate, change destination, and request work |
| Matching | Explicit matching state and deterministic 1,200ms assignment work |
| Assignment | Driver card, trip context, and assigned restoration work |
| State foundation | TR-005 through TR-008 already exist as pure reducer transitions with baseline unit tests |
| Demo panel | Hidden by default and visible under `?demo=1`, but exposes no lifecycle action |
| Verification | Booking S1 and Booking S2 commands and tests pass |

If the reducer does not already implement the normative lifecycle transitions, repair Booking S1 and record the deviation rather than create a second state mechanism here.

## Scope

### Included

This sprint renders `driver_arrived`, `ride_in_progress`, and `ride_completed`; wires the query-gated Demo Controls to `DRIVER_ARRIVED`, `START_RIDE`, and `COMPLETE_RIDE`; implements `RESET_RIDE`; verifies persistence at every lifecycle state; and runs the complete the Booking epic acceptance path.

### Excluded

Do not add automatic driver-arrival timers, a driver app, rider-triggered arrival controls in the default product surface, live route progress, destination changes, contact, safety, cancellation, no-driver recovery, payment confirmation, tips, ratings, receipts, history, backend storage, or the Realism epic behavior.

## Dependencies and Technical Constraints

| Category | Contract |
|---|---|
| **Prior sprints** | Booking S1 and Booking S2 must be accepted. Their shell, state, fixture, persistence, matching, assignment, and verification behavior remains intact. |
| **Artifact dependencies** | `Flows.md` fixes lifecycle order; `BusinessRules.md` fixes events, invariants, direct-payment boundary, and Demo Controls; `FunctionalBrief.md` fixes copy and UI absence rules. |
| **State ownership** | Reuse TR-005 through TR-008 in the existing reducer. Do not create component-local lifecycle state or an alternate event path. |
| **Demo boundary** | Driver-side events may be triggered only from the separate `?demo=1` panel. The default rider DOM exposes no such controls. |
| **Persistence** | Reuse `pedal.ride.v1`; every lifecycle state must validate and restore. |
| **Application boundary** | No external service, live route, backend, auth, payment, or driver surface may be added. |
| **Verification** | Preserve all prior tests and add the complete EPIC path; later coverage may extend but not replace earlier evidence. |

## Target file additions

```text
src/
├── app/
│   └── App.tsx                         # stage renderer completed
├── components/
│   ├── DriverArrivedScreen.tsx
│   ├── RideInProgressScreen.tsx
│   ├── RideCompleteScreen.tsx
│   └── DemoControls.tsx                # lifecycle actions added
└── __tests__/
    ├── RideLifecycle.test.tsx
    ├── DemoControls.test.tsx
    └── LifecyclePersistence.test.tsx
e2e/
└── complete-rider-journey.spec.ts
```

Reuse the Booking S2 trip and driver cards where they preserve the same content. Do not refactor working components solely to create a design system.

## What Needs Implementation

### Part 1: Driver-arrived state

**Objective:** Tell the rider the mocked driver has reached the pickup point without implying live location or rider control over arrival.

`DriverArrivedScreen.tsx` must render:

| Element | Required content |
|---|---|
| Status | `Driver arrived` |
| Headline | `Your pedicab is here` |
| Supporting text | `Meet Maya at Current location` |
| Driver | `Maya Chen` |
| Pedicab | `PEDAL 14` |
| Trip context | `Current location` → selected destination |
| Rider actions | None |

The screen must not show a pickup PIN, wait fee, call, message, cancel, live map, or `Start ride` product button. The driver-side transition appears only in Demo Controls when demo mode is enabled.

### Part 2: Ride-in-progress state

**Objective:** Show that the simulated ride is underway while preserving the honest static-map boundary.

`RideInProgressScreen.tsx` must render:

- `Heading to {destination}`;
- `Estimated fare $18`;
- a static route treatment from the existing map component;
- compact Maya Chen and PEDAL 14 context; and
- no rider action.

The screen must not show live route progress, speed, remaining distance, changing ETA, destination editing, stop controls, emergency tools, payment, or a rider-facing complete action.

### Part 3: Completion and reset

**Objective:** Close the journey without inventing an in-app transaction.

`RideCompleteScreen.tsx` must render:

| Element | Required content |
|---|---|
| Headline | `You’ve arrived` |
| Destination | Selected landmark; canonical path is `Ferry Building` |
| Fare | `$18` |
| Instruction | `Pay the driver directly` |
| Primary action | `Start another ride` |

Do not show `Paid`, a payment method, tip, receipt, rating, driver earnings, transaction ID, or confirmation checkbox.

`Start another ride` dispatches `RESET_RIDE`. The reset must:

- clear destination, estimate, request timestamp, driver, pedicab, and assigned ETA;
- return to `destination_entry`;
- clear or replace `pedal.ride.v1` consistently with the Booking S1 storage decision;
- cancel any pending timer defensively; and
- leave the fixture catalog available.

### Part 4: Demo Controls lifecycle actions

**Objective:** Simulate absent driver-side events without polluting the rider interface.

When `?demo=1` is present, `DemoControls.tsx` must display the current stage and exactly one valid action:

| Current stage | Control label | Dispatched event |
|---|---|---|
| `driver_assigned` | `Simulate driver arrival` | `DRIVER_ARRIVED` |
| `driver_arrived` | `Start simulated ride` | `START_RIDE` |
| `ride_in_progress` | `Complete simulated ride` | `COMPLETE_RIDE` |

For `destination_entry`, `ride_review`, `matching`, and `ride_completed`, show `No demo action available` and no lifecycle button.

The panel must remain outside `RiderFrame`, carry `Demo Controls` and `Teaching only`, and never render without the exact query value `demo=1`. `?demo=true`, `?demo=0`, and unrelated query strings do not enable it.

Default-mode UI must provide no DOM control capable of dispatching driver-side events. This absence is part of acceptance, not a visual preference.

### Part 5: Full EPIC verification

**Objective:** Prove the complete rider journey, state restoration, mock boundary, and artifact agreement.

#### Component and state tests

| Test file | Required assertions |
|---|---|
| `RideLifecycle.test.tsx` | Driver arrived, in progress, and complete screens render canonical copy and context; reset returns to destination entry; payment, rating, call, cancel, and live-route controls are absent |
| `DemoControls.test.tsx` | Exact query gating; correct one-button mapping at each eligible state; no action in ineligible states; button dispatches the expected event only once |
| `LifecyclePersistence.test.tsx` | Assigned, arrived, in-progress, and completed states each restore; reset clears active data; malformed lifecycle state falls back safely |
| Existing reducer tests | Invalid lifecycle events leave state unchanged; lifecycle order cannot be skipped; reset clears all active-ride fields |

#### Complete Playwright journey

`e2e/complete-rider-journey.spec.ts` must:

1. start with clean localStorage and open `/?demo=1` at 375px;
2. select Ferry Building;
3. assert the review values and request PEDAL;
4. observe matching before assignment;
5. assert Maya Chen, PEDAL 14, and `3 min away`;
6. reload and confirm assigned restoration;
7. use `Simulate driver arrival` and assert `Your pedicab is here`;
8. reload and confirm arrived restoration;
9. use `Start simulated ride` and assert `Heading to Ferry Building`;
10. reload and confirm in-progress restoration;
11. use `Complete simulated ride` and assert `You’ve arrived`, `$18`, and `Pay the driver directly`;
12. reload and confirm completion restoration;
13. click `Start another ride` and assert destination entry with no active driver or ride context;
14. reload and confirm the reset state;
15. open the default URL without `demo=1` and confirm Demo Controls and driver-side actions are absent;
16. verify no horizontal overflow, critical focus order, and semantic status updates; and
17. fail if any application request leaves the local Vite origin.

Capture screenshots for driver arrived, ride in progress, ride complete, and final reset. Preserve earlier Booking S2 screenshots so the EPIC evidence shows the complete sequence.

## Files to Create or Modify

| File or group | Type | Purpose |
|---|---|---|
| `src/app/App.tsx` | Modified | Complete stage-to-screen rendering |
| Lifecycle screen components | New | Arrival, in-progress, and completion rider states |
| `src/components/DemoControls.tsx` | Modified | Honest query-gated lifecycle simulation |
| Component and persistence tests | New/modified | Lifecycle behavior and boundaries |
| `e2e/complete-rider-journey.spec.ts` | New | Complete the Booking epic proof |
| `docs/results/booking-s3.md` | New at completion | Sprint and EPIC result record |
| `docs/Roadmap.md` | Update at acceptance | Mark Booking S3 and the Booking epic done |

## Acceptance Criteria

### Rider lifecycle

- [x] `driver_arrived` shows `Your pedicab is here`, Maya Chen, PEDAL 14, pickup, and destination.
- [x] `ride_in_progress` shows `Heading to {destination}` and `Estimated fare $18` with a static route treatment.
- [x] `ride_completed` shows `You’ve arrived`, the selected destination, `$18`, and `Pay the driver directly`.
- [x] No lifecycle screen contains payment confirmation, tips, receipt, rating, contact, cancellation, live location, route editing, or safety controls.
- [x] Each lifecycle state survives refresh with its required context.

### Demo Controls

- [x] The panel is absent unless the exact query contains `demo=1`.
- [x] The panel is visibly separate from the rider surface and labeled `Teaching only`.
- [x] `driver_assigned` exposes only `Simulate driver arrival`.
- [x] `driver_arrived` exposes only `Start simulated ride`.
- [x] `ride_in_progress` exposes only `Complete simulated ride`.
- [x] Ineligible states expose no demo action.
- [x] Default-mode DOM contains no driver-side transition control.

### Completion and reset

- [x] Completion does not claim the rider paid.
- [x] `Start another ride` returns to destination entry and clears all active-ride data.
- [x] Refresh after reset remains at destination entry.
- [x] A pending matching timer cannot fire after reset.

### Full EPIC quality

- [x] The canonical Ferry Building path passes from start through reset.
- [x] The rider UI is usable at 375px, keyboard operable, and semantically announced.
- [x] All visible values match the canonical fixtures.
- [x] No external application request occurs.
- [x] No backend, auth, map provider, payment package, or the Realism epic behavior exists.
- [x] `npm run typecheck`, `npm run test:run`, `npm run build`, and `npm run test:e2e` pass.

## Verification & Testing

### Required commands

```bash
npm run typecheck
npm run test:run
npm run build
npm run test:e2e
```

### Test Results Log

Populate during execution.

| Category | Command or check | Result | Evidence or notes |
|---|---|---|---|
| Type safety | `npm run typecheck` | ✅ Pass | `tsc -b` exited 0 on 2026-10-04. |
| Unit/component | `npm run test:run` | ✅ Pass | Vitest: 9 test files passed; 44 tests passed in 3.14s. |
| Build | `npm run build` | ✅ Pass | Vite 7.3.6 transformed 50 modules and built in 2.48s. |
| E2E | `npm run test:e2e` | ✅ Pass | Playwright: 3 passed in 6.1s; the complete lifecycle spec captured four S3 screenshots under `test-results/`. |
| Full rider path | Destination through reset | ✅ Pass | `complete-rider-journey.spec.ts` drives Ferry Building through review, matching, assignment, arrival, in-progress, completion, reset, and post-reset reload. |
| Persistence | Restore every lifecycle state | ✅ Pass | `LifecyclePersistence.test.tsx` restores assigned, arrived, in-progress, and completed states; Playwright reloads each active lifecycle state and the reset state. |
| Demo boundary | Exact query gate and default absence | ✅ Pass | `DemoControls.test.tsx` rejects `demo=true`, `demo=0`, and unrelated queries, proves one valid action per eligible stage, and the E2E flow proves default-mode absence. |
| Payment boundary | Direct instruction; no payment state | ✅ Pass | `RideLifecycle.test.tsx` asserts `Pay the driver directly` and the absence of paid, payment-method, tip, receipt, rating, and transaction UI. |
| Network boundary | Local-origin request assertion | ✅ Pass | All Playwright specs collect non-local origins and assert `externalRequests` is `[]`. |
| Acceptance | Criteria above | ✅ Pass | All 22 criteria are covered by the passing component, reducer, Playwright, CSS, and source-boundary evidence recorded above. |

Use `✅ Pass`, `❌ Fail`, or `⏭️ N/A` when the sprint runs.

## Result Record

At acceptance, create `docs/results/booking-s3.md` containing:

| Field | Required record |
|---|---|
| Sprint outcome | What Booking S3 added |
| EPIC outcome | Proof that the full Basic Rider Booking EPIC is usable |
| Parts completed | Final status for Parts 1–5 |
| Files changed | Created and modified paths |
| Verification | Commands, results, screenshot paths, and network-boundary evidence |
| Artifact agreement | Confirmation that implementation matches Vision, Brief, Flows, and Business Rules |
| Deviations | Any accepted implementation choice and why it preserves the contract |
| Unresolved issues | `None` or a named blocker; no hidden TODOs |
| Recovery | Accepted commit hash and how to return to Booking S1, Booking S2, and Booking S3 states |

Mark Booking S3 `✅ Done` and the Booking epic complete in `docs/Roadmap.md`. Commit using:

```text
feat(booking-s3): complete rider lifecycle
```

Create or retain one canonical recovery reference after each sprint so a facilitator can rebase the room without rerunning prior work.

## Known Limitations and Future Work

The complete app remains a local teaching simulation. Cancellation, no-driver timeout, real maps and location, production matching, driver and operations surfaces, accounts, payments, tips, receipts, scheduled rides, and safety workflows require fresh Discovery and Definition in the Realism epic or later.

## Definition of Done

- [x] All acceptance criteria are met.
- [x] Every applicable Test Results Log row is populated and passing.
- [x] `docs/results/booking-s3.md` proves both the sprint and EPIC outcomes.
- [x] `docs/Roadmap.md` marks all the Booking epic sprints done.
- [x] Canonical Booking S1, Booking S2, and Booking S3 recovery references exist.
- [x] The complete implementation remains inside the locked product and technical boundary.
- [x] No material decision was invented during implementation.
- [x] The accepted recovery commit exists with the required message.

## Next Step

Return to the DEVELOPMENT workshop’s artifact-governance movement. the Realism epic remains directional and must not execute until its product decisions are resolved and its sprint specifications pass the same readiness gate.

## References

- [`Functional Brief`](../../FunctionalBrief.md)
- [`Flows`](../../Flows.md)
- [`Business Rules`](../../BusinessRules.md)
- [`Roadmap`](../../Roadmap.md)
