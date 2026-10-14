# Open Instrument / Functional Motivation v0.2

## CMUdict-aware comparison authority v0.1

Status: ratified documentation contract; no comparison runtime is implemented by this artifact.

## Scope and boundary

This document freezes the smallest comparison boundary that may consume the already-authorized CMUdict candidate-to-production evidence Bridge and its evidence-only Discovery transport. It defines a future preauthorization projector. It does not implement that projector and does not authorize Discovery, API, UI, semantic, functional, historical, cross-language, cognacy, pronunciation-identity, winner, ranking, or production behavior.

The only authorized artifact in this lane is this file. The CMUdict source adapter, Voice projection, Gamma projection, ZC projection, production-spoken prerequisites, representation Bridge, and Bridge transport are pre-existing published authority. Their facts are inspected and preserved; they are not reopened or changed here.

## Published and protected repository truth

| Field | Verified value |
| --- | --- |
| Repository | `sokolgora-sketch/linguistic-decoder` |
| Published main before this lane | `74b87955e15f621b8f9ebb4d83f936e5a451a8ef` |
| Current Bridge/transport implementation | PR `#2183`, merged at the published main SHA |
| Integration authority artifact | `docs/open-instrument/functional-motivation-v0.2-cmudict-bridge-discovery-integration-authority-v0.1.md` |
| Integration authority SHA-256 | `e80936351628454ebe8c6318986652d1f63a241ad5a2202f1524b67af312e0fb` |
| Bridge runtime authority tag | `CMUDICT_CANDIDATE_TO_PRODUCTION_SPOKEN_DOMAIN_COMPATIBILITY_AUTHORITY_V0_1` |
| Bridge statuses | `COMPATIBLE_FOR_SUBSEQUENT_RELATION_EVALUATION`, `BLOCKED_BY_MISSING_AUTHORITY`, `NULL` |
| Transport consumer | `NONE` |
| Transport boundary | `EVIDENCE_ONLY_NO_DISCOVERY_CONSUMER_NO_FOUR_GATE_AUTHORITY` |
| Protected S5 branch | `codex/s5-sanskrit-gloss-contract-resolution-v0-1` |
| Protected S5 head | `6d5bf985f1ca2763b8d41f3d4fa0735d689a1c30` |

The protected S5 checkout is outside this lane and must remain unchanged. Existing authority state remains `DISCOVERY_INTEGRATION_AUTHORIZED=NO`, `SAME_REPRESENTATION_AUTHORIZED=NO`, `VOICE_RELATIONSHIP_AUTHORIZED=NO`, `STRUCTURAL_MOTIVATION_CANDIDATE_AUTHORIZED_FOR_CMUDICT_PATH=NO`, `GATE4_STRUCTURAL_SUPPORT_AUTHORIZED_FOR_CMUDICT_PATH=NO`, `PRODUCTION_SPOKEN_COMPARABILITY_AUTHORIZED=NO`, `NATURAL_V0_2_POSITIVE_CONTROL_ESTABLISHED=NO`, `FALSE_NULL_DIAGNOSTIC_DISPOSITION=DEFERRED_PENDING_V0_2_REACHABILITY`, and `TWO_MODE_DESIGN_STATUS=NOT_AUTHORIZED`.

## Authority and runtime inspection

The inspected authority files are:

- `docs/dev-workflow.md`.
- `docs/open-instrument/functional-motivation-v0.2-representation-authority-contract-v0.1.md`.
- `docs/open-instrument/functional-motivation-v0.2-cmudict-candidate-role-authority-v0.1.md`.
- `docs/open-instrument/functional-motivation-v0.2-cmudict-candidate-source-adapter-contract-v0.1.md`.
- `docs/open-instrument/functional-motivation-v0.2-cmudict-candidate-voice-projection-authority-v0.1.md`.
- `docs/open-instrument/functional-motivation-v0.2-cmudict-candidate-gamma-projection-authority-v0.1.md`.
- `docs/open-instrument/functional-motivation-v0.2-cmudict-candidate-zc-projection-authority-v0.1.md`.
- `docs/open-instrument/functional-motivation-v0.2-cmudict-production-spoken-representation-bridge-authority-v0.1.md`.
- `docs/open-instrument/functional-motivation-v0.2-cmudict-production-spoken-bridge-prerequisites-authority-v0.1.md`.
- `docs/open-instrument/functional-motivation-v0.2-cmudict-bridge-discovery-integration-authority-v0.1.md`.

The inspected runtime files are:

