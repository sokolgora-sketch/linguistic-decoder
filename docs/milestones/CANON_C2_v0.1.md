# CANON C2 v0.1 — Baseline + Diff (Validation Dataset v0.2)

Canon C2 is the "truth dashboard" for validation metrics: one committed baseline JSON + a deterministic markdown diff report.

## Inputs
- Dataset: `tests/validation/datasets/validation.dataset.v0.2.json`
- Splits:
  - `tests/validation/datasets/validation.train.v0.2.json`
  - `tests/validation/datasets/validation.holdout.v0.2.json`

## Canonical baseline (committed)
- `tests/validation/baselines/canonC2.baseline.v0.1.v0.2.json`

## Test
- `tests/validation/canonC2.baselineAndDiff.v0.1.spec.ts`

### Normal mode (CI)
- Computes current results and asserts equality with the committed baseline.

### Generate docs artifacts (optional)
Writes:
- `docs/validation/canonC2.current.v0.2.json`
- `docs/validation/CANON_C2_DIFF_LATEST_v0.2.md`

Command:
- `npm run canon:c2`

### Update baseline (explicit)
Updates baseline JSON + markdown snapshot:
- `npm run canon:c2:update`

> Baseline updates must be intentional. Never update baseline as part of unrelated PRs.
