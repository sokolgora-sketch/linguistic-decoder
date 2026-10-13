# OPEN INSTRUMENT — FUNCTIONAL MOTIVATION v0.2 CMUDICT BRIDGE → DISCOVERY INTEGRATION AUTHORITY v0.1

## Status and non-authorization

```text
STATUS=AUTHORITY_CONTRACT_DESIGN_ONLY
BASE_MAIN=7d6b5ba1d50cb7b6f89c0ce49ca5196412f7e419
BRIDGE_IMPLEMENTATION_AUTHORIZED_BY_THIS_CONTRACT=NO
DISCOVERY_INTEGRATION_IMPLEMENTATION_AUTHORIZED_BY_THIS_CONTRACT=NO
SAME_REPRESENTATION_AUTHORIZED_BY_THIS_CONTRACT=NO
VOICE_RELATIONSHIP_AUTHORIZED_BY_THIS_CONTRACT=NO
STRUCTURAL_MOTIVATION_CANDIDATE_AUTHORIZED_BY_THIS_CONTRACT=NO
GATE4_STRUCTURAL_SUPPORT_AUTHORIZED_BY_THIS_CONTRACT=NO
API_WIRING_AUTHORIZED_BY_THIS_CONTRACT=NO
UI_WIRING_AUTHORIZED_BY_THIS_CONTRACT=NO
POSITIVE_CONTROL_EXECUTION_AUTHORIZED=NO
FALSE_NULL_DIAGNOSTIC_EXECUTION_AUTHORIZED=NO
TWO_MODE_DESIGN_AUTHORIZED=NO
NO_SOURCE_ACQUISITION=YES
```

This contract freezes the smallest safe boundary for a future CMUdict
candidate-to-production_spoken Bridge result to be transported toward
Functional Motivation Discovery. It carries evidence and provenance only. It
does not create a Discovery candidate, a structural comparison, a gate result,
or a scientific relation.

## Purpose and accepted upstream authorities

The two current paths are deliberately separate:

```text
PATH_A_GENERIC_DISCOVERY=
buildMotivationEngineDiscoveryV0_1
→ buildStructuralComparisonV0_1
→ structuralRelationAuthorizedV0_2
→ functional interpretation

PATH_B_CMUDICT=
candidate source evidence
→ candidate Voice
→ candidate Gamma
→ candidate ZC
→ production_spoken bridge prerequisite envelope
→ representation Bridge
→ no current Discovery consumer
```

Accepted upstream authorities:

```text
CANDIDATE_SOURCE_AUTHORITY=docs/open-instrument/functional-motivation-v0.2-cmudict-candidate-source-adapter-contract-v0.1.md
CANDIDATE_VOICE_AUTHORITY=docs/open-instrument/functional-motivation-v0.2-cmudict-candidate-voice-projection-authority-v0.1.md
CANDIDATE_GAMMA_AUTHORITY=docs/open-instrument/functional-motivation-v0.2-cmudict-candidate-gamma-projection-authority-v0.1.md
CANDIDATE_ZC_AUTHORITY=docs/open-instrument/functional-motivation-v0.2-cmudict-candidate-zc-projection-authority-v0.1.md
BRIDGE_AUTHORITY=docs/open-instrument/functional-motivation-v0.2-cmudict-production-spoken-representation-bridge-authority-v0.1.md
BRIDGE_PREREQUISITES_AUTHORITY=docs/open-instrument/functional-motivation-v0.2-cmudict-production-spoken-bridge-prerequisites-authority-v0.1.md
BRIDGE_PREREQUISITES_SHA256=f112f92d78f75dea87540e897855b942022d6b4237482802101e49f60185978d
```

The frozen CMUdict identity is:

```text
SOURCE_PATH=src/data/openInstrument/pronunciation/cmudict.dict
SOURCE_BYTES=3618488
SOURCE_SHA256=81917843c7f44ce2b094ac63873c2c7a4cf802040792c455ba3ca406891c3d22
SOURCE_REVISION=74790861f652b15e4ac49015a90074ad62a27690
SOURCE_NOTATION=ARPABET
SOURCE_PROFILE_ID=open-instrument.cmudict-arpabet-en-us.v0_1
```

The accepted Bridge tag is:

```text
AUTHORIZED_RUNTIME_AUTHORITY_TAG=CMUDICT_CANDIDATE_TO_PRODUCTION_SPOKEN_DOMAIN_COMPATIBILITY_AUTHORITY_V0_1
```

## Repository evidence inspected

The current runtime symbols and boundaries were inspected directly:

```text
buildMotivationEngineDiscoveryV0_1(input: { word; inputLanguage; inputProfile; analysis; heart; sourceAdapters? }): MotivationEngineDiscoveryV0_1
buildStructuralComparisonV0_1(..., matchContext: CandidateMatchContextV0_1, ..., witness: GenericFunctionalWitnessV1): MotivationStructuralComparisonV0_1
structuralRelationAuthorizedV0_2(candidate: MotivationEngineDiscoveryCandidateV0_1): boolean
buildFunctionalMotivationInterpretationV0_2(input: { discovery; targetSense; heart? }): FunctionalMotivationInterpretationV0_2
```

The relevant current types are:

```text
MotivationEngineDiscoveryV0_1
MotivationEngineDiscoveryCandidateV0_1
MotivationStructuralComparisonV0_1
MotivationRepresentationKindV0_1
MotivationRepresentationCompatibilityV0_1
CandidateMatchContextV0_1
GenericFunctionalWitnessV1
GenericFunctionalWitnessSourceAdapterV1
```

The CMUdict chain was also inspected directly:

```text
parseCmuDictCandidateSourceRecordsV0_1
adaptCmuDictCandidateSourceEvidenceV0_1
projectCmuDictCandidateVoiceProjectionV0_1
projectCmuDictCandidateGammaProjectionV0_1
projectCmuDictCandidateZcProjectionV0_1
buildCmuDictProductionSpokenBridgePrerequisitesV0_1
```

`buildMotivationEngineDiscoveryV0_1` currently uses Albanian and S1 Latin
generic functional witness adapters. No production caller connects the CMUdict
candidate chain or the production prerequisite envelope to that function, to
`buildStructuralComparisonV0_1`, or to `structuralRelationAuthorizedV0_2`.

The current structural comparison builder automatically emits
`STRUCTURAL_MOTIVATION_CANDIDATE` for non-self generic witnesses, maps known
inputs to `CROSS_REPRESENTATION`, marks their Voice relationship
`NOT_COMPARABLE_ACROSS_REPRESENTATIONS`, and copies input-side structural
operation/root context into Gate 4 fields. Those semantics are not safe for a
transported CMUdict Bridge record.

## Architectural insertion-point audit

### Option matrix

| Option | Insertion point | Input | Output | Authority boundary | Main risk | Reuse | Recommended |
| --- | --- | --- | --- | --- | --- | --- | --- |
| OPTION_A | Extend `buildMotivationEngineDiscoveryV0_1` directly | Bridge result plus current Discovery input | Existing `MotivationEngineDiscoveryV0_1` | Would enter generic Discovery construction | Existing builder would manufacture candidate classification, structural presentation, and input-derived Gate 4 context | Reuses current runtime | NO |
| OPTION_B | Typed adapter before `buildMotivationEngineDiscoveryV0_1` | Bridge result | `GenericFunctionalWitnessV1` or `GenericFunctionalWitnessSourceAdapterV1` | Would enter generic witness semantics | Pronunciation evidence would be mislabeled as a functional witness and inherit query/evidence/operation semantics | Existing adapter types | NO |
| OPTION_C | Separate CMUdict path before `buildStructuralComparisonV0_1` | Bridge result plus production context | Existing `MotivationEngineDiscoveryCandidateV0_1` or current comparison input | Would still require current comparison builder | Current builder auto-emits `STRUCTURAL_MOTIVATION_CANDIDATE` and Gate 4 context | Current comparison type | NO |
| OPTION_D | New typed Bridge-to-Discovery transport envelope and later explicit comparison boundary | Ratified Bridge result and preserved ledgers | `CmuDictBridgeDiscoveryTransportEnvelopeV0_1` | Transport only; no four-gate fields | Requires a future dedicated comparison authority, keeping current generic path unchanged | No unsafe semantic reuse | YES |

