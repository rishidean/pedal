# PEDAL Functional Brief

## TL;DR

the Booking epic builds one local, mobile-first rider journey. The rider selects the Ferry Building, reviews a 4-minute pickup estimate and `$18` fare, requests PEDAL, sees matching and mocked driver assignment, advances through a simulated ride, and finishes with an instruction to pay the driver directly.

The app uses deterministic fixtures, a static map, local persistence, and explicit demo controls. It has no backend, account, real driver, production matching, or in-app payment.

## Experience contract

| Dimension | Contract |
|---|---|
| **Device emphasis** | Mobile-first; fully usable at 375px width and coherent on wider screens |
| **Primary rider** | Person seeking a short, on-demand pedicab trip in a compact service area |
| **Pickup** | Mocked `Current location` |
| **Destination entry** | Local landmark suggestions; canonical path selects `Ferry Building` |
| **Ride selection** | One `PEDAL` option only |
| **Estimate** | `4 min` pickup and `$18` estimated fare before request |
| **Matching** | Explicit state with destination and estimate context preserved |
| **Driver assignment** | `Maya Chen`, `PEDAL 14`, and updated `3 min` pickup ETA |
| **Ride lifecycle** | Driver assigned → driver arrived → ride in progress → ride complete |
| **Payment** | Rider sees `$18` and `Pay the driver directly`; the app contains no payment state |
| **Reset** | `Start another ride` clears the active ride and returns to destination entry |

## Capabilities

### Destination and ride review

The opening screen shows a compact brand header, the mocked pickup, a destination control, three landmark suggestions, and a stylized local map. Selecting a destination opens the ride-review state with one PEDAL option, the pickup and destination, the 4-minute estimate, and the `$18` fare.

The rider cannot type an arbitrary address in the Booking epic. The apparent destination field behaves as a selection control backed by fixtures. This keeps the product legible while avoiding geocoding and validation behavior the workshop does not need.

### Request and matching

Tapping **Request PEDAL** creates a local ride request and enters `matching`. The screen says **Finding a nearby pedicab**, preserves the selected destination and estimate, and uses a stylized search treatment that does not imply a live radius or moving vehicle.

After a deterministic 1,200ms delay, the app assigns the canonical driver and enters `driver_assigned`. The screen says **Maya is on the way**, displays Maya Chen, PEDAL 14, the 3-minute ETA, pickup, and destination, and carries no call, chat, cancel, or live-location action.

### Ride lifecycle

The production-shaped rider surface displays `driver_assigned`, `driver_arrived`, `ride_in_progress`, and `ride_completed`. Because no driver system exists, the facilitator and automated tests advance the later states through a small **Demo Controls** panel enabled only when the URL includes `?demo=1`.

The panel is visually separate, labeled as teaching infrastructure, and absent from the default rider view. It provides only the valid next transition for the current state.

### Completion and reset

The completion screen says **You’ve arrived**, shows the Ferry Building, shows `$18`, and says **Pay the driver directly**. The primary action, **Start another ride**, resets the local state and returns to destination entry.

## Screen inventory

| Screen or state | Required content | Required action | Explicit absence |
|---|---|---|---|
| **Destination entry** | Brand, current pickup, destination selector, Union Square, Ferry Building, Oracle Park, static map | Select destination | Account avatar, live pin, ride types |
| **Ride review** | Pickup, destination, PEDAL option, 4-minute estimate, `$18` fare | Request PEDAL; return to destination selection | Payment method, promo code, surge, scheduling |
| **Matching** | Matching headline, request context, static search treatment | Automatic assignment | Cancel, retry, driver count, live radius |
| **Driver assigned** | Maya Chen, PEDAL 14, 3-minute ETA, pickup, destination | Demo-mode arrival only | Call, message, cancel, live vehicle |
| **Driver arrived** | Arrival headline, driver and pedicab, pickup point, destination | Demo-mode start only | PIN, contact, wait fees |
| **Ride in progress** | Destination, static route treatment, `$18` estimate | Demo-mode completion only | Route editing, live progress, safety tools |
| **Ride complete** | Arrival confirmation, Ferry Building, `$18`, direct-payment instruction | Start another ride | Card charge, tip, receipt, rating |

## Visual language

PEDAL uses a **More Modern & Minimal Hot Wheel City** visual language. It should feel like a compact city is ready to move, but the interface remains controlled, readable, and adult.

