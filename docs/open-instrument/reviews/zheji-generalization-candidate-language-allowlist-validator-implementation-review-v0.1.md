# Candidate Language Allowlist Validator Implementation Review v0.1

Status: CANDIDATE_LANGUAGE_ALLOWLIST_VALIDATOR_IMPLEMENTATION_REVIEWED_ACCEPTED_READY_FOR_COMIC_RERUN.

Review date: 2026-06-22.

Reviewed base:

* Short SHA: `ec466980`
* Full SHA: `ec46698055266cee95fb1bc505ed084eb2e36eac`
* Subject: `test(open-instrument): implement candidate language allowlist validator v0.1`

Reviewed files:

* `scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`
* `tests/openInstrument.limitReplayRunnerExecutionBaseContract.v0.1.spec.ts`

## Review decision

The candidate language allowlist validator implementation is reviewed and accepted.

The rerun blocker recorded in the chunk-language anti-tautology implementation review is resolved.

Exactly one reviewed `comic` rerun may be authorized next.

## Accepted implementation

The runner now defines a reviewed candidate language allowlist.

Reviewed labels:

* Albanian
* Latin
* Greek
* Sanskrit
* Hebrew
* Arabic
* Germanic
* Gothic
* Old English
* English
* French
* Italian
* Spanish
* Romanian
* Slavic
* Old Church Slavonic
* Mandarin
* Chinese

The runner now validates that:

* `candidate.language` is present
* `candidate.language` is one of the reviewed candidate-language labels
* `candidate.language` does not equal the source language
* source-language rejection remains active
* chunk-language anti-tautology checks remain active
* whole-word candidates remain classified as degenerate
* evidence promotion remains blocked
* winner-crowning remains blocked

## Prompt review

The prompt now tells Brain that `candidate.language` must be one of the reviewed labels.

This closes the free-text language escape hatch identified in the prior review.

## Rerun authorization boundary

This review does not execute the replay.

This review only authorizes the next PR to execute exactly one reviewed `comic` rerun under the restored contract.

The rerun must keep these boundaries:

* local-only provider
* reviewed execution base
* one execution only
* `word: comic`
* `stage: MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`
* `segmentation: COM + IC`
* no evidence promotion
* no publication framing
* no winner-crowning

## Expected honest outcomes for the rerun

The next rerun may produce:

* a real chunk-language candidate targeting `COM` or `IC`
* an honest null
* a degenerate output blocked by the validator

All three are valid observations.

Do not patch the single-call path again if the rerun still fails or returns null/degenerate.

If the rerun does not produce a useful chunk-language candidate, move to the Layer 2 fallback:

Heart generates explicit `(chunk, candidateLanguage)` targets.

Brain answers one narrow target at a time.

## Boundary proof

No replay execution occurred in this review PR.

No provider execution occurred in this review PR.

No model call occurred in this review PR.

No localhost/Ollama call occurred in this review PR.

No remote endpoint use occurred in this review PR.

No hosted OpenAI endpoint use occurred in this review PR.

No DeepSeek endpoint use occurred in this review PR.

No artifact mutation occurred in this review PR.

No source/runtime/API/UI behavior change occurred in this review PR.

No schema/package/CI change occurred in this review PR.

No evidence promotion occurred in this review PR.

No publication framing occurred in this review PR.

## Next accepted task

`test(open-instrument): execute reviewed comic generalization replay under chunk-language language-allowlist contract v0.1`
