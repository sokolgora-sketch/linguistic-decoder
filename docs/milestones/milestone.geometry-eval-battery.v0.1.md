# Milestone: Geometry Eval Battery v0.1 — deception rails (mask + carrier + VectorDelta)

## Goal
Lock a defendable, deterministic evaluation battery that prevents ZË-RO from becoming a meaning-hallucination machine.

This milestone tests:
1) IPA format invariance (wrappers/diacritics do not change carriers)
2) Noise rejection (no vowels => no carriers => geometry ∅)
3) Mask vs Carrier comparability (both produce VectorDelta summaries side-by-side)

## Deliverables

### 1) IPA format invariance tests
File:
- `tests/geometry/ipaFormatInvariance.v0.1.spec.ts`

DONE when:
- multiple representations of the same IPA return identical carrier extraction output (strict raw input rules apply).

### 2) IPA noise rejection battery
File:
- `tests/geometry/ipaNoiseRejection.v0.1.spec.ts`

DONE when:
- consonant-only strings never invent carrier voices (`voices=[]`)
- resulting VectorDelta signature is `∅`

### 3) Mask vs Carrier geometry battery (snapshot lock)
Files:
- `tests/geometry/__fixtures__/maskVsCarrierGeometryBattery.v0.1.json`
- `tests/geometry/maskVsCarrierGeometryBattery.v0.1.lock.spec.ts`

DONE when:
- snapshots lock the full side-by-side view:
  - mask voices (orthography)
  - carrier voices (IPA)
  - VectorDelta summaries for both

## DONE criteria (non-negotiable)
- All tests exist and are deterministic
- Snapshot locks exist and are stable
- `npm run gate:quick` is green
- PR merged
