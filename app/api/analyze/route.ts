import { NextResponse } from "next/server";
import { analyzeWord } from "@/engine/analyzeWord";
import { buildEngineMetaSummary } from "@/lib/engineMetaSummary";

export async function POST(req: Request) {
  try {
    const { word, mode } = await req.json();

    if (!word || typeof word !== "string") {
      return NextResponse.json({ error: "Missing 'word' param" }, { status: 400 });
    }

    const analyzed = analyzeWord(word.trim(), mode ?? 'strict');

    const primary = analyzed.primaryPath ?? null;

    // The adapter logic is now here in the API route
    const engineMeta = buildEngineMetaSummary(analyzed);

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

      // Include the new structured meta object for the UI
      engineMeta: engineMeta,

      // Keep original meta for backwards compatibility / debug
      meta: {
        version: analyzed.meta?.engineVersion ?? "—",
        created: analyzed.meta?.createdAt ?? "—",
      },
      
      // Pass through other top-level fields from analysis
      languageFamilies: analyzed.languageFamilies,
      symbolic: analyzed.symbolic,
      wordMatrix: (analyzed as any).wordMatrix,
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
