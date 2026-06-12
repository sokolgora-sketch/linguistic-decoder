# Open Instrument Working Loop Design Review v0.1

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

Reviewed PR: PR #1281

Reviewed merge SHA: `216524f7`

Reviewed source document:

- `docs/open-instrument/open-instrument-working-loop-design-v0.1.md`

This review evaluates whether the design can become the system-level foundation for the next Open Instrument phase.

## 3. Review purpose

This review does not create new evidence.

This review does not authorize model execution.

This review does not authorize source implementation.

This review accepts or rejects the design boundaries.

## 4. Source summary

The design moves Open Instrument from isolated document lanes toward a controlled operating loop.

The loop is staged.

The run packet becomes the future central control object.

Provider execution is the only stage that may call a model.

Capture preserves raw behavior.

Verification classifies structure and traceability, not truth.

Archive and report are separated.

Review and closure prevent overclaiming.

Exact staged loop:

Design → Preflight → Run Packet → Provider Execution → Capture → Verification → Archive and Report → Review and Closure

## 5. Structural review

The design is accepted because it separates planning from execution.

The design is accepted because it separates preflight from model call.

The design is accepted because it separates raw artifact from human report.

The design is accepted because it separates evidence from interpretation.

The design is accepted because it separates review from closure.

The design is accepted because it keeps implementation behind design.

## 6. Stage review

### 6.1 Design

Accepted.

The design stage defines the target, comparison set, evidence question, provider allowance, model allowance, artifact paths, report paths, validator expectations, interpretation boundaries, and stop conditions.

This is the correct place to decide whether a model call is authorized.

### 6.2 Preflight

Accepted.

Preflight is the correct readiness gate for branch state, clean working tree, path absence, provider profile, model, timeout policy, and prompt contract.

Preflight must stay separate from model execution.

### 6.3 Run packet

Accepted as the future control object.

The run packet is the correct place to freeze runId, word, segmentationId, chunks, provider, model, timeoutBudget, promptContract, expectedOutputSchema, artifactPath, reportPath, reviewPath, and claim boundaries.

The run packet must not contain hidden defaults.

The run packet must not rely on provider-default behavior.

### 6.4 Provider execution

Accepted as the only model-call stage.

This boundary is correct because only one stage should be allowed to invoke a model, and that stage must be explicitly authorized.

Local Ollama through an OpenAI-compatible endpoint is a provider profile.

It is not OpenAI API use.

### 6.5 Capture

Accepted.

Capture is the correct place to preserve raw text, parsed output, failures, provider metadata, and run packet references.

Failures are evidence.

A timeout, malformed response, missing field, enum mismatch, or null candidate is evidence.

### 6.6 Verification

Accepted.

Verification is the correct place to classify schema and traceability, not truth.

Verification should remain strict about identity, segmentation, chunk preservation, enum discipline, sourceNote presence, warnings presence, claimBoundary presence, and forbidden claim absence.

### 6.7 Archive and report

Accepted.

Archive and report must remain separate.

The artifact must preserve machine-readable evidence.

The report must preserve human-readable interpretation.

### 6.8 Review and closure

Accepted.

Review and closure are necessary to prevent overclaiming and accidental reopening of finished lanes.

Closure must state what is closed, what remains open, and what future action is allowed.

## 7. Evidence-class review

Accepted evidence classes:

- design-only
- preflight-only
- direct-artifact-backed
- report-backed
- repair predecessor
- reviewed direct evidence
- clean schema evidence
- clean traceability evidence
- hard-case stress evidence
- closed lane

The evidence classes are useful because they keep evidence status explicit.

Clean schema evidence is not candidate-truth evidence.

Clean traceability evidence is not origin evidence.

Hard-case stress evidence is not failure evidence.

Report-backed evidence must not be inflated into direct-artifact-backed evidence.

Closed lanes must not be reopened accidentally.

## 8. Claim-boundary review

Open Instrument may claim:

- schema behavior
- traceability behavior
- provider behavior
- parser behavior
- verifier behavior
- artifact status
- report status
- review status
- closure status
- diagnostic pressure
- missing-value discipline

Open Instrument must not claim:

- origin
- winner
- candidate truth
- language superiority
- model quality proof
- scientific proof
- publication readiness
- provider default change

## 9. Provider-boundary review

Accepted.

The default provider must remain unchanged unless a dedicated provider-default PR changes it.

Local Ollama success does not authorize provider default mutation.

OpenAI-compatible local endpoint use is not OpenAI API use.

OpenAI API use requires separate explicit authorization.

No provider default change is accepted by this review.

## 10. Automation-boundary review

Accept future automation for:

- run packet validation
- artifact path preflight
- report path preflight
- provider profile validation
- prompt contract validation
- output schema validation
- evidence classification
- registry indexing

Reject automation for:

- declaring origin
- declaring candidate truth
- selecting a winner
- publishing results
- changing provider defaults
- hiding null candidates
- erasing failed runs
- upgrading report-backed evidence into direct-artifact-backed evidence

## 11. Stop-condition review

Accepted stop conditions include:

- implicit provider
- implicit model
- missing artifact path
- missing report path
- missing prompt contract
- existing target artifact path
- existing target report path
- ambiguous OpenAI API use
- ambiguous provider default behavior
- absent claim boundary
- absent publication boundary
- parser failure
- verifier failure
- identity drift
- segmentationId drift
- chunk drift
- enum array drift
- forbidden claims
- hidden null candidates
- provider default claims

## 12. Accepted next action

The next accepted action after this review lands is:

`docs/open-instrument: design open instrument run packet contract`

Do not recommend implementation yet.

Do not recommend a model call yet.

## 13. Final review decision

The Open Instrument working-loop design is accepted as the system-level design foundation for the next Open Instrument phase.

The next phase should define the run packet contract before any implementation or model execution.
