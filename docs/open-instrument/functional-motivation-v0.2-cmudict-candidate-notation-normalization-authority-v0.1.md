# OPEN INSTRUMENT — FUNCTIONAL MOTIVATION v0.2 CMUDICT CANDIDATE NOTATION AND NORMALIZATION AUTHORITY v0.1

## Status and decision boundary

```text
STATUS=ADVISORY_PENDING_DF_RATIFICATION
DF_CMUDICT_CANDIDATE_ROLE_RATIFICATION_STATUS=RATIFIED
CMUDICT_CANDIDATE_ROLE_AUTHORITY=RATIFIED
CMUDICT_CANDIDATE_ROLE_AUTHORIZED_NOW=YES
CANDIDATE_NOTATION_AUTHORITY_NOW=NO
CANDIDATE_NORMALIZATION_AUTHORITY_NOW=NO
DF_NOTATION_RATIFICATION_REQUIRED=YES
DF_NORMALIZATION_RATIFICATION_REQUIRED=YES
MERGING_THIS_ARTIFACT_DOES_NOT_AUTHORIZE_CANDIDATE_NOTATION=YES
MERGING_THIS_ARTIFACT_DOES_NOT_AUTHORIZE_CANDIDATE_NORMALIZATION=YES
```

This is an advisory authority-contract artifact. DF has ratified the English
CMUdict lexical-candidate source-pronunciation role prospectively after PR
#2168. This artifact assesses, but does not grant, candidate-scoped notation or
normalization authority. It does not implement a candidate adapter, change
runtime behavior, or authorize Voice, Gamma, ZC, representation, or functional
interpretation paths.

## Repository and ratification history

```text
REPOSITORY=sokolgora-sketch/linguistic-decoder
MAIN_HEAD=abe09e75efb5046fabcaa608a05c1a2d1a6b16d3
WORKTREE_STATUS=CLEAN_BEFORE_ADVISORY_ARTIFACT
HISTORICAL_S5_BRANCH=codex/s5-sanskrit-gloss-contract-resolution-v0-1
HISTORICAL_S5_HEAD=6d5bf985f1ca2763b8d41f3d4fa0735d689a1c30
PR2168_MERGE_AUTHORITY_STATUS=ADVISORY_PENDING_DF_RATIFICATION
CURRENT_CMUDICT_CANDIDATE_ROLE_STATUS=RATIFIED_POST_MERGE_BY_DF
PR2168_HISTORY_REWRITTEN=NO
```

PR #2168 was correct when merged as advisory. This section records a
prospective DF ratification and does not rewrite the historical merge state.
The ratified role is limited to an English lexical-candidate
source-pronunciation fact attached to the exact CMUdict source record.

```text
SENSE_BINDING_AUTHORIZED=NO
VARIANT_WINNER_SELECTION=NO
NO_SINGLE_WINNER_PRESERVED=YES
PRONUNCIATION_ATTACHMENT_IDENTITY=LEXICAL_FORM_AND_CMUDICT_SOURCE_RECORD
SOURCE_TRACEABILITY_REQUIRED=YES
```

The role does not grant candidate notation, candidate normalization, Voice,
Gamma, ZC, representation-bridge, SAME_REPRESENTATION, runtime, or positive
control authority.

## Exact CMUdict artifact identity

```text
CMUDICT_ARTIFACT_IDENTITY=path=src/data/openInstrument/pronunciation/cmudict.dict; bytes=3618488; sha256=81917843c7f44ce2b094ac63873c2c7a4cf802040792c455ba3ca406891c3d22; revision=74790861f652b15e4ac49015a90074ad62a27690; notation=ARPABET; profile=open-instrument.cmudict-arpabet-en-us.v0_1
CMUDICT_LICENSE_PATH=src/data/openInstrument/pronunciation/cmudict.LICENSE
CMUDICT_LICENSE_SHA256=bd4ce8e44170a5f9f481310ca85c51de3c4f851a65e679b40e603b143bd3542a
CMUDICT_LANGUAGE_SCOPE=English
CMUDICT_DIALECT_SCOPE=CMUdict documented English pronunciation inventory
```

