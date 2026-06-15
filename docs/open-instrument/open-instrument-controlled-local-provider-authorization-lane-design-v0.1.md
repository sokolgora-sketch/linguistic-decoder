# Open Instrument controlled local-provider authorization lane design v0.1

Status: design

Scope: design only

Lane: Open Instrument controlled local-provider authorization

## Purpose

This document designs a future controlled local-provider authorization lane.

The purpose is to define what must be true before a later task may authorize a controlled local-provider implementation.

This design follows the closed no-op dry-run lane.

This design moves one step closer to controlled local-provider work while preserving fail-closed authorization boundaries.

This design is not a live-provider authorization.

This design is not an implementation authorization.

This design is not a model-call authorization.

## Non-authorization statement

This document does not authorize provider execution.

This document does not authorize model calls.

This document does not authorize OpenAI API use.

This document does not authorize network access.

This document does not authorize local Ollama calls.

This document does not authorize OpenAI-compatible endpoint calls.

This document does not authorize secrets.

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

## Source lane basis

The provider execution no-op dry-run lane v0.1 is closed.

The no-op lane produced an accepted docs-only no-op dry-run result.

The no-op result proved guard behavior only.

The no-op lane did not authorize provider execution.

The no-op lane did not authorize model calls.

The no-op lane did not authorize OpenAI API use.

The no-op lane did not authorize network access.

No-op lane closure:

- docs/open-instrument/open-instrument-provider-execution-no-op-dry-run-lane-close-v0.1.md

No-op result review:

- docs/open-instrument/open-instrument-provider-execution-no-op-dry-run-review-v0.1.md

No-op result:

- docs/open-instrument/open-instrument-provider-execution-no-op-dry-run-result-v0.1.md

No-op implementation authorization:

- docs/open-instrument/open-instrument-provider-execution-no-op-dry-run-implementation-authorization-v0.1.md

No-op lane design review:

- docs/open-instrument/open-instrument-provider-execution-no-op-dry-run-lane-design-review-v0.1.md

No-op lane design:

- docs/open-instrument/open-instrument-provider-execution-no-op-dry-run-lane-design-v0.1.md

Provider execution authorization checklist closure:

- docs/open-instrument/open-instrument-provider-execution-authorization-lane-checklist-close-v0.1.md

Accepted checklist:

- docs/open-instrument/open-instrument-provider-execution-authorization-lane-checklist-v0.1.md

Accepted checklist review:

- docs/open-instrument/open-instrument-provider-execution-authorization-lane-checklist-review-v0.1.md

Preflight safety runway closure:

- docs/open-instrument/open-instrument-provider-execution-preflight-safety-runway-close-v0.1.md

Current main before this design:

- 1cd7152a
- 1cd7152ae5f481fbe5c6f1605fdaf1fd391643ff

## Design-only lane sequence

The controlled local-provider authorization lane must follow this sequence:

1. design controlled local-provider authorization lane
2. review controlled local-provider authorization lane design
3. authorize one future controlled local-provider implementation
4. implement only the explicitly authorized controlled local-provider scope
5. review controlled local-provider implementation
6. close controlled local-provider authorization lane
7. decide whether any broader provider execution lane is still allowed

No implementation step is authorized by this design.

No local-provider call is authorized by this design.

No model call is authorized by this design.

## Controlled local-provider definition

A future controlled local-provider authorization may only consider local-provider work if it is explicitly scoped.

Default controlled local-provider posture:

- provider family: local_only_candidate
- provider identity state: not_authorized
- model identity state: not_authorized
- endpoint identity state: not_authorized
- provider execution authorized: false
- model call authorized: false
- OpenAI API use authorized: false
- network access authorized: false
- secrets allowed: false
- runtime/API/UI wiring authorized: false
- artifact creation authorized: false
- evidence-pack creation authorized: false

A future authorization must state exact provider identity before implementation.

A future authorization must state exact model identity before implementation.

A future authorization must state exact endpoint identity before implementation.

A future authorization must state exact command identity before implementation.

A future authorization must state exact file-scope policy before implementation.

## Provider identity design

A future controlled local-provider authorization must specify exactly one provider identity.

Allowed provider category for future consideration:

- local provider only

The future authorization must explicitly name whether the provider is:

- Ollama local
- OpenAI-compatible local endpoint
- another local-only provider

This design does not authorize any of those providers.

This design only defines the information a later authorization must contain.

Provider fallback is not allowed by default.

Provider auto-selection is not allowed by default.

Provider discovery is not allowed by default.

Provider default mutation is not allowed by default.

A future lane must fail closed if provider identity is missing, ambiguous, dynamic, or inferred.

## Model identity design

A future controlled local-provider authorization must specify exactly one model identity.

This design does not authorize any model.

A future authorization must explicitly name the model before implementation.

Model fallback is not allowed by default.

Model auto-selection is not allowed by default.

Model discovery is not allowed by default.

Model default mutation is not allowed by default.

A future lane must fail closed if model identity is missing, ambiguous, dynamic, or inferred.

## Endpoint identity design

A future controlled local-provider authorization must specify exactly one endpoint identity.

This design does not authorize any endpoint.

A future authorization must explicitly state:

- endpoint type
- endpoint URL
- whether the endpoint is local-only
- whether network access is required
- whether the network target is localhost only
- whether any external network target is forbidden

Endpoint fallback is not allowed by default.

Endpoint discovery is not allowed by default.

External endpoint access is not allowed by default.

