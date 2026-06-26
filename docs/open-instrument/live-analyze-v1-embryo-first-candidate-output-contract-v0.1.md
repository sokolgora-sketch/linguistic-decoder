# live analyze-v1 embryo-first candidate output contract v0.1

Date: 2026-06-26

Status: LIVE_ANALYZE_V1_EMBRYO_FIRST_CANDIDATE_OUTPUT_CONTRACT_DEFINED_PENDING_REVIEW.

## Purpose

This contract defines how live /api/analyze-v1 candidates must express embryo-first functional motivation.

The contract follows the reviewed embryo-first functional motivation milestone.

ZËRO does not rank historical origin.

ZËRO does not declare a winner.

ZËRO performs embryo surgery on a word and orders candidate explanations by the smallest validated functional embryo and clearest motivation chain.

The user remains the final interpreter.

## Contract scope

This contract defines output shape and validation expectations.

This contract does not implement behavior.

This contract does not mutate /api/analyze-v1.

This contract does not mutate fixtures.

This contract does not run provider/model replay.

This contract does not claim origin.

This contract does not promote DA/DË, dëm, ndarje, or mythic-register damage claims without isolation proof.

## Required candidate posture

A live candidate must not rely only on:

* status
* confidenceTag
* fitTag
* sourceKind

Those fields are not enough.

Every live candidate must expose what kind of finding it is and what boundary applies.

A candidate may be shown as incomplete, exploratory, or not fully validated, but it must not be presented as strong functional motivation without isolation proof and a claim boundary.

## Required top-level candidate fields

Future live /api/analyze-v1 candidates must support these embryo-first fields.

Exact implementation may use nested objects, but the semantic fields are required.

### candidateId

Stable candidate identifier.

Example:

* albanian-da-dam-damage-functional
* latin-damnum-whole-form-context

### displayForm

The form shown to the user.

Example:

* DA → DAM → DAMAGE
* damnum
* dëm
* studim
* studium

### candidateLanguage

The language or source context used for the candidate.

This may include dialect/register where needed.

Examples:

* Albanian
* Latin
* English
* Albanian/Gheg
* Albanian/Tosk
* Unknown

### claimType

Required.

Allowed values:

* functionalMotivation
* historicalTransmission
* surfaceResonance
* seedPairing
* unresolved
* notEvaluated

Rules:

* functionalMotivation means the candidate is being evaluated as meaning/function motivation.
* historicalTransmission means the candidate is being recorded as history/context only.
* surfaceResonance means the candidate resembles the word but has not passed embryo isolation.
* seedPairing means the candidate came from a seed list but is not automatically validated.
* unresolved means the system cannot support the candidate yet.
* notEvaluated means the system has not run the necessary checks.

### originClaim

Required.

Allowed values:

* not_claimed
* context_only
* explicitly_supported
* rejected_for_this_output

Default for embryo-first live candidates must be:

* not_claimed

The engine must not imply origin by ranking.

### historicalRelation

Required.

Allowed values:

* not_evaluated
* context_only
* possible_loan_relation
* attested_loan_relation
* possible_cognate_relation
* unknown
* not_applicable

Historical relation is context only unless a separate historical evidence lane explicitly supports it.

Historical relation must not decide embryo-first rank by itself.

### embryo

Required when claimType is functionalMotivation.

The smallest proposed functional unit.

Examples:

* DA
* DI
* SHTU
* DAM
* STUD

### embryoSize

Required when embryo exists.

Integer count of the embryo characters or symbolic units, depending on the implementation.

The ranking must prefer smaller validated embryos only when validation is adequate.

Smallest invalid embryo does not outrank a larger validated embryo.

### embryoLanguage

Required when embryo exists.

The language or source context where the embryo is claimed to be meaningful.

### isolatedStandaloneForm

Required for validated functional motivation.

The standalone form that proves the embryo is not merely invented inside the larger word.

Examples:

* da
* di
* shtu

If missing, candidate validation cannot be fully passed as functionalMotivation.

### plainStandaloneGloss

Required for validated functional motivation.

Plain-language meaning of the isolated standalone form.

Example:

* split / divide
* know
* put / make / add

### sourceNote

Required for validated functional motivation.

A human-readable evidence note explaining why the isolated form is accepted.

This may later connect to references, dictionaries, curated evidence, or approved source records.

