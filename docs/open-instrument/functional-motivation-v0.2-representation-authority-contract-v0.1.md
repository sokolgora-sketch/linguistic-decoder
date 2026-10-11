# OPEN INSTRUMENT — FUNCTIONAL MOTIVATION v0.2 REPRESENTATION AUTHORITY CONTRACT v0.1

Status: contract decision artifact only. This document does not implement a
pronunciation source, change candidate generation, enable runtime interpretation,
or activate Sanskrit.

## Purpose

This document records the terminal representation-authority decision required
by the completed Functional Motivation v0.2 production-admissibility review.
The decision is deliberately source- and language-independent: a retrieved
lexical candidate may enter the v0.2 structural path only when its
representation is independently authorized as comparable to the input.

The current product remains fail-closed. A Null result is valid and is not a
failure to be repaired by spelling, gloss, historical association, or a
candidate-specific exception.

## Prior architectural finding

The current architecture intentionally fails closed pending comparable
evidence:

- the full v0.2 admission conjunction is not reachable in the natural
  production path;
- no natural production non-self candidate currently has
  SAME_REPRESENTATION authority with the input;
- production structural authorization is therefore not reachable;
- reviewed functional evidence is reachable;
- the false-null diagnostic is deferred until a natural positive control can
  satisfy the representation contract.

The observed blocker is representation authority, not missing prose or a
missing winner-selection rule.

## Locked authority principles

This contract preserves the following:

1. Spoken-first analysis.
2. Orthographic form is not pronunciation authority.
3. A lexical gloss is not functional evidence by itself.
4. Reviewed functional evidence does not automatically provide pronunciation
   authority.
5. Source attestation does not automatically provide representation
   comparability.
6. Candidate pronunciation remains Null where no authorized pronunciation
   source exists.
7. Gamma derives from authorized pronunciation only.
8. Zero-consonantal structure derives from authorized pronunciation only.
9. Spoken comparison uses authorized pronunciation, never spelling
   masquerading as pronunciation.
10. Cross-representation evidence remains cross-representation unless an
    independently authorized bridge exists.
11. SAME_REPRESENTATION is an authority claim, not a convenience flag.
12. No consonant semantics are inferred.
13. No historical origin, cognacy, borrowing, or language-priority inference
    is introduced.
14. no_single_winner remains true.
15. user_decides remains the product boundary.
16. Null remains valid.
17. No word, language, candidate, or study-specific production exception is
    authorized.
18. No source gains authority merely because it helps the word study.

## Current authority gap

The generic witness source record currently carries lexical form, gloss,
citations, provenance, relation metadata, and technical reason codes, but no
authorized pronunciation field. The current candidate voice policies are:

- Albanian reviewed source: SOURCE_FORM_EXTRACTED; this is lexical/profile
  derived and not spoken-pronunciation authority.
- Latin S1 source: NULL_UNAUTHORIZED.
- English Kaikki source: NULL_UNAUTHORIZED.

The current Discovery comparison constructs a production_spoken input against
an orthographic_profile_derived candidate, with CROSS_REPRESENTATION and
NOT_COMPARABLE_ACROSS_REPRESENTATIONS. This is the correct fail-closed
classification for the current data.

## Representation authority taxonomy

### AUTHORIZED_SOURCE_PRONUNCIATION

The source supplies pronunciation data under an explicit contract that
authorizes the value for the candidate form and language or variety. This class
may support Gamma, zero-consonantal structure, and a spoken comparison,
subject to normalization, variant, scope, and evidence checks.

### AUTHORIZED_PROFILE_REPRESENTATION

An existing profile contract explicitly authorizes a representation. This is
not automatically equivalent to production_spoken. SAME_REPRESENTATION is
possible only when the input and candidate use the same compatible profile
contract and deterministic projection.

### ORTHOGRAPHIC_PROFILE_DERIVED

Structure derived from lexical spelling or an orthographic profile. It is not
spoken-pronunciation authority and cannot by itself establish a spoken
SAME_REPRESENTATION relation.

### UNKNOWN_OR_NULL

No representation authority sufficient for comparison is present. The
representation is Null or unknown and cannot be promoted by inference.

## SAME_REPRESENTATION definition

