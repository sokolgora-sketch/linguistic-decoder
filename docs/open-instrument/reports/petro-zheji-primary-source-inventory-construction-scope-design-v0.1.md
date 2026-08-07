# Petro Zheji Primary-Source Inventory Construction-Scope Design v0.1

Status: CONSTRUCTION_SCOPE_DESIGN_ONLY_PENDING_REVIEW.

Project lane: Open Instrument / ZËRO.

Parent milestone:

`PETRO_ZHEJI_PRIMARY_SOURCE_AND_SYMBOLIC_ALGORITHM_FIDELITY_BASELINE_V0_1`

Lane ID:

`DESIGN_PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_CONSTRUCTION_SCOPE_V0_1`

Governing accepted source-inventory design:

`docs/open-instrument/reports/petro-zheji-primary-source-inventory-and-edition-policy-design-v0.2.md`

Governing accepted design blob:

`d2f34e4affe83461dd757ab6f10805c9c05fdb01`

Governing formal review:

`docs/open-instrument/reviews/petro-zheji-primary-source-inventory-and-edition-policy-design-review-v0.2.md`

Governing accepted review blob:

`fce4969bce5b3ed3fdbf36ec0d67df596f0f21bc`

Governing accepted product main:

`4dc5e81265b23addea82d7c9b3e621e6792ab6e7`

## Purpose

This design converts the formally accepted v0.2 source-inventory schema and
edition-selection policy into the concrete operational procedure required to
begin real Petro Zheji source inventory work.

This lane is intentionally narrow.

It does not reopen the accepted v0.2 edition-selection policy.

It does not create source records.

It does not acquire, download, scan, transcribe, or verify a Petro Zheji work.

It does not reconstruct terminology or the Symbolic Algorithm.

Its sole purpose is to define the final authorization boundary between design
work and real primary-source inventory work.

## Anti-loop rule

This is the final planned construction-scope design lane before actual
primary-source inventory work.

A future formal review of this construction-scope design may block the lane only
for a concrete safety, provenance, schema, copyright, edition-identity,
citation-integrity, or authorization defect.

Editorial preference, stylistic preference, duplicate wording, or a desire for
additional abstract documentation is not by itself a reason to create another
design revision.

If the construction-scope formal review finds no concrete blocking defect, it
must authorize the bounded source-inventory construction lane rather than
opening another design-only iteration.

Any blocked review must record a specific machine-checkable or
evidence-checkable blocking defect.

## Governing schema rule

The accepted 38-field v0.2 inventory schema remains authoritative.

This construction-scope design does not add, delete, rename, or redefine an
inventory field.

The accepted source-class, source-access, edition-identity,
citation-stability, edition-selection-role, selection-decision-status,
verification-status, and blocker semantics remain authoritative.

No parallel replacement schema is created here.

No construction process may silently infer a missing value merely to make a
record complete.

Unknown, unresolved, unavailable, and blocked outcomes remain valid outcomes.

## Source-work authorization model

Current construction authorization:

`NOT_GRANTED`

The appearance of a future authorization marker in this design does not grant
authorization.

Source construction becomes authorized only after a separate formal review
accepts this exact construction-scope design and that accepted review is merged
to `main`.

Required future review marker:

`PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_CONSTRUCTION_SCOPE_REVIEWED_ACCEPTED_V0_1`

Only after that accepted review is merged may the project enter:

`CONSTRUCT_PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_V0_1`

At that transition, the bounded source-work authorization marker will be:

`SOURCE_INVENTORY_CONSTRUCTION_AUTHORIZED_V0_1`

The future authorization applies only to the source-inventory activities
explicitly listed in this document.

It does not authorize Symbolic Algorithm reconstruction or runtime work.

## Activities the future accepted gate may authorize

The construction-scope review may authorize exactly these bounded source-work
activities:

1. `SOURCE_DISCOVERY`;
2. `LAWFUL_SOURCE_ACCESS_IDENTIFICATION`;
3. `LAWFUL_SOURCE_ACQUISITION_OR_INSPECTION`;
4. `SOURCE_RECORD_CONSTRUCTION`;
5. `EDITION_IDENTITY_VERIFICATION`;
6. `PAGINATION_VERIFICATION`;
7. `CONTENT_LOCATION`;
8. `PAGE_CITATION_VERIFICATION`;
9. `BOUNDED_QUOTATION_TRANSLATION_AND_BIBLIOGRAPHIC_CAPTURE`;
10. `MISSING_SOURCE_BLOCKER_RECORDING`.

