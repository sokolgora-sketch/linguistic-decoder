# Open Instrument — Functional Motivation v0.2 CMUdict Candidate ZC Projection Authority Contract v0.1

Status: authority assessment artifact only. This document does not implement
candidate ZC, change production behavior, change tests, wire Discovery/API/UI,
authorize a representation bridge, authorize SAME_REPRESENTATION, establish a
positive control, execute false-null diagnostics, or activate two-mode design.

## Repository and authority boundary

```text
REPOSITORY=sokolgora-sketch/linguistic-decoder
EXPECTED_PUBLISHED_MAIN=7cc9ad347c01199fd229fa847e53f1054d2188cc
GAMMA_IMPLEMENTATION_BASELINE=7cc9ad347c01199fd229fa847e53f1054d2188cc
HISTORICAL_S5_BRANCH=codex/s5-sanskrit-gloss-contract-resolution-v0-1
HISTORICAL_S5_HEAD_BEFORE=6d5bf985f1ca2763b8d41f3d4fa0735d689a1c30

CMUDICT_CANDIDATE_SOURCE_AUTHORITY=RATIFIED
CMUDICT_CANDIDATE_SOURCE_ADAPTER=IMPLEMENTED
CMUDICT_CANDIDATE_VOICE_PROJECTION_AUTHORITY=RATIFIED
CMUDICT_CANDIDATE_VOICE_PROJECTION=IMPLEMENTED
CMUDICT_CANDIDATE_GAMMA_PROJECTION_AUTHORITY=RATIFIED
CMUDICT_CANDIDATE_GAMMA_PROJECTION=IMPLEMENTED
CANDIDATE_ZC_PROJECTION_AUTHORITY=NOT_AUTHORIZED
REPRESENTATION_BRIDGE_AUTHORITY=NOT_AUTHORIZED
SAME_REPRESENTATION_AUTHORIZED_NOW=NO
PRODUCTION_SPOKEN_COMPARABILITY_AUTHORIZED=NO
NATURAL_V0_2_POSITIVE_CONTROL_ESTABLISHED=NO
FALSE_NULL_DIAGNOSTIC_DISPOSITION=DEFERRED_PENDING_V0_2_REACHABILITY
TWO_MODE_DESIGN_STATUS=NOT_AUTHORIZED
SEMANTIC_DISAMBIGUATION_AUTHORIZED=NO
CONSONANT_SEMANTIC_AUTHORITY=NO
DISCOVERY_WIRING_AUTHORIZED=NO
API_WIRING_AUTHORIZED=NO
UI_WIRING_AUTHORIZED=NO
```

## Authority sources

```text
ZC_AUTHORITY_SOURCE_FILES=docs/open-instrument/zero-consonantal-structural-composition-v0.1.md;src/shared/openInstrument/zeroConsonantalStructuralComposition.v0_1.ts;tests/zZeroConsonantalStructuralComposition.contract.v0_1.spec.ts
ZC_IMPLEMENTATION_FILES=src/shared/openInstrument/zeroConsonantalStructuralComposition.v0_1.ts
ZC_RELEVANT_TEST_FILES=tests/zZeroConsonantalStructuralComposition.contract.v0_1.spec.ts;tests/openInstrument.zeroConsonantalStructuralComposition.v0_1.spec.ts;tests/openInstrument.zeroConsonantalStructuralCompositionValidation.v0_1.spec.ts;tests/openInstrument.zeroConsonantalStructuralCompositionValidationV0_1bNumericSummary.spec.ts
GAMMA_AUTHORITY_SOURCE=docs/open-instrument/functional-motivation-v0.2-cmudict-candidate-gamma-projection-authority-v0.1.md;src/shared/openInstrument/cmudictCandidateGammaProjection.v0_1.ts;tests/openInstrument.cmudictCandidateGammaProjection.v0_1.spec.ts
GAMMA_IMPLEMENTATION_SOURCE=src/shared/openInstrument/cmudictCandidateGammaProjection.v0_1.ts
```

## Current ZC v0.1 definition

