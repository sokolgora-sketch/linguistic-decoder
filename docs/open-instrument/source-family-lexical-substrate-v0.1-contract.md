# Open Instrument — Source-Family Lexical Substrate v0.1 Contract

Status: FROZEN_CONTRACT_ONLY

Contract ID: OPEN_INSTRUMENT_SOURCE_FAMILY_LEXICAL_SUBSTRATE_V0_1

This document defines the source-fact-only boundary for a future scalable
lexical substrate. It does not acquire, import, index, or expose a source
family, and it does not change runtime retrieval.

## 1. Scope and authority

The source-family substrate is a separate authority layer from:

- the existing bounded direct Albanian and Latin adapters;
- the target-bound multi-source research catalog;
- reviewed functional evidence;
- pronunciation authority;
- production API or /chat behavior.

The contract admits only source-attested lexical facts. It does not authorize
a source family for acquisition. A future acquisition or implementation lane
must bind a particular source family, immutable snapshot, adapter, and
derived index to this contract.

## 2. Source-family identity

A source family is identified by all of the following:

- SOURCE_FAMILY_ID: stable repository-native identifier;
- SOURCE_TRADITION_ID: source-tradition identity;
- language and language variety, with UNKNOWN or NULL when the source does not
  establish them;
- source title, author/editor, publisher/host, version/date, and canonical
  reference;
- archive or stable reference, if available;
- license identifier, license reference, attribution obligations, and
  redistribution posture;
- acquisition method and reproducibility statement;
- authority status and claim boundary.

Missing or contradictory identity fails closed. A source tradition is not
admitted merely because a record has a plausible form or gloss.

## 3. Source-snapshot identity

A source snapshot is immutable input to a future adapter. It must bind:

- SOURCE_SNAPSHOT_ID;
- SOURCE_FAMILY_ID;
- source version/date and acquisition timestamp where available;
- canonical source/archive reference;
- exact byte count;
- SHA-256;
- format and encoding;
- record ordering rule;
- source snapshot status;
- license and attribution binding.

An online URL is a locator, not an immutable identity. A future execution
must verify the bound bytes and hash before reading the source. A mismatch,
unreadable input, malformed encoding, or unsupported format is
SOURCE_IDENTITY_MISMATCH or SOURCE_SNAPSHOT_INVALID and produces no records.

Large source snapshots should remain external and hash-bound unless repository
policy and license posture explicitly permit bundling. A runtime must not
fetch an unpinned source.

## 4. Source-record model

Each admitted source record must preserve, at minimum:

- SOURCE_FAMILY_ID;
- SOURCE_SNAPSHOT_ID;
- SOURCE_RECORD_ID;
- language and variety;
- EXACT_SOURCE_FORM, preserved byte-for-byte at the source-record text
  boundary;
- source-attested gloss or sense text, when present;
- optional source-attested part of speech;
- entry locator and citation identity;
- provenance and snapshot binding;
- attestation truth;
- source status.

Source record identity must be deterministic and stable within the bound
snapshot. A future adapter must define how record ordinal, entry identity,
sense identity, or an equivalent source-native identity contributes to
SOURCE_RECORD_ID and ENTRY_LOCATOR. If stable identity cannot be represented,
the record is not admitted.

The source form shown to a user as evidence is EXACT_SOURCE_FORM. It is never
rewritten by retrieval-key processing.

## 5. Retrieval representation

SOURCE_FORM and RETRIEVAL_KEY are separate concepts.

SOURCE_FORM is the exact source-attested form. RETRIEVAL_KEY is a deterministic
lookup representation produced by a separately versioned operator. A retrieval
key never replaces the source form and never changes citation, gloss,
attestation, source status, pronunciation authority, historical authority,
functional authority, or semantic status.

The default for a future source family is the currently authorized exact
representation contract. No new canonicalization operator is authorized by
this document. A source-family implementation that requires a different
operator must first obtain a separately frozen operator authority.

Matching remains EXACT EQUALITY OF AUTHORIZED RETRIEVAL KEYS. This contract
does not authorize substring, prefix, suffix, edit-distance, fuzzy, phonetic,
semantic, embedding, provider, or model matching.

## 6. Deterministic index policy

A future derived index must be built offline from one verified snapshot and a
versioned adapter. It must bind:

- source snapshot identity and hash;
- source-family adapter identity and version;
- retrieval representation/operator identity;
- deterministic record ordering;
- deterministic key ordering;
- index schema/version and derived-artifact hash.

The index maps one retrieval key to zero, one, or many preserved source
records. Distinct source records are never silently deduplicated. Collisions
must be reported separately as:

- within-source-record;
- within-language;
- cross-language;
- within-source-tradition.

Collision presence does not authorize a winner. All admissible records remain
available with their independent provenance, preserving NO_SINGLE_WINNER and
USER_DECIDES. If the candidate model cannot represent a collision without
losing identity or provenance, the key fails closed rather than being
collapsed.

Empty keys, unsupported transformations, malformed records, missing source
identity, missing locator, missing attestation, invalid provenance, and
unrepresentable collisions fail closed.

## 7. Truth and semantic boundaries

The source-family layer may provide SOURCE_FACT and deterministic derived
metadata only. It must preserve:

- SOURCE_FACT;
- DERIVED_STRUCTURE;
- FUNCTIONAL_HYPOTHESIS only when separately reviewed and authorized;
- UNKNOWN_NULL.

Lexical attestation is not pronunciation authority. Orthographic source form
is not spoken Voice authority. Structural resemblance is not historical origin.
Gloss similarity is not derivation or semantic causation. Research evidence is
not production authority. originClaim remains NOT_CLAIMED unless separately
authorized.

The source-family record must not contain or derive targetWord, targetSenseId,
semanticBridge, functionalHypothesis, functional outcome, historical-origin
claim, historical-transmission claim, winner claim, language-superiority claim,
pronunciation mapping, Voice path, Gamma, ZC, or production status.

## 8. Separation from reviewed enrichment

The target-bound research catalog remains governed by its existing admission
contract. This source-family contract must not weaken that contract or use
target-bound fields to make a generic lexical record admissible.

Reviewed functional evidence may later enrich a source-fact candidate only
through a separately authorized, provenance-preserving join. Enrichment must
remain optional, visible, and fail closed. A generic lexical source record
must never be promoted to a functional or historical claim by virtue of a
gloss alone.

## 9. Reproducibility and anti-circularity

Before any future retrieval or coverage evaluation, freeze:

- source family and snapshot;
- adapter and retrieval-representation operator;
- ordering and index identity;
- population and exclusions;
- query generator and matching semantics;
- evaluation metrics and attempt policy.

The future lane must not select source records from attractive outcomes,
change the source snapshot after observing results, add target-word mappings,
or use semantic attractiveness to choose a cohort. One authoritative
execution is preferred unless a separate authority explicitly defines an
infrastructure retry that does not create a second scientific attempt.

## 10. Non-authorization in this lane

This contract does not authorize:

- source acquisition or download;
- source import or repository bundling;
- source-family adapter implementation;
- deterministic index generation;
- runtime/API/UI integration;
- query, matching, or normalization changes;
- pronunciation, functional, historical, semantic, or production promotion;
- S4, S3 rerun, broader-diagnostic rerun, providers, or models.

The contract is complete only as a boundary definition. A selected source
family still requires a separate snapshot-acquisition procedure and a
separate implementation decision.