A candidate cannot be fully validated as functionalMotivation without a sourceNote.

### segmentation

Required for embryo-first candidates.

Shows how the word is surgically segmented.

Example:

* DA + M
* SHTU + DI
* DAM + AGE

Segmentation must be labeled as functional segmentation, not historical morphology, unless separately supported.

### semanticBridge

Required for validated functional motivation.

Explains the meaning transition from embryo to word function.

Example:

* what is split or broken becomes harmed or damaged
* knowledge is made internal through study

### expansionChain

Required for embryo-first ranking.

Ordered list from smallest embryo to larger construction.

Example:

* DA
* DAM
* DAMAGE

or:

* SHTU
* DI
* STUDY

The chain should move from smaller to larger.

### validationOutcome

Required.

Allowed values:

* validated
* partial
* failed
* not_evaluated
* blocked

Rules:

* validated means isolation proof, semantic bridge, and claim boundary are present.
* partial means some evidence is present but not enough for full validation.
* failed means candidate cannot support the claim.
* not_evaluated means checks have not run.
* blocked means a policy or contract boundary prevents the claim.

### validationReasons

Required array.

Must include reason codes or concise explanations.

Example codes:

* isolated_standalone_form_present
* source_note_present
* semantic_bridge_present
* missing_isolated_standalone_form
* missing_source_note
* historical_origin_not_claimed
* seed_candidate_not_auto_validated

### rankGroup

Required.

Allowed values:

* validatedFunctionalMotivation
* partialFunctionalMotivation
* surfaceOrSeedOnly
* historicalContextOnly
* unresolved

Ordering:

1. validatedFunctionalMotivation
2. partialFunctionalMotivation
3. surfaceOrSeedOnly
4. historicalContextOnly
5. unresolved

### rankScore

Optional but recommended.

A deterministic score may be used internally, but the UI must still expose rankReason and claimBoundary.

### rankReason

Required.

Plain explanation of why the candidate is ordered where it is.

Example:

* smallest validated embryo with clear split-to-harm semantic bridge
* seed pairing only; no isolated embryo proof yet
* historical context only; not ranked as functional motivation

### claimBoundary

Required.

Must explicitly state what is and is not being claimed.

Required default phrase family:

* functional motivation only; not historical origin

For history/context candidates:

* historical context only; not functional motivation proof

### userDecisionPosture

Required.

Default:

* user_decides

The engine must preserve the no-winner posture.

## Required ranking behavior

Candidate ordering must follow embryo-first functional motivation.

Primary order:

1. validated functional motivation candidates
2. partial functional motivation candidates
3. surface or seed-only candidates
4. historical context only candidates
5. unresolved candidates

Within validated functional motivation:

1. smaller validated embryo
2. stronger isolated standalone proof
3. clearer semantic bridge
4. shorter and cleaner expansion chain
5. clearer language transparency
6. Seven-Voice alignment where applicable
7. clearer claim boundary

Historical origin must not outrank functional motivation.

Known borrowing must not disqualify functional motivation.

A smaller embryo with no isolation proof must not outrank a larger embryo with strong isolation proof.

## Required SEED candidate behavior

SEED candidates must not bypass the truth wall.

SEED sourceKind does not mean validated.

SEED candidates must carry the same claimType, validationOutcome, validationReasons, rankGroup, rankReason, and claimBoundary fields.

A SEED candidate without isolatedStandaloneForm and sourceNote cannot be fully validated as functionalMotivation.

It may be displayed as:

* seedPairing
* surfaceOrSeedOnly
* partialFunctionalMotivation
* notEvaluated

It must not be shown as strong functional motivation merely because it came from a seed list.

## Required study behavior

The live candidate output for study must not only show:

* Latin studium strong/pass
* Albanian studim strong/pass

The output must explain the smallest meaningful embryo and expansion path.

Candidates should be ordered by their validated embryo-first motivation.

A candidate that can explain a smaller functional unit with clear isolation proof may rank above a candidate that only presents the larger form.

No origin winner is claimed.

## Required damage behavior

The live candidate output for damage must not merely show:

* Latin damnum strong/pass
* Albanian dëm strong/pass

The output must distinguish:

* functionalMotivation
* historicalTransmission
* seedPairing
* surfaceResonance
* unresolved

