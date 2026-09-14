import type {
  SemanticAlignmentAssessmentV0_1,
} from "@/shared/openInstrument/semanticAlignment.v0_1";
import type {
  StructuralHypothesisV0_1,
} from "@/shared/structuralHypothesisDiscovery.v0_1";

export const DETERMINISTIC_FUNCTIONAL_DISCOVERY_ACCEPTANCE_SCHEMA_V0_1 =
  "open-instrument.deterministic-functional-discovery-acceptance.v0_1" as const;

export type FunctionalDiscoveryAcceptanceDecisionV0_1 =
  | "ACCEPT"
  | "REJECT"
  | "INSUFFICIENT_SUPPORT";

export type FunctionalDiscoveryAcceptanceReasonCodeV0_1 =
  | "CANDIDATE_ID_MISSING"
  | "TARGET_WORD_REQUIRED"
  | "MISSING_STRUCTURAL_ANCHOR"
  | "INVALID_STRUCTURAL_DERIVATION"
  | "MISSING_FUNCTIONAL_STATEMENT"
  | "MISSING_FUNCTIONAL_COMPONENTS"
  | "INVALID_FUNCTIONAL_COMPONENT"
  | "INVALID_COMPONENT_OWNERSHIP"
  | "MISSING_COMPONENT_ROLE"
  | "MISSING_TARGET_SENSE_WHEN_REQUIRED"
  | "FUNCTIONAL_STATEMENT_NOT_BOUND_TO_TARGET_SENSE"
  | "MISSING_SEMANTIC_BRIDGE"
  | "UNSUPPORTED_SEMANTIC_BRIDGE"
  | "RESEARCH_EVIDENCE_NOT_PRODUCTION_AUTHORITY"
  | "REVIEWED_EVIDENCE_REQUIRED_FOR_PRODUCTION"
  | "CLAIM_BOUNDARY_MISSING"
  | "USER_DECIDES_MISSING"
  | "SINGLE_WINNER_POSTURE_FORBIDDEN"
  | "PROVIDER_OUTPUT_NOT_AUTHORIZED"
  | "PROPOSAL_PROVENANCE_MISSING"
  | "PROPOSAL_PROVENANCE_UNSUPPORTED"
  | "TARGET_SENSE_REQUIREMENT_UNSUPPORTED"
  | "COMPONENT_REQUIREMENT_UNSUPPORTED"
  | "EVIDENCE_STATE_UNSUPPORTED"
  | "INSUFFICIENT_FUNCTIONAL_SUPPORT";

export type FunctionalDiscoveryTargetSenseRequirementV0_1 =
  | "REQUIRED"
  | "OPTIONAL"
  | "NOT_APPLICABLE";

export type FunctionalDiscoveryProposalProvenanceKindV0_1 =
  | "deterministic_static"
  | "research_catalog"
  | "reviewed_external_evidence"
  | "provider_proposed_hypothesis"
  | "user_asserted_hypothesis";

export type FunctionalDiscoveryProviderAuthorizationV0_1 =
  | "not_applicable"
  | "research_only"
  | "reviewed_production"
  | "unauthorized";

export type FunctionalDiscoveryEvidenceStateV0_1 =
  | "structural_hypothesis"
  | "logic_derived_candidate"
  | "research_candidate"
  | "reviewed_accepted"
  | "unresolved"
  | "not_emitted";

export type FunctionalDiscoveryClaimBoundaryV0_1 = Readonly<{
  historicalOriginClaim: "not_claimed";
  historicalTransmissionClaim: "not_claimed";
  winnerClaim: "not_claimed";
  languageSuperiorityClaim: "not_claimed";
  candidateTruthClaim: "not_claimed";
}>;

export type FunctionalDiscoveryComponentInputV0_1 = Readonly<{
  candidateId: string;
  embryo: string;
  language?: string | null;
  plainMeaning: string;
  role: string;
  evidenceState: string;
  evidenceRefs?: readonly string[];
}>;

