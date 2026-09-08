import {
  buildSemanticAlignmentProposerSystemPromptV0_1,
  semanticAlignmentContextForPromptV0_1,
} from "@/shared/llm/prompts/semanticAlignmentProposer.v0.1";
import {
  defaultProposerProviderV0_2,
  runProposerV0_2,
  type ProposerProviderIdV0_2,
} from "@/shared/llm/providers/proposerProvider.v0.2";
import { tryParseJsonV0_2 } from "@/shared/orchestrator/proposalParse.v0.2";
import {
  deterministicNoAlignmentV0_1,
  parseSemanticAlignmentProposalV0_1,
  type SemanticAlignmentAssessmentV0_1,
  type SemanticAlignmentContextV0_1,
} from "@/shared/openInstrument/semanticAlignment.v0_1";

export type SemanticAlignmentProposalStatusV0_1 =
  | "skipped_disabled"
  | "skipped_provider_not_ready"
  | "proposed"
  | "unknown"
  | "rejected"
  | "malformed_output"
  | "provider_error";

export type SemanticAlignmentProposalResultV0_1 = Readonly<{
  attempted: boolean;
  status: SemanticAlignmentProposalStatusV0_1;
  provider: string | null;
  providerReady: boolean;
  realProvider: boolean;
  mockProvider: boolean;
  reasonCodes: readonly string[];
  timeoutMs: number;
  assessment: SemanticAlignmentAssessmentV0_1;
  error: "provider_error" | "timeout" | null;
}>;

export type RunSemanticAlignmentProposalOptionsV0_1 = Readonly<{
  providerOverrideForTests?: ProposerProviderIdV0_2;
  timeoutMs?: number;
}>;

export type SemanticProviderPreflightStatusV0_1 =
  | "disabled"
  | "provider_not_selected"
  | "provider_unsupported"
  | "credential_missing"
  | "model_missing"
  | "ready";

export type SemanticProviderPreflightV0_1 = Readonly<{
  status: SemanticProviderPreflightStatusV0_1;
  provider: ProposerProviderIdV0_2 | null;
  providerReady: boolean;
  reasonCodes: readonly string[];
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
  if (Number.isFinite(configured) && configured > 0) {
    return Math.max(250, Math.min(Math.floor(configured), 30000));
  }

  return 8000;
}

export function semanticProviderPreflightV0_1(
  options: RunSemanticAlignmentProposalOptionsV0_1 = {},
): SemanticProviderPreflightV0_1 {
  let provider: ProposerProviderIdV0_2 | null = null;

  if (process.env.NODE_ENV === "test" && options.providerOverrideForTests) {
    provider = options.providerOverrideForTests;
  } else if (process.env.NODE_ENV === "test") {
    const testProvider = envText("OPEN_INSTRUMENT_SEMANTIC_ALIGNMENT_TEST_PROVIDER");
    if (
      testProvider === "mock_semantic_proposed" ||
      testProvider === "mock_semantic_unknown" ||
      testProvider === "mock_semantic_rejected" ||
      testProvider === "openai_compat"
    ) {
      provider = testProvider;
    }
  } else {
    if (envText("OPEN_INSTRUMENT_SEMANTIC_ALIGNMENT") !== "1") {
      return {
        status: "disabled",
        provider: null,
        providerReady: false,
        reasonCodes: ["SEMANTIC_ALIGNMENT_DISABLED"],
      };
    }

    const configuredProvider = envText("PROPOSER_PROVIDER");
    if (!configuredProvider) {
      return {
        status: "provider_not_selected",
        provider: null,
        providerReady: false,
        reasonCodes: ["SEMANTIC_PROVIDER_NOT_SELECTED"],
      };
    }

    if (configuredProvider !== "openai_compat") {
      return {
        status: "provider_unsupported",
        provider: null,
        providerReady: false,
        reasonCodes: ["SEMANTIC_PROVIDER_UNSUPPORTED"],
      };
    }

    provider = defaultProposerProviderV0_2();
  }

  if (!provider) {
    return {
      status: process.env.NODE_ENV === "test" ? "disabled" : "provider_not_selected",
      provider: null,
      providerReady: false,
      reasonCodes: [
        process.env.NODE_ENV === "test"
          ? "SEMANTIC_ALIGNMENT_DISABLED"
          : "SEMANTIC_PROVIDER_NOT_SELECTED",
      ],
    };
  }

  if (provider !== "openai_compat") {
    return {
      status: "ready",
      provider,
      providerReady: true,
      reasonCodes: ["SEMANTIC_PROVIDER_READY"],
    };
  }

  if (!envText("OPENAI_API_KEY")) {
    return {
      status: "credential_missing",
      provider,
      providerReady: false,
      reasonCodes: ["SEMANTIC_PROVIDER_CREDENTIAL_MISSING"],
    };
  }

  if (!envText("OPENAI_MODEL")) {
    return {
      status: "model_missing",
      provider,
      providerReady: false,
      reasonCodes: ["SEMANTIC_PROVIDER_MODEL_MISSING"],
    };
  }

  return {
    status: "ready",
    provider,
    providerReady: true,
    reasonCodes: ["SEMANTIC_PROVIDER_READY"],
  };
}

