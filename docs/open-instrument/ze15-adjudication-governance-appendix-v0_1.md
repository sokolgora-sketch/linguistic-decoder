# ZE-15 cross-source adjudication governance appendix v0.1

Status: `PARTIAL_EVIDENCE_WITH_GAPS_AI_REVIEW_READY`

This appendix freezes the review governance envelope for the ZE-15 research
hypothesis manifest. It does not adjudicate `pelë → pelar`, does not activate
an alignment, and does not authorize production behavior.

## Review tracks

### `AI_REVIEW`

The approved AI track uses two designated, legitimate project co-architects:
`ChatGPT` and `DeepSeek`. A terminal AI review record requires two named and
distinct reviewer records, two distinct evidence-bound rationales, and proof
that each rationale was recorded before exposure to the other reviewer. The
owner must approve the terminal reviewed status explicitly. The AI track does
not require a human reviewer.

### `HUMAN_REVIEW`

The reserved human track uses two named and distinct human reviewers. Their
evidence-bound rationales must be recorded independently before comparison,
and the owner must approve the terminal reviewed status explicitly. This track
is reserved for future activation and is not required for the approved AI
track.

## Terminal reviewed statuses

The manifest recognizes two explicit terminal review statuses:

- `REVIEWED_ALIGNED_AI_OWNER_APPROVED`
- `REVIEWED_ALIGNED_HUMAN_OWNER_APPROVED`

Both statuses mean reviewed cross-source lexical alignment only. Neither
status authorizes:

- production `AGENT`;
- any functional operation;
- embryo function or an independent embryo meaning;
- a historical proto-root or etymological claim; or
- API or UI behavior changes.

The status, active `reviewTrack`, two reviewer records, exact evidence
references, and owner approval must agree. Missing, duplicated, or
contradictory metadata fails closed. A legacy `REVIEWED` value remains
parseable for backward compatibility, but is not one of these new terminal
governance statuses.

## Candidate rationales

`reviewCandidate` is a non-authoritative envelope for pre-approval rationale
records. Its status is `PRE_APPROVAL_CANDIDATE_RATIONALE`. Each record carries a
reviewer identity and kind, rationale text, exact manifest evidence references,
recording time, a `recordedBeforePeerExposure` assertion, and an audit-trail
provenance reference. Its presence does not complete review and does not
activate a review track. Until the terminal status and owner approval are
present, the manifest remains research-only.

The current repository and local ZE-15 audit artifacts do not contain
authenticated paired `ChatGPT` and `DeepSeek` pelar rationales. Accordingly,
the current `pelar` and `thëngjilltar` assertions leave `reviewCandidate`
unpopulated and remain `PROPOSED_NOT_REVIEWED` with `reviewTrack: NONE`.
No rationale is reconstructed or invented here.

## Validation versus adjudication

The parser distinguishes:

1. an invalid evidence envelope, returned as deterministic validation failure
   reason codes;
2. a valid but insufficient or unresolved hypothesis, retained as
   `UNKNOWN_OR_NULL` / nonterminal research evidence; and
3. a valid, explicitly reviewed alignment, which still remains a lexical
   research result and requires owner approval for its terminal status.

Reviewer disagreement, unresolved sense ambiguity, missing evidence references,
missing reviewer records, missing rationale, missing provenance, or missing
owner approval do not become alignment. A manifest carrying the explicit
`REVIEWER_DISAGREEMENT_RETAINED_UNRESOLVED` reason cannot use either terminal
reviewed status.

## Research-only firewall

Every projection from this manifest retains:

```text
functionalOperation = null
embryoFunction = UNKNOWN_OR_NULL
productionAuthorization = NOT_AUTHORIZED
historicalRelation = NOT_CLAIMED
winnerClaim = NOT_CLAIMED
userDecisionPosture = user_decides
noSingleWinner = true
```

The Albanian frozen source remains the lexical source authority and OEWN
remains separately attributed ontology evidence. A reviewed cross-source
alignment cannot by itself establish Albanian semantic authority, morphology,
historical relation, functional motivation, or embryo meaning.

## Current case boundaries

`pelë → pelar` retains its source-attested Albanian record and typed OEWN
occupational observations as a researcher-proposed, unresolved cross-source
candidate. `thëngjill → thëngjilltar` retains the exact `coal maker` gloss,
the lack of an exact OEWN join, rejection of unsupported synonym substitution,
and `UNKNOWN_OR_NULL` posture. Neither case is activated by this appendix.
