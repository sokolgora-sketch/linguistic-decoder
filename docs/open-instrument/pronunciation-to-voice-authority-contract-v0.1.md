# Open Instrument pronunciation-to-Voice authority contract v0.1

Date: 2026-09-29

Status: `FROZEN_AUTHORITY_CONTRACT_ONLY`.

Runtime state: `NOT_IMPLEMENTED`.

Contract ID: `OPEN_INSTRUMENT_PRONUNCIATION_TO_VOICE_AUTHORITY_CONTRACT_V0_1`

Version: `v0.1`

This contract closes the authority gap identified by the Lane 3 spoken-first
runtime inspection. It authorizes a bounded pronunciation-source profile to
describe pronunciation units, spoken-nucleus structure, and Voice-family
classification. It does not vendor a source, implement an adapter, or wire a
runtime consumer.

## Authority chain

The only permitted conceptual chain is:

```text
LEXICAL_WORD
  -> SOURCE_PRONUNCIATION
  -> NORMALIZED_PHONETIC_REPRESENTATION
  -> SPOKEN_NUCLEUS_OR_NUCLEI
  -> VOICE_FAMILY_AUTHORITY
  -> MOVING_NUCLEUS_CANONICALIZATION_WHEN_APPLICABLE
  -> CANONICAL_SEVEN_VOICE_EVENTS
```

The stages remain distinct:

```text
SOURCE_PRONUNCIATION_NOTATION != NORMALIZED_PHONETIC_REPRESENTATION
NORMALIZED_PHONETIC_REPRESENTATION != VOICE_FAMILY_CLASSIFICATION
VOICE_FAMILY_CLASSIFICATION != CANONICALIZATION
SPELLING != SPOKEN_PRONUNCIATION_AUTHORITY
```

No stage may substitute orthographic letters for missing pronunciation data.

The canonical inventory remains exactly:

```text
A, E, I, O, U, Y, Ë
```

No new Voice is created.

## Source notation boundary

`SOURCE_NOTATION != CANONICAL_VOICE_AUTHORITY`.

A source adapter must declare its notation explicitly. v0.1 permits the
following source-notation classes:

- `ARPABET`;
- `IPA`;
- a future named language-specific pronunciation notation reviewed under a
  separate source profile.

ARPAbet must never be labeled as IPA. A source-specific adapter may transform
its notation into the normalized representation below, but the transformation
must be deterministic, testable, source-scoped, and provenance-preserving.

## Normalized phonetic representation

The smallest normalized representation is an ordered sequence of source-backed
segments. Each segment records:

```text
segmentIndex
kind = consonant | monophthong_nucleus | moving_nucleus | stress | boundary | unsupported_vowel
sourceUnits
stress = 0 | 1 | 2 | null
nucleusIndex = integer | null
sourceProfileId
```

The representation must preserve:

- segment order;
- nucleus order;
- one-nucleus identity;
- moving-nucleus identity;
- source notation and source units;
- source entry, variant, and revision provenance.

Stress and prosodic annotations are metadata. They do not create Voice events.
Consonants do not create Voice events. Orthographic letters do not enter this
representation merely because they occur in the lexical spelling.

The normalized structure states are:

- `ONE_STABLE_NUCLEUS`;
- `ONE_MOVING_NUCLEUS`;
- `SEQUENTIAL_NUCLEI`;
- `UNRESOLVED`.

`ONE_MOVING_NUCLEUS` means one source-authorized pronunciation unit with
ordered movement anchors. It does not mean two spoken nuclei.

## Monophthong Voice-family authority

A qualified monophthong nucleus receives exactly one Voice-family anchor:

```text
QUALIFIED_MONOPHTHONG_NUCLEUS -> [X]
```

The Voice-family claim must carry the reviewed mapping identity:

```text
authorityType = REVIEWED_OPEN_INSTRUMENT_MAPPING
mappingId = pronunciation-to-voice.<source-profile>.v0_1
```

