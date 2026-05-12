# Cohort 02 Danish Cross-Model Replication Batch v0.1

Status: INTERNAL RESULT RECORD
Project: ZË-RO
Cohort: Cohort 02
Case: Danish `/ø/`
Task: `T5_INTERMEDIATE_V0_1`
Candidate bracket: V1-V3
Control bracket: V2-V5
Date recorded: 2026-05-12

This document records a cross-model replication batch for the Danish `/ø/` Cohort 02 low-edge front-rounded support case.

It is a repo evidence note, not a new publication. It does not update README, Zenodo, LingBuzz, registry labels, or public claims.

## 1. Purpose

Danish `/ø/` was classified in Cohort 02 as cautious V1-V3 support.

The original researcher-reviewed Cohort 02 result showed:

- V1-V3 candidate runs: INTERMEDIATE x2
- V2-V5 control runs: INTERMEDIATE x2 with weaker lower margins

This means Danish is not a categorical control-collapse case like French `/ø~œ/`. It is a cleaner-provisional-support case: V1-V3 should remain cleaner and more central than V2-V5 controls.

This batch tests whether the same relative V1-V3 over V2-V5 pattern is preserved under independent assistant-assisted, researcher-reviewed token curation.

## 2. Source batches

The batch includes three external-source, researcher-reviewed replication series:

| Source | Provider | Model label | Series ID |
|---|---|---|---|
| Claude-assisted | `anthropic` | `claude-assisted-researcher-reviewed` | `t5-da-oe-v1-v3-claude-assisted-researcher-reviewed-v0.1` |
| Grok-assisted | `xai` | `grok-assisted-researcher-reviewed` | `t5-da-oe-v1-v3-grok-assisted-researcher-reviewed-v0.1` |
| DeepSeek-assisted | `deepseek` | `deepseek-assisted-researcher-reviewed` | `t5-da-oe-v1-v3-deepseek-assisted-researcher-reviewed-v0.1` |

## 3. Evidence packs

| Source | Evidence pack | SHA256 |
|---|---|---|
| Claude | `evals.series-evidence-pack.Danish_Claude-assisted_researcher-reviewed_cross-model_replication_v0.1.v0.1.zip` | `4bcf0bbd081116730e676efc39448e4dfd34732c6024bb73714e0cf52ef7974a` |
| Grok | `evals.series-evidence-pack.Danish_Grok-assisted_researcher-reviewed_cross-model_replication_v0.1.v0.1.zip` | `0dc7cc6579e07208c322773e45c8a0cf25a6c46c47e3750a3ecba37f65ee59e9` |
| DeepSeek | `evals.series-evidence-pack.Danish_DeepSeek-assisted_researcher-reviewed_cross-model_replication_v0.1.v0.1 (1).zip` | `e3c90bf81a2a39299c6edc3a42a1ed097504ada56901b346c71756cc54e50575` |

## 4. Batch summary

| Source | Candidate V1-V3 | Control V2-V5 | Interpretation |
|---|---|---|---|
| Claude-assisted | INTERMEDIATE x2 | INTERMEDIATE x2 | Supportive relative separation |
| Grok-assisted | INTERMEDIATE x2 | INTERMEDIATE x2 with low-boundary flags x2 | Stronger cleaner-provisional support |
| DeepSeek-assisted | INTERMEDIATE x2 | INTERMEDIATE x2, one near low collapse | Supportive cleaner-provisional support |

## 5. Run-level summary

### 5.1 Claude-assisted researcher-reviewed

| Run | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---|---|---|---:|---:|---:|---|
| r01 | V1-V3 | INTERMEDIATE | 0.550000 | 0.220000 | 0.180000 | none |
| r02 | V1-V3 | INTERMEDIATE | 0.454545 | 0.125000 | 0.150000 | none |
| r03 | V2-V5 | INTERMEDIATE | 0.306122 | 0.150000 | 0.340000 | none |
| r04 | V2-V5 | INTERMEDIATE | 0.219512 | 0.090000 | 0.320000 | none |

