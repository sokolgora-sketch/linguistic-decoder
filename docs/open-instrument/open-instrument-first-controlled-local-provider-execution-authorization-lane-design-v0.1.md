# Open Instrument first controlled local-provider execution authorization lane design v0.1

Status: design

Scope: design only

Lane: first controlled local-provider execution authorization

## Design decision

This document designs a future first controlled local-provider execution authorization lane.

This document is docs-only.

This document does not authorize provider execution.

This document does not authorize model calls.

This document does not authorize OpenAI API use.

This document does not authorize network access.

This document does not authorize localhost access.

This document does not authorize Ollama access.

This document does not authorize OpenAI-compatible endpoint access.

This document does not authorize secrets.

This document does not authorize runtime/API/UI wiring.

This document does not authorize source changes.

This document does not authorize tests.

This document does not authorize package metadata changes.

This document does not authorize CI changes.

This document does not authorize helper script changes.

This document does not authorize fixture mutation.

This document does not authorize schema mutation.

This document does not authorize artifacts.

This document does not authorize reports.

This document does not authorize evidence packs.

This document does not authorize publication framing.

Provider execution remains blocked.

## Source basis

This design follows the post-assessment clarification that broke the self-reference loop after the controlled local-provider milestone closure assessment.

Source clarification:

- docs/open-instrument/open-instrument-controlled-local-provider-post-assessment-next-step-clarification-v0.1.md
- PR #1375
- bc3536a712baac4d138c7b30f49bb7786c666eb0

Source assessment:

- docs/open-instrument/open-instrument-controlled-local-provider-milestone-closure-assessment-v0.1.md
- PR #1374
- 564c01e0564f5509912d0742f39f10ffb32fe2

Closed controlled local-provider implementation lane:

- docs/open-instrument/open-instrument-controlled-local-provider-implementation-lane-close-v0.1.md
- PR #1373
- bfc7225ecda3318a5b0bcba5aae1ff69549fc189

Controlled local-provider source chain:

- PR #1368 — design controlled local-provider authorization lane
- PR #1369 — review controlled local-provider authorization lane design
- PR #1370 — authorize controlled local-provider implementation
- PR #1371 — implement controlled local-provider
- PR #1372 — review controlled local-provider implementation
- PR #1373 — close controlled local-provider implementation lane
- PR #1374 — assess controlled local-provider milestone closure
- PR #1375 — clarify controlled local-provider post-assessment next step

## Purpose

The purpose of this design is to define what a future authorization lane must require before any first controlled local-provider execution can be considered.

The future authorization lane may only authorize a later implementation if it explicitly names every allowed execution boundary.

This design does not name a provider.

This design does not name a model.

This design does not name an endpoint.

This design does not authorize a command.

This design does not authorize an environment variable.

This design does not authorize secrets.

This design does not authorize network access.

This design does not authorize localhost access.

This design does not authorize Ollama access.

This design does not authorize OpenAI-compatible endpoint access.

## Future authorization lane shape

A future first controlled local-provider execution authorization lane must be separate from this design.

A future authorization lane must be docs-only until it is reviewed and accepted.

A future authorization lane must explicitly decide whether any later implementation may:

- name a concrete local provider
- name a concrete local model
- name a concrete local endpoint
- permit localhost access
- permit Ollama access
- permit OpenAI-compatible endpoint access
- read environment variables
- require or forbid secrets
- execute one local-provider command
- write any output files
- classify any output as evidence

If any item is omitted, the future lane must fail closed.

## Provider identity requirements for future authorization

A future authorization lane must explicitly define provider identity before any execution can be authorized.

Required fields:

- provider family
- concrete provider name
- local provider name present
- live provider name present
- provider fallback policy
- provider auto-selection policy
- provider discovery policy
- provider default mutation policy
- provider identity failure policy

Default state for this design:

- provider family: local_only_candidate
- provider identity state: not_authorized
- concrete provider name: none
- local provider name present: false
- live provider name present: false
- provider fallback authorized: false
- provider auto-selection authorized: false
- provider discovery authorized: false
- provider default mutation authorized: false

