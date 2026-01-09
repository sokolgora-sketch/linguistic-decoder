"use client";

/**
 * UI contract adapter: raw analyze-v1 payload → TelemetryViewModel (VM).
 *
 * Rules:
 * - UI must consume ONLY the VM (no raw payload parsing in components).
 * - Keep adapters deterministic + defensive.
 * - PresentOrMissing prevents silent emptiness.
 */

import type {
  CandidateRowVM,
  DecompositionItemVM,
  MathTelemetryVM,
  PresentOrMissing,
  RejectionItemVM,
  TelemetryViewModel,
  Vowel,
} from "./types";

// ----------------------- small helpers -----------------------

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function asString(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}

function asBool(v: unknown): boolean | null {
  return typeof v === "boolean" ? v : null;
}

function asArray(v: unknown): unknown[] | null {
  return Array.isArray(v) ? v : null;
}

function asStringArray(v: unknown): string[] | null {
  const arr = asArray(v);
  if (!arr) return null;
  const out: string[] = [];
  for (const x of arr) out.push(String(x));
  return out;
}

export function present<T>(value: T): PresentOrMissing<T> {
  return { kind: "present", value };
}

export function missing<T>(missingState: "none" | "not_emitted", note?: string): PresentOrMissing<T> {
  return { kind: "missing", missing: missingState, note };
}

function presentBool(v: boolean): PresentOrMissing<boolean> {
  return present(v);
}

function countOrMissing(arr: unknown[] | null): PresentOrMissing<number> {
  if (!arr) return missing("not_emitted");
  return present(arr.length);
}

function presentStringArray(arr: unknown[] | null): PresentOrMissing<string[]> {
  if (!arr) return missing("not_emitted");
  return present(arr.map((v) => String(v)));
}

// ----------------------- vowel path helpers -----------------------

function normalizeMode(v: unknown): "strict" | "open" | null {
  const s = asString(v);
  if (s === "strict" || s === "open") return s;
  return null;
}

function normalizeVowelChar(s: string): Vowel | null {
  const t = s.trim().toUpperCase();
  if (t === "A" || t === "E" || t === "I" || t === "O" || t === "U" || t === "Y" || t === "Ë") return t as Vowel;
  return null;
}

function normalizeVowelPathArray(v: unknown): Vowel[] | null {
  const arr = asArray(v);
  if (!arr) return null;
  const out: Vowel[] = [];
  for (const x of arr) {
    const s = asString(x);
    if (!s) return null;
    const vv = normalizeVowelChar(s);
    if (!vv) return null;
    out.push(vv);
  }
  return out.length ? out : null;
}

function normalizeVowelPathString(v: unknown): Vowel[] | null {
  const s = asString(v);
  if (!s) return null;
  // Accept "U-I" or "U→I" or "UI"
  const parts = s.includes("-") ? s.split("-") : s.includes("→") ? s.split("→") : s.split("");
  const out: Vowel[] = [];
  for (const p of parts.map((t) => t.trim()).filter(Boolean)) {
    const vv = normalizeVowelChar(p);
    if (!vv) return null;
    out.push(vv);
  }
  return out.length ? out : null;
}

// ----------------------- voice path selection -----------------------

function pickVoicePaths(payload: any): { detected: string | null; surface: string | null; functional: string | null } {
  // detected (primary)
  const primaryPath = isRecord(payload?.primaryPath) ? payload.primaryPath : null;
  const detectedArr = primaryPath ? normalizeVowelPathArray(primaryPath["voicePath"]) : null;

  // surface/functional (optional)
  const detected = detectedArr ? detectedArr.join("-") : null;

  const surface =
    (normalizeVowelPathString(payload?.evidence?.surfaceVowels?.join?.("-"))?.join("-") ?? null) ??
    (normalizeVowelPathArray(payload?.evidence?.surfaceVowels)?.join("-") ?? null);

  const functional =
    (normalizeVowelPathString(payload?.deepRoot?.functionalRoots?.[0]?.vowelPath)?.join("-") ?? null) ??
    (normalizeVowelPathString(payload?.candidates?.[0]?.vowelPath)?.join("-") ?? null) ??
    null;

  return { detected, surface, functional };
}

function stableCandidateId(index: number, lang: string | null, form: string | null): string {
  return `cand_${index}_${(lang ?? "xx").toLowerCase()}_${(form ?? "form").toLowerCase()}`.replace(/[^a-z0-9_]/g, "_");
}

// ----------------------- adapter -----------------------

