# Lens: designer

**Who.** The person who will draw the screens and own how each state looks, reads, and behaves.

**What they need from a PRD.** What the rider sees, in what order, what they can and cannot do on each screen, and the exact words.

## Body, by stage

**Defined**
1. **Screens in order.** A table: state · what the rider sees (exact copy in quotes) · actions available · actions deliberately absent.
2. **Transitions the rider feels.** What moves them between screens, including anything automatic or timed, in rider terms.
3. **Visual and tone constraints.** The visual language, content and tone rules, and anything the design must never imply (for example, a live map or a moving vehicle).
4. **Edge behavior.** Empty states, refresh, invalid or stale data, small-screen and accessibility requirements.

**Exploring**
1. **The rider moments in question.** Which parts of the journey the epic would change.
2. **Design decisions waiting on product decisions.** For each undecided item, what the designer cannot draw until it is decided.
3. **What stays fixed.** The Booking contract the epic must not weaken.

**Shipped**
1. What the rider experiences now, per the result record, and any gap against the defined screens.

## Leave out

Reducer internals, event names, storage keys, test commands. Name a state once in backticks so engineering can match it; otherwise speak in screens.
