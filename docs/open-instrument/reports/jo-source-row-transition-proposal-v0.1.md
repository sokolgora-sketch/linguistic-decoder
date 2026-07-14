# Dedicated JO source-row transition proposal v0.1

Status:

- `TRANSITION_PROPOSAL_DESIGN_ONLY`

Repository base:

- `a34e5d76475858674d03dc90f795eccf8fd10055`

Accepted prerequisite decision:

- `JO_SOURCE_ROW_DESIGN_PACKAGE_ACCEPTED_FOR_TRANSITION_PROPOSAL`

## Proposal result

Result:

- `DEDICATED_JO_SOURCE_ROW_TRANSITION_PROPOSAL_DESIGNED`

Recommended first transition:

- `JO_CANDIDATE_REGISTRY_TRANSITION_REVIEW`

Explicitly not authorized by this proposal:

- `JO_PRODUCTION_REGISTRY_OR_RUNTIME_IMPLEMENTATION`
- `JO_CANON_LOCK_IMPLEMENTATION`

This proposal describes a staged, fail-closed transition.

It performs no registry, production, runtime, profile, policy, live-smoke or
canon-lock mutation.

## Accepted JO package identity

Proposed source ID:

- `reviewed.external.jo.refusal.candidate.v0_1`

Candidate ID:

- `albanian-jo-standalone-refusal-functional`

Language:

- `sq`

Embryo:

- `JO`

Isolated form:

- `jo`

Bounded functional scope:

- `standalone_refusal_or_explicit_rejection`

Proposed operation:

- `exact`

Proposed carrier:

- `jo`

## Accepted source identity

Article:

- `JO part.`

DPEWA post ID:

- `25210`

Stable locator:

- `https://www.dpwa.gwi.uni-muenchen.de/dictionary/?lemmaid=25210`

Accepted article SHA-256:

- `f482a54f8f5648803b1eb7c91bed1b2013becf894e4d32f80e06f8f134a66a9e`

Authors:

- Bardhyl Demiraj
- Olav Hackstein

First publication:

- `2024`

Modern dictionary reference:

- `FGJSSH 745f.`

Source identity:

- `EXACT_ATTESTED_HEADWORD_ARTICLE`

Reconstructed:

- false

Historical evidence remains contextual only.

## Current machine state

| Boundary | Current JO state |
|---|---|
| design package | accepted |
| source-row candidate registry | `NOT_REGISTERED` |
| production membership | `NOT_ADMITTED` |
| machine authorization | `NOT_AUTHORIZED` |
| runtime projection | `NOT_PROJECTED` |
| canonical profile | `NOT_PROFILED` |
| operation policy | `NOT_OPERATION_REGISTERED` |
| carrier policy | `NOT_CARRIER_REGISTERED` |
| profile-backed live smoke | `NOT_LIVE_SMOKE_REGISTERED` |
| canon-lock admission | `NOT_CANON_LOCK_ADMITTED` |

DA and DI remain the only current production and canon-locked operators.

## Architecture findings

The transition must use the existing shared architecture.

Exact current owners:

1. source-row candidate registry and production membership:
   `src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1.ts`
2. generic lexical readiness:
   `src/shared/reviewedExternalLexiconFunctionalReadiness.v0_1.ts`
3. generic citation and promotion checklist:
   `src/shared/reviewedExternalLexiconSourceRowPromotionChecklist.v0_1.ts`
4. functional machine authorization:
   `src/shared/reviewedExternalLexiconFunctionalRuntimeAuthorization.v0_1.ts`
5. generic runtime projection:
   `src/shared/reviewedExternalLexiconRuntimeProjection.v0_1.ts`
6. evidence-operation and carrier policy:
   `src/shared/reviewedExternalLexiconEvidenceOperationPolicy.v0_1.ts`
7. canonical operator profile:
   `src/shared/canonicalOperatorProfile.v0_1.ts`
8. canon-lock admission:
   `src/shared/canonicalOperatorCanonLockAdmission.v0_1.ts`
9. shared RootMap consumer:
   `src/shared/deepRoot.rootMap.builder.v1.ts`
10. profile-derived live-smoke cases:
    `scripts/open-instrument/canonical-operator-live-smoke-cases.v0.1.ts`
11. shared live-smoke runner:
    `scripts/open-instrument/live-smoke.v0.1.ts`
12. profile-driven smoke contract:
    `tests/openInstrument.canonicalOperatorLiveSmoke.profileDriven.v0_1.spec.ts`

Carrier policy is currently co-owned by the shared evidence-operation policy
owner. No separate bespoke JO carrier module is proposed.

