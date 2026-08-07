# Petro Zheji Primary-Source Inventory and Edition Policy Design v0.2

Status: DESIGN_REVISED_PENDING_REVIEW.

Project lane: Open Instrument / ZËRO.

Parent milestone:

`PETRO_ZHEJI_PRIMARY_SOURCE_AND_SYMBOLIC_ALGORITHM_FIDELITY_BASELINE_V0_1`

Lane ID:

`REVISE_PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_AND_EDITION_POLICY_DESIGN_V0_1`

Recorded product base:

`168ceccb32f572aa9820e5d435e48de6ec60e476`

## Design decision

Design the primary-source inventory schema and edition-selection policy required
before Open Instrument may classify any repository component as a direct or
source-based reconstruction of Petro Zheji.

This design does not construct the final source inventory.

This design does not verify a Petro Zheji edition.

This design does not acquire or download a book.

This design does not authorize implementation of the Symbolic Algorithm.

Revision result:

`PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_AND_EDITION_POLICY_DESIGN_REVISED_V0_2`

## Inherited inspected baseline

The original v0.1 design inspection recorded the following historical baseline.

This v0.2 revision does not reinterpret or refresh those counts:

- opening-base tracked Zheji paths: `175`;
- current-main tracked Zheji paths: `177`;
- post-opening additions: `2`;
- possible text or JSON source-related artifacts: `161`;
- repo-tracked binary primary-source artifacts: `0`;
- book-title and author reference lines: `62`;
- edition-metadata reference lines: `145`;
- page-citation reference lines: `34`;
- central-terminology reference lines: `195`;
- replay-separation reference lines: `3385`;
- DF_BRAIN Petro Zheji source-reference lines: `60`.

The two paths added after the opening baseline are:

- the Petro Zheji fidelity milestone document;
- its contract test.

The `161` possible source-related artifacts are primarily internal Markdown,
JSON, reports, reviews, fixtures, replay records, and tests.

They are not 161 Petro Zheji primary sources.

The repository contains no tracked PDF, EPUB, MOBI, DJVU, DOC, DOCX, ODT, or
RTF Petro Zheji primary-source artifact at this design baseline.

## Purpose

The source inventory must make it possible to answer:

1. which Petro Zheji works are relevant;
2. which exact editions are available;
3. whether an edition is physically or digitally accessible;
4. whether its printed pages are stable;
5. whether quoted passages can be traced to that edition;
6. whether different editions have different pagination or content;
7. whether a claim comes from Petro Zheji, a secondary author, Open Instrument,
   or a model;
8. what prevents a source from being used for direct attribution.

## Source hierarchy

The inventory must classify every source under exactly one primary class:

- `PETRO_ZHEJI_PRIMARY_PUBLISHED_WORK`;
- `PETRO_ZHEJI_PRIMARY_ARTICLE_OR_MANUSCRIPT`;
- `PETRO_ZHEJI_PRIMARY_INTERVIEW`;
- `EDITION_OR_LIBRARY_METADATA`;
- `SCHOLARLY_SECONDARY_ANALYSIS`;
- `GENERAL_SECONDARY_COMMENTARY`;
- `OPEN_INSTRUMENT_INTERNAL_MATERIAL`;
- `MODEL_OR_REPLAY_OUTPUT`;
- `UNKNOWN`.

A publication or library catalogue record may verify bibliographic metadata.

It does not replace the textual content of the primary work.

A secondary article may explain or quote Petro Zheji.

It does not become a Petro Zheji primary work.

An Open Instrument report may document this project's interpretation.

It does not define Petro Zheji's original method.

A model or replay output is never source evidence by itself.

## Required inventory fields

Every future source record must include:

- `sourceId`;
- `workId`;
- `canonicalTitle`;
- `originalLanguageTitle`;
- `author`;
- `workType`;
- `sourceClass`;
- `publisher`;
- `publicationYear`;
- `editionStatement`;
- `editionNumber`;
- `editionIdentityStatus`;
- `volume`;
- `isbnOrCatalogueId`;
- `totalPages`;
- `printedPageSystem`;
- `digitalPageSystem`;
- `language`;
- `physicalCopyStatus`;
- `scanStatus`;
- `sourceAccessStatus`;
- `sourceAccessOwner`;
- `sourceLocationClass`;
- `provenanceNotes`;
- `citationStability`;
- `quotationAvailability`;
- `legalUseNotes`;
- `knownEditionDifferences`;
- `editionSelectionRole`;
- `editionSelectionRoles`;
- `editionSelectionReason`;
- `existingOpenInstrumentCitationRefs`;
- `unresolvedEditionConflicts`;
- `contentRelevance`;
- `verificationStatus`;
- `reviewer`;
- `reviewedAt`;
- `blockers`.

