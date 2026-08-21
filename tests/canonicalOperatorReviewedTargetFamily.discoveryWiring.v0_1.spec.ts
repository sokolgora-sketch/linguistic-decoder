import fs from "node:fs";

import {
  discoverCanonicalOperatorCandidatesV0_1,
} from "@/shared/canonicalOperatorDiscovery.v0_1";

function candidatesFor(
  word: string,
  operatorId: "DA" | "DI" | "AT",
) {
  return discoverCanonicalOperatorCandidatesV0_1(
    word,
  ).filter(
    (candidate) =>
      candidate.operatorId === operatorId,
  );
}

function reviewedCandidatesFor(
  word: string,
  operatorId: "DA" | "DI" | "AT",
) {
  return candidatesFor(
    word,
    operatorId,
  ).filter(
    (candidate) =>
      candidate.reviewedEvidenceEligible === true &&
      candidate.functionalBridgeStatus ===
        "reviewed",
  );
}

describe(
  "canonical reviewed target-family discovery wiring v0.1",
  () => {
    it.each([
      ["studies", "DI"],
      ["studied", "DI"],
      ["studying", "DI"],

      ["damages", "DA"],
      ["damaged", "DA"],
      ["damaging", "DA"],

      ["fathers", "AT"],
      ["fatherhood", "AT"],
      ["fatherly", "AT"],
    ] as const)(
      "%s receives reviewed %s through the reviewed target-family bridge",
      (
        word,
        operatorId,
      ) => {
        const reviewed =
          reviewedCandidatesFor(
            word,
            operatorId,
          );

        expect(reviewed).toHaveLength(1);

        expect(
          reviewed[0],
        ).toEqual(
          expect.objectContaining({
            basis: word,
            operatorId,
            reviewedEvidenceEligible:
              true,
            functionalBridgeStatus:
              "reviewed",
            discoveryAuthority:
              "canonical_profile_and_reviewed_operation_policy",
          }),
        );
      },
    );

    it.each([
      ["studies", "DA"],
      ["studies", "AT"],
      ["studied", "DA"],
      ["studied", "AT"],
      ["studying", "DA"],
      ["studying", "AT"],

      ["damages", "DI"],
      ["damages", "AT"],
      ["damaged", "DI"],
      ["damaged", "AT"],
      ["damaging", "DI"],
      ["damaging", "AT"],

      ["fathers", "DA"],
      ["fathers", "DI"],
      ["fatherhood", "DA"],
      ["fatherhood", "DI"],
      ["fatherly", "DA"],
      ["fatherly", "DI"],
    ] as const)(
      "%s does not leak reviewed evidence into %s",
      (
        word,
        operatorId,
      ) => {
        expect(
          reviewedCandidatesFor(
            word,
            operatorId,
          ),
        ).toEqual([]);
      },
    );

    it("keeps DA substring collisions structural-only", () => {
      for (
        const word
        of [
          "data",
          "database",
          "daisy",
        ]
      ) {
        expect(
          reviewedCandidatesFor(
            word,
            "DA",
          ),
        ).toEqual([]);
      }

      expect(
        candidatesFor(
          "data",
          "DA",
        ).some(
          (candidate) =>
            candidate
              .reviewedEvidenceEligible ===
              false,
        ),
      ).toBe(true);

      expect(
        candidatesFor(
          "database",
          "DA",
        ).some(
          (candidate) =>
            candidate
              .reviewedEvidenceEligible ===
              false,
        ),
      ).toBe(true);
    });

    it("keeps DI substring collisions structural-only", () => {
      for (
        const word
        of [
          "digital",
          "dinner",
          "dij",
          "dije",
          "dit",
        ]
      ) {
        expect(
          reviewedCandidatesFor(
            word,
            "DI",
          ),
        ).toEqual([]);
      }

      expect(
        candidatesFor(
          "digital",
          "DI",
        ).some(
          (candidate) =>
            candidate
              .reviewedEvidenceEligible ===
              false,
        ),
      ).toBe(true);
    });

    it("keeps bare and embedded AT collisions outside reviewed father truth", () => {
      expect(
        reviewedCandidatesFor(
          "at",
          "AT",
        ),
      ).toEqual([]);

      expect(
        reviewedCandidatesFor(
          "atom",
          "AT",
        ),
      ).toEqual([]);

      expect(
        reviewedCandidatesFor(
          "atlas",
          "AT",
        ),
      ).toEqual([]);

      expect(
        reviewedCandidatesFor(
          "attic",
          "AT",
        ),
      ).toEqual([]);
    });

    it.each([
      ["studyhood", "DI"],
      ["studyly", "DI"],
      ["studys", "DI"],
      ["studyed", "DI"],
      ["studims", "DI"],
      ["studimhood", "DI"],
      ["studimly", "DI"],

      ["damagehood", "DA"],
      ["damagely", "DA"],
      ["damageing", "DA"],
      ["damagement", "DA"],

      ["fathering", "AT"],
      ["fathered", "AT"],
      ["fatherhoods", "AT"],
      ["fatherliness", "AT"],
    ] as const)(
      "%s remains outside undeclared reviewed %s family authority",
      (
        word,
        operatorId,
      ) => {
        expect(
          reviewedCandidatesFor(
            word,
            operatorId,
          ),
        ).toEqual([]);
      },
    );

    it("preserves exact canonical proof words", () => {
      expect(
        reviewedCandidatesFor(
          "study",
          "DI",
        ),
      ).toHaveLength(1);

      expect(
        reviewedCandidatesFor(
          "damage",
          "DA",
        ),
      ).toHaveLength(1);

      expect(
        reviewedCandidatesFor(
          "father",
          "AT",
        ),
      ).toHaveLength(1);
    });

    it("requires generic family wiring instead of word-name branches", () => {
      const discoverySource =
        fs.readFileSync(
          "src/shared/canonicalOperatorDiscovery.v0_1.ts",
          "utf8",
        );

      expect(
        discoverySource,
      ).not.toMatch(
        /\b(?:basis|normalizedBasis)\s*===\s*["'](?:studies|studied|studying|damages|damaged|damaging|fathers|fatherhood|fatherly)["']/,
      );
    });
  },
);
