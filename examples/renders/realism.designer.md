---
reader: designer
scope: Realism
purpose: contract
covers: Realism epic (`DIRECTIONAL — do not build`); five candidate sprints (Definition, Cancellation and recovery, Live location and matching, Driver and operations surfaces, Accounts and in-app payment); no ready sprints, no specs
stage: Exploring
rendered_from: 6508905
rendered_on: 2026-11-22
---

# Realism, for designer

> **Problem.** Hailing a pedicab is informal and uncertain. A rider may not know whether a driver is available, what the ride might cost, or whether someone is actually coming. The first PEDAL experience makes that basic journey legible without pretending the teaching app runs a real marketplace.
>
> **Success.** Not yet defined. The epic is directional.
>
> **Stage.** Exploring, per docs/Roadmap.md.

## The bet

"Replace selected teaching mocks with defined exception handling and real product capabilities without weakening the Booking contract." Nothing here is drawable yet: "every Realism question requires fresh Discovery and Definition before any sprint moves to ready."

## 1. The rider moments in question

| Moment | What Booking shows today | What Realism would change (candidate, not executable) |
|---|---|---|
| Destination entry and ride review | Read-only `Current location`, three landmarks, static map, fixed `4 min` and `$18` | "Real pickup/destination data, map behavior, route estimates" |
| Matching | `Finding a nearby pedicab`; rider actions: none; a 1,200ms mock always assigns a driver | "Rider-visible cancellation, timeout, retry, alternate-path, and policy behavior"; "a defined matching service with explicit failure modes" |
| Assigned, arrived, in progress | Fixture driver `Maya Chen`, `PEDAL 14`; static route, no moving driver; later states advanced by Demo Controls | "The minimum driver acceptance and operational workflow required to make lifecycle events real" |
| Ride complete | `$18` and `Pay the driver directly`; no payment state | "Identity, payment authorization, final fare, tips, receipts, refunds, and data controls" |

## 2. Design decisions waiting on product decisions

| Undecided (BusinessRules, "Deferred product decisions") | What the designer cannot draw until it is decided |
|---|---|
| "cancellation eligibility, timing, fees, and responsibility" | Whether any screen carries a cancel action, on which states, and what it says about cost |
| "no-driver, timeout, retry, and alternate-path behavior" | Any matching outcome other than assignment; how long matching may run; what the rider is offered next |
| "live location, route quality, and location failure" | Pickup that is not a fixed label, a map that is not a static illustration, permission and failure states |
| "driver acceptance, dispatch, and marketplace fairness" | What the rider sees between request and a real driver accepting; any driver surface |
| "identity, account recovery, and privacy" | Sign-in, account, and data-control screens; where they sit in a journey that today has one route and no account |
| "pricing, payment, tips, receipts, refunds, and disputes" | The fare display once it is not a fixed `$18`; any payment, tip, or receipt screen after `You’ve arrived` |
| "scheduled rides and reservation changes" | Any entry point other than an immediate request |
| "safety, support, and operations workflows" | Contact, call, or safety controls, all explicitly absent today |

## 3. What stays fixed

- The seven Booking states and their order; matching and driver assignment remain distinct rider-visible states ("Status should reduce uncertainty").
- "The mock must be honest": whatever remains simulated must not look live.
- Visual language: "More Modern & Minimal Hot Wheel City"; "one strong primary action per state".
- Tone: "calm, direct, and specific"; copy "should reduce uncertainty rather than sell the service".
- Accessibility: visible focus, WCAG AA contrast, 44px tap targets, reduced motion respected; fully usable at 375px.

## Open questions

- The Roadmap says Realism replaces "selected teaching mocks" but does not say which are selected. A designer could plan for all eight mock boundaries or only some; the resulting screen set differs.
- "Without weakening the Booking contract" does not say whether Booking's explicit absences (cancel, call, message, payment method, tip, receipt) are part of that contract. One reading keeps those screens untouched; the other adds controls to them.

<sub>Sources: docs/Vision.md (The problem; Product principles); docs/FunctionalBrief.md (Screen inventory; Visual language; Content and tone; Accessibility and responsive behavior); docs/Flows.md (Flow 3; Flow 4; Future flows); docs/BusinessRules.md (Mock boundaries; Deferred product decisions); docs/Roadmap.md (Catalog: Realism; Schedule).</sub>
