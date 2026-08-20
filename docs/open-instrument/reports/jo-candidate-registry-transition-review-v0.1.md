# JO Candidate Registry Transition Review v0.1

Status: REVIEW_ACCEPTED.

Decision:

- `JO_CANDIDATE_REGISTRY_TRANSITION_REVIEW_ACCEPTED`

Next authorized lane:

- `JO_CANDIDATE_REGISTRY_TRANSITION_IMPLEMENTATION`

Project lane:

- Open Instrument / ZË-RO

Reviewed base:

`6de0cb69bbebdbfd46235e8fa2244578e7f173d3`

## Purpose

This review evaluates only Stage 1 of the accepted JO staged transition:

- candidate-registry placement.

It does not implement JO.

It does not authorize any later transition stage.

## Governing predecessor

The governing staged proposal is:

`docs/open-instrument/reports/jo-source-row-transition-proposal-v0.1.md`

That proposal selected:

- `JO_CANDIDATE_REGISTRY_TRANSITION_REVIEW`

as the next lane.

This review accepts that lane and authorizes only its Stage 1 implementation.

## Current-main correction

The July JO proposal contains machine-state descriptions from its own reviewed
historical base.

Those descriptions remain historical and must not be rewritten.

Current merged-main truth has advanced since then.

Current candidate registry and production membership include:

- DA
- DI
- AT

Current canonical profiles and canon-lock admission likewise include:

- DA
- DI
- AT

JO remains absent from all of those owners.

Therefore the Stage 1 implementation must preserve DA, DI and AT unchanged.

## Accepted JO source identity

Source ID:

`reviewed.external.jo.refusal.candidate.v0_1`

Candidate ID:

`albanian-jo-standalone-refusal-functional`

Language:

`sq`

Embryo:

`JO`

Isolated form:

`jo`

Bounded functional scope:

`standalone_refusal_or_explicit_rejection`

Plain standalone gloss:

`standalone refusal / explicit rejection`

Article head:

`JO part.`

DPEWA post ID:

`25210`

Stable locator:

`https://www.dpwa.gwi.uni-muenchen.de/dictionary/?lemmaid=25210`

Accepted source snapshot SHA-256:

`f482a54f8f5648803b1eb7c91bed1b2013becf894e4d32f80e06f8f134a66a9e`

Authors:

- Bardhyl Demiraj
- Olav Hackstein

First publication:

- `2024`

Reconstructed:

- false

User-decision posture:

- `user_decides`

## Stage 1 implementation owner

The only production implementation owner authorized by this review is:

`src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1.ts`

The implementation may add the accepted JO row to:

`reviewedExternalLexiconSourceRowCandidateRegistryV0_1`

Production code must own the final JO row directly.

Production code must not import:

`tests/fixtures/joSourceRowDesignPackage.v0_1.ts`

The accepted test fixture is a migration oracle only.

## Exact Stage 1 success state

After Stage 1 implementation JO must be:

- `CANDIDATE_REGISTERED`
- `NOT_ADMITTED`
- `NOT_AUTHORIZED`
- `NOT_PROJECTED`
- `NOT_PROFILED`
- `NOT_OPERATION_REGISTERED`
- `NOT_CARRIER_REGISTERED`
- `NOT_LIVE_SMOKE_REGISTERED`
- `NOT_CANON_LOCK_ADMITTED`

This separation is mandatory.

## Candidate-registry requirements

The Stage 1 implementation must prove:

1. JO candidate row appears exactly once;
2. exact source ID is unchanged;
3. exact candidate ID is unchanged;
4. exact DPEWA article head remains `JO part.`;
5. exact post ID remains `25210`;
6. exact stable locator is unchanged;
7. exact source SHA-256 is unchanged;
8. candidate-specific JO validator passes;
9. generic reviewed-external-lexicon evidence gate passes;
10. generic readiness passes;
11. generic promotion checklist passes;
12. row remains production-safe in shape;
13. JO remains excluded from production membership;
14. JO machine authorization remains false;
15. JO runtime projection remains null;
16. DA, DI and AT candidate rows remain unchanged;
17. DA, DI and AT production rows remain unchanged;
18. all claim flags remain false;
19. `user_decides` remains preserved.

