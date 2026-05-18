# Cohort 03 Finnish `/ä/` Bridge Result v0.1

Status: FIRST FINNISH PHASE A EVIDENCE PACK RECORDED
Project: ZË-RO
Milestone: Cohort 03
Phase: Finnish Phase A bridge
Case: Finnish `/ä/`
Date recorded: 2026-05-18

This document records the first Cohort 03 Finnish `/ä/` bridge evidence pack.

It records one ChatGPT-assisted, researcher-reviewed token pack.

It does not complete Cohort 03.
It does not complete Finnish Phase A.
It does not publish anything.
It does not update README.
It does not claim the full ZË-RO framework is proven.

## 1. Design reference

Design doc:

- `docs/evals/cohort-03-cross-family-design-v0.1.md`

Planned case:

- Finnish `/ä/` open-front bridge

Planned bracket comparison:

- candidate: `V1-V3`
- control: `V2-V3`

Planned series label:

- `cohort03-fi-ae-v1-v3-bridge-v0.1`

Interpretation target from design:

- If candidate remains cleaner than control, classify as lower/open-front bridge support.
- If both candidate and control are similar, classify as weak/unclear bridge.
- If candidate fails, classify as open-front pressure.

## 2. Evidence pack

Evidence pack filename:

- `evals.series-evidence-pack.cohort03-fi-ae-v1-v3-bridge-v0.1.v0.1.zip`

Evidence pack SHA256:

- `8c52c91c4ca378949080c76c9d2e29f5b2d82baf9488eced826581f6c0365bde`

Evidence pack export timestamp:

- `2026-05-18T11:49:49.091Z`

Series metadata:

- `seriesLabel`: `cohort03-fi-ae-v1-v3-bridge-v0.1`
- `targetCount`: `4`
- `scoredRunCount`: `4`

Curation source:

- provider: `openai`
- model: `chatgpt-assisted-researcher-reviewed`
- sourceEngine fields: blank / not used

## 3. Run results

| Ordinal | Run ID | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---:|---|---|---|---:|---:|---:|---|
| 1 | `cohort03-fi-ae-v1-v3-bridge-main-r01` | `V1-V3` | `INTERMEDIATE` | `0.320313` | `0.205` | `0.435` | `none` |
| 2 | `cohort03-fi-ae-v1-v3-bridge-alt-r01` | `V1-V3` | `INTERMEDIATE` | `0.355014` | `0.218333` | `0.396667` | `none` |
| 3 | `cohort03-fi-ae-v2-v3-control-main-r01` | `V2-V3` | `EXCEEDS_LOW` | `-0.101887` | `-0.045` | `0.486667` | `BOUNDARY_UNCERTAIN_LOW` |
| 4 | `cohort03-fi-ae-v2-v3-control-alt-r01` | `V2-V3` | `EXCEEDS_LOW` | `-0.538012` | `-0.153333` | `0.438333` | `BOUNDARY_UNCERTAIN_LOW` |

## 4. Interpretation

The first Finnish `/ä/` Cohort 03 pack supports the lower/open-front bridge classification under this token set.

Reason:

- both `V1-V3` candidate runs returned `INTERMEDIATE`;
- both candidate runs were clean, with no diagnostic flags;
- both `V2-V3` control runs returned `EXCEEDS_LOW`;
- both control runs carried `BOUNDARY_UNCERTAIN_LOW`.

Recommended wording:

> Finnish `/ä/` Cohort 03 Phase A shows clean `V1-V3` containment in both candidate runs, while both `V2-V3` controls exceed low with low-boundary uncertainty. This supports the lower/open-front `V1-V3` bridge classification for Finnish `/ä/` in this pack.

## 5. Claim boundaries

Allowed:

- Finnish `/ä/` has one recorded Cohort 03 evidence pack.
- This pack supports `V1-V3` over `V2-V3` for Finnish `/ä/`.
- This is lower/open-front bridge evidence under this token set.
- The result is consistent with the planned Finnish Phase A bridge design.

Blocked:

- Do not claim Cohort 03 is complete.
- Do not claim Finnish Phase A is complete.
- Do not claim Finnish as a language validates the framework.
- Do not claim Finnish `/ö/` or `/y/` results from this `/ä/` pack.
- Do not publish or update README from this result alone.
- Do not say the full ZË-RO framework is proven.

## 6. Next step

Continue Finnish Phase A with:

1. Finnish `/ö/` bridge pack:
   - candidate: `V1-V3`
   - control: `V2-V5`
2. Finnish `/y/` bridge pack:
   - candidate: `V5-V7`
   - control: `V2-V5`

Do not summarize Finnish Phase A until `/ä/`, `/ö/`, and `/y/` evidence packs are all recorded.
