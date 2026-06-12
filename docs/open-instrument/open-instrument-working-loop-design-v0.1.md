# Open Instrument Working Loop Design v0.1

## Status

Design only.

No model call is made.

No rerun is authorized.

No artifact JSON is created by this design.

No source implementation is changed.

No provider default is changed.

No publication framing is introduced.

## Purpose

This document defines the reusable Open Instrument working loop.

The goal is to move Open Instrument from isolated document lanes into a controlled operating system.

The working loop must preserve the evidence discipline learned from the Zheji segmentation lanes while making future runs easier to prepare, archive, review, compare, and close.

## Immediate context

The current Open Instrument work has established several important rules.

1. A run must not be treated as origin evidence.
2. A run must not be treated as candidate-truth evidence.
3. A clean structure is schema and traceability evidence.
4. A clean structure is not proof that a candidate is true.
5. Null candidates are auditable evidence of absence.
6. Null candidates are not automatic failures.
7. Finer segmentation creates more traceability pressure.
8. Higher null pressure can be diagnostic stress.
9. Provider behavior must not change default provider policy.
10. Documentation review must separate evidence from interpretation.

The Zheji `.002`, `.003`, and `.004` comparison lane also showed that evidence status matters.

A lane can be:

- report-backed
- direct-artifact-backed
- repair predecessor
- reviewed direct evidence
- clean baseline
- hard-case stress target
- closed
- review-needed

These labels must not be collapsed into a single success or failure label.

## Working loop overview

The reusable Open Instrument loop has eight stages.

1. Design
2. Preflight
3. Run packet
4. Provider execution
5. Capture
6. Verification
7. Archive and report
8. Review and closure

The loop is intentionally staged.

A later stage must not silently rewrite the meaning of an earlier stage.

A run must not skip design or preflight.

A review must not create new evidence.

A closure must not overclaim the run.

## Stage 1 — Design

The design stage defines what is being tested.

The design must identify:

- target word or target object
- segmentation lane or input lane
- intended comparison set
- evidence question
- provider allowance
- model allowance
- expected artifact path
- expected report path
- validator expectations
- interpretation boundaries
- stop conditions

The design must explicitly state whether a model call is authorized.

Most Open Instrument design PRs should not authorize a model call.

A model call should only be authorized after a run packet and preflight have landed.

## Stage 2 — Preflight

The preflight stage confirms that the next action is safe.

A preflight must check:

- repository branch
- clean working tree
- expected source docs exist
- expected prior artifacts exist or are intentionally absent
- target artifact path is absent before a new run
- target report path is absent before a new report
- provider profile is explicit
- model is explicit
- default provider is not changed
- local provider availability is verified when local model use is intended
- OpenAI API use is explicitly forbidden unless separately authorized
- prompt contract exists
- timeout policy exists when local provider use is intended
- no model call happens during preflight unless the preflight explicitly tests only availability

The preflight result is evidence of readiness.

The preflight result is not evidence about candidates, origin, or truth.

## Stage 3 — Run packet

The run packet is the central control object.

A run packet must define:

- runId
- word
- normalizedWord
- segmentationId
- chunks
- chunkVariants
- voicePath
- legalTransforms
- functionHints
- targetLanguages
- searchMode
- provider
- model
- providerProfile
- timeoutBudget
- promptContract
- expectedOutputSchema
- artifactPath
- reportPath
- reviewPath
- claimBoundary
- publicationBoundary
- defaultProviderBoundary
- artifactCreationAuthorization
- modelCallAuthorization

The run packet must be reviewable before execution.

The run packet must be stable enough that a later reviewer can understand exactly what was intended.

The run packet must not contain hidden defaults.

The run packet must not rely on provider-default behavior.

## Stage 4 — Provider execution

Provider execution is the only stage that may call a model.

A provider execution must be explicitly authorized.

Provider execution must identify:

- provider
- model
- endpoint type
- local or remote status
- environment assumptions
- timeout budget
- request payload
- raw response
- parser path
- verifier path

Local Ollama through an OpenAI-compatible endpoint is a provider profile.

It is not OpenAI API use.

OpenAI API use requires separate explicit authorization.

A successful local provider run does not change the default provider.

A provider run is not model-quality proof.

## Stage 5 — Capture

The capture stage preserves what happened.

Capture must include:

- raw model text
- parsed model object when parsing succeeds
- parse failure when parsing fails
- validation errors
- provider metadata
- run packet reference
- prompt contract reference
- artifact path
- report path
- timestamp or date label
- branch or PR context when available

Capture must preserve failures.

A timeout is evidence.

A malformed response is evidence.

A missing field is evidence.

An enum mismatch is evidence.

A null candidate is evidence.

None of these are automatically scientific failures.

They are system-behavior evidence.

## Stage 6 — Verification

Verification classifies the captured output.

Verification must check:

- required top-level identity fields
- exact word preservation
- exact segmentationId preservation
- exact chunk preservation
- candidate object shape
- null candidate object shape
- enum scalar discipline
- allowed enum values
- sourceNote presence
- warnings presence
- claimBoundary presence
- forbidden claim absence
- provider default boundary
- publication boundary

