import fs from "node:fs";
import path from "node:path";

const DOCUMENT_PATH = path.join(
  process.cwd(),
  "docs/open-instrument/reports/petro-zheji-primary-source-inventory-and-edition-policy-design-v0.2.md",
);

const documentText = fs.readFileSync(
  DOCUMENT_PATH,
  "utf8",
);

const normalizedDocumentText = documentText.replace(
  /\s+/g,
  " ",
);

function getSection(
  startHeading: string,
  endHeading: string,
): string {
  const start = documentText.indexOf(
    startHeading,
  );

  const end = documentText.indexOf(
    endHeading,
  );

  if (
    start < 0
    || end < 0
    || end <= start
  ) {
    throw new Error(
      `Unable to resolve section: ${startHeading}`,
    );
  }

  return documentText.slice(
    start,
    end,
  );
}

describe(
  "Petro Zheji primary-source inventory and edition-policy design v0.2",
  () => {
    it("records the exact revision lane and pending-review posture", () => {
      for (const requiredText of [
        "Status: DESIGN_REVISED_PENDING_REVIEW.",
        "REVISE_PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_AND_EDITION_POLICY_DESIGN_V0_1",
        "PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_AND_EDITION_POLICY_DESIGN_REVISED_V0_2",
        "168ceccb32f572aa9820e5d435e48de6ec60e476",
      ]) {
        expect(documentText).toContain(
          requiredText,
        );
      }

      expect(documentText).not.toContain(
        "Status: REVIEWED_ACCEPTED.",
      );

      expect(documentText).not.toContain(
        "MILESTONE_CLOSED",
      );
    });

    it("preserves immutable v0.1 review provenance", () => {
      for (const requiredText of [
        "0fbf3efa30f718f519ee6ea2ffb58d35d50c147c",
        "The v0.1 design and its blocked formal review remain historical records.",
        "This v0.2 artifact does not rewrite, erase, or retroactively accept the v0.1 design.",
        "This v0.2 design remains unaccepted until a new formal review is completed.",
      ]) {
        expect(
          requiredText.includes(
            "does not rewrite",
          )
            ? normalizedDocumentText
            : documentText,
        ).toContain(
          requiredText,
        );
      }
    });

    it("requires the exact 38-field source-record schema", () => {
      const section = getSection(
        "## Required inventory fields",
        "## Source-access states",
      );

      const fields = Array.from(
        section.matchAll(
          /^- `([^`]+)`[.;]$/gm,
        ),
        (match) => match[1],
      );

      expect(fields).toEqual([
        "sourceId",
        "workId",
        "canonicalTitle",
        "originalLanguageTitle",
        "author",
        "workType",
        "sourceClass",
        "publisher",
        "publicationYear",
        "editionStatement",
        "editionNumber",
        "editionIdentityStatus",
        "volume",
        "isbnOrCatalogueId",
        "totalPages",
        "printedPageSystem",
        "digitalPageSystem",
        "language",
        "physicalCopyStatus",
        "scanStatus",
        "sourceAccessStatus",
        "sourceAccessOwner",
        "sourceLocationClass",
        "provenanceNotes",
        "citationStability",
        "quotationAvailability",
        "legalUseNotes",
        "knownEditionDifferences",
        "editionSelectionRole",
        "editionSelectionRoles",
        "editionSelectionReason",
        "existingOpenInstrumentCitationRefs",
        "unresolvedEditionConflicts",
        "contentRelevance",
        "verificationStatus",
        "reviewer",
        "reviewedAt",
        "blockers",
      ]);

      expect(
        new Set(fields).size,
      ).toBe(
        38,
      );
    });

    it("retains the exact seven-role enum while requiring a complete plural collection", () => {
      const section = getSection(
        "## Edition-selection role states",
        "## Per-work edition-selection decision",
      );

      const allowedValuesMarker =
        "Allowed values for both fields are:\n\n";

      const allowedValuesStart = section.indexOf(
        allowedValuesMarker,
      );

      expect(
        allowedValuesStart,
      ).toBeGreaterThanOrEqual(
        0,
      );

      const allowedValuesEnd = section.indexOf(
        "\n\nThe primary `editionSelectionRole`",
        allowedValuesStart
          + allowedValuesMarker.length,
      );

      expect(
        allowedValuesEnd,
      ).toBeGreaterThan(
        allowedValuesStart,
      );

      const allowedValueLines = section
        .slice(
          allowedValuesStart
            + allowedValuesMarker.length,
          allowedValuesEnd,
        )
        .trim()
        .split(
          "\n",
        );

      expect(allowedValueLines).toEqual([
        "- `FIDELITY_BASELINE_SELECTED`;",
        "- `EARLIEST_VERIFIABLE`;",
        "- `MOST_COMPLETE_VERIFIABLE`;",
        "- `EXISTING_OPEN_INSTRUMENT_CITED`;",
        "- `AVAILABLE_ALTERNATIVE`;",
        "- `REJECTED_FOR_BASELINE`;",
        "- `UNDECIDED`.",
      ]);

      const roles = allowedValueLines.map(
        (line) => {
          const match = line.match(
            /^- `([A-Z][A-Z0-9_]+)`[.;]$/,
          );

          expect(
            match,
          ).not.toBeNull();

          return match?.[1]
            ?? "";
        },
      );

      expect(roles).toEqual([
        "FIDELITY_BASELINE_SELECTED",
        "EARLIEST_VERIFIABLE",
        "MOST_COMPLETE_VERIFIABLE",
        "EXISTING_OPEN_INSTRUMENT_CITED",
        "AVAILABLE_ALTERNATIVE",
        "REJECTED_FOR_BASELINE",
        "UNDECIDED",
      ]);

      const normalizedSection = section.replace(
        /\s+/g,
        " ",
      );

      for (const requiredText of [
        "exactly one primary `editionSelectionRole`",
        "one required non-empty `editionSelectionRoles` collection",
        "every value belongs to the reviewed edition-selection role enum",
        "every value is unique",
        "the primary `editionSelectionRole` appears in the collection exactly once",
        "every applicable descriptive role is retained",
        "no role is silently inferred",
        "an unresolved operational posture remains primary `UNDECIDED` even when descriptive roles are retained",
        "`FIDELITY_BASELINE_SELECTED` and `REJECTED_FOR_BASELINE` never coexist",
        "`FIDELITY_BASELINE_SELECTED` and `AVAILABLE_ALTERNATIVE` never coexist",
      ]) {
        expect(
          normalizedSection,
        ).toContain(
          requiredText,
        );
      }
    });

    it("preserves unresolved operational posture alongside descriptive roles", () => {
      const rawSection = getSection(
        "## Edition-selection role states",
        "## Per-work edition-selection decision",
      );

      const normalizedSection = rawSection.replace(
        /\s+/g,
        " ",
      );

      for (const requiredText of [
        "`UNDECIDED` is operationally exclusive, not descriptively exclusive.",
        "When a source's baseline-selection posture is unresolved, the primary `editionSelectionRole` must be `UNDECIDED`.",
        "In that unresolved posture, `editionSelectionRoles` must contain `UNDECIDED` exactly once and must also retain every applicable descriptive role.",
        "`UNDECIDED` may coexist with these descriptive roles:",
        "the collection must be exactly: `[UNDECIDED]`",
        "`UNDECIDED` must not coexist with `FIDELITY_BASELINE_SELECTED` or `REJECTED_FOR_BASELINE`.",
        "When the primary `editionSelectionRole` is `FIDELITY_BASELINE_SELECTED` or `REJECTED_FOR_BASELINE`, `UNDECIDED` must be absent.",
        "No descriptive role may be promoted to the primary `editionSelectionRole` merely because that descriptive role is known while the baseline-selection posture remains unresolved.",
      ]) {
        expect(
          normalizedSection,
        ).toContain(
          requiredText,
        );
      }

      const coexistenceMarker =
        "`UNDECIDED` may coexist with these descriptive roles:";

      const coexistenceEndMarker =
        "When no descriptive role has been established";

      const coexistenceStart = rawSection.indexOf(
        coexistenceMarker,
      );

      expect(
        coexistenceStart,
      ).toBeGreaterThanOrEqual(
        0,
      );

      const coexistenceTail = rawSection.slice(
        coexistenceStart + coexistenceMarker.length,
      );

      const coexistenceEnd = coexistenceTail.indexOf(
        coexistenceEndMarker,
      );

      expect(
        coexistenceEnd,
      ).toBeGreaterThanOrEqual(
        0,
      );

      const coexistenceRoleLines = coexistenceTail
        .slice(
          0,
          coexistenceEnd,
        )
        .split(
          "\n",
        )
        .map(
          (line) => line.trim(),
        )
        .filter(
          (line) => line.startsWith(
            "- `",
          ),
        );

      expect(
        coexistenceRoleLines,
      ).toEqual([
        "- `EARLIEST_VERIFIABLE`;",
        "- `MOST_COMPLETE_VERIFIABLE`;",
        "- `EXISTING_OPEN_INSTRUMENT_CITED`;",
        "- `AVAILABLE_ALTERNATIVE`.",
      ]);
    });

    it("makes fidelity selection and rejection mutually exclusive", () => {
      const roleSection = getSection(
        "## Edition-selection role states",
        "## Per-work edition-selection decision",
      ).replace(
        /\s+/g,
        " ",
      );

      for (const requiredText of [
        "`FIDELITY_BASELINE_SELECTED` and `REJECTED_FOR_BASELINE` are mutually exclusive.",
        "The `editionSelectionRoles` collection must not contain both values.",
        "When the primary `editionSelectionRole` is `FIDELITY_BASELINE_SELECTED`, `REJECTED_FOR_BASELINE` must be absent.",
        "When the primary `editionSelectionRole` is `REJECTED_FOR_BASELINE`, `FIDELITY_BASELINE_SELECTED` must be absent.",
        "When `editionSelectionRoles` contains `REJECTED_FOR_BASELINE`, the primary `editionSelectionRole` must also be `REJECTED_FOR_BASELINE`.",
        "`FIDELITY_BASELINE_SELECTED` and `AVAILABLE_ALTERNATIVE` are mutually exclusive.",
        "The `editionSelectionRoles` collection must not contain both `FIDELITY_BASELINE_SELECTED` and `AVAILABLE_ALTERNATIVE`.",
        "When the primary `editionSelectionRole` is `FIDELITY_BASELINE_SELECTED`, `AVAILABLE_ALTERNATIVE` must be absent.",
        "When the primary `editionSelectionRole` is `AVAILABLE_ALTERNATIVE`, `FIDELITY_BASELINE_SELECTED` must be absent.",
      ]) {
        expect(
          roleSection,
        ).toContain(
          requiredText,
        );
      }

      const decisionSection = getSection(
        "## Per-work edition-selection decision",
        "## First-title targets",
      ).replace(
        /\s+/g,
        " ",
      );

      for (const requiredText of [
        "`FIDELITY_BASELINE_SELECTED` and `REJECTED_FOR_BASELINE` never coexist in one assignment",
        "`FIDELITY_BASELINE_SELECTED` and `AVAILABLE_ALTERNATIVE` never coexist in one assignment",
        "when an assignment's `editionSelectionRoles` contains `REJECTED_FOR_BASELINE`, its primary `editionSelectionRole` must also be `REJECTED_FOR_BASELINE`",
        "that source's assignment must not contain `REJECTED_FOR_BASELINE`",
        "that source's assignment must not contain `AVAILABLE_ALTERNATIVE`",
      ]) {
        expect(
          decisionSection,
        ).toContain(
          requiredText,
        );
      }
    });

    it("preserves all fidelity-baseline verification gates", () => {
      const section = getSection(
        "## Edition-selection role states",
        "## Per-work edition-selection decision",
      );

      for (const requiredText of [
        "`editionIdentityStatus` is `EXACT_EDITION_VERIFIED`",
        "the selected source is lawfully accessible",
        "pagination is sufficiently stable",
        "the selection rationale is recorded",
        "known alternatives and edition differences are recorded",
        "the per-work decision status is `BASELINE_EDITION_REVIEWED`",
        "the per-work `selectedSourceId` refers to this source",
      ]) {
        expect(section).toContain(
          requiredText,
        );
      }
    });

    it("requires complete candidate-source role assignments", () => {
      const section = getSection(
        "## Per-work edition-selection decision",
        "## First-title targets",
      );

      for (const requiredText of [
        "`candidateSourceRoleAssignments`",
        "`sourceId`",
        "`editionSelectionRole`",
        "`editionSelectionRoles`",
        "every inventory source record has a globally unique `sourceId`; no two inventory source records may share the same `sourceId`",
        "`candidateSourceIds` contains unique source IDs and no source ID may appear more than once",
        "`candidateSourceIds` contains every inventory source record whose `workId` equals the decision record's `workId`",
        "no inventory source record for that `workId` may be omitted from `candidateSourceIds`",
        "sources are not removed from the candidate set merely because they are blocked, rejected, incomplete, or non-selected",
        "every `candidateSourceId` appears in exactly one role assignment",
        "every role assignment refers to a source in `candidateSourceIds`",
        "every `candidateSourceId` resolves to a source record whose `workId` equals the decision record's `workId`",
        "the assignment's primary `editionSelectionRole` matches the source record",
        "the assignment's `editionSelectionRoles` collection matches the source record",
        "every applicable descriptive role remains preserved",
        "no assignment role is silently inferred",
        "unknown or unresolved assignments use primary `UNDECIDED` explicitly",
        "unresolved assignments retain `UNDECIDED` exactly once alongside every applicable descriptive role",
        "assignment `UNDECIDED` must not coexist with `FIDELITY_BASELINE_SELECTED` or `REJECTED_FOR_BASELINE`",
        "no descriptive assignment role may be promoted to primary while its baseline-selection posture remains unresolved",
      ]) {
        expect(
          section.replace(
            /\s+/g,
            " ",
          ),
        ).toContain(
          requiredText,
        );
      }
    });

    it("requires inventory source IDs to be globally unique", () => {
      const section = getSection(
        "## Per-work edition-selection decision",
        "## First-title targets",
      ).replace(
        /\s+/g,
        " ",
      );

      expect(
        section,
      ).toContain(
        "every inventory source record has a globally unique `sourceId`; no two inventory source records may share the same `sourceId`",
      );
    });

    it("requires candidate source IDs to be unique", () => {
      const section = getSection(
        "## Per-work edition-selection decision",
        "## First-title targets",
      ).replace(
        /\s+/g,
        " ",
      );

      expect(
        section,
      ).toContain(
        "`candidateSourceIds` contains unique source IDs and no source ID may appear more than once",
      );
    });

    it("locks the exact six-value decision-status enum", () => {
      const section = getSection(
        "## Per-work edition-selection decision",
        "## First-title targets",
      );

      const allowedValuesMarker =
        "Allowed `selectionDecisionStatus` values are:";

      const allowedValuesEndMarker =
        "`selectedSourceId` must remain null when the status is:";

      const allowedValuesStart = section.indexOf(
        allowedValuesMarker,
      );

      const allowedValuesEnd = section.indexOf(
        allowedValuesEndMarker,
      );

      expect(
        allowedValuesStart,
      ).toBeGreaterThanOrEqual(
        0,
      );

      expect(
        allowedValuesEnd,
      ).toBeGreaterThan(
        allowedValuesStart,
      );

      const allowedValueLines = section
        .slice(
          allowedValuesStart
            + allowedValuesMarker.length,
          allowedValuesEnd,
        )
        .trim()
        .split(
          "\n",
        );

      expect(
        allowedValueLines,
      ).toEqual([
        "- `UNREVIEWED`;",
        "- `NO_ELIGIBLE_EDITION`;",
        "- `DECISION_BLOCKED`;",
        "- `BASELINE_EDITION_PROPOSED`;",
        "- `BASELINE_EDITION_REVIEWED`;",
        "- `REJECTED`.",
      ]);

      const statuses = allowedValueLines.map(
        (line) => {
          const match = line.match(
            /^- `([A-Z][A-Z0-9_]+)`[.;]$/,
          );

          expect(
            match,
          ).not.toBeNull();

          return match?.[1]
            ?? "";
        },
      );

      expect(
        statuses,
      ).toEqual([
        "UNREVIEWED",
        "NO_ELIGIBLE_EDITION",
        "DECISION_BLOCKED",
        "BASELINE_EDITION_PROPOSED",
        "BASELINE_EDITION_REVIEWED",
        "REJECTED",
      ]);
    });

    it("binds a proposed baseline edition to exactly one candidate source", () => {
      const section = getSection(
        "## Per-work edition-selection decision",
        "## First-title targets",
      ).replace(
        /\s+/g,
        " ",
      );

      for (const requiredText of [
        "When the status is `BASELINE_EDITION_PROPOSED`",
        "`selectedSourceId` must identify exactly one source in `candidateSourceIds`",
        "that candidate source must satisfy the decision record's `workId` binding",
        "that candidate source's assignment must not contain `REJECTED_FOR_BASELINE`",
        "the proposal pointer does not by itself grant `FIDELITY_BASELINE_SELECTED`",
      ]) {
        expect(section).toContain(
          requiredText,
        );
      }
    });

    it("locks fidelity selection to exactly one reviewed selected source", () => {
      const section = getSection(
        "## Per-work edition-selection decision",
        "## First-title targets",
      ).replace(
        /\s+/g,
        " ",
      );

      for (const requiredText of [
        "When the status is `BASELINE_EDITION_REVIEWED`",
        "`selectedSourceId` must identify one candidate source",
        "that source's assignment must contain `FIDELITY_BASELINE_SELECTED`",
        "that source's assignment must not contain `REJECTED_FOR_BASELINE`",
        "that source's assignment must not contain `AVAILABLE_ALTERNATIVE`",
        "that source's primary role must be `FIDELITY_BASELINE_SELECTED`",
        "no other candidate assignment may contain `FIDELITY_BASELINE_SELECTED`",
      ]) {
        expect(section).toContain(
          requiredText,
        );
      }
    });

    it("preserves source, page, copyright, blocker, and provenance safeguards", () => {
      for (const requiredText of [
        "PETRO_ZHEJI_PRIMARY_PUBLISHED_WORK",
        "MODEL_OR_REPLAY_OUTPUT",
        "VERIFIED_ACCESSIBLE",
        "EXACT_EDITION_VERIFIED",
        "PAGE_STABLE",
        "The printed page must not be replaced by the PDF viewer index.",
        "Page numbers from different editions must not be merged.",
        "complete copyrighted books",
        "large unauthorized scans",
        "Private filesystem paths must not be committed.",
        "A blocked source must not be upgraded by model inference.",
      ]) {
        expect(documentText).toContain(
          requiredText,
        );
      }
    });

    it("defines 18 revised-review requirements", () => {
      const section = getSection(
        "## Review requirements",
        "## Design acceptance criteria",
      );

      const requirements = section.match(
        /^- /gm,
      ) ?? [];

      expect(requirements).toHaveLength(
        18,
      );

      for (const requiredText of [
        "complete `editionSelectionRoles` coverage",
        "primary-role inclusion and uniqueness",
        "`UNDECIDED` operational exclusivity with descriptive-role retention",
        "complete `candidateSourceRoleAssignments` coverage",
        "one assignment for every candidate source",
        "absence of implementation authorization",
      ]) {
        expect(section).toContain(
          requiredText,
        );
      }
    });

    it("defines 20 revised acceptance criteria", () => {
      const section = getSection(
        "## Design acceptance criteria",
        "## Explicitly not authorized",
      );

      const criteria = section.match(
        /^- /gm,
      ) ?? [];

      expect(criteria).toHaveLength(
        20,
      );

      const normalizedSection = section.replace(
        /\s+/g,
        " ",
      );

      for (const requiredText of [
        "every source record retains all applicable edition roles",
        "every primary `editionSelectionRole` is present in the role collection",
        "role collections are non-empty, unique, enum-valid, and explicit",
        "unresolved sources keep primary `UNDECIDED` while retaining every applicable descriptive role",
        "every candidate source has exactly one machine-readable role assignment",
        "per-work role assignments preserve all source-record roles",
      ]) {
        expect(normalizedSection).toContain(
          requiredText,
        );
      }
    });

    it("locks the exact 30-item explicit authorization prohibition list", () => {
      const section = getSection(
        "## Explicitly not authorized",
        "## Revision provenance and historical boundary",
      );

      const listMarker =
        "This design does not authorize:";

      const listStart = section.indexOf(
        listMarker,
      );

      expect(
        listStart,
      ).toBeGreaterThanOrEqual(
        0,
      );

      const prohibitionLines = section
        .slice(
          listStart + listMarker.length,
        )
        .trim()
        .split(
          "\n",
        )
        .filter(
          (line) => line.startsWith(
            "- ",
          ),
        );

      expect(
        prohibitionLines,
      ).toEqual([
        "- source acquisition;",
        "- source downloading;",
        "- committing copyrighted books;",
        "- committing book scans;",
        "- primary-source verification;",
        "- final bibliography construction;",
        "- source-record implementation;",
        "- terminology reconstruction;",
        "- Code F reconstruction;",
        "- Code E reconstruction;",
        "- free-operator reconstruction;",
        "- equivocal-pair reconstruction;",
        "- symbolic-figure reconstruction;",
        "- symbolic-equation reconstruction;",
        "- semantic-spectrum reconstruction;",
        "- runtime changes;",
        "- API changes;",
        "- UI changes;",
        "- provider execution;",
        "- model calls;",
        "- Zheji replay;",
        "- operator promotion;",
        "- historical-origin claims;",
        "- primordial-language platform claims;",
        "- language-superiority claims;",
        "- winner claims;",
        "- ownership claims;",
        "- JO work;",
        "- PO work;",
        "- MAT work.",
      ]);

      for (const requiredText of [
        "Runtime implementation: not authorized.",
        "Source download: not authorized.",
        "Copyrighted book commit: not authorized.",
        "Provider or model execution: not authorized.",
        "Zheji replay: not authorized.",
        "Operator promotion: not authorized.",
        "JO, PO, and MAT: not authorized.",
      ]) {
        expect(section).toContain(
          requiredText,
        );
      }
    });

    it("selects revised-design review as the only next lane", () => {
      expect(documentText).toContain(
        "`REVIEW_REVISED_PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_AND_EDITION_POLICY_DESIGN_V0_2`",
      );

      expect(documentText).toContain(
        "The next lane must review this v0.2 design only.",
      );

      expect(documentText).toContain(
        "It must not construct source records.",
      );

      expect(documentText).toContain(
        "It must not design the construction scope.",
      );
    });
  },
);
