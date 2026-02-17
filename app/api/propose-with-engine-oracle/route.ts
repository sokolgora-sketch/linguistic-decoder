import { NextResponse } from "next/server";
import { proposeWithEngineOracleV0_2 } from "@/shared/orchestrator/proposeWithEngineOracle.v0.2";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as any));

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
