# DONE: Geometry Eval Battery v0.2 — mini-corpus + markdown report lock

Merged via: PR #490

## Shipped
- Expanded mini-corpus fixture (~25 rows):
  - `tests/geometry/__fixtures__/maskVsCarrierGeometryBattery.v0.2.json`
- Snapshot lock of computed rows:
  - `tests/geometry/maskVsCarrierGeometryBattery.v0.2.lock.spec.ts`
  - `tests/geometry/__snapshots__/maskVsCarrierGeometryBattery.v0.2.lock.spec.ts.snap`
- Human-readable deterministic markdown report (locked by test):
  - `docs/reports/geometry-eval-battery.v0.2.md`
  - `tests/geometry/geometryEvalBatteryReport.v0.2.lock.spec.ts`

## Update flow (explicit)
- To intentionally regenerate the report:
  - `WRITE_REPORT=1 npm test -- tests/geometry/geometryEvalBatteryReport.v0.2.lock.spec.ts`
- Then commit the updated `docs/reports/geometry-eval-battery.v0.2.md` + any snapshot changes.

## Gate
- `npm run gate:quick` (lint + all tests + integration + build)

## Notes
This milestone extends v0.1 into a reviewable “anti-self-deception” rail:
- larger fixture (less hand-picked bias)
- report file makes diffs readable in PR review
- test enforces the committed report is not drifting
