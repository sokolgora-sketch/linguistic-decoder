# Chunk-Language Anti-Tautology Candidate Contract Repair Implementation Review v0.1

Status: CHUNK_LANGUAGE_ANTI_TAUTOLOGY_IMPLEMENTATION_REVIEWED_ACCEPTED_WITH_LANGUAGE_ALLOWLIST_FINDING_RERUN_BLOCKED.

Review date: 2026-06-22.

Reviewed base:

* Short SHA: `d5dc9854`
* Full SHA: `d5dc98548f8936914658256c8e250fd1b00d4304`
* Subject: `test(open-instrument): implement chunk-language anti-tautology candidate contract repair v0.1`

Reviewed files:

* `scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`
* `tests/openInstrument.limitReplayRunnerExecutionBaseContract.v0.1.spec.ts`

## Review decision

The implementation is reviewed and accepted for the chunk-language anti-tautology repair.

However, rerun authorization is blocked because candidate.language is not yet constrained to an explicit candidate-language allowlist.

The next PR must implement a candidate language allowlist validator before any rerun.

## What was accepted

The implementation restores the minimum anti-tautology protections:

* non-null candidates require `chunk`
* non-null candidates require `language`
* candidate chunk must be one of the reviewed segmentation chunks
* candidate form equal to the input word is rejected
* source-language candidates are rejected for the current source-language rule
* degenerate whole-word candidates classify as `GENERALIZATION_SIGNAL_DEGENERATE_CIRCULAR_INPUT_WORD`
* the prompt forbids whole-word dictionary definitions
* null remains valid
* evidence promotion remains blocked
* winner-crowning remains blocked

## Language allowlist inspection

Language allowlist status:

`MISSING`

Blocking finding: candidate.language is currently only required to be present and not equal the source language.

That leaves free-text language labels as an escape hatch.

A model could satisfy the current validator by inventing a plausible-looking language label.

This would be the same structural-pass / semantic-empty failure mode as the previous comic candidate, but in a new shape.

## Rerun authorization decision

If language allowlist status is `MISSING`, no rerun is authorized.

If language allowlist status is `PRESENT`, exactly one reviewed comic rerun may be authorized by the next PR.

Current review result:

`CHUNK_LANGUAGE_ANTI_TAUTOLOGY_IMPLEMENTATION_REVIEWED_ACCEPTED_WITH_LANGUAGE_ALLOWLIST_FINDING_RERUN_BLOCKED`

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

`test(open-instrument): implement candidate language allowlist validator v0.1`
