# Cohort 03 Hindi `/i/` Mechanism Synthesis v0.1

Status: synthesis  
Scope: documentation only  
Date recorded: 2026-05-21

## 1. Purpose

This document synthesizes the Cohort 03 Hindi `/i/` evidence chain after the length-matched replication result.

It does not record a new `/evals` run.

It does not update README, publication text, scorer math, anchor doctrine, API behavior, UI behavior, or evidence-pack export behavior.

Primary synthesis question:

> What mechanism best explains the Hindi `/i/` high-region pressure after anchor-geometry, target-geometry, length-matched, and replication tests?

## 2. Source documents

This synthesis is based on these repo-tracked documents:

1. `docs/evals/cohort-03-hi-ar-i-token-geometry-result-v0.1.md`
2. `docs/evals/cohort-03-hi-i-short-i-vs-long-ee-high-anchor-result-v0.1.md`
3. `docs/evals/cohort-03-hi-i-target-split-token-geometry-result-v0.1.md`
4. `docs/evals/cohort-03-hi-i-length-matched-main-target-run-design-v0.1.md`
5. `docs/evals/cohort-03-hi-i-length-matched-main-target-curation-result-v0.1.md`
6. `docs/evals/cohort-03-hi-i-length-matched-main-target-result-v0.1.md`
7. `docs/evals/cohort-03-hi-i-length-matched-main-target-replication-curation-result-v0.1.md`
8. `docs/evals/cohort-03-hi-i-length-matched-main-target-replication-result-v0.1.md`

## 3. Evidence chain overview

### 3.1 Hindi/Arabic `/i/` token-geometry comparison

The Hindi/Arabic comparison showed that Hindi `/i/` remained high-collapsed under both tested high-front placements, while Arabic `/i/` stabilized under `V6-V7`.

Recorded pattern:

| Lane | Original tested bracket | Original verdict | Follow-up bracket | Follow-up verdict |
|---|---|---|---|---|
| Hindi `/i/` | `V5-V7` | `COLLAPSED_HIGH` | `V6-V7` | `COLLAPSED_HIGH` |
| Arabic `/i/` | `V5-V7` | `COLLAPSED_HIGH` | `V6-V7` | `INTERMEDIATE` |

Reading:

> Hindi `/i/` pressure was not explained by broad high-front placement alone, because Arabic stabilized where Hindi did not.

### 3.2 Short-`i` versus long-`ee` high-anchor probe

The short-`i` versus long-`ee` high-anchor probe tested whether the long-`ee` high anchor was creating artificial high-region pressure.

Recorded pattern:

| Target bucket | Long-`ee` high anchor | Short-`i` high anchor | Reading |
|---|---|---|---|
| main | `COLLAPSED_HIGH` | `COLLAPSED_HIGH` with `BOUNDARY_UNCERTAIN_HIGH` | pressure reduced but not rescued |
| alternate | `COLLAPSED_HIGH` | `INTERMEDIATE` | rescued / stabilized |

Reading:

> Replacing the long-`ee` high anchor with a short-`i` high anchor reduced high-collapse pressure, but did not fully explain the main target collapse.

### 3.3 Target-split token geometry

The target-split geometry inspection showed that the original main target was much shorter than the short-`i` high anchor, while the alternate target was length-aligned with it.

Recorded geometry:

| Bucket | meanTokenLength | shortIMarkerCount | openFinalTokenCount | closedFinalTokenCount | maxConsonantCluster |
|---|---:|---:|---:|---:|---:|
| original main target | `4.4` | `11` | `5` | `5` | `3` |
| alternate target | `5.5` | `10` | `2` | `8` | `2` |
| short-`i` high anchor | `5.4` | `13` | `7` | `3` | `3` |

Scored relationship:

| Target | Short-`i` high-anchor geometry relation | Verdict |
|---|---|---|
| original main target | high anchor is `+1.0` mean token length longer | near-boundary `COLLAPSED_HIGH` |
| alternate target | high anchor is `-0.1` mean token length different | `INTERMEDIATE` |

Reading:

> The main/alternate split was consistent with target/high-anchor shape mismatch, especially token length.

### 3.4 First length-matched main-target result

The first length-matched series tested whether a newly curated target with mean token length `5.4` would stabilize relative to the original main target.

Evidence pack:

- `evals.series-evidence-pack.cohort03-hi-i-length-matched-main-target-v0.1.v0.1.zip`

SHA256:

- `4ef3e437635393643d61bf5c90dec87c3a5839bc1c4537fc9aec98f463fbcb27`

Recorded result:

| Lane | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---|---:|---:|---:|---:|---|
| original main target reference | `COLLAPSED_HIGH` | `1.018116` | `0.468333` | `-0.008333` | `BOUNDARY_UNCERTAIN_HIGH` |
| length-matched main target candidate | `INTERMEDIATE` | `0.706522` | `0.325` | `0.135` | `BOUNDARY_UNCERTAIN_HIGH` |
| alternate target reference | `INTERMEDIATE` | `0.608696` | `0.28` | `0.18` | none |

Reading:

> Length matching moved the main-target lane from near-boundary `COLLAPSED_HIGH` to `INTERMEDIATE`.

Caveat:

> The first length-matched candidate still carried `BOUNDARY_UNCERTAIN_HIGH`.

### 3.5 Length-matched replication result

The replication series tested a second independently curated length-matched target.

Evidence pack:

- `evals.series-evidence-pack.cohort03-hi-i-length-matched-main-target-replication-v0.1.v0.1.zip`

SHA256:

- `8aae1cabd1170a21538c19b70c57f11e332ee9cbed5490989e87ce6145fc005e`

Recorded result:

| Lane | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---|---:|---:|---:|---:|---|
| original main target reference | `COLLAPSED_HIGH` | `1.018116` | `0.468333` | `-0.008333` | `BOUNDARY_UNCERTAIN_HIGH` |
| revised length-matched replication candidate | `INTERMEDIATE` | `0.938406` | `0.431667` | `0.028333` | `NEAR_COLLAPSE_HIGH`, `BOUNDARY_UNCERTAIN_HIGH` |
| alternate target reference | `INTERMEDIATE` | `0.608696` | `0.28` | `0.18` | none |

Reading:

> Verdict-level stabilization replicated, because the second length-matched candidate avoided full high collapse.

Caveat:

> The replication candidate landed very close to the high boundary and carried both `NEAR_COLLAPSE_HIGH` and `BOUNDARY_UNCERTAIN_HIGH`.

## 4. Mechanism synthesis

The strongest current mechanism reading is:

> Hindi `/i/` is length-sensitive and target-shape-sensitive, but remains high-boundary stressed.

More precise synthesis:

1. The original main target repeatedly returns near-boundary `COLLAPSED_HIGH`.
2. The alternate target repeatedly returns `INTERMEDIATE`.
3. The long-`ee` high anchor increases high-collapse pressure.
4. Replacing long-`ee` with short-`i` reduces pressure.
5. Target/high-anchor shape mismatch, especially token length, is a major contributor.
6. Two independent length-matched targets returned `INTERMEDIATE`.
7. The second length-matched target returned a very high-edge `INTERMEDIATE`.
8. Therefore, length matching is a real stabilizing factor, but not a full explanation.

## 5. Current classification

Recommended current classification:

> Hindi `/i/`: length-sensitive high-boundary pressure case.

Not recommended:

- support case;
- solved case;
- clean falsification case;
- clean stabilization case;
- publication-ready final conclusion.

## 6. Why this is not a simple win

The evidence is not a simple win because:

- the original main target repeatedly collapses high;
- the first length-matched candidate still has `BOUNDARY_UNCERTAIN_HIGH`;
- the replication candidate has both `NEAR_COLLAPSE_HIGH` and `BOUNDARY_UNCERTAIN_HIGH`;
- the replication candidate is only `0.028333` from the high boundary;
- the alternate target is cleaner than both length-matched candidates;
- `series-diagnostics.json` was absent in both length-matched evidence packs;
- exported provenance for the result packs was `openai` / `chatgpt-assisted-researcher-reviewed`.

## 7. What the evidence does support

Allowed mechanism claims:

- Hindi `/i/` pressure is sensitive to high-anchor geometry.
- Long-`ee` high-anchor tokens increase high-collapse pressure.
- Short-`i` high anchors reduce high-collapse pressure.
- Target/high-anchor token-shape mismatch is a major pressure source.
- Mean token length is a major target-shape variable.
- Length matching repeatedly moved Hindi `/i` candidate lanes away from full high collapse.
- Hindi `/i/` remains high-boundary stressed after length matching.
- Additional target-internal lexical/shape variables remain active.

## 8. What the evidence does not support

Blocked claims:

- Do not claim Hindi `/i/` supports `V6-V7`.
- Do not claim length matching solves Hindi `/i/`.
- Do not claim token length is the only mechanism.
- Do not claim the model is confirmed.
- Do not claim the model is falsified.
- Do not claim the replication is clean/stable.
- Do not publish this as final evidence.
- Do not update README from this synthesis alone.

## 9. Recommended next work

Recommended next work:

> Stop adding ad hoc Hindi `/i/` buckets. Use this synthesis as the current mechanism boundary.

If more testing is needed, predeclare a narrower mechanism question first.

Possible future mechanism questions:

1. Does open-final versus closed-final distribution explain why the alternate target is cleaner?
2. Does short-`i` marker density explain why the replication candidate is high-edge?
3. Does max token length `7` create high-edge pressure even when mean length is matched?
4. Does replacing high-edge lexical items inside the replication candidate lower boundary stress?

Do not run those tests until each question has its own design doc and curation gate.

## 10. Publication posture

Publication posture:

> Not ready for publication as final Hindi `/i/` evidence.

Acceptable future wording:

> Hindi `/i/` shows repeatable sensitivity to target/high-anchor token geometry. Length matching prevents full high collapse in two independent candidate buckets, but the replication remains near the high boundary. The lane should be treated as length-sensitive and high-boundary stressed, not as bracket support.

## 11. Claim boundaries

Allowed:

- This synthesis summarizes repo-tracked evidence only.
- Hindi `/i/` is length-sensitive.
- Hindi `/i/` is high-boundary stressed.
- Length matching is a major stabilizing factor.
- The anti-collapse effect replicated at the verdict level.
- The replication is not clean/stable.
- Additional target-internal lexical/shape variables remain active.

Blocked:

- Do not claim Hindi `/i/` supports `V6-V7`.
- Do not claim length matching solves Hindi `/i/`.
- Do not claim token length is the only mechanism.
- Do not claim the model is confirmed or falsified.
- Do not change scorer math.
- Do not change anchor doctrine.
- Do not update README.
- Do not publish this as final evidence.