```text
PREFERRED_INTEGRATION_ARCHITECTURE=OPTION_D_TYPED_BRIDGE_DISCOVERY_TRANSPORT_ENVELOPE
PREFERRED_INSERTION_POINT=Immediately after a future ratified Bridge result and before any future CMUdict-aware comparison builder; not inside buildMotivationEngineDiscoveryV0_1 or current buildStructuralComparisonV0_1
PREFERRED_ARCHITECTURE_REASON=The transport envelope preserves both physical ledgers while keeping candidate pronunciation evidence outside GenericFunctionalWitnessV1 and keeping current four-gate construction unchanged. A later authority lane may define an explicit comparison boundary; this contract does not.
```

`OPTION_D` is an authority design, not an implementation authorization.

## Integration input contract

The future transport consumes only ratified Bridge output plus the evidence
needed to preserve identity and auditability. The classifications below apply
to an eligible Bridge-compatible record; a Null or blocked record preserves its
available evidence and fails closed.

| Field | Classification | Reason |
| --- | --- | --- |
| Bridge schema version | REQUIRED | Validates the upstream contract before transport. |
| Bridge projector identity | REQUIRED | Binds the result to the ratified Bridge projector. |
| Bridge status | REQUIRED | Distinguishes compatible, blocked, and Null without coercion. |
| Bridge reason | REQUIRED | Preserves exact Bridge failure or Null reason; source/projection reasons remain nested. |
| Bridge runtime authority tag | REQUIRED | Validates the exact bounded Bridge authority. Missing or wrong tags fail closed. |
| Candidate ID | REQUIRED | Preserves candidate identity. |
| Candidate source ID and source-family ID | REQUIRED | Preserves source authority and grouping without collapsing records. |
| Candidate source form and lexical join | REQUIRED | Preserves exact lexical identity used by the candidate contract. |
| Candidate variant ID and variant order | REQUIRED | Preserves every physical variant and order. |
| Candidate physical locator and raw source line | REQUIRED | Keeps each source record independently recoverable. |
| Candidate artifact bytes, SHA-256, revision, notation, profile | REQUIRED | Verifies exact frozen source identity. |
| Candidate normalized segments and nuclei | REQUIRED | Preserves Voice projection evidence and moving-nucleus identity. |
| Candidate Voice path | REQUIRED, nullable per upstream status | Required for defined Voice evidence; Null remains Null. |
| Candidate Gamma | OPTIONAL | Retain when present for later structural evaluation; never make it a Bridge gate. |
| Candidate ZC | OPTIONAL | Retain when present as secondary evidence; never make it a Bridge gate. |
| Production lexical input | REQUIRED | Preserves the resolver input boundary. |
| Production normalized key | REQUIRED | Preserves the exact production lookup identity. |
| Production variant identity and order | REQUIRED | Preserves the production physical ledger. |
| Production locator and raw source line | REQUIRED for an eligible compatible record | Current production result does not expose them; absence blocks compatibility until an additive envelope supplies them. |
| Production artifact bytes, SHA-256, revision, notation, profile | REQUIRED | Proves exact shared artifact/profile scope. |
| Production normalized segments and nuclei | REQUIRED | Preserves the production Voice evidence. |
| Production Voice path | REQUIRED, nullable per upstream status | Required for defined production Voice evidence; Null remains Null. |
| Normalization identity | REQUIRED | Equality must be checked, not generalized. |
| Parser identity | REQUIRED | Annotation and token-boundary authority must be explicit. |
| Mapping identity and mapping table | REQUIRED | Prevents equal Voice paths from being treated as equivalent without mapping authority. |
| Representation-domain identifiers | REQUIRED | Binds the exact candidate CMUdict-to-production_spoken scope. |
| Source sense/gloss | OPTIONAL | Preserve source context when present; never bind pronunciation to meaning. |
| New semantic, historical, functional, or winner fields | FORBIDDEN | Outside this transport contract. |

