# Open Instrument Run Packet Contract Design v0.1

## Status

Design only.

No model call.

No rerun.

No implementation.

No artifact JSON creation.

No prompt change.

No validator change.

No source implementation change.

No runtime/API/UI wiring.

No provider default change.

No OpenAI API use.

No publication framing.

## Source foundation

This design is grounded in:

- PR #1281 / `216524f7`
- PR #1282 / `be9353d17f8962b307a777244ecdc3e47cd9792c`
- `docs/open-instrument/open-instrument-working-loop-design-v0.1.md`
- `docs/open-instrument/open-instrument-working-loop-design-review-v0.1.md`

The working-loop design and review accepted the staged loop:

Design → Preflight → Run Packet → Provider Execution → Capture → Verification → Archive and Report → Review and Closure

This document designs the contract for the Run Packet stage.

## Purpose

The run packet is the central pre-execution control object.

The run packet must make a future Open Instrument run:

- reviewable before execution
- reproducible after execution
- auditable during review
- bounded against overclaiming
- explicit about provider and model usage
- explicit about artifact and report paths
- explicit about claim boundaries
- explicit about publication boundaries
- explicit about whether model execution is authorized

## Contract principle

The run packet must not contain hidden defaults.

The run packet must not rely on provider-default behavior.

The run packet must not authorize OpenAI API use by implication.

The run packet must not authorize publication by implication.

The run packet must not convert design intent into evidence.

The run packet must be complete before provider execution.

## Required top-level fields

The run packet contract requires these top-level fields:

- `schemaVersion`
- `packetId`
- `runId`
- `createdAt`
- `createdBy`
- `status`
- `word`
- `normalizedWord`
- `targetObject`
- `segmentationId`
- `segmentationLabel`
- `chunks`
- `chunkVariants`
- `voicePath`
- `legalTransforms`
- `functionHints`
- `targetLanguages`
- `searchMode`
- `provider`
- `model`
- `providerProfile`
- `endpointType`
- `timeoutBudget`
- `promptContractPath`
- `expectedOutputSchema`
- `artifactPath`
- `reportPath`
- `reviewPath`
- `sourceDesignPath`
- `sourcePreflightPath`
- `claimBoundary`
- `publicationBoundary`
- `providerDefaultBoundary`
- `modelCallAuthorization`
- `artifactCreationAuthorization`
- `rerunAuthorization`
- `openAiApiAuthorization`
- `validatorExpectations`
- `stopConditions`
- `evidenceClassIntent`
- `notes`

## Identity fields

Identity fields:

- `packetId`
- `runId`
- `word`
- `normalizedWord`
- `targetObject`
- `segmentationId`
- `segmentationLabel`

These fields identify the exact run the packet authorizes or prepares.

Identity drift must stop execution or review.

`segmentationId` drift is a hard review issue.

## Segmentation fields

Segmentation fields:

- `chunks`
- `chunkVariants`
- `voicePath`
- `legalTransforms`
- `functionHints`

These fields define the input decomposition and allowable transformations.

Chunk drift must be preserved as evidence, not hidden.

Chunk variants must be explicit, not implied.

## Provider fields

Provider fields:

- `provider`
- `model`
- `providerProfile`
- `endpointType`
- `timeoutBudget`

These fields make provider use explicit.

The provider must be explicit.

The model must be explicit.

The endpoint type must distinguish a local OpenAI-compatible endpoint from OpenAI API use.

Local Ollama via an OpenAI-compatible endpoint is not OpenAI API use.

Provider execution does not mutate default provider behavior.

Provider defaults must not be inferred from environment.

## Prompt and schema fields

Prompt and schema fields:

- `promptContractPath`
- `expectedOutputSchema`
- `validatorExpectations`

These fields define the contract that the future run must follow.

The prompt contract must exist before execution.

The expected output schema must be named before execution.

The validator expectations must be named before execution.

Missing prompt contract is a stop condition.

## Artifact, report, and review fields

Artifact, report, and review fields:

- `artifactPath`
- `reportPath`
- `reviewPath`
- `sourceDesignPath`
- `sourcePreflightPath`

These fields separate machine evidence from human interpretation.

The target artifact path must be absent before a new run.

The target report path must be absent before a new report.

Artifact and report are separate.

Review does not create new model evidence.

Report-backed evidence must not be inflated into direct-artifact-backed evidence.

## Authorization fields

Authorization fields:

- `modelCallAuthorization`
- `artifactCreationAuthorization`
- `rerunAuthorization`
- `openAiApiAuthorization`

These fields must be explicit booleans or explicit enum values.

