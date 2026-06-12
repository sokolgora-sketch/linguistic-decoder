# Open Instrument Run Packet Contract Design Review v0.1

## 1. Status

Review only.

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

## 2. Reviewed source

Reviewed PR: PR #1283

Reviewed merge SHA: `3220744a6cc94686c27197fcaf88af3dacb03fd0`

Reviewed source document:

- `docs/open-instrument/open-instrument-run-packet-contract-design-v0.1.md`

Reviewed foundation:

- PR #1281 / `216524f7`
- PR #1282 / `be9353d17f8962b307a777244ecdc3e47cd9792c`

This review evaluates whether the run packet contract design can be accepted as the pre-execution control-object design for future Open Instrument runs.

## 3. Review purpose

This review does not create new run evidence.

This review does not authorize model execution.

This review does not authorize implementation.

This review does not authorize artifact JSON creation.

This review accepts or rejects the contract boundaries.

## 4. Source summary

The run packet is the central pre-execution control object.

The run packet must make a future Open Instrument run reviewable before execution.

The run packet must make a future run reproducible after execution.

The run packet must make a future run auditable during review.

The run packet must be explicit about provider and model usage.

The run packet must be explicit about artifact, report, and review paths.

The run packet must be explicit about claim, publication, provider-default, and OpenAI API boundaries.

The run packet must not rely on hidden defaults.

The accepted loop remains:

Design → Preflight → Run Packet → Provider Execution → Capture → Verification → Archive and Report → Review and Closure

## 5. Contract-principle review

The design correctly states that the run packet must not contain hidden defaults.

The design correctly states that the run packet must not rely on provider-default behavior.

The design correctly states that the run packet must not authorize OpenAI API use by implication.

The design correctly states that the run packet must not authorize publication by implication.

The design correctly states that the run packet must not convert design intent into evidence.

The design correctly states that the run packet must be complete before provider execution.

Decision:

The contract principle is accepted.

## 6. Required-field review

The required top-level field families are accepted:

- identity fields
- segmentation fields
- provider fields
- prompt and schema fields
- artifact, report, and review fields
- authorization fields
- boundary fields
- stop conditions
- evidence class intent
- notes

These families are sufficient for a future fixture and validator design.

## 7. Identity-field review

Reviewed fields:

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

Decision:

Identity fields are accepted as required.

Identity drift must stop execution or review.

`segmentationId` drift is a hard review issue.

## 8. Segmentation-field review

Reviewed fields:

- `chunks`
- `chunkVariants`
- `voicePath`
- `legalTransforms`
- `functionHints`

Decision:

Segmentation fields are accepted as required.

Chunks must be explicit.

Chunk variants must be explicit, not implied.

Chunk drift must be preserved as evidence, not hidden.

## 9. Provider-field review

Reviewed fields:

- `provider`
- `model`
- `providerProfile`
- `endpointType`
- `timeoutBudget`

Decision:

Provider fields are accepted as required.

The provider must be explicit.

The model must be explicit.

The endpoint type must distinguish a local OpenAI-compatible endpoint from OpenAI API use.

Local Ollama through an OpenAI-compatible endpoint is not OpenAI API use.

Provider execution does not mutate default provider behavior.

Provider defaults must not be inferred from environment.

## 10. Prompt/schema-field review

Reviewed fields:

- `promptContractPath`
- `expectedOutputSchema`
- `validatorExpectations`

Decision:

Prompt contract, expected output schema, and validator expectations are accepted as required.

The prompt contract must exist before execution.

The expected output schema must be named before execution.

The validator expectations must be named before execution.

Missing prompt contract is a stop condition.

This review does not implement a validator.

## 11. Artifact/report/review-field review

Reviewed fields:

- `artifactPath`
- `reportPath`
- `reviewPath`
- `sourceDesignPath`
- `sourcePreflightPath`

Decision:

Artifact, report, and review fields are accepted as required.

The target artifact path must be absent before a new run.

The target report path must be absent before a new report.

Artifact and report are separate.

Review does not create new model evidence.

Report-backed evidence must not be inflated into direct-artifact-backed evidence.

## 12. Authorization-field review

Reviewed fields:

- `modelCallAuthorization`
- `artifactCreationAuthorization`
- `rerunAuthorization`
- `openAiApiAuthorization`

Decision:

Authorization fields are accepted as required.

Model-call authorization must be explicit.

Artifact JSON creation must be explicit.

Rerun authorization must be explicit.

OpenAI API authorization must be explicit.

Authorization cannot be inferred from the PR title.

This review authorizes none of them.

## 13. Boundary-field review

Reviewed fields:

- `claimBoundary`
- `publicationBoundary`
- `providerDefaultBoundary`

Decision:

Boundary fields are accepted as required.

Origin claims are forbidden.

Winner claims are forbidden.

Candidate-truth claims are forbidden.

Language-superiority claims are forbidden.

Model-quality proof claims are forbidden.

Publication framing is forbidden unless separately authorized.

Provider-default mutation is forbidden unless separately authorized.

## 14. Stop-condition review

Accepted stop conditions:

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

These stop conditions are sufficient for the next fixture design.

## 15. Evidence-class review

Reviewed `evidenceClassIntent`.

Allowed values accepted for the future packet design:

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

Decision:

Clean schema evidence is not candidate-truth evidence.

Clean traceability evidence is not origin evidence.

Hard-case stress evidence is not failure evidence.

Design-only packet evidence is not run evidence.

## 16. Example-shape review

The source design example is acceptable only as a non-runnable shape.

It is not runnable JSON.

It does not include secrets.

It does not include real provider credentials.

It does not authorize a model call.

It is useful for designing the future fixture.

## 17. Validation-expectation review

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

This review does not implement the validator.

Validator design should come after the fixture design or alongside it, not before the contract is reviewed.

## 18. Accepted next action

The next accepted action after this review lands is:

`docs/open-instrument: design open instrument run packet fixture`

After that fixture design lands and is reviewed, implementation may begin with a static fixture validator, still without model execution.

Do not recommend a model call yet.

Do not recommend provider execution yet.

## 19. Final review decision

The Open Instrument run packet contract design is accepted as the pre-execution control-object design for future Open Instrument runs.

The contract boundaries are accepted.

The next lane remains docs-only fixture design.
