# ZË-RO Evals Report v0.1

- evalSpecVersion: evalSpec.v0.1
- engineVersion: scoreEvalRun.v0.1
- taskId: T1_BUCKET_V1_V0_1
- taskVersion: v0.1
- promptHash: 9489bffdf9d1fa4a65e248fbb5f1a4f069122f9a40612a4087d9702cde84e892
- seedPrimary: —
- seedPresenceMean: —
- permItersPrimary: —
- permItersPresenceMean: —
- scorerBuild: unknown
- baselineRef: paper.v0.1 · LingBuzz/009799 · LingBuzz/009808
- specId: public-grounding-probe.v0.1
- runId: gold.synthetic.full
- provider: synthetic
- model: none
- label: calibration

Aperture proxy (fixed): A=1.0, O=0.8, E=0.6, Ë=0.5, U=0.4, Y=0.3, I=0.1.

## T1_BUCKET_V1_V0_1 — Bucket Targeting — V1 (Expansion/Space)

- kind: byo
- languageHint: en
- targetBuckets: V1
- nPerBucket: 20

### Buckets

| Bucket | expectedN | providedN | validN | invalidN | dupN | mean(primary) | mean(presenceMean) |
|---|---:|---:|---:|---:|---:|---:|---:|
| V1 | 20 | 20 | 20 | 0 | 0 | 1.000 | 1.000 |

### Slope — aperturePrimary

_not computed (needs >= 2 buckets)_

### Slope — aperturePresenceMean

_not computed (needs >= 2 buckets)_

### Diagnostics

- missingBuckets: (none)
- extraBuckets: (none)
- emptyTokenCount: 0
- whitespaceTokenCount: 0
- noVowelTokenCount: 0
- totalInvalidTokenCount: 0
- notes: (none)

## T1_BUCKET_V4_V0_1 — Bucket Targeting — V4 (Ground/Balance)

- kind: byo
- languageHint: en
- targetBuckets: V4
- nPerBucket: 20

### Buckets

| Bucket | expectedN | providedN | validN | invalidN | dupN | mean(primary) | mean(presenceMean) |
|---|---:|---:|---:|---:|---:|---:|---:|
| V4 | 20 | 20 | 20 | 0 | 0 | 0.500 | 0.500 |

### Slope — aperturePrimary

_not computed (needs >= 2 buckets)_

### Slope — aperturePresenceMean

_not computed (needs >= 2 buckets)_

### Diagnostics

- missingBuckets: (none)
- extraBuckets: (none)
- emptyTokenCount: 0
- whitespaceTokenCount: 0
- noVowelTokenCount: 0
- totalInvalidTokenCount: 0
- notes: (none)

## T1_BUCKET_V7_V0_1 — Bucket Targeting — V7 (Focus/Linearity)

- kind: byo
- languageHint: en
- targetBuckets: V7
- nPerBucket: 20

### Buckets

| Bucket | expectedN | providedN | validN | invalidN | dupN | mean(primary) | mean(presenceMean) |
|---|---:|---:|---:|---:|---:|---:|---:|
| V7 | 20 | 20 | 20 | 0 | 0 | 0.100 | 0.100 |

### Slope — aperturePrimary

_not computed (needs >= 2 buckets)_

### Slope — aperturePresenceMean

_not computed (needs >= 2 buckets)_

### Diagnostics

- missingBuckets: (none)
- extraBuckets: (none)
- emptyTokenCount: 0
- whitespaceTokenCount: 0
- noVowelTokenCount: 0
- totalInvalidTokenCount: 0
- notes: (none)

## T2_LADDER_V0_1 — Full Ladder — V1..V7

- kind: byo
- languageHint: en
- targetBuckets: V1, V2, V3, V4, V5, V6, V7
- nPerBucket: 10

### Buckets

| Bucket | expectedN | providedN | validN | invalidN | dupN | mean(primary) | mean(presenceMean) |
|---|---:|---:|---:|---:|---:|---:|---:|
| V1 | 10 | 10 | 10 | 0 | 0 | 1.000 | 1.000 |
| V2 | 10 | 10 | 10 | 0 | 0 | 0.800 | 0.800 |
| V3 | 10 | 10 | 10 | 0 | 0 | 0.600 | 0.600 |
| V4 | 10 | 10 | 10 | 0 | 0 | 0.500 | 0.500 |
| V5 | 10 | 10 | 10 | 0 | 0 | 0.400 | 0.400 |
| V6 | 10 | 10 | 10 | 0 | 0 | 0.300 | 0.300 |
| V7 | 10 | 10 | 10 | 0 | 0 | 0.100 | 0.100 |

### Slope — aperturePrimary

- pearson r: -0.990 (parametric p < 0.001)
- spearman ρ: -1.000 (parametric p < 0.001)
- permutation test: iters=12000, seed=90273163

### Slope — aperturePresenceMean

- pearson r: -0.990 (parametric p < 0.001)
- spearman ρ: -1.000 (parametric p < 0.001)
- permutation test: iters=12000, seed=97631760

### Diagnostics

- missingBuckets: (none)
- extraBuckets: (none)
- emptyTokenCount: 0
- whitespaceTokenCount: 0
- noVowelTokenCount: 0
- totalInvalidTokenCount: 0
- notes: (none)

## T3_NEGATIVE_CONTROL_SHUFFLE_V0_1 — Negative Control — Deterministic Label Shuffle (tokens fixed)

- kind: derived
- languageHint: en
- targetBuckets: V1, V2, V3, V4, V5, V6, V7
- nPerBucket: 10

### Buckets

| Bucket | expectedN | providedN | validN | invalidN | dupN | mean(primary) | mean(presenceMean) |
|---|---:|---:|---:|---:|---:|---:|---:|
| V1 | 10 | 10 | 10 | 0 | 0 | 0.580 | 0.580 |
| V2 | 10 | 10 | 10 | 0 | 0 | 0.550 | 0.550 |
| V3 | 10 | 10 | 10 | 0 | 0 | 0.550 | 0.550 |
| V4 | 10 | 10 | 10 | 0 | 0 | 0.360 | 0.360 |
| V5 | 10 | 10 | 10 | 0 | 0 | 0.710 | 0.710 |
| V6 | 10 | 10 | 10 | 0 | 0 | 0.540 | 0.540 |
| V7 | 10 | 10 | 10 | 0 | 0 | 0.410 | 0.410 |

### Slope — aperturePrimary

- pearson r: -0.249 (parametric p=0.594)
- spearman ρ: -0.429 (parametric p=0.360)
- permutation test: iters=12000, seed=90273163

### Slope — aperturePresenceMean

- pearson r: -0.249 (parametric p=0.588)
- spearman ρ: -0.429 (parametric p=0.349)
- permutation test: iters=12000, seed=97631760

### Diagnostics

- missingBuckets: (none)
- extraBuckets: (none)
- emptyTokenCount: 0
- whitespaceTokenCount: 0
- noVowelTokenCount: 0
- totalInvalidTokenCount: 0
- notes: (none)
