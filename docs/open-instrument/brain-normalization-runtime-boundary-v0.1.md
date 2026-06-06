# Brain Normalization Runtime Boundary v0.1

## Status
- design-only
- not implemented
- no runtime behavior change
- no model call
- no artifact replay
- no prompt change
- no validator change
- no provider default change
- Open Instrument local-provider development only

## Problem statement
PR #1211 proved that archived `llama3.1:8b` Brain output can pass strict validation after approved object-wrapper enum repair.
PR #1212 reviewed that replay and classified the archived v0.4 object-shaped enum blocker as resolved.
The helper currently works offline.
Before any controlled llama retry, the runtime/capture boundary must define exactly when normalization occurs and how raw and normalized outputs are archived.

## Current evidence
- target: `study.segmentation.004`
- chunks: `S + TU + DI`
- model: `llama3.1:8b`
- provider: `openai_compat`
- reduced languages:
  - Albanian
  - Latin
  - Chinese
  - Germanic

PR #1211 result:
- previous normalized validation issue count: `36`
- new normalized validation issue count: `0`
- object-wrapper repairs: `18`
- unresolved count: `0`
- strict validator passed after normalization

## Boundary decision
Canonical pipeline:

1. Heart creates deterministic payload.
2. Brain/model returns raw candidate output.
3. Raw Brain output is preserved exactly.
4. Parser parses the raw output.
5. Normalizer creates a separate normalized Brain output.
6. Normalizer emits audit and unresolved entries.
7. Strict validator runs on normalized Brain output.
8. Artifact stores both raw and normalized outputs.
9. Report records raw parse status, normalization status, validation status, and claim boundary.
10. Review decides next step.

Rules:
- Normalizer does not replace raw output.
- Normalizer does not loosen validator.
- Validator should not accept object-shaped enum values directly.
- Normalized output is a derived object, not the original Brain answer.
- Normalization must be deterministic and auditable.

## Runtime placement
Placement:

`parsed Brain output → normalizeBrainCandidateEnums → brainCandidateSearchValidation`

State:
- normalization happens only after successful parse;
- if parse fails, normalization is skipped;
- if normalization leaves unresolved entries, validation still runs but unresolved entries are reported;
- validation result must be interpreted with the normalization audit.

## Artifact shape requirements
Future controlled runs must archive:
- raw provider response, if available;
- parsed raw Brain output;
- normalized Brain output;
- normalization audit;
- unresolved normalization entries;
- validation result on normalized output;
- provider metadata;
- model metadata;
- Heart payload identity:
  - word
  - segmentationId
  - chunks
  - languages
- claim boundary.

Required flags:
- `modelCallMade`
- `normalizationApplied`
- `normalizer`
- `validator`
- `runtimeWiringChanged`
- `providerDefaultChanged`
- `promptChanged`

## Report requirements
Future reports must include:
- raw parse ok;
- normalization applied;
- repair count;
- unresolved count;
- validation ok after normalization;
- validation issue count after normalization;
- issue families after normalization;
- claim boundary;
- decision boundary.

## Failure classifications
Define at least these:
- `PARSE_FAILURE`
- `NORMALIZATION_UNRESOLVED`
- `VALIDATION_FAILURE_AFTER_NORMALIZATION`
- `CLEAN_AFTER_NORMALIZATION`
- `MODEL_CAPTURE_TIMEOUT`
- `PROVIDER_FAILURE`
- `RUNTIME_WIRING_ERROR`

Brief meanings:
- `PARSE_FAILURE`: the model returned output that could not be parsed into a Brain object.
- `NORMALIZATION_UNRESOLVED`: parse succeeded, but some enum values remained unresolved after deterministic normalization.
- `VALIDATION_FAILURE_AFTER_NORMALIZATION`: normalized Brain output was still rejected by the strict validator.
- `CLEAN_AFTER_NORMALIZATION`: normalized Brain output passed strict validation with no remaining issues.
- `MODEL_CAPTURE_TIMEOUT`: the model call did not complete within the allowed capture budget.
- `PROVIDER_FAILURE`: the provider path failed before useful Brain output could be captured.
- `RUNTIME_WIRING_ERROR`: the pipeline wiring failed before the normalizer or validator could complete the intended flow.

## Acceptance criteria for next controlled llama retry
Before a new `study.segmentation.004` llama retry is allowed:
- runtime boundary doc exists;
- normalizer helper exists;
- helper guard tests pass;
- replay review confirms archived v0.4 structural recovery;
- controlled retry plan exists;
- raw and normalized outputs must both be archived;
- strict validation remains unchanged;
- default provider remains `mock`;
- result is development-only.

## Non-goals
- no model rerun in this PR;
- no runtime implementation in this PR;
- no artifact replay in this PR;
- no prompt change;
- no validator change;
- no provider default change;
- no language expansion;
- no publication/eval/Cohort claim.

## Recommended next step
`docs(open-instrument): define controlled llama retry after enum repair`

Purpose:
- define one controlled `study.segmentation.004` local llama retry;
- use reduced language set only;
- archive raw + normalized output;
- apply normalizer before strict validation;
- report acceptance/failure classification;
- keep local provider optional and development-only.

Do not recommend running the model directly without a retry plan PR.

## Claim boundary
- development-only
- runtime-boundary design only
- not a new model run
- not origin proof
- not candidate truth proof
- not publication evidence
- not eval evidence
- not Cohort evidence
- not model-quality evidence
- not reason to change default provider from `mock`

## Validation commands
The implementation PR for this boundary should use:
- `echo "=== changed files ==="`
- `git status -sb`
- `git diff --name-only`
- scope contamination check against VoiceLab, cohort, evals, Finnish `/i/`, and arm-b2
- no source/runtime/artifact changes check
- content grep for the boundary terms
- no markdown fence check
- `git diff --check`
- `npm run gate:quick`
- `npm run build`