SAME_REPRESENTATION means that the input and candidate are authorized under
the same compatible representation contract, not merely that their strings,
letters, glosses, or derived profiles can be compared.

The relation requires all of the following:

1. Both sides have non-null representation authority.
2. The authority is explicit and reviewable.
3. The authority applies to the actual form and language or variety.
4. The authority scopes are compatible.
5. The notation and normalization contracts are compatible.
6. Segmentation and ordering are deterministic and compatible.
7. The projection into the compared representation is authorized on both
   sides.
8. No side is derived only from spelling when the comparison is spoken.
9. No unresolved ambiguity, unsupported variant, or representation bridge
   remains hidden.

String equality, shared letters, shared gloss, shared source family, reviewed
status, or a manually supplied comparison flag are not sufficient.

## Representation bridge policy

| Input representation | Candidate representation | Authority result |
| --- | --- | --- |
| Authorized source pronunciation | Production spoken | Authorizable only with an explicit source contract |
| Authorized profile representation | Same compatible profile | Authorizable only with an explicit profile contract |
| Authorized profile representation | Production spoken | Not authorized by this contract |
| Orthographic profile derived | Production spoken | Not authorized |
| External IPA or equivalent | Production spoken | Authorizable only with explicit source, notation, and projection contracts |
| Unknown or Null | Any representation | Not authorized |

An independently authorized bridge may be added in a future lane, but this
document does not select a provider or fabricate one.

## Source-family authority matrix

| Source family | Lexical/gloss authority | Reviewed functional evidence | Pronunciation authority | Current spoken comparability |
| --- | --- | --- | --- | --- |
| Reviewed Albanian candidate | Yes | Yes for the reviewed record | No | Null / not comparable |
| Latin S1 | Yes where attested | Source policy does not authorize it for this path | No | Null / not comparable |
| English Kaikki | Yes for lexical sense records | Source policy does not authorize it for this path | No | Null / not comparable |

The external English snapshot and deterministic index are available for the
already-authorized lexical inspection context. They are not pronunciation
authority and this lane performs no acquisition, network transfer, or source
content import.

## Minimum defensible authorization paths

### Path A — current lexical source pronunciation

Not available. The current generic witness contract has no pronunciation
field, and the current source-family records do not carry an independently
authorized candidate pronunciation.

### Path B — existing profile representation

Partially available as a representation mechanism, but not sufficient for the
current production functional path. A profile-derived value must have an
explicit compatible profile contract on both sides; an orthographic profile
cannot be promoted to production spoken.

### Path C — future explicit pronunciation source

Defensible and authorized for future work. A future source may provide
pronunciation under a source, notation, scope, normalization, variant, and
projection contract. This is the selected path, but no source is selected or
implemented here.

### Path D — no defensible path

Not selected because Path C is a narrow, evidence-grounded future path that
preserves the current Null boundary.

## DI and candidate firewall

The reviewed Albanian DI record is valid reviewed functional evidence. Its
current source form and profile-derived path do not provide pronunciation
authority. The observed input is production_spoken while the candidate is
orthographic_profile_derived, so it remains CROSS_REPRESENTATION and
NOT_COMPARABLE_ACROSS_REPRESENTATIONS.

The extracted I in the current adapter path is not spoken authority. No
candidate is promoted to SAME_REPRESENTATION to make study produce a
hypothesis.

## Genericity matrix

| Case | Functional evidence | Representation authority | Result |
| --- | --- | --- | --- |
| Reviewed lexical candidate without pronunciation | Possible | Missing | Null |
| Albanian lexical/profile-derived candidate | Possible | Orthographic/profile only | Null for spoken Same |
| Latin S1 candidate | Possible | Null unauthorized | Null |
| English Kaikki lexical-sense candidate | Lexical sense only | Null unauthorized | Null |
| Exact lexical self-match | Irrelevant | Any | Null by self-match exclusion |
| Ambiguous or unsupported representation variant | Possible | Unresolved | Null |
| Natural candidate with explicit authorized pronunciation | Possible | Authorized, compatible | Eligible for future contract checks |

No current natural production candidate has been established in the final row;
the row defines the future admissibility condition rather than reporting a
current positive result.

## Contract decision

REPRESENTATION_AUTHORITY_DECISION =
AUTHORIZE_FUTURE_EXPLICIT_PRONUNCIATION_PATH_ONLY

The current implementation must remain fail-closed. A future candidate may be
considered for the v0.2 structural path only after an explicit pronunciation
source contract supplies the required evidence and the representation
compatibility checks pass.

This is a generic contract decision, not a study-specific exception and not
an authorization to change current runtime behavior.

## Future candidate-pronunciation minimum contract

A future authorized candidate pronunciation record must preserve at least:

- source pronunciation value;
- notation;
- source or profile identity;
- source locator;
- source version or snapshot date;
- language and variety;
- authority status;
- deterministic normalization result;
- deterministic pronunciation-to-Voice projection contract;
- deterministic Gamma and zero-consonantal projection contract where applicable;
- variant identity and deterministic ordering;
- an explicit failure or Null reason when normalization or projection is not
  authorized.

The source record and its locator must remain recoverable. An adapter must not
replace raw provenance with a guessed normalized value.

## Future pronunciation authority rules

Only a reviewed, explicitly authorized pronunciation record may enter the
candidate spoken path. Spelling, transliteration, gloss, source family,
historical relation, and lexical similarity cannot substitute for it.

Normalization must be deterministic and source-contract-bound. Unsupported
notation, unresolved language/variety, malformed values, and ambiguous
variants remain Null with an explicit technical reason.

Variants remain individually recoverable and deterministically ordered. A
future selector may not silently discard variants or create a winner.

SAME_REPRESENTATION requires compatible authority scope, notation,
normalization, segmentation, ordering, and deterministic projection on both
sides. A future bridge must be explicit and reviewable.

## Existing authorized pronunciation contracts

The repository already contains the CMUdict ARPAbet en-US pronunciation-to-Voice
profile for authorized spoken input. That existing contract does not authorize
lexical source records to inherit its pronunciation. The current source-family
records therefore have no authorized candidate pronunciation field.

Existing authorized elements:

- source family: CMUdict ARPAbet en-US input pronunciation;
- field: authorized pronunciation variants;
- contract: deterministic pronunciation normalization and projection to Voice;
- normalization: source/profile-bound deterministic normalization;
- SAME_REPRESENTATION rule: compatible explicit representation authority is
  required;
- Null policy: missing, invalid, unsupported, or ambiguous authority remains
  Null.

No existing source-family candidate contract is extended by this document.

## Product posture and diagnostic disposition

V0_2_CURRENT_PRODUCT_POSTURE =
REMAINS_FAIL_CLOSED_PENDING_AUTHORIZED_PRONUNCIATION

FALSE_NULL_DIAGNOSTIC_DISPOSITION =
DEFERRED_PENDING_V0_2_REACHABILITY

FALSE_NULL_DIAGNOSTIC_RESUME_CONDITION =
Resume only when at least one natural production non-self candidate reaches
INTERPRETATIONS_FOUND under this contract with reviewed functional evidence and
explicit compatible representation authority. Do not manufacture the positive
control by mutating test metadata or by rerunning historical research.

TWO_MODE_DESIGN_STATUS = NOT_AUTHORIZED

The two-mode design is not enabled because the current product has no
authorized candidate pronunciation path. The current Null result remains the
truthful result.

## Explicit non-authorizations

This artifact does not authorize:

- a source acquisition or network request;
- an English, Albanian, Latin, or Sanskrit pronunciation claim;
- a source adapter change;
- a source registration change;
- a candidate producer change;
- a runtime or UI change;
- a spelling-to-pronunciation fallback;
- a gloss-to-pronunciation or gloss-to-evidence shortcut;
- promotion of an orthographic candidate to production spoken;
- a DI-specific rule;
- a preferred candidate or winner;
- a new interpretation result;
- a research rerun;
- a source import or index rebuild;
- S4 activation;
- production/test/runtime behavior changes.

## Scope and next action

The implementation scope of this lane is this contract artifact only. The
next authorized decision lane is:

NEXT_ACTION = PRONUNCIATION_SOURCE_CONTRACT_AND_SELECTION

After this lane, stop for DF. Do not execute the next action automatically.
