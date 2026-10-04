# Open Instrument — Word-to-Word Structural and Authority Comparison v0.1

```text
CONTRACT_ID=OPEN_INSTRUMENT_WORD_TO_WORD_STRUCTURAL_AND_AUTHORITY_COMPARISON_V0_1
VERSION=v0.1
STATUS=FROZEN_COMPARISON_AUTHORITY_CONTRACT_ONLY
```

## 1. Purpose

This contract freezes the smallest deterministic comparison projection for
exactly two already-established Open Instrument analysis results.

The comparison reports:

- established fields that are equal;
- established fields that differ;
- fields present on only one side;
- Null or unavailable values on either side; and
- the authority and provenance state belonging to each side.

The contract does not create a new analysis result. It does not reinterpret,
rank, score, select, or repair either source result.

The authority chain remains:

```text
existing single-result Open Instrument analysis / TelemetryViewModel
  -> this two-result comparison projection
  -> future bounded presentation
```

## 2. Authority and source boundary

The admissible inputs are two existing single-result outputs produced by the
current Open Instrument architecture. The relevant current source structures
are:

- `TelemetryViewModel.readout` and its `spokenPronunciation` value;
- `TelemetryViewModel.candidates`, `analysisStatusV0_1`, and
  `wordSpecificFunctionalDepth`;
- `TelemetryViewModel.originClaim`, `rootMap`, `soundRoots`, and evidence
  structures where a future comparison projection explicitly includes them;
- `SpokenPronunciationProvenanceV0_1VM`;
- `ZeroConsonantalStructuralCompositionV0_1VM`; and
- the existing single-result reproducible bundle fields.

The comparison does not acquire external evidence, call providers, rerun an
analysis, or consult mutable state.

```text
NEW_PRONUNCIATION_AUTHORITY=NO
NEW_LINGUISTIC_AUTHORITY=NO
NEW_SEMANTIC_AUTHORITY=NO
NEW_ETYMOLOGICAL_AUTHORITY=NO
PROVIDER_AUTHORITY=NO
```

`LEGACY_COMPARE_PANEL_AUTHORITY=NONE`.

`src/components/ComparePanel.tsx` is historical implementation context only.
It does not define this contract and must not be resurrected as the v0.1
comparison model.

## 3. Ordered inputs

The comparison receives exactly two ordered inputs:

```text
LEFT_RESULT
RIGHT_RESULT
```

Ordering is presentation identity only. `LEFT` and `RIGHT` do not mean:

- baseline and challenger;
- winner and loser;
- source and target;
- older and newer;
- stronger and weaker; or
- preferred and non-preferred.

Each side preserves its own result identity and provenance. Current
single-result architecture does not emit a dedicated stable analysis ID. The
projection must not invent one. Until such an ID is independently established,
side identity is the ordered side label plus the existing `word`,
`normalizedWord`, `mode`, `alphabet`, and `engineVersion` fields where
available.

`createdAt` may be retained as provenance metadata but is not a comparison
identity key and must not affect deterministic equality.

## 4. Comparison result shape

The future implementation should add a typed comparison projection composed
from two existing single-result values:

```text
Comparison(leftResult, rightResult) -> ComparisonProjection
```

It must not change the meaning or shape of the existing single-result VM.

```text
EXISTING_SINGLE_RESULT_VM_FIELDS_CHANGED=NO
EXISTING_SINGLE_RESULT_VM_SEMANTICS_CHANGED=NO
COMPARISON_TYPE_ADDITIVE_ONLY=YES
COMPARISON_DETERMINISTIC=YES
COMPARISON_PROVIDER_FREE=YES
```

The projection contains field-level relation rows. It does not contain a
single aggregate verdict.

## 5. Compared fields

Each proposed comparison field must have the following binding:

```text
SOURCE_FIELD=<existing field or explicitly derived existing field>
COMPARISON_RULE=<exact comparison rule>
NULL_RULE=<missing/Null behavior>
USER_VALUE=<bounded question answered>
```

### 5.1 Word and result identity

Compare the existing submitted-word identity and available result context:

- `readout.word`;
- `readout.normalizedWord`;
- `readout.mode`;
- `readout.alphabet`; and
- `readout.engineVersion`.

