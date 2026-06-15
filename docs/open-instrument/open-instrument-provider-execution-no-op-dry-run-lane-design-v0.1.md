# Open Instrument provider execution no-op dry-run lane design v0.1

Status: design

Scope: design only

Lane: Open Instrument provider execution no-op dry-run

## Purpose

This document designs a future no-op dry-run lane for provider execution authorization.

The future no-op dry-run lane is intended to test authorization discipline without provider execution.

The future no-op dry-run lane is intended to exercise review boundaries, changed-file guards, and preflight gates without calling a provider.

The future no-op dry-run lane is intended to remain local, deterministic, and non-networked unless a later explicit authorization says otherwise.

## Non-authorization statement

This document does not authorize provider execution.

This document does not authorize model calls.

This document does not authorize OpenAI API use.

This document does not authorize network access.

This document does not authorize runtime, API, or UI wiring.

This document does not authorize provider default mutation.

This document does not authorize model default mutation.

This document does not authorize fixture mutation.

This document does not authorize schema mutation.

This document does not authorize package metadata changes.

This document does not authorize CI workflow changes.

This document does not authorize helper script changes.

This document does not authorize test changes.

This document does not authorize artifacts.

This document does not authorize reports.

This document does not authorize evidence packs.

This document does not authorize publication framing.

This design is not provider-execution readiness.

This design is not model-quality evidence.

This design is not origin evidence.

This design is not candidate-truth evidence.

This design is not publication evidence.

This design is not execution-safety evidence.

The repository remains in a blocked provider-execution posture.

## Source checklist posture

The provider execution authorization checklist lane v0.1 is closed.

The closed checklist lane produced an accepted static reviewer checklist.

The accepted checklist constrains future authorization review.

The accepted checklist does not authorize provider execution.

Source closure:

- docs/open-instrument/open-instrument-provider-execution-authorization-lane-checklist-close-v0.1.md

Accepted checklist:

- docs/open-instrument/open-instrument-provider-execution-authorization-lane-checklist-v0.1.md

Accepted checklist review:

- docs/open-instrument/open-instrument-provider-execution-authorization-lane-checklist-review-v0.1.md

Provider execution authorization lane design:

- docs/open-instrument/open-instrument-provider-execution-authorization-lane-design-v0.1.md

Provider execution authorization lane design review:

- docs/open-instrument/open-instrument-provider-execution-authorization-lane-design-review-v0.1.md

Provider execution preflight safety runway closure:

- docs/open-instrument/open-instrument-provider-execution-preflight-safety-runway-close-v0.1.md

Current main before this design:

- 62d4394b
- 62d4394ba1f27d45757cad1582f3389c56ba1db1

## Design-only lane sequence

The no-op dry-run lane must follow this sequence:

1. design no-op dry-run lane
2. review no-op dry-run lane design
3. authorize one future no-op dry-run implementation
4. implement only the explicitly authorized no-op dry-run scope
5. review no-op dry-run implementation
6. close no-op dry-run lane
7. decide whether a later live-provider authorization lane is still allowed

No implementation step is authorized by this design.

No live-provider step is authorized by this design.

## Intended future no-op definition

A future no-op dry-run must mean:

- no provider execution
- no model call
- no OpenAI API use
- no network access
- no secrets
- no live endpoint
- no live provider name
- no live model name
- no runtime/API/UI wiring
- no artifact creation unless separately explicitly authorized
- no report creation unless separately explicitly authorized
- no evidence-pack creation unless separately explicitly authorized

The future no-op dry-run may only be local and deterministic.

The future no-op dry-run may only prove that authorization checks and guards work.

The future no-op dry-run must not be presented as provider-output evidence.

The future no-op dry-run must not be presented as execution-safety evidence.

## Provider identity design

Default provider identity for the future no-op dry-run:

- provider family: none
- provider identity state: no_provider
- live provider name present: false
- provider execution authorized: false
- provider fallback authorized: false
- provider auto-selection authorized: false
- provider default mutation authorized: false

A future implementation must fail closed if it introduces:

- openai
- anthropic
- google
- ollama
- openai_compat live provider
- provider URL
- provider key
- provider fallback
- provider auto-selection
- provider default mutation

## Model identity design

Default model identity for the future no-op dry-run:

- model family: none
- model identity state: no_model
- live model name present: false
- model call authorized: false
- model fallback authorized: false
- model auto-selection authorized: false
- model default mutation authorized: false

A future implementation must fail closed if it introduces:

- gpt
- llama
- qwen
- claude
- gemini
- named local model
- named external model
- model fallback
- model auto-selection
- model default mutation

## Endpoint identity design

Default endpoint identity for the future no-op dry-run:

- endpoint type: none
- endpoint URL: none
- live endpoint URL present: false
- network access authorized: false
- endpoint fallback authorized: false
- endpoint discovery authorized: false

A future implementation must fail closed if it introduces:

- http
- https
- localhost provider endpoint
- OpenAI-compatible endpoint
- external endpoint
- endpoint discovery
- endpoint fallback
- network access

## Command identity design

A future no-op dry-run implementation must define one exact command.

The command must be local and deterministic.

The command must not be interactive.

The command must not require secrets.

The command must not call a network.

The command must not call a provider.

The command must not call a model.

The command must not mutate fixtures.

The command must not mutate schemas.

The command must not write artifacts unless separately explicitly authorized.

The command must not write reports unless separately explicitly authorized.

The command must not write evidence packs unless separately explicitly authorized.

The command must have deterministic stdout markers.

The command must have deterministic failure markers.

The command must have exact changed-file guards.

## Environment variable policy design

Default future no-op dry-run environment policy:

