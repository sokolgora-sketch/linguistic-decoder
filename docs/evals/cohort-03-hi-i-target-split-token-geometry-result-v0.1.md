# Cohort 03 Hindi `/i/` Target-Split Token Geometry Result v0.1

Status: inspected result summary  
Scope: documentation only  
Date recorded: 2026-05-21

## 1. Purpose

This document records a deterministic token-geometry inspection of the main versus alternate Hindi `/i/` target buckets used in the short-`i` versus long-`ee` high-anchor probe.

Source result:

- `docs/evals/cohort-03-hi-i-short-i-vs-long-ee-high-anchor-result-v0.1.md`

Source run design:

- `docs/evals/cohort-03-hi-i-short-i-vs-long-ee-high-anchor-run-design-v0.1.md`

Helper used:

- `src/shared/evals/tokenGeometryInspection.v0.1.ts`

This document does not define new `/evals` runs, change scoring, change helper logic, change anchors, or make publication claims.

## 2. Mechanism question

The prior result left one specific unresolved split:

> Why does the main Hindi `/i/` target bucket still collapse at the high boundary under a short-`i` high anchor, while the alternate target bucket stabilizes?

This inspection checks whether the two target buckets differ structurally before running any new scoring.

## 3. Buckets inspected

Main target bucket:

- `din`
- `dil`
- `sir`
- `kitab`
- `shiksha`
- `nadi`
- `pita`
- `kisan`
- `vidya`
- `mitti`

Alternate target bucket:

- `chitra`
- `disha`
- `himmat`
- `kiran`
- `kismat`
- `nishan`
- `vikas`
- `shikar`
- `sitar`
- `jigar`

Short-`i` high anchor:

- `imli`
- `mirch`
- `khidki`
- `ginti`
- `dikkat`
- `likhna`
- `milna`
- `girna`
- `rishta`
- `bistar`

Long-`ee` high anchor:

- `jeevan`
- `geet`
- `neend`
- `cheez`
- `teer`
- `jeet`
- `peepal`
- `keeda`
- `deewar`
- `meetha`

## 4. Bucket summaries

| Bucket | tokenCount | meanTokenLength | minTokenLength | maxTokenLength | openFinalTokenCount | closedFinalTokenCount | maxConsonantCluster | shortIMarkerCount | longHighFrontMarkerCount |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| low anchor | 10 | 5.3 | 4 | 6 | 2 | 8 | 2 | 0 | 0 |
| main target | 10 | 4.4 | 3 | 7 | 5 | 5 | 3 | 11 | 0 |
| alternate target | 10 | 5.5 | 5 | 6 | 2 | 8 | 2 | 10 | 0 |
| short-`i` high anchor | 10 | 5.4 | 4 | 6 | 7 | 3 | 3 | 13 | 0 |
| long-`ee` high anchor | 10 | 5.1 | 4 | 6 | 2 | 8 | 2 | 0 | 10 |

## 5. Target split deltas

Alternate target minus main target:

| Metric | Delta |
|---|---:|
| meanTokenLength | +1.1 |
| minTokenLength | +2 |
| maxTokenLength | -1 |
| openFinalTokenCount | -3 |
| closedFinalTokenCount | +3 |
| maxConsonantCluster | -1 |
| shortIMarkerCount | -1 |
| longHighFrontMarkerCount | 0 |
| markerCounts.i | -1 |
| markerTokenCounts.i | 0 |

Reading:

> The alternate target bucket is not more short-`i` dense than the main bucket. Its main structural difference is shape: longer average token length, fewer open-final tokens, more closed-final tokens, and lower max consonant cluster.

## 6. Short-`i` high-anchor comparisons

| Comparison | highAnchorMeanTokenLengthMinusTarget | highAnchorLongHighFrontMarkersMinusTarget | highAnchorShortIMarkersMinusTarget | Flags |
|---|---:|---:|---:|---|
| main target vs short-`i` high anchor | +1.0 | 0 | +2 | `HIGH_ANCHOR_TOKENS_LONGER_THAN_TARGET`, `HIGH_ANCHOR_ALL_TOKENS_HAVE_SHORT_I_MARKER` |
| alternate target vs short-`i` high anchor | -0.1 | 0 | +3 | `HIGH_ANCHOR_ALL_TOKENS_HAVE_SHORT_I_MARKER` |