The repository README and pronunciation source contract bind the artifact to
the revision, bytes, hash, ARPABET notation, and English scope. The included
license carries a source notice, disclaimer, and attribution request. No
independent legal conclusion is made here.

## Four independently auditable operations

### A. Lexical join normalization

```text
LEXICAL_JOIN_NORMALIZATION_CLASSIFICATION=ACTIVE_RATIFIED_CANDIDATE_ROLE_JOIN_BOUNDARY
LEXICAL_JOIN_NORMALIZATION_AUTHORITY=RATIFIED_AS_PART_OF_CANDIDATE_ROLE
LEXICAL_JOIN_NORMALIZATION_RULE=NFC -> locale-independent English lowercase using en-US -> NFC
```

The join key is used only to relate an existing English lexical candidate form
to a CMUdict source form after terminal numeric variant-suffix removal. It is
not pronunciation-token normalization and does not create a pronunciation
meaning. Raw source form and variant identity remain recoverable.

```text
CMUDICT_CASE_COLLISION_PREDICATE=two or more distinct CMUdict base sourceForm strings, compared before locale-independent lowercase, produce the same NFC/en-US-lowercase/NFC key
CMUDICT_CASE_COLLISION_OUTCOME=retain all lexical records and provenance; attach no CMUdict pronunciation; emit PRONUNCIATION_JOIN_COLLISION; choose no representative spelling
LEXICAL_SOURCE_MULTIPLICITY_OUTCOME=multiple lexical records sharing a normalized key remain separate postings; multiplicity does not select, filter, rank, or merge records
```

Load-bearing implementation evidence: `normalizeLexicalWordV0_1` and
`normalizeCmuDictLexicalWordV0_1` in
`src/shared/openInstrument/cmudictArpabetPronunciation.v0_1.ts:30-32,99-101`.
The candidate role may use the ratified join boundary; it must not treat the
input-role Voice result as inherited candidate authority.

### B. Source-line parsing

```text
SOURCE_LINE_PARSING_CLASSIFICATION=RATIFIED_CANDIDATE_SOURCE-EVIDENCE_BOUNDARY
CMUDICT_SOURCE_LINE_GRAMMAR_AUTHORITY=RATIFIED_AS_PART_OF_CANDIDATE_ROLE
CMUDICT_SOURCE_LINE_ANNOTATION_AUTHORITY=RATIFIED_AS_PART_OF_CANDIDATE_ROLE
CMUDICT_SOURCE_LINE_FAILURE_AUTHORITY=RATIFIED_AS_PART_OF_CANDIDATE_ROLE
```

The ratified source grammar is:

```text
sourceForm SP pronunciationToken (SP pronunciationToken)* (SP # SP annotationText)?
```

`sourceForm` is one non-whitespace token. A pronunciation token is an
uppercase ARPABET symbol with optional terminal stress digit `0`, `1`, or `2`.
`#` begins the annotation suffix only when it is a separate token after at
least one pronunciation token. Annotation text is opaque end-of-line
provenance and is not a pronunciation unit. A malformed line, unknown token,
invalid stress digit, or invalid annotation boundary fails closed as
`CMUDICT_SOURCE_LINE_MALFORMED` in the proposed candidate contract.

The current input loader in
`src/shared/openInstrument/cmudictArpabetPronunciation.v0_1.ts:43-83` is
evidence of current behavior, not automatic candidate authority. It trims the
line, skips blank/`;;;` lines, splits at the first space, stores the remaining
text as `sourcePronunciation`, and splits it into `sourceUnits`. It does not
validate the frozen candidate grammar or exclude `#` annotation tokens. A
future candidate implementation must not silently reuse that permissive
behavior as a notation contract.

`splitVariantSuffixV0_1` at `src/shared/openInstrument/cmudictArpabetPronunciation.v0_1.ts:34-41`
recognizes a terminal numeric `(N)` suffix for variant identity. The suffix is
source-form metadata, not a pronunciation token and not a candidate winner.

### C. Pronunciation notation authority

