import { verifyProposalV0_1 } from "@/shared/verifier/verifyProposal.v0.1";
import type { ProposalV0_1, VerificationV0_1 } from "@/shared/verifier/verifyProposal.v0.1";
import {
  buildPathMatchRepairScaffold,
  type PathMatchRepairScaffold,
} from "@/shared/llm/repair/pathMatchRepairScaffold.v0.1";
import {
  normalizeVowelPathV0_1,
  type ProposalCandidateV0_1,
} from "@/shared/verifier/verifierRules.v0.1";
import {
  ROOT_PROPOSER_PROMPT_VERSION_V0_2,
  buildRootProposerSystemPromptV0_2,
  type RepairFailReasonV0_2,
} from "@/shared/llm/prompts/rootProposer.v0.2";
import {
  defaultProposerProviderV0_2,
  runProposerV0_2,
  type ProposerProviderIdV0_2,
  type ProposerRequestV0_2,
  type ProposerResultV0_2,
} from "@/shared/llm/providers/proposerProvider.v0.2";
import { tryParseJsonV0_2, sanitizeProposalV0_2 } from "@/shared/orchestrator/proposalParse.v0.2";

export type LoopStatusV0_3 = "PASS" | "FAIL" | "PARSE_ERROR" | "LLM_ERROR";

export type LoopTraceItemV0_3 = {
  attempt: number;
  proposal?: ProposalV0_1;
  parseOk: boolean;
  verification?: VerificationV0_1;
  status: LoopStatusV0_3;
  failReasons?: Array<{ form: string; checkId: string; reason: string }>;
  repairContexts?: PathMatchRepairScaffold[];
  proposerRawText?: string;
};

export type LoopResultV0_3 = {
  status: LoopStatusV0_3;
  word: string;
  mode: "strict" | "open";

  meta: {
    provider: ProposerProviderIdV0_2;
    model: string;
    promptVersion: string;
    verifierVersion: string;
    rulesVersion: string;
    cacheHit: boolean;
    maxAttempts: number;
    attemptsUsed: number;
  };

  final?: {
    proposal: ProposalV0_1;
    verification: VerificationV0_1;
    acceptedCandidateForms: string[];
  };

  trace: LoopTraceItemV0_3[];
};

type DepsV0_3 = {
  runProposer?: (req: ProposerRequestV0_2, provider: ProposerProviderIdV0_2) => Promise<ProposerResultV0_2>;
  cache?: Map<string, LoopResultV0_3>;
};

const DEFAULT_CACHE = new Map<string, LoopResultV0_3>();

function normalizeMode(x: unknown): "strict" | "open" {
  return x === "open" ? "open" : "strict";
}

function normalizeMaxAttempts(x: unknown): number {
  const n = typeof x === "number" ? x : Number(x);
  if (!Number.isFinite(n)) return 4;
  const clamped = Math.max(1, Math.min(8, Math.floor(n)));
  return clamped;
}

function extractFailReasonsStable(v: VerificationV0_1): Array<{ form: string; checkId: string; reason: string }> {
  const out: Array<{ form: string; checkId: string; reason: string }> = [];
  const results = Array.isArray((v as any).results) ? (v as any).results : [];
  for (const r of results) {
    const form = String(r?.form ?? "");
    if (!form) continue;
    const checks = Array.isArray(r?.checks) ? r.checks : [];
    for (const c of checks) {
      if (c && c.pass === false) {
        out.push({
          form,
          checkId: String(c.id ?? ""),
          reason: String(c.reason ?? ""),
        });
      }
    }
  }
      out.sort((a, b) => {
      const f = a.form.localeCompare(b.form);
      if (f) return f;
      const c = a.checkId.localeCompare(b.checkId);
      if (c) return c;
      return a.reason.localeCompare(b.reason);
    });
    return out;
  }


function asProposalCandidates(proposal: ProposalV0_1): ProposalCandidateV0_1[] {
  const candidates = (proposal as any)?.candidates;
  return Array.isArray(candidates) ? (candidates as ProposalCandidateV0_1[]) : [];
}

function textValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function decompositionText(candidate?: ProposalCandidateV0_1): string {
  const decomposition = candidate?.decomposition ?? {};
  return [
    textValue((decomposition as any).action),
    textValue((decomposition as any).instrument),
    textValue((decomposition as any).unit),
    textValue((decomposition as any).statement),
  ]
    .filter(Boolean)
    .join(" | ");
}

function buildPathMatchRepairContexts(args: {
  proposal: ProposalV0_1;
  verification: VerificationV0_1;
  failReasons: RepairFailReasonV0_2[];
}): PathMatchRepairScaffold[] {
  const candidates = asProposalCandidates(args.proposal);
  const candidateByForm = new Map(candidates.map((candidate) => [String(candidate.form ?? ""), candidate]));
  const results = Array.isArray((args.verification as any).results) ? (args.verification as any).results : [];
  const resultByForm = new Map(results.map((result: any) => [String(result?.form ?? ""), result]));

  return args.failReasons
    .filter((failReason) => failReason.checkId === "PATH_MATCH")
    .map((failReason) => {
      const candidate = candidateByForm.get(failReason.form);
      const result = resultByForm.get(failReason.form) as any;
      const declaredVowelPath = candidate
        ? (normalizeVowelPathV0_1((candidate as any).vowelPath) ?? undefined)
        : undefined;
      const material = decompositionText(candidate);

      return buildPathMatchRepairScaffold({
        failedCheckId: failReason.checkId,
        failedReason: failReason.reason,
        acceptedForm: failReason.form,
        candidateLanguage: textValue(candidate?.language),
        declaredVowelPath,
        extractedVowelPath: Array.isArray(result?.extractedVowelPath)
          ? result.extractedVowelPath
          : undefined,
        extractionMaterial: {
          form: failReason.form,
          decompositionText: material,
          rootMaterial: material,
        },
        decompositionText: material,
      });
    });
}

function classifyOverallStatus(trace: LoopTraceItemV0_3[]): LoopStatusV0_3 {
  if (trace.some((t) => t.status === "PASS")) return "PASS";
  if (trace.some((t) => t.status === "LLM_ERROR")) return "LLM_ERROR";
  if (trace.some((t) => t.status === "FAIL")) return "FAIL";
  return "PARSE_ERROR";
}

function modelHint(provider: ProposerProviderIdV0_2): string {
  if (provider === "mock") return "mock";
  const m = process.env.OPENAI_MODEL;
  return typeof m === "string" && m.trim() ? m.trim() : "openai_compat";
}

export async function proposeLoopV0_3(
  req: { word: string; mode?: "strict" | "open"; maxAttempts?: number; provider?: ProposerProviderIdV0_2 },
  deps?: DepsV0_3
): Promise<LoopResultV0_3> {
  const word = String(req.word ?? "").trim();
  const mode = normalizeMode(req.mode);
  const maxAttempts = normalizeMaxAttempts(req.maxAttempts);
  const provider = req.provider ?? defaultProposerProviderV0_2();

  const cache = deps?.cache ?? DEFAULT_CACHE;
  const runProposer = deps?.runProposer ?? runProposerV0_2;

  const cacheKey = [
    "v0.3",
    word,
    mode,
    provider,
    modelHint(provider),
    `max=${maxAttempts}`,
    `prompt=${ROOT_PROPOSER_PROMPT_VERSION_V0_2}`,
    "verifier=v0.1",
    "rules=v0.1",
  ].join("|");

  const cached = cache.get(cacheKey);
  if (cached) {
    return {
      ...cached,
      meta: { ...cached.meta, cacheHit: true },
    };
  }

  const trace: LoopTraceItemV0_3[] = [];
  let lastFailReasons: RepairFailReasonV0_2[] = [];
  let lastRepairContexts: PathMatchRepairScaffold[] = [];

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const systemPrompt = buildRootProposerSystemPromptV0_2({
      failReasons: lastFailReasons,
      repairContexts: lastRepairContexts,
    });

    const userPayload = lastFailReasons.length || lastRepairContexts.length
      ? {
          word,
          mode,
          repair: { failReasons: lastFailReasons, repairContexts: lastRepairContexts },
        }
      : { word, mode };

    let proposer: ProposerResultV0_2;
    try {
      proposer = await runProposer({ word, mode, systemPrompt, userPayload }, provider);
    } catch (e: any) {
      trace.push({
        attempt,
        parseOk: false,
        status: "LLM_ERROR",
        proposerRawText: "",
        failReasons: [{ form: "", checkId: "LLM_ERROR", reason: String(e?.message ?? e ?? "LLM error") }],
      });
      break;
    }

    const parsed = tryParseJsonV0_2(proposer.rawText);
    const proposal = sanitizeProposalV0_2(parsed, word, mode);

    const parseOk =
      !!proposal && Array.isArray((proposal as any).candidates) && (proposal as any).candidates.length > 0;

    if (!parseOk) {
      trace.push({
        attempt,
        proposal: proposal ?? undefined,
        parseOk: false,
        status: "PARSE_ERROR",
        proposerRawText: proposer.rawText,
      });
      lastFailReasons = [{ form: word, checkId: "PARSE_ERROR", reason: "Invalid JSON or schema (missing candidates)." }];
      lastRepairContexts = [];
      continue;
    }

    const verification = verifyProposalV0_1(proposal as any);
    const acceptedCandidateForms = (verification as any).results
      ?.filter((r: any) => r?.pass === true && typeof r?.form === "string")
      .map((r: any) => String(r.form)) ?? [];

    if (acceptedCandidateForms.length > 0) {
      trace.push({
        attempt,
        proposal,
        parseOk: true,
        verification,
        status: "PASS",
        proposerRawText: proposer.rawText,
      });
      const out: LoopResultV0_3 = {
        status: "PASS",
        word,
        mode,
        meta: {
          provider,
          model: String((proposer.meta as any)?.model ?? modelHint(provider)),
          promptVersion: ROOT_PROPOSER_PROMPT_VERSION_V0_2,
          verifierVersion: "v0.1",
          rulesVersion: "v0.1",
          cacheHit: false,
          maxAttempts,
          attemptsUsed: trace.length,
        },
        final: { proposal, verification, acceptedCandidateForms },
        trace,
      };
      cache.set(cacheKey, out);
      return out;
    }

    const failReasons = extractFailReasonsStable(verification);
    const repairContexts = buildPathMatchRepairContexts({ proposal, verification, failReasons });
    trace.push({
      attempt,
      proposal,
      parseOk: true,
      verification,
      status: "FAIL",
      proposerRawText: proposer.rawText,
      failReasons,
      repairContexts,
    });

    lastFailReasons = failReasons.map((f) => ({ form: f.form, checkId: f.checkId, reason: f.reason }));
    lastRepairContexts = repairContexts;
  }

  const status = classifyOverallStatus(trace);

  const out: LoopResultV0_3 = {
    status,
    word,
    mode,
    meta: {
      provider,
      model: modelHint(provider),
      promptVersion: ROOT_PROPOSER_PROMPT_VERSION_V0_2,
      verifierVersion: "v0.1",
      rulesVersion: "v0.1",
      cacheHit: false,
      maxAttempts,
      attemptsUsed: trace.length,
    },
    trace,
  };

  cache.set(cacheKey, out);
  return out;
}
