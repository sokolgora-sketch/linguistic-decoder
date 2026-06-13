# Open Instrument provider execution preflight static fixture schema validation authorization boundary design v0.1

## Status

This document is:

- design-only
- docs-only
- static fixture schema validation authorization boundary design only
- no validation code created by this PR
- no validation tests created by this PR
- no package script wiring by this PR
- no CI workflow wiring by this PR
- no schema mutation by this PR
- no fixture mutation by this PR
- no runtime/API/UI wiring
- no provider execution
- no model call
- no OpenAI API use
- no provider default change
- no artifact/report creation
- no publication framing
- no runnable JSON created by this PR
- no execution authorization granted by this PR
- no validation implementation authorization granted by this PR

## Purpose

This document designs the authorization boundary for a future validator that may check the provider execution preflight static fixture against its static fixture schema.

This document does not create that validator.

This document does not create tests.

This document does not wire package scripts.

This document does not wire CI.

This document does not mutate the schema.

This document does not mutate the fixture.

This document does not authorize provider execution.

This document does not authorize model calls.

This document does not authorize OpenAI API use.

This document does not authorize runtime/API/UI wiring.

## Source chain

Reviewed static fixture schema:

- PR #1330
- title: `docs(open-instrument): review provider execution preflight static fixture schema`
- merge SHA: `a1f73caa5a909b423241f0758d80ad90a4a596a0`
- short SHA: `a1f73caa`
- review doc: `docs/open-instrument/open-instrument-provider-execution-preflight-static-fixture-schema-review-v0.1.md`

Accepted static fixture schema:

- PR #1329
- title: `docs(open-instrument): create provider execution preflight static fixture schema`
- merge SHA: `f210c5f020bb4793f958f252c6d4e6f90c8b2bce`
- short SHA: `f210c5f0`
- schema: `docs/open-instrument/schemas/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-schema-v0.1.json`

Static fixture schema creation authorization:

- PR #1328
- title: `docs(open-instrument): authorize static fixture schema creation`
- merge SHA: `989b2e6602fad8155d66a2cbbe595b83c78acf66`
- short SHA: `989b2e66`
- authorization doc: `docs/open-instrument/open-instrument-provider-execution-preflight-static-fixture-schema-creation-authorization-v0.1.md`

Static fixture schema authorization boundary review:

- PR #1327
- title: `docs(open-instrument): review static fixture schema authorization boundary design`
- merge SHA: `7d4a0a7a53945d33e4e0ca23c4f6d657c9c76761`
- short SHA: `7d4a0a7a`

Static fixture schema authorization boundary design:

- PR #1326
- title: `docs(open-instrument): design static fixture schema authorization boundary`
- merge SHA: `e15a49c07e15d3161c5c9b342b0ef02588a7bedd`
- short SHA: `e15a49c0`

Accepted static fixture:

- PR #1325
- title: `docs(open-instrument): create provider execution preflight static JSON fixture`
- merge SHA: `81b8f05b109c31bbab8667e8f3e102529b0aed2f`
- short SHA: `81b8f05b`
- fixture: `docs/open-instrument/fixtures/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-v0.1.json`

Provider execution preflight design lane closure:

- PR #1319
- title: `docs(open-instrument): close provider execution preflight design lane`
- merge SHA: `4a692c654b22e5c304607caac3a5ac153bdf5227`
- short SHA: `4a692c65`

Run packet fixture validation lane closure:

- PR #1305
- title: `docs(open-instrument): close run packet fixture validation lane`
- merge SHA: `5c6e3ac55d0b539bc55132c69e0414863201fc13`
- short SHA: `5c6e3ac5`

## Boundary decision

The static fixture exists.

The static fixture schema exists.

The static fixture schema has been reviewed and accepted.

Validation wiring remains blocked.

A future validator may be useful to verify that the static fixture conforms to the static fixture schema.

This document designs the authorization boundary for that future validator.

This document does not authorize validation implementation.

This document does not create validation implementation.

This document does not wire validation into package scripts or CI.

## Future validation scope

A future validation implementation authorization may allow a validator that checks only this fixture:

`docs/open-instrument/fixtures/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-v0.1.json`

against only this schema:

`docs/open-instrument/schemas/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-schema-v0.1.json`

The validator must be local and static.

The validator must not call providers.

The validator must not call models.

The validator must not call OpenAI APIs.

The validator must not call Ollama.

The validator must not call network endpoints.

The validator must not mutate files.

The validator must not create artifacts.

The validator must not create reports.

The validator must not create evidence packs.

The validator must not be runtime/API/UI wiring.

The validator must not be publication tooling.

## Future validation implementation candidate paths

A future authorization may allow these paths only if explicitly accepted later:

- `scripts/openInstrumentProviderExecutionPreflightStaticFixtureSchemaValidation.v0.1.mjs`
- `tests/openInstrument.providerExecutionPreflightStaticFixtureSchemaValidation.v0.1.spec.ts`
- `tests/openInstrument.providerExecutionPreflightStaticFixtureSchemaValidationIntegrationGate.v0.1.spec.ts`

