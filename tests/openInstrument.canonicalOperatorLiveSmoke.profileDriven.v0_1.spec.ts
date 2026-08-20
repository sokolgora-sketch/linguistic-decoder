import fs from "node:fs";

import {
  canonicalOperatorProfilesV0_1,
} from "@/shared/canonicalOperatorProfile.v0_1";

import {
  buildCanonicalOperatorLiveSmokeCasesV0_1,
  getCanonicalOperatorLiveSmokeWordsV0_1,
} from "../scripts/open-instrument/canonical-operator-live-smoke-cases.v0.1";

describe("Open Instrument canonical operator live smoke profile contract v0.1", () => {
  it("derives all positive and negative cases from canonical profiles", () => {
    const cases = buildCanonicalOperatorLiveSmokeCasesV0_1();

    const expectedCount = canonicalOperatorProfilesV0_1.reduce(
      (total, profile) =>
        total +
        profile.positiveProofWords.length +
        profile.negativeControlWords.length,
      0,
    );

    expect(cases).toHaveLength(expectedCount);

    for (const profile of canonicalOperatorProfilesV0_1) {
      const operatorCases = cases.filter(
        (smokeCase) =>
          smokeCase.operatorId === profile.operatorId,
      );

      expect(
        operatorCases
          .filter(
            (smokeCase) =>
              smokeCase.expectation === "evidence_present",
          )
          .map((smokeCase) => smokeCase.word),
      ).toEqual(profile.positiveProofWords);

      expect(
        operatorCases
          .filter(
            (smokeCase) =>
              smokeCase.expectation === "evidence_absent",
          )
          .map((smokeCase) => smokeCase.word),
      ).toEqual(profile.negativeControlWords);

      for (const smokeCase of operatorCases) {
        expect(smokeCase.embryo).toBe(profile.embryo);
        expect(smokeCase.sourceId).toBe(profile.sourceId);
        expect(smokeCase.evidenceText.length).toBeGreaterThan(0);
      }
    }
  });

  it("deduplicates fetched words while preserving profile order", () => {
    expect(getCanonicalOperatorLiveSmokeWordsV0_1()).toEqual([
      "da",
      "dam",
      "damage",
      "study",
      "xyz",
      "mode",
      "made",
      "dome",
      "di",
      "studim",
      "dij",
      "dije",
      "dit",
      "father",
      "at",
    ]);
  });

  it("accepts DA, DI, and bounded-target AT as canon_locked runtime-mature profiles", () => {
    const da = canonicalOperatorProfilesV0_1.find(
      (profile) => profile.operatorId === "DA",
    );
    const di = canonicalOperatorProfilesV0_1.find(
      (profile) => profile.operatorId === "DI",
    );
    const at = canonicalOperatorProfilesV0_1.find(
      (profile) => profile.operatorId === "AT",
    );

    expect(da?.canonLifecycleStatus).toBe("canon_locked");
    expect(di?.canonLifecycleStatus).toBe("canon_locked");
    expect(at?.canonLifecycleStatus).toBe("canon_locked");
    expect(at?.discoveryScope).toBe("bounded_targets");

    for (const profile of canonicalOperatorProfilesV0_1) {
      expect(["runtime_verified", "canon_locked"]).toContain(
        profile.canonLifecycleStatus,
      );
    }
  });

  it("makes the runner consume the profile-backed case owner", () => {
    const runner = fs.readFileSync(
      "scripts/open-instrument/live-smoke.v0.1.ts",
      "utf8",
    );

    expect(runner).toContain(
      'from "./canonical-operator-live-smoke-cases.v0.1"',
    );
    expect(runner).toContain(
      "buildCanonicalOperatorLiveSmokeCasesV0_1",
    );
    expect(runner).toContain(
      "getCanonicalOperatorLiveSmokeWordsV0_1",
    );

    expect(runner).not.toContain(
      'const words = ["da", "dam", "study", "damage", "xyz"]',
    );
    expect(runner).toContain(
      "hasCitationBearingReviewedEvidence",
    );
    expect(runner).toContain(
      "rootMapKeyEvidenceText",
    );
    expect(runner).toContain(
      "citationBearingEvidenceVisible",
    );

    expect(runner).not.toContain("hasReviewedDaEvidence");
    expect(runner).not.toContain("hasReviewedDiProjection");
  });

  it("uses the repository-established tsx runtime", () => {
    const pkg = JSON.parse(
      fs.readFileSync("package.json", "utf8"),
    );

    expect(pkg.scripts["open-instrument:live-smoke"]).toBe(
      "tsx scripts/open-instrument/live-smoke.v0.1.ts",
    );
  });
});