```text
CANDIDATE_ARPABET_NOTATION_ASSESSMENT=DEFENSIBLE
CANDIDATE_ARPABET_NOTATION_RECOMMENDATION=RECOMMEND_AUTHORIZE
CANDIDATE_ARPABET_NOTATION_ASSESSMENT_REASON=exact hash-bound English CMUdict artifact, declared ARPABET source notation, frozen 39-symbol observed inventory, stress digits 0|1|2, reviewed input-role ARPABET profile, deterministic source grammar, and source-preserving failure behavior support a separate source-fact notation contract without importing Voice semantics
```

The recommendation is limited to an explicit candidate-scoped source-notation
contract pending DF ratification. It is supported by the source's declared
ARPABET notation, the exact revision/hash-bound artifact, the documented
English scope, the observed frozen symbol inventory, the reviewed existing
ARPABET source profile, and deterministic stress/variant/provenance handling.
It does not borrow downstream Voice meanings.

The evidence also identifies a boundary: the current input parser accepts any
uppercase token matching `^([A-Z]+)([012])?$` at
`src/shared/openInstrument/pronunciationToVoice.v0_1.ts:130-139`, and the
current input resolver maps recognized tokens into Voice-family structures.
That implementation is not sufficient by itself to grant candidate notation
authority. The candidate contract must validate the source grammar and exact
inventory before any future structural use.

### D. Pronunciation normalization

```text
CANDIDATE_PRONUNCIATION_NORMALIZATION_CLASSIFICATION=NOT_NEEDED
CANDIDATE_PRONUNCIATION_NORMALIZATION_ASSESSMENT=NOT_NEEDED
CANDIDATE_PRONUNCIATION_NORMALIZATION_ASSESSMENT_REASON=raw authorized CMUdict tokens are already canonical source spellings; only lossless parsing and stress metadata exposure are needed, while input-role base-category and Voice transformations are projection-coupled
CANDIDATE_PRONUNCIATION_NORMALIZATION_RECOMMENDATION=RECOMMEND_NO_SEPARATE_NORMALIZATION
STRESS_HANDLING=preserve terminal 0|1|2 in the raw token and expose stress as metadata; no stress semantic authority
TOKEN_CASE_NORMALIZATION=FORBIDDEN; require uppercase source notation
WHITESPACE_NORMALIZATION=lossless token-boundary parsing only; preserve exact raw-line provenance
RAW_TOKEN_PRESERVATION=LOSSLESS_REQUIRED
CANONICAL_TOKEN_FORM=raw source token; base-plus-stress is a lossless derived view only
UNKNOWN_TOKEN_POLICY=retain evidence and fail closed as CMUDICT_ARPABET_TOKEN_UNSUPPORTED or CMUDICT_SOURCE_LINE_MALFORMED
MALFORMED_TOKEN_POLICY=do not repair or reinterpret; fail closed as CMUDICT_SOURCE_LINE_MALFORMED
DUPLICATE_PATH_POLICY=preserve all variants; no path winner; unresolved disagreement remains Null
VARIANT_PRESERVATION=preserve source form, variant identity, and source variant order
```

The candidate role does not need a second pronunciation-normalization doctrine
before later projection. Authorized CMUdict tokens are already source-canonical
ARPABET spellings. The minimum candidate boundary is a lossless token sequence
with stress metadata and raw source preservation. The input-role transformation
that derives base categories and Voice anchors is projection-coupled and cannot
be inherited as candidate normalization.

## Candidate ARPABET notation contract proposal

```text
PROPOSED_CANDIDATE_NOTATION_CONTRACT_COMPLETE=YES_AS_ADVISORY_PENDING_DF_RATIFICATION
PROPOSED_CANDIDATE_NOTATION_CONTRACT=
  PROFILE: open-instrument.cmudict-arpabet-en-us.v0_1;
  REVISION: 74790861f652b15e4ac49015a90074ad62a27690;
  ARTIFACT: cmudict.dict, 3618488 bytes, sha256 81917843c7f44ce2b094ac63873c2c7a4cf802040792c455ba3ca406891c3d22;
  NOTATION: ARPABET, English CMUdict documented pronunciation inventory;
  SOURCE_FORM: preserve exact non-whitespace sourceForm and terminal numeric variant suffix;
  TOKEN_GRAMMAR: sourceForm SP pronunciationToken (SP pronunciationToken)* (SP # SP annotationText)?;
  TOKENS: uppercase symbols from the exact inventory below, with terminal stress 0|1|2 only on the fifteen vowel bases;
  ANNOTATION: preserve exact # suffix as opaque provenance and exclude it from pronunciation units;
  OUTPUT: preserve raw pronunciation, ordered tokens, source form, variant identity/order, source locator, profile, revision, notation, and artifact hash;
  FAILURE: missing, malformed, unknown, unsupported, or scope-mismatched source evidence remains Null with an exact reason;
  SEMANTICS: no Voice, Gamma, ZC, functional, historical, or representation meaning;
  AUTHORIZATION: requires explicit DF notation ratification before implementation.
```

