import fs from "node:fs";
import path from "node:path";

const DOCUMENT_PATH = path.join(
  process.cwd(),
  "docs/open-instrument/reports/petro-zheji-primary-source-inventory-and-edition-policy-design-v0.1.md",
);

const documentText = fs.readFileSync(
  DOCUMENT_PATH,
  "utf8",
);

const normalizedDocumentText = documentText.replace(
  /\s+/g,
  " ",
);

describe(
  "Petro Zheji primary-source inventory and edition-policy design v0.1",
  () => {
    it("defines the exact design lane without closing the parent milestone", () => {
      expect(documentText).toContain(
        "Status: DESIGN_ONLY.",
      );

      expect(documentText).toContain(
        "DESIGN_PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_AND_EDITION_POLICY_V0_1",
      );

      expect(documentText).toContain(
        "PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_AND_EDITION_POLICY_DESIGNED",
      );

      expect(documentText).not.toContain(
        "PETRO_ZHEJI_FIDELITY_BASELINE_MILESTONE_CLOSED",
      );
    });

    it("records the inspected repository baseline accurately", () => {
      for (const requiredText of [
        "opening-base tracked Zheji paths: `175`",
        "current-main tracked Zheji paths: `177`",
        "post-opening additions: `2`",
        "possible text or JSON source-related artifacts: `161`",
        "repo-tracked binary primary-source artifacts: `0`",
        "They are not 161 Petro Zheji primary sources.",
      ]) {
        expect(documentText).toContain(
          requiredText,
        );
      }
    });

    it("requires the complete source inventory schema", () => {
      for (const field of [
        "`sourceId`",
        "`workId`",
        "`canonicalTitle`",
        "`originalLanguageTitle`",
        "`sourceClass`",
        "`publisher`",
        "`publicationYear`",
        "`editionStatement`",
        "`editionNumber`",
        "`editionIdentityStatus`",
        "`isbnOrCatalogueId`",
        "`printedPageSystem`",
        "`digitalPageSystem`",
        "`sourceAccessStatus`",
        "`citationStability`",
        "`quotationAvailability`",
        "`legalUseNotes`",
        "`knownEditionDifferences`",
        "`editionSelectionRole`",
        "`editionSelectionReason`",
        "`existingOpenInstrumentCitationRefs`",
        "`unresolvedEditionConflicts`",
        "`verificationStatus`",
        "`blockers`",
      ]) {
        expect(documentText).toContain(
          field,
        );
      }
    });

    it("separates primary, secondary, internal, and model material", () => {
      for (const sourceClass of [
        "PETRO_ZHEJI_PRIMARY_PUBLISHED_WORK",
        "PETRO_ZHEJI_PRIMARY_ARTICLE_OR_MANUSCRIPT",
        "PETRO_ZHEJI_PRIMARY_INTERVIEW",
        "EDITION_OR_LIBRARY_METADATA",
        "SCHOLARLY_SECONDARY_ANALYSIS",
        "GENERAL_SECONDARY_COMMENTARY",
        "OPEN_INSTRUMENT_INTERNAL_MATERIAL",
        "MODEL_OR_REPLAY_OUTPUT",
        "UNKNOWN",
      ]) {
        expect(documentText).toContain(
          sourceClass,
        );
      }

      expect(documentText).toContain(
        "A model or replay output is never source evidence by itself.",
      );
    });

    it("locks fail-closed access and edition states", () => {
      for (const state of [
        "VERIFIED_ACCESSIBLE",
        "ACCESSIBLE_UNVERIFIED_EDITION",
        "METADATA_ONLY",
        "PARTIAL_PREVIEW_ONLY",
        "PHYSICAL_COPY_REQUIRED",
        "SCAN_REQUIRED",
        "LEGAL_ACCESS_UNRESOLVED",
        "UNAVAILABLE",
        "EXACT_EDITION_VERIFIED",
        "EDITION_FAMILY_VERIFIED",
        "TITLE_ONLY",
        "CONFLICTING_METADATA",
      ]) {
        expect(documentText).toContain(
          state,
        );
      }

      expect(documentText).toContain(
        "A title match is not an edition match.",
      );
    });

    it("requires machine-readable edition identity and selection decisions", () => {
      for (const requiredText of [
        "`editionIdentityStatus`",
        "`editionSelectionRole`",
        "`editionSelectionReason`",
        "`existingOpenInstrumentCitationRefs`",
        "`unresolvedEditionConflicts`",
        "FIDELITY_BASELINE_SELECTED",
        "UNDECIDED",
        "Per-work edition-selection decision",
        "`candidateSourceIds`",
        "`selectedSourceId`",
        "`selectionDecisionStatus`",
        "BASELINE_EDITION_REVIEWED",
        "NO_ELIGIBLE_EDITION",
      ]) {
        expect(documentText).toContain(
          requiredText,
        );
      }

      expect(normalizedDocumentText).toContain(
        "The selection reason, existing Open Instrument citations, known edition differences, unresolved conflicts, reviewer, and review time must remain machine-readable and reproducible.",
      );

      expect(documentText).toContain(
        "`editionIdentityStatus` is `EXACT_EDITION_VERIFIED`",
      );

      expect(documentText).toContain(
        "The selected source must be linked through `selectedSourceId`.",
      );
    });

    it("locks stable citation states and page-number separation", () => {
      for (const state of [
        "PAGE_STABLE",
        "DIGITAL_LOCATION_ONLY",
        "SECTION_ONLY",
        "QUOTED_WITHOUT_STABLE_PAGE",
        "SECONDARY_CITATION_ONLY",
        "UNLOCATED",
      ]) {
        expect(documentText).toContain(
          state,
        );
      }

      expect(documentText).toContain(
        "The printed page must not be replaced by the PDF viewer index.",
      );

      expect(documentText).toContain(
        "Page numbers from different editions must not be merged.",
      );
    });

    it("locks the initial title targets without claiming their contents", () => {
      for (const title of [
        "`Shqipja dhe Sanskritishtja`",
        "`Roli Mesianik i Shqipes`",
        "`Libri i Aforizmave`",
      ]) {
        expect(documentText).toContain(
          title,
        );
      }

      expect(normalizedDocumentText).toContain(
        "The target list is not a claim that all listed works contain the complete Symbolic Algorithm.",
      );
    });

    it("protects copyrighted works and private source locations", () => {
      for (const requiredText of [
        "complete copyrighted books",
        "large unauthorized scans",
        "excessive quotation",
        "Private filesystem paths must not be committed.",
        "Credentials must not be committed.",
        "The inventory should store citation metadata and bounded evidence, not the complete copyrighted work.",
      ]) {
        expect(
          requiredText.includes(
            "The inventory should store citation metadata",
          )
            ? normalizedDocumentText
            : documentText,
        ).toContain(
          requiredText,
        );
      }
    });

    it("requires explicit blockers and forbids model-based upgrades", () => {
      for (const blocker of [
        "PRIMARY_TEXT_NOT_AVAILABLE",
        "EXACT_EDITION_NOT_VERIFIED",
        "PAGINATION_NOT_VERIFIED",
        "CONFLICTING_PUBLICATION_METADATA",
        "ONLY_SECONDARY_QUOTATION_AVAILABLE",
        "COPYRIGHT_OR_ACCESS_UNRESOLVED",
        "PASSAGE_NOT_LOCATED",
      ]) {
        expect(documentText).toContain(
          blocker,
        );
      }

      expect(documentText).toContain(
        "A blocked source must not be upgraded by model inference.",
      );
    });

    it("blocks source acquisition and all implementation work", () => {
      for (const requiredText of [
        "Runtime implementation: not authorized.",
        "Source download: not authorized.",
        "Copyrighted book commit: not authorized.",
        "Provider or model execution: not authorized.",
        "Zheji replay: not authorized.",
        "Operator promotion: not authorized.",
        "JO, PO, and MAT: not authorized.",
      ]) {
        expect(documentText).toContain(
          requiredText,
        );
      }
    });

    it("selects design review as the only next lane", () => {
      expect(documentText).toContain(
        "`REVIEW_PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_AND_EDITION_POLICY_DESIGN_V0_1`",
      );

      expect(documentText).toContain(
        "The next lane must review this design only.",
      );

      expect(documentText).toContain(
        "It must not construct source records.",
      );
    });
  },
);
