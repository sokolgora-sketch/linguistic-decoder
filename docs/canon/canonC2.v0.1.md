# Canon C2 v0.1 — Train/Holdout + Diff Report (Deterministic)

Purpose: lock a small canon battery (train + holdout) and produce a stable diff report so prompt/rule changes are measurable.

## What counts as DONE

### 1) Train set is deterministic + snapshot locked
- Source: `tests/canon/proposerCanon.train.v0.1.ts`
- Test: `tests/canon/proposerCanon.train.v0.1.spec.ts`

### 2) Holdout set is deterministic + snapshot locked
- Source: `tests/canon/proposerCanon.holdout.v0.1.ts`
- Test: `tests/canon/proposerCanon.holdout.v0.1.spec.ts`

### 3) Diff report exists and is snapshot locked
- Test: `tests/canon/proposerCanon.diffReport.v0.1.spec.ts`
- Snapshot: `tests/canon/__snapshots__/proposerCanon.diffReport.v0.1.spec.ts.snap`

### 4) Baseline JSON + diff gate exists (regression tripwire)
- Test: `tests/validation/canonC2.baselineAndDiff.v0.1.spec.ts`
- Baseline location: `tests/validation/baselines/` (see spec for exact filenames)

## How to run

```bash
npm test -- tests/canon/proposerCanon.train.v0.1.spec.ts
npm test -- tests/canon/proposerCanon.holdout.v0.1.spec.ts
npm test -- tests/canon/proposerCanon.diffReport.v0.1.spec.ts
npm test -- tests/validation/canonC2.baselineAndDiff.v0.1.spec.ts

```
