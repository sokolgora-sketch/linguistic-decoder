# Open Instrument — Consonant Structure Product Embryo v0.1

```text
CONTRACT_ID=OPEN_INSTRUMENT_CONSONANT_STRUCTURE_PRODUCT_EMBRYO_V0_1
VERSION=v0.1
STATUS=FROZEN_PRODUCT_CONTRACT_ONLY
```

## 1. Purpose

This contract defines the smallest truthful product surface for consonant
information already retained by the production spoken-pronunciation path.
It exposes ordered source pronunciation segments without adding phonetic,
phonological, structural, semantic, or functional interpretation.

The authority chain remains:

```text
bundled CMUdict ARPAbet pronunciation
  -> existing spoken normalization / canonical Voice path
  -> this presentation projection
```

This contract does not change the pronunciation lookup, Voice mapping,
moving-nucleus canonicalization, Heart, Math7, analysis status, candidate
semantics, or any production authority.

## 2. Authoritative input

The only authoritative input is the existing
`heartInstrumentV1.spokenPronunciation` result produced by the bundled
CMUdict-derived ARPAbet profile:

```text
sourceProfileId=open-instrument.cmudict-arpabet-en-us.v0_1
sourceNotation=ARPABET
```

The projection reads, without reinterpretation:

- `status`;
- `reasonCode`;
- `sourceProfileId`;
- `sourceNotation`;
- `sourceRevision`;
- each existing pronunciation variant and its `variantId` and `variantOrder`;
- each existing `normalizedSegments` entry whose `kind` is `consonant`;
- each retained `segmentIndex` and `sourceUnits` value.

No spelling-derived `consonants` field, orthographic cluster, carrier record,
research artifact, or synthetic FRD-02 output is an input to this projection.

## 3. Projection

The future adapter may derive a presentation value equivalent to:

```ts
type PronunciationConsonantSegmentV0_1 = Readonly<{
  segmentIndex: number;
  sourceUnits: readonly string[];
  kind: "consonant";
}>;

type PronunciationConsonantVariantV0_1 = Readonly<{
  variantId: string;
  variantOrder: number;
  sourceForm: string;
  sourcePronunciation: string;
  segments: readonly PronunciationConsonantSegmentV0_1[];
}>;

type PronunciationConsonantSurfaceV0_1 = Readonly<{
  status: "defined" | "null";
  reasonCode: string | null;
  sourceProfileId: string;
  sourceNotation: string;
  sourceRevision: string;
  variants: readonly PronunciationConsonantVariantV0_1[];
}>;
```

Segments retain source order by ascending `segmentIndex`. A source token is
shown exactly as retained by the pronunciation authority. No token is split,
renamed, transliterated, grouped into a cluster, or assigned a feature class.

The projection is non-semantic and deterministic. It is a view of existing
source pronunciation structure, not a new analysis result.

## 4. Variant and Null behavior

- Preserve existing variant identity and order.
- Never choose a first, majority, or otherwise preferred pronunciation.
- If the existing spoken result is `defined`, expose consonant segments per
  retained variant; do not collapse differing variant segment sequences.
- If the existing spoken result is `null`, expose the existing `reasonCode`
  and no canonical consonant structure.
- `PRONUNCIATION_NOT_FOUND`,
  `PRONUNCIATION_VARIANT_AMBIGUOUS`, unsupported-vowel reasons, and other
  existing pronunciation reasons remain unchanged.
- An empty consonant list is valid for a defined vowel-only pronunciation.
- Missing pronunciation never falls back to written consonant letters.

## 5. User-facing terminology

Permitted labels are:

- `Pronunciation consonant segments`;
- `ARPAbet source segments`;
- `source order`;
- `variant`;
- `pronunciation unavailable` or the exact existing Null reason.

The surface must keep the existing hierarchy visible:

```text
spoken pronunciation authority -> canonical spoken Voice path
```

Written-letter information, if already shown elsewhere, remains explicitly
`ORTHOGRAPHIC` and `NON-AUTHORITATIVE` for canonical spoken analysis.

## 6. Explicit non-authority

This contract does not authorize or imply:

- ARPAbet-to-IPA conversion;
- place, manner, voicing, sonority, or other phonetic feature assignment;
- phonological consonant classes;
- onset, nucleus, coda, CV, VC, CVC, syllable, or cluster segmentation;
- consonant shade, consonant meaning, functional meaning, or semantic claims;
- carrier classification as consonant pronunciation evidence;
- structural-hypothesis or FRD-02 inference in production;
- historical, etymological, lexical, or origin claims;
- orthographic substitution when pronunciation is absent;
- any new pronunciation variant resolution rule.

`kind=consonant` means only that the existing ARPAbet normalizer did not
classify the retained source token as a supported vowel nucleus. It is not a
place/manner/voicing claim.

## 7. API, adapter, and UI boundary

The current API already transports the complete `heartInstrumentV1` packet.
The smallest future implementation may add an optional VM projection from
that packet in the existing contract adapter. No API redesign or new engine
field is required by this contract.

The future UI may show the projection near the existing spoken-pronunciation
overview or detailed provenance. It must not replace the existing provenance
surface and must not present the projection as a second canonical Voice path.

## 8. Production and research firewalls

This contract is production presentation authority only for the bounded source
segment view. It does not promote:

- FRD-02 synthetic calibration or any future real-data FRD-02 result;
- structural hypothesis discovery;
- reviewed evidence carriers;
- legacy spelling-based consonant summaries;
- provider output;
- Albanian research artifacts;

into spoken-pronunciation authority.

## 9. Acceptance examples

The following examples specify source-preserving expectations only:

| Word | Existing source pronunciation | Ordered source consonant segments | Canonical Voice path |
|---|---|---|---|
| `stone` | `S T OW1 N` | `S`, `T`, `N` | `O -> U` |
| `mother` | `M AH1 DH ER0` | `M`, `DH` | existing path only; no consonant feature claim |
| `cat` | `K AE1 T` | `K`, `T` | `A` |

The displayed segments are source tokens, not phonetic feature labels. For an
unknown pronunciation, the expected result is the existing pronunciation Null
reason and no spelling-derived replacement.

## 10. Backwards compatibility and implementation limit

The future implementation must be additive and preserve all existing API,
VM, analysis, Voice-path, variant, and Null behavior. It must not modify
CMUdict data, pronunciation normalization, canonicalization, Heart, Math7,
Level-3, functional discovery, or `/chat` analysis semantics.

This contract authorizes one bounded implementation lane only:

```text
CONSONANT_STRUCTURE_PRODUCT_EMBRYO_V0_1_IMPLEMENTATION
```

No second product contract, source expansion, phonetic classifier, or research
experiment is authorized by this document.

## 11. Freeze declaration

```text
PRODUCT_EMBRYO_AUTHORITY=ORDERED_ARPABET_PRONUNCIATION_SEGMENTS_ONLY
ORTHOGRAPHIC_CONSONANTS_AS_SPOKEN_EVIDENCE=NO
PHONETIC_FEATURE_CLASSIFICATION=NO
SEMANTIC_OR_FUNCTIONAL_CONSONANT_INTERPRETATION=NO
FRD02_PRODUCTION_PROMOTION=NO
API_REDESIGN=NO
PRONUNCIATION_AUTHORITY_CHANGED=NO
CANONICAL_VOICE_MAPPING_CHANGED=NO
```

