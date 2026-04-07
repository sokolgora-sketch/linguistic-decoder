# Evals Notice Hierarchy + Upload/Paste Copy v0.1

## Status
Active

## Goal
Make `/evals` clearer at the exact moment a user is deciding what to paste, reading a warning, or deciding whether the page can still score safely.

## Why this milestone now
Recent Evals work already shipped:
- `/evals/help`
- explicit input-type detection
- `Load synthetic example`
- clearer raw-buckets warning in bundle mode

The next usability gap is still inside the live workbench itself:
- upload/paste guidance is still too generic
- notice / warning / error states are not yet cleanly tiered
- first-time users still have to infer too much from the floating notice stack

This milestone exists to improve that decision surface without bloating the page.

## Scope

### 1. Upload / paste copy
Tighten the live copy around:
- `Input source`
- `Upload JSON`
- `Paste JSON`

The goal is not more text.
The goal is clearer text.

### 2. Notice hierarchy
Improve the hierarchy and wording of:
- invalid JSON state
- unsupported input state
- bucket warning in bundle mode
- floating note / warning / error stack

The page should make it easier to tell:
- fatal error
- warning but still usable
- informational note

### 3. Keep workbench discipline
Detailed explanations stay on `/evals/help`.
This milestone only improves the live operator surface.

## Non-goals
This milestone does not include:
- layout rewrite
- metric-card redesign
- share/state-link features
- export architecture changes
- reference-page redesign
- battery protocol lock

## Success criteria

### Input clarity test
A first-time user can tell what belongs in the upload/paste area without needing private explanation.

### Notice hierarchy test
A first-time user can tell the difference between:
- invalid
- warning
- informational
- scoreable state

### UI discipline test
The workbench becomes clearer without becoming heavier.

## Deliverables
- improved live upload/paste copy
- improved notice / warning / error wording or hierarchy
- focused regression tests
- visual smoke on `/evals`

## Suggested implementation order
1. lock milestone docs
2. inspect input copy block
3. inspect notice / warning / error panel
4. patch copy/hierarchy
5. add focused tests
6. visual smoke
7. gate
8. commit / PR

## Definition of done
This milestone is done when:
- upload/paste copy is cleaner
- notice hierarchy is easier to interpret
- tests lock the new states
- visual smoke stays clean
- gate and build pass

## Proof required
- focused evals tests
- `npm run gate:quick`
- `npm run build`
- live smoke notes or screenshots for `/evals`
