# Milestone: Geometry Eval Battery v0.2 — mini-corpus + markdown report lock

## Goal
Expand the evaluation corpus beyond the minimal v0.1 set, and add a deterministic markdown report that makes review + diffs human-readable.

## Deliverables

### 1) Expanded mask vs carrier fixture (mini-corpus)
File:
- `tests/geometry/__fixtures__/maskVsCarrierGeometryBattery.v0.2.json`

DONE when:
- contains ~25–40 rows (mixed: English + Albanian + a few “principle words”)
- uses stable IPA strings (no external lookup; fixture is the source)

### 2) Snapshot lock of computed rows (v0.2)
File:
- `tests/geometry/maskVsCarrierGeometryBattery.v0.2.lock.spec.ts`

DONE when:
- snapshot locks the row-by-row computed view (mask voices, carrier voices, VectorDelta totals/signatures)

### 3) Markdown report lock (review artifact)
Files:
- `docs/reports/geometry-eval-battery.v0.2.md`
- `tests/geometry/geometryEvalBatteryReport.v0.2.lock.spec.ts`

DONE when:
- test deterministically regenerates the markdown string and asserts it matches the committed report file
- update flow is explicit via `WRITE_REPORT=1`

## DONE criteria (non-negotiable)
- deterministic outputs only (no timestamps in report)
- snapshots stable
- `npm run gate:quick` green
- PR merged
