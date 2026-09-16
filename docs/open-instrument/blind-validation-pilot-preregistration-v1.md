# Open Instrument Blind Validation Pilot v1

PROTOCOL_ID: `OPEN_INSTRUMENT_BLIND_VALIDATION_PILOT_PREREGISTRATION_V1`
PROTOCOL_VERSION: `v1`
PROTOCOL_STATUS: `PREREGISTERED_BEFORE_CASE_SELECTION`
EXPERIMENT_CLASS: `SMALL_EXPLORATORY_FALSIFICATION_PILOT`
BASE_REPOSITORY_COMMIT: `1e8dfcd3c94e83d346814a7211721d651ce631de`
LANGUAGE_SCOPE: `English only`
PILOT_SIZE: `5 valid cases`
VOICE_SCOPE: `SINGLE_VOICE_ONLY`
MATCH_POLICY: `EXACT_CANONICAL_PROPERTY_TERM_ONLY`
CONTROL_POLICY: `ASSIGNED_PLUS_ALL_SIX_WRONG_PROFILES`
TRUTH_BOUNDARY: `RESEARCH_CORRESPONDENCE_ONLY`
VALIDATION_WORDS_PRESENT: `NO`
SEMANTIC_EVIDENCE_PRESENT: `NO`

## Status And Boundary

This document freezes the Phase-A protocol before validation words are
selected, meanings are inspected, or independent evidence is acquired.

The protocol is documentation and research governance. It does not change
runtime behavior, Voice profiles, `PrincipleRole`, Chapter-4 associations,
path composition, target-sense binding, evidence promotion, or production
candidate authority.

The existing comparative evaluation contract remains the source for the
provenance, circularity, verdict, Null, blinding, and evaluator vocabulary.
The existing 57-case comparative corpus is not reused as the pilot cohort:
its cases derive from the baseline manifest and are fixture-authored or have
unknown circularity.

## Experimental Claim

For a fresh structurally eligible single-Voice embryo, the functional profile
assigned by its canonical Voice is tested for whether it shows more specific
preregistered correspondence with independently revealed
lexical/morphological facts than all six profiles belonging to the other
canonical Voices.

Classification: `BOUNDED_COMPARATIVE_CORRESPONDENCE_HYPOTHESIS`.

This pilot does not test or establish target-word meaning, embryo meaning,
true etymology, historical origin, semantic interaction, target-sense
binding, production evidence, doctrine truth, or a single winning language,
root, or interpretation.

## Canonical Voices And Roles

The canonical validation Voices are exactly:

`A`, `E`, `I`, `O`, `U`, `Y`, `Ë`.

Current machine `PrincipleRole` values are retained as a separate authority:

| Voice | PrincipleRole |
| --- | --- |
| A | `Initiation/Source` |
| E | `Expansion/Bridge` |
| I | `Direction/Focus` |
| O | `Mediation/Balance` |
| U | `Containment/Depth` |
| Y | `Reflection/Mirror` |
| Ë | `Completion/Unit` |

The Chapter-4/Hermetic labels `Bashkimi`, `Vibrimi`, `Ritmi`, `Balanca`,
`Ndryshimi`, `Nisma`, and `Dashuria` are not canonical validation roles.
They remain separate author-doctrine principle-association data and do not
participate in primary scoring.

## Frozen Property Inventory

The inventory is copied from the current authorized functional profile
registry. Every assignment is listed exactly once below; `connection` is the
only duplicated literal property ID and belongs to E and Ë.

| Voice | Functional property IDs |
| --- | --- |
| A | `beginning`, `creation`, `activation`, `life_pulse` |
| E | `expansion`, `transformation`, `connection`, `growth` |
| I | `illumination`, `knowledge`, `recognition`, `clarity`, `truth_orientation`, `understanding` |
| O | `mediation`, `balance`, `order`, `center`, `harmonization`, `non_domination`, `unification` |
| U | `support`, `grounding`, `depth`, `stability`, `nourishment`, `belonging`, `foundation` |
| Y | `choice`, `duality`, `exploration`, `adventure`, `mystery`, `imagination`, `experimentation`, `discovery`, `risk`, `learning_from_experience` |
| Ë | `resolution`, `harmony`, `peace`, `reconciliation`, `unity`, `emotional_interiority`, `connection` |

