# Open Instrument — Multilingual Discovery Substrate Expansion v0.2

## Milestone identity

- `MILESTONE_ID=OPEN_INSTRUMENT_MULTILINGUAL_DISCOVERY_SUBSTRATE_EXPANSION_V0_2`
- `STATUS=MILESTONE_ACTIVE`
- `IMPLEMENTATION_STARTED=YES`
- `DATA_ACQUIRED=NO`
- `DATA_IMPORTED=NO`
- `PRODUCTION_PROMOTION=NO`
- `S0=COMPLETE`
- `S1=COMPLETE`
- `S1_PROJECTED_COUNT=19`
- `S1_DIRECT_SUBSTRATE_AFTER=76 (Albanian 55, Latin 21, Other 0)`
- `S1_BASELINE_VS_COHORT_QUERY_KEY_COLLISIONS=0`
- `S1_INTRA_COHORT_QUERY_KEY_COLLISIONS=0`
- `S1_PROJECTION_IMPLEMENTATION_PATH=src/shared/openInstrument/multilingualDiscoverySubstrateS1.v0_2.ts`
- `S1_PROJECTION_IMPLEMENTATION_SHA256=8f65b688ca6c3e7a4a130c478c2c6ec3abbb6b6875db742fd9666b4ced5b61d3`
- `S1_CATALOG_DERIVATION_PATH=src/shared/openInstrument/multilingualDiscoverySubstrateS0.v0_2.ts`
- `S1_CATALOG_DERIVATION_SHA256=bf7f9592b6123fc2d634af7616415fdedf317469ba1e3ca9f654a0e4dc4ce265`
- `S1_SOURCE_RECORD_PROJECTION_PATH=src/shared/openInstrument/multilingualDiscoverySubstrateS1.v0_2.ts`
- `S1_SOURCE_RECORD_PROJECTION_SHA256=8f65b688ca6c3e7a4a130c478c2c6ec3abbb6b6875db742fd9666b4ced5b61d3`
- `S2=COMPLETE`
- `S3=COMPLETE`
- `S3_OUTCOME=NO_MEASURABLE_EXISTING_ONLY_IMPROVEMENT`
- `S3_AUTHORITATIVE_ATTEMPTS=1`
- `S3_SAMPLE_SIZE=512`
- `S3_BEFORE_AFTER_CROSS_FORM_POSITIVES=4/4`
- `S3_BEFORE_AFTER_VALID_NULL=508/508`
- `S3_S1_ROWS_RETRIEVED=0/21`
- `S3_RESULT_ARTIFACT=docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s3-independent-coverage-evaluation-v0.1/paired-results.json`
- `S3_RESULT_SHA256=b703051f8d6020548f93dc9a6591b22278f467bb0c521871b31aafb47be4ca03`
- `S3_SUMMARY_SHA256=1985db5f7d8d7fd59c6ca741f30d1814ffa469f95c141ff7e9aef109da11ebea`
- `S4=NOT_STARTED`
- `RETRIEVAL_KEY_AUTHORITY_DEFINITION=COMPLETE`
- `RETRIEVAL_KEY_PROCEDURE_STATUS=DEFINED_NOT_EXECUTED`
- `RETRIEVAL_KEY_AUTHORITATIVE_ATTEMPTS=0`
- `RETRIEVAL_KEY_PROCEDURE=docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-retrieval-key-authority-and-reachability-v0.1/procedure.json`
- `RETRIEVAL_KEY_MANIFEST=docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-retrieval-key-authority-and-reachability-v0.1/hash-manifest.json`
- `S2_VALIDATION_ARTIFACT=docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s2-authority-truth-validation-v0.1/validation.json`
- `S2_VALIDATION_ARTIFACT_SHA256=6dd24ea7074aa73f2060c40afb254370a79270a8ce0db8f273bec5b332792fae`
- `S2_VALIDATION_MANIFEST=docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s2-authority-truth-validation-v0.1/hash-manifest.json`
- `S2_VALIDATION_MANIFEST_SHA256=8a8976b5cbd3586ea76661e3f5f93beb4fcceab8a16fb627e2678bd9dacf0234`
- `S0_ARTIFACT=docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s0-baseline-freeze-v0.1/baseline.json`
- `S0_ARTIFACT_SHA256=52fd4865fd3a0eb2067ea460af7d75024948de5c56cbcc8ce9936361a591a58e`
- `S0_MANIFEST=docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s0-baseline-freeze-v0.1/hash-manifest.json`
- `S0_MANIFEST_SHA256=38d57de7082b4d719b76aa5cf34e177c5e0d811a1a11341bba9535fafcbf764f`

