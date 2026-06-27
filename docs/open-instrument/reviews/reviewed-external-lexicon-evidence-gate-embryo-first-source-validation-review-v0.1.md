# Reviewed external lexicon evidence gate for embryo-first source validation v0.1 — Review

Status: REVIEWED_EXTERNAL_LEXICON_EVIDENCE_GATE_EMBRYO_FIRST_SOURCE_VALIDATION_V0_1_REVIEWED_ACCEPTED_READY_FOR_VALIDATOR_CONTRACT.

Reviewed on: 2026-06-27.

Reviewed gate doc:

* `docs/open-instrument/reviewed-external-lexicon-evidence-gate-embryo-first-source-validation-v0.1.md`

Reviewed gate commit:

* Short SHA: `f91248f3`
* Full SHA: `f91248f33a855022ca7a7ccc9a1591acb2c36152`
* Subject: `docs(open-instrument): define reviewed external lexicon evidence gate for embryo-first source validation v0.1`

Gate status:

* REVIEWED_EXTERNAL_LEXICON_EVIDENCE_GATE_EMBRYO_FIRST_SOURCE_VALIDATION_V0_1_DEFINED_PENDING_REVIEW

## Review decision

Accepted.

The reviewed external lexicon evidence gate is accepted.

The gate is accepted because it closes the gap between source-shape validation and source-truth validation.

The gate is accepted because internal project artifacts cannot be allowed to validate themselves.

The gate is accepted because future live `validatedFunctionalMotivation` requires externally reviewable lexical evidence.

## Accepted correction

The review accepts that the previous validator-contract next task was premature.

The prior next task was:

`test(open-instrument): add live embryo-first isolation evidence source validator contract v0.1`

That task remains deferred.

The corrected next validator task must include the external lexicon evidence gate.

The corrected next task is:

`test(open-instrument): add reviewed external lexicon evidence gate validator contract v0.1`

## Accepted evidence rule

The review accepts the central rule:

Internal project sources do not satisfy live lexical evidence.

The following are rejected as validation evidence:

* project docs
* project review docs
* tests
* fixtures
* snapshots
* seed rows
* comments
* raw JSON captures
* model output
* provider output
* DF_BRAIN notes
* symbolic resonance
* historical context only
* assistant confidence
* compactness of embryo
* surface resemblance
* transliteration convenience

These may provide context.

They may not satisfy live validation.

## Accepted external citation requirement

The review accepts that a future live source row must carry at least one reviewed external lexical citation.

The citation must have:

* `citationId`
* `citationStatus`
* `citationType`
* `sourceTitle`
* `sourceAuthorOrEditor`
* `sourcePublisherOrHost`
* `sourceDateOrVersion`
* `sourceUrlOrArchiveRef`
* `entryLocator`
* `attestedForm`
* `attestedGloss`
* `attestedGrammarNote`
* `reviewedBy`
* `reviewedAt`
* `reviewNote`
* `sourceHashOrArchiveHash`

The review accepts that only `citationStatus: reviewed_accepted` can satisfy the live validation gate.

A URL alone is not enough.

A copied gloss without locator is not enough.

A model statement is not enough.

A native-speaker note can supplement review, but cannot be the only external lexical citation.

## Accepted DA quarantine

The review accepts the `DA` quarantine.

The candidate:

`albanian-da-dam-damage-functional`

must not become live `validatedFunctionalMotivation` until reviewed external citation proves the exact standalone form or reviewed morphology required by the claim.

The quarantined claim is:

`DA = split / divide / separation`

The review accepts the quarantine because the internal table currently contains a collision:

* `id: "DA"`
* root gloss `divide / cut / separate`
* carrier `da` glossed as `gave (aorist/part)`
* related forms `ndaj` and `ndarë` carrying divide semantics

This does not prove isolated two-letter `da` as split/divide.

Required future routes are accepted:

1. Provide reviewed external citation directly attesting `da` as split/divide.
2. Or replace the embryo with an attested form such as `ndaj` or `ndarë` after reviewed morphology and bridge review.
3. Or split homophones into separate reviewed candidates such as `DA_SPLIT` and `DA_GIVE`.
4. Or keep `DA` as surface/seed/context only.

Until one of these routes is completed, `DA` remains blocked from live validation.

## Accepted DI posture

The review accepts that `DI` is not quarantined in the same way as `DA`.

The candidate:

`albanian-shtu-di-study-functional`

may proceed to future source-row review only after a reviewed external lexical citation is attached for the ingredient claim:

`DI = know / knowledge`

The review also accepts that this ingredient citation does not prove the full composition.

The composition claim:

`SHTU + DI → STUDY`

requires separate semantic bridge review.

Until both citation and bridge review exist, `DI` remains citation-pending, not live `validatedFunctionalMotivation`.

## Accepted homophone and derivative rule

The review accepts that short forms, homophones, and derivative forms require explicit separation.

Accepted rules:

* a short form cannot be validated only because a longer related form has the desired gloss
* a derivative form cannot automatically prove the isolated embryo
* a homophone cannot share evidence across meanings without explicit review
* `da`, `ndaj`, and `ndarë` cannot be collapsed without reviewed morphology
* `di`, `dij`, `dije`, and `dit` cannot be collapsed without reviewed morphology
* `DA_SPLIT` and `DA_GIVE` must not be treated as one proof

## Accepted future validator requirements

The review accepts that the next validator-contract PR must test more than field presence.

The future validator contract must lock:

* missing external citation blocks validation
* unreviewed external citation blocks validation
* internal-only evidence blocks validation
* SEED-only evidence blocks validation
* example-only evidence blocks validation
* model-output-only evidence blocks validation
* missing locator blocks validation
* form mismatch blocks validation
* gloss mismatch blocks validation
* homophone collision blocks validation
* derivative-not-embryo evidence blocks validation
* `DA` remains blocked until reviewed external citation exists
* `DI` can only become eligible with reviewed external citation
* source rows must carry reviewed external citation metadata

Shape validation alone is insufficient.

## Accepted source-row addition

The review accepts the additive future `externalCitations` shape.

The review accepts this as future source-row metadata only.

The review does not implement it.

The review does not tighten the public candidate schema.

The review does not modify runtime behavior.

## Claim boundary

The review accepts that external citation can prove a standalone form exists.

External citation still does not prove:

* historical origin
* language superiority
* final etymology
* candidate truth
* winner status
* user decision

Even after citation, output must preserve:

* `originClaim: not_claimed`
* `winnerClaim: false`
* `historicalTransmissionClaim: false`
* `userDecisionPosture: user_decides`

## Scope review

This PR is accepted only as a docs-only review.

Accepted scope:

* review of external lexicon evidence gate
* review of DA quarantine
* review of DI citation-pending posture
* review of homophone and derivative rule
* review of future validator requirements
* review of next-task correction

Rejected for this lane:

* runtime changes
* API behavior changes
* UI/VM changes
* strict candidate schema changes
* source row additions
* fixture promotion into evidence
* provider/model/replay execution
* eval work
* VoiceLab work
* seven-voice-order work

## Review outcome

Accepted.

The gate status is now:

`REVIEWED_EXTERNAL_LEXICON_EVIDENCE_GATE_EMBRYO_FIRST_SOURCE_VALIDATION_V0_1_REVIEWED_ACCEPTED_READY_FOR_VALIDATOR_CONTRACT`

The next accepted task is:

`test(open-instrument): add reviewed external lexicon evidence gate validator contract v0.1`
