# Zheji Semantic Transparency Layer v0.1 — Design Contract

Status: DESIGN.

Project lane: Open Instrument / ZËRO.

## Contract boundary

This document defines a design contract only.

It does not create a JSON schema file.
It does not create a TypeScript schema.
It does not create runtime code.
It does not create provider execution.
It does not create Zheji replay.
It does not create UI wiring.
It does not create evidence packs.
It does not create publication framing.

## Purpose

The Zheji Semantic Transparency Layer lets ZËRO describe whether a candidate word analysis has visible meaning-motivation through small functional carriers.

The layer is designed to answer this kind of question:

Can the analyzed word be explained as a transparent composition of smaller functional carriers, without claiming that those carriers prove historical origin?

The layer must preserve ZËRO's core truth posture:

* candidates are candidates
* no single winner
* null is allowed
* evidence must be anchored
* origin is not claimed
* ownership is not claimed
* provider output is not evidence unless separately authorized

## Required user-facing posture

Allowed posture:

* semantic motivation
* functional carrier
* candidate transparency
* meaning-motivation
* witness strength
* isolation audit
* non-origin explanation
* non-ownership explanation

Forbidden posture:

* true origin
* proven origin
* final etymology
* linguistic ownership
* candidate truth
* historical certainty
* publication-grade proof
* provider-confirmed truth

## Layer name

Canonical layer name:

* `semanticTransparency`

Canonical contract version:

* `zheji_semantic_transparency.v0.1`

Canonical proof posture:

* `design_only_non_wiring`

## Non-runnable field catalogue

This is a field catalogue, not a runnable schema.

The future `semanticTransparency` object should contain these fields:

* `schema_version`
* `posture`
* `target_word`
* `normalized_word`
* `surface_vowels`
* `functional_vowel_path`
* `transparency_status`
* `claim_policy`
* `free_operator_candidates`
* `carrier_claims`
* `code_f`
* `code_e`
* `isolation_audit`
* `witnesses`
* `blocked_claims`
* `null_reason`
* `source_note`
* `diagnostic_notes`

## transparency_status enum

Allowed statuses:

* `not_evaluated`
* `null_no_transparency`
* `insufficient_evidence`
* `candidate_transparency`
* `partial_transparency`
* `strong_candidate_transparency`
* `blocked_forbidden_claim`

No status may mean proven origin.

No status may mean candidate truth.

No status may mean language ownership.

## claim_policy

The required policy is:

* `no_single_winner`
* `non_origin_claim`
* `non_ownership_claim`
* `candidate_only`
* `evidence_anchored`
* `null_allowed`

If any future output lacks this policy, the transparency result must be treated as invalid.

## Free Operator eligibility

A Free Operator candidate is a proposed small functional carrier.

A candidate may be treated as Free Operator eligible only if it is:

* standalone enough to be cited as a carrier
* function-bearing
* anchored to the candidate language or evidence set
* not only a forced substring
* not only a sound association
* not only provider-suggested
* not dependent on hidden historical ownership
* not dependent on final-origin claims

A candidate must be rejected or downgraded if it requires:

* major semantic stretching
* unanchored intuition
* phonetic similarity without function
* provider-only support
* circular explanation
* invented morphology
* historical certainty not present in evidence

## Free Operator candidate fields

Each future free operator candidate should include:

* `operator_id`
* `surface_form`
* `language`
* `function_gloss`
* `carrier_type`
* `eligibility_status`
* `eligibility_reasons`
* `block_reasons`
* `evidence_anchors`
* `confidence_label`

Allowed `eligibility_status` values:

* `eligible_candidate`
* `partial_candidate`
* `rejected_forced_substring`
* `rejected_semantic_stretch`
* `rejected_provider_only`
* `rejected_unanchored`
* `not_evaluated`

Allowed `carrier_type` values:

* `standalone_word`
* `bound_morpheme_candidate`
* `function_root_candidate`
* `semantic_echo`
* `unknown`

`semantic_echo` is weak by default.

## carrier_claims

Carrier claims must be separate from origin claims.

Allowed claim wording:

* "candidate carrier may motivate this function"
* "candidate carrier has partial semantic transparency"
* "candidate carrier is functionally aligned"
* "candidate carrier is insufficiently anchored"
* "no transparent carrier found"

Forbidden claim wording:

* "this carrier proves origin"
* "this carrier is the true root"
* "this language owns the word"
* "this candidate is historically proven"
* "provider confirmed the answer"

## Code F

Code F means formal or functional visibility.

It should answer:

Can the candidate carrier be visibly separated and assigned a plausible function without forcing the word?

Allowed `code_f.status` values:

* `not_evaluated`
* `visible`
* `partial`
* `blocked`
* `absent`

