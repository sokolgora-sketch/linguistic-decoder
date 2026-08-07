# Petro Zheji Primary-Source Inventory and Edition-Policy Design Review v0.2

Status: REVIEWED_ACCEPTED.

Project lane: Open Instrument / ZËRO.

Parent milestone:

`PETRO_ZHEJI_PRIMARY_SOURCE_AND_SYMBOLIC_ALGORITHM_FIDELITY_BASELINE_V0_1`

Review lane ID:

`REVIEW_REVISED_PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_AND_EDITION_POLICY_DESIGN_V0_2`

Reviewed design:

`docs/open-instrument/reports/petro-zheji-primary-source-inventory-and-edition-policy-design-v0.2.md`

Reviewed product main:

`205d44481f88d62454f4379c209b10e44ae5223f`

Reviewed design blob:

`d2f34e4affe83461dd757ab6f10805c9c05fdb01`

Historical v0.1 design blob:

`0fbf3efa30f718f519ee6ea2ffb58d35d50c147c`

Historical blocked v0.1 review blob:

`7dc940fe681577c810cb8085eb9ce7edbefa8a57`

## Review decision

The Petro Zheji primary-source inventory and edition-policy design v0.2 is
accepted as the governing design for the next bounded construction-scope lane.

Review result:

`PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_AND_EDITION_POLICY_DESIGN_REVIEWED_ACCEPTED_V0_2`

The two blockers recorded by the v0.1 formal review are closed.

The v0.2 design preserves every applicable descriptive edition-selection role
through a required machine-readable `editionSelectionRoles` collection while
retaining one explicit primary operational posture.

The formal review is cryptographically bound to the exact reviewed v0.2 design
blob.

This review does not itself construct the source inventory.

This review does not acquire or download a Petro Zheji work.

This review does not verify a primary source, edition, page, quotation, or
passage.

This review does not authorize Symbolic Algorithm implementation.

## Blocking finding 1 closure — complete edition-role retention

Result: CLOSED.

The v0.1 review found that a single-role model could discard simultaneously
applicable descriptive edition roles.

The v0.2 design closes that defect by requiring:

- one explicit primary `editionSelectionRole`;
- one required non-empty `editionSelectionRoles` collection;
- complete retention of every applicable descriptive role;
- enum-valid and unique collection values;
- exact primary-role inclusion;
- explicit unresolved primary `UNDECIDED`;
- retention of applicable descriptive roles alongside unresolved `UNDECIDED`;
- mutual exclusions for selected, rejected, and alternative operational states;
- complete per-candidate `candidateSourceRoleAssignments`;
- exact source-record / assignment role agreement.

The unresolved operational posture is therefore no longer forced to masquerade
as a descriptive role.

## Blocking finding 2 closure — exact reviewed-design blob binding

Result: CLOSED.

This review contract computes the Git blob SHA-1 from the exact UTF-8 bytes of
the merged v0.2 design.

The required value is:

`d2f34e4affe83461dd757ab6f10805c9c05fdb01`

The review fails if the reviewed design bytes change.

The immutable v0.1 design and blocked v0.1 review remain separately bound and
historical.

## Structural evidence reviewed

The accepted v0.2 design contains:

- required source-record fields: `38`;
- source classes: `9`;
- source-access states: `9`;
- edition-identity states: `5`;
- citation-stability states: `7`;
- edition-selection roles: `7`;
- per-work selection-decision statuses: `6`;
- missing-source blockers: `12`;
- revised review requirements: `18`;
- revised design-acceptance criteria: `20`;
- explicit prohibitions: `30`;
- merged v0.2 design-contract tests: `18`.

Additional machine-readable safeguards reviewed:

- globally unique inventory `sourceId`;
- unique `candidateSourceIds`;
- exhaustive candidate coverage for every decision `workId`;
- one role assignment for every candidate source;
- candidate-to-work binding;
- proposal pointer binding;
- reviewed-selection pointer binding;
- selected-versus-rejected exclusion;
- selected-versus-alternative exclusion;
- proposed-versus-rejected exclusion;
- exact unresolved `UNDECIDED` semantics;
- exact four-role descriptive coexistence list.

