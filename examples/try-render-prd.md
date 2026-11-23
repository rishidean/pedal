<a name="appendix-try-it-on-pedal"></a>

# PRD Walkthrough

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
| TR-003 | `ride_review` | `REQUEST_RIDE` (`now`: ISO timestamp from the application boundary) | Destination and estimate are present | Store `requestedAt`; preserve pickup, destination, `4 min`, `$18`; persist | `matching` |
| TR-004 | `matching` | `ASSIGN_DRIVER` (automatic mock) | Valid matching state | Set `driverId: 'maya-chen'`, `pedicabId: 'pedal-14'`, `assignedEtaMinutes: 3`; persist | `driver_assigned` |
...
- At 1199ms the state remains matching; after the canonical delay it assigns the fixture driver.
```

### 3. Now try: the same moment for legal

```text
Use render-prd with reader legal, scope Request PEDAL.
```

Excerpt:

```markdown
| `driver_assigned` | `Driver assigned`, `Maya is on the way` | No. Fixture driver: "No driver account, location, contact, or acceptance action" (MB-006). |
...
The Functional Brief states: "The app should not claim real availability, precise arrival, or a guaranteed price," and "Labels such as `Mock ride` do not need to appear throughout the rider UI."
...
- **Stored:** browser `localStorage` under `pedal.ride.v1`, written "After every valid state transition".
...
The request "does not create a payment authorization, driver record, network request, map route, notification, or cancellation entitlement."
```

What's different: the header is word for word the same as the engineer's, but the body covers what the rider is told, what data stays in the browser, and what happens with money. It also reports a decision the docs already made: the driver is a fixture, and the rider UI does not have to label it as a mock.

### 4. Try a different purpose

The default purpose is `contract`: what is true now. Ask instead for what still needs a call:

```text
Use render-prd with reader engineer, scope Request PEDAL, purpose open decisions.
```

The contract drops out. What's left is a table of places where two builds could both satisfy the docs and still behave differently. One of them is whether the fare still shows once a driver is assigned. From one run, with the other cells cut:

```markdown
# Request PEDAL (ride_review → driver_assigned), for engineer, open decisions
...
| Whether the fare shows on the driver-assigned screen | ... | The ETA is settled (`3 min away` replaces `4 min`); the fare is not. Result A: `$18` stays visible at `driver_assigned`. Result B: the fare drops out until `ride_in_progress`. ... |
```

Another is the matching timer after a page reload:

```markdown
| How long matching lasts after a refresh | ... | Whether the delay counts from restoration or from `requestedAt`. Result A: every reload shows `Finding a nearby pedicab` for a full `1200ms`. Result B: the reload waits only the remainder, so a reload after 1,200ms assigns at once. ... |
```

Both items appeared in every test run. Their order and the rest of the list changed from run to run.

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

### 6. Fix the source, then render again

The fare question from step 4 is a gap in `docs/`, not a flaw in the render. The `prd-correction` branch settles it: the estimated fare stays visible once a driver is assigned. Leave Claude Code, switch to that branch, and look at what changed:

```bash
git checkout prd-correction
git diff prd-walkthrough prd-correction -- docs/
```

The decision touches four files in `docs/` and nothing else by hand. Start a new session with `claude` and ask the step 4 question again:

```text
Use render-prd with reader engineer, scope Request PEDAL, purpose open decisions.
```

The fare row is gone, in every test run. The timer row is still there, because nobody has decided it. The remaining rows from one run, with the other cells cut:

```markdown
| Delay after a refresh during `matching` | ... |
| Persisted record whose fields contradict its stage | ... |
| Demo Controls text during this moment, under `?demo=1` | ... |
```

Other readers pick up the same decision without being told. Ask for the designer's contract:

```text
Use render-prd with reader designer, scope Request PEDAL.
```

```markdown
3. "3 min" replaces the "4 min" pickup estimate. The "$18" estimated fare stays.
```

The sample renders in `examples/renders/` on this branch were regenerated the same way. Nobody edited them.

### 7. What it means

You ran one skill over one set of files and got a different document each time. The reader, the purpose, and how mature the scope is decided what each one contained. When a render was incomplete, the fix went into `docs/`, and every reader's next render picked it up. You never edit the render itself.
