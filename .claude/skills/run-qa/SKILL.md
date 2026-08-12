---
name: run-qa
description: The PEDAL quality gate. Runs the deterministic anchors (typecheck, unit/component tests, production build, Playwright) and the QA crew (linter, code-reviewer, playwright-tester), then returns a single GREEN or RED verdict. Invoke after implementing a sprint, before documenting or committing anything.
---

# run-qa — the gate

One call, one verdict. Anchors first, opinion second. Anchors outrank opinions.

## Sequence

1. **Preflight.** If `node_modules` is missing, run `npm install`. If the repo has no `package.json` yet, the sprint under review is Booking S1 and it has not created its foundation: return RED with that finding.
2. **Anchors (deterministic).** Run, in order, from the sprint's Verification section:
   - `npm run typecheck`
   - `npm run test:run`
   - `npm run build`
   - `npm run test:e2e`
3. **The crew.** Dispatch each agent via the Task tool and collect verdicts:
   - `linter` — well-formedness and lint; may auto-fix trivial formatting.
   - `code-reviewer` — read-only review against the invariants and boundaries; returns CRITICAL / WARN / NIT findings.
   - `playwright-tester` — confirms the E2E suite covers the active sprint's acceptance criteria, authoring missing tests before running them.

## Verdict contract

Return exactly one block, nothing after it:

```
VERDICT: GREEN | RED
ANCHORS: typecheck=PASS|FAIL test=PASS|FAIL build=PASS|FAIL e2e=PASS|FAIL
REVIEW: <count> CRITICAL, <count> WARN, <count> NIT
FAILURES:
- <each failing command, assertion, or CRITICAL finding, with file and detail — enough for the Builder to fix without re-running>
```

RED if any anchor fails or any CRITICAL finding exists. WARN and NIT never turn the verdict RED; list them so the Builder can judge.

## Rules

- Never weaken, skip, or reinterpret a check to reach GREEN. A test that cannot run is a FAIL, not an N/A.
- The verdict is consumed by the Builder's fix loop: three attempts maximum, then the sprint is marked ⛔ and a human steps in.
- The gate reports; it does not fix application code. Only the linter's trivial-formatting auto-fix touches files.
