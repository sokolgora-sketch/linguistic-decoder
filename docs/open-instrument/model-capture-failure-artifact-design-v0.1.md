# Open Instrument Model Capture Failure Artifact Design v0.1

Date: 2026-06-04

Status: design only.

This document defines how Open Instrument records model-call failures that happen before a Brain output artifact can be produced.

This is not scientific evidence, not publication evidence, not eval evidence, not Cohort evidence, not model-quality evidence, and not a change to the default provider contract.

---

## 1. Purpose

The purpose is to define a separate artifact format for operational model-capture failures.

A model-capture failure happens when Open Instrument attempts to call a model, but the call fails before a usable Brain output exists.

Examples:

- timeout;
- local server unavailable;
- provider error;
- malformed provider response;
- interrupted request;
- transport failure.

These failures must be archived without pretending they are successful Heart-to-Brain prototype artifacts.

---

## 2. Context

Recent Open Instrument sequence:

- PR #1176 archived `study.segmentation.004` / `S + TU + DI` v0.1 as a negative/diagnostic Heart-to-Brain artifact.
- PR #1177 reviewed the v0.1 failure and diagnosed narrow null-candidate traceability drift.
- PR #1178 reinforced the null-candidate traceability contract.

After PR #1178, a controlled rerun of `study.segmentation.004` v0.2 was attempted.

Attempted target:

- word: `study`
- segmentation: `study.segmentation.004`
- chunks: `S + TU + DI`
- model: local Ollama `qwen3:8b`
- endpoint: `http://localhost:11434/v1/chat/completions`

Capture result:

- first attempt timed out after `120000 ms`;
- retry timed out after `600000 ms`;
- no artifact JSON was written;
- no result doc was written;
- no commit was made;
- no PR was opened;
- no DF_BRAIN update was made;
- repo stayed clean on branch `docs/open-instrument-study-segmentation-004-v0.2-prototype`.

This design exists so future timeout/failure attempts can be archived cleanly.

---

## 3. Problem

Model-call failures can happen before Brain output exists.

When that happens:

- no Brain JSON exists;
- no parsed Brain output exists;
- no validator result exists;
- no candidate rows exist;
- no null candidate rows exist;
- no model-quality conclusion can be drawn.

Forcing this into the normal Heart-to-Brain artifact shape would be misleading.

The failure needs its own artifact type.

---

## 4. Design decision

Create a separate artifact type:

`open-instrument-model-capture-failure`

This artifact type records an operational capture failure.

It is not:

- a Brain-output artifact;
- a validation artifact;
- a candidate-search artifact;
- an eval artifact;
- a Cohort artifact;
- a publication artifact.

It exists to preserve traceability of failed capture attempts.

---

## 5. Path convention

Folder:

`docs/open-instrument/artifacts/model-capture-failure/`

Filename pattern:

`<date>-<target>-<provider>-<model>-<failure-kind>-v0.1.json`

Example:

`2026-06-04-study-segmentation-004-ollama-qwen3-8b-timeout-v0.1.json`

Rules:

- Use lowercase.
- Replace dots and colons with hyphens where useful.
- Include target.
- Include provider or runtime.
- Include model.
- Include failure kind.
- Version the artifact.

---

## 6. Required JSON shape

A model-capture failure artifact must include:

- `archiveVersion`
- `artifactType`
- `createdAt`
- `repo`
- `target`
- `provider`
- `modelCall`
- `failure`
- `attempts`
- `heartInputAvailable`
- `brainPromptBuilt`
- `rawResponseAvailable`
- `parsedBrainOutputAvailable`
- `validationAvailable`
- `comparison`
- `claimBoundary`
- `redaction`

Recommended shape:

- `archiveVersion`: `"v0.1"`
- `artifactType`: `"open-instrument-model-capture-failure"`
- `createdAt`: ISO timestamp
- `repo`: project, repository, commit, branch, workingTree
- `target`: word, segmentationId, embryoMorphemes, currentImplementationField
- `provider`: provider, runtime, baseUrl, model, apiKeyStored
- `modelCall`: requestBuilt, responseReceived, rawContentReceived
- `failure`: the operational failure summary
- `attempts`: ordered attempt records
- `heartInputAvailable`: boolean
- `brainPromptBuilt`: boolean
- `rawResponseAvailable`: boolean
- `parsedBrainOutputAvailable`: boolean
- `validationAvailable`: boolean
- `comparison`: links back to the relevant prototype context
- `claimBoundary`: explicit non-claim boundary
- `redaction`: secret-handling state

