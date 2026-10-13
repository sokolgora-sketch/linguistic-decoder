# OPEN INSTRUMENT — FUNCTIONAL MOTIVATION v0.2 CMUDICT CANDIDATE → PRODUCTION_SPOKEN REPRESENTATION BRIDGE AUTHORITY v0.1

## Status and boundary

```text
STATUS=AUTHORITY_CONTRACT_DESIGN_ONLY
REPRESENTATION_BRIDGE_AUTHORITY_NOW=NO
SAME_REPRESENTATION_AUTHORIZED_BY_THIS_CONTRACT=NO
FUNCTIONAL_EQUIVALENCE_AUTHORIZED_BY_THIS_CONTRACT=NO
SEMANTIC_EQUIVALENCE_AUTHORIZED_BY_THIS_CONTRACT=NO
DISCOVERY_WIRING_AUTHORIZED_BY_THIS_CONTRACT=NO
API_WIRING_AUTHORIZED_BY_THIS_CONTRACT=NO
UI_WIRING_AUTHORIZED_BY_THIS_CONTRACT=NO
NATURAL_POSITIVE_CONTROL_EXECUTED=NO
NO_SOURCE_ACQUISITION=YES
NO_NETWORK_TRANSFER=YES
```

This is the smallest authority contract for evaluating whether the ratified
CMUdict candidate pronunciation-derived representation may be admitted to a
future `production_spoken` comparison. It authorizes no implementation,
runtime wiring, `SAME_REPRESENTATION`, functional interpretation, semantic
equivalence, historical relation, winner, aggregation, or research run.

## Repository evidence

```text
REPOSITORY=sokolgora-sketch/linguistic-decoder
BASELINE_MAIN=83ec36d82624989491075483b3e9ca61fa7a75cd
HISTORICAL_S5_BRANCH=codex/s5-sanskrit-gloss-contract-resolution-v0-1
HISTORICAL_S5_HEAD=6d5bf985f1ca2763b8d41f3d4fa0735d689a1c30
```

The source and production contracts below were recovered from the aligned
`main` tree. They are contract evidence, not a claim that the bridge already
exists in runtime.

## Candidate domain

The left domain is the ratified CMUdict candidate source-pronunciation-derived
chain:

```text
frozen CMUdict artifact
→ CmuDictCandidatePronunciationEvidenceV0_1
→ CmuDictCandidateVoiceProjectionV0_1
→ CmuDictCandidateGammaProjectionV0_1
→ CmuDictCandidateZcProjectionV0_1
```

The source identity is:

```text
SOURCE_FAMILY=CMUDICT
SOURCE_PROFILE_ID=open-instrument.cmudict-arpabet-en-us.v0_1
SOURCE_REVISION=74790861f652b15e4ac49015a90074ad62a27690
SOURCE_NOTATION=ARPABET
SOURCE_ARTIFACT_PATH=src/data/openInstrument/pronunciation/cmudict.dict
SOURCE_ARTIFACT_BYTES=3618488
SOURCE_ARTIFACT_SHA256=81917843c7f44ce2b094ac63873c2c7a4cf802040792c455ba3ca406891c3d22
```

The candidate source evidence preserves candidate identity, source-family and
per-record identity, exact candidate form and join key, source artifact
identity, physical source line, raw source line, source form, base form,
variant ID and order, raw ARPABET, lossless base/stress views, and annotation.
It is source evidence only. The candidate Voice projection adds the reviewed
ARPABET-to-Voice mapping identity/table, normalized segments, nuclei, and
canonical Voice path. Candidate Gamma and ZC remain derived projections with
their own projector identity, runtime authority tag, source evidence, and
variant-preserving envelopes.

### Candidate load-bearing symbols

