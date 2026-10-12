# OPEN INSTRUMENT — FUNCTIONAL MOTIVATION v0.2 CMUDICT CANDIDATE SOURCE ADAPTER CONTRACT v0.1

## Status and boundary

```text
STATUS=ADVISORY_PENDING_DF_IMPLEMENTATION_RATIFICATION
MERGING_THIS_ARTIFACT_DOES_NOT_AUTHORIZE_ADAPTER_IMPLEMENTATION=YES
CMUDICT_CANDIDATE_SOURCE_ADAPTER_IMPLEMENTATION_AUTHORIZED_NOW=NO
DF_ADAPTER_IMPLEMENTATION_RATIFICATION_REQUIRED=YES
```

This document freezes the smallest deterministic CMUdict candidate
source-evidence adapter contract. It does not implement the adapter or
authorize implementation. The adapter may attach ratified CMUdict source
pronunciation evidence to an already-existing eligible English lexical
candidate, and must stop at source evidence.

It must not create, remove, rank, filter, reorder, or otherwise alter
analytical candidates. It must not bind pronunciation to a lexical sense and
must not produce Voice, Gamma, ZC, a representation bridge,
`SAME_REPRESENTATION`, or functional interpretation.

## Repository and source evidence

```text
REPOSITORY=sokolgora-sketch/linguistic-decoder
MAIN_HEAD_BEFORE=e4839484e22c7709d0fe0ffdc17cc4e3980fd55c
ORIGIN_MAIN_BEFORE=e4839484e22c7709d0fe0ffdc17cc4e3980fd55c
DIVERGENCE_BEFORE=0/0
WORKTREE_BEFORE=CLEAN
HISTORICAL_S5_BRANCH=codex/s5-sanskrit-gloss-contract-resolution-v0-1
HISTORICAL_S5_HEAD=6d5bf985f1ca2763b8d41f3d4fa0735d689a1c30
```

The exact bundled CMUdict artifact is:

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

The English lexical source contract is
`docs/open-instrument/english-lexical-sense-source-authority-contract-v0.1.md`
and `src/shared/openInstrument/englishLexicalSenseSourceContract.v0_1.ts`.
Its frozen join key is exact NFC -> locale-independent English lowercase using
`en-US` -> NFC, with `trim=false`; source-record and sense multiplicity are
preserved.

## DF ratifications and active authority chain

The following decisions were ratified by DF after PR #2169 merged. They are
recorded prospectively and do not rewrite PR #2169 history.

```text
DF_CMUDICT_CANDIDATE_ROLE_RATIFICATION_STATUS=RATIFIED
CMUDICT_CANDIDATE_ROLE_AUTHORITY=RATIFIED
CMUDICT_CANDIDATE_ROLE_AUTHORIZED_NOW=YES
DF_CMUDICT_CANDIDATE_NOTATION_RATIFICATION_STATUS=RATIFIED
CMUDICT_CANDIDATE_ARPABET_NOTATION_AUTHORITY=RATIFIED
CMUDICT_CANDIDATE_NOTATION_AUTHORIZED_NOW=YES
DF_CMUDICT_CANDIDATE_NORMALIZATION_RATIFICATION_STATUS=RATIFIED_NO_SEPARATE_NORMALIZATION_REQUIRED
CMUDICT_CANDIDATE_SEPARATE_NORMALIZATION_AUTHORITY_REQUIRED=NO
PR2169_MERGE_AUTHORITY_STATUS=ADVISORY_PENDING_DF_RATIFICATION
CURRENT_CMUDICT_CANDIDATE_NOTATION_STATUS=RATIFIED_POST_MERGE_BY_DF
CURRENT_CMUDICT_CANDIDATE_NORMALIZATION_STATUS=NO_SEPARATE_NORMALIZATION_REQUIRED_RATIFIED_POST_MERGE_BY_DF
PR2169_HISTORY_REWRITTEN=NO
CMUDICT_SOURCE_FAMILY=RATIFIED
CMUDICT_CANDIDATE_SOURCE_PRONUNCIATION_ROLE=RATIFIED
CMUDICT_CANDIDATE_ARPABET_NOTATION=RATIFIED
CMUDICT_CANDIDATE_SEPARATE_PRONUNCIATION_NORMALIZATION=NOT_REQUIRED
LEXICAL_JOIN_NORMALIZATION=RATIFIED_AS_PART_OF_CANDIDATE_ROLE
SOURCE_LINE_GRAMMAR=RATIFIED_AS_PART_OF_CANDIDATE_ROLE
SOURCE_LINE_ANNOTATION_POLICY=RATIFIED_AS_PART_OF_CANDIDATE_ROLE
SOURCE_LINE_FAILURE_POLICY=RATIFIED_AS_PART_OF_CANDIDATE_ROLE
SENSE_BINDING_AUTHORIZED=NO
VARIANT_WINNER_SELECTION=NO
NO_SINGLE_WINNER_PRESERVED=YES
STRESS_SEMANTIC_AUTHORITY=NO
VARIANT_SEMANTIC_AUTHORITY=NO
```

