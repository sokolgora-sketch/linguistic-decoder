# Open Instrument moving nucleus observation authority contract v0.1

Date: 2026-09-28

Status: FROZEN_CONTRACT_PENDING_REVIEW.

Contract ID: `OPEN_INSTRUMENT_MOVING_NUCLEUS_OBSERVATION_AUTHORITY_CONTRACT_V0_1`

Contract posture: `RESEARCH_ONLY`.

## Purpose

This contract freezes the authority boundary for recording observations about a
spoken vowel nucleus.

It defines:

- which observation claims may be recorded;
- which claim-specific authority may support each claim;
- which provenance is required;
- when the result must remain `unknown`, `unresolved`, `unsupported`, or
  `conflicted`.

This contract does not define which canonical Seven-Voice path should result.

## Scope

The contract covers four separate observation concerns:

1. nucleus structure;
2. within-nucleus movement;
3. phonetic anchors;
4. the separate possibility of Voice-family anchors.

Canonicalization is explicitly outside observation authority.

## Non-scope

This contract does not:

- change the current P1 spoken-vowel runtime;
- classify every adjacent IPA sequence;
- define universal diphthong or hiatus rules;
- define acoustic thresholds, sample counts, or formant settings;
- create a phonetic-to-Seven-Voice map;
- populate `normalizedVoicePath`;
- create a new Voice;
- assign semantic meaning to a phonetic observation;
- change Seven-Voices doctrine, Level 3, or Level 4;
- wire spoken-vowel observations into Analyze V1, `/chat`, or APIs;
- change SBR, FRD-02, production evidence, or canonicalization.

## Evidence basis

This boundary is informed by the following external sources. The sources
support claim separation and method/provenance requirements; none establishes
Seven-Voice doctrine or canonicalization.

| Source ID | Citation | Boundary supported |
| --- | --- | --- |
| `IPA-01` | International Phonetic Association, *Interactive IPA Chart*. https://www.internationalphoneticassociation.org/IPAcharts/IPA_charts_TI/IPA_charts_TI.html | IPA symbols, syllabic/non-syllabic marking, syllable breaks, linking, and vowel notation are transcriptional resources, not acoustic measurements. |
| `AGUILAR-1999` | Lourdes Aguilar, *Hiatus and diphthong: Acoustic cues and speech situation differences*, Speech Communication 28 (1999), 57–74. https://doi.org/10.1016/S0167-6393(99)00003-5 | Hiatus/diphthong distinctions involve scoped phonological and acoustic questions; duration and formant trajectories vary with speech situation. |
| `FOX-JACEWICZ-2009` | Robert A. Fox and Ewa Jacewicz, *Cross-dialectal variation in formant dynamics of American English vowels*, JASA 126 (2009), 2603–2618. https://doi.org/10.1121/1.3212921 | F1/F2 movement, duration, trajectory length, and spectral rate describe vowel dynamics, with dialect and context effects. |
| `CLERMONT-1993` | Frantz Clermont, *Spectro-temporal description of diphthongs in F1–F2–F3 space*, Speech Communication 13 (1993), 377–390. https://doi.org/10.1016/0167-6393(93)90036-K | Detailed temporal formant representation is a method for describing diphthong dynamics. |
| `YANG-2021` | Byunggon Yang, “Measuring Vowels,” in *The Cambridge Handbook of Phonetics* (2021), pp. 261–284. https://doi.org/10.1017/9781108644198.011 | Vowel measurement includes formants, duration, and normalization across speakers and languages. |
| `HIERONYMUS-1991` | James L. Hieronymus, *Formant normalisation for speech recognition and vowel studies*, Speech Communication 10, Issues 5–6 (1991), 471–478. https://doi.org/10.1016/0167-6393(91)90050-4 | Formants vary with speaker anatomy, sex, regional accent, and speaking habits. |
| `BURRIS-2014` | Carlyn Burris et al., *Quantitative and Descriptive Comparison of Four Acoustic Analysis Systems: Vowel Measurements*, JSLHR 57 (2014), 26–45. https://doi.org/10.1044/1092-4388(2013/12-0103) | Software, settings, and correction/QC affect formant comparability and reproducibility. |

