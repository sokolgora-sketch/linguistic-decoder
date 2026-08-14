import {
  runProposerV0_2,
  type ProposerProviderIdV0_2,
} from "@/shared/llm/providers/proposerProvider.v0.2";
import {
  buildFunctionalCandidateProposerSystemPromptV0_1,
} from "@/shared/llm/prompts/functionalCandidateProposer.v0.1";
import {
  tryParseJsonV0_2,
} from "@/shared/orchestrator/proposalParse.v0.2";

export const AUTOMATIC_FUNCTIONAL_PROPOSAL_SCHEMA_V0_1 =
  "open-instrument.automatic-functional-proposal.v0_1" as const;

export type FunctionalEmbryoProposalV0_1 = {
  form: string;
  gloss: string;
};

export type FunctionalCandidateProposalV0_1 = {
  language: string;
  candidateExpression: string;
  embryos: FunctionalEmbryoProposalV0_1[];
  semanticBridge: string;
  requiredTransforms: string[];
  functionalExplanation: string;
};

export type FunctionalProposalEnvelopeV0_1 = {
  word: string;
  candidates: FunctionalCandidateProposalV0_1[];
};

export type AutomaticFunctionalProposalStatusV0_1 =
  | "skipped_disabled"
  | "skipped_real_provider_not_ready"
  | "mock_exercised_test_only"
  | "proposed_unverified"
  | "malformed_output"
  | "provider_error";

export type AutomaticFunctionalProposalResultV0_1 = {
  schemaVersion: typeof AUTOMATIC_FUNCTIONAL_PROPOSAL_SCHEMA_V0_1;
  attempted: boolean;
  status: AutomaticFunctionalProposalStatusV0_1;
  provider: string | null;
  realProvider: boolean;
  mockProvider: boolean;
  userFacingEligible: false;
  verificationState: "not_started" | "pending_slice_e";
  candidateCount: number;
  proposal: FunctionalProposalEnvelopeV0_1 | null;
  error: "provider_error" | "timeout" | null;
};

export type AutomaticFunctionalProposalContextV0_1 = {
  surfaceVowelPath: string[];
  functionalVowelPath: string[];
  rootMapTokens: string[];
  reviewedOperators: string[];
  structuralTokens: string[];
  permittedTransforms: string[];
  reviewedLexicalEvidence: Array<{
    embryo: string;
    language: string | null;
    gloss: string | null;
  }>;
  existingCandidates: Array<{
    language: string | null;
    expression: string | null;
    claimType: string | null;
    validationOutcome: string | null;
  }>;
};

export type RunAutomaticFunctionalCandidateProposalReqV0_1 = {
  word: string;
  mode?: "strict" | "open";
  analysis: unknown;
};

