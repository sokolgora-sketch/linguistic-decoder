# OPEN INSTRUMENT / FUNCTIONAL MOTIVATION v0.2
# CMUDICT PATH B SAME_REPRESENTATION ADAPTER AUTHORITY v0.1

Status: authority-contract-only; exact SAME_REPRESENTATION is bounded and not
authorized by this artifact.

This artifact freezes the smallest defensible authority boundary for a future
CMUdict candidate-to-production spoken SAME_REPRESENTATION adapter. It records
the existing repository contracts and the exact blockers found by inspection.
It does not implement an adapter, change candidate or production behavior,
wire Discovery, or authorize a positive SAME_REPRESENTATION result.

## 1. Repository and protected authority

REPOSITORY=sokolgora-sketch/linguistic-decoder
BASE_BRANCH=main
WORKTREE_POLICY=The mandated clean pre-push worktree is used for this lane; the protected S5 checkout is not used or mutated.
HISTORICAL_S5_HEAD=6d5bf985f1ca2763b8d41f3d4fa0735d689a1c30
SAME_REPRESENTATION_AUTHORITY_SHA256_BEFORE=cf579fdf3c2b28798ee38a93ec0c6d2fe7f4ce29e37e8b02c1b1f58d347a19b1
SAME_REPRESENTATION_AUTHORITY_PATH=docs/open-instrument/functional-motivation-v0.2-same-representation-authority-v0.1.md
PROTECTED_S5_MUTATED=NO
SAME_REPRESENTATION_AUTHORITY_MUTATED=NO

The frozen shared doctrine remains exact contract identity. A shared artifact,
lexical key, ARPABET sequence, Voice path, Gamma, ZC, or Bridge compatibility
does not establish SAME_REPRESENTATION. No equivalence class is introduced.

## 2. Authority inspected

The decision is based on these existing repository artifacts and contracts:

- `docs/open-instrument/functional-motivation-v0.2-same-representation-authority-v0.1.md`
- `docs/open-instrument/functional-motivation-v0.2-representation-authority-contract-v0.1.md`
- `docs/open-instrument/functional-motivation-v0.2-cmudict-candidate-source-adapter-contract-v0.1.md`
- `docs/open-instrument/functional-motivation-v0.2-cmudict-candidate-notation-normalization-authority-v0.1.md`
- `docs/open-instrument/functional-motivation-v0.2-cmudict-candidate-role-authority-v0.1.md`
- `docs/open-instrument/functional-motivation-v0.2-cmudict-production-spoken-bridge-prerequisites-authority-v0.1.md`
- `docs/open-instrument/functional-motivation-v0.2-cmudict-production-spoken-representation-bridge-authority-v0.1.md`
- `src/shared/openInstrument/cmudictArpabetPronunciation.v0_1.ts`
- `src/shared/openInstrument/cmudictCandidateSourceAdapter.v0_1.ts`
- `src/shared/openInstrument/cmudictCandidateVoiceProjection.v0_1.ts`
- `src/shared/openInstrument/cmudictProductionSpokenBridgePrerequisites.v0_1.ts`
- `src/shared/openInstrument/cmudictCandidateProductionSpokenRepresentationBridge.v0_1.ts`
- `src/shared/openInstrument/pronunciationToVoice.v0_1.ts`

SOURCE_FAMILY=CMUdict
SOURCE_PROFILE_ID=open-instrument.cmudict-arpabet-en-us.v0_1
SOURCE_REVISION=74790861f652b15e4ac49015a90074ad62a27690
SOURCE_NOTATION=ARPABET
SOURCE_ARTIFACT_BYTES=3618488
SOURCE_ARTIFACT_SHA256=81917843c7f44ce2b094ac63873c2c7a4cf802040792c455ba3ca406891c3d22
SOURCE_PATH=src/data/openInstrument/pronunciation/cmudict.dict
MAPPING_PROFILE_ID=open-instrument.cmudict-arpabet-en-us.v0_1
MAPPING_ID=pronunciation-to-voice.open-instrument.cmudict-arpabet-en-us.v0_1.v0_1
MAPPING_TABLE=CMUDICT_ARPABET_VOICE_PROFILE_V0_1

## 3. Existing Path B contracts

### Candidate side

