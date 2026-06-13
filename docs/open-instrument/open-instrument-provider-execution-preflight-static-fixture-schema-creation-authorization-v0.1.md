# Open Instrument provider execution preflight static fixture schema creation authorization v0.1

## Status

This document is:

- authorization-only
- docs-only
- static fixture schema creation authorization only
- no schema file created by this PR
- no fixture mutation by this PR
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
- no execution authorization granted by this PR

## Purpose

This document authorizes one future PR to create one static JSON schema file for the provider execution preflight static fixture.

This document does not create that schema.

This document does not mutate the fixture.

This document does not create validation code.

This document does not create tests.

This document does not alter package files.

This document does not alter CI workflows.

This document does not authorize provider execution.

This document does not authorize model calls.

This document does not authorize OpenAI API use.

This document does not authorize runtime/API/UI wiring.

## Source authorization chain

Accepted static fixture schema authorization boundary design review:

- PR #1327
- title: `docs(open-instrument): review static fixture schema authorization boundary design`
- merge SHA: `7d4a0a7a53945d33e4e0ca23c4f6d657c9c76761`
- short SHA: `7d4a0a7a`
- doc: `docs/open-instrument/open-instrument-provider-execution-preflight-static-fixture-schema-authorization-boundary-design-review-v0.1.md`

Accepted static fixture schema authorization boundary design:

- PR #1326
- title: `docs(open-instrument): design static fixture schema authorization boundary`
- merge SHA: `e15a49c07e15d3161c5c9b342b0ef02588a7bedd`
- short SHA: `e15a49c0`
- doc: `docs/open-instrument/open-instrument-provider-execution-preflight-static-fixture-schema-authorization-boundary-design-v0.1.md`

Accepted static fixture:

- PR #1325
- title: `docs(open-instrument): create provider execution preflight static JSON fixture`
- merge SHA: `81b8f05b109c31bbab8667e8f3e102529b0aed2f`
- short SHA: `81b8f05b`
- fixture: `docs/open-instrument/fixtures/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-v0.1.json`

Accepted static fixture creation authorization:

- PR #1324
- title: `docs(open-instrument): authorize static JSON fixture creation`
- merge SHA: `f163333f047ffb600310aaae40b6dedb741a77f3`
- short SHA: `f163333f`
- doc: `docs/open-instrument/open-instrument-provider-execution-preflight-static-json-fixture-creation-authorization-v0.1.md`

Accepted provider execution preflight design lane closure:

- PR #1319
- title: `docs(open-instrument): close provider execution preflight design lane`
- merge SHA: `4a692c654b22e5c304607caac3a5ac153bdf5227`
- short SHA: `4a692c65`

Closed static run packet fixture validation lane:

- PR #1305
- title: `docs(open-instrument): close run packet fixture validation lane`
- merge SHA: `5c6e3ac55d0b539bc55132c69e0414863201fc13`
- short SHA: `5c6e3ac5`

## Authorization decision

Static fixture schema creation is authorized for one future PR only.

The authorization is limited to this exact path:

`docs/open-instrument/schemas/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-schema-v0.1.json`

No other schema path is authorized.

No fixture mutation is authorized.

No validation code is authorized.

No tests are authorized.

No package script wiring is authorized.

No CI workflow wiring is authorized.

No runtime/API/UI wiring is authorized.

No provider execution is authorized.

No model call is authorized.

No OpenAI API use is authorized.

The future PR may create the parent directory for this exact schema path if needed.

The future PR may create only this schema file.

## Authorization flags

For the future schema creation PR only:

- docsOnlyAuthorized: true
- staticFixtureSchemaCreationAuthorized: true
- authorizedSchemaPath: `docs/open-instrument/schemas/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-schema-v0.1.json`

All other authorization remains false:

