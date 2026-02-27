# Turkish Spectrum — STEP10 v0.1 (langHint=tr)

- corpus: `tests/research/turkish.spectrum.step10.v0.1.txt`
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
| V1 | 10 | 1.000 | 0.955 |
| V2 | 10 | 0.800 | 0.760 |
| V3 | 10 | 0.600 | 0.575 |
| V4 | 10 | 1.000 | 0.575 |
| V5 | 10 | 0.400 | 0.400 |
| V6 | 10 | 0.300 | 0.300 |
| V7 | 10 | 0.100 | 0.150 |

## Slope test (bucket means vs semantic index 1..7)

| Cohort | Score | Pearson r | p (perm) | Spearman ρ | p (perm) |
|--------|-------|----------:|---------:|-----------:|---------:|
| ALL | aperture(primary) | -0.857 | 0.013 | -0.786 | 0.050 |
| ALL | aperture(presence mean) | -0.987 | 0.000 | -0.964 | 0.002 |
