---
reader: designer
scope: Request PEDAL
purpose: contract
covers: Request PEDAL (ride_review → driver_assigned); states `ride_review`, `matching`, `driver_assigned`; Flow 2 (request behavior), Flow 3; TR-003, TR-004; BR-004 to BR-007; MB-003 to MB-006; Booking S2 Parts 2–4
stage: Defined
rendered_from: 6508905
rendered_on: 2026-11-22
---

# Request PEDAL (ride_review → driver_assigned), for designer

> **Problem.** Hailing a pedicab is informal and uncertain. A rider may not know whether a driver is available, what the ride might cost, or whether someone is actually coming. The first PEDAL experience makes that basic journey legible without pretending the teaching app runs a real marketplace.
>
> **Success.** Someone can open the local app and complete the canonical rider path from destination entry through ride completion. The interface follows the agreed visual language, every state transition is deterministic and testable, a refresh restores the current ride, the complete path passes automated verification, and no implementation choice has widened the product boundary.
>
> **Stage.** Defined, per docs/Roadmap.md.

## Screens in order

| State | What the rider sees | Actions | Deliberately absent |
|---|---|---|---|
| Ride review (`ride_review`) | Headline "Your PEDAL"; "Pickup in 4 min · Estimated fare $18"; pickup "Current location"; selected destination (canonical "Ferry Building"); one "PEDAL" card | "Request PEDAL" (primary). "Change destination" exists but is outside this moment | Payment method, promo code, surge, scheduling, ride types, confirmation modal |
| Matching (`matching`) | "Finding a nearby pedicab"; "This usually takes less than a minute"; compact trip summary with pickup, destination, "4 min", "$18"; restrained, non-geographic search treatment on the static map | None | Cancel, retry, driver count, live radius, moving vehicle |
| Driver assigned (`driver_assigned`) | Status "Driver assigned"; headline "Maya is on the way"; driver card "Maya Chen", "PEDAL 14", "3 min away"; "Current location" → selected destination; static route treatment | None in the default view | Call, message, cancel, payment, rating, photo, license, live location, moving driver |

## Transitions the rider feels

- Tapping "Request PEDAL" goes straight to Matching. The button cannot be used twice. A submitted request is matching, not assigned.
- Matching lasts a fixed, mocked 1,200ms, then becomes Driver assigned automatically.
- On assignment, "3 min" replaces the "4 min" pickup estimate.
- Driver assigned waits. The next step is a driver-side event the rider cannot trigger; it arrives through Demo Controls (`?demo=1` only, outside the rider frame).

## Visual and tone constraints

- More Modern & Minimal Hot Wheel City: canvas `#FFF8EC`, white cards, restrained shadows; navy `#10233F` rounded sans type; 16–24px radii.
- One strong primary action per state, coral `#F24E3D` with white text. No bottom tabs.
- Status accent `#F5B642`, always paired with text or icon. Sky blue `#4DA3FF` for route or location cues.
- Map is a local static illustration: no pan, zoom, provider attribution, live marker, or computed route.
- Motion: short status transitions and a restrained matching animation.
- Copy is calm, direct, specific. Never claim real availability, precise arrival, or a guaranteed price.
- Never imply a live radius, driver supply, or a real driver: Maya Chen and PEDAL 14 are fixtures; matching is a timer.

## Edge behavior

| Case | Behavior |
|---|---|
| Refresh on any of the three screens | Restores that screen. Restored Matching schedules its assignment again, once |
| Invalid or unknown saved ride | Cleared; rider lands on destination entry. No crash |
| Reduced motion | Decorative animation may be removed; the Matching screen still appears and the 1,200ms is unchanged |
| Announcements | Matching is announced through a semantic live region, without repeated interruption; status never by color or animation alone |
| Small screen | Fully usable at 375px, one column, no horizontal scroll, primary action reachable |
| Wider screen | Phone-like max-width frame; not a dashboard |
| Controls | Keyboard reachable, visible focus, 44px targets, WCAG AA contrast |
| Empty state | None: review requires a destination and estimate |

## Open questions

- Matching says pickup, destination, "`4 min`, and `$18` remain visible" but gives no label wording. Not defined in the context: whether the summary repeats "Pickup in 4 min · Estimated fare $18" or shows bare values.
- Driver assigned lists trip context as "`Current location` → selected destination". Not defined in the context: whether "$18" stays visible on this screen or drops until ride in progress.

<sub>Sources: README.md (Artifact map, Rendering a PRD); docs/Vision.md (The problem, Success at the end of the Booking epic); docs/FunctionalBrief.md (Request and matching, Screen inventory, Visual language, Content and tone, Accessibility and responsive behavior); docs/Flows.md (Flow 2, Flow 3, Flow 4 demo-mode entry, Persistence and refresh flow, Transition guardrails); docs/BusinessRules.md (Canonical fixtures, Transition rules, Business rules and invariants, Matching timer rules, Mock boundaries); docs/Roadmap.md (Catalog, Sprints — Booking); docs/specs/booking/S2-Ride-Request.md (Parts 2–4, Acceptance Criteria)</sub>
