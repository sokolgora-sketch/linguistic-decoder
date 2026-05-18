# Cohort 03 Finnish `/y/` Bridge Result v0.1

Status: FINNISH PHASE A EVIDENCE PACK RECORDED
Project: ZË-RO
Milestone: Cohort 03
Phase: Finnish Phase A bridge
Case: Finnish `/y/`
Date recorded: 2026-05-18

This document records the Cohort 03 Finnish `/y/` bridge evidence pack.

It records one ChatGPT-assisted, researcher-reviewed token pack.

It does not complete Cohort 03.
It does not publish anything.
It does not update README.
It does not claim the full ZË-RO framework is proven.

## 1. Design reference

Design doc:

- `docs/evals/cohort-03-cross-family-design-v0.1.md`

Planned case:

- Finnish `/y/` high front-rounded bridge

Planned bracket comparison:

- candidate: `V5-V7`
- control: `V2-V5`

Planned series label:

- `cohort03-fi-y-v5-v7-bridge-v0.1`

Interpretation target from design:

- If `V5-V7` is cleaner than `V2-V5`, classify as high/front-rounded bridge evidence.
- If `V2-V5` is cleaner, classify as high-front pressure against `V5-V7`.
- If both remain intermediate, classify as weak bridge.
- Do not use Finnish `/y/` as a full-framework claim.

## 2. Evidence pack

Evidence pack filename:

- `evals.series-evidence-pack.cohort03-fi-y-v5-v7-bridge-v0.1.v0.1.zip`

Evidence pack SHA256:

- `5a5ce9a713dd9b3b708a16c503a652e4fa7f97ba02ea0255f6f9fa41f2e2d79a`

Evidence pack export timestamp:

- `2026-05-18T14:10:51.563Z`

Series metadata:

- `seriesLabel`: `cohort03-fi-y-v5-v7-bridge-v0.1`
- `targetCount`: `4`
- `scoredRunCount`: `4`

Curation source:

- provider: `openai`
- model: `chatgpt-assisted-researcher-reviewed`
- sourceEngine fields: blank / not used

## 3. Run results

| Ordinal | Run ID | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---:|---|---|---|---:|---:|---:|---|
| 1 | `cohort03-fi-y-v5-v7-bridge-main-r01` | `V5-V7` | `COLLAPSED_HIGH` | `3.942857` | `0.23` | `-0.171667` | `BOUNDARY_UNCERTAIN_HIGH` |
| 2 | `cohort03-fi-y-v5-v7-bridge-alt-r01` | `V5-V7` | `COLLAPSED_HIGH` | `4.454545` | `0.245` | `-0.19` | `BOUNDARY_UNCERTAIN_HIGH` |
| 3 | `cohort03-fi-y-v2-v5-control-main-r01` | `V2-V5` | `COLLAPSED_HIGH` | `-1.603774` | `0.141667` | `-0.23` | `BOUNDARY_UNCERTAIN_LOW` |
| 4 | `cohort03-fi-y-v2-v5-control-alt-r01` | `V2-V5` | `COLLAPSED_HIGH` | `7.125` | `0.285` | `-0.245` | `none` |

## 4. Interpretation

The Finnish `/y/` Cohort 03 pack does not support the planned `V5-V7` high front-rounded bridge bracket.

Reason:

- both `V5-V7` candidate runs returned `COLLAPSED_HIGH`;
- both candidate runs carried high-boundary uncertainty;
- both `V2-V5` control runs also returned `COLLAPSED_HIGH`;
- control main carried `BOUNDARY_UNCERTAIN_LOW`;
- control alt collapsed high with no flags.

Recommended wording:

> Finnish `/y/` Cohort 03 Phase A does not support the planned `V5-V7` high front-rounded bridge bracket in this pack. Both `V5-V7` candidate runs collapsed high, and both `V2-V5` controls also collapsed high. This should be recorded as a Finnish `/y/` high-region pressure / anchor-instability result, not as support.

## 5. Relation to Finnish `/ä/` and `/ö/`

Finnish Phase A now shows three different behaviors:

- Finnish `/ä/`: clean lower/open-front `V1-V3` bridge support under its token pack.
- Finnish `/ö/`: weaker lower front-rounded `V1-V3` bridge support under its token pack, with boundary-stressed controls.
- Finnish `/y/`: high-region pressure / anchor-instability under its token pack, with no `V5-V7` support.

This pattern is useful because Finnish Phase A does not collapse into a single blanket support result.

## 6. Claim boundaries

Allowed:

- Finnish `/y/` has one recorded Cohort 03 evidence pack.
- This pack does not support the planned `V5-V7` bracket.
- This pack records high-region pressure / anchor-instability for Finnish `/y/`.
- Finnish Phase A now has recorded packs for `/ä/`, `/ö/`, and `/y/`.

Blocked:

- Do not claim Cohort 03 is complete.
- Do not claim Finnish as a language validates the framework.
- Do not claim Finnish `/y/` supports `V5-V7`.
- Do not claim `V2-V5` rescues Finnish `/y/`.
- Do not publish or update README from this result alone.
- Do not say the full ZË-RO framework is proven.

## 7. Next step

After this result is merged, create a separate Finnish Phase A summary document comparing:

- `/ä/`
- `/ö/`
- `/y/`

Do not update README or publish from this single result.
