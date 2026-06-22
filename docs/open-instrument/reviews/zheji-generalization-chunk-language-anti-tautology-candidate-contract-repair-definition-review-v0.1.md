# Chunk-Language Anti-Tautology Candidate Contract Repair Definition Review v0.1

Status: CHUNK_LANGUAGE_ANTI_TAUTOLOGY_CANDIDATE_CONTRACT_REPAIR_DEFINITION_REVIEWED_ACCEPTED_READY_FOR_IMPLEMENTATION.

Review date: 2026-06-22.

Review scope: docs-only review of the chunk-language anti-tautology candidate contract repair definition.

Reviewed base:

* Short SHA: `0ada30e1`
* Full SHA: `0ada30e1a80d7118a010d1e25e911f4b3ed4f46f`
* Subject: `docs(open-instrument): define chunk-language anti-tautology candidate contract repair v0.1`

Reviewed definition doc:

* `docs/open-instrument/zheji-generalization-chunk-language-anti-tautology-candidate-contract-repair-v0.1.md`

Triggering supersession review:

* `docs/open-instrument/reviews/zheji-generalization-comic-rerun-degenerate-signal-supersession-review-v0.1.md`

Triggering artifact:

* `docs/open-instrument/artifacts/zheji-generalization/comic-generalization-replay-v0.1.json`

## Review decision

The contract repair definition is accepted.

The next PR may implement the repair.

No replay execution is authorized by this review PR.

No provider/model execution is authorized by this review PR.

## Accepted immediate repair

Every non-null candidate must require:

* `chunk`
* `language`
* `isolatedStandaloneForm`
* `plainStandaloneDefinitionGloss`

The implementation must reject a non-null candidate when:

* `chunk` is missing
* `language` is missing
* `chunk` is outside the reviewed segmentation chunks
* `isolatedStandaloneForm` equals the full input word
* `language` is the source language
* the gloss merely defines the full input word

For `comic`, the reviewed chunk set is:

* `COM`
* `IC`

## Accepted classification repair

`GENERALIZATION_SIGNAL_PRESENT` must only be used when the candidate passes the chunk-language anti-tautology checks.

Degenerate whole-word candidates must not be classified as successful signal.

The accepted degenerate classification is:

`GENERALIZATION_SIGNAL_DEGENERATE_CIRCULAR_INPUT_WORD`

## Accepted prompt repair

The prompt must forbid whole-word dictionary definitions.

The prompt must require a candidate to target one reviewed chunk.

The prompt must require a candidate language.

The prompt must keep null as valid when no chunk-language candidate is found.

## Accepted permanent rule

No non-null candidate contract may omit `chunk` or `language`.

If the model struggles, the fix is fewer degrees of freedom per call, not fewer required fields.

Required fields must not be deleted to make validation easier.

## Accepted Layer 2 fallback

If the restored single-call contract still produces null or degenerate outputs, the next architecture change should reduce breadth per call.

Heart should generate explicit `(chunk, candidateLanguage)` targets.

Brain should answer one narrow target at a time.

This fallback is not implemented in the immediate repair PR.

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

## Boundary proof

No replay execution occurred in this review PR.

No provider execution occurred in this review PR.

No model call occurred in this review PR.

No localhost/Ollama call occurred in this review PR.

No remote endpoint use occurred in this review PR.

No hosted OpenAI endpoint use occurred in this review PR.

No DeepSeek endpoint use occurred in this review PR.

No prompt implementation change occurred in this review PR.

No validator implementation change occurred in this review PR.

No runtime/API/UI/source behavior change occurred in this review PR.

No schema change occurred in this review PR.

No package metadata change occurred in this review PR.

No CI change occurred in this review PR.

No artifact mutation occurred in this review PR.

No evidence promotion occurred in this review PR.

No publication framing occurred in this review PR.

## Next accepted task

`test(open-instrument): implement chunk-language anti-tautology candidate contract repair v0.1`