The runtime projector, RootMap consumer and live-smoke case builder are generic.
They should consume JO only after the required shared registries and policies
admit JO.

No bespoke JO route, RootMap, analyze-v1 or UI branch is proposed.

## Staged transition plan

The transition must not be executed as one indivisible promotion.

Each stage requires its own focused proof and an explicit review decision.

### Stage 1 — candidate-registry placement

Purpose:

- make the accepted JO row available in the reviewed candidate registry;
- keep JO outside production membership;
- keep machine authorization false;
- keep runtime projection null.

Proposed implementation owner:

- `src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1.ts`

Proposed source input:

- the exact accepted typed JO package currently located at
  `tests/fixtures/joSourceRowDesignPackage.v0_1.ts`.

Implementation requirement:

- production code must own its final source row;
- production code must not import a test fixture;
- the accepted fixture may be used only as a migration reference and test
  oracle.

Required Stage 1 tests:

- exact JO candidate row identity;
- exact DPEWA post ID and article head;
- exact source snapshot hash;
- candidate-specific validator pass;
- generic readiness pass;
- generic checklist pass;
- candidate registry contains JO exactly once;
- production membership excludes JO;
- machine authorization remains false;
- runtime projector remains null;
- DA and DI registries remain unchanged;
- all claim boundaries remain false;
- `user_decides` remains preserved.

Stage 1 rollback:

- remove only the JO candidate-registry row;
- restore the candidate registry to DA and DI only;
- confirm JO authorization and runtime projection remain absent.

Stage 1 success state:

- `CANDIDATE_REGISTERED`
- `NOT_ADMITTED`
- `NOT_AUTHORIZED`
- `NOT_PROJECTED`

### Stage 2 — operation and carrier policy registration

Purpose:

- define JO's bounded evidence behavior before runtime authorization.

Proposed implementation owner:

- `src/shared/reviewedExternalLexiconEvidenceOperationPolicy.v0_1.ts`

Required policy:

- operator:
  `JO`
- embryo:
  `JO`
- allowed operation:
  `exact`
- allowed carrier:
  `jo`

Required positive:

- `jo`

Required cross-operator negatives:

- `po`
- `da`
- `di`

Required lexical collision negatives:

- `major`
- `enjoy`
- `joke`
- `joint`
- `banjo`
- `judo`

Required policy rejections:

- prefix;
- suffix;
- substring;
- transformed carrier;
- reconstructed carrier;
- missing carrier;
- unsupported operation;
- embryo mismatch;
- missing policy.

Stage 2 must not grant:

- production membership;
- machine authorization;
- runtime projection;
- canonical profile status;
- live-smoke status;
- canon-lock status.

Stage 2 success state:

- `CANDIDATE_REGISTERED`
- `OPERATION_REGISTERED`
- `CARRIER_REGISTERED`
- `NOT_ADMITTED`
- `NOT_AUTHORIZED`
- `NOT_PROJECTED`

### Stage 3 — canonical profile pre-runtime registration

Purpose:

- register the exact JO profile metadata required by shared profile-driven
  contracts;
- keep the lifecycle below runtime-mature status until production and runtime
  proof passes.

Proposed implementation owner:

- `src/shared/canonicalOperatorProfile.v0_1.ts`

Required profile identity:

- operator ID:
  `JO`
- embryo:
  `JO`
- source ID:
  `reviewed.external.jo.refusal.candidate.v0_1`
- language:
  `sq`
- positive proof words:
  `["jo"]`
- negative control words:
  `["po", "da", "di", "major", "enjoy", "joke", "joint", "banjo", "judo"]`
- authorization scope:
  `bounded_functional_lexical_projection`

Pre-runtime lifecycle must not be:

- `runtime_verified`
- `canon_locked`

A pre-runtime lifecycle value must be selected only from an existing,
explicitly supported lifecycle state. No new lifecycle label may be invented
without a separate schema review.

Stage 3 must preserve:

- exact JO citation identity;
- exact-only operation;
- jo-only carrier;
- profile isolation from DA and DI;
- all claim boundaries;
- `user_decides`.

### Stage 4 — production membership

Purpose:

- explicitly admit the reviewed JO source row to production enumeration.

Proposed implementation owner:

- `src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1.ts`

Preconditions:

1. Stage 1 candidate row accepted;
2. Stage 2 operation and carrier policy accepted;
3. Stage 3 canonical profile metadata accepted;
4. generic readiness passes;
5. generic promotion checklist passes;
6. direct authoritative locator/archive requirement passes;
7. candidate-specific citation validation passes;
8. source hash remains unchanged;
9. all negative controls pass.

