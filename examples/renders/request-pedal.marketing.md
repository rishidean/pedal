---
reader: marketing
scope: Request PEDAL
purpose: contract
covers: ride_review → matching → driver_assigned; Flows 2–3; TR-003, TR-004; BR-004 to BR-007, BR-013; MB-001, MB-003 to MB-006; Booking S2 (Parts 2–4)
stage: Defined
rendered_from: 6508905
rendered_on: 2026-11-22
---

# Request PEDAL (ride_review → driver_assigned), for marketing

> **Problem.** Hailing a pedicab is informal and uncertain. A rider may not know whether a driver is available, what the ride might cost, or whether someone is actually coming. The first PEDAL experience makes that basic journey legible without pretending the teaching app runs a real marketplace.
>
> **Success.** Someone can open the local app and complete the canonical rider path from destination entry through ride completion. The interface follows the agreed visual language, every state transition is deterministic and testable, a refresh restores the current ride, the complete path passes automated verification, and no implementation choice has widened the product boundary.
>
> **Stage.** Defined, per docs/Roadmap.md.

## Who and why

A person "in a compact downtown or entertainment district who wants a short pedicab trip", who "already knows where they want to go" and needs "a quick way to request the ride and confidence about likely wait, fare, and driver arrival."

## The promise

See the pickup estimate and estimated fare before you request, then see the request being matched and the driver who is assigned, as two separate steps.

## Proof points

| Moment | What the rider sees, exactly |
|---|---|
| Before requesting | `Your PEDAL` · `Pickup in 4 min · Estimated fare $18` · one `PEDAL` option · `Current location` to the selected landmark (canonical: `Ferry Building`) |
| The request | One primary action: `Request PEDAL`. No payment method, promo code, surge, or scheduling on the screen |
| While matching | `Finding a nearby pedicab` · `This usually takes less than a minute` · pickup, destination, `4 min`, and `$18` stay visible |
| Matching is not assignment | "Submitting a request means the request is matching; it does not mean a driver is assigned." |
| Once assigned | `Driver assigned` · `Maya is on the way` · `Maya Chen` · `PEDAL 14` · `3 min away` · `Current location` to the selected destination |
| After a refresh | "a refresh restores the current ride" |

## Do not claim

- Do not say or imply this is available to riders. It is a local teaching app, and the sprint that builds this moment has not started.
- Do not say or imply real drivers. `Maya Chen` and `PEDAL 14` are fixtures: "No driver account, location, contact, or acceptance action."
- Do not say or imply real availability, nearby supply, dispatch, or measured matching speed. Matching is a "1,200ms deterministic delay" with "No driver supply, dispatch, or marketplace claim."
- Do not say or imply a calculated, precise, or guaranteed fare or arrival time. `4 min`, `$18`, and `3 min` are fixed values: "No distance, demand, pricing, or route calculation."
- Do not say or imply live tracking or a live map. The map is a "Local static illustration" with "no moving driver."
- Do not say or imply in-app payment, or that requesting authorizes a payment.
- Do not say or imply cancellation, retry, or what happens when no driver is found. All are deferred.
- Do not say or imply calls or messages to the driver, notifications, accounts, ratings, or scheduled rides.
- Do not say or imply location detection or any-address trips. Pickup is a label only; destinations are three landmarks.

## Open questions

- FunctionalBrief says "The app should not claim real availability, precise arrival, or a guaranteed price", while the canonical rider copy reads `Finding a nearby pedicab`, `This usually takes less than a minute`, and `3 min away`. The artifacts do not say whether that in-app copy may be quoted outside the app. One reader could quote it as a proof point; another could treat it as unclaimable. Not defined in the context.

<sub>Sources: README.md (The Product; Artifact map); docs/Vision.md (The rider; The problem; Success at the end of the Booking epic); docs/FunctionalBrief.md (Experience contract; Request and matching; Screen inventory; Content and tone; Explicit non-goals); docs/Flows.md (Flow 2; Flow 3; Persistence and refresh flow; Future flows); docs/BusinessRules.md (Canonical fixtures; Transition rules; Business rules and invariants; Mock boundaries; Deferred product decisions); docs/Roadmap.md (Catalog; Sprints — Booking); docs/specs/booking/S2-Ride-Request.md (Parts 2–4; Excluded; Known Limitations and Future Work). No docs/results/ record exists for this scope.</sub>
