# Open Instrument provider execution authorization lane design v0.1

Status: design only

Scope: future authorization lane blueprint only

Lane: Open Instrument provider execution authorization

## Design decision

This document designs a future authorization lane for provider execution.

This document does not authorize provider execution.

This document does not authorize model calls.

This document does not authorize OpenAI API use.

This document does not authorize network access.

This document does not authorize runtime, API, or UI wiring.

This document does not authorize provider default mutation.

This document does not authorize fixture mutation.

This document does not authorize schema mutation.

This document does not authorize artifact upload, report generation, evidence-pack creation, or publication framing.

The repository remains in a blocked provider-execution posture.

## Starting point

The starting point is the closed Open Instrument provider execution preflight safety runway v0.1.

Source closure:

- docs/open-instrument/open-instrument-provider-execution-preflight-safety-runway-close-v0.1.md

Main at the closed runway:

- eb0ea388
- eb0ea388ca47536abd371b3769c7381be9b5f887

The closed runway established CI-backed safety infrastructure:

1. npm run open-instrument:validate-run-packet-fixture
2. npm run open-instrument:validate-provider-execution-preflight-static-fixture
3. npm run open-instrument:audit-provider-execution-preflight-mapping-coverage

The closed runway did not authorize provider execution.

## Purpose of the future authorization lane

The future authorization lane exists to decide whether any provider execution work may begin.

The lane must answer only this question:

- Is a tightly scoped future provider execution step authorized?

The lane must not execute providers by itself.

The lane must not call models by itself.

The lane must not call OpenAI by itself.

The lane must not wire runtime, API, or UI paths by itself.

The lane must not create evidence packs by itself.

The lane must not publish claims by itself.

## Required future lane sequence

A future provider execution authorization lane must follow this sequence:

1. design provider execution authorization lane
2. review provider execution authorization lane design
3. authorize one tiny implementation lane
4. implement only the authorized tiny step
5. review the tiny implementation
6. close the tiny implementation lane
7. decide whether another authorization lane is needed

No implementation may occur before design review and explicit authorization.

No provider execution may occur from design or review documents.

No provider execution may occur from a closure document.

## Minimum future authorization document

A future authorization document must identify:

- exact provider family
- exact model family or model placeholder
- exact endpoint type
- exact command
- exact environment variables
- exact changed files
- exact forbidden files
- exact secrets policy
- exact network policy
- exact artifact policy
- exact evidence policy
- exact failure policy
- exact rollback policy
- exact stop conditions

If any field is missing, authorization fails closed.

## Provider identity requirements

A future authorization document must name the provider identity.

Allowed provider identity states:

- fixture
- local_stub
- local_provider
- openai_compat_provider
- external_provider

Only one provider identity may be authorized per implementation lane.

A future authorization must not allow provider fallback.

A future authorization must not allow provider auto-selection.

A future authorization must not mutate provider defaults.

A future authorization must not use a provider matrix unless a separate matrix-specific authorization exists.

## Model identity requirements

A future authorization document must name the model identity.

Allowed model identity states:

- none
- fixture
- local_stub
- named_local_model
- named_external_model

Only one model identity may be authorized per implementation lane.

A future authorization must not allow model fallback.

A future authorization must not allow model auto-selection.

A future authorization must not mutate model defaults.

A future authorization must not use a model matrix unless a separate matrix-specific authorization exists.

## Endpoint requirements

A future authorization document must name the endpoint type.

Allowed endpoint type states:

- none
- local_stub
- local_openai_compatible
- explicit_external_endpoint

Only one endpoint type may be authorized per implementation lane.

A future authorization must not allow endpoint fallback.

A future authorization must not allow endpoint discovery.

A future authorization must not add runtime API routes unless separately authorized.

## Command requirements

A future authorization document must name the exact command.

The exact command must be copyable.

The exact command must not rely on implicit defaults.

The exact command must not hide provider or model identity.

The exact command must not mutate fixtures.

The exact command must not mutate schemas.

The exact command must not write artifacts unless artifact creation is explicitly authorized.

The exact command must fail closed on missing configuration.

## Environment variable requirements

A future authorization document must list every environment variable required by the command.

A future authorization document must state whether each variable is required, optional, or forbidden.

A future authorization document must forbid undeclared provider credentials.

A future authorization document must forbid undeclared OpenAI credentials.

A future authorization document must forbid undeclared endpoint URLs.

