# OPEN INSTRUMENT / FUNCTIONAL MOTIVATION v0.2
# CMUDICT PATH B SHARED REPRESENTATION EVIDENCE EXPOSURE AUTHORITY v0.1

Status: authority-contract-only. This artifact authorizes one future
documentation-specified, additive, lossless, deterministic evidence-exposure
implementation. It does not implement that runtime, emit an evidence
instance, evaluate SAME_REPRESENTATION, or wire Discovery/API/UI.

## 1. Repository and protected authority

REPOSITORY=sokolgora-sketch/linguistic-decoder
BASE_BRANCH=main
EXPECTED_BASE_SHA=0e8be360e0a7555bc5e1a6324c35193953d6a7bf
HISTORICAL_S5_BRANCH=codex/s5-sanskrit-gloss-contract-resolution-v0-1
HISTORICAL_S5_HEAD=6d5bf985f1ca2763b8d41f3d4fa0735d689a1c30
HISTORICAL_S5_MUTATED=NO

SAME_REPRESENTATION_IDENTITY_MODEL=A_EXACT_CONTRACT_IDENTITY
EQUIVALENCE_CLASS_POLICY=FORBIDDEN_BY_THIS_CONTRACT
SAME_DOCTRINE_WEAKENING_AUTHORIZED=NO
SAME_REPRESENTATION_AUTHORITY_SHA256=cf579fdf3c2b28798ee38a93ec0c6d2fe7f4ce29e37e8b02c1b1f58d347a19b1
PATH_B_SAME_AUTHORITY_SHA256=b93366325db31b900c3216e01e2e764503d06fa80d4a2f1cf5610886a5102a6c
CONTRACT_ALIGNMENT_AUTHORITY_SHA256=754c1fd8d642b69b4675df978699b57172eadaa67b2907aebcb6f1a853a4932e

The following do not establish SAME_REPRESENTATION:

- shared source bytes;
- shared lexical spelling;
- shared ARPABET sequence;
- shared Voice path, Gamma, or ZC;
- equal normalization output;
- Bridge compatibility;
- shared provenance;
- structural, semantic, functional, historical, or cross-language similarity;
- an equivalence class.

## 2. Repository evidence inspected

DOCUMENTATION_INSPECTED=
- docs/dev-workflow.md
- docs/open-instrument/functional-motivation-v0.2-representation-authority-contract-v0.1.md
- docs/open-instrument/functional-motivation-v0.2-same-representation-authority-v0.1.md
- docs/open-instrument/functional-motivation-v0.2-cmudict-path-b-same-representation-adapter-authority-v0.1.md
- docs/open-instrument/functional-motivation-v0.2-cmudict-path-b-representation-contract-alignment-authority-v0.1.md
- docs/open-instrument/functional-motivation-v0.2-cmudict-candidate-source-adapter-contract-v0.1.md
- docs/open-instrument/functional-motivation-v0.2-cmudict-candidate-notation-normalization-authority-v0.1.md
- docs/open-instrument/functional-motivation-v0.2-cmudict-candidate-role-authority-v0.1.md
- docs/open-instrument/functional-motivation-v0.2-cmudict-production-spoken-bridge-prerequisites-authority-v0.1.md
- docs/open-instrument/functional-motivation-v0.2-cmudict-production-spoken-representation-bridge-authority-v0.1.md
- docs/open-instrument/functional-motivation-v0.2-cmudict-aware-comparison-authority-v0.1.md

RUNTIME_INSPECTED=
- src/shared/openInstrument/cmudictArpabetPronunciation.v0_1.ts
- src/shared/openInstrument/cmudictCandidateSourceAdapter.v0_1.ts
- src/shared/openInstrument/cmudictCandidateVoiceProjection.v0_1.ts
- src/shared/openInstrument/cmudictCandidateGammaProjection.v0_1.ts
- src/shared/openInstrument/cmudictCandidateZcProjection.v0_1.ts
- src/shared/openInstrument/cmudictProductionSpokenBridgePrerequisites.v0_1.ts
- src/shared/openInstrument/cmudictCandidateProductionSpokenRepresentationBridge.v0_1.ts
- src/shared/openInstrument/cmudictBridgeDiscoveryTransport.v0_1.ts
- src/shared/openInstrument/pronunciationToVoice.v0_1.ts
- src/shared/openInstrument/englishLexicalSenseSourceContract.v0_1.ts

TESTS_INSPECTED=
- tests/openInstrument.cmudictCandidateSourceAdapter.v0_1.spec.ts
- tests/openInstrument.cmudictCandidateVoiceProjection.v0_1.spec.ts
- tests/openInstrument.cmudictCandidateGammaProjection.v0_1.spec.ts
- tests/openInstrument.cmudictCandidateZcProjection.v0_1.spec.ts
- tests/openInstrument.cmudictProductionSpokenBridgePrerequisites.v0_1.spec.ts
- tests/openInstrument.cmudictCandidateProductionSpokenRepresentationBridge.v0_1.spec.ts
- tests/openInstrument.cmudictBridgeDiscoveryTransport.v0_1.spec.ts
- tests/openInstrument.pronunciationToVoice.v0_1.spec.ts

