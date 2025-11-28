// src/app/api/zero-analyze-word/route.ts
// New core endpoint used by the Compare panel (and any future tools).
// Shape: { payload: EnginePayload-like } so the UI can do json.payload.

import { NextResponse } from "next/server";
import { runAnalysis } from "@/lib/runAnalysis";
import { getManifest } from "@/engine/manifest";
import type { SolveOptions } from "@/functions/sevenVoicesCore";
import type { Alphabet } from "@/lib/runAnalysis";

type ApiBody = {
  word?: string;
  mode?: "strict" | "open";
  alphabet?: Alphabet;
  manifest?: string;
};

// POST /api/zero-analyze-word  { word, mode?, alphabet?, manifest? }
export async function POST(req: Request) {
  let body: ApiBody;

  try {
    body = (await req.json()) as ApiBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const word = body.word?.trim();
  const mode = body.mode === "open" ? "open" : "strict";
  const alphabet: Alphabet = body.alphabet ?? "auto";
  const manifestVersion = body.manifest;

  if (!word) {
    return NextResponse.json(
      { error: "Missing 'word' string" },
      { status: 400 },
    );
  }

  const t0 = Date.now();
  const manifest = getManifest(manifestVersion);

  try {
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

    const analysis = runAnalysis(word, opts, alphabet);

    const payload = {
      ...analysis,
      solveMs: Date.now() - t0,
    };

    // IMPORTANT: wrap in { payload } so enginePayloadToAnalysisResult(json.payload) works
    return NextResponse.json({ payload }, { status: 200 });
  } catch (e: any) {
    console.error("[/api/zero-analyze-word] Error", e);
    return NextResponse.json(
      { error: e?.message ?? "Analysis failed" },
      { status: 500 },
    );
  }
}

// Optional GET for debugging in the browser:
// /api/zero-analyze-word?word=study&mode=strict&alphabet=auto
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get("word");
  const mode = (searchParams.get("mode") as "strict" | "open") ?? "strict";
  const alphabet = (searchParams.get("alphabet") as Alphabet) ?? "auto";
  const manifestVersion = searchParams.get("manifest") ?? undefined;

  if (!word) {
    return NextResponse.json(
      { error: 'Missing "word" query parameter' },
      { status: 400 },
    );
  }

  const t0 = Date.now();
  const manifest = getManifest(manifestVersion);

  try {
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

    const analysis = runAnalysis(word, opts, alphabet);

    const payload = {
      ...analysis,
      solveMs: Date.now() - t0,
    };

    return NextResponse.json({ payload }, { status: 200 });
  } catch (e: any) {
    console.error("[/api/zero-analyze-word] GET Error", e);
    return NextResponse.json(
      { error: e?.message ?? "Analysis failed" },
      { status: 500 },
    );
  }
}
