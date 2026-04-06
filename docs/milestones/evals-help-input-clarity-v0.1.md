# Evals Help + Input Clarity v0.1

## Status
Active

## Goal
Make `/evals` understandable to a serious first-time user without private explanation.

This milestone is not a layout rewrite.
The shell is already substantially improved.
The next gap is comprehension:
- what Evals is
- what input it accepts
- how to use it
- what the core metrics mean
- what `/evals/reference` is
- what exports do
- how to avoid common mistakes

## Why this milestone now
Recent UI work made the page feel much more like a real instrument/workbench.
The next public-beta risk is no longer raw layout chaos.
The next risk is that first-time users still need private context to understand the page correctly.

This milestone exists to reduce that dependency.

## Scope

### 1. Help surface
Add a real `/evals/help` page that explains:
- what Evals is
- what it accepts
- the basic workflow:
  1. paste or upload
  2. score
  3. inspect
  4. export
- the difference between:
  - `evalRun.v0.1`
  - buckets-only JSON
- what `/evals/reference` is and is not
- what exports do
- common mistakes

### 2. On-page help entry
Add a visible help entry from `/evals` so users can discover help without guessing.

### 3. Metric glossary
Explain in plain language:
- Pearson r
- Spearman ρ
- `p_perm`
- Compliance

This is not a statistics paper.
The copy should be enough for correct usage, not full mathematical teaching.

### 4. Input clarity on `/evals`
Strengthen the live workbench itself with:
- clearer accepted-format language
- explicit input-type detection or confirmation
- better empty-state guidance
- example availability
- validation visible before scoring where possible

## Non-goals
This milestone does not include:
- another major layout restructure
- full battery protocol lock
- paper writing
- export architecture changes
- reference page redesign
- Saved Runs extraction unless it blocks help/input clarity directly

## Success criteria

### First-time user test
A new user should be able to understand within about 10 seconds:
- this is an eval instrument
- what to paste/upload
- what happens after scoring
- where reference-only material lives

### Help-page test
A serious user should be able to use Evals without asking for private explanation.

### Input clarity test
A first-time user must be able to tell:
- what formats are accepted
- whether their input is valid
- whether the page detected the input correctly
- where to find examples

### Metric legibility test
A user must be able to read:
- Pearson r
- Spearman ρ
- `p_perm`
- Compliance
without needing the paper first.

## Deliverables
- `/evals/help` route
- Help entry from `/evals`
- metric glossary content
- stronger input guidance on `/evals`
- examples and/or example entry points
- clearer validation messaging

## Suggested implementation order
1. Inspect current `/evals` copy anchors
2. Add milestone docs
3. Create `/evals/help`
4. Link help from `/evals`
5. Improve input guidance copy
6. Add or surface examples
7. Tighten validation messaging
8. Run gates
9. Visual check
10. Draft PR

## Definition of done
This milestone is done when:
- `/evals/help` exists
- `/evals` links to it clearly
- accepted inputs are obvious
- metric meanings are understandable in plain language
- reference vs live scoring is clearer
- build is green
- gate is green
- screenshots show a cleaner comprehension story, not just a cleaner layout

## Proof required
- `npm run gate:quick`
- `npm run build`
- screenshots of:
  - `/evals` default state
  - `/evals` with valid input
  - `/evals/help`

