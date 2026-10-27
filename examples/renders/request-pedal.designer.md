---
reader: designer
scope: Request PEDAL (ride review through driver assigned)
covers: states `ride_review`, `matching`, `driver_assigned`; Flow 2 (Review and request the ride), Flow 3 (Match the rider with a mocked driver); rules TR-002, TR-003, TR-004, BR-004 to BR-007, BR-012; sprint Booking S2
stage: Defined
rendered_from: 80d4afb
rendered_on: 2026-10-26
---

# Request PEDAL (ride review through driver assigned), for designer

> **Problem.** Hailing a pedicab is informal and uncertain. A rider may not know whether a driver is available, what the ride might cost, or whether someone is actually coming. The first PEDAL experience makes that basic journey legible without pretending the teaching app runs a real marketplace.
>
> **Success.** Someone can open the local app and complete the canonical rider path from destination entry through ride completion. The interface follows the agreed visual language, every state transition is deterministic and testable, a refresh restores the current ride, the complete path passes automated verification, and no implementation choice has widened the product boundary.
>
> **Stage.** Defined, per docs/Roadmap.md.

## Screens in order

| State | What the rider sees | Actions available | Deliberately absent |
|---|---|---|---|
| `ride_review` | Headline "Your PEDAL"; supporting "Pickup in 4 min · Estimated fare $18"; pickup "Current location"; selected destination (canonical "Ferry Building"); one "PEDAL" ride card; "4 min"; "Estimated fare $18" | Primary "Request PEDAL"; secondary "Change destination" | Payment method, promo code, surge, scheduling, ride types, confirmation modal, cancellation |
| `matching` | "Finding a nearby pedicab"; "This usually takes less than a minute"; compact trip summary with pickup, destination, "4 min", "$18"; restrained, non-geographic search treatment on the static map | None | Cancel, retry, driver count, live radius, moving vehicle |
| `driver_assigned` | Status label "Driver assigned"; headline "Maya is on the way"; supporting "PEDAL 14 · 3 min away"; driver card "Maya Chen", "PEDAL 14", "3 min away"; trip "Current location" → selected destination; static route treatment | None in the default view | Call, message/chat, cancel, payment, rating, photo, license, live location, moving driver |

## Transitions the rider feels

- **Review → destination.** "Change destination" returns to destination entry with destination and estimate cleared.
- **Review → matching.** One tap on "Request PEDAL". The action is unavailable after the first valid submission; no double request.
- **Matching → assigned.** Automatic after a fixed 1,200ms. The rider does nothing. Matching must always render as its own screen, even under reduced motion.
- **Refresh.** Matching restores and reschedules assignment; assigned restores intact.
- **Demo mode (`?demo=1`).** A separate "Demo Controls" / "Teaching only" panel outside the rider frame offers no lifecycle action yet ("Lifecycle controls arrive in Booking S3" or equivalent).

## Visual and tone constraints

- **Palette.** Warm off-white canvas `#FFF8EC`, white cards, navy type `#10233F`, coral primary `#F24E3D`, golden status accent `#F5B642` (never color alone), sky blue `#4DA3FF` for route or location cues.
- **Geometry.** Rounded cards and controls, 16–24px radii, one strong primary action per state, no bottom tabs.
- **Tone.** Calm, direct, specific. Never claim real availability, precise arrival, or a guaranteed price.
- **Never imply.** A live map, live radius, moving vehicle, real driver, or production dispatch. No provider attribution or map controls.

## Edge behavior

- **Empty.** No review without a destination; no matching without destination and estimate.
- **Invalid or stale data.** A malformed or unknown saved ride fails closed to destination entry.
- **Small screen.** Usable at 375px, one column, no horizontal scroll. Wider screens center in a phone-like frame, not a dashboard.
- **Accessibility.** Keyboard reachable, visible focus, 44px targets, WCAG AA contrast, status changes announced as text via a live region that does not repeatedly interrupt. Reduced motion gets an immediate or minimal matching animation.

## Open questions

- Map treatment on the `ride_review` screen: Not defined in the context.
- Exact copy for the demo-mode placeholder in `driver_assigned` ("or equivalent" leaves it open).
- Exact wording of the matching live-region announcement: Not defined in the context.
- What the rider sees, if anything, when a saved ride fails closed: Not defined in the context.

<sub>Sources: docs/Vision.md (The problem; Success at the end of the Booking epic); docs/FunctionalBrief.md (Request and matching; Screen inventory; Visual language; Content and tone; Accessibility and responsive behavior); docs/Flows.md (Flow 2; Flow 3; Persistence and refresh flow; Transition guardrails); docs/BusinessRules.md (Transition rules; Business rules and invariants; Mock boundaries; Demo Controls rules); docs/Roadmap.md (Sprints — Booking); docs/specs/booking/S2-Ride-Request.md (Parts 2–4; Acceptance Criteria)</sub>
