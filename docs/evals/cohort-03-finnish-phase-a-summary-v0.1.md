# Cohort 03 Finnish Phase A Summary v0.1

Status: FINNISH PHASE A SUMMARY RECORDED
Project: ZË-RO
Milestone: Cohort 03
Phase: Finnish Phase A bridge
Date recorded: 2026-05-19

This document summarizes the three recorded Finnish Phase A evidence packs:

- Finnish `/ä/`
- Finnish `/ö/`
- Finnish `/y/`

It compares the recorded results only.

It does not publish anything.
It does not update README.
It does not claim Cohort 03 is finished.
It does not claim Finnish validates the full ZË-RO framework.

## 1. Source documents

Design:

- `docs/evals/cohort-03-cross-family-design-v0.1.md`

Result records:

- `docs/evals/cohort-03-finnish-ae-bridge-result-v0.1.md`
- `docs/evals/cohort-03-finnish-oe-bridge-result-v0.1.md`
- `docs/evals/cohort-03-finnish-y-bridge-result-v0.1.md`

## 2. Phase A purpose

Finnish Phase A was designed as the bridge from Cohort 02 into Cohort 03 cross-family testing.

The purpose was to test whether Finnish front vowels behave as a single uniform support block or whether different front-vowel positions create different bracket behavior.

The result is not uniform.

That is useful.

Finnish Phase A separates into:

- one clean lower/open-front bridge case;
- one weaker lower front-rounded bridge case;
- one high-region pressure / anchor-instability case.

## 3. Evidence packs

| Case | Series | Evidence pack SHA256 |
|---|---|---|
| Finnish `/ä/` | `cohort03-fi-ae-v1-v3-bridge-v0.1` | `8c52c91c4ca378949080c76c9d2e29f5b2d82baf9488eced826581f6c0365bde` |
| Finnish `/ö/` | `cohort03-fi-oe-v1-v3-bridge-v0.1` | `f112e9dd8319abfc34376868567f72e5f447edeeaa976b7d149f9c35aa82fdec` |
| Finnish `/y/` | `cohort03-fi-y-v5-v7-bridge-v0.1` | `5a5ce9a713dd9b3b708a16c503a652e4fa7f97ba02ea0255f6f9fa41f2e2d79a` |

## 4. Result summary

| Case | Candidate bracket | Control bracket | Candidate result | Control result | Summary classification |
|---|---|---|---|---|---|
| Finnish `/ä/` | `V1-V3` | `V2-V3` | `INTERMEDIATE` x2, no flags | `EXCEEDS_LOW` x2, `BOUNDARY_UNCERTAIN_LOW` | clean lower/open-front `V1-V3` bridge support |
| Finnish `/ö/` | `V1-V3` | `V2-V5` | `INTERMEDIATE` x2, no flags | `INTERMEDIATE` x2 with low-boundary stress | weaker lower front-rounded `V1-V3` bridge support |
| Finnish `/y/` | `V5-V7` | `V2-V5` | `COLLAPSED_HIGH` x2 | `COLLAPSED_HIGH` x2 | high-region pressure / anchor-instability; no `V5-V7` support |

## 5. Case notes

### 5.1 Finnish `/ä/`

Finnish `/ä/` is the cleanest positive Finnish Phase A result.

Recorded pattern:

- `V1-V3` candidate main: `INTERMEDIATE`, no flags
- `V1-V3` candidate alt: `INTERMEDIATE`, no flags
- `V2-V3` control main: `EXCEEDS_LOW`, `BOUNDARY_UNCERTAIN_LOW`
- `V2-V3` control alt: `EXCEEDS_LOW`, `BOUNDARY_UNCERTAIN_LOW`

Interpretation:

Finnish `/ä/` supports the lower/open-front `V1-V3` bridge classification under its ChatGPT-assisted researcher-reviewed token pack.

### 5.2 Finnish `/ö/`

Finnish `/ö/` is positive, but weaker than `/ä/`.

Recorded pattern:

