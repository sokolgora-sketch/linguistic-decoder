# Open Instrument — English Kaikki deterministic index v0.1

Status: `DEFINED_AND_FROZEN_NOT_IMPLEMENTED`

Contract artifact:
`docs/open-instrument/research-artifacts/source-family-lexical-substrate-v0.1-english-kaikki-deterministic-index-v0.1/contract.json`

This document freezes the offline definition of a deterministic exact-lookup
index over the already verified English Kaikki snapshot and the frozen
English Kaikki source-family adapter. It does not parse the source, build an
index, import records, wire runtime/API/UI/Discovery, evaluate coverage, or
start S4.

## 1. Authority and input boundary

The future builder consumes only:

1. the exact verified snapshot
   `open-instrument.wiktionary-kaikki-english-lexical-sense.snapshot.2026-10-03.v0_1`;
2. the frozen source-family adapter contract
   `OPEN_INSTRUMENT_ENGLISH_KAIKKI_SOURCE_FAMILY_ADAPTER_V0_1`;
3. the merged record-bound adapter implementation; and
4. this frozen index contract.

The snapshot identity is exactly `3335546346` bytes with SHA-256
`9978ce34256e4143c3498387564d293a9a2971ef376c1e038d369a2021c02195`.
The source remains external and hash-bound. The builder must verify the
snapshot before reading records and must reject a newer or mutable download.

The index input unit is one adapter-validated
`EnglishKaikkiSourceRecordV0_1` produced from one physical JSONL record. The
builder does not independently reinterpret raw Kaikki fields. The physical
one-based record ordinal, exact record bytes, record SHA-256, and source order
remain part of the recovery and provenance boundary.

## 2. Index artifacts and storage

The generated index is an external derived artifact at this controlled
relative location:

```text
OPEN_INSTRUMENT_EXTERNAL_SOURCE_ROOT/
source-family/english-kaikki/2026-10-03/index/
open-instrument.wiktionary-kaikki-english-lexical-sense.index.v0_1/
```

The environment variable is a locator convention, not a committed absolute
path. The raw snapshot and generated index are not bundled in Git, Git LFS,
the application, or a production distribution by this contract.

The final directory contains three canonical files:

- `directory.ndjson`: one entry per distinct lookup key, pointing to the
  contiguous posting byte range for that key;
- `postings.ndjson`: one posting per admitted source record; and
- `manifest.json`: the canonical source, adapter, contract, artifact-file,
  and identity bindings.

The posting stores a source-record reference and exact byte range, not a copy
of the source record. Recovery requires the verified external JSONL snapshot;
the byte range is re-hashed and re-adapted before projection. All senses,
glosses, POS values, labels, and source order are therefore recovered through
the existing adapter boundary.

## 3. Exact key semantics

`sourceForm` remains the exact preserved adapter `word`. The index key is the
already authorized representation:

```text
NFC -> locale-independent English lowercase using en-US -> NFC
```

Matching is exact lookup-key equality only. The index adds no operator and
does not authorize runtime canonicalization. The following remain frozen as
false:

```text
TRIM=NO
STEMMING=NO
LEMMATIZATION=NO
FUZZY_MATCHING=NO
PHONETIC_MATCHING=NO
TRANSLATION_MATCHING=NO
MORPHOLOGICAL_EXPANSION=NO
SEMANTIC_NORMALIZATION=NO
```

## 4. Posting, multiplicity, and collision policy

There is exactly one posting for each admitted physical source record. A
posting contains:

- `lookupKey`;
- `sourceRecordId`;
- `entryLocator`;
- one-based `recordOrdinal`;
- `recordByteOffset` and `recordByteLength` in the verified JSONL file; and
- the exact record `recordSha256`.

The byte length includes the original JSONL line ending when one is present;
line-ending bytes are not rewritten before hashing. The entry locator remains
the adapter locator and is not a semantic claim.

Multiple records under one key are retained. This includes repeated physical
records, POS multiplicity, homographs, case-normalization collisions, and all
source senses and glosses recovered from each record. There is no dedupe,
primary record, primary sense, ranking, or winner selection. A collision is a
successful multi-posting result, not an index failure.

Postings are ordered mechanically by UTF-8 byte order of `lookupKey`, then
ascending physical `recordOrdinal`, then UTF-8 byte order of
`sourceRecordId` as a defensive total-order tie-breaker. This is source and
serialization order, never semantic ranking.

## 5. Deterministic serialization and identity

Both NDJSON files use canonical JSON Lines:

- UTF-8 without BOM;
- one JSON object per line, including a final LF;
- no insignificant whitespace;
- fixed property order from the machine-readable contract;
- RFC 8259 JSON string escaping;
- integer offsets and counts only; and
- no timestamps, hostnames, absolute paths, or run-specific identifiers.

Directory entries are sorted by the same UTF-8 key order. Their byte ranges
refer to `postings.ndjson` and are computed from the canonical serialized
bytes. The generated manifest records file byte lengths and SHA-256 values.

The logical artifact identity is SHA-256 over the exact canonical identity
payload defined in `contract.json`. That payload is one JSON object with this
fixed property order and nesting:

```text
schemaVersion, indexId, indexContractId, indexContractVersion,
indexContractSha256, sourceSnapshot, adapter, buildProcedureId, files
```

`sourceSnapshot` has the fixed order
`sourceFamilyId, snapshotId, expectedBytes, expectedSha256`; `adapter` has the
fixed order `contractId, contractSha256, implementationCommit,
implementationSha256`; and each `files` item has the fixed order
`path, bytes, sha256`. The `files` array is exactly
`directory.ndjson`, then `postings.ndjson`. `manifest.json` is excluded from
this identity payload, including its own byte length and SHA-256, so the
manifest is not self-referential. The manifest still records and validates its
own canonical content separately when it is published.

Canonical strings use literal UTF-8 Unicode scalar values except that `"`, `\`,
and every U+0000–U+001F control character are escaped; controls always use
lowercase-hex `\\u00xx`, with no short escapes, solidus escapes, optional
non-ASCII escapes, or unpaired surrogates. This makes serialized bytes unique.
Two conforming builds from the same verified snapshot, adapter authority, and
contract therefore produce byte-identical canonical artifacts; build buffer
size does not change the final ordering or serialization.

## 6. Streaming build and publication

The future builder must stream the 3.335 GB JSONL input and may not load the
corpus into memory. It may create bounded external-sort runs, but each run
uses the same canonical posting serialization and the final merge uses the
frozen total order. No guessed throughput or corpus-size claim is made here.

Before building, the implementation must perform a disk-space preflight for
the source, bounded temporary runs, final directory, and an operator-defined
safety margin. The measured preflight and build configuration belong in the
external execution record, not in the deterministic artifact identity.

Builds write to a same-filesystem temporary sibling directory. A partial or
interrupted directory is never authoritative, never served, and is either
removed or quarantined with an explicit failure record. This v0.1 contract
does not authorize resume; a failed build restarts from the verified snapshot.
Publication is an atomic same-filesystem rename after all files, hashes, and
manifest bindings validate. An existing final artifact may be reused only
when its identity matches exactly; it may not be overwritten silently.

## 7. Build and lookup contracts

Build contract:

```text
verified snapshot
+ frozen adapter contract and implementation
+ frozen index contract
→ external directory.ndjson + postings.ndjson + manifest.json
```

Lookup contract:

```text
string query
→ existing exact key transformation
→ exact directory lookup
→ zero or more ordered postings
→ byte-range recovery and hash verification
→ frozen adapter validation/projection
→ all matching source records
```

The index returns source-record references. The adapter owns source-fact
projection, and the generic Discovery adapter remains the separate later
bridge. This contract does not wire any runtime, API, UI, or `/chat` path.

No exact key returns the existing valid NULL
`LEXICAL_SENSE_SOURCE_NOT_FOUND`. A matching source record with no selected
gloss retains the adapter's valid
`LEXICAL_SENSE_GLOSS_NOT_FOUND`. Source failures and index failures remain
distinct from valid NULL. A posting collision is not a failure.

## 8. Provenance and truth firewall

Retrieved records retain the English Wiktionary → Wiktextract → Kaikki
English JSONL provenance, exact snapshot identity, adapter identity, source
record ID, entry locator, and required CC-BY-SA/GFDL attribution posture.
Wiktextract software remains recorded as MIT. This is not a legal conclusion
and does not authorize redistribution.

The index contains source lexical facts and deterministic retrieval metadata
only. It cannot contain or derive target meaning, semantic bridges, functional
correspondence, historical relation/origin, pronunciation, IPA-to-Voice
authority, Voice paths, Gamma, ZC, Math7, ranking, winners, language
superiority, reviewed functional conclusions, provider output, or model
output. No target-specific filtering or known-example tuning is permitted.

## 9. Failure and authorization state

Missing or mismatched source identity, adapter/contract/schema binding,
artifact hashes, incomplete/corrupt files, invalid postings, unreadable byte
ranges, invalid source records, and unsupported records fail closed. The
future implementation must distinguish `SOURCE_FAILURE`, `INDEX_FAILURE`,
and `VALID_NULL` result classes.

This lane defines and freezes the contract only:

```text
SOURCE_ACQUIRED=YES
SOURCE_SNAPSHOT_VERIFIED=YES
SOURCE_CONTENT_BOUNDED_SCHEMA_INSPECTION=YES
SOURCE_IMPORTED=NO
ADAPTER_IMPLEMENTED=YES
DETERMINISTIC_INDEX_CONTRACT_DEFINED=YES
DETERMINISTIC_INDEX_CONTRACT_FROZEN=YES
INDEX_BUILDER_IMPLEMENTED=NO
INDEX_BUILT=NO
INDEX_LOOKUP_RUNTIME_IMPLEMENTED=NO
INDEX_WIRED_TO_DISCOVERY=NO
COVERAGE_EVALUATED=NO
RUNTIME_AUTHORIZED=NO
RUNTIME_CHANGED=NO
S4=NOT_STARTED
MILESTONE_COMPLETE=NO
```

The next justified lane is:

```text
IMPLEMENT_ENGLISH_KAIKKI_DETERMINISTIC_INDEX_V0_1
```
