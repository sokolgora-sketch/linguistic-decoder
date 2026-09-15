import type {
  MultiSourceFunctionalWitnessV0_1,
  MultiSourceTruthStatusV0_1,
} from "../multiSourceFunctionalDiscovery.v0_1";
import {
  evaluateSourceAttestedFunctionalDiscoveryAcceptanceV0_1,
  type FunctionalDiscoveryAcceptanceResultV0_1,
  type FunctionalDiscoverySourceAttestedAcceptanceInputV0_1,
} from "./deterministicFunctionalDiscoveryAcceptance.v0_1";

export const DETERMINISTIC_SOURCE_ATTESTED_RESEARCH_WITNESS_FUNCTIONAL_PROPOSAL_SCHEMA_V1 =
  "open-instrument.deterministic-source-attested-research-witness-functional-proposal.v1" as const;

export type DeterministicSourceAttestedResearchWitnessFunctionalProposalReasonCodeV1 =
  | "SOURCE_ATTESTED_WITNESS_ID_REQUIRED"
  | "SOURCE_ATTESTED_SOURCE_ID_REQUIRED"
  | "SOURCE_ATTESTED_EVIDENCE_REFS_REQUIRED"
  | "SOURCE_ATTESTED_MUST_REMAIN_RESEARCH"
  | "SOURCE_ATTESTED_EMBRYO_AUTHORITY_REQUIRED"
  | "SOURCE_ATTESTED_EXACT_FORM_REQUIRED"
  | "SOURCE_ATTESTED_TARGET_WORD_MISMATCH"
  | "SOURCE_ATTESTED_EMBRYO_FORM_MISMATCH"
  | "SOURCE_ATTESTED_EXPECTED_TARGET_WORD_REQUIRED"
  | "SOURCE_ATTESTED_ATTESTATION_TRUTH_SUPPORT_REQUIRED"
  | "SOURCE_ATTESTED_FUNCTIONAL_BRIDGE_TRUTH_SUPPORT_REQUIRED";

export type DeterministicSourceAttestedResearchWitnessFunctionalProposalResultV1 =
  Readonly<{
    schemaVersion:
      typeof DETERMINISTIC_SOURCE_ATTESTED_RESEARCH_WITNESS_FUNCTIONAL_PROPOSAL_SCHEMA_V1;
    decision: FunctionalDiscoveryAcceptanceResultV0_1["decision"];
    reasonCodes: readonly string[];
    proposal: FunctionalDiscoverySourceAttestedAcceptanceInputV0_1 | null;
    acceptance: FunctionalDiscoveryAcceptanceResultV0_1 | null;
  }>;

const CLAIM_BOUNDARY_V1 = {
  historicalOriginClaim: "not_claimed",
  historicalTransmissionClaim: "not_claimed",
  winnerClaim: "not_claimed",
  languageSuperiorityClaim: "not_claimed",
  candidateTruthClaim: "not_claimed",
} as const;

function normalizedTextV1(value: unknown): string {
  return String(value ?? "").normalize("NFC").trim();
}

function sameResearchKeyV1(left: unknown, right: unknown): boolean {
  return (
    normalizedTextV1(left).toLocaleUpperCase("en-US") ===
    normalizedTextV1(right).toLocaleUpperCase("en-US")
  );
}

function hasUsableResearchTruthV1(
  value: MultiSourceTruthStatusV0_1,
): boolean {
  return value === "fact" || value === "inference" || value === "hypothesis";
}

function rejectedV1(
  reasonCodes: readonly DeterministicSourceAttestedResearchWitnessFunctionalProposalReasonCodeV1[],
): DeterministicSourceAttestedResearchWitnessFunctionalProposalResultV1 {
  return {
    schemaVersion:
      DETERMINISTIC_SOURCE_ATTESTED_RESEARCH_WITNESS_FUNCTIONAL_PROPOSAL_SCHEMA_V1,
    decision: "REJECT",
    reasonCodes: [...new Set(reasonCodes)].sort(),
    proposal: null,
    acceptance: null,
  };
}

function insufficientSupportV1(
  reasonCodes: readonly DeterministicSourceAttestedResearchWitnessFunctionalProposalReasonCodeV1[],
): DeterministicSourceAttestedResearchWitnessFunctionalProposalResultV1 {
  return {
    schemaVersion:
      DETERMINISTIC_SOURCE_ATTESTED_RESEARCH_WITNESS_FUNCTIONAL_PROPOSAL_SCHEMA_V1,
    decision: "INSUFFICIENT_SUPPORT",
    reasonCodes: [...new Set(reasonCodes)].sort(),
    proposal: null,
    acceptance: null,
  };
}

