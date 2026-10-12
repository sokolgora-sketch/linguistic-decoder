# OPEN INSTRUMENT — FUNCTIONAL MOTIVATION v0.2 CMUDICT CANDIDATE VOICE PROJECTION AUTHORITY v0.1

## Status and decision boundary

```text
STATUS=ADVISORY_PENDING_DF_RATIFICATION
CMUDICT_CANDIDATE_VOICE_PROJECTION_AUTHORITY_NOW=NO
DF_CANDIDATE_VOICE_PROJECTION_RATIFICATION_REQUIRED=YES
MERGING_THIS_ARTIFACT_DOES_NOT_AUTHORIZE_CANDIDATE_VOICE_PROJECTION=YES
```

This artifact assesses projection authority only. It does not implement or
wire candidate Voice projection, authorize Gamma, authorize ZC, authorize a
representation bridge, establish `SAME_REPRESENTATION`, or create a natural
v0.2 positive control.

## Repository truth and active authority

```text
REPOSITORY=sokolgora-sketch/linguistic-decoder
MAIN_HEAD_BEFORE=51efd87e0ad59e801064ec7dead9391744d012fd
ORIGIN_MAIN_BEFORE=51efd87e0ad59e801064ec7dead9391744d012fd
DIVERGENCE_BEFORE=0/0
WORKTREE_BEFORE=CLEAN
HISTORICAL_S5_BRANCH=codex/s5-sanskrit-gloss-contract-resolution-v0-1
HISTORICAL_S5_HEAD=6d5bf985f1ca2763b8d41f3d4fa0735d689a1c30

CMUDICT_SOURCE_FAMILY=RATIFIED
CMUDICT_CANDIDATE_SOURCE_PRONUNCIATION_ROLE=RATIFIED
CMUDICT_CANDIDATE_ARPABET_NOTATION=RATIFIED
CMUDICT_CANDIDATE_SEPARATE_PRONUNCIATION_NORMALIZATION=NOT_REQUIRED
CMUDICT_CANDIDATE_SOURCE_ADAPTER_IMPLEMENTATION=RATIFIED_AND_IMPLEMENTED
CMUDICT_CANDIDATE_ADAPTER_PATH=src/shared/openInstrument/cmudictCandidateSourceAdapter.v0_1.ts
CMUDICT_CANDIDATE_ADAPTER_TEST=tests/openInstrument.cmudictCandidateSourceAdapter.v0_1.spec.ts
CMUDICT_CANDIDATE_ADAPTER_STATUS=SOURCE_EVIDENCE_ONLY; UNWIRED_FROM_DISCOVERY; UNWIRED_FROM_API; UNWIRED_FROM_UI; UNWIRED_FROM_FUNCTIONAL_INTERPRETATION

CANDIDATE_VOICE_PROJECTION_AUTHORITY=NOT_AUTHORIZED
CANDIDATE_GAMMA_PROJECTION_AUTHORITY=NOT_AUTHORIZED
CANDIDATE_ZC_PROJECTION_AUTHORITY=NOT_AUTHORIZED
REPRESENTATION_BRIDGE_AUTHORITY=NOT_AUTHORIZED
SAME_REPRESENTATION_AUTHORIZED_NOW=NO
NATURAL_V0_2_POSITIVE_CONTROL_ESTABLISHED=NO
```

The CMUdict artifact is the frozen English source:

```text
SOURCE_PATH=src/data/openInstrument/pronunciation/cmudict.dict
SOURCE_PROFILE_ID=open-instrument.cmudict-arpabet-en-us.v0_1
SOURCE_REVISION=74790861f652b15e4ac49015a90074ad62a27690
SOURCE_NOTATION=ARPABET
SOURCE_BYTES=3618488
SOURCE_SHA256=81917843c7f44ce2b094ac63873c2c7a4cf802040792c455ba3ca406891c3d22
```

The candidate adapter preserves source records, physical source locators,
raw ARPAbet tokens, variant identity/order, artifact identity, and candidate
provenance. It intentionally emits no Voice, Gamma, ZC, representation, or
semantic fields.

## Load-bearing repository conclusions

The following existing files and functions were inspected:

```text
AUTHORITY_CONTRACT=docs/open-instrument/pronunciation-to-voice-authority-contract-v0.1.md
REPRESENTATION_CONTRACT=docs/open-instrument/functional-motivation-v0.2-representation-authority-contract-v0.1.md
SOURCE_CONTRACT=docs/open-instrument/functional-motivation-v0.2-pronunciation-source-contract-v0.1.md
CANDIDATE_ROLE_CONTRACT=docs/open-instrument/functional-motivation-v0.2-cmudict-candidate-role-authority-v0.1.md
CANDIDATE_NOTATION_CONTRACT=docs/open-instrument/functional-motivation-v0.2-cmudict-candidate-notation-normalization-authority-v0.1.md
CANDIDATE_ADAPTER_CONTRACT=docs/open-instrument/functional-motivation-v0.2-cmudict-candidate-source-adapter-contract-v0.1.md
CANDIDATE_ADAPTER=src/shared/openInstrument/cmudictCandidateSourceAdapter.v0_1.ts
INPUT_SOURCE_PROFILE=src/shared/openInstrument/cmudictArpabetPronunciation.v0_1.ts
INPUT_VOICE_MAPPING=src/shared/openInstrument/pronunciationToVoice.v0_1.ts
MOVING_NUCLEUS_AUTHORITY=src/shared/openInstrument/movingNucleusObservationAuthority.v0_1.ts
MOVING_NUCLEUS_CANONICALIZER=src/shared/openInstrument/movingNucleusCanonicalization.v0_1.ts
```

The existing mapping contains the complete frozen CMUdict vowel table. Its
moving categories use the existing observation validator and canonicalizer;
its monophthong categories emit one Voice-family anchor. Stress is retained in
segment/nucleus metadata and does not affect the Voice path. The resolver also
preserves variants and fails closed for unsupported, ambiguous, or unresolved
authority.

The candidate adapter is source-evidence-only and exposes
`orderedRawArpabetTokens`, lossless base/stress views, raw pronunciation,
variant identity/order, exact source line, source line number, source profile,
revision, notation, artifact bytes/hash, and candidate provenance. It does not
call the input-role lookup or Voice resolver.

## Central architectural assessment

```text
CMUDICT_CANDIDATE_VOICE_PROJECTION_ARCHITECTURAL_ASSESSMENT=DEFENSIBLE
CMUDICT_CANDIDATE_VOICE_PROJECTION_ARCHITECTURAL_ASSESSMENT_REASON=The candidate adapter now supplies ratified, identity-bound CMUdict source evidence whose ordered raw ARPAbet tokens use the same frozen English CMUdict notation and source profile as the reviewed input mapping. The existing ARPAbet-to-Seven-Voice table and moving-nucleus canonicalizer can be reused as deterministic projection mechanisms without a new notation interpretation, normalization rule, semantic selector, or mapping table, provided a future implementation first validates candidate evidence authority and projects each evidence variant independently. This is mechanism compatibility only; the existing input-role invocation authority does not automatically extend to candidate records, so DF must separately ratify candidate Voice projection before implementation.
```

The assessment is projection-only. It does not claim that a candidate Voice
path establishes a representation bridge, spoken comparability, Gamma, ZC,
functional interpretation, etymology, cognacy, or historical relation.

## Input-role versus candidate-role authority

```text
EXISTING_ARPABET_TO_VOICE_MAPPING_AUTHORIZED=YES
EXISTING_MAPPING_AUTHORITY_SCOPE=Reviewed Open Instrument mapping for the frozen CMUdict ARPAbet English input pronunciation profile; complete frozen vowel inventory; source-profile-scoped Voice-family anchors; existing moving-nucleus observation validation and canonicalization.
EXISTING_INPUT_ROLE_INVOCATION_AUTHORIZED=YES
EXISTING_CANDIDATE_ROLE_INVOCATION_AUTHORIZED=NO
CANDIDATE_ROLE_REQUIRES_SEPARATE_DF_AUTHORITY=YES
EXISTING_MAPPING_REUSABLE_WITHOUT_SEMANTIC_CHANGE=YES — as a projection mechanism only, after separate candidate Voice ratification and evidence validation
EXISTING_MAPPING_REUSE_REASON=Candidate evidence carries the same ratified source profile, ARPAbet notation, raw token order, stress metadata, source revision, and artifact identity. Reusing the exact table and canonicalizer preserves the existing symbolic mapping and spoken-first moving-nucleus behavior. It does not import input lookup authority, candidate eligibility, semantic meaning, or representation comparability.
```

