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
