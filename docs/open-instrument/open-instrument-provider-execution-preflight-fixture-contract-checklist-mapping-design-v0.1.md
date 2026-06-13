# Open Instrument provider execution preflight fixture contract checklist mapping design v0.1

## Status

This document is:

- design-only
- docs-only
- mapping design only
- no implementation
- no provider execution
- no model call
- no OpenAI API use
- no runtime/API/UI wiring
- no provider default change
- no artifact/report creation
- no publication framing
- no runnable JSON
- no JSON fixture file
- no JSON schema file
- no TypeScript schema
- no validation code
- no actual fixture in this PR
- no checklist implementation in this PR
- no contract implementation in this PR

## Purpose

This document designs the future mapping between the provider execution preflight contract fixture sections and the accepted provider execution preflight checklist contract sections.

The mapping exists to make future fixture review traceable back to the accepted checklist contract.

This design does not create the future fixture.

This design does not create runnable JSON.

This design does not create a JSON fixture file.

This design does not create JSON schema.

This design does not create TypeScript schema.

This design does not implement validation code.

This design does not execute anything.

This design does not authorize provider execution.

The mapping is a design target only.

## Reviewed source chain

Accepted fixture design:

- PR #1313
- title: `docs(open-instrument): design provider execution preflight contract fixture`
- merge SHA: `db5b514deb21bb6c9125b440ff2a83c23dc1ceb1`
- short SHA: `db5b514d`
- doc: `docs/open-instrument/open-instrument-provider-execution-preflight-contract-fixture-design-v0.1.md`

Accepted fixture design review:

- PR #1314
- title: `docs(open-instrument): review provider execution preflight contract fixture design`
- merge SHA: `dde9ce7fff3182c693676864af08f6c75cab7f90`
- short SHA: `dde9ce7f`
- doc: `docs/open-instrument/open-instrument-provider-execution-preflight-contract-fixture-design-review-v0.1.md`

Accepted checklist contract design:

- PR #1311
- title: `docs(open-instrument): design provider execution preflight checklist contract`
- merge SHA: `db21cc62c349a9d97569c2298b0f061b27abb4cc`
- short SHA: `db21cc62`
- doc: `docs/open-instrument/open-instrument-provider-execution-preflight-checklist-contract-design-v0.1.md`

Accepted checklist contract design review:

- PR #1312
- title: `docs(open-instrument): review provider execution preflight checklist contract design`
- merge SHA: `6755706741f1f67e015175937b0b432df250662b`
- short SHA: `67557067`
- doc: `docs/open-instrument/open-instrument-provider-execution-preflight-checklist-contract-design-review-v0.1.md`

Accepted checklist design:

- PR #1309
- title: `docs(open-instrument): design provider execution preflight checklist`
- merge SHA: `d7c583a807cc10631857ef5657e6836c38344c0b`
- short SHA: `d7c583a8`
- doc: `docs/open-instrument/open-instrument-provider-execution-preflight-checklist-design-v0.1.md`

Accepted checklist design review:

- PR #1310
- title: `docs(open-instrument): review provider execution preflight checklist design`
- merge SHA: `d9844a6fd2e88e9988b2862d05aa242788378275`
- short SHA: `d9844a6f`
- doc: `docs/open-instrument/open-instrument-provider-execution-preflight-checklist-design-review-v0.1.md`

Accepted preflight boundary design:

- PR #1307
- title: `docs(open-instrument): design provider execution preflight boundary`
- merge SHA: `25313ed4cb839633c79e99d691ff7c479288d92f`
- short SHA: `25313ed4`
- doc: `docs/open-instrument/open-instrument-provider-execution-preflight-boundary-design-v0.1.md`

Accepted preflight boundary design review:

- PR #1308
- title: `docs(open-instrument): review provider execution preflight boundary design`
- merge SHA: `a711c77d11ac9a4f0d9d8f7d2d47adc2dc5582e0`
- short SHA: `a711c77d`
- doc: `docs/open-instrument/open-instrument-provider-execution-preflight-boundary-design-review-v0.1.md`

Closed static validation lane:

- PR #1305
- title: `docs(open-instrument): close run packet fixture validation lane`
- merge SHA: `5c6e3ac55d0b539bc55132c69e0414863201fc13`
- short SHA: `5c6e3ac5`
- doc: `docs/open-instrument/open-instrument-run-packet-fixture-validation-lane-closure-v0.1.md`

## Mapping design principles

The future mapping must preserve:

- explicit over implicit
- false by default
- fail closed
- no provider execution
- no model call
- no OpenAI API use
- no runtime/API/UI wiring
- no provider default mutation
- no artifact/report creation
- no publication framing
- no runnable JSON
- no JSON fixture file in this design
- no JSON schema file in this design
- no TypeScript schema in this design
- no validation code in this design
- no hidden fallback
- no silent rerun
- no implicit provider switch
- no implicit model switch
- no implicit OpenAI fallback
- not candidate-truth evidence
- not origin evidence
- not model-quality evidence
- not publication evidence
- not execution-safety evidence

The mapping itself cannot authorize execution.

The mapping itself cannot make a future fixture valid.

The mapping itself cannot make a future checklist ready.

The mapping itself cannot set any authorization gate true.

## Mapping target

The future mapping should connect each future fixture section to one accepted checklist contract section.

A future implementation may use the mapping to verify coverage, but this PR does not implement that verification.

The mapping must be one-to-one where the section names match.

The mapping must be many-to-one only where a fixture section intentionally summarizes a broader contract section.

The mapping must fail closed when a fixture section has no checklist contract counterpart.

The mapping must fail closed when a checklist contract section has no fixture counterpart.

## Section mapping overview

The future mapping should cover these section pairs:

| Future fixture section | Accepted checklist contract section | Mapping status |
| --- | --- | --- |
| fixture identity | top-level contract identity | required |
| fixture sourceDocs | sourceDocs contract | required |
| fixture repositoryState | repositoryState contract | required |
| fixture runPacketStatus | runPacketStatus contract | required |
| fixture staticValidationStatus | staticValidationStatus contract | required |
| fixture providerIdentity | providerIdentity contract | required |
| fixture modelIdentity | modelIdentity contract | required |
| fixture endpointIdentity | endpointIdentity contract | required |
| fixture authorizationGates | authorizationGates contract | required |
| fixture defaultSnapshotStatus | defaultSnapshotStatus contract | required |
| fixture promptSourceReviewStatus | promptSourceReviewStatus contract | required |
| fixture capturePathStatus | capturePathStatus contract | required |
| fixture failurePolicyStatus | failurePolicyStatus contract | required |
| fixture runtimeApiUiExclusionStatus | runtimeApiUiExclusionStatus contract | required |
| fixture artifactReportAuthorizationStatus | artifactReportAuthorizationStatus contract | required |
| fixture evidenceBoundaryStatus | evidenceBoundaryStatus contract | required |
| fixture finalDecision | finalDecision contract | required |
| fixture stop conditions | contract-level stop conditions | required |

This is a prose mapping only.

This is not runnable JSON.

This is not a schema table for code generation.

## Identity mapping

Future fixture identity fields should map to the accepted top-level contract identity fields.

Fixture fields:

- schemaVersion
- fixtureId
- fixtureKind
- fixtureCreatedAt
- fixturePurpose
- checklistId
- reviewedRunPacketId
- repository
- baseCommit
- sourceDocs
- nonExecutionDeclaration

Accepted contract fields:

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

Mapping rule:

- fixture identity must prove that the fixture is illustrative and non-executing.
- fixture identity must not replace checklist identity.
- missing identity fields fail closed.
- nonExecutionDeclaration must map to the non-execution boundary and must be explicit.

## sourceDocs mapping

Future fixture sourceDocs should map to the sourceDocs contract.

Fixture sourceDocs should include:

- checklist contract design doc
- checklist contract review doc
- checklist design doc
- checklist review doc
- preflight boundary design doc
- preflight boundary review doc
- static validation lane closure doc
- run packet contract doc, if available
- reviewed run packet, if available

Accepted contract sourceDocs require:

- run packet contract design/review
- reviewed run packet path
- static validation lane closure
- provider execution preflight boundary design/review
- provider execution preflight checklist design/review
- future provider execution design, if any
- future capture policy design, if any
- future artifact/report policy design, if any

Mapping rule:

- missing source reference fails closed.
- unreviewed source reference fails closed.
- sourceDocs do not authorize execution.
- sourceDocs do not prove output correctness.

## repositoryState mapping

Future fixture repositoryState should map to the repositoryState contract.

Fixture placeholders:

- branch
- commit
- originMainCommit
- workingTreeClean
- stagedAreaClean
- unexpectedUntrackedFiles
- divergenceFromOriginMain
- openPullRequests
- unexpectedNonDependencyPullRequests

Contract fields:

- branch
- commit
- originMainCommit
- workingTreeClean
- stagedAreaClean
- unexpectedUntrackedFiles
- divergenceFromOriginMain
- openPullRequests
- unexpectedNonDependencyPullRequests

Mapping rule:

- exact field coverage is required.
- dirty repository state fails closed.
- unexpected open non-dependency PRs fail closed.
- fixture repositoryState cannot certify live state by itself.

## runPacketStatus mapping

Future fixture runPacketStatus should map to the runPacketStatus contract.

Fixture placeholders:

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

Contract fields:

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

Mapping rule:

- exact field coverage is required.
- missing run packet fails closed.
- unreviewed run packet fails closed.
- ambiguous provider, model, or endpointType fails closed.
- runPacketStatus does not authorize execution.

## staticValidationStatus mapping

Future fixture staticValidationStatus should map to the staticValidationStatus contract.

Fixture placeholders:

- packageValidationCommand
- packageValidationPassed
- helperValidationTestPassed
- integrationGateTestPassed
- ciStatus
- validationEvidenceClass
- validationOutputBoundary

Contract fields:

- packageValidationCommand
- packageValidationPassed
- helperValidationTestPassed
- integrationGateTestPassed
- ciStatus
- validationEvidenceClass
- validationOutputBoundary

Mapping rule:

- packageValidationCommand must remain `npm run open-instrument:validate-run-packet-fixture`.
- validationEvidenceClass must remain schema/traceability only.
- failed static validation fails closed.
- passing static validation does not authorize execution.

## providerIdentity mapping

Future fixture providerIdentity should map to the providerIdentity contract.

Fixture placeholders:

- providerName
- providerType
- endpointClass
- networkRequired
- localOrRemote
- providerVersionSource
- providerDefaultSnapshotPath
- providerIdentityReviewed
- fallbackProviderAllowed

Contract fields:

- providerName
- providerType
- endpointClass
- networkRequired
- localOrRemote
- providerVersionSource
- providerDefaultSnapshotPath
- providerIdentityReviewed
- fallbackProviderAllowed

Mapping rule:

- exact field coverage is required.
- unknown provider fails closed.
- fallbackProviderAllowed defaults false.
- provider placeholders do not authorize provider execution.

## modelIdentity mapping

Future fixture modelIdentity should map to the modelIdentity contract.

Fixture placeholders:

- modelName
- modelVersion
- modelSource
- modelConfigurationPath
- modelDefaultSnapshotPath
- modelIdentityReviewed
- modelSwitchAllowed

Contract fields:

- modelName
- modelVersion
- modelSource
- modelConfigurationPath
- modelDefaultSnapshotPath
- modelIdentityReviewed
- modelSwitchAllowed

Mapping rule:

- exact field coverage is required.
- unknown model fails closed.
- modelSwitchAllowed defaults false.
- model placeholders do not authorize model calls.

## endpointIdentity mapping

Future fixture endpointIdentity should map to the endpointIdentity contract.

Fixture placeholders:

- endpointType
- endpointUrlClass
- authenticationRequired
- authenticationReviewed
- networkBoundary
- rateLimitBoundary
- dataRetentionBoundary
- privacyBoundary
- endpointIdentityReviewed

Contract fields:

- endpointType
- endpointUrlClass
- authenticationRequired
- authenticationReviewed
- networkBoundary
- rateLimitBoundary
- dataRetentionBoundary
- privacyBoundary
- endpointIdentityReviewed

