# Sprint 2: Ride Request

## Goal

Implement the complete pre-ride rider experience: select a fixture-backed destination, review the canonical estimate, request PEDAL, observe an explicit matching state, and receive the canonical mocked driver assignment with an updated ETA.

This sprint must preserve the distinction discovered in the prototype: a submitted request is matching; it is not yet assigned.

**Demo-Ready Outcome:** A rider can select Ferry Building, review `4 min` and `$18`, tap **Request PEDAL**, see **Finding a nearby pedicab** with the request context preserved, and then see **Maya is on the way**, `PEDAL 14`, and `3 min away`. Refresh restores each state, the canonical flow passes component and Playwright tests, and no external application request occurs.

## Progress Summary

| Part | Description | Status |
|---|---|---|
| **1** | Implement destination-entry interaction and fixture-backed selection | ✅ Done |
| **2** | Implement ride review and request creation | ✅ Done |
| **3** | Implement explicit matching UI and deterministic assignment effect | ✅ Done |
| **4** | Implement driver-assigned UI and preserve trip context | ✅ Done |
| **5** | Verify transitions, persistence, accessibility, responsiveness, and network boundary | ✅ Done |

## Prerequisites

- Booking S1 is accepted and its result is recorded in `docs/results/booking-s1.md`.
- `docs/Roadmap.md` marks Booking S1 done and Booking S2 next.
- The app shell, state types, complete pure reducer, fixtures, storage adapter, provider, and verification commands exist and pass.
- Read `docs/Flows.md` and `docs/BusinessRules.md` again before implementation; this sprint is the first UI consumer of the matching decision.

## What’s Already Working

| Foundation | Required existing behavior |
|---|---|
| Visual shell | PEDAL header, rider frame, static city map, mobile layout, and visual tokens |
| State | `PedalState`, `PedalEvent`, TR-001 through TR-008 reducer, and canonical fixtures |
| Persistence | Load, validate, save, and reset behavior under `pedal.ride.v1` |
| Provider | Current state and typed dispatch exposed without side effects |
| Demo boundary | Query-gated panel present only under `?demo=1`, with no lifecycle actions yet |
| Verification | Typecheck, build, Vitest/RTL, and Playwright commands pass |

If any prerequisite is missing or fails, stop and repair Booking S1 rather than compensating inside this sprint.

## Scope

### Included

This sprint implements `destination_entry`, `ride_review`, `matching`, and `driver_assigned` in the rider UI. It wires `SELECT_DESTINATION`, `CHANGE_DESTINATION`, `REQUEST_RIDE`, and automatic `ASSIGN_DRIVER`, including persistence and restoration.

### Excluded

Do not implement driver-arrived, ride-in-progress, ride-completed, lifecycle demo buttons, cancellation, no-driver recovery, alternate ride types, arbitrary address entry, driver contact, live maps, real estimates, network matching, notifications, payment, or the Realism epic behavior.

## Dependencies and Technical Constraints

| Category | Contract |
|---|---|
| **Prior sprint** | Booking S1 must be accepted; its state, fixture, storage, shell, and verification contracts remain authoritative. |
| **Artifact dependencies** | `Flows.md` governs sequence; `BusinessRules.md` governs states, fixtures, timing, and invariants; `FunctionalBrief.md` governs UI and accessibility. |
| **State ownership** | Screen components dispatch typed events and render state; they may not create a second state model or copy fixture values into local state. |
| **Side effects** | The matching timer lives in one dedicated hook, uses the 1,200ms fixture, cleans up safely, and makes no request. |
| **Persistence** | Existing `pedal.ride.v1` adapter and validation are reused; no new storage key or data layer. |
| **Application boundary** | React, TypeScript, Tailwind, local fixtures, static map, and no external service remain fixed. |
| **Verification** | Existing commands remain stable; this sprint adds tests without weakening Booking S1 coverage. |

## Target file additions

```text
src/
├── app/
│   └── App.tsx                         # stage renderer updated
├── components/
│   ├── DestinationEntryScreen.tsx
│   ├── DestinationOption.tsx
│   ├── RideReviewScreen.tsx
│   ├── MatchingScreen.tsx
│   ├── DriverAssignedScreen.tsx
│   ├── TripSummaryCard.tsx
│   └── DriverCard.tsx
├── hooks/
│   └── useMatchingAssignment.ts
└── __tests__/
    ├── DestinationAndReview.test.tsx
    ├── MatchingAndAssignment.test.tsx
    └── MatchingPersistence.test.tsx
e2e/
└── ride-request.spec.ts
```

Small consolidations are acceptable if each screen remains independently testable and shared cards do not become speculative abstractions.

## What Needs Implementation

### Part 1: Destination-entry interaction

**Objective:** Turn the Booking S1 preview into an accessible fixture-backed selection screen.

`DestinationEntryScreen.tsx` must render:

- PEDAL brand context from the shell;
- `Where are you headed?` as the page heading;
- `Pickup: Current location` as read-only context;
- Union Square, Ferry Building, and Oracle Park from `pedalFixtures.ts`;
- the static city map; and
- no free-form input, geolocation control, or hidden external lookup.