- `src/shared/openInstrument/cmudictCandidateProductionSpokenRepresentationBridge.v0_1.ts`.
- `src/shared/openInstrument/cmudictBridgeDiscoveryTransport.v0_1.ts`.
- `src/shared/openInstrument/cmudictProductionSpokenBridgePrerequisites.v0_1.ts`.
- `src/shared/openInstrument/motivationEngineDiscovery.v0_1.ts`.
- `src/shared/openInstrument/functionalMotivationInterpretation.v0_2.ts`.
- `src/shared/openInstrument/genericFunctionalWitnessDiscovery.v1.ts`.
- `src/shared/openInstrument/genericFunctionalWitnessCorrespondence.v1.ts`.
- Required imported producer/type modules, including `structuralHypothesisDiscovery.v0_1.ts` and `deepRoot.minRoots.v1.ts`.

Repository-wide searches covered `STRUCTURAL_MOTIVATION_CANDIDATE`, `SAME_REPRESENTATION`, `CROSS_REPRESENTATION`, `NOT_COMPARABLE_ACROSS_REPRESENTATIONS`, `voiceRelationship`, `authorizedOperationIds`, `expansionOrCompositionChain`, `protoRoots`, `structuralRelationAuthorizedV0_2`, `CmuDictBridgeDiscoveryTransportEnvelopeV0_1`, and `CMUDICT_BRIDGE_DISCOVERY_TRANSPORT_CONSUMER_V0_1`.

## Existing transport input boundary

The exact existing projector signature is:

```ts
export function projectCmuDictBridgeDiscoveryTransportV0_1(
  input: unknown,
): CmuDictBridgeDiscoveryTransportEnvelopeV0_1 | null
```

The exact transport unit is:

```ts
export type CmuDictBridgeDiscoveryTransportUnitV0_1 = Readonly<{
  schemaVersion: typeof CMUDICT_BRIDGE_DISCOVERY_TRANSPORT_UNIT_SCHEMA_V0_1;
  bridgeVariantPairSchemaVersion: typeof CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_VARIANT_PAIR_SCHEMA_V0_1;
  pair: CmuDictCandidateProductionSpokenRepresentationBridgeVariantPairV0_1;
}>;
```

The exact transport envelope is:

```ts
export type CmuDictBridgeDiscoveryTransportEnvelopeV0_1 = Readonly<{
  schemaVersion: typeof CMUDICT_BRIDGE_DISCOVERY_TRANSPORT_SCHEMA_V0_1;
  unitSchemaVersion: typeof CMUDICT_BRIDGE_DISCOVERY_TRANSPORT_UNIT_SCHEMA_V0_1;
  bridgeSchemaVersion: typeof CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_SCHEMA_V0_1;
  bridgeProjectorId: typeof CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_PROJECTOR_ID_V0_1;
  bridgeStatus: CmuDictCandidateProductionSpokenRepresentationBridgeStatusV0_1;
  bridgeReason: CmuDictCandidateProductionSpokenRepresentationBridgeReasonCodeV0_1 | null;
  preservedBridgeAuthorityTag: typeof CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_RUNTIME_AUTHORITY_TAG_V0_1;
  candidateLedger: CmuDictCandidateVoiceProjectionV0_1 | null;
  productionLedger: CmuDictProductionSpokenBridgePrerequisitesV0_1 | null;
  candidateGammaProjection: CmuDictCandidateGammaProjectionV0_1 | null;
  candidateZcProjection: CmuDictCandidateZcProjectionV0_1 | null;
  units: readonly CmuDictBridgeDiscoveryTransportUnitV0_1[];
  exactArtifactIdentity: CmuDictCandidateProductionSpokenRepresentationBridgeV0_1["exactArtifactIdentity"];
  sourceRevision: CmuDictCandidateProductionSpokenRepresentationBridgeV0_1["sourceRevision"];
  notation: CmuDictCandidateProductionSpokenRepresentationBridgeV0_1["notation"];
  profile: CmuDictCandidateProductionSpokenRepresentationBridgeV0_1["profile"];
  normalizationIdentity: CmuDictCandidateProductionSpokenRepresentationBridgeV0_1["normalizationIdentity"];
  parserIdentity: CmuDictCandidateProductionSpokenRepresentationBridgeV0_1["parserIdentity"];
  mappingIdentity: CmuDictCandidateProductionSpokenRepresentationBridgeV0_1["mappingIdentity"];
  mappingTable: CmuDictCandidateProductionSpokenRepresentationBridgeV0_1["mappingTable"];
  representationDomain: typeof CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_DOMAIN_V0_1;
  variantCardinality: CmuDictCandidateProductionSpokenRepresentationBridgeV0_1["variantCardinality"];
  provenanceCompleteness: boolean;
  annotationEligibility: CmuDictCandidateProductionSpokenRepresentationBridgeV0_1["annotationEligibility"];
  bridgeAuthorityBoundary: typeof CMUDICT_REPRESENTATION_BRIDGE_AUTHORITY_BOUNDARY_V0_1;
  authorityBoundary: typeof CMUDICT_BRIDGE_DISCOVERY_TRANSPORT_AUTHORITY_BOUNDARY_V0_1;
  consumer: typeof CMUDICT_BRIDGE_DISCOVERY_TRANSPORT_CONSUMER_V0_1;
}>;
```

