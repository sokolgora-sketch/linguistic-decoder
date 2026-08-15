import {
  runProposerV0_2,
} from "@/shared/llm/providers/proposerProvider.v0.2";

import {
  tryParseJsonV0_2,
} from "@/shared/orchestrator/proposalParse.v0.2";

export const AUTOMATIC_CARRIER_PRONUNCIATION_SCHEMA_V0_1 =
  "open-instrument.automatic-carrier-pronunciation.v0_1" as const;

export type AutomaticCarrierPronunciationV0_1 = {
  schemaVersion:
    typeof AUTOMATIC_CARRIER_PRONUNCIATION_SCHEMA_V0_1;

  attempted: boolean;

  status:
    | "manual_ipa"
    | "skipped_disabled"
    | "skipped_not_configured"
    | "skipped_nonlocal_endpoint"
    | "proposed"
    | "malformed_output"
    | "provider_error";

  provider:
    "manual"
    | "openai_compat"
    | null;

  localOnly: boolean;

  language:
    string | null;

  ipa:
    string | null;

  error:
    "timeout"
    | "provider_error"
    | null;

  boundary:
    "pronunciation proposal only; Seven-Voice normalization is deterministic and separate";
};

function text(
  value: unknown,
): string | null {
  if (
    typeof value !== "string"
  ) {
    return null;
  }

  const normalized =
    value.trim();

  return normalized || null;
}

function envText(
  name: string,
): string | null {
  return text(
    process.env[name],
  );
}

export function isLoopbackCarrierBaseUrlV0_1(
  value: unknown,
): boolean {
  const raw =
    text(value);

  if (!raw) {
    return false;
  }

  try {
    const url =
      new URL(raw);

    return (
      url.protocol ===
        "http:" &&
      (
        url.hostname ===
          "127.0.0.1" ||
        url.hostname ===
          "localhost" ||
        url.hostname ===
          "::1"
      )
    );
  } catch {
    return false;
  }
}

export function parseAutomaticCarrierPronunciationV0_1(
  rawText: string,
): {
  language: string;
  ipa: string;
} | null {
  const parsed =
    tryParseJsonV0_2(
      rawText,
    );

  if (
    !parsed ||
    typeof parsed !== "object" ||
    Array.isArray(parsed)
  ) {
    return null;
  }

  const row =
    parsed as
      Record<string, unknown>;

  const language =
    text(
      row.language,
    );

  const ipa =
    text(
      row.ipa,
    );

  if (
    !language ||
    !ipa
  ) {
    return null;
  }

  return {
    language,
    ipa,
  };
}

function timeoutMs(): number {
  const configured =
    Number(
      envText(
        "OPEN_INSTRUMENT_AUTO_CARRIER_TIMEOUT_MS",
      ),
    );

  if (
    Number.isFinite(
      configured,
    ) &&
    configured > 0
  ) {
    return Math.max(
      500,
      Math.min(
        Math.floor(
          configured,
        ),
        30000,
      ),
    );
  }

  return 12000;
}

async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
): Promise<T> {
  let timer:
    | ReturnType<
        typeof setTimeout
      >
    | undefined;

  const timeout =
    new Promise<never>(
      (_resolve, reject) => {
        timer =
          setTimeout(
            () =>
              reject(
                new Error(
                  "automatic_carrier_timeout",
                ),
              ),
            ms,
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

function result(
  args: Omit<
    AutomaticCarrierPronunciationV0_1,
    "schemaVersion" |
    "boundary"
  >,
): AutomaticCarrierPronunciationV0_1 {
  return {
    schemaVersion:
      AUTOMATIC_CARRIER_PRONUNCIATION_SCHEMA_V0_1,
    ...args,
    boundary:
      "pronunciation proposal only; Seven-Voice normalization is deterministic and separate",
  };
}

const SYSTEM_PROMPT = `
You provide pronunciation only for the ZË-RO Open Instrument.

Return ONLY one JSON object with exactly:

{
  "language": string,
  "ipa": string
}

Rules:
- Infer the ordinary spoken language and pronunciation of the supplied word.
- Use broad IPA.
- Preserve the user's exact visible spelling as the target.
- If the spelling looks nonstandard or misspelled, infer the most plausible ordinary pronunciation without returning a corrected spelling.
- Do not explain meaning.
- Do not propose etymology.
- Do not propose roots.
- Do not make candidate-truth claims.
- No markdown.
- JSON only.
`.trim();

export async function runAutomaticCarrierPronunciationV0_1(
  input: {
    word: string;
    mode:
      | "strict"
      | "open";
    manualIpa?:
      string | null;
    manualLanguageHint?:
      string | null;
  },
): Promise<AutomaticCarrierPronunciationV0_1> {
  const manualIpa =
    text(
      input.manualIpa,
    );

  if (manualIpa) {
    return result({
      attempted: false,
      status:
        "manual_ipa",
      provider:
        "manual",
      localOnly: true,
      language:
        text(
          input.manualLanguageHint,
        ) ??
        "English",
      ipa:
        manualIpa,
      error: null,
    });
  }

  if (
    envText(
      "OPEN_INSTRUMENT_AUTO_CARRIER",
    ) !== "1"
  ) {
    return result({
      attempted: false,
      status:
        "skipped_disabled",
      provider: null,
      localOnly: true,
      language: null,
      ipa: null,
      error: null,
    });
  }

  const baseUrl =
    envText(
      "OPENAI_BASE_URL",
    );

  const model =
    envText(
      "OPENAI_MODEL",
    );

  const apiKey =
    envText(
      "OPENAI_API_KEY",
    );

  if (
    !baseUrl ||
    !model ||
    !apiKey
  ) {
    return result({
      attempted: false,
      status:
        "skipped_not_configured",
      provider: null,
      localOnly: true,
      language: null,
      ipa: null,
      error: null,
    });
  }

  if (
    !isLoopbackCarrierBaseUrlV0_1(
      baseUrl,
    )
  ) {
    return result({
      attempted: false,
      status:
        "skipped_nonlocal_endpoint",
      provider: null,
      localOnly: true,
      language: null,
      ipa: null,
      error: null,
    });
  }

  try {
    const response =
      await withTimeout(
        runProposerV0_2(
          {
            word:
              String(
                input.word ??
                  "",
              ).trim(),
            mode:
              input.mode,
            systemPrompt:
              SYSTEM_PROMPT,
            userPayload: {
              word:
                String(
                  input.word ??
                    "",
                ).trim(),
              mode:
                input.mode,
            },
          },
          "openai_compat",
        ),
        timeoutMs(),
      );

    const parsed =
      parseAutomaticCarrierPronunciationV0_1(
        response.rawText,
      );

    if (!parsed) {
      return result({
        attempted: true,
        status:
          "malformed_output",
        provider:
          "openai_compat",
        localOnly: true,
        language: null,
        ipa: null,
        error: null,
      });
    }

    return result({
      attempted: true,
      status:
        "proposed",
      provider:
        "openai_compat",
      localOnly: true,
      language:
        parsed.language,
      ipa:
        parsed.ipa,
      error: null,
    });
  } catch (
    error: unknown
  ) {
    const timedOut =
      error instanceof Error &&
      error.message ===
        "automatic_carrier_timeout";

    return result({
      attempted: true,
      status:
        "provider_error",
      provider:
        "openai_compat",
      localOnly: true,
      language: null,
      ipa: null,
      error:
        timedOut
          ? "timeout"
          : "provider_error",
    });
  }
}
