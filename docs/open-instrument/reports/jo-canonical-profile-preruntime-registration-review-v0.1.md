# JO canonical-profile pre-runtime registration review v0.1

Status: `JO_STAGE3_CANONICAL_PROFILE_PRERUNTIME_REVIEW_ACCEPTED_READY_FOR_IMPLEMENTATION`.

Project lane:

- Open Instrument / ZË-RO.

Reviewed base:

- `a730e63a3db0ce71d5dba11447cf4cda9fbb6a56`

Preceding completed stages:

1. JO Stage 1 candidate-registry placement — completed.
2. JO Stage 2 operation/carrier policy registration — completed.

This review authorizes only the bounded Stage-3 profile-registration
implementation described below.

It does not itself mutate production code.

## Decision

Accepted next implementation task:

`JO_STAGE3_CANONICAL_PROFILE_PRERUNTIME_IMPLEMENTATION`

Stage 3 may register JO's canonical profile metadata only if the implementation
preserves the current runtime-mature profile boundary.

Stage 3 must not directly append a pre-runtime JO profile to the existing
runtime-mature `canonicalOperatorProfilesV0_1` consumer view.

## Why a direct append is rejected

The current shared profile architecture gives
`canonicalOperatorProfilesV0_1` runtime-mature semantics.

Current contracts require:

- exactly DA, DI and AT in the runtime-mature view;
- every profile in that view to hold:
  - `runtime_verified`; or
  - `canon_locked`;
- every resolved runtime profile to have:
  - functional readiness;
  - machine authorization;
  - production membership;
  - runtime projection;
- profile-backed live smoke to resolve every member of that runtime view.

JO currently has none of the downstream runtime authorities required by those
consumers.

Therefore adding JO with lifecycle `candidate` directly to the current
runtime-mature view would conflate:

- registered profile metadata;
- runtime-mature canonical profile authority.

Those states must remain distinct.

## Accepted Stage-3 architecture

The implementation must preserve a single source of profile metadata while
separating profile registration from runtime-mature consumption.

Accepted shape:

1. introduce a registered canonical-profile collection in
   `src/shared/canonicalOperatorProfile.v0_1.ts`;
2. the registered collection contains:
   - DA;
   - DI;
   - AT;
   - JO;
3. preserve `canonicalOperatorProfilesV0_1` as the runtime-mature derived view;
4. DA, DI and AT remain the only members of that runtime-mature view at
   Stage 3;
5. `getCanonicalOperatorProfileV0_1(...)` may resolve registered profile
   metadata, including JO;
6. `getResolvedCanonicalOperatorProfilesV0_1()` must remain runtime-mature and
   must not return JO at Stage 3;
7. canonical discovery must remain unable to obtain reviewed JO runtime
   authority;
8. profile-backed live smoke must remain DA/DI/AT only;
9. no duplicate JO profile truth may be introduced.

The exact exported name of the new registered collection may follow the
existing naming style, but it must be a single SSOT from which the runtime
view is derived.

The implementation must not maintain separate copied DA/DI/AT/JO profile
objects in two independent registries.

## Exact JO profile metadata

Stage-3 registered profile:

- profile version:
  `canonical-operator-profile.v0_1`
- operator ID:
  `JO`
- embryo:
  `JO`
- language:
  `sq`
- source ID:
  `reviewed.external.jo.refusal.candidate.v0_1`
- bounded lexical function:
  `standalone refusal / explicit rejection functional motivation`
- reviewed evidence status:
  `reviewed_functional`
- lifecycle:
  `candidate`
- authorization scope:
  `bounded_functional_lexical_projection`
- discovery scope:
  `bounded_targets`
- positive proof words:
  `["jo"]`
- negative control words:
  `["po", "da", "di", "major", "enjoy", "joke", "joint", "banjo", "judo"]`

## Lifecycle decision

Stage 3 uses:

`candidate`

Reason:

- it is an existing supported lifecycle value;
- Stage 1 established candidate registration;
- Stage 2 did not authorize a lifecycle promotion;
- Stage 3 is metadata registration, not production/runtime promotion;
- using `functionally_ready`, `machine_authorized`, `production_member`,
  `runtime_verified` or `canon_locked` would claim a later transition that has
  not been reviewed.

No new lifecycle value is authorized.

## Discovery decision

Stage 3 uses:

`bounded_targets`

Reason:

- accepted JO scope is the standalone refusal / explicit rejection function;
- accepted positive is only `jo`;
- no broad structural JO discovery authority has been reviewed;
- profile registration must not make embedded JO-like material reviewed.

The following remain negative controls:

- `po`
- `da`
- `di`
- `major`
- `enjoy`
- `joke`
- `joint`
- `banjo`
- `judo`

## Existing Stage-2 policy preserved

The exact accepted operation/carrier policy remains:

- source:
  `reviewed.external.jo.refusal.candidate.v0_1`
- embryo:
  `JO`
- operation:
  `exact`
- carrier:
  `jo`

Stage 3 must not broaden this policy.

Stage 3 must not add:

- prefix;
- suffix;
- substring;
- transformed carrier;
- reconstructed carrier;
- larger carrier.

## Current state before Stage 3 implementation

JO is currently:

- `CANDIDATE_REGISTERED`
- `OPERATION_REGISTERED`
- `CARRIER_REGISTERED`
- `NOT_ADMITTED`
- `NOT_AUTHORIZED`
- `NOT_PROJECTED`
- `NOT_PROFILED`
- `NOT_LIVE_SMOKE_REGISTERED`
- `NOT_CANON_LOCK_ADMITTED`

## Required state after accepted Stage 3 implementation

JO must become:

- `CANDIDATE_REGISTERED`
- `OPERATION_REGISTERED`
- `CARRIER_REGISTERED`
- `PROFILE_REGISTERED`
- `NOT_ADMITTED`
- `NOT_AUTHORIZED`
- `NOT_PROJECTED`
- `NOT_RUNTIME_MATURE`
- `NOT_LIVE_SMOKE_REGISTERED`
- `NOT_CANON_LOCK_ADMITTED`

DA, DI and AT remain unchanged.

## Exact production implementation owner

Only this production owner is authorized for Stage 3:

`src/shared/canonicalOperatorProfile.v0_1.ts`

Focused tests and minimal mutable-current-state contract corrections are also
authorized.

No other production owner is authorized.

## Explicitly unauthorized production owners

Stage 3 must not change:

- `src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1.ts`
- `src/shared/reviewedExternalLexiconFunctionalRuntimeAuthorization.v0_1.ts`
- `src/shared/reviewedExternalLexiconRuntimeProjection.v0_1.ts`
- `src/shared/reviewedExternalLexiconEvidenceOperationPolicy.v0_1.ts`
- `src/shared/canonicalOperatorReviewedTargetFamily.v0_1.ts`
- `src/shared/canonicalOperatorCanonLockAdmission.v0_1.ts`
- `src/shared/canonicalOperatorDiscovery.v0_1.ts`
- `src/shared/deepRoot.rootMap.builder.v1.ts`
- `scripts/open-instrument/canonical-operator-live-smoke-cases.v0.1.ts`
- `scripts/open-instrument/live-smoke.v0.1.ts`
- API routes;
- UI files.

If implementation evidence proves that any of these production owners must
change, Stage 3 must stop and return to review rather than expanding scope
silently.

## Historical-contract policy

Earlier Stage-1 and Stage-2 reports remain historical records.

Their statements that JO had no canonical profile were correct for those
stages and must not be rewritten.

Tests that encode mutable current machine state may be minimally reconciled
after Stage-3 implementation.

Historical review conclusions must remain intact.

## Required implementation proof

The Stage-3 implementation lane must prove:

1. exact JO registered profile identity;
2. lifecycle remains `candidate`;
3. discovery scope remains `bounded_targets`;
4. exact positive and negative proof sets;
5. exact Stage-2 operation/carrier policy remains unchanged;
6. JO remains absent from production membership;
7. JO remains machine-unauthorized;
8. JO runtime projection remains absent;
9. JO target-family registration remains absent;
10. JO remains absent from canon-lock admission;
11. runtime-mature profile view remains DA/DI/AT only;
12. resolved runtime-mature profile view remains DA/DI/AT only;
13. profile-backed live-smoke cases remain DA/DI/AT only;
14. canonical discovery produces no reviewed JO result;
15. DA/DI/AT canonical behavior remains unchanged;
16. full gate remains green.

## Rollback

Stage-3 rollback must remove only the registered JO profile metadata and any
Stage-3-specific test reconciliation.

Rollback must leave intact:

- Stage-1 JO candidate row;
- Stage-2 JO operation policy;
- Stage-2 JO carrier policy.

## Claim boundaries

Stage 3 does not establish:

- historical origin;
- historical transmission;
- borrowing direction;
- linguistic ownership;
- language superiority;
- candidate truth;
- scientific proof;
- publication evidence;
- universal negation ownership;
- unrestricted negative polarity;
- PO/JO polarity ownership;
- a single etymological winner.

Historical material remains contextual only.

User-decision posture remains:

`user_decides`

## Review result

Decision:

`JO_STAGE3_CANONICAL_PROFILE_PRERUNTIME_REVIEW_ACCEPTED_READY_FOR_IMPLEMENTATION`

Only next accepted task:

`JO_STAGE3_CANONICAL_PROFILE_PRERUNTIME_IMPLEMENTATION`

Still not authorized:

- `JO_PRODUCTION_MEMBERSHIP_IMPLEMENTATION`
- `JO_FUNCTIONAL_MACHINE_AUTHORIZATION`
- `JO_RUNTIME_PROJECTION_IMPLEMENTATION`
- `JO_TARGET_FAMILY_IMPLEMENTATION`
- `JO_PROFILE_BACKED_LIVE_SMOKE_REGISTRATION`
- `JO_RUNTIME_VERIFIED_TRANSITION`
- `JO_CANON_LOCK_IMPLEMENTATION`

No later JO stage is authorized by this review.
