# OPEN INSTRUMENT / FUNCTIONAL MOTIVATION v0.2
# CMUDICT PATH B REPRESENTATION CONTRACT ALIGNMENT AUTHORITY v0.1

Status: authority-contract-only. This artifact ratifies the smallest
scientifically defensible shared source-pronunciation boundary found in the
existing CMUdict candidate and production-spoken evidence. It does not
implement a shared runtime type, change either pipeline, or authorize a
positive SAME_REPRESENTATION result.

## 1. Repository and protected authority

REPOSITORY=sokolgora-sketch/linguistic-decoder
BASE_BRANCH=main
BASE_SHA=1b799ce50ea96e495be60b1b0d40394a3f114f07
HISTORICAL_S5_BRANCH=codex/s5-sanskrit-gloss-contract-resolution-v0-1
HISTORICAL_S5_HEAD=6d5bf985f1ca2763b8d41f3d4fa0735d689a1c30
HISTORICAL_S5_MUTATED=NO

SAME_REPRESENTATION_IDENTITY_MODEL=A_EXACT_CONTRACT_IDENTITY
EQUIVALENCE_CLASS_POLICY=FORBIDDEN_BY_THIS_CONTRACT
SAME_DOCTRINE_WEAKENING_AUTHORIZED=NO
SAME_REPRESENTATION_AUTHORITY_PATH=docs/open-instrument/functional-motivation-v0.2-same-representation-authority-v0.1.md
SAME_REPRESENTATION_AUTHORITY_SHA256=cf579fdf3c2b28798ee38a93ec0c6d2fe7f4ce29e37e8b02c1b1f58d347a19b1
PATH_B_SAME_AUTHORITY_PATH=docs/open-instrument/functional-motivation-v0.2-cmudict-path-b-same-representation-adapter-authority-v0.1.md
PATH_B_SAME_AUTHORITY_SHA256=b93366325db31b900c3216e01e2e764503d06fa80d4a2f1cf5610886a5102a6c
PATH_B_SAME_AUTHORITY_PR=2186
PATH_B_SAME_AUTHORITY_MERGE_SHA=1b799ce50ea96e495be60b1b0d40394a3f114f07

The frozen doctrine remains exact contract identity. Shared source bytes,
shared lexical form, shared ARPABET output, shared mapping, shared Voice path,
Bridge compatibility, or an equivalence class do not establish
SAME_REPRESENTATION.

## 2. Authority and runtime inspection

AUTHORITY_FILES_INSPECTED=
- docs/open-instrument/functional-motivation-v0.2-representation-authority-contract-v0.1.md
- docs/open-instrument/functional-motivation-v0.2-same-representation-authority-v0.1.md
- docs/open-instrument/functional-motivation-v0.2-cmudict-path-b-same-representation-adapter-authority-v0.1.md
- docs/open-instrument/functional-motivation-v0.2-cmudict-candidate-source-adapter-contract-v0.1.md
- docs/open-instrument/functional-motivation-v0.2-cmudict-candidate-notation-normalization-authority-v0.1.md
- docs/open-instrument/functional-motivation-v0.2-cmudict-candidate-role-authority-v0.1.md
- docs/open-instrument/functional-motivation-v0.2-cmudict-production-spoken-bridge-prerequisites-authority-v0.1.md
- docs/open-instrument/functional-motivation-v0.2-cmudict-production-spoken-representation-bridge-authority-v0.1.md
- docs/open-instrument/functional-motivation-v0.2-cmudict-aware-comparison-authority-v0.1.md

RUNTIME_FILES_INSPECTED=
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

TEST_FILES_INSPECTED=
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

No source acquisition, network transfer, provider/model execution, S2/S3/S4,
or S5 activity occurred.

## 3. Frozen #2186 blocker and decision scope

The merged #2186 artifact correctly found multiple blockers at the attempted
candidate-to-production comparison boundary: no single canonical candidate
contract ID, distinct role schemas and parser identities, distinct lexical
normalizers, distinct projection/variant/ambiguity policies, incomplete
comparison-boundary provenance, and incomplete typed deterministic
reproducibility evidence.

This artifact does not erase those blockers. It relocates only the evidence
that genuinely precedes them: the lossless frozen CMUdict physical record and
its raw pronunciation. Role-specific lexical normalization, parsing policy,
segmentation, Voice projection, production status, ambiguity, and Bridge
compatibility remain downstream and are not silently promoted into the shared
representation.

FROZEN_DOMAIN_OUTPUT_EQUALITY_IS_CONTRACT_IDENTITY=NO
SHARED_ARTIFACT_IDENTITY_IS_CONTRACT_IDENTITY=NO
BRIDGE_COMPATIBILITY_IS_SAME_REPRESENTATION=NO

## 4. Pipeline decomposition

### Candidate pipeline

