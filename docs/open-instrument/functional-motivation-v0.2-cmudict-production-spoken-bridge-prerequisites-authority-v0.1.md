# OPEN INSTRUMENT — FUNCTIONAL MOTIVATION v0.2 CMUDICT PRODUCTION_SPOKEN BRIDGE PREREQUISITES AUTHORITY v0.1

## Status and boundary

```text
STATUS=AUTHORITY_ARCHITECTURE_ALIGNMENT_CONTRACT_ONLY
REPOSITORY=sokolgora-sketch/linguistic-decoder
BASELINE_MAIN=620240a8683e5cddf1a0cc86f6aebbc96574e33d
NO_IMPLEMENTATION=YES
NO_PRODUCTION_PARSER_CHANGE=YES
NO_PRODUCTION_NORMALIZATION_CHANGE=YES
NO_BRIDGE_IMPLEMENTATION=YES
NO_SAME_REPRESENTATION=YES
NO_DISCOVERY_API_UI_WIRING=YES
NO_REACHABILITY_EXECUTION=YES
NO_NETWORK=YES
NO_SOURCE_ACQUISITION=YES
```

This document freezes the smallest prerequisite contract for a future
CMUdict-candidate-to-`production_spoken` domain-compatibility bridge. It does
not implement that bridge and does not authorize a claim of representation
identity, pronunciation identity, semantic or functional equivalence,
historical relation, or cross-language relation.

## Repository truth before the lane

```text
BRANCH=main
HEAD=620240a8683e5cddf1a0cc86f6aebbc96574e33d
ORIGIN_MAIN=620240a8683e5cddf1a0cc86f6aebbc96574e33d
DIVERGENCE=0/0
WORKTREE=CLEAN
HISTORICAL_S5_BRANCH=codex/s5-sanskrit-gloss-contract-resolution-v0-1
HISTORICAL_S5_HEAD=6d5bf985f1ca2763b8d41f3d4fa0735d689a1c30
```

The historical S5 ref is outside this lane and remains untouched.

## Ratified bridge input retained without expansion

```text
DF_CMUDICT_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_RATIFICATION_STATUS=RATIFIED
REPRESENTATION_BRIDGE_AUTHORITY_NOW=YES
AUTHORIZED_BRIDGE_SCOPE=ENGLISH_CMUDICT_CANDIDATE_SOURCE_PRONUNCIATION_DERIVED_TO_PRODUCTION_SPOKEN_DOMAIN_COMPATIBILITY_ONLY
AUTHORIZED_BRIDGE_PROJECTOR_IDENTITY=open-instrument.cmudict-candidate-production-spoken-representation-bridge.v0_1
BRIDGE_REQUIRES_CANDIDATE_VOICE=YES
BRIDGE_REQUIRES_CANDIDATE_GAMMA=NO
BRIDGE_REQUIRES_CANDIDATE_ZC=NO
BRIDGE_VARIANT_POLICY=LOSSLESS_ONE_TO_ONE_EVIDENCE_LEDGERS
IDENTICAL_VARIANTS_COLLAPSED=NO
BRIDGE_VARIANT_WINNER_SELECTION=NO
NO_SINGLE_WINNER_PRESERVED=YES
```

The ratified scope is treated as frozen input. This prerequisite contract adds
no authority to it.

## Exact runtime paths recovered

### Production path

