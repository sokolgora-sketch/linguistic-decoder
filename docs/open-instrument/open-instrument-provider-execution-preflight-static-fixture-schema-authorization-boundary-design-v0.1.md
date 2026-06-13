# Open Instrument provider execution preflight static fixture schema authorization boundary design v0.1

## Status

This document is:

- design-only
- docs-only
- static fixture schema authorization boundary design only
- no schema file created by this PR
- no implementation in this PR
- no validation code
- no tests
- no package script wiring
- no CI workflow wiring
- no runtime/API/UI wiring
- no provider execution
- no model call
- no OpenAI API use
- no provider default change
- no artifact/report creation
- no publication framing
- no runnable JSON created by this PR
- no fixture mutation by this PR
- no execution authorization granted by this PR
- no schema creation authorization granted by this PR

## Purpose

This document designs the authorization boundary for a future static JSON schema file for the provider execution preflight static fixture.

This document does not create the schema.

This document does not authorize schema creation by itself.

This document does not modify the static fixture.

This document does not create validation code.

This document does not create tests.

This document does not wire package scripts.

This document does not wire CI.

This document does not authorize provider execution.

This document does not authorize model calls.

This document does not authorize OpenAI API use.

This document does not authorize runtime/API/UI wiring.

## Source chain

Accepted static fixture:

- PR #1325
- title: docs(open-instrument): create provider execution preflight static JSON fixture
- merge SHA: 81b8f05b109c31bbab8667e8f3e102529b0aed2f
- short SHA: 81b8f05b
- fixture: docs/open-instrument/fixtures/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-v0.1.json

Accepted static fixture creation authorization:

- PR #1324
- title: docs(open-instrument): authorize static JSON fixture creation
- merge SHA: f163333f047ffb600310aaae40b6dedb741a77f3
- short SHA: f163333f
- doc: docs/open-instrument/open-instrument-provider-execution-preflight-static-json-fixture-creation-authorization-v0.1.md

Accepted static JSON fixture creation authorization boundary design review:

- PR #1323
- title: docs(open-instrument): review static JSON fixture creation authorization boundary design
- merge SHA: ea44279058abdf855803446fc2775ec626fbaf24
- short SHA: ea442790
- doc: docs/open-instrument/open-instrument-provider-execution-preflight-static-json-fixture-creation-authorization-boundary-design-review-v0.1.md

Accepted static JSON fixture creation authorization boundary design:

- PR #1322
- title: docs(open-instrument): design static JSON fixture creation authorization boundary
- merge SHA: e2bce951332cac69446e56bf0ad6f379f7e2f594
- short SHA: e2bce951
- doc: docs/open-instrument/open-instrument-provider-execution-preflight-static-json-fixture-creation-authorization-boundary-design-v0.1.md

Accepted implementation authorization boundary design review:

- PR #1321
- title: docs(open-instrument): review provider execution preflight implementation authorization boundary design
- merge SHA: 5f5b33a7c10d5793031c0a7751d90256c06a4b0f
- short SHA: 5f5b33a7

Accepted implementation authorization boundary design:

- PR #1320
- title: docs(open-instrument): design provider execution preflight implementation authorization boundary
- merge SHA: 8e480c662cd3ea9bb6f537536c541a1ee31f8e6d
- short SHA: 8e480c66

Closed provider execution preflight design lane:

- PR #1319
- title: docs(open-instrument): close provider execution preflight design lane
- merge SHA: 4a692c654b22e5c304607caac3a5ac153bdf5227
- short SHA: 4a692c65

Closed static validation lane:

- PR #1305
- title: docs(open-instrument): close run packet fixture validation lane
- merge SHA: 5c6e3ac55d0b539bc55132c69e0414863201fc13
- short SHA: 5c6e3ac5

## Boundary decision

The static fixture exists.

The static fixture is non-executing.

The static fixture is not runnable input.

The static fixture is not provider output.

The static fixture is not candidate-truth evidence.

The static fixture is not origin evidence.

The static fixture is not model-quality evidence.

The static fixture is not publication evidence.

The static fixture is not execution-safety evidence.

A future schema may be useful to lock the fixture shape.

This document designs the boundary for that future schema.

This document does not authorize schema creation.

Schema creation remains blocked until this design is reviewed and a later authorization PR explicitly authorizes the schema file path.

## Future schema file scope

A future schema authorization boundary may authorize only this exact schema path:

docs/open-instrument/schemas/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-schema-v0.1.json

No other schema path is authorized by this design.

The future schema must validate only the static fixture shape.

The future schema must not validate provider output.

The future schema must not validate model output.

The future schema must not validate runtime API requests.

