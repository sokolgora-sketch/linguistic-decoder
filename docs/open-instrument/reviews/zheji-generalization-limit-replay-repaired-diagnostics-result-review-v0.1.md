# `limit` Repaired-Diagnostics Replay Result v0.1 — Review

Status: LIMIT_REPLAY_REPAIRED_DIAGNOSTICS_RESULT_REVIEWED_INVALIDATED_WITH_ACTIONABLE_EXTRACTION_DIAGNOSIS.

Scope: docs-only review of the repaired-diagnostics `limit` replay artifact.

Review date: 2026-06-21.

Reviewed execution PR:

* Short SHA: `fd6dac50`
* Full SHA: `fd6dac50cbd254f7f862f637a34ac4dc7a851a26`
* Subject: `test(open-instrument): execute reviewed limit replay with repaired diagnostics wiring v0.1`

Reviewed artifact:

* `docs/open-instrument/artifacts/zheji-generalization/limit-generalization-replay-v0.1.json`

Reviewed runner:

* `scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`

## Result summary

The repaired-diagnostics replay result is accepted as a truthful invalidated result.

The replay is not a successful generalization signal.

The replay is not candidate-truth evidence.

The replay is not origin evidence.

The replay is not publication evidence.

## Artifact result

* schemaVersion: `open-instrument.limit-generalization-replay.v0.1`
* reviewedExecutionBaseSha: `a663165e00b9f7f9754ff60c6e7e75f02bcf98a8`
* word: `limit`
* stage: `MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`
* segmentation: `LI + MIT`
* classification: `REPLAY_INVALIDATED`
* failureClassification: `REPLAY_INVALIDATED`
* invalidationCode: `VALIDATION_FAILED`
* invalidationStage: `validation`
* invalidationReason: `root.errors[0]: response.word must equal "limit"`
* failedCheck: `validation`
* parserStatus: `PARSED_OR_ATTACHED`
* validatorStatus: `FAILED`
* providerOutputPresent: `true`
* providerOutputParseable: `true`
* claimBoundaryStatus: `ATTACHED`

## Review decision

The artifact resolves the previous `UNKNOWN` diagnostic gap.

The result is now actionable.

The concrete invalidation family is:

`VALIDATION_FAILED`

The concrete failed check is:

`validation`

The concrete reason begins with:

`root.errors[0]: response.word must equal "limit"`

## Diagnosis

The provider returned an OpenAI-compatible chat completion envelope.

The replay artifact retained that envelope in `responseIdentity.rawProviderResponse`.

The envelope contains `choices[0].message.content`.

That message content is itself a JSON string.

That JSON string contains:

* `word: limit`
* `stage: MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`
* `segmentation: LI + MIT`
* `candidate: null`
* `nullAccepted: true`
* `claimBoundary.developmentOnly: true`

The validation failure is therefore not enough to blame the provider answer.

The actionable diagnosis is that the runner validation path is still validating the wrong provider-response layer or not extracting `choices[0].message.content` into the candidate-response object before contract validation.

## Consequence

The `limit` loop should not rerun blindly.

The next task must repair provider message-content extraction in the runner.

The next task must not change the prompt.

The next task must not change the provider.

The next task must not change the model.

The next task must not weaken validation.

The next task must not promote this artifact as evidence.

## Required next task

`test(open-instrument): repair limit replay runner provider message-content extraction v0.1`

Required repair posture:

* inspect current provider response parsing first
* add explicit extraction from OpenAI-compatible chat completion envelope
* parse `choices[0].message.content` as the candidate-response JSON
* preserve raw provider response retention
* preserve response SHA retention
* preserve fail-closed behavior
* preserve exact reviewed word/stage/segmentation/provider/model/endpoint scope
* add focused static/behavioral tests
* do not run replay in the repair PR
* do not mutate the artifact in the repair PR

## Validation proof

The review ran:

* `jq . docs/open-instrument/artifacts/zheji-generalization/limit-generalization-replay-v0.1.json`
* artifact scalar checks
* raw provider envelope inspection
* `node --check scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`
* `npm test -- tests/openInstrument.limitReplayRunnerExecutionBaseContract.v0.1.spec.ts --runInBand`
* `npm test -- tests/openInstrument.brainCandidateSearchPrompt.isolationAudit.guard.v0.1.spec.ts --runInBand`
* `node scripts/openInstrumentZhejiSemanticTransparencyValidation.v0.1.mjs`
* `npm test -- tests/openInstrument.zhejiSemanticTransparencyValidation.v0.1.spec.ts --runInBand`
* `npm run gate:quick`
* `git diff --check`
* exact changed-file proof

All passed before merge.

## Boundary proof

No replay execution occurred in this review PR.

No provider execution occurred in this review PR.

No model call occurred in this review PR.

No localhost/Ollama call occurred in this review PR.

No OpenAI-compatible endpoint call occurred in this review PR.

No remote endpoint use occurred in this review PR.

No hosted OpenAI execution occurred in this review PR.

No DeepSeek execution occurred in this review PR.

No model switching occurred in this review PR.

No runtime/API/UI behavior changes occurred in this review PR.

No source behavior changes occurred in this review PR.

No schema changes occurred in this review PR.

No validator weakening occurred in this review PR.

No package metadata changes occurred in this review PR.

No CI changes occurred in this review PR.

No artifact mutation occurred in this review PR.

No evidence promotion occurred in this review PR.

No publication framing occurred in this review PR.

No VoiceLab work occurred in this review PR.