| PATH | SYMBOL | SIGNATURE/TYPE | ROLE |
| --- | --- | --- | --- |
| `src/v1/heartInstrument.v1.ts` | `buildHeartInstrumentV1` | `buildHeartInstrumentV1(basis: string): HeartInstrumentV1Packet` | NFC-normalizes the basis, calls the production CMUdict resolver, exposes the spoken result and canonical spoken Voice path, then derives spoken principles/Math7 and per-variant ZC. |
| `src/shared/openInstrument/pronunciationToVoice.v0_1.ts` | `resolveCmuDictPronunciationToVoiceV0_1` | `resolveCmuDictPronunciationToVoiceV0_1(word: string): PronunciationToVoiceResultV0_1` | Applies `NFC → trim → lowercase`, looks up the bundled CMUdict map, and delegates to the variant resolver. |
| `src/shared/openInstrument/cmudictArpabetPronunciation.v0_1.ts` | `loadCmuDictV0_1` | `loadCmuDictV0_1(): ReadonlyMap<string, readonly CmuDictPronunciationVariantV0_1[]>` | Unexported loader; reads the bundled file, trims each line, skips blank/`;;;` lines, splits source form from pronunciation, trims pronunciation, parses `(n)` suffixes, and preserves lookup insertion order. |
| `src/shared/openInstrument/pronunciationToVoice.v0_1.ts` | `resolveArpabetPronunciationVariantsToVoiceV0_1` | `resolveArpabetPronunciationVariantsToVoiceV0_1(normalizedWord: string, variants: readonly CmuDictPronunciationVariantV0_1[]): PronunciationToVoiceResultV0_1` | Parses ordered ARPABET units, stress digits, normalized segments, nuclei, moving-nucleus observations/canonicalization, and the reviewed Voice mapping; emits a canonical path only when all variant paths are identical. |
| `src/shared/openInstrument/zeroConsonantalStructuralComposition.v0_1.ts` | `deriveZeroConsonantalStructuralCompositionV0_1` | `deriveZeroConsonantalStructuralCompositionV0_1(variant: PronunciationVoiceVariantResultV0_1 | null): ZeroConsonantalStructuralCompositionV0_1 | null` | Secondary per-variant ZC derivation used by Heart; not a bridge prerequisite. |

The production result exposes `normalizedWord`, source profile/revision/
notation, `variants`, per-variant `variant`, `normalizedSegments`, `nuclei`,
`canonicalVoicePath`, and `reasonCode`, plus top-level `status` and
`canonicalSpokenVoicePath`. Its `variant` values carry `sourceForm`,
`sourcePronunciation`, `sourceUnits`, `variantId`, and `variantOrder`.

### Candidate path

| PATH | SYMBOL | SIGNATURE/TYPE | ROLE |
| --- | --- | --- | --- |
| `src/shared/openInstrument/englishLexicalSenseSourceContract.v0_1.ts` | `normalizeEnglishLexicalJoinKeyV0_1` | `normalizeEnglishLexicalJoinKeyV0_1(sourceForm: string): string` | Candidate exact join key: `NFC → toLocaleLowerCase("en-US") → NFC`; no trim, semantic, morphological, fuzzy, or phonetic expansion. |
| `src/shared/openInstrument/cmudictCandidateSourceAdapter.v0_1.ts` | `parseCmuDictCandidateSourceRecordsV0_1` | `parseCmuDictCandidateSourceRecordsV0_1(sourceText: string): readonly CmuDictCandidateParsedSourceRecordV0_1[]` | Parses physical CMUdict records in source order, recognizes terminal ` # ` annotation text, validates ARPABET/stress tokens, and preserves locators, raw line, raw pronunciation, ordered tokens, lossless base/stress views, variant identity/order, and opaque annotation. |
| `src/shared/openInstrument/cmudictCandidateSourceAdapter.v0_1.ts` | `adaptCmuDictCandidateSourceEvidenceV0_1` | `adaptCmuDictCandidateSourceEvidenceV0_1(input: CmuDictCandidateAdapterInputV0_1, artifactOverride?: CmuDictCandidateSourceArtifactOverrideV0_1): CmuDictCandidatePronunciationEvidenceV0_1` | Verifies the frozen artifact identity and exact candidate join key, then retains every matching physical source record without selecting or collapsing a variant. |
| `src/shared/openInstrument/cmudictCandidateVoiceProjection.v0_1.ts` | `projectCmuDictCandidateVoiceProjectionV0_1` | `projectCmuDictCandidateVoiceProjectionV0_1(evidence: unknown): CmuDictCandidateVoiceProjectionV0_1` | Validates candidate evidence and delegates each preserved evidence variant to the existing ARPABET-to-Voice resolver; emits no candidate-level aggregate path and retains divergent/identical variants independently. |

Candidate Voice uses the existing mapping identity
`pronunciation-to-voice.open-instrument.cmudict-arpabet-en-us.v0_1.v0_1` and
table `CMUDICT_ARPABET_VOICE_PROFILE_V0_1`. Candidate Gamma and ZC remain
outside this prerequisite contract.

## Frozen artifact identity