This milestone follows the closed Motivation Engine / Discovery Lab v0.1
milestone, including its M7 generic generalization, M8 multilingual seam, M9
closure, and the post-milestone user smoke result. It is a bounded substrate
coverage lane. It does not reopen v0.1 and does not authorize Diachronic v0.2,
One-Embryo, or production promotion of research evidence.

## Why this milestone exists

The current Discovery mechanism is generic, source-bound, provenance-bearing,
and fail-closed, but its direct Discovery substrate does not yet consume all
eligible source-attested rows already present in the repository. The first v0.2
slice therefore recovers existing repository evidence before any new source or
language acquisition is considered.

The selected scope is:

`OPTION_E_EXISTING_ONLY_V0_2`

Project the currently eligible, not-yet-projected Latin rows from the existing
multi-source research catalog into the existing generic Discovery substrate.
This is a projection/reconciliation task, not a source-acquisition campaign.

## Current baseline frozen for implementation planning

The baseline below is an inventory of the current repository state. It is not
a new research result and must be revalidated by the implementation lane
before mutation of any substrate artifact.

### Direct Discovery substrate

- Albanian: `55` records (`52` catalog-projected rows plus `3` separately
  reviewed external lexical rows).
- Latin: `2` records.
- Other direct Discovery languages: `0`.
- Total direct Discovery substrate: `57` records.
- Unique normalized query keys: `57`.
- Current direct adapters: Albanian lexical substrate and Latin lexical
  substrate.
- The generic witness dataset is a separate runtime source surface with `9`
  records (`7` Albanian and `2` Latin); it must not be conflated with the
  `57`-record direct Discovery substrate.

### M7 bounded coverage baseline

The frozen M7 evaluation used a `512`-input independent sample against the
frozen `55`-record Albanian substrate:

- cross-form positives: `4`;
- self-match-only cases: `0`;
- substrate no-match cases: `508`;
- invalid cases: `0`;
- engine or authority failures: `0`;
- measured bounded positive rate: `4 / 512 = 0.78125%`.

This rate describes only the frozen substrate and frozen evaluation. It is not
an estimate of language-wide prevalence.

## Existing-catalog shortfall

The implementation lane must preserve the following reconciled accounting.
The raw catalog contains `98` rows. Three Albanian rows are quarantined by the
existing catalog loader, leaving `95` loaded rows.

```text
RAW CATALOG                         98
  - quarantined by current loader   3
LOADED CATALOG                      95
  - current catalog projection      54
  - not projected                   41

LOADED CATALOG                     95
  - preliminary eligible under
    fact/relation/citation rules    81
  - excluded by existing boundaries 14

PRELIMINARILY ELIGIBLE NOT-YET-
PROJECTED UNDER RELATION/CITATION
PREDICATES                          27
  - Ancient Greek                    3
  - Latin                           23
  - Turkic comparative evidence      1

FULL CURRENT ADMISSION AND DIRECT
ADAPTER REVIEW
  - Latin rows ready for this slice  19
  - Ancient Greek rows deferred       2
  - admission-unresolved rows         6
  - existing boundary exclusions     14
```

The `54` current catalog projections are `52` Albanian rows and `2` Latin
rows. Adding the `3` separately reviewed Albanian rows produces the current
`55`-record Albanian substrate; the direct substrate total is therefore `57`.

The `41` not-projected loaded rows are not all recoverable. Their exact
boundary is:

- `5` Albanian rows have `no_structural_relation`, which is not in the current
  Albanian projectable-relation set;
- `3` Ancient Greek rows have no authorized structural relation;
- `5` Latin rows have no authorized structural relation;
- `1` Proto-Indo-European reconstruction row is inference rather than an
  admissible source-attested fact;
