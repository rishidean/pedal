# Sprint 1: App Setup and Shell

## Goal

Create the complete local foundation for PEDAL: a Vite React application in TypeScript strict mode, Tailwind visual system, mobile rider frame, static city map, deterministic fixtures, typed state machine, versioned localStorage adapter, query-gated Demo Controls foundation, and repeatable verification commands.

This sprint creates the mechanics every later screen must use; it does not implement the ride-request or ride-lifecycle UI.

**Demo-Ready Outcome:** `npm run dev` opens a responsive PEDAL shell at `destination_entry`, the visual language and static map are visible, all canonical fixtures and state transitions exist as typed and tested foundations, local state can save and restore safely, `?demo=1` reveals a teaching panel, and type, build, unit, and smoke E2E checks pass without external application requests.

## Progress Summary

| Part | Description | Status |
|---|---|---|
| **1** | Scaffold the React and TypeScript project, dependencies, scripts, and test configuration | 🔲 Not started |
| **2** | Implement the visual tokens, responsive rider frame, brand header, and static city map | 🔲 Not started |
| **3** | Implement canonical domain types, deterministic fixtures, initial state, events, and reducer | 🔲 Not started |
| **4** | Implement versioned localStorage load, validation, persistence, and reset behavior | 🔲 Not started |
| **5** | Implement the app provider and query-gated Demo Controls foundation | 🔲 Not started |
| **6** | Add unit, component, accessibility, network-boundary, and smoke E2E verification | 🔲 Not started |

## Prerequisites

- Start from a clean checkout of the `defined` tag.
- Read `README.md`, `docs/Vision.md`, `docs/FunctionalBrief.md`, `docs/Flows.md`, `docs/BusinessRules.md`, and `docs/Roadmap.md`.
- Confirm that no `package.json`, `src/`, application code, or test implementation exists.
- Stop and report a material conflict if the artifacts disagree. Do not repair product intent in code.

## What’s Already Working

Only the product and work contracts exist.

| Artifact | What it supplies |
|---|---|
| `docs/FunctionalBrief.md` | Visual language, screen inventory, accessibility, and technical boundary |
| `docs/Flows.md` | Canonical rider sequence and transition guardrails |
| `docs/BusinessRules.md` | Normative state shape, events, fixtures, invariants, persistence, and mock rules |
| `docs/Roadmap.md` | Sprint order and EPIC outcome |

## Scope

### Included

This sprint creates the application scaffold, all verification tooling, visual shell, static map, exact domain and fixture contracts, complete pure reducer, persistence adapter, state provider, and an honest demo-mode container. It may render the destination-entry heading and fixture names as static shell content, but it does not make destinations selectable or implement the ride-review, matching, driver, lifecycle, or completion screens.

### Excluded

Do not implement ride requests, matching timers, driver cards, lifecycle transitions in the UI, free-form destination search, external data, a router, backend, authentication, live maps, analytics, payment, cancellation, or the Realism epic behavior.

## Target file structure

```text
package.json
package-lock.json
index.html
vite.config.ts
tsconfig.json
tsconfig.app.json
tsconfig.node.json
playwright.config.ts
src/
├── main.tsx
├── index.css
├── app/
│   ├── App.tsx
│   ├── PedalProvider.tsx
│   └── usePedal.ts
├── components/
│   ├── BrandHeader.tsx
│   ├── DemoControls.tsx
│   ├── RiderFrame.tsx
│   └── StaticCityMap.tsx
├── data/
│   └── pedalFixtures.ts
├── state/
│   ├── pedalInitialState.ts
│   ├── pedalReducer.ts
│   ├── pedalStorage.ts
│   └── pedalTypes.ts
├── test/
│   └── setup.ts
└── __tests__/
    ├── AppShell.test.tsx
    ├── pedalReducer.test.ts
    └── pedalStorage.test.ts
e2e/
└── app-shell.spec.ts
```

Equivalent small file splits are acceptable only when they preserve these responsibilities and explicit import boundaries. Do not introduce a general framework, service layer, or component library.

## What Needs Implementation

