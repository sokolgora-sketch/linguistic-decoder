# Open Instrument Moving Nucleus Additive Structural Contract v0.1

Date: 2026-09-28

Status: FROZEN_CONTRACT_PENDING_REVIEW.

Contract ID: `OPEN_INSTRUMENT_MOVING_NUCLEUS_ADDITIVE_STRUCTURAL_CONTRACT_V0_1`

## Scope

This contract freezes a research-only structural representation boundary for a
single spoken nucleus when an authorized upstream observation reports raw
segments, observed Voice anchors, or within-nucleus movement.

It separates:

1. observed nucleus identity and count;
2. observed within-nucleus movement;
3. observed Voice anchors;
4. pronunciation and observation provenance;
5. canonicalization status;
6. the existing canonical `normalizedVoicePath`.

This is an additive contract seam. It does not change the current P1 runtime,
the current `SpokenVowelNormalizationNucleusV0_1` output, or any production
consumer.

## Non-scope

This contract does not:

- classify diphthongs;
- classify hiatus;
- define timing, F1, F2, glide, or language-specific phonological rules;
- choose onset-only, endpoint-only, or all-anchor canonicalization;
- decide the `/stoʊn/` fixture;
- add an English diphthong table;
- create a new Voice;
- assign semantic meaning to a Voice or movement observation;
- change Seven-Voices doctrine, Level 3, or Level 4;
- wire spoken IPA into Analyze V1, `/chat`, or APIs;
- perform external or semantic research.

## Canonical Voice invariant

The canonical Voice set remains exactly:

`A`, `E`, `I`, `O`, `U`, `Y`, `Ë`.

The following are forbidden by this contract:

- an eighth Voice;
- a compound Voice identity;
- a diphthong Voice;
- a moving-nucleus Voice;
- a semantic meaning assigned to a phonetic observation;
- a new Level-3 atom or Level-4 rule.

Observed movement between canonical Voice anchors is an observation. It is not
a canonical Voice identity and is not a canonical path event.

## Observation model

The smallest conceptual observation record for one nucleus is:

```ts
type MovingNucleusObservationV0_1 = Readonly<{
  nucleusCount: 1;
  rawIpaSegments: readonly string[];
  observedAnchors: readonly VowelVoice[] | null;
  movement: "observed" | "not_observed" | "unknown";
  pronunciationProvenance: ExistingSpokenVowelProvenance;
  observationProvenance: MovingNucleusObservationProvenance | null;
  canonicalizationStatus:
    | "not_authorized"
    | "authorized"
    | "unresolved"
    | "unsupported";
  canonicalVoice: VowelVoice | null;
}>;
```

The exact implementation type is deferred to the review/implementation lane.
The existing `nuclei` container remains the preferred structural location.

`nucleusCount` is structural identity. It is not the number of raw segments,
observed anchors, or canonical Voice values.

`rawIpaSegments` preserves the observed raw segment evidence without asserting
that each segment is a separate nucleus.

`observedAnchors` is an ordered observation of zero or more canonical Voice
families supplied by authorized evidence. It is not a path and must not be
used as `normalizedVoicePath` automatically.

`movement: "observed"` records only that an authorized observation reports
within-nucleus movement. It does not specify why the realization qualifies as
movement or which phonetic threshold was used.

## Observation provenance

The representation must distinguish three provenance roles:

### Pronunciation provenance

The existing spoken-IPA provenance remains the owner of the supplied
pronunciation context, including source ID and whether it was supplied by the
user or a reviewed record.

### Observation provenance

An observed anchor or movement claim requires an additional,
evidence-traceable observation provenance seam containing, conceptually:

- an observation source or authority identifier;
- an observation authority/status;
- evidence references or a stable locator;
- the observation claim being supported.

Missing observation provenance requires `movement: "unknown"` and/or
`canonicalizationStatus: "unresolved"`; it cannot support a canonical result.

### Canonicalization provenance

If a future separately reviewed rule authorizes canonicalization, that rule
must carry its own authority and evidence references. Observation provenance
cannot substitute for canonicalization authority.

No canonicalization authority is granted by this freeze.

## Observation and canonicalization boundary

`OBSERVATION != CANONICALIZATION`.

`OBSERVED_ANCHORS != NORMALIZED_VOICE_PATH`.

Observed anchors may be preserved as structural/phonetic evidence while the
canonical path remains `null`.

Canonicalization status has four states:

- `not_authorized`: an observation exists, but no canonicalization rule is
  authorized;
- `authorized`: a separately frozen rule and provenance authorize a canonical
  value;
- `unresolved`: the observation or its interpretation is incomplete or
  conflicting;
- `unsupported`: the representation cannot safely express the supplied
  observation under the current contract.

This freeze authorizes none of the conversion policies represented by the
`authorized` state.

## Nucleus-count invariant

The following structures are not equivalent:

### One moving nucleus

```text
nucleusCount = 1
nucleus[0].observedAnchors = [O, U]
nucleus[0].movement = observed
canonicalizationStatus = unresolved or not_authorized
normalizedVoicePath = null
```

