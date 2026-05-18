# Cohort 03 Finnish `/ö/` Bridge Result v0.1

Status: FINNISH PHASE A EVIDENCE PACK RECORDED
Project: ZË-RO
Milestone: Cohort 03
Phase: Finnish Phase A bridge
Case: Finnish `/ö/`
Date recorded: 2026-05-18

This document records the Cohort 03 Finnish `/ö/` bridge evidence pack.

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

- Finnish `/ö/` mid front-rounded bridge

Planned bracket comparison:

- candidate: `V1-V3`
- control: `V2-V5`

Planned series label:

- `cohort03-fi-oe-v1-v3-bridge-v0.1`

Interpretation target from design:

- If `V1-V3` is cleaner than `V2-V5`, classify as lower front-rounded bridge evidence.
- If `V2-V5` is cleaner, classify as mid/front-rounded pressure against the lower placement.
- If both remain intermediate, classify as weak bridge and do not overstate.

## 2. Evidence pack

Evidence pack filename:

- `evals.series-evidence-pack.cohort03-fi-oe-v1-v3-bridge-v0.1.v0.1.zip`

Evidence pack SHA256:

- `f112e9dd8319abfc34376868567f72e5f447edeeaa976b7d149f9c35aa82fdec`

Evidence pack export timestamp:

- `2026-05-18T13:23:38.336Z`

Series metadata:

- `seriesLabel`: `cohort03-fi-oe-v1-v3-bridge-v0.1`
- `targetCount`: `4`
- `scoredRunCount`: `4`

Curation source:

- provider: `openai`
- model: `chatgpt-assisted-researcher-reviewed`
- sourceEngine fields: blank / not used

## 3. Run results

| Ordinal | Run ID | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---:|---|---|---|---:|---:|---:|---|
| 1 | `cohort03-fi-oe-v1-v3-bridge-main-r01` | `V1-V3` | `INTERMEDIATE` | `0.371875` | `0.2975` | `0.5025` | `none` |
| 2 | `cohort03-fi-oe-v1-v3-bridge-alt-r01` | `V1-V3` | `INTERMEDIATE` | `0.368298` | `0.263333` | `0.451667` | `none` |
| 3 | `cohort03-fi-oe-v2-v5-control-main-r01` | `V2-V5` | `INTERMEDIATE` | `0.007389` | `0.0025` | `0.335833` | `NEAR_COLLAPSE_LOW`, `BOUNDARY_UNCERTAIN_LOW` |
| 4 | `cohort03-fi-oe-v2-v5-control-alt-r01` | `V2-V5` | `INTERMEDIATE` | `0.219178` | `0.08` | `0.285` | `BOUNDARY_UNCERTAIN_LOW` |

## 4. Interpretation

The Finnish `/ö/` Cohort 03 pack supports a lower front-rounded `V1-V3` bridge classification under this token set, but the support is weaker than the Finnish `/ä/` pack because the controls did not fully exceed low.

Reason:

- both `V1-V3` candidate runs returned clean `INTERMEDIATE`;
- both candidate runs carried no diagnostic flags;
- both `V2-V5` control runs also returned `INTERMEDIATE`;
- both control runs carried low-boundary stress;
- control main was near low collapse with `NEAR_COLLAPSE_LOW` and `BOUNDARY_UNCERTAIN_LOW`;
- control alt carried `BOUNDARY_UNCERTAIN_LOW`.

Recommended wording:

> Finnish `/ö/` Cohort 03 Phase A shows clean `V1-V3` containment in both candidate runs, while `V2-V5` controls remain `INTERMEDIATE` but carry low-boundary stress. This supports a lower front-rounded `V1-V3` bridge classification for Finnish `/ö/` in this pack, with weaker control separation than Finnish `/ä/`.

## 5. Relation to Finnish `/ä/`

Finnish `/ä/` produced cleaner separation:

- `/ä/` candidate `V1-V3`: clean `INTERMEDIATE`;
- `/ä/` control `V2-V3`: `EXCEEDS_LOW` with `BOUNDARY_UNCERTAIN_LOW`.

Finnish `/ö/` is weaker:

- `/ö/` candidate `V1-V3`: clean `INTERMEDIATE`;
- `/ö/` control `V2-V5`: `INTERMEDIATE` with low-boundary stress.

This means `/ö/` should be recorded as lower front-rounded bridge evidence, not as a decisive separation case.

## 6. Claim boundaries

Allowed:

- Finnish `/ö/` has one recorded Cohort 03 evidence pack.
- This pack supports `V1-V3` over `V2-V5` for Finnish `/ö/` as a weaker lower front-rounded bridge result.
- The result is consistent with the planned Finnish Phase A bridge design.
- The result is weaker than Finnish `/ä/` because control separation is less decisive.

Blocked:

- Do not claim Cohort 03 is complete.
- Do not claim Finnish Phase A is complete.
- Do not claim Finnish as a language validates the framework.
- Do not claim Finnish `/y/` results from this `/ö/` pack.
- Do not claim `V2-V5` fully failed.
- Do not call this result decisive.
- Do not publish or update README from this result alone.
- Do not say the full ZË-RO framework is proven.

## 7. Next step

Continue Finnish Phase A with Finnish `/y/` bridge pack:

- candidate: `V5-V7`
- control: `V2-V5`

Do not summarize Finnish Phase A until `/ä/`, `/ö/`, and `/y/` evidence packs are all recorded.