### Part 1: Scaffold and verification commands

**Objective:** Create a reproducible local React and TypeScript project without disturbing the existing `docs/` artifacts.

Use the current compatible releases of Vite, React, TypeScript, Tailwind CSS, Vitest, React Testing Library, and Playwright. Commit the generated lockfile so the canonical sprint result is reproducible.

The package scripts must expose these stable commands:

| Script | Required behavior |
|---|---|
| `npm run dev` | Start Vite for local development |
| `npm run build` | Run the production build |
| `npm run typecheck` | Run TypeScript in no-emit mode and fail on any error |
| `npm run test` | Run Vitest in watch mode for local use |
| `npm run test:run` | Run the full Vitest suite once |
| `npm run test:e2e` | Run Playwright |
| `npm run check` | Run typecheck, unit/component tests, and production build in sequence |

Configure `jsdom` for component tests and load `@testing-library/jest-dom` from `src/test/setup.ts`. Configure one Chromium Playwright project and a Vite web server. Do not add CI, Docker, environment variables, or deployment configuration in this sprint.

**Expected behavior:** A clean install followed by `npm run check` succeeds before feature UI is added.

### Part 2: Visual shell and static map

**Objective:** Make the visual agreement inspectable without implementing the rider flow.

Implement the **More Modern & Minimal Hot Wheel City** direction from `FunctionalBrief.md` using Tailwind and CSS variables or theme tokens. Use the canonical colors, rounded geometry, mobile-first spacing, visible focus states, and reduced-motion handling.

`RiderFrame.tsx` must:

- use one centered column that is fully usable at 375px;
- have a reasonable maximum width on larger screens;
- contain the rider surface independently from Demo Controls;
- avoid bottom tabs, sidebars, and desktop-dashboard patterns; and
- expose a semantic `<main>` region.

`BrandHeader.tsx` must render the PEDAL wordmark and a local pedicab mark defined as a component or explicit icon variable. Do not fetch a logo.

`StaticCityMap.tsx` must render a decorative local street treatment from HTML, CSS, or inline local SVG. It may show stylized blocks, a route line, and landmark dots. It must have no pan, zoom, geolocation, tile attribution, remote image, iframe, or network dependency. Mark decorative geometry appropriately for assistive technology.

At this sprint’s demo state, the shell shows:

- the PEDAL header;
- `Where are you headed?`;
- `Pickup: Current location`;
- the three landmark names as non-interactive preview cards or labels; and
- the static city map.

Selection behavior belongs to Booking S2.

### Part 3: Domain types, fixtures, and reducer

**Objective:** Encode the complete state and event contract before feature components depend on it.

Create `pedalTypes.ts` from the normative shapes in `BusinessRules.md`. Do not weaken literal fixture types into unbounded strings where a known union is available.

Create `pedalFixtures.ts` with exactly these canonical records:

| Record | Required values |
|---|---|
| Pickup | `current-location`, `Current location` |
| Destinations | `union-square`, `ferry-building`, `oracle-park` and their display labels |
| Estimate | 4 minutes, 1800 cents, USD |
| Driver | `maya-chen`, `Maya Chen` |
| Pedicab | `pedal-14`, `PEDAL 14` |
| Assigned ETA | 3 minutes |
| Matching delay | 1200 milliseconds |

Create `pedalInitialState.ts` with `version: 1`, `stage: 'destination_entry'`, canonical pickup, null destination, null estimate, null driver, null pedicab, null assigned ETA, and null request timestamp.

Implement the pure reducer with TR-001 through TR-008 from `BusinessRules.md`. The reducer must:

- enforce valid state order;
- ignore unknown or invalid events without mutation;
- never create random fixture values;
- preserve request context through the ride;
- clear active ride data on reset; and
- avoid reading the URL, timers, storage, or browser APIs.

The complete pure reducer is foundational work even though Booking S2 and Booking S3 do not expose every event in the UI yet.

### Part 4: Versioned localStorage adapter

**Objective:** Persist and restore a valid PEDAL state without allowing malformed browser data to break the app.

