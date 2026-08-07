import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TEST_DIRECTORY = path.dirname(
  fileURLToPath(import.meta.url),
);

const REPOSITORY_ROOT = path.resolve(
  TEST_DIRECTORY,
  "..",
);

const INVENTORY_PATH = path.join(
  REPOSITORY_ROOT,
  "docs/open-instrument/evidence/petro-zheji-primary-source-inventory-v0.1.json",
);

const POLICY_PATH = path.join(
  REPOSITORY_ROOT,
  "docs/open-instrument/reports/petro-zheji-primary-source-inventory-and-edition-policy-design-v0.2.md",
);

const inventory = JSON.parse(
  fs.readFileSync(
    INVENTORY_PATH,
    "utf8",
  ),
);

const policyText = fs.readFileSync(
  POLICY_PATH,
  "utf8",
);

const expectedFields = [
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
];

const expectedDecisionFields = [
  "workId",
  "candidateSourceIds",
  "candidateSourceRoleAssignments",
  "selectedSourceId",
  "selectionDecisionStatus",
  "selectionReason",
  "existingOpenInstrumentCitationRefs",
  "knownEditionDifferences",
  "unresolvedEditionConflicts",
  "reviewer",
  "reviewedAt",
  "blockers",
];

const expectedAssignmentFields = [
  "sourceId",
  "editionSelectionRole",
  "editionSelectionRoles",
];

const sourceClasses = new Set([
  "PETRO_ZHEJI_PRIMARY_PUBLISHED_WORK",
  "PETRO_ZHEJI_PRIMARY_ARTICLE_OR_MANUSCRIPT",
  "PETRO_ZHEJI_PRIMARY_INTERVIEW",
  "EDITION_OR_LIBRARY_METADATA",
  "SCHOLARLY_SECONDARY_ANALYSIS",
  "GENERAL_SECONDARY_COMMENTARY",
  "OPEN_INSTRUMENT_INTERNAL_MATERIAL",
  "MODEL_OR_REPLAY_OUTPUT",
  "UNKNOWN",
]);

const accessStates = new Set([
  "VERIFIED_ACCESSIBLE",
  "ACCESSIBLE_UNVERIFIED_EDITION",
  "METADATA_ONLY",
  "PARTIAL_PREVIEW_ONLY",
  "PHYSICAL_COPY_REQUIRED",
  "SCAN_REQUIRED",
  "LEGAL_ACCESS_UNRESOLVED",
  "UNAVAILABLE",
  "UNKNOWN",
]);

const editionStates = new Set([
  "EXACT_EDITION_VERIFIED",
  "EDITION_FAMILY_VERIFIED",
  "TITLE_ONLY",
  "CONFLICTING_METADATA",
  "UNKNOWN",
]);

const citationStates = new Set([
  "PAGE_STABLE",
  "DIGITAL_LOCATION_ONLY",
  "SECTION_ONLY",
  "QUOTED_WITHOUT_STABLE_PAGE",
  "SECONDARY_CITATION_ONLY",
  "UNLOCATED",
  "UNKNOWN",
]);

const selectionRoles = new Set([
  "FIDELITY_BASELINE_SELECTED",
  "EARLIEST_VERIFIABLE",
  "MOST_COMPLETE_VERIFIABLE",
  "EXISTING_OPEN_INSTRUMENT_CITED",
  "AVAILABLE_ALTERNATIVE",
  "REJECTED_FOR_BASELINE",
  "UNDECIDED",
]);

const verificationStates = new Set([
  "UNREVIEWED",
  "METADATA_REVIEWED",
  "EDITION_IDENTITY_REVIEWED",
  "CONTENT_LOCATED",
  "PAGE_CITATION_REVIEWED",
  "BLOCKED",
  "REJECTED",
]);

const blockerStates = new Set([
  "PRIMARY_TEXT_NOT_AVAILABLE",
  "EXACT_EDITION_NOT_VERIFIED",
  "PAGINATION_NOT_VERIFIED",
  "CONFLICTING_PUBLICATION_METADATA",
  "ONLY_SECONDARY_QUOTATION_AVAILABLE",
  "PARTIAL_PREVIEW_INSUFFICIENT",
  "COPYRIGHT_OR_ACCESS_UNRESOLVED",
  "ORIGINAL_LANGUAGE_TEXT_NOT_AVAILABLE",
  "TRANSLATION_NOT_REVIEWED",
  "PASSAGE_NOT_LOCATED",
  "WORK_RELEVANCE_NOT_VERIFIED",
  "UNKNOWN",
]);