This shape intentionally stops short of pretending a Brain output exists.

---

## 7. Failure fields

The `failure` object must include:

- `kind`
- `message`
- `stage`
- `isOperationalFailure`
- `isModelQualityFailure`
- `isValidationFailure`

Recommended semantics:

- `kind`: `timeout`, `provider_error`, `transport_error`, `malformed_response`, or another explicit failure kind
- `message`: short operator-facing description
- `stage`: where the failure happened, such as `model_call`
- `isOperationalFailure`: `true` for capture/transport/provider failures
- `isModelQualityFailure`: `false` unless a real output existed and was judged poor
- `isValidationFailure`: `false` unless a Brain output existed and validation failed

This keeps operational failures separate from output-quality failures.

---

## 8. Attempt fields

The `attempts` array must include records with:

- `attempt`
- `timeoutMs`
- `result`
- `errorMessage`
- `startedAt`
- `endedAt` if available

Recommended semantics:

- `attempt`: 1-based attempt index
- `timeoutMs`: the timeout budget used for that attempt
- `result`: `timeout`, `provider_error`, `transport_error`, `success`, or another explicit terminal result
- `errorMessage`: the error string if one exists
- `startedAt`: ISO timestamp when the attempt started
- `endedAt`: ISO timestamp when the attempt ended, if known

For the current failed rerun, the attempt list should record both the `120000 ms` timeout and the `600000 ms` retry timeout.

---

## 9. Comparison pointers

The failure artifact should keep comparison pointers when useful, especially to:

- PR #1176 and the `study.segmentation.004` v0.1 diagnostic artifact;
- PR #1177 and its review;
- PR #1178 and the null-candidate traceability reinforcement;
- successful `study.segmentation.002` v0.2 artifact;
- successful `study.segmentation.003` artifact.

Comparison pointers are contextual metadata.
They do not turn a timeout into a validated Brain output.

---

## 10. Result-doc convention

An optional companion result doc may be created alongside the failure artifact.

Recommended path:

`docs/open-instrument/<target>-<model>-capture-failure-v0.1.md`

For this case:

`docs/open-instrument/study-segmentation-004-qwen3-8b-capture-failure-v0.1.md`

The result doc must clearly say:

- no Brain output existed;
- no validator result existed;
- failure was an operational capture timeout.

The result doc is optional, but when it exists it must not imply output validation.

---

## 11. Current case mapping

Current failed capture attempt:

- target: `study.segmentation.004`
- chunks: `S + TU + DI`
- model: `qwen3:8b`
- provider path: local Ollama through OpenAI-compatible endpoint
- endpoint: `http://localhost:11434/v1/chat/completions`
- failure kind: `timeout`
- attempt 1 timeout: `120000 ms`
- attempt 2 timeout: `600000 ms`

This is exactly the kind of event that should use the new failure artifact format.

---

## 12. Claim boundary

This design is not:

- scientific evidence;
- publication evidence;
- eval evidence;
- Cohort evidence;
- model-quality evidence;
- candidate-truth evidence;
- language-origin evidence;
- validator failure;
- a reason to change the default provider from `mock`.

It is an operational capture-failure design note only.

---

## 13. Recommended next action

After this design PR, create a timeout artifact and companion result doc for the failed `study.segmentation.004` v0.2 attempt.

Then decide whether to retry with reduced target languages or switch local model.

---

## 14. Completion definition

This design is complete when:

- the artifact type is defined;
- the path convention is defined;
- the required JSON shape is defined;
- the failure fields are defined;
- the attempt fields are defined;
- the claim boundary is explicit;
- the optional result-doc convention is explicit;
- the current case mapping is explicit;
- no model call was made by this PR;
- no artifact JSON was created by this PR;
- no result doc for the timeout event was created by this PR;
- local validation passes.
