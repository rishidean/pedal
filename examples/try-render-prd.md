## Appendix: Try it on PEDAL

PEDAL is a teaching repository: a deliberately basic pedicab-hailing app with one rider, one trip, and no backend. It has no PRD. The vision, functional brief, rider flows, business rules, roadmap, and sprint specs in `docs/` are the maintained product context. A small skill, `render-prd`, reads them and produces a PRD for one reader, one scope, and one purpose. Each run is generated fresh, so your wording will differ from the excerpts below. The substance should match.

### 1. Do this

You need git and Claude Code. Clone the `prd-walkthrough` tag so your context matches the one these excerpts came from:

```bash
git clone --branch prd-walkthrough https://github.com/rishidean/pedal.git
cd pedal
claude
```

Git will say you are in a detached HEAD state. That is expected for a tag. Accept the trust prompt for the folder, then ask for the engineer's view of the moment the rider taps Request PEDAL:

```text
Use render-prd with reader engineer, scope Request PEDAL.
```

### 2. You should get

A one-page contract. The skill resolves the moment to a fixed range, from the screen with the button to the next state that waits on the rider. Stage reads `Defined`. Excerpts from one run, the transition table and the test that proves it:

```markdown
# Request PEDAL (ride_review → driver_assigned), for engineer
...
| Rule | From | Event | Guard | Effect | To |
|---|---|---|---|---|---|
| TR-003 | `ride_review` | `REQUEST_RIDE` (`now: string`) | Destination and estimate are present | Store request timestamp; preserve request context | `matching` |
| TR-004 | `matching` | `ASSIGN_DRIVER` (automatic, 1200ms) | Valid matching state | Assign Maya Chen, PEDAL 14, and 3-minute ETA | `driver_assigned` |
...
- The state is still matching at 1199ms and assigns the fixture driver after the canonical delay.
```

### 3. Now try: the same moment for legal

```text
Use render-prd with reader legal, scope Request PEDAL.
```

Excerpt:

```markdown
| `Maya is on the way`, `Maya Chen`, `PEDAL 14` | driver_assigned | Fixture driver (MB-006) |
...
- **Stored:** one `PedalState` record in browser `localStorage` under `pedal.ride.v1`, written after every valid transition.
...
Tapping `Request PEDAL` "does not create a payment authorization".
...
- Whether the default rider view needs any disclosure that the ride is simulated. The context only says one is not required.
```

What's different: the header is word for word the same as the engineer's, but the body covers what the rider is told, what data stays in the browser, and what happens with money, and it asks whether the simulated driver needs disclosing.

### 4. Try a different purpose

The default purpose is `contract`: what is true now. Ask instead for what still needs a call:

```text
Use render-prd with reader engineer, scope Request PEDAL, purpose open decisions.
```

The contract drops out. What's left is a table of undecided items, led by what happens to the matching timer after a page reload:

```markdown
# Request PEDAL (ride_review → driver_assigned), for engineer, open decisions
...
The defined contract (TR-003/TR-004 effects, the `1200ms` delay, the one-assignment guard, the Strict Mode protection, fixtures and copy) is not repeated here. Use `purpose contract` to get it.

## Open questions

- On restore, does `matching` wait a fresh `1200ms` or the time remaining since `requestedAt`?
```

The list can be longer or shorter from run to run. The timer question came first in every test run.

### 5. Try an immature scope

```text
Use render-prd with reader engineer, scope Realism.
```

Realism is marked directional in the roadmap. The same lens comes back as decisions and open questions instead of a contract. The header and section headings from one run:

```markdown
> **Success.** Not yet defined. The epic is directional.
>
> **Stage.** Exploring, per docs/Roadmap.md.
...
## Integrations implied
## Architecture decisions waiting on product decisions
## What must not regress
## Open questions
```

There is no transition table and no acceptance test for Realism itself. The only tests named are the Booking ones it must not break.

### 6. What it means

You ran one skill over one set of files and got four different documents. The reader, the purpose, and how mature the scope is decided what each one contained. When a render is wrong or incomplete, you fix the file in `docs/` that it came from and render again. You never edit the render itself.
