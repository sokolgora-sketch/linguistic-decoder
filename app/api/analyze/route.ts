import { NextResponse } from "next/server";
import { z } from "zod";
import { analyzeWordV1 } from "../../../src/v1/analyzeWordV1";
import { AnalysisResultV1Schema } from "../../../src/v1/schemaV1";

/**
 * ZË-RO v1 API
 * POST /api/analyze  { word: string }
 * GET  /api/analyze?word=...
 *
 * Returns: AnalysisResultV1 (guarded by Zod)
 */

const BodySchema = z.object({ word: z.string().min(1) }).passthrough();

function validateResult(result: unknown) {
  const parsed = AnalysisResultV1Schema.safeParse(result);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.format(),
    };
  }
  return { ok: true as const, data: parsed.data };
}

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

  const parsedBody = BodySchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: 'Missing "word". Expected: { word: string }' },
      { status: 400 }
    );
  }

  const word = parsedBody.data.word;
  const result = analyzeWordV1(word);

  const validated = validateResult(result);
  if (!validated.ok) {
    return NextResponse.json(
      { error: "v1 contract validation failed", details: validated.error },
      { status: 500 }
    );
  }

  return NextResponse.json(validated.data);
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

  const validated = validateResult(result);
  if (!validated.ok) {
    return NextResponse.json(
      { error: "v1 contract validation failed", details: validated.error },
      { status: 500 }
    );
  }

  return NextResponse.json(validated.data);
}
