// src/app/api/zero-analyze-word/route.ts

import { NextResponse } from "next/server";
import { runAnalysis } from "@/lib/runAnalysis";
import { getManifest } from "@/engine/manifest";
import type { SolveOptions } from "@/functions/sevenVoicesCore";
import type { Alphabet } from "@/lib/runAnalysis";

type Mode = "strict" | "open";

async function handleAnalyze(params: {
  word: string;
  mode?: Mode;
  alphabet?: Alphabet;
  manifestVersion?: string | null;
}) {
  const rawWord = params.word ?? "";
  const word = rawWord.trim();
  const mode: Mode = params.mode === "open" ? "open" : "strict";
  const alphabet: Alphabet = (params.alphabet as Alphabet) || "auto";
  const manifestVersion = params.manifestVersion || undefined;

  if (!word) {
    return NextResponse.json(
      { error: 'Missing "word" value' },
      { status: 400 }
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

    // Top-level object IS the engine payload
    const payload = {
      ...analysis,
      solveMs: Date.now() - t0,
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (e: any) {
    console.error(`[API /zero-analyze-word] Error for word "${word}":`, e);
    return NextResponse.json(
      { error: e?.message || "Analysis failed" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const word = searchParams.get("word") ?? "";
  const mode = (searchParams.get("mode") as Mode) || "strict";
  const alphabet = (searchParams.get("alphabet") as Alphabet) || "auto";
  const manifestVersion = searchParams.get("manifest");

  return handleAnalyze({ word, mode, alphabet, manifestVersion });
}

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

  const word =
    typeof body.word === "string" ? (body.word as string) : "";

  const mode = body.mode as Mode | undefined;
  const alphabet = body.alphabet as Alphabet | undefined;
  const manifestVersion =
    typeof body.manifest === "string" ? (body.manifest as string) : undefined;

  return handleAnalyze({ word, mode, alphabet, manifestVersion });
}