These fields identify the two analyzed inputs and execution context. They do
not establish lexical, semantic, historical, or etymological identity.

### 5.2 Pronunciation authority

Compare the existing `readout.spokenPronunciation` authority state:

- `status`;
- `reasonCode`;
- `sourceProfileId`;
- `sourceNotation`;
- `sourceRevision`; and
- the ordered variant metadata `variantId` and `variantOrder`.

Where present, preserve each variant’s `sourceForm`,
`sourcePronunciation`, and existing authority state. Do not synthesize a new
source or select a preferred variant.

### 5.3 Canonical spoken Voice path V

Compare the exact ordered canonical Voice event sequence from the existing
single-result path and, where needed, the matching existing pronunciation
variant path.

```text
V ∈ [A,E,I,O,U,Y,Ë]*
```

Do not sort, deduplicate, collapse, or re-expand the sequence. Moving-nucleus
expansion remains exactly as established upstream.

### 5.4 Source consonant structure Γ

Compare the exact ordered source-faithful consonant sequence derived from the
existing pronunciation variant `segments` whose `kind` is `consonant`.

- preserve source order;
- preserve duplicates;
- preserve source units;
- do not infer phonological equivalence; and
- never use spelling as fallback.

### 5.5 ZC v0.1

Consume the existing
`ZeroConsonantalStructuralCompositionV0_1VM` values without recomputation.
The compared fields are exactly the existing:

```text
P = p
I = i
S = s
D = d
A = a
R = r
```

The enclosing existing `voicePath`, `variantId`, `variantOrder`, source
profile, notation, and revision remain provenance/context fields. ZC values
are structural summaries only. A lossy ZC equality must not hide an exact Γ
difference.

### 5.6 Functional and candidate status

Compare existing status/category values only:

- `analysisStatusV0_1.status`;
- `wordSpecificFunctionalDepth.status`;
- `wordSpecificFunctionalDepth.authorityClass`; and
- bounded candidate/evidence availability indicators where already present.

Do not rank statuses, turn categories into scores, or compare semantic truth
numerically.

### 5.7 Word-specific functional evidence state

Compare only the existing availability/status state and evidence references of
`wordSpecificFunctionalDepth`.

The comparison may report that one side has reviewed functional evidence,
research functional hypothesis evidence, or a valid Null state. It must not
transfer evidence from one word to the other or compare semantic statements as
truth values.

### 5.8 Evidence and provenance

Include only bounded existing provenance identifiers or status values when
they have a clean current source field and deterministic user value. Do not
embed complete evidence packages or raw JSON in the comparison projection.

Current evidence references remain side-specific. A reference on `LEFT` is
never evidence for `RIGHT`.

## 6. Relation algebra

The relation vocabulary is:

```text
EQUAL
DIFFERENT
LEFT_ONLY
RIGHT_ONLY
BOTH_NULL
```

The exact implementation names may follow repository naming conventions, but
the meanings must remain fixed.

`Null`, missing, empty valid collection, zero, unsupported, and not applicable
are distinct states unless an existing source contract explicitly establishes
equivalence.

For ordered sequences, equality means exact ordered equality.

Examples:

```text
V [O,U] vs [O,U]       = EQUAL
V [O,U] vs [O]         = DIFFERENT
Γ [S,T,N] vs [HH,M]    = DIFFERENT
I [] vs []             = EQUAL
I [] vs [1]            = DIFFERENT
R [] vs []             = EQUAL
```

No fuzzy equality is permitted.

### 6.1 Per-side source state

Every comparison row preserves the state of each ordered side independently:

```text
LEFT_STATE=<state>
RIGHT_STATE=<state>
RELATION=<coarse relation>
```

The state vocabulary is:

```text
VALUE
NULL
MISSING
EMPTY_VALID
UNSUPPORTED
NOT_APPLICABLE
```

`VALUE` means that the authoritative upstream field supplies a valid
non-empty value. Numeric, string, and boolean zero-like values remain `VALUE`
when they are valid source values. `EMPTY_VALID` is reserved for a valid empty
ordered collection, such as `[]`, when the authoritative upstream field and
its type support that distinction. It is not converted to `NULL` or
`MISSING`. A valid scalar value, including a scalar whose content is empty only
when the upstream contract explicitly treats it as a value, remains `VALUE`.

