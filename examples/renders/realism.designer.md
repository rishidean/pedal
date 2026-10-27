---
reader: designer
scope: Realism (epic)
covers: Realism epic (`DIRECTIONAL — do not build`); candidate sprints Definition, Cancellation and recovery, Live location and matching, Driver and operations surfaces, Accounts and in-app payment (none ready, no specs); Booking states it would touch: `destination_entry`, `ride_review`, `matching`, `driver_assigned`, `driver_arrived`, `ride_in_progress`, `ride_completed`
stage: Exploring
rendered_from: 80d4afb
rendered_on: 2026-10-26
---

# Realism (epic), for designer

> **Problem.** Hailing a pedicab is informal and uncertain. A rider may not know whether a driver is available, what the ride might cost, or whether someone is actually coming. The first PEDAL experience makes that basic journey legible without pretending the teaching app runs a real marketplace.
>
> **Success.** Not yet defined. The epic is directional.
>
> **Stage.** Exploring, per docs/Roadmap.md.

Directional goal: "replace selected teaching mocks with defined exception handling and real product capabilities without weakening the Booking contract." No requirements exist yet.

## 1. The rider moments in question

| Screen | Booking deliberately omits | Candidate sprint |
|---|---|---|
| Destination entry | Account avatar, live pin | Live location; Accounts |
| Ride review | Payment method, promo code, surge, scheduling | Accounts and in-app payment |
| Matching | Cancel, retry, driver count, live radius | Cancellation and recovery; Live location |
| Driver assigned | Call, message, cancel, live vehicle | Cancellation; Driver surfaces |
| Driver arrived | PIN, contact, wait fees | Driver and operations surfaces |
| Ride in progress | Route editing, live progress, safety tools | Live location and matching |
| Ride complete | Card charge, tip, receipt, rating | Accounts and in-app payment |

Post-assignment events advance today only via `Demo Controls` ("Teaching only").

## 2. Design decisions waiting on product decisions

| Deferred decision (BusinessRules) | Cannot draw until decided |
|---|---|
| Cancellation eligibility, timing, fees, responsibility | Cancel control, confirmation, fee disclosure |
| No-driver, timeout, retry, alternate path | Matching failure or timeout state |
| Live location, route quality, location failure | Live pin, moving vehicle, permission and failure screens |
| Driver acceptance, dispatch, fairness | Anything between request and assignment beyond "Finding a nearby pedicab" |
| Identity, account recovery, privacy | Sign-in, account entry, profile |
| Pricing, payment, tips, receipts, refunds, disputes | Payment on review; charge, tip, receipt on completion |
| Scheduled rides, reservation changes | Scheduling entry or reservation screens |
| Safety, support, operations | In-ride safety tools, support entry |

Copy and visuals for all of these: Not defined in the context.

## 3. What stays fixed

- One linear journey, no bottom tabs, one strong primary action per state.
- Matching and assignment stay distinct rider-visible states.
- Canonical copy, "Where are you headed?" through "Pay the driver directly".
- Never claim "real availability, precise arrival, or a guaranteed price"; never imply a static map is live or a fixture is a real driver.
- "More Modern & Minimal Hot Wheel City" visual language; status never color alone.
- 375px mobile-first, 44px tap targets, WCAG AA, reduced motion respected.

## Open questions

- All eight deferred product decisions above; Realism's candidate Definition sprint is where they would be decided.
- Success definition for Realism: not defined in the context.
- Which teaching mocks Realism replaces first ("selected teaching mocks"): not defined in the context.
- Rider-facing copy, states, and visual treatment for any Realism capability: not defined in the context.

<sub>Sources: docs/Vision.md (The problem; Product principles; Product boundary); docs/FunctionalBrief.md (Screen inventory; Visual language; Content and tone; Accessibility and responsive behavior; Explicit non-goals); docs/Flows.md (State flow; Flow 4; Future flows); docs/BusinessRules.md (Mock boundaries; Demo Controls rules; Deferred product decisions); docs/Roadmap.md (Catalog: Realism; Schedule). README.md read for precedence.</sub>
