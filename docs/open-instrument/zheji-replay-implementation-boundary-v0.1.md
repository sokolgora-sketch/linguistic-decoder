# Zheji Replay Implementation Boundary v0.1

## Status

This is an implementation-boundary design only.

It is not implemented.

No source helper is added in this PR.

No source validator change is made in this PR.

No source schema change is made in this PR.

No source prompt change is made in this PR.

No runtime route change is made in this PR.

No model call is made in this PR.

No artifact replay is made in this PR.

No provider default change is made in this PR.

No existing Zheji UI or engine lens is changed in this PR.

This implementation-boundary design supports embryo morpheme meaning analysis. It is not external origin/truth evidence.

## Source design stack

This document follows the completed Zheji replay planning stack:

- `docs/open-instrument/zheji-semantic-transparency-layer-v0.1.md`
- `docs/open-instrument/zheji-semantic-transparency-layer-review-v0.1.md`
- `docs/open-instrument/zheji-transparency-schema-additions-v0.1.md`
- `docs/open-instrument/zheji-transparency-validation-policy-v0.1.md`
- `docs/open-instrument/zheji-prompt-contract-additions-v0.1.md`
- `docs/open-instrument/zheji-derived-contrast-post-processor-v0.1.md`
- `docs/open-instrument/zheji-controlled-replay-plan-v0.1.md`

The controlled replay plan selected:

- first replay target: `study.segmentation.003`
- chunks: `SHTU + DI`
- later hard-case replay target: `study.segmentation.004`
- chunks: `S + TU + DI`

## Purpose

The purpose is to decide what may be implemented before the first Zheji controlled replay.

The first replay needs a way to:

- build the Zheji prompt contract;
- request candidate-level `analysisLayers`;
- request candidate-level `semanticTransparency`;
- forbid Brain-authored `transparencyContrast`;
- preserve raw Brain output;
- preserve normalized Brain output;
- compute derived `transparencyContrast`;
- write artifact and report;
- keep provider defaults unchanged.

This document prevents hidden schema, prompt, validator, route, or runtime drift before replay execution.

## Boundary decision

The first Zheji controlled replay should use a committed, isolated development script or helper path, not a production runtime route.

Decision:

- do not wire Zheji replay into `/api/analyze`;
- do not wire Zheji replay into `/api/analyze-v1`;
- do not wire Zheji replay into UI;
- do not change default provider;
- do not change production prompt source used by existing non-Zheji flows;
- do not make Zheji fields globally required for all Brain candidate outputs.

The first implementation should be isolated to an explicit Open Instrument development replay path.

## Preferred implementation mode

Preferred mode:

- committed source helper plus explicit development script;
- script runs only when called manually;
- script writes docs artifact/report only after controlled execution;
- script is not imported by runtime routes;
- script is not used by UI;
- script does not change default provider behavior.

Reason:

- temporary untracked scripts are weaker for audit;
- committed dev-only helpers are reviewable and testable;
- explicit script entrypoint avoids hidden runtime changes;
- artifact generation becomes repeatable.

## Allowed source implementation, future PR only

A future implementation PR may add dev-only source/helpers for:

- Zheji prompt payload construction;
- Zheji output shape checking;
- derived contrast matrix computation;
- artifact assembly;
- report assembly.

Potential future paths may include:

- `src/shared/openInstrument/zhejiTransparencyTypes.v0.1.ts`
- `src/shared/openInstrument/zhejiTransparencyPrompt.v0.1.ts`
- `src/shared/openInstrument/zhejiTransparencyValidation.v0.1.ts`
- `src/shared/openInstrument/zhejiTransparencyContrast.v0.1.ts`
- `scripts/open-instrument/run-zheji-study003-replay.mjs`

These paths are examples only.

A future implementation PR must inspect the repo before choosing exact paths.

## Forbidden implementation in the first source PR

The first source PR must not:

- change production API routes;
- change UI;
- change provider default from `mock`;
- make OpenAI API calls;
- run the model during implementation PR creation;
- create replay artifacts during implementation PR unless explicitly scoped;
- make Zheji fields required for existing non-Zheji artifacts;
- loosen existing Brain candidate validation;
- alter existing enum repair semantics;
- mutate `candidateType`;
- modify `src/engine/zhejiLens.ts`;
- modify `src/lib/zhejiSummary.ts`;
- expand languages;
- switch model;
- replay `.004` before `.003` is reviewed.

## Prompt implementation boundary

Future prompt helper should produce a Zheji-specific prompt section for replay only.

It may request candidate-level:

- `analysisLayers`
- `semanticTransparency`

It must forbid Brain from returning:

- `transparencyContrast`
- `transparencyContrastNote`
- score
- rank
- winner
- origin verdict
- `candidateType` mutation

It must record metadata:

- `zhejiPromptContractApplied`
- `sevenVoiceDoctrineReferenceIncluded`
- `symbolicEvaluationAllowed`
- `zhejiFieldsRequested`
- `transparencyContrastRequestedFromBrain`

The expected value for `transparencyContrastRequestedFromBrain` is false.

## Validation implementation boundary

Future validation helper may check Zheji field shape for the controlled replay.

It must not replace the current Brain candidate validator.

It must not loosen the current Brain candidate validator.

It may run as an additional Zheji-active validation layer only for replay artifacts.

It should check:

- `analysisLayers` shape on non-null candidates;
- `semanticTransparency` shape on non-null candidates;
- absence of raw `transparencyContrast`;
- absence of raw `transparencyContrastNote`;
- absence of score/rank/winner/origin fields;
- null candidates excluded from semantic transparency requirements;
- claim boundary preserved.

