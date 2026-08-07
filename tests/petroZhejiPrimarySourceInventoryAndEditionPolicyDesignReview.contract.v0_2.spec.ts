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
  "docs/open-instrument/reviews/petro-zheji-primary-source-inventory-and-edition-policy-design-review-v0.2.md",
);

const DESIGN_PATH = path.join(
  REPOSITORY_ROOT,
  "docs/open-instrument/reports/petro-zheji-primary-source-inventory-and-edition-policy-design-v0.2.md",
);

const HISTORICAL_DESIGN_PATH = path.join(
  REPOSITORY_ROOT,
  "docs/open-instrument/reports/petro-zheji-primary-source-inventory-and-edition-policy-design-v0.1.md",
);

const HISTORICAL_REVIEW_PATH = path.join(
  REPOSITORY_ROOT,
  "docs/open-instrument/reviews/petro-zheji-primary-source-inventory-and-edition-policy-design-review-v0.1.md",
);

const EXPECTED_DESIGN_BLOB =
  "d2f34e4affe83461dd757ab6f10805c9c05fdb01";

const EXPECTED_HISTORICAL_DESIGN_BLOB =
  "0fbf3efa30f718f519ee6ea2ffb58d35d50c147c";

const EXPECTED_HISTORICAL_REVIEW_BLOB =
  "7dc940fe681577c810cb8085eb9ce7edbefa8a57";

const reviewText = fs.readFileSync(
  REVIEW_PATH,
  "utf8",
);

const designText = fs.readFileSync(
  DESIGN_PATH,
  "utf8",
);

const historicalDesignText = fs.readFileSync(
  HISTORICAL_DESIGN_PATH,
  "utf8",
);

const historicalReviewText = fs.readFileSync(
  HISTORICAL_REVIEW_PATH,
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

function bulletCount(
  section: string,
): number {
  return section
    .split(
      "\n",
    )
    .filter(
      (line) => line.startsWith(
        "- ",
      ),
    )
    .length;
}

describe(
  "Petro Zheji primary-source inventory and edition-policy design review v0.2",
  () => {
    it("binds acceptance to the exact merged v0.2 design blob", () => {
      expect(
        gitBlobSha(
          designText,
        ),
      ).toBe(
        EXPECTED_DESIGN_BLOB,
      );

      expect(reviewText).toContain(
        EXPECTED_DESIGN_BLOB,
      );

      expect(reviewText).toContain(
        "Reviewed product main:",
      );

      expect(reviewText).toContain(
        "205d44481f88d62454f4379c209b10e44ae5223f",
      );

      expect(designText).toContain(
        "Status: DESIGN_REVISED_PENDING_REVIEW.",
      );
    });

    it("records the formal v0.2 review as accepted", () => {
      expect(reviewText).toContain(
        "Status: REVIEWED_ACCEPTED.",
      );

      expect(reviewText).toContain(
        "PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_AND_EDITION_POLICY_DESIGN_REVIEWED_ACCEPTED_V0_2",
      );

      expect(normalizedReviewText).toContain(
        "The Petro Zheji primary-source inventory and edition-policy design v0.2 is accepted as the governing design for the next bounded construction-scope lane.",
      );

      expect(reviewText).toContain(
        "`18 / 18 PASS`",
      );

      expect(reviewText).toContain(
        "`20 / 20 PASS`",
      );

      expect(reviewText).toContain(
        "`ACCEPTED`",
      );
    });

    it("proves the two historical v0.1 blockers are closed", () => {
      expect(normalizedDesignText).toContain(
        "one required non-empty `editionSelectionRoles` collection containing every applicable edition-selection role",
      );

      expect(normalizedDesignText).toContain(
        "every applicable descriptive role is retained",
      );

      expect(normalizedDesignText).toContain(
        "an unresolved operational posture remains primary `UNDECIDED` even when descriptive roles are retained",
      );

      expect(normalizedDesignText).toContain(
        "one assignment for every candidate source",
      );

      expect(reviewText).toContain(
        "## Blocking finding 1 closure — complete edition-role retention",
      );

      expect(reviewText).toContain(
        "Result: CLOSED.",
      );

      expect(reviewText).toContain(
        "## Blocking finding 2 closure — exact reviewed-design blob binding",
      );
    });

    it("preserves the immutable v0.1 design and blocked review", () => {
      expect(
        gitBlobSha(
          historicalDesignText,
        ),
      ).toBe(
        EXPECTED_HISTORICAL_DESIGN_BLOB,
      );

      expect(
        gitBlobSha(
          historicalReviewText,
        ),
      ).toBe(
        EXPECTED_HISTORICAL_REVIEW_BLOB,
      );

      expect(historicalReviewText).toContain(
        "Status: REVIEW_BLOCKED.",
      );

      expect(historicalReviewText).toContain(
        "PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_AND_EDITION_POLICY_DESIGN_REVIEW_BLOCKED",
      );

      expect(normalizedReviewText).toContain(
        "This v0.2 acceptance does not retroactively modify or accept v0.1.",
      );
    });

    it("verifies exact revised review and acceptance counts", () => {
      const reviewRequirements = getDesignSection(
        "## Review requirements",
        "## Design acceptance criteria",
      );

      const acceptanceCriteria = getDesignSection(
        "## Design acceptance criteria",
        "## Explicitly not authorized",
      );

      const prohibitions = getDesignSection(
        "## Explicitly not authorized",
        "## Revision provenance and historical boundary",
      );

      expect(
        bulletCount(
          reviewRequirements,
        ),
      ).toBe(
        18,
      );

      expect(
        bulletCount(
          acceptanceCriteria,
        ),
      ).toBe(
        20,
      );

      expect(
        bulletCount(
          prohibitions,
        ),
      ).toBe(
        30,
      );
    });

    it("records every formal review requirement as passing", () => {
      for (const requiredText of [
        "field completeness: PASS",
        "state exclusivity: PASS",
        "edition-selection safety: PASS",
        "required `editionIdentityStatus` coverage: PASS",
        "complete `editionSelectionRoles` coverage: PASS",
        "primary-role inclusion and uniqueness: PASS",
        "`UNDECIDED` operational exclusivity with descriptive-role retention: PASS",
        "required per-work edition-selection decision coverage: PASS",
        "complete `candidateSourceRoleAssignments` coverage: PASS",
        "one assignment for every candidate source: PASS",
        "selected-edition rationale and citation traceability: PASS",
        "printed-page versus digital-page separation: PASS",
        "copyright and quotation limits: PASS",
        "missing-source fail-closed behavior: PASS",
        "primary versus secondary source separation: PASS",
        "internal material and replay separation: PASS",
        "compatibility with the parent milestone: PASS",
        "absence of implementation authorization: PASS",
      ]) {
        expect(
          normalizedReviewText,
        ).toContain(
          requiredText,
        );
      }
    });

    it("keeps source construction and implementation unauthorized", () => {
      for (const requiredText of [
        "Source acquisition is not authorized.",
        "Source downloading is not authorized.",
        "Committing copyrighted books or scans is not authorized.",
        "Source-record construction is not authorized.",
        "Primary-source verification is not authorized.",
        "Edition verification is not authorized.",
        "Terminology reconstruction is not authorized.",
        "Code F reconstruction is not authorized.",
        "Code E reconstruction is not authorized.",
        "Free-operator reconstruction is not authorized.",
        "Equivocal-pair reconstruction is not authorized.",
        "Symbolic-figure reconstruction is not authorized.",
        "Symbolic-equation reconstruction is not authorized.",
        "Semantic-spectrum reconstruction is not authorized.",
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

    it("authorizes only the bounded construction-scope design lane next", () => {
      expect(reviewText).toContain(
        "Design acceptance is granted for v0.2.",
      );

      expect(reviewText).toContain(
        "The next bounded construction-scope design lane is authorized.",
      );

      expect(reviewText).toContain(
        "`DESIGN_PETRO_ZHEJI_PRIMARY_SOURCE_INVENTORY_CONSTRUCTION_SCOPE_V0_1`",
      );

      expect(normalizedReviewText).toContain(
        "It must not reopen the edition-selection design absent a concrete blocking defect.",
      );

      expect(normalizedReviewText).toContain(
        "After that bounded construction-scope gate, the program should move into actual primary-source inventory and page-cited Petro Zheji fidelity work rather than continuing an indefinite documentation-only loop.",
      );
    });

    it("keeps the parent milestone open and scientifically bounded", () => {
      expect(normalizedReviewText).toContain(
        "The parent milestone remains open.",
      );

      expect(normalizedReviewText).toContain(
        "It is not complete.",
      );

      expect(normalizedReviewText).toContain(
        "It is not closed.",
      );

      expect(normalizedReviewText).toContain(
        "No verified page-cited Petro Zheji primary-source corpus exists yet.",
      );

      expect(normalizedReviewText).toContain(
        "No source-faithful complete Symbolic Algorithm reconstruction exists yet.",
      );

      expect(reviewText).not.toContain(
        "MILESTONE_CLOSED",
      );
    });
  },
);
