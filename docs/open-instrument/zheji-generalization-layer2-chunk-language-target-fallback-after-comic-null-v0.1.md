# Zheji Generalization Layer 2 Chunk-Language Target Fallback After Comic Null v0.1

Status: LAYER2_CHUNK_LANGUAGE_TARGET_FALLBACK_DEFINED_AFTER_COMIC_NULL.

Definition date: 2026-06-23.

Base:

* Short SHA: `42d70f6f`
* Full SHA: `42d70f6f8ab1d2433ac972ea5d0846b8428ee914`
* Subject: `docs(open-instrument): review comic rerun result under chunk-language language-allowlist contract v0.1`

Input artifact:

* `docs/open-instrument/artifacts/zheji-generalization/comic-generalization-replay-v0.1.json`
* sha256: `55c460ecd482cece85326896ec453e89f343d19c58684f5af2aa7d30cdfe9357`

Input result:

* outcomeClassification: `GENERALIZATION_NULL_ACCEPTED`
* validationStatus: `passed`

## Problem

The single-call Brain replay is now closed for `comic`.

It previously produced fake success by returning the whole input word as the candidate.

The contract was repaired:

* non-null candidates require `chunk`
* non-null candidates require `language`
* `candidate.language` must be one of reviewed candidate-language labels
* source-language candidates are rejected
* whole-word candidates are rejected
* missing-chunk candidates are rejected
* null remains valid truth

After those repairs, the corrected `comic` replay returned `GENERALIZATION_NULL_ACCEPTED`.

That is a valid result, but it means the single-call search shape is not useful enough for discovery.

## Decision

Do not patch the single-call replay path again.

Move to Layer 2 explicit target fallback.

The fallback reduces search freedom by asking Brain one narrow question at a time:

`Is there a standalone candidate for this exact chunk in this exact candidate language?`

## Initial target grid

The first target grid for `comic` is intentionally small.

Reviewed word:

* `comic`

Reviewed segmentation:

* `COM + IC`

Reviewed chunks:

* `COM`
* `IC`

Candidate-language seed set:

* Albanian
* Latin
* Greek
* Sanskrit

Initial targets:

* `(COM, Albanian)`
* `(COM, Latin)`
* `(COM, Greek)`
* `(COM, Sanskrit)`
* `(IC, Albanian)`
* `(IC, Latin)`
* `(IC, Greek)`
* `(IC, Sanskrit)`

## Target object contract

Each target object must include:

* `word`
* `stage`
* `segmentation`
* `chunk`
* `candidateLanguage`
* `sourceLanguage`
* `targetId`
* `targetStatus`

Allowed `targetStatus` values:

* `pending`
* `executed`
* `skipped`

The canonical target id format is:

`comic::<chunk>::<candidateLanguage>`

Examples:

* `comic::COM::Albanian`
* `comic::IC::Latin`

## Brain response contract per target

For each target, Brain must return exactly one JSON object.

Top-level keys:

* `word`
* `stage`
* `segmentation`
* `chunk`
* `candidateLanguage`
* `candidate`
* `nullAccepted`
* `claimBoundary`

A non-null `candidate` must include:

* `chunk`
* `language`
* `isolatedStandaloneForm`
* `plainStandaloneDefinitionGloss`
* `notes`

The response is valid only if:

* `response.word` equals the reviewed word
* `response.stage` equals the reviewed stage
* `response.segmentation` equals the reviewed segmentation
* `response.chunk` equals the target chunk
* `response.candidateLanguage` equals the target candidate language
* `candidate.chunk` equals the target chunk
* `candidate.language` equals the target candidate language
* `candidate.language` is in the reviewed language allowlist
* `candidate.language` does not equal the source language
* `candidate.isolatedStandaloneForm` does not equal the full input word
* `candidate.plainStandaloneDefinitionGloss` does not merely define the full input word
* `claimBoundary.developmentOnly` is true
* every non-development claim field is false

## Null handling

Null remains valid.

If no candidate is found for one target, that target returns:

* `candidate: null`
* `nullAccepted: true`

A null target result must not be treated as a failure.

A null target result means:

`No valid candidate was produced for this exact chunk-language target under current constraints.`

## Aggregate result contract

The target-grid artifact must aggregate all target results.

Required aggregate fields:

* `schemaVersion`
* `word`
* `stage`
* `segmentation`
* `targetGrid`
* `targetResults`
* `aggregateClassification`
* `claimBoundary`

Allowed `aggregateClassification` values:

* `TARGET_GRID_SIGNAL_PRESENT`
* `TARGET_GRID_ALL_NULL_ACCEPTED`
* `TARGET_GRID_DEGENERATE_BLOCKED`
* `TARGET_GRID_PARTIAL_INVALIDATED`
* `TARGET_GRID_EXECUTION_BLOCKED`

A useful candidate is present only if at least one target result validates with a non-null candidate.

If all target results are valid nulls, the aggregate result is:

`TARGET_GRID_ALL_NULL_ACCEPTED`

## Execution policy

No execution is authorized by this definition.

This definition only defines the fallback.

A future reviewed implementation PR may add target-grid generation and validation.

A future reviewed execution PR may run the target grid exactly once.

## Non-negotiable guardrails

No future candidate contract may omit `chunk`.

No future candidate contract may omit `language`.

No whole-word candidate may be accepted.

No free-text language label may be accepted.

No source-language candidate may be accepted for this current source-language rule.

No evidence promotion is allowed.

No publication framing is allowed.

No winner-crowning is allowed.

No provider/model execution is allowed without an exact reviewed execution PR.

## Next accepted task

`docs(open-instrument): review Layer 2 chunk-language target fallback definition v0.1`