```text
CANDIDATE_CMUDICT_PATH=src/data/openInstrument/pronunciation/cmudict.dict
PRODUCTION_CMUDICT_PATH=src/data/openInstrument/pronunciation/cmudict.dict
CANDIDATE_ARTIFACT_BYTES=3618488
PRODUCTION_ARTIFACT_BYTES=3618488
CANDIDATE_ARTIFACT_SHA256=81917843c7f44ce2b094ac63873c2c7a4cf802040792c455ba3ca406891c3d22
PRODUCTION_ARTIFACT_SHA256=81917843c7f44ce2b094ac63873c2c7a4cf802040792c455ba3ca406891c3d22
CANDIDATE_SOURCE_REVISION=74790861f652b15e4ac49015a90074ad62a27690
PRODUCTION_SOURCE_REVISION=74790861f652b15e4ac49015a90074ad62a27690
SOURCE_NOTATION=ARPABET
SAME_PHYSICAL_ARTIFACT=YES
```

Both paths consume the same checked-in file and the same frozen constants. The
production runtime result does not expose the bytes or SHA-256, so this is a
`PROVENANCE_FIELD_NOT_EXPOSED` problem, not `DATA_MISSING`. A future envelope
must attest exact bytes, hash, revision, profile, and notation on the same
physical record domain before compatibility is admitted.

## Production bridge envelope decision

```text
PRODUCTION_BRIDGE_ENVELOPE_REQUIRED=YES
PRODUCTION_BRIDGE_ENVELOPE_REQUIREMENT_REASON=The production result has per-variant Voice structure and basic source identity but cannot currently prove exact artifact identity, physical source location, mapping/parser/normalization identity, representation kind, or cross-boundary status without an additive envelope. The future bridge must compare those facts and preserve both ledgers one-to-one.
```

| Field | Classification | Current production fact |
| --- | --- | --- |
| representation kind | REQUIRED | `production_spoken` is an architectural label, not a field in `PronunciationToVoiceResultV0_1`; unavailable at the runtime boundary. |
| source profile ID | REQUIRED | Present as `sourceProfileId`. |
| source revision | REQUIRED | Present as `sourceRevision`. |
| source notation | REQUIRED | Present as `sourceNotation`. |
| source artifact bytes | REQUIRED | Frozen module constant exists, but the result does not expose it. |
| source artifact SHA256 | REQUIRED | Frozen module constant exists, but the result does not expose it. |
| lexical input | REQUIRED | The resolver receives `word` but returns only `normalizedWord`; the original input is not preserved by that result boundary. `HeartInstrumentV1Packet.basisNfc` is adjacent context, not part of the resolver result. |
| normalized lexical key | REQUIRED | Present as `normalizedWord`, after production `NFC → trim → lowercase`. |
| source form | REQUIRED | Present per `variant.variant.sourceForm`. |
| physical source locator if available | REQUIRED | The checked-in source has line identity, but production does not expose line number or equivalent locator. |
| raw source line if available | REQUIRED | The source file has the raw line, but production does not retain it in the variant. |
| raw pronunciation | REQUIRED | Present per `variant.variant.sourcePronunciation`. |
| ordered ARPABET units | REQUIRED | Present per `variant.variant.sourceUnits`. |
| variant ID | REQUIRED | Present per `variant.variant.variantId`. |
| variant order | REQUIRED | Present per `variant.variant.variantOrder`; meaningful only with the same artifact and loader order. |
| normalized segments | REQUIRED | Present per resolved variant. |
| nuclei | REQUIRED | Present per resolved variant, including moving-nucleus identity/canonicalization metadata. |
| canonical Voice path | REQUIRED | Present per variant and as the top-level path when policy permits. |
| mapping identity/table | REQUIRED | The mapping constant/table exists in the implementation, but the production result does not expose an explicit mapping ID/table field. |
| status | REQUIRED | Present as top-level and per-variant status is derived from `reasonCode`. |
| reason code | REQUIRED | Present top-level and per variant. |
| runtime authority | REQUIRED for a future bridge output; NOT a prerequisite-envelope authority claim | No new cross-boundary authority is emitted by the current production result. |
| normalization identity/version | REQUIRED | The algorithm is in source but no identity/version field is emitted. |
| parser identity/version | REQUIRED | The loader/parser algorithm is in source but no identity/version field is emitted. |

```text
PRODUCTION_CURRENTLY_MISSING_REQUIRED_FIELDS=representation kind; original lexical input at resolver-result boundary; source artifact bytes; source artifact SHA256; physical source locator; raw source line; explicit mapping identity/table; normalization identity/version; parser identity/version; future bridge authority/status envelope
```

