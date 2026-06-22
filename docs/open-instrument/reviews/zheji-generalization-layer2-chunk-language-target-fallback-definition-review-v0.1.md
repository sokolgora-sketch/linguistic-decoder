# Layer 2 Chunk-Language Target Fallback Definition Review v0.1

Status: LAYER2_CHUNK_LANGUAGE_TARGET_FALLBACK_DEFINITION_REVIEWED_ACCEPTED_READY_FOR_IMPLEMENTATION.

Review date: 2026-06-23.

Reviewed base:

* Short SHA: `4784fbe9`
* Full SHA: `4784fbe969b2461f5e9be89ed258a693f7dc47a5`
* Subject: `docs(open-instrument): define Layer 2 chunk-language target fallback after comic null v0.1`

Reviewed definition:

* `docs/open-instrument/zheji-generalization-layer2-chunk-language-target-fallback-after-comic-null-v0.1.md`

## Review decision

The Layer 2 chunk-language target fallback definition is reviewed and accepted.

The single-call `comic` replay lane remains closed.

The next implementation may add a target-grid scaffold, but must not execute provider/model calls.

## Accepted definition points

The definition correctly records:

* the previous single-call `comic` replay returned `GENERALIZATION_NULL_ACCEPTED`
* the null result is valid truth
* the single-call search shape is not useful enough for discovery
* the single-call replay path must not be patched again
* the next discovery path is explicit `(chunk, candidateLanguage)` targeting
* every target asks one narrow question
* target results can be non-null candidate, valid null, or blocked/invalidated
* aggregate target-grid output can report signal, all-null, blocked, partial-invalidated, or execution-blocked

## Accepted initial target grid

The reviewed initial grid is:

* `(COM, Albanian)`
* `(COM, Latin)`
* `(COM, Greek)`
* `(COM, Sanskrit)`
* `(IC, Albanian)`
* `(IC, Latin)`
* `(IC, Greek)`
* `(IC, Sanskrit)`

This is accepted as the first small grid.

Do not expand to all allowlisted languages yet.

## Required implementation shape

The next implementation should add scaffold only:

* static target-grid builder
* target object validator
* per-target response validator
* aggregate result classifier
* focused tests
* no provider execution
* no model execution
* no artifact mutation unless scaffold fixtures are explicitly reviewed

The implementation should keep the current single-call runner intact unless explicitly adding separate target-grid helpers.

## Required future execution shape

A later reviewed execution PR may run the target grid exactly once.

It must preserve:

* local-only provider
* explicit reviewed execution base
* one execution pass across reviewed targets
* no fallback provider
* no automatic provider selection
* no evidence promotion
* no publication framing
* no winner-crowning

## Non-negotiable guardrails

No future candidate contract may omit `chunk`.

No future candidate contract may omit `language`.

No whole-word candidate may be accepted.

No free-text language label may be accepted.

No source-language candidate may be accepted under the current source-language rule.

Null remains valid.

All-null aggregate remains valid.

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

`test(open-instrument): implement Layer 2 chunk-language target grid scaffold v0.1`