The exact base symbol inventory observed in the frozen artifact is:

```text
AA AE AH AO AW AY B CH D DH EH ER EY F G HH IH IY JH K L M N NG OW OY P R S SH T TH UH UW V W Y Z ZH
```

The vowel subset is:

```text
AA AE AH AO AW AY EH ER EY IH IY OW OY UH UW
```

Each vowel may carry only terminal stress `0`, `1`, or `2`. Consonant symbols
are unstressed base symbols in the frozen inventory. Token case is uppercase
only. Pronunciation-token case folding, spelling correction, phoneme guessing,
annotation interpretation, and unknown-symbol substitution are forbidden.

The proposed contract treats stress as metadata, not symbol meaning. It
preserves the raw token such as `OW1` and may expose a derived base `OW` plus
stress `1` only as a lossless structured view. It does not assert a Voice or
moving-nucleus result. Source locators must remain recoverable; the current
input variant type carries source form and variant identity/order but not an
explicit line number, so a future candidate implementation must add a
traceable locator rather than silently claim one.

## Candidate pronunciation normalization contract proposal

```text
PROPOSED_CANDIDATE_NORMALIZATION_CONTRACT_COMPLETE=YES_AS_NO_SEPARATE_NORMALIZATION_PASS-THROUGH
PROPOSED_CANDIDATE_NORMALIZATION_CONTRACT=
  No separate lossy candidate-pronunciation normalization is proposed.
  Parse authorized source tokens under the ratified notation contract;
  preserve every raw token and ordered token boundary; expose base-symbol and
  stress fields only as lossless derived views; preserve source form, variant
  identity/order, annotation provenance, source locator, revision, profile,
  notation, and artifact hash; defer all Voice/Gamma/ZC/representation
  projection to separately ratified contracts.
```

```text
NORMALIZATION_LOSS_ACCOUNTING=
  lexical join NFC: LOSSLESS for the join key; raw source form preserved;
  lexical join lowercase: LOSSY_BUT_SOURCE_PRESERVED for key comparison; case collision is retained and fails closed;
  source-form terminal variant-suffix removal: LOSSY_BUT_SOURCE_PRESERVED for join view; exact sourceForm and variant identity preserved;
  pronunciation-token case: FORBIDDEN; require uppercase source notation;
  pronunciation-token spelling: FORBIDDEN; no spelling rewrite or aliasing;
  whitespace between tokens: LOSSLESS for ordered token sequence; exact raw source line must remain recoverable if raw-line fidelity is required;
  surrounding source-line whitespace: LOSSY_BUT_SOURCE_PRESERVED only for a parsed view; do not replace exact source-line provenance;
  stress digit extraction: LOSSLESS when raw stress-bearing token is preserved; stripping stress from a derived base is LOSSY_BUT_SOURCE_PRESERVED and not a replacement value;
  source token order: LOSSLESS;
  variant identity and source variant order: LOSSLESS;
  annotation text: LOSSLESS opaque provenance; never a pronunciation unit;
  raw pronunciation string: LOSSLESS;
  unsupported token: FORBIDDEN to drop or repair; retain evidence and return Null;
  malformed record: FORBIDDEN to repair or reinterpret; return Null.
```

No projection semantics are hidden inside this pass-through boundary.

## Load-bearing implementation and input-role reuse matrix