function skippedV0_1(
  context: SemanticAlignmentContextV0_1,
  status: "skipped_disabled" | "skipped_provider_not_ready",
  preflight: SemanticProviderPreflightV0_1,
  timeoutMs: number,
): SemanticAlignmentProposalResultV0_1 {
  return {
    attempted: false,
    status,
    provider: preflight.provider,
    providerReady: false,
    realProvider: false,
    mockProvider: false,
    reasonCodes: preflight.reasonCodes,
    timeoutMs,
    assessment: deterministicNoAlignmentV0_1(context, preflight.reasonCodes),
    error: null,
  };
}

export async function runSemanticAlignmentProposalV0_1(
  context: SemanticAlignmentContextV0_1,
  options: RunSemanticAlignmentProposalOptionsV0_1 = {},
): Promise<SemanticAlignmentProposalResultV0_1> {
  const timeoutMs = safeTimeoutMsV0_1(options.timeoutMs);
  const preflight = semanticProviderPreflightV0_1(options);
  if (!preflight.providerReady || !preflight.provider) {
    return skippedV0_1(
      context,
      preflight.status === "disabled" ? "skipped_disabled" : "skipped_provider_not_ready",
      preflight,
      timeoutMs,
    );
  }

  const provider = preflight.provider;
  const realProvider = provider === "openai_compat";
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const result = await runProposerV0_2(
      {
        word: context.targetWord,
        mode: "strict",
        systemPrompt: buildSemanticAlignmentProposerSystemPromptV0_1(),
        userPayload: {
          semanticContext: semanticAlignmentContextForPromptV0_1(context),
        },
        signal: controller.signal,
      },
      provider,
    );
    const parsed = tryParseJsonV0_2(result.rawText);
    const parsedAssessment = parseSemanticAlignmentProposalV0_1(
      parsed,
      context,
      {
        alignmentSource: "provider_proposed_hypothesis",
        providerId: result.provider,
        modelId: typeof result.meta?.model === "string" ? result.meta.model : undefined,
      },
    );

    if (!parsedAssessment.ok) {
      return {
        attempted: true,
        status: "malformed_output",
        provider,
        providerReady: true,
        realProvider,
        mockProvider: !realProvider,
        reasonCodes: [...preflight.reasonCodes, "SEMANTIC_ALIGNMENT_OUTPUT_REJECTED", ...parsedAssessment.reasonCodes],
        timeoutMs,
        assessment: deterministicNoAlignmentV0_1(context, [
          "SEMANTIC_ALIGNMENT_OUTPUT_REJECTED",
          ...parsedAssessment.reasonCodes,
        ]),
        error: null,
      };
    }

    return {
      attempted: true,
      status: parsedAssessment.assessment.alignmentStatus,
      provider,
      providerReady: true,
      realProvider,
      mockProvider: !realProvider,
      reasonCodes: preflight.reasonCodes,
      timeoutMs,
      assessment: parsedAssessment.assessment,
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
        timedOut ? "SEMANTIC_ALIGNMENT_PROVIDER_TIMEOUT" : "SEMANTIC_ALIGNMENT_PROVIDER_ERROR",
      ],
      timeoutMs,
      assessment: deterministicNoAlignmentV0_1(context, [
        timedOut ? "SEMANTIC_ALIGNMENT_PROVIDER_TIMEOUT" : "SEMANTIC_ALIGNMENT_PROVIDER_ERROR",
      ]),
      error: timedOut ? "timeout" : "provider_error",
    };
  } finally {
    clearTimeout(timer);
  }
}
