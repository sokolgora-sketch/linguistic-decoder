# Cohort 04 Hindi `/i/` Open-Final Replication Design v0.1

Status: design only  
Scope: documentation only  
Date recorded: 2026-05-23

## 1. Purpose

This document defines a narrow replication design after the Cohort 04 Hindi `/i/` open-final / closed-final final-shape result.

The prior Cohort 04 result found:

> Open-final distribution reduced high-boundary pressure in this Hindi `/i/` pack.

This document asks the next question:

> Does the open-final effect replicate with an independently curated second open-final lane?

This document does not create token buckets.  
This document does not authorize `/evals` runs.  
This document does not create evidence packs.  
This document does not change README or publication claims.

## 2. Source context

This design follows:

- `docs/evals/cohort-04-hi-i-open-final-closed-final-design-v0.1.md`
- `docs/evals/cohort-04-hi-i-open-final-closed-final-curation-instructions-v0.1.md`
- `docs/evals/cohort-04-hi-i-open-final-closed-final-curation-result-v0.1.md`
- `docs/evals/cohort-04-hi-i-open-final-closed-final-result-v0.1.md`

## 3. Prior result boundary

The prior final-shape pack produced:

| Lane | Verdict | normalizedPosition | gap_high | Flags |
|---|---|---:|---:|---|
| baseline reference | `INTERMEDIATE` | 0.706522 | 0.135 | `BOUNDARY_UNCERTAIN_HIGH` |
| open-final controlled | `INTERMEDIATE` | 0.608696 | 0.18 | none |
| closed-final controlled | `INTERMEDIATE` | 0.706522 | 0.135 | `BOUNDARY_UNCERTAIN_HIGH` |
| mixed-final balanced | `INTERMEDIATE` | 0.706522 | 0.135 | `BOUNDARY_UNCERTAIN_HIGH` |

Allowed prior interpretation:

> Open-final distribution reduced high-boundary pressure in this Hindi `/i/` pack.

Blocked prior interpretation:

- Do not claim open-final distribution solves Hindi `/i/`.
- Do not claim Hindi `/i/` supports `V6-V7`.
- Do not claim Cohort 04 is publication-ready.
- Do not update README.

## 4. Primary research question

Primary question:

> Does the open-final effect replicate with an independently curated second open-final Hindi `/i/` target?

Replication means:

- the new open-final target is not token-reused from the first open-final lane;
- the new open-final target keeps mean token length close to the original open-final target;
- the new open-final target keeps a high open-final count;
- the new open-final target returns `INTERMEDIATE` without `BOUNDARY_UNCERTAIN_HIGH`, or at least moves away from the high boundary compared with the closed/mixed lanes.

## 5. Working hypothesis

Working hypothesis:

> If final-shape distribution is a real pressure variable for Hindi `/i/`, then a second independently curated open-final target should again reduce high-boundary pressure relative to the already observed closed-final and mixed-final stress pattern.

This is a replication hypothesis, not a support claim.

## 6. Fixed constraints for future curation

Any future curation instructions must keep:

- `taskId`: `T5_INTERMEDIATE_V0_1`
- `inputShape`: `intermediate_triple`
- `languageHint`: `hi`
- `vowelUnderTest`: `i`
- `anchorLow`: `V6`
- `anchorHigh`: `V7`

Provenance metadata for the future hand-pasted buckets should be:

- `provider`: `openai`
- `model`: `chatgpt-assisted-researcher-reviewed`
- `sourceEngineId`: blank
- `sourceEngineVersion`: blank
- `sourceEngineBuild`: blank

## 7. Recommended run structure

The future curation instructions should lock the first replication pass as:

> 4 scored runs

Recommended lanes:

1. prior open-final reference;
2. independent open-final replication A;
3. independent open-final replication B;
4. closed-final stress reference.

Reason:

- one run repeats the prior clean open-final lane as a local reference;
- two new independent open-final lanes test replication strength;
- one closed-final reference keeps the high-boundary stress comparator in the same series.

Do not run 1 scored run.

Do not run 8 scored runs unless a later design revision explains why more replication power is needed.

## 8. Prior open-final lane — reference only

The prior open-final controlled lane was:

```json
[
  "kitna",
  "kiska",
  "bigda",
  "bikta",
  "pighla",
  "sikhna",
  "chilka",
  "tircha",
  "jiska",
  "nikla"
]

This lane may be reused only as the reference lane.

It must not be reused as a new replication lane.

9. New open-final replication target constraints

Each new open-final replication target should satisfy:

10 tokens.
Broad-Latin Hindi transliteration.
Visible short i in every token.
At least 8 of 10 tokens open-final.
Mean token length close to 5.4.
No token reuse from:
original Hindi /i/ main target;
original alternate target;
short-i high anchor;
accepted length-matched target;
length-matched replication target;
first open-final target;
closed-final target;
mixed-final target.
No obvious long-ee high-front marker.
No spaces.
No punctuation.
No diacritics.
No digits.
10. Closed-final stress reference

The future curation instructions may reuse the prior closed-final controlled target as the stress reference:

[
  "kichad",
  "idhar",
  "jidhar",
  "nigam",
  "vichar",
  "sifar",
  "fikar",
  "sabit",
  "kabil",
  "vidit"
]

Purpose:

Keep a known high-boundary stressed comparator in the replication pack.

11. Expected outcomes
Outcome A — replication holds

Pattern:

prior open-final reference remains cleaner;
independent open-final A is clean or cleaner than closed-final reference;
independent open-final B is clean or cleaner than closed-final reference;
closed-final reference remains high-boundary stressed.

Reading:

Open-final shape is a reproducible pressure-reducing variable in this Hindi /i/ setup.

Blocked claim:

Open-final solves Hindi /i/.

Outcome B — replication is partial

Pattern:

one independent open-final lane is cleaner;
one independent open-final lane remains high-boundary stressed.

Reading:

Open-final shape may help, but token selection still matters.

Blocked claim:

Open-final effect is fully confirmed.

Outcome C — replication fails

Pattern:

independent open-final lanes both remain high-boundary stressed.

Reading:

The original open-final lane may have been token-specific rather than final-shape-specific.

Blocked claim:

Final shape has no effect in all Hindi /i/ cases.

12. Required next document

Next required document:

Cohort 04 Hindi /i/ open-final replication curation instructions v0.1

That document must define:

exact no-reuse lists;
final run count;
exact lane names;
exact run IDs;
token-generation rules;
rejected-token rules;
exact /evals UI fields;
exact JSON payload requirements;
evidence ZIP naming convention.

No /evals run is authorized until the curation instructions and curation result docs are merged.

13. Blocked claims

Blocked claims:

Do not claim the open-final effect is replicated yet.
Do not claim open-final distribution solves Hindi /i/.
Do not claim Hindi /i/ supports V6-V7.
Do not claim final-shape distribution is proven globally.
Do not publish this as public evidence.

Do not update README.