`NULL` means the authoritative upstream field explicitly reports Null.
`MISSING` means the field is absent. `UNSUPPORTED` and `NOT_APPLICABLE` mean
the authoritative upstream source explicitly reports those states. The
comparison must not manufacture one state from another. If an upstream field
does not expose a distinction, the implementation records only the state that
the upstream contract actually provides.

If the authoritative upstream source exposes an existing Null `reasonCode` or
reason, it is preserved as side-specific metadata:

```text
LEFT_REASON=<existing reason or absent>
RIGHT_REASON=<existing reason or absent>
```

No new reason code is introduced. Different Null reasons remain
distinguishable even when the coarse relation is `BOTH_NULL`.

### 6.2 Total coarse-relation derivation

The five coarse relations remain bounded. They are derived only after the
per-side states have been preserved:

1. If both sides are comparable source states (`VALUE` or `EMPTY_VALID`),
   compare their exact source values. Exact equality yields `EQUAL`; exact
   inequality yields `DIFFERENT`.
2. If only `LEFT_STATE` is comparable, the relation is `LEFT_ONLY`.
3. If only `RIGHT_STATE` is comparable, the relation is `RIGHT_ONLY`.
4. If neither side is comparable, the relation is `BOTH_NULL`.

`BOTH_NULL` is a coarse relation meaning that neither side supplies a
comparable source value. It does not collapse the preserved per-side states:
`NULL`, `MISSING`, `UNSUPPORTED`, and `NOT_APPLICABLE` remain distinct in
`LEFT_STATE` and `RIGHT_STATE`, and any existing side-specific Null reasons
remain distinct in `LEFT_REASON` and `RIGHT_REASON`.

This rule is total for every state pair and does not require a larger relation
algebra. In particular:

```text
VALUE          vs VALUE          -> EQUAL or DIFFERENT by exact value
VALUE          vs MISSING        -> LEFT_ONLY
MISSING        vs VALUE          -> RIGHT_ONLY
MISSING        vs MISSING        -> BOTH_NULL
NULL           vs NULL           -> BOTH_NULL
NULL           vs MISSING        -> BOTH_NULL
MISSING        vs NULL           -> BOTH_NULL
EMPTY_VALID    vs EMPTY_VALID    -> EQUAL by exact empty value
EMPTY_VALID    vs VALUE          -> DIFFERENT by exact value
VALUE          vs EMPTY_VALID    -> DIFFERENT by exact value
UNSUPPORTED    vs UNSUPPORTED    -> BOTH_NULL
NOT_APPLICABLE vs NOT_APPLICABLE -> BOTH_NULL
UNSUPPORTED    vs NOT_APPLICABLE -> BOTH_NULL
NOT_APPLICABLE vs UNSUPPORTED    -> BOTH_NULL
```

The same rule applies to all other combinations. A valid empty collection is
never treated as unavailable merely because the other side is empty,
unsupported, Null, or missing.

### 6.3 Null, missing, and unavailable controls

The following controls are normative:

```text
LEFT_STATE=VALUE
RIGHT_STATE=VALUE
same exact value
RELATION=EQUAL

LEFT_STATE=VALUE
RIGHT_STATE=VALUE
different exact values
RELATION=DIFFERENT

LEFT_STATE=VALUE
RIGHT_STATE=MISSING
RELATION=LEFT_ONLY

LEFT_STATE=MISSING
RIGHT_STATE=VALUE
RELATION=RIGHT_ONLY

LEFT_STATE=MISSING
RIGHT_STATE=MISSING
RELATION=BOTH_NULL

LEFT_STATE=NULL
RIGHT_STATE=NULL
same reason
RELATION=BOTH_NULL
LEFT_REASON and RIGHT_REASON preserved

LEFT_STATE=NULL
RIGHT_STATE=NULL
different reasons
RELATION=BOTH_NULL
LEFT_REASON and RIGHT_REASON preserved independently

LEFT_STATE=NULL
RIGHT_STATE=MISSING
RELATION=BOTH_NULL
LEFT_STATE and RIGHT_STATE preserved independently

LEFT_STATE=MISSING
RIGHT_STATE=NULL
RELATION=BOTH_NULL
LEFT_STATE and RIGHT_STATE preserved independently

LEFT_STATE=EMPTY_VALID
RIGHT_STATE=EMPTY_VALID
exact empty values
RELATION=EQUAL

LEFT_STATE=UNSUPPORTED
RIGHT_STATE=NOT_APPLICABLE
RELATION=BOTH_NULL
LEFT_STATE and RIGHT_STATE preserved independently
```