CANDIDATE_PIPELINE_STAGE_01=CMUdict physical source text; source artifact bytes/SHA/revision are verified before parsing.
CANDIDATE_PIPELINE_STAGE_02=parseCmuDictCandidateSourceRecordsV0_1; reads source line and raw line, separates source form/variant suffix, raw pronunciation, ordered raw ARPABET tokens, opaque terminal annotation, and source-line variant order; malformed tokens fail closed.
CANDIDATE_PIPELINE_STAGE_03=adaptCmuDictCandidateSourceEvidenceV0_1; applies normalizeEnglishLexicalJoinKeyV0_1:NFC->en-US-lowercase->NFC:no-trim for candidate joining, retains every matching physical source record and provenance, and emits CmuDictCandidatePronunciationEvidenceV0_1.
CANDIDATE_PIPELINE_STAGE_04=candidate Voice projection; consumes source evidence and the reviewed ARPABET-to-Voice mapping, preserving ordered segments, nuclei, variants, provenance, and Null reasons.
CANDIDATE_PIPELINE_STAGE_05=optional candidate Gamma then candidate ZC projections; these remain role-specific downstream projections and are not part of the shared source-pronunciation contract.
CANDIDATE_PIPELINE_FINAL_COMPARISON_SURFACE=CmuDictCandidateVoiceProjectionV0_1 and its per-variant sourceEvidence; no Path B SAME authority tag is emitted.

CANDIDATE_PIPELINE_INPUT_TYPES=source text; CmuDictCandidateAdapterInputV0_1
CANDIDATE_PIPELINE_OUTPUT_TYPES=CmuDictCandidateParsedSourceRecordV0_1; CmuDictCandidatePronunciationEvidenceV0_1; CmuDictCandidateVoiceProjectionV0_1
CANDIDATE_PIPELINE_PARSER_IDENTITY=parseCmuDictCandidateSourceRecordsV0_1:terminal-annotation-excluded-and-preserved
CANDIDATE_PIPELINE_NORMALIZATION=normalizeEnglishLexicalJoinKeyV0_1:NFC->en-US-lowercase->NFC:no-trim
CANDIDATE_PIPELINE_SEGMENTATION=ARPABET source-unit parsing followed by reviewed candidate Voice segment/nucleus projection
CANDIDATE_PIPELINE_ORDERING=source line order and per-join-key variant order retained
CANDIDATE_PIPELINE_VARIANT_TREATMENT=retain every physical record and variant; no collapse or winner
CANDIDATE_PIPELINE_AMBIGUITY_TREATMENT=fail closed for collision, malformed evidence, unsupported token, or unresolved provenance
CANDIDATE_PIPELINE_PROJECTION=source evidence -> reviewed Voice, then optional Gamma/ZC
CANDIDATE_PIPELINE_PROVENANCE=source artifact, line, raw line, form, variant, tokens, annotation, source IDs, and mapping provenance retained
CANDIDATE_PIPELINE_AUTHORITY=ratified source evidence and candidate Voice projection; no SAME authority
CANDIDATE_PIPELINE_DETERMINISTIC_IDENTITY=source artifact identity plus physical source fields; no typed shared-contract fingerprint emitted

### Production-spoken pipeline

PRODUCTION_PIPELINE_STAGE_01=CMUdict physical source text; source artifact bytes/SHA/revision are verified before lookup.
PRODUCTION_PIPELINE_STAGE_02=loadCmuDictV0_1; applies normalizeCmuDictLexicalWordV0_1:NFC->trim->lowercase, splits source/variant suffixes, retains source pronunciation units, and resolves lookup variants.
PRODUCTION_PIPELINE_STAGE_03=resolveCmuDictPronunciationToVoiceV0_1; parses ARPABET source units, applies the reviewed mapping, derives normalized segments/nuclei/Voice path, and emits production variant results with Null reasons.
PRODUCTION_PIPELINE_STAGE_04=buildCmuDictProductionSpokenBridgePrerequisitesV0_1; joins resolver variants to an independently built physical source index and emits CmuDictProductionSpokenBridgePrerequisitesV0_1 with physicalEvidence, annotation eligibility, source identity, parser/normalization identity, mapping identity, variants, and status.
PRODUCTION_PIPELINE_STAGE_05=production spoken consumer; current resolver/prerequisite behavior remains role-specific and no Path B SAME adapter consumes it.
PRODUCTION_PIPELINE_FINAL_COMPARISON_SURFACE=CmuDictProductionSpokenBridgePrerequisitesV0_1; the prerequisite envelope is the complete available production comparison input, not the raw resolver result alone.