A functional motivation candidate may propose:

* DA = split / divide / separation
* DAM = harmed, broken, impaired, or damaged state
* DAMAGE = expanded injury/damage form

But it must validate DA or DË as an isolated standalone embryo before full functional validation.

If Albanian validates DA as a live isolated functional embryo meaning split/divide, then Albanian may rank high for functional motivation.

If Latin validates an equal or smaller embryo with an equal or clearer semantic bridge, then Latin may rank earlier.

If Latin only presents damnum as an opaque whole form, then Latin may still appear as historical or seed context, but not as the strongest embryo-first functional motivation.

This does not prove Albanian origin.

This does not disprove Latin transmission.

This does not make a winner claim.

## Minimum acceptable candidate examples

### Validated functional motivation example

```json
{
  "candidateId": "albanian-da-dam-damage-functional",
  "displayForm": "DA → DAM → DAMAGE",
  "candidateLanguage": "Albanian",
  "claimType": "functionalMotivation",
  "originClaim": "not_claimed",
  "historicalRelation": "context_only",
  "embryo": "DA",
  "embryoSize": 2,
  "embryoLanguage": "Albanian",
  "isolatedStandaloneForm": "da",
  "plainStandaloneGloss": "split / divide",
  "sourceNote": "Required evidence note for isolated DA before validation.",
  "segmentation": ["DA", "DAM", "DAMAGE"],
  "semanticBridge": "what is split or broken becomes harmed or damaged",
  "expansionChain": ["DA", "DAM", "DAMAGE"],
  "validationOutcome": "validated",
  "validationReasons": [
    "isolated_standalone_form_present",
    "source_note_present",
    "semantic_bridge_present",
    "historical_origin_not_claimed"
  ],
  "rankGroup": "validatedFunctionalMotivation",
  "rankReason": "smallest validated embryo with clear split-to-harm bridge",
  "claimBoundary": "functional motivation only; not historical origin",
  "userDecisionPosture": "user_decides"
}
```

### Seed-only candidate example

```json
{
  "candidateId": "latin-damnum-seed-context",
  "displayForm": "damnum",
  "candidateLanguage": "Latin",
  "claimType": "seedPairing",
  "originClaim": "not_claimed",
  "historicalRelation": "context_only",
  "embryo": null,
  "embryoSize": null,
  "embryoLanguage": "Latin",
  "isolatedStandaloneForm": null,
  "plainStandaloneGloss": null,
  "sourceNote": "Seed form present, but no isolated embryo proof supplied in this output.",
  "segmentation": ["damnum"],
  "semanticBridge": null,
  "expansionChain": ["damnum"],
  "validationOutcome": "partial",
  "validationReasons": [
    "seed_candidate_present",
    "missing_isolated_standalone_form",
    "missing_semantic_bridge",
    "historical_origin_not_claimed"
  ],
  "rankGroup": "surfaceOrSeedOnly",
  "rankReason": "seed pairing only; no embryo-first isolation proof yet",
  "claimBoundary": "seed/context candidate only; not historical origin or validated functional motivation",
  "userDecisionPosture": "user_decides"
}
```

## UI display requirement

The UI must not show only strong/pass for live candidates once this contract is implemented.

The user-facing display should show:

* embryo
* expansion chain
* motivation bridge
* validation status
* rank reason
* claim boundary

The candidate table may still show confidence tags, but those tags must not replace the embryo-first explanation.

## Contract tests expected after review

The implementation lane should add tests proving:

* all live candidates expose embryo-first fields
* SEED candidates do not bypass claim boundary
* candidate ordering uses rankGroup before raw confidenceTag
* candidate ordering does not claim historical origin
* damage output does not claim DA/DË proof without isolation fields
* study output does not show only studium/studim strong/pass without embryo-first explanation
* missing isolatedStandaloneForm blocks full functional validation
* missing sourceNote blocks full functional validation
* historical relation does not decide functional rank by itself

## Non-goals

This contract does not:

* implement the candidate mapper
* modify the API response
* update fixtures
* run model/provider replay
* claim origin
* claim winner
* prove Albanian origin
* disprove Latin transmission
* prove damage DA/DË
* prove study embryo candidates

## Current next accepted task

docs(open-instrument): review live analyze-v1 embryo-first candidate output contract v0.1
