# Pseudowords Spectrum — STEP10 v0.1

- purpose: negative control (no semantic intent; bucket assignment independent of aperture)
- corpus: `tests/research/pseudowords.spectrum.step10.v0.1.txt`
- permutation iters: 12000
- seed(base): 90924101
- baseline write: ENABLED (TARGET reached)

## Bucket counts (TARGET=10 per bucket)

| Bucket | N | Missing to target |
|--------|--:|------------------:|
| V1 | 10 | 0 |
| V2 | 10 | 0 |
| V3 | 10 | 0 |
| V4 | 10 | 0 |
| V5 | 10 | 0 |
| V6 | 10 | 0 |
| V7 | 10 | 0 |

## Bucket means — ALL

| Bucket | N | aperture(primary) | aperture(presence mean) |
|--------|--:|------------------:|------------------------:|
| V1 | 10 | 0.540 | 0.557 |
| V2 | 10 | 0.490 | 0.523 |
| V3 | 10 | 0.580 | 0.538 |
| V4 | 10 | 0.480 | 0.521 |
| V5 | 10 | 0.600 | 0.540 |
| V6 | 10 | 0.520 | 0.528 |
| V7 | 10 | 0.500 | 0.518 |

## Slope test (bucket means vs semantic index 1..7)

| Cohort | Score | Pearson r | p (perm) | Spearman ρ | p (perm) |
|--------|-------|----------:|---------:|-----------:|---------:|
| ALL | aperture(primary) | -0.067 | 0.885 | -0.036 | 0.966 |
| ALL | aperture(presence mean) | -0.590 | 0.166 | -0.536 | 0.239 |
