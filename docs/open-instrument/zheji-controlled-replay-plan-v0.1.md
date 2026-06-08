# Zheji Controlled Replay Plan v0.1

## Status

This is a controlled replay plan only.

It is not implemented.

No source post-processor is added in this PR.

No source validator change is made in this PR.

No source schema change is made in this PR.

No source prompt change is made in this PR.

No runtime change is made in this PR.

No model call is made in this PR.

No artifact replay is made in this PR.

No provider default change is made in this PR.

No existing Zheji UI or engine lens is changed in this PR.

This controlled replay plan supports embryo morpheme meaning analysis. It is not external origin/truth evidence.

## Source design stack

This plan follows the completed Zheji design stack:

- `docs/open-instrument/zheji-semantic-transparency-layer-v0.1.md`
- `docs/open-instrument/zheji-semantic-transparency-layer-review-v0.1.md`
- `docs/open-instrument/zheji-transparency-schema-additions-v0.1.md`
- `docs/open-instrument/zheji-transparency-validation-policy-v0.1.md`
- `docs/open-instrument/zheji-prompt-contract-additions-v0.1.md`
- `docs/open-instrument/zheji-derived-contrast-post-processor-v0.1.md`

The stack defines:

- candidate-level `analysisLayers`;
- candidate-level `semanticTransparency`;
- derived chunk-level `transparencyContrast`;
- no Brain-authored contrast field;
- no prose contrast generation;
- no scores;
- no ranks;
- no winner selection;
- no origin verdict;
- no `candidateType` mutation.

## Purpose

The purpose of the first controlled Zheji replay is to test whether the future Zheji semantic transparency fields can be produced, preserved, validated, and reviewed under a controlled Open Instrument workflow.

The replay should test the full future boundary:

- raw Brain output;
- normalized Brain output;
- derived enriched output;
- Zheji prompt metadata;
- candidate-level fields;
- derived contrast matrix;
- strict claim boundary;
- human review.

The replay is not a truth test.

The replay is not an origin test.

The replay is a structural and workflow test for the Zheji semantic enrichment layer.

## Replay target decision

First replay target:

- `study.segmentation.003`
- chunks: `SHTU + DI`

Reason:

- `.003` is the clean baseline from the study segmentation comparison.
- `.003` validated cleanly earlier with less structural pressure than `.004`.
- The Zheji layer introduces new semantic fields, so the first replay should minimize segmentation and repair pressure.
- `.003` is suitable for testing whether the new semantic fields can pass without immediately stressing the hardest split.

Second later replay target:

- `study.segmentation.004`
- chunks: `S + TU + DI`

Reason:

- `.004` remains the active hard-case structural path.
- `.004` should be replayed only after `.003` proves the Zheji field stack can work on the clean baseline.
- `.004` is better suited as the hard-case replay, not the first semantic-enrichment replay.

Decision:

Use `.003 / SHTU + DI` first.

Do not replay `.004 / S + TU + DI` until the `.003` Zheji replay is reviewed.

## Provider and model boundary

The planned controlled replay may use the same local-provider lane used in the Open Instrument study work:

- provider: `openai_compat`
- local model: `llama3.1:8b`
- endpoint: `http://localhost:11434/v1/chat/completions`

Provider default remains:

- `mock`

The replay must not change provider defaults.

The replay must not call OpenAI API.

The replay must not treat local llama output as model-quality proof.

The replay must remain development evidence for the embryo morpheme instrument.

## Fixed input contract

The future replay should use a fixed Heart-approved input.

Required target:

- word: `study`
- segmentationId: `study.segmentation.003`
- chunks: `SHTU + DI`

The replay should preserve:

- exact word;
- exact segmentationId;
- exact chunks;
- exact legal transforms if present in the existing `.003` input;
- exact target languages;
- exact function hints;
- exact claim boundary.

Target languages should remain reduced unless a separate plan expands them.

Recommended reduced language set:

- Albanian
- Latin
- Chinese
- Germanic

Do not expand languages in the first Zheji replay.

## Zheji prompt contract metadata

The replay artifact should record:

- `zhejiPromptContractApplied`
- `sevenVoiceDoctrineReferenceIncluded`
- `symbolicEvaluationAllowed`
- `zhejiFieldsRequested`
- `transparencyContrastRequestedFromBrain`