export function buildDeterministicSourceAttestedResearchWitnessFunctionalProposalV1(
  input: Readonly<{
    witness: MultiSourceFunctionalWitnessV0_1;
    targetWord: string;
  }>,
): DeterministicSourceAttestedResearchWitnessFunctionalProposalResultV1 {
  const witness = input.witness;
  const witnessId = normalizedTextV1(witness.witnessId);
  const sourceId = normalizedTextV1(witness.sourceId);
  const targetWord = normalizedTextV1(input.targetWord);
  const witnessTargetWord = normalizedTextV1(witness.targetWord);
  const embryo = normalizedTextV1(witness.embryo);
  const sourceForm = normalizedTextV1(witness.sourceForm);
  const evidenceRefs = witness.citationRefs
    .map(normalizedTextV1)
    .filter(Boolean);
  const preconditionFailures: DeterministicSourceAttestedResearchWitnessFunctionalProposalReasonCodeV1[] =
    [];
  const insufficientSupportFailures: DeterministicSourceAttestedResearchWitnessFunctionalProposalReasonCodeV1[] =
    [];

  if (!witnessId) {
    preconditionFailures.push("SOURCE_ATTESTED_WITNESS_ID_REQUIRED");
  }
  if (!sourceId) {
    preconditionFailures.push("SOURCE_ATTESTED_SOURCE_ID_REQUIRED");
  }
  if (evidenceRefs.length === 0) {
    preconditionFailures.push("SOURCE_ATTESTED_EVIDENCE_REFS_REQUIRED");
  }
  if (witness.sourceStatus !== "research_candidate") {
    preconditionFailures.push("SOURCE_ATTESTED_MUST_REMAIN_RESEARCH");
  }
  if (witness.embryoAuthority !== "source_attested_exact_form") {
    preconditionFailures.push("SOURCE_ATTESTED_EMBRYO_AUTHORITY_REQUIRED");
  }
  if (witness.embryoRelation !== "exact_form") {
    preconditionFailures.push("SOURCE_ATTESTED_EXACT_FORM_REQUIRED");
  }
  if (!targetWord) {
    preconditionFailures.push("SOURCE_ATTESTED_EXPECTED_TARGET_WORD_REQUIRED");
  } else if (!sameResearchKeyV1(targetWord, witnessTargetWord)) {
    preconditionFailures.push("SOURCE_ATTESTED_TARGET_WORD_MISMATCH");
  }
  if (!sameResearchKeyV1(sourceForm, embryo)) {
    preconditionFailures.push("SOURCE_ATTESTED_EMBRYO_FORM_MISMATCH");
  }
  if (!hasUsableResearchTruthV1(witness.attestationTruth)) {
    insufficientSupportFailures.push(
      "SOURCE_ATTESTED_ATTESTATION_TRUTH_SUPPORT_REQUIRED",
    );
  }
  if (!hasUsableResearchTruthV1(witness.functionalBridgeTruth)) {
    insufficientSupportFailures.push(
      "SOURCE_ATTESTED_FUNCTIONAL_BRIDGE_TRUTH_SUPPORT_REQUIRED",
    );
  }

  if (preconditionFailures.length > 0) {
    return rejectedV1(preconditionFailures);
  }
  if (insufficientSupportFailures.length > 0) {
    return insufficientSupportV1(insufficientSupportFailures);
  }

  const proposal: FunctionalDiscoverySourceAttestedAcceptanceInputV0_1 = {
    candidateId: `research-functional:${witnessId}`,
    targetWord,
    structuralHypothesis: null,
    sourceAttestedAnchor: {
      kind: "source_attested_exact_form",
      witnessId,
      sourceId,
      targetWord,
      embryo,
      sourceForm,
      language: normalizedTextV1(witness.language),
      embryoAuthority: "source_attested_exact_form",
      embryoRelation: "exact_form",
      sourceStatus: "research_candidate",
      attestationTruth: witness.attestationTruth,
      functionalBridgeTruth: witness.functionalBridgeTruth,
      evidenceRefs,
    },
    targetSenseRequirement: "NOT_APPLICABLE",
    functionalStatement: witness.semanticBridge,
    functionalComponents: [],
    componentRequirement: "not_applicable",
    semanticAlignment: null,
    semanticBridge: witness.semanticBridge,
    evidenceState: "research_candidate",
    evidenceRefs,
    claimBoundary: CLAIM_BOUNDARY_V1,
    userDecisionPosture: "user_decides",
    noSingleWinner: true,
    proposalProvenance: {
      kind: "research_catalog",
      sourceId,
    },
  };

  const acceptance =
    evaluateSourceAttestedFunctionalDiscoveryAcceptanceV0_1(proposal);

  if (
    acceptance.decision !== "ACCEPT" ||
    !acceptance.acceptedFunctionalCandidate
  ) {
    return {
      schemaVersion:
        DETERMINISTIC_SOURCE_ATTESTED_RESEARCH_WITNESS_FUNCTIONAL_PROPOSAL_SCHEMA_V1,
      decision: acceptance.decision,
      reasonCodes: [...acceptance.reasonCodes],
      proposal: null,
      acceptance,
    };
  }

  return {
    schemaVersion:
      DETERMINISTIC_SOURCE_ATTESTED_RESEARCH_WITNESS_FUNCTIONAL_PROPOSAL_SCHEMA_V1,
    decision: acceptance.decision,
    reasonCodes: [...acceptance.reasonCodes],
    proposal,
    acceptance,
  };
}
