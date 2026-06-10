# Zheji Study Segmentation Contrast Matrix v0.2 Review v0.1

## Status

Type: documentation review

This document reviews PR #1274:

- `docs(open-instrument): update zheji segmentation contrast matrix with study002 direct evidence`

PR #1274 merge SHA:

- `ddb322d1`

No model call is made.

No rerun is made.

No artifact JSON is created.

No source, runtime, API, UI, prompt, validator, provider, or schema behavior is changed.

## Reviewed file

PR #1274 added:

- `docs/open-instrument/zheji-study-segmentation-contrast-matrix-v0.2.md`

## Source chain reviewed

The review checks the v0.2 matrix against:

- `docs/open-instrument/zheji-study-segmentation-contrast-matrix-v0.1.md`
- `docs/open-instrument/zheji-study-segmentation-contrast-matrix-review-v0.1.md`
- `docs/open-instrument/study-segmentation-002-zheji-direct-json-evidence-review-v0.1.md`

## Review decision

The PR #1274 v0.2 matrix is accepted.

The update correctly changes `.002 / STU + DI` from merely report-backed to direct-artifact-backed after PR #1273.

The update correctly preserves the conservative evidence boundary.

The update does not promote `.002` to clean parity.

The update does not create origin, winner, candidate-truth, language superiority, model-quality, provider-default, or publication claims.

## Evidence-status review

The v0.2 matrix correctly records that `.002 / STU + DI` is now direct-artifact-backed for reviewed evidence.

This is appropriate because PR #1273 reviewed direct `.002` v0.1 and v0.2 JSON evidence.

The v0.2 matrix correctly avoids saying that direct-artifact-backed means clean parity.

Direct artifact evidence means the lane is now directly inspectable.

It does not mean the lane is clean.

It does not mean the lane is true.

It does not mean the lane wins.

## `.002 / STU + DI` review

The `.002 / STU + DI` lane is handled correctly.

Accepted points:

- `.002` is now direct-artifact-backed.
- v0.1 remains repair predecessor.
- v0.1 candidate-level drift remains visible.
- `study.segment,002` remains visible.
- v0.2 remains reviewed direct evidence.
- v0.2 is not inflated into full clean-parity proof.

This is the correct professional posture.

## v0.1 repair-history review

The v0.2 matrix correctly preserves v0.1 repair history.

The known drift remains visible:

- `study.segment,002`

This matters because repair history is evidence.

The matrix does not erase the drift.

The matrix does not flatten v0.1 and v0.2 into one clean lane.

The matrix does not pretend that v0.2 makes v0.1 irrelevant.

## v0.2 evidence review

The v0.2 matrix correctly treats `.002` v0.2 as reviewed direct evidence.

The matrix also correctly avoids overclaiming v0.2 as full clean parity.

This is necessary because PR #1273 did not confirm structural issue count zero and enrichment warning count zero from inspected artifact fields.

Therefore v0.2 can support direct-evidence status.

It cannot support clean-parity status.

## `.003 / SHTU + DI` review

The v0.2 matrix correctly preserves `.003 / SHTU + DI` as the stable clean reinforced baseline.

This lane remains the stable baseline for comparison.

The matrix does not claim that `.003` is origin.

The matrix does not claim that `.003` is the winner.

The matrix does not claim candidate truth from `.003` cleanliness.

## `.004 / S + TU + DI` review

The v0.2 matrix correctly preserves `.004 / S + TU + DI` as the clean fine-grained segmentation-traceability-hardened hard-case.

The matrix correctly keeps `.004` higher null pressure and higher traceability pressure as diagnostic stress, not failure.

The matrix does not claim that finer segmentation is truer.

The matrix does not claim that higher null pressure makes `.004` worse.

The matrix does not claim candidate truth from `.004` cleanliness.

## Matrix comparison review

The v0.2 matrix keeps the correct contrast structure:

- `.002 / STU + DI`: direct-artifact-backed, repair history preserved, not clean parity
- `.003 / SHTU + DI`: stable clean reinforced baseline
- `.004 / S + TU + DI`: clean fine-grained hard-case

This is a useful comparison.

It is still an evidence-status comparison.

It is not a historical-origin comparison.

It is not a truth comparison.

It is not a winner comparison.

## Boundary review

The v0.2 matrix correctly forbids:

- model call
- rerun
- new artifact JSON capture
- prompt change
- validator change
- schema change
- source implementation
- runtime/API/UI wiring
- provider default change
- OpenAI API use
- publication framing
- origin claim
- winner claim
- candidate-truth claim
- language superiority claim
- model-quality proof

## Missing-value and anti-overclaim review

The v0.2 matrix preserves missing-value discipline.

The matrix does not invent uninspected values.

The matrix does not fill unknown structural or enrichment fields with clean values.

The matrix does not convert direct evidence into clean evidence.

The matrix does not convert clean structure into candidate-truth evidence.

Clean structure remains schema/traceability evidence, not candidate-truth evidence.

## Accepted result

The PR #1274 matrix update is accepted.

Accepted statements:

- `.002 / STU + DI` is now direct-artifact-backed for reviewed evidence.
- `.002 / STU + DI` is not promoted to clean parity.
- v0.1 repair history remains visible.
- `study.segment,002` remains visible.
- v0.2 reviewed-direct-evidence status remains conservative.
- `.003 / SHTU + DI` remains the stable clean reinforced baseline.
- `.004 / S + TU + DI` remains the clean fine-grained hard-case.
- Clean structure remains schema/traceability evidence, not candidate-truth evidence.

## Rejected statements

This review rejects:

- `.002` is now clean.
- `.002` has clean parity with `.003` and `.004`.
- `.002` is origin.
- `.002` is winner.
- `.002` is candidate truth.
- v0.2 erases v0.1 repair history.
- v0.2 proves all `.002` issues are resolved.
- `.003` is better because it has lower null pressure.
- `.004` is better because it is more granular.
- `.004` is worse because it has higher null pressure.
- Any clean lane proves historical truth.

## Next required step

The next PR should be docs-only:

- `docs(open-instrument): design zheji study002 repair lineage note`

That design should define how to document:

- `.002` v0.1 as repair predecessor
- the `study.segment,002` candidate-level drift
- `.002` v0.2 as reviewed direct evidence
- the difference between direct-artifact-backed and clean-parity evidence
- the relationship between `.002`, `.003`, and `.004` without origin or winner claims

No model call is authorized by this review.

No rerun is authorized by this review.

## Final review decision

The updated Zheji study segmentation contrast matrix v0.2 is accepted.

The matrix now correctly incorporates PR #1273 direct `.002` evidence.

The matrix preserves `.002` repair history.

The matrix preserves conservative interpretation boundaries.

The matrix does not overclaim clean parity.

The matrix does not introduce origin, winner, candidate-truth, language superiority, model-quality, provider-default, or publication claims.