The minimum additive envelope is per production physical variant and must carry
the missing fields above plus the already-existing source and Voice fields. It
must not alter lookup, candidate generation, source data, or production semantic
meaning.

## Normalization and lexical identity

```text
CANDIDATE_LEXICAL_NORMALIZATION=NFC -> locale-independent English lowercase using en-US -> NFC; no trim; normalizeEnglishLexicalJoinKeyV0_1(sourceForm: string): string
PRODUCTION_LEXICAL_NORMALIZATION=NFC -> trim -> lowercase; resolveCmuDictPronunciationToVoiceV0_1(word: string): PronunciationToVoiceResultV0_1
NORMALIZATION_RULES_IDENTICAL=NO
TRIM_POLICY_IDENTICAL=NO
LOWERCASE_POLICY_IDENTICAL=NO
UNICODE_POLICY_IDENTICAL=NO
LOCALE_POLICY_IDENTICAL=NO
NORMALIZATION_MISMATCH_CAN_CHANGE_LEXICAL_IDENTITY=YES
```

The candidate policy calls `toLocaleLowerCase("en-US")` and performs a final
NFC pass. Production calls `toLowerCase()` after trimming and has no final NFC
pass. A leading or trailing whitespace input therefore changes identity across
the policies; locale-sensitive edge cases also cannot be silently treated as
identical in the abstract.

```text
SHARED_NORMALIZATION_VALID_DOMAIN=Exact source forms s for which normalizeEnglishLexicalJoinKeyV0_1(s) equals the production NFC-trim-lowercase result. On the frozen CMUdict artifact, all 135166 physical source forms are in this domain: no source form has leading/trailing whitespace and the forms are ASCII-compatible for the compared case policies.
```

### Alignment options and decision

| Option | Assessment |
| --- | --- |
| A. Change production to candidate policy | Changes existing input lookup behavior and silently removes production trim; not authorized or necessary for the shared artifact domain. |
| B. Change candidate to production policy | Changes frozen candidate no-trim authority and weakens exact source-form identity. Rejected. |
| C. Leave both unchanged; admit only equal identities | Preserves both authorities, is fail-closed, and covers the current artifact. Recommended. |
| D. Add a bridge-only normalizer | Adds a second lexical authority and risks hidden coercion. Not needed when equality is explicitly checked. |
| E. Other | None supported by current repository truth. |

```text
RECOMMENDED_NORMALIZATION_ALIGNMENT_STRATEGY=C
RECOMMENDED_NORMALIZATION_ALIGNMENT_REASON=Leave both normalizers unchanged and require exact equality of their outputs for every bridge input/variant; reject leading/trailing-whitespace or other non-equal identities without coercion.
CANDIDATE_NORMALIZATION_AUTHORITY_CHANGE_REQUIRED=NO
PRODUCTION_NORMALIZATION_AUTHORITY_CHANGE_REQUIRED=NO
```

## Annotation parsing and segmentation

```text
ANNOTATED_CMUDICT_RECORD_COUNT=22
ANNOTATED_RECORD_COUNTING_RULE=Count physical non-header records in the frozen artifact containing the literal terminal delimiter " # "; each counted record has pronunciation before the delimiter and opaque text after it.
ANNOTATION_SYNTAX=Terminal literal " # " delimiter followed by non-empty opaque annotation text, as observed in the frozen artifact.
CANDIDATE_ANNOTATION_POLICY=Recognize the first " # " delimiter; exclude delimiter and suffix from rawPronunciation/orderedRawArpabetTokens; preserve suffix as opaqueAnnotationText and preserve the complete rawSourceLine.
PRODUCTION_ANNOTATION_POLICY=No terminal-comment split; the trimmed remainder after the first source-form space is sourcePronunciation and is split entirely into sourceUnits.
CANDIDATE_PRONUNCIATION_TOKEN_BOUNDARY=Tokens before the terminal " # " delimiter only.
PRODUCTION_PRONUNCIATION_TOKEN_BOUNDARY=All whitespace-separated tokens in the trimmed pronunciation remainder, including terminal "#" and annotation words.
ANNOTATION_TEXT_CAN_ENTER_PRODUCTION_SOURCE_UNITS=YES
ANNOTATION_TEXT_CAN_ENTER_CANDIDATE_SOURCE_UNITS=NO
ANNOTATION_MISMATCH_CONFIRMED=YES
```