CANDIDATE_SOURCE_RECORD_CONTRACT_TYPE=CmuDictCandidatePronunciationEvidenceV0_1
CANDIDATE_SOURCE_PARSER_IDENTITY=parseCmuDictCandidateSourceRecordsV0_1:terminal-annotation-excluded-and-preserved
CANDIDATE_LEXICAL_NORMALIZATION_IDENTITY=normalizeEnglishLexicalJoinKeyV0_1:NFC->en-US-lowercase->NFC:no-trim
CANDIDATE_VOICE_SCHEMA=open-instrument.cmudict-candidate-voice-projection.v0_1
CANDIDATE_VOICE_VARIANT_SCHEMA=open-instrument.cmudict-candidate-voice-projection.variant.v0_1
CANDIDATE_VOICE_AUTHORITY_TAG=DERIVED_FROM_RATIFIED_CMUDICT_CANDIDATE_SOURCE_EVIDENCE_VIA_REVIEWED_OPEN_INSTRUMENT_MAPPING
CANDIDATE_CONTRACT_ID_STATUS=NOT_EXPOSED_AS_ONE_SINGLE_CANONICAL_ID
CANDIDATE_CONTRACT_ID_EVIDENCE=The candidate boundary is represented by CmuDictCandidatePronunciationEvidenceV0_1 plus the CMUDICT_CANDIDATE_VOICE_PROJECTION_SCHEMA_V0_1 projection; no single candidate representation contract ID is currently exported or ratified.
CANDIDATE_PHYSICAL_RECORD_POLICY=Retain every matching physical source record, source line, raw line, variant ID/order, raw pronunciation, ordered raw ARPABET tokens, opaque annotation, source artifact identity, and provenance independently.

### Production-spoken side

PRODUCTION_REPRESENTATION_KIND=production_spoken
PRODUCTION_CONTRACT_ID=open-instrument.cmudict-production-spoken-bridge-prerequisites.v0_1
PRODUCTION_SCHEMA=open-instrument.cmudict-production-spoken-bridge-prerequisites.v0_1
PRODUCTION_VARIANT_SCHEMA=open-instrument.cmudict-production-spoken-bridge-prerequisites.variant.v0_1
PRODUCTION_PROJECTOR_ID=open-instrument.cmudict-production-spoken-bridge-prerequisites.v0_1
PRODUCTION_SOURCE_PARSER_IDENTITY=loadCmuDictV0_1:existing-production-parser
PRODUCTION_NORMALIZATION_IDENTITY=normalizeCmuDictLexicalWordV0_1:NFC->trim->lowercase
PRODUCTION_SOURCE_PATH=src/data/openInstrument/pronunciation/cmudict.dict
PRODUCTION_PHYSICAL_RECORD_POLICY=The prerequisite envelope retains physical record identity, source line, raw line, source form, base form, variant ID/order, raw pronunciation, ordered raw ARPABET tokens, source identity, and provenance; divergent variants remain aggregate-ambiguous at the top level.

CURRENT_PRODUCTION_RESULT_BOUNDARY_EVIDENCE=The existing prerequisite envelope can carry the production-side physical evidence, but the current production resolver result boundary is not itself a complete typed SAME_REPRESENTATION instance with every required identity and reproducibility field.
CURRENT_PRODUCTION_RESULT_MISSING_FIELDS=representation contract identity at the comparison boundary; explicit candidate/production role pair; complete deterministic input/output fingerprints; a future Path B SAME authority tag; and a single comparison-level contract identity.

## 4. CMUDICT_PATH_B_SAME_DIMENSION_MATRIX

The matrix is a contract decision table. `EXACT_IDENTITY` is required for a
positive SAME_REPRESENTATION result. `COMPATIBLE_BUT_DISTINCT` is not positive
identity. `UNESTABLISHED` or `INCOMPLETE` is a blocker.

