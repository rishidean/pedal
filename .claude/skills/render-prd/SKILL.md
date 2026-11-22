---
name: render-prd
description: Render a PRD on demand from PEDAL's product artifacts for one reader (designer, engineer, legal, marketing) and one scope, shaped by how mature that scope is. Read-only. Use when someone asks for "the PRD", a brief, or a one-pager for a flow, epic, or sprint. Never runs as part of a DEVELOPMENT sprint.
---

# render-prd

PEDAL has no PRD. It has context: the artifacts in `docs/`. A PRD is a query against that context:

```
PRD = f(context, when, who, why)
```

- **context** is `docs/` and nothing else.
- **when** is the maturity of the scope, read from `docs/Roadmap.md`.
- **who** is the reader, defined by a lens file in `lenses/`.
- **why** is the purpose: what the reader is trying to do with the render.

The render is disposable. It is never edited, never committed as a source of truth, and never read back as input. If a render is wrong, the fix goes into `docs/`, and the next render picks it up.

## Inputs

| Input | Required | Examples |
|---|---|---|
| `reader` | yes | `designer`, `engineer`, `legal`, `marketing` (one file per lens in `lenses/`) |
| `scope` | yes | `Request PEDAL` (a moment), `Flow 3` (a flow), `Booking S2` (a sprint), `Realism` (an epic) |
| `purpose` | no | `contract` (default) or `open decisions` |
| `out` | no | A path to write to. Default: print the render. |

If the reader has no lens file, stop and say which lenses exist. Do not improvise a lens. If the purpose is not one listed below, stop and say which purposes exist. Do not infer a purpose from free text; if none is given, use `contract`.

## Purposes

| Purpose | The reader is asking | What the body becomes |
|---|---|---|
| `contract` | What is true now, so I can act on it? | The lens body for the stage, as written in the lens file. |
| `open decisions` | What still needs a call before I can act? | Only what the context leaves undecided for this scope, seen through the lens. Do not restate the defined contract. |

For `open decisions`, replace the lens body with one table: decision · what the artifacts say (quoted) · what they leave silent · what it blocks for this reader. If nothing qualifies, write `No open decisions in scope.`

An item goes in the table only if it passes all three tests:

1. **Anchored.** An artifact statement in scope raises it: the statement is ambiguous, defers the answer, or cannot be applied without it. Quote that statement. Do not raise scenarios no artifact mentions.
2. **Blocking.** The "what it blocks" cell names something concrete in `docs/` that this reader cannot finish without the answer: an acceptance criterion, a required test, a rider-facing copy string, or a rule ID. If you cannot name one, drop the item.
3. **In the lens.** The lens's body sections would need it. Use the lens's **Leave out** section to drop the rest.

Choices the artifacts leave to the builder are not open decisions. Neither are items owned by a sprint outside the scope. Order the table by how much each item blocks, most first.

For an **Exploring** scope, `open decisions` is the lens's decisions section alone, in the same table form. Drop the lens's other Exploring sections.

The same tests govern the **Open questions** section under either purpose: list a question only when writing the body hit a gap that is anchored and blocking. Do not brainstorm.

## Resolving a named moment

A moment is a scope named after a rider action: the exact label of a control in `docs/Flows.md` or `docs/FunctionalBrief.md`, such as `Request PEDAL`. Resolve it the same way every time:

1. **Start state:** the state whose screen shows that control.
2. **Path:** the transition the control triggers, then every transition that follows automatically (timers, effects) with no further rider action.
3. **End state:** the first state on that path that waits for another rider action or a Demo Controls event.

The scope is the start state, the transitions on that path, and the end state. Other actions available in the start state are out of scope; do not cover them. Write the resolved range in the title and `covers` line as `<Moment> (<start state> → <end state>)`, for example `Request PEDAL (ride_review → driver_assigned)`. If the name matches no control label, stop and say so.

## Procedure

1. **Read the context, in order.** `README.md`, `docs/Vision.md`, `docs/FunctionalBrief.md`, `docs/Flows.md`, `docs/BusinessRules.md`, `docs/Roadmap.md`, then any sprint spec in `docs/specs/` that covers the scope, then any `docs/results/` file for it. Do not read application code, `PROGRESS.md`, or anything in `examples/`; earlier renders are output, not context.
2. **Resolve the scope** to the exact states, flows, rules, and sprints it touches. For a moment, follow "Resolving a named moment" above. Name them in the render's `covers` line.
3. **Determine the stage** from `docs/Roadmap.md`:

   | Stage | How to tell | What the render becomes |
   |---|---|---|
   | **Exploring** | The epic is marked `DIRECTIONAL` or otherwise not ready | The bet, what is undecided, and what must be decided before anyone builds. No requirements. |
   | **Defined** | Ready sprints exist with specs, status `🔲` or `▶` | A contract: exactly what is true, in the reader's terms. |
   | **Shipped** | Sprints are `✅` and a `docs/results/` record exists | Outcome against the definition of success, from the result record. |

4. **Write the invariant header** (below). It is identical, word for word, for every reader of the same scope.
5. **Write the body** by following the lens file for the reader, at the stage from step 3, shaped by the purpose (see "Purposes").
6. **Close with the sources line** and the open questions, if any.

## The invariant header

Every render starts with this block, filled verbatim from the artifacts. Do not paraphrase, shorten, or reorder it; two readers comparing their renders must see the same words.

```markdown
> **Problem.** <the "The problem" section of docs/Vision.md, verbatim>
>
> **Success.** <the success definition for the scope's epic, verbatim. For Booking: the FIRST paragraph only of "Success at the end of the Booking epic" in docs/Vision.md. For an epic with none: "Not yet defined. The epic is directional.">
>
> **Stage.** <Exploring | Defined | Shipped>, per docs/Roadmap.md.
```

"Verbatim" means a fixed extent, not a judgment call: the Problem is the whole "The problem" section (one paragraph); the Success is the first paragraph named above. Two runs of this skill for different readers or purposes must produce byte-identical headers.

## Rules

- **Trace every claim.** Each statement must come from `docs/`. Copy fixture values, state names, event names, and rider-facing copy exactly as written, in backticks or quotes.
- **Silence is an answer.** If the artifacts do not cover something the lens asks about, write `Not defined in the context.` and add it to Open questions. Never fill the gap from what pedicab or ride-hailing apps usually do.
- **Conflicts stop the render.** If two artifacts disagree, do not choose. Report the conflict, which artifact governs per the precedence in `README.md`, and stop. That is a definition problem.
- **Mocks stay honest.** Never describe a fixture, timer, or static map as if it were a real system.
- **One page.** Body under 450 words. Tables over prose where the lens content is items × attributes.
- **Never edit `docs/`.** This skill is read-only.

## Output format

```markdown
---
reader: <lens>
scope: <scope as given>
purpose: <contract | open decisions>
covers: <states / flows / sprints resolved in step 2>
stage: <stage>
rendered_from: <git rev-parse --short HEAD>
rendered_on: <YYYY-MM-DD>
---

# <Scope, with the resolved range for a moment>, for <reader><append ", open decisions" only when that is the purpose>

<invariant header>

<lens body>

## Open questions
<bullets, or "None in scope.">

<sub>Sources: <files and section headings actually used></sub>
```