The existing input path authorizes `CMUdict pronunciation -> normalized
segments/nuclei -> Voice-family path`. The candidate path currently authorizes
only `existing lexical candidate -> CMUdict source evidence`. The missing
stage is candidate-role projection authority.

## Exact proposed projection input

```text
PROPOSED_CANDIDATE_VOICE_PROJECTION_INPUT=Each defined candidate source-evidence variant's orderedRawArpabetTokens, after validating the candidate evidence envelope, exact artifact identity, source profile, source revision, notation, source locator, and authorityStatus=RATIFIED_SOURCE_EVIDENCE_ONLY.
PROPOSED_CANDIDATE_VOICE_PROJECTION_REQUIRED_FIELDS=candidate evidence status=defined; candidateId and source identity; sourceProfileId; sourceRevision; sourceNotation=ARPABET; sourceArtifactBytes; sourceArtifactSha256; sourceLineNumber; rawSourceLine; rawPronunciation; orderedRawArpabetTokens; losslessBaseStressViews; variantId; variantOrder; candidate provenance; explicit candidate Voice projection authority.
PROPOSED_CANDIDATE_VOICE_PROJECTION_FORBIDDEN_INPUTS=gloss; senseId as a selector; POS; functional evidence; target sense; candidate rank; source ranking; variant winner; semantic interpretation; etymology; cognacy; borrowing; spelling correction; fuzzy or phonetic similarity; candidate eligibility mutation; Gamma; ZC; representation bridge; SAME_REPRESENTATION; any source fallback.
```

`rawPronunciation` and `rawSourceLine` remain provenance, not the tokenization
input. `losslessBaseStressViews` remain evidence views, not a new
normalization authority. The ordered raw token sequence is the only proposed
projection input.

## Stress authority

```text
EXISTING_VOICE_MAPPING_STRESS_BEHAVIOR=The existing parser extracts terminal stress 0|1|2 into segment and nucleus metadata. Voice-family lookup uses the parsed base ARPAbet category; stress does not create a Voice event, change a Voice anchor, select a variant, or change the canonical path.
PROPOSED_CANDIDATE_STRESS_BEHAVIOR=Preserve each raw stress-bearing token and its lossless base/stress view through the candidate evidence chain; pass the same token to the existing projection mechanism; retain stress as provenance metadata only.
STRESS_CHANGES_VOICE_IDENTITY=NO
STRESS_SEMANTIC_AUTHORITY=NO
```

No candidate projection may add stress interpretation. A malformed or
unsupported stress form remains Null before projection.

## Mapping identity and moving-nucleus invariant

```text
EXISTING_ARPABET_TO_VOICE_MAPPING_IDENTITY=mappingId=pronunciation-to-voice.open-instrument.cmudict-arpabet-en-us.v0_1.v0_1; table=CMUDICT_ARPABET_VOICE_PROFILE_V0_1; sourceProfileId=open-instrument.cmudict-arpabet-en-us.v0_1; notation=ARPABET; revision=74790861f652b15e4ac49015a90074ad62a27690
PROPOSED_CANDIDATE_MAPPING_IDENTITY=Exactly the existing mapping identity above, with no candidate-specific table, token reinterpretation, or anchor substitution.
MAPPING_BYTES_OR_TABLE_CHANGED=NO
NEW_ARPABET_MAPPING_REQUIRED=NO
MOVING_NUCLEUS_INVARIANT_PRESERVED=YES
ARTIFICIAL_INTER_REGION_INTRODUCED=NO
```

`AW`, `AY`, `EY`, `OW`, and `OY` remain source-atomic moving nuclei. The
existing authority validator preserves one spoken nucleus with two ordered
Voice events, and the existing canonicalizer remains the sole canonicalization
authority. Candidate reuse must call that same mechanism per evidence variant;
it must not create an artificial inter-region or treat the two events as two
spoken nuclei.

## Variant cardinality and provenance

