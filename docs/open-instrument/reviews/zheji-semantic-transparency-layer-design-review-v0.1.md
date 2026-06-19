# Zheji Semantic Transparency Layer v0.1 — Design Review

Status: REVIEWED_ACCEPTED.

Project lane: Open Instrument / ZËRO.

Reviewed artifact:

* `docs/open-instrument/zheji-semantic-transparency-layer-v0.1.md`

## Review decision

The design contract is accepted for the v0.1 milestone.

The design is safe to use as the basis for a later passive artifact scope lane.

This review does not authorize implementation by itself.

## Acceptance summary

The design correctly keeps semantic transparency as:

* candidate-only
* non-origin
* non-ownership
* evidence-anchored
* null-safe
* non-provider-executing
* non-runtime-wiring
* non-UI-wiring

The design avoids turning Zheji-inspired semantic motivation into a historical proof claim.

## Required contract properties verified

The design includes:

* canonical `semanticTransparency` layer name
* contract version posture
* non-runnable field catalogue
* `transparency_status` enum
* `claim_policy`
* Free Operator eligibility
* Free Operator candidate fields
* carrier claim rules
* Code F semantics
* Code E semantics
* Code F / Code E independence
* isolation audit
* witness levels
* null behavior
* source-note language
* required blocked claims
* examples and non-examples
* required future tests
* implementation gates
* out-of-scope list

## Truth posture review

Accepted truth posture:

* no single winner
* null is allowed
* candidates remain candidates
* provider-only support is rejected or downgraded
* forbidden origin claims are blocked
* forbidden ownership claims are blocked
* Code F and Code E do not prove origin
* Code F and Code E do not prove ownership

No design text authorizes a final etymology claim.

No design text authorizes a linguistic ownership claim.

No design text authorizes provider output as evidence.

## Free Operator review

Accepted.

The Free Operator eligibility rules are strict enough for v0.1 because they require the candidate to be:

* standalone enough
* function-bearing
* anchored to the evidence set
* not only a forced substring
* not only a sound association
* not provider-only
* not dependent on historical ownership

The rejection and downgrade rules are sufficient for v0.1.

## Code F / Code E review

Accepted.

The design correctly separates:

* Code F as formal or functional visibility
* Code E as experiential or symbolic visibility

The design correctly states that Code F and Code E are independent.

The design correctly prevents either code from proving origin or ownership.

## Isolation audit review

Accepted.

The required audit checks are sufficient for v0.1:

* standalone check
* function check
* substring force check
* semantic stretch check
* provider-only check
* origin claim check
* ownership claim check
* evidence anchor check

The block behavior is correct:

* failed origin claim check forces blocked status
* failed ownership claim check forces blocked status
* failed provider-only check rejects or downgrades the candidate

## Null behavior review

Accepted.

Null is explicitly valid.

This is required because the layer must not force a semantic carrier when evidence is weak or absent.

The listed null reasons are sufficient for v0.1.

## Source-note review

Accepted.

The design requires a source note that says the artifact records candidate semantic transparency and meaning-motivation only.

The note explicitly rejects origin, historical ownership, final etymology, and publication-grade proof.

## Required future tests review

Accepted.

Future tests must prove:

* no origin claim is emitted
* no ownership claim is emitted
* null result is allowed
* provider-only candidate is rejected or downgraded
* Code F and Code E are independent
* blocked forbidden claims force blocked status
* source note is present
* result remains candidate-only
* no runtime/API/UI wiring occurs unless separately authorized

These are the right test gates for a later passive artifact lane.

## Implementation gate review

Accepted with one hard restriction:

A later implementation lane must be limited to a passive schema, fixture, validation helper, or tests unless the user explicitly authorizes runtime or UI integration.

Runtime integration remains unauthorized.

UI integration remains unauthorized.

Provider execution remains unauthorized.

Zheji replay remains unauthorized.

## Required follow-up

The next safe step is not runtime implementation.

The next safe step is a passive artifact scope definition.

That follow-up should decide whether v0.1 proceeds with:

* passive fixture only
* passive JSON schema only
* validation helper only
* tests only
* or a staged combination

The follow-up must continue to block:

* provider execution
* Zheji replay
* runtime/API/UI wiring
* evidence pack generation
* publication framing
* origin evidence
* candidate-truth evidence
* model-quality evidence

## Review conclusion

The design contract is accepted.

The milestone remains open until the accepted passive artifact scope is defined and any approved passive artifacts are completed and validated.

## Current next task

`docs(open-instrument): define zheji semantic transparency passive artifact scope v0.1`