```text
INTEGRATION_INPUT_TYPE=Ratified CmuDictCandidateProductionSpokenRepresentationBridgeV0_1 plus complete candidate and production per-variant provenance ledgers; proposed production-side additive envelope remains a prerequisite
```

## Integration output contract

```text
INTEGRATION_OUTPUT_CLASS=TRANSPORT_EVIDENCE_ENVELOPE_ONLY
PROPOSED_INTEGRATION_OUTPUT_TYPE=CmuDictBridgeDiscoveryTransportEnvelopeV0_1
PROPOSED_INTEGRATION_OUTPUT_FIELDS=schemaVersion; bridgeProjectorId; bridgeStatus; bridgeReason; preservedBridgeAuthorityTag; candidateLedger; productionLedger; exactArtifactIdentity; sourceRevision; notation; profile; normalizationIdentity; parserIdentity; mappingIdentity; mappingTable; representationDomain; variantCardinality; provenanceCompleteness; annotationEligibility; authorityBoundary
```

Field effects:

| Field group | Source | Authority | Semantic effect |
| --- | --- | --- | --- |
| schema/projector/status/reason | Bridge result | Bridge authority | NONE; validation and failure state only |
| candidate ledger | Candidate source, Voice, optional Gamma/ZC | Candidate authorities | NONE; lossless evidence transport |
| production ledger | Additive production prerequisite envelope | Production-spoken authority | NONE; lossless evidence transport |
| artifact/revision/notation/profile | Frozen CMUdict constants and both ledgers | Source and Bridge authorities | NONE; exact identity validation |
| normalization/parser/mapping | Candidate and production envelopes | Existing normalization/parser/Voice authorities | NONE; compatibility precondition only |
| representation domain | Bridge authority | Exact English CMUdict/ARPABET/production_spoken scope | NONE; bounded provenance label only |
| variant cardinality/provenance completeness | Both ledgers | Variant and provenance policies | NONE; prevents loss/collapse |
| authorityBoundary | This contract | This contract | NONE; states that no four-gate authority is emitted |

The output MUST NOT contain or derive `matchClassification`,
`presentationClassification`, `voiceRelationship`, `authorizedOperationIds`,
`expansionOrCompositionChain`, `protoRoots`, target-sense binding, reviewed
functional evidence, semantic interpretation, historical relation, or winner
fields.

## Discovery consumption boundary

```text
FIRST_AUTHORIZED_DISCOVERY_CONSUMER=NONE_CURRENTLY_SAFE; a future dedicated CMUdict-aware comparison boundary must be separately authorized
FIRST_AUTHORIZED_DISCOVERY_CONSUMER_SIGNATURE=NOT_APPLICABLE_UNTIL_IMPLEMENTATION_AUTHORITY; proposed future consumer accepts CmuDictBridgeDiscoveryTransportEnvelopeV0_1 and returns a bounded preauthorization comparison, not MotivationEngineDiscoveryCandidateV0_1
CONSUMPTION_MODE=NEW_TYPED_ADAPTER
```

The future adapter must not be registered as a
`GenericFunctionalWitnessSourceAdapterV1`, and it must not call the current
`buildStructuralComparisonV0_1` without an explicit future authority mode.

### Type reuse matrix