```text
parseCmuDictCandidateSourceRecordsV0_1
adaptCmuDictCandidateSourceEvidenceV0_1
projectCmuDictCandidateVoiceProjectionV0_1
projectCmuDictCandidateGammaProjectionV0_1
projectCmuDictCandidateZcProjectionV0_1
CMUDICT_SOURCE_PROFILE_ID_V0_1
CMUDICT_SOURCE_REVISION_V0_1
CMUDICT_SOURCE_NOTATION_V0_1
CMUDICT_DATA_BYTES_V0_1
CMUDICT_DATA_SHA256_V0_1
CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_ID_V0_1
CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_TABLE_V0_1
CMUDICT_CANDIDATE_VOICE_PROJECTION_RUNTIME_AUTHORITY_TAG_V0_1
CMUDICT_CANDIDATE_GAMMA_PROJECTION_RUNTIME_AUTHORITY_TAG_V0_1
```

### Candidate load-bearing signatures

```text
parseCmuDictCandidateSourceRecordsV0_1(sourceText: string): readonly CmuDictCandidateParsedSourceRecordV0_1[]
adaptCmuDictCandidateSourceEvidenceV0_1(input: CmuDictCandidateAdapterInputV0_1, artifactOverride?: CmuDictCandidateSourceArtifactOverrideV0_1): CmuDictCandidatePronunciationEvidenceV0_1
projectCmuDictCandidateVoiceProjectionV0_1(evidence: unknown): CmuDictCandidateVoiceProjectionV0_1
projectCmuDictCandidateGammaProjectionV0_1(input: unknown): CmuDictCandidateGammaProjectionV0_1
projectCmuDictCandidateZcProjectionV0_1(input: unknown): CmuDictCandidateZcProjectionV0_1
```

`parseCmuDictCandidateSourceRecordsV0_1` preserves physical source order and
locators. `adaptCmuDictCandidateSourceEvidenceV0_1` checks the frozen artifact
identity and exact lexical join before retaining every matching physical
record. The candidate projection stages do not select a variant or bind a
pronunciation to a sense.

## Production_spoken domain

The right domain is the existing Heart/production spoken representation:

```text
buildHeartInstrumentV1(basis: string)
→ resolveCmuDictPronunciationToVoiceV0_1(word: string)
→ PronunciationToVoiceResultV0_1
→ HeartSpokenPronunciationV0_1
→ canonicalSpokenVoicePath and per-variant ZC where available
```

```text
PRODUCTION_SPOKEN_REPRESENTATION_KIND=production_spoken
PRODUCTION_SPOKEN_SOURCE_AUTHORITY=CMUdict ARPABET en-US input pronunciation profile through resolveCmuDictPronunciationToVoiceV0_1
PRODUCTION_SPOKEN_PROFILE_AUTHORITY=PRONUNCIATION_TO_VOICE_PROFILE_V0_1=open-instrument.cmudict-arpabet-en-us.v0_1
PRODUCTION_SPOKEN_NOTATION=ARPABET with terminal stress digits 0, 1, or 2
PRODUCTION_SPOKEN_NORMALIZATION=resolveCmuDictPronunciationToVoiceV0_1 applies NFC, trim, and lowercase before lookup; Heart first applies normalizeBasis
PRODUCTION_SPOKEN_VARIANT_POLICY=Preserve all source variants; emit a canonical path only when all defined variant paths are identical; divergent variants remain Null with PRONUNCIATION_VARIANT_AMBIGUOUS
PRODUCTION_SPOKEN_VOICE_REQUIREMENT=YES
PRODUCTION_SPOKEN_GAMMA_REQUIREMENT=NO_FOR_DOMAIN_BRIDGE; UNKNOWN_FOR_LATER_STRUCTURAL_RELATION
PRODUCTION_SPOKEN_ZC_REQUIREMENT=NO_FOR_DOMAIN_BRIDGE; SECONDARY_DERIVED_EVIDENCE_WHEN_AVAILABLE
PRODUCTION_SPOKEN_PROVENANCE_REQUIREMENT=sourceProfileId; sourceNotation; sourceRevision; variant identity/order; sourceForm; sourcePronunciation; normalized segments; nuclei; canonical Voice path; per-variant reason code
```

### Production load-bearing symbols

```text
buildHeartInstrumentV1
resolveCmuDictPronunciationToVoiceV0_1
resolveArpabetPronunciationVariantsToVoiceV0_1
deriveZeroConsonantalStructuralCompositionV0_1
buildMotivationEngineDiscoveryV0_1
buildMotivationEngineDiscoveryServerOnlyV0_1
structuralRelationAuthorizedV0_2
```

