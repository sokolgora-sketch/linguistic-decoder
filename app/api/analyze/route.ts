import { NextResponse } from "next/server";
import { analyzeWord } from "@/engine/analyzeWord";

export async function POST(req: Request) {
  try {
    const { word, mode } = await req.json();

    if (!word || typeof word !== "string") {
      return NextResponse.json({ error: "Missing 'word' param" }, { status: 400 });
    }

    const analyzed = analyzeWord(word.trim(), mode ?? 'strict');

    const primary = analyzed.primaryPath ?? null;

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
        version: analyzed.meta?.engineVersion ?? "—",
        created: analyzed.meta?.createdAt ?? "—",
      },

      wordMatrix: analyzed.wordMatrix,
      raw: analyzed,
    };

    return NextResponse.json(uiResult);
  } catch (err: any) {
    console.error("Analyze route error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}
