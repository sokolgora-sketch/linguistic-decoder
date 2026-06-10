# Zheji Study002 Study003 Study004 Segmentation Comparison v0.1

## Purpose

This document compares the existing archived evidence for three Heart-approved `study` segmentations:

- `study.segmentation.002`
- `study.segmentation.003`
- `study.segmentation.004`

This is a documentation comparison only.

No model call is made.

No artifact is created.

No prompt, validator, source, runtime, API, UI, provider, eval, Cohort, or VoiceLab code is changed.

This comparison does not declare a winning segmentation.

This comparison does not claim origin.

This comparison does not claim candidate truth.

This comparison does not create publication framing.

## Comparison boundary

This comparison records how different Heart-approved segmentations change Brain candidate behavior for the word `study`.

It does not claim that any segmentation is historically original, linguistically superior, or finally true.

Open Instrument remains a meaning/function motivation instrument.

It is not an etymology engine.

It does not find origin.

It does not declare a winner.

It records which language candidates can motivate the meaning/function of embryo morphemes through a language's own smallest meaningful units.

## Compared segmentations

| Segmentation | Chunk shape | Source status |
|---|---:|---|
| `study.segmentation.002` | `STU + DI` | report-backed reinforced result |
| `study.segmentation.003` | `SHTU + DI` | clean reinforced Zheji baseline |
| `study.segmentation.004` | `S + TU + DI` | clean segmentation-traceability-hardened Zheji hard-case |

## Source set

### Study002 source

Primary source:

- `docs/open-instrument/study-heart-brain-qwen3-8b-segmentation-002-result-v0.2.md`

Inspection note:

- The current artifact JSON summary scan did not surface a direct `.002` JSON artifact in the inspected Heart-Brain artifact directory.
- The `.002` row is therefore report-backed in this comparison.
- Later review documents describe `.002 / STU + DI` v0.2 as structurally passed, but this worksheet does not invent missing JSON fields.

### Study003 source

Primary clean source:

- `docs/open-instrument/study-segmentation-003-zheji-reinforced-replay-result-v0.1.md`

Relevant artifact summaries inspected:

- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-08-study-heart-brain-llama3-1-8b-segmentation-003-zheji-reinforced-replay-v0.1.json`
- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-08-study-heart-brain-llama3-1-8b-segmentation-003-zheji-reinforced-repeat-002-v0.1.json`

### Study004 source

Primary clean source:

- `docs/open-instrument/study-segmentation-004-zheji-segmentation-traceability-hardened-rerun-result-v0.1.md`

Primary artifact:

- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-09-study-heart-brain-llama3-1-8b-segmentation-004-zheji-segmentation-traceability-hardened-rerun-v0.1.json`

## Comparison table

| Segmentation ID | Chunk shape | Artifact/report source | Classification | Status | Structural issue count | Enrichment warning count | Candidate count | Null candidate count | Top-level skeleton survived | Forbidden fields absent | Candidate payload survived | Segmentation traceability survived | Semantic transparency survived | Interpretation | Limitation |
|---|---:|---|---|---|---:|---:|---:|---:|---|---|---|---|---|---|---|
| `study.segmentation.002` | `STU + DI` | `study-heart-brain-qwen3-8b-segmentation-002-result-v0.2.md` | report-backed reinforced result | internal development prototype only | not available in inspected JSON summary | not available in inspected JSON summary | not available in inspected JSON summary | not available in inspected JSON summary | reported as structurally repaired in later docs | not fully comparable from inspected JSON summary | not fully comparable from inspected JSON summary | not fully comparable from inspected JSON summary | not Zheji-equivalent in current comparison source | Coarser spelling-close split; useful as earlier reinforced comparison point | We do not have a directly summarized `.002` JSON artifact in the current inspection output |
| `study.segmentation.003` | `SHTU + DI` | `2026-06-08-study-heart-brain-llama3-1-8b-segmentation-003-zheji-reinforced-replay-v0.1.json` and reinforced repeat | `CLEAN_ZHEJI_REINFORCED_REPLAY` / `CLEAN_ZHEJI_REINFORCED_REPEAT` | clean | `0` in clean report | `0` in clean report | `2` | `0` | yes | yes | yes | yes for reinforced schema lane | yes | Stable clean baseline; larger `SHTU` chunk reduces null pressure | Less granular than `.004`; does not isolate `S` and `TU` |
| `study.segmentation.004` | `S + TU + DI` | `2026-06-09-study-heart-brain-llama3-1-8b-segmentation-004-zheji-segmentation-traceability-hardened-rerun-v0.1.json` | `CLEAN_ZHEJI_SEGMENTATION_TRACEABILITY_HARDENED_REPLAY` | clean | `0` | `0` | `3` | `3` | yes | yes | yes | yes | yes | Hard-case fine split now contract-clean after enum, payload, and segmentation traceability hardening | Generates more null-candidate pressure than `.003`; clean structure does not equal candidate truth |

## Observed behavior

### Study002 behavior

`study.segmentation.002 / STU + DI` is useful as the spelling-close earlier segmentation.

It appears in the historical Open Instrument comparison trail as a reinforced result after an earlier prototype failure.

However, in this worksheet, `.002` is not treated as equivalent to the current `.003` and `.004` Zheji artifact JSON evidence because the current inspection found `.002` primarily through markdown reports.

Therefore `.002` should remain in the comparison, but with lower evidence density.

### Study003 behavior

`study.segmentation.003 / SHTU + DI` is the stable clean Zheji baseline.

It keeps the first embryo morpheme as the larger `SHTU` unit.

Observed behavior:

- clean status
- two candidates
- zero null candidates
- stable reinforced repeat path
- no origin/winner/candidate-truth claim

Interpretation:

- `.003` appears structurally stable.
- `.003` reduces fragmentation pressure by keeping `SHTU` together.
- `.003` is a good baseline for local-model contract stability.

### Study004 behavior

`study.segmentation.004 / S + TU + DI` is the fine-grained hard-case split.

It initially exposed several prompt-contract weaknesses across the Zheji hardening sequence:

- enum/enrichment pressure
- candidate payload completion pressure
- candidate-level segmentation traceability pressure

After the final hardening sequence, the latest `.004` artifact is clean.

Observed behavior:

- clean status
- structural issue count `0`
- enrichment warning count `0`
- candidate count `3`
- null candidate count `3`
- no top-level `candidates`
- no raw Brain `transparencyContrast`
- no raw Brain `transparencyContrastNote`
- provider default unchanged

Interpretation:

- `.004` now survives the hardened contract.
- `.004` creates more traceability demand and null-candidate pressure than `.003`.
- `.004` makes smaller embryo units visible, especially `S` and `TU`.
- The clean result is schema/traceability evidence, not candidate-truth evidence.

## Main comparison finding

The segmentation comparison currently supports this development interpretation:

- `.003 / SHTU + DI` is the stable clean baseline.
- `.004 / S + TU + DI` is the harder fine-grained stress target.
- `.004` became contract-clean only after additional prompt hardening for enum, payload, and segmentation traceability.
- `.004` makes smaller units visible but increases null-candidate pressure.
- `.002 / STU + DI` remains useful historically, but the current comparison must treat it as report-backed unless a directly comparable JSON artifact is surfaced.

## Not a winner result

This comparison does not say `.003` is the winner.

This comparison does not say `.004` is the winner.

This comparison does not say `.002` is the winner.

A cleaner schema result is not a historical truth result.

A finer segmentation is not automatically a truer segmentation.

A lower null-candidate count is not automatically a truer segmentation.

A higher null-candidate count is not automatically a failed segmentation.

## Claim boundary

This comparison is allowed to say:

- `.003` is currently the stable clean baseline.
- `.004` is currently the clean fine-grained hard-case after hardening.
- `.004` pressures the local model more than `.003`.
- `.004` creates more null-candidate pressure.
- `.004` gives better traceability into smaller embryo units.
- `.002` remains useful but less directly comparable from the current inspected JSON set.

This comparison is not allowed to say:

- `.003` proves origin.
- `.004` proves origin.
- `.002` proves origin.
- any segmentation is historically true.
- any segmentation is linguistically superior.
- any candidate is finally true.
- any language owns the word.
- provider default should change from `mock`.

## Next recommended action

The next allowed action is a docs-only review PR for this comparison worksheet.

Suggested next PR:

`docs(open-instrument): review zheji study002 study003 study004 segmentation comparison`

No model call should happen before that review lands.

## Final decision

The `.002 / .003 / .004` segmentation comparison is accepted as a documentation comparison of existing evidence.

The comparison supports a disciplined next step: review the comparison worksheet before any new rerun, expansion, derived contrast implementation, or publication framing.