```text
INPUT_ROLE_REUSE_MATRIX=
  normalizeLexicalWordV0_1 (cmudictArpabetPronunciation.v0_1.ts:30-32): ROLE_NEUTRAL_MECHANISM_REUSABLE for the already-ratified lexical join only; not pronunciation normalization;
  normalizeCmuDictLexicalWordV0_1 (cmudictArpabetPronunciation.v0_1.ts:99-101): ROLE_NEUTRAL_MECHANISM_REUSABLE for lexical join only;
  splitVariantSuffixV0_1 (cmudictArpabetPronunciation.v0_1.ts:34-41): REUSABLE_ONLY_AFTER_DF_NOTATION_RATIFICATION, with exact sourceForm/provenance retained;
  loadCmuDictV0_1 (cmudictArpabetPronunciation.v0_1.ts:43-83): INPUT_SCOPED_NOT_REUSABLE because it is permissive, lacks exact source-line locator, and does not enforce candidate grammar;
  lookupCmuDictPronunciationsV0_1 (cmudictArpabetPronunciation.v0_1.ts:103-106): INPUT_SCOPED_NOT_REUSABLE for candidate implementation; its output is input-role shaped and lacks candidate authorization;
  parseArpabetTokenV0_1 (pronunciationToVoice.v0_1.ts:130-139): PROJECTION_COUPLED_NOT_REUSABLE_IN_THIS_STAGE because it feeds the Voice profile and accepts a permissive token regex;
  CMUDICT_ARPABET_VOICE_PROFILE_V0_1 (pronunciationToVoice.v0_1.ts:22-63): REUSABLE_ONLY_AFTER_DF_NOTATION_RATIFICATION as notation evidence only; Voice anchors are not reusable candidate authority;
  normalizeVariantV0_1 (pronunciationToVoice.v0_1.ts:223-324): PROJECTION_COUPLED_NOT_REUSABLE_IN_THIS_STAGE;
  resolveArpabetPronunciationVariantsToVoiceV0_1 (pronunciationToVoice.v0_1.ts:326-382): PROJECTION_COUPLED_NOT_REUSABLE_IN_THIS_STAGE;
  resolveCmuDictPronunciationToVoiceV0_1 (pronunciationToVoice.v0_1.ts:384-392): INPUT_SCOPED_NOT_REUSABLE; it performs input lookup plus spoken Voice resolution.
```

The current tests establish behavior, not cross-role authority:
`tests/openInstrument.pronunciationToVoice.v0_1.spec.ts` covers the complete
frozen vowel profile, moving categories, stress metadata, variant ambiguity,
unsupported vowels, deterministic lookup, and input spoken paths. It does not
authorize candidate notation or candidate normalization.

## Variant and stress firewall

```text
VARIANT_WINNER_SELECTION=NO
NO_SINGLE_WINNER_PRESERVED=YES
STRESS_SEMANTIC_AUTHORITY=NO
VARIANT_SEMANTIC_AUTHORITY=NO
RAW_STRESS_PRESERVED=YES
RAW_VARIANT_IDENTITY_PRESERVED=YES
```

Variant 1 is not canonical, variant 2 is not secondary, source order is not a
winner rule, and stress `1` is not semantically privileged. All matching source
records and variants remain independently recoverable. If later projection
cannot reconcile variants under an explicitly authorized rule, the aggregate
candidate result remains Null.

## Proposed Null and failure taxonomy

```text
RATIFIED_CANDIDATE_ROLE_CONTRACT_CONFLICT=NO
PROPOSED_NOTATION_NORMALIZATION_NULL_TAXONOMY=
  source record missing -> PRONUNCIATION_NOT_FOUND;
  lexical join collision -> PRONUNCIATION_JOIN_COLLISION;
  malformed source line -> CMUDICT_SOURCE_LINE_MALFORMED;
  unknown or unsupported ARPABET token -> CMUDICT_ARPABET_TOKEN_UNSUPPORTED;
  malformed stress digit -> CMUDICT_STRESS_DIGIT_MALFORMED;
  unauthorized notation -> CMUDICT_CANDIDATE_NOTATION_UNAUTHORIZED;
  unauthorized normalization request -> CMUDICT_CANDIDATE_NORMALIZATION_UNAUTHORIZED;
  source artifact mismatch -> CMUDICT_SOURCE_ARTIFACT_MISMATCH;
  source revision mismatch -> CMUDICT_SOURCE_REVISION_MISMATCH;
  ambiguous variant state -> PRONUNCIATION_VARIANT_AMBIGUOUS;
  internal invariant violation -> CMUDICT_CANDIDATE_AUTHORITY_INVARIANT_VIOLATION;
  missing source locator/provenance -> PRONUNCIATION_PROVENANCE_UNRESOLVED.
NULL_REMAINS_VALID=YES
```

