import { NextRequest, NextResponse } from "next/server";
import { analyzeWordV1 } from "../../../engine/analyzeWordV1";

type AnalyzeV1RequestBody = {
  word?: string;
  mode?: "strict" | "open";
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AnalyzeV1RequestBody;

    const rawWord = body.word ?? "";
    const word = rawWord.trim();
    const mode = body.mode ?? "strict";

    if (!word) {
      return NextResponse.json({ error: "Missing word" }, { status: 400 });
    }

    const result = await analyzeWordV1(word, mode);

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("[/api/analyze-v1] error", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
