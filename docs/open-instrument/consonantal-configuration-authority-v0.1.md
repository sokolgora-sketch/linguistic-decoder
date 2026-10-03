# Open Instrument — Consonantal Configuration Authority v0.1

```text
CONTRACT_ID=OPEN_INSTRUMENT_CONSONANTAL_CONFIGURATION_AUTHORITY_V0_1
VERSION=v0.1
STATUS=FROZEN_STRUCTURAL_AUTHORITY_CONTRACT_ONLY
FUNCTIONAL_BRIDGE_AUTHORITY=NO
```

## 1. Purpose

This contract freezes the smallest deterministic structural representation of
pronunciation-derived consonantal configuration relative to the existing
canonical spoken Voice path.

It operates only on the already-authoritative spoken-pronunciation result:

```text
bundled CMUdict ARPAbet pronunciation
  -> existing normalized source segments and source nuclei
  -> existing canonical Voice events
  -> this source-order configuration representation
```

This contract does not establish consonant meaning, functional contribution,
semantic composition, phonological role, or a future product interpretation.

The progression remains:

```text
source pronunciation
  -> deterministic structural configuration
  -> possible future functional-composition authority
```

The second arrow is not authorized here.

## 2. Source authority and input

The only admissible input is a defined variant of the existing
`PronunciationToVoiceResultV0_1` produced by the bundled CMUdict-derived
profile:

```text
sourceProfileId=open-instrument.cmudict-arpabet-en-us.v0_1
sourceNotation=ARPABET
```

The authority is bound to the existing `sourceRevision`, `variantId`,
`variantOrder`, `sourceUnits`, `normalizedSegments`, `nuclei`, and
`canonicalVoicePath` fields. No spelling-derived consonant field,
orthographic cluster, carrier record, research artifact, or synthetic FRD-02
output is admissible input.

The existing source sequence is ordered by `normalizedSegments.segmentIndex`.
The existing `nuclei` sequence is ordered by `nucleusIndex`. A source nucleus
is the existing normalized source vowel segment and its corresponding existing
`nuclei` entry; it is not a canonical Voice event.

## 3. Source nucleus and canonical Voice event model

Each source nucleus retains:

- its source token, such as `OW1`;
- its `nucleusIndex`;
- its source segment index, resolved from the matching normalized segment;
- its existing nucleus kind, either `monophthong_nucleus` or
  `moving_nucleus`;
- its existing `voiceAnchors`.

The canonical Voice event sequence is the ordered concatenation of each
source nucleus's existing `voiceAnchors`. It is a derived event sequence, not
a replacement for source nuclei.

Repeated canonical Voice events do not collapse distinct source nuclei.
Distinct source nuclei do not become one source nucleus merely because their
canonical Voice events are equal.

## 4. Structural vocabulary

The following terms describe source order only.

### SOURCE_PREFIX_REGION

The ordered consonant segments whose `segmentIndex` is less than the source
segment index of the first source nucleus.

```text
PHONOLOGICAL_CLAIM=NO
FUNCTIONAL_CLAIM=NO
SEMANTIC_CLAIM=NO
```

### SOURCE_INTER_NUCLEUS_REGION

For adjacent source nuclei `left` and `right`, the ordered consonant segments
whose `segmentIndex` is greater than `left`'s source segment index and less
than `right`'s source segment index.

The region is keyed by source `left.nucleusIndex` and `right.nucleusIndex`.
It is not keyed by canonical Voice-event indices.

```text
PHONOLOGICAL_CLAIM=NO
FUNCTIONAL_CLAIM=NO
SEMANTIC_CLAIM=NO
```

### SOURCE_SUFFIX_REGION

The ordered consonant segments whose `segmentIndex` is greater than the source
segment index of the final source nucleus.

```text
PHONOLOGICAL_CLAIM=NO
FUNCTIONAL_CLAIM=NO
SEMANTIC_CLAIM=NO
```

Empty regions are valid. Repeated consonant source units remain repeated.
Multiple consonants remain ordered and are not grouped into a phonological
cluster.

The terms `onset`, `coda`, `syllable`, `cluster`, `place`, `manner`,
`voicing`, and `sonority` are not part of this authority.

## 5. Configuration representation

For each defined pronunciation variant, the conceptual configuration contains
only existing source-bound values and deterministic source-order relations:

```text
variantId
variantOrder
sourceProfileId
sourceNotation
sourceRevision
sourceSegments = existing normalizedSegments, in segmentIndex order
sourceNuclei = existing nuclei, in nucleusIndex order, with their matching
               source segment indices
canonicalVoiceEvents = existing per-nucleus voiceAnchors in source order
consonantRegions = SOURCE_PREFIX_REGION,
                   zero or more SOURCE_INTER_NUCLEUS_REGION entries,
                   SOURCE_SUFFIX_REGION
```

Each consonant region retains the existing consonant segment's
`segmentIndex` and `sourceUnits`. No token is split, renamed, transliterated,
reordered, grouped, or assigned a feature class.

The representation is source-relative. A canonical Voice path is not treated
as a source segmentation.

## 6. Configuration signature

A deterministic structural signature may include:

- source profile, notation, and revision;
- variant identity and order;
- ordered source nucleus tokens and kinds;
- each source nucleus's existing canonical Voice anchors;
- each region kind and source-nucleus anchor;
- ordered consonant `segmentIndex` and exact `sourceUnits`.

Raw consonant identity is retained because it is an existing authoritative
source fact and is required to distinguish configurations such as `S T OW1 N`
and `HH OW1 M`. This retention does not assign a meaning to either token.

The signature must not include spelling, word meaning, etymology, phonological
features, archetypes, energy, polarity, semantic labels, or functional
contributions.

The same authoritative input and the same frozen source-order rules produce
the same configuration and signature.

## 7. Moving-nucleus boundary

Canonical Voice-event boundaries must not be confused with source-segment
boundaries.

For a moving source nucleus such as `OW1`, the existing canonicalizer may emit
`[O, U]`. This creates two canonical Voice events from one source nucleus. It
does not create a source consonant region between `O` and `U`.

The same rule applies to the existing moving categories:

```text
OW -> [O, U]
AY -> [A, I]
EY -> [E, I]
OY -> [O, I]
AW -> [A, U]
```

All consonant regions remain anchored to source nuclei, never to individual
canonical Voice events.

## 8. Variant behavior

A configuration is derived independently for each retained pronunciation
variant. Existing `variantId` and `variantOrder` are preserved.

No first-variant, majority, or other new winner is selected. If the existing
top-level pronunciation result is Null because variants disagree, the
configuration authority returns configuration Null at the top level while
retaining variant-level source data only as existing provenance. A future
consumer must not select a variant through this contract.

Same-path variants remain separate variants even when their canonical Voice
paths agree.

## 9. Null behavior

The configuration is Null when the existing pronunciation result is Null,
including:

- `PRONUNCIATION_NOT_FOUND`;
- `PRONUNCIATION_VARIANT_AMBIGUOUS`;
- unsupported vowel categories;
- unresolved spoken nucleus structure;
- missing Voice-family or moving-nucleus authority.

No configuration is derived from spelling, a legacy consonant extractor, or a
written-letter fallback.

## 10. Provenance and determinism

Every defined configuration remains traceable to:

- the CMUdict source profile;
- source notation and revision;
- pronunciation variant identity and order;
- existing source units and segment indices;
- existing source nuclei and canonicalization records.

This is a structural source-observation contract. It is not a semantic,
functional, historical, etymological, or origin authority.

## 11. Configuration/function boundary

A deterministic difference in consonantal configuration does not by itself
establish a functional or semantic difference.

Therefore:

```text
STONE_CONFIGURATION != HOME_CONFIGURATION
does not imply
STONE_FUNCTION != HOME_FUNCTION
```

This contract grants no `(Voice, configuration) -> functional output` rule.
Any future functional bridge requires a separate reviewed authority with
explicit provenance, Null behavior, and claim boundaries.

## 12. Level-3 and FRD-02 boundaries

Level-3 Voice-pair authority remains unchanged and operates on canonical Voice
paths. It does not authorize consonant semantics or consonant-to-Voice
mapping.

FRD-02 synthetic calibration and any future real-data FRD-02 result are not
inputs to this configuration authority and are not promoted into product
functional truth.

## 13. Forbidden inferences

This contract does not authorize:

- onset, coda, syllable, CV, VC, CVC, or cluster claims;
- place, manner, voicing, sonority, or other phonetic classification;
- individual consonant meanings or consonant shades;
- semantic polarity or functional contribution;
- word meaning, lexical relation, etymology, historical origin, or cognacy;
- orthographic-to-pronunciation inference or G2P;
- new pronunciation variant resolution;
- automatic functional candidate generation;
- Level-3 modification;
- FRD-02 execution or production promotion.

## 14. Freeze declaration

```text
SOURCE_ORDER_CONFIGURATION_AUTHORITY=YES
SOURCE_NUCLEUS_TO_CANONICAL_EVENT_RELATION=EXISTING_AUTHORITY_ONLY
MOVING_NUCLEUS_CREATES_SOURCE_CONSONANT_REGION=NO
PHONOLOGICAL_ROLE_AUTHORITY=NO
CONSONANT_MEANING_AUTHORITY=NO
FUNCTIONAL_COMPOSITION_AUTHORITY=NO
SEMANTIC_AUTHORITY=NO
ORTHOGRAPHIC_AUTHORITY=NO
G2P_AUTHORITY=NO
LEVEL3_CHANGED=NO
FRD02_PROMOTION=NO
```

This contract authorizes documentation and future structural projection only.
It does not authorize runtime implementation in this lane.
