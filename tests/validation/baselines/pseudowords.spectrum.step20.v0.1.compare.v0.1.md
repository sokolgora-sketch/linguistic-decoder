# Pseudowords Spectrum — STEP10→STEP20 compare v0.1

- step10 baseline: `tests/validation/baselines/pseudowords.spectrum.step10.v0.1.json`
- step20 corpus: `tests/research/pseudowords.spectrum.step20.v0.1.txt`

## Slope test (bucket means vs semantic index 1..7)

| Score | STEP10 r | p | STEP20 r | p | STEP10 ρ | p | STEP20 ρ | p |
|-------|---------:|--:|---------:|--:|---------:|--:|---------:|--:|
| aperture(primary) | -0.067 | 0.885 | -0.067 | 0.884 | -0.036 | 0.966 | -0.036 | 0.961 |
| aperture(presence mean) | -0.590 | 0.166 | -0.590 | 0.158 | -0.536 | 0.239 | -0.536 | 0.227 |

## Absolute strength (|r|, |ρ|) and deltas

| Score | |r| STEP10 | |r| STEP20 | Δ|r| | |ρ| STEP10 | |ρ| STEP20 | Δ|ρ| |
|-------|----------:|----------:|----:|-----------:|----------:|----:|
| aperture(primary) | 0.067 | 0.067 | -0.000 | 0.036 | 0.036 | 0.000 |
| aperture(presence mean) | 0.590 | 0.590 | 0.000 | 0.536 | 0.536 | 0.000 |
