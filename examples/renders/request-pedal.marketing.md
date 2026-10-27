---
reader: marketing
scope: Request PEDAL (ride review through driver assigned)
covers: ride_review, matching, driver_assigned; Flow 2 (Review and request the ride), Flow 3 (Match the rider with a mocked driver); TR-002, TR-003, TR-004; BR-004, BR-005, BR-006, BR-007; MB-004, MB-005, MB-006; Booking S2 (Ride Request)
stage: Defined
rendered_from: 9d7cb2a
rendered_on: 2026-10-26
---

# Request PEDAL (ride review through driver assigned), for marketing

> **Problem.** Hailing a pedicab is informal and uncertain. A rider may not know whether a driver is available, what the ride might cost, or whether someone is actually coming. The first PEDAL experience makes that basic journey legible without pretending the teaching app runs a real marketplace.
>
> **Success.** Someone can open the local app and complete the canonical rider path from destination entry through ride completion. The interface follows the agreed visual language, every state transition is deterministic and testable, a refresh restores the current ride, the complete path passes automated verification, and no implementation choice has widened the product boundary.
>
> **Stage.** Defined, per docs/Roadmap.md.

## Who and why

A person in a compact downtown or entertainment district who wants a short pedicab trip and "already knows where they want to go". They need "a quick way to request the ride and confidence about likely wait, fare, and driver arrival."

## The promise

See your pickup time and fare before you ask, then watch your request go from "finding a pedicab" to a named driver on the way.

## Proof points

| Moment | What the rider sees (exact copy) |
|---|---|
| Before requesting | **Your PEDAL**, `Pickup in 4 min · Estimated fare $18`, one `PEDAL` option, `Request PEDAL` |
| Changing their mind | `Change destination` returns to destination selection |
| After requesting | **Finding a nearby pedicab**, `This usually takes less than a minute`; pickup, destination, `4 min`, and `$18` stay visible |
| Assigned | **Maya is on the way**, `Maya Chen`, `PEDAL 14`, `3 min away`, `Current location` → destination |
| Refresh | The current ride state is restored |

The distinction is the point: "Submitting a request means the request is matching; it does not mean a driver is assigned." (BR-005)

## Do not claim

- Do not say or imply drivers are real or available: Maya Chen and PEDAL 14 are fixtures; "No driver supply, dispatch, or marketplace claim" (MB-005, MB-006).
- Do not say or imply the estimate or fare is calculated or guaranteed: "No distance, demand, pricing, or route calculation" (MB-004). The app "should not claim real availability, precise arrival, or a guaranteed price."
- Do not say or imply live tracking, a live map, or a moving driver: the map is a static illustration with "no moving driver."
- Do not say or imply the rider can call, message, or cancel: "No call, chat, cancellation, live location, or payment control appears."
- Do not say or imply payment happens in the app, or that requesting authorizes a charge: the request "does not create a payment authorization."
- Do not say or imply there are ride types, scheduling, promo codes, or typed addresses: one `PEDAL` option, three landmark destinations only.
- Do not say or imply a no-driver or timeout path exists; it is a deferred decision.
- Do not say or imply the matching time is a measured statistic: matching is a fixed `1200` ms mock delay.

## Open questions

- `This usually takes less than a minute` is canonical copy, but the context does not say whether it may be used outside the app as a claim given matching is a fixed mock delay. Not defined in the context.

<sub>Sources: docs/Vision.md (The rider; The problem; Success at the end of the Booking epic); docs/FunctionalBrief.md (Request and matching; Screen inventory; Content and tone); docs/Flows.md (Flow 2; Flow 3); docs/BusinessRules.md (Transition rules; Business rules and invariants; Mock boundaries; Deferred product decisions); docs/Roadmap.md (Sprints — Booking); docs/specs/booking/S2-Ride-Request.md (Scope; Parts 2–4)</sub>