Unknown fields must remain explicit.

Unknown values must not be silently inferred from neighbouring editions,
secondary sources, seller listings, filenames, or internal notes.

## Source-access states

Allowed source-access states are:

- `VERIFIED_ACCESSIBLE`;
- `ACCESSIBLE_UNVERIFIED_EDITION`;
- `METADATA_ONLY`;
- `PARTIAL_PREVIEW_ONLY`;
- `PHYSICAL_COPY_REQUIRED`;
- `SCAN_REQUIRED`;
- `LEGAL_ACCESS_UNRESOLVED`;
- `UNAVAILABLE`;
- `UNKNOWN`.

### VERIFIED_ACCESSIBLE

The exact edition is available for inspection and its identity has been
verified.

### ACCESSIBLE_UNVERIFIED_EDITION

Text is accessible, but edition identity or pagination has not been proven.

### METADATA_ONLY

Only bibliographic, library, publisher, seller, or catalogue metadata is
available.

### PARTIAL_PREVIEW_ONLY

Only selected pages, snippets, or preview sections are available.

### PHYSICAL_COPY_REQUIRED

Reliable work requires access to a physical edition.

### SCAN_REQUIRED

A verified copy exists, but stable digital inspection requires a lawful scan.

### LEGAL_ACCESS_UNRESOLVED

Potential access exists, but quotation, copying, or repository-storage rights
are unresolved.

### UNAVAILABLE

No usable copy has been located.

### UNKNOWN

The access posture has not been investigated.

## Edition-identity states

Allowed edition-identity states are:

- `EXACT_EDITION_VERIFIED`;
- `EDITION_FAMILY_VERIFIED`;
- `TITLE_ONLY`;
- `CONFLICTING_METADATA`;
- `UNKNOWN`.

### EXACT_EDITION_VERIFIED

The publisher, year, edition statement, volume, pagination, and copy identity
are sufficiently verified for page-cited work.

### EDITION_FAMILY_VERIFIED

The work and edition family are known, but the exact printing or pagination is
not fully verified.

### TITLE_ONLY

Only the title or general work identity is known.

### CONFLICTING_METADATA

Available records disagree on material edition facts.

### UNKNOWN

Edition identity has not been established.

A title match is not an edition match.

A publication year is not sufficient by itself.

A seller listing is not sufficient by itself.

## Citation-stability states

Allowed citation-stability states are:

- `PAGE_STABLE`;
- `DIGITAL_LOCATION_ONLY`;
- `SECTION_ONLY`;
- `QUOTED_WITHOUT_STABLE_PAGE`;
- `SECONDARY_CITATION_ONLY`;
- `UNLOCATED`;
- `UNKNOWN`.

### PAGE_STABLE

The quotation or transcription is tied to a verified edition and stable printed
page.

### DIGITAL_LOCATION_ONLY

Only a stable digital location is available.

### SECTION_ONLY

The section or chapter is known, but the page is not stable.

### QUOTED_WITHOUT_STABLE_PAGE

A quotation exists, but the edition or page cannot yet be established.

### SECONDARY_CITATION_ONLY

Only another author or publication cites the passage.

### UNLOCATED

The claimed passage has not been found in the inspected source.

### UNKNOWN

Citation stability has not been evaluated.

`PETRO_ZHEJI_DIRECT` requires `PAGE_STABLE` primary-source evidence unless a
future reviewed exception policy explicitly authorizes another stable primary
location.

## Page-number policy

Every page citation must record separately:

- printed page number;
- digital viewer page;
- PDF file page;
- volume;
- section or chapter;
- edition identity.

The printed page must not be replaced by the PDF viewer index.

Roman-numeral front matter must not be silently converted to Arabic numbering.

Inserted plates, unnumbered pages, blank pages, and publisher matter must be
recorded when they affect page alignment.

Page numbers from different editions must not be merged.

A quotation found in one edition may not inherit the page number of another
edition.

## Edition-selection policy

For each work, the inventory must identify:

1. earliest verifiable published edition;
2. most complete verifiable edition;
3. edition cited by existing Open Instrument material;
4. edition selected for the fidelity baseline;
5. reason for selection;
6. known changes between editions;
7. unresolved edition conflicts.

