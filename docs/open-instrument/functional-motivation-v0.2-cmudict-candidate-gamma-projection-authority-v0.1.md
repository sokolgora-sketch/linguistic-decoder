# OPEN INSTRUMENT — FUNCTIONAL MOTIVATION v0.2 CMUDICT CANDIDATE GAMMA PROJECTION AUTHORITY CONTRACT v0.1

Status: `ADVISORY_PENDING_DF_RATIFICATION`.

This is an authority-contract lane only. It does not implement candidate Gamma,
change runtime code, wire Discovery/API/UI, authorize ZC, authorize a
representation bridge, authorize `SAME_REPRESENTATION`, establish a natural
v0.2 positive control, resume the false-Null diagnostic, expose two-mode
behavior, touch Albanian, repair profile-identity divergence, or reopen S5.

```text
REPOSITORY=sokolgora-sketch/linguistic-decoder
VOICE_CORRECTIVE_BASELINE=a9b670be93a81297a4436f3c72c949b00b102972
CANDIDATE_GAMMA_PROJECTION_AUTHORITY=NOT_AUTHORIZED
CANDIDATE_ZC_PROJECTION_AUTHORITY=NOT_AUTHORIZED
REPRESENTATION_BRIDGE_AUTHORITY=NOT_AUTHORIZED
SAME_REPRESENTATION_AUTHORIZED_NOW=NO
PRODUCTION_SPOKEN_COMPARABILITY_AUTHORIZED=NO
NATURAL_V0_2_POSITIVE_CONTROL_ESTABLISHED=NO
FALSE_NULL_DIAGNOSTIC_DISPOSITION=DEFERRED_PENDING_V0_2_REACHABILITY
TWO_MODE_DESIGN_STATUS=NOT_AUTHORIZED
```

## Authority artifacts inspected

```text
GAMMA_DEFINITION_SOURCE_FILES=docs/open-instrument/consonantal-configuration-authority-v0.1.md;docs/open-instrument/functional-motivation-v0.2-representation-authority-contract-v0.1.md;src/shared/openInstrument/motivationEngineDiscovery.v0_1.ts
GAMMA_IMPLEMENTATION_FILES=src/shared/openInstrument/motivationEngineDiscovery.v0_1.ts;src/shared/openInstrument/multilingualDiscoverySubstrateS3.v0_2.ts
GAMMA_RELEVANT_TEST_FILES=tests/openInstrument.motivationEngineDiscovery.v0_1.spec.ts;tests/openInstrument.pronunciationToVoice.v0_1.spec.ts;tests/openInstrument.cmudictCandidateVoiceProjection.v0_1.spec.ts;tests/openInstrument.functionalMotivationInterpretation.v0_2.spec.ts;tests/zZeroConsonantalStructuralComposition.contract.v0_1.spec.ts
REPRESENTATION_AUTHORITY_SOURCE=docs/open-instrument/functional-motivation-v0.2-representation-authority-contract-v0.1.md
CANDIDATE_PRONUNCIATION_AUTHORITY_SOURCE=docs/open-instrument/functional-motivation-v0.2-cmudict-candidate-source-adapter-contract-v0.1.md;src/shared/openInstrument/cmudictCandidateSourceAdapter.v0_1.ts
CANDIDATE_VOICE_AUTHORITY_SOURCE=docs/open-instrument/functional-motivation-v0.2-cmudict-candidate-voice-projection-authority-v0.1.md;src/shared/openInstrument/cmudictCandidateVoiceProjection.v0_1.ts
ZC_AUTHORITY_SOURCE=docs/open-instrument/zero-consonantal-structural-composition-v0.1.md;src/shared/openInstrument/zeroConsonantalStructuralComposition.v0_1.ts
MOVING_NUCLEUS_AUTHORITY_SOURCE=docs/open-instrument/moving-nucleus-canonicalization-contract-v0.1.md;docs/open-instrument/moving-nucleus-observation-authority-contract-v0.1.md;src/shared/openInstrument/movingNucleusCanonicalization.v0_1.ts;src/shared/openInstrument/movingNucleusObservationAuthority.v0_1.ts
```

