# Cohort 03 High-Region Hindi `/i` Audit Result v0.1

Status: AUDIT RESULT RECORDED
Project: ZË-RO
Milestone: Cohort 03
Target: Hindi `/i`
Date recorded: 2026-05-19

This document records the first high-region audit result under:

- `docs/evals/cohort-03-high-region-anchor-review-v0.1.md`
- `docs/evals/cohort-03-high-region-audit-protocol-v0.1.md`
- `docs/evals/cohort-03-high-region-audit-design-v0.1.md`

It compares:

- Arm A: current-lens reproduction
- Arm B: function-matched target audit

It does not claim support.
It does not claim the high-region issue is solved.
It does not change scoring code.
It does not change bracket rules.
It does not update README.
It does not publish anything.

## 1. Audit purpose

The audit tested whether Hindi `/i` high-region collapse was mainly caused by broad target-function mixing.

Audit logic:

- If Arm A collapses but Arm B stabilizes, broad target-function mixing is likely.
- If Arm A and Arm B both collapse in both `V5-V7` and `V4-V7`, scorer sensitivity / high-anchor suction or hard high-region model pressure remains likely.

## 2. Evidence packs

| Arm | Series | Evidence pack | SHA256 | Export timestamp |
|---|---|---|---|---|
| Arm A | `cohort03-hi-i-highregion-audit-arm-a-current-lens-v0.1` | `evals.series-evidence-pack.cohort03-hi-i-highregion-audit-arm-a-current-lens-v0.1.v0.1.zip` | `4448d7f93726ebb559ea67d805894a9aaedd72c294688883f51e18dadb811f3d` | `2026-05-19T14:56:42.946Z` |
| Arm B | `cohort03-hi-i-highregion-audit-arm-b-function-matched-v0.1` | `evals.series-evidence-pack.cohort03-hi-i-highregion-audit-arm-b-function-matched-v0.1.v0.1.zip` | `653d3e076aed9fe905d90cd046cde3bd721779caa4c851faf3d5e81907a92b10` | `2026-05-19T15:10:51.304Z` |

Curation source:

- provider: `openai`
- model: `chatgpt-assisted-researcher-reviewed`
- sourceEngine fields: blank / not used

## 3. Arm A result

Arm A purpose:

- reproduce the prior Hindi `/i` pressure pattern using the current anchor logic;
- keep the target bucket function-mixed by design;
- document token functions explicitly.

| Ordinal | Run ID | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---:|---|---|---|---:|---:|---:|---|
| 1 | `cohort03-hi-i-audit-a-v5-v7-main-r01` | `V5-V7` | `COLLAPSED_HIGH` | `4.621212` | `0.508333` | `-0.398333` | `none` |
| 2 | `cohort03-hi-i-audit-a-v5-v7-alt-r01` | `V5-V7` | `COLLAPSED_HIGH` | `1.639785` | `0.508333` | `-0.198333` | `none` |
| 3 | `cohort03-hi-i-audit-a-v4-v7-control-main-r01` | `V4-V7` | `COLLAPSED_HIGH` | `5.686275` | `0.483333` | `-0.398333` | `none` |
| 4 | `cohort03-hi-i-audit-a-v4-v7-control-alt-r01` | `V4-V7` | `COLLAPSED_HIGH` | `1.550926` | `0.558333` | `-0.198333` | `none` |

Arm A interpretation:

- Arm A reproduced the prior pressure pattern.
- Both `V5-V7` candidates collapsed high.
- Both `V4-V7` controls also collapsed high.
- No diagnostic flags appeared.

## 4. Arm B result

Arm B purpose:

- narrow the target bucket to common concrete entity nouns;
- test whether function-matching stabilizes Hindi `/i`;
- keep brackets identical to Arm A.

| Ordinal | Run ID | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---:|---|---|---|---:|---:|---:|---|
| 1 | `cohort03-hi-i-audit-b-v5-v7-main-r01` | `V5-V7` | `COLLAPSED_HIGH` | `2.589744` | `0.505` | `-0.31` | `none` |
| 2 | `cohort03-hi-i-audit-b-v5-v7-alt-r01` | `V5-V7` | `COLLAPSED_HIGH` | `2.44` | `0.61` | `-0.36` | `none` |
| 3 | `cohort03-hi-i-audit-b-v4-v7-control-main-r01` | `V4-V7` | `COLLAPSED_HIGH` | `2.9375` | `0.47` | `-0.31` | `none` |
| 4 | `cohort03-hi-i-audit-b-v4-v7-control-alt-r01` | `V4-V7` | `COLLAPSED_HIGH` | `2.107692` | `0.685` | `-0.36` | `none` |

Arm B interpretation:

- Arm B did not stabilize Hindi `/i`.
- Both `V5-V7` candidates collapsed high.
- Both `V4-V7` controls also collapsed high.
- No diagnostic flags appeared.

## 5. Arm A vs Arm B comparison

| Audit question | Result |
|---|---|
| Did current-lens reproduction repeat collapse? | Yes. Arm A collapsed high in all four runs. |
| Did function-matching stabilize the target bucket? | No. Arm B also collapsed high in all four runs. |
| Did widening from `V5` to `V4` stabilize either arm? | No. `V4-V7` controls also collapsed high. |
| Did diagnostic flags explain the result? | No. All runs reported `none`. |

## 6. Interpretation

The Hindi `/i` audit does not support the idea that broad target-function mixing is the primary cause of collapse.

Reason:

- Arm A collapsed high in both candidate and control brackets.
- Arm B also collapsed high in both candidate and control brackets.
- Arm B narrowed the target bucket to concrete entity nouns, but collapse persisted.
- `V4-V7` did not stabilize either arm.
- No diagnostic flags appeared.

Best current interpretation:

> Hindi `/i` high-region collapse is not primarily explained by broad target-function mixing. The repeated collapse across Arm A and Arm B points toward scorer sensitivity / high-anchor suction or hard high-region model pressure. Bracket geometry remains under suspicion because widening from `V5` to `V4` did not stabilize the target.

## 7. Research consequence

This audit strengthens the high-region review finding.

Current consequence:

- keep high/front `V5-V7` support claims frozen;
- do not run more blind high-region support tests;
- do not treat Hindi `/i` as support for any bracket;
- next work should inspect scoring diagnostics or design a high-anchor contamination-removal audit.

Recommended next technical direction:

1. add or design a collapse sub-diagnosis for high-anchor suction;
2. run a future Arm C only after a design update;
3. consider comparing high-anchor tokens with and without target-vowel contamination.

## 8. Claim boundaries

Allowed:

- Hindi `/i` audit Arm A and Arm B are recorded.
- Arm A and Arm B both collapsed high in all runs.
- Function-matching did not stabilize Hindi `/i`.
- Broad target-function mixing is not the primary explanation under this audit.
- Scorer sensitivity / high-anchor suction or hard high-region model pressure remains likely.

Blocked:

- Do not claim Hindi `/i` supports `V5-V7`.
- Do not claim Hindi `/i` supports `V4-V7`.
- Do not claim the high-region issue is solved.
- Do not claim the full ZË-RO framework is proven.
- Do not update README from this result alone.
- Do not publish this result as final framework proof.
- Do not change scoring code from this result alone.