- required environment variables: none
- optional environment variables: none
- forbidden provider credential variables: all
- forbidden OpenAI credential variables: all
- forbidden endpoint URL variables: all
- forbidden model name variables: all
- forbidden artifact path variables: all
- forbidden evidence path variables: all

A future implementation must fail closed if it reads undeclared environment variables.

A future implementation must fail closed if it accepts provider credentials.

A future implementation must fail closed if it accepts OpenAI credentials.

A future implementation must fail closed if it accepts endpoint URLs.

A future implementation must fail closed if it accepts model names.

## Secrets policy design

Default policy:

- secrets are not allowed

The future no-op dry-run must not use secrets.

The future no-op dry-run must not read secrets.

The future no-op dry-run must not require secrets.

The future no-op dry-run must not pass secrets to CI.

The future no-op dry-run must not redact secrets because no secrets should exist.

Any secrets requirement requires a separate explicit authorization lane.

## Network policy design

Default policy:

- network access is not allowed

The future no-op dry-run must not use network access.

The future no-op dry-run must not call localhost endpoints.

The future no-op dry-run must not call external endpoints.

The future no-op dry-run must not call OpenAI endpoints.

The future no-op dry-run must not call OpenAI-compatible endpoints.

The future no-op dry-run must not use curl.

The future no-op dry-run must not use fetch.

Any network requirement requires a separate explicit authorization lane.

## Artifact policy design

Default policy:

- artifacts are not allowed

The future no-op dry-run must not create artifacts by default.

The future no-op dry-run must not upload artifacts.

The future no-op dry-run must not create reports.

The future no-op dry-run must not create evidence packs.

The future no-op dry-run must not create publication material.

Any artifact requirement requires a separate explicit authorization lane.

## Evidence policy design

Default policy:

- provider-output evidence is not allowed
- candidate-truth evidence is not allowed
- origin evidence is not allowed
- model-quality evidence is not allowed
- publication evidence is not allowed
- execution-safety evidence is not allowed

The future no-op dry-run may only prove guard behavior.

The future no-op dry-run must not prove provider quality.

The future no-op dry-run must not prove model quality.

The future no-op dry-run must not prove origin.

The future no-op dry-run must not prove candidate truth.

The future no-op dry-run must not prove live execution safety.

## File-scope design

A future no-op dry-run implementation authorization must list exact allowed changed files.

Default allowed changed files for a future implementation should be limited to docs unless separately explicitly authorized.

Default forbidden changed files:

- runtime source files
- API route files
- UI component files
- package metadata
- fixtures
- schemas
- CI workflow files
- artifact files
- report files
- evidence-pack files
- publication files

Any deviation requires separate explicit authorization.

The future implementation must include an exact changed-file guard.

The future implementation must include an exact PR diff guard before merge.

## Runtime/API/UI boundary design

Default policy:

- runtime wiring is not allowed
- API wiring is not allowed
- UI wiring is not allowed

The future no-op dry-run must not add runtime provider selection.

The future no-op dry-run must not add API routes.

The future no-op dry-run must not add UI controls.

The future no-op dry-run must not add client provider selection.

The future no-op dry-run must not add server provider selection.

Any runtime/API/UI requirement requires a separate explicit authorization lane.

## Fixture/schema boundary design

Default policy:

- fixture mutation is not allowed
- schema mutation is not allowed

The future no-op dry-run must not mutate checked-in fixtures.

The future no-op dry-run must not mutate checked-in schemas.

The future no-op dry-run must not treat fixtures as provider output.

The future no-op dry-run must not treat schemas as execution evidence.

Any fixture/schema requirement requires a separate explicit authorization lane.

## Required preflight gates

Before any future no-op dry-run implementation PR can be created, these gates must pass:

- npm run open-instrument:validate-run-packet-fixture
- npm run open-instrument:validate-provider-execution-preflight-static-fixture
- npm run open-instrument:audit-provider-execution-preflight-mapping-coverage

A future implementation PR must also pass:

- npm run build
- npm run gate:quick
- GitHub CI checks
- git diff --check
- exact changed-file guard
- exact PR diff guard before merge

## Review requirement

A future no-op dry-run implementation must be followed by a review PR.

The review PR must verify:

- exact changed files
- exact command identity
- exact provider identity
- exact model identity
- exact endpoint identity
- exact environment policy
- exact secrets policy
- exact network policy
- exact artifact policy
- exact evidence policy
- exact file-scope policy
- exact failure policy
- exact rollback policy
- exact stop conditions
- exact DF_BRAIN update

No no-op dry-run implementation lane is complete without a review PR.

## Stop conditions

Stop immediately if any future no-op dry-run lane attempts to:

- execute a provider
- call a model
- call OpenAI
- use network access
- use secrets
- use a live provider name
- use a live model name
- use a live endpoint URL
- mutate provider defaults
- mutate model defaults
- mutate fixtures
- mutate schemas
- add runtime/API/UI wiring
- create artifacts without explicit authorization
- create reports without explicit authorization
- create evidence packs without explicit authorization
- claim provider-output evidence
- claim candidate-truth evidence
- claim origin evidence
- claim model-quality evidence
- claim publication evidence
- claim execution-safety evidence

## Dependency PR note

Open Dependabot PRs are outside this no-op dry-run design lane.

Dependency updates must be handled in separate dependency lanes.

Dependency updates do not authorize provider execution.

Dependency updates do not change the no-op dry-run posture.

## Next accepted task

The next accepted task after this design lands is:

- docs(open-instrument): review provider execution no-op dry-run lane design v0.1

That review must remain docs-only.

That review must not authorize provider execution.

That review must not authorize model calls.

That review must not authorize OpenAI API use.

That review must not authorize network access.
