# Albanian Spectrum Gegë vs Tosk — STEP10 v0.3 (orthography slope probe)

- corpus: `tests/research/albanian.spectrum.gegTosk.step10.v0.3.txt` (140)
- target per bucket per dialect: 10
- permutation iters: 12000
- seed(base): 90924101
- baseline write: ENABLED (TARGET reached)

## Power check (non-failing)

| Bucket | Tosk N | Missing | Gegë N | Missing |
|--------|-------:|--------:|------:|--------:|
| V1 | 10 | 0 | 10 | 0 |
| V2 | 10 | 0 | 10 | 0 |
| V3 | 10 | 0 | 10 | 0 |
| V4 | 10 | 0 | 10 | 0 |
| V5 | 10 | 0 | 10 | 0 |
| V6 | 10 | 0 | 10 | 0 |
| V7 | 10 | 0 | 10 | 0 |

## Pairing audit (id-derived)

- pairKeys: 70
- unpaired pairKeys: 0

## Bucket means — ALL

| Bucket | N | aperture(primary) | aperture(presence mean) |
|--------|--:|------------------:|------------------------:|
| V1 | 20 | 1.000 | 0.875 |
| V2 | 20 | 0.860 | 0.735 |
| V3 | 20 | 0.600 | 0.550 |
| V4 | 20 | 0.550 | 0.530 |
| V5 | 20 | 0.400 | 0.433 |
| V6 | 20 | 0.160 | 0.345 |
| V7 | 20 | 0.120 | 0.150 |

## Bucket means — N=7 cohort (agts7.*)

| Bucket | N | aperture(primary) | aperture(presence mean) |
|--------|--:|------------------:|------------------------:|
| V1 | 2 | 1.000 | 1.000 |
| V2 | 2 | 0.800 | 0.650 |
| V3 | 2 | 0.600 | 0.550 |
| V4 | 2 | 0.500 | 0.500 |
| V5 | 2 | 0.400 | 0.450 |
| V6 | 2 | 0.100 | 0.350 |
| V7 | 2 | 0.100 | 0.200 |

## Bucket means — Tosk

| Bucket | N | aperture(primary) | aperture(presence mean) |
|--------|--:|------------------:|------------------------:|
| V1 | 10 | 1.000 | 0.875 |
| V2 | 10 | 0.860 | 0.735 |
| V3 | 10 | 0.600 | 0.550 |
| V4 | 10 | 0.550 | 0.530 |
| V5 | 10 | 0.400 | 0.433 |
| V6 | 10 | 0.160 | 0.345 |
| V7 | 10 | 0.120 | 0.160 |

## Bucket means — Gegë

| Bucket | N | aperture(primary) | aperture(presence mean) |
|--------|--:|------------------:|------------------------:|
| V1 | 10 | 1.000 | 0.875 |
| V2 | 10 | 0.860 | 0.735 |
| V3 | 10 | 0.600 | 0.550 |
| V4 | 10 | 0.550 | 0.530 |
| V5 | 10 | 0.400 | 0.433 |
| V6 | 10 | 0.160 | 0.345 |
| V7 | 10 | 0.120 | 0.140 |

## Slope test (bucket means vs semantic index 1..7)

| Cohort | Score | Pearson r | p (perm) | Spearman ρ | p (perm) |
|--------|-------|----------:|---------:|-----------:|---------:|
| ALL | aperture(primary) | -0.989 | 0.000 | -1.000 | 0.000 |
| ALL | aperture(presence mean) | -0.984 | 0.000 | -1.000 | 0.000 |
| N=7 | aperture(primary) | -0.985 | 0.000 | -0.964 | 0.004 |
| N=7 | aperture(presence mean) | -0.945 | 0.002 | -1.000 | 0.001 |
| Tosk | aperture(primary) | -0.989 | 0.000 | -1.000 | 0.000 |
| Tosk | aperture(presence mean) | -0.984 | 0.000 | -1.000 | 0.000 |
| Gegë | aperture(primary) | -0.989 | 0.000 | -1.000 | 0.000 |
| Gegë | aperture(presence mean) | -0.983 | 0.000 | -1.000 | 0.001 |

## Widest items (top 12 by presence mean)

| id | dialect | bucket | word | primary | voices | a_presence |
|----|---------|--------|------|---------|--------|----------:|
| agts10.G.V1.02 | geg | V1 | dal | A | A | 1.000 |
| agts10.G.V1.07 | geg | V1 | larg | A | A | 1.000 |
| agts10.G.V1.08 | geg | V1 | skaj | A | A | 1.000 |
| agts10.G.V1.09 | geg | V1 | qark | A | A | 1.000 |
| agts10.G.V2.06 | geg | V2 | rrah | A | A | 1.000 |
| agts10.T.V1.02 | tosk | V1 | dal | A | A | 1.000 |
| agts10.T.V1.07 | tosk | V1 | larg | A | A | 1.000 |
| agts10.T.V1.08 | tosk | V1 | skaj | A | A | 1.000 |
| agts10.T.V1.09 | tosk | V1 | qark | A | A | 1.000 |
| agts10.T.V2.06 | tosk | V2 | rrah | A | A | 1.000 |
| agts7.G.V1.01 | geg | V1 | hap | A | A | 1.000 |
| agts7.T.V1.01 | tosk | V1 | hap | A | A | 1.000 |

## Notes

- This harness is a **calibration probe**, not a published claim.
- Uses **orthography extraction SSOT** (`extractOrthographyVoicesFromWordV0_1`).
- Baselines are only written once STEP10 reaches target N per bucket per dialect (to avoid churn).