```text
PROPOSED_CANDIDATE_VOICE_VARIANT_CARDINALITY=One independently traceable Voice-projection result per defined candidate source-evidence variant; N physical CMUdict evidence variants produce N per-variant projection results, including duplicate raw records with distinct locators.
PROPOSED_IDENTICAL_VOICE_PATH_VARIANT_POLICY=Retain all N source-evidence and per-variant projection records even when derived Voice paths are identical. An optional aggregate summary may report the common path only if every per-variant record remains recoverable and an explicit future aggregate rule is ratified; identical paths never select or delete a source variant.
VOICE_VARIANT_WINNER_SELECTION=NO
SOURCE_VARIANT_IDENTITY_PRESERVED=YES
NO_SINGLE_WINNER_PRESERVED=YES

PROPOSED_CANDIDATE_VOICE_PROVENANCE_CHAIN=Existing lexical candidate -> candidate source evidence envelope -> exact CMUdict physical source record -> exact artifact profile/revision/bytes/SHA-256/notation -> raw ARPAbet tokens and source locator -> exact reviewed mapping identity -> derived per-variant Voice path. Every derived path must retain the complete preceding chain.
PROPOSED_VOICE_PROJECTION_AUTHORITY_TAG=DERIVED_FROM_RATIFIED_CMUDICT_CANDIDATE_SOURCE_EVIDENCE_VIA_REVIEWED_OPEN_INSTRUMENT_MAPPING_PENDING_DF_RATIFICATION
PROPOSED_VOICE_MAPPING_VERSION_FIELD=mappingId=pronunciation-to-voice.open-instrument.cmudict-arpabet-en-us.v0_1.v0_1; sourceProfileId; sourceNotation; sourceRevision; mapping table identity=CMUDICT_ARPABET_VOICE_PROFILE_V0_1
PROPOSED_SOURCE_EVIDENCE_REFERENCE_FIELDS=candidateId; candidateSourceId; candidateSourceFamilyId; candidateSourceRecordId; candidateSourceForm; candidateJoinKey; sourceProfileId; sourceRevision; sourceNotation; sourceArtifactBytes; sourceArtifactSha256; sourceLineNumber; rawSourceLine; sourceForm; baseSourceForm; variantId; variantOrder; rawPronunciation; orderedRawArpabetTokens; losslessBaseStressViews; opaqueAnnotationText; authorityStatus
```

No derived Voice path may exist without a defined source-evidence variant and
its exact physical record reference.

## Proposed output contract

```text
PROPOSED_CANDIDATE_VOICE_PROJECTION_OUTPUT_RECORD=An immutable candidate-level envelope retaining candidate identity/provenance and an ordered per-variant array. Each per-variant item contains source-evidence references, mapping identity, normalized ARPAbet segments/nuclei, ordered canonical Voice-family events when defined, status, and an exact reasonCode when Null. The envelope distinguishes SOURCE_FACT=CMUdict pronunciation evidence from DERIVED_STRUCTURE=Seven-Voice path. It contains no Gamma, ZC, SAME_REPRESENTATION, representation bridge, functional interpretation, semantic interpretation, etymology, cognacy, historical derivation, ranking, or winner field.
PROPOSED_VOICE_OUTPUT_STATUS_VALUES=defined; null
PROPOSED_VOICE_OUTPUT_AUTHORITY_BOUNDARY=Source evidence remains ratified source fact; a Voice path is derived structure under the existing reviewed mapping only after separate DF candidate Voice projection ratification. A derived Voice path does not authorize spoken comparability, production_spoken, SAME_REPRESENTATION, Gamma, ZC, or functional interpretation.
```

## Failure and Null taxonomy

```text
PROPOSED_CANDIDATE_VOICE_NULL_TAXONOMY=PRONUNCIATION_NOT_FOUND; PRONUNCIATION_JOIN_COLLISION; CMUDICT_SOURCE_LINE_MALFORMED; CMUDICT_ARPABET_TOKEN_UNSUPPORTED; CMUDICT_STRESS_DIGIT_MALFORMED; CMUDICT_SOURCE_ARTIFACT_MISMATCH; CMUDICT_SOURCE_REVISION_MISMATCH; CMUDICT_CANDIDATE_NOTATION_UNAUTHORIZED; CMUDICT_CANDIDATE_AUTHORITY_INVARIANT_VIOLATION; PRONUNCIATION_PROVENANCE_UNRESOLVED; CMUDICT_CANDIDATE_VOICE_PROJECTION_UNAUTHORIZED; VOICE_FAMILY_AUTHORITY_MISSING; MOVING_NUCLEUS_AUTHORITY_MISSING; SPOKEN_NUCLEUS_STRUCTURE_UNRESOLVED; PRONUNCIATION_VARIANT_AMBIGUOUS; CMUDICT_CANDIDATE_VOICE_PROJECTION_MAPPING_GAP; CMUDICT_CANDIDATE_VOICE_PROJECTION_INVARIANT_VIOLATION.
SOURCE_NULL_PROPAGATION_POLICY=If candidate source evidence is Null, candidate notation/provenance/artifact authority is unresolved, or candidate Voice authority is not ratified, do not invoke Voice projection; preserve the source reason and return a Voice Null envelope with an explicit non-collapsing reason. Source-evidence failure remains distinct from projection failure.
VOICE_NULL_REMAINS_VALID=YES
UNKNOWN_REMAINS_DISTINCT_FROM_NULL=YES
```