export type FunctionalDiscoveryAcceptanceInputV0_1 = Readonly<{
  candidateId: string;
  targetWord: string;
  structuralHypothesis: StructuralHypothesisV0_1 | null;
  targetSenseRequirement: FunctionalDiscoveryTargetSenseRequirementV0_1;
  targetSense?: Readonly<{
    id: string;
    label: string;
  }> | null;
  functionalStatement?: string | null;
  functionalComponents?: readonly FunctionalDiscoveryComponentInputV0_1[];
  componentRequirement?: "required" | "not_applicable";
  semanticAlignment?: SemanticAlignmentAssessmentV0_1 | null;
  semanticBridge?: string | null;
  evidenceState: FunctionalDiscoveryEvidenceStateV0_1;
  evidenceRefs?: readonly string[];
  claimBoundary?: FunctionalDiscoveryClaimBoundaryV0_1 | null;
  userDecisionPosture?: string | null;
  noSingleWinner?: boolean;
  proposalProvenance?: Readonly<{
    kind: FunctionalDiscoveryProposalProvenanceKindV0_1;
    sourceId?: string | null;
    providerId?: string | null;
    modelId?: string | null;
    providerAuthorization?: FunctionalDiscoveryProviderAuthorizationV0_1;
  }> | null;
  reviewedAuthorization?: Readonly<{
    authorized: boolean;
    sourceStatus?: string | null;
    reasons?: readonly string[];
  }> | null;
}>;

export type FunctionalDiscoveryAcceptedCandidateV0_1 = Readonly<{
  candidateId: string;
  targetWord: string;
  structuralHypothesisId: string;
  embryo: string;
  functionalStatement: string;
  functionalComponents: readonly FunctionalDiscoveryComponentInputV0_1[];
  admissionScope:
    | "candidate_only"
    | "research_hypothesis_only"
    | "reviewed_functional_evidence";
  evidenceState: FunctionalDiscoveryEvidenceStateV0_1;
  targetSense?: Readonly<{
    id: string;
    label: string;
  }>;
  semanticBridge: string;
  evidenceRefs: readonly string[];
  proposalProvenance: Readonly<{
    kind: FunctionalDiscoveryProposalProvenanceKindV0_1;
    sourceId?: string;
    providerId?: string;
    modelId?: string;
  }>;
  claimBoundary: FunctionalDiscoveryClaimBoundaryV0_1;
  userDecisionPosture: "user_decides";
  noSingleWinner: true;
}>;

export type FunctionalDiscoveryAcceptanceFailureV0_1 = Readonly<{
  code: FunctionalDiscoveryAcceptanceReasonCodeV0_1;
  field: string;
}>;

export type FunctionalDiscoveryAcceptanceResultV0_1 = Readonly<{
  schemaVersion:
    typeof DETERMINISTIC_FUNCTIONAL_DISCOVERY_ACCEPTANCE_SCHEMA_V0_1;
  decision: FunctionalDiscoveryAcceptanceDecisionV0_1;
  reasonCodes: readonly FunctionalDiscoveryAcceptanceReasonCodeV0_1[];
  acceptedFunctionalCandidate?: FunctionalDiscoveryAcceptedCandidateV0_1;
  failures: readonly FunctionalDiscoveryAcceptanceFailureV0_1[];
}>;

type UnknownRecordV0_1 = Record<string, unknown>;

