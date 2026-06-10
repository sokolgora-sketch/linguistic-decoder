# Zheji Next Controlled Segmentation Decision Design v0.1

## Status

Type: design

This document designs the next controlled decision after the Zheji `.002 / .003 / .004` segmentation contrast interpretation loop was closed.

No model call is made.

No rerun is made.

No artifact is created.

No source, runtime, API, UI, prompt, validator, provider, or schema behavior is changed.

## Source context

This design follows the accepted interpretation-review closure:

- PR #1269: `docs(open-instrument): review zheji segmentation contrast interpretation note`

The immediate source documents are:

- `docs/open-instrument/zheji-segmentation-contrast-interpretation-note-review-v0.1.md`
- `docs/open-instrument/zheji-segmentation-contrast-interpretation-note-v0.1.md`
- `docs/open-instrument/zheji-study-segmentation-contrast-matrix-v0.1.md`
- `docs/open-instrument/zheji-study-segmentation-contrast-matrix-review-v0.1.md`

The current compared segmentation lanes are:

- `study.segmentation.002 / STU + DI`
- `study.segmentation.003 / SHTU + DI`
- `study.segmentation.004 / S + TU + DI`

## Current accepted state

The documentation interpretation loop for the current `.002 / .003 / .004` comparison lane is closed.

Accepted conclusions:

- `.002 / STU + DI` remains report-backed in the current inspected evidence set.
- `.003 / SHTU + DI` remains the stable clean reinforced baseline.
- `.004 / S + TU + DI` remains the clean fine-grained hard-case.
- `.004` creates higher null pressure than `.003`.
- `.004` creates higher traceability pressure than `.003`.
- Higher null pressure is diagnostic stress, not failure.
- Higher traceability pressure is diagnostic stress, not failure.
- Clean structure remains schema/traceability evidence, not candidate-truth evidence.
- Null candidates are not automatic failures.
- Finer segmentation is not automatically truer.
- Lower null pressure is not automatic superiority.

Forbidden conclusions remain forbidden:

- origin claim
- historical proof claim
- winner claim
- candidate-truth claim
- language superiority claim
- model-quality proof
- provider default change
- publication framing
- model call authorization
- rerun authorization

## Design goal

The next controlled decision must determine the next lane without drifting into automatic reruns.

The decision must be documentation-first.

The decision must separate planning from execution.

The decision must prevent the clean `.004` result from being inflated into a claim of truth, origin, winner, or publication readiness.

The decision must also prevent the team from running new model calls just because the previous lane is clean.

## Decision options

The next controlled decision may choose exactly one primary path.

### Option A — pause the segmentation lane

Use this if the current `.002 / .003 / .004` comparison loop is sufficient for now.

Allowed result:

- record the lane as closed
- no further segmentation rerun
- no source implementation
- no artifact creation
- no model call
- preserve current docs as reference material

Use when:

- there is no clear next research question
- additional runs would add noise
- the current interpretation boundary is more valuable than more data

### Option B — surface directly comparable `.002` JSON evidence

Use this if the main gap is evidence parity.

Allowed result:

- search the repository for directly comparable `.002` JSON artifact evidence
- create a docs-only evidence-surfacing note
- keep `.002` report-backed if direct JSON evidence is not found
- do not backfill from chat memory
- do not create new artifact JSON
- do not call a model

Use when:

- the team wants cleaner comparison parity
- `.002` should not remain weaker only because the direct artifact path was not inspected
- the work can be completed from existing repo evidence only

### Option C — design a new controlled segmentation comparison

Use this only if there is a new segmentation hypothesis.

Allowed result:

- create a docs-only design
- define candidate segmentations
- define source evidence requirements
- define model-call prohibition until preflight
- define exact artifact/report names only if a later controlled call is justified
- avoid automatic execution

Use when:

- a new segmentation split is conceptually justified
- the split tests a specific structural pressure
- the target is not a winner claim or origin claim

### Option D — create a non-model documentation summary

Use this if the next value is communication clarity.

Allowed result:

- summarize the Zheji segmentation work for future readers
- explain the meaning/function motivation boundary
- explain why clean schema behavior is not candidate truth
- explain why `.003` and `.004` are both useful
- no model call
- no rerun
- no new artifact

Use when:

- the current documentation is correct but too distributed
- the reader needs one entry point
- the project needs a stable handoff document

### Option E — defer all reruns and switch lanes

Use this if Zheji segmentation has reached a useful stopping point.

Allowed result:

- record deferral
- preserve next possible steps
- move to another Open Instrument lane or maintenance lane
- no model call
- no rerun

Use when:

- the current lane is complete enough
- further local model calls risk overfitting the workflow
- another project area has higher value

## Recommended decision

The recommended next decision is Option B first, then Option D if Option B is unproductive.

Reason:

- The largest remaining comparison weakness is `.002` evidence parity.
- `.002 / STU + DI` is currently report-backed in the inspected evidence set.
- The interpretation loop correctly refused to inflate `.002` into directly comparable JSON-summary-backed evidence.
- Before any new rerun, the professional move is to inspect whether direct `.002` JSON evidence already exists in the repository.
- If it exists, a docs-only note can surface it.
- If it does not exist, a docs-only note can lock the absence and preserve the current evidence-status boundary.
- After that, a non-model summary can make the lane readable.

This recommendation does not authorize a model call.

This recommendation does not authorize a rerun.

This recommendation does not authorize publication framing.

## Required decision record shape

The next decision document should include:

- decision title
- date
- source documents
- selected option
- reason selected
- evidence basis
- rejected options
- boundary
- allowed next action
- forbidden next action
- final decision

## Required source discipline

The decision record must use repository evidence only.

It must not rely on chat memory.

It must not invent missing evidence.

It must not convert report-backed evidence into direct JSON-summary-backed evidence.

It must not treat missing evidence as failure unless the source explicitly says so.

It must preserve the phrase:

`not available in inspected evidence`

when a field is not found.

## Boundary rules

The next decision must preserve these boundaries:

- Open Instrument finds meaning/function motivation, not origin.
- Clean schema behavior is not candidate truth.
- Segmentation cleanliness is not winner evidence.
- Null pressure is diagnostic stress, not failure.
- Finer segmentation is not automatically truer.
- Lower null pressure is not automatic superiority.
- Model calls require separate design, implementation, review, preflight, artifact capture, and review.
- Provider default remains `mock`.

## Forbidden actions

This design forbids:

- model call
- rerun
- artifact JSON creation
- prompt change
- validator change
- schema change
- source implementation
- runtime/API/UI wiring
- provider default change
- OpenAI API use
- origin claim
- winner claim
- candidate-truth claim
- language superiority claim
- model-quality proof
- publication framing

## Next allowed action

After this design lands, create a docs-only decision record:

`docs(open-instrument): record zheji next controlled segmentation decision`

That decision record should choose one primary option.

Recommended primary option:

- Option B — surface directly comparable `.002` JSON evidence

No model call is authorized before that decision record lands.

No rerun is authorized before that decision record lands.

## Final design decision

The next Zheji step should be a controlled documentation decision, not a model run.

The current `.002 / .003 / .004` interpretation loop is closed.

The next decision should either:

- surface directly comparable `.002` JSON evidence if it already exists, or
- explicitly preserve `.002` as report-backed in the current inspected evidence set.

Clean structure remains schema/traceability evidence, not candidate-truth evidence.

No model call is authorized by this design.
