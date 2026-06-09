# Study Segmentation 004 Zheji Segmentation-Traceability-Hardened Rerun Review v0.1

## Purpose

This document reviews PR #1259:

`docs(open-instrument): archive zheji study004 segmentation traceability hardened rerun artifact`

This is an artifact review.

No model call is made in this review.

No artifact is created in this review.

No prompt, helper, validator, runtime, API, UI, provider, Cohort, eval, or VoiceLab code is changed in this review.

## Reviewed artifact

PR #1259 archived one controlled local model-call artifact and companion report.

Merge SHA:

- `bf26f626`

Artifact:

- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-09-study-heart-brain-llama3-1-8b-segmentation-004-zheji-segmentation-traceability-hardened-rerun-v0.1.json`

Report:

- `docs/open-instrument/study-segmentation-004-zheji-segmentation-traceability-hardened-rerun-result-v0.1.md`

## Fixed input

- word: `study`
- segmentationId: `study.segmentation.004`
- chunks: `S + TU + DI`
- word-level voice path: `U → I`

## Provider path

- provider: `openai_compat`
- model: `llama3.1:8b`
- endpoint: `http://localhost:11434/v1/chat/completions`
- model call made: `true`
- attempt count: `1`
- provider HTTP status: `200`
- OpenAI API used: `false`
- provider default changed: `false`

## Result

Classification:

- `CLEAN_ZHEJI_SEGMENTATION_TRACEABILITY_HARDENED_REPLAY`

Status:

- `clean`

Validation:

- raw parse ok: `true`
- forbidden raw field found: `false`
- structural ok: `true`
- structural issue count: `0`
- enrichment ok: `true`
- enrichment warning count: `0`
- valid transparency candidate count: `3`
- missing transparency count: `0`

Summary:

- candidate count: `3`
- null candidate count: `3`
- semantic function motivation only: `true`

## What improved

The prior `.004 / S + TU + DI` hardening sequence exposed and then repaired multiple local-model pressure points.

Previously stabilized:

- top-level Brain skeleton
- absence of top-level `candidates`
- absence of Brain-authored `transparencyContrast`
- absence of Brain-authored `transparencyContrastNote`
- `semanticTransparency.level` enum pressure
- candidate payload completion
- candidate-level `segmentationId` traceability

This artifact shows all of those currently survive together in one controlled local run.

## What this artifact proves

This artifact proves that the current hardened prompt contract can produce a structurally clean `.004 / S + TU + DI` Heart-Brain output under the local `llama3.1:8b` path.

It proves:

- raw JSON parsed
- required top-level fields survived
- forbidden raw fields stayed absent
- non-null candidate payload fields were present
- candidate-level `segmentationId` values were present and exact
- Zheji semantic transparency enrichment was present
- no structural issues were emitted
- no enrichment warnings were emitted

## What this artifact does not prove

This artifact does not prove origin.

This artifact does not prove history.

This artifact does not prove linguistic ownership.

This artifact does not prove candidate truth.

This artifact does not prove language superiority.

This artifact does not prove final model quality.

This artifact does not justify changing provider default from `mock`.

This artifact does not justify publication framing by itself.

## Important review note

This is contract-clean evidence, not final scientific evidence.

The Brain was operating inside a heavily constrained prompt contract with doctrine hints and fixed Heart input.

That is acceptable for the current Open Instrument lane because the goal is to harden the Heart-to-Brain schema/protocol.

It must not be overstated as independent linguistic proof.

## Claim boundary

Open Instrument remains a meaning/function motivation instrument.

It is not an etymology engine.

It does not find origin.

It does not declare a winner.

It records which language candidates can motivate the meaning/function of embryo morphemes through a language's own smallest meaningful units.

## Review decision

The PR #1259 artifact is accepted as a clean schema/traceability milestone.

The artifact is suitable to enter the segmentation comparison lane after this review is merged.

## Next allowed action

After this review PR lands, the next allowed action is a design PR for the `.002 / .003 / .004` segmentation comparison.

Suggested next PR:

`docs(open-instrument): design zheji study002-study003-study004 segmentation comparison`

No repeat, expansion, or publication framing should happen before that comparison design lands.

## Final review outcome

The segmentation-traceability-hardened `.004 / S + TU + DI` artifact is clean.

The next lane is controlled comparison design, not another rerun.
