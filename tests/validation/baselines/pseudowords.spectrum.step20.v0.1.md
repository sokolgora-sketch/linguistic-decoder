# Pseudowords Spectrum — STEP20 v0.1

- purpose: negative control (no semantic intent; bucket assignment independent of aperture)
- corpus: `tests/research/pseudowords.spectrum.step20.v0.1.txt`
- permutation iters: 12000
- seed(base): 90924101
- baseline write: ENABLED (TARGET reached)

## Bucket counts (TARGET=20 per bucket)

| Bucket | N | Missing to target |
|--------|--:|------------------:|
| V1 | 20 | 0 |
| V2 | 20 | 0 |
| V3 | 20 | 0 |
| V4 | 20 | 0 |
| V5 | 20 | 0 |
| V6 | 20 | 0 |
| V7 | 20 | 0 |

## Bucket means — ALL

| Bucket | N | aperture(primary) | aperture(presence mean) |
|--------|--:|------------------:|------------------------:|
| V1 | 20 | 0.530 | 0.538 |
| V2 | 20 | 0.505 | 0.522 |
| V3 | 20 | 0.550 | 0.529 |
| V4 | 20 | 0.500 | 0.520 |
| V5 | 20 | 0.560 | 0.530 |
| V6 | 20 | 0.520 | 0.524 |
| V7 | 20 | 0.510 | 0.519 |

## Slope test (bucket means vs semantic index 1..7)

| Cohort | Score | Pearson r | p (perm) | Spearman ρ | p (perm) |
|--------|-------|----------:|---------:|-----------:|---------:|
| ALL | aperture(primary) | -0.067 | 0.884 | -0.036 | 0.961 |
| ALL | aperture(presence mean) | -0.590 | 0.158 | -0.536 | 0.227 |
