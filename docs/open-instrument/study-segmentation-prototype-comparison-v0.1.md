# Study Segmentation Prototype Comparison v0.1

## Status
- comparison-only
- no model call
- no new Brain output
- no artifact modification
- no runtime wiring
- no prompt change
- no validator change
- no provider default change
- development evidence for the embryo morpheme instrument only

This is development evidence for the embryo morpheme instrument. It is not external origin/truth evidence.

## Purpose
This document compares three Heart-owned `study` segmentation prototypes:

- `study.segmentation.002` = `STU + DI`
- `study.segmentation.003` = `SHTU + DI`
- `study.segmentation.004` = `S + TU + DI`

The goal is to compare structural behavior inside the Open Instrument Heart-Brain pipeline:

- parse behavior;
- validation behavior;
- repair pressure;
- null/unresolved behavior;
- candidate-shape drift;
- stability after normalizer;
- usefulness for the embryo morpheme method.

Do not compare them as historical origin proofs.

## Evidence sources

### `study.segmentation.003`
- [Artifact: `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-003-v0.1.json`](</Users/wei/Desktop/ZËRO /Dwnlosads /zero-firebase-studio-export/docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-003-v0.1.json>)
  - archived prototype payload and validator outcome.
- [Result: `docs/open-instrument/study-heart-brain-qwen3-8b-prototype-result-v0.1.md`](</Users/wei/Desktop/ZËRO /Dwnlosads /zero-firebase-studio-export/docs/open-instrument/study-heart-brain-qwen3-8b-prototype-result-v0.1.md>)
  - review of the clean `SHTU + DI` prototype.

### `study.segmentation.002`
- [Artifact v0.1: `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-002-v0.1.json`](</Users/wei/Desktop/ZËRO /Dwnlosads /zero-firebase-studio-export/docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-002-v0.1.json>)
  - first structural failure for `STU + DI`.
- [Artifact v0.2: `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-002-v0.2.json`](</Users/wei/Desktop/ZËRO /Dwnlosads /zero-firebase-studio-export/docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-002-v0.2.json>)
  - rerun after prompt reinforcement; structurally clean.
- [Result v0.1: `docs/open-instrument/study-heart-brain-qwen3-8b-segmentation-002-result-v0.1.md`](</Users/wei/Desktop/ZËRO /Dwnlosads /zero-firebase-studio-export/docs/open-instrument/study-heart-brain-qwen3-8b-segmentation-002-result-v0.1.md>)
  - first-run diagnostic record.
- [Result v0.2: `docs/open-instrument/study-heart-brain-qwen3-8b-segmentation-002-result-v0.2.md`](</Users/wei/Desktop/ZËRO /Dwnlosads /zero-firebase-studio-export/docs/open-instrument/study-heart-brain-qwen3-8b-segmentation-002-result-v0.2.md>)
  - clean rerun record.

### `study.segmentation.004`
- [Artifact failure: `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-004-v0.1.json`](</Users/wei/Desktop/ZËRO /Dwnlosads /zero-firebase-studio-export/docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-004-v0.1.json>)
  - early negative prototype for `S + TU + DI`.
- [Failure review: `docs/open-instrument/study-segmentation-004-prototype-failure-review-v0.1.md`](</Users/wei/Desktop/ZËRO /Dwnlosads /zero-firebase-studio-export/docs/open-instrument/study-segmentation-004-prototype-failure-review-v0.1.md>)
  - narrow null-candidate traceability diagnosis.
- [Controlled retry artifact: `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-06-study-heart-brain-llama3-1-8b-segmentation-004-controlled-retry-after-enum-repair-v0.1.json`](</Users/wei/Desktop/ZËRO /Dwnlosads /zero-firebase-studio-export/docs/open-instrument/artifacts/heart-brain-prototype/2026-06-06-study-heart-brain-llama3-1-8b-segmentation-004-controlled-retry-after-enum-repair-v0.1.json>)
  - fresh local retry after enum repair.
- [Controlled retry result: `docs/open-instrument/study-segmentation-004-controlled-llama-retry-after-enum-repair-result-v0.1.md`](</Users/wei/Desktop/ZËRO /Dwnlosads /zero-firebase-studio-export/docs/open-instrument/study-segmentation-004-controlled-llama-retry-after-enum-repair-result-v0.1.md>)
  - clean normalized result reviewed by PR #1216.
- [Controlled retry review: `docs/open-instrument/study-segmentation-004-controlled-llama-retry-after-enum-repair-review-v0.1.md`](</Users/wei/Desktop/ZËRO /Dwnlosads /zero-firebase-studio-export/docs/open-instrument/study-segmentation-004-controlled-llama-retry-after-enum-repair-review-v0.1.md>)
  - review confirming the controlled retry is structurally clean after normalization.

## Segmentation summaries

### `study.segmentation.003` — `SHTU + DI`
- Model/provider documented: `qwen3:8b` on local Ollama via an OpenAI-compatible endpoint.
- Parse status: `true`.
- Validation status: `true`.
- Validation issue count: `0`.
- Candidate/null coverage: `checked candidates: 4`, `checked null candidates: 1`, `covered chunks: SHTU, DI`, `missing chunks: none`.
- Repair required: no structural repair required.
- Key structural notes:
  - clean baseline for the `study` line;
  - `SHTU` already carried a structurally cleaner split than later `.004`;
  - `DI` still brought normal short-chunk false-positive pressure, but not enough to break validation;
  - useful as the strongest early structural baseline.