## Proposed operation and carrier remain proposals only

The reviewed JO package proposes:

Operation:

- `exact`

Carrier:

- `jo`

These values are useful Stage 1 source metadata and future Stage 2 inputs.

This review does not authorize registration of either value in the shared
evidence-operation or carrier policy.

Stage 2 remains separate.

## Positive and negative controls remain future policy inputs

Accepted positive:

- `jo`

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

Stage 1 may lock these values as review/test expectations.

Stage 1 must not interpret them through a newly registered JO runtime policy.

## Explicitly unauthorized files

The Stage 1 implementation must not modify JO behavior in:

- `src/shared/reviewedExternalLexiconFunctionalRuntimeAuthorization.v0_1.ts`
- `src/shared/reviewedExternalLexiconEvidenceOperationPolicy.v0_1.ts`
- `src/shared/canonicalOperatorProfile.v0_1.ts`
- `src/shared/canonicalOperatorCanonLockAdmission.v0_1.ts`
- `src/shared/reviewedExternalLexiconRuntimeProjection.v0_1.ts`
- `src/shared/deepRoot.rootMap.builder.v1.ts`
- `scripts/open-instrument/canonical-operator-live-smoke-cases.v0.1.ts`
- `scripts/open-instrument/live-smoke.v0.1.ts`
- `app/api/analyze-v1`
- Open Instrument UI owners

A shared-contract test may inspect these owners, but Stage 1 must not wire JO
into them.

## Production-membership boundary

The existing production-membership set must not gain:

`reviewed.external.jo.refusal.candidate.v0_1`

during Stage 1.

Candidate registration is not production admission.

## Runtime boundary

Stage 1 must preserve:

- machine authorization false;
- generic runtime projection null;
- no RootMap JO reviewed projection;
- no JO profile-backed live-smoke case.

Candidate registration is not runtime authorization.

## Lifecycle boundary

Stage 1 must not introduce a JO canonical profile.

Stage 1 must not assign JO:

- `runtime_verified`
- `canon_locked`

No new lifecycle state is required in Stage 1 because no JO canonical profile
is authorized yet.

## Canon-lock boundary

Stage 1 must not add JO to:

`CANON_LOCK_ADMITTED_OPERATOR_IDS_V0_1`

Canon lock remains a much later dedicated reviewed transition after production,
authorization, generic runtime projection, RootMap proof, live smoke and a
separate `runtime_verified` lifecycle transition.

## Claim boundaries

Stage 1 does not establish:

- historical origin;
- historical transmission;
- borrowing direction;
- earliest absolute origin;
- linguistic ownership;
- winner status;
- language superiority;
- candidate truth;
- scientific proof;
- publication-grade Open Instrument proof;
- ownership of general grammatical negation;
- unrestricted negative polarity;
- conceptual ownership of a PO/JO opposition.

Historical source material remains contextual only.

User-decision posture remains:

- `user_decides`

## Rollback requirement

Stage 1 rollback is intentionally small:

1. remove only the JO candidate-registry row;
2. restore candidate-registry membership to its prior DA/DI/AT state;
3. verify JO remains absent from production membership;
4. verify JO remains unauthorized;
5. verify JO runtime projection remains null;
6. verify DA, DI and AT remain unchanged.

No later-stage rollback should be necessary because later stages are not
authorized by this review.

## Review decision

The accepted source package, exact source identity, candidate validator,
staged transition proposal and current shared registry architecture are
sufficient to authorize one narrow implementation lane:

- `JO_CANDIDATE_REGISTRY_TRANSITION_IMPLEMENTATION`

That implementation must add JO to the candidate registry only.

Still not authorized:

- `JO_OPERATION_OR_CARRIER_POLICY_IMPLEMENTATION`
- `JO_CANONICAL_PROFILE_IMPLEMENTATION`
- `JO_PRODUCTION_REGISTRY_OR_RUNTIME_IMPLEMENTATION`
- `JO_RUNTIME_VERIFIED_TRANSITION`
- `JO_CANON_LOCK_IMPLEMENTATION`

Final review marker:

- `JO_CANDIDATE_REGISTRY_TRANSITION_REVIEW_ACCEPTED`
