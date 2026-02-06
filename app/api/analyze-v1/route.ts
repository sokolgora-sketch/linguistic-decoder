import { NextResponse } from "next/server";
import { z } from "zod";

import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import { adaptAnalyzeV1ToUI } from "@/shared/analyzeV1Adapter";
import { buildEvidencePackageFromVM } from "@/ui/telemetry/buildEvidencePackageFromVM";
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
  } catch (_e) {
    return null;
  }

  return null;
}

 // --- EvidencePackage helpers (server-safe) ---
type Vowel = "A"|"E"|"I"|"O"|"U"|"Y"|"Ë";


  type BuildTelemetryVmForEvidencePackageParams = {
    word: string;
    mode: unknown;
    out: unknown;
    heartInstrumentV1: unknown;
  };

function vowelToIndex1(v: unknown): number | null {
  switch (String(v)) {
    case "A": return 1;
    case "E": return 2;
    case "I": return 3;
    case "O": return 4;
    case "U": return 5;
    case "Y": return 6;
    case "Ë": return 7;
    default: return null;
  }
}

function vowelToRingIndex(v: unknown): number | null {
  // rings: O=0; I/U=1; E/Y=2; A/Ë=3
  switch (String(v)) {
    case "O": return 0;
    case "I":
    case "U": return 1;
    case "E":
    case "Y": return 2;
    case "A":
    case "Ë": return 3;
    default: return null;
  }
}

function driftFrom(indices1: unknown): "mostly_increasing"|"mostly_decreasing"|"mixed"|"static" {
  if (!Array.isArray(indices1) || indices1.length <= 1) return "static";
  let inc = 0, dec = 0;
  for (let i = 1; i < indices1.length; i++) {
    if (indices1[i] > indices1[i-1]) inc++;
    else if (indices1[i] < indices1[i-1]) dec++;
  }
  if (inc === 0 && dec === 0) return "static";
  if (inc > dec) return "mostly_increasing";
  if (dec > inc) return "mostly_decreasing";
  return "mixed";
}

function sectionFromVowels(vowels: unknown) {
  const v = Array.isArray(vowels) ? vowels : [];
  const indices1 = v.map(vowelToIndex1).filter((x) => typeof x === "number");
  const ringIndex = v.map(vowelToRingIndex).filter((x) => typeof x === "number");
  const crossesCenter = indices1.includes(4);
  const last = indices1.length ? indices1[indices1.length - 1] : null;
  const endsOnE = last === 2;
  const endsOnË = last === 7;
  const drift = driftFrom(indices1);
  return { indices1, ringIndex, crossesCenter, endsOnE, endsOnË, drift };
}

function buildSpectrumVM(surfaceVowels: unknown, functionalVowels: unknown) {
  const surface = sectionFromVowels(surfaceVowels);
  const functional = sectionFromVowels(functionalVowels);

  const delta = {
    surfaceIndices1: surface.indices1,
    functionalIndices1: functional.indices1,
    surfaceRings: surface.ringIndex,
    functionalRings: functional.ringIndex,
  };

  return {
    surface: { kind: "present", value: surface },
    functional: { kind: "present", value: functional },
    delta,
  };
}

