import { verifyProposalV0_1 } from "@/shared/verifier/verifyProposal.v0.1";
import type { ProposalV0_1, VerificationV0_1 } from "@/shared/verifier/verifyProposal.v0.1";
import { buildRootProposerSystemPromptV0_2 } from "@/shared/llm/prompts/rootProposer.v0.2";
import {
  defaultProposerProviderV0_2,
  runProposerV0_2,
  type ProposerProviderIdV0_2,
} from "@/shared/llm/providers/proposerProvider.v0.2";
import { tryParseJsonV0_2, sanitizeProposalV0_2 } from "@/shared/orchestrator/proposalParse.v0.2";

export type ProposeOnceReqV0_2 = {
  word: string;
  mode?: "strict" | "open";
  provider?: ProposerProviderIdV0_2;
};

export type ProposeOnceOutV0_2 = {
  ok: boolean;
  word: string;
  mode: "strict" | "open";
  provider: ProposerProviderIdV0_2;

  proposerRawText: string;
  proposal: ProposalV0_1 | null;
  verification: VerificationV0_1 | null;

  error?: string;
};

export async function proposeOnceV0_2(req: ProposeOnceReqV0_2): Promise<ProposeOnceOutV0_2> {
  const word = String(req.word ?? "").trim();
  const mode: "strict" | "open" = req.mode === "open" ? "open" : "strict";
  const provider = req.provider ?? defaultProposerProviderV0_2();

  if (!word) {
    return {
      ok: false,
      word: "",
      mode,
      provider,
      proposerRawText: "",
      proposal: null,
      verification: null,
      error: "Missing word",
    };
  }

  const systemPrompt = buildRootProposerSystemPromptV0_2();
  const proposer = await runProposerV0_2(
    { word, mode, systemPrompt, userPayload: { word, mode } },
    provider
  );

  const parsed = tryParseJsonV0_2(proposer.rawText);
  const proposal = sanitizeProposalV0_2(parsed, word, mode);

  if (!proposal || !Array.isArray((proposal as any).candidates) || (proposal as any).candidates.length === 0) {
    return {
      ok: false,
      word,
      mode,
      provider,
      proposerRawText: proposer.rawText,
      proposal: proposal ?? null,
      verification: null,
      error: "Proposer output did not contain a usable Proposal JSON (missing candidates)",
    };
  }

  const verification = verifyProposalV0_1(proposal as any);

  return {
    ok: true,
    word,
    mode,
    provider,
    proposerRawText: proposer.rawText,
    proposal,
    verification,
  };
}