Stage 4 must be independently reversible.

Stage 4 alone must not be treated as sufficient runtime authorization.

### Stage 5 — functional machine authorization

Purpose:

- explicitly authorize the exact JO source ID for bounded functional lexical
  projection.

Proposed implementation owner:

- `src/shared/reviewedExternalLexiconFunctionalRuntimeAuthorization.v0_1.ts`

Required authorization scope:

- `bounded_functional_lexical_projection`

Authorization must fail closed when:

- source ID differs;
- production membership is absent;
- readiness fails;
- candidate truth is enabled;
- historical-origin claims are enabled;
- user-decision posture differs;
- source identity or hash differs;
- required policy is absent.

Stage 5 success requires:

- candidate registry membership;
- production membership;
- policy registration;
- profile registration;
- readiness;
- citation-package readiness;
- claim-boundary safety.

### Stage 6 — generic runtime projection eligibility

Expected implementation owner:

- no JO-specific branch should be required in
  `src/shared/reviewedExternalLexiconRuntimeProjection.v0_1.ts`.

Expected behavior:

- before Stages 4 and 5:
  projection is `null`;
- after production membership and machine authorization:
  the generic projector emits a bounded JO projection;
- the projection contains only JO citation identity;
- no DA, DI or PO citation identity leaks into JO;
- no historical-origin or candidate-truth claim appears.

A change to the generic projector is allowed only when a failing shared
contract proves that the current reusable seam cannot represent JO safely.

A bespoke JO projector branch is prohibited.

### Stage 7 — shared RootMap consumption

Expected implementation owner:

- no bespoke JO branch should be required in
  `src/shared/deepRoot.rootMap.builder.v1.ts`.

RootMap may consume JO only through the existing generic reviewed runtime
projection seam.

Required controls:

- exact standalone `jo` can carry reviewed JO evidence;
- `po`, `da`, and `di` cannot carry JO evidence;
- `major`, `enjoy`, `joke`, `joint`, `banjo`, and `judo` cannot carry JO
  evidence;
- no arbitrary prefix, suffix or substring behavior;
- no route or UI-specific JO inference.

### Stage 8 — profile-backed live-smoke verification

Existing generic owners:

- `scripts/open-instrument/canonical-operator-live-smoke-cases.v0.1.ts`
- `scripts/open-instrument/live-smoke.v0.1.ts`
- `tests/openInstrument.canonicalOperatorLiveSmoke.profileDriven.v0_1.spec.ts`

Expected implementation posture:

- no bespoke JO smoke runner;
- cases derive from the accepted canonical profile;
- one positive case:
  `jo`;
- all accepted negative cases remain negative;
- DA and DI cases remain unchanged.

Required command:

- `npm run open-instrument:live-smoke -- --skip-focused-tests`

Live-smoke success does not itself grant canon-lock admission.

### Stage 9 — runtime-verified lifecycle transition

After production membership, machine authorization, generic projection,
RootMap consumption and live smoke all pass, JO may be reviewed for:

- `runtime_verified`

This transition belongs in a separate lifecycle review.

It must not occur in the candidate-registration lane.

### Stage 10 — canon-lock admission

Proposed implementation owner:

- `src/shared/canonicalOperatorCanonLockAdmission.v0_1.ts`

Canon-lock preconditions:

1. JO lifecycle is already `runtime_verified`;
2. exact candidate source row is production-live;
3. machine authorization passes;
4. production membership passes;
5. runtime projection passes;
6. operation and carrier policy pass;
7. canonical profile contract passes;
8. profile-backed live smoke passes;
9. all positive and negative controls pass;
10. source identity and hash are unchanged;
11. all claim boundaries remain disabled;
12. `user_decides` remains preserved.

Canon-lock must be a separate dedicated transition.

The first JO implementation PR must not canon-lock JO.

## Dependency order

Required order:

1. accepted source package;
2. candidate-registry placement;
3. operation and carrier policy;
4. pre-runtime canonical profile metadata;
5. production-membership review;
6. functional machine authorization;
7. generic runtime projection proof;
8. shared RootMap proof;
9. profile-backed live smoke;
10. runtime-verified lifecycle review;
11. canon-lock admission review.

No later stage may be used to bypass a missing earlier stage.

## Exact proposed implementation files

Files expected to change during staged implementation:

- `src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1.ts`
- `src/shared/reviewedExternalLexiconFunctionalRuntimeAuthorization.v0_1.ts`
- `src/shared/reviewedExternalLexiconEvidenceOperationPolicy.v0_1.ts`
- `src/shared/canonicalOperatorProfile.v0_1.ts`
- `src/shared/canonicalOperatorCanonLockAdmission.v0_1.ts`

