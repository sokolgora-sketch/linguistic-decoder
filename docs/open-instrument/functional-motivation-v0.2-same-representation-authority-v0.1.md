# Open Instrument / Functional Motivation v0.2

## SAME_REPRESENTATION authority v0.1

Status: ratified authority-contract artifact for a future implementation lane.
This artifact defines shared representation authority and a Path A adapter
boundary. It does not implement runtime behavior.

## 1. Lane boundary and DF doctrine

`SAME_REPRESENTATION` means that both sides are independently authorized
instances of the same explicitly identified representation contract, within
compatible language/variety scope, notation, normalization, segmentation and
ordering, projection methodology and profile/version, variant policy,
ambiguity policy, and complete reviewable provenance. No unresolved ambiguity
may change the represented comparison.

The authority is about representation identity. It is not a claim that the
represented words, Voice paths, Gamma values, ZC values, meanings, functions,
histories, or languages are equal or related.

The locked dependency is:

```text
SAME_REPRESENTATION -> future Voice authority -> later comparison/functional lanes
```

This contract does not grant Voice, Gate 1, Gate 4, semantic, functional,
historical, or cross-language authority. Target-bound functional evidence is
not required to define SAME_REPRESENTATION, but exact representation-instance
provenance is required and remains bound to the instances being compared.

`SAME_AUTHORITY_ARCHITECTURE=SHARED_CORE_WITH_PATH_SPECIFIC_ADAPTERS`

The shared core is the doctrine above. Path-specific adapters may identify and
validate existing representation contracts; they may not manufacture missing
authority or change analytical candidate production.

## 2. Current repository truth

The inspected baseline is main commit `1f590bcf50d96d5154aa3a5360bea02b661b8c4e`.

The repository already contains the type-level union member
`MotivationRepresentationCompatibilityV0_1 = "SAME_REPRESENTATION"`, but the
current `buildStructuralComparisonV0_1` emits only `CROSS_REPRESENTATION` for a
known input representation and `UNKNOWN` for an unknown input. It does not
produce a positive SAME result.

The current builder also emits `STRUCTURAL_MOTIVATION_CANDIDATE` for non-self
records, copies input-side operation/root context into comparison fields, and
uses `orthographic_profile_derived` for the candidate side. Those current
effects are not evidence that SAME is authorized.

`structuralRelationAuthorizedV0_2` can consume a manually supplied SAME value,
but it additionally requires Gate 4-shaped fields and reviewed target-bound
functional evidence. This is a downstream guard, not a current SAME producer.
The UI/telemetry/contract adapters validate and display the existing union;
they do not create representation authority.

Therefore:

| Field | Frozen value |
| --- | --- |
| `SAME_REPRESENTATION_CURRENT_PRODUCERS` | `NONE_CURRENT_RUNTIME_POSITIVE`; the enum member exists but the current builder does not emit it |
| `SAME_REPRESENTATION_CURRENT_CONSUMERS` | Type-level validation, UI/telemetry transport, and the downstream structural-relation guard; no consumer may treat the value as Voice/Gate/semantic authority |
| `SAME_REPRESENTATION_CURRENT_TEST_USAGE` | Guard fixtures and negative assertions only; tests do not establish a production positive |
| `PRODUCTION_RUNTIME_EMITS_SAME_REPRESENTATION` | `NO` |
| `RUNTIME_IMPLEMENTED_BY_THIS_ARTIFACT` | `NO` |

The protected historical S5 checkout is not part of this lane and remains
unchanged.

## 3. Shared-core dimensions

The following matrix is the complete shared-core policy. `EXACT_MATCH_REQUIRED`
means that the same contract field/value must be identified on both instances.
`COMPATIBILITY_RULE_REQUIRED` means that the exact rule below must be applied;
there is no informal “compatible enough” state.

