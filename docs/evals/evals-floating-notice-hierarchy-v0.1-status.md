# Evals Floating Notice Hierarchy v0.1 — Status

## Status
Active
In progress

## Milestone summary
This milestone improves the floating notice stack on `/evals` so operators can distinguish errors, warnings, and notes more quickly.

## Why now
The next first-run friction is the notice hierarchy itself, not the input area.

## In scope
- clearer unsupported input / error / warning / note hierarchy
- focused regression tests
- visual smoke on `/evals`

## Out of scope
- layout changes
- metric redesign
- share/state-link work
- export architecture changes
- battery protocol lock

## Acceptance criteria
- unsupported input is clearly distinct
- errors are clearly distinct from warnings
- warnings are clearly distinct from notes
- tests pass
- gate and build pass