### Two sequential nuclei

```text
nucleusCount = 2
nucleus[0].canonicalVoice = O
nucleus[1].canonicalVoice = U
normalizedVoicePath = [O, U]
```

`ONE_MOVING_NUCLEUS_WITH_TWO_ANCHORS != TWO_SEQUENTIAL_NUCLEI`.

The number of observed anchors must never determine nucleus count.

## Observed-anchor invariant

Observed anchors are evidence-bearing observations inside one nucleus. They
are not ordered canonical path events.

An observation equivalent to one nucleus moving from an O-family realization
toward a U-family realization may preserve:

```text
observedAnchors = [O, U]
```

but must not imply:

```text
normalizedVoicePath = [O, U]
```

unless a future, separately frozen canonicalization rule explicitly permits
that conversion.

## Movement invariant

The contract may preserve the bounded fact that movement was observed. It does
not define the scientific criteria for movement.

The following remain outside this freeze:

- F1/F2 thresholds;
- timing thresholds;
- diphthong criteria;
- hiatus criteria;
- glide criteria;
- language-specific phonology;
- English-specific mappings;
- acoustic trajectory derivation.

If evidence cannot justify movement, the value is `unknown`, not a forced
positive or forced stable nucleus.

## Canonicalization boundary

`canonicalVoice` is zero or one scalar canonical Voice for this nucleus. It
must remain `null` when no separately authorized canonicalization rule exists.

`normalizedVoicePath` remains the existing flat canonical path owned by the
current spoken-vowel contract. This freeze does not redefine it and does not
permit observed anchors to populate it.

The following policies remain unauthorized:

- onset wins;
- endpoint wins;
- every observed anchor becomes a path event;
- a moving realization becomes a new Voice;
- a moving realization receives Level-3 or Level-4 meaning.

## Null rule

Null is required when any of the following holds:

- movement is observed but canonicalization is not authorized;
- observed anchors are absent or insufficient;
- observation provenance is missing;
- observations conflict;
- segmentation remains unresolved;
- a canonical result would require an unstated phonetic rule;
- a canonical result would require an unstated doctrine rule;
- the representation is structurally unsupported.

Null must not be replaced with a guessed Voice or path merely to avoid an
incomplete result.

## Flat-path safety rule

`WITHIN_NUCLEUS_OBSERVED_ANCHORS MUST NOT AUTOMATICALLY POPULATE normalizedVoicePath`.

The required negative case is:

```text
one moving nucleus
observedAnchors = [O, U]
canonicalizationStatus = unresolved
```

The safe canonical result is:

```text
normalizedVoicePath = null
```

This rule prevents a moving nucleus from colliding with two sequential
canonical nuclei and prevents accidental consumption by ordered Level-3 path
logic.

## Backward compatibility

Existing P1 semantics remain unchanged:

- simple monophthongs remain scalar canonical nuclei;
- schwa remains the existing `Ë` behavior;
- explicit sequential nuclei retain their existing flat path;
- explicit and implicit carriers retain their existing behavior;
- current ambiguous and unsupported cases remain Null/unsupported;
- `normalizedVoicePath` is not redefined.

The additive observation is ignorable by existing consumers until a separate
implementation and integration lane is reviewed and authorized.

## Stone firewall

The existing `/stoʊn/` fixture is a collision example only.

This contract establishes none of the following:

- `stone -> O`;
- `stone -> U`;
- `stone -> O -> U`;
- English `oʊ` as a canonical result.

`STONE_CANONICAL_RESULT_ESTABLISHED=NO`.

If future evidence establishes `/oʊ/` as one moving nucleus, this contract may
preserve that observation. Canonicalization still requires separate authority.

## Future authority requirement

Before any runtime or production consumer uses the additive representation,
a separate review must define and validate:

1. the upstream observation authority;
2. the observation provenance shape;
3. any stable nucleus/source-span representation;
4. the precise Null/unsupported behavior;
5. whether any canonicalization is authorized;
6. canonicalization provenance and tests;
7. protection against flattening one nucleus into a sequential path.

That future review must not alter the Seven-Voice set, assign semantics, or
authorize Level 3/Level 4 as a side effect.

## Current implementation boundary

This document intentionally changes no implementation, test, API, UI, SBR,
FRD-02, or production authority.

The current implementation references inspected for this freeze are:

- `src/shared/openInstrument/spokenVowelNormalization.v0_1.ts`
- `src/shared/vowels/extractCarrierVoicesFromIpa.v0.1.ts`
- `src/shared/vowels/parseIpaVowels.v0.2.ts`
- `src/shared/vowels/ipaVowelMap.v0.2.ts`
- `src/shared/openInstrument/doctrineLevel3ProofPair.v0_1.ts`

## Next stage

`MOVING_NUCLEUS_ADDITIVE_STRUCTURAL_CONTRACT_REVIEW`

No implementation or runtime integration begins until that review accepts the
contract.
