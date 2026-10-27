# Lens: engineer

**Who.** The person (or agent) who will implement and verify the scope.

**What they need from a PRD.** The contract: states, events, guards, timing, persistence, boundaries, and how acceptance is proven.

## Body, by stage

**Defined**
1. **State and transitions.** A table: rule ID · from · event · guard · effect · to. Use the rule IDs from `BusinessRules.md`.
2. **Invariants.** What must always or never be true in this scope.
3. **Timing and side effects.** Timers, scheduling, cleanup, and what happens on refresh mid-transition.
4. **Boundaries.** What is mocked, what must never be called or added (network, packages, permissions).
5. **Proof.** The acceptance criteria and verification commands from the sprint spec that cover the scope.

**Exploring**
1. **Integrations implied.** Which mocks the epic would replace with real systems.
2. **Architecture decisions waiting on product decisions.** Each one, and what it blocks.
3. **What must not regress.** The Booking contract and its verification.

**Shipped**
1. Verification results from the result record, against the defined acceptance criteria.

## Leave out

Marketing copy, visual styling beyond what affects testable behavior.
