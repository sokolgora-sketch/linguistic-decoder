import fs from "node:fs";

import {
  canonicalOperatorProfilesV0_1,
} from "@/shared/canonicalOperatorProfile.v0_1";
import {
  discoverCanonicalOperatorCandidatesV0_1,
} from "@/shared/canonicalOperatorDiscovery.v0_1";
import {
  buildMinRootHypotheses,
} from "@/shared/deepRoot.minRoots.v1";

function candidatesFor(
  basis: string,
  operatorId: string,
) {
  return discoverCanonicalOperatorCandidatesV0_1(
    basis,
  ).filter(
    (candidate) =>
      candidate.operatorId === operatorId,
  );
}

describe(
  "generic canonical-operator discovery v0.1",
  () => {
    it("uses existing positive proof words as the reviewed bridge allowlist", () => {
      const source = fs.readFileSync(
        "src/shared/canonicalOperatorDiscovery.v0_1.ts",
        "utf8",
      );

      expect(source).toContain(
        "profile.positiveProofWords.map",
      );

      expect(source).not.toContain(
        "approvedFunctionalBridgeWords",
      );

      for (
        const profile
        of canonicalOperatorProfilesV0_1
      ) {
        expect(
          profile.positiveProofWords.length,
        ).toBeGreaterThan(0);
      }
    });

    it.each([
      ["da", "DA", "da", ["exact"]],
      ["dam", "DA", "da", ["exact"]],
      ["damage", "DA", "da", ["exact"]],
      ["di", "DI", "di", ["exact"]],
      ["study", "DI", "dy", ["y_to_i"]],
      ["studim", "DI", "di", ["exact"]],
      ["father", "AT", "at", ["exact"]],
    ])(
      "%s resolves a reviewed canonical %s bridge",
      (
        basis,
        operatorId,
        segment,
        operations,
      ) => {
        expect(
          candidatesFor(basis, operatorId),
        ).toContainEqual(
          expect.objectContaining({
            basis,
            operatorId,
            segment,
            operations,
            functionalBridgeStatus:
              "reviewed",
            reviewedEvidenceEligible: true,
            discoveryAuthority:
              "canonical_profile_and_reviewed_operation_policy",
          }),
        );
      },
    );

    it("discovers an unreviewed DA pattern without authorizing evidence", () => {
      expect(candidatesFor("data", "DA")).toContainEqual(
        expect.objectContaining({
          basis: "data",
          operatorId: "DA",
          segment: "da",
          operations: ["exact"],
          functionalBridgeStatus:
            "unreviewed",
          reviewedEvidenceEligible: false,
        }),
      );
    });

    it.each([
      ["mode", "DA"],
      ["made", "DA"],
      ["dome", "DA"],
      ["xyz", "DA"],
      ["xyz", "DI"],
    ])(
      "%s receives no canonical %s candidate through unsupported operations",
      (basis, operatorId) => {
        expect(
          candidatesFor(basis, operatorId),
        ).toEqual([]);
      },
    );

    it.each([
      "dij",
      "dije",
      "dit",
    ])(
      "%s exposes only an unreviewed DI pattern",
      (basis) => {
        const candidates =
          candidatesFor(basis, "DI");

        expect(candidates).toHaveLength(1);

        expect(candidates[0]).toEqual(
          expect.objectContaining({
            basis,
            operatorId: "DI",
            embryo: "DI",
            segment: "di",
            carrierForm: "di",
            operations: ["exact"],
            functionalBridgeStatus:
              "unreviewed",
            reviewedEvidenceEligible: false,
            discoveryAuthority:
              "canonical_profile_and_reviewed_operation_policy",
          }),
        );

        expect(
          candidates.every(
            (candidate) =>
              candidate.reviewedEvidenceEligible ===
                false &&
              candidate.functionalBridgeStatus ===
                "unreviewed",
          ),
        ).toBe(true);
      },
    );

    it("is deterministic and normalizes case and whitespace", () => {
      const first =
        discoverCanonicalOperatorCandidatesV0_1(
          "  DAMAGE  ",
        );

      const second =
        discoverCanonicalOperatorCandidatesV0_1(
          "damage",
        );

      expect(first).toEqual(second);
    });

    it("removes the damage-specific runtime branch", () => {
      const source = fs.readFileSync(
        "src/shared/deepRoot.minRoots.v1.ts",
        "utf8",
      );

      expect(source).toContain(
        "discoverCanonicalOperatorCandidatesV0_1",
      );

      expect(source).not.toContain(
        'normalizedBasis === "damage"',
      );

      expect(source).not.toContain(
        "const boundedDamage",
      );
    });

    it("contains no study, damage, or dam word-name condition in the discovery owner", () => {
      const source = fs.readFileSync(
        "src/shared/canonicalOperatorDiscovery.v0_1.ts",
        "utf8",
      );

      expect(source).not.toMatch(
        /\b(?:basis|normalizedBasis)\s*===\s*["'](?:study|damage|dam)["']/,
      );

      expect(source).not.toContain(
        "reviewed.external.jo.refusal.candidate.v0_1",
      );
    });

    it("preserves public identity-op encoding for the reviewed DA fallback", () => {
      expect(
        buildMinRootHypotheses("damage")[0],
      ).toEqual({
        id: "damage:DA:0",
        basis: "damage",
        segments: ["da"],
        protoRoots: ["DA"],
        carriers: [
          {
            protoRootId: "DA",
            segment: "da",
            carrierForm: "da",
            lang: "sq",
            ops: [],
          },
        ],
        decomposition: {
          action: "DA",
        },
        checks: {
          opsWithinLimits: true,
          skeletonExplained: true,
        },
        opsCount: 0,
      });
    });

    it("does not turn an unreviewed data pattern into a canonical fallback", () => {
      expect(
        buildMinRootHypotheses("data").some(
          (hypothesis) =>
            hypothesis.id === "data:DA:0" &&
            hypothesis.protoRoots.length === 1,
        ),
      ).toBe(false);
    });

    it("keeps bare at outside reviewed father-function authorization", () => {
      const candidates =
        candidatesFor(
          "at",
          "AT",
        );

      expect(candidates).toContainEqual(
        expect.objectContaining({
          basis: "at",
          operatorId: "AT",
          embryo: "AT",
          segment: "at",
          carrierForm: "at",
          operations: ["exact"],
          functionalBridgeStatus:
            "unreviewed",
          reviewedEvidenceEligible:
            false,
        }),
      );
    });

    it("emits father AT as a Unit canonical fallback without a father-specific runtime branch", () => {
      const fallback =
        buildMinRootHypotheses(
          "father",
        ).find(
          (hypothesis) =>
            hypothesis.id ===
            "father:AT:0",
        );

      expect(fallback).toEqual({
        id: "father:AT:0",
        basis: "father",
        segments: ["at"],
        protoRoots: ["AT"],
        carriers: [
          {
            protoRootId: "AT",
            segment: "at",
            carrierForm: "at",
            lang: "sq",
            ops: [],
          },
        ],
        decomposition: {
          unit: "AT",
        },
        checks: {
          opsWithinLimits: true,
          skeletonExplained: true,
        },
        opsCount: 0,
      });

      const source =
        fs.readFileSync(
          "src/shared/deepRoot.minRoots.v1.ts",
          "utf8",
        );

      expect(source).not.toContain(
        'normalizedBasis === "father"',
      );

      expect(source).not.toContain(
        'basis === "father"',
      );
    });

  },
);