### Production load-bearing signatures

```text
buildHeartInstrumentV1(basis: string): HeartInstrumentV1Packet
resolveCmuDictPronunciationToVoiceV0_1(word: string): PronunciationToVoiceResultV0_1
resolveArpabetPronunciationVariantsToVoiceV0_1(normalizedWord: string, variants: readonly CmuDictPronunciationVariantV0_1[]): PronunciationToVoiceResultV0_1
deriveZeroConsonantalStructuralCompositionV0_1(variant: PronunciationVoiceVariantResultV0_1 | null): ZeroConsonantalStructuralCompositionV0_1 | null
buildMotivationEngineDiscoveryV0_1(input: { word: string; inputLanguage: string; inputProfile: string; analysis: AnalyzeWordResultV1; heart: HeartInstrumentV1; sourceAdapters?: readonly GenericFunctionalWitnessSourceAdapterV1[] }): MotivationEngineDiscoveryV0_1
buildMotivationEngineDiscoveryServerOnlyV0_1(input: { word: string; inputLanguage: string; inputProfile: string; analysis: AnalyzeWordResultV1; heart: HeartInstrumentV1; provider?: EnglishKaikkiServerOnlyExactIndexProviderV0_1 }): Promise<MotivationEngineDiscoveryServerOnlyResultV0_1>
```

The current production path does not expose candidate CMUdict projections to
Discovery. Its Functional Motivation gate requires a structural candidate,
`SAME_REPRESENTATION`, a comparable Voice relationship, and an authorized
operation/expansion/proto-root relation. This bridge contract stops before
that gate.

## Bridge meaning and assertion firewall

The bridge is a typed, provenance-preserving domain-compatibility assessment.
It may compare explicit contracts and package the result for a later
representation-relation evaluation. It is not a semantic or historical
bridge.

```text
BRIDGE_MAY_ASSERT_DATA_CONVERSION=YES, only for already-ratified deterministic mappings and envelope projection
BRIDGE_MAY_ASSERT_PROVENANCE_PRESERVATION=YES
BRIDGE_MAY_ASSERT_STRUCTURAL_COMPATIBILITY=YES, only as representation-level structural compatibility
BRIDGE_MAY_ASSERT_REPRESENTATION_DOMAIN_COMPATIBILITY=YES, within the exact English CMUdict/ARPABET/Voice scope below
BRIDGE_MAY_ASSERT_REPRESENTATION_IDENTITY=NO
BRIDGE_MAY_ASSERT_SAME_REPRESENTATION=NO
BRIDGE_MAY_ASSERT_PRONUNCIATION_IDENTITY=NO
BRIDGE_MAY_ASSERT_SEMANTIC_EQUIVALENCE=NO
BRIDGE_MAY_ASSERT_FUNCTIONAL_EQUIVALENCE=NO
BRIDGE_MAY_ASSERT_HISTORICAL_RELATION=NO
```

The bridge must never infer compatibility from eventual Voice letters alone.
It must require matching source/profile scope, notation, mapping authority,
normalization policy, variant policy, and recoverable provenance.

## Required bridge inputs

```text
BRIDGE_REQUIRES_SOURCE_EVIDENCE=YES
BRIDGE_REQUIRED_SOURCE_EVIDENCE_FIELDS=candidateId; candidateSourceId; candidateSourceFamilyId; candidateSourceRecordId; candidateSourceForm; candidateJoinKey; candidateSourceProvenance; sourceProfileId; sourceRevision; sourceNotation; sourceArtifactBytes; sourceArtifactSha256; sourceLineNumber; rawSourceLine; sourceForm; baseSourceForm; variantId; variantOrder; rawPronunciation; orderedRawArpabetTokens; losslessBaseStressViews; authorityStatus
BRIDGE_REQUIRES_CANDIDATE_VOICE=YES
BRIDGE_REQUIRED_CANDIDATE_VOICE_FIELDS=authorityTag; mappingId; mappingTable; sourceEvidence; normalizedSegments; nuclei; canonicalVoicePath; per-variant status; per-variant reasonCode
BRIDGE_REQUIRES_CANDIDATE_GAMMA=NO
BRIDGE_REQUIRED_CANDIDATE_GAMMA_FIELDS=NONE_FOR_DOMAIN_COMPATIBILITY; retain Gamma if present for later structural evaluation without making it a bridge gate
BRIDGE_REQUIRES_CANDIDATE_ZC=NO
BRIDGE_REQUIRED_CANDIDATE_ZC_FIELDS=NONE_FOR_DOMAIN_COMPATIBILITY; retain ZC if present as secondary diagnostic evidence
```