CMUDICT_SOURCE_PATH=src/data/openInstrument/pronunciation/cmudict.dict
CMUDICT_SOURCE_BYTES=3618488
CMUDICT_SOURCE_SHA256=81917843c7f44ce2b094ac63873c2c7a4cf802040792c455ba3ca406891c3d22
CMUDICT_SOURCE_REVISION=74790861f652b15e4ac49015a90074ad62a27690
CMUDICT_SOURCE_NOTATION=ARPABET
CMUDICT_SOURCE_PROFILE=open-instrument.cmudict-arpabet-en-us.v0_1
CMUDICT_SOURCE_FACTS_VERIFIED=YES

## 3. Ratified common boundary

DEEPEST_COMMON_EXISTING_REPRESENTATION_BOUNDARY=RAW_ARPABET_PRONUNCIATION_RECORD
SHARED_CONTRACT_ID=open-instrument.cmudict-shared-source-pronunciation.v0_1
SHARED_CONTRACT_VERSION=v0.1
SHARED_CONTRACT_REVISION=representation-contract-alignment-authority-v0.1
SHARED_CONTRACT_SCHEMA=open-instrument.cmudict-shared-source-pronunciation.v0_1
SHARED_CONTRACT_LANGUAGE_SCOPE=English
SHARED_CONTRACT_VARIETY_SCOPE=en-US
SHARED_CONTRACT_NOTATION=ARPABET
SHARED_CONTRACT_NORMALIZATION=NOT_APPLICABLE_AT_SHARED_BOUNDARY
SHARED_CONTRACT_SEGMENTATION=ORDERED_RAW_ARPABET_TOKEN_SEQUENCE
SHARED_CONTRACT_ORDERING=SOURCE_LINE_ORDER_AND_VARIANT_ORDER
SHARED_CONTRACT_PROJECTION=NOT_APPLICABLE_AT_SHARED_BOUNDARY
SHARED_CONTRACT_VARIANT_POLICY=PRESERVE_PHYSICAL_RECORDS_AND_VARIANTS
SHARED_CONTRACT_AMBIGUITY_POLICY=PRESERVE_ANNOTATION_AND_MULTIPLICITY_FAIL_CLOSED
SHARED_CONTRACT_SOURCE_AUTHORITY=RATIFIED_CMUDICT_SOURCE_ARTIFACT
SOURCE_PROVENANCE_REFS_AUTHORIZED=YES
SOURCE_PROVENANCE_REFS_FORMAT=Each reference is an ASCII UTF-8 string with one of the two exact prefixes CMUDICT_SOURCE_ARTIFACT_V0_1| or CMUDICT_SOURCE_RECORD_V0_1| and only the declared key/value fields below
SOURCE_PROVENANCE_REFS_DERIVATION=Derive exactly two references from the same instance fields: CMUDICT_SOURCE_ARTIFACT_V0_1|path=<sourcePath>|revision=<sourceRevision>|bytes=<sourceArtifactBytes>|sha256=<sourceArtifactSha256> and CMUDICT_SOURCE_RECORD_V0_1|artifactSha256=<sourceArtifactSha256>|line=<sourceLineNumber>
SOURCE_PROVENANCE_REFS_ORDER=The two exact references above in ascending UTF-8 byte order; no other order is valid
SOURCE_PROVENANCE_REFS_UNKNOWN_OR_EXTRA=Reject with CMUDICT_PATH_B_SHARED_EVIDENCE_SOURCE_PROVENANCE_INCOMPLETE when either reference is missing, malformed, duplicated, non-ASCII, contains an extra field, or does not derive exactly from the instance fields
SOURCE_PROVENANCE_REFS_CROSS_SIDE_EQUALITY_REQUIRED=YES

The boundary is before candidate normalization, production normalization,
Voice, Gamma, ZC, Bridge compatibility, role-specific ambiguity, and SAME.
The future implementation may expose evidence at this boundary only.

## 4. Existing evidence and future instance

The candidate parser already preserves source line, raw line, source form,
base form, variant ID, variant order, raw pronunciation, ordered raw ARPABET
tokens, lossless stress views, and opaque terminal annotation. The production
physical index already preserves source line, raw line, source form, base form,
variant ID, variant order, raw physical pronunciation, opaque annotation,
artifact identity, and annotation contamination. Production source units are
role-specific and are not the shared orderedRawArpabetTokens field.

PROPOSED_SHARED_INSTANCE_TYPE_NAME=CmuDictSharedSourcePronunciationInstanceV0_1
SHARED_INSTANCE_REQUIRES_ALIGNMENT_AUTHORITY_TAG=YES
SHARED_INSTANCE_ALIGNMENT_AUTHORITY_TAG_FIELD=alignmentAuthorityTag
SHARED_INSTANCE_ALIGNMENT_AUTHORITY_TAG_LITERAL=CMUDICT_PATH_B_REPRESENTATION_CONTRACT_ALIGNMENT_AUTHORITY_V0_1
SHARED_INSTANCE_REQUIRES_EVIDENCE_EXPOSURE_AUTHORITY_TAG=YES
SHARED_INSTANCE_EVIDENCE_EXPOSURE_AUTHORITY_TAG_FIELD=evidenceExposureAuthorityTag
SHARED_INSTANCE_EVIDENCE_EXPOSURE_AUTHORITY_TAG_LITERAL=CMUDICT_PATH_B_SHARED_REPRESENTATION_EVIDENCE_EXPOSURE_AUTHORITY_V0_1
AUTHORITY_CONTRACT_REQUIRES_RUNTIME_AUTHORITY_TAG=YES
AUTHORIZED_RUNTIME_AUTHORITY_TAG=CMUDICT_PATH_B_SHARED_REPRESENTATION_EVIDENCE_EXPOSURE_AUTHORITY_V0_1

