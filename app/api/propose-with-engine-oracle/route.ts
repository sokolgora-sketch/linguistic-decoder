import { NextResponse } from "next/server";
import { proposeWithEngineOracleV0_2 } from "@/shared/orchestrator/proposeWithEngineOracle.v0.2";
import {
  POST_BODY_MAX_UTF8_BYTES_V0_1,
  readBoundedRequestBodyV0_1,
} from "@/shared/openInstrument/publicBetaSafety.v0_1";
import {
  publicBetaModelExecutionGuardResponseV0_1,
  publicBetaRequestTooLargeResponseV0_1,
} from "@/lib/publicBetaRouteGuard.v0_1";

export async function POST(req: Request) {
  const betaGuard = publicBetaModelExecutionGuardResponseV0_1();
  if (betaGuard) return betaGuard;

  const boundedBody = await readBoundedRequestBodyV0_1(
    req,
    POST_BODY_MAX_UTF8_BYTES_V0_1,
  );
  if (!boundedBody.ok) {
    return publicBetaRequestTooLargeResponseV0_1(boundedBody.reason);
  }
  const body = (() => {
    try {
      return JSON.parse(boundedBody.text) as any;
    } catch {
      return {} as any;
    }
  })();

  const word = String((body as any)?.word ?? "").trim();
  const mode: "strict" | "open" = (body as any)?.mode === "open" ? "open" : "strict";
  const provider = typeof (body as any)?.provider === "string" ? String((body as any).provider) : undefined;

  const out = await proposeWithEngineOracleV0_2({
    word,
    mode,
    provider: provider as any,
  });

  return NextResponse.json(out, {
    status: out.ok ? 200 : 400,
    headers: {
      "cache-control": "no-store",
    },
  });
}