Mapping rule:

- exact field coverage is required.
- endpoint placeholders do not authorize network calls.
- authentication ambiguity fails closed.
- data-retention ambiguity fails closed.
- privacy ambiguity fails closed.

## authorizationGates mapping

Future fixture authorizationGates should map to the authorizationGates contract.

Fixture placeholders:

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

Contract gates:

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

Mapping rule:

- exact gate coverage is required.
- all gates default false.
- missing gate fails closed.
- unexpected true gate fails closed.
- fixture validity never authorizes execution by itself.

## defaultSnapshotStatus mapping

Future fixture defaultSnapshotStatus should map to the defaultSnapshotStatus contract.

Fixture placeholders:

- providerDefaultsCaptured
- modelDefaultsCaptured
- endpointDefaultsCaptured
- providerDefaultSnapshotPath
- modelDefaultSnapshotPath
- endpointDefaultSnapshotPath
- configurationDiffRecorded
- unreviewedProviderDefaultMutation
- unreviewedModelDefaultMutation

Contract fields:

- providerDefaultsCaptured
- modelDefaultsCaptured
- endpointDefaultsCaptured
- providerDefaultSnapshotPath
- modelDefaultSnapshotPath
- endpointDefaultSnapshotPath
- configurationDiffRecorded
- unreviewedProviderDefaultMutation
- unreviewedModelDefaultMutation

Mapping rule:

- exact field coverage is required.
- missing snapshots fail closed.
- unreviewed provider default mutation fails closed.
- unreviewed model default mutation fails closed.
- default snapshots do not prove execution safety.

## promptSourceReviewStatus mapping

Future fixture promptSourceReviewStatus should map to the promptSourceReviewStatus contract.

Fixture placeholders:

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

Contract fields:

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

Mapping rule:

- exact field coverage is required.
- unreviewed prompt mutation fails closed.
- unreviewed source mutation fails closed.
- prompt placeholders do not authorize model calls.

## capturePathStatus mapping

Future fixture capturePathStatus should map to the capturePathStatus contract.

Fixture placeholders:

- outputCapturePath
- rawResponseCapturePath
- metadataCapturePath
- requestCapturePath
- sensitiveDataPolicy
- retentionPolicy
- capturePathReviewed

Contract fields:

- outputCapturePath
- rawResponseCapturePath
- metadataCapturePath
- requestCapturePath
- sensitiveDataPolicy
- retentionPolicy
- capturePathReviewed

Mapping rule:

- exact field coverage is required.
- missing capture path fails closed.
- missing sensitive data policy fails closed.
- missing retention policy fails closed.
- capture placeholders do not create artifacts or reports.

## failurePolicyStatus mapping

Future fixture failurePolicyStatus should map to the failurePolicyStatus contract.

Fixture placeholders:

- failureMode
- noSilentRerun
- noHiddenFallback
- noAutomaticProviderSwitch
- noAutomaticModelSwitch
- noAutomaticOpenAiFallback
- mutationAfterFailureRequiresReview
- rerunPolicyReviewed

Contract fields:

- failureMode
- noSilentRerun
- noHiddenFallback
- noAutomaticProviderSwitch
- noAutomaticModelSwitch
- noAutomaticOpenAiFallback
- mutationAfterFailureRequiresReview
- rerunPolicyReviewed

Mapping rule:

- exact field coverage is required.
- noSilentRerun must remain true.
- noHiddenFallback must remain true.
- automatic provider/model/OpenAI fallback must remain false.
- failure stops the lane unless a reviewed rerun policy exists.

## runtimeApiUiExclusionStatus mapping

Future fixture runtimeApiUiExclusionStatus should map to the runtimeApiUiExclusionStatus contract.

Fixture placeholders:

- publicUiCanInitiateProviderExecution
- analyzeRouteCanInitiateProviderExecution
- proposeRouteCanInitiateProviderExecution
- evalsRouteCanInitiateProviderExecution
- hiddenServerActionProviderCall
- hiddenScheduledTaskProviderCall
- runtimeApiUiExecutionAuthorized

Contract fields:

- publicUiCanInitiateProviderExecution
- analyzeRouteCanInitiateProviderExecution
- proposeRouteCanInitiateProviderExecution
- evalsRouteCanInitiateProviderExecution
- hiddenServerActionProviderCall
- hiddenScheduledTaskProviderCall
- runtimeApiUiExecutionAuthorized

Mapping rule:

- exact field coverage is required.
- all route execution flags default false.
- hidden execution path fails closed.
- runtime/API/UI authorization defaults false.
- mapping does not create runtime/API/UI wiring.

## artifactReportAuthorizationStatus mapping

Future fixture artifactReportAuthorizationStatus should map to the artifactReportAuthorizationStatus contract.

Fixture placeholders:

- artifactCreationAuthorized
- reportCreationAuthorized
- artifactPath
- reportPath
- artifactPathReviewed
- reportPathReviewed
- evidenceClass
- publicationFraming

Contract fields:

- artifactCreationAuthorized
- reportCreationAuthorized
- artifactPath
- reportPath
- artifactPathReviewed
- reportPathReviewed
- evidenceClass
- publicationFraming

Mapping rule:

- exact field coverage is required.
- artifact/report authorization defaults false.
- publicationFraming defaults false.
- unreviewed artifact/report path fails closed.
- mapping does not create artifacts or reports.

## evidenceBoundaryStatus mapping

Future fixture evidenceBoundaryStatus should map to the evidenceBoundaryStatus contract.

Fixture placeholders:

- checklistEvidenceClass
- candidateTruthEvidence
- originEvidence
- modelQualityEvidence
- publicationEvidence
- providerOutputCorrectnessEvidence
- executionSafetyEvidence

Contract fields:

- checklistEvidenceClass
- candidateTruthEvidence
- originEvidence
- modelQualityEvidence
- publicationEvidence
- providerOutputCorrectnessEvidence
- executionSafetyEvidence

Mapping rule:

- exact field coverage is required.
- checklistEvidenceClass must be preflight-control only.
- candidateTruthEvidence must be false.
- originEvidence must be false.
- modelQualityEvidence must be false.
- publicationEvidence must be false.
- providerOutputCorrectnessEvidence must be false.
- executionSafetyEvidence must be false.

## finalDecision mapping

Future fixture finalDecision should map to the finalDecision contract.

Fixture placeholders:

- not_ready
- blocked
- ready_for_review
- ready_for_explicit_execution_authorization

Contract values:

- not_ready
- blocked
- ready_for_review
- ready_for_explicit_execution_authorization

Mapping rule:

- exact decision vocabulary is required.
- unknown decision value fails closed.
- ready_for_explicit_execution_authorization does not authorize execution.
- fixture itself cannot execute.
- execution requires a later reviewed execution PR or reviewed execution run packet.

## Stop-condition mapping

Future fixture stop conditions should map to contract-level stop conditions.

Required stop conditions include:

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
- any authorization gate unexpectedly true

Mapping rule:

- every fixture stop condition must map to a contract-level stop condition.
- every contract-level stop condition must be visible in fixture review.
- missing stop condition fails closed.
- stop conditions do not authorize recovery, retry, or fallback by themselves.

## Unmapped field policy

Future mapping must fail closed when:

- a fixture field has no accepted contract counterpart
- a contract field has no fixture counterpart
- a fixture field attempts to authorize execution outside authorizationGates
- a fixture field introduces a new provider/model/API pathway
- a fixture field introduces runnable JSON behavior
- a fixture field implies provider execution safety
- a fixture field implies model output correctness
- a fixture field implies candidate-truth evidence
- a fixture field implies origin evidence
- a fixture field implies publication evidence

## Future implementation target

Next accepted action after this design lands:

`docs(open-instrument): review provider execution preflight fixture contract checklist mapping design`

The future review should verify:

- mapping design remains docs-only
- mapping design remains design-only
- mapping design does not create runnable JSON
- mapping design does not create a fixture file
- mapping design does not create JSON schema
- mapping design does not create TypeScript schema
- mapping design does not implement validation code
- mapping design preserves false-by-default gates
- mapping design preserves fail-closed behavior
- mapping design does not authorize provider execution
