# DONE: Geometry Eval Battery v0.1

Merged via: PR #488

## Shipped
- IPA format invariance tests:
  - `tests/geometry/ipaFormatInvariance.v0.1.spec.ts`
- IPA noise rejection battery:
  - `tests/geometry/ipaNoiseRejection.v0.1.spec.ts`
- Mask vs Carrier geometry snapshot battery:
  - `tests/geometry/__fixtures__/maskVsCarrierGeometryBattery.v0.1.json`
  - `tests/geometry/maskVsCarrierGeometryBattery.v0.1.lock.spec.ts`

## Locked by snapshots
- `tests/geometry/__snapshots__/ipaFormatInvariance.v0.1.spec.ts.snap`
- `tests/geometry/__snapshots__/maskVsCarrierGeometryBattery.v0.1.lock.spec.ts.snap`

## Gate
- `npm run gate:quick` green