| Dimension | Candidate evidence | Production-spoken evidence | Relation | Positive SAME allowed now? | Reason |
|---|---|---|---|---|---|
| contract ID | No single canonical ID; evidence type plus candidate Voice schema | `open-instrument.cmudict-production-spoken-bridge-prerequisites.v0_1` | `UNESTABLISHED` | NO | Candidate identity is not one exact contract ID. |
| schema/version | `open-instrument.cmudict-candidate-voice-projection.v0_1` | `open-instrument.cmudict-production-spoken-bridge-prerequisites.v0_1` | `MISMATCH` | NO | Distinct ratified schemas. |
| language scope | English / en-US CMUdict | English / en-US CMUdict | `EXACT_IDENTITY` | YES for this dimension | Same frozen source scope only. |
| variety scope | `open-instrument.cmudict-arpabet-en-us.v0_1` | `open-instrument.cmudict-arpabet-en-us.v0_1` | `EXACT_IDENTITY` | YES for this dimension | Same frozen profile. |
| source artifact | revision, bytes, and SHA above | revision, bytes, and SHA above | `EXACT_IDENTITY` | YES for this dimension | Shared artifact identity is necessary, not sufficient. |
| notation | ARPABET | ARPABET | `EXACT_IDENTITY` | YES for this dimension | Shared notation. |
| lexical normalization | `NFC->en-US-lowercase->NFC:no-trim` | `NFC->trim->lowercase` | `COMPATIBLE_BUT_DISTINCT` | NO | Outputs are only conditionally equal; no coercion or hidden trim is allowed. |
| parser identity | candidate parser with terminal annotation excluded and preserved | existing production parser | `COMPATIBLE_BUT_DISTINCT` | NO | Distinct parser contracts require explicit future comparison evidence. |
| segmentation | candidate Voice projection via the ratified ARPABET resolver | production prerequisite projection via the same mapping profile | `COMPATIBLE_BUT_DISTINCT` | NO | Shared mapping behavior does not erase distinct projection boundaries. |
| ordering | physical line and variant order preserved | physical line and variant order retained in prerequisite evidence | `CONDITIONAL` | NO | Must be proven per comparison input; no current identity assertion exists. |
| projection methodology | candidate source evidence -> reviewed candidate Voice projection | production parser/prerequisite -> production spoken envelope | `COMPATIBLE_BUT_DISTINCT` | NO | Different projector/role contracts. |
| projection profile | `pronunciation-to-voice.open-instrument.cmudict-arpabet-en-us.v0_1.v0_1` | same mapping ID and table | `EXACT_IDENTITY` | YES for this dimension | Shared mapping table. |
| variant policy | independent per-record/per-variant records; no aggregate | divergent variants can produce top-level `PRONUNCIATION_VARIANT_AMBIGUOUS` Null | `COMPATIBLE_BUT_DISTINCT` | NO | Top-level ambiguity policy differs. |
| ambiguity policy | retain physical variants and fail closed on candidate collision/invalidity | production aggregate Null for unresolved divergence | `COMPATIBLE_BUT_DISTINCT` | NO | No silent collapse or selection. |
| annotation treatment | opaque annotation excluded from pronunciation identity but preserved | production parser behavior is separately identified | `COMPATIBLE_BUT_DISTINCT` | NO | Exact treatment must be explicit at the comparison contract. |
| source/producer authority | candidate source/Voice authority tags | production prerequisite projector and source authority | `COMPATIBLE_BUT_DISTINCT` | NO | Distinct authority provenance. |
| physical provenance | candidate source line/raw-line/variant evidence present | present in prerequisite envelope, absent from current resolver result boundary | `INCOMPLETE_AT_RUNTIME_BOUNDARY` | NO | Comparison must consume the complete envelope. |
| deterministic reproducibility | no complete typed input/output fingerprint pair exposed | no complete typed input/output fingerprint pair exposed | `INCOMPLETE` | NO | Do not invent fingerprints. |
| comparison authority tag | no Path B SAME tag | no Path B SAME tag | `MISSING` | NO | This artifact reserves, but does not emit, the future tag. |

CMUDICT_PATH_B_SAME_DIMENSION_MATRIX_RESULT=BLOCKED
SAME_COMPARISON_REPRESENTATION_LEVEL=CMUDICT_SOURCE_PRONUNCIATION_INSTANCE_WITH_DERIVED_VOICE_PROJECTION
SAME_COMPARISON_REPRESENTATION_LEVEL_REASON=The candidate and production sides are compared at the frozen CMUdict source-pronunciation instance and its explicitly derived Voice projection, not at lexical form, orthography, Voice output alone, Bridge compatibility, semantic meaning, or Discovery presentation.

## 5. Normalization, variants, ambiguity, and provenance

