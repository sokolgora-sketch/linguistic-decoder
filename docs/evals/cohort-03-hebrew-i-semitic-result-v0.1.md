# Cohort 03 Hebrew `/i/` Semitic Result v0.1

Status: SEMITIC PHASE B `/i/` EVIDENCE PACK RECORDED
Project: ZË-RO
Milestone: Cohort 03
Phase: Semitic Phase B
Case: Hebrew `/i/`
Date recorded: 2026-05-19

This document records the Hebrew `/i/` high-region Semitic evidence pack.

It records one ChatGPT-assisted, researcher-reviewed Hebrew `/i/` token pack using broad Latin transliteration.

It does not complete Semitic Phase B.
It does not complete Cohort 03.
It does not publish anything.
It does not update README.
It does not claim the full ZË-RO framework is proven.

## 1. Design reference

Design doc:

- `docs/evals/cohort-03-semitic-phase-b-design-v0.1.md`

Prior Semitic `/a/` summary:

- `docs/evals/cohort-03-semitic-phase-b-a-summary-v0.1.md`

Case:

- Hebrew `/i/`

Bracket comparison:

- candidate: `V5-V7`
- control: `V4-V7`

Series label:

- `cohort03-he-i-v5-v7-semitic-v0.1`

## 2. Evidence pack

Evidence pack filename:

- `evals.series-evidence-pack.cohort03-he-i-v5-v7-semitic-v0.1.v0.1.zip`

Evidence pack SHA256:

- `f6221c899476fd97f35d67849eebbbbe755fc8a0cddb156d394bd6db4b48af9d`

Evidence pack export timestamp:

- `2026-05-19T09:08:29.246Z`

Series metadata:

- `seriesLabel`: `cohort03-he-i-v5-v7-semitic-v0.1`
- `targetCount`: `4`
- `scoredRunCount`: `4`

Curation source:

- provider: `openai`
- model: `chatgpt-assisted-researcher-reviewed`
- sourceEngine fields: blank / not used

Token convention:

- broad Latin transliteration;
- no Hebrew script;
- no diacritics;
- no apostrophes;
- no hyphens;
- no spaces;
- no proper names;
- lexical words only, not abstract consonantal roots.

## 3. Run results

| Ordinal | Run ID | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---:|---|---|---|---:|---:|---:|---|
| 1 | `cohort03-he-i-v5-v7-semitic-main-r01` | `V5-V7` | `COLLAPSED_HIGH` | `5.815385` | `0.63` | `-0.521667` | `none` |
| 2 | `cohort03-he-i-v5-v7-semitic-alt-r01` | `V5-V7` | `COLLAPSED_HIGH` | `11.857143` | `0.276667` | `-0.253333` | `none` |
| 3 | `cohort03-he-i-v4-v7-control-main-r01` | `V4-V7` | `COLLAPSED_HIGH` | `-155.5` | `0.518333` | `-0.521667` | `none` |
| 4 | `cohort03-he-i-v4-v7-control-alt-r01` | `V4-V7` | `COLLAPSED_HIGH` | `-14.2` | `0.236667` | `-0.253333` | `none` |

## 4. Interpretation

Hebrew `/i/` does not support the planned `V5-V7` high-region Semitic bracket.

Reason:

- both `V5-V7` candidate runs returned `COLLAPSED_HIGH`;
- both `V4-V7` controls also returned `COLLAPSED_HIGH`;
- the wider `V4-V7` control did not stabilize Hebrew `/i/`;
- no run returned `INTERMEDIATE`;
- no diagnostic flags were reported.

Recommended wording:

> Hebrew `/i/` Cohort 03 Semitic Phase B does not support `V5-V7`. Both `V5-V7` candidate runs collapsed high, and both `V4-V7` controls also collapsed high. The wider `V4-V7` control does not stabilize the case. Together with Arabic `/i/`, this records Semitic high-region pressure / anchor-instability, not support.

## 5. Claim boundaries

Allowed:

- Hebrew `/i/` has one recorded Cohort 03 Semitic Phase B evidence pack.
- Hebrew `/i/` candidate and control brackets all collapsed high.
- Hebrew `/i/` is high-region pressure / anchor-instability under this token pack.
- Hebrew `/i/` does not support `V5-V7`.

Blocked:

- Do not claim Semitic Phase B is complete.
- Do not claim Cohort 03 is complete.
- Do not claim Hebrew validates the framework.
- Do not claim Hebrew `/i/` supports `V5-V7`.
- Do not publish or update README from this result alone.
- Do not say the full ZË-RO framework is proven.