const locationClasses = new Set([
  "PUBLIC_LIBRARY_OR_ARCHIVE",
  "PUBLISHER_OR_BOOKSELLER_METADATA",
  "LAWFUL_LOCAL_PHYSICAL_COPY",
  "LAWFUL_LOCAL_DIGITAL_COPY",
  "PARTIAL_PUBLIC_PREVIEW",
  "SCHOLARLY_DATABASE",
  "OPEN_WEB_SECONDARY_SOURCE",
  "OPEN_INSTRUMENT_REPOSITORY",
  "PRIVATE_LOCATION_NOT_RECORDED",
  "UNKNOWN",
]);

describe(
  "first real Petro Zheji primary-source inventory records v0.1",
  () => {
    it("derives exactly the accepted 38-field record schema", () => {
      const start = policyText.indexOf(
        "## Required inventory fields",
      );

      const end = policyText.indexOf(
        "## Source-access states",
        start,
      );

      const fields = Array.from(
        policyText
          .slice(start, end)
          .matchAll(
            /^- `([A-Za-z][A-Za-z0-9]*)`[.;]$/gm,
          ),
        (match) => match[1],
      );

      expect(fields).toEqual(
        expectedFields,
      );

      expect(fields).toHaveLength(
        38,
      );
    });

    it("contains exactly four first real inventory records across two works", () => {
      expect(inventory.records).toHaveLength(
        4,
      );

      const sourceIds = inventory.records.map(
        (record: { sourceId: string }) => record.sourceId,
      );

      expect(
        new Set(
          sourceIds,
        ).size,
      ).toBe(
        inventory.records.length,
      );

      expect(
        new Set(
          inventory.records.map(
            (record: { workId: string }) => record.workId,
          ),
        ).size,
      ).toBe(
        2,
      );

      expect(
        inventory.status,
      ).toBe(
        "ACTIVE_PARTIAL_METADATA_ONLY",
      );
    });

    it("requires every record to contain exactly the 38 accepted fields", () => {
      for (const record of inventory.records) {
        expect(
          Object.keys(record),
        ).toEqual(
          expectedFields,
        );
      }
    });

    it("keeps all first records metadata-only instead of promoting them to primary text", () => {
      for (const record of inventory.records) {
        expect(
          record.sourceClass,
        ).toBe(
          "EDITION_OR_LIBRARY_METADATA",
        );

        expect(
          record.sourceAccessStatus,
        ).toBe(
          "METADATA_ONLY",
        );

        expect(
          record.sourceClass,
        ).not.toBe(
          "PETRO_ZHEJI_PRIMARY_PUBLISHED_WORK",
        );
      }

      expect(
        inventory.claimBoundary,
      ).toContain(
        "not verified primary-text records",
      );
    });

    it("uses only reviewed source-state enums", () => {
      for (const record of inventory.records) {
        expect(
          sourceClasses.has(
            record.sourceClass,
          ),
        ).toBe(
          true,
        );

        expect(
          accessStates.has(
            record.sourceAccessStatus,
          ),
        ).toBe(
          true,
        );

        expect(
          editionStates.has(
            record.editionIdentityStatus,
          ),
        ).toBe(
          true,
        );

        expect(
          citationStates.has(
            record.citationStability,
          ),
        ).toBe(
          true,
        );

        expect(
          selectionRoles.has(
            record.editionSelectionRole,
          ),
        ).toBe(
          true,
        );

        expect(
          verificationStates.has(
            record.verificationStatus,
          ),
        ).toBe(
          true,
        );

        expect(
          locationClasses.has(
            record.sourceLocationClass,
          ),
        ).toBe(
          true,
        );

        for (const blocker of record.blockers) {
          expect(
            blockerStates.has(
              blocker,
            ),
          ).toBe(
            true,
          );
        }
      }
    });

    it("keeps every baseline-selection posture explicitly UNDECIDED", () => {
      for (const record of inventory.records) {
        expect(
          record.editionSelectionRole,
        ).toBe(
          "UNDECIDED",
        );

        expect(
          record.editionSelectionRoles,
        ).toEqual([
          "UNDECIDED",
        ]);
      }
    });

    it("records the Shqipja volume-2 publication-year conflict", () => {
      const record = inventory.records.find(
        (candidate: { sourceId: string }) =>
          candidate.sourceId
          === "pz-meta-shqipja-sanskritishtja-volume2-conflict-v0.1",
      );

      expect(record).toBeDefined();

      expect(
        record.editionIdentityStatus,
      ).toBe(
        "CONFLICTING_METADATA",
      );

      expect(
        record.publicationYear,
      ).toBeNull();

      expect(
        record.unresolvedEditionConflicts,
      ).toContain(
        "Publication year conflict: 2005 versus 2006.",
      );

      expect(
        record.blockers,
      ).toContain(
        "CONFLICTING_PUBLICATION_METADATA",
      );
    });

    it("records the Roli Mesianik same-ISBN pagination conflict", () => {
      const record = inventory.records.find(
        (candidate: { sourceId: string }) =>
          candidate.sourceId
          === "pz-meta-roli-mesianik-2015-pagination-conflict-v0.1",
      );

      expect(record).toBeDefined();

      expect(
        record.editionIdentityStatus,
      ).toBe(
        "CONFLICTING_METADATA",
      );

      expect(
        record.totalPages,
      ).toBeNull();

      expect(
        record.unresolvedEditionConflicts,
      ).toContain(
        "Pagination conflict: 859 pages versus [928] pages.",
      );

      expect(
        record.blockers,
      ).toContain(
        "PAGINATION_NOT_VERIFIED",
      );
    });

    it("does not manufacture exact-edition or stable-page evidence", () => {
      for (const record of inventory.records) {
        expect(
          record.editionIdentityStatus,
        ).not.toBe(
          "EXACT_EDITION_VERIFIED",
        );

        expect(
          record.citationStability,
        ).not.toBe(
          "PAGE_STABLE",
        );

        expect(
          record.verificationStatus,
        ).not.toBe(
          "PAGE_CITATION_REVIEWED",
        );

        expect(
          record.printedPageSystem,
        ).toBeNull();

        expect(
          record.digitalPageSystem,
        ).toBeNull();
      }
    });

    it("keeps catalogue provenance machine-readable without storing copyrighted primary text", () => {
      expect(
        inventory.provenanceEvidence,
      ).toHaveLength(
        11,
      );

      const evidenceIds = inventory.provenanceEvidence.map(
        (item: { evidenceId: string }) => item.evidenceId,
      );

      expect(
        new Set(evidenceIds).size,
      ).toBe(
        evidenceIds.length,
      );

      for (const record of inventory.records) {
        for (const evidenceId of record.provenanceNotes) {
          expect(
            evidenceIds,
          ).toContain(
            evidenceId,
          );
        }

        expect(
          record.legalUseNotes,
        ).toMatch(
          /metadata|primary text|copyrighted|scan/i,
        );
      }

      const serialized = JSON.stringify(
        inventory,
      );

      expect(serialized).not.toContain(
        "/Users/",
      );

      expect(serialized).not.toContain(
        "PRIVATE_LOCATION_NOT_RECORDED",
      );
    });

    it("keeps existing Open Instrument refs title-level rather than edition proof", () => {
      for (const record of inventory.records) {
        expect(
          record.existingOpenInstrumentCitationRefs.length,
        ).toBeGreaterThan(
          0,
        );

        for (const reference of record.existingOpenInstrumentCitationRefs) {
          expect(
            fs.existsSync(
              path.join(
                REPOSITORY_ROOT,
                reference,
              ),
            ),
          ).toBe(
            true,
          );
        }
      }

      expect(
        JSON.stringify(
          inventory.records.map(
            (record: { existingOpenInstrumentCitationRefs: string[] }) =>
              record.existingOpenInstrumentCitationRefs,
          ),
        ),
      ).not.toMatch(
        /97143211|9994380516|9789928190246/,
      );
    });

    it("creates fail-closed per-work edition-selection decisions", () => {
      expect(
        inventory.perWorkEditionSelectionDecisions,
      ).toHaveLength(
        2,
      );

      const representedWorkIds = [
        ...new Set(
          inventory.records.map(
            (record: { workId: string }) => record.workId,
          ),
        ),
      ].sort();

      const decisionWorkIds =
        inventory.perWorkEditionSelectionDecisions.map(
          (decision: { workId: string }) => decision.workId,
        );

      expect(
        new Set(
          decisionWorkIds,
        ).size,
      ).toBe(
        decisionWorkIds.length,
      );

      expect(
        [...new Set(decisionWorkIds)].sort(),
      ).toEqual(
        representedWorkIds,
      );

      for (
        const decision
        of inventory.perWorkEditionSelectionDecisions
      ) {
        expect(
          Object.keys(
            decision,
          ),
        ).toEqual(
          expectedDecisionFields,
        );

        expect(
          typeof decision.selectionReason,
        ).toBe(
          "string",
        );

        expect(
          decision.selectionReason.length,
        ).toBeGreaterThan(
          0,
        );

        expect(
          Array.isArray(
            decision.existingOpenInstrumentCitationRefs,
          ),
        ).toBe(
          true,
        );

        expect(
          decision.existingOpenInstrumentCitationRefs.length,
        ).toBeGreaterThan(
          0,
        );

        for (
          const reference
          of decision.existingOpenInstrumentCitationRefs
        ) {
          expect(
            fs.existsSync(
              path.join(
                REPOSITORY_ROOT,
                reference,
              ),
            ),
          ).toBe(
            true,
          );
        }

        expect(
          Array.isArray(
            decision.knownEditionDifferences,
          ),
        ).toBe(
          true,
        );

        expect(
          decision.knownEditionDifferences.length,
        ).toBeGreaterThan(
          0,
        );

        expect(
          Array.isArray(
            decision.unresolvedEditionConflicts,
          ),
        ).toBe(
          true,
        );

        expect(
          decision.unresolvedEditionConflicts.length,
        ).toBeGreaterThan(
          0,
        );

        expect(
          typeof decision.reviewer,
        ).toBe(
          "string",
        );

        expect(
          decision.reviewer.length,
        ).toBeGreaterThan(
          0,
        );

        expect(
          decision.reviewedAt,
        ).toMatch(
          /^\d{4}-\d{2}-\d{2}$/,
        );

        expect(
          Array.isArray(
            decision.blockers,
          ),
        ).toBe(
          true,
        );

        expect(
          decision.blockers.length,
        ).toBeGreaterThan(
          0,
        );

        for (const blocker of decision.blockers) {
          expect(
            blockerStates.has(
              blocker,
            ),
          ).toBe(
            true,
          );
        }

        expect(
          decision.selectionDecisionStatus,
        ).toBe(
          "DECISION_BLOCKED",
        );

        expect(
          decision.selectedSourceId,
        ).toBeNull();

        const recordsForWork = inventory.records
          .filter(
            (record: { workId: string }) =>
              record.workId === decision.workId,
          )
          .map(
            (record: { sourceId: string }) =>
              record.sourceId,
          )
          .sort();

        expect(
          [...decision.candidateSourceIds].sort(),
        ).toEqual(
          recordsForWork,
        );

        expect(
          new Set(
            decision.candidateSourceIds,
          ).size,
        ).toBe(
          decision.candidateSourceIds.length,
        );

        expect(
          decision.candidateSourceRoleAssignments,
        ).toHaveLength(
          decision.candidateSourceIds.length,
        );

        const assignmentSourceIds =
          decision.candidateSourceRoleAssignments.map(
            (assignment: { sourceId: string }) =>
              assignment.sourceId,
          );

        expect(
          new Set(
            assignmentSourceIds,
          ).size,
        ).toBe(
          assignmentSourceIds.length,
        );

        expect(
          [...new Set(assignmentSourceIds)].sort(),
        ).toEqual(
          [...decision.candidateSourceIds].sort(),
        );

        for (
          const assignment
          of decision.candidateSourceRoleAssignments
        ) {
          expect(
            Object.keys(
              assignment,
            ),
          ).toEqual(
            expectedAssignmentFields,
          );

          const record = inventory.records.find(
            (candidate: { sourceId: string }) =>
              candidate.sourceId === assignment.sourceId,
          );

          expect(record).toBeDefined();

          expect(
            assignment.editionSelectionRole,
          ).toBe(
            record.editionSelectionRole,
          );

          expect(
            assignment.editionSelectionRoles,
          ).toEqual(
            record.editionSelectionRoles,
          );
        }
      }
    });

    it("keeps the next scientific step source-oriented rather than algorithmic", () => {
      const serialized = JSON.stringify(
        inventory,
      );

      expect(serialized).not.toContain(
        "FIDELITY_BASELINE_SELECTED",
      );

      expect(serialized).not.toContain(
        "PAGE_CITATION_REVIEWED",
      );

      expect(serialized).not.toContain(
        "SOURCE_INVENTORY_COMPLETE",
      );

      expect(
        inventory.lane,
      ).toBe(
        "CONSTRUCT_PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_V0_1",
      );
    });
  },
);
