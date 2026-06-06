# Study Segmentation 004 Controlled Llama Retry After Enum Repair v0.1

## Status
- design-only
- not executed
- no model call in this PR
- no new Brain output
- no artifact created in this PR
- no runtime wiring change
- no prompt change
- no validator change
- no provider default change
- Open Instrument local-provider development only

## Purpose
Define one future controlled local llama retry after the enum repair and runtime-boundary work.

Target:
- word: `study`
- segmentation: `study.segmentation.004`
- chunks: `S + TU + DI`
- model: `llama3.1:8b`
- provider: `openai_compat`
- language set: Albanian, Latin, Chinese, Germanic

This retry is intended to test whether a fresh local Brain output can pass through:

`parsed Brain output → normalizeBrainCandidateEnums → brainCandidateSearchValidation`

without weakening the validator or changing provider defaults.

## Preconditions
Required completed work:
- Brain candidate enum repair policy exists.
- Object-shape enum repair policy exists.
- `normalizeBrainCandidateEnums` helper exists.
- object-wrapper enum repair tests pass.
- archived v0.4 replay passed strict validation after normalization.
- PR #1212 review classified archived v0.4 structural blocker as resolved.
- PR #1213 runtime boundary exists.
- default provider remains `mock`.

## Retry input contract
Fixed retry input:
- word: `study`
- segmentationId: `study.segmentation.004`
- chunks:
  - `S`
  - `TU`
  - `DI`
- reduced languages:
  - Albanian
  - Latin
  - Chinese
  - Germanic
- provider:
  - `openai_compat`
- model:
  - `llama3.1:8b`
- local endpoint:
  - `http://localhost:11434/v1/chat/completions`
- retry count:
  - one controlled run only
- no language expansion
- no model switch
- no prompt rewrite unless the current capture path already requires it

## Required capture pipeline
Required pipeline:

1. Heart payload is generated deterministically.
2. Local llama returns raw Brain output.
3. Raw provider response is archived if available.
4. Parsed raw Brain output is archived.
5. `normalizeBrainCandidateEnums` is applied.
6. Normalized Brain output is archived separately.
7. Normalization audit is archived.
8. Unresolved normalization entries are archived.
9. Strict Brain candidate validator runs on normalized Brain output.
10. Report records parse, normalization, validation, and claim boundary.

## Required artifact fields
Future retry artifact must include:
- artifact type
- artifact version
- createdAt
- provider metadata
- model metadata
- local endpoint metadata, if available
- timeout budget used
- Heart input identity:
  - word
  - segmentationId
  - chunks
  - reduced languages
- raw provider response, if available
- parsed raw Brain output
- normalized Brain output
- normalization audit
- unresolved entries
- validation after normalization
- summary:
  - parse ok
  - normalization applied
  - repaired count
  - unresolved count
  - validation ok after normalization
  - validation issue count after normalization
  - issue families after normalization
- claim boundary

Required flags:
- `modelCallMade: true`
- `normalizationApplied: true`
- `normalizer: normalizeBrainCandidateEnums`
- `validator: brainCandidateSearchValidation`
- `providerDefaultChanged: false`
- `promptChanged: false`, unless a later approved prompt PR changes this
- `runtimeWiringChanged`, explicit true/false depending on implementation path

## Required report fields
Future retry report must include:
- status
- source/input contract
- model/provider details
- raw parse result
- normalization result
- validation result after normalization
- comparison against archived v0.4 replay
- failure classification or clean classification
- claim boundary
- next decision

## Failure classifications
Use the PR #1213 boundary classifications:
- `PARSE_FAILURE`
- `NORMALIZATION_UNRESOLVED`
- `VALIDATION_FAILURE_AFTER_NORMALIZATION`
- `CLEAN_AFTER_NORMALIZATION`
- `MODEL_CAPTURE_TIMEOUT`
- `PROVIDER_FAILURE`
- `RUNTIME_WIRING_ERROR`

Meanings for the retry:
- `CLEAN_AFTER_NORMALIZATION` means structurally valid development output only.
- It does not mean candidate truth.
- It does not mean origin proof.

## Acceptance criteria
The retry may be considered structurally clean only if:
- model call completes;
- raw output parses;
- normalization applies;
- unresolved count is `0`;
- strict validator passes after normalization;
- raw and normalized outputs are archived separately;
- claim boundary is present;
- provider default remains `mock`.

## Non-acceptance criteria
The retry is not clean if:
- model times out;
- provider fails;
- parse fails;
- normalization has unresolved entries;
- validator fails after normalization;
- artifact misses raw or normalized output;
- claim boundary is missing;
- default provider changes.

## Comparison to archived v0.4 replay
Future retry should compare against PR #1211 result:
- archived v0.4 after object-shape repair:
  - repaired count: `18`
  - unresolved count: `0`
  - validation issue count after normalization: `0`
  - validation ok after normalization: `true`

Fresh retry should not be expected to match candidate meanings exactly. The comparison is structural first.

## Decision after retry
If `CLEAN_AFTER_NORMALIZATION`:
- create review PR for retry result;
- then consider segmentation comparison doc for:
  - `study.segmentation.002`
  - `study.segmentation.003`
  - `study.segmentation.004`

If `NORMALIZATION_UNRESOLVED`:
- create review PR for unresolved entries;
- decide whether helper needs another explicit policy expansion.

If `VALIDATION_FAILURE_AFTER_NORMALIZATION`:
- create review PR for remaining validation families;
- do not rerun again immediately.

If `PARSE_FAILURE`, `MODEL_CAPTURE_TIMEOUT`, or `PROVIDER_FAILURE`:
- archive operational failure;
- do not classify as candidate failure.

## Non-goals
- no model run in this PR;
- no artifact in this PR;
- no runtime implementation in this PR;
- no prompt change;
- no validator change;
- no provider default change;
- no language expansion;
- no Cohort/eval/publication claim;
- no candidate truth claim;
- no origin proof claim.

## Recommended next step
`docs/open-instrument: execute controlled llama retry after enum repair`

Purpose:
- define the next controlled `study.segmentation.004` local llama retry as one development run only;
- keep the reduced language set fixed;
- archive raw and normalized output;
- apply normalization before strict validation;
- report acceptance/failure classification;
- keep local provider optional and development-only.

## Claim boundary
- development-only
- controlled retry design only
- not a model run
- not origin proof
- not candidate truth proof
- not publication evidence
- not eval evidence
- not Cohort evidence
- not model-quality evidence
- not reason to change default provider from `mock`

## Validation commands
The implementation PR for this retry design should use:
- `echo "=== changed files ==="`
- `git status -sb`
- `git diff --name-only`
- scope contamination check against VoiceLab, cohort, evals, Finnish `/i/`, and arm-b2
- no source/runtime/artifact changes check
- content grep for the retry terms
- no markdown fence check
- `git diff --check`
- `npm run gate:quick`
- `npm run build`

