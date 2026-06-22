# Zheji Generalization Chunk-Language Anti-Tautology Candidate Contract Repair v0.1

Status: CHUNK_LANGUAGE_ANTI_TAUTOLOGY_CANDIDATE_CONTRACT_REPAIR_DEFINED.

Date: 2026-06-22.

This document defines the required repair after the `comic` rerun was superseded as a degenerate signal.

No implementation occurs in this PR.

No replay execution occurs in this PR.

No provider/model call occurs in this PR.

## Trigger

The `comic` rerun artifact structurally passed the current replay contract but returned a degenerate candidate.

Artifact:

* `docs/open-instrument/artifacts/zheji-generalization/comic-generalization-replay-v0.1.json`

Observed candidate:

* input word: `comic`
* reviewed segmentation: `COM + IC`
* isolatedStandaloneForm: `comic`
* plainStandaloneDefinitionGloss: `relating to or characteristic of comedy`
* chunk field present: `false`
* language field present: `false`

Semantic review classification from the superseding review:

`GENERALIZATION_SIGNAL_DEGENERATE_CIRCULAR_INPUT_WORD`

## Root cause

The current limit/comic replay candidate contract became too thin.

It accepts a non-null candidate when these fields are present:

* `isolatedStandaloneForm`
* `plainStandaloneDefinitionGloss`

That is insufficient for the embryo-morpheme lane.

A whole-word dictionary definition can pass this thin contract.

The `comic` result proved this failure mode:

* candidate form equals the input word
* candidate does not target `COM`
* candidate does not target `IC`
* candidate has no language
* candidate has no chunk

## Permanent rule

No non-null candidate contract may omit `chunk` or `language`.

If the model struggles with a full contract, the fix is fewer degrees of freedom per call, not fewer required fields.

Required fields must not be deleted to make validation easier.

## Immediate repair scope

The next implementation PR must restore required chunk-language targeting for every non-null candidate.

Required non-null candidate fields:

* `chunk`
* `language`
* `isolatedStandaloneForm`
* `plainStandaloneDefinitionGloss`

Optional non-null candidate fields:

* `notes`

Preferred later restoration fields:

* `candidateType`
* `evidenceType`
* `falseFriendRisk`
* `analysisLayers`
* `semanticTransparency`

These preferred fields are not required in the immediate repair unless explicitly scoped by a later PR.

## Required validator rules

For every non-null candidate, the validator must enforce:

1. `candidate.chunk` is present.
2. `candidate.language` is present.
3. `candidate.chunk` is one of the reviewed segmentation chunks.
4. For `comic`, allowed chunks are `COM` and `IC`.
5. `candidate.isolatedStandaloneForm` must not equal the full input word.
6. `candidate.language` must not be the source language for the input word.
7. `candidate.plainStandaloneDefinitionGloss` must not merely define the full input word.
8. Claim boundary must remain development-only.
9. Evidence promotion must remain false.
10. Winner-crowning must remain false.

## Classification repair

The current artifact used:

`GENERALIZATION_SIGNAL_PRESENT`

That classification must only be allowed when the candidate passes chunk-language anti-tautology checks.

The implementation PR must introduce or use an explicit degenerate classification for failures like `comic`:

`GENERALIZATION_SIGNAL_DEGENERATE_CIRCULAR_INPUT_WORD`

A structurally parseable candidate that equals the input word must not be classified as successful signal.

A structurally parseable candidate with missing `chunk` or missing `language` must not be classified as successful signal.

## Prompt repair

The prompt must stop asking Brain for a generic candidate for the whole word.

The prompt must require Brain to answer the reviewed chunk-language contract.

At minimum, the prompt must say:

* do not define the input word
* do not return the full input word as a candidate
* candidate must target one reviewed chunk
* candidate must specify candidate language
* candidate must remain development-only
* null is valid when no chunk-language candidate is found

## Source-language rule

For the current `comic` replay, the source language is English.

A future implementation may expose `sourceLanguage` as an explicit request field.

Until then, the implementation PR must document how it determines source language for the anti-tautology check.

For the immediate `comic` repair, `candidate.language` must not be English.

## Segmentation parsing rule

The implementation must derive reviewed chunks from the request segmentation.

For `COM + IC`, the allowed chunk set is:

* `COM`
* `IC`

The implementation must fail closed if a non-null candidate names a chunk outside the reviewed chunk set.

## Null handling

Null remains valid.

If the model cannot find a chunk-language candidate, it should return a null result.

A truthful null tied to reviewed chunk-language targeting is better than a degenerate whole-word candidate.

## Layer 2 fallback architecture

If the restored single-call contract still produces null or degenerate outputs, the next architecture change should not remove required fields.

The next architecture change should reduce breadth per call.

Heart should generate explicit `(chunk, candidateLanguage)` targets.

Brain should answer one narrow question per target, for example:

`For chunk COM, does Albanian have a standalone form with the requested function? Return candidate or null.`

This prevents Brain from choosing its own target and drifting back to the full input word.

## Forbidden moves

The implementation PR must not:

* rerun `comic`
* call a provider/model
* mutate the artifact
* promote the `comic` candidate as truth
* promote origin evidence
* promote ownership evidence
* promote publication evidence
* weaken the claim boundary
* remove required fields to make validation easier
* treat a whole-word definition as a successful embryo-morpheme candidate

## Required implementation proof

The implementation PR must prove with tests that:

* a candidate missing `chunk` is rejected
* a candidate missing `language` is rejected
* a candidate whose form equals the input word is rejected
* a candidate whose chunk is not in the reviewed segmentation is rejected
* a valid candidate must name a reviewed chunk
* a valid candidate must name a non-source candidate language
* a null candidate remains valid when explicitly null-accepted
* evidence promotion remains blocked
* winner-crowning remains blocked

## Next accepted task

`docs(open-instrument): review chunk-language anti-tautology candidate contract repair definition v0.1`
