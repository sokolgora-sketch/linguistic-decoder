# analyze-v1 stable regression fingerprint policy after post-SSOT word regression v0.1

Date: 2026-06-25

Status: ANALYZE_V1_STABLE_REGRESSION_FINGERPRINT_POLICY_DEFINED_PENDING_REVIEW.

Base reviewed state:

* Short SHA: cb3a9f93
* Full SHA: cb3a9f935498594d11fc27f775b3ea67a23c8bb2
* Subject: docs(open-instrument): review post-SSOT word regression pack for study damage mystery and water v0.1

Depends on reviewed evidence:

* docs/open-instrument/post-ssot-word-regression-pack-v0.1.md
* docs/open-instrument/reviews/post-ssot-word-regression-pack-review-v0.1.md
* tests/openInstrument.postSsotWordRegressionPack.v0.1.spec.ts

## Purpose

This policy defines how future /api/analyze-v1 regression packs must compare deterministic output.

The post-SSOT word regression pack showed that raw /api/analyze-v1 JSON can differ across repeated calls because timestamp fields are regenerated.

Therefore, future regression proof must use a stable normalized fingerprint, not a raw JSON hash.

## Policy

/api/analyze-v1 regression comparisons must use normalized JSON.

The normalized JSON must remove known volatile timestamp fields before hashing.

Raw hashes may be recorded, but raw hash equality is not required when the only observed differences are known volatile timestamp fields.

Normalized hash equality is required.

## Known volatile fields

The following fields are accepted as volatile timestamp fields:

* created
* generatedAt
* createdAt
* updatedAt
* timestamp
* time

These fields may appear at any object depth.

They must be removed recursively before computing a stable regression fingerprint.

## Stable fingerprint definition

A stable /api/analyze-v1 regression fingerprint is:

1. the JSON response
2. with known volatile timestamp fields removed recursively
3. sorted with stable object-key ordering
4. hashed with SHA-256

The canonical command pattern is:

```bash
jq -S 'walk(if type == "object" then del(.created, .generatedAt, .createdAt, .updatedAt, .timestamp, .time) else . end)' input.raw.json > input.normalized.json
shasum -a 256 input.normalized.json
```

## Required regression record

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
* normalized match YES/NO
* engineVersion
* primary basis
* principles path
* candidate count
* boundary statement

## Required boundary statement

Every /api/analyze-v1 word regression record must include:

* REGRESSION_SCOPE_ONLY=YES
* RAW_HASH_CAN_DIFFER_DUE_TO_TIMESTAMP_FIELDS=YES
* NORMALIZED_HASH_MATCH_REQUIRED=YES

It must also state:

* regression proof does not prove unresolved etymology claims
* damage regression does not prove da, dëm, ndarje, or mythic-register decomposition

## What this policy proves

A passing stable fingerprint regression proves:

* the deterministic API/Math7/Heart payload is stable after volatile timestamp normalization
* the same input word produces the same normalized output under the reviewed engine state
* refactors did not change the normalized response for the recorded pack

## What this policy does not prove

A passing stable fingerprint regression does not prove:

* origin truth
* etymology truth
* candidate correctness beyond existing engine output
* unresolved decomposition claims
* acoustic measurement truth
* publication claims

## Current accepted post-SSOT pack

The currently reviewed post-SSOT pack is:

* study
* damage
* mystery
* water

Accepted normalized hashes:

* study: 2f1d1436923f0992cecaa3c94b9b06e899e167a0ef2fd7be2b7a94c8bd3893ec
* damage: 184eb8df2b5ebeae007ecafece6fc1a71d7b24eef9c2e4a5253ee238d12687cb
* mystery: 2092a448486243b7d84843a6b8a83ccd91f33580692a0cfa42de86698f07ecd1
* water: 364d3d6ee689dff3a88cf9168939902c5dd6fe4252ddfab08c2dc2a63f46756d

## Implementation posture

This policy is docs-only.

It does not change /api/analyze-v1 behavior.

It does not change current tests.

It does not create a new runtime comparator.

A future implementation lane may turn this policy into reusable tooling or a first-class regression harness.

## Next accepted task

docs(open-instrument): review analyze-v1 stable regression fingerprint policy after post-SSOT word regression v0.1
