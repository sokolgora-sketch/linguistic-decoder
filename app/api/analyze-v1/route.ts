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


function buildEvidenceV1FromPayload(payload: any) {
  const voicePath = Array.isArray(payload?.primaryPath?.voicePath) ? [...payload.primaryPath.voicePath] : [];
  const ringPath = Array.isArray(payload?.primaryPath?.ringPath) ? [...payload.primaryPath.ringPath] : [];
  const levelPath = Array.isArray(payload?.primaryPath?.levelPath) ? [...payload.primaryPath.levelPath] : [];
  const ops = Array.isArray(payload?.primaryPath?.ops) ? [...payload.primaryPath.ops] : [];

  const sig = new Set(Array.isArray(payload?.signals) ? payload.signals : []);
  sig.add("EVIDENCE_V1");
  sig.delete("EVIDENCE_MISSING_FALLBACK");

  return {
    basis: String(payload?.word ?? ""),
    surfaceVowels: voicePath,
    ringPath,
    levelPath,
    ops,
    math7: (
    payload?.math7 ??
    payload?.math7Summary ??
    payload?.primaryPath?.math7 ??
    payload?.data?.math7 ??
    payload?.engine?.math7 ??
    payload?.heart?.math7 ??
    payload?.raw?.heart?.math7 ??
    null
  ),
  solveMs: (
    payload?.solveMs ??
    payload?.data?.solveMs ??
    payload?.engine?.solveMs ??
    null
  ),
    cacheHit: payload?.cacheHit ?? null,
    recomputed: payload?.recomputed ?? null,
    normalizationSteps: [],
    notes: [],
    signals: Array.from(sig),
  };
}

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

    // DF_EVIDENCE_MATH7_BACKFILL
    // If engine payload doesn't carry math7 but adapter output does, align evidence to the same truth.
    // This keeps Evidence as "instrument readout" rather than leaving nulls that confuse UI.
    // NOTE: evidence is built from payload earlier; we can adjust it later just before returning.
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
      const evidence = buildEvidenceV1FromPayload(payload);
    // Backfill: EvidenceV1 should carry math7 when Heart has it (payload may not expose it).
    if ((evidence as any).math7 == null) {
      const heartMath7 =
        (ensured as any)?.heart?.math7 ??
        (ensured as any)?.raw?.heart?.math7 ??
        null;

      if (heartMath7 != null) {
        (evidence as any).math7 = heartMath7;
      }
    }


      // Backfill evidence math7 from shaped output (authoritative) if payload-derived evidence missed it.
      // This keeps EvidenceV1 aligned with what the UI actually renders (heart/math7).
      if (!evidence.math7) {
        const m =
          (ensured as any)?.heart?.math7 ??
          (ensured as any)?.raw?.heart?.math7 ??
          (ensured as any)?.heartInstrumentV1?.math7 ??
          null;

        if (m) {
          evidence.math7 = m;
          evidence.signals = Array.isArray(evidence.signals) ? evidence.signals : [];
          evidence.signals.push("EVIDENCE_MATH7_FROM_SHAPED");
        }
      }


      const finalEvidence = {
        ...evidence,
        math7: evidence?.math7 ?? (out as any)?.heart?.math7 ?? (out as any)?.raw?.heart?.math7 ?? null,
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

    // Evidence is derived from engine payload (raw), but some signals (math7) may only exist in shaped output.
    const evidence = buildEvidenceV1FromPayload(payload);

    // Backfill: EvidenceV1 must carry math7 when Heart has it (payload may not expose it).
    const heartMath7 =
      (ensured as any)?.heart?.math7 ??
      (ensured as any)?.raw?.heart?.math7 ??
      null;

    if ((evidence as any).math7 == null && heartMath7 != null) {
      (evidence as any).math7 = heartMath7;
    }

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