- `23` additional Latin rows are eligible but outside the current Latin
  substrate;
- `3` Ancient Greek rows are eligible under the existing admission and
  citation predicates but outside the current direct Discovery language
  boundary;
- `1` Turkic comparative row is eligible under those predicates but outside
  the current direct Discovery language boundary.

The preliminary `27` count was based on relation, citation, and attestation
predicates only. It is not the final recovery count because the current
catalog-admission contract also requires a non-empty `provenanceGroupId` on
citations and a non-empty `targetSenseId` on every functional hypothesis.
Those requirements are checked by `validateIncomingRowV0_1` and are binding for
new admission/projection.

The binding implementation seam is
`src/shared/openInstrumentResearchCatalogAdmission.v0_1.ts`; this milestone
does not weaken or bypass it.

The full current-contract review identifies six unresolved rows: Greek
`eremos`, Turkic `ak`, and Latin `cor`, `edo`, `mens`, and `belligero`. They
remain out of the v0.2 first slice until their existing evidence is
metadata-hardened or re-attested under the current admission contract. Two
Ancient Greek rows satisfy the admission predicates but remain outside the
current direct Albanian/Latin adapter pair. The first implementation slice is
therefore the `19` Latin rows that satisfy both current admission and the
existing direct adapter boundary.

The `22` held rows are `6` admission-unresolved rows, `2` admission-valid but
adapter-deferred Ancient Greek rows, and the `14` existing boundary
exclusions. The `19` selected rows have no query-key collision against the current
`57`-record substrate in the inventory audit. The implementation lane must
not rescue the `14` intentionally excluded rows by weakening relation,
attestation, or truth-boundary rules, and must not silently add the two Greek
rows without a separately authorized adapter boundary.

### Source and status inventory

The loaded catalog is currently all `research_candidate` source status. Its
attestation values are `94` `fact` rows and `1` `inference` row. The raw
catalog is `97` `fact` and `1` `inference` before the three loader
quarantines. Current source-tradition identity and citation metadata remain
bound through the existing source-tradition authority policy and admission
code; this milestone must not create a parallel ingestion path.

### Recovery classification

For the `19` strict first-slice rows:

- recoverable with existing citations: `19`;
- recoverable with existing metadata: `19`;
- recoverable without external source fetch: `19`;
- requiring source re-attestation or metadata hardening: `6` held rows;
- admission-valid but requiring a new direct language adapter: `2` held rows;
- requiring a new source: `0`;
- requiring a new language in the selected slice: `0`;
- intentionally non-projectable under current policy: `14`.

The implementation lane must still validate each row against the current
admission and substrate contracts. “Recoverable” means that the present
repository evidence is sufficient for the existing source-attested research
substrate interface; it does not mean that the rows become production
pronunciation, semantic, historical, or functional authority.

## Selected scope and boundaries

### In scope

1. Freeze the `57`-record direct Discovery baseline, its source identities,
   provenance fields, normalized query keys, and the reconciled `98 → 95 →
   54/41 → 19 selected / 22 held` accounting.
2. Project the `19` strict-admission-compatible Latin rows through the
   existing generic substrate/review seam. Keep the two admission-valid
   Ancient Greek rows outside this slice because the current direct adapter
   boundary is Albanian plus Latin.
3. Preserve source form, normalized lookup form, gloss, source identity,
   stable locator, version/date fields where present, attestation status, and
   source-status metadata.
4. Validate deterministic serialization, duplicate/collision behavior,
   provenance completeness, and source/status truth boundaries.
5. Measure the before/after coverage delta using an independent frozen
   evaluation procedure defined before candidate outcomes are inspected.
6. Validate the resulting Discovery and `/chat` surfaces for comprehensible
   provenance, explicit Null, `no_single_winner`, and `user_decides` behavior.
7. Close only if the expanded substrate produces a measurable generic
   coverage improvement over the frozen baseline. No fixed positive percentage
   is prescribed in advance.

### Out of scope

- acquiring or downloading a new source or dataset;
- adding a new language before the existing-only slice is measured;
- weakening relation, attestation, citation, or source-status admission;
- adding target-word-specific lookup tables or candidate rankings;
- changing Seven Voices, Math7, Gamma, ZC, pronunciation, or canonical Voice
  mapping;
