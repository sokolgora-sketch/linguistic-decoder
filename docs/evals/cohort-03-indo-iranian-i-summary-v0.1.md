# Cohort 03 Indo-Iranian `/i/` Mini-Summary v0.1

Status: INDO-IRANIAN `/i/` MINI-SUMMARY RECORDED
Project: ZË-RO
Milestone: Cohort 03
Phase: Indo-Iranian Phase C
Cases: Hindi `/i/`, Persian `/i/`
Date recorded: 2026-05-19

This document summarizes the Indo-Iranian high-region `/i/` pair.

It compares only the recorded Hindi `/i/` and Persian `/i/` evidence packs.

It does not complete Indo-Iranian Phase C.
It does not complete Cohort 03.
It does not update README.
It does not publish anything.
It does not claim the full ZË-RO framework is proven.

## 1. Source documents

Context:

- `docs/evals/cohort-03-cross-family-design-v0.1.md`
- `docs/evals/cohort-03-semitic-phase-b-i-summary-v0.1.md`

Result records:

- `docs/evals/cohort-03-hindi-i-indo-iranian-result-v0.1.md`
- `docs/evals/cohort-03-persian-i-indo-iranian-result-v0.1.md`

## 2. Evidence packs

| Case | Series | Evidence pack SHA256 |
|---|---|---|
| Hindi `/i/` | `cohort03-hi-i-v5-v7-indo-iranian-v0.1` | `f890099992db2d1de9fafe8655212e3ff223791f284331082f4fbdfa4e54c8d9` |
| Persian `/i/` | `cohort03-fa-i-v5-v7-indo-iranian-v0.1` | `37d44e49ba0837fe8151935789e7b6e73c2ba5d31b70eae7e4665478fa691f7c` |

## 3. Result summary

| Case | Candidate bracket | Control bracket | Candidate result | Control result | Summary classification |
|---|---|---|---|---|---|
| Hindi `/i/` | `V5-V7` | `V4-V7` | both `COLLAPSED_HIGH`, no flags | both `COLLAPSED_HIGH`, no flags | high-region pressure / anchor-instability; not support |
| Persian `/i/` | `V5-V7` | `V4-V7` | both `COLLAPSED_HIGH`, no flags | both `COLLAPSED_HIGH`, no flags | high-region pressure / anchor-instability; not support |

## 4. Pair interpretation

The Indo-Iranian `/i/` pair does not support the planned `V5-V7` high-region bracket.

Both languages show the same pattern:

- `V5-V7` candidates collapsed high;
- `V4-V7` controls also collapsed high;
- widening the lower anchor to `V4` did not stabilize either case;
- no run returned `INTERMEDIATE`;
- no diagnostic flags were reported.

Interpretation:

- Hindi `/i/` is high-region pressure / anchor-instability.
- Persian `/i/` is high-region pressure / anchor-instability.
- The Indo-Iranian `/i/` pair strengthens the cross-family high-region pressure pattern already seen in Finnish `/y`, Arabic `/i`, and Hebrew `/i`.

This is not support for `V5-V7`.

## 5. Cross-family relation

Current high-region pressure evidence:

- Finnish `/y/`: high-region pressure / anchor-instability.
- Arabic `/i/`: high-region pressure / anchor-instability.
- Hebrew `/i/`: high-region pressure / anchor-instability.
- Hindi `/i/`: high-region pressure / anchor-instability.
- Persian `/i/`: high-region pressure / anchor-instability.

This is now broader than one language family.

## 6. Research consequence

Cohort 03 now shows repeated high-region collapse across multiple family domains.

This does not validate the high-region `V5-V7` bracket.

It suggests the current high-region placement logic needs formal review before more high-region support claims are made.

Recommended next research move:

- stop running more high-region `/i/` support tests for now;
- create a high-region-anchor review document;
- inspect whether `V5-V7`, `V4-V7`, or another bracket model should be used for high-region front vowels;
- do not publish or update README from this batch alone.

## 7. Claim boundaries

Allowed:

- Hindi `/i/` and Persian `/i/` both have recorded Cohort 03 evidence packs.
- Both `/i/` packs collapsed high in candidate and control brackets.
- Indo-Iranian `/i/` is high-region pressure / anchor-instability under these token packs.
- The Indo-Iranian `/i/` pair does not support `V5-V7`.
- The result strengthens a cross-family high-region pressure pattern.

Blocked:

- Do not claim Indo-Iranian Phase C is complete.
- Do not claim Cohort 03 is complete.
- Do not claim Indo-Iranian `/i/` supports `V5-V7`.
- Do not claim Hindi `/i/` supports `V5-V7`.
- Do not claim Persian `/i/` supports `V5-V7`.
- Do not publish or update README from this summary alone.
- Do not say the full ZË-RO framework is proven.
