import {
  canonicalOperatorProfilesV0_1,
  getResolvedCanonicalOperatorProfilesV0_1,
  type CanonicalOperatorProfileV0_1,
} from "../../src/shared/canonicalOperatorProfile.v0_1";

export type CanonicalOperatorLiveSmokeExpectationV0_1 =
  | "evidence_present"
  | "evidence_absent";

export type CanonicalOperatorLiveSmokeCaseV0_1 = {
  operatorId: string;
  embryo: string;
  sourceId: string;
  word: string;
  expectation: CanonicalOperatorLiveSmokeExpectationV0_1;
  evidenceText: string;
};

function fail(message: string): never {
  throw new Error(`Canonical operator live-smoke configuration error: ${message}`);
}

function assertRuntimeMatureProfile(
  profile: CanonicalOperatorProfileV0_1,
): void {
  if (
    profile.canonLifecycleStatus !== "runtime_verified" &&
    profile.canonLifecycleStatus !== "canon_locked"
  ) {
    fail(
      `${profile.operatorId} must hold a runtime-mature lifecycle status, received ${profile.canonLifecycleStatus}`,
    );
  }

  if (profile.reviewedEvidenceStatus !== "reviewed_functional") {
    fail(
      `${profile.operatorId} must hold reviewed_functional evidence status`,
    );
  }

  if (
    profile.authorizationScope !==
    "bounded_functional_lexical_projection"
  ) {
    fail(`${profile.operatorId} has an unsupported authorization scope`);
  }

  if (profile.positiveProofWords.length === 0) {
    fail(`${profile.operatorId} has no positive proof words`);
  }

  if (profile.negativeControlWords.length === 0) {
    fail(`${profile.operatorId} has no negative control words`);
  }
}

export function buildCanonicalOperatorLiveSmokeCasesV0_1(): readonly CanonicalOperatorLiveSmokeCaseV0_1[] {
  const resolvedProfiles = getResolvedCanonicalOperatorProfilesV0_1();

  if (resolvedProfiles.length !== canonicalOperatorProfilesV0_1.length) {
    fail(
      `resolved ${resolvedProfiles.length} of ${canonicalOperatorProfilesV0_1.length} profiles`,
    );
  }

  return resolvedProfiles.flatMap(
    ({
      profile,
      readiness,
      authorization,
      productionMember,
      runtimeProjection,
    }) => {
      assertRuntimeMatureProfile(profile);

      if (!readiness.functionalReady) {
        fail(`${profile.operatorId} is not functionally ready`);
      }

      if (!authorization.authorized) {
        fail(`${profile.operatorId} is not machine authorized`);
      }

      if (
        authorization.authorizationScope !== profile.authorizationScope
      ) {
        fail(`${profile.operatorId} authorization scope does not match profile`);
      }

      if (!productionMember) {
        fail(`${profile.operatorId} is not an explicit production member`);
      }

      if (!runtimeProjection) {
        fail(`${profile.operatorId} has no runtime projection`);
      }

      if (runtimeProjection.sourceId !== profile.sourceId) {
        fail(`${profile.operatorId} runtime projection source mismatch`);
      }

      if (runtimeProjection.embryo !== profile.embryo) {
        fail(`${profile.operatorId} runtime projection embryo mismatch`);
      }

      if (!runtimeProjection.evidenceText.trim()) {
        fail(`${profile.operatorId} runtime projection has empty evidence text`);
      }

      const positiveCases = profile.positiveProofWords.map((word) => ({
        operatorId: profile.operatorId,
        embryo: profile.embryo,
        sourceId: profile.sourceId,
        word,
        expectation: "evidence_present" as const,
        evidenceText: runtimeProjection.evidenceText,
      }));

      const negativeCases = profile.negativeControlWords.map((word) => ({
        operatorId: profile.operatorId,
        embryo: profile.embryo,
        sourceId: profile.sourceId,
        word,
        expectation: "evidence_absent" as const,
        evidenceText: runtimeProjection.evidenceText,
      }));

      return [...positiveCases, ...negativeCases];
    },
  );
}

export function getCanonicalOperatorLiveSmokeWordsV0_1(): readonly string[] {
  return [
    ...new Set(
      buildCanonicalOperatorLiveSmokeCasesV0_1().map((smokeCase) =>
        smokeCase.word.trim(),
      ),
    ),
  ];
}