| Type | Direct reuse safe | Reason |
| --- | --- | --- |
| `GenericFunctionalWitnessV1` | NO | Implies generic source-witness query semantics, witness status, target-meaning boundaries, and relation-operation fields that CMUdict pronunciation evidence does not possess. |
| `GenericFunctionalWitnessSourceAdapterV1` | NO | Its result enters the generic witness discovery pipeline and would inherit candidate and query semantics. |
| `CandidateMatchContextV0_1` | NO | Carries input-derived proto roots, carriers, operations, and expansion chains that could manufacture Gate 4 support. |
| `MotivationEngineDiscoveryCandidateV0_1` | NO | Requires a structural comparison, functional interpretation, candidate status, and winner boundary that are not established by Bridge transport. |
| `MotivationStructuralComparisonV0_1` | PARTIAL | Its representation values describe useful future states, but its current construction path automatically assigns candidate classification and Gate 4 context. Only a future dedicated builder may use a compatible comparison shape. |
| `MotivationRepresentationKindV0_1` | PARTIAL | `production_spoken` is an existing label, but the candidate-derived Bridge domain needs an explicit transport representation-domain field before comparison. |
| `MotivationRepresentationCompatibilityV0_1` | PARTIAL | `CROSS_REPRESENTATION` is a safe future pre-SAME comparison value; it must not be emitted by the transport envelope or upgraded to `SAME_REPRESENTATION`. |

## Gate firewalls

### Gate 1

```text
INTEGRATION_MAY_EMIT_STRUCTURAL_MOTIVATION_CANDIDATE=NO
GATE1_PREAUTHORIZATION_RUNTIME_REPRESENTATION=BRIDGE_COMPATIBLE_EVIDENCE_ONLY; no current matchClassification value is emitted
GATE1_PREAUTHORIZATION_RUNTIME_REPRESENTATION_MISSING=YES
```

The current enum has no safe preauthorization classification. A future
implementation would need a new bounded precursor status outside the current
`matchClassification` enum; implementation is not authorized here.

### Gate 2

```text
BRIDGE_COMPATIBILITY_TO_SAME_REPRESENTATION_MAPPING_AUTHORIZED=NO
PRE_SAME_REPRESENTATION_COMPATIBILITY_VALUE=CROSS_REPRESENTATION, only inside a separately authorized future comparison envelope
PRE_SAME_REPRESENTATION_COMPATIBILITY_REASON=The Bridge describes compatibility between distinct candidate-derived and production_spoken representation roles; it does not prove representation identity.
PRE_SAME_RUNTIME_TYPE_CHANGE_REQUIRED=NO_FOR_THIS_FIELD; YES_FOR_A_SAFE_CURRENT_PIPELINE_INTEGRATION_IF_NO_NEW_BOUNDED_PRECURSOR_TYPE_IS_ADDED
```

The transport itself emits no `representationCompatibility` field. The value
above is the fail-closed future comparison value, not a Bridge success claim.

### Gate 3

```text
BRIDGE_COMPATIBILITY_TO_VOICE_RELATIONSHIP_MAPPING_AUTHORIZED=NO
PRE_VOICE_AUTHORITY_RELATIONSHIP_VALUE=NOT_COMPARABLE_ACROSS_REPRESENTATIONS
VOICE_RELATIONSHIP_TYPE_CHANGE_REQUIRED=NO
```

Equal Voice paths, shared mapping identities, and Bridge compatibility do not
authorize a Voice relationship.

### Gate 4

```text
INTEGRATION_MAY_CREATE_AUTHORIZED_OPERATION_IDS=NO
INTEGRATION_MAY_CREATE_EXPANSION_OR_COMPOSITION_CHAIN=NO
INTEGRATION_MAY_CREATE_PROTO_ROOTS=NO
GATE4_EXTERNAL_AUTHORIZED_EVIDENCE_MAY_BE_ATTACHED_LATER=YES, only from an independently authorized existing producer and without deriving it from Voice, Gamma, ZC, Bridge compatibility, or source identity
```