The second tag is additive and does not overwrite the alignment tag ratified
by #2187. It identifies the evidence-exposure authority envelope; it does
not grant SAME_REPRESENTATION.

PROPOSED_SHARED_CONTRACT_TYPE_SIGNATURE_BEGIN
type CmuDictSharedSourcePronunciationRepresentationContractV0_1 = Readonly<{
  contractId: "open-instrument.cmudict-shared-source-pronunciation.v0_1";
  contractVersion: "v0.1";
  contractRevision: "representation-contract-alignment-authority-v0.1";
  schemaVersion: "open-instrument.cmudict-shared-source-pronunciation.v0_1";
  languageScope: "English";
  varietyScope: "en-US";
  notation: "ARPABET";
  normalizationIdentity: "NOT_APPLICABLE_AT_SHARED_BOUNDARY";
  segmentationIdentity: "ORDERED_RAW_ARPABET_TOKEN_SEQUENCE";
  orderingIdentity: "SOURCE_LINE_ORDER_AND_VARIANT_ORDER";
  projectionMethodology: null;
  projectionProfileVersion: null;
  variantPolicy: "PRESERVE_PHYSICAL_RECORDS_AND_VARIANTS";
  ambiguityPolicy: "PRESERVE_ANNOTATION_AND_MULTIPLICITY_FAIL_CLOSED";
  sourceAuthority: "RATIFIED_CMUDICT_SOURCE_ARTIFACT";
  authorityProvenanceRequirements: readonly string[];
  sourceProvenanceRequirements: readonly string[];
  reproducibilityRequirements: Readonly<{
    algorithm: "SHA-256";
    canonicalization: "CMUDICT_SHARED_EVIDENCE_CANONICAL_JSON_ARRAY_V0_1";
  }>;
}>;
PROPOSED_SHARED_CONTRACT_TYPE_SIGNATURE_END

PROPOSED_SHARED_INSTANCE_TYPE_SIGNATURE_BEGIN
type CmuDictSharedSourcePronunciationInstanceV0_1 = Readonly<{
  contractId: "open-instrument.cmudict-shared-source-pronunciation.v0_1";
  contractVersion: "v0.1";
  contractRevision: "representation-contract-alignment-authority-v0.1";
  schemaVersion: "open-instrument.cmudict-shared-source-pronunciation.v0_1";
  languageScope: "English";
  varietyScope: "en-US";
  notation: "ARPABET";
  sourcePath: "src/data/openInstrument/pronunciation/cmudict.dict";
  sourceRevision: "74790861f652b15e4ac49015a90074ad62a27690";
  sourceArtifactBytes: 3618488;
  sourceArtifactSha256: "81917843c7f44ce2b094ac63873c2c7a4cf802040792c455ba3ca406891c3d22";
  physicalRecordId: string;
  sourceLineNumber: number;
  rawSourceLine: string;
  sourceForm: string;
  baseSourceForm: string;
  variantId: string;
  variantOrder: number;
  rawPronunciation: string;
  orderedRawArpabetTokens: readonly string[];
  opaqueAnnotationText: string | null;
  annotationEligibility: "ELIGIBLE" | "INELIGIBLE";
  sourceAuthority: "RATIFIED_CMUDICT_SOURCE_ARTIFACT";
  sourceProvenanceRefs: readonly string[];
  deterministicReproducibility: Readonly<{
    algorithm: "SHA-256";
    canonicalization: "CMUDICT_SHARED_EVIDENCE_CANONICAL_JSON_ARRAY_V0_1";
    inputFingerprint: string;
    outputFingerprint: string;
  }>;
  alignmentAuthorityTag:
    "CMUDICT_PATH_B_REPRESENTATION_CONTRACT_ALIGNMENT_AUTHORITY_V0_1";
  evidenceExposureAuthorityTag:
    "CMUDICT_PATH_B_SHARED_REPRESENTATION_EVIDENCE_EXPOSURE_AUTHORITY_V0_1";
}>;
PROPOSED_SHARED_INSTANCE_TYPE_SIGNATURE_END

This type is a future implementation contract. It is not emitted by this
lane. It contains no lexical join key, parser identity, normalization
identity, Voice/Gamma/ZC value, production status, Bridge result, winner,
ranking, semantic claim, or SAME result.

## 5. Physical record identity

PHYSICAL_RECORD_ID_AUTHORIZED=YES
PHYSICAL_RECORD_ID_INPUT_FIELDS=sourceArtifactSha256,sourceLineNumber
PHYSICAL_RECORD_ID_CANONICALIZATION=ASCII string cmudict-physical-v0_1|sha256=<lowercase-64-hex>|line=<base-10-positive-integer>; no whitespace, trimming, locale, or Unicode normalization
PHYSICAL_RECORD_ID_ALGORITHM=The exact canonical string above is the physicalRecordId; the source artifact SHA-256 and 1-based source line number are hashed indirectly by the frozen artifact identity and locator, and no additional hash is required for the identifier
PHYSICAL_RECORD_ID_COLLISION_POLICY=Reject construction if either field is missing/invalid, if the same ID maps to different raw source evidence, or if one physical source record maps to more than one ID
PHYSICAL_RECORD_ID_NEW_SOURCE_DATA_REQUIRED=NO
PHYSICAL_RECORD_ID_RUNTIME_SEMANTIC_CHANGE_REQUIRED=NO

