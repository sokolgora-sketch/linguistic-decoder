# Zheji Study003 Artifact Run Checklist v0.1

## Status

This is an operator checklist only.

It is not the artifact run.

No model call is made in this PR.

No artifact is created in this PR.

No replay report is created in this PR.

No runtime route is changed in this PR.

No provider default is changed in this PR.

No prompt source is changed in this PR.

No validator source is changed in this PR.

No schema source is changed in this PR.

No post-processor source is changed in this PR.

No existing Zheji UI/path lens is changed in this PR.

This checklist prepares the first actual local-provider Zheji `.003 / SHTU + DI` artifact run.

## Source references

This checklist follows:

- `docs/open-instrument/zheji-study003-replay-execution-plan-v0.1.md`
- `docs/open-instrument/zheji-replay-implementation-boundary-v0.1.md`
- `scripts/open-instrument/run-zheji-study003-replay.mjs`
- `src/shared/openInstrument/zhejiStudy003ReplayRunner.v0.1.ts`
- `src/shared/openInstrument/zhejiTransparencyPrompt.v0.1.ts`
- `src/shared/openInstrument/zhejiTransparencyValidation.v0.1.ts`
- `src/shared/openInstrument/zhejiTransparencyContrast.v0.1.ts`

## Run target

Fixed target:

- word: `study`
- segmentationId: `study.segmentation.003`
- chunks: `SHTU + DI`
- voice path: `U → I`
- target languages:
  - Albanian
  - Latin
  - Chinese
  - Germanic

Reason:

- `.003 / SHTU + DI` is the clean baseline.
- `.004 / S + TU + DI` remains later hard-case replay.
- First actual Zheji artifact should test semantic-enrichment fields on the stable baseline before hard-case replay.

## Provider target

Planned local provider:

- provider: `openai_compat`
- model: `llama3.1:8b`
- base URL: `http://localhost:11434/v1`
- endpoint: `http://localhost:11434/v1/chat/completions`

Provider default remains:

- `mock`

OpenAI API:

- not used

## Hard stop rules

Stop before model call if:

- repo is dirty;
- branch is not the artifact branch;
- open non-Dependabot PRs exist;
- local Ollama endpoint is unavailable;
- `llama3.1:8b` is unavailable;
- expected helper files are missing;
- plan-only runner script fails;
- focused Zheji runner/helper tests fail;
- `git diff --check` fails;
- any runtime/API/UI/provider-default diff exists.

Stop after one model call if:

- raw parse fails;
- raw Brain output has forbidden fields;
- Zheji fields are missing;
- validation fails;
- derived contrast fails;
- artifact/report writing fails.

Do not silently rerun.

Do not switch model.

Do not expand languages.

Do not weaken validator.

Do not change provider default.

## Required preflight command order

Run these before the actual model call:

1. repo state check;
2. open PR check;
3. helper file existence check;
4. focused Zheji helper tests;
5. plan-only runner script;
6. local Ollama model list check;
7. local endpoint check;
8. artifact/report path absence check;
9. runtime/provider diff guard;
10. final operator confirmation in terminal.

## Repo preflight

Required repo state:

- branch should be the artifact branch;
- working tree should be clean before artifact creation;
- latest `main` should be pulled before branch creation;
- divergence should be `0 0` before branch creation.

Required open PR state:

- Dependabot PRs are allowed to remain open;
- non-Dependabot feature/docs PRs should not be open before the artifact run.

## Required helper files

The artifact run should require these files:

- `scripts/open-instrument/run-zheji-study003-replay.mjs`
- `src/shared/openInstrument/zhejiStudy003ReplayRunner.v0.1.ts`
- `src/shared/openInstrument/zhejiTransparencyTypes.v0.1.ts`
- `src/shared/openInstrument/zhejiTransparencyPrompt.v0.1.ts`
- `src/shared/openInstrument/zhejiTransparencyValidation.v0.1.ts`
- `src/shared/openInstrument/zhejiTransparencyContrast.v0.1.ts`

## Required focused tests before model call

Run:

- `tests/openInstrument.zhejiStudy003ReplayRunner.guard.spec.ts`
- `tests/openInstrument.zhejiTransparencyPrompt.guard.spec.ts`
- `tests/openInstrument.zhejiTransparencyValidation.guard.spec.ts`
- `tests/openInstrument.zhejiTransparencyContrast.guard.spec.ts`

Expected:

- all focused tests pass;
- no snapshot updates;
- no skipped focused Zheji runner/helper tests.

## Plan-only runner check

Run:

- `node scripts/open-instrument/run-zheji-study003-replay.mjs`

Expected JSON values:

- `mode: PLAN_ONLY_NO_MODEL_CALL`
- `word: study`
- `segmentationId: study.segmentation.003`
- `chunks: ["SHTU", "DI"]`
- `provider: openai_compat`
- `model: llama3.1:8b`
- `modelCallMade: false`
- `artifactWritten: false`
- `runtimeWiringChanged: false`
- `providerDefaultChanged: false`
- `openAiApiUsed: false`

This proves the committed runner scaffold is safe before the separate artifact script/model call.

## Ollama preflight

Before model call, check:

- Ollama server responds;
- `/v1/models` responds;
- `llama3.1:8b` is listed;
- endpoint accepts OpenAI-compatible request shape;
- local dummy `OPENAI_API_KEY=ollama` is used only for Ollama compatibility.

No OpenAI API key should be used.

