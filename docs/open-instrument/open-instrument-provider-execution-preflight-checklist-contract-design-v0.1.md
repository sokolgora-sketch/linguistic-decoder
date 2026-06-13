# Open Instrument Provider Execution Preflight Checklist Contract Design v0.1

## Status

Design only.

Docs only.

Contract design only.

No implementation.
No provider execution.
No model call.
No OpenAI API use.
No runtime/API/UI wiring.
No provider default change.
No artifact/report creation.
No publication framing.
No runnable JSON.
No JSON schema file.
No TypeScript schema.
No validation code.

## Purpose

This document designs a future provider execution preflight checklist contract.

The future contract will make the checklist reviewable and machine-checkable later.

This design does not create the future contract file.
This design does not validate anything at runtime.
This design does not execute anything.

## Relationship to accepted checklist design

This contract design follows the accepted checklist design:

- PR #1309
- `docs(open-instrument): design provider execution preflight checklist`
- merge SHA `d7c583a807cc10631857ef5657e6836c38344c0b`
- short SHA `d7c583a8`
- doc: `docs/open-instrument/open-instrument-provider-execution-preflight-checklist-design-v0.1.md`

It also follows the accepted review of that checklist design:

- PR #1310
- `docs(open-instrument): review provider execution preflight checklist design`
- merge SHA `d9844a6fd2e88e9988b2862d05aa242788378275`
- short SHA `d9844a6f`
- doc: `docs/open-instrument/open-instrument-provider-execution-preflight-checklist-design-review-v0.1.md`

PR #1310 accepted the checklist design as non-executing and did not authorize provider execution.

## Relationship to accepted boundary design

This contract design preserves the accepted preflight boundary:

- PR #1307
- `docs(open-instrument): design provider execution preflight boundary`
- merge SHA `25313ed4cb839633c79e99d691ff7c479288d92f`
- short SHA `25313ed4`
- doc: `docs/open-instrument/open-instrument-provider-execution-preflight-boundary-design-v0.1.md`

- PR #1308
- `docs(open-instrument): review provider execution preflight boundary design`
- merge SHA `a711c77d11ac9a4f0d9d8f7d2d47adc2dc5582e0`
- short SHA `a711c77d`
- doc: `docs/open-instrument/open-instrument-provider-execution-preflight-boundary-design-review-v0.1.md`

## Relationship to closed static validation lane

This contract design preserves the closed static validation lane:

- PR #1305
- `docs(open-instrument): close run packet fixture validation lane`
- merge SHA `5c6e3ac55d0b539bc55132c69e0414863201fc13`
- short SHA `5c6e3ac5`
- doc: `docs/open-instrument/open-instrument-run-packet-fixture-validation-lane-closure-v0.1.md`

The static validation lane remains schema/traceability infrastructure only.

The future checklist contract must require static validation status but must not treat static validation as provider execution authorization.

## Contract design principles

The future contract must follow these principles:

- explicit over implicit
- false by default
- fail closed
- no fallback by default
- no silent rerun
- no implicit provider switch
- no implicit model switch
- no runtime/API/UI execution path
- no artifact/report creation unless separately authorized
- no publication framing
- checklist readiness is not execution authorization
- contract validity is not provider correctness
- contract validity is not candidate-truth evidence
- contract validity is not origin evidence

## Future top-level contract identity

The future contract should define these top-level identity fields:

- schemaVersion
- checklistId
- checklistKind
- checklistCreatedAt
- checklistCreatedBy
- repository
- baseCommit
- reviewedRunPacketId
- reviewedRunPacketPath
- reviewedRunPacketCommit
- sourceDocs
- boundaryVersion
- checklistDesignVersion
- checklistReviewCommit

Rules:

- all top-level identity fields are required
- all IDs are explicit
- sourceDocs must include the accepted checklist design and review docs
- missing identity field fails closed

## Future sourceDocs contract

The future contract should define sourceDocs as a required section.

Required future source references:

- run packet contract design/review
- reviewed run packet path
- static validation lane closure
- provider execution preflight boundary design/review
- provider execution preflight checklist design/review
- future provider execution design, if any
- future capture policy design, if any
- future artifact/report policy design, if any

Rules:

