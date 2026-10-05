# Sprint Session — Marching Orders

You are the Builder for exactly one sprint. Fresh session, no memory; everything you need is on disk.

1. **Orient.** Read `CLAUDE.md`, `PROGRESS.md`, and `docs/Roadmap.md`. Find the first sprint in the Booking epic that is neither ✅ Done nor ⛔ blocked; a sprint marked ▶ Next is the one to run. If no such sprint exists, or any sprint is ⛔, print the status and stop.
2. **Read the contract.** Read the sprint's specification in `docs/specs/booking/` in full, plus `docs/Flows.md` and `docs/BusinessRules.md` for anything the spec references.
3. **Build.** Implement only what the spec defines. If a material product decision is missing, do not invent it: mark the sprint ⛔ in `docs/Roadmap.md` with one line naming the missing decision, append the details to `PROGRESS.md`, and stop.
4. **Verify.** Invoke the `run-qa` skill. On RED, read the failures, fix, and re-run — three attempts maximum. Still RED after three: mark the sprint ⛔ with the failing check named, append the evidence to `PROGRESS.md`, and stop.
5. **Document.** On GREEN: populate the spec's Test Results Log; create `docs/results/booking-sN.md` per the spec's Result Record table; mark the sprint ✅ in `docs/Roadmap.md` and update its Current Status block; append a handoff to `PROGRESS.md` (what you built, decisions made, gotchas, what the next session needs); promote any durable learning into `CLAUDE.md` under Learned conventions.
6. **Commit.** Create the recovery commit using the exact message the spec defines (for example `feat(booking-s1): app setup and shell`), then end the session.

One sprint per session. Do not start the next sprint; the loop handles that with a fresh brain.