## Review-requirement matrix

The 18 formal review requirements are recorded as:

- field completeness: PASS;
- state exclusivity: PASS;
- edition-selection safety: PASS;
- required `editionIdentityStatus` coverage: PASS;
- complete `editionSelectionRoles` coverage: PASS;
- primary-role inclusion and uniqueness: PASS;
- `UNDECIDED` operational exclusivity with descriptive-role retention: PASS;
- required per-work edition-selection decision coverage: PASS;
- complete `candidateSourceRoleAssignments` coverage: PASS;
- one assignment for every candidate source: PASS;
- selected-edition rationale and citation traceability: PASS;
- printed-page versus digital-page separation: PASS;
- copyright and quotation limits: PASS;
- missing-source fail-closed behavior: PASS;
- primary versus secondary source separation: PASS;
- internal material and replay separation: PASS;
- compatibility with the parent milestone: PASS;
- absence of implementation authorization: PASS.

Review requirements:

`18 / 18 PASS`

## Design-acceptance result

The formal review confirms all 20 design-acceptance criteria.

Design acceptance:

`20 / 20 PASS`

Overall design result:

`ACCEPTED`

This acceptance applies to the source-inventory schema and edition-selection
policy only.

It is not evidence that any Petro Zheji source has been located, acquired,
verified, page-cited, or reconstructed.

## Prior PR #1779 hardening

The accepted design includes the corrections produced by the 15 review findings
closed during PR #1779:

1. complete exact 38-field schema;
2. exact seven-value edition-selection role enum;
3. selected-versus-rejected exclusion;
4. rejected status as primary operational posture;
5. candidate-to-decision `workId` binding;
6. proposal-to-candidate pointer binding;
7. selected-versus-available-alternative exclusion;
8. proposed-versus-rejected exclusion;
9. exhaustive candidate-source coverage;
10. exact six-value decision-status enum;
11. candidate-source ID uniqueness;
12. global inventory source-ID uniqueness;
13. complete exact 30-item authorization prohibition list;
14. unresolved primary `UNDECIDED` with descriptive-role retention;
15. exact scoped four-role `UNDECIDED` coexistence-list enforcement.

The final PR #1779 source received a clean Codex `+1` with zero unresolved
review threads before squash merge.

## Historical boundary

The v0.1 design remains a blocked historical artifact.

The v0.1 review remains:

`PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_AND_EDITION_POLICY_DESIGN_REVIEW_BLOCKED`

This v0.2 acceptance does not retroactively modify or accept v0.1.

The historical blocked review remains useful evidence of why v0.2 was required.

## Formal authorization boundary

Design acceptance is granted for v0.2.

The next bounded construction-scope design lane is authorized.

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

The parent milestone remains open.

It is not complete.

It is not closed.

No verified page-cited Petro Zheji primary-source corpus exists yet.

No source-faithful complete Symbolic Algorithm reconstruction exists yet.

## Next authorized lane

`DESIGN_PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_CONSTRUCTION_SCOPE_V0_1`

This is a bounded construction-scope lane.

It must translate the accepted v0.2 schema into the concrete procedure required
to begin real source inventory work.

It must not reopen the edition-selection design absent a concrete blocking
defect.

It must define the lawful acquisition and inspection boundary, source-record
creation sequence, review checkpoints, and exact authorization gate required
before source construction begins.

It must not itself download or commit source books.

It must not itself construct source records.

It must not authorize runtime or Symbolic Algorithm implementation.

After that bounded construction-scope gate, the program should move into actual
primary-source inventory and page-cited Petro Zheji fidelity work rather than
continuing an indefinite documentation-only loop.

## Review marker

`PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_AND_EDITION_POLICY_DESIGN_REVIEWED_ACCEPTED_V0_2`
