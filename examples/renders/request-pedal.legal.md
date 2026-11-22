---
reader: legal
scope: Request PEDAL
purpose: contract
covers: states `ride_review`, `matching`, `driver_assigned`; events `REQUEST_RIDE`, `ASSIGN_DRIVER`; Flows 2–3; TR-003, TR-004; Booking S2
stage: Defined
rendered_from: fcebfdc
rendered_on: 2026-11-22
---

# Request PEDAL (ride_review → driver_assigned), for legal

> **Problem.** Hailing a pedicab is informal and uncertain. A rider may not know whether a driver is available, what the ride might cost, or whether someone is actually coming. The first PEDAL experience makes that basic journey legible without pretending the teaching app runs a real marketplace.
>
> **Success.** Someone can open the local app and complete the canonical rider path from destination entry through ride completion. The interface follows the agreed visual language, every state transition is deterministic and testable, a refresh restores the current ride, the complete path passes automated verification, and no implementation choice has widened the product boundary.
>
> **Stage.** Defined, per docs/Roadmap.md.

## What the rider is told

| State | Statement | Called an estimate in the artifacts? |
|---|---|---|
| `ride_review` | `Pickup in 4 min` | Yes: "Pickup estimate"; fixture, "never recalculated". The copy itself does not say "estimated". |
| `ride_review`, `matching`, `driver_assigned` | `Estimated fare $18` (`$18` on matching) | Yes. BR-009: "The estimated and final fare are both `1800` cents"; "No pricing calculation exists." |
| `matching` | `Finding a nearby pedicab` | No. MB-005: "No driver supply, dispatch, or marketplace claim". |
| `matching` | `This usually takes less than a minute` | No. The delay is a fixed `1200ms` mock. |
| `driver_assigned` | `Driver assigned`, `Maya is on the way` | No. `Maya Chen` is a fixture; MB-006: "No driver account, location, contact, or acceptance action". |
| `driver_assigned` | `PEDAL 14 · 3 min away` | Artifacts call it "Pickup ETA"; a fixture that "replaces the pre-request pickup estimate". |

Governing statement: "The app should not claim real availability, precise arrival, or a guaranteed price."

## Data

| Question | Answer |
|---|---|
| Collected | `PedalState`: stage, fixture IDs for pickup, destination, driver, and pedicab, the estimate, the assigned ETA, and `requestedAt` (request timestamp). |
| Not collected | "no account or identity record exists"; pickup has "No permission, coordinates, or geolocation call". |
| Stored | Browser `localStorage`, key `pedal.ride.v1`, written "After every valid state transition". No backend. |
| How long | Until reset or failed validation. No time-based expiry is defined; a valid record is restored on startup. |
| Sent anywhere | Nothing. BR-014: no behavior "requires a network request"; the URL "does not encode ride state". |

## Money

The request "does not create a payment authorization, driver record, network request, map route, notification, or cancellation entitlement." Ride review has no payment method, promo code, or surge. BR-010: the app "never stores payment status, payment method, tip, receipt, charge, or refund data."

## Permissions and third parties

- Device permissions: none. External services: "None".
- The rider has no action on `matching` or `driver_assigned`: no cancel, call, chat, or live location.
- Honesty requirements: the experience "should never imply that a static map is live, a fixture is a real driver, or a timer is production dispatch." "Labels such as `Mock ride` do not need to appear throughout the rider UI".
- Demo Controls appear only under `?demo=1`, labeled `Teaching only`; in Booking S2 they dispatch nothing.

## Deliberately out of scope

Deferred, requiring "future Discovery and Definition before implementation":

- "cancellation eligibility, timing, fees, and responsibility"
- "no-driver, timeout, retry, and alternate-path behavior"
- "live location, route quality, and location failure"
- "driver acceptance, dispatch, and marketplace fairness"
- "identity, account recovery, and privacy"
- "pricing, payment, tips, receipts, refunds, and disputes"
- "safety, support, and operations workflows"

This summarizes the artifacts; it is not legal advice.

## Open questions

None in scope.

<sub>Sources: README.md (Artifact map, Technical boundary); docs/Vision.md (The problem, Desired outcome, Success at the end of the Booking epic); docs/FunctionalBrief.md (Request and matching, Screen inventory, Content and tone, Technical constraints); docs/Flows.md (Flow 2, Flow 3, Persistence and refresh flow, Direct URL behavior); docs/BusinessRules.md (Domain glossary, Canonical state model, Canonical fixtures, Business rules and invariants, Persistence contract, Mock boundaries, Demo Controls rules, Deferred product decisions); docs/Roadmap.md (Catalog, Sprints — Booking); docs/specs/booking/S2-Ride-Request.md (Parts 2–4)</sub>