| Dimension | Rule | Required evidence |
| --- | --- | --- |
| Representation contract identity | `EXACT_MATCH_REQUIRED` | Same explicit contract identifier and authority revision |
| Schema identity | `EXACT_MATCH_REQUIRED` | Same schema identifier |
| Contract version | `EXACT_MATCH_REQUIRED` | Same supported version; unsupported versions fail closed |
| Language scope | `COMPATIBILITY_RULE_REQUIRED` | Both instances fall within the exact language scope declared by the same contract; no language inference |
| Variety scope | `COMPATIBILITY_RULE_REQUIRED` | Both instances fall within the exact variety scope declared by the same contract; absent or conflicting variety fails closed when the contract requires it |
| Notation | `EXACT_MATCH_REQUIRED` | Same declared notation identifier and version |
| Normalization | `EXACT_MATCH_REQUIRED` | Same normalization identity, order, and version |
| Segmentation | `EXACT_MATCH_REQUIRED` | Same segmentation contract and segment identity rules |
| Segment ordering | `EXACT_MATCH_REQUIRED` | Same ordered-sequence policy; reordering is not identity |
| Projection methodology | `EXACT_MATCH_REQUIRED` | Same projection algorithm/authority, or an explicitly authorized contract identity that names it |
| Projection profile/version | `EXACT_MATCH_REQUIRED` | Same profile identifier and version |
| Variant policy | `EXACT_MATCH_REQUIRED` | Same variant inclusion, ordering, ambiguity, and retention policy |
| Ambiguity policy | `EXACT_MATCH_REQUIRED` | Same declared resolution/fail-closed policy; unresolved ambiguity cannot be silently collapsed |
| Source/provenance completeness | `COMPATIBILITY_RULE_REQUIRED` | Every representation instance has complete reviewable provenance under the contract; missing provenance is not compatible |
| Representation-instance authority | `EXACT_MATCH_REQUIRED` | Each instance is bound to an authorized source/producer and contract revision |
| Deterministic reproducibility | `EXACT_MATCH_REQUIRED` | Same deterministic contract and reproducible serialized authority result |

Language/variety compatibility is scoped by the contract itself. A future
contract may explicitly authorize a bounded equivalence relation, but this
artifact authorizes none. Observed equal output, a shared source, or matching
labels cannot create that relation.

## 4. Identity versus compatibility

`REPRESENTATION_DOMAIN_COMPATIBILITY` means that two domains may be
evaluated by a future relation authority because an upstream contract says
their inputs are usable together. It does not mean they are the same
representation.

`SAME_REPRESENTATION` uses identity model **A: exact contract identity**.
Two instances are SAME only when the same explicit representation contract,
schema/version, scope rules, notation, normalization, segmentation/order,
projection, variant/ambiguity policy, and instance authority are satisfied.

`EQUIVALENCE_CLASS_POLICY=FORBIDDEN_BY_THIS_CONTRACT`. No equivalence class is
invented or inferred in this lane. Consequently there is no class authorizer,
evidence set, symmetry rule, transitivity rule, or version/language exception
to freeze. A future DF-authorized contract would have to define all of those
before an equivalence class could be used.

## 5. Representation instance is not output equality

The following are explicit negative rules:

```text
SAME_OUTPUT_IMPLIES_SAME_REPRESENTATION=NO
SAME_VOICE_PATH_IMPLIES_SAME_REPRESENTATION=NO
SAME_GAMMA_IMPLIES_SAME_REPRESENTATION=NO
SAME_ZC_IMPLIES_SAME_REPRESENTATION=NO
BRIDGE_COMPATIBLE_IMPLIES_SAME_REPRESENTATION=NO
SAME_REPRESENTATION_REQUIRES_OUTPUT_VALUE_EQUALITY=NO
```

Two different words or records may be independently authorized instances of
the same representation contract and therefore be SAME at the representation
level while having different Voice/Gamma/ZC or represented values. Conversely,
equal outputs from different or unknown contracts remain insufficient.

## 6. Path A: actual current representations

Path A is the current generic path:

```text
API
 -> buildMotivationEngineDiscoveryV0_1
 -> queryGenericFunctionalWitnessesV1
 -> buildCandidate
 -> buildStructuralComparisonV0_1
```

### 6.1 Input side

The runtime chooses the input representation from the actual branch, not from
the existence of a string field:

| Runtime branch | Kind | Source and authority | Notation | Normalization | Segmentation/order | Projection | Variant policy | Provenance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Non-Albanian input with a defined canonical spoken path | `production_spoken` | `HeartInstrumentV1.spokenPronunciation`, resolved by `resolveCmuDictPronunciationToVoiceV0_1` and the existing pronunciation-to-Voice contract | CMUdict ARPAbet, source notation `CMUDICT_SOURCE_NOTATION_V0_1` | Existing CMUdict lexical normalization `NFC->trim->lowercase`; exact identity is carried by the pronunciation result | Ordered normalized ARPAbet segments and ordered nuclei; canonical path is derived only when all retained variants agree | `PRONUNCIATION_TO_VOICE_PROFILE_V0_1` | All physical variants are retained; differing canonical paths produce Null/ambiguous status | Source profile, revision, variant IDs, source units, normalized segments, nuclei, mapping/provenance fields |
| Albanian profile branch | `albanian_profile` | `analysis.primaryPath` and the Albanian profile path; existing profile authority only, explicitly not production pronunciation authority | Repository Albanian profile representation; no compatible production-spoken contract is established by this path | Profile/analysis normalization as emitted by the analysis contract; no cross-contract equality is inferred | Ordered profile-derived slots/path, not an authorized spoken segmentation | Existing profile-derived path and Gamma helper | Existing profile behavior; no production pronunciation variant authority | Analysis/profile output, but not a complete SAME representation-instance authority |
| No bound branch | `unknown` | No source binding | Unknown | Unknown | Unknown | None | Unknown | Not bound |

The conditional field values required by the contract are therefore:

```text
PATH_A_INPUT_REPRESENTATION_KIND=production_spoken | albanian_profile | unknown (runtime branch)
PATH_A_INPUT_REPRESENTATION_SOURCE=HeartInstrumentV1.spokenPronunciation or analysis.primaryPath/profile branch
PATH_A_INPUT_REPRESENTATION_AUTHORITY=CMUdict pronunciation-to-Voice authority for production_spoken; profile-only authority for albanian_profile; none for unknown
PATH_A_INPUT_NOTATION=CMUDICT_SOURCE_NOTATION_V0_1 for production_spoken; profile notation for albanian_profile; unknown otherwise
PATH_A_INPUT_NORMALIZATION=CMUdict NFC->trim->lowercase for production_spoken; profile-emitted normalization for albanian_profile; unknown otherwise
PATH_A_INPUT_SEGMENTATION=ordered normalized ARPAbet segments/nuclei for production_spoken; profile-derived ordered slots for albanian_profile; unknown otherwise
PATH_A_INPUT_PROJECTION=PRONUNCIATION_TO_VOICE_PROFILE_V0_1 for production_spoken; existing profile path projection for albanian_profile; none otherwise
PATH_A_INPUT_VARIANT_POLICY=retain physical variants and fail closed on differing canonical paths; profile policy otherwise; unknown for unbound input
PATH_A_INPUT_PROVENANCE=pronunciation result source profile/revision/variant/segment/mapping provenance for production_spoken; analysis/profile provenance for albanian_profile; absent for unknown
```

### 6.2 Candidate side

The current comparison builder sets the candidate representation kind to
`orthographic_profile_derived` for every generic witness. The witness is a
lexical source record from the Albanian and S1 Latin adapters; it is not an
independently authorized pronunciation or representation-instance contract.

```text
PATH_A_CANDIDATE_REPRESENTATION_KIND=orthographic_profile_derived
PATH_A_CANDIDATE_REPRESENTATION_SOURCE=GenericFunctionalWitnessV1 sourceForm from the registered lexical source adapters
PATH_A_CANDIDATE_REPRESENTATION_AUTHORITY=source-record attestation only; no candidate representation authority
PATH_A_CANDIDATE_NOTATION=source lexical notation, not a ratified pronunciation representation contract
PATH_A_CANDIDATE_NORMALIZATION=sourceForm EXACT_PRESERVED; query lookup EXACT_NFC; not equal to the input pronunciation contract
PATH_A_CANDIDATE_SEGMENTATION=lexical string/source-form extraction only; no authorized candidate segment contract
PATH_A_CANDIDATE_PROJECTION=SOURCE_FORM_EXTRACTED where the adapter allows it; this is not pronunciation-to-Voice authority
PATH_A_CANDIDATE_VARIANT_POLICY=source records are preserved by the adapter; no candidate pronunciation variant policy
PATH_A_CANDIDATE_PROVENANCE=source IDs/citations/locators/statuses where present; representation-instance authority remains incomplete
```

