# Open Instrument — v0.2 Substrate / Source Architecture Decision v0.1

## Decision status

- `DECISION_ID=OPEN_INSTRUMENT_MULTILINGUAL_DISCOVERY_SUBSTRATE_V0_2_SOURCE_ARCHITECTURE_DECISION_V0_1`
- `STATUS=DECISION_COMPLETE`
- `S4=NOT_STARTED`
- `RUNTIME_IMPLEMENTATION=NOT_AUTHORIZED`
- `SOURCE_ACQUISITION=NOT_AUTHORIZED`
- `SCIENTIFIC_EXECUTION=NOT_AUTHORIZED`

This document records the architecture decision after the preserved Class E
retrieval-key result. It does not change the v0.2 substrate, query generator,
matching semantics, source records, production authority, or any scientific
result.

## Evidence boundary

The current direct Discovery substrate is 76 records: 55 Albanian, 21 Latin,
and 0 other. The S3 result is preserved at
`docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s3-independent-coverage-evaluation-v0.1/paired-results.json`
with SHA-256
`b703051f8d6020548f93dc9a6591b22278f467bb0c521871b31aafb47be4ca03`. It
reported 4/512 cross-form positives before and after S1, 508/512 valid Null,
and 0/21 Latin rows retrieved.

The broader diagnostic is preserved at
`docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-broader-stratified-diagnostic-v0.1/results.json`
with SHA-256
`51019087d2199f8506267c3e6a4fbdb8824962641a6ed49abaa7e2c7bcc59ee6`. Its
summary reports 1 authoritative attempt, 1,024 inputs, 688 valid inputs,
2,469 distinct generated keys, 4 reached substrate keys (`ART`, `AT`, `MAT`,
`RE`), 4 Albanian reached keys, 0 Latin reached keys, and 8 inputs with a
substrate intersection. Its frozen interpretation is
`CLASS_B_BROADER_SAMPLE_REVEALS_ADDITIONAL_EXISTING_SUBSTRATE_KEYS_BUT_NO_LATIN`.

The retrieval-key procedure result is preserved at
`docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-retrieval-key-authority-and-reachability-execution-v0.1/result.json`
with SHA-256
`43828f3dee6fe3d86a6cb673cfe600826222f1c776563798fb2d00b71e9f7188`. It
executed once and classified the proposed operator as
`CLASS_E_OPERATOR_NOT_AUTHORIZED_OR_NOT_SCIENTIFICALLY_DEFENSIBLE`; Arm B was
not authorized. This closes the frozen canonicalization hypothesis. It does
not prove that every future representation operator is impossible.

## Current architecture

The current production/research composition is:

`input word`
→ deterministic structural hypothesis discovery and deep-root analysis
→ validated generic query containing an embryo, exact NFC normalization, and a
Seven-Voice path
→ adapter query by exact `lookupForm === input.embryo`
→ source-record validation and deterministic sorting
→ source-only witness construction
→ motivation-engine candidate construction and status/Null presentation.

The current generic source-record contract preserves an exact `sourceForm`, a
`queryForm`, a `lookupForm`, source identity, citation, gloss, truth/status,
and provenance. Its current normalization contract is
`sourceFormNormalization=EXACT_PRESERVED`,
`queryNormalization=STRUCTURAL_DISPLAY_UPPERCASE`,
`lookupNormalization=EXACT_NFC`, and
`lookupTransformationAuthority=STRUCTURAL_HYPOTHESIS_DISPLAY_FORM_V0_1`.
The adapter uses exact equality and returns all records matching a key; it does
not silently choose a winner.

The direct runtime path currently composes a bounded Albanian adapter and the
S1 Latin adapter. The generic witness dataset is a separate small source
surface (9 records: 7 Albanian and 2 Latin). S1 adds 19 Latin records from a
frozen catalog cohort, but is a narrow projection helper rather than a
general source-family substrate. There is no unified source-family snapshot
registry and deterministic index for a larger lexical corpus.

## Retrieval versus reviewed evidence

Generic lexical retrieval and reviewed functional/research evidence are
different authority layers.

The generic witness output already preserves source fact while declaring
`functionalCorrespondence=NOT_EVALUATED`, `historicalRelation=NOT_CLAIMED`,
`winnerClaim=NOT_CLAIMED`, `noSingleWinner=true`, and `user_decides`. The
reviewed-source policy also separates source-tradition authority, record
validation, and functional/runtime authorization.

However, the current multi-source research catalog is target-bound: its
admission requires functional hypotheses, target words/senses, semantic
bridges, and provenance-group bindings. That contract is appropriate for
reviewed research candidates but is not a scalable generic lexical-source
admission contract. The catalog adapter also does not provide the complete
source-snapshot boundary required for a large independent lexical substrate.

Therefore a future lexical substrate must not weaken the reviewed catalog
contract. It must add a separate source-fact-only source-family contract and
join reviewed functional evidence only as an optional, explicitly authorized
enrichment layer.

## Option review

### Option A — small curated substrate

Safe and low-risk, but it leaves the demonstrated 76-record reachability
bottleneck in place and cannot support the stated generic multilingual product
goal. It is not sufficient as the next substantive architecture.

### Option B — scalable source-family substrate

It addresses the narrow source-family and indexing seam, preserves generic
exact lookup, and creates a path to additional languages without target-word
selection. Used alone, however, it does not describe how existing reviewed
functional evidence remains separate and optionally enriches a lexical
candidate.