For example, the frozen line `aalborg AO1 L B AO0 R G # place, danish` is
candidate pronunciation `AO1 L B AO0 R G` with opaque annotation `place,
danish`; production currently retains `# place, danish` in
`sourcePronunciation`/`sourceUnits`. The annotation words are not authorized
ARPABET pronunciation.

### Annotation alignment options and decision

| Option | Assessment |
| --- | --- |
| A. Change production parser to exclude terminal comments | Restores a shared token boundary but changes existing production parsing for 22 records and needs a separate production parser authority decision. |
| B. Change candidate parser to retain comments as pronunciation | Violates source fidelity and treats opaque text as spoken ARPABET. Rejected. |
| C. Leave both unchanged; fail closed for affected records | Preserves existing production behavior and candidate authority; prevents false compatibility for the 22 affected records. Recommended. |
| D. Introduce a shared physical-record parser | Strong long-term convergence but broader than the smallest change and requires a new extraction/migration decision. |
| E. Other | None supported by current repository truth. |

```text
RECOMMENDED_ANNOTATION_ALIGNMENT_STRATEGY=C
RECOMMENDED_ANNOTATION_ALIGNMENT_REASON=Keep the candidate parser's lossless annotation boundary and the current production parser unchanged for now; a future bridge must identify terminal-comment records and fail closed rather than compare production comment tokens as pronunciation. A production parser change remains a separate authority decision.
CANDIDATE_ANNOTATION_AUTHORITY_CHANGE_REQUIRED=NO
PRODUCTION_ANNOTATION_AUTHORITY_CHANGE_REQUIRED=NO_FOR_THIS_CONTRACT; YES_ONLY_IF_DF_LATER_AUTHORIZES_PRODUCTION_PARSER_ALIGNMENT
```

## Segmentation and Voice conformance

On records without the annotation mismatch and with a shared lexical identity,
candidate Voice projection converts its ordered evidence tokens into the same
`CmuDictPronunciationVariantV0_1` shape and calls
`resolveArpabetPronunciationVariantsToVoiceV0_1`. Both sides therefore use the
same ARPABET token regex, terminal stress handling, `normalizedSegments`,
`nuclei`, moving-nucleus observation/canonicalization, and Voice profile.

```text
SEGMENTATION_COMPATIBLE_ON_SHARED_VALID_DOMAIN=YES
SEGMENTATION_COMPATIBILITY_REASON=Candidate projection delegates each validated per-variant token sequence to the existing production resolver; equivalence is conditional on equal lexical identity, no terminal-comment token contamination, valid source tokens, and exact source variant identity.
VOICE_MAPPING_COMPATIBLE_ON_SHARED_VALID_DOMAIN=YES
VOICE_MAPPING_COMPATIBILITY_REASON=Both paths use CMUDICT_ARPABET_VOICE_PROFILE_V0_1 and the same mapping/canonicalization implementation; production must expose the mapping identity in the future envelope because it is not currently emitted as a result field.
ADDITIONAL_SEGMENTATION_OR_VOICE_BLOCKER=NO; the remaining issue is additive provenance/identity exposure, handled by the envelope requirement.
```

Moving-nucleus identity remains one source nucleus with ordered Voice events.
No artificial inter-region or extra nucleus is authorized.

## Variant policy

```text
VARIANT_IDENTITY_COMPATIBLE=YES, conditionally on the same physical artifact and exact source-form/suffix parsing
VARIANT_ORDER_COMPATIBLE=YES, conditionally on the same artifact and insertion order
IDENTICAL_VARIANT_RETENTION_COMPATIBLE=YES; both retain every physical variant and do not collapse identical paths
DIVERGENT_VARIANT_POLICY_COMPATIBLE=NO as a top-level aggregate policy; production returns Null with PRONUNCIATION_VARIANT_AMBIGUOUS while candidate retains separate defined per-variant records with no aggregate path
DUPLICATE_PHYSICAL_RECORD_POLICY_COMPATIBLE=YES; both preserve physical records in source order
ADDITIONAL_VARIANT_BLOCKER=NO; the divergent aggregate difference is handled by the required one-to-one ledger and fail-closed bridge rule, not by winner selection
```

