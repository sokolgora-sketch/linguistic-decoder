
import { NextRequest, NextResponse } from "next/server";
import { analyzeWord } from "@/engine/analyzeWord";
import { computeMath7ForResult } from "@/engine/math7";
import { getManifest } from "@/engine/manifest";
import type { SolveOptions } from "@/functions/sevenVoicesCore";
import { runAnalysis } from "@/lib/runAnalysis";
import type { Alphabet } from "@/lib/runAnalysis";

// A server-side analysis endpoint for reproducibility and direct access.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get('word');
  const mode = (searchParams.get('mode') as 'strict' | 'open') || 'strict';
  const alphabet = (searchParams.get('alphabet') as Alphabet) || 'auto';
  const manifestVersion = searchParams.get('manifest');

  if (!word) {
    return NextResponse.json({ error: 'Missing "word" query parameter' }, { status: 400 });
  }

  const t0 = Date.now();
  const manifest = getManifest(manifestVersion || undefined);

  try {
    const isStrict = mode === 'strict';
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

    const analysis = runAnalysis(word, opts, alphabet);

    const payload = {
      ...analysis,
      solveMs: Date.now() - t0,
    };

    return NextResponse.json(payload);
  } catch (e: any) {
    console.error(`[API /analyze] Error for word "${word}":`, e);
    return NextResponse.json({ error: e.message || 'Analysis failed' }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { word, mode, alphabet } = body;

    if (!word) {
      return NextResponse.json({ error: 'Missing "word" in request body' }, { status: 400 });
    }

    const result = analyzeWord(word, mode ?? "strict");

    // --- Add deepRoot and wordMatrix if missing ---
    const enriched = {
      ...result,
      deepRoot: result.deepRoot ?? { note: "deepRoot not generated yet" },
      wordMatrix: result.wordMatrix ?? { note: "matrix empty (to be populated later)" },
    };

    return NextResponse.json(enriched);

  } catch(e: any) {
    console.error(`[API /analyze POST] Error:`, e);
    return NextResponse.json({ error: e.message || 'Analysis failed' }, { status: 500 });
  }
}
