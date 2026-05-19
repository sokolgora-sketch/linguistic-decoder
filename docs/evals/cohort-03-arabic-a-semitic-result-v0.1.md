# Cohort 03 Arabic `/a/` Semitic Result v0.1

Status: SEMITIC PHASE B EVIDENCE PACK RECORDED
Project: ZË-RO
Milestone: Cohort 03
Phase: Semitic Phase B
Case: Arabic `/a/`
Date recorded: 2026-05-19

This document records the first Cohort 03 Semitic Phase B evidence pack.

It records one ChatGPT-assisted, researcher-reviewed Arabic `/a/` token pack using broad Latin transliteration.

It does not complete Semitic Phase B.
It does not complete Cohort 03.
It does not publish anything.
It does not update README.
It does not claim the full ZË-RO framework is proven.

## 1. Design reference

Design doc:

- `docs/evals/cohort-03-semitic-phase-b-design-v0.1.md`

Planned case:

- Arabic `/a/`

Planned bracket comparison:

- candidate: `V1-V3`
- control: `V2-V3`

Planned series label:

- `cohort03-ar-a-v1-v3-semitic-v0.1`

Interpretation target from design:

- If `V1-V3` is cleaner than `V2-V3`, classify as Arabic lower/open Semitic bridge support.
- If both brackets fail or collapse, classify as Semitic `/a/` instability.
- If controls are equally clean, classify as weak / non-separating.

## 2. Evidence pack

Evidence pack filename:

- `evals.series-evidence-pack.cohort03-ar-a-v1-v3-semitic-v0.1.v0.1.zip`

Evidence pack SHA256:

- `90eb54f1d363b45aeee4c6a21c37165604863a53e39f4fbcd06a24e758a930a4`

Evidence pack export timestamp:

- `2026-05-19T03:46:59.441Z`

Series metadata:

- `seriesLabel`: `cohort03-ar-a-v1-v3-semitic-v0.1`
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
| 1 | `cohort03-ar-a-v1-v3-semitic-main-r01` | `V1-V3` | `INTERMEDIATE` | `0.088889` | `0.08` | `0.82` | `BOUNDARY_UNCERTAIN_LOW` |
| 2 | `cohort03-ar-a-v1-v3-semitic-alt-r01` | `V1-V3` | `EXCEEDS_LOW` | `-0.052632` | `-0.045` | `0.9` | `BOUNDARY_UNCERTAIN_LOW` |
| 3 | `cohort03-ar-a-v2-v3-control-main-r01` | `V2-V3` | `EXCEEDS_LOW` | `-1.877193` | `-0.535` | `0.82` | `none` |
| 4 | `cohort03-ar-a-v2-v3-control-alt-r01` | `V2-V3` | `EXCEEDS_LOW` | `-2.050847` | `-0.605` | `0.9` | `none` |

## 4. Interpretation

Arabic `/a/` Cohort 03 Semitic Phase B shows `V1-V3` as cleaner than `V2-V3`, but not cleanly stable.

Reason:

- `V1-V3` candidate main returned `INTERMEDIATE`;
- `V1-V3` candidate main carried `BOUNDARY_UNCERTAIN_LOW`;
- `V1-V3` candidate alt returned `EXCEEDS_LOW`;
- `V1-V3` candidate alt also carried `BOUNDARY_UNCERTAIN_LOW`;
- both `V2-V3` controls returned `EXCEEDS_LOW`;
- the `V2-V3` controls exceeded low much more strongly than the `V1-V3` candidate alt.

Recommended wording:

> Arabic `/a/` Cohort 03 Semitic Phase B shows `V1-V3` as cleaner than `V2-V3`, but not cleanly stable. One `V1-V3` candidate run remained `INTERMEDIATE` with low-boundary uncertainty, while the second `V1-V3` candidate exceeded low. Both `V2-V3` controls exceeded low much more strongly. This should be recorded as weak / edge-stressed lower-open Semitic `V1-V3` directional support, not clean support.

## 5. Claim boundaries

Allowed:

- Arabic `/a/` has one recorded Cohort 03 Semitic Phase B evidence pack.
- `V1-V3` is cleaner than `V2-V3` under this token pack.
- The result is weak / edge-stressed lower-open Semitic directional support.
- The result is not clean support because one `V1-V3` candidate run exceeded low.

Blocked:

- Do not claim Semitic Phase B is complete.
- Do not claim Cohort 03 is complete.
- Do not claim Arabic validates the framework.
- Do not claim Arabic `/a/` cleanly supports `V1-V3`.
- Do not claim Hebrew results from this Arabic pack.
- Do not claim Arabic `/i/` from this Arabic `/a/` pack.
- Do not publish or update README from this result alone.
- Do not say the full ZË-RO framework is proven.

## 6. Next step

Continue Semitic Phase B with Hebrew `/a/`:

- candidate: `V1-V3`
- control: `V2-V3`
- series: `cohort03-he-a-v1-v3-semitic-v0.1`

Do not summarize Semitic Phase B `/a/` until both Arabic `/a/` and Hebrew `/a/` are recorded.
