# OPEN INSTRUMENT — FUNCTIONAL MOTIVATION v0.2 CMUDICT CANDIDATE-ROLE AUTHORITY CONTRACT v0.1

## Status and decision boundary

```text
STATUS=ADVISORY_PENDING_DF_RATIFICATION
CMUDICT_CANDIDATE_ROLE_AUTHORIZED_NOW=NO
DF_RATIFICATION_REQUIRED=YES
MERGING_THIS_ARTIFACT_DOES_NOT_AUTHORIZE_CMUDICT_CANDIDATE_ROLE=YES
```

This document is an advisory authority assessment. It does not grant the
existing CMUdict artifact a new analytical, candidate, representation, Voice,
Gamma, ZC, runtime, or UI role. The current CMUdict contract remains the
English spoken-input pronunciation contract. A distinct candidate-role
contract would require explicit DF ratification before any implementation or
runtime registration.

## Repository and source evidence

The assessment was made against `main` at:

```text
REPOSITORY=sokolgora-sketch/linguistic-decoder
MAIN_HEAD=58ebde5791a2956d311abf13f1f31b0cc4aded13
WORKTREE_STATUS=CLEAN_BEFORE_ADVISORY_ARTIFACT
```

The exact bundled source artifact currently used by the input-pronunciation
implementation is:

```text
PATH=src/data/openInstrument/pronunciation/cmudict.dict
SOURCE_FAMILY=CMUDICT
SOURCE_REVISION=74790861f652b15e4ac49015a90074ad62a27690
SOURCE_NOTATION=ARPABET
BYTES=3618488
SHA256=81917843c7f44ce2b094ac63873c2c7a4cf802040792c455ba3ca406891c3d22
PROFILE_ID=open-instrument.cmudict-arpabet-en-us.v0_1
LICENSE_PATH=src/data/openInstrument/pronunciation/cmudict.LICENSE
LICENSE_SHA256=bd4ce8e44170a5f9f481310ca85c51de3c4f851a65e679b40e603b143bd3542a
```

The repository README identifies Carnegie Mellon CMUdict, its upstream
revision, ARPABET notation, the exact hash and byte count, and an offline
hash-bound posture. The included license is a permissive BSD-like license with
the source notice, disclaimer, and attribution request. This document makes no
independent legal conclusion.

## Current authorized input role

The current implementation is an English spoken-input authority only:

```text
CMUDICT_INPUT_ROLE_AUTHORIZED=YES
CMUDICT_INPUT_ROLE_AUTHORITY_SOURCE=src/shared/openInstrument/pronunciationToVoice.v0_1.ts and docs/open-instrument/pronunciation-to-voice-authority-contract-v0.1.md
CMUDICT_INPUT_LOOKUP_KEY=NFC -> trim -> locale-independent lowercase -> lookup
CMUDICT_INPUT_LANGUAGE_SCOPE=English; CMUdict documented English pronunciation inventory
CMUDICT_INPUT_VARIANT_POLICY=preserve source variants and order; equivalent resolved paths may be accepted; differing, unsupported, or ambiguous variants fail closed
CMUDICT_INPUT_PRONUNCIATION_NOTATION=ARPABET with optional stress digits 0, 1, or 2
CMUDICT_INPUT_NORMALIZATION_AUTHORITY=INPUT_PRONUNCIATION_CONTRACT_ONLY
CMUDICT_INPUT_VOICE_PROJECTION_AUTHORITY=REVIEWED_OPEN_INSTRUMENT_MAPPING for the frozen ARPABET vowel inventory
CMUDICT_INPUT_GAMMA_AUTHORITY=NOT_AUTHORIZED_BY_THIS_SOURCE_CONTRACT
CMUDICT_INPUT_ZC_AUTHORITY=NOT_AUTHORIZED_BY_THIS_SOURCE_CONTRACT
CMUDICT_INPUT_REPRESENTATION_AUTHORITY=INPUT_SPOKEN_REPRESENTATION_ONLY
```

`src/shared/openInstrument/cmudictArpabetPronunciation.v0_1.ts` preserves the
source form, variant identity and order, raw pronunciation, source units,
source profile, revision, and notation. The pronunciation-to-Voice module
maps only the reviewed frozen vowel categories, keeps stress as metadata, and
returns typed Null outcomes for missing, unsupported, ambiguous, or unresolved
authority. The existing contract explicitly states that input authority does
not flow automatically to lexical candidate records.

