---
reader: legal
scope: Request PEDAL (ride review through driver assigned)
covers: states ride_review, matching, driver_assigned; events SELECT_DESTINATION (entry), CHANGE_DESTINATION, REQUEST_RIDE, ASSIGN_DRIVER; Flows 2–3; TR-001–TR-004; BR-001–BR-007, BR-009, BR-010, BR-013, BR-014, BR-016; MB-001–MB-006, MB-008; Booking S2
stage: Defined
rendered_from: 80d4afb
rendered_on: 2026-10-26
---

# Request PEDAL (ride review through driver assigned), for legal

> **Problem.** Hailing a pedicab is informal and uncertain. A rider may not know whether a driver is available, what the ride might cost, or whether someone is actually coming. The first PEDAL experience makes that basic journey legible without pretending the teaching app runs a real marketplace.
>
> **Success.** Someone can open the local app and complete the canonical rider path from destination entry through ride completion. The interface follows the agreed visual language, every state transition is deterministic and testable, a refresh restores the current ride, the complete path passes automated verification, and no implementation choice has widened the product boundary.
>
> The stronger proof is not the app itself. The proof is that the app was built from the `defined` artifacts with no application code at the starting line.
>
> **Stage.** Defined, per docs/Roadmap.md.

## What the rider is told

| Statement | Rider-facing copy | Called an estimate? |
|---|---|---|
| Pickup time | `Pickup in 4 min` | Yes in the artifacts ("Pickup estimate"); the copy itself does not say "estimate" |
| Fare | `Estimated fare $18` | Yes, in the copy |
| Availability | `Finding a nearby pedicab` | No |
| Matching time | `This usually takes less than a minute` | No |
| Driver identity | `Maya is on the way`, `Maya Chen`, `PEDAL 14` | No; a fixture (MB-006) |
| Arrival | `3 min away` | No |

Governing limit: "The app should not claim real availability, precise arrival, or a guaranteed price." The rider UI need not carry `Mock ride` labels; in the default view, Demo Controls are absent.

## Data

| Item | Rule |
|---|---|
| Collected | Destination fixture ID, fixed estimate, request timestamp (`requestedAt`), driver and pedicab fixture IDs. No account or identity record. |
| Location | `Current location` is a label only: "No permission, coordinates, or geolocation call" (MB-001). |
| Stored | Browser `localStorage`, key `pedal.ride.v1`, written after every valid transition. |
| Retention | Until reset or until a malformed record is cleared (BR-016). Reset is reachable only from `ride_completed`. No expiry: Not defined in the context. |
| Sent anywhere | Nothing. "No the Booking epic application behavior requires a network request" (BR-014); E2E asserts no external request. |

## Money

`$18` is fixed at `1800` cents; "No pricing calculation exists" (BR-009). Request "does not create a payment authorization." The app never stores payment status, method, tip, receipt, charge, or refund data (BR-010). Direct-payment instruction appears only at completion, outside this scope.

## Permissions and third parties

No device permissions, no external services, no map provider, geocoder, or dispatch. Honesty boundaries: the map is a static illustration (MB-003); matching is a 1,200ms deterministic delay with "no driver supply, dispatch, or marketplace claim" (MB-005); Maya Chen has "no driver account, location, contact, or acceptance action" (MB-006). Demo Controls show under `?demo=1` only and dispatch no lifecycle event in this scope.

## Deliberately out of scope

Deferred to Realism; each would carry obligations if built: cancellation eligibility, timing, fees; no-driver and timeout behavior; live location; driver acceptance and marketplace fairness; identity, account recovery, and privacy; pricing, payment, tips, receipts, refunds, disputes; safety, support, and operations.

## Open questions

- Retention: no expiry is defined for the `pedal.ride.v1` record. A ride left in `matching` or `driver_assigned` persists indefinitely in the browser.
- The artifacts do not say whether the rider must ever be told that the driver, availability, and timing are simulated. The default view carries no such disclosure.

<sub>Sources: README.md (The Product; Technical boundary); docs/Vision.md (The problem; Success at the end of the Booking epic; Product boundary); docs/FunctionalBrief.md (Capabilities; Screen inventory; Content and tone; Explicit non-goals); docs/Flows.md (Flow 2; Flow 3; Persistence and refresh flow); docs/BusinessRules.md (Canonical state model; Canonical fixtures; Business rules and invariants; Persistence contract; Mock boundaries; Deferred product decisions); docs/Roadmap.md (Catalog; Sprints — Booking); docs/specs/booking/S2-Ride-Request.md.</sub>
