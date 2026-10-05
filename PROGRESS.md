# PROGRESS

Session handoffs, newest last. Each fresh session reads this before touching anything; each finished sprint appends here. This file is how memory survives amnesia.

Handoff format:

```
## Booking S<N> — <date>
**Built:** what now works, in one or two sentences.
**Decisions:** implementation choices the spec left open, and why.
**Gotchas:** anything that cost time and will cost the next session time too.
**Next:** what the next session should know before it starts.
```

---

## Booking S1 — 2026-10-04
**Built:** Vite, React, and strict TypeScript shell with Tailwind, a mobile-first destination-entry screen, a fully local inline-SVG city treatment, three non-interactive fixture preview cards, the typed domain model, a pure reducer covering TR-001 through TR-008, and a fail-closed `pedal.ride.v1` adapter.
**Decisions:** Reset and return-to-entry remove the active storage key rather than persisting a fresh record, which the Business Rules permit. Fixture names render as static preview cards; selection, review, matching, and assignment UI are reserved for S2.
**Gotchas:** Vitest must discover only `src/**/*.test.ts?(x)`, or it tries to run the Playwright specs in `e2e/`. The wordmark and the rider `main` both contain the word PEDAL, so Playwright locators must match the wordmark exactly.
**Next:** Execute Booking S2 only. Add destination selection, ride review, the local request timestamp, explicit matching, and deterministic assignment, preserving the reducer, fixtures, storage key, static-map boundary, and the no-external-request E2E assertion. No lifecycle controls; those are S3.

---

## Booking S2 — 2026-10-04
**Built:** Fixture-backed landmark buttons now lead through ride review, a local timestamped request, an explicit `matching` screen, and a deterministic 1,200ms assignment to Maya Chen in PEDAL 14. Valid matching and assigned rides persist and restore; the canonical Playwright path captures review, matching, and assignment evidence.
**Decisions:** The matching timer remains an application-layer hook; it is scheduled only in `matching`, cleaned up on stage exit or unmount, and the reducer remains the final transition guard. The rider surface remains static and local-only; S2 deliberately adds no lifecycle action, live location, contact, payment, or recovery capability.
**Gotchas:** The persisted-matching test must exercise React Strict Mode and advance fake timers to prove one assignment only. Playwright screenshot artifacts are gitignored below `test-results/`; retain their paths in the result record rather than committing them.
**Next:** Execute Booking S3 only. Add the query-gated lifecycle transitions and their screens without changing the completed S2 request, matching, assignment, fixture, persistence, static-map, or no-external-request contracts.

---

## Booking S3 — 2026-10-04
**Built:** The local, rider-only journey now renders driver arrival, static-route ride progress, and completion with the `$18` direct-payment instruction; exact-query Demo Controls simulate only the valid driver-side events; each active lifecycle state restores; reset clears the active record; and the full Ferry Building path is proven in Playwright.
**Decisions:** S3 reuses the existing pure TR-005 through TR-008 reducer transitions, `pedal.ride.v1` validation, remove-key reset policy, canonical fixtures, and static local map. The only recovery was test-only: three journey locators use `{ exact: true }` because the intentionally duplicated SR-only live announcements otherwise create Playwright strict-locator collisions; no application behavior changed.
**Gotchas:** Visible lifecycle copy is intentionally repeated in semantic live regions. Scope exact Playwright text locators (or use `{ exact: true }` for the complete visible string) rather than weakening assertions or removing announcements. Screenshot artifacts remain gitignored beneath `test-results/` and are recorded in `docs/results/booking-s3.md`.
**Next:** Booking is complete. Do not execute Realism until fresh Discovery and Definition resolve its product decisions and produce ready sprint specifications.
