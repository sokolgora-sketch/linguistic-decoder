# Open Instrument provider execution authorization lane checklist v0.1

Status: implemented

Scope: static reviewer checklist only

Lane: Open Instrument provider execution authorization

## Checklist purpose

This checklist converts the reviewed provider execution authorization lane design into a static reviewer checklist.

This checklist is for reviewing future authorization documents.

This checklist is not provider execution.

This checklist is not provider-execution readiness.

This checklist is not model-quality evidence.

This checklist is not origin evidence.

This checklist is not candidate-truth evidence.

This checklist is not publication evidence.

This checklist is not execution-safety evidence.

This checklist does not authorize provider execution.

This checklist does not authorize model calls.

This checklist does not authorize OpenAI API use.

This checklist does not authorize network access.

This checklist does not authorize runtime, API, or UI wiring.

This checklist does not authorize provider default mutation.

This checklist does not authorize model default mutation.

This checklist does not authorize fixture mutation.

This checklist does not authorize schema mutation.

This checklist does not authorize artifacts.

This checklist does not authorize reports.

This checklist does not authorize evidence packs.

This checklist does not authorize publication framing.

## Source documents

Checklist implementation authorization:

- docs/open-instrument/open-instrument-provider-execution-authorization-lane-checklist-implementation-authorization-v0.1.md

Provider execution authorization lane design:

- docs/open-instrument/open-instrument-provider-execution-authorization-lane-design-v0.1.md

Provider execution authorization lane design review:

- docs/open-instrument/open-instrument-provider-execution-authorization-lane-design-review-v0.1.md

Provider execution preflight safety runway closure:

- docs/open-instrument/open-instrument-provider-execution-preflight-safety-runway-close-v0.1.md

Main before checklist implementation:

- f6276bc6
- f6276bc61f5b9c315f143aef2287f2b422c68b41

## 1. Repository state checklist

A reviewer must confirm:

- [ ] repository is on the expected branch
- [ ] repository is clean before changes
- [ ] repository is synced with origin/main
- [ ] origin/main divergence is 0 0 before work begins
- [ ] no unexpected open non-dependency PR exists
- [ ] latest main matches the expected reviewed authorization source
- [ ] future implementation branch is scoped to the authorized lane
- [ ] final PR diff includes only authorized files
- [ ] final changed-file guard includes only authorized files

Fail closed if any repository state item is missing or ambiguous.

## 2. Closed runway status checklist

A reviewer must confirm:

- [ ] the Open Instrument provider execution preflight safety runway v0.1 is closed
- [ ] the closed runway says no provider execution task is accepted by closure
- [ ] the closed runway says future provider execution requires a separate explicit authorization lane
- [ ] the closed runway remains CI-backed safety infrastructure only
- [ ] the closed runway does not authorize provider execution
- [ ] the closed runway does not authorize model calls
- [ ] the closed runway does not authorize OpenAI API use
- [ ] the closed runway does not authorize network access
- [ ] the closed runway does not authorize runtime/API/UI wiring

Fail closed if the future authorization ignores the closed runway.

## 3. Preflight gates checklist

Before any future implementation lane, a reviewer must confirm these gates are required:

- [ ] npm run open-instrument:validate-run-packet-fixture
- [ ] npm run open-instrument:validate-provider-execution-preflight-static-fixture
- [ ] npm run open-instrument:audit-provider-execution-preflight-mapping-coverage
- [ ] npm run build
- [ ] npm run gate:quick
- [ ] GitHub CI checks
- [ ] git diff --check
- [ ] exact changed-file guard
- [ ] exact PR diff guard before merge

Fail closed if any preflight gate is missing.

## 4. Provider identity checklist

A reviewer must confirm the future authorization names:

- [ ] exact provider family
- [ ] exact provider identity state
- [ ] whether provider is fixture, local_stub, local_provider, openai_compat_provider, or external_provider
- [ ] whether any live provider name is present
- [ ] whether fallback provider behavior is forbidden
- [ ] whether provider auto-selection is forbidden
- [ ] whether provider default mutation is forbidden

Fail closed if provider identity is missing, implicit, fallback-based, or auto-selected.

## 5. Model identity checklist

A reviewer must confirm the future authorization names:

- [ ] exact model family or model placeholder
- [ ] exact model identity state
- [ ] whether model is none, fixture, local_stub, named_local_model, or named_external_model
- [ ] whether any live model name is present
- [ ] whether fallback model behavior is forbidden
- [ ] whether model auto-selection is forbidden
- [ ] whether model default mutation is forbidden

Fail closed if model identity is missing, implicit, fallback-based, or auto-selected.

## 6. Endpoint identity checklist

A reviewer must confirm the future authorization names:

- [ ] exact endpoint type
- [ ] exact endpoint identity state
- [ ] whether endpoint is none, local_stub, local_openai_compatible, or explicit_external_endpoint
- [ ] whether endpoint URL is present
- [ ] whether endpoint discovery is forbidden
- [ ] whether endpoint fallback is forbidden
- [ ] whether network access is allowed or blocked

Fail closed if endpoint identity is missing, implicit, fallback-based, or discovered.

## 7. Command identity checklist

A reviewer must confirm the future authorization names:

- [ ] exact command
- [ ] exact working directory
- [ ] exact input path
- [ ] exact output path, if any
- [ ] exact expected stdout markers
- [ ] exact expected stderr markers, if any
- [ ] exact exit-code behavior
- [ ] exact timeout behavior
- [ ] exact retry behavior

Fail closed if the command is implicit, partial, interactive, or fallback-based.

## 8. Environment variable policy checklist

A reviewer must confirm the future authorization lists every environment variable as:

- [ ] required
- [ ] optional
- [ ] forbidden

A reviewer must confirm:

- [ ] undeclared provider credentials are forbidden
- [ ] undeclared OpenAI credentials are forbidden
- [ ] undeclared endpoint URLs are forbidden
- [ ] undeclared output paths are forbidden
- [ ] undeclared model names are forbidden
- [ ] missing required environment variables fail closed

Fail closed if environment behavior is undeclared or implicit.

## 9. Secrets policy checklist

Default policy:

- [ ] secrets are not allowed

If a future lane requests secrets, a reviewer must confirm a separate explicit authorization names:

- [ ] secret names
- [ ] secret purpose
- [ ] secret scope
- [ ] storage location
- [ ] CI usage
- [ ] local usage
- [ ] redaction policy
- [ ] failure behavior

Fail closed if secrets are used without separate explicit authorization.

## 10. Network policy checklist

Default policy:

- [ ] network access is not allowed

If a future lane requests network access, a reviewer must confirm a separate explicit authorization names:

- [ ] endpoint URL
- [ ] endpoint type
- [ ] provider identity
- [ ] model identity
- [ ] request shape
- [ ] response shape
- [ ] timeout policy
- [ ] retry policy
- [ ] logging policy
- [ ] redaction policy

Fail closed if network access is used without separate explicit authorization.

## 11. Artifact policy checklist

Default policy:

- [ ] artifacts are not allowed

If a future lane requests artifacts, a reviewer must confirm a separate explicit authorization names:

- [ ] artifact type
- [ ] artifact path
- [ ] artifact schema
- [ ] artifact retention policy
- [ ] artifact evidence class
- [ ] artifact non-publication boundary
- [ ] artifact review requirement

Fail closed if artifacts are created without separate explicit authorization.

## 12. Evidence policy checklist

Default policy:

- [ ] provider-output evidence is not allowed
- [ ] candidate-truth evidence is not allowed
- [ ] origin evidence is not allowed
- [ ] model-quality evidence is not allowed
- [ ] publication evidence is not allowed
- [ ] execution-safety evidence is not allowed

If a future lane requests any evidence class, a reviewer must confirm a separate explicit authorization names:

- [ ] evidence class
- [ ] source
- [ ] schema
- [ ] review process
- [ ] quality threshold
- [ ] publication boundary
- [ ] retention policy

Fail closed if evidence is claimed without separate explicit authorization.

## 13. File-scope policy checklist

A reviewer must confirm the future authorization lists:

- [ ] exact allowed changed files
- [ ] exact forbidden changed files
- [ ] exact expected new files
- [ ] exact expected modified files
- [ ] exact expected deleted files, if any
- [ ] exact changed-file guard
- [ ] exact PR diff guard before merge

Default forbidden files:

- [ ] runtime source files
- [ ] API route files
- [ ] UI component files
- [ ] package metadata
- [ ] fixtures
- [ ] schemas
- [ ] CI workflow files
- [ ] artifact files
- [ ] report files
- [ ] evidence-pack files
- [ ] publication files

Fail closed on changed-file drift.

## 14. Runtime/API/UI boundary checklist

Default policy:

- [ ] runtime wiring is not allowed
- [ ] API wiring is not allowed
- [ ] UI wiring is not allowed

A reviewer must confirm:

- [ ] no app route is added
- [ ] no API route is added
- [ ] no UI control is added
- [ ] no client wiring is added
- [ ] no server action is added
- [ ] no runtime provider selection path is added
- [ ] no model selection UI is added

Fail closed if runtime/API/UI wiring appears without separate explicit authorization.

## 15. Fixture/schema boundary checklist

Default policy:

- [ ] fixture mutation is not allowed
- [ ] schema mutation is not allowed