Inventory invariants: `45` property assignments; `44` unique literal property
IDs; exactly `7` canonical Voices; no `Ẽ` Voice.

## Frozen Testability Classes

Each property belongs to exactly one class. Classes are frozen before case
selection.

### HIGH_SPECIFICITY

`beginning`, `creation`, `expansion`, `transformation`, `knowledge`,
`mediation`, `order`, `choice`, `duality`, `exploration`,
`experimentation`, `discovery`, `resolution`, `reconciliation`.

### MEDIUM_SPECIFICITY

`activation`, `connection`, `growth`, `illumination`, `recognition`,
`clarity`, `understanding`, `balance`, `center`, `support`, `stability`,
`nourishment`, `foundation`, `adventure`, `risk`, `peace`.

### LOW_SPECIFICITY

`truth_orientation`, `harmonization`, `unification`, `grounding`, `depth`,
`belonging`, `mystery`, `imagination`, `harmony`, `unity`.

### NOT_OBJECTIVELY_MATCHABLE

`life_pulse`, `non_domination`, `learning_from_experience`,
`emotional_interiority`.

Primary comparison includes HIGH and MEDIUM only. LOW properties remain
visible and exploratory but are not primary evidence. NOT_OBJECTIVELY_MATCHABLE
properties remain visible but are excluded from positive correspondence and
the primary denominator. No property class may change after case selection.

## Matching And Outcomes

The V1 matching rule is `EXACT_CANONICAL_PROPERTY_TERM_ONLY`. The independent
fact set must contain the exact canonical property concept. No free synonyms,
translations selected after reveal, embeddings, LLM similarity, metaphor,
theme, or evaluator intuition is allowed. No controlled-equivalence table is
available for V1.

Property-level outcomes:

| Outcome | Definition |
| --- | --- |
| `DIRECT_MATCH` | The frozen independent fact set contains the exact canonical property concept. |
| `CONTRADICTION` | Independent evidence explicitly establishes an opposing or incompatible function. |
| `NO_MATCH` | Adequate evidence exists, but the exact property is not established. |
| `UNKNOWN` | Available evidence cannot adjudicate the property. |
| `NOT_TESTABLE` | The property is outside the primary testability policy. |

Absence alone is not `CONTRADICTION`.

## Profile-Breadth Normalization

Raw match counts are prohibited because profile widths differ. The fixed
primary denominator is the number of HIGH plus MEDIUM properties assigned to
each Voice:

| Voice | Fixed primary denominator |
| --- | ---: |
| A | 3 |
| E | 4 |
| I | 5 |
| O | 4 |
| U | 4 |
| Y | 7 |
| Ë | 4 |

For descriptive comparison only:

`correspondence_rate = DIRECT_MATCH count / fixed primary denominator`.

There are no weights, bonuses, denominator changes, or post-hoc exclusions.
`UNKNOWN` and `NO_MATCH` remain in the fixed denominator. LOW and
NOT_OBJECTIVELY_MATCHABLE properties remain outside it.

This is not a semantic score and does not establish a profile winner outside
the preregistered experimental comparison.

## All-Six Controls

Every valid case is evaluated against the assigned Voice profile and all six
wrong Voice profiles using the same fact set, exact matching rule, fixed
denominators, and adjudication policy. No wrong profile may be selected after
evidence reveal.

The current profile assignment is not compared to Chapter-4/Hermetic labels.

## Case And Pilot Decisions

For each valid case:

| Result | Definition |
| --- | --- |
| `ASSIGNED_PROFILE_OUTPERFORMS_CONTROLS` | Assigned rate is strictly greater than every wrong-profile rate. |
| `CONTROL_TIE` | At least one wrong profile equals the assigned rate and none exceeds it. |
| `CONTROL_OUTPERFORMS_ASSIGNED` | At least one wrong profile has a greater rate. |
| `INSUFFICIENT_EVIDENCE` | Source requirements cannot adjudicate the case. |
| `INVALID_CASE` | A preregistered invalidation condition occurs. |

