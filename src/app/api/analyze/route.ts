// src/app/api/analyze/route.ts
import { NextResponse } from "next/server";
import { getManifest } from "@/engine/manifest";
import { runAnalysis, type Alphabet } from "@/lib/runAnalysis";
import type { SolveOptions } from "@/functions/sevenVoicesCore";

// Server-side analysis endpoint used by UI and Compare panel.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const word = searchParams.get("word") ?? "";
  const mode = (searchParams.get("mode") as "strict" | "open") || "strict";
  const alphabet = (searchParams.get("alphabet") as Alphabet) || "auto";
  const manifestVersion = searchParams.get("manifest") ?? undefined;

  if (!word.trim()) {
    return NextResponse.json(
      { error: 'Missing "word" query parameter' },
      { status: 400 }
    );
  }

  const manifest = getManifest(manifestVersion);
  const isStrict = mode === "strict";

  const opts: SolveOptions = {
    beamWidth: 8,
    maxOps: isStrict ? 1 : 2,
    allowDelete: !isStrict,
    allowClosure: !isStrict,
    opCost: manifest.opCost,
    alphabet,
    manifest,
    edgeWeight: manifest.edgeWeight,
  };

  try {
    const t0 = Date.now();
    const analysis = runAnalysis(word, opts, alphabet);
    const payload = {
      ...analysis,
      solveMs: Date.now() - t0,
    };
    return NextResponse.json(payload);
  } catch (err: any) {
    console.error(`[API /analyze] Error for word "${word}":`, err);
    return NextResponse.json(
      { error: err?.message ?? "Analysis failed" },
      { status: 500 }
    );
  }
}