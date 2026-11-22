# Sample renders

These files are **snapshots**, not sources. Each was produced by the `render-prd` skill (`.claude/skills/render-prd/`) from the artifacts in `docs/` at the commit named in its front matter.

PEDAL has no PRD. It has context, and a PRD is a query against it:

```
PRD = f(context, when, who, why)
```

| File | Reader | Scope | Purpose | Stage |
|---|---|---|---|---|
| [`request-pedal.designer.md`](./request-pedal.designer.md) | designer | Request PEDAL | contract | Defined |
| [`request-pedal.engineer.md`](./request-pedal.engineer.md) | engineer | Request PEDAL | contract | Defined |
| [`request-pedal.legal.md`](./request-pedal.legal.md) | legal | Request PEDAL | contract | Defined |
| [`request-pedal.marketing.md`](./request-pedal.marketing.md) | marketing | Request PEDAL | contract | Defined |
| [`request-pedal.engineer.open-decisions.md`](./request-pedal.engineer.open-decisions.md) | engineer | Request PEDAL | open decisions | Defined |
| [`realism.designer.md`](./realism.designer.md) | designer | Realism epic | contract | Exploring |

Read the four `request-pedal` contract files side by side: same feature, same source, four documents, and the header at the top of each is identical. Compare the two engineer renders to see how purpose changes the body. Then compare the two designer renders to see how the same reader gets a contract for a defined epic and a list of open decisions for a directional one.

## Rules

- **Don't edit these.** If a render is wrong, fix the artifact in `docs/` and render again.
- **Don't read them as context.** Agents building PEDAL read `docs/`; the skill is told never to read this folder.
- **Regenerate freely.** In Claude Code, from the repo root: *"Use render-prd with reader legal, scope Booking S3."* Any reader with a file in `.claude/skills/render-prd/lenses/` works, and adding a reader is one new file.