- `V1-V3` candidate main: `INTERMEDIATE`, no flags
- `V1-V3` candidate alt: `INTERMEDIATE`, no flags
- `V2-V5` control main: `INTERMEDIATE`, `NEAR_COLLAPSE_LOW`, `BOUNDARY_UNCERTAIN_LOW`
- `V2-V5` control alt: `INTERMEDIATE`, `BOUNDARY_UNCERTAIN_LOW`

Interpretation:

Finnish `/ö/` supports lower front-rounded `V1-V3` bridge classification under its token pack, but control separation is boundary-stressed rather than decisive.

Do not treat Finnish `/ö/` as a full control-failure case.

### 5.3 Finnish `/y/`

Finnish `/y/` is not support for the planned high front-rounded `V5-V7` bracket.

Recorded pattern:

- `V5-V7` candidate main: `COLLAPSED_HIGH`, `BOUNDARY_UNCERTAIN_HIGH`
- `V5-V7` candidate alt: `COLLAPSED_HIGH`, `BOUNDARY_UNCERTAIN_HIGH`
- `V2-V5` control main: `COLLAPSED_HIGH`, `BOUNDARY_UNCERTAIN_LOW`
- `V2-V5` control alt: `COLLAPSED_HIGH`, no flags

Interpretation:

Finnish `/y/` records high-region pressure / anchor-instability under its token pack.

It does not support `V5-V7`.

It also does not show that `V2-V5` rescues Finnish `/y/`.

## 6. Phase A interpretation

Finnish Phase A does not behave like a blanket success case.

That matters.

The useful reading is:

1. `/ä/` behaves like a lower/open-front `V1-V3` bridge case.
2. `/ö/` behaves like a weaker lower front-rounded `V1-V3` bridge case.
3. `/y/` creates high-region pressure and should not be folded into the same support category.

This supports keeping Finnish Phase A as a differentiated bridge result:

- support for lower/open-front `/ä/`;
- weaker support for lower front-rounded `/ö/`;
- pressure/instability for high front-rounded `/y/`.

## 7. Research consequence

Finnish Phase A gives two immediate research options.

### Option A — Audit Finnish `/y/`

Run a second Finnish `/y/` pack before moving to the next language family.

Reason:

- `/y/` collapsed high in both candidate and control brackets;
- high-front/rounded behavior may need cleaner anchors;
- the result resembles earlier high-region pressure patterns seen in other cases.

This is the more conservative option.

### Option B — Move to Semitic Phase B

Move to Arabic/Hebrew as planned in the Cohort 03 design.

Reason:

- Finnish Phase A already delivered a mixed result;
- the mixed result is informative enough to justify broader family testing;
- Semitic root-and-pattern systems test a different structural domain.

This is the faster cross-family option.

## 8. Recommended next step

Recommended next step:

Audit Finnish `/y/` once before moving to Semitic Phase B.

Reason:

- `/ä/` and `/ö/` already have usable bridge classifications;
- `/y/` is the unresolved pressure point inside the Finnish bridge;
- one audit pack would clarify whether the pressure is robust or partly token/anchor-driven.

The audit should not replace the first `/y/` result.
It should be recorded as a second pack.

Suggested audit label:

- `cohort03-fi-y-v5-v7-audit-v0.1`

Suggested audit comparison:

- candidate: `V5-V7`
- control: `V4-V7`
- optional secondary control: `V2-V5` only if needed later

## 9. Claim boundaries

Allowed:

- Finnish Phase A has three recorded evidence packs.
- Finnish `/ä/` is clean lower/open-front `V1-V3` bridge support under its token pack.
- Finnish `/ö/` is weaker lower front-rounded `V1-V3` bridge support under its token pack.
- Finnish `/y/` is high-region pressure / anchor-instability under its token pack.
- Finnish Phase A is mixed and differentiated.

Blocked:

- Do not claim Cohort 03 is finished.
- Do not claim Finnish validates the full framework.
- Do not claim all Finnish front vowels support one bracket.
- Do not claim Finnish `/y/` supports `V5-V7`.
- Do not claim `V2-V5` rescues Finnish `/y/`.
- Do not publish or update README from this summary alone.
- Do not say the full ZË-RO framework is proven.