The pair is minimal: the verified artifact identity plus a 1-based physical
line locator uniquely identifies one record in the frozen artifact. The
source form and pronunciation remain mandatory evidence fields and are
cross-checked, not redundantly placed in the identifier.

## 6. Ordered raw ARPABET tokens

CANDIDATE_RAW_TOKEN_SOURCE=CmuDictCandidatePronunciationEvidenceVariantV0_1.rawPronunciation and its existing parser output
PRODUCTION_RAW_TOKEN_SOURCE=CmuDictPhysicalSourceEvidenceV0_1.rawPhysicalPronunciation, never orderedProductionSourceUnits
CANDIDATE_RAW_TOKEN_DERIVATION=Use the candidate parser's validated rawPronunciation slice before the terminal annotation delimiter and preserve its exact single-space token order
PRODUCTION_RAW_TOKEN_DERIVATION=Use the production physical evidence rawPhysicalPronunciation slice before the terminal annotation delimiter, apply the same authorized token grammar, and preserve exact token order without consuming production source-unit segmentation
RAW_TOKEN_ANNOTATION_EXCLUSION_RULE=The first separate delimiter token sequence " # " terminates raw pronunciation; all following text is opaque annotation and is never a pronunciation token
RAW_TOKEN_ORDER_PRESERVATION_RULE=Preserve ascending physical token order exactly; do not sort, deduplicate, normalize, infer, or choose tokens
RAW_TOKEN_MALFORMED_POLICY=Return no shared instance and CMUDICT_PATH_B_SHARED_EVIDENCE_RAW_TOKEN_MALFORMED for unsupported symbols, malformed stress digits, empty tokens, invalid spacing, or invalid annotation boundary
RAW_TOKEN_CROSS_SIDE_EQUALITY_REQUIRED=YES
RAW_TOKEN_CROSS_SIDE_MISMATCH_POLICY=Return CMUDICT_PATH_B_SHARED_EVIDENCE_RAW_TOKEN_MISMATCH and do not expose an eligible shared instance

No pronunciation is inferred from orthography. The raw token field is
distinct from production's orderedProductionSourceUnits even when their
values happen to be equal.

## 7. Annotation eligibility

ANNOTATION_ELIGIBILITY_AUTHORIZED=YES
ANNOTATION_ELIGIBILITY_SOURCE=Existing candidate opaqueAnnotationText and production physicalEvidence.opaqueAnnotationText/terminalOpaqueAnnotationDetected derived from the exact terminal " # " boundary
ANNOTATION_ELIGIBLE_RULE=No terminal annotation delimiter is present, opaqueAnnotationText is null, and the raw pronunciation grammar is valid
ANNOTATION_INELIGIBLE_RULE=A non-empty terminal opaque annotation is present; preserve the record and annotation but mark INELIGIBLE
ANNOTATED_RECORDS_PRESERVED=YES
ANNOTATED_RECORDS_SAME_ELIGIBLE=NO
ANNOTATED_RECORDS_BRIDGE_ELIGIBLE=NO
ANNOTATION_POLICY_NEW_DATA_REQUIRED=NO

An empty or malformed annotation boundary is not silently treated as
eligible or ineligible. It fails closed with
CMUDICT_PATH_B_SHARED_EVIDENCE_ANNOTATION_EVIDENCE_MALFORMED.

## 8. Canonical serialization

CANONICAL_SERIALIZATION_AUTHORIZED=YES
CANONICAL_SERIALIZATION_VERSION=CMUDICT_SHARED_EVIDENCE_CANONICAL_JSON_ARRAY_V0_1
CANONICAL_SERIALIZATION_FIELD_ORDER=contractId,contractVersion,contractRevision,schemaVersion,languageScope,varietyScope,notation,sourcePath,sourceRevision,sourceArtifactBytes,sourceArtifactSha256,physicalRecordId,sourceLineNumber,rawSourceLine,sourceForm,baseSourceForm,variantId,variantOrder,rawPronunciation,orderedRawArpabetTokens,opaqueAnnotationText,annotationEligibility,sourceAuthority,sourceProvenanceRefs,alignmentAuthorityTag,evidenceExposureAuthorityTag
CANONICAL_SERIALIZATION_NULL_RULE=Only opaqueAnnotationText may be null; serialize null as the literal JSON token null; any other unexpected null fails closed
CANONICAL_SERIALIZATION_STRING_RULE=Preserve the exact string scalar without trim, case folding, or Unicode normalization; encode UTF-8 and use ECMAScript JSON string escaping for quotes, backslashes, and control characters; reject unpaired surrogates
CANONICAL_SERIALIZATION_INTEGER_RULE=Encode finite non-negative safe integers as base-10 ASCII decimal with no sign, leading zero, exponent, or locale separator
CANONICAL_SERIALIZATION_ARRAY_RULE=Encode arrays as compact JSON arrays in declared order; orderedRawArpabetTokens keeps source order; sourceProvenanceRefs is sorted ascending by UTF-8 byte order and contains no duplicate reference
CANONICAL_SERIALIZATION_OBJECT_RULE=The canonical material is a fixed-order JSON array projection, not a runtime object; no object insertion order is observed; deterministicReproducibility is excluded from the material being fingerprinted
CANONICAL_SERIALIZATION_LOCALE_DEPENDENT=NO
CANONICAL_SERIALIZATION_PLATFORM_DEPENDENT=NO
CANONICAL_SERIALIZATION_SELF_REFERENTIAL_FINGERPRINTS=NO

