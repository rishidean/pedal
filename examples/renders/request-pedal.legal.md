---
reader: legal
scope: Request PEDAL
purpose: contract
covers: ride_review → matching → driver_assigned; REQUEST_RIDE (TR-003), ASSIGN_DRIVER (TR-004); Flows 2–3; Booking S2 Parts 2–4
stage: Defined
rendered_from: 6508905
rendered_on: 2026-11-22
---

# Request PEDAL (ride_review → driver_assigned), for legal

> **Problem.** Hailing a pedicab is informal and uncertain. A rider may not know whether a driver is available, what the ride might cost, or whether someone is actually coming. The first PEDAL experience makes that basic journey legible without pretending the teaching app runs a real marketplace.
>
> **Success.** Someone can open the local app and complete the canonical rider path from destination entry through ride completion. The interface follows the agreed visual language, every state transition is deterministic and testable, a refresh restores the current ride, the complete path passes automated verification, and no implementation choice has widened the product boundary.
>
> **Stage.** Defined, per docs/Roadmap.md.

## What the rider is told

| State | Rider-facing statement | What the artifacts call it |
|---|---|---|
| `ride_review` | `Pickup in 4 min` | "Pickup estimate"; the copy itself does not say "estimate". |
| `ride_review` | `Estimated fare $18` | An estimate in the copy; fixed fixture, "never recalculated". |
| `matching` | `Finding a nearby pedicab` | A 1,200ms mock delay: "No driver supply, dispatch, or marketplace claim". |
| `matching` | `This usually takes less than a minute` | Not called an estimate. |
| `matching` | `4 min` and `$18` "remain visible" | Labels not defined in the context. |
| `driver_assigned` | `Driver assigned`, `Maya is on the way`, `Maya Chen`, `PEDAL 14`, `3 min away` | Fixtures: "No driver account, location, contact, or acceptance action". |

Governing statement: "The app should not claim real availability, precise arrival, or a guaranteed price."

## Data

| Question | Answer |
|---|---|
| Collected | One `PedalState` record: stage, fixture IDs for pickup, destination, driver, and pedicab, the estimate, assigned ETA, and `requestedAt` (ISO timestamp). |
| Identity | "no account or identity record exists in the Booking epic". |
| Location | Pickup is a label only: "No permission, coordinates, or geolocation call". |
| Stored | Browser `localStorage` under `pedal.ride.v1`. No backend. |
| How long | Until reset or failed validation. No expiry is defined. |
| Sent anywhere | Nothing. BR-014: no network request. Analytics is a non-goal. |

## Money

The request "does not create a payment authorization, driver record, network request, map route, notification, or cancellation entitlement." BR-010: "The app never stores payment status, payment method, tip, receipt, charge, or refund data." No payment control appears in scope. BR-009: estimated and final fare are both `1800` cents.

## Permissions and third parties

- Device permissions: none; location permissions are a non-goal.
- External services: "None". The map is a local static illustration with "no provider attribution or live-map affordances".
- Honesty requirements: the experience "should never imply that a static map is live, a fixture is a real driver, or a timer is production dispatch." `Mock ride` labels "do not need to appear".
- Demo Controls appear only under `?demo=1`, labeled `Teaching only`, with no lifecycle action in Booking S2.

## Deliberately out of scope

Deferred to future Discovery and Definition (Realism, `DIRECTIONAL — do not build`): cancellation "eligibility, timing, fees, and responsibility"; "no-driver, timeout, retry, and alternate-path behavior"; live location; "driver acceptance, dispatch, and marketplace fairness"; "identity, account recovery, and privacy"; "pricing, payment, tips, receipts, refunds, and disputes"; "safety, support, and operations workflows".

## Open questions

- Flows.md says `4 min` and `$18` "remain visible" on the matching screen without giving their labels. One compliant build shows a bare `$18`; another shows `Estimated fare $18`. Which does the rider see after committing to the request?

<sub>Sources: README.md (artifact map, technical boundary); docs/Vision.md (The problem, Desired outcome, Success at the end of the Booking epic); docs/FunctionalBrief.md (Request and matching, Screen inventory, Visual language, Content and tone, Technical constraints, Explicit non-goals); docs/Flows.md (Flow 2, Flow 3, Persistence and refresh flow); docs/BusinessRules.md (Domain glossary, Canonical state model, Canonical fixtures, Transition rules, Business rules and invariants, Persistence contract, Mock boundaries, Demo Controls rules, Deferred product decisions); docs/Roadmap.md (Catalog, Sprints — Booking); docs/specs/booking/S2-Ride-Request.md (Parts 2–4, Acceptance Criteria)</sub>
