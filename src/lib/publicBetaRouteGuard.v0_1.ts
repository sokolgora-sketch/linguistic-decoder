import { NextResponse } from "next/server";

import {
  publicBetaModelExecutionBlockReasonV0_1,
  type AnalyzeInputSizeFailureReasonV0_1,
  type PublicBetaModelExecutionBlockReasonV0_1,
} from "@/shared/openInstrument/publicBetaSafety.v0_1";

function errorResponseV0_1(
  reason: string,
  error: string,
  status: number,
): NextResponse {
  return NextResponse.json(
    { ok: false, error, reason },
    {
      status,
      headers: { "cache-control": "no-store" },
    },
  );
}

export function publicBetaModelExecutionGuardResponseV0_1(): NextResponse | null {
  const reason = publicBetaModelExecutionBlockReasonV0_1();
  if (!reason) return null;

  const error = reason === "INVALID_PUBLIC_BETA_MODE"
    ? "Invalid public beta configuration."
    : "Model execution is disabled in public beta mode.";

  return errorResponseV0_1(reason, error, 503);
}

export function publicBetaInvalidConfigurationResponseV0_1(
  reason: PublicBetaModelExecutionBlockReasonV0_1 = "INVALID_PUBLIC_BETA_MODE",
): NextResponse {
  return errorResponseV0_1(
    reason,
    "Invalid public beta configuration.",
    503,
  );
}

export function publicBetaRequestTooLargeResponseV0_1(
  reason: "REQUEST_TOO_LARGE" | AnalyzeInputSizeFailureReasonV0_1,
): NextResponse {
  return errorResponseV0_1(
    reason,
    reason === "REQUEST_TOO_LARGE"
      ? "Request exceeds the configured public beta size limit."
      : "Analysis input exceeds the configured public beta size limit.",
    413,
  );
}