The candidate source adapter is ratified and preserves every physical CMUdict
source-evidence record. The candidate Voice implementation is ratified and
corrected. Neither authority automatically grants candidate Gamma authority.

## Current Gamma doctrine from repository truth

```text
CURRENT_GAMMA_DEFINITION_VERBATIM="the smallest deterministic structural representation of pronunciation-derived consonantal configuration relative to the existing canonical spoken Voice path"
CURRENT_GAMMA_STRUCTURAL_TYPE_VERBATIM=gamma: Readonly<{ status: "source_pronunciation" | "profile_derived" | "NULL"; orderedUnits: readonly string[]; reason: string | null; }>;
CURRENT_GAMMA_INPUT_CONTRACT_VERBATIM="The only admissible input is a defined variant of the existing PronunciationToVoiceResultV0_1 produced by the bundled CMUdict-derived profile: sourceProfileId=open-instrument.cmudict-arpabet-en-us.v0_1; sourceNotation=ARPABET."
CURRENT_GAMMA_OUTPUT_CONTRACT_VERBATIM="For each defined pronunciation variant, the conceptual configuration contains only existing source-bound values and deterministic source-order relations: variantId; variantOrder; sourceProfileId; sourceNotation; sourceRevision; sourceSegments; sourceNuclei; canonicalVoiceEvents; consonantRegions."
CURRENT_GAMMA_DETERMINISM_RULE_VERBATIM="The same authoritative input and the same frozen source-order rules produce the same configuration and signature."
```

The frozen structural vocabulary is source-relative:

- `SOURCE_PREFIX_REGION` contains ordered consonant segments before the first
  source nucleus.
- `SOURCE_INTER_NUCLEUS_REGION` contains ordered consonant segments between
  adjacent source nuclei, keyed by source nucleus indices.
- `SOURCE_SUFFIX_REGION` contains ordered consonant segments after the final
  source nucleus.

Empty regions are valid. Repeated consonant source units remain repeated and
ordered. The contract explicitly excludes onset, coda, syllable, cluster,
place, manner, voicing, and sonority claims.

## Spoken Gamma versus profile-derived Gamma

```text
SPOKEN_GAMMA_CURRENT_SOURCE_AUTHORITY=Defined spokenPronunciation from HeartInstrumentV1, produced by the authorized bundled CMUdict ARPAbet en-US pronunciation profile and its normalized source segments/nuclei/canonical Voice events.
PROFILE_DERIVED_GAMMA_CURRENT_SOURCE_AUTHORITY=profileDerivedGamma reads analysis.consonants.field.slots[].ch under the Albanian profile-derived structural path; the representation contract permits this only when actual compatible Albanian profile identity and its profile contract are validated.
SPOKEN_AND_PROFILE_GAMMA_SAME_AUTHORITY=NO
PROFILE_DERIVED_GAMMA_REUSABLE_FOR_CANDIDATE_SPOKEN_GAMMA=NO
PROFILE_DERIVED_GAMMA_REUSE_REASON=It is a separate non-spoken profile representation, does not consume authorized candidate pronunciation evidence, and cannot establish production spoken comparability or SAME_REPRESENTATION. The current language-only caller branch is not sufficient proof of actual compatible profile identity.
PROFILE_IDENTITY_DIVERGENCE_IN_SCOPE=NO
```

Candidate spoken Gamma must derive from the candidate's authorized CMUdict
pronunciation evidence. Profile-derived Albanian Gamma is not imported into
this lane.

## Existing Gamma paths

