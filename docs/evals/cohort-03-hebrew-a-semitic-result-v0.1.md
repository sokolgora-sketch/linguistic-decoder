# Cohort 03 Hebrew `/a/` Semitic Result v0.1

Status: SEMITIC PHASE B EVIDENCE PACK RECORDED
Project: ZË-RO
Milestone: Cohort 03
Phase: Semitic Phase B
Case: Hebrew `/a/`
Date recorded: 2026-05-19

This document records the second Cohort 03 Semitic Phase B `/a/` evidence pack.

It records one ChatGPT-assisted, researcher-reviewed Hebrew `/a/` token pack using broad Latin transliteration.

It does not complete Cohort 03.
It does not publish anything.
It does not update README.
It does not claim the full ZË-RO framework is proven.

## 1. Design reference

Design doc:

- `docs/evals/cohort-03-semitic-phase-b-design-v0.1.md`

Planned case:

- Hebrew `/a/`

Planned bracket comparison:

- candidate: `V1-V3`
- control: `V2-V3`

Planned series label:

- `cohort03-he-a-v1-v3-semitic-v0.1`

Interpretation target from design:

- If `V1-V3` is cleaner than `V2-V3`, classify as Hebrew lower/open Semitic bridge support.
- If both brackets fail or collapse, classify as Semitic `/a/` instability.
- If controls are equally clean, classify as weak / non-separating.

## 2. Evidence pack

Evidence pack filename:

- `evals.series-evidence-pack.cohort03-he-a-v1-v3-semitic-v0.1.v0.1.zip`

Evidence pack SHA256:

- `b0f6eb0f2dff93482993e2b6de66588a785f4b55ff99c4106ebb4a19d469598c`

Evidence pack export timestamp:

- `2026-05-19T04:36:27.762Z`

Series metadata:

- `seriesLabel`: `cohort03-he-a-v1-v3-semitic-v0.1`
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
| 1 | `cohort03-he-a-v1-v3-semitic-main-r01` | `V1-V3` | `EXCEEDS_LOW` | `-1.083333` | `-0.151667` | `0.291667` | `none` |
| 2 | `cohort03-he-a-v1-v3-semitic-alt-r01` | `V1-V3` | `EXCEEDS_LOW` | `-1.171429` | `-0.205` | `0.38` | `none` |
| 3 | `cohort03-he-a-v2-v3-control-main-r01` | `V2-V3` | `EXCEEDS_LOW` | `-2.240741` | `-0.201667` | `0.291667` | `none` |
| 4 | `cohort03-he-a-v2-v3-control-alt-r01` | `V2-V3` | `EXCEEDS_LOW` | `8.6` | `-0.43` | `0.38` | `none` |

## 4. Interpretation

Hebrew `/a/` Cohort 03 Semitic Phase B does not cleanly support the planned `V1-V3` lower-open Semitic bridge.

Reason:

- both `V1-V3` candidate runs returned `EXCEEDS_LOW`;
- both `V2-V3` controls also returned `EXCEEDS_LOW`;
- the `V1-V3` candidates are less stressed than the `V2-V3` controls;
- no run returned `INTERMEDIATE`;
- no diagnostic flags were reported.

Recommended wording:

> Hebrew `/a/` Cohort 03 Semitic Phase B does not cleanly support the planned `V1-V3` lower-open Semitic bridge. Both `V1-V3` candidate runs exceeded low, and both `V2-V3` controls also exceeded low. The `V1-V3` candidates are less stressed than the `V2-V3` controls, but the pack should be recorded as weak / unstable Hebrew `/a/` low-edge pressure, not support.

## 5. Relation to Arabic `/a/`

Arabic `/a/` result document:

- `docs/evals/cohort-03-arabic-a-semitic-result-v0.1.md`

Arabic `/a/` was recorded as:

- weak / edge-stressed lower-open Semitic `V1-V3` directional support;
- not clean support.

Hebrew `/a/` is weaker than Arabic `/a/` because:

- Arabic `/a/` had one `V1-V3` candidate run remain `INTERMEDIATE`;
- Hebrew `/a/` had both `V1-V3` candidate runs return `EXCEEDS_LOW`.

## 6. Claim boundaries

Allowed:

- Hebrew `/a/` has one recorded Cohort 03 Semitic Phase B evidence pack.
- Both Hebrew `/a/` candidate runs exceeded low.
- Both Hebrew `/a/` controls exceeded low.
- Hebrew `/a/` is weak / unstable low-edge pressure under this token pack.
- Hebrew `/a/` does not cleanly support `V1-V3`.

Blocked:

- Do not claim Semitic Phase B is complete before the `/a/` mini-summary is written.
- Do not claim Cohort 03 is complete.
- Do not claim Hebrew validates the framework.
- Do not claim Hebrew `/a/` supports `V1-V3`.
- Do not claim Hebrew `/i/` from this Hebrew `/a/` pack.
- Do not publish or update README from this result alone.
- Do not say the full ZË-RO framework is proven.

## 7. Next step

Write the Semitic Phase B `/a/` mini-summary comparing:

- Arabic `/a/`
- Hebrew `/a/`

Do not run Arabic `/i/` or Hebrew `/i/` until the `/a/` mini-summary is recorded.
