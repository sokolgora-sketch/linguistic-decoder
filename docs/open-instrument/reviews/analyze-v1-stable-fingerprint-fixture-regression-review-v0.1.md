# analyze-v1 stable fingerprint fixture regression review v0.1

Date: 2026-06-26

Status: ANALYZE_V1_STABLE_FINGERPRINT_FIXTURE_REGRESSION_REVIEWED_ACCEPTED_READY_FOR_PACK_COMMAND.

Reviewed implementation:

* Short SHA: e25a0e44
* Full SHA: e25a0e4498f849daf0f241cb2877b2cf538b4763
* Subject: test(open-instrument): add analyze-v1 stable fingerprint fixture regression for reviewed post-SSOT pack v0.1

Reviewed files:

* tests/fixtures/openInstrument/analyze-v1/post-ssot-word-regression-v0.1/study.run1.raw.json
* tests/fixtures/openInstrument/analyze-v1/post-ssot-word-regression-v0.1/damage.run1.raw.json
* tests/fixtures/openInstrument/analyze-v1/post-ssot-word-regression-v0.1/mystery.run1.raw.json
* tests/fixtures/openInstrument/analyze-v1/post-ssot-word-regression-v0.1/water.run1.raw.json
* tests/openInstrument.analyzeV1StableFingerprintFixtureRegression.v0.1.spec.ts

Reviewed dependencies:

* scripts/openInstrumentAnalyzeV1StableRegressionFingerprint.v0.1.mjs
* docs/open-instrument/reviews/analyze-v1-stable-regression-fingerprint-harness-implementation-review-v0.1.md
* docs/open-instrument/reviews/post-ssot-word-regression-pack-review-v0.1.md

## Review verdict

The analyze-v1 stable fingerprint fixture regression is accepted.

## Accepted fixture pack

The fixture regression locks the reviewed post-SSOT pack:

* study
* damage
* mystery
* water

The fixtures are raw /api/analyze-v1 JSON outputs from the accepted post-SSOT regression run.

## Accepted stable fingerprints

The fixture regression verifies these accepted normalized hashes through the reusable harness:

* study: 2f1d1436923f0992cecaa3c94b9b06e899e167a0ef2fd7be2b7a94c8bd3893ec
* damage: 184eb8df2b5ebeae007ecafece6fc1a71d7b24eef9c2e4a5253ee238d12687cb
* mystery: 2092a448486243b7d84843a6b8a83ccd91f33580692a0cfa42de86698f07ecd1
* water: 364d3d6ee689dff3a88cf9168939902c5dd6fe4252ddfab08c2dc2a63f46756d

## Accepted harness use

The fixture regression uses the reviewed stable fingerprint harness.

The harness removes known volatile timestamp fields recursively, sorts object keys, and computes SHA-256 over normalized JSON.

This confirms the fixture pack can be reused as a deterministic regression guard without relying on raw timestamp-bearing response equality.

## Accepted test coverage

The fixture regression test is accepted.

It proves:

* the lane was cleared by the reviewed harness and reviewed post-SSOT pack
* all four raw fixtures produce the accepted normalized hashes
* normalized output preserves non-volatile fields such as engineVersion, basis, and principles path
* normalized output removes volatile timestamp fields
* damage remains locked as regression evidence, not etymology proof

## Accepted boundaries

This implementation does not change /api/analyze-v1 behavior.

This implementation does not change engine output.

This implementation does not run provider/model replay.

This implementation does not mutate artifacts.

This implementation does not mutate existing fixture JSON.

This implementation does not promote etymology claims.

This implementation does not prove origin truth.

This implementation does not prove candidate correctness beyond existing engine output.

For damage, this implementation does not prove da, dëm, ndarje, or mythic-register decomposition.

## What this milestone gives us

This milestone turns the live post-SSOT word regression into a durable repository regression.

Future behavior-affecting changes can now be checked against the accepted stable fingerprint fixture pack.

## Validation

The review reran:

* fixture hash proof through the harness
* analyze-v1 stable fingerprint fixture regression focused test
* analyze-v1 stable regression fingerprint harness focused test
* post-SSOT word regression evidence focused test
* npm run gate:quick

All passed.

## Next accepted task

test(open-instrument): add analyze-v1 stable fingerprint fixture pack command v0.1