export type RunAutomaticFunctionalCandidateProposalOptionsV0_1 = {
  providerOverrideForTests?: ProposerProviderIdV0_2;
  timeoutMs?: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function text(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized || null;
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}

function envText(name: string): string | null {
  return text(process.env[name]);
}

function normalizedMode(value: unknown): "strict" | "open" {
  return value === "open" ? "open" : "strict";
}

export function buildAutomaticFunctionalProposalContextV0_1(
  analysis: unknown,
): AutomaticFunctionalProposalContextV0_1 {
  const root = isRecord(analysis) ? analysis : {};

  const evidence =
    isRecord(root["evidence"])
      ? root["evidence"]
      : {};

  const rootMap =
    isRecord(root["rootMap"])
      ? root["rootMap"]
      : {};

  const analysisStatus =
    isRecord(root["analysisStatusV0_1"])
      ? root["analysisStatusV0_1"]
      : {};

  const surfaceVowelPath =
    stringArray(evidence["surfaceVowelsRaw"]).length > 0
      ? stringArray(evidence["surfaceVowelsRaw"])
      : stringArray(evidence["surfaceVowels"]);

  const functionalVowelPath =
    stringArray(evidence["vowelPath"]).length > 0
      ? stringArray(evidence["vowelPath"])
      : stringArray(evidence["surfaceVowels"]);

  const rootMapTokens = Array.isArray(rootMap["tokens"])
    ? rootMap["tokens"]
        .filter(isRecord)
        .map((item) => text(item["token"]))
        .filter((item): item is string => Boolean(item))
    : [];

  const reviewedOperators =
    stringArray(analysisStatus["reviewedOperators"]);

  const structuralTokens =
    stringArray(analysisStatus["structuralTokens"]);

  const reviewedSet =
    new Set(
      reviewedOperators.map((token) =>
        token.toUpperCase(),
      ),
    );

  const keys =
    Array.isArray(rootMap["keys"])
      ? rootMap["keys"].filter(isRecord)
      : [];

  const permittedTransforms =
    unique(
      keys.flatMap((key) =>
        stringArray(key["ops"]),
      ),
    );

  const reviewedLexicalEvidence =
    keys.flatMap((key) => {
      const embryo = text(key["token"]);

      if (
        !embryo ||
        !reviewedSet.has(
          embryo.toUpperCase(),
        )
      ) {
        return [];
      }

      return [
        {
          embryo,
          language: text(key["language"]),
          gloss: text(key["gloss"]),
        },
      ];
    });

  const candidateRows =
    Array.isArray(root["candidates"])
      ? root["candidates"]
          .filter(isRecord)
          .slice(0, 12)
      : [];

  const existingCandidates =
    candidateRows.map((candidate) => ({
      language:
        text(candidate["candidateLanguage"]) ??
        text(candidate["language"]),
      expression:
        text(candidate["displayForm"]) ??
        text(candidate["form"]),
      claimType:
        text(candidate["claimType"]),
      validationOutcome:
        text(candidate["validationOutcome"]),
    }));

  return {
    surfaceVowelPath,
    functionalVowelPath,
    rootMapTokens: unique(rootMapTokens),
    reviewedOperators: unique(reviewedOperators),
    structuralTokens: unique(structuralTokens),
    permittedTransforms,
    reviewedLexicalEvidence,
    existingCandidates,
  };
}

function sanitizeFunctionalProposalV0_1(
  parsed: unknown,
  word: string,
): FunctionalProposalEnvelopeV0_1 | null {
  if (!isRecord(parsed)) return null;

  const rows =
    Array.isArray(parsed["candidates"])
      ? parsed["candidates"]
      : [];

  const candidates: FunctionalCandidateProposalV0_1[] = [];

  for (const rawCandidate of rows) {
    if (!isRecord(rawCandidate)) continue;

    const language =
      text(rawCandidate["language"]);

    const candidateExpression =
      text(
        rawCandidate["candidateExpression"],
      );

    const semanticBridge =
      text(
        rawCandidate["semanticBridge"],
      );

    const functionalExplanation =
      text(
        rawCandidate[
          "functionalExplanation"
        ],
      );

    const rawEmbryos =
      Array.isArray(
        rawCandidate["embryos"],
      )
        ? rawCandidate["embryos"]
        : [];

    const embryos =
      rawEmbryos.flatMap((rawEmbryo) => {
        if (!isRecord(rawEmbryo)) {
          return [];
        }

        const form =
          text(rawEmbryo["form"]);

        const gloss =
          text(rawEmbryo["gloss"]);

        if (!form || !gloss) {
          return [];
        }

        return [{ form, gloss }];
      });

    const requiredTransforms =
      stringArray(
        rawCandidate[
          "requiredTransforms"
        ],
      );

    if (
      !language ||
      !candidateExpression ||
      embryos.length === 0 ||
      !semanticBridge ||
      !functionalExplanation
    ) {
      continue;
    }

    candidates.push({
      language,
      candidateExpression,
      embryos,
      semanticBridge,
      requiredTransforms,
      functionalExplanation,
    });
  }

  if (candidates.length === 0) {
    return null;
  }

  return {
    word,
    candidates,
  };
}

function rawCandidateCount(
  parsed: unknown,
): number {
  if (!isRecord(parsed)) return 0;

  return Array.isArray(
    parsed["candidates"],
  )
    ? parsed["candidates"].length
    : 0;
}

function safeTimeoutMs(
  optionValue?: number,
): number {
  if (
    typeof optionValue === "number" &&
    Number.isFinite(optionValue) &&
    optionValue > 0
  ) {
    return Math.max(
      10,
      Math.min(
        Math.floor(optionValue),
        30000,
      ),
    );
  }

  const configured =
    Number(
      envText(
        "OPEN_INSTRUMENT_AUTO_PROPOSER_TIMEOUT_MS",
      ),
    );

  if (
    Number.isFinite(configured) &&
    configured > 0
  ) {
    return Math.max(
      250,
      Math.min(
        Math.floor(configured),
        30000,
      ),
    );
  }

  return 8000;
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
): Promise<T> {
  let timer:
    | ReturnType<typeof setTimeout>
    | undefined;

  const timeout =
    new Promise<never>(
      (_resolve, reject) => {
        timer = setTimeout(
          () =>
            reject(
              new Error(
                "automatic_functional_proposer_timeout",
              ),
            ),
          timeoutMs,
        );
      },
    );

  try {
    return await Promise.race([
      promise,
      timeout,
    ]);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}

function skippedResult(
  status:
    | "skipped_disabled"
    | "skipped_real_provider_not_ready",
  provider: string | null,
): AutomaticFunctionalProposalResultV0_1 {
  return {
    schemaVersion:
      AUTOMATIC_FUNCTIONAL_PROPOSAL_SCHEMA_V0_1,
    attempted: false,
    status,
    provider,
    realProvider: false,
    mockProvider: false,
    userFacingEligible: false,
    verificationState:
      "not_started",
    candidateCount: 0,
    proposal: null,
    error: null,
  };
}

function resolveProviderV0_1(
  options:
    RunAutomaticFunctionalCandidateProposalOptionsV0_1,
):
  | {
      provider:
        ProposerProviderIdV0_2;
      skipped: null;
    }
  | {
      provider: null;
      skipped:
        AutomaticFunctionalProposalResultV0_1;
    } {
  if (
    process.env.NODE_ENV === "test" &&
    options.providerOverrideForTests
  ) {
    return {
      provider:
        options.providerOverrideForTests,
      skipped: null,
    };
  }

  if (
    process.env.NODE_ENV === "test"
  ) {
    const testProvider =
      envText(
        "OPEN_INSTRUMENT_AUTO_PROPOSER_TEST_PROVIDER",
      );

    if (testProvider === "mock") {
      return {
        provider: "mock",
        skipped: null,
      };
    }

    return {
      provider: null,
      skipped: skippedResult(
        "skipped_disabled",
        null,
      ),
    };
  }

  if (
    envText(
      "OPEN_INSTRUMENT_AUTO_PROPOSER",
    ) !== "1"
  ) {
    return {
      provider: null,
      skipped: skippedResult(
        "skipped_disabled",
        null,
      ),
    };
  }

  const requested =
    envText("PROPOSER_PROVIDER");

  if (
    requested !== "openai_compat"
  ) {
    return {
      provider: null,
      skipped: skippedResult(
        "skipped_real_provider_not_ready",
        requested,
      ),
    };
  }

  if (
    !envText("OPENAI_API_KEY") ||
    !envText("OPENAI_MODEL")
  ) {
    return {
      provider: null,
      skipped: skippedResult(
        "skipped_real_provider_not_ready",
        "openai_compat",
      ),
    };
  }

  return {
    provider: "openai_compat",
    skipped: null,
  };
}

export async function runAutomaticFunctionalCandidateProposalV0_1(
  req:
    RunAutomaticFunctionalCandidateProposalReqV0_1,
  options:
    RunAutomaticFunctionalCandidateProposalOptionsV0_1 = {},
): Promise<AutomaticFunctionalProposalResultV0_1> {
  const word =
    String(req.word ?? "").trim();

  const mode =
    normalizedMode(req.mode);

  const resolution =
    resolveProviderV0_1(options);

  if (resolution.skipped) {
    return resolution.skipped;
  }

  const provider =
    resolution.provider;

  const isRealProvider =
    provider === "openai_compat";

  const isMockProvider =
    !isRealProvider;

  try {
    const deterministicContext =
      buildAutomaticFunctionalProposalContextV0_1(
        req.analysis,
      );

    const proposer =
      await withTimeout(
        runProposerV0_2(
          {
            word,
            mode,
            systemPrompt:
              buildFunctionalCandidateProposerSystemPromptV0_1(),
            userPayload: {
              word,
              mode,
              deterministicContext,
            },
          },
          provider,
        ),
        safeTimeoutMs(
          options.timeoutMs,
        ),
      );

    const parsed =
      tryParseJsonV0_2(
        proposer.rawText,
      );

    if (isMockProvider) {
      return {
        schemaVersion:
          AUTOMATIC_FUNCTIONAL_PROPOSAL_SCHEMA_V0_1,
        attempted: true,
        status:
          "mock_exercised_test_only",
        provider,
        realProvider: false,
        mockProvider: true,
        userFacingEligible: false,
        verificationState:
          "not_started",
        candidateCount:
          rawCandidateCount(parsed),
        proposal: null,
        error: null,
      };
    }

    const proposal =
      sanitizeFunctionalProposalV0_1(
        parsed,
        word,
      );

    if (!proposal) {
      return {
        schemaVersion:
          AUTOMATIC_FUNCTIONAL_PROPOSAL_SCHEMA_V0_1,
        attempted: true,
        status:
          "malformed_output",
        provider,
        realProvider: true,
        mockProvider: false,
        userFacingEligible: false,
        verificationState:
          "pending_slice_e",
        candidateCount: 0,
        proposal: null,
        error: null,
      };
    }

    return {
      schemaVersion:
        AUTOMATIC_FUNCTIONAL_PROPOSAL_SCHEMA_V0_1,
      attempted: true,
      status:
        "proposed_unverified",
      provider,
      realProvider: true,
      mockProvider: false,
      userFacingEligible: false,
      verificationState:
        "pending_slice_e",
      candidateCount:
        proposal.candidates.length,
      proposal,
      error: null,
    };
  } catch (error: unknown) {
    const timedOut =
      error instanceof Error &&
      error.message ===
        "automatic_functional_proposer_timeout";

    return {
      schemaVersion:
        AUTOMATIC_FUNCTIONAL_PROPOSAL_SCHEMA_V0_1,
      attempted: true,
      status: "provider_error",
      provider,
      realProvider:
        isRealProvider,
      mockProvider:
        isMockProvider,
      userFacingEligible: false,
      verificationState:
        isRealProvider
          ? "pending_slice_e"
          : "not_started",
      candidateCount: 0,
      proposal: null,
      error:
        timedOut
          ? "timeout"
          : "provider_error",
    };
  }
}
