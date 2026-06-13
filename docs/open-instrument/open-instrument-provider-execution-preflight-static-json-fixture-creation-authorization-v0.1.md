# Open Instrument provider execution preflight static JSON fixture creation authorization v0.1

## Status

This document is:

- authorization-only
- docs-only
- static JSON fixture creation authorization only
- no fixture file created by this PR
- no implementation in this PR
- no provider execution
- no model call
- no OpenAI API use
- no runtime/API/UI wiring
- no provider default change
- no artifact/report creation
- no publication framing
- no runnable JSON created by this PR
- no JSON schema file
- no TypeScript schema
- no validation code
- no package script wiring
- no CI workflow wiring
- no checklist implementation in this PR
- no contract implementation in this PR
- no mapping implementation in this PR
- no audit implementation in this PR
- no execution authorization granted by this PR

## Purpose

This document authorizes one future PR to create one static, non-executing JSON fixture file.

This document does not create that fixture.

This document does not create runnable JSON.

This document does not create schema files.

This document does not create validation code.

This document does not authorize provider execution.

This document does not authorize model calls.

This document does not authorize OpenAI API use.

This document does not authorize runtime/API/UI wiring.

## Source authorization chain

Accepted static JSON fixture creation authorization boundary design review:

- PR #1323
- title: `docs(open-instrument): review static JSON fixture creation authorization boundary design`
- merge SHA: `ea44279058abdf855803446fc2775ec626fbaf24`
- short SHA: `ea442790`
- doc: `docs/open-instrument/open-instrument-provider-execution-preflight-static-json-fixture-creation-authorization-boundary-design-review-v0.1.md`

Accepted static JSON fixture creation authorization boundary design:

- PR #1322
- title: `docs(open-instrument): design static JSON fixture creation authorization boundary`
- merge SHA: `e2bce951332cac69446e56bf0ad6f379f7e2f594`
- short SHA: `e2bce951`
- doc: `docs/open-instrument/open-instrument-provider-execution-preflight-static-json-fixture-creation-authorization-boundary-design-v0.1.md`

Accepted implementation authorization boundary design review:

- PR #1321
- title: `docs(open-instrument): review provider execution preflight implementation authorization boundary design`
- merge SHA: `5f5b33a7c10d5793031c0a7751d90256c06a4b0f`
- short SHA: `5f5b33a7`
- doc: `docs/open-instrument/open-instrument-provider-execution-preflight-implementation-authorization-boundary-design-review-v0.1.md`

Accepted implementation authorization boundary design:

- PR #1320
- title: `docs(open-instrument): design provider execution preflight implementation authorization boundary`
- merge SHA: `8e480c662cd3ea9bb6f537536c541a1ee31f8e6d`
- short SHA: `8e480c66`
- doc: `docs/open-instrument/open-instrument-provider-execution-preflight-implementation-authorization-boundary-design-v0.1.md`

Closed provider execution preflight design lane:

- PR #1319
- title: `docs(open-instrument): close provider execution preflight design lane`
- merge SHA: `4a692c654b22e5c304607caac3a5ac153bdf5227`
- short SHA: `4a692c65`
- doc: `docs/open-instrument/open-instrument-provider-execution-preflight-design-lane-closure-v0.1.md`

Closed static run packet fixture validation lane:

- PR #1305
- title: `docs(open-instrument): close run packet fixture validation lane`
- merge SHA: `5c6e3ac55d0b539bc55132c69e0414863201fc13`
- short SHA: `5c6e3ac5`
- doc: `docs/open-instrument/open-instrument-run-packet-fixture-validation-lane-closure-v0.1.md`

## Authorization decision

Static JSON fixture creation is authorized for one future PR only.

The authorization is limited to this exact path:

`docs/open-instrument/fixtures/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-v0.1.json`

No other file path is authorized.

No other implementation class is authorized.

The future PR may create the parent directory for this exact path if needed.

The future PR may create only this fixture file.

The future PR must not modify existing fixture files.

The future PR must not create schema files.

The future PR must not create validation code.

The future PR must not create tests.

The future PR must not alter package files.

The future PR must not alter CI workflows.

The future PR must not alter runtime/API/UI files.

## Authorization flags

For the future fixture creation PR only:

- docsOnlyAuthorized: true
- staticJsonFixtureCreationAuthorized: true
- authorizedFixturePath: `docs/open-instrument/fixtures/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-v0.1.json`

All other authorization remains false:

- jsonSchemaCreationAuthorized: false
- typeScriptSchemaCreationAuthorized: false
- validationHelperCreationAuthorized: false
- validationTestCreationAuthorized: false
- packageScriptWiringAuthorized: false
- ciWorkflowWiringAuthorized: false
- coverageAuditHelperCreationAuthorized: false
- coverageAuditTestCreationAuthorized: false
- providerExecutionAuthorized: false
- modelCallAuthorized: false
- openAiApiUseAuthorized: false
- runtimeApiUiWiringAuthorized: false
- artifactReportCreationAuthorized: false
- publicationFramingAuthorized: false
- fallbackProviderAuthorized: false
- fallbackModelAuthorized: false
- silentRerunAuthorized: false
- hiddenExecutionPathAuthorized: false

Any true field outside docsOnlyAuthorized and staticJsonFixtureCreationAuthorized fails closed.

Missing authorization fields fail closed.

Unknown authorization fields fail closed.

Ambiguous authorization fields fail closed.

## Authorized fixture requirements

The future fixture must be static and non-executing.