## Load-bearing repository findings

`src/shared/openInstrument/cmudictArpabetPronunciation.v0_1.ts` currently
preserves `lexicalWord`, `sourceForm`, `variantId`, `variantOrder`, raw
pronunciation, source units, profile, revision, and notation. Its loader
splits the bundled text into lines, skips comments/blanks, splits at the first
space, and derives order from insertion order. `splitVariantSuffixV0_1`
recognizes terminal numeric `(N)` suffixes. Its
`normalizeLexicalWordV0_1`/`normalizeCmuDictLexicalWordV0_1` trim and lowercase.
The input variant has no artifact-relative line number, byte offset, or exact
raw source-line locator.

`src/shared/openInstrument/pronunciationToVoice.v0_1.ts` contains
`parseArpabetTokenV0_1`, which parses uppercase ARPABET plus optional terminal
stress `0|1|2`; `normalizeVariantV0_1` and
`resolveArpabetPronunciationVariantsToVoiceV0_1` are coupled to the input
Voice projection and are not candidate-adapter authority.

`src/shared/openInstrument/englishKaikkiSourceFamilyAdapter.v0_1.ts` preserves
English source-family ID, snapshot ID, physical record ordinal/hash, source
record ID, JSONL locator, source word/query form, language, POS, and senses.
`projectEnglishKaikkiSourceRecordToGenericWitnessRecordsV0_1` preserves
physical source identity in generic provenance. The generic seam in
`src/shared/openInstrument/genericFunctionalWitnessDiscovery.v1.ts` carries
source IDs, forms, language, gloss, citations, status, and provenance, but no
candidate pronunciation field. The adapter must therefore be additive.

## Architectural assessment

```text
CMUDICT_CANDIDATE_ADAPTER_ARCHITECTURAL_ASSESSMENT=DEFENSIBLE
CMUDICT_CANDIDATE_ADAPTER_ARCHITECTURAL_ASSESSMENT_REASON=The exact hash-bound CMUdict artifact already contains source form, terminal variant identity, source order, raw ARPABET, source profile, revision, and notation. Existing English lexical candidate/provenance records contain the exact lexical form and source identity needed for an additive form-level join. A separate candidate parser with an artifact-relative locator is required because the input loader trims, does not validate the ratified candidate grammar, treats annotation as pronunciation text, and exposes no exact line locator. The proposed output preserves candidate identity and every physical matching CMUdict source record without candidate generation, semantic fields, sense binding, ranking, filtering, or downstream projection.
```

## Adapter input identity

```text
PROPOSED_ADAPTER_INPUT_IDENTITY=An already-existing eligible English lexical candidate represented by an opaque candidateId plus its source identity/provenance, sourceForm, frozen normalizedForm/join key, language, and optional untouched sense identity/gloss context. candidateId, sourceId, sourceRecordId, and source-family identity are preserved as context but never choose or rank pronunciation. The join uses only candidate sourceForm and the ratified English source boundary.

PROPOSED_ADAPTER_REQUIRED_INPUT_FIELDS=candidateId; sourceId or equivalent per-record source identity; sourceFamilyId or equivalent source-family provenance; sourceRecordId or equivalent physical lexical-record identity; sourceForm; normalizedForm computed under the frozen no-trim English lexical join key; language=English; source provenance sufficient to retain exact source identity. senseId and gloss, when present, are untouched context and are not required for the join.

PROPOSED_ADAPTER_FORBIDDEN_INPUT_AUTHORITIES=gloss; functional status; semantic interpretation; target sense; embryo; reviewed functional evidence; candidate ranking; candidate winner state; Voice path; Gamma; ZC; representation bridge; SAME_REPRESENTATION; historical relation; etymology; cognacy; borrowing; morphology; spelling correction; fuzzy or phonetic similarity.
```

