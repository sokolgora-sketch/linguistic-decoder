# embryo-first functional motivation milestone v0.1

Date: 2026-06-26

Status: EMBRYO_FIRST_FUNCTIONAL_MOTIVATION_MILESTONE_DEFINED_PENDING_REVIEW.

## Purpose

This milestone realigns live /api/analyze-v1 candidates with the actual ZËRO/Open Instrument mission.

ZËRO does not rank historical origin.

ZËRO does not declare a winner.

ZËRO performs embryo surgery on a word and orders candidate explanations by the smallest validated functional embryo that can motivate the word meaning/function.

The user remains the final interpreter.

## Core correction

Historical transmission and functional motivation are separate axes.

A candidate may be historically borrowed and still be functionally transparent in the receiving language.

A candidate may be historically old and still fail functional motivation if it cannot explain the word from a small isolated embryo.

Known or suspected loanword status does not automatically disqualify a candidate.

Known or suspected loanword status also does not crown a candidate.

Historical context may be recorded as context only.

The live candidate result must not confuse historical origin with functional motivation.

## Required output posture

The live /api/analyze-v1 candidate output must not present only:

* status: pass
* confidenceTag: strong
* fitTag: strong

Those fields are insufficient without explaining what kind of pass happened.

Future candidate output must expose the surgery logic.

At minimum, candidates need enough structure to show:

* claim type
* origin claim boundary
* smallest embryo proposed
* embryo size
* isolated standalone form
* plain standalone gloss
* language or source context
* source note
* semantic bridge
* expansion chain
* validation outcome
* rank reason
* claim boundary

## Embryo-first ranking rule

Candidates are ordered by functional motivation strength, not chronology.

The ranking begins with the smallest valid embryo and expands outward.

Primary ranking factors:

1. smallest validated functional embryo
2. isolated standalone proof
3. semantic bridge clarity
4. expansion chain economy
5. language transparency
6. Seven-Voice alignment where applicable
7. evidence grade and claim boundary clarity

Historical origin is not a ranking winner.

Historical borrowing is not a ranking failure.

## Example: damage

The functional surgery question is not:

Who owned damage first?

The functional surgery question is:

Which candidate can motivate damage from the smallest meaningful embryo?

A candidate may propose:

* DA = split / divide / separation
* DAM = harmed, broken, impaired, or damaged state
* DAMAGE = expanded injury/damage form

If Albanian can validate DA as a live isolated functional embryo meaning split/divide, then Albanian may rank high for functional motivation.

If Latin can validate an equal or smaller embryo with an equal or clearer semantic bridge, then Latin may rank earlier.

If Latin only presents damnum as an opaque whole form, then Latin may still be historically relevant but weaker as embryo-first functional motivation.

This does not prove Albanian origin.

This does not disprove Latin transmission.

This does not make any winner claim.

It only ranks the functional surgery chain.

## Example: study

The same rule applies to study.

The candidate should not merely say Latin studium and Albanian studim are strong/pass.

The candidate should show the smallest meaningful embryo and expansion path.

The result should move from smallest embryo to larger construction.

A candidate that explains the smaller functional unit more clearly should appear before a candidate that only explains the larger borrowed or opaque form.

## Candidate fields target

Future live candidates should move toward a structure like:

```json
{
  "claimType": "functionalMotivation",
  "originClaim": "not_claimed",
  "historicalRelation": "context_only_or_not_evaluated",
  "embryo": "DA",
  "embryoSize": 2,
  "embryoLanguage": "Albanian",
  "isolatedStandaloneForm": "da",
  "plainStandaloneGloss": "split / divide",
  "sourceNote": "Evidence note required before pass.",
  "semanticBridge": "what is split or broken becomes harmed or damaged",
  "expansionChain": ["DA", "DAM", "DAMAGE"],
  "validationOutcome": "pass_or_fail_with_reason",
  "rankReason": "smallest validated embryo with clear functional bridge",
  "claimBoundary": "functional motivation only; not historical origin"
}
```

Exact field names may be refined in the implementation contract, but the logic must remain.

## Universal isolation audit

All live candidates must be subject to the same functional isolation audit.

SEED candidates must not bypass the truth wall.

The live SEED path must not be weaker than the replay/generalization path.

A candidate that cannot provide isolation proof may still be displayed, but it must be demoted or marked as not fully validated.

A strong/pass label without isolation and claim boundary is not acceptable for embryo-first functional motivation.

## LLM posture

LLM assistance may be used only as a proposal or explanation layer when explicitly authorized.

The deterministic live output must still expose evidence, validation, ranking reason, and claim boundary.

No provider/model execution is authorized by this milestone.

No replay execution is authorized by this milestone.

## Non-goals

This milestone does not:

* change /api/analyze-v1 behavior immediately
* mutate fixtures
* mutate artifacts
* run provider/model replay
* claim origin
* claim historical winner
* prove Albanian origin
* disprove Latin transmission
* promote damage DA/DË claims without isolation proof
* promote study candidates without embryo-first explanation

## Required boundaries

Every implementation under this milestone must preserve:

* no single winner
* no historical origin claim unless explicitly supported by evidence and labeled separately
* functional motivation is separate from historical transmission
* candidates ordered by smallest validated embryo and clearest motivation chain
* user decides final interpretation
* damage regression does not prove DA, dëm, ndarje, or mythic-register decomposition

## Milestone plan

### Step 1 — define milestone

Status target:

* EMBRYO_FIRST_FUNCTIONAL_MOTIVATION_MILESTONE_DEFINED_PENDING_REVIEW

This document defines the milestone.

### Step 2 — review milestone

Next status target:

* EMBRYO_FIRST_FUNCTIONAL_MOTIVATION_MILESTONE_REVIEWED_ACCEPTED_READY_FOR_CONTRACT

Review this document and accept the milestone logic.

### Step 3 — define live candidate output contract

Expected task:

* docs(open-instrument): define live analyze-v1 embryo-first candidate output contract v0.1

This should define exact candidate fields, ranking rules, validation statuses, and UI/API boundaries.

### Step 4 — review output contract

Expected task:

* docs(open-instrument): review live analyze-v1 embryo-first candidate output contract v0.1

### Step 5 — implement deterministic adapter/schema lane

Expected task:

* test(open-instrument): implement live analyze-v1 embryo-first candidate output contract v0.1

This should add tests before or with implementation.

### Step 6 — review implementation

Expected task:

* docs(open-instrument): review live analyze-v1 embryo-first candidate output contract implementation v0.1

### Step 7 — add focused examples

Expected task:

* test(open-instrument): add embryo-first candidate examples for damage and study v0.1

These examples must preserve boundaries.

They must not claim origin.

They must demonstrate embryo-first ordering and claim boundaries.

### Step 8 — close milestone

Expected task:

* docs(open-instrument): close embryo-first functional motivation milestone v0.1

The milestone is done only after the live candidate path exposes embryo-first motivation logic with tests and review.

## Current next accepted task

docs(open-instrument): review embryo-first functional motivation milestone v0.1