```text
CURRENT_ZC_DEFINITION_VERBATIM=ZC_v0_1(Γ) = <P, I, S, D, A, R>
CURRENT_ZC_SCHEMA_OR_TYPE_VERBATIM=ZeroConsonantalStructuralCompositionV0_1 = Readonly<{ schemaVersion: typeof ZERO_CONSONANTAL_STRUCTURAL_COMPOSITION_SCHEMA_V0_1; voicePath: readonly VowelVoice[]; variantId: string; variantOrder: number; sourceProfileId: typeof CMUDICT_SOURCE_PROFILE_ID_V0_1; sourceNotation: typeof CMUDICT_SOURCE_NOTATION_V0_1; sourceRevision: typeof CMUDICT_SOURCE_REVISION_V0_1; p: number; i: readonly number[]; s: number; d: readonly number[]; a: number; r: readonly ZeroConsonantalStructuralRecurrenceV0_1[]; }>
CURRENT_ZC_INPUT_CONTRACT_VERBATIM=The only admissible input is a valid frozen configuration Γ containing the existing bundled CMUdict-derived spoken-pronunciation source, normalized source segments, source nuclei, canonical Voice anchors, and retained variant/provenance fields. No spelling, orthographic cluster, G2P result, semantic lookup, etymology, phonological equivalence class, research artifact, provider output, or FRD-02 output is admissible input.
CURRENT_ZC_OUTPUT_CONTRACT_VERBATIM=The defined output is one ZeroConsonantalStructuralCompositionV0_1 record containing canonical voicePath, variantId, variantOrder, sourceProfileId, sourceNotation, sourceRevision, and structural fields p, i, s, d, a, r. An unavailable or invalid Γ produces Null.
CURRENT_ZC_DETERMINISM_RULE_VERBATIM=G1 DETERMINISTIC: Same valid Γ produces the same ZC_v0_1. G8 WORD-INDEPENDENT: The derivation contains no target-word branch, lexical exception, semantic lookup, or special handling for any example word.
CURRENT_ZC_LOSSINESS_RULE_VERBATIM=The projection may be lossy because Γ remains the authoritative structural source.
CURRENT_ZC_AUTHORITY_STATUS=FROZEN_ZË-RO_STRUCTURAL_INTERPRETATION_CONTRACT_ONLY; candidate ZC authority remains NOT_AUTHORIZED
CURRENT_ZC_SEMANTIC_AUTHORITY=NO
CURRENT_ZC_RELATION_TO_GAMMA=Deterministic structural projection Γ -> ZC_v0_1(Γ); ZC does not replace Γ, alter the canonical Voice path, create Voice events, or authorize consonant meaning.
```

The frozen contract explicitly states that this is a ZË-RO structural
interpretation and engineering rule, not external linguistic fact, phonological
analysis, individual consonant semantics, historical etymology, or Level-3
truth. The canonical relation remains `R_ZËRO = (V, Γ, ZC_v0_1(Γ))`.

### P / I / S / D / A / R

```text
ZC_P_STRUCTURAL_DEFINITION=P is the number of consonant source segments in SOURCE_PREFIX_REGION; non-negative integer.
ZC_I_STRUCTURAL_DEFINITION=I is the ordered vector of consonant source-segment counts for every SOURCE_INTER_NUCLEUS_REGION in source-nucleus order; zero-length regions are preserved; length(I)=max(N-1,0).
ZC_S_STRUCTURAL_DEFINITION=S is the number of consonant source segments in SOURCE_SUFFIX_REGION; non-negative integer.
ZC_D_STRUCTURAL_DEFINITION=D=[P,...I,S], the complete ordered consonantal load topology; structural only.
ZC_A_STRUCTURAL_DEFINITION=A=P-S, a signed structural difference and orientation descriptor only.
ZC_R_STRUCTURAL_DEFINITION=R is an ordered vector of recurrence records for repeated exact sourceUnits identities; each record contains identity, ascending source segmentIndices, and occurrenceCount; only identities occurring more than once are emitted.
```

`A` has no semantic polarity, value, gender, energy, direction, or function.
`R` introduces no phonological equivalence class. The canonical source code
groups consonant segments by `JSON.stringify([...segment.sourceUnits])`, keeps
their segment indices, filters occurrences below two, and orders records by
first segment index with the frozen string fallback.

## Existing ZC projectors and helpers

```text
EXISTING_ZC_PROJECTORS=deriveZeroConsonantalStructuralCompositionV0_1; test-only deriveStructuralComposition helpers in the ZC contract/runtime suites are not production authority; zeroConsonantalSignatureV0_1 and buildZeroConsonantalDistributionSummaryV0_1 consume already-produced ZC for validation/reporting and are not projectors.
EXISTING_CANONICAL_ZC_PROJECTOR=deriveZeroConsonantalStructuralCompositionV0_1
EXISTING_CANONICAL_ZC_PROJECTOR_SIGNATURE=deriveZeroConsonantalStructuralCompositionV0_1(variant: PronunciationVoiceVariantResultV0_1 | null): ZeroConsonantalStructuralCompositionV0_1 | null
EXISTING_CANONICAL_ZC_PROJECTOR_INPUT=One defined PronunciationVoiceVariantResultV0_1 or null; it requires canonicalVoicePath, source variant identity/order/profile/notation/revision, normalizedSegments, and nuclei.
EXISTING_CANONICAL_ZC_PROJECTOR_OUTPUT=ZeroConsonantalStructuralCompositionV0_1 | null
EXISTING_CANONICAL_ZC_PROJECTOR_INTERNAL_CALLS=sourceSegmentOrderIsValid; sourceNucleusSegments; deepFreeze; sameArray; no lookup, provider, network, semantic, ranking, or representation calls.
EXISTING_CANONICAL_ZC_PROJECTOR_SIDE_EFFECTS=None; pure allocation and deep-freeze only.
EXISTING_CANONICAL_ZC_PROJECTOR_REUSABLE_FOR_CANDIDATE_GAMMA=NO
EXISTING_CANONICAL_ZC_PROJECTOR_REUSE_REASON=It is the canonical ZC rule but its frozen input type is PronunciationVoiceVariantResultV0_1, not CmuDictCandidateGammaProjectionVariantV0_1. It also expects a CmuDictPronunciationVariant shape. Direct reuse would bypass the required candidate-Gamma input boundary unless an adapter supplies the exact retained Gamma fields.
```

Supporting functions are bounded as follows:

```text
EXISTING_ZC_SIGNATURE_HELPER=zeroConsonantalSignatureV0_1(zc: ZeroConsonantalStructuralCompositionV0_1): string; deterministic structural serialization of p/i/s/d/a/r only; no candidate input, lookup, ranking, semantics, or bridge.
EXISTING_ZC_DISTRIBUTION_HELPER=buildZeroConsonantalDistributionSummaryV0_1(observations: readonly ZeroConsonantalValidationObservationV0_1[]); validation aggregation over already-produced ZC; not a projector and not a candidate authority mechanism.
EXISTING_ZC_NUMERIC_HELPER=numericSummaryV0_1(values: readonly number[]); validation-only summary; not a projector.
EXISTING_ZC_UI_VALIDATOR=parseZeroConsonantalStructuralCompositionV0_1(value: unknown, expected: ZeroConsonantalStructuralCompositionExpectedV0_1); private output-boundary parser; validates schema, enclosing identity, voicePath, P/I/S/D/A/R consistency; does not derive ZC.
EXISTING_ZC_HEART_CALLER=buildHeartInstrumentV1 calls deriveZeroConsonantalStructuralCompositionV0_1 for bundled spoken pronunciation variants; it is an integration caller, not a second ZC projector.
```

The canonical projector consumes pronunciation-derived normalized structure,
not spelling, semantics, or profile-derived Albanian structure. It is
deterministic for valid inputs and returns Null for unavailable, malformed, or
unauthorized pronunciation variants.

## Candidate Gamma derivability

```text
CANDIDATE_ZC_DERIVABLE_FROM_RATIFIED_CANDIDATE_GAMMA=YES
CANDIDATE_ZC_REQUIRES_PRONUNCIATION_REINTERPRETATION=NO
CANDIDATE_ZC_REQUIRES_RAW_SOURCE_REPARSE=NO
CANDIDATE_ZC_REQUIRES_LEXICAL_LOOKUP=NO
CANDIDATE_ZC_REQUIRES_SEMANTIC_INPUT=NO
CANDIDATE_ZC_REQUIRES_REPRESENTATION_BRIDGE=NO
```

Gamma retains `normalizedSegments`, `nuclei`, `canonicalVoicePath`, exact
source variant identity/order, source profile/notation/revision, source
locators, source evidence, and source-relative `consonantRegions`. P/I/S/D/A
can be calculated mechanically from the Gamma regions. R must use Gamma's
retained normalized consonant segments and their exact sourceUnits arrays, not
the flattened region `sourceUnits` alone. No raw source reparse is needed.

## Proposed candidate ZC input boundary

```text
PROPOSED_CANDIDATE_ZC_INPUT=One selected defined CmuDictCandidateGammaProjectionVariantV0_1 together with its parent CmuDictCandidateGammaProjectionV0_1 identity/provenance context; a wrapper may traverse the complete Gamma envelope only to preserve top-level Null and independently project each retained variant.
PROPOSED_CANDIDATE_ZC_REQUIRED_FIELDS=Gamma schemaVersion; projectorId; runtimeAuthorityTag; configurationAuthority; parent candidateId/source identity/provenance; selected variantId/variantOrder; sourceEvidence; sourceProfileId/sourceNotation/sourceRevision; normalizedSegments in segmentIndex order; nuclei in nucleusIndex order; canonicalVoicePath; consonantRegions; defined/null status and exact reason.
PROPOSED_CANDIDATE_ZC_FORBIDDEN_INPUTS=Raw CMUdict reparse; lexical spelling; orthographic consonants; gloss; POS; sense selection; semantic or functional evidence; morphology; etymology; cognacy; borrowing; historical relation; language-only identity; profile-derived Albanian structure; fuzzy matching; fallback; ranking; winner selection; direct source lookup; representation bridge; SAME_REPRESENTATION; provider/network data.
CANDIDATE_GAMMA_ALONE_SUFFICIENT_FOR_ZC=YES, when Gamma means the retained Gamma envelope plus the selected Gamma variant and parent identity context
SOURCE_PRONUNCIATION_REQUIRED_AGAIN_FOR_ZC=NO
CANDIDATE_VOICE_REQUIRED_AGAIN_FOR_ZC=NO
```

The source pronunciation is retained for provenance, but no second
pronunciation interpretation is required. A future wrapper must not accept a
naked Voice path and must not silently select a variant.

## Variant cardinality

```text
PROPOSED_CANDIDATE_ZC_VARIANT_CARDINALITY=N retained defined Gamma variants -> N independently traceable candidate ZC results
PROPOSED_IDENTICAL_ZC_VARIANT_POLICY=Retain identical ZC records independently with variantId, variantOrder, parent candidate identity, Gamma reference, and source provenance; never collapse identical ZC signatures.
CANDIDATE_LEVEL_AGGREGATE_ZC_AUTHORIZED=NO
ZC_VARIANT_WINNER_SELECTION=NO
SOURCE_VARIANT_IDENTITY_PRESERVED=YES
NO_SINGLE_WINNER_PRESERVED=YES
```

## Lossiness

```text
ZC_INFORMATION_PRESERVED=Canonical Voice path; variantId; variantOrder; source profile/notation/revision; P; ordered I; S; D; A; exact repeated sourceUnits identities; recurrence source segment indices; recurrence occurrence counts; parent Gamma/source provenance references.
ZC_INFORMATION_DISCARDED=Most source-relative region detail outside recurrence records; non-repeated consonant identities and positions; full normalized segment/nucleus metadata inside the ZC payload; raw source text unless retained by the parent provenance reference; the mapping from every count back to every Gamma region.
ZC_REVERSIBLE_TO_GAMMA=NO
ZC_COLLISIONS_POSSIBLE=YES
IDENTICAL_ZC_IMPLIES_IDENTICAL_GAMMA=NO
IDENTICAL_ZC_IMPLIES_SAME_PRONUNCIATION=NO
IDENTICAL_ZC_IMPLIES_SAME_FUNCTION=NO
```

Identical ZC does not establish identical Gamma, pronunciation, function,
meaning, ancestry, cognacy, or representation equivalence.

## Candidate Gamma to ZC projection rules

