# Sample renders

These files are **snapshots**, not sources. Each was produced by the `render-prd` skill (`.claude/skills/render-prd/`) from the artifacts in `docs/` at the commit named in its front matter.

PEDAL has no PRD. It has context, and a PRD is a query against it:

```
PRD = f(context, when, who)
```

| File | Reader | Scope | Stage |
|---|---|---|---|
| [`request-pedal.designer.md`](./request-pedal.designer.md) | designer | Request PEDAL | Defined |
| [`request-pedal.engineer.md`](./request-pedal.engineer.md) | engineer | Request PEDAL | Defined |
| [`request-pedal.legal.md`](./request-pedal.legal.md) | legal | Request PEDAL | Defined |
| [`request-pedal.marketing.md`](./request-pedal.marketing.md) | marketing | Request PEDAL | Defined |
| [`realism.designer.md`](./realism.designer.md) | designer | Realism epic | Exploring |

Read the four `request-pedal` files side by side: same feature, same source, four documents, and the header at the top of each is identical. Then compare the two designer renders to see how the same reader gets a contract for a defined epic and a list of open decisions for a directional one.

## Rules

- **Don't edit these.** If a render is wrong, fix the artifact in `docs/` and render again.
- **Don't read them as context.** Agents building PEDAL read `docs/`; the skill is told never to read this folder.
- **Regenerate freely.** In Claude Code, from the repo root: *"Use render-prd for the legal reader, scope Booking S3."* Any reader with a file in `.claude/skills/render-prd/lenses/` works, and adding a reader is one new file.