```text
FIVE_STATE_RELATION_ALGEBRA_INSUFFICIENT=NO
PER_SIDE_STATE_PRESERVATION=REQUIRED
RELATION_DERIVATION_TOTAL=YES
```

## 7. Null and unavailable behavior

Null is a valid comparison outcome. The projection must preserve each side’s
state and must never manufacture a value to make rows comparable.

Required behavior includes:

- valid pronunciation versus pronunciation Null;
- pronunciation Null versus valid pronunciation;
- both pronunciation values Null;
- valid ZC versus ZC Null;
- both ZC values Null;
- functional evidence present on one side only; and
- functional evidence Null or absent on both sides.

```text
NO_SPELLING_FALLBACK=YES
NO_FAKE_GAMMA=YES
NO_FAKE_ZC=YES
NO_FAKE_FUNCTIONAL_EVIDENCE=YES
NO_SYNTHETIC_PROVENANCE=YES
```

A Null side remains Null. An empty valid sequence remains an empty valid
sequence and is not converted to Null.

## 8. Variant comparison

Variant identity and order are preserved independently on both sides.

The bounded v0.1 rule is:

1. compare variant entries by exact `variantId` when the same ID is present on
   both sides;
2. preserve `variantOrder` for presentation and provenance;
3. report unmatched variant IDs as `LEFT_ONLY` or `RIGHT_ONLY`; and
4. do not cross-pair variants by order, similarity, path, or any heuristic.

If a future input lacks stable variant IDs or cannot be represented without
cross-pairing, the affected comparison row is Null/unavailable rather than
heuristically resolved.

```text
VARIANT_COMPARISON_RULE=EXACT_VARIANT_ID_MATCH_ONLY
NO_SINGLE_WINNER_PRESERVED=YES
```

## 9. Absolute prohibitions

```text
SIMILARITY_SCORE=FORBIDDEN
DISTANCE_SCORE=FORBIDDEN
PERCENT_SIMILARITY=FORBIDDEN
WEIGHTED_COMPARISON=FORBIDDEN
AGGREGATE_MATCH_SCORE=FORBIDDEN
RANKING=FORBIDDEN
WINNER_SELECTION=FORBIDDEN
```

The comparison must not emit scalar or ordinal claims such as “87% similar,”
“closer,” “more complex,” “stronger match,” or “more important.”

## 10. Claim boundary and semantic firewall

The user-facing comparison authority is:

```text
ZË-RO STRUCTURAL / AUTHORITY COMPARISON
```

The comparison may report that two words share a canonical Voice path, that
their Γ sequences differ, that ZC fields match or differ, or that their
authority/status states differ.

It must not infer:

```text
STRUCTURAL_DIFFERENCE_AUTHORIZED=YES
SEMANTIC_DIFFERENCE_INFERENCE_AUTHORIZED=NO
FUNCTIONAL_DIFFERENCE_INFERENCE_FROM_STRUCTURE_AUTHORIZED=NO
ETYMOLOGICAL_RELATION_INFERENCE_AUTHORIZED=NO
INDIVIDUAL_CONSONANT_MEANING_AUTHORIZED=NO
HISTORICAL_PRIORITY_INFERENCE_AUTHORIZED=NO
```

The comparison surface must carry a concise boundary equivalent to:

> This comparison reports established structural, authority, status, and
> provenance differences. It does not assign semantic meaning, historical
> origin, or a winner.

The existing ZC claim boundary is unchanged.

## 11. Information preservation

```text
LEFT_SOURCE_RESULT_MUTATED=NO
RIGHT_SOURCE_RESULT_MUTATED=NO
SOURCE_PROVENANCE_PRESERVED=YES
SOURCE_EVIDENCE_PRESERVED=YES
SOURCE_NULLS_PRESERVED=YES
```

The comparison may be a compact summary only because each source analysis
remains independently inspectable through the existing single-result product
surface or valid saved bundle.

## 12. Determinism and user decision posture

For the same ordered `LEFT_RESULT` and `RIGHT_RESULT`, the comparison
projection must be byte-for-byte or structurally identical according to the
implementation’s established serialization rule.

No LLM, provider, network lookup, randomness, current time, external evidence
search, or mutable state may affect comparison derivation.

```text
COMPARISON_DETERMINISTIC=YES
COMPARISON_PROVIDER_FREE=YES
COMPARISON_SELECTS_WINNER=NO
COMPARISON_RANKS_RESULTS=NO
COMPARISON_RECOMMENDS_RESULT=NO
USER_DECIDES_PRESERVED=YES
```

This contract does not claim to solve general user-decision support. It only
exposes deterministic differences for inspection.

## 13. Minimum presentation boundary

The future v0.1 surface must provide:

- clear `LEFT` identity;
- clear `RIGHT` identity;
- compact field-level comparison rows;
- equality, difference, and Null/unavailable state;
- per-side values where needed;
- authority/provenance context where needed; and
- the structural/non-semantic claim boundary.

It must not clone two complete InstrumentPanels. Detailed single-result
surfaces remain the authority for deep inspection.

## 14. Control examples

### 14.1 STONE vs HOME

Using current established results:

- `V`: `EQUAL`, both `O -> U`;
- `Γ`: `DIFFERENT`, with `stone` retaining `S,T,N` and `home` retaining
  `HH,M`;
- ZC fields are compared exactly from their existing values;
- pronunciation authority remains side-specific; and
- no semantic explanation is emitted.

### 14.2 MAKE vs NAME

- `V`: `EQUAL`, both `E -> I`;
- `Γ`: `DIFFERENT`, with exact source order preserved;
- ZC may match on one or more summary fields without erasing Γ differences;
- no semantic inference is emitted.

### 14.3 STUDY vs STONE

- V and Γ relations are determined exactly;
- functional/evidence status may differ;
- reviewed evidence for `study` is never transferred to `stone`; and
- no winner is selected.

### 14.4 VALID vs PRONUNCIATION-NULL

- the valid side remains valid;
- the Null side remains Null;
- no orthographic fallback is created; and
- field relations expose the unavailable side explicitly.

## 15. Out of scope

This contract does not authorize:

- semantic or etymological comparison;
- consonant meanings or semantic shade inference;
- similarity, distance, percentage, ranking, or winner selection;
- candidate ranking or recommendation;
- historical priority or language-family inference;
- new evidence acquisition;
- Albanian expansion;
- FRD reopening;
- One-Embryo reopening;
- Diachronic v0.2;
- provider execution;
- new pronunciation authority;
- multi-word phrase, corpus, or batch comparison;
- more than two results;
- resurrection of the legacy `ComparePanel` as the contract model;
- redesign of the full `/chat` interface; or
- modification of existing analysis semantics.

## 16. Implementation gate

The next implementation lane may add a typed comparison projection and a
bounded user-facing surface only after this contract receives human review.

The implementation must preserve the existing single-result VM and all
single-result authority, Null, provenance, variant, candidate, and user-
decision behavior.

```text
CONTRACT_FROZEN=YES
IMPLEMENTATION_AUTHORIZED_BY_THIS_DOCUMENT=NO
MERGE_AUTHORIZED_BY_THIS_DOCUMENT=NO
```

## 17. Freeze declaration

```text
WORD_TO_WORD_COMPARISON_AUTHORITY=EXACT_FIELD_LEVEL_STRUCTURAL_AND_PROVENANCE_RELATIONS
LEGACY_COMPARE_PANEL_AUTHORITY=NONE
SEMANTIC_COMPARISON=NO
SCORING=NO
RANKING=NO
WINNER_SELECTION=NO
SOURCE_RESULT_MUTATION=NO
NEW_RESEARCH=NO
PROVIDER_EXECUTION=NO
SINGLE_RESULT_VM_CHANGE=NO
COMPARISON_TYPE_ADDITIVE_ONLY=YES
```
