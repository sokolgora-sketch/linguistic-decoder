# Cohort 03 Arabic `/i/` Semitic Result v0.1

Status: SEMITIC PHASE B `/i/` EVIDENCE PACK RECORDED
Project: ZË-RO
Milestone: Cohort 03
Phase: Semitic Phase B
Case: Arabic `/i/`
Date recorded: 2026-05-19

This document records the Arabic `/i/` high-region Semitic evidence pack.

It records one ChatGPT-assisted, researcher-reviewed Arabic `/i/` token pack using broad Latin transliteration.

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

- Arabic `/i/`

Bracket comparison:

- candidate: `V5-V7`
- control: `V4-V7`

Series label:

- `cohort03-ar-i-v5-v7-semitic-v0.1`

## 2. Evidence pack

Evidence pack filename:

- `evals.series-evidence-pack.cohort03-ar-i-v5-v7-semitic-v0.1.v0.1.zip`

Evidence pack SHA256:

- `903eb8fadd56276b2966a2892e327497feec730d7cefd58377ce0849202961b2`

Evidence pack export timestamp:

- `2026-05-19T08:35:41.919Z`

Series metadata:

- `seriesLabel`: `cohort03-ar-i-v5-v7-semitic-v0.1`
- `targetCount`: `4`
- `scoredRunCount`: `4`

Curation source:

- provider: `openai`
- model: `chatgpt-assisted-researcher-reviewed`
- sourceEngine fields: blank / not used

Token convention:

- broad Latin transliteration;
- no Arabic script;
- no diacritics;
- no apostrophes;
- no hyphens;
- no spaces;
- no proper names;
- lexical words only, not abstract consonantal roots.

## 3. Run results

| Ordinal | Run ID | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---:|---|---|---|---:|---:|---:|---|
| 1 | `cohort03-ar-i-v5-v7-semitic-main-r01` | `V5-V7` | `COLLAPSED_HIGH` | `-12.875` | `0.515` | `-0.555` | `none` |
| 2 | `cohort03-ar-i-v5-v7-semitic-alt-r01` | `V5-V7` | `COLLAPSED_HIGH` | `30` | `0.9` | `-0.87` | `none` |
| 3 | `cohort03-ar-i-v4-v7-control-main-r01` | `V4-V7` | `COLLAPSED_HIGH` | `-110` | `0.55` | `-0.555` | `none` |
| 4 | `cohort03-ar-i-v4-v7-control-alt-r01` | `V4-V7` | `COLLAPSED_HIGH` | `-173` | `0.865` | `-0.87` | `none` |

## 4. Interpretation

Arabic `/i/` does not support the planned `V5-V7` high-region Semitic bracket.

Reason:

- both `V5-V7` candidate runs returned `COLLAPSED_HIGH`;
- both `V4-V7` controls also returned `COLLAPSED_HIGH`;
- the wider `V4-V7` control did not stabilize Arabic `/i/`;
- no run returned `INTERMEDIATE`;
- no diagnostic flags were reported.

Recommended wording:

> Arabic `/i/` Cohort 03 Semitic Phase B does not support `V5-V7`. Both `V5-V7` candidate runs collapsed high, and both `V4-V7` controls also collapsed high. The wider `V4-V7` control does not stabilize the case. Record as Semitic high-region pressure / anchor-instability, not support.

## 5. Claim boundaries

Allowed:

- Arabic `/i/` has one recorded Cohort 03 Semitic Phase B evidence pack.
- Arabic `/i/` candidate and control brackets all collapsed high.
- Arabic `/i/` is high-region pressure / anchor-instability under this token pack.
- Arabic `/i/` does not support `V5-V7`.

Blocked:

- Do not claim Semitic Phase B is complete.
- Do not claim Cohort 03 is complete.
- Do not claim Arabic validates the framework.
- Do not claim Arabic `/i/` supports `V5-V7`.
- Do not infer Hebrew `/i/` from this Arabic pack alone.
- Do not publish or update README from this result alone.
- Do not say the full ZË-RO framework is proven.
