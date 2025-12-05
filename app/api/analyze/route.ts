
import { NextResponse } from "next/server";
import { analyzeWord } from "@/engine/analyzeWord";
import {
  computeSymbolicCore,
  type SevenVoicesSummary,
  type Vowel,
} from "@/lib/symbolicCore";

export async function POST(req: Request) {
  try {
    const { word, mode } = await req.json();

    if (!word || typeof word !== "string") {
      return NextResponse.json(
        { error: "Missing 'word' param" },
        { status: 400 }
      );
    }

    const analyzed = analyzeWord(word.trim(), mode ?? "strict");
    const primary = analyzed.primaryPath ?? null;

    // Correctly prepare the summary for the symbolic core function
    const summaryForSymbolic: SevenVoicesSummary = {
      voicePath: (analyzed.primaryPath?.voicePath?.split(" → ") ??
        []) as Vowel[],
      ringPath: (analyzed.primaryPath?.ringPath?.split(" → ") ?? []).map(
        Number
      ),
    };
    const symbolic = computeSymbolicCore({
      word: analyzed.word,
      summary: summaryForSymbolic,
    });

    const uiResult = {
      word: analyzed.word ?? word.trim(),
      mode: analyzed.meta.mode,
      alphabet: analyzed.meta.alphabet,

      primaryPath: primary
        ? {
            voicePath: primary.voicePath ?? "—",
            levelPath: primary.levelPath ?? "—",
            ringPath: primary.ringPath ?? "—",
          }
        : null,

      frontier: (analyzed.frontier ?? []).map((cand: any) => ({
        id: cand.id,
        voicePath: cand.voicePath ?? "—",
        levelPath: cand.levelPath ?? "—",
        ringPath: cand.ringPath ?? "—",
      })),

      meta: {
        version: analyzed.meta.engineVersion ?? "—",
        created: analyzed.meta.createdAt ?? "—",
      },

      symbolic,
      wordMatrix: analyzed.wordMatrix,
      raw: analyzed,
    };

    return NextResponse.json(uiResult);
  } catch (err: any) {
    console.error("Analyze route error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
