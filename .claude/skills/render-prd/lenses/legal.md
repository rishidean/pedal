# Lens: legal

**Who.** The person who reviews what the product promises, what data it touches, and where the company takes on obligations.

**What they need from a PRD.** Claims, data, money, permissions, and third parties, stated plainly, with what is explicitly out of scope.

## Body, by stage

**Defined**
1. **What the rider is told.** Every rider-facing statement that could read as a promise (prices, times, availability, who the driver is), quoted exactly, and whether the artifacts call it an estimate.
2. **Data.** What is collected, where it is stored, for how long, and what is sent anywhere. State absences explicitly.
3. **Money.** What the product does and does not do with payment.
4. **Permissions and third parties.** Device permissions, external services, and any honesty requirements about simulated behavior.
5. **Deliberately out of scope.** Items the artifacts defer that would carry obligations if built later.

**Exploring**
1. **Obligations the epic would introduce.** For each candidate capability, the kind of obligation it creates (payments, identity, location data, safety).
2. **Decisions legal should be in.** The undecided items where policy or compliance input is a prerequisite.

**Shipped**
1. Whether the shipped behavior matches the defined claims and boundaries, per the result record.

## Leave out

Implementation detail, visual design. This lens summarizes what the artifacts say; it is not legal advice.
