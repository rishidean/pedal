---
reader: legal
scope: Request PEDAL (ride review through driver assigned)
covers: states ride_review, matching, driver_assigned; events CHANGE_DESTINATION, REQUEST_RIDE, ASSIGN_DRIVER; Flows 2–3; TR-002–TR-004; BR-003–BR-007, BR-009, BR-010, BR-013, BR-014; MB-001–MB-006; Booking S2
stage: Defined
rendered_from: 9d7cb2a
rendered_on: 2026-10-26
---

# Request PEDAL (ride review through driver assigned), for legal

> **Problem.** Hailing a pedicab is informal and uncertain. A rider may not know whether a driver is available, what the ride might cost, or whether someone is actually coming. The first PEDAL experience makes that basic journey legible without pretending the teaching app runs a real marketplace.
>
> **Success.** Someone can open the local app and complete the canonical rider path from destination entry through ride completion. The interface follows the agreed visual language, every state transition is deterministic and testable, a refresh restores the current ride, the complete path passes automated verification, and no implementation choice has widened the product boundary.
>
> **Stage.** Defined, per docs/Roadmap.md.

## What the rider is told

| Statement | Where | Called an estimate? |
|---|---|---|
| `Pickup in 4 min · Estimated fare $18` / `4 min`, `Estimated fare $18` | Ride review | Fare: yes ("Estimated fare"). Pickup time: the glossary calls it an "Estimate"; the copy does not say "estimated". |
| `Finding a nearby pedicab` / `This usually takes less than a minute` | Matching | No. |
| `Maya is on the way` / `PEDAL 14 · 3 min away`; driver `Maya Chen` | Driver assigned | No. |

Governing rule: "The app should not claim real availability, precise arrival, or a guaranteed price." The fare is fixed at `1800` cents with "No pricing calculation" (BR-009). The driver is a fixture (`maya-chen`, `pedal-14`); assignment is a deterministic `1200` ms delay, "No driver supply, dispatch, or marketplace claim" (MB-005).

## Data

| Item | Rule |
|---|---|
| Collected | Ride state only: stage, `pickupId` `current-location`, `destinationId`, fixed estimate, driver/pedicab fixture IDs, `requestedAt` (ISO timestamp). No account or identity record. |
| Stored | Browser `localStorage` under `pedal.ride.v1`, written after every valid transition. |
| Retention | Until reset or until a malformed record is cleared. A time limit is not defined in the context. |
| Location | Label only; "No permission, coordinates, or geolocation call" (MB-001). |
| Sent anywhere | Nothing. "No the Booking epic application behavior requires a network request" (BR-014); E2E must record no external application request. |

## Money

`Request PEDAL` "does not create a payment authorization". No payment method, promo, or surge on review. The app "never stores payment status, payment method, tip, receipt, charge, or refund data" (BR-010). No payment control appears through `driver_assigned`.

## Permissions and third parties

- Device permissions: none.
- External services: none; map is a local static illustration with "No tile provider".
- Honesty: "The mock must be honest"; static maps and Demo Controls "should not imitate production integrations." Demo Controls appear only under `?demo=1`, labeled `Demo Controls` and `Teaching only`; in this scope they offer no lifecycle action. Labels such as `Mock ride` "do not need to appear throughout the rider UI".

## Deliberately out of scope

| Deferred item | Obligation it would carry |
|---|---|
| Cancellation eligibility, timing, fees | Consumer terms, fees |
| No-driver timeout, retry | Availability claims |
| Live location, location failure | Location data, permissions |
| Driver acceptance, dispatch, marketplace fairness | Driver relationship, fairness |
| Identity, account recovery, privacy | Personal data |
| Pricing, payment, tips, receipts, refunds, disputes | Payments, consumer protection |
| Safety, support, operations | Safety |
| Driver contact (call, chat) | Communications |

## Open questions

- Retention period for the `pedal.ride.v1` record: Not defined in the context.
- Whether the default rider view needs any disclosure that `Maya Chen` and the timings are simulated: the artifacts rely on the static treatment and Demo Controls, which are absent by default. Not defined in the context.
- Whether `This usually takes less than a minute` and `3 min away` are presented as estimates: Not defined in the context.

<sub>Sources: README.md (The Product; Technical boundary); docs/Vision.md (The problem; Desired outcome; Product principles; Success at the end of the Booking epic); docs/FunctionalBrief.md (Request and matching; Screen inventory; Content and tone; Canonical fixture set); docs/Flows.md (Flow 2; Flow 3; Persistence and refresh flow); docs/BusinessRules.md (Domain glossary; Canonical state model; Transition rules; Business rules and invariants; Persistence contract; Mock boundaries; Demo Controls rules; Deferred product decisions); docs/Roadmap.md (Sprints — Booking; Realism); docs/specs/booking/S2-Ride-Request.md</sub>