The candidate-side absence is the decisive fact. `candidateVoicePath` or an
orthographic/profile label must not be promoted to representation identity.

## 7. Path A shared-core feasibility

| Dimension | Input state | Candidate state | Satisfies shared core | Missing authority or evidence |
| --- | --- | --- | --- | --- |
| Contract identity | Production CMUdict or Albanian profile branch, conditionally explicit | No candidate contract ID | `NO` | Candidate representation contract and authority revision |
| Schema/version | Explicit for the production pronunciation result; conditional profile path | Generic lexical witness schema only | `NO` | Candidate representation schema/version |
| Language/variety scope | English CMUdict or Albanian profile scope | Albanian/Latin lexical source scope; not the same declared contract | `NO` | Explicit common contract scope |
| Notation | ARPAbet for production input or profile notation | Lexical source form notation | `NO` | Candidate notation contract |
| Normalization | Explicit production normalization or profile normalization | `EXACT_PRESERVED` source form/query normalization | `NO` | Same normalization identity under one contract |
| Segmentation/order | Ordered ARPAbet segments/nuclei or profile slots | No candidate representation segmentation contract | `NO` | Candidate segmentation and ordering authority |
| Projection methodology/profile | Pronunciation-to-Voice or profile projection | Lexical source-form extraction only | `NO` | Candidate projection methodology/profile authority |
| Variant/ambiguity policy | Defined and fail-closed for production variants | Source-record retention only | `NO` | Candidate variant and ambiguity contract |
| Provenance completeness | Production branch is richly bound; profile branch is not sufficient for SAME by itself | Lexical source provenance exists where valid, but representation authority is absent | `NO` | Complete instance-bound representation authority on both sides |
| Deterministic reproducibility | Existing production/profile computations are deterministic | Witness lookup is deterministic but not representation-authorized | `UNKNOWN` | Candidate contract must prove deterministic representation identity |

```text
PATH_A_SAME_REPRESENTATION_FEASIBILITY=BLOCKED_BY_MISSING_REPRESENTATION_AUTHORITY
```

The adapter cannot make the current candidate pass by relabeling it. The
smallest missing prerequisite is an independently authorized candidate
representation contract and lossless instance provenance. No analytical
candidate producer, retrieval rule, eligibility rule, source record, rank,
filter, or runtime behavior is changed by this artifact.

## 8. Path A authority adapter contract (future, not implemented)

```text
PATH_A_SAME_ADAPTER_REQUIRED=YES (future validation boundary; not current runtime implementation)
PATH_A_SAME_ADAPTER_PROPOSED_TYPE=PathASameRepresentationAuthorityAdapterV0_1
```

The future adapter accepts two already-authorized representation instances and
their exact contract descriptors. Inputs must include contract ID and
revision, schema/version, language/variety scope, notation, normalization,
segmentation/order, projection/profile/version, variant policy, ambiguity
policy, source/producer authority, complete provenance, deterministic
reproducibility evidence, and the exact runtime authority tag.

It returns a narrower authority result, not a motivation comparison:

```ts
type SameRepresentationAuthorityV0_1 = Readonly<{
  schemaVersion: "open-instrument.same-representation-authority.v0_1";
  runtimeAuthorityTag: "SAME_REPRESENTATION_AUTHORITY_V0_1";
  status: "AUTHORIZED" | "BLOCKED" | "NULL";
  representationRelation: "SAME_REPRESENTATION" | null;
  inputRepresentationInstance: Readonly<{
    contractId: string;
    contractVersion: string;
    provenanceRefs: readonly string[];
  }> | null;
  candidateRepresentationInstance: Readonly<{
    contractId: string;
    contractVersion: string;
    provenanceRefs: readonly string[];
  }> | null;
  reasonCode: SameRepresentationReasonCodeV0_1;
}>;
```

The adapter may validate and preserve existing authority. It may not create
candidate pronunciation, infer provenance, grant Voice, grant Gate 1 or Gate
4, infer semantic/functional/historical relation, or change the generic
witness set. Its status values are `AUTHORIZED`, `BLOCKED`, and `NULL`; any
unknown field or unrecognized status fails closed.

## 9. Path B compatibility check, without activation

