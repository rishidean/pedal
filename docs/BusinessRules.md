# PEDAL Business Rules

## TL;DR

PEDAL has one rider, one active local ride, one fixture-backed estimate, one mocked driver, and one valid state sequence. The application may simulate infrastructure; it may not improvise product behavior.

`Flows.md` owns the rider sequence. This file owns the domain semantics, invariants, fixture values, persistence, and mock boundary behind that sequence.

## Domain glossary

| Term | Definition |
|---|---|
| **Rider** | The person using the PEDAL interface; no account or identity record exists in the Booking epic |
| **Pickup** | The read-only mocked current location from which the rider requests a pedicab |
| **Destination** | One selected landmark from the local fixture catalog |
| **Estimate** | The deterministic pickup-time and fare information shown before request |
| **Ride request** | The local state created when the rider confirms the selected destination and estimate |
| **Matching** | The explicit interval after request and before a mocked driver is assigned |
| **Driver assignment** | The deterministic pairing of the request with Maya Chen and PEDAL 14 |
| **Ride lifecycle** | The ordered rider-visible progression from assignment through arrival, in-progress, and completion |
| **Demo Controls** | Non-product teaching and test controls available only under `?demo=1` |

## Canonical state model

```typescript
export type PedalStage =
  | 'destination_entry'
  | 'ride_review'
  | 'matching'
  | 'driver_assigned'
  | 'driver_arrived'
  | 'ride_in_progress'
  | 'ride_completed';

export type DestinationId =
  | 'union-square'
  | 'ferry-building'
  | 'oracle-park';

export interface PedalState {
  version: 1;
  stage: PedalStage;
  pickupId: 'current-location';
  destinationId: DestinationId | null;
  estimate: {
    pickupEtaMinutes: 4;
    fareCents: 1800;
    currency: 'USD';
  } | null;
  driverId: 'maya-chen' | null;
  pedicabId: 'pedal-14' | null;
  assignedEtaMinutes: 3 | null;
  requestedAt: string | null;
}
```

The TypeScript is a normative shape, not application code at `defined`. Booking S1 creates the concrete type file.

## Canonical fixtures

| Fixture ID | Type | Display value | Rules |
|---|---|---|---|
| `current-location` | Pickup | `Current location` | Always present; read-only; no coordinates required |
| `union-square` | Destination | `Union Square` | Valid selection |
| `ferry-building` | Destination | `Ferry Building` | Valid selection and canonical E2E path |
| `oracle-park` | Destination | `Oracle Park` | Valid selection |
| `pedal-estimate` | Estimate | `4 min`, `$18` | Appears after valid destination selection; never recalculated |
| `maya-chen` | Driver | `Maya Chen` | Must not exist in state before assignment |
| `pedal-14` | Pedicab | `PEDAL 14` | Assigned only with Maya Chen |
| `assigned-eta` | ETA | `3 min` | Replaces the pre-request pickup estimate after assignment |

## Events

```typescript
export type PedalEvent =
  | { type: 'SELECT_DESTINATION'; destinationId: DestinationId }
  | { type: 'CHANGE_DESTINATION' }
  | { type: 'REQUEST_RIDE'; now: string }
  | { type: 'ASSIGN_DRIVER' }
  | { type: 'DRIVER_ARRIVED' }
  | { type: 'START_RIDE' }
  | { type: 'COMPLETE_RIDE' }
  | { type: 'RESET_RIDE' };
```

Unknown events and events invalid for the current state must leave state unchanged.

## Transition rules

| Rule | Current state | Event | Guard | Required effect | Next state |
|---|---|---|---|---|---|
| **TR-001** | `destination_entry` | `SELECT_DESTINATION` | Destination ID exists in fixtures | Store destination and canonical estimate | `ride_review` |
| **TR-002** | `ride_review` | `CHANGE_DESTINATION` | None | Clear destination and estimate; retain pickup | `destination_entry` |
| **TR-003** | `ride_review` | `REQUEST_RIDE` | Destination and estimate are present | Store request timestamp; preserve request context | `matching` |
| **TR-004** | `matching` | `ASSIGN_DRIVER` | Valid matching state | Assign Maya Chen, PEDAL 14, and 3-minute ETA | `driver_assigned` |
| **TR-005** | `driver_assigned` | `DRIVER_ARRIVED` | Valid assigned driver and pedicab | Preserve trip and driver context | `driver_arrived` |
| **TR-006** | `driver_arrived` | `START_RIDE` | Valid destination and driver assignment | Preserve trip, estimate, and driver context | `ride_in_progress` |
| **TR-007** | `ride_in_progress` | `COMPLETE_RIDE` | Valid active ride | Preserve destination and `$18` fare | `ride_completed` |
| **TR-008** | `ride_completed` | `RESET_RIDE` | None | Return to initial state and clear active ride data | `destination_entry` |

`DRIVER_ARRIVED`, `START_RIDE`, and `COMPLETE_RIDE` may be triggered through the UI only when `?demo=1` is present. The reducer still enforces state order independently of the query parameter.

## Business rules and invariants

