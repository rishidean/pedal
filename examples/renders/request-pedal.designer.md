---
reader: designer
scope: Request PEDAL
purpose: contract
covers: states ride_review → matching → driver_assigned; Flows 2–3; TR-003, TR-004; BR-004–BR-007, BR-013; MB-003–MB-006; Booking S2 (Parts 2–4)
stage: Defined
rendered_from: fcebfdc
rendered_on: 2026-11-22
---

# Request PEDAL (ride_review → driver_assigned), for designer

> **Problem.** Hailing a pedicab is informal and uncertain. A rider may not know whether a driver is available, what the ride might cost, or whether someone is actually coming. The first PEDAL experience makes that basic journey legible without pretending the teaching app runs a real marketplace.
>
> **Success.** Someone can open the local app and complete the canonical rider path from destination entry through ride completion. The interface follows the agreed visual language, every state transition is deterministic and testable, a refresh restores the current ride, the complete path passes automated verification, and no implementation choice has widened the product boundary.
>
> **Stage.** Defined, per docs/Roadmap.md.

## Screens in order

| State | What the rider sees | Actions available | Deliberately absent |
|---|---|---|---|
| Ride review (`ride_review`) | Headline "Your PEDAL"; "Pickup in 4 min · Estimated fare $18"; pickup "Current location"; selected destination (canonical: "Ferry Building"); one "PEDAL" card; "4 min"; "Estimated fare $18" | "Request PEDAL" (primary). "Change destination" is out of this scope. | Payment method, promo code, surge, scheduling, ride types, confirmation modal |
| Matching (`matching`) | "Finding a nearby pedicab"; "This usually takes less than a minute"; pickup, destination, "4 min" and "$18" in a compact trip summary; restrained, non-geographic search treatment on the static map | None | Cancel, retry, driver count, live radius, moving vehicle |
| Driver assigned (`driver_assigned`) | Status "Driver assigned"; headline "Maya is on the way"; "PEDAL 14 · 3 min away"; driver card "Maya Chen", "PEDAL 14", "3 min away"; "Current location" → selected destination; "Estimated fare $18"; static route treatment | None in the default view | Call, message, cancel, payment, rating, driver photo, license, live vehicle or location |

## Transitions the rider feels

- Tapping "Request PEDAL" opens matching, not assignment. The button is disabled after the first valid tap.
- After a fixed 1,200ms mock delay (a timer, not dispatch), matching becomes driver assigned on its own.
- On assignment, "3 min" replaces the "4 min" pickup estimate; the "$18" estimated fare stays.
- Driver assigned then waits; no rider action advances it.

## Visual and tone constraints

- Language: "More Modern & Minimal Hot Wheel City". Canvas `#FFF8EC` with white cards; type `#10233F`; primary action `#F24E3D` with white text; status accent `#F5B642`, never colour alone; `#4DA3FF` for route or location cues; 16–24px radii.
- One strong primary action per state. No bottom tabs.
- Copy is calm, direct, specific. Never claim real availability, precise arrival, or a guaranteed price.
- The map is a static illustration: no pan, zoom, provider attribution, live marker, or moving driver. Maya Chen and PEDAL 14 are fixtures.
- Motion: short status transitions and a restrained matching animation.

## Edge behavior

- **Refresh:** each screen restores. Restored matching runs the 1,200ms delay again, once.
- **Invalid or stale saved data:** dropped; the app opens at destination entry.
- **Empty states:** none; review cannot be reached without a destination and the estimate.
- **Reduced motion:** decorative animation may be removed; the matching screen still appears and the delay is unchanged.
- **Small screens:** one column, usable at 375px, no horizontal scrolling.
- **Accessibility:** keyboard reachable with visible focus; WCAG AA contrast; 44px minimum targets; status changes announced in text and a semantic live region.
- **`?demo=1`:** a "Demo Controls" / "Teaching only" panel sits outside the rider frame; it is not rider UI.

## Open questions

- The ride-review contract lists no map, while matching is drawn "on the static map" and assigned has a "static route treatment". Whether ride review shows the static map is not defined in the context; a review screen with and without it both comply.

<sub>Sources: docs/Vision.md (The problem; Success at the end of the Booking epic); docs/FunctionalBrief.md (Request and matching; Screen inventory; Visual language; Content and tone; Accessibility and responsive behavior); docs/Flows.md (Flow 2; Flow 3; Persistence and refresh flow; Transition guardrails); docs/BusinessRules.md (Canonical fixtures; Transition rules; Business rules and invariants; Matching timer rules; Mock boundaries; Demo Controls rules); docs/Roadmap.md (Catalog; Sprints — Booking); docs/specs/booking/S2-Ride-Request.md (Parts 2–4; Acceptance Criteria)</sub>
