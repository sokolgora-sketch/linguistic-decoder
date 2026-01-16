import { NextResponse } from "next/server";
import { z } from "zod";

import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import { adaptAnalyzeV1ToUI } from "@/shared/analyzeV1Adapter";
import { toAnalyzeWordResultV1Contract } from "@/shared/analyzeWordResult.v1.contract";
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

function applyDevOriginClaimGates(reqUrl?: string): boolean | null {
  if (process.env.NODE_ENV === "production") return null;
  if (!reqUrl) return null;

  try {
    const url = new URL(reqUrl, "http://localhost");
    const ocg = url.searchParams.get("ocg");

    if (ocg === "1") return true;
    if (ocg === "0") return false;
  } catch (e) {
    return null;
  }

  return null;
}

function buildEvidenceV1FromPayload(payload: any) {
  const voicePath = Array.isArray(payload?.primaryPath?.voicePath)
    ? [...payload.primaryPath.voicePath]
    : [];
  const ringPath = Array.isArray(payload?.primaryPath?.ringPath)
    ? [...payload.primaryPath.ringPath]
    : [];
  const levelPath = Array.isArray(payload?.primaryPath?.levelPath)
    ? [...payload.primaryPath.levelPath]
    : [];
  const ops = Array.isArray(payload?.primaryPath?.ops) ? [...payload.primaryPath.ops] : [];

  const sig = new Set<string>(Array.isArray(payload?.signals) ? payload.signals : []);
  sig.add("EVIDENCE_V1");
  sig.delete("EVIDENCE_MISSING_FALLBACK");

  const math7 =
    payload?.math7 ??
    payload?.math7Summary ??
    payload?.primaryPath?.math7 ??
    payload?.data?.math7 ??
    payload?.engine?.math7 ??
    payload?.heart?.math7 ??
    payload?.raw?.heart?.math7 ??
    null;

  const solveMs =
    payload?.solveMs ??
    payload?.data?.solveMs ??
    payload?.engine?.solveMs ??
    null;

  return {
    basis: String(payload?.word ?? ""),
    surfaceVowels: voicePath,
    ringPath,
    levelPath,
    ops,
    math7,
    solveMs,
    cacheHit: payload?.cacheHit ?? null,
    recomputed: payload?.recomputed ?? null,
    normalizationSteps: [],
    notes: [],
    signals: Array.from(sig),
  };
}
function backfillEvidenceMath7(params: {
  evidence: any;
  ensured: any;
  out: any;
  heartInstrumentV1?: any;
}) {
  const { evidence, ensured, out, heartInstrumentV1 } = params;

  const math7 =
    evidence?.math7 ??
    ensured?.heart?.math7 ??
    ensured?.raw?.heart?.math7 ??
    out?.heart?.math7 ??
    out?.raw?.heart?.math7 ??
    heartInstrumentV1?.math7 ??
    null;

  if (math7 != null && evidence?.math7 == null) {
    evidence.math7 = math7;
    evidence.signals = Array.isArray(evidence.signals) ? evidence.signals : [];
    if (!evidence.signals.includes("EVIDENCE_MATH7_BACKFILL")) {
      evidence.signals.push("EVIDENCE_MATH7_BACKFILL");
    }
  }

  return evidence;
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
  const gatesOn = applyDevOriginClaimGates(req.url);

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
    const heartInstrumentV1 = buildHeartInstrumentV1(word);

    const payload = await runAnalysisDeterministic(word, { mode, alphabet });
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

    let evidence = buildEvidenceV1FromPayload(payload);
    evidence = backfillEvidenceMath7({ evidence, ensured, out, heartInstrumentV1 });

    const finalEvidence = { ...evidence };

    let final: any = {
      ...ensured,
      rootMap: (out as any).rootMap,
      originClaim: (out as any).originClaim,
      originClaimGates: { flag: "ocg", active: gatesOn },
      evidence: finalEvidence,
      raw: (ensured as any).raw
        ? { ...((ensured as any).raw as any), evidence: finalEvidence }
        : (ensured as any).raw,
      heartInstrumentV1,
    };

    // ✅ Contract check should validate ONLY the contract-picked projection
    try {
      toAnalyzeWordResultV1Contract(final);
    } catch (e: any) {
      return contractFailResponse({
        message: "final /api/analyze-v1 response failed V1 contract projection",
        issues: e?.issues ?? e?.message ?? String(e),
        out: final,
      });
    }

    return NextResponse.json(final);
  } catch (err: any) {
    return NextResponse.json(
      { error: "analyze-v1 failed", details: String(err?.stack ?? err?.message ?? err) },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const gatesOn = applyDevOriginClaimGates(req.url);

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
    let evidence = buildEvidenceV1FromPayload(payload);
    evidence = backfillEvidenceMath7({ evidence, ensured, out, heartInstrumentV1 });

    const finalEvidence = { ...evidence };

    let final: any = {
      ...ensured,
      rootMap: (out as any).rootMap,
      originClaim: (out as any).originClaim,
      originClaimGates: { flag: "ocg", active: gatesOn },
      evidence: finalEvidence,
      raw: (ensured as any).raw
        ? { ...((ensured as any).raw as any), evidence: finalEvidence }
        : (ensured as any).raw,
      heartInstrumentV1,
    };

    // ✅ Contract check should validate ONLY the contract-picked projection
    try {
      toAnalyzeWordResultV1Contract(final);
    } catch (e: any) {
      return contractFailResponse({
        message: "final /api/analyze-v1 response failed V1 contract projection",
        issues: e?.issues ?? e?.message ?? String(e),
        out: final,
      });
    }

    return NextResponse.json(final);
  } catch (err: any) {
    return NextResponse.json(
      { error: "analyze-v1 failed", details: String(err?.stack ?? err?.message ?? err) },
      { status: 500 }
    );
  }
}
