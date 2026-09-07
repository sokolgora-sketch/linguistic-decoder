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
  realProvider: boolean;
  mockProvider: boolean;
  assessment: SemanticAlignmentAssessmentV0_1;
  error: "provider_error" | "timeout" | null;
}>;

export type RunSemanticAlignmentProposalOptionsV0_1 = Readonly<{
  providerOverrideForTests?: ProposerProviderIdV0_2;
  timeoutMs?: number;
}>;

function envText(name: string): string | null {
  const value = process.env[name];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function skippedV0_1(
  context: SemanticAlignmentContextV0_1,
  status: "skipped_disabled" | "skipped_provider_not_ready",
  provider: string | null,
  reason: string,
): SemanticAlignmentProposalResultV0_1 {
  return {
    attempted: false,
    status,
    provider,
    realProvider: false,
    mockProvider: false,
    assessment: deterministicNoAlignmentV0_1(context, [reason]),
    error: null,
  };
}

function providerForV0_1(
  options: RunSemanticAlignmentProposalOptionsV0_1,
): ProposerProviderIdV0_2 | null {
  if (process.env.NODE_ENV === "test" && options.providerOverrideForTests) {
    return options.providerOverrideForTests;
  }

  if (process.env.NODE_ENV === "test") {
    const testProvider = envText("OPEN_INSTRUMENT_SEMANTIC_ALIGNMENT_TEST_PROVIDER");
    if (
      testProvider === "mock_semantic_proposed" ||
      testProvider === "mock_semantic_unknown" ||
      testProvider === "mock_semantic_rejected" ||
      testProvider === "openai_compat"
    ) {
      return testProvider;
    }
    return null;
  }

  if (envText("OPEN_INSTRUMENT_SEMANTIC_ALIGNMENT") !== "1") return null;
  if (envText("PROPOSER_PROVIDER") !== "openai_compat") return null;
  if (!envText("OPENAI_API_KEY") || !envText("OPENAI_MODEL")) return null;
  return defaultProposerProviderV0_2();
}

export async function runSemanticAlignmentProposalV0_1(
  context: SemanticAlignmentContextV0_1,
  options: RunSemanticAlignmentProposalOptionsV0_1 = {},
): Promise<SemanticAlignmentProposalResultV0_1> {
  const provider = providerForV0_1(options);
  if (!provider) {
    return skippedV0_1(
      context,
      process.env.NODE_ENV === "test" ? "skipped_disabled" : "skipped_provider_not_ready",
      null,
      "SEMANTIC_ALIGNMENT_PROVIDER_UNAVAILABLE",
    );
  }

  const realProvider = provider === "openai_compat";
  try {
    const result = await runProposerV0_2(
      {
        word: context.targetWord,
        mode: "strict",
        systemPrompt: buildSemanticAlignmentProposerSystemPromptV0_1(),
        userPayload: {
          semanticContext: semanticAlignmentContextForPromptV0_1(context),
        },
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
        realProvider,
        mockProvider: !realProvider,
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
      realProvider,
      mockProvider: !realProvider,
      assessment: parsedAssessment.assessment,
      error: null,
    };
  } catch {
    return {
      attempted: true,
      status: "provider_error",
      provider,
      realProvider,
      mockProvider: !realProvider,
      assessment: deterministicNoAlignmentV0_1(context, [
        "SEMANTIC_ALIGNMENT_PROVIDER_ERROR",
      ]),
      error: "provider_error",
    };
  }
}
