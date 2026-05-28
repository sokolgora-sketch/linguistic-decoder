# Cohort 05 Georgian `/i/` Token-Curation Instructions v0.1

Status: curation instructions only  
Token status: not curated  
Run status: not started  
Publication status: not published  
Language: Georgian  
Language hint: `ka`  
Target vowel: `/i/`  
Battery: `T5_INTERMEDIATE_V0_1`  
Input shape: `intermediate_triple`  
Bracket: `V6→V7`  
Bucket geometry: `10/10/10`

## 1. Purpose

These instructions define how to curate Georgian `/i/` tokens for the Cohort 05 final-shape replication design.

This document does not provide token lists.

This document does not authorize scoring.

## 2. Source design

Primary design source:

- `docs/evals/cohort-05-ka-i-final-shape-replication-design-v0.1.md`

The design goal is to test whether the Hindi Cohort 03/04 final-shape mechanism survives in an independent same-geometry language.

## 3. Required task contract

All future curated payloads must preserve:

- `taskId: T5_INTERMEDIATE_V0_1`
- `inputShape: intermediate_triple`
- `languageHint: ka`
- `vowelUnderTest: i`
- bracket: `V6→V7`
- buckets:
  - `anchor_low`
  - `x_vowel`
  - `anchor_high`
- bucket counts:
  - `anchor_low`: 10 tokens
  - `x_vowel`: 10 tokens
  - `anchor_high`: 10 tokens

No scoring should happen from this instructions document alone.

## 4. Token eligibility

Eligible tokens must be:

- Georgian lexical items;
- single-token forms;
- romanized consistently;
- free of spaces;
- free of punctuation;
- free of obvious proper names;
- free of obvious loanwords where possible;
- not duplicated across buckets in the same run;
- not dominated by one suffix pattern.

Reject tokens if:

- romanization loses final-vowel information;
- final shape is ambiguous;
- the token depends on a multiword expression;
- the form is primarily a name, place, brand, or acronym;
- the token is likely a recent loanword unless no alternative exists;
- the same stem dominates the bucket.

## 5. Final-shape labels

Assign final-shape labels before scoring.

Definitions:

- `open_final`: working romanized token form ends in a vowel;
- `closed_final`: working romanized token form ends in a consonant;
- `mixed_final`: bucket intentionally contains both open-final and closed-final forms.

Do not change final-shape labels after verdicts or diagnostic flags are known.

## 6. Bucket construction rules

Each run needs:

- 10 `anchor_low` tokens;
- 10 `x_vowel` target tokens;
- 10 `anchor_high` tokens.

Target bucket rules:

- target bucket must represent Georgian `/i/`;
- target tokens must be final-shape controlled according to the run purpose;
- open-final target runs should use target tokens labeled `open_final`;
- closed-final target runs should use target tokens labeled `closed_final`;
- mixed-final target runs should record the open/closed split.

Anchor bucket rules:

- anchors should stay as stable as possible across paired runs;
- anchor token counts must remain 10/10;
- anchor final-shape distribution should be recorded if it cannot be controlled;
- anchor drift must be documented before interpretation.

## 7. Balance requirements

Before scoring, check:

- token length balance between open-final and closed-final target buckets;
- morphology balance between open-final and closed-final target buckets;
- source-list consistency;
- no heavy proper-name contamination;
- no heavy loanword contamination;
- no single suffix class dominating either target condition.

If the open-final and closed-final buckets differ mainly by length, suffix class, source list, or lexical category, reject the curation.

## 8. Planned first pack

Create curation candidates for these run IDs only after this instructions document is merged:

| runId | Purpose | Target final-shape condition |
|---|---|---|
| `cohort05-ka-i-baseline-reference-r01` | baseline/reference | mixed or neutral |
| `cohort05-ka-i-open-final-target-r01` | open-final mechanism test | `open_final` |
| `cohort05-ka-i-closed-final-target-r01` | closed-final mechanism test | `closed_final` |
| `cohort05-ka-i-mixed-final-target-r01` | mixed comparison | `mixed_final` |

## 9. Planned replication pack

Create only if first pack passes curation checks:

| runId | Purpose | Target final-shape condition |
|---|---|---|
| `cohort05-ka-i-open-final-reference-r01` | open-final reference | `open_final` |
| `cohort05-ka-i-open-final-replication-a-r01` | open-final replication A | `open_final` |
| `cohort05-ka-i-open-final-replication-b-r01` | open-final replication B | `open_final` |
| `cohort05-ka-i-closed-final-reference-r01` | closed-final reference | `closed_final` |

## 10. Required curation metadata

Every future token bundle must record:

- `runId`;
- `taskId`;
- `inputShape`;
- `languageHint`;
- `vowelUnderTest`;
- bracket;
- bucket counts;
- romanization convention;
- final-shape labels;
- curation source notes;
- known limitations;
- rejected-token notes if relevant.

## 11. Disqualifying conditions

Do not score if:

- clean `10/10/10` buckets cannot be built;
- Georgian `/i/` target tokens cannot be isolated consistently;
- final-vowel information is lost in romanization;
- target buckets are length-imbalanced;
- target buckets are morphology-imbalanced;
- open-final and closed-final rows come from different grammatical categories;
- token source quality is too weak;
- names, loans, or duplicate stems dominate.

## 12. Output boundary

This document does not create token JSON.

This document does not create scored runs.

This document does not update the paper.

This document does not update README.

This document does not create Zenodo archive.

This document does not submit to LingBuzz.

## 13. Next step

Next useful PR:

> create Georgian curation candidate bundle.

That future PR should still be token-candidate evidence only.

Do not run scoring until the candidate bundle has been reviewed.