```text
EXISTING_GAMMA_PROJECTORS=spokenGamma(heart: HeartInstrumentV1) in src/shared/openInstrument/motivationEngineDiscovery.v0_1.ts; profileDerivedGamma(analysis: AnalyzeWordResultV1) in the same file; gammaForHeartV0_2(heart: ReturnType<typeof buildHeartInstrumentV1>) in src/shared/openInstrument/multilingualDiscoverySubstrateS3.v0_2.ts
EXISTING_SPOKEN_GAMMA_PROJECTOR=spokenGamma
EXISTING_SPOKEN_GAMMA_PROJECTOR_SIGNATURE=spokenGamma(heart: HeartInstrumentV1): { status: "NULL" | "source_pronunciation"; orderedUnits: string[]; reason: string | null }
EXISTING_SPOKEN_GAMMA_PROJECTOR_INPUT_DEPENDENCIES=heart.spokenPronunciation.status; heart.spokenPronunciation.variants[].normalizedSegments[].kind; heart.spokenPronunciation.variants[].normalizedSegments[].sourceUnits
EXISTING_SPOKEN_GAMMA_PROJECTOR_INTERNAL_CALLS=No external calls; it checks defined pronunciation, flatMaps retained variants, filters kind="consonant", and flatMaps exact sourceUnits.
EXISTING_SPOKEN_GAMMA_PROJECTOR_SIDE_EFFECTS=None; pure allocation only.
EXISTING_SPOKEN_GAMMA_PROJECTOR_REUSABLE_WITHOUT_AUTHORITY_EXPANSION=NO
```

`spokenGamma` does not consult lexical spelling, semantic information, or
source lookup. Normalization and pronunciation resolution happen upstream in
`buildHeartInstrumentV1`. It does not invoke ZC or create representation
comparability state. It does not rank or select a variant, but its `flatMap`
over all retained variants produces one flattened output and therefore is not a
candidate per-variant Gamma projector.

`profileDerivedGamma` has signature
`profileDerivedGamma(analysis: AnalyzeWordResultV1)`; it reads profile-derived
consonant slots, requires neither pronunciation nor Voice, and performs no
lookup or normalization. Its authority is profile-only and separate.

`gammaForHeartV0_2` repeats the spoken flat consonant extraction in the S3
diagnostic path. It is a diagnostic helper, not candidate authority and not a
reviewed reusable candidate projector.

No current reviewed reusable spoken candidate Gamma mechanism exists.

## Proposed candidate Gamma input

```text
PROPOSED_CANDIDATE_GAMMA_INPUT=One defined candidate Voice projection variant together with its unchanged candidate source-evidence reference, using the existing normalizedSegments, nuclei, canonicalVoicePath, variantId, variantOrder, sourceProfileId, sourceNotation, and sourceRevision fields. The source evidence remains the provenance authority; the shared normalized pronunciation structure supplies source-order segmentation.
PROPOSED_CANDIDATE_GAMMA_REQUIRED_FIELDS=candidateId; candidate source-evidence reference; exact physical source locator; sourceProfileId; sourceNotation; sourceRevision; source artifact identity; variantId; variantOrder; normalizedSegments in segmentIndex order; nuclei in nucleusIndex order; matching source segment indices; canonicalVoicePath; candidate Voice mapping identity; defined/null status and exact upstream reason.
PROPOSED_CANDIDATE_GAMMA_FORBIDDEN_INPUTS=lexical spelling; orthographic consonants; gloss; POS; sense selection; semantic or functional evidence; target word meaning; etymology; cognacy; borrowing; morphology; historical relation; language label without source authority; profile-derived Albanian consonant slots; fuzzy matching; source fallback; ranking; variant winner; ZC; representation bridge; SAME_REPRESENTATION.
CANDIDATE_VOICE_PATH_ALONE_SUFFICIENT_FOR_GAMMA=NO
RAW_ARPABET_REQUIRED_FOR_GAMMA=NO_DIRECT_REPARSE;YES_AS_PRESERVED_SOURCE_PROVENANCE
VOICE_PROJECTION_REQUIRED_FOR_GAMMA=YES_AS_THE_ALREADY_RATIFIED_PER_VARIANT_STRUCTURE_AND_CANONICAL_ANCHOR_BOUNDARY
SHARED_PRONUNCIATION_STRUCTURE_REQUIRED_FOR_GAMMA=YES
```

Voice alone contains vowel-nucleus events and does not contain enough
consonantal source position or identity information. The smallest sufficient
input is the existing candidate Voice per-variant structure plus its source
evidence, not a new raw-token parser and not the flattened Voice path.

## Consonant identity and structural boundary