The selected fidelity edition should prioritize:

- complete relevant content;
- stable pagination;
- verifiable publication metadata;
- lawful access;
- reproducible citation;
- preserved original Albanian terminology.

An expanded later edition must not be treated as textually identical to an
earlier edition without comparison.

## Edition-selection role states

Every source record must declare both:

- exactly one primary `editionSelectionRole`;
- one required non-empty `editionSelectionRoles` collection containing every
  applicable edition-selection role.

Allowed values for both fields are:

- `FIDELITY_BASELINE_SELECTED`;
- `EARLIEST_VERIFIABLE`;
- `MOST_COMPLETE_VERIFIABLE`;
- `EXISTING_OPEN_INSTRUMENT_CITED`;
- `AVAILABLE_ALTERNATIVE`;
- `REJECTED_FOR_BASELINE`;
- `UNDECIDED`.

The primary `editionSelectionRole` records the source's current operational
decision posture.

The `editionSelectionRoles` collection records the complete machine-readable
descriptive classification of that source.

The collection must satisfy all of these invariants:

- it is an array;
- it is non-empty;
- every value belongs to the reviewed edition-selection role enum;
- every value is unique;
- the primary `editionSelectionRole` appears in the collection exactly once;
- every applicable descriptive role is retained;
- no role is silently inferred;
- `FIDELITY_BASELINE_SELECTED` and `REJECTED_FOR_BASELINE` never coexist;
- `FIDELITY_BASELINE_SELECTED` and `AVAILABLE_ALTERNATIVE` never coexist;
- an unknown or unresolved operational posture remains explicit;
- an unresolved operational posture remains primary `UNDECIDED` even when
  descriptive roles are retained.

`UNDECIDED` is operationally exclusive, not descriptively exclusive.

When a source's baseline-selection posture is unresolved, the primary
`editionSelectionRole` must be `UNDECIDED`.

In that unresolved posture, `editionSelectionRoles` must contain `UNDECIDED`
exactly once and must also retain every applicable descriptive role.

`UNDECIDED` may coexist with these descriptive roles:

- `EARLIEST_VERIFIABLE`;
- `MOST_COMPLETE_VERIFIABLE`;
- `EXISTING_OPEN_INSTRUMENT_CITED`;
- `AVAILABLE_ALTERNATIVE`.

When no descriptive role has been established, the collection must be exactly:

`[UNDECIDED]`

`UNDECIDED` must not coexist with `FIDELITY_BASELINE_SELECTED` or
`REJECTED_FOR_BASELINE`.

When the primary `editionSelectionRole` is `FIDELITY_BASELINE_SELECTED` or
`REJECTED_FOR_BASELINE`, `UNDECIDED` must be absent.

No descriptive role may be promoted to the primary `editionSelectionRole`
merely because that descriptive role is known while the baseline-selection
posture remains unresolved.

`FIDELITY_BASELINE_SELECTED` and `REJECTED_FOR_BASELINE` are mutually
exclusive.

The `editionSelectionRoles` collection must not contain both values.

When the primary `editionSelectionRole` is `FIDELITY_BASELINE_SELECTED`,
`REJECTED_FOR_BASELINE` must be absent.

When the primary `editionSelectionRole` is `REJECTED_FOR_BASELINE`,
`FIDELITY_BASELINE_SELECTED` must be absent.

`FIDELITY_BASELINE_SELECTED` and `AVAILABLE_ALTERNATIVE` are mutually
exclusive.

The `editionSelectionRoles` collection must not contain both
`FIDELITY_BASELINE_SELECTED` and `AVAILABLE_ALTERNATIVE`.

When the primary `editionSelectionRole` is `FIDELITY_BASELINE_SELECTED`,
`AVAILABLE_ALTERNATIVE` must be absent.

When the primary `editionSelectionRole` is `AVAILABLE_ALTERNATIVE`,
`FIDELITY_BASELINE_SELECTED` must be absent.

`FIDELITY_BASELINE_SELECTED` is permitted only when:

- `editionIdentityStatus` is `EXACT_EDITION_VERIFIED`;
- the selected source is lawfully accessible;
- pagination is sufficiently stable;
- the selection rationale is recorded;
- known alternatives and edition differences are recorded;
- unresolved conflicts are either empty or explicitly accepted by a later
  reviewed decision;
- the per-work decision status is `BASELINE_EDITION_REVIEWED`;
- the per-work `selectedSourceId` refers to this source.