A future authorization document must forbid undeclared output paths.

A future authorization document must fail closed if undeclared environment variables are required.

## Secrets policy

A future authorization document must state whether secrets are allowed.

Default policy:

- secrets are not allowed

If secrets are allowed in a future lane, that lane must be separately authorized.

If secrets are allowed in a future lane, the authorization must name:

- secret names
- purpose
- scope
- storage location
- CI usage
- local usage
- redaction policy
- failure behavior

No current document authorizes secrets.

## Network policy

A future authorization document must state whether network access is allowed.

Default policy:

- network access is not allowed

If network access is allowed in a future lane, that lane must be separately authorized.

If network access is allowed in a future lane, the authorization must name:

- endpoint URL
- endpoint type
- provider identity
- model identity
- request shape
- response shape
- timeout policy
- retry policy
- logging policy
- redaction policy

No current document authorizes network access.

## Artifact policy

A future authorization document must state whether artifacts may be created.

Default policy:

- artifacts are not allowed

If artifacts are allowed in a future lane, that lane must be separately authorized.

If artifacts are allowed in a future lane, the authorization must name:

- artifact type
- artifact path
- artifact schema
- artifact retention policy
- artifact evidence class
- artifact non-publication boundary
- artifact review requirement

No current document authorizes artifact creation.

## Evidence policy

A future authorization document must state whether any output may be treated as evidence.

Default policy:

- no provider-output evidence
- no candidate-truth evidence
- no origin evidence
- no model-quality evidence
- no publication evidence
- no execution-safety evidence

If any evidence class is allowed, that class must be separately authorized.

If any evidence class is allowed, the authorization must name:

- evidence class
- source
- schema
- review process
- quality threshold
- publication boundary
- retention policy

No current document authorizes evidence creation.

## File scope policy

A future authorization document must list exact allowed changed files.

A future authorization document must list exact forbidden changed files.

Default forbidden files:

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

Any exception must be explicit.

If changed files drift outside the allowed list, the lane fails closed.

## Required preflight gates

Before any future provider execution implementation PR can be created, these gates must pass:

- npm run open-instrument:validate-run-packet-fixture
- npm run open-instrument:validate-provider-execution-preflight-static-fixture
- npm run open-instrument:audit-provider-execution-preflight-mapping-coverage

The future implementation PR must also pass:

- npm run build
- npm run gate:quick
- GitHub CI checks

The future implementation PR must include a final changed-file guard.

The future implementation PR must include a final PR diff guard before merge.

## Runtime/API/UI boundary

A future authorization document must state whether runtime, API, or UI wiring is allowed.

Default policy:

- runtime wiring is not allowed
- API wiring is not allowed
- UI wiring is not allowed

If runtime/API/UI wiring is allowed, that must be a separate authorization lane.

No current document authorizes runtime/API/UI wiring.

## Failure policy

A future provider execution implementation must fail closed on:

- missing provider identity
- missing model identity
- missing endpoint identity
- missing command
- missing environment policy
- missing secrets policy
- missing network policy
- missing artifact policy
- missing evidence policy
- changed-file drift
- provider fallback
- model fallback
- endpoint fallback
- fixture mutation
- schema mutation
- unexpected artifact creation
- unexpected report creation
- unexpected evidence-pack creation
- runtime/API/UI drift

## Review requirements

Every future implementation lane must have a review PR.

The review PR must be docs-only unless separately authorized.

The review PR must confirm:

- exact changed files
- exact command used
- exact provider identity
- exact model identity
- exact endpoint identity
- exact environment variables
- exact outputs
- exact non-outputs
- exact evidence boundary
- exact failure behavior

No implementation lane may be considered complete without a review PR.

## Stop conditions

Stop immediately if any future lane attempts to:

- execute a provider without explicit authorization
- call a model without explicit authorization
- call OpenAI without explicit authorization
- use network access without explicit authorization
- use secrets without explicit authorization
- mutate provider defaults
- mutate model defaults
- mutate fixtures without explicit authorization
- mutate schemas without explicit authorization
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

This design is not model-quality evidence.

This design is not origin evidence.

This design is not candidate-truth evidence.

This design is not publication evidence.

This design is not execution-safety evidence.

This design only defines the shape of a future authorization lane.

## Next accepted task

The next accepted task after this design lands is:

- docs(open-instrument): review provider execution authorization lane design v0.1

That review must remain docs-only.

That review must not authorize provider execution.
