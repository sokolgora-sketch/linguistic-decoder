# Evals Examples + Validation Clarity v0.1 — Status

## Status
Active
In progress

## Milestone summary
This milestone improves first-run onboarding inside `/evals` by clarifying examples and validation states.

## Why now
Help and input detection already landed.
The next blocker is practical first-use clarity inside the workbench itself.

## In scope
- clearer `Load example` path
- clearer validation / notice / warning messaging
- focused regression tests
- visual smoke on `/evals`

## Out of scope
- major layout changes
- metric redesign
- share/state-link work
- battery protocol lock
- export architecture changes

## Acceptance criteria
- first-time users understand what `Load example` does
- invalid vs warned vs usable states are easier to distinguish
- the workbench remains live-first and uncluttered
- tests pass
- gate and build pass
