import { NextResponse } from "next/server";
import { proposeLoopV0_3 } from "@/shared/orchestrator/proposeLoop.v0.3";

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
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
