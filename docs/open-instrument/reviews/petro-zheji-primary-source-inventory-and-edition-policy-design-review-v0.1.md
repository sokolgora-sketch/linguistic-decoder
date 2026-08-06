# Petro Zheji Primary-Source Inventory and Edition-Policy Design Review v0.1

Status: REVIEW_BLOCKED.

Project lane: Open Instrument / ZËRO.

Parent milestone:

`PETRO_ZHEJI_PRIMARY_SOURCE_AND_SYMBOLIC_ALGORITHM_FIDELITY_BASELINE_V0_1`

Review lane ID:

`REVIEW_PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_AND_EDITION_POLICY_DESIGN_V0_1`

Reviewed design lane:

`DESIGN_PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_AND_EDITION_POLICY_V0_1`

Reviewed design:

`docs/open-instrument/reports/petro-zheji-primary-source-inventory-and-edition-policy-design-v0.1.md`

Reviewed product main:

`8a664087086cad795486f1d86be48470b7cc9ac2`

Reviewed design blob:

`0fbf3efa30f718f519ee6ea2ffb58d35d50c147c`

## Review decision

The Petro Zheji primary-source inventory and edition-policy design v0.1 is not
accepted in its current form.

Review result:

`PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_AND_EDITION_POLICY_DESIGN_REVIEW_BLOCKED`

The design contains a blocking loss-of-information defect in its
edition-selection model.

The formal review contract also required a direct cryptographic binding to the
reviewed design blob.

That contract defect is corrected in this PR.

The design defect requires a separate revision of the original design and its
design contract.

This review does not modify the original design.

This review does not authorize inventory-construction scope design.

## Blocking finding 1 — preserve every applicable edition role

The current design requires exactly one primary `editionSelectionRole`.

It also recognizes that one source can simultaneously be:

- the earliest verifiable edition;
- the most complete verifiable edition;
- the edition already cited by Open Instrument;
- the selected fidelity-baseline edition;
- an available alternative.

The current design postpones the machine-readable collection needed to retain
those simultaneous descriptive roles.

That permits a future source record to preserve only one role and discard the
others.

The policy is therefore lossy and cannot yet govern inventory construction.

A revised design must add a required machine-readable collection such as
`editionSelectionRoles` or `descriptiveEditionSelectionRoles`.

The revision must define these invariants:

- every applicable descriptive role is retained;
- collection values are unique;
- collection values come from the reviewed role enum;
- the primary `editionSelectionRole` remains explicit;
- the primary role is also present in the role collection;
- `FIDELITY_BASELINE_SELECTED` remains subject to all existing verification,
  access, pagination, rationale, alternative-edition, and conflict gates;
- per-work edition decisions preserve all applicable descriptive roles;
- no role may be inferred silently;
- unknown or unresolved role posture remains explicit.

The revised design and revised design contract must return to formal review
before construction-scope design may begin.

## Blocking finding 2 — bind the contract to the reviewed design blob

The initial review contract searched for the expected design SHA only in review
prose.

It did not establish that the actual `designText` loaded by the contract had the
reviewed Git blob identity.

That allowed a later modified design file to retain `Status: DESIGN_ONLY.` while
the review contract continued to pass.

The corrected contract computes the Git blob SHA-1 from the exact UTF-8 bytes of
`designText`.

It asserts equality with:

`0fbf3efa30f718f519ee6ea2ffb58d35d50c147c`

The contract therefore fails if the reviewed design content changes.

## Evidence reviewed

The completed read-only review inspected:

- required source-record field count: `37`;
- source-class count: `9`;
- source-access state count: `9`;
- edition-identity state count: `5`;
- citation-stability state count: `7`;
- edition-selection role count: `7`;
- per-work selection-decision status count: `6`;
- missing-source blocker count: `12`;
- review-requirement count: `13`;
- design-acceptance criterion count: `14`;
- explicit-prohibition count: `30`;
- merged design-contract tests: `12 passed`.

The review also proved:

- product main remained
  `8a664087086cad795486f1d86be48470b7cc9ac2`;
- DF_BRAIN remained
  `0f12c213d4446904c66e4700e03d64e1bbf65fef`;
