# Zheji Study003-to-004 Segmentation Comparison Gate v0.1

## Purpose

This document defines the gate before any new Zheji `.004 / S + TU + DI` replay.

It compares the now-stable `.003 / SHTU + DI` reinforced path against the planned harder `.004 / S + TU + DI` path.

This is a gate document only.

It does not run a model.

It does not create an artifact.

It does not modify source code.

It does not change provider defaults.

It does not start `.004`.

## Current accepted baseline

The accepted stable baseline is:

- word: `study`
- segmentationId: `study.segmentation.003`
- chunks: `SHTU + DI`
- voice path: `U → I`

Accepted evidence:

- PR #1237: `CLEAN_ZHEJI_REINFORCED_REPLAY`
- PR #1238: `CLEAN_ZHEJI_REINFORCED_REPEAT`
- PR #1239: `.003 / SHTU + DI` stability review

Decision from PR #1239:

- `.003 / SHTU + DI` is structurally stable under the reinforced Zheji output skeleton.

## Planned hard-case target

The planned hard-case target is:

- word: `study`
- segmentationId: `study.segmentation.004`
- chunks: `S + TU + DI`
- expected voice path: `U → I` at word-level, with chunk-level pressure increased by the extra split

This target is harder because it increases the number of Heart-approved chunks from two to three.

The extra chunk creates more schema surface area:

- one more required candidate or null-candidate coverage path;
- one more chance for chunk drift;
- one more chance for null-candidate traceability failure;
- one more chance for explanation-field omission;
- one more chance for output skeleton collapse.

## Why `.004` cannot run directly

`.003` stability does not automatically make `.004` safe.

`.004 / S + TU + DI` has previous historical pressure in the project:

- more granular segmentation exposed null-candidate traceability pressure;
- previous `.004` attempts carried schema failures;
- local-provider `.004` runs have produced operational and validation pressure;
- chunk count is higher than `.003`;
- candidate/null-candidate coverage is more fragile.

Therefore `.004` needs a defined gate before any new model call.

## What changed from `.003` to `.004`

### `.003`

- chunks: `SHTU + DI`
- two chunks
- `SHTU` is a soft comparison variant of `STU`
- `DI` is a final Y-to-I comparison variant of `DY`
- now structurally stable under reinforced skeleton

### `.004`

- chunks: `S + TU + DI`
- three chunks
- closer to visible spelling
- harder candidate coverage
- higher null-candidate risk
- higher schema-pressure risk
- must preserve strict Brain skeleton under more chunk pressure

## Required reinforced skeleton

Any future `.004` replay must preserve the same reinforced skeleton discipline from PR #1236.

The output must include top-level:

- `word`
- `segmentationId`
- `chunkCandidates`
- `nullCandidates`
- `warnings`
- `claimBoundary`

The output must not use top-level:

- `candidates`

The output must not let Brain author:

- `transparencyContrast`
- `transparencyContrastNote`

The output must not:

- score candidates
- rank candidates
- choose a winner
- claim origin
- claim historical truth
- mutate `candidateType`

## Required `.004` fixed input contract

If a future `.004` replay is approved, the fixed input must be:

- word: `study`
- segmentationId: `study.segmentation.004`
- chunks:
  - `S`
  - `TU`
  - `DI`

Brain must not change:

- `study` to another word;
- `study.segmentation.004` to another segmentationId;
- `S + TU + DI` to another chunk split;
- `S` to `SH`;
- `TU` to `STU`;
- `DI` to `D + I`;
- `.004` back to `.003`.

## Required candidate coverage

Every Heart-approved `.004` chunk must be represented.

The chunks are:

- `S`
- `TU`
- `DI`

For each chunk, Brain must return at least one of:

- a valid non-null candidate in `chunkCandidates`;
- a valid null-candidate record in `nullCandidates`.

No chunk may disappear.

No candidate may use a chunk outside the fixed Heart-approved set.

## Required non-null candidate fields

Every non-null candidate in `chunkCandidates` must preserve the existing Brain candidate schema.

Required fields include:

- `chunk`
- `segmentationId`
- `language`
- `candidateForm`
- `meaning`
- `functionFit`
- `sourceNote`
- `evidenceType`
- `candidateType`
- `falseFriendRisk`
- `nullCandidate`
- `notes`

For non-null candidates:

- `nullCandidate` must be `false`;
- `segmentationId` must equal `study.segmentation.004`;
- `chunk` must be one of `S`, `TU`, `DI`;
- `candidateType` must use the current repo-accepted enum value set;
- Zheji enrichment must not mutate `candidateType`.

## Required null-candidate fields

Every null-candidate record in `nullCandidates` must preserve traceability.

Required fields include:

- `chunk`
- `segmentationId`
- `language`
- `candidateForm`
- `meaning`
- `functionFit`
- `sourceNote`
- `evidenceType`
- `candidateType`
- `falseFriendRisk`
- `nullCandidate`
- `notes`

For null candidates:

- `nullCandidate` must be `true`;
- `candidateType` must be `null_candidate`;
- `segmentationId` must equal `study.segmentation.004`;
- `chunk` must be one of `S`, `TU`, `DI`;
- explanation fields must not be omitted.

## Zheji enrichment rules

Zheji fields remain additive.

They must not replace the structural Brain candidate schema.

Non-null candidates should include:

- `analysisLayers`
- `semanticTransparency`

