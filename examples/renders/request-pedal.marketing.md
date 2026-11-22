---
reader: marketing
scope: Request PEDAL
purpose: contract
covers: Request PEDAL (ride_review → driver_assigned); states ride_review, matching, driver_assigned; Flows 2–3; TR-003, TR-004; BR-004–BR-007, BR-009, BR-013, BR-014; MB-003–MB-006; Booking S2 (Parts 2–4)
stage: Defined
rendered_from: fcebfdc
rendered_on: 2026-11-22
---

# Request PEDAL (ride_review → driver_assigned), for marketing

> **Problem.** Hailing a pedicab is informal and uncertain. A rider may not know whether a driver is available, what the ride might cost, or whether someone is actually coming. The first PEDAL experience makes that basic journey legible without pretending the teaching app runs a real marketplace.
>
> **Success.** Someone can open the local app and complete the canonical rider path from destination entry through ride completion. The interface follows the agreed visual language, every state transition is deterministic and testable, a refresh restores the current ride, the complete path passes automated verification, and no implementation choice has widened the product boundary.
>
> **Stage.** Defined, per docs/Roadmap.md.

## Who and why

A person "in a compact downtown or entertainment district who wants a short pedicab trip." They already know where they are going; they need "a quick way to request the ride and confidence about likely wait, fare, and driver arrival." Everything in this moment runs on fixed local fixtures, not a real marketplace.

## The promise

After you request a pedicab, PEDAL tells you whether it is still finding one or a driver has been assigned, and keeps your estimated fare in view the whole time.

## Proof points

| Moment | What the rider sees, exactly | Honest footing |
|---|---|---|
| Before requesting | `Your PEDAL`, `Pickup in 4 min · Estimated fare $18`, one `PEDAL` option, `Current location` → the selected landmark | Fixed estimate fixture; "never recalculated" |
| The request | One action: `Request PEDAL` | Creates a local request only; no "payment authorization, driver record, network request, map route, notification, or cancellation entitlement" |
| Matching | `Finding a nearby pedicab`, `This usually takes less than a minute`; pickup, destination, `4 min`, and `$18` remain visible | A deterministic 1,200ms mock delay; "Submitting a request means the request is matching; it does not mean a driver is assigned." |
| Driver assigned | `Driver assigned`, `Maya is on the way`, `Maya Chen`, `PEDAL 14`, `3 min away`; `Estimated fare $18` remains visible | `Maya Chen` and `PEDAL 14` are fixtures; the map is a static route treatment with "no moving driver" |

## Do not claim

- Do not say or imply that real drivers or real pedicabs are available. `Maya Chen` and `PEDAL 14` are fixtures; there is "no driver supply, dispatch, or marketplace claim."
- Do not say or imply live tracking or a live map. The map is a "local static illustration" with no "live marker."
- Do not say or imply that `4 min` or `3 min away` is a precise arrival time, or that `$18` is a guaranteed or calculated price. The app "should not claim real availability, precise arrival, or a guaranteed price."
- Do not say or imply in-app payment, a saved payment method, promo codes, or surge pricing. The rider pays the driver directly.
- Do not say or imply that a rider can cancel, retry, call, or message the driver. None of these controls exists.
- Do not say or imply that PEDAL knows where the rider is. `Current location` is a label; there is no "permission, coordinates, or geolocation call."
- Do not say or imply notifications, scheduling, a choice of ride types, or that any address works. Destinations are `Union Square`, `Ferry Building`, and `Oracle Park`.

## Open questions

- The matching screen must say `This usually takes less than a minute`, while the same brief says the app "should not claim real availability" and MB-005 allows "no driver supply, dispatch, or marketplace claim." The artifacts do not say whether that line may be repeated outside the app. One reading quotes it as a proof point about speed; the other treats it as in-app status copy that cannot be used as an external claim. Not defined in the context.

<sub>Sources: README.md (The Product; Artifact map); docs/Vision.md (The rider; The problem; Success at the end of the Booking epic); docs/FunctionalBrief.md (Experience contract; Request and matching; Screen inventory; Content and tone; Explicit non-goals); docs/Flows.md (Flow 2; Flow 3); docs/BusinessRules.md (Canonical fixtures; Transition rules; Business rules and invariants; Mock boundaries); docs/Roadmap.md (Sprints — Booking); docs/specs/booking/S2-Ride-Request.md (Parts 2–4; Acceptance Criteria)</sub>
