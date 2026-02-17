import type { ProposalV0_1, VerificationV0_1 } from "@/shared/verifier/verifyProposal.v0.1";

export type ClaimPacketOracleV0_1 = {
  // Canonical request identity
  word: string;
  mode: "strict" | "open";

  // Core oracle fact we can truth-check first (v0.1)
  // Use ["U","I"] shape (not "U-I") to avoid parsing ambiguity in oracle.
  primaryVoicePath: string[];

  // Evidence-first ledger (string refs) — follows OriginClaim pattern
  evidenceRefs: string[];
};

export type ClaimPacketV0_1 = {
  claimPacketVersion: "v0.1";

  // External claim (LLM or human)
  proposal: ProposalV0_1;

  // Optional: keep surface verifier output alongside claim for audit/debug
  // (This is deterministic + already exists in codebase.)
  proposalVerification?: VerificationV0_1 | null;

  // Oracle snapshot (truth inputs), produced by an orchestrator (later: analyzeWordV1 bridge)
  oracle: ClaimPacketOracleV0_1;
};
