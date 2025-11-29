import { NextResponse } from "next/server";
import { runAnalysis } from "@/lib/runAnalysis";
import { getManifest } from "@/engine/manifest";
import type { SolveOptions } from "@/functions/sevenVoicesCore";
import type { Alphabet } from "@/lib/runAnalysis";

// Shared core so GET and POST use the same logic
async function analyzeFromParams(
  word: string,
  mode: "strict" | "open",
  alphabet: Alphabet,
  manifestVersion?: string
) {
  const t0 = Date.now();
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

  const analysis = runAnalysis(word, opts, alphabet);

  return {
    ...analysis,
    solveMs: Date.now() - t0,
  };
}

// GET /api/analyze?word=...&mode=...&alphabet=...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const word = searchParams.get("word");
    const mode = (searchParams.get("mode") as "strict" | "open") || "strict";
    const alphabet = (searchParams.get("alphabet") as Alphabet) || "auto";
    const manifestVersion = searchParams.get("manifest") || undefined;

    if (!word) {
      return NextResponse.json(
        { error: 'Missing "word" query parameter' },
        { status: 400 }
      );
    }

    const payload = await analyzeFromParams(
      word,
      mode,
      alphabet,
      manifestVersion
    );
    return NextResponse.json(payload);
  } catch (e: any) {
    console.error("[API /analyze][GET] error", e);
    return NextResponse.json(
      { error: e?.message ?? "Analysis failed" },
      { status: 500 }
    );
  }
}

// POST /api/analyze  { word, mode, alphabet, manifest? }
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as
      | {
          word?: string;
          mode?: "strict" | "open";
          alphabet?: Alphabet;
          manifest?: string;
        }
      | null;

    // Start from the original URL, then copy body fields into query params
    const url = new URL(request.url);

    if (body?.word) url.searchParams.set("word", body.word);
    if (body?.mode) url.searchParams.set("mode", body.mode);
    if (body?.alphabet) url.searchParams.set("alphabet", body.alphabet);
    if (body?.manifest) url.searchParams.set("manifest", body.manifest);

    // Reuse the GET handler so all logic lives in one place
    return GET(
      new Request(url.toString(), {
        method: "GET",
        headers: request.headers,
      })
    );
  } catch (e: any) {
    console.error("[API /analyze][POST] error", e);
    return NextResponse.json(
      { error: e?.message ?? "Analysis failed" },
      { status: 500 }
    );
  }
}
