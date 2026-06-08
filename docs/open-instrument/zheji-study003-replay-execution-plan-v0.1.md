# Zheji Study003 Replay Execution Plan v0.1

## Status

This is an execution plan only.

It is not a replay.

No model call is made in this PR.

No artifact is created in this PR.

No report is created in this PR.

No runtime route is changed in this PR.

No provider default is changed in this PR.

No prompt source is changed in this PR.

No validator source is changed in this PR.

No schema source is changed in this PR.

No post-processor source is changed in this PR.

No existing Zheji UI or engine lens is changed in this PR.

This execution plan supports embryo morpheme meaning/function motivation analysis. It is not external origin/truth evidence.

## Source stack

This execution plan follows:

- `docs/open-instrument/zheji-controlled-replay-plan-v0.1.md`
- `docs/open-instrument/zheji-replay-implementation-boundary-v0.1.md`
- `src/shared/openInstrument/zhejiTransparencyTypes.v0.1.ts`
- `src/shared/openInstrument/zhejiTransparencyPrompt.v0.1.ts`
- `src/shared/openInstrument/zhejiTransparencyValidation.v0.1.ts`
- `src/shared/openInstrument/zhejiTransparencyContrast.v0.1.ts`
- `tests/openInstrument.zhejiTransparencyPrompt.guard.spec.ts`
- `tests/openInstrument.zhejiTransparencyValidation.guard.spec.ts`
- `tests/openInstrument.zhejiTransparencyContrast.guard.spec.ts`

The helper scaffold was introduced for explicit Open Instrument replay work only.

The helper scaffold is not wired into runtime.

## Replay target

First Zheji replay target:

- word: `study`
- segmentationId: `study.segmentation.003`
- chunks: `SHTU + DI`

Reason:

- `.003 / SHTU + DI` is the clean baseline.
- `.003` has lower structural pressure than `.004`.
- The first Zheji replay should test semantic-enrichment fields before returning to the hard-case split.
- `.004 / S + TU + DI` remains the later hard-case replay target after `.003` is reviewed.

## Provider and model

Planned local replay provider:

- provider: `openai_compat`
- model: `llama3.1:8b`
- endpoint: `http://localhost:11434/v1/chat/completions`

Provider default remains:

- `mock`

Rules:

- do not call OpenAI API;
- do not change provider default;
- do not treat local model output as model-quality proof;
- do not run a background job;
- do not run more than one model call unless a failure plan explicitly allows it.

## Fixed Heart input

The replay should use this fixed Heart-approved input:

- word: `study`
- normalizedWord: `study`
- segmentationId: `study.segmentation.003`
- chunks:
  - `SHTU`
  - `DI`
- voicePath:
  - `U`
  - `I`
- legalTransforms:
  - `S_TO_SH`
  - `FINAL_Y_TO_I`

Chunk variants:

- `SHTU` is a soft comparison variant of `STU` through `S_TO_SH`.
- `DI` is a final `Y → I` comparison variant of `DY`.

Function hints:

- `U`: container, inside, adding, holding, depth
- `I`: insight, intellect, knowing, line, point

Target languages for first replay:

- Albanian
- Latin
- Chinese
- Germanic

Do not expand target languages in this replay.

## Required Zheji prompt metadata

The replay artifact should record:

- `zhejiPromptContractApplied`
- `sevenVoiceDoctrineReferenceIncluded`
- `symbolicEvaluationAllowed`
- `zhejiFieldsRequested`
- `transparencyContrastRequestedFromBrain`

Expected values:

- `zhejiPromptContractApplied: true`
- `sevenVoiceDoctrineReferenceIncluded: true`
- `symbolicEvaluationAllowed: true`
- `zhejiFieldsRequested: ["analysisLayers", "semanticTransparency"]`
- `transparencyContrastRequestedFromBrain: false`

The prompt must ask for candidate-level:

- `analysisLayers`
- `semanticTransparency`

The prompt must not ask Brain for:

- `transparencyContrast`
- `transparencyContrastNote`
- score
- rank
- winner
- origin verdict
- `candidateType` mutation

## Meaning/function motivation boundary

The replay does not declare:

- winner
- historical origin
- true origin
- language superiority
- candidate truth proof

The replay inspects which candidate can motivate the word chunk meaning/function more directly, metaphorically, or opaquely.

Expected language in reports:

- semantic/function motivation
- semantic transparency
- embryo morpheme meaning analysis

Avoid language such as:

- proves origin
- winner
- language wins
- true source
- historical proof

## Expected raw Brain output

Raw Brain output should include the existing Brain candidate-search fields:

- `word`
- `segmentationId`
- `chunkCandidates`
- `nullCandidates`
- `warnings`
- `claimBoundary`

Every non-null candidate should include:

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
- `analysisLayers`
- `semanticTransparency`

Every null candidate should preserve existing null traceability fields.

Null candidates do not require `semanticTransparency`.

Raw Brain output must not include:

- `transparencyContrast`
- `transparencyContrastNote`
- score
- rank
- winner
- origin verdict

## Validation sequence

After raw output is captured:

1. Parse raw provider response.
2. Extract raw Brain JSON.
3. Preserve raw Brain output unchanged.
4. Apply approved enum/shape normalization if needed.
5. Preserve normalized Brain output separately.
6. Run existing Brain candidate validation.
7. Run Zheji transparency validation using `validateZhejiTransparencyOutputV0_1`.
8. Compute derived contrast using `detectTransparencyContrastV0_1`.
9. Preserve derived enriched output separately.
10. Write artifact.
11. Write report.
12. Review result in a separate review PR.

## Derived contrast sequence

The derived contrast step should:

- read non-null candidates only;
- read candidate language;
- read `semanticTransparency.level`;
- group languages into matrix buckets:
  - `atomic`
  - `metaphorical`
  - `opaque`;
- exclude null candidates;
- deduplicate same-language entries inside the same bucket;
- compute `hasContrast`.

The derived contrast step must not:

- generate prose;
- score candidates;
- rank candidates;
- choose a winner;
- infer origin;
- mutate `candidateType`.

## Artifact path

Planned artifact path:

`docs/open-instrument/artifacts/heart-brain-prototype/2026-06-08-study-heart-brain-llama3-1-8b-segmentation-003-zheji-replay-v0.1.json`

If the replay happens on another date, use the actual date in `YYYY-MM-DD` format.

Artifact filename should include:

- date;
- word;
- model;
- segmentation id;
- `zheji-replay`;
- version.

## Report path

Planned report path:

`docs/open-instrument/study-segmentation-003-zheji-replay-result-v0.1.md`

The report should be human-readable and include:

- fixed input;
- provider/model boundary;
- Zheji prompt metadata;
- raw parse result;
- normalization result;
- Zheji validation result;
- derived contrast result;
- classification;
- claim boundary;
- next action.

## Artifact required fields

The artifact should include:

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

## Execution metadata

Required execution metadata:

- `modelCallMade`
- `attemptCount`
- `promptContractApplied`
- `normalizationApplied`
- `postProcessorApplied`
- `validatorChanged`
- `promptSourceChanged`
- `sourceFilesChanged`
- `providerDefaultChanged`
- `openAiApiUsed`

Expected values:

- `modelCallMade: true`
- `attemptCount: 1`
- `promptContractApplied: true`
- `postProcessorApplied: true`
- `validatorChanged: false`
- `promptSourceChanged: false`
- `sourceFilesChanged: false`
- `providerDefaultChanged: false`
- `openAiApiUsed: false`

## Classification values

Allowed classification values:

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

Do not use vague classification labels.

## Clean replay criteria

A clean `.003` Zheji replay requires:

- local provider preflight passes;
- exactly one model call;
- raw provider response captured;
- raw Brain output parse ok;
- top-level `word` present and equals `study`;
- top-level `segmentationId` present and equals `study.segmentation.003`;
- chunks are only `SHTU` and `DI`;
- `analysisLayers` present on non-null candidates;
- `semanticTransparency` present on non-null candidates;
- raw Brain output does not include `transparencyContrast`;
- raw Brain output does not include `transparencyContrastNote`;
- no score/rank/winner/origin fields;
- Zheji validation passes;
- derived contrast computes successfully;
- null candidates excluded from contrast matrix;
- `candidateType` unchanged by Zheji fields;
- claim boundary preserved;
- provider default unchanged;
- no OpenAI API call.

## Failure handling

If local provider preflight fails:

- stop before model call;
- do not create a success artifact;
- report preflight failure.

If model call times out:

- classify as `MODEL_CAPTURE_TIMEOUT`;
- do not silently rerun;
- do not change model;
- do not expand languages.

If raw parse fails:

- classify as `RAW_PARSE_FAILURE`;
- preserve raw provider response if available.

If Zheji fields are missing:

- classify as `MISSING_ZHEJI_FIELDS`;
- do not weaken validation;
- do not claim theory failure.

If raw Brain returns `transparencyContrast`:

- classify as `RAW_OUTPUT_CONTAINS_DERIVED_CONTRAST`;
- preserve raw output;
- do not silently remove it from raw record.

If derived contrast fails:

- classify as `DERIVED_CONTRAST_FAILURE`.

If validation fails after Zheji:

- classify as `VALIDATION_FAILURE_AFTER_ZHEJI`.

In all cases:

- do not silently rerun;
- do not weaken validator;
- do not expand languages;
- do not switch model;
- do not change provider default;
- create artifact/report only under controlled failure policy.

## Execution command policy

The future replay command must be explicit.

It should not be hidden inside normal app runtime.

It should not run from `/api/analyze`.

It should not run from `/api/analyze-v1`.

It should not run from UI.

It should not run automatically.

It should be manually invoked from terminal.

## Preflight checks before replay

Before actual replay execution, run:

- repo clean check;
- branch check;
- open PR check;
- local Ollama model availability check;
- endpoint availability check;
- expected helper files check;
- no runtime diff check;
- no provider-default diff check.

The replay should not start if repo is dirty.

The replay should not start if helper files are missing.

The replay should not start if the local provider is unavailable.

## Non-goals

This PR does not run the replay.

This PR does not call a model.

This PR does not create an artifact.

This PR does not create a replay report.

This PR does not change runtime.

This PR does not change provider defaults.

This PR does not change prompt source.

This PR does not change validator source.

This PR does not change schema source.

This PR does not change post-processor source.

This PR does not modify existing Zheji UI/path lens.

This PR does not expand languages.

This PR does not replay `.004`.

This PR does not prove origin.

This PR does not prove candidate truth.

This PR does not score or rank candidates.

This PR does not declare a winner.

This PR does not modify `candidateType`.

## Recommended next PR

Recommended next PR:

`feat(open-instrument): add zheji study003 replay runner`

Purpose:

- add explicit manually invoked replay runner for `.003 / SHTU + DI`;
- use existing Zheji helper scaffold;
- do not run model during implementation PR;
- do not create artifact during implementation PR;
- do not wire runtime/API/UI;
- keep provider default unchanged.

After that implementation PR is merged, run the actual controlled replay in a separate artifact PR.

## Claim boundary

This is development execution planning for embryo morpheme meaning/function motivation analysis.

It is not external origin/truth evidence.

It is not candidate truth proof.

It is not historical origin proof.

It is not model-quality evidence.

It is not reason to change provider default from `mock`.

It is not reason to expand language/model scope without another controlled plan.