Generic owners expected to remain unchanged unless shared-contract proof
requires otherwise:

- `src/shared/reviewedExternalLexiconFunctionalReadiness.v0_1.ts`
- `src/shared/reviewedExternalLexiconSourceRowPromotionChecklist.v0_1.ts`
- `src/shared/reviewedExternalLexiconRuntimeProjection.v0_1.ts`
- `src/shared/deepRoot.rootMap.builder.v1.ts`
- `scripts/open-instrument/canonical-operator-live-smoke-cases.v0.1.ts`
- `scripts/open-instrument/live-smoke.v0.1.ts`
- `app/api/analyze-v1`
- UI owners

The actual files in any implementation PR must be re-inspected immediately
before patching.

## Required new contracts

Candidate-registry stage:

- JO candidate registry identity;
- JO candidate registry boundary;
- JO candidate citation isolation;
- JO candidate production exclusion;
- JO candidate runtime-authorization exclusion;
- JO candidate runtime-projection exclusion.

Policy stage:

- JO exact-operation policy;
- JO jo-only carrier policy;
- JO cross-operator isolation;
- JO collision isolation;
- unsupported operation and carrier failure.

Profile stage:

- JO profile identity;
- JO positive and negative metadata;
- JO pre-runtime lifecycle boundary;
- DA/DI/JO profile isolation.

Production and authorization stage:

- JO production membership;
- JO authorization success;
- JO authorization failure matrix;
- JO generic runtime projection;
- JO projection citation isolation;
- production-row enumeration count and identity.

RootMap stage:

- JO generic RootMap consumption;
- no bespoke route or UI wiring;
- exact positive and all negatives.

Live-smoke stage:

- JO profile-derived cases;
- one positive and all negatives;
- full Open Instrument live-smoke command.

Lifecycle stage:

- JO runtime-verified transition;
- JO canon-lock readiness;
- JO canon-lock admission;
- DA and DI lifecycle regression.

## Fail-closed rules

At every stage, JO must remain unavailable when any required condition is
missing.

Required failures include:

- unknown source ID;
- absent candidate row;
- absent production membership;
- absent machine authorization;
- failed readiness;
- failed citation checklist;
- changed source hash;
- incorrect article head;
- incorrect post ID;
- generic portal-only evidence;
- reconstructed substitution;
- PO, DA, or DI citation leakage;
- unsupported operation;
- unsupported carrier;
- missing carrier;
- embryo mismatch;
- prefix, suffix, or substring use;
- broader sentence-level-negation scope;
- historical-origin claim;
- historical-transmission claim;
- borrowing-direction claim;
- ownership claim;
- winner claim;
- language-superiority claim;
- candidate-truth claim;
- scientific-proof claim;
- publication-grade Open Instrument proof claim;
- non-user-decidable posture.

## Rollback model

Rollback must proceed in reverse dependency order:

1. remove canon-lock admission;
2. revert runtime-verified lifecycle;
3. remove JO live-smoke eligibility;
4. remove canonical profile;
5. remove machine authorization;
6. remove production membership;
7. remove JO operation and carrier policy;
8. remove candidate-registry row.

After rollback:

- generic JO runtime projection must be null;
- JO must be absent from production enumeration;
- DA and DI must remain unchanged;
- all JO-positive production evidence must disappear;
- all negative controls must remain negative.

## Prohibited implementation shortcuts

The staged implementation must not add:

- a bespoke JO RootMap branch;
- a bespoke JO analyze-v1 branch;
- a bespoke JO UI branch;
- a bespoke JO runtime projector;
- a bespoke JO live-smoke runner;
- unrestricted sentence-level negation;
- prefix behavior;
- suffix behavior;
- substring behavior;
- transformed or reconstructed carriers;
- PO/JO conceptual-polarity ownership;
- automatic canon lock in the first implementation lane.

## Claim boundaries

No stage may establish:

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
- ownership of general grammatical negation.

Historical source material remains contextual only.

User-decision posture remains:

- `user_decides`

## Current proposal decision

- `DEDICATED_JO_SOURCE_ROW_TRANSITION_PROPOSAL_DESIGNED`

Recommended next lane:

- `JO_CANDIDATE_REGISTRY_TRANSITION_REVIEW`

Still not authorized:

- `JO_PRODUCTION_REGISTRY_OR_RUNTIME_IMPLEMENTATION`
- `JO_CANON_LOCK_IMPLEMENTATION`
