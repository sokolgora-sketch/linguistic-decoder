# Embryo-first candidate examples for damage and study v0.1 — Review

Status: LIVE_ANALYZE_V1_EMBRYO_FIRST_CANDIDATE_EXAMPLES_DAMAGE_STUDY_V0_1_REVIEWED_ACCEPTED_READY_FOR_NEXT_IMPLEMENTATION_LANE.

Reviewed on: 2026-06-26.

Reviewed PR:

* #1623 — `test(open-instrument): add embryo-first candidate examples for damage and study v0.1`

Reviewed main:

* Short SHA: `fefc82c7`
* Full SHA: `fefc82c7cf977b25bed3e16a173d09d3df1ce5ea`

Source status:

* LIVE_ANALYZE_V1_EMBRYO_FIRST_CANDIDATE_EXAMPLES_DAMAGE_STUDY_V0_1_ADDED_PENDING_REVIEW

## Review decision

Accepted.

The embryo-first candidate examples for `damage` and `study` are accepted as bounded example/contract tests.

The examples are accepted because they lock the intended embryo-first posture without changing runtime behavior.

The examples are accepted because they show how validated functional examples should rank ahead of seed/context examples, while preserving no-origin-claim posture.

The examples are accepted because they explicitly keep current live output bounded until real isolation evidence is wired.

## Reviewed file

Reviewed file:

* `tests/apiAnalyzeV1.embryoFirstCandidate.examples.v0_1.spec.ts`

No runtime files are part of this review.

No UI files are part of this review.

No schema files are part of this review.

## What the examples lock

The examples lock a bounded functional example for `damage`:

* `albanian-da-dam-damage-functional`
* display form: `DA → DAM → DAMAGE`
* claim type: `functionalMotivation`
* origin claim: `not_claimed`
* user decision posture: `user_decides`
* claim boundary: functional motivation example only; not historical origin

The examples lock a bounded functional example for `study`:

* `albanian-shtu-di-study-functional`
* display form: `SHTU + DI → STUDY`
* claim type: `functionalMotivation`
* origin claim: `not_claimed`
* user decision posture: `user_decides`
* claim boundary: functional motivation example only; not historical origin

The examples lock seed/context examples:

* `latin-damnum-seed-context`
* `latin-studium-seed-context`

Seed/context examples remain below functional examples.

Seed/context examples do not become historical-origin winners.

Seed/context examples do not become validated functional motivations.

## Ranking review

Accepted ranking behavior:

* `validatedFunctionalMotivation` ranks ahead of `surfaceOrSeedOnly`.
* functional examples have stronger rank scores than seed/context examples.
* rank posture does not create an origin claim.
* rank posture does not claim historical transmission.
* rank posture does not override user decision.

This matches the embryo-first method: smallest functional embryo first, larger/history/context after it, with user-decidable boundaries.

## Live-output boundary review

The examples intentionally do not promote live runtime candidates.

Current live `damage` and `study` output remains bounded.

Live output must continue to avoid full validation unless real isolation evidence exists.

Live output must continue to preserve:

* `originClaim: not_claimed`
* `userDecisionPosture: user_decides`
* no single historical winner
* no Albanian-origin claim
* no SEED auto-validation

The examples test correctly proves current live candidates remain blocked by missing isolation/source/bridge evidence.

## SEED boundary review

Accepted SEED boundary:

* `sourceKind: SEED` does not imply validation.
* SEED candidates may provide context.
* SEED candidates do not bypass the truth wall.
* SEED candidates do not outrank validated functional examples.
* SEED candidates do not become historical-origin winners.

## Origin boundary review

Accepted origin boundary:

* `originClaim` remains `not_claimed`.
* The examples do not claim Albanian historical origin.
* The examples do not reject Latin historical context.
* The examples do not declare a single winner.
* Historical transmission remains separate from functional motivation.
* User remains the final interpreter.

## Scope review

This PR is accepted because it changed one focused test file only.

Accepted scope:

* example/contract tests
* bounded `damage` and `study` examples
* ranking posture proof
* live bounded-output proof

Rejected for this lane:

* runtime changes
* API behavior changes
* strict candidate schema changes
* UI rendering changes
* VM type changes
* provider/model/replay execution
* fixture promotion into evidence
* VoiceLab work
* eval/seven-voice-order work

## Validation reviewed

The PR proved:

* `npm test -- tests/apiAnalyzeV1.embryoFirstCandidate.examples.v0_1.spec.ts --runInBand` passed.
* `npm test -- tests/apiAnalyzeV1.embryoFirstCandidate.contract.spec.ts --runInBand` passed.
* `npm test -- tests/apiAnalyzeV1.corpus.gold.spec.ts --runInBand` passed.
* `npm test -- tests/analyzeV1.adapter.contract.spec.ts --runInBand` passed.
* `npm test -- tests/apiAnalyzeV1.contract.spec.ts --runInBand` passed.
* `npm run gate:quick` passed before PR.
* GitHub PR checks passed.
* `npm run gate:quick` passed after merge.
* Post-merge file proof matched the focused test file only.
* Repo remained clean.

## Accepted limitations

These examples are not live promotion.

These examples are not external evidence.

These examples do not wire an isolation-evidence source.

These examples do not add UI display of embryo-first fields.

These examples do not tighten the analyze-v1 candidate schema.

These examples do not execute provider/model/replay work.

## Review outcome

Accepted.

The examples status is now:

`LIVE_ANALYZE_V1_EMBRYO_FIRST_CANDIDATE_EXAMPLES_DAMAGE_STUDY_V0_1_REVIEWED_ACCEPTED_READY_FOR_NEXT_IMPLEMENTATION_LANE`

The next accepted task is:

`docs(open-instrument): define live embryo-first isolation evidence source for damage and study v0.1`
