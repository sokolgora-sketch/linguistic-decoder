import { NextResponse } from 'next/server';
import { runAnalysis } from '@/lib/runAnalysis';
import { getManifest } from '@/engine/manifest';
import type { SolveOptions } from '@/functions/sevenVoicesCore';
import type { Alphabet } from '@/lib/runAnalysis';

// --- GET handler (already works) ---
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
    const payload = { ...analysis, solveMs: Date.now() - t0 };

    return NextResponse.json(payload);
  } catch (e: any) {
    console.error(`[API /analyze] Error for word "${word}":`, e);
    return NextResponse.json({ error: e.message || 'Analysis failed' }, { status: 500 });
  }
}

// --- POST handler (fix for ComparePanel) ---
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { word, mode = 'strict', alphabet = 'auto' } = body;

    if (!word) {
      return NextResponse.json({ error: 'Missing "word" in body' }, { status: 400 });
    }

    // reuse GET logic by constructing new GET-style Request
    const url = new URL(request.url);
    url.searchParams.set('word', word);
    url.searchParams.set('mode', mode);
    url.searchParams.set('alphabet', alphabet);

    const getReq = new Request(url.toString(), { method: 'GET' });
    return GET(getReq);
  } catch (err: any) {
    console.error('[API /analyze POST] error', err);
    return NextResponse.json({ error: err.message || 'Invalid request' }, { status: 500 });
  }
}