## Candidate-role assessment

```text
CMUDICT_ROLE_RELATIONSHIP=INPUT_AUTHORITY_IS_DISTINCT_FROM_CANDIDATE_PRONUNCIATION_AUTHORITY
CMUDICT_CANDIDATE_ROLE_ASSESSMENT=DEFENSIBLE_AS_A_SEPARATE_SOURCE-PRONUNCIATION_ROLE
CMUDICT_CANDIDATE_ROLE_RECOMMENDATION=RECOMMEND_AUTHORIZE_CANDIDATE_ROLE
PROPOSED_CANDIDATE_ROLE_CONTRACT_COMPLETE=YES_AS_AN_ADVISORY_PROPOSAL_PENDING_DF_RATIFICATION
```

The positive assessment is limited. The same exact hash-bound artifact carries
the source form, terminal variant identity, source variant order, raw ARPABET
pronunciation, source profile, source revision, and source notation needed for
a separately identified candidate source-pronunciation fact. It can therefore
be joined to an English lexical source at an exact lexical-form boundary and
retain every matching source record without selecting a semantic winner.

This evidence does not establish that a lexical candidate has an authorized
spoken representation, Voice path, Gamma path, consonantal structure, or
functional interpretation. It also does not establish that a CMUdict
pronunciation is sense-specific. Candidate pronunciation must remain a source
fact attachment, not a semantic-sense assertion.

## Proposed candidate-role contract

The following is the proposed contract for DF review. It is not active.

```text
PROPOSED_CANDIDATE_ROLE_CONTRACT=
  ROLE: English lexical-candidate source pronunciation attachment only;
  SOURCE: the exact hash-bound CMUdict artifact identified above;
  INPUT: an already-existing English lexical candidate source form;
  JOIN: exact NFC -> locale-independent English lowercase using en-US -> NFC;
  MATCH: candidate source form to CMUdict lexical word after terminal numeric
         variant-suffix removal;
  OUTPUT: every matching CMUdict source record with source form, variant id,
          variant order, raw pronunciation, source units, profile, revision,
          notation, and exact source locator preserved;
  FIREWALL: no sense binding, semantic inference, winner selection, filtering,
             ranking, candidate eligibility change, Voice projection, Gamma,
             ZC, representation bridge, historical claim, or runtime use;
  FAILURE: missing, malformed, unsupported, ambiguous, collision-prone, or
           unauthorized attachment remains Null with an exact reason;
  AUTHORIZATION: requires explicit DF ratification before implementation.
```

The candidate-role implementation, if later ratified, must be additive. It
must not alter the raw analytical candidate record set, generic witness
eligibility, retrieval, source data, analytical identity, or source-family
registration. Any already-existing source-family metadata may be projected
through a strictly additive presentation/authority boundary only.

## Join, identity, and variant policy

```text
ENGLISH_LEXICAL_TO_CMUDICT_RELATION_CLASSIFICATION=EXACT_FORM_JOIN
PROPOSED_JOIN_KEY=NFC -> locale-independent English lowercase using en-US -> NFC
PROPOSED_JOIN_AUTHORITY=separate ratified candidate-role contract bound to the exact artifact, revision, notation, byte count, and SHA-256
JOIN_AMBIGUITY_POLICY=preserve every matching lexical source record and every matching CMUdict variant; no winner; a CMUdict normalized-key collision is explicitly ambiguous and the pronunciation attachment is Null
CMUDICT_CASE_COLLISION_PREDICATE=two or more distinct CMUdict base sourceForm strings, compared before locale-independent lowercase, produce the same NFC/en-US-lowercase/NFC key
CMUDICT_CASE_COLLISION_OUTCOME=retain all lexical source records and their provenance, attach no CMUdict pronunciation, emit exact reason PRONUNCIATION_JOIN_COLLISION, and do not choose a representative spelling
LEXICAL_SOURCE_MULTIPLICITY_OUTCOME=multiple lexical records sharing a normalized key remain separate postings; multiplicity alone does not select, filter, rank, or merge records
PRONUNCIATION_ATTACHMENT_IDENTITY=LEXICAL_FORM_AND_CMUDICT_SOURCE_RECORD
SENSE_BINDING_AUTHORIZED=NO
```

