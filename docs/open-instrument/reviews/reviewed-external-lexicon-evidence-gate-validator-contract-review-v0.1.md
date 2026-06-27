# Reviewed external lexicon evidence gate validator contract v0.1 — Review

Status: REVIEWED_EXTERNAL_LEXICON_EVIDENCE_GATE_VALIDATOR_CONTRACT_V0_1_REVIEWED_ACCEPTED_READY_FOR_IMPLEMENTATION.

Reviewed on: 2026-06-27.

Reviewed contract test:

* `tests/apiAnalyzeV1.reviewedExternalLexiconEvidenceGate.validatorContract.v0_1.spec.ts`

Reviewed contract commit:

* Short SHA: `667099b5`
* Full SHA: `667099b526fb1add0f005ecf6cf85fb794cdb26f`
* Subject: `test(open-instrument): add reviewed external lexicon evidence gate validator contract v0.1`

Prerequisite gate doc:

* `docs/open-instrument/reviewed-external-lexicon-evidence-gate-embryo-first-source-validation-v0.1.md`

Prerequisite gate review:

* `docs/open-instrument/reviews/reviewed-external-lexicon-evidence-gate-embryo-first-source-validation-review-v0.1.md`

Contract status:

* REVIEWED_EXTERNAL_LEXICON_EVIDENCE_GATE_VALIDATOR_CONTRACT_V0_1_ADDED_PENDING_REVIEW

## Review decision

Accepted.

The reviewed external lexicon evidence gate validator contract is accepted.

The contract is accepted because it locks the truth-gate behavior before implementation.

The contract is accepted because it prevents future runtime work from treating source-shape validity as source-truth validity.

The contract is accepted because it keeps external lexical citation review separate from examples, SEED, fixtures, snapshots, internal docs, and model output.

## Accepted contract scope

The PR is accepted as tests-only.

Accepted scope:

* validator contract test
* no runtime implementation
* no analyze-v1 behavior change
* no API behavior change
* no UI/VM change
* no schema tightening
* no source rows added
* no fixture promotion into evidence
* no provider/model/replay execution
* no eval work
* no VoiceLab work
* no seven-voice-order work

The contract test intentionally uses synthetic rows.

The synthetic rows are contract fixtures.

The synthetic rows are not live lexical evidence.

## Accepted validation boundary

The review accepts that shape validity alone is insufficient.

A source row can contain the expected fields and still be blocked.

The contract correctly blocks validation when external lexical citation is missing, unreviewed, internal-only, SEED-only, example-only, model-output-only, derivative-only, or homophone-colliding.

This is the correct boundary before any live source validator is implemented.

## Accepted blocked evidence cases

The review accepts that the contract blocks:

* missing external citation
* unreviewed external citation
* internal project artifacts
* project docs
* project fixtures
* project snapshots
* seed rows
* model output
* `sourceKind: SEED`
* examples-only evidence
* derivative-not-embryo evidence
* homophone collision evidence
* source kind values that are not validation sources
* symbolic resonance as validation
* historical context as validation

This matches the reviewed external lexicon evidence gate.

## Accepted DA quarantine lock

The review accepts that the contract locks `DA = split/divide` quarantine.

The candidate:

`albanian-da-dam-damage-functional`

remains blocked unless reviewed exact external citation attests isolated `da` as split/divide or a reviewed morphology route replaces the embryo.

The contract correctly rejects:

* missing external citation
* `ndaj` / `ndarë` derivative evidence as proof of isolated two-letter `da`
* `da = gave` as homophone collision for the split/divide claim
* gloss mismatch for `da = gave`
* live validation of `DA` without reviewed exact external citation

This protects the project from the previously discovered internal mismatch.

## Accepted DI posture lock

The review accepts that the contract does not quarantine `DI` in the same way as `DA`.

The candidate:

`albanian-shtu-di-study-functional`

can become source-validation eligible only when:

* reviewed external citation attests `di` as know/knowledge
* `semanticBridge` is present
* source row status is reviewed accepted
* source kind is validating
* claim boundaries remain false
* `userDecisionPosture: user_decides` remains present

The contract correctly blocks `DI` when the composition bridge is missing.

The contract correctly blocks `DI` when the citation gloss does not attest know/knowledge.

The contract correctly states that a real `DI` citation does not automatically prove the full `SHTU + DI → STUDY` composition.

## Accepted claim boundary lock

The review accepts that source validation eligibility does not create an origin claim.

The contract preserves:

* `originClaim: not_claimed`
* `userDecisionPosture: user_decides`

The review confirms that external lexical citation can support standalone-form evidence only.

External lexical citation does not prove:

* historical origin
* language superiority
* final etymology
* winner status
* candidate truth
* user decision

## Accepted implementation direction

The next implementation lane should convert this contract into a real reusable validator.

The implementation should not promote live candidates yet.

The implementation should expose a validator seam that can be used by future source rows and analyze-v1 projection.

The implementation should preserve the test-only contract semantics.

The likely future implementation seam should live near shared analysis/source validation code, not UI/VM.

The implementation must still avoid source rows until reviewed source-row lane exists.

## Review outcome

Accepted.

The validator contract status is now:

`REVIEWED_EXTERNAL_LEXICON_EVIDENCE_GATE_VALIDATOR_CONTRACT_V0_1_REVIEWED_ACCEPTED_READY_FOR_IMPLEMENTATION`

The next accepted task is:

`test(open-instrument): implement reviewed external lexicon evidence gate validator v0.1`