- promoting Albanian research pronunciation or lexical evidence to production
  authority;
- deriving pronunciation from orthography;
- treating lexical attestation as pronunciation authority;
- treating structural resemblance, gloss similarity, or functional evidence as
  historical origin proof;
- restarting One-Embryo or activating Diachronic v0.2;
- executing providers or models;
- changing the completed Discovery Lab v0.1 milestone;
- changing the production API or `/chat` behavior except for the minimum
  presentation/adapter validation required to prove the already-authorized
  substrate remains comprehensible.

## Authority and provenance contract

The existing source-tradition authority policy and generic substrate contracts
remain authoritative. The three gates remain distinct:

1. source-tradition eligibility;
2. source-record acceptance;
3. runtime/production authorization.

This milestone operates only on the research/source-attested substrate path.
It does not grant production authorization. Every projected record must retain
its source identity, exact source form, normalized lookup form, gloss, stable
entry locator, citation/provenance metadata, attestation status, and source
status. Missing or ambiguous fields remain `Null` or excluded under the
existing contracts.

The truth layers remain:

- `SOURCE_FACT`: what the source record attests;
- `DERIVED_STRUCTURE`: deterministic normalization/query/structural output;
- `FUNCTIONAL_HYPOTHESIS`: bounded and separately authorized interpretation;
- `UNKNOWN_NULL`: unavailable, unsupported, conflicting, or unresolved.

The following remain invariants:

- `originClaim=not_claimed` unless separately authorized;
- `no_single_winner` remains fail-closed;
- `user_decides` remains available where alternatives remain;
- functional motivation is not historical origin;
- lexical attestation is not pronunciation authority;
- orthographic extraction is not spoken authority;
- research evidence is not production authority.

## Coverage metrics and evaluation procedure

The implementation lane must freeze the evaluation identity before using the
expanded substrate to inspect candidate results. The evaluation sample,
ordering, seed, and acceptance/Null rules must be fixed before lookup. No
input may be selected because it produces an attractive candidate.

Required baseline and post-expansion metrics are:

- total substrate records by language and source tradition;
- unique normalized lexical forms;
- unique generic query keys;
- source-attested gloss coverage;
- source/provenance completeness;
- generic-query reachability;
- cross-form candidate retrieval rate on a frozen independent sample;
- exact-self-match rate reported separately;
- valid Null rate;
- unsupported-authority rate;
- language/source-tradition contribution;
- duplicate and query-key collision rate;
- candidate diversity per input;
- count of source rows rejected or quarantined, with reason codes.

The M7 `512`-input result is the v0.1 baseline reference for the existing
Albanian slice. A compatible independent evaluation may be used only after its
identity and procedure are frozen; the implementation lane must not silently
compare a changed sample, changed seed, or changed acceptance rule to M7.

“Improvement” means a measured, reproducible increase in generic Discovery
coverage or reachable source-attested candidate universe with no loss of
provenance, valid Null, or truth-boundary behavior. It does not mean a
preselected positive rate.

## Stages

This milestone intentionally uses a short sequence rather than reproducing
the M0–M9 structure of v0.1.

### S0 — Baseline and shortfall freeze

Freeze the current direct-substrate inventory, catalog row accounting,
source/status/relation reason codes, normalized-key set, and artifact hashes.
Confirm that the baseline can be reconstructed from repository inputs.

### S1 — Existing-catalog projection

Project only the `19` pre-identified Latin rows that pass the full current
admission contract through the existing source-record/substrate seam. Do not
add a new adapter family, source, or language. Preserve deterministic ordering
and all source/provenance fields.

### S2 — Authority and truth-boundary validation

Verify that all `19` rows remain source-attested research facts under existing
admission rules, that no duplicate or collision is introduced, and that the
`14` excluded rows plus the three quarantined raw rows remain excluded for
their existing reasons. Verify no pronunciation, historical, functional, or
production claim is introduced. Verify that the six admission-unresolved rows
and two adapter-deferred Greek rows are not projected by this slice.

### S3 — Independent coverage evaluation

