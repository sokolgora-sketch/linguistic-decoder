// src/app/api/analyze/route.ts
import { NextResponse } from "next/server";
import { runAnalysis, type Alphabet } from "@/lib/runAnalysis";
import { getManifest } from "@/engine/manifest";
import type { SolveOptions } from "@/functions/sevenVoicesCore";

// Shared helper used by both GET and POST
async function analyzeWord(
  word: string,
  mode: "strict" | "open",
  alphabet: Alphabet,
  manifestVersion?: string | null
) {
  const manifest = getManifest(manifestVersion || undefined);
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

  const t0 = Date.now();
  const analysis = runAnalysis(word, opts, alphabet);

  return {
    ...analysis,
    solveMs: Date.now() - t0,
  };
}

// GET /api/analyze?word=...&mode=...&alphabet=...&manifest=...
export async function GET(request: Request) {
  const url = new URL(request.url);
  const word = url.searchParams.get("word");
  const mode =
    (url.searchParams.get("mode") as "strict" | "open") || "strict";
  const alphabet =
    (url.searchParams.get("alphabet") as Alphabet) || "auto";
  const manifestVersion = url.searchParams.get("manifest");

  if (!word) {
    return NextResponse.json(
      { error: 'Missing "word" query parameter' },
      { status: 400 }
    );
  }

  try {
    const payload = await analyzeWord(
      word,
      mode,
      alphabet,
      manifestVersion
    );
    return NextResponse.json(payload);
  } catch (e: any) {
    console.error(`[API /analyze][GET] Error for word "${word}":`, e);
    return NextResponse.json(
      { error: e?.message || "Analysis failed" },
      { status: 500 }
    );
  }
}

// POST /api/analyze  with JSON { word, mode?, alphabet?, manifest? }
export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const word = typeof body.word === "string" ? body.word : "";
  const mode: "strict" | "open" =
    body.mode === "open" ? "open" : "strict";
  const alphabet: Alphabet = body.alphabet || "auto";
  const manifestVersion =
    typeof body.manifest === "string" ? body.manifest : undefined;

  if (!word.trim()) {
    return NextResponse.json(
      { error: 'Missing "word" in JSON body' },
      { status: 400 }
    );
  }

  try {
    const payload = await analyzeWord(
      word,
      mode,
      alphabet,
      manifestVersion
    );
    return NextResponse.json(payload);
  } catch (e: any) {
    console.error(`[API /analyze][POST] Error for word "${word}":`, e);
    return NextResponse.json(
      { error: e?.message || "Analysis failed" },
      { status: 500 }
    );
  }
}