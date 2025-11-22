
import { NextResponse, type NextRequest } from 'next/server';
import { runAnalysis } from '@/lib/runAnalysis';
import { getManifest } from '@/engine/manifest';
import type { SolveOptions } from '@/functions/sevenVoicesCore';
import type { Alphabet } from '@/lib/runAnalysis';
import { analyzeWordWithMath7 } from '@/engine/analyzeWord';

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
    const { word, mode } = body;

    if (!word) {
      return NextResponse.json({ error: 'Missing "word" in request body' }, { status: 400 });
    }

    const result = analyzeWordWithMath7(word, mode ?? "strict");

    return NextResponse.json(result);
  } catch(e: any) {
    console.error(`[API /analyze POST] Error:`, e);
    return NextResponse.json({ error: e.message || 'Analysis failed' }, { status: 500 });
  }
}