```text
PROPOSED_ZC_P_PROJECTION_RULE=P = Gamma.consonantRegions[SOURCE_PREFIX_REGION].sourceSegmentIndices.length.
PROPOSED_ZC_I_PROJECTION_RULE=I = Gamma.consonantRegions filtered to SOURCE_INTER_NUCLEUS_REGION, ordered by regionIndex, mapping each region to sourceSegmentIndices.length; preserve zero-length entries.
PROPOSED_ZC_S_PROJECTION_RULE=S = Gamma.consonantRegions[SOURCE_SUFFIX_REGION].sourceSegmentIndices.length.
PROPOSED_ZC_D_PROJECTION_RULE=D = [P, ...I, S].
PROPOSED_ZC_A_PROJECTION_RULE=A = P - S.
PROPOSED_ZC_R_PROJECTION_RULE=Filter Gamma.normalizedSegments to kind=consonant; group exact sourceUnits arrays by equal length and equal string values; retain groups occurring more than once; preserve ascending source segmentIndices and occurrenceCount; order records by first source segmentIndex.
```

The candidate implementation must validate that Gamma regions, normalized
segments, nuclei, source indices, and Voice path agree before deriving any
defined ZC. It must preserve the canonical source-segment rather than
source-unit count semantics for P/I/S.

## Moving nucleus

```text
ZC_MOVING_NUCLEUS_INPUT_BEHAVIOR=Consume Gamma's one source moving-nucleus boundary and its source-relative consonant regions; retain the canonical Voice path as output provenance only.
ZC_MOVING_NUCLEUS_INTER_REGION_RULE=Two canonical Voice events from OW, AY, EY, OY, or AW remain one source nucleus; Gamma contains no artificial inter-region, so ZC I contains no extra entry for the Voice expansion.
ZC_ARTIFICIAL_INTER_REGION_CREATED=NO
```

## Zero-consonant Gamma

```text
ZERO_CONSONANT_GAMMA_VALID_ZC=YES
ZERO_CONSONANT_ZC_REPRESENTATION=Defined ZeroConsonantalStructuralCompositionV0_1 with p=0, every inter-nucleus i entry=0, s=0, d=[0,...,0] with length N+1, a=0, r=[], and the retained canonical Voice path/variant identity.
ZERO_CONSONANT_ZC_IS_NULL=NO
ZERO_CONSONANT_ZC_COMPONENTS_VERBATIM=P=0; I=[] for one source nucleus or an ordered vector of zero entries for multiple source nuclei; S=0; D=[P,...I,S]; A=P-S=0; R=[] when no consonant identity repeats.
```

This is a defined structural result, not a fabricated zero vector for Null
input. Gamma Null remains ZC Null.

## Recurrence R

```text
ZC_RECURRENCE_IDENTITY_RULE=Identity is the exact ordered sourceUnits array of one consonant source segment; equality requires equal length and equal string values at every position.
ZC_RECURRENCE_POSITION_RULE=segmentIndices are the exact normalized source segment indices in ascending source order.
ZC_RECURRENCE_REGION_RULE=Recurrence groups consonant segments across prefix, inter-nucleus, and suffix regions; it is not reset at region boundaries.
ZC_RECURRENCE_ORDER_RULE=Records are ordered by the first participating segmentIndex; the canonical exact-identity fallback is retained, although validated unique segment indices make equal first positions unreachable.
ZC_RECURRENCE_DUPLICATE_VARIANT_RULE=Physical or identical variants are never combined; each variant gets its own R records.
```

Repeated adjacent consonant segments count when their exact sourceUnits
identity repeats. Repeated sourceUnits inside one source segment remain one
source segment for P/I/S; R is defined over source-segment identities.

## D and A audit

```text
ZC_D_AUTHORITY_SOURCE=docs/open-instrument/zero-consonantal-structural-composition-v0.1.md §3 and canonical deriveZeroConsonantalStructuralCompositionV0_1
ZC_D_REQUIRED_INPUT=Gamma P, ordered I values, and Gamma S suffix load
ZC_D_CANDIDATE_DERIVATION_DEFENSIBLE=YES
ZC_A_AUTHORITY_SOURCE=docs/open-instrument/zero-consonantal-structural-composition-v0.1.md §3 and canonical deriveZeroConsonantalStructuralCompositionV0_1
ZC_A_REQUIRED_INPUT=Gamma P and S values
ZC_A_CANDIDATE_DERIVATION_DEFENSIBLE=YES
```

