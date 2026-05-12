# Cohort 02 French Cross-Model Replication Batch v0.1

Status: INTERNAL RESULT RECORD
Project: ZË-RO
Cohort: Cohort 02
Case: French `/ø~œ/`
Task: `T5_INTERMEDIATE_V0_1`
Candidate bracket: V5-V7
Control bracket: V2-V5
Date recorded: 2026-05-12

This document records a cross-model replication batch for the French `/ø~œ/` Cohort 02 support case.

It is a repo evidence note, not a new publication. It does not update README, Zenodo, LingBuzz, registry labels, or public claims.

## 1. Purpose

French `/ø~œ/` was the strongest support case in the published Cohort 02 paper.

The original researcher-reviewed Cohort 02 result showed:

- V5-V7 candidate runs: INTERMEDIATE x2
- V2-V5 control runs: COLLAPSED_HIGH x2

This batch tests whether the same candidate/control separation pattern is preserved when token buckets are curated through independent assistant sources and then researcher-reviewed.

## 2. Source batches

The batch includes four external-source, researcher-reviewed replication series:

| Source | Provider | Model label | Series ID |
|---|---|---|---|
| Claude-assisted | `anthropic` | `claude-assisted-researcher-reviewed` | `t5-fr-euoe-v5-v7-claude-assisted-researcher-reviewed-v0.1` |
| Gemini-assisted | `google` | `gemini-assisted-researcher-reviewed` | `t5-fr-euoe-v5-v7-gemini-assisted-researcher-reviewed-v0.1` |
| Grok-assisted | `xai` | `grok-assisted-researcher-reviewed` | `t5-fr-euoe-v5-v7-grok-assisted-researcher-reviewed-v0.1` |
| DeepSeek-assisted | `deepseek` | `deepseek-assisted-researcher-reviewed` | `t5-fr-euoe-v5-v7-deepseek-assisted-researcher-reviewed-v0.1` |

## 3. Evidence packs

| Source | Evidence pack | SHA256 |
|---|---|---|
| Claude | `evals.series-evidence-pack.French_Claude-assisted_researcher-reviewed_cross-model_replication_v0.1.v0.1.zip` | `9b569621dad195f2ba35803b15a50c0a2ce7955fa9219032ceb5979e260185c4` |
| Gemini | `evals.series-evidence-pack.t5-fr-euoe-v5-v7-gemini-assisted-researcher-reviewed-v0.1.v0.1.zip` | `6ae1cb2f9d5702cc86945198eb8313385bb7788a32e5fc7390efe06802a37511` |
| Grok | `evals.series-evidence-pack.t5-fr-euoe-v5-v7-grok-assisted-researcher-reviewed-v0.1.v0.1.zip` | `641f78e0ba56516bded61bed4a465d86ca5ac96a2f6aae71bced215740f334cb` |
| DeepSeek | `evals.series-evidence-pack.t5-fr-euoe-v5-v7-deepseek-assisted-researcher-reviewed-v0.1.v0.1 (1).zip` | `770dc1f9c5f2187636116153e4dee0789b828f25f23770c83ae21af6c96d9e17` |

## 4. Batch summary

| Source | Candidate V5-V7 | Control V2-V5 | Interpretation |
|---|---|---|---|
| Claude-assisted | INTERMEDIATE x2 | COLLAPSED_HIGH x2 | Clean replication |
| Gemini-assisted | INTERMEDIATE x2 | COLLAPSED_HIGH x1; INTERMEDIATE x1 near high collapse | Supportive / partial replication |
| Grok-assisted | INTERMEDIATE x2 | COLLAPSED_HIGH x2 with high-boundary uncertainty | Clean replication with boundary caution |
| DeepSeek-assisted | INTERMEDIATE x2 | COLLAPSED_HIGH x2 | Clean replication |

## 5. Run-level summary

### 5.1 Claude-assisted researcher-reviewed

| Run | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---|---|---|---:|---:|---:|---|
| r01 | V5-V7 | INTERMEDIATE | 0.177778 | 0.080000 | 0.370000 | none |
| r02 | V5-V7 | INTERMEDIATE | 0.262295 | 0.053333 | 0.150000 | none |
| r03 | V2-V5 | COLLAPSED_HIGH | 1.142857 | 0.186667 | -0.023333 | BOUNDARY_UNCERTAIN_HIGH |
| r04 | V2-V5 | COLLAPSED_HIGH | 2.371429 | 0.276667 | -0.160000 | none |

