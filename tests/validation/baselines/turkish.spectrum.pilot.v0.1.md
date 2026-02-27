# Turkish Spectrum Pilot v0.1 — orthography (langHint=tr)

- corpus: `tests/research/turkish.spectrum.pilot.v0.1.txt`
- permutation iters: 12000
- seed(base): 90924101

## Bucket means — ALL

| Bucket | N | aperture(primary) | aperture(presence mean) |
|--------|--:|------------------:|------------------------:|
| V1 | 1 | 1.000 | 1.000 |
| V2 | 1 | 0.800 | 0.800 |
| V3 | 1 | 0.600 | 0.600 |
| V4 | 1 | 1.000 | 0.550 |
| V5 | 1 | 0.400 | 0.400 |
| V6 | 1 | 0.300 | 0.300 |
| V7 | 1 | 0.100 | 0.100 |

## Slope test (bucket means vs semantic index 1..7)

| Score | Pearson r | p (perm) | Spearman ρ | p (perm) |
|-------|----------:|---------:|-----------:|---------:|
| aperture(primary) | -0.857 | 0.024 | -0.786 | 0.048 |
| aperture(presence mean) | -0.991 | 0.000 | -1.000 | 0.000 |