| ID | Rule |
|---|---|
| **BR-001** | PEDAL maintains at most one active ride in the browser. |
| **BR-002** | Pickup is always `current-location` in the Booking epic. |
| **BR-003** | A ride cannot enter `ride_review` without a destination fixture. |
| **BR-004** | A ride cannot enter `matching` without both a destination and the canonical estimate. |
| **BR-005** | Submitting a request means the request is matching; it does not mean a driver is assigned. |
| **BR-006** | Driver and pedicab data are `null` before `ASSIGN_DRIVER` and canonical after it. |
| **BR-007** | Matching resolves after a deterministic 1,200ms delay; only one assignment transition may take effect. |
| **BR-008** | Lifecycle states progress only in the order defined by TR-005 through TR-007. |
| **BR-009** | The estimated and final fare are both `1800` cents in the Booking epic. No pricing calculation exists. |
| **BR-010** | The app never stores payment status, payment method, tip, receipt, charge, or refund data. |
| **BR-011** | Completion copy instructs the rider to pay the driver directly. It does not claim payment occurred. |
| **BR-012** | The default rider UI provides no control for driver-side events. Demo Controls are visible only under `?demo=1`. |
| **BR-013** | All fixture values are deterministic. Random drivers, estimates, timing, or destinations are prohibited. |
| **BR-014** | No the Booking epic application behavior requires a network request. |
| **BR-015** | Reset clears the active ride and any pending matching timer, then restores the initial state. |
| **BR-016** | A malformed or unknown persisted record fails closed: clear it and restore the initial state. |

## Matching timer rules

The matching timer belongs to the application layer, not the reducer. It is scheduled when the rendered state is `matching`, canceled when that state exits or the component unmounts, and protected against duplicate scheduling.

Unit tests should use fake timers. Playwright should observe the matching screen before waiting for the assigned screen. A reduced-motion preference may remove decorative animation; it may not collapse the product states.

## Persistence contract

| Property | Rule |
|---|---|
| Key | `pedal.ride.v1` |
| Format | JSON serialization of `PedalState` |
| Write timing | After every valid state transition |
| Read timing | Once during application initialization |
| Version | Must equal `1` |
| Invalid JSON | Clear and return initial state |
| Unknown version | Clear and return initial state |
| Invalid stage | Clear and return initial state |
| Unknown destination or fixture reference | Clear and return initial state |
| Persisted matching state | Restore matching and schedule one assignment timer |
| Reset | Remove the key or persist a fresh initial state; the implementation must choose one method and test it consistently |

The implementation choice in the final reset row is not a product decision. Whichever method Booking S1 chooses must satisfy the same observable behavior and tests.

## Mock boundaries

| ID | Concern | Mock | Honest boundary |
|---|---|---|---|
| **MB-001** | Pickup | Label-only current location | No permission, coordinates, or geolocation call |
| **MB-002** | Destination | Three local fixtures | No text search, validation service, or geocoder |
| **MB-003** | Map | Local static illustration | No tile provider, pan, zoom, route, or live marker |
| **MB-004** | Estimate | Fixed 4-minute pickup and `$18` fare | No distance, demand, pricing, or route calculation |
| **MB-005** | Matching | 1,200ms deterministic delay | No driver supply, dispatch, or marketplace claim |
| **MB-006** | Driver | Maya Chen and PEDAL 14 fixtures | No driver account, location, contact, or acceptance action |
| **MB-007** | Lifecycle | Query-gated Demo Controls | No driver application or real-world event source |
| **MB-008** | Payment | Direct-payment instruction | No transaction, confirmation, or payment data |

## Demo Controls rules

The panel is teaching infrastructure, not a rider feature.

| Rule | Contract |
|---|---|
| Visibility | Only when `new URLSearchParams(window.location.search).get('demo') === '1'` |
| Placement | Visually separate from the mobile rider frame |
| Label | `Demo Controls` and `Teaching only` |
| Actions | Exactly one valid next lifecycle action for the current state |
| Default mode | No panel and no driver-side action controls |
| Test use | Playwright may use the controls to complete the canonical path |

## Acceptance evidence

| Evidence | Required proof |
|---|---|
| Type safety | `npm run typecheck` passes with zero errors |
| Build | `npm run build` succeeds |
| State logic | Unit tests cover every valid transition and representative invalid transitions |
| Persistence | Tests cover save, restore, malformed data, unknown version, and reset |
| Rider flow | Playwright completes Ferry Building from destination selection through reset |
| Matching | E2E observes `matching` before `driver_assigned` |
| Demo boundary | Controls are absent by default and present with `?demo=1` |
| Network boundary | E2E records no external application request |

## Deferred product decisions

The following are not hidden branches in the state machine. They require future Discovery and Definition before implementation:

- cancellation eligibility, timing, fees, and responsibility;
- no-driver, timeout, retry, and alternate-path behavior;
- live location, route quality, and location failure;
- driver acceptance, dispatch, and marketplace fairness;
- identity, account recovery, and privacy;
- pricing, payment, tips, receipts, refunds, and disputes;
- scheduled rides and reservation changes;
- safety, support, and operations workflows.

## Source-of-truth rule

If a sprint specification conflicts with an invariant or mock boundary here, this file wins and the sprint is not ready. If a new product decision changes this file, update `Flows.md`, `FunctionalBrief.md`, `Roadmap.md`, and every affected sprint specification in the same change.

## References

- [`Functional Brief`](./FunctionalBrief.md)
- [`Flows`](./Flows.md)
- [`Roadmap`](./Roadmap.md)