When `editionSelectionRoles` contains `FIDELITY_BASELINE_SELECTED`, the primary
`editionSelectionRole` must also be `FIDELITY_BASELINE_SELECTED`.

When `editionSelectionRoles` contains `REJECTED_FOR_BASELINE`, the primary
`editionSelectionRole` must also be `REJECTED_FOR_BASELINE`.

A source may simultaneously retain roles such as:

- `EARLIEST_VERIFIABLE`;
- `MOST_COMPLETE_VERIFIABLE`;
- `EXISTING_OPEN_INSTRUMENT_CITED`;
- `AVAILABLE_ALTERNATIVE`.

The complete role collection must not be collapsed into one classification.

The primary role must not erase any other applicable role.

## Per-work edition-selection decision

Every work with more than one possible source or edition must have one
machine-readable decision record containing:

- `workId`;
- `candidateSourceIds`;
- `candidateSourceRoleAssignments`;
- `selectedSourceId`;
- `selectionDecisionStatus`;
- `selectionReason`;
- `existingOpenInstrumentCitationRefs`;
- `knownEditionDifferences`;
- `unresolvedEditionConflicts`;
- `reviewer`;
- `reviewedAt`;
- `blockers`.

Every `candidateSourceRoleAssignments` entry must contain:

- `sourceId`;
- `editionSelectionRole`;
- `editionSelectionRoles`.

The candidate set and role-assignment collection must satisfy all of these
invariants:

- every inventory source record has a globally unique `sourceId`; no two
  inventory source records may share the same `sourceId`;
- `candidateSourceIds` contains unique source IDs and no source ID may appear
  more than once;
- `candidateSourceIds` contains every inventory source record whose `workId`
  equals the decision record's `workId`;
- no inventory source record for that `workId` may be omitted from
  `candidateSourceIds`;
- sources are not removed from the candidate set merely because they are
  blocked, rejected, incomplete, or non-selected; those states remain explicit
  in their machine-readable roles, blockers, and source fields;
- every `candidateSourceId` appears in exactly one role assignment;
- every role assignment refers to a source in `candidateSourceIds`;
- every `candidateSourceId` resolves to a source record whose `workId` equals
  the decision record's `workId`;
- no unknown or additional source ID may appear;
- the assignment's primary `editionSelectionRole` matches the source record;
- the assignment's `editionSelectionRoles` collection matches the source
  record;
- assignment role values are unique and enum-valid;
- the assignment's primary role appears in its role collection exactly once;
- `FIDELITY_BASELINE_SELECTED` and `REJECTED_FOR_BASELINE` never coexist in
  one assignment;
- `FIDELITY_BASELINE_SELECTED` and `AVAILABLE_ALTERNATIVE` never coexist in
  one assignment;
- when an assignment's `editionSelectionRoles` contains
  `REJECTED_FOR_BASELINE`, its primary `editionSelectionRole` must also be
  `REJECTED_FOR_BASELINE`;
- every applicable descriptive role remains preserved;
- no assignment role is silently inferred;
- unknown or unresolved assignments use primary `UNDECIDED` explicitly;
- unresolved assignments retain `UNDECIDED` exactly once alongside every
  applicable descriptive role;
- assignment `UNDECIDED` must not coexist with `FIDELITY_BASELINE_SELECTED` or
  `REJECTED_FOR_BASELINE`;
- no descriptive assignment role may be promoted to primary while its
  baseline-selection posture remains unresolved.

Allowed `selectionDecisionStatus` values are:

- `UNREVIEWED`;
- `NO_ELIGIBLE_EDITION`;
- `DECISION_BLOCKED`;
- `BASELINE_EDITION_PROPOSED`;
- `BASELINE_EDITION_REVIEWED`;
- `REJECTED`.

`selectedSourceId` must remain null when the status is:

- `UNREVIEWED`;
- `NO_ELIGIBLE_EDITION`;
- `DECISION_BLOCKED`;
- `REJECTED`.

When the status is `BASELINE_EDITION_PROPOSED`:

- `selectedSourceId` must identify exactly one source in `candidateSourceIds`;
- that candidate source must satisfy the decision record's `workId` binding;
- that candidate source's assignment must not contain
  `REJECTED_FOR_BASELINE`;
- the proposal pointer does not by itself grant
  `FIDELITY_BASELINE_SELECTED`.

When the status is `BASELINE_EDITION_REVIEWED`:

- `selectedSourceId` must identify one candidate source;
- that source's assignment must contain `FIDELITY_BASELINE_SELECTED`;
- that source's assignment must not contain `REJECTED_FOR_BASELINE`;
- that source's assignment must not contain `AVAILABLE_ALTERNATIVE`;
- that source's primary role must be `FIDELITY_BASELINE_SELECTED`;
- no other candidate assignment may contain `FIDELITY_BASELINE_SELECTED`.

When any assignment contains `FIDELITY_BASELINE_SELECTED`, the decision status
must be `BASELINE_EDITION_REVIEWED` and `selectedSourceId` must identify that
assignment's source.

A source record cannot be treated as the fidelity-baseline edition merely
because it is accessible.

The selected source must be linked through `selectedSourceId`.

The selection reason, existing Open Instrument citations, known edition
differences, unresolved conflicts, reviewer, review time, and candidate role
assignments must remain machine-readable and reproducible.

## First-title targets

The first inventory construction lane must investigate:

- `Shqipja dhe Sanskritishtja`;
- `Roli Mesianik i Shqipes`;
- `Libri i Aforizmave`, only where linguistically or symbolically relevant;
- attributable Petro Zheji articles;
- attributable Petro Zheji manuscripts;
- attributable Petro Zheji interviews that directly discuss the linguistic or
  symbolic system.

The target list is not a claim that all listed works contain the complete
Symbolic Algorithm.

## Quotation and copyright boundary

The inventory may record:

- short quotations necessary to identify a definition;
- precise transcription location;
- bounded translation;
- paraphrase;
- bibliographic metadata;
- hashes or fingerprints of locally inspected material when lawful.

The repository must not contain:

- complete copyrighted books;
- large unauthorized scans;
- long reproduced chapters;
- excessive quotation;
- access credentials;
- private cloud links;
- unverified download mirrors.

A lawful locally held source may be inspected without committing the source
file to the repository.

The inventory should store citation metadata and bounded evidence, not the
complete copyrighted work.

## Source-location classes

Allowed source-location classes are:

- `PUBLIC_LIBRARY_OR_ARCHIVE`;
- `PUBLISHER_OR_BOOKSELLER_METADATA`;
- `LAWFUL_LOCAL_PHYSICAL_COPY`;
- `LAWFUL_LOCAL_DIGITAL_COPY`;
- `PARTIAL_PUBLIC_PREVIEW`;
- `SCHOLARLY_DATABASE`;
- `OPEN_WEB_SECONDARY_SOURCE`;
- `OPEN_INSTRUMENT_REPOSITORY`;
- `PRIVATE_LOCATION_NOT_RECORDED`;
- `UNKNOWN`.

Private filesystem paths must not be committed.

Credentials must not be committed.

## Verification states

Allowed verification states are:

- `UNREVIEWED`;
- `METADATA_REVIEWED`;
- `EDITION_IDENTITY_REVIEWED`;
- `CONTENT_LOCATED`;
- `PAGE_CITATION_REVIEWED`;
- `BLOCKED`;
- `REJECTED`.

No record may jump directly from `UNREVIEWED` to
`PAGE_CITATION_REVIEWED` without edition and content-location proof.

## Missing-source blocker policy

A source record must carry one or more explicit blockers when applicable:

- `PRIMARY_TEXT_NOT_AVAILABLE`;
- `EXACT_EDITION_NOT_VERIFIED`;
- `PAGINATION_NOT_VERIFIED`;
- `CONFLICTING_PUBLICATION_METADATA`;
- `ONLY_SECONDARY_QUOTATION_AVAILABLE`;
- `PARTIAL_PREVIEW_INSUFFICIENT`;
- `COPYRIGHT_OR_ACCESS_UNRESOLVED`;
- `ORIGINAL_LANGUAGE_TEXT_NOT_AVAILABLE`;
- `TRANSLATION_NOT_REVIEWED`;
- `PASSAGE_NOT_LOCATED`;
- `WORK_RELEVANCE_NOT_VERIFIED`;
- `UNKNOWN`.

A blocker is a valid outcome.

A blocked source must not be upgraded by model inference.

## Provenance rules

Every future quotation, definition, example, or formalization must refer to a
source record.

Every source record must declare its source class.

Every page-cited passage must identify the exact edition record.

Every secondary interpretation must identify its primary-source dependency when
known.

Every Open Instrument inference must be labelled as project interpretation.

Every model suggestion must be labelled `MODEL_OR_REPLAY_OUTPUT`.

No internal file may be reclassified as a Petro Zheji primary source because it
contains Petro Zheji terminology.

## Initial repository classification

At this design baseline:

- the 177 Zheji-named tracked paths form an audit surface;
- they do not form a primary-source corpus;
- the 161 possible text or JSON artifacts form an internal evidence and history
  surface;
- the binary Petro Zheji primary-source count is `0`;
- existing replay material belongs under `MODEL_OR_REPLAY_OUTPUT` or
  `OPEN_INSTRUMENT_INTERNAL_MATERIAL`;
- the milestone document and contract test belong under
  `OPEN_INSTRUMENT_INTERNAL_MATERIAL`.

## Review requirements

The revised design review must verify:

- field completeness;
- state exclusivity;
- edition-selection safety;
- required `editionIdentityStatus` coverage;
- complete `editionSelectionRoles` coverage;
- primary-role inclusion and uniqueness;
- `UNDECIDED` operational exclusivity with descriptive-role retention;
- required per-work edition-selection decision coverage;
- complete `candidateSourceRoleAssignments` coverage;
- one assignment for every candidate source;
- selected-edition rationale and citation traceability;
- printed-page versus digital-page separation;
- copyright and quotation limits;
- missing-source fail-closed behavior;
- primary versus secondary source separation;
- internal material and replay separation;
- compatibility with the parent milestone;
- absence of implementation authorization.

## Design acceptance criteria

The revised design may be accepted when the review confirms:

- the inventory schema is sufficient;
- source classes are mutually understandable;
- access states are fail-closed;
- edition states prevent title-only attribution;
- every source record carries a machine-readable `editionIdentityStatus`;
- every source record retains all applicable edition roles through
  `editionSelectionRoles`;
- every primary `editionSelectionRole` is present in the role collection;
- role collections are non-empty, unique, enum-valid, and explicit;
- unresolved sources keep primary `UNDECIDED` while retaining every
  applicable descriptive role;
- every candidate source has exactly one machine-readable role assignment;
- per-work role assignments preserve all source-record roles;
- the selected fidelity edition is linked through a reviewed per-work decision;
- selection reasons, existing citations, role assignments, and unresolved
  conflicts remain machine-readable;
- citation states prevent unstable page claims;
- quotation boundaries protect copyrighted works;
- missing-source blockers remain valid outcomes;
- page numbers cannot be mixed across editions;
- internal files cannot masquerade as primary sources;
- model and replay outputs cannot become source evidence;
- the next implementation lane remains separately authorized.

## Explicitly not authorized

This design does not authorize:

- source acquisition;
- source downloading;
- committing copyrighted books;
- committing book scans;
- primary-source verification;
- final bibliography construction;
- source-record implementation;
- terminology reconstruction;
- Code F reconstruction;
- Code E reconstruction;
- free-operator reconstruction;
- equivocal-pair reconstruction;
- symbolic-figure reconstruction;
- symbolic-equation reconstruction;
- semantic-spectrum reconstruction;
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

Runtime implementation: not authorized.

Source download: not authorized.

Copyrighted book commit: not authorized.

Provider or model execution: not authorized.

Zheji replay: not authorized.

Operator promotion: not authorized.

JO, PO, and MAT: not authorized.

## Revision provenance and historical boundary

This v0.2 design is derived from the reviewed and blocked v0.1 design.

Immutable v0.1 design blob:

`0fbf3efa30f718f519ee6ea2ffb58d35d50c147c`

The v0.1 design and its blocked formal review remain historical records.

This v0.2 artifact does not rewrite, erase, or retroactively accept the v0.1
design.

The v0.2 design exists because the v0.1 formal review identified a lossy
edition-role model.

This revision adds:

- required plural source-level `editionSelectionRoles`;
- complete descriptive-role retention;
- primary-role inclusion;
- uniqueness and enum-membership requirements;
- explicit `UNDECIDED` operational posture with descriptive-role retention;
- required per-work `candidateSourceRoleAssignments`;
- one role assignment for every candidate source;
- fidelity-baseline consistency between source records and per-work decisions.

This v0.2 design remains unaccepted until a new formal review is completed.

## Current next task

`REVIEW_REVISED_PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_AND_EDITION_POLICY_DESIGN_V0_2`

The next lane must review this v0.2 design only.

It must verify that the blocked role-retention defect is closed.

It must verify that the immutable v0.1 design and blocked review remain intact.

It must not construct source records.

It must not design the construction scope.

It must not download or commit source books.

It must not authorize runtime or Symbolic Algorithm implementation.

## Design marker

`PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_AND_EDITION_POLICY_DESIGN_REVISED_V0_2`
