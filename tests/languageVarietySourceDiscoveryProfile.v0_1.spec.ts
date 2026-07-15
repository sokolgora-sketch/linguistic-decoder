import * as fs from "node:fs";
import * as path from "node:path";

import {
  LANGUAGE_VARIETY_SOURCE_DISCOVERY_PROFILE_VERSION_V0_1,
  getResolvedLanguageVarietySourceDiscoveryProfilesV0_1,
  languageVarietySourceDiscoveryBindingsV0_1,
  resolveLanguageVarietySourceDiscoveryProfileV0_1,
} from "@/shared/languageVarietySourceDiscoveryProfile.v0_1";

import {
  canonicalOperatorProfilesV0_1,
} from "@/shared/canonicalOperatorProfile.v0_1";

function readRepoFile(relativePath: string): string {
  return fs.readFileSync(
    path.join(process.cwd(), relativePath),
    "utf8",
  );
}

describe(
  "language/variety source-discovery profile v0.1",
  () => {
    it("registers exactly DA and DI without adding JO or PO", () => {
      expect(
        languageVarietySourceDiscoveryBindingsV0_1.map(
          (binding) => binding.operatorId,
        ),
      ).toEqual(["DA", "DI"]);

      const source = readRepoFile(
        "src/shared/languageVarietySourceDiscoveryProfile.v0_1.ts",
      );

      expect(source).not.toContain(
        'operatorId: "JO"',
      );
      expect(source).not.toContain(
        'operatorId: "PO"',
      );
    });

    it("resolves exactly two canon-locked source profiles", () => {
      const profiles =
        getResolvedLanguageVarietySourceDiscoveryProfilesV0_1();

      expect(profiles).toHaveLength(2);
      expect(
        profiles.map(
          (profile) => profile.operatorId,
        ),
      ).toEqual(["DA", "DI"]);

      for (const profile of profiles) {
        expect(profile.profileVersion).toBe(
          LANGUAGE_VARIETY_SOURCE_DISCOVERY_PROFILE_VERSION_V0_1,
        );

        const canonical =
          canonicalOperatorProfilesV0_1.find(
            (candidate) =>
              candidate.operatorId ===
              profile.operatorId,
          );

        expect(canonical).toBeDefined();
        expect(canonical?.canonLifecycleStatus).toBe(
          "canon_locked",
        );
        expect(profile.sourceId).toBe(
          canonical?.sourceId,
        );
        expect(profile.language).toEqual({
          code: canonical?.language,
          label: "Albanian",
        });
      }
    });

    it("preserves DA as reviewed Gheg-specific source scope", () => {
      const da =
        resolveLanguageVarietySourceDiscoveryProfileV0_1(
          "DA",
        );

      expect(da).not.toBeNull();
      expect(da?.sourceId).toBe(
        "reviewed.external.gheg-da.damage.candidate.v0_1",
      );
      expect(da?.language).toEqual({
        code: "sq",
        label: "Albanian",
      });
      expect(da?.varietyScope).toEqual({
        status: "reviewed_specific",
        code: "gheg",
        label: "Northwestern Gheg Albanian",
        evidenceBasis:
          "reviewed_source_row_citation_metadata",
      });
      expect(
        da?.sourceAuthority.sourceTitle,
      ).toContain(
        "Northwestern Gheg Albanian",
      );
    });

    it("keeps DI at language scope without inventing a variety", () => {
      const di =
        resolveLanguageVarietySourceDiscoveryProfileV0_1(
          "DI",
        );

      expect(di).not.toBeNull();
      expect(di?.sourceId).toBe(
        "reviewed.external.di.knowledge.candidate.v0_1",
      );
      expect(di?.language).toEqual({
        code: "sq",
        label: "Albanian",
      });
      expect(di?.varietyScope).toEqual({
        status: "not_source_specific",
        code: null,
        label: null,
        evidenceBasis: "not_claimed",
      });
    });

    it("derives complete reviewed source authority metadata", () => {
      for (
        const profile
        of getResolvedLanguageVarietySourceDiscoveryProfilesV0_1()
      ) {
        expect(profile.sourceAuthority).toEqual(
          expect.objectContaining({
            status:
              "reviewed_registered_source",
            sourceStatus:
              "reviewed_accepted",
          }),
        );

        for (
          const value
          of [
            profile.sourceAuthority.sourceKind,
            profile.sourceAuthority
              .citationType,
            profile.sourceAuthority
              .sourceTitle,
            profile.sourceAuthority
              .sourceDateOrVersion,
            profile.sourceAuthority
              .sourceUrlOrArchiveRef,
            profile.sourceAuthority
              .entryLocator,
            profile.sourceAuthority
              .sourceHashOrArchiveHash,
            profile.sourceAuthority
              .attestedForm,
            profile.sourceAuthority
              .attestedGloss,
          ]
        ) {
          expect(value.trim().length).toBeGreaterThan(
            0,
          );
        }
      }
    });

    it("locks fail-closed source-discovery policy", () => {
      for (
        const profile
        of getResolvedLanguageVarietySourceDiscoveryProfilesV0_1()
      ) {
        expect(
          profile.sourceDiscoveryPolicy,
        ).toEqual({
          sourceSelection:
            "canonical_profile_source_id_only",
          requiresCanonicalProfileResolution:
            true,
          requiresReviewedAcceptedSourceRow:
            true,
          requiresFunctionalReadiness: true,
          requiresMachineAuthorization: true,
          requiresProductionMembership: true,
          requiresRuntimeProjection: true,
          requiresReviewedCitation: true,
          requiresFinalizedLocator: true,
          requiresSourceHash: true,
          varietyInferenceAuthorized: false,
          networkDiscoveryAuthorized: false,
          externalSearchAuthorized: false,
          failClosedOnMismatch: true,
          nullIsValid: true,
        });
      }
    });

    it("returns null for unknown or frozen operators", () => {
      expect(
        resolveLanguageVarietySourceDiscoveryProfileV0_1(
          "UNKNOWN",
        ),
      ).toBeNull();

      expect(
        resolveLanguageVarietySourceDiscoveryProfileV0_1(
          "JO",
        ),
      ).toBeNull();

      expect(
        resolveLanguageVarietySourceDiscoveryProfileV0_1(
          "PO",
        ),
      ).toBeNull();
    });

    it("preserves every claim boundary and user decision", () => {
      for (
        const profile
        of getResolvedLanguageVarietySourceDiscoveryProfilesV0_1()
      ) {
        expect(profile.claimBoundary).toEqual({
          historicalOriginClaim:
            "not_claimed",
          historicalTransmissionClaim:
            "not_claimed",
          winnerClaim: "not_claimed",
          languageSuperiorityClaim:
            "not_claimed",
          candidateTruthClaim:
            "not_claimed",
          userDecisionPosture:
            "user_decides",
        });
      }
    });

    it("remains a profile-only owner with no runtime wiring", () => {
      for (
        const profile
        of getResolvedLanguageVarietySourceDiscoveryProfilesV0_1()
      ) {
        expect(profile.runtimeWiringStatus).toBe(
          "profile_only_not_wired",
        );
      }

      for (
        const runtimeOwner
        of [
          "src/shared/canonicalOperatorDiscovery.v0_1.ts",
          "src/shared/deepRoot.minRoots.v1.ts",
          "src/shared/deepRoot.rootMap.builder.v1.ts",
        ]
      ) {
        expect(
          readRepoFile(runtimeOwner),
        ).not.toContain(
          "languageVarietySourceDiscoveryProfile.v0_1",
        );
      }
    });

    it("does not authorize network or external search behavior", () => {
      const source = readRepoFile(
        "src/shared/languageVarietySourceDiscoveryProfile.v0_1.ts",
      );

      expect(source).not.toContain(
        "networkDiscoveryAuthorized: true",
      );
      expect(source).not.toContain(
        "externalSearchAuthorized: true",
      );
      expect(source).not.toContain("fetch(");
      expect(source).not.toContain("axios");
    });
  },
);