PRODUCTION_PIPELINE_INPUT_TYPES=source text; original lexical input
PRODUCTION_PIPELINE_OUTPUT_TYPES=CmuDictPronunciationVariantV0_1; PronunciationVoiceVariantResultV0_1; CmuDictPhysicalSourceEvidenceV0_1; CmuDictProductionSpokenBridgePrerequisiteVariantV0_1; CmuDictProductionSpokenBridgePrerequisitesV0_1
PRODUCTION_PIPELINE_PARSER_IDENTITY=loadCmuDictV0_1:existing-production-parser
PRODUCTION_PIPELINE_NORMALIZATION=normalizeCmuDictLexicalWordV0_1:NFC->trim->lowercase
PRODUCTION_PIPELINE_SEGMENTATION=ARPABET source-unit parsing followed by reviewed production Voice segment/nucleus projection
PRODUCTION_PIPELINE_ORDERING=physical source line and per-production-key variant order retained in prerequisite evidence
PRODUCTION_PIPELINE_VARIANT_TREATMENT=retain physical variants; divergent top-level variants remain PRONUNCIATION_VARIANT_AMBIGUOUS Null
PRODUCTION_PIPELINE_AMBIGUITY_TREATMENT=fail closed; no production variant is selected or ranked
PRODUCTION_PIPELINE_PROJECTION=source pronunciation -> reviewed Voice path inside production prerequisite envelope
PRODUCTION_PIPELINE_PROVENANCE=physical source line/raw line/form/variant/tokens/source identity and mapping evidence retained by prerequisite envelope; current resolver result alone is incomplete
PRODUCTION_PIPELINE_AUTHORITY=production prerequisite authority and existing production spoken behavior; no SAME authority
PRODUCTION_PIPELINE_DETERMINISTIC_IDENTITY=source artifact identity plus physical source fields; no typed shared-contract fingerprint emitted

## 5. Deepest common existing representation boundary

DEEPEST_COMMON_EXISTING_REPRESENTATION_BOUNDARY=RAW_ARPABET_PRONUNCIATION_RECORD
COMMON_BOUNDARY_EXISTS=YES
COMMON_BOUNDARY_ALREADY_TYPED=PARTIAL
COMMON_BOUNDARY_ALREADY_AUTHORIZED=PARTIAL
COMMON_BOUNDARY_IS_BEFORE_ROLE_SPECIFIC_NORMALIZATION=YES
COMMON_BOUNDARY_IS_BEFORE_ROLE_SPECIFIC_PROJECTION=YES

The common object is not merely the shared file. It is one lossless physical
CMUdict source record with its exact source locator, raw source line, source
form, base form, variant identity/order, raw pronunciation, ordered raw
ARPABET tokens, source artifact identity, and opaque annotation treatment.
Both current pipelines independently possess these facts. Their existing
types are role-specific envelopes, so the common boundary is only partially
typed and needs separately authorized additive evidence exposure before a
runtime shared instance exists.

PARSER_SHARED_AT_COMMON_BOUNDARY=PARTIAL
PARSER_SHARED_AT_COMMON_BOUNDARY_REASON=Both parsers expose the same physical/raw evidence, but their parser identities and validation semantics remain distinct. Parser identity is provenance at this boundary, not a claim that the role-specific parsers are one implementation.
NORMALIZATION_SHARED_AT_COMMON_BOUNDARY=NO
NORMALIZATION_SHARED_AT_COMMON_BOUNDARY_REASON=Lexical join normalization occurs after physical record identity and remains role-specific.
PROJECTION_SHARED_AT_COMMON_BOUNDARY=NO
PROJECTION_SHARED_AT_COMMON_BOUNDARY_REASON=Voice/Gamma/ZC and production status are downstream consumers, not fields of the raw source-pronunciation record.

## 6. Shared representation object

SHARED_REPRESENTATION_OBJECT=CmuDictSharedSourcePronunciationInstanceV0_1
SHARED_REPRESENTATION_OBJECT_REASON=The smallest coherent object independently evidenced by both pipelines is the exact frozen CMUdict physical record plus its raw ARPABET pronunciation and lossless source provenance. It deliberately excludes lexical join normalization, Voice/Gamma/ZC projection, production status, winner selection, and Bridge/SAME claims.