| Element | Direction |
|---|---|
| **Canvas** | Warm off-white (`#FFF8EC`) with white cards and restrained shadows |
| **Primary type** | Deep navy (`#10233F`) with a rounded, modern sans-serif stack |
| **Primary action** | Coral red (`#F24E3D`) with white text and strong focus state |
| **Status accent** | Golden yellow (`#F5B642`) paired with text or icon; never color alone |
| **Supporting accent** | Sky blue (`#4DA3FF`) for route or location cues |
| **Geometry** | Rounded cards and controls; 16–24px radii; clear spacing rather than decoration |
| **Map treatment** | Local stylized streets and blocks built from static HTML, CSS, or SVG; no provider attribution or live-map affordances |
| **Motion** | Short status transitions and a restrained matching animation; reduced-motion preference must be respected |
| **Icons** | Simple local line icons kept as explicit variables or components |

The interface should use one strong primary action per state. It should not use bottom tabs; PEDAL has one linear journey, not a multi-area application. Secondary information may appear in compact cards or bottom-sheet-like surfaces, but no navigation framework is required for the Booking epic.

## Content and tone

Copy is calm, direct, and specific. It should reduce uncertainty rather than sell the service.

| State | Canonical headline | Supporting copy |
|---|---|---|
| Destination | **Where are you headed?** | `Pickup: Current location` |
| Ride review | **Your PEDAL** | `Pickup in 4 min · Estimated fare $18` |
| Matching | **Finding a nearby pedicab** | `This usually takes less than a minute` |
| Assigned | **Maya is on the way** | `PEDAL 14 · 3 min away` |
| Arrived | **Your pedicab is here** | `Meet Maya at Current location` |
| In progress | **Heading to Ferry Building** | `Estimated fare $18` |
| Complete | **You’ve arrived** | `Pay the driver directly` |

The app should not claim real availability, precise arrival, or a guaranteed price. Labels such as `Mock ride` do not need to appear throughout the rider UI; the static treatment and Demo Controls boundary should make the teaching context clear.

## Accessibility and responsive behavior

Every interactive control must be keyboard reachable and have a visible focus state. Text and essential icons must meet WCAG AA contrast. Tap targets should be at least 44px. Status changes must use text and semantic announcements, not color or animation alone. Reduced-motion users should receive an immediate or minimally animated matching transition.

At mobile width, the journey uses one column with the primary action reachable without horizontal scrolling. On wider screens, the app may center inside a phone-like maximum-width frame with the stylized map filling supporting space; it should not become a desktop dashboard.

## Technical constraints

| Concern | Constraint |
|---|---|
| Application | Vite + React + TypeScript strict mode |
| Styling | Tailwind CSS |
| State | Explicit typed reducer or equivalent local state machine |
| Fixtures | Deterministic local module; no random data |
| Persistence | `localStorage` under `pedal.ride.v1` |
| Map | Local HTML, CSS, or SVG only |
| Matching | Deterministic 1,200ms mock delay |
| Demo mode | Query parameter `?demo=1` |
| Unit/component tests | Vitest + React Testing Library |
| End-to-end tests | Playwright |
| External services | None |

## Canonical fixture set

| Field | Value |
|---|---|
| Pickup label | `Current location` |
| Destinations | `Union Square`, `Ferry Building`, `Oracle Park` |
| Canonical destination | `Ferry Building` |
| Initial ETA | `4 min` |
| Fare | `$18` |
| Driver name | `Maya Chen` |
| Pedicab ID | `PEDAL 14` |
| Assigned ETA | `3 min` |
| Matching delay | `1200` ms |

## Explicit non-goals

the Booking epic does not include free-form address entry, location permissions, route computation, live maps, multiple ride types, driver supply, production matching, failure recovery, cancellation, scheduling, accounts, authentication, payment, tipping, receipts, ratings, messaging, calls, notifications, safety features, analytics, backend persistence, or administrative surfaces.

An agent must not “round out” the product by adding any of these capabilities. Future realism appears directionally in the Realism epic.

## Product acceptance

The product boundary passes when the complete canonical path is usable at mobile width, every state and transition matches `Flows.md` and `BusinessRules.md`, a refresh restores an active ride, Demo Controls remain unavailable without `?demo=1`, all verification commands pass, and the network log shows no external application request.

## References

- [`Vision`](./Vision.md)
- [`Flows`](./Flows.md)
- [`Business Rules`](./BusinessRules.md)
- [`Roadmap`](./Roadmap.md)
