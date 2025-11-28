// src/app/api/analyze-word/route.ts
// HTTP API for ZË-RO: POST /api/analyze-word  { word, languageHint? }

import { NextResponse } from "next/server";
import { cleanWord } from "@/engine/wordCleaner";
import { analyzeWord } from "@/engine/wordAnalyzer";

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const asAny = body as { word?: unknown; languageHint?: unknown };

  const word = asAny.word;
  const languageHint = asAny.languageHint;

  if (typeof word !== "string" || word.trim().length === 0) {
    return NextResponse.json(
      { error: "Missing 'word' string" },
      { status: 400 }
    );
  }

  const cleaned = cleanWord(
    word,
    typeof languageHint === "string" ? languageHint : undefined
  );
  const result = analyzeWord(cleaned);

  return NextResponse.json(result, { status: 200 });
}

// Optional: quick GET health-check
export function GET() {
  return NextResponse.json(
    { ok: true, message: "ZË-RO /api/analyze-word – send POST { word }" },
    { status: 200 }
  );
}