Reading:

> The short-`i` high anchor is length-aligned with the alternate target bucket, but substantially longer than the main target bucket.

This is the clearest deterministic token-geometry difference matching the scored split.

## 7. Long-`ee` high-anchor comparisons

| Comparison | highAnchorMeanTokenLengthMinusTarget | highAnchorLongHighFrontMarkersMinusTarget | highAnchorShortIMarkersMinusTarget | Flags |
|---|---:|---:|---:|---|
| main target vs long-`ee` high anchor | +0.7 | +10 | -11 | `HIGH_ANCHOR_HAS_MORE_LONG_HIGH_FRONT_MARKERS_THAN_TARGET`, `HIGH_ANCHOR_HAS_FEWER_SHORT_I_MARKERS_THAN_TARGET`, `HIGH_ANCHOR_TOKENS_LONGER_THAN_TARGET`, `HIGH_ANCHOR_DOMINATED_BY_EE_MARKER_TOKENS` |
| alternate target vs long-`ee` high anchor | -0.4 | +10 | -10 | `HIGH_ANCHOR_HAS_MORE_LONG_HIGH_FRONT_MARKERS_THAN_TARGET`, `HIGH_ANCHOR_HAS_FEWER_SHORT_I_MARKERS_THAN_TARGET`, `HIGH_ANCHOR_DOMINATED_BY_EE_MARKER_TOKENS` |

Reading:

> Both target buckets face long-`ee` marker pressure under the old high anchor. Only the main target additionally faces high-anchor length pressure.

## 8. Relationship to the scored result

Prior scored result:

| Target bucket | Long-`ee` high anchor | Short-`i` high anchor |
|---|---|---|
| main | `COLLAPSED_HIGH` | `COLLAPSED_HIGH` with `BOUNDARY_UNCERTAIN_HIGH` |
| alternate | `COLLAPSED_HIGH` | `INTERMEDIATE` |

Token-geometry inspection:

| Target bucket | Shape relative to short-`i` high anchor | Scored outcome |
|---|---|---|
| main | short-`i` high anchor is +1.0 mean token length longer | near-boundary `COLLAPSED_HIGH` |
| alternate | short-`i` high anchor is -0.1 mean token length different | `INTERMEDIATE` |

Interpretation:

> The main/alternate split is consistent with token-length geometry: the alternate target is shape-aligned with the short-`i` high anchor, while the main target remains substantially shorter.

## 9. Mechanism interpretation

This inspection supports a narrow mechanism reading:

1. The scored split is not explained by short-`i` marker density alone.
2. Both main and alternate target buckets have short-`i` markers in all 10 tokens.
3. The alternate target bucket is much closer to the short-`i` high anchor in mean token length.
4. The main target bucket is shorter and triggers `HIGH_ANCHOR_TOKENS_LONGER_THAN_TARGET` against the short-`i` high anchor.
5. Therefore, the remaining main-target high-boundary pressure may be partly driven by target/high-anchor shape mismatch, especially token length.

This is mechanism evidence only.

## 10. Claim boundaries

Allowed:

- The main and alternate Hindi `/i/` target buckets are structurally different.
- The alternate target bucket is length-aligned with the short-`i` high anchor.
- The main target bucket is substantially shorter than the short-`i` high anchor.
- The token-geometry split is consistent with the scored split.
- The remaining main-target pressure may involve token-length / shape mismatch.

Blocked:

- Do not claim this fully explains the scored result.
- Do not claim token length is the only mechanism.
- Do not claim `V6-V7` solves Hindi `/i/`.
- Do not claim Hindi `/i` supports `V6-V7`.
- Do not change scorer math from this inspection.
- Do not change anchor doctrine from this inspection.
- Do not run broad language expansion from this inspection alone.
- Do not publish this as final evidence.

## 11. Next work

Recommended next step:

> Add or use a deterministic target-vs-target inspection helper if this comparison needs to become reusable.

Only after that:

1. Decide whether to predeclare a small follow-up with length-matched main-target variants.
2. Keep the same short-`i` high anchor.
3. Do not broaden to new languages until this target-internal shape issue is understood.
