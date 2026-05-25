# Cohort 04 Hindi `/i/` Open-Final Mechanism Synthesis v0.1

Status: internal mechanism synthesis  
Scope: documentation only  
Date recorded: 2026-05-25

## 1. Purpose

This document synthesizes the Cohort 04 Hindi `/i/` final-shape evidence after two completed evidence packs:

1. the open-final / closed-final final-shape pack;
2. the open-final replication pack.

The synthesis question is:

> What did Cohort 04 establish mechanistically about Hindi `/i/` high-boundary pressure?

## 2. Source documents

Primary result documents:

- `docs/evals/cohort-04-hi-i-open-final-closed-final-result-v0.1.md`
- `docs/evals/cohort-04-hi-i-open-final-replication-result-v0.1.md`

Supporting design and curation documents:

- `docs/evals/cohort-04-hi-i-open-final-closed-final-design-v0.1.md`
- `docs/evals/cohort-04-hi-i-open-final-closed-final-curation-instructions-v0.1.md`
- `docs/evals/cohort-04-hi-i-open-final-closed-final-curation-result-v0.1.md`
- `docs/evals/cohort-04-hi-i-open-final-replication-design-v0.1.md`
- `docs/evals/cohort-04-hi-i-open-final-replication-curation-instructions-v0.1.md`
- `docs/evals/cohort-04-hi-i-open-final-replication-curation-result-v0.1.md`

## 3. Background

Cohort 03 left Hindi `/i/` as a high-boundary pressure case.

The strongest working reading before Cohort 04 was:

> Hindi `/i/` is not simply solved by length matching; token geometry remains active.

Cohort 04 narrowed the question to final shape:

> Does open-final versus closed-final distribution change high-boundary pressure when mean token length is held close?

## 4. Evidence pack 1 — final-shape comparison

Evidence ZIP:

- `evals.series-evidence-pack.cohort04-hi-i-open-final-closed-final-v0.1.v0.1.zip`

SHA256:

- `9e6904f18f65a25a505ce92bd8e55bb57dcb95520e0d4322ebf28ea572a287ef`

Result table:

| Run | Lane | Verdict | normalizedPosition | gap_high | Flags |
|---|---|---|---:|---:|---|
| 1 | baseline reference | `INTERMEDIATE` | 0.706522 | 0.135 | `BOUNDARY_UNCERTAIN_HIGH` |
| 2 | open-final controlled | `INTERMEDIATE` | 0.608696 | 0.18 | none |
| 3 | closed-final controlled | `INTERMEDIATE` | 0.706522 | 0.135 | `BOUNDARY_UNCERTAIN_HIGH` |
| 4 | mixed-final balanced | `INTERMEDIATE` | 0.706522 | 0.135 | `BOUNDARY_UNCERTAIN_HIGH` |

Primary result:

> Open-final distribution reduced high-boundary pressure in this Hindi `/i/` pack.

The open-final controlled lane was the only lane without `BOUNDARY_UNCERTAIN_HIGH`.

## 5. Evidence pack 2 — open-final replication

Evidence ZIP:

- `evals.series-evidence-pack.cohort04-hi-i-open-final-replication-v0.1.v0.1.zip`

SHA256:

- `9cd4a2934ca3a1fedd5e50115d4e930813f495775b7acb4ae91a40933bf2a82a`

Result table:

| Run | Lane | Verdict | normalizedPosition | gap_high | Flags |
|---|---|---|---:|---:|---|
| 1 | prior open-final reference | `INTERMEDIATE` | 0.608696 | 0.18 | none |
| 2 | open-final replication A | `INTERMEDIATE` | 0.626812 | 0.171667 | none |
| 3 | open-final replication B | `INTERMEDIATE` | 0.673913 | 0.15 | none |
| 4 | closed-final stress reference | `INTERMEDIATE` | 0.706522 | 0.135 | `BOUNDARY_UNCERTAIN_HIGH` |

Primary result:

> The open-final pressure-reduction effect replicated in this Cohort 04 Hindi `/i/` pack.

Both independently curated open-final replication lanes stayed `INTERMEDIATE` with no diagnostic flags.

The closed-final reference repeated `BOUNDARY_UNCERTAIN_HIGH`.

## 6. Combined mechanism reading

Cohort 04 supports this internal mechanism reading:

> Open-final distribution is a repeatable pressure-reducing variable in this Hindi `/i/` setup.

The mechanism signal is not just one clean open-final run.

It appears across:

1. original open-final controlled target;
2. repeated open-final reference;
3. independent open-final replication A;
4. independent open-final replication B.

Across both evidence packs, the closed-final comparator remained high-boundary stressed.

## 7. What changed from Cohort 03

Cohort 03 said:

> Hindi `/i/` remains a high-boundary pressure case after length matching.

Cohort 04 refines that:

> Hindi `/i/` pressure is partly sensitive to final-shape token geometry. Open-final-heavy buckets reduce high-boundary pressure; closed-final-heavy buckets retain high-boundary stress.

This does not erase Cohort 03 pressure.

It explains one mechanism inside that pressure.

## 8. Allowed claims

Allowed internal claims:

- Cohort 04 completed two Hindi `/i/` final-shape evidence packs.
- Both packs returned all `INTERMEDIATE` verdicts.
- Open-final-heavy Hindi `/i/` buckets repeatedly avoided high-boundary diagnostic flags.
- Closed-final Hindi `/i/` references repeatedly produced `BOUNDARY_UNCERTAIN_HIGH`.
- Open-final distribution reduced high-boundary pressure in the first pack.
- The open-final pressure-reduction effect replicated in the second pack.
- Final-shape distribution is a serious mechanism variable for Hindi `/i/`.

## 9. Blocked claims

Blocked claims:

- Do not claim open-final distribution solves Hindi `/i/`.
- Do not claim Hindi `/i/` supports `V6-V7`.
- Do not claim final-shape distribution is proven globally.
- Do not claim Cohort 04 is publication-ready.
- Do not publish this as public evidence.
- Do not update README with Cohort 04 claims.
- Do not frame this as a universal phonological law.

## 10. Publication boundary

Cohort 04 is stronger than a single exploratory test, but it is still an internal mechanism package.

It is not ready for public publication by itself because:

- it focuses on one language and one vowel case;
- all data are broad-Latin token buckets, not acoustic measurements;
- the evidence isolates one mechanism variable, not the whole high-region model;
- the result needs synthesis with Cohort 03 before any public claim.

Current status:

> Internal mechanism evidence, not publication-ready.

## 11. Recommended next action

Recommended next action:

> Stop additional Cohort 04 eval runs and write a broader internal Cohort 03/04 high-region mechanism synthesis.

Reason:

- Cohort 03 established pressure.
- Cohort 04 isolated and replicated one pressure-reducing variable.
- More Hindi `/i/` runs now risk overfitting the same case.
- The next valuable step is interpretation, not more scoring.

## 12. Future research options

Possible future lanes, only after a separate design doc:

1. test the same open-final targets against a revised high-region bracket;
2. compare Hindi `/i/` with another language showing high-boundary pressure;
3. create an acoustic/VoiceLab bridge for final-shape effects;
4. write a Cohort 03/04 internal mechanism paper draft.

## 13. Final synthesis

Cohort 04 establishes that Hindi `/i/` high-boundary pressure is not random noise.

The pressure responds systematically to target-bucket final shape.

Open-final-heavy buckets repeatedly reduce high-boundary stress.

Closed-final-heavy buckets repeatedly preserve it.

That makes final shape a real mechanism variable inside the ZË-RO bracket battery.
