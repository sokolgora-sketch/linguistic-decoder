import { NextResponse } from "next/server";
import { analyzeWordV1 } from "../../../src/v1/analyzeWordV1";

/**
 * ZË-RO v1 API
 * POST /api/analyze  { word: string }
 * GET  /api/analyze?word=...
 *
 * Returns: AnalysisResult (v1 contract)
 */

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body. Expected: { word: string }" },
      { status: 400 }
    );
  }

  const word = typeof (body as any)?.word === "string" ? (body as any).word : "";

  if (!word.trim()) {
    return NextResponse.json(
      { error: 'Missing "word". Expected: { word: string }' },
      { status: 400 }
    );
  }

  const result = analyzeWordV1(word);
  return NextResponse.json(result);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const word = url.searchParams.get("word") ?? "";

  if (!word.trim()) {
    return NextResponse.json(
      { error: 'Missing "word" query param. Use: /api/analyze?word=study' },
      { status: 400 }
    );
  }

  const result = analyzeWordV1(word);
  return NextResponse.json(result);
}