A reviewer must confirm:

- [ ] no fixture file is added unless explicitly authorized
- [ ] no fixture file is modified unless explicitly authorized
- [ ] no schema file is added unless explicitly authorized
- [ ] no schema file is modified unless explicitly authorized
- [ ] no fixture is treated as provider output
- [ ] no fixture is treated as candidate-truth evidence
- [ ] no schema is treated as execution-safety evidence

Fail closed if fixture/schema drift appears without separate explicit authorization.

## 16. Default mutation boundary checklist

A reviewer must confirm:

- [ ] provider defaults are not mutated
- [ ] model defaults are not mutated
- [ ] endpoint defaults are not mutated
- [ ] environment defaults are not mutated
- [ ] fixture defaults are not mutated
- [ ] schema defaults are not mutated
- [ ] CI defaults are not mutated
- [ ] UI defaults are not mutated

Fail closed if any default mutation is present without separate explicit authorization.

## 17. Failure policy checklist

A reviewer must confirm the future implementation fails closed on:

- [ ] missing provider identity
- [ ] missing model identity
- [ ] missing endpoint identity
- [ ] missing command
- [ ] missing environment policy
- [ ] missing secrets policy
- [ ] missing network policy
- [ ] missing artifact policy
- [ ] missing evidence policy
- [ ] changed-file drift
- [ ] provider fallback
- [ ] model fallback
- [ ] endpoint fallback
- [ ] fixture mutation
- [ ] schema mutation
- [ ] unexpected artifact creation
- [ ] unexpected report creation
- [ ] unexpected evidence-pack creation
- [ ] runtime/API/UI drift

Fail closed if the failure policy is incomplete.

## 18. Rollback policy checklist

A reviewer must confirm the future authorization defines:

- [ ] rollback trigger
- [ ] rollback command
- [ ] rollback changed files
- [ ] rollback proof command
- [ ] rollback review requirement
- [ ] rollback DF_BRAIN entry requirement
- [ ] rollback non-publication boundary

Fail closed if rollback behavior is missing or ambiguous.

## 19. Stop conditions checklist

Stop immediately if any future lane attempts to:

- [ ] execute a provider without explicit authorization
- [ ] call a model without explicit authorization
- [ ] call OpenAI without explicit authorization
- [ ] use network access without explicit authorization
- [ ] use secrets without explicit authorization
- [ ] mutate provider defaults
- [ ] mutate model defaults
- [ ] mutate fixtures without explicit authorization
- [ ] mutate schemas without explicit authorization
- [ ] add runtime/API/UI wiring without explicit authorization
- [ ] create artifacts without explicit authorization
- [ ] create reports without explicit authorization
- [ ] create evidence packs without explicit authorization
- [ ] claim provider-output evidence without explicit authorization
- [ ] claim candidate-truth evidence without explicit authorization
- [ ] claim origin evidence without explicit authorization
- [ ] claim model-quality evidence without explicit authorization
- [ ] claim publication evidence without explicit authorization
- [ ] claim execution-safety evidence without explicit authorization

## 20. Review requirements checklist

A reviewer must confirm every future implementation lane has a review PR.

The review PR must confirm:

- [ ] exact changed files
- [ ] exact command used
- [ ] exact provider identity
- [ ] exact model identity
- [ ] exact endpoint identity
- [ ] exact environment variables
- [ ] exact outputs
- [ ] exact non-outputs
- [ ] exact evidence boundary
- [ ] exact failure behavior
- [ ] exact rollback behavior
- [ ] exact DF_BRAIN update

No implementation lane is complete without a review PR.

## 21. Non-authorization statement checklist

A reviewer must confirm the future authorization states:

- [ ] it is not provider execution
- [ ] it is not provider-execution readiness
- [ ] it is not model-quality evidence
- [ ] it is not origin evidence
- [ ] it is not candidate-truth evidence
- [ ] it is not publication evidence
- [ ] it is not execution-safety evidence
- [ ] it does not authorize provider execution
- [ ] it does not authorize model calls
- [ ] it does not authorize OpenAI API use
- [ ] it does not authorize network access
- [ ] it does not authorize runtime/API/UI wiring
- [ ] it does not authorize artifacts, reports, evidence packs, or publication framing

Fail closed if any non-authorization statement is missing.

## Final checklist decision

A future authorization passes this checklist only if every required item is explicitly satisfied.

A future authorization fails closed if any item is missing, ambiguous, implicit, fallback-based, or out of scope.

This checklist does not authorize provider execution.

This checklist only constrains future authorization review.

## Next accepted task

The next accepted task after this checklist lands is:

- docs(open-instrument): review provider execution authorization lane checklist v0.1

That review must remain docs-only.

That review must not authorize provider execution.
