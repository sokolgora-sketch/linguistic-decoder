# External Validation Dataset (v0.1)

This dataset is a **local fixture** used by the External Validation Harness.
No network calls are allowed in tests.

## Record schema (v0.1)
Each record is:
- id (string, stable)
- lang (string; e.g. en, sq, it, el, sa)
- word (string; lemma/spelling)
- ipa (optional string; if provided, enables phonetic rail)
- semanticTag (string; coarse label)
- knownEtymology (string; coarse provenance label)
- notes (optional string)

## Files
- validation.dataset.v0.1.json — full dataset records
- validation.train.v0.1.json — list of record ids (train)
- validation.holdout.v0.1.json — list of record ids (holdout)

## Rules
- Inputs are fixtures only (no external IO).
- IDs must remain stable once introduced.
- Splits are locked by explicit id lists (v0.1); later versions may move to hash-split.

---

## Canon C2 v0.3 — Corpus70 (DONE)

**Goal:** lock a larger, realistic corpus so any engine change produces measurable drift.

**Artifacts**
- Train dataset: `tests/validation/datasets/canonC2.train.v0.3.json` (35 cases)
- Holdout dataset: `tests/validation/datasets/canonC2.holdout.v0.3.json` (35 cases)
- Runner: `tests/validation/canonC2.runner.v0.3.spec.ts`
- Baseline: `tests/validation/baselines/canonC2.baseline.v0.3.json` (generated via update)

**Commands**
- `npm run canon:c2` — drift check vs baseline (fails on unexpected change)
- `npm run canon:c2:update` — regenerate baseline after intentional change

**DONE proof**
- `npm run canon:c2` passes on `main`
- `npm run gate:quick` passes on `main`

**Notes**
- `tests/validation/out/` is still gitignored (diff reports + current projections are not committed).

---

## Canon C2 v0.4 — Albanian200 Compound Stress (DONE)

**Goal:** extend Canon C2 with Albanian compound/stress-derived forms (IPA present) to stress-test phonetic rails + morphology sensitivity under deterministic locking.

**Source**
- `tests/research/albanian200.compoundStress.v0.2.txt`

**Artifacts**
- Train dataset: `tests/validation/datasets/canonC2.train.v0.4.json`
- Holdout dataset: `tests/validation/datasets/canonC2.holdout.v0.4.json`
- Runner: `tests/validation/canonC2.runner.v0.4.spec.ts`
- Baseline: `tests/validation/baselines/canonC2.baseline.v0.4.json` (generated via update)
- Dataset builder: `scripts/canonC2.buildCompoundStress.v0.4.mjs`

**Commands**
- `npm run canon:c2:v0.4` — drift check vs baseline (fails on unexpected change)
- `npm run canon:c2:v0.4:update` — regenerate baseline after intentional change

**DONE proof**
- `npm run canon:c2:v0.4` passes on `main`
- `npm run gate:quick` passes on `main`

