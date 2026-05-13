# Cohort 02 Turkish Cross-Model Pressure Audit Batch v0.1

Status: INTERNAL RESULT RECORD
Project: ZË-RO
Cohort: Cohort 02
Case: Turkish `/ı/`
Task: `T5_INTERMEDIATE_V0_1`
Candidate bracket: V4-V7
Control bracket: V5-V7
Date recorded: 2026-05-13

This document records a cross-model pressure-audit batch for Turkish `/ı/`.

It is a repo evidence note, not a new publication. It does not update README, Zenodo, LingBuzz, registry labels, or public claims.

## 1. Purpose

Turkish `/ı/` is not treated as a support case.

The purpose of this batch is to test whether the unresolved high-region pressure seen in Cohort 02 persists under independent assistant-assisted, researcher-reviewed token curation.

This is a pressure audit, not a support-seeking replication.

The audit question is:

> Does V4-V7 consistently rescue Turkish `/ı/` compared with V5-V7, or does Turkish remain high-region unstable?

## 2. Source batches

The batch includes three external-source, researcher-reviewed pressure-audit series:

| Source | Provider | Model label | Series ID |
|---|---|---|---|
| Claude-assisted | `anthropic` | `claude-assisted-researcher-reviewed` | `t5-tr-ii-v4-v7-claude-assisted-researcher-reviewed-v0.1` |
| Grok-assisted | `xai` | `grok-assisted-researcher-reviewed` | `t5-tr-ii-v4-v7-grok-assisted-researcher-reviewed-v0.1` |
| DeepSeek-assisted | `deepseek` | `deepseek-assisted-researcher-reviewed` | `t5-tr-ii-v4-v7-deepseek-assisted-researcher-reviewed-v0.1` |

## 3. Evidence packs

| Source | Evidence pack | SHA256 |
|---|---|---|
| Claude | `evals.series-evidence-pack.Turkish_Claude-assisted_researcher-reviewed_cross-model_pressure_audit_v0.1.v0.1.zip` | `9fda8ff51236a38aa9ae5f4ce9e504ee2dcc383c19e003c75d8f3088d6eb04ff` |
| Grok | `evals.series-evidence-pack.Turkish_Grok-assisted_researcher-reviewed_cross-model_pressure_audit_v0.1.v0.1.zip` | `ca191962b8f093087f08f59956c3dbd3e7782de307071abb0ddc5e97c6fcc2b7` |
| DeepSeek | `evals.series-evidence-pack.Turkish_DeepSeek-assisted_researcher-reviewed_cross-model_pressure_audit_v0.1.v0.1.zip` | `b1e34556039f4c65b892068d427f0a0069b7dce0ec5212c122a4aab04bddbe42` |

## 4. Batch summary

| Source | Candidate V4-V7 | Control V5-V7 | Interpretation |
|---|---|---|---|
| Claude-assisted | COLLAPSED_HIGH x2 | COLLAPSED_HIGH x2 | Severe high-region pressure |
| Grok-assisted | INTERMEDIATE x2, one near high collapse | INTERMEDIATE x1 near high collapse + COLLAPSED_HIGH x1 | Pressure persists; V5-V7 worse |
| DeepSeek-assisted | COLLAPSED_HIGH x1 + INTERMEDIATE x1 | INTERMEDIATE x2 with high-boundary pressure | Mixed pressure; no stable rescue |

## 5. Run-level summary

### 5.1 Claude-assisted researcher-reviewed

| Run | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---|---|---|---:|---:|---:|---|
| r01 | V4-V7 | COLLAPSED_HIGH | 1.000000 | 0.720000 | 0.000000 | BOUNDARY_UNCERTAIN_HIGH |
| r02 | V4-V7 | COLLAPSED_HIGH | 1.000000 | 0.800000 | 0.000000 | BOUNDARY_UNCERTAIN_HIGH |
| r03 | V5-V7 | COLLAPSED_HIGH | 1.000000 | 0.300000 | 0.000000 | BOUNDARY_UNCERTAIN_HIGH |
| r04 | V5-V7 | COLLAPSED_HIGH | 1.000000 | 0.300000 | 0.000000 | BOUNDARY_UNCERTAIN_HIGH |