```text
GAMMA_CONSONANT_IDENTITY_POLICY=Retain exact existing sourceUnits arrays from authorized normalized consonant segments; do not transliterate, split, rename, classify, or map them to semantic or phonological classes.
GAMMA_CONSONANT_ORDER_POLICY=Preserve normalizedSegments.segmentIndex source order; preserve order within each sourceUnits array and preserve duplicate physical segments.
GAMMA_POSITION_POLICY=Use source-relative prefix, source-inter-nucleus, and suffix regions anchored to source nuclei and source segment indices; do not use canonical Voice-event indices as source positions.
GAMMA_NUCLEUS_BOUNDARY_POLICY=Use existing source nuclei and their matching normalized source segment indices; source nuclei are not expanded canonical Voice events.
GAMMA_REPEATED_CONSONANT_POLICY=Retain every repeated segment and exact identity; recurrence may be represented structurally by exact source identity and source positions, never collapsed or semantically interpreted.
GAMMA_CONSONANT_SEMANTIC_AUTHORITY=NO
```

## Moving nucleus

```text
GAMMA_MOVING_NUCLEUS_INPUT_BEHAVIOR=Consume the one existing moving_nucleus source segment and its one source nucleus; retain its ordered canonical Voice anchors only as existing derived structure.
GAMMA_MOVING_NUCLEUS_SEGMENTATION_RULE=Source nuclei, not expanded canonical Voice events, define consonantal regions. OW -> [O,U], AY -> [A,I], EY -> [E,I], OY -> [O,I], and AW -> [A,U] remain two ordered Voice events from one source nucleus.
GAMMA_ARTIFICIAL_INTER_REGION_CREATED=NO
```

A moving nucleus does not create an artificial consonantal inter-region between
its two Voice events and does not become two spoken nuclei.

## Stress

```text
EXISTING_GAMMA_STRESS_BEHAVIOR=The spoken Gamma filter ignores stress for consonant configuration. Existing pronunciation normalization retains stress on source vowel/nucleus metadata; stress does not create a Voice event or consonant unit.
PROPOSED_CANDIDATE_GAMMA_STRESS_BEHAVIOR=Preserve stress-bearing raw tokens and normalized stress metadata in the source-evidence/provenance chain, but exclude stress from Gamma identity, region counts, recurrence identity, and semantic interpretation.
STRESS_CHANGES_GAMMA_IDENTITY=NO
STRESS_SEMANTIC_AUTHORITY=NO
```

## Variant cardinality

```text
PROPOSED_CANDIDATE_GAMMA_VARIANT_CARDINALITY=N defined candidate pronunciation source variants produce N independently traceable Gamma projection results.
PROPOSED_IDENTICAL_GAMMA_VARIANT_POLICY=Retain identical Gamma outputs as distinct per-variant records with their source variant IDs, orders, locators, and provenance; do not collapse identical outputs.
GAMMA_VARIANT_WINNER_SELECTION=NO
SOURCE_VARIANT_IDENTITY_PRESERVED=YES
NO_SINGLE_WINNER_PRESERVED=YES
CANDIDATE_LEVEL_AGGREGATE_GAMMA_AUTHORIZED=NO
```

An unresolved or ambiguous top-level source result remains top-level Null; no
variant is selected by this contract.

## Provenance

```text
PROPOSED_CANDIDATE_GAMMA_PROVENANCE_CHAIN=candidate -> candidate source-evidence envelope -> exact physical CMUdict record -> exact artifact/profile/revision/notation/bytes/SHA-256 and locator -> exact raw ARPABET tokens retained as source fact -> validated normalizedSegments and source nuclei -> reviewed candidate Voice per-variant record and mapping identity -> derived per-variant Gamma.
PROPOSED_GAMMA_PROJECTOR_IDENTITY=open-instrument.cmudict-candidate-gamma-projection.v0_1
PROPOSED_GAMMA_PROJECTOR_VERSION_FIELD=schemaVersion=open-instrument.cmudict-candidate-gamma-projection.v0_1; projectorId; sourceProfileId; sourceNotation; sourceRevision; mappingId=pronunciation-to-voice.open-instrument.cmudict-arpabet-en-us.v0_1.v0_1; configurationAuthority=OPEN_INSTRUMENT_CONSONANTAL_CONFIGURATION_AUTHORITY_V0_1
PROPOSED_GAMMA_SOURCE_EVIDENCE_REFERENCE_FIELDS=candidateId; candidateSourceId; candidateSourceFamilyId; candidateSourceRecordId; candidateSourceForm; candidateJoinKey; sourceProfileId; sourceRevision; sourceNotation; sourceArtifactBytes; sourceArtifactSha256; sourceLineNumber; rawSourceLine; sourceForm; baseSourceForm; variantId; variantOrder; rawPronunciation; orderedRawArpabetTokens; losslessBaseStressViews; opaqueAnnotationText; authorityStatus
```

