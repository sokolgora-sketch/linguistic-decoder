# Canon C2 v0.1 — DONE

## Goal
Add a pure Node/Jest anti-regression harness that detects drift across a small Train + Holdout corpus and produces a readable diff report for PR review.

## What shipped
- Datasets:
  - `tests/validation/datasets/canonC2.train.v0.1.json`
  - `tests/validation/datasets/canonC2.holdout.v0.1.json`
- Baseline (committed “frozen truth”):
  - `tests/validation/baselines/canonC2.baseline.v0.1.json`
- Projection (stable subset of engine output; avoids volatile fields):
  - `tests/validation/canonC2.projection.v0.1.ts`
- Diff reporter:
  - `tests/validation/canonC2.diffReport.v0.1.ts`
- Runner (Jest spec; no browser):
  - `tests/validation/canonC2.runner.v0.1.spec.ts`
- Output folder (ignored):
  - `/tests/validation/out/` (written by runner; never committed)

## Commands
- Detect drift (fails test on drift, writes diff output):
  - `npm run canon:c2`
- Intentionally refresh baseline (only when changes are expected):
  - `npm run canon:c2:update`

## Expected artifacts
Generated under `tests/validation/out/` (gitignored):
- `canonC2.current.v0.1.json`
- `canonC2.diff.v0.1.md`

## DONE criteria
- `npm run canon:c2:update` generates baseline cleanly.
- `npm run canon:c2` passes immediately after baseline generation.
- `npm run gate:quick` passes.
- Diff output is readable and stable (projection sorts candidates deterministically; no random keys).

## Notes / guardrails
- Projection must remain strict + stable: any refactor should keep projections deterministic.
- Expand corpus gradually (10–20 cases per bump) to keep diffs readable.