This design does not authorize provider identity.

## Model identity requirements for future authorization

A future authorization lane must explicitly define model identity before any execution can be authorized.

Required fields:

- model family
- concrete model name
- local model name present
- live model name present
- model fallback policy
- model auto-selection policy
- model discovery policy
- model default mutation policy
- model identity failure policy

Default state for this design:

- model family: local_only_candidate
- model identity state: not_authorized
- concrete model name: none
- local model name present: false
- live model name present: false
- model fallback authorized: false
- model auto-selection authorized: false
- model discovery authorized: false
- model default mutation authorized: false

This design does not authorize model identity.

## Endpoint identity requirements for future authorization

A future authorization lane must explicitly define endpoint identity before any execution can be authorized.

Required fields:

- endpoint type
- endpoint identity state
- endpoint URL
- localhost access policy
- Ollama access policy
- OpenAI-compatible endpoint access policy
- external endpoint access policy
- OpenAI API access policy
- endpoint fallback policy
- endpoint discovery policy
- endpoint failure policy

Default state for this design:

- endpoint type: none
- endpoint identity state: not_authorized
- endpoint URL: none
- localhost access authorized: false
- Ollama access authorized: false
- OpenAI-compatible endpoint access authorized: false
- external endpoint access authorized: false
- OpenAI API access authorized: false
- endpoint fallback authorized: false
- endpoint discovery authorized: false

This design does not authorize endpoint identity.

## Command identity requirements for future authorization

A future authorization lane must explicitly define command identity before any execution can be authorized.

Required fields:

- command name
- command purpose
- command input source
- command output policy
- command timeout policy
- command retry policy
- command failure policy
- provider call count policy
- model call count policy
- network call count policy
- artifact/report/evidence output policy

Default state for this design:

- command authorized: false
- provider command authorized: false
- model command authorized: false
- network command authorized: false
- artifact command authorized: false
- report command authorized: false
- evidence-pack command authorized: false

This design does not authorize a command.

## Environment, secrets, and network requirements for future authorization

A future authorization lane must explicitly define all environment, secrets, and network rules before any execution can be authorized.

Required fields:

- required environment variables
- optional environment variables
- forbidden environment variables
- credential variable policy
- endpoint variable policy
- model variable policy
- OpenAI credential variable policy
- provider credential variable policy
- secrets policy
- network access policy
- localhost access policy
- Ollama access policy
- OpenAI-compatible endpoint access policy

Default state for this design:

- required environment variables: none
- optional environment variables: none
- undeclared environment variables read: false
- credential variables accepted: false
- endpoint variables accepted: false
- model variables accepted: false
- OpenAI credential variables accepted: false
- provider credential variables accepted: false
- secrets allowed: false
- secrets read: false
- network access allowed: false
- network access attempted: false

This design does not authorize environment variables, secrets, or network access.

## Runtime/API/UI requirements for future authorization

A future authorization lane must explicitly define whether runtime/API/UI wiring is allowed.

Default state for this design:

- runtime wiring authorized: false
- API wiring authorized: false
- UI wiring authorized: false
- route wiring authorized: false
- client wiring authorized: false
- provider-selection UI authorized: false
- production UI exposure authorized: false

This design does not authorize runtime/API/UI wiring.

## Artifact, report, and evidence requirements for future authorization

A future authorization lane must explicitly define whether any output files are allowed.

Default state for this design:

- artifacts authorized: false
- reports authorized: false
- evidence packs authorized: false
- publication framing authorized: false
- provider-output evidence: false
- candidate-truth evidence: false
- origin evidence: false
- model-quality evidence: false
- publication evidence: false
- execution-safety evidence: false

This design does not authorize artifacts, reports, evidence packs, publication framing, or evidence claims.

## File-scope requirements for future authorization

A future authorization lane must list exact allowed changed files before any implementation can be authorized.

Default state for this design:

- allowed changed files: this design doc only
- source changes authorized: false
- test changes authorized: false
- package metadata changes authorized: false
- CI changes authorized: false
- helper script changes authorized: false
- fixture mutation authorized: false
- schema mutation authorized: false
- artifact creation authorized: false
- report creation authorized: false
- evidence-pack creation authorized: false

This design does not authorize file changes outside this document.

## Required future validation gates

A future authorization lane must require these gates before any later implementation can be considered:

- node --check scripts/openInstrumentRunPacketFixtureValidation.v0.1.mjs
- node --check scripts/openInstrumentProviderExecutionPreflightStaticFixtureSchemaValidation.v0.1.mjs
- node --check scripts/openInstrumentProviderExecutionPreflightMappingCoverageAudit.v0.1.mjs
- npm run open-instrument:validate-run-packet-fixture
- npm run open-instrument:validate-provider-execution-preflight-static-fixture
- npm run open-instrument:audit-provider-execution-preflight-mapping-coverage
- npx jest -c jest.config.mjs tests/openInstrument.runPacketFixtureValidation.v0.1.spec.ts tests/openInstrument.runPacketFixtureValidationIntegrationGate.v0.1.spec.ts --runInBand
- npx jest -c jest.config.mjs tests/openInstrument.providerExecutionPreflightStaticFixtureSchemaValidation.v0.1.spec.ts tests/openInstrument.providerExecutionPreflightStaticFixtureSchemaValidationIntegrationGate.v0.1.spec.ts --runInBand
- npx jest -c jest.config.mjs tests/openInstrument.providerExecutionPreflightMappingCoverageAudit.v0.1.spec.ts --runInBand
- npm run build
- npm run gate:quick
- git diff --check

A future authorization lane must also require GitHub checks to pass before merge.

## Stop conditions

Stop immediately if this design or any future lane attempts to:

- execute a provider
- call a model
- call OpenAI
- use network access
- use localhost access
- use Ollama
- use an OpenAI-compatible endpoint
- use secrets
- use a concrete provider name without explicit authorization
- use a concrete model name without explicit authorization
- use an endpoint URL without explicit authorization
- mutate provider defaults
- mutate model defaults
- mutate fixtures
- mutate schemas
- change source files without explicit authorization
- change tests without explicit authorization
- change package metadata without explicit authorization
- change CI without explicit authorization
- change helper scripts without explicit authorization
- add runtime/API/UI wiring without explicit authorization
- create artifacts without explicit authorization
- create reports without explicit authorization
- create evidence packs without explicit authorization
- claim provider-output evidence without explicit authorization
- claim candidate-truth evidence without explicit authorization
- claim origin evidence without explicit authorization
- claim model-quality evidence without explicit authorization
- claim publication evidence without explicit authorization
- claim execution-safety evidence without explicit authorization

## Non-authorization statement

This design is not provider execution.

This design is not provider-execution readiness.

This design is not a model call.

This design is not OpenAI API use.

This design is not network access.

This design is not localhost access.

This design is not Ollama access.

This design is not OpenAI-compatible endpoint access.

This design is not secrets usage.

This design is not runtime/API/UI wiring.

This design is not provider-output evidence.

This design is not candidate-truth evidence.

This design is not origin evidence.

This design is not model-quality evidence.

This design is not publication evidence.

This design is not execution-safety evidence.

This design only defines requirements for a future first controlled local-provider execution authorization lane.

## Next accepted task

The next accepted task after this design lands is:

- docs(open-instrument): review first controlled local-provider execution authorization lane design v0.1

That future review must remain docs-only.

That future review must not execute providers.

That future review must not call models.

That future review must not call OpenAI.

That future review must not use network access.

That future review must not use localhost access.

That future review must not use Ollama.

That future review must not use OpenAI-compatible endpoint access.

That future review must not use secrets.


## Verification marker note

This section records exact traceability markers for future review scripts.

- A future authorization lane must be separate from this design.
- docs/open-instrument: design first controlled local-provider execution authorization lane v0.1
