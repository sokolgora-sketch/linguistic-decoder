# ZË-RO Instrument Baseline Report v0.1 (Orthography Aperture Meter)

## What this is
A reproducible baseline report for ZË-RO’s **orthography aperture meter** and **baseline-lock** (drift) workflow.

This is a **measurement + reproducibility** report. It does not claim “meaning proof” by itself.

## Method (SSOT + meter)

**SSOT**
- Orthography carrier extraction: `src/shared/vowels/extractOrthographyVoicesFromWord.v0.1.ts`

**Aperture proxy (fixed calibration scale)**
- A=1.0, O=0.8, E=0.6, Ë=0.5, U=0.4, Y=0.3, I=0.1

**Readouts**
- **primary** = aperture of the first carrier
- **presence mean** = mean aperture over unique carriers (in order)

**Slope test**
- Pearson r and Spearman ρ on **bucket means** vs semantic index 1..7
- Permutation p-value: 12,000 iterations; fixed seed

## Baseline-lock workflow
Harnesses always write *current* artifacts to:
- `tests/validation/out/*.md|json`

Baselines are written to:
- `tests/validation/baselines/*.md|json`

…and only when the dataset reaches its target per-bucket N (to avoid churn).

## Baseline-locked datasets
Positive-signal:
- Albanian (Gegë/Tosk) STEP10 v0.3
- Turkish STEP10 v0.1 (langHint=tr)
- Turkish STEP20 v0.1 (langHint=tr) + STEP10→STEP20 compare

Controls / drift visibility:
- Pseudowords STEP10/STEP20 v0.1 (negative control; no strengthening)
- Taiwan Zhuyin suite (fragility / weakening under expansion)

## Results (copied from committed baselines)

### Turkish (positive signal; strengthens)
- STEP10 presence mean: r=-0.987 (p=0.000), ρ=-0.964 (p=0.002)
- STEP20 presence mean: r=-0.989 (p=0.000), ρ=-1.000 (p=0.000)
- STEP10→STEP20 compare (presence mean): Δ|ρ|=+0.036

Baselines:
- `tests/validation/baselines/turkish.spectrum.step10.v0.1.md|json`
- `tests/validation/baselines/turkish.spectrum.step20.v0.1.md|json`
- `tests/validation/baselines/turkish.spectrum.step20.v0.1.compare.v0.1.md|json`

### Pseudowords (negative control; no strengthening)
- STEP10 presence mean: r=-0.590 (p=0.166), ρ=-0.536 (p=0.239)
- STEP20 presence mean: r=-0.590 (p=0.158), ρ=-0.536 (p=0.227)
- STEP10→STEP20 compare (presence mean): Δ|ρ|=0.000

Baselines:
- `tests/validation/baselines/pseudowords.spectrum.step10.v0.1.md|json`
- `tests/validation/baselines/pseudowords.spectrum.step20.v0.1.md|json`
- `tests/validation/baselines/pseudowords.spectrum.step20.v0.1.compare.v0.1.md|json`

### Taiwan Zhuyin (drift visibility)
Designed to show that some apparent signals **weaken** as N increases.

Baselines:
- `tests/validation/baselines/taiwan.spectrum.rootOnly.v1.0.compare.v0.1.md|json`
- `tests/validation/baselines/taiwan.spectrum.rootOnly.v1.0.audit.v0.1.md|json`
- `tests/validation/baselines/taiwan.spectrum.rootOnly.v1.0.toneSlope.v0.1.md|json`

### Albanian (positive signal reference)
Baselines:
- `tests/validation/baselines/albanian.spectrum.gegTosk.step10.v0.3.md|json`

## Reproduce (exact commands)
```bash
npm install
npm run gate:quick

npm test -- tests/research/turkish.spectrum.step20.v0.1.spec.ts
npm test -- tests/research/pseudowords.spectrum.step20.v0.1.spec.ts
npm test -- tests/research/taiwan.spectrum.rootOnly.v1.0.spec.ts