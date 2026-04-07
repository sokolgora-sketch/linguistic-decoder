# Evals Metric Legibility v0.1

## Status
Active

## Goal
Make the scored metrics on `/evals` easier to interpret for a first-time operator without turning the workbench into a math explainer.

## Why this milestone now
Recent Evals work already improved:
- help discoverability
- input-type detection
- synthetic example clarity
- upload/paste copy
- floating notice hierarchy

The next usability gap is the scored summary itself.
A serious first-time user should be able to understand what the main metrics are telling them without reading the paper first.

## Scope

### 1. Metric interpretation
Improve the live scored surface around:
- Pearson r
- Spearman ρ
- p_perm
- Compliance

### 2. Keep it operator-first
Short interpretation help only.
No long-form mathematical teaching.
Detailed explanation remains on `/evals/help`.

### 3. Preserve layout discipline
This is a legibility/copy slice, not a layout rewrite.

## Non-goals
This milestone does not include:
- chart redesign
- export changes
- share/state-link work
- reference-page redesign
- battery protocol changes

## Success criteria

### First-read test
A first-time user can understand what each metric is broadly telling them.

### Signal test
A user can distinguish:
- stronger vs weaker signal
- aligned vs not aligned
- significance vs non-significance
- pass/compliance count

### Stability test
The page remains clean and compact.

## Deliverables
- improved scored-summary metric copy
- focused regression tests
- visual smoke on `/evals`

## Suggested implementation order
1. lock milestone docs
2. inspect scored-summary metric block
3. patch metric legibility copy
4. add focused tests
5. visual smoke
6. gate
7. commit / PR

## Definition of done
This milestone is done when:
- scored metrics are easier to interpret
- focused tests lock the new copy
- visual smoke stays clean
- gate and build pass

## Proof required
- focused evals tests
- `npm run gate:quick`
- `npm run build`
- visual smoke notes or screenshots for `/evals`