Code F must not imply origin.

Code F must not imply Code E.

## Code E

Code E means experiential or symbolic visibility.

It should answer:

Does the candidate carrier carry a symbolic or experiential meaning relationship that can be described without claiming proof?

Allowed `code_e.status` values:

* `not_evaluated`
* `visible`
* `partial`
* `blocked`
* `absent`

Code E must not imply origin.

Code E must not imply Code F.

## Code F / Code E independence

Code F and Code E are independent.

Allowed combinations:

* F visible / E absent
* F absent / E visible
* F partial / E partial
* F blocked / E visible
* F visible / E blocked

No combination proves origin.

No combination proves ownership.

## Isolation audit

The isolation audit prevents forced interpretation.

Required audit checks:

* `standalone_check`
* `function_check`
* `substring_force_check`
* `semantic_stretch_check`
* `provider_only_check`
* `origin_claim_check`
* `ownership_claim_check`
* `evidence_anchor_check`

Allowed audit statuses:

* `pass`
* `warn`
* `fail`
* `not_evaluated`

If `origin_claim_check` fails, transparency status must be `blocked_forbidden_claim`.

If `ownership_claim_check` fails, transparency status must be `blocked_forbidden_claim`.

If `provider_only_check` fails, the candidate must be rejected or downgraded.

## Witness levels

The layer should use witness levels, not winner labels.

Allowed witness levels:

* `fact`
* `rule_inference`
* `hypothesis`
* `weak_echo`
* `blocked`

Minimum witness set for a candidate transparency claim:

* input normalization witness
* vowel path witness
* carrier function witness
* isolation audit witness

If fewer than these witnesses exist, the status must be `insufficient_evidence` or `null_no_transparency`.

## Null behavior

Null is valid.

Allowed null reasons:

* `no_free_operator_candidate`
* `no_functional_alignment`
* `insufficient_evidence`
* `forced_substring_only`
* `provider_only_support`
* `forbidden_origin_claim`
* `forbidden_ownership_claim`
* `not_evaluated`

Null must not be treated as a failure.

Null means the system preserved truth posture.

## Source-note language

Every future result must include a source note with this meaning:

This artifact records candidate semantic transparency and meaning-motivation only. It does not claim origin, historical ownership, final etymology, or publication-grade proof.

## Required blocked_claims list

Every future result must explicitly block:

* `proven_origin`
* `true_origin`
* `final_etymology`
* `linguistic_ownership`
* `candidate_truth`
* `provider_as_evidence`
* `publication_grade_proof`

## Example: transparent candidate without origin claim

Target:

* `study`

Possible candidate carriers:

* `SHTU`
* `DI`

Allowed interpretation:

* A candidate analysis may describe `SHTU + DI` as a functional decomposition if carrier evidence is anchored and the isolation audit passes.

Forbidden interpretation:

* The system must not claim that this proves the historical origin of `study`.

## Example: null result

Target:

* any word with no anchored carrier set

Allowed interpretation:

* `transparency_status=null_no_transparency`
* `null_reason=no_free_operator_candidate`

Forbidden interpretation:

* The system must not force a carrier because the vowel path looks interesting.

## Example: blocked result

A result must be blocked if it says:

* "this language owns the word"
* "this is the true origin"
* "the provider verified the root"

Required status:

* `blocked_forbidden_claim`

## Required future tests

If this design is later implemented, tests must prove:

* no origin claim is emitted
* no ownership claim is emitted
* null result is allowed
* provider-only candidate is rejected or downgraded
* Code F and Code E are independent
* blocked forbidden claims force blocked status
* the source note is present
* the result remains candidate-only
* no runtime/API/UI wiring occurs unless separately authorized

## Implementation gates

This design does not authorize implementation.

A later implementation PR must explicitly state which of these is authorized:

* passive schema only
* fixture only
* validation helper only
* tests only
* runtime integration
* UI integration

If runtime integration or UI integration is not explicitly authorized, it is forbidden.

## Out of scope

Out of scope for v0.1 design:

* provider execution
* local model execution
* OpenAI API use
* Zheji replay
* consonant-frame extraction
* engine scoring changes
* candidate ranking changes
* source-engine provenance changes
* evidence-pack generation
* public report generation
* UI display changes
* API response changes
* VoiceLab work
* Harmony work

## Milestone completion path

This design supports the existing milestone sequence:

1. Milestone opened.
2. Design contract created.
3. Design contract reviewed.
4. Passive schema or fixture may be considered only after review.
5. Tests may be considered only after schema/fixture scope is accepted.
6. Milestone closes only after final validation and DF_BRAIN closure update.

## Current next task

`docs(open-instrument): review zheji semantic transparency layer design v0.1`
