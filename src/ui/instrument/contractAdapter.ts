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
  OriginClaimGatesVM,
  PresentOrMissing,
  RejectionItemVM,
  TelemetryViewModel,
  RootMapVM,
  Vowel,
} from "../telemetry/types";
import type { RootMapV1 } from "@/shared/deepRoot.rootMap.v1";
import { computeDeepRootHeartGateV01 } from "@/shared/deepRootHeartGate.v0.1.compute";

type ParseRootMapResult = { ok: true; value: RootMapV1 } | { ok: false; reason: string };

function parseRootMapV1(v: unknown): ParseRootMapResult {
  if (!isRecord(v)) return { ok: false, reason: "rootMap expected object" };

  const tokens = (v as any).tokens;
  const keys = (v as any).keys;
  const composedMeaning = (v as any).composedMeaning;

  if (!Array.isArray(tokens)) return { ok: false, reason: "rootMap.tokens expected array" };
  if (!Array.isArray(keys)) return { ok: false, reason: "rootMap.keys expected array" };
  if (typeof composedMeaning !== "string") return { ok: false, reason: "rootMap.composedMeaning expected string" };

  // tokens: [{ token: string, role?: string, vowel_path?: string }]
  for (const t of tokens) {
    if (!isRecord(t)) return { ok: false, reason: "rootMap.tokens item expected object" };
    if (typeof (t as any).token !== "string") return { ok: false, reason: "rootMap.tokens[].token expected string" };
    if ("role" in t && (t as any).role != null && typeof (t as any).role !== "string")
      return { ok: false, reason: "rootMap.tokens[].role expected string" };
    if ("vowel_path" in t && (t as any).vowel_path != null && typeof (t as any).vowel_path !== "string")
      return { ok: false, reason: "rootMap.tokens[].vowel_path expected string" };
  }

  // keys: [{ token, language, gloss, evidence[], status, ops?[] }]
  for (const k of keys) {
    if (!isRecord(k)) return { ok: false, reason: "rootMap.keys item expected object" };
    if (typeof (k as any).token !== "string") return { ok: false, reason: "rootMap.keys[].token expected string" };
    if (typeof (k as any).language !== "string") return { ok: false, reason: "rootMap.keys[].language expected string" };
    if (typeof (k as any).gloss !== "string") return { ok: false, reason: "rootMap.keys[].gloss expected string" };
    if (!Array.isArray((k as any).evidence) || !(k as any).evidence.every((x: any) => typeof x === "string"))
      return { ok: false, reason: "rootMap.keys[].evidence expected string[]" };
    if (typeof (k as any).status !== "string") return { ok: false, reason: "rootMap.keys[].status expected string" };
    if ("ops" in k && (k as any).ops != null) {
      if (!Array.isArray((k as any).ops) || !(k as any).ops.every((x: any) => typeof x === "string"))
        return { ok: false, reason: "rootMap.keys[].ops expected string[]" };
    }
  }

  // carriers?: [{ token, language, carrierForm, note? }]
  const carriers = (v as any).carriers;
  if (carriers != null) {
    if (!Array.isArray(carriers)) return { ok: false, reason: "rootMap.carriers expected array" };
    for (const c of carriers) {
      if (!isRecord(c)) return { ok: false, reason: "rootMap.carriers item expected object" };
      if (typeof (c as any).token !== "string") return { ok: false, reason: "rootMap.carriers[].token expected string" };
      if (typeof (c as any).language !== "string") return { ok: false, reason: "rootMap.carriers[].language expected string" };
      if (typeof (c as any).carrierForm !== "string")
        return { ok: false, reason: "rootMap.carriers[].carrierForm expected string" };
      if ("note" in c && (c as any).note != null && typeof (c as any).note !== "string")
        return { ok: false, reason: "rootMap.carriers[].note expected string" };
    }
  }

  // notes?: string[]
  const notes = (v as any).notes;
  if (notes != null) {
    if (!Array.isArray(notes) || !notes.every((x: any) => typeof x === "string"))
      return { ok: false, reason: "rootMap.notes expected string[]" };
  }

  return { ok: true, value: v as RootMapV1 };
}

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

export function missing<T>(
  missingState: "none" | "not_emitted" | "malformed" | "unknown",
  note?: string
): PresentOrMissing<T> {
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

  // DeepRoot–Heart Alignment Gate v0.1 (adapter-first): use the detected primary path string.
  const heartPrimaryPathForGate: string | null = vp.detected ?? null;


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
    // v0.1 contract: surface must represent RAW surface vowels (e.g. U-Y for \'study\').
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
  // Delta must be computed from the SAME sources the UI renders:
  // - surfaceParts uses heartInstrumentV1.surfaceVowels when present
  // - functionalParts uses deepRoot/candidate fallbacks
  const surfaceNorm = surfaceParts ? surfaceParts.join("-") : null;
  const functionalNorm = functionalParts ? functionalParts.join("-") : null;

  const voicePathDelta =
    surfaceNorm && functionalNorm
      ? (surfaceNorm === functionalNorm ? "MATCH" : "DIVERGE")
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

          deepRootHeartGate: present(
            computeDeepRootHeartGateV01({
              heartPrimaryPath: heartPrimaryPathForGate,
              candidateResolvedPath: candVowelPath ? candVowelPath.join("-") : null,
              evidenceRefs: [
                "primaryPath.voicePath",
                // Candidate-local anchor (string only; UI treats as reference label)
                `candidates[${i}].vowelPath`,
              ],
            })
          ),

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

  const p = isRecord(payload) ? payload : null;
  const oc = p && isRecord(p.originClaim) ? p.originClaim : null;

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

  const originClaimGates: OriginClaimGatesVM = {
    active: (() => {
      // VM-only: NEVER override with dev flags / URL params.
      const a = (raw as any)?.originClaimGates?.active;
      if (typeof a === "boolean") return a;

      // Fallback: derive from OriginClaim policy gates indicator.
      return !!gatesActive;
    })(),
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
      normalizationSteps: pomStringListFromEvidenceField(evidence, "normalizationSteps"),
      ops: pomStringListFromEvidenceField(evidence, "ops"),
      notes: pomStringListFromEvidenceField(evidence, "notes"),
      signals: pomStringListFromEvidenceField(evidence, "signals"),
    },

    candidates,
    math,
    rejections: { items: rejectionItems },
    originClaimGates,

    rootMap: (() => {
      if (!isRecord(payload)) return missing("not_emitted", "rootMap");
      if (!("rootMap" in payload)) return missing("not_emitted", "rootMap");

      const v = (payload as any).rootMap;
      if (v == null) return missing("not_emitted", "rootMap");

      const parsed = parseRootMapV1(v);
      if (parsed.ok === false) return missing("malformed", parsed.reason);

      return present(parsed.value);
    })(),

    raw,
  };
}

// ----------------------- malformed-aware array extraction -----------------------

function pomStringListFromEvidenceField(
  parent: Record<string, unknown> | null,
  key: string
): PresentOrMissing<string[]> {
  if (!parent) return missing("not_emitted", `evidence.${key}`);

  // distinguish absent vs present-but-wrong-type
  if (!(key in parent)) return missing("not_emitted", `evidence.${key}`);

  const v = (parent as any)[key];

  if (v == null) return missing("not_emitted", `evidence.${key}`);

  if (!Array.isArray(v)) return missing("malformed", `evidence.${key} expected array`);

  // present (including empty => MeaningPanel will show "none")
  return present(v.map((x) => String(x)));
}
