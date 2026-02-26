# Albanian Spectrum Gegë vs Tosk Pilot v0.2 — orthography slope probe

- corpus: `tests/research/albanian.spectrum.gegTosk.pilot.v0.2.txt` (14)
- iters: 12000
- seed(base): 90924101

## Cohorts

- Tosk: 7
- Gegë: 7

## Bucket means — ALL

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
| V1 | 1 | 1.000 | 1.000 |
| V2 | 1 | 0.800 | 0.650 |
| V3 | 1 | 0.600 | 0.550 |
| V4 | 1 | 0.500 | 0.500 |
| V5 | 1 | 0.400 | 0.450 |
| V6 | 1 | 0.100 | 0.350 |
| V7 | 1 | 0.100 | 0.300 |

## Bucket means — Gegë

| Bucket | N | aperture(primary) | aperture(presence mean) |
|--------|--:|------------------:|------------------------:|
| V1 | 1 | 1.000 | 1.000 |
| V2 | 1 | 0.800 | 0.650 |
| V3 | 1 | 0.600 | 0.550 |
| V4 | 1 | 0.500 | 0.500 |
| V5 | 1 | 0.400 | 0.450 |
| V6 | 1 | 0.100 | 0.350 |
| V7 | 1 | 0.100 | 0.100 |

## Drift (Gegë − Tosk) — presence mean

| Bucket | Tosk N | Gegë N | Tosk mean | Gegë mean | Δ |
|--------|-------:|------:|----------:|----------:|--:|
| V1 | 1 | 1 | 1.000 | 1.000 | 0.000 |
| V2 | 1 | 1 | 0.650 | 0.650 | 0.000 |
| V3 | 1 | 1 | 0.550 | 0.550 | 0.000 |
| V4 | 1 | 1 | 0.500 | 0.500 | 0.000 |
| V5 | 1 | 1 | 0.450 | 0.450 | 0.000 |
| V6 | 1 | 1 | 0.350 | 0.350 | 0.000 |
| V7 | 1 | 1 | 0.300 | 0.100 | -0.200 |

## Slope test (bucket means vs semantic index 1..7)

| Cohort | Score | Pearson r | p (perm) | Spearman ρ | p (perm) |
|--------|-------|----------:|---------:|-----------:|---------:|
| ALL | aperture(primary) | -0.985 | 0.000 | -0.964 | 0.004 |
| ALL | aperture(presence mean) | -0.945 | 0.002 | -1.000 | 0.001 |
| Tosk | aperture(primary) | -0.985 | 0.001 | -0.964 | 0.003 |
| Tosk | aperture(presence mean) | -0.925 | 0.000 | -1.000 | 0.000 |
| Gegë | aperture(primary) | -0.985 | 0.001 | -0.964 | 0.003 |
| Gegë | aperture(presence mean) | -0.949 | 0.000 | -1.000 | 0.000 |

## Widest items (top 10 by presence mean)

| id | dialect | bucket | word | primary | voices | a_presence |
|----|---------|--------|------|---------|--------|----------:|
| agts2.G.v1 | geg | V1 | hap | A | A | 1.000 |
| agts2.T.v1 | tosk | V1 | hap | A | A | 1.000 |
| agts2.G.v2 | geg | V2 | forcë | O | O,Ë | 0.650 |
| agts2.T.v2 | tosk | V2 | forcë | O | O,Ë | 0.650 |
| agts2.G.v3 | geg | V3 | thellë | E | E,Ë | 0.550 |
| agts2.T.v3 | tosk | V3 | thellë | E | E,Ë | 0.550 |
| agts2.G.v4 | geg | V4 | rrënjë | Ë | Ë | 0.500 |
| agts2.T.v4 | tosk | V4 | rrënjë | Ë | Ë | 0.500 |
| agts2.G.v5 | geg | V5 | udhë | U | U,Ë | 0.450 |
| agts2.T.v5 | tosk | V5 | udhë | U | U,Ë | 0.450 |

## Notes

- This is a **pilot probe**, not a published claim.
- Dialect labels are **research labels**; verify word pairs and replace as needed.
- Uses **orthography extraction SSOT** (`extractOrthographyVoicesFromWordV0_1`).