No provenance field is a semantic claim, and no provenance record may be
collapsed because two derived Gamma values are equal.

## Null and unknown contract

The current spoken helper returns `SPOKEN_PRONUNCIATION_UNAVAILABLE` when the
spoken pronunciation result is not defined. The separate profile helper returns
`CONSONANT_FIELD_NOT_EMITTED` when no profile consonant slots are emitted. The
frozen consonantal-configuration contract preserves Null for
`PRONUNCIATION_NOT_FOUND`, `PRONUNCIATION_VARIANT_AMBIGUOUS`, unsupported vowel
categories, unresolved spoken-nucleus structure, and missing Voice-family or
moving-nucleus authority.

```text
EXISTING_GAMMA_NULL_TAXONOMY_VERBATIM=SPOKEN_PRONUNCIATION_UNAVAILABLE; CONSONANT_FIELD_NOT_EMITTED; PRONUNCIATION_NOT_FOUND; PRONUNCIATION_VARIANT_AMBIGUOUS; PRONUNCIATION_VOWEL_CATEGORY_UNSUPPORTED; SPOKEN_NUCLEUS_STRUCTURE_UNRESOLVED; VOICE_FAMILY_AUTHORITY_MISSING; MOVING_NUCLEUS_AUTHORITY_MISSING
PROPOSED_CANDIDATE_GAMMA_NULL_TAXONOMY_VERBATIM=Propagate the exact candidate source-evidence or candidate Voice reason without rewriting it; add CMUDICT_CANDIDATE_GAMMA_PROJECTION_UNAUTHORIZED only when the candidate Gamma authority gate is absent; add CMUDICT_CANDIDATE_GAMMA_PROJECTION_INVARIANT_VIOLATION only when required normalizedSegments/nuclei/source-index/mapping identity invariants disagree; use existing source/projection reasons for missing, malformed, unsupported, unresolved, or mismatched upstream evidence.
SOURCE_NULL_PROPAGATION_POLICY=Source-evidence Null remains Null and retains its exact reason; no Gamma projection is attempted and no failed variant is silently omitted.
VOICE_NULL_INTERACTION_POLICY=A candidate Voice Null prevents Gamma derivation for that variant; preserve the exact Voice/source reason and do not replace it with a generic Gamma success or empty value.
NULL_REMAINS_VALID=YES
UNKNOWN_REMAINS_DISTINCT_FROM_NULL=YES
ZERO_CONSONANT_PRONUNCIATION_VALID_GAMMA=YES
ZERO_CONSONANT_GAMMA_REPRESENTATION=Defined source-pronunciation Gamma with ordered consonant units=[]; in the richer source-order configuration, P=0, every inter-nucleus count is zero, S=0, and R=[]; this is not Null and is not a ZC zero vector.
```

The two candidate-specific reason codes above are proposed, not implemented.
They are required only to distinguish a missing candidate Gamma authority gate
from a structural invariant failure while preserving all upstream reasons.

## Determinism contract