These are inventory and provenance activities.

They do not authorize semantic reconstruction of Petro Zheji's system.

## Lawful source-access boundary

Future source work may use only lawful access paths.

Examples include:

- public libraries and archives;
- publisher or bookseller bibliographic metadata;
- lawful locally owned physical copies;
- lawful locally held digital copies;
- partial public previews;
- scholarly databases available to the user;
- attributable public articles or interviews;
- lawful open-web material.

A source file does not need to be committed to the repository in order to be
inspected lawfully.

The repository must store source metadata, provenance, citation information,
bounded evidence, and hashes where appropriate rather than unauthorized copies
of complete copyrighted works.

The source-work lane must never require credentials to be committed.

Private filesystem paths must not be committed.

Private cloud URLs must not be committed.

Unauthorized mirrors must not be promoted as source evidence.

## Copyright and quotation boundary

The future source-inventory lane may record only the bounded evidence needed for
bibliographic identity and later reproducible citation.

Permitted repository evidence includes:

- bibliographic metadata;
- edition metadata;
- catalogue identifiers;
- page or location references;
- short quotations necessary to identify a definition or passage;
- bounded translations;
- paraphrases clearly labelled as paraphrases;
- hashes or fingerprints of lawfully inspected local material;
- provenance notes.

The repository must not contain:

- complete copyrighted books;
- complete copyrighted scans;
- long reproduced chapters;
- excessive quotation;
- access credentials;
- private source files.

Copyright uncertainty is a valid blocker.

## Record-construction sequence

Once the future construction authorization is granted, each source candidate
must proceed through this sequence.

### Step 1 — discovery

Identify the candidate work or edition.

Record only evidence actually available.

Do not infer edition identity from title similarity.

Do not infer relevance from filename or terminology alone.

### Step 2 — source-record initialization

Create a source record using the complete accepted 38-field schema before any
lawful-access failure can stop work on the candidate.

Every required field must exist.

Unknown or unresolved values must remain explicit.

The source record must receive a globally unique `sourceId`.

The record must be bound to one explicit `workId`.

This initialization guarantees that a candidate remains auditable even when
lawful inspection cannot later be established.

### Step 3 — lawful-access assessment

Determine how the source can be lawfully inspected.

The already initialized source record must record `sourceLocationClass`,
`sourceAccessStatus`, and all applicable `blockers`.

Do not bypass paywalls, credentials, copyright controls, or private access
restrictions.

If lawful inspection cannot be established, preserve the initialized source
record with its explicit access state, location class, and blocker evidence,
then stop before Step 4.

An access-blocked candidate must not be deleted, skipped, or left without a
38-field source record merely because lawful inspection is unavailable.

### Step 4 — bibliographic and edition identity

Review title, author attribution, publication metadata, edition statement,
edition number, volume, ISBN or catalogue identity where available.

Do not promote a record to exact-edition verified status from title-only
matching.

Conflicting publication metadata must remain visible.

### Step 5 — pagination assessment

Record printed and digital page systems separately.

Do not copy a page number from one edition into another edition record.

Pagination instability must remain visible through the existing citation
stability and blocker mechanisms.

### Step 6 — content location

Locate the relevant passage or section without yet reconstructing Petro Zheji's
algorithmic meaning.

Content location proves where material exists.

It does not prove a semantic interpretation.

### Step 7 — page-citation review

Only a source record whose `editionIdentityStatus` is exactly
`EXACT_EDITION_VERIFIED` may reach page-citation-reviewed status.

`EDITION_FAMILY_VERIFIED`, `TITLE_ONLY`, `CONFLICTING_METADATA`, and `UNKNOWN`
cannot satisfy page-citation review.

Before promotion, lawful access and content location must be reviewed, and
`citationStability` must be exactly `PAGE_STABLE`.