### 5.2 Grok-assisted researcher-reviewed

| Run | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---|---|---|---:|---:|---:|---|
| r01 | V1-V3 | INTERMEDIATE | 0.600000 | 0.240000 | 0.160000 | none |
| r02 | V1-V3 | INTERMEDIATE | 0.600000 | 0.240000 | 0.160000 | none |
| r03 | V2-V5 | INTERMEDIATE | 0.050000 | 0.020000 | 0.380000 | NEAR_COLLAPSE_LOW, BOUNDARY_UNCERTAIN_LOW |
| r04 | V2-V5 | INTERMEDIATE | 0.090909 | 0.040000 | 0.400000 | NEAR_COLLAPSE_LOW, BOUNDARY_UNCERTAIN_LOW |

### 5.3 DeepSeek-assisted researcher-reviewed

| Run | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---|---|---|---:|---:|---:|---|
| r01 | V1-V3 | INTERMEDIATE | 0.550000 | 0.220000 | 0.180000 | none |
| r02 | V1-V3 | INTERMEDIATE | 0.575000 | 0.230000 | 0.170000 | none |
| r03 | V2-V5 | INTERMEDIATE | 0.025000 | 0.010000 | 0.390000 | NEAR_COLLAPSE_LOW, BOUNDARY_UNCERTAIN_LOW |
| r04 | V2-V5 | INTERMEDIATE | 0.269231 | 0.140000 | 0.380000 | none |

## 6. Interpretation

Across all three assistant-reviewed replication sources, the V1-V3 candidate bracket remained stable:

- Claude-assisted: INTERMEDIATE x2, no flags
- Grok-assisted: INTERMEDIATE x2, no flags
- DeepSeek-assisted: INTERMEDIATE x2, no flags

The V2-V5 control bracket also remained technically INTERMEDIATE, but was weaker and often lower-edge stressed:

- Claude-assisted: INTERMEDIATE x2, lower normalizedPosition than V1-V3 candidates
- Grok-assisted: INTERMEDIATE x2, both controls flagged NEAR_COLLAPSE_LOW and BOUNDARY_UNCERTAIN_LOW
- DeepSeek-assisted: INTERMEDIATE x2, one control near low collapse with NEAR_COLLAPSE_LOW and BOUNDARY_UNCERTAIN_LOW

This supports the Danish `/ø/` low-edge front-rounded refinement pattern as a relative separation result.

The strongest statement supported by this batch is:

> Danish `/ø/` shows cross-model stability for a cleaner V1-V3 candidate bracket over V2-V5 controls. The V2-V5 controls do not categorically collapse, but they are consistently weaker or lower-boundary stressed compared with the clean V1-V3 candidate runs.

## 7. Claim boundaries

Allowed:

- Danish `/ø/` has cross-model cleaner-provisional support for V1-V3 over V2-V5.
- The Danish low-edge front-rounded case is strengthened by this batch.
- The V1-V3 candidate bracket remained clean INTERMEDIATE in all six candidate runs across the three source batches.
- V2-V5 controls remained INTERMEDIATE but were weaker, lower-positioned, or low-boundary stressed.

Blocked:

- Danish `/ø/` categorically falsifies V2-V5.
- Danish `/ø/` proves the full ZË-RO framework.
- Danish `/ø/` validates all front-rounded vowels.
- V2-V5 controls collapsed.
- This should be promoted to a public claim without a publication/archive decision.
- This removes the need for acoustic bridge testing.

## 8. Publication status

Current status:

- Local evidence packs exist.
- Repo result note exists after this PR.
- No new Zenodo upload.
- No LingBuzz update.
- No README update.
- No registry migration.

Recommended next step:

- Keep this as internal evidence unless bundled with the French cross-model batch or a later front-rounded supplement.
- If public, frame Danish as cleaner-provisional support, not categorical separation.

## 9. Completion criteria

This result note is complete when:

- the batch result doc is merged;
- all three evidence pack hashes are recorded;
- all source labels are recorded;
- all run-level outcomes are recorded;
- gates pass.