The existing source reason must not be rewritten as a generic projection error.
The existing mapping failures remain explicit: unsupported categories map to
`PRONUNCIATION_VOWEL_CATEGORY_UNSUPPORTED`, missing Voice-family authority maps
to `VOICE_FAMILY_AUTHORITY_MISSING`, unresolved moving authority maps to
`MOVING_NUCLEUS_AUTHORITY_MISSING`, and variant disagreement maps to
`PRONUNCIATION_VARIANT_AMBIGUOUS`. The proposed candidate-specific codes are
future contract values only; this lane does not implement them.

## Determinism contract

```text
PROPOSED_CANDIDATE_VOICE_DETERMINISM_CONTRACT=Accept only the exact orderedRawArpabetTokens from a defined, identity-validated candidate evidence variant; use exactly mappingId=pronunciation-to-voice.open-instrument.cmudict-arpabet-en-us.v0_1.v0_1 and the frozen CMUDICT_ARPABET_VOICE_PROFILE_V0_1 table; preserve source variant order and physical source locators; preserve duplicate source records as distinct outputs; retain identical derived Voice paths as distinct per-variant records; emit failures in source evidence order and fail before projection on the first applicable authority failure; deep-freeze returned evidence and derived output; use no semantic ranking, random choice, locale-dependent ordering, source fallback, spelling correction, or winner selection; do not infer Gamma, ZC, representation, or functional meaning.
```

## Representation firewall

```text
REPRESENTATION_BRIDGE_AUTHORITY=NOT_AUTHORIZED
SAME_REPRESENTATION_AUTHORIZED_NOW=NO
CANDIDATE_VOICE_PATH_IMPLIES_SAME_REPRESENTATION=NO
PRODUCTION_SPOKEN_COMPARABILITY_AUTHORIZED_BY_THIS_LANE=NO
```

Voice projection authority is not representation-bridge authority. A future
candidate Voice path still requires the complete compatible representation
contract before spoken comparison: source pronunciation, notation,
normalization, projection, and bridge authorities remain separate.

## Gamma, ZC, and semantic firewalls

```text
CANDIDATE_GAMMA_PROJECTION_AUTHORITY=NOT_AUTHORIZED
CANDIDATE_ZC_PROJECTION_AUTHORITY=NOT_AUTHORIZED
FUNCTIONAL_INTERPRETATION_AUTHORITY=NOT_AUTHORIZED_BY_THIS_LANE
SEMANTIC_DISAMBIGUATION_USED=NO
VOICE_PATH_SEMANTIC_AUTHORITY=NO
```

No Gamma transformation, ZC transformation, profile-derived Gamma change,
functional interpretation, gloss interpretation, target-sense selection,
etymology, cognacy, borrowing, consonant meaning, or candidate winner is
defined or authorized.

## Natural positive-control firewall

```text
NATURAL_V0_2_POSITIVE_CONTROL_ESTABLISHED=NO
FALSE_NULL_DIAGNOSTIC_DISPOSITION=DEFERRED_PENDING_V0_2_REACHABILITY
TWO_MODE_DESIGN_STATUS=NOT_AUTHORIZED
```

Voice projection alone cannot establish candidate Gamma, ZC, representation
bridge, `SAME_REPRESENTATION`, or full v0.2 admissibility. No false-Null
diagnostic is run and no `study` result is promoted.

## Cache assessment