SHARED_CONTRACT_CANONICAL_ID_PROPOSED=open-instrument.cmudict-shared-source-pronunciation.v0_1
SHARED_CONTRACT_VERSION_PROPOSED=v0.1
SHARED_CONTRACT_REVISION_PROPOSED=representation-contract-alignment-authority-v0.1
SHARED_CONTRACT_SCHEMA_PROPOSED=open-instrument.cmudict-shared-source-pronunciation.v0_1
SHARED_CONTRACT_LANGUAGE_SCOPE=English
SHARED_CONTRACT_VARIETY_SCOPE=en-US
SHARED_CONTRACT_NOTATION=ARPABET
SHARED_CONTRACT_NORMALIZATION_IDENTITY=NOT_APPLICABLE_AT_SHARED_BOUNDARY; lexical join normalization is downstream role-specific
SHARED_CONTRACT_SEGMENTATION_IDENTITY=ordered raw ARPABET token sequence only; Voice/nucleus segmentation is downstream role-specific
SHARED_CONTRACT_ORDERING_IDENTITY=physical source-line order plus variantOrder within base source form
SHARED_CONTRACT_PROJECTION_METHODOLOGY=NOT_APPLICABLE_AT_SHARED_BOUNDARY
SHARED_CONTRACT_PROJECTION_PROFILE_VERSION=NOT_APPLICABLE_AT_SHARED_BOUNDARY
SHARED_CONTRACT_VARIANT_POLICY=retain every physical record and variant in source order; no collapse, rank, or winner
SHARED_CONTRACT_AMBIGUITY_POLICY=preserve opaque annotation and physical multiplicity; downstream role-specific ambiguity remains downstream; malformed shared records fail closed
SHARED_CONTRACT_SOURCE_OR_PRODUCER_AUTHORITY=ratified CMUdict source artifact authority; no candidate or production role authority is transferred into the shared object
SHARED_CONTRACT_AUTHORITY_PROVENANCE_REQUIREMENTS=contract ID/version/revision, exact alignment authority tag, source artifact identity, and the role-specific producer reference kept outside the shared object
SHARED_CONTRACT_SOURCE_PROVENANCE_REQUIREMENTS=source path, revision, bytes, SHA256, physical line number, raw source line, source form, base form, variant ID/order, raw pronunciation, ordered raw ARPABET tokens, and opaque annotation treatment
SHARED_CONTRACT_DETERMINISTIC_REPRODUCIBILITY_REQUIREMENTS=canonical serialization of the shared fields plus typed input/output SHA256 fingerprints; no fingerprint is invented by this artifact

Fields excluded by design:

- candidate or production lexical normalization identity;
- parser implementation identity as shared semantic identity;
- Voice/Gamma/ZC segments or paths;
- production status/reason codes;
- candidate/production role-specific ambiguity results;
- Bridge compatibility;
- SAME_REPRESENTATION result;
- semantic, functional, historical, or cross-language claims.

## 7. Proposed future shared types

These types are authority specifications only. They are not implemented in
this lane.

PROPOSED_FUTURE_SHARED_CONTRACT_TYPE=CmuDictSharedSourcePronunciationRepresentationContractV0_1
PROPOSED_FUTURE_SHARED_CONTRACT_TYPE_SIGNATURE=
```ts
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
    canonicalization: string;
  }>;
}>;
```

PROPOSED_FUTURE_SHARED_INSTANCE_TYPE=CmuDictSharedSourcePronunciationInstanceV0_1
PROPOSED_FUTURE_SHARED_INSTANCE_TYPE_SIGNATURE=
```ts
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
    canonicalization: string;
    inputFingerprint: string;
    outputFingerprint: string;
  }>;
}>;
```

The proposed instance contains no downstream normalizer, Voice, Gamma, ZC,
production status, or Bridge field. `physicalRecordId` is a deterministic
identifier over existing source locator fields; it is not a pronunciation
equivalence claim.

## 8. Independent instantiation test

CANDIDATE_CAN_INDEPENDENTLY_INSTANTIATE_SHARED_CONTRACT=PARTIAL
CANDIDATE_SHARED_INSTANCE_PRODUCER=parseCmuDictCandidateSourceRecordsV0_1 plus adaptCmuDictCandidateSourceEvidenceV0_1
CANDIDATE_SHARED_INSTANCE_INPUT=frozen CMUdict source text and candidate source evidence input
CANDIDATE_SHARED_INSTANCE_REQUIRED_FIELDS=all proposed shared instance fields, including explicit contract identity and deterministic fingerprints
CANDIDATE_SHARED_INSTANCE_EXISTING_FIELDS=source artifact identity; source line/raw line; source form/base form; variant ID/order; raw pronunciation; ordered raw ARPABET tokens; opaque annotation; candidate source provenance
CANDIDATE_SHARED_INSTANCE_MISSING_FIELDS=canonical shared contract ID/version/revision; explicit annotation eligibility field; canonical physicalRecordId field; alignment authority tag; typed input/output fingerprints
CANDIDATE_SHARED_INSTANCE_REQUIRES_NEW_SOURCE_DATA=NO
CANDIDATE_SHARED_INSTANCE_REQUIRES_EXISTING_EVIDENCE_EXPOSURE=YES
CANDIDATE_SHARED_INSTANCE_REQUIRES_RUNTIME_SEMANTIC_CHANGE=NO