D and A are purely structural and pronunciation-derived through authorized
Gamma. Neither is semantic, profile-derived, or a representation claim.

## Stress

```text
STRESS_CHANGES_ZC_IDENTITY=NO
STRESS_USED_BY_ZC_COMPONENTS=NO
STRESS_SEMANTIC_AUTHORITY=NO
```

Gamma excludes stress from consonant identity, region counts, and recurrence;
ZC consumes that stress-neutral structural result.

## Null and Unknown contract

```text
PROPOSED_CANDIDATE_ZC_NULL_TAXONOMY_VERBATIM=Propagate exact Gamma Null status and reason; Gamma Null remains ZC Null; candidate ZC adds no new reason code in this authority artifact; malformed or invariant-invalid Gamma fails closed without a defined ZC result; defined empty Gamma is not Null.
GAMMA_NULL_PROPAGATION_POLICY=Null Gamma produces Null ZC and no fabricated variant.
GAMMA_INVARIANT_FAILURE_POLICY=Any Gamma identity, schema, source-index, region, nucleus, or mapping mismatch fails closed; do not derive counts from partially trusted fields.
MALFORMED_GAMMA_POLICY=Fail closed without throwing, lookup, fallback, or newly invented structural output.
UNKNOWN_REMAINS_DISTINCT_FROM_NULL=YES
DEFINED_EMPTY_GAMMA_ZC_POLICY=Produce defined empty ZC when Gamma is a valid defined zero-consonant pronunciation; do not convert it to Null.
```

No new candidate-ZC-specific reason code is required by the current canonical
contract. A later implementation contract may define one only if a concrete
candidate-ZC validation boundary cannot preserve the exact Gamma diagnostic;
that decision is not made here.

## Provenance

```text
PROPOSED_CANDIDATE_ZC_PROVENANCE_CHAIN=candidate -> candidate Gamma envelope -> selected Gamma variant -> exact sourceEvidence and physical CMUdict record -> candidate Voice variant -> retained normalizedSegments/nuclei/canonicalVoicePath -> ZC projector/version -> candidate ZC result
PROPOSED_ZC_PROJECTOR_IDENTITY=open-instrument.cmudict-candidate-zc-projection.v0_1
PROPOSED_ZC_PROJECTOR_VERSION_FIELD=schemaVersion=open-instrument.cmudict-candidate-zc-projection.v0_1; projectorId; sourceProfileId; sourceNotation; sourceRevision; gammaProjectorId=open-instrument.cmudict-candidate-gamma-projection.v0_1; zcSchemaVersion=open-instrument.zero-consonantal-structural-composition.v0_1
PROPOSED_ZC_SOURCE_GAMMA_REFERENCE_FIELDS=candidateId; candidateSourceId; candidateSourceFamilyId; candidateSourceRecordId; candidateJoinKey; Gamma projectorId; Gamma schemaVersion; Gamma runtimeAuthorityTag; variantId; variantOrder; sourceArtifactSha256; sourceLineNumber; sourceEvidence reference; sourceProfileId; sourceNotation; sourceRevision
```

## Determinism

```text
PROPOSED_CANDIDATE_ZC_DETERMINISM_CONTRACT=Accept only an identity-validated defined Gamma envelope and selected defined Gamma variant; preserve parent candidate identity and source variant order; use Gamma source region order and source segment indices; calculate P/I/S/D/A exactly from the frozen ZC v0.1 rules; calculate R from exact Gamma normalized consonant sourceUnits and source positions; retain zero-length I regions; preserve duplicate physical variants independently; never aggregate, rank, select, or collapse; propagate Null reasons exactly; require exact projector/schema identity; deep-freeze output; use no locale-dependent ordering, randomness, lookup, fallback, semantics, provider, network, source acquisition, representation bridge, or SAME_REPRESENTATION.
```

## Semantic and representation firewalls