The mapping is source-profile authority, not a nearest-vowel heuristic. An
unsupported, ambiguous, conflicted, or absent classification produces a Null
canonical contribution.

The existing coarse IPA family map remains the reference for already-covered
IPA family assignments. This contract does not replace it or silently broaden
its empirical scope. Source profiles must declare their own traceable mapping
to the same canonical Voice inventory.

## Moving-nucleus authority

Generic adjacent IPA characters remain insufficient:

```text
PLAIN_IPA_ADJACENCY_INSUFFICIENT=YES
```

A source profile may establish `ONE_MOVING_NUCLEUS` only when its notation has
an atomic source category that the profile explicitly defines as one moving
spoken nucleus. This is source-specific authority, not a generic rule for
adjacent symbols.

For a qualified moving nucleus, the source profile must provide exactly two
ordered canonical Voice-family anchors:

```text
ONE_MOVING_NUCLEUS + [X,Y] -> existing canonicalizer -> [X,Y]
```

The existing `movingNucleusObservationAuthority.v0_1` validator remains the
required gate. The existing `movingNucleusCanonicalization.v0_1` function
remains the sole canonicalization authority. This contract does not duplicate
or alter its `[X,Y] -> [X,Y]` rule.

## CMUdict ARPAbet source profile

The first intended runtime source profile is English CMUdict-derived ARPAbet:

```text
sourceProfileId = open-instrument.cmudict-arpabet-en-us.v0_1
sourceNotation = ARPABET
languageScope = English
dialectScope = CMUdict documented English pronunciation inventory
stressDigits = 0 | 1 | 2
```

The profile is bounded to the source inventory. It does not establish
pronunciation authority for Albanian or any other language.

The source identity inspected for this freeze is:

```text
repository = https://github.com/cmusphinx/cmudict.git
revision = 74790861f652b15e4ac49015a90074ad62a27690
data = cmudict.dict
dataSha256 = 81917843c7f44ce2b094ac63873c2c7a4cf802040792c455ba3ca406891c3d22
dataBytes = 3618488
licenseSha256 = bd4ce8e44170a5f9f481310ca85c51de3c4f851a65e679b40e603b143bd3542a
symbolsSha256 = 408ccaae803641c6d7b626b6299949320c2dbca96b2220fd3fb17887b023b027
phonesSha256 = ffb588a5e55684723582c725e1d2f9f9adb130011392d9e59237c76e34c2cfd6
```

The CMUdict base vowel inventory is the complete set:

```text
AA AE AH AO AW AY EH ER EY IH IY OW OY UH UW
```

Stress-bearing forms such as `AA0`, `AA1`, and `AA2` normalize to the same
base source category before Voice classification. Stress remains provenance
metadata and does not create a Voice event.

### Complete CMUdict vowel profile

| Base symbol | Classification | Ordered Voice anchor(s) | Status |
| --- | --- | --- | --- |
| `AA` | `SUPPORTED_MONOPHTHONG` | `[A]` | supported |
| `AE` | `SUPPORTED_MONOPHTHONG` | `[A]` | supported |
| `AH` | `SUPPORTED_MONOPHTHONG` | `[Ë]` | supported |
| `AO` | `SUPPORTED_MONOPHTHONG` | `[O]` | supported |
| `AW` | `SUPPORTED_MOVING_NUCLEUS` | `[A,U]` | supported |
| `AY` | `SUPPORTED_MOVING_NUCLEUS` | `[A,I]` | supported |
| `EH` | `SUPPORTED_MONOPHTHONG` | `[E]` | supported |
| `ER` | `SUPPORTED_MONOPHTHONG` | `[Ë]` | supported |
| `EY` | `SUPPORTED_MOVING_NUCLEUS` | `[E,I]` | supported |
| `IH` | `SUPPORTED_MONOPHTHONG` | `[I]` | supported |
| `IY` | `SUPPORTED_MONOPHTHONG` | `[I]` | supported |
| `OW` | `SUPPORTED_MOVING_NUCLEUS` | `[O,U]` | supported |
| `OY` | `SUPPORTED_MOVING_NUCLEUS` | `[O,I]` | supported |
| `UH` | `SUPPORTED_MONOPHTHONG` | `[U]` | supported |
| `UW` | `SUPPORTED_MONOPHTHONG` | `[U]` | supported |