NORMALIZATION_CONTRACT_IDENTITY_RELATION=COMPATIBLE_BUT_DISTINCT
NORMALIZATION_REASON=Candidate join normalization is `NFC->en-US-lowercase->NFC:no-trim`; production normalization is `NFC->trim->lowercase`. The frozen shared artifact places all valid physical source forms in the intended lexical domain, but domain overlap is not exact contract identity. A future adapter must require exact equality of independently computed outputs for every input and variant and must reject non-equal identities without coercion.
NORMALIZATION_ALIGNMENT_STRATEGY=Leave both existing normalizers unchanged; require exact equality outputs at the future adapter boundary.
NORMALIZATION_OUTPUT_EQUAL_ON_FROZEN_DOMAIN=YES_ON_THE_FROZEN_CMUDICT_ARTIFACT_DOMAIN; NOT_SUFFICIENT_FOR_CONTRACT_IDENTITY
NORMALIZATION_CAN_SUPPORT_SAME_EXACT_IDENTITY=NO
NORMALIZATION_SEMANTICS_CHANGED_BY_THIS_ARTIFACT=NO

VARIANT_POLICY_RELATION=COMPATIBLE_BUT_DISTINCT
VARIANT_POLICY_REASON=Candidate evidence retains every physical source record and variant independently. Production retains physical variants but emits top-level ambiguity Null for divergent variants. Identical variants are not collapsed. A future adapter must compare one-to-one variant pairs and preserve duplicate physical records.
AMBIGUITY_POLICY_RELATION=COMPATIBLE_BUT_DISTINCT
AMBIGUITY_POLICY_REASON=Candidate and production fail closed through different typed boundaries; neither side may be used to select, rank, or silently collapse a variant.
VARIANT_ORDER_RELATION=CONDITIONAL
VARIANT_ORDER_REQUIREMENT=Require source-line and variant-order equality for each paired record; if not proven, return a Path B blocked/Null reason.
PHYSICAL_DUPLICATES_COLLAPSED=NO
PHYSICAL_RECORDS_RETAINED=YES
SOURCE_PROVENANCE_PRESERVED=YES
RECORD_LOSS_ALLOWED=NO
VARIANT_AND_AMBIGUITY_CAN_SUPPORT_SAME_EXACT_IDENTITY=NO

CANDIDATE_VARIANT_POLICY=Retain every physical matching candidate record and every source variant independently in source order; no aggregate, collapse, rank, or winner.
PRODUCTION_VARIANT_POLICY=Retain physical prerequisite variants; unresolved divergent variants remain top-level production Null/PRONUNCIATION_VARIANT_AMBIGUOUS.
CANDIDATE_AMBIGUITY_POLICY=Fail closed for candidate collision, malformed source evidence, unsupported token, or unresolved provenance while preserving physical records.
PRODUCTION_AMBIGUITY_POLICY=Fail closed for divergent production variants; do not select a production variant.

PROVENANCE_REQUIRED=source profile, revision, notation, bytes, SHA, physical source line, raw source line, source form, base form, variant ID/order, raw pronunciation, ordered raw tokens, annotation treatment, parser identity, normalization identity, mapping identity/table, candidate/production role, and deterministic input/output fingerprints.
PROVENANCE_CURRENT_GAP=The current production resolver result does not independently expose the full comparison envelope; the existing prerequisite envelope must be the future adapter input.
DETERMINISTIC_REPRODUCIBILITY_RELATION=INCOMPLETE
DETERMINISTIC_REPRODUCIBILITY_REASON=The inspected types do not expose a complete typed input fingerprint/output fingerprint pair for both representation instances. No fingerprint is inferred or fabricated here.
CANDIDATE_REPRESENTATION_INSTANCE_EVIDENCE_COMPLETE=NO
PRODUCTION_REPRESENTATION_INSTANCE_EVIDENCE_COMPLETE=NO
CANDIDATE_AUTHORITY_PROVENANCE_COMPLETE=YES_WITHIN_CURRENT_CANDIDATE_SOURCE_AND_VOICE_BOUNDARY; NO_AT_PATH_B_COMPARISON_BOUNDARY
PRODUCTION_AUTHORITY_PROVENANCE_COMPLETE=YES_WITHIN_EXISTING_PREREQUISITE_ENVELOPE; NO_AT_PATH_B_COMPARISON_BOUNDARY
CANDIDATE_SOURCE_PROVENANCE_COMPLETE=YES_WITHIN_CURRENT_CANDIDATE_SOURCE_EVIDENCE
PRODUCTION_SOURCE_PROVENANCE_COMPLETE=NO_AT_CURRENT_RESOLVER_RESULT_BOUNDARY
CANDIDATE_DETERMINISTIC_REPRODUCIBILITY_COMPLETE=NO
PRODUCTION_DETERMINISTIC_REPRODUCIBILITY_COMPLETE=NO
CANDIDATE_REPRESENTATION_INSTANCE_MISSING_FIELDS=single canonical candidate contract ID; comparison-level role binding; typed input/output fingerprints; Path B comparison authority tag
PRODUCTION_REPRESENTATION_INSTANCE_MISSING_FIELDS=comparison-level role binding at resolver result boundary; typed input/output fingerprints; Path B comparison authority tag; complete comparison-level contract identity