The pilot requires exactly five valid cases. `VALIDATION_SIGNAL_PRESENT`
requires all five case results to be `ASSIGNED_PROFILE_OUTPERFORMS_CONTROLS`
and `ASSIGNED_AGGREGATE > CONTROL_AGGREGATE` under the frozen aggregate
calculation below. Any case tie, wrong-profile lead, or aggregate
non-separation produces `NO_VALIDATION_SIGNAL`. Fewer than five valid cases
produces `INSUFFICIENT_EVIDENCE`.

This is not a statistical confirmation experiment. It is a
`SMALL_EXPLORATORY_FALSIFICATION_PILOT`.

## Aggregate Calculation

For case `c` and Voice profile `v`, the primary correspondence rate is:

`r(c,v) = DIRECT_MATCH_COUNT(c,v) / FIXED_ELIGIBLE_PROPERTY_COUNT(v)`.

The fixed denominators are the HIGH plus MEDIUM property counts listed above.
For the five valid cases, with `N = 5`:

`assignedRate(c) = r(c, assignedProfile(c))`.

`ASSIGNED_AGGREGATE = (1/N) * sum(assignedRate(c))`.

For each case, all six Voices other than the assigned Voice remain controls.
The strongest wrong-profile rate for that case is:

`strongestWrongRate(c) = max(r(c,v) for every v != assignedProfile(c))`.

The primary adversarial control aggregate is:

`CONTROL_AGGREGATE = (1/N) * sum(strongestWrongRate(c))`.

This aggregates by case, not by whichever Voice happens to be wrong across the
cohort. All seven per-case profile rates and the six-control membership remain
in the record. Rates are compared as exact rational numerator/denominator
values; no rounding, weighting, pooled denominator, or post-hoc exclusion may
affect a decision. Displayed decimals are presentation only.

## Structural Case Eligibility

Eligibility is determined without semantic inspection. A case must have:

- a fresh word from a neutral candidate source;
- a structural-positive result;
- exactly one canonical Voice in the relevant derived path;
- a nonempty embryo;
- `discoveryStatus = structural_hypothesis`;
- `independentStandaloneMeaning = null`;
- empty `evidenceRefs`;
- no target sense;
- no semantic alignment;
- no semantic bridge;
- no provider output.

Structural Null and producer Null cases are ineligible for this first pilot.

## Contamination Exclusion

Before admission, a candidate must be absent from all answer-bearing
development surfaces, including reviewed lexical rows, research rows and
packets, proto-root registries, sound-root assets, canonical fixtures,
baseline fixtures, the comparative corpus, target-sense fixtures, producer
tests, provider/calibration artifacts, fresh-word development artifacts,
word-specific tests, and worked semantic examples in documentation.

Presence on any such surface is `CONTAMINATED_CASE`. The scan is structural and
repository-based; it must not inspect candidate meaning to select favorable
cases.

## Candidate Source And Deterministic Case Selection

The first pilot uses English only. Before any candidate form is inspected, the
operator records the neutral source identity and version and computes
`CANDIDATE_SOURCE_HASH = SHA256_OF_RAW_UTF8_SOURCE_ARTIFACT`. The complete
source artifact is hashed before filtering. The source must be an externally
acquired lexical-form list, not a ZË-RO/profile-derived list, repository
semantic corpus, registry, or worked example. Phase A receives lexical forms
only; definitions and semantic annotations are not supplied.

The frozen source record and filter rules are:

| Field | Frozen rule |
| --- | --- |
| Input encoding | UTF-8; malformed decoding invalidates the source. |
| Source record | One lexical-form record per line; line endings are parsed as LF, CRLF, or CR after the raw-byte hash. Stable source record ID is the 1-based parsed line number. |
| Case normalization | Trim leading/trailing whitespace, apply Unicode NFKC, then locale-independent lowercase via the engine-equivalent `toLowerCase()` operation. |
| Alphabet acceptance | Normalized form must match `^[a-z]+$`. |
| Minimum length | 2 ASCII letters, inclusive. |
| Maximum length | 20 ASCII letters, inclusive. |
| Hyphen policy | Reject any hyphenated form. |
| Apostrophe policy | Reject any apostrophe or quotation mark. |
| Whitespace policy | Reject blank records and any normalized form containing whitespace; do not truncate or join tokens. |
| Digits policy | Reject any digit. |
| Punctuation policy | Reject every character outside `a-z`. |
| Duplicate policy | Deduplicate exact normalized forms; retain the lexicographically smallest stable source record ID. |
| Sorting rule | Sort by normalized ASCII form, then stable source record ID using code-point order. Source order is not cohort order. |
| Contamination comparison | Apply the same normalization to repository forms and reject exact normalized-form matches on excluded answer-bearing surfaces. |

The normalized candidate must therefore be one nonempty ASCII-lowercase token
of length 2 through 20. These filters are fixed before candidate eligibility
or semantic inspection and are not selected for expected compatibility with any
Voice property.

Selection procedure:

1. Record candidate-source identity, version, raw-byte SHA-256, and source-record IDs.
2. Apply the frozen decoding, normalization, alphabet, length, character, and duplicate rules.
3. Apply the repository absence and contamination scan using exact normalized-form comparison.
4. Apply structural-positive and single-Voice eligibility.
5. Sort the eligible pool by normalized form and stable source record ID.
6. Take the first five eligible cases.

No candidate word may be manually substituted after semantic inspection. If
the source artifact, source hash, or frozen filter record changes, the Phase-A
protocol is invalidated rather than recomputed silently.

## Phase A: Structural Discovery And Output Freeze

Phase A ends before any definition, translation, lexical lookup, semantic
source lookup, or assigned-profile-guided search.

For each selected case, the full Phase-A manifest freezes the case ID, target
word, normalized word, language, structural hypothesis ID, embryo, expansion
chain, Voice path, assigned Voice, full emitted profile, claim boundaries,
truth classification, evidenceRefs, producer version, base repository commit,
and deterministic SHA-256 output fingerprint. This full manifest is answer-
bearing and is not the artifact provided to Phase-B evidence collectors.

The Phase-A manifest must contain:

`PHASE_A_STATUS = FROZEN_BEFORE_EVIDENCE_REVEAL`

`PHASE_A_FULL_MANIFEST_HASH = SHA256_OF_FROZEN_FULL_MANIFEST`

`PHASE_A_FINGERPRINT = PHASE_A_FULL_MANIFEST_HASH`

No Phase-B fact may be written into the Phase-A manifest.

## Phase B: Independent Evidence And Fact-Set Freeze

Phase B begins only after the full-manifest hash exists. A deterministic,
redacted `PHASE_B_RESEARCH_VIEW` is derived from the full manifest and frozen
before evidence acquisition. It contains only:

`caseId`, `targetWord`, `normalizedWord`, `language`, and neutral
`sourceAcquisitionInstructions`.

The research view must not contain or expose the assigned Voice, Voice path,
profile properties, PrincipleRole, predicted correspondence, expected outcome,
control identities/results, ZË-RO semantic hypothesis, or any classification
that reveals the expected profile. Its canonical serialized form is recorded
as:

`PHASE_B_RESEARCH_VIEW_HASH = SHA256_OF_CANONICAL_REDACTED_RESEARCH_VIEW`

Evidence collectors receive only the redacted research view. Access separation
is recorded in the provenance: the Phase-A operator who knows assigned
profiles cannot serve as the independent Phase-B primary evidence collector.
Memory separation is not sufficient. If independent blinded collection and
access separation cannot be achieved, the case and pilot cannot be reported as
blind primary validation and receive `PHASE_B_BLINDING_BREACH`.

Researchers search for each word itself, not for assigned Voice properties.
They collect ordinary dictionary senses, morphological facts, historical or
etymological facts where relevant, and explicit semantic-development facts
where available.

Each fact records its source locator, source class, provenance, and
adjudication status. The complete fact set is frozen before comparison:

`PHASE_B_STATUS = FACT_SET_FROZEN_BEFORE_PROFILE_COMPARISON`

