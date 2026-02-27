# Turkish Spectrum — STEP20 v0.1 (langHint=tr)

- corpus: `tests/research/turkish.spectrum.step20.v0.1.txt`
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
| V1 | 20 | 1.000 | 0.955 |
| V2 | 20 | 0.800 | 0.760 |
| V3 | 20 | 0.600 | 0.587 |
| V4 | 20 | 1.000 | 0.563 |
| V5 | 20 | 0.400 | 0.400 |
| V6 | 20 | 0.300 | 0.307 |
| V7 | 20 | 0.100 | 0.125 |

## Slope test (bucket means vs semantic index 1..7)

| Cohort | Score | Pearson r | p (perm) | Spearman ρ | p (perm) |
|--------|-------|----------:|---------:|-----------:|---------:|
| ALL | aperture(primary) | -0.857 | 0.014 | -0.786 | 0.045 |
| ALL | aperture(presence mean) | -0.989 | 0.000 | -1.000 | 0.000 |
