# Zheji Generalization Layer 2 Target-Grid Execution Scope v0.1

Status: LAYER2_TARGET_GRID_EXECUTION_SCOPE_DEFINED.

Scope date: 2026-06-23.

Base:

* Short SHA: `1b04ccb1`
* Full SHA: `1b04ccb1c3d25ea69558d2c3b05ee530d35a5d0b`
* Subject: `docs(open-instrument): review Layer 2 chunk-language target grid scaffold implementation v0.1`

Scaffold:

* `scripts/openInstrumentLayer2ChunkLanguageTargetGrid.v0.1.mjs`
* `tests/openInstrument.layer2ChunkLanguageTargetGrid.scaffold.v0.1.spec.ts`

## Purpose

This document defines the exact future execution scope for the Layer 2 `comic` target-grid replay.

It does not execute the target grid.

It does not call a provider.

It does not call a model.

It does not mutate an artifact.

## Reviewed request

Word:

* `comic`

Stage:

* `MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`

Segmentation:

* `COM + IC`

Source language:

* `English`

## Reviewed target grid

The future execution must use exactly these target ids:

* `comic::COM::Albanian`
* `comic::COM::Latin`
* `comic::COM::Greek`
* `comic::COM::Sanskrit`
* `comic::IC::Albanian`
* `comic::IC::Latin`
* `comic::IC::Greek`
* `comic::IC::Sanskrit`

No extra target may be added in this execution scope.

No target may be removed in this execution scope.

Do not expand to all allowlisted languages yet.

## Reviewed provider identity for future execution

Provider family:

* `local_only_openai_compatible`

Provider name:

* `ollama_openai_compat`

Model:

* `llama3.1:8b`

Endpoint class:

* `localhost_only`

Endpoint policy:

* localhost-only
* explicit provider only
* no fallback provider
* no automatic provider selection
* no hosted OpenAI endpoint
* no DeepSeek endpoint
* no remote provider endpoint

## Future output artifact

The future execution artifact path must be:

* `docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json`

The future artifact must be development-only.

The future artifact must not be treated as origin evidence, ownership evidence, publication evidence, model-quality evidence, provider-output correctness evidence, or candidate-truth evidence.

## Future execution pass

A future reviewed execution PR may run exactly one target-grid execution pass.

One pass means:

* execute each reviewed target at most once
* no retry loop
* no hidden second provider call
* no target expansion
* no fallback provider
* no automatic provider selection
* no post-hoc candidate repair
* no evidence promotion

## Required per-target request contract

Each target request must include:

* `word`
* `stage`
* `segmentation`
* `chunk`
* `candidateLanguage`
* `sourceLanguage`
* `targetId`

The target request must match the scaffold target object exactly.

## Required per-target response contract

Each target response must include:

* `word`
* `stage`
* `segmentation`
* `chunk`
* `candidateLanguage`
* `candidate`
* `nullAccepted`
* `claimBoundary`

A non-null candidate must include:

* `chunk`
* `language`
* `isolatedStandaloneForm`
* `plainStandaloneDefinitionGloss`
* `notes`

A valid target candidate must satisfy:

* `candidate.chunk` equals the target chunk
* `candidate.language` equals the target candidate language
* `candidate.language` is one of the reviewed seed languages
* `candidate.language` does not equal the source language
* `candidate.isolatedStandaloneForm` does not equal the full input word
* `candidate.plainStandaloneDefinitionGloss` does not merely define the full input word

A valid target null must satisfy:

* `candidate: null`
* `nullAccepted: true`

Null remains valid truth.

## Required aggregate artifact contract

The aggregate artifact must include:

* `schemaVersion`
* `word`
* `stage`
* `segmentation`
* `reviewedExecutionBaseSha`
* `providerIdentity`
* `endpointIdentity`
* `targetGrid`
* `targetResults`
* `aggregateClassification`
* `claimBoundary`

Allowed aggregate classifications:

* `TARGET_GRID_SIGNAL_PRESENT`
* `TARGET_GRID_ALL_NULL_ACCEPTED`
* `TARGET_GRID_DEGENERATE_BLOCKED`
* `TARGET_GRID_PARTIAL_INVALIDATED`
* `TARGET_GRID_EXECUTION_BLOCKED`

## Result interpretation

`TARGET_GRID_SIGNAL_PRESENT` means at least one target returned a valid non-null candidate.

`TARGET_GRID_ALL_NULL_ACCEPTED` means every target returned a valid null.

`TARGET_GRID_DEGENERATE_BLOCKED` means one or more target outputs were blocked as degenerate and no valid signal was promoted.

`TARGET_GRID_PARTIAL_INVALIDATED` means one or more target outputs failed validation or extraction.

`TARGET_GRID_EXECUTION_BLOCKED` means execution did not complete under reviewed conditions.

No classification may be converted into origin proof.

No classification may be converted into publication evidence.

No classification may crown a winner.

## Required implementation before execution

Before any execution PR, a separate implementation PR must add:

* reviewed target-grid execution runner
* provider-call isolation for one target at a time
* per-target prompt builder
* per-target response parser
* aggregate artifact writer
* focused tests
* fail-closed provider identity checks
* fail-closed reviewed execution base checks
* fail-closed output path checks

That implementation PR must not execute the provider.

## Boundary proof

No target-grid execution occurred in this scope PR.

No provider execution occurred in this scope PR.

No model call occurred in this scope PR.

No localhost/Ollama call occurred in this scope PR.

No remote endpoint use occurred in this scope PR.

No hosted OpenAI endpoint use occurred in this scope PR.

No DeepSeek endpoint use occurred in this scope PR.

No artifact mutation occurred in this scope PR.

No source/runtime/API/UI behavior change occurred in this scope PR.

No schema/package/CI change occurred in this scope PR.

No evidence promotion occurred in this scope PR.

No publication framing occurred in this scope PR.

No winner-crowning occurred in this scope PR.

## Next accepted task

`docs(open-instrument): review Layer 2 target-grid execution scope definition v0.1`
