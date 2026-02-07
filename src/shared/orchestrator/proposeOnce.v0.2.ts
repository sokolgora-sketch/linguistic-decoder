import { verifyProposalV0_1 } from "@/shared/verifier/verifyProposal.v0.1";
import type { ProposalV0_1, VerificationV0_1 } from "@/shared/verifier/verifyProposal.v0.1";
import { ROOT_PROPOSER_SYSTEM_PROMPT_V0_1 } from "@/shared/llm/prompts/rootProposer.v0.1";
import {
  defaultProposerProviderV0_2,
  runProposerV0_2,
  type ProposerProviderIdV0_2,
} from "@/shared/llm/providers/proposerProvider.v0.2";

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

function stripFences(t: string): string {
  const s = String(t ?? "").trim();
  // remove ```json ... ``` and ``` ... ```
  return s
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

function tryParseJson(t: string): any | null {
  const s = stripFences(t);
  try {
    return JSON.parse(s);
  } catch {
    // try extracting first {...last}
    const i = s.indexOf("{");
    const j = s.lastIndexOf("}");
    if (i >= 0 && j > i) {
      const chunk = s.slice(i, j + 1);
      try {
        return JSON.parse(chunk);
      } catch {
        return null;
      }
    }
    return null;
  }
}

function sanitizeProposal(parsed: any, word: string, mode: "strict" | "open"): ProposalV0_1 | null {
  if (!parsed || typeof parsed !== "object") return null;

  const candidates = Array.isArray(parsed.candidates) ? parsed.candidates : [];
  const cleanCandidates = candidates
    .filter((c: any) => c && typeof c === "object" && typeof c.form === "string" && c.form.trim())
    .map((c: any) => {
      const opsUsed = Array.isArray(c.opsUsed) ? c.opsUsed : [];
      const decomposition = c.decomposition && typeof c.decomposition === "object" ? c.decomposition : {};
      return { form: String(c.form), opsUsed, decomposition, vowelPath: c.vowelPath };
    });

  return {
    word,
    mode,
    candidates: cleanCandidates,
  };
}

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

  const proposer = await runProposerV0_2(
    { word, mode, systemPrompt: ROOT_PROPOSER_SYSTEM_PROMPT_V0_1 },
    provider
  );

  const parsed = tryParseJson(proposer.rawText);
  const proposal = sanitizeProposal(parsed, word, mode);

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