function buildTelemetryVmForEvidencePackage(params: BuildTelemetryVmForEvidencePackageParams): any {
  const { word, mode, out, heartInstrumentV1 } = params;


  const outAny: any = out as any;
  const heartAny: any = heartInstrumentV1 as any;
  const surfaceVowels =
      Array.isArray(heartAny?.surfaceVowels) ? heartAny.surfaceVowels : null;

  const functionalVowels =
      Array.isArray(outAny?.heart?.math7?.primary?.vowels)
        ? outAny.heart.math7.primary.vowels
        : (Array.isArray(outAny?.primaryPath?.voicePath) ? outAny.primaryPath.voicePath : null);

  const spectrum = buildSpectrumVM(surfaceVowels, functionalVowels);

  return {
    wordShown: String(word ?? ""),
    engineVersion: String(outAny?.engineVersion ?? ""),
    mode: String(mode ?? ""),
    signals: [],
    readout: {
      word: String(word ?? ""),
      normalizedWord: String(outAny?.sanitized ?? word ?? ""),
      voicePath: Array.isArray(functionalVowels) ? functionalVowels : [],
      voicePathSurface: Array.isArray(surfaceVowels) ? surfaceVowels : [],
      voicePathFunctional: Array.isArray(functionalVowels) ? functionalVowels : [],
      voicePathDelta:
        Array.isArray(surfaceVowels) && Array.isArray(functionalVowels)
          ? (surfaceVowels.join("") + " vs " + functionalVowels.join(""))
          : "",
      // IMPORTANT: instrument currently renders spectrum from readout
      sevenPrinciplesSpectrum: spectrum,
    },
    // ALSO expose top-level for future callers
    sevenPrinciplesSpectrum: spectrum,
  };
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

  const modeParsed =
    mode === "strict" || mode === "open" ? (mode as "strict" | "open") : undefined;

  

    // Seed fallback flag (BRAIN-0.2)
    // Accept via POST body opts (preferred) and also via query params for dev testing.
    let seedFallbackEnabled = false;
    try {
      const url = new URL(req.url, "http://localhost");
      const qSeed = url.searchParams.get("seed");
      const qSeedBrain = url.searchParams.get("seedBrainCandidates");
      const qSeedFallback = url.searchParams.get("brainCandidatesSeedFallback");
      seedFallbackEnabled =
        qSeed === "1" ||
        qSeedBrain === "1" ||
        qSeedFallback === "1";
    } catch (_e) {}

    const bodyAny: any = parsed.data as any;
    const bodyOpts: any = bodyAny?.opts && typeof bodyAny.opts === "object" ? bodyAny.opts : null;
    if (bodyOpts) {
      seedFallbackEnabled =
        !!(bodyOpts.brainCandidatesSeedFallback || bodyOpts.seedBrainCandidates) ||
        seedFallbackEnabled;
    }
try {
    const heartInstrumentV1 = buildHeartInstrumentV1(word);

    const payload = await runAnalysisDeterministic(word, { mode, alphabet });
      // Attach request-ish inputs so downstream (OriginClaim) can see seedFallbackEnabled.
      // Additive only; does not change deterministic solver output.
      (payload as any).inputs = {
        word,
        mode: modeParsed ?? mode ?? "strict",
        alphabet: alphabet ?? "auto",
        brainCandidatesSeedFallback: seedFallbackEnabled,
      };

    const out = enginePayloadToAnalysisResult(payload);

    const ui = adaptAnalyzeV1ToUI(out as any);
      // EvidencePackage is optional and must never break /api/analyze-v1.
      // Build it ONLY from UI VM (VM-only) and swallow errors defensively.
      let evidencePackage: any = {
          version: "evidence_package.v0.1",
          sevenPrinciplesSpectrum: null,
        };
      try {
        const telemetryVm = buildTelemetryVmForEvidencePackage({
          word,
          mode: modeParsed ?? mode,
          out,
          heartInstrumentV1,
        });

        evidencePackage = buildEvidencePackageFromVM(telemetryVm as any, {
          ledgerModel: (ui as any)?.ledgerModel ?? undefined,
        });


        // Backfill: ensure sevenPrinciplesSpectrum is always present (null allowed)
        if ((evidencePackage as any)?.sevenPrinciplesSpectrum === undefined) {
          const tvm: any = telemetryVm as any;
          (evidencePackage as any).sevenPrinciplesSpectrum =
            tvm?.sevenPrinciplesSpectrum ??
            tvm?.readout?.sevenPrinciplesSpectrum ??
            null;
        }
      } catch (_e) {
          evidencePackage = {
            version: "evidence_package.v0.1",
            sevenPrinciplesSpectrum: null,
            signals: ["EVIDENCE_PACKAGE_BUILD_FAILED"],
          };
        }
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

      // Milestone B — auditable raw vs functional vowel paths (evidence-level truth)
//
// Semantics (v0.1.x):
// - evidence.surfaceVowels = authoritative detected/functional path (what the instrument uses)
// - evidence.surfaceVowelsRaw = true raw surface (heartInstrumentV1; may differ by layer)
// - evidence.vowelPath = functional path (duplicate for legacy readers)
// - normalizationSteps proves SHIFT when raw != functional
{
  const surfaceRaw = Array.isArray((heartInstrumentV1 as any)?.surfaceVowels)
    ? (heartInstrumentV1 as any).surfaceVowels
    : null;

  const functional = 
    Array.isArray((out as any)?.heart?.math7?.primary?.vowels)
      ? (out as any).heart.math7.primary.vowels
      : (Array.isArray((out as any)?.primaryPath?.voicePath) ? (out as any).primaryPath.voicePath : null);

  // Always emit vowelPath (null allowed)
  (evidence as any).vowelPath = functional ?? null;

  // Authoritative detected path for instrument UI/contract readers
  if (functional) (evidence as any).surfaceVowels = functional;

  // Preserve true raw surface separately (never overwrite detected)
  if (surfaceRaw) (evidence as any).surfaceVowelsRaw = surfaceRaw;

  const same = 
    Array.isArray(surfaceRaw) &&
    Array.isArray(functional) &&
    surfaceRaw.length === functional.length &&
    surfaceRaw.every((v: any, i: number) => String(v) === String(functional[i]));

  (evidence as any).normalizationSteps = 
    surfaceRaw && functional && !same
      ? [
          {
            op: "vowel_normalize",
            from: surfaceRaw.join(""),
            to: functional.join(""),
            reason: "functional_equivalence",
          },
        ]
      : [];
}



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

    if (final && typeof final === "object") (final as any).evidencePackage = evidencePackage;
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

  

    // Seed fallback flag (BRAIN-0.2)
    const seedFallbackEnabled =
      url.searchParams.get("seed") === "1" ||
      url.searchParams.get("seedBrainCandidates") === "1" ||
      url.searchParams.get("brainCandidatesSeedFallback") === "1";
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
      // Attach request-ish inputs so downstream (OriginClaim) can see seedFallbackEnabled.
      (payload as any).inputs = {
        word,
        mode: modeParsed ?? (mode as any) ?? "strict",
        alphabet: alphabet || "auto",
        brainCandidatesSeedFallback: seedFallbackEnabled,
      };

    const out = enginePayloadToAnalysisResult(payload);

    const ui = adaptAnalyzeV1ToUI(out as any);

    // EvidencePackage is optional and must never break /api/analyze-v1.
    // Build it ONLY from Telemetry VM (VM-only) and swallow errors defensively.
    let evidencePackage: any = {
      version: "evidence_package.v0.1",
      sevenPrinciplesSpectrum: null,
    };
    try {
      const telemetryVm = buildTelemetryVmForEvidencePackage({
        word,
        mode: modeParsed ?? mode,
        out,
        heartInstrumentV1,
      });

      evidencePackage = buildEvidencePackageFromVM(telemetryVm as any, {
        ledgerModel: (ui as any)?.ledgerModel ?? undefined,
      });

      // Backfill: ensure sevenPrinciplesSpectrum is always present (null allowed)
      if ((evidencePackage as any)?.sevenPrinciplesSpectrum === undefined) {
        const tvm: any = telemetryVm as any;
        (evidencePackage as any).sevenPrinciplesSpectrum =
          tvm?.sevenPrinciplesSpectrum ??
          tvm?.readout?.sevenPrinciplesSpectrum ??
          null;
      }

      // If adapter returns undefined/null/non-object, keep minimal object
      if (!evidencePackage || typeof evidencePackage !== "object") {
        evidencePackage = {
          version: "evidence_package.v0.1",
          sevenPrinciplesSpectrum: null,
          signals: ["EVIDENCE_PACKAGE_MALFORMED"],
        };
      }
    } catch (_e) {
      evidencePackage = {
        version: "evidence_package.v0.1",
        sevenPrinciplesSpectrum: null,
        signals: ["EVIDENCE_PACKAGE_BUILD_FAILED"],
      };
    }

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

      // Milestone B — auditable raw vs functional vowel paths (evidence-level truth)
//
// Semantics (v0.1.x):
// - evidence.surfaceVowels = authoritative detected/functional path (what the instrument uses)
// - evidence.surfaceVowelsRaw = true raw surface (heartInstrumentV1; may differ by layer)
// - evidence.vowelPath = functional path (duplicate for legacy readers)
// - normalizationSteps proves SHIFT when raw != functional
{
  const surfaceRaw = Array.isArray((heartInstrumentV1 as any)?.surfaceVowels)
    ? (heartInstrumentV1 as any).surfaceVowels
    : null;

  const functional = 
    Array.isArray((out as any)?.heart?.math7?.primary?.vowels)
      ? (out as any).heart.math7.primary.vowels
      : (Array.isArray((out as any)?.primaryPath?.voicePath) ? (out as any).primaryPath.voicePath : null);

  // Always emit vowelPath (null allowed)
  (evidence as any).vowelPath = functional ?? null;

  // Authoritative detected path for instrument UI/contract readers
  if (functional) (evidence as any).surfaceVowels = functional;

  // Preserve true raw surface separately (never overwrite detected)
  if (surfaceRaw) (evidence as any).surfaceVowelsRaw = surfaceRaw;

  const same = 
    Array.isArray(surfaceRaw) &&
    Array.isArray(functional) &&
    surfaceRaw.length === functional.length &&
    surfaceRaw.every((v: any, i: number) => String(v) === String(functional[i]));

  (evidence as any).normalizationSteps = 
    surfaceRaw && functional && !same
      ? [
          {
            op: "vowel_normalize",
            from: surfaceRaw.join(""),
            to: functional.join(""),
            reason: "functional_equivalence",
          },
        ]
      : [];
}



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

  // Mind derives from heart.math7.primary (single source of truth)
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

    if (final && typeof final === "object") (final as any).evidencePackage = evidencePackage;
    return NextResponse.json(final);
  } catch (err: any) {
    return NextResponse.json(
      { error: "analyze-v1 failed", details: String(err?.stack ?? err?.message ?? err) },
      { status: 500 }
    );
  }
}
