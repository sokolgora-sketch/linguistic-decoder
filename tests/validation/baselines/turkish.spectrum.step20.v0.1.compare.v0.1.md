# Turkish Spectrum — Compare STEP10→STEP20 (v0.1)

- step10 baseline: `tests/validation/baselines/turkish.spectrum.step10.v0.1.json`
- step20 corpus: `tests/research/turkish.spectrum.step20.v0.1.txt`
- compare write: ENABLED (STEP20 complete)

## Slope comparison (ALL)

| Score | STEP10 r | STEP10 p | STEP20 r | STEP20 p | STEP10 ρ | STEP10 p | STEP20 ρ | STEP20 p |
|------|----------:|---------:|----------:|---------:|---------:|---------:|---------:|---------:|
| aperture(primary) | -0.857 | 0.013 | -0.857 | 0.014 | -0.786 | 0.050 | -0.786 | 0.045 |
| aperture(presence mean) | -0.987 | 0.000 | -0.989 | 0.000 | -0.964 | 0.002 | -1.000 | 0.000 |

## Delta on absolute strength (higher is stronger)

| Score | |r| STEP10 | |r| STEP20 | Δ|r| | |ρ| STEP10 | |ρ| STEP20 | Δ|ρ| |
|------|----------:|----------:|----:|----------:|----------:|----:|
| aperture(primary) | 0.857 | 0.857 | 0.000 | 0.786 | 0.786 | 0.000 |
| aperture(presence mean) | 0.987 | 0.989 | 0.002 | 0.964 | 1.000 | 0.036 |