## Exact join contract

```text
LEXICAL_JOIN_NORMALIZATION_RULE=NFC -> locale-independent English lowercase using en-US -> NFC
TRIM_ALLOWED_IN_CANDIDATE_JOIN=NO
INPUT_ROLE_TRIMMING_NORMALIZER_REUSABLE_FOR_CANDIDATE_JOIN=NO
PROPOSED_ADAPTER_JOIN_FUNCTION=Normalize candidate sourceForm with normalizeEnglishLexicalJoinKeyV0_1; remove only a terminal numeric CMUdict source-form variant suffix; normalize the CMUdict base source form with the same no-trim NFC/en-US-lowercase/NFC function; compare the two exact keys.
PROPOSED_ADAPTER_JOIN_KEY=(candidateJoinKey, cmudictBaseJoinKey) where both sides use the frozen no-trim English lexical join key; candidate source identity, per-record sourceId, source sense, gloss, pronunciation, and variant ID are not key components.
PROPOSED_ADAPTER_JOIN_COLLISION_POLICY=If two or more distinct CMUdict base sourceForm strings, compared before lowercase, produce the same normalized key, retain the candidate and all lexical provenance but attach no CMUdict pronunciation; return Null with PRONUNCIATION_JOIN_COLLISION and preserve colliding source forms and locators. Identical physical source lines remain distinct by locator.
PROPOSED_ADAPTER_MISSING_MATCH_POLICY=If no exact CMUdict source record matches the candidate join key, return Null with PRONUNCIATION_NOT_FOUND; do not trim, spelling-correct, fuzzy-match, morphologically expand, semantically match, or fall back to another source.
```

Use `normalizeEnglishLexicalJoinKeyV0_1` from
`src/shared/openInstrument/englishLexicalSenseSourceContract.v0_1.ts`, or an
exact equivalent. Do not use `normalizeCmuDictLexicalWordV0_1`,
`lookupCmuDictPronunciationsV0_1`, or the input-role resolver as a candidate
join substitute.

## Candidate source parser requirement

```text
PROPOSED_CANDIDATE_SOURCE_PARSER_REQUIREMENT=Parse each non-comment, non-blank line as sourceForm SP pronunciationToken (SP pronunciationToken)* (SP # SP annotationText)?. Preserve exact sourceForm, terminal numeric variant suffix, base source form, physical source order, raw pronunciation, ordered raw ARPABET tokens, exact raw source line, artifact-relative 1-based source line number, and opaque annotation suffix. Validate every token against the ratified uppercase ARPABET inventory with optional terminal stress 0|1|2; reject missing pronunciations, unknown tokens, malformed stress digits, invalid annotation boundaries, and other grammar violations with explicit Null reasons. Bind every result to exact profile, revision, byte count, SHA-256, notation, and locator.
CURRENT_INPUT_LOADER_REUSABLE_AS_IS=NO
PROPOSED_RAW_PRONUNCIATION_SLICE_RULE=rawPronunciation is the exact source-line substring after sourceForm and its single separating SP and before the separate SP # SP annotation delimiter when present; it excludes that delimiter, the # marker, and annotationText, and is not trimmed or normalized. For an unannotated row it extends to end-of-line. opaqueAnnotationText is the exact end-of-line substring after the SP # SP delimiter, excluding the delimiter and # marker; orderedRawArpabetTokens are parsed only from rawPronunciation.
```

The current loader is permissive: it trims, silently skips malformed material,
stores the post-separator remainder as pronunciation, does not exclude `#`
annotation tokens, validates neither the candidate grammar nor the exact
inventory, and records no exact source locator. It is evidence of existing
input behavior, not the candidate parser contract.