## 6. Path B authority contract

### Proposed future type

PROPOSED_FUTURE_AUTHORITY_TYPE_NAME=CmuDictPathBSameRepresentationAuthorityV0_1
PROPOSED_FUTURE_AUTHORITY_TYPE_SIGNATURE=
```ts
type CmuDictPathBSameRepresentationAuthorityV0_1 = Readonly<{
  schemaVersion: "open-instrument.cmudict-path-b-same-representation-adapter-authority.v0_1";
  runtimeAuthorityTag: "CMUDICT_PATH_B_SAME_REPRESENTATION_ADAPTER_AUTHORITY_V0_1";
  status: "AUTHORIZED" | "BLOCKED" | "NULL";
  representationRelation: "SAME_REPRESENTATION" | null;
  candidateRepresentationInstance: CmuDictPathBRepresentationInstanceEvidenceV0_1 | null;
  productionRepresentationInstance: CmuDictPathBRepresentationInstanceEvidenceV0_1 | null;
  reasonCode: CmuDictPathBSameReasonCodeV0_1;
  bridgeEvidence: readonly string[];
  prerequisiteEvidence: readonly string[];
}>;
```

PROPOSED_FUTURE_REPRESENTATION_INSTANCE_TYPE_NAME=CmuDictPathBRepresentationInstanceEvidenceV0_1
PROPOSED_FUTURE_REPRESENTATION_INSTANCE_TYPE_SIGNATURE=
```ts
type CmuDictPathBRepresentationInstanceEvidenceV0_1 = Readonly<{
  role: "candidate_source_pronunciation_derived" | "production_spoken";
  contractId: string;
  schemaVersion: string;
  languageScope: "English";
  varietyScope: "en-US";
  notation: "ARPABET";
  normalizationIdentity: string;
  segmentationIdentity: string;
  orderingIdentity: string;
  projectionMethodology: string;
  projectionProfileVersion: string;
  variantPolicy: string;
  ambiguityPolicy: string;
  sourceOrProducerAuthority: string;
  authorityProvenanceRefs: readonly string[];
  sourceProvenanceRefs: readonly string[];
  deterministicReproducibility: Readonly<{
    algorithmIdentity: string;
    inputFingerprint: string;
    outputFingerprint: string;
  }>;
}>;
```

The type is proposed for a future isolated adapter implementation. This
artifact does not add it to runtime code and does not authorize an
`AUTHORIZED` value.