No path above is authorized by this design alone.

A future authorization may allow a package script named:

- `open-instrument:validate-provider-execution-preflight-static-fixture`

No package script is authorized by this design alone.

A future authorization may later allow CI wiring.

No CI workflow change is authorized by this design alone.

## Required validator behavior

A future validator must:

- load the static fixture from the checked-in fixture path
- load the static schema from the checked-in schema path
- validate fixture shape against schema
- fail closed on missing required fields
- fail closed on unknown fields
- fail closed on true execution authorization gates
- fail closed on true evidence gates that must remain false
- fail closed on provider identity drift
- fail closed on model identity drift
- fail closed on endpoint identity drift
- fail closed on finalDecision drift outside the allowed enum
- print a boundary summary
- exit non-zero on validation failure

A future validator must not:

- execute provider calls
- execute model calls
- use OpenAI APIs
- use network calls
- mutate the fixture
- mutate the schema
- create artifacts
- create reports
- create evidence packs
- publish output
- change provider defaults
- change model defaults
- change endpoint defaults
- wire runtime/API/UI paths

## Required test behavior

Future tests, if explicitly authorized later, must prove that validation:

- accepts the checked-in static fixture
- rejects missing required top-level fields
- rejects unknown top-level fields
- rejects true providerExecutionAuthorized
- rejects true modelCallAuthorized
- rejects true openAiApiUseAuthorized
- rejects true runtimeApiUiWiringAuthorized
- rejects true providerOutputEvidence
- rejects true candidateTruthEvidence
- rejects true originEvidence
- rejects true modelQualityEvidence
- rejects true publicationEvidence
- rejects true executionSafetyEvidence
- rejects live provider identity drift
- rejects live model identity drift
- rejects live endpoint identity drift
- rejects unsupported finalDecision drift

Future tests must not require a provider key.

Future tests must not require network access.

Future tests must not call a live provider.

Future tests must not call OpenAI APIs.

## Required future changed-file policy

A future validation implementation authorization must define an exact changed-file set before implementation begins.

At maximum, a future implementation PR may be allowed to change:

- `scripts/openInstrumentProviderExecutionPreflightStaticFixtureSchemaValidation.v0.1.mjs`
- `tests/openInstrument.providerExecutionPreflightStaticFixtureSchemaValidation.v0.1.spec.ts`
- `tests/openInstrument.providerExecutionPreflightStaticFixtureSchemaValidationIntegrationGate.v0.1.spec.ts`
- `package.json`
- `package-lock.json`

Only a later explicit authorization may allow those paths.

This design does not authorize those changes.

A future implementation PR must fail closed if it changes:

- `docs/open-instrument/fixtures/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-v0.1.json`
- `docs/open-instrument/schemas/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-schema-v0.1.json`
- app/
- pages/
- src/
- components/
- lib/
- runtime/API/UI files outside the explicit validator scope
- .github/workflows/ unless later explicitly authorized

## Required future checks

A future validation implementation PR must run:

- `npm run open-instrument:validate-run-packet-fixture`
- `npx jest -c jest.config.mjs tests/openInstrument.runPacketFixtureValidation.v0.1.spec.ts --runInBand`
- `npx jest -c jest.config.mjs tests/openInstrument.runPacketFixtureValidationIntegrationGate.v0.1.spec.ts --runInBand`
- the newly authorized validator command, if created
- the newly authorized focused tests, if created
- `npm run build`
- `npm run gate:quick`
- `git diff --check`

Any failed check fails closed.

Any skipped required check fails closed unless separately reviewed.

## Required future stop conditions

A future validation implementation authorization or implementation PR must stop when:

- repo is dirty before branch creation
- main is not synced
- unexpected non-dependency PR exists
- static fixture is missing
- static fixture schema is missing
- schema review source is missing
- authorization source is missing
- changed files exceed the explicitly authorized set
- fixture changes
- schema changes
- runtime/API/UI files change
- provider execution appears
- model call appears
- OpenAI API use appears
- network call appears
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

This design is:

- validation authorization boundary design evidence only
- not validation implementation evidence
- not provider-output evidence
- not candidate-truth evidence
- not origin evidence
- not model-quality evidence
- not publication evidence
- not execution-safety evidence

A future validator passing must not be interpreted as:

- proof of provider output quality
- proof of candidate truth
- proof of origin
- proof of model quality
- proof of publication readiness
- proof that runtime execution is safe

It may only prove that the checked-in static fixture conforms to the checked-in static schema.

## Next accepted task

Next accepted action after this design lands:

`docs(open-instrument): review static fixture schema validation authorization boundary design`

The future review must confirm:

- this design remains docs-only
- this design remains design-only
- no validation code was created
- no tests were created
- no package script was wired
- no CI workflow was wired
- no schema mutation occurred
- no fixture mutation occurred
- no runtime/API/UI wiring occurred
- no provider execution occurred
- no model call occurred
- no OpenAI API use occurred
- validation implementation remains blocked until separately authorized