The serializer is equivalent to JSON.stringify of the explicitly constructed
fixed-order array after the scalar and array validations above, with no
whitespace. No existing repository canonicalization helper was found that
can be reused for this shared source-record contract.

## 9. Deterministic fingerprints

FINGERPRINT_ALGORITHM=SHA-256
INPUT_FINGERPRINT_AUTHORIZED=YES
INPUT_FINGERPRINT_SCOPE=The canonical input tuple ["CMUDICT_SHARED_EVIDENCE_INPUT_V0_1",sourcePath,sourceRevision,sourceArtifactBytes,sourceArtifactSha256,sourceLineNumber,rawSourceLine]
INPUT_FINGERPRINT_CANONICALIZATION=CMUDICT_SHARED_EVIDENCE_CANONICAL_JSON_ARRAY_V0_1 applied to the fixed input tuple, encoded as UTF-8 with no trailing newline
OUTPUT_FINGERPRINT_AUTHORIZED=YES
OUTPUT_FINGERPRINT_SCOPE=The canonical shared-instance field array in CANONICAL_SERIALIZATION_FIELD_ORDER, excluding deterministicReproducibility and both fingerprint values
OUTPUT_FINGERPRINT_CANONICALIZATION=CMUDICT_SHARED_EVIDENCE_CANONICAL_JSON_ARRAY_V0_1 applied to the fixed output field array, encoded as UTF-8 with no trailing newline
FINGERPRINT_ENCODING=SHA-256 digest of canonical UTF-8 bytes
FINGERPRINT_HEX_CASE=lowercase hexadecimal
FINGERPRINT_SELF_REFERENCE_FORBIDDEN=YES
CANDIDATE_AND_PRODUCTION_OUTPUT_FINGERPRINT_EQUALITY_REQUIRED_FOR_IDENTICAL_SHARED_INSTANCE=YES
FINGERPRINT_NEW_SOURCE_DATA_REQUIRED=NO
FINGERPRINT_RUNTIME_SEMANTIC_CHANGE_REQUIRED=NO

The input fingerprint identifies the frozen physical evidence consumed.
The output fingerprint identifies the deterministic shared evidence object
after parsing and derivation. They have different scopes and must not be
arbitrary duplicates. No production fingerprint value is fabricated here.

## 10. Independent construction

CANDIDATE_SHARED_INSTANCE_PRODUCER=Future pure builder buildCmuDictCandidateSharedSourcePronunciationInstanceV0_1 over candidate evidence variant fields
PRODUCTION_SHARED_INSTANCE_PRODUCER=Future pure builder buildCmuDictProductionSharedSourcePronunciationInstanceV0_1 over production physicalEvidence fields
CANDIDATE_SHARED_INSTANCE_INPUT=CmuDictCandidatePronunciationEvidenceVariantV0_1, independently validated against the frozen shared contract
PRODUCTION_SHARED_INSTANCE_INPUT=CmuDictProductionSpokenBridgePrerequisiteVariantV0_1.physicalEvidence, independently validated against the frozen shared contract
CANDIDATE_AND_PRODUCTION_INDEPENDENT_CONSTRUCTION_REQUIRED=YES
CANDIDATE_MAY_CONSUME_PRODUCTION_SHARED_INSTANCE=NO
PRODUCTION_MAY_CONSUME_CANDIDATE_SHARED_INSTANCE=NO
SHARED_HELPERS_ALLOWED=Pure constants, scalar validation, physicalRecordId derivation, raw-token grammar validation, canonical fixed-array serialization, SHA-256 byte hashing, and shared-instance shape validation only; no role may obtain source facts from the other role

Each producer must derive raw tokens, annotation eligibility, physicalRecordId,
canonical fields, and fingerprints from its own existing evidence envelope.
Copying a completed instance across roles is forbidden.

## 11. Cross-side fail-closed checks

CROSS_SIDE_EXACT_MATCH_FIELDS=contractId,contractVersion,contractRevision,schemaVersion,languageScope,varietyScope,notation,sourcePath,sourceRevision,sourceArtifactBytes,sourceArtifactSha256,physicalRecordId,sourceLineNumber,rawSourceLine,sourceForm,baseSourceForm,variantId,variantOrder,rawPronunciation,orderedRawArpabetTokens,opaqueAnnotationText,annotationEligibility,sourceAuthority,sourceProvenanceRefs,alignmentAuthorityTag,evidenceExposureAuthorityTag,deterministicReproducibility.algorithm,deterministicReproducibility.canonicalization,deterministicReproducibility.inputFingerprint,deterministicReproducibility.outputFingerprint
CROSS_SIDE_ALLOWED_ROLE_SPECIFIC_FIELDS=NONE inside the shared instance; candidate/production parser identity, lexical normalization identity, Voice/Gamma/ZC projection, production status/reason, mapping identity, Bridge status, and role labels remain outside this shared object and are not SAME evidence
CROSS_SIDE_COMPARISON_ORDER=Compare the fields in CROSS_SIDE_EXACT_MATCH_FIELDS order, then compare array elements in declared order; return the first deterministic mismatch reason code
CROSS_SIDE_MISMATCH_RESULT=The paired comparison API returns CMUDICT_PATH_B_SHARED_EVIDENCE_<specific mismatch code>, preserves both source-side records outside the shared instance, and does not degrade the mismatch into SAME_REPRESENTATION, equivalence, compatibility, ranking, or selection

