# Cohort 03 Hindi `/i/` Indo-Iranian Result v0.1

Status: INDO-IRANIAN `/i/` EVIDENCE PACK RECORDED
Project: ZË-RO
Milestone: Cohort 03
Phase: Indo-Iranian Phase C
Case: Hindi `/i/`
Date recorded: 2026-05-19

This document records the Hindi `/i/` high-region Indo-Iranian evidence pack.

It records one ChatGPT-assisted, researcher-reviewed Hindi `/i/` token pack using broad Latin transliteration.

It does not complete Indo-Iranian Phase C.
It does not complete Cohort 03.
It does not publish anything.
It does not update README.
It does not claim the full ZË-RO framework is proven.

## 1. Context

This batch follows the Semitic Phase B `/i/` pair, where Arabic `/i/` and Hebrew `/i/` both collapsed high in candidate and control brackets.

The purpose is to test whether the same high-region pressure pattern appears in another family domain.

Case:

- Hindi `/i/`

Bracket comparison:

- candidate: `V5-V7`
- control: `V4-V7`

Series label:

- `cohort03-hi-i-v5-v7-indo-iranian-v0.1`

## 2. Evidence pack

Evidence pack filename:

- `evals.series-evidence-pack.cohort03-hi-i-v5-v7-indo-iranian-v0.1.v0.1.zip`

Evidence pack SHA256:

- `f890099992db2d1de9fafe8655212e3ff223791f284331082f4fbdfa4e54c8d9`

Evidence pack export timestamp:

- `2026-05-19T10:14:16.508Z`

Series metadata:

- `seriesLabel`: `cohort03-hi-i-v5-v7-indo-iranian-v0.1`
- `targetCount`: `4`
- `scoredRunCount`: `4`

Curation source:

- provider: `openai`
- model: `chatgpt-assisted-researcher-reviewed`
- sourceEngine fields: blank / not used

Token convention:

- broad Latin transliteration;
- no Devanagari script;
- no diacritics;
- no apostrophes;
- no hyphens;
- no spaces;
- no proper names;
- lexical words only, not abstract roots.

## 3. Run results

| Ordinal | Run ID | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---:|---|---|---|---:|---:|---:|---|
| 1 | `cohort03-hi-i-v5-v7-indo-iranian-main-r01` | `V5-V7` | `COLLAPSED_HIGH` | `4.621212` | `0.508333` | `-0.398333` | `none` |
| 2 | `cohort03-hi-i-v5-v7-indo-iranian-alt-r01` | `V5-V7` | `COLLAPSED_HIGH` | `1.639785` | `0.508333` | `-0.198333` | `none` |
| 3 | `cohort03-hi-i-v4-v7-control-main-r01` | `V4-V7` | `COLLAPSED_HIGH` | `5.686275` | `0.483333` | `-0.398333` | `none` |
| 4 | `cohort03-hi-i-v4-v7-control-alt-r01` | `V4-V7` | `COLLAPSED_HIGH` | `1.550926` | `0.558333` | `-0.198333` | `none` |

## 4. Interpretation

Hindi `/i/` does not support the planned `V5-V7` high-region bracket.

Reason:

- both `V5-V7` candidate runs returned `COLLAPSED_HIGH`;
- both `V4-V7` controls also returned `COLLAPSED_HIGH`;
- the wider `V4-V7` control did not stabilize Hindi `/i/`;
- no run returned `INTERMEDIATE`;
- no diagnostic flags were reported.

Recommended wording:

> Hindi `/i/` Cohort 03 Indo-Iranian Phase C does not support `V5-V7`. Both `V5-V7` candidate runs collapsed high, and both `V4-V7` controls also collapsed high. The wider `V4-V7` control does not stabilize the case. Record as Indo-Iranian high-region pressure / anchor-instability, not support.

## 5. Claim boundaries

Allowed:

- Hindi `/i/` has one recorded Cohort 03 Indo-Iranian evidence pack.
- Hindi `/i/` candidate and control brackets all collapsed high.
- Hindi `/i/` is high-region pressure / anchor-instability under this token pack.
- Hindi `/i/` does not support `V5-V7`.

Blocked:

- Do not claim Indo-Iranian Phase C is complete.
- Do not claim Cohort 03 is complete.
- Do not claim Hindi validates the framework.
- Do not claim Hindi `/i/` supports `V5-V7`.
- Do not infer Persian `/i/` from this Hindi pack alone.
- Do not publish or update README from this result alone.
- Do not say the full ZË-RO framework is proven.