The shared core applies to Path B in principle because a CMUdict Bridge and a
future other path both need explicit representation-instance contracts. Bridge
compatibility is not identity: the existing CMUdict Bridge joins candidate and
production-spoken evidence domains and deliberately preserves that distinction.

```text
SHARED_CORE_APPLICABLE_TO_PATH_B_IN_PRINCIPLE=YES
CMUDICT_BRIDGE_COMPATIBILITY_SUFFICIENT_FOR_SHARED_CORE_SAME=NO
CMUDICT_REQUIRES_PATH_SPECIFIC_SAME_ADAPTER=YES
CMUDICT_SAME_ADAPTER_AUTHORIZED_BY_THIS_CONTRACT=NO
CMUDICT_SAME_ADAPTER_IMPLEMENTATION_AUTHORIZED=NO
```

The CMUdict Bridge/transport remains an evidence-only parked boundary. This
artifact does not activate it, add a Discovery consumer, or alter its
candidate/production ledgers.

## 10. Firewalls

### Voice

```text
VOICE_RELATIONSHIP_REQUIRED_TO_DEFINE_SAME=NO
VOICE_PATH_EQUALITY_REQUIRED_FOR_SAME=NO
VOICE_PATH_EQUALITY_SUFFICIENT_FOR_SAME=NO
VOICE_RELATIONSHIP_AUTHORIZED_BY_THIS_CONTRACT=NO
```

Voice authority may consume a future authorized SAME result. SAME must never
consume a positive Voice relationship to establish itself.

### Gate 4

```text
GATE4_EVIDENCE_REQUIRED_TO_DEFINE_SAME=NO
AUTHORIZED_OPERATION_IDS_REQUIRED_FOR_SAME=NO
EXPANSION_OR_COMPOSITION_CHAIN_REQUIRED_FOR_SAME=NO
PROTO_ROOTS_REQUIRED_FOR_SAME=NO
GATE4_STRUCTURAL_SUPPORT_AUTHORIZED_BY_THIS_CONTRACT=NO
```

Gate 4 remains independently target-bound. This artifact does not create,
copy, or reinterpret operation IDs, expansion chains, or proto roots.

### Gate 1

```text
STRUCTURAL_MOTIVATION_CANDIDATE_REQUIRED_TO_DEFINE_SAME=NO
STRUCTURAL_MOTIVATION_CANDIDATE_AUTHORIZED_BY_THIS_CONTRACT=NO
```

The current mechanical Path A structural-candidate state remains only partial
scientific authority and is not repaired here.

### Semantic, functional, historical, and language firewalls

```text
SEMANTIC_AUTHORITY_GRANTED=NO
FUNCTIONAL_AUTHORITY_GRANTED=NO
HISTORICAL_AUTHORITY_GRANTED=NO
CROSS_LANGUAGE_AUTHORITY_GRANTED=NO
```

SAME does not imply same/related meaning, same/related function, origin,
cognacy, derivation, borrowing, or cross-language relation.

## 11. Fail-closed policy

`SAME_REPRESENTATION_REASON_CODES_REQUIRED=YES`.

The exact closed union for a future implementation is:

```text
SAME_REPRESENTATION_AUTHORIZED
SAME_REPRESENTATION_CONTRACT_MISSING
SAME_REPRESENTATION_KIND_UNKNOWN
SAME_REPRESENTATION_AUTHORITY_MISSING
SAME_REPRESENTATION_SCHEMA_MISMATCH
SAME_REPRESENTATION_VERSION_MISMATCH
SAME_REPRESENTATION_LANGUAGE_SCOPE_MISMATCH
SAME_REPRESENTATION_VARIETY_SCOPE_MISMATCH
SAME_REPRESENTATION_NOTATION_MISMATCH
SAME_REPRESENTATION_NORMALIZATION_MISMATCH
SAME_REPRESENTATION_SEGMENTATION_MISMATCH
SAME_REPRESENTATION_ORDERING_MISMATCH
SAME_REPRESENTATION_PROJECTION_MISMATCH
SAME_REPRESENTATION_PROJECTION_PROFILE_MISMATCH
SAME_REPRESENTATION_VARIANT_POLICY_MISMATCH
SAME_REPRESENTATION_AMBIGUITY_POLICY_MISMATCH
SAME_REPRESENTATION_PROVENANCE_INCOMPLETE
SAME_REPRESENTATION_INSTANCE_AUTHORITY_MISSING
SAME_REPRESENTATION_MALFORMED_AUTHORITY_TAG
SAME_REPRESENTATION_EQUIVALENCE_UNSUPPORTED
SAME_REPRESENTATION_NONDETERMINISTIC
SAME_REPRESENTATION_UNKNOWN_FIELD
```

