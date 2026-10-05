# PEDAL — Broad Context

PEDAL is a deliberately basic, rider-only pedicab hailing app used to teach agentic product development. A rider selects a destination, reviews a mocked 4-minute pickup and $18 fare, requests a pedicab, watches matching resolve to a deterministic driver assignment, progresses through a simulated ride, and is told to pay the driver directly. Everything runs locally on deterministic fixtures.

## Read order

Before implementing anything, read in this order: `README.md`, `docs/Vision.md`, `docs/FunctionalBrief.md`, `docs/Flows.md`, `docs/BusinessRules.md`, `docs/Roadmap.md`, then the active sprint's specification in `docs/specs/booking/`.

Precedence: `BusinessRules.md` governs domain behavior, `Flows.md` governs the rider sequence, and a sprint spec may narrow scope but may not contradict either. If two artifacts appear to conflict, stop and mark the sprint ⛔; that is a definition problem, not an implementation choice.

## Technical boundary

Vite + React + TypeScript strict. Tailwind for styling. A typed reducer (or equivalent explicit state machine). Deterministic local fixtures only. Persistence in `localStorage` under `pedal.ride.v1`. Static local map treatment. Demo controls only under `?demo=1`. No backend, no auth, no external APIs, no payment processing.

## Operating rules

- Do not introduce a backend, database, API call, map provider, location permission, auth package, payment package, or driver application.
- Do not add cancellation, recovery flows, contact controls, scheduled rides, ratings, tips, receipts, or route editing to the Booking epic.
- Do not infer behavior from the product category. Implement only the states and transitions the artifacts define.
- Do not replace deterministic fixtures with random values, and do not hide mock behavior.
- Never widen scope beyond the active sprint's specification.

## Definition of done

A sprint is not done until `run-qa` returns GREEN. GREEN means: typecheck, unit/component tests, production build, and Playwright all pass, and the code review reports no CRITICAL finding. Then and only then: populate the spec's Test Results Log, write `docs/results/booking-sN.md`, tick the sprint in `docs/Roadmap.md`, append a handoff to `PROGRESS.md`, and create the recovery commit with the spec's exact message.

If you learn something durable — a convention, a gotcha, a rule every future sprint should inherit — add it below this line.

## Learned conventions
- **The Roadmap status vocabulary is fixed.** A sprint row carries exactly one marker: `🔲 Not started`, `▶ Next`, `✅ Done`, or `⛔ blocked`. `run.sh` counts both 🔲 and ▶ as remaining, and `prompt.md` selects the first row that is neither ✅ nor ⛔. Never invent a fifth marker.
- **Preserve the S1 scope boundary.** The destination-entry shell exposes only static fixture previews. Destination controls, ride review, matching, and assignment UI begin in Booking S2; lifecycle buttons begin in Booking S3.
- **Use the exact fixture and storage contracts.** State stays local, deterministic, and versioned under `pedal.ride.v1`. Returning to `destination_entry` clears that active key; malformed or invalid records fail closed to a fresh initial state.
- **Keep state mechanics pure.** `pedalReducer` has no URL, timer, storage, browser, or network side effect. The provider owns persistence; matching scheduling belongs to the application layer, not the reducer.
- **Keep demo infrastructure isolated.** The exact query gate is `new URLSearchParams(window.location.search).get('demo') === '1'`. Render Demo Controls outside `RiderFrame`; no lifecycle controls before S3.
- **Keep verification runners separate.** Vitest includes `src/**/*.test.ts` and `src/**/*.test.tsx`; Playwright owns `e2e/`. Otherwise Vitest tries to execute Playwright's `test()` API and fails.
- **Match accessible labels exactly.** The rider frame is named `PEDAL rider experience` and the wordmark is exactly `PEDAL`; use exact matching for the wordmark to avoid a strict-locator collision.
- **Preserve the restored-matching timer contract.** `useMatchingAssignment` schedules only while the rendered stage is `matching`; cleanup must cancel its timer so React Strict Mode, stage exit, reset, and unmount cannot leave a second assignment pending. Test restored matching with fake timers in Strict Mode.
- **Disambiguate repeated lifecycle copy in Playwright.** Lifecycle screens intentionally repeat visible copy in an SR-only `role="status"` live region. For a locator that targets the complete visible string (for example `Estimated fare $18`, a destination, or `$18`), use `{ exact: true }` or scope it to the visible container; never weaken the assertion or remove the semantic announcement to bypass strict mode.