### 5.2 Grok-assisted researcher-reviewed

| Run | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---|---|---|---:|---:|---:|---|
| r01 | V4-V7 | INTERMEDIATE | 0.750000 | 0.540000 | 0.180000 | none |
| r02 | V4-V7 | INTERMEDIATE | 0.979798 | 0.485000 | 0.010000 | NEAR_COLLAPSE_HIGH, BOUNDARY_UNCERTAIN_HIGH |
| r03 | V5-V7 | INTERMEDIATE | 0.935484 | 0.290000 | 0.020000 | NEAR_COLLAPSE_HIGH, BOUNDARY_UNCERTAIN_HIGH |
| r04 | V5-V7 | COLLAPSED_HIGH | 1.161290 | 0.360000 | -0.050000 | BOUNDARY_UNCERTAIN_HIGH |

### 5.3 DeepSeek-assisted researcher-reviewed

| Run | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---|---|---|---:|---:|---:|---|
| r01 | V4-V7 | COLLAPSED_HIGH | 1.000000 | 0.740000 | 0.000000 | BOUNDARY_UNCERTAIN_HIGH |
| r02 | V4-V7 | INTERMEDIATE | 0.453237 | 0.315000 | 0.380000 | none |
| r03 | V5-V7 | INTERMEDIATE | 0.550000 | 0.165000 | 0.135000 | BOUNDARY_UNCERTAIN_HIGH |
| r04 | V5-V7 | INTERMEDIATE | 0.863636 | 0.285000 | 0.045000 | NEAR_COLLAPSE_HIGH, BOUNDARY_UNCERTAIN_HIGH |

## 6. Interpretation

Across the three assistant-reviewed pressure-audit sources, Turkish `/ı/` did not stabilize into clean support.

Claude produced the strongest pressure result:

- V4-V7 candidate: COLLAPSED_HIGH x2
- V5-V7 control: COLLAPSED_HIGH x2

Grok produced a less severe but still pressured result:

- V4-V7 candidate: INTERMEDIATE x2, one near high collapse
- V5-V7 control: one near high collapse and one COLLAPSED_HIGH

DeepSeek produced a mixed pressure result:

- V4-V7 candidate: one COLLAPSED_HIGH and one clean INTERMEDIATE
- V5-V7 control: INTERMEDIATE x2, both with high-boundary pressure

The strongest statement supported by this batch is:

> Turkish `/ı/` remains an unresolved high-region pressure case. V4-V7 does not consistently rescue the target, and V5-V7 remains high-boundary unstable.

## 7. Claim boundaries

Allowed:

- Turkish `/ı/` remains a pressure-audit case.
- Cross-model evidence does not support promoting Turkish `/ı/` to settled V4-V7 support.
- V4-V7 sometimes improves over V5-V7, but not consistently enough to stabilize the case.
- V5-V7 remains high-boundary unstable.
- Turkish `/ı/` should remain visible as framework-pressure evidence.

Blocked:

- Turkish `/ı/` is settled support.
- Turkish `/ı/` is solved by V4-V7.
- Turkish `/ı/` validates the high-region model.
- The Claude result should be ignored because it is severe.
- The Grok or DeepSeek mixed results prove support.
- The case should be promoted publicly without an archive/publication decision.

## 8. Publication status

Current status:

- Local evidence packs exist.
- Repo result note exists after this PR.
- No new Zenodo upload.
- No LingBuzz update.
- No README update.
- No registry migration.

Recommended next step:

- Keep this as internal pressure evidence unless bundled into a later pressure-audit supplement.
- If public, frame it as unresolved high-region pressure, not support.
- Use Turkish `/ı/` as a candidate for later VoiceLab/acoustic bridge investigation.

## 9. Completion criteria

This result note is complete when:

- the batch result doc is merged;
- all three evidence pack hashes are recorded;
- all source labels are recorded;
- all run-level outcomes are recorded;
- gates pass.
