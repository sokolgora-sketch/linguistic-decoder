# analyze-v1 stable regression fingerprint harness implementation review v0.1

Date: 2026-06-26

Status: ANALYZE_V1_STABLE_REGRESSION_FINGERPRINT_HARNESS_REVIEWED_ACCEPTED_READY_FOR_FIXTURE_REGRESSION.

Reviewed implementation:

* Short SHA: e59614b8
* Full SHA: e59614b88927b21824a82dafa679e51b5c41434d
* Subject: test(open-instrument): implement analyze-v1 stable regression fingerprint harness v0.1

Reviewed files:

* scripts/openInstrumentAnalyzeV1StableRegressionFingerprint.v0.1.mjs
* tests/openInstrument.analyzeV1StableRegressionFingerprintHarness.v0.1.spec.ts

Reviewed policy dependencies:

* docs/open-instrument/analyze-v1-stable-regression-fingerprint-policy-after-post-ssot-word-regression-v0.1.md
* docs/open-instrument/reviews/analyze-v1-stable-regression-fingerprint-policy-review-v0.1.md

## Review verdict

The analyze-v1 stable regression fingerprint harness implementation is accepted.

## Accepted harness behavior

The harness implements a reusable stable fingerprint path for /api/analyze-v1 regression evidence.

Accepted behavior:

* removes known volatile timestamp fields recursively
* sorts object keys into stable order
* serializes normalized JSON deterministically
* computes SHA-256 over normalized JSON
* can write normalized JSON through --out
* returns schema version, input path, output path, SHA-256 hash, and removed volatile fields

## Accepted schema version

The accepted schema version is:

* open-instrument.analyze-v1-stable-regression-fingerprint.v0.1

## Accepted volatile fields

The accepted volatile timestamp fields are:

* created
* generatedAt
* createdAt
* updatedAt
* timestamp
* time

These fields are removed recursively at any object depth.

## Accepted test coverage

The harness test is accepted.

It proves:

* the reviewed policy cleared the harness implementation lane
* timestamp-only differences normalize to the same stable hash
* non-volatile content changes produce a different stable hash
* normalized output preserves non-volatile fields such as engineVersion and basis
* normalized output removes timestamp fields
* CLI help prints usage and volatile fields

## Accepted boundaries

This implementation does not change /api/analyze-v1 behavior.

This implementation does not change engine output.

This implementation does not run provider/model replay.

This implementation does not mutate artifacts.

This implementation does not mutate fixture JSON.

This implementation does not promote etymology claims.

This implementation does not prove origin truth.

This implementation does not prove candidate correctness beyond existing engine output.

For damage, this implementation does not prove da, dëm, ndarje, or mythic-register decomposition.

## Accepted next use

The harness is now ready to be used by a fixture regression lane.

The next lane may create a reviewed post-SSOT fixture regression that uses this harness to verify stable fingerprints for the accepted word pack.

## Validation

The review reran:

* node --check harness
* analyze-v1 stable regression fingerprint harness focused test
* post-SSOT word regression evidence focused test
* npm run gate:quick

All passed.

## Next accepted task

test(open-instrument): add analyze-v1 stable fingerprint fixture regression for reviewed post-SSOT pack v0.1