The proposed taxonomy is fail-closed. Unknown tokens are not dropped, malformed
records are not repaired, and pronunciation is never manufactured from
spelling, gloss, translation, history, or functional status.

## Authority firewall and scope exclusions

```text
CANDIDATE_NOTATION_AUTHORITY_NOW=NO
CANDIDATE_NORMALIZATION_AUTHORITY_NOW=NO
DF_NOTATION_RATIFICATION_REQUIRED=YES
DF_NORMALIZATION_RATIFICATION_REQUIRED=YES
CANDIDATE_VOICE_PROJECTION_AUTHORITY=NOT_AUTHORIZED
CANDIDATE_GAMMA_PROJECTION_AUTHORITY=NOT_AUTHORIZED
CANDIDATE_ZC_PROJECTION_AUTHORITY=NOT_AUTHORIZED
REPRESENTATION_BRIDGE_AUTHORITY=NOT_AUTHORIZED
SAME_REPRESENTATION_AUTHORIZED_NOW=NO
NATURAL_V0_2_POSITIVE_CONTROL_ESTABLISHED=NO
SOURCE_ADAPTER_IMPLEMENTATION_AUTHORIZED=NO
RUNTIME_ACTIVATION_AUTHORIZED=NO
```

```text
ALBANIAN_PATH_IN_SCOPE=NO
ALBANIAN_SOURCE_DATA_ACQUIRED=NO
ALBANIAN_NETWORK_SOURCE_DATA_TRANSFER=NO
ALBANIAN_FROZEN_HASH_CHANGED=NO
PROFILE_IDENTITY_DIVERGENCE_IN_SCOPE=NO
FALSE_NULL_EXECUTION_IN_SCOPE=NO
FALSE_NULL_DIAGNOSTIC_DISPOSITION=DEFERRED_PENDING_V0_2_REACHABILITY
TWO_MODE_DESIGN_IN_SCOPE=NO
TWO_MODE_DESIGN_STATUS=NOT_AUTHORIZED
S5_IN_SCOPE=NO
S5_GENERALIZATION_REQUIRES_ARCHITECTURAL_REVIEW=YES
INVALIDATED_S5_SAMPLE_REUSABLE=NO
INVALIDATED_S5_SAMPLE_SHA256=cd5165a71e0a2aac065af1721f50a975b915dcf052b5a4133a857ed45b7c11cf
SANSKRIT_DISABLED=YES
```

No source acquisition, provider execution, S2/S3/S4 execution, Sanskrit
execution, false-Null execution, candidate runtime, API, UI, Voice, Gamma, ZC,
representation, or functional interpretation change is authorized.

## Advisory outcome

```text
INDEX_UPDATE_REQUIRED=NO
INDEX_UPDATE_PATH=NOT_APPLICABLE
PRODUCTION_CODE_CHANGED=NO
TEST_BEHAVIOR_CHANGED=NO
SOURCE_ADAPTER_CHANGED=NO
SOURCE_REGISTRATION_CHANGED=NO
SOURCE_DATA_CHANGED=NO
RUNTIME_CHANGED=NO
UI_CHANGED=NO
```

The notation recommendation is positive. The normalization recommendation is
that no separate candidate normalization authority is needed before a future
projection lane; any future projection must still receive its own explicit
authority. Neither recommendation is authorization.

```text
NEXT_RECOMMENDED_LANE=CMUDICT_CANDIDATE_NOTATION_NORMALIZATION_DF_RATIFICATION
NEXT_ACTION=AWAIT_DF_DECISION
```

DF must explicitly ratify or reject candidate notation and the no-separate-
normalization posture after reviewing this artifact. Do not execute that lane
automatically.