function isRecordV0_1(value: unknown): value is UnknownRecordV0_1 {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function textV0_1(value: unknown): string {
  return typeof value === "string" ? value.normalize("NFKC").trim() : "";
}

function sortedUniqueV0_1(
  values: readonly FunctionalDiscoveryAcceptanceReasonCodeV0_1[],
): FunctionalDiscoveryAcceptanceReasonCodeV0_1[] {
  return [...new Set(values)].sort();
}

function failureV0_1(
  code: FunctionalDiscoveryAcceptanceReasonCodeV0_1,
  field: string,
): FunctionalDiscoveryAcceptanceFailureV0_1 {
  return { code, field };
}

function structuralAnchorValidV0_1(
  value: unknown,
): value is StructuralHypothesisV0_1 {
  if (!isRecordV0_1(value)) return false;

  const reductionSteps = value.reductionSteps;
  const expansionChain = value.expansionChain;
  const terminalStep = Array.isArray(reductionSteps)
    ? reductionSteps[reductionSteps.length - 1]
    : null;
  const authorizedOperationIds = new Set([
    "peel_right_vowel_led_expansion",
    "peel_right_consonant_led_expansion",
    "peel_left_consonant_frame",
  ]);
  const reductionStepsValid =
    Array.isArray(reductionSteps) &&
    reductionSteps.length > 0 &&
    reductionSteps.every(
      (step) =>
        isRecordV0_1(step) &&
        textV0_1(step.operationId).length > 0 &&
        authorizedOperationIds.has(textV0_1(step.operationId)) &&
        Array.isArray(step.voicePathBefore) &&
        Array.isArray(step.voicePathAfter),
    );

  return (
    value.hypothesisVersion === "z-zero.structural-hypothesis.v0_1" &&
    value.discoveryStatus === "structural_hypothesis" &&
    textV0_1(value.hypothesisId).length > 0 &&
    textV0_1(value.embryo).length > 0 &&
    typeof value.embryoSize === "number" &&
    Number.isInteger(value.embryoSize) &&
    value.embryoSize > 0 &&
    reductionStepsValid &&
    Array.isArray(expansionChain) &&
    expansionChain.length >= 2 &&
    isRecordV0_1(terminalStep) &&
    Array.isArray(terminalStep.voicePathAfter) &&
    terminalStep.voicePathAfter.length > 0 &&
    value.historicalOriginClaim === "not_claimed" &&
    value.historicalTransmissionClaim === "not_claimed" &&
    value.winnerClaim === "not_claimed" &&
    value.languageSuperiorityClaim === "not_claimed" &&
    value.candidateTruthClaim === "not_claimed" &&
    value.userDecisionPosture === "user_decides"
  );
}

function claimBoundaryValidV0_1(
  value: unknown,
): value is FunctionalDiscoveryClaimBoundaryV0_1 {
  if (!isRecordV0_1(value)) return false;

  return (
    value.historicalOriginClaim === "not_claimed" &&
    value.historicalTransmissionClaim === "not_claimed" &&
    value.winnerClaim === "not_claimed" &&
    value.languageSuperiorityClaim === "not_claimed" &&
    value.candidateTruthClaim === "not_claimed"
  );
}

function componentListV0_1(
  input: FunctionalDiscoveryAcceptanceInputV0_1,
  failures: FunctionalDiscoveryAcceptanceFailureV0_1[],
): FunctionalDiscoveryComponentInputV0_1[] {
  const components = input.functionalComponents ?? [];

  if (
    input.componentRequirement !== "not_applicable" &&
    components.length === 0
  ) {
    failures.push(
      failureV0_1(
        "MISSING_FUNCTIONAL_COMPONENTS",
        "functionalComponents",
      ),
    );
  }

  for (const [index, component] of components.entries()) {
    if (component.candidateId !== input.candidateId) {
      failures.push(
        failureV0_1(
          "INVALID_COMPONENT_OWNERSHIP",
          `functionalComponents[${index}].candidateId`,
        ),
      );
    }
    if (!textV0_1(component.embryo) || !textV0_1(component.plainMeaning)) {
      failures.push(
        failureV0_1(
          "INVALID_FUNCTIONAL_COMPONENT",
          `functionalComponents[${index}]`,
        ),
      );
    }
    if (!textV0_1(component.role)) {
      failures.push(
        failureV0_1(
          "MISSING_COMPONENT_ROLE",
          `functionalComponents[${index}].role`,
        ),
      );
    }
    if (!textV0_1(component.evidenceState)) {
      failures.push(
        failureV0_1(
          "INVALID_FUNCTIONAL_COMPONENT",
          `functionalComponents[${index}].evidenceState`,
        ),
      );
    }
  }

  return components.map((component) => ({
    ...component,
    candidateId: textV0_1(component.candidateId),
    embryo: textV0_1(component.embryo),
    ...(component.language != null
      ? { language: textV0_1(component.language) }
      : {}),
    plainMeaning: textV0_1(component.plainMeaning),
    role: textV0_1(component.role),
    evidenceState: textV0_1(component.evidenceState),
    ...(component.evidenceRefs
      ? { evidenceRefs: component.evidenceRefs.map(textV0_1) }
      : {}),
  }));
}

function semanticBridgeV0_1(
  input: FunctionalDiscoveryAcceptanceInputV0_1,
): string {
  return textV0_1(
    input.semanticBridge ?? input.semanticAlignment?.semanticBridge,
  );
}

function admissionScopeV0_1(
  input: FunctionalDiscoveryAcceptanceInputV0_1,
): FunctionalDiscoveryAcceptedCandidateV0_1["admissionScope"] {
  if (input.evidenceState === "reviewed_accepted") {
    return "reviewed_functional_evidence";
  }
  if (input.evidenceState === "research_candidate") {
    return "research_hypothesis_only";
  }
  return "candidate_only";
}

function baseResultV0_1(
  decision: FunctionalDiscoveryAcceptanceDecisionV0_1,
  reasonCodes: readonly FunctionalDiscoveryAcceptanceReasonCodeV0_1[],
  failures: readonly FunctionalDiscoveryAcceptanceFailureV0_1[],
): FunctionalDiscoveryAcceptanceResultV0_1 {
  return {
    schemaVersion:
      DETERMINISTIC_FUNCTIONAL_DISCOVERY_ACCEPTANCE_SCHEMA_V0_1,
    decision,
    reasonCodes: sortedUniqueV0_1(reasonCodes),
    failures: [...failures].sort((left, right) =>
      `${left.code}:${left.field}`.localeCompare(
        `${right.code}:${right.field}`,
      ),
    ),
  };
}

export function evaluateDeterministicFunctionalDiscoveryAcceptanceV0_1(
  input: FunctionalDiscoveryAcceptanceInputV0_1,
): FunctionalDiscoveryAcceptanceResultV0_1 {
  const failures: FunctionalDiscoveryAcceptanceFailureV0_1[] = [];
  const reasons: FunctionalDiscoveryAcceptanceReasonCodeV0_1[] = [];
  const candidateId = textV0_1(input?.candidateId);
  const targetWord = textV0_1(input?.targetWord);
  const structural = input?.structuralHypothesis;
  const statement = textV0_1(input?.functionalStatement);
  const bridge = semanticBridgeV0_1(input);
  const provenance = input?.proposalProvenance;
  const targetSense = input?.targetSense;
  const validTargetSenseRequirements = new Set([
    "REQUIRED",
    "OPTIONAL",
    "NOT_APPLICABLE",
  ]);
  const validComponentRequirements = new Set([
    "required",
    "not_applicable",
  ]);

  if (!candidateId) {
    failures.push(failureV0_1("CANDIDATE_ID_MISSING", "candidateId"));
  }
  if (!targetWord) {
    failures.push(failureV0_1("TARGET_WORD_REQUIRED", "targetWord"));
  }
  if (!structural) {
    failures.push(
      failureV0_1("MISSING_STRUCTURAL_ANCHOR", "structuralHypothesis"),
    );
  } else if (!structuralAnchorValidV0_1(structural)) {
    failures.push(
      failureV0_1(
        "INVALID_STRUCTURAL_DERIVATION",
        "structuralHypothesis",
      ),
    );
  }

  if (!statement) {
    failures.push(
      failureV0_1("MISSING_FUNCTIONAL_STATEMENT", "functionalStatement"),
    );
  }

  const components = componentListV0_1(input, failures);

  if (!validTargetSenseRequirements.has(input.targetSenseRequirement)) {
    failures.push(
      failureV0_1(
        "TARGET_SENSE_REQUIREMENT_UNSUPPORTED",
        "targetSenseRequirement",
      ),
    );
  }
  if (
    input.componentRequirement !== undefined &&
    !validComponentRequirements.has(input.componentRequirement)
  ) {
    failures.push(
      failureV0_1(
        "COMPONENT_REQUIREMENT_UNSUPPORTED",
        "componentRequirement",
      ),
    );
  }

  if (!claimBoundaryValidV0_1(input.claimBoundary)) {
    failures.push(
      failureV0_1("CLAIM_BOUNDARY_MISSING", "claimBoundary"),
    );
  }
  if (input.userDecisionPosture !== "user_decides") {
    failures.push(
      failureV0_1("USER_DECIDES_MISSING", "userDecisionPosture"),
    );
  }
  if (input.noSingleWinner !== true) {
    failures.push(
      failureV0_1(
        "SINGLE_WINNER_POSTURE_FORBIDDEN",
        "noSingleWinner",
      ),
    );
  }

  const hasProposalSignal = Boolean(
    structural ||
      statement ||
      components.length > 0 ||
      input.semanticAlignment ||
      bridge,
  );

  if (!provenance && hasProposalSignal) {
    failures.push(
      failureV0_1("PROPOSAL_PROVENANCE_MISSING", "proposalProvenance"),
    );
  }
  if (
    provenance &&
    ![
      "deterministic_static",
      "research_catalog",
      "reviewed_external_evidence",
      "provider_proposed_hypothesis",
      "user_asserted_hypothesis",
    ].includes(provenance.kind)
  ) {
    failures.push(
      failureV0_1(
        "PROPOSAL_PROVENANCE_UNSUPPORTED",
        "proposalProvenance.kind",
      ),
    );
  }
  if (
    provenance?.kind === "provider_proposed_hypothesis" &&
    (provenance.providerAuthorization !== "research_only" &&
      provenance.providerAuthorization !== "reviewed_production" ||
      !textV0_1(provenance.providerId) ||
      !textV0_1(provenance.modelId))
  ) {
    failures.push(
      failureV0_1(
        "PROVIDER_OUTPUT_NOT_AUTHORIZED",
        "proposalProvenance",
      ),
    );
  }

  if (input.targetSenseRequirement === "REQUIRED") {
    if (!textV0_1(targetSense?.id) || !textV0_1(targetSense?.label)) {
      failures.push(
        failureV0_1(
          "MISSING_TARGET_SENSE_WHEN_REQUIRED",
          "targetSense",
        ),
      );
    }
    if (!input.semanticAlignment) {
      failures.push(
        failureV0_1(
          "FUNCTIONAL_STATEMENT_NOT_BOUND_TO_TARGET_SENSE",
          "semanticAlignment",
        ),
      );
    }
  }

  const alignment = input.semanticAlignment;
  if (alignment) {
    const alignmentMatches =
      alignment.alignmentStatus === "proposed" &&
      alignment.alignmentSource !== "deterministic_no_alignment" &&
      alignment.targetWord === targetWord &&
      alignment.targetSenseId === textV0_1(targetSense?.id) &&
      alignment.targetSenseLabel === textV0_1(targetSense?.label) &&
      structural != null &&
      alignment.structuralHypothesisId === structural.hypothesisId &&
      textV0_1(alignment.semanticBridge).length > 0;

    if (!alignmentMatches) {
      failures.push(
        failureV0_1(
          "UNSUPPORTED_SEMANTIC_BRIDGE",
          "semanticAlignment",
        ),
      );
    }
  }

  if (!bridge) {
    failures.push(
      failureV0_1("MISSING_SEMANTIC_BRIDGE", "semanticBridge"),
    );
  }

  if (
    ![
      "structural_hypothesis",
      "logic_derived_candidate",
      "research_candidate",
      "reviewed_accepted",
      "unresolved",
      "not_emitted",
    ].includes(input.evidenceState)
  ) {
    failures.push(
      failureV0_1("EVIDENCE_STATE_UNSUPPORTED", "evidenceState"),
    );
  }

  if (input.evidenceState === "reviewed_accepted") {
    const reviewed = input.reviewedAuthorization;
    if (
      !reviewed?.authorized ||
      reviewed.sourceStatus !== "reviewed_accepted" ||
      (input.evidenceRefs ?? []).length === 0 ||
      (provenance?.kind !== "reviewed_external_evidence" &&
        provenance?.kind !== "provider_proposed_hypothesis")
    ) {
      failures.push(
        failureV0_1(
          "REVIEWED_EVIDENCE_REQUIRED_FOR_PRODUCTION",
          "reviewedAuthorization",
        ),
      );
    }
  }

  if (
    input.evidenceState === "unresolved" ||
    input.evidenceState === "not_emitted"
  ) {
    failures.push(
      failureV0_1(
        "INSUFFICIENT_FUNCTIONAL_SUPPORT",
        "evidenceState",
      ),
    );
  }

  if (input.evidenceState === "research_candidate") {
    reasons.push("RESEARCH_EVIDENCE_NOT_PRODUCTION_AUTHORITY");
  }

  if (failures.some((failure) => failure.code === "PROVIDER_OUTPUT_NOT_AUTHORIZED")) {
    reasons.push("PROVIDER_OUTPUT_NOT_AUTHORIZED");
  }

  const normalizedFailures = [...failures].sort((left, right) =>
    `${left.code}:${left.field}`.localeCompare(
      `${right.code}:${right.field}`,
    ),
  );

  if (normalizedFailures.length > 0) {
    const hardBoundaryFailure = normalizedFailures.some((failure) =>
      [
        "CANDIDATE_ID_MISSING",
        "TARGET_WORD_REQUIRED",
        "INVALID_STRUCTURAL_DERIVATION",
        "INVALID_FUNCTIONAL_COMPONENT",
        "INVALID_COMPONENT_OWNERSHIP",
        "MISSING_COMPONENT_ROLE",
        "MISSING_TARGET_SENSE_WHEN_REQUIRED",
        "UNSUPPORTED_SEMANTIC_BRIDGE",
        "CLAIM_BOUNDARY_MISSING",
        "USER_DECIDES_MISSING",
        "SINGLE_WINNER_POSTURE_FORBIDDEN",
        "PROVIDER_OUTPUT_NOT_AUTHORIZED",
        "PROPOSAL_PROVENANCE_MISSING",
        "PROPOSAL_PROVENANCE_UNSUPPORTED",
        "TARGET_SENSE_REQUIREMENT_UNSUPPORTED",
        "COMPONENT_REQUIREMENT_UNSUPPORTED",
        "EVIDENCE_STATE_UNSUPPORTED",
        "REVIEWED_EVIDENCE_REQUIRED_FOR_PRODUCTION",
      ].includes(failure.code),
    );

    return baseResultV0_1(
      hardBoundaryFailure ? "REJECT" : "INSUFFICIENT_SUPPORT",
      normalizedFailures.map((failure) => failure.code),
      normalizedFailures,
    );
  }

  if (!structural) {
    return baseResultV0_1(
      "INSUFFICIENT_SUPPORT",
      ["MISSING_STRUCTURAL_ANCHOR"],
      [failureV0_1("MISSING_STRUCTURAL_ANCHOR", "structuralHypothesis")],
    );
  }

  const acceptedFunctionalCandidate: FunctionalDiscoveryAcceptedCandidateV0_1 = {
    candidateId,
    targetWord,
    structuralHypothesisId: structural.hypothesisId,
    embryo: structural.embryo,
    functionalStatement: statement,
    functionalComponents: components,
    admissionScope: admissionScopeV0_1(input),
    evidenceState: input.evidenceState,
    ...(input.targetSenseRequirement !== "NOT_APPLICABLE" && targetSense
      ? {
          targetSense: {
            id: textV0_1(targetSense.id),
            label: textV0_1(targetSense.label),
          },
        }
      : {}),
    semanticBridge: bridge,
    evidenceRefs: [...(input.evidenceRefs ?? [])],
    proposalProvenance: {
      kind: provenance?.kind as FunctionalDiscoveryProposalProvenanceKindV0_1,
      ...(provenance?.sourceId
        ? { sourceId: textV0_1(provenance.sourceId) }
        : {}),
      ...(provenance?.providerId
        ? { providerId: textV0_1(provenance.providerId) }
        : {}),
      ...(provenance?.modelId
        ? { modelId: textV0_1(provenance.modelId) }
        : {}),
    },
    claimBoundary: input.claimBoundary as FunctionalDiscoveryClaimBoundaryV0_1,
    userDecisionPosture: "user_decides",
    noSingleWinner: true,
  };

  return {
    ...baseResultV0_1("ACCEPT", reasons, []),
    acceptedFunctionalCandidate,
  };
}
