# Open Instrument Albanian source input authority contract v0.1

Date: 2026-09-30

Status: `FROZEN_DOCTRINE_CONTRACT`.

Contract ID: `OPEN_INSTRUMENT_ALBANIAN_SOURCE_INPUT_AUTHORITY_CONTRACT_V0_1`.

Version: `v0.1`.

This contract freezes project doctrine for processing the frozen Albanian
Wiktionary → Wiktextract → Kaikki pronunciation source profile before
phonological-category projection. It is an engineering/input-authority
contract, not an externally proven linguistic finding.

## 1. Scope and authority layering

The authority chain is:

```text
ALBANIAN SOURCE OBSERVATION
  → ALBANIAN SOURCE INPUT AUTHORITY
  → ALBANIAN PHONOLOGICAL CATEGORY MATRIX
  → ALBANIAN PRE-VOICE CATEGORY RESULT
  → future/otherwise-authorized downstream interpretation
```

This contract owns only source-input processing: notation classification,
whole-string IPA tokenization, and ordered nucleus-candidate extraction.

It does not replace or extend the following authorities:

```text
SOURCE_CONTRACT != SOURCE_INPUT_AUTHORITY
SOURCE_INPUT_AUTHORITY != PHONOLOGICAL_CATEGORY_AUTHORITY
PHONOLOGICAL_CATEGORY_AUTHORITY != VOICE_AUTHORITY
```

The existing source contract remains authoritative for source identity,
provenance, scope, variant preservation, and source-level Null behavior. The
existing Albanian IPA category matrix remains authoritative for whether an
extracted candidate receives a positive category. This contract does not
manufacture missing profile/category cells.

## 2. Frozen source profile

These rules apply only to:

```text
PROFILE_ID = open-instrument.wiktionary-kaikki-albanian-ipa.v0_1
LANGUAGE = Albanian
LANGUAGE_CODE = sq
SOURCE_FAMILY = English Wiktionary → Wiktextract → Kaikki Albanian JSONL
```

The frozen source artifact remains hash-bound by the existing source contract.
These rules do not generalize automatically to another source, language,
extractor, notation convention, or mutable live artifact.

## 3. Notation doctrine

For this frozen source profile, source wrappers are classified by project
doctrine as:

```text
/.../  → PHONEMIC
[...]  → PHONETIC
```

This adoption is deterministic project doctrine for the named frozen source
profile. It is supported by the preserved raw IPA representation, the source
provenance, and the documented Wiktionary IPA/template convention. It does
not prove the phonological correctness of any individual source entry, and it
does not generalize to unrelated sources.

The raw pronunciation string remains preserved. Wrapper classification must
be explicit and must not be treated as a phonological category, a Voice
mapping, or evidence that every symbol inside the string is independently
authorized.

The current source-observation adapter historically emitted
`notationKind=UNSPECIFIED`. This contract authorizes a future input-processing
step to classify wrappers for this exact source profile; it does not silently
rewrite existing observations or modify the adapter in this contract-only
lane.

## 4. Whole-string tokenization

A complete IPA pronunciation string may be tokenized as one pronunciation
representation. An atomic vowel-only input is not required.

The repository's existing generic IPA tokenizer may be reused as the
implementation primitive where compatible:

```text
src/shared/ipa/ipaClassify.v0.1.ts
  → tokenizeIpaSegmentsV0_1
```

Tokenization is structural only. It does not assign Seven-Voice meaning,
phonological category, semantic meaning, etymology, or pronunciation
authority.

Examples of complete accepted representations include:

```text
/yɫ/
/tʃun/
```

The existing generic tokenizer's normalization behavior must not be used to
silently discard source features. In particular, the current generic
normalizer drops stress and length marks. A future implementation must
preserve raw IPA and preserve length, nasalization, and other supported
features in a separate representation before or alongside any compatible
structural tokenization.

## 5. Nucleus-candidate extraction

Within a qualified Albanian IPA pronunciation:

- an IPA vowel token recognized by the frozen Albanian IPA-category authority
  is a `NUCLEUS_CANDIDATE`;
- consonantal tokens are non-nuclear structural context;
- surrounding consonants do not prevent extraction of an otherwise authorized
  vowel candidate;
- candidates retain their original left-to-right order;
- extraction does not itself assign a phonological category;
- extraction does not itself establish a moving nucleus, sequential nuclei,
  glide relation, or canonical Voice event.

The extraction result is therefore an ordered structural representation, not a
Seven-Voice path.

The frozen parsing examples are:

```text
yll /yɫ/
  → complete pronunciation accepted
  → y extracted as an ordered nucleus candidate
  → ɫ retained as non-nuclear context
  → category lookup delegated to the frozen Albanian matrix

çun /tʃun/
  → complete pronunciation accepted
  → u extracted as an ordered nucleus candidate
  → tʃ and n retained as non-nuclear context
  → category lookup delegated to the frozen Albanian matrix
```

These are contract examples only. They are not lexical exceptions and do not
authorize a word-specific implementation.

## 6. Complex-nucleus and sequence boundaries

This contract preserves the existing moving/sequential-nucleus doctrine:

- one unambiguous recognized vowel token may form a monophthong candidate;
- multiple separated unambiguous vowel candidates preserve source order;
- plain adjacent vowel symbols do not establish whether the structure is one
  moving nucleus or sequential nuclei;
- unresolved adjacent-vowel structure fails closed;
- `j`/`w` adjacency does not by itself establish a glide-plus-nucleus or
  nucleus-plus-glide structure;
