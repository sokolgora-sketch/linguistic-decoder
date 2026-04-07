# Evals Floating Notice Hierarchy v0.1

## Status
Active

## Goal
Make the floating notice stack on `/evals` easier to interpret at a glance by clarifying the hierarchy between unsupported input, hard errors, warnings, and informational notes.

## Why this milestone now
Recent Evals work already improved:
- help discoverability
- input-type detection
- synthetic example clarity
- upload/paste copy

The next usability gap is the floating status stack itself.
The workbench already surfaces:
- unsupported input
- API errors
- warnings
- informational notes

But the hierarchy still needs to feel more deliberate and easier to triage.

## Scope

### 1. Floating notice hierarchy
Improve the readability and hierarchy of:
- Unsupported input
- Error <code>
- Warning
- Note

### 2. Message wording
Tighten wording where needed so operators can tell:
- cannot score
- can score with caution
- informational only

### 3. Keep layout stable
Do not redesign the page.
This is a notice hierarchy slice, not a layout slice.

## Non-goals
This milestone does not include:
- metric-card redesign
- share/state-link work
- export architecture changes
- reference-page redesign
- battery protocol lock

## Success criteria

### Hierarchy test
A first-time user can distinguish:
- fatal / blocked
- warning / caution
- informational note

### Readability test
The floating stack feels more disciplined and easier to scan.

### Stability test
No layout churn. Only targeted hierarchy/copy polish.

## Deliverables
- improved floating notice hierarchy
- improved wording for notice tiers where needed
- focused regression tests
- visual smoke on `/evals`

## Suggested implementation order
1. lock milestone docs
2. inspect floating notice stack and sources
3. patch hierarchy/copy
4. add focused tests
5. visual smoke
6. gate
7. commit / PR

## Definition of done
This milestone is done when:
- unsupported input, error, warning, and note are easier to distinguish
- focused tests lock the new hierarchy
- visual smoke stays clean
- gate and build pass

## Proof required
- focused evals tests
- `npm run gate:quick`
- `npm run build`
- visual smoke notes or screenshots for `/evals`
