# Petro Zheji Primary-Source Inventory Construction-Scope Design Review v0.1

Status: REVIEWED_ACCEPTED.

Project lane: Open Instrument / ZËRO.

Parent milestone:

`PETRO_ZHEJI_PRIMARY_SOURCE_AND_SYMBOLIC_ALGORITHM_FIDELITY_BASELINE_V0_1`

Review lane ID:

`REVIEW_PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_CONSTRUCTION_SCOPE_V0_1`

Reviewed construction-scope design:

`docs/open-instrument/reports/petro-zheji-primary-source-inventory-construction-scope-design-v0.1.md`

Reviewed product main:

`951e93a57fe7c8340ff64b1b4a7fa8114d1f88b4`

Reviewed construction-scope design blob:

`a289895f47bb5002ba0861f6d53f7a672d9970c3`

Reviewed construction-scope contract blob:

`ef8b37e2158fd03634958fde0416b59e1c5356e6`

Governing accepted v0.2 design blob:

`d2f34e4affe83461dd757ab6f10805c9c05fdb01`

Governing accepted v0.2 formal-review blob:

`fce4969bce5b3ed3fdbf36ec0d67df596f0f21bc`

## Review decision

The Petro Zheji primary-source inventory construction-scope design v0.1 is
accepted.

Review result:

`PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_CONSTRUCTION_SCOPE_REVIEWED_ACCEPTED_V0_1`

No concrete safety, provenance, schema, copyright, edition-identity,
citation-integrity, or authorization blocker remains in the reviewed design.

The design satisfies all 13 construction-scope review requirements.

The design satisfies all 13 construction-scope acceptance criteria.

The reviewed design is cryptographically bound to the exact merged
construction-scope design blob.

This review does not itself acquire a source.

This review does not itself create a source record.

This review does not itself verify a source, edition, printed page, quotation,
or Petro Zheji interpretation.

This review does not authorize Symbolic Algorithm reconstruction.

## Authorization timing

The accepted review result exists on this review branch, but bounded source-work
authorization does not become effective merely because this review artifact
exists.

Authorization becomes effective only when this exact accepted review is merged
to `main`.

Before that merge:

`SOURCE_INVENTORY_CONSTRUCTION_AUTHORIZATION = NOT_GRANTED`

After this exact accepted review is merged to `main`:

`SOURCE_INVENTORY_CONSTRUCTION_AUTHORIZED_V0_1`

The next lane then becomes:

`CONSTRUCT_PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_V0_1`

No additional construction-scope design or acceptance-review iteration is
planned after a clean merge of this accepted review.

## Accepted bounded source-work authorization

Once this exact accepted review is merged to `main`, authorization is limited to
these ten source-inventory and provenance activities:

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

These activities are bounded by the accepted construction-scope design.

They do not authorize semantic reconstruction of Petro Zheji's Symbolic
Algorithm.

## Review-requirement matrix

The 13 construction-scope review requirements are:

1. direct binding to the formally accepted v0.2 design and review: PASS;
2. no competing source schema introduced: PASS;
3. accepted 38-field governing schema remains authoritative: PASS;
4. lawful acquisition and inspection boundaries explicit: PASS;
5. copyright and quotation boundaries fail-closed: PASS;
6. complete source record initialized before any lawful-access stop and
   construction sequence remains deterministic: PASS;
7. all six checkpoints explicit and fail-closed: PASS;
8. page-citation review requires exact `EXACT_EDITION_VERIFIED` identity and
   `PAGE_STABLE` citation stability: PASS;
9. secondary and internal material cannot masquerade as primary evidence: PASS;
10. blocked and unknown outcomes remain valid: PASS;
11. future authorization limited to the exact ten source-work activities: PASS;
12. Symbolic Algorithm and runtime work remain unauthorized: PASS;
13. anti-loop transition to actual source inventory is explicit: PASS.

Review requirements:

`13 / 13 PASS`

## Acceptance-criteria result

The 13 construction-scope acceptance criteria are confirmed:

1. governing v0.2 artifacts are cryptographically bound: PASS;
2. accepted 38-field schema remains unchanged: PASS;
3. no parallel state or role system supersedes v0.2 semantics: PASS;
4. lawful source access remains distinguishable from unknown or blocked access:
   PASS;
5. complete copyrighted works are never required in the repository: PASS;
6. source records are initialized before lawful-access failure and remain
   fail-closed rather than inferred-complete: PASS;
