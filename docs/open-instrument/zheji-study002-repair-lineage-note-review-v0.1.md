# Zheji Study002 Repair Lineage Note Review v0.1

## Status

Type: documentation review

This document reviews PR #1277:

- `docs(open-instrument): add zheji study002 repair lineage note`

No model call is made.

No rerun is made.

No artifact JSON is created.

No prompt, validator, source implementation, runtime, API, UI, provider, or schema behavior is changed.

## Reviewed source

The reviewed note is:

- `docs/open-instrument/zheji-study002-repair-lineage-note-v0.1.md`

Supporting source chain:

- `docs/open-instrument/zheji-study002-repair-lineage-note-design-v0.1.md`
- `docs/open-instrument/study-segmentation-002-zheji-direct-json-evidence-review-v0.1.md`
- `docs/open-instrument/zheji-study-segmentation-contrast-matrix-v0.2-review-v0.1.md`

## PR #1277 merge facts

PR #1277 added:

- `docs/open-instrument/zheji-study002-repair-lineage-note-v0.1.md`

PR #1277 merge SHA:

- `6e9badee`

## Review result

The PR #1277 repair lineage note is accepted.

The note correctly documents the `.002 / STU + DI` repair lineage without overclaiming.

It preserves the evidence distinction between:

- direct-artifact-backed evidence
- clean-parity evidence

It keeps the `.002` repair history visible.

It keeps the Open Instrument meaning/function motivation boundary intact.

## Confirmed: `.002 / STU + DI` direct-artifact-backed status

The note correctly states that `.002 / STU + DI` is direct-artifact-backed for reviewed evidence.

This is appropriate after the direct `.002` JSON evidence review.

This is a stronger evidence status than report-backed.

This is still not clean-parity evidence.

Accepted statement:

- `.002 / STU + DI` is direct-artifact-backed documentation evidence.

Rejected inflation:

- direct-artifact-backed does not mean clean
- direct-artifact-backed does not mean complete
- direct-artifact-backed does not mean origin
- direct-artifact-backed does not mean winner
- direct-artifact-backed does not mean candidate truth
- direct-artifact-backed does not mean publication-ready

## Confirmed: v0.1 repair predecessor

The note correctly preserves `.002` v0.1 as a repair predecessor.

This is important because the v0.1 artifact carries visible repair history.

The note does not hide the v0.1 state.

The note does not erase v0.1 after v0.2 appears.

Accepted statement:

- `.002` v0.1 remains a repair predecessor.

Rejected inflation:

- v0.2 does not erase v0.1 repair history
- v0.1 is not clean evidence
- v0.1 is not clean-parity evidence
- v0.1 is not candidate-truth evidence

## Confirmed: `study.segment,002` remains visible

The note correctly preserves the candidate-level drift string:

- `study.segment,002`

This is the right behavior.

The drift should stay visible because it is part of the `.002` repair lineage.

It must not be hidden for readability.

It must not be normalized away inside the documentation note.

It must not be used to erase the `.002` lane.

It must not be used to inflate v0.2 into clean parity.

Accepted statement:

- candidate-level `study.segment,002` drift remains visible.

Rejected statements:

- `study.segment,002` should be hidden
- `study.segment,002` should be erased from the lineage
- `study.segment,002` proves `.002` is unusable
- `study.segment,002` proves v0.2 has clean parity

## Confirmed: v0.2 reviewed direct evidence

The note correctly treats `.002` v0.2 as reviewed direct evidence.

That is the correct conservative status.

The note does not over-promote v0.2.

The note does not claim v0.2 creates clean parity.

The note does not claim v0.2 proves origin, winner, or candidate truth.

Accepted statement:

- `.002` v0.2 remains reviewed direct evidence.

Rejected inflation:

- v0.2 is not origin evidence
- v0.2 is not winner evidence
- v0.2 is not candidate-truth evidence
- v0.2 is not publication evidence
- v0.2 is not provider-quality evidence
- v0.2 is not automatic clean parity

## Confirmed: `.002` is not clean-parity evidence

The note correctly states:

- `.002 / STU + DI` is direct-artifact-backed, not clean-parity evidence.

This distinction is central.

The updated matrix v0.2 allowed `.002` to move beyond report-backed status.

It did not authorize clean parity.

The note correctly preserves that boundary.

Accepted statement:

- `.002` is not promoted to clean parity.

Rejected statements:

- `.002` is clean
- `.002` has clean parity
- direct-artifact-backed means clean
- direct-artifact-backed means historically true
- direct-artifact-backed means candidate truth

## Confirmed relationship to `.003 / SHTU + DI`

The note correctly preserves `.003 / SHTU + DI` as the stable clean reinforced baseline.

It does not claim `.003` is origin.

It does not claim `.003` is winner.

It does not claim `.003` is candidate truth.

It does not claim `.003` has language superiority.

Accepted statement:

- `.003 / SHTU + DI` remains the stable clean reinforced baseline.

Rejected inflation:

- `.003` wins because it is cleaner
- `.003` is origin
- `.003` is candidate truth
- `.003` proves historical truth

## Confirmed relationship to `.004 / S + TU + DI`

The note correctly preserves `.004 / S + TU + DI` as the clean fine-grained hard-case.

It correctly treats higher pressure as diagnostic stress, not automatic failure.

It does not claim `.004` is origin.

It does not claim `.004` is winner.

It does not claim `.004` is candidate truth.

Accepted statement:

- `.004 / S + TU + DI` remains the clean fine-grained hard-case.

Rejected inflation:

- `.004` wins because it is finer
- `.004` fails because it has higher null pressure
- `.004` is origin
- `.004` is candidate truth
- finer segmentation is automatically truer

## Confirmed interpretation boundary

The note correctly preserves the Open Instrument meaning/function motivation boundary.

It does not claim:

- origin
- etymology
- winning segmentation
- candidate truth
- language superiority
- model quality
- provider default change
- publication framing

It does not authorize:

- model call
- rerun
- artifact creation
- prompt change
- validator change
- source implementation change
- runtime change
- API change
- UI change

## Confirmed missing-value discipline

The note preserves missing-value discipline.

It does not fill unknown fields with assumptions.

It does not infer clean parity from direct artifact presence.

It does not infer structural cleanliness from matrix convenience.

It does not infer candidate truth from schema cleanliness.

It does not infer historical truth from direct evidence.

## Review decision

The PR #1277 repair lineage note is accepted.

It correctly documents `.002 / STU + DI` as direct-artifact-backed documentation evidence.

It correctly preserves `.002` v0.1 as repair predecessor.

It correctly preserves `study.segment,002`.

It correctly treats `.002` v0.2 as reviewed direct evidence.

It correctly refuses to promote `.002` to clean parity.

It correctly keeps direct-artifact-backed separate from clean-parity evidence.

It correctly preserves `.003 / SHTU + DI` as the stable clean reinforced baseline.

It correctly preserves `.004 / S + TU + DI` as the clean fine-grained hard-case.

Clean structure remains schema/traceability evidence, not candidate-truth evidence.

## Final decision

The `.002 / STU + DI` repair lineage note is accepted.

The `.002` repair lineage loop is now review-complete.

No model call is authorized by this review.

No rerun is authorized by this review.

No source/runtime/provider/API/UI/prompt/validator change is authorized by this review.

## Next required step

After this review lands, create one docs-only closure PR:

- `docs(open-instrument): close zheji study002 repair lineage lane`

That closure PR should summarize the completed `.002` repair-lineage loop and explicitly stop further `.002` repair-lineage work unless new direct evidence is intentionally surfaced in a separate design PR.
