import { createHash } from "node:crypto";
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

const DESIGN_PATH = path.join(
  REPOSITORY_ROOT,
  "docs/open-instrument/reports/petro-zheji-primary-source-inventory-construction-scope-design-v0.1.md",
);

const GOVERNING_DESIGN_PATH = path.join(
  REPOSITORY_ROOT,
  "docs/open-instrument/reports/petro-zheji-primary-source-inventory-and-edition-policy-design-v0.2.md",
);

const GOVERNING_REVIEW_PATH = path.join(
  REPOSITORY_ROOT,
  "docs/open-instrument/reviews/petro-zheji-primary-source-inventory-and-edition-policy-design-review-v0.2.md",
);

const EXPECTED_GOVERNING_DESIGN_BLOB =
  "d2f34e4affe83461dd757ab6f10805c9c05fdb01";

const EXPECTED_GOVERNING_REVIEW_BLOB =
  "fce4969bce5b3ed3fdbf36ec0d67df596f0f21bc";

const designText = fs.readFileSync(
  DESIGN_PATH,
  "utf8",
);

const governingDesignText = fs.readFileSync(
  GOVERNING_DESIGN_PATH,
  "utf8",
);

const governingReviewText = fs.readFileSync(
  GOVERNING_REVIEW_PATH,
  "utf8",
);

const normalizedDesignText = designText.replace(
  /\s+/g,
  " ",
);

function gitBlobSha(
  text: string,
): string {
  const buffer = Buffer.from(
    text,
    "utf8",
  );

  const header = Buffer.from(
    `blob ${buffer.length}\0`,
    "utf8",
  );

  return createHash(
    "sha1",
  )
    .update(header)
    .update(buffer)
    .digest("hex");
}