The future fixture must be documentation fixture data only.

The future fixture must not be runnable input.

The future fixture must not be a provider request.

The future fixture must not be a model request.

The future fixture must not be an OpenAI API request.

The future fixture must not be runtime/API/UI wiring.

The future fixture must not be artifact/report output.

The future fixture must not be publication evidence.

The future fixture must not contain:

- live provider name
- live model name
- live endpoint URL
- API key
- secret
- credential
- token
- user data
- prompt payload for live execution
- provider response
- model output
- runtime route reference
- server action reference
- scheduled task reference
- fallback provider
- fallback model
- OpenAI fallback path
- artifact/report path
- publication framing

## Required fixture sections

The future fixture must include sections for:

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

The future fixture must not include an executable request body.

The future fixture must not include provider request parameters.

The future fixture must not include model sampling parameters.

The future fixture must not include network execution settings.

## Required authorization gates inside fixture

The future fixture must include explicit false values for:

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

Any missing execution gate fails closed.

Any unknown execution gate fails closed.

Any true execution gate fails closed.

## Required evidence gates inside fixture

The future fixture must include explicit false values for:

- providerOutputEvidence
- candidateTruthEvidence
- originEvidence
- modelQualityEvidence
- publicationEvidence
- executionSafetyEvidence

The future fixture may only claim:

- preflight-control fixture evidence
- static fixture shape evidence
- design traceability evidence

Any broader evidence claim fails closed.

## Required fixture finalDecision

The future fixture finalDecision must be one of:

- blocked_static_fixture_only
- static_fixture_ready_for_schema_authorization_review

The future fixture must not use:

- ready_for_explicit_execution_authorization
- ready_for_execution
- execution_authorized
- provider_ready
- model_ready
- publishable

Any unknown decision value fails closed.

Any execution-implying decision value fails closed.

## Required source traceability

The future fixture must reference accepted source docs by path and merge SHA.

At minimum, it must trace to:

- PR #1305 static validation lane closure
- PR #1307 boundary design
- PR #1308 boundary design review
- PR #1309 checklist design
- PR #1310 checklist design review
- PR #1311 checklist contract design
- PR #1312 checklist contract design review
- PR #1313 contract fixture design
- PR #1314 contract fixture design review
- PR #1315 fixture contract checklist mapping design
- PR #1316 fixture contract checklist mapping design review
- PR #1317 mapping coverage audit design
- PR #1318 mapping coverage audit design review
- PR #1319 provider execution preflight design lane closure
- PR #1320 implementation authorization boundary design
- PR #1321 implementation authorization boundary design review
- PR #1322 static JSON fixture creation authorization boundary design
- PR #1323 static JSON fixture creation authorization boundary design review
- this authorization document

Missing source traceability fails closed.

Unreviewed source traceability fails closed.

## Required future PR changed-file guard

The future fixture creation PR must prove that the changed files are exactly:

`docs/open-instrument/fixtures/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-v0.1.json`

The future PR must fail closed if any of these paths change:

- docs/open-instrument/open-instrument-provider-execution-preflight-static-json-fixture-creation-authorization-v0.1.md
- docs/open-instrument/open-instrument-provider-execution-preflight-static-json-fixture-creation-authorization-boundary-design-v0.1.md
- docs/open-instrument/open-instrument-provider-execution-preflight-static-json-fixture-creation-authorization-boundary-design-review-v0.1.md
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

The future PR must fail closed if any runtime/API/UI path changes.

The future PR must fail closed if any schema, script, package, CI, or test file changes.

## Required future checks

The future fixture creation PR must run:

- `npm run open-instrument:validate-run-packet-fixture`
- `npx jest -c jest.config.mjs tests/openInstrument.runPacketFixtureValidation.v0.1.spec.ts --runInBand`
- `npx jest -c jest.config.mjs tests/openInstrument.runPacketFixtureValidationIntegrationGate.v0.1.spec.ts --runInBand`
- `npm run build`
- `npm run gate:quick`
- `git diff --check`

The future PR must pass all required checks.

Any failed check fails closed.

Any skipped required check fails closed unless explicitly reviewed in a separate review document.

## Required future PR stop conditions

The future fixture creation PR must stop when:

- repo is dirty before branch creation
- main is not synced
- unexpected non-dependency PR exists
- source docs are missing
- source docs are unreviewed
- changed files are not exactly the authorized fixture path
- schema files change
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

## Non-goals

This authorization does not authorize:

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
- JSON schema creation
- TypeScript schema creation
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

## Evidence boundary

This authorization document is:

- authorization evidence only
- preflight-control authorization evidence only
- not provider-output evidence
- not candidate-truth evidence
- not origin evidence
- not model-quality evidence
- not publication evidence
- not execution-safety evidence

This authorization does not prove future fixture correctness.

This authorization does not prove schema correctness.

This authorization does not prove validation correctness.

This authorization does not prove provider output correctness.

This authorization does not authorize execution.

## Next accepted task

Next accepted action after this authorization lands:

`docs(open-instrument): create provider execution preflight static JSON fixture`

The future task may create only:

`docs/open-instrument/fixtures/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-v0.1.json`

The future task must not create any other file.

The future task must not create schema files.

The future task must not create validation code.

The future task must not create tests.

The future task must not alter package files.

The future task must not alter CI workflows.

The future task must not authorize or perform provider execution.

The future task must not authorize or perform model calls.

The future task must not authorize or perform OpenAI API use.

The future task must not create runtime/API/UI wiring.
