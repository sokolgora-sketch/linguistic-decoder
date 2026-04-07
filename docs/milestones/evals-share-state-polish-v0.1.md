# Evals Share + State-Link Polish v0.1

## Status
Active

## Goal
Make `/evals` sharing more useful by improving copy-link behavior and clarifying what state, if any, is worth preserving in a shared URL.

## Why this milestone now
Recent Evals work already improved:
- help discoverability
- input-type detection
- synthetic example clarity
- upload/paste copy
- floating notice hierarchy
- metric legibility

The next beta blocker is shareability.
A copied link should be understandable and useful, not just technically valid.

## Scope

### 1. Copy-link polish
Inspect and improve the current `Copy page link` behavior on `/evals`.

### 2. Useful state
Decide which state is worth preserving in a link without creating noisy or brittle URLs.

### 3. User clarity
Make sure shared links open into a state that still makes sense to a first-time user.

## Non-goals
This milestone does not include:
- major public-share backend work
- export architecture changes
- reference-page redesign
- battery protocol changes

## Success criteria

### Link usefulness test
A copied `/evals` link should be understandable when opened elsewhere.

### State discipline test
Any preserved state should be small, intentional, and stable.

### UX test
Sharing should feel like a helpful operator tool, not a confusing dump of UI state.

## Deliverables
- improved copy-link behavior and/or preserved URL state
- focused regression tests
- visual smoke on `/evals`

## Suggested implementation order
1. lock milestone docs
2. inspect current copy-link behavior and URL state handling
3. patch share/state polish
4. add focused tests
5. visual smoke
6. gate
7. commit / PR

## Definition of done
This milestone is done when:
- copy-link behavior is more useful
- preserved state is intentional and readable
- focused tests lock the behavior
- gate and build pass

## Proof required
- focused evals tests
- `npm run gate:quick`
- `npm run build`
- visual smoke notes for `/evals`