A future lane must fail closed if endpoint identity is missing, ambiguous, dynamic, or inferred.

## Command identity design

A future controlled local-provider authorization must specify exactly one command.

The command must be non-interactive.

The command must be deterministic in file scope.

The command must expose attempt count.

The command must expose provider identity.

The command must expose model identity.

The command must expose endpoint identity.

The command must expose whether a model call is actually made.

The command must expose whether normalization is applied.

The command must expose whether strict validation passes.

The command must expose whether artifacts, reports, or evidence packs are written.

No command is authorized by this design.

## Environment variable policy design

A future controlled local-provider authorization must declare all environment variables.

Default policy:

- required environment variables: none unless explicitly listed
- optional environment variables: none unless explicitly listed
- provider credential variables: forbidden unless explicitly listed
- OpenAI credential variables: forbidden
- external endpoint variables: forbidden
- model override variables: forbidden unless explicitly listed
- artifact path variables: forbidden unless explicitly listed
- evidence path variables: forbidden unless explicitly listed

A future lane must fail closed if undeclared environment variables are read.

A future lane must fail closed if OpenAI credential variables are accepted.

A future lane must fail closed if external endpoint variables are accepted.

## Secrets policy design

Default policy:

- secrets are not allowed

A future controlled local-provider authorization must explicitly state if secrets are required.

If secrets are required, that future authorization must be a separate lane.

This design does not authorize secrets.

This design does not authorize reading secrets.

This design does not authorize passing secrets to CI.

This design does not authorize redaction workflows.

## Network policy design

Default policy:

- network access is not allowed

A future controlled local-provider authorization may only consider local-only network access if explicitly reviewed.

Localhost access is not authorized by this design.

Ollama access is not authorized by this design.

OpenAI-compatible endpoint access is not authorized by this design.

External network access is forbidden by default.

OpenAI API access is forbidden.

A future lane must fail closed if it attempts network access without explicit authorization.

## Artifact, report, and evidence policy design

Default policy:

- artifacts are not allowed
- reports are not allowed
- evidence packs are not allowed
- publication framing is not allowed

A future controlled local-provider authorization must explicitly state any output file.

A future controlled local-provider authorization must state whether an output is an artifact, report, development note, or evidence.

Provider-output evidence is not allowed by default.

Candidate-truth evidence is not allowed by default.

Origin evidence is not allowed by default.

Model-quality evidence is not allowed by default.

Publication evidence is not allowed by default.

Execution-safety evidence is not allowed by default.

A future lane must fail closed if evidence classification is missing, ambiguous, or inflated.

## File-scope design

A future controlled local-provider authorization must list exact allowed changed files.

Default forbidden changed files:

- runtime source files
- API route files
- UI component files
- package metadata
- CI workflow files
- fixtures
- schemas
- helper scripts
- tests
- artifacts
- reports
- evidence packs
- publication files

Any exception must be explicitly authorized.

A future implementation must include an exact changed-file guard.

A future implementation must include an exact PR diff guard before merge.

## Runtime/API/UI boundary design

Default policy:

- runtime wiring is not allowed
- API wiring is not allowed
- UI wiring is not allowed

A future controlled local-provider authorization must not add UI controls by default.

A future controlled local-provider authorization must not add API routes by default.

A future controlled local-provider authorization must not add runtime provider selection by default.

A future lane must fail closed if runtime, API, or UI boundaries are missing, ambiguous, or widened.

## Required preflight gates

Before any future controlled local-provider implementation PR can be created, these gates must pass:

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

A future controlled local-provider implementation must be followed by a review PR.

The review PR must verify:

- exact changed files
- exact provider identity
- exact model identity
- exact endpoint identity
- exact command identity
- exact environment policy
- exact secrets policy
- exact network policy
- exact artifact/report/evidence policy
- exact file-scope policy
- exact runtime/API/UI boundary
- exact failure policy
- exact rollback policy
- exact stop conditions
- exact DF_BRAIN update

No controlled local-provider implementation lane is complete without a review PR.

## Stop conditions

Stop immediately if any future controlled local-provider lane attempts to:

- execute a provider without explicit authorization
- call a model without explicit authorization
- call OpenAI without explicit authorization
- use network access without explicit authorization
- use localhost access without explicit authorization
- use Ollama without explicit authorization
- use an OpenAI-compatible endpoint without explicit authorization
- use secrets without explicit authorization
- use a live provider name without explicit authorization
- use a live model name without explicit authorization
- use a live endpoint URL without explicit authorization
- mutate provider defaults without explicit authorization
- mutate model defaults without explicit authorization
- mutate fixtures without explicit authorization
- mutate schemas without explicit authorization
- change package metadata without explicit authorization
- change CI without explicit authorization
- change source files without explicit authorization
- change tests without explicit authorization
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

## Dependency PR note

Open Dependabot PRs are outside this controlled local-provider authorization lane.

Dependency updates must be handled in separate dependency lanes.

Dependency updates do not authorize provider execution.

Dependency updates do not authorize model calls.

Dependency updates do not authorize OpenAI API use.

Dependency updates do not change the controlled local-provider posture.

## Next accepted task

The next accepted task after this design lands is:

- docs(open-instrument): review controlled local-provider authorization lane design v0.1

That review must remain docs-only.

That review must not authorize provider execution.

That review must not authorize model calls.

That review must not authorize OpenAI API use.

That review must not authorize network access.

That review must not authorize secrets.
