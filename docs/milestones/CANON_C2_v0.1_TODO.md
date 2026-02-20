# Canon C2 v0.1 — Train/Holdout + Baseline + Diff Report

Goal: Anti-regression dashboard for ZË-RO engine outputs.

## Inputs
- `tests/validation/datasets/canonC2.train.v0.1.json`
- `tests/validation/datasets/canonC2.holdout.v0.1.json`

## Frozen Truth
- `tests/validation/baselines/canonC2.baseline.v0.1.json` (committed)

## Runner behavior
- Command: `npm run canon:c2`
- Update baseline: `npm run canon:c2:update`
- Generates (gitignored):
  - `tests/validation/out/canonC2.current.v0.1.json`
  - `tests/validation/out/canonC2.diff.v0.1.md`

## DONE criteria
- Runner fails on drift (non-zero exit) and prints summary.
- Runner writes readable Markdown diff report.
- Update mode overwrites baseline intentionally.
- Deterministic: stable projection + stable ordering; no timestamps in baseline.