Expected values for the first replay:

- `zhejiPromptContractApplied: true`
- `sevenVoiceDoctrineReferenceIncluded: true`
- `symbolicEvaluationAllowed: true`
- `zhejiFieldsRequested: ["analysisLayers", "semanticTransparency"]`
- `transparencyContrastRequestedFromBrain: false`

The prompt must not request `transparencyContrast`.

The prompt must not request `transparencyContrastNote`.

The prompt must not request scoring, ranking, winners, or origin verdicts.

## Compact doctrine reference

The replay prompt should include only the compact Seven-Voice doctrine reference needed for the current voice path.

For study, the useful path remains around `U → I`.

Compact doctrine reference:

- `U`: container, inside, adding, holding, depth
- `I`: insight, intellect, knowing, line, point

The prompt must not include a long doctrine essay.

The prompt must not ask Brain to reinterpret the whole Seven-Voice system.

The prompt must only ask whether each candidate meaning aligns with the supplied doctrine hints.

## Raw Brain output requirements

Raw Brain output may include candidate-level:

- `analysisLayers`
- `semanticTransparency`

Raw Brain output must not include:

- `transparencyContrast`
- `transparencyContrastNote`
- `score`
- `rank`
- `winner`
- `originVerdict`
- `historicalTruth`
- `provesOrigin`
- `isOrigin`
- `languageWins`

Raw Brain output must continue to include the existing candidate-search contract fields:

- `segmentationId`
- `chunk`
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

Raw Brain output must preserve `warnings` and `claimBoundary`.

## Normalized Brain output requirements

Normalized Brain output must remain separate from raw Brain output.

Normalization may repair already-approved low-risk enum or shape drift only if a future implementation supports it.

Normalization must not invent Zheji semantic values.

Normalization must not invent `analysisLayers`.

Normalization must not invent `semanticTransparency`.

Normalization must not invent `transparencyContrast`.

Normalization must not mutate `candidateType` because of Zheji fields.

## Derived enriched output requirements

Derived enriched output may include:

- `zhejiDerivedOutput`
- `zhejiPostProcessor`
- `transparencyContrast`

The derived output should be computed after normalized Brain output exists.

The derived output must be distinguishable from raw Brain output and normalized Brain output.

Recommended derived metadata:

- `postProcessorApplied`
- `postProcessorName`
- `postProcessorVersion`
- `inputSource`
- `contrastComputedFrom`
- `nullCandidatesExcluded`

Recommended values:

- `postProcessorApplied: true`
- `postProcessorName: detectTransparencyContrast`
- `inputSource: normalizedBrainOutput`
- `contrastComputedFrom: semanticTransparency.level`
- `nullCandidatesExcluded: true`

## Contrast matrix requirements

The future `transparencyContrast` should use the v0.1 language-only matrix:

- `hasContrast`
- `matrix.atomic`
- `matrix.metaphorical`
- `matrix.opaque`

Rules:

- `hasContrast` is true when at least two buckets are non-empty.
- `hasContrast` is false when zero or one bucket is non-empty.
- matrix arrays contain language labels or language codes from non-null candidates.
- null candidates do not contribute.
- no prose contrast note is generated.
- no score is generated.
- no winner is selected.
- no origin claim is made.

## Artifact requirements

The future replay artifact should include top-level fields:

- `artifactType`
- `artifactVersion`
- `createdAt`
- `status`
- `classification`
- `source`
- `execution`
- `heartInput`
- `rawProviderResponse`
- `parsedRawBrainOutput`
- `normalization`
- `normalizedBrainOutput`
- `zhejiPromptMetadata`
- `zhejiDerivedOutput`
- `zhejiPostProcessor`
- `validation`
- `summary`
- `claimBoundary`

Required source fields:

- word
- segmentationId
- chunks
- provider
- model
- endpoint
- targetLanguages
- designDocs

Required execution fields:

- modelCallMade
- attemptCount
- promptContractApplied
- normalizationApplied
- postProcessorApplied
- validatorChanged
- promptSourceChanged
- sourceFilesChanged
- providerDefaultChanged
- OpenAI API used

Expected boundary values:

- `attemptCount: 1`
- `providerDefaultChanged: false`
- `promptSourceChanged: false`
- `validatorChanged: false`
- `sourceFilesChanged: false`
- `OpenAI API used: false`

