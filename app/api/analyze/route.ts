import { NextResponse } from "next/server";
import { analyzeWord } from "@/engine/analyzeWord";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";

export async function POST(req: Request) {
  try {
    const { word, mode, alphabet } = await req.json();

    if (!word || typeof word !== "string") {
      return NextResponse.json({ error: "Missing 'word' parameter" }, { status: 400 });
    }

    // Run the engine
    const payload = await analyzeWord(word.trim(), { mode, alphabet });

    // Convert to full analysis result (adds wordMatrix, deepRoot, etc.)
    const result = enginePayloadToAnalysisResult(payload);

    // ✅ Return final shaped result
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Analyze route error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