Each destination is a semantic button with its fixture ID as the action input. Selecting one dispatches:

```typescript
{ type: 'SELECT_DESTINATION', destinationId }
```

The reducer supplies the canonical estimate and transitions to `ride_review`. The component must not copy estimate values into local component state.

The canonical Playwright path selects Ferry Building. The other two destinations must also render and transition correctly in component tests.

### Part 2: Ride review and request creation

**Objective:** Let the rider inspect the complete request context before committing.

`RideReviewScreen.tsx` must show:

| Content | Canonical value or behavior |
|---|---|
| Pickup | `Current location` |
| Destination | Selected landmark |
| Ride option | One card labeled `PEDAL` |
| Pickup estimate | `4 min` |
| Fare | `Estimated fare $18` |
| Primary action | `Request PEDAL` |
| Secondary action | `Change destination` |

`Change destination` dispatches `CHANGE_DESTINATION` and returns to `destination_entry` with no destination or estimate retained.

`Request PEDAL` dispatches `REQUEST_RIDE` with an ISO timestamp from the application boundary. After the first valid click:

- the review action is no longer available because the state changes;
- request context is preserved;
- the state persists as `matching`; and
- no network, payment, driver, or map side effect occurs.

Do not add confirmation modals, payment-method rows, promo controls, ride options, scheduling, or cancellation.

### Part 3: Matching and deterministic assignment

**Objective:** Preserve matching as a real product state and implement one safe, repeatable mock transition.

`MatchingScreen.tsx` must render:

- `Finding a nearby pedicab`;
- `This usually takes less than a minute`;
- pickup, selected destination, `4 min`, and `$18` in a compact `TripSummaryCard`;
- a restrained local search animation or status treatment; and
- a semantic live region that announces matching without repeatedly interrupting assistive technology.

The screen has no rider action.

`useMatchingAssignment.ts` owns the timer side effect. It must:

1. schedule only when `state.stage === 'matching'`;
2. use the fixture delay of `1200ms`;
3. dispatch `{ type: 'ASSIGN_DRIVER' }` once;
4. clear the timer on cleanup, stage exit, reset, or unmount;
5. avoid duplicate assignment under React Strict Mode; and
6. schedule correctly when a persisted matching state is restored.

The hook may use a ref to protect duplicate scheduling, but the reducer remains the final guard because repeated `ASSIGN_DRIVER` outside `matching` must be ignored.

Reduced-motion preference may remove decorative animation. It may not skip the rendered matching state or change the timer contract.

### Part 4: Driver assignment

**Objective:** Show the exact mocked assignment without implying a live driver system.

`DriverAssignedScreen.tsx` must render:

| Element | Required content |
|---|---|
| Status label | `Driver assigned` |
| Headline | `Maya is on the way` |
| Driver | `Maya Chen` |
| Pedicab | `PEDAL 14` |
| Pickup ETA | `3 min away` |
| Trip context | `Current location` → selected destination |
| Map | Static route treatment with no moving vehicle |

`DriverCard.tsx` reads the canonical driver and pedicab fixtures by ID. It must not accept arbitrary remote data or display call, message, rating, photo URL, license, cancel, or live-location controls.

When `?demo=1` is present, Demo Controls may display the current `driver_assigned` state but must still show `Lifecycle controls arrive in Booking S3` or equivalent. It must not dispatch `DRIVER_ARRIVED` yet.

### Part 5: Verification and evidence

**Objective:** Prove the complete request-to-assignment slice, including the prototype-derived state distinction.

#### Component and state tests

| Test file | Required assertions |
|---|---|
| `DestinationAndReview.test.tsx` | All fixture destinations render; each selection creates the correct review context; Ferry Building shows 4 min and `$18`; change destination resets; no free-form address or payment method exists |
| `MatchingAndAssignment.test.tsx` | Request renders matching first; matching copy and trip context are present; fake timer at 1199ms remains matching; timer completion assigns Maya Chen/PEDAL 14/3 min; no call, chat, cancel, or payment control exists |
| `MatchingPersistence.test.tsx` | Matching persists; restored matching schedules one assignment; assigned state restores with driver context; duplicate timers do not create repeated effects |

Use fake timers for timer boundaries and return to real timers after each test.

#### Playwright flow

`e2e/ride-request.spec.ts` must:

1. start with clean localStorage;
2. open the app at 375px;
3. select Ferry Building;
4. assert the ride-review values;
5. tap `Request PEDAL`;
6. assert that `Finding a nearby pedicab` appears before assignment;
7. wait for `Maya is on the way` and assert Maya Chen, PEDAL 14, and `3 min away`;
8. reload and assert the assigned state restores;
9. assert Demo Controls are absent without `?demo=1`;
10. assert no horizontal overflow and no external application request; and
11. capture screenshots of ride review, matching, and driver assignment as harness evidence.

The E2E test must not skip matching by seeding state directly. The visible transition is the point of the sprint.

## Files to Create or Modify

