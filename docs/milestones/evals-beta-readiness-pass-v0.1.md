# Evals Beta Readiness Pass v0.1

## Status
Active

## Goal
Run a final beta-readiness pass on the Evals surfaces and close any remaining small blockers without reopening architecture churn.

## Why this milestone now
Recent Evals work already improved:
- help discoverability
- input clarity
- notice hierarchy
- metric legibility
- share/state-link usefulness
- screenshot-grade polish

The remaining task is not another feature slice.
It is a final readiness pass against the beta release bar.

## Scope

### 1. Readiness inspection
Inspect `/evals`, `/evals/help`, and `/evals/reference` against the defined brutal beta criteria.

### 2. Small fixes only
Patch only remaining high-value, low-risk beta blockers.

### 3. Release decision support
End this milestone with a clear answer:
- ready enough
- or not ready yet, with exact remaining blockers

## Non-goals
This milestone does not include:
- major layout rewrites
- scoring logic changes
- export architecture changes
- battery protocol redesign
- paper drafting

## Success criteria

### Readiness test
The main Evals surfaces satisfy the minimum beta release threshold.

### Stability test
No churn-heavy edits. Only targeted closing fixes.

### Decision test
The final result can be stated clearly as ready / not ready with evidence.

## Deliverables
- final readiness inspection
- any remaining small fixes
- visual smoke notes
- final release recommendation

## Suggested implementation order
1. lock milestone docs
2. inspect `/evals`, `/evals/help`, `/evals/reference`
3. identify remaining blockers
4. patch only the highest-value remaining issue(s)
5. visual smoke
6. gate
7. commit / PR
8. final readiness verdict

## Definition of done
This milestone is done when:
- remaining blockers are either fixed or explicitly documented
- beta readiness is judged clearly
- gate and build pass
- the release recommendation is defensible

## Proof required
- focused tests if touched
- `npm run gate:quick`
- `npm run build`
- final visual smoke notes for `/evals`, `/evals/help`, `/evals/reference`
