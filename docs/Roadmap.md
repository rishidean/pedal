# PEDAL Roadmap

## Structure

- **Epic**: a named body of durable intent. Names are real words, permanent, never numbered — commits, branches, and specs point at them, and priority lives in the schedule, never in the identifier.
- **Sprint**: a focused, standalone, testable increment within an epic. Sprints carry ordinals within their epic (`S1`, `S2`, …) because they execute in order and are consumed, never reordered.
- **Specification**: the executable contract for a ready sprint, stored under `docs/specs/<epic-name>/`.

Three sections at three speeds: the catalog changes slowly, the schedule as often as reality does, the sprints every cycle.

---

## Artifacts: Definition complete

| Type | Artifact | Status |
|---|---|---|
| VISION | [`./Vision.md`](./Vision.md) | ✅ Done |
| FUNCTIONAL BRIEF | [`./FunctionalBrief.md`](./FunctionalBrief.md) | ✅ Done |
| FLOW SPEC | [`./Flows.md`](./Flows.md) | ✅ Done |
| BUSINESS RULES | [`./BusinessRules.md`](./BusinessRules.md) | ✅ Done |
| ROADMAP | [`./Roadmap.md`](./Roadmap.md) | ✅ Done |
| SPRINT SPEC | [`./specs/booking/S1-App-Setup-and-Shell.md`](./specs/booking/S1-App-Setup-and-Shell.md) | ✅ Done |
| SPRINT SPEC | [`./specs/booking/S2-Ride-Request.md`](./specs/booking/S2-Ride-Request.md) | ✅ Done |
| SPRINT SPEC | [`./specs/booking/S3-Ride-Lifecycle.md`](./specs/booking/S3-Ride-Lifecycle.md) | ✅ Done |

The working Discovery map and Figma Make prototype remain outside the canonical repository. Their resolved decisions are synthesized into the artifacts above.

---

## Catalog

Every epic that exists. No order implied here; the schedule carries order.

### Groundwork ✅
- **Goal:** an artifacts-only product agreement and work contracts that DEVELOPMENT can consume without application code or material product guesses.
- **Outcome:** a clean `defined` checkout containing only the durable Markdown artifacts required to execute the Booking epic. No package manifest, source directory, scaffold, test code, generated prototype code, or application implementation exists.
- **Status:** done. The readiness gate was applied and the clean repository state is tagged `defined`.

### Booking
- **Goal:** one complete, local, rider-only PEDAL journey from destination selection through ride completion and direct payment to the driver.
- **Scope:** app shell and visual system, typed state and fixtures, persistence, ride request through deterministic driver assignment, the simulated ride lifecycle, and the full verification path (type, build, unit/component, accessibility, end-to-end).
- **Cut list:** no backend, accounts, or authentication; no live map, location permissions, real matching, or driver system; no in-app payment, tips, receipts, or ratings; no cancellation, no-driver recovery, scheduled rides, or route editing. These are decisions, not gaps — the deferred ones live in Realism.

### Realism `DIRECTIONAL — do not build`
- **Goal (directional):** replace selected teaching mocks with defined exception handling and real product capabilities without weakening the Booking contract.
- **Fence:** every Realism question requires fresh Discovery and Definition before any sprint moves to ready. Candidate decomposition, preserved for that future definition pass — none of it is executable:

| Candidate sprint | Focus |
|---|---|
| Definition | Decide cancellation policy, no-driver timeout and recovery, location provider, matching ownership, driver surface, account boundary, payment boundary, safety requirements, and the evidence needed before integrations begin. |
| Cancellation and recovery | Rider-visible cancellation, timeout, retry, alternate-path, and policy behavior — after the relevant decisions are resolved. |
| Live location and matching | Real pickup/destination data, map behavior, route estimates, and a defined matching service with explicit failure modes. |
| Driver and operations surfaces | The minimum driver acceptance and operational workflow required to make lifecycle events real. |
| Accounts and in-app payment | Identity, payment authorization, final fare, tips, receipts, refunds, and data controls — after policy and compliance definition. |

## Graveyard

*(empty — dead epics land here dated, with the reason. Tombstone, never delete: an agent can't tell a gap from a decision.)*

---

## Schedule

The only place priority lives.

1. **NOW:** Booking
2. — *directional fence* — Realism (requires Discovery + Definition before anything below it is ready)

Groundwork is complete and stays in the catalog as the record of how `defined` came to be.

---

## Sprints — Booking

| Sprint | Focus | Status |
|---|---|---|
| **S1 — App Setup and Shell** | Create the Vite React and TypeScript application, Tailwind visual system, mobile rider frame, static city map, typed state and reducer foundation, deterministic fixture catalog, `localStorage` adapter, query-gated Demo Controls foundation, and verification commands. The app starts at destination entry and contains no ride-request implementation beyond the shell contract. → [`spec`](./specs/booking/S1-App-Setup-and-Shell.md) | ✅ Done |
| **S2 — Ride Request** | Implement landmark destination selection, ride review, canonical 4-minute and `$18` estimate, request creation, explicit matching state, deterministic 1,200ms assignment, and Maya Chen/PEDAL 14 driver card with 3-minute ETA. Add state, component, persistence, accessibility, and Playwright evidence through `driver_assigned`. → [`spec`](./specs/booking/S2-Ride-Request.md) | ✅ Done |
| **S3 — Ride Lifecycle** | Implement demo-mode transitions through driver arrived, ride in progress, and ride complete; show the `$18` fare and `Pay the driver directly`; restore each state after refresh; reset to a fresh ride; and complete the full end-to-end verification path. → [`spec`](./specs/booking/S3-Ride-Lifecycle.md) | ▶ Next |

**Dependencies:** S2 starts only after S1 passes. S3 starts only after S2 passes. A failed sprint remains active; the harness may not skip ahead.

**Outcome:** a user can run PEDAL locally, complete the canonical Ferry Building journey, refresh without losing active state, use honest Demo Controls to simulate driver events, reset after completion, and pass type, build, unit/component, accessibility, and end-to-end checks without any external application service.

---

## Current Status

**Active:** no implementation sprint is in progress. Booking S2 is accepted with its local recovery commit; the repository now supports fixture-backed destination selection, ride review, explicit matching, and deterministic driver assignment through `driver_assigned`.

**Next:** Booking S3 (Ride Lifecycle).

## Readiness rule

A sprint is ready only when its specification defines the demonstrable outcome, scope and exclusions, rider-visible behavior, business rules, dependencies, technical constraints, acceptance criteria, verification evidence, and result record. If an agent would need to choose a material product behavior or widen the architecture, the sprint returns to DEFINITION.

## References

- [`Vision`](./Vision.md)
- [`Functional Brief`](./FunctionalBrief.md)
- [`Flows`](./Flows.md)
- [`Business Rules`](./BusinessRules.md)