Source evidence and candidate Voice are required because the bridge must know
what pronunciation was attested and which authorized spoken mapping produced
the candidate path. Gamma and ZC are downstream structural projections and do
not establish representation-domain compatibility.

## Compatibility dimension matrix

| Dimension | Candidate rule | Production rule | Compatible now | Bridge requirement | Authority source |
| --- | --- | --- | --- | --- | --- |
| language | English CMUdict en-US profile | English CMUdict en-US input profile | YES only within exact profile scope | Reject non-English or unbound variety | CMUdict source and pronunciation contracts |
| source authority | Ratified candidate source-evidence role | Existing input pronunciation resolver | YES at contract scope | Require both roles explicitly bound | Candidate source adapter and pronunciation contracts |
| source artifact | Exact bundled artifact with hash and bytes | Resolver uses bundled artifact constants but does not emit runtime hash proof | UNKNOWN | Carry or validate exact artifact identity on both sides | `cmudictArpabetPronunciation.v0_1.ts` and candidate adapter |
| source revision | `74790861f652b15e4ac49015a90074ad62a27690` | Same frozen revision constant | YES at contract metadata level | Compare exact revision | CMUdict constants |
| notation | ARPABET | ARPABET with stress digits | YES | Compare exact notation and stress grammar | Candidate notation contract and pronunciation resolver |
| normalization | NFC/en-US-lowercase/NFC, no trim for candidate lexical join | NFC, trim, lowercase for production lookup | NO as a general contract | Align or explicitly carry exact source-form identity; no trim inference | English lexical source contract and resolver implementation |
| lexical join | Exact frozen candidate join key and terminal variant suffix handling | Trimmed normalized lookup word | NO as a general contract | Upstream production identity alignment required | English lexical source contract and resolver implementation |
| pronunciation segmentation | Candidate parser preserves ordered ARPABET tokens and nuclei | Resolver parses ordered ARPABET units into segments and nuclei | YES conditionally | Require equivalent parser and boundary authority | Candidate adapter and `pronunciationToVoice.v0_1.ts` |
| nucleus identity | Candidate retains source token, nucleus index, kind, and anchors | Production retains source token, nucleus index, kind, and anchors | YES conditionally | Preserve one source nucleus across moving-nucleus events | Moving-nucleus authority and pronunciation resolver |
| moving-nucleus handling | Same CMUdict Voice profile and canonicalization authority | Same CMUdict Voice profile and canonicalization authority | YES at mapping level | Verify mapping ID/table and boundary metadata | Moving-nucleus authority and Voice profile |
| Voice vocabulary | Seven canonical Voice values | Seven canonical Voice values | YES | Require exact Voice vocabulary and mapping identity | `vowelVoices.v0.1.ts` and Voice profile |
| Voice mapping | `CMUDICT_ARPABET_VOICE_PROFILE_V0_1` with candidate mapping identity/table | Shared pronunciation-to-Voice profile | YES conditionally | Carry exact mapping ID/table and authority tag | Candidate Voice projection and pronunciation resolver |
| stress treatment | Raw stress preserved; base/stress view is lossless | Stress parsed into normalized segment/nucleus metadata | YES conditionally | Preserve raw stress and require same stress policy | Candidate parser and pronunciation resolver |
| annotation parsing and segmentation | Candidate parser excludes terminal `#` annotation text from pronunciation tokens while preserving the raw line and annotation | Current production loader can retain terminal `#` annotation text in `sourcePronunciation` and `sourceUnits` | NO for affected records | Require explicit production annotation parsing/segmentation alignment before compatibility; otherwise block the bridge | Candidate source adapter and `cmudictArpabetPronunciation.v0_1.ts` |
| variant identity | Physical source record, variant ID, and order preserved | Resolver preserves physical lookup variants and order | YES conditionally | One-to-one variant ledger; no collapse or winner | Candidate adapter and pronunciation resolver |
| variant order | Physical artifact order | Loader insertion order | YES only if same artifact and loader order | Compare source identity and preserve order | CMUdict loader and candidate adapter |
| Gamma definition | Candidate consonant regions derived from candidate Gamma contract | No universal production Gamma gate in Heart | UNKNOWN for later structure | Define separately if structural comparison later requires it | Candidate Gamma contract and Functional Motivation gate |
| ZC definition | Candidate ZC derives from candidate Gamma variant | Heart derives ZC from spoken Voice variant | UNKNOWN for later structure | Keep source/profile identity distinct; do not use for bridge success | Candidate ZC and canonical ZC contracts |
| representation kind | CMUdict candidate source-pronunciation-derived | `production_spoken` | NO without bridge output | Explicitly authorize only the domain-compatible scope | Representation authority contract |
| provenance | Candidate has exact physical locator and hash | Production has profile/revision/notation and variant data, but not full bridge envelope | UNKNOWN | Add explicit bridge-side provenance completeness check | Candidate and production runtime structures |
| sense/gloss relation | Candidate lexical context only; pronunciation not sense-bound | Production lookup is form-level | NO as semantic authority | Do not bind pronunciation to sense or gloss | Candidate source adapter contract |
| functional evidence | Not supplied by candidate pronunciation chain | Reviewed evidence is separate | NO | Keep functional evidence outside bridge | Functional Motivation contract |
| semantic interpretation | Not supplied | Separate interpretation layer | NO | No semantic field or inference | Functional Motivation contract |