export function adaptAnalysisToTelemetryVM(raw: unknown): TelemetryViewModel {
  const payload = arguments[0] as any;

  const vp = pickVoicePaths(payload);

  // Accept unknown input, normalize to a dash-delimited string, then parse.
  // This avoids runtime crashes when upstream emits arrays or non-strings.
  const toVoiceParts = (v: unknown): Vowel[] | null => {
    if (!v) return null;

    // If we got ["U","I"] etc.
    if (Array.isArray(v)) {
      const parts = v.map((x) => (typeof x === "string" ? x : String(x))).map((t) => t.trim()).filter(Boolean);
      const out: Vowel[] = [];
      for (const p of parts) {
        const vv = normalizeVowelChar(p);
        if (!vv) return null;
        out.push(vv);
      }
      return out.length ? out : null;
    }

    // If we got "U-I" or "U→I" or "UI"
    if (typeof v !== "string") return null;
    const str = v;

    const parts = str.includes("-") ? str.split("-") : str.includes("→") ? str.split("→") : str.split("");
    const out: Vowel[] = [];
    for (const p of parts.map((t) => t.trim()).filter(Boolean)) {
      const vv = normalizeVowelChar(p);
      if (!vv) return null;
      out.push(vv);
    }
    return out.length ? out : null;
  };

  const detectedParts = toVoiceParts(vp.detected);
    // v0.1 contract: surface must represent RAW surface vowels (e.g. U-Y for 'study').
  // Prefer payload.heartInstrumentV1.surfaceVowels if present.
  const hiRoot = isRecord(payload) && isRecord((payload as any)["heartInstrumentV1"]) ? ((payload as any)["heartInstrumentV1"] as any) : null;
  const hiSurfaceArr = hiRoot ? asStringArray(hiRoot["surfaceVowels"]) : null;
  const surfaceForParts = hiSurfaceArr ? hiSurfaceArr.join("-") : vp.surface;
  const surfaceParts = toVoiceParts(surfaceForParts);
  const functionalParts = toVoiceParts(vp.functional);

  const voicePathDetectedMaybe: PresentOrMissing<Vowel[]> =
    detectedParts ? present(detectedParts) : missing<Vowel[]>("not_emitted");

  const voicePathSurfaceMaybe: PresentOrMissing<Vowel[]> =
    surfaceParts ? present(surfaceParts) : missing<Vowel[]>("not_emitted");

  const voicePathFunctionalMaybe: PresentOrMissing<Vowel[]> =
    functionalParts ? present(functionalParts) : missing<Vowel[]>("not_emitted");

  const voicePathDelta =
    vp.surface && vp.functional
      ? (vp.surface === vp.functional ? "MATCH" : "DIVERGE")
      : "NOT_EMITTED";

  const root = isRecord(raw) ? raw : {};
  const heart = isRecord(root["heart"]) ? root["heart"] : null;

  const word = asString(root["word"]) ?? "(missing word)";
  const sanitized = asString(root["sanitized"]);
  const engineVersion = asString(root["engineVersion"]);
  const mode = normalizeMode(root["mode"]) ?? (heart ? normalizeMode(heart["mode"]) : null);
  const alphabet = asString(root["alphabet"]) ?? (heart ? asString(heart["alphabet"]) : null);

  const meta = isRecord(root["meta"]) ? root["meta"] : null;
  const createdAt = meta ? asString(meta["created"]) : null;

  const heartPrinciplePath = heart ? (asStringArray(heart["principlePath"]) ?? null) : null;

  const heartMath7Primary =
    heart && isRecord((heart as any)["math7"]) && isRecord(((heart as any)["math7"] as any)["primary"])
      ? (((heart as any)["math7"] as any)["primary"] as Record<string, unknown>)
      : null;

  const math7PrinciplesPath = heartMath7Primary ? asStringArray(heartMath7Primary["principlesPath"]) : null;
  const principlesPath = heartPrinciplePath ?? math7PrinciplesPath;

  const primaryPath = isRecord(root["primaryPath"]) ? root["primaryPath"] : null;
  const detectedVoicePath =
    (primaryPath ? normalizeVowelPathArray(primaryPath["voicePath"]) : null) ??
    (heartMath7Primary ? normalizeVowelPathArray(heartMath7Primary["vowels"]) : null);

  const strictInputEmitted =
    (heart ? asBool((heart as any)["strictInput"]) : null) ??
    asBool((root as any)["strictInput"]);

  const strictInput: PresentOrMissing<boolean> =
    strictInputEmitted !== null
      ? presentBool(strictInputEmitted)
      : mode
        ? presentBool(mode === "strict")
        : missing("not_emitted", "Expected strictInput; derive requires mode");

  // Evidence ledger sources (root -> raw.evidence -> heart.evidence)
  const rootEvidence = isRecord(root["evidence"]) ? (root["evidence"] as Record<string, unknown>) : null;

  const rawEvidence =
    isRecord((root as any)["raw"]) && isRecord(((root as any)["raw"] as any)["evidence"])
      ? ((((root as any)["raw"] as any)["evidence"] as any) as Record<string, unknown>)
      : null;

  const heartEvidence =
    heart && isRecord((heart as any)["evidence"])
      ? (((heart as any)["evidence"] as any) as Record<string, unknown>)
      : null;

  const evidence = rootEvidence ?? rawEvidence ?? heartEvidence ?? null;

  const normalizationSteps =
    asArray(evidence?.["normalizationSteps"]) ??
    asArray(heartEvidence?.["normalizationSteps"]) ??
    null;

  const ops =
    asArray(evidence?.["ops"]) ??
    asArray((root as any)["ops"]) ??
    asArray(heartEvidence?.["ops"]) ??
    null;

  const notes =
    asArray(evidence?.["notes"]) ??
    asArray((root as any)["notes"]) ??
    asArray(heartEvidence?.["notes"]) ??
    null;

  const signals =
    asArray(evidence?.["signals"]) ??
    asArray((root as any)["signals"]) ??
    asArray(heartEvidence?.["signals"]) ??
    null;

  // Candidates
  const candRaw = Array.isArray(root["candidates"]) ? root["candidates"] : null;
  const candidates: CandidateRowVM[] = [];

  if (candRaw) {
    candRaw.forEach((c, i) => {
      const rec = isRecord(c) ? c : {};
      const lang = asString(rec["language"]);
      const form = asString(rec["form"]);
      const id = asString(rec["id"]) ?? stableCandidateId(i, lang, form);

      const functionalStatement =
        asString(rec["functionalStatement"]) ??
        asString(rec["function"]) ??
        null;

      const candVowelPath =
        normalizeVowelPathString(rec["vowelPath"]) ??
        normalizeVowelPathArray(rec["voicePath"]) ??
        null;

      // v0.1.1: populate per-candidate lists when present (no heuristics).
      const candOps = asArray(rec["ops"]);
      const candNotes = asArray(rec["notes"]) ?? asArray(rec["note"]) ?? null; // note may be string; handled by presentStringArray via String()
      const candSignals = asArray(rec["signals"]);

      candidates.push({
        index: i,
        id,
        language: lang ? present(lang) : missing("not_emitted"),
        form: form ? present(form) : missing("not_emitted"),
        functionalStatement: functionalStatement ? present(functionalStatement) : missing("not_emitted"),
        vowelPath: candVowelPath ? present(candVowelPath) : missing("not_emitted"),

        // leave decomposition for later (shape varies too much right now)
        decomposition: missing("not_emitted") as PresentOrMissing<DecompositionItemVM[]>,

        ops: candOps ? presentStringArray(candOps) : missing("not_emitted"),
        notes: candNotes ? presentStringArray(candNotes) : missing("not_emitted"),
        signals: candSignals ? presentStringArray(candSignals) : missing("not_emitted"),

        raw: c,
      });
    });
  }

  let math: PresentOrMissing<MathTelemetryVM> = missing("not_emitted");
  if (heartMath7Primary) {
    math = present({
      L: missing("not_emitted"),
      verdict: missing("not_emitted"),
      OI: missing("not_emitted"),
      light: missing("not_emitted"),
      shadow: missing("not_emitted"),
      bridge: missing("not_emitted"),
      ringSummary: missing("not_emitted"),
      levelSummary: missing("not_emitted"),
      raw: heartMath7Primary,
    });
  }

  const rejectionItems: PresentOrMissing<RejectionItemVM[]> = missing("not_emitted");

  const status: "detected" | "none" | "error" =
    detectedVoicePath && detectedVoicePath.length ? "detected" : "none";

  const oc = isRecord(payload.originClaim) ? payload.originClaim : null;

  const reasonCounts: Record<string, number> = {};
  if (oc && Array.isArray(oc.candidates)) {
    for (const c of (oc.candidates as any[])) {
        if (isRecord(c) && Array.isArray(c.reasonCodes)) {
            for (const code of (c.reasonCodes as any[])) {
                const codeStr = String(code);
                reasonCounts[codeStr] = (reasonCounts[codeStr] ?? 0) + 1;
            }
        }
    }
  }

  const gatesActive = (oc && isRecord(oc.policy) && oc.policy.gatesActive === true) || (oc && oc.policy === "gates-v1.1");

  const originClaimGates = {
    active: gatesActive,
    flag: "ocg" as const,
    candidateCount: (oc && Array.isArray(oc.candidates)) ? oc.candidates.length : 0,
    reasonCounts,
  };

  return {
    readout: {
      voicePath: voicePathDetectedMaybe,
      voicePathSurface: voicePathSurfaceMaybe,
      voicePathFunctional: voicePathFunctionalMaybe,
      voicePathDelta,

      word,
      normalizedWord: sanitized ? present(sanitized) : missing("not_emitted", "sanitized"),
      mode: mode ? present(mode) : missing("not_emitted", "mode"),
      strictInput,
      engineVersion: engineVersion ? present(engineVersion) : missing("not_emitted", "engineVersion"),
      alphabet: alphabet ? present(alphabet) : missing("not_emitted", "alphabet"),
      createdAt: createdAt ? present(createdAt) : missing("not_emitted", "meta.created"),
      principlesPath: principlesPath
        ? present(principlesPath)
        : missing("not_emitted", "heart.principlePath | heart.math7.primary.principlesPath"),
      status,
      counts: {
        candidates: candidates.length,
        ops: countOrMissing(ops),
        notes: countOrMissing(notes),
        signals: countOrMissing(signals),
        rejections: missing("not_emitted"),
      },
    },

    evidence: {
      normalizationSteps: presentStringArray(normalizationSteps),
      ops: presentStringArray(ops),
      notes: presentStringArray(notes),
      signals: presentStringArray(signals),
    },

    candidates,
    math,
    rejections: { items: rejectionItems },
    originClaimGates,
    raw,
  };
}
