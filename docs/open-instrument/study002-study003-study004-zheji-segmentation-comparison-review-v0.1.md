# Zheji Study002 Study003 Study004 Segmentation Comparison Review v0.1

## Purpose

This document reviews PR #1262:

`docs(open-instrument): compare zheji study002 study003 study004 segmentations`

This is a review document only.

No model call is made.

No artifact is created.

No prompt, validator, source, runtime, API, UI, provider, eval, Cohort, or VoiceLab code is changed.

## Reviewed source

PR #1262 added:

- `docs/open-instrument/study002-study003-study004-zheji-segmentation-comparison-v0.1.md`

PR #1262 merge SHA:

- `9bc6db00`

## Review result

The PR #1262 comparison is accepted.

The comparison correctly stays inside the Open Instrument meaning/function motivation boundary.

It compares segmentation behavior.

It does not claim origin.

It does not claim historical proof.

It does not declare a winning segmentation.

It does not claim candidate truth.

It does not claim language superiority.

It does not create publication framing.

It does not change provider default from `mock`.

## Compared segmentations

The comparison covered:

- `study.segmentation.002 / STU + DI`
- `study.segmentation.003 / SHTU + DI`
- `study.segmentation.004 / S + TU + DI`

## Key finding reviewed

The comparison’s main development interpretation is accepted:

- `.003 / SHTU + DI` is currently the stable clean baseline.
- `.004 / S + TU + DI` is the harder fine-grained stress target.
- `.004` became contract-clean only after enum, payload, and segmentation traceability hardening.
- `.004` creates more null-candidate pressure than `.003`.
- `.004` gives finer traceability into smaller embryo units.
- `.002 / STU + DI` remains useful historically, but current comparison treats it as report-backed unless a directly comparable JSON artifact is surfaced.

## Evidence-density note

The `.002` lane is correctly marked as lower evidence density in this comparison.

Reason:

- `.002` is report-backed in the current comparison worksheet.
- The inspection did not surface a directly summarized `.002` JSON artifact equivalent to the `.003` and `.004` artifact summaries.
- The comparison does not invent missing `.002` JSON values.

This is the correct conservative treatment.

## Study003 note

The `.003 / SHTU + DI` lane is correctly treated as the stable clean reinforced Zheji baseline.

The comparison does not overclaim `.003`.

It does not call `.003` the winner.

It does not call `.003` historically true.

It treats `.003` as a clean baseline for contract behavior.

## Study004 note

The `.004 / S + TU + DI` lane is correctly treated as the clean fine-grained hard-case.

The comparison correctly records that `.004` needed additional hardening before clean passage:

- enum/enrichment hardening
- candidate payload hardening
- segmentation traceability hardening

The comparison correctly treats `.004` as schema/traceability evidence, not candidate-truth evidence.

## Boundary review

The comparison correctly rejects:

- origin proof
- historical proof
- candidate truth proof
- language superiority evidence
- provider default change
- winner framing
- publication framing

The comparison correctly allows:

- segmentation behavior comparison
- structural stability comparison
- null-candidate pressure comparison
- candidate payload survival comparison
- segmentation traceability survival comparison
- semantic transparency survival comparison

## Workflow review

The PR followed the expected discipline:

- docs-only comparison
- no model call
- no artifact creation
- no source changes
- no prompt changes
- no validator changes
- no runtime/API/UI wiring
- no provider default change
- no rerun

## Accepted limitation

The comparison has one accepted limitation:

`.002` is less directly comparable than `.003` and `.004` because it is report-backed in this worksheet rather than represented by a directly summarized JSON artifact in the inspected artifact set.

This limitation is explicitly documented and does not invalidate the comparison.

## Next allowed action

After this review lands, the next allowed action is a controlled docs-only design PR for the next comparison layer.

Suggested next PR:

`docs(open-instrument): design zheji segmentation contrast matrix`

That design should decide whether to formalize the comparison into a reusable matrix format.

No model call is allowed by this review.

## Final decision

The PR #1262 comparison worksheet is accepted.

It is a useful documentation comparison of existing evidence.

It remains inside the meaning/function motivation boundary.

It does not authorize a rerun, expansion, provider default change, or publication framing.
