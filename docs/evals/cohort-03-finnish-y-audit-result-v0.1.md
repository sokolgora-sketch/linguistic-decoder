# Cohort 03 Finnish `/y/` Audit Result v0.1

Status: FINNISH `/y/` AUDIT EVIDENCE PACK RECORDED
Project: ZË-RO
Milestone: Cohort 03
Phase: Finnish Phase A audit
Case: Finnish `/y/`
Date recorded: 2026-05-19

This document records the Cohort 03 Finnish `/y/` audit evidence pack.

It records one ChatGPT-assisted, researcher-reviewed audit token pack.

It does not replace the first Finnish `/y/` result.
It does not complete Cohort 03.
It does not publish anything.
It does not update README.
It does not claim the full ZË-RO framework is proven.

## 1. Prior result

Prior result document:

- `docs/evals/cohort-03-finnish-y-bridge-result-v0.1.md`

Prior series:

- `cohort03-fi-y-v5-v7-bridge-v0.1`

Prior interpretation:

- Finnish `/y/` did not support the planned `V5-V7` high front-rounded bridge bracket.
- Both `V5-V7` candidate runs collapsed high.
- Both `V2-V5` controls also collapsed high.
- The result was recorded as high-region pressure / anchor-instability.

## 2. Audit purpose

The audit tests whether Finnish `/y/` still collapses under `V5-V7` and whether a wider high-region control bracket stabilizes the result.

Audit comparison:

- candidate: `V5-V7`
- control: `V4-V7`

Audit series label:

- `cohort03-fi-y-v5-v7-audit-v0.1`

The audit should be read as a second pack, not as a replacement for the first Finnish `/y/` result.

## 3. Evidence pack

Evidence pack filename:

- `evals.series-evidence-pack.cohort03-fi-y-v5-v7-audit-v0.1.v0.1.zip`

Evidence pack SHA256:

- `066ea4fab8600da8789c6ff9c1fb2c86dd485d779717f53f4d24f8656de47697`

Evidence pack export timestamp:

- `2026-05-19T02:42:04.625Z`

Series metadata:

- `seriesLabel`: `cohort03-fi-y-v5-v7-audit-v0.1`
- `targetCount`: `4`
- `scoredRunCount`: `4`

Curation source:

- provider: `openai`
- model: `chatgpt-assisted-researcher-reviewed`
- sourceEngine fields: blank / not used

## 4. Run results

| Ordinal | Run ID | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---:|---|---|---|---:|---:|---:|---|
| 1 | `cohort03-fi-y-v5-v7-audit-main-r01` | `V5-V7` | `COLLAPSED_HIGH` | `5.714286` | `0.2` | `-0.165` | `BOUNDARY_UNCERTAIN_HIGH` |
| 2 | `cohort03-fi-y-v5-v7-audit-alt-r01` | `V5-V7` | `COLLAPSED_HIGH` | `2.087432` | `0.318333` | `-0.165833` | `BOUNDARY_UNCERTAIN_HIGH` |
| 3 | `cohort03-fi-y-v4-v7-control-main-r01` | `V4-V7` | `COLLAPSED_HIGH` | `-32` | `0.16` | `-0.165` | `BOUNDARY_UNCERTAIN_LOW`, `BOUNDARY_UNCERTAIN_HIGH` |
| 4 | `cohort03-fi-y-v4-v7-control-alt-r01` | `V4-V7` | `COLLAPSED_HIGH` | `2.496241` | `0.276667` | `-0.165833` | `BOUNDARY_UNCERTAIN_HIGH` |

## 5. Interpretation

The Finnish `/y/` audit repeats the high-collapse pattern.

Reason:

- both `V5-V7` audit candidate runs returned `COLLAPSED_HIGH`;
- both `V5-V7` audit candidate runs carried `BOUNDARY_UNCERTAIN_HIGH`;
- both `V4-V7` controls also returned `COLLAPSED_HIGH`;
- the `V4-V7` control main carried both low and high boundary uncertainty;
- the wider `V4-V7` control did not stabilize Finnish `/y/`.

Recommended wording:

> Finnish `/y/` Cohort 03 audit repeats the high-collapse pattern. Both `V5-V7` audit candidate runs collapsed high, and both `V4-V7` controls also collapsed high. The wider `V4-V7` control does not stabilize Finnish `/y/`. This strengthens the classification of Finnish `/y/` as high-region pressure / anchor-instability, not `V5-V7` support.

## 6. Relation to Finnish Phase A summary

Finnish Phase A summary document:

- `docs/evals/cohort-03-finnish-phase-a-summary-v0.1.md`

The summary classified Finnish `/y/` as:

- high-region pressure / anchor-instability;
- no `V5-V7` support.

This audit is consistent with that classification.

The audit adds a second Finnish `/y/` pack and shows that the pressure remains when the control is widened from `V2-V5` to `V4-V7`.

## 7. Claim boundaries

Allowed:

- Finnish `/y/` now has one initial result pack and one audit pack.
- The audit repeats the high-collapse pattern.
- The audit does not support `V5-V7`.
- The `V4-V7` control does not stabilize Finnish `/y/` in this pack.
- Finnish `/y/` remains a high-region pressure / anchor-instability case.

Blocked:

- Do not claim Cohort 03 is complete.
- Do not claim Finnish validates the full framework.
- Do not claim Finnish `/y/` supports `V5-V7`.
- Do not claim `V4-V7` rescues Finnish `/y/`.
- Do not claim this resolves all high-region cases.
- Do not publish or update README from this audit alone.
- Do not say the full ZË-RO framework is proven.

## 8. Next step

Recommended next step:

Move to Semitic Phase B design/execution.

Reason:

- Finnish `/ä/` is already recorded as clean lower/open-front `V1-V3` bridge support.
- Finnish `/ö/` is already recorded as weaker lower front-rounded `V1-V3` bridge support.
- Finnish `/y/` now has both an initial result and an audit result showing high-region pressure / anchor-instability.
- Additional Finnish `/y/` repetition is less useful than moving to a new family domain.

Suggested next phase:

- Arabic/Hebrew Semitic Phase B
