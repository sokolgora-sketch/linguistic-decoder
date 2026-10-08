# English Kaikki source-family adapter v0.1

Status: `DEFINED_AND_FROZEN_NOT_IMPLEMENTED`

Contract artifact: `docs/open-instrument/research-artifacts/source-family-lexical-substrate-v0.1-english-kaikki-source-family-adapter-v0.1/contract.json`

This document freezes the source-fact boundary for the first scalable English
Kaikki source-family adapter. It defines identity, location, multiplicity,
retrieval representation, attribution, NULL behavior, and the generic
Discovery seam. It does not implement an adapter, import a source, build an
index, change Discovery runtime, or start S4.

## 1. Bound source identity

The adapter is bound to exactly:

| Field | Frozen value |
| --- | --- |
| Source family | `open-instrument.wiktionary-kaikki-english-lexical-sense.v0_1` |
| Snapshot | `open-instrument.wiktionary-kaikki-english-lexical-sense.snapshot.2026-10-03.v0_1` |
| Source | English Wiktionary -> Wiktextract -> Kaikki English JSONL |
| Locator | `https://kaikki.org/dictionary/English/kaikki.org-dictionary-English.jsonl` |
| Format | `POSTPROCESSED_JSONL` |
| Language | `English` / `en` |
| Bytes | `3335546346` |
| SHA-256 | `9978ce34256e4143c3498387564d293a9a2971ef376c1e038d369a2021c02195` |

The exact bytes and SHA-256 must match before any projection. A mismatch is an
adapter failure with no records. The raw snapshot remains external and
hash-bound; its machine-local absolute path is not part of this contract.

## 2. Bounded schema evidence

The source schema was inspected only through a fixed 32 MiB prefix containing
1,024 complete JSONL records. This was a schema summary, not a full parse or a
research retrieval run.

Observed facts used by this contract:

- Every sampled record had `word`, `lang`, `lang_code`, `pos`, and `senses`.
- Sampled language values were `English`; sampled language codes were `en`.
- Fifteen distinct POS values occurred in the bounded prefix.
- Sample sense counts ranged from 1 to 61.
- A top-level stable record ID was not observed.
- Eighty-three repeated word/POS occurrences occurred in the bounded prefix;
  this is schema evidence for preserving multiplicity, not a corpus-wide
  collision measurement.
- Sampled words had no trim or NFC violations.
- Sense IDs, glosses, raw glosses, tags, raw tags, and examples occurred in
  the observed sense surface. Examples are not admitted to this adapter v0.1
  projection because the existing generic lexical witness seam has no
  example-field authority.

The bounded inspection performed no target-word search, semantic analysis,
candidate retrieval, functional analysis, historical analysis, coverage
evaluation, or Voice/Γ/ZC analysis.

## 3. Admitted source-fact surface

The record projection admits only:

- `word`, `lang`, `lang_code`, and `pos` at record level;
- `senses[].id`, `senses[].glosses`, `senses[].raw_glosses`,
  `senses[].tags`, and `senses[].raw_tags` at sense level.

`word`, POS, sense IDs, gloss text, and labels remain exact source values. The
source sense order is preserved. Unknown fields are ignored and never
projected. Forms, sounds, translations, etymology, derived/related lexical
fields, and all target, functional, historical, Voice, consonantal, ranking,
and reviewed-row fields are outside this adapter.

`glosses` are used when present and non-empty; otherwise `raw_glosses` is used.
That is a deterministic source-field precedence rule, not semantic
normalization. Each selected gloss remains an exact source string. A source
sense with no selected gloss produces a valid NULL for generic gloss output;
it does not become a meaning claim.

## 4. Record identity and locator

Because no top-level upstream record ID was observed, the adapter must not
invent one. It derives a replayable identity from the immutable snapshot,
the one-based physical JSONL record ordinal, and the SHA-256 of the exact
record bytes:

```text
<snapshotId>#jsonl-record-<ordinal>#record-sha256-<lowercase-hex>
```

The entry locator is:

```text
jsonl://record/<one-based-ordinal>;recordSha256=<lowercase-hex>
```

Sense identity adds the one-based source sense ordinal and the source sense
`id`. The source `id` is preserved but is never used as the sole record
identity. These locators are source provenance, not target or semantic
evidence.

## 5. Multiplicity and collision policy

The adapter preserves every admitted source record, POS, sense, gloss, tag,
and source order. It performs no deduplication, sense merge, primary-sense
selection, case-collision resolution, ranking, or winner selection. A single
lookup key may therefore return multiple source records and multiple generic
source records.

The existing frozen English lexical-sense authority defines the lookup key as:

```text
NFC -> locale-independent English lowercase using en-US -> NFC
```

The source form remains exact and separate from this lookup key. Matching is
exact lookup-key equality only. There is no trim, form expansion, stemming,
lemmatization, fuzzy, phonetic, translation, semantic, or morphological
matching. Reusing this existing policy is an explicit authority binding; this
artifact does not authorize runtime canonicalization or index construction.

## 6. NULL and fail-closed behavior

The future implementation must use these boundaries:

| Condition | Result |
| --- | --- |
| Snapshot bytes or SHA mismatch | `SOURCE_ADAPTER_FAILURE`, no records |
| Malformed JSONL | `SOURCE_ADAPTER_FAILURE`, no records |
| Required source field invalid | `SOURCE_RECORD_INVALID`, no salvage |
| No exact lookup-key match | `LEXICAL_SENSE_SOURCE_NOT_FOUND` valid NULL |
| No selected gloss | `LEXICAL_SENSE_GLOSS_NOT_FOUND` valid NULL |
| Pronunciation or Voice requested from this source | `NULL_UNAUTHORIZED` |
| Semantic, functional, historical, or winner inference requested | forbidden |

NULL means that this adapter did not supply that fact. It never means that a
word has no meaning, no function, no history, or no pronunciation.

## 7. Generic Discovery seam

The later bridge may project validated source facts into the existing
`GenericFunctionalWitnessSourceAdapterV1`. The projection unit is one generic
source record per source-record/sense/gloss tuple. It carries:

- evidence family `lexical_dictionary`;
- exact preserved `sourceForm` and the frozen lookup `queryForm` separately;
- source-record identity, snapshot/hash, URL, and entry locator in
  `sourceProvenance`;
- `candidateVoicePathPolicy=\`NULL_UNAUTHORIZED\``;
- `sourceAttestation=SOURCE_RECORD_ONLY`;
- `functionalCorrespondence=NOT_EVALUATED`;
- `targetMeaning=NOT_CLAIMED`;
- `historicalRelation=NOT_CLAIMED`;
- `winnerClaim=NOT_CLAIMED`;
- `userDecisionPosture=\`user_decides\`` and `noSingleWinner=true`.

Tags and raw tags remain source metadata. They cannot be promoted to semantic,
functional, historical, pronunciation, or target claims through this seam.
The existing generic seam does not authorize such promotion and this contract
does not wire runtime.

## 8. Attribution and storage

Provenance must retain the source title, build/version, URL, snapshot SHA-256,
language variety (`null` when unspecified), and entry locator. Kaikki states
that dictionary data is under the same licenses as Wiktionary; the recorded
data posture is CC-BY-SA/GFDL with attribution required. Wiktextract software
is recorded as MIT. This is an attribution record, not a legal conclusion or
acquisition authorization.

The raw source remains external and hash-bound. No repository-bundled source,
Git LFS copy, derived semantic slice, or absolute machine-local path is
authorized by this contract.

## 9. Explicit non-authorization and next action

This freeze does not authorize source import, production adapter
implementation, deterministic index construction, runtime wiring, candidate
retrieval, coverage evaluation, pronunciation promotion, semantic analysis,
functional analysis, historical analysis, or S4. The next authorized lane is:

```text
IMPLEMENT_ENGLISH_KAIKKI_SOURCE_FAMILY_ADAPTER_V0_1
```
