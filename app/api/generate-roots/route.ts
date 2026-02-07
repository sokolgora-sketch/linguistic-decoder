import { NextResponse } from "next/server";
import { proposeOnceV0_2 } from "@/shared/orchestrator/proposeOnce.v0.2";

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
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