A future bridge must compare candidate and production per-variant ledgers. It
must preserve production aggregate Null when production is asked for an
aggregate result, must not import that aggregate reason into candidate
per-variant records, and must never select a winner.

## Production status and reason model

```text
PRODUCTION_STATUS_REASON_MODEL=status defined|null; top-level reasonCode is null or one of PRONUNCIATION_NOT_FOUND; PRONUNCIATION_SOURCE_UNSUPPORTED; PRONUNCIATION_VARIANT_AMBIGUOUS; PRONUNCIATION_VOWEL_CATEGORY_UNSUPPORTED; SPOKEN_NUCLEUS_STRUCTURE_UNRESOLVED; VOICE_FAMILY_AUTHORITY_MISSING; MOVING_NUCLEUS_AUTHORITY_MISSING. Each variant carries its own reasonCode and canonicalVoicePath.
CANDIDATE_STATUS_REASON_MODEL=Source evidence status defined|null with source-adapter reasonCode, followed by candidate Voice status defined|null with source/projection reason codes; each physical variant retains its own evidence and projection reason, including malformed/unsupported/artifact/revision/provenance failures.
PREREQUISITE_REASON_TAXONOMY_REQUIRED=NO
PROPOSED_PREREQUISITE_REASON_CODES=NONE; this contract creates no runtime result. Preserve existing nested source/projection reasons. A later bridge contract may use its separately ratified bridge-level blocked codes for artifact identity, normalization, provenance, mapping, and variant-policy failures.
```

The future bridge must represent defined, Null, Unknown/missing authority,
malformed, unsupported, ambiguous variants, missing pronunciation, artifact
mismatch, normalization mismatch, annotation mismatch, and mapping mismatch
without replacing the original source or projection reason.

## Required future change classification

```text
ENVELOPE_FUTURE_CHANGE_CLASSIFICATION=NEW_PRODUCTION_ENVELOPE_ONLY
NORMALIZATION_FUTURE_CHANGE_CLASSIFICATION=BRIDGE_FAIL_CLOSED_RULE_ONLY
ANNOTATION_FUTURE_CHANGE_CLASSIFICATION=BRIDGE_FAIL_CLOSED_RULE_ONLY
SEGMENTATION_FUTURE_CHANGE_CLASSIFICATION=NO_CODE_CHANGE_REQUIRED
VOICE_MAPPING_FUTURE_CHANGE_CLASSIFICATION=PRODUCTION_METADATA_EXPOSURE_ONLY
VARIANT_POLICY_FUTURE_CHANGE_CLASSIFICATION=NEW_PRODUCTION_ENVELOPE_ONLY
NULL_REASON_MODEL_FUTURE_CHANGE_CLASSIFICATION=NO_CODE_CHANGE_REQUIRED
```

These classifications do not authorize the changes. They identify the
smallest future implementation boundary after DF ratification.

## Future implementation decomposition

```text
PREREQUISITES_IMPLEMENTABLE_IN_ONE_LANE=YES
FUTURE_IMPLEMENTATION_SCOPE=Additive per-production-variant authority envelope exposing exact source identity/locator, raw line, lexical input and normalized key, mapping/parser/normalization identities, representation kind, existing status/reason, and no new semantic fields; add fail-closed bridge guards for normalization equality, annotation contamination, exact artifact identity, mapping identity, one-to-one variant ledgers, and missing authority. Do not change source data, lookup behavior, candidate generation, parser semantics, normalization semantics, Discovery, API, UI, Gamma, ZC, or SAME_REPRESENTATION.
FUTURE_IMPLEMENTATION_ORDER_IF_MULTIPLE_LANES=One prerequisite implementation lane after DF ratification; a separate bridge runtime/SAME_REPRESENTATION lane remains required and is not authorized here.
```

The one-lane answer concerns only the prerequisite envelope and guards. It does
not merge the future bridge runtime into this contract.

## Runtime authority tag decision

```text
AUTHORITY_CONTRACT_REQUIRES_RUNTIME_AUTHORITY_TAG=NO
AUTHORIZED_RUNTIME_AUTHORITY_TAG=NOT_APPLICABLE
RUNTIME_AUTHORITY_TAG_NOT_REQUIRED_REASON=The future prerequisite envelope is additive provenance/structure metadata and grants no cross-boundary compatibility authority. A separately authorized bridge runtime would require its own ratified tag; this contract does not mint or reuse one.
```

