# Albanian Spectrum Gegë vs Tosk — STEP10 compare v0.3 (N=7 vs ALL)

- corpus: `tests/research/albanian.spectrum.gegTosk.step10.v0.3.txt`
- iters: 12000
- seed(base): 90924101
- cohort rule: N=7 = id starts with "agts7." ; ALL = all active rows

## N=7

| Bucket | N | aperture(primary) | aperture(presence mean) |
|--------|--:|------------------:|------------------------:|
| V1 | 2 | 1.000 | 1.000 |
| V2 | 2 | 0.800 | 0.650 |
| V3 | 2 | 0.600 | 0.550 |
| V4 | 2 | 0.500 | 0.500 |
| V5 | 2 | 0.400 | 0.450 |
| V6 | 2 | 0.100 | 0.350 |
| V7 | 2 | 0.100 | 0.200 |

| Score | Pearson r | p (perm) | Spearman ρ | p (perm) |
|-------|----------:|---------:|-----------:|---------:|
| aperture(primary) | -0.985 | 0.000 | -0.964 | 0.004 |
| aperture(presence mean) | -0.945 | 0.002 | -1.000 | 0.001 |

## ALL

| Bucket | N | aperture(primary) | aperture(presence mean) |
|--------|--:|------------------:|------------------------:|
| V1 | 20 | 1.000 | 0.875 |
| V2 | 20 | 0.860 | 0.735 |
| V3 | 20 | 0.600 | 0.550 |
| V4 | 20 | 0.550 | 0.530 |
| V5 | 20 | 0.400 | 0.433 |
| V6 | 20 | 0.160 | 0.345 |
| V7 | 20 | 0.120 | 0.150 |

| Score | Pearson r | p (perm) | Spearman ρ | p (perm) |
|-------|----------:|---------:|-----------:|---------:|
| aperture(primary) | -0.989 | 0.000 | -1.000 | 0.000 |
| aperture(presence mean) | -0.984 | 0.000 | -1.000 | 0.000 |

## Delta (ALL − N=7)

| Score | Δ Pearson r | Δ p | Δ Spearman ρ | Δ p |
|-------|------------:|----:|-------------:|----:|
| aperture(primary) | -0.003 | 0.000 | -0.036 | -0.003 |
| aperture(presence mean) | -0.039 | -0.002 | 0.000 | -0.001 |