The English lexical source preserves repeated source records, part of speech,
senses, source order, and source provenance. A pronunciation match therefore
must not collapse records merely because their displayed word is equal. The
same CMUdict variant may be attached as a source fact to multiple lexical
records with the same exact join key, while semantic binding remains
unauthorized.

```text
PROPOSED_CANDIDATE_VARIANT_POLICY=preserve all CMUdict variants and source order as evidence; do not select a pronunciation winner; same-path acceptance, if ever authorized, must be explicit in the candidate-role contract; differing, unsupported, malformed, or unresolved variants -> Null
VARIANT_WINNER_SELECTION=NO
NO_SINGLE_WINNER_PRESERVED=YES
CANDIDATE_SOURCE_PRONUNCIATION_ROLE=PROPOSED_SOURCE_FACT_ONLY
CANDIDATE_NOTATION_AUTHORITY_NOW=NO
CANDIDATE_NORMALIZATION_AUTHORITY_NOW=NO
```

The current parser inventory contains source rows with apostrophes and hyphens,
many terminal numeric variants, and a small set of rows with trailing inline
annotations. The proposed source-line grammar is frozen for DF review as:

```text
CMUDICT_SOURCE_LINE_GRAMMAR=sourceForm SP pronunciationToken (SP pronunciationToken)* (SP # SP annotationText)?; sourceForm is one non-whitespace token; pronunciationToken is an uppercase ARPABET symbol with optional terminal stress digit 0, 1, or 2; # begins the optional annotation suffix only when it is a separate token after at least one pronunciationToken; annotationText is preserved opaquely through end-of-line and is not a pronunciation unit
CMUDICT_SOURCE_LINE_ANNOTATION_POLICY=preserve the exact annotation suffix as source-line provenance; exclude # and annotationText from sourceUnits; do not interpret, normalize, or use annotationText for candidate matching
CMUDICT_SOURCE_LINE_FAILURE_POLICY=if the line has no pronunciationToken, an unknown token before #, a # that is not a separate suffix token, or any other grammar violation, reject that source record with exact reason CMUDICT_SOURCE_LINE_MALFORMED; do not silently reinterpret the material
```

This grammar accounts for rows such as `aalborg AO1 L B AO0 R G # place,
danish`: the ARPABET tokens are source units and `# place, danish` is opaque
provenance. A future candidate-role implementation must use the same predicate
and outcome for normalized-key collisions above. It must not silently treat
annotation tokens as pronunciation units or resolve a case-fold collision by
spelling preference.

## Explicit non-authorizations

```text
CMUDICT_CANDIDATE_ROLE_AUTHORIZED_NOW=NO
DF_RATIFICATION_REQUIRED=YES
CANDIDATE_VOICE_PROJECTION_AUTHORITY=NOT_AUTHORIZED
CANDIDATE_GAMMA_PROJECTION_AUTHORITY=NOT_AUTHORIZED
CANDIDATE_ZC_PROJECTION_AUTHORITY=NOT_AUTHORIZED
REPRESENTATION_BRIDGE_AUTHORITY=NOT_AUTHORIZED
SAME_REPRESENTATION_AUTHORIZED_NOW=NO
NATURAL_V0_2_POSITIVE_CONTROL_ESTABLISHED=NO
ALBANIAN_PATH_IN_SCOPE=NO
PROFILE_IDENTITY_DIVERGENCE_IN_SCOPE=NO
FALSE_NULL_DIAGNOSTIC_DISPOSITION=OUT_OF_SCOPE
TWO_MODE_DESIGN_STATUS=NOT_AUTHORIZED
```

Merging this advisory document does not authorize candidate lookup, adapter
wiring, source registration, projection, runtime/UI changes, representation
bridges, false-Null work, two-mode design, Albanian work, profile divergence,
or S5. It does not make CMUdict a lexical source, a functional source, or a
historical authority.

## Recommendation and next lane

```text
NEXT_RECOMMENDED_LANE=CMUDICT_CANDIDATE_ROLE_DF_RATIFICATION
NEXT_ACTION=AWAIT_DF_DECISION
```

DF should ratify or reject the proposed candidate role as a separate contract.
Until ratification, the only active CMUdict role remains the existing English
spoken-input pronunciation role.
