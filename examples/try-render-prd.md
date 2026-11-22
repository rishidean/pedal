## Appendix: Try it on PEDAL

PEDAL is a teaching repository: a deliberately basic pedicab-hailing app with one rider, one trip, and no backend. It has no PRD. The vision, functional brief, rider flows, business rules, roadmap, and sprint specs in `docs/` are the maintained product context. A small skill, `render-prd`, reads them and produces a PRD for one reader and one scope. Each run is generated fresh, so your output will be worded differently from the excerpts below. The substance should match.

### 1. Do this

You need git and Claude Code.

```bash
git clone https://github.com/rishidean/pedal.git
cd pedal
claude
```

Accept the trust prompt for the folder. Then ask for the engineer's view of the moment the rider taps Request PEDAL:

```text
Use render-prd for the engineer reader, scope Request PEDAL, from ride review through driver assigned.
```

Keep the "from ride review through driver assigned" part. With a bare `Request PEDAL`, the skill sometimes reads the scope as the tap alone and leaves out driver assignment.

### 2. You should get

A one-page contract with front matter, a header for problem, success and stage, then states, invariants, timing, boundaries, proof, and open questions. Stage reads `Defined`. Two excerpts from one run, the transition table and the test that proves it:

```markdown
| Rule | From | Event | Guard | Effect | To |
|---|---|---|---|---|---|
| TR-003 | `ride_review` | `REQUEST_RIDE` (`now: string`, ISO) | Destination and estimate present | Store `requestedAt`; keep request context | `matching` |
| TR-004 | `matching` | `ASSIGN_DRIVER` | Valid matching state | Set `maya-chen`, `pedal-14`, `assignedEtaMinutes: 3` | `driver_assigned` |
...
## Proof
- **Unit tests (fake timers):** state is still `matching` at 1199ms, then becomes Maya Chen / PEDAL 14 / 3 min. A restored `matching` state schedules only one assignment.
```

### 3. Now try: the same moment for legal

```text
Use render-prd for the legal reader, scope Request PEDAL, from ride review through driver assigned.
```

Excerpt:

```markdown
| Driver assigned | `Maya is on the way` / `Maya Chen`, `PEDAL 14`, `3 min away` | No. The docs call it the "Pickup ETA" |
...
| Stored | Browser `localStorage` under `pedal.ride.v1`, written "after every valid state transition" |
| Sent anywhere | Nothing. BR-014: no network request. Tests check that "no external application request" is made |
...
Requesting a ride "does not create a payment authorization" (Flows 2).
...
- Whether to say that `Maya Chen` is a fictional driver: Not defined in the context. FunctionalBrief says `Mock ride` labels "do not need to appear".
```

What's different: the header is word for word the same as the engineer's, but the body covers what the rider is told, what data stays in the browser, and what happens with money, and the open question is whether to disclose that the driver is simulated.

### 4. Try a different purpose

Ask the engineer view only for what is still undecided:

```text
Use render-prd for the engineer reader, scope Request PEDAL, from ride review through driver assigned. Show only what still needs a decision.
```

The timer contract drops out, and the first open question is what happens to the timer after a page reload:

```markdown
## Open questions

- **Restored matching delay:** full `1200` ms after load, or the time left since `requestedAt`?
```

### 5. Try an immature scope

```text
Use render-prd for the engineer reader, scope Realism.
```

Realism is marked directional in the roadmap. The render says so in the header, then lists the decisions it is waiting on instead of a contract:

```markdown
> **Success.** Not yet defined. The epic is directional.
>
> **Stage.** Exploring, per docs/Roadmap.md.

None of the candidate sprints can be executed. Each Realism question needs fresh Discovery and Definition before any sprint can move to ready.
```

The body lists the mocks Realism would replace, the product decisions each one waits on (cancellation policy, no-driver timeout, location provider, payment boundary), what must not regress, and open questions. It has no transition table and no acceptance tests.

### 6. What it means

You ran one skill over one set of files and got four different documents. The reader, the purpose, and how mature the scope is decided what each one contained. When a render is wrong or incomplete, you fix the file in `docs/` that it came from and render again. You never edit the render itself.
