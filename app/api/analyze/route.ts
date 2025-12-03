import { NextResponse } from "next/server";
import { analyzeWord } from "@/engine/analyzeWord";
import type { AnalyzeWordResultV1 } from "@/shared/resultShape.v1";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawWord = searchParams.get("word") ?? "";
    const word = rawWord.trim();

    if (!word) {
      return NextResponse.json(
        { error: "Missing ?word= query param" },
        { status: 400 }
      );
    }

    // Keep it simple: let the engine use its own default mode/alphabet.
    const result = (await analyzeWord(word)) as AnalyzeWordResultV1;

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Analyze API error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unknown error from /api/analyze" },
      { status: 500 }
    );
  }
}