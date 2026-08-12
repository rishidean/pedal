# PEDAL Vision

## TL;DR

PEDAL is a deliberately basic pedicab hailing tool for one rider taking one short, on-demand trip. It exists to make the agentic development system visible: a team resolves product decisions, preserves them in artifacts, and watches agents build the first EPIC without carrying prototype code or private conversation forward.

## The rider

PEDAL serves a person in a compact downtown or entertainment district who wants a short pedicab trip. The rider already knows where they want to go; they need a quick way to request the ride and confidence about likely wait, fare, and driver arrival.

PEDAL does not attempt to model every transport use case. There is no driver, dispatcher, operator, administrator, or account-holder experience in the Booking epic.

## The problem

Hailing a pedicab is informal and uncertain. A rider may not know whether a driver is available, what the ride might cost, or whether someone is actually coming. The first PEDAL experience makes that basic journey legible without pretending the teaching app runs a real marketplace.

## Desired outcome

A rider can:

1. choose a destination from a small local set;
2. review a mocked pickup estimate and fare;
3. request a pedicab;
4. distinguish matching from driver assignment;
5. follow a simulated ride through completion; and
6. understand that payment happens directly with the driver.

The experience should feel quick, local, and coherent. It should never imply that a static map is live, a fixture is a real driver, or a timer is production dispatch.

## Course purpose

PEDAL is the common workbook across Escape Velocity. The product is intentionally familiar and small so participants can focus on the method:

> **Make intent explicit, preserve it in artifacts, let agents execute bounded work, and return evidence to people who still own the decision.**

DISCOVERY uses PEDAL to show how an LLM helps a team expose and resolve product questions. DEFINITION turns the answers into durable product artifacts, a roadmap, and sprint specifications. DEVELOPMENT begins with those artifacts and no application code, then executes the complete first EPIC.

## Product principles

| Principle | Meaning for PEDAL |
|---|---|
| **One journey beats a fake platform** | Build one complete rider path instead of a thin slice of a marketplace. |
| **Mock the machinery, not the agreement** | Location, estimates, matching, and drivers may be simulated; states, copy, transitions, and acceptance must remain explicit. |
| **Status should reduce uncertainty** | Matching, assignment, arrival, progress, and completion are distinct rider-visible states. |
| **The mock must be honest** | Static maps and Demo Controls should not imitate production integrations. |
| **The artifacts are the interface** | DEVELOPMENT should not need the Discovery conversation or Figma Make code to understand the product. |
| **Evidence closes the loop** | A sprint is accepted only when its behavior and verification prove the intended outcome. |

## Product boundary

### Included in the Booking epic

PEDAL includes destination selection, a single ride option, a deterministic pickup estimate, a deterministic fare estimate, a ride request, explicit matching, mocked driver assignment, simulated arrival and ride progression, completion, direct-payment instruction, local persistence, a static map treatment, and bounded demo controls.

### Excluded from the Booking epic

PEDAL excludes accounts, authentication, live location, real maps, route calculation, driver software, operations tooling, production dispatch, cancellation, no-driver recovery, scheduled rides, in-app payment, tips, receipts, ratings, messaging, calls, safety operations, and marketplace administration.

These concerns are not invisible. They appear as future work in the Realism epic or later; they simply do not enter the AI Week build.

## Success at the end of the Booking epic

Someone can open the local app and complete the canonical rider path from destination entry through ride completion. The interface follows the agreed visual language, every state transition is deterministic and testable, a refresh restores the current ride, the complete path passes automated verification, and no implementation choice has widened the product boundary.

The stronger proof is not the app itself. The proof is that the app was built from the `defined` artifacts with no application code at the starting line.

## References

- [`Functional Brief`](./FunctionalBrief.md)
- [`Flows`](./Flows.md)
- [`Business Rules`](./BusinessRules.md)
- [`Roadmap`](./Roadmap.md)