PATH_B_SAME_REASON_CODE_TYPE_NAME=CmuDictPathBSameReasonCodeV0_1
PATH_B_SAME_REASON_CODES=
```ts
type CmuDictPathBSameReasonCodeV0_1 =
  | "CMUDICT_PATH_B_SAME_AUTHORIZED"
  | "CMUDICT_PATH_B_SAME_CANDIDATE_CONTRACT_ID_UNESTABLISHED"
  | "CMUDICT_PATH_B_SAME_PRODUCTION_CONTRACT_ID_MISSING"
  | "CMUDICT_PATH_B_SAME_CONTRACT_ID_MISMATCH"
  | "CMUDICT_PATH_B_SAME_SCHEMA_MISMATCH"
  | "CMUDICT_PATH_B_SAME_SOURCE_IDENTITY_MISMATCH"
  | "CMUDICT_PATH_B_SAME_LANGUAGE_SCOPE_MISMATCH"
  | "CMUDICT_PATH_B_SAME_VARIETY_SCOPE_MISMATCH"
  | "CMUDICT_PATH_B_SAME_NOTATION_MISMATCH"
  | "CMUDICT_PATH_B_SAME_NORMALIZATION_MISMATCH"
  | "CMUDICT_PATH_B_SAME_SEGMENTATION_MISMATCH"
  | "CMUDICT_PATH_B_SAME_ORDERING_MISMATCH"
  | "CMUDICT_PATH_B_SAME_PROJECTION_MISMATCH"
  | "CMUDICT_PATH_B_SAME_PROJECTION_PROFILE_MISMATCH"
  | "CMUDICT_PATH_B_SAME_VARIANT_POLICY_MISMATCH"
  | "CMUDICT_PATH_B_SAME_AMBIGUITY_POLICY_MISMATCH"
  | "CMUDICT_PATH_B_SAME_ANNOTATION_POLICY_MISMATCH"
  | "CMUDICT_PATH_B_SAME_PROVENANCE_INCOMPLETE"
  | "CMUDICT_PATH_B_SAME_DETERMINISTIC_REPRODUCIBILITY_INCOMPLETE"
  | "CMUDICT_PATH_B_SAME_AUTHORITY_MISSING"
  | "CMUDICT_PATH_B_SAME_MALFORMED_AUTHORITY_TAG"
  | "CMUDICT_PATH_B_SAME_EQUIVALENCE_UNSUPPORTED"
  | "CMUDICT_PATH_B_SAME_UNKNOWN_FIELD";
```

PATH_B_SAME_BLOCKED_REASON=CMUDICT_PATH_B_SAME_CONTRACT_ID_UNESTABLISHED
PATH_B_SAME_BLOCKED_REASONS=CMUDICT_PATH_B_SAME_CANDIDATE_CONTRACT_ID_UNESTABLISHED; CMUDICT_PATH_B_SAME_SCHEMA_MISMATCH; CMUDICT_PATH_B_SAME_NORMALIZATION_MISMATCH; CMUDICT_PATH_B_SAME_PROJECTION_MISMATCH; CMUDICT_PATH_B_SAME_VARIANT_POLICY_MISMATCH; CMUDICT_PATH_B_SAME_PROVENANCE_INCOMPLETE; CMUDICT_PATH_B_SAME_DETERMINISTIC_REPRODUCIBILITY_INCOMPLETE

AUTHORITY_CONTRACT_REQUIRES_RUNTIME_AUTHORITY_TAG=YES
AUTHORIZED_RUNTIME_AUTHORITY_TAG=CMUDICT_PATH_B_SAME_REPRESENTATION_ADAPTER_AUTHORITY_V0_1
RUNTIME_AUTHORITY_TAG_STATUS=RESERVED_FOR_FUTURE_EXPLICIT_AUTHORITY_OBJECT; NOT_EMITTED_BY_THIS_ARTIFACT
SAME_REPRESENTATION_POSITIVE_RESULT_AUTHORIZED=NO
SAME_REPRESENTATION_AUTHORITY_STATUS=BLOCKED
SAME_REPRESENTATION_AUTHORITY_REASON=Exact contract identity cannot be established from the current candidate and production contracts without inventing a candidate contract ID, coercing distinct normalizers, or treating compatible mapping/provenance as identity.

## 7. Bridge, semantic, and runtime firewalls

