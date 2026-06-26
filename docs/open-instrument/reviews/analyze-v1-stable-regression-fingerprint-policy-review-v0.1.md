# analyze-v1 stable regression fingerprint policy review v0.1

Date: 2026-06-26

Status: ANALYZE_V1_STABLE_REGRESSION_FINGERPRINT_POLICY_REVIEWED_ACCEPTED_READY_FOR_HARNESS.

Reviewed policy:

* Short SHA: 2c652a6d
* Full SHA: 2c652a6de45490dd0240a1fd7cc748e945a0709c
* Subject: docs(open-instrument): define analyze-v1 stable regression fingerprint policy after post-SSOT word regression v0.1
* Policy doc: docs/open-instrument/analyze-v1-stable-regression-fingerprint-policy-after-post-ssot-word-regression-v0.1.md

Reviewed dependencies:

* docs/open-instrument/post-ssot-word-regression-pack-v0.1.md
* docs/open-instrument/reviews/post-ssot-word-regression-pack-review-v0.1.md
* tests/openInstrument.postSsotWordRegressionPack.v0.1.spec.ts

## Review verdict

The analyze-v1 stable regression fingerprint policy is accepted.

## Accepted policy

Future /api/analyze-v1 regression comparisons must use normalized JSON.

Known volatile timestamp fields must be removed recursively before hashing.

Raw hashes may be recorded.

Raw hash equality is not required when the only observed differences are known volatile timestamp fields.

Normalized hash equality is required.

## Accepted volatile fields

The accepted volatile timestamp fields are:

* created
* generatedAt
* createdAt
* updatedAt
* timestamp
* time

These fields may appear at any object depth.

They must be removed recursively before computing the stable fingerprint.

## Accepted stable fingerprint definition

A stable /api/analyze-v1 regression fingerprint is:

1. the JSON response
2. with known volatile timestamp fields removed recursively
3. sorted with stable object-key ordering
4. hashed with SHA-256

## Accepted required regression record

Future word regression records must include:

* base main short SHA
* base main full SHA
* base main subject
* word list
* fresh word marker when applicable
* raw SHA run 1
* raw SHA run 2
* normalized SHA run 1
* normalized SHA run 2
* normalized match YES or NO
* engineVersion
* primary basis
* principles path
* candidate count
* boundary statement

## Accepted boundary statement

Every /api/analyze-v1 word regression record must include:

* REGRESSION_SCOPE_ONLY=YES
* RAW_HASH_CAN_DIFFER_DUE_TO_TIMESTAMP_FIELDS=YES
* NORMALIZED_HASH_MATCH_REQUIRED=YES

It must also state:

* regression proof does not prove unresolved etymology claims
* damage regression does not prove da, dëm, ndarje, or mythic-register decomposition

## Accepted current post-SSOT pack

The reviewed post-SSOT pack remains accepted:

* study: 2f1d1436923f0992cecaa3c94b9b06e899e167a0ef2fd7be2b7a94c8bd3893ec
* damage: 184eb8df2b5ebeae007ecafece6fc1a71d7b24eef9c2e4a5253ee238d12687cb
* mystery: 2092a448486243b7d84843a6b8a83ccd91f33580692a0cfa42de86698f07ecd1
* water: 364d3d6ee689dff3a88cf9168939902c5dd6fe4252ddfab08c2dc2a63f46756d

## Confirmed non-claims

This policy does not prove:

* origin truth
* etymology truth
* candidate correctness beyond existing engine output
* unresolved decomposition claims
* acoustic measurement truth
* publication claims

## Confirmed implementation posture

This review is docs-only.

It does not change /api/analyze-v1 behavior.

It does not change current runtime comparison behavior.

It does not execute replay.

It does not execute a provider or model.

It does not mutate artifacts or fixture JSON.

A future implementation lane may turn the policy into reusable tooling or a first-class regression harness.

## Validation

The review reran:

* post-SSOT word regression evidence focused test
* npm run gate:quick

All passed.

## Next accepted task

test(open-instrument): implement analyze-v1 stable regression fingerprint harness v0.1
