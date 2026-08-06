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
  "docs/open-instrument/reviews/petro-zheji-primary-source-inventory-and-edition-policy-design-review-v0.1.md",
);

const DESIGN_PATH = path.join(
  REPOSITORY_ROOT,
  "docs/open-instrument/reports/petro-zheji-primary-source-inventory-and-edition-policy-design-v0.1.md",
);

const EXPECTED_DESIGN_BLOB =
  "0fbf3efa30f718f519ee6ea2ffb58d35d50c147c";

const reviewText = fs.readFileSync(
  REVIEW_PATH,
  "utf8",
);

const designText = fs.readFileSync(
  DESIGN_PATH,
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

const designBuffer = Buffer.from(
  designText,
  "utf8",
);

const designBlobHeader = Buffer.from(
  `blob ${designBuffer.length}\0`,
  "utf8",
);

const actualDesignBlob = createHash(
  "sha1",
)
  .update(designBlobHeader)
  .update(designBuffer)
  .digest("hex");

describe(
  "Petro Zheji primary-source inventory and edition-policy design review v0.1",
  () => {
    it("binds the review to the exact reviewed design blob", () => {
      expect(actualDesignBlob).toBe(
        EXPECTED_DESIGN_BLOB,
      );

      expect(reviewText).toContain(
        EXPECTED_DESIGN_BLOB,
      );

      expect(designText).toContain(
        "Status: DESIGN_ONLY.",
      );
    });

    it("records the formal review as blocked rather than accepted", () => {
      expect(reviewText).toContain(
        "Status: REVIEW_BLOCKED.",
      );

      expect(reviewText).toContain(
        "PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_AND_EDITION_POLICY_DESIGN_REVIEW_BLOCKED",
      );

      expect(normalizedReviewText).toContain(
        "The Petro Zheji primary-source inventory and edition-policy design v0.1 is not accepted in its current form.",
      );

      expect(reviewText).not.toContain(
        "Status: REVIEWED_ACCEPTED.",
      );

      expect(reviewText).not.toContain(
        "PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_AND_EDITION_POLICY_DESIGN_REVIEWED_ACCEPTED",
      );
    });

    it("records the lossy edition-role model as a blocking finding", () => {
      expect(normalizedDesignText).toContain(
        "Every source record must declare exactly one `editionSelectionRole`",
      );

      expect(normalizedDesignText).toContain(
        "A source may satisfy more than one descriptive policy role",
      );

      expect(normalizedDesignText).toContain(
        "Additional descriptive roles may be recorded in a future separately reviewed field",
      );

      expect(reviewText).toContain(
        "## Blocking finding 1 — preserve every applicable edition role",
      );

      expect(normalizedReviewText).toContain(
        "That permits a future source record to preserve only one role and discard the others.",
      );

      expect(reviewText).toContain(
        "`editionSelectionRoles`",
      );

      expect(reviewText).toContain(
        "`descriptiveEditionSelectionRoles`",
      );
    });

    it("requires explicit collection invariants in the revised design", () => {
      for (const requiredText of [
        "every applicable descriptive role is retained",
        "collection values are unique",
        "collection values come from the reviewed role enum",
        "the primary `editionSelectionRole` remains explicit",
        "the primary role is also present in the role collection",
        "per-work edition decisions preserve all applicable descriptive roles",
        "no role may be inferred silently",
      ]) {
        expect(normalizedReviewText).toContain(
          requiredText,
        );
      }
    });

    it("records the review-contract blob defect and its correction", () => {
      expect(reviewText).toContain(
        "## Blocking finding 2 — bind the contract to the reviewed design blob",
      );

      expect(normalizedReviewText).toContain(
        "The corrected contract computes the Git blob SHA-1 from the exact UTF-8 bytes of `designText`.",
      );

      expect(actualDesignBlob).toBe(
        "0fbf3efa30f718f519ee6ea2ffb58d35d50c147c",
      );
    });

    it("preserves all reviewed structural evidence counts", () => {
      for (const requiredText of [
        "required source-record field count: `37`",
        "source-class count: `9`",
        "source-access state count: `9`",
        "edition-identity state count: `5`",
        "citation-stability state count: `7`",
        "edition-selection role count: `7`",
        "per-work selection-decision status count: `6`",
        "missing-source blocker count: `12`",
        "review-requirement count: `13`",
        "design-acceptance criterion count: `14`",
        "explicit-prohibition count: `30`",
        "merged design-contract tests: `12 passed`",
      ]) {
        expect(reviewText).toContain(
          requiredText,
        );
      }
    });

    it("records accepted safeguards without overriding the blocker", () => {
      for (const requiredText of [
        "source-record field completeness: PASS",
        "source hierarchy separation: PASS",
        "access-state fail-closed behavior: PASS",
        "edition-identity binding: PASS",
        "citation-stability policy: PASS",
        "page and edition separation: PASS",
        "copyright and source-location policy: PASS",
        "blocker and provenance policy: PASS",
        "per-work selected-source linkage: PASS",
        "retention of all applicable edition roles: BLOCKED",
        "review-contract design-blob binding: FIXED_IN_REVIEW_PR",
        "overall design acceptance: BLOCKED",
      ]) {
        expect(reviewText).toContain(
          requiredText,
        );
      }
    });

    it("keeps the parent milestone open and incomplete", () => {
      expect(reviewText).toContain(
        "`MILESTONE_OPENED`",
      );

      expect(reviewText).toContain(
        "not complete",
      );

      expect(reviewText).toContain(
        "not closed",
      );

      expect(reviewText).not.toContain(
        "MILESTONE_CLOSED",
      );
    });

    it("keeps source work and all implementation unauthorized", () => {
      for (const requiredText of [
        "Design acceptance is not granted.",
        "Construction-scope design is not authorized.",
        "Source acquisition is not authorized.",
        "Source downloading is not authorized.",
        "Source-record construction is not authorized.",
        "Primary-source verification is not authorized.",
        "Edition verification is not authorized.",
        "Runtime changes are not authorized.",
        "API changes are not authorized.",
        "UI changes are not authorized.",
        "Provider execution is not authorized.",
        "Model calls are not authorized.",
        "Zheji replay is not authorized.",
        "Operator promotion is not authorized.",
        "JO work is not authorized.",
        "PO work is not authorized.",
        "MAT work is not authorized.",
      ]) {
        expect(reviewText).toContain(
          requiredText,
        );
      }

      expect(reviewText).not.toContain(
        "SOURCE_INVENTORY_CONSTRUCTION_AUTHORIZED",
      );

      expect(reviewText).not.toContain(
        "SYMBOLIC_ALGORITHM_IMPLEMENTATION_AUTHORIZED",
      );
    });

    it("selects design revision as the only next lane", () => {
      expect(reviewText).toContain(
        "`REVISE_PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_AND_EDITION_POLICY_DESIGN_V0_1`",
      );

      expect(normalizedReviewText).toContain(
        "That lane must revise the original design and its design contract.",
      );

      expect(normalizedReviewText).toContain(
        "It must not design construction scope yet.",
      );

      expect(reviewText).not.toContain(
        "`DESIGN_PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_CONSTRUCTION_SCOPE_V0_1`",
      );
    });
  },
);