- source references must include path and commit when applicable
- missing required source reference fails closed
- unreviewed source reference fails closed

## Future repositoryState contract

The future contract should define these repository fields:

- branch
- commit
- originMainCommit
- workingTreeClean
- stagedAreaClean
- unexpectedUntrackedFiles
- divergenceFromOriginMain
- openPullRequests
- unexpectedNonDependencyPullRequests

Rules:

- branch must be explicit
- workingTreeClean must be true
- stagedAreaClean must be true
- divergenceFromOriginMain must be `0 0` or explicitly reviewed
- unexpected non-dependency PRs fail closed

## Future runPacketStatus contract

The future contract should define these run packet fields:

- runPacketExists
- runPacketPath
- runPacketSchemaVersion
- packetId
- runId
- provider
- model
- endpointType
- authorizationFieldsPresent
- capturePathStatus
- artifactReportPathStatus
- runPacketReviewed

Rules:

- runPacketExists must be true
- runPacketReviewed must be true
- provider, model, and endpointType must be explicit
- missing authorization fields fail closed
- ambiguous capture or artifact/report paths fail closed

## Future staticValidationStatus contract

The future contract should define these static validation fields:

- packageValidationCommand
- packageValidationPassed
- helperValidationTestPassed
- integrationGateTestPassed
- ciStatus
- validationEvidenceClass
- validationOutputBoundary

Rules:

- packageValidationCommand must be `npm run open-instrument:validate-run-packet-fixture`
- packageValidationPassed must be true before any readiness state above blocked
- helper and integration gate tests must pass
- validationEvidenceClass must remain schema/traceability only
- failed static validation fails closed

## Future providerIdentity contract

The future contract should define these provider fields:

- providerName
- providerType
- endpointClass
- networkRequired
- localOrRemote
- providerVersionSource
- providerDefaultSnapshotPath
- providerIdentityReviewed
- fallbackProviderAllowed

Rules:

- providerName required
- endpointClass required
- providerIdentityReviewed must be true before readiness can progress
- fallbackProviderAllowed defaults false
- unknown provider fails closed

## Future modelIdentity contract

The future contract should define these model fields:

- modelName
- modelVersion
- modelSource
- modelConfigurationPath
- modelDefaultSnapshotPath
- modelIdentityReviewed
- modelSwitchAllowed

Rules:

- modelName required
- modelIdentityReviewed must be true before readiness can progress
- modelSwitchAllowed defaults false
- unknown model fails closed
- implicit model substitution fails closed

## Future endpointIdentity contract

The future contract should define these endpoint fields:

- endpointType
- endpointUrlClass
- authenticationRequired
- authenticationReviewed
- networkBoundary
- rateLimitBoundary
- dataRetentionBoundary
- privacyBoundary
- endpointIdentityReviewed

Rules:

- endpointType required
- endpointIdentityReviewed must be true
- authentication ambiguity fails closed
- data-retention ambiguity fails closed
- privacy ambiguity fails closed

## Future authorizationGates contract

The future contract should define these gates:

- providerExecutionAuthorized
- modelCallAuthorized
- openAiApiAuthorized
- artifactCreationAuthorized
- reportCreationAuthorized
- rerunAuthorized
- fallbackProviderAuthorized
- promptMutationAuthorized
- sourceMutationAuthorized
- runtimeApiUiExecutionAuthorized

Rules:

- all gates required
- all gates default false
- missing gate fails closed
- true gate requires reviewed authorization source
- this design sets no gate true
- checklist contract validity never sets gates true by itself

## Future defaultSnapshotStatus contract

The future contract should define these fields:

- providerDefaultsCaptured
- modelDefaultsCaptured
- endpointDefaultsCaptured
- providerDefaultSnapshotPath
- modelDefaultSnapshotPath
- endpointDefaultSnapshotPath
- configurationDiffRecorded
- unreviewedProviderDefaultMutation
- unreviewedModelDefaultMutation

Rules:

- default snapshots required before execution authorization
- unreviewed default mutation fails closed
- missing snapshot fails closed

## Future promptSourceReviewStatus contract

The future contract should define these fields:

- promptSourcePath
- promptSourceCommit
- sourceDocumentPath
- sourceDocumentCommit
- promptSourceReviewed
- sourceDocumentReviewed
- promptMutationAuthorized
- sourceMutationAuthorized
- unreviewedPromptMutation
- unreviewedSourceMutation

Rules:

- prompt/source references required
- review status required
- unreviewed mutation fails closed

## Future capturePathStatus contract

The future contract should define these fields:

- outputCapturePath
- rawResponseCapturePath
- metadataCapturePath
- requestCapturePath
- sensitiveDataPolicy
- retentionPolicy
- capturePathReviewed

Rules:

- output and metadata capture paths required if execution is expected
- request/raw response paths required if capture is authorized
- sensitive data policy required
- retention policy required
- ambiguity fails closed

## Future failurePolicyStatus contract

The future contract should define these fields:

- failureMode
- noSilentRerun
- noHiddenFallback
- noAutomaticProviderSwitch
- noAutomaticModelSwitch
- noAutomaticOpenAiFallback
- mutationAfterFailureRequiresReview
- rerunPolicyReviewed

Rules:

- noSilentRerun must be true
- noHiddenFallback must be true
- automatic provider/model/OpenAI fallback must be false
- failure must stop lane unless reviewed rerun policy exists

## Future runtimeApiUiExclusionStatus contract

The future contract should define these fields:

- publicUiCanInitiateProviderExecution
- analyzeRouteCanInitiateProviderExecution
- proposeRouteCanInitiateProviderExecution
- evalsRouteCanInitiateProviderExecution
- hiddenServerActionProviderCall
- hiddenScheduledTaskProviderCall
- runtimeApiUiExecutionAuthorized

Rules:

- public UI and route execution flags must be false unless separately reviewed
- hidden execution paths fail closed
- runtimeApiUiExecutionAuthorized defaults false

## Future artifactReportAuthorizationStatus contract

The future contract should define these fields:

- artifactCreationAuthorized
- reportCreationAuthorized
- artifactPath
- reportPath
- artifactPathReviewed
- reportPathReviewed
- evidenceClass
- publicationFraming

Rules:

- artifact/report creation defaults false
- if authorized, paths must be explicit and reviewed
- publicationFraming defaults false
- unreviewed artifact/report path fails closed

## Future evidenceBoundaryStatus contract

The future contract should define these fields:

- checklistEvidenceClass
- candidateTruthEvidence
- originEvidence
- modelQualityEvidence
- publicationEvidence
- providerOutputCorrectnessEvidence
- executionSafetyEvidence

Rules:

- checklistEvidenceClass must be preflight-control only
- candidateTruthEvidence must be false
- originEvidence must be false
- modelQualityEvidence must be false
- publicationEvidence must be false
- providerOutputCorrectnessEvidence must be false
- executionSafetyEvidence must be false

## Future finalDecision contract

The future contract should define final decision values:

- not_ready
- blocked
- ready_for_review
- ready_for_explicit_execution_authorization

Rules:

- any stop condition forces blocked or not_ready
- ready_for_explicit_execution_authorization does not authorize execution
- execution requires a later reviewed execution PR or reviewed execution run packet
- checklist itself cannot execute

## Contract-level stop conditions

The future contract must fail closed on these stop conditions:

- missing required field
- unknown extra execution-authorizing field
- missing identity
- missing source reference
- dirty repo
- unexpected open non-dependency PR
- missing run packet
- invalid run packet
- unreviewed run packet
- failing static validation
- ambiguous provider
- ambiguous model
- ambiguous endpoint
- missing default snapshot
- missing prompt/source review
- missing capture path
- missing sensitive data policy
- missing retention policy
- missing failure policy
- fallback ambiguity
- silent rerun ambiguity
- OpenAI API ambiguity
- runtime/API/UI path ambiguity
- artifact/report ambiguity
- publication framing ambiguity
- unreviewed mutation
- CI failure

## Future implementation target

The next accepted action after this design lands is:

`docs/open-instrument: review provider execution preflight checklist contract design`

The future review should verify:

- contract design remains non-implementing
- contract design does not create runnable JSON
- contract design does not create schema code
- contract design preserves false-by-default gates
- contract design preserves fail-closed rules
- contract design does not authorize provider execution