| Failure state | Required result |
| --- | --- |
| Missing representation contract | `BLOCKED` / `SAME_REPRESENTATION_CONTRACT_MISSING` |
| Unknown representation kind | `NULL` / `SAME_REPRESENTATION_KIND_UNKNOWN` |
| Missing authority | `BLOCKED` / `SAME_REPRESENTATION_AUTHORITY_MISSING` |
| Schema mismatch | `BLOCKED` / `SAME_REPRESENTATION_SCHEMA_MISMATCH` |
| Unsupported version | `BLOCKED` / `SAME_REPRESENTATION_VERSION_MISMATCH` |
| Language mismatch | `BLOCKED` / `SAME_REPRESENTATION_LANGUAGE_SCOPE_MISMATCH` |
| Variety mismatch | `BLOCKED` / `SAME_REPRESENTATION_VARIETY_SCOPE_MISMATCH` |
| Notation mismatch | `BLOCKED` / `SAME_REPRESENTATION_NOTATION_MISMATCH` |
| Normalization mismatch | `BLOCKED` / `SAME_REPRESENTATION_NORMALIZATION_MISMATCH` |
| Segmentation mismatch | `BLOCKED` / `SAME_REPRESENTATION_SEGMENTATION_MISMATCH` |
| Ordering mismatch | `BLOCKED` / `SAME_REPRESENTATION_ORDERING_MISMATCH` |
| Projection mismatch | `BLOCKED` / `SAME_REPRESENTATION_PROJECTION_MISMATCH` |
| Projection profile mismatch | `BLOCKED` / `SAME_REPRESENTATION_PROJECTION_PROFILE_MISMATCH` |
| Variant-policy mismatch | `BLOCKED` / `SAME_REPRESENTATION_VARIANT_POLICY_MISMATCH` |
| Unresolved ambiguity | `BLOCKED` / `SAME_REPRESENTATION_AMBIGUITY_POLICY_MISMATCH` |
| Incomplete provenance | `BLOCKED` / `SAME_REPRESENTATION_PROVENANCE_INCOMPLETE` |
| Missing instance authority | `BLOCKED` / `SAME_REPRESENTATION_INSTANCE_AUTHORITY_MISSING` |
| Malformed authority tag | `NULL` / `SAME_REPRESENTATION_MALFORMED_AUTHORITY_TAG` |
| Unsupported equivalence class | `BLOCKED` / `SAME_REPRESENTATION_EQUIVALENCE_UNSUPPORTED` |
| Nondeterministic representation | `NULL` / `SAME_REPRESENTATION_NONDETERMINISTIC` |
| Unknown field/state | `NULL` / `SAME_REPRESENTATION_UNKNOWN_FIELD` |

Unknown or incompatible states must never map to SAME.

## 12. Runtime authority tag and future result

```text
AUTHORITY_CONTRACT_REQUIRES_RUNTIME_AUTHORITY_TAG=YES
AUTHORIZED_RUNTIME_AUTHORITY_TAG=SAME_REPRESENTATION_AUTHORITY_V0_1
```

The tag authorizes representation identity only. It does not authorize Voice,
Gate 1, Gate 4, semantic, functional, historical, or cross-language claims.

The smallest future result is the narrower
`SameRepresentationAuthorityV0_1` object above. Its required fields are:

```text
PROPOSED_SHARED_REPRESENTATION_AUTHORITY_TYPE=SameRepresentationAuthorityV0_1
PROPOSED_SHARED_REPRESENTATION_AUTHORITY_FIELDS=schemaVersion; runtimeAuthorityTag; status; representationRelation; inputRepresentationInstance; candidateRepresentationInstance; reasonCode; exact contract/schema/version/scope/notation/normalization/segmentation/order/projection/variant/ambiguity/provenance evidence inside the two instance records
PROPOSED_SHARED_REPRESENTATION_AUTHORITY_STATUS_VALUES=AUTHORIZED | BLOCKED | NULL
DIRECT_EMISSION_OF_MOTIVATION_REPRESENTATION_COMPATIBILITY_SAFE=NO
```