- the design document remained blob
  `0fbf3efa30f718f519ee6ea2ffb58d35d50c147c`;
- no source record was constructed;
- no source was downloaded;
- no edition was verified.

## Accepted non-blocking safeguards

The review found the following safeguards structurally sound:

- 37 required source-record fields;
- explicit unknown values;
- primary, secondary, internal, and model-output source separation;
- fail-closed source-access states;
- machine-readable `editionIdentityStatus`;
- exact-edition verification requirements;
- per-work `selectedSourceId`;
- selection rationale and conflict traceability;
- printed-page, viewer-page, PDF-page, volume, section, and edition separation;
- copyright and quotation boundaries;
- private-path and credential prohibitions;
- 12 explicit missing-source blockers;
- blockers as valid outcomes;
- model output prohibited from upgrading blocked evidence;
- parent-milestone compatibility;
- absence of runtime or Symbolic Algorithm authorization.

These passing safeguards do not override the blocking edition-role defect.

## Acceptance matrix

The formal review records:

- source-record field completeness: PASS;
- source hierarchy separation: PASS;
- access-state fail-closed behavior: PASS;
- edition-identity binding: PASS;
- citation-stability policy: PASS;
- page and edition separation: PASS;
- copyright and source-location policy: PASS;
- blocker and provenance policy: PASS;
- per-work selected-source linkage: PASS;
- retention of all applicable edition roles: BLOCKED;
- review-contract design-blob binding: FIXED_IN_REVIEW_PR;
- overall design acceptance: BLOCKED.

## Prior PR findings

The two valid PR #1777 findings were addressed before merge:

1. machine-readable `editionIdentityStatus`;
2. machine-readable per-work edition-selection decisions.

Those corrections remain valid.

They did not solve the newly identified need to retain every simultaneously
applicable descriptive edition role.

## Inspection-script corrections

Two earlier inspection failures were verifier defects, not design defects:

1. a parser initially omitted the final period-terminated `blockers` field;
2. a prose verifier initially failed to normalize wrapped Markdown whitespace.

Those script corrections changed no product or DF_BRAIN file.

They are separate from the blocking edition-role design defect.

## Formal authorization boundary

Design acceptance is not granted.

Construction-scope design is not authorized.

Source acquisition is not authorized.

Source downloading is not authorized.

Committing copyrighted books or scans is not authorized.

Source-record construction is not authorized.

Primary-source verification is not authorized.

Edition verification is not authorized.

Final bibliography construction is not authorized.

Terminology reconstruction is not authorized.

Code F reconstruction is not authorized.

Code E reconstruction is not authorized.

Free-operator reconstruction is not authorized.

Equivocal-pair reconstruction is not authorized.

Symbolic-figure reconstruction is not authorized.

Symbolic-equation reconstruction is not authorized.

Semantic-spectrum reconstruction is not authorized.

Runtime changes are not authorized.

API changes are not authorized.

UI changes are not authorized.

Provider execution is not authorized.

Model calls are not authorized.

Zheji replay is not authorized.

Operator promotion is not authorized.

Historical-origin claims are not authorized.

Primordial-language platform claims are not authorized.

Language-superiority claims are not authorized.

Winner claims are not authorized.

Ownership claims are not authorized.

JO work is not authorized.

PO work is not authorized.

MAT work is not authorized.

## Parent milestone state

The parent Petro Zheji primary-source and Symbolic Algorithm fidelity-baseline
milestone remains:

- `MILESTONE_OPENED`;
- not complete;
- not closed.

No verified primary-source corpus exists.

No source-faithful Symbolic Algorithm reconstruction exists.

## Next required lane

`REVISE_PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_AND_EDITION_POLICY_DESIGN_V0_1`

That lane must revise the original design and its design contract.

It must add a machine-readable collection retaining every applicable
descriptive edition role.

It must define collection cardinality, uniqueness, primary-role inclusion,
unknown-state, and per-work-decision invariants.

It must return the revised design to formal review.

It must not design construction scope yet.

It must not download sources.

It must not construct source records.

It must not verify editions or passages.

It must not authorize runtime, provider, model, replay, operator, JO, PO, or MAT
work.

## Review marker

`PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_AND_EDITION_POLICY_DESIGN_REVIEW_BLOCKED`
