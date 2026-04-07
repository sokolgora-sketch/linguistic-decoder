# Evals Screenshot-Grade Polish v0.1

## Status
Active

## Goal
Make the key Evals screenshot states look publication-ready without changing the underlying operator workflow.

## Why this milestone now
Recent Evals work already improved:
- help discoverability
- input clarity
- notice hierarchy
- metric legibility
- share/state-link usefulness

The next remaining beta blocker is visual polish for screenshots and first-glance credibility.

## Scope

### 1. Screenshot states
Improve the visual clarity of:
- `/evals` empty state
- `/evals` valid-input state
- `/evals` scored state
- `/evals/reference`

### 2. Hierarchy polish
Tighten spacing, labels, and visual emphasis so the screenshot story reads clearly without explanation.

### 3. No architecture churn
Do not redesign the workbench.
This is a screenshot-polish slice, not a structural rewrite.

## Non-goals
This milestone does not include:
- scoring logic changes
- export architecture changes
- battery protocol changes
- reference content rewrite
- large layout rewrites

## Success criteria

### Screenshot test
The main screenshot states should look serious, clean, and understandable at a glance.

### Credibility test
A skeptical outsider should see a disciplined instrument surface, not a messy experiment.

### Workflow safety test
Polish must not harm the operator workflow.

## Deliverables
- cleaner screenshot-ready UI states
- focused regression/guard coverage if needed
- visual smoke on `/evals` and `/evals/reference`

## Suggested implementation order
1. lock milestone docs
2. inspect screenshot-priority surfaces
3. patch the highest-value visual polish only
4. add focused tests if needed
5. visual smoke
6. gate
7. commit / PR

## Definition of done
This milestone is done when:
- the key screenshot states are cleaner
- visual hierarchy is stronger
- workflow remains intact
- gate and build pass

## Proof required
- focused evals tests if touched
- `npm run gate:quick`
- `npm run build`
- screenshot or visual smoke notes for `/evals` and `/evals/reference`