PRODUCTION_CAN_INDEPENDENTLY_INSTANTIATE_SHARED_CONTRACT=PARTIAL
PRODUCTION_SHARED_INSTANCE_PRODUCER=buildCmuDictProductionSpokenBridgePrerequisitesV0_1 physical source index and prerequisite envelope
PRODUCTION_SHARED_INSTANCE_INPUT=frozen CMUdict source text and original lexical input
PRODUCTION_SHARED_INSTANCE_REQUIRED_FIELDS=all proposed shared instance fields, including explicit contract identity and deterministic fingerprints
PRODUCTION_SHARED_INSTANCE_EXISTING_FIELDS=source artifact identity; physicalRecordId; source line/raw line; source form/base form; variant ID/order; raw physical pronunciation; ordered production source units; opaque annotation; annotation eligibility; production source provenance
PRODUCTION_SHARED_INSTANCE_MISSING_FIELDS=canonical shared contract ID/version/revision; alignment authority tag; typed input/output fingerprints; direct shared instance type
PRODUCTION_SHARED_INSTANCE_REQUIRES_NEW_SOURCE_DATA=NO
PRODUCTION_SHARED_INSTANCE_REQUIRES_EXISTING_EVIDENCE_EXPOSURE=YES
PRODUCTION_SHARED_INSTANCE_REQUIRES_RUNTIME_SEMANTIC_CHANGE=NO

BOTH_SIDES_CAN_INDEPENDENTLY_INSTANTIATE_ONE_SHARED_CONTRACT=PARTIAL; existing evidence supports the object, but additive lossless exposure and newly ratified contract identity/fingerprint fields are required before runtime instances exist.

## 9. Normalization identity test

SHARED_BOUNDARY_NORMALIZATION_CLASSIFICATION=DOWNSTREAM_ROLE_SPECIFIC
SHARED_BOUNDARY_NORMALIZATION_REASON=Physical CMUdict record identity and raw pronunciation can be established from source locator/form/variant/raw fields before either lexical join key is computed. Candidate NFC->en-US-lowercase->NFC:no-trim and production NFC->trim->lowercase remain distinct downstream operations.
DISTINCT_EXISTING_NORMALIZERS_REMAIN_BLOCKER_TO_SHARED_CONTRACT=NO_AT_SHARED_RAW_RECORD_BOUNDARY; YES_FOR_DIRECT_ROLE_OUTPUT_IDENTITY
EXACT_NORMALIZATION_OUTPUT_EQUALITY_STILL_REQUIRED_FOR_FUTURE_PAIRING=YES
SHARED_NORMALIZATION_CONTRACT_MUST_BE_NEWLY_RATIFIED=NO_AT_SHARED_BOUNDARY; YES_ONLY_IF_A_FUTURE_ADAPTER_COMPARES_ROLE-SPECIFIC_NORMALIZED_OUTPUTS
NORMALIZATION_OUTPUT_EQUAL_ON_FROZEN_DOMAIN=YES; NOT CONTRACT IDENTITY
NORMALIZATION_SEMANTICS_CHANGED_BY_THIS_ARTIFACT=NO

Excluding normalization does not evade SAME_REPRESENTATION: it identifies the
shared object at a lower, explicitly named representation level. A future
SAME adapter must still compare and authorize role-specific normalization,
projection, variant, ambiguity, provenance, and reproducibility dimensions
before emitting SAME_REPRESENTATION.

## 10. Parser, projection, variant, ambiguity, and annotation decomposition

PARSER_SHARED_AT_COMMON_BOUNDARY=PARTIAL
PARSER_ROLE_SPECIFIC_DOWNSTREAM=YES
PARSER_BLOCKS_SHARED_CONTRACT=CONDITIONAL
PARSER_REASON=Both parsers preserve enough raw evidence to instantiate the proposed object, but parser identities and validation behavior differ. Future evidence exposure must cross-check exact raw-line/token correspondence and retain parser provenance without claiming parser identity.

SEGMENTATION_SHARED_AT_COMMON_BOUNDARY=PARTIAL
SEGMENTATION_ROLE_SPECIFIC_DOWNSTREAM=YES
SEGMENTATION_BLOCKS_SHARED_CONTRACT=NO_AT_RAW_TOKEN_BOUNDARY
SEGMENTATION_REASON=The shared object contains ordered raw ARPABET tokens only. Normalized segments, nuclei, moving-nucleus authority, and Voice segmentation remain downstream.

ORDERING_SHARED_AT_COMMON_BOUNDARY=YES
ORDERING_ROLE_SPECIFIC_DOWNSTREAM=NO_FOR_PHYSICAL_ORDER
ORDERING_BLOCKS_SHARED_CONTRACT=CONDITIONAL
ORDERING_REASON=Both sides retain source line and variant order, but future exposure must assert exact one-to-one order and reject missing/reordered records.

PROJECTION_SHARED_AT_COMMON_BOUNDARY=NO
PROJECTION_ROLE_SPECIFIC_DOWNSTREAM=YES
PROJECTION_BLOCKS_SHARED_CONTRACT=NO_AT_RAW_RECORD_BOUNDARY
PROJECTION_REASON=Candidate Voice/Gamma/ZC and production spoken projection are explicitly excluded from the shared object.