The future schema must not validate OpenAI API requests.

The future schema must not validate publication artifacts.

## Future schema content scope

A future schema may describe:

- fixtureIdentity
- sourceDocs
- repositoryState
- runPacketStatus
- staticValidationStatus
- providerIdentity
- modelIdentity
- endpointIdentity
- authorizationGates
- defaultSnapshotStatus
- promptSourceReviewStatus
- capturePathStatus
- failurePolicyStatus
- runtimeApiUiExclusionStatus
- artifactReportAuthorizationStatus
- evidenceBoundaryStatus
- finalDecision
- stopConditions
- unmappedFieldPolicy
- nonExecutionDeclaration

A future schema must require explicit false values for:

- providerExecutionAuthorized
- modelCallAuthorized
- openAiApiUseAuthorized
- runtimeApiUiWiringAuthorized
- artifactReportCreationAuthorized
- publicationFramingAuthorized
- fallbackProviderAuthorized
- fallbackModelAuthorized
- silentRerunAuthorized
- hiddenExecutionPathAuthorized

A future schema must require explicit false evidence values for:

- providerOutputEvidence
- candidateTruthEvidence
- originEvidence
- modelQualityEvidence
- publicationEvidence
- executionSafetyEvidence

A future schema must allow only these finalDecision values:

- blocked_static_fixture_only
- static_fixture_ready_for_schema_authorization_review

## Future schema non-goals

A future schema must not authorize or imply:

- provider execution
- model calls
- OpenAI API use
- Ollama calls
- any other provider calls
- runtime/API/UI wiring
- route-triggered provider execution
- server action execution
- scheduled execution
- hidden fallback execution
- validation helper creation
- validation test creation
- package script wiring
- CI workflow wiring
- artifact creation
- report creation
- evidence pack creation
- publication framing
- origin claims
- candidate-truth claims
- model-quality claims
- execution-safety claims

## Future schema PR changed-file policy

A future schema creation PR must change exactly one file:

docs/open-instrument/schemas/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-schema-v0.1.json

The future PR must not change:

- docs/open-instrument/fixtures/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-v0.1.json
- app/
- pages/
- src/
- components/
- lib/
- scripts/
- tests/
- .github/workflows/
- package.json
- package-lock.json

Any fixture mutation fails closed.

Any runtime/API/UI path change fails closed.

Any validation code change fails closed.

Any test change fails closed.

Any package or CI change fails closed.

## Future schema PR required checks

A future schema creation PR must run:

- npm run open-instrument:validate-run-packet-fixture
- npx jest -c jest.config.mjs tests/openInstrument.runPacketFixtureValidation.v0.1.spec.ts --runInBand
- npx jest -c jest.config.mjs tests/openInstrument.runPacketFixtureValidationIntegrationGate.v0.1.spec.ts --runInBand
- npm run build
- npm run gate:quick
- git diff --check

The future PR must also run a one-off local JSON schema sanity check without adding validation code.

Any failed check fails closed.

Any skipped required check fails closed unless separately reviewed.

## Future schema PR stop conditions

A future schema creation PR must stop when:

- repo is dirty before branch creation
- main is not synced
- unexpected non-dependency PR exists
- static fixture is missing
- authorization source is missing
- schema path already exists before branch creation
- changed files are not exactly the authorized schema path
- fixture changes
- TypeScript files change
- scripts change
- tests change
- package files change
- CI workflow files change
- runtime/API/UI files change
- provider execution appears
- model call appears
- OpenAI API use appears
- hidden fallback appears
- silent rerun appears
- provider default changes
- model default changes
- endpoint default changes
- artifact/report creation appears
- publication framing appears
- evidence boundary changes
- required checks fail
- GitHub checks fail
- mergeability fails
- DF_BRAIN is dirty before update

## Evidence boundary

This schema authorization boundary design is:

- authorization planning evidence only
- static fixture schema boundary design evidence only
- not provider-output evidence
- not candidate-truth evidence
- not origin evidence
- not model-quality evidence
- not publication evidence
- not execution-safety evidence

Passing this design does not prove schema correctness.

Passing this design does not create a schema.

Passing this design does not validate the fixture.

Passing this design does not authorize runtime execution.

## Next accepted task

Next accepted action after this design lands:

docs(open-instrument): review static fixture schema authorization boundary design

The future review must confirm:

- this design remains docs-only
- this design remains design-only
- no schema was created
- no fixture was mutated
- no validation code was created
- no tests were created
- no package or CI changes occurred
- no runtime/API/UI wiring occurred
- no provider execution occurred
- no model call occurred
- no OpenAI API use occurred
- schema creation remains blocked until reviewed and explicitly authorized
