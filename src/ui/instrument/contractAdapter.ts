import type {
  CandidateRowVM,
  DecompositionItemVM,
  MissingState,
  Mode,
  PresentOrMissing,
  RejectionItemVM,
  TelemetryViewModel,
  Vowel,
  MathTelemetryVM,
} from "./types";
import { pickVoicePaths } from "./voicePathPicker";

function present<T>(value: T): PresentOrMissing<T> {
  return { kind: "present", value };
}
function presentBool(value: boolean): PresentOrMissing<boolean> {
  return { kind: "present", value };
}

function missing<T>(missing: MissingState, note?: string): PresentOrMissing<T> {
  return { kind: "missing", missing, note };
}
function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}
function asString(x: unknown): string | null {
  return typeof x === "string" ? x : null;
}
function asBool(x: unknown): boolean | null {
  return typeof x === "boolean" ? x : null;
}
function asStringArray(x: unknown): string[] | null {
  return Array.isArray(x) && x.every((v) => typeof v === "string") ? x : null;
}

function asArray(x: unknown): unknown[] | null {
  return Array.isArray(x) ? x : null;
}
function countOrMissing(arr: unknown[] | null): PresentOrMissing<number> {
  return arr ? present(arr.length) : missing("not_emitted");
}
function normalizeMode(x: unknown): Mode | null {
  const s = asString(x);
  return s === "strict" || s === "open" ? (s as Mode) : null;
}
function normalizeVowelChar(ch: string): Vowel | null {
  const up = ch.toUpperCase();
  if (up === "A" || up === "E" || up === "I" || up === "O" || up === "U" || up === "Y" || up === "Ë") {
    return up as Vowel;
  }
  if (ch === "ë") return "Ë";
  return null;
}
function normalizeVowelPathArray(x: unknown): Vowel[] | null {
  if (!Array.isArray(x)) return null;
  const out: Vowel[] = [];
  for (const v of x) {
    const s = asString(v);
    if (!s) return null;
    const vv = normalizeVowelChar(s);
    if (!vv) return null;
    out.push(vv);
  }
  return out.length ? out : null;
}
function normalizeVowelPathString(x: unknown): Vowel[] | null {
  const s = asString(x);
  if (!s) return null;
  const parts = s.includes("-") ? s.split("-") : s.includes("→") ? s.split("→") : s.split("");
  const out: Vowel[] = [];
  for (const p of parts.map((t) => t.trim()).filter(Boolean)) {
    const vv = normalizeVowelChar(p);
    if (!vv) return null;
    out.push(vv);
  }
  return out.length ? out : null;
}

function stableCandidateId(index: number, lang: string | null, form: string | null): string {
  return `cand_${index}_${(lang ?? "xx").toLowerCase()}_${(form ?? "form").toLowerCase()}`.replace(/[^a-z0-9_]/g, "_");
}

export function adaptAnalysisToTelemetryVM(raw: unknown): TelemetryViewModel {
  const payload = arguments[0] as any;

  const vp = pickVoicePaths(payload);

  const voicePathDetectedNormalized = vp.detected;
  const voicePathSurfaceNormalized  = vp.surface;
  const voicePathFunctionalNormalized = vp.functional;

  // Convert "U-I" into typed vowels (Vowel[]) or null if invalid.
  const toVoiceParts = (s: string | null): Vowel[] | null => {
    if (!s) return null;
    const parts = s.split("-").map((t) => t.trim()).filter(Boolean);
    const out: Vowel[] = [];
    for (const p of parts) {
      const vv = normalizeVowelChar(p);
      if (!vv) return null;
      out.push(vv);
    }
    return out.length ? out : null;
  };

  const detectedParts = toVoiceParts(voicePathDetectedNormalized);
  const surfaceParts = toVoiceParts(voicePathSurfaceNormalized);
  const functionalParts = toVoiceParts(voicePathFunctionalNormalized);

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
    const voicePath =
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

      candidates.push({
        index: i,
        id,
        language: lang ? present(lang) : missing("not_emitted"),
        form: form ? present(form) : missing("not_emitted"),
        functionalStatement: functionalStatement ? present(functionalStatement) : missing("not_emitted"),
        vowelPath: candVowelPath ? present(candVowelPath) : missing("not_emitted"),
        decomposition: missing("not_emitted") as PresentOrMissing<DecompositionItemVM[]>,
        ops: missing("not_emitted"),
        notes: missing("not_emitted"),
        signals: missing("not_emitted"),
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
    voicePath && voicePath.length ? "detected" : "none";

  const rootEvidence = isRecord(root["evidence"])
  ? (root["evidence"] as Record<string, unknown>)
  : null;

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
      principlesPath: principlesPath ? present(principlesPath) : missing("not_emitted", "heart.principlePath | heart.math7.primary.principlesPath"),
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
    raw,
  };
}

// --- v0.1.1: Evidence Ledger VM population ----------------------------

function presentStringArray(arr: unknown[] | null): PresentOrMissing<string[]> {
  if (!arr) return missing("not_emitted");
  return present(arr.map((v) => String(v)));
}