The citation must bind to the exact source record, the exact verified edition,
and the stable printed page belonging to that edition.

### Step 8 — edition-selection decision

All source records for the same `workId` remain visible in the candidate set.

Candidate IDs remain exhaustive and unique.

Role assignments remain complete.

The accepted v0.2 `UNDECIDED`, selection, rejection, and descriptive-role rules
remain authoritative.

### Step 9 — inventory review

A reviewed source record may contribute to the primary-source inventory.

A blocked source remains a valid inventory outcome.

A rejected edition remains visible as provenance rather than being deleted to
make the evidence look cleaner.

## Review checkpoints

Future construction uses six fail-closed checkpoints:

1. `DISCOVERY_AND_ATTRIBUTION_CHECKPOINT`;
2. `LAWFUL_ACCESS_CHECKPOINT`;
3. `EDITION_IDENTITY_CHECKPOINT`;
4. `PAGINATION_AND_CONTENT_LOCATION_CHECKPOINT`;
5. `PAGE_CITATION_CHECKPOINT`;
6. `INVENTORY_ACCEPTANCE_CHECKPOINT`.

Failure at one checkpoint prevents silent promotion to the next checkpoint.

A blocker is an acceptable result.

Model inference cannot override a failed checkpoint.

## Discovery and attribution checkpoint

This checkpoint asks whether the candidate is attributable enough to retain as
a source candidate.

It does not assert that the work contains the Symbolic Algorithm.

Secondary references may identify a candidate but may not substitute for a
primary source when primary-source evidence is required.

Open Instrument repository files are not Petro Zheji primary sources merely
because they contain his name or terminology.

## Lawful access checkpoint

This checkpoint requires an allowed source-location class and an explicit
access state.

If lawful inspection cannot be established, source work stops with an access or
copyright blocker.

## Edition identity checkpoint

This checkpoint requires sufficient publication and edition identity evidence
before exact-edition claims can be made.

Title-only matching is insufficient.

Where editions conflict, unresolved conflicts remain machine-readable.

## Pagination and content-location checkpoint

Printed pagination and digital pagination remain separate.

A content location must be tied to the inspected edition.

An unstable or partial preview may remain useful metadata without becoming a
stable page citation.

## Page-citation checkpoint

A page citation may be reviewed only when:

- the source record exists;
- `editionIdentityStatus` is exactly `EXACT_EDITION_VERIFIED`;
- `citationStability` is exactly `PAGE_STABLE`;
- lawful access is documented;
- content is actually located;
- the cited printed page belongs to that same exact verified edition record.

`EDITION_FAMILY_VERIFIED`, `TITLE_ONLY`, `CONFLICTING_METADATA`, and `UNKNOWN`
must not satisfy this checkpoint.

No model-generated page number may satisfy this checkpoint.

## Inventory acceptance checkpoint

A source record can enter the reviewed inventory only after all applicable
earlier checkpoint evidence is preserved.

Inventory acceptance is not algorithmic acceptance.

It proves source provenance and citation readiness only.

## Evidence classes during source inventory

The construction lane may create:

- bibliographic evidence;
- edition-identity evidence;
- lawful-access provenance;
- pagination evidence;
- content-location evidence;
- page-citation evidence;
- bounded quotation evidence;
- bounded translation evidence;
- blocker evidence;
- edition-selection evidence.

It may not create Petro Zheji algorithm-truth evidence merely because a passage
has been located.

Semantic interpretation remains a later lane.

## Required audit trace

Every source record must preserve enough information to answer:

- what work is this;
- what edition is this;
- how was it identified;
- how can it lawfully be inspected;
- who reviewed it;
- when was it reviewed;
- what publication evidence was used;
- what pagination system applies;
- where is the relevant content;
- what remains unresolved;
- what blockers remain;
- why was this edition selected, rejected, retained as an alternative, or left
  undecided.

No reviewer may erase an unresolved conflict merely to advance the record.

## Machine boundary

The source inventory is an evidence store, not an algorithm executor.

No source-inventory record may trigger:

- provider execution;
- model execution;
- replay;
- API behavior;
- UI behavior;
- operator promotion;
- origin-claim promotion;
- automatic Zheji interpretation.

Any future automation must be separately designed and authorized.