## Variant and evidence-ledger policy

```text
INTEGRATION_UNIT=ONE_BRIDGE_VARIANT_PAIR
VARIANT_COLLAPSE_ALLOWED=NO
WINNER_SELECTION_ALLOWED=NO
IDENTICAL_PROJECTION_COLLAPSE_ALLOWED=NO
LOSSY_INTEGRATION_ALLOWED=NO
EVIDENCE_LEDGER_RECORD_COUNT_PRESERVED=YES
RECORDS_LOST=0
```

One Bridge variant pair means one independently traceable candidate physical
record and one independently traceable production physical record, paired only
after exact identity and cardinality checks. It does not authorize arbitrary
pairing, aggregation, or selection. Duplicate physical records and identical
Voice/Gamma/ZC projections remain separate.

The following must survive unchanged or be preserved as exact nested data:

```text
candidate source artifact; source revision; source notation; source profile; source line locator; raw source line; source form; base form; join key; source record ID; source family ID; variant ID/order; raw pronunciation; ordered ARPABET tokens; normalized segments; nuclei; Voice authority; Gamma authority when present; ZC provenance when present; production lexical input; production normalized key; production source form; production locator/raw line; production variant ID/order; production normalized segments; production nuclei; production Voice path; production normalization/parser/mapping identity; Bridge projector/schema/status/reason; Bridge runtime authority tag
```

## Null and fail-closed policy

| Condition | Behavior |
| --- | --- |
| Bridge `NULL` | `PRESERVE_AS_NULL`; retain nested source/projection evidence and reasons. |
| Bridge `BLOCKED_BY_MISSING_AUTHORITY` | `PRESERVE_AS_BLOCKED`; never emit a compatible envelope. |
| Missing or wrong Bridge runtime tag | `REJECT_ENVELOPE`; retain diagnostic evidence outside the valid output. |
| Artifact mismatch | `REJECT_ENVELOPE`; preserve exact mismatch reason. |
| Revision mismatch | `REJECT_ENVELOPE`. |
| Notation mismatch | `REJECT_ENVELOPE`. |
| Normalization mismatch | `PRESERVE_AS_BLOCKED`; no coercion or generalization. |
| Parser mismatch | `PRESERVE_AS_BLOCKED`; no hidden reparsing. |
| Mapping mismatch | `PRESERVE_AS_BLOCKED`. |
| Annotation-ineligible record | `PRESERVE_AS_BLOCKED`; do not strip or reinterpret annotation text. |
| Ambiguous production pronunciation | `PRESERVE_AS_BLOCKED`; retain all variants and select no winner. |
| Missing provenance | `REJECT_ENVELOPE`. |
| Tampered provenance | `REJECT_ENVELOPE`. |
| Unknown schema | `REJECT_ENVELOPE`. |
| Unknown representation domain | `REJECT_ENVELOPE`. |
| Gate 1 authority absent | `PRESERVE_AS_BLOCKED`; no candidate classification. |
| SAME authority absent | `PRESERVE_AS_BLOCKED`; no SAME mapping. |
| Voice relationship authority absent | `PRESERVE_AS_BLOCKED`; use no comparable relationship. |
| Gate 4 evidence absent | `PRESERVE_AS_BLOCKED`; no structural support is manufactured. |
| No condition | `NOT_APPLICABLE`. |

```text
NEW_INTEGRATION_REASON_CODES_REQUIRED=NO
NEW_INTEGRATION_REASON_CODES=NONE; reuse exact upstream Bridge reason codes and preserve candidate/production nested reasons. No integration-specific reason taxonomy is minted here.
```

## Runtime authority-tag policy

```text
AUTHORITY_CONTRACT_REQUIRES_RUNTIME_AUTHORITY_TAG=YES, for the incoming Bridge result
AUTHORIZED_RUNTIME_AUTHORITY_TAG=CMUDICT_CANDIDATE_TO_PRODUCTION_SPOKEN_DOMAIN_COMPATIBILITY_AUTHORITY_V0_1
RUNTIME_AUTHORITY_TAG_POLICY=PRESERVE_BRIDGE_TAG_ONLY; do not mint a new integration tag because this transport grants no new scientific or cross-representation authority
```