Verification may classify a run as structurally clean.

Verification may classify a run as traceability clean.

Verification may classify a run as repair-needed.

Verification may classify a run as timeout, parse failure, schema failure, or review-needed.

Verification must not classify a run as origin truth.

Verification must not classify a candidate as true.

## Stage 7 — Archive and report

Archive and report are separate.

The artifact preserves machine-readable evidence.

The report preserves human-readable interpretation of the artifact.

The artifact should not depend on the report for basic traceability.

The report should not invent evidence beyond the artifact.

The report may summarize:

- run classification
- structural issues
- enrichment warnings
- candidate count
- null candidate count
- skeleton survival
- forbidden field absence
- candidate payload survival
- segmentation traceability survival
- null pressure
- granularity pressure
- limitations

The report must preserve missing-value discipline.

A missing value must be marked as not available in inspected evidence.

A report-backed value must not be inflated into direct JSON evidence.

## Stage 8 — Review and closure

Review determines whether the artifact and report can be accepted.

Review may accept:

- design
- preflight
- artifact
- report
- comparison
- interpretation note
- closure note

Review must state boundaries.

Closure determines whether a lane is finished.

Closure must state:

- what is closed
- what remains open
- what must not be reopened accidentally
- which future action is allowed
- whether model calls remain forbidden
- whether reruns remain forbidden
- whether implementation is allowed

Closure is not publication.

Closure is not origin proof.

Closure is not candidate-truth proof.

## Evidence classes

Open Instrument should use reusable evidence classes.

### design-only

Planning document.

No model call.

No artifact.

No runtime change.

### preflight-only

Readiness check.

No candidate evidence.

No model result evidence unless explicitly testing provider availability.

### direct-artifact-backed

Claim is supported by inspected artifact fields.

### report-backed

Claim is supported by a report but not directly inspected in machine-readable artifact fields.

### repair predecessor

Artifact or lane is preserved as history before a repair.

### reviewed direct evidence

Direct artifact evidence has been reviewed and accepted with boundaries.

### clean schema evidence

The run passes schema or structural expectations.

This is not candidate-truth evidence.

### clean traceability evidence

The run preserves identity, segmentation, chunk, and boundary fields.

This is not origin evidence.

### hard-case stress evidence

The lane creates higher pressure and is useful for testing the system.

Higher pressure is not failure.

### closed lane

The lane is finished unless intentionally reopened.

## Claim boundaries

Every Open Instrument loop must preserve these forbidden conclusions.

It must not claim:

- origin
- winner
- candidate truth
- language superiority
- model quality proof
- scientific proof
- publication readiness
- provider default change

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

## Provider boundary

The default provider must remain unchanged unless a dedicated provider-default PR changes it.

Local Ollama success does not authorize provider default mutation.

OpenAI-compatible local endpoint use is not the same as OpenAI API use.

OpenAI API use must be explicitly authorized in a separate design and preflight.

## Automation boundary

The working loop may eventually automate:

- run packet validation
- artifact path preflight
- report path preflight
- provider profile validation
- prompt contract validation
- output schema validation
- evidence classification
- registry indexing

The working loop must not automatically:

- declare origin
- declare candidate truth
- select a winner
- publish results
- change provider defaults
- hide null candidates
- erase failed runs
- upgrade report-backed evidence into direct-artifact-backed evidence

## Near-term implementation sequence

The recommended next sequence is:

1. Design the working loop.
2. Review the working loop design.
3. Design the run packet contract.
4. Review the run packet contract.
5. Design the run packet validator.
6. Add fixture-only run packet validation.
7. Design the evidence registry.
8. Add docs-only evidence registry.
9. Add script-level registry validation.
10. Add UI preview only after registry behavior is stable.

This sequence keeps implementation behind design.

## Required first implementation target

The first implementation target should not call a model.

The first implementation target should validate a static run packet fixture.

The fixture should prove that required fields are present and that forbidden defaults are absent.

## Stop conditions

Stop before execution if:

- provider is implicit
- model is implicit
- artifact path is missing
- report path is missing
- prompt contract is missing
- target artifact already exists
- target report already exists
- OpenAI API use is ambiguous
- default provider behavior is ambiguous
- claim boundary is absent
- publication boundary is absent

Stop after capture if:

- parser fails
- verifier fails
- required identity fields are missing
- segmentationId drifts
- chunks drift
- enum fields are arrays
- forbidden claims appear
- null candidates are hidden
- provider default claims appear

## Final design decision

Open Instrument should use a staged working loop:

Design → Preflight → Run Packet → Provider Execution → Capture → Verification → Archive and Report → Review and Closure.

The next allowed PR is:

`docs(open-instrument): review open instrument working loop design`

No model call is authorized by this design.

No implementation is authorized by this design.

The immediate next system-building lane after review should be:

`docs(open-instrument): design open instrument run packet contract`