```text
VOICE_PROJECTION_AUTHORITY_REQUIRES_CACHE=NO
FUTURE_BATCH_CACHE_CONSIDERATION=If a later authorized batch integration demonstrates repeated artifact parsing or projection cost, cache lifecycle, invalidation, identity binding, and memory bounds may be assessed in that integration lane only.
CACHE_IMPLEMENTATION_AUTHORIZED_NOW=NO
```

The resolved PR #2171 cache suggestion remains outside this unwired authority
lane. No cache is created here.

## Existing function reuse assessment

### `parseArpabetTokenV0_1`

```text
FUNCTION=parseArpabetTokenV0_1
CURRENT_AUTHORITY=Private parser inside the input-role Voice projection module.
TECHNICAL_COMPATIBILITY=PARTIAL — it decomposes uppercase ARPAbet plus terminal stress 0|1|2, but it does not enforce the candidate source grammar or exact inventory and does not carry candidate provenance.
CANDIDATE_REUSE_RECOMMENDATION=DO_NOT_REUSE_DIRECTLY_AS_CANDIDATE_AUTHORITY; a future implementation may reuse equivalent token decomposition only after candidate evidence validation.
REUSE_BOUNDARY=Derived base/stress decomposition after the candidate adapter has accepted the exact source record; never for source-line parsing, artifact validation, authority, or candidate provenance.
FORBIDDEN_SIDE_EFFECT_OR_AUTHORITY_IMPORT=Do not import input-role notation authority, permissive token acceptance, source lookup, or Voice authority merely by calling this helper.
```

### `resolveArpabetPronunciationVariantsToVoiceV0_1`

```text
FUNCTION=resolveArpabetPronunciationVariantsToVoiceV0_1
CURRENT_AUTHORITY=Input-role pronunciation-to-Voice resolver for CmuDictPronunciationVariantV0_1 values.
TECHNICAL_COMPATIBILITY=YES — its per-variant mapping, stress handling, moving-nucleus observation validation, canonicalizer use, variant ambiguity behavior, and deep-freeze behavior match the proposed candidate projection boundary when fed validated candidate-derived variant values.
CANDIDATE_REUSE_RECOMMENDATION=CONDITIONAL_REUSE_OF_MECHANISM_ONLY_AFTER_DF_CANDIDATE_VOICE_RATIFICATION.
REUSE_BOUNDARY=Per validated candidate evidence variant after an additive adapter has preserved exact source provenance and converted only the already-ratified ordered tokens into the resolver's mechanical input shape; preserve the candidate evidence envelope outside the resolver.
FORBIDDEN_SIDE_EFFECT_OR_AUTHORITY_IMPORT=Do not treat the function's input-role invocation as candidate authority; do not use it for candidate lookup, selection, ranking, source validation, sense binding, or aggregation.
```

### `resolveCmuDictPronunciationToVoiceV0_1`

```text
FUNCTION=resolveCmuDictPronunciationToVoiceV0_1
CURRENT_AUTHORITY=Input-role word lookup plus input-role spoken Voice resolution.
TECHNICAL_COMPATIBILITY=NO for direct candidate use — it performs its own trimmed input lookup and returns an input-shaped aggregate, without candidate identity, physical source locator, candidate provenance, or per-record evidence preservation.
CANDIDATE_REUSE_RECOMMENDATION=DO_NOT_REUSE_FOR_CANDIDATE_PROJECTION.
REUSE_BOUNDARY=NONE for direct invocation; candidate projection must begin from validated adapter evidence, not a lexical word lookup.
FORBIDDEN_SIDE_EFFECT_OR_AUTHORITY_IMPORT=No input lookup, trim-based normalization, candidate-role inheritance, loss of physical variant identity, or automatic aggregate winner/path authority.
```

## Smallest future implementation surface — no code in this lane

