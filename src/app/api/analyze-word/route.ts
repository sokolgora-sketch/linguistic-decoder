// src/app/api/analyze-word/route.ts
// ZË-RO API: thin wrapper around zeroAnalyzeWord()

import { NextResponse } from "next/server";
import { zeroAnalyzeWord } from "@/engine/zeroAnalyzeWord";

export async function POST(req: Request) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    // ignore, will fall through to 400 if word missing
  }

  const word = typeof body.word === "string" ? body.word : "";
  const languageHint =
    typeof body.languageHint === "string" ? body.languageHint : undefined;

  if (!word) {
    return NextResponse.json(
      { error: "Missing 'word' string" },
      { status: 400 }
    );
  }

  const result = zeroAnalyzeWord(word, languageHint);
  return NextResponse.json(result);
}