## Annotation and normalization policy

```text
ANNOTATED_RECORDS_INTEGRATION_ELIGIBLE_NOW=NO
ANNOTATED_RECORD_COUNT=22
ANNOTATION_POLICY=Do not strip, reparse, or reinterpret terminal annotation text; preserve raw lines and fail closed for affected records until separately authorized production parser alignment exists.

NORMALIZATION_POLICIES_IDENTICAL=NO
FROZEN_ARTIFACT_DOMAIN_EQUALITY=135166/135166
INTEGRATION_MAY_GENERALIZE_NORMALIZATION_EQUIVALENCE=NO
NORMALIZATION_POLICY=Require exact equality of the candidate and production normalized identities for each record; outside the proven frozen artifact domain preserve as blocked and do not alter either normalizer.
```

## Generic adapter and structural-comparison decisions

```text
GENERIC_FUNCTIONAL_WITNESS_ADAPTER_REUSE_AUTHORIZED=NO
GENERIC_FUNCTIONAL_WITNESS_ADAPTER_REUSE_REASON=The generic adapter contract carries functional witness query semantics, source-witness status, relation operation IDs, and evidence-family behavior. CMUdict pronunciation evidence is not a generic functional witness and must not inherit those meanings.

BUILD_STRUCTURAL_COMPARISON_DIRECT_REUSE_SAFE=NO
BUILD_STRUCTURAL_COMPARISON_DIRECT_REUSE_REASON=The current builder accepts GenericFunctionalWitnessV1, automatically emits STRUCTURAL_MOTIVATION_CANDIDATE for non-self records, assigns structural presentation, marks known representations CROSS_REPRESENTATION/NOT_COMPARABLE, and copies input-side operation/root context into Gate 4 fields. Those effects are not authorized by Bridge transport.
FUTURE_COMPARISON_ARCHITECTURE=NEW_BOUNDED_CMUdict_COMPARISON_BUILDER accepting the typed transport envelope and an explicitly authorized future gate mode; current generic Discovery and current structural comparison remain unchanged.
```

## Future implementation test matrix

```text
FUTURE_IMPLEMENTATION_TEST_MATRIX=validBridgeCompatibleVariant; bridgeNull; bridgeBlocked; wrongBridgeRuntimeTag; missingBridgeRuntimeTag; tamperedCandidateProvenance; tamperedProductionProvenance; artifactMismatch; revisionMismatch; notationMismatch; normalizationMismatch; parserMismatch; annotationIneligibleRecord; ambiguousProductionVariant; duplicatePhysicalRecords; variantOrdering; variantIdentityPreservation; noWinner; noCollapse; noAutomaticStructuralMotivationCandidate; noAutomaticSameRepresentation; noAutomaticVoiceRelationshipAuthorization; noAuthorizedOperationIdsInvention; noExpansionOrCompositionInvention; noProtoRootInvention; noSemanticAuthorityLeakage; noFunctionalAuthorityLeakage; noHistoricalAuthorityLeakage; noCrossLanguageAuthorityLeakage; deterministicOutput; deepFreeze; unknownSchemaFailClosed; unknownRepresentationDomainFailClosed; runtimeAuthorityTagValidation; exactProvenanceRetention; frozenArtifactDomainBoundary; annotatedRecordRawLineRetention; movingNucleusOneNucleusRetention
```

All cases are future implementation requirements. They are not executed or
authorized by this documentation lane.

## Implementability assessment