```text
PROPOSED_CANDIDATE_VOICE_IMPLEMENTATION_FILES=src/shared/openInstrument/cmudictCandidateVoiceProjection.v0_1.ts; tests/openInstrument.cmudictCandidateVoiceProjection.v0_1.spec.ts
PROPOSED_CANDIDATE_VOICE_NEW_TYPES=CmuDictCandidateVoiceProjectionV0_1; CmuDictCandidateVoiceProjectionVariantV0_1; CmuDictCandidateVoiceProjectionReasonCodeV0_1
PROPOSED_CANDIDATE_VOICE_REUSED_FUNCTIONS=resolveArpabetPronunciationVariantsToVoiceV0_1 as bounded mechanical per-variant mapping after evidence validation; canonicalizeMovingNucleusV0_1; validateMovingNucleusObservationAuthorityV0_1; existing CMUDICT_ARPABET_VOICE_PROFILE_V0_1 and mapping identity
PROPOSED_CANDIDATE_VOICE_FORBIDDEN_REUSE=resolveCmuDictPronunciationToVoiceV0_1 direct input lookup; candidate adapter source parsing as a substitute for projection; any candidate generator, ranker, winner selector, gloss/sense matcher, Gamma/ZC projector, representation bridge, spelling fallback, or semantic interpreter
PROPOSED_CANDIDATE_VOICE_TEST_FILES=tests/openInstrument.cmudictCandidateVoiceProjection.v0_1.spec.ts plus unchanged existing mapping/moving-nucleus suites
PROPOSED_CANDIDATE_VOICE_TEST_MATRIX=ratified evidence-only input; exact artifact/profile/revision/notation validation; every supported monophthong; every supported moving category; stress 0/1/2 path identity; one spoken nucleus versus two canonical events; ordered sequential nuclei; unsupported token/category; malformed stress; missing source evidence; unresolved provenance; candidate Voice authority not ratified; variant disagreement; identical derived paths without evidence collapse; duplicate physical records; source order; mapping identity; moving-nucleus validation; deep freeze; deterministic repeatability; no lookup/trim reuse; no Voice/Gamma/ZC/representation/semantic fields; no natural positive control.
```

No implementation file, adapter change, test behavior change, or runtime wiring
is authorized in this authority-assessment lane.

## Scope and external boundaries

```text
ALBANIAN_PATH_IN_SCOPE=NO
ALBANIAN_SOURCE_DATA_ACQUIRED=NO
ALBANIAN_NETWORK_SOURCE_DATA_TRANSFER=NO
ALBANIAN_FROZEN_HASH_CHANGED=NO
PROFILE_IDENTITY_DIVERGENCE_IN_SCOPE=NO
S5_IN_SCOPE=NO
SANSKRIT_STATUS=CLOSED
HISTORICAL_INVALID_S5_SAMPLE_SHA256=cd5165a71e0a2aac065af1721f50a975b915dcf052b5a4133a857ed45b7c11cf
RATIFIED_AUTHORITY_CONTRACT_CONFLICT=NO
```

The historical invalid S5 sample remains permanently non-reusable. Sanskrit
remains disabled. No Albanian source recovery, profile identity correction,
false-Null work, two-mode design, acquisition, network transfer, or research
rerun is part of this lane.

## Advisory recommendation

```text
CMUDICT_CANDIDATE_VOICE_PROJECTION_RECOMMENDATION=RECOMMEND_AUTHORIZE
CANDIDATE_VOICE_PROJECTION_AUTHORITY_NOW=NO
DF_CANDIDATE_VOICE_PROJECTION_RATIFICATION_REQUIRED=YES
MERGING_THIS_ARTIFACT_DOES_NOT_AUTHORIZE_CANDIDATE_VOICE_PROJECTION=YES
NEXT_RECOMMENDED_LANE=CMUDICT_CANDIDATE_VOICE_PROJECTION_DF_RATIFICATION
```

Recommendation rationale: the existing reviewed mapping is a compatible,
deterministic mechanism for the already-ratified CMUdict candidate evidence,
but the candidate invocation authority is a new authority boundary. DF must
ratify that boundary before any implementation or runtime use.

## Scope and lifecycle fields

```text
CONTRACT_ARTIFACT_PATH=docs/open-instrument/functional-motivation-v0.2-cmudict-candidate-voice-projection-authority-v0.1.md
CONTRACT_ARTIFACT_STATUS=ADVISORY_PENDING_DF_RATIFICATION
INDEX_UPDATE_REQUIRED=NO
INDEX_UPDATE_PATH=NOT_APPLICABLE
CHANGED_FILES=THIS_ARTIFACT_ONLY
FINAL_CHANGED_FILE_COUNT=1
PRODUCTION_CODE_CHANGED=NO
TEST_BEHAVIOR_CHANGED=NO
SOURCE_DATA_CHANGED=NO
ADAPTER_CHANGED=NO
DISCOVERY_CHANGED=NO
API_CHANGED=NO
UI_CHANGED=NO
VOICE_IMPLEMENTATION_CHANGED=NO
GAMMA_IMPLEMENTATION_CHANGED=NO
ZC_IMPLEMENTATION_CHANGED=NO
REPRESENTATION_BRIDGE_CHANGED=NO
```