`pedalStorage.ts` must export small functions with these responsibilities:

| Function responsibility | Contract |
|---|---|
| Load | Parse `pedal.ride.v1`, validate version, stage, destination, and fixture references, then return valid state or the initial state |
| Save | Serialize the current valid state after a reducer transition |
| Clear | Remove the PEDAL key during reset or persist a fresh initial state; choose one behavior and test it consistently |
| Validate | Reject malformed JSON, unknown versions, unknown stages, and invalid fixture IDs |

Do not add a schema-validation dependency solely for this small record unless it materially reduces code and remains local. A narrow handwritten type guard is acceptable.

The storage adapter may access `window.localStorage`; the reducer may not. Tests must isolate and clear storage between cases.

### Part 5: Provider and Demo Controls foundation

**Objective:** Give later sprints one application-state interface and make teaching controls honest.

`PedalProvider.tsx` must:

- initialize from the storage adapter once;
- expose current state and a typed dispatch function;
- persist after valid state changes;
- cancel or avoid duplicate side effects during React Strict Mode; and
- contain no matching timer in this sprint.

`usePedal.ts` must throw a clear development error when used outside the provider.

`DemoControls.tsx` must appear only when the URL query contains `demo=1`. In Booking S1 it displays:

- `Demo Controls`;
- `Teaching only`;
- the current state label; and
- `No demo action available` at `destination_entry`.

Do not expose lifecycle buttons until the corresponding UI is implemented in Booking S3. Keep the panel outside `RiderFrame` so screenshots and tests can distinguish teaching infrastructure from product UI.

### Part 6: Baseline verification

**Objective:** Prove the foundation before feature work begins.

#### Unit tests

| Test file | Required assertions |
|---|---|
| `src/__tests__/pedalReducer.test.ts` | Every TR-001 through TR-008 transition; invalid event for state leaves state unchanged; reset clears active ride; fixture values remain deterministic; input state is not mutated |
| `src/__tests__/pedalStorage.test.ts` | Missing record, valid restore, malformed JSON, unknown version, invalid stage, invalid destination, save, and clear/reset behavior |
| `src/__tests__/AppShell.test.tsx` | Brand, heading, pickup, destination fixture labels, and static map render; Demo Controls absent by default and present under `?demo=1`; semantic main exists |

#### E2E smoke test

`e2e/app-shell.spec.ts` must:

1. open the default app and assert the PEDAL shell, heading, pickup, fixture labels, and static map;
2. assert Demo Controls are absent;
3. open `/?demo=1` and assert the panel, teaching label, and `destination_entry` state;
4. verify the page has no horizontal overflow at 375px;
5. record application network requests and fail if any request leaves the local Vite origin; and
6. run an automated accessibility scan if the chosen testing dependency is added, or perform the explicit semantic/focus assertions defined below.

Do not add an accessibility package merely for a badge. At minimum, assert landmark structure, heading order, button/interactive role semantics, and visible keyboard focus on any focusable shell element.

## Files to Create or Modify

| File or group | Type | Purpose |
|---|---|---|
| Package and TypeScript configuration | New | Reproducible application and command contract |
| Vite, Tailwind, Vitest, Playwright configuration | New | Local build and verification |
| `src/app/*` | New | Application shell and state provider |
| `src/components/*` | New | Rider frame, brand, map, and demo panel |
| `src/data/pedalFixtures.ts` | New | Canonical deterministic fixtures |
| `src/state/*` | New | Types, initial state, reducer, and storage |
| Unit/component tests | New | Foundation behavior evidence |
| `e2e/app-shell.spec.ts` | New | Shell, demo boundary, responsive, and network evidence |
| `docs/results/booking-s1.md` | New at completion | Sprint result, evidence, files changed, and unresolved issues |
| `docs/Roadmap.md` | Update at acceptance | Mark Booking S1 done and Booking S2 next |

## Acceptance Criteria

### Scaffold and commands

