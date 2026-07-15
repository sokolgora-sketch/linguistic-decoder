import * as fs from "node:fs";
import * as path from "node:path";

import {
  extractFunctionalRootsV1,
} from "@/shared/deepRoot.functional.v1";

import {
  LEGACY_FUNCTIONAL_ROOT_COMPATIBILITY_REGISTRY_VERSION_V0_1,
  legacyFunctionalRootCompatibilityRegistryV0_1,
  resolveLegacyFunctionalRootCompatibilityV0_1,
} from "@/shared/legacyFunctionalRootCompatibilityRegistry.v0_1";

function readRepoFile(relativePath: string): string {
  return fs.readFileSync(
    path.join(process.cwd(), relativePath),
    "utf8",
  );
}

describe(
  "legacy functional-root compatibility registry v0.1",
  () => {
    it("contains exactly the three existing compatibility records", () => {
      expect(
        legacyFunctionalRootCompatibilityRegistryV0_1.map(
          (entry) => entry.normalizedInput,
        ),
      ).toEqual([
        "study",
        "damage",
        "father",
      ]);

      expect(
        legacyFunctionalRootCompatibilityRegistryV0_1.map(
          (entry) => entry.output.id,
        ),
      ).toEqual([
        "sq.shtu+di.v1",
        "sq.dem.v1",
        "proto.at.pat.v1",
      ]);
    });

    it("preserves the existing resolver output", () => {
      for (
        const entry
        of legacyFunctionalRootCompatibilityRegistryV0_1
      ) {
        expect(
          extractFunctionalRootsV1({
            basis: {
              word: entry.normalizedInput,
              normalizedWord:
                entry.normalizedInput,
            },
          }),
        ).toEqual([entry.output]);
      }
    });

    it("normalizes case and whitespace without expanding vocabulary", () => {
      expect(
        resolveLegacyFunctionalRootCompatibilityV0_1(
          "  STUDY  ",
        )?.id,
      ).toBe("sq.shtu+di.v1");

      expect(
        resolveLegacyFunctionalRootCompatibilityV0_1(
          "hope",
        ),
      ).toBeNull();

      expect(
        resolveLegacyFunctionalRootCompatibilityV0_1(
          "",
        ),
      ).toBeNull();
    });

    it("returns defensive copies", () => {
      const first =
        resolveLegacyFunctionalRootCompatibilityV0_1(
          "study",
        );

      const second =
        resolveLegacyFunctionalRootCompatibilityV0_1(
          "study",
        );

      expect(first).not.toBeNull();
      expect(second).not.toBeNull();
      expect(first).not.toBe(second);
      expect(first?.roots).not.toBe(second?.roots);
      expect(first?.surfaceForms).not.toBe(
        second?.surfaceForms,
      );
      expect(first?.opsUsed).not.toBe(
        second?.opsUsed,
      );
      expect(first?.notes).not.toBe(
        second?.notes,
      );
    });

    it("marks every record as non-authoritative compatibility data", () => {
      for (
        const entry
        of legacyFunctionalRootCompatibilityRegistryV0_1
      ) {
        expect(entry.registryVersion).toBe(
          LEGACY_FUNCTIONAL_ROOT_COMPATIBILITY_REGISTRY_VERSION_V0_1,
        );

        expect(entry.compatibilityBoundary).toEqual({
          status:
            "legacy_compatibility_only",
          reviewedSourceAuthorization: false,
          canonicalOperatorProfileBacked: false,
          runtimeExpansionAuthorized: false,
          historicalOriginClaim:
            "not_claimed",
          historicalTransmissionClaim:
            "not_claimed",
          winnerClaim: "not_claimed",
          candidateTruthClaim: "not_claimed",
          userDecisionPosture:
            "user_decides",
        });

        expect(entry.migrationStatus).toBe(
          "requires_dedicated_review_before_retirement",
        );

        expect(
          entry.migrationReason.trim().length,
        ).toBeGreaterThan(0);
      }
    });

    it("removes word-name conditionals from the runtime resolver", () => {
      const source = readRepoFile(
        "src/shared/deepRoot.functional.v1.ts",
      );

      expect(source).not.toMatch(
        /if\s*\(\s*w\s*===/,
      );

      expect(source).not.toContain(
        '"study"',
      );

      expect(source).not.toContain(
        '"damage"',
      );

      expect(source).not.toContain(
        '"father"',
      );

      expect(source).toContain(
        "resolveLegacyFunctionalRootCompatibilityV0_1",
      );
    });

    it("does not authorize registry-driven runtime expansion", () => {
      const source = readRepoFile(
        "src/shared/legacyFunctionalRootCompatibilityRegistry.v0_1.ts",
      );

      expect(source).not.toContain(
        "runtimeExpansionAuthorized: true",
      );

      expect(source).not.toContain(
        "reviewedSourceAuthorization: true",
      );

      expect(source).not.toContain(
        "canonicalOperatorProfileBacked: true",
      );
    });
  },
);