```text
PROPOSED_CANDIDATE_GAMMA_DETERMINISM_CONTRACT=Accept only a defined, identity-validated candidate source-evidence variant with the ratified CMUdict profile, ARPABET notation, revision, artifact identity, and candidate Voice projection; preserve physical source variant order and exact variantId/variantOrder; use normalizedSegments.segmentIndex order and nuclei.nucleusIndex order; derive prefix, inter-nucleus, and suffix regions from source nuclei rather than canonical Voice-event indices; retain exact sourceUnits, duplicate physical records, repeated consonants, source locators, raw tokens, and stress metadata; treat moving nuclei as one source nucleus with ordered Voice events and no artificial inter-region; return the same result for the same authorized input; use no locale-dependent ordering, random behavior, lookup, normalization beyond the already-ratified upstream contracts, spelling fallback, semantic ranking, variant winner, aggregation, ZC, representation bridge, or consonant meaning; deep-freeze the future result and preserve explicit Null/Unknown distinctions.
```

## ZC firewall

```text
GAMMA_OUTPUT_IS_ZC=NO
ZC_DERIVABLE_ONLY_AFTER_SEPARATE_AUTHORITY=YES
CANDIDATE_ZC_PROJECTION_AUTHORITY=NOT_AUTHORIZED
PROPOSED_GAMMA_OUTPUT_CONTAINS_ZC_FIELDS=NO
```

The existing ZC contract consumes Gamma and defines the lossy structural
projection `ZC_v0_1(Γ)=<P,I,S,D,A,R>`. Candidate Gamma authority would not
authorize that downstream projection.

## Representation, semantic, and cache firewalls

```text
REPRESENTATION_BRIDGE_AUTHORITY=NOT_AUTHORIZED
SAME_REPRESENTATION_AUTHORIZED_NOW=NO
CANDIDATE_GAMMA_IMPLIES_SAME_REPRESENTATION=NO
PRODUCTION_SPOKEN_COMPARABILITY_AUTHORIZED_BY_THIS_LANE=NO
GAMMA_SEMANTIC_AUTHORITY=NO
CONSONANT_SEMANTIC_AUTHORITY=NO
SEMANTIC_DISAMBIGUATION_USED=NO
FUNCTIONAL_INTERPRETATION_AUTHORITY=NOT_AUTHORIZED_BY_THIS_LANE
GAMMA_PROJECTION_AUTHORITY_REQUIRES_CACHE=NO
CACHE_IMPLEMENTATION_AUTHORIZED_NOW=NO
FUTURE_BATCH_CACHE_CONSIDERATION=DEFERRED_TO_SEPARATELY_AUTHORIZED_BATCH_LANE
```

Gamma describes source-bounded consonantal structure only. It asserts no
lexical meaning, functional meaning, embryo, morphology, etymology, cognacy,
borrowing, history, or language ancestry.

## Smallest future implementation surface

```text
PROPOSED_CANDIDATE_GAMMA_IMPLEMENTATION_FILES=src/shared/openInstrument/cmudictCandidateGammaProjection.v0_1.ts;tests/openInstrument.cmudictCandidateGammaProjection.v0_1.spec.ts
PROPOSED_CANDIDATE_GAMMA_NEW_TYPES=CmuDictCandidateGammaProjectionV0_1;CmuDictCandidateGammaProjectionVariantV0_1;CmuDictCandidateGammaReasonCodeV0_1;CmuDictCandidateGammaConsonantRegionV0_1
PROPOSED_CANDIDATE_GAMMA_REUSED_FUNCTIONS=No existing Gamma projector reused directly; consume the already-ratified candidate Voice variant structure and existing normalizedSegments/nuclei fields; reuse no input lookup or source parser.
PROPOSED_CANDIDATE_GAMMA_FORBIDDEN_REUSE=spokenGamma;gammaForHeartV0_2;profileDerivedGamma;deriveZeroConsonantalStructuralCompositionV0_1;any ZC projector;resolveCmuDictPronunciationToVoiceV0_1 direct lookup;candidate lookup/ranking/winner selection;spelling or morphology normalization;semantic or representation comparison.
PROPOSED_CANDIDATE_GAMMA_TEST_FILES=tests/openInstrument.cmudictCandidateGammaProjection.v0_1.spec.ts plus unchanged candidate source adapter, candidate Voice, pronunciation-to-Voice, moving-nucleus, and ZC contract suites.
PROPOSED_CANDIDATE_GAMMA_TEST_MATRIX=single monophthong with prefix/suffix; multiple source nuclei with zero and nonzero inter-regions; moving OW/AY/EY/OY/AW with no artificial inter-region; repeated consonant identity and source positions; duplicate physical source records; identical Gamma outputs retained separately; source variant order; stress 0/1/2 invariance; zero-consonant defined pronunciation; unsupported token; malformed evidence; unresolved provenance; source Null propagation; Voice Null interaction; projector identity mismatch; mapping/profile/revision/artifact mismatch; deep freeze; deterministic repeatability; no spelling/gloss/semantic/lookup fallback; no ZC/bridge/SAME_REPRESENTATION fields; no winner or aggregate.
```