### Option C — hybrid scalable substrate plus curated enrichment

This is the selected architecture. It gives generic lexical source facts a
scalable, source-family-owned substrate while retaining reviewed functional
evidence as a separate enrichment layer. It advances product breadth without
turning glosses into functional claims, and it preserves Null and
`no_single_winner` behavior.

### Option D — query or matching research

Not justified now. Exact matching protects genericity and anti-circularity.
The frozen Class E result does not authorize a new matching operator or a
change to query generation.

### Option E — close v0.2 without expansion

Scientifically honest as a bounded result, but it leaves the source-architecture
gap unresolved and does not advance the product beyond the demonstrated
limited substrate. It remains a valid fallback if the next source-authority
audit cannot establish a safe source family.

## Selected architecture

`SELECTED_ARCHITECTURE=OPTION_C_HYBRID_SCALABLE_SUBSTRATE_PLUS_CURATED_ENRICHMENT`

The smallest justified future architecture is:

`source snapshot`
→ `source-family adapter`
→ `source-record validation`
→ `versioned retrieval representation`
→ `deterministic key index`
→ `generic Discovery adapter`
→ `candidate construction`
→ optional `reviewed evidence enrichment`
→ API/UI presentation with explicit status and provenance.

This is an architecture boundary, not an implementation authorization. No
source family is selected by this document. The next lane must first audit one
candidate source family for authority, coverage, license, reproducibility,
stable locators, and machine-readable record shape. Acquisition is not part of
that audit.

## Future source-family contract boundary

The next architecture lane should define, before implementation:

- a source snapshot identity: tradition, language/variety, version/date,
  archive/reference, bytes/hash, license, acquisition identity, and immutable
  status;
- a source record identity: stable record ID, exact source form, source-fact
  gloss/sense material, optional part of speech, locator, citation IDs,
  attestation truth, source status, and snapshot binding;
- exact source-form preservation independent of retrieval-key representation;
- a separately versioned retrieval representation, with exact equality only;
- deterministic ordering and an offline-built index;
- one key mapping to multiple preserved records, with collision reporting and
  no silent deduplication or winner selection;
- explicit language and variety metadata with no privileged language;
- fail-closed behavior for missing authority, malformed provenance, empty keys,
  unsupported transformations, and unrepresentable collisions;
- source-fact-only status, with pronunciation, functional, historical, semantic,
  and production claims remaining unclaimed unless separately authorized.

For large sources, the default storage direction is an immutable, hash-bound
source snapshot or controlled acquisition artifact plus a deterministic
derived artifact/index. Runtime must not fetch an unpinned source. Small
fixtures may remain repository-bundled where licensing and repository policy
permit. The exact storage choice remains source-audit dependent.

## Anti-circularity and truth boundary

The future architecture must reject target-specific mappings, outcome-based
source selection, candidate shopping, semantic/embedding matching, and
winner-forcing. The source cohort, source snapshot, adapter, ordering,
normalization/operator identity, and evaluation population must be frozen
before retrieval outcomes are inspected. A retrieval hit is a source-attested
lexical fact plus a deterministic structural relation; it is not pronunciation
authority, functional motivation, historical origin, semantic equivalence, or
production truth.

The architecture preserves:

- `SOURCE_FACT`;
- `DERIVED_STRUCTURE`;
- `FUNCTIONAL_HYPOTHESIS` only when separately reviewed/authorized;
- `UNKNOWN_NULL`;
- `no_single_winner` and `user_decides`.

## Next milestone

`NEXT_MILESTONE=OPEN_INSTRUMENT_SOURCE_FAMILY_LEXICAL_SUBSTRATE_V0_1`

`NEXT_MILESTONE_TYPE=CONTRACT_AND_SOURCE_AUTHORITY_AUDIT`

`NEXT_MILESTONE_OBJECTIVE=Freeze a source-fact-only source-family substrate contract and audit one existing-compatible source family for deterministic snapshot, provenance, license, coverage, and adapter readiness; do not acquire or import a source in the audit.`

The first bounded slice is:

1. freeze the source-family lexical contract and collision/index policy;
2. audit one source family without acquisition or import;
3. stop if authority, license, reproducibility, or record shape is
   insufficient;
4. only after a separate authorization decide whether to implement a snapshot,
   adapter, and deterministic index;
5. later measure generic coverage with a predeclared independent procedure;
6. validate Null, provenance, and `/chat` comprehension before closure.

`SOURCE_FAMILY_SELECTED=NO`
`SOURCE_ACQUISITION_AUTHORIZED=NO`
`S4_AUTHORIZED=NO`

## S4 disposition

S4 remains `NOT_STARTED`. The unchanged original S4 should not run now because
S3 found no measurable existing-only improvement and the Class E result did not
authorize representation repair. S4 is deferred until the source-architecture
lane either produces a separately authorized substrate slice or establishes
that v0.2 should close with its bounded result.

## Non-goals

This decision does not acquire sources, add languages, implement a runtime
index, change query generation, change matching, change normalization, rerun
S3 or the broader diagnostic, start S4, modify Seven Voices/Math7/Gamma/ZC,
promote pronunciation or research evidence, restart One-Embryo, activate
Diachronic v0.2, or alter production API or `/chat` behavior.
