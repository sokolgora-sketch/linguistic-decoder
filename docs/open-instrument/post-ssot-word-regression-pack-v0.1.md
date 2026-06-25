# Post-SSOT word regression pack v0.1

Date: 2026-06-25

Status: POST_SSOT_WORD_REGRESSION_PACK_RECORDED_PENDING_REVIEW.

Base reviewed state:

* Short SHA: 4ccb9901
* Full SHA: 4ccb99019353ce8cc607ce3d728318cd8136079a
* Subject: docs(open-instrument): review seven-voice ordered views symbolic core consumer wiring implementation v0.1

Local run output:

* Output dir: /tmp/zero-post-ssot-word-regression-normalized-v0-1
* Summary: /tmp/zero-post-ssot-word-regression-normalized-v0-1/summary.tsv
* Fresh word: water

## Purpose

This record captures the first post-SSOT word regression pack after symbolic core consumers were wired to symbolicMathOrder and reviewed.

This is regression evidence only.

It proves the post-SSOT API, Math7, and Heart output is deterministic after known volatile timestamp fields are removed.

It does not prove unresolved etymology claims.

For damage, this does not prove da, dëm, ndarje, or mythic-register decomposition.

## Normalization rule

Raw API JSON includes volatile timestamp fields.

Known volatile fields removed before hashing:

* created
* generatedAt
* createdAt
* updatedAt
* timestamp
* time

Raw hashes are allowed to differ because timestamp fields can differ between repeated calls.

Normalized hashes must match.

## Regression pack

| Word | Raw SHA run 1 | Raw SHA run 2 | Normalized SHA run 1 | Normalized SHA run 2 | Normalized match | Engine version | Primary basis | Principles path | Candidate count |
|---|---|---|---|---|---|---|---|---|---|
| study | 1dfc39a9ddaaa122948bbadd18f6ab99e7d8f8a96ad8eb5e90a0d389f1d10203 | 0f7ec3e8645afe006fa04e42c813fcf6a79f704cfd1ad90d57fd7cd729bd8c72 | 2f1d1436923f0992cecaa3c94b9b06e899e167a0ef2fd7be2b7a94c8bd3893ec | 2f1d1436923f0992cecaa3c94b9b06e899e167a0ef2fd7be2b7a94c8bd3893ec | YES | 0.2.0-symbolic | UI | UNITY>INSIGHT | 2 |
| damage | 5b0a110925ac817b8eaf017bc510736bdb1bb7ab5b74f811b60a4049595f6c07 | 2b6d6b2a0bd88ffb5dee49ab7ba60335910dcda0be6ff2c7567c9d064080b9d8 | 184eb8df2b5ebeae007ecafece6fc1a71d7b24eef9c2e4a5253ee238d12687cb | 184eb8df2b5ebeae007ecafece6fc1a71d7b24eef9c2e4a5253ee238d12687cb | YES | 0.2.0-symbolic | AE | TRUTH>EXPANSION | 2 |
| mystery | 933190de8772935d1bc71416bfa747815ee05b9bd13e72b09e3f368b0e68420a | 536369c10b74d2739c15afc8f8f2b69cca8de37b7a0c80c20b369913cbb7d8ef | 2092a448486243b7d84843a6b8a83ccd91f33580692a0cfa42de86698f07ecd1 | 2092a448486243b7d84843a6b8a83ccd91f33580692a0cfa42de86698f07ecd1 | YES | 0.2.0-symbolic | YEI | REFLECTION>EXPANSION>INSIGHT | 0 |
| water | 33cb24f205236a032bcb8d16ae061f856a95c0e647ee8ce3000379926a462505 | 72e18a842b4e88f1a4781b51340c0133d0f6f528348539513dd0b41c2867ae56 | 364d3d6ee689dff3a88cf9168939902c5dd6fe4252ddfab08c2dc2a63f46756d | 364d3d6ee689dff3a88cf9168939902c5dd6fe4252ddfab08c2dc2a63f46756d | YES | 0.2.0-symbolic | AE | TRUTH>EXPANSION | 0 |

## Result

All four normalized repeated responses matched.

The raw hashes differed because known volatile timestamp fields differed.

## Boundary statement

REGRESSION_SCOPE_ONLY=YES

RAW_HASH_CAN_DIFFER_DUE_TO_TIMESTAMP_FIELDS=YES

NORMALIZED_HASH_MATCH_REQUIRED=YES

This proves post-SSOT API/Math7/Heart output is deterministic after removing known volatile timestamps.

This does not prove unresolved etymology claims.

For damage, this does not prove da, dëm, ndarje, or mythic-register decomposition.

## Validation

The run completed with:

* local Next server ready
* normalized match YES for study
* normalized match YES for damage
* normalized match YES for mystery
* normalized match YES for water
* npm run gate:quick passed
* repo clean after run

## Next accepted task

docs(open-instrument): review post-SSOT word regression pack for study damage mystery and water v0.1