The matrix records exact compatibility limits. `YES conditionally` means the
repository has matching authority components but a future bridge must validate
their identity at runtime. `UNKNOWN` is not promoted to compatibility.

## Moving-nucleus invariant

The candidate and production Voice paths use the same reviewed CMUdict mapping
and moving-nucleus canonicalization authority. `AW`, `AY`, `EY`, `OW`, and
`OY` may emit two ordered canonical Voice events while remaining one source
nucleus. The bridge must preserve the source nucleus and its boundary metadata.

```text
MOVING_NUCLEUS_BRIDGE_COMPATIBLE=YES_WHEN_SOURCE_PROFILE_MAPPING_AND_NUCLEUS_BOUNDARY_METADATA_MATCH
MOVING_NUCLEUS_SOURCE_NUCLEUS_IDENTITY_PRESERVED=YES
ARTIFICIAL_INTER_REGION_AUTHORIZED=NO
```

No bridge result may create a nucleus boundary merely because two Voice events
were emitted. If the candidate or production side lacks the required nucleus
identity or moving-nucleus authority, the bridge is blocked.

## Variant policy

```text
CANDIDATE_VARIANT_CARDINALITY=N physical matching CMUdict source records, including duplicate physical records with distinct locators
PRODUCTION_VARIANT_CARDINALITY=All physical lookup variants for the production form; no fixed cap
BRIDGE_VARIANT_CARDINALITY_POLICY=Preserve one evidence member per candidate physical record and one production member per physical variant; compare only after cardinality and identity are explicit
IDENTICAL_VARIANTS_COLLAPSED=NO
VARIANT_WINNER_SELECTION=NO
NO_SINGLE_WINNER_PRESERVED=YES
```

A shared canonical Voice path does not authorize collapsing physical variants.
Divergent production variants remain Null under the existing resolver policy;
the bridge must preserve that Null and must not choose a variant.

## Required provenance

