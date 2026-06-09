# Study Segmentation 004 Zheji Segmentation Traceability Hardening Design v0.1

## Purpose

This document designs the next hardening step after the candidate-payload-hardened `.004 / S + TU + DI` rerun and PR #1254 review.

The goal is narrow and mechanical:

- preserve candidate-level `segmentationId`
- preserve chunk-level traceability
- keep `.004 / S + TU + DI` auditability intact
- avoid semantic expansion
- avoid rerun until design, implementation, review, and preflight are complete

This is a docs-only design PR.

It does not change prompts.

It does not change validators.

It does not change runtime code.

It does not create artifacts.

It does not call a model.

It does not rerun `.004`.

## Prior chain

PR #1253 preflighted the candidate-payload-hardened `.004 / S + TU + DI` rerun.

Direct commit `c693ae0` archived the candidate-payload-hardened artifact/report directly to `main`.

PR #1254 reviewed that artifact and documented the direct-main push as a one-off workflow exception.

PR #1254 decision:

- artifact accepted as useful diagnostic structural failure
- candidate payload hardening improved previous failure
- new active weakness is candidate-level segmentation traceability
- no rerun before segmentation traceability hardening design, implementation, review, and preflight are complete

## Fixed target

- word: `study`
- segmentationId: `study.segmentation.004`
- chunks: `S + TU + DI`
- word-level voice path: `U → I`
- provider path: `openai_compat`
- local model: `llama3.1:8b`
- provider default: `mock`

## Reviewed artifact result

Classification:

- `ZHEJI_STUDY004_CANDIDATE_PAYLOAD_HARDENED_STRUCTURAL_FAILURE`

Validation:

- raw parse ok: true
- forbidden raw field found: false
- structural ok: false
- structural issue count: 6
- enrichment ok: true
- enrichment warning count: 0
- valid transparency candidate count: 3
- missing transparency count: 0

What survived:

- `chunkCandidates` present
- `nullCandidates` present
- `warnings` present
- `claimBoundary` present
- top-level `candidates` absent
- raw Brain `transparencyContrast` absent
- raw Brain `transparencyContrastNote` absent

What improved:

- `language` present
- `candidateForm` present
- `meaning` present
- `sourceNote` present
- enrichment warning count stayed `0`

Active structural failure:

- `chunkCandidates.0.segmentationId` empty
- `chunkCandidates.0.segmentationId` mismatched
- `chunkCandidates.1.segmentationId` empty
- `chunkCandidates.1.segmentationId` mismatched
- `chunkCandidates.2.segmentationId` empty
- `chunkCandidates.2.segmentationId` mismatched

## Design decision

Every candidate object must preserve the exact Heart segmentation ID.

Required value:

- `study.segmentation.004`

This applies to:

- every non-null `chunkCandidates[]` object
- every `nullCandidates[]` object

The value must be:

- present
- non-empty
- exactly equal to the top-level `segmentationId`
- exactly equal to the Heart-approved input `segmentationId`

Missing, empty, changed, shortened, normalized, or invented candidate-level `segmentationId` remains a structural failure.

## Traceability rule

For every object in `chunkCandidates`:

- `segmentationId` must be copied exactly from the Heart input
- `chunk` must be one of the Heart-approved chunks
- `chunk` must not be rewritten to a gloss
- `chunk` must not be replaced by candidate form
- `chunk` must not be omitted
- `segmentationId` must not be omitted

For every object in `nullCandidates`:

- `segmentationId` must be copied exactly from the Heart input
- `chunk` must be one of the Heart-approved chunks
- `candidateType` must be exactly `null_candidate`
- `nullCandidate` must be true
- `sourceNote` must explain why no honest candidate was emitted

## Prompt hardening requirements

The follow-up implementation PR should add prompt/helper/test pressure only.

The prompt should state:

- Every `chunkCandidates[]` object must include `segmentationId`.
- Every `chunkCandidates[].segmentationId` must exactly equal `study.segmentation.004`.
- Every `nullCandidates[]` object must include `segmentationId`.
- Every `nullCandidates[].segmentationId` must exactly equal `study.segmentation.004`.
- Do not leave candidate-level `segmentationId` empty.
- Do not infer, shorten, translate, normalize, or invent `segmentationId`.
- Copy `segmentationId` exactly from the Heart-approved input into every candidate and null-candidate object.
- If a candidate is emitted for chunk `S`, `TU`, or `DI`, the candidate object must still carry `segmentationId: study.segmentation.004`.

## Output skeleton requirement

The output skeleton should show explicit `segmentationId` in each candidate object.

The skeleton should include at least one `chunkCandidates[]` example with:

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
- `analysisLayers`
- `semanticTransparency`

The skeleton should include at least one `nullCandidates[]` example with:

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

The skeleton must not use top-level `candidates`.

## Validation posture

This design does not weaken validation.

Missing candidate-level `segmentationId` remains structural failure.

Mismatched candidate-level `segmentationId` remains structural failure.

Empty candidate-level `segmentationId` remains structural failure.

Null candidates are not exempt from segmentation traceability.

The validator does not need to be relaxed.

The implementation should harden the prompt and focused guard tests first.

## Scope boundaries

This design does not approve:

- a model call
- a rerun
- artifact creation
- validator weakening
- runtime/API/UI wiring
- provider default change
- OpenAI API use
- language expansion
- semantic transparency schema expansion
- `polarInversion`
- vector-conservation schema
- origin claims
- winner claims
- language superiority claims

## Gemini note

Gemini’s warning about avoiding metaphors in local 8B prompts remains valid.

The phrase “functional identity card” may be useful in design docs, but future prompt hardening should prefer dry operational language.

However, the active failure from the reviewed artifact is not semantic metaphor drift.

The active failure is mechanical traceability:

- candidate-level `segmentationId` was not preserved

Therefore this lane stays focused on traceability before semantic-transparency redesign.

## Open Instrument boundary

Open Instrument remains a meaning/function motivation instrument.

It is not an etymology engine.

It does not find origin.

It does not declare a winner.

It does not prove historical derivation.

It does not prove candidate truth.

It records which language candidates can motivate the meaning/function of embryo morphemes through a language's own smallest meaningful units.

## Required implementation tests

The implementation PR should include focused guard tests proving:

- prompt contains exact `study.segmentation.004`
- prompt requires `chunkCandidates[].segmentationId`
- prompt requires `nullCandidates[].segmentationId`
- prompt says candidate-level `segmentationId` must equal the Heart input segmentation ID
- prompt says do not leave candidate-level `segmentationId` empty
- prompt says do not infer, shorten, translate, normalize, or invent `segmentationId`
- output skeleton includes `segmentationId` in `chunkCandidates[]`
- output skeleton includes `segmentationId` in `nullCandidates[]`
- top-level `candidates` remains forbidden
- Brain remains forbidden from returning `transparencyContrast`
- Brain remains forbidden from returning `transparencyContrastNote`
- provider default remains `mock`
- no new semantic schema fields are added

## Next implementation

Next PR should be:

`feat(open-instrument): harden zheji study004 segmentation traceability prompt`

It should change only:

- prompt/helper text
- output skeleton examples
- focused guard tests

It should not call the model.

It should not create artifacts.

It should not modify validators unless a later implementation review explicitly finds prompt-only hardening insufficient.

## Final design decision

Segmentation traceability hardening is required before any `.004 / S + TU + DI` rerun.

The next rerun remains blocked until this design and the follow-up implementation, review, and preflight sequence land.