### 5.2 Gemini-assisted researcher-reviewed

| Run | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---|---|---|---:|---:|---:|---|
| r01 | V5-V7 | INTERMEDIATE | 0.209259 | 0.094167 | 0.355833 | none |
| r02 | V5-V7 | INTERMEDIATE | 0.315789 | 0.060000 | 0.130000 | none |
| r03 | V2-V5 | COLLAPSED_HIGH | 1.603846 | 0.347500 | -0.130833 | none |
| r04 | V2-V5 | INTERMEDIATE | 0.968750 | 0.103333 | 0.003333 | NEAR_COLLAPSE_HIGH, BOUNDARY_UNCERTAIN_HIGH |

### 5.3 Grok-assisted researcher-reviewed

| Run | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---|---|---|---:|---:|---:|---|
| r01 | V5-V7 | INTERMEDIATE | 0.330097 | 0.113333 | 0.230000 | none |
| r02 | V5-V7 | INTERMEDIATE | 0.320513 | 0.083333 | 0.176667 | none |
| r03 | V2-V5 | COLLAPSED_HIGH | 1.308140 | 0.187500 | -0.044167 | BOUNDARY_UNCERTAIN_HIGH |
| r04 | V2-V5 | COLLAPSED_HIGH | 1.178571 | 0.247500 | -0.037500 | BOUNDARY_UNCERTAIN_HIGH |

### 5.4 DeepSeek-assisted researcher-reviewed

| Run | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---|---|---|---:|---:|---:|---|
| r01 | V5-V7 | INTERMEDIATE | 0.150000 | 0.060000 | 0.340000 | none |
| r02 | V5-V7 | INTERMEDIATE | 0.366071 | 0.136667 | 0.236667 | none |
| r03 | V2-V5 | COLLAPSED_HIGH | 1.448718 | 0.188333 | -0.058333 | none |
| r04 | V2-V5 | COLLAPSED_HIGH | 1.579909 | 0.288333 | -0.105833 | none |

## 6. Interpretation

Across all four assistant-reviewed replication sources, the V5-V7 candidate bracket remained stable:

- Claude-assisted: INTERMEDIATE x2
- Gemini-assisted: INTERMEDIATE x2
- Grok-assisted: INTERMEDIATE x2
- DeepSeek-assisted: INTERMEDIATE x2

The V2-V5 control bracket was also generally unstable/high-collapsing:

- Claude-assisted: COLLAPSED_HIGH x2
- Gemini-assisted: COLLAPSED_HIGH x1 plus high-boundary INTERMEDIATE x1
- Grok-assisted: COLLAPSED_HIGH x2 with high-boundary uncertainty
- DeepSeek-assisted: COLLAPSED_HIGH x2

This strengthens the French `/ø~œ/` high-edge support case. The strongest statement supported by this batch is:

> French `/ø~œ/` shows cross-model stability for the V5-V7 candidate bracket across Claude-, Gemini-, Grok-, and DeepSeek-assisted researcher-reviewed token curation. The V2-V5 control bracket repeatedly collapses high or sits at the high boundary.

## 7. Claim boundaries

Allowed:

- French `/ø~œ/` has cross-model replication support for V5-V7 over V2-V5.
- The French high-edge case is stronger after this batch.
- The V5-V7 candidate bracket remained INTERMEDIATE in all eight candidate runs across the four source batches.
- The V2-V5 controls collapsed high in seven of eight control runs; the remaining Gemini control alt was high-boundary INTERMEDIATE.

Blocked:

- This batch proves the full ZË-RO framework.
- This batch validates all front-rounded vowels.
- This batch removes the need for acoustic bridge testing.
- Gemini is a failed replication.
- The Gemini r04 control should be ignored.
- The result should be immediately promoted to a public claim without a publication/archive decision.

## 8. Publication status

Current status:

- Local evidence packs exist.
- Repo result note exists after this PR.
- No new Zenodo upload.
- No LingBuzz update.
- No README update.
- No registry migration.

Recommended next step:

- Create a combined public archive only after deciding whether this cross-model batch becomes:
  - an appendix/update to Cohort 02;
  - a standalone replication note;
  - or internal evidence for a later Cohort 03 / VoiceLab bridge paper.

## 9. Completion criteria

This result note is complete when:

- the batch result doc is merged;
- all four evidence pack hashes are recorded;
- all source labels are recorded;
- all run-level outcomes are recorded;
- gates pass.