Existing artifacts without Zheji fields must not become invalid under the normal non-Zheji validator.

## Derived contrast implementation boundary

Future post-processor helper may compute:

- `transparencyContrast.hasContrast`
- `transparencyContrast.matrix.atomic`
- `transparencyContrast.matrix.metaphorical`
- `transparencyContrast.matrix.opaque`

Input:

- normalized Brain output;
- non-null candidates;
- candidate-level `semanticTransparency.level`;
- candidate language labels.

Output:

- derived enriched output only.

It must not:

- generate prose;
- choose a winner;
- score candidates;
- infer origin;
- mutate `candidateType`;
- include null candidates in the matrix.

## Artifact implementation boundary

Future replay artifact should be written only after an explicit controlled replay command.

It should include:

- raw provider response;
- parsed raw Brain output;
- normalization summary;
- normalized Brain output;
- Zheji prompt metadata;
- Zheji derived output;
- Zheji post-processor metadata;
- validation summary;
- claim boundary.

The artifact must not overwrite previous artifacts.

The artifact filename should include:

- date;
- word;
- model;
- segmentation id;
- `zheji`;
- version.

Example pattern:

`docs/open-instrument/artifacts/heart-brain-prototype/YYYY-MM-DD-study-heart-brain-llama3-1-8b-segmentation-003-zheji-replay-v0.1.json`

## Report implementation boundary

Future replay report should be created beside the artifact.

It should include:

- fixed input;
- provider/model;
- Zheji prompt metadata;
- parse result;
- normalization result;
- Zheji field summary;
- derived contrast matrix;
- validation result;
- classification;
- claim boundary;
- next action.

The report must be human-readable and must not claim origin/truth proof.

## Runtime boundary

No runtime route should call the Zheji replay path in v0.1.

No UI should expose the Zheji replay path in v0.1.

No automatic scheduled or background replay should exist.

The replay must be manually invoked from terminal.

Provider default remains `mock`.

`openai_compat` is allowed only as explicit local-provider replay configuration.

## Environment boundary

The first replay implementation should require explicit environment confirmation.

Expected local provider:

- Ollama running locally;
- endpoint: `http://localhost:11434/v1/chat/completions`;
- model: `llama3.1:8b`;
- provider: `openai_compat`.

Preflight should check local provider availability before model call.

If preflight fails, stop before model call.

If model call fails, archive or report failure only under the controlled failure policy.

No OpenAI API call is allowed.

## First replay sequencing

Sequence:

1. Design implementation boundary.
2. Implement isolated dev-only replay helper/script.
3. Run tests/build.
4. Merge implementation PR.
5. Run controlled `.003 / SHTU + DI` replay in a separate PR or task.
6. Archive artifact and report.
7. Review replay.
8. Only after review, decide whether to replay `.004 / S + TU + DI`.

Do not combine implementation and replay artifact in the same PR unless a later explicit plan allows it.

Preferred rule:

- implementation PR first;
- replay artifact PR second;
- replay review PR third.

## Manual validation vs source validation decision

For the first replay, source validation is preferred over manual-only validation.

Reason:

- manual-only validation is weaker;
- source validation gives repeatable checks;
- future replay review can cite exact validation behavior.

However, source validation should be scoped to Zheji replay artifacts only.

It should not make old artifacts fail in normal gates.

## Test boundary

Future implementation PR should add focused tests only for new isolated helpers.

Possible tests:

- prompt helper includes Zheji field instructions;
- prompt helper forbids raw `transparencyContrast`;
- validator accepts minimal valid Zheji candidate fields;
- validator rejects raw `transparencyContrast`;
- contrast helper groups languages by transparency level;
- null candidates are excluded from matrix;
- helper does not mutate `candidateType`.

No broad UI tests are required for first implementation.

No production route tests are required unless a route is intentionally changed, which v0.1 forbids.

## Existing Zheji lens compatibility

The first replay implementation must not use `src/engine/zhejiLens.ts`.

The first replay implementation must not use `src/lib/zhejiSummary.ts`.

Existing Zheji UI/path lens remains separate.

Future reuse of Seven-Voice traits from existing Zheji code requires a separate compatibility design.

## Non-goals

This PR does not implement anything.

This PR does not run a replay.

This PR does not create artifacts.

This PR does not call a model.

This PR does not modify source.

This PR does not modify runtime.

This PR does not modify prompt source.

This PR does not modify validator source.

This PR does not modify schema source.

This PR does not change provider defaults.

This PR does not expand languages.

This PR does not replay `.004`.

This PR does not prove origin.

This PR does not prove candidate truth.

This PR does not score or rank candidates.

This PR does not make Albanian an automatic winner.

This PR does not modify `candidateType`.

## Recommended next PR

Recommended next PR:

`feat(open-instrument): add zheji replay helper scaffold`

Purpose:

- add isolated dev-only helpers/scripts for `.003` controlled replay;
- add focused tests for prompt contract, validation shape, and derived contrast helper;
- do not run model;
- do not create artifact;
- do not wire runtime;
- do not change provider default.

Implementation must remain scoped and explicit.

## Claim boundary

This is development implementation-boundary design for embryo morpheme meaning analysis.

It is not external origin/truth evidence.

It is not candidate truth proof.

It is not historical origin proof.

It is not model-quality evidence.

It is not reason to change provider default from `mock`.

It is not reason to expand language/model scope without another controlled plan.
