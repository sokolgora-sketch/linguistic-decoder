# `limit` Replay Runner Provider Message-Content Extraction Repair v0.1 — Review

Status: LIMIT_REPLAY_RUNNER_PROVIDER_MESSAGE_CONTENT_EXTRACTION_REPAIR_REVIEWED_ACCEPTED.

Scope: docs-only review of provider message-content extraction repair.

Review date: 2026-06-21.

Reviewed repair base:

* Short SHA: `451bd1f8`
* Full SHA: `451bd1f8012fabb0d51d2071aecc990d75add5e1`
* Subject: `test(open-instrument): repair limit replay runner provider message-content extraction v0.1`

Reviewed runner:

* `scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`

Reviewed static contract test:

* `tests/openInstrument.limitReplayRunnerExecutionBaseContract.v0.1.spec.ts`

Existing passive artifact:

* `docs/open-instrument/artifacts/zheji-generalization/limit-generalization-replay-v0.1.json`

## Review decision

The provider message-content extraction repair is accepted.

The repair targets the exact inspected parsing site inside `analyzeResponse`:

`parsed = JSON.parse(rawResponseText)`

The repair now parses the OpenAI-compatible chat completion envelope first, then extracts:

`choices[0].message.content`

That extracted message content is used as the candidate-response JSON before validation.

## Accepted runner behavior

The runner now includes:

* `extractOpenAiCompatibleMessageContentPayload(parsedPayload)`
* `parsedPayload?.choices?.[0]?.message?.content`
* `const rawParsedProviderResponse = JSON.parse(rawResponseText);`
* `parsed = extractOpenAiCompatibleMessageContentPayload(rawParsedProviderResponse);`

## Accepted test guard

The static contract test now confirms message-content extraction before validation.

The test explicitly checks:

* the extraction helper exists
* `choices[0].message.content` is inspected
* raw response JSON is parsed into `rawParsedProviderResponse`
* validation uses `extractOpenAiCompatibleMessageContentPayload(rawParsedProviderResponse)`

## Boundary decision

The repair does not rerun replay.

The repair does not mutate the artifact.

The repair does not change the prompt.

The repair does not change the provider.

The repair does not change the model.

The repair does not weaken validation.

The repair does not promote evidence.

## What this review means

The runner is ready for one new separate reviewed local-only `limit` replay.

The next replay should test whether extraction turns the previous `REPLAY_INVALIDATED / VALIDATION_FAILED` result into either:

* `GENERALIZATION_NULL_ACCEPTED`
* `GENERALIZATION_SIGNAL_PRESENT`
* or a new concrete invalidation reason

## Required next task

`test(open-instrument): execute reviewed limit replay after provider message-content extraction repair v0.1`

Required execution posture:

* exact same word: `limit`
* exact same stage: `MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`
* exact same segmentation: `LI + MIT`
* exact same provider: `ollama_openai_compat`
* exact same model: `llama3.1:8b`
* exact same endpoint class: `localhost_only`
* exact same passive artifact path
* no prompt change
* no provider/model change
* no validator weakening
* no evidence promotion
* no publication framing

## Validation proof

The review ran:

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

No prompt change occurred in this review PR.

No validator weakening occurred in this review PR.

No runtime/API/UI behavior changes occurred in this review PR.

No source behavior changes occurred in this review PR.

No schema changes occurred in this review PR.

No package metadata changes occurred in this review PR.

No CI changes occurred in this review PR.

No artifact mutation occurred in this review PR.

No evidence promotion occurred in this review PR.

No publication framing occurred in this review PR.

No VoiceLab work occurred in this review PR.
