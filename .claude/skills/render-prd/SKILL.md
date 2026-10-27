---
name: render-prd
description: Render a PRD on demand from PEDAL's product artifacts for one reader (designer, engineer, legal, marketing) and one scope, shaped by how mature that scope is. Read-only. Use when someone asks for "the PRD", a brief, or a one-pager for a flow, epic, or sprint. Never runs as part of a DEVELOPMENT sprint.
---

# render-prd

PEDAL has no PRD. It has context: the artifacts in `docs/`. A PRD is a query against that context:

```
PRD = f(context, when, who)
```

- **context** is `docs/` and nothing else.
- **when** is the maturity of the scope, read from `docs/Roadmap.md`.
- **who** is the reader, defined by a lens file in `lenses/`.

The render is disposable. It is never edited, never committed as a source of truth, and never read back as input. If a render is wrong, the fix goes into `docs/`, and the next render picks it up.

## Inputs

| Input | Required | Examples |
|---|---|---|
| `reader` | yes | `designer`, `engineer`, `legal`, `marketing` (one file per lens in `lenses/`) |
| `scope` | yes | `Request PEDAL` (a moment), `Flow 3` (a flow), `Booking S2` (a sprint), `Realism` (an epic) |
| `out` | no | A path to write to. Default: print the render. |

If the reader has no lens file, stop and say which lenses exist. Do not improvise a lens.

## Procedure

1. **Read the context, in order.** `README.md`, `docs/Vision.md`, `docs/FunctionalBrief.md`, `docs/Flows.md`, `docs/BusinessRules.md`, `docs/Roadmap.md`, then any sprint spec in `docs/specs/` that covers the scope, then any `docs/results/` file for it. Do not read application code, `PROGRESS.md`, or anything in `examples/`; earlier renders are output, not context.
2. **Resolve the scope** to the exact states, flows, rules, and sprints it touches. Name them in the render's `Covers` line.
3. **Determine the stage** from `docs/Roadmap.md`:

   | Stage | How to tell | What the render becomes |
   |---|---|---|
   | **Exploring** | The epic is marked `DIRECTIONAL` or otherwise not ready | The bet, what is undecided, and what must be decided before anyone builds. No requirements. |
   | **Defined** | Ready sprints exist with specs, status `🔲` or `▶` | A contract: exactly what is true, in the reader's terms. |
   | **Shipped** | Sprints are `✅` and a `docs/results/` record exists | Outcome against the definition of success, from the result record. |

4. **Write the invariant header** (below). It is identical, word for word, for every reader of the same scope.
5. **Write the body** by following the lens file for the reader, at the stage from step 3.
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

"Verbatim" means a fixed extent, not a judgment call: the Problem is the whole "The problem" section (one paragraph); the Success is the first paragraph named above. Two runs of this skill for different readers must produce byte-identical headers.

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
covers: <states / flows / sprints resolved in step 2>
stage: <stage>
rendered_from: <git rev-parse --short HEAD>
rendered_on: <YYYY-MM-DD>
---

# <Scope>, for <reader>

<invariant header>

<lens body>

## Open questions
<bullets, or "None in scope.">

<sub>Sources: <files and section headings actually used></sub>
```
