---
reader: marketing
scope: Request PEDAL (ride review through driver assigned)
covers: states ride_review, matching, driver_assigned; Flows.md Flow 2 (Review and request the ride) and Flow 3 (Match the rider with a mocked driver); TR-002, TR-003, TR-004; BR-003 to BR-007, BR-009, BR-013, BR-014; MB-004, MB-005, MB-006; Booking S2 (Ride Request)
stage: Defined
rendered_from: 80d4afb
rendered_on: 2026-10-26
---

# Request PEDAL (ride review through driver assigned), for marketing

> **Problem.** Hailing a pedicab is informal and uncertain. A rider may not know whether a driver is available, what the ride might cost, or whether someone is actually coming. The first PEDAL experience makes that basic journey legible without pretending the teaching app runs a real marketplace.
>
> **Success.** Someone can open the local app and complete the canonical rider path from destination entry through ride completion. The interface follows the agreed visual language, every state transition is deterministic and testable, a refresh restores the current ride, the complete path passes automated verification, and no implementation choice has widened the product boundary.
>
> The stronger proof is not the app itself. The proof is that the app was built from the `defined` artifacts with no application code at the starting line.
>
> **Stage.** Defined, per docs/Roadmap.md.

## Who and why

A person in a compact downtown or entertainment district who already knows where they want to go and wants a short pedicab trip. They need "a quick way to request the ride and confidence about likely wait, fare, and driver arrival."

## The promise

See your pickup time and fare before you request, then see plainly whether you are still being matched or a driver has been assigned.

## Proof points

| Moment | What the rider sees (exact) |
|---|---|
| Ride review | "Your PEDAL"; `Pickup in 4 min · Estimated fare $18`; one `PEDAL` option; pickup `Current location`; destination, e.g. `Ferry Building` |
| Commit | One primary action, **Request PEDAL**; `Change destination` returns to destination choice |
| Matching | **Finding a nearby pedicab**; `This usually takes less than a minute`; pickup, destination, `4 min`, and `$18` stay visible |
| Assigned | **Maya is on the way**; `Maya Chen`, `PEDAL 14`, `3 min away`; `Current location` → destination |
| Clarity | Matching and assignment are always two separate moments: "Submitting a request means the request is matching; it does not mean a driver is assigned." (BR-005) |
| Tone | Copy is "calm, direct, and specific. It should reduce uncertainty rather than sell the service." |

## Do not claim

- Do not say or imply drivers are real, available, or nearby. Matching is a fixed 1,200ms delay with "No driver supply, dispatch, or marketplace claim" (MB-005); Maya Chen and PEDAL 14 are fixtures (MB-006).
- Do not say or imply `This usually takes less than a minute` is a measured wait time. It is canonical screen copy over a mock.
- Do not say or imply live tracking, a live map, or a moving pedicab. The map is a static illustration with "no moving driver."
- Do not say or imply the `4 min`, `3 min`, or `$18` are calculated, precise, or guaranteed. "No distance, demand, pricing, or route calculation" (MB-004); the app "should not claim real availability, precise arrival, or a guaranteed price."
- Do not say or imply in-app payment, a card on file, or payment authorization at request. Request creates no "payment authorization" (Flow 2); payment is never stored (BR-010).
- Do not say or imply cancellation, changing destination after requesting, retry, no-driver recovery, or calling, messaging, or rating the driver.
- Do not say or imply address search, location detection, multiple ride types, scheduling, promo codes, surge, accounts, notifications, or cross-device sync. The ride is "local to the browser."
- Do not name a city or service area. The artifacts never name one.

## Open questions

- Which real city or service area, if any, may be named externally? Not defined in the context.
- May `This usually takes less than a minute` be used in external material, given it describes a mock? Not defined in the context.

<sub>Sources: README.md (The Product; Technical boundary); docs/Vision.md (The rider; The problem; Success at the end of the Booking epic); docs/FunctionalBrief.md (Request and matching; Screen inventory; Content and tone; Explicit non-goals); docs/Flows.md (Flow 2; Flow 3; Direct URL behavior; Future flows); docs/BusinessRules.md (Business rules and invariants; Mock boundaries; Deferred product decisions); docs/Roadmap.md (Sprints — Booking; Catalog: Realism); docs/specs/booking/S2-Ride-Request.md (Scope; Parts 2–4; Acceptance Criteria)</sub>
