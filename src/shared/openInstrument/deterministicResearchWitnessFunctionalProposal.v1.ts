import type {
  MultiSourceFunctionalWitnessV0_1,
} from "../multiSourceFunctionalDiscovery.v0_1";
import type {
  StructuralHypothesisV0_1,
} from "../structuralHypothesisDiscovery.v0_1";
import {
  evaluateDeterministicFunctionalDiscoveryAcceptanceV0_1,
  type FunctionalDiscoveryAcceptanceInputV0_1,
  type FunctionalDiscoveryAcceptanceResultV0_1,
} from "./deterministicFunctionalDiscoveryAcceptance.v0_1";

export const DETERMINISTIC_RESEARCH_WITNESS_FUNCTIONAL_PROPOSAL_SCHEMA_V1 =
  "open-instrument.deterministic-research-witness-functional-proposal.v1" as const;

export type DeterministicResearchWitnessFunctionalProposalReasonCodeV1 =
  | "RESEARCH_WITNESS_ID_REQUIRED"
  | "RESEARCH_WITNESS_SOURCE_ID_REQUIRED"
  | "RESEARCH_WITNESS_EVIDENCE_REFS_REQUIRED"
  | "RESEARCH_WITNESS_MUST_REMAIN_RESEARCH"
  | "RESEARCH_WITNESS_MUST_USE_STRUCTURAL_EMBRYO"
  | "RESEARCH_WITNESS_TARGET_WORD_MISMATCH"
  | "RESEARCH_WITNESS_EMBRYO_MISMATCH";

export type DeterministicResearchWitnessFunctionalProposalResultV1 = Readonly<{
  schemaVersion:
    typeof DETERMINISTIC_RESEARCH_WITNESS_FUNCTIONAL_PROPOSAL_SCHEMA_V1;
  decision: FunctionalDiscoveryAcceptanceResultV0_1["decision"];
  reasonCodes: readonly string[];
  proposal: FunctionalDiscoveryAcceptanceInputV0_1 | null;
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

function normalizedIdentityV1(value: unknown): string {
  return normalizedTextV1(value).toLocaleLowerCase("en-US");
}

function rejectedV1(
  reasonCodes: readonly DeterministicResearchWitnessFunctionalProposalReasonCodeV1[],
): DeterministicResearchWitnessFunctionalProposalResultV1 {
  return {
    schemaVersion:
      DETERMINISTIC_RESEARCH_WITNESS_FUNCTIONAL_PROPOSAL_SCHEMA_V1,
    decision: "REJECT",
    reasonCodes: [...new Set(reasonCodes)].sort(),
    proposal: null,
    acceptance: null,
  };
}

/**
 * Build one bounded functional proposal from one existing research witness.
 *
 * This adapter is intentionally not a discovery engine. It copies only the
 * witness's existing bridge and citations into the acceptance contract and
 * keeps every proposal at research-hypothesis scope.
 */
export function buildDeterministicResearchWitnessFunctionalProposalV1(
  input: Readonly<{
    structuralHypothesis: StructuralHypothesisV0_1 | null;
    witness: MultiSourceFunctionalWitnessV0_1;
  }>,
): DeterministicResearchWitnessFunctionalProposalResultV1 {
  const witnessId = normalizedTextV1(input.witness.witnessId);
  const sourceId = normalizedTextV1(input.witness.sourceId);
  const targetWord = normalizedTextV1(input.witness.targetWord);
  const embryo = normalizedTextV1(input.witness.embryo);
  const evidenceRefs = [...input.witness.citationRefs];
  const preconditionFailures: DeterministicResearchWitnessFunctionalProposalReasonCodeV1[] =
    [];

  if (!witnessId) {
    preconditionFailures.push("RESEARCH_WITNESS_ID_REQUIRED");
  }
  if (!sourceId) {
    preconditionFailures.push("RESEARCH_WITNESS_SOURCE_ID_REQUIRED");
  }
  if (
    evidenceRefs.length === 0 ||
    evidenceRefs.some((reference) => !normalizedTextV1(reference))
  ) {
    preconditionFailures.push("RESEARCH_WITNESS_EVIDENCE_REFS_REQUIRED");
  }
  if (input.witness.sourceStatus !== "research_candidate") {
    preconditionFailures.push("RESEARCH_WITNESS_MUST_REMAIN_RESEARCH");
  }
  if (input.witness.embryoAuthority !== "structural_discovery") {
    preconditionFailures.push("RESEARCH_WITNESS_MUST_USE_STRUCTURAL_EMBRYO");
  }

  if (input.structuralHypothesis) {
    if (
      normalizedIdentityV1(input.structuralHypothesis.basis) !==
      normalizedIdentityV1(targetWord)
    ) {
      preconditionFailures.push("RESEARCH_WITNESS_TARGET_WORD_MISMATCH");
    }
    if (
      normalizedIdentityV1(input.structuralHypothesis.embryo) !==
      normalizedIdentityV1(embryo)
    ) {
      preconditionFailures.push("RESEARCH_WITNESS_EMBRYO_MISMATCH");
    }
  }

  if (preconditionFailures.length > 0) {
    return rejectedV1(preconditionFailures);
  }

  const proposal: FunctionalDiscoveryAcceptanceInputV0_1 = {
    candidateId: `research-functional:${witnessId}`,
    targetWord,
    structuralHypothesis: input.structuralHypothesis,
    targetSenseRequirement: "OPTIONAL",
    functionalStatement: input.witness.semanticBridge,
    functionalComponents: [],
    componentRequirement: "not_applicable",
    semanticAlignment: null,
    semanticBridge: input.witness.semanticBridge,
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
    evaluateDeterministicFunctionalDiscoveryAcceptanceV0_1(proposal);

  if (
    acceptance.decision !== "ACCEPT" ||
    !acceptance.acceptedFunctionalCandidate
  ) {
    return {
      schemaVersion:
        DETERMINISTIC_RESEARCH_WITNESS_FUNCTIONAL_PROPOSAL_SCHEMA_V1,
      decision: acceptance.decision,
      reasonCodes: [...acceptance.reasonCodes],
      proposal: null,
      acceptance,
    };
  }

  return {
    schemaVersion:
      DETERMINISTIC_RESEARCH_WITNESS_FUNCTIONAL_PROPOSAL_SCHEMA_V1,
    decision: acceptance.decision,
    reasonCodes: [...acceptance.reasonCodes],
    proposal,
    acceptance,
  };
}