## What remains unauthorized even after source-construction authorization

Even after the future source-inventory construction gate is accepted, the
following remain outside that authorization:

- terminology reconstruction;
- Code F reconstruction;
- Code E reconstruction;
- free-operator reconstruction;
- equivocal-pair reconstruction;
- symbolic-figure reconstruction;
- symbolic-equation reconstruction;
- semantic-spectrum reconstruction;
- complete Symbolic Algorithm reconstruction;
- runtime changes;
- API changes;
- UI changes;
- provider execution;
- model calls;
- Zheji replay;
- operator promotion;
- historical-origin claims;
- primordial-language platform claims;
- language-superiority claims;
- winner claims;
- ownership claims;
- JO work;
- PO work;
- MAT work.

## Construction-scope review requirements

The formal construction-scope review must verify:

1. direct binding to the formally accepted v0.2 design and review;
2. no competing source schema was introduced;
3. the 38-field governing schema remains authoritative;
4. lawful acquisition and inspection boundaries are explicit;
5. copyright and quotation boundaries are fail-closed;
6. the record-construction sequence initializes the complete source record before any lawful-access stop and remains deterministic enough for human review;
7. all six checkpoints are explicit and fail-closed;
8. page-citation review requires `editionIdentityStatus: EXACT_EDITION_VERIFIED` and `citationStability: PAGE_STABLE`;
9. secondary and internal material cannot masquerade as primary evidence;
10. blocked and unknown outcomes remain valid;
11. the future authorization is limited to the exact ten source-work
    activities;
12. Symbolic Algorithm and runtime work remain unauthorized;
13. the anti-loop transition to actual source inventory is explicit.

## Construction-scope acceptance criteria

The construction-scope design may be accepted when the formal review confirms:

1. the governing v0.2 artifacts are cryptographically bound;
2. the accepted 38-field schema is preserved unchanged;
3. no parallel state or role system supersedes the accepted v0.2 semantics;
4. lawful source access can be distinguished from unknown or blocked access;
5. complete copyrighted works are never required in the repository;
6. source records are initialized before lawful-access failure can stop candidate processing and remain fail-closed rather than inferred-complete;
7. edition identity precedes exact edition claims;
8. stable page claims require exact `EXACT_EDITION_VERIFIED` edition identity and `PAGE_STABLE` citation stability;
9. content location is separated from semantic interpretation;
10. all source candidates for one work remain auditable;
11. the six review checkpoints prevent silent promotion;
12. actual construction is impossible until the formal review gate is merged;
13. a successful formal review transitions directly into real source inventory
    work instead of another design-only iteration.

## Required next review outcome

The next lane is:

`REVIEW_PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_CONSTRUCTION_SCOPE_V0_1`

That review has exactly two legitimate outcomes:

- `REVIEWED_ACCEPTED`;
- `REVIEW_BLOCKED`.

`REVIEW_BLOCKED` requires at least one concrete blocking defect tied to a
construction-scope review requirement or acceptance criterion.

If no such blocker exists, the review must be `REVIEWED_ACCEPTED`.

A clean accepted review authorizes:

`CONSTRUCT_PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_V0_1`

No additional construction-scope design PR is planned after a clean acceptance.

## Current authorization summary

Formally accepted v0.2 inventory/edition policy: YES.

Construction-scope design lane: AUTHORIZED.

Source discovery execution: NOT_GRANTED.

Source acquisition or inspection execution: NOT_GRANTED.

Source-record construction: NOT_GRANTED.

Primary-source verification: NOT_GRANTED.

Edition verification: NOT_GRANTED.

Page-citation verification: NOT_GRANTED.

Symbolic Algorithm implementation: NOT_GRANTED.

Runtime/API/UI changes: NOT_GRANTED.

Provider/model execution: NOT_GRANTED.

JO / PO / MAT work: NOT_GRANTED.

## Parent milestone state

The parent milestone remains open.

It is not complete.

It is not closed.

No page-cited Petro Zheji primary-source corpus is yet verified.

No source-faithful complete Symbolic Algorithm reconstruction exists yet.

## Design marker

`PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_CONSTRUCTION_SCOPE_DESIGN_V0_1`