```text
BRIDGE_REQUIRED_PROVENANCE_FIELDS=candidateId; candidateSourceId; candidateSourceFamilyId; candidateSourceRecordId; candidateSourceForm; candidateJoinKey; candidate source provenance; production normalizedWord; sourceProfileId; sourceNotation; sourceRevision; source artifact bytes and SHA-256 when available; sourceForm; sourcePronunciation; variantId; variantOrder; sourceLineNumber and rawSourceLine for candidate; orderedRawArpabetTokens; normalizedSegments; nuclei; canonicalVoicePath; mappingId; mappingTable; runtime authority tags; representation kind; bridge contract version; status; reasonCode
BRIDGE_OPTIONAL_PROVENANCE_FIELDS=opaque annotation text; senseId; gloss; Gamma envelope; ZC envelope; provider-specific citation or locator that is not needed for compatibility
BRIDGE_FORBIDDEN_PROVENANCE_INFERENCE=Pronunciation-to-sense binding; semantic or functional relation; historical relation; cognacy; borrowing; derivation; language superiority; winner; same pronunciation; same Gamma; same ZC; SAME_REPRESENTATION
```

Optional Gamma and ZC are retained if present but do not turn into bridge
authority. The evidence ledger remains lossless for every source variant.

## Null, unknown, and malformed policy

```text
SOURCE_NULL_THROUGH_BRIDGE=Preserve source status=null, original source reasonCode, and empty variant evidence; bridge status is blocked or null, never compatible
VOICE_NULL_THROUGH_BRIDGE=Preserve candidate or production Voice status=null and exact reasonCode; no Voice comparability is asserted
GAMMA_NULL_THROUGH_BRIDGE=Preserve as optional derived Null; bridge domain compatibility may remain evaluable if source and Voice requirements pass; later structural evaluation must handle Gamma Null separately
ZC_NULL_THROUGH_BRIDGE=Preserve as optional derived Null; never promote ZC Null to domain incompatibility or compatibility by itself
UNKNOWN_THROUGH_BRIDGE=Remain UNKNOWN or BLOCKED_BY_MISSING_AUTHORITY; never convert to NOT_REACHABLE or compatible
MALFORMED_INPUT_THROUGH_BRIDGE=Return explicit malformed/Null status with original evidence; never define compatibility from malformed input
NEW_BRIDGE_REASON_CODES_REQUIRED=YES
PROPOSED_NEW_BRIDGE_REASON_CODES=BRIDGE_SOURCE_AUTHORITY_MISSING; BRIDGE_PRODUCTION_AUTHORITY_MISSING; BRIDGE_REPRESENTATION_DOMAIN_MISMATCH; BRIDGE_NORMALIZATION_MISMATCH; BRIDGE_ARTIFACT_IDENTITY_UNVERIFIED; BRIDGE_VARIANT_POLICY_UNRESOLVED; BRIDGE_MAPPING_AUTHORITY_MISMATCH; BRIDGE_PROVENANCE_INCOMPLETE
```

The current source and projection reason taxonomies do not distinguish a
source/projection failure from a cross-domain bridge failure. These eight
bridge-specific codes are required for a future adapter to preserve that
distinction. They are proposed only; this document does not add them to
runtime code.

## SAME_REPRESENTATION firewall

```text
BRIDGE_SUCCESS_MEANING=Candidate evidence is represented under an explicitly authorized CMUdict-derived domain compatible with production_spoken for a later representation-relation evaluation
BRIDGE_SUCCESS_IMPLIES_SAME_REPRESENTATION=NO
BRIDGE_SUCCESS_IMPLIES_FUNCTIONAL_RELATION=NO
BRIDGE_SUCCESS_IMPLIES_SEMANTIC_EQUIVALENCE=NO
BRIDGE_SUCCESS_IMPLIES_PRONUNCIATION_IDENTITY=NO
```

Bridge success does not imply the same pronunciation, Gamma, ZC, lexical
identity, sense, function, semantic equivalence, history, cognacy, or
derivation. The subsequent `SAME_REPRESENTATION` lane must ratify its own
decision rule against the bridge output and reviewed evidence.

## Cross-language firewall

```text
CROSS_LANGUAGE_BRIDGE_AUTHORIZED_BY_THIS_CONTRACT=NO
ALBANIAN_BRIDGE_AUTHORIZED_BY_THIS_CONTRACT=NO
ENGLISH_DERIVES_FROM_ALBANIAN_CLAIM_AUTHORIZED=NO
```