Run the frozen predeclared evaluation procedure against baseline and expanded
substrates. Report all required metrics, including cross-form positives,
self-match-only cases, valid Nulls, unsupported-authority cases, source
contribution, and collision/duplicate counts. Do not select or remove records
based on observed outcomes.

### S4 — Product and closure validation

Validate generic Discovery and `/chat` behavior for source provenance,
language/source labels, structural relationship, bounded functional evidence
where already authorized, competing explanations, `no_single_winner`,
`user_decides`, and explicit Null. Close the milestone only when the measured
coverage delta is reproducible and the user-facing surface remains
comprehensible.

## Definition of done

The milestone may close only when all of the following are proven:

- the `57`-record baseline and `98 → 95 → 54/41 → 19 selected / 22 held`
  accounting are
  reproducible;
- the `19` existing-only Latin recovery set is deterministically projected or
  each rejected row has an existing contract reason;
- no new source or language is silently introduced;
- source identity, citation, locator, version/date, license metadata where
  available, attestation status, and artifact fingerprints are preserved;
- no target-word-specific mapping or candidate shopping exists;
- deterministic normalization, ordering, serialization, and duplicate checks
  pass;
- an independent evaluation procedure was frozen before result inspection;
- at least one generic Discovery coverage metric improves measurably over the
  frozen v0.1 baseline, without prescribing a positive percentage in advance;
- valid Null, `no_single_winner`, and `user_decides` behavior remain intact;
- no historical-origin claim is derived from structural or functional
  resemblance;
- no pronunciation authority is promoted;
- `/chat` remains comprehensible and preserves source/derived/
  hypothesis/Null distinctions;
- no production API, Seven-Voice, Math7, Gamma, ZC, One-Embryo, or Diachronic
  behavior is changed.

If existing-only recovery does not produce a material measurable improvement,
the lane closes with that bounded result and a separate decision is required
before any new source or language acquisition. New acquisition is not implied
by this definition.

## Source-family audit and deferred breadth

The repository evidence supports one immediate source-family action:

- Latin Lewis & Short / existing `scaife.lewis-short.v0_1` rows are a bounded
  existing-source recovery candidate: `19` rows pass the full current
  admission contract and remain outside the current Latin substrate, with `2`
  already present. Four additional Latin rows (`cor`, `edo`, `mens`, and
  `belligero`) remain admission-unresolved.

Other loaded families are deferred from the first slice:

- Ancient Greek has `2` admission-valid rows outside the current direct
  language boundary and one admission-unresolved row (`eremos`); generic
  Ancient Greek substrate policy is not yet part of the current adapter pair;
- Turkic comparative evidence has one admission-unresolved row (`ak`), and its
  language-family scope and source-tradition role are not a justified first
  expansion;
- reconstructed or inference rows remain excluded and are not source-attested
  lexical facts under this lane.

No external source candidate is authorized or required at milestone
definition time. If the measured existing-only result is insufficient, a
future source-authority lane must be separately defined with its own source
identity, license, acquisition, hashing, normalization, review, and coverage
contract. It must not be smuggled into S1.

## Albanian lexical and pronunciation boundary

Existing Albanian lexical evidence is independently usable for the research
substrate where it satisfies the current admission and citation predicates.
The frozen Albanian pronunciation source remains a research-only
Kaikki/Wiktextract observation contract. Its later reacquisition byte/hash
mismatch remains unresolved, and it is not production pronunciation authority.

The pronunciation mismatch does not invalidate independently attested lexical
rows for this research substrate. Conversely, projecting lexical rows does not
authorize pronunciation, phonological category assignment, Voice mapping, or
production `/api/analyze-v1` use.

## Planning and lifecycle boundary

This document originally defined the milestone and its boundaries. S0, S1,
S2, and S3 are now complete under those boundaries; S4 remains not started.
The frozen S3 evaluation was executed exactly once and produced
`NO_MEASURABLE_EXISTING_ONLY_IMPROVEMENT`; no external source was acquired, no
new language was added, and no production authority was promoted. Existing
Linear planning must be inspected before any planning mutation. Stage issues
are not created unless current planning conventions require them.