No CMUdict vowel category is silently omitted. Categories outside this table
are `UNSUPPORTED_PENDING_AUTHORITY` until a separate source-profile review.

The moving categories are source-atomic. They are not inferred by detecting
adjacent IPA characters:

```text
OW -> ONE_MOVING_NUCLEUS -> [O,U]
AY -> ONE_MOVING_NUCLEUS -> [A,I]
EY -> ONE_MOVING_NUCLEUS -> [E,I]
OY -> ONE_MOVING_NUCLEUS -> [O,I]
AW -> ONE_MOVING_NUCLEUS -> [A,U]
```

The mapping is pronunciation-category authority only. It is not:

- a spelling rule;
- a silent-e rule;
- a word-specific rule;
- an etymological rule;
- an acoustic measurement claim;
- a universal phonetic law.

## Required acceptance chains

The following are category examples, not word-specific exceptions:

```text
stone -> source OW -> ONE_MOVING_NUCLEUS -> [O,U] -> existing canonicalizer -> [O,U]
make  -> source EY -> ONE_MOVING_NUCLEUS -> [E,I] -> existing canonicalizer -> [E,I]
time  -> source AY -> ONE_MOVING_NUCLEUS -> [A,I] -> existing canonicalizer -> [A,I]
home  -> source OW -> ONE_MOVING_NUCLEUS -> [O,U] -> existing canonicalizer -> [O,U]
name  -> source EY -> ONE_MOVING_NUCLEUS -> [E,I] -> existing canonicalizer -> [E,I]
cat   -> source AE -> ONE_STABLE_NUCLEUS -> [A]
```

The final orthographic `e` in `stone`, `make`, `time`, `home`, and `name` has
no authority in these chains:

```text
STONE_FINAL_ORTHOGRAPHIC_E_SPOKEN_AUTHORITY=NO
```

## Sequential nuclei

Multiple source-authorized nuclei remain ordered sequential nuclei. Each
monophthong contributes one Voice event. Each independently qualified moving
nucleus is passed through the existing canonicalizer independently. The
runtime must not collapse sequential nuclei into one moving nucleus and must
not treat a moving nucleus as two spoken nuclei.

If a source cannot distinguish the structure, the normalized structure is
`UNRESOLVED` and the canonical spoken path is Null.

## Variant policy

Each pronunciation variant is normalized independently.

1. If every supported variant yields the same canonical Voice path, that path
   may be used while preserving all variant provenance.
2. If supported variants yield different paths, the aggregate result is Null
   with `PRONUNCIATION_VARIANT_AMBIGUOUS` unless a separate reviewed selection
   rule exists.
3. If any variant is unsupported and another variant is supported, variants
   must not be silently discarded. The aggregate result is Null with
   `PRONUNCIATION_VARIANT_AMBIGUOUS`.
4. If all variants are unsupported because of their vowel categories, the
   aggregate result is Null with `PRONUNCIATION_VOWEL_CATEGORY_UNSUPPORTED`.

No variant winner is selected by source order, lexical spelling, or convenience.

## Null and failure policy

```text
NO_PRONUNCIATION_ENTRY
  -> PRONUNCIATION_NOT_FOUND
  -> canonical spoken Voice path = NULL

UNSUPPORTED_SOURCE_NOTATION
  -> PRONUNCIATION_SOURCE_UNSUPPORTED
  -> canonical spoken Voice path = NULL

UNSUPPORTED_VOWEL_CATEGORY
  -> PRONUNCIATION_VOWEL_CATEGORY_UNSUPPORTED
  -> canonical spoken Voice path = NULL

UNRESOLVED_NUCLEUS_STRUCTURE
  -> SPOKEN_NUCLEUS_STRUCTURE_UNRESOLVED
  -> canonical spoken Voice path = NULL

MOVING_NUCLEUS_WITHOUT_REQUIRED_AUTHORITY
  -> MOVING_NUCLEUS_AUTHORITY_MISSING
  -> canonical spoken Voice path = NULL

VOICE_FAMILY_CLASSIFICATION_MISSING
  -> VOICE_FAMILY_AUTHORITY_MISSING
  -> canonical spoken Voice path = NULL
```

The v0.1 runtime must not use G2P, a provider, model output, spelling
heuristics, silent-letter rules, or an orthographic fallback. In particular:

```text
NO_PRONUNCIATION_ENTRY -> CANONICAL_SPOKEN_VOICE_PATH=NULL
ORTHOGRAPHIC_FALLBACK=NO
G2P=NO
PROVIDER=NO
```

## Relation to moving-nucleus observation authority

For a source-qualified moving unit, an adapter may construct the existing
observation-authority shape with:

- source pronunciation and source profile in claim-specific provenance;
- normalized IPA units in `nucleusStructure.rawIpaSegments` only when the
  source actually supplies IPA;
- for a non-IPA source such as ARPAbet, `nucleusStructure.rawIpaSegments`
  remains an empty array and the raw source units remain in the adapter's
  source-notation provenance and `source_description` phonetic anchors;
- ARPAbet must never be copied into the field named `rawIpaSegments`;
- `nucleusStructure.state = ONE_NUCLEUS`;
- `movement.state = OBSERVED`;
- ordered source phonetic anchors in `phoneticAnchors`;
- ordered canonical Voice-family anchors in `voiceFamilyAnchors`;
- `authorityByClaim.voiceFamilyAnchors` identifying the reviewed mapping;
- `canonicalizationStatus = not_authorized` until the existing canonicalizer
  consumes the validated observation.

For the CMUdict profile, the bounded movement claim is represented as
`PHONOLOGICALLY_DOCUMENTED` with an explicit source-profile claim such as
`CMUdict ARPAbet atomic OW category is one moving spoken nucleus`. This is a
source-scoped symbolic claim, not acoustic evidence. The adapter must preserve
the raw ARPAbet token, stress digit, source entry, variant identity, and source
revision outside the IPA-specific field.

The adapter must not bypass or weaken
`movingNucleusObservationAuthority.v0_1`. Missing provenance, missing mapping
authority, unsupported categories, conflicting variants, or incompatible scope
must fail validation and remain Null.

## Scientific boundary

This contract authorizes bounded symbolic pronunciation-category structure only.
It does not establish:

- speaker-specific acoustic observation;
- universal phonetic truth;
- cross-dialect identity;
- cross-language identity;
- acoustic trajectory measurement;
- generic IPA-adjacency interpretation;
- semantic authority;
- consonant semantics;
- historical etymology, borrowing, or cognacy.

CMUdict-derived authority is bounded to its documented English pronunciation
inventory and source scope. Future languages require their own reviewed
source-profile authority.

## Runtime and lane boundaries

This freeze changes no runtime behavior and authorizes no production wiring.

```text
VENDOR_CMUdict=NO
ARPABET_ADAPTER_IMPLEMENTED=NO
SPOKEN_FIRST_RUNTIME_IMPLEMENTED=NO
API_CHANGED=NO
CHAT_CHANGED=NO
HEART_CHANGED=NO
MATH7_CHANGED=NO
G2P_ADDED=NO
PROVIDER_ADDED=NO
MOVING_NUCLEUS_CANONICALIZER_CHANGED=NO
LEVEL3_CHANGED=NO
LEVEL4_CHANGED=NO
SBR_CHANGED=NO
FRD02_CHANGED=NO
```

The next lane may implement a bundled source adapter against this contract.
That adapter must preserve all source, variant, structure, Voice-family, Null,
and provenance boundaries defined here.