The current `spokenGamma` helper is not directly reusable because it flattens
all variants into one ordered string array and emits neither source regions nor
per-variant provenance. Reuse would require an authority-expanding production
change, so this lane proposes a new isolated future projector instead.

## Architectural assessment and recommendation

```text
CMUDICT_CANDIDATE_GAMMA_PROJECTION_ARCHITECTURAL_ASSESSMENT=DEFENSIBLE
CMUDICT_CANDIDATE_GAMMA_PROJECTION_ARCHITECTURAL_ASSESSMENT_REASON=The repository already freezes a source-bounded consonantal-configuration contract over authorized normalized CMUdict pronunciation segments, source nuclei, canonical Voice anchors, source order, exact sourceUnits, and variant provenance. The ratified candidate Voice output preserves the same per-variant normalized structure and source evidence. A separate candidate Gamma projector can therefore derive the same source-relative prefix/inter-nucleus/suffix configuration independently per variant without importing profile-derived authority, adding semantic meaning, collapsing variants, invoking ZC, or establishing representation comparability. The existing flat spoken helper is not reused because it loses the required region and per-variant boundaries.
CMUDICT_CANDIDATE_GAMMA_PROJECTION_RECOMMENDATION=RECOMMEND_AUTHORIZE
CANDIDATE_GAMMA_PROJECTION_AUTHORITY_NOW=NO
DF_CANDIDATE_GAMMA_PROJECTION_RATIFICATION_REQUIRED=YES
MERGING_THIS_ARTIFACT_DOES_NOT_AUTHORIZE_CANDIDATE_GAMMA_PROJECTION=YES
```

The recommendation is conditional on a later DF ratification and a separate
implementation lane. This document does not implement or activate Gamma.

## Scope and lifecycle boundary

```text
AUTHORITY_ARTIFACT=docs/open-instrument/functional-motivation-v0.2-cmudict-candidate-gamma-projection-authority-v0.1.md
AUTHORITY_ARTIFACT_SHA256=325629517bfedccfe1b68a407e2f0cb87ead5b72a1d966af02a929acde5f3751
FINAL_CHANGED_FILE_COUNT=1
PRODUCTION_CODE_CHANGED=NO
TEST_BEHAVIOR_CHANGED=NO
SOURCE_DATA_CHANGED=NO
DISCOVERY_WIRING_CHANGED=NO
API_WIRING_CHANGED=NO
UI_WIRING_CHANGED=NO
GAMMA_IMPLEMENTATION_CHANGED=NO
ZC_IMPLEMENTATION_CHANGED=NO
REPRESENTATION_BRIDGE_CHANGED=NO
ALBANIAN_PATH_IN_SCOPE=NO
S5_IN_SCOPE=NO
FALSE_NULL_EXECUTED=NO
TWO_MODE_SURFACED=NO
```

The artifact checksum is defined over the final file bytes with the value on
its own `AUTHORITY_ARTIFACT_SHA256=` line blank. The exact branch, commit, PR,
CI, review, merge, Linear, and DF_BRAIN evidence is recorded in the final
closeout report and must not be inferred from this contract before verification.

```text
NEXT_RECOMMENDED_LANE=CMUDICT_CANDIDATE_GAMMA_PROJECTION_DF_RATIFICATION
NEXT_ACTION=AWAIT_DF_DECISION
FINAL_CLASSIFICATION=CMUDICT_CANDIDATE_GAMMA_PROJECTION_RECOMMENDED_PENDING_DF_RATIFICATION
```