The future comparison input is option D: transport plus a distinct, explicitly typed collection of independently authorized Gate 4 evidence. A generic witness or untyped metadata object is not a permitted input.

### Frozen input contract

```ts
type CmuDictAwareComparisonInputV0_1 = Readonly<{
  schemaVersion: "open-instrument.cmudict-aware-comparison-input.v0_1";
  comparisonAuthorityTag:
    "CMUDICT_AWARE_PREAUTHORIZATION_COMPARISON_AUTHORITY_V0_1";
  transport: CmuDictBridgeDiscoveryTransportEnvelopeV0_1;
  independentlyAuthorizedGate4Evidence:
    readonly CmuDictAwareIndependentGate4EvidenceV0_1[];
}>;

type CmuDictAwareIndependentGate4EvidenceBaseV0_1 = Readonly<{
  targetBinding: Readonly<{
    candidateSourceId: string;
    candidateVariantId: string;
    productionVariantId: string;
  }>;
  authorityProvenance: readonly string[];
  evidenceSha256: string;
}>;

type CmuDictAwareStructuralHypothesisEvidenceV0_1 =
  CmuDictAwareIndependentGate4EvidenceBaseV0_1 &
    Readonly<{
      sourceType: "STRUCTURAL_HYPOTHESIS_V0_1";
      producer: "discoverStructuralHypothesesV0_1";
      producerModule:
        "src/shared/structuralHypothesisDiscovery.v0_1.ts";
      producerSchemaVersion: "z-zero.structural-hypothesis.v0_1";
      evidence: StructuralHypothesisV0_1;
    }>;

type CmuDictAwareMinRootHypothesisEvidenceV0_1 =
  CmuDictAwareIndependentGate4EvidenceBaseV0_1 &
    Readonly<{
      sourceType: "MIN_ROOT_HYPOTHESIS_V1";
      producer: "buildMinRootHypotheses";
      producerModule: "src/shared/deepRoot.minRoots.v1.ts";
      producerSchemaVersion: null;
      evidence: MinRootHypothesis;
    }>;

type CmuDictAwareIndependentGate4EvidenceV0_1 =
  | CmuDictAwareStructuralHypothesisEvidenceV0_1
  | CmuDictAwareMinRootHypothesisEvidenceV0_1;
```

The future input unit is one ordered `CmuDictBridgeDiscoveryTransportUnitV0_1`, therefore one physical candidate/production Bridge variant pair. The input must require the comparison authority tag, a compatible Bridge status for a ready result, complete candidate and production ledgers for a non-blocked result, and preserve an empty external-evidence array as a valid no-evidence state.

External Gate 4 evidence is limited to two exact producer families:

1. `StructuralHypothesisV0_1` records produced by `discoverStructuralHypothesesV0_1`, carrying `STRUCTURAL_HYPOTHESIS_VERSION_V0_1`, hypothesis identity, target binding, expansion chain, reason codes, reduction-step operation IDs, producer identity, authority provenance, and evidence hash.
2. `MinRootHypothesis` records produced by `buildMinRootHypotheses`, carrying the exact producer module/function identity, target binding, proto roots/carriers, authority provenance, and evidence hash. This producer has no independent schema constant; the contract must not invent one.

The comparison boundary transports and attaches these records verbatim. It does not create, evaluate, reinterpret, or promote them. They cannot affect Gate 1, representation compatibility, or Voice relationship. A `GenericFunctionalWitnessV1`, free-form string, or generic metadata bucket is unauthorized.

Therefore:

| Contract field | Frozen value |
| --- | --- |
| `CMUDICT_AWARE_COMPARISON_INPUT_TYPE` | `CmuDictAwareComparisonInputV0_1` = transport plus explicitly typed independently authorized Gate 4 evidence |
| `CMUDICT_AWARE_COMPARISON_INPUT_UNIT` | One ordered Bridge transport unit / physical variant pair |
| `INPUT_REQUIRES_COMPARISON_AUTHORITY_TAG` | `YES`; exact value is `CMUDICT_AWARE_PREAUTHORIZATION_COMPARISON_AUTHORITY_V0_1` |
| `INPUT_REQUIRES_TRANSPORT_AUTHORITY_TAG` | `YES` |
| `INPUT_REQUIRES_BRIDGE_STATUS_COMPATIBLE` | `YES` for `PREAUTHORIZATION_READY`; blocked/NULL may only emit corresponding blocked/NULL output |
| `INPUT_REQUIRES_COMPLETE_CANDIDATE_LEDGER` | `YES` for a non-blocked output |
| `INPUT_REQUIRES_COMPLETE_PRODUCTION_LEDGER` | `YES` for a non-blocked output |
| `INPUT_ALLOWS_EXTERNAL_GATE4_EVIDENCE` | `YES`, only for the two typed producer families above |

## Proposed bounded output

Reusing `MotivationStructuralComparisonV0_1` is unsafe. It contains existing Gate 1 classification, presentation classification, `SAME_REPRESENTATION`/`CROSS_REPRESENTATION` values, existing Voice relationship values, operation IDs, expansion chains, and generic candidate structure fields. Reusing it would silently grant authority that the CMUdict Bridge does not own.

The proposed output is `CmuDictAwarePreauthorizationComparisonV0_1`. It is one record per ordered transport unit and has these exact conceptual fields:

```ts
type CmuDictAwarePreauthorizationComparisonV0_1 = Readonly<{
  schemaVersion: "open-instrument.cmudict-aware-preauthorization-comparison.v0_1";
  runtimeAuthorityTag: "CMUDICT_AWARE_PREAUTHORIZATION_COMPARISON_AUTHORITY_V0_1";
  // Bridge NULL is an envelope-level result because the transport has no unit.
  unit: CmuDictBridgeDiscoveryTransportUnitV0_1 | null;
  bridgeDomain: Readonly<{
    status: "COMPATIBLE" | "BLOCKED" | "NULL";
    upstreamStatus: CmuDictCandidateProductionSpokenRepresentationBridgeStatusV0_1;
    upstreamReason: CmuDictCandidateProductionSpokenRepresentationBridgeReasonCodeV0_1 | null;
    representationDomain: string | null;
  }>;
  representationPrecursor:
    | "BRIDGE_DOMAIN_COMPATIBLE_NOT_IDENTITY"
    | "BRIDGE_BLOCKED"
    | "BRIDGE_NULL"
    | "UNKNOWN_OR_NULL";
  voicePathPrecursor:
    | "PATH_DATA_EXACT_ORDERED_EQUAL"
    | "PATH_DATA_UNEQUAL"
    | "PATH_DATA_MISSING_OR_NULL"
    | "PATH_DATA_UNKNOWN";
  structuralSupport: Readonly<{
    status: "NONE" | "INDEPENDENTLY_AUTHORIZED_ATTACHED";
    evidence: readonly CmuDictAwareIndependentGate4EvidenceV0_1[];
  }>;
  candidateClassificationEligibility:
    "NOT_ELIGIBLE_FOR_GATE1" | "ELIGIBLE_FOR_SEPARATE_AUTHORITY_EVALUATION";
  provenanceCompleteness: boolean;
  authorityStatus:
    | "PREAUTHORIZATION_READY"
    | "BLOCKED_BY_MISSING_AUTHORITY"
    | "NULL";
  reasonCode: CmuDictAwareComparisonReasonCodeV0_1 | null;
  preservedTransport: CmuDictBridgeDiscoveryTransportEnvelopeV0_1;
}>;
```

The output has separate dimensions for Bridge/domain compatibility, representation precursor, descriptive Voice-path data, attached Gate 4 evidence, Gate 1 eligibility, provenance completeness, authority status, and reason. It does not contain `matchClassification`, `presentationClassification`, existing `representationCompatibility`, existing `voiceRelationship`, `authorizedOperationIds`, `expansionOrCompositionChain`, or generic functional-witness fields.

The closed comparison status values are:

- `PREAUTHORIZATION_READY`: compatible transport, valid provenance, and no unresolved input-contract failure; downstream authorities remain unestablished.
- `BLOCKED_BY_MISSING_AUTHORITY`: the upstream or downstream precondition is blocked, including missing future authority.
- `NULL`: malformed, unknown, or non-reconstructable input.

The closed comparison-specific reason taxonomy is:

`COMPARISON_TRANSPORT_AUTHORITY_MISSING`, `COMPARISON_BRIDGE_NOT_COMPATIBLE`, `COMPARISON_CANDIDATE_LEDGER_INCOMPLETE`, `COMPARISON_PRODUCTION_LEDGER_INCOMPLETE`, `COMPARISON_VARIANT_UNIT_INVALID`, `COMPARISON_PROVENANCE_INCOMPLETE`, `COMPARISON_EXTERNAL_GATE4_EVIDENCE_UNAUTHORIZED`, `COMPARISON_EXTERNAL_GATE4_EVIDENCE_MALFORMED`, `COMPARISON_REPRESENTATION_RELATION_UNAUTHORIZED`, `COMPARISON_VOICE_RELATION_UNAUTHORIZED`, `COMPARISON_STRUCTURAL_CANDIDATE_UNAUTHORIZED`, `COMPARISON_UNKNOWN_SCHEMA`, and `COMPARISON_UNKNOWN_DOMAIN`.

Upstream Bridge reason codes remain preserved separately and must not be relabeled as a downstream comparison reason.

## Gate 1: structural motivation candidate

The current generic producer is `buildStructuralComparisonV0_1` in `motivationEngineDiscovery.v0_1.ts`. Its exact relevant behavior is:

```text
selfMatch = normalized input language equals normalized witness language
             AND normalized lexical input equals normalized witness source form
representationCompatibility = UNKNOWN when input representation is unknown,
                               otherwise CROSS_REPRESENTATION
matchClassification = EXACT_LEXICAL_SELF_MATCH when selfMatch,
                      otherwise STRUCTURAL_MOTIVATION_CANDIDATE
candidateRepresentationKind = orthographic_profile_derived
candidateConsonantalStructure = null
voiceRelationship = UNKNOWN for unknown input representation,
                    otherwise NOT_COMPARABLE_ACROSS_REPRESENTATIONS
```

Its `STRUCTURAL_MOTIVATION_CANDIDATE` result is therefore a generic non-self classification, not CMUdict-specific authority. `structuralRelationAuthorizedV0_2` later additionally requires that classification, `SAME_REPRESENTATION`, a Voice relationship other than `NOT_COMPARABLE_ACROSS_REPRESENTATIONS`, and at least one authorized operation ID, expansion/composition chain item, or candidate proto root. Generic functional witness status and reviewed functional evidence are separate and do not independently establish the candidate classification.

The CMUdict comparison may not emit `STRUCTURAL_MOTIVATION_CANDIDATE`. Its bounded result is `GATE1_PRECURSOR_STATUS=BRIDGE_COMPATIBLE_PREAUTHORIZATION`, with `candidateClassificationEligibility=ELIGIBLE_FOR_SEPARATE_AUTHORITY_EVALUATION` only as a routing posture, never as a Gate 1 classification. A future Gate 1 authority must be target-bound and separately authorize non-self relation, candidate-side structural relation evidence, complete provenance, representation authority, Voice authority, and required Gate 4 authority. Bridge, Voice, Gamma, ZC, and generic witness evidence alone are insufficient.

## Gate 2: representation relationship

`COMPATIBLE_FOR_SUBSEQUENT_RELATION_EVALUATION` is not `SAME_REPRESENTATION`. The comparison may emit neither existing `SAME_REPRESENTATION` nor existing `CROSS_REPRESENTATION`, and it must not use `NOT_COMPARABLE_ACROSS_REPRESENTATIONS` or `UNKNOWN` as a disguised positive/negative comparison result. It must emit the separate precursor `BRIDGE_DOMAIN_COMPATIBLE_NOT_IDENTITY` for compatible evidence, or `BRIDGE_BLOCKED`, `BRIDGE_NULL`, or `UNKNOWN_OR_NULL` as applicable.

Representation identity must not be inferred from a shared artifact, lexical key, ARPABET tokens, Voice path, nuclei, Gamma, ZC, or Bridge compatibility. `SAME_REPRESENTATION_REQUIRES_SEPARATE_AUTHORITY=YES`. Future evidence must explicitly identify candidate and production roles, prove identical authorized representation domains within scope, state notation/normalization/projection scope, variant and annotation treatment, preserve provenance, and carry an exact authority tag. `CROSS_REPRESENTATION` likewise requires a separately authorized representation relation; it is not a default emitted by this contract.

## Gate 3: Voice relationship

The existing Voice relationship values are `EXACT_ORDERED_VOICE_MATCH`, `PARTIAL_ORDERED_VOICE_MATCH`, `EMBRYO_VOICE_MATCH`, `NO_AUTHORIZED_VOICE_RELATION`, `NOT_COMPARABLE_ACROSS_REPRESENTATIONS`, and `UNKNOWN`. They are consumed by existing generic runtime semantics and cannot be emitted by this contract.