function getSection(
  startHeading: string,
  endHeading: string,
): string {
  const start = designText.indexOf(
    startHeading,
  );

  const end = designText.indexOf(
    endHeading,
    start,
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

  return designText.slice(
    start,
    end,
  );
}

describe(
  "Petro Zheji primary-source inventory construction-scope design v0.1",
  () => {
    it("binds directly to the formally accepted v0.2 governing artifacts", () => {
      expect(
        gitBlobSha(
          governingDesignText,
        ),
      ).toBe(
        EXPECTED_GOVERNING_DESIGN_BLOB,
      );

      expect(
        gitBlobSha(
          governingReviewText,
        ),
      ).toBe(
        EXPECTED_GOVERNING_REVIEW_BLOB,
      );

      expect(designText).toContain(
        EXPECTED_GOVERNING_DESIGN_BLOB,
      );

      expect(designText).toContain(
        EXPECTED_GOVERNING_REVIEW_BLOB,
      );

      expect(governingReviewText).toContain(
        "Status: REVIEWED_ACCEPTED.",
      );

      expect(governingReviewText).toContain(
        "Design acceptance is granted for v0.2.",
      );
    });

    it("keeps this lane design-only pending a separate construction authorization review", () => {
      for (const requiredText of [
        "Status: CONSTRUCTION_SCOPE_DESIGN_ONLY_PENDING_REVIEW.",
        "Current construction authorization:",
        "`NOT_GRANTED`",
        "`PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_CONSTRUCTION_SCOPE_REVIEWED_ACCEPTED_V0_1`",
        "`SOURCE_INVENTORY_CONSTRUCTION_AUTHORIZED_V0_1`",
        "`CONSTRUCT_PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_V0_1`",
        "The appearance of a future authorization marker in this design does not grant authorization.",
      ]) {
        expect(
          normalizedDesignText,
        ).toContain(
          requiredText,
        );
      }
    });

    it("preserves the accepted 38-field schema rather than creating a competing schema", () => {
      for (const requiredText of [
        "The accepted 38-field v0.2 inventory schema remains authoritative.",
        "This construction-scope design does not add, delete, rename, or redefine an inventory field.",
        "No parallel replacement schema is created here.",
        "No construction process may silently infer a missing value merely to make a record complete.",
      ]) {
        expect(
          normalizedDesignText,
        ).toContain(
          requiredText,
        );
      }
    });

    it("locks the exact ten future bounded source-work activities", () => {
      const section = getSection(
        "## Activities the future accepted gate may authorize",
        "## Lawful source-access boundary",
      );

      const activities = Array.from(
        section.matchAll(
          /^\d+\. `([A-Z][A-Z0-9_]+)`[.;]$/gm,
        ),
        (match) => match[1],
      );

      expect(activities).toEqual([
        "SOURCE_DISCOVERY",
        "LAWFUL_SOURCE_ACCESS_IDENTIFICATION",
        "LAWFUL_SOURCE_ACQUISITION_OR_INSPECTION",
        "SOURCE_RECORD_CONSTRUCTION",
        "EDITION_IDENTITY_VERIFICATION",
        "PAGINATION_VERIFICATION",
        "CONTENT_LOCATION",
        "PAGE_CITATION_VERIFICATION",
        "BOUNDED_QUOTATION_TRANSLATION_AND_BIBLIOGRAPHIC_CAPTURE",
        "MISSING_SOURCE_BLOCKER_RECORDING",
      ]);
    });

    it("locks six fail-closed construction checkpoints", () => {
      const section = getSection(
        "## Review checkpoints",
        "## Discovery and attribution checkpoint",
      );

      const checkpoints = Array.from(
        section.matchAll(
          /^\d+\. `([A-Z][A-Z0-9_]+)`[.;]$/gm,
        ),
        (match) => match[1],
      );

      expect(checkpoints).toEqual([
        "DISCOVERY_AND_ATTRIBUTION_CHECKPOINT",
        "LAWFUL_ACCESS_CHECKPOINT",
        "EDITION_IDENTITY_CHECKPOINT",
        "PAGINATION_AND_CONTENT_LOCATION_CHECKPOINT",
        "PAGE_CITATION_CHECKPOINT",
        "INVENTORY_ACCEPTANCE_CHECKPOINT",
      ]);

      expect(
        section.replace(
          /\s+/g,
          " ",
        ),
      ).toContain(
        "Failure at one checkpoint prevents silent promotion to the next checkpoint.",
      );

      expect(
        section.replace(
          /\s+/g,
          " ",
        ),
      ).toContain(
        "Model inference cannot override a failed checkpoint.",
      );
    });

    it("requires a deterministic nine-step source-record construction sequence", () => {
      const section = getSection(
        "## Record-construction sequence",
        "## Review checkpoints",
      );

      for (const heading of [
        "### Step 1 — discovery",
        "### Step 2 — source-record initialization",
        "### Step 3 — lawful-access assessment",
        "### Step 4 — bibliographic and edition identity",
        "### Step 5 — pagination assessment",
        "### Step 6 — content location",
        "### Step 7 — page-citation review",
        "### Step 8 — edition-selection decision",
        "### Step 9 — inventory review",
      ]) {
        expect(section).toContain(
          heading,
        );
      }
    });

    it("initializes blocked candidates before lawful-access failure can stop work", () => {
      const section = getSection(
        "## Record-construction sequence",
        "## Review checkpoints",
      ).replace(
        /\s+/g,
        " ",
      );

      expect(
        section.indexOf(
          "### Step 2 — source-record initialization",
        ),
      ).toBeLessThan(
        section.indexOf(
          "### Step 3 — lawful-access assessment",
        ),
      );

      for (const requiredText of [
        "Create a source record using the complete accepted 38-field schema before any lawful-access failure can stop work on the candidate.",
        "The already initialized source record must record `sourceLocationClass`, `sourceAccessStatus`, and all applicable `blockers`.",
        "preserve the initialized source record with its explicit access state, location class, and blocker evidence, then stop before Step 4.",
        "An access-blocked candidate must not be deleted, skipped, or left without a 38-field source record merely because lawful inspection is unavailable.",
      ]) {
        expect(section).toContain(
          requiredText,
        );
      }
    });

    it("keeps content location separate from semantic reconstruction", () => {
      for (const requiredText of [
        "Content location proves where material exists.",
        "It does not prove a semantic interpretation.",
        "Inventory acceptance is not algorithmic acceptance.",
        "It proves source provenance and citation readiness only.",
        "The source inventory is an evidence store, not an algorithm executor.",
      ]) {
        expect(
          normalizedDesignText,
        ).toContain(
          requiredText,
        );
      }
    });

    it("requires page citations to remain edition and pagination bound", () => {
      const section = getSection(
        "## Page-citation checkpoint",
        "## Inventory acceptance checkpoint",
      ).replace(
        /\s+/g,
        " ",
      );

      for (const requiredText of [
        "the source record exists",
        "`editionIdentityStatus` is exactly `EXACT_EDITION_VERIFIED`",
        "`citationStability` is exactly `PAGE_STABLE`",
        "lawful access is documented",
        "content is actually located",
        "the cited printed page belongs to that same exact verified edition record",
        "`EDITION_FAMILY_VERIFIED`, `TITLE_ONLY`, `CONFLICTING_METADATA`, and `UNKNOWN` must not satisfy this checkpoint.",
        "No model-generated page number may satisfy this checkpoint.",
      ]) {
        expect(section).toContain(
          requiredText,
        );
      }

      expect(governingDesignText).toContain(
        "### EXACT_EDITION_VERIFIED",
      );

      expect(
        governingDesignText.replace(
          /\s+/g,
          " ",
        ),
      ).toContain(
        "The publisher, year, edition statement, volume, pagination, and copy identity are sufficiently verified for page-cited work.",
      );

      expect(
        governingDesignText.replace(
          /\s+/g,
          " ",
        ),
      ).toContain(
        "The work and edition family are known, but the exact printing or pagination is not fully verified.",
      );
    });

    it("preserves copyright and lawful access fail-closed boundaries", () => {
      for (const requiredText of [
        "Future source work may use only lawful access paths.",
        "Unauthorized mirrors must not be promoted as source evidence.",
        "The repository must not contain:",
        "complete copyrighted books",
        "complete copyrighted scans",
        "access credentials",
        "Copyright uncertainty is a valid blocker.",
      ]) {
        expect(
          normalizedDesignText,
        ).toContain(
          requiredText,
        );
      }
    });

    it("keeps Symbolic Algorithm and runtime work outside future source-inventory authorization", () => {
      const section = getSection(
        "## What remains unauthorized even after source-construction authorization",
        "## Construction-scope review requirements",
      );

      for (const requiredText of [
        "terminology reconstruction",
        "Code F reconstruction",
        "Code E reconstruction",
        "free-operator reconstruction",
        "equivocal-pair reconstruction",
        "symbolic-figure reconstruction",
        "symbolic-equation reconstruction",
        "semantic-spectrum reconstruction",
        "complete Symbolic Algorithm reconstruction",
        "runtime changes",
        "API changes",
        "UI changes",
        "provider execution",
        "model calls",
        "Zheji replay",
        "operator promotion",
        "JO work",
        "PO work",
        "MAT work",
      ]) {
        expect(section).toContain(
          requiredText,
        );
      }
    });

    it("locks thirteen construction-scope review requirements", () => {
      const section = getSection(
        "## Construction-scope review requirements",
        "## Construction-scope acceptance criteria",
      );

      const requirements = Array.from(
        section.matchAll(
          /^\d+\. /gm,
        ),
      );

      expect(
        requirements,
      ).toHaveLength(
        13,
      );
    });

    it("locks thirteen construction-scope acceptance criteria", () => {
      const section = getSection(
        "## Construction-scope acceptance criteria",
        "## Required next review outcome",
      );

      const criteria = Array.from(
        section.matchAll(
          /^\d+\. /gm,
        ),
      );

      expect(
        criteria,
      ).toHaveLength(
        13,
      );
    });

    it("makes the anti-loop transition to actual source inventory explicit", () => {
      for (const requiredText of [
        "This is the final planned construction-scope design lane before actual primary-source inventory work.",
        "Editorial preference, stylistic preference, duplicate wording, or a desire for additional abstract documentation is not by itself a reason to create another design revision.",
        "If no such blocker exists, the review must be `REVIEWED_ACCEPTED`.",
        "A clean accepted review authorizes:",
        "`CONSTRUCT_PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_V0_1`",
        "No additional construction-scope design PR is planned after a clean acceptance.",
      ]) {
        expect(
          normalizedDesignText,
        ).toContain(
          requiredText,
        );
      }
    });

    it("keeps current source and implementation authorizations closed", () => {
      for (const requiredText of [
        "Source discovery execution: NOT_GRANTED.",
        "Source acquisition or inspection execution: NOT_GRANTED.",
        "Source-record construction: NOT_GRANTED.",
        "Primary-source verification: NOT_GRANTED.",
        "Edition verification: NOT_GRANTED.",
        "Page-citation verification: NOT_GRANTED.",
        "Symbolic Algorithm implementation: NOT_GRANTED.",
        "Runtime/API/UI changes: NOT_GRANTED.",
        "Provider/model execution: NOT_GRANTED.",
        "JO / PO / MAT work: NOT_GRANTED.",
      ]) {
        expect(designText).toContain(
          requiredText,
        );
      }
    });

    it("keeps the parent fidelity milestone open and incomplete", () => {
      expect(
        normalizedDesignText,
      ).toContain(
        "The parent milestone remains open.",
      );

      expect(
        normalizedDesignText,
      ).toContain(
        "It is not complete.",
      );

      expect(
        normalizedDesignText,
      ).toContain(
        "It is not closed.",
      );

      expect(
        normalizedDesignText,
      ).toContain(
        "No page-cited Petro Zheji primary-source corpus is yet verified.",
      );

      expect(
        normalizedDesignText,
      ).toContain(
        "No source-faithful complete Symbolic Algorithm reconstruction exists yet.",
      );

      expect(designText).not.toContain(
        "MILESTONE_CLOSED",
      );
    });
  },
);
