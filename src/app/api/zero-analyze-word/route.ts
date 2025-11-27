// src/app/api/zero-analyze-word/route.ts

import { NextRequest, NextResponse } from "next/server";
import { cleanWord } from "@/engine/wordCleaner";
import { analyzeWord } from "@/engine/wordAnalyzer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { word, languageHint } = body ?? {};

    if (!word || typeof word !== "string") {
      return NextResponse.json(
        { error: "Missing 'word' (string) in body" },
        { status: 400 }
      );
    }

    const cleaned = cleanWord(word, languageHint);
    const analysis = analyzeWord(cleaned);

    return NextResponse.json(analysis, { status: 200 });
  } catch (err) {
    console.error("zero-analyze-word error", err);
    return NextResponse.json(
      { error: "Internal error in ZË-RO analyzer" },
      { status: 500 }
    );
  }
}
