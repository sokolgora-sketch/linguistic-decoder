# Open Instrument provider execution preflight contract fixture design v0.1

## Status

This document is:

- design-only
- docs-only
- fixture design only
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

This PR does not create a fixture under `docs/open-instrument/fixtures`.

## Purpose

This document designs a future illustrative provider execution preflight contract fixture.

The future fixture would exist only to demonstrate the provider execution preflight checklist contract shape after the contract itself is designed, reviewed, and implemented.

This design does not create the future fixture.

This design does not validate anything at runtime.

This design does not execute anything.

This design does not authorize provider execution.

The future fixture must be illustrative only. It must not be treated as a live run packet, provider request, execution authorization, model-quality evidence, origin evidence, candidate-truth evidence, or publication evidence.

## Relationship to accepted checklist contract design

This design follows the accepted provider execution preflight checklist contract design:

- PR #1311
- title: `docs(open-instrument): design provider execution preflight checklist contract`
- merge SHA: `db21cc62c349a9d97569c2298b0f061b27abb4cc`
- short SHA: `db21cc62`
- doc: `docs/open-instrument/open-instrument-provider-execution-preflight-checklist-contract-design-v0.1.md`

The contract design was reviewed and accepted by:

- PR #1312
- title: `docs(open-instrument): review provider execution preflight checklist contract design`
- merge SHA: `6755706741f1f67e015175937b0b432df250662b`
- short SHA: `67557067`
- doc: `docs/open-instrument/open-instrument-provider-execution-preflight-checklist-contract-design-review-v0.1.md`

PR #1312 accepted the contract design as a non-implementing future contract design target only. It did not authorize provider execution, model calls, OpenAI API use, runtime/API/UI wiring, provider-default changes, artifact/report creation, publication framing, runnable JSON, JSON schema creation, TypeScript schema creation, or validation implementation.

## Relationship to accepted checklist design

This fixture design also follows the accepted checklist design:

- PR #1309
- title: `docs(open-instrument): design provider execution preflight checklist`
- merge SHA: `d7c583a807cc10631857ef5657e6836c38344c0b`
- short SHA: `d7c583a8`
- doc: `docs/open-instrument/open-instrument-provider-execution-preflight-checklist-design-v0.1.md`

The checklist design was reviewed and accepted by:

- PR #1310
- title: `docs(open-instrument): review provider execution preflight checklist design`
- merge SHA: `d9844a6fd2e88e9988b2862d05aa242788378275`
- short SHA: `d9844a6f`
- doc: `docs/open-instrument/open-instrument-provider-execution-preflight-checklist-design-review-v0.1.md`

The future fixture must preserve the checklist’s non-executing and fail-closed design.

## Relationship to accepted boundary design

This fixture design must preserve the accepted provider execution preflight boundary:

- PR #1307
- title: `docs(open-instrument): design provider execution preflight boundary`
- merge SHA: `25313ed4cb839633c79e99d691ff7c479288d92f`
- short SHA: `25313ed4`
- doc: `docs/open-instrument/open-instrument-provider-execution-preflight-boundary-design-v0.1.md`

The boundary design was reviewed and accepted by:

- PR #1308
- title: `docs(open-instrument): review provider execution preflight boundary design`
- merge SHA: `a711c77d11ac9a4f0d9d8f7d2d47adc2dc5582e0`
- short SHA: `a711c77d`
- doc: `docs/open-instrument/open-instrument-provider-execution-preflight-boundary-design-review-v0.1.md`

The future fixture cannot bypass the accepted preflight boundary.

## Relationship to closed static validation lane

This design references the closed run packet fixture validation lane:

- PR #1305
- title: `docs(open-instrument): close run packet fixture validation lane`
- merge SHA: `5c6e3ac55d0b539bc55132c69e0414863201fc13`
- short SHA: `5c6e3ac5`
- doc: `docs/open-instrument/open-instrument-run-packet-fixture-validation-lane-closure-v0.1.md`

The run packet fixture validation lane remains schema/traceability infrastructure only.

This future preflight contract fixture is not the same as the existing run packet fixture.

This design does not change the existing fixture validation lane.

## Fixture design principles

The future fixture must be:

- illustrative only
- non-runnable
- incomplete by design until future implementation
- false by default
- fail closed
- no execution authority
- no provider defaults mutation
- no hidden fallback
- no silent rerun
- no runtime/API/UI trigger
- no artifact/report creation
- no publication framing
- not provider-output evidence
- not candidate-truth evidence
- not origin evidence
- not model-quality evidence
- not execution-safety evidence

The future fixture must not make execution look approved merely because a field is present.

The future fixture must not make provider execution appear safe merely because a placeholder is filled.

The future fixture must not be copied into production execution without review.

## Future fixture location design

A possible future fixture location is:

`docs/open-instrument/fixtures/preflight/open-instrument-provider-execution-preflight-contract-fixture-v0.1.json`

This path is a future design target only.

This PR must not create that path.

This PR must not create JSON.

Future fixture creation requires separate design review and a separate implementation PR.

## Future fixture identity section

A future illustrative fixture should include identity placeholders for:

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

Rules:

- identity fields must be explicit in a future fixture
- fixtureKind must indicate `preflight-contract-fixture`
- nonExecutionDeclaration must be explicit
- missing identity field fails closed
- identity fields do not authorize execution

## Future fixture sourceDocs section

A future illustrative fixture should reference:

- checklist contract design doc
- checklist contract review doc
- checklist design doc
- checklist review doc
- preflight boundary design doc
- preflight boundary review doc
- static validation lane closure doc
- run packet contract doc, if available
- reviewed run packet, if available

Rules:

- every future source reference must include path and commit where applicable
- missing required source reference fails closed
- source references do not authorize execution
- source references do not prove provider output correctness

## Future fixture repositoryState section

A future illustrative fixture may include repository state placeholders for:

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

- fixture may show expected values, but cannot certify live repo state
- live repo state must be checked by future validation or operator review
- dirty repo state fails closed
- unexpected non-dependency PRs fail closed

## Future fixture runPacketStatus section

A future illustrative fixture may include run packet placeholders for:

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

- illustrative placeholder values do not authorize execution
- unknown run packet means blocked
- unreviewed run packet means blocked
- missing authorization fields mean blocked
- ambiguous provider/model/endpointType means blocked

## Future fixture staticValidationStatus section

A future illustrative fixture may include static validation placeholders for:

- packageValidationCommand
- packageValidationPassed
- helperValidationTestPassed
- integrationGateTestPassed
- ciStatus
- validationEvidenceClass
- validationOutputBoundary

Rules:

- packageValidationCommand must remain `npm run open-instrument:validate-run-packet-fixture`
- validationEvidenceClass must remain schema/traceability only
- static validation passing does not authorize execution
- failing static validation blocks
- validation output is not provider execution evidence
- validation output is not candidate-truth evidence
- validation output is not origin evidence

## Future fixture providerIdentity section

A future illustrative fixture may include provider placeholders for:

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

- providerName placeholder must not imply provider selection in this design
- providerIdentityReviewed must be false unless future review says otherwise
- fallbackProviderAllowed defaults false
- unknown provider blocks
- provider placeholders do not authorize provider execution

## Future fixture modelIdentity section

A future illustrative fixture may include model placeholders for:

- modelName
- modelVersion
- modelSource
- modelConfigurationPath
- modelDefaultSnapshotPath
- modelIdentityReviewed
- modelSwitchAllowed

Rules:

- modelName placeholder must not imply model selection in this design
- modelIdentityReviewed must be false unless future review says otherwise
- modelSwitchAllowed defaults false
- unknown model blocks
- model placeholders do not authorize model calls

## Future fixture endpointIdentity section

A future illustrative fixture may include endpoint placeholders for:

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

- endpoint placeholders do not authorize network calls
- authentication ambiguity blocks
- data retention ambiguity blocks
- privacy ambiguity blocks
- endpointIdentityReviewed must be false unless future review says otherwise

## Future fixture authorizationGates section

A future illustrative fixture may include authorization gate placeholders for:

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

- all gates default false
- fixture design sets no gate true
- a future fixture must not set any gate true unless a reviewed authorization source exists
- fixture validity never authorizes execution by itself
- any authorization gate unexpectedly true is a stop condition

## Future fixture defaultSnapshotStatus section