After a confirmed repository merge, the existing DF_BRAIN project file and
the correct October 2026 log may receive a factual local continuity update.
DF_BRAIN has no authorized remote push in this milestone.

## Post-S3 decision and broader diagnostic definition

The post-S3 decision audit is complete with classification
`COMBINED_LIMITATION`: the frozen 512-input sample was alphabetically narrow,
and the existing 76-key substrate remains sparse under the unchanged query
generation and exact matching boundary. The audit therefore selected one
additive broader diagnostic rather than reopening S3 or acquiring a source.

`POST_S3_DECISION_AUDIT=COMPLETE`

`BROADER_STRATIFIED_DIAGNOSTIC_PROCEDURE=docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-broader-stratified-diagnostic-procedure-v0.1/procedure.json`

The procedure freezes a deterministic 1024-input equal-ordinal-stratum sample
over the existing prepared eligible population. Its preparation uses the
already-frozen M7 exclusion set plus the separately frozen inherited seven-form
substrate-derived exclusion set, with the M7 file hash bound in the procedure
manifest; it does not read current Albanian substrate contents while selecting
the sample. It does not inspect generated query keys or candidate outcomes
during definition, and it does not replace, rerun, or reinterpret S3. S4
remains not started and the milestone remains active. No new source, language,
pronunciation authority, production authority, or matching behavior is
authorized by this definition.

## Broader stratified diagnostic result

The predeclared broader diagnostic was executed exactly once under the frozen
procedure. The result is preserved as a bounded synthetic diagnostic, not as a
new source-acquisition or production-authority result.

`BROADER_STRATIFIED_DIAGNOSTIC=COMPLETE_RESULT_PRESERVED`

`BROADER_STRATIFIED_DIAGNOSTIC_AUTHORITATIVE_ATTEMPTS=1`

`BROADER_STRATIFIED_DIAGNOSTIC_SAMPLE_SIZE=1024`

`BROADER_STRATIFIED_DIAGNOSTIC_SAMPLE_IDENTITY_SHA256=5fa453b1a6b7ad6dbc965080d6b47d48d54c4a4c7961813e13d6cae25a010dc3`

`BROADER_STRATIFIED_DIAGNOSTIC_VALID_INPUTS=688`

`BROADER_STRATIFIED_DIAGNOSTIC_INVALID_OR_UNREACHABLE_INPUTS=336`

`BROADER_STRATIFIED_DIAGNOSTIC_DISTINCT_QUERY_KEYS=2469`

`BROADER_STRATIFIED_DIAGNOSTIC_DISTINCT_SUBSTRATE_KEYS_REACHED=4`

`BROADER_STRATIFIED_DIAGNOSTIC_ALBANIAN_KEYS_REACHED=4`

`BROADER_STRATIFIED_DIAGNOSTIC_LATIN_KEYS_REACHED=0`

`BROADER_STRATIFIED_DIAGNOSTIC_INTERPRETATION=CLASS_B_BROADER_SAMPLE_REVEALS_ADDITIONAL_EXISTING_SUBSTRATE_KEYS_BUT_NO_LATIN`

`BROADER_STRATIFIED_DIAGNOSTIC_SAMPLE_ARTIFACT=docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-broader-stratified-diagnostic-v0.1/sample.json`

`BROADER_STRATIFIED_DIAGNOSTIC_SAMPLE_SHA256=20bd7e0f93629d8c1c87dfa76c1b1f1b9bfeb763dc44905bced2f91341179ffd`

`BROADER_STRATIFIED_DIAGNOSTIC_RESULT_ARTIFACT=docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-broader-stratified-diagnostic-v0.1/results.json`

`BROADER_STRATIFIED_DIAGNOSTIC_RESULT_SHA256=51019087d2199f8506267c3e6a4fbdb8824962641a6ed49abaa7e2c7bcc59ee6`

`BROADER_STRATIFIED_DIAGNOSTIC_SUMMARY_SHA256=ef245127223957dc82dbd743543c31eded442253e61622bd4f6111610b9fbbbf`

`BROADER_STRATIFIED_DIAGNOSTIC_MANIFEST=docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-broader-stratified-diagnostic-v0.1/hash-manifest.json`

