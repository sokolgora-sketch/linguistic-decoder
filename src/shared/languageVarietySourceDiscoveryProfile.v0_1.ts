import {
  getCanonicalOperatorProfileV0_1,
  resolveCanonicalOperatorProfileV0_1,
} from "./canonicalOperatorProfile.v0_1";

export const LANGUAGE_VARIETY_SOURCE_DISCOVERY_PROFILE_VERSION_V0_1 =
  "language-variety-source-discovery-profile.v0_1" as const;

export type LanguageVarietySourceDiscoveryVarietyScopeV0_1 =
  | {
      status: "reviewed_specific";
      code: "gheg";
      label: "Northwestern Gheg Albanian";
      evidenceBasis:
        "reviewed_source_row_citation_metadata";
    }
  | {
      status: "not_source_specific";
      code: null;
      label: null;
      evidenceBasis: "not_claimed";
    };

export type LanguageVarietySourceDiscoveryProfileV0_1 = {
  profileVersion:
    typeof LANGUAGE_VARIETY_SOURCE_DISCOVERY_PROFILE_VERSION_V0_1;
  profileId: string;
  operatorId: string;
  embryo: string;
  sourceId: string;
  language: {
    code: string;
    label: string;
  };
  varietyScope:
    LanguageVarietySourceDiscoveryVarietyScopeV0_1;
  sourceAuthority: {
    status: "reviewed_registered_source";
    sourceKind: string;
    sourceStatus: "reviewed_accepted";
    citationType: string;
    sourceTitle: string;
    sourceDateOrVersion: string;
    sourceUrlOrArchiveRef: string;
    entryLocator: string;
    sourceHashOrArchiveHash: string;
    attestedForm: string;
    attestedGloss: string;
  };
  sourceDiscoveryPolicy: {
    sourceSelection:
      "canonical_profile_source_id_only";
    requiresCanonicalProfileResolution: true;
    requiresReviewedAcceptedSourceRow: true;
    requiresFunctionalReadiness: true;
    requiresMachineAuthorization: true;
    requiresProductionMembership: true;
    requiresRuntimeProjection: true;
    requiresReviewedCitation: true;
    requiresFinalizedLocator: true;
    requiresSourceHash: true;
    varietyInferenceAuthorized: false;
    networkDiscoveryAuthorized: false;
    externalSearchAuthorized: false;
    failClosedOnMismatch: true;
    nullIsValid: true;
  };
  runtimeWiringStatus: "profile_only_not_wired";
  claimBoundary: {
    historicalOriginClaim: "not_claimed";
    historicalTransmissionClaim: "not_claimed";
    winnerClaim: "not_claimed";
    languageSuperiorityClaim: "not_claimed";
    candidateTruthClaim: "not_claimed";
    userDecisionPosture: "user_decides";
  };
};

type LanguageVarietySourceDiscoveryBindingV0_1 = {
  operatorId: "DA" | "DI";
  languageCode: "sq";
  languageLabel: "Albanian";
  varietyScope:
    LanguageVarietySourceDiscoveryVarietyScopeV0_1;
};

export const languageVarietySourceDiscoveryBindingsV0_1 = [
  {
    operatorId: "DA",
    languageCode: "sq",
    languageLabel: "Albanian",
    varietyScope: {
      status: "reviewed_specific",
      code: "gheg",
      label: "Northwestern Gheg Albanian",
      evidenceBasis:
        "reviewed_source_row_citation_metadata",
    },
  },
  {
    operatorId: "DI",
    languageCode: "sq",
    languageLabel: "Albanian",
    varietyScope: {
      status: "not_source_specific",
      code: null,
      label: null,
      evidenceBasis: "not_claimed",
    },
  },
] as const satisfies readonly LanguageVarietySourceDiscoveryBindingV0_1[];

function requiredTextV0_1(
  value: unknown,
): string | null {
  const normalized = String(value ?? "").trim();
  return normalized.length > 0 ? normalized : null;
}

export function resolveLanguageVarietySourceDiscoveryProfileV0_1(
  operatorId: string,
): LanguageVarietySourceDiscoveryProfileV0_1 | null {
  const normalizedOperatorId =
    operatorId.trim().toLocaleUpperCase("en-US");

  const binding =
    languageVarietySourceDiscoveryBindingsV0_1.find(
      (candidate) =>
        candidate.operatorId === normalizedOperatorId,
    );

  if (!binding) return null;

  const canonicalProfile =
    getCanonicalOperatorProfileV0_1(
      normalizedOperatorId,
    );

  if (!canonicalProfile) return null;

  if (
    canonicalProfile.language !==
    binding.languageCode
  ) {
    return null;
  }

  const resolved =
    resolveCanonicalOperatorProfileV0_1(
      canonicalProfile,
    );

  if (!resolved) return null;

  if (
    !resolved.readiness.functionalReady ||
    !resolved.authorization.authorized ||
    !resolved.productionMember ||
    !resolved.runtimeProjection
  ) {
    return null;
  }

  const sourceRow = resolved.sourceRow;

  if (
    sourceRow.sourceId !==
      canonicalProfile.sourceId ||
    sourceRow.candidateLanguage !==
      binding.languageCode ||
    sourceRow.sourceStatus !==
      "reviewed_accepted"
  ) {
    return null;
  }

  const citation =
    sourceRow.externalCitations.find(
      (candidate) =>
        candidate.citationStatus ===
        "reviewed_accepted",
    );

  if (!citation) return null;

  const sourceTitle =
    requiredTextV0_1(citation.sourceTitle);
  const sourceDateOrVersion =
    requiredTextV0_1(
      citation.sourceDateOrVersion,
    );
  const sourceUrlOrArchiveRef =
    requiredTextV0_1(
      citation.sourceUrlOrArchiveRef,
    );
  const entryLocator =
    requiredTextV0_1(citation.entryLocator);
  const sourceHashOrArchiveHash =
    requiredTextV0_1(
      citation.sourceHashOrArchiveHash,
    );
  const attestedForm =
    requiredTextV0_1(citation.attestedForm);
  const attestedGloss =
    requiredTextV0_1(citation.attestedGloss);

  if (
    !sourceTitle ||
    !sourceDateOrVersion ||
    !sourceUrlOrArchiveRef ||
    !entryLocator ||
    !sourceHashOrArchiveHash ||
    !attestedForm ||
    !attestedGloss
  ) {
    return null;
  }

  return {
    profileVersion:
      LANGUAGE_VARIETY_SOURCE_DISCOVERY_PROFILE_VERSION_V0_1,
    profileId:
      `language-variety-source-discovery.${canonicalProfile.operatorId.toLocaleLowerCase("en-US")}.v0_1`,
    operatorId: canonicalProfile.operatorId,
    embryo: canonicalProfile.embryo,
    sourceId: canonicalProfile.sourceId,
    language: {
      code: binding.languageCode,
      label: binding.languageLabel,
    },
    varietyScope: binding.varietyScope,
    sourceAuthority: {
      status: "reviewed_registered_source",
      sourceKind: sourceRow.sourceKind,
      sourceStatus: "reviewed_accepted",
      citationType: citation.citationType,
      sourceTitle,
      sourceDateOrVersion,
      sourceUrlOrArchiveRef,
      entryLocator,
      sourceHashOrArchiveHash,
      attestedForm,
      attestedGloss,
    },
    sourceDiscoveryPolicy: {
      sourceSelection:
        "canonical_profile_source_id_only",
      requiresCanonicalProfileResolution: true,
      requiresReviewedAcceptedSourceRow: true,
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
    },
    runtimeWiringStatus:
      "profile_only_not_wired",
    claimBoundary: {
      historicalOriginClaim: "not_claimed",
      historicalTransmissionClaim:
        "not_claimed",
      winnerClaim: "not_claimed",
      languageSuperiorityClaim:
        "not_claimed",
      candidateTruthClaim: "not_claimed",
      userDecisionPosture: "user_decides",
    },
  };
}

export function getResolvedLanguageVarietySourceDiscoveryProfilesV0_1(): readonly LanguageVarietySourceDiscoveryProfileV0_1[] {
  return languageVarietySourceDiscoveryBindingsV0_1.flatMap(
    (binding) => {
      const resolved =
        resolveLanguageVarietySourceDiscoveryProfileV0_1(
          binding.operatorId,
        );

      return resolved ? [resolved] : [];
    },
  );
}