This contract is limited to the CMUdict English candidate representation and
the existing English `production_spoken` profile. Albanian profile-derived
Gamma and the Albanian pre-Voice category bridge are not candidate-to-spoken
authority and are not imported here.

## Gamma and ZC role

```text
GAMMA_REQUIRED_FOR_BRIDGE=NO
GAMMA_REQUIRED_FOR_BRIDGE_REASON=The bridge establishes representation-domain compatibility; Gamma is a downstream structural projection and is required only if a later structural-relation contract explicitly makes it a gate
ZC_REQUIRED_FOR_BRIDGE=NO
ZC_REQUIRED_FOR_BRIDGE_REASON=The current architecture identifies ZC as secondary derived evidence and does not require it for spoken comparability
```

No Gamma or ZC requirement is inferred merely because those projectors exist.

## Proposed future bridge output contract

```text
PROPOSED_BRIDGE_PROJECTOR_IDENTITY=open-instrument.cmudict-candidate-production-spoken-representation-bridge.v0_1
PROPOSED_BRIDGE_INPUT_TYPE=CmuDictCandidateVoiceProjectionV0_1 plus an explicit production spoken authority envelope derived from HeartSpokenPronunciationV0_1/PronunciationToVoiceResultV0_1
PROPOSED_BRIDGE_OUTPUT_TYPE=CmuDictCandidateProductionSpokenRepresentationBridgeV0_1
PROPOSED_BRIDGE_STATUS_MODEL=COMPATIBLE_FOR_SUBSEQUENT_RELATION_EVALUATION | BLOCKED_BY_MISSING_AUTHORITY | NULL
PROPOSED_BRIDGE_REASON_MODEL=Null or one exact bridge reason code; source and projection reason codes remain nested and are not replaced
PROPOSED_BRIDGE_REPRESENTATION_DOMAIN=candidate CMUdict source-pronunciation-derived ↔ production_spoken, exact English CMUdict profile only
PROPOSED_BRIDGE_COMPATIBILITY_SCOPE=Same frozen artifact/profile/revision/notation, compatible lexical identity policy, same Voice mapping authority, preserved moving-nucleus boundaries, complete provenance, and no unresolved variant policy
PROPOSED_BRIDGE_VARIANT_CARDINALITY=Lossless one-to-one evidence ledgers on both sides; no collapse, ranking, or winner
PROPOSED_BRIDGE_NO_SINGLE_WINNER_GUARANTEE=YES
PROPOSED_BRIDGE_FORBIDDEN_CLAIMS=SAME_REPRESENTATION; pronunciation identity; same Gamma; same ZC; lexical or sense identity; semantic equivalence; functional equivalence; historical relation; cognacy; derivation; language superiority; winner
```

## Runtime authority tag decision

```text
AUTHORITY_CONTRACT_REQUIRES_RUNTIME_AUTHORITY_TAG=YES
AUTHORIZED_RUNTIME_AUTHORITY_TAG=CMUDICT_CANDIDATE_TO_PRODUCTION_SPOKEN_DOMAIN_COMPATIBILITY_AUTHORITY_V0_1
RUNTIME_AUTHORITY_TAG_NOT_REQUIRED_REASON=NOT_APPLICABLE; an exact tag is required because this future bridge would grant a new cross-boundary runtime authority, and the tag names only domain compatibility
```

The tag deliberately does not contain `SAME_REPRESENTATION`, `EQUIVALENCE`,
`IDENTITY`, `FUNCTIONAL`, `SEMANTIC`, `HISTORICAL`, or a winner claim.

## Implementability audit

```text
BRIDGE_IMPLEMENTABLE_FROM_CURRENT_DATA=NO
BRIDGE_REQUIRED_DATA_MISSING=Explicit production-side bridge envelope carrying exact artifact identity, compatible normalization/lexical identity policy, aligned annotation parsing/segmentation semantics, mapping identity/table, bridge status, bridge reason, and the required runtime authority tag
BRIDGE_REQUIRES_UPSTREAM_PRODUCTION_CHANGE=YES
BRIDGE_REQUIRES_CANDIDATE_PROJECTION_CHANGE=NO
BRIDGE_REQUIRES_SOURCE_REPARSE=NO
BRIDGE_REQUIRES_NEW_LOOKUP=NO
BRIDGE_REQUIRES_PROVIDER_EXECUTION=NO
BRIDGE_REQUIRES_NETWORK=NO
```