```text
ZC_SEMANTIC_AUTHORITY=NO
CONSONANT_SEMANTIC_AUTHORITY=NO
ZC_FUNCTIONAL_INTERPRETATION_AUTHORITY=NO
SEMANTIC_DISAMBIGUATION_USED=NO
IDENTICAL_ZC_FUNCTIONAL_EQUIVALENCE_AUTHORIZED=NO
REPRESENTATION_BRIDGE_AUTHORITY=NOT_AUTHORIZED
SAME_REPRESENTATION_AUTHORIZED_NOW=NO
CANDIDATE_ZC_IMPLIES_SAME_REPRESENTATION=NO
PRODUCTION_SPOKEN_COMPARABILITY_AUTHORIZED_BY_THIS_LANE=NO
CROSS_LANGUAGE_ZC_COMPARABILITY_AUTHORIZED=NO
NATURAL_V0_2_POSITIVE_CONTROL_ESTABLISHED=NO
FALSE_NULL_DIAGNOSTIC_DISPOSITION=DEFERRED_PENDING_V0_2_REACHABILITY
TWO_MODE_DESIGN_STATUS=NOT_AUTHORIZED
```

## Recommended future strategy

```text
RECOMMENDED_CANDIDATE_ZC_IMPLEMENTATION_STRATEGY=C — implement a candidate-specific adapter around the exact canonical ZC v0.1 rules, using only the retained Gamma envelope/variant fields; do not redefine ZC and do not invoke raw pronunciation lookup.
RECOMMENDED_EXISTING_ZC_REUSE=Reuse the canonical P/I/S/D/A/R semantics and output type; do not directly pass candidate data into the canonical projector without an explicit typed provenance-preserving adapter.
RECOMMENDED_ZC_REUSE_SIGNATURES=deriveZeroConsonantalStructuralCompositionV0_1(variant: PronunciationVoiceVariantResultV0_1 | null): ZeroConsonantalStructuralCompositionV0_1 | null; zeroConsonantalSignatureV0_1(zc: ZeroConsonantalStructuralCompositionV0_1): string for validation only
FORBIDDEN_ZC_REUSE=Direct raw pronunciation lookup; source reparsing; spelling or orthographic extraction; spokenGamma/profileDerivedGamma/gammaForHeartV0_2; any semantic, ranking, winner, representation, provider, or Discovery helper; direct candidate-level aggregation.
```

The adapter strategy is defensible because Gamma retains the complete source
structure needed by the canonical rule. It is not an authorization to write
the adapter in this lane.

## Future implementation surface

```text
PROPOSED_CANDIDATE_ZC_IMPLEMENTATION_FILES=src/shared/openInstrument/cmudictCandidateZcProjection.v0_1.ts;tests/openInstrument.cmudictCandidateZcProjection.v0_1.spec.ts
PROPOSED_CANDIDATE_ZC_NEW_TYPES=CmuDictCandidateZcProjectionV0_1;CmuDictCandidateZcProjectionVariantV0_1;otherwise reuse ZeroConsonantalStructuralCompositionV0_1; names are proposals only and were not created.
PROPOSED_CANDIDATE_ZC_REUSED_FUNCTIONS=Canonical ZC rule semantics; canonical output type; no direct raw-source lookup; no existing candidate ZC function exists.
PROPOSED_CANDIDATE_ZC_FORBIDDEN_REUSE=resolveCmuDictPronunciationToVoiceV0_1 direct lookup; spokenGamma; profileDerivedGamma; gammaForHeartV0_2; any ZC implementation that consumes spelling, semantics, or a flattened Voice path; any representation comparison helper.
PROPOSED_CANDIDATE_ZC_TEST_FILES=tests/openInstrument.cmudictCandidateZcProjection.v0_1.spec.ts plus unchanged canonical ZC contract/projector tests.
```

## Future test matrix

