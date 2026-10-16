import { NextResponse } from "next/server";
import { proposeLoopV0_3 } from "@/shared/orchestrator/proposeLoop.v0.3";
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

  let body: any;
  const boundedBody = await readBoundedRequestBodyV0_1(
    req,
    POST_BODY_MAX_UTF8_BYTES_V0_1,
  );
  if (!boundedBody.ok) {
    return publicBetaRequestTooLargeResponseV0_1(boundedBody.reason);
  }
  try {
    body = JSON.parse(boundedBody.text) as any;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const word = typeof body?.word === "string" ? body.word : "";
  if (!word || !word.trim()) {
    return NextResponse.json({ error: "Missing word" }, { status: 400 });
  }

  const mode = body?.mode === "open" ? "open" : "strict";
  const maxAttempts = body?.maxAttempts;
  const provider = body?.provider;

  const result = await proposeLoopV0_3({ word, mode, maxAttempts, provider });

  return NextResponse.json(result, {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