The candidate source and Voice envelopes already contain the required
candidate-side evidence. The current Heart production envelope does not carry
all of the explicit bridge metadata needed to prove domain compatibility, and
its lookup normalization differs from the candidate no-trim lexical join.
That is an upstream production-contract issue, not permission to change this
lane or to silently weaken the bridge.

## Future bridge conformance test matrix

```text
FUTURE_BRIDGE_TEST_MATRIX_ITEM_COUNT=27
FUTURE_BRIDGE_TEST_NAMES_IN_ORDER=exactSourceAuthority; exactProductionAuthority; exactArtifactIdentity; notationCompatibility; normalizationCompatibility; annotationParsingAlignment; voiceMappingCompatibility; movingNucleusBoundaryPreserved; variantMultiplicityPreserved; duplicatePhysicalVariantsNotCollapsed; provenanceLossless; sourceNullFailsClosed; voiceNullFailsClosed; gammaNullRemainsOptional; zcNullRemainsOptional; unknownRemainsUnknown; malformedInputFailsClosed; tamperedArtifactOrRevisionFailsClosed; tamperedMappingFailsClosed; tamperedRepresentationKindFailsClosed; stressTreatmentPreserved; noWinnerSelection; noAggregation; noSemanticLeakage; noSameRepresentationLeakage; noCrossLanguageLeakage; deterministicDeepFrozenRepeatability
```

The matrix covers the exact source and production contracts, notation and
normalization, Voice and moving-nucleus authority, variant multiplicity and
duplicates, provenance, source/Voice/Gamma/ZC Null, Unknown, malformed input,
tampering, stress, no winner, no aggregate, semantic and `SAME_REPRESENTATION`
firewalls, cross-language isolation, deep freeze, and determinism.

## Authority assessment

```text
REPRESENTATION_BRIDGE_AUTHORITY_ASSESSMENT=DEFENSIBLE
REPRESENTATION_BRIDGE_AUTHORITY_ASSESSMENT_REASON=The repository has a single exact English CMUdict source/profile, reviewed ARPABET-to-Voice mapping, lossless candidate evidence, and a production_spoken Voice path. A narrow bridge can therefore be specified without equating Voice compatibility with identity or function. Runtime implementation is not yet authorized because the production-side envelope and normalization alignment are incomplete.
SAME_REPRESENTATION_AUTHORIZED_BY_THIS_CONTRACT=NO
FUNCTIONAL_EQUIVALENCE_AUTHORIZED_BY_THIS_CONTRACT=NO
SEMANTIC_EQUIVALENCE_AUTHORIZED_BY_THIS_CONTRACT=NO
DISCOVERY_WIRING_AUTHORIZED_BY_THIS_CONTRACT=NO
API_WIRING_AUTHORIZED_BY_THIS_CONTRACT=NO
UI_WIRING_AUTHORIZED_BY_THIS_CONTRACT=NO
NATURAL_POSITIVE_CONTROL_ESTABLISHED=NO
FALSE_NULL_DIAGNOSTIC_DISPOSITION=DEFERRED_PENDING_V0_2_REACHABILITY
TWO_MODE_DESIGN_STATUS=NOT_AUTHORIZED
```

## Next step

```text
NEXT_RECOMMENDED_LANE=DF_RATIFICATION_OF_BRIDGE_AUTHORITY
NEXT_RECOMMENDED_LANE_REASON=The minimum bridge contract is now explicit and defensible, but implementation requires DF ratification and a separately authorized production-side envelope/normalization alignment before any SAME_REPRESENTATION design or runtime wiring
NEXT_RECOMMENDED_LANE_IMPLEMENTATION_REQUIRED=NO
NEXT_ACTION=AWAIT_DF_DECISION
```

This artifact does not select a provider, acquire source data, re-run a
research evaluation, ratify `SAME_REPRESENTATION`, or authorize a positive
control.