BRIDGE_AUTHORITY_BOUNDARY=DOMAIN_COMPATIBILITY_ONLY_NO_RELATION_OR_DISCOVERY_AUTHORITY
BRIDGE_RUNTIME_AUTHORITY_TAG=CMUDICT_CANDIDATE_TO_PRODUCTION_SPOKEN_DOMAIN_COMPATIBILITY_AUTHORITY_V0_1
BRIDGE_AUTHORIZES_DOMAIN_COMPATIBILITY=YES
BRIDGE_AUTHORIZES_SAME_REPRESENTATION=NO
BRIDGE_AUTHORIZES_VOICE_RELATIONSHIP=NO
BRIDGE_AUTHORIZES_GATE1=NO
BRIDGE_AUTHORIZES_GATE4=NO
BRIDGE_COMPATIBILITY_IMPLIES_SAME_REPRESENTATION=NO
SHARED_ARTIFACT_IMPLIES_SAME_REPRESENTATION=NO
SHARED_ARPABET_IMPLIES_SAME_REPRESENTATION=NO
SHARED_MAPPING_IMPLIES_SAME_REPRESENTATION=NO
SHARED_VOICE_PATH_IMPLIES_SAME_REPRESENTATION=NO
SAME_REPRESENTATION_IMPLIES_VOICE_RELATION=NO
SAME_REPRESENTATION_IMPLIES_GATE1=NO
SAME_REPRESENTATION_IMPLIES_GATE2=NO
SAME_REPRESENTATION_IMPLIES_GATE4=NO
SAME_REPRESENTATION_IMPLIES_FUNCTIONAL_RELATION=NO
SAME_REPRESENTATION_IMPLIES_HISTORICAL_RELATION=NO
SAME_REPRESENTATION_IMPLIES_SEMANTIC_RELATION=NO
SAME_REPRESENTATION_IMPLIES_CROSS_LANGUAGE_RELATION=NO
WINNER_SELECTION_AUTHORIZED=NO
RANKING_AUTHORIZED=NO
VARIANT_COLLAPSE_AUTHORIZED=NO
SOURCE_ACQUISITION_AUTHORIZED=NO
NETWORK_AUTHORIZED=NO
PROVIDER_OR_MODEL_AUTHORIZED=NO
DISCOVERY_WIRING_AUTHORIZED=NO
API_WIRING_AUTHORIZED=NO
UI_WIRING_AUTHORIZED=NO
PRODUCTION_PARSER_CHANGE_AUTHORIZED=NO
PRODUCTION_NORMALIZER_CHANGE_AUTHORIZED=NO
CANDIDATE_PARSER_CHANGE_AUTHORIZED=NO
CANDIDATE_NORMALIZER_CHANGE_AUTHORIZED=NO
VOICE_CHANGE_AUTHORIZED=NO
GAMMA_CHANGE_AUTHORIZED=NO
ZC_CHANGE_AUTHORIZED=NO
BRIDGE_RUNTIME_CHANGE_AUTHORIZED=NO
HISTORICAL_S5_CHANGE_AUTHORIZED=NO

## 8. Future implementation boundary

FUTURE_ISOLATED_PATH_B_SAME_ADAPTER_IMPLEMENTATION_AUTHORIZED_BY_THIS_CONTRACT=NO
FUTURE_DISCOVERY_CONSUMER_AUTHORIZED_BY_THIS_CONTRACT=NO
FUTURE_GATE2_DIRECT_EMISSION_AUTHORIZED_BY_THIS_CONTRACT=NO
FUTURE_SAME_IMPLEMENTATION_PRECONDITION=DF must first ratify a single candidate representation contract identity, an explicit comparison-level envelope, exact per-input normalization equality, one-to-one variant/ambiguity policy, complete provenance, and deterministic fingerprints.
FUTURE_IMPLEMENTATION_ALLOWED_FILES=Only a separately authorized Path B authority module and its focused contract tests after DF ratification; no existing candidate/production/Voice/Gamma/ZC/Bridge/Discovery implementation files are authorized by this artifact.
FUTURE_IMPLEMENTATION_FORBIDDEN=Candidate generation changes; source parser changes; production parser changes; normalizer changes; source acquisition; provider/network calls; Voice/Gamma/ZC changes; Bridge authority broadening; Discovery/API/UI wiring; semantic, functional, historical, or cross-language claims; winner/ranking/selection; physical-record collapse.

AUTHORIZES_RUNTIME_ADAPTER_IMPLEMENTATION=NO
AUTHORIZES_DISCOVERY_INTEGRATION=NO
AUTHORIZES_DISCOVERY_WIRING=NO
AUTHORIZES_GATE2_DIRECT_EMISSION=NO
AUTHORIZES_GATE1_STRUCTURAL_CANDIDATE=NO
AUTHORIZES_GATE4_SUPPORT=NO
AUTHORIZES_GATE1_STRUCTURAL_MOTIVATION_CANDIDATE=NO
AUTHORIZES_VOICE_RELATIONSHIP=NO
AUTHORIZES_FUNCTIONAL_INTERPRETATION=NO
AUTHORIZES_SEMANTIC_RELATION=NO
AUTHORIZES_FUNCTIONAL_RELATION=NO
AUTHORIZES_HISTORICAL_RELATION=NO
AUTHORIZES_CROSS_LANGUAGE_RELATION=NO
AUTHORIZES_POSITIVE_CONTROL_EXECUTION=NO
AUTHORIZES_FALSE_NULL_DIAGNOSTIC=NO
AUTHORIZES_EQUIVALENCE_CLASS=NO
AUTHORIZES_API_WIRING=NO
AUTHORIZES_UI_WIRING=NO
AUTHORIZES_S5_ACTIVATION=NO
AUTHORIZES_S5_RERUN=NO
AUTHORIZES_PRODUCTION_SPOKEN_SEMANTIC_EQUIVALENCE=NO
AUTHORIZES_CROSS_REPRESENTATION_RELATION=NO
AUTHORIZES_SAME_REPRESENTATION=NO