## Future prerequisite test matrix

```text
FUTURE_TEST_MATRIX_ITEM_COUNT=31
FUTURE_TEST_NAMES_IN_ORDER=exactArtifactIdentity; artifactBytesAndSha; sourceRevisionAndNotation; productionEnvelopeCompleteness; candidateProductionLexicalNormalizationEquality; leadingWhitespaceFailsClosed; trailingWhitespaceFailsClosed; unicodeNormalization; caseBehavior; localeBehavior; ordinaryCmuDictLine; annotatedCmuDictLine; allAnnotatedRecords; variantSuffixParsing; terminalHashComment; rawPronunciationBoundary; sourceUnitsBoundary; normalizedSegments; nuclei; movingNucleusBoundary; voiceMappingIdentity; variantIdentityOrder; duplicatePhysicalRecordRetention; divergentVariantsNoWinner; malformedSourceFailsClosed; unsupportedArpabetFailsClosed; nullReasonPreservation; unknownOrMissingEnvelopeFailsClosed; tamperedProvenanceFailsClosed; noSemanticOrSameRepresentationLeakage; deterministicDeepFrozenRepeatability
```

The matrix is design-only. It covers artifact identity, lexical-policy edges,
ordinary and annotated records, parser boundaries, normalized structure,
mapping and moving-nucleus identity, variant multiplicity/order/duplicates,
Null/Unknown/malformed handling, tamper resistance, firewalls, deep freeze,
and determinism.

## Authority firewalls

```text
BRIDGE_IMPLEMENTATION_AUTHORIZED_BY_THIS_CONTRACT=NO
SAME_REPRESENTATION_AUTHORIZED_BY_THIS_CONTRACT=NO
PRONUNCIATION_IDENTITY_AUTHORIZED_BY_THIS_CONTRACT=NO
SEMANTIC_EQUIVALENCE_AUTHORIZED_BY_THIS_CONTRACT=NO
FUNCTIONAL_EQUIVALENCE_AUTHORIZED_BY_THIS_CONTRACT=NO
HISTORICAL_RELATION_AUTHORIZED_BY_THIS_CONTRACT=NO
CROSS_LANGUAGE_AUTHORIZED_BY_THIS_CONTRACT=NO
ALBANIAN_AUTHORIZED_BY_THIS_CONTRACT=NO
DISCOVERY_WIRING_AUTHORIZED_BY_THIS_CONTRACT=NO
API_WIRING_AUTHORIZED_BY_THIS_CONTRACT=NO
UI_WIRING_AUTHORIZED_BY_THIS_CONTRACT=NO
NATURAL_POSITIVE_CONTROL_ESTABLISHED=NO
FALSE_NULL_DIAGNOSTIC_DISPOSITION=DEFERRED_PENDING_V0_2_REACHABILITY
TWO_MODE_DESIGN_STATUS=NOT_AUTHORIZED
```

The bridge may eventually assert only bounded provenance-preserving structural
and representation-domain compatibility inside the exact English CMUdict
scope. It may not infer same representation, pronunciation identity, meaning,
function, history, language relation, or winner from equal Voice paths.

## Authority assessment and next lane

```text
PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_ASSESSMENT=DEFENSIBLE
PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_ASSESSMENT_REASON=The repository has one exact frozen CMUdict artifact, a ratified candidate evidence/Voice chain, and a shared production resolver on a demonstrable valid domain. The smallest safe contract is an additive production envelope plus equality/fail-closed guards; it preserves both existing normalizers and parsers and blocks the 22 annotation-contaminated records instead of manufacturing compatibility.
NEXT_RECOMMENDED_LANE=DF_RATIFICATION_OF_PRODUCTION_BRIDGE_PREREQUISITES
NEXT_RECOMMENDED_LANE_REASON=The prerequisite contract is explicit and bounded, but any envelope/guard implementation requires DF ratification and must remain separate from bridge runtime, SAME_REPRESENTATION, and Discovery authority.
NEXT_RECOMMENDED_LANE_IMPLEMENTATION_REQUIRED=NO
```

```text
BRIDGE_IMPLEMENTATION_AUTHORIZED_NOW=NO
NEXT_ACTION=AWAIT_DF_DECISION
```