`modelCallAuthorization` must be false unless a prior design and preflight explicitly allow execution.

`openAiApiAuthorization` must be false unless separately authorized.

Artifact JSON creation must be explicit.

Rerun authorization must be explicit.

Authorization cannot be inferred from the PR title.

## Boundary fields

Boundary fields:

- `claimBoundary`
- `publicationBoundary`
- `providerDefaultBoundary`

These fields protect the run from overclaiming.

Origin claims are forbidden.

Winner claims are forbidden.

Candidate-truth claims are forbidden.

Language-superiority claims are forbidden.

Model-quality proof claims are forbidden.

Publication framing is forbidden unless separately authorized.

Provider-default mutation is forbidden unless separately authorized.

## Stop conditions

The run packet must carry explicit stop conditions.

Required stop conditions include:

- implicit provider
- implicit model
- missing prompt contract
- missing artifact path
- missing report path
- existing target artifact
- existing target report
- ambiguous OpenAI API use
- ambiguous provider default behavior
- absent claim boundary
- absent publication boundary
- missing validator expectations
- segmentationId drift
- chunk drift
- enum array drift
- forbidden claims
- hidden null candidates
- provider default claims

## Evidence class intent

The run packet must declare the intended evidence class.

Allowed values:

- `design-only`
- `preflight-only`
- `direct-artifact-backed`
- `report-backed`
- `repair predecessor`
- `reviewed direct evidence`
- `clean schema evidence`
- `clean traceability evidence`
- `hard-case stress evidence`
- `closed lane`

Clean schema evidence is not candidate-truth evidence.

Clean traceability evidence is not origin evidence.

Hard-case stress evidence is not failure evidence.

Design-only packet evidence is not run evidence.

## Example packet shape

Non-runnable example shape:

  schemaVersion: "v0.1"
  packetId: "runpkt_0001"
  runId: "study.segmentation.004-run-001"
  createdAt: "2026-06-12T00:00:00Z"
  createdBy: "open-instrument"
  status: "planned"
  word: "study"
  normalizedWord: "study"
  targetObject: "study.segmentation.004"
  segmentationId: "study.segmentation.004"
  segmentationLabel: "S + TU + DI"
  chunks: ["S", "TU", "DI"]
  chunkVariants: ["S", "TU", "DI"]
  voicePath: ["..."]
  legalTransforms: ["..."]
  functionHints: ["..."]
  targetLanguages: ["..."]
  searchMode: "local-provider"
  provider: "ollama"
  model: "llama3.1:8b"
  providerProfile: "local-openai-compatible"
  endpointType: "openai-compatible-local"
  timeoutBudget: "300000ms"
  promptContractPath: "docs/open-instrument/..."
  expectedOutputSchema: "open-instrument-..."
  artifactPath: "docs/open-instrument/artifacts/..."
  reportPath: "docs/open-instrument/..."
  reviewPath: "docs/open-instrument/..."
  sourceDesignPath: "docs/open-instrument/open-instrument-working-loop-design-v0.1.md"
  sourcePreflightPath: "docs/open-instrument/..."
  claimBoundary: "development-only; not origin evidence"
  publicationBoundary: "not publication framing"
  providerDefaultBoundary: "provider default remains unchanged"
  modelCallAuthorization: false
  artifactCreationAuthorization: false
  rerunAuthorization: false
  openAiApiAuthorization: false
  validatorExpectations: ["required fields present", "identity stable"]
  stopConditions: ["implicit provider", "missing prompt contract"]
  evidenceClassIntent: "design-only"
  notes: "placeholder run packet for review only"

This example is non-runnable and uses placeholder values only.

## Validation expectations

A future validator should check:

- required fields exist
- identity fields are stable
- chunks are explicit
- provider is explicit
- model is explicit
- endpoint type is explicit
- prompt contract path exists
- artifact path is present
- report path is present
- authorization fields are explicit
- claim boundaries exist
- publication boundaries exist
- OpenAI API authorization is explicit
- provider default boundary is explicit
- evidence class intent is allowed
- stop conditions are present

This design does not implement the validator.

## Accepted next action

The next accepted action after this design lands is:

`docs/open-instrument: review open instrument run packet contract design`

After that review lands, the next likely action is:

`docs/open-instrument: design open instrument run packet fixture`

Do not recommend implementation yet.

Do not recommend a model call yet.

## Final design decision

The Open Instrument run packet contract is designed as the required pre-execution control object for future Open Instrument runs.

No provider execution should occur before a reviewed run packet contract and a reviewed run packet fixture exist.