## 9. Minimal future validation matrix

The future isolated implementation must prove, at minimum:

1. exact candidate and production contract/schema identity or a typed blocked result;
2. exact source profile, revision, notation, bytes, and SHA;
3. exact candidate/production lexical output equality for every input and variant;
4. no trim/coercion or hidden normalization;
5. one-to-one physical record and variant pairing;
6. source-line, raw-line, variant ID/order, parser, mapping, and role provenance;
7. complete deterministic input/output fingerprints;
8. duplicated physical records remain duplicated;
9. divergent variants remain blocked/Null and are not selected;
10. malformed, tampered, unknown, missing, and mismatched authority fail closed;
11. no `SAME_REPRESENTATION` positive is emitted without the exact reserved tag and all dimensions exact;
12. no Bridge, Voice, Gate, semantic, functional, historical, cross-language, Discovery, API, or UI authority leaks.

FUTURE_REQUIRED_TEST_MATRIX_STATUS=NOT_IMPLEMENTED_BY_THIS_LANE
CURRENT_FOCUSED_TEST_SCOPE=Existing CMUdict source adapter, candidate Voice projection, production prerequisite, Bridge, and transport tests only; no new runtime test is required for this documentation-only contract.

## 10. Lane scope and required validation

LANE_SCOPE=One authority artifact only, plus minimal documentation validation if repository convention requires it.
CHANGED_RUNTIME_FILES=NONE
CHANGED_TEST_FILES=NONE
CHANGED_SOURCE_FILES=NONE
CHANGED_DISCOVERY_FILES=NONE
CHANGED_S5_FILES=NONE
IMPLEMENTATION_PERFORMED=NO
DISCOVERY_WIRING_PERFORMED=NO
SOURCE_ACQUIRED=NO
NETWORK_TRANSFER_PERFORMED=NO
PROVIDER_OR_MODEL_USED=NO

The lane must run `git diff --check`, artifact hash verification, the focused
existing CMUdict contract suites, `npm run typecheck:full`,
`npm run gate:quick`, and `npm run build`. CI and review remain required before
the artifact can be merged. No test or gate result is implied by this document.

## 11. Ratification outcome

CMUDICT_PATH_B_SAME_AUTHORITY_FEASIBILITY=MULTIPLE_BLOCKERS
CMUDICT_PATH_B_SAME_AUTHORITY_FEASIBILITY_REASON=The exact identity claim is blocked by the absence of one canonical candidate contract ID, distinct candidate/production schemas and parser identities, distinct lexical normalization contracts, distinct projection/variant/ambiguity policies, incomplete comparison-boundary provenance, and incomplete deterministic reproducibility evidence. The shared artifact and mapping profile establish a bounded compatible domain only; they do not establish SAME_REPRESENTATION.
AUTHORITY_CONTRACT_RESULT=COHERENT_BOUNDED_BLOCKER
EXACT_SAME_REPRESENTATION_AUTHORIZED_BY_THIS_ARTIFACT=NO
IMPLEMENTATION_AUTHORIZED_BY_THIS_ARTIFACT=NO
NEXT_RECOMMENDED_LANE=CMUDICT_PATH_B_REPRESENTATION_CONTRACT_ALIGNMENT_AUTHORITY
NEXT_RECOMMENDED_LANE_REASON=Resolve the candidate contract-identity and comparison-envelope blockers through a separately ratified authority lane before any adapter implementation. Do not change runtime semantics or rerun S5.

FINAL_CLASSIFICATION=CMUDICT_PATH_B_SAME_REPRESENTATION_ADAPTER_AUTHORITY_BOUNDED_BLOCKER_RATIFICATION_READY
NEXT_ACTION=AWAIT_DF_DECISION
