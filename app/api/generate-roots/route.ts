import { NextResponse } from "next/server";
import { proposeOnceV0_2 } from "@/shared/orchestrator/proposeOnce.v0.2";
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

  const word = String(body?.word ?? "");
  const mode = body?.mode === "open" ? "open" : "strict";
  const provider = body?.provider; // optional

  try {
    const out = await proposeOnceV0_2({ word, mode, provider });
    const status = out.ok ? 200 : 422;
    return NextResponse.json(out, {
      status,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Proposer failed", detail: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