- evidence-qualified moving-nucleus structures continue to use the existing
  dedicated moving-nucleus authority;
- this contract does not create moving-nucleus, hiatus, or sequential-nucleus
  evidence.

The applicable existing reasons are:

```text
PLAIN_IPA_ADJACENCY_INSUFFICIENT
NUCLEUS_STRUCTURE_UNRESOLVED
```

No new moving-nucleus behavior is frozen here.

## 7. Feature handling

Stress metadata does not change the base category of an otherwise authorized
vowel candidate and does not create a Voice event.

Length and nasalization remain independent preserved features:

- neither feature creates a new Albanian phonological category by itself;
- neither feature silently changes the base category;
- raw evidence remains preserved;
- Gheg-specific authority does not propagate to Standard, Tosk, or unrelated
  regional profiles;
- if the existing category authority cannot classify a feature-bearing
  candidate deterministically, the applicable existing Null result is used;
- no generic rule strips every diacritic or feature.

The input layer may only use the existing tokenizer where the representation
preserves the relevant feature. The source-input authority does not authorize
feature-destructive normalization.

## 8. Profile and category boundary

The source scope vocabulary remains exactly:

```text
STANDARD_EXPLICIT
GHEG_EXPLICIT
TOSK_EXPLICIT
REGIONAL_EXPLICIT
ALBANIAN_UNSPECIFIED
```

The following invariant remains in force:

```text
ALBANIAN_UNSPECIFIED != STANDARD_EXPLICIT
```

This contract extracts candidates from a qualified pronunciation. The frozen
Albanian IPA-category matrix decides whether a candidate is positive under its
profile, notation, phonological-status, relation, and citation conditions.

No regional label is collapsed into Gheg or Tosk without an existing reviewed
rule. No orthographic, geographic-only, semantic, or etymological inference
is authorized.

## 9. Fail-closed behavior

The following existing reason-code vocabulary is reused:

| Condition | Existing result/reason |
| --- | --- |
| unresolved source or profile | `PROFILE_AUTHORITY_MISSING` |
| missing notation authority | `NOTATION_AUTHORITY_MISSING` |
| recognized pronunciation but unsupported symbol/category relation | `SYMBOL_AUTHORITY_MISSING` or `PHONOLOGICAL_CATEGORY_UNRESOLVED` |
| adjacent-vowel structure unresolved | `PLAIN_IPA_ADJACENCY_INSUFFICIENT` |
| glide/nucleus relation unresolved | `NUCLEUS_STRUCTURE_UNRESOLVED` |
| conflicting authority | `CONFLICTING_PHONOLOGICAL_EVIDENCE` |
| missing positive authority reference | `AUTHORITY_REFERENCE_MISSING` |

No duplicate scientific reason code is introduced by this contract.

## 10. Explicit non-authority boundaries

This contract does not authorize:

```text
IPA_TO_SEVEN_VOICE_AUTHORITY = NO
SEMANTIC_AUTHORITY = NO
ETYMOLOGICAL_AUTHORITY = NO
ALBANIAN_WIDE_GENERALIZATION = NO
ORTHOGRAPHIC_FALLBACK = NO
G2P_AUTHORITY = NO
PROVIDER_AUTHORITY = NO
VARIANT_WINNER_SELECTION = NO
NEW_MOVING_NUCLEUS_INFERENCE = NO
RUNTIME_WIRING = NO
```

It does not modify or define:

- the Albanian phonological category matrix;
- the pre-Voice category bridge;
- IPA-to-Voice mapping;
- moving-nucleus observation or canonicalization;
- `/api/analyze-v1`;
- `/chat`;
- Heart/Math7;
- production pronunciation lookup;
- G2P or provider behavior;
- semantic or etymological interpretation.

## 11. Intended implementation seam

The future source pipeline may compose the frozen layers as follows:

```text
ALBANIAN SOURCE OBSERVATION
  ↓
SOURCE INPUT AUTHORITY
  - classify frozen-profile notation
  - tokenize complete IPA representation
  - extract ordered nucleus candidates
  - preserve features and provenance
  ↓
ALBANIAN PHONOLOGICAL CATEGORY MATRIX
  - apply profile/notation/category authority
  - return positive category or existing Null
  ↓
ALBANIAN PRE-VOICE CATEGORY RESULT
```

The input authority does not bypass the existing Albanian source contract or
category matrix. It does not invoke the moving-nucleus canonicalizer.

## 12. Truth hierarchy

- **Source observation:** the frozen source records a complete raw IPA
  pronunciation and provenance.
- **Source-input doctrine:** this contract classifies the frozen profile's
  wrapper notation and extracts ordered structural candidates.
- **Phonological authority:** the existing Albanian category matrix decides
  whether a candidate is positively classified under its exact conditions.
- **Null:** unresolved profile, notation, symbol, feature, structure, or
  authority remains a valid result.
- **Future ZË-RO interpretation:** outside this contract.

Parsing behavior is not a linguistic claim that every extracted candidate is a
phoneme, a canonical Voice, or a semantic unit.

## 13. Freeze declaration

`OPEN_INSTRUMENT_ALBANIAN_SOURCE_INPUT_AUTHORITY_CONTRACT_V0_1` is frozen as
documentation-only project doctrine for the named Albanian source profile. It
authorizes complete-pronunciation tokenization and ordered nucleus-candidate
extraction, preserves existing feature and complex-nucleus boundaries, and
adds no runtime or production behavior.
