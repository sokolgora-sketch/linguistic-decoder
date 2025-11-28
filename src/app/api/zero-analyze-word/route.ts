import { NextRequest, NextResponse } from "next/server";
import { analyzeWord } from "@/engine/analyzeWord"; // adjust path if needed

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const word = (body.word ?? "").trim() as string;
    const mode = (body.mode ?? "strict") as "strict" | "loose";

    if (!word) {
      return NextResponse.json(
        { error: "Word is required" },
        { status: 400 }
      );
    }

    // Your core engine – returns the payload your UI already knows how to adapt
    const payload = analyzeWord(word, mode);

    return NextResponse.json({ payload }, { status: 200 });
  } catch (err) {
    console.error("zero-analyze-word error", err);
    return NextResponse.json(
      { error: "Internal error running analyzeWord" },
      { status: 500 }
    );
  }
}