VARIANT_POLICY_SHARED_AT_COMMON_BOUNDARY=YES
VARIANT_POLICY_ROLE_SPECIFIC_DOWNSTREAM=YES
VARIANT_POLICY_BLOCKS_SHARED_CONTRACT=NO_FOR_PRESERVATION_POLICY
VARIANT_POLICY_REASON=The shared contract preserves every physical record and variant. Candidate and production top-level ambiguity behavior remains downstream and must not collapse records.

AMBIGUITY_POLICY_SHARED_AT_COMMON_BOUNDARY=PARTIAL
AMBIGUITY_POLICY_ROLE_SPECIFIC_DOWNSTREAM=YES
AMBIGUITY_POLICY_BLOCKS_SHARED_CONTRACT=NO_FOR_RAW_EVIDENCE
AMBIGUITY_POLICY_REASON=The shared object records multiplicity and annotation eligibility but does not resolve candidate collision or production divergent-variant status.

ANNOTATION_TREATMENT_SHARED_AT_COMMON_BOUNDARY=YES
ANNOTATION_TREATMENT_ROLE_SPECIFIC_DOWNSTREAM=YES
ANNOTATION_TREATMENT_BLOCKS_SHARED_CONTRACT=NO
ANNOTATION_TREATMENT_REASON=Both sides retain opaque annotation and exclude annotation from raw pronunciation identity; annotated records remain ineligible for future bridge/SAME evaluation.

## 11. Provenance and reproducibility

CANDIDATE_SHARED_PROVENANCE_COMPLETE=PARTIAL
PRODUCTION_SHARED_PROVENANCE_COMPLETE=PARTIAL
CANDIDATE_SHARED_PROVENANCE_MISSING=canonical shared contract ID/version/revision; explicit physicalRecordId field; explicit annotation eligibility; alignment tag; typed input/output fingerprints
PRODUCTION_SHARED_PROVENANCE_MISSING=canonical shared contract ID/version/revision; alignment tag; typed input/output fingerprints; direct shared instance type

EXISTING_FINGERPRINT_HELPER_FOUND=NO_FOR_CMUDICT_SHARED_SOURCE_RECORD
EXISTING_FINGERPRINT_HELPER=NONE
SHARED_INSTANCE_INPUT_FINGERPRINT_CAN_BE_DERIVED_FROM_EXISTING_EVIDENCE_WITHOUT_NEW_SCIENTIFIC_DATA=YES
SHARED_INSTANCE_OUTPUT_FINGERPRINT_CAN_BE_DERIVED_FROM_EXISTING_EVIDENCE_WITHOUT_NEW_SCIENTIFIC_DATA=YES
FINGERPRINT_DERIVATION_REQUIRES_NEW_AUTHORITY=YES
FINGERPRINT_DERIVATION_REQUIRES_RUNTIME_SEMANTIC_CHANGE=NO
FINGERPRINTS_INVENTED_BY_THIS_ARTIFACT=NO

The proposed canonicalization and fingerprints are future contract
requirements, not claimed current values. Existing source bytes, raw lines,
ordered tokens, locators, and source identity are sufficient inputs for a
separately implemented deterministic derivation; no new source data is
required.

## 12. Contract alignment decision matrix