The exact shared fields above must match before any later, separately
authorized SAME adapter may consume the pair. This contract itself never
emits SAME.

## 12. Closed reason-code union

SHARED_EVIDENCE_REASON_CODE_TYPE_NAME=CmuDictPathBSharedRepresentationEvidenceExposureReasonCodeV0_1
SHARED_EVIDENCE_REASON_CODES=
CMUDICT_PATH_B_SHARED_EVIDENCE_AUTHORIZED
CMUDICT_PATH_B_SHARED_EVIDENCE_SOURCE_ARTIFACT_MISMATCH
CMUDICT_PATH_B_SHARED_EVIDENCE_SOURCE_PROVENANCE_INCOMPLETE
CMUDICT_PATH_B_SHARED_EVIDENCE_SOURCE_PROVENANCE_MISMATCH
CMUDICT_PATH_B_SHARED_EVIDENCE_SOURCE_LINE_MISSING
CMUDICT_PATH_B_SHARED_EVIDENCE_RAW_SOURCE_LINE_MISMATCH
CMUDICT_PATH_B_SHARED_EVIDENCE_SOURCE_FORM_MISMATCH
CMUDICT_PATH_B_SHARED_EVIDENCE_VARIANT_IDENTITY_MISMATCH
CMUDICT_PATH_B_SHARED_EVIDENCE_VARIANT_ORDER_MISMATCH
CMUDICT_PATH_B_SHARED_EVIDENCE_RAW_PRONUNCIATION_MISSING
CMUDICT_PATH_B_SHARED_EVIDENCE_RAW_PRONUNCIATION_MISMATCH
CMUDICT_PATH_B_SHARED_EVIDENCE_RAW_TOKEN_MALFORMED
CMUDICT_PATH_B_SHARED_EVIDENCE_RAW_TOKEN_MISMATCH
CMUDICT_PATH_B_SHARED_EVIDENCE_ANNOTATION_EVIDENCE_MALFORMED
CMUDICT_PATH_B_SHARED_EVIDENCE_ANNOTATION_ELIGIBILITY_MISMATCH
CMUDICT_PATH_B_SHARED_EVIDENCE_CONTRACT_IDENTITY_MISMATCH
CMUDICT_PATH_B_SHARED_EVIDENCE_AUTHORITY_TAG_MISSING_OR_MALFORMED
CMUDICT_PATH_B_SHARED_EVIDENCE_PHYSICAL_RECORD_ID_MISMATCH
CMUDICT_PATH_B_SHARED_EVIDENCE_CANONICALIZATION_FAILURE
CMUDICT_PATH_B_SHARED_EVIDENCE_INPUT_FINGERPRINT_FAILURE
CMUDICT_PATH_B_SHARED_EVIDENCE_OUTPUT_FINGERPRINT_FAILURE
CMUDICT_PATH_B_SHARED_EVIDENCE_NON_DETERMINISTIC_REPRODUCTION
CMUDICT_PATH_B_SHARED_EVIDENCE_UNKNOWN_FIELD_OR_MALFORMED_EVIDENCE

PROPOSED_REASON_CODE_TYPE_SIGNATURE=
type CmuDictPathBSharedRepresentationEvidenceExposureReasonCodeV0_1 =
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_AUTHORIZED"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_SOURCE_ARTIFACT_MISMATCH"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_SOURCE_PROVENANCE_INCOMPLETE"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_SOURCE_PROVENANCE_MISMATCH"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_SOURCE_LINE_MISSING"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_RAW_SOURCE_LINE_MISMATCH"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_SOURCE_FORM_MISMATCH"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_VARIANT_IDENTITY_MISMATCH"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_VARIANT_ORDER_MISMATCH"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_RAW_PRONUNCIATION_MISSING"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_RAW_PRONUNCIATION_MISMATCH"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_RAW_TOKEN_MALFORMED"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_RAW_TOKEN_MISMATCH"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_ANNOTATION_EVIDENCE_MALFORMED"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_ANNOTATION_ELIGIBILITY_MISMATCH"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_CONTRACT_IDENTITY_MISMATCH"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_AUTHORITY_TAG_MISSING_OR_MALFORMED"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_PHYSICAL_RECORD_ID_MISMATCH"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_CANONICALIZATION_FAILURE"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_INPUT_FINGERPRINT_FAILURE"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_OUTPUT_FINGERPRINT_FAILURE"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_NON_DETERMINISTIC_REPRODUCTION"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_UNKNOWN_FIELD_OR_MALFORMED_EVIDENCE";
PROPOSED_REASON_CODE_TYPE_SIGNATURE_END

These are shared-evidence reason codes, not SAME reason codes. Any unknown
field, extra field, accessor, cycle, malformed source evidence, or
non-deterministic re-run fails closed.

## 13. Future API authority

PROPOSED_FUTURE_API_COUNT=7

