# Open Instrument English Lexical-Sense Source Authority Contract v0.1

Status: `FROZEN_SOURCE_AUTHORITY_CONTRACT_ONLY`.

Contract ID: `OPEN_INSTRUMENT_ENGLISH_LEXICAL_SENSE_SOURCE_AUTHORITY_V0_1`.

This contract freezes a source-only English lexical/sense authority boundary.
It does not create a functional interpretation, choose a sense, or promote
the source into production runtime behavior.

## 1. Source identity

The frozen source family is:

`English Wiktionary -> Wiktextract -> Kaikki English JSONL`.

- Profile: `open-instrument.wiktionary-kaikki-english-lexical-sense.v0_1`
- Language: `English` (`en`)
- Format: `POSTPROCESSED_JSONL`
- Source URL: <https://kaikki.org/dictionary/English/kaikki.org-dictionary-English.jsonl>
- Upstream Wiktionary dump: `2026-09-02`
- Kaikki build: `2026-10-03`
- Wiktextract revision: `1a05e46` (the short revision published by Kaikki)
- Wikitextprocessor revision: `e3d6d4e` (the short revision published by Kaikki)
- Artifact bytes: `3335546346`
- Artifact SHA-256: `9978ce34256e4143c3498387564d293a9a2971ef376c1e038d369a2021c02195`
- Artifact identity: `SHA256_BOUND`
- Live URL immutability: `NO`

The URL is a locator, not an immutable identity. A future replay must verify
the frozen byte length and SHA-256 before using the source. A mismatch fails
closed as `SOURCE_IDENTITY_MISMATCH`; the source is never silently updated.

## 2. Raw field boundary

The minimum admitted source projection is:

- `word`
- `lang`
- `lang_code`
- `pos`
- `senses[].id`
- `senses[].glosses`
- `senses[].tags`
- `senses[].raw_tags`
- `senses[].examples`

Examples remain source text and source-level context only. Etymology,
translations, audio, forms, derived/descendant relations, and other metadata
are not admitted by this contract. In particular, source text is not a
functional correspondence, historical-origin, consonant-meaning, or runtime
authority.

## 3. Polysemy and order

Multiple entries, parts of speech, and senses are preserved. Source sense
order is preserved. This contract performs no primary-sense selection, sense
merging, homograph collapse, winner selection, or semantic ranking.

The functional experiment unit of analysis is:

`UNRESOLVED_NOT_DEFINED_HERE`.

That unresolved design boundary is not filled by this source contract.

## 4. Lexical join key

For the v0.1 lexical join key only:

`NFC -> locale-independent English lowercase using en-US -> NFC`.

The source field is `word` and joins are exact after this operation. There is
no trimming, form expansion, semantic or morphological normalization,
stemming, lemmatization, fuzzy matching, phonetic matching, or translation.
Case-normalization collisions are measured but are not resolved by this
contract. A collision does not authorize choosing or merging records.

## 5. Missingness and reviewed measurements

`LEXICAL_SENSE_SOURCE_NOT_FOUND` means that no exact admitted source record
was found under the frozen join key. It does not mean that the word has no
meaning or function. Spelling and model inference are not fallbacks.

The reviewed source-only measurements include:

- 1,492,836 raw JSONL records;
- 1,390,507 distinct raw words;
- 1,355,933 distinct normalized forms;
- 1,787,236 senses;
- 187,853 normalized forms with multiple senses;
- 86,943 normalized forms with multiple parts of speech;
- 32,094 case-normalization collision keys;
- 102,996 normalized keys with multiple source records;
- 126,031 eligible CMU forms, of which 94,632 matched and 31,399 did not;
- eligible CMU coverage: `75.0863%`.

These are source-coverage measurements, not functional or semantic outcomes.

## 6. License and provenance

Kaikki documents that its dictionary data is under the same licenses as
Wiktionary: `CC-BY-SA` and `GFDL`, with attribution required. Wiktextract
software is separately identified as MIT-licensed. These statements preserve
provenance and attribution requirements; they are not legal advice and do not
authorize scraping, redistribution, or a new acquisition method.

## 7. Constructive blindness and firewalls

The source-only mode is `FROZEN_SOURCE_ONLY`. Acquisition and source
projection must not consume canonical Voice paths, Gamma/Γ, consonantal
configurations, Level-3 readings, Math7, candidate ranking, reviewed rows,
control labels, or manifestation results.

This contract provides no authority for:

- functional correspondence or functional outcomes;
- word-specific function claims;
- historical origin or etymology claims;
- consonant meanings;
- manifestation;
- IPA-to-Voice mapping;
- production runtime/API/UI behavior.

The authority chain remains:

`source artifact -> source-only lexical/sense record -> later separately authorized review`.

It does not authorize a source record to skip Gate 2 source-record review or
Gate 3 functional/runtime authorization.

## 8. Storage boundary

- Raw artifact strategy: `EXTERNAL_HASH_BOUND_NOT_REPOSITORY_BUNDLED`.
- Repository bundling: `NO`.
- Git LFS: `NO`.
- Derived semantic slice: `NO`.

No 3.3 GB artifact is committed by this contract. No semantic slice is
created. No runtime adapter, API/UI wiring, population outcome, semantic
classifier, or experiment runner is defined here.

## 9. Scope and next gate

This is a source-only authority contract. It is not a target-sense authority,
not a functional outcome authority, and not a production source registry.
Any future source-record admission, target use, functional experiment unit,
or runtime promotion requires its own existing project gate and explicit
authorization.

The next lane is:

`INSPECT_AND_RECONCILE_LINEAR_AND_DF_BRAIN_BEFORE_FUNCTIONAL_OUTCOME_NORMALIZATION`.