## Source locator and provenance

```text
CURRENT_CMUDICT_EXACT_SOURCE_LOCATOR_AVAILABLE=NO
PROPOSED_CMUDICT_SOURCE_LOCATOR=artifact-relative 1-based physical source line number paired with exact raw source line and exact artifact SHA-256
PROPOSED_SOURCE_LOCATOR_STABILITY_RULE=Count physical lines from the beginning of the exact hash-bound artifact; preserve original line number and raw line for every accepted or rejected candidate-relevant record; never renumber after comments or malformed lines are filtered; identical source records are distinct when physical line numbers differ.
PROPOSED_SOURCE_LOCATOR_PROVENANCE_FIELDS=sourceProfileId; sourceRevision; sourceNotation; sourceArtifactBytes; sourceArtifactSha256; sourceLineNumber; rawSourceLine; sourceForm; baseSourceForm; variantId; variantOrder; rawPronunciation; orderedRawArpabetTokens; opaqueAnnotationText when present; candidateId; candidateSourceId/sourceRecordId; candidateSourceFamilyId; candidateSourceForm; candidateJoinKey; authority status.
```

The line number is the smallest exact locator supported by the inspected loader
shape. Hash identity plus raw line prevents the locator from being mistaken
for semantic identity.

## Source-evidence output record

```text
PROPOSED_CANDIDATE_PRONUNCIATION_EVIDENCE_RECORD=One immutable adapter result envelope per existing candidate containing candidateId, candidate source identity/provenance, candidateSourceForm, candidateJoinKey, status, reasonCode, and an ordered variants array. Each variant contains sourceProfileId, sourceRevision, sourceNotation, sourceArtifactBytes, sourceArtifactSha256, sourceLineNumber, rawSourceLine, sourceForm, baseSourceForm, variantId, variantOrder, rawPronunciation as defined by PROPOSED_RAW_PRONUNCIATION_SLICE_RULE, orderedRawArpabetTokens, lossless base/stress views, opaqueAnnotationText when present, and authorityStatus=RATIFIED_SOURCE_EVIDENCE_ONLY. N physical matching CMUdict records yield N evidence members; no field asserts sense-specific pronunciation. Null uses variants=[] and an exact reason.
PROPOSED_OUTPUT_RECORD_COMPLETE=YES
```

Base/stress separation is a lossless source-evidence view, not a separate
normalization stage. The raw stress-bearing token remains exactly recoverable.
The output contains no Voice path, Gamma, ZC, structural comparison,
representation bridge, `SAME_REPRESENTATION`, functional interpretation,
semantic winner, or lexical-sense pronunciation claim.

## Cardinality and sense firewall

```text
PROPOSED_VARIANT_OUTPUT_CARDINALITY=One adapter result envelope per existing lexical candidate with one ordered source-evidence member per matching physical CMUdict source record; N matching records produce N members, including duplicate source lines with distinct locators; N=0 is a Null envelope.
PROPOSED_VARIANT_ORDER_POLICY=Preserve CMUdict physical artifact line order as evidence order, with variantId retained as source metadata; order is not preference, confidence, ranking, or winner authority.
VARIANT_WINNER_SELECTION=NO
NO_SINGLE_WINNER_PRESERVED=YES
VARIANT_SEMANTIC_AUTHORITY=NO
SENSE_BINDING_AUTHORIZED=NO
MULTI_SENSE_FORM_POLICY=Attach the same form-level source evidence independently to every existing lexical candidate/source record sharing the exact join key; preserve each sourceId, sourceRecordId, senseId, POS, gloss, and source order independently; never infer that pronunciation belongs to one sense or use gloss/POS/function to select it.
SEMANTIC_DISAMBIGUATION_USED=NO
```

## Null and failure taxonomy