The external evidence is scoped evidence for this contract boundary, not a
universal classifier or a source of canonical Voice identity.

## Claim types

### Nucleus structure

The conceptual structure state is one of:

- `ONE_NUCLEUS`;
- `SEQUENTIAL_NUCLEI`;
- `UNRESOLVED`.

Plain adjacent IPA vowel symbols alone do not establish any of these states.
The number of symbols or observed anchors must not determine nucleus count.

### Movement

The conceptual movement state is one of:

- `OBSERVED`;
- `NOT_OBSERVED`;
- `UNKNOWN`.

Absence of acoustic evidence is not `NOT_OBSERVED`. It is `UNKNOWN` or an
otherwise applicable unresolved state.

### Phonetic anchors

`phoneticAnchors` may preserve ordered source-described or measured phonetic
anchors, such as an IPA-described quality or an acoustic region.

Phonetic anchors are observations. They are not automatically `VowelVoice`
values and are not automatically canonical path events.

### Voice-family anchors

`voiceFamilyAnchors` are nullable and require separate reviewed Open Instrument
authority. They must not be inferred automatically from phonetic or acoustic
observations.

### Canonicalization

Canonicalization is outside this contract. An observation may exist while
canonicalization remains `not_authorized`, `unresolved`, or `unsupported`.

## Claim-specific authority classes

The authority classes are claim-specific. They are not a universal ranking and
are not mutually substitutable.

### `TRANSCRIPTION_ASSERTED`

An explicit, sourced transcriptional notation supports a bounded claim about
what the notation asserts. Relevant notation may include syllabic or
non-syllabic marking, explicit syllable boundaries, or other explicit,
source-defined structural notation.

This class does not establish physical movement, acoustic trajectory, or
Seven-Voice identity.

### `PHONOLOGICALLY_DOCUMENTED`

A reviewed and scoped linguistic source supports a bounded phonological claim
about nucleus structure, diphthong/hiatus analysis, or a described moving
realization within its documented language, doculect, or dialect scope.

This class does not establish an acoustic trajectory, physical measurement,
Seven-Voice identity, or `normalizedVoicePath`.

### `ACOUSTICALLY_OBSERVED`

Reproducible token-level, temporally resolved acoustic measurements support a
bounded claim of spectral movement or related acoustic dynamics.

This class does not establish phonological nucleus count, Seven-Voice
identity, or `normalizedVoicePath` by itself.

## Transcription authority boundary

`PLAIN_IPA_AUTO_AUTHORITY=NO`.

Plain adjacent IPA vowel symbols alone are insufficient to establish:

- one nucleus;
- two sequential nuclei;
- physical movement;
- an acoustic trajectory.

Explicit sourced transcriptional marking may support a transcription-level
structural claim.

Required provenance:

- source or authority identity;
- stable evidence locator or reference;
- language scope;
- the explicit notation being asserted;
- any relevant dialect, doculect, or transcription convention.

Transcriptional claims must not be universalized beyond their source scope.

## Phonological authority boundary

A reviewed and scoped source may support a bounded phonological claim about a
nucleus, diphthong, hiatus, or moving realization.

Required provenance:

- source identity;
- stable locator or `evidenceRefs`;
- bounded claim text;
- language;
- doculect or dialect when relevant;
- source scope and limitations.

The phonological claim does not imply an acoustic trajectory or canonical Voice
mapping.

## Acoustic authority boundary

`ACOUSTIC_MOVEMENT_AUTHORITY=CONDITIONAL`.

`ACOUSTICALLY_OBSERVED` movement requires reproducible temporally resolved,
token-level measurement evidence.

Contract-level required provenance includes:

- stable token or recording reference;
- speaker/session identity or stable grouping;
- language;
- dialect, accent, or doculect when relevant;
- relevant phonetic context;
- vowel/nucleus span or boundary definition;
- temporal coordinate or alignment information;
- measured fields;
- multiple temporal observations for a trajectory claim;
- extraction method;
- software and version where applicable;
- relevant tracking/settings provenance;
- QC outcome;
- correction, exclusion, or unresolved state where applicable;
- limitations and uncertainty;
- stable `evidenceRefs`.

The contract does not freeze:

- numeric movement thresholds;
- exact sampling density;
- exact temporal sample placement;
- exact formant settings;
- normalization formulas;
- required speaker or token counts.

Those are future method details.

## Phonetic-anchor firewall

`PHONETIC_ANCHOR != VOICE_FAMILY_ANCHOR`.

A phonetic anchor may represent:

- a source-described vowel quality;
- an IPA-described target;
- an acoustic region or measurement;
- another reviewed phonetic description.

It must preserve enough information to identify what was actually observed or
asserted. It must not be forced into `VowelVoice`.

## Voice-family-anchor firewall

External phonetic evidence does not define Open Instrument's Seven Voices.

Therefore `voiceFamilyAnchors` remain nullable unless a separate reviewed Open
Instrument mapping authority supports them.

The current `src/shared/vowels/ipaVowelMap.v0.2.ts` remains an existing
deterministic coarse family-bucketing map. This contract does not promote it
to empirical observation authority and does not create a new map.

## Canonicalization firewall

The following invariants are frozen:

```text
OBSERVATION != CANONICALIZATION
PHONETIC_ANCHOR != VOICE_FAMILY_ANCHOR
OBSERVED_ANCHORS != NORMALIZED_VOICE_PATH
ONE_MOVING_NUCLEUS_WITH_TWO_ANCHORS != TWO_SEQUENTIAL_NUCLEI
```

Observation authority must not automatically populate `normalizedVoicePath`.

Observation authority must not establish:

- onset-wins;
- endpoint-wins;
- every-anchor path expansion;
- a new Voice;
- Level-3 meaning;
- Level-4 meaning;
- semantic meaning.

The separate user hypothesis that an evidence-qualified moving observation
`[X,Y]` should become canonical `[X,Y]` is not part of this contract:

```text
USER_RESEARCH_HYPOTHESIS
FROZEN=NO
REVIEWED=NO
IMPLEMENTED=NO
PRODUCTION_AUTHORITY=NO
```

## Null and unresolved policy

Null is a valid result. Fail closed for:

- plain IPA adjacency without structural authority;
- missing provenance;
- unsupported notation;
- unresolved segmentation;
- diphthong/hiatus ambiguity;
- glide/vowel-boundary ambiguity;
- movement suggested but insufficiently supported;
- acoustic data lacking required measurement provenance;
- acoustic data failing QC;
- conflicting sources;
- incompatible scopes;
- a phonetic anchor whose Voice-family mapping is unauthorized;
- canonicalization without separate authority.

Use the narrowest applicable state:

- `UNKNOWN`: the required observation is absent or not available;
- `UNRESOLVED`: evidence or segmentation is incomplete or conflicting;
- `UNSUPPORTED`: the representation cannot safely express the observation;
- `CONFLICTED`: applicable authorities disagree within the same declared
  scope.

## Conflict policy

### Transcription versus phonology

Preserve both claim records and scopes. Do not silently select a winner.

### Source versus source

Preserve competing evidence. Do not select a winner without separate authority.

### Dialect versus dialect

Keep scope-specific observations separate. Different realizations are not
contradictory merely because they differ across dialects or doculects.

### Missing acoustic evidence

Missing acoustic evidence does not invalidate an independently supported
transcriptional or phonological claim. It leaves the acoustic claim unknown or
unestablished; it is not negative acoustic evidence.

## Conceptual provenance shape

The smallest contract-level provenance shape is claim-specific and may be
represented by existing repository patterns. It must provide only fields
relevant to the claim being recorded:

```text
sourceId
authorityOrSourceType
evidenceRefsOrStableLocator
language
dialectOrDoculect
claimScope
tokenOrRecordingRef
speakerOrSessionGroup
measurementMethod
softwareVersion
boundaryAndTimeInfo
measurementFields
qcState
limitations
```

Not every field is required for every claim. Token, speaker, measurement, and
QC fields are required for acoustic claims; notation and source-scope fields
are required for transcriptional and phonological claims.

## Deterministic reason codes

The observation layer may use these non-semantic reason codes:

- `PLAIN_IPA_ADJACENCY_INSUFFICIENT`;
- `NUCLEUS_STRUCTURE_UNRESOLVED`;
- `MOVEMENT_AUTHORITY_MISSING`;
- `MEASUREMENT_PROVENANCE_MISSING`;
- `MEASUREMENT_QC_FAILED`;
- `SOURCE_SCOPE_CONFLICT`;
- `PHONETIC_ANCHOR_UNMAPPED`;
- `VOICE_FAMILY_AUTHORITY_MISSING`;
- `CANONICALIZATION_NOT_AUTHORIZED`.

These codes do not assign meaning, history, semantics, or canonical Voice
identity.

## Evidence-backed rules, internal firewalls, and future methods

### Evidence-backed contract rules

- plain adjacency is insufficient;
- transcriptional, phonological, and acoustic claims differ;
- acoustic movement requires temporal evidence;
- language, dialect, speaker, and context may affect observations;
- measurement and QC provenance matter;
- acoustic observation does not settle phonological nucleus count.

### Open Instrument internal firewalls

- the canonical Voice set remains exactly `A, E, I, O, U, Y, Ë`;
- observation is not canonicalization;
- phonetic anchors are not Voice-family anchors;
- observed anchors are not normalized paths;
- Null and unresolved remain valid.

### Future method details

- movement thresholds;
- time-point count and placement;
- formant extraction settings;
- normalization formula;
- sample-size requirements;
- language-specific classifiers;
- corpus-specific one-versus-two-nucleus decision rules.

## Backward compatibility

This is a research-only contract. It changes no current runtime behavior.

```text
CURRENT_P1_RUNTIME_EMITS_MOVING_OBSERVATION=NO
CURRENT_ADJACENT_VOWEL_NULL_BEHAVIOR=UNCHANGED
STONE_CANONICAL_RESULT_ESTABLISHED=NO
AI_CANONICAL_RESULT_ESTABLISHED=NO
PRODUCTION_API_CHANGE_AUTHORIZED=NO
CHAT_CHANGE_AUTHORIZED=NO
LEVEL3_CHANGE_AUTHORIZED=NO
LEVEL4_CHANGE_AUTHORIZED=NO
SBR_CHANGE_AUTHORIZED=NO
FRD02_CHANGE_AUTHORIZED=NO
```

## Review requirements

Before any implementation or runtime consumer uses this contract, review must
confirm:

1. claim-specific authority is preserved;
2. provenance is sufficient for the recorded claim;
3. Null, unresolved, unsupported, and conflicted states remain reachable;
4. phonetic anchors cannot silently become Voice-family anchors;
5. observations cannot silently populate `normalizedVoicePath`;
6. no numeric acoustic method has been accidentally frozen;
7. current P1 behavior remains unchanged.

## Status boundary

```text
PLAIN_IPA_AUTO_AUTHORITY=NO
MOVEMENT_AUTO_INFERRED=NO
PHONETIC_TO_VOICE_AUTO_MAPPING=NO
OBSERVED_ANCHORS_TO_PATH_AUTO_MAPPING=NO
CANONICALIZATION_POLICY_CREATED=NO
NUMERIC_THRESHOLDS_FROZEN=NO
NEW_VOICE_CREATED=NO
SEMANTICS_CREATED=NO
CURRENT_P1_CHANGED=NO
```

This document is ready for an independent contract review. It does not
authorize implementation, production integration, canonicalization, or a
future acoustic experiment.