`BROADER_STRATIFIED_DIAGNOSTIC_MANIFEST_SHA256=41df36151de521353a2b2ea1ce178e3bb4a3aafe022cace01aa32c9baa2f657c`

`S3_RERUN=NO`

`S4=NOT_STARTED`

## Retrieval-key authority and reachability definition

The broader diagnostic result was reviewed without rerunning S3 or the broader
diagnostic. The smallest next definition is a paired, one-attempt,
whole-prepared-population retrieval-key authority and reachability procedure.
It separates exact source-display identity from a conditional retrieval-key
representation while retaining exact equality, source/citation/provenance,
valid Null, `no_single_winner`, and `user_decides`. It does not authorize
runtime canonicalization, source acquisition, a new language, or S4.

`RETRIEVAL_KEY_AUTHORITY_AND_REACHABILITY_DEFINITION=COMPLETE`

`RETRIEVAL_KEY_DEFINITION_DOCUMENT=docs/open-instrument/retrieval-key-authority-and-reachability-v0.1.md`

`RETRIEVAL_KEY_PROCEDURE=docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-retrieval-key-authority-and-reachability-v0.1/procedure.json`

`RETRIEVAL_KEY_PROCEDURE_STATUS=COMPLETE`

`RETRIEVAL_KEY_AUTHORITATIVE_ATTEMPTS=1`

`RETRIEVAL_KEY_RUNTIME_CANONICALIZATION_AUTHORIZED=NO`

`S3_RESULT_UNCHANGED=YES`

`BROADER_DIAGNOSTIC_RESULT_UNCHANGED=YES`

`S4=NOT_STARTED`

## Retrieval-key authority and reachability execution

The frozen procedure was executed exactly once. The authority gate derived
mechanically from the frozen evidence as `INSUFFICIENT_EVIDENCE`; Arm A was
not executed after the authority gate terminated the reachability procedure,
and Arm B was `NOT_AUTHORIZED`. No hypothetical reachability metrics were
created.

`RETRIEVAL_KEY_EXECUTION_STATUS=COMPLETE`

`RETRIEVAL_KEY_AUTHORITY_GATE=INSUFFICIENT_EVIDENCE`

`RETRIEVAL_KEY_ARM_A_STATUS=NOT_EXECUTED_AUTHORITY_GATE_TERMINATED`

`RETRIEVAL_KEY_ARM_B_STATUS=NOT_AUTHORIZED`

`RETRIEVAL_KEY_ARM_B_EXECUTED=NO`

`RETRIEVAL_KEY_INTERPRETATION_CLASS=CLASS_E_OPERATOR_NOT_AUTHORIZED_OR_NOT_SCIENTIFICALLY_DEFENSIBLE`

`RETRIEVAL_KEY_CANONICALIZATION_HYPOTHESIS=CLOSED_UNSUPPORTED_BY_FROZEN_AUTHORITY`

`RETRIEVAL_KEY_RESULT=docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-retrieval-key-authority-and-reachability-execution-v0.1/result.json`

`RETRIEVAL_KEY_RESULT_SHA256=43828f3dee6fe3d86a6cb673cfe600826222f1c776563798fb2d00b71e9f7188`

`RETRIEVAL_KEY_RESULT_MANIFEST=docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-retrieval-key-authority-and-reachability-execution-v0.1/hash-manifest.json`

`RETRIEVAL_KEY_RESULT_MANIFEST_SHA256=6be8afee402f79b6c827d85900676784cc7eac00a02c3cf4505ba0f738ec2d27`

`RETRIEVAL_KEY_SCIENTIFIC_RERUN=NO`

`S3_RESULT_UNCHANGED=YES`

`BROADER_DIAGNOSTIC_RESULT_UNCHANGED=YES`

`S4=NOT_STARTED`

## Explicit next action

`NEXT_ACTION=REVIEW_V0_2_SUBSTRATE_SOURCE_ARCHITECTURE_AFTER_CLASS_E`

The canonicalization hypothesis is closed for this frozen procedure. This does
not establish that canonicalization would fail or succeed in a future
authorized procedure. The v0.2 milestone remains active/incomplete and S4 is
not started.