```text
PROPOSED_ADAPTER_NULL_TAXONOMY=PRONUNCIATION_NOT_FOUND; PRONUNCIATION_JOIN_COLLISION; CMUDICT_SOURCE_LINE_MALFORMED; CMUDICT_ARPABET_TOKEN_UNSUPPORTED; CMUDICT_STRESS_DIGIT_MALFORMED; CMUDICT_CANDIDATE_NOTATION_UNAUTHORIZED; CMUDICT_SOURCE_ARTIFACT_MISMATCH; CMUDICT_SOURCE_REVISION_MISMATCH; PRONUNCIATION_VARIANT_AMBIGUOUS; CMUDICT_CANDIDATE_AUTHORITY_INVARIANT_VIOLATION; PRONUNCIATION_PROVENANCE_UNRESOLVED. Every failure is explicit and never silently omits a source record.
ADDITIONAL_ADAPTER_NULL_CODES_REQUIRED=NO
NULL_REMAINS_VALID=YES
```

`CMUDICT_ARPABET_TOKEN_UNSUPPORTED` is for syntactically well-formed tokens
outside the ratified inventory. `CMUDICT_STRESS_DIGIT_MALFORMED` is for a
stress suffix other than `0`, `1`, or `2`. Artifact identity/revision failure
precedes lookup/parsing; unresolved authority or provenance fails closed.

## Determinism contract

```text
PROPOSED_ADAPTER_DETERMINISM_CONTRACT=Validate exact profile, notation, revision, byte count, and SHA-256 before emitting evidence; use only exact no-trim NFC/en-US-lowercase/NFC join; remove only terminal numeric variant suffix; parse physical lines in ascending 1-based line order; preserve every source record, variant identifier, duplicate locator, raw line, raw pronunciation, raw tokens, annotation, and base/stress view; reject collisions rather than choose a spelling; return explicit Null for missing, malformed, unsupported, ambiguous, mismatched, or unresolved records; use no filesystem-order authority, locale-unspecified sorting, random ordering, semantic ranking, source fallback, spelling correction, fuzzy matching, morphology, or winner selection; deep-freeze evidence and leave analytical candidate identity unchanged.
```

## Recommendation and bounded future implementation plan

```text
CMUDICT_CANDIDATE_SOURCE_ADAPTER_RECOMMENDATION=RECOMMEND_AUTHORIZE_IMPLEMENTATION
CMUDICT_CANDIDATE_SOURCE_ADAPTER_IMPLEMENTATION_AUTHORIZED_NOW=NO
DF_ADAPTER_IMPLEMENTATION_RATIFICATION_REQUIRED=YES

PROPOSED_IMPLEMENTATION_FILES=src/shared/openInstrument/cmudictCandidateSourceAdapter.v0_1.ts; tests/openInstrument.cmudictCandidateSourceAdapter.v0_1.spec.ts

PROPOSED_NEW_TYPES=CmuDictCandidateAdapterInputV0_1; CmuDictCandidatePronunciationEvidenceV0_1; CmuDictCandidatePronunciationEvidenceVariantV0_1; CmuDictCandidateAdapterReasonCodeV0_1; CmuDictCandidateSourceLocatorV0_1

PROPOSED_REUSED_FUNCTIONS=normalizeEnglishLexicalJoinKeyV0_1 from src/shared/openInstrument/englishLexicalSenseSourceContract.v0_1.ts; CMUDICT_SOURCE_PROFILE_ID_V0_1; CMUDICT_SOURCE_REVISION_V0_1; CMUDICT_SOURCE_NOTATION_V0_1; CMUDICT_DATA_SHA256_V0_1; CMUDICT_DATA_BYTES_V0_1 from src/shared/openInstrument/cmudictArpabetPronunciation.v0_1.ts; existing English lexical source/provenance types only as additive input context

PROPOSED_FORBIDDEN_REUSE=normalizeCmuDictLexicalWordV0_1; lookupCmuDictPronunciationsV0_1; resolveCmuDictPronunciationToVoiceV0_1; resolveArpabetPronunciationVariantsToVoiceV0_1; parseArpabetTokenV0_1; any Voice/Gamma/ZC projector; any candidate generator; any ranking or winner selector; any gloss/POS/semantic matcher; any source fallback or spelling/morphology normalizer

PROPOSED_FOCUSED_TEST_FILES=tests/openInstrument.cmudictCandidateSourceAdapter.v0_1.spec.ts

PROPOSED_TEST_MATRIX=exact no-trim NFC/en-US-lowercase/NFC join; case and composed/decomposed Unicode; leading/trailing-space non-match; terminal numeric variant parsing; source order and variant identity; annotation preservation and exclusion from pronunciation tokens; raw line and 1-based locator preservation; raw stress-bearing token plus lossless base/stress view; accepted ARPABET inventory; unknown token failure; malformed stress failure; malformed line failure; missing match Null; distinct-base-form collision Null; artifact SHA/byte/revision/notation mismatch Null; provenance completeness; duplicate physical record preservation; multi-sense form independence; deterministic repeatability and deep freeze; no candidate generation/filter/rank/selection; no Voice/Gamma/ZC/representation/semantic fields; no input-role resolver reuse
```

