// src/app/api/analyze-word/route.ts

import { NextRequest, NextResponse } from "next/server";
import { cleanWord } from "@/engine/wordCleaner";
import { analyzeWord } from "@/engine/wordAnalyzer";

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { word, languageHint } = body ?? {};
  if (!word || typeof word !== "string") {
    return NextResponse.json({ error: "Missing 'word' string" }, { status: 400 });
  }

  const cleaned = cleanWord(word, languageHint);
  const result = analyzeWord(cleaned);

  return NextResponse.json(result, { status: 200 });
}