## Report requirements

The future replay report should include:

- status;
- fixed input contract;
- provider/model boundary;
- Zheji prompt metadata;
- raw parse result;
- normalization result;
- candidate-level field summary;
- derived contrast result;
- validation result;
- classification;
- claim boundary;
- interpretation;
- next action.

The report must state:

- development evidence for embryo morpheme meaning analysis;
- not external origin/truth evidence;
- not candidate truth proof;
- not historical origin proof;
- not model-quality evidence;
- not provider-default-change evidence.

## Classification values

The future replay should use explicit classification values.

Allowed classifications:

- `CLEAN_ZHEJI_REPLAY`
- `RAW_PARSE_FAILURE`
- `MISSING_ZHEJI_FIELDS`
- `INVALID_ZHEJI_FIELD_SHAPE`
- `RAW_OUTPUT_CONTAINS_DERIVED_CONTRAST`
- `DERIVED_CONTRAST_FAILURE`
- `VALIDATION_FAILURE_AFTER_ZHEJI`
- `MODEL_CAPTURE_TIMEOUT`
- `PROVIDER_FAILURE`
- `RUNTIME_WIRING_ERROR`

Do not use vague status language.

## Acceptance criteria

A clean first replay requires:

- one model call only;
- raw Brain output parse ok;
- expected `analysisLayers` present on non-null candidates;
- expected `semanticTransparency` present on non-null candidates;
- raw Brain output does not contain `transparencyContrast`;
- raw Brain output does not contain `transparencyContrastNote`;
- no score/rank/winner/origin fields;
- derived `transparencyContrast` computed after normalization;
- null candidates excluded from the matrix;
- validation passes under the future active Zheji policy;
- claim boundary preserved;
- provider default unchanged;
- no OpenAI API call.

## Failure handling

If the replay fails:

- do not silently rerun;
- do not weaken validator;
- do not expand languages;
- do not switch model;
- do not change provider default;
- do not claim semantic failure as theory failure without review.

Classify the failure using the allowed classification values.

Create artifact/report even for controlled operational or validation failure, if the failure occurred after the replay began.

If local provider preflight fails before model call, stop and report without creating a successful replay artifact.

## Implementation prerequisites

Before the replay is executed, the repo needs explicit implementation or temporary-script support for:

- adding the Zheji prompt contract to a controlled local-provider call;
- validating or checking `analysisLayers`;
- validating or checking `semanticTransparency`;
- computing `transparencyContrast`;
- preserving raw, normalized, and derived outputs separately;
- writing the replay artifact and report.

This plan does not implement those pieces.

## Existing Zheji lens compatibility

The replay plan does not use `src/engine/zhejiLens.ts`.

The replay plan does not use `src/lib/zhejiSummary.ts`.

Existing Zheji UI/path lens remains separate.

The replay tests Open Instrument candidate-level semantic transparency, not the existing UI path overlay.

Any later reuse of Seven-Voice trait references must be separately designed.

## Non-goals

This PR does not run the replay.

This PR does not implement prompt changes.

This PR does not implement validator changes.

This PR does not implement schema changes.

This PR does not implement post-processing.

This PR does not call a model.

This PR does not create artifacts.

This PR does not change provider defaults.

This PR does not expand languages.

This PR does not prove candidate truth.

This PR does not prove historical origin.

This PR does not score candidates.

This PR does not select a winner.

This PR does not make Albanian an automatic winner.

This PR does not modify `candidateType`.

## Recommended next PR

Recommended next PR:

`docs(open-instrument): design zheji replay implementation boundary`

Purpose:

- decide whether the first replay uses a temporary script or committed source helpers;
- define what may be implemented before the replay;
- define no-runtime-change constraints;
- define whether validation is manual/doc-based or source-based for the first replay;
- prevent hidden schema/prompt/runtime drift.

Do not execute the replay until implementation boundary is documented.

## Claim boundary

This is development replay planning for embryo morpheme meaning analysis.

It is not external origin/truth evidence.

It is not candidate truth proof.

It is not historical origin proof.

It is not model-quality evidence.

It is not reason to change provider default from `mock`.

It is not reason to expand language/model scope without another controlled plan.