No implementation or test file from this plan is created by this contract lane.

## Projection and lane firewalls

```text
CANDIDATE_VOICE_PROJECTION_AUTHORITY=NOT_AUTHORIZED
CANDIDATE_GAMMA_PROJECTION_AUTHORITY=NOT_AUTHORIZED
CANDIDATE_ZC_PROJECTION_AUTHORITY=NOT_AUTHORIZED
REPRESENTATION_BRIDGE_AUTHORITY=NOT_AUTHORIZED
SAME_REPRESENTATION_AUTHORIZED_NOW=NO
NATURAL_V0_2_POSITIVE_CONTROL_ESTABLISHED=NO
FUNCTIONAL_INTERPRETATION_AUTHORITY=NOT_AUTHORIZED_BY_THIS_LANE
ALBANIAN_PATH_IN_SCOPE=NO
ALBANIAN_SOURCE_DATA_ACQUIRED=NO
ALBANIAN_NETWORK_SOURCE_DATA_TRANSFER=NO
ALBANIAN_FROZEN_HASH_CHANGED=NO
PROFILE_IDENTITY_DIVERGENCE_IN_SCOPE=NO
FALSE_NULL_DIAGNOSTIC_DISPOSITION=DEFERRED_PENDING_V0_2_REACHABILITY
TWO_MODE_DESIGN_STATUS=NOT_AUTHORIZED
S5_IN_SCOPE=NO
SANSKRIT_STATUS=CLOSED
HISTORICAL_INVALID_S5_SAMPLE_SHA256=cd5165a71e0a2aac065af1721f50a975b915dcf052b5a4133a857ed45b7c11cf
```

## Scope, lifecycle, and reconciliation

```text
EXPECTED_CHANGED_FILE=docs/open-instrument/functional-motivation-v0.2-cmudict-candidate-source-adapter-contract-v0.1.md
INDEX_UPDATE_REQUIRED=NO
INDEX_UPDATE_PATH=NOT_APPLICABLE
PRODUCTION_CODE_CHANGED=NO
TEST_BEHAVIOR_CHANGED=NO
SOURCE_DATA_CHANGED=NO
ADAPTER_IMPLEMENTATION_CHANGED=NO
RUNTIME_CHANGED=NO
API_CHANGED=NO
UI_CHANGED=NO
RATIFIED_AUTHORITY_CONTRACT_CONFLICT=NO
```

The lifecycle is normal push, PR against `main`, CI and review, direct
GitHub-thread inspection, substantive-thread resolution, squash merge only
when green and clean, fast-forward `main`, post-merge proof, append-only
reconciliation of the existing Functional Motivation v0.2 Linear milestone,
and local-only DF_BRAIN update. Merging remains insufficient to authorize
adapter implementation.

```text
LINEAR_DUPLICATE_CREATED=NO
DF_BRAIN_REMOTE_PUSH=NO
NEXT_RECOMMENDED_LANE=CMUDICT_CANDIDATE_SOURCE_ADAPTER_IMPLEMENTATION_DF_RATIFICATION
CONTRACT_ARTIFACT_STATUS=ADVISORY_PENDING_DF_IMPLEMENTATION_RATIFICATION
FINAL_CLASSIFICATION=CMUDICT_CANDIDATE_SOURCE_ADAPTER_IMPLEMENTATION_RECOMMENDED_PENDING_DF_RATIFICATION
NEXT_ACTION=AWAIT_DF_DECISION
```