- [ ] `npm install` succeeds from a clean checkout with the committed lockfile.
- [ ] All required package scripts exist and return the specified behavior.
- [ ] TypeScript strict mode is enabled; no `any` is introduced in PEDAL state or fixtures.
- [ ] No environment file, backend client, API client, router, or external service is added.

### Visual shell

- [ ] The default app shows PEDAL, `Where are you headed?`, `Pickup: Current location`, all three landmark labels, and the static map.
- [ ] The shell is usable at 375px with no horizontal overflow.
- [ ] The visual tokens match `FunctionalBrief.md` and one strong primary hierarchy is apparent.
- [ ] The static map uses local assets only and has no live-map controls or remote requests.
- [ ] Status and interaction affordances do not rely on color alone.

### State and fixtures

- [ ] Types, initial state, events, fixtures, and reducer agree with `BusinessRules.md`.
- [ ] All eight valid transitions are covered by unit tests.
- [ ] Representative invalid transitions leave state unchanged.
- [ ] Fixture values are exact and deterministic.
- [ ] The reducer has no browser, timer, URL, storage, or network side effect.

### Persistence and demo boundary

- [ ] Valid state saves to and restores from `pedal.ride.v1`.
- [ ] Malformed, unknown-version, or invalid-fixture records fall back to initial state without crashing.
- [ ] Demo Controls are absent by default and appear only with `?demo=1`.
- [ ] The Booking S1 Demo Controls expose no lifecycle actions.

### Verification

- [ ] `npm run typecheck` passes.
- [ ] `npm run test:run` passes.
- [ ] `npm run build` passes.
- [ ] `npm run test:e2e` passes.
- [ ] E2E evidence confirms no external application request.

## Verification & Testing

### Required commands

```bash
npm install
npm run typecheck
npm run test:run
npm run build
npm run test:e2e
```

### Test Results Log

Populate this table during execution.

| Category | Command or check | Result | Evidence or notes |
|---|---|---|---|
| Install | `npm install` | 🔲 | |
| Type safety | `npm run typecheck` | 🔲 | |
| Unit/component | `npm run test:run` | 🔲 | |
| Build | `npm run build` | 🔲 | |
| E2E | `npm run test:e2e` | 🔲 | |
| Network boundary | Local-origin request assertion | 🔲 | |
| Acceptance | Criteria above | 🔲 | |

Use `✅ Pass`, `❌ Fail`, or `⏭️ N/A` when the sprint runs.

## Result Record

At acceptance, create `docs/results/booking-s1.md` containing:

| Field | Required record |
|---|---|
| Outcome | What can be demonstrated |
| Parts completed | Final status for Parts 1–6 |
| Files changed | Created and modified paths |
| Verification | Commands, pass/fail result, and concise evidence |
| Deviations | Any implementation choice that differs from the spec and why it preserves the contract |
| Unresolved issues | `None` or a named blocker; no hidden TODOs |
| Recovery | Accepted commit hash and how to return to it |

After the record is complete, mark Booking S1 `✅ Done` in `docs/Roadmap.md` and Booking S2 as next. Commit using:

```text
feat(booking-s1): app setup and shell
```

## Known Limitations and Future Work

The shell is intentionally non-functional beyond foundational state and persistence. Destination selection and the ride-request UI arrive in Booking S2. Ride-lifecycle UI and demo actions arrive in Booking S3. Real maps, services, exceptions, accounts, and payments remain outside the Booking epic.

## Definition of Done

- [ ] All acceptance criteria are met.
- [ ] Every applicable Test Results Log row is populated and passing.
- [ ] `docs/results/booking-s1.md` exists and contains no unrecorded deviation.
- [ ] `docs/Roadmap.md` identifies Booking S2 as next.
- [ ] No material product or architecture decision was invented during implementation.
- [ ] The accepted recovery commit exists with the required message.

## Next Step

Proceed to [`S2-Ride-Request.md`](./S2-Ride-Request.md) only after this sprint passes its Definition of Done.

## References

- [`Functional Brief`](../../FunctionalBrief.md)
- [`Flows`](../../Flows.md)
- [`Business Rules`](../../BusinessRules.md)
- [`Roadmap`](../../Roadmap.md)
