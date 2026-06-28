# Reviewed external lexicon evidence gate validator implementation v0.1 — Review

Status: REVIEWED_EXTERNAL_LEXICON_EVIDENCE_GATE_VALIDATOR_V0_1_REVIEWED_ACCEPTED_READY_FOR_REVIEWED_SOURCE_ROW_CONTRACT.

Reviewed on: 2026-06-28.

Reviewed implementation:

* `src/shared/reviewedExternalLexiconEvidenceGate.validator.v0_1.ts`

Reviewed contract test:

* `tests/apiAnalyzeV1.reviewedExternalLexiconEvidenceGate.validatorContract.v0_1.spec.ts`

Reviewed implementation commit:

* Short SHA: `1636a935`
* Full SHA: `1636a9355da0500f02ad05bf97beeeb3055373f3`
* Subject: `test(open-instrument): implement reviewed external lexicon evidence gate validator v0.1`

Prerequisite validator contract review:

* `docs/open-instrument/reviews/reviewed-external-lexicon-evidence-gate-validator-contract-review-v0.1.md`

Prerequisite gate doc:

* `docs/open-instrument/reviewed-external-lexicon-evidence-gate-embryo-first-source-validation-v0.1.md`

Prerequisite gate review:

* `docs/open-instrument/reviews/reviewed-external-lexicon-evidence-gate-embryo-first-source-validation-review-v0.1.md`

Implementation status:

* REVIEWED_EXTERNAL_LEXICON_EVIDENCE_GATE_VALIDATOR_V0_1_IMPLEMENTED_PENDING_REVIEW

## Review decision

Accepted.

The reviewed external lexicon evidence gate validator implementation is accepted.

The implementation is accepted because it converts the prior test-local contract helper into a reusable shared validator seam without promoting live candidates.

The implementation is accepted because the existing contract test imports the shared validator and keeps the same blocked/eligible behavior.

## Accepted implementation scope

Accepted files:

* `src/shared/reviewedExternalLexiconEvidenceGate.validator.v0_1.ts`
* `tests/apiAnalyzeV1.reviewedExternalLexiconEvidenceGate.validatorContract.v0_1.spec.ts`

Accepted scope:

* reusable shared validator seam
* existing validator contract test updated to import shared seam
* no live source rows
* no `DA` promotion
* no `DI` promotion
* no analyze-v1 behavior change
* no API behavior change
* no UI/VM change
* no public schema tightening
* no fixture promotion into evidence
* no provider/model/replay execution
* no eval work
* no VoiceLab work
* no seven-voice-order work

## Accepted validator behavior

The review accepts that the validator preserves the external lexicon truth gate.

The validator keeps shape validity separate from evidence validity.

The validator blocks:

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
* symbolic resonance as validation
* historical context as validation

## Accepted DA quarantine behavior

The review accepts that `DA = split/divide` remains quarantined.

The validator keeps candidate:

`albanian-da-dam-damage-functional`

blocked unless reviewed exact external citation attests isolated `da` as split/divide or a future reviewed morphology route replaces the embryo.

The validator rejects:

* missing external citation
* `ndaj` / `ndarë` derivative evidence as proof of isolated two-letter `da`
* `da = gave` as homophone collision for the split/divide claim
* gloss mismatch for `da = gave`
* live validation of `DA` without reviewed exact external citation

## Accepted DI posture behavior

The review accepts that `DI = know` can become source-validation eligible only when the required evidence and bridge are present.

The validator keeps candidate:

`albanian-shtu-di-study-functional`

eligible only when:

* reviewed external citation attests `di` as know/knowledge
* `semanticBridge` is present
* source row status is reviewed accepted
* source kind is validating
* claim boundary fields remain false
* `userDecisionPosture: user_decides` is present

The validator blocks `DI` when the semantic bridge is missing.

The validator blocks `DI` when a reviewed citation does not attest `di` as know/knowledge.

The review confirms again that a real `DI` citation does not automatically prove the full `SHTU + DI → STUDY` composition.

## Accepted claim boundary behavior

The review accepts that source validation eligibility does not create an origin claim.

The implementation preserves:

* `originClaim: not_claimed`
* `userDecisionPosture: user_decides`

The validator does not prove:

* historical origin
* language superiority
* final etymology
* winner status
* candidate truth
* user decision

## Checkpoint-proof workflow lock

This review records the checkpoint-proof workflow.

After important implementation PRs, run a no-PR checkpoint proof before continuing into review or next contract lanes.

The checkpoint proof for this implementation confirmed:

* validator implementation exists
* direct validator probe passed
* `DI` synthetic fixture can be source-validation eligible without creating an origin claim
* `DI` missing bridge is blocked
* `SEED` is blocked
* `DA` without citation is blocked
* `DA` derivative evidence is blocked
* `DA = gave` homophone collision is blocked
* focused validator contract test passed
* embryo-first examples test passed
* embryo-first live contract test passed
* stress harness passed serially
* full `npm run gate:quick` passed
* repo remained clean

The checkpoint result also confirmed that current live examples remain bounded.

No `DA` or `DI` live promotion has happened yet.

That is expected until reviewed source rows and reviewed citations are wired.

## Next product-proof boundary

The next meaningful product-progress test should happen when reviewed source rows/citations are added.

Until then, the correct live behavior is still blocked/quarantined.

The next source-row lane must not invent citations.

The next source-row lane must either use reviewed external citation metadata or keep rows non-validating.

## Review outcome

Accepted.

The validator implementation status is now:

`REVIEWED_EXTERNAL_LEXICON_EVIDENCE_GATE_VALIDATOR_V0_1_REVIEWED_ACCEPTED_READY_FOR_REVIEWED_SOURCE_ROW_CONTRACT`

The next accepted task is:

`docs(open-instrument): define reviewed external lexicon source row contract v0.1`