```text
INTEGRATION_IMPLEMENTABLE_FROM_CURRENT_DATA=PARTIAL
INTEGRATION_REQUIRES_BRIDGE_IMPLEMENTATION_FIRST=YES
INTEGRATION_REQUIRES_SAME_AUTHORITY_FIRST=NO
INTEGRATION_REQUIRES_VOICE_RELATIONSHIP_AUTHORITY_FIRST=NO
INTEGRATION_REQUIRES_GATE1_AUTHORITY_FIRST=NO
INTEGRATION_REQUIRES_GATE4_AUTHORITY_FIRST=NO
INTEGRATION_REQUIRES_DISCOVERY_TYPE_CHANGE=YES
INTEGRATION_REQUIRES_NEW_RUNTIME_REASON_CODES=NO
INTEGRATION_REQUIRES_UPSTREAM_CANDIDATE_CHANGE=NO
INTEGRATION_REQUIRES_UPSTREAM_PRODUCTION_CHANGE=YES, an additive per-production-variant authority envelope is required because the current result omits exact artifact bytes/hash, physical locator/raw line, parser/normalization/mapping identity, and original lexical input at the resolver boundary
```

The candidate-side records are sufficient for transport. The production side
has the same checked-in artifact and shared mapping implementation, but its
current result does not expose every required identity field and has a known
terminal-annotation boundary mismatch on 22 records. The future envelope and
Bridge implementation must therefore precede any Discovery integration.

## Explicit forbidden authority

```text
BRIDGE_IMPLEMENTATION_AUTHORIZED_BY_THIS_CONTRACT=NO
DISCOVERY_INTEGRATION_IMPLEMENTATION_AUTHORIZED_BY_THIS_CONTRACT=NO
SAME_REPRESENTATION_AUTHORIZED_BY_THIS_CONTRACT=NO
VOICE_RELATIONSHIP_AUTHORIZED_BY_THIS_CONTRACT=NO
STRUCTURAL_MOTIVATION_CANDIDATE_AUTHORIZED_BY_THIS_CONTRACT=NO
GATE4_STRUCTURAL_SUPPORT_AUTHORIZED_BY_THIS_CONTRACT=NO
SEMANTIC_AUTHORITY_GRANTED=NO
FUNCTIONAL_AUTHORITY_GRANTED=NO
HISTORICAL_AUTHORITY_GRANTED=NO
CROSS_LANGUAGE_AUTHORITY_GRANTED=NO
API_WIRING_AUTHORIZED_BY_THIS_CONTRACT=NO
UI_WIRING_AUTHORIZED_BY_THIS_CONTRACT=NO
POSITIVE_CONTROL_EXECUTION_AUTHORIZED=NO
FALSE_NULL_DIAGNOSTIC_EXECUTION_AUTHORIZED=NO
TWO_MODE_DESIGN_AUTHORIZED=NO
```

## Assessment and next lane

```text
INTEGRATION_AUTHORITY_ASSESSMENT=DEFENSIBLE
INTEGRATION_AUTHORITY_ASSESSMENT_REASON=Repository truth supports one isolated typed transport boundary that preserves both physical ledgers and exact provenance while avoiding the generic witness and current structural-comparison semantics. The missing production envelope and the 22 annotation-contaminated records remain explicit fail-closed blockers; no doctrine decision is required to freeze this transport-only boundary.
NEXT_RECOMMENDED_LANE=CMUDICT_BRIDGE_DISCOVERY_INTEGRATION_PREREQUISITE_IMPLEMENTATION
NEXT_RECOMMENDED_LANE_REASON=Implement the additive production envelope and isolated Bridge/transport validation first. Do not implement Discovery wiring, SAME_REPRESENTATION, Voice relationship authority, Gate 1, Gate 4, API/UI, positive control, false-null diagnostics, or two-mode design in that lane.
NEXT_RECOMMENDED_LANE_IMPLEMENTATION_REQUIRED=YES
NEXT_RECOMMENDED_LANE_MUTATION_REQUIRED=YES
```

This recommendation is not automatic authorization. It returns the next
decision to DF after this authority artifact is reviewed and ratified.
