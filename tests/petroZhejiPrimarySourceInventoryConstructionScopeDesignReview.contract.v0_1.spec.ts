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

const REVIEW_PATH = path.join(
  REPOSITORY_ROOT,
  "docs/open-instrument/reviews/petro-zheji-primary-source-inventory-construction-scope-design-review-v0.1.md",
);

const DESIGN_PATH = path.join(
  REPOSITORY_ROOT,
  "docs/open-instrument/reports/petro-zheji-primary-source-inventory-construction-scope-design-v0.1.md",
);

const DESIGN_CONTRACT_PATH = path.join(
  REPOSITORY_ROOT,
  "tests/petroZhejiPrimarySourceInventoryConstructionScopeDesign.contract.v0_1.spec.ts",
);

const GOVERNING_DESIGN_PATH = path.join(
  REPOSITORY_ROOT,
  "docs/open-instrument/reports/petro-zheji-primary-source-inventory-and-edition-policy-design-v0.2.md",
);

const GOVERNING_REVIEW_PATH = path.join(
  REPOSITORY_ROOT,
  "docs/open-instrument/reviews/petro-zheji-primary-source-inventory-and-edition-policy-design-review-v0.2.md",
);

const EXPECTED_DESIGN_BLOB =
  "a289895f47bb5002ba0861f6d53f7a672d9970c3";

const EXPECTED_DESIGN_CONTRACT_BLOB =
  "ef8b37e2158fd03634958fde0416b59e1c5356e6";

const EXPECTED_GOVERNING_DESIGN_BLOB =
  "d2f34e4affe83461dd757ab6f10805c9c05fdb01";

const EXPECTED_GOVERNING_REVIEW_BLOB =
  "fce4969bce5b3ed3fdbf36ec0d67df596f0f21bc";

const reviewText = fs.readFileSync(
  REVIEW_PATH,
  "utf8",
);

const designText = fs.readFileSync(
  DESIGN_PATH,
  "utf8",
);

const designContractText = fs.readFileSync(
  DESIGN_CONTRACT_PATH,
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

const normalizedReviewText = reviewText.replace(
  /\s+/g,
  " ",
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

function getDesignSection(
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
      `Unable to resolve design section: ${startHeading}`,
    );
  }

  return designText.slice(
    start,
    end,
  );
}