`PHASE_B_FINGERPRINT = SHA256_OF_FROZEN_FACT_SET`

## Independent Evidence

Accepted source classes are authoritative dictionaries, historical
dictionaries, morphological references, etymological references, scholarly
lexical resources, and corpora with explicit senses.

Evidence is not independent when derived from ZË-RO, the current repository,
worked examples, model-generated analysis, supporting research rows, provider
output, or target-bound development fixtures.

Source hierarchy:

`LEXICAL_FACT` > `MORPHOLOGICAL_FACT` > `HISTORICAL_FACT` /
`SEMANTIC_DEVELOPMENT_FACT` > `FUNCTIONAL_INTERPRETATION` > `ZË-RO_HYPOTHESIS`.

The final two classes cannot independently validate the hypothesis.

Each case requires at least one authoritative source with an explicit sense
or morphological fact. Material source conflict requires a second independent
source or remains `UNKNOWN`. Evidence collection must not stop after a
favorable match is found.

## Sense And Human Adjudication

All major independently documented senses must be recorded. A case with
material unresolved sense ambiguity is `UNRESOLVED_SENSE_AMBIGUITY` and cannot
count among the five valid primary cases.

Human judgment is limited to source quality, sense ambiguity, explicit
contradiction, and whether exact source terminology satisfies the frozen
matching rule. If independent human adjudication is unavailable, ambiguous
items remain `UNKNOWN`. Models and providers are not independent adjudicators.

## Invalidation Codes

The following codes are frozen before Phase A and cannot be removed after it
begins:

`CONTAMINATED_CASE`

`SEMANTIC_INFORMATION_LEAK`

`PROFILE_CHANGED_AFTER_FREEZE`

`RUBRIC_CHANGED_AFTER_FREEZE`

`CONTROL_CHANGED_AFTER_FREEZE`

`SOURCE_SEARCH_BIASED_BY_PROFILE`

`PHASE_B_BLINDING_BREACH`

`INSUFFICIENT_SOURCE_COVERAGE`

`UNRESOLVED_SENSE_AMBIGUITY`

`OUTPUT_FINGERPRINT_MISMATCH`

## Null And Truth Boundaries

These states remain distinct:

`STRUCTURAL_NULL`, `PRODUCER_NULL`, `EVIDENCE_NULL`, `INSUFFICIENT_EVIDENCE`.

Engine Null does not establish semantic Null.

Whatever the result, the pilot cannot establish production truth, canonical
semantic mapping, etymological origin, historical origin, true lexical
meaning, semantic interaction, target-sense binding, evidence promotion, or
authority promotion. The result remains research correspondence evidence.

`no_single_winner` and `user_decides` remain true throughout.

## Reproducibility And Self-Validation

The protocol is valid only if the future Phase-A artifact proves:

- exactly seven canonical Voices in order `A,E,I,O,U,Y,Ë`;
- exactly 45 property assignments and 44 unique property IDs;
- every property classified exactly once;
- Hermetic labels excluded from canonical validation roles;
- pilot size exactly five;
- single-Voice scope only;
- all six wrong profiles evaluated;
- exact-term matching only;
- no validation words or semantic evidence in this preregistration;
- non-matchable properties excluded from primary matching;
- profile breadth cannot increase results through raw counts;
- no post-hoc synonym expansion;
- controls and rubric cannot mutate after Phase A;
- the full Phase-A manifest and redacted Phase-B research view have separate hashes;
- Phase-B access separation prevents assigned-profile exposure to the independent collector;
- source identity and raw-byte hash precede candidate filtering;
- normalization, alphabet, length, character, duplicate, sorting, and contamination rules are concrete;
- assigned and strongest-wrong aggregates use exact case-level arithmetic with no rounding;
- `no_single_winner` and `user_decides` preserved.

## Explicit Non-Changes

This protocol does not modify runtime code, current Voice profiles,
`PrincipleRole`, Chapter-4/Hermetic associations, path composition, PR #1940,
provider authorization, evidence registries, source files, or DF_BRAIN.

The protocol itself is not lexical evidence, historical evidence, production
evidence, or engine-authorized semantic truth.