If enrichment is missing while the base Brain schema is valid, classify as enrichment warning, not structural collapse.

If `semanticTransparency.decomposition` is uncertain, use an empty array.

Do not use:

- `decomposition: null`

Missing or partial Zheji enrichment must never be a reason to drop:

- `chunkCandidates`
- `nullCandidates`
- `warnings`
- `claimBoundary`
- candidate structural fields

## Derived contrast rules

`transparencyContrast` remains derived.

It must be computed after raw parse and validation.

Brain must not return it.

The post-processor may compute it from valid present `semanticTransparency.level` values.

The post-processor must not:

- choose a winner;
- infer origin;
- mutate `candidateType`;
- treat null candidates as transparency evidence.

If `.004` returns valid structure but partial enrichment, derived contrast may be partial or unavailable.

## Provider rule

Provider default remains:

- `mock`

Any future `.004` model call must be explicit local-provider replay only.

Allowed local replay path, if approved later:

- provider: `openai_compat`
- model: `llama3.1:8b`
- endpoint: `http://localhost:11434/v1/chat/completions`

This gate does not approve a provider default change.

This gate does not approve non-local provider use.

## Success criteria for future `.004` replay

A future `.004` replay may be considered clean only if:

- raw parse ok: `true`;
- top-level `word` equals `study`;
- top-level `segmentationId` equals `study.segmentation.004`;
- top-level `chunkCandidates` exists and is an array;
- top-level `nullCandidates` exists and is an array;
- top-level `warnings` exists and is an array;
- top-level `claimBoundary` exists and is an object;
- top-level `candidates` is absent;
- every Heart-approved chunk is covered by candidate or null candidate;
- all non-null candidates preserve required Brain fields;
- all null candidates preserve required traceability fields;
- forbidden raw fields are absent;
- structural issue count is `0`;
- provider default changed is `false`;
- OpenAI API used is `false`;
- model call count is exactly `1`.

## Acceptable warning outcome

A future `.004` replay may still be useful if:

- structural validation passes;
- enrichment has warnings;
- derived contrast is partial or unavailable;
- claim boundary remains intact.

In that case, classification should distinguish:

- structural clean result with enrichment warnings

This must not be confused with a fully clean Zheji replay.

## Hard failure criteria

A future `.004` replay must be treated as structural failure if:

- raw parse fails;
- top-level `candidates` replaces `chunkCandidates`;
- `chunkCandidates` is missing;
- `nullCandidates` is missing;
- `warnings` is missing;
- `claimBoundary` is missing;
- any chunk among `S`, `TU`, `DI` has no candidate or null-candidate coverage;
- any candidate uses the wrong segmentationId;
- any candidate uses a chunk outside `S`, `TU`, `DI`;
- any required Brain candidate field is missing;
- `candidateType` is missing or invalid;
- `candidateType` is changed because of Zheji transparency;
- Brain returns `transparencyContrast`;
- Brain returns `transparencyContrastNote`;
- Brain scores, ranks, declares winner, or claims origin.

## Stop rules before future `.004` model call

Before any future `.004` model call, stop if:

- repo is dirty;
- branch is not the intended artifact branch;
- old target artifact path already exists;
- `llama3.1:8b` is unavailable;
- reinforced skeleton anchors are missing;
- plan-only runner does not prove the skeleton is present;
- provider default is not `mock`;
- source files changed unexpectedly;
- runtime/API/UI files changed;
- artifact path conflicts with old evidence.

## Recommended future artifact naming

If the gate is merged and `.004` is later approved, use separate artifact/report names.

Recommended artifact path:

- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-08-study-heart-brain-llama3-1-8b-segmentation-004-zheji-reinforced-replay-v0.1.json`

Recommended report path:

- `docs/open-instrument/study-segmentation-004-zheji-reinforced-replay-result-v0.1.md`

Do not overwrite older `.004` artifacts.

Do not overwrite `.003` artifacts.

## Review requirement after future `.004`

A future `.004` artifact must be reviewed in a separate PR before any next action.

The review must compare `.004` against the stable `.003` baseline.

The review must decide whether `.004` is:

- clean;
- structurally valid with enrichment warnings;
- structural failure;
- operational failure;
- not comparable.

## Claim boundary

This gate is development-only.

It is not external origin/truth evidence.

It is not historical origin proof.

It is not candidate truth proof.

It is not model-quality evidence.

It is not language superiority evidence.

It is not a reason to change provider default from `mock`.

It does not declare a winner.

It does not declare origin.

It does not modify `candidateType`.

It does not approve `.004` execution by itself.

## Gate decision

Decision:

- `.003 / SHTU + DI` is the accepted stable baseline.
- `.004 / S + TU + DI` is the next hard-case segmentation target.
- `.004` remains blocked until this gate is reviewed and merged.
- After this gate lands, a separate `.004` replay plan or artifact task may be prepared.
- The future `.004` task must still use one explicit local model call only if all preflight checks pass.

## Recommended next PR after this gate

Recommended next PR after this gate lands:

`docs(open-instrument): plan zheji study004 reinforced replay`

Purpose:

- define exact `.004 / S + TU + DI` replay plan;
- lock artifact/report paths;
- lock preflight and stop rules;
- lock classification names;
- keep provider default `mock`;
- still no model call in the planning PR.

Only after that plan PR lands should the actual `.004` artifact capture be considered.
