# Open Instrument English Kaikki Snapshot Acquisition Procedure v0.1

Status: `DEFINED_NOT_EXECUTED`.

Procedure ID: `open-instrument.source-family-lexical-substrate.english-kaikki.snapshot-acquisition.v0.1`.

This document defines the controlled, source-fact-only acquisition procedure
for the already-authorized source-family candidate. It does not acquire,
import, index, or expose the source. It creates no runtime adapter and does
not authorize S4.

## Frozen source identity

The source is the English Wiktionary → Wiktextract → Kaikki English JSONL
profile `open-instrument.wiktionary-kaikki-english-lexical-sense.v0_1`.

- source URL: <https://kaikki.org/dictionary/English/kaikki.org-dictionary-English.jsonl>
- upstream dump: `2026-09-02`
- Kaikki build: `2026-10-03`
- Wiktextract: `1a05e46`
- Wikitextprocessor: `e3d6d4e`
- format: `POSTPROCESSED_JSONL`
- expected bytes: `3335546346`
- expected SHA-256: `9978ce34256e4143c3498387564d293a9a2971ef376c1e038d369a2021c02195`

The URL is only a mutable locator. The byte length and SHA-256 are the source
identity. A response with different bytes or hash is rejected as
`SOURCE_IDENTITY_MISMATCH`; the expected identity is never updated silently.

## Controlled future execution

Only a later, separately authorized lane may execute this procedure. That
lane must use `OPEN_INSTRUMENT_EXTERNAL_SOURCE_ROOT` and the controlled
relative path:

`source-family/english-kaikki/2026-10-03/kaikki.org-dictionary-English.jsonl`

The target is external to the Git worktree. The future operator must perform
a metadata-only preflight, verify storage capacity using
`(expectedBytes * 2) + 1073741824`, and stream the response to a same-filesystem
`.partial` file without buffering the artifact in memory. Only an exact
byte-count and SHA-256 match may be atomically renamed into place.

An exact already-present file may be reused after the same verification. A
partial file may be resumed only for the same locator, target, expected
identity, and verified HTTP range semantics. A mismatch, unsupported range,
unexpected response, unavailable source, unclear attribution, or insufficient
storage fails closed. No newer artifact, alternate source, or changed expected
hash is a retry.

The authoritative acquisition attempt limit is one; transport retries are
bounded at three and do not permit source substitution. This definition lane
has performed zero acquisition attempts.

## Source and license boundary

The parent source authority admits source-only fields and preserves all
entries, parts of speech, senses, and source order. There is no primary-sense
selection, sense merging, semantic ranking, or winner selection. Exact source
forms and source-attested gloss text remain source facts.

Kaikki identifies the dictionary data with the Wiktionary licensing posture
(`CC-BY-SA` and `GFDL`, attribution required); Wiktextract is separately
identified as MIT. These are preserved provenance statements, not legal advice
or a blanket redistribution authorization. Repository bundling, derived
semantic slices, production distribution, runtime fetching, and an adapter are
not authorized by this procedure.

Source-record identity and entry-locator construction remain deferred to a
separate adapter definition. No identity is invented during snapshot
acquisition.

## Explicit firewall

The future output of this procedure is only a verified external source
snapshot. It must not consume target words, Voice paths, Γ, ZC, Math7,
functional hypotheses, historical claims, pronunciation authority, candidate
ranking, provider output, or manifestation results. It must not alter query
generation, matching, normalization, `/chat`, the production API, or any
existing substrate.

No source content is inspected, imported, indexed, or evaluated by this lane.
No `result.json` is created. The next action is
`REVIEW_AND_AUTHORIZE_CONTROLLED_ENGLISH_KAIKKI_SNAPSHOT_ACQUISITION`.