```text
NEXT_ACTION=AWAIT_DF_DECISION
FINAL_CLASSIFICATION=CMUDICT_CANDIDATE_VOICE_PROJECTION_RECOMMENDED_PENDING_DF_RATIFICATION
```

## Required lifecycle/report fields

```text
PROPOSED_CANDIDATE_VOICE_PROJECTION_OUTPUT=Immutable candidate-level envelope with one independently traceable per-variant result, exact source-evidence references, reviewed mapping identity, derived Voice path or explicit Null reason, and no semantic or representation authority.
FUNCTION_REUSE_ASSESSMENT=Existing input-role mapping/canonicalization mechanisms are technically reusable only as bounded future projection mechanisms after separate DF candidate-role ratification; the input lookup resolver is forbidden for direct candidate use.
CONTRACT_ARTIFACT_SHA256=SHA256_OF_THIS_FILE_WITH_THIS_FIELD_VALUE_BLANK
CONTRACT_ARTIFACT_STATUS=ADVISORY_PENDING_DF_RATIFICATION
VALIDATION=Focused CMUdict adapter, pronunciation-to-Voice, moving-nucleus canonicalization, and moving-nucleus authority suites PASS; typecheck:contracts PASS; typecheck:full PASS; gate:prepush PASS; production build PASS.
BRANCH=codex/open-instrument-v0-2-cmudict-candidate-voice-projection-authority-v0-1
COMMITS=INITIAL_DOCS_ONLY_COMMIT_TO_BE_RECORDED
NORMAL_PUSH=TO_BE_RECORDED
PRE_PUSH_HOOK=PASS
NO_VERIFY_USED=NO
FORCE_PUSH_USED=NO
PR_NUMBER=TO_BE_RECORDED
PR_HEAD_SHA=TO_BE_RECORDED
CI=TO_BE_RECORDED
CODEQL=TO_BE_RECORDED_OR_UNKNOWN_IF_NOT_REPORTED_SEPARATELY
REVIEW=TO_BE_RECORDED
DIRECT_GITHUB_REVIEW_THREAD_CHECK=TO_BE_RECORDED
DIRECT_GITHUB_UNRESOLVED_THREAD_COUNT=TO_BE_RECORDED
DIRECT_GITHUB_REVIEW_THREAD_SOURCE=TO_BE_RECORDED
REPORT_REVIEW_STATE_DISCREPANCY=TO_BE_RECORDED
MERGE_METHOD=SQUASH_ONLY
MERGE_SHA=TO_BE_RECORDED
MERGE_PARENT_COUNT=TO_BE_RECORDED
MAIN_HEAD_AFTER=TO_BE_RECORDED
ORIGIN_MAIN_AFTER=TO_BE_RECORDED
DIVERGENCE_AFTER=TO_BE_RECORDED
WORKTREE_AFTER=TO_BE_RECORDED
POST_MERGE_PROOF=TO_BE_RECORDED
HISTORICAL_S5_HEAD_AFTER=6d5bf985f1ca2763b8d41f3d4fa0735d689a1c30
HISTORICAL_S5_BRANCH_MUTATED=NO
LINEAR_TARGET=03ed5c58-80e9-4d1b-85a3-13d9a82c5496
LINEAR_UPDATE=TO_BE_RECORDED
LINEAR_RELOAD_VERIFIED=TO_BE_RECORDED
LINEAR_DUPLICATE_CREATED=NO
DF_BRAIN_LOCAL_UPDATED=TO_BE_RECORDED
DF_BRAIN_LOCAL_COMMIT=TO_BE_RECORDED
DF_BRAIN_REMOTE_PUSH=NO
NEXT_RECOMMENDED_LANE=CMUDICT_CANDIDATE_VOICE_PROJECTION_DF_RATIFICATION
```

The artifact hash is defined over the final file bytes after replacing the
value on its own `CONTRACT_ARTIFACT_SHA256=` line with an empty value. The
remaining lifecycle fields are updated with direct repository/provider
evidence before closeout; no placeholder is treated as a completed result.