Raw canonical Voice path data equality or inequality is descriptively computable when both paths are present: the precursor is `PATH_DATA_EXACT_ORDERED_EQUAL` or `PATH_DATA_UNEQUAL`; missing/null paths yield `PATH_DATA_MISSING_OR_NULL`; malformed/unknown data yields `PATH_DATA_UNKNOWN`. These values are descriptive data observations, not authorized Voice relationships, and do not satisfy the existing `structuralRelationAuthorizedV0_2` predicate. `VOICE_PATH_RELATION_AUTHORITY_AVAILABLE_NOW=NO`, `CMUDICT_COMPARISON_MAY_EMIT_EXISTING_VOICE_RELATIONSHIP=NO`, and `VOICE_RELATIONSHIP_REQUIRES_SEPARATE_AUTHORITY=YES`.

## Gate 4: structural support

The comparison must not create `authorizedOperationIds`, `expansionOrCompositionChain`, or `protoRoots`. `discoverStructuralHypothesesV0_1` is the producer of structural hypothesis expansion chains, reason codes, and reduction-step operation IDs. `buildMinRootHypotheses` is the producer of min-root hypotheses, proto roots, and carriers. The comparison may attach records from those producers only when they arrive as independently authorized, exact, target-bound, source-tagged evidence with producer identity, authority provenance, and evidence hash. It transports them verbatim and does not reinterpret or evaluate them. Voice, Gamma, ZC, and Bridge compatibility are not Gate 4 evidence merely because they are structural.

Therefore `CMUDICT_COMPARISON_MAY_CREATE_AUTHORIZED_OPERATION_IDS=NO`, `CMUDICT_COMPARISON_MAY_CREATE_EXPANSION_CHAIN=NO`, `CMUDICT_COMPARISON_MAY_CREATE_PROTO_ROOTS=NO`, and `CMUDICT_COMPARISON_MAY_ATTACH_INDEPENDENTLY_AUTHORIZED_GATE4_EVIDENCE=YES`. `GATE4_STRUCTURAL_SUPPORT_AUTHORIZED_BY_THIS_CONTRACT=NO`.

## Generic reuse decisions

| Reuse candidate | Safe? | Reason |
| --- | --- | --- |
| `GenericFunctionalWitnessV1` | `NO` | Carries generic witness, gloss/source, semantic boundary, relation-operation, and functional source authority that this transport does not own. |
| Candidate match context | `NO` | Existing context is tied to generic Discovery candidate semantics and may carry stronger structural/functional assumptions. |
| `buildStructuralComparisonV0_1` | `NO` | Creates generic Gate 1 classification and existing representation/Voice fields. |
| `MotivationStructuralComparisonV0_1` | `NO` | Its shape exposes existing Gate 1, representation, Voice, operation, expansion, and candidate-structure semantics. |

The future implementation may share low-level immutable copying or validation utilities only if the resulting public contract remains the separate preauthorization type and preserves all authority firewalls.

## Variant and unit policy

Comparison occurs per ordered Bridge transport unit / physical variant pair. Physical order and duplicates are preserved. Identical projection collapse is forbidden; variant collapse is forbidden; winner selection is forbidden; candidate-level aggregation is forbidden. The future comparison must preserve one output record per input unit, including duplicate physical records, and must not create pseudoreplication or a winner posture. A Bridge `NULL` input is the sole envelope-level exception: it emits one unitless comparison result with `unit=null` because the upstream transport has no physical unit to carry forward.

| Policy | Frozen value |
| --- | --- |
| `COMPARISON_UNIT` | One ordered Bridge transport unit / candidate-production variant pair |
| `VARIANT_ORDER_PRESERVED` | `YES` |
| `DUPLICATES_PRESERVED` | `YES` |
| `IDENTICAL_PROJECTION_COLLAPSE_ALLOWED` | `NO` |
| `VARIANT_COLLAPSE_ALLOWED` | `NO` |
| `WINNER_SELECTION_ALLOWED` | `NO` |
| `CANDIDATE_LEVEL_AGGREGATE_ALLOWED` | `NO` |

## Null and fail-closed matrix

| Input condition | Required output |
| --- | --- |
| Bridge `NULL` | `authorityStatus=NULL`, `representationPrecursor=BRIDGE_NULL`, preserve the upstream null reason when present |
| Bridge `BLOCKED_BY_MISSING_AUTHORITY` | `authorityStatus=BLOCKED_BY_MISSING_AUTHORITY`, `representationPrecursor=BRIDGE_BLOCKED`, preserve the upstream blocked reason |
| Malformed transport, unknown schema, or unknown domain | `NULL` with the corresponding closed comparison reason |
| Missing/wrong Bridge runtime tag | `BLOCKED_BY_MISSING_AUTHORITY` or `NULL`; never positive |
| Artifact, revision, notation/profile, normalization, parser, or mapping mismatch | Preserve the Bridge failure and emit blocked/NULL; never repair or relabel it |
| Incomplete candidate or production ledger | `BLOCKED_BY_MISSING_AUTHORITY` with the exact ledger reason |
| Incomplete provenance | `NULL` with `COMPARISON_PROVENANCE_INCOMPLETE` |
| Annotated Bridge-ineligible records | Preserve ineligibility and emit blocked/NULL |
| Ambiguous production variants | `NULL` with `COMPARISON_VARIANT_UNIT_INVALID` |
| Missing candidate or production variant | `NULL` with `COMPARISON_VARIANT_UNIT_INVALID` |
| Missing authority required by this preauthorization boundary (comparison tag, transport tag, complete ledgers, or required provenance) | `BLOCKED_BY_MISSING_AUTHORITY` or `NULL` with the exact closed comparison reason; never infer a relation |
| Downstream representation, Voice, Gate 1, or Gate 4 authority remains unestablished | Do not classify this as an input failure; preserve the explicit precursor/eligibility fields and remain blocked from downstream relation authority |
| Compatible transport with complete provenance and no unresolved preauthorization input failure | `PREAUTHORIZATION_READY` with all downstream authority dimensions explicitly unestablished |

Blocked evidence must not become a positive comparison. No upstream reason code may be reused for a semantically different downstream condition. `NEW_COMPARISON_REASON_CODES_REQUIRED=YES`, with the closed taxonomy listed above.

## Runtime authority tag

`AUTHORITY_CONTRACT_REQUIRES_RUNTIME_AUTHORITY_TAG=YES`.

The exact frozen value is:

`AUTHORIZED_RUNTIME_AUTHORITY_TAG=CMUDICT_AWARE_PREAUTHORIZATION_COMPARISON_AUTHORITY_V0_1`

This tag identifies only the preauthorization comparison boundary. It does not imply `SAME_REPRESENTATION`, a positive Voice relationship, Gate 1, Gate 4, semantic relation, functional relation, historical relation, or cross-language relation.

## Provenance preservation

Lossless output is mandatory. A future implementation must preserve the Bridge schema, projector, status, upstream reason, Bridge runtime tag, transport schema and unit schema, candidate source identity/family/record/form/join key, candidate and production variant identity/order, physical locator, raw source line, artifact path/bytes/SHA, source revision, notation/profile, normalization identity, parser identity, mapping identity/table, normalized segments, nuclei, canonical Voice paths, optional Gamma, optional ZC, annotation eligibility, representation domain, and every attached external Gate 4 evidence record with source, producer, authority, hash, and target binding.

`LOSSY_COMPARISON_ALLOWED=NO`. The preserved transport remains recoverable in the output; no source record, variant, duplicate, locator, or reason may be filtered, ranked, collapsed, or rewritten.

## Scientific firewall

| Authority | Value under this contract |
| --- | --- |
| `SEMANTIC_AUTHORITY_GRANTED` | `NO` |
| `FUNCTIONAL_AUTHORITY_GRANTED` | `NO` |
| `HISTORICAL_AUTHORITY_GRANTED` | `NO` |
| `CROSS_LANGUAGE_AUTHORITY_GRANTED` | `NO` |
| `SAME_REPRESENTATION_AUTHORIZED_BY_THIS_CONTRACT` | `NO` |
| `VOICE_RELATIONSHIP_AUTHORIZED_BY_THIS_CONTRACT` | `NO` |
| `STRUCTURAL_MOTIVATION_CANDIDATE_AUTHORIZED_BY_THIS_CONTRACT` | `NO` |
| `GATE4_STRUCTURAL_SUPPORT_AUTHORIZED_BY_THIS_CONTRACT` | `NO` |
| `DISCOVERY_RUNTIME_WIRING_AUTHORIZED_BY_THIS_CONTRACT` | `NO` |
| `API_WIRING_AUTHORIZED_BY_THIS_CONTRACT` | `NO` |
| `UI_WIRING_AUTHORIZED_BY_THIS_CONTRACT` | `NO` |
| `POSITIVE_CONTROL_EXECUTION_AUTHORIZED` | `NO` |
| `FALSE_NULL_DIAGNOSTIC_EXECUTION_AUTHORIZED` | `NO` |
| `TWO_MODE_DESIGN_AUTHORIZED` | `NO` |

## Reachability consequence

Implementing only this preauthorization comparison does not make Functional Motivation v0.2 reachable:

| Field | Value |
| --- | --- |
| `AFTER_COMPARISON_IMPLEMENTATION_GATE1` | `NO` |
| `AFTER_COMPARISON_IMPLEMENTATION_GATE2` | `NO` |
| `AFTER_COMPARISON_IMPLEMENTATION_GATE3` | `NO` |
| `AFTER_COMPARISON_IMPLEMENTATION_GATE4` | `NO`, unless independently attached and separately evaluated; this contract grants no Gate 4 support |
| `COMPARISON_IMPLEMENTATION_ALONE_MAKES_V0_2_REACHABLE` | `NO` |
| `FIRST_REMAINING_BLOCKER_AFTER_COMPARISON` | `MULTIPLE_INDEPENDENT_AUTHORITIES_REQUIRED` |

The condition is exact: a separate Gate 1 structural-candidate authority, `SAME_REPRESENTATION` authority, Voice relationship authority, and Gate 4 evaluation/support authority remain required. Generic Path A evidence cannot be transferred into Path B.

## Future implementation test matrix

Any later implementation must cover: valid compatible transport; Bridge NULL; Bridge blocked; malformed transport; wrong/missing Bridge authority tag; wrong/missing comparison authority tag; tampered candidate provenance; tampered production provenance; artifact mismatch; revision mismatch; notation/profile mismatch; normalization mismatch; parser mismatch; mapping mismatch; annotated ineligible record; ambiguous production variants; duplicate physical records; variant order; no collapse; no winner; moving-nucleus preservation; exact ordered Voice-path descriptive equality if separately authorized; unequal Voice paths; no automatic `STRUCTURAL_MOTIVATION_CANDIDATE`; no automatic `SAME_REPRESENTATION`; no automatic positive Voice authority; no operation/expansion/proto-root invention; independently authorized Gate 4 attachment; no semantic, functional, historical, or cross-language leakage; deterministic output; deep freeze; unknown schema fail closed; unknown domain fail closed; and exact provenance retention.

The matrix must also assert that upstream Bridge status and reason remain distinct from comparison status/reason, compatible transport cannot create a winner or candidate aggregate, every unit is preserved one-to-one, and attached external evidence cannot change Gate 1, representation, or Voice dimensions.

## Implementation authorization and next boundary

`COMPARISON_IMPLEMENTABLE_FROM_CURRENT_DATA=YES` for a future isolated preauthorization projector consuming the frozen transport. `COMPARISON_IMPLEMENTATION_AUTHORIZED_BY_THIS_CONTRACT=YES` only for that bounded projector and its tests; this document does not authorize implementing it in this lane. It does not require Discovery runtime change, upstream Bridge change, upstream candidate change, or upstream production change:

```text
COMPARISON_REQUIRES_DISCOVERY_RUNTIME_CHANGE=NO
COMPARISON_REQUIRES_UPSTREAM_BRIDGE_CHANGE=NO
COMPARISON_REQUIRES_UPSTREAM_CANDIDATE_CHANGE=NO
COMPARISON_REQUIRES_UPSTREAM_PRODUCTION_CHANGE=NO
```

The next recommended lane is `CMUDICT_AWARE_COMPARISON_IMPLEMENTATION`. The reason is that a bounded preauthorization projector can consume the current transport without choosing unresolved scientific authorities, while still preserving all source and variant provenance. The next lane requires implementation and mutation, but it must remain isolated and must not activate Discovery or any downstream gate.

`NEXT_RECOMMENDED_LANE=CMUDICT_AWARE_COMPARISON_IMPLEMENTATION`

`NEXT_RECOMMENDED_LANE_IMPLEMENTATION_REQUIRED=YES`

`NEXT_RECOMMENDED_LANE_MUTATION_REQUIRED=YES`

The current lane ends at this contract. No comparison runtime, source acquisition, provider execution, Discovery/API/UI wiring, S5 mutation, or S4 execution is performed.

## Lane validation and lifecycle requirements

This documentation-only lane must validate the exact artifact with `git diff --check`, run `npm run typecheck:contracts` when the repository exposes that required contract check, and run the normal pre-push gate required by `docs/dev-workflow.md`. The PR may contain exactly this one file. It must be normally pushed, directly checked through GitHub review threads, and merged only by squash after required CI is green and direct unresolved review-thread count is zero. The final post-review SHA-256 must be recomputed immediately before merge.

After merge, local `main` must be fast-forwarded only and verified equal to `origin/main` with divergence `0/0`, one merge parent, and a clean worktree. The existing Linear milestone `03ed5c58-80e9-4d1b-85a3-13d9a82c5496` must receive an append-only closeout and be reloaded to verify persistence without creating a duplicate or closing the milestone. DF_BRAIN may receive a local-only reconciliation; no remote DF_BRAIN push is authorized. The final lane action is `AWAIT_DF_DECISION`.
