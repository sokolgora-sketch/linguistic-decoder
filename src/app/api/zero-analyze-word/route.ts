// src/app/api/zero-analyze-word/route.ts
import { NextResponse } from "next/server";
import { cleanWord } from "@/engine/wordCleaner";
import { analyzeWord } from "@/engine/wordAnalyzer";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { word, languageHint } = body ?? {};

  if (!word || typeof word !== "string") {
    return NextResponse.json({ error: "Missing 'word' string" }, { status: 400 });
  }

  const cleaned = cleanWord(word, languageHint);
  const analysis = analyzeWord(cleaned);
  return NextResponse.json(analysis);
}