7. edition identity precedes exact edition claims: PASS;
8. stable page claims require exact `EXACT_EDITION_VERIFIED` identity and
   `PAGE_STABLE` citation stability: PASS;
9. content location remains separate from semantic interpretation: PASS;
10. all source candidates for one work remain auditable: PASS;
11. the six checkpoints prevent silent promotion: PASS;
12. construction remains impossible until this accepted review is merged:
    PASS;
13. successful acceptance transitions directly into real source-inventory work:
    PASS.

Acceptance criteria:

`13 / 13 PASS`

Overall construction-scope result:

`ACCEPTED`

## P1 hardening reviewed

The final construction-scope design includes both substantive P1 corrections
found during PR #1781.

### Access-blocked candidate preservation

Result: PASS.

Source-record initialization occurs before lawful-access assessment.

Every candidate therefore receives the complete accepted 38-field record before
an access failure can stop work.

The initialized record preserves:

- `sourceLocationClass`;
- `sourceAccessStatus`;
- applicable `blockers`.

An access-blocked source remains auditable rather than disappearing.

### Exact edition and stable page requirement

Result: PASS.

Page-citation review requires:

- `editionIdentityStatus = EXACT_EDITION_VERIFIED`;
- `citationStability = PAGE_STABLE`.

The following cannot satisfy page-citation review:

- `EDITION_FAMILY_VERIFIED`;
- `TITLE_ONLY`;
- `CONFLICTING_METADATA`;
- `UNKNOWN`.

Page-citation claims therefore cannot outrun exact-edition and stable-pagination
proof.

## Six fail-closed checkpoints reviewed

The accepted process preserves exactly:

1. `DISCOVERY_AND_ATTRIBUTION_CHECKPOINT`;
2. `LAWFUL_ACCESS_CHECKPOINT`;
3. `EDITION_IDENTITY_CHECKPOINT`;
4. `PAGINATION_AND_CONTENT_LOCATION_CHECKPOINT`;
5. `PAGE_CITATION_CHECKPOINT`;
6. `INVENTORY_ACCEPTANCE_CHECKPOINT`.

Failure at a checkpoint prevents silent promotion.

A blocker remains an acceptable outcome.

Model inference cannot override a failed checkpoint.

## Nine-step workflow reviewed

The accepted workflow remains:

1. discovery;
2. source-record initialization;
3. lawful-access assessment;
4. bibliographic and edition identity;
5. pagination assessment;
6. content location;
7. page-citation review;
8. edition-selection decision;
9. inventory review.

Content location does not prove semantic interpretation.

Inventory acceptance does not prove algorithmic truth.

## Copyright and lawful-access boundary

Only lawful access paths may be used.

The repository does not require complete copyrighted books or scans.

The repository may retain bounded bibliographic, edition, location, quotation,
translation, hash, provenance, and blocker evidence as defined by the reviewed
construction-scope design.

Credentials, private filesystem paths, private cloud URLs, unauthorized mirrors,
complete copyrighted works, and excessive quotation remain outside the allowed
repository evidence boundary.

Copyright uncertainty remains a valid blocker.

## What remains unauthorized after this review is merged

Even after bounded source-inventory construction authorization becomes
effective, the following remain unauthorized:

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

Source-inventory authorization is not Symbolic Algorithm authorization.

## Scientific claim boundary

A discovered source is not automatically a verified Petro Zheji primary source.

An accessible source is not automatically an exact verified edition.

An exact edition is not automatically page stable.

A located passage is not automatically a correct semantic interpretation.

A page-cited passage is not automatically proof of the complete Symbolic
Algorithm.

A reviewed inventory record establishes bounded source provenance and citation
readiness only.

## Anti-loop decision

The construction-scope design expressly requires transition into actual source
inventory after clean formal acceptance.

This review finds no concrete blocker requiring another construction-scope
design revision.

Therefore no additional abstract construction-scope design iteration is
authorized or required by this review.

Once this accepted review is merged, proceed directly to:

`CONSTRUCT_PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_V0_1`

The first actual construction work must remain inside the ten authorized
source-inventory activities and the six fail-closed checkpoints.

## Parent milestone state

The parent milestone remains open.

It is not complete.

It is not closed.

No verified page-cited Petro Zheji primary-source corpus exists yet.

No complete source-faithful reconstruction of Petro Zheji's Symbolic Algorithm
exists yet.

## Review marker

`PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_CONSTRUCTION_SCOPE_REVIEWED_ACCEPTED_V0_1`