A future illustrative fixture may include default snapshot placeholders for:

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

- missing snapshots block execution authorization
- unreviewed default mutation blocks
- snapshot placeholders do not mutate provider defaults
- snapshot placeholders do not prove execution safety

## Future fixture promptSourceReviewStatus section

A future illustrative fixture may include prompt/source placeholders for:

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

- unreviewed prompt/source mutation blocks
- prompt placeholders do not authorize model calls
- source placeholders do not authorize source mutation
- unknown prompt/source values must not be guessed

## Future fixture capturePathStatus section

A future illustrative fixture may include capture placeholders for:

- outputCapturePath
- rawResponseCapturePath
- metadataCapturePath
- requestCapturePath
- sensitiveDataPolicy
- retentionPolicy
- capturePathReviewed

Rules:

- capture placeholders do not create artifacts or reports
- missing sensitive data policy blocks
- missing retention policy blocks
- ambiguous capture path blocks
- capture path placeholders must be visibly non-live unless future review authorizes them

## Future fixture failurePolicyStatus section

A future illustrative fixture may include failure policy placeholders for:

- failureMode
- noSilentRerun
- noHiddenFallback
- noAutomaticProviderSwitch
- noAutomaticModelSwitch
- noAutomaticOpenAiFallback
- mutationAfterFailureRequiresReview
- rerunPolicyReviewed

Rules:

- noSilentRerun must remain true
- noHiddenFallback must remain true
- automatic provider fallback must remain false
- automatic model fallback must remain false
- automatic OpenAI API fallback must remain false
- failure stops the lane unless a reviewed rerun policy exists

## Future fixture runtimeApiUiExclusionStatus section

A future illustrative fixture may include runtime/API/UI exclusion placeholders for:

- publicUiCanInitiateProviderExecution
- analyzeRouteCanInitiateProviderExecution
- proposeRouteCanInitiateProviderExecution
- evalsRouteCanInitiateProviderExecution
- hiddenServerActionProviderCall
- hiddenScheduledTaskProviderCall
- runtimeApiUiExecutionAuthorized

Rules:

- all public UI and route execution flags default false
- hidden execution path blocks
- runtime/API/UI execution authorization defaults false
- route placeholders do not create runtime/API/UI wiring

## Future fixture artifactReportAuthorizationStatus section

A future illustrative fixture may include artifact/report placeholders for:

- artifactCreationAuthorized
- reportCreationAuthorized
- artifactPath
- reportPath
- artifactPathReviewed
- reportPathReviewed
- evidenceClass
- publicationFraming

Rules:

- artifact/report authorization defaults false
- publicationFraming defaults false
- unreviewed artifact/report path blocks
- artifact/report placeholders do not create artifacts or reports

## Future fixture evidenceBoundaryStatus section

A future illustrative fixture may include evidence boundary placeholders for:

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
- fixture output is not model evidence

## Future fixture finalDecision section

A future illustrative fixture may include final decision placeholders for:

- not_ready
- blocked
- ready_for_review
- ready_for_explicit_execution_authorization

Rules:

- future illustrative fixture should default to not_ready or blocked unless reviewed conditions are satisfied
- ready_for_explicit_execution_authorization does not authorize execution
- fixture itself cannot execute
- execution requires a later reviewed execution PR or reviewed execution run packet

## Future fixture placeholder convention

Placeholder conventions:

- use explicit placeholder labels rather than real provider/model names unless future review authorizes them
- placeholder paths must be visibly non-live
- unknown values should be marked unknown or not_authorized, not guessed
- any unknown execution-relevant value causes blocked
- placeholder fixture must not be copied into production execution without review
- placeholders must not imply provider selection
- placeholders must not imply model selection
- placeholders must not imply OpenAI API use

## Future fixture stop conditions

Future fixture-level stop conditions include:

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

## Future implementation target

Next accepted action after this design lands:

`docs(open-instrument): review provider execution preflight contract fixture design`

The future review should verify:

- fixture design remains non-implementing
- fixture design does not create runnable JSON
- fixture design does not create a fixture file
- fixture design preserves false-by-default gates
- fixture design preserves fail-closed rules
- fixture design does not authorize provider execution
