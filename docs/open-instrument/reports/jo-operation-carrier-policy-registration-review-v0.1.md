# JO Stage 2 operation/carrier policy registration review v0.1

Status: **JO_STAGE2_OPERATION_CARRIER_POLICY_REVIEW_ACCEPTED_READY_FOR_IMPLEMENTATION**

Decision:

`JO_OPERATION_OR_CARRIER_POLICY_IMPLEMENTATION`

## Purpose

This review evaluates the next bounded JO transition after the accepted and
merged Stage-1 candidate-registry placement.

The purpose of Stage 2 is only to register JO's reviewed operation and carrier
policy before any production admission or runtime authorization.

It does not authorize JO as a production canonical operator.

## Current merged-main correction

Reviewed current main at the time of this decision:

`98bef9c8a4abb8f10d909b9aee55b3ce29ca154b`

Current JO machine state is:

- `CANDIDATE_REGISTERED`
- `NOT_ADMITTED`
- `NOT_AUTHORIZED`
- `NOT_PROJECTED`
- `NOT_PROFILED`
- `NOT_OPERATION_REGISTERED`
- `NOT_CARRIER_REGISTERED`
- `NOT_LIVE_SMOKE_REGISTERED`
- `NOT_CANON_LOCK_ADMITTED`

DA, DI and AT remain the production canonical operators.

Historical Stage-1 reports and proposal-state tables remain historical records
of their reviewed bases and must not be rewritten merely because a later stage
advances.

## Accepted Stage-2 production owner

The only production implementation owner authorized by this review is:

`src/shared/reviewedExternalLexiconEvidenceOperationPolicy.v0_1.ts`

Carrier policy remains co-owned by this shared operation-policy owner.

No separate JO carrier module is authorized.

## Accepted policy identity

Source ID:

`reviewed.external.jo.refusal.candidate.v0_1`

Operator:

`JO`

Embryo:

`JO`

Allowed evidence operations:

`["exact"]`

Allowed evidence carrier forms:

`["jo"]`

Bounded functional scope:

`standalone_refusal_or_explicit_rejection`

The policy applies only to the exact reviewed JO evidence identity.

## Required positive proof

The required positive control is:

`jo`

The accepted positive must resolve through:

- source ID `reviewed.external.jo.refusal.candidate.v0_1`;
- embryo `JO`;
- operation `exact`;
- carrier `jo`.

No larger lexical form is admitted by this review.

## Required negative controls

Cross-operator negatives:

- `po`
- `da`
- `di`

Lexical collision negatives:

- `major`
- `enjoy`
- `joke`
- `joint`
- `banjo`
- `judo`

These controls must not receive JO reviewed evidence.

## Required policy rejection behavior

Stage-2 implementation must fail closed for:

- prefix extraction;
- suffix extraction;
- substring extraction;
- transformed carrier;
- reconstructed carrier;
- missing carrier;
- unsupported operation;
- embryo mismatch;
- missing policy.

Existing generic reason-code behavior should be reused.

No JO-specific evaluator is authorized.

## Shared policy registry contract correction

The current shared policy test contains an older invariant that requires:

`reviewedExternalLexiconEvidenceOperationPoliciesV0_1`

to have exactly the same length as the current production-row registry.

That invariant is incompatible with the accepted staged transition.

Stage 2 intentionally registers JO's reviewed operation/carrier policy while JO
is still outside production membership.

Therefore the implementation lane is authorized to update:

`tests/reviewedExternalLexiconEvidenceOperationPolicy.v0_1.spec.ts`

The corrected invariant must be:

1. every production source row has exactly one shared operation/carrier policy;
2. production rows must remain fully covered;
3. an explicitly reviewed candidate-stage policy may exist before production
   admission when a dedicated reviewed transition authorizes it;
4. JO's Stage-2 policy must appear exactly once;
5. JO must remain outside production membership;
6. no arbitrary candidate row may acquire policy merely by appearing in the
   candidate registry.

The implementation must not solve this by admitting JO to production early.

## Historical-test correction boundary

Several earlier JO contract tests inspect mutable current policy owners while
also preserving historical pre-Stage-2 review text.

After Stage-2 implementation those current-owner absence assertions become
stale even though the historical documents themselves remain correct.

The Stage-2 implementation lane may make the smallest necessary test-only
updates to such contracts so that they distinguish:

- historical reviewed state; from
- current post-Stage-2 machine state.

Historical reports must not be rewritten to pretend Stage 2 existed earlier.

Likely affected historical contract owners include:

- `tests/joSourceRowDesignPackage.contract.v0_1.spec.ts`
- `tests/joSourceRowDesignPackageAcceptanceReview.contract.v0_1.spec.ts`
- `tests/joThirdOperatorScopeOperationCarrierControlMatrix.contract.v0_1.spec.ts`
- `tests/joThirdOperatorSourceReadinessDecision.contract.v0_1.spec.ts`
- `tests/joCandidateRegistryTransitionReview.contract.v0_1.spec.ts`
- `tests/joSourceRowTransitionProposal.contract.v0_1.spec.ts`

Only assertions invalidated by the new reviewed Stage-2 machine state may be
changed.

## Explicitly unauthorized production owners

Stage 2 must not modify JO behavior in:

- `src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1.ts`
- `src/shared/reviewedExternalLexiconFunctionalRuntimeAuthorization.v0_1.ts`
- `src/shared/reviewedExternalLexiconRuntimeProjection.v0_1.ts`
- `src/shared/canonicalOperatorProfile.v0_1.ts`
- `src/shared/canonicalOperatorCanonLockAdmission.v0_1.ts`
- `src/shared/canonicalOperatorReviewedTargetFamily.v0_1.ts`
- `src/shared/canonicalOperatorDiscovery.v0_1.ts`
- `src/shared/deepRoot.rootMap.builder.v1.ts`
- `scripts/open-instrument/canonical-operator-live-smoke-cases.v0.1.ts`
- `scripts/open-instrument/live-smoke.v0.1.ts`
- `app/api/analyze-v1`
- Open Instrument UI owners

No bespoke JO runtime projector is authorized.

No bespoke JO route is authorized.

No bespoke JO RootMap branch is authorized.

No bespoke JO UI branch is authorized.

## Production-membership boundary

Stage 2 must preserve:

`reviewed.external.jo.refusal.candidate.v0_1`

outside:

`PRODUCTION_SOURCE_ROW_IDS_V0_1`

Operation-policy registration is not production admission.

Carrier-policy registration is not production admission.

## Runtime boundary

Stage 2 must preserve:

- JO machine authorization false;
- JO generic runtime projection null;
- no JO reviewed RootMap projection;
- no JO live-smoke registration.

Operation-policy registration is not runtime authorization.

## Profile and lifecycle boundary

Stage 2 must not create a JO canonical profile.

Stage 2 must not assign JO:

- `runtime_verified`;
- `canon_locked`.

Stage 3 remains the separate canonical-profile pre-runtime lane.

## Exact Stage-2 success state

After accepted implementation JO must be:

- `CANDIDATE_REGISTERED`
- `OPERATION_REGISTERED`
- `CARRIER_REGISTERED`
- `NOT_ADMITTED`
- `NOT_AUTHORIZED`
- `NOT_PROJECTED`
- `NOT_PROFILED`
- `NOT_LIVE_SMOKE_REGISTERED`
- `NOT_CANON_LOCK_ADMITTED`

DA / DI / AT production behavior must remain unchanged.

## Claim boundaries

Stage 2 does not establish:

- historical origin;
- historical transmission;
- borrowing direction;
- earliest absolute origin;
- linguistic ownership;
- winner status;
- language superiority;
- candidate truth;
- general sentence-level negation ownership;
- unrestricted negative polarity;
- PO/JO conceptual-polarity ownership;
- universal lexical correctness.

User-decision posture remains:

`user_decides`

## Rollback boundary

Stage-2 rollback must remain small:

1. remove only the JO operation/carrier policy row;
2. restore the shared policy contract to the preceding machine state;
3. leave the accepted Stage-1 JO candidate row intact;
4. confirm JO remains outside production membership;
5. confirm JO remains unauthorized;
6. confirm JO runtime projection remains null;
7. confirm DA / DI / AT remain unchanged.

## Review decision

The Stage-2 operation/carrier policy design is accepted.

The next accepted task is:

`JO_OPERATION_OR_CARRIER_POLICY_IMPLEMENTATION`

That implementation must remain limited to the shared operation/carrier policy
seam, its focused tests, and the minimum historical-contract corrections made
necessary by the reviewed Stage-2 state.

No later JO transition is authorized by this review.