No external provider should be contacted.

## Artifact path

The artifact run should write exactly one artifact JSON.

Expected path for 2026-06-08:

`docs/open-instrument/artifacts/heart-brain-prototype/2026-06-08-study-heart-brain-llama3-1-8b-segmentation-003-zheji-replay-v0.1.json`

If run on another date, use the actual date in `YYYY-MM-DD` format.

Do not overwrite an existing artifact.

If the artifact path already exists:

- stop;
- choose the next explicit version only after documenting why.

## Report path

The artifact run should write exactly one report.

Expected path:

`docs/open-instrument/study-segmentation-003-zheji-replay-result-v0.1.md`

Do not overwrite an existing report.

If the report path already exists:

- stop;
- choose the next explicit version only after documenting why.

## Required artifact fields

The artifact must include:

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

## Required execution metadata

The artifact must include:

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

Expected values for clean artifact run:

- `modelCallMade: true`
- `attemptCount: 1`
- `promptContractApplied: true`
- `postProcessorApplied: true`
- `validatorChanged: false`
- `promptSourceChanged: false`
- `sourceFilesChanged: false`
- `providerDefaultChanged: false`
- `openAiApiUsed: false`

## Required Zheji metadata

The artifact must include:

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

## Raw Brain output expectations

Raw Brain output should include:

- top-level `word`;
- top-level `segmentationId`;
- `chunkCandidates`;
- `nullCandidates`;
- `warnings`;
- `claimBoundary`.

Non-null candidates should include:

- current Brain candidate fields;
- `analysisLayers`;
- `semanticTransparency`.

Null candidates:

- preserve traceability fields;
- do not require `semanticTransparency`;
- do not participate in derived contrast matrix.

Raw Brain output must not include:

- `transparencyContrast`;
- `transparencyContrastNote`;
- `score`;
- `rank`;
- `winner`;
- `originVerdict`;
- `historicalTruth`;
- `provesOrigin`;
- `isOrigin`;
- `languageWins`.

## Derived contrast expectations

Derived contrast should be computed after raw parse, normalization, and validation.

Derived contrast should:

- read non-null candidates only;
- group candidate languages by `semanticTransparency.level`;
- use matrix buckets:
  - `atomic`
  - `metaphorical`
  - `opaque`;
- deduplicate languages within each bucket;
- compute `hasContrast`.

Derived contrast must not:

- generate prose;
- choose winner;
- score candidates;
- rank candidates;
- infer origin;
- mutate `candidateType`.

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

Do not invent new classification names during the run.

## Clean artifact criteria

A clean artifact requires:

- local provider preflight passes;
- exactly one model call;
- raw provider response captured;
- raw Brain output parse ok;
- top-level `word` equals `study`;
- top-level `segmentationId` equals `study.segmentation.003`;
- chunks are only `SHTU` and `DI`;
- non-null candidates include `analysisLayers`;
- non-null candidates include `semanticTransparency`;
- raw Brain output does not include `transparencyContrast`;
- raw Brain output does not include `transparencyContrastNote`;
- raw Brain output does not include score/rank/winner/origin fields;
- Zheji validation passes;
- derived contrast computes successfully;
- null candidates excluded from contrast matrix;
- `candidateType` unchanged by Zheji fields;
- claim boundary preserved;
- provider default unchanged;
- OpenAI API not used.

## Failure artifact policy

If failure occurs after model call:

- preserve raw provider response if available;
- preserve parsed raw Brain output if available;
- preserve normalization state if applicable;
- preserve validation issues;
- preserve derived contrast error if applicable;
- classify failure with one allowed classification value;
- write report honestly.

If failure occurs before model call:

- do not write a success artifact;
- record preflight failure in the report only if a controlled branch was created for the failure record.

## Report requirements

The report must include:

- run date;
- model/provider;
- fixed Heart input;
- prompt metadata;
- model call count;
- raw parse result;
- normalization result;
- validation result;
- derived contrast result;
- classification;
- claim boundary;
- stop/failure notes if applicable;
- next action.

The report must use:

- semantic/function motivation;
- semantic transparency;
- embryo morpheme meaning/function analysis.

The report must not use:

- winner;
- true origin;
- origin proof;
- language wins;
- historical proof;
- model quality proof.

## Post-run checks

After artifact/report creation, run:

- JSON parse check on artifact;
- content grep on artifact;
- content grep on report;
- no markdown fence check on report;
- runtime/provider diff guard;
- `git diff --check`;
- focused Zheji helper tests;
- `npm run build`;
- `npm run gate:quick`.

## Commit/PR policy for artifact run

The artifact run should be committed in a separate artifact PR.

The PR title should be:

`docs(open-instrument): archive zheji study003 replay artifact`

The PR should include only:

- one artifact JSON;
- one report markdown.

The PR should not include:

- source changes;
- runtime changes;
- provider default changes;
- UI changes;
- existing Zheji lens changes.

## Next action

After this checklist PR merges, run the actual controlled artifact task:

`docs(open-instrument): archive zheji study003 replay artifact`

That task may make one local `llama3.1:8b` model call if all preflight checks pass.

## Claim boundary

This checklist prepares a development artifact run for embryo morpheme meaning/function motivation analysis.

It is not external origin/truth evidence.

It is not candidate truth proof.

It is not historical origin proof.

It is not model-quality evidence.

It is not reason to change provider default from `mock`.

It is not reason to expand languages, switch model, or run `.004` yet.
