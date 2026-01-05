import { NextResponse } from "next/server";
import { z } from "zod";

import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import { adaptAnalyzeV1ToUI } from "@/shared/analyzeV1Adapter";
import { ensurePrimaryAndCandidatePaths } from "@/shared/ensurePaths";

// ✅ Contract guard
import { AnalyzeWordResultV1ContractSchema } from "@/shared/analyzeWordResult.v1.contract";

// ✅ Heart Instrument v1 (stable sub-object)
import { buildHeartInstrumentV1 } from "@/v1/heartInstrument.v1";

const BodySchema = z
  .object({
    word: z.string().min(1),
    mode: z.enum(["strict", "open"]).optional(),
    alphabet: z.string().optional(),
  })
  .passthrough();

function safeJsonPreview(value: unknown, maxChars = 6000) {
  try {
    const seen = new WeakSet<object>();
    const json = JSON.stringify(
      value,
      (_k, v) => {
        if (typeof v === "bigint") return String(v);
        if (typeof v === "object" && v !== null) {
          if (seen.has(v)) return "[Circular]";
          seen.add(v);
        }
        return v;
      },
      2
    );
    if (!json) return null;
    return json.length > maxChars ? json.slice(0, maxChars) + "…[truncated]" : json;
  } catch (e: any) {
    try {
      const msg = String(e?.message ?? e);
      return msg.length > 500 ? msg.slice(0, 500) + "…[truncated]" : msg;
    } catch {
      return "[unserializable]";
    }
  }
}

function contractFailResponse(params: { message: string; issues?: unknown; out?: unknown }) {
  return NextResponse.json(
    {
      error: "analyze-v1 contract failure",
      message: params.message,
      issues: params.issues ?? null,
      outPreview: safeJsonPreview(params.out),
    },
    { status: 500 }
  );
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      {
        error:
          'Invalid JSON body. Expected: { word: string, mode?: "strict"|"open", alphabet?: string }',
      },
      { status: 400 }
    );
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Missing/invalid "word". Expected: { word: string }' },
      { status: 400 }
    );
  }

  const { word, mode, alphabet } = parsed.data;

  try {
    // Stable instrument derived directly from the authority basis (word → NFC inside builder).
    const heartInstrumentV1 = buildHeartInstrumentV1(word);

    const payload = await runAnalysisDeterministic(word, { mode, alphabet });
    const out = enginePayloadToAnalysisResult(payload);

    const ui = adaptAnalyzeV1ToUI(out as any);

    // ✅ HARD GUARD: validate the engine V1 payload (not the UI adapter output)
    const checked = AnalyzeWordResultV1ContractSchema.safeParse(out);
    if (!checked.success) {
      return contractFailResponse({
        message: "enginePayloadToAnalysisResult produced an off-contract V1 payload",
        issues: checked.error.issues,
        out,
      });
    }

    const ensured = ensurePrimaryAndCandidatePaths(ui);

    // Add as a stable sub-object at the top-level (do NOT let ensurePaths drop it).
      const evidence = {
        normalizationSteps: [],
        ops: [],
        notes: [],
        signals: ["EVIDENCE_V1"],
      };

      return NextResponse.json({
        ...ensured,
        evidence,
        raw: (ensured as any).raw ? { ...((ensured as any).raw as any), evidence } : (ensured as any).raw,
        heartInstrumentV1,
      });
  } catch (err: any) {
    return NextResponse.json(
      { error: "analyze-v1 failed", details: String(err?.stack ?? err?.message ?? err) },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const word = (url.searchParams.get("word") ?? "").trim();
  const mode = (url.searchParams.get("mode") ?? "").trim();
  const alphabet = (url.searchParams.get("alphabet") ?? "").trim();

  if (!word) {
    return NextResponse.json(
      { error: 'Missing "word" query param. Use: /api/analyze-v1?word=study' },
      { status: 400 }
    );
  }

  const modeParsed =
    mode === "strict" || mode === "open" ? (mode as "strict" | "open") : undefined;

  try {
    const heartInstrumentV1 = buildHeartInstrumentV1(word);

    const payload = await runAnalysisDeterministic(word, {
      mode: modeParsed,
      alphabet: alphabet || undefined,
    });
    const out = enginePayloadToAnalysisResult(payload);

    const ui = adaptAnalyzeV1ToUI(out as any);

    const checked = AnalyzeWordResultV1ContractSchema.safeParse(out);
    if (!checked.success) {
      return contractFailResponse({
        message: "enginePayloadToAnalysisResult produced an off-contract V1 payload",
        issues: checked.error.issues,
        out,
      });
    }

    const ensured = ensurePrimaryAndCandidatePaths(ui);
      const evidence = {
        normalizationSteps: [],
        ops: [],
        notes: [],
        signals: ["EVIDENCE_V1"],
      };

      return NextResponse.json({
        ...ensured,
        evidence,
        raw: (ensured as any).raw ? { ...((ensured as any).raw as any), evidence } : (ensured as any).raw,
        heartInstrumentV1,
      });
  } catch (err: any) {
    return NextResponse.json(
      { error: "analyze-v1 failed", details: String(err?.stack ?? err?.message ?? err) },
      { status: 500 }
    );
  }
}
