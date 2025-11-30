// src/app/api/analyze/route.ts
import { NextResponse } from "next/server";
import { runAnalysis, type Alphabet } from "@/lib/runAnalysis";
import { getManifest } from "@/engine/manifest";
import type { SolveOptions } from "@/functions/sevenVoicesCore";

type Mode = "strict" | "open";

function buildSolveOptions(
  mode: Mode,
  alphabet: Alphabet,
  manifest: ReturnType<typeof getManifest>
): SolveOptions {
  const isStrict = mode === "strict";

  return {
    beamWidth: 8,
    maxOps: isStrict ? 1 : 2,
    allowDelete: !isStrict,
    allowClosure: !isStrict,
    opCost: manifest.opCost,
    edgeWeight: manifest.edgeWeight,
    manifest,
    alphabet,
  } as SolveOptions;
}

// GET /api/analyze?word=...&mode=strict|open&alphabet=auto|...
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const word = searchParams.get("word") ?? "";
  const mode = (searchParams.get("mode") as Mode) || "strict";
  const alphabet = (searchParams.get("alphabet") as Alphabet) || "auto";
  const manifestVersion = searchParams.get("manifest") ?? undefined;

  if (!word) {
    return NextResponse.json(
      { error: 'Missing "word" query parameter' },
      { status: 400 }
    );
  }

  const t0 = Date.now();
  const manifest = getManifest(manifestVersion);

  try {
    const opts = buildSolveOptions(mode, alphabet, manifest);
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

// POST /api/analyze  with JSON body { word, mode, alphabet, manifest? }
export async function POST(request: Request) {
  let body: any = {};
  try {
    body = await request.json();
  } catch {
    // ignore – we'll fall back to query params only
  }

  const url = new URL(request.url);

  if (body.word) url.searchParams.set("word", String(body.word));
  if (body.mode) url.searchParams.set("mode", String(body.mode));
  if (body.alphabet) url.searchParams.set("alphabet", String(body.alphabet));
  if (body.manifest)
    url.searchParams.set("manifest", String(body.manifest));

  // Re-use GET logic so there is only one real implementation.
  const forwarded = new Request(url.toString(), {
    method: "GET",
    headers: request.headers,
  });

  return GET(forwarded);
}