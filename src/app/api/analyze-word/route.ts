// src/app/api/analyze-word/route.ts
// HTTP API for ZË-RO: POST /api/analyze-word  { word, mode?, alphabet? }

import { NextResponse } from "next/server";
import { cleanWord } from "@/engine/wordCleaner";
import { analyzeWord } from "@/engine/wordAnalyzer";

type AnalyzeRequest = {
  word?: unknown;
  mode?: unknown;      // "strict" | "open" – optional for now
  alphabet?: unknown;  // "auto" | profile id – optional for now
};

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const { word } = body as AnalyzeRequest;

  if (typeof word !== "string" || word.trim().length === 0) {
    return NextResponse.json(
      { error: "Missing 'word' string" },
      { status: 400 },
    );
  }

  // For now we only use the word. Mode/alphabet wiring can be added later
  // without changing the response shape.
  const cleaned = cleanWord(word);
  const result = await analyzeWord(cleaned);

  // `result` should already be your EnginePayload shape.
  return NextResponse.json(result, { status: 200 });
}

// Optional: quick GET health-check (handy for debugging)
export function GET() {
  return NextResponse.json(
    { ok: true, message: "ZË-RO /api/analyze-word – send POST { word }" },
    { status: 200 },
  );
}
