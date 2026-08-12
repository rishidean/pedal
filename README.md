# PEDAL

**Repository state:** Definition complete  
**Canonical tag:** `defined`  
**Implementation status:** No application code exists at this checkpoint

## TL;DR

PEDAL is a deliberately basic, rider-only pedicab hailing app used to teach agentic product development. This repository state contains the product agreement, build order, and three executable sprint contracts. DEVELOPMENT starts here and builds the complete first EPIC.

> **Do not recover intent from a conversation or prototype. Read the artifacts, execute one ready sprint, return evidence, and record the result.**

## Product in one paragraph

A rider selects a destination, reviews a mocked 4-minute pickup estimate and `$18` fare, requests a pedicab, sees matching and driver assignment as distinct states, progresses through a simulated ride, and receives a final instruction to pay the driver directly. Everything runs locally with deterministic fixtures. PEDAL has no backend, authentication, live map, real driver system, production matching, or in-app payment.

## Artifact map

Read these files in order before implementation:

| Order | Artifact | Governs |
|---:|---|---|
| **1** | [`docs/Vision.md`](./docs/Vision.md) | User, purpose, outcome, teaching intent, and product boundary |
| **2** | [`docs/FunctionalBrief.md`](./docs/FunctionalBrief.md) | Included capabilities, visual language, technical constraints, and non-goals |
| **3** | [`docs/Flows.md`](./docs/Flows.md) | Rider screens, actions, states, transitions, and reset behavior |
| **4** | [`docs/BusinessRules.md`](./docs/BusinessRules.md) | Domain terms, fixtures, invariants, mock boundaries, persistence, and deferred decisions |
| **5** | [`docs/Roadmap.md`](./docs/Roadmap.md) | EPIC order, sprint readiness, dependencies, outcomes, and current status |
| **6** | [`docs/specs/booking/`](./docs/specs/booking/) | The executable contracts for Booking S1, Booking S2, and Booking S3 |

If two files appear to conflict, stop. `BusinessRules.md` governs domain behavior, `Flows.md` governs the rider sequence, and the sprint specification may narrow implementation scope but may not contradict either one.

## The Booking sequence

| Sprint | Outcome | Specification |
|---|---|---|
| **Booking S1** | Locally runnable React and TypeScript shell with the visual system, typed state foundation, fixtures, persistence boundary, static map, demo-mode foundation, and verification commands | [`S1-App-Setup-and-Shell.md`](./docs/specs/booking/S1-App-Setup-and-Shell.md) |
| **Booking S2** | Destination → estimate → request → matching → mocked driver assignment and ETA | [`S2-Ride-Request.md`](./docs/specs/booking/S2-Ride-Request.md) |
| **Booking S3** | Driver arrived → ride in progress → ride complete → pay the driver directly → reset | [`S3-Ride-Lifecycle.md`](./docs/specs/booking/S3-Ride-Lifecycle.md) |

Sprints run in order. A sprint is not complete because the interface looks plausible; it is complete when its acceptance criteria pass, the required checks return evidence, and the result is recorded.

## How DEVELOPMENT begins

1. Start from a clean checkout of the `defined` tag.
2. Open Claude Code at the repository root.
3. Point the DEVELOPMENT harness at this checkout, or use the following control prompt until the harness command is installed:

```text
Read README.md, docs/Roadmap.md, docs/Flows.md, and docs/BusinessRules.md.

Find the next not-started sprint in the Booking epic and read its specification in full. Execute only that sprint. Do not widen scope, skip verification, or invent missing product behavior.

When implementation and checks are complete:
1. populate the sprint Test Results Log,
2. record the files changed and evidence returned,
3. stop if any material decision is missing,
4. and create the sprint recovery commit using the commit format in the specification.

Do not begin the next sprint until the current sprint passes its Definition of Done.
```

The production harness may automate sprint selection, execution, verification, recording, and recovery commits. It may not reinterpret the product or bypass a failed gate.

## Technical boundary

| Concern | Constraint |
|---|---|
| Application | Vite, React, and TypeScript strict mode |
| Styling | Tailwind CSS |
| State | Explicit typed reducer or equivalent local state machine |
| Data | Deterministic local fixtures |
| Persistence | `localStorage` under `pedal.ride.v1` |
| Map | Static local HTML, CSS, or SVG treatment |
| Matching | Deterministic simulation |
| Demo controls | Available only with `?demo=1` |
| Backend | None |
| Authentication | None |
| External APIs | None |
| Payment | None; rider pays driver directly |
| Verification | Type check, production build, Vitest/RTL, and Playwright |

## Agent operating rules

The implementation agent must preserve these boundaries:

- Do not introduce a backend, database, API call, map provider, location permission, authentication package, payment package, or driver application.
- Do not add cancellation, no-driver recovery, contact controls, scheduled rides, ratings, tips, receipts, or route editing to the Booking epic.
- Do not infer behavior from the product category. Implement only the states and transitions the artifacts define.
- Do not replace deterministic fixtures with random values.
- Do not hide mock behavior. Demo controls and static treatments should remain clearly bounded.
- Do not mark a sprint complete until every applicable verification step passes and the result is recorded.

## Repository contract at `defined`

This checkpoint contains Markdown specifications only. It intentionally has no package manifest, source directory, test code, generated prototype code, environment file, backend, or application scaffold. Booking S1 creates the implementation foundation.

## References

- [`Vision`](./docs/Vision.md)
- [`Functional Brief`](./docs/FunctionalBrief.md)
- [`Flows`](./docs/Flows.md)
- [`Business Rules`](./docs/BusinessRules.md)
- [`Roadmap`](./docs/Roadmap.md)