PROPOSED_FUTURE_API_SIGNATURES_BEGIN
type CmuDictSharedSourcePronunciationExposureResultV0_1 =
  | Readonly<{
      status: "authorized";
      reasonCode: "CMUDICT_PATH_B_SHARED_EVIDENCE_AUTHORIZED";
      instance: CmuDictSharedSourcePronunciationInstanceV0_1;
    }>
  | Readonly<{
      status: "null";
      reasonCode: Exclude<
        CmuDictPathBSharedRepresentationEvidenceExposureReasonCodeV0_1,
        "CMUDICT_PATH_B_SHARED_EVIDENCE_AUTHORIZED"
      >;
      instance: null;
    }>;

type CmuDictSharedSourcePronunciationInputFingerprintInputV0_1 = Readonly<{
  scope: "INPUT";
  sourcePath: string;
  sourceRevision: string;
  sourceArtifactBytes: number;
  sourceArtifactSha256: string;
  sourceLineNumber: number;
  rawSourceLine: string;
}>;

type CmuDictSharedSourcePronunciationComparisonResultV0_1 =
  | Readonly<{
      status: "match";
      reasonCode: "CMUDICT_PATH_B_SHARED_EVIDENCE_AUTHORIZED";
    }>
  | Readonly<{
      status: "mismatch";
      reasonCode: Exclude<
        CmuDictPathBSharedRepresentationEvidenceExposureReasonCodeV0_1,
        "CMUDICT_PATH_B_SHARED_EVIDENCE_AUTHORIZED"
      >;
    }>;

export const CMUDICT_SHARED_SOURCE_PRONUNCIATION_CONTRACT_V0_1:
  CmuDictSharedSourcePronunciationRepresentationContractV0_1;
INPUT_AUTHORITY=Ratified shared contract constants only.
OUTPUT_AUTHORITY=Immutable contract object.
FAILURE_BEHAVIOR=No runtime failure; implementation must not mutate the constant.
SIDE_EFFECTS=NONE

export function buildCmuDictCandidateSharedSourcePronunciationInstanceV0_1(
  input: CmuDictCandidatePronunciationEvidenceVariantV0_1,
): CmuDictSharedSourcePronunciationExposureResultV0_1;
INPUT_AUTHORITY=Candidate source-evidence variant and frozen source identity.
OUTPUT_AUTHORITY=Authorized shared instance envelope or exact shared-evidence Null reason.
FAILURE_BEHAVIOR=Return status null with one closed reason code; never throw for ordinary malformed evidence.
SIDE_EFFECTS=NONE

export function buildCmuDictProductionSharedSourcePronunciationInstanceV0_1(
  input: CmuDictProductionSpokenBridgePrerequisiteVariantV0_1,
): CmuDictSharedSourcePronunciationExposureResultV0_1;
INPUT_AUTHORITY=Production physicalEvidence and frozen source identity; orderedProductionSourceUnits are not consumed as raw tokens.
OUTPUT_AUTHORITY=Authorized shared instance envelope or exact shared-evidence Null reason.
FAILURE_BEHAVIOR=Return status null with one closed reason code; never throw for ordinary malformed evidence.
SIDE_EFFECTS=NONE

export function serializeCmuDictSharedSourcePronunciationInstanceV0_1(
  input: CmuDictSharedSourcePronunciationInstanceV0_1,
): string;
INPUT_AUTHORITY=Validated shared instance.
OUTPUT_AUTHORITY=Canonical UTF-8 JSON-array string without whitespace.
FAILURE_BEHAVIOR=Reject or return canonicalization failure before serialization when validation fails.
SIDE_EFFECTS=NONE

export function fingerprintCmuDictSharedSourcePronunciationV0_1(
  input:
    | CmuDictSharedSourcePronunciationInputFingerprintInputV0_1
    | CmuDictSharedSourcePronunciationInstanceV0_1,
): string;
INPUT_AUTHORITY=Frozen physical input tuple or validated shared instance, selected by a closed input/output scope discriminator.
OUTPUT_AUTHORITY=Lowercase SHA-256 hex digest for the selected scope.
FAILURE_BEHAVIOR=Reject invalid scope or canonicalization; a builder maps that failure to CMUDICT_PATH_B_SHARED_EVIDENCE_INPUT_FINGERPRINT_FAILURE or CMUDICT_PATH_B_SHARED_EVIDENCE_OUTPUT_FINGERPRINT_FAILURE before publishing a result.
SIDE_EFFECTS=NONE

export function validateCmuDictSharedSourcePronunciationInstanceV0_1(
  input: unknown,
): CmuDictPathBSharedRepresentationEvidenceExposureReasonCodeV0_1;
INPUT_AUTHORITY=Untrusted candidate or production shared-instance value.
OUTPUT_AUTHORITY=AUTHORIZED or one exact closed shared-evidence reason code.
FAILURE_BEHAVIOR=Fail closed for unknown fields, accessors, cycles, malformed values, tag mismatch, fingerprint mismatch, or non-deterministic reproduction.
SIDE_EFFECTS=NONE

