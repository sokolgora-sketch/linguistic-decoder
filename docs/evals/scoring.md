# ZË-RO Evals v0.1 — Scoring

Sources of truth:
- `src/shared/evals/scoreEvalRun.v0.1.ts` (scorer)
- `src/shared/evals/stats.v0.1.ts` (pearson/spearman + permutation)
- `src/shared/vowels/extractOrthographyVoicesFromWord.v0.1.ts` (orthography SSOT)

## What is scored

Given bucketed tokens (V1..V7), we compute per-token features using **orthography** vowel-carrier extraction (SSOT), then compute:

- `aperturePrimary`: aperture of the **primary** carrier (first vowel in the SSOT voice list)
- `aperturePresenceMean`: mean aperture across **unique carriers** present in the token (in order)

Aperture proxy (fixed):
- A=1.0, O=0.8, E=0.6, Ë=0.5, U=0.4, Y=0.3, I=0.1

## Per-bucket summaries

For each bucket:
- expectedN / providedN
- validN / invalidN / dupN
- mean(aperturePrimary)
- mean(aperturePresenceMean)

Invalid tokens (v0.1):
- empty
- whitespace-only
- no-vowel tokens (orthography SSOT returns no carriers)

## Slope statistics (bucket means)

We compute slope using bucket index (1..7) against bucket means:
- Pearson r
- Spearman ρ

Then compute **deterministic permutation p-values** by shuffling bucket labels across tokens (counts preserved):
- p-value is two-sided on `|r|` / `|ρ|`
- settings come from the eval spec (`iters`, `seed`)

Interpretation:
- small p-values → slope unlikely under label-shuffle chance baseline
- large p-values → slope not distinguishable from chance under this probe

## Negative control (T3)

`T3_NEGATIVE_CONTROL_SHUFFLE_V0_1` holds tokens fixed and shuffles labels deterministically.

Expectation:
- slope should collapse (p-values not small)

Purpose:
- false-positive detector (instrument sanity)