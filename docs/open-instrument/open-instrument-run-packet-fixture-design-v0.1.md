# Open Instrument Run Packet Fixture Design v0.1

## Status

Design only.

Fixture design only.

No runnable fixture is created.

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

This fixture design follows the accepted Open Instrument loop:

Design → Preflight → Run Packet → Provider Execution → Capture → Verification → Archive and Report → Review and Closure

This design is grounded in:

- PR #1281 / `216524f7`
- PR #1282 / `be9353d17f8962b307a777244ecdc3e47cd9792c`
- PR #1283 / `3220744a6cc94686c27197fcaf88af3dacb03fd0`
- PR #1284 / `82f975ce1ac68ea79dfc980252aedfb7793400fa`
- `docs/open-instrument/open-instrument-working-loop-design-v0.1.md`
- `docs/open-instrument/open-instrument-working-loop-design-review-v0.1.md`
- `docs/open-instrument/open-instrument-run-packet-contract-design-v0.1.md`
- `docs/open-instrument/open-instrument-run-packet-contract-design-review-v0.1.md`

The run packet contract has been accepted as the required pre-execution control-object design.

## Purpose

This design defines the first static run packet fixture shape.

The fixture design prepares a future fixture that is:

- non-runnable
- deterministic
- committed later as static test data
- reviewable before validator implementation
- suitable for future fixture validation
- explicit about identity fields
- explicit about segmentation fields
- explicit about provider fields
- explicit about prompt and schema fields
- explicit about artifact, report, and review paths
- explicit about authorization fields
- explicit about boundaries
- explicit about stop conditions
- explicit about evidence class intent

## Fixture principle

The fixture must not call a model.

The fixture must not authorize a model call.

The fixture must not create artifact JSON.

The fixture must not create a report from a model response.

The fixture must not rely on runtime defaults.

The fixture must not change provider defaults.

The fixture must not imply OpenAI API use.

The fixture must not imply publication framing.

The fixture must not collapse design intent into executable behavior.

The fixture must be static data only.

## Fixture scope

The fixture is the first non-runnable example of the run packet contract.

The fixture should later be committed as a static reference object that can be validated without executing a model.

The fixture should support review of contract completeness before any validator implementation is written.

The fixture should remain separate from artifact JSON and separate from report generation.

The fixture should remain separate from provider execution and separate from preflight execution.

## Required fixture fields

The fixture must make explicit at least these field families:

- identity
- segmentation
- provider
- prompt and schema
- artifact, report, and review paths
- authorization
- boundaries
- stop conditions
- evidence class intent
- notes

## Identity posture

Identity fields should be explicit and stable.

Required identity fields:

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

The fixture must show which run it describes.

The fixture must not leave identity implied.

Identity drift is a review issue, not a hidden assumption.

## Segmentation posture

Segmentation fields should be explicit and reviewable.

Required segmentation fields:

- `chunks`
- `chunkVariants`
- `voicePath`
- `legalTransforms`
- `functionHints`

The fixture must show how the run packet decomposes the target.

Chunk variants must be explicit.

Legal transforms must be explicit.

Function hints must be explicit.

## Provider posture

Provider fields should be explicit and non-implicit.

Required provider fields:

- `provider`
- `model`
- `providerProfile`
- `endpointType`
- `timeoutBudget`

The fixture must distinguish a local OpenAI-compatible endpoint from OpenAI API use.

The fixture must not infer provider defaults from environment.

The fixture must not imply that provider execution has already occurred.

## Prompt and schema posture

Prompt and schema fields should be explicit and reviewable.

Required prompt and schema fields:

- `promptContractPath`
- `expectedOutputSchema`
- `validatorExpectations`

The fixture must name the future prompt contract.

The fixture must name the expected output schema.

The fixture must name the validator expectations.

The fixture is not the validator.

The fixture is not the prompt implementation.

## Artifact, report, and review posture

Artifact, report, and review fields should be explicit and separated.

Required path fields:

- `artifactPath`
- `reportPath`
- `reviewPath`
- `sourceDesignPath`
- `sourcePreflightPath`

The fixture must identify where a future artifact would live.

The fixture must identify where a future report would live.

The fixture must identify where a future review would live.

The fixture must not create those files.

The fixture must not assume those files already exist.

The fixture must not blur report-backed evidence into direct-artifact-backed evidence.

## Authorization posture

Authorization fields must be explicit and false unless a later approved design changes them.

Required authorization fields:

- `modelCallAuthorization`
- `artifactCreationAuthorization`
- `rerunAuthorization`
- `openAiApiAuthorization`

For this fixture design, those authorizations must be explicit false values or explicit false-equivalent enums.

The fixture must show that no model call is authorized.

The fixture must show that no artifact JSON creation is authorized.

The fixture must show that no rerun is authorized.

The fixture must show that no OpenAI API use is authorized.

## Boundary posture

Boundary fields must be explicit and non-overlapping.

Required boundary fields:

- `claimBoundary`
- `publicationBoundary`
- `providerDefaultBoundary`

The fixture must state that the design is not origin evidence.

The fixture must state that the design is not candidate-truth evidence.

The fixture must state that the design is not publication framing.

The fixture must state that the design does not change provider defaults.

## Stop-condition posture

The fixture must define the conditions that stop future execution before provider activity.

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

The fixture is useful only if it makes stop conditions visible before execution.

## Evidence-class intent

The fixture must declare the intended evidence class.

Allowed evidence class values for the future packet design:

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

For this fixture design, the intended evidence class is design-only.

Clean schema evidence is not candidate-truth evidence.

Clean traceability evidence is not origin evidence.

Hard-case stress evidence is not failure evidence.

Design-only packet evidence is not run evidence.

## Non-runnable example posture

The fixture design may include a static example shape later, but the example must remain non-runnable.

The example must not be interpreted as a live packet.

The example must not authorize execution.

The example must not substitute for a validator.

The example must not be treated as evidence of a run.

## Validation expectations

A future validator for the fixture should check:

- required fields exist
- identity fields are stable
- segmentation fields are explicit
- provider fields are explicit
- prompt and schema fields are explicit
- artifact, report, and review paths are explicit
- authorization fields are explicit
- boundary fields are explicit
- stop conditions are present
- evidence class intent is allowed
- false authorization is preserved

This design does not implement that validator.

## Accepted next action

The next accepted action after this design lands is:

`docs/open-instrument: review open instrument run packet fixture design`

After that review lands, the next likely action is implementation of a static fixture validator.

Do not recommend a model call yet.

Do not recommend provider execution yet.

## Final design decision

The Open Instrument run packet fixture is designed as the first static non-runnable example of the accepted run packet contract.

The fixture exists to make contract completeness reviewable before validator implementation.

No provider execution should occur before a reviewed run packet contract and a reviewed run packet fixture exist.