export function compareCmuDictSharedSourcePronunciationInstancesV0_1(
  candidate: CmuDictSharedSourcePronunciationInstanceV0_1,
  production: CmuDictSharedSourcePronunciationInstanceV0_1,
): CmuDictSharedSourcePronunciationComparisonResultV0_1;
INPUT_AUTHORITY=Two independently built and individually validated shared instances; the first argument is the candidate-side result and the second is the production-side result
OUTPUT_AUTHORITY=Match only when every CROSS_SIDE_EXACT_MATCH_FIELDS value and both deterministic fingerprints are equal; otherwise the first deterministic mismatch reason code in CROSS_SIDE_COMPARISON_ORDER
FAILURE_BEHAVIOR=Return mismatch with CMUDICT_PATH_B_SHARED_EVIDENCE_SOURCE_PROVENANCE_MISMATCH for unequal derived provenance references, preserve both inputs, and fail closed for any other exact-field mismatch; never emit SAME_REPRESENTATION or an equivalence result
SIDE_EFFECTS=NONE
PROPOSED_FUTURE_API_SIGNATURES_END

No SAME comparator, Discovery consumer, API route, UI adapter, Bridge
authority broadener, or semantic matcher is authorized. The paired comparison
API is an evidence-integrity guard only; it does not produce a SAME result.

## 14. Future implementation authorization

AUTHORIZES_FUTURE_SHARED_EVIDENCE_EXPOSURE_IMPLEMENTATION=YES
AUTHORIZED_FUTURE_IMPLEMENTATION_SCOPE=Additive pure builders on the candidate and production evidence boundaries; the shared contract constant; exact physicalRecordId derivation; raw-token exposure from each side's own raw evidence; annotation eligibility; canonical fixed-array serialization; SHA-256 input/output fingerprints; closed-reason validation; deep immutable output; focused tests and documentation only

The authorized implementation must not acquire source data, add
pronunciation data, change parser semantics, change lexical normalizers,
change Voice/Gamma/ZC, broaden Bridge authority, emit SAME, create
equivalence classes, select/rank/collapse variants, or wire product surfaces.

AUTHORIZES_SAME_REPRESENTATION=NO
AUTHORIZES_PATH_B_SAME_ADAPTER_IMPLEMENTATION=NO
AUTHORIZES_VOICE_RELATIONSHIP=NO
AUTHORIZES_GATE1_STRUCTURAL_MOTIVATION_CANDIDATE=NO
AUTHORIZES_GATE4_STRUCTURAL_SUPPORT=NO
AUTHORIZES_BRIDGE_AUTHORITY_BROADENING=NO
AUTHORIZES_DISCOVERY_WIRING=NO
AUTHORIZES_API_WIRING=NO
AUTHORIZES_UI_WIRING=NO
AUTHORIZES_SEMANTIC_RELATION=NO
AUTHORIZES_FUNCTIONAL_RELATION=NO
AUTHORIZES_HISTORICAL_RELATION=NO
AUTHORIZES_CROSS_LANGUAGE_RELATION=NO
AUTHORIZES_EQUIVALENCE_CLASS=NO
AUTHORIZES_WINNER_SELECTION=NO
AUTHORIZES_RANKING=NO
AUTHORIZES_VARIANT_COLLAPSE=NO
AUTHORIZES_SOURCE_ACQUISITION=NO
AUTHORIZES_PROVIDER_OR_MODEL_EXECUTION=NO
AUTHORIZES_S5=NO
AUTHORIZES_POSITIVE_CONTROL_EXECUTION=NO
AUTHORIZES_FALSE_NULL_DIAGNOSTIC=NO

## 15. Authority classification

AUTHORITY_CLASSIFICATION=A_SHARED_EVIDENCE_EXPOSURE_IMPLEMENTATION_AUTHORIZABLE_FROM_EXISTING_EVIDENCE
AUTHORITY_CLASSIFICATION_REASON=Both existing role-specific envelopes contain the exact frozen physical source facts required for the shared instance. The remaining fields are deterministic additive projections: a minimal artifact-SHA-plus-line physical ID, explicit annotation eligibility, independently derived raw tokens, canonical fixed-array serialization, fingerprints, tags, and closed validation reasons. No new source or pronunciation data and no parser, normalizer, Voice, Gamma, ZC, Bridge, SAME, or product semantic change is required.

## 16. Lane firewall and validation policy

SOURCE_ACQUISITION=NO
NETWORK_TRANSFER=NO
PROVIDER_OR_MODEL_EXECUTION=NO
RUNTIME_IMPLEMENTATION_IN_THIS_LANE=NO
DISCOVERY_API_UI_WIRING=NO
S5_MUTATION=NO
SAME_REPRESENTATION_RESULT=NO

The authority artifact is the only permitted repository file change. The
future implementation lane must run focused CMUdict tests, typecheck:contracts,
typecheck:full, gate:prepush, gate:quick, and production build without
changing tests or runtime merely to obtain a pass. A gate:quick baseline or
environment failure must be recorded with exact output and lane-file
implication status.

NEXT_RECOMMENDED_LANE=CMUDICT_PATH_B_SHARED_REPRESENTATION_EVIDENCE_EXPOSURE_IMPLEMENTATION
NEXT_RECOMMENDED_LANE_REASON=The evidence-exposure contract is now fully specified and authorizes one additive implementation lane; the implementation must still preserve all frozen authority firewalls.
FINAL_CLASSIFICATION=CMUDICT_PATH_B_SHARED_REPRESENTATION_EVIDENCE_EXPOSURE_AUTHORITY_RATIFIED
NEXT_ACTION=AWAIT_DF_DECISION