- fixtureMutationAuthorized: false
- validationCodeCreationAuthorized: false
- validationTestCreationAuthorized: false
- packageScriptWiringAuthorized: false
- ciWorkflowWiringAuthorized: false
- runtimeApiUiWiringAuthorized: false
- providerExecutionAuthorized: false
- modelCallAuthorized: false
- openAiApiUseAuthorized: false
- artifactReportCreationAuthorized: false
- publicationFramingAuthorized: false
- fallbackProviderAuthorized: false
- fallbackModelAuthorized: false
- silentRerunAuthorized: false
- hiddenExecutionPathAuthorized: false

Any true field outside docsOnlyAuthorized and staticFixtureSchemaCreationAuthorized fails closed.

Missing authorization fields fail closed.

Unknown authorization fields fail closed.

Ambiguous authorization fields fail closed.

## Authorized schema requirements

The future schema must validate only the static fixture shape.

The future schema must not validate:

- provider output
- model output
- runtime API requests
- OpenAI API requests
- publication artifacts
- live execution payloads
- provider request payloads
- model request payloads
- artifact/report outputs

The future schema must not authorize or imply execution.

The future schema must not include examples that look like live execution payloads.

The future schema must not include live provider names.

The future schema must not include live model names.

The future schema must not include live endpoint URLs.

The future schema must not include API keys, secrets, credentials, tokens, or user data.

## Required schema coverage

The future schema must cover these fixture sections:

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

The future schema must require explicit false authorization gates for:

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

The future schema must require explicit false evidence gates for:

- providerOutputEvidence
- candidateTruthEvidence
- originEvidence
- modelQualityEvidence
- publicationEvidence
- executionSafetyEvidence

The future schema must allow only these fixture finalDecision values:

- blocked_static_fixture_only
- static_fixture_ready_for_schema_authorization_review

## Required future changed-file guard

The future schema creation PR must prove that the changed files are exactly:

`docs/open-instrument/schemas/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-schema-v0.1.json`

The future PR must fail closed if any of these paths change:

- `docs/open-instrument/fixtures/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-v0.1.json`
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

The future PR must fail closed if any fixture mutation occurs.

The future PR must fail closed if validation code, tests, package files, CI files, runtime/API/UI files, or source files change.

## Required future checks

The future schema creation PR must run:

- `npm run open-instrument:validate-run-packet-fixture`
- `npx jest -c jest.config.mjs tests/openInstrument.runPacketFixtureValidation.v0.1.spec.ts --runInBand`
- `npx jest -c jest.config.mjs tests/openInstrument.runPacketFixtureValidationIntegrationGate.v0.1.spec.ts --runInBand`
- `npm run build`
- `npm run gate:quick`
- `git diff --check`

The future PR must also run a one-off local JSON schema sanity check without adding validation code.

The future PR must pass all required checks.

Any failed check fails closed.

Any skipped required check fails closed unless explicitly reviewed in a separate review document.

## Required future stop conditions

The future schema creation PR must stop when:

- repo is dirty before branch creation
- main is not synced
- unexpected non-dependency PR exists
- static fixture is missing
- schema authorization source is missing
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

## Non-goals

This authorization does not authorize:

- fixture mutation
- validation code
- validation tests
- package script wiring
- CI workflow wiring
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
- static fixture schema authorization evidence only
- not provider-output evidence
- not candidate-truth evidence
- not origin evidence
- not model-quality evidence
- not publication evidence
- not execution-safety evidence

This authorization does not prove schema correctness.

This authorization does not validate the fixture.

This authorization does not authorize runtime execution.

This authorization does not authorize provider execution.

## Next accepted task

Next accepted action after this authorization lands:

`docs(open-instrument): create provider execution preflight static fixture schema`

The future task may create only:

`docs/open-instrument/schemas/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-schema-v0.1.json`

The future task must not mutate:

`docs/open-instrument/fixtures/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-v0.1.json`

The future task must not create validation code.

The future task must not create tests.

The future task must not alter package files.

The future task must not alter CI workflows.

The future task must not alter runtime/API/UI files.

The future task must not authorize or perform provider execution.

The future task must not authorize or perform model calls.

The future task must not authorize or perform OpenAI API use.