| File or group | Type | Purpose |
|---|---|---|
| `src/app/App.tsx` | Modified | Render the correct screen from stage |
| Destination and review components | New | Fixture-backed request entry |
| Matching and assignment components | New | Prototype-derived status progression |
| Shared trip and driver cards | New | Consistent request context |
| `src/hooks/useMatchingAssignment.ts` | New | Deterministic matching side effect |
| Component tests | New | Selection, request, timing, assignment, and absence rules |
| `e2e/ride-request.spec.ts` | New | Canonical path evidence through assignment |
| `docs/results/booking-s2.md` | New at completion | Sprint result and verification record |
| `docs/Roadmap.md` | Update at acceptance | Mark Booking S2 done and Booking S3 next |

Do not modify fixture values or business rules to make implementation easier. If a fixture or rule is wrong, return the decision to DEFINITION and update all affected artifacts coherently.

## Acceptance Criteria

### Destination and review

- [x] The rider sees exactly the three canonical destination fixtures.
- [x] Selecting any fixture produces the correct ride-review state.
- [x] The canonical Ferry Building review shows `Current location`, `4 min`, and `Estimated fare $18`.
- [x] `Change destination` clears the destination and estimate and returns to destination entry.
- [x] There is no arbitrary address input, ride-type selection, payment method, promo, or scheduling control.

### Matching

- [x] `Request PEDAL` enters `matching`, not `driver_assigned`.
- [x] Matching preserves pickup, destination, ETA, and fare context.
- [x] `Finding a nearby pedicab` and supporting copy are visible and announced semantically.
- [x] At 1199ms the state remains matching; after the canonical delay it assigns the fixture driver.
- [x] Restore from persisted matching schedules one and only one assignment.
- [x] Matching makes no external request and does not imply a live radius or moving driver.

### Driver assignment

- [x] Assignment displays Maya Chen, PEDAL 14, and `3 min away`.
- [x] Pickup and destination remain visible.
- [x] No call, chat, cancel, payment, rating, or live-location control exists.
- [x] Refresh restores the assigned state.
- [x] Booking S2 exposes no lifecycle transition button in either default or demo mode.

### Quality and verification

- [x] Keyboard and screen-reader interaction covers destination selection and request.
- [x] Primary controls have visible focus states and 44px minimum targets.
- [x] The rider slice has no horizontal overflow at 375px.
- [x] `npm run typecheck`, `npm run test:run`, `npm run build`, and `npm run test:e2e` pass.
- [x] Playwright screenshots show review, matching, and assignment.
- [x] Network evidence confirms no external application request.

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
| Unit/component | `npm run test:run` | ✅ Pass | Vitest: 6 test files passed; 24 tests passed in 2.73s. |
| Build | `npm run build` | ✅ Pass | Vite 7.3.6 transformed 47 modules and built in 2.46s. |
| E2E | `npm run test:e2e` | ✅ Pass | Playwright: 2 passed in 4.6s; S2 screenshots captured under `test-results/`. |
| State distinction | Matching observed before assignment | ✅ Pass | `MatchingAndAssignment.test.tsx` keeps matching through fake-timer 1199ms; `ride-request.spec.ts` visibly asserts matching before assignment. |
| Persistence | Matching and assigned restore | ✅ Pass | `MatchingPersistence.test.tsx` verifies one Strict Mode assignment after restored matching and assigned-state restoration; Playwright reload restores Maya. |
| Network boundary | Local-origin request assertion | ✅ Pass | Both Playwright specs collect non-local origins and assert `externalRequests` is `[]`. |
| Acceptance | Criteria above | ✅ Pass | All 22 criteria below are covered by passing component, Playwright, and CSS/source evidence. |

Use `✅ Pass`, `❌ Fail`, or `⏭️ N/A` when the sprint runs.

## Result Record

At acceptance, create `docs/results/booking-s2.md` with the outcome, parts completed, files changed, verification evidence, captured screenshot paths, deviations, unresolved issues, and accepted recovery commit.

Then mark Booking S2 `✅ Done` in `docs/Roadmap.md`, identify Booking S3 as next, and commit using:

```text
feat(booking-s2): ride request and assignment
```

## Known Limitations and Future Work

The driver does not arrive and the ride does not progress in this sprint. Those states and the honest Demo Controls arrive in Booking S3. Cancellation, no-driver timeout, live location, contact, real dispatch, and payment remain outside the Booking epic.

## Definition of Done

- [x] All acceptance criteria are met.
- [x] Every applicable Test Results Log row is populated and passing.
- [x] `docs/results/booking-s2.md` exists with screenshot paths and no hidden deviation.
- [x] `docs/Roadmap.md` identifies Booking S3 as next.
- [x] The prototype-derived distinction between matching and assignment is visible in the implementation and tests.
- [x] No material product or architecture decision was invented.
- [x] The accepted recovery commit exists with the required message.

## Next Step

Proceed to [`S3-Ride-Lifecycle.md`](./S3-Ride-Lifecycle.md) only after this sprint passes its Definition of Done.

## References

- [`Functional Brief`](../../FunctionalBrief.md)
- [`Flows`](../../Flows.md)
- [`Business Rules`](../../BusinessRules.md)
- [`Roadmap`](../../Roadmap.md)