CONTRACT_ALIGNMENT_DECISION_MATRIX_BEGIN
DIMENSION | SHARED_BOUNDARY_VALUE | CANDIDATE_STATUS | PRODUCTION_STATUS | ROLE_SPECIFIC_DOWNSTREAM | BLOCKS_SHARED_CONTRACT | NEW_DATA_REQUIRED | NEW_AUTHORITY_REQUIRED | RUNTIME_SEMANTIC_CHANGE_REQUIRED | RESULT
CONTRACT_ID | open-instrument.cmudict-shared-source-pronunciation.v0.1 | absent | absent | NO | YES_FOR_CURRENT_RUNTIME | NO | YES | NO | SHARED_IDENTITY_CAN_BE_RATIFIED_FROM_EXISTING_EVIDENCE
CONTRACT_VERSION | v0.1 | absent | absent | NO | YES_FOR_CURRENT_RUNTIME | NO | YES | NO | SHARED_IDENTITY_CAN_BE_RATIFIED_FROM_EXISTING_EVIDENCE
SCHEMA | shared physical record schema | role-specific schemas | role-specific schemas | NO | YES_FOR_CURRENT_RUNTIME | NO | YES | NO | EXISTING_EVIDENCE_EXPOSURE_REQUIRED
LANGUAGE_SCOPE | English | exact | exact | NO | NO | NO | NO | NO | EXACT_EXISTING_SHARED_IDENTITY
VARIETY_SCOPE | en-US | exact | exact | NO | NO | NO | NO | NO | EXACT_EXISTING_SHARED_IDENTITY
SOURCE_ARTIFACT_IDENTITY | path/revision/bytes/SHA above | exact | exact | NO | NO | NO | NO | NO | EXACT_EXISTING_SHARED_IDENTITY
NOTATION | ARPABET | exact | exact | NO | NO | NO | NO | NO | EXACT_EXISTING_SHARED_IDENTITY
NORMALIZATION | NOT_APPLICABLE_AT_SHARED_BOUNDARY | role-specific | role-specific | YES | NO_AT_SHARED_BOUNDARY | NO | NO_FOR_SHARED_BOUNDARY | NO | ROLE_SPECIFIC_DOWNSTREAM_NOT_PART_OF_SHARED_BOUNDARY
PARSER | raw evidence cross-check with parser provenance | distinct identity | distinct identity | YES | CONDITIONAL | NO | YES | NO | EXISTING_EVIDENCE_EXPOSURE_REQUIRED
SEGMENTATION | ordered raw token sequence | raw tokens plus Voice segmentation | raw tokens plus Voice segmentation | YES | NO_AT_SHARED_BOUNDARY | NO | NO_FOR_SHARED_BOUNDARY | NO | ROLE_SPECIFIC_DOWNSTREAM_NOT_PART_OF_SHARED_BOUNDARY
ORDERING | source-line and variant order | present | present | NO_FOR_PHYSICAL_ORDER | CONDITIONAL | NO | YES_FOR_ASSERTION | NO | EXISTING_EVIDENCE_EXPOSURE_REQUIRED
PROJECTION | none | Voice/Gamma/ZC downstream | production Voice downstream | YES | NO_AT_SHARED_BOUNDARY | NO | NO_FOR_SHARED_BOUNDARY | NO | ROLE_SPECIFIC_DOWNSTREAM_NOT_PART_OF_SHARED_BOUNDARY
PROJECTION_PROFILE | none | reviewed mapping downstream | reviewed mapping downstream | YES | NO_AT_SHARED_BOUNDARY | NO | NO_FOR_SHARED_BOUNDARY | NO | ROLE_SPECIFIC_DOWNSTREAM_NOT_PART_OF_SHARED_BOUNDARY
VARIANT_POLICY | preserve physical records and variants | present | present | ambiguity downstream | NO_FOR_SHARED_RECORD | NO | YES_FOR_SHARED_POLICY | NO | SHARED_IDENTITY_CAN_BE_RATIFIED_FROM_EXISTING_EVIDENCE
AMBIGUITY_POLICY | preserve, do not resolve | candidate fail-closed | production fail-closed | YES | NO_FOR_SHARED_RECORD | NO | YES_FOR_DOWNSTREAM_ALIGNMENT | NO | ROLE_SPECIFIC_DOWNSTREAM_NOT_PART_OF_SHARED_BOUNDARY
ANNOTATION_POLICY | opaque preserve; pronunciation excludes annotation; annotated ineligible | opaque preserved | opaque preserved and eligibility exposed | YES_FOR_ELIGIBILITY | CONDITIONAL | NO | YES_FOR_CANONICAL_FIELD | NO | EXISTING_EVIDENCE_EXPOSURE_REQUIRED
SOURCE_AUTHORITY | ratified CMUdict artifact | source evidence authority | production prerequisite authority | role authority downstream | NO_AT_SHARED_RECORD | NO | YES_FOR_TAG | NO | SHARED_IDENTITY_CAN_BE_RATIFIED_FROM_EXISTING_EVIDENCE
AUTHORITY_PROVENANCE | alignment tag plus source authority refs | partial | partial | YES | YES_FOR_CURRENT_RUNTIME | NO | YES | NO | EXISTING_EVIDENCE_EXPOSURE_REQUIRED
SOURCE_PROVENANCE | exact physical source ledger | partial | partial | NO_FOR_SOURCE_FACTS | CONDITIONAL | NO | YES_FOR_SHARED_SCHEMA | NO | EXISTING_EVIDENCE_EXPOSURE_REQUIRED
DETERMINISTIC_REPRODUCIBILITY | canonical serialization and SHA-256 fingerprints | absent | absent | NO | YES_FOR_CURRENT_RUNTIME | NO | YES | NO | NEW_AUTHORITY_REQUIRED
CONTRACT_ALIGNMENT_DECISION_MATRIX_END

## 13. Authority classification

