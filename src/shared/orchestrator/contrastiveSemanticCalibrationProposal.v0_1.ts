import {
  buildContrastiveSemanticProposerSystemPromptV0_2,
  contrastiveSemanticContextForPromptV0_2,
} from "@/shared/llm/prompts/semanticAlignmentProposer.v0.1";
import {
  runProposerV0_2,
  type ProposerProviderIdV0_2,
} from "@/shared/llm/providers/proposerProvider.v0.2";
import { tryParseJsonV0_2 } from "@/shared/orchestrator/proposalParse.v0.2";
import {
  CONTRASTIVE_SEMANTIC_DECISION_CONTRACT_VERSION_V0_2,
  parseContrastiveSemanticProposalV0_1,
  type ContrastiveSemanticAssessmentV0_1,
  type ContrastiveSemanticContextV0_1,
  type ContrastiveSemanticResponseShapeDiagnosticsV0_1,
} from "@/shared/openInstrument/contrastiveSemanticCalibration.v0_1";
import { semanticProviderPreflightV0_1 } from "@/shared/orchestrator/semanticAlignmentProposal.v0_1";

export type ContrastiveSemanticProposalStatusV0_1 =
  | "skipped_provider_not_ready"
  | "proposed"
  | "unknown"
  | "malformed_output"
  | "provider_error";

export type ContrastiveSemanticProposalResultV0_1 = Readonly<{
  attempted: boolean;
  status: ContrastiveSemanticProposalStatusV0_1;
  provider: string | null;
  providerReady: boolean;
  realProvider: boolean;
  mockProvider: boolean;
  reasonCodes: readonly string[];
  timeoutMs: number;
  assessment: ContrastiveSemanticAssessmentV0_1 | null;
  diagnostics?: ContrastiveSemanticResponseShapeDiagnosticsV0_1;
  error: "provider_error" | "timeout" | null;
}>;

export type RunContrastiveSemanticProposalOptionsV0_1 = Readonly<{
  providerOverrideForTests?: ProposerProviderIdV0_2;
  timeoutMs?: number;
  maximumOutputTokens?: number;
}>;

function envText(name: string): string | null {
  const value = process.env[name];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function safeTimeoutMsV0_1(optionValue?: number): number {
  if (typeof optionValue === "number" && Number.isFinite(optionValue) && optionValue > 0) {
    return Math.max(10, Math.min(Math.floor(optionValue), 30000));
  }
  const configured = Number(envText("OPEN_INSTRUMENT_SEMANTIC_ALIGNMENT_TIMEOUT_MS"));
  if (Number.isFinite(configured) && configured > 0) return Math.max(250, Math.min(Math.floor(configured), 30000));
  return 8000;
}

function unavailableV0_1(
  context: ContrastiveSemanticContextV0_1,
  status: "skipped_provider_not_ready",
  reasonCodes: readonly string[],
  provider: string | null,
  timeoutMs: number,
): ContrastiveSemanticProposalResultV0_1 {
  return {
    attempted: false,
    status,
    provider,
    providerReady: false,
    realProvider: false,
    mockProvider: false,
    reasonCodes,
    timeoutMs,
    assessment: null,
    error: null,
  };
}

export async function runContrastiveSemanticProposalV0_1(
  context: ContrastiveSemanticContextV0_1,
  options: RunContrastiveSemanticProposalOptionsV0_1 = {},
): Promise<ContrastiveSemanticProposalResultV0_1> {
  const timeoutMs = safeTimeoutMsV0_1(options.timeoutMs);
  const preflight = semanticProviderPreflightV0_1(options);
  if (!preflight.providerReady || !preflight.provider) {
    return unavailableV0_1(context, "skipped_provider_not_ready", preflight.reasonCodes, preflight.provider, timeoutMs);
  }

  const provider = preflight.provider;
  const realProvider = provider === "openai_compat";
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const result = await runProposerV0_2({
      word: context.targetWord,
      mode: "strict",
      systemPrompt: buildContrastiveSemanticProposerSystemPromptV0_2(),
      userPayload: {
        ...contrastiveSemanticContextForPromptV0_2(context),
        contrastiveSemanticContractVersion: CONTRASTIVE_SEMANTIC_DECISION_CONTRACT_VERSION_V0_2,
      },
      ...(typeof options.maximumOutputTokens === "number"
        ? { maximumOutputTokens: options.maximumOutputTokens }
        : {}),
      signal: controller.signal,
    }, provider);
    const parsed = parseContrastiveSemanticProposalV0_1(tryParseJsonV0_2(result.rawText), context, {
      providerId: result.provider,
      modelId: typeof result.meta?.model === "string" ? result.meta.model : undefined,
    });
    if (!parsed.ok) {
      return {
        attempted: true,
        status: "malformed_output",
        provider,
        providerReady: true,
        realProvider,
        mockProvider: !realProvider,
        reasonCodes: [...preflight.reasonCodes, "CONTRASTIVE_OUTPUT_REJECTED", ...parsed.reasonCodes],
        timeoutMs,
        assessment: null,
        diagnostics: parsed.diagnostics,
        error: null,
      };
    }
    return {
      attempted: true,
      status: parsed.assessment.alignmentStatus,
      provider,
      providerReady: true,
      realProvider,
      mockProvider: !realProvider,
      reasonCodes: preflight.reasonCodes,
      timeoutMs,
      assessment: parsed.assessment,
      error: null,
    };
  } catch {
    const timedOut = controller.signal.aborted;
    return {
      attempted: true,
      status: "provider_error",
      provider,
      providerReady: true,
      realProvider,
      mockProvider: !realProvider,
      reasonCodes: [
        ...preflight.reasonCodes,
        timedOut ? "CONTRASTIVE_PROVIDER_TIMEOUT" : "CONTRASTIVE_PROVIDER_ERROR",
      ],
      timeoutMs,
      assessment: null,
      diagnostics: {
        parseStage: timedOut ? "provider_timeout" : "provider_error",
        jsonParsed: false,
        topLevelType: "unavailable",
        objectExtracted: false,
        fieldIssues: [],
      },
      error: timedOut ? "timeout" : "provider_error",
    };
  } finally {
    clearTimeout(timer);
  }
}
