# Evals Examples + Validation Clarity v0.1

## Status
Active

## Goal
Make `/evals` easier for a first-time operator by improving example onboarding and validation clarity without turning the workbench into a documentation page.

## Why this milestone now
The previous milestone added:
- `/evals/help`
- a visible Help entry
- explicit input-type detection

That reduced private-context dependency.

The next gap is still practical onboarding:
- what should I paste first?
- what does "Load example" actually give me?
- what exactly is wrong with this input before I score it?
- where should I look when the workbench warns me?

This milestone exists to make those answers more obvious inside the live workbench.

## Scope

### 1. Example clarity
Improve the visibility and wording around example usage:
- make `Load example` feel like a clean first-run path
- clarify what kind of example it loads
- reduce ambiguity about whether the example is synthetic, saved, or live

### 2. Validation clarity
Tighten the input/notice surface so first-time users can tell:
- what is invalid
- what is merely warned
- what can still be scored
- what the workbench auto-wraps or auto-interprets

### 3. Notice hierarchy
Improve warning/note/error readability around:
- invalid JSON
- buckets-only auto-wrap in full bundle mode
- metadata / export / saved-run notices if they affect first-run clarity

### 4. Keep live-first discipline
Any copy changes must keep `/evals` as an operator surface, not a bloated help page.
Detailed explanation should remain on `/evals/help`.

## Non-goals
This milestone does not include:
- another layout rewrite
- metric-card redesign
- share/state-link implementation
- reference-page redesign
- full export-system changes
- battery protocol lock
- paper-writing work

## Success criteria

### Example path test
A first-time user should understand what happens when they click `Load example`.

### Validation clarity test
A first-time user should be able to distinguish:
- invalid input
- detectable but scoreable input
- warned-but-usable input
- notice vs warning vs error

### Workbench discipline test
The page should become clearer without becoming heavier or more cluttered.

## Deliverables
- clearer `Load example` wording or companion hint
- clearer validation/notice messaging in the live workbench
- focused regression tests for the new copy / states
- visual smoke on `/evals`

## Suggested implementation order
1. Lock milestone docs
2. Inspect current `Load example` and notice / error blocks
3. Improve example wording
4. Improve validation / notice wording
5. Add focused tests
6. Visual smoke
7. Gate
8. Commit / PR

## Definition of done
This milestone is done when:
- `Load example` is easier to understand for a first-time user
- invalid / warned / usable states read more clearly
- tests lock the new states
- visual smoke confirms the page stayed clean
- gate and build pass

## Proof required
- focused evals tests
- `npm run gate:quick`
- `npm run build`
- screenshots or live smoke notes for `/evals`
