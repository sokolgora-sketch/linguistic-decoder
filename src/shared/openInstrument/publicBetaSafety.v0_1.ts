export const OPEN_INSTRUMENT_PUBLIC_BETA_MODE_ENV_V0_1 =
  "OPEN_INSTRUMENT_PUBLIC_BETA_MODE" as const;

export const OPEN_INSTRUMENT_PUBLIC_BETA_MODE_DETERMINISTIC_ONLY_V0_1 =
  "deterministic_only" as const;

export const WORD_MAX_CODEPOINTS_V0_1 = 100 as const;
export const IPA_MAX_CODEPOINTS_V0_1 = 200 as const;
export const SENSE_LABEL_MAX_CODEPOINTS_V0_1 = 200 as const;
export const SENSE_ID_MAX_CODEPOINTS_V0_1 = 200 as const;
export const LANGUAGE_FIELD_MAX_CODEPOINTS_V0_1 = 50 as const;
export const GET_REQUEST_TARGET_MAX_UTF8_BYTES_V0_1 = 2048 as const;
export const POST_BODY_MAX_UTF8_BYTES_V0_1 = 16_384 as const;

export type PublicBetaModeV0_1 =
  | {
      status: "UNSET";
      mode: null;
    }
  | {
      status: "ENABLED";
      mode: typeof OPEN_INSTRUMENT_PUBLIC_BETA_MODE_DETERMINISTIC_ONLY_V0_1;
    }
  | {
      status: "INVALID";
      mode: null;
      rawValue: string;
    };

export type PublicBetaModelExecutionBlockReasonV0_1 =
  | "INVALID_PUBLIC_BETA_MODE"
  | "MODEL_EXECUTION_DISABLED_IN_PUBLIC_BETA";

export type AnalyzeInputSizeV0_1 = Readonly<{
  word?: unknown;
  ipa?: unknown;
  targetSenseLabel?: unknown;
  targetSenseId?: unknown;
  language?: unknown;
}>;

export type AnalyzeInputSizeFailureReasonV0_1 =
  | "WORD_TOO_LONG"
  | "IPA_TOO_LONG"
  | "TARGET_SENSE_TOO_LONG"
  | "TARGET_SENSE_ID_TOO_LONG"
  | "LANGUAGE_FIELD_TOO_LONG";

export type BoundedRequestBodyResultV0_1 =
  | {
      ok: true;
      text: string;
      bytes: number;
    }
  | {
      ok: false;
      reason: "REQUEST_TOO_LARGE";
      bytes: number;
      maxBytes: number;
    };

export function readPublicBetaModeV0_1(
  env: Readonly<Record<string, string | undefined>> = process.env,
): PublicBetaModeV0_1 {
  const rawValue = env[OPEN_INSTRUMENT_PUBLIC_BETA_MODE_ENV_V0_1];

  if (rawValue === undefined) {
    return { status: "UNSET", mode: null };
  }

  if (rawValue === OPEN_INSTRUMENT_PUBLIC_BETA_MODE_DETERMINISTIC_ONLY_V0_1) {
    return {
      status: "ENABLED",
      mode: OPEN_INSTRUMENT_PUBLIC_BETA_MODE_DETERMINISTIC_ONLY_V0_1,
    };
  }

  return { status: "INVALID", mode: null, rawValue };
}

export function publicBetaModelExecutionBlockReasonV0_1(
  env: Readonly<Record<string, string | undefined>> = process.env,
): PublicBetaModelExecutionBlockReasonV0_1 | null {
  const mode = readPublicBetaModeV0_1(env);

  if (mode.status === "INVALID") {
    return "INVALID_PUBLIC_BETA_MODE";
  }

  if (mode.status === "ENABLED") {
    return "MODEL_EXECUTION_DISABLED_IN_PUBLIC_BETA";
  }

  return null;
}

export function assertExternalModelExecutionAllowedV0_1(
  env: Readonly<Record<string, string | undefined>> = process.env,
): void {
  const reason = publicBetaModelExecutionBlockReasonV0_1(env);
  if (reason) throw new Error(reason);
}

export function countCodePointsV0_1(value: string): number {
  return Array.from(value).length;
}

export function utf8ByteLengthV0_1(value: string): number {
  return new TextEncoder().encode(value).byteLength;
}

export function requestTargetUtf8ByteLengthV0_1(requestUrl: string): number {
  const url = new URL(requestUrl);
  return utf8ByteLengthV0_1(`${url.pathname}${url.search}`);
}

export function validateAnalyzeInputSizesV0_1(
  input: AnalyzeInputSizeV0_1,
):
  | { ok: true }
  | { ok: false; reason: AnalyzeInputSizeFailureReasonV0_1 } {
  const checks: ReadonlyArray<readonly [unknown, number, AnalyzeInputSizeFailureReasonV0_1]> = [
    [input.word, WORD_MAX_CODEPOINTS_V0_1, "WORD_TOO_LONG"],
    [input.ipa, IPA_MAX_CODEPOINTS_V0_1, "IPA_TOO_LONG"],
    [input.targetSenseLabel, SENSE_LABEL_MAX_CODEPOINTS_V0_1, "TARGET_SENSE_TOO_LONG"],
    [input.targetSenseId, SENSE_ID_MAX_CODEPOINTS_V0_1, "TARGET_SENSE_ID_TOO_LONG"],
    [input.language, LANGUAGE_FIELD_MAX_CODEPOINTS_V0_1, "LANGUAGE_FIELD_TOO_LONG"],
  ];

  for (const [value, maxCodePoints, reason] of checks) {
    if (
      typeof value === "string" &&
      countCodePointsV0_1(value) > maxCodePoints
    ) {
      return { ok: false, reason };
    }
  }

  return { ok: true };
}

export async function readBoundedRequestBodyV0_1(
  request: Request,
  maxBytes = POST_BODY_MAX_UTF8_BYTES_V0_1,
): Promise<BoundedRequestBodyResultV0_1> {
  if (!request.body) {
    return { ok: true, text: "", bytes: 0 };
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;

      const chunk = value instanceof Uint8Array
        ? value
        : new Uint8Array(value);
      bytes += chunk.byteLength;

      if (bytes > maxBytes) {
        await reader.cancel();
        return { ok: false, reason: "REQUEST_TOO_LARGE", bytes, maxBytes };
      }

      chunks.push(chunk);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return {
    ok: true,
    text: new TextDecoder().decode(body),
    bytes,
  };
}
