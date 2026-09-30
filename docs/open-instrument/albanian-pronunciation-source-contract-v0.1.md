# Open Instrument Albanian pronunciation source contract v0.1

Date: 2026-09-29

Status: `FROZEN_SOURCE_CONTRACT_ONLY`.

Contract ID: `OPEN_INSTRUMENT_ALBANIAN_PRONUNCIATION_SOURCE_CONTRACT_V0_1`.

Version: `v0.1`.

Machine-readable contract:
`src/shared/openInstrument/albanianPronunciationSourceContract.v0_1.ts`.

This contract freezes the reviewed source-level identity, provenance,
pronunciation-only surface, dialect/scope handling, variant preservation, and
fail-closed behavior for the frozen Albanian Wiktionary/Wiktextract/Kaikki
source family.

It does not implement runtime lookup, pronunciation parsing, G2P, IPA-to-Voice
mapping, Seven-Voice mapping, moving-nucleus authority, `/api/analyze-v1`,
`/chat`, production promotion, or audio bundling.

## Authority boundary

This contract is distinct from every later authority layer:

```text
SOURCE_CONTRACT != PRONUNCIATION_TO_VOICE_AUTHORITY
SOURCE_CONTRACT != PRODUCTION_RUNTIME_AUTHORITY
SOURCE_CONTRACT != MOVING_NUCLEUS_AUTHORITY
SOURCE_CONTRACT != G2P_AUTHORITY
```

The source contract preserves pronunciation observations. It does not decide
what a pronunciation means structurally for any later system.

## Source identity

```text
PROFILE_ID = open-instrument.wiktionary-kaikki-albanian-ipa.v0_1
LANGUAGE = Albanian
LANGUAGE_CODE = sq
SOURCE_URL = https://kaikki.org/dictionary/Albanian/kaikki.org-dictionary-Albanian.jsonl
UPSTREAM_DUMP_DATE = 2026-09-02
KAIKKI_BUILD_DATE = 2026-09-25
WIKTEXTRACT_REVISION = 1a05e46f9efbccda6a2b2f8e21b30a9c0c46513a
WIKITEXTPROCESSOR_REVISION = e3d6d4edb77618f4d6680edc66e3f774bea59820
ARTIFACT_BYTES = 67438755
ARTIFACT_SHA256 = 7bd411e2b3cdfd83b7f09af9700791c01e81f36224ec5134e118ff26e83d0aa0
ARTIFACT_IDENTITY_BY_SHA256 = YES
LIVE_URL_IMMUTABLE = NO
```

The mutable live URL does not define artifact identity. The frozen artifact is
identified by its SHA-256 and byte size.

## Permitted pronunciation surface

The v0.1 pronunciation-text surface may preserve only:

- lexical form;
- language and language code;
- explicit IPA;
- sound-level tags;
- sound-level notes;
- recoverable variant identity and order;
- source locator;
- source/build metadata;
- license and attribution metadata.

The derivative excludes definitions, glosses, translations, etymologies,
examples, semantic fields, audio binaries, and unrelated dictionary metadata.

Audio rights remain outside this text-source contract. Audio is not required
for pronunciation-source qualification and is excluded from the v0.1 text
artifact.

## Dialect and scope model

The only source-level scope values are:

```text
STANDARD_EXPLICIT
GHEG_EXPLICIT
TOSK_EXPLICIT
REGIONAL_EXPLICIT
ALBANIAN_UNSPECIFIED
```

`STANDARD_EXPLICIT` requires direct pronunciation-level `standard` or
`Standard` evidence.

`GHEG_EXPLICIT` requires direct pronunciation-level `Gheg` evidence.

`TOSK_EXPLICIT` requires direct pronunciation-level `Tosk` evidence.

`REGIONAL_EXPLICIT` preserves the exact source label without forcing a
Gheg/Tosk collapse. The v0.1 preserved labels include `Northern`, `Southern`,
`Central`, `Northeastern`, `Northwestern`, `Kosovo`, `Cham`, `Arbëresh`, and
`Arvanitika`.

Generic `regional` and `dialectal` labels remain ambiguous metadata.

Unlabelled IPA is `ALBANIAN_UNSPECIFIED`. The invariant is:

```text
ALBANIAN_UNSPECIFIED != STANDARD_EXPLICIT
```

The adapter may additionally preserve one exact profile qualifier when the
same pronunciation-level sound observation carries both direct labels in one
of these reviewed conjunctions:

```text
Northern + Tosk -> NORTHERN_TOSK_EXPLICIT
Southern + Gheg -> SOUTHERN_GHEG_EXPLICIT
```

This is direct sound-tag conjunction only. Notes, entry-level metadata,
geography, spelling, and semantics do not create a qualifier. The qualifier
does not widen generic `GHEG_EXPLICIT` or `TOSK_EXPLICIT` authority.

Entry-level, sense-level, etymology-level, usage-level, or orthographic
metadata must not be propagated to a pronunciation observation automatically.
Dialect identity must not be inferred from spelling.

## Variant policy

```text
one IPA + explicit scope
  -> preserve scoped pronunciation candidate

multiple IPA + same explicit scope
  -> preserve all; no arbitrary winner

multiple IPA + different explicit scopes
  -> preserve separate scoped candidates

labelled + unlabelled
  -> preserve both independently

unlabelled IPA
  -> ALBANIAN_UNSPECIFIED

generic ambiguous metadata
  -> preserve ambiguity

no IPA
  -> PRONUNCIATION_NOT_FOUND
```

No source-level single-winner pronunciation selection is authorized.

## Null and fail-closed behavior

The contract recognizes these reason codes:

- `PRONUNCIATION_NOT_FOUND`;
- `DIALECT_SCOPE_UNRESOLVED`;
- `PRONUNCIATION_VARIANT_AMBIGUOUS`.

Null is valid. Missing IPA is not filled from spelling, Epitran, G2P, a
provider, or another source.

## Orthographic and movement firewalls

```text
ORTHOGRAPHIC_PRONUNCIATION_AUTHORITY = NO
G2P_AUTHORITY = NO
```

The contract preserves IPA strings but does not decide whether adjacent IPA
vowels are one moving nucleus or sequential nuclei:

```text
ADJACENT_IPA_VOWELS != AUTOMATIC_MOVING_NUCLEUS
GLIDE_SYMBOL != AUTOMATIC_MOVING_NUCLEUS
```

No IPA-to-Voice mapping, Seven-Voice mapping, or moving-nucleus authority is
defined here.

## License and attribution boundary

The reviewed source chain is:

```text
English Wiktionary Albanian-language entries
  -> Wiktextract
  -> Kaikki Albanian JSONL
```

Wiktionary textual content is documented under CC BY-SA/GFDL terms. Wiktextract
software is MIT-licensed; that software license does not replace the source
data license. Kaikki documents its data as available under the same licenses as
Wiktionary.

Required future notice metadata includes the upstream project and edition,
source locator, source/build identifiers, source license, extractor and
extractor revision, artifact hash, acquisition date, attribution notice, and
license notice.

This contract records source and licensing requirements. It is not legal
advice and does not itself authorize arbitrary production redistribution.

References:

- [Wiktionary copyrights](https://en.wiktionary.org/wiki/Wiktionary:Copyrights)
- [Wiktextract license](https://github.com/tatuylonen/wiktextract/blob/master/LICENSE)
- [Wiktextract README](https://github.com/tatuylonen/wiktextract/blob/master/README.md)
- [Kaikki machine-readable dictionary](https://kaikki.org/dictionary/)
- [Kaikki raw data downloads](https://kaikki.org/dictionary/rawdata.html)

## Durability boundary

```text
ARTIFACT_IDENTITY_BY_SHA256 = YES
LIVE_URL_IMMUTABLE = NO
COMPLETE_KAIKKI_REPLAY_PROVEN = NO
REPOSITORY_BUNDLING_AUTHORIZED = NO
```

The exact researched bytes can be preserved and verified by hash. The mutable
URL is not an indefinite reproduction guarantee, and the complete Kaikki
post-processing replay has not been proven.

## Reviewed measurements

```text
UNIQUE_FORMS = 22980
IPA_BEARING_FORMS = 6217
RAW_IPA_OBSERVATIONS = 8099
MULTI_VARIANT_FORMS = 641

ALBANIAN200_UNIQUE = 188
ALBANIAN200_WITH_IPA = 112
ALBANIAN200_PRESENT_WITHOUT_IPA = 54
ALBANIAN200_NOT_IN_SOURCE = 22
```

Classical100 absence is not an Albanian pronunciation-source failure; it is a
separate Latin/Greek comparison-corpus condition.

## Runtime status

```text
RUNTIME_LOOKUP = NOT_DEFINED
API_CHANGE = NO
CHAT_CHANGE = NO
PRODUCTION_PROMOTION = NO
AUDIO_BUNDLING = NO
```

This document and its machine-readable companion are contract-only artifacts.