describe(
  "Petro Zheji primary-source inventory construction-scope design review v0.1",
  () => {
    it("binds the review to the exact merged construction-scope artifacts", () => {
      expect(
        gitBlobSha(
          designText,
        ),
      ).toBe(
        EXPECTED_DESIGN_BLOB,
      );

      expect(
        gitBlobSha(
          designContractText,
        ),
      ).toBe(
        EXPECTED_DESIGN_CONTRACT_BLOB,
      );

      expect(reviewText).toContain(
        EXPECTED_DESIGN_BLOB,
      );

      expect(reviewText).toContain(
        EXPECTED_DESIGN_CONTRACT_BLOB,
      );

      expect(reviewText).toContain(
        "951e93a57fe7c8340ff64b1b4a7fa8114d1f88b4",
      );
    });

    it("binds to the formally accepted governing v0.2 artifacts", () => {
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

      expect(governingReviewText).toContain(
        "Status: REVIEWED_ACCEPTED.",
      );

      expect(reviewText).toContain(
        EXPECTED_GOVERNING_DESIGN_BLOB,
      );

      expect(reviewText).toContain(
        EXPECTED_GOVERNING_REVIEW_BLOB,
      );
    });

    it("records the formal construction-scope review as accepted", () => {
      expect(reviewText).toContain(
        "Status: REVIEWED_ACCEPTED.",
      );

      expect(reviewText).toContain(
        "PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_CONSTRUCTION_SCOPE_REVIEWED_ACCEPTED_V0_1",
      );

      expect(reviewText).toContain(
        "`13 / 13 PASS`",
      );

      expect(reviewText).toContain(
        "`ACCEPTED`",
      );
    });

    it("locks exactly thirteen review requirements and thirteen acceptance criteria", () => {
      const reviewRequirements = getDesignSection(
        "## Construction-scope review requirements",
        "## Construction-scope acceptance criteria",
      );

      const acceptanceCriteria = getDesignSection(
        "## Construction-scope acceptance criteria",
        "## Required next review outcome",
      );

      expect(
        reviewRequirements.match(
          /^\d+\. /gm,
        ),
      ).toHaveLength(
        13,
      );

      expect(
        acceptanceCriteria.match(
          /^\d+\. /gm,
        ),
      ).toHaveLength(
        13,
      );
    });

    it("locks the exact ten bounded source-work activities", () => {
      const section = getDesignSection(
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

    it("locks the six fail-closed checkpoints", () => {
      const section = getDesignSection(
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
        normalizedDesignText,
      ).toContain(
        "Failure at one checkpoint prevents silent promotion to the next checkpoint.",
      );

      expect(
        normalizedDesignText,
      ).toContain(
        "Model inference cannot override a failed checkpoint.",
      );
    });

    it("locks the final nine-step construction sequence", () => {
      const section = getDesignSection(
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

    it("locks preservation of access-blocked candidates", () => {
      for (const requiredText of [
        "Create a source record using the complete accepted 38-field schema before any lawful-access failure can stop work on the candidate.",
        "The already initialized source record must record `sourceLocationClass`, `sourceAccessStatus`, and all applicable `blockers`.",
        "An access-blocked candidate must not be deleted, skipped, or left without a 38-field source record merely because lawful inspection is unavailable.",
      ]) {
        expect(
          normalizedDesignText,
        ).toContain(
          requiredText,
        );
      }

      expect(
        normalizedReviewText,
      ).toContain(
        "An access-blocked source remains auditable rather than disappearing.",
      );
    });

    it("locks exact-edition and PAGE_STABLE requirements for page-citation review", () => {
      for (const requiredText of [
        "`editionIdentityStatus` is exactly `EXACT_EDITION_VERIFIED`",
        "`citationStability` is exactly `PAGE_STABLE`",
        "`EDITION_FAMILY_VERIFIED`, `TITLE_ONLY`, `CONFLICTING_METADATA`, and `UNKNOWN` must not satisfy this checkpoint.",
      ]) {
        expect(
          normalizedDesignText,
        ).toContain(
          requiredText,
        );
      }

      expect(
        normalizedReviewText,
      ).toContain(
        "Page-citation claims therefore cannot outrun exact-edition and stable-pagination proof.",
      );
    });

    it("keeps acceptance separate from authorization timing", () => {
      expect(
        normalizedReviewText,
      ).toContain(
        "Authorization becomes effective only when this exact accepted review is merged to `main`.",
      );

      expect(reviewText).toContain(
        "`SOURCE_INVENTORY_CONSTRUCTION_AUTHORIZATION = NOT_GRANTED`",
      );

      expect(reviewText).toContain(
        "`SOURCE_INVENTORY_CONSTRUCTION_AUTHORIZED_V0_1`",
      );

      expect(reviewText).toContain(
        "`CONSTRUCT_PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_V0_1`",
      );
    });

    it("keeps Symbolic Algorithm and runtime work outside source-inventory authorization", () => {
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
        expect(reviewText).toContain(
          requiredText,
        );
      }
    });

    it("locks the anti-loop transition directly to actual source inventory", () => {
      for (const requiredText of [
        "This review finds no concrete blocker requiring another construction-scope design revision.",
        "Therefore no additional abstract construction-scope design iteration is authorized or required by this review.",
        "`CONSTRUCT_PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_V0_1`",
      ]) {
        expect(
          normalizedReviewText,
        ).toContain(
          requiredText,
        );
      }
    });

    it("keeps the parent fidelity milestone open and scientifically bounded", () => {
      expect(
        normalizedReviewText,
      ).toContain(
        "The parent milestone remains open.",
      );

      expect(
        normalizedReviewText,
      ).toContain(
        "It is not complete.",
      );

      expect(
        normalizedReviewText,
      ).toContain(
        "It is not closed.",
      );

      expect(
        normalizedReviewText,
      ).toContain(
        "No verified page-cited Petro Zheji primary-source corpus exists yet.",
      );

      expect(
        normalizedReviewText,
      ).toContain(
        "No complete source-faithful reconstruction of Petro Zheji's Symbolic Algorithm exists yet.",
      );

      expect(reviewText).not.toContain(
        "MILESTONE_CLOSED",
      );
    });
  },
);