```text
PROPOSED_CANDIDATE_ZC_TEST_MATRIX=01 exact projector identity; 02 exact ZC schema/version; 03 one defined Gamma variant -> one defined ZC; 04 P canonical derivation; 05 I canonical derivation; 06 S canonical derivation; 07 D canonical derivation; 08 A canonical derivation; 09 R canonical derivation; 10 Gamma region order preserved; 11 repeated consonant recurrence behavior; 12 moving nucleus creates no artificial inter-region; 13 stress invariance; 14 zero-consonant Gamma behavior; 15 N Gamma variants -> N ZC results; 16 variant order preserved; 17 physical/source identity traceability preserved; 18 duplicate physical variants remain independent; 19 identical ZC outputs remain independent records; 20 no candidate aggregate; 21 no winner/ranking; 22 Gamma Null exact propagation; 23 malformed Gamma fail closed; 24 Gamma identity mismatch fail closed; 25 projector/schema mismatch fail closed; 26 deterministic repeated calls; 27 deep freeze; 28 lossy nature explicit; 29 identical ZC does not imply identical Gamma; 30 identical ZC does not imply same pronunciation; 31 identical ZC does not imply same function; 32 no semantic fields; 33 no bridge/SAME_REPRESENTATION fields; 34 no direct pronunciation reinterpretation; 35 no lexical lookup; 36 no raw source reparse; 37 no Discovery/API/UI wiring; 38 no provider/network/source acquisition; 39 canonical existing ZC conformance; 40 ZC output contains only authorized structural fields.
```

## Architectural assessment

```text
CMUDICT_CANDIDATE_ZC_PROJECTION_ARCHITECTURAL_ASSESSMENT=DEFENSIBLE
CMUDICT_CANDIDATE_ZC_PROJECTION_ARCHITECTURAL_ASSESSMENT_REASON=Ratified Gamma retains the exact source-relative consonant regions, normalized source segments, source nuclei, canonical Voice path, source variant identity/order, source profile/notation/revision, physical source evidence, and provenance required by the frozen ZC v0.1 P/I/S/D/A/R rule. The existing canonical projector is mechanically compatible in behavior but not directly typed for the candidate Gamma boundary. A bounded candidate-specific adapter can preserve the canonical rule while deriving only from authorized Gamma, without raw pronunciation reinterpretation, lookup, semantics, winner selection, aggregation, representation bridge, or SAME_REPRESENTATION.
CMUDICT_CANDIDATE_ZC_PROJECTION_RECOMMENDATION=RECOMMEND_AUTHORIZE
CANDIDATE_ZC_PROJECTION_AUTHORITY_NOW=NO
DF_CANDIDATE_ZC_PROJECTION_RATIFICATION_REQUIRED=YES
MERGING_THIS_ARTIFACT_DOES_NOT_AUTHORIZE_CANDIDATE_ZC_PROJECTION=YES
```

## Scope declaration

```text
AUTHORITY_ARTIFACT=docs/open-instrument/functional-motivation-v0.2-cmudict-candidate-zc-projection-authority-v0.1.md
AUTHORITY_ARTIFACT_SHA256=7f8b5529b9e67e98d06c1e7d2e1bd56cfdac145e4d98236fc8c9ebe2ef9a9fac
FINAL_CHANGED_FILE_COUNT=1
PRODUCTION_CODE_CHANGED=NO
TEST_BEHAVIOR_CHANGED=NO
SOURCE_DATA_CHANGED=NO
DISCOVERY_WIRING_CHANGED=NO
API_WIRING_CHANGED=NO
UI_WIRING_CHANGED=NO
ZC_IMPLEMENTATION_CHANGED=NO
GAMMA_IMPLEMENTATION_CHANGED=NO
REPRESENTATION_BRIDGE_CHANGED=NO
S5_IN_SCOPE=NO
FALSE_NULL_EXECUTED=NO
TWO_MODE_SURFACED=NO
```

The artifact checksum is computed over the final file bytes with the
`AUTHORITY_ARTIFACT_SHA256=` value blank. Filling the reported checksum does
not authorize any implementation or ratification; it identifies this exact
assessment artifact.

```text
NEXT_RECOMMENDED_LANE=CMUDICT_CANDIDATE_ZC_PROJECTION_DF_RATIFICATION
NEXT_ACTION=AWAIT_DF_DECISION
FINAL_CLASSIFICATION=CMUDICT_CANDIDATE_ZC_PROJECTION_RECOMMENDED_PENDING_DF_RATIFICATION
```