The later comparison builder may consume this narrow result and separately
decide how to populate its own comparison fields. Directly emitting
`MotivationStructuralComparisonV0_1.representationCompatibility` here would
couple representation identity to current Gate 1, Voice, and Gate 4 fields.

## 13. Path A consequence

Defining this authority does not change current runtime output:

```text
PATH_A_GATE1_AFTER_SAME_AUTHORITY=UNCHANGED_PARTIAL_EXISTING_STATE; this contract grants no STRUCTURAL_MOTIVATION_CANDIDATE authority
PATH_A_GATE2_AFTER_SAME_AUTHORITY=AUTHORITY_DEFINED_BUT_CURRENT_PATH_BLOCKED; candidate representation authority is missing
PATH_A_GATE3_AFTER_SAME_AUTHORITY=NOT_AUTHORIZED
PATH_A_GATE4_AFTER_SAME_AUTHORITY=NOT_AUTHORIZED
```

`AUTHORITY_DEFINED` is not `RUNTIME_IMPLEMENTED`. Path A remains blocked until
an independently authorized candidate representation contract and adapter
implementation exist. The current generic lexical witnesses remain source
facts only.

## 14. Future implementation test matrix

The future adapter implementation must cover each case and assert the exact
status/reason code, deterministic output, deep immutability, and preservation
of both exact representation-instance provenance records:

| Case | Required assertion |
| --- | --- |
| Exact same authorized contract | `AUTHORIZED` + `SAME_REPRESENTATION` |
| Compatible explicitly authorized equivalence, if ever ratified | Accepted only under a future DF-ratified equivalence contract; absent here |
| Different contract IDs | Not SAME |
| Schema mismatch | Fail closed |
| Version mismatch | Fail closed |
| Language mismatch | Fail closed |
| Variety mismatch | Fail closed |
| Notation mismatch | Fail closed |
| Normalization mismatch | Fail closed |
| Segmentation mismatch | Fail closed |
| Ordering mismatch | Fail closed |
| Projection mismatch | Fail closed |
| Variant-policy mismatch | Fail closed |
| Ambiguity | Fail closed |
| Missing provenance | Fail closed |
| Malformed authority tag | Fail closed |
| Unknown representation | Fail closed |
| Unsupported equivalence | Fail closed |
| Nondeterministic input | Fail closed |
| Same output under different representations | Must not become SAME |
| Same Voice path | Must not become SAME |
| Same Gamma | Must not become SAME |
| Same ZC | Must not become SAME |
| Bridge compatibility | Must not become SAME |
| Different represented values under the same contract | May remain SAME at representation level |
| Voice leakage | No Voice authority emitted |
| Gate 4 leakage | No Gate 4 authority emitted |
| Gate 1 leakage | No structural-candidate authority emitted |
| Semantic leakage | No semantic authority emitted |
| Functional leakage | No functional authority emitted |
| Historical leakage | No historical authority emitted |
| Cross-language leakage | No cross-language authority emitted |
| Deterministic output | Same valid input produces byte-stable output |
| Deep freeze | Result and nested evidence are immutable |
| Exact provenance preservation | Both representation instances remain independently recoverable |

`FUTURE_IMPLEMENTATION_TEST_MATRIX` is the table above. No test or runtime
implementation is part of this authority-only lane.

## 15. Critical-path decision

Path A cannot currently satisfy the doctrine because the lexical candidate side
has no independently authorized representation contract. The next lane is not
Voice and is not a production/runtime lane.

```text
NEXT_RECOMMENDED_LANE=PATH_A_REPRESENTATION_PREREQUISITE_AUTHORITY
NEXT_RECOMMENDED_LANE_REASON=Provide and ratify the missing candidate-side representation contract and instance-bound provenance adapter without changing candidate generation, retrieval, eligibility, Voice, Gate 1, Gate 4, semantics, function, history, or runtime wiring.
```

This lane therefore freezes the doctrine and stops at the authority boundary.