### `study.segmentation.002` — `STU + DI`
- Model/provider documented: `qwen3:8b` on local Ollama via an OpenAI-compatible endpoint.
- First run parse status: `true`.
- First run validation status: `false`.
- First run validation issue count: `13`.
- Rerun parse status: `true`.
- Rerun validation status: `true`.
- Rerun validation issue count: `0`.
- Candidate/null coverage:
  - first run: `checked candidates: 4`, `checked null candidates: 2`, `covered chunks: STU, DI`, `missing chunks: -`.
  - rerun: `checked candidates: 2`, `checked null candidates: 2`, `covered chunks: STU, DI`, `missing chunks: -`.
- Repair required:
  - yes, on the first run;
  - prompt reinforcement fixed the structural enum / segmentation contract drift on rerun.
- Key structural notes:
  - first run failed due to candidate enum drift and a segmentationId mismatch on a candidate/null path;
  - the rerun passed cleanly after prompt reinforcement;
  - `STU + DI` is closer to visible spelling than `SHTU + DI`, but that did not automatically make it structurally stronger on the first try.

### `study.segmentation.004` — `S + TU + DI`
- Model/provider documented:
  - early prototype: `qwen3:8b` on local Ollama via an OpenAI-compatible endpoint;
  - controlled retry: `llama3.1:8b` on local Ollama via an OpenAI-compatible endpoint.
- Early parse status: `true`.
- Early validation status: `false`.
- Early validation issue count: `2`.
- Controlled retry parse status: `true`.
- Controlled retry normalization status: `applied`.
- Controlled retry validation status: `true`.
- Controlled retry validation issue count: `0`.
- Controlled retry candidate/null coverage:
  - repaired count: `18`;
  - unresolved count: `0`;
  - object-wrapper repair count: `18`;
  - object-wrapper unresolved count: `0`.
- Repair required:
  - yes;
  - the early prototype failed narrow null-candidate traceability;
  - the controlled retry passed only after enum repair plus normalization.
- Key structural notes:
  - `.004` created the highest repair pressure because the split is the most granular;
  - the early failure was narrowly traceable to null-candidate segmentationId handling;
  - the later controlled retry shows the same segmentation can become structurally clean under the fixed normalization boundary;
  - the segment therefore has the most sensitive repair path and the most value for testing boundary discipline.

## Comparison reading

Structural ranking by ease of validation:

1. `study.segmentation.003` — clean baseline.
2. `study.segmentation.002` — failed first, then passed after prompt reinforcement.
3. `study.segmentation.004` — failed first, then passed only after explicit enum repair / normalization and a controlled retry.

What the progression shows:

- `003` establishes that the pipeline can be structurally clean on an earlier split.
- `002` shows that prompt reinforcement can fix a structural drift problem on rerun.
- `004` shows the hardest case: repair pressure, null-candidate traceability pressure, and then clean recovery under the runtime boundary.
- Normalization is useful when the model emits a recoverable object-wrapper drift.
- Validation remains strict; the boundary is not a validator softening path.
- The most granular split gives the most useful stress test for the embryo morpheme instrument.

Candidate-shape drift:

- present in `002` first run;
- present in `004` early failure;
- absent in `003`;
- resolved in the controlled `004` retry after normalization.

Null/unresolved behavior:

- `003` had one null candidate and zero validation issues;
- `002` moved from two-null / 13-issue failure to clean rerun;
- `004` early failure exposed null-candidate traceability pressure;
- controlled `004` retry ended with zero unresolved enum entries after normalization.

Repair pressure:

- lowest in `003`;
- moderate in `002`;
- highest in `004`.

## What this proves
- The three `study` segmentation prototypes are structurally comparable inside the Open Instrument pipeline.
- The Heart-Brain instrument can show a progression from clean baseline, to prompt-reinforced recovery, to controlled normalization-based recovery.
- The runtime boundary and enum normalizer are useful for preserving strict validation without weakening the validator.
- The controlled local-provider path can produce structurally clean development evidence under fixed contracts.

## What this does not prove
- It does not prove historical origin.
- It does not prove candidate meanings are true.
- It does not prove the embryo morpheme theory.
- It does not prove local llama is generally reliable.
- It does not prove the prompt is optimal.
- It does not prove that all future words or segmentations will behave the same.
- It does not justify language expansion yet.

## Claim boundary
- development evidence for the embryo morpheme instrument only
- comparison-only
- not external origin/truth evidence
- not scientific evidence
- not publication evidence
- not eval evidence
- not Cohort evidence
- not model-quality evidence
- not reason to change the default provider from `mock`

## Completion definition
This comparison is complete when:

- source documents are recorded with exact repo paths;
- the three segmentation summaries are present;
- parse and validation behavior are compared;
- repair pressure is compared;
- null/unresolved behavior is compared;
- candidate-shape drift is compared;
- normalizer stability is compared;
- usefulness for the embryo morpheme method is explicitly bounded;
- historical origin is explicitly excluded;
- local validation passes.