CMUDICT_PATH_B_REPRESENTATION_CONTRACT_ALIGNMENT_FEASIBILITY=C_SHARED_CONTRACT_RATIFIABLE_AFTER_LOSSLESS_EXISTING_EVIDENCE_EXPOSURE
CMUDICT_PATH_B_REPRESENTATION_CONTRACT_ALIGNMENT_FEASIBILITY_REASON=Both pipelines independently contain the necessary frozen physical CMUdict source evidence, including raw pronunciation and ordered tokens, but neither exposes one canonical shared typed instance with the new contract identity, annotation eligibility, alignment authority, and deterministic fingerprint envelope. Additive lossless exposure is required; new source data, parser changes, normalizer changes, or runtime semantic changes are not.
AUTHORITY_CONTRACT_RESULT=COHERENT_SHARED_BOUNDARY_WITH_BOUNDED_EVIDENCE_EXPOSURE_BLOCKER
SHARED_CONTRACT_RATIFIABLE_FROM_EXISTING_EVIDENCE=YES
SHARED_CONTRACT_RUNTIME_IMPLEMENTED=NO
SAME_REPRESENTATION_POSITIVE_AUTHORIZED=NO

## 14. Runtime authority and authorization firewall

AUTHORITY_CONTRACT_REQUIRES_RUNTIME_AUTHORITY_TAG=YES
AUTHORIZED_RUNTIME_AUTHORITY_TAG=CMUDICT_PATH_B_REPRESENTATION_CONTRACT_ALIGNMENT_AUTHORITY_V0_1
RUNTIME_AUTHORITY_TAG_STATUS=RESERVED_FOR_FUTURE_SHARED_CONTRACT_EVIDENCE_OBJECT; NOT_EMITTED_BY_THIS_ARTIFACT

AUTHORIZES_SHARED_REPRESENTATION_CONTRACT_RATIFICATION=YES
AUTHORIZES_FUTURE_SHARED_INSTANCE_IMPLEMENTATION=NO
AUTHORIZES_FUTURE_PATH_B_SAME_ADAPTER_IMPLEMENTATION=NO
AUTHORIZES_EXISTING_NORMALIZER_CHANGE=NO
AUTHORIZES_EXISTING_PARSER_CHANGE=NO
AUTHORIZES_CANDIDATE_GENERATION_CHANGE=NO
AUTHORIZES_PRODUCTION_SPOKEN_CHANGE=NO
AUTHORIZES_VOICE_CHANGE=NO
AUTHORIZES_GAMMA_CHANGE=NO
AUTHORIZES_ZC_CHANGE=NO
AUTHORIZES_BRIDGE_AUTHORITY_BROADENING=NO
AUTHORIZES_DISCOVERY_WIRING=NO
AUTHORIZES_API_WIRING=NO
AUTHORIZES_UI_WIRING=NO
AUTHORIZES_SEMANTIC_RELATION=NO
AUTHORIZES_FUNCTIONAL_RELATION=NO
AUTHORIZES_HISTORICAL_RELATION=NO
AUTHORIZES_CROSS_LANGUAGE_RELATION=NO
AUTHORIZES_WINNER_SELECTION=NO
AUTHORIZES_RANKING=NO
AUTHORIZES_VARIANT_COLLAPSE=NO
AUTHORIZES_EQUIVALENCE_CLASS=NO
AUTHORIZES_S5=NO
AUTHORIZES_SOURCE_ACQUISITION=NO
AUTHORIZES_PROVIDER_OR_MODEL_EXECUTION=NO
AUTHORIZES_POSITIVE_CONTROL_EXECUTION=NO
AUTHORIZES_FALSE_NULL_DIAGNOSTIC=NO

The next implementation, if DF authorizes it, is limited to additive
lossless shared-evidence exposure and deterministic serialization. It must
not alter candidate generation, production behavior, parser semantics,
normalizer semantics, projection semantics, or Bridge/SAME authority.

## 15. Validation and lane scope

LANE_SCOPE=One documentation authority artifact only
IMPLEMENTATION_PERFORMED=NO
RUNTIME_FILES_CHANGED=NO
TEST_FILES_CHANGED=NO
SOURCE_FILES_CHANGED=NO
DISCOVERY_WIRING_PERFORMED=NO
S5_MUTATION=NO
SOURCE_ACQUISITION=NO
NETWORK_TRANSFER_PERFORMED=NO
PROVIDER_OR_MODEL_USED=NO

Required validation remains: artifact hash verification, git diff --check,
focused existing CMUdict tests, typecheck:contracts, typecheck:full,
gate:prepush, gate:quick, production build, CI, direct review-thread query,
and post-merge proof. No existing test is changed by this artifact.

## 16. Exact next lane

NEXT_RECOMMENDED_LANE=CMUDICT_PATH_B_SHARED_REPRESENTATION_EVIDENCE_EXPOSURE_IMPLEMENTATION
NEXT_RECOMMENDED_LANE_REASON=The source-pronunciation contract is now explicitly aligned at the raw record boundary, but the shared typed instance, canonical serialization, fingerprints, and alignment tag are not implemented. A separately authorized additive exposure lane must complete those fields before any Path B SAME adapter authority lane.

FINAL_CLASSIFICATION=CMUDICT_PATH_B_REPRESENTATION_CONTRACT_ALIGNMENT_AUTHORITY_RATIFIED
NEXT_ACTION=AWAIT_DF_DECISION